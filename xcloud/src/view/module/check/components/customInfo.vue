<template>
  <div class="wrapper">
    <div class="block">
      <div class="block-title">
        <span>客户基本资料</span>
        <el-tag class="custom-tag">客户</el-tag>
      </div>
      <el-descriptions :colon="false" :column="1" labelClassName="desc-label" contentClassName="desc-content" v-if="statisticsData.custUserCustomers">
        <el-descriptions-item label="手机号" v-if="hasAuthority('Q2_1')">{{ getCustValue('mobile') }}</el-descriptions-item>
        <el-descriptions-item label="客户等级" v-if="hasAuthority('Q2_2')"> {{ custLevel }}</el-descriptions-item>
        <el-descriptions-item label="跟进人" v-if="hasAuthority('Q2_3')">{{ handler }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" v-if="hasAuthority('Q2_4')">{{ getCustValue('createTime') }}</el-descriptions-item>
        <el-descriptions-item label="客服" v-if="hasAuthority('Q2_45')">{{ getCustValue('customerSuccessName', 'custUserCustomerSuccesses') }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="block">
      <div class="block-title">客户销售情况</div>
      <el-descriptions :colon="false" :column="2" labelClassName="desc-label" contentClassName="desc-content">
        <el-descriptions-item label="累计成交次数">{{ statisticsData.totalDealNum }}</el-descriptions-item>
        <el-descriptions-item label="累计成交金额">{{ statisticsData.totalDealAmount | formatQianFenWei }}</el-descriptions-item>
        <el-descriptions-item label="累计退款次数">{{ statisticsData.totalRefundNum }}</el-descriptions-item>
        <el-descriptions-item label="累计退款金额">{{ statisticsData.totalRefundAmount | formatQianFenWei }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :colon="false" :column="1" labelClassName="desc-label" contentClassName="desc-content">
        <el-descriptions-item label="累计购买类目">{{ totalBuyProductCategories }}</el-descriptions-item>
        <el-descriptions-item label="累计购买商品数量">{{ statisticsData.totalBuyProductNum }}</el-descriptions-item>
        <el-descriptions-item label="最近一次下单日期">{{ statisticsData.lastBuyTime }}</el-descriptions-item>
      </el-descriptions>
      <div class="sales-wrapper">
        <div class="sales-title">近期成交情况</div>
        <el-table :data="list" border>
          <el-table-column align="center" label="周期" prop="title"></el-table-column>
          <el-table-column align="center" label="近90天" prop="data90"></el-table-column>
          <el-table-column align="center" label="近180天" prop="data180"></el-table-column>
          <el-table-column align="center" label="近360天" prop="data360"></el-table-column>
          <el-table-column align="center" label="近720天" prop="data720"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="block tags-block" v-if="hasAuthority('Q2_5')">
      <span v-for="(item, index) in tagsList" :key="index">
        <div class="block-title">{{ item.title }}</div>
        <div>
          <el-tag class="tag" v-for="tag in item.content" :key="tag.tagId">{{ tag.tagName }}</el-tag>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    statisticsData: Object,
    tags: Object,
  },
  computed: {
    custLevel() {
      let levelList = this.statisticsData.custUserCustomers.map((item) => item.level);
      levelList = [...new Set(levelList)];
      return levelList.map((level) => this.$options.filters.filterCustomLevel(level)).join('、');
    },
    handler() {
      if (!this.statisticsData.baseUsers) return '';
      return this.statisticsData.baseUsers.map((item) => item.nickName).join('、');
    },
    totalBuyProductCategories() {
      if (!this.statisticsData.totalBuyProductCategories) return '';
      return this.statisticsData.totalBuyProductCategories.map((item) => item.categoryName).join('、');
    },
    list() {
      return [
        {
          title: '成交次数',
          data90: this.statisticsData.total90DayDealNum,
          data180: this.statisticsData.total180DayDealNum,
          data360: this.statisticsData.total360DayDealNum,
          data720: this.statisticsData.total720DayDealNum,
        },
        {
          title: '成交额',
          data90: this.$options.filters.formatQianFenWei(this.statisticsData.total90DayDealAmount),
          data180: this.$options.filters.formatQianFenWei(this.statisticsData.total180DayDealAmount),
          data360: this.$options.filters.formatQianFenWei(this.statisticsData.total360DayDealAmount),
          data720: this.$options.filters.formatQianFenWei(this.statisticsData.total720DayDealAmount),
        },
      ];
    },
    tagsList() {
      let list = [];
      for (let key in this.tags) {
        list.push({
          title: key,
          content: this.tags[key],
        });
      }
      return list;
    },
  },
  methods: {
    getCustValue(key, data = 'custUserCustomers') {
      return this.statisticsData[data].map((item) => item[key]).join('、');
    },
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  flex: 1;
  display: flex;
  .block {
    flex: 1;
    margin-top: 13px;
    &:not(:last-child) {
      padding-right: 32px;
      margin-right: 32px;
      border-right: 1px solid #e5e7ec;
    }
    span:not(:first-child) {
      .block-title {
        margin-top: 17px;
      }
    }
    &.tags-block {
      max-height: calc(100vh - 440px);
      overflow-y: auto;
    }
    .block-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 24px;
      padding-left: 10px;
      &::after {
        left: 0;
      }
      .custom-tag {
        font-weight: normal;
        margin-left: 12px;
      }
    }
    ::v-deep.desc-label {
      font-size: 14px !important;
      color: #999 !important;
      white-space: nowrap;
    }
    ::v-deep.desc-content {
      font-size: 14px;
      color: #333;
    }
    .tag {
      margin-right: 12px;
      margin-bottom: 12px;
    }
    .sales-wrapper {
      margin-top: 16px;
      .sales-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 12px;
      }
    }
  }
  ::v-deep.el-descriptions-item__cell {
    padding-bottom: 12px !important;
  }
}
</style>
