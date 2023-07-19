export default {
  namespaced: true,
  state: {
    userInfo: {}
  },
  mutations: {
    setUserInfo(state, data) {
      localStorage.setItem('userInfo', JSON.stringify(data))
      state.userInfo = data
    }
  }
}