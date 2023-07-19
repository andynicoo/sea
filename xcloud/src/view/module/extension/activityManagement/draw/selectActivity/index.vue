<!--  -->
<template>
  <div>
    <div class="table-container">
      <el-form ref="searchForm" inline style="margin-bottom: 10px">
        <el-form-item label="活动类型">
          <el-select placeholder="请选择" size="small" style="width: 150px" v-model="listQuery.type" clearable disabled>
            <el-option label="全部" value=""></el-option>
            <el-option label="秒杀活动" value="SECOND_KILL"></el-option>
            <!-- <el-option label="拼团活动" value="SPELL_GROUP"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <!--表格  -->
      <el-table ref="multipleTable" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" @selection-change="handleSelectionChange">
        <Empty slot="empty" />
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动类型" width="100">
          <template slot-scope="scope">{{ typeText[scope.row.type] }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动时间">
          <template slot-scope="scope">{{ scope.row.startTime }} 至 {{ scope.row.finishTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template slot-scope="scope">{{ statusText[scope.row.status] }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { activityList } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listLoading: false,
      listQuery: {
        type: 'SECOND_KILL',
      },
      typeText: {
        SECOND_KILL: '秒杀活动',
        SPELL_GROUP: '拼团活动',
      },
      statusText: {
        NOT_STARTED: '未开始',
        PROCESSING: '进行中',
        FINISHED: '已结束',
        INVALID: '已失效',
      },
      searchFlag: false,
      couponSelection: [],
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
  watch: {
    couponSelectionProp() {
      this.handleSelectionChange(this.couponSelectionProp);
      this.toggleSelection(this.couponSelectionProp);
    },
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
      activityList(param)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data;
            this.toggleSelection(this.couponSelectionProp);
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
    // 默认勾选
    toggleSelection(val) {
      if (val.length == 0) return false;
      this.$nextTick(() => {
        let allCoupon = this.list;
        let selectCoupon = val;
        allCoupon.forEach((row) => {
          selectCoupon.forEach((row1) => {
            if (row.activityId === row1.activityId) {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          });
        });
      });
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
