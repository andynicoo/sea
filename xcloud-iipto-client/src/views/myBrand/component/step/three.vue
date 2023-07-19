<template>
  <div class="step-box-three">
    <h3>上传答复资料</h3>
    <Upload
      class="upload-box"
      :max-size="30 * 1024"
      :before-upload="beforeUploadAccept"
      :on-format-error="formatErrorHandler"
      :on-success="(res, file, fileList) => successHandler(res, file, fileList)"
      :on-remove="(file, fileList) => removeHandler(file, fileList)"
      :format="['rar', 'zip']"
      :action="uploadUrl"
      ref="upload"
    >
      <div class="uploads"><span>上传文件</span></div>
    </Upload>
    <p class="tips-yellow">注：可先支付官方费用，再上传答复资料</p>
    <div class="panel">
      <h3>备注</h3>
      <Input
        v-model="remark"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请输入备注信息"
      ></Input>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      remark: '',
      receptFile: '',
      fileName: '',
    };
  },
  computed: {
    ...mapState({
      userAnswerInfo: (state) => state.newOa.userAnswerInfo,
    }),
  },
  methods: {
    ...mapMutations(['setUserAnswerInfo']),
    beforeUploadAccept(file) {
      const check = this.receptFile == '';
      const self = this;
      if (!check) {
        self.$Notice.warning({
          title: '最多只可上传1个文件',
        });
        return check;
      } else if (file.size > 2097152 * 15) {
        self.$Notice.warning({
          title: '文件大小超过30M',
        });
        return false;
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 只能上传zip、rar格式的文件',
      });
    },
    successHandler(res, file, fileList) {
      let self = this;
      console.log('res file', res, file);
      const fileName = res.data.origFileName;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      this.receptFile = res.data.fileUrl;
      this.fileName = fileName;
    },
    removeHandler(i) {
      this.receptFile = '';
    },
    saveInfo() {
      const { remark, receptFile, fileName } = this;
      this.setUserAnswerInfo({
        remark,
        receptFile,
        fileName,
      });
    },
  },
  mounted() {
    if (this.userAnswerInfo) {
      const { remark, receptFile } = this.userAnswerInfo;
      this.remark = remark;
      this.receptFile = receptFile;
    }
  },
  activated() {
    if (!this.userAnswerInfo) {
      this.$refs['upload']._data.fileList = [];
      this.remark = '';
      this.receptFile = '';
      this.fileName = '';
    }
  },
};
</script>
<style lang="less" scoped>
.step-box-three {
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-bottom: 16px;
  }
  .uploads {
    position: relative;
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-indent: 38px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
    background: url(../img/icon-fileup-d.svg) no-repeat 17px center / 14px auto;
    &:hover {
      background: url(../img/icon-fileup-a.svg) no-repeat 17px center / 14px auto;
      border-color: #00a3ff;
      span {
        color: #00a3ff;
      }
    }
    &::after {
      content: '请上传压缩文件，支持格式zip、rar';
      position: absolute;
      width: 400px;
      left: calc(100% + 28px);
      top: 5px;
      font-size: 12px;
      color: #999999;
      line-height: 22px;
      text-indent: 0;
    }
  }
  .tips-yellow {
    font-size: 14px;
    color: #ff6600;
    line-height: 22px;
    margin-top: 8px;
  }
}
/deep/ .ivu-table-header thead tr th {
  background: #f1f1f1;
}
</style>
