export const progressBarObj = {
  WAIT_REVIEW: '0',
  FILING: '1',
  FILING_COMPLETE: '2',
  FILING_REJECT: '3',
}
export const progressBarList = [
  {label: '待审核', value: progressBarObj.WAIT_REVIEW},
  {label: '备案中', value: progressBarObj.FILING},
  {label: '备案完成', value: progressBarObj.FILING_COMPLETE},
  {label: '备案驳回', value: progressBarObj.FILING_REJECT},
]