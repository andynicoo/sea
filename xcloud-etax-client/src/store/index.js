import Vue from 'vue';
import Vuex from 'vuex';

// getters
import getters from './getters';

// modules
import app from './modules/app';
import order from './modules/order';
import login from './modules/login';
import breadcrumb from './modules/breadlist';
import bureau from './modules/bureau';
import dynamicForm from './modules/dynamicForm';

// use vuex
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    login,
    breadcrumb,
    bureau,
    order,
    dynamicForm,
  },
  getters,
});

// export store
export default store;
