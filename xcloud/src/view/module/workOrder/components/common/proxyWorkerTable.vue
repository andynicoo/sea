<template>
  <div class="header-container" v-if="proxyWorkerList.length">
    <div class="header-block">
      <div class="block-title big-size">转代理记录</div>
    </div>
    <div class="el-form-wrapper">
      <el-table ref="table" border :data="proxyWorkerList" :max-height="500" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="工单" width="200px" prop="serviceName"></el-table-column>
        <el-table-column align="center" label="工单号" width="150" prop="serviceNo"> </el-table-column>
        <el-table-column align="center" label="服务商" prop="supplierName"> </el-table-column>
        <el-table-column align="center" label="工单创建时间" prop="createTime">
          <template slot-scope="scope">
            {{ (scope.row.createTime || '').split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务状态" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | serviceStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务进度" prop="nodeCodeName"> </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="delItem(scope.row)" v-show="hasAuthority(deleteKey)"> 删除 </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @current-change="handleCurrentChange" :current-page.sync="form.page" :page-size="form.limit" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getproxyWorker, delProxyWorker } from '@/api/newApi/taxServices/taxRegister.js';
export default {
  props: {
    groupId: String,
    fucntionCode: [String, Number]
  },
  data() {
    return {
      form: {
        limit: 10,
        page: 1,
      },
      total: 0,
      proxyWorkerList: [],
    };
  },
  computed: {
    deleteKey() {
      return this.fucntionCode = this.$constant.TAXRegAnd_FUNCTION_CODE ? 'L1_44' : 'K1_35'
    }
  },
  mounted() {
    this.getProxyWorkerList();
  },
  methods: {
    getProxyWorkerList() {
      getproxyWorker({
        ...this.form,
        groupId: this.groupId,
      }).then((res) => {
        if (res.code === 0) {
          this.proxyWorkerList = res.data.records;
          this.total = Number(res.data.total);
        }
      });
    },
    delItem(row) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          delProxyWorker({ workOrderId: row.workOrderId }).then((res) => {
            if (res.code === 0) {
              this.form.page = 1;
              this.getProxyWorkerList();
              this.$message.success('删除成功');
            } else {
              this.$message.error('删除失败');
            }
          });
        },
      });
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getProxyWorkerList();
    },
  },
};
</script>

<style></style>
