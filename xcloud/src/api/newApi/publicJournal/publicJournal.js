import request from '@/libs/request';

//获取业务日志
export const getBusinessLog = (data) => {
  return request({
    url: '/other/management/businessLog/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//获取操作记录列表
export const getBusinessLogListByNo = (data) => {
  return request({
    url: '/other/management/businessLog/listByNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


// 调试
// 获取登录日志分页数据
export const loginLog = (data) => {
  return request({
    url: '/other/management/loginLog/list',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// /

// 调试
// 获取操作模块列表
export const listBusinessModel = (data) => {
  return request({
    url: '/other/management/businessLog/listBusinessModel',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
