import Vue from 'vue'
import Vuex from 'vuex'

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
  },
  modules: {
  }
})
