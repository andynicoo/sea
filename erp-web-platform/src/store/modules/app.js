import { getLanguage } from '@/lang/index'
import Cookies from 'js-cookie'

const state = {
  mode: 'light',
  themeColor: '#F7622F',
  drawerWidth: '236',
  requestIsLoading: false, //当前请求状态
  systemConfig: {}, //系统配置，
  language: getLanguage(),
  leftMenuList: {}
}

// getters
const getters = {
  site: (state) => {
    return {
      SG: window._VV.$t('common.SG'),
      PH: window._VV.$t('common.PH'),
      MY: window._VV.$t('common.MY'),
      ID: window._VV.$t('common.ID'),
      TH: window._VV.$t('common.TH'),
      VN: window._VV.$t('common.VN'),
      BR: window._VV.$t('common.BR'),
      TW: window._VV.$t('common.TW'),
      MX: '墨西哥',
      CL: '智利',
      CO: '哥伦比亚',
      ES: '西班牙',
      PL: '波兰',
      FR: '法国',
      IN: '印度',
      CNSC: 'CNSC'
    }
  }
}

// actions
const actions = {
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  }
}

// mutations
const mutations = {
  setThemeColor(state, payload) {
    state.themeColor = payload
  },
  setRequestStatus(state, payload) {
    state.requestIsLoading = payload
  },
  changeDrawerWidth(state, payload) {
    state.drawerWidth = payload
  },
  setSystemConfig(state, payload) {
    state.systemConfig = payload
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },
  SET_LEFT_MENU(state, payload) {
    state.leftMenuList = payload
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
