<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <!-- 查询条件 -->
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form :model="listQuery" ref="searchForm" inline>
            <el-form-item prop="orderNo" label="订单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入订单号" clearable style="width: 168px" />
            </el-form-item>

            <el-form-item prop="userMobile" label="客户手机号">
              <el-input v-model="listQuery.userMobile" placeholder="请输入手机号" clearable style="width: 168px" />
            </el-form-item>

            <el-form-item prop="companyName" label="公司名称">
              <el-input v-model="listQuery.companyName" placeholder="公司名称" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryData()" icon="el-icon-search">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetSearchBox()">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? '收起' : '更多' }}筛选
              </el-button>
            </el-form-item>

            <div class="more-search" v-show="moreSerch">
              <el-form-item prop="contractName" label="合同名称">
                <el-input v-model="listQuery.contractName" placeholder="请输入商品名称" clearable style="width: 168px" />
              </el-form-item>
              <el-form-item prop="childContractName" label="子合同名称">
                <el-input v-model="listQuery.childContractName" placeholder="请输入商品名称" clearable style="width: 168px" />
              </el-form-item>
              <el-form-item prop="bestContractId" label="合同编号">
                <el-input v-model="listQuery.bestContractId" placeholder="请输入商品名称" clearable style="width: 168px" />
              </el-form-item>
              <el-form-item prop="contractStatus" label="签署状态">
                <el-select style="width: 168px" v-model="listQuery.contractStatus" placeholder="请选择" clearable filterable>
                  <el-option v-for="item in tableList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="contractSubjectType" label="签订主体">
                <el-select style="width: 168px" v-model="listQuery.contractSubjectType" placeholder="请选择" clearable filterable>
                  <el-option :value="CONTRACTEM.SUBJECTEM.PERSON" label="个人签订"></el-option>
                  <el-option :value="CONTRACTEM.SUBJECTEM.ENTERPRISE" label="企业签订"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="saleId" label="跟进人">
                <el-select style="width: 168px" v-model="listQuery.saleId" placeholder="请选择" clearable filterable>
                  <el-option v-for="item in followList" :value="item.userId" :label="item.nickName" :key="item.userId"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="contractSend" label="合同发送时间">
                <el-date-picker
                  v-model="listQuery.contractSend"
                  :picker-options="dateOptions"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="付款开始日期"
                  end-placeholder="付款结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  unlink-panels
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 340px"
                ></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs v-model="listQuery.contractStatus" ref="elTabs" @tab-click="queryData()">
        <el-tab-pane v-for="(item, index) in tableList" :key="index" :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
      <el-table border :data="tableData" v-loading="tableLoading" :span-method="objectSpanMethod" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="合同名称" prop="contractName" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="子合同名称" prop="childContractName" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="合同编号" prop="childBestContractId" width="150"></el-table-column>
        <el-table-column align="center" label="订单号" prop="orderNo" width="150"></el-table-column>
        <el-table-column align="center" label="签署状态" prop="contractStatus" width="150">
          <template slot-scope="scope">{{ CONTRACTEM.CONTRACTSTATUSTEXTEM[scope.row.contractStatus] }}</template>
        </el-table-column>
        <el-table-column align="center" label="签订主体" prop="contractSubjectType" width="150">
          <template slot-scope="scope">{{ scope.row.contractSubjectType !== '' ? (CONTRACTEM.SUBJECTEM.PERSON == scope.row.contractSubjectType ? '个人签订' : '企业签订') : '' }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户手机号" prop="receiverPhone" width="150">
          <template slot-scope="{ row }">
            <span v-hidden>{{ row.receiverPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="公司名称" prop="companyName" width="150">
          <template slot-scope="scope">{{ scope.row.companyName || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" label="跟进人" prop="saleName" width="150"> </el-table-column>
        <el-table-column align="center" label="合同发送时间" prop="sendTime" width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" v-show="hasAuthority('L2_22')" content="查看详情" placement="top">
              <router-link :to="{ name: 'contractManageDetail', query: { contractId: scope.row.id } }">
                <el-link type="primary" :underline="false" class="icon-see icon"></el-link>
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[50, 100, 200]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getContractPage, getStatistics } from '@/api/newApi/orderManage/salesorder.js';
import { CONTRACTEM } from '@/libs/contractEM.js';
import { userList } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
const contractStatusList = [
  { label: '签署中', value: 'SIGNING' },
  { label: '已签署', value: 'SIGNED' },
  { label: '特批不签', value: 'SPECIAL_NO_SIGN' },
  { label: '线下签订', value: 'OFFLINE_SIGNED' },
  { label: '已撤销', value: 'REVOKED' },
  { label: '作废中', value: 'INVALIDING' },
  { label: '已作废', value: 'INVALID' },
  { label: '用户协议', value: 'USER_AGREEMENT' },
];

export default {
  components: {},
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date > new Date().setHours(23, 59, 59);
        },
      },
      listQuery: {
        page: 1,
        limit: 50,
        contractStatus: 'ALL',
      },
      // 分页
      cacheKey: 'listQuery',
      listTotal: 0,
      tableLoading: false,
      moreSerch: false,
      followList: [], //跟进人列表
      CONTRACTEM: CONTRACTEM,
      tableData: [],
      copyListQuery: {},
      tableList: [],
    };
  },
  mixins: [cacheQuery],
  computed: {
    getContractStatusList() {
      return (type) => {
        if (type == 1) {
          return contractStatusList;
        } else {
          return;
        }
      };
    },
  },
  created() {
    this.getUserList();
    this.queryData();
    this.getPageCache();
    this.getStatisticsAPI();
  },
  methods: {
    objectSpanMethod({ row, column }) {
      let notCombineList = ['childContractName', 'childBestContractId'];
      if (!notCombineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },

    async queryData() {
      this.tableLoading = true;
      this.copyListQuery = { ...this.listQuery };
      this.setPageCache();
      let {
        data: { records, total },
      } = await getContractPage({ ...this.setParam() });
      let table = [];
      records.forEach((item) => {
        let va = {
          ...item,
          rowspan: 1,
          index: 0,
        };
        if (!item.childContractList.length) {
          table.push(va);
        } else {
          item.childContractList.forEach((childItem, i) => {
            let { contractName: childContractName, bestContractId: childBestContractId } = childItem;
            let child = { childContractName, childBestContractId };
            table.push({
              ...va,
              rowspan: item.childContractList.length,
              index: i,
              ...child,
            });
          });
        }
      });

      this.tableData = table;
      this.listTotal = Number(total);
      this.tableLoading = false;
    },

    async getUserList() {
      let { data } = await userList();
      this.followList = data;
    },

    setParam() {
      let listQuery = JSON.parse(JSON.stringify(this.listQuery));
      let { contractSend, contractStatus } = listQuery;
      if (contractSend) listQuery = { ...listQuery, contractSendStartTime: contractSend[0], contractSendEndTime: contractSend[1] };
      if (contractStatus == 'ALL') delete listQuery.contractStatus;
      return listQuery;
    },
    /**tabs */
    async getStatisticsAPI() {
      let { data } = await getStatistics();
      let list = contractStatusList.map((item) => ({ ...item, number: data[data.findIndex((source) => source.value == item.value)].number }));
      list.unshift({ label: '全部', number: this.listTotal, value: 'ALL' });
      this.tableList = list;
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

    resetSearchBox() {
      this.listQuery = {
        page: 1,
        limit: 50,
        contractStatus: 'ALL',
      };
      this.removePageCache();
      this.queryData();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}

.search-aera::before {
  height: 0px;
  top: 0px;
}
.searhTitle {
  overflow: hidden;
  margin: 10px 0;
  h2 {
    float: left;
    color: #333333;
  }
  .button {
    float: right;
  }
}

/deep/ .el-table-column--selection {
  text-align: center;
}

.mr-10 {
  margin-right: 10px;
}
.fl-right {
  float: right;
}
</style>
