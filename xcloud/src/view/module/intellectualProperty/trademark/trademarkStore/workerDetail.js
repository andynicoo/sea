

export default {
  state: {
    delWorkInfo: {}, //oa工单详情页翻译OA信息
    planInfo: {},
    treatmentSchemeList: [],
  },
  getters: {
    getDelworkInfo(state) {
      return state.delWorkInfo;
    },
    /**答复审查意见处理方案 列表 */
    getTreatmentSchemeList(state) {
      return state.treatmentSchemeList;
    },
    getNewPlanInfo(state) {
      return state.planInfo;
    },
  },
  mutations: {
    saveWorkInfo(state, val) {
      state.delWorkInfo = val;
    },
    savePlanInfo(state, val) {
      state.planInfo = val;
    },
    /**答复审查意见处理方案 列表 */
    saveTreatmentSchemeList(state, val) {
      state.treatmentSchemeList.push(val);
    },
    /**删除指定的一条 处理方案 */
    deleteTreatmentSchemeLItem(state, index) {
      state.treatmentSchemeList.splice(index, 1);
      // console.log(index, state.treatmentSchemeList);
    },
    /**清空 */
    resetTreatmentSchemeList(state) {
      state.treatmentSchemeList = [];
    },
  },
  actions: {},
};
