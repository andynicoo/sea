import { toPay, cycleToPay } from './../api/shoppingCar';

import router from '@/router';
import { Message } from 'view-design';
import vue from '../../src/main';
export function routerOrder({ invoiceDTO, orderNo } = {}) {
  setTimeout(() => {
    if (router.history.current.path != '/myOrder') {
      // if (invoiceDTO && invoiceDTO.invoiceType != 'NONE') {
      //   router.push({ name: 'myOrder', params: { ishowInvoiceID: orderNo } });
      // } else {
      router.push('/myOrder');
      // }
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
  const { userMobile: mobile, enterpriseId } = JSON.parse(localStorage.getItem('objInfo'));
  if (Number(payInfo.amount) == 0) {
    Message.success('支付成功');
    if (enterpriseId == 42) {
      router.push('/orderManage/orderList');
    } else if (enterpriseId == 40) {
      router.push('/orderList');
    } else if (enterpriseId == 29 || enterpriseId == 30) {
      //跨标云，跨税云跳支付成功落地页
      router.push({
        path: '/paymentSucceeded',
        query: {
          orderNo: payInfo.orderNo,
        },
      });
    } else if (router.history.current.path != '/myOrder' && ![42].includes(enterpriseId)) {
      router.push(localStorage.orderListPath ? localStorage.orderListPath : '/myOrder');
    }
  } else {
    let businessNo = payInfo.orderNo ? payInfo.orderNo : void 0,
      productName = orderInfo.map((item) => item.productName).toString(),
      { sessionId } = localStorage;

    let { payWayName, payWayKey, orderNo, orderMoney, orderId, resultCode, goPaymentSucceeded, isOa } = payInfo;
    let params = Object.assign(payInfo, {
      businessNo,
      payWayKey,
      mobile,
      productName,
      enterpriseId,
      applyPort: clientSide,
      [clientSide == 'PC' ? 'sessionId' : 'imei']: sessionId,
    });
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
        let dom = document.getElementById('box') || document.getElementById('pay-box');
        dom.innerHTML = resPeonse;
        document.querySelector("form[name ='pay_form']").submit();
      }
    } else {
      resPeonse && callBack({ orderNo, payWayKey, data: resPeonse, goPaymentSucceeded, isOa });
    }
  }
}

/**
 * @param {*} businessNo  orderNO
 */
export async function cyclePay(businessNo) {
  let { code, data } = await cycleToPay({ businessNo });
  if (code == 0) {
    Message.success('支付成功');
    vue.$cyclePaySuccessDialog(data);
    // routerPush("/orderManage/orderList");
  }
}
