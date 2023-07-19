import request from '@/libs/request'

// 分页获取开票列表
export const getInvoiceList = (data) => {
    return request({
        url: '/etax/management/invoiceInfo/list',
        data,
        method: 'post'
    })
}

// 开票详情
export const getInvoiceDetail = (data) => {
    return request({
        url: '/etax/management/invoiceInfo/detail',
        data,
        method: 'post'
    })
}

// 上传发票
export const uploadInvoice = (data) => {
    return request({
        url: '/etax/management/invoiceInfo/upload/invoice',
        data,
        method: 'post'
    })
}