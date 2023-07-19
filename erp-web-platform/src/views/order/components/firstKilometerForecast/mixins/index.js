import Store from '@/api/store'
import { mapState } from 'vuex'
import firstMileCarrierList from '@/util/firstMileCarrierList'
export default {
  data() {
    return {
      storeList: [], //店铺列表
      storeListBatchNum: [], //批次号用的店铺列表
      logisticsListSource: [], //物流商源数据
      logisticsList: [], //物流商下拉数据
      countryMap: {
        7: 'CN',
        223: 'SG',
        70: 'PH',
        131: 'MY',
        236: 'ID',
        199: 'TH',
        240: 'VN',
        36: 'BR',
        278: 'TW',
        153: 'MX'
      },
      commonExpress: [
        //常用快递
        '百世快递',
        '中通快递',
        '申通快递',
        '圆通速递',
        '韵达快递',
        '天天快递',
        '顺丰速运',
        '极兔速递',
        '邮政快递包裹'
      ]
    }
  },
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize
    })
  },
  async created() {
    //获取店铺列表
    this.getStoreList()
    //物流商列表数据处理
    this.$data.logisticsListSource = this.handleCarrier(firstMileCarrierList)
    this.$data.logisticsList = this.$data.logisticsListSource.slice(0, 100)
  },
  methods: {
    // 获取店铺列表
    getStoreList() {
      Store.getAllStore().then(({ data }) => {
        this.storeList =
          data &&
          data.map((item) => ({
            label: item.storeAlias ? item.storeAlias : item.storeName,
            value: item.storeId
          }))
        this.storeListBatchNum =
          data &&
          data.map((item) => ({
            name: item.storeAlias ? item.storeAlias : item.storeName,
            value: item.storeId,
            code: item.countryCode
          }))
      })
    },
    //物流商列表数据处理
    handleCarrier(firstMileCarrierList) {
      let logisticsListSource = []
      firstMileCarrierList.list.forEach((ele) => {
        if (this.$data.commonExpress.includes(ele.first_mile_carrier_name)) {
          logisticsListSource.unshift({
            label: ele.first_mile_carrier_name,
            value: ele.first_mile_carrier_id
          })
        } else {
          logisticsListSource.push({
            label: ele.first_mile_carrier_name,
            value: ele.first_mile_carrier_id
          })
        }
      })
      return logisticsListSource
    },
    //下拉框搜索事件
    selectSearch(value, item) {
      // 函数节流，防止数据频繁更新，每300毫秒才搜索一次
      let timer = null
      if (!timer) {
        timer = setTimeout(() => {
          const datas = []
          // 对firstMileCarrierList.list进行遍历，将符合搜索条件的数据放入datas中
          this.$data.logisticsListSource.forEach((ele) => {
            if (ele.label.toLowerCase().indexOf(value.toLowerCase()) > -1) {
              datas.push(ele)
            }
          })
          // 然后只显示符合搜索条件的所有数据中的前100条
          this.$data[
            item ? item.itemProp.itemDataName : 'logisticsList'
          ] = datas.slice(0, 100)
          timer = null
        }, 300)
      }
    },
    //失去焦点还原数据
    selectBlur(value, item) {
      this.$nextTick(() => {
        this.$data[
          item ? item.itemProp.itemDataName : 'logisticsList'
        ] = this.$data.logisticsListSource.slice(0, 100)
      })
    }
  }
}
