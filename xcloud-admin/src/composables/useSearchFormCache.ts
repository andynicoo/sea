/* eslint-disable @typescript-eslint/no-explicit-any */

/** 搜索表单的缓存 cacheTime缓存时间: 默认1天后清除  */
const useSearchFormCache = () => {
  const route = useRoute()
  const cacheData = ref<any>({})

  /** cacheObj: 缓存数据, isReplace = 是否全量替换 */
  const setPageCache = (cacheDefault: any, isReplace = false) => {
    const cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}')
    // 是否全量替换, Y 默认值.  N 更新数据
    const cacheObj = isReplace ? cacheDefault : { ...cache[route.path], ...cacheDefault }
    cache[route.path] = cacheObj
    cacheData.value = cache[route.path]
    route.path && sessionStorage.setItem('cacheQuery', JSON.stringify(cache))
  }

  const getPageCache = (cacheName: string = route.path) => {
    try {
      const cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}')
      if (cache && cache[cacheName]) {
        cacheData.value = cache[cacheName]
      }
    } catch (error) {
      new Error('JSON parse cacheQuery error')
    }
  }

  const removePageCache = (cacheName: string = route.path) => {
    try {
      const cache = JSON.parse(sessionStorage.getItem('cacheQuery') || '{}')
      const cacheMap = new Map(Object.entries(cache))
      cacheMap.delete(cacheName)
      sessionStorage.setItem('cacheQuery', JSON.stringify(Object.fromEntries(cacheMap)))
    } catch (error) {
      new Error('JSON parse cacheQuery error')
    }
  }

  // 初始化查询
  getPageCache()

  return {
    setPageCache,
    getPageCache,
    removePageCache,
    cacheData,
  }
}

export default useSearchFormCache
