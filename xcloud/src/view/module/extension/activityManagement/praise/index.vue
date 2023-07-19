<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form inline label-width="70px">
        <el-form-item>
          <h3>集赞助力</h3>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="addActivities('add')" icon="el-icon-plus"> 新增集赞助力活动 </el-button>
        </el-form-item>
      </el-form>
      <el-form ref="searchForm" inline>
        <el-form-item label="活动名称">
          <el-input placeholder="输入名称，模糊查询" clearable style="width: 168px" size="small" v-model="listQuery.activityName" />
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.activityStatus">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="NOT_STARTED"></el-option>
            <el-option label="进行中" value="PROCESSING"></el-option>
            <el-option label="已结束" value="FINISHED"></el-option>
            <el-option label="已失效" value="INVALID"></el-option>
          </el-select>
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
        <el-table-column align="center" label="适用端口">
          <template slot-scope="scope">{{ getApplyChannelType(scope.row.applyChannel) }}</template>
        </el-table-column>
        <el-table-column align="center" label="参与人数">
          <template slot-scope="scope">
            <a @click="toPraiseRecord(scope.row)">{{ scope.row.initiateNum }}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="达标人数">
          <template slot-scope="scope">{{ scope.row.completeNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <!-- (activityStatus:1未开始2进行中3已结束4已失效) -->
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.activityStatus == 'NOT_STARTED'">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities('edit', scope.row)"></el-link>
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
import { praiseList, praiseDel, praiseUpperOrLower, praiseInfoList } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      applyChannelType: { PC: 'PC', XCX: '小程序', H5: 'H5' },
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
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
      praiseList(this.listQuery)
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
          praiseUpperOrLower({
            shareActivityId: row.shareActivityId,
            status: row.activityStatus == 'NOT_STARTED' ? 'UPPER' : 'LOWER',
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
          praiseDel(row.shareActivityId)
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
          id: row.shareActivityId,
        },
      });
    },
    addActivities(key) {
      this.$router.push({
        name: 'praiseEdit',
        path: '/extension/activityManagement/praise/addEdit',
        query: {
          key: key,
        },
      });
    },
    toPraiseRecord(row) {
      this.$router.push({
        name: 'praiseRecord',
        path: '/extension/activityManagement/praise/record',
        query: {
          id: row.shareActivityId,
        },
      });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryList();
    },
    getApplyChannelType(applyChannel) {
      let channel = applyChannel.split(',');
      let channelArry = [];
      for (name in this.applyChannelType) {
        if (channel.indexOf(name) > -1) {
          channelArry.push(this.applyChannelType[name]);
        }
      }
      return channelArry.join(',');
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      };
      this.search();
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
