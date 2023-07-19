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
            <span class="flink">远程销售监控</span>
          </BreadcrumbItem>
          <BreadcrumbItem to="">
            <span class="clink">
              详情</span>
          </BreadcrumbItem>
        </Breadcrumb> -->
      </div>
      <div class="bottom">
        详情
      </div>
    </div>
    <div class="info">
      <img src="@/assets/images/common/blueTip.svg"
           alt="">
      <p>特别说明：远程销售额监控是欧盟国之间发货销售额监控，当您发货到欧盟国家的销售额达到阈值的50%--70%时，建议您及时在对应国家注册税号进行报税。如：德国的销售阈值为100000欧元，你在德国一年的累计销售额超过100000时，则需要在德国注册税号进行报税；</p>
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
            <FormItem prop="searchContent">
              <DatePicker type="year"
                          v-model="taxForm.year"
                          format="yyyy"
                          @on-change="changeYear"
                          placeholder="请选择年份"
                          style="width: 200px"></DatePicker>
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
        <div class="company">
          <!-- <div style="display:flex"> -->
          <div class="companyZh">
            公司中文名称：<span>{{taxForm.companyName}}</span>
          </div>
          <div class="companyEN">
            公司英文名称：<span>{{taxForm.companyNameEn}}</span>
          </div>
          <div class="companyEN">
            国家: <span>{{ countryNameZh }}</span>
          </div>

          <!-- </div> -->
          <div class="download">
            <Button type="info" ghost @click="downTable"><Icon type="ios-cloud-download-outline" style="font-size:16px;color:#16ADE9"/>下载表格</Button>
          </div>
        </div>
      </div>
      <div class>
        <div class="tbNull">
          <Table :data="returnDataSale"
                 width="100%"
                 max-height="500"
                 :columns="returnColumnSale">
            <template slot="includTaxPriceTotal"
                      slot-scope="{ row }">
              <span :class="Number(row.includTaxPriceTotal) > Number(row.moneyLimit) ?'red':''">{{row.includTaxPriceTotal}}</span>
            </template>
            <template slot="operate"
                      slot-scope="{ row }">
              <div class="btns"
                   v-if="row.vatNumberStatus === 0">
                <router-link to="/serviceList"><span class="apply">申请税号</span></router-link>
                <span class="line">|</span>
                <span class="exist"
                      @click="haveVatNumber(row)">已有税号</span>
              </div>
              <span class="application"
                    v-if="row.vatNumberStatus === 2">税号申请中</span>
              <span class="exist"
                    v-if="row.vatNumberStatus === 1 || row.vatNumberStatus === 3">已有税号</span>
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
import { taxSaleCheckInfo, taxSaleCheckVatNumber, downloadRemoteSalesTable } from "@/api/taxModule";
export default {
  name: "Survey",
  components: {
  },
  data() {
    return {
      // downloadTable:{
        countryNameZh:this.$route.query.countryNameZh || '暂无',
        companyName: this.$route.query.companyName || '暂无',
        countryCode: this.$route.query.countryCode,
        vatTaxNumber: this.$route.query.vatTaxNumber,
        year: this.$route.query.year,
        companyNameEn: this.$route.query.companyNameEn || '暂无',
      // },
      contentStyleObj: {
        height: ""
      },
      taxForm: {
        limit: 10,
        page: 1,
        vatTaxNumber: this.$route.query.vatTaxNumber,
        year: this.$route.query.year,
        countryCode: this.$route.query.countryCode,
        companyName: this.$route.query.companyName || '暂无',
        companyNameEn: this.$route.query.companyNameEn || '暂无'
      },
      remoteSalesListTotal: 0,
      remoteSalesList: [],
      nodatas: "暂无数据",
      returnColumnSale: [  // 远程销售表头
        {
          title: '到货国',
          key: 'arrivalName',
          width: 120
        },
        {
          title: '货币单位',
          key: 'currency',
          width: 120
        },
        {
          title: '1月',
          key: '01',
          width: 120
        },
        {
          title: '2月',
          key: '02',
          width: 120
        },
        {
          title: '3月',
          key: '03',
          width: 120
        },
        {
          title: '4月',
          key: '04',
          width: 120
        },
        {
          title: '5月',
          key: '05',
          width: 120
        },
        {
          title: '6月',
          key: '06',
          width: 120
        },
        {
          title: '7月',
          key: '07',
          width: 120
        },
        {
          title: '8月',
          key: '08',
          width: 120
        },
        {
          title: '9月',
          key: '09',
          width: 120
        },
        {
          title: '10月',
          key: '10',
          width: 120
        },
        {
          title: '11月',
          key: '11',
          width: 120
        },
        {
          title: '12月',
          key: '12',
          width: 120
        },
        {
          title: '含税销售额',
          slot: 'includTaxPriceTotal',
          width: 120
        },

        {
          title: '远程销售限额',
          key: 'moneyLimit',
          width: 120
        },
        {
          title: '是否需要注册税号',
          key: 'status',
          width: 140,
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
          fixed: 'right',
          width: 200
        },
      ],
      returnDataSale: [], // 远程销售数据
    };
  },
  methods: {
    //下载表格
    downTable(){
      let formData = new FormData()
      formData.append('companyName', this.companyName)
      formData.append('countryCode', this.countryCode)
      formData.append('vatTaxNumber', this.vatTaxNumber)
      formData.append('year', this.year)
      formData.append('companyNameEn', this.companyNameEn)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/taxSaleCheck/info/map/export', true)
      // 设置请求token
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'))
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'))
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = fileName
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
      },
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
    changeYear(val) {
      this.taxForm.year = val
    },
    //获取列表数据
    getTaxManageList(page) {
      if (page) {
        this.taxForm.page = page;
      }
      this.taxForm.year = this.formatDate(this.taxForm.year)
      taxSaleCheckInfo(this.taxForm).then(res => {
        if (res.code === 0) {
          this.returnDataSale = res.data;
          this.remoteSalesListTotal = res.data.length - 0;
        }
      });
    },
    haveVatNumber(row) {
      this.$Modal.confirm({
        title: '是否确认已有税号',
        content: '温馨提示：系统未检测到您有税号，请确认',
        onOk: () => {
          taxSaleCheckVatNumber({
            arrivalCode: row.arrivalCode,
            vatTaxNumber: this.vatTaxNumber,
            companyName: this.companyName
          }).then(res => {
            this.$Message.success('操作成功')
            this.getTaxManageList(1)
          }).catch(err => {
            console.log(err)
          })
        },
      });
    },
    formatDate(date) {
      if (typeof date === "object" && date) {
        const y = date.getFullYear();
        return String(y);
      } else {
        return date
      }

    },
  },
  created() {

  },
  mounted() {
    this.getTaxManageList();
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
    height: 100px;
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
    .company {
      display: flex;
      padding: 24px 0px 18px;
      justify-content: space-between;
      .companyZh,
      .companyEN {
        font-size: 16px;
        font-family: "Microsoft Yahei", PingFangSC;
        color: #666666;
        line-height: 22px;
        span {
          font-weight: 500;
          color: #333333;
        }
      }
      .companyZh {
        // margin-right: 80px;
      }
    }
    &/deep/ .ivu-form .ivu-form-item-label {
      font-weight: bold;
    }
    /deep/ .ivu-form-item {
      margin-bottom: 0px !important;
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
  .info {
    margin: 24px;
    margin-bottom: 0px;
    background: #d7eefa;
    font-size: 14px;
    font-family: "Microsoft Yahei", PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    padding: 10px;
    border-radius: 4px 4px 0px 0px;
    img {
      margin-right: 5px;
      margin-bottom: 23px;
    }
  }
  .infoTb {
    background-color: #fff;
    padding: 0px 27px;
    margin-left: 24px;
    margin-right: 24px;
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
        background: #d7eefa;
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
    .btns {
      display: flex;
      justify-content: center;
      .line {
        margin: 0px 12px;
        // width: 1px;
        // height: 20px;
        // background: #ebebeb;
      }
    }
    .apply,
    .exist,
    .application {
      font-size: 14px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 14px;
      cursor: pointer;
    }
    .apply {
      color: #ed3e3e;
    }
    .exist {
      color: #16ade9;
    }
    .application {
      color: #1890ffff;
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
  font-family: "MicrosoftYaHei";
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
