// state
const state = {
  // 菜单操作
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') && localStorage.getItem('sidebarStatus') == 0 ? true : false,
  },
  // main div scrollnum 用于某些页面 元素置顶定位等
  scrollNum: 0,
  businessLicense: '',
  stepIndex:1
};

// mutations
const mutations = {
  CLOSE_SIDEBAR: (state) => {
    localStorage.setItem('sidebarStatus', 0);
    state.sidebar.opened = true;
  },
  OPEN_SIDEBAR: (state) => {
    localStorage.setItem('sidebarStatus', 1);
    state.sidebar.opened = false;
  },
  SET_SCROLLNUM: (state, newdata) => {
    state.scrollNum = newdata;
  },
  SET_BUSINESSLICENSE: (state, newdata) => {
    state.businessLicense = newdata;
  },
  SET_STEPINDEX: (state, newdata) => {
    state.stepIndex = newdata;
  },
};

// actions
const actions = {
  closeSidebar({ commit }) {
    commit('CLOSE_SIDEBAR');
  },
  openSidebar({ commit }) {
    commit('OPEN_SIDEBAR');
  },
  setScrullNum({ commit }, newdata) {
    commit('SET_SCROLLNUM', newdata);
  },
  setBusinessLicense({ commit }, newdata) {
    commit('SET_BUSINESSLICENSE', newdata);
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
