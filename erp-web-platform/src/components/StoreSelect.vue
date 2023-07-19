<template>
  <a-form-item :label="$t('searchForm.store')">
    <a-cascader
      v-decorator="['storeId']"
      :options="storeOptions"
      :show-search="{ filter }"
      @change="onChange"
      :placeholder="$t('edit.placeChoose')"
    />
  </a-form-item>
</template>

<script>
import { mapState } from 'vuex'
import Cnsc from '@/api/cnsc'
import Store from '@/api/store'
export default {
  data() {
    return {
      curSite: null,
      storeOptions: [],
      cnscStoreTemp: [{ label: 'CNSC', value: 'CNSC', children: [] }]
    }
  },
  computed: {
    ...mapState({
      storeListSize: (state) => state.auth.storeListSize,
      basicStoreListSize: (state) => state.auth.basicStoreListSize,
      lazadaStoreListSize: (state) => state.auth.lazadaStoreListSize
    })
  },
  props: {
    value: [String, Number]
  },
  watch: {
    value(val) {
      this.curSite = val
    }
  },
  async mounted() {
    // 所属店铺，之前的CNSC-公司名，二级选择，调整成CNSC-公司名-店铺名三级选择
    let params = {
      size: 1000,
      current: 1,
      platform: 1,
      cnsc: 0
    }
    let { data } = await Store.getStoreListM(
      '/store/store/info/cnsc/page',
      params
    )
    let temp = []
    data.records.map((item, index) => {
      temp.push({
        label: item.merchantName,
        value: item.merchantId,
        children: []
      })
      let itemDTOList = item.storeInfoDTOList
      // 在线商品页面-所属商铺，才有三级
      if (
        itemDTOList &&
        itemDTOList.length &&
        this.$route.path === '/goods/on-sale'
      ) {
        itemDTOList.map((ele, it) => {
          temp[index].children.push({
            label: ele.storeName ? ele.storeName : '-',
            value: ele.storeId
          })
        })
      }
    })
    this.cnscStoreTemp[0].children = temp

    // 只有在线商品时，才要显示cnsc的店铺，其他情况只显示普通店铺
    if (this.$route.path.includes('lazada')) {
      this.storeOptions = this.lazadaStoreListSize
    } else {
      this.storeOptions = ['/goods/on-sale', '/order/page-packing'].includes(
        this.$route.path
      )
        ? this.storeListSize
        : this.basicStoreListSize
    }
    // 判断是否是商品发布模块、在线商品页面
    let isGoodsPage = [
      '/goods/to-be-edit',
      '/goods/release',
      '/goods/success',
      '/goods/faild',
      '/goods/task',
      '/goods/cancel',
      '/goods/on-sale'
    ]
    if (isGoodsPage.includes(this.$route.path)) {
      this.storeOptions = this.cnscStoreTemp.concat(this.storeOptions)
    }
  },
  methods: {
    onChange(value, selectedOptions) {
      console.log(value, selectedOptions)
      this.$data.curSite = value[0]
      this.$emit('input', value[1])
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
