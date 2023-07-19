<template>
  <Modal v-model="show" title="上传材料" width="592" :footer-hide="true" @on-cancel="cancel">
    <div class="answer-box">
      <div class="answer-box-content">
        <div class="answer-box-panel">
          <div class="answer-box-h3">审查意见内容</div>
          <div class="box-1">
            <div class="box-1-1">
              <h3>官方翻译</h3>
              <p>{{ oaDetailInfo.interpretFileContent }}</p>
            </div>
            <div class="box-1-2 box-flex" v-if="oaDetailInfo.hlepDocument">
              审查意见详情：
              <a
                v-for="(link, index) in JSON.parse(oaDetailInfo.hlepDocument)"
                :key="index"
                :href="link.fileUrl"
                target="_blank"
                >{{ `${index + 1}、${link.oldFileName} （点击查看）` }}</a
              >
            </div>
          </div>
        </div>
        <div class="answer-box-panel" v-if="playInfo">
          <div class="answer-box-h3">选择的答复方案</div>
          <div class="plan-view-box">
            <p>{{ playInfo.replyStr }}</p>
            <Table border :columns="serviceFeeColumns" :data="list"></Table>
          </div>
        </div>
        <div class="step-box-three">
          <h3><span style="color: #FF6600">*</span>上传答复资料</h3>
          <Upload
            class="upload-box"
            :max-size="30 * 1024"
            :before-upload="beforeUploadAccept"
            :on-format-error="formatErrorHandler"
            :on-success="(res, file, fileList) => successHandler(res, file, fileList)"
            :on-remove="(file, fileList) => removeHandler(file, fileList)"
            :format="['rar', 'zip']"
            :action="uploadUrl"
          >
            <div class="uploads"><span>上传文件</span></div>
          </Upload>
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
      </div>
      <BtnSlot>
        <Button @click="submit" type="primary">确认</Button>
      </BtnSlot>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import BtnSlot from './btnSlot.vue';
import { getOaTrademarkReplyPlan, answerOaMaterialsApi } from '@/api/breadInfoDetail';

export default {
  props: {
    replyId: [Number, String],
    list: {
      type: Array,
      default: () => [],
    },
    playInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      show: false,
      remark: '',
      receptFile: '',
      fileName: '',
      serviceFeeColumns: [
        {
          title: '服务',
          key: 'evidenceComboName',
          align: 'center',
        },
        {
          title: '国家',
          key: 'oaCountry',
          align: 'center',
          width: '150px',
        },
        {
          title: '售价',
          key: 'oaPrice',
          align: 'center',
          width: '150px',
        },
      ],
    };
  },
  components: { BtnSlot },
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
    }),
  },
  methods: {
    cancel() {},
    submit() {
      const { id: oaFileId } = this.oaDetailInfo;
      const { receptFile: fileUrl, remark, replyId } = this;
      const planJson = JSON.stringify(this.playInfo);
      const chooseSource = 1;
      const params = { replyId, oaFileId, fileUrl, chooseSource, remark };
      if (!fileUrl) {
        this.$Notice.warning({
          title: '请上传正确的材料',
        });
        return;
      }
      answerOaMaterialsApi(params)
        .then((res) => {
          const { code, data } = res;
          if (code === 0) {
            this.$emit('update');
          }
          this.show = false;
        })
        .catch(() => {
          this.show = false;
        });
    },
    getOaTrademarkReplyPlan() {
      return getOaTrademarkReplyPlan(this.oaDetailInfo.id);
    },
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
.plan-view-box {
  border: 1px solid #c6ddea;
  padding: 12px 20px 24px;
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  > p {
    margin-bottom: 12px;
  }
}
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
    background: url(./img/icon-fileup-d.png) no-repeat 17px center / 14px auto;
    &:hover {
      background: url(./img/icon-fileup-a.png) no-repeat 17px center / 14px auto;
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
.box-flex {
  display: flex;
  justify-content: space-between;
  > a {
    flex: 1;
    width: 0;
  }
}
</style>
