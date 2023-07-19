import { min, max } from 'lodash'
/**
 * 计算价格显示,如果有变体显示变体价格否则显示单品价格
 */
export function getPrice(item) {
  if (item.hasVariation && item.variants) {
    const variantsPrices = item.variants.map(({ price }) => price)
    const _min = min(variantsPrices)
    const _max = max(variantsPrices)
    if (_max === _min) return `${_max}`
    return `${_min} ~ ${_max}`
  }
  return `${item.price}`
}
