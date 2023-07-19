<template>
  <div class="wrapper">
    <div class="group">
      <h4>
        <strong>
          金额统计
          <a-tooltip placement="right">
            <template #title><p class="notes">按金额统计服务截止时间T天内续费情况</p></template>
            <ExclamationCircleFilled style="color: #f0b955" />
          </a-tooltip>
        </strong>
        <a-button type="primary" @click="openMore(1)">
          <AppstoreOutlined />
          <span>更多</span>
        </a-button>
      </h4>
      <ul>
        <li>
          <strong>{{ resData.shouldRenewalAmount || 0 }}</strong>
          <span>应续金额</span>
        </li>
        <li>
          <strong>{{ resData.renewalAmount || 0 }}</strong>
          <span>已续费金额</span>
        </li>
        <li>
          <strong>{{ resData.waitRenewalAmount || 0 }}</strong>
          <span>待续金额</span>
        </li>
        <li>
          <strong>{{ resData.brokenRenewalAmount || 0 }}</strong>
          <span>断约金额</span>
        </li>
        <li>
          <strong>{{ resData.renewalAmountRatio || 0 }}</strong>
          <span>续费率（金额）</span>
        </li>
      </ul>
    </div>
    <div class="group">
      <h4>
        <strong>
          工单统计
          <a-tooltip placement="right">
            <template #title><p class="notes">按工单统计服务截止时间T天内续费情况</p></template>
            <ExclamationCircleFilled style="color: #f0b955" />
          </a-tooltip>
        </strong>
      </h4>
      <ul>
        <li>
          <strong>{{ resData.shouldRenewalWorkOrder || 0 }}</strong>
          <span>应续工单数</span>
        </li>
        <li>
          <strong>{{ resData.renewalWorkOrder || 0 }}</strong>
          <span>已续工单数</span>
        </li>
        <li>
          <strong>{{ resData.waitRenewalWorkOrder || 0 }}</strong>
          <span>待续工单数</span>
        </li>
        <li>
          <strong>{{ resData.brokenRenewalWorkOrder || 0 }}</strong>
          <span>断约工单数</span>
        </li>
        <li>
          <strong>{{ resData.renewalWorkOrderRatio || 0 }}</strong>
          <span>续费率（工单）</span>
        </li>
      </ul>
    </div>
    <div class="group">
      <h4>
        <strong>
          客户统计
          <a-tooltip placement="right">
            <template #title>
              <p class="notes">按客户统计服务截止时间T天内续费情况；<br />点击待续或断约可查看明细</p>
            </template>
            <ExclamationCircleFilled style="color: #f0b955" />
          </a-tooltip>
        </strong>
      </h4>
      <ul>
        <li>
          <strong>{{ resData.shouldRenewalCustUser || 0 }}</strong>
          <span>应续客户数</span>
        </li>
        <li>
          <strong>{{ resData.renewalCustUser || 0 }}</strong>
          <span>已续客户数</span>
        </li>
        <li>
          <a @click="openMore(2)">
            <strong>{{ resData.waitRenewalCustUser || 0 }}</strong>
          </a>
          <span>待续客户数</span>
        </li>
        <li>
          <a @click="openMore(3)">
            <strong>{{ resData.brokenRenewalCustUser || 0 }}</strong>
          </a>
          <span>断约客户数</span>
        </li>
        <li>
          <strong>{{ resData.renewalCustUserRatio || 0 }}</strong>
          <span>续费率（客户）</span>
        </li>
      </ul>
    </div>
  </div>
  <MoreView
    ref="moreView"
    :title="data.title"
    columnTitle="商品分类"
    :response="data.response"
    :columns="data.columns"
    :params="params"
    :methodName="getRenewalDetailStatistics"
    :otherParams="{
      custUserType: data.custUserType,
      parentProductCategoryId: data.parentId,
    }"
  >
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <!-- 工单统计 -->
      <template v-if="data.custUserType === 1">
        <a-table-summary-cell> {{ detailData.serviceNoS || 0 }} 单 </a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
        <a-table-summary-cell> {{ detailData.companyNameZhs || 0 }} 家</a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
        <a-table-summary-cell> {{ detailData.orderAmountTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell> {{ detailData.actuallyOrderAmountTotal || 0 }} </a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
      </template>
      <!-- 客户统计 -->
      <template v-if="data.custUserType === 2 || data.custUserType === 3">
        <a-table-summary-cell> {{ detailData.companyNameZhs || 0 }} 家</a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
        <a-table-summary-cell></a-table-summary-cell>
      </template>
    </template>
  </MoreView>
</template>

<script setup lang="ts">
import { ExclamationCircleFilled, AppstoreOutlined } from '@ant-design/icons-vue';
import { getRenewalStatistics, getRenewalDetailStatistics } from '@/api/dataCenter/renewalStatistics';
import MoreView from './MoreView.vue';
import { reactive, ref, type Ref } from 'vue';

const props = defineProps({
  params: {
    default: {},
  },
});

const data: any = reactive({
  title: '工单量统计明细',
  custUserType: 1,
  columns: [],
  response: {},
});

const resData: any = ref({});

//获取数据
const getList = () => {
  getRenewalStatistics(props.params).then((res: any) => {
    resData.value = res || {};
  });
};
// 获取详细
const detailData: any = ref({});
const getDetailList = () => {
  getRenewalDetailStatistics({
    ...props.params,
    custUserType: data.custUserType,
  }).then((res: any) => {
    detailData.value = res || {};
  });
};

const orderColumns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 180,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 140,
  },
  {
    title: '客户手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '服务公司中文名',
    dataIndex: 'companyNameZh',
    width: 200,
  },
  {
    title: '服务截止时间',
    dataIndex: 'expirationTime',
    width: 200,
  },
  {
    title: '续费状态',
    dataIndex: 'renewalStatus',
    width: 120,
  },
  {
    title: '服务金额',
    dataIndex: 'orderAmount',
    width: 50,
  },
  {
    title: '实付金额',
    dataIndex: 'actuallyOrderAmount',
    width: 50,
  },
  {
    title: '销售',
    dataIndex: 'attributionName',
    width: 100,
  },
  {
    title: '客服',
    dataIndex: 'customerSupportName',
    width: 100,
  },
];

const customerColumns = [
  {
    title: '客户手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '服务公司中文名',
    dataIndex: 'companyNameZh',
    width: 120,
  },
  {
    title: '续费状态',
    dataIndex: 'renewalStatus',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remake',
    width: 120,
  },
];

//更多
const moreView: Ref = ref(null);
const openMore = (type: number) => {
  // type 1统计明细, 2待续客户数, 3断约客户数
  data.title = '工单量统计明细';
  data.columns = orderColumns;
  if (type === 2) {
    data.title = '待续客户数';
    data.columns = customerColumns;
  }
  if (type === 3) {
    data.title = '断约客户数';
    data.columns = customerColumns;
  }
  data.custUserType = type;
  moreView.value.showDrawer = true;
  getDetailList();
};

//暴露方法
defineExpose({ getList });
</script>

<style scoped lang="less">
.wrapper {
  background: #fff;
  margin: 15px 0;
  padding: 15px 20px;
  .group {
    h4 {
      display: flex;
      justify-content: space-between;
    }
    ul {
      display: flex;
      justify-content: space-around;
      border-bottom: solid 1px #eee;
      margin: 15px 0;
      padding-bottom: 20px;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
.notes {
  font-size: 12px;
}
</style>
