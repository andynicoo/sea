<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :preview="false"
    @initData="initData"
    :initfunc="false"
  >
    <template v-slot:before="{ record, index }">
      <p>{{ $t('toBeEdit.originalPrice') }}：</p>
      <p v-html="getPrice(record)"></p>
      <ul
        v-if="
          record.variants && record.variants.length > 1 && record._viewflag_
        "
      >
        <li v-for="item in record.variants" :key="item.id">
          <p
            class="me-variation-sku ellipsis nowrap"
            :title="item.variationSku"
          >
            {{ item.variationSku }}
          </p>
          <p
            v-html="
              record.currency + ':' + item.price + '&emsp;RMB:' + item.rmbPrice
            "
          ></p>
        </li>
      </ul>
      <a-button
        v-if="record.variants.length > 1"
        type="link"
        @click="viewAll(index)"
      >
        {{ record._viewflag_ ? $t('common.putAll') : $t('common.viewAll') }}
      </a-button>
    </template>
    <template v-slot:after="">
      <p class="me-desc">
        {{ $t('toBeEdit.unPreview') }}
      </p>
    </template>

    <template>
      <table class="me-edit-setting">
        <tr>
          <td>{{ $t('toBeEdit.selectDiscount') }} :</td>
          <td>
            <a-select v-model="storeIdA" class="me-mr-1">
              <a-select-option
                v-for="item in storeCurr"
                :key="item.storeId"
                :value="item.storeId"
              >
                {{ item.storeName }}
              </a-select-option>
            </a-select>

            <a-tooltip>
              <template slot="title">
                {{ $t('toBeEdit.discountTips1') }}
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </td>
        </tr>
      </table>

      <a-table
        :columns="columnsTable"
        :data-source="dataSourceTable"
        rowKey="id"
        class="me-discount-table"
      >
        <template slot="discountActivities" slot-scope="">
          <span v-if="bindActive"
            >{{ bindActive.discountName }}
            <a-icon type="close-circle" @click="delActive"
          /></span>
          <a-button v-else type="link" @click="selectActive"
            >{{ $t('toBeEdit.selectSctivities') }}
          </a-button>
          <p v-if="activeFlag" class="me-red">
            {{ $t('toBeEdit.selectStore') }}
          </p>
        </template>
        <template slot="discount" slot-scope="text, record">
          <a-input-number
            :min="0.1"
            :max="9.9"
            :step="0.1"
            class="me-mr-1"
            v-model="record.discount"
            @change="discountChange"
            @blur="discountBlur"
          />{{ $t('toBeEdit.zhe') }}

          <p v-if="discountFlag" class="me-red">
            {{ $t('toBeEdit.enterDiscount') }}
          </p>
        </template>
        <template slot="limited" slot-scope="text, record">
          <a-input-number
            class="me-w120"
            id="inputNumber"
            v-model="record.limited"
            :min="0"
            :max="99999"
            :placeholder="$t('toBeEdit.limitedQuantity')"
            @change="limitedChange"
            @blur="limitedBlur"
          />
          <p v-if="limitedFlag" class="me-red">
            {{ $t('toBeEdit.enterLimitedQuantity') }}
          </p>
        </template>
        <!-- <template slot="handler" slot-scope="text, record">
            <a-button type="link">移除</a-button>
          </template> -->
      </a-table>
      <a-modal
        :title="$t('toBeEdit.selectSctivitiesDiscount')"
        :visible="MAvisible"
        width="900px"
        :ok-text="$t('toBeEdit.addActivities')"
        @ok="createActive"
        @cancel="MAvisible = false"
        destroyOnClose
      >
        <MarketingActivities :currActive="currActive" :storeId="storeIdA" />
      </a-modal>
    </template>
  </BaseTable>
</template>

<script>
import { division, mcl } from '@/util'
import Store from '@/api/store'
import Goods from '@/api/goods'
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import MarketingActivities from './MarketingActivities'
import { cloneDeep } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable, MarketingActivities },
  props: {
    rowKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      MAvisible: false,
      storeIdA: '',
      storeCurr: [],
      bindActive: null,
      columnsTable: [
        {
          title: this.$t('toBeEdit.store'),
          dataIndex: 'store',
          key: 'store',
          width: 300
        },
        {
          title: this.$t('toBeEdit.discountActivities'),
          dataIndex: 'discountActivities',
          key: 'discountActivities',
          scopedSlots: { customRender: 'discountActivities' },
          width: 300
        },
        {
          title: this.$t('toBeEdit.discount'),
          dataIndex: 'discount',
          key: 'discount',
          scopedSlots: { customRender: 'discount' },
          width: 200
        },
        {
          title: this.$t('toBeEdit.limited'),
          dataIndex: 'limited',
          key: 'limited',
          scopedSlots: { customRender: 'limited' }
        }
      ],
      dataSourceTable: [],
      discountFlag: false,
      activeFlag: false,
      limitedFlag: false
    }
  },
  async created() {
    let { data } = await Store.getAllStore()
    this.$data.storeList = data
  },
  mounted() {},
  methods: {
    //创建活动
    createActive() {
      this.$router.push({ path: '/discount/edit' })
    },
    //选中的活动子组件调用
    currActive(val) {
      this.$data.MAvisible = false
      this.$data.bindActive = val
      console.log(val)
      this.$data.activeFlag = false
    },
    //选择活动弹窗
    selectActive() {
      this.$data.MAvisible = true
    },
    //删除活动
    delActive() {
      this.$data.bindActive = null
    },
    //添加展开收起标记
    getTableDataAfter() {
      this.$data.dataSource.forEach((item) => {
        this.$set(item, '_viewflag_', false)
      })
      this.$data.storeCurr.push(
        this.$data.storeList.find((item) => {
          return item.storeId == this.$data.dataSource[0].storeId
        })
      )
      let store0 = this.$data.storeCurr[0]
      this.$data.storeIdA = store0.storeId
      if (!this.$data.dataSourceTable.length) {
        this.$data.dataSourceTable.push({
          id: store0.storeId,
          store: store0.storeName,
          discountActivities: '',
          discount: '',
          limited: ''
        })
      }
    },
    //显示全部
    viewAll(index) {
      this.$data.dataSource[index]._viewflag_ = !this.$data.dataSource[index]
        ._viewflag_
    },

    //获取价格区间
    getPrice(row) {
      let { currency, rate } = row
      let priceArr = []
      let priceArrB = []
      let rmb = 'RMB'
      let site = currency
      if (!row.hasVariation) {
        rmb += row.rmbPrice
        site += row.price
        return site + '&emsp;' + rmb
      } else {
        row.variants.forEach((item) => {
          priceArr.push(item.rmbPrice)
          priceArrB.push(item.price)
        })
        priceArr = priceArr.sort((a, b) => a - b)
        priceArrB = priceArrB.sort((a, b) => a - b)
        // console.log(priceArr)
        if (priceArr.length > 1) {
          rmb += priceArr[0] + '~' + priceArr[priceArr.length - 1]
          site += priceArrB[0] + '~' + priceArrB[priceArrB.length - 1]
          return site + '&emsp;' + rmb
        } else {
          rmb += priceArr[0]
          site += priceArrB[0]
          return site + '&emsp;' + rmb
        }
      }
    },

    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**保存 */
    async onSave() {
      const { dataSource, selectedRowKeys, dataSourceTable } = this.$data
      if (!this.$data.bindActive) {
        this.$data.activeFlag = true
      }
      if (!dataSourceTable[0].discount) {
        this.$data.discountFlag = true
      }
      if (
        dataSourceTable[0].limited === '' ||
        dataSourceTable[0].limited === null
      ) {
        this.$data.limitedFlag = true
      }
      if (
        !this.$data.activeFlag &&
        !this.$data.discountFlag &&
        !this.$data.limitedFlag
      ) {
        let data = cloneDeep(
          dataSource.filter(({ id }) => selectedRowKeys.includes(id))
        )
        data = data.map((ele) => {
          ele.discountId = this.$data.bindActive.discountId
          ele.purchaseLimit = dataSourceTable[0].limited
          if (ele.hasVariation) {
            ele.variants.forEach((item) => {
              item.promotionStatus = 1
              item.promotionPrice = mcl(
                0.1,
                mcl(dataSourceTable[0].discount, item.price)
              ).toFixed(2)
              item.rmbPromotionPrice = mcl(
                0.1,
                mcl(dataSourceTable[0].discount, item.rmbPrice)
              ).toFixed(2)
            })
          } else {
            ele.promotionPrice = mcl(
              0.1,
              mcl(dataSourceTable[0].discount, ele.price)
            ).toFixed(2)
            ele.rmbPromotionPrice = mcl(
              0.1,
              mcl(dataSourceTable[0].discount, ele.rmbPrice)
            ).toFixed(2)
          }
          return ele
        })
        await Goods.handleEditBatch(data)
      } else {
        return Promise.reject()
      }
    },
    //折扣改变
    discountChange(val) {
      if (val) {
        this.$data.discountFlag = false
      }
    },
    //限购数量改变
    limitedChange(val) {
      if (val !== '') {
        this.$data.limitedFlag = false
      }
    },
    //限购数量失去焦点
    limitedBlur() {
      const { dataSourceTable } = this.$data
      if (!isNaN(dataSourceTable[0].limited) && dataSourceTable[0].limited) {
        dataSourceTable[0].limited = parseInt(dataSourceTable[0].limited)
      }
    },
    //折扣失去焦点
    discountBlur() {
      const { dataSourceTable } = this.$data
      if (!isNaN(dataSourceTable[0].discount) && dataSourceTable[0].discount) {
        let fixed = dataSourceTable[0].discount.toFixed(1)
        dataSourceTable[0].discount = parseFloat(fixed)
      }
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-edit-setting {
  td {
    padding: 5px 0 5px 15px;
  }
  tr {
    & td:nth-child(odd) {
      text-align: right;
    }
  }
}
.me-variation-sku {
  max-width: 200px;
  height: 18px;
  margin-top: 10px;
}
.me-w120 {
  width: 120px;
}
.me-red {
  color: red;
}
.me-discount-table {
  ::v-deep td {
    vertical-align: top;
  }
}
</style>
