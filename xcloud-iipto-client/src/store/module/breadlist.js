export default {
  state: {
    breadListState: [
      { name: 'home', path: '/' }
    ],
    orderStatue: true, // 商品页状态
    articleStatus: true, // 咨询
    productStatus: true, // vat服务商品
    productInfoStatus: true, // vat服务商品详情
    sureStatus: true, // 确认订单
    declareInfo: true, // 申报详情
    myOrder: true, // 我的订单
    carNum: 0,
    declareNumbuer: 0,
    brandItem: {}
  },
  getters: {
    breadListState() {
      return JSON.parse(sessionStorage.getItem('breadListStorage')) || []
    },
    orderStatue(state) {
      return state.orderStatue
    },
    articleStatus(state) {
      return state.articleStatus
    },
    productStatus(state) {
      return state.productStatus
    },
    productInfoStatus(state) {
      return state.productInfoStatus
    },
    sureStatus(state) {
      return state.sureStatus
    },
    declareInfo(state) {
      return state.declareInfo
    },
    myOrder(state) {
      return state.myOrder
    },
    carNum(state) {
      return state.carNum
    },
    declareNumbuer(state) {
      return state.declareNumbuer
    },
  },
  mutations: {
    setBrandItem(state, data = {}) {
      state.brandItem = {...data}
    },
    breadListMutations(getters, list) {
      getters.breadListState = list
      sessionStorage.setItem('breadListStorage', list)
    },
    saveOrderStatue(state, newdata) { // 自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
      state.orderStatue = newdata
    },
    saveArticleStatue(state, newdata) {
      state.articleStatus = newdata
    },
    saveProductStatue(state, newdata) {
      state.productStatus = newdata
    },
    saveSureStatue(state, newdata) {
      state.sureStatus = newdata
    },
    saveProductInfoStatue(state, newdata) {
      state.productInfoStatus = newdata
    },
    saveDeclareInfoStatue(state, newdata) {
      state.declareInfo = newdata
    },
    saveOrderListStatue(state, newdata) {
      state.myOrder = newdata
    },
    saveCarNumStatue(state, newdata) {
      state.carNum = newdata
    },
    saveDeclareNumbuer(state, newdata) {
      state.declareNumbuer = newdata
    },
  },
  actions: {
    changeStatus(context, newdata) { // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
      context.commit('saveOrderStatue', newdata)
    },
    changeArticleStatus(context, newdata) {
      context.commit('saveArticleStatue', newdata)
    },
    changeProductStatus(context, newdata) {
      context.commit('saveProductStatue', newdata)
    },
    changeSureStatus(context, newdata) {
      context.commit('saveSureStatue', newdata)
    },
    changeProductInfoStatus(context, newdata) {
      context.commit('saveProductInfoStatue', newdata)
    },
    changeDeclareInfoStatus(context, newdata) {
      context.commit('saveDeclareInfoStatue', newdata)
    },
    changeOrderListStatus(context, newdata) {
      context.commit('saveOrderListStatue', newdata)
    },
    changeCarNumStatus(context, newdata) {
      context.commit('saveCarNumStatue', newdata)
    },
    changeDeclareNumbuer(context, newdata) {
      context.commit('saveDeclareNumbuer', newdata)
    }
  }
}
