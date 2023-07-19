<!--  -->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div ref="searchBox" class="search-box header-container" :class="moreSerch ? 'styleclass' : ''">
      <el-form ref="searchForm" inline label-width="90px">
        <el-form-item label="操作时间">
          <el-date-picker v-model="searchForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="操作模块：">
          <el-select v-model="searchForm.businessModule" clearable filterable placeholder="请选择">
            <el-option v-for="item in operation" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作结果：">
          <el-select v-model="searchForm.businessOperateResult" clearable placeholder="请选择">
            <el-option :value="0" label="失败">失败</el-option>
            <el-option :value="1" label="成功">成功</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作端：">
          <el-select v-model="searchForm.clientType" clearable placeholder="请选择">
            <el-option :value="1" label="客户端">客户端</el-option>
            <el-option :value="2" label="管理端">管理端</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务描述：">
          <el-input placeholder="请输入" clearable style="width: 168px" size="small" v-model="searchForm.businessKey" />
        </el-form-item>
        <el-form-item label="操作账号：">
          <el-input placeholder="请输入" clearable style="width: 168px" size="small" v-model="searchForm.userKey" />
        </el-form-item>

        <el-form-item style="margin-left: 20px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search(searchForm)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh-left" @click="clearHandler(searchForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <!-- 表格 -->
    <div class="table-container">
      <el-table border max-height="700" :height="tableHeight" highlight-current-row ref="table" :data="list.records" v-loading="tableLoading">
        <Empty slot="empty" />
        <el-table-column align="center" label="操作组织" show-overflow-tooltip prop="enterpriseName"></el-table-column>
        <el-table-column align="center" label="操作端" show-overflow-tooltip prop="clientType">
          <template slot-scope="scope">{{ scope.row.clientType == 1 ? "客户端" : "管理端" }}</template>
        </el-table-column>
        <el-table-column align="center" label="用户" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.username == "" ? scope.row.userMobile : scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作模块" show-overflow-tooltip prop="businessModuleName"></el-table-column>
        <el-table-column align="center" width="350" label="业务描述" show-overflow-tooltip>
          <template slot-scope="scope">{{ describe(scope.row) }}</template>
        </el-table-column>
        <el-table-column align="center" label="结果" width="80" show-overflow-tooltip prop="businessOperateResult">
          <template slot-scope="scope">{{ scope.row.businessOperateResult == 1 ? "成功" : "失败" }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="操作时间" show-overflow-tooltip prop="businessOperateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('I2_1')">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" alt="" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchForm.page" :page-sizes="[10, 20, 30, 50]" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-drawer title="基本信息" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <div class="draMaim">
        <div class="item">
          <div class="left">操作模块：</div>
          <div class="right">{{ rowInfo.businessModuleName }}</div>
        </div>
        <div class="item">
          <div class="left">接口名称：</div>
          <div class="right">{{ rowInfo.interfaceUrl }}</div>
        </div>
        <div class="item">
          <div class="left">操作来源：</div>
          <div class="right">{{ businessOperator(rowInfo) }}</div>
        </div>
        <div class="item">
          <div class="left">客户端IP：</div>
          <div class="right">{{ rowInfo.clientIp }}</div>
        </div>
        <div class="item">
          <div class="left">操作时间：</div>
          <div class="right">{{ rowInfo.businessOperateTime }}</div>
        </div>
        <div class="item">
          <div class="left">耗时：</div>
          <div class="right">{{ rowInfo.businessOperateUseTime + " " }}ms</div>
        </div>
        <div class="item business">
          <div class="left">业务描述：</div>
          <div class="right">{{ describe(rowInfo) }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getBusinessLog, listBusinessModel } from "@/api/newApi/publicJournal/publicJournal";
// import { transformationGMT } from "@/libs/tools";
import json from "highlight.js/lib/languages/json";
import { timers } from "../../../../public/Neditor/third-party/jquery-1.10.2";
export default {
  data() {
    return {
      moreSerch: false, //更多查询条件
      total: 0,
      tableLoading: false,
      searchForm: {
        businessKey: "",
        businessModule: "",
        businessOperateResult: "",
        clientType: "",
        endDate: "",
        limit: 10,
        page: 1,
        startDate: "",
        userKey: "",
        date: [],
      },
      operation: [],
      direction: "rtl",
      list: [],
      rowInfo: {},
      drawer: false,
    };
  },

  components: {},

  computed: {},

  mounted() {},
  created() {
    this.getBusinessLogAPI();
    this.listBusinessModelAPI();
  },
  methods: {
    handleSizeChange(val) {
      this.searchForm.limit = val;
      this.getBusinessLogAPI(this.searchForm);
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getBusinessLogAPI(this.searchForm);
    },

    async getBusinessLogAPI(data = { limit: this.searchForm.limit, page: this.searchForm.page }) {
      let params = this.setParams(data);
      try {
        let val = await getBusinessLog(params);
        if (val.code == 0) this.setDataHandle(val.data);
        this.total = parseInt(val.data.total);
      } catch (err) {
        this.$message({ type: "error", message: err });
      }
    },
    // 操作模块 API
    async listBusinessModelAPI(data = {}) {
      try {
        let val = await listBusinessModel(data);
        if (val.code == 0) {
          const arr = Object.keys(val.data).map((key) => {
            return {
              labe: key,
              value: val.data[key],
            };
          });
          this.operation = arr;
        } else {
          this.$message({ type: "error", message: val.message });
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleClose(done) {
      done();
    },
    // 条件查询
    search(e) {
      this.getBusinessLogAPI(this.setParams(e, "search"));
    },

    // data
    setParams(data, type = "") {
      let params = JSON.parse(JSON.stringify(data));
      Object.keys(params).forEach((item) => {
        if (item == "date") {
          if (params[item] == null || params[item][0] == "") {
            this.deleteDate(params, item);
          } else {
            if (params[item].length > 0) {
              params.startDate = this.transformationGMT(params.date[0]) + "00:00:00";
              params.endDate = this.transformationGMT(params.date[1]) + "23:59:59";
            }
          }
        }
        if (item == "businessModule") {
          this.operation.forEach((item) => {
            if (item.value == this.searchForm.businessModule) params.businessModule = item.labe;
          });
        }
      });
      if (type == "search") {
        //  debugger
        params.page = 1;
      }
      return params;
    },

    transformationGMT(data) {
      let d = new Date(data);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " ";
    },
    deleteDate(params, item) {
      delete params[item];
      delete params.endDate;
      delete params.startDate;
    },
    setDataHandle(data) {
      this.list = data;
    },

    setbusinessModuleVal(key) {
      return;
    },

    describe(data) {
      let { businessNo, businessNodeName, businessOperateName, businessModuleName } = data;
      let str = "";
      if ( businessModuleName != "分配规则" ) {
        str = businessNo + "  " + businessNodeName + "  " + businessOperateName;
      } else {
        str = businessNo + "  " + businessNodeName + "　分配规则";
      }
      return str;
    },

    businessOperator(data) {
      let { enterpriseName, username, userMobile, businessModuleName } = data;
      return enterpriseName + "_" + businessModuleName + "_" + username + "_" + userMobile;
    },

    // 重置
    clearHandler(e) {
      this.searchForm = {
        businessKey: "",
        businessModule: "",
        businessOperateResult: "",
        clientType: "",
        endDate: "",
        limit: e.limit,
        page: e.page,
        startDate: "",
        userKey: "",
        date: [],
      };
      this.getBusinessLogAPI();
      this.$message({ type: "success", message: "数据已更新" });
    },

    backFunc(val) {
      this.isShowDetail = false;
      if (val) this.refreshTable();
    },

    showDetailModal(row) {
      this.rowInfo = { ...row };
      this.drawer = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.draMaim {
  width: 490px;
  height: 340px;
  border: 1px solid #e6e6e6;
  margin-left: 30px;
  .item {
    display: flex;
    justify-content: flex-start;
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
    .left {
      width: 90px;
      background-color: rgb(242, 242, 242);
      height: 100%;
      display: flex;
      align-items: center;
      text-align: right;
      justify-content: center;
      padding: 0px 6px;
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 20px;
      flex: 1;
    }
  }
  .business {
    height: 100px;
    border: 0px;
  }
}

.app-container {
}
/deep/ .el-drawer__header {
  height: 79px;
  border-bottom: 1px solid #dddddd;
  padding-bottom: 20px;
  padding-left: 30px;
  > :first-child {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
  }
}
</style>
