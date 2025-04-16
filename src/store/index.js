import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request'
import { Message } from 'element-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      id: '',
      email: '',
      name: '',
      avatar: '',
      sex: null,
      phone: null
    }
  },
  getters: {
    getUserInfo: state => state.userInfo
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updateUserInfo ({ commit }, userInfo) {
      request.put('/user/edit', userInfo).then(res => {
        commit('setUserInfo', userInfo)
        Message({
          message: '修改成功',
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(err => {
        Message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    }
  },
  modules: {
  }
})
