<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="header">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <div class="btn-group">
          <el-button type="primary" size="small" @click="edit" v-if="hasAuthority('E1_23')">编辑</el-button>
        </div>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container">
        <div style="margin: 20px 0">
          <div class="border-box">
            <div class="block-title big-size">分配统计</div>
          </div>
          <div style="padding-left:20px">
            <el-row>*分配统计实时更新；完成统计每日0时更新</el-row>
            <el-row>*完成统计时间范围：历史时间</el-row>
            <el-row>*预警时效：{{delTime('warnDuration') || '--'}}</el-row>
            <el-row>*交付时效：{{delTime('deliverDuration') || '--'}}</el-row>
          </div>
          <div class="table-container">
            <el-table style="width:100%" class="table" ref="table" :data="info.supplierAllotRuleDetailsVOList" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
              <Empty slot="empty" />
              <el-table-column>
                <template slot="header">
                  <div class="table-head">分配统计</div>
                </template>
                <el-table-column prop="realName" width="130px" label="供应商" align="center"></el-table-column>
                <el-table-column prop="percentage" width="130px" label="分配比例" align="center"></el-table-column>
                <el-table-column prop="todayHandleCount" width="130px" label="当日总分配数" align="center"></el-table-column>
                <el-table-column prop="monthHandleCount" width="130px" label="当月总分配数" align="center"></el-table-column>
                <el-table-column prop="yearHandleCount" width="130px" label="当年总分配数" align="center"></el-table-column>
                <el-table-column prop="minDate" width="130px" label="最初分配日期" align="center"></el-table-column>
                <el-table-column prop="maxDate" width="130px" label="最终分配日期" align="center"></el-table-column>
                <el-table-column prop="handleCount" width="130px" label="累计分配数" align="center"></el-table-column>
              </el-table-column>
              <el-table-column>
                <template slot="header">
                  <div class="table-head">完成统计</div>
                </template>
                <el-table-column width="110px" prop="workStatistics.submitted" label="已提交" align="center">
                  <template slot="header">
                    已提交
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        已经提交给供应商处理的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="110px" prop="workStatistics.advanceComplete" label="提前完成" align="center">
                  <template slot="header">
                    提前完成
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        服务预警之前供应商处理完成的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="110px" prop="workStatistics.onTimeComplete" label="正常完成" align="center">
                  <template slot="header">
                    正常完成
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        服务已预警但在交付时效内供应商处理完成的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="110px" prop="workStatistics.overtimeComplete" label="超时完成" align="center">
                  <template slot="header">
                    超时完成
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        服务超时后供应商处理完成的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column width="110px" prop="workStatistics.noComplete" label="未完成" align="center">
                  <template slot="header">
                    未完成
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        已经提交给供应商，还未处理完成的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" width="120px" prop="workStatistics.overtimeNoComplete" label="超时未完成" align="center">
                  <template slot="header">
                    超时未完成
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        已经提交给供应商，且服务已超时都未完成的单
                      </div>
                      <i class="el-icon-question text-warning"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!-- 页面右侧信息展示栏 -->
      <detail-right></detail-right>
    </div>
  </div>
</template>

<script>
import {
  getSupplierAllotRuleInfo,
  activateAllotRuleDisabledState,
  deleteSupplierAllotRule,
} from "@/api/newApi/supplyChain/allocationRules.js";
import { mapMutations } from "vuex";
import detailRight from "./components/detailRight.vue";
export default {
  components: {
    detailRight,
  },
  data() {
    return {
      tableLoading: false,
      id: this.$route.query.id,
      menuId: this.$route.query.menuId,
      allocationFunctionCode: this.$route.query.functionCode || 0,
      info: {},
      delData: null,
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return "启用";
        case 2:
          return "禁用";
        default:
          return status;
      }
    },
    filterSupplierType(type) {
      switch (type) {
        case 1:
          return "服务商";
        case 2:
          return "律师";
        default:
          return type;
      }
    },
  },
  computed: {
    delTime() {
      return function (key) {
        if (this.delData) {
          let timeUnit = this.delData.timeUnit == "DAY" ? "天" : this.delData.timeUnit == "WEEK" ? "周" : "月";
          if (key == "warnDuration") {
            return this.delData.warnDuration ? this.delData.warnDuration + timeUnit : "--";
          } else {
            return this.delData.deliverDuration ? this.delData.deliverDuration + timeUnit : "--";
          }
        }
      };
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getSupplierAllotRuleInfo({
        id: this.id,
        showType: 0,
        functionCode: this.allocationFunctionCode || 0,
      }).then((res) => {
        let result = res.data;
        if (result.startDate) {
          result.timeRange = result.startDate.split(" ")[0] + " - " + result.endDate.split(" ")[0];
        }
        this.info = result;
        this.delData = result.durationConfigs;
      });
    },
    /**
     * 编辑
     */
    edit() {
      this.$router.push({
        name: "allocationrulesAddEdit",
        query: {
          id: this.id,
          menuId: this.menuId,
        },
      });
    },
    /**
     * 切换禁用状态
     */
    _changeDisableStatus() {
      this.$confirm(`是否确认${this.info.status === 1 ? "禁用" : "启用"}?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        activateAllotRuleDisabledState({
          id: this.id,
        }).then((res) => {
          if (res.code == 0) {
            this.$message("操作成功");
            this.getInfo();
          }
        });
      });
    },
    ...mapMutations(["closeTag"]),
    /**
     * 删除
     */
    del(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        deleteSupplierAllotRule({
          id: this.id,
        }).then((res) => {
          if (res.code === 0) {
            this.closeTag(this.$route);
            this.back();
          }
        });
      });
    },
    //返回列表页
    ...mapMutations(["closeTag"]),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/supplychain/allocationRules/index",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.table-head {
  text-align: center;
}
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    background-color: #fff;
    margin-right: 5px;
    margin-top: 10px;
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}
.border-box {
  padding-left: 35px;
}
.table {
  // padding: 35px;
}
.block-title {
  margin-bottom: 20px;
}
.header {
  width: 100%;
  height: 30px;
  .btn-group {
    float: right;
  }
  .back {
    float: left;
    cursor: pointer;
  }
}
.saleDetail {
  .header-container {
    padding: 20px;
    background-color: #fff;
    .state {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 20px 0;
      .sn {
        font-size: 14px;
        margin-left: 5px;
        font-weight: bold;
      }
    }
    .info-wrapper {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      width: 100%;
      padding-bottom: 20px;
      .btn-group {
        flex: 0 0 150px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        flex-wrap: nowrap;
      }
    }
  }
  .table-title {
    font-size: 16px;
    padding: 20px 0;
    color: #333;
  }
  .check-btn {
    width: 100% !important;
    text-align: right !important;
    border-top: 1px solid #ccc;
  }
  .other-info-wrapper {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .ope-block {
      display: flex;
      margin-right: 30px;
      margin-bottom: 50px;
      .avatar {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .ope-info {
        width: 250px;
        margin-left: 10px;
        .ope-content {
          // overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
