<template>
  <div>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
      >
        <div class="menu-left">
          <el-menu-item
            active-text-color="#ffd04b"
            v-for="item in menuItems"
            :key="item.index"
            @click="$router.push(item.path)"
          >
            <router-link :to="item.path">
              <i :class="item.icon"></i>
              {{ item.label }}
            </router-link>
          </el-menu-item>
        </div>

        <div class="info-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ userInfo.name }}</span>
          <el-avatar :size="30" :src="userInfo.avatar" class="avatar"></el-avatar>
        </div>
      </el-menu>
    </el-header>
    <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
    </el-main>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      menuItems: [
        {
          index: '1',
          path: '/materials',
          label: '学习资料',
          icon: 'el-icon-document'
        },
        {
          index: '2',
          path: '/subjects',
          label: '科目分类',
          icon: 'el-icon-s-management'
        },
        {
          index: '3',
          path: '/profile',
          label: '个人空间',
          icon: 'el-icon-s-custom'
        }
      ],
      userInfo: {
        id: '',
        email: '',
        name: '',
        avatar: '',
        sex: null,
        phone: ''
      }
    }
  },
  // computed: {
  //   ...mapState(['userInfo'])
  // }
  created: async function () {
    try {
      this.userInfo = await request.get('/user/info')
      console.log(this.userInfo)
    } catch (err) { this.$message.error(err) }
  }
}
</script>

<style scoped>
.el-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.menu-left {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: start;
}
.info-right {
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  margin-right: 20px;
  font-size: 18px;
  color: #faffd3;
  gap: 20px;
}
.el-dropdown-link i {
  color: #fff; /* 替换为你想要的颜色代码 */
}
.el-menu-item {
  min-width: 100px;
  max-width: 200px;
}
.el-menu-item a {
  color: #fff;
  text-decoration: none;
}
.el-menu-item a:hover {
  color: #ffd04b;
}
.el-menu-item a.router-link-active {
  color: #ffd04b;
}
.el-main {
  margin: 20px;
  padding: 0;
  height: calc(100vh - 120px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
/* 过渡效果样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
