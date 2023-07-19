<template>
  <div>
    <el-dialog
      title="审核资料"
      :visible.sync="dialogvisible"
      width="660px"
      center
      @close="reset"
    >
      <h3 class="text-default" >1、操作指引</h3>
      <div class="content">
        <el-descriptions  direction="vertical" :column="2" border :labelStyle="{'text-align':'center'}">
          <el-descriptions-item label="使用说明">
            <div class="list-item">
              <p>1、选择表格文件</p>
              <p>2、核对数据对应关系，简单调整</p>
              <p>3、确认导入</p>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="导入规则说明">
            <div class="list-item">
              <p>1.文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小&lt;20M。</p>
              <p>2.数据为空的将不会进行导入</p>
              <p>3.模板中的表头名称不可更改，表头行不能删除</p>
              <p>4.表格信息中如果已有重复数据，系统将自动覆盖历史数据信息</p>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <h3 class="text-default">2、下载模板</h3>
      <div class="content">
        <el-link type="primary" :underline="false" target="_blank" icon="el-icon-download" :href="templateUrl">商标注册工单小类信息导入模板</el-link>
      </div>
      <h3 class="text-default">3、上传表格数据</h3>
      <!-- <UploadFileUrl :fileList.sync="file" accept=".xls,.xlsx" :showTip="false" /> -->
      <el-upload
        ref="uploadRef"
        :data="uploadData"
        :action="uploadUrl"
        accept=".xls,.xlsx"
        :headers="uploadHeaders"
        :limit="2"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="handleChange"
        :on-remove="handleRemove"
        drag
      >
        <div class="drag-wrapper">
          <i class="icon icon-file-upload"></i>
          <div class="el-upload__text" style="line-height: 1.5;margin-top: 10px;font-size: 12px">
            <div>点击或将文件拖拽到这里上传</div>
          </div>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="uploadLoading">导入</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导入异常结果"
      :visible.sync="importResultDialog"
      width="660px"
      class="import-result-dialog"
      center
    >
      <div class="tip">
        <span class="required">*</span>
        <span>以下小类信息在系统中不存在，请进行确认</span>
      </div>

      <el-table
        v-for="result in importResultList"
        :key="result.kind"
        :data="result.items"
        class="import-result-table"
        header-row-class-name="table-list"
        style="width: 100%">
        <el-table-column label="大类信息">
          <el-table-column
            prop="nameCh"
            label="商标小类名 (中文)"
            >
          </el-table-column>
        </el-table-column>
        <el-table-column>
          <template slot="header">{{result.kind}}</template>
          <el-table-column
            prop="nameEn"
            label="商标小类名 (英文)"
            >
          </el-table-column>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="importResultDialog = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl'
import { getToken } from "@/libs/util";
export default {
  props: {
    importDialog: Boolean,
    serviceId: String,
    nodeCode: String,
    countryCode: String
  },
  components: {
    UploadFileUrl
  },
  data() {
    return {
      uploadUrl: this.baseUrl + "/workorder/management/trademark/workorder/brandDataImport",
      uploadData: {
        countryCode: this.countryCode,
        nodeCode: this.nodeCode,
        serviceId: this.serviceId
      },
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
        enterpriseId: localStorage.getItem("enterpriseId")
      },
      importResultDialog: false,
      uploadLoading: false,
      importResultList: [],
      fileList: [],
      // 模板下载链接
      templateUrl: 'https://file.itaxs.com/dev/20220617/5057e3ede5ee440290f4b160b7af622b/商标注册工单小类信息导入模板.xlsx'
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.importDialog;
      },
      set(val) {
        this.$emit("update:importDialog", val);
      },
    },
  },
  methods: {
    submit() {
      if(!this.fileList.length) {
        this.$message.warning('请上传文件')
        return
      }
      this.uploadLoading = true
      this.$refs.uploadRef.submit()
    },
    reset() {
      this.$refs.uploadRef.clearFiles()
    },
    beforeUpload(file) {
      let fileType = this.$util.getFileSuffixName(file.name)
      const FILE_TYPE = ["xlsx", "xls"];
      const MAX_SIZE = file.size / 1024 / 1024 < 20
      // 验证文件类型
      if (!FILE_TYPE.includes(fileType)) {
        this.$message.warning('请选择excel格式的文件')
        return false
      }
      // 验证文件大小
      if (!MAX_SIZE) {
        this.$message.warning('文件不大于20M')
        return false
      }
      return true
    },
    handleSuccess(res) {
      this.uploadLoading = false
      this.dialogvisible = false
      if(Object.values(res.data).every(item => !item.length)) {
        // 没有异常数据
        this.$confirm("工单小类信息导入成功", "导入结果", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success",
        })
      } else {
        // 有异常数据
        this.importResultDialog = true
        let data = Object.entries(res.data).filter(item => item[1].length)
        this.importResultList = []
        data.forEach(items => {
          this.importResultList.push({
            kind: items[0],
            items: items[1].map(c => ({
              nameCh: c[2],
              nameEn: c[3]
            }))
          })
        })
      }
      this.$emit('refresh')
    },
    handleError(e, file) {
      this.uploadLoading = false
      this.$message.error('导入失败')
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    }
  },
};
</script>

<style lang="less" scoped>
.text-default{
  margin:  10px 0;
  font-weight: bold;
}
.tip {
  margin-bottom: 10px;
  .required {
    color: #d9001b;
  }
}
.title-wrapper {
  margin-bottom: -17px;
  .sub-title {
    padding: 8px 10px;
    margin: -8px -10px 8px;
    border-bottom: 1px solid #EBEEF5;
    white-space: nowrap;
  }
}
.item-content {
  padding: 8px 10px;
  margin: -8px -10px 8px;
  border-bottom: 1px solid #EBEEF5;
}
::v-deep .import-result-table {
  margin-bottom: 10px;
}
::v-deep .table-list {
  .el-table__cell {
    background-color: #f5f7fa !important;
    text-align: center !important;
  }
}
::v-deep .el-upload{
  max-width: 300px;
  max-height: 120px;
  box-sizing: border-box;
  .el-upload-dragger {
    width: 300px;
    height: 120px;
  }
  .drag-wrapper {
    padding: 30px;
  }
}
.import-result-dialog {
  ::v-deep .el-dialog--center .el-dialog__footer {
    text-align: center !important;
  }
}
</style>>
