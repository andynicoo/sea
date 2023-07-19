<template>
  <div class="other">
    <h2>其他平台含税销售额</h2>
    <div class="desc">
      如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)
    </div>
    <div class="form ksy-mt-3">
      <!-- {{ form }} -->
      <a-form-model
        ref="ruleForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
        labelAlign="left"
        :rules="rules"
        :model="form"
      >
        <a-form-model-item label="含税销售额" prop="handIncludeTaxSales" class="xxx">
          <a-input
            v-model="form.handIncludeTaxSales"
            placeholder="请输入"
            v-positiveNumber="{ fixedNum: 2, maxNum: 1000000000, minNum: 0 }"
            :suffix="countryIcon"
          />
        </a-form-model-item>
        <a-form-model-item label="其它平台含税销售文件" prop="handIncludeTaxSalesFilePath">
          <div style="display: inline-grid" class="uploadbox">
            <a-upload
              :action="uplodPath"
              @change="(value) => handleChange(value, 'form', 'handIncludeTaxSalesFilePath', 'defaultFileList')"
              :data="{ prefix: '' }"
              :file-list="defaultFileList"
              accept=".xlsx,.xls,xlsx,.csv,.txt,.pdf,.jpg,.jpeg,.png,.word,.zip,.rar,.doc,.docx"
            >
              <a-button> <a-icon type="upload" /> 上传文件 </a-button>
            </a-upload>
            <span class="tips"> jpg, jpeg, png, gif, pdf, word, docx, xls, xlsx, csv, txt, zip, rar </span>
          </div>
        </a-form-model-item>
        <a-form-model-item
          label="其他平台平台代扣代缴金额"
          prop="handPlatformWithHoldandRemitTax"
          class="xxx"
          v-if="countryCode !== 'AE' && countryCode !== 'SA'"
        >
          <a-input
            v-model="form.handPlatformWithHoldandRemitTax"
            placeholder="请输入"
            v-positiveNumber="{ fixedNum: 2, maxNum: 1000000000, minNum: 0 }"
            :suffix="countryIcon"
          />
        </a-form-model-item>
      </a-form-model>
      <div class="ksy-text-center">
        <a-button type="primary" class="ksy-w100" @click="onSubmit">提交</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import aboutComputed from "@/mixins/about-computed";
export default {
  mixins: [aboutComputed],
  data() {
    return {
      rules: {
        handIncludeTaxSales: [{ required: true, message: "请填写含税销售额", trigger: "blur" }],
        handIncludeTaxSalesFilePath: [{ required: true, message: "请上传文件", trigger: "blur" }],
      },
      form: {
        handIncludeTaxSales: null, // 其他平台-含税销售额
        handIncludeTaxSalesFilePath: "", // 其他平台-销售文件路径
        handPlatformWithHoldandRemitTax: null, // 其他平台-代扣代缴金额
      },
    };
  },
  props: {
    countryCode: {
      type: String,
      default: "",
    },
    countryIcon: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.$emit("getOtherData", this.form);
          console.log(this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.form = {
        handIncludeTaxSales: null,
        handIncludeTaxSalesFilePath: "",
        handPlatformWithHoldandRemitTax: null,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.other {
  h2 {
    font-size: 16px;
    color: @textColor;
    font-weight: bold;
  }
  .desc {
    height: 60px;
    background: @warningLight;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border: 1px solid @warningDisable;
    padding: 10px 16px;
    color: @textColor;
    font-size: 12px;
  }
  .ant-form-item {
    margin-bottom: 20px;
  }
  .tips {
    color: @textColor4;
    height: 20px;
    line-height: 20px;
  }
}
</style>

<style lang="less">
.other {
  .ant-form-item-label {
    line-height: 20px; //这个数值视具体情况而定
  }
  label {
    white-space: normal;
    text-align: right;
    padding-right: 32px;
    font-size: 14px;
    &:after {
      content: none !important; //解决上面的样式label后面会有空格
    }
  }
  .uploadbox {
    .ant-btn {
      color: @primaryColor;
      border-color: @primaryColor;
    }
  }
}
</style>
