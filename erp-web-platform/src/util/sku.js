// 源自 https://github.com/zent-contrib/sku/blob/master/src/utils/index.js

// 计算每个sku后面有多少项22
export function getLevels(tree) {
  let level = []
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].data) {
      level[i] = tree[i + 1].data.length * level[i + 1] || 1
    } else {
      level[i] = 1
    }
  }
  return level
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */
export function flatten(tree, stocks = [], options) {
  let { optionValue = 'id', optionText = 'value' } = options || {}
  let result = []
  let skuLen = 0
  let stockMap = {} // 记录已存在的stock的数据
  const level = getLevels(tree)
  if (tree.length === 0) return result
  tree.forEach((sku) => {
    const { data } = sku
    if (!data || data.length === 0) return true
    skuLen = (skuLen || 1) * data.length
  })
  // 根据已有的stocks生成一个map
  stocks.forEach((stock) => {
    let { skus, ...attr } = stock
    stockMap[skus.map((item) => `${item.k_id}_${item.v_id}`).join('|')] = attr
  })
  for (let i = 0; i < skuLen; i++) {
    let skus = []
    let mapKey = []

    tree.forEach((sku, column) => {
      const { data } = sku

      let item = {}
      if (!data || data.length === 0) return true
      if (data.length > 1) {
        let row = parseInt(i / level[column], 10) % data.length
        item = tree[column].data[row]
        item.index = row //动态改变当前索引
      } else {
        item = tree[column].data[0] //如果只有一项子规格
        item.index = 0 //动态改变当前索引
      }
      if (!sku[optionValue] || !item[optionValue]) return
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`)
      skus.push({
        k_id: sku[optionValue],
        k: sku[optionText],
        v_id: item[optionValue],
        v: item[optionText],
        index: item.index //用于组合后端需要的index[]
      })
    })
    let { ...data } = stockMap[mapKey.join('|')] || {}
    // 从map中找出存在的sku并保留其值
    result.push({ ...data, skus })
  }
  return result
}

/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */
export function isEqual(prevSKU, nextSKU, options) {
  let { optionValue = 'id' } = options || {}
  return (
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({ data = [] }, index) => {
      let prevdata = prevSKU[index].data || []
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        data.length === prevdata.length &&
        data.map((item) => item[optionValue]).join(',') ===
          prevdata.map((item) => item[optionValue]).join(',')
      )
    })
  )
}
