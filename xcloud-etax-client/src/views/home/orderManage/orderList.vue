<template>
  <div class="content">
    <div class="commontitle">我的订单</div>
    <div class="headContent">
      <div class="tabTitle">
        <span
          :class="{ 'active-tab': formData.orderStatus == '-1' }"
          @click="(formData.orderStatus = '-1'), getList(1)"
        >
          全部订单
        </span>
        <span
          :class="{ 'active-tab': formData.orderStatus == 'WAIT_PAY' }"
          @click="(formData.orderStatus = 'WAIT_PAY'), getList(1)"
        >
          待付款
        </span>
        <span
          :class="{ 'active-tab': formData.orderStatus == 'PAY_WAIT_CONFIRM' }"
          @click="(formData.orderStatus = 'PAY_WAIT_CONFIRM'), getList(1)"
        >
          付款待确认
        </span>
        <span
          :class="{ 'active-tab': formData.orderStatus == 'PAY_REJECT' }"
          @click="(formData.orderStatus = 'PAY_REJECT'), getList(1)"
        >
          付款被驳回
        </span>
        <span
          :class="{ 'active-tab': formData.orderStatus == 'PAID' }"
          @click="(formData.orderStatus = 'PAID'), getList(1)"
        >
          已付款
        </span>
        <span
          :class="{ 'active-tab': formData.orderStatus == 'CANCEL' }"
          @click="(formData.orderStatus = 'CANCEL'), getList(1)"
        >
          已取消
        </span>

        <span
          :class="{ 'active-tab': formData.orderStatus == 'PART_PAID' }"
          @click="(formData.orderStatus = 'PART_PAID'), getList(1)"
        >
          部分付款
        </span>
      </div>
    </div>
    <div class="my-card">
      <div class="myVATFilter">
        <Form :model="formData" :label-width="0" label-position="left" inline ref="formData">
          <FormItem prop="likeName">
            <Input v-model="formData.searchContent" style="width: 200px" placeholder="请输入订单号"></Input>
          </FormItem>
          <FormItem>
            <DatePicker
              type="daterange"
              placeholder="创建时间"
              style="width: 230px"
              @on-change="dateChange"
            ></DatePicker>
          </FormItem>
          <Button type="primary" @click="searchBtn()" class="searchBtn">搜索</Button>
          <!-- <Button @click="handleReset('formData')"
                    class="resetBtn">重置</Button> -->
        </Form>
        <div style="text-align: center" v-if="!(data.length > 0)">
          <img src="@/assets/images/common/emptyOrderList.svg" style="margin-top: 100px" alt="" />
        </div>
      </div>
      <div class="itemList" v-if="data.length > 0">
        <div class="item" v-for="(items, index) in orderList" :key="index">
          <div class="title">
            <div class="left">
              <span>订单号：{{ items[0].orderNo }}</span>
              <span>创建时间：{{ items[0].createTime }}</span>
              <span>
                订单状态：
                <span
                  :class="[
                    items[0].orderStatus === 'WAIT_PAY' ? 'red' : items[0].orderStatus === 'PART_PAID' ? 'blue' : '',
                  ]"
                >
                  {{
                    items[0].orderStatus === 'WAIT_PAY'
                      ? '待付款'
                      : items[0].orderStatus === 'AUDIT_FAIL'
                      ? '审核不通过'
                      : items[0].orderStatus === 'PAID'
                      ? '已付款'
                      : items[0].orderStatus === 'CANCEL'
                      ? '已取消'
                      : items[0].orderStatus === 'PART_PAID'
                      ? '部分付款'
                      : items[0].orderStatus === 'APPLY_REFUND'
                      ? '申请退款'
                      : items[0].orderStatus === 'WAIT_AUDIT'
                      ? '待审核'
                      : items[0].orderStatus === 'PAY_WAIT_CONFIRM'
                      ? '付款待确认'
                      : items[0].orderStatus === 'PAY_REJECT'
                      ? '付款被驳回'
                      : ''
                  }}
                </span>
              </span>
              <span v-if="items[0].orderStatus === 'PAY_REJECT'"> 驳回原因：{{ items[0].auditRemark }} </span>
            </div>
            <div class="right" v-if="items[0].outTime && items[0].outTime !== ''">
              <img src="@/assets/images/common/daojishi.svg" alt="" />
              <span>{{ items[0].outTime }} 订单将自动取消</span>
            </div>
          </div>
          <Table :data="items" :columns="columns" :loading="loading" :row-class-name="rowStyle">
            <template slot="operation" slot-scope="{ row }">
              <div class="operation">
                <Button type="primary" shape="circle" v-if="row.orderStatus == 'WAIT_PAY'" @click="goPay(row)">
                  去付款
                </Button>
                <Button
                  type="primary"
                  shape="circle"
                  v-if="row.orderStatus == 'PAY_WAIT_CONFIRM' || row.orderStatus === 'PAY_REJECT'"
                  @click="handleUpdateCertificate(row)"
                  >修改凭证</Button
                >
                <Button
                  v-if="
                    ['WAIT_PAY', 'PAY_WAIT_CONFIRM', 'PAY_REJECT'].includes(row.orderStatus) && row.orderSource != 'IN'
                  "
                  @click="cancleOrder(row)"
                  shape="circle"
                  style="color: #999"
                >
                  取消订单
                </Button>
                <Button
                  shape="circle"
                  class="gary-btn"
                  v-if="row.orderStatus == 'PAID' && isSowdrawIncideBtn(row)"
                  @click="(drawIncideShow = true), (drawIncideInfo = row)"
                >
                  {{ isSowdrawIncideBtn(row) }}
                </Button>
                <Button
                  shape="circle"
                  class="gary-btn"
                  v-if="row.orderStatus == 'PAID' && isShowInvoiceDetail(row)"
                  @click="(drawIncideInfo = row), (isShowIncideDetlie = true)"
                >
                  发票详情
                </Button>
              </div>
            </template>
            <template slot="invoice" slot-scope="{ row }">
              <div v-if="row.orderStatus === 'PAID'">
                <span v-if="row.invoiceFile">
                  <div v-for="(item, index) in row.invoiceFile.split(',')" :key="index">
                    <a :href="item" :key="index" target="_blank" v-if="item">查看发票</a>
                  </div>
                </span>
                <span v-else-if="row.invoiceType === 3">/</span>
                <span v-else>待开票</span>
              </div>
              <span v-else style="color: #16ade9">/</span>
            </template>
          </Table>
        </div>
      </div>
      <div class="page-box">
        <Page
          show-total
          v-if="data.length > 0"
          show-sizer
          show-elevator
          :total="total"
          :current="formData.page"
          :page-size="formData.limit"
          @on-change="handlePage"
          @on-page-size-change="handlePageSize"
        ></Page>
      </div>
      <SureOrder v-if="paymentBox" :orderInfo="orderInfo" @changeState="changeShowBox"></SureOrder>
    </div>
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
    <GuideInvocie v-if="ishowInvoice" v-model="ishowInvoice" @onOk="() => (drawIncideShow = true)" />
    <!-- 开票 弹窗 -->
    <DrawIncide v-if="drawIncideShow" v-model="drawIncideShow" :orderInfo="drawIncideInfo" @getList="getList" />
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
import { clientList, cancelOrder } from '@/api/taxModule';
import SureOrder from '../components/modalComponents/sureOrder';
import { needPopAPI } from '@/api/activity/index';
import DrawIncide from '@/views/userManage/components/drawIncide';
import IncideDetlie from '@/views/userManage/components/incideModal/incideDetlie.vue';
import GuideInvocie from '@/views/userManage/components/guideModal/guideInvocie.vue';
import IntlOfflinePay from '@comp/module/components/intlOfflinePay';
export default {
  components: {
    SureOrder,
    DrawIncide,
    GuideInvocie,
    IncideDetlie,
    IntlOfflinePay,
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      loading: false,
      paymentBox: false,
      ishowInvoice: false,
      isShowIncideDetlie: false,
      data: [],
      drawIncideShow: false,
      drawIncideInfo: {
        orderId: '',
      },
      columns: [
        {
          align: 'center',
          width: '',
          title: '服务名称',
          minWidth: 270,
          className: 'no_border',
          render: (h, p) => {
            return h('div', [
              h('Table', {
                props: {
                  'show-header': false,
                  // 'border':none,
                  columns: [
                    {
                      title: '',
                      width: '100',
                      key: 'productImgUrl',
                      render: (h, params) => {
                        return h('img', {
                          style: {
                            width: '86px',
                            height: '78px',
                            margin: '16px 0',
                            borderRadius: '5px',
                          },
                          attrs: {
                            src: params.row.productImgUrl,
                          },
                        });
                      },
                    },
                    {
                      title: '',
                      key: 'productProjectName',
                      render(h, params) {
                        let companyName = '';
                        let suppleDeclTime = '';
                        let productAdditionSpecArr = []; //附加规格
                        let productCombinationArr = []; //组合商品
                        if (params.row.suppleDeclStartTime && params.row.suppleDeclEndTime) {
                          suppleDeclTime =
                            '补申报区间：' +
                            params.row.suppleDeclStartTime.slice(0, 4) +
                            '年' +
                            params.row.suppleDeclStartTime.slice(5) +
                            '月-' +
                            params.row.suppleDeclEndTime.slice(0, 4) +
                            '年' +
                            params.row.suppleDeclEndTime.slice(5) +
                            '月';
                        }
                        if (params.row.companyName) {
                          companyName = '服务公司：' + params.row.companyName;
                        }
                        //附加规格
                        function additionFn(productAdditionSpec) {
                          let additionData = [];
                          if (
                            productAdditionSpec.length &&
                            productAdditionSpec[0].productAdditionSpecCalcType == 'QUANTITY'
                          ) {
                            for (let i = 0; i < productAdditionSpec[0].productAdditionSpecDetail.length; i++) {
                              let currentData = productAdditionSpec[0].productAdditionSpecDetail[i];
                              additionData.push(
                                h(
                                  'div',
                                  `${currentData.productAdditionSpecName} * ${currentData.productAdditionSpecQuantity}`
                                )
                              );
                            }
                          }
                          return additionData;
                        }
                        productAdditionSpecArr = additionFn(params.row.productAdditionSpec);
                        //组合商品
                        if (params.row.orderProductSpecsList.length) {
                          for (let i = 0; i < params.row.orderProductSpecsList.length; i++) {
                            let currentData = params.row.orderProductSpecsList[i];
                            let currentAddition = additionFn(currentData.productAdditionSpec);
                            console.log(currentAddition, 34);
                            productCombinationArr.push(
                              h(
                                'div',
                                {
                                  style: {
                                    textAlign: 'left',
                                    color: '#333333',
                                    marginTop: '5px',
                                  },
                                },
                                `服务${i + 1}:${currentData.productName}`
                              ),
                              [
                                h('div', '服务项目：' + currentData.specsNameList.join()),
                                [currentAddition.length > 0 && h('div', '附加服务：'), h('div', currentAddition)],
                              ]
                            );
                          }
                        }

                        return h(
                          'div',
                          {
                            style: {
                              marginTop: '20px',
                              marginBottom: '20px',
                            },
                          },
                          [
                            h(
                              'p',
                              {
                                style: {
                                  fontSize: '12px',
                                  fontFamily: 'PingFangSC-Medium, PingFang SC',
                                  textAlign: 'left',
                                  fontWeight: 500,
                                  color: '#333333',
                                },
                              },
                              params.row.productName
                            ),
                            h(
                              'p',
                              {
                                style: {
                                  fontSize: '12px',
                                  fontFamily: 'PingFangSC-Medium, PingFang SC',
                                  fontWeight: 500,
                                  textAlign: 'left',
                                  marginTop: '10px',
                                  color: '#333333',
                                },
                              },
                              companyName
                            ),
                            h(
                              'p',
                              {
                                style: {
                                  fontSize: '12px',
                                  fontFamily: 'PingFangSC-Medium, PingFang SC',
                                  fontWeight: 500,
                                  textAlign: 'left',
                                  color: '#333333',
                                },
                              },
                              suppleDeclTime
                            ),
                            h(
                              'p',
                              {
                                style: {
                                  textAlign: 'left',
                                  display: p.row.orderType === 'EXCHANGE' ? 'block' : 'none',
                                },
                              },
                              [
                                h(
                                  'span',
                                  {
                                    style: {
                                      fontSize: '12px',
                                      fontFamily: 'PingFangSC-Medium, PingFang SC',
                                      fontWeight: 500,
                                      color: '#333333',
                                      borderRadius: '8px',
                                      backgroundColor: '#d0effb',
                                      padding: '1px 7px',
                                    },
                                  },
                                  '退换货'
                                ),
                              ]
                            ),
                            !params.row.orderProductSpecsList.length &&
                              h(
                                'div',
                                {
                                  style: {
                                    fontSize: '12px',
                                    color: '#999',
                                    textAlign: 'left',
                                  },
                                },
                                [
                                  h(
                                    'p',
                                    {
                                      style: {
                                        fontSize: '12px',
                                        color: '#999',
                                        textAlign: 'left',
                                      },
                                    },
                                    '服务项目：' + params.row.specsNameList.join()
                                  ),
                                  productAdditionSpecArr.length > 0 && h('div', '附加服务：'),
                                  h('div', productAdditionSpecArr),
                                ]
                              ),
                            params.row.orderProductSpecsList.length > 0 &&
                              h(
                                'div',
                                {
                                  style: {
                                    fontSize: '12px',
                                    color: '#999',
                                    textAlign: 'left',
                                  },
                                },
                                productCombinationArr
                              ),
                          ]
                        );
                      },
                    },
                  ],
                  data: p.row.clientOrderProductVOList,
                },
              }),
            ]);
          },
        },
        {
          align: 'center',
          title: '商品售价',
          className: 'no_border',
          render(h, params) {
            return h('span', '¥' + params.row.orderMoney.toFixed(2));
          },
          // render: (h, params) => {
          //   return h("div", [
          //     h("Table", {
          //       props: {
          //         "show-header": false,
          //         // 'border':none,
          //         columns: [{ title: " ", key: "productrAmountMoney" }],
          //         data: params.row.clientOrderProductVOList,
          //       },
          //     }),
          //   ]);
          // },
        },
        {
          align: 'center',
          title: '数量',
          className: 'no_border',
          render: (h, params) => {
            return h('div', [
              h('Table', {
                props: {
                  'show-header': false,
                  // 'border':none,
                  columns: [{ title: ' ', key: 'quantity' }],
                  data: params.row.clientOrderProductVOList,
                },
              }),
            ]);
          },
        },
        {
          align: 'center',
          title: '优惠金额',
          render(h, params) {
            return h('span', '¥' + params.row.discountMoney.toFixed(2));
          },
        },
        {
          align: 'center',

          title: '税额',
          render(h, params) {
            return h('span', '¥' + params.row.invoiceMoney.toFixed(2));
          },
        },
        {
          align: 'center',

          title: '合计',
          key: 'orderPaymentMoney',
          render(h, params) {
            return h(
              'span',
              {
                style: {
                  color: '#ED3E3EFF',
                  fontSize: '14px',
                },
              },
              '¥' + params.row.orderPaymentMoney.toFixed(2)
            );
          },
        },
        {
          align: 'center',
          title: '状态',
          render(h, params) {
            let orderStatus = params.row.orderStatus,
              type = '',
              reason = '';
            switch (orderStatus) {
              case 'WAIT_PAY':
                type = '待付款';
                break;
              case 'AUDIT_FAIL':
                type = '审核不通过';
                break;
              case 'PAID':
                type = '已付款';
                break;
              case 'CANCEL':
                type = '已取消';
                break;
              case 'PART_PAID':
                type = '部分付款';
                break;
              case 'WAIT_AUDIT':
                type = '待审核';
                break;
              case 'APPLY_REFUND':
                type = '申请退款';
                break;
              case 'PAY_WAIT_CONFIRM':
                type = '付款待确认';
                break;
              case 'PAY_REJECT':
                type = '付款被驳回';
                break;
              default:
                break;
            }
            // return h("span", type);
            return h('div', [
              h('div', type),
              h('div', { style: { color: '#ED3E3EFF', marginTop: '5px' } }, [h('p', reason)]),
            ]);
          },
        },
        // {
        //   align: "center",
        //   title: "发票",
        //   slot: "invoice",
        // },
        {
          align: 'center',
          width: 170,
          title: '操作',
          slot: 'operation',
        },
      ],
      formData: {
        page: 1,
        limit: 10,
        searchContent: '',
        orderStatus: '-1',
        endTime: '',
        startTime: '',
      },
      total: 0,
      orderInfo: {},
      ticker: null,
      // 抽奖活动
      winningModal: false,

      showIntlOffline: false,
      showIntlVisible: false,
      payParams: '',
      payInfo: {},
    };
  },
  watch: {
    $route(to, from) {
      if (to.query.from == 'pay') {
        this.isGetDrawChance();
      }
    },
  },
  methods: {
    rowStyle(row, index) {
      if (row.orderStatus == 3 || row.orderStatus == 5) {
        row.styleName = { color: '#999999' };
      }
    },
    getList(page) {
      if (this.formData.orderStatus === '-1') {
        this.formData.orderStatus = '';
      }
      if (page) {
        this.formData.page = page;
      }
      return clientList(this.formData).then((res) => {
        if (res.code === 0) {
          this.data = res.data.records.map((ele) => {
            let arr = [];
            ele.clientOrderProductVOList.map((pro) => {
              if (pro.pcProductImgUrl) {
                pro.productImgUrl = pro.pcProductImgUrl;
              }
            });
            arr.push(ele);
            return arr;
          });
          console.log(this.data);
          if (this.ticker) {
            clearInterval(this.ticker);
          }
          this.beginTimer(); //启动计时器减指定字段的时间
          this.total = res.data.total - 0;
        }
      });
    },
    handlePage(page) {
      this.getList(page);
    },
    handlePageSize(pageSize) {
      this.formData.limit = pageSize;
      this.getList(1);
    },
    goPay(row) {
      this.paymentBox = true;
      this.orderInfo = row;
    },
    cancleOrder(row) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否取消订单？',
        onOk: () => {
          cancelOrder({ ordersId: row.orderId }).then((res) => {
            if (res.code === 0) {
              this.$Message.success('取消成功');
              this.getList();
            }
          });
        },
      });
    },
    download(row) {
      var form = document.createElement('form');
      form.setAttribute('action', row.invoiceFile);
      form.setAttribute('method', 'get');
      form.setAttribute('target', '_blank');
      form.setAttribute('style', 'display:none');
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    changeShowBox(obj) {
      this.paymentBox = obj.state;
    },
    beginTimer() {
      let self = this;
      this.ticker = setInterval(() => {
        for (let i = 0, len = this.orderList.length; i < len; i++) {
          const item = this.orderList[i][0];
          let end = new Date(item.createTime);
          let start = new Date();
          let downTime;
          let during;
          let initTime = item.marketingActivityId ? item.orderCancelTime * 60 : 86400;
          end = new Date(item.createTime);
          during = Math.floor((end - start) / 1000);
          downTime = during + initTime;
          if (downTime >= 0 && item.orderStatus == 'WAIT_PAY' && item.orderSource != 'IN') {
            let hour =
              Math.floor(downTime / 3600) >= 10 ? Math.floor(downTime / 3600) : '0' + Math.floor(downTime / 3600);
            let min =
              Math.floor((downTime - Number(hour) * 3600) / 60) >= 10
                ? Math.floor((downTime - Number(hour) * 3600) / 60)
                : '0' + Math.floor((downTime - Number(hour) * 3600) / 60);
            let sec = downTime % 60 >= 10 ? downTime % 60 : '0' + (downTime % 60);
            let outTime = hour + ':' + min + ':' + sec;
            self.$set(item, 'outTime', outTime);
            if (hour == 0 && min == 0 && sec == 0) {
              // cancelOrder({ ordersId: item.id }).then((res) => {
              // if (res.code == 0) {
              self.getList(1);
              // }
              // });
            }
          } else {
            self.$set(item, 'outTime', '');
          }
        }
      }, 1000);
    },
    // 倒计时
    leftTimer(year, month, day, hour, minute, second) {
      let _this = this;
      var leftTime = new Date(year, month - 1, day, hour, minute, second) - new Date(_this.nowDate); //计算剩余的毫秒数
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
      var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
      var minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
      var seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
      hours = this.checkTime(hours);
      minutes = this.checkTime(minutes);
      seconds = this.checkTime(seconds);
      return {
        days,
        hours,
        minutes,
        seconds,
      };
    },
    checkTime(i) {
      //将0-9的数字前面加上0，例1变为01
      if (i < 10) {
        i = '0' + i;
      }
      return i;
    },
    initGuideInvocie() {
      let item = this.orderList[0];
      // if (item && item.invoiceVO?.status === 'WAIT_INFO') {
      if (item) {
        this.drawIncideInfo = item[0];
        this.ishowInvoice = true;
      }
    },
    dateChange(val) {
      this.formData.endTime = val[1];
      this.formData.startTime = val[0];
    },
    searchBtn() {
      this.getList(1);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    // 查看是否获得抽奖机会
    isGetDrawChance() {
      needPopAPI().then((res) => {
        if (res.code === 0) {
          this.winningModal = res.data;
        }
      });
    },
    goPrizePage() {
      window.location.href = '/prizePage';
    },
    /**是否显示开票按钮  repair 开票  fill 补充信息*/
    isSowdrawIncideBtn(item) {
      let { invoiceVO } = item;
      return JSON.stringify(invoiceVO) == '{}' && item.orderPaymentMoney != 0
        ? '申请开票'
        : invoiceVO.status == 'WAIT_INFO'
        ? '补充开票信息'
        : invoiceVO.status == 'WAIT_PAY'
        ? '支付税额'
        : false;
    },
    // 修改凭证
    handleUpdateCertificate(item) {
      this.showIntlOffline = true;
      console.log(item, 'item');
      this.payInfo = {
        amount: item.orderMoney,
        orderId: item.orderId,
        channelType: item.clientOrderPaymentVOList[0].paymentChannel,
        paymentFile: item.clientOrderPaymentVOList[0].paymentFile,
      };
    },
    // 修改凭证回调
    handleOfflineOk() {
      this.showIntlOffline = false;
      this.getList();
    },
  },
  computed: {
    orderList() {
      let data = this.data;
      return this.data;
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
    isRepair(ele) {
      console.log(ele);
      return (item) => JSON.stringify(item.invoiceVO) == '{}';
    },
  },
  async mounted() {
    await this.getList(1);
    if (this.$store.state.order.isPayLog) {
      // 关闭引导弹窗
      // this.initGuideInvocie()
      this.$store.commit('savePayLog', false);
    }
  },
  created() {
    // if (this.$route.query.from === 'pay') {
    //   this.isGetDrawChance()
    // }
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table-cell {
  text-overflow: clip !important;
}
/deep/ .ivu-table td,
.ivu-table th {
  text-align: center !important;
}
.my-card {
  border-radius: 10px;
  margin: 24px;
  margin-bottom: 0px;
  .myVATFilter {
    background: #ffffff;
    margin-bottom: 24px;
    padding: 24px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
  }
  .itemList {
    .item {
      padding: 16px 24px 0px;
      background: #ffffff;
      margin-bottom: 24px;
    }

    .title {
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        margin-right: 24px;
      }
      .red {
        color: #ed3e3e;
      }
      .blue {
        color: #16ade9;
      }
      .right {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 22px;
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
    }
  }
}
.title {
  font-size: 24px;
  font-weight: 500;
  margin-left: 8px;
  color: #333;
  margin-bottom: 24px;
}
.content {
  min-height: calc(100vh - 60px);
  /deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  /deep/ .ivu-table:before,
  /deep/ .ivu-table-border:after {
    width: 0px;
  }
  /deep/ .ivu-table-header thead tr th {
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 14px;
  }
  /deep/ .ivu-table td {
    height: 114px;
    font-size: 12px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 10px 32px 0px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
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
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 0px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
  }
}
.page-box {
  text-align: center;
  padding-bottom: 40px;
}
.operation button {
  min-width: 92px;
  font-size: 12px;
  // padding: 6px 0;
  height: 28px;
  margin: 10px;
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
</style>
<style scoped>
.ivu-table-header thead tr th {
  background: rgba(22, 173, 233, 0.2);
  padding: 17px 0;
  font-size: 12px;
  color: #666;
}

.no_border .ivu-table td,
.ivu-table th {
  border: none;
  text-align: center !important;
}
.no_border.ivu-table td,
.no_border.ivu-table th {
  border: none;
  text-align: center !important;
}
.no_border .ivu-table.ivu-table-default::after,
.no_border .ivu-table.ivu-table-default::before {
  display: none !important;
}
.ivu-btn-primary {
  border-color: #16ade9 !important;
  background-color: #16ade9 !important;
}
.ivu-btn-primary:hover {
  border-color: #16ade9 !important;
  background-color: #16ade9 !important;
}

.mb-5 {
  margin-bottom: 5px;
}
</style>
