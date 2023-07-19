<template>
  <div class="mainContent">
    <div class="my-card " :style="contentStyleObj">
      <div class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'kby'" />
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'wg'" />
        <span class="title">我的订单</span>
        <span class="line"></span>
        <span
          class="status"
          :class="status == index ? 'active' : ''"
          v-for="(item, index) in statusList"
          :key="index"
          @click="changeStatus(index, item.status)"
          >{{ item.text }}</span
        >
      </div>
      <div class="no-data" v-if="tableData.length == 0">
        <img src="https://fdfs.itaxs.com/group1/M00/04/9B/rBLKNV_HhkiAdyssAABP3OKB26c631.png" alt="" />
        <p>您还没有购买过服务哦~，去首页逛逛吧~</p>
        <button @click="goHome">去首页</button>
      </div>
      <div class="table-box" v-else>
        <table style="width: 100%;text-align: center" class="order-table" cellpadding="0" cellspacing="0">
          <tr class="header">
            <th style="width:302px;">服务</th>
            <th style="width:66px;">数量</th>
            <th style="width:106px;">商品售价</th>
            <th style="width:166px;">小计</th>
            <th style="width:106px;">状态</th>
            <th style="width:162px;">操作</th>
          </tr>
          <div v-for="(item, index) in tableData" :key="index">
            <p class="title clearfix">
              <span>订单编号：{{ item.orderNo }}</span>
              <span>下单时间：{{ item.createTime }}</span>
              <span v-if="item.auditRemark" class="reason">驳回原因：{{ item.auditRemark }}</span>

              <!-- 判断答复审查意见订单 -->
              <template v-if="getItemFuncode(item) && item.orderSource != 'IN'">
                <span
                  class="fr"
                  v-if="item.outTime && item.orderStatus == 'WAIT_PAY' && item.trademarkOaProductOrder === 0"
                >
                  <img src="@/assets/images/setting/daojishi.svg" alt="" />
                  <span>{{ item.outTime }}</span> 订单将自动取消
                </span>
              </template>
            </p>
            <tr>
              <td style="width:302px;" class="service-box">
                <div v-for="(v, i) in item.clientOrderProductVOList" :key="i" class="order-productVO">
                  <p>
                    服务名称：
                    <span>{{ v.productName }}</span>
                  </p>
                  <template v-if="!v.groupFlag">
                    <p v-if="v.specsNameList.length > 0">
                      服务项目：<span>{{ v.specsNameList.join() }}</span>
                    </p>
                    <dl
                      v-if="
                        v.productAdditionSpec.length &&
                          v.productAdditionSpec[0].productAdditionSpecCalcType == 'QUANTITY'
                      "
                      class="product-addition-spec"
                    >
                      <dt>附加服务：</dt>
                      <dd>
                        <p :key="index" v-for="(addiSpec, index) in v.productAdditionSpec[0].productAdditionSpecDetail">
                          {{ addiSpec.productAdditionSpecName }} * {{ addiSpec.productAdditionSpecQuantity }}
                        </p>
                      </dd>
                    </dl>
                  </template>
                  <template v-else>
                    <ul>
                      <li class="product-child-li" v-for="(productSub, index) in v.orderProductSpecsList" :key="index">
                        <div class="product-index">服务{{ index + 1 }}</div>
                        <div>
                          <p>
                            服务名称：
                            <span>{{ productSub.productName }}</span>
                          </p>
                          <p v-if="productSub.specsNameList.length > 0">
                            服务项目：<span>{{ productSub.specsNameList.join() }}</span>
                          </p>
                          <dl
                            v-if="
                              productSub.productAdditionSpec.length &&
                                productSub.productAdditionSpec[0].productAdditionSpecCalcType == 'QUANTITY'
                            "
                            class="product-addition-spec"
                          >
                            <dt>附加服务：</dt>
                            <dd>
                              <p
                                :key="index"
                                v-for="(addiSpec, index) in productSub.productAdditionSpec[0].productAdditionSpecDetail"
                              >
                                {{ addiSpec.productAdditionSpecName }} * {{ addiSpec.productAdditionSpecQuantity }}
                              </p>
                            </dd>
                          </dl>
                        </div>
                      </li>
                    </ul>
                  </template>
                  <p>
                    <span class="refund-type" v-if="item.orderType === 'EXCHANGE'">退换货</span>
                  </p>
                </div>
              </td>
              <td style="width:66px;" :class="item.clientOrderProductVOList.length > 1 ? 'padding0' : ''">
                <p
                  :class="['p14c333', item.clientOrderProductVOList.length > 1 ? 'line-h48' : '']"
                  v-for="(v, i) in item.clientOrderProductVOList"
                  :key="i"
                >
                  {{ v.quantity }}
                </p>
              </td>
              <td style="width:126px;" :class="item.clientOrderProductVOList.length > 1 ? 'padding0' : ''">
                <p
                  :class="['p14c333', item.clientOrderProductVOList.length > 1 ? 'line-h48' : '']"
                  v-for="(v, i) in item.clientOrderProductVOList"
                  :key="i"
                >
                  ¥{{ v.productMoney }}
                </p>
              </td>
              <td style="width:166px;padding-right:40px;text-align:right;">
                <p>
                  订单金额：
                  <span class="p14c333">¥{{ item.orderMoney }}</span>
                </p>
                <p>
                  税额：
                  <span class="p14c333">¥{{ item.invoiceMoney || 0 }}</span>
                </p>
                <p>
                  合计：
                  <span class="orange-m">¥{{ item.orderPaymentMoney }}</span>
                </p>
              </td>
              <td style="width:106px;font-size:14px;color:#333;">
                <p class="orange" v-if="item.orderStatus == 'WAIT_PAY'">待付款</p>
                <p class="orange" v-if="item.orderStatus == 'PAY_WAIT_CONFIRM'">付款待确认</p>
                <p class="orange" v-if="item.orderStatus == 'PAY_REJECT'">付款被驳回</p>
                <p v-if="item.orderStatus == 'PAID'">已付款</p>
                <p class="gary" v-if="item.orderStatus == 'CANCEL'">已取消</p>
                <p class="gary" v-if="item.orderStatus == 'PART_PAID'">部分付款</p>

                <div v-if="item.orderStatus == 'PAID'">
                  <a
                    v-if="item.invoiceFile"
                    :href="setInvoiceFile(item.invoiceFile)"
                    target="_blank"
                    style="color: #00A3FF;"
                    ><img
                      style="width:16px;vertical-align: middle;"
                      src="@/assets/images/common/download-small.png"
                      alt=""
                    />下载发票</a
                  >
                </div>
              </td>
              <td style="width:162px;" class="border-right">
                <Button
                  class="bule-btn"
                  v-if="
                    item.orderStatus == 'WAIT_PAY' ||
                      (item.orderStatus == 'WAIT_PAY' && item.trademarkOaProductOrder == 1)
                  "
                  @click="goPay(item)"
                  >去付款</Button
                >
                <Button
                  class="bule-btn"
                  v-if="item.orderStatus == 'PAY_WAIT_CONFIRM' || item.orderStatus === 'PAY_REJECT'"
                  @click="handleUpdateCertificate(item)"
                  >修改凭证</Button
                >
                <Button
                  class="gary-btn"
                  v-if="
                    ['WAIT_PAY', 'PAY_WAIT_CONFIRM', 'PAY_REJECT'].includes(item.orderStatus) &&
                      item.orderSource != 'IN'
                  "
                  @click="cancleOrder(item)"
                  >取消订单</Button
                >

                <a
                  v-if="item.orderStatus == 'WAIT_AUDIT'"
                  :href="item.clientOrderPaymentVOList[0].paymentFile"
                  target="_blank"
                >
                  <Button class="bule-btn">查看凭证</Button>
                </a>

                <a
                  v-if="
                    item.orderStatus == 'PAID' &&
                      (getFunctionCode(item) == 61 || getFunctionCode(item) == 62 || getFunctionCode(item) == 63)
                  "
                  @click="goPage('/myBrand')"
                >
                  <Button class="bule-btn">我的商标</Button>
                </a>
                <a v-if="item.orderStatus == 'PAID' && getFunctionCode(item) == 100" @click="goPage('/myPatent')">
                  <Button class="bule-btn">我的专利</Button>
                </a>
                <Button
                  class="gary-btn"
                  v-if="item.orderStatus == 'PAID' && isSowdrawIncideBtn(item)"
                  @click="handleDrawClick(item, (type = isSowdrawIncideBtn(item)))"
                  >{{ isSowdrawIncideBtn(item) }}</Button
                >
                <Button
                  class="gary-btn"
                  v-if="item.orderStatus == 'PAID' && isShowInvoiceDetail(item)"
                  @click="(drawIncideInfo = item), (isShowIncideDetlie = true)"
                  >发票详情</Button
                >
              </td>
            </tr>
          </div>
        </table>

        <div class="pageSetion clearfix">
          <Page
            class="pagination"
            :current="pageInfo.page"
            :total="pageInfo.total"
            @on-change="registerChangePageHandler"
            :page-size="pageInfo.limit"
          />
        </div>
      </div>
    </div>
    <SureOrder
      v-if="paymentBox"
      :orderInfo="orderInfo"
      @changeState="
        paymentBox = false;
        getListFun(1);
      "
    ></SureOrder>

    <Modal v-model="winningModal" width="566" class="winning-modal" :closable="false" footer-hide>
      <div class="winning-content">
        <div class="prize-box">
          <img class="prize-img" src="@/assets/images/prize618/pay-free.png" alt="" />
          <img class="prize-img" src="@/assets/images/prize618/pay-tea.png" alt="" />
        </div>
        <div class="footer-box">
          <Button class="close-btn" @click="winningModal = false">不抽了</Button>
          <Button class="check-btn" @click="goPrizePage">去抽奖</Button>
        </div>
      </div>
    </Modal>
    <!-- 发票引导弹窗 -->
    <!-- <GuideInvocie v-if="ishowInvoice" v-model="ishowInvoice" /> -->
    <!-- 开票 弹窗 -->
    <DrawIncide
      v-if="drawIncideShow"
      v-model="drawIncideShow"
      :payType="payType"
      :orderInfo="drawIncideInfo"
      @getListFun="getListFun"
    />
    <IncideDetlie v-if="isShowIncideDetlie" v-model="isShowIncideDetlie" :id="drawIncideInfo.orderId" />

    <!-- 国际支付线下打款弹窗 -->
    <IntlOfflinePay
      v-if="showIntlOffline"
      :visible.sync="showIntlOffline"
      @cancel="showIntlOffline = false"
      @ok="handleOfflineOk"
      :payInfo="payInfo"
    />
  </div>
</template>

<script>
import '@/assets/style/common.less';
import SureOrder from '../../common/sureOrder';
import { getOrderList, cancelOrder } from '@/api/myOrder';
import { needPopAPI } from '@/api/618activity/index';
import DrawIncide from './components/invocide/drawIncide';
import IncideDetlie from './components/invocide/incideModal/incideDetlie.vue';
import GuideInvocie from './components/invocide/guideModal/guideInvocie.vue';
import util from '../../../utils/util';
import IntlOfflinePay from '../../../../xcloud-client-components-web/module/components/intlOfflinePay';
export default {
  components: {
    SureOrder,
    DrawIncide,
    GuideInvocie,
    IncideDetlie,
    IntlOfflinePay,
  },
  computed: {
    getFunctionCode() {
      return (item) => {
        let { clientOrderProductVOList: list } = item;
        return (list && list.length > 0 && list[0].functionCode) || '';
      };
    },
    /**是否显示开票按钮  repair 开票  fill 补充信息*/
    isSowdrawIncideBtn() {
      return (item) => {
        let { invoiceVO } = item;
        return this.isRepair(item)
          ? '申请开票'
          : invoiceVO.status == 'WAIT_INFO'
          ? '完善开票信息'
          : invoiceVO.status == 'WAIT_PAY'
          ? '支付税费'
          : false;
      };
    },
    isRepair() {
      return (item) => JSON.stringify(item.invoiceVO) == '{}' && item.orderPaymentMoney != 0;
    },

    isShowInvoiceDetail() {
      return (item) => {
        let { invoiceVO } = item;
        return (
          !this.isRepair(item) &&
          item.orderPaymentMoney != 0 &&
          invoiceVO.status != 'WAIT_PAY' &&
          invoiceVO.status != 'WAIT_INFO'
        );
      };
    },
    // 合计金额
    totalPrice() {
      return (num1, num2) => util.countSum([num1, num2]);
    },
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      statusList: [
        {
          status: '-1',
          text: '全部',
        },
        {
          status: 'WAIT_PAY',
          text: '待付款',
        },
        {
          status: 'PAY_WAIT_CONFIRM',
          text: '付款待确认',
        },
        {
          status: 'PART_PAID',
          text: '部分付款',
        },
        {
          status: 'PAID',
          text: '已付款',
        },
        {
          status: 'PAY_REJECT',
          text: '付款被驳回',
        },
        {
          status: 'CANCEL',
          text: '已取消',
        },
      ],
      tableData: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 10,
        orderStatus: '-1',
      },
      status: 0,
      paymentBox: false,
      orderInfo: {},
      timer: null,
      changeModal: false,
      rejectionReason: '',
      fileList: '',
      changeOrderId: '',
      // 抽奖活动
      winningModal: false,
      drawIncideShow: false,
      //引导开票弹窗
      ishowInvoice: false,
      drawIncideInfo: {
        orderId: '',
      },
      isShowIncideDetlie: false,
      showIntlOffline: false,
      showIntlVisible: false,
      payParams: '',
      payInfo: {},
      payType: '开票',
    };
  },
  watch: {
    $route(to, from) {
      if (to.query.from === 'pay') {
        this.isGetDrawChance();
      }
    },
  },

  methods: {
    handleDrawClick(item, type) {
      console.log('type', type);
      this.payType = type;
      this.drawIncideShow = true;
      this.drawIncideInfo = item;
    },
    /** 判断答复审查意见订单  */
    getItemFuncode(item) {
      return !item.productNames.includes('答复审查');
    },

    setInvoiceFile(file) {
      return this.replaceHttps(file && file.split(',')[0]);
    },
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 220 + 'px';
    },
    getListFun(page) {
      let data = { ...this.pageInfo };
      if (this.pageInfo.orderStatus == '-1') {
        delete data.orderStatus;
      }
      if (page) {
        data.page = page;
      }

      getOrderList(data)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.initGuideInvocie(res.data.records);
            this.pageInfo.page = Number(res.data.current);
            this.pageInfo.total = Number(res.data.total);
          }
        })
        .finally(() => {
          this.countDownFun();
          this.filterRemark(this.tableData);
        });
    },
    filterRemark(data) {
      let self = this;
      data.map((item) => {
        let remark = item.remark != '' && JSON.parse(item.remark);
        if (remark.financial_reject) {
          self.$set(item, 'rejectRemark', remark.financial_reject[0].remark);
        }
      });
    },
    changeStatus(i, s) {
      this.status = i;
      this.pageInfo.orderStatus = s;
      this.getListFun(1);
    },
    registerChangePageHandler(page) {
      this.pageInfo.page = page;
      this.getListFun();
    },
    cancleOrder(row) {
      this.$Modal.confirm({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>提示</span></p>
          <p class="tip-content">是否确认取消订单？
          </p>
        </div>`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let data = {
            ordersId: row.orderId,
          };
          cancelOrder(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success('取消成功');
            }
            this.getListFun();
          });
        },
        onCancel: () => {},
      });
    },
    goHome() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl;
      }
      window.open(url);
    },
    goPay(row) {
      this.paymentBox = true;
      this.orderInfo = {
        ...row,
        productType: 1,
      };
    },

    goPrizePage() {
      this.$router.push({
        path: '/prizePage',
      });
    },
    // 查看是否获得抽奖机会
    isGetDrawChance() {
      needPopAPI().then((res) => {
        if (res.code === 0) {
          this.winningModal = res.data;
        }
      });
    },

    initGuideInvocie(data) {
      let { ishowInvoiceID } = this.$route.params;
      if (ishowInvoiceID) {
        let drawIncideInfo = data.find((item) => item.orderNo == ishowInvoiceID);
        this.$set(this, 'drawIncideInfo', drawIncideInfo);
        if (drawIncideInfo.orderStatus == 'PAID') this.ishowInvoice = true;
      }
    },

    countDownFun() {
      const self = this;
      this.tableData.map((item, index) => {
        if (item.trademarkOaProductOrder == 0) {
          item.countDown = setInterval(() => {
            let end = new Date(item.createTime);
            let start = new Date();
            let during = Math.floor((end - start) / 1000);
            let downTime = item.orderCancelTime === 0 ? during + 1800 : during + item.orderCancelTime * 60;
            if (downTime >= 0 && item.orderStatus == 'WAIT_PAY') {
              let min = Math.floor(downTime / 60) >= 10 ? Math.floor(downTime / 60) : '0' + Math.floor(downTime / 60);
              let sec = downTime % 60 >= 10 ? downTime % 60 : '0' + (downTime % 60);
              let outTime = min + ':' + sec;
              self.$set(item, 'outTime', outTime);
              if (min == 0 && sec == 0) {
                clearInterval(item.countDown);
                self.getListFun();
              }
            } else {
              clearInterval(item.countDown);
              self.$set(item, 'outTime', '');
            }
          }, 1000);
        }
      });
    },
    // 跳转菜单
    goPage(path) {
      this.$router.push(path);
    },
    // 修改凭证
    handleUpdateCertificate(item) {
      this.showIntlOffline = true;
      this.payInfo = {
        amount: item.orderMoney,
        orderId: item.orderId,
        paymentChannel: item.clientOrderPaymentVOList[0].paymentChannel,
        paymentFile: item.clientOrderPaymentVOList[0].paymentFile,
      };
    },
    // 修改凭证回调
    handleOfflineOk() {
      this.showIntlOffline = false;
      this.getListFun();
    },
  },
  mounted() {},
  created() {
    this.getHeight();
    this.getListFun();
    if (this.$route.query.from === 'pay') {
      this.isGetDrawChance();
    }
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      border-bottom: 1px solid #ebebeb;
      img {
        vertical-align: middle;
      }
      span.title {
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 20px;
        font-weight: 500;
        border: none;
      }
      span.line {
        width: 2px;
        height: 30px;
        background: #333333;
        opacity: 0.1;
        display: inline-block;
        margin: 0 16px;
        vertical-align: top;
      }
      span.reason {
        color: red;
      }
      span.status {
        display: inline-block;
        padding: 0 15px;
        font-size: 14px;
        text-align: center;
        background: #f1f1f1;
        border-radius: 16px;
        margin-right: 10px;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        color: #666;
      }
      span.status.active {
        background-color: #00a3ff;
        color: #fff;
      }
    }
    .no-data {
      margin: 56px auto;
      text-align: center;
      p {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-top: 10px;
      }
      button {
        width: 98px;
        height: 32px;
        background: #00a3ff;
        margin-top: 12px;
        border: none;
        color: #fff;
        cursor: pointer;
      }
    }
    .order-table {
      margin-top: 18px;
      tr.header {
        padding: 14px 0;
        background-color: #d5f0ff;
        display: inline-block;
        margin-bottom: 20px;
        th {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
      div {
        margin-bottom: 20px;
        p.title {
          padding: 14px 16px;
          background-color: #ebf8ff;
          font-size: 12px;
          font-family: PingFangSC;
          color: #333333;
          text-align: left;
          border-bottom: 0;
          margin-bottom: 0px;
          span {
            margin-right: 14px;
          }
          .fr {
            span {
              margin-right: 0;
            }
          }
        }
        td {
          border: 1px solid rgba(153, 153, 153, 0.2);
          font-size: 12px;
          font-family: PingFangSC;
          color: #666666;
          line-height: 18px;
          vertical-align: middle;
          p {
            line-height: 24px;
            margin-bottom: 0;
          }
        }
        td.padding0 {
          padding: 0;
          vertical-align: baseline;
        }
        .border-right {
          border-right: 1px solid rgba(153, 153, 153, 0.2);
        }
        .service-box {
          padding: 20px;
          p {
            text-align: left;
            span {
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
            }
          }
        }
        .p14c333 {
          font-size: 14px;
          color: #333;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          line-height: 22px;
        }
        .line-h48 {
          line-height: 70px;
        }
        .orange-m {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ff6600;
        }
        .orange {
          color: #ff6600;
        }
        .blue {
          color: #00a3ff;
        }
        .gary {
          color: #999999;
        }
        button {
          margin-bottom: 10px;
          min-width: 92px;
          height: 28px;
          border-radius: 100px;
          font-size: 12px;
          font-family: PingFangSC;
        }
        .bule-btn {
          background: #00a3ff;
          color: #ffffff;
          border: 1px solid #00a3ff;
        }
        .gary-btn {
          border: 1px solid #999999;
          color: #999999;
        }
        .bule-w-btn {
          border: 1px solid #1890ff;
          color: #00a3ff;
        }
      }
    }
    .pageSetion {
      text-align: center;
      margin-top: 36px;
      padding-bottom: 36px;
      .pagination {
        display: inline-block;
        // margin-right: 12px;
        line-height: 20px;
      }
      .totalNum {
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
}
.content {
  padding: 30px 16px 30px 30px;
  .uploadBox {
    margin-top: 20px;
    text-align: center;
  }
}
/deep/ .ivu-table-fixed-body {
  background-color: #fff;
}
.submit-tip-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
  margin-left: -40px;
}
.submit-tip-title .imgs {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-image: url('../../../assets/images/infoDetail/Shape.svg');
  vertical-align: middle;
  margin-right: 14px;
}
.submit-tip-box .tip-content {
  color: #333;
}

/*  618抽奖弹窗 */
.winning-modal {
  /deep/ .ivu-modal-body {
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
  /deep/ .ivu-modal-content {
    background-color: transparent;
    box-shadow: none;
  }
}
.winning-content {
  width: 566px;
  height: 628px;
  background: url('../../../assets/images/prize618/pay-bg.png') no-repeat;
  text-align: center;
  .prize-box {
    padding-top: 245px;
    display: flex;
    justify-content: center;
  }
  .footer-box {
    margin-top: 46px;
    display: flex;
    justify-content: center;
    button {
      width: 226px;
      height: 64px;
      border-radius: 10px;
      font-size: 30px;
    }
    .check-btn {
      background: #b23cc0;
      color: #ffefb0;
    }
    .close-btn {
      border: 3px solid #b23cc0;
      color: #b23cc0;
      margin-right: 40px;
    }
  }
}
.refund-type {
  font-size: 12px !important;
  color: #666;
  border-radius: 8px;
  background-color: #d0effb;
  padding: 0px 7px;
}
/* 附加规格 */
.product-addition-spec {
  display: flex;
  align-items: top;
  margin-bottom: 0;
  dt {
    padding-top: 3px;
    min-width: 65px;
    text-align: left;
  }
}
.product-child-li {
  > div {
    float: left;
    text-align: left;
    margin-bottom: 0 !important;
  }
  .product-index {
    width: 85px;
    padding-top: 3px;
    color: #333;
  }
}
.order-productVO {
  border-bottom: 1px dashed #000;
  overflow: hidden;
  padding-bottom: 10px;
  margin-bottom: 10px !important;
  > ul {
    padding-left: 65px;
  }
}
.order-productVO:last-child {
  border: none;
  padding-bottom: 0px;
  margin-bottom: 0 !important;
}
</style>
<style>
.ivu-table-header thead tr th {
  background: rgba(22, 173, 233, 0.2);
  padding: 17px 0;
  font-size: 12px;
  color: #666;
}
.no_border .ivu-table td,
.ivu-table th {
  border: none !important;
  text-align: center;
}
.no_border.ivu-table td,
.no_border.ivu-table th {
  border: none;
}
.no_border .ivu-table.ivu-table-default::after,
.no_border .ivu-table.ivu-table-default::before {
  display: none !important;
}
.ivu-table td,
.ivu-table th {
  font-weight: inherit;
  font-size: 12px;
  color: #333;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.ivu-btn-primary {
  border-color: #00a3ff !important;
  background-color: #00a3ff !important;
}
.ivu-btn-primary:hover {
  border-color: #00a3ff !important;
  background-color: #00a3ff !important;
}
</style>
