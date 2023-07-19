<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item>
          <h3>砍价活动</h3>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="goProductDetail('add')" icon="el-icon-plus"> 新建砍价活动 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.activityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动时间" sortable prop="supplierId" width="300px">
          <template slot-scope="scope">{{ scope.row.startTime }}至 {{ scope.row.finishTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.activityStatus | filterStyle">
              <span>
                {{ scope.row.activityStatus | filterState }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发起人数">
          <template slot-scope="scope">{{ scope.row.sponsorNumberPeople }}</template>
        </el-table-column>
        <el-table-column align="center" label="帮砍人数">
          <template slot-scope="scope">{{ scope.row.helpCutNumberPeople }}</template>
        </el-table-column>
        <el-table-column align="center" label="砍价成功数">
          <template slot-scope="scope">{{ scope.row.bargainSucceedNumber }}</template>
        </el-table-column>
        <el-table-column align="center" label="成交订单数">
          <template slot-scope="scope">{{ scope.row.makeOrderNumber }}</template>
        </el-table-column>
        <el-table-column align="center" label="剩余库存">
          <template slot-scope="scope">{{ scope.row.residueStock }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <!-- (activityStatus:1未开始2进行中3已结束4已失效) -->
          <template slot-scope="scope">
            <el-tooltip content="砍价记录" placement="top" v-if="scope.row.activityStatus != 'NOT_STARTED'">
              <el-link type="primary" class="icon icon-tax" :underline="false" @click="toPresseRecord(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" v-if="scope.row.activityStatus == 'NOT_STARTED' || scope.row.activityStatus == 'PROCESSING'">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivitiesEdit('edit', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="复制" placement="top">
              <el-link type="primary" class="icon icon-copy" :underline="false" @click="toActivities('copy', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip :content="scope.row.activityStatus == 'NOT_STARTED' ? '上架' : '下架'" placement="top" v-if="scope.row.activityStatus == 'NOT_STARTED' || scope.row.activityStatus == 'PROCESSING'">
              <el-link type="primary" :class="scope.row.activityStatus == 'NOT_STARTED' ? 'icon icon-upper' : 'icon icon-xiajia'" :underline="false" @click="offTheShelf(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.activityStatus == 'FINISHED' || scope.row.activityStatus == 'INVALID'">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="toDelete(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="查看" placement="top">
              <el-link type="primary" class="icon icon-see" :underline="false" @click="toActivities('view', scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { presseList, presseDel, presseUpperOrLowerApi } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  async created() {
    this.queryList();
  },
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      if (val == 'NOT_STARTED') {
        return 'warning';
      } else if (val == 'PROCESSING') {
        return 'success';
      } else if (val == 'FINISHED') {
        return 'danger';
      } else if (val == 'INVALID') {
        return 'info';
      }
    },
    //不同状态显示不同的文字颜色
    filterState(val) {
      if (val == 'NOT_STARTED') {
        return '未开始';
      } else if (val == 'PROCESSING') {
        return '进行中';
      } else if (val == 'FINISHED') {
        return '已结束';
      } else if (val == 'INVALID') {
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
      presseList(this.listQuery)
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
      let text = row.activityStatus == 'NOT_STARTED' ? '上架' : '下架';
      this.$confirm(`是否确定${text}该活动？`, '提示', {
        confirmButtonText: `${text}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          presseUpperOrLowerApi({
            id: row.bargainActivityId,
            status: row.activityStatus == 'NOT_STARTED' ? 'PROCESSING' : 'INVALID',
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
          presseDel({ id: row.bargainActivityId })
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
    toActivitiesEdit(key, row) {
      this.$router.push({
        name: 'presseEdit',
        path: '/extension/activityManagement/presse/addEdit',
        query: {
          key: key,
          id: row.bargainActivityId,
          status: row.activityStatus,
        },
      });
    },
    toActivities(key, row) {
      this.$router.push({
        name: 'presseEdit',
        path: '/extension/activityManagement/presse/addEdit',
        query: {
          key: key,
          id: row.bargainActivityId,
        },
      });
    },
    addActivities(key) {
      this.$router.push({
        name: 'presseEdit',
        path: '/extension/activityManagement/presse/addEdit',
        query: {
          key: key,
        },
      });
    },
    toPresseRecord(row) {
      this.$router.push({
        name: 'presseRecord',
        path: '/extension/activityManagement/presse/record',
        query: {
          id: row.bargainActivityId,
        },
      });
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
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      };
      this.search();
    },
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryList();
    },
    goProductDetail(type) {
      this.$router.push({ path: '/extension/activityManagement/presse/addEdit', query: { key: type } });
    },
  },
};
</script>
<style scoped lang="scss"></style>
