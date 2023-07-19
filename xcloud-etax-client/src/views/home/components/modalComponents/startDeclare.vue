<template >
  <div>
    <Modal v-model="modalInvoice"
           :mask-closable="false"
           @on-visible-change="changeState"
           width="510">
      <div slot="header">
        <span class="title">开始报税</span>
        <span class="subTitle">(请填写您的报税信息）</span>
      </div>
      <Form ref="invoiceFrom"
            :model="invoiceFrom"
            :label-width="160"
            :rule="formRule">
        <FormItem label="VAT税号：">
          <Input placeholder="|  请输入VAT税号"
                 v-model="invoiceFrom.vatNumber"
                 :maxlength="vatNumberSuffixDigitLength"
                 style="width: auto;width: 300px">
          <span slot="prefix">{{vatNumberPrefix}}</span>
          </Input>
        </FormItem>
        <FormItem label="报税周期：">
          <Select v-model="invoiceFrom.periodType"
                  placeholder="请选择申报周期"
                  style="width:300px;">
            <Option :value="item.status"
                    v-for="(item,index) in declare"
                    :key="index">{{item.type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="下一次报税时间：">
          <DatePicker type="date"
                      placeholder=""
                      style="width: 300px"
                      :options="options"
                      @on-change="changeDate"
                      v-model="invoiceFrom.beginTime"></DatePicker>
        </FormItem>
        <div v-if="serviceInfo.countryCode=='GB'"
             class="engBox">
          <p style="margin-bottom:10px">
            英国需填写以下信息(如无，可不填)：
            <!-- Gateway获取方法？ -->
          </p>
          <FormItem label="Gateway  ID："
                    prop="getewayId"
                    :label-width="112">
            <Input v-model="invoiceFrom.getewayId"
                   placeholder />
          </FormItem>
          <FormItem label="密码："
                    prop="getewayPassword"
                    :label-width="112">
            <Input v-model="invoiceFrom.getewayPassword"
                   placeholder />
          </FormItem>
        </div>
      </Form>
      <div slot="footer"
           class="footerBox">
        <Button class="footerBt1"
                type="primary"
                :loading="loadEdit"
                @click="submit('invoiceFrom')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { baseInfoByCondition, taxWorkOrder } from "@/api/taxModule";
export default {
  props: {
    serviceInfo: {},
  },
  data() {
    return {
      invoiceFrom: {
        vatNumber: '',
        periodType: '',
        getewayId: '',
        getewayPassword: '',
        beginTime: '',
        servicesId: ''
      },
      modalInvoice: true,
      typePay: "0",
      loadEdit: false,
      declare: [],
      countryCode: '',
      vatNumberPrefix: '',
      vatNumberSuffixDigitLength: 0,
      options: {
        disabledDate(date) {
          return (date < Date.now() - 86400000)
        }
      },
      formRule: {
        vatNumber: [{ required: true, trigger: 'blur' }]
      }
    };
  },
  methods: {
    getInfo() {
      //获取申报周期
      baseInfoByCondition({ countryCode: this.serviceInfo.countryCode }).then(res => {
        if (res.code == 0) {
          this.vatNumberPrefix = res.data.vatNumberPrefix
          this.vatNumberSuffixDigitLength = res.data.vatNumberSuffixDigitLength
          let data = res.data, obj = {}
          if (data.monthPeriod === 0) this.declare.push({ type: '月报', status: 0 })
          if (data.quarterPeriod === 0) this.declare.push({ type: '季报', status: 1 })
          if (data.yearPeriod === 0) this.declare.push({ type: '年报', status: 2 })
        }
      }).finally(() => {
        this.reset()
      })
    },
    changeDate(date) {
      this.invoiceFrom.beginTime = date
    },
    changeState(val) {
      let obj = {
        state: val
      };
      this.$emit("changeState", obj);
    },
    submit(all) {
      let reg = /.*[\u4e00-\u9fa5]+.*$/
      if (this.invoiceFrom.vatNumber == '') {
        this.$Message.error('请填写VAT税号')
        return
      } else if (reg.test(this.invoiceFrom.vatNumber)) {
        this.$Message.error('请填写正确税号')
        return
      }

      if (this.invoiceFrom.periodType === '') {
        this.$Message.error('请选择申报周期')
        return
      }
      let obj = { ...this.invoiceFrom }
      obj.servicesId = this.serviceInfo.id
      obj.beginTime = this.formatDate(this.invoiceFrom.beginTime)
      obj.vatNumber = String(this.vatNumberPrefix) + String(this.invoiceFrom.vatNumber)
      // console.log(this.invoiceFrom)
      taxWorkOrder(obj).then(res => {
        if (res.code === 0) {
          this.$emit("changeState", { state: false, refresh: true });
          this.$Message.success(res.message)
        }
      })
    },
    formatDate(date) {
      if (typeof date === 'object' && date) {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d
      } else {
        return date
      }
    },
    reset() {
      if (this.serviceInfo.progressBar == 20) {
        let a = this.serviceInfo.vatTaxNumber
        let vatNumber = a.substring(this.vatNumberPrefix.length)
        this.invoiceFrom = {
          vatNumber,
          periodType: this.serviceInfo.periodType,
          getewayId: this.serviceInfo.gatewayId,
          getewayPassword: this.serviceInfo.gatewayPassword,
          beginTime: this.serviceInfo.nextDeclareTime,
          servicesId: this.serviceInfo.id
        }
      }
    }
  },
  created() {

  },
  mounted() {
    this.getInfo()
  }
};
</script>
<style lang="less" scoped>
.ivu-modal-footer {
  .footerBt1 {
    width: 80px;
  }
}
.footerBox {
  padding: 20px 0;
  margin-right: 12px;
}
.title {
  font-size: 14px;
  font-family: "PingFangSC-Medium,PingFang SC";
  font-weight: 500;
  color: rgba(48, 48, 51, 1);
}
.subTitle {
  font-size: 12px;
  font-family: "PingFangSC-Regular,PingFang SC";
  font-weight: 400;
  color: rgba(147, 147, 153, 1);
}
.engBox {
  width: 445px;
  height: 155px;
  margin: auto;
  background-color: #f6f6f6;
  padding: 22px;
}
&/deep/.ivu-input-icon-validate,
.ivu-form-item-validating .ivu-input-icon-validate {
  display: none;
}
&/deep/ .ivu-input-prefix {
  line-height: 32px;
}
&/deep/ .ivu-form-item {
  margin-bottom: 20px;
}
&/deep/ .ivu-form .ivu-form-item-label {
  font-size: 12px;
}
</style>