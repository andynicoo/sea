<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="集赞明细"></BackHerader>
      <br />
      <el-form ref="searchForm" inline>
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" />
        </el-form-item>
        <el-form-item label="发起时间">
          <el-date-picker v-model="listQuery.launchTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
        </el-form-item>
        <el-form-item label="达标时间">
          <el-date-picker v-model="listQuery.standardTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="手机注册号">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="发起时间">
          <template slot-scope="scope">{{ scope.row.initiateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="达标集赞数量(个)">
          <template slot-scope="scope">{{ scope.row.targetNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="已集赞数量(个)">
          <template slot-scope="scope">{{ scope.row.hasSetPraiseNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="达标时间" sortable>
          <template slot-scope="scope">{{ scope.row.completeTargetTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-tooltip content="查看参与者信息" placement="top">
              <el-link type="primary" class="icon icon-tax" :underline="false" @click="toViewInfo(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="参与者信息" :visible.sync="dialogVisibleInfo" width="700px" center destroy-on-close>
      <el-table :data="dataInfo" border ref="table" v-loading="infoLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="参与者信息">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="参与时间">
          <template slot-scope="scope">{{ scope.row.helpTime }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="changePageSizeInfo" @current-change="changePageNoInfo" :current-page.sync="infoQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="infoQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="infoTotal"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleInfo = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import { activityDelApi, activityUpperOrLowerApi, praiseInfoList } from '@/api/newApi/extension/activity.js';
import { praiseRecord } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
  },
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        userMobile: '',
        shareActivityId: this.$route.query.id,
        launchTime: [],
        standardTime: [],
      },
      infoQuery: {
        page: 1,
        limit: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },
      infoTotal: 0,
      dialogVisibleInfo: false,
      dataInfo: [],
      dialogVisibleInfoId: '',
      infoLoading: false,
    };
  },
  async created() {
    this.queryList();
  },
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      if (val == 1) {
        return 'warning';
      } else if (val == 2) {
        return 'success';
      } else if (val == 3) {
        return 'danger';
      } else if (val == 4) {
        return 'info';
      }
    },
    //不同状态显示不同的文字颜色
    filterState(val) {
      if (val == 1) {
        return '未开始';
      } else if (val == 2) {
        return '进行中';
      } else if (val == 3) {
        return '已结束';
      } else if (val == 4) {
        return '已失效';
      }
    },
  },
  methods: {
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      praiseRecord(this.setGetListParm())
        .then((res) => {
          if (res.code === 0) {
            this.$data.dataSource = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    /**
     * 下架
     */
    offTheShelf(row) {
      let text = row.activityStatus == 1 ? '上架' : '下架';
      this.$confirm(`是否确定${text}该活动？`, '提示', {
        confirmButtonText: `${text}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          activityUpperOrLowerApi({
            id: row.marketingActivityId,
            status: row.activityStatus == 1 ? 2 : 4,
          })
            .then((res) => {
              if (res.code === 0) {
                this.$message.success(`${text}操作成功！`);
                this.queryList();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    /**
     * 删除
     */
    toDelete(row) {
      this.$confirm('是否确定删除活动？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          activityDelApi({
            id: row.marketingActivityId,
          })
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('删除成功');
                this.queryList();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    /**
     * 新增活动/编辑/查看/复制
     */
    toActivities(key, row) {
      this.$router.push({
        name: 'praiseEdit',
        path: '/extension/activityManagement/praise/addEdit',
        query: {
          key: key,
        },
        params: {
          rowData: row,
        },
      });
    },

    setGetListParm() {
      let params = { ...this.listQuery };
      Object.keys(params).map((item) => {
        if (item == 'launchTime' && params['launchTime'] && params['launchTime'].length > 0) {
          params.initiateTimeStart = params[item][0];
          params.initiateTimeEnd = params[item][1];
        }
        if (item == 'standardTime' && params['standardTime'] && params['standardTime'].length > 0) {
          params.completeTargetTimeStart = params[item][0];
          params.completeTargetTimeEnd = params[item][1];
        }
        return item;
      });
      return params;
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryList();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        userMobile: '',
        shareActivityId: this.$route.query.id,
        launchTime: [],
        standardTime: [],
      };
      this.search();
    },
    toViewInfo(row) {
      this.dialogVisibleInfo = true;
      this.dialogVisibleInfoId = row.shareActivityInitiateId;
      this.getPraiseInfoList();
    },
    getPraiseInfoList() {
      this.infoLoading = true;
      praiseInfoList({
        page: this.infoQuery.page,
        limit: this.infoQuery.limit,
        shareActivityInitiateId: this.dialogVisibleInfoId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$data.dataInfo = res.data.records;
            this.infoTotal = Number(res.data.total);
          }
        })
        .finally(() => {
          this.infoLoading = false;
        });
    },
    changePageNoInfo(val) {
      this.infoQuery.page = val;
      this.getPraiseInfoList();
    },
    changePageSizeInfo(val) {
      this.infoQuery.limit = val;
      this.getPraiseInfoList();
    },
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryList();
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/praise/index.vue',
        name: 'praise',
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
