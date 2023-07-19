<template>
  <div>
    <div
      class="me-list-item me-mb-2 me-pb-1"
      v-for="ops in batchEditOption"
      :key="ops.key"
    >
      <ul>
        <p class="title me-mb-2">{{ ops.title }}</p>
        <li v-for="cps in ops.children" :key="cps.key">
          <span
            @click="onChoose(ops, cps)"
            class="me-link"
            :class="{ active: cps.active }"
          >
            {{ cps.title }}
          </span>
        </li>
      </ul>
    </div>

    <!-- 选择站点 start -->
    <a-modal
      width="1000px"
      destroyOnClose
      :maskClosable="false"
      :visible="chooseStoreModalVisible"
      @ok="handleChooseStoreModalOk"
      @cancel="handleChooseStoreModalCancel"
    >
      <template slot="title">
        <p class="me-choose-store-modal-title">
          {{ $t('batchEditOption.chooseStoreMsg1') }}
          <template v-if="multiple">
            <span class="me-ml-1">
              {{ $t('batchEditOption.chooseStoreMsg2') }}
            </span>
          </template>
        </p>
      </template>
      <!-- 多选 -->
      <template v-if="multiple">
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkedAll"
          @change="onCheckAllChange"
        >
          {{ $t('batchEditOption.all') }}
        </a-checkbox>
        <a-checkbox-group style="width: 100%" v-model="currentMultipleStores">
          <a-row>
            <a-col :span="8" v-for="store in stores" :key="store.storeId">
              <a-checkbox :value="store.storeId">
                {{ store.storeName }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </template>
      <!-- 单选 -->
      <template v-else>
        <a-radio-group style="width: 100%" v-model="currentStores">
          <a-row>
            <a-col :span="8" v-for="store in stores" :key="store.storeId">
              <a-radio
                :value="store.storeId"
                :disabled="!!store.merchantId"
                v-if="key == 16 && !!store.merchantId"
              >
                <a-popover>
                  <template slot="content">
                    <p>cnsc店铺不支持物流方式批量编辑</p>
                  </template>
                  {{ store.storeName }}
                </a-popover>
              </a-radio>
              <a-radio :value="store.storeId" v-else>
                {{ store.storeName }}
              </a-radio>
            </a-col>
          </a-row>
        </a-radio-group>
      </template>
    </a-modal>
    <!-- 选择站点 end -->

    <a-modal
      :title="null"
      :footer="null"
      width="90%"
      class="batch-edit-tabs-model"
      destroyOnClose
      :maskClosable="false"
      :visible="editTabsModalVisible"
      @cancel="handleBatchEditTabsModalCancel"
    >
      <BatchEditTabs
        @cancel="handleBatchEditTabsModalCancel"
        :current="key"
        :rows="getRows"
        @change="onTabsChange"
      />
    </a-modal>
  </div>
</template>

<script>
import { uniqWith } from 'lodash'
import BatchEditTabs from './BatchEditTabs'
export default {
  components: { BatchEditTabs },
  props: {
    rows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const batchEditOption = [
      {
        title: this.$t('batchEditOption.basicInfo'),
        children: [
          {
            multiple: true,
            title: this.$t('batchEditOption.title'),
            key: 1
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.desc'),
            key: 2
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.productCode'),
            key: 3
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.productStatus'),
            key: 4
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.priceEdit'),
            key: 41
          }
        ],
        key: 'basicInfo'
      },
      {
        title: this.$t('batchEditOption.categoryAttr'),
        children: [
          {
            multiple: false,
            title: this.$t('batchEditOption.categoryAttr'),
            key: 5
          },
          {
            multiple: false,
            title: this.$t('batchEditOption.brand'),
            key: 6
          }
        ],
        key: 'categoryAttr'
      },
      {
        title: this.$t('batchEditOption.skuInfo'),
        children: [
          {
            multiple: true,
            title: this.$t('batchEditOption.specName'),
            key: 7
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.skuCode'),
            key: 8
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.stock'),
            key: 9
          }
          // {
          //   multiple: false,
          //   title: this.$t('batchEditOption.discount'),
          //   key: 10
          // }
        ],
        key: 'skuInfo'
      },
      {
        title: this.$t('batchEditOption.productImage'),
        children: [
          {
            multiple: true,
            title: this.$t('batchEditOption.productMasterImage'),
            key: 11
          },
          // {
          //   multiple: true,
          //   title: this.$t('batchEditOption.quickSetup'),
          //   key: 12,
          //   active: true
          // },
          {
            multiple: true,
            title: this.$t('batchEditOption.qppendWatermark'),
            key: 13
          }
        ],
        key: 'productImage'
      },
      {
        title: this.$t('batchEditOption.logisticsInfo'),
        children: [
          {
            multiple: true,
            title: this.$t('batchEditOption.packageWeight'),
            key: 14
          },
          {
            multiple: true,
            title: this.$t('batchEditOption.packageSize'),
            key: 15
          },
          {
            multiple: false,
            title: this.$t('batchEditOption.logisticsMethods'),
            key: 16
          },
          {
            multiple: false,
            title: this.$t('batchEditOption.isPreOrder'),
            key: 17
          }
        ],
        key: 'logisticsInfo'
      }
    ]
    return {
      batchEditOption,
      currentMultipleStores: [] /**多站点编辑 */,
      currentStores: null /**单站点编辑 */,
      chooseStoreModalVisible: false /**站点编辑开关 */,
      editTabsModalVisible: false /**编辑tab页开关 */,
      multiple: false /**是否多站点编辑 */,
      key: null /**当前编辑字段 */
    }
  },
  computed: {
    /**当前的店铺 */
    stores() {
      const { rows } = this.$props

      let stores = rows.map(
        ({ storeId, storeName, storeAlias, merchantId, merchantName }) => ({
          storeId: storeId ? storeId : merchantId,
          storeName: storeName ? storeName : merchantName,
          storeAlias,
          merchantId
        })
      )
      stores.sort((a, b) => {
        if (a.storeId < b.storeId) return -1
        if (a.storeId > b.storeId) return 1
        return 0
      })
      stores = uniqWith(stores, (pre, cur) => {
        return pre.storeId === cur.storeId
      })
      console.log(stores, 999)
      // stores = stores.filter((item) => item.storeName) // cnsc店铺查出来是空字符，所以过滤掉c
      return stores
    },
    /**
     * 选中店铺的商品
     */
    getRows() {
      const { rows } = this.$props
      const { currentMultipleStores, currentStores, multiple } = this.$data
      let _rows = []
      if (multiple) {
        _rows = rows.filter(({ storeId, merchantId }) => {
          return currentMultipleStores.includes(storeId || merchantId)
        })
      } else {
        _rows = rows.filter(({ storeId, merchantId }) => {
          return currentStores === (storeId || merchantId)
        })
      }
      return _rows
    },
    /**半选状态 */
    // eslint-disable-next-line vue/return-in-computed-property
    indeterminate() {
      const { rows } = this.$props
      if (this.getRows.length === rows.length) return false
      if (this.getRows.length >= 1) return true
    },
    /**全选状态 */
    checkedAll() {
      const { rows } = this.$props
      if (this.getRows.length === rows.length) return true
      return false
    }
  },
  methods: {
    /**
     * 字段选择事件
     */
    onChoose(ops, { multiple, key }) {
      this.$data.multiple = multiple
      this.$data.key = key
      this.$data.chooseStoreModalVisible = true
      this.$emit('selected')
    },
    /**店铺选择确定 */
    handleChooseStoreModalOk() {
      const { currentMultipleStores, currentStores } = this.$data
      if (!(currentMultipleStores.length || currentStores)) {
        this.$message.error(this.$t('batchEditOption.chooseStoreModalError'))
        return
      }
      this.$data.editTabsModalVisible = true
      this.$data.chooseStoreModalVisible = false
    },
    /**店铺选择取消 */
    handleChooseStoreModalCancel() {
      this.$data.multiple = false
      this.$data.key = null
      this.$data.chooseStoreModalVisible = false
    },
    /**取消编辑 */
    handleBatchEditTabsModalCancel() {
      this.$data.currentMultipleStores = []
      this.$data.currentStores = null
      this.$data.chooseStoreModalVisible = false
      this.$data.editTabsModalVisible = false
      this.$data.multiple = false
      this.$data.key = null
      this.$emit('cancel')
    },
    /**tabs点击改变事件 */
    onTabsChange(current) {
      this.$data.key = current
    },
    /**全选 */
    onCheckAllChange({ target }) {
      const { checked } = target
      if (checked) {
        const storeIds = this.stores.map(({ storeId }) => storeId)
        this.$data.currentMultipleStores = storeIds
      } else {
        this.$data.currentMultipleStores = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.me-list-item {
  max-width: 360px;
  border-bottom: 1px dashed #e4e7ed;

  .title {
    color: #999999;
  }

  &:last-child {
    border-bottom: none;
  }

  ul {
    li {
      display: inline-block;
      min-width: 120px;
      line-height: 30px;
      padding: 0 10px;

      .me-link {
        color: #666666 !important;
        position: relative;

        &:hover {
          color: #40a9ff !important;
        }

        &.active {
          &::after {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: red;
            position: absolute;
            right: -8px;
            top: -5px;
          }
        }
      }
    }
  }
}

.me-choose-store-modal-title {
  span {
    font-size: 12px;
    color: #40a9ff;
  }
}
</style>

<style lang="scss">
.batch-edit-tabs-model {
  .ant-modal-body {
    padding: 5 !important;
    padding-left: 0;
  }
}
</style>
