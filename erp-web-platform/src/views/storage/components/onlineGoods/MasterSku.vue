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

    <div>
      <span class="sku-label">店铺</span>
      <a-select
        class="me-mr-4"
        style="width: 150px"
        v-model="params.storeId"
        allowClear
      >
        <a-select-option
          v-for="item in currentStore"
          :value="item.storeId"
          :key="item.storeId"
        >
          {{ item.storeName }}
        </a-select-option>
      </a-select>

      <span class="sku-label">配对状态</span>
      <a-select
        allowClear
        class="me-mr-4"
        style="width: 100px"
        v-model="params.status"
      >
        <a-select-option :value="1"> 已配对 </a-select-option>
        <a-select-option :value="0"> 未配对 </a-select-option>
      </a-select>

      <span class="me-ib" style="vertical-align: bottom; width: 600px">
        <a-input-group compact>
          <a-select v-model="params.searchType" style="width: 100px">
            <a-select-option :value="1"> 商品名称 </a-select-option>
            <a-select-option :value="2"> 主SKU </a-select-option>
            <a-select-option :value="3"> 本地SKU </a-select-option>
          </a-select>
          <a-input-search
            v-model="params.keyword"
            style="width: 50%"
            class="me-ib"
            @search="reLoadData"
          >
            <a-button slot="enterButton" type="primary"> 搜索 </a-button>
          </a-input-search>
        </a-input-group>
      </span>
    </div>

    <div class="me-mt-3 me-mb-3">
      <a-space>
        <a-button type="primary" @click="importVisible = true">
          批量导入配对
        </a-button>
        <a-button type="primary" @click="onProfit"> 预估利润 </a-button>
      </a-space>
      <a-button type="primary" class="me-fr" @click="onExport">
        导出商品
      </a-button>
    </div>

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
        <img v-lazy="text[0]" style="width: 60px; height: 60px" />
      </span>

      <span slot="price" slot-scope="text, record">
        {{ record.currency }}:<span>{{ record.price }}</span>
        <br />
        RMB:<span>{{ record.rmbPrice }}</span>
      </span>

      <span slot="itemId" slot-scope="text, record">
        <a class="me-link">{{ record.itemId }}</a>
      </span>

      <span slot="masterSku" slot-scope="text, record">
        <a class="me-link">{{ record.masterSku }}</a>
      </span>

      <span slot="localSku" slot-scope="text, record">
        <a class="me-link">{{ record.localSku }}</a>
      </span>

      <span slot="status" slot-scope="text, record">
        <a class="me-link">
          <template v-if="!record.localSku"> 未配对 </template>
          <template v-else> 已配对 </template>
        </a>
      </span>

      <span slot="actions" slot-scope="text, record">
        <template v-if="!record.localSku">
          <a
            class="me-link"
            @click="
              pairVisible = true
              pairInfoData = record
            "
          >
            配对
          </a>
        </template>
        <template v-else>
          <a
            class="me-link"
            @click="
              pairVisible = true
              pairInfoData = record
            "
          >
            更换配对
          </a>
        </template>
      </span>
    </a-table>

    <!-- 配对 -->
    <a-modal
      :title="'商品配对'"
      :visible="pairVisible"
      :confirm-loading="pairConfirmLoading"
      destroyOnClose
      @ok="onPairOk"
      @cancel="onPairCancel"
      width="700px"
      okText="配对"
    >
      <PairStorageSkuList ref="pairStorageSkuList" />
    </a-modal>

    <!-- 导入文件 -->
    <a-modal
      :title="'excel导入'"
      :visible="importVisible"
      :confirm-loading="importConfirmLoading"
      destroyOnClose
      @ok="onImportOk"
      @cancel="onImportCancel"
      width="500px"
    >
      <ImportExcel ref="importExcel" />
    </a-modal>

    <!-- 预估利润 -->
    <a-modal
      :title="'预估利润'"
      :visible="profitVisible"
      :confirm-loading="profitConfirmLoading"
      destroyOnClose
      @ok="onProfitOk"
      @cancel="onProfitCancel"
      :bodyStyle="{ padding: '10px 24px 30px' }"
      width="650px"
    >
      <SetPriceTemplate
        ref="setPriceTemplate"
        :list="selectedRows"
        :isOnlyShowTem="true"
      />
    </a-modal>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import onlineGoodsMixins from './onlineGoodsMixins'
import Storage from '@/api/storage'
import PairStorageSkuList from '../PairStorageSkuList'
import ImportExcel from '../ImportExcel'
import SetPriceTemplate from '@/views/goods/components/setPriceTemplate/SetPriceTemplate'
import { cloneDeep } from 'lodash'

export default {
  components: {
    PairStorageSkuList,
    ImportExcel,
    SetPriceTemplate
  },
  mixins: [tableMixins, onlineGoodsMixins],
  data() {
    return {
      params: {
        type: 0,
        status: null,
        searchType: 1
      },
      columns: [
        {
          title: '缩略图',
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: '售价',
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: 'item ID',
          dataIndex: 'itemId',
          key: 'itemId',
          scopedSlots: { customRender: 'itemId' }
        },
        {
          title: '商品标题',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'item sku',
          dataIndex: 'itemSku',
          key: 'itemSku'
        },
        {
          title: '主SKU',
          dataIndex: 'masterSku',
          key: 'masterSku',
          scopedSlots: { customRender: 'masterSku' }
        },
        {
          title: '匹配本地SKU',
          dataIndex: 'localSku',
          key: 'localSku',
          scopedSlots: { customRender: 'localSku' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '预估利润',
          dataIndex: 'anticipated_profit_cny',
          key: 'anticipated_profit_cny'
        },
        {
          title: '预估利润率',
          dataIndex: 'anticipated_profit_rate',
          key: 'anticipated_profit_rate'
        },
        {
          title: '站点',
          dataIndex: 'countryCode',
          key: 'countryCode'
        },
        {
          title: '店铺',
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: '操作',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  methods: {
    async getTableData() {
      const params = cloneDeep(this.$data.params)
      /**商品名称 */
      if (params.searchType === 1) params.name = params.keyword
      /**主SKU */
      if (params.searchType === 2) params.masterSku = params.keyword
      /**本地SKU */
      if (params.searchType === 3) params.localSku = params.keyword

      if (!params.name) params.name = undefined
      if (!params.masterSku) params.masterSku = undefined
      if (!params.localSku) params.localSku = undefined
      const { size, current } = this.$data.paginationData
      const res = await Storage.getProductGoods({ size, current, ...params })
      res.data.records = res.data.records.map((item) => {
        if (item.images) {
          item.images = JSON.parse(item.images)
        }
        return item
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
