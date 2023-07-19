export const progressBarObj = {
  WAIT_UPLOAD: 'NODE0028',
  WAIT_REVIEW: 'NODE0029',
  WAIT_AUTHORIZE: 'NODE0030',
  PROCESSING: 'NODE0031',
  COMPLETE: 'NODE0032',
}
export const progressBarList = [
  {label: '待上传资料', value: progressBarObj.WAIT_UPLOAD},
  {label: '待审核', value: progressBarObj.WAIT_REVIEW},
  {label: '待授权', value: progressBarObj.WAIT_AUTHORIZE},
  {label: '海牙认证中', value: progressBarObj.PROCESSING},
  {label: '认证完成', value: progressBarObj.COMPLETE},
]