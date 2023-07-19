export default {
  data() {
    return {
      //不同平台api接口配置
      config: {
        Shopee: {
          //获取授权地址
          getAuthApi: {
            v1: '/store/store/shopee/auth/local/url',
            v2: '/store/store/shopee/auth/v2/url'
          },
          //授权指南
          guideUrl: '/information/info?type=1&listId=3&newsId=2',
          //获取店铺列表/store/info/page
          getStoreListApi: '/store/store/info/page',
          //只有全球商品店铺shopee有
          getStoreListApiCnsc: '/store/store/info/cnsc/page',
          //同步店铺列表
          syncApi: '/store/store/info/syncStore',
          //删除店铺
          delStoreApi: '/store/store/info/delete',
          //修改店铺名称
          editStoreApi: '/store/store/info/edit'
        },
        Lazada: {
          getAuthApi: {
            v1: '/store/lazada/auth/url'
          },
          guideUrl: '/information/info?type=1&listId=3&newsId=31',
          getStoreListApi: '/store/lazada/info/page',
          syncApi: '/store/lazada/info/syncStore',
          delStoreApi: '/store/lazada/info/delete',
          editStoreApi: '/store/lazada/info/edit'
        }
      }
    }
  },
  methods: {}
}
