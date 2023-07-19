<template>
  <div class="product-list">
    <!--   <SearchForm :search-form='searchForm' ></SearchForm>-->
    <SearchForm
      :form-item-list="searchForm"
      :init-data="searchFormDefault"
      :form="baseForm"
      @submit="submit"
      @handleReset="handleReset"
    ></SearchForm>

    <a-space class="me-mb-2 titleButton">
      <a-button type="primary" @click="synchronizeStore">
        同步海外仓SKU与库存信息
      </a-button>
    </a-space>

    <a-table
      :columns="columns"
      :row-key="(record, index) => index"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      style=""
      class="table"
    >
      <template slot="image" slot-scope="text, record">
        <a-popover :title="null" placement="right">
          <template slot="content">
            <img v-lazy="record.image" style="width: 200px; height: 200px" />
          </template>
          <img
            v-lazy="record.image"
            style="width: 40px; height: 40px; border-radius: 2px"
            class="me-mr-2"
          />
        </a-popover>
        <!--        <img class='image'-->
        <!--                                                            :src='record.image'-->
        <!--      />-->
        <!--        <img class='image'-->
        <!--                                                            src='http://woms.ruantongbao.com/upload/sku_image/20210626/d432633605a14a0f8b88da581dddd550.jpg'-->
        <!--      />-->
      </template>
      <template slot="storeName" slot-scope="text, record">
        <div class="storeName">
          <span>{{ record.sku }}</span>
          <span v-if="record.variationSku != null"
            >{{ record.variationSku }}
            <a-icon type="edit" @click="editSku(record, 'edit')"/>
            <a-icon type="delete" @click="deleteSku(record)"
          /></span>
          <a v-else @click="editSku(record, 'add')">配对</a>

          <span>{{ record.skuName }}</span>
          <span>{{ record.serviceProviderName }}-{{ record.storeName }}</span>
        </div>
      </template>
    </a-table>

    <a-modal :visible="ImgModal.showImageModal">
      <div class="modalImg">
        <img :src="ImgModal.src" />
      </div>
    </a-modal>
    <OverseasTableModal
      :show-modal="showTableModal"
      :sea-system-id="seaSystemId"
      @close="closeTableModal"
      @ok="pairStore"
    ></OverseasTableModal>
  </div>
</template>
<script>
import SearchForm from '../package/components/SearchForm/SearchForm'
import Package from '@/api/package'
import OverseasTableModal from './components/ProductList/OverseasTableModal'
const columns = [
  {
    title: '商品图',
    dataIndex: 'image',
    scopedSlots: { customRender: 'image' }
  },
  {
    title: '海外仓SKU/SKU/产品名称/仓库',
    dataIndex: 'storeName',
    scopedSlots: { customRender: 'storeName' }
  },
  {
    title: '库存总数',
    dataIndex: 'stock'
  },
  {
    title: '在途库存',
    dataIndex: 'watStock'
  },
  {
    title: '采购成本',
    dataIndex: 'purchaseCost'
  },
  {
    title: '重量',
    dataIndex: 'weight'
  }
]
const formItems = [
  {
    label: '海外仓',
    dataIndex: 'hawc'
  }
]
const searchFormDefault = {
  seaSystemId: '',
  seaStoreId: '',
  pairType: '',
  sku: '',
  skuName: ''
}

export default {
  components: { OverseasTableModal, SearchForm },
  data() {
    return {
      ImgModal: {
        showImageModal: false,
        src: ''
      },
      showTableModal: false,
      modalImg: [],
      tableData: [],
      pagination: {
        pageSize: 20,
        current: 1,
        total: 20
      },
      loading: false,
      columns,
      searchData: [],
      searchListIndex: 0,
      //服务商
      providerList: [],
      //仓库
      warehouseList: [],
      //搜索框默认值
      searchFormDefault,
      baseForm: {},
      seaSystemId: null,
      seaSkuId: null,
      recordItem: {},
      editSkuType: 'add'
    }
  },

  computed: {
    /**
     *   搜索栏初始化
     *
     */
    searchForm() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.providerList = this.searchData.map((item) => {
        return {
          name: item.serviceProviderName,
          id: item.seaSystemId
        }
      })

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.warehouseList = this.getWashHouse()
      const defaultSpan = 6
      return [
        {
          label: '服务商',
          dataIndex: 'seaSystemId',
          type: 'a-select',
          span: defaultSpan,
          data: this.providerList,
          default: 6,
          change: (id) => {
            this.searchData.map((item, index) => {
              if (item.seaSystemId == id) {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.searchListIndex = index
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.baseForm['seaStoreId'] = this.warehouseList[
                  this.searchListIndex
                ][0].id
                // this.formItems=this.getSearchForm();
              }
            })
          }
        },
        {
          label: '仓库名称',
          dataIndex: 'seaStoreId',
          type: 'a-select',
          span: defaultSpan,
          data: this.warehouseList[this.searchListIndex],
          change: (id) => {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.baseForm['seaStoreId'] = id
          }
        },
        {
          label: '配对状态',
          dataIndex: 'pairType',
          span: defaultSpan,
          type: 'a-select',
          default: 0,
          data: [
            {
              name: '未配对',
              id: 0
            },
            {
              name: '已配对',
              id: 1
            }
          ]
        },
        {
          default: 0,
          label: '海外仓SKU',
          dataIndex: 'sku',
          span: defaultSpan
        },

        {
          default: 0,
          label: '商品名称',
          dataIndex: 'skuName',
          span: defaultSpan
        }
      ]
    }
  },
  mounted() {
    this.getProvier()
  },
  methods: {
    /**
     *   配对
     * @param rowItem  选中 本地SKU
     */
    pairStore(variationSku) {
      const params = {
        seaSkuId: this.seaSkuId,
        seaSystemId: this.seaSystemId,
        variationSku: variationSku
      }
      const index = this.tableData.indexOf(this.recordItem)
      const newData = [...this.tableData]

      let res = Package.manualPaired(params)
      if (this.editSkuType == 'edit') {
        res = Package.modifyPaired(params)
      }
      res.then(() => {
        newData[index].variationSku = variationSku
        this.tableData = newData
        this.showTableModal = false
      })
    },
    /**
     *   编辑SKU
     * @param record 表格当行数据
     */
    editSku(record, type) {
      this.editSkuType = type
      this.recordItem = record
      this.seaSystemId = record.seaSystemId
      this.seaSkuId = record.seaSkuId
      this.showTableModal = true
    },
    /**
     *   删除SKU
     * @param record 表格当行数据
     */
    deleteSku(record) {
      const index = this.tableData.indexOf(record)
      const newData = [...this.tableData]
      newData[index].variationSku = null
      const params = {
        seaSkuId: record.seaSkuId,
        seaSystemId: record.seaSystemId,
        variationSku: record.variationSku
      }
      Package.unPaired(params).then((res) => {
        this.tableData = newData
      })
    },
    /**
     *   关闭配对对话框
     * @param item
     */
    closeTableModal(item) {
      this.showTableModal = false
    },
    /**
     *   搜索
     * @param form  搜索参数
     */

    submit(form) {
      this.fetch(form)
    },
    /**
     * 搜索栏重置按钮
     * @param
     */
    handleReset() {
      this.baseForm = {}
      this.baseForm = { ...this.searchFormDefault }
    },
    showImage(url) {
      this.ImgModal.showImageModal = true
      this.ImgModal.src = url
    },
    /**
     *  获取仓库列表
     */
    getWashHouse() {
      let list = []
      if (this.searchData.length > 0) {
        for (var i = 0; i < this.searchData.length; i++) {
          let temp = this.searchData[this.searchListIndex].overSeasStores.map(
            (item) => {
              return {
                name: item.name,
                id: item.seaStoreId
              }
            }
          )
          list.push(temp)
        }
      }
      return list
    },
    /**
     * 同步海外仓
     * @param item
     */
    synchronizeStore() {
      //console.log(this.baseForm)
      if (!this.baseForm.seaSystemId) {
        this.$message.error(this.$t('storage.serviceEmptyTips'))
        return false
      }
      this.$message.success(this.$t('storage.synchronizeStoreTips'))
      const params = {
        seaSystemId: this.baseForm.seaSystemId,
        seaStoreId: this.baseForm.seaStoreId
      }
      Package.synchronizeSkuStock(params).then((res) => {
        this.fetch(params)
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.fetch({})
    },
    /**
     *  获取服务商列表
     */
    getProvier() {
      Package.getAuthorizationSystemList()
        .then((res) => {
          this.$nextTick(function() {
            // console.log(res)
            this.searchData = res.data
            this.searchFormDefault['seaSystemId'] = res.data[0]?.seaSystemId
            this.searchFormDefault['seaStoreId'] =
              res.data[0]?.overSeasStores[0]?.seaStoreId
            this.baseForm = { ...this.searchFormDefault }
          })
          const parmas = { seaSystemId: res.data[0]?.seaSystemId }
          this.fetch(parmas)
        })
        .catch((reason) => {
          //this.$message.error(reason)
        })
    },

    /**
     * 获取表格数据
     * @param item
     */
    fetch(item = {}) {
      if (!item.seaSystemId) {
        this.$message.error(this.$t('storage.serviceEmptyTips'))
        return false
      }
      this.loading = true
      const params = {
        current: this.pagination.current,
        size: this.pagination.pageSize,
        ...item
      }
      Package.getSeaStockList(params)
        .then((res) => {
          this.tableData = res.data.records
          this.loading = false
        })
        .catch((reason) => {
          this.loading = false
          //this.$message.error(reason)
        })
    }
  }
}
</script>
<style scoped lang="less">
.titleButton {
  margin: 10px;
}

.product-list {
  .table {
    background-color: #fff;
    margin: 10px;

    .image {
      width: 5rem;
      height: 5rem;
    }

    .storeName {
      span:first-child {
        font-weight: bold;
      }

      display: flex;
      flex-direction: column;
    }
  }
}

.modalImg {
  display: flex;
  justify-items: center;
  align-items: center;
  width: 100%;

  img {
    text-align: center;
    width: 15rem;
    height: 15rem;
  }
}
</style>
