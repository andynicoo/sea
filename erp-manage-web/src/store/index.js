import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

let loadingCount = 0
const VuexLocal = new VuexPersistence({
  key: 'erp-manage',
  storage: window.localStorage
})
const store = new Vuex.Store({
  state: {
    vars: {
      auth: {}
    }
  },
  mutations: {
    setVars(state, vars) {
      if (vars instanceof Array) {
        const obj = Object.assign({}, state.vars)
        const value = vars.pop()
        let formatKeyPath = []
        vars.forEach(item => {
          if (item instanceof Array) {
            formatKeyPath = formatKeyPath.concat(item)
          } else {
            formatKeyPath.push(item)
          }
        })
        const loop = (tempObj, i, len) => {
          if (i + 1 < len) {
            loop(tempObj[formatKeyPath[i]], i + 1, len)
          } else {
            tempObj[formatKeyPath[i]] = value
          }
        }
        loop(obj, 0, formatKeyPath.length)
        state.vars = obj
      } else {
        if (vars.isLoading === true) {
          vars.isLoading = Boolean(++loadingCount)
        }
        if (vars.isLoading === false) {
          vars.isLoading = Boolean(--loadingCount)
        }
        state.vars = Object.assign({}, state.vars, vars)
      }
    },
    // 清除对应的vars,暂时直接置空处理
    clearVars(state, key) {
      if (key) {
        state.vars[key] = null
      } else {
        state.vars = {}
      }
    }
  },
  getters: {
    getAccessToken: state => state.vars?.auth?.token,
    roles: state => state.vars?.auth?.roles || [],
    superAdmin: state => state.vars?.auth?.userInfo?.role === 'superAdmin'
  },
  modules,
  plugins: [VuexLocal.plugin]
})
export default store
