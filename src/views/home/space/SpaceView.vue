<template>
  <el-container>
    <el-header>
      <div class="back-btn"><i class="el-icon-arrow-left"></i></div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in pathStack"
          :key="item.id"
         :to="getLink(item.id)">{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      pathStack: [
        { id: '1', label: '根目录' },
        { id: '2', label: 'folder1' },
        { id: '3', label: 'folder2' },
        { id: '4', label: 'folder3' }
      ]
    }
  },
  methods: {
    getLink (id) {
      const spaceId = this.$route.params.spaceId
      return `/space/${spaceId}/folderList/${id}`
    }
  }
}
</script>

<style scoped>
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
  width: 200px;
}

.el-aside {
  height: 100%;
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 469px;
}
</style>
