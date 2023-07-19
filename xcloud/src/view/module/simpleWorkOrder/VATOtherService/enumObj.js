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