import request from '@/libs/request'

/**
 * 禁用系统公告
 */
export const stopAnnouncementById = data => {
  return request({
    url: '/information/management/announcement/stopAnnouncementById',
    data,
    method: 'put'
  })
}

/**
 * 新增系统公告
 */
export const insertSys = data => {
  return request({
    url: '/information/management/announcement/insertSys',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 系统公告弹窗
 */
export const getSysAnnouncementIng = () => {
  return request({
    url: '/information/management/announcement/getSysAnnouncementIng',
    method: 'get',
  })
}
