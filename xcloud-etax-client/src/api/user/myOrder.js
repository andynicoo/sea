import request from '@/utils/request'

const src = 'orderserver/'
/**
 * 获取用户ID
 */
export const getId = () => {
  return request({
    url: 'plat/user/get/info',
    method: 'post'
  })
}
/**
 * 获取订单列表
 */
export const getOrderList = (obj) => {
  const data = obj
  return request({
    url: src + 'order/pc/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 获取订单详情
 */
export const getOrderInfo = (obj) => {
  const data = obj
  return request({
    url: src + 'order/pc/list/detail',
    data,
    method: 'post'
  })
}
/**
 * 取消订单
 */
export const cancelOrder = (obj) => {
  const data = obj
  return request({
    url: src + 'app/list/add/cancel',
    data,
    method: 'post'
  })
}
/**
 * 取消订单且退款
 */
export const cancelbackPay = (obj) => {
  const data = obj
  return request({
    url: src + 'app/list/add/cancelAndRefund',
    data,
    method: 'post'
  })
}
/**
 * 申请退款
 */
export const backPay = (obj) => {
  const data = obj
  return request({
    url: src + 'app/list/add/refund',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 个人发票
 */
export const personInvoice = (obj) => {
  const data = obj
  return request({
    url: src + 'order/list/add/personalOrdinaryInvoice',
    data,
    method: 'post'
  })
}
/**
* 公司发票
*/
export const companyInvoice = (obj) => {
  const data = obj
  return request({
    url: src + 'order/list/add/companyOrdinaryInvoice',
    data,
    method: 'post'
  })
}
/**
* 取申报id
*/
export const getDid = (obj) => {
  const data = obj
  return request({
    url: 'work_client/tax/quarter',
    data,
    method: 'post'
  })
}
/**
 * 根据订单编号和skuId获取服务费用信息
 */
export const getPayInfo = (obj) => {
  const data = obj
  return request({
    url: src + 'afterService/getRefundFeeInfo',
    data,
    method: 'post'
  })
}

/**
 * 订单详情
 */
 export const orderDetailApi = (data) => {
  return request({
    url: '/order/client/order/detail',
    data,
    method: 'post',
  });
};

/**
 * 获取发票详情
 */
 export const getInvoiceDetails = (data) => {
  return request({
    url: '/order/client/order/invoice/get',
    data,
    method: 'post',
  });
};

/**
 * 申请开票
 */
 export const invoice = (data) => {
  return request({
    url: '/order/client/order/invoice',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 补充开票资料
 */
export const invoiceFillMaterial = (data) => {
  return request({
    url: '/order/client/order/invoice/fillMaterial',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 申请开票
 */
export const invoiceList = (data) => {
  return request({
    url: '/order/client/order/invoice/list',
    data,
    method: 'post',
  });
};


/**
 * 修改订单
 */
export const updateOrderApi = (data) => {
  return request({
    url: '/trademark/purchase/updateOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 修改订单付款凭证
 */
export const updatePayVoucheApi = (data) => {
  return request({
    url: '/trademark/my/order/updatePayVouche',
    data,
    method: 'post',
  });
};


