<template>
  <div>
    <a-form-model :model="params" layout="inline">
      <a-form-model-item>
        <a-input
          :placeholder="$t('autoUp.formlable1')"
          v-model="params.storeName"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="initData">
          {{ $t('autoUp.searchBtn') }}
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <a-table
      rowKey="storeId"
      class="me-mt-2"
      :columns="columns"
      :data-source="stores"
      @change="onPageChange"
    >
      <span slot="action" slot-scope="text, record">
        <a class="me-link" @click="setProduct(record)">
          {{ $t('autoUp.setting') }}
        </a>
      </span>

      <span slot="_chooses_" slot-scope="text, record">
        {{ getAttr(record) && getAttr(record).productNumber }}
      </span>
    </a-table>

    <a-modal
      :maskClosable="false"
      width="70%"
      :mask="false"
      destroyOnClose
      v-model="setStoreProductVisible"
      :title="'选择' + listTitle + '/' +siteName + '-' + currentStore.storeName"
      :footer="null"
      @cancel="
        setStoreProductVisible = false
        currentStore = {}
      "
    >
      <template v-if="getAttr(currentStore)">
        <SetStoreProduct
          :selected="getAttr(currentStore).productIds"
          ref="setStoreCategory"
          :storeId="currentStore.storeId"
          :disableds="getDisableds(currentStore.storeId)"
          :multiple="multiple"
          :listTitle="listTitle"
          @change="onChange"
          @ok="
            setStoreProductVisible = false
            currentStore = {}
          "
        />
      </template>
    </a-modal>
  </div>
</template>

<script>
import SetStoreProduct from '@/views/goods/components/autoUp/SetStoreProduct'
import store from '@/api/store'
import { cloneDeep, uniqWith, isEqual } from 'lodash'
export default {
  components: {
    SetStoreProduct
  },
  props: {
    listTitle: String,
    code: String,
    siteName: String,
    disableds: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    multiple: Number
  },
  data() {
    return {
      stores: [],
      currentStore: {},
      setStoreProductVisible: false,
      columns: [
        {
          title: this.$t('autoUp.store'),
          dataIndex: 'storeName',
          key: 'storeName',
        },
        {
          title: this.$t('autoUp.chooseProducts'),
          dataIndex: '_chooses_',
          key: '_chooses_',
          scopedSlots: { customRender: '_chooses_' }
        },
        {
          title: this.$t('autoUp.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      params: {
        storeName: null,
        current: 1
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**初始化数据 */
    initData() {
      this.$data.params.current = 1
      this.getDataSource()
    },
    onPageChange(pagination) {
      this.$set(this.$data.params, 'current', pagination.current)
      this.getDataSource()
    },
    /**获取数据 */
    getDataSource() {
      const params = {
        ...this.$data.params,
        countryCode: this.$props.code
      }
      let selected = cloneDeep(this.$props.selected)
      store.getStoreList(params).then(({ data }) => {
        const newSelected = data.records.map(({ storeId, storeName }) => {
          let current = selected.find((sl) => sl.storeId === storeId)
          if (!current) {
            current = {
              storeId,
              storeName,
              productNumber: 0,
              productIds: []
            }
          }
          return current
        })
        selected = [...selected, ...newSelected]
        selected = uniqWith(selected, isEqual)
        this.$emit('change', selected)
        this.$data.stores = data.records
      })
    },
    /**选择产品 */
    setProduct(store) {
      this.$data.currentStore = store
      this.$data.setStoreProductVisible = true
    },
    /**获取属性值 */
    getAttr(store) {
      const { storeId } = store
      const selected = this.$props.selected
      return selected.find((sl) => sl.storeId === storeId)
    },
    /**选择事件 */
    onChange(value) {
      const { storeId } = this.$data.currentStore
      let selected = cloneDeep(this.$props.selected)
      selected = selected.map((sl) => {
        if (sl.storeId === storeId) {
          sl.productIds = value
          sl.productNumber = value.length
        }
        return sl
      })
      this.$emit('change', selected)
    },
    /**获取禁选列 */
    getDisableds(storeId) {
      const { disableds } = this.$props
      const c = disableds.find((ds) => ds.storeId === storeId)
      if (c) return c.productIds
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>