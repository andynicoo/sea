import request from '@/utils/request';
import { data } from 'autoprefixer';

/**
 * 首页概况
 */
export const surveyData = (data) => {
  return request({
    url: 'work_client/index/index',
    data,
    method: 'get',
  });
};

/**
 * VAT列表服务
 */
export const orderServicesList = (data) => {
  return request({
    url: '/etax/order_services/company/orderServices/page',
    data,
    method: 'post',
  });
};

/**
 * 分页获取未使用服务列表
 */
export const unusedOrderServices = (data) => {
  return request({
    url: '/etax/order_services/unused/orderServices/page',
    data,
    method: 'post',
  });
};

/**
 * 客户端资讯列表
 */
export const bulletinsHomeList = (data) => {
  return request({
    url: '/etax/bulletins/client/list',
    data,
    method: 'post',
  });
};

/**
 * 客户端资讯列表
 */
export const advertise = (data) => {
  return request({
    url: '/etax/baseinfo/advertise',
    data,
    method: 'post',
  });
};

/**
 * 申报统计柱状图
 */
export const shenbaoBar = (data) => {
  return request({
    url: '/etax/user/taxWorkOrder/total/view',
    data,
    method: 'post',
  });
};

/**
 * 申报统计表格
 */
export const shenbaoTable = (data) => {
  return request({
    url: '/etax/user/taxWorkOrder/total/list',
    data,
    method: 'post',
  });
};

/**
 * 是否是弹窗对象
 */
export const selectGbRegWordOrderToUpload = (data) => {
  return request({
    url: '/workorder/client/vat/reg/selectGbRegWordOrderToUpload',
    data,
    method: 'get',
  });
};

/**
 * 获取待办工单的数量
 */

export const workNum = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/getTaxWorkOrderTodoGroupNum',
    data,
    method: 'post',
  });
};

/**
 * 获取待办事项
 */

export const workTodo = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/getTaxWorkOrderTodoNum',
    data,
    method: 'post',
  });
};

/**
 * 获取待办工单的列表
 */

export const workTodoList = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/pageWorkOrderTodo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取待办工单的列表
 */

export const workTodoProgressList = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/pageProgressQuery',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 查看服务进度
 */

export const viewSeviceProgress = (data) => {
  return request({
    url: 'other/management/businessLog/listByNo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取未读消息
 */

export const unMessage = (data) => {
  return request({
    url: 'information/client/announcement/countUnreadMessage  ',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取待办工单的数量（新）
 */

export const workOrderTodoNum = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/new/getTaxWorkOrderTodoNum',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**
 * 获取待办工单（新）
 */

export const pageWorkOrderTodo = (data) => {
  return request({
    url: 'workorder/client/vat/workOrder/new/pageWorkOrderTodo',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};
