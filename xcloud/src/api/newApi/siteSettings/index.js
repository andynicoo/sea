import request from '@/libs/request';
// 网站设置模块 接口文件

/**
 *广告 - 新增广告
 */
export const addAdvertising = (data) => {
  return request({
    url: '/information/ad/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *广告 - 编辑广告
 */
export const eidtDvertising = (data, id) => {
  return request({
    url: '/information/ad/edit?id=' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 *广告 - 查询一条广告
 */
export const selectAddAdvertisingItem = (params) => {
  return request({
    url: '/information/ad/getById',
    method: 'get',
    params,
  });
};

/**
 * 广告-广告首页列表
 * @param {*} data
 * @returns
 */
export const getAddAdvertisingList = (data) => {
  return request({
    url: '/information/ad/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 广告-删除广告
 */
export const delectAdvertising = (data) => {
  return request({
    url: '/information/ad/del',
    method: 'post',
    data,
  });
};

//  --------------------广告位 ---------------------------------
/**
 * 广告位-编辑广告位
 */
export const addAdvertisingLocation = (data) => {
  return request({
    url: '/information/ad_position/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 广告位-列表页
 */
export const advertisingLocationGetList = (data) => {
  return request({
    url: '/information/ad_position/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 广告位-列表页
 */
export const advertisingDelect = (data) => {
  return request({
    url: '/information/ad_position/del',
    method: 'post',
    data,
    // headers: {
    //   "Content-Type": "application/json;charset=UTF-8",
    // },
  });
};

/**  广告位-编辑 */
export const advertisingLocationEdit = (data, id) => {
  return request({
    url: '/information/ad_position/edit?id=' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** 广告位- 删除一条广告*/
export const advertisingLocationDelect = (data) => {
  return request({
    url: '/information/ad_position/del',
    method: 'post',
    data,
    // headers: {   information/ad_position/openOrClose
    //   "Content-Type": "application/json;charset=UTF-8",
    // },
  });
};

/**  广告位-停用/启用 */
export const advertisingLocationOpenOrClose = (data) => {
  return request({
    url: '/information/ad_position/openOrClose',
    method: 'post',
    data,
    // headers: {   information/ad_position/openOrClose    information/ad_position/getById
    //   "Content-Type": "application/json;charset=UTF-8",
    // },
  });
};

/**  查询一条 广告位 */
export const advertisingLocationGetByID = (params) => {
  return request({
    url: '/information/ad_position/getById',
    method: 'get',
    params,
    // headers: {   information/ad_position/openOrClose
    //   "Content-Type": "application/json;charset=UTF-8",
    // },
  });
};

//  --------------------广告位 END ---------------------------------

/** ---------------------------合作伙伴 ----------------------------**/

/**
 * 新增合作伙伴
 * @param {*} data
 * @returns
 */
export const addCooperative = (data) => {
  return request({
    url: '/information/friend_link/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 删除合作伙伴
 * @param {*} data
 * @returns
 */
export const delectCooperative = (data) => {
  return request({
    url: '/information/friend_link/del',
    method: 'post',
    data,
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8',
    // },
  });
};

/**
 * 编辑合作伙伴
 * @param {*} data
 * @returns
 */
export const editCooperative = (data, id) => {
  return request({
    url: '/information/friend_link/edit?id=' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查询合作伙伴
 * @param {*} data
 * @returns
 */
export const selectCooperative = (params) => {
  return request({
    url: '/information/friend_link/getById',
    method: 'get',
    params,
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8',
    // },
  });
};

/**
 * 列表合作伙伴
 * @param {*} data
 * @returns
 */
export const getCooperativeList = (data) => {
  return request({
    url: '/information/friend_link/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 列表合作伙伴 开启/关闭
 * @param {*} data
 * @returns
 */
export const cooperativeOpenOrClose = (data) => {
  return request({
    url: '/information/friend_link/openOrClose',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/** ---------------------------合作伙伴END ----------------------------**/

/** ---------------------------导航管理 ----------------------------**/

/**
 * 新增导航
 * @param {*} data
 * @returns
 */
export const addNavigation = (data) => {
  return request({
    url: '/information/management/nav/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取一条 导航数据
 * @param {*} data
 * @returns
 */
export const getNavigationById = (params) => {
  return request({
    url: '/information/management/nav/getById',
    method: 'get',
    params,
  });
};

/**
 * 导航页列表
 * @param {*} data
 * @returns
 */
export const getNavigationList = (data) => {
  return request({
    url: '/information/management/nav/list',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 新增/编辑三级导航
 * @param {*} data
 * @returns
 */
export const navTertiaryHandle = (data, id) => {
  return request({
    url: '/information/management/nav/tertiaryHandle?id=' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 删除 导航
 * @param {*} data
 * @returns
 */
export const delectNavigaiontion = (data) => {
  return request({
    url: '/information/management/nav/del',
    method: 'post',
    data,
  });
};

//

/**
 * 编辑 一级二级 导航
 * @param {*} data
 * @returns
 */
export const editNavigaiontion = (data, id) => {
  return request({
    url: '/information/management/nav/edit?id=' + id,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 导航设置seo
 * @param {*} data
 * @returns
 */
export const editSeo = (data) => {
  return request({
    url: '/information/management/nav/editSEO',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/** ---------------------------导航管理END ----------------------------**/

/** ---------------------------首页推荐 ----------------------------**/

/**
 * 新增服务推荐
 * @param {*} data
 * @returns
 */
export const addIndexRemcommend = (data) => {
  return request({
    url: '/information/service/recommend/addService',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 根据id删除服务推荐信息
 * @param {*} data
 * @returns
 */
export const delectIndexRemcommend = (data) => {
  return request({
    url: '/information/service/recommend/delById/' + data,
    method: 'post',
    // data,
  });
};

/**
 * 根据id获取服务推荐信息
 * @param {*} data
 * @returns
 */
export const getIndexRemcommendById = (params) => {
  return request({
    url: '/information/service/recommend/getServiceAndProduct',
    method: 'get',
    params,
  });
};

/**
 * 获取首页推荐列表
 * @param {*} data
 * @returns
 */
export const getIndexRemcommendList = (data) => {
  return request({
    url: '/information/service/recommend/getServiceList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 编辑首页推荐
 * @param {*} data
 * @returns
 */
export const editIndexRemcommend = (data) => {
  return request({
    url: '/information/service/recommend/updService',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 添加服务商品
 * @param {*} data
 * @returns
 */
export const addServiceProduct = (data) => {
  return request({
    url: '/information/service/recommendProduct/addServiceProduct',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
/** ---------------------------首页推荐END ----------------------------**/

/**
 * 获取当前已发布数
 * @param {*} data
 * @returns
 */
export const sendCount = (data) => {
  return request({
    url: '/information/ad/sendCount',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
