<template>
  <a-tabs
    class="batch-edit-tabs custom-tabs"
    tab-position="left"
    :default-active-key="1"
    :activeKey="current"
    @change="tabsChange"
  >
    <a-tab-pane :key="1" :tab="$t('batchEditOption.title')">
      <NameEdit
        v-if="current == 1"
        ref="nameEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="2" :tab="$t('batchEditOption.desc')">
      <DescEdit
        v-if="current == 2"
        ref="descEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="3" :tab="$t('batchEditOption.productCode')">
      <ProductCode
        v-if="current == 3"
        ref="productCode"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="4" :tab="$t('batchEditOption.productStatus')">
      <GoodsStatusEdit
        v-if="current == 4"
        ref="goodsStatusEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="41" :tab="$t('batchEditOption.priceEdit')">
      <PricingTemplateEdit
        v-if="current == 41"
        ref="pricingTemplateEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="5" :disabled="tabDisabled(5)">
      <a-tooltip slot="tab" placement="top">
        <template slot="title" v-if="tabDisabled(5)">
          <span>{{ $t('batchEditOption.dispatchValidMsg') }}</span>
        </template>
        <span>{{ $t('batchEditOption.categoryAttr') }}</span>
      </a-tooltip>
      <CategoryAttrEdit
        v-if="current == 5"
        ref="categoryAttrEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="6" :disabled="tabDisabled(6)">
      <a-tooltip slot="tab" placement="top">
        <template slot="title" v-if="tabDisabled(6)">
          <span>{{ $t('batchEditOption.dispatchValidMsg') }}</span>
        </template>
        <span>{{ $t('batchEditOption.brand') }}</span>
      </a-tooltip>
      <Brand
        v-if="current == 6"
        ref="brand"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="7" :tab="$t('batchEditOption.specName')">
      <SpecNameEdit
        v-if="current == 7"
        ref="specNameEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="8" :tab="$t('batchEditOption.skuCode')">
      <SkuCodeEdit
        v-if="current == 8"
        ref="skuCodeEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="9" :tab="$t('batchEditOption.stock')">
      <Stock
        v-if="current == 9"
        ref="stock"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <!-- <a-tab-pane :key="10" :disabled="tabDisabled(10)">
      <a-tooltip slot="tab" placement="top">
        <template slot="title" v-if="tabDisabled(10)">
          <span>{{ $t('batchEditOption.dispatchValidMsg') }}</span>
        </template>
        <span>{{ $t('batchEditOption.discount') }}</span>
      </a-tooltip>
      <DiscountEdit
        v-if="current == 10"
        ref="discountEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane> -->
    <a-tab-pane :key="11" :tab="$t('batchEditOption.productMasterImage')">
      <ProductMasterImage
        v-if="current == 11"
        ref="productMasterImage"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="13" :tab="$t('batchEditOption.qppendWatermark')">
      <AppendWatermarkEdit
        v-if="current == 13"
        ref="appendWatermarkEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="14" :tab="$t('batchEditOption.packageWeight')">
      <PackageWeight
        v-if="current == 14"
        ref="packageWeight"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="15" :tab="$t('batchEditOption.packageSize')">
      <PackageSizeEdit
        v-if="current == 15"
        ref="packageSizeEdit"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="16" :disabled="tabDisabled(16)">
      <a-tooltip slot="tab" placement="top">
        <template slot="title" v-if="tabDisabled(16)">
          <span>同时编辑多个站点时和CNSC，不可编辑此项目</span>
        </template>
        <span>{{ $t('batchEditOption.logisticsMethods') }}</span>
      </a-tooltip>
      <LogisticsMethods
        v-if="current == 16"
        ref="logisticsMethods"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="17" :disabled="tabDisabled(17)">
      <a-tooltip slot="tab" placement="top">
        <template slot="title" v-if="tabDisabled(17)">
          <span>{{ $t('batchEditOption.dispatchValidMsg') }}</span>
        </template>
        <span>{{ $t('batchEditOption.isPreOrder') }}</span>
      </a-tooltip>
      <IsPreOrder
        v-if="current == 17"
        ref="isPreOrder"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
    <a-tab-pane :key="18" :tab="$t('batchEditOption.batchRelease')">
      <BatchRelease
        v-if="current == 18"
        ref="batchRelease"
        :rowKeys="rowKeys"
        @cancel="onCancel"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import NameEdit from '@/views/goods/components/batchEditTabs/NameEdit'
import DescEdit from '@/views/goods/components/batchEditTabs/DescEdit'
import ProductCode from '@/views/goods/components/batchEditTabs/ProductCode'
import GoodsStatusEdit from '@/views/goods/components/batchEditTabs/GoodsStatusEdit'
import SpecNameEdit from '@/views/goods/components/batchEditTabs/SpecNameEdit'
import SkuCodeEdit from '@/views/goods/components/batchEditTabs/SkuCodeEdit'
import PackageSizeEdit from '@/views/goods/components/batchEditTabs/PackageSizeEdit'
import Brand from '@/views/goods/components/batchEditTabs/Brand'
import CategoryAttrEdit from '@/views/goods/components/batchEditTabs/CategoryAttrEdit'
import Stock from '@/views/goods/components/batchEditTabs/Stock'
import DiscountEdit from '@/views/goods/components/batchEditTabs/DiscountEdit'

import IsPreOrder from '@/views/goods/components/batchEditTabs/IsPreOrder'
import AppendWatermarkEdit from '@/views/goods/components/batchEditTabs/AppendWatermarkEdit'
import ProductMasterImage from '@/views/goods/components/batchEditTabs/ProductMasterImage'
import PackageWeight from '@/views/goods/components/batchEditTabs/PackageWeight'
import LogisticsMethods from '@/views/goods/components/batchEditTabs/LogisticsMethods'
import PricingTemplateEdit from '@/views/goods/components/batchEditTabs/PricingTemplateEdit'
import BatchRelease from '@/views/goods/components/batchEditTabs/BatchRelease'

import { uniq } from 'lodash'
const tabsRefsName = {
  1: 'nameEdit',
  2: 'descEdit',
  3: 'productCode',
  4: 'goodsStatusEdit',
  5: 'categoryAttrEdit',
  7: 'specNameEdit',
  6: 'brand',
  8: 'skuCodeEdit',
  9: 'stock',
  10: 'discountEdit',
  11: 'productMasterImage',
  13: 'appendWatermarkEdit',
  14: 'packageWeight',
  15: 'packageSizeEdit',
  16: 'logisticsMethods',
  17: 'isPreOrder',
  18: 'batchRelease',
  41: 'pricingTemplateEdit'
}
export default {
  components: {
    NameEdit,
    DescEdit,
    ProductCode,
    GoodsStatusEdit,
    SpecNameEdit,
    Stock,
    Brand,
    CategoryAttrEdit,
    SkuCodeEdit,
    // DiscountEdit,
    IsPreOrder,
    PackageSizeEdit,
    AppendWatermarkEdit,
    ProductMasterImage,
    PackageWeight,
    LogisticsMethods,
    PricingTemplateEdit,
    BatchRelease
  },
  props: {
    current: [String, Number],
    rows: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    rowKeys() {
      const { rows } = this.$props
      const ids = rows.map(({ id }) => id)
      return ids
    },
    tabDisabled() {
      return (key) => {
        const { rows } = this.$props
        console.log(rows)
        const storeIds = uniq(rows.map(({ storeId }) => storeId)) // storeType // countryCode
        const countryCodes = uniq(rows.map(({ countryCode }) => countryCode)) // storeType // countryCode
        const storeTypes = uniq(
          rows.map(({ storeType }) => {
            return storeType == 1 || storeType == 2
          })
        )
        /**
         * 同一店铺才支持混遍
         */
        if (key === 10 || key === 16) {
          if (storeIds.length == 1) {
            if (rows[0].merchantId) {
              //如果是cnsc店铺物流方式不能编辑
              return true
            }
            return false
          }
        }

        /**
         * 同一站点同跨境店或同本土店支持混编（类目属性）
         */
        if (key === 5 || key === 6 || key === 17) {
          if (countryCodes.length == 1 && storeTypes.length == 1) {
            return false
          }
        }
        return true
      }
    }
  },
  mounted() {},
  methods: {
    tabsChange(current) {
      const preCurrentRefs = tabsRefsName[this.$props.current]
      const preComponents = this.$refs[preCurrentRefs]

      // this.$data.whetherSave = true

      if (
        preComponents &&
        preComponents.whetherChange &&
        preComponents.whetherChange()
      ) {
        this.$confirm({
          title: this.$t('common.message'),
          content: this.$t('batchEditOption.batchEditWarning'),
          onOk: () => {
            this.$emit('change', current)
          }
        })
        return
      }
      this.$emit('change', current)
    },
    onCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.batch-edit-tabs {
  &.custom-tabs {
    border: none;
    &.ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
      margin: 0 !important;
      text-align: left;
    }
  }
}
</style>
