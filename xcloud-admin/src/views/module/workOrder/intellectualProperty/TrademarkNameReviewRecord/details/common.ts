// 核名状态
export const recordStatusMap: any = {
  WAIT_CHECK: '待核名',
  WAIT_RECHECK: '待复核',
  WAIT_CONFIRM: '待确认',
  RECHECK_WAIT_CONFIRM: '已复核待确认',
  CONFIRM_WAIT_AUDIT: '已确认待终审',
  AUDIT_WAIT_CONFIRM: '已终审待确认',
  CONFIRM: '已确认',
  COMPLETE: '已完成',
};

// 核名创建类型
export const createTypeMap: any = {
  CUSTOMER: '客户创建',
  SALE: '销售创建',
  WORK: '工单终核创建',
  BATCH: '批量创建',
};
