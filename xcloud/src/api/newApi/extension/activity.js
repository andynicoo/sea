import request from '@/libs/request';

/**删除一个活动
 * @param {*} params
 * @returns
 */
export function activityDelApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/del',
    method: 'post',
    data: params,
  });
}
/**活动编辑
 * @param {*} params
 * @returns
 */
export function activityEditApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/edit',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**获取一个活动
 * @param {*} params
 * @returns
 */
export function activityGetDetailApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/getDetail',
    method: 'post',
    data: params,
  });
}
/**复制一个活动详情
 * @param {*} params
 * @returns
 */
export function activityGetCopyDetailApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/getCopyDetail',
    method: 'post',
    data: params,
  });
}
/**活动列表
 * @param {*} params
 * @returns
 */
export function activityPageApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/page',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**创建活动
 * @param {*} params
 * @returns
 */
export function activitySaveApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**上/下架活动
 * @param {*} params
 * @returns
 */
export function activityUpperOrLowerApi(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/upperOrLower',
    method: 'post',
    data: params,
  });
}

/**
 * 商品属性分类列表
 */
export const updateStockApi = (data) => {
  return request({
    url: '/marketingcenter/management/marketingActivity/update/stock',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

/**抽奖活动列表
 * @param {*} params
 * @returns
 */
export function drawPageApi(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/pages',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**抽奖活动上架
 * @param {*} params
 * @returns
 */
export function drawUpper(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/upper',
    method: 'post',
    data: params,
  });
}

/**抽奖活动下架
 * @param {*} params
 * @returns
 */
export function drawLower(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/lower',
    method: 'post',
    data: params,
  });
}

/**抽奖活动新增
 * @param {*} params
 * @returns
 */
export function drawAdd(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/add',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**抽奖活动编辑
 * @param {*} params
 * @returns
 */

export function drawEdit(params, id) {
  return request({
    url: '/marketingcenter/management/luckyDraw/edit',
    method: 'post',
    params: { id: id },
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取单个抽奖活动信息
 * @param {*} params
 * @returns
 */
export const getDrawData = (params) => {
  return request({
    url: '/marketingcenter/management/luckyDraw/getById',
    method: 'get',
    params,
  });
};

/**获取单个抽奖活动抽奖记录
 * @param {*} params
 * @returns
 */

export function getDrawRecordData(params, id) {
  return request({
    url: '/marketingcenter/management/luckyDraw/getLuckyDrawLogsPageById',
    method: 'post',
    params: { id: id },
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑单个抽奖活动抽
 * @param {*} params
 * @returns
 */

export function editPrize(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/updateDrawLogStatus',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**删除一个抽奖活动
 * @param {*} params
 * @returns
 */
export function drawDel(params) {
  return request({
    url: '/marketingcenter/management/luckyDraw/del',
    method: 'delete',
    params,
  });
}

/**集赞活动的列表
 * @param {*} params
 * @returns
 */
export function praiseList(params) {
  return request({
    url: '/marketingcenter/management/shareActivity/list',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取集赞参与信息的列表
 * @param {*} params
 * @returns
 */

export const praiseInfoList = (params) => {
  return request({
    url: '/marketingcenter/management/shareHelpActivity/list',
    method: 'get',
    params,
  });
};

/**集赞活动的明细
 * @param {*} params
 * @returns
 */
export function praiseRecord(params) {
  return request({
    url: '/marketingcenter/management/shareActivity/praise/detailList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**集赞活动的上下架
 * @param {*} params
 * @returns
 */
export function praiseUpperOrLower(params) {
  return request({
    url: '/marketingcenter/management/shareActivity/upperOrLower',
    method: 'post',
    data: params,
  });
}

/**创建集赞活动
 * @param {*} params
 * @returns
 */
export function praiseCreate(params) {
  return request({
    url: '/marketingcenter/management/shareActivity/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑集赞活动
 * @param {*} params
 * @returns
 */
export function praiseEdit(params) {
  return request({
    url: '/marketingcenter/management/shareActivity/edit',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取一个集赞活动的详情
 * @param {*} params
 * @returns
 */
export function praiseDetails(id) {
  return request({
    url: `/marketingcenter/management/shareActivity/detail/${id}`,
    method: 'get',
  });
}

/**删除一个集赞活动
 * @param {*} params
 * @returns
 */
export function praiseDel(id) {
  return request({
    url: `/marketingcenter/management/shareActivity/delete/${id}`,
    method: 'delete',
  });
}

/**获取活动列表
 * @param {*} params
 * @returns
 */
export function activityList(params) {
  return request({
    url: '/marketingcenter/management/marketingActivity/ongoingList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取拼团活动列表
 * @param {*} params
 * @returns
 */
export function togetherList(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/activityList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**删除拼团活动列表
 * @param {*} params
 * @returns
 */
export function togetherDel(id) {
  return request({
    url: `/marketingcenter/management/spellGroupActivity/delete/${id}`,
    method: 'delete',
  });
}

/**拼团活动编辑
 * @param {*} params
 * @returns
 */
export function togetherEdit(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/edit',
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 获取拼团的详情
 */
export const togetherDetails = (id) => {
  return request({
    url: `/marketingcenter/management/spellGroupActivity/info/${id}`,
    method: 'get',
  });
};
/**
 * 复制拼团的详情
 */
export const togetherDetailsCopyInfo = (id) => {
  return request({
    url: `/marketingcenter/management/spellGroupActivity/copyInfo/${id}`,
    method: 'get',
  });
};

/**获取拼团参与记录列表
 * @param {*} params
 * @returns
 */
export function togetherJoinList(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/joinSpellList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**新增拼团活动
 * @param {*} params
 * @returns
 */
export function togetherAdd(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**拼团发起记录列表
 * @param {*} params
 * @returns
 */
export function togetherStartList(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/startSpellList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**拼团制定修改库存
 * @param {*} params
 * @returns
 */

export function updateTogtherStockApi(params) {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/update/stock',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**拼团上下架
 * @param {*} params
 * @returns
 */

export const togetherUpperOrLower = (params) => {
  return request({
    url: '/marketingcenter/management/spellGroupActivity/upperOrLower',
    method: 'get',
    params,
  });
};

/**会员卡列表
 * @param {*} params
 * @returns
 */

export function cardList(params) {
  return request({
    url: '/custuser/management/membershipCard/lists',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**会员卡分页列表
 * @param {*} params
 * @returns
 */

export function cardListPage(params) {
  return request({
    url: '/custuser/management/membershipCard/pages',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**会员卡购买记录
 * @param {*} params
 * @returns
 */

export function cardBuyList(params) {
  return request({
    url: '/custuser/management/MembershipCardOrder/pages',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**新增会员卡
 * @param {*} params
 * @returns
 */
export function cardAdd(params) {
  return request({
    url: '/custuser/management/membershipCard/add',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑会员卡
 * @param {*} params
 * @returns
 */
export function cardEdit(params) {
  return request({
    url: '/custuser/management/membershipCard/edit',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**根据id获取会员卡详情
 * @param {*} params
 * @returns
 */
export const cardDetails = (params) => {
  return request({
    url: '/custuser/management/membershipCard/getMembershipCardById',
    method: 'get',
    params,
  });
};

/**会员卡上下架
 * @param {*} params
 * @returns
 */

export const cardUpperOrLower = (params) => {
  return request({
    url: '/custuser/management/membershipCard/upperOrLower',
    method: 'get',
    params,
  });
};

/**会员权益列表
 * @param {*} params
 * @returns
 */
export function cardEquityList(params) {
  return request({
    url: '/custuser/management/memberBenefits/pages',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑会员权益
 * @param {*} params
 * @returns
 */
export function cardEquityEdit(params) {
  return request({
    url: '/custuser/management/memberBenefits/edit',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**赠送会员卡
 * @param {*} params
 * @returns
 */
export function cardGive(params) {
  return request({
    url: '/custuser/management/MembershipCardOrder/giveMembershipCard',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**根据id获取会员权益
 * @param {*} params
 * @returns
 */
export const cardEquityDetails = (params) => {
  return request({
    url: '/custuser/management/memberBenefits/getMemberBenefitsById',
    method: 'get',
    params,
  });
};

/**疯狂猜猜猜列表
 * @param {*} params
 * @returns
 */
export function guessPageApi(params) {
  return request({
    url: '/marketingcenter/answer/pageList',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**题目管理列表
 * @param {*} params
 * @returns
 */
export function topicPageApi(params) {
  return request({
    url: '/marketingcenter/topic/pageList',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function addAnswerTopicApi(params) {
  return request({
    url: '/marketingcenter/topic/addAnswerTopic',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

export function updateAnswerTopicApi(params) {
  return request({
    url: '/marketingcenter/topic/updateAnswerTopic',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**删除题目
 * @param {*} params
 * @returns
 */
export function deleteTopic(params) {
  return request({
    url: '/marketingcenter/topic/deleteAnswerTopic',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**添加疯狂猜猜猜活动
 * @param {*} params
 * @returns
 */
export function addAnswerActivityApi(params) {
  return request({
    url: '/marketingcenter/answer/addAnswerActivity',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取活动详情
 * @param {*} params
 * @returns
 */
export function getGuessData(params) {
  return request({
    url: '/marketingcenter/answer/detailAnswerActivity',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**编辑疯狂猜猜猜活动
 * @param {*} params
 * @returns
 */
export function editAnswerActivityApi(params) {
  return request({
    url: '/marketingcenter/answer/updateAnswerActivity',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 更改上架或下架猜猜猜活动
 * @param {*} params
 * @returns
 */
export function soldOutGuessData(params) {
  return request({
    url: '/marketingcenter/answer/soldOutAnswerActivity',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 删除猜猜猜活动
 * @param {*} params
 * @returns
 */
export function delGuessData(params) {
  return request({
    url: '/marketingcenter/answer/deleteAnswerActivity',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 查答题记录
 * @param {*} params
 * @returns
 */
export function answerRecord(params) {
  return request({
    url: '/marketingcenter/answer/selectAnswerRecordListByAnswerId',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 砍价活动的列表
 * @param {*} params
 * @returns
 */
export function presseList(params) {
  return request({
    url: '/marketingcenter/management/bargain/list',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 砍价记录列表
 * @param {*} params
 * @returns
 */
export function presseRecordList(params) {
  return request({
    url: '/marketingcenter/management/bargainRecord/listRecord',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 砍价活动详情
 * @param {*} params
 * @returns
 */
export function presseDetails(params) {
  return request({
    url: '/marketingcenter/management/bargain/detail',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 帮砍记录
 * @param {*} params
 * @returns
 */
export function helpPresseDetails(params) {
  return request({
    url: '/marketingcenter/management/helpRecord/list',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/** 砍价记录明细
 * @param {*} params
 * @returns
 */
export function presseRecord(params) {
  return request({
    url: '/marketingcenter/management/bargainRecord/detailRecord',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**砍价活动新增
 * @param {*} params
 * @returns
 */
export function presseAdd(params) {
  return request({
    url: '/marketingcenter/management/bargain/add',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**砍价活动编辑
 * @param {*} params
 * @returns
 */
export function presseEdit(params) {
  return request({
    url: '/marketingcenter/management/bargain/update',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**砍价活动上/下架
 * @param {*} params
 * @returns
 */

export const presseUpperOrLowerApi = (params) => {
  return request({
    url: '/marketingcenter/management/bargain/upperOrLower',
    method: 'get',
    params,
  });
};

/**砍价活动删除
 * @param {*} params
 * @returns
 */

export const presseDel = (params) => {
  return request({
    url: '/marketingcenter/management/bargain/delete',
    method: 'get',
    params,
  });
};

// export const addStock = (params) => {
//   return request({
//     url: '/marketingcenter/management/bargain/modifyInventory',
//     method: 'get',
//     params,
//   });
// };

export function addStock(params) {
  return request({
    url: '/marketingcenter/management/bargain/modifyInventory',
    method: 'get',
    params,
  });
}

/**定金预售活动的列表
 * @param {*} params
 * @returns
 */
export function preSaleActivityList(params) {
  return request({
    url: '/marketingcenter/management/preSaleActivity/pageList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**定金预售活动记录的列表
 * @param {*} params
 * @returns
 */
export function preSaleActivityRecord(params) {
  return request({
    url: '/marketingcenter/management/preSaleActivity/record/pageList',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**新增/编辑定金预售活动
 * @param {*} params
 * @returns
 */
export function depositEdit(params) {
  return request({
    url: '/marketingcenter/management/preSaleActivity/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**上下架定金膨胀活动
 * @param {*} params
 * @returns
 */
export function depositUpperOrLower(params) {
  return request({
    url: '/marketingcenter/management/preSaleActivity/upperOrLower',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**获取一个预售定金活动的详情
 * @param {*} params
 * @returns
 */
export function depositDetails(id) {
  return request({
    url: `/marketingcenter/management/preSaleActivity/info/${id}`,
    method: 'get',
  });
}

/**删除一个预售活动
 * @param {*} params
 * @returns
 */
export function depositDelete(id) {
  return request({
    url: `/marketingcenter/management/preSaleActivity/delete/${id}`,
    method: 'delete',
  });
}
