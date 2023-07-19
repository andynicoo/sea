export default {
  state: {
    declareInfo: {},
    comfirmMessage: {},
    addFrom: {},
    VatObligationsData: {},
    Auth: {
      vatTaxNumber: '',
      auth: false
    }
  },
  getters: {

  },
  mutations: {
    getDeclareInfo(state, declareInfo) {
      state.declareInfo = declareInfo
    },
    getComfirmMessage(state, comfirmMessage) {
      state.comfirmMessage = comfirmMessage
    },
    getAddFrom(state, addFrom) {
      state.addFrom = addFrom
    },
    getVatObligationsData(state, VatObligationsData) {
      state.VatObligationsData = VatObligationsData
    },
    hasAuth(state, Auth) {
      state.Auth = Auth
    },
  },
  actions: {

  }
}