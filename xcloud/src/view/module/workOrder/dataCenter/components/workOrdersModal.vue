<template>
  <div>
    <el-dialog title="处理工单数信息" :visible.sync="showModal" width="880px">
      <div class="title-tips">
        <span>总处理次数： {{ resData.disposeNum || 0 }} 次；</span>
        <span>平均时效： {{ resData.avgPrescriptionTest || '-' }}；</span>
      </div>
      <el-table
        class="table-wrap"
        :data="dataSource"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
        :default-sort="{ prop: 'avgPrescriptionTest', order: 'descending' }"
      >
        <el-table-column prop="serviceNo" label="服务号" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="copyText(scope.row.serviceNo)">
              {{ scope.row.serviceNo }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="申报周期" align="center" v-if="resData.declare"></el-table-column>
        <el-table-column prop="disposeNum" label="处理次数" align="center" sortable></el-table-column>
        <el-table-column
          prop="avgPrescriptionTest"
          label="平均时效"
          sortable
          sort-by="averageDisposeTime"
        ></el-table-column>
      </el-table>
      <el-pagination
        class="pagination-wrap"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageSize.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { agingStatisticsServiceNo } from '@/api/newApi/workOrder/dataCenter.js';
export default {
  data() {
    return {
      showModal: false,
      tableLoading: false,
      pageSize: {
        page: 1,
        limit: 10,
      },
      total: 0,
      dataSource: [],
      resData: {},
    };
  },
  props: {
    params: {
      default: () => {},
    },
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.getList();
        });
      } else {
        this.total = 0;
        this.dataSource = [];
      }
    },
  },
  mounted() {},
  methods: {
    // 搜索
    getList() {
      this.tableLoading = true;
      const params = Object.assign({}, this.params, this.pageSize);
      agingStatisticsServiceNo(params)
        .then((res) => {
          this.tableLoading = false;
          if (res.code === 0) {
            const data = res.data || {};
            this.resData = data;
            if (data.statisticsServiceNoListVos) {
              this.total = parseInt(data.statisticsServiceNoListVos.total || 0);
              this.dataSource = data.statisticsServiceNoListVos.records || [];
            } else {
              this.total = 0;
              this.dataSource = [];
            }
          }
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    //复制
    copyText(str) {
      const textarea = document.createElement('textarea');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.value = str;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('Copy');
      if (result) {
        this.$message.success('复制成功');
        textarea.remove();
      }
    },
    handleSizeChange(val) {
      this.pageSize.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageSize.page = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.table-wrap {
  min-height: 400px;
}
.pagination-wrap {
  margin: 5px 0;
}
.title-tips {
  background-color: rgba(230, 247, 255, 1);
  margin-bottom: 10px;
  line-height: 30px;
  padding: 6px 12px;
}
</style>
