import { getPayMode, toPay } from '../../../api/shoppingCar/shoppingCar';
import { totalShoppingCart } from '@/api/shoppingCar/shoppingCar';

export async function userPay(params, callBack) {
  let { data } = await getPayMode();
  console.log('支付方式回调', data);
  params = { ...params, ...data };
  let { code } = await toPay(params);

  // 支付成功后刷新购物车数据
  totalShoppingCart().then((res) => {
    this.$store.commit('saveCarNumStatue', res.data);
  });

  callBack && callBack(code);
}
