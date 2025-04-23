<template>
  <div>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
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
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%">
      <el-form :model="changePasswordForm" :rules="changePasswordRules" ref="changePasswordForm" size="mini">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changePasswordForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="图片验证码" prop="captcha">
          <el-input v-model="changePasswordForm.captcha" placeholder="请输入图片验证码">
            <template #append>
              <img v-if="!isSendingEmailCaptcha" :src="captchaUrl" style="width: 60px; height: 20px;" @click="refreshCaptcha" alt="captcha" />
              <el-button v-else type="info" @click="refreshCaptcha" style="width: 100px; height: 40px;">点击刷新</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCaptcha">
          <el-input v-model="changePasswordForm.emailCaptcha" placeholder="请输入邮箱验证码">
            <template #append>
              <el-button :disabled="isSendingEmailCaptcha || emailCaptchaCountdown > 0 || !changePasswordForm.email || !changePasswordForm.captcha" @click="sendEmailCaptcha">{{ isSendingEmailCaptcha ? '发送中...' : emailCaptchaCountdown > 0 ? `${emailCaptchaCountdown}秒后重试` : '发送验证码' }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="changePasswordForm.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="changePasswordForm.confirmPassword" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword" :disabled="!changePasswordForm.email || !changePasswordForm.emailCaptcha || !changePasswordForm.newPassword || !changePasswordForm.confirmPassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { removeToken } from '@/utils/storage'
import request from '@/utils/request'
import axios from 'axios'
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
      changePasswordDialogVisible: false,
      changePasswordForm: {
        email: '',
        captcha: '',
        emailCaptcha: '',
        newPassword: '',
        confirmPassword: ''
      },
      changePasswordRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }],
        emailCaptcha: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }]
      },
      captchaUrl: '/api/captcha',
      isSendingEmailCaptcha: false,
      emailCaptchaCountdown: 0,
      captchaId: ''
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    handleSelect (key, keyPath) {
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.$confirm('确认退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.post('/user/logout').then(() => {
            this.setUserInfo({
              id: '',
              name: '',
              avatar: ''
            })
            this.$router.push('/login')
            removeToken()
          })
        }).catch(() => {})
      } else if (command === 'changePassword') {
        this.changePasswordDialogVisible = true
        this.fetchCaptchaImage()
        // 重置表单状态
        this.$refs.changePasswordForm.resetFields()
      }
    },
    fetchCaptchaImage () {
      axios.get('/api/user/captcha-image', { responseType: 'blob' })
        .then(response => {
          if (response.data.type === 'application/json') {
            console.error('获取验证码图片失败')
            this.captchaUrl = require('@/assets/imgs/captcha.png') // 使用本地静态图片代替
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            this.captchaUrl = url
          }
          this.captchaId = response.headers.cookie.split(';')[0]
        })
        .catch(error => {
          console.error('获取验证码图片失败', error)
          this.captchaUrl = require('@/assets/imgs/captcha.png') // 使用本地静态图片代替
        })
    },
    refreshCaptcha () {
      this.fetchCaptchaImage()
    },
    sendEmailCaptcha () {
      if (!this.changePasswordForm.email || !this.changePasswordForm.captcha) {
        this.$message.error('请输入邮箱和图片验证码')
        return
      }
      this.isSendingEmailCaptcha = true
      request.post('/user/send-email-captcha', {
        email: this.changePasswordForm.email,
        captcha: this.changePasswordForm.captcha,
        captchaId: this.captchaId
      })
        .then(response => {
          this.$message.success('验证码发送成功，请查收邮件')
          this.startEmailCaptchaCountdown()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
        .finally(() => {
          this.isSendingEmailCaptcha = false
        })
    },
    startEmailCaptchaCountdown () {
      this.emailCaptchaCountdown = 60
      const interval = setInterval(() => {
        if (this.emailCaptchaCountdown > 0) {
          this.emailCaptchaCountdown--
        } else {
          clearInterval(interval)
        }
      }, 1000)
    },
    handleChangePassword () {
      this.$refs.changePasswordForm.validate((valid) => {
        if (valid) {
          if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmPassword) {
            this.$message.error('两次输入的密码不一致')
            return
          }
          request.post('/user/password', {
            email: this.changePasswordForm.email,
            emailCaptcha: this.changePasswordForm.emailCaptcha,
            password: this.changePasswordForm.newPassword
          })
            .then(response => {
              this.$message.success('密码修改成功')
              this.changePasswordDialogVisible = false
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        } else {
          this.$message.error('修改密码验证失败')
        }
      })
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created: async function () {
    if (this.userInfo === {} || this.userInfo.id === null || this.userInfo.id === '') {
      try {
        const res = await request.get('/user/info')
        this.setUserInfo(res.data)
      } catch (err) { this.$message.error(err) }
    }
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
  margin: 0px 20px 20px 20px;
  padding: 0;
  height: calc(100vh - 100px);
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
