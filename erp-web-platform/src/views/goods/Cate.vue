<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="商品分类"> </a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-page-search">
        <a-form layout="inline" :form="form">
          <a-form-item :label="$t('cate.title')">
            <a-input
              v-decorator="['shopCategoryName']"
              :placeholder="$t('edit.placeInput')"
            >
            </a-input>
          </a-form-item>
          <StoreSelect />
          <a-form-item class="me-mr-3">
            <a-button @click="onSearch" type="primary">
              {{ $t('form.search') }}
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="onReset">{{ $t('form.reset') }}</a-button>
          </a-form-item>
        </a-form>
      </div>

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button
            :loading="asyncBatchLoading"
            @click="asyncCategory"
            type="primary"
          >
            {{ $t('cate.async') }}
          </a-button>
          <a-button @click="onCreate">
            {{ $t('cate.create') }}
          </a-button>
          <a-button :loading="asyncStartLoading" @click="batchStart">
            {{ $t('cate.start') }}
          </a-button>
          <a-button :loading="asyncStopLoading" @click="batchStop">
            {{ $t('cate.stop') }}
          </a-button>
          <a-button @click="batchDelete">
            {{ $t('cate.delete') }}
          </a-button>
        </a-space>
      </a-affix>

      <div>
        <a-table
          rowKey="shopCategoryId"
          :loading="tableLoading"
          :columns="columns"
          :data-source="dataSource"
          :pagination="getPagination"
          :row-selection="rowSelection"
          @change="changePage"
        >
          <span slot="statusSlot" slot-scope="text, record">
            {{ formatStatus(record.status) }}
          </span>
          <span slot="operate" slot-scope="text, record">
            <a-button type="link" @click="onEdit(record)">
              {{ $t('common.edit') }}
            </a-button>
            <a-divider type="vertical" />
            <a-button type="link" class="me-error" @click="onDelete(record)">
              {{ $t('common.delete') }}
            </a-button>
          </span>
        </a-table>
      </div>
    </a-layout>
    <a-modal
      :title="getModalTitle"
      :visible="addEditVisible"
      :confirm-loading="addEditConfirmLoading"
      :maskClosable="false"
      destroyOnClose
      width="1200px"
      @ok="onOk"
      @cancel="onCancel"
    >
      <AddEditCate ref="cate-model" :type="modelType" :source="current" />
    </a-modal>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import tableMixins from '@/mixins/tableMixins'
import AddEditCate from './components/AddEditCate'
import StoreSelect from '@/components/StoreSelect'
export default {
  mixins: [tableMixins],
  components: { AddEditCate, StoreSelect },
  data() {
    return {
      form: this.$form.createForm(this),
      param: {},
      storeList: [],
      columns: [
        {
          title: this.$t('cate.name'),
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: this.$t('cate.storeName'),
          dataIndex: 'storeName',
          key: 'storeName'
        },
        {
          title: this.$t('cate.productCount'),
          dataIndex: 'productCount',
          key: 'productCount'
        },
        {
          title: this.$t('cate.statusSlot'),
          dataIndex: 'statusSlot',
          key: 'statusSlot',
          scopedSlots: { customRender: 'statusSlot' }
        },
        {
          title: this.$t('cate.sortWeight'),
          dataIndex: 'sortWeight',
          key: 'sortWeight'
        },
        {
          title: this.$t('cate.operate'),
          dataIndex: 'operate',
          key: 'operate',
          scopedSlots: { customRender: 'operate' }
        }
      ],

      addEditVisible: false,
      addEditConfirmLoading: false,
      modelType: 'append',
      asyncBatchLoading: false,
      asyncStartLoading: false,
      asyncStopLoading: false
    }
  },
  computed: {
    formatStatus() {
      const StatusOpts = {
        NORMAL: this.$t('cate.on'),
        INACTIVE: this.$t('cate.off')
      }
      return (val) => StatusOpts[val]
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getModalTitle() {
      const { modelType, current } = this.$data

      if (modelType === 'append') {
        return this.$t('cate.append')
      } else {
        if (current) {
          const { name } = current
          return `${this.$t('cate.update')} ${name}`
        }
      }
    }
  },
  mounted() {},
  methods: {
    getTableData() {
      const { param } = this.$data
      param.storeId = param.storeId ? param.storeId[1] : null
      const { size, current } = this.$data.paginationData
      return Goods.handleGetCateShop({ size, current, ...param })
    },
    /**
     * 创建
     */
    onCreate() {
      this.$data.addEditVisible = true
      this.$data.addEditConfirmLoading = false
      this.$data.modelType = 'append'
      this.$data.current = null
    },
    /**
     * 编辑
     */
    onEdit(source) {
      this.$data.addEditVisible = true
      this.$data.addEditConfirmLoading = false
      this.$data.modelType = 'edit'
      this.$data.current = source
    },
    /**
     * 删除
     */
    onDelete(source) {
      this.onSelectChange([source.shopCategoryId], [source])
      this.batchDelete()
    },
    /**
     * 搜索
     */
    onSearch() {
      this.$data.form.validateFields().then((data) => {
        this.$data.param = data
        this.reLoadData()
      })
    },
    /**
     * 重置
     */
    onReset() {
      this.$data.form.resetFields()
      this.onSearch()
    },
    /**
     * 新增或修改提交
     */
    onOk() {
      this.$data.addEditConfirmLoading = true
      this.$refs['cate-model']
        .submit()
        .then(() => {
          this.$data.addEditVisible = false
          this.$data.modelType = 'append'
          this.$data.current = null
          this.reLoadData()
        })
        .finally(() => {
          this.$data.addEditConfirmLoading = false
        })
    },
    /**
     * 新增或修改取消
     */
    onCancel() {
      this.$data.addEditConfirmLoading = false
      this.$data.addEditVisible = false
      this.$data.modelType = 'edit'
      this.$data.current = null
    },
    /**
     * 批量启用
     */
    batchStart() {
      const { selectedRowKeys } = this.$data
      if (selectedRowKeys.length == 0) {
        this.$message.error(this.$t('cate.batchStartError'))
        return
      }
      this.$data.asyncStartLoading = true
      this.batchAction(1)
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.asyncStartLoading = false
        })
    },
    /**
     * 批量停用
     */
    batchStop() {
      const { selectedRowKeys } = this.$data
      if (selectedRowKeys.length == 0) {
        this.$message.error(this.$t('cate.batchStopError'))
        return
      }
      this.$data.asyncStopLoading = true
      this.batchAction(0)
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData()
        })
        .finally(() => {
          this.$data.asyncStopLoading = false
        })
    },
    /**
     * 批量删除
     */
    batchDelete() {
      const { selectedRowKeys } = this.$data
      if (selectedRowKeys.length == 0) {
        this.$message.error(this.$t('cate.batchDeleteError'))
        return
      }
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await this.batchAction(2)
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData('delete')
        }
      })
      return
    },
    /**
     * 批量操作
     */
    batchAction(type) {
      const { selectedRowKeys } = this.$data
      let params = { shop_category_id: selectedRowKeys, status: type }
      return Goods.handleBatchAbleCate(params)
    },
    /**
     * 同步分类
     */
    asyncCategory() {
      this.$data.asyncBatchLoading = true
      Goods.handleSyncCate()
        .then(() => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        })
        .finally(() => {
          this.$data.asyncBatchLoading = false
        })
    }
  }
}
</script>

<style lang="scss"></style>
