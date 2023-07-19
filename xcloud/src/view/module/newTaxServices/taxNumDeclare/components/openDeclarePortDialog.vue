<template>
  <el-dialog title="开通申报端口" :visible.sync="dialogvisible" width="650px" center @close="closeModel">
    <p class="mb-10 color-red">请勾选需要开通申报的端口，未勾选的不支持提交申报</p>

    <div class="table-wrap">
      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="申报周期">
          <template slot-scope="scope"
            >{{ (scope.row.beginTime || '').split(' ')[0] }} -
            {{ (scope.row.endTime || '').split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="状态">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="current" :page-size="limit" :total="listTotal"></el-pagination>
    </div>

    <el-form class="tax-form mt-10" :model="form" label-width="110px" ref="ruleForm" :rules="rules">
      <el-form-item label="理由：" prop="reason">
        <el-input type="textarea" v-model="form.reason" maxlength="1000" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :maxSize="30" accept=".pdf,.doc,.docx" :fileList.sync="form.approvalFileList"></UploadFile>
      </el-form-item>

      <!-- <el-form-item label="含税销售总额">
        <el-input-number v-model="form.includeTaxPrice" :disabled="taxDisabled" controls-position="right" :min="0.0" :precision="2"></el-input-number>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { declPort, getDecalreOrderList } from '@/api/newApi/taxServices/taxNumDeclare.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
import { statusList } from '@/view/module/newTaxServices/taxNumDeclare/enumObj.js';
export default {
  props: {
    openDeclarePortDialog: Boolean,
    serviceNo: String,
    getserviceDetail: {
      type: Function,
      default: null,
    },
  },
  components: { UploadFile },
  data() {
    return {
      formLabelWidth: '120px',
      limit: 10,
      listTotal: 0,
      current: 1,
      form: {
        approvalFileList: [],
        reason: '',
      },
      tableData: [],
      rules: {
        reason: [{ required: true, message: '请填写服务截止时间，请填写开通依据（理由）', trigger: 'blur' }],
      },
      form: {
        includeTaxPrice: 0,
        excludeTaxPrice: 0,
        deductionPrice: 0,
        taxAmtTotal: 0,
        allTaxPrice: 0,
      },
      selectRows: [],
    };
  },
  filters: {
    filterStatus(status) {
      if (status < 10) {
        return '未开始';
      }
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  computed: {
    dialogvisible: {
      get() {
        if (this.openDeclarePortDialog) {
          this.getDecalreOrder();
        }
        return this.openDeclarePortDialog;
      },
      set(val) {
        this.$emit('update:openDeclarePortDialog', val);
      },
    },
  },

  watch: {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (!this.selectRows.length) {
            this.$message.error('请勾选需要开通申报的端口');
            return;
          }

          this.confirm();
        } else {
          return false;
        }
      });
    },
    closeModel() {
      this.form.approvalFileList = [];
      this.form.reason = '';
      this.$refs['ruleForm'].resetFields();
      this.selectRows = [];
      this.$refs.multipleTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getDecalreOrder();
    },
    confirm() {
      let id = [];
      this.selectRows.map((item) => {
        id.push(item.id);
      });
      declPort({
        reason: this.form.reason,
        approvalFile: this.form.approvalFileList && this.form.approvalFileList.length ? this.form.approvalFileList[0].url : '',
        id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.dialogvisible = false;
          this.getserviceDetail();
        } else {
          this.$message.error('修改失败');
        }
      });
    },
    handleSelectionChange(rows) {
      this.selectRows = rows;
    },
    getDecalreOrder() {
      getDecalreOrderList(this.serviceNo, {
        page: this.current,
        limit: this.limit,
        status: 10,
      }).then((res) => {
        if (res.code === 0) {
          console.log(res.code);
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$message.error('获取申报数据失败');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}

.table-wrap {
  max-height: 400px;
  overflow: auto;
}
</style>
