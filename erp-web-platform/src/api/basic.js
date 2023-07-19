import { post, get } from '@/util/request'

const Basic = {
  // getSMSCode: (p) => get('/basic/config/platform/smsCode', p), // 获取短信验证码
  getSMSCode: (p) => post('/user/code/modifyPwdSms', p), // 获取短信验证码

  getAuthMenuList: (p) => post('/member/menu/list', p), //获取菜单

  handleUploadImages: (p) => post('/basic/config/platform/uploadImage', p), //上传图片

  batchTranslate: (p) => post('/goods/shopee/product/translate/batch', p), //批量翻译

  getHomeData: (p) => get('/basic/config/platform/getIndex', p), //获取首页的数据

  handleTranslateImages: (p) => post('/basic/translate/images', p), // 图片翻译

  handleCacheImages: (p) => post('/basic/translate/cacheImages', p), // 图片翻译,每日图片翻译量超过700调用这个

  changePassWord: (p) => post('/user/member/info/editPassWord', p), // 修改密码

  changeAvatar: (p) => post('/user/member/info/edit/head/image', p), // 修改头像

  getIllegalWord: (p) => post('/content-violation-lexicon/getPage', p), // 违规词库列表

  addIllegalWord: (p) => post('/content-violation-lexicon/add', p), // 新增违规词库

  delIllegalWord: (p) => post('/content-violation-lexicon/del', p), // 删除违规词库

  editIllegalWord: (p) => post('/content-violation-lexicon/edit', p), // 编辑违规词库

  allIllegalWord: () => post('/content-violation-lexicon/list-all'), // 全部违规词库

  getSystemConfig: () => get('basic/sys-config/all?sysCode=erp'), //获取平台配置

  getNewsTypeList: (p) => get('/erp/content-classify/list', p), // 获取资讯分类列表

  getNewsList: (p) => get('/erp/content-info/page', p), // 获得资讯列表

  getSingleNews: (id) => get('/erp/content-info/get/' + id), // 根据参数获取单个新闻

  getArea: () =>
    get('https://emalacca-erp.oss-cn-hangzhou.aliyuncs.com/static/area.json'), // 省市区json

  getArea2: () =>
    get('https://emalacca-erp.oss-cn-hangzhou.aliyuncs.com/static/area2.json'), // 省市区街道json

  getCurrencyRate: (currency) => get('/basic/rate/' + currency), // 获取对应currency汇率

  getWmsUserInfo: (p) => post('/wms/wms-dock/erp-getMenuList', p), //erp登录信息转wms系统登录信息

  calcPriceTemplate: (p) => post('/product-price-template/calc', p), // 定价工具(计算器)

  getGlobalArea: () => get('../util/globalAddressJson.json'), // 省市区json

  getAuthImgSign: () => get('/store/auth/token/info/image/sign'), // 获取用户密钥(用于图片编辑，传到智绘泰山)

  signOut: () => get('/user/member/account/signOut'),

  getNotice: () => get('/order/shopee/notice'),

  getCouponNotice: () => get('/user/memberCoupon/notice') /**获取优惠券通知 */,

  getMessageList: (p) => get('/message/notice/receiveList', p), //获取消息列表

  addMessageRead: (p) => post('/message/notice/recordNoticePush', p), // 更新已读

  //   不一样，queryNoticeWindows接口，只能查询最新的消息，并且会根据频率过滤消息是否应该返回。
  // /notice/query 接口，只是单纯的根据id去查寻消息的接口，没有做别的处理
  getNoticeDataDetail: (p) => get('/message/notice/queryNoticeWindows', p), //获取消息详情

  getNoticeDataDetailById: (p) => get('/message/notice/query', p) //获取消息详情
}

export default Basic
