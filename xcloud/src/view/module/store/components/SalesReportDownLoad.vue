<template>
  <div>
    <el-dialog title="查看报告" :visible.sync="showModal" width="880px">
      <div class="wrap">
        <!-- <div class="download-btn">
          <Button type="primary" @click="dowmLoadReportBatch()">批量下载报告</Button>
        </div> -->
        <Table border :columns="columns" :data="listData">
          <template slot="status" slot-scope="{ row }">
            <span style="color: green" v-if="row.status === 1">已生成</span>
            <span style="color: #666" v-else-if="row.status === 2">部分生成</span>
            <span style="color: red" v-else-if="row.status === 3">生成失败</span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <el-button size="small" v-if="row.status === 1" @click="dowmLoadReport(row)" type="primary"
              >下载报告</el-button
            >
            <el-button size="small" v-else @click="createAgain(row)" type="primary">重新生成</el-button>
          </template>
        </Table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reloadReport, reCreateReport } from '@/api/newApi/workOrder/store.js';
export default {
  data() {
    return {
      showModal: false,
      columns: [
        {
          title: '生成时间',
          key: 'reportGetTime',
          width: '180px',
        },
        {
          title: '店铺名称',
          key: 'shopName',
          width: '130px',
        },
        {
          title: '跨境平台',
          key: 'platformDesc',
        },
        {
          title: '生成状态',
          slot: 'status',
        },
        {
          title: '备注',
          key: 'remarks',
        },
        {
          title: '操作',
          slot: 'operate',
        },
      ],
      listData: [],
    };
  },
  props: {
    record: {
      default: {},
    },
  },
  watch: {
    showModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.listData = [this.record];
        });
      }
    },
  },
  mounted() {},
  methods: {
    dowmLoadReportBatch() {
      console.log('批量下载');
    },
    dowmLoadReport(row) {
      location.href = row.reportUrl;
    },
    createAgain(row) {
      if (row.status === 2) {
        this.$message.success('亚马逊正在努力生成中...');
        reloadReport({
          taxNo: row.relateTaxNo,
        }).then((res) => {});
      } else if (row.status === 3) {
        this.$message.success('亚马逊正在努力生成中...');
        reCreateReport({
          taxNo: row.relateTaxNo,
        }).then((res) => {});
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  padding-bottom: 20px;
  .download-btn {
    padding: 10px;
  }
}
</style>
