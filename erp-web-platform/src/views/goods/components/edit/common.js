import { mean, round } from 'lodash'
// 生成批发价校验规则
export function wholesalesRules(index, key, product) {
  const { wholesales, variants } = product
  return [
    {
      validator: (rule, value, callback) =>
        checkWholesalesMin(
          rule,
          value,
          callback,
          index,
          key,
          wholesales,
          variants,
          this
        )
    }
  ]
}
// 校验批发价的最大与最小数量与单价
export function checkWholesalesMin(
  rule,
  value,
  callback,
  index,
  key, //当前key
  wholesales, //批发价数据
  variants, //变体数据
  that //当前调用实例
) {
  const map = {
    minCount: '最小',
    maxCount: '最大',
    unitPrice: '单价'
  }
  const prev = wholesales?.[index - 1]
  const cur = wholesales?.[index]
  let meanPrice = variants?.map(({ price }) => price) || []
  meanPrice = mean(meanPrice)
  // console.log(rule, value, index, key, prev)
  if (!value) {
    callback(`${map[key]}数量不能为空`)
    return
  }
  if (key === 'minCount') {
    if (value < 2) {
      callback(that.$t('edit.priceError2'))
    }
    if (prev) {
      if (value <= prev?.maxCount) {
        callback(that.$t('edit.priceError3'))
      }
    }
  }
  if (key === 'maxCount') {
    if (value <= cur?.minCount) {
      callback(that.$t('edit.priceError11'))
    }
  }
  if (key === 'unitPrice') {
    if (round(value) >= round(meanPrice)) {
      callback(that.$t('edit.priceError6'))
    }
    if (prev) {
      if (value >= prev?.unitPrice) {
        callback(that.$t('edit.priceError9'))
      }
    }
  }
  callback()
}
