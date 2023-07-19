import request from "@/libs/request";
import { getToken } from "@/libs/util";
import config from "@/config";

/**
 * 系统公用的api接口
 */

/**
 * 上传文件-阿里云OSS服务接口
 * @param {FormData} fileData 文件上传数据formData
 * @param {Function} callback 上传进度的回调函数
 */
export function uploadFile(fileData, onUploadProgress) {
  return request({
    url: "/file/oss/upload",
    // url: "https://pre-api.itaxs.com/file/oss/upload",
    method: "post",
    data: fileData,
    onUploadProgress: event => {
      onUploadProgress && onUploadProgress(event);
    }
  });
}

// /**
//  * 删除文件-阿里云OSS服务接口
//  * @param {*} params 参数，主要传name字段
//  */
// export function deleteFile(params) {
//   return request({
//     url: "/file/oss/delete",
//     method: "post",
//     data: qs.stringify(params)
//   });
// }
/**
 * 获取企业选项
 *  @param {*} params 参数，
 */
export function getFirm(params) {
  return request({
    url: "/custuser/management/enterprise/getSelect",
    method: "post",
    data: params
  });
}
