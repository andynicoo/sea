<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-button type="primary" @click="addBrand">
        {{ $t('brand.addBtn') }}
      </a-button>
      <a-input-search
        class="me-fr me-ib"
        style="width: 300px"
        :placeholder="$t('brand.brandName')"
        :enter-button="$t('common.search')"
        allowClear
        @search="searchBrand"
      />
    </div>
    <div class="me-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="updateTime"
        :loading="tableLoading"
        :pagination="getPagination"
        @change="changePage"
      >
        <template slot="handler" slot-scope="text, record">
          <a-button type="link" @click="editBrand(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-button type="link" class="me-error" @click="delBrand(record)">
            {{ $t('common.delete') }}
          </a-button>
        </template>
      </a-table>
    </div>
    <!-- 新增修改品牌-->
    <a-modal
      :title="isAdd ? $t('brand.addBtn') : $t('brand.editName')"
      :visible="brandVisible"
      @ok="brandOk"
      width="700px"
      @cancel="materialCancel('brandVisible')"
      destroyOnClose
    >
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 14 }"
        class="me-material-add"
      >
        <a-form-item :label="$t('brand.brandName')">
          <a-input
            :placeholder="$t('brand.nameRequired')"
            v-decorator="[
              'brandName',
              {
                rules: [{ required: true, message: $t('brand.nameRequired') }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item :label="$t('common.describe')">
          <a-textarea
            :placeholder="$t('common.describe')"
            v-decorator="[
              'des',
              { rules: [{ max: 500, message: '描述不能超过500个字符' }] }
            ]"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
/**
 * 品牌管理
 */
import Product from '@/api/product'
import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  data() {
    return {
      brandVisible: false,
      isAdd: true,
      columns: [
        {
          title: this.$t('brand.brandName'),
          dataIndex: 'brandName',
          width: 250
        },
        { title: this.$t('brand.desc'), dataIndex: 'des' },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          width: 250,
          scopedSlots: { customRender: 'handler' }
        }
      ],
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    //获取品牌列表
    getTableData() {
      return Product.getBrandPage({ ...this.$data.paginationData })
    },
    //搜索品牌
    searchBrand(value) {
      this.$set(this.$data.paginationData, 'brandName', value)
      this.reLoadData()
    },
    //添加品牌
    addBrand() {
      this.$data.brandVisible = true
      this.$data.form.resetFields()
      this.$data.isAdd = true
    },
    //编辑品牌
    editBrand(row) {
      this.$data.isAdd = false
      this.$data.rowId = row.brandId
      this.$data.brandVisible = true
      this.$nextTick(() => {
        this.$data.form.setFieldsValue({
          brandName: row.brandName,
          des: row.des
        })
      })
    },
    //确定添加修改
    brandOk() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let res
          this.$data.brandVisible = false
          if (this.$data.isAdd) {
            res = await Product.addProductBrand(values)
          } else {
            values.brandId = this.$data.rowId
            res = await Product.editProductBrand(values)
          }
          this.$emit('change')
          if (res.code === 0) {
            if (this.$data.isAdd) {
              this.$Message({
                type: 'success',
                content: this.$t('common.addSuccess')
              })
            } else {
              this.$Message({
                type: 'success',
                content: this.$t('common.editSuccess')
              })
            }
            this.loadData()
          } else {
            this.$Message({
              type: 'error',
              content: this.$t('common.handlerFail') + `:${res.message}`
            })
          }
        }
      })
    },
    //关闭新增修改弹窗
    materialCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    delBrand(row) {
      let _this = this
      let dataSourceLen = this.$data.dataSource.length
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res = await Product.delProductBrand({
            brandId: row.brandId
          })
          this.$emit('change')
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: '删除成功'
            })
            if (dataSourceLen == 1) {
              _this.$data.paginationData.current -= 1
            }
            _this.loadData()
          } else {
            this.$Message({
              type: 'error',
              content: `删除失败:${res.message}`
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-ml20 {
  margin-left: 20px !important;
}
.me-material-add {
  ::v-deep .ant-col-5 {
    width: 120px;
  }
}
.me-form-inline {
  display: inline-block;
  ::v-deep .ant-col-14 {
    width: 120px;
  }
}
.me-form-unlable {
  display: inline-block;
  margin-left: 10px;
  width: 120px;
  ::v-deep .ant-col-14 {
    width: 100%;
  }
}

.me-form-text {
  position: absolute;
  left: 385px;
  top: -10px;
  min-width: 120px;
}
.me-unlable-text {
  position: absolute;
  left: 126px;
  top: -10px;
  min-width: 150px;
}
.me-max-w300 {
  max-width: 220px;
}
</style>
