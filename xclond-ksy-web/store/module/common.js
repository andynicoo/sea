export default {
  namespaced: true,
  state: {
    loadingSearchingInfo: {
      show: false,
      text: '风格理念选型-AI智能起名-注册风险分析中'
    }
  },
  mutations: {
    setSearching(state, data = {}) {
      state.loadingSearchingInfo = { ...state.loadingSearchingInfo, ...data }
    }
  }
}