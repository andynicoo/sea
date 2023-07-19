export default {
  // 通知对象
  filterSendType(sendType: any) {
    switch (sendType) {
      case 'ORDER_ATTRIBUTOR':
        return '订单归属人';
      case 'WORKORDER_HANDLE ':
        return '工单处理人';
      default:
        return '客户';
    }
  },
  // 通知方式
  filterSendModel(sendModel: any) {
    switch (sendModel) {
      case 'SMS':
        return '短信';
      case 'CLIENT':
        return '客户端';
      case 'PENDING':
        return '待办';
      case 'WECHATGZH':
        return '微信公众号';
    }
  },
  // 消息类型
  filterMessageType(messageType: any) {
    switch (messageType) {
      case 'SERVICE':
        return '服务通知';
      case 'RENEWAL':
        return '续费通知';
      case 'ORDER':
        return '订单消息';
    }
  },
};
