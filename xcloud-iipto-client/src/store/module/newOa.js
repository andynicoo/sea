export default {
  state: {
    // 答复审查意见
    userAnswerInfo: {
      receptFile: '', // 上传的答复文件
      remark: '', // 备注
      fileName: '',
    },
    userOaPlan: [],
    oaDetailInfo: {},
    choosePlan: null,
    planActive: 0,
    userAnswerFileName: null
  },
  mutations: {
    setUserAnswerInfo (state, newdata) {
      state.userAnswerInfo = newdata
    },
    setOaDetailInfo (state, newdata) {
      state.oaDetailInfo = newdata
    },
    setUserOaPlan (state, newdata) {
      state.userOaPlan = newdata
    },
    setChoosePlan (state, newdata) {
      state.choosePlan = newdata
    },
    setPlanActive (state, newdata) {
      state.planActive = newdata
    },
    setUserAnswerFileName (state, newdata) {
      state.userAnswerFileName = newdata
    },
  }
}