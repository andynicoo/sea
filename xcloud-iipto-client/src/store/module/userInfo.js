export default {
  state: {
    userInfo: {}
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo || localStorage.getItem('userInfo')
    }
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    deleteUserInfo(state, data = {}) {
      state.userInfo = data
    }
  }
}