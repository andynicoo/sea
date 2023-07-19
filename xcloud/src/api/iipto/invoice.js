import request from '@/libs/request'

// 分页获取开票列表
export const getInvoiceList = (data) => {
  return request({
    url: '/trademark/management/invoiceInfo/list',
    data,
    method: 'post'
  })
}

// 开票详情
export const getInvoiceDetail = (data) => {
  return request({
    url: '/trademark/management/invoiceInfo/detail',
    data,
    method: 'post'
  })
}

// 上传发票
export const uploadInvoice = (data) => {
  return request({
    url: '/trademark/management/invoiceInfo/upload/invoice',
    data,
    method: 'post'
  })
}

// 更新发票
export const updateInvoiceApi = (data) => {
  return request({
    url: '/trademark/management/invoiceInfo/update/invoice',
    data,
    method: 'post'
  })
}

// 取消发票
export const cancelInvoiceApi = (data) => {
  return request({
    url: '/trademark/management/invoiceInfo/clean/invoice',
    data,
    method: 'post'
  })
}