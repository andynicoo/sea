<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item>
          <h3><span class="active">疯狂猜猜猜</span> <span @click="goTipicManage">题目管理</span></h3>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="addActivities('add')" icon="el-icon-plus"> 新建猜猜猜答题活动 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.answerActivityName }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动类型">
          <template slot-scope="scope">{{ scope.row.type | filterActivityType }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动时间" sortable prop="answerActivityBeginTime" width="300px">
          <template slot-scope="scope">{{ scope.row.answerActivityBeginTime }}至 {{ scope.row.answerActivityEndTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">{{ scope.row.answerActivityStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="上架状态">
          <template slot-scope="scope">{{ scope.row.whetherTheShelf == 'YES' ? '已上架' : scope.row.whetherTheShelf == 'NO' ? '未上架' : '' }}</template>
        </el-table-column>
        <el-table-column align="center" label="答题人数" width="300px" prop="answerNumberPeople"> </el-table-column>
        <el-table-column align="center" label="答题次数" prop="answerQuantity"> </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.answerActivityStatus == '未开始' || scope.row.answerActivityStatus == '进行中'">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities('edit', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="答题记录" placement="top" v-if="scope.row.answerActivityStatus != '未开始'">
              <el-link type="primary" class="icon icon-tax" :underline="false" @click="toGuessRecord(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="复制" placement="top">
              <el-link type="primary" class="icon icon-copy" :underline="false" @click="toActivities('copy', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="上架" placement="top" v-if="scope.row.answerActivityStatus == '未开始' && scope.row.whetherTheShelf != 'YES'">
              <el-link type="primary" class="icon icon-upper" :underline="false" @click="offTheShelf(scope.row, true)"></el-link>
            </el-tooltip>
            <el-tooltip content="下架" placement="top" v-if="scope.row.answerActivityStatus != '已失效' && scope.row.whetherTheShelf != 'NO'">
              <el-link type="primary" class="icon icon-xiajia" :underline="false" @click="offTheShelf(scope.row, false)"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.answerActivityStatus == '已失效' || scope.row.answerActivityStatus == '已结束'">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="toDelete(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="查看" placement="top" v-if="scope.row.answerActivityStatus == '已结束' || scope.row.answerActivityStatus == '已失效'">
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
import { guessPageApi, soldOutGuessData, delGuessData } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
    };
  },
  created() {
    this.queryList();
  },
  filters: {
    filterActivityType(val) {
      if (val == 'GUESS_GENERAL') {
        return '猜猜答题';
      } else if (val == 'GUESS_RIDDLES') {
        return '猜灯谜活动';
      }
    },
  },
  methods: {
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      guessPageApi(this.listQuery)
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
    goTipicManage() {
      this.$router.push({
        name: 'topicManage',
        path: '/extension/activityManagement/topicManage/index',
      });
    },
    /**
     * 上下架
     */
    offTheShelf(row, isUp) {
      let text = isUp ? '是否确定上架该活动？' : '下架后不可恢复，确定下架？';
      this.$confirm(text, '提示', {
        confirmButtonText: `${isUp ? '上架' : '下架'}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.guessUpperDown(row, isUp);
        })
        .catch(() => {});
    },
    // 上架
    guessUpperDown(row, isUp) {
      soldOutGuessData({
        answerId: row.answerId,
        whetherTheShelf: isUp ? 'YES' : 'NO',
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(`${isUp ? '上架' : '下架'}操作成功！`);
            this.queryList();
          }
        })
        .catch(() => {});
    },

    /**
     * 删除
     */
    toDelete(row) {
      this.$confirm(`确认删除【${row.answerActivityName}】？删除后答题内所有数据都被清除。`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delGuessData({
            answerId: row.answerId,
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
        name: 'guessAddEdit',
        path: '/extension/activityManagement/guess/addEdit',
        query: {
          key: key,
          id: row.answerId,
          answerActivityStatus: row.answerActivityStatus,
        },
      });
    },
    addActivities(key) {
      this.$router.push({
        name: 'guessAddEdit',
        path: '/extension/activityManagement/guess/addEdit',
        query: {
          key: key,
        },
      });
    },

    toGuessRecord(row) {
      this.$router.push({
        name: 'guessRecord',
        path: '/extension/activityManagement/guess/record',
        query: {
          id: row.answerId,
          name: row.answerActivityName,
          startTime: row.answerActivityBeginTime,
          finishTime: row.answerActivityEndTime,
        },
      });
    },
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
<style scoped lang="scss">
h3 {
  color: #8c8c8c;
  .active {
    color: #333;
  }
  span {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>
