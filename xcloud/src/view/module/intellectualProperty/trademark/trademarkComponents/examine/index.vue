<!--oa工单页面 平台审核 律师审核  -->
<template>
  <!-- 审核 -->
  <el-dialog :title='title' :visible.sync="isShow" width="30%" center :before-close="handleClose">
    <div>
      <slot name="em-tips"></slot>
      <div class="em-info">
        <el-row class="info-row rwo-title">客户选择答复方案:</el-row>
        <div class="info-row" v-show="trademarkReplyPlan.length != 0" v-for="(item, index) in trademarkReplyPlan" :key="index">
          <el-row>
            {{index+1}}: {{ item.replyStr}}
          </el-row>
        </div>
        <el-row class="info-row " v-show="trademarkReplyPlan.length == 0"> 客户暂无方案</el-row>
      </div>

      <div class="em-info">
        <div v-if="remark">
          <el-row class="info-row rwo-title">客户备注:</el-row>
          <el-row class="info-row">{{remark}}</el-row>
        </div>
        <div v-else>
          <el-row class="info-row "><span class="rwo-title"> 客户备注：</span> 客户暂无备注</el-row>
        </div>
      </div>

      <el-row v-if="radio != 0" class="mg-row-30">
        <el-col style="line-height: 33px;" :span="6">客户截止日期：</el-col>
        <el-col :span="10">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="customerDeadDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-row>

      <el-radio-group class="em-radio" v-model="radio" size="small">
        <template v-for="(item,index) in radioList">
          <el-radio :label='index' border :key='index'>{{item}}</el-radio>
        </template>
      </el-radio-group>

      <div v-if=" radio != 0" class="em-reject">
        <el-input type="textarea" placeholder="请输入驳回原因(必填)" v-model="rejectAnswerReason" maxlength="500" show-word-limit>
        </el-input>
      </div>
    </div>

    <p slot="footer">
      <el-button type="primary" ghost style="margin-right:20px;" @click="close">取消</el-button>
      <el-button type="primary" @click="auditFunc">确认</el-button>
    </p>
  </el-dialog>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';
import { newThrottle } from '@/libs/throttle';
import { formatDate } from '@/libs/tools.js';
export default {
  name: 'Examine',
  props: {
    title: String,
    exmineShow: {
      type: Boolean,
      default: false,
    },
    id: String,
    lableList: {
      type: Array,
      default: () => [],
    },
  },
  inject: {
    workerDetailGetList: {
      default: null,
    },
  },
  data() {
    return {
      auditType: '',
      rejectAnswerReason: '',
      auditModal: false,
      radio: 0,
      trademarkReplyPlan: [],
      remark: '',
      isShow: false,
      customerDeadDate: '', //客户截止日期
      bol: this.title == '律师审核',
      isOtherRadioShow: true,
    };
  },

  watch: {
    exmineShow: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },

  computed: {
    radioList() {
      // console.log('lableList', this.lableList);
      if (!this.isOtherRadioShow) {
        let newList = [...this.lableList];
        let sliceVal = newList.findIndex((item) => item == '仅驳回使用证据');
        if (sliceVal != -1) newList.splice(sliceVal, 1);
        return newList;
      } else {
        return this.lableList;
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      let { code, data } = await API.getOaReplyPlanAndEvidence(this.id);
      if (code == 0) {
        this.trademarkReplyPlan = data.trademarkReplyPlan
          .filter((item) => item.choiceSource == 1 && item.planInfo && item.planInfo != '')
          .map((item) => JSON.parse(item.planInfo));
        this.isOtherRadioShow = !!Object.keys(data.trademarkWorkOrderEvidence).length != 0;
        this.remark = data.remark;
        this.serviceId = data.trademarkWorkOrderEvidence.serviceId;
      }
    },

    auditFunc: newThrottle('userCommit'),

    userCommit() {
      if (this.rejectAnswerReason == '' && this.radio != 0) {
        this.$message({ type: 'error', message: '请输入驳回原因' });
        return;
      }

      let parm = {
        reason: this.rejectAnswerReason,
        customerDeadDate: this.customerDeadDate,
        oaFileId: this.id,
        serviceId: this.serviceId,
      };

      this.radio == 0 ? this.passMaterialsAPI(parm) : this.reMaterialsAPI(parm);
    },

    //驳回  1-平台驳回 2-平台审核通过 3-律师驳回 4-律师审核通过 5-仅驳回使用证据
    async reMaterialsAPI(parm) {
      parm.operationType = this.setOperationType();
      let { code, data } = await API.rejectAnswerAPI(parm);
      if (code == 0) this.successful();
    },
    //驳回  1-平台驳回 2-平台审核通过 3-律师驳回 4-律师审核通过 5-仅驳回使用证据
    setOperationType() {
      if (this.radio == 2) {
        return 5;
      } else if (this.radio == 1) {
        return this.bol ? 3 : 1;
      } else {
        return this.bol ? 4 : 2;
      }
    },
    //通过
    async passMaterialsAPI(parm) {
      parm.operationType = this.bol ? 4 : 2;
      let { code, data } = await API.passAnswerAPI(parm);
      if (code == 0) this.successful();
    },

    successful() {
      this.$message({ type: 'success', message: '操作成功' });
      this.close();
      this.workerDetailGetList();
    },

    handleClose(done) {
      done();
      this.$emit('update:exmineShow', false);
    },
    close() {
      this.isShow = false;
      this.$emit('update:exmineShow', false);
    },
  },
};
</script>
<style lang='scss' scoped>
.em-info {
  background: rgb(239, 249, 255);
  margin: 15px 0px;
}
.em-radio {
  margin: 5px 0px;
}
.em-reject {
  margin-top: 20px;
}
.info-row {
  padding: 5px;
}
.mg-row-30 {
  margin: 30px 0px;
}

.rwo-title {
  font-size: 16px;
  // color: #000000;
  font-family: 'Arial Normal', 'Arial', sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>