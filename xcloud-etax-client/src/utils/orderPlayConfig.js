import { getPayMode, taxRate } from '../api/shoppingCar/shoppingCar';
import { toPay } from '@/api/payment/index';
import util from '@/utils/util';
import { Message } from 'view-design';
import router from '@/router';
export class Pay {
  constructor(contractTypeEM, orderPaidMoney) {
    this.palyMode = [];
    this.rateList = [];
    // this.taxes = 0;
    this.contractTypeEM = contractTypeEM;
    this.orderPaidMoney = orderPaidMoney;
  }

  async init() {
    let { data: rateList } = await taxRate();
    console.log('init', rateList);
    this.rateList = rateList;
  }

  taxes() {
    let item = this.rateList.find((item) => item.type == contractTypeEM);
    let taxRate = (item && item.taxRate) || 0;
    console.log('sing ', this.orderPaidMoney, taxRate, this.rateList);
    return util.formatDecimal(util.floatMultiply(taxRate, this.orderPaidMoney), 2);
  }
}

class taxes {
  constructor(contractTypeEM, orderPaidMoney) {
    this.contractTypeEM = contractTypeEM;
    this.orderPaidMoney = orderPaidMoney;
    this.rateList = [];
  }

  async init() {
    let { data: rateList } = await taxRate();

    this.rateList = rateList;
  }

  set rateList(rateList) {
    this._rateList = rateList;
  }
  taxes() {
    let item = this.rateList.find((item) => item.type == contractTypeEM);
    let taxRate = (item && item.taxRate) || 0;

    return util.formatDecimal(util.floatMultiply(taxRate, this.orderPaidMoney), 2);
  }
}

export const PALYMODE = [
  {
    name: '微信',
    src: require('@/assets/images/sureOrder/wx-pay.png'),
    active: true,
    current: 1,
  },
  {
    name: '支付宝',
    src: require('@/assets/images/sureOrder/zfb-pay.png'),
    active: false,
    current: 2,
  },
  {
    name: '银联',
    src: require('@/assets/images/sureOrder/yl-pay.png'),
    active: false,
    current: 3,
  },
];
async function getPayModeAPi() {
  let { data } = await getPayMode();
}

export function changeMethod(index, arr) {
  arr &&
    arr.forEach((element, idx) => {
      if (index == idx) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
}

/**
 * @param {*} clientSide  h5 pc app
 * @param {*} orderInfo
 * @param {*} payInfo
 * @param {*} callBack  pay notice result
 */
export async function userPay(clientSide, orderInfo, payInfo, callBack) {
  //free order
  if (Number(payInfo.orderMoney) == 0) {
    Message.success('支付成功');
    // 支付成功触发积分反馈
    util.getUserInegralMessage();
    setTimeout(() => {
      router.history.current.path != '/orderList' && router.push('/orderList');
    }, 1500);
    return;
  }
  let businessNo = payInfo.orderNo ? payInfo.orderNo : void 0,
    mobile = JSON.parse(localStorage.getItem('objInfo')).userMobile,
    productName = orderInfo.map((item) => item.productName).toString(),
    sessionId = localStorage.sessionId;
  let { payWayName, payWayKey, orderNo, orderMoney, orderId, resultCode, goPaymentSucceeded, ...pay } = payInfo;
  let params = {
    ...pay,
    businessNo,
    payWayKey,
    mobile,
    productName,
    enterpriseId: 29,
    applyPort: clientSide,
    [clientSide == 'PC' ? 'sessionId' : 'imei']: sessionId,
  };
  let resPeonse = undefined;
  try {
    resPeonse = await toPay(params);
  } catch (error) {
    resPeonse = error;
  }

  if (payWayKey.includes('BANK')) {
    if (/^(http:|https:)/.test(resPeonse)) {
      window.open(resPeonse, `_self`);
    } else {
      let dom = document.getElementById('pay-box');
      dom.innerHTML = resPeonse;
      document.querySelector("form[name ='pay_form']").submit();
    }
  } else {
    callBack({ orderNo, payWayKey, data: resPeonse, payParams: orderInfo, goPaymentSucceeded });
  }
}
