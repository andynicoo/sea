import { get, post } from '../util/request'
// 获取站内信
function getMessage(data) {
  return get('/basic/config/platform/receiveMessage', data)
}
// 根据key查询广告
function getAdByKey(data) {
  return get('/mg/mg-advertising/queryImgByAdvertisingKey', data)
}
export { getMessage, getAdByKey }
