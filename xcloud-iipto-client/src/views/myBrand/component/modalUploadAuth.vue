<template>
  <Modal v-model="show" title="上传授权书" width="592" :footer-hide="true" @on-cancel="cancel">
    <div class="answer-box">
      <div class="answer-box-content">
        <div class="answer-box-panel">
          <div class="answer-box-h3">上传授权书步骤</div>
          <ul class="auth-step">
            <li v-for="(item, index) in steps" :key="index">
              <img :src="item.img" alt="" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
          <div
            class="file-list-1"
            v-if="oaDetailInfo.authorizationExampleFile || oaDetailInfo.authorizationTemplateFile"
          >
            <p v-if="oaDetailInfo.authorizationTemplateFile">
              <a :href="oaDetailInfo.authorizationTemplateFile" download="" target="_blank">
                授权书模板文件（点击下载）</a
              >
            </p>
            <p v-if="oaDetailInfo.authorizationExampleFile">
              <a :href="oaDetailInfo.authorizationExampleFile" target="_blank">授权书示例文件（点击查看）</a>
            </p>
          </div>
        </div>
        <div class="answer-box-panel" v-if="oaDetailInfo.rejectReason">
          <div class="answer-box-h3">驳回原因</div>
          <div class="box-1">
            <div class="box-1-1">
              <p>{{ oaDetailInfo.rejectReason }}</p>
            </div>
          </div>
        </div>
        <div class="step-box-three">
          <h3><span>*</span>上传授权书</h3>
          <Upload
            class="upload-box"
            :max-size="30 * 1024"
            :before-upload="beforeUploadAccept"
            :on-format-error="formatErrorHandler"
            :on-success="(res, file, fileList) => successHandler(res, file, fileList)"
            :on-remove="(file, fileList) => removeHandler(file, fileList)"
            :format="['pdf']"
            :action="uploadUrl"
          >
            <div class="uploads"><span>上传文件</span></div>
          </Upload>
        </div>
      </div>
      <BtnSlot>
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="submit">确认</Button>
      </BtnSlot>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { handleAuthorizationFile } from '@/api/breadInfoDetail';
import BtnSlot from './btnSlot.vue';
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      show: false,
      steps: [
        {
          label: '下载授权书模板文件',
          img: require('./img/icon-down.svg'),
        },
        {
          label: '打印并签字',
          img: require('./img/icon-print.svg'),
        },
        {
          label: '上传电子版授权书',
          img: require('./img/icon-up.svg'),
        },
      ],
      receptFile: [],
      fileName: '',
    };
  },
  components: { BtnSlot },
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
    }),
  },
  methods: {
    cancel() {
      this.show = false;
    },
    submit() {
      const { receptFile } = this;
      const { id: oaFileId } = this.oaDetailInfo;
      if (receptFile.length === 0) {
        this.$Notice.warning({
          title: '请上传授权书',
        });
        return;
      }
      handleAuthorizationFile({ authorizationFile: receptFile.join(','), oaFileId }).then((res) => {
        const { code, data } = res;
        if (res.code === 0) {
          this.$emit('update');
        }
        this.show = false;
      });
    },
    beforeUploadAccept(file) {
      const check = this.receptFile.length == 2;
      const self = this;
      if (check) {
        self.$Notice.warning({
          title: '最多只可上传2个文件',
        });
        return false;
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
        desc: '文件格式不正确, 只能上传pdf格式的文件',
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
      this.receptFile.push(res.data.fileUrl);
      this.fileName = fileName;
    },
    removeHandler(i) {
      this.receptFile = [];
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-body {
  padding: 14px 0 0;
}
/deep/ .answer-box-content {
  padding: 0 40px 24px;
}
.step-box-three {
  h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-bottom: 16px;
    span {
      color: #ff6600;
    }
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
    background: url(./img/icon-fileup-d.png) no-repeat 17px center / 14px auto;
    &:hover {
      background: url(./img/icon-fileup-a.png) no-repeat 17px center / 14px auto;
      border-color: #00a3ff;
      span {
        color: #00a3ff;
      }
    }
    &::after {
      content: '请参照授权书实例文件签名后上传，支持格式：pdf';
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
.answer-box {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  &-tips {
    &-yellow {
      height: 38px;
      display: flex;
      align-items: center;
      background: #fffbe6;
      border-radius: 2px;
      border: 1px solid #ffe58f;
      font-size: 14px;
      color: #333333;
      padding: 0 14px;
      margin-bottom: 32px;
      span {
        color: #00a3ff;
      }
      img {
        width: 16px;
        margin-right: 6px;
      }
    }
  }
  &-panel {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }
  &-h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 16px;
  }
  .box-1 {
    &-1 {
      background: #eff9ff;
      padding: 8px 16px;
      font-size: 12px;
      color: #666666;
      line-height: 20px;
      h3 {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 4px;
        line-height: 22px;
      }
    }
    &-2 {
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      margin-top: 12px;
      a,
      span {
        color: #00a3ff;
      }
    }
  }
  .tips-text-yellow {
    font-size: 14px;
    color: #faad14;
    line-height: 22px;
  }
}
.auth-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  line-height: 14px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    &:not(:last-child):after {
      content: '';
      position: absolute;
      top: 15px;
      left: calc(100% + 16px);
      width: 79px;
      height: 13px;
      background: url(./img/arrow-a-lg.svg) no-repeat left center / 100% auto;
    }
    img {
      width: 44px;
      margin-bottom: 8px;
    }
  }
}
.file-list-1 {
  font-size: 14px;
  color: #333333;
  p:last-child {
    margin-bottom: 0;
  }
  a {
    color: #00a3ff;
  }
}
</style>
