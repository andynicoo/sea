<template>
  <div>
    <el-table :data="list" height="calc(100vh - 395px)">
      <el-table-column label="序号" width="80" align="center" fixed="left">
        <template slot-scope="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="newOrderNo" label="订单号" width="120" align="center"></el-table-column>
      <el-table-column prop="orderCreateTime" label="下单时间" width="150" align="center"></el-table-column>
      <el-table-column prop="paymentTime" label="支付时间" width="150" align="center"></el-table-column>
      <el-table-column prop="amountMoney" label="实付金额" width="120" align="center"></el-table-column>
      <el-table-column prop="attributionName" label="销售人员" width="120" align="center"></el-table-column>
      <el-table-column prop="newOrderStatus" label="订单状态" width="120" align="center">
        <template slot-scope="{ row }">{{ row.newOrderStatus | filterOrderStatus }}</template>
      </el-table-column>
      <el-table-column prop="orderSource" label="订单来源" width="120" align="center">
        <template slot-scope="{ row }">{{ row.orderSource | filterSource }}</template>
      </el-table-column>
      <el-table-column prop="expirationStartTime" label="续费时间" width="150" align="center">
        <template slot-scope="{ row }">{{ $util.formatDateTime(row.expirationStartTime) }}-{{ $util.formatDateTime(row.expirationTime) }}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRenewalList } from '@/api/newApi/workOrder/renewal.js';
export default {
  props: {
    oldServiceNo: String,
  },
  data() {
    return {
      form: {
        current: 1,
        size: 10,
      },
      total: 0,
      list: [],
    };
  },
  methods: {
    // 获取续费记录
    getList() {
      getRenewalList({
        ...this.form,
        oldServiceNo: this.oldServiceNo,
      }).then((res) => {
        this.total = Number(res.data.total);
        this.list = res.data.records;
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

<style></style>
