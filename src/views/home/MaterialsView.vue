<template>
  <el-container>
    <el-aside>
      <h1>筛选条件</h1>

      <div class="search-bar">
        <span class="bar-title">名字：</span>
        <el-input
          v-model="name"
          placeholder="请输入名字"
          @change="handleSearch"
        ></el-input>
      </div>
      <div class="subject-bar">
        <span class="bar-title">科目:</span>
        <el-radio-group
          v-model="selectSubjectId"
          @change="handleSearch"
          class="filter-bar-radio"
        >
          <el-radio
            v-for="subject in subjects"
            :key="subject.id"
            :label="subject.id"
            >{{ subject.name }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="tag-bar">
        <span class="bar-title">标签</span>
        <div class="tag-container">
          <el-tag
            v-for="tag in displayedTags"
            :key="tag.code"
            :type="tag.type"
            closable
            @close="removeTag(tag.code)"
            >{{ tag.name }}</el-tag
          >
        </div>
        <div class="tag-footer">
          <el-select
            v-model="selectedTagCode"
            placeholder="选择标签"
            size="mini"
            style="width: 100px; height: 30px"
          >
            <el-option
              v-for="tag in availableTagsOptions"
              :key="tag.code"
              :label="tag.name"
              :value="tag.code"
            ></el-option>
          </el-select>
          <el-button
            @click="addTag"
            size="mini"
            style="width: 50px; height: 30px"
            >添加</el-button
          >
        </div>
      </div>
      <div class="search-submit">
        <el-button type="primary" @click="updateTagsInUrl">
          <i class="el-icon-search"></i>
          搜索</el-button
        >
      </div>
    </el-aside>
    <el-main class="Materials-main">
      <div>
        <div class="head-bar">
          <el-tag
            class="creator-tag"
            style="width: 100%"
            type="warning"
            v-if="this.createUserName"
            closable
            @close="creatorTagClose"
            >正在浏览{{ this.createUserName }}的学习资料</el-tag
          >
          <div class="insert-bar">
            <el-button
              type="success"
              size="small"
              icon="el-icon-plus"
              @click="showInsertDialog"
              >新增</el-button
            >
          </div>
        </div>

        <el-empty
          v-if="spaceItems.length === 0"
          description="这里空空如也"
        ></el-empty>
        <div class="space-items">
          <SpaceCard
            v-for="space in spaceItems"
            :key="space.id"
            :space="space"
            @handCreatorClick="handCreatorClick"
          ></SpaceCard>
        </div>
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
    <!-- 新增对话框 -->
    <el-dialog
      title="新增学习资料空间"
      :visible.sync="insertDialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form
        :model="insertForm"
        :rules="insertRules"
        ref="insertFormRef"
        label-width="100px"
      >
        <el-form-item label="空间名" prop="name">
          <el-input
            v-model="insertForm.name"
            placeholder="请输入空间名"
          ></el-input>
        </el-form-item>
        <el-form-item label="科目" prop="subjectId">
          <el-select
            v-model="insertForm.subjectId"
            placeholder="请选择科目"
            style="width: 100%"
          >
            <el-option
              v-for="subject in subjects"
              :key="subject.id"
              :label="subject.name"
              :value="subject.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否公开" prop="isPublic">
          <el-radio-group v-model="insertForm.isPublic">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="0">私有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            type="textarea"
            v-model="insertForm.description"
            placeholder="请输入描述信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="insertDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitInsertForm">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import request from '@/utils/request'
import SpaceCard from '@/components/SpaceCard.vue'
import { mapState } from 'vuex'
export default {
  components: {
    SpaceCard
  },
  data () {
    return {
      name: this.$route.query.name || '',
      createUser: this.$route.query.createUser || '',
      selectSubjectId: this.$route.query.subject || '',
      displayedTagsCodes: this.$route.query.tags
        ? this.$route.query.tags.split(',').map((code) => parseInt(code))
        : [],
      selectedTagCode: '',
      subjects: [], // 假数据

      page: parseInt(this.$route.query.page) || 1,
      pageSize: parseInt(this.$route.query.pageSize) || 10,
      pageCount: 1,
      spaceItems: [],
      insertDialogVisible: false, // 控制对话框显示
      insertForm: {
        name: '',
        subjectId: '',
        isPublic: 0,
        description: ''
      },
      insertRules: {
        name: [{ required: true, message: '请输入空间名', trigger: 'blur' }],
        subjectId: [
          { required: true, message: '请选择科目', trigger: 'change' }
        ]
      },
      createUserName: ''
    }
  },
  computed: {
    ...mapState(['tagDictionary']),
    displayedTags () {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      return this.displayedTagsCodes.map((code, index) => {
        const tag = this.tagDictionary.find((tag) => tag.code === code)
        return {
          ...tag,
          type: types[tag.code % types.length]
        }
      })
    },
    availableTagsCodes () {
      const allCodes = Array.from({ length: 15 }, (_, i) => i)
      return allCodes.filter((code) => !this.displayedTagsCodes.includes(code))
    },
    availableTagsOptions () {
      return this.availableTagsCodes.map((code) =>
        this.tagDictionary.find((tag) => tag.code === code)
      )
    }
  },
  created () {
    this.fetchSpaces()
    this.fetchSubjects()
  },
  mounted () {},
  methods: {
    fetchSpaces: async function () {
      await request
        .get('/studySpace/page', {
          params: {
            page: this.page,
            pageSize: this.pageSize,
            name: this.name,
            createUser: this.createUser,
            subjectId: this.selectSubjectId,
            tags: this.displayedTagsCodes.join(',')
          }
        })
        .then((res) => {
          this.spaceItems = res.data.record
          this.pageCount = res.data.count
          if (this.createUser && this.createUser !== '') {
            this.createUserName = res.data.createUserName
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
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
    handleSearch () {
      this.updateRoute()
    },
    handCreatorClick (createUser, createUserName) {
      this.createUser = createUser
      this.createUserName = createUserName
      this.updateRoute()
    },
    removeCreateUser () {
      this.createUser = ''
      this.updateRoute()
    },
    removeTag (tagCode) {
      this.displayedTagsCodes = this.displayedTagsCodes.filter(
        (code) => code !== tagCode
      )
      this.selectedTagCode = ''
    },
    addTag () {
      if (this.selectedTagCode !== '') {
        this.displayedTagsCodes.push(parseInt(this.selectedTagCode))
        this.selectedTagCode = ''
      }
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.updateRoute()
    },
    handlePageChange (newPage) {
      this.page = newPage
      this.updateRoute()
    },
    creatorTagClose () {
      this.createUser = ''
      this.createUserName = ''
      this.updateRoute()
    },
    updateRoute () {
      const currentQuery = this.$route.query
      const newQuery = {}

      // 检查并添加非空参数
      if (this.page) newQuery.page = this.page
      if (this.pageSize) newQuery.pageSize = this.pageSize
      if (this.name) newQuery.name = this.name
      if (this.selectSubjectId) newQuery.subject = this.selectSubjectId
      if (this.createUser) newQuery.createUser = this.createUser
      if (this.displayedTagsCodes.length > 0) {
        newQuery.tags = this.displayedTagsCodes.join(',')
      }

      // 将 currentQuery 和 newQuery 的所有值转换为字符串
      const stringifyQuery = (query) => {
        const stringifiedQuery = {}
        for (const key in query) {
          stringifiedQuery[key] = String(query[key])
        }
        return stringifiedQuery
      }

      const isSameQuery =
        JSON.stringify(stringifyQuery(currentQuery)) ===
        JSON.stringify(stringifyQuery(newQuery))

      if (!isSameQuery) {
        this.$router.push({ query: newQuery })
      }
      this.fetchSpaces()
    },
    updateTagsInUrl () {
      this.updateRoute()
    },
    showInsertDialog () {
      this.insertDialogVisible = true
    },
    resetForm () {
      this.$refs.insertFormRef.resetFields()
    },
    submitInsertForm () {
      this.$refs.insertFormRef.validate((valid) => {
        if (valid) {
          request
            .post('/studySpace', this.insertForm)
            .then((res) => {
              this.$message.success('新增成功')
              this.insertDialogVisible = false
              this.fetchSpaces() // 刷新数据
            })
            .catch((err) => {
              this.$message.error(err.message || '新增失败')
            })
        } else {
          return false
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
.el-aside {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  padding: 30px;
  gap: 20px;
}
.bar-title {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.search-bar {
  display: flex;
  justify-items: center;
}
.subject-bar {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
}
.tag-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-bar-radio {
  display: flex;
  width: 80%;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 20px;
}
.tag-container {
  width: 100%;
  min-height: 40px;
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tag-footer {
  display: flex;
  justify-content: space-between;
}
.Materials-main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 10px;
  width: 100%;
  height: 100%;

  justify-content: space-between;
}
.head-bar {
  width: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px;
  gap: 20px;
}
.creator-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.insert-bar {
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
}
.space-items {
  display: flex;
  flex-wrap: wrap;
}
</style>
