// state
const state = {
  businessLicense: '',
  categoryList: [],
  stepIndex:1
};

// mutations
const mutations = {
  SET_BUSINESSLICENSE: (state, newdata) => {
    state.businessLicense = newdata;
  },
  SET_CATEGORYLIST: (state, newdata) => {
    state.categoryList = newdata;
  },
  SET_STEPINDEX: (state, newdata) => {
    state.stepIndex = newdata;
  },
};

// actions
const actions = {
  setBusinessLicense({ commit }, newdata) {
    commit('SET_BUSINESSLICENSE', newdata);
  },
  setCategoryList({ commit }, newdata) {
    commit('SET_CATEGORYLIST', newdata);
  },
  setStepIndex({ commit }, newdata) {
    commit('SET_STEPINDEX', newdata);
  },
};
/**
 * 1.使用命名空间导出，在getters.js中暴露模块的state属性
 * 2.mutations大写，页面中不能直接使用commit
 * 3.页面需要使用dispatch来通过action触发
 */
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
