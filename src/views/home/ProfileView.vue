<template>
  <el-container>
    <el-aside>
      <el-form label-width="80px">
        <el-form-item label="头像">
          <img v-if="!isEditing" :src="displayUserInfo.avatar" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%;">
          <el-upload
            v-else
            class="avatar-uploader"
            action="/api/user/avatar"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="displayUserInfo.avatar" :src="displayUserInfo.avatar" class="avatar" style="width: 100px; height: 100px; border-radius: 50%;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称">
          <span v-if="!isEditing">{{ displayUserInfo.name }}</span>
          <el-input v-else v-model="displayUserInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <span v-if="!isEditing">{{ displayUserInfo.email }}</span>
          <el-input v-else v-model="displayUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <span v-if="!isEditing">{{ displayUserInfo.sex  === 1 ? '男' : displayUserInfo.sex === 2 ? '女' : '未设置' }}</span>
          <el-radio-group v-else v-model="displayUserInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话">
          <span v-if="!isEditing">{{ displayUserInfo.phone || '未设置' }}</span>
          <el-input v-else v-model="displayUserInfo.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!isEditing" type="primary" @click="switchEdit">编辑</el-button>
          <el-button v-else type="primary" @click="saveChanges">保存</el-button>
          <el-button v-if="isEditing" @click="switchShow">取消</el-button>
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main class="space-main">
      <div class="space-container">
        <SpaceCard
            v-for="space in spaceItems"
            :key="space.id"
            :space="space"
          ></SpaceCard>
      </div>
      <el-pagination
        background
        :current-page="page"
        :page-size="pageSize"
        :page-count="pageCount"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="sizes, prev, pager, next"
      ></el-pagination>
    </el-main>
  </el-container>
</template>

<script>
import request from '@/utils/request'
import { mapState, mapActions } from 'vuex'
import SpaceCard from '@/components/SpaceCard'
export default {
  components: { SpaceCard },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      isEditing: false,
      displayUserInfo: {},
      page: 1,
      pageSize: 10,
      pageCount: 1,
      spaceItems: []
    }
  },
  watch: {
    userInfo: {
      handler (newVal) {
        this.displayUserInfo = { ...newVal } // 拷贝Vuex中的用户信息到本地展示信息
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    saveChanges: async function () {
      await this.updateUserInfo(this.displayUserInfo) // 保存时使用本地展示信息更新Vuex
      this.displayUserInfo = { ...this.userInfo }
      this.isEditing = false
    },
    fetchSpaceItems: async function () {
      await request
        .get('/studySpace/page', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            createUser: this.userInfo.id
          }
        })
        .then((res) => {
          this.spaceItems = res.data.record
          this.pageCount = res.data.count
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    switchEdit () {
      // 使用 JSON.parse(JSON.stringify()) 实现深拷贝
      this.infoCache = JSON.parse(JSON.stringify(this.displayUserInfo))
      this.isEditing = true
    },
    switchShow () {
      // 恢复深拷贝的数据
      this.displayUserInfo = JSON.parse(JSON.stringify(this.infoCache))
      this.isEditing = false
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess (res) {
      this.displayUserInfo.avatar = res.data.url
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.fetchSpaceItems()
    },
    handlePageChange (newPage) {
      this.page = newPage
      this.fetchSpaceItems()
    }
  },
  created () {
    this.fetchSpaceItems()
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  padding: 30px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.space-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.space-container {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}
</style>
