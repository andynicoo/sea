<template>
  <div>
    <div class="me-mb-2">
      <span class="sku-label">站点</span>
      <a-checkbox
        :indeterminate="indeterminate"
        :checked="checkAll"
        @change="onCheckAllChange"
      >
        全部
      </a-checkbox>
      <a-checkbox-group
        v-model="sitesList"
        :options="stores"
        @change="onSiteChange"
      />
    </div>

    <a-form-model layout="inline" :model="params" class="me-mb-2">
      <a-form-model-item label="店铺">
        <a-select
          @change="onParamsStoreIdChange"
          class="me-mr-4"
          style="width: 180px"
          v-model="params.storeId"
        >
          <a-select-option
            v-for="item in currentStore"
            :value="item.storeId"
            :key="item.storeId"
          >
            {{ item.storeName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="配对状态">
        <a-select allowClear style="width: 180px" v-model="params.status">
          <a-select-option :value="1"> 已配对 </a-select-option>
          <a-select-option :value="0"> 未配对 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-input-group compact>
          <a-select style="width: 130px" v-model="params.type">
            <a-select-option :value="1"> 商品名称 </a-select-option>
            <a-select-option :value="2"> SPU ID </a-select-option>
            <a-select-option :value="3"> 本地SKU编码 </a-select-option>
          </a-select>
          <a-input style="width: 230px" v-model="params.keyword" />
        </a-input-group>
      </a-form-model-item>
      <a-form-model-item>
        <a-space>
          <a-button @click="reLoadData" type="primary">搜索</a-button>
          <a-button @click="params = { type: 1 }">重置</a-button>
          <a-button :loading="autoMatchLoading" @click="autoMatch">
            自动匹配
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>

    <a-table
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="dataSource"
      rowKey="variationId"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
    >
      <span slot="images" slot-scope="text">
        <img v-lazy="text" style="width: 60px; height: 60px" />
      </span>
      <span slot="storeName" slot-scope="text, record">
        {{ record.countryCode }} / {{ record.storeName }}
      </span>

      <span slot="status" slot-scope="text, record">
        <div class="me-text-center">
          <template v-if="!record.localSku">
            <span>未配对</span>
            <br />
            <span class="me-link" @click="onMatchChange(record)">去配对</span>
          </template>
          <template v-else>
            <span class="me-status-success">已配对</span>
            <br />
            <span class="me-link" @click="onMatchChange(record)">更改</span>
          </template>
        </div>
      </span>
    </a-table>

    <a-modal
      title="更改配对"
      :visible="matchVisible"
      :confirm-loading="matchConfirmLoading"
      destroyOnClose
      width="1400px"
      @ok="onMatchOk"
      @cancel="
        matchVisible = false
        currentGoods = null
      "
    >
      <OnlineSkuMatch @change="onMatchSelect" />
    </a-modal>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import onlineGoodsMixins from './onlineGoodsMixins'
import OnlineSkuMatch from './OnlineSkuMatch.vue'
import Storage from '@/api/storage'

export default {
  components: {
    OnlineSkuMatch
  },
  mixins: [tableMixins, onlineGoodsMixins],
  data() {
    return {
      params: { type: 1 },
      columns: [
        {
          title: '商品主图',
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: 'SPU名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'SPU ID',
          dataIndex: 'itemId',
          key: 'itemId'
        },
        {
          title: 'SKU规格',
          dataIndex: 'variationSku',
          key: 'variationSku'
        },
        {
          title: '站点/店铺',
          dataIndex: 'storeName',
          key: 'storeName',
          scopedSlots: { customRender: 'storeName' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 100
        },
        {
          title: '本地SPU名称',
          dataIndex: 'localVariationName',
          key: 'localVariationName'
        },
        {
          title: '本地SPU编码',
          dataIndex: 'masterSku',
          key: 'masterSku'
        },
        {
          title: '本地SKU编码',
          dataIndex: 'localSku',
          key: 'localSku'
        }
      ],
      autoMatchLoading: false,
      matchVisible: false,
      matchConfirmLoading: false,
      currentGoods: null,
      matchSelectedRowKeys: [],
      matchSelectedRow: []
    }
  },
  methods: {
    getTableData() {
      const { storeId, status, type, keyword } = this.$data.params
      const sitesList = this.$data.sitesList

      const { size, current } = this.$data.paginationData
      const data = {
        size,
        current,
        storeId,
        status,
        countryCodesStr: sitesList.join()
      }
      if (type === 1) {
        data.name = keyword
      } else if (type === 2) {
        data.masterSku = keyword
      } else if (type === 3) {
        data.localSku = keyword
      }
      return Storage.getProductGoods(data)
    },
    /**自动匹配 */
    autoMatch() {
      this.$data.autoMatchLoading = true
      const ids = this.$data.selectedRows.map(({ productId }) => productId)
      Storage.autoMatch(ids)
        .then((res) => {
          this.$message.success(`成功匹配${res.data.success}条数据`)
        })
        .catch(() => {
          this.$message.error('自动匹配失败')
        })
        .finally(() => {
          this.$data.autoMatchLoading = false
        })
    },
    /**匹配 */
    onMatchChange(goods) {
      this.$data.currentGoods = goods
      this.$data.matchVisible = true
    },
    async onMatchOk() {
      const {
        productId,
        itemId,
        variationId,
        variationSku,
        shopeeId
      } = this.$data.currentGoods
      const [{ productVariationsId }] = this.$data.matchSelectedRow
      const data = {
        productId: productId,
        productVariationsId: productVariationsId,
        shopeeId: shopeeId,
        shopeeItemId: itemId,
        shopeeVariationsId: variationId,
        shopeeVariationsSku: variationSku
      }
      await Storage.updateProductPair(data)
      this.$message.success('更改成功')
      this.$data.matchVisible = false
      this.$data.currentGoods = null
      this.loadData()
    },
    /**更改配对选择事件 */
    onMatchSelect(selectedRowKeys, selectedRow) {
      this.$data.matchSelectedRowKeys = selectedRowKeys
      this.$data.matchSelectedRow = selectedRow
    },
    onParamsStoreIdChange() {
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
