import request from '@/libs/request'

/**
 * 获取公告列表
 */
 export const getAnnouncementList = params => {
    return request({
        url: '/information/management/announcement/page',
        params,
        method: 'get'
    })
}

/**
 * 获取公告详情
 */
 export const getAnnouncementAllInfo = id => {
    return request({
        url: '/information/management/announcement/item/' + id,
        method: 'get'
    })
}

/**
 * 获取公告回显详情
 */
 export const getAnnouncementInfo = id => {
    return request({
        url: '/information/management/announcement/' + id,
        method: 'get'
    })
}

/**
 * 新增公告
 */
export const addAnnouncement = data => {
    return request({
        url: '/information/management/announcement',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 编辑公告
 */
 export const updateAnnouncement = data => {
    return request({
        url: '/information/management/announcement',
        data,
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 发送公告
 */
 export const sendAnnouncement = id => {
    return request({
        url: '/information/management/announcement/sent/' + id,
        method: 'put'
    })
}

/**
 * 获取公告接收用户列表
 */
 export const announcementUserList = (id, params) => {
    return request({
        url: '/information/management/announcement/customerInfo/' + id,
        params,
        method: 'get'
    })
}

/**
 * 删除公告通知
 */
 export const delAnnouncement = (id) => {
    return request({
        url: '/information/management/announcement/delAnnouncementById?id=' + id,
        method: 'delete'
    })
}