<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-space>
        <div>
          {{ $t('purchase.payMethod') }}
        </div>
        <a-select
          :default-value="curPayMethods"
          style="width: 120px"
          @change="handleChangePay"
        >
          <a-select-option
            v-for="item in payMethods"
            :key="item.value"
            :value="item.value"
          >
            {{ item.labal }}
          </a-select-option>
        </a-select>
      </a-space>

      <a-space class="me-fr">
        <a-input-search
          style="width: 300px"
          :placeholder="$t('purchase.supplierSearch')"
          :enter-button="$t('common.search')"
          v-model="input"
          allowClear
          @search="searchTableData"
        />
        <a-button @click="openTemp(0)" type="primary">
          {{ $t('purchase.addSupplier') }}
        </a-button>
      </a-space>
    </div>

    <div class="me-card">
      <a-table
        :columns="columns"
        :pagination="getPagination"
        :data-source="dataSource"
        rowKey="supplierId"
        :loading="tableLoading"
        @change="changePage"
      >
        <template slot="paymentMethod" slot-scope="text, record">
          <a-button type="link">
            <a-tag v-if="record.paymentMethod == 0"
              >{{ $t('purchase.zhuanzhang') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 1"
              >{{ $t('purchase.yuerbao') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 2"
              >{{ $t('purchase.wangyin') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 3"
              >{{ $t('purchase.zhifubao') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 4"
              >{{ $t('purchase.xiankuan') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 5"
              >{{ $t('purchase.paypal') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 6"
              >{{ $t('purchase.daofu') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 7"
              >{{ $t('purchase.fenqi') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 8"
              >{{ $t('purchase.xianfu') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 9"
              >{{ $t('purchase.zhoujie') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 10"
              >{{ $t('purchase.yuejie') }}
            </a-tag>
            <a-tag v-if="record.paymentMethod == 11"
              >{{ $t('purchase.zhangqi') }}
            </a-tag>
          </a-button>
        </template>

        <template slot="contacts" slot-scope="text, record">
          {{ record.contacts }} / {{ record.mobile }}
        </template>
        <template slot="skuCount" slot-scope="text, record">
          {{ record.skuCount }}/ {{ record.purchaseCount }}
        </template>
        <template slot="createTime" slot-scope="text, record">
          {{ record.createTime }}/ {{ record.transactionTime }}
        </template>
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <template slot="operation" slot-scope="text, record">
          <a-button
            type="link"
            class="me-pa-1"
            @click="openTemp(record.supplierId)"
          >
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="link"
            class="me-pa-1 me-error"
            @click="deleteOne(record)"
          >
            {{ $t('common.delete') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" class="me-pa-1" @click="goProduct(record)">
            {{ $t('purchase.belongPro') }}
          </a-button>
          <!-- <a
            href="javascript:;"
            class="btn relation"
            >采购</a> -->
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="visible"
      centered
      :title="$t('purchase.supplierConfig')"
      :width="920"
      :maskClosable="false"
      destroyOnClose
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      :confirm-loading="confirmLoading"
    >
      <EditSupplier
        :currentId="currentId"
        :updataList="updataList"
        :handleCancel="handleCancel"
        destroyOnClose
        ref="AddEditSupplier"
      ></EditSupplier>
    </a-modal>

    <a-modal
      v-model="deleteVisible"
      centered
      :title="$t('purchase.sureDeleteSupplier')"
      @ok="goDelete"
    >
      <p>{{ $t('purchase.sureDeleteSupplier') }}</p>
      <p>{{ $t('purchase.sureDeleteNotice') }}</p>
    </a-modal>
  </div>
</template>

<script>
/**
 * 供应商管理
 */
import Purchase from '@/api/purchase'
import tableMixins from '@/mixins/tableMixins'
import EditSupplier from './components/EditSupplier'
export default {
  mixins: [tableMixins],
  components: {
    EditSupplier
  },
  data() {
    return {
      visible: false,
      columns: [
        {
          title: this.$t('purchase.supplier'),
          dataIndex: 'supplierName',
          scopedSlots: { customRender: 'supplierName' },
          width: 200
        },
        {
          title: this.$t('purchase.supplierUrl'),
          dataIndex: 'supplierUrl',
          scopedSlots: { customRender: 'supplierUrl' },
          ellipsis: true
        },
        {
          title: this.$t('purchase.payMethod'),
          dataIndex: 'paymentMethod',
          scopedSlots: { customRender: 'paymentMethod' },
          width: 100
        },
        {
          title:
            this.$t('purchase.contacts') + '/' + this.$t('purchase.conTel'),
          dataIndex: 'contacts',
          scopedSlots: { customRender: 'contacts' }
        },
        {
          title: this.$t('purchase.address'),
          dataIndex: 'address',
          scopedSlots: { customRender: 'address' },
          ellipsis: true
        },
        {
          title:
            this.$t('purchase.relateSkuNum') +
            '/' +
            this.$t('purchase.pruchaseNum'),
          dataIndex: 'skuCount',
          scopedSlots: { customRender: 'skuCount' },
          width: 160
        },
        {
          title:
            this.$t('common.createTime') +
            '/' +
            this.$t('purchase.lastPruchaseTime'),
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: this.$t('common.remarks'),
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          ellipsis: true
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      input: '',
      currentId: 11,
      payMethods: [
        { labal: this.$t('purchase.all'), value: '' },
        { labal: this.$t('purchase.zhuanzhang'), value: '0' },
        { labal: this.$t('purchase.yuerbao'), value: '1' },
        { labal: this.$t('purchase.wangyin'), value: '2' },
        { labal: this.$t('purchase.zhifubao'), value: '3' },
        { labal: this.$t('purchase.xiankuan'), value: '4' },
        { labal: this.$t('purchase.paypal'), value: '5' },
        { labal: this.$t('purchase.daofu'), value: '6' },
        { labal: this.$t('purchase.fenqi'), value: '7' },
        { labal: this.$t('purchase.xianfu'), value: '8' },
        { labal: this.$t('purchase.zhoujie'), value: '9' },
        { labal: this.$t('purchase.yuejie'), value: '10' },
        { labal: this.$t('purchase.zhangqi'), value: '11' }
      ],
      curPayMethods: '', // 当前选中的付款方式
      deleteVisible: false,
      confirmLoading: false
    }
  },
  mounted() {},
  methods: {
    openTemp(val) {
      // this.contractForm.resetFields()
      this.$data.visible = true
      val == 0 ? (this.$data.currentId = 0) : (this.$data.currentId = val)
    },
    getTableData() {
      return Purchase.getSupplierList(
        Object.assign(this.$data.paginationData, {
          name: this.$data.input,
          paymentMethod: this.$data.curPayMethods
        })
      )
    },
    /**
     * 编辑提交
     */
    async handleEditOk() {
      this.$data.confirmLoading = true
      this.$refs.AddEditSupplier.submit()
        .then(() => {})
        .finally(() => {
          this.$data.confirmLoading = false
        })
    },
    /**
     * 编辑取消
     */
    handleEditCancel() {
      this.$data.visible = false
      // this.$data.confirmLoading = false
      // this.$data.editCurrent = null
    },
    searchTableData() {
      this.$data.paginationData = {
        current: 1
      }
      this.loadData()
    },
    handleChangePay(value) {
      this.curPayMethods = value
    },
    //取消新增编辑
    handleCancel(visible) {
      console.log('Clicked cancel button')
      this.$data[visible] = false
    },
    updataList() {
      this.loadData()
    },
    // 删除弹窗
    deleteOne(obj) {
      this.$data.currentId = obj.supplierId
      // this.$data.deleteVisible = true
      this.$confirm({
        title: this.$t('common.warn'),
        content: (h) => (
          <div>
            {this.$t('purchase.sureDeleteSupplier')}
            {this.$t('purchase.sureDeleteNotice')}{' '}
          </div>
        ),
        onOk: async () => {
          this.goDelete(obj)
        }
      })
    },
    // 确认删除
    goDelete(obj) {
      if (obj.isMain == 1) {
        this.$Message({
          type: 'error',
          content: this.$t('purchase.mainSupplierCannotDelete')
        })
      } else {
        let dataSourceLen = this.$data.dataSource.length
        Purchase.deleteSupplierOne({ supplierId: this.$data.currentId }).then(
          (res) => {
            if (res.code == 0) {
              this.$Message({
                type: 'success',
                content: this.$t('common.handlerSuccess')
              })
              this.$data.deleteVisible = false
              if (dataSourceLen == 1) {
                this.$data.paginationData.current -= 1
              }
              this.loadData()
              this.$emit('delete', obj.supplierId)
            }
          }
        )
      }
    },
    // 前往所属商品页面
    goProduct(obj) {
      this.$router.push({
        path: `/purchase/product?supplierId=${obj.supplierId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
