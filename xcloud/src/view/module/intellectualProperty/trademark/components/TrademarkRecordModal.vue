<template>
  <el-dialog title="核名记录" :visible.sync="dialogvisible" :destroy-on-close="true" width="1080px" @close="dialogvisible = false">
    <div class="content">
      <p class="note">
        <template v-if="row.associationType === 'PART'">
          注：当前工单关联的核名记录如下表，但存在<span v-for="(item, index) in notAssociatedList" :key="index">{{ item }}类、</span>未能关联到对应的核名记录。您可以点击「刷新关联记录」进行刷新：
        </template>
        <template v-if="row.associationType === 'ZERO'"> 注：当前工单未能关联到核名记录，「刷新关联记录」 </template>
      </p>
      <el-button type="primary" class="btn" @click="refresh">刷新关联记录</el-button>
      <el-table border :data="tableData" v-loading="loading" ref="table" height="400" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column label="核名记录" prop="recordNo" width="170">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="goTrademarkRecordDetailPage(row)">{{ row.recordNo }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="商标名称" prop="trademarkName" />
        <el-table-column label="核名记录状态" prop="recordStatus">
          <template slot-scope="{ row }">
            {{ trademarkStatusMap[row.recordStatus] }}
          </template>
        </el-table-column>
        <el-table-column label="类别" prop="categoryNum" />
        <el-table-column label="核名通过率">
          <template slot-scope="{ row }">
            <span v-for="(item, index) in row.trademarkSearchRecordReportVOList" :key="index"> {{ getPassRateResult(item) }}<br /> </span>
          </template>
        </el-table-column>
        <el-table-column label="用户确认记录">
          <template slot-scope="{ row }">
            <span v-for="(item, index) in row.trademarkSearchRecordReportVOList" :key="index">
              <template v-if="!item.reportType">--</template>
              <template v-else>{{ reportTypeMap[item.reportType] || '--' }}：{{ userConfirmStatusMap[item.userConfirmStatus] || '--' }}<br /></template>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="报告处理人">
          <template slot-scope="{ row }">
            <span v-for="(item, index) in row.trademarkSearchRecordReportVOList" :key="index">
              <template v-if="!item.reportType">--</template>
              <template v-else>{{ reportTypeMap[item.reportType] || '--' }}：{{ item.submitUserName || '--' }}<br /></template>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="当前处理人">
          <template slot-scope="{ row }"> {{ row.curCheckUserName || '--' }} </template>
        </el-table-column>
        <el-table-column label="销售/客服人员">
          <template slot-scope="{ row }"> {{ row.saleUserName || '--' }} / {{ row.customerServiceUserName || '--' }} </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="{ row }"> {{ row.createName || '--' }} </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import { getTrademarkRecord, handleAssociatedTrademarkRecord } from '@/api/newApi/intellectualProperty/trademark';
import { trademarkStatusMap, reportTypeMap, userConfirmStatusMap } from '../enumeratedList';
export default {
  props: {
    row: Object,
    visible: Boolean,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      userId: this.$store.state.user.userId,
      trademarkStatusMap,
      reportTypeMap,
      userConfirmStatusMap,
      notAssociatedList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  watch: {
    row(val) {
      this.getList(val);
      if (val) {
        this.notAssociatedList = this.getNotAssociatedList(val);
      }
    },
  },
  methods: {
    // 刷新关联记录
    refresh() {
      const { countryCode, trademarkNameEn, trademarkCategory, workOrderId, userId, firstCheckUserId } = this.row;
      const categoryList = JSON.parse(trademarkCategory).map((o) => o.category1Num);
      handleAssociatedTrademarkRecord({
        categoryList,
        countryCode,
        trademarkNameEn,
        workId: workOrderId,
        userId,
        firstCheckUserId,
      }).then((res) => {
        if (res.code === 0) {
          this.loading = false;
          this.getList(this.row);
          this.$emit('change');
          this.handleRefreshSuccess(res.data);
        }
      });
    },
    // 刷新成功
    handleRefreshSuccess(data) {
      const { associationType, categoryList } = data;
      const { userMobile, countryCode, trademarkNameEn, workOrderId } = this.row;
      if (associationType === 'ALL') {
        this.$confirm('该工单下商标的所有类目，已成功关联对应的核名记录', '核名记录关联成功', {
          confirmButtonText: '确认',
          showCancelButton: false,
          type: 'success',
        });
      } else {
        const categoryStr = categoryList.map((item) => `${this.transformCategory(item)}类`).join('、');
        let title = '',
          content = '';
        // 部分关联
        if (associationType === 'PART') {
          title = '有部分类目未关联核名记录';
          content = `该工单下商标的${categoryStr}，未找到关联的核名记录。`;
        }
        // 未关联
        if (associationType === 'ZERO') {
          title = '未关联到核名记录';
          content = `该工单下商标，未找到关联对应的核名记录。`;
        }
        this.$confirm(content, title, {
          confirmButtonText: '去创建',
          showConfirmButton: this.userId === this.row.firstCheckUserId,
          cancelButtonText: '关闭',
          type: 'warning',
        }).then(() => {
          this.$router.push(`/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord?workId=${workOrderId}&userMobile=${userMobile}&trademarkName=${trademarkNameEn}&countryCode=${countryCode}`);
        });
      }
    },
    // 获取未关联的类别
    getNotAssociatedList(val) {
      if (!val.categoryList.length) {
        return [];
      }
      return val.categoryList.map((item) => this.transformCategory(item));
    },
    // 获取关联列表
    getList(row) {
      this.loading = true;
      getTrademarkRecord({
        workId: row.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.loading = false;
          this.tableData = res.data;
        }
      });
    },
    // 1类 -> 01类， 2类 -> 02类，...
    transformCategory(category) {
      return ('' + category).length === 1 ? `0${category}` : category;
    },
    // 跳转到详情
    goTrademarkRecordDetailPage(row) {
      const { id, recordNo } = row;
      this.$router.push(`/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/details?id=${id}&recordNo=${recordNo}`);
    },
    // 通过率
    getPassRateResult(item) {
      if (!item.reportType) {
        return '--';
      } else {
        let str = !item.checkPassRate && !item.checkResult ? '无修改建议' : `${item.checkPassRate}，${item.checkResult}`;
        return `${reportTypeMap[item.reportType] || '--'}: ${str}`;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.link {
  font-size: 12px;
}
.content {
  text-align: left;

  .note {
    color: red;
  }
  .btn {
    margin: 10px 0;
  }
}
</style>
