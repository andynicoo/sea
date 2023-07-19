import axios from 'axios'
import Vue from 'vue'
import store from '@/store'
import BASE_URL from './baseUrl'
import router from '@/router'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000
})

// let uid = 0
let requestList = []

// 移除uid
// eslint-disable-next-line no-unused-vars
function removeUid(config = {}) {
  const index = requestList.findIndex((item) => item === config?.uid)
  if (index > -1) {
    requestList.splice(index, 1)
  } else {
    // 处理报错无返回的情况-暂时清空处理
    requestList = []
  }
}
service.interceptors.request.use(
  (config) => {
    // 记录每次请求的uid
    // config.uid = uid++
    // requestList.push(config.uid)

    if (store.getters.getAccessToken && !/oauth/.test(config.url)) {
      config.headers['Authorization'] = 'Bearer ' + store.getters.getAccessToken
    }

    if (config.method === 'get') {
      config.params = Object.assign({}, config.params, config.data)
      config.params._nowTime = Date.now()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (res) => {
    // removeUid(res?.config)
    return res
  },
  (error) => {
    const { status, data } = error?.response || {}
    // removeUid(config)
    console.log(status)
    switch (Number(status)) {
      case 401:
        store.commit('clearVars')
        router.replace(`/login?_=${Date.now()}`)
        return Promise.reject({
          message: data?.message || '登录已过期'
        })
      case 400:
        return Promise.reject({
          message: data?.message || '服务器开小差了,请稍后再试吧'
        })

      default:
        break
    }
    return Promise.reject(data)
  }
)
/** axios请求封装
 * @param {Boolean} showMessage 显示全局提示(message)
 * @param {Boolean} showLoading 显示全局spin(loading)
 */
export default function http({
  url,
  method,
  showLoading = true,
  showMessage = true,
  ...args
}) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      // store.commit('setLoading', true)
      store.commit('setVars', { isLoading: true })
    }
    service({
      url,
      method,
      ...args
    })
      .then(
        (res) => {
          const { config } = res
          const { code } = res.data
          if (
            code === '0' ||
            code === 0 ||
            config?.responseType === 'arraybuffer' ||
            url.indexOf('oauth/token') > -1
          ) {
            resolve(res.data)
          } else {
            reject()
          }
        },
        (error) => {
          if (showMessage) {
            Vue.prototype.$message.error(error?.message || '服务器错误')
          }
          reject(error)
        }
      )
      .finally(() => {
        // if (!requestList.length) store.commit('setLoading', false)
        if (showLoading) store.commit('setVars', { isLoading: false })
      })
  })
}
