import Package from '@/api/package'

let anthorizationMixin = {
  data() {
    return {
      authorVisible: false,
      //服务商列表
      authorizationList: [],
      //服务商选择
      serviceProviderList: []
    }
  },
  mounted() {},

  methods: {
    /**
     * 获取服务商列表
     */
    getseaSystemList() {
      let that = this
      Package.getseaSystemList().then((res) => {
        that.authorizationList = res.data
        that.serviceProviderList = this.authorizationList.map((item, index) => {
          return {
            name: item.serviceProviderName,
            value: index
          }
        })
        this.authorVisible = true
      })
    },
    /**
     * 打开
     */
    authorCancel() {
      this.authorVisible = false
    },
    /**
     * 关闭
     */
    authorShow() {
      this.getseaSystemList()
    }
  }
}

export { anthorizationMixin }
