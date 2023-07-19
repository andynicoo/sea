<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item>
          <h3>幸运抽奖</h3>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="addActivities('add')" icon="el-icon-plus"> 新建抽奖活动 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动类型">
          <template slot-scope="scope">{{ scope.row.activityType | filterActivityType }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动栏目">
          <template slot-scope="scope">{{ scope.row.displayColumn | filterDisplayColumn }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动时间" sortable prop="supplierId" width="300px">
          <template slot-scope="scope">{{ scope.row.startTime }}至 {{ scope.row.finishTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="抽奖次数">
          <template slot-scope="scope">{{ scope.row.fictitiousNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="抽奖奖品" width="300px">
          <template slot-scope="scope">
            <div>
              <span v-for="(item, index) in scope.row.luckyDrawPrizes" :key="index">{{ item.prizeName + ' ; ' }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- (status:1未开始2进行中3已结束4已失效) -->
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | filterStyle">
              <span>
                {{ scope.row.status | filterState }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽奖人数">
          <template slot-scope="scope">{{ scope.row.luckyPeopleNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="中奖人数">
          <template slot-scope="scope">{{ scope.row.winPeopleNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.status == 0 || scope.row.status == 1">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities('edit', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="抽奖记录" placement="top" v-if="scope.row.status != 0">
              <el-link type="primary" class="icon icon-tax" :underline="false" @click="toDrawRecord(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="复制" placement="top">
              <el-link type="primary" class="icon icon-copy" :underline="false" @click="toActivities('copy', scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip :content="scope.row.status == 0 ? '上架' : '下架'" placement="top" v-if="scope.row.status == 0 || scope.row.status == 1">
              <el-link type="primary" :class="scope.row.status == 0 ? 'icon icon-upper' : 'icon icon-xiajia'" :underline="false" @click="offTheShelf(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="scope.row.status == 2 || scope.row.status == 3">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="toDelete(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="查看" placement="top" v-if="scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 3">
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
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { drawPageApi, drawUpper, drawLower, drawDel } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        current: 1,
        size: 20,
      },
    };
  },
  created() {
    this.queryList();
  },
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      if (val == 0) {
        return 'warning';
      } else if (val == 1) {
        return 'success';
      } else if (val == 2) {
        return 'danger';
      } else if (val == 3) {
        return 'info';
      }
    },
    //不同状态显示不同的文字颜色
    filterState(val) {
      if (val == 0) {
        return '未开始';
      } else if (val == 1) {
        return '进行中';
      } else if (val == 2) {
        return '已结束';
      } else if (val == 3) {
        return '已失效';
      }
    },
    filterDisplayColumn(val) {
      if (val == 'POINTS_MALL') {
        return '积分商城抽奖';
      } else if (val == 'GUESS') {
        return '猜猜猜抽奖';
      } else if (val == 'DAILY_ACTIVITY') {
        return '日常活动抽奖';
      } else if (val == 'GUESS_RIDDLES') {
        return '猜灯谜';
      }
    },
    filterActivityType(val) {
      if (val == 'INSTANT_DRAW') {
        return '即时抽奖';
      } else if (val == 'REGULAR_DRAW') {
        return '定时抽奖';
      }
    },
  },
  methods: {
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      drawPageApi(this.listQuery)
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
     * 上下架
     */
    offTheShelf(row) {
      let text = row.status == 0 ? '上架' : '下架';
      this.$confirm(`是否确定${text}该活动？`, '提示', {
        confirmButtonText: `${text}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (row.status == 0) {
            this.drawUpperBtn(row, text);
          } else {
            this.drawLowerBtn(row, text);
          }
        })
        .catch(() => {});
    },
    // 上架
    drawUpperBtn(row, text) {
      drawUpper({
        id: row.luckyDrawId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(`${text}操作成功！`);
            this.queryList();
          }
        })
        .catch(() => {});
    },
    // 下架
    drawLowerBtn(row, text) {
      drawLower({
        id: row.luckyDrawId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$message.success(`${text}操作成功！`);
            this.queryList();
          }
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
          drawDel({
            id: row.luckyDrawId,
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
        name: 'drawAddEdit',
        path: '/extension/activityManagement/draw/addEdit',
        query: {
          key: key,
          id: row.luckyDrawId,
        },
      });
    },
    addActivities(key) {
      this.$router.push({
        name: 'drawAddEdit',
        path: '/extension/activityManagement/draw/addEdit',
        query: {
          key: key,
        },
      });
    },
    toDrawRecord(row) {
      this.$router.push({
        name: 'draweRecord',
        path: '/extension/activityManagement/draw/record',
        query: {
          id: row.luckyDrawId,
          name: row.name,
          startTime: row.startTime,
          finishTime: row.finishTime,
        },
      });
    },
    /**
     * 推广
     */
    toPromotion(row) {},
    changePageNo(val) {
      this.listQuery.current = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.size = val;
      this.queryList();
    },
  },
};
</script>
<style scoped lang="scss"></style>
