<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-input-search
        class="me-fr"
        style="width: 300px"
        placeholder="请输入中文名"
        :enter-button="$t('form.search')"
        @search="onSearch"
      />
      <a-button type="primary" @click="onSetModel(true, 'append', null)">
        {{ $t('productCatalog.addFirstCatalog ') }}
      </a-button>
    </div>
    <div class="me-card">
      <a-table
        rowKey="catalogId"
        :loading="tableLoading"
        :columns="columns"
        :data-source="dataSource"
        :pagination="getPagination"
        @expand="onExpand"
        @change="changePage"
      >
        <span slot="operate" slot-scope="text, record">
          <a-button type="link" @click="onSetModel(true, 'edit', record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-button type="link" class="me-error" @click="onDelete(record)">
            {{ $t('common.delete') }}
          </a-button>
          <template v-if="!record.parentId">
            <a-button type="link" @click="onSetModel(true, 'append', record)">
              {{ $t('productCatalog.appendChildCatalog') }}
            </a-button>
          </template>
        </span>
      </a-table>
    </div>

    <a-modal
      :maskClosable="false"
      :title="$t('productCatalog.addCatalog ')"
      :visible="addDialogVisible"
      :confirm-loading="addConfirmLoading"
      destroyOnClose
      @ok="handleAddOk"
      @cancel="onSetModel(false, null, null)"
    >
      <AddEditProductCatalog
        :type="modelType"
        :catalog="parentCatalog"
        ref="addCatalog"
      />
    </a-modal>
  </div>
</template>

<script>
/**
 * 商品目录
 */
import Product from '@/api/product'
import AddEditProductCatalog from './components/AddEditProductCatalog'
import tableMixins from '@/mixins/tableMixins'

export default {
  mixins: [tableMixins],
  components: {
    AddEditProductCatalog
  },
  data() {
    return {
      addDialogVisible: false,
      addConfirmLoading: false,
      parentCatalog: null, // 父级类目
      modelType: null, // 新增：‘append’，修改：‘eidt’
      param: '',
      columns: [
        {
          title: this.$t('productCatalog.cnName '),
          dataIndex: 'cnName',
          key: 'cnName'
        },
        {
          title: this.$t('productCatalog.enName '),
          dataIndex: 'enName',
          key: 'enName'
        },
        {
          title: this.$t('productCatalog.description'),
          dataIndex: 'des',
          key: 'des',
          ellipsis: true
        },
        {
          title: this.$t('productCatalog.code'),
          dataIndex: 'code',
          key: 'code',
          ellipsis: true
        },
        {
          title: this.$t('common.handler'),
          key: 'operate',
          scopedSlots: { customRender: 'operate' }
        }
      ]
    }
  },
  methods: {
    async getTableData() {
      const { param } = this.$data
      const { size, current } = this.$data.paginationData
      const res = await Product.getProductCatalog({ size, current, param })
      res.data.records = res.data.records.map((element) => {
        if (element.hasList) element.children = []
        return element
      })
      return res
    },
    /**
     * 展开
     */
    async onExpand(expanded, catalog) {
      const { catalogId } = catalog
      if (expanded) {
        this.loadChildData(catalogId)
      }
    },
    /**
     * 加载子级数据
     */
    loadChildData(id) {
      const { dataSource } = this.$data
      const load = async (element) => {
        const { data } = await Product.getProductCatalog({
          size: 10000,
          current: 1,
          parentId: element.catalogId
        })
        this.$set(element, 'children', data.records)
      }

      const recursiveSearch = (data) => {
        data.forEach((element) => {
          if (element.catalogId === id) {
            load(element)
          } else {
            if (element.children) {
              recursiveSearch(element.children)
            }
          }
        })
      }
      recursiveSearch(dataSource)
    },
    onSearch(value) {
      this.$data.param = value
      this.reLoadData()
    },
    onSetModel(visible, type, parent) {
      this.$data.addDialogVisible = visible
      this.$data.modelType = type
      this.$data.parentCatalog = parent
    },
    /**
     * 更新一条数据(补营销children)
     */
    async updateCurrentData(catalog) {
      let catalogId
      if (catalog) catalogId = catalog.catalogId
      let { data } = await Product.getProductCatalogDesc({ catalogId })
      Object.keys(data).forEach((element) => {
        if (element === 'children') {
          this.$set(catalog, element, catalog[element])
        } else {
          this.$set(catalog, element, data[element])
        }
      })
      return data
    },
    /**
     * 处理提交
     */
    handleAddOk() {
      this.$data.addConfirmLoading = true
      this.$refs.addCatalog
        .submit()
        .then(async () => {
          const { parentCatalog, modelType } = this.$data
          if (modelType === 'append') {
            if (parentCatalog) {
              this.loadChildData(parentCatalog.catalogId)
            } else {
              this.loadData()
            }
          } else {
            await this.updateCurrentData(parentCatalog)
          }
          this.$emit('change')
          this.$message.success(this.$t('common.handlerSuccess'))
          this.onSetModel(false, null, null)
        })
        .catch((error) => {
          console.error(error)
          this.$message.error(this.$t('common.handlerFail'))
        })
        .finally(() => {
          this.$data.addConfirmLoading = false
        })
    },
    /**
     * 删除
     */
    onDelete({ catalogId, parentId }) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          await Product.delProductCatalog(catalogId)
          this.$emit('change')
          this.$message.success(this.$t('common.handlerSuccess'))
          if (parentId) {
            this.loadChildData(parentId)
          } else {
            this.loadData('delete')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
