import { toPay } from '../api/shoppingCar/shoppingCar';

import router from '@/router';
import { Message } from 'view-design';

export function routerOrder({ invoiceDTO, orderNo } = {}) {
  setTimeout(() => {
    if (router.history.current.path != '/myOrder') {
      // if (invoiceDTO && invoiceDTO.invoiceType != 'NONE') {
      //   router.push({ name: 'myOrder', params: { ishowInvoiceID: orderNo } });
      // } else {
      router.push('/myOrder');
      // }
    } else {
      location.reload();
    }
  }, 1000);
}

/**
 * @param {*} clientSide  h5 pc app
 * @param {*} orderInfo
 * @param {*} payInfo
 * @param {*} callBack  pay notice result
 */
export async function userPay(clientSide, orderInfo, payInfo, callBack, invoiceDTO) {
  let plaConfig = {
    kby: '30',
    wg: '49',
  };
  //free order
  if (Number(payInfo.amount) == 0) {
    Message.success('支付成功');
    router.history.current.path != '/myOrder' && router.push('/myOrder');
  } else {
    let businessNo = payInfo.orderNo ? payInfo.orderNo : void 0,
      mobile = JSON.parse(localStorage.getItem('objInfo')).userMobile,
      productName = orderInfo.map((item) => item.productName).toString(),
      { sessionId } = localStorage;
    let { payWayName, payWayKey, orderNo, orderMoney, orderId, resultCode, goPaymentSucceeded, ...pay } = payInfo;
    let params = {
      ...pay,
      businessNo,
      payWayKey,
      mobile,
      productName,
      enterpriseId: plaConfig[process.env.NODE_PLA],
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
      let dom = document.getElementById('box');
      dom.innerHTML = resPeonse;
      document.querySelector("form[name ='pay_form']").submit();
    } else {
      resPeonse && callBack({ orderNo, payWayKey, data: resPeonse, goPaymentSucceeded });
    }
  }
}
