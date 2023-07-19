export const progressBarObj = {
  WAIT_TRANSLATE: 'NODE104-001',
  WAIT_PAY: 'NODE104-002',
  WAIT_UPLOAD: 'NODE104-003',
  PLATFORM_AUDIT: 'NODE104-004',
  LAWYER_AUDIT: 'NODE104-005',
  REPLIED: 'NODE104-006',
  CANCELLED: 'NODE104-007'
}

export const progressBarList = [
  {label: '待翻译OA', value: progressBarObj.WAIT_TRANSLATE},
  {label: '待客户付款', value: progressBarObj.WAIT_PAY},
  {label: '待上传资料', value: progressBarObj.WAIT_UPLOAD},
  {label: '平台审核', value: progressBarObj.PLATFORM_AUDIT},
  {label: '律师审核', value: progressBarObj.LAWYER_AUDIT},
  {label: '已答复', value: progressBarObj.REPLIED},
  {label: '已取消', value: progressBarObj.CANCELLED},
]