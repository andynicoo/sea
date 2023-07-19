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
        <template v-if="getAttr(record.storeId)._categoryNames_">
          <a class="me-link" @click="setCategory(record)">
            {{ $t('autoUp.changeCategory') }}
          </a>
        </template>
        <template v-else>
          <a class="me-link" @click="setCategory(record)">
            {{ $t('autoUp.setCategory') }}
          </a>
        </template>
      </span>
      <span slot="_names_" slot-scope="text, record">
        {{ getAttr(record.storeId)._categoryNames_ }}
      </span>
    </a-table>

    <a-modal
      width="70%"
      :mask="false"
      destroyOnClose
      v-model="setStoreCategoryVisible"
      :title="$t('autoUp.setSiteCategory')"
      @ok="onSetSiteCategoryOk"
      @cancel="
        setStoreCategoryVisible = false
        currentStore = {}
      "
    >
      <SetStoreCategory
        ref="setStoreCategory"
        :storeId="currentStore.storeId"
        :countryCode="currentStore.countryCode"
      />
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import SetStoreCategory from '@/views/goods/components/autoUp/SetStoreCategory'
import { isEqual, uniqWith, cloneDeep } from 'lodash'
export default {
  components: {
    SetStoreCategory
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    code: String
  },
  data() {
    return {
      stores: [],
      setStoreCategoryVisible: false,
      currentStore: {},
      params: {
        storeName: null,
        current: 1
        // isSetUp: 1
      },
      columns: [
        {
          title: this.$t('autoUp.store'),
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: this.$t('autoUp.names'),
          dataIndex: '_names_',
          key: '_names_',
          scopedSlots: { customRender: '_names_' }
        },
        {
          title: this.$t('autoUp.action'),
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
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

      /**初始化数据 */
      Store.getStoreList(params).then(({ data }) => {
        const { selected } = this.$props

        let bootsProductContent2 = data.records.map((element) => {
          let current = selected.find(({ storeId }) => {
            return element.storeId === storeId
          })
          if (!current) {
            current = {
              storeId: element.storeId,
              storeName: element.storeName,
              categoryId: null,
              site: element.countryCode,
              categoryIds: [],
              categoryNames: []
            }
          }
          return current
        })

        bootsProductContent2 = [...selected, ...bootsProductContent2]
        bootsProductContent2 = uniqWith(bootsProductContent2, isEqual)
        this.$emit('change', bootsProductContent2)
        this.$data.stores = data.records
      })
    },
    /**设置类目 */
    setCategory(store) {
      this.$data.currentStore = store
      this.$data.setStoreCategoryVisible = true
    },
    /**设置站点类目确定事件 */
    onSetSiteCategoryOk() {
      const { currentStore } = this.$data
      let selected = cloneDeep(this.$props.selected)
      this.$refs['setStoreCategory']
        .validateFields()
        .then(({ categoryIds, categoryId, names }) => {
          const { storeId } = currentStore
          selected = selected.map((sl) => {
            if (sl.storeId === storeId) {
              sl.categoryIds = categoryIds
              sl.categoryId = categoryId
              sl.categoryNames = names
            }
            return sl
          })
          this.$emit('change', selected)
          this.$data.setStoreCategoryVisible = false
        })
    },
    /**获取值 */
    getAttr(storeId) {
      const selected = cloneDeep(this.$props.selected)
      const current = selected.find((attr) => attr.storeId === storeId)
      if (current) {
        current._categoryNames_ = current.categoryNames.join(' / ')
      }
      return current
    }
  }
}
</script>

<style lang="scss" scoped></style>
