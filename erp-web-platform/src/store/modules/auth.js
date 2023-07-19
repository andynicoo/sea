import { post, get } from '@/util/request'
import Store from '@/api/store.js'
import { cloneDeep } from 'lodash'
import { createTree, CookieUtil, objectToQueryString } from '@/util'
import bus from '@/bus'
import Member from '@/api/member'
import { v4 as uuid } from 'uuid'
import { notification } from 'ant-design-vue'

import Cookies from 'js-cookie'
const state = {
  access_token: null,
  expires_in: 3600,
  token_type: 'bearer',
  userInfo: {},
  memberInfo: {}, // 套餐信息
  menuList: [],
  buttonRules: {},
  storeListAll: [], // 所有店铺信息
  storeList: [], // 已授权的店铺信息(CNSC&&普通)
  basicStoreList: [], // 已授权的普通店铺信息
  storeListSize: [], // 已授权的店铺层级站点(CNSC&&普通)
  basicStoreListSize: [], // 已授权的普通店铺层级站点
  storeSumV1: null, // shopee授权店铺v1.0
  lazadaStoreListSize: [], //lazada已授权的店铺层级站点
  riskVisible: false, //lazada账号风险校验
  meals: [] // VIP套餐
}
const getters = {
  getAccessToken: (state) => state.access_token,
  getUserInfo: (state) => state.userInfo,
  getMemberInfo: (state) => state.memberInfo,
  buttonRules: (state) => state.buttonRules,
  getStoreListSize: (state) => state.storeListSize,
  getStoreListAll: (state) => state.storeListAll,
  getStoreList: (state) => state.storeList,
  getRiskVisible: (state) => state.riskVisible,
  getMeals: (state) => state.meals
}
function initRoles(data = []) {
  const map = data.reduce((init, cur) => {
    init[cur.menuId] = cur
    return init
  }, {})
  const roles = data.filter((item) => item.menuType === 'F')
  return (
    roles &&
    roles.reduce((init, cur) => {
      if (map[cur.parentId]) {
        const subKey = map[cur.parentId].href.replace(/^\//, '')
        init[subKey]
          ? init[subKey].push(cur.menuCode || cur.menuName)
          : (init[subKey] = [cur.menuCode || cur.menuName])
      }
      return init
    }, {})
  )
}
const actions = {
  login({ commit, dispatch }, params) {
    // 短信验证码和密码登录需要做区分
    let passwordType = {
      password: params.password
    }
    let smsType = {
      authType: 'smsVerifyCode',
      smsVerifyCode: params.mobileValidCode
    }
    if (params.riskCertification) {
      smsType.riskCertification = params.riskCertification
    }
    const commonParams = {
      client_id: 'emalacca_erp_web',
      scope: 'all',
      client_secret: '66d2dd0591cd1ebda67b7c250919d597',
      username: params.account,
      grant_type: 'password',
      language: CookieUtil.get('language'),
      ati: Cookies.get('_ati'),
      userIp: localStorage.userIp
    }

    let oauthParams = Object.assign(
      commonParams,
      params.type == 1 ? smsType : passwordType
    )

    return new Promise((resolve, reject) => {
      post('/oauth/token?' + objectToQueryString(oauthParams))
        .then(async (res) => {
          // if (false) {
          //   commit('RISK_VISIBLE', true)
          // } else {
          let { access_token, expires_in } = res
          // token过期时间
          commit('SET_LOGIN', { token: access_token, expires_in: expires_in })
          // token
          commit('SET_ACCESS_TOKEN', access_token)

          CookieUtil.set('refresh_token', access_token)

          // 是否是第三方授权登录，如果是就跳转到第三方回调地址页面，并携带access_token
          if (params.redirect_url) {
            location.href =
              params.redirect_url + '?access_token=' + access_token
          } else {
            dispatch('getUserDetailInfo', {
              maAccount: oauthParams.username,
              onlySetInfo: params.onlySetInfo
            })
          }

          const { data } = await Member.getMemberCouponUnusedPage()
          if (data.records.length) {
            const key = uuid()
            // notification.open({
            //   message: `您有未使用优惠券，点击查看>>`,
            //   placement: 'bottomRight',
            //   duration: null,
            //   key,
            //   onClick: () => {
            //     window._VV.$router.push({
            //       path: '/member/coupon'
            //     })
            //     notification.close(key)
            //   }
            // })
          }
          // }
        })
        .catch((err) => {
          let msg = err.response.data.message
          if (
            [
              '系统检测您的账号存在风险，请进行二次验证',
              '您的账号未进行二次认证，请先进行二次认证或者重新登录'
            ].includes(msg)
          ) {
            commit('RISK_VISIBLE', true)
          }
          reject(err)
        })
    })
  },

  // 根据maAccount获取用户详细信息
  getUserDetailInfo({ commit }, params) {
    let request = {
      maAccount: params.maAccount
    }
    return new Promise((resolve, reject) => {
      post('/user/member/account/getUserInfo?' + objectToQueryString(request))
        .then(async ({ data }) => {
          let { menuList, userInfo } = data
          menuList.forEach((element) => {
            if (
              ['商品发布', '店铺商品', '订单管理'].includes(element.menuName)
            ) {
              element.menuName = 'Shopee' + element.menuName
            }
          })
          //密码是否过期
          localStorage.expire = data.expire
          //是否是一乐用户
          localStorage.ylUser = data.ylUser
          //货代编号
          localStorage.invitationCode = data.invitationCode

          commit('setVars', { menuArr: cloneDeep(menuList) })

          // 取出所有按钮映射列表
          commit('SET_BUTTON_RULES', initRoles(menuList))

          // 组成树形菜单结构
          console.log(menuList)
          commit('SET_AUTH_MENU', createTree(menuList))

          // 配置用户信息，乱七八糟的包括菜单
          commit('SET_LOGIN_PROFILE', userInfo)
          if (data.expire) {
            setTimeout(() => {
              window._VV.$router.push({
                path: '/auth/find-password',
                query: { reset: 1 }
              })
              window._VV.$store.commit('SET_ACCESS_TOKEN', null)
              sessionStorage.clear()
              localStorage.clear()
            }, 10)
          } else if (!params.onlySetInfo) {
            // 如果只是为了初始化用户信息就不跳转
            window._VV.$router.push('/overview')
          }
          bus.$emit('getOrderListCount')
          // 获取所有店铺(若店铺信息太多,影响加载速度，不做异步处理)
          commit('GET_STORE_LIST')

          resolve(data)
        })
        .then((error) => {
          reject(error)
        })
    })
  },

  register({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      post('/oauth/register', params)
        .then(async (res) => {
          resolve(res)
          window._VV.successAlert(window._VV.$t('login.regSuccess'))
          // 注册完直接用账号登录
          let loginParams = {
            account: params.mobile,
            password: params.password,
            type: 2,
            onlySetInfo: true //不用默认跳转的标记
          }
          if (!params.needWelcome) {
            loginParams.onlySetInfo = false
          }
          // 去登录
          let loginResult = await dispatch('login', loginParams)
          // 自然注册的人需要欢迎一下
          // if (!params.needWelcome && loginResult) {
          //   window._VV.$router.push('/overview')
          // }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //获取验证码
  getSMSCode({}, params) {
    return new Promise((resolve, reject) => {
      post('/oauth/sendSms', params)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //设置新密码
  findPwd({}, params) {
    return new Promise((resolve, reject) => {
      post('/user/member/info/findPwd', params)
        .then((res) => {
          resolve(res)
          window._VV.successAlert(window._VV.$t('login.succModified'))
          window._VV.$router.push('/auth/login')
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 获取用户账户信息
  getMemberInfo() {
    return new Promise((resolve, reject) => {
      get('/user/member/info/self')
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 设置用户头像
  setAvatar({ commit }, url) {
    commit('SET_AVATAR', url)
  },

  // 设置优惠券
  setMeals({ commit }, data) {
    commit('SET_MEALS', data)
  }
}
const mutations = {
  SET_AVATAR(state, url) {
    state.userInfo.headImgurl = url
  },
  SET_LOGIN(state, { token, expires_in }) {
    state.access_token = token
    state.expires_in = expires_in || 720000
  },
  SET_ACCESS_TOKEN(state, token) {
    state.access_token = token
  },
  SET_LOGIN_PROFILE(state, payload) {
    state.userInfo = payload
  },
  SET_MEMBER_INFO(state, payload) {
    state.memberInfo = payload
  },
  SET_AUTH_MENU(state, payload) {
    payload.map((el) => (el.active = false))
    state.menuList = payload
  },
  SET_BUTTON_RULES(state, payload) {
    state.buttonRules = payload
  },
  SET_MEALS(state, payload) {
    state.meals = payload
  },
  //展开菜单
  SET_EXPAND(state, expandIndex) {
    let menuList = JSON.parse(JSON.stringify(state.menuList))
    menuList.map((el) => (el.active = false))
    if (menuList[expandIndex]) {
      menuList[expandIndex].active = true
      state.menuList = menuList
    }
  },
  //风险校验
  RISK_VISIBLE(state, flag) {
    state.riskVisible = flag
  },
  // 获取店铺列表
  // async GET_STORE_LIST(state) {
  //   let { data } = await Store.getAllStore()
  //   state.storeListAll = data
  //   let shopeeStore = data.filter((item) => item.platform === 1)
  //   let lazadaStore = data.filter((item) => item.platform === 2)
  //   state.storeList = shopeeStore.filter((item) => item.authorizedStatus === 1)
  //   state.storeSumV1 = shopeeStore.filter(
  //     (item) => item.authorizedStatus === 1 && item.authType === 1
  //   ).length
  //   handleStoreData(data, state)
  //   //获取lazada店铺列表
  //   state.lazadaStoreListSize = handleStoreListSize(lazadaStore)
  // },
  async GET_STORE_LIST(state) {
    let { data } = await Store.getAllStore()
    state.storeListAll = data
    state.storeSumV1 = data.filter(
      (item) => item.authorizedStatus === 1 && item.authType === 1
    ).length
    handleStoreData(data, state)
  },
  // 更新店铺别名
  async UPDATED_STORE_ALIAS(state, item) {
    if (state.storeListAll.length === 0) {
      return
    }
    let isAuthorized = false
    state.storeListAll.map((val) => {
      if (val.storeId === item.storeId) {
        isAuthorized = item.authorizedStatus === 1
        val.storeAlias = item.storeAlias
      }
    })
    // 已授权的店铺修改别名时，更新授权店铺信息
    if (isAuthorized) {
      let storeObj = handleStoreData(state.storeListAll, state)
      state = Object.assign({}, state, storeObj)
    }
  }
}
// 店铺信息处理
function handleStoreData(data, state) {
  state.storeList = data.filter(
    (item) => item.authorizedStatus === 1 && item.platform === 1
  )
  let lazadaStore = data.filter(
    (item) => item.authorizedStatus === 1 && item.platform === 2
  )
  state.basicStoreList = state.storeList.filter((item) => !item.merchantId)
  state.storeListSize = handleStoreListSize(state.storeList)
  state.basicStoreListSize = handleStoreListSize(state.basicStoreList)
  //获取lazada店铺列表
  state.lazadaStoreListSize = handleStoreListSize(lazadaStore)
}
// 店铺站点对象转换层级站点类型
function handleStoreListSize(data = []) {
  let arr = []
  let tree = []
  console.log(data)
  data.map((item) => {
    // 判断是否有店铺别名，有则显示别名，否则显示店铺名称
    let itemObj = {
      label: item.storeAlias ? item.storeAlias : item.storeName,
      value: item.storeId
    }
    let children = Object.assign({}, item, itemObj)
    if (arr.includes(item.countryCode)) {
      tree.map((cou) => {
        if (cou.value === item.countryCode) {
          cou.children.push(children)
        }
      })
    } else {
      arr.push(item.countryCode)
      let obj = {
        label: item?.countryName ?? '跨境',
        value: item.countryCode,
        children: [children]
      }
      tree.push(obj)
    }
  })
  return tree
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
