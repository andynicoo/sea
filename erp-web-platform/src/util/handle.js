import { v4 as uuidv4 } from 'uuid'
import { URL } from './regex'
import { imgurlToBase64 } from '@/util/canvas'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

/**
 * 图片批量压缩下载到本地
 * @param {*} imgs 图片url数组
 */
export function imagesDownload(imgs, name) {
  if (!imgs.length) return Promise.reject('请选择要下载的图片')
  const com = imgs.map(async (img) => {
    const sl = img.split('/')
    const name = sl[sl.length - 1]
    let imgData = await imgurlToBase64(img)
    imgData = imgData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
    return { name, imgData }
  })
  return Promise.all(com).then((base64s) => {
    const zip = new JSZip()
    base64s.forEach(({ name, imgData }) =>
      zip.file(name, imgData, { base64: true })
    )
    zip.generateAsync({ type: 'blob' }).then((content) => {
      FileSaver(content, `${name}.zip`)
    })
  })
}

const getFileSuffix = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

const renderImageObj = (url) => {
  return {
    uid: uuidv4(),
    name: `${uuidv4()}.${getFileSuffix(url)}`,
    thumbUrl: url,
    status: 'done',
    percent: 100
  }
}

/**
 * 处理ant design 图片上传数据
 */
export function loadUploadImage(images, max) {
  if (!images) return []
  try {
    images = JSON.parse(images)
  } catch (error) {
    images = []
    console.error(error)
  }
  if (max) images = images.slice(0, max)
  if (!images.map) return []
  return images.map((url) => renderImageObj(url))
}
export function unloadUploadImage(images) {
  if (!images) images = []
  images = images.map(({ thumbUrl }) => thumbUrl)
  return JSON.stringify(images)
}

/**
 * 对象转url参数字符串
 */
export function objectToUrlParams(obj) {
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key] || ''}`)
    .join('&')
}

/**
 * url参数字符串转对象
 */
export function urlParamsToObject(params) {
  let obj = {}
  params.split('&').forEach((element) => {
    const [ket, value] = element.split('=')
    obj[ket] = value
  })
  return obj
}

/**
 * 获取元素的父级元素（tagName）
 */
export function getParentNodeByTagName(element, tagName, callback) {
  if (element.__proto__ instanceof Element) {
    if (element && element.tagName.toLowerCase() == tagName) {
      callback(element)
    } else {
      getParentNodeByTagName(element.parentElement, tagName, callback)
    }
  } else {
    throw new Error('类型错误')
  }
}

/**违规词警告 */
export function getWarnKeywordWarn(illegalWord, word) {
  const words = illegalWord
    .map(({ content }) => {
      const reg = new RegExp(content, 'g')
      if (reg.test(word)) {
        return content
      }
    })
    .filter(Boolean)
  if (words.length) {
    return this.$t('edit.keywordwarning', { word: words.join() })
  }
  return null
}

export const checkCollectSiteCookieB = (callback) => {
  window.postMessage({ action: 'get-collect-site-cookies' }, '*')

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const pluginAuthDOM = document.querySelector(
          '#emalacca-chrome-extension-purchas-auth'
        )
        if (!pluginAuthDOM) {
          if (callback) {
            callback()
          }
          resolve({})
        }
        const pluginVersionDOM = document.querySelector(
          '#emalacca-chrome-extension-installed'
        )
        if (!pluginVersionDOM || !pluginVersionDOM.getAttribute('version')) {
          if (callback) {
            callback()
          }
          resolve({})
        }

        resolve({
          yangkeduo: pluginAuthDOM.getAttribute('ispddlogin'),
          1688: pluginAuthDOM.getAttribute('is1688login'),
          taobao: pluginAuthDOM.getAttribute('islogintaobao'),
          tmall: pluginAuthDOM.getAttribute('islogintmall'),
          alibabavalidcookies: pluginAuthDOM.getAttribute('alibabavalidcookies')
        })
      } catch (error) {
        resolve({})
      }
    }, 2000)
  })
}

/**
 * cookies 字符串转对象
 * @param {*} cookies
 * @returns
 */
export const cookieToJson = (cookies) => {
  let cookieArr = cookies.split(';')
  let obj = {}
  cookieArr.forEach((i) => {
    let arr = i.split('=')
    obj[arr[0].replace(/\s*/g, '')] = arr[1]
  })
  return obj
}

export const handleJudgeLink = (url) => {
  if (!URL.test(url)) {
    console.log('不是有效链接')
    return false
  } else {
    let match = url.match(/1688|taobao|tmall|yangkeduo/)
    return match ? match[0] : 'other'
  }
}

// 获取淘宝或天猫指定的 cookies x5sec 属性
export async function getx5secCookie(
  site,
  type,
  store = null,
  getAllDetail = false
) {
  let siteCookies = await checkCollectSiteCookie()
  let targetSite = site || 'taobao'
  let targetType = type || 'detail'
  let allCookiesArr = siteCookies['alibabavalidcookies']
    ? JSON.parse(siteCookies['alibabavalidcookies'])
    : null
  let belongDomain = null
  const siteMap = {
    tmall: {
      store: 'STORE.tamll.com',
      list: ['tmatch.simba.taobao.com'],
      detail: ['mdskip.taobao.com']
    },
    taobao: {
      store: 'STORE.taobao.com',
      list: ['s.taobao.com'],
      detail: ['detailskip.taobao.com', 'rate.taobao.com']
    }
  }
  if (!allCookiesArr) {
    return {
      taobao: '',
      tmall: ''
    }
  }
  // 获取所有详情cookie
  if (getAllDetail) {
    let taobaoDetail = allCookiesArr.find(
      (el) =>
        el.domain == 'detailskip.taobao.com' || el.domain == 'rate.taobao.com'
    )
    let tmallDetail = allCookiesArr.find(
      (el) => el.domain == 'mdskip.taobao.com'
    )
    return {
      taobao: taobaoDetail ? ' ;x5sec=' + taobaoDetail.value : '',
      tmall: tmallDetail ? ' ;x5sec=' + tmallDetail.value : ''
    }
  }
  if (targetType == 'list') {
    belongDomain = siteMap[targetSite][targetType]
  }
  if (targetType == 'detail') {
    belongDomain = siteMap[targetSite][targetType]
  }
  if (targetType == 'store') {
    belongDomain = siteMap[targetSite][targetType].replace(
      new RegExp('STORE'),
      store
    )
  }

  if (belongDomain) {
    let match = allCookiesArr.find(
      (el) => el.domain == belongDomain[0] || el.domain == belongDomain[1]
    )
    return {
      taobao: match ? ' ;x5sec=' + match.value : '',
      tmall: match ? ' ;x5sec=' + match.value : ''
    }
  }
}

/**
 * 组装淘宝天猫16888必要的cookies属性
 * @param {*} params
 * @returns
 */
export async function collectSiteCookies(params) {
  let { site = null, type = null, store = null, getAllDetail = false } =
    params || {}
  window.postMessage({ action: 'get-collect-site-cookies' }, '*')
  let siteCookies = await checkCollectSiteCookie()
  console.log(
    '查询到到x5sec:',
    await getx5secCookie(site, type, store, getAllDetail)
  )
  let x5sec = await getx5secCookie(site, type, store, getAllDetail)
  return [
    // {
    //   siteCode: 'tb',
    //   userReqCookie: siteCookies['taobao']
    // },
    // {
    //   siteCode: 'tm',
    //   userReqCookie: siteCookies['tmall']
    // },
    // {
    //   siteCode: 'albb',
    //   userReqCookie: siteCookies['1688']
    // },
    {
      siteCode: 'pdd',
      userReqCookie: siteCookies['yangkeduo']
    }
  ]
}

//获取cookie
export const checkCollectSiteCookie = () => {
  window.postMessage({ action: 'get-collect-site-cookies' }, '*')
  return new Promise((resolve) => {
    try {
      const pluginAuthDOM = document.querySelector(
        '#emalacca-chrome-extension-purchas-auth'
      )
      if (!pluginAuthDOM) {
        resolve({ code: -1, result: {}, message: '请安装马六甲跨境助手插件' })
      }
      const pluginVersionDOM = document.querySelector(
        '#emalacca-chrome-extension-installed'
      )
      if (!pluginVersionDOM || !pluginVersionDOM.getAttribute('version')) {
        resolve({
          code: -1,
          result: {},
          message: '马六甲跨境助手版本过低，请下载最新插件'
        })
      }
      resolve({
        code: 0,
        result: {
          yangkeduo: pluginAuthDOM.getAttribute('ispddlogin'),
          1688: pluginAuthDOM.getAttribute('is1688login'),
          taobao: pluginAuthDOM.getAttribute('islogintaobao'),
          tmall: pluginAuthDOM.getAttribute('islogintmall'),
          alibabavalidcookies: pluginAuthDOM.getAttribute('alibabavalidcookies')
        }
      })
    } catch (error) {
      resolve({ code: -1, result: {}, message: '同步采集平台授权信息失败' })
    }
  })
}
