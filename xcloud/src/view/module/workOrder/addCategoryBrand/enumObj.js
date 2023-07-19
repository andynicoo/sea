export const progressBarObj = {
  WAIT_UPLOAD: 'NODE0060',
  WAIT_REVIEW: 'NODE0061',
  REVIEWED: 'NODE0062',
  WAIT_AUTHORIZE: 'NODE0063',
  AUTHORIZE_WAIT_CONFIRM: 'NODE0064',
  REGISTERING: 'NODE0065',
  REGISTER_COMPLETE: 'NODE0066',
}
export const progressBarList = [
  {label: '待上传资料', value: progressBarObj.WAIT_UPLOAD},
  {label: '待审核', value: progressBarObj.WAIT_REVIEW},
  {label: '已审核', value: progressBarObj.REVIEWED},
  {label: '待授权', value: progressBarObj.WAIT_AUTHORIZE},
  {label: '授权待确认', value: progressBarObj.AUTHORIZE_WAIT_CONFIRM},
  {label: '注册中', value: progressBarObj.REGISTERING},
  {label: '注册完成', value: progressBarObj.REGISTER_COMPLETE},
]