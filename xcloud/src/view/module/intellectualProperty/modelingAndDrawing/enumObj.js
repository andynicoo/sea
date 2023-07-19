export const progressBarObj = {
  MODELING: 'NODE0079',
  AUDIT_MODEL: 'NODE0080',
  MODEL_CONFIRM: 'NODE0081',
  DRAWING: 'NODE0082',
  AUDIT_DRAW: 'NODE0083',
  DRAW_CONFIRM: 'NODE0084',
  COMPLETE: 'NODE0085'
}

export const progressBarList = [
  {label: '建模中', value: progressBarObj.MODELING},
  {label: '审核建模', value: progressBarObj.AUDIT_MODEL},
  {label: '客户确认建模', value: progressBarObj.MODEL_CONFIRM},
  {label: '绘图中', value: progressBarObj.DRAWING},
  {label: '审核绘图', value: progressBarObj.AUDIT_DRAW},
  {label: '客户确认绘图', value: progressBarObj.DRAW_CONFIRM},
  {label: '已完成', value: progressBarObj.COMPLETE},
]