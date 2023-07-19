import { letterList, letterCount } from "@/api/user/letters";
export default {
  state: {
    // 要设置的全局访问的state对象
    token: localStorage.getItem("token") || "",
    sessionId: localStorage.getItem("sessionId") || "",
    isLogin: false, // 全局是否登录
    headShow: true,
    leftShow: false,
    menuName: "/work",
    menuOpen: ["1", "2", "3", "4"],
    declareNumbuer: 0,
    // 要设置的初始属性值
    xinjianCount: 0,
  },
  getters: {
    // 实时监听state值的变化(最新状态)
    gettoken(state) {
      // 承载变化的token的值
      return state.token;
    },
    getsessionid(state) {
      // 承载变化的sessionId的值
      return state.sessionId;
    },
    getlogin(state) {
      // 承载变化的isLogin的值
      return state.isLogin;
    },
    gethead(state) {
      // 承载变化的isLogin的值
      return state.headShow;
    },
    getLeft(state) {
      return state.leftShow;
    },
    getDeclareNumbuer(state) {
      return state.declareNumbuer;
    },
  },
  mutations: {
    saveToken(state, newdata) {
      // 自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
      state.token = newdata;
    },
    // 缓存sessionId
    saveSessionId(state, newdata) {
      state.sessionId = newdata;
    },
    saveId(state, newdata) {
      // 同上
      state.sessionId = newdata;
    },
    saveLogin(state, newdata) {
      // 同上
      state.isLogin = newdata;
    },
    saveHead(state, newdata) {
      // 同上
      state.headShow = newdata;
    },
    saveLeft(state, newdata) {
      state.leftShow = newdata;
    },
    saveMenuName(state, newdata) {
      state.menuName = newdata;
    },
    activeOpen(state, newdata) {
      state.menuOpen = newdata;
    },
    saveDeclareNumbuer(state, newdata) {
      state.declareNumbuer = newdata;
    },
    saveXinjianCount(state, newdata) {
      state.xinjianCount = newdata;
    },
  },
  actions: {
    changeToken(context, newdata) {
      // 自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
      context.commit("saveToken", newdata);
    },
    changeId(context, newdata) {
      // 同上注释
      context.commit("saveId", newdata);
    },
    changeLogin(context, newdata) {
      // 同上注释
      context.commit("saveLogin", newdata);
    },
    changeHead(context, newdata) {
      // 同上注释
      context.commit("saveHead", newdata);
    },
    changeLeft(context, newdata) {
      // 同上注释
      context.commit("saveLeft", newdata);
    },
    changDeclareNumbuer(context, newdata) {
      // 同上注释
      context.commit("saveDeclareNumbuer", newdata);
    },
    // changxinjianCount(context) {
    //   // 同上注释
    //   letterCount()
    //     .then((res) => {
    //       if (res.code == 0) {
    //         // console.log(1)
    //         context.commit("saveXinjianCount", res.data);
    //       }
    //     })
    //     .catch((err) => console.log(err));
    // },
  },
};
