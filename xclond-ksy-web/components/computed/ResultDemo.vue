<template>
  <div class="result">
    <h2>税金计算结果</h2>
    <div class="content">
      <a-row>
        <a-col :span="6" class="ksy-mb-3">
          <span>含税销售总额：</span>{{ resultData.currencySign }}{{ resultData.includeTaxSales }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3">
          <span>不含税销售总额：</span>{{ resultData.currencySign }}{{ resultData.excludeTaxSales }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3">
          <span>抵扣金额：</span>{{ resultData.currencySign }}{{ resultData.discountAmount }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3">
          <span>销项税额：</span>{{ resultData.currencySign }}{{ resultData.outputTax }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode !== 'SA' && countryCode !== 'AE'">
          <span>平台代扣代缴：</span>{{ resultData.currencySign }}{{ resultData.platformWithholdandremitTax }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode !== 'SA' && countryCode !== 'AE'">
          <span>B2B不含税销售额：</span>{{ resultData.currencySign }}{{ btobVal.toFixed(2) }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode === 'DE'">
          <span>欧盟内免税收购项金额：</span>{{ resultData.currencySign }}{{ resultData.purchaseAmount }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode === 'DE'">
          <span>欧盟内免税采购项金额：</span>{{ resultData.currencySign }}{{ resultData.freePurchasePrice || 0 }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode === 'GB'">
          <span>PVA金额：</span>{{ resultData.currencySign }}{{ resultData.enPvaAmount }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode === 'ES'">
          <span>ECL销售项金额：</span>{{ resultData.currencySign }}{{ resultData.eclSales }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3" v-if="countryCode === 'ES'">
          <span>ECL采购项金额：</span>{{ resultData.currencySign }}{{ resultData.eclPurchaseAmount }}
        </a-col>
        <a-col :span="6" class="ksy-mb-3">
          <span>最终应缴税金：</span>{{ resultData.currencySign }}{{ resultData.tax }}
        </a-col>
      </a-row>
      <div class="line"></div>
      <h3>税金计算明细</h3>
      <!-- {{ countryCode }}--{{ this.$props.countryCode === "AE" }}
      <br />
      {{ columns }} -->
      <a-table
        :columns="columns"
        :data-source="data"
        v-if="countryCode !== 'SA'"
        :pagination="false"
        :bordered="true"
        :scroll="{ y: 450 }"
      >
        <template slot="includTaxPrice" slot-scope="text, record">
          {{ record.includTaxPrice }} {{ record.currencySign }}
        </template>
      </a-table>
      <div class="ksy-tc ksy-mt-2">
        <a-space>
          <a-button
            type="primary"
            v-if="resultData.taxPriceDetailDtos && resultData.taxPriceDetailDtos.length"
            @click="downloadFile"
            :loading="loading"
          >
            下载明细
          </a-button>
          <a-button @click="cancel"> 取消 </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { add,divide } from "lodash";
export default {
  props: {
    resultData: {
      type: Object,
      default: () => [],
    },
    countryCode: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  computed: {
    btobVal() {
      return add(this.resultData.b2bExcludeTaxSales, this.resultData.notVatNumberB2bExcludeTaxSales);
    },
    columns() {
      if (this.$props.countryCode === "AE") {
        return [
          {
            title: "日期",
            key: "month",
          },
          {
            title: "收货人",
            key: "consignee",
          },
          {
            title: "辖区",
            key: "area",
          },
          {
            title: "含税销售额",
            key: "includTaxPrice",
          },
          {
            title: "不含税销售额",
            key: "notIncludTaxPrice",
          },
          {
            title: "税率",
            key: "rate",
          },
          {
            title: "应缴税金",
            key: "taxPayablePrice",
          },
        ];
      } else {
        return [
          {
            title: "销售月份",
            key: "month",
            dataIndex: "month",
          },
          {
            title: "发出国",
            key: "deptCountryName",
            dataIndex: "deptCountryName",
          },
          {
            title: "到货国",
            key: "arriCountryName",
            dataIndex: "arriCountryName",
          },
          {
            title: "币种",
            key: "currency",
            dataIndex: "currency",
          },
          {
            title: "汇率",
            key: "rate",
            dataIndex: "rate",
          },
          {
            title: "含税销售额",
            key: "includTaxPrice",
            scopedSlots: { customRender: "includTaxPrice" },
            dataIndex: "includTaxPrice",
          },
        ];
      }
    },
  },
  mounted() {
    this.$data.data = this.resultData.taxPriceDetailDtos;
  },
  methods: {
    cancel() {
      this.$emit("closeResult", false);
    },
    downloadFile() {
      let params = {
        ...this.resultData, // 结果数据
        ...this.formData, // 提交表单数据
      };
      params.taxRate = divide(Number(params.taxRate.replace("%", "")), 100);
      this.loading = true;
      this.$axios({
        url: process.env.SERVER_URL + "/api/workorder/tax/taxDetailDownLoad",
        data: params,
        method: "post",
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.data) {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const link = document.createElement("a");
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = `销售数据报表.xlsx`; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        } else {
          this.$message.error(res.message);
        }
      }).catch(err=>{
        console.log(err)
        this.$message.error('请重试');
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  color: @textColor;
  font-size: 14px;
  h2 {
    font-size: 16px;
    color: @textColor;
    font-weight: bold;
    margin-bottom: 25px;
  }
  span {
    color: @textColor4;
  }
  .line {
    height: 1px;
    background: #e3e3e3;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
  }
  h3 {
    font-size: 14px;
    color: @textColor6;
    font-weight: bold;
    margin-bottom: 15px;
    margin-top: 17px;
  }
}
</style>
