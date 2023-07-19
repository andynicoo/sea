<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="table-container top-header">
      <div class="table-container-title">上传/下载中心查询</div>
      <div class="tip-wrapper">
        <i class="el-icon-warning"></i>
        <div class="tip-content">
          <div>1.批量上传、批量下载仅针对个人记录，操作人A无法查看操作人B的上传、下载内容；</div>
          <div>2.操作记录仅保留近1个月数据；</div>
          <div>3.下载文件需要导出方可使用；</div>
        </div>
      </div>
      <el-tabs v-model="activeName" ref="elTabs">
        <el-tab-pane label="上传记录" name="firstSort">
          <UploadRecords :productFunctionCode="productFunctionCode" ref="uploadRecords" v-if="activeName === 'firstSort'" @_export="_export" @_del="_del" />
        </el-tab-pane>
        <el-tab-pane label="下载记录" name="secondSort">
          <DownloadRecords :productFunctionCode="productFunctionCode" ref="downloadRecords" v-if="activeName === 'secondSort'" @_export="_export" @_del="_del" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import UploadRecords from './components/uploadRecords.vue';
import DownloadRecords from './components/downloadRecords.vue';
import { delUploadAndDownloadRecordsList } from '@/api/newApi/workOrder/uploadAndDownloadRecords';
export default {
  data() {
    return {
      productFunctionCode: this.$route.query.productFunctionCode,
      activeName: 'firstSort',
    };
  },
  components: {
    UploadRecords,
    DownloadRecords,
  },
  methods: {
    _export({ ids }) {
      if (!ids.length) {
        this.$message.warning('请勾选要操作的记录');
        return;
      }
      window.open(this.baseUrl + '/workorder/management/load_record/export?ids=' + ids.join(','));
    },
    _del({ ref, ids }) {
      if (!ids.length) {
        this.$message.warning('请勾选要操作的记录');
        return;
      }
      delUploadAndDownloadRecordsList({
        ids,
      }).then((res) => {
        this.$message.success('删除成功');
        this.$refs[ref].getList();
      });
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-tabs__item {
  width: 130px;
  text-align: center;
}
.top-header {
  margin-top: 0;
  margin-bottom: 0;
}
.tip-wrapper {
  display: flex;
  background-color: rgba(229, 243, 255, 1);
  padding: 5px 10px;
  .el-icon-warning {
    color: #2d8cf0;
    margin-top: 4px;
    margin-right: 5px;
  }
}
</style>
