import * as api from '@/api/commonOperator';
import Vue from 'vue';

const enumObj = {
  /**详情 */
  detail: 'Detail',
  /**下一节点 */
  next: 'Next',
  /**驳回至上一节点 */
  reject: 'Reject',
  /**保存 */
  save: 'Save',
  /**提交 */
  commit: 'Commit',
  /**添加备注 */
  saveRemark: 'SaveRemark',
  /** erp续费 保存 */
  EPRRenewSave: 'EPRRenewSave',
  /** erp续费 提交 */
  EPRRenewCommit: 'EPRRenewCommit'
};
const prefix = 'serviceWorkOrder';
export async function workOrderCommonOperator(operator, params) {
  return new Promise(async (resolve) => {
    let method = prefix + enumObj[operator];
    if (!api[method]) {
      throw '无此方法';
    }
    let res = await api[method](params);
    resolve(res);
  });
}
