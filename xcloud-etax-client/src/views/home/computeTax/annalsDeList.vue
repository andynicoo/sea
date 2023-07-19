<template>
  <div class="app-container">
    <div class="commontitle">
       年报管理
    </div>
    <!-- main -->
    <div class="main-container" v-if="!showDEannals">
      <!-- 查询条件 -->
      <div class="search-box">
        <Form
          :model="pageData"
          label-position="right"
          :label-width="150"
          inline
          ref="pageData"
          :label-colon="true"
          style="width: 100%"
        >
          <Row>
            <Col span="8">
              <FormItem label="公司中文名称" prop="companyNameZh">
                <Input v-model="pageData.companyNameZh" clearable placeholder="请输入公司中文名称" style="width: 200px" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="公司英文名称" prop="companyNameEn">
                <Input v-model="pageData.companyNameEn" clearable placeholder="请输入公司英文名称" style="width: 200px" />
              </FormItem>
            </Col>
         
            <Col span="8">
              <FormItem :label-width="0">
                <Button type="primary" icon="md-search" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
                <Button @click="handleReset" icon="md-refresh" style="margin-left: 10px">重置</Button>
              </FormItem>
            </Col>
          </Row>
          
          <Row>
            <Col span="8">
              <FormItem label="税号" prop="vatTaxNum">
                <Input v-model="pageData.vatTaxNum" clearable placeholder="请输入税号" style="width: 200px" />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="年度申报时间（年）" prop="year">
                <DatePicker
                  type="year"
                  v-model="pageData.year"
                  placeholder="请选择年度申报时间"
                  style="width: 200px"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="服务进度" prop="status">
                <Select v-model="pageData.status" clearable style="width: 200px" placeholder="请选择服务进度">
                  <Option :value="'21'">{{ "待提交申报" }}</Option>
                  <Option :value="'27'">{{ "申报完成" }}</Option>
                </Select>
              </FormItem>
            </Col>
            <!-- <Col span="8">
              <FormItem label="审核状态" prop="auditStatus">
                <Select v-model="pageData.auditStatus" clearable style="width: 200px" placeholder="请选择审核状态">
                  <Option :value="'0'">{{ "未审核" }}</Option>
                  <Option :value="'1'">{{ "已审核" }}</Option>
                </Select>
              </FormItem>
            </Col> -->
          </Row>
        </Form>
      </div>
      <!-- 表格 -->
      <div class="table">
        <Table :data="annalsDeData" :columns="annalsDeColumns" style="margin-bottom: 40px; margin-top: 40px">
          <template slot="operation" slot-scope="{ row }">
            <div class="operation-box">
              <span v-if="row.status == 21" style="cursor: pointer; color: #f79728" @click="goAnnalsDE(row, false)">
                <!-- <img src="@/assets/images/common/upload_new.svg" alt="" style="position: relative; top: 3px" /> -->
                提交申报
              </span>
              <span v-if="row.status == 27 && row.declareReceipt != '' && !row.declMethod">
                <a :href="row.declareReceipt" target="_blank">
                  <img src="@/assets/images/common/download-small.png" alt="" style="position: relative; top: 3px" />
                  查看回执
                </a>
              </span>
              <span v-if="row.status == 27 && row.declareReceipt != '' && row.declMethod">
                <a @click="showDeclareReceipt(row)">
                  <img src="@/assets/images/common/download-small.png" alt="" style="position: relative; top: 3px" />
                  查看回执
                </a>
              </span>
              <span @click="goAnnalsDE(row, true)" style="cursor: pointer; color: #16ade9; margin-left: 5px">
                <!-- <img src="@/assets/images/common/detail.svg" alt="" style="position: relative; top: 3px" /> -->
                详情
              </span>
            </div>
          </template>
        </Table>
        <div>
          <Page
            class="pagination"
            @on-change="registerChangePageHandler"
            :current="pageData.page"
            :total="total"
            :page-size="pageData.limit"
            show-elevator
            show-sizer
          />
        </div>
      </div>
    </div>
    <annalsDE
      v-if="showDEannals"
      :workId="workId"
      :serviceId="serviceId"
      :baseData="baseDataDe"
      :isDetails="isDetails"
      :detailsReturnData="detailsReturnData"
      @back="goBack"
    ></annalsDE>
    <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :imglist="imglist" />
  </div>
</template>

<script>
import { annalsDetailDElist } from "@/api/annalsDE/index";
import { baseInfo } from "@/api/shoppingCar/shoppingCar";
import annalsDE from "./annalsDe";
import ShowReceiptDialog from './components/showReceiptDialog'
export default {
  components: {
    annalsDE,
    ShowReceiptDialog
  },
  data() {
    return {
      annalsDeColumns: [
        {
          title: "年度申报时间（年）",
          align: "center",
          key: "year",
        },
        {
          title: "公司名称",
          align: "center",
          key: "companyNameZh",
        },
        {
          title: "国家",
          align: "center",
          key: "countryNameZh",
        },
        {
          title: "业务名称",
          align: "center",
          render(h, params) {
            let status = params.row.productFunctionCode;
            return h("span", status == 2 ? "转代理+申报" : "注册+申报");
          },
        },
        {
          title: "年度申报区间",
          align: "center",
          render(h, params) {
            return h("span", params.row.corridor || "暂无");
          },
        },
        // {
        //   title: "审核状态",
        //   align: "center",
        //   render(h, params) {
        //     let status = params.row.auditStatus;
        //     return h("span", status == 0 ? "未审核" : status == 1 ? "已审核" : status == 2 ? "被驳回" : "");
        //   },
        // },
        {
          title: "进度",
          align: "center",
          render(h, params) {
            let status = params.row.status;
            if (status == 21) {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "#F79728",
                    },
                  },
                  "待申报"
                ),
              ]);
            }
            if (status == 27) {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "#16ADE9",
                    },
                  },
                  "申报完成"
                ),
              ]);
            }
          },
        },
        {
          title: "操作",
          align: "center",
          slot: "operation",
        },
      ],
      countryList: [],
      showDEannals: false,
      workId: "",
      isDetails: false,
      baseDataDe: {},
      detailsReturnData: {},
      annalsDeData: [],
      showReceiptImgModel: false,
      imglist: [],
      pageData: {
        auditStatus: "",
        countryCode: "",
        status: "",
        year: "",
        vatTaxNum: "",
        companyNameZh:'',
        companyNameEn:'',
        page: 1,
        limit: 10,
      },
      total: 0,
      serviceId: "",
    };
  },
  methods: {
    handleReset() {
      this.pageData = {
        auditStatus: "",
        countryCode: "",
        year: "",
        status: "",
        vatTaxNum: "",
        companyNameZh:'',
        companyNameEn:'',
        page: 1,
        limit: 10,
      };
    },
    showDeclareReceipt(row) {
      this.imglist = row.declareReceipt.split(',')
      this.showReceiptImgModel = true; 
    },
    handleSubmit() {
      this.pageData.page = 1;
      this.pageData.limit = 10;
      if (typeof this.pageData.year === "object" && this.pageData.year) {
        this.pageData.year = this.pageData.year.getFullYear() + "";
      }
      this.getDEannals();
    },
    //获取国家
    getCountry() {
      baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    registerChangePageHandler(page) {
      this.pageData.page = page;
      this.getDEannals();
    },
    goBack() {
      this.showDEannals = false;
      this.getDEannals();
    },
    getDEannals() {
      annalsDetailDElist(this.pageData).then((res) => {
        if (res.code === 0) {
          this.annalsDeData = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
    goAnnalsDE(row, type) {
      this.workId = row.id;
      this.isDetails = type;
      this.serviceId = row.serviceId;
      let beginTime = "";
      if (row.productFunctionCode == 5 || (row.productFunctionCode == 2 && row.beginTime)) {
        beginTime = row.beginTime.slice(0, 7);
      }
      let endTime = row.endTime.slice(0, 7);
      this.baseDataDe = {
        companyName: row.companyNameZh,
        companyNameEn: row.companyNameEn,
        vatTaxNumber: row.vatTaxNumber,
        year: row.year,
        time: beginTime + "至" + endTime,
        beginTime: beginTime,
        endTime: endTime,
        productFunctionCode: row.productFunctionCode,
        declareReceipt: row.declareReceipt,
      };
      this.detailsReturnData = {
        excludeTaxPrice: row.excludeTaxPrice,
        deductionPrice: row.deductionPrice,
        allTaxPrice: row.allTaxPrice,
      };
      this.showDEannals = true;
    },
  },
  created() {
    this.getDEannals();
    // this.getCountry();
  },
};
</script>

<style scoped lang="less">
.app-container {
    padding: 0;
}
.header-container {
  height: 78px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  padding: 20px 32px;
  .header-title {
    font-size: 20px;
    margin-top: 16px;
    font-weight: 500;
    color: #333;
  }
}
.main-container {
  background: #fff;
//   border-radius: 20px;
  margin: 24px;
  overflow: hidden;
  .search-box {
    padding: 24px 24px 0px 24px;
    border-bottom: 1px solid #e9e9e9;
  }
  .table {
    overflow: hidden;
    background: #ffffff;
    padding: 0 24px 24px 24px;
  }
  .pagination {
    text-align: right;
  }
}
.title {
  height: 78px;
  background: #ffffff;
  -webkit-box-shadow: 0px 1px 4px 0px rgb(0 21 41 / 12%);
  box-shadow: 0px 1px 4px 0px rgb(0 21 41 / 12%);
  padding: 20px 32px;
  font-size: 20px;
  font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
}
</style>
