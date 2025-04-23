<template>
  <el-container class="container">
    <el-header class="subject-header">
      <div class="search-left">
        <el-input
          placeholder="请输入科目名"
          v-model="searchInput"
          class="search-input"
          clearable
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div class="insert-right">
        <el-input
          placeholder="请输入新科目名"
          v-model="insertInput"
          class="search-input"
          clearable
        ></el-input>
        <el-button type="warning" icon="el-icon-plus" @click="insert"
          >新增</el-button
        >
      </div>
    </el-header>
    <el-main class="subject-main">
      <subject-card
        v-for="subject in subjects"
        :key="subject.id"
        :subject="subject"
        @edit="handleEdit"
        @delete="handleDelete"
        @click="getLink(subject.id)"
      />
    </el-main>
    <el-dialog title="编辑科目" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="editedSubject.name" placeholder="请输入新科目名"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import SubjectCard from '@/components/SubjectCard.vue'
import request from '@/utils/request'

export default {
  components: {
    SubjectCard
  },
  data () {
    return {
      searchInput: '',
      insertInput: '',
      subjects: [],
      dialogVisible: false, // 添加对话框可见性控制
      editedSubject: { id: null, name: '' } // 添加编辑科目数据
    }
  },
  methods: {
    handleEdit (id) {
      // 打开对话框并设置编辑的科目信息
      const subject = this.subjects.find(sub => sub.id === id)
      this.editedSubject = { ...subject }
      this.dialogVisible = true
    },
    confirmEdit () {
      // 发送编辑请求并刷新科目列表
      request.put(`/subject/${this.editedSubject.id}`, { name: this.editedSubject.name }).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.dialogVisible = false
        this.requireSubjects()
      })
    },
    handleDelete (id) {
      request.delete(`/subject/${id}`).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { this.$message.error(err) })
    },
    getLink (id) {
      this.$router.push(`/materials?subject=${id}`)
    },
    search () {
      this.requireSubjects()
    },
    insert () {
      if (this.insertInput !== '') {
        request.post('/subject', { name: this.insertInput }).then(response => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.insertInput = ''
          this.requireSubjects()
        }).catch(err => { this.$message.error(err) })
      } else {
        this.$message.error('请输入科目名')
      }
    },
    requireSubjects: async function () {
      try {
        let res
        let url = '/subject/list'
        if (this.searchInput !== '') {
          url += `?name=${this.searchInput}`
        }
        await (res = request.get(url)).res
        this.subjects = (await res).data
      } catch (err) { this.$message.error(err) }
    }
  },
  created: async function () {
    await this.requireSubjects()
  },
  mounted () {
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
.subject-header {
  background-color: #b1c8e6;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-left {
  display: flex;
  align-items: center;
  margin-left: 20px;
  gap: 10px;
}
.insert-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
}
.subject-main{
  display: flex;
  flex-wrap: wrap;
}

</style>
