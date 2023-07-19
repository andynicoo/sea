import request from '@/utils/request';
/**
 * 获取全部产品信息
 */
export const getProductInfo = () => {
  return request({
    url: '/etax/product/list/productInfo',
    method: 'get',
  });
};
/**
 * 根据条件获取产品信息
 */
export const getProduct = (params) => {
  return request({
    url: '/etax/product/list/productInfoByCondition',
    params,
    method: 'get',
  });
};
/**
 * 根据国家编码获取配置信息列表
 */
export const baseInfoByCondition = (params) => {
  return request({
    // url: "/etax/baseinfo/list/baseInfoByCondition",
    url: '/workorder/client/baseinfo/list/baseInfoByCondition',
    params,
    method: 'get',
  });
};
/**
 * 销售平台根据亚马逊算法
 */
export const calcuAmazon = (data) => {
  return request({
    url: '/etax/calculation/sale/newCounter',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 销售平台根据ebay算法
 */
export const calcuEbay = (data) => {
  return request({
    url: '/etax/calculation/sale/eBayCounter',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * IOSS申报的算税接口
 */
export const calcuIoss = (data) => {
  return request({
    url: '/etax/ioss/client/sale/amazonCounter',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * 根据客户选择信息购买服务
 */
export const createOrder = (data) => {
  return request({
    url: '/etax/purchase/createOrder',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 分页获取服务列表
 */
// export const taxManageList = (data) => {
//   return request({
//     url: "/etax/order_services/list",
//     data,
//     method: "post",
//   });
// };
export function taxManageList(params) {
  return request({
    url: '/workorder/client/service_work_order/vat/page',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 导出税号
 */
export function vatPageExport(params) {
  return request({
    url: '/workorder/client/service_work_order/vat/page/export',
    method: 'post',
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取我的订单列表
 */
export const clientList = (data) => {
  return request({
    // url: "/etax/order/client/list",
    url: '/order/client/order/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 第一次报税
 */
export const taxWorkOrder = (data) => {
  return request({
    url: '/etax/user/first/taxWorkOrder',
    data,
    method: 'post',
  });
};

/**
 * 报税记录
 */
export const taxLogDetail = (serviceId) => {
  return request({
    url: `/workorder/client/declare/user/tax/${serviceId}`,
    method: 'get',
  });
};

/**
 * 根据服务id查找信息
 */
export const taxInfo = (params) => {
  return request({
    url: '/etax/order_services/get',
    params,
    method: 'get',
  });
};
/**
 * 上传缴税凭证
 */
export const certificate = (data) => {
  return request({
    // url: "/etax/user/update/tax/certificate",
    url: '/workorder/client/declare/certificate',
    data,
    method: 'put',
  });
};

/**
 * 获取税率
 */
export const getTaxRate = () => {
  return request({
    url: '/etax/baseinfo/list/tax/rate',
    method: 'get',
  });
};

/**
 * 获取申报远程销售限制配置列表(有税号国家)
 */
export const taxCountry = () => {
  return request({
    url: '/etax/baseinfo/list/tax/saleConfig',
    method: 'get',
  });
};

/**
 * 核算税金
 */
export const calculationTax = (data) => {
  return request({
    url: '/etax/calculation/top',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 计算税金
 */
export function caluTax(data) {
  return request({
    // url: "/hxa/workorder/tax/caluTax",
    url: '/workorder/tax/caluTax',
    method: 'POST',
    data,
    hiddenError: true,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 *  计算税金（远程销售使用）
 */
export const calculationTaxSale = (data) => {
  return request({
    url: '/etax/calculation/sale/top',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 *  计算税金（首页一键算税使用）
 */
export const calculationTaxSaleIndexPage = (data) => {
  return request({
    url: '/etax/calculation/sale/counter',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *  计算税金（首页一键算税使用）
 */
export const calculationTaxSaleIndexPageNew = (data) => {
  return request({
    url: '/etax/calculation/sale/newCounter',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 报税提交资料
 */
export const submitTaxdate = (data) => {
  return request({
    // url: "/etax/user/submit/material",
    url: '/workorder/client/declare/commit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/**
 * IOSS提交报税资料
 */
export const submitTaxIoss = (data) => {
  return request({
    url: '/etax/user/submit/material',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 上传抵扣明细
 */
export const submitTaxDiscount = (data) => {
  return request({
    url: '/etax/workorder/management/tax/upload/deduction/item',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 提交注册信息
 */
export const subRegisterInfo = (data) => {
  return request({
    url: '/etax/register/order/submit/register/wordordermaterial',
    method: 'post',
    data,
  });
};

/**
 * 获取法人出生国家
 */
export const legalpersonCountry = () => {
  return request({
    url: '/etax/workorder/management/register/get/legalperson/country/name',
    method: 'get',
  });
};

/**
 * 取消订单
 */
export const cancelOrder = (data) => {
  return request({
    // url: "/etax/order/client/cancelOrder",
    url: 'order/client/order/cancel',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

/**
 * 获取当前登录用户所有的注册服务公司
 */
export const getRegCompany = () => {
  return request({
    url: '/etax/order_services/list/tax/reg',
    method: 'post',
  });
};

/**
 * 根据服务ID或者工单编号获取税金确认单
 */
// export const getTaxBill = (data) => {
//   return request({
//     url: "/etax/user/download/affirm/forms",
//     data,
//     method: "post",
//   });
// };
export const getTaxBill = (params) => {
  return request({
    url: '/workorder/management/download/confirm',
    params,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据服务ID或者工单编号获取税金确认单
 */
export const saleConfig = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/tax/saleConfig',
    params,
    method: 'get',
  });
};

/**
 * 上传注册授权书(注册)
 */
export const sendFileRegFR = (data) => {
  return request({
    url: '/etax/registerorder/upload/reg/authorization',
    data,
    method: 'post',
  });
};

/**
 * 上传注册授权书(申报)
 */
export const sendFileFR = (data) => {
  return request({
    url: '/etax/transformProxyWorkOrder/upload/proxy/authorization',
    data,
    method: 'post',
  });
};

/**
 * 提交上传法人签名
 */
export const upLoadSign = (data) => {
  return request({
    url: '/etax/derive/client/upload/legalperson/sign',
    data,
    method: 'post',
  });
};

/**
 * 获取免费转代理申报活动
 */
export const freeDeclare = (data) => {
  return request({
    url: '/etax/activity/free/proxy/declare',
    data,
    method: 'post',
  });
};

/**
 * 根据工单编号获取抵扣信息
 */
export const discountList = (id) => {
  return request({
    url: `/workorder/client/declare/taxInfo/${id}`,
    method: 'get',
  });
};

/**
 * 获取一键算税Banner
 */
export const taxBanner = () => {
  return request({
    url: '/xcloud-etax/client/h5/banner/sale/counter/advertise',
    method: 'post',
  });
};

/**
 * 修改零申报凭证
 */
export const updateZero = (data) => {
  return request({
    url: '/etax/user/update/tax/zero/certificate',
    data,
    method: 'post',
  });
};

/**
 * 获取服务进度统计数据
 */
// export const orderStatistic = (data) => {
//   return request({
//     url: "/etax/order_services/statistic",
//     data,
//     method: "post",
//   });
// };
export const orderStatistic = (data) => {
  return request({
    url: '/workorder/client/vat/workOrder/count',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据服务ID或者工单编号获取税金确认单
 */
export const downloadAffirm = (data) => {
  return request({
    url: '/etax/user/download/affirm/forms',
    data,
    method: 'post',
  });
};

/**
 * 申报管理工单统计
 */
export const declareManagerStatistics = (data) => {
  return request({
    // url: "/etax/user/taxWorkOrder/manager/statistics",
    url: '/workorder/client/declare/statistics',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 客户端税务稽查上传资料
 */
export const taxMaterialSubmit = (data) => {
  return request({
    url: '/etax/taxCheckWorkOrder/material/submit',
    data,
    method: 'post',
  });
};

/**
 * 申报管理工单分页列表
 */
export const declareManagerList = (data) => {
  return request({
    // url: "/etax/user/taxWorkOrder/manager/list",
    url: '/workorder/client/declare/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 申报管理待申报工单数量 后端说了还没做，暂时先不管
 */
// export const declareManagerCount = () => {
//   return request({
//     url: "/etax/user/taxWorkOrder/manager/count",
//     method: "post",
//   });
// };

/**
 * 根据公司名称获取用户服务列表
 */
export const gServicesByCompnayname = (data) => {
  return request({
    url: '/etax/order_services/getservices/by/compnayname',
    data,
    method: 'post',
  });
};

/**
 * 客户端编辑服务备注
 */
// export const remarkEditAPI = (params) => {
//   return request({
//     url: "/etax/order_services/edit/remarkRecords",
//     params,
//     method: "get",
//   });
// };
export const remarkEditAPI = (params) => {
  return request({
    url: '/workorder/client/service_work_order/remark',
    data: params,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 下载零申报回执（意大利）
 */
export const downloadITReceiptAPI = (data) => {
  return request({
    url: '/etax/derive/client/download/zeroDeclaration/receipt',
    data,
    method: 'post',
  });
};

/**
 * 营业执照识别
 */
export const identifyBusinessLicense = (data) => {
  return request({
    url: '/etax/derive/client/discern/businessLicense',
    data,
    method: 'post',
  });
};

/**
 * 营业执照识别
 */
export const identifyIdCard = (data) => {
  return request({
    url: '/etax/derive/client/discern/idCard',
    data,
    method: 'post',
  });
};

/**
 * 营业执照识别
 */
export const esAuthorization = (data) => {
  return request({
    url: '/etax/derive/client/download/authorization/es',
    data,
    method: 'post',
  });
};

/**
 * 客户端获取用户远程销售列表
 */
export const taxSaleCheck = (data) => {
  return request({
    url: '/etax/taxSaleCheck/page',
    data,
    method: 'post',
  });
};

/**
 * 客户端获取用户远程销售视图
 */
export const taxSaleCheckInfo = (data) => {
  return request({
    url: '/etax/taxSaleCheck/info/map',
    data,
    method: 'post',
  });
};

/**
 * 客户端修改税号状态（修改成已有税号）
 */
export const taxSaleCheckVatNumber = (data) => {
  return request({
    url: '/etax/taxSaleCheck/update/vatNumber/status',
    data,
    method: 'post',
  });
};

/**
 * 根据国家编码获取配置信息列表
 */
export const listBaseInfoByCondition = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/baseInfoByCondition',
    params,
    method: 'get',
  });
};

/**
 * 申报统计查看明细
 */
export const showTaxLogDetail = (data) => {
  return request({
    url: '/etax/user/taxWorkOrder/total/detail',
    data,
    method: 'post',
  });
};

/**
 * 下载税金明细
 */
export const getTaxMingxi = (data) => {
  return request({
    url: '/etax/derive/client/calculation/export/list',
    data,
    method: 'post',
  });
};

/**
 * 客户端新增/编辑邮寄资料信息
 */
export const getLogisticsInfo = (data) => {
  return request({
    url: '/etax/order_services/edit/logisticsInfo',
    data,
    method: 'post',
  });
};

/**
 * 分页获取合规服务列表
 */
export const hgTaxManageList = (data) => {
  return request({
    url: '/workorder/client/vat/authAgent/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 服务单节点
 */
export const getAuthAgentNodes = () => {
  return request({
    url: '/workorder/client/vat/authAgent/nodes',
    method: 'get',
  });
};

/**
 * 合规备案-根据条件分页查询备案集合
 */
export const getFilingProduct = (data) => {
  return request({
    url: '/workorder/client/filing/prod/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 合规备案-查询备案号下备案商品集合
 */
export const getFilingProductDetails = (id) => {
  return request({
    // url: "/etax/filingProduct/details",
    url: `/workorder/client/filing/prod/${id}`,
    method: 'get',
  });
};

/**
 * 合规备案-新增备案商品
 */
export const filingProductInsert = (data) => {
  return request({
    url: '/workorder/client/filing/prod/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 提交英代欧代资料
 */
export const authAgentCommit = (data) => {
  return request({
    url: '/workorder/client/vat/authAgent/commit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 保存英代欧代资料
 */
export const authAgentSave = (data) => {
  return request({
    url: '/workorder/client/vat/authAgent/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const downloadCertificate = (id) => {
  return request({
    url: `/workorder/client/declare/download/zeroDeclaration/certificate/${id}`,
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 分页获取EPR服务列表
 */
export const EPRManageList = (data) => {
  return request({
    url: '/workorder/client/compliance/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR保存
 */
export const EPRSave = (data) => {
  return request({
    url: '/workorder/client/erp/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * EPR提交
 */
export const EPRCommit = (data) => {
  return request({
    url: '/workorder/client/erp/commit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取流程
 */
export const workflowApi = (id) => {
  return request({
    url: `/workorder/client/workflow/${id}`,
    method: 'get',
  });
};

/**
 * EPR节点
 */
export const getEPRNodes = () => {
  return request({
    url: '/workorder/client/compliance/nodes',
    method: 'get',
  });
};

/**
 * 分页获取EPR服务列表
 */
export const addCategoryBrandList = (data) => {
  return request({
    url: '/workorder/client/epr_expansion/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 分页获取EPR申报列表
 */
export const EPRDeclareList = (data) => {
  return request({
    url: '/workorder/client/epr/declare/page',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 保存epr申报
 */
export const saveDeclareApi = (data) => {
  return request({
    url: '/workorder/client/epr/declare/save',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 提交epr申报
 */
export const submitDeclareApi = (data) => {
  return request({
    url: '/workorder/client/epr/declare/submit',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 创建支付订单 epr
 */
export const createOrderEpr = (data) => {
  return request({
    url: '/workorder/client/vat/workOrder/createOrderEpr',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 上传缴费凭证
 */
export function uploadPaymentVoucher(data) {
  return request({
    url: '/workorder/client/erp/uploadPaymentVoucher',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 电池法填写的申报资料
 * @param {*} params 参数，
 */
export function getBatteryList(params) {
  return request({
    url: '/workorder/management/epr/declare/battery/info',
    method: 'get',
    params,
  });
}
/**
 * 查询申报状态接口
 */
export function TaxBureauStatus(data) {
  return request({
    url: '/workorder/client/declare/TaxBureauStatus',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}

/**
 * 保存申报草稿
 */
export function draft(data) {
  return request({
    url: '/workorder/client/declare/save/draft',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取申报草稿
 */
export function getDraft(data) {
  return request({
    url: '/workorder/client/declare/get/draft',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
}
