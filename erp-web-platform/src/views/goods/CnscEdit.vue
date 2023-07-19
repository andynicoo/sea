// 全球商品编辑
<template>
  <a-spin :spinning="productLoading">
    <div class="goods-edit-container me-pa-2">
      <div class="base goods-edit-left me-pb-4">
        <div>
          <!-- <Breadcrumb :breadList="breadList"></Breadcrumb> -->
          <a-breadcrumb class="me-ib">
            <a-breadcrumb-item>{{ $t('edit.index') }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ $t('edit.storeList') }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{ $t('copy.goodsedit') }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <!-- <span>{{ $t('copy.curposition') }}</span> -->
        <!-- 
        <h1 class="me-title me-mt-4 me-mb-4">{{ $t('copy.goodsedit') }}</h1> -->
        <a-tabs
          type="card"
          v-model="prodTabs"
          :tabBarStyle="{ margin: '0', paddingTop: '10px', borderBottom: '0' }"
        >
          <a-tab-pane
            v-for="item in prodSiteItems"
            :key="item.productId"
            :tab="item.region"
          >
            <CnscEditTabs
              :productData="item.product"
              :tabsKey="item.productId"
              :key="item.productId"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-spin>
</template>

<script>
import CnscEditTabs from '@/views/goods/components/cnscEdit/CnscEditTabs'
// import Breadcrumb from '@/components/Breadcrumb'
import Basic from '@/api/basic'
import Cnsc from '@/api/cnsc'
import store from '@/store'
export default {
  components: {
    CnscEditTabs
    // Breadcrumb
  },
  data() {
    return {
      productLoading: false /**商品数据加载状态 */,
      storeType: 'cnsc',
      prodTabs: 99999,
      prodSiteItems: [],
      tabsKey: Math.random(),
      breadList: [
        {
          title: this.$t('edit.index'),
          path: this.$route.query.sourcePath
        },
        {
          title: this.$t('edit.storeList'),
          path: this.$route.query.sourcePath
        },
        {
          title: this.$t('copy.goodsedit'),
          path: ''
        }
      ],
      timer: null
    }
  },
  mounted() {
    const { id, productId } = this.$route.query
    this.initData(productId ? productId : id)
    Cnsc.getMerchantPublishable().then(({ data }) => {
      this.$store.commit('setMerchantList', data)
    })
    Basic.allIllegalWord().then(({ data }) => {
      this.$store.commit('setIllegalWord', data)
    })
  },
  methods: {
    /**初始化数据*/
    // id :  获取商品详情的id
    // productId： tabs切换
    async initData(goodsId) {
      const { productId, merchantId, id } = this.$route.query
      this.$data.productLoading = true
      const res = await Cnsc.getCnscProductDetail(goodsId)
      let dataSource = res.data
      let arr = [{ productId: 99999, region: '源数据' }]
      // 从发布成功和在线商品的编辑跳过来
      if (productId && !id) {
        let sourceId = dataSource.sourceId ? dataSource.sourceId : dataSource.id
        const path = `/goods/cnsc-edit?id=${sourceId}&productId=${productId}&merchantId=${merchantId}`
        this.$router.push({ path }).then(() => {
          store.commit('setVars', { hideLeftMenu: true })
        })
        this.initData(sourceId)
        return
      }
      if (dataSource.publishShops) {
        dataSource.publishShops.map((item) => {
          if (item.success === 'success' && item.productId) {
            arr.push(item)
          }
        })
      }
      arr.map((item) => {
        if (productId && item.productId == productId) {
          item['product'] = dataSource
          this.prodTabs = item.productId
        } else if (!productId && item.productId == 99999) {
          item['product'] = dataSource
          this.prodTabs = item.productId
        }
      })
      this.$data.productLoading = false
      this.prodSiteItems = arr
    }
  },
  beforeRouteEnter(to, rom, next) {
    store.commit('setVars', { hideLeftMenu: true })
    next()
  },
  beforeRouteLeave(to, from, next) {
    store.commit('setVars', { hideLeftMenu: false })
    next()
  }
}
</script>

<style lang="scss" scoped>
.me-title {
  font-weight: 600;
  color: #262424;
  line-height: 28px;
  font-size: 20px;
}

.me-sub-title {
  height: 40px;
  background: #f6f6f6;
  border-radius: 4px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #262424;
  padding-left: 16px;
  border: none;
}
.goods-edit-container {
  display: flex;
  .goods-edit-left {
    flex: 0 0 1140px;
  }
}
</style>
