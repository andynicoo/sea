export const statusObj = {
  PENDING: '1',
  PROCESSING: '4',
  COMPLETE: '6',
  NO_PROCESSING_REQUIRED: '5',
}
export const statusList = [
  {label: '待处理', value: statusObj.PENDING},
  {label: '处理中', value: statusObj.PROCESSING},
  {label: '处理完成', value: statusObj.COMPLETE},
  {label: '无需处理', value: statusObj.NO_PROCESSING_REQUIRED},
]