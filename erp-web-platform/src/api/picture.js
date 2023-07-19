import axios, { post } from '@/util/request'

const Picture = {
  /**上传图片 */
  uploadImage: (data) =>
    axios.post('/picture/picture/uploadImage', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  /**分页获取图片信息 */
  pagePictureInfo: (data) => post('/picture/picture/pagePictureInfo', data),
  /**图片删除 */
  delePictureInfo: (pictureIds) =>
    post('/picture/picture/delePictureInfo', { pictureIds }),
  /**图片类型修改 */
  updatePictureInfoType: (data) =>
    post('/picture/picture/updatePictureInfoType', data),
  /**增加图片类型 */
  addPictureType: (data) => post('/picture/picture/addPictureType', data),
  /**删除图片类型 */
  delePictureType: (data) => post('/picture/picture/delePictureType', data),
  /**修改图片类型 */
  updatePictureType: (data) => post('/picture/picture/updatePictureType', data),
  /**分页获取图片类型 */
  pagePictureType: (data) => post('/picture/picture/pagePictureType', data),
  /**获取图片总大小(字节) */
  getUserUsePictureSize: () => post('/picture/picture/getUserUsePictureSize'),
  /**查询图片分类数量 {pictureTypeIds: []} */
  getPictureTypeImgNum: (data) =>
    post('/picture/picture/getPictureTypeImgNum', data),
  /**查询图片空间数量 */
  sumPictureInfo: (data) => post('/picture/picture/sumPictureInfo', data)
}

export default Picture
