import request from '@/libs/request'

/**
 * 上传/下载中心列表
 */
export const getUploadAndDownloadRecordsList = params => {
  return request({
    url: '/workorder/management/load_record/page',
    params,
    method: 'get'
  })
}

/**
 * 上传/下载中心删除
 */
export const delUploadAndDownloadRecordsList = data => {
  return request({
    url: '/workorder/management/load_record',
    data,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
