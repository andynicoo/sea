import Vue from "vue";
import Vuex from "vuex";
import Cookies from "js-cookie";
import userInfo from "./module/userInfo";
import common from "./module/common";
import trademark from "./module/trademark";
import staticConfig from './module/static'
Vue.use(Vuex);

const NODE_PLA = process.env.NODE_PLA;
const NODE_ENV = process.env.NODE_ENV;
import config from "../static/config";
const SERVER_URL = config[NODE_PLA][NODE_ENV];
const store = () =>
  new Vuex.Store({
    state: {
      modules: [],
      app: "ksy",
      isLogined: false,
      carNum: 0,
      auth: {},
      token: "",
      apps: [],
      sdk: null,
      pageInfo: {},
      host: {
        SERVER_URL,
        server_url: SERVER_URL,
        // 服务详情
        detail_url: SERVER_URL + config[NODE_PLA].detail_url,
        // 优惠券
        coupon_url: SERVER_URL + (process.env.NODE_PLA === "kby" ? "/coupon" : "/receiveCoupon"),
      },
      historySearchText: [],
      dimShow: false, // 灰色遮罩
      searchBox: false, // search页面searchbox显示控制
      collectParams: {
        trademarkAiNameId: "", // AI取名ID
        trademarkAiNameNo: "", // ai名称唯一标识
        trademarkAiNameTime: "", // AI取名时间
        trademarkLogInfo: "", // 商标log样式 class 名称
        trademarkName: "", // 商标名称
        isFavourite: 0, // 是否收藏 0:未收藏 1:已收藏
      },
      showLoginPop: false, // 是否显示全局登录框
      typeCategory: ["查商标", "查申请人", "查代理律师", "查宣誓时间", "查商标状态", "查使用证据"]
    },
    mutations: {
      setPageInfo(state, data) {
        state.pageInfo = data;
      },
      setUserData(state, data) {
        state.auth = data;
      },
      setIsLogined(state, data) {
        state.isLogined = data.isLogined;
      },
      setCarNum(state, data) {
        state.carNum = data.carNum;
      },

      init_apps(state, payload) {
        state.sdk = payload;
      },
      setModulesData(state, payload) {
        state.modules = payload;
      },
      setHistorySearchText(state, data) {
        state.historySearchText = data;
      },
      setDimData(state, data) {
        state.dimShow = data.show;
      },
      setSearchBoxData(state, data) {
        state.searchBox = data.show;
      },
      setCollectParams(state, payload) {
        state.collectParams = payload;
      },
      updateCollect(state, payload) {
        state.collectParams = { ...state.collectParams, ...{ isFavourite: payload } };
      },
      setLoginPopData(state, data) {
        state.showLoginPop = data.show;
      },
    },
    getters: {
      isLogin(state) {
        return Boolean(state.token || Cookies.get("token"));
      },
      unitMap() {
        return {
          1: "年",
          2: "个",
          3: "次",
          4: "类",
        };
      },
    },
    modules: {
      userInfo,
      common,
      trademark,
      staticConfig
    },
  });

export default store;
