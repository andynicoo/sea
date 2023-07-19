import Order from '@/api/order'
import Goods from '@/api/goods'
// import { COUNTRY } from '@/util/erp.conf'
const state = {
  editProductInfo: null,
  logistics: [], //物流
  category: {}, //商品类目
  storeList: [], //店铺列表
  merchantList: [], // cnsc商户列表
  targetLangList: [], //翻译目标语言,
  targetLangListAli: [], //翻译目标语言阿里,
  illegalWord: [], // 敏感词
  storeLimit: {}, // 站点限制
  selectPlatform: 'Shopee',
  productCount: {} // 商品发布tab 数量
}

const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x) => fn(v, x))) acc.push(v)
    return acc
  }, [])
const buildNextCateList = (currentIndex, data) => {
  let nextKey = 'level' + (currentIndex + 2)
  return { key: nextKey, data: data }
}

// getters
const getters = {}

// actions
const actions = {
  // 同步物流
  syncLogistics({ commit }, params) {
    return new Promise((resolve, reject) => {
      Order.handleSyncLogistics(params)
        .then(({ data }) => {
          resolve(data)
          commit('setLogistics', data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 类目初始化
  initCategory({ commit }, args) {
    let { cateId, index, storeId } = args
    let params = {
      parentId: cateId,
      storeId: storeId
    }
    Goods.getShopeeCategoryList(params).then(({ data }) => {
      if (index == 1000) {
        commit('setCategory', { key: 'level1', data: data })
      } else {
        commit('setCategory', buildNextCateList(index, data))
      }
    })
  },

  /**
   * 规则是，如果指定对应的currency，就返回当地的语言和英语，对应普通店铺
   * 如果没有拿到是all，就返回所有可用语言，对应cnsc店铺
   *
   * @param {*} { commit }
   * @param {*} payload
   */
  setTargetLangList({ commit }, payload) {
    let { countryCode, currency } = payload || {} //跟着货币或者countryCode找语言
    const COUNTRY = [
      {
        key: 'TH',
        lang: 'TH',
        currency: 'TH',
        langName: '泰语'
      },
      {
        key: 'MY',
        lang: 'MS',
        currency: 'MYR',
        langName: '马来语'
      },
      {
        key: 'VN',
        lang: 'VIN',
        currency: 'VND',
        langName: '越南语'
      },
      {
        key: 'ID',
        lang: 'ID',
        currency: 'IDR',
        langName: '印尼语'
      },
      {
        key: 'pt',
        lang: 'PTB',
        currency: 'PRT',
        langName: '葡萄牙语'
      },
      {
        key: 'es',
        lang: 'ESP',
        currency: 'ESP',
        langName: '西班牙语'
      },
      {
        key: 'SG',
        lang: 'ENG',
        currency: 'SGD',
        langName: '英语'
      },
      {
        key: 'TW',
        lang: 'CHT',
        currency: 'TWD',
        langName: '中文（繁体）'
      }
      //   {
      //     key: 'TH',
      //     lang: 'TH',
      //     currency: 'THB',
      //     langName: '泰语'
      //   },
      //   {
      //     key: 'MY',
      //     lang: 'MY',
      //     currency: 'MYR',
      //     langName: '马来语'
      //   },
      //   {
      //     key: 'VN',
      //     lang: 'VN',
      //     currency: 'VND',
      //     langName: '越南语'
      //   },
      //   {
      //     key: 'ID',
      //     lang: 'ID',
      //     currency: 'IDR',
      //     langName: '印尼语'
      //   },
      //   {
      //     key: 'pt',
      //     lang: 'pt',
      //     currency: 'PRT',
      //     langName: '葡萄牙语'
      //   },
      //   {
      //     key: 'es',
      //     lang: 'es',
      //     currency: 'ESP',
      //     langName: '西班牙语'
      //   },
      //   {
      //     key: 'SG',
      //     lang: 'EN',
      //     currency: 'SGD',
      //     langName: '英语'
      //   },
      //   {
      //     key: 'CN',
      //     lang: 'CN',
      //     currency: 'CNY',
      //     langName: '中文（简体）'
      //   },
      //   {
      //     key: 'TW',
      //     lang: 'TW',
      //     currency: 'TWD',
      //     langName: '中文（繁体）'
      //   }
    ]

    let matchCountry = COUNTRY.find(
      (el) =>
        el.currency == currency || el.key == currency || el.key == countryCode
    )
    let targetLang = []
    console.log(currency, countryCode, matchCountry, 'matchCountry')
    if (matchCountry) {
      targetLang = [
        {
          type: countryCode,
          lang: matchCountry.lang,
          name: matchCountry.langName
        }
      ]
    } else {
      targetLang = Array.from({ length: COUNTRY.length }, (v, k) => {
        return {
          lang: COUNTRY[k].lang,
          name: COUNTRY[k].langName
        }
      })
    }

    commit('setTargetLangList', targetLang)
  },
  //有两套翻译接口-文字翻译用这个
  setTargetLangListAli({ commit }, payload) {
    let { countryCode, currency } = payload || {} //跟着货币或者countryCode找语言
    const COUNTRY = [
      {
        key: 'TH',
        lang: 'th',
        currency: 'THB',
        langName: '泰语'
      },
      {
        key: 'MY',
        lang: 'ms',
        currency: 'MYR',
        langName: '马来语'
      },
      {
        key: 'VN',
        lang: 'vi',
        currency: 'VND',
        langName: '越南语'
      },
      {
        key: 'ID',
        lang: 'id',
        currency: 'IDR',
        langName: '印尼语'
      },
      {
        key: 'pt',
        lang: 'pt',
        currency: 'PRT',
        langName: '葡萄牙语'
      },
      {
        key: 'es',
        lang: 'es',
        currency: 'ESP',
        langName: '西班牙语'
      },
      {
        key: 'SG',
        lang: 'en',
        currency: 'SGD',
        langName: '英语'
      },
      {
        key: 'CN',
        lang: 'zh',
        currency: 'CNY',
        langName: '中文（简体）'
      },
      {
        key: 'TW',
        lang: 'zh-TW',
        currency: 'TWD',
        langName: '中文（繁体）'
      },
      {
        key: 'BR',
        lang: 'pt',
        currency: 'BRL',
        langName: '巴西语'
      },
      {
        key: 'PL',
        lang: 'pl',
        currency: 'PLN',
        langName: '波兰语'
      },
      {
        key: 'FR',
        lang: 'fr',
        currency: 'FRF',
        langName: '法语'
      }
    ]

    let matchCountry = COUNTRY.find(
      (el) =>
        el.currency == currency || el.key == currency || el.key == countryCode
    )
    let targetLang = []
    console.log(currency, countryCode, matchCountry, 'matchCountry')
    if (matchCountry) {
      targetLang = [
        {
          type: countryCode,
          lang: matchCountry.lang,
          name: matchCountry.langName
        }
      ]
    } else {
      targetLang = Array.from({ length: COUNTRY.length }, (v, k) => {
        return {
          lang: COUNTRY[k].lang,
          name: COUNTRY[k].langName
        }
      })
    }

    commit('setTargetLangListAli', targetLang)
  }
}

// mutations
const mutations = {
  setEditProductInfo(state, payload) {
    state.editProductInfo = payload
  },
  setLogistics(state, payload) {
    state.logistics = payload
  },
  setCategory(state, payload) {
    if (payload) {
      let { key, data } = payload
      state.category[key] = data
    } else {
      state.category = {}
    }
  },
  setStoreList(state, payload) {
    state.storeList = payload
  },

  setProductCount(state, payload) {
    state.productCount = payload
  },

  setMerchantList(state, payload) {
    state.merchantList = payload
  },

  setTargetLangList(state, payload) {
    let targetLang = payload || []
    state.targetLangList = [
      {
        type: 'EN',
        lang: 'ENG',
        name: window._VV.$t('common.english')
      }
    ].concat(targetLang)
    state.targetLangList = uniqueElementsBy(
      state.targetLangList,
      (a, b) => a.lang == b.lang
    )
  },
  setTargetLangListAli(state, payload) {
    let targetLang = payload || []
    state.targetLangListAli = [
      {
        type: 'EN',
        lang: 'en',
        name: window._VV.$t('common.english')
      }
    ].concat(targetLang)
    state.targetLangListAli = uniqueElementsBy(
      state.targetLangListAli,
      (a, b) => a.lang == b.lang
    )
  },
  setIllegalWord(state, payload) {
    state.illegalWord = payload
  },
  setStoreLimit(state, payload) {
    state.storeLimit = payload
  },
  setSelectPlatform(state, val) {
    state.selectPlatform = val
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
  onlyDev: true
}
