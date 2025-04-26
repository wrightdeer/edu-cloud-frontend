<template>
  <el-container class="container">
    <el-button
      icon="el-icon-back"
      circle
      type="info"
      class="back-btn"
      size="small"
      @click="$router.back()"
    ></el-button>
    <!-- 动态渲染图片或文档 -->
    <div v-if="mode === 'image'">
      <img :src="cloudUrl" alt="Preview" class="preview-image" />
    </div>
    <div v-else-if="mode === 'txt'">
      <pre class="preview-document">{{fileContent}}</pre>
    </div>
  </el-container>
</template>
<script>
import request from '@/utils/request'
import axios from 'axios'
export default {
  data () {
    return {
      fileId: null,
      cloudUrl: null,
      mode: null,
      fileContent: null
    }
  },
  methods: {
    async fetchFileUrl () {
      request.get('/file/' + this.fileId).then((res) => {
        if (this.mode === 'txt') {
          this.cloudUrl = '/oss' + res.data.cloudUrl
          this.fetchFile()
        } else if (this.mode === 'image') {
          this.cloudUrl = 'https://web-lyt-tlias.oss-cn-beijing.aliyuncs.com/' + res.data.cloudUrl
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    async fetchFile () {
      axios.get(this.cloudUrl).then((res) => {
        this.fileContent = res.data
      })
    }
  },
  async created () {
    this.fileId = this.$route.params.fileId
    this.mode = this.$route.query.mode
    await this.fetchFileUrl()
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative; /* 添加定位 */
  overflow: hidden; /* 防止内容溢出 */
}

.back-btn {
  position: absolute; /* 悬浮定位 */
  top: 20px;
  right: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.preview-document {
  width: 100%;
  height: 100%;
  border: none;
  overflow: auto; /* 允许滚动 */
}
</style>
