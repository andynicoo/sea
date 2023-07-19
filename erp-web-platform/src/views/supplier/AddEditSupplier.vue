<template>
  <div class="pa-2">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>供应商设置</v-card-title>
        <v-card-text class="form-content">
          <v-row>
            <v-col md="6">
              <v-text-field
                v-model="supplierName"
                :rules="supplierNameRules"
                label="供应商名称"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6">
              <v-text-field
                v-model="supplierUrl"
                :rules="supplierUrlRules"
                label="供应商链接"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="邮箱"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="联系人"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="mobile"
                :rules="mobileRules"
                label="联系手机号"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="qq"
                :rules="qqRules"
                label="QQ"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="phone"
                :rules="phoneRules"
                label="联系电话"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="wangWang"
                :rules="wangWangRules"
                label="旺旺"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="payee"
                :rules="payeeRules"
                label="收款人"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="cycle"
                :rules="cycleRules"
                label="到货周期/天"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-select
                :items="collectionMethodItems"
                v-model="collectionMethod"
                :rules="collectionMethodRules"
                label="收款方式"
                :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>

            <v-col md="6">
              <v-select
                :items="paymentMethodItems"
                v-model="paymentMethod"
                :rules="paymentMethodRules"
                label="付款方式"
                :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="accountName"
                :rules="accountNameRules"
                label="账号名称"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="accountNo"
                :rules="accountNoRules"
                label="收款账号"
              ></v-text-field>
            </v-col>

            <v-col md="12">
              <v-text-field
                v-model="address"
                :rules="addressRules"
                label="地址"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-select
                :items="statusItems"
                v-model="status"
                :rules="statusRules"
                label="状态"
                :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>

            <v-col md="6">
              <v-text-field
                v-model="purchaseName"
                :rules="purchaseNameRules"
                label="采购员"
              ></v-text-field>
            </v-col>

            <v-col md="6">
              <v-select
                :items="contractIdItems"
                v-model="contractId"
                :rules="contractIdRules"
                label="关联合同"
                :menu-props="{ bottom: true, offsetY: true }"
              ></v-select>
            </v-col>

            <v-col md="12">
              <v-textarea
                v-model="remark"
                :rules="remarkRules"
                label="备注"
              ></v-textarea>
            </v-col>

            <v-col md="12">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onSubmit">提交</v-btn>
                <v-btn @click="$router.back()">取消</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import Supplier from '@/api/supplier'

export const paymentMethodItems = [
  { text: '转账', value: 0 },
  { text: '余额宝', value: 1 },
  { text: '网银', value: 2 },
  { text: '支付宝', value: 3 },
  { text: '现款', value: 4 },
  { text: 'paypal', value: 5 },
  { text: '到付', value: 6 },
  { text: '分期付款', value: 7 },
  { text: '现付', value: 8 },
  { text: '周结', value: 9 },
  { text: '月结', value: 10 },
  { text: '账期支付', value: 11 }
]
export const collectionMethodItems = [
  { text: '转账', value: 0 },
  { text: '余额宝', value: 1 },
  { text: '网银', value: 2 },
  { text: '支付宝', value: 3 },
  { text: '现款', value: 4 },
  { text: 'paypal', value: 5 }
]
export const statusItems = [
  { value: 0, text: '停用' },
  { value: 1, text: '启用' }
]
export default {
  data() {
    return {
      valid: true,

      id: null,
      supplierName: null,
      supplierUrl: null,
      email: null,
      name: null,
      mobile: null,
      qq: null,
      phone: null,
      wangWang: null,
      payee: null,
      cycle: null,
      collectionMethod: null,
      paymentMethod: null,
      accountName: null,
      accountNo: null,
      address: null,
      status: null,
      purchaseName: null,
      contractId: null,
      remark: null,
      supplierNameRules: [(v) => !!v || '供应商名称不能位空'],
      supplierUrlRules: [],
      emailRules: [],
      nameRules: [],
      mobileRules: [],
      qqRules: [],
      phoneRules: [],
      wangWangRules: [],
      payeeRules: [],
      cycleRules: [],
      collectionMethodRules: [],
      paymentMethodRules: [],
      accountNameRules: [],
      accountNoRules: [],
      addressRules: [],
      statusRules: [],
      purchaseNameRules: [],
      contractIdRules: [],
      remarkRules: [],

      collectionMethodItems, // 收款方式
      paymentMethodItems, // 付款方式
      statusItems, // 状态
      contractIdItems: [] // 关联合同
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const { id } = this.$route.query
      Supplier.getSupplierItem(id).then(({ data }) => {
        this.$data.id = data.id
        this.$data.supplierName = data.supplierName
        this.$data.supplierUrl = data.supplierUrl
        this.$data.email = data.email
        this.$data.name = data.name
        this.$data.mobile = data.mobile
        this.$data.qq = data.qq
        this.$data.phone = data.phone
        this.$data.wangWang = data.wangWang
        this.$data.payee = data.payee
        this.$data.cycle = data.cycle
        this.$data.collectionMethod = data.collectionMethod
        this.$data.paymentMethod = data.paymentMethod
        this.$data.accountName = data.accountName
        this.$data.accountNo = data.accountNo
        this.$data.address = data.address
        this.$data.status = data.status
        this.$data.purchaseName = data.purchaseName
        this.$data.contractId = data.contractId
        this.$data.remark = data.remark
      })
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) return

      const { id } = this.$route.query

      const {
        supplierName,
        supplierUrl,
        email,
        name,
        mobile,
        qq,
        phone,
        wangWang,
        payee,
        cycle,
        collectionMethod,
        paymentMethod,
        accountName,
        accountNo,
        address,
        status,
        purchaseName,
        contractId,
        remark
      } = this.$data

      const forms = {
        id,
        supplierName,
        supplierUrl,
        email,
        name,
        mobile,
        qq,
        phone,
        wangWang,
        payee,
        cycle,
        collectionMethod,
        paymentMethod,
        accountName,
        accountNo,
        address,
        status,
        purchaseName,
        contractId,
        remark
      }

      let res

      if (id) {
        res = await Supplier.editSupplier(forms)
      } else {
        res = await Supplier.addSupplier(forms)
      }
      if (res.code === 0) {
        this.$Message({ type: 'success', content: '请求成功' })
        this.$router.back()
      } else {
        this.$Message({ type: 'error', content: `请求失败:${res.message}` })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  padding-top: 0;
  padding-bottom: 0;
}

.form-content {
  max-width: 800px;
  margin: 0 auto;
}
</style>
