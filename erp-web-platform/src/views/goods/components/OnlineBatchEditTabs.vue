<template>
  <a-tabs
    class="custom-tabs"
    tab-position="left"
    :default-active-key="1"
    :activeKey="current"
    @change="tabsChange"
  >
    <a-tab-pane :key="1" :tab="$t('batchEditOption.title')">
      <NameEdit
        v-if="current == 1"
        ref="nameEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <a-tab-pane :key="2" :tab="$t('batchEditOption.desc')">
      <DescEdit
        v-if="current == 2"
        ref="descEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <a-tab-pane :key="3" :tab="$t('batchEditOption.masterCode')">
      <ProductCode
        v-if="current == 3"
        ref="productCode"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <a-tab-pane :key="4" :tab="$t('batchEditOption.priceEdit')">
      <PriceEdit
        v-if="current == 4"
        ref="priceEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <a-tab-pane :key="5" :tab="$t('batchEditOption.stockEdit')">
      <StockEdit
        v-if="current == 5"
        ref="stockEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <!-- <a-tab-pane :key="6" :tab="$t('batchEditOption.isPreOrder')">
      <IsPreOrder
        v-if="current == 6"
        ref="isPreOrder"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane> -->
    <!-- <a-tab-pane :key="7" :tab="$t('batchEditOption.logistics')">
      <LogisticsEdit
        v-if="current == 7"
        ref="logisticsEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane> -->
    <a-tab-pane :key="8" :tab="$t('batchEditOption.weight')">
      <Weight
        v-if="current == 8"
        ref="weight"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <a-tab-pane :key="9" :tab="$t('batchEditOption.onOffShelves')">
      <OnOffShelves
        v-if="current == 9"
        ref="onOffShelves"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
    <!-- <a-tab-pane :key="10" :tab="$t('batchEditOption.storeCategory')">
      <CategoryName
        v-if="current == 10"
        ref="categoryName"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane> -->
    <a-tab-pane :key="11" :tab="$t('batchEditOption.delete')">
      <DeleteEdit
        v-if="current == 11"
        ref="deleteEdit"
        :storeId="store"
        @cancel="onCancel"
        v-bind="$attrs"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import NameEdit from '@/views/goods/components/onlineBatchEdit/NameEdit'
import DescEdit from '@/views/goods/components/onlineBatchEdit/DescEdit'
import ProductCode from '@/views/goods/components/onlineBatchEdit/ProductCode'
import PriceEdit from '@/views/goods/components/onlineBatchEdit/PriceEdit'
// import IsPreOrder from '@/views/goods/components/onlineBatchEdit/IsPreOrder'
import Weight from '@/views/goods/components/onlineBatchEdit/Weight'
// import CategoryName from '@/views/goods/components/onlineBatchEdit/CategoryName'
import StockEdit from '@/views/goods/components/onlineBatchEdit/StockEdit'
// import LogisticsEdit from '@/views/goods/components/onlineBatchEdit/LogisticsEdit'
import OnOffShelves from '@/views/goods/components/onlineBatchEdit/OnOffShelves'
import DeleteEdit from '@/views/goods/components/onlineBatchEdit/DeleteEdit'

const tabsRefsName = {
  1: 'nameEdit',
  2: 'descEdit',
  3: 'productCode',
  4: 'priceEdit',
  5: 'stockEdit',
  6: 'isPreOrder',
  7: 'logisticsEdit',
  8: 'weight',
  9: 'onOffShelves',
  10: 'categoryName',
  11: 'deleteEdit'
}
export default {
  components: {
    NameEdit,
    DescEdit,
    ProductCode,
    PriceEdit,
    // IsPreOrder,
    Weight,
    // CategoryName,
    StockEdit,
    // LogisticsEdit,
    OnOffShelves,
    DeleteEdit
  },
  props: {
    store: Number
  },
  inheritAttrs: false,
  data() {
    return {
      current: 1
    }
  },
  methods: {
    tabsChange(current) {
      const preCurrentRefs = tabsRefsName[this.$data.current]
      const preComponents = this.$refs[preCurrentRefs]
      if (
        preComponents &&
        preComponents.whetherChange &&
        preComponents.whetherChange()
      ) {
        this.$confirm({
          title: this.$t('common.message'),
          content: this.$t('batchEditOption.batchEditWarning'),
          onOk: () => {
            this.$data.current = current
          }
        })
        return
      }
      this.$data.current = current
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss">
.custom-tabs {
  border: none !important;
  &.ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
    margin: 0 !important;
    text-align: left;
  }
}
</style>
