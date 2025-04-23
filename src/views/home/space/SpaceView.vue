<template>
  <el-container>
    <el-aside width="300px">
      <div class="back-btn">
        <span
          v-if="resolvedOriginRoute"
          @click="handBack"
          :disable="!resolvedOriginRoute"
        >
        <i class="el-icon-back"></i>
        </span>
      </div>
      <el-form label-width="80px">
        <el-form-item label="空间名称">
          <span v-if="!isEditing">{{ space.name }}</span>
          <el-input v-else v-model="space.name"></el-input>
        </el-form-item>
        <el-form-item label="科目">
          <span v-if="!isEditing">{{ subjectName }}</span>
          <el-select v-else v-model="space.subjectId" placeholder="请选择科目">
            <el-option
              v-for="item in subjects"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="space.tags.length !== 0 && !isEditing" label="标签">
          <div>
            <el-tag
              v-for="tag in space.tags"
              :key="tag"
              :type="getTagsType(tag)"
              style="margin-right: 5px"
              >{{ getTagsName(tag) }}</el-tag
            >
          </div>
        </el-form-item>
        <el-form-item v-if="space.createUser !== userInfo.id" label="创建者">
          <span>{{ space.createUserName }}</span>
        </el-form-item>
        <el-form-item label="权限">
          <span v-if="!isEditing">{{
            space.isPublic === 1 ? "公开" : "私有"
          }}</span>
          <el-switch
            v-else
            :value="space.isPublic === 1"
            @change="(value) => (space.isPublic = value ? 1 : 0)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="公开"
            inactive-text="私有"
          ></el-switch>
        </el-form-item>
        <el-form-item label="描述">
          <el-tooltip
            v-if="!isEditing"
            :content="space.description"
            placement="top"
            :disabled="!isDescriptionOver"
          >
            <span
              class="description-box"
              :class="{ 'description-box-over': isDescriptionOver }"
            >
              {{ space.description }}
            </span>
          </el-tooltip>
          <el-input
            v-else
            v-model="space.description"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建于" v-if="!isEditing">
          <span>{{ createTime }}</span>
        </el-form-item>
        <el-form-item label="更新于" v-if="!isEditing">
          <span>{{ updateTime }}</span>
        </el-form-item>
        <el-form-item v-if="space.createUser === userInfo.id">
          <el-button
            v-if="!isEditing"
            type="info"
            size="small"
            @click="switchEdit"
            plain
            >编辑</el-button
          >
          <el-button
            v-if="isEditing"
            type="success"
            size="small"
            @click="saveChanges"
            plain
            >保存</el-button
          >
          <el-button
            v-if="isEditing"
            type="danger"
            size="small"
            @click="switchShow"
            plain
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import request from '@/utils/request'
import { formattedTime } from '@/utils/calcTime'
export default {
  data () {
    return {
      folderId: this.$route.params.folderId,
      isEditing: false,
      subjects: [],
      space: {}
    }
  },
  methods: {

    fetchSubjects: async function () {
      await request
        .get('/subject/list')
        .then((res) => {
          this.subjects = res.data
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    fetchSpace: async function () {
      await request
        .get(`/studySpace/${this.$route.params.spaceId}`)
        .then((res) => {
          this.space = res.data
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    getTagsName (tag) {
      return this.tagDictionary.find((tagItem) => tagItem.code === tag).name
    },
    getTagsType (tag) {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      return types[tag % types.length]
    },
    switchEdit () {
      // 使用 JSON.parse(JSON.stringify()) 实现深拷贝
      this.infoCache = JSON.parse(JSON.stringify(this.space))
      this.isEditing = true
    },
    switchShow () {
      // 恢复深拷贝的数据
      this.space = JSON.parse(JSON.stringify(this.infoCache))
      this.isEditing = false
    },
    saveChanges () {
      request
        .put('/studySpace/' + this.space.id, {
          name: this.space.name,
          subjectId: this.space.subjectId,
          isPublic: this.space.isPublic,
          description: this.space.description
        })
        .then((response) => {
          this.$message.success('修改成功')
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
      this.isEditing = false
    },
    goto (id) {
      if (this.folderId !== id) {
        this.popUntil(id)
        this.$router.push({
          name: 'folderList',
          params: {
            folderId: this.folderId
          }
        })
      }
    },
    handBack () {
      console.log(this.resolvedOriginRoute)
      if (this.resolvedOriginRoute) {
        if (this.resolvedOriginRoute.name) {
          this.$router.replace({
            name: this.resolvedOriginRoute.name,
            params: this.resolvedOriginRoute.params,
            query: this.resolvedOriginRoute.query
          })
        } else if (this.resolvedOriginRoute.fullPath) {
          this.$router.replace(this.resolvedOriginRoute.fullPath)
        } else {
          this.$router.push('/')
        }
        this.$store.commit('removeOriginRoute')
      } else {
        this.$router.go(-1)
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'tagDictionary']),
    ...mapGetters(['resolvedOriginRoute']),
    subjectName () {
      return this.subjects.find((item) => item.id === this.space.subjectId)
        ?.name
    },
    isDescriptionOver () {
      return this.space.description.length > 30
    },
    createTime () {
      return formattedTime(this.space.createTime)
    },
    updateTime () {
      return formattedTime(this.space.updateTime)
    }
  },
  created: async function () {
    this.fetchSubjects()
    await this.fetchSpace()
    if (this.$route.meta.title === '空间详情') {
      this.folderId = this.space.rootFolderId

      this.$router.push({
        name: 'FolderList',
        params: {
          folderId: this.folderId
        }
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.back-btn {
  display: flex;
  justify-content: start;
  width: 100%;
}

.el-aside {
  height: 100%;
  background-color: #d3dce6;
  color: #333;
  font-weight: bold;
  text-align: center;
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: start; /* 内容垂直居中 */
  align-items: center; /* 内容水平居中 */
  padding: 30px; /* 添加内边距 */
}
::v-deep .el-form-item {
  margin-bottom: 8px;
}
.description-box {
  min-height: 50px;
  text-align: center;
  font-weight: normal;
  line-height: 20px;
}
.description-box-over {
  display: -webkit-box; /* 关键：启用弹性盒子布局 */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  -webkit-line-clamp: 3; /* 限制最大行数 */
  overflow: hidden; /* 隐藏超出内容 */
}
</style>
