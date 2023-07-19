<template>
  <div>
    <div class="top-speed">
      <p v-if="status == nodeEnum.WAIT_REVIEW">
        <img src="@/assets/images/compliance/daishenhe1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
      </p>
      <p v-if="status == nodeEnum.PROCESSING">
        <img src="@/assets/images/compliance/zhucezhong1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
        <span class="status2" v-if="authorizedAgentWorkOrder.checkPassTime">
          审核时间：{{ authorizedAgentWorkOrder.checkPassTime.slice(0, 10) }}
        </span>
        <span class="status3" v-if="authorizedAgentWorkOrder.authTime">
          上传时间：{{ authorizedAgentWorkOrder.authTime.slice(0, 10) }}
        </span>
      </p>
      <p v-if="status == nodeEnum.WAIT_AUTHORIZE && orderServices.progressBar == 2">
        <img src="@/assets/images/compliance/shouquanbohui.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
        <span class="status2" v-if="authorizedAgentWorkOrder.checkPassTime">
          审核时间：{{ authorizedAgentWorkOrder.checkPassTime.slice(0, 10) }}
        </span>
        <span class="status3" v-if="authorizedAgentWorkOrder.authTime">
          上传时间：{{ authorizedAgentWorkOrder.authTime.slice(0, 10) }}
        </span>
      </p>
      <div class="top-reason" v-if="status == nodeEnum.WAIT_AUTHORIZE && orderServices.progressBar == 2">
        <div>
          <img src="@/assets/images/common/reason.png" />
          {{ serviceName }}授权被驳回（原因：
          <span>{{ refuseReason }}</span>
          ）
        </div>
      </div>
      <p v-if="status == nodeEnum.WAIT_UPLOAD && orderServices.progressBar == 2">
        <img src="@/assets/images/compliance/bohui1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
      </p>
      <div class="top-reason" v-if="status == nodeEnum.WAIT_UPLOAD && orderServices.progressBar == 2">
        <div>
          <img src="@/assets/images/common/reason.png" />
          {{ serviceName }}资料被驳回（原因：
          <span>{{ refuseReason }}</span>
          ）
        </div>
      </div>
      <p v-if="status == nodeEnum.REVIEWED">
        <img src="@/assets/images/compliance/yishenhe1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
        <span class="status2" v-if="authorizedAgentWorkOrder.checkPassTime">
          审核时间：{{ authorizedAgentWorkOrder.checkPassTime.slice(0, 10) }}
        </span>
      </p>
      <p v-if="status == nodeEnum.WAIT_AUTHORIZE && orderServices.progressBar == 1">
        <img src="@/assets/images/compliance/daishouquan1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
        <span class="status2" v-if="authorizedAgentWorkOrder.checkPassTime">
          审核时间：{{ authorizedAgentWorkOrder.checkPassTime.slice(0, 10) }}
        </span>
      </p>
      <p v-if="status == nodeEnum.REGISTER_COMPLETE">
        <img src="@/assets/images/compliance/zhucewancheng1.svg" />
        <span class="status1" v-if="authorizedAgentWorkOrder.commitTime">
          提交时间：{{ authorizedAgentWorkOrder.commitTime.slice(0, 10) }}
        </span>
        <span class="status2" v-if="authorizedAgentWorkOrder.checkPassTime">
          审核时间：{{ authorizedAgentWorkOrder.checkPassTime.slice(0, 10) }}
        </span>
        <span class="status3" v-if="authorizedAgentWorkOrder.authTime">
          上传时间：{{ authorizedAgentWorkOrder.authTime.slice(0, 10) }}
        </span>
        <span class="status4" v-if="authorizedAgentWorkOrder.completionTime">
          完成时间：{{ authorizedAgentWorkOrder.completionTime.slice(0, 10) }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["authorizedAgentWorkOrder", "orderServices", "status","refuseReason","serviceName"],
  data() {
    return {
      nodeEnum: {
        WAIT_UPLOAD: "NODE0060", //待上传资料
        WAIT_REVIEW: "NODE0061", //待审核资料
        REVIEWED: "NODE0062", //已审核
        WAIT_AUTHORIZE: "NODE0063", //待授权
        AUTHORIZE_WAIT_CONFIRM: "NODE0064", //授权待确认
        REGISTERING: "NODE0065", //注册中
        REGISTER_COMPLETE: "NODE0066", //注册完成
      },
    };
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
.top-speed {
  text-align: center;
  margin-top: 20px;
  .top-reason {
    text-align: left;
    word-break: break-all;
    margin-top: 20px;
    margin-left: 32px;
    margin-right: 32px;
    padding: 11px 21px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    background: #fff1dd;
    span {
      color: rgba(250, 85, 85, 1);
    }
    img {
      position: relative;
      top: 3px;
    }
  }
  p {
    margin: 0 auto;
    position: relative;
    width: 970px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    .status1 {
      position: absolute;
      top: 28px;
      left: 60px;
    }
    .status2 {
      position: absolute;
      top: 28px;
      left: 241px;
    }
    .status3 {
      position: absolute;
      top: 28px;
      left: 604px;
    }
    .status4 {
      position: absolute;
      top: 28px;
      left: 788px;
    }
  }
}
</style>
