import http from '@/utils/request'
import { objectToQueryString } from '@/utils'

function login(data) {
  return http({
    url: '/api/mg/mg-account/login',
    method: 'post',
    data,
    showLoading: false
  })
}

function loginNew(data) {
  return http({
    url: '/oauth/token?' + objectToQueryString(data),
    method: 'post',
    data: {},
    showLoading: false
  })
}
function getUserInfo(data) {
  return http({
    url: '/mg/mg/mg-account/getManageUserInfo',
    method: 'post',
    data,
    showLoading: false
  })
}
export {
  login,
  loginNew,
  getUserInfo
}
