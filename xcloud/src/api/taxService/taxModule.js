import request from '@/libs/request'

var arr = []
for (var i = 0; i < navigator.plugins.length; i++) {
  arr.push(navigator.plugins[i].name)
}
var navigatorPlugins = encodeURI(arr.join(','))
var screenHeight = window.screen.height
var availheight = window.screen.availHeight
var screenWidth = window.screen.width
var availWidth = window.screen.availWidth
var colorDepth = window.screen.colorDepth

/**
 * 获取全部产品信息
 */
export const getProductInfo = () => {
  return request({
    url: '/etax/product/list/productInfo',
    method: 'get'
  })
}

/**
 * 根据国家编码获取配置信息列表
 */
export const baseInfoByCondition = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/baseInfoByCondition',
    params,
    method: 'get'
  })
}
/**
 * 根据客户选择信息购买服务
 */
export const createOrder = (data) => {
  return request({
    url: '/etax/purchase/createOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 分页获取服务列表
 */
export const taxManageList = (data) => {
  return request({
    url: '/etax/order_services/list',
    data,
    method: 'post'
  })
}

/**
 * 获取我的订单列表
 */
export const clientList = (data) => {
  return request({
    url: '/etax/order/client/list',
    data,
    method: 'post'
  })
}

/**
 * 第一次报税
 */
export const taxWorkOrder = (data) => {
  return request({
    url: '/etax/user/first/taxWorkOrder',
    data,
    method: 'post'
  })
}

/**
 * 报税记录
 */
export const taxLogDetail = (data) => {
  return request({
    url: '/etax/user/tax/detail',
    data,
    method: 'post'
  })
}

/**
 * 根据服务id查找信息
 */
export const taxInfo = (params) => {
  return request({
    url: '/etax/order_services/get',
    params,
    method: 'get'
  })
}
/**
 * 报税提交资料
 */
export const submitTaxdate = (data) => {
  return request({
    url: '/etax/user/submit/taxdata',
    method: 'post',
    data
  })
}

/**
 * 上传缴税凭证
 */
export const certificate = (data) => {
  return request({
    url: '/etax/user/update/tax/certificate',
    data,
    method: 'post'
  })
}

/**
 * 获取税率
 */
export const getTaxRate = () => {
  return request({
    url: '/etax/management/baseinfo/list/tax/rate',
    method: 'get'
  })
}

/**
 * 获取申报远程销售限制配置列表(有税号国家)
 */
export const taxCountry = () => {
  return request({
    url: '/etax/management/baseinfo/list/tax/saleConfig',
    method: 'get'
  })
}

/**
 * 核算税金
 */
export const calculationTax = (data) => {
  return request({
    url: '/etax/calculation/top',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 根据条件获取产品信息 (选择国家)
 */
export const getProduct = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/baseinfo',
    params,
    method: 'get'
  })
}

/**
 * 提交转代理资料
 */
export const submitAgent = (data) => {
  return request({
    url: '/etax/tax/workorder/management/submit/proxy/material',
    data,
    method: 'post'
  })
}

/**
 * 保存转代理资料
 */
export const saveAgent = (data) => {
  return request({
    url: '/etax/tax/workorder/management/save/proxy/material',
    data,
    method: 'post'
  })
}

/**
 * 上传VAT证书
 */
export const uploadVatCertificate = (data) => {
  return request({
    url: '/etax/workorder/management/register/upload/vatCertificate',
    data,
    method: 'post'
  })
}

/**
 * 后台获取用户所有购买服务公司
 */
export const getLenovoSearchCompany = (data) => {
  return request({
    url: '/etax/services/management/list/service/company',
    data,
    method: 'post'
  })
}
/**
 * 后台获取用户使用过的公司资料信息
 */
export const getMaterial = (data) => {
  return request({
    url: '/etax/services/management/user/company/material',
    data,
    method: 'post'
  })
}


/**
 * 根据用户查询税号是否授权
 */
export const ifAuth = (data) => {
  return request({
    url: '/etax/bureau/management/auth/if',
    data,
    method: 'post',
  })
}

/**
 * 税局getway授权
 */
export const mtdAuth = (data) => {
  return request({
    url: '/etax/bureau/management/auth/mtd',
    data,
    method: 'post'
  })
}

/**
 * 报税提交资料
 */
export const material = (data) => {
  return request({
    url: '/etax/bureau/management/auth/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 查询申报记录
 */
export const mtdTaxRecord = (data) => {
  return request({
    url: '/etax/bureau/management/auth/mtdTaxRecord',
    data,
    method: 'post'
  })
}

/**
 * 查看申报记录详情
 */
export const mtdTaxView = (data) => {
  return request({
    url: '/etax/bureau/management/auth/mtdTaxView',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}

/**
 * 检索增值税义务
 */
export const vatObligations = (data) => {
  return request({
    url: '/etax/bureau/management/auth/vatObligations',
    data,
    method: 'post',
    headers: {
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}


/**
 * 提交申报数据到税局
 */
export const vatReturns = (data) => {
  return request({
    url: '/etax/bureau/management/auth/vatReturns',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'navigatorPlugins': navigatorPlugins,
      'screenHeight': screenHeight,
      'availheight': availheight,
      'screenWidth': screenWidth,
      'availWidth': availWidth,
      'colorDepth': colorDepth
    }
  })
}

/**
 * 税局getway授权回调
 */
export const getwayCallback = (params) => {
  return request({
    url: '/etax/bureau/management/callback',
    params,
    method: 'get'
  })
}

/**
 * 根据服务ID或者工单编号获取申报回执复制
 */
export const getForms = (data) => {
  return request({
    url: '/etax/tax/workorder/management/download/receipt/forms',
    data,
    method: 'post'
  })
}
/**
 * 根据服务ID或者工单编号获取税金确认单
 */
export const getShuijinForms = (data) => {
  return request({
    url: '/etax/tax/workorder/management/download/affirm/forms',
    data,
    method: 'post'
  })
}

/**
 * 计算税金后台（远程销售使用）
 */
export const calculationTaxSale = (data) => {
  return request({
    url: '/etax/calculation/management/sale/top',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 录入发票号
 */
export const inputInvoice = (data) => {
  return request({
    url: '/etax/tax/workorder/management/input/invoice',
    data,
    method: 'post'
  })
}

/**
 * 录入GIBAN码
 */
export const inputGibancode = (data) => {
  return request({
    url: '/etax/tax/workorder/management/input/gibancode',
    data,
    method: 'post'
  })
}


/**
 * 批量发送用户上传注册资料短信提醒
 */
export const batchMessageReg = (data) => {
  return request({
    url: '/etax/services/management/send/sms/register/batch',
    data,
    method: 'post'
  })
}
/**
 * 批量发送用户上传转代理资料短信提醒
 */
export const batchMessageTrs = (data) => {
  return request({
    url: '/etax/services/management/send/sms/transformProxy/batch',
    data,
    method: 'post'
  })
}

/**
 * 批量发送用户申报资料短信提醒
 */
export const batchMessageDeclear = (data) => {
  return request({
    url: '/etax/services/management/send/sms/taxWorkOrder/batch',
    data,
    method: 'post'
  })
}

/**
 * 批量发送用户申报资料电话提醒
 */
export const batchCallDeclear = (data) => {
  return request({
    url: '/etax/services/management/call/taxWorkOrder/batch',
    data,
    method: 'post'
  })
}


/**
 * 税务稽查服务列表
 */
export const taxCheckList = (data) => {
  return request({
    url: '/etax/services/management/taxcheck/list',
    data,
    method: 'post'
  })
}


/**
 * 税务稽查服务列表
 */
export const dispose = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/management/material/dispose',
    data,
    method: 'post'
  })
}



/**
 * 税务稽查服务列表
 */
export const finish = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/management/material/finish',
    data,
    method: 'post'
  })
}


/**
 * 后台税务稽查上传资料
 */
export const taxSubmit = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/management/material/submit',
    data,
    method: 'post'
  })
}

/**
 * 后台添加备注
 */
export const addRemark = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/management/material/addRemark',
    data,
    method: 'post'
  })
}

/**
 * 后台查看备注
 */
export const remarkDetail = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/management/material/remark',
    data,
    method: 'post'
  })
}



/**
 * 录入SIRET号
 */
export const enterSIRETNumber = (data) => {
  return request({
    url: '/etax/workorder/management/register/siret/input/number',
    data,
    method: 'post'
  })
}

/**
 * 下载零申报回执（意大利）
 */
export const downloadReceipt = (data) => {
  return request({
    url: '/etax/derive/management/download/zeroDeclaration/receipt',
    data,
    method: 'post'
  })
}


/**
 * 审核申报资料
 */
export const auditTaxWorkOrder = (data) => {
  return request({
    url: '/etax/tax/workorder/management/audit/taxWorkOrder',
    data,
    method: 'post'
  })
}

/**
 * 编辑修改申报抵扣项
 */
export const taxDeductionItem = (data) => {
  return request({
    url: '/etax/tax/workorder/management/edit/taxDeductionItem',
    data,
    method: 'post'
  })
}

/**
 * 编辑修改申报抵扣项
 */
export const taxDeleteDeductionItem = (data) => {
  return request({
    url: '/etax/tax/workorder/management/delete/taxDeductionItem',
    data,
    method: 'post'
  })
}



/**
 * 注册修改服务服务商数据
 */
export const updateSupplierReg = (data) => {
  return request({
    url: '/etax/workorder/management/register/update/supplier',
    data,
    method: 'post'
  })
}


/**
 * 转代理编辑修改申报抵扣项
 */
export const updateSupplier = (data) => {
  return request({
    url: '/etax/tax/workorder/management/update/supplier',
    data,
    method: 'post'
  })
}


