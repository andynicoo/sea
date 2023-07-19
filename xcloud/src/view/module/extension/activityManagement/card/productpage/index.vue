<!--  -->
<template>
  <div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="会员卡信息">
          <template slot-scope="scope">{{ scope.row.membershipCardName }}</template>
        </el-table-column>
        <el-table-column align="center" label="有效期">
          <template slot-scope="scope">{{ scope.row.validTime + validTimeType[scope.row.validTimeUnit] + '内有效' }}</template>
        </el-table-column>
        <el-table-column align="center" label="价格">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | filterStyle">
              <span>
                {{ scope.row.status | filterState }}
              </span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开卡用户数">
          <template slot-scope="scope">{{ scope.row.openCardNum }}</template>
        </el-table-column>
        <el-table-column align="center" label="累计付费金额">
          <template slot-scope="scope">{{ scope.row.totalPaymentAmount }}</template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <!-- (activityStatus:1未开始2进行中3已结束4已失效) -->
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities('edit', scope.row)"></el-link>
            </el-tooltip>
            <!-- <el-tooltip content="复制" placement="top">
              <el-link type="primary" class="icon icon-copy" :underline="false" @click="toActivities('copy', scope.row)"></el-link>
            </el-tooltip> -->
            <el-tooltip :content="scope.row.status ? '下架' : '上架'" placement="top">
              <el-link type="primary" :class="scope.row.status ? 'icon icon-xiajia' : 'icon icon-upper'" :underline="false" @click="offTheShelf(scope.row)"></el-link>
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
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { togetherDel, cardUpperOrLower } from '@/api/newApi/extension/activity.js';
import { cardListPage } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      initHeight: 65,
      listTotal: 0,
      listQuery: {
        current: 1,
        size: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },
      validTimeType: {
        year: '年',
        month: '月',
        day: '日',
        ypermanent: '永久',
      },
    };
  },
  async created() {
    this.queryList();
  },
  filters: {
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      if (val) {
        return 'success';
      } else {
        return 'warning';
      }
    },

    //不同状态显示不同的文字颜色
    filterState(val) {
      if (val) {
        return '进行中';
      } else {
        return '已下架';
      }
    },
  },
  methods: {
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      cardListPage(this.listQuery)
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
      let text = row.status ? '下架' : '上架';
      let notice = row.status ? '下架后将不可购买，确定下架？' : '上架后继续销售会员卡';
      this.$confirm(notice, '提示', {
        confirmButtonText: `${text}`,
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          cardUpperOrLower({
            id: row.membershipCardId,
            status: row.status ? false : true,
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
          togetherDel(row.spellGroupActivityId)
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
        name: 'cardAddEdit',
        path: '/extension/activityManagement/card/addEdit',
        query: {
          key: key,
          id: row.membershipCardId,
        },
      });
    },
    addActivities(key) {
      this.$router.push({
        name: 'togetherAddEdit',
        path: '/extension/activityManagement/together/addEdit',
        query: {
          key: key,
        },
      });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.current = 1;
      this.queryList();
    },
    handleReset() {
      this.listQuery = {
        current: 1,
        size: 20,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      };
      this.search();
    },
    /**
     * 推广
     */
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
<style lang="scss" scoped></style>
