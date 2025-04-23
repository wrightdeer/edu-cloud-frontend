<template>
  <div class="login-bg">
    <div class="login-form-container">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="验证码登录" name="verification">
          <el-form :model="verificationForm" :rules="verificationRules" ref="verificationForm">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="verificationForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="图片验证码" prop="captcha">
              <el-input v-model="verificationForm.captcha" placeholder="请输入图片验证码">
                <template #append>
                  <img v-if="!isSendingEmailCaptcha" :src="captchaUrl" style="width: 80px; height: 30px;" @click="refreshCaptcha" alt="captcha" />
                  <el-button v-else type="info" @click="refreshCaptcha" style="width: 100px; height: 40px;">点击刷新</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="emailCaptcha">
              <el-input v-model="verificationForm.emailCaptcha" placeholder="请输入邮箱验证码">
                <template #append>
                    <el-button :disabled="isSendingEmailCaptcha || emailCaptchaCountdown > 0 || !verificationForm.email || !verificationForm.captcha" @click="sendEmailCaptcha">{{ isSendingEmailCaptcha ? '发送中...' : emailCaptchaCountdown > 0 ? `${emailCaptchaCountdown}秒后重试` : '发送验证码' }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleVerificationLogin" :disabled="!verificationForm.email || !verificationForm.emailCaptcha">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码登录" name="password">
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="passwordForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="passwordForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePasswordLogin" :disabled="!passwordForm.email || !passwordForm.password">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import request from '@/utils/request'
import { setToken } from '@/utils/storage'

export default {
  data () {
    return {
      activeTab: 'verification',
      passwordForm: {
        email: '',
        password: ''
      },
      passwordRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      verificationForm: {
        email: '',
        captcha: '',
        emailCaptcha: ''
      },
      verificationRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }],
        emailCaptcha: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
      },
      captchaUrl: '/api/captcha',
      isSendingEmailCaptcha: false,
      emailCaptchaCountdown: 0,
      captchaId: ''
    }
  },
  created () {
    this.fetchCaptchaImage()
  },
  methods: {
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
      if (!this.verificationForm.email || !this.verificationForm.captcha) {
        this.$message.error('请输入邮箱和图片验证码')
        return
      }
      this.isSendingEmailCaptcha = true
      request.post('/user/send-email-captcha', {
        email: this.verificationForm.email,
        captcha: this.verificationForm.captcha,
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
    handlePasswordLogin () {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          request.post('/user/login/password', {
            email: this.passwordForm.email,
            password: this.passwordForm.password
          })
            .then(response => {
              setToken(response.token)
              this.$router.push('/')
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        } else {
          this.$message.error('密码登录验证失败')
        }
      })
    },
    handleVerificationLogin () {
      this.$refs.verificationForm.validate((valid) => {
        if (valid) {
          request.post('/user/login/email', {
            email: this.verificationForm.email,
            emailCaptcha: this.verificationForm.emailCaptcha
          })
            .then(response => {
              setToken(response.token)
              this.$router.push('/')
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        } else {
          this.$message.error('验证码登录验证失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-bg {
  height: 97vh;
  background: url('@/assets/imgs/login-bg.jpg');
  background-size: cover;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.login-form-container {
  background: #d3d3d3;
  color: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin-right: 20px;
}
</style>
