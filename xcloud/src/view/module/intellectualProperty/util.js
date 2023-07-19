export function initFileNameFunc(fileName) {
  let newStr = fileName.substring(fileName.lastIndexOf('/') + 1);
  return newStr;
}

/**文件类型枚举 */
export const workerFileType = (type) => {
  const data = {
    1: '受理回执',
    2: '受理书',
    3: '审查意见（OA）',
    4: '审查意见的答复函（OA）',
    7: '暂停审查',
    8: '商标证书',
    9: '公告期延长通知',
    10: '放弃审查意见',
    11: '对方律师通知函',
    12: '收到异议通知函',
  };
  return data[type];
};
