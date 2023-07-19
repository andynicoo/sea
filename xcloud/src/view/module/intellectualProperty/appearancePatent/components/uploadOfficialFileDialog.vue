<template>
  <el-dialog title="上传官方文件" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="文件类型" prop="status">
        <el-select placeholder="请选择文件类型" v-model="form.status">
          <el-option :value="1" label="审查意见OA"></el-option>
          <el-option :value="2" label="授权书"></el-option>
          <!-- <el-option :value="3" label="受理回执"></el-option> -->
          <el-option :value="4" label="外观专利证书"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件" prop="fileStr">
        <UploadFileUrl :fileList.sync="form.fileStr" fileClass uploadText="上传文件" :maxSize="maxSize" :initTip="`文件限制：文件大小不超过${maxSize}M`" :showTip="false" />
      </el-form-item>
      <el-form-item label="官方日期" prop="officeDate" v-if="form.status === 4">
        <el-date-picker v-model="form.officeDate" type="date" :clearable="false" placeholder="请选择官方日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
      </el-form-item>
      <template v-if="form.status !== 4">
        <el-form-item label="官方开始日期" prop="officeStartDate">
          <el-date-picker v-model="form.officeStartDate" type="date" :clearable="false" placeholder="请选择官方开始日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="官方结束日期" prop="officialExpirationDate">
          <el-date-picker v-model="form.officialExpirationDate" type="date" :clearable="false" placeholder="请选择官方结束日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { progressBarObj } from '../enumObj';
import { OAPatentUploadOfficialFile } from '@/api/newApi/intellectualProperty/OAAppearancePatent';
import { uploadAuthorizationFile } from '@/api/newApi/intellectualProperty/certificate';
import { patentAttorneyUpload } from '@/api/newApi/intellectualProperty/appearancePatent';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  props: {
    uploadOfficialFileDialog: Boolean,
    serviceId: String,
    isOaComplete: Boolean,
    isAuthComplete: Boolean,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        status: '',
        fileStr: '',
        officeDate: '',
        officeStartDate: '',
        officialExpirationDate: '',
      },
      rules: {
        status: [{ required: true, message: '请选择文件类型', trigger: 'blur' }],
        fileStr: [{ required: true, message: '请上传文件', trigger: 'change' }],
        officeDate: [{ required: true, message: '请选择官方日期', trigger: 'change' }],
        officeStartDate: [{ required: true, message: '请选择官方开始日期', trigger: 'change' }],
        officialExpirationDate: [{ required: true, message: '请选择官方结束日期', trigger: 'change' }],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadOfficialFileDialog;
      },
      set(val) {
        this.$emit('update:uploadOfficialFileDialog', val);
      },
    },
    maxSize() {
      return this.form.status === 4 ? 40 : 5;
    },
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      let { status, fileStr, officeDate, officeStartDate, officialExpirationDate } = this.form;
      if ([1, 2].includes(status) && +new Date(officeStartDate) > +new Date(officialExpirationDate)) {
        this.$message.warning('开始日期不能早于结束日期');
        return;
      }
      // 在审核期，如果有OA流程或授权书流程未完成时，限制不能上传“外观专利证书”
      if (status === 4) {
        if (!this.isOaComplete) {
          this.$message.warning('有进行中的OA流程，暂时不能上传专利证书');
          return;
        }
        if (!this.isAuthComplete) {
          this.$message.warning('有进行中的授权书流程，暂时不能上传专利证书');
          return;
        }
      }

      let data = {},
        api = '';
      switch (status) {
        // 审查意见OA
        case 1:
          data = {
            fileStr,
            officeStartDate,
            officialExpirationDate,
          };
          api = OAPatentUploadOfficialFile;
          break;
        // 授权书
        case 2:
          data = {
            fileStr,
            officeDateBegin: officeStartDate,
            officeDateEnd: officialExpirationDate,
          };
          api = uploadAuthorizationFile;
          break;
        // 外观专利证书
        case 4:
          data = {
            patentCertificate: fileStr,
            officialDate: officeDate,
          };
          api = patentAttorneyUpload;
          break;
      }
      api({
        ...data,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('上传成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style></style>
