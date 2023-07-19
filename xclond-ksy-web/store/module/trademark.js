export default {
  namespaced: true,
  state: {
    typeCategory: ["查商标", "查申请人", "查代理律师", "查宣誓时间", "查商标状态", "查使用证据"],
    tempRiskList: [],
    // 搜索框值状态记录
    pagesTradeStatus: {
      // 分类查询结果页
      typeSearch: false
    },
    bigTypeArr: [],
    // 常用律师
    defaultLawyer: ['Charles T. J. Weigell', 'Ben Natter'],
    // 常用申请人
    defaultOwner: ['Apple Inc.', 'ALFREDO ZABALA'],
    // 常用近似商标
    defaultBrandLike: ['apple','huawei','samsung'],
    // 常用精准商标
    defaultBrandTarget: ['apple','huawei','samsung']
  },
  mutations: {
    setRiskList(state, data) {
      state.tempRiskList = data
    },
    setPagesTradeStatus(state, data) {
      state.pagesTradeStatus = { ...state.pagesTradeStatus, ...data }
    },
    updateBigTypeArr(state, data) {
      state.bigTypeArr = [...data]
    }
  }
}