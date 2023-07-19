import { get, post } from '../util/request'

const Play = {
  getPlayList: (params) => post('/finance-recharge-conf/list', params), //获取店铺列表
  getAccount: (params) => get('/finance-member-account/get', params), //获取账户余额
  setPlay: (params) =>
    get('/finance-recharge-order/get-aliPcPay-base64', params), //发起支付
  getPlayRecord: (params) => post('/finance-record/list', params), //获取充值记录
  submitPlay: (params) => post('/finance-recharge-order/add-aliPcPay', params), //提交支付订单
  payment: (params) => post('/fw/payment/pay', params), //充值接口
  getAvailableList: (params) => get('/fw/payWay-config/available-list', params) //可用列表查询(充值页面)
}

export default Play
