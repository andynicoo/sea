import { cloneDeep } from 'lodash'
import moment from 'moment'
export default {
  data() {
    return {
      searchParams: {
        platform: 1,
        site: [],
        store: [],
        storeIds: [],
        createDate: [],
        createDateType: ''
      },
      platformList: [
        {
          value: 1,
          label: 'Shopee',
          check: false
        }
        // {
        //   value: 2,
        //   label: 'lazada',
        //   check: false
        // }
      ],
      submitIng: false
    }
  },
  watch: {
    'searchParams.store': {
      handler(val) {
        let storeIds = cloneDeep(val)
        storeIds.includes('all') ? storeIds.splice(0, 1) : ''
        this.$data.searchParams.storeIds = storeIds
        // return val
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.siteStoreList = cloneDeep(this.storeListSize)
    //站点数据
    this.siteStoreList.unshift({
      value: 'all',
      label: '全部',
      check: false
    })
    //站点全选默认选中第一个店铺
    this.siteStoreList.forEach((ele, index) => {
      this.searchParams.site.push(ele.value)
      this.searchParams.store = []
      this.$set(ele, 'check', true)
      if (ele.children) {
        ele.children.forEach((store, index2) => {
          let check = index == 1 && index2 == 0 ? true : false
          if (check) this.searchParams.store.push(store.storeId)
          this.$data.storeList.push({
            value: store.storeId,
            label: store.storeAlias || store.storeName,
            check
          })
        })
      }
    })
    this.$data.storeList.unshift({ value: 'all', label: '全部', check: false })

    this.searchParams.createDateType = 3
    // autoTimeFocus 控制自动填充时间
    if (this.$data.autoTimeFocus !== 0) {
      this.searchParams.createDate = [
        moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
    }
  },
  methods: {
    //改变站点查询条件
    siteChange() {
      this.storeList = []
      this.searchParams.store = []
      let first = 0
      this.siteStoreList.forEach((ele, index) => {
        if (ele.check) {
          if (ele.children) {
            first += 1
            ele.children.forEach((store, index2) => {
              let check = true
              if (check) this.searchParams.store.push(store.storeId)
              this.$data.storeList.push({
                value: store.storeId,
                label: store.storeAlias || store.storeName,
                check
              })
            })
          }
        }
      })
      this.$data.storeList.unshift({
        value: 'all',
        label: '全部',
        check: true
      })
    }
  }
}
