import { post } from '../util/request'
// 获取第三方登录授权code
function getOauthCode(data) {
  return post('/oauth/token', data)
}
export { getOauthCode }
