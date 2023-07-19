import request from '@/libs/request'
let src = 'productcenter/'

/**
 * 查询物料编码
 */

 export const getStore = (data) => {
  return request({
    url: src + 'storeProductCode/getPage',
    data,
    method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

/**
 * 查询物料编码(已匹配)
 */

export const matchingStore = (data) => {
  return request({
    url: src + 'storeProductCode/matching',
    data,
    method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}


/**
 * 查询物料编码(未匹配)
 */

 export const unmatchedStore = (data) => {
	return request({
		url: src + 'storeProductCode/unmatched',
		data,
		method: 'post',
				headers: {
				'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}



/**
 * 绑定物料
 */

 export const bingStore = (data) => {
	return request({
		url: src + 'storeProductCode/binging',
		data,
		method: 'post',
				headers: {
				'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 解绑定物料
 */

 export const unbingStore = (data) => {
	return request({
		url: src + 'storeProductCode/unbind',
		data,
		method: 'post',
				headers: {
				'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}