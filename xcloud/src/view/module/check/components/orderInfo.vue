<template>
  <div>
    <el-table :data="list" border v-loading="loading" @sort-change="sortMethod">
      <el-table-column label="序号" min-width="50px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" min-width="120px" v-if="hasAuthority('Q2_6')">
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="orderDetail(row.orderId)">
            {{ row.orderNo }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="所属主体" prop="enterpriseId" min-width="120px" v-if="hasAuthority('Q2_43')">
        <template slot-scope="{ row }">
          {{ row.enterpriseId | filterKey(firmList, 'id', 'name') }}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="createTime" min-width="120px" v-if="hasAuthority('Q2_7')"></el-table-column>
      <el-table-column label="客户手机号" prop="userMobile" min-width="100px" v-if="hasAuthority('Q2_8')"></el-table-column>
      <el-table-column label="商品名称" prop="productNames" min-width="100px" v-if="hasAuthority('Q2_9')"></el-table-column>
      <el-table-column label="商品金额" prop="orderMoney" sortable="custom" v-if="hasAuthority('Q2_10')"></el-table-column>
      <el-table-column label="优惠金额" prop="discountMoney" sortable="custom" v-if="hasAuthority('Q2_11')"></el-table-column>
      <el-table-column label="应付金额" prop="orderPaymentMoney" sortable="custom" v-if="hasAuthority('Q2_12')"></el-table-column>
      <el-table-column label="实付金额" prop="orderPaidMoney" sortable="custom" v-if="hasAuthority('Q2_13')"></el-table-column>
      <el-table-column label="订单状态" prop="orderStatus" v-if="hasAuthority('Q2_14')">
        <template slot-scope="{ row }">
          <span>{{ row.orderStatus | filterOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" prop="orderSource" v-if="hasAuthority('Q2_15')">
        <template slot-scope="{ row }">
          <span>{{ row.orderSource | filterOrderSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" prop="orderType" v-if="hasAuthority('Q2_16')">
        <template slot-scope="{ row }">
          <span>{{ row.orderType | filterOrderType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售人员" prop="attributionName" v-if="hasAuthority('Q2_17')">
        <template slot-scope="{ row }">
          <span>{{ row.attributionName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { orderList } from '@/api/newApi/check/check.js';
import { mapMutations } from 'vuex';
export default {
  props: {
    type: String,
    val: String,
    firmList: Array,
  },
  data() {
    return {
      form: {
        current: 1,
        size: 10,
      },
      total: 0,
      loading: false,
      list: [],
    };
  },
  filters: {
    filterOrderStatus(orderStatus) {
      switch (orderStatus) {
        case 'CANCEL':
          return '已取消';
        case 'WAIT_AUDIT':
          return '待审核';
        case 'WAIT_PAY':
          return '待付款';
        case 'PAY_WAIT_CONFIRM':
          return '付款待确认';
        case 'PAID':
          return '已付款';
        case 'PART_PAID':
          return '部分付款';
        case 'AUDIT_FAIL':
          return '审核不通过';
        case 'APPLY_REFUND':
          return '申请退款';
      }
    },
    filterOrderSource(orderSource) {
      switch (orderSource) {
        case 'PC':
          return '网页端';
        case 'H5':
          return '移动端';
        case 'IN':
          return '手工录入';
        case 'MP':
          return '微信小程序';
        case 'CS':
          return '渠道系统';
      }
    },
    filterOrderType(orderType) {
      switch (orderType) {
        case 'NORMAL':
          return '正常订单';
        case 'PROJECT':
          return '项目制订单';
        case 'PREMIUM':
          return '溢价订单';
        case 'EXCHANGE':
          return '退换货订单';
        case 'ACTIVITY':
          return '活动订单';
      }
    },
  },
  methods: {
    ...mapMutations(['addTag']),
    getList(data = {}) {
      setTimeout(() => {
        this.loading = true;
      });
      orderList({
        ...this.form,
        type: this.type,
        value: this.val,
        ...data,
      })
        .then((res) => {
          if (res.code === 0) {
            this.total = res.data.total - 0;
            this.list = res.data.records;
          } else {
            this.resetData();
          }
        })
        .catch(() => {
          this.resetData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetData() {
      this.page = 1;
      this.total = 0;
      this.list = [];
    },
    orderDetail(id) {
      if (!this.hasAuthority('Q2_18')) return;
      this.$router.push({
        name: 'salesorderdetail',
        query: {
          id,
        },
      });
    },
    sortMethod({ column, prop, order }) {
      let obj = {
        orderMoney: 'sortCommodityPrice',
        discountMoney: 'sortPreferentialAmount',
        orderPaymentMoney: 'sortOrderPaymentMoney',
        orderPaidMoney: 'sortOrderPaidMoney',
      };
      let valueObj = {
        ascending: false,
        descending: true,
        null: undefined,
      };
      this.getList({
        page: 1,
        [obj[prop]]: valueObj[order],
      });
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.pagination-container {
  text-align: right;
  margin-top: 10px;
}
</style>
