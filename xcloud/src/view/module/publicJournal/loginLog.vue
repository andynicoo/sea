<!--  -->
<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div  ref="searchBox"  class="search-box header-container" :class="moreSerch ? 'styleclass' : ''">
      <el-form ref="searchForm" inline label-width="90px">
        <div class="left">
          <el-form-item label="登录时间">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="登录结果：">
            <el-select v-model="searchForm.loginResult" clearable placeholder="请选择">
              <el-option :value="2" label="失败">失败</el-option>
              <el-option :value="1" label="成功">成功</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作端：">
            <el-select v-model="searchForm.clientType" clearable placeholder="请选择">
              <el-option :value="1" label="客户端">客户端</el-option>
              <el-option :value="2" label="管理端">管理端</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作账号：">
            <el-input placeholder="请输入" clearable style="width: 168px" size="small" v-model="searchForm.userKey" />
          </el-form-item>
        </div>

        <el-form-item style="margin-left: 20px" class="right">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search(searchForm)">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh-left" @click="clearHandler(searchForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        max-height="700"
        :height="tableHeight"
        highlight-current-row
        ref="table"
        :data="list.records"
        v-loading="tableLoading"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="操作端" show-overflow-tooltip prop="clientType">
          <template slot-scope="scope">{{ scope.row.clientType == 1 ? "客户端" : "管理端" }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作账号" show-overflow-tooltip prop="mobile">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" show-overflow-tooltip prop="loginTime"></el-table-column>
        <el-table-column align="center" label="类型" show-overflow-tooltip prop="loginType">
          <template slot-scope="scope">{{ scope.row.loginType == 1 ? "登录" : "登出" }}</template>
        </el-table-column>
        <el-table-column align="center" label="业务描述" show-overflow-tooltip prop="loginFailReason"></el-table-column>
        <!-- <el-table-column
          align="center"
          width="150"
          label="结果"
          show-overflow-tooltip
          prop="loginResult"
        > -->
        <el-table-column align="center" label="结果" show-overflow-tooltip prop="loginResult">
          <template slot-scope="scope">{{ scope.row.loginResult == true ? "成功" : "失败" }}</template>
        </el-table-column>

        <el-table-column
          align="center"
          width="150"
          label="耗时"
          show-overflow-tooltip
          prop="loginUseTime"
        ></el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="客户端ip"
          show-overflow-tooltip
          prop="clientIp"
        ></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchForm.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="searchForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { loginLog } from "@/api/newApi/publicJournal/publicJournal";
import { transformationGMT } from "@/libs/tools";
import { e } from "mathjs";
export default {
  data() {
    return {
      moreSerch: false,
      total: 0,
      clientTotal: 0,
      managementTotal: 0,
      searchForm: {
        clientType: undefined,
        endDate: " ",
        limit: 10,
        loginResult: undefined,
        page: 1,
        startDate: " ",
        userKey: " ",
        date: "",
      },

      list: {
        current: "1",
        hitCount: false,
        orders: [],
        pages: "0",
        records: [],
        searchCount: true,
        size: "",
        total: "0",
      }, //展示数据
      clientList: {
        records: [],
      }, //客户端
      managementList: {
        records: [],
      }, //管理端
      tableLoading: false,
    };
  },

  components: {},

  computed: {
    wachshowData({ Management, clientList, list }) {
      return { Management, clientList, list };
    },
    wachTotal({ managementTotal, clientTotal }) {
      return { managementTotal, clientTotal };
    },
  },

  mounted() {},
  created() {
    this.getCeatedDate();
  },
  methods: {
    // api
    async loginLogAPi(data) {
      let val = await loginLog(data);
      return val;
    },
    // 数据初始化
    async getCeatedDate() {
      // this.searchForm
      let data = JSON.parse(JSON.stringify(this.searchForm));
      data.clientType = 1;
      // data.limit = data.limit / 2;
      let data2 = JSON.parse(JSON.stringify(this.searchForm));
      data2.clientType = 2;
      // data2.limit = data2.limit / 2;
      let val = await this.loginLogAPi(this.setParms(data));
      let val2 = await this.loginLogAPi(this.setParms(data2));
      this.setData({
        type: "ceated",
        data: [val, val2],
      });
    },

    setData(data) {
      if (data.type == "ceated") {
        //初始化数据
        this.list.records = [];
        let self = this;
        this.total = 0;
        data.data.forEach((element) => {
          this.list.records = self.list.records.concat(element.data.records);
          this.total += parseInt(element.data.total);
        });
      } else {
        //数据查询
      }
    },

    clearHandler(e) {
      this.searchForm = {
        clientType: undefined,
        endDate: " ",
        limit: 10,
        loginResult: undefined,
        page: 1,
        startDate: " ",
        userKey: " ",
        date: "",
        userMobile: "",
      };
      this.getCeatedDate();
      this.$message({
        message: "数据已更新",
        type: "success",
      });
    },

    handleSizeChange(val) {
      this.searchForm.limit = val;
      this.getCeatedDate();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      // this.total =  parseInt( val.data.total);
      this.getCeatedDate();
    },

    //chaxun
    async search(e) {
      // console.log(e);
      let val = await this.loginLogAPi(this.setParms(e));
      // console.log("search", val);
      this.list = val.data;
      this.total = parseInt(val.data.total);
    },

    setParms(e) {
      let data = JSON.parse(JSON.stringify(e)),
        self = this;
      for (let key in data) {
        if (data[key] == 0) {
          delete data[key];
        }
      }
      if (data.date && data.date[0] != "") {
        data.startDate = self.transformationGMT(data.date[0]) + "00:00:00";
        data.endDate = self.transformationGMT(data.date[1]) + "23:59:59";
      }

      if (data.loginResult != 0 && data.loginResult != undefined) {
        data.loginResult = data.loginResult == 2 ? false : true;
      } else {
        delete data.loginResult;
      }

      return data;
    },

    transformationGMT(data) {
      let d = new Date(data);
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " ";
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  .search-box {
    form {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
