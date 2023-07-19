export default {
  state: {
    totalTodoNum: 0,
    otherTodoNum: {
      companyInfo: 0,
      corporateInfo: 0,
      storeAndTaxInfo: 0,
    },
    completeNum: {
      companyInfo: 0,
      corporateInfo: 0,
      storeAndTaxInfo: 0,
    },
  },
  getters: {
    getTotalTodoNum(state) {
      return state.totalTodoNum;
    },
    getOtherTodoNum(state) {
      return state.otherTodoNum;
    },
    getCompleteNum(state) {
      return state.completeNum;
    },
  },
  mutations: {
    setTodoNum(state, rule) {
      rule = rule.filter((item) => item.field !== 'testField' && item.display);
      state.totalTodoNum = rule.filter((item) => !item.props.confirmSuccess).length;
      let keys = Object.keys(state.completeNum);
      keys.forEach((key) => {
        state.completeNum[key] = rule.filter((item) => item.moduleCode === key && item.props.confirmSuccess).length;
      });
    },
    setOtherTodoNum(state, rule) {
      let keys = Object.keys(state.otherTodoNum);
      keys.forEach((key) => {
        state.otherTodoNum[key] = rule.filter((item) => item.moduleCode === key && item.display).length;
      });
    },
    changeTodoNum(state, key) {
      state.completeNum[key] += 1;
      state.totalTodoNum -= 1;
    },
    setTotalTodoNum(state, num) {
      state.totalTodoNum = num;
    },
  },
  actions: {
    changeSetTodoNum({ commit }, rule) {
      setTimeout(() => {
        commit('setTodoNum', rule);
      });
    },
  },
};
