<template>
  <div class="me-pa-2">
    <div class="me-card">
      <!-- <a-button @click="batchPush" type="primary">
        {{ $t('storageSku.batchPush') }}
      </a-button> -->

      <a-space>
        <!-- <a-button type="primary" @click="onMergeSku"> 合并SKU </a-button> -->
        <a-button
          :disabled="!selectedRowKeys.length"
          @click="onDelete(selectedRowKeys)"
        >
          批量删除
        </a-button>
        <a-button type="primary" @click="onCreateLocalSku">
          创建本地SKU
        </a-button>
      </a-space>

      <a-input-search
        style="width: 300px"
        class="me-fr"
        placeholder="本地SKU、商品名称"
        :enter-button="$t('form.search')"
        @search="onSearch"
      />
    </div>

    <div class="me-card">
      <a-table
        rowKey="variationsId"
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
      >
        <span slot="images" slot-scope="text">
          <img :src="text && text[0]" style="width: 50px; height: 50px" />
        </span>

        <span slot="options" slot-scope="text, record">
          <a-button type="link" @click="onEdit(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-button
            type="link"
            @click="onDelete([record.variationsId])"
            class="me-error"
          >
            {{ $t('common.delete') }}
          </a-button>
        </span>
      </a-table>
    </div>

    <a-modal
      :maskClosable="false"
      :title="$t('storageSku.editStockSKU')"
      width="1100px"
      destroyOnClose
      :visible="editVisible"
      :confirm-loading="editConfirmLoading"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <EditStorageSku ref="EditStorageSku" :stockSku="current" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      title="创建本地SKU"
      width="1100px"
      destroyOnClose
      :visible="createVisible"
      :confirm-loading="createConfirmLoading"
      @ok="handleCreateOk"
      @cancel="handleCreateCancel"
    >
      <EditStorageSku ref="CreateStorageSku" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      title="本地合并SKU"
      destroyOnClose
      :visible="mergeVisible"
      :confirm-loading="mergeConfirmLoading"
      @ok="handleMergeOk"
      @cancel="handleMergeCancel"
    >
      <MergeSku ref="MergeSku" />
    </a-modal>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Product from '@/api/product'
import EditStorageSku from './components/EditStorageSku'
import MergeSku from './components/MergeSku'
import { mapState } from 'vuex'
import { objectToUrlParams } from '@/util/handle'

export default {
  components: { EditStorageSku, MergeSku },
  mixins: [tableMixins],
  data() {
    return {
      name: '',
      innerColumns: [
        { title: this.$t('storageSku.storageName'), dataIndex: 'storageName' },
        { title: this.$t('storageSku.stock'), dataIndex: 'stock' },
        { title: this.$t('storageSku.stockAlter'), dataIndex: 'stockAlter' },
        {
          title: this.$t('storageSku.stockAlertDays'),
          dataIndex: 'stockAlertDays'
        },
        { title: this.$t('storageSku.cost'), dataIndex: 'cost' },
        { title: this.$t('storageSku.purchaseMin'), dataIndex: 'purchaseMin' },
        { title: this.$t('storageSku.purchaseMax'), dataIndex: 'purchaseMax' }
      ],
      columns: [
        {
          dataIndex: 'images',
          key: 'images',
          title: '商品主图',
          scopedSlots: { customRender: 'images' }
        },
        {
          dataIndex: 'name',
          key: 'name',
          title: '本地SKU中文名'
        },
        {
          dataIndex: 'variationSku',
          key: 'variationSku',
          title: '本地SKU编码'
        },
        {
          dataIndex: 'stock',
          key: 'stock',
          title: '库存总量'
        },
        {
          dataIndex: 'supplierName',
          key: 'supplierName',
          title: '供应商'
        },
        {
          title: this.$t('storageSku.handler'),
          dataIndex: 'options',
          scopedSlots: { customRender: 'options' }
        }
      ],
      editVisible: false,
      editConfirmLoading: false,

      createVisible: false,
      createConfirmLoading: false,

      mergeVisible: false,
      mergeConfirmLoading: false
    }
  },
  computed: {
    ...mapState(['auth']),
    getBrandStatus() {
      return ({ status }) => {
        if (status == 1) return this.$t('storageSku.normal')
        if (status == 2) return this.$t('storageSku.stop')
      }
    },
    getSalesSet() {
      return ({ salesSeven, salesTwentyEight, fortyTwo }) => {
        if (salesSeven === null) salesSeven = 0
        if (salesTwentyEight === null) salesTwentyEight = 0
        if (fortyTwo === null) fortyTwo = 0
        return `(${salesSeven}/${salesTwentyEight}/${fortyTwo})`
      }
    }
  },
  methods: {
    customExpandIcon(props) {
      if (props.expanded) {
        return (
          <a-icon
            class="expand-icon me-link"
            onClick={(e) => props.onExpand(props.record, e)}
            type="minus"
          />
        )
      } else {
        return (
          <a-icon
            class="expand-icon me-link"
            onClick={(e) => props.onExpand(props.record, e)}
            type="plus"
          />
        )
      }
    },
    async getTableData() {
      const { name } = this.$data
      const { size, current } = this.$data.paginationData
      const res = await Product.getProductStockSku({
        size,
        current,
        name,
        sku: name
      })
      res.data.records = res.data.records.map((element) => {
        if (element.images) {
          try {
            element.images = JSON.parse(element.images)
          } catch (error) {
            console.error(error)
          }
        } else {
          element.images = []
        }
        return element
      })
      return res
    },
    onSearch(value) {
      this.$data.name = value
      this.reLoadData()
    },
    /**
     * 编辑
     */
    onEdit(record) {
      this.$data.current = record
      this.$data.editVisible = true
      this.$data.editConfirmLoading = false
    },
    /**
     * 删除
     */
    onDelete(variationsIds) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Product.delProductStocksku({ variationsIds })
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData('delete')
        }
      })
    },
    /**
     * 加入采购计划
     */
    onPush(record) {
      const token = this.$store.getters.getAccessToken
      const memberid = this.auth.userInfo.memberId
      const memberno = this.auth.userInfo.memberNO
      const sku = record.variationSku
      const skuid = record.variationsId
      const goodsurl = record.images[0]
      let storageid = ''
      if (record.storageDetailDTOList && record.storageDetailDTOList[0]) {
        storageid = record.storageDetailDTOList[0].storageId
      }

      const maaccount = this.$store.state.auth.userInfo.maAccount

      const paramsStr = objectToUrlParams({
        token,
        memberid,
        // memberno,
        maaccount,
        sku,
        skuid,
        goodsurl,
        storageid
      })
      this.openPage(`${process.env.VUE_APP_WMS_URL}/autologin?${paramsStr}`)
    },
    /**
     * 批量加入采购计划
     */
    batchPush() {},
    /**
     * 编辑提交
     */
    handleEditOk() {
      this.$data.editConfirmLoading = true
      this.$refs.EditStorageSku.submit()
        .then(() => {
          this.$data.current = null
          this.$data.editVisible = false
          this.loadData()
        })
        .catch(() => {})
        .finally(() => {
          this.$data.editConfirmLoading = false
        })
    },
    /**
     * 编辑取消
     */
    handleEditCancel() {
      this.$data.current = null
      this.$data.editVisible = false
      this.$data.editConfirmLoading = false
    },
    /**
     * 创建本地SKU
     */
    onCreateLocalSku() {
      this.$data.createVisible = true
      this.$data.createConfirmLoading = false
    },
    /**
     * 创建OK
     */
    handleCreateOk() {
      // this.$data.createConfirmLoading = true
      this.$refs.CreateStorageSku.submit()
        .then((res) => {
          if (res) {
            this.$message.success('添加成功')
            this.$data.createVisible = false
            this.loadData()
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.$data.createConfirmLoading = false
        })
    },
    /**
     * 创建取消
     */
    handleCreateCancel() {
      this.$data.createVisible = false
      this.$data.createConfirmLoading = false
    },
    /**
     * 合并SKU
     */
    onMergeSku() {
      this.$data.mergeVisible = true
      this.$data.mergeConfirmLoading = false
    },
    /**
     * 合并SKU提交
     */
    handleMergeOk() {
      this.$refs.MergeSku.onSubmit()
        .then(() => {
          this.$data.mergeVisible = false
          this.$message.success('合并成功')
          this.loadData()
        })
        .finally(() => {
          this.$data.mergeConfirmLoading = false
        })
    },
    /**
     * 合并SKU取消
     */
    handleMergeCancel() {
      this.$data.mergeVisible = false
      this.$data.mergeConfirmLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.me-custorm-name {
  display: flex;
}
</style>

<style lang="scss">
.stock-sku-master-table {
  .expand-icon {
    transform: translate(50px, 20px);
  }
}
</style>
