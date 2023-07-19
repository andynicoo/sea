<!--  -->
<template>
  <div>
    <!-- {{ couponSelectionProp }}
    -----------------------------------
    <br />
    {{ couponSelection }}
    ----------------------------------- -->
    <!--表格  -->
    <div class="table-container">
      <div style="margin-bottom: 10px">
        <el-button @click="goCouponList">优惠券管理</el-button>
        <el-button type="primary" @click="search">刷新</el-button>
      </div>
      <el-table ref="multipleTable" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="400" border highlight-current-row @selection-change="handleSelectionChange">
        <Empty slot="empty" />
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column align="center" label="优惠券名称" width="200">
          <template slot-scope="scope">{{ scope.row.couponName }}</template>
        </el-table-column>
        <el-table-column align="center" label="备注名称" width="150">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column align="center" label="优惠内容" width="200">
          <template slot-scope="scope">{{ scope.row.couponContent || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" label="已领取" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.receiveNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="剩余券数" width="100">
          <template slot-scope="scope">
            {{ scope.row.surplusNum == -1 ? '不限量' : scope.row.surplusNum == 0 ? '-' : scope.row.surplusNum }}
          </template>
        </el-table-column>
        <el-table-column :min-width="130" align="center" label="优惠券状态">
          <template slot-scope="scope">{{ statusType[scope.row.status] }}</template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getList } from '@/api/newApi/extension/coupon.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        couponName: '',
        couponType: '', //优惠券码
        status: 'PROCESSING', //进行中状态
      },
      searchFlag: false,
      couponSelection: [],
      statusType: {
        NOT_STARTED: '未开始',
        PROCESSING: '进行中',
        FINISHED: '已结束',
      },
    };
  },
  props: {
    couponSelectionProp: {
      type: Array,
      default: () => {},
    },
  },

  async created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    await this.queryData();
    this.handleSelectionChange(this.couponSelectionProp);
  },

  computed: {
    couTableHeight: {
      get: function () {
        if (this.tableHeight.includes('calc')) {
          let num1 = this.tableHeight.slice(12, 14) + 79,
            num2 = this.tableHeight.slice(-6, -1);
          let val = (this.tableHeight = `calc(100vh - ${num1}px - ${num2})`);
          return val;
        } else {
          return '147px';
        }
      },
    },
  },

  methods: {
    goCouponList() {
      this.$router.push({ path: '/extension/activityManagement/coupon/index' });
    },
    getCouponSelection() {
      this.$emit('getCouponSelection', this.couponSelection);
    },
    handleSelectionChange(val) {
      this.couponSelection = val;
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      let param = JSON.parse(JSON.stringify(this.listQuery));
      if (param.couponType == 0) delete param.couponType;
      if (param.status == -1) param.status = null;
      getList(param)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }

            this.$nextTick(() => {
              let allCoupon = this.list;
              let selectCoupon = this.couponSelection;
              allCoupon.forEach((row) => {
                selectCoupon.forEach((row1) => {
                  if (row.marketingCouponActivityId === row1.marketingCouponActivityId) {
                    console.log(row1.marketingCouponActivityId);
                    this.$refs.multipleTable.toggleRowSelection(row, true);
                  }
                });
              });
            });
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },

    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        couponName: '',
        couponType: '0', //优惠券码
        status: '0', //状态
      };
      this.search();
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },

    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.pageNo = 1;
      this.queryData();
    },
  },
};
</script>
<style lang="scss" scoped></style>
