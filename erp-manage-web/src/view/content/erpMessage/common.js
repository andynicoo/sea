/** 判定时间段是否有交集
 * @param a{Date} 区间开始日期
 * @param b{Date} 区间结束日期
 * @param sourceList{Array} 要对比的时间区间数组
 * @return {Boolean}
 */
export function checkTime(a, b, sourceList) {
  const result = sourceList.some(item => {
    const c = new Date(item.startTime).valueOf()
    const d = new Date(item.endTime).valueOf()
    return a < d && b > c
  })
  return result
}
/** 判定所选时间是否在所选区间内
 * @param a{Date} 目标时间
 * @param sourceList{Array} 源数组
 * @return {Boolean}
 */
export function checkIncludes(a, sourceList) {
  const result = sourceList.some(item => {
    const b = new Date(item.startTime).valueOf()
    const c = new Date(item.endTime).valueOf()
    return a > b && a < c
  })
  return result
}
