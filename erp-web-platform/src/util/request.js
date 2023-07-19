import axios from 'axios'
import store from '@/store'
import router from '../router/index'
import Cookies from 'js-cookie'
import { Modal } from 'ant-design-vue'
import qs from 'qs'
import baseURL from '@/util/baseUrl'

// create axios
const service = axios.create({
  baseURL: baseURL, // api base_url
  timeout: 100000, // timeout,
  headers: { 'Access-Control-Allow-Origin': '*' },
  paramsSerializer: function(params) {
    return qs.stringify(params)
  }
})

// 清除token滚去登录
service.clearTokenToLogin = () => {
  window._VV.$store.commit('SET_ACCESS_TOKEN', null)
  setTimeout(() => {
    router.push({
      path: '/auth/login'
    })
  }, 1500)
}

let uid = null
// 公共错误提示
const failed = (error) => {
  const { status, data = {}, config, request } = error.response || {}

  // token失效需要重定向
  if (request.responseURL && /redirect_uri/.test(request.responseURL)) {
    // window._VV.errorAlert(data.message)
    service.clearTokenToLogin()
  }

  if (data?.code === 999999 && !uid) {
    uid = 1
    Modal.confirm({
      content: data.message || '店铺授权失效,请重新授权',
      okText: '去授权',
      onOk: () => {
        router.replace('/store')
        uid = null
      },
      onCancel: () => {
        uid = null
      }
    })
    return Promise.reject(error)
  }
  if (config?.hideError) {
    return Promise.reject(error)
  }

  if (/300/.test(data.code)) {
    window._VV.errorAlert(data.message)
    service.clearTokenToLogin()
  }

  switch (Number(status)) {
    case 400:
      try {
        let enc = new TextDecoder('utf-8')
        let data = JSON.parse(enc.decode(new Uint8Array(error.response.data)))
        window._VV.errorAlert(data.message || '请求出错，请稍后重试')
      } catch (error) {
        window._VV.errorAlert(data.message || '请求出错，请稍后重试')
      }
      break
    case 440:
    case 401:
      window._VV.errorAlert(data.message || '授权信息错误，请重新登录')
      service.clearTokenToLogin()
      break
    case 403:
      window._VV.errorAlert('拒绝访问')
      break
    case 500:
      window._VV.errorAlert('服务器繁忙，请稍后重试')
      break
    case 504:
      window._VV.errorAlert('请求超时，请稍后重试')
      break
    default:
      window._VV.errorAlert('服务器异常，请稍后重试')
      break
  }
  return Promise.reject(error)
}

// request interceptor

service.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Content-Type'] = 'application/json'
  if (store.getters.getAccessToken) {
    config.headers['Authorization'] = 'Bearer ' + store.getters.getAccessToken
  }
  config.headers['language'] = Cookies.get('language')
  return config
}, failed)

//  response interceptor
// 不需要系统Alert接口白名单
// const NoAlertWhiteList = ['/basic/translate/images']

/**
 * @description 网关统一处理规则
 * @param {*} url
 */
const isNeedAccGateway = (url) => {
  // 如果是采集或tms服务，保持不动
  if (
    /crawl|tmsPow|tmsFow|tms|mg-advertising|https|forwardertms|statistics/.test(
      url
    )
  ) {
    return url
  }
  const regIs = /^\/selection|^\/order|^\/oauth|^\/acc|^\/user|^\/store|^\/message|^\/goods|^\/product|^\/supplier|^\/cnsc|^\/picture|\/unsalable.*$/.test(
    url
  )
  if (!regIs && !/^\/member-package.*$/.test(url)) {
    return '/acc' + url
  }
  // cnsc的认领属于product服务下的，但已单独加前缀
  if (/^\/product.*$/.test(url) && !/^\/product\/cnsc.*$/.test(url)) {
    return '/product' + url
  }
  // cnsc 网关已独立
  if (
    /^\/goods|^\/cnsc.*$/.test(url) &&
    !/cnsc/.test(url) &&
    !/^\/goods\/product\/unsalable.*$/.test(url)
  ) {
    return '/goods' + url
  }
  if (/^\/supplier.*$/.test(url)) {
    return '/product' + url
  }
  return url
}

service.interceptors.response.use((res) => {
  const { data, config } = res
  // 将后端的“0”转为number 0
  data.code = Number(data.code)
  if (['put', 'post', 'delete', 'patch'].includes(config.method) && data.meta) {
    window._VV.errorAlert(data.meta.message)
  }
  // 图片翻译700~1000时code==-1,此时不使用下方的公用提示，使用第二个接口的提示
  // 会员系统上线后，统一使用3019999判定提示
  // if (
  //   data.code !== undefined &&
  //   data.code != 0 &&
  //   !NoAlertWhiteList.includes(config.url)
  // ) {
  //   window._VV.errorAlert(data.message)
  // }

  if (data.code === 3019999) {
    //3019999 超量返回
    Modal.confirm({
      title: '温馨提示',
      content: data.message || '用量已用完，请升级会员套餐',
      okText: '知道了',
      onOk: () => {
        // router.replace('/member/Index')
      },
      onCancel: () => {
        // uid = null
      }
    })
  }

  if (data?.code === 999999) {
    Modal.confirm({
      content: data.message || '店铺授权失效,请重新授权',
      okText: '去授权',
      onOk: () => {
        Modal.destroyAll()
        router.replace('/store')
      },
      onCancel: () => {
        Modal.destroyAll()
      }
    })
  }

  return data || null
}, failed)

/**
 * http方法，
 * @param {String} url [请求的url地址]
 * @param {String} method [请求时类型get, post]
 * @param {Object} args [请求时类型responseType]
 */
export function http({ url, method, ...args }) {
  return new Promise((resolve, reject) => {
    service({
      url: isNeedAccGateway(url),
      method,
      ...args
    })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        window._VV.$store.commit('setRequestStatus', false)
      })
  })
}
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(isNeedAccGateway(url), { params: params })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        window._VV.$store.commit('setRequestStatus', false)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(isNeedAccGateway(url), params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        window._VV.$store.commit('setRequestStatus', false)
      })
  })
}

/**
 * del方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

export function del(url, params) {
  return new Promise((resolve, reject) => {
    service
      .delete(isNeedAccGateway(url) + params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        window._VV.$store.commit('setRequestStatus', false)
      })
  })
}

export default service
