export const progressBarObj = {
  WAIT_TRANSLATE: 'NODE105-001',
  WAIT_PAY: 'NODE105-002',
  WAIT_SUBMIT: 'NODE105-003',
  WAIT_UPLOAD: 'NODE105-004',
  COMPLETE: 'NODE105-005',
}

export const progressBarList = [
  {label: '待翻译授权书', value: progressBarObj.WAIT_TRANSLATE},
  {label: '待客户付款', value: progressBarObj.WAIT_PAY},
  {label: '待递交授权书', value: progressBarObj.WAIT_SUBMIT},
  {label: '待上传授权回执', value: progressBarObj.WAIT_UPLOAD},
  {label: '完成授权', value: progressBarObj.COMPLETE},
]