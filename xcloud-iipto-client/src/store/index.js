import Vue from 'vue';
import Vuex from 'vuex';
import login from './module/login';
import breadcrumb from './module/breadlist';
import bureau from './module/bureau';
import activety from './module/315Activity';
import userInfo from './module/userInfo';
import app from './module/app';
import newOa from './module/newOa';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    key: Date.now(),
  },
  mutations: {
    increment(state) {
      state.key = Date.now();
    },
  },
  actions: {
    //
  },
  modules: {
    login,
    breadcrumb,
    activety,
    bureau,
    app,
    newOa,
    userInfo
  },
});
