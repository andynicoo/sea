<!--  用户选择电子发票组件 -->
<template>
  <Form ref="contarctInput" :label-width="120" :model="invoiceForm" inline>
    <Row>
      <FormItem prop="contractType" label="电子合同签订：">
        <RadioGroup v-model="invoiceForm.contractType">
          <Radio label="1"
            >企业签订
            <Poptip class="contract-poptip" trigger="hover" placement="top">
              <img width="15px" src="../../../images/sureOrder/wenhao.png" />
              <div slot="content" class="contract-type-style">
                企业签订才能开对公增值和专用发票
              </div>
            </Poptip>
          </Radio>
          <Radio label="2" :disabled="radioDisabled">个人签订</Radio>
        </RadioGroup>
      </FormItem>
    </Row>
    <div v-if="invoiceForm.contractType == 1" class="formBox">
      <Row>
        <FormItem prop="contractCompanyName" label="企业名称：">
          <Input
            style="width: 266px"
            v-model="invoiceForm.contractCompanyName"
            placeholder="请输入企业名称"
            :disabled="isFinshed"
          ></Input>
        </FormItem>
      </Row>
      <Row>
        <FormItem prop="contractContactAddress" label="企业地址：">
          <Input
            style="width: 266px"
            v-model="invoiceForm.contractContactAddress"
            placeholder="请输入企业地址"
            :disabled="isFinshed"
          ></Input>
        </FormItem>
      </Row>
    </div>

    <Row class="formBox">
      <FormItem prop="contractContactPerson" label="联系人：">
        <Input
          style="width: 266px"
          v-model="invoiceForm.contractContactPerson"
          placeholder="请输入联系人"
          :disabled="isFinshed"
        ></Input>
      </FormItem>
    </Row>
    <Row v-if="invoiceForm.contractType == 2" class="formBox">
      <FormItem prop="contractContactAddress" label="联系地址：">
        <Input
          style="width: 266px"
          v-model="invoiceForm.contractContactAddress"
          placeholder="请输入地址"
          :disabled="isFinshed"
        ></Input>
      </FormItem>
    </Row>
    <Row class="formBox">
      <FormItem prop="contractContactPhone" label="联系方式：">
        <Input
          style="width: 266px"
          v-model="invoiceForm.contractContactPhone"
          placeholder="请输入联系方式"
          :disabled="isFinshed"
        ></Input>
      </FormItem>
    </Row>
  </Form>
</template>

<script>
export default {
  props: {
    isFinshed: Boolean,
    invoiceType: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      invoiceRule: {
        contractCompanyName: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
        ],
        contractContactPerson: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],

        contractContactPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],

        contractContactAddress: [
          { required: true, message: "请输入地址", trigger: "blur" },
        ],
      },
      invoiceForm: {
        contractContactAddress: "",
        contractCompanyName: "",
        contractContactPhone: "",
        contractContactPerson: "",
        // 电子发票
        contractType: "1",
      },
      radioDisabled: false,
    };
  },
  watch: {
    invoiceType: {
      immediate: true,
      handler(val) {
        if (val == "3" || val == "4") {
          this.invoiceForm.contractType = "1";
          this.radioDisabled = true;
        } else {
          this.radioDisabled = false;
        }
      },
      deep: true,
    },

    invoiceForm: {
      immediate: true,
      handler(val) {
        let {
          contractCompanyName,
          contractContactAddress,
          contractContactPhone,
        } = val;

        let obj = {
          companyName: contractCompanyName,
          companyAddress: contractContactAddress,
          companyTel: contractContactPhone,
        };
        this.$emit("updateInvoiceForm", obj);
      },
      deep: true,
    },
  },
  methods: {
    getValue() {
      return this.$refs.contarctInput.validate();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-form-item {
  margin-bottom: 20px;
}
</style>
