<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-space>
        <a-button type="primary" @click="onCreate"> 创建主SKU </a-button>
        <a-button @click="onDelete(selectedRowKeys)"> 批量删除 </a-button>
      </a-space>
      <a-input-search
        class="me-fr"
        style="width: 300px"
        placeholder="本地SPU、商品名称"
        @search="onSearch"
        :enter-button="$t('form.search')"
      />
    </div>

    <div class="me-card">
      <a-table
        rowKey="itemId"
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination"
        :row-selection="rowSelection"
        @change="changePage"
      >
        <span slot="customName">
          <p>{{ $t('masterSku.masterSku') }}</p>
          <p>{{ $t('masterSku.productName') }}</p>
        </span>

        <span slot="name" slot-scope="name, record">
          <div class="me-text-left" style="display: flex">
            <a-popover :title="null" placement="right">
              <template slot="content">
                <img
                  style="width: 200px; height: 200px"
                  v-lazy="record.images[0]"
                />
              </template>
              <img
                style="width: 40px; height: 40px"
                v-lazy="record.images[0]"
                class="me-mr-2"
              />
            </a-popover>
            <div>
              <p>{{ record.itemSku }}</p>
              <p>{{ record.itemName }}</p>
            </div>
          </div>
        </span>

        <span slot="category" slot-scope="category, record">
          {{ getCategorys(record) }}
        </span>

        <span slot="category" slot-scope="category, record">
          {{ getCategorys(record) }}
        </span>

        <span slot="handler" slot-scope="name, record">
          <a-button type="link" @click="onEdit(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-button
            type="link"
            class="me-error"
            @click="onDelete([record.itemId])"
          >
            {{ $t('common.delete') }}
          </a-button>
          <!-- <a-button type="link" @click="onShowInventory(record)">
            {{ $t('masterSku.inventorySKU') }}
          </a-button> -->
        </span>
      </a-table>
    </div>

    <a-modal
      :maskClosable="false"
      :title="$t('masterSku.editMasterSKU')"
      :visible="editVisible"
      :confirm-loading="editConfirmLoading"
      destroyOnClose
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      width="900px"
    >
      <AddEditMasterSku :masterSku="editCurrent" ref="EditMasterSku" />
    </a-modal>
    <a-modal
      :maskClosable="false"
      :title="$t('masterSku.inventorySKU')"
      :visible="storageSkuVisible"
      destroyOnClose
      @ok="storageSkuVisible = false"
      @cancel="storageSkuVisible = false"
      width="900px"
    >
      <ViewStorageSku :masterSku="currentId" />
    </a-modal>

    <a-modal
      :maskClosable="false"
      title="创建主SKU"
      :visible="createVisible"
      :confirm-loading="createConfirmLoading"
      destroyOnClose
      @ok="handleCreateOk"
      @cancel="handleCreateCancel"
      width="900px"
    >
      <AddEditMasterSku ref="CreateMasterSku" />
    </a-modal>
  </div>
</template>

<script>
/**
 * 主SKU
 */
import tableMixins from '@/mixins/tableMixins'
import Product from '@/api/product'

import AddEditMasterSku from './components/AddEditMasterSku'
import ViewStorageSku from './components/ViewStorageSku'
export default {
  mixins: [tableMixins],
  components: {
    AddEditMasterSku,
    ViewStorageSku
  },
  data() {
    return {
      editVisible: false,
      editConfirmLoading: false,
      editCurrent: null,

      createVisible: false,
      createConfirmLoading: false,

      name: '',
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          slots: { title: 'customName' },
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: this.$t('masterSku.productCategory'),
          dataIndex: 'category',
          key: 'category',
          scopedSlots: { customRender: 'category' }
        },
        {
          title: this.$t('masterSku.createTime'),
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          key: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      currentId: '',
      storageSkuVisible: false
    }
  },
  computed: {
    getCategorys() {
      return ({ categoryParent, category }) => {
        console.log(categoryParent, category)
        return [categoryParent, category].filter(Boolean).join(' / ')
      }
    }
  },
  methods: {
    async getTableData() {
      const { name } = this.$data
      const { size, current } = this.$data.paginationData
      const res = await Product.getMasterSkuProduct({
        size,
        current,
        name,
        sku: name
      })
      res.data.records = res.data.records.map((element) => {
        if (element.images) element.images = JSON.parse(element.images)
        return element
      })
      return res
    },
    /**
     * 搜索
     */
    onSearch(value) {
      this.$data.name = value
      this.reLoadData()
    },
    /**
     * 创建主SKU
     */
    onCreate() {
      this.$data.createVisible = true
      this.$data.createConfirmLoading = false
    },
    /**
     * 编辑
     */
    onEdit(record) {
      this.$data.editVisible = true
      this.$data.editConfirmLoading = false
      this.$data.editCurrent = record
    },
    /**
     * 删除
     */
    onDelete(ids) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Product.delMasterSkuProduct(ids)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        }
      })
    },
    /**
     * 本地SKU
     */
    onShowInventory(record) {
      this.$data.storageSkuVisible = true
      this.$data.currentId = record.itemId
    },
    /**
     * 编辑提交
     */
    handleEditOk() {
      this.$data.editConfirmLoading = true
      this.$refs.EditMasterSku.submit()
        .then(() => {
          this.$data.editVisible = false
          this.$data.editCurrent = null
          this.loadData()
          this.$message.success(this.$t('common.handlerSuccess'))
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
      this.$data.editVisible = false
      this.$data.editConfirmLoading = false
      this.$data.editCurrent = null
    },
    /**
     * 创建提交
     */
    handleCreateOk() {
      this.$data.createConfirmLoading = true
      this.$refs.CreateMasterSku.submit()
        .then(() => {
          this.$message.success('创建成功')
          this.$data.createVisible = false
          this.loadData()
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
