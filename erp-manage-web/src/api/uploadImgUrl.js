import http from '@/utils/request'
let uploadImgUrl = '/mg/mg/basic/config/platform/uploadImage'
/* 上传图片 */
function uploadImg(data) {
  return http({
    url: uploadImgUrl,
    method: 'post',
    data
  })
}

export {
  uploadImgUrl,
  uploadImg
}
