import util from '@/utils/util.js';
export default {
  // 格式化为千分位
  formatQianFenWei(val) {
    if (util.isNull(val)) return '0.00';
    return Number(val)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },
  //截取掉第三位小数
  subStringNum(val) {
    if (util.isNull(val)) return '0.00';
    return util.formatDecimal(val, 2);
  },

  /**
   * 下单模块
   */
  //支付方式
  filterPayment(val) {
    switch (val) {
      case 0:
        return '未知';
      case 1:
        return '微信';
      case 2:
        return '支付宝';
      case 3:
        return '银联';
      case 5:
        return '微信';
    }
  },

  //支付方式
  filterPaymentChannel(val) {
    switch (val) {
      case 'UNKNOW':
        return '未知 ';
      case 'WEIXIN':
        return '微信';
      case 'ALIPAY':
        return '支付宝';
      case 'UNIONPAY':
        return ' 银联';
      default:
        return '';
    }
  },

  // 申报周期
  filterPeriod(period) {
    // (0、月报 1、季报 2、年报)
    switch (period) {
      case 0:
        return '月报';
      case 1:
        return '季报';
      case 2:
        return '年报';
      default:
        return '';
    }
  },

  //订单状态
  filterOrderStatus(val) {
    switch (val) {
      case 'CANCEL':
        return '已取消';
      case 'WAIT_AUDIT':
        return '待审核';
      case 'WAIT_PAY':
        return '待付款';
      case 'PAID':
        return '已付款';
      case 'PART_PAID':
        return '部分付款';
      case 'AUDIT_FAIL':
        return '审核不通过';
      case 'APPLY_REFUND':
        return '申请退款';
    }
  },
  //订单状态
  filterOrderRefundStatus(val) {
    switch (val) {
      case 0:
        return '待付款 ';
      case 1:
        return '付款待确认';
      case 2:
        return ' 已付款';
      case 3:
        return ' 退款中';
      case 4:
        return ' 部分付款';
      case 5:
        return ' 部分退款';
      case 6:
        return ' 已退款';
    }
  },
  //订单来源
  filterSource(val) {
    switch (val) {
      case 'PC':
        return 'PC网页端';
      case 'H5':
        return 'H5';
      case 'IN':
        return ' 手工录入';
      case 'MP':
        return ' 微信小程序';
      case 'CS':
        return ' 渠道系统';
    }
  },
  //用户来源
  filterState(val) {
    switch (val) {
      case 0:
        return 'PC网页端';
      case 1:
        return 'H5端';
      case 5:
        return '后台录入';
    }
  },
  //付款方式
  filterPaymentType(val) {
    switch (val) {
      case 0:
        return '正常付款';
      case 1:
        return '挂账付款';
      case 2:
        return ' 分期付款';
    }
  },
  filterTarget(val) {
    switch (val) {
      case 1:
        return 'PC端';
      case 2:
        return 'H5页面';
      case 3:
        return ' 线下';
    }
  },
  filterReason(val) {
    switch (val) {
      case 0:
        return '客户店铺原因（挂掉/没注册下来等）';
      case 1:
        return '买多了/不想要了/拍错了';
      case 2:
        return ' 目前活动更优惠';
      case 3:
        return ' 重新合作/店铺关闭';
      case 4:
        return ' 时效太慢';
      case 5:
        return ' 信息弄错';
      case 6:
        return ' 服务态度不好';
      case 7:
        return ' 专业问题未及时处理';
      case 8:
        return ' 其他';
    }
  },

  /** Vat税务模块 */
  functionCode(val) {
    switch (val) {
      case 1:
        return '税号注册';
      case 2:
        return '转代理申报';
      case 3:
        return '税务补缴';
      case 4:
        return ' 转代理 ';
      case 5:
        return '注册+申报';
      case 6:
        return '资料驳回';
      case 23:
        return 'IOSS';
    }
  },

  /**
   * 工单模块
   */
  //服务状态 税号注册
  serviceStatus(val) {
    switch (val) {
      case 0:
        return '未购买';
      case 1:
        return '服务中';
      case 2:
        return '待续费';
      case 3:
        return '税号注销';
      case 4:
        return '已转出';
      case 9:
        return '已取消';
      case 10:
        return '封存';
      case 11:
        return '取消中';
      case 12:
        return '已续费';
      case 13:
        return '确认转出';
      case 14:
        return '续费中';
    }
  },
  /**
   * 获取label
   */
  filterKey(value, list, findKey = 'value', filterKey = 'label') {
    let temp = list.find((item) => item[findKey] === value);
    return temp ? temp[filterKey] : value;
  },

  // 截取string
  stringSlice(value, length) {
    value === undefined || value === null ? (value = '') : '';
    value.length > length ? (value = value.slice(0, length) + '...') : value;
    return value;
  },

  // 格式化剩余时间
  filterRestTime(expirationTime) {
    let text = '';
    let nowTime = new Date().setHours(0, 0, 0, 0);
    let endTime = new Date(expirationTime).setHours(0, 0, 0, 0);
    if (endTime > nowTime) {
      let ms = endTime - nowTime;
      let days = ms / (24 * 3600 * 1000);
      text = days + '天';
    } else if (nowTime === endTime) {
      text = '0天';
    } else {
      text = '已过期';
    }
    return text;
  },

  // 格式化折扣
  filterDiscount(activityType, activityContent) {
    if (activityType === 1) {
      // 折扣
      return util.accMul(activityContent, 10) + '折';
    } else if (activityType === 2) {
      // 直接抵扣
      return activityContent;
    } else {
      return '无';
    }
  },

  // 通知对象
  filterSendType(sendType) {
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
  filterSendModel(sendModel) {
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
  // 消息状态
  filterMessageStatus(messageStatus) {
    switch (messageStatus) {
      case 'YES':
        return '已读';
      case 'NO':
        return '未读';
    }
  },
  // 通知状态
  filterSendStatus(sendStatus) {
    switch (sendStatus) {
      case 'SUCCESS':
        return '成功';
      case 'FAIL':
        return '失败';
    }
  },
  // 客户等级
  filterCustomLevel(level) {
    switch (level) {
      case 1:
        return 'SMB客户';
      case 2:
        return 'KA用户';
      case 3:
        return '品牌客户';
      case 4:
        return '渠道客户';
    }
  },
};
