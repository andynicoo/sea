import request from "@/utils/request";

/**
 * 收货地址操作
 */
const obj = {
  add: 'addAddress',
  delete: 'delete',
  detail: 'getUserAddressDetail',
  list: 'getUserAddressList',
  update: 'updateAddress'
}
export const handleAddress = (data= {}, type) => {
  const addType = obj[type]
  return request({
    url: `/custuser/client/user/${addType}`,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

/**
 * 设置默认
 */
export const setDefault = (data) => {
  return request({
    url: '/custuser/client/user/setDefault',
    data,
    method: 'post',
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
}
