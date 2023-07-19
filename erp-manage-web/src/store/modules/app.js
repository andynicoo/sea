export default {
  namespace: true,
  state: {
    isLoading: false
  },
  actions: {

  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    }
  }
}
