<template>
  <div class="answer-box">
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
    <div class="answer-box-panel" v-if="choosePlan">
      <div class="answer-box-h3">选择的答复方案</div>
      <div class="plan-view-box">
        <p>{{ JSON.parse(choosePlan.planInfo).replyStr }}</p>
        <Table border :columns="serviceFeeColumns" :data="JSON.parse(choosePlan.planInfo).oaServiceList"></Table>
      </div>
    </div>
    <div class="answer-box-panel" v-if="userAnswerInfo && (userAnswerInfo.receptFile || userAnswerInfo.remark)">
      <div class="answer-box-h3">上传的答复资料</div>
      <div class="box-1">
        <div class="box-1-2" v-if="userAnswerInfo.receptFile">
          审查意见详情：<a :href="userAnswerInfo.receptFile" target="_blank"
            >{{ userAnswerInfo.fileName }} （点击查看）</a
          >
        </div>
      </div>
      <div class="remark-box" v-if="userAnswerInfo.remark">
        <h5>备注：</h5>
        <p>{{ userAnswerInfo.remark }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { ByOaReplyCreateOrderApi, answerOaPlan } from '@/api/breadInfoDetail';

export default {
  data() {
    return {
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
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
      choosePlan: (state) => state.newOa.choosePlan,
      userAnswerInfo: (state) => state.newOa.userAnswerInfo,
    }),
  },
  methods: {
    submit() {
      const { id: oaFileId } = this.oaDetailInfo;
      const { id: replyId, planInfo: planJson } = this.choosePlan;
      const params = {
        replyId,
        oaFileId,
        //planJson,
        remark: '',
        fileUrl: '',
      };
      if (this.userAnswerInfo && this.userAnswerInfo.remark) {
        params.remark = this.userAnswerInfo.remark;
      }
      if (this.userAnswerInfo && this.userAnswerInfo.receptFile) {
        params.fileUrl = this.userAnswerInfo.receptFile;
      }
      return answerOaPlan(params);
    },
    createOrder() {
      const { id: oaId } = this.oaDetailInfo;
      const { id: replyId, planInfo: planJson } = this.choosePlan;
      const params = {
        replyId,
        oaId,
        planJson,
        remark: '',
        fileUrl: '',
      };
      if (this.userAnswerInfo && this.userAnswerInfo.remark) {
        params.remark = this.userAnswerInfo.remark;
      }
      if (this.userAnswerInfo && this.userAnswerInfo.receptFile) {
        params.fileUrl = this.userAnswerInfo.receptFile;
      }
      return ByOaReplyCreateOrderApi(params);
    },
  },
};
</script>
<style lang="less" scoped>
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
.box-flex {
  display: flex;
  justify-content: space-between;
  > a {
    flex: 1;
    width: 0;
  }
}
.remark-box {
  margin-top: 32px;
  h5 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;
    margin-bottom: 16px;
  }
  p {
    background: #eef9ff;
    border-radius: 2px;
    margin: 0;
    padding: 8px 16px 14px;
    font-size: 14px;
    color: #999999;
    line-height: 22px;
  }
}
/deep/ .ivu-table-header thead tr th {
  background: #f1f1f1;
}
</style>
