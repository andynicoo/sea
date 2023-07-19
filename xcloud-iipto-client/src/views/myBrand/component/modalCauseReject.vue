<template>
  <Modal v-model="show" title="驳回原因" @on-ok="onComfirm" @on-cancel="onClose" :footer-hide="true" :width="600">
    <div class="reject-box">
      <div class="reject-box-container">
        <div class="reject-box-tips" v-if="oaDetailInfo.fileType !== 15">
          <Icon
            size="16"
            color="#F0B955"
            type="ios-information-circle"
            style="cursor: pointer; transform: rotate(180deg)"
          />
          <p>
            请与<span>{{ momentData(info.officialExpirationDate) }}</span
            >日前答复，逾期视为主动放弃，会导致商标注册失败
          </p>
        </div>
        <div class="reject-box-content">
          <h4>驳回原因</h4>
          <p>
            {{ info.rejectReason }}
          </p>
          <a v-if="info.rejectFile" :href="info.rejectFile" target="_blank">{{ info.rejectFile }}（点击查看）</a>
        </div>
      </div>
      <div class="reject-box-footer">
        <Button @click="todo" type="primary">{{ btuStr }}</Button>
      </div>
    </div>
  </Modal>
</template>
<script>
import moment from 'moment';
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    info: {},
  },
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
    }),
    btuStr() {
      if (this.oaDetailInfo) {
        if ([5, 9, 17].includes(this.oaDetailInfo.status) && this.oaDetailInfo.fileType !== 15) {
          // 答复方案和材料的重新上传
          return '重新上传';
        } else {
          return '关闭';
        }
      }
    },
  },
  data() {
    return {
      show: false,
      fileTypeMap: {
        1: '注册受理回执',
        2: '注册受理书',
        3: '收到审查意见',
        4: '答复审查意见',
        7: '暂停信',
        8: '商标证书',
        15: '授权书',
      },
    };
  },
  methods: {
    momentData: (date) => {
      return moment(date).format('YYYY-MM-DD');
    },
    onClose: () => {
      this.show = false;
    },
    onComfirm: () => {
      this.onClose();
    },
    todo() {
      const { status } = this.oaDetailInfo;
      this.show = false;
      if ([5, 9, 17].includes(status)) {
        this.$emit('rePlay');
      }
    },
  },
};
</script>
<style lang="less" scoped>
.reject-box {
  p {
    margin-bottom: 0;
  }
  &-container {
    padding: 14px 40px 24px;
  }
  &-tips {
    display: flex;
    align-items: center;
    height: 38px;
    padding: 0 16px;
    color: #333333;
    font-size: 14px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    margin-bottom: 32px;
    p {
      margin-left: 7px;
      span {
        color: #00a3ff;
      }
    }
  }
  &-content {
    h4 {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.9);
      line-height: 22px;
    }
    p {
      margin: 16px 0;
      background: #eff9ff;
      border-radius: 2px;
      padding: 16px 14px;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
    a {
      font-size: 14px;
      font-weight: 400;
      color: #00a3ff;
      line-height: 22px;
    }
  }
  &-footer {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 24px;
    border-top: 1px solid rgba(153, 153, 153, 0.2);
  }
}
</style>
