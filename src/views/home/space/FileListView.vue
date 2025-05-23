<template>
  <el-container>
    <el-header class="file-list-header">
      <el-breadcrumb separator="/" style="margin: 20px">
        <el-breadcrumb-item
          v-for="(path, index) in pathStack"
          :key="index"
        >
        <span class="path-item" @click="handlePathClick(index)">{{path}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-right" style="margin: 20px;">
        <el-button type="info" size="mini" icon="el-icon-top" :disabled="$route.query.path === 'root:'" @click="handleReturn">返回上级目录</el-button>
        <el-button type="success" size="mini" icon="el-icon-document-checked" @click="handleUploadFile">上传文件</el-button>
        <el-button type="warning" size="mini" icon="el-icon-folder" @click="handleCreateFolder">新建目录</el-button>
      </div>
    </el-header>
    <el-main v-show="!loading" style="padding: 0px;">
      <!-- 添加表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="文件名" width="200"></el-table-column>
        <el-table-column prop="fileType" label="类型" width="150"></el-table-column>
        <el-table-column prop="fileSize" label="大小" width="100"></el-table-column>
        <el-table-column prop="downloadCount" label="下载次数" width="100"></el-table-column>
        <el-table-column label="上传时间" width="200">
          <template slot-scope="scope">
            {{formattedUploadTime(scope.row.uploadTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link @click="handleRename(scope.row)" type="primary" style="margin-right:5px;" size="small">改名</el-link>
            <el-link @click="handleMove(scope.row)" type="primary" style="margin-right:5px;" size="small">移动</el-link>
            <el-link v-if="scope.row.actionType === 1" @click="handleBrowseImage(scope.row)" type="primary" style="margin-right:5px;" size="small">浏览</el-link>
            <el-link v-if="scope.row.actionType === 2" @click="handleBrowseDoc(scope.row)" type="primary" style="margin-right:5px;" size="small">浏览</el-link>
            <el-link v-if="scope.row.actionType !== 4" @click="handleDownload(scope.row)" type="primary" style="margin-right:5px;" size="small">下载</el-link>
            <el-link v-else @click="handleEnter(scope.row)" type="primary" style="margin-right:5px;" size="small">进入</el-link>
            <el-link @click="handleDelete(scope.row)" type="danger" style="margin-right:5px;" size="small">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-empty v-if="loading" description="加载中..."></el-empty>

    <!-- 文件上传对话框 -->
    <el-dialog title="上传文件" :visible.sync="uploadDialogVisible" width="30%">
      <el-upload
        ref="upload"
        action=""
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
        :limit="1"
        :on-exceed="handleExceed"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传不超过10MB的文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">上 传</el-button>
      </span>
    </el-dialog>

    <!-- 移动文件/文件夹对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="moveDialogVisible" width="30%">
      <el-tree
        :data="treeData"
        accordion
        lazy
        show-checkbox
        ref="tree"
        check-strictly="true"
        node-key="path"
        :load="loadTreeNode"
        :props="defaultProps"
        @check-change="handleCheckChange"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMove">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import request from '@/utils/request'
import { formattedTime } from '@/utils/calcTime'

export default {
  data () {
    return {
      pathStack: [],
      tableData: [],
      childFolder: [],
      childFile: [],
      moveDialogVisible: false, // 控制移动对话框的显示
      dialogTitle: '',
      selectedRow: null, // 当前选中的行
      treeData: [], // 树形结构数据
      defaultProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf',
        disabled: 'disabled'
      },
      selectedNodePath: null,
      loading: false,
      uploadDialogVisible: false, // 控制文件上传对话框的显示
      fileList: [], // 文件列表
      currentFile: null // 当前选中的文件
    }
  },
  methods: {
    formattedUploadTime (uploadTime) {
      return uploadTime ? formattedTime(uploadTime) : ''
    },
    async fetchChildFolder () {
      await request.get('/folder/list/' + this.$route.params.spaceId, {
        params: {
          path: this.$route.query.path
        }
      })
        .then((res) => {
          this.childFolder = res.data
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    async fetchChildFile () {
      await request
        .get('/file/list/' + this.$route.params.spaceId, {
          params: {
            path: this.$route.query.path
          }
        })
        .then((res) => {
          this.childFile = res.data
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    loadTableData () {
      // 补充目录的字段
      const normalizedFolders = this.childFolder.map(folder => ({
        ...folder,
        fileType: '文件夹', // 固定值
        actionType: 4, // 目录专属类型
        fileSize: null, // 目录无文件大小
        downloadCount: null, // 目录无下载次数
        uploadTime: null // 目录无上传时间
      }))

      // 合并文件和目录
      this.tableData = [...normalizedFolders, ...this.childFile]
    },
    handlePathClick (index) {
      const fullPath = this.pathStack.slice(0, index + 1).join('/')
      if (fullPath !== this.$route.query.path) {
        this.$router.push({
          path: '/space/' + this.$route.params.spaceId + '/fileList',
          query: {
            path: fullPath
          }
        })
        this.loadPage()
      }
    },
    handleRename (row) {
      this.$prompt('请输入新的名称', '改名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        const isFile = row.fileType !== '文件夹'
        const url = isFile ? `/file/name/${row.id}` : `/folder/name/${row.id}`
        request.put(url, null, {
          params: {
            name: value
          }
        }).then(() => {
          this.$message.success('改名成功')
          // 刷新表格数据
          this.loadPage()
        }).catch((err) => {
          this.$message.error(`改名失败: ${err.message}`)
        })
      }).catch(() => {
        this.$message.info('取消改名')
      })
    },
    handleMove (row) {
      this.selectedRow = row
      this.moveDialogVisible = true
      this.selectedNodePath = null
      this.treeData = [{
        name: 'root:',
        path: 'root:',
        leaf: false,
        disabled: this.$route.query.path === 'root:',
        children: []
      }]
      this.dialogTitle = row.fileType === '文件夹' ? '移动文件夹' : '移动文件'
      this.loadRootFolder() // 加载根目录
    },
    async loadTreeNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{
          name: 'root:',
          path: 'root:',
          leaf: false,
          disabled: this.$route.query.path === 'root:',
          children: []
        }])
      }
      await request.get('/folder/list/' + this.$route.params.spaceId, {
        params: {
          path: node.data.path
        }
      }).then(res => {
        const nodeData = res.data.map(item => ({
          name: item.name,
          path: node.data.path + '/' + item.name,
          leaf: false,
          disabled: node.data.path + '/' + item.name === this.$route.query.path
        }))
        return resolve(nodeData)
      }).catch(err => {
        this.$message.error(err)
        return resolve([])
      })
    },
    handleCheckChange (currentNode, isChecked) {
      if (isChecked) {
        this.$refs.tree.setCheckedKeys([currentNode.path])
        this.selectedNodePath = currentNode.path
      }
    },
    confirmMove () {
      if (this.selectedNodePath) {
        const isFile = this.selectedRow.fileType !== '文件夹'
        const url = isFile ? `/file/path/${this.selectedRow.id}` : `/folder/path/${this.selectedRow.id}`
        request.put(url, null, {
          params: {
            path: this.selectedNodePath
          }
        }).then(() => {
          this.$message.success('移动成功')
          this.moveDialogVisible = false
        }).catch(err => {
          this.$message.error(err)
        })
      }
    },
    handleUploadFile () {
      this.uploadDialogVisible = true
      this.fileList = []
      this.currentFile = null
    },

    handleFileChange (file, fileList) {
      this.currentFile = file
      this.fileList = fileList
    },

    handleExceed () {
      this.$message.warning('只能上传一个文件')
    },

    submitUpload () {
      if (!this.currentFile) {
        this.$message.warning('请选择文件')
        return
      }

      if (this.currentFile.size > 10 * 1024 * 1024) {
        this.$message.error('文件大小不能超过10MB')
        return
      }

      const formData = new FormData()
      formData.append('file', this.currentFile.raw)
      formData.append('path', this.$route.query.path)
      formData.append('spaceId', this.$route.params.spaceId)

      this.sendRequest(formData)
    },

    sendRequest (formData) {
      request.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          this.$message.success('文件上传成功')
          this.uploadDialogVisible = false
          this.loadPage() // 刷新表格数据
        })
        .catch((err) => {
          this.$message.error(`文件上传失败: ${err.message}`)
        })
    },

    handleDownload (row) {
      if (row.fileType === '文件夹') {
        this.$message.warning('文件夹下载未实现')
        return
      }
      request.get(`/file/${row.id}`)
        .then((res) => {
          if (res.code === 1 && res.data.cloudUrl) {
            // 创建一个隐藏的 <a> 标签
            const link = document.createElement('a')
            link.href = 'https://web-lyt-tlias.oss-cn-beijing.aliyuncs.com/' + res.data.cloudUrl
            link.download = row.name // 使用 row.name 作为文件名
            document.body.appendChild(link)
            link.click() // 触发点击事件以下载文件
            document.body.removeChild(link) // 下载完成后移除 <a> 标签
          } else {
            this.$message.error('获取下载链接失败')
          }
        })
        .catch((err) => {
          this.$message.error(`下载失败: ${err.message}`)
        })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该文件或文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const isFile = row.fileType !== '文件夹'
        const url = isFile ? `/file/${row.id}` : `/folder/${row.id}`
        request.delete(url).then(() => {
          this.$message.success('删除成功')
          // 刷新表格数据
          this.loadPage()
        }).catch(err => {
          this.$message.error(`删除失败: ${err.message}`)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleBrowseImage (row) {
      if (row.actionType === 1) {
        this.$router.push({
          path: '/space/' + this.$route.params.spaceId + '/preview/' + row.id,
          query: {
            mode: 'image'
          }
        })
      }
    },
    handleBrowseDoc (row) {
      if (row.actionType === 2) {
        this.$router.push({
          path: '/space/' + this.$route.params.spaceId + '/preview/' + row.id,
          query: {
            mode: 'txt'
          }
        })
      }
    },
    handleCreateFolder () {
      this.$prompt('请输入目录名称', '新建目录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        request.post('/folder', null, {
          params: {
            name: value,
            path: this.$route.query.path,
            spaceId: this.$route.params.spaceId
          }
        }).then(() => {
          this.$message.success('创建成功')
          // 刷新表格数据
          this.loadPage()
        }).catch(err => {
          this.$message.error(`创建失败: ${err.message}`)
        })
      })
    },
    handleEnter (row) {
      if (row.fileType === '文件夹') {
        this.$router.push({
          path: '/space/' + this.$route.params.spaceId + '/fileList',
          query: {
            path: this.$route.query.path + '/' + row.name
          }
        })
        this.loadPage()
      }
    },
    handleReturn () {
      if (this.$route.query.path !== 'root:') {
        const path = this.$route.query.path.split('/')
        path.pop()
        this.$router.push({
          path: '/space/' + this.$route.params.spaceId + '/fileList',
          query: {
            path: path.join('/')
          }
        })
        this.loadPage()
      }
    },
    async loadPage () {
      this.loading = true
      this.pathStack = this.$route.query.path.split('/')
      await this.fetchChildFolder()
      await this.fetchChildFile()
      this.loadTableData()
      this.loading = false
    }
  },
  watch: {
    moveDialogVisible (newVal) {
      if (!newVal) {
      // 对话框关闭时重置树的状态
        this.$nextTick(() => {
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedKeys([])
          }
        })
      }
    }
  },

  created: async function () {
    if (!this.$route.query.path || this.$route.query.path === undefined) {
      this.$router.replace({
        path: '/space/' + this.$route.params.spaceId + '/fileList',
        query: {
          path: 'root:'
        }
      })
    }
    this.loadPage()
  }
}
</script>

<style scoped>
.file-list-header {
  background-color: antiquewhite;
  padding: 0;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.path-item {
  cursor: pointer;
}
</style>
