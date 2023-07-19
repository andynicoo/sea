const SIGNEM = {
  ONLINE: 'ONLINE', //线上签订
  OFFLINE: 'OFFLINE', //线下签订
  SPECIAL: 'SPECIAL', //特批不签
};

const SIGNEM_DESC = {
  ONLINE: '线上签订', //线上签订
  OFFLINE: '线下签订', //线下签订
  SPECIAL: '特批不签', //特批不签
};

const SUBJECTEM = {
  PERSON: 'PERSON', //个人
  ENTERPRISE: 'ENTERPRISE', //企业
};

const CONTRACTSTATUS = {
  SIGNING: 'SIGNING', // '签署中，
  SIGNED: 'SIGNED', //已签署，
  SPECIAL_NO_SIGN: 'SPECIAL_NO_SIGN', //特批不签，
  OFFLINE_SIGNED: 'OFFLINE_SIGNED', //线下签订，
  REVOKED: 'REVOKED', //已撤销，
  INVALIDING: 'INVALIDING', //作废中，
  INVALID: 'INVALID', //已作废
};

const CONTRACTSTATUSTEXTEM = {
  SIGNING: '签署中', // '签署中，
  SIGNED: '已签署', //已签署，
  SPECIAL_NO_SIGN: '特批不签', //特批不签，
  OFFLINE_SIGNED: '线下签订', //线下签订，
  REVOKED: '已撤销', //已撤销，
  INVALIDING: '作废中', //作废中，
  INVALID: '已作废', //已作废
  SENDING: '发送中', //此状态只会出现几秒
  USER_AGREEMENT: '用户协议',
};
export const CONTRACTEM = {
  SIGNEM,
  SIGNEM_DESC,
  SUBJECTEM,
  CONTRACTSTATUS,
  CONTRACTSTATUSTEXTEM,
};
