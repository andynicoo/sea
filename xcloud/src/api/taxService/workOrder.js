import request from '@/libs/request'
//注册已提交资料
export const yiSubFile = (data) => {
  return request({
    url: '/etax/workorder/management/register/submittedMaterial',
    data,
    method: 'post'
  })
}
//提交服务商时间
export const serviceTime = (data) => {
  return request({
    url: '/etax/order_services/ServiceTime',
    data,
    method: 'post'
  })
}
//提交税局时间
export const taxTime = (data) => {
  return request({
    url: '/etax/remark/submitTaxTime',
    data,
    method: 'post'
  })
}
//上传/修改翻译件
export const updateOrSave = (data) => {
  return request({
    url: '/etax/remark/updateOrSave',
    data,
    method: 'post'
  })
}
//转代理已提交资料
export const turnToAgentYiSubFile = (data) => {
  return request({
    url: '/etax/tax/workorder/management/submittedMaterial',
    data,
    method: 'post'
  })
}
//录入EORI号
export const enterEoriNum = (data) => {
  return request({
    url: '/etax/tax/workorder/management/inputeori',
    data,
    method: 'post'
  })
}
//获取注册税号列表
export const getRegisterTaxList = (data) => {
  return request({
    url: '/etax/workorder/management/register/list',
    data,
    method: 'post'
  })
}
//获取注册税号详情
export const getRegisterDetail = (data) => {
  return request({
    url: '/etax/workorder/management/register/detail',
    data,
    method: 'post'
  })
}
//获取税务申报列表
export const getDeclareList = (data) => {
  return request({
    url: '/etax/workorder/management/tax/list',
    data,
    method: 'post'
  })
}
//获取税务申报服务列表
export const getDeclareServiceList = (data) => {
  return request({
    url: '/etax/services/management/list',
    data,
    method: 'post'
  })
}
//获取税务申报异常工单列表
export const getDeclareServiceAbnormalList = (data) => {
  return request({
    url: '/etax/exceptionTransformProxyWorkOrder/list',
    data,
    method: 'post'
  })
}
//已处理税务申报异常工单列表
export const chuliDeclareServiceAbnormalList = (data) => {
  return request({
    url: '/etax/exceptionTransformProxyWorkOrder/processed',
    data,
    method: 'post'
  })
}
//税务申报异常工单列表添加备注
export const beizhuDeclareServiceAbnormalList = (data) => {
  return request({
    url: '/etax/exceptionTransformProxyWorkOrder/remark',
    data,
    method: 'post'
  })
}
//获取税务申报详情
export const getDeclareDetail = (data) => {
  return request({
    url: '/etax/workorder/management/tax/detail',
    data,
    method: 'post'
  })
}
//获取税务申报服务详情
export const getDeclareServiceDetail = (data) => {
  return request({
    url: '/etax/services/management/detail',
    data,
    method: 'post'
  })
}
//录入税号
export const enterTaxNum = (data) => {
  return request({
    url: '/etax/workorder/management/register/input/taxinfo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//发送提醒
export const sendMessage = (data) => {
  return request({
    url: '/etax/workorder/management/register/send/msm',
    data,
    method: 'post'
  })
}
//编辑保存注册资料
export const editRegiFile = (data) => {
  return request({
    url: '/etax/workorder/management/register/edit/material',
    data,
    method: 'post'
  })
}
//编辑公司信息 
export const editCompany = (data) => {
  return request({
    url: '/etax/workorder/management/register/edit/company/material',
    data,
    method: 'post',
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}
//编辑法人信息 
export const editLegalPerson = (data) => {
  return request({
    url: '/etax/workorder/management/register/edit/legalperson/material',
    data,
    method: 'post',
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}
//编辑店铺信息 
export const editShop = (data) => {
  return request({
    url: '/etax/workorder/management/register/edit/shops/material',
    data,
    method: 'post',
    // headers: {
    //     'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}
//编辑文件信息 
export const editFile = (data) => {
  return request({
    url: '/etax/workorder/management/register/edit/file/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//提交审核
export const submitAudit = (data) => {
  return request({
    url: '/etax/workorder/management/register/submit/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//审核
export const handleAudit = (data) => {
  return request({
    url: '/etax/workorder/management/register/audit/material',
    data,
    method: 'post'
  })
}
//税务申报-上传申报回执
export const uploadDeclare = (data) => {
  return request({
    url: '/etax/workorder/management/tax/upload/receipt',
    data,
    method: 'post'
  })
}
//税务申报-上传申报回执
export const uploadDeclareNew = (data) => {
  return request({
    url: '/etax/tax/workorder/management/upload/receipt',
    data,
    method: 'post'
  })
}
//税务申报-上传缴税凭证
export const uploadTax = (data) => {
  return request({
    url: '/etax/workorder/management/tax/upload/certificate',
    data,
    method: 'post'
  })
}
//税务申报-上传缴税凭证
export const uploadTaxNew = (data) => {
  return request({
    url: '/etax/tax/workorder/management/upload/certificate',
    data,
    method: 'post'
  })
}
//提交申报
export const submitDeclare = (data) => {
  return request({
    url: '/etax/workorder/management/tax/submit/material',
    data,
    method: 'post'
  })
}
//提交申报
export const submitDeclareNew = (data) => {
  return request({
    url: '/etax/tax/workorder/management/submit/material',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//获取法人出生地
export const getBirthPlace = (params) => {
  return request({
    url: '/etax/workorder/management/register/get/legalperson/country/name',
    params,
    method: 'get'
  })
}
//下载注册资料
export const downLoadRegiFile = (data) => {
  return request({
    url: '/etax/workorder/management/register/down/material',
    data,
    method: 'post',
    responseType: 'blob',
    // headers: {
    //     'Content-Type': 'application/octet-stream'
    // }

  })
}
//下载申报资料
export const downLoadDeclareFile = (data) => {
  return request({
    url: '/etax/workorder/management/tax/down/material',
    data,
    method: 'post',
    responseType: 'blob'
  })
}
//下载申报资料
export const downLoadDeclareFileNew = (data) => {
  return request({
    url: '/etax/tax/workorder/management/down/material',
    data,
    method: 'post',
    responseType: 'blob'
  })
}
//标记完成
export const markComplete = (data) => {
  return request({
    url: '/etax/workorder/management/tax/mark/completed',
    data,
    method: 'post'
  })
}
//标记完成
export const markCompleteNew = (data) => {
  return request({
    url: '/etax/tax/workorder/management/mark/completed',
    data,
    method: 'post'
  })
}
//上传抵扣明细
export const uploadDeductInfo = (data) => {
  return request({
    url: '/etax/workorder/management/tax/upload/deduction/item',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
//完成转代理
export const finishAgent = (data) => {
  return request({
    url: '/etax/tax/workorder/management/finish/proxy',
    data,
    method: 'post',
  })
}

//第一次报税
export const firstDeclear = (data) => {
  return request({
    url: '/etax/tax/workorder/management/first/taxWorkOrder',
    data,
    method: 'post',
  })
}

//转代理资料审核
export const auditTurnAgent = (data) => {
  return request({
    url: '/etax/tax/workorder/management/audit/material',
    data,
    method: 'post',
  })
}

/**
 * 西班牙转代理海牙认证确认签收资料
 */
export const confirmReceiptES = (data) => {
  return request({
    url: '/etax/tax/workorder/management/hy/confirm/receipt',
    data,
    method: 'post'
  })
}
/**
 * 录入西班牙海牙信息
 */
export const enteringHaugeInfo = (data) => {
  return request({
    url: '/etax/tax/workorder/management/hy/input/info',
    data,
    method: 'post'
  })
}
/**
 * 西班牙填写寄送海牙单号
 */
export const enteringHaugeTrankingNumber = (data) => {
  return request({
    url: '/etax/tax/workorder/management/hy/input/number',
    data,
    method: 'post'
  })
}
/**
 * 西班牙填写寄送税局单号
 */
export const enteringTaxTrankingNumber = (data) => {
  return request({
    url: '/etax/tax/workorder/management/tax/input/number',
    data,
    method: 'post'
  })
}
/**
 * 意大利转代理填写前税代编码
 */
export const cfOldRap = (data) => {
  return request({
    url: '/etax/tax/workorder/management/tax/input/cfOldRap',
    data,
    method: 'post'
  })
}

/**
 * 根据国家编码获取服务商配置信息
 */
export const supplierByCondition = (params) => {
  return request({
    url: '/etax/management/baseinfo/list/supplierByCondition',
    params,
    method: 'get'
  })
}

/**
 * 查询法国软件商回调的错误信息
 */
export const frRecord = (data) => {
  return request({
    url: '/etax/tax/workorder/management/fr/tax/record',
    data,
    method: 'post'
  })
}

/**
 * 提交申报数据到税局（法国）
 */
export const frReSubmit = (data) => {
  return request({
    url: '/etax/tax/workorder/management/fr/tax/submit',
    data,
    method: 'post'
  })
}

/**
 * 重新上传申报回执和扣款回执（意大利）
 */
export const ITReSubmit = (data) => {
  return request({
    url: '/etax/tax/workorder/management/update/receipt',
    data,
    method: 'post'
  })
}

/**
 * 更改申报状态
 */
export const updateShenbaoStatus = (data) => {
  return request({
    url: '/etax/tax/workorder/management/updateWorkOrderStatus',
    data,
    method: 'post'
  })
}

/**
 * 是否有补申报工单
 */
export const canGeneSupperDecl = (data) => {
  return request({
    url: '/etax/tax/workorder/management/canGeneSupperDecl',
    data,
    method: 'post'
  })
}

/**
 * 获取补申报弹框的信息
 */
export const geneSupperDeclParam = (data) => {
  return request({
    url: '/etax/tax/workorder/management/geneSupperDeclParam',
    data,
    method: 'post'
  })
}

/**
 * 确认生成补申报工单
 */
export const createSupperDeclTaxWorkOrder = (data) => {
  return request({
    url: '/etax/tax/workorder/management/createSupperDeclTaxWorkOrder',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post'
  })
}

/**
 * 修改服务商分配编码
 */
export const updateSupplierAssignsServiceId = (data) => {
  return request({
    url: '/etax/order/management/updateSupplierAssignsServiceId',
    data,
    method: 'post'
  })
}
