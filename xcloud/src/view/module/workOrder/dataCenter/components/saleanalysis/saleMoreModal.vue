<template>
  <div>
    <el-dialog :title="title" :visible.sync="showModal" width="880px">
      <el-table
        class="table-wrap"
        :data="dataSource"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column prop="groupByTypeName" :label="columnLabelArr[type - 1]"></el-table-column>
        <el-table-column prop="amountMoney" label="销售额（￥）"></el-table-column>
        <el-table-column prop="productSales" label="商品销量"></el-table-column>
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
import { getAnalyzeList } from '@/api/newApi/workOrder/dataCenter.js';
export default {
  data() {
    return {
      showModal: false,
      tableLoading: false,
      columnLabelArr: ['日期', '部门', '类目', '国家', '服务商', '商品', '人员'],
      pageSize: {
        page: 1,
        limit: 10,
      },
      total: 0,
      dataSource: [],
    };
  },
  props: {
    title: {
      default: '标题',
    },
    firstColumnLabel: {
      default: '-',
    },
    formModal: {
      default: () => {},
    },
    type: {
      default: 0,
    },
    keyStr: {
      default: '',
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
      const params = Object.assign({}, this.formModal, this.pageSize, { type: this.type });
      getAnalyzeList(params).then((res) => {
        this.tableLoading = false;
        if (res.code === 0) {
          try {
            const data =
              this.keyStr === 'orderSalesModelVOList'
                ? res.data[this.keyStr]
                : res.data.orderSalesModelVOMap[this.keyStr];
            this.total = Number(data.total);
            this.dataSource = data.records;
          } catch (err) {
            this.dataSource = [];
            console.warn(this.keyStr);
          }
        }
      });
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
</style>
