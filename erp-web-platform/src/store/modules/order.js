const state = {
  orderF5: true,
  batchPrintLoad: false
}

// getters
const getters = {
  orderF5: (state) => {
    return state.orderF5
  },
  batchPrintLoad: (state) => {
    return state.batchPrintLoad
  }
}

// mutations
const mutations = {
  SET_ORDER_F5(state, flag) {
    state.orderF5 = flag
  },
  SET_BATCH_PRINT_LOAD(state, flag) {
    state.batchPrintLoad = flag
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations
}
