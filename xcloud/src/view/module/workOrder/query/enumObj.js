export const progressBarObj = {
  PENDING: 1,
  PROCESSING: 2,
  COMPLETE: 3,
  CANCEL: 4,
  WAIT_UPLOAD: 5,
  WAIT_REVIEW: 6,
}

export const progressBarList = [
  {label: '待处理', value: progressBarObj.PENDING},
  {label: '待上传资料', value: progressBarObj.WAIT_UPLOAD},
  {label: '待审核', value: progressBarObj.WAIT_REVIEW},
  {label: '处理中', value: progressBarObj.PROCESSING},
  {label: '已完成', value: progressBarObj.COMPLETE},
  {label: '已取消', value: progressBarObj.CANCEL}
]

export const progressTaxInspectList = [
  {label: '待上传资料', value: 'NODE1156'},
  {label: '待处理', value: 'NODE1157'},
  {label: '处理中', value: 'NODE1158'},
  {label: '已完成', value: 'NODE1159'},
  {label: '待上传资料', value: 'NODE0067'},
  {label: '待审核', value: 'NODE0068'},
  {label: '退税中', value: 'NODE0069'},
  {label: '退税完成', value: 'NODE0070'}
]


export const progressLogOutBarList = [
  {label: '待上传资料', value: 'NODE0052'},
  {label: '待审核', value: 'NODE0053'},
  {label: '注销中', value: 'NODE0054'},
  {label: '已完成', value: 'NODE0055'},
  {label: '注销失败', value: 'NODE0056'},
]

export const progressEPRBarObj = {
  WAIT_UPLOAD: 'NODE0060',
  WAIT_REVIEW: 'NODE0061',
  REVIEWED: 'NODE0062',
  WAIT_AUTHORIZE: 'NODE0063',
  AUTHORIZE_WAIT_CONFIRM: 'NODE0064',
  REGISTERING: 'NODE0065',
  REGISTER_COMPLETE: 'NODE0066',
}
export const progressEPRBarList = [
  {label: '待上传资料', value: progressEPRBarObj.WAIT_UPLOAD},
  {label: '待审核', value: progressEPRBarObj.WAIT_REVIEW},
  {label: '已审核', value: progressEPRBarObj.REVIEWED},
  {label: '待授权', value: progressEPRBarObj.WAIT_AUTHORIZE},
  {label: '授权待确认', value: progressEPRBarObj.AUTHORIZE_WAIT_CONFIRM},
  {label: '注册中', value: progressEPRBarObj.REGISTERING},
  {label: '注册完成', value: progressEPRBarObj.REGISTER_COMPLETE},
]


export const progressTaxBarList = [
  {label: '待上传资料', value: 'NODE0015'},
  {label: '待审核', value: 'NODE0016'},
  {label: '待授权', value: 'NODE0017'},
  {label: '待提交转代理', value: 'NODE0018'},
  {label: '转代理中', value: 'NODE0019'},
  {label: '转代理完成', value: 'NODE0020'},
  {label: '待上传资料', value: 'NODE001'},
  {label: '待审核', value: 'NODE002'},
  {label: '待授权', value: 'NODE003'},
  {label: '待提交注册', value: 'NODE005'},
  {label: '注册中', value: 'NODE006'},
  {label: '注册完成', value: 'NODE007'}
]

export const progressDecalreBarList = [
  {label: '待提交申报', value: 10},
  {label: '待审核申报', value: 11},
  {label: '申报中', value: 12},
  {label: '待缴纳税金', value: 13},
  {label: '待审核税金', value: 14},
  {label: '申报对接完成', value: 15},
  {label: '申报完成', value: 16},
  {label: '转出代理', value: 17},
  {label: '待提交申报(驳回)', value: 18},
  {label: '待缴纳税金(驳回)', value: 19},
  {label: '作废', value: 9}
]