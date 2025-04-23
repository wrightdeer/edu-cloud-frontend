import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request'
import { Message } from 'element-ui'
import { getOriginRoute, setOriginRoute, removeOriginRoute } from '@/utils/storage'
import tagDictionary from '@/assets/data/tagDictionary.json'

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
    },
    tagDictionary: tagDictionary,
    originRoute: {}
  },
  getters: {
    getUserInfo: state => state.userInfo,
    resolvedOriginRoute (state) {
      if (state.originRoute.name) {
        return state.originRoute
      } else {
        state.originRoute = getOriginRoute()
        return state.originRoute
      }
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setOriginRoute (state, originRoute) {
      state.originRoute = originRoute
      setOriginRoute(originRoute)
    },
    removeOriginRoute (state) {
      state.originRoute = {}
      removeOriginRoute()
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
