<template>
  <div>
    <div class="title">西班牙电池法 申报信息{{ titleTime }}</div>
    <div class="zero" v-if="infoNews.length === 1 && infoNews[0].saleWeightAmount === 0">当年 0 申报</div>
    <Table v-else :columns="columnsEsBattProduct" :data="infoNews" border max-height="500"></Table>
    <div class="title">当年申报数据汇总</div>
    <Table :columns="columnsEsBattProduct" max-height="500" :data="summaryShowData" border> </Table>
  </div>
</template>
<script>
import { columnsEsBattProduct } from '../enumObj';
import moment from 'moment';

export default {
  props: ['infoNews', 'summary', 'eprDeclare'],
  data() {
    return {
      columnsEsBattProduct,
      summaryShowData: [],
    };
  },
  computed: {
    titleTime() {
      return `（区间${moment(this.eprDeclare.beginTime).format('YYYY-MM-DD')} 至 ${moment(this.eprDeclare.endTime).format('YYYY-MM-DD')}）`;
    },
  },
  methods: {
    init() {
      this.summaryShowData = [];
      this.summaryShowData = this.summaryShowData.concat(this.summary.infoNews);
      this.summaryShowData.push({ batteryCategory: '当年累计汇总(元)', saleWeightAmount: '¥' + this.summary.summaryAmount });
      this.summaryShowData.push({ batteryCategory: '当年已购金额(元)', saleWeightAmount: '¥' + this.summary.purchasedAmount });
      this.summaryShowData.push({ batteryCategory: '当年已补缴费用(元)', saleWeightAmount: '¥' + this.summary.paidAmount });
      this.summaryShowData.push({ batteryCategory: '需补缴费用(元)', saleWeightAmount: '¥' + this.summary.waitPayAmount });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.title {
  text-align: center;
  padding: 16px 0;
  font-size: 18px;
  width: 100%;
}
.zero {
  padding: 24px 0;
  text-align: center;
  font-size: 16px;
  border: 1px solid #e8eaec;
}

.summary ::v-deep {
  .ivu-table-tbody .ivu-table-row:last-child .ivu-table-column-center:last-child {
    color: #ff5050;
  }
}
</style>
