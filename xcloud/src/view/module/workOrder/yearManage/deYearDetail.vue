<template>
  <div class="app-container">
    <div class="back" @click="goBack()">
      <Icon type="ios-arrow-back" />
      返回列表
    </div>
    <div class="container">
      <ul class="text-desc dis-flex">
        <li>
          <span class="text-title">公司中文名称：</span>
          <span class="text-info">{{ thatDEinfo.companyNameZh }}</span>
        </li>
        <li>
          <span class="text-title">VAT税号：</span>
          <span class="text-info">{{ thatDEinfo.vatTaxNumber }}</span>
        </li>
        <li>
          <span class="text-title">年度申报时间/年：</span>
          <span class="text-info">{{ thatDEinfo.year }}年</span>
        </li>
        <li>
          <span class="text-title">公司英文名称：</span>
          <span class="text-info">{{ thatDEinfo.companyNameEn }}</span>
        </li>
        <li>
          <span class="text-title">申报区间：</span>
          <span class="text-info">{{ thatDEinfo.beginTime }}至{{ thatDEinfo.endTime }}</span>
        </li>
        <li>
          <span class="text-title" v-if="thatDEinfo.declMethod === '0'">申报回执：</span>
          <span class="text-info" v-if="thatDEinfo.declMethod === '0'">
            <a target="_blank" :href="thatDEinfo.declareReceipt" v-if="thatDEinfo.declareReceipt != ''">查看</a>
          </span>
          <span class="text-title" v-if="thatDEinfo.declMethod === '1'">汇总年报申报回执：</span>
          <span class="text-info" v-if="thatDEinfo.declMethod === '1'">
            <span v-for="item in declareReceiptList" :key="item">
              <a target="_blank" :href="item" v-if="item != ''" style="margin-right: 5px">查看</a>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <div class="container">
      <div class="block-title big-size">
        申报数据
        <a style="margin-left: 5px" target="_blank" :href="sellOfflineFile" v-if="thatDEinfo.declMethod === '1' && sellOfflineFile != ''">查看申报数据文件</a>
      </div>
      <Table :data="deAnnalsData" :columns="deAnnalsColumns" border>
        <template slot="fillDiscount" slot-scope="{ row }">
          <div
            @click="
              discountBox = true;
              dataDeclare = row;
            "
            style="cursor: pointer; color: #1890ff"
          >
            查看
          </div>
        </template>
        <template slot="declareReceipt" slot-scope="{ row }">
          <div>
            <span v-if="row.declareReceipt == ''">暂无</span>
            <span v-else class="tax-info-value">
              <a target="_blank" :href="row.declareReceipt" v-if="row.declareReceipt != ''">查看</a>
            </span>
            <!-- <el-image
              v-else
              style="width: 100px; height: 100px"
              :src="row.declareReceipt"
              :preview-src-list="[row.declareReceipt]"
            ></el-image> -->
          </div>
        </template>
        <template slot="payReceipt" slot-scope="{ row }">
          <div>
            <span v-if="row.payReceipt == ''">暂无</span>
            <span v-else class="tax-info-value">
              <a target="_blank" :href="row.payReceipt" v-if="row.payReceipt != ''">查看</a>
            </span>
            <!-- <el-image
              v-else
              style="width: 100px; height: 100px"
              :src="row.payReceipt"
              :preview-src-list="[row.payReceipt]"
            ></el-image> -->
          </div>
        </template>
      </Table>
      <div class="collect-box" :key="totalCollect">
        <div class="total-left">年度申报汇总</div>
        <div class="total-right">
          <div class="total-right-top">
            <span>不含税销售额累计：€ {{ returnTaxData.excludeTaxPrice }}</span>
            <span>进项税额累计：€ {{ returnTaxData.deductionPrice }}</span>
            <span>欧盟内免税收购项(递延清关)累计：€ {{ returnTaxData.otherEcAcqPrice }}</span>
          </div>
          <div class="total-right-bottom">
            <span>平台代扣代缴金额累计：€ {{ returnTaxData.agentAmt }}</span>
            <span>实缴金额累计：€ {{ returnTaxData.paidTaxPrice }}</span>
            <span>应缴金额累计：€ {{ returnTaxData.allTaxPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="discountBox" title="抵扣金额" :mask-closable="false">
      <Form :model="dataDeclare" :label-width="127">
        <FormItem label="发票抵扣">
          <Input v-model="dataDeclare.invoiceDeductiontPrice" placeholder="请输入发票抵扣金额" style="width: 200px; margin-right: 10px"></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="C88抵扣">
          <Input v-model="dataDeclare.c88DeductiontPrice" placeholder="请输入C88抵扣金额" style="width: 200px; margin-right: 10px"></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="B2B发票抵扣">
          <Input v-model="dataDeclare.b2bDeductionPrice" placeholder="请输入B2B发票抵扣金额" style="width: 200px; margin-right: 10px"></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="其它抵扣">
          <Input v-model="dataDeclare.euDeductiontPrice" placeholder="请输入其它抵扣金额" style="width: 200px; margin-right: 10px"></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="共享库存_采购">
          <Input v-model="dataDeclare.comminglingBuySale" placeholder="请输入共享库存_采购金额" style="width: 200px; margin-right: 10px"></Input>
          EUR（欧元）
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="discountBox = false">确认</Button>
        <Button type="primary" ghost @click="discountBox = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import * as APIDE from "@/api/taxService/annalsDE.js";
import { getOrderYearListAPI, OrderYearDetailAPI } from '@/api/newApi/workOrder/annualReport';
import annalsDE from './components/annalsDE.vue';
import { mapMutations } from 'vuex';
export default {
  components: {
    annalsDE,
  },
  data() {
    return {
      totalCollect: new Date().getTime(),
      thatDEinfo: { ...this.$route.query },
      dataDeclare: {},
      discountBox: false,
      listLoading: false,
      declareReceiptList: [],
      sellOfflineFile: '',
      deAnnalsColumns: [
        {
          title: '申报周期',
          align: 'center',
          render(h, params) {
            let declarePeriod = params.row.declarePeriod;
            return h('span', declarePeriod == 0 ? '月报' : declarePeriod == 1 ? '季报' : declarePeriod == 2 ? '年报' : '');
          },
        },
        {
          title: '申报月份/季度',
          align: 'center',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            return h('span', beginTime + '至' + endTime);
          },
        },
        {
          title: '不含税销售额（欧元）',
          align: 'center',
          key: 'excludeTaxPrice',
        },
        {
          title: '欧盟内免税收购项金额（递延清关）',
          align: 'center',
          key: 'otherEcAcqPrice',
        },
        {
          title: '平台代扣代缴',
          align: 'center',
          key: 'agentAmt',
        },
        {
          title: 'B2B不含税销售额（€）',
          align: 'center',
          key: 'b2bExcludeTaxPrice',
        },
        {
          title: '45项数据（€）',
          align: 'center',
          key: 'otherCountryNoTaxPrice',
        },
        {
          title: '应缴金额（欧元）',
          align: 'center',
          key: 'allTaxPrice',
        },
        {
          title: '实缴金额（欧元）',
          align: 'center',
          key: 'paidTaxPrice',
        },
        {
          title: '抵扣金额（选填）',
          align: 'center',
          slot: 'fillDiscount',
        },
        {
          title: '税率',
          align: 'center',
          render(h, params) {
            return h('span', params.row.taxRate + '%');
          },
        },
        {
          title: '申报回执',
          align: 'center',
          slot: 'declareReceipt',
        },
        {
          title: '缴费凭证',
          align: 'center',
          slot: 'payReceipt',
        },
      ],
      showDEannals: false,
      workId: '',
      baseDataDe: {},
      annalsDeData: [],
      detailsReturnData: {},
      pageData: {
        auditStatus: '',
        countryCode: '',
        status: '',
        year: '',
        inputStr: '',
        page: 1,
        limit: 10,
      },
      total: 0,
      serviceId: '',
      deYearDetail: false,
      deAnnalsData: [],
      auditStatusList: {
        0: '未审核',
        1: '已审核',
        // 2: "被驳回",
      },
      statusList: {
        21: '待提交报税资料',
        27: '申报完成',
      },
      // 累计项
      returnTaxData: {
        allTaxPrice: 0, // 应缴金额累计
        deductionPrice: 0, //抵扣金额累计
        excludeTaxPrice: 0, // 不含税销售额累计
        paidTaxPrice: 0, //实缴金额累计
        otherEcAcqPrice: 0, //【欧盟内免税收购项(递延清关)累计】
        agentAmt: 0, //【平台代扣代缴金额累计】
      },
    };
  },
  methods: {
    /** 表格值累加汇总 */
    getSummaries(param) {
      param.forEach((item) => {
        // 抵扣金额累计（发票抵扣+C88抵扣+b2b抵扣+其他抵扣+共享库存_购买不含税销售额（取页面精确到2位数的数值）*0.19）
        let { invoiceDeductiontPrice, c88DeductiontPrice, b2bDeductionPrice, euDeductiontPrice, comminglingBuySale } = item;
        let val = Number(invoiceDeductiontPrice) + Number(c88DeductiontPrice) + Number(b2bDeductionPrice) + Number(euDeductiontPrice) + Number(comminglingBuySale) * 0.19;
        this.returnTaxData.deductionPrice += this.$printFn(val);
        Object.keys(item).forEach((ele) => {
          if (ele == Object.keys(this.returnTaxData).find((v) => v == ele)) {
            this.returnTaxData[ele] += this.$printFn(Number(item[ele]));
            this.returnTaxData[ele] = this.$printFn(Number(this.returnTaxData[ele]));
          }
        });
      });
      this.returnTaxData.deductionPrice = this.$util.formatPrice(this.returnTaxData.deductionPrice);
    },

    handleReset() {
      this.pageData = {
        auditStatus: '',
        countryCode: '',
        year: '',
        status: '',
        inputStr: '',
        page: 1,
        limit: 10,
      };
    },
    handleSubmit() {
      this.pageData.page = 1;
      this.pageData.limit = 10;
      if (typeof this.pageData.year === 'object' && this.pageData.year) {
        this.pageData.year = this.pageData.year.getFullYear() + '';
      }
      this.getDEannals();
    },

    //获取德国年报工单详情
    getDEyearDetailFun() {
      let data = { workId: this.thatDEinfo.id };
      OrderYearDetailAPI(data).then((res) => {
        if (res.code === 0) {
          this.deAnnalsData = res.data;

          Array.isArray(res.data) && res.data.length > 0 && this.getSummaries(res.data);
        }
      });
    },
    registerChangePageHandler(page) {
      this.pageData.page = page;
      this.getDEannals();
    },
    changePageSize(val) {
      this.pageData.limit = val;
      this.getDEannals();
    },
    ...mapMutations(['closeTag']),
    goBack() {
      this.closeTag(this.$route);
      this.$router.push('/workOrder/yearManage/index');
    },
    getDEannals() {
      getOrderYearListAPI(this.pageData).then((res) => {
        if (res.code === 0) {
          this.annalsDeData = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
  },
  created() {
    // this.getDEannals();
    this.getDEyearDetailFun();
    const { declMethod, declareReceipt, sellOfflineFile } = { ...this.$route.query };
    if (declMethod == '1') {
      this.declareReceiptList = declareReceipt.split(',');
      if (sellOfflineFile) this.sellOfflineFile = sellOfflineFile;
    }
  },
};
</script>

<style scoped lang="less">
a {
  color: #1890ff;
}

.block-title {
  margin-bottom: 20px;
}
.back {
  margin-bottom: 20px;
  cursor: pointer;
}
.container {
  border: 1px solid #eeeeee;
  padding: 20px;
  // line-height: 30px;
  margin-bottom: 30px;
}
img {
  width: 100px;
}
.text-title {
  width: auto !important;
  text-align: inherit !important;
}
.app-container {
  margin: 10px;
  padding: 35px;
  background: #ffffff;
  border-radius: 2px;
  .followPerson {
    text-align: center;
    padding: 10px;
    font-size: 14px;
  }
  .pagination-container {
    margin-top: 24px;
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
}
.collect-box {
  padding: 16px 20px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  // border: 1px solid rgba(153, 153, 153, 0.19);
  // border-top: none;
  display: grid;
  grid-template-columns: 100px 1200px;
  justify-items: left;
  .total-right {
    width: 100%;
    > div {
      display: grid;
      grid-template-columns: repeat(3, 33%);
      text-align: left;
    }
  }
  span {
    margin-left: 34px;
  }
}
</style>
