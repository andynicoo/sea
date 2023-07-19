<template>
  <div class="container"
       :style="contentStyleObj">
    <div class="headContent">
      <div class="top">
        <!-- <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem to="/remoteSales">
            <span class="clink">
              远程销售监控</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        远程销售监控
      </div>
    </div>
    <div class="infoTb">
      <div class="clearfix title_wait">
        <div class="flex content">
          <Form :model="taxForm"
                :label-width="0"
                style="width:100%;"
                label-position="left"
                inline
                ref="taxForm">
            <FormItem>
              <DatePicker type="year"
                          :value="new Date().getFullYear().toString()"
                          @on-change="changeYear"
                          placeholder="请选择年份"
                          style="width: 220px"></DatePicker>
            </FormItem>
            <FormItem prop="searchContent">
              <Input v-model="taxForm.searchContent"
                     style="width:220px;"
                     placeholder="请输入公司名称/VAT税号/服务号"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary"
                      @click="searchBtn()"
                      class="searchBtn">搜索</Button>
              <Button @click="handleReset('taxForm')"
                      class="resetBtn">重置</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div class>
        <div class="tbNull">
          <Table style="min-height:184px;"
                 :no-data-text="nodatas"
                 :columns="columns1"
                 :data="remoteSalesList">
            <template slot="operate"
                      slot-scope="{ row }">
              <div class="operate">
                <Button type="primary"
                        @click="toDetail(row)">详情</Button>
              </div>
            </template>
          </Table>
        </div>
        <div class="pageSetion clearfix">
          <Page class="pagination"
                :current="taxForm.page"
                :total="remoteSalesListTotal"
                @on-change="registerChangePageHandler"
                @on-page-size-change="registerPageSizeChangeHandler"
                :page-size="taxForm.limit" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { taxSaleCheck } from "@/api/taxModule";

export default {
  name: "Survey",
  components: {

  },
  data() {
    return {
      contentStyleObj: {
        height: ""
      },
      taxForm: {
        limit: 10,
        page: 1,
        year: '' || new Date().getFullYear().toString(),
        searchContent: ""
      },
      isShowDetail: true,
      remoteSalesListTotal: 0,
      remoteSalesList: [],
      nodatas: "暂无数据",
      // total: '',
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 50
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '公司英文名称',
          key: 'companyNameEn'
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '税号',
          key: 'vatTaxNumber'
        },
        {
          title: '是否有超远程国家',
          key: 'status',
          render(h, params) {
            if (params.row.status === 1) {
              return h("span", {
                style: {
                  color: 'red'
                }
              }, '是')
            } else {
              return h("span", '否');
            }
          }
        },
        {
          title: "操作",
          slot: "operate",
        }
      ],
    };
  },
  methods: {
    //屏幕高度
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + "px";
    },
    registerChangePageHandler(page) {
      this.taxForm.page = page;
      this.getTaxManageList(page);
    },
    registerPageSizeChangeHandler(pageSize) {
      this.taxForm.limit = pageSize;
      this.getTaxManageList();
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    searchBtn() {
      this.getTaxManageList(1)
    },
    //获取列表数据
    getTaxManageList(page) {
      if (page) {
        this.taxForm.page = page;
      }
      taxSaleCheck(this.taxForm).then(res => {
        if (res.code === 0) {
          this.remoteSalesList = res.data.records;
          this.remoteSalesListTotal = res.data.total - 0;
        }
      });
    },
    toDetail(row) {
      // console.log('row', row)
      this.$router.push({ path: "remoteSalesDetail", query: { vatTaxNumber: row.vatTaxNumber,countryNameZh:row.countryNameZh, year: row.year, countryCode: row.countryCode, companyName: row.companyName, companyNameEn: row.companyNameEn } })
    },
    changeYear(val) {
      this.taxForm.year = val
    },
  },
  created() {

  },
  mounted() {
    // this.getTaxManageList();
  }
};
</script>

<style lang="less" scoped>
.container {
  // max-width: 1292px;
  box-sizing: border-box;
  // padding: 0px 20px 15px 20px;
  // background: #fff;
  margin-bottom: 7px;
  border-radius: 2px;
  .headContent {
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 500;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  & .title {
    color: #212121;
    font-size: 18px;
    font-weight: bold;
    line-height: 56px;
  }
  .title_wait {
    margin: 0px 0 11px 0;
    .content {
      padding-top: 24px;
    }
    &/deep/ .ivu-form .ivu-form-item-label {
      font-weight: bold;
    }
    .tax-status {
      border-bottom: 1px solid rgba(153, 153, 153, 0.16);
      span.status-item {
        display: inline-block;
        width: 149px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(153, 153, 153, 0.1);
        border-radius: 4px 4px 0px 0px;
        border: 1px solid rgba(153, 153, 153, 0.16);
        color: #666;
        font-size: 14px;
        border-bottom: none;
        margin-right: 4px;
        cursor: pointer;
        .status-count {
          color: #ed3e3e;
        }
      }
      span.status-item.active {
        background: #ffffff;
        color: #2db7f5;
        .status-count {
          color: #2db7f5;
        }
      }
    }
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-bottom: 16px;
  }
  & .info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item {
      img {
        width: 102%;
        cursor: pointer;
      }
    }
    .item:nth-child(1) {
      margin-left: -5px;
    }
  }
  .infoTb {
    background-color: #fff;
    padding: 0px 27px;
    margin-top: 24px;
    margin-left: 24px;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  //TabsNav 样式
  & /deep/ .ivu-tabs-bar {
    margin: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #e6e6e6 !important;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar {
    border-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab {
    margin-right: 0px;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n) {
    border-top-right-radius: 0px;
    background: rgba(247, 247, 247, 1);
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n-1) {
    border-top-left-radius: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-active:nth-child(2n-1) {
    border-left-color: #fff !important;
    font-weight: 400;
  }
  //表格样式
  &/deep/.ivu-table:before {
    background-color: #f2f2f200;
  }
  &/deep/.ivu-table:after {
    background-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-table-wrapper {
    margin-bottom: 11px;
    border-color: #f2f2f2;
  }

  & .ivu-tabs /deep/ .ivu-table-wrapper tr td {
    color: #16ade9;
    font-size: 12px;
  }
  & /deep/ .ivu-table-tip tr {
    height: 144px;
  }
  .pageSetion {
    text-align: right;
    margin-top: 24px;
    padding-bottom: 36px;
    .pagination {
      display: inline-block;
      // margin-right: 12px;
      line-height: 20px;
    }
    .totalNum {
      // position: absolute;
      // top: 2px;
      // right: 0px;
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
.container {
  &/deep/.ivu-tabs .ivu-table-wrapper .ivu-table-tip tr td {
    color: #9a9ca1;
  }
  .tbNull {
    // position: relative;
    /deep/ .ivu-table table {
      border-left: 1px solid #ebebebff;
    }
    &/deep/ td .ivu-table-cell {
      font-size: 12px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      color: #333333;
      .grey {
        color: #999999;
      }
      .red {
        color: #16ade9;
      }
      .blue {
        color: #16ade9;
      }
      .yellow {
        color: #f79728;
      }
      .orange {
        color: #fc9153;
      }
      .green {
        color: #5ab187;
      }
    }
    .operate {
      text-align: center;
      img {
        width: 11px;
        margin-right: 4px;
        margin-bottom: 2px;
      }
      &/deep/ .ivu-btn-text {
        width: 63px;
        color: #16ade9;
        font-size: 12px;
        padding: 0 5px;
        text-align: left;
        background: #fff;
        border-color: #16ade9;
        margin-right: 10px;
        display: inline-block;
        margin-bottom: 10px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btF {
        min-width: 124px;
      }
      .btF.flex-center {
        min-width: 124px;
        background: none;
        color: #f79728;
        border-color: #f79728;
        border: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .red-button {
        color: #ed3e3e;
        border-color: #ed3e3e;
      }
      .upload-btn {
        border: none;
        border-color: #16ade9;
        color: #16ade9;
        background: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btR {
        min-width: 124px;
        background: #ed3e3e;
      }
    }
    /deep/ th .ivu-table-cell {
      font-size: 14px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    &/deep/ .ivu-table {
      color: #333333;
      font-size: 12px;
      td,
      th {
        border-bottom: 1px solid #e6e6e6;
        padding: 16px 0;
        text-align: center;
        // border-right: none;
        border-right: 1px solid #ebebebff;
      }
      th {
        color: #666666;
        font-weight: inherit;
        background: rgba(22, 173, 233, 0.2);
      }
    }
    &/deep/ .ivu-table-header {
      .ivu-table-cell {
        & > div div:nth-child(1) {
          font-weight: bold;
          font-size: 12px;
        }
        & > div div:nth-child(2) {
          // font-weight: bold;
          font-size: 10px;
        }
      }
    }
  }
  .activity-box,
  .activity-rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .invite-banner {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    .inviteBox {
      position: absolute;
      left: 50%;
      margin-left: -370px;
      .bg {
        width: 100%;
        height: auto;
      }
      .btn {
        width: 143px;
        height: 29px;
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);
        background: url(../../../assets/images/survey/inviteBtn.png) no-repeat;
        background-size: contain;
        text-align: center;
        color: #ed3e3e;
        font-size: 14px;
        font-weight: 500;
        line-height: 29px;
      }
    }
    .close {
      z-index: 9999999;
      top: 140px;
      left: 50%;
      position: absolute;
      margin-left: 340px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .container .info .info-item {
    padding-right: 16px;
  }
  .info-img {
    img {
      width: 100%;
    }
  }
  .info-right-wrapper {
    margin-left: 10px;
  }
}
.searchBtn {
  // margin-right: 12px;
  height: 32px;
  background-color: #16ade9;
  border: 1px solid rgba(230, 230, 230, 1);
  color: #ffffff;
  font-size: 12px;
  // margin-left: 10px;
  &/deep/ .ivu-icon {
    font-size: 17px;
    margin-top: 3px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 6px;
  }
}
.resetBtn {
  font-size: 12px;
  font-family: "Microsoft Yahei", "MicrosoftYaHei";
  color: #999999;
  border: none;
  line-height: 12px;
  border: 1px solid #cccccc;
  &/deep/ .ivu-icon {
    font-size: 19px;
    margin-top: 2px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 9px;
  }
}
.fr &/deep/.ivu-form-item {
  margin-bottom: 0;
}
.invit-title {
  font-size: 20px;
  font-weight: 500;
  color: #303033;
  text-align: center;
  margin-top: 22px;
}
.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #16ade9;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;

    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
@media screen and (min-width: 1882px) {
  .container .info .item:nth-child(1) {
    margin-left: -32px;
  }
}
</style>
