<template>
  <div>
    <a-table
      class="me-shelf-list"
      :columns="columns"
      :data-source="dataSource"
      rowKey="createTime"
      :pagination="getPagination"
      @change="changePage"
      :loading="tableLoading"
    >
      <template slot="shelvesName" slot-scope="text, record">
        <div class="me-w210">{{ text }}</div>
      </template>
      <template slot="shelfLayers" slot-scope="text, record">
        {{ record.shelfLayers }}/{{ record.shelfColumns }}
      </template>
      <template slot="handler" slot-scope="text, record">
        <a-button type="link" @click="editStorageShelves(record)" v-if="!record.stock">
          {{ $t('common.edit') }}
        </a-button>

        <a-button
          type="link"
          class="me-error"
          @click="delStorageShelves(record)" v-if="!record.stock"
        >
          {{ $t('common.delete') }}
        </a-button>
      </template>
    </a-table>
    <div class="ant-modal-footer">
      <a-button @click="shelfCancelChild">{{ $t('common.cancel') }} </a-button>
      <a-button type="primary" @click="addShelf">
        {{ $t('storage.addShelf') }}
      </a-button>
    </div>
    <!-- 新增编辑货架弹窗-->
    <a-modal
      :title="isAdd ? $t('storage.addShelf') : $t('storage.editShelf')"
      :visible="AEShelfVisible"
      width="900px"
      :confirm-loading="confirmLoading"
      :ok-text="$t('common.submit')"
      @ok="AEShelfOk"
      @cancel="AEShelfCancel"
      :maskClosable="false"
    >
      <a-form
        :form="form"
        layout="inline"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-form-item
          :label="$t('storage.shelfName')"
          class="me-shelvesName me-mb24"
        >
          <a-input
            v-decorator="[
              'shelvesName',
              {
                rules: [{ required: true, message: $t('storage.inShelfName') }]
              }
            ]"
            :maxLength="maxLen"
          />
        </a-form-item>

        <a-form-item
          :label="$t('storage.shelvesPrefix')"
          class="me-mb24 me-shelvesPrefix"
        >
          <a-input
            v-decorator="[
              'shelvesPrefix',
              {
                rules: [{ required: true, message: $t('common.required') }]
              }
            ]"
            :maxLength="maxLen50"
            class="me-prefix"
          />
        </a-form-item>

        <a-form-item class="me-mb24 me-row">
          <a-input
            v-decorator="[
              'shelfLayers',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateTo20
                  }
                ]
              }
            ]"
          />
          {{ $t('storage.layers') }}
        </a-form-item>

        <a-form-item class="me-mb24 me-row">
          <a-input
            v-decorator="[
              'shelfColumns',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: validateTo50
                  }
                ]
              }
            ]"
          />
          {{ $t('storage.columns') }}
        </a-form-item>

        <p class="me-pnumber-tips">
          {{ $t('storage.shelfTips') }}
        </p>
        <div class="me-generate">
          <a-button type="primary" @click="generatePosition"
            >{{ $t('storage.generate') }}
          </a-button>
        </div>

        <a-form-item
          class="me-preview-information"
          :label="$t('storage.preview')"
        >
          <div class="me-preview-information-warp">
            <div class="me-shelfLayers-table">
            <div
              class="me-shelfLayers-wrap"
              v-for="(item, index) in parseInt(shelvesInfor.shelfLayers)"
              :key="index"
            >
              <span
                v-for="(item2, index2) in parseInt(shelvesInfor.shelfColumns)"
                :key="index2"
                >{{ shelvesInfor.shelvesPrefix }}-{{ index + 1 }}-{{
                  index2 + 1
                }}</span
              >
            </div>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
/**
 * 货架管理
 */
import Storage from '@/api/storage'
import tableMixins from '@/mixins/tableMixins'
import { NUM20, NUM50 } from '@/util/regex'
export default {
  mixins: [tableMixins],
  components: {
    // ShelfAddOrEdit
  },
  props: {
    currentStorage: Object,
    shelfCancel: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      maxLen: 100,
      maxLen50: 50,
      isAdd: true,
      currShelvesId: '',
      AEShelfVisible: false,
      form: this.$form.createForm(this),
      columns: [
        { title: this.$t('storage.shelfNumber'), dataIndex: 'shelvesNo' },
        {
          title: this.$t('storage.shelfName'),
          dataIndex: 'shelvesName',
          scopedSlots: { customRender: 'shelvesName' }
        },
        { title: this.$t('storage.shelvesPrefix'), dataIndex: 'shelvesPrefix' },
        {
          title: this.$t('storage.layers') + '/' + this.$t('storage.columns'),
          dataIndex: 'shelfLayers',
          scopedSlots: { customRender: 'shelfLayers' }
        },
        { title: this.$t('storage.pnum'), dataIndex: 'num' },
        { title: this.$t('storage.inventoryTotal'), dataIndex: 'stock' },
        {
          title: this.$t('common.handler'),
          dataIndex: 'handler',
          scopedSlots: { customRender: 'handler' }
        }
      ],
      shelvesInfor: {
        shelvesPrefix: '',
        shelfLayers: 0,
        shelfColumns: 0
      },
      confirmLoading:false,
    }
  },
  methods: {
    //验证1-20的数字
    validateTo20(rule, value, callback) {
      if (!NUM20.test(value)) {
        callback(this.$t('storage.num20'))
      }
      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
      callback()
    },
    //验证1-50的数字
    validateTo50(rule, value, callback) {
      if (!NUM50.test(value)) {
        callback(this.$t('storage.num50'))
      }
      callback()
    },
    //调用父组件方法关闭货架管理
    shelfCancelChild() {
      this.shelfCancel('shelfVisible')
    },
    //新增货架
    addShelf() {
      this.$data.isAdd = true
      this.$data.form.resetFields()
      this.$data.shelvesInfor = {
        shelvesPrefix: '',
        shelfLayers: 0,
        shelfColumns: 0
      }
      this.$data.AEShelfVisible = true
      this.$data.confirmLoading = false
      this.$data.currShelvesId = ''
    },
    //关闭新增修改货架弹窗
    AEShelfCancel() {
      this.$data.AEShelfVisible = false
    },
    //生成货架预览
    generatePosition() {
      // e.preventDefault()
      this.$data.form.validateFields((err, values) => {
        if (!err) {
          this.$data.shelvesInfor = values
        }
      })
    },
    //确定新增修改货架
    AEShelfOk() {
      this.$data.form.validateFields(async (err, values) => {
        if (!err) {
          let res
          this.$data.shelvesInfor = values
          this.$data.shelvesInfor.storageId = this.$props.currentStorage.storageId
          this.$data.confirmLoading = true
          if (this.$data.currShelvesId) {
            this.$data.shelvesInfor.storageShelvesId = this.$data.currShelvesId
            res = await Storage.editStorageShelves(this.$data.shelvesInfor)
          } else {
            res = await Storage.addStorageShelves(this.$data.shelvesInfor)
          }
          this.$data.confirmLoading = false
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$data.currShelvesId? this.$t('common.editSuccess'):this.$t('common.addSuccess')
            })
            this.loadData()
            this.$data.AEShelfVisible = false

          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    },
    //获取仓库货架数据
    getTableData() {
      return Storage.getStorageShelves({
        ...this.$data.paginationData,
        storageId: this.$props.currentStorage.storageId
      })
    },
    //编辑货架
    async editStorageShelves(row) {
      this.addShelf()
      this.$data.isAdd = false
      this.$data.currShelvesId = row.storageShelvesId
      this.$nextTick(() => {
        this.$data.form.setFieldsValue({
          shelvesName: row.shelvesName,
          shelvesPrefix: row.shelvesPrefix,
          shelfLayers: row.shelfLayers,
          shelfColumns: row.shelfColumns
        })
        this.generatePosition()
      })
    },
    //删除货架
    delStorageShelves(row) {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('common.deleteConfirm'),
        onOk: async () => {
          let res = await Storage.delStorageShelves({
            storageShelvesId: row.storageShelvesId
          })
          if (res.code === 0) {
            this.$Message({
              type: 'success',
              content: this.$t('common.handlerSuccess')
            })
            
            this.loadData('delete')
          } else {
            this.$Message({ type: 'error', content: `${res.message}` })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-modal-footer {
  padding: 10px 16px 0;
  text-align: right;
  border-radius: 0 0 4px 4px;
}
.me-mb24 {
  margin-bottom: 24px;
  ::v-deep .ant-form-explain {
    position: absolute;
    top: 40px;
    left: 0;
    line-height: 16px;
  }
}
.me-prefix {
  width: 210px;
}
.me-row {
  min-width: 90px;
  ::v-deep .ant-col-12 {
    width: auto;
    min-width: 100px;
  }
  ::v-deep .ant-input {
    width: 70px;
  }
}
.me-shelvesName {
  display: block;
}

.me-shelvesName,
.me-preview-information {
  display: block;
  ::v-deep .ant-col-10 {
    width: 210px;
  }
}
.me-shelvesPrefix {
  ::v-deep .ant-col-10 {
    width: 210px;
  }
}
.me-pnumber-tips {
  padding-left: 210px;
  
}
.me-generate {
  padding-left: 210px;
  margin-bottom: 10px;
  margin-top: 24px;
}
.me-shelfLayers-table{
  display: table;
      border-collapse: collapse;
    border-spacing: 0;
}
.me-shelfLayers-wrap {
  display: table-row;
  justify-content: space-between;
  width: 100%;
  span {
    display: table-cell;
    border: 1px solid #999;
    box-sizing: border-box;
    padding: 5px;
    line-height: 100%;
    white-space: nowrap;
  }
}
.me-preview-information-warp {
  max-width: 600px;
  max-height: 300px;
  overflow: auto;
  float: left;
  margin-top: 10px;
}
.me-shelf-list {
  ::v-deep .ant-table-tbody td {
    padding: 8px 16px;
  }
}
.me-w210 {
  width: 210px;
}
</style>
