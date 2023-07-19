<!-- receive -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="团单ID">
            <el-input placeholder="请输入团单ID" clearable style="width: 168px" size="small" v-model="listQuery.spellGroupRecordId" @clear="queryData" />
          </el-form-item>
          <el-form-item label="活动名称">
            <el-input placeholder="请输入活动名称" clearable style="width: 168px" size="small" v-model="listQuery.activityName" @clear="queryData" />
          </el-form-item>
          <el-form-item label="拼团商品">
            <el-input placeholder="请输入拼团商品" clearable style="width: 168px" size="small" v-model="listQuery.productName" @clear="queryData" />
          </el-form-item>
          <el-form-item label="参团手机号">
            <el-input placeholder="请输入参团手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" @clear="queryData" />
          </el-form-item>
          <el-form-item label="拼团状态">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="待拼团" value="WAIT_SPELL_GROUP"></el-option>
              <el-option label="拼团已取消" value="CANCEL"></el-option>
              <el-option label="拼团中" value="SPELL_GROUP_ING"></el-option>
              <el-option label="拼团成功" value="SPELL_GROUP_SUCCESS"></el-option>
              <el-option label="拼团失败" value="SPELL_GROUP_FAIL"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开团时间">
            <el-date-picker v-model="listQuery.standardTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="团单ID" width="200">
          <template slot-scope="scope">{{ scope.row.spellGroupRecordId }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动名称" width="200">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="团长手机号" width="200">
          <template slot-scope="scope">{{ scope.row.headUserMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="拼团商品" width="200">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column align="center" label="商品规格" >
          <template slot-scope="scope">{{ scope.row.productSpecsName }}</template>
        </el-table-column>
        <el-table-column align="center" label="成团目标人数" width="200">
          <template slot-scope="scope">{{ scope.row.spellGroupPersonNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="已参团人数" width="200">
          <template slot-scope="scope">{{ scope.row.joinGroupPersonNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="拼团状态" width="120">
          <template slot-scope="scope">{{ statusType[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column align="center" label="发起拼团时间" width="120">
          <template slot-scope="scope">{{ scope.row.spellStartTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="拼团结束时间" width="120">
          <template slot-scope="scope">{{ scope.row.spellEndTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="toTogetherRecord(scope.row)">参团明细</el-button>
          </template>
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
import { togetherStartList } from '@/api/newApi/extension/activity.js';

export default {
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: '',
        standardTime: [],
      },
      goodsOrderStatus: 'null',
      statusType: {
        WAIT_SPELL_GROUP: '待拼团',
        CANCEL: '拼团已取消',
        SPELL_GROUP_ING: '拼团中',
        SPELL_GROUP_SUCCESS: '拼团成功',
        SPELL_GROUP_FAIL: '拼团失败',
      },
      searchFlag: false,
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },
  watch: {
    goodsOrderStatus: {
      handler(newVal, oldVal) {
        if (Number(newVal) === 1 || Number(newVal) === 2) {
          this.listQuery.goodsOrderStatus = Number(newVal);
        } else {
          this.listQuery.goodsOrderStatus = null;
        }
        this.search();
      },
    },
    'listQuery.goodsOrderStatus': {
      handler(newVal, oldVal) {
        if (newVal === 1 || newVal === 2) {
          this.goodsOrderStatus = newVal.toString();
        } else {
          this.goodsOrderStatus = 'null';
        }
        // this.search();
      },
      deep: true,
    },
  },

  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      togetherStartList(this.setGetListParm())
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
    setGetListParm() {
      let params = { ...this.listQuery };
      Object.keys(params).map((item) => {
        if (item == 'standardTime' && params['standardTime'] && params['standardTime'].length > 0) {
          params.startTime = params[item][0];
          params.endTime = params[item][1];
        }
        return item;
      });
      return params;
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
        enterpriseId: '',
        createTimeQuery: [],
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
    toTogetherRecord(row) {
      this.$router.push({
        name: 'togetherRecord',
        path: '/extension/activityManagement/together/record',
        query: {
          id: row.spellGroupRecordId,
          name: row.activityName,
          startTime: row.spellStartTime,
          finishTime: row.spellEndTime,
        },
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
