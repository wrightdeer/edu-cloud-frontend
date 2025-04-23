<template>
  <el-card class="subject-card" @click.native="handClick" shadow="hover">
    <div class="card-header">
      <span class="card-title">{{ subject.name }}</span>
      <el-dropdown @command="handleCommand" trigger="hover">
        <el-button type="text">
          <i class="el-icon-more"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="`edit-${subject.id}`">
            <el-tooltip :content="editTooltip" placement="top" :disabled="canEdit">
              <span>编辑</span>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item :command="`delete-${subject.id}`">
            <el-tooltip :content="deleteTooltip" placement="top" :disabled="canDelete">
              <span>删除</span>
            </el-tooltip>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="card-content">
      <span>创建者: {{ subject.createUserName }}</span>
      <span>学习资料: {{ subject.spaceCount }}</span>
      <span>创建于: {{ formattedCreateTime }}</span>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { formattedTime } from '@/utils/calcTime'

export default {
  props: {
    subject: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['userInfo']),
    canEdit () {
      return this.subject.createUser === this.userInfo.id && this.subject.spaceCount < 50
    },
    canDelete () {
      const createTime = moment(this.subject.createTime)
      const now = moment()
      const diffInDays = now.diff(createTime, 'days')
      return this.subject.spaceCount === 0 && (this.subject.createUser === this.userInfo.id || diffInDays > 2)
    },
    editTooltip () {
      let tooltip = ''
      if (this.subject.createUser !== this.userInfo.id) {
        tooltip = '非创建者无法编辑'
      }
      if (this.subject.spaceCount >= 50) {
        tooltip = '该科目超过 50 个学习资料，无法编辑'
      }
      return tooltip
    },
    deleteTooltip () {
      if (this.subject.spaceCount !== 0) {
        return '该科目有学习资料，无法删除'
      }
      const createTime = moment(this.subject.createTime)
      const now = moment()
      const diffInDays = now.diff(createTime, 'days')
      if (this.subject.createUser !== this.userInfo.id && diffInDays <= 2) {
        return '未超过 2 天的科目仅创建者可以删除'
      }
      return ''
    },
    formattedCreateTime () {
      return formattedTime(this.subject.createTime)
    }
  },
  methods: {
    handClick () {
      this.$emit('click', this.subject.id)
    },
    handleCommand (command) {
      const action = command.split('-')[0]
      const id = command.split('-')[1]
      if (action === 'edit' && this.canEdit) {
        this.$emit(action, id)
      } else if (action === 'delete' && this.canDelete) {
        this.$confirm('确定删除该科目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('delete', id)
        }).catch(() => {
        })
      }
    }
  }
}
</script>

<style scoped>
.subject-card.el-card {
  padding: 10px;
  width: 42vh;
  cursor: pointer;
  margin: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
}

.card-content {
  margin-top: 10px;
  color: #999;
}

.card-content span {
  display: block;
  margin-bottom: 5px;
}
</style>
