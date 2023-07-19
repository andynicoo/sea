<template>
  <div class="payment-succeeded">
    <img src="./../../images/sureOrder/payment-succeeded.png" />
    <h2>支付成功</h2>
    <p v-if="!fromEvidence">服务开始啦，请尽快填写井提交服务资料，以免影响服务进度。</p>
    <ul class="work-order-list">
      <template v-for="item in workOrderList">
        <li
          :key="item.serviceNo"
          v-if="
            [
              'NODE001',
              'NODE0015',
              'NODE0028',
              'NODE0033',
              'NODE0039',
              'NODE0048',
              'NODE0052',
              'NODE1156',
              'NODE0060',
              'NODE0067',
              'NODE0074',
              'NODE2',
              'NODE0140',
            ].includes(item.nodeCode)
          "
        >
          <div>
            <p>{{ item.serviceName }}</p>
            工单号：{{ item.serviceNo }}
          </div>
          <span v-if="!fromEvidence" @click="goFillData(item)"> 去填写资料 </span>
          <span v-else @click="goFillEvidence"> 去提交使用证据 </span>
        </li>
      </template>
    </ul>
    <div class="handle-box">
      <Button type="ghost" @click="goProductservice">继续选购服务</Button>
      <Button type="primary" @click="$router.push(orderListPath)">查看订单</Button>
    </div>
  </div>
</template>
<script>
import { payResultNew } from './../../api/user/index.js';
export default {
  data() {
    return {
      productListPath: localStorage.productListPath,
      orderListPath: localStorage.orderListPath,
      workOrderList: [
        {
          serviceName: '服务名称',
          businessNo: '000221212124751159008',
          businessId: '1602163299192016896',
          functionCode: '业务编码',
          countryCode: 'FR',
          countryNameZh: '法国',
        },
      ],
    };
  },
  created() {
    payResultNew(this.$route.query.orderNo).then((res) => {
      this.workOrderList = res.data.serviceList;
    });
  },
  computed: {
    fromEvidence() {
      return Boolean(this.$route.query.from);
    },
  },
  methods: {
    //继续选购服务
    goProductservice() {
      if (localStorage.enterpriseid == 30) {
        window.open(this.homePageUrl + 'productservice');
      } else {
        this.$router.push(this.productListPath);
      }
    },
    //去填资料
    goFillData(item) {
      if ([61, 62, 63].includes(item.functionCode)) {
        //商标注册
        this.$router.push({
          path: '/infoDetail',
          query: {
            id: item.serviceId,
            progressBar: item.progressBar,
            nodeCode: item.nodeCode,
            code: item.countryCode,
            countryNameZh: item.countryNameZh,
          },
        });
      } else if ([100].includes(item.functionCode)) {
        //外观专利
        this.$router.push({
          path: '/myPatent/fillInfomation/' + item.serviceId,
          query: {
            countryNameZh: item.countryNameZh,
          },
        });
      } else if ([2].includes(item.functionCode)) {
        //VAT转代理+申报
        if (item.countryCode === 'DE') {
          this.$router.push({
            path: '/registrationInformation',
            query: {
              id: item.workId,
              serviceNo: item.serviceNo,
            },
          });
        } else {
          this.$router.push({
            path: '/turnToAgent',
            query: {
              id: item.workId,
              serviceNo: item.serviceNo,
              countryCode: item.countryCode,
              countryNameZh: item.countryNameZh,
            },
          });
        }
      } else if ([5].includes(item.functionCode)) {
        //VAT注册+申报
        if (item.countryCode === 'DE') {
          this.$router.push({
            path: '/registrationInformation',
            query: {
              id: item.workId,
              serviceNo: item.serviceNo,
            },
          });
        } else {
          this.$router.push({
            path: '/registerInfo',
            query: {
              id: item.workId,
              serviceNo: item.serviceNo,
              countryCode: item.countryCode,
              countryNameZh: item.countryNameZh,
            },
          });
        }
      } else if ([31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 16].includes(item.functionCode)) {
        //包装法注册+申报,欧盟授权代表申请
        this.$router.push({
          path: '/complianceBusiness/manageDetails',
          query: {
            status: item.nodeCode,
            countryNameZh: item.countryNameZh,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            serviceNo: item.serviceNo,
            countryCode: item.countryCode,
          },
        });
      } else if ([6].includes(item.functionCode)) {
        //税号注销
        this.$router.push({
          path: '/cancelTaxNum',
          query: {
            id: item.workId,
            serviceNo: item.serviceNo,
            countryCode: item.countryCode,
            countryNameZh: item.countryNameZh,
          },
        });
      } else if ([24].includes(item.functionCode)) {
        //退税
        this.$router.push({
          path: '/taxRefund',
          query: {
            id: item.workId,
            countryCode: item.countryCode,
            cureentNodeCode: item.nodeCode || 'NODE2',
            serviceNo: item.serviceNo,
            progressBar: item.progressBar,
          },
        });
      } else if ([7].includes(item.functionCode)) {
        //税务稽查
        this.$router.push({
          path: '/taxInspection',
          query: {
            id: item.workId,
            serviceNo: item.serviceNo,
            countryCode: item.countryCode,
            cureentNodeCode: item.nodeCode || 'NODE2',
          },
        });
      } else if ([13].includes(item.functionCode)) {
        //合规认证
        this.$router.push({
          path: '/hagueInformation',
          query: {
            id: item.workId,
            status: item.progressBar,
            serviceNo: item.serviceNo,
            productFunctionCode: item.functionCode,
          },
        });
      } else if ([32].includes(item.functionCode)) {
        //包装法转代理
        this.$router.push({
          path: '/complianceBusiness/EPRDetails',
          query: {
            status: item.nodeCode,
            countryNameZh: item.countryNameZh,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            serviceNo: item.serviceNo,
          },
        });
      } else {
        this.$router.push({
          path: '/serviceList',
        });
      }
    },
    // 去提交使用证据
    goFillEvidence() {
      const query = JSON.parse(localStorage.getItem('fillEvidenceQuery'));
      this.$router.push({
        path: '/fillEvidence',
        query,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.payment-succeeded {
  .handle-box {
    text-align: center;
    padding-bottom: 30px;
  }
  .ivu-btn-primary {
    min-width: 116px;
    height: 32px;
    background: #3a7fff;
    color: #ffffff;
    border-radius: 2px 2px 2px 2px;
  }
  .ivu-btn-ghost {
    margin-right: 24px;
    min-width: 116px;
    height: 32px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #d9d9d9;
    color: #303132;
  }
  background: #fff;
  padding-top: 1px;
  margin: 24px;
  text-align: center;
  min-height: calc(100vh - 110px);
  img {
    display: block;
    width: 170px;
    margin: 70px auto 13px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
  }
  > p {
    color: #919498;
    font-size: 14px;
  }
}
.work-order-list {
  width: 518px;
  margin: 30px auto;
  text-align: left;
  max-height: 290px;
  min-height: 200px;
  overflow-y: auto;
  li {
    padding: 0px 24px;
    font-size: 12px;
    color: #919498;
    p {
      font-size: 14px;
      color: #303132;
    }
    span {
      font-size: 14px;
      color: #3a7fff;
      cursor: pointer;
    }
    display: flex;
    background: #fafafa;
    height: 82px;
    margin-bottom: 16px;
    justify-content: space-between;
    align-items: center;
    &:hover {
      background: #f7faff;
    }
  }
}
</style>
