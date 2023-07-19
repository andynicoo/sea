import * as api from '@/api/newApi/workOrder/commonOperator';
import Vue from 'vue';

const enumObj = {
  /**审核 */
  audit: 'Audit',
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
  /**保存备注 */
  saveRemark: 'SaveRemark',
  /**查看备注 */
  checkRemark: 'CheckRemark',
  /**查看驳回详情 */
  checkReject: 'CheckReject',
  /**修改服务商 */
  changeSupplier: 'ChangeSupplier',
  /**修改处理人 */
  changeHandler: 'ChangeHandler',
  /**发送提醒 */
  remind: 'Remind',
  /**已审核-上传授权书模板 */
  uploadAuthTemplate: 'UploadAuthTemplate',
  /**已审核-替换授权书模板 */
  replaceAuthTemplate: 'ReplaceAuthTemplate',
  /**待授权-上传授权书 */
  uploadAuth: 'UploadAuth',
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

export const downloadUrl = (workId) => Vue.prototype.baseUrl + '/workorder/management/vat/download/new/' + workId;
