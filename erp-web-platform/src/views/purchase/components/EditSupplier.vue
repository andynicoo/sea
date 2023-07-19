<template>
  <div>
    <div class="me-contract--dialog">
      <a-form
        :form="supplierForm"
        layout="horizontal"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-item
          :label="$t('purchase.supplierName2')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.supplierNamePlease')"
            v-decorator="[
              'supplierName',
              {
                rules: [
                  {
                    required: true,
                    message: $t('purchase.supplierNamePlease')
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <div></div>
        <a-form-item
          :label="$t('purchase.supplierUrl')"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
          class="inline"
        >
          <a-input
            :placeholder="$t('purchase.supplierUrl')"
            v-decorator="['supplierUrl']"
          />
        </a-form-item>
        <div></div>
        <a-form-item
          :label="$t('purchase.email')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.email')"
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    type: 'email',
                    message: $t('purchase.isemail')
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.contacts')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.contacts')"
            v-decorator="['contacts']"
          />
        </a-form-item>

        <a-form-item
          :label="$t('purchase.connectTel')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.connectTel')"
            v-decorator="['mobile']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.qq')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input :placeholder="$t('purchase.qq')" v-decorator="['qq']" />
        </a-form-item>

        <a-form-item
          :label="$t('purchase.conTel')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.conTel')"
            v-decorator="['phone']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.wangwang')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.wangwang')"
            v-decorator="['wangWang']"
          />
        </a-form-item>

        <a-form-item
          :label="$t('purchase.payee')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.payee')"
            v-decorator="['payee']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.cycle')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.cycle')"
            v-decorator="['cycle']"
          />
        </a-form-item>

        <a-form-item
          :label="$t('purchase.paymentMethod')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-select
            v-decorator="['collectionMethod']"
            @change="handleChangePayShou"
          >
            <a-select-option
              v-for="item in collectionMethod"
              :key="item.value"
              :value="item.value"
            >
              {{ item.labal }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label="$t('purchase.payMethod')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-select v-decorator="['paymentMethod']" @change="handleChangePayFu">
            <a-select-option
              v-for="item in payMethods"
              :key="item.value"
              :value="item.value"
            >
              {{ item.labal }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="$t('purchase.accountName')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.accountName')"
            v-decorator="['accountName']"
          />
        </a-form-item>
        <a-form-item
          :label="$t('purchase.collectionAccount')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.collectionAccount')"
            v-decorator="['accountNo']"
          />
        </a-form-item>

        <a-form-item
          :label="$t('purchase.relatedContract')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-select v-decorator="['contractId']" @change="handleChangePayFu">
            <a-select-option
              v-for="item in contractData"
              :key="item.contractId"
              :value="item.contractId"
            >
              {{ item.contractName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="$t('purchase.buyer')"
          class="inline"
          :labelCol="{ span: 8 }"
          :wrapperCol="{ span: 14 }"
        >
          <a-input
            :placeholder="$t('purchase.buyer')"
            v-decorator="['purchaseName']"
          />
        </a-form-item>
        <a-form-item :label="$t('purchase.address')">
          <a-input
            :placeholder="$t('purchase.address')"
            v-decorator="['address']"
          />
        </a-form-item>

        <a-form-item :label="$t('common.remarks')">
          <a-textarea
            :placeholder="$t('common.remarks')"
            v-decorator="['remark']"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import Purchase from '@/api/purchase'
export default {
  props: {
    currentId: {
      type: Number,
      default: '0'
    },
    handleCancel: {
      type: Function,
      default: null
    },
    updataList: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      supplierForm: this.$form.createForm(this), // 供应商编辑form
      confirmLoading: false,
      payMethods: [
        { labal: this.$t('purchase.zhuanzhang'), value: 0 },
        { labal: this.$t('purchase.yuerbao'), value: 1 },
        { labal: this.$t('purchase.wangyin'), value: 2 },
        { labal: this.$t('purchase.zhifubao'), value: 3 },
        { labal: this.$t('purchase.xiankuan'), value: 4 },
        { labal: this.$t('purchase.paypal'), value: 5 },
        { labal: this.$t('purchase.daofu'), value: 6 },
        { labal: this.$t('purchase.fenqi'), value: 7 },
        { labal: this.$t('purchase.xianfu'), value: 8 },
        { labal: this.$t('purchase.zhoujie'), value: 9 },
        { labal: this.$t('purchase.yuejie'), value: 10 },
        { labal: this.$t('purchase.zhangqi'), value: 11 }
      ],
      collectionMethod: [
        { labal: this.$t('purchase.zhuanzhang'), value: 0 },
        { labal: this.$t('purchase.yuerbao'), value: 1 },
        { labal: this.$t('purchase.wangyin'), value: 2 },
        { labal: this.$t('purchase.zhifubao'), value: 3 },
        { labal: this.$t('purchase.xiankuan'), value: 4 },
        { labal: this.$t('purchase.paypal'), value: 5 }
      ],
      paymentMethod: '', // 收款方式
      fuPay: '', // 付款方式
      contractData: []
    }
  },
  mounted() {
    console.log(this.currentId)
    if (this.currentId != 0) {
      this.getSpupplierOne()
    }
    this.getAllContract()
  },
  methods: {
    handleCancelTemp() {
      this.handleCancel('visible')
    },
    handleChangePayShou(val) {
      this.$data.paymentMethod = val
    },
    handleChangePayFu(val) {
      this.$data.fuPay = val
    },
    // 获取所有的合同
    getAllContract() {
      Purchase.getContractList({ size: 1000, current: 1 }).then((res) => {
        if (res.code == 0) {
          this.$data.contractData = res.data.records
        }
      })
    },
    // 根据currentId获取单个供应商信息
    getSpupplierOne() {
      Purchase.getSupplierOne(this.currentId).then((res) => {
        if (res.code == 0) {
          this.$nextTick(() => {
            this.$data.supplierForm.setFieldsValue({
              //   ...res.data
              supplierName: res.data.supplierName,
              supplierUrl: res.data.supplierUrl,
              email: res.data.email,
              contacts: res.data.contacts,
              mobile: res.data.mobile,
              qq: res.data.qq,
              phone: res.data.phone,
              wangWang: res.data.wangWang,
              payee: res.data.payee,
              cycle: res.data.cycle,
              collectionMethod: res.data.collectionMethod,
              paymentMethod: res.data.paymentMethod,
              accountName: res.data.accountName,
              accountNo: res.data.accountNo,
              contractId: res.data.contractId,
              fax: res.data.fax,
              address: res.data.address,
              purchaseName: res.data.purchaseName,
              remark: res.data.remark
            })
            // console.log(res.data)
          })
        }
      })
    },
    // 添加、编辑合同提交
    submit(e) {
      // e.preventDefault()
      return new Promise((resolve, reject) => {
        this.supplierForm.validateFields((err, values) => {
          if (!err) {
            this.$data.confirmLoading = true
            if (this.currentId == 0) {
              Purchase.addSupplier(values).then((res) => {
                if (res.code == 0) {
                  this.$Message({
                    type: 'success',
                    content: this.$t('common.handlerSuccess')
                  })
                  this.handleCancel('visible')
                  this.updataList()

                  resolve()
                }
              })
            } else {
              var params = {
                ...values,
                supplierId: this.currentId
              }
              // console.log(params)
              Purchase.editSupplier(params).then((res) => {
                if (res.code == 0) {
                  this.$Message({
                    type: 'success',
                    content: this.$t('common.handlerSuccess')
                  })
                  this.handleCancel('visible')
                  this.updataList()

                  resolve()
                }
              })
            }
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-contract--dialog {
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  span.title {
    float: right;
    padding-right: 5px;
    &.mr10 {
      margin-right: 10px;
    }
  }
  i {
    color: #f5222d;
    margin-left: 19px;
  }
  .block {
    display: block;
  }
  .inline {
    display: inline-block;
    width: 50%;
  }
}
</style>

<style lang="scss">
// .me-contract--dialog {
//   .ant-form-explain {
//     margin: 0 106px;
//   }
// }
</style>
