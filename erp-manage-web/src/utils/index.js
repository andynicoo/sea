// 二进制文件流下载
export function download(data, name = '导出文件') {
  let url = ''
  if (typeof data === 'object') {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    url = window.URL.createObjectURL(blob)
  } else {
    url = data
  }
  const ele = document.createElement('a')
  ele.style.display = 'none'
  ele.href = url
  ele.download = name
  document.body.appendChild(ele)
  ele.click()
  ele.remove()
}
// 下载图片地址和图片名
export function downloadIamge(imgsrc, name) {
  let image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function() {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    let context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
    let a = document.createElement('a') // 生成一个a元素
    let event = new MouseEvent('click') // 创建一个单击事件
    a.download = name || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc
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
export function throttle(fn, wait = 300) {
  let timer = null
  return (...args) => {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
      timer = null
    }, wait)
  }
}
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
// 设置表格tbody高度
export async function setTableHeight(that, number = 0) {
  try {
    await that.$nextTick()
    setTimeout(() => {
      const thead = document.querySelector('.ant-table-thead')
      const containerEl = document.querySelector('.container')
      const filtersHeight =
      (that.$refs.filters && that.$refs.filters.offsetHeight) || 0
      const containerHeight = containerEl && containerEl.offsetHeight - 64 || 0
      const exportHeight = that.$refs.export && that.$refs.export.offsetHeight || 0
      const theadHeight = thead && thead.offsetHeight + 4 || 0
      const paginationHeight = 64
      const tableHeight =
      containerHeight - filtersHeight - theadHeight - exportHeight - paginationHeight - number
      that.tableHeight = tableHeight
    })
  } catch (error) {
    console.error(error)
  }
}
// 转树结构
export function listToTree(list = [], func = () => true) {
  const map = list.reduce((init, cur) => {
    init[cur.menuId] = cur
    return init
  }, {})
  return list.filter(item => {
    const parentObj = map[item.parentId]
    if (item.parentId && parentObj && func(parentObj, item)) {
      parentObj.children ? parentObj.children.push(item) : (parentObj.children = [item])
      return false
    }
    return !item.parentId
  })
}
/** 检测数据类型
 * @param source 源目标
 * @return{string} 任意类型的小写字串--isType(source) === 'object'
 */
export function isType(source) {
  return Object.prototype.toString.call(source).slice(8, -1).toLowerCase()
}

/** 阿拉伯数字转中文数字
 * @param num 源数字
 * @return 中文数字
 */
export function NoToChinese(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
      return 'Number is wrong!'
  }
  // eslint-disable-next-line no-array-constructor
  var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九')
  // eslint-disable-next-line no-array-constructor
  var BB = new Array('', '十', '百', '千', '万', '亿', '点', '')
  var a = ('' + num).replace(/(^0*)/g, '').split('.')
      var k = 0
      var re = ''
  for (var i = a[0].length - 1; i >= 0; i--) {
      switch (k) {
          case 0:
              re = BB[7] + re
              break
          case 4:
              if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) { re = BB[4] + re }
              break
          case 8:
              re = BB[5] + re
              BB[7] = BB[5]
              k = 0
              break
      }
      if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) re = AA[0] + re
      if (a[0].charAt(i) !== 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
      k++
  }
  // 加上小数部分(如果有小数部分)
  if (a.length > 1) {
      re += BB[6]
      for (var j = 0; j < a[1].length; j++) re += AA[a[1].charAt(j)]
  }
  return re
}

export const objectToQueryString = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
