export default {
  state: {
    timestamp: "", //服务器时间
    startTime: "", //活动开始时间
    endTime: "", //活动结束时间
    actList: []
  },
  getters: {
    timestamp(state) {
      return state.timestamp;
    },
    startTime(state) {
      return state.startTime;
    },
    endTime(state) {
      return state.endTime;
    },
    actList(state) {
      return state.actList;
    }
  },
  mutations: {
    saveTimestamp(state, newdata) {
      state.timestamp = newdata;
    },
    saveActList(state, newdata) {
      state.actList = newdata;
    },
    saveStartTime(state, newdata) {
      state.startTime = newdata;
    },
    saveEndTime(state, newdata) {
      state.endTime = newdata;
    }
  },
  actions: {
    chageTimestamp(context, newdata) {
      // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
      context.commit("saveTimestamp", newdata);
    },
    chageActList(context, newdata) {
      context.commit("saveActList", newdata);
    },
    chageStartTime(context, newdata) {
      // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
      context.commit("saveStartTime", newdata);
    },
    cahgeEndTime(context, newdata) {
      // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
      context.commit("saveEndTime", newdata);
    }
  }
};
