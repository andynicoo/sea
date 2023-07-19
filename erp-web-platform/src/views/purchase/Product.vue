<template>
  <div class="me-pa-2">
    <div class="me-card">
      <a-space>
        <a-input-search
          :placeholder="$t('purchase.productSearchPlace')"
          :enter-button="$t('common.search')"
          v-model="input"
          allowClear
          @search="searchTableData"
        />
      </a-space>
    </div>
    <div class="me-card">
      <a-table
        :columns="columns"
        :pagination="getPagination"
        :data-source="dataSource"
        rowKey="variationsId"
        @change="changePage"
      >
        <template slot="images" slot-scope="text, record">
          <ImgArr :src="JSON.parse(record.images)"></ImgArr>
        </template>
        <!-- <template slot="variationsName" slot-scope="text, record">
          {{ record.variationsName }}
        </template> -->
        <!-- <template slot="variationsName" slot-scope="text, record">
          {{ record.variationsName }}
        </template> -->
        <template slot="url" slot-scope="text, record">
          <!-- <a  :href="record.url" target="_blank"
            >{{ $t('purchase.quickGo') }}
          </a> -->
          <a-button
            v-if="record.url != null && record.url != ''"
            type="link"
            @click="openWindow(record.url)"
          >
            {{ $t('purchase.quickGo') }}
          </a-button>
          <a-button v-else type="link">{{ $t('purchase.noNow') }} </a-button>
        </template>
        <template slot="lowPrice" slot-scope="text, record">
          <span v-if="record.lowPrice == null">0.00</span>
          <span v-else>{{ record.lowPrice }} </span>
        </template>
        <template slot="lastPrice" slot-scope="text, record">
          <span v-if="record.lastPrice == null">0.00</span>
          <span v-else>{{ record.lastPrice }} </span>
        </template>
        <template slot="isDefault" slot-scope="text, record">
          <a-tag v-if="record.isDefault == true">{{
            $t('purchase.yes')
          }}</a-tag>
          <a-tag v-else>{{ $t('purchase.no') }}</a-tag>
        </template>
        <template slot="createTime" slot-scope="text, record">
          {{ record.createTime }}
        </template>
        <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" @click="openTemp(record)">{{
            $t('common.edit')
          }}</a-button>
          <a-button type="link" class="me-error" @click="deleteOne(record)">
            {{ $t('common.delete') }}
          </a-button>
          <a-button type="link" @click="openSupplier(record)"
            >{{ $t('purchase.changeDefaultPurchase') }}
          </a-button>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="editProductVisible"
      centered
      :title="$t('common.edit')"
      :maskClosable="false"
      destroyOnClose
      @ok="handleEditOk"
      @cancel="editProductVisible = false"
    >
      <!-- :footer="null"
      @ok="goEditProduct" -->
      <div class="me-contract--relation">
        <p>{{ currentSKU }}</p>
        <p>
          <a-form
            :form="form"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item :label="$t('purchase.pruductUrl')">
              <a-textarea
                :placeholder="$t('purchase.pruductUrl')"
                v-decorator="[
                  'url',
                  {
                    rules: [
                      { required: true, message: $t('purchase.pruductUrl') }
                    ]
                  }
                ]"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
            </a-form-item>
          </a-form>
        </p>
      </div>
    </a-modal>

    <a-modal
      v-model="editSuplierVisible"
      centered
      :title="$t('purchase.changeDefaultPurchase')"
      @ok="goEditSuplier"
      destroyOnClose
    >
      <div class="me-contract--relation">
        <p class="me-contract-p">
          <a-row>
            <a-col :span="5"> {{ $t('purchase.oriPurchase') }}： </a-col>
            <a-col :span="12">
              {{ supplierName }}
            </a-col>
          </a-row>
        </p>
        <p class="me-contract-p">
          <a-row>
            <a-col :span="5"> {{ $t('purchase.changeTo') }}: </a-col>
            <a-col :span="12">
              <a-select
                :default-value="selectSupplier"
                style="width: 100%"
                :placeholder="$t('purchase.relatedSuppliers')"
                @change="handleChange22"
              >
                <a-select-option
                  v-for="item in allSupplier"
                  :key="item.supplierId"
                >
                  {{ item.supplierName }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
/**
 * 供应商管理
 */
import Purchase from '@/api/purchase'
import tableMixins from '@/mixins/tableMixins'
import ImgArr from './components/ImgArr'
export default {
  mixins: [tableMixins],
  components: {
    ImgArr
  },
  data() {
    return {
      input: '',
      currentId: '', // 当前供应链id
      currentSKU: '',
      form: this.$form.createForm(this),
      columns: [
        {
          title: this.$t('purchase.masterImg'),
          dataIndex: 'images',
          scopedSlots: { customRender: 'images' },
          width: 200
        },
        {
          title: this.$t('purchase.stortSku'),
          dataIndex: 'variationsSku',
          scopedSlots: { customRender: 'variationsSku' },
          width: 220
        },
        {
          title: this.$t('purchase.goodsName'),
          dataIndex: 'variationsName',
          scopedSlots: { customRender: 'variationsName' },
          width: 220
        },
        {
          title: this.$t('purchase.pruductUrl'),
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' },
          width: 100
        },
        {
          title: this.$t('purchase.lowestPrice'),
          dataIndex: 'lowPrice',
          scopedSlots: { customRender: 'lowPrice' }
        },
        {
          title: this.$t('purchase.lastPrice'),
          dataIndex: 'lastPrice',
          scopedSlots: { customRender: 'lastPrice' },
          ellipsis: true
        },
        {
          title: this.$t('common.addTime'),
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          width: 200
        },
        {
          title: this.$t('purchase.defaultPurchase'),
          dataIndex: 'isDefault',
          width: 150,
          scopedSlots: { customRender: 'isDefault' }
        },
        {
          title: this.$t('common.handler'),
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 220
        }
      ],
      curProductId: 0,
      deleteVisible: false,
      editProductVisible: false,
      editSuplierVisible: false,
      supplierName: '', // 根据currentId查询的原来的供应商
      allSupplier: [], // 所有的供应商
      selectSupplier: 0,
      sdfs: 'sdfsdf'
    }
  },
  created() {
    this.currentId = this.$route.query.supplierId
  },
  mounted() {},
  methods: {
    getTableData() {
      return Purchase.getProductList(
        Object.assign(this.$data.paginationData, {
          supplierId: this.$data.currentId,
          name: this.$data.input
        })
      )
    },
    searchTableData() {
      this.$data.paginationData = {
        current: 1
      }
      this.loadData()
    },
    openWindow(url) {
      var reg = RegExp(/http/)
      if (!reg.test(url)) {
        url = 'http://' + url
      }
      this.openPage(url)
    },
    // 删除
    deleteOne(obj) {
      this.$confirm({
        title: this.$t('common.deleteConfirm'),
        content: (
          <p>
            {this.$t('common.deleteConfirm')}? <br />{' '}
            {this.$t('purchase.deleteTempNotice')}！
          </p>
        ),
        // content: (h) => <div style="color:red;">
        //   <p>{this.$data.sdfs}</p>
        //   <p>{this.$data.sdfs}</p>
        //   <p>{this.$data.sdfs}</p>
        // </div>,
        onOk: async () => {
          console.log(obj)
          let dataSourceLen = this.$data.dataSource.length
          // return false
          await Purchase.deleteProduct({ id: obj.id })

          if (dataSourceLen == 1) {
            this.$data.paginationData.current -= 1
          }
          this.$message.success(this.$t('common.handlerSuccess'))
          this.loadData()
        }
      })
    },
    // 编辑产品弹窗
    openTemp(obj) {
      this.$data.editProductVisible = true
      this.$data.curProductId = obj.variationsId
      this.$data.currentSKU = obj.variationsName

      this.$nextTick(() => {
        this.$data.form.setFieldsValue({
          url: obj.url
        })
      })
    },
    // 确定编辑产品
    handleEditOk(e) {
      e.preventDefault()
      this.$data.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)

          var params = {
            ...values,
            variationsId: this.$data.curProductId,
            supplierId: parseInt(this.$data.currentId)
          }
          console.log(params)
          Purchase.editProduct(params).then((res) => {
            if (res.code == 0) {
              this.$Message({
                type: 'success',
                content: this.$t('common.handlerSuccess')
              })
              this.$data.editProductVisible = false
              this.loadData()
            }
          })
        }
      })
    },
    openSupplier(obj) {
      this.$data.editSuplierVisible = true
      this.$data.selectSupplier = Number(this.$data.currentId)
      this.$data.curProductId = obj.variationsId
      //调取所有供应商
      Purchase.getSupplierList({
        current: 1,
        size: 1000
      }).then((res) => {
        if (res.code == 0) {
          this.$data.allSupplier = res.data.records
        }
      })

      // 获取当前supplierid对应的供应商
      Purchase.getSupplierOne(this.currentId).then((res) => {
        if (res.code == 0) {
          console.log(res)
          this.$data.supplierName = res.data.supplierName
        }
      })
    },
    handleChange22(value) {
      console.log(`selected ${value}`)
      this.$data.selectSupplier = value
    },
    // 编辑产品供应商
    goEditSuplier() {
      let params = {
        supplierId: this.$data.selectSupplier,
        variationsId: this.$data.curProductId
      }
      Purchase.changeSupplier(params).then((res) => {
        if (res.code == 0) {
          console.log(res)

          this.$data.editSuplierVisible = false
          this.loadData()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-contract {
  padding: 10px;
  .me-contract--bar {
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    .add {
      .me-contract--bar--add {
        background: #00cc00;
        color: #fff;
        float: right;
      }
      .me-contract--bar--add:hover,
      :focus {
        background: #00cc00;
        color: #fff;
        border-color: #00cc00;
      }
    }
  }
}
.me-contract--table {
  padding: 10px;
  background: #fff;
  .btn {
    margin: 0px 5px;
    color: #0099ff;
    &.delete {
      color: red;
    }
  }
}
.me-contract-p {
  height: 30px;
  line-height: 30px;
  margin: 10px 0px;
}
</style>
