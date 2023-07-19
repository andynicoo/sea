export default {
    state: {
      declareInfo: {},
      comfirmMessage: {},
      addFrom: {},
      VatObligationsData: {}
    },
    getters: {

    },
    mutations: {
      getDeclareInfo(state, declareInfo){
        state.declareInfo = declareInfo
      },
      getComfirmMessage(state, comfirmMessage){
        state.comfirmMessage = comfirmMessage
      },
      getAddFrom(state, addFrom){
        state.addFrom = addFrom
      },
      getVatObligationsData(state, VatObligationsData) {
        state.VatObligationsData = VatObligationsData
      }
    },
    actions: {

    }
  }