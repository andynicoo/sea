// state
const state = {
  // 菜单操作
  isPayLog: true,
};

// mutations
const mutations = {
  savePayLog(state, status){
    state.isPayLog = status
  },
};
const actions = {
  disSavePayLog(context, newdata) {
    // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    context.commit("savePayLog", newdata);
  },
}

/**
 * 1.使用命名空间导出，在getters.js中暴露模块的state属性
 * 2.mutations大写，页面中不能直接使用commit
 * 3.页面需要使用dispatch来通过action触发
 */
export default {
  state,
  mutations,
  actions
};
