import Vue from 'vue';
import Vuex from 'vuex';

import user from './module/user';
import app from './module/app';
import taxBureau from './module/taxBureau';
import check from './module/check';

import workerDetail from '../view/module/intellectualProperty/trademark/trademarkStore/workerDetail';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    taxBureau,
    workerDetail,
    check,
  },
});
