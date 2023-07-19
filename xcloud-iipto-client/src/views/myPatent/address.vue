<template>
  <div class="content">
    <p>该外观专利申请需要邮寄产品到我司，请及时寄送，收件信息如下：</p>
    <ul>
      <li><span>收件人：</span>{{ companyShippingInfo.consignee || '--'}}</li>
      <li><span>联系电话：</span>{{ companyShippingInfo.mobile  || '--' }}</li>
      <li><span>收件地址：</span>{{ companyShippingInfo.address  || '--' }}</li>
    </ul>
    <template v-if="expressDeliveryVisible">
      <Form ref="form" :model="form" :rules="rules" inline>
        <FormItem prop="courierCompany">
          <Input type="text" :disabled="!editing" v-model="form.courierCompany" maxlength="18" placeholder="请输入快递公司" />
        </FormItem>
        <FormItem prop="courierNo">
          <Input type="text" :disabled="!editing" v-model="form.courierNo" maxlength="18" placeholder="请输入物流单号" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('form')" v-if="editing">保存</Button>
          <Button type="primary" @click="editing = true" v-else>编辑</Button>
        </FormItem>
      </Form>
    </template>
    <Button type="info" v-else @click="expressDeliveryVisible = true">已寄送，请填写寄送地址</Button>
  </div>
</template>

<script>
import '@/assets/style/common.less'
import { updateAdress } from '@/api/myPatent'
export default {
  data () {
    return {
      expressDeliveryVisible: false,
      editing: false,
      form: {
        courierCompany: this.designPatentWorkOrder.courierCompany,
        courierNo: this.designPatentWorkOrder.courierNo
      },
      rules: {
        courierCompany: [
          {
            required: true,
            message: '快递公司不能为空',
            trigger: 'blur'
          }
        ],
        courierNo: [
          {
            required: true,
            message: '物流单号不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    companyShippingInfo: {},
    designPatentWorkOrder: {}
  },
  mounted () {
    this.handleExpressDelivery()
  },
  watch: {
    designPatentWorkOrder () {
      this.handleExpressDelivery()
    }
  },
  methods: {
    // 快递信息提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          updateAdress({
            ...this.form,
            workOrderId: this.designPatentWorkOrder.id
          }).then(res => {
            if (res.code === 0) {
              this.$Message.success('保存成功')
              this.$emit('change')
              this.editing = false
            }
          })
        }
      })
    },
    // 快递信息是否显示
    handleExpressDelivery () {
      const { courierCompany, courierNo } = this.designPatentWorkOrder
      const expressDeliveryVisible = Boolean(courierCompany || courierNo)
      expressDeliveryVisible ? this.editing = false : this.editing = true
      this.expressDeliveryVisible = expressDeliveryVisible
      this.form.courierCompany = courierCompany
      this.form.courierNo = courierNo
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  padding: 30px 0 0 24px;
  font-size: 14px;
  color: #333;
  min-height: 300px;
  p {
    margin-bottom: 15px;
  }
  ul {
    margin-bottom: 30px;
    li {
      span {
        color: #666;
      }
      line-height: 28px;
    }
  }
}
</style>
