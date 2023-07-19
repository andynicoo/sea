import store from '@/store'
import Basic from '@/api/basic'
import { COLLECT_SITE } from '@/util/erp.conf'
import ZhihuiEditor from 'zhihui-editor-sdk'
import member from '@/api/member'
import { Modal } from 'ant-design-vue'

const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const isDev = process.env.NODE_ENV == 'development'

const kebab = (str) => {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const toggleFullScreen = () => {
  let doc = window.document
  let docEl = doc.documentElement

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl)
  } else {
    cancelFullScreen.call(doc)
  }
}

export const objectToQueryString = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
/**
 * 生成树形数据
 */

export const createTree = (list, key = 'menuId') => {
  // eslint-disable-line no-unused-vars
  let map = {}
  list.forEach((item) => {
    if (!map[item[key]]) {
      map[item[key]] = item
    }
  })
  list.forEach((item) => {
    item.check = false
    const parentObj = map[item.parentId]
    if (item.parentId !== 0 && parentObj) {
      parentObj.children
        ? parentObj.children.push(item)
        : (parentObj.children = [item])
    }
  })
  return list.filter((item) => {
    if (item.parentId === 0) {
      return item
    }
  })
}

/**
 *  平铺数据
 *
 * @param {Array} arr  数据源
 * @param {Array} [result=[]]
 * @return {Array}
 */
export const flatData = (arr, result = []) => {
  arr.forEach((item) => {
    result.push(item)
    item.children && item.children.length > 0
      ? flatData(item.children, result)
      : ''
    // item.children = '' //如果扁平化后的数组需要显示父子层级，可以把这一项删除
  })
  return result
}

/**
 * 平铺菜单列表
 *
 * @return {*}
 */
export const flatMenu = () => {
  return flatData(JSON.parse(JSON.stringify(store.state.menu.treeMenuList)))
}

/**
 *
 * 遍历树
 * @export
 * @param {*} data
 * @param {string} [childrenName='children']
 * @param {*} callback
 */
export function foreachTree(data, childrenName = 'children', callback) {
  for (let i = 0; i < data.length; i++) {
    callback(data[i])
    if (data[i][childrenName] && data[i][childrenName].length > 0) {
      foreachTree(data[i][childrenName], childrenName, callback)
    }
  }
}

/**
 * 查找父节点
 *
 * @export
 * @param {*} pid
 * @param {*} data
 * @param {*} rootPid
 * @param {string} [pidName='pid']
 * @param {string} [idName='id']
 * @param {string} [childrenName='children']
 * @return {*}
 */
export function traceParentNode(
  pid,
  data,
  rootPid,
  pidName = 'parentId',
  idName = 'menuId',
  childrenName = 'children'
) {
  let arr = []
  foreachTree(data, childrenName, (node) => {
    if (['商品发布', '店铺商品', '订单管理'].includes(node.menuName)) {
      node.menuName = 'Shopee' + node.menuName
    }
    if (node[idName] == pid) {
      arr.push(node)
      if (node[pidName] != rootPid) {
        arr = arr.concat(
          traceParentNode(node[pidName], data, rootPid, pidName, idName)
        )
      }
    }
  })
  return arr
}

/**
 * 生成面包屑列表,
 * pathKey，idKey均可根据实际需要进行调整
 *
 * @param {*} currentMenuPath
 * @return {*}
 */
export const breadCrumbsList = (
  currentMenuPath,
  pathKey = 'href',
  idKey = 'menuId'
) => {
  const currentMenuId = flatMenu().find((el) => el[pathKey] == currentMenuPath)[
    idKey
  ]
  return traceParentNode(currentMenuId, store.state.menu.treeMenuList)
}

export const throttle = function(fn, delay = 1000) {
  let timeout = null
  return function() {
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(this, args)
      }, delay)
    }
  }
}
export function debounce(fn, wait = 300) {
  let timer = null
  return (...arg) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, ...arg)
    }, wait)
  }
}
//获取域名
function getDomain(url) {
  return url
    .split('/')
    .slice(0, 3)
    .join('/')
}

export const build1688SearchImgLink = (s) => {
  let relativePath =
    '/' +
    s
      .split('/')
      .slice(3)
      .join('/')

  return `https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageType=${getDomain(
    s
  )}&imageAddress=${relativePath}`
}

export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
export function diffArray(arr1, arr2) {
  arr1 = uniqueArr(arr1)
  arr2 = uniqueArr(arr2)
  return arr1
    .concat(arr2)
    .filter((arg) => !(arr1.includes(arg) && arr2.includes(arg)))
}

/** 除法
 * @param { number } num1
 * @param { number } num2
 */
export function division(num1, num2) {
  let t1, t2, r1, r2
  try {
    t1 = num1.toString().split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split('.')[1].length
  } catch (e) {
    t2 = 0
  }
  r1 = Number(num1.toString().replace('.', ''))
  r2 = Number(num2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/** 乘法
 * @param { number } num1
 * @param { number } num2
 */
export function mcl(num1, num2) {
  let m = 0,
    s1 = num1.toString(),
    s2 = num2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    console.warn(e)
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    console.warn(e)
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

/** 加法
 * @param { number } arg1
 * @param { number } arg2
 */
export function add(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
/** 减法
 * @param { number } arg1
 * @param { number } arg2
 */
export function floatSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

//图片转base64
export const getBase64 = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status === 200) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      }
    }
    xhr.onerror = function() {
      reject()
    }
    xhr.send()
  })
}

//base64转blob
export const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(',')
  //注意base64的最后面中括号和引号是不转译的
  var _arr = arr[1].substring(0, arr[1].length - 2)
  var mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(_arr),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

//base64转file对象
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  filename = `${filename}.jpg`
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 获取图片尺寸
export const getImageInfo = (url, callback) => {
  var img = new Image()
  img.src = url
  if (img.complete) {
    // 如果图片被缓存，则直接返回缓存数据
    callback(img.width, img.height)
  } else {
    img.onload = function() {
      callback(img.width, img.height)
    }
    img.onerror = function(err) {
      callback(0, 0)
    }
  }
}

/**
 * cookie操作
 */
export const CookieUtil = {
  // 设置cookie
  set: function(name, value, expires, domain, path, secure) {
    var cookieText = ''
    cookieText += encodeURIComponent(name) + '=' + encodeURIComponent(value)
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toGMTString()
    }
    if (path) {
      cookieText += '; path=' + path
    }
    if (domain) {
      cookieText += '; domain=' + domain
    }
    if (secure) {
      cookieText += '; secure'
    }
    document.cookie = cookieText
  },
  // name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure
  // 获取cookie
  get: function(name) {
    var cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = ''
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      )
    }
    return cookieValue
  },
  // 删除cookie
  unset: function(name, domain, path, secure) {
    this.set(name, '', Date(0), domain, path, secure)
  }
}
/* 判断是否为空 */
export function isEmpty(obj) {
  switch (typeof obj) {
    case 'undefined':
      return true
    case 'string':
      return obj.trim().length === 0
    case 'object':
      if (Array.isArray(obj)) {
        return obj.length === 0
      } else if (obj === undefined) {
        return true
      } else if (obj === null) {
        return true
      } else if (Object.keys(obj).length === 0) {
        return true
      } else {
        return false
      }
    case 'number':
      if (isNaN(obj)) {
        return true
      } else {
        return false
      }
  }
}

//首字母大写
export function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

// 获取原始属性值+翻译属性值的混合arr
export function getMixinsOptions(options, translateValue, length) {
  const attrOptions = [...options].slice(0, length)
  const tranOptions = [...translateValue].slice(0, length)
  var mixinsOptions = attrOptions.map((ele, index) => {
    const tranVal = tranOptions[index] === null ? ele : tranOptions[index]
    return ele + '--' + tranVal
  })
  return mixinsOptions
}

//数组对象去重
export const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x) => fn(v, x))) acc.push(v)
    return acc
  }, [])

export const IsPC = () => {
  var userAgentInfo = navigator.userAgent
  var Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod'
  ]
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

// 获取采集站点
/**
 *
 * @export
 * @param index,COLLECT_SITE中不显示的index,1链接采集，2全店采集，3平台采集，4插件采集
 */
export const getCollectSites = (index) => {
  let Site = COLLECT_SITE.map((el) => {
    el.name = window._VV.$t(el.name)
    el.displayName = window._VV.$t(el.displayName)
    el.conditionOpts &&
      el.conditionOpts.map((subEl) => {
        subEl.text = window._VV.$t(subEl.text)
      })
    el.pfs &&
      el.pfs.map((subEl) => {
        const sName = subEl.name.split(/\|/)
        subEl.name = ` ${sName[0]}${window._VV.$t(sName[1])}`
        subEl.displayName = window._VV.$t(subEl.displayName)
      })
    if (!(el.disableIndex || []).includes(index)) return el
  })
  Site = Site.filter((n) => n)
  return Site
}

// 二进制文件流下载
export function downloadFile(data, name = '导出文件') {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }) // for .xlsx files
  // 通过URL.createObjectURL生成文件路径
  const url = window.URL.createObjectURL(blob)
  const ele = document.createElement('a')
  ele.style.display = 'none'
  ele.href = url
  ele.download = name
  document.body.appendChild(ele)
  ele.click()
  ele.remove()
}

/**
 * 获取页面url参数
 * @param {*} variable key
 * @returns
 */
export function getQueryVariable(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}
// 获取字节长度(中文算2.25个字符向上取整)
export function getByteLen(val, multiple = 2.25) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    let length = val.charCodeAt(i)
    if (length >= 19968 && length <= 40869) {
      len += multiple
    } else {
      len += 1
    }
  }
  len = Math.ceil(len)
  return len
}
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
// 宽松对比两个数据是否相等
export function looseEqual(a, b) {
  if (a === b) {
    return true
  }
  var isObjectA = isObject(a)
  var isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a)
      var isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return (
          a.length === b.length &&
          a.every(function(e, i) {
            return looseEqual(e, b[i])
          })
        )
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a)
        var keysB = Object.keys(b)
        return (
          keysA.length === keysB.length &&
          keysA.every(function(key) {
            let flag = looseEqual(a[key], b[key])
            if (!flag) console.log(key, '不相等')
            return flag
          })
        )
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

//唤醒乐聊
export function leliao(token) {
  // var _clickTime = new Date().getTime()
  window.location.href = `chatppe://app_link/client/open?exToken=${token}&to=/refresh/login` /***打开app的协议，有安卓同事提供***/
  setTimeout(() => {
    window._VV.$confirm({
      title: '请问是否已经打开乐聊chat++ ?',
      okText: '没有打开',
      cancelText: '已打开',
      onOk() {
        window.open(`https://${window.location.host}/leliao.html`, '_blank')
      },
      onCancel() {},
      class: 'test'
    })
  }, 2000)
  //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
  // var _count = 0,
  //   intHandle
  // intHandle = setInterval(function() {
  //   _count++
  //   var elsTime = new Date().getTime() - _clickTime
  //   if (_count >= 100 || elsTime > 3000) {
  //     console.log(_count)
  //     console.log(elsTime)
  //     clearInterval(intHandle)
  //     //检查app是否打开
  //     if (document.hidden || document.webkitHidden) {
  //       // 打开了
  //       window.close()
  //     } else {
  //       // 没打开
  //       // alert('没打开')
  //       // window.location.href = "？？？？？？？？？？？？？？";//下载链接
  //     }
  //   }
  // }, 20)
}
// 打开智绘泰山
// 配置文档在/docs/base, 智绘泰山配置.html（功能模块），图片配置属性说明（要编辑的图片配置信息）
/**
 *
 * @param {*编辑图片url地址} item
 * @param {*图片状态大小(宽高))} imgSizeData
 * @param {*回调方法} fn
 */

export const openZhihuiEditor = async (item, imgSizeData, fn) => {
  let zhihuiEditor = null
  const { data } = await Basic.getAuthImgSign()
  let params = {
    system: 'CH',
    appid: 'apollo',
    channel: 'CHIframe',
    stamp: data.userId,
    timestamp: data.timestamp,
    sig: data.sign,
    templateId: data.timestamp.toString(),
    from: 'userConfig',
    // loading配置项目说明
    loadingConfig: {
      logoUrl: location.origin + require('@/assets/images/logo-primary.png') // 加载时候的logo，非必传
    },
    headConfig: {
      logoUrl: location.origin + require('@/assets/images/logo-primary.png'), // 头部左侧的logo，非必传
      downloadName: '完成', // 头部右侧下载按钮名称，非必传
      onClickDownload: async (res) => {
        // 头部点击右侧按钮后的回调事件，会返回用户下载的数据项目，具体返回数据由下方说明
        // 关闭编辑器
        zhihuiEditor.closeIframe && zhihuiEditor.closeIframe()
        zhihuiEditor = null
        let ress = await member.handleImgnumAdd({})
        // 回调
        fn(res)
      },
      isDownloadImg: false // 用户点击头部右侧按钮后是否下载图片，默认为true
    },
    templateDataConfig: [
      {
        id: 'workarea',
        top: 0,
        left: 0,
        width: imgSizeData.width,
        height: imgSizeData.height
      },
      {
        type: 'image',
        top: 0,
        left: 0,
        src: item
      }
    ]
  }
  let res = await member.getEditImgLimit({})
  if (res.data) {
    // window._VV.$message.error('在线修图已超量!')
    Modal.confirm({
      title: '温馨提示',
      content: data.message || '在线修图已超量，请升级会员套餐',
      okText: '知道了',
      onOk: () => {
        // window._VV.$router.replace('/member/Index')
      }
    })
  } else {
    zhihuiEditor = new ZhihuiEditor(params)
    zhihuiEditor.openIframe()
  }
}

// 跳转嵌套页面
export function toPage(urlPath, parms = '') {
  if (store.getters.getAccessToken) {
    let baseUrl = ''
    switch (process.env.NODE_ENV) {
      case 'development': // 开发环境 development
        // baseUrl = 'http://localhost:8889/#/o'
        baseUrl = 'https://oms-sit1.emalacca.com/#/o'
        // baseUrl = 'https://oms-sit2.emalacca.com/#/o'
        break
      case 'testing': // 测试环境 sit1
        baseUrl = 'https://oms-sit1.emalacca.com/#/o'
        break
      case 'testing2': // 测试环境 sit2
        baseUrl = 'https://oms-sit2.emalacca.com/#/o'
        break
      case 'uat': // 预生产环境 uat1
        baseUrl = 'https://oms-uat1.emalacca.com/#/o'
        break
      case 'production': // 生产环境 production
        baseUrl = 'https://yile.sellertms.com/#/o'
        break
      default:
        baseUrl = ''
        break
    }
    const token = store.getters.getAccessToken
    const iframe = document.createElement('iframe')
    iframe.src = baseUrl + urlPath + '?token=' + token + parms
    iframe.width = '100%'
    iframe.height = '100%'
    const dom = document.getElementById('iframeId')
    dom.append(iframe)
  }
}

// 2个区间数字是否有交集
export function isIntersect(arr1, arr2) {
  let start = [Math.min(...arr1), Math.min(...arr2)] //区间的两个最小值
  let end = [Math.max(...arr1), Math.max(...arr2)] //区间的两个最大值
  return Math.max(...start) <= Math.min(...end) //最大值里的最小值 是否 小于等于 最大值的最小值
}

export default {
  randomElement,
  toggleFullScreen,
  kebab
}
