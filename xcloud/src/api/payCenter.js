import request from '@/libs/request'

let src = 'payment/'
// let src = ''
/**
 * 获取支付主体列表
 */

export const getPayMainList = (data) => {
  return request({
    url: src + 'paySubject/listPaySubject',
    data,
    method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

/**
 * 新增支付主体
 */
export const addPayMain = (data) => {
	return request({
		url: src + 'paySubject/add',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 编辑支付方式
 */
export const editPayMainWay = (data) => {
	return request({
		url: src + 'paySubject/editPaymentWay',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取支付公司列表信息
 */
 export const getPayCompany = (data) => {
	return request({
		url: src + 'paySubject/listPaymentChannelValue',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取支付方式列表
 */
 export const getPayWay = (data) => {
	return request({
		url: src + 'paySubject/listPaymentChannelWay',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取路由配置
 */
 export const getPayRoute = (data) => {
	return request({
		url: src + 'paySubject/listPaySubjectChannelWay',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取支付公司列表配置
 */
 export const getPayCompanyConfig = (data) => {
	return request({
		url: src + 'paySubject/listPaySubjectChannel',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 修改主体信息
 */
 export const updatedPaySubject = (data) => {
	return request({
		url: src + 'paySubject/updateSubject',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取单个主体信息
 */
 export const getPayInfo = (data) => {
	return request({
		url: src + 'paySubject/getPaySubject',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 删除支付公司
 */
 export const deletePayCompany = (data) => {
	return request({
		url: src + 'paySubject/deleteSubjectChannel',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取商户列表
 */
 export const getBusinesssList = (data) => {
	return request({
		url: src + 'payMerchant/listMerchant',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 新增商户列表
 */
 export const addBusiness = (data) => {
	return request({
		url: src + 'payMerchant/add',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 新增商户列表
 */
 export const updatedBusiness = (data) => {
	return request({
		url: src + 'payMerchant/update',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取商户配置路由
 */
 export const getBusinessRoute = (data) => {
	return request({
		url: src + 'payMerchant/listMerchantRouteConfig',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 保存路由配置
 */
 export const saveBusinessWay = (data) => {
	return request({
		url: src + 'payMerchant/editMerchantRouteConfig',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取适用端口
 */
 export const getPort = (data) => {
	return request({
		url: src + 'payMerchant/listApplyPort',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}


/**
 * 支付订单列表
 */
 export const getOrderList= (data) => {
	return request({
		url: src + 'payOrder/listPayOrder',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 导出订单列表
 */
 export const exportPayOrder= (data) => {
	return request({
		url: src + 'payOrder/exportPayOrder',
		data,
		method: 'post',
		responseType: 'blob',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 退款明细
 */
 export const getReturnDetails= (data) => {
	return request({
		url: src + 'payRefundOrder/listDetailed',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取银行卡信息
 */
 export const getBankInfo= (data) => {
	return request({
		url: src + 'payRefundOrder/getRefundBankInfo',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}



/**
 * 获取支付方式
 */
 export const getPayWalAll= (data) => {
	return request({
		url: src + 'paySubject/listAllPaymentChannelWay',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 退款管理列表
 */
 export const getReturnList= (data) => {
	return request({
		url: src + 'payRefundOrder/listPayRefundOrder',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 退款信息
 */
 export const getReturnInfo= (data) => {
	return request({
		url: src + 'payRefundOrder/getPayRefundInfo',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 提交退款信息
 */
 export const subReturnInfo= (data) => {
	return request({
		url: src + 'payRefundOrder/submitPayRefundInfo',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 获取退款的数量
 */
 export const getReturnSum= (data) => {
	return request({
		url: src + 'payRefundOrder/getRefundOrderStatusNum',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 导出退款管理列表
 */
 export const exportPayRefundOrder= (data) => {
	return request({
		url: src + 'payRefundOrder/exportPayRefundOrder',
		data,
		method: 'post',
		responseType: 'blob',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 同步退款的订单
 */
 export const synchronizationReturn= (data) => {
	return request({
		url: src + 'authorize/payment/refund/trade/query',
		data,
		method: 'post',
		headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
	})
}

/**
 * 收款账号
 */
export const getReceivePaymentList = (data) => {
	return request({
		url: src + 'payReceivePayment/getPage',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 同步收款账号
 */
 export const synchronizeReceivePayment = (data) => {
	return request({
		url: src + 'payReceivePayment/sync',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 同步收款账号 全部
 */
export const synchronizeReceivePaymentAll = (data) => {
	return request({
		url: src + 'payReceivePayment/sync/all',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 基础资料-支付平台 列表
 */
export const getPaymentList = (data) => {
	return request({
		url: src + 'payCostConfig/getPage',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 基础资料-支付平台 修改单个
 */
export const updatePaymentChannel = (data) => {
	return request({
		url: src + 'payCostConfig/update',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}

/**
 * 基础资料-支付平台 添加配置
 */
export const addPaymentChannel = (data) => {
	return request({
		url: src + 'payCostConfig/add',
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
	})
}
