<template>
  <div class="me-pa-2">
    <div class="me-card clearfloat">
      <a-button class="me-fr" type="primary" @click="addStorage">
        {{ $t('storage.addBtn') }}
      </a-button>
    </div>

    <!-- 仓库列表 -->
    <div class="me-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="storageId"
        :pagination="getPagination"
        @change="changePage"
        :loading="tableLoading"
      >
        <template slot="inventoryTotal" slot-scope="text, record">
          {{ record.inventoryTotal }}
          <a-button type="link" @click="inventoryDetails(record)">
            {{ $t('storage.inventoryDetails') }}
          </a-button>
        </template>
        <template slot="defaultStorage" slot-scope="text, record">
          <a-checkbox
            :checked="record.defaultStorage"
            @change="defaultStorageChange(record)"
          ></a-checkbox>
        </template>

        <template slot="handler" slot-scope="text, record">
          <a-button type="link" class="me-pa-1" @click="editStorage(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" class="me-pa-1" @click="shelfModal(record)">
            {{ $t('storage.shelves') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            v-if="!record.inventoryTotal > 0"
            type="link"
            class="me-pa-1 me-error"
            @click="delStorage(record)"
          >
            {{ $t('common.delete') }}
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 新增修改仓库-->
    <a-modal
      :title="isAdd ? $t('storage.addBtn') : $t('storage.editBtn')"
      :visible="storageVisible"
      :ok-text="$t('common.submit')"
      :confirm-loading="confirmLoading"
      @ok="storageOk"
      @cancel="handleCancel('storageVisible')"
      :maskClosable="false"
    >
      <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-form-item :label="$t('storage.sname')">
          <a-input
            v-decorator="[
              'storageName',
              {
                rules: [{ required: true, message: $t('storage.inName') }]
              }
            ]"
            :maxLength='100'
          />
        </a-form-item>
        <a-form-item :label="$t('storage.name')">
          <a-input v-decorator="['contacts']" :maxLength='50'/>
        </a-form-item>
        <a-form-item :label="$t('storage.phone')">
          <a-input v-decorator="['phone']" :maxLength='50'/>
        </a-form-item>
        <a-form-item :label="$t('storage.address')">
          <a-input v-decorator="['storageAddress']" :maxLength='200'/>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 货架弹窗-->
    <a-modal
      :title="$t('storage.shelfManage')"
      :visible="shelfVisible"
      :footer="null"
      :confirm-loading="confirmLoading"
      width="900px"
      destroyOnClose
      @cancel="shelfCancel('shelfVisible')"
      :maskClosable="false"
    >
      <ShowShelfTable
        :currentStorage="{ storageId: rowId }"
        :shelfCancel="shelfCancel"
      />
    </a-modal>
  </div>
</template>

<script>
/**
 * 仓库列表
 */
// import AddEditStorage from './components/AddEditStorage'
import ShowShelfTable from './components/ShowShelfTable'
// import Pagination from '@/components/Pagination'
import Storage from '@/api/storage'
import tableMixins from '@/mixins/tableMixins'

export default {
  mixins: [tableMixins],
  components: {
    // AddEditStorage,
    ShowShelfTable
    // Pagination
  },
  data() {
    return {
      storageName: '',
      name: '',
      phone: '',
      storageAddress: '',
      isAdd: true,
      rowId: '',
      form: this.$form.createForm(this),
      storageVisible: false,
      shelfVisible: false,
      confirmLoading: false,
      columns: [
        {
          title: this.$t('common.index'),
          dataIndex: 'index',
          key: 'index',
          customRender: (text, record, index) => `${index + 1}`
        },
        {
          title: this.$t('storage.sname'),
          dataIndex: 'storageName',
          key: 'storageName',
          width:200,
          ellipsis: true,
        },
        {
          title: this.$t('storage.shelvesNum'),
          dataIndex: 'shelves',
          key: 'shelves'
        },
        {
          title: this.$t('storage.inventoryType'),
          dataIndex: 'inventoryType',
          key: 'inventoryType'
        },
        {
          title: this.$t('storage.inventoryTotal'),
          dataIndex: 'inventoryTotal',
          key: 'inventoryTotal',
          scopedSlots: { customRender: 'inventoryTotal' }
        },
        {
          title: this.$t('storage.inventoryValue'),
          dataIndex: 'inventoryValue',
          key: 'inventoryValue'
        },
        {
          title: this.$t('storage.transitValue'),
          dataIndex: 'onTheWayValue',
          key: 'onTheWayValue'
        },
        {
          title: this.$t('storage.warehouseDefault'),
          dataIndex: 'defaultStorage',
          key: 'defaultStorage',
          scopedSlots: { customRender: 'defaultStorage' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ]
    }
  },
  // mounted:{

  // },
  methods: {
    //获取仓库列表
    getTableData() {
      return Storage.getStorage({ ...this.$data.paginationData })
    },
    //删除仓库
    delStorage(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res = await Storage.delStorage({ storageId: row.storageId })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            this.loadData('delete')
          } else {
            this.$Message({ type: 'error', content: `${message}` })
          }
        }
      })
    },
    //添加仓库
    addStorage() {
      this.$data.form.resetFields()
      this.$data.isAdd = true
      this.$data.storageVisible = true
      this.$data.confirmLoading = false
    },
    //编辑仓库
    editStorage(row) {
      this.$data.form.resetFields()
      this.$data.isAdd = false
      this.$data.storageVisible = true
      this.$data.confirmLoading = false
      this.$data.rowId = row.storageId
      this.$nextTick(() => {
        this.$data.form.setFieldsValue({
          storageName: row.storageName,
          contacts: row.contacts,
          phone: row.phone,
          storageAddress: row.storageAddress
        })
      })
    },
    //确认新增编辑
    storageOk(e) {
      e.preventDefault()
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let res
          this.$data.confirmLoading = true
          if (this.$data.isAdd) {
            res = await Storage.addStorage(values)
          } else {
            values.storageId = this.$data.rowId
            res = await Storage.editStorage(values)
          }
          this.$data.confirmLoading = false
          console.log(this.$data.confirmLoading)
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$data.isAdd? this.$t('common.addSuccess'):this.$t('common.editSuccess')
            })
            this.$data.storageVisible = false
            this.loadData()
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    },
    //取消新增编辑
    handleCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    //关闭货架弹窗
    shelfCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
      this.loadData()
    },
    //修改默认仓库
    async defaultStorageChange(row) {
      let res = await Storage.setDefaultStorage({
        defaultStorage: row.defaultStorage ? 0 : 1,
        storageId: row.storageId
      })
      if (res.code === 0) {
        this.$Message({
          type: 'success',
          content: this.$t('common.handlerSuccess')
        })
        this.loadData()
      } else {
        this.$Message({ type: 'error', content: `${res.message}` })
      }
    },
    //货架弹窗
    shelfModal(row) {
      this.$data.rowId = row.storageId
      this.$data.shelfVisible = true
    },
    //库存明细
    inventoryDetails(row) {
      this.$router.push({
        path: '/storage/stock-details',
        query: { storageId: row.storageId }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
