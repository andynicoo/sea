<template>
  <div class="registeredUser">
    <el-table border class="table" :data="data" ref="table" :height="tableHeight" highlight-current-row v-loading="listLoading">
      <el-table-column align="center" label="推广人姓名">
        <template slot-scope="scope">{{ scope.row.adminUserName || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="链接">
        <template slot-scope="scope">{{ scope.row.pageUrl + '?promteCode=' + scope.row.promteCode || '-' }}</template>
      </el-table-column>
      <el-table-column align="center" label="浏览量PV">
        <template slot-scope="scope">{{ scope.row.pv || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="浏览用户UV">
        <template slot-scope="scope">{{ scope.row.uv || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="注册用户数">
        <template slot-scope="scope">{{ scope.row.registerCount || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="转化订单数">
        <template slot-scope="scope">{{ scope.row.orderCount || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="转化金额">
        <template slot-scope="scope">{{ scope.row.orderSaleMoney || 0 }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="viewDetails(scope.row)" > 详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="查看详情" :visible.sync="dialogView" width="1200px" center destroy-on-close>
      <el-tabs v-model="type" type="card" @tab-click="handleClick">
        <el-tab-pane label="注册明细" name="first"></el-tab-pane>
        <el-tab-pane label="订单明细" name="second"></el-tab-pane>
      </el-tabs>
      <!-- 注册明细 -->
      <div v-if="type == 'first'">
        <el-table border class="table" :data="detailsDataRegister" ref="tableDetailsRegister" highlight-current-row v-loading="listLoading">
          <el-table-column align="center" label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column align="center" label="客户手机号">
            <template slot-scope="scope">{{ scope.row.mobile}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否新注册">
            <template slot-scope="scope">{{ scope.row.dataType == 'REGISTER'? '是':'否' }}</template>
          </el-table-column>
          <el-table-column align="center" label="是否转化">
            <template slot-scope="scope">{{ scope.row.orderCount > 0 ? '是':'否'}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否有跟进人">
            <template slot-scope="scope">{{ scope.row.dataType == 'REGISTER'? '否': scope.row.inviteUserName ? '是':'否' }}</template>
          </el-table-column>
          <el-table-column align="center" label="转化订单数">
            <template slot-scope="scope">{{ scope.row.orderCount }}</template>
          </el-table-column>
          <el-table-column align="center" label="来源">
            <template slot-scope="scope">{{ platformType[scope.row.platform] }}</template>
          </el-table-column>
          <el-table-column align="center" label="访问时间">
            <template slot-scope="scope">{{ scope.row.inviteDate }}</template>
          </el-table-column>
        </el-table>
        <!--查看详情分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChangeDetailsRegister" @current-change="handleCurrentChangeDetailsRegister" :current-page.sync="listQueryDetailsRegister.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQueryDetailsRegister.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotalDetailsRegister"></el-pagination>
        </div>
      </div>
      <!-- 订单明细 -->
      <div v-else>
        <el-table border class="table" :data="detailsDataOrder" ref="tableDetailsOrder" highlight-current-row v-loading="listLoading">
          <el-table-column align="center" label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column align="center" label="订单号">
            <template slot-scope="scope">{{ scope.row.orderNo }}</template>
          </el-table-column>
          <el-table-column align="center" label="客户手机号">
            <template slot-scope="scope">{{ scope.row.mobile }}</template>
          </el-table-column>
          <el-table-column align="center" label="销售金额">
            <template slot-scope="scope">{{ scope.row.orderMoney }}</template>
          </el-table-column>
          <el-table-column align="center" label="优惠金额">
            <template slot-scope="scope">{{ scope.row.discountMoney }}</template>
          </el-table-column>
          <el-table-column align="center" label="实付金额">
            <template slot-scope="scope">{{ scope.row.orderPaidMoney }}</template>
          </el-table-column>
          <el-table-column align="center" label="来源">
            <template slot-scope="scope">{{ platformType[scope.row.platform] }}</template>
          </el-table-column>
          <el-table-column align="center" label="支付时间">
            <template slot-scope="scope">{{ scope.row.payDate }}</template>
          </el-table-column>
        </el-table>
        <!--查看详情分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChangeDetailsOrder" @current-change="handleCurrentChangeDetailsOrder" :current-page.sync="listQueryDetailsOrder.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQueryDetailsOrder.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotalDetailsOrder"></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogView = false" size="small">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { linkAddressDetailPageList,orderDetails,registerDetails } from '@/api/newApi/extension/promotionExtend.js';
export default {
  props: {
    activeName: String,
  },
  data() {
    return {
      // 分页
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        linkAddressId: this.$route.query.linkAddressId,
      },
      listTotalDetailsRegister: 0,
      listQueryDetailsRegister: {
        page: 1,
        limit: 10,
      }, 
      listTotalDetailsOrder: 0,
      listQueryDetailsOrder: {
        page: 1,
        limit: 10,
      },
      type: 'first',
      //数据
      data: [],
      detailsDataRegister: [],
      detailsDataOrder: [],
      initHeight: 140,
      dialogView: false,
      platformType:{
        'pc' : 'pc端',
        'h5' : 'H5',
        'applets' : '小程序',
        'offline' : '线下'
      },
      
    };
  },
  watch: {
    // 被侦听的变量count
    activeName() {
      if (this.activeName == '链接明细') {
        this.getInfoFunc();
      } 
    },
  },
  methods: {
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getInfoFunc();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getInfoFunc();
    },
    handleSizeChangeDetailsRegister(val) {
      this.listQueryDetailsRegister.limit = val;
      this.getRegisterDetails();
    },
    handleCurrentChangeDetailsRegister(val) {
      this.listQueryDetailsRegister.page = val;
      this.getRegisterDetails();
    },
    handleSizeChangeDetailsOrder(val) {
      this.listQueryDetailsOrder.limit = val;
      this.getOrderDetails();
    },
    handleCurrentChangeDetailsOrder(val) {
      this.listQueryDetailsOrder.page = val;
      this.getOrderDetails();
    },
    getInfoFunc() {
      this.listLoading = true
      linkAddressDetailPageList(this.listQuery).then((res) => {
        if(res.code == 0){ 
          this.listLoading = false
          this.data = res.data.records;
          this.listTotal = Number(res.data.total);
        }
      });
    },
    viewDetails(row) {
      this.dialogView = true
      this.listQueryDetailsRegister.linkAddressDetailId = row.id
      this.listQueryDetailsOrder.linkAddressDetailId = row.id
      this.getRegisterDetails()
      this.getOrderDetails()
    },
    getRegisterDetails() {
      this.listLoading = true
      registerDetails(this.listQueryDetailsRegister).then((res) => {
        if(res.code == 0){
          this.listLoading = false
          this.detailsDataRegister = res.data.records;
          this.listTotalDetailsRegister = Number(res.data.total);
        }

      });
    },
    getOrderDetails() {
      this.listLoading = true
      orderDetails(this.listQueryDetailsOrder).then((res) => {
        if(res.code == 0){
          this.listLoading = false
          this.detailsDataOrder = res.data.records;
          this.listTotalDetailsOrder = Number(res.data.total);
        }
      });
    },
    handleClick(tab) {
        this.type = tab.name
      }
  },
};
</script>
<style lang="scss" scoped>
.pagination-container {
  margin-top: 24px;
}
.table {
  height: calc(808px - 205px);
}
</style>
