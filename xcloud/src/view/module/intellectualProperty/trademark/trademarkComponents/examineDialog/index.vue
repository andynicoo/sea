<!-- 平台审核 律师审核 -->
<template>
  <div>
    <Modal v-model="auditModal" :title="answerInfo.status==24?'平台审核':answerInfo.status==25?'律师审核':''">
      <div v-if="answerInfo.status==24">
        <p style="font-weight:700;">注意：审核以客户上传的最新材料为准</p>
        <p>审核通过后，将由律师审核；资料不对，被驳回的，客户需按照要求修改资料</p>
      </div>
      <p v-if="answerInfo.status==25">律师审核通过，即已撰写官文回复商标局；资料不对，则驳回，填写驳回原因，客户需按照要求修改资料</p>
      <RadioGroup v-model="auditType" style="margin:20px 0;">
        <Radio label="0">审核通过</Radio>
        <Radio label="1">资料不对，驳回</Radio>
      </RadioGroup>
      <div v-if="auditType==1">
        <p>驳回原因：</p>
        <Input v-model="rejectAnswerReason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入驳回原因"></Input>
      </div>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right:20px;" @click="auditModal=false">取消</el-button>
        <el-button type="primary" @click="auditFunc">确认</el-button>
      </p>
    </Modal>
  </div>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';
export default {
  props: {
    answerInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      auditModal: false,
      rejectAnswerReason: '',
      auditType: '0',
    };
  },

  components: {},

  computed: {},

  methods: {
    auditFunc() {
      if (this.auditType == 0) {
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 6 ? '2' : this.answerInfo.status == 7 ? '4' : '',
        };
        API.passAnswerAPI(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('notice');
          }
        });
      } else if (this.auditType == 1) {
        if (this.rejectAnswerReason == '') {
          this.$Message.info('请填写驳回原因');
          return;
        }
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 6 ? '1' : this.answerInfo.status == 7 ? '3' : '',
          reason: this.rejectAnswerReason,
        };
        API.rejectAnswerAPI(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('notice');
          }
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
</style>