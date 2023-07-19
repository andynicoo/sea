import request from '@/libs/request'

/**
 * 获取菜单下操作列表
 * @param menuId
 */
export const getPrizeList = (data) => {
  return request({
    url: '/etax/awardInfo/management/turntable/user/record/list',
    data,
    method: 'post'
  })
}