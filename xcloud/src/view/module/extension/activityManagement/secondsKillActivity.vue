<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item>
          <h3>秒杀活动</h3>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="toActivities('add')" icon="el-icon-plus" v-show="hasAuthority('E2_12')"> 新建单品秒杀 </el-button>
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
          <template slot-scope="scope">{{ scope.row.startTime }} 至 {{ scope.row.finishTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.activityStatus | filterStyle(statusEnum)">
              <span>
                {{ scope.row.activityStatus | filterState(statusEnum) }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable label="实付金额">
          <template slot-scope="scope">{{ scope.row.totalAmount | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" sortable label="付款订单数">
          <template slot-scope="scope">{{ scope.row.payOrderNum }}</template>
        </el-table-column>
        <el-table-column align="center" sortable label="付款人数">
          <template slot-scope="scope">{{ scope.row.payPeopleNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <!-- (activityStatus:1未开始2进行中3已结束4已失效) -->
          <!-- statusEnum: {
            NOT_STARTED: 'NOT_STARTED,', // 未开始
            PROCESSING: 'PROCESSING', // 进行中
            FINISHED: 'FINISHED,', // 已结束
            INVALID: 'INVALID,', // 已失效
          } -->
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.activityStatus === statusEnum.NOT_STARTED || scope.row.activityStatus === statusEnum.PROCESSING" v-show="hasAuthority('E2_7')">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities('edit', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="复制" placement="top" v-show="hasAuthority('E2_8')">
              <el-link type="primary" class="icon icon-copy" :underline="false" @click="toActivities('copy', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip :content="scope.row.activityStatus === statusEnum.NOT_STARTED ? '上架' : '下架'" placement="top" v-if="scope.row.activityStatus === statusEnum.NOT_STARTED || scope.row.activityStatus === statusEnum.PROCESSING" v-show="hasAuthority('E2_9')">
              <el-link type="primary" :class="scope.row.activityStatus === statusEnum.NOT_STARTED ? 'icon icon-upper' : 'icon icon-xiajia'" :underline="false" @click="offTheShelf(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.activityStatus === statusEnum.FINISHED || scope.row.activityStatus === statusEnum.INVALID" v-show="hasAuthority('E2_10')">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="toDelete(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="查看" placement="top" v-if="scope.row.activityStatus === statusEnum.PROCESSING || scope.row.activityStatus === statusEnum.FINISHED || scope.row.activityStatus === statusEnum.INVALID" v-show="hasAuthority('E2_11')">
              <el-link type="primary" class="icon icon-see" :underline="false" @click="toActivities('view', scope.row)"></el-link>
            </el-tooltip>
            <!-- <el-tooltip content="推广" placement="top">
              <el-link type="primary" class="icon icon-invite" :underline="false" @click="toPromotion(row)"></el-link>
            </el-tooltip> -->
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
import { activityDelApi, activityPageApi, activityUpperOrLowerApi } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },
      statusEnum: {
        NOT_STARTED: 'NOT_STARTED', // 未开始
        PROCESSING: 'PROCESSING', // 进行中
        FINISHED: 'FINISHED', // 已结束
        INVALID: 'INVALID', // 已失效
      },
    };
  },
  async created() {
    this.queryList();
  },
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val, statusEnum) {
      switch (val) {
        case statusEnum.NOT_STARTED:
          return 'warning';
        case statusEnum.PROCESSING:
          return 'success';
        case statusEnum.FINISHED:
          return 'danger';
        case statusEnum.INVALID:
          return 'info';
      }
    },
    //不同状态显示不同的文字颜色
    filterState(val, statusEnum) {
      switch (val) {
        case statusEnum.NOT_STARTED:
          return '未开始';
        case statusEnum.PROCESSING:
          return '进行中';
        case statusEnum.FINISHED:
          return '已结束';
        case statusEnum.INVALID:
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
      activityPageApi(this.listQuery)
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
      let text = row.activityStatus === this.statusEnum.NOT_STARTED ? '上架' : '下架';
      this.$confirm(`是否确定${text}该活动？`, '提示', {
        confirmButtonText: `${text}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          activityUpperOrLowerApi({
            marketingActivityId: row.marketingActivityId,
            enterpriseId: Number(localStorage.getItem('enterpriseId')),
            status: row.activityStatus === this.statusEnum.NOT_STARTED ? 'PROCESSING' : 'INVALID',
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
            enterpriseId: Number(localStorage.getItem('enterpriseId')),
            marketingActivityId: row.marketingActivityId,
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
    toActivities(key, row = {}) {
      this.$router.push({
        name: 'editActivity',
        path: '/extension/activityManagement/editActivity',
        query: {
          key: key,
          marketingActivityId: row.marketingActivityId,
        },
      });
    },
    /**
     * 推广
     */
    toPromotion(row) {},
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryList();
    },
  },
};
</script>
<style scoped lang="scss"></style>
