import request from '@/libs/request'
/** 
 * 手动文件上传
 */
export const upload2 = (data) => {
  return request({
    url: '/file/oss/upload2',
    data,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}