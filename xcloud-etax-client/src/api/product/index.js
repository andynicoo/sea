import request from '@/utils/request';


//新获取商品详情接口
export const newProductInfoDetail = (id) => {
    return request({
        url: 'https://sit2-xcloud-console.itaxs.com/api/productcenter/productInfo/detail?id=' + id,
        method: 'get',
    });
};

//新商品加入用户购物车
 export const addToCart = (data) => {
    return request({
      url: '/order/client/cart/add',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  };


//新用户购物车商品数量

 export const totalShoppingCart = (data) => {
    return request({
      url: '/order/client/cart/count',
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });
  };  