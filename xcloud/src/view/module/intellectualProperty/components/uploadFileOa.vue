<template>
  <el-dialog :visible.sync="uploadModal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :title="fileModalTitle">
    <el-form :model="formFile" class="formTrans" ref="formFile" :rules="ruleFormFile" label-position="left" label-width="120px">
      <el-form-item label="文件类型：" prop="fileType" v-if="JSON.stringify(nowFileInfo) == '{}'">
        <el-select v-model="formFile.fileType" placeholder="请选择文件类型" style="width: 300px">
          <el-option :value="1" label="受理回执"></el-option>
          <el-option :value="2" label="受理书"></el-option>
          <el-option :value="3" label="审查意见（OA）"></el-option>
          <el-option :value="4" label="审查意见官方回执文件(OA)"></el-option>
          <el-option :value="7" label="暂停审查"></el-option>
          <el-option :value="8" label="商标证书"></el-option>
          <el-option :value="9" label="公告期延长通知"></el-option>
          <el-option :value="10" label="放弃审查意见"></el-option>
          <el-option :value="11" label="对方律师通知函"></el-option>
          <el-option :value="12" label="收到异议通知函"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件类型：" v-else>
        <span>
          <!-- {{nowFileInfo.fileType==1?'受理回执':nowFileInfo.fileType==2?'受理书':nowFileInfo.fileType==3?'审查意见(OA)':nowFileInfo.fileType==4?'审查意见官方回执文件(OA)':nowFileInfo.fileType==7?'暂停信':''}} -->
          {{ nowFileInfo.fileType | formartStr }}
        </span>
      </el-form-item>
      <el-form-item label="上传文件：" prop="fileUrl">
        <el-upload
          :format="['jpg', 'pdf', 'zip', 'png']"
          :max-size="5 * 1024"
          :action="workOrderFileName"
          :file-list="defaultFileList"
          :before-upload="beforeUploadAccept1"
          :on-format-error="formatErrorHandler1"
          :on-success="
            (res, file, fileList) => {
              successHandlerAccept1(res, file, fileList);
            }
          "
          :on-remove="
            (file, fileList) => {
              removeHandlerAccept1(file, fileList);
            }
          "
          style="accept-upload"
        >
          <el-button icon="ios-cloud-upload-outline">上传文件</el-button>
        </el-upload>
        <p class="">文件限制：文件大小不超过5M</p>
      </el-form-item>
      <el-form-item label="上传翻译件：" prop="translateFileUrl" v-if="[4, 9, 10, 11, 12].includes(formFile.fileType)">
        <UploadFileUrl :fileList.sync="formFile.translateFileUrl" :drag="false" :maxSize="5" :showTip="false" uploadWithName>
          <el-button>上传文件</el-button>
        </UploadFileUrl>
        <p>文件限制：文件大小不超过5M</p>
      </el-form-item>
      <el-form-item :label="formFile.fileType === 3 ? '官方开始日期：' : '官方日期：'" prop="officialDate">
        <el-date-picker type="date" v-model="formFile.officialDate" placeholder="2020/01/01" style="width: 300px"></el-date-picker>
      </el-form-item>
      <el-form-item label="官方结束日期：" v-if="formFile.fileType === 3" prop="officialExpirationDate">
        <el-date-picker type="date" v-model="formFile.officialExpirationDate" placeholder="2020/01/01" style="width: 300px"></el-date-picker>
        <p>提示：美标OA答复时间为6个月，英国、欧盟为2个月</p>
      </el-form-item>
      <el-form-item label="备注" prop="remark" v-if="formFile.fileType === 3">
        <el-input type="textarea" v-model.trim="formFile.remark" maxlength="200" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <p slot="footer">
      <el-button type="primary" ghost style="margin-right: 20px" @click="cancelFunc(false)">取消</el-button>
      <el-button type="primary" @click="sureUloadfun" :loading="uploadLoading">确认</el-button>
    </p>
  </el-dialog>
</template>
<script>
import { formatDate } from '@/libs/tools.js';
import * as API from '@/api/newApi/intellectualProperty/oa';
import { Debounce } from '@/libs/throttle';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  props: ['workOrderId', 'oaFileId', 'defaultFileList', 'nowFileInfo', 'defaultTranslateFileList'],
  components: {
    UploadFileUrl,
  },
  data() {
    return {
      uploadModal: true,
      fileModalTitle: '上传官方文件',
      formFile: {
        fileType: '',
        fileUrl: '',
        translateFileUrl: '',
        officialDate: '',
        officialExpirationDate: '',
        remark: '',
      },
      ruleFormFile: {
        fileType: [{ required: true, trigger: 'change', message: ' ', type: 'number' }],
        // fileUrl: [{ required: true, trigger: 'change', message: '请选择上传文件' }],
        // translateFileUrl: [{ required: true, trigger: 'change', message: '请选择翻译件' }],
        officialDate: [{ required: true, trigger: 'change', message: '请选择官方开始日期' }],
        officialExpirationDate: [{ required: true, trigger: 'change', message: '请选择官方结束日期' }],
      },
      uploadLoading: false,
    };
  },
  mounted() {
    if (this.oaFileId) {
      this.fileModalTitle = '修改官方文件';
      this.formFile = { ...this.nowFileInfo };
      this.formFile.officialDate = new Date(this.nowFileInfo.officialDate);
      this.formFile.officialExpirationDate = this.nowFileInfo.officialExpirationDate != '' ? new Date(this.nowFileInfo.officialExpirationDate) : '';
    }
  },

  filters: {
    formartStr(value) {
      switch (value) {
        case 1:
          return '受理回执';
        case 2:
          return '受理书';
        case 3:
          return '审查意见（OA）';
        case 4:
          return '审查意见官方回执文件(OA)';
        case 7:
          return '暂停审查';
        case 8:
          return '商标证书';
        case 9:
          return '公告期延长通知';
        case 10:
          return '放弃审查意见';
        case 11:
          return '对方律师通知函';
        case 12:
          return '收到异议通知函';
      }
    },
  },
  methods: {
    // sureUloadfun: Debounce('sureUload', 2000),
    sureUloadfun() {
      this.$refs['formFile'].validate((valid) => {
        if (valid) {
          if (!this.formFile.fileUrl && ![9, 10, 11, 12].includes(this.formFile.fileType)) {
            this.$message.error('请上传文件');
            return;
          }
          if (!this.formFile.translateFileUrl && [9, 10, 11, 12].includes(this.formFile.fileType)) {
            this.$message.error('请上传翻译件');
            return;
          }
          let data = { ...this.formFile };
          data.officialDate = formatDate(this.formFile.officialDate, 'date');
          data.officialExpirationDate = formatDate(this.formFile.officialExpirationDate, 'date');
          if (data.officialExpirationDate) {
            data.officialExpirationDate = data.officialExpirationDate.split(' ')[0] + ' 23:59:59';
          }
          data.workOrderId = this.workOrderId;
          let requestData = API.addFileOaAPI;
          if (this.oaFileId) {
            requestData = API.updateFileOaAPI;
            data.oaFileId = this.oaFileId;
          }
          this.uploadLoading = true;
          requestData(data)
            .then((res) => {
              if (res.code == 0) {
                this.cancelFunc(true);
                this.$message({
                  message: '操作成功',
                  type: 'success',
                });
              }
            })
            .finally(() => {
              this.uploadLoading = false;
            });
        }
      });
    },
    cancelFunc(val) {
      this.$emit('cancelOa', val);
      this.formFile.officialDate = '';
      this.formFile.officialExpirationDate = '';
    },
    beforeUploadAccept1(file) {
      const check = this.formFile.fileUrl;
      let self = this;
      if (check != '') {
        this.$message({
          message: '最多只可上传1个文件',
          type: 'warning',
        });
        return false;
      } else if (file.size > 5242880) {
        this.$message({
          message: '文件大小超过5M',
          type: 'warning',
        });
        return false;
      }
    },
    formatErrorHandler1() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
      });
    },
    successHandlerAccept1(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$message({
          type: 'warning',
          message: '请尝试再次上传',
        });
        return false;
      }
      this.formFile.fileUrl = res.data.fileUrl;
    },
    removeHandlerAccept1() {
      this.formFile.fileUrl = '';
    },
  },
};
</script>
<style scoped lang="less">
::v-deep .el-upload {
  width: auto !important;
  height: auto !important;
  padding-top: 0 !important;
  border: none !important;
}
</style>
