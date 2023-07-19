import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import mutations from './mutations'
import state from './state'

// 定义只在开发环境需要持久化的模块

const Env = process.env.NODE_ENV

const DevModules = ['product', 'app']

const vuexLocal = new VuexPersistence({
  key: 'erp',
  storage: window.localStorage,
  modules: ['auth', 'app', 'vars'].concat(
    Env == 'development' ? DevModules : []
  )
})

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  modules,
  plugins: [vuexLocal.plugin],
  getters,
  mutations
})

export default store
