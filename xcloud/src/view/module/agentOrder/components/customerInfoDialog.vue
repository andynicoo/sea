<template>
  <!-- 客户资料 -->
  <el-dialog title="客户资料" :visible.sync="dialogvisible" width="850px" class="man-confirm-dialog" @close="reset">
    <UploadFile :drag="false" :accept="'.jpg,.png,.pdf,.zip, xls, .xlsx, .csv,.txt,.rar,.doc,.docx'" :fileList.sync="fileList" :showFileList="false">
      <div slot="uploadBtn">
        <el-button class="float-right">上传文件</el-button>
      </div>
    </UploadFile>
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="list" border max-height="400" ref="table" style="width: 100%">
        <!-- <Empty slot="empty"> </Empty> -->
        <el-table-column align="center" label="序号" width="70" type="index">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="资料名称" width="200" prop="attachmentName"> </el-table-column>
        <el-table-column align="center" label="上传时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link type="primary" :underline="false" @click="removeInfo(scope.row)" class="icon icon-del"></el-link>
            </el-tooltip>

            <el-tooltip effect="dark" content="下载" placement="top">
              <el-link type="primary" :underline="false" target="_blank" class="icon el-icon-download" :href="scope.row.attachmentUrl.replace('http://', 'https://')"> </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import UploadImages from '@/components/UploadImages';
import { getAgentInfoList, uploadAgentOrder, removeAgentInfo } from '@/api/newApi/agentOrder/agentOrder.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
export default {
  components: { UploadImages, UploadFile },
  data() {
    return {
      list: [],
      fileList: [],
    };
  },
  props: {
    showCustomerInfo: Boolean,
    rowData: Object,
  },
  computed: {
    dialogvisible: {
      get() {
        if (this.showCustomerInfo) {
          this.getList();
        }
        return this.showCustomerInfo;
      },
      set(val) {
        this.$emit('update:showCustomerInfo', val);
      },
    },
  },
  watch: {
    fileList(val) {
      uploadAgentOrder({
        agencyOrderAttachmentParamList: [
          {
            agencyOrderId: this.rowData.agencyOrderId,
            attachmentName: val[0].name,
            attachmentUrl: val[0].url,
          },
        ],
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '上传成功',
          });
          this.getList();
          this.fileList = [];
        } else {
          this.$message({ type: 'error', message: res.message });
        }
      });
    },
  },
  created() {},
  methods: {
    getList() {
      getAgentInfoList(this.rowData.agencyOrderId).then((res) => {
        if (res.code == 0) {
          this.list = res.data;
        } else {
          this.$message({ type: 'error', message: res.message });
        }
      });
    },
    removeInfo(row) {
      this.$confirm('确定删除？', '删除提示', {
        type: 'warning',
      }).then(() => {
        this.conformRemoveInfo(row);
      });
    },
    conformRemoveInfo(row) {
      removeAgentInfo(row.agencyOrderAttachmentId).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.getList();
        } else {
          this.$message({ type: 'error', message: res.message });
        }
      });
    },
    reset() {
      this.$emit('refresh');
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .el-table__body-wrapper .el-table__empty-block {
//   width: 750px !important;
// }
</style>
