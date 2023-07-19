<template>
  <a-modal :visible="visible" title="下载资料" @cancel="handleCancel" width="720px" :footer="null">
    <div class="content">
      资料已审核并制作完成，<span class="red"
        >请在一个工作日内下载完整资料包（请勿修改资料包文件名），并将完整的注册资料包发送到服务邮箱</span
      >。如有疑问，请咨询在线客服或客户经理，感谢配合！
      <br />
      步骤1: 下载资料，
      <!-- 税/EPR列表 -->
      <a
        v-if="typeof item.customerData === 'string'"
        :href="item.customerData"
        :download="item.customerData"
        target="_blank"
        @click="customerDataDownLoad(item)"
        >点击下载<a-icon type="download" class="icon"
      /></a>
      <!-- 标列表 -->
      <a v-else v-for="(o, i) in item.customerDataList" :key="i" :href="o.fileUrl" :download="o.fileUrl" target="_blank"
        >{{ o.fileRemark }}<a-icon type="download" class="icon"
      /></a>
      <!-- 标详情 -->
      <a v-if="item.fileUrl" :href="item.fileUrl" :download="item.fileUrl" target="_blank"
        >{{ item.fileRemark }}<a-icon type="download" class="icon"
      /></a>
      <!-- 专利列表 -->
      <template v-if="item.designPatentWorkOrder">
        <a
          v-if="item.designPatentWorkOrder.customerRegisterData"
          :href="item.designPatentWorkOrder.customerRegisterData"
          :download="item.designPatentWorkOrder.customerRegisterData"
          target="_blank"
          >注册资料<a-icon type="download" class="icon"
        /></a>
        <a
          v-if="item.designPatentWorkOrder.customerOaReplyData"
          :href="item.designPatentWorkOrder.customerOaReplyData"
          :download="item.designPatentWorkOrder.customerOaReplyData"
          target="_blank"
          >OA答复资料<a-icon type="download" class="icon"
        /></a>
      </template>
      <br />
      步骤2: 将注册资料发送至服务邮箱： <a :href="`mailto:${email}`">{{ email }}</a
      ><span class="copy-email" v-copy="email">复制邮箱地址</span>
    </div>
    <p class="footer">
      <a-popconfirm
        title="是否确认提交？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleEmailSend"
        v-if="!emailSendStatus"
      >
        <a-button type="primary" :disabled="emailSendStatus">我已发送</a-button>
      </a-popconfirm>
      <a-button type="primary" :disabled="emailSendStatus" v-else>我已发送</a-button>
    </p>
  </a-modal>
</template>
<script>
import { getEmailInfo, updateEmailSendService, customerDataDownLoad } from '../../api/common/index';
export default {
  props: {
    item: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      email: '',
      emailSendStatus: false,
    };
  },
  watch: {
    item: {
      handler(newVal) {
        this.getEmailInfo(newVal);
        this.emailSendStatus = newVal.emailSend || newVal.customerOaEmailSend;
      },
      deep: true,
    },
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('cancel');
    },
    // 获取邮箱信息
    getEmailInfo(data) {
      let { functionCode, productFunctionCode, countryCode, enterpriseId } = data;
      let enterpriseid = localStorage.getItem('enterpriseid');
      getEmailInfo({
        functionCode: functionCode || productFunctionCode,
        countryCode,
        enterpriseId: enterpriseId || enterpriseid,
      }).then((res) => {
        if (res.code === 0) {
          this.email = res.data.sendEmail;
        }
      });
    },
    // 记录发送状态
    handleEmailSend() {
      // 标、税字段命名有差异
      let {
        functionCode,
        productFunctionCode,
        serviceId,
        servicesId,
        serviceNo,
        workOrderId,
        id,
        trademarkType,
      } = this.item;
      updateEmailSendService({
        functionCode: functionCode || productFunctionCode,
        serviceId: serviceId || servicesId || serviceNo,
        workId: workOrderId || id,
        trademarkType,
      }).then((res) => {
        if (res.code === 0) {
          this.$emit('fetch');
          this.$message.success('发送成功');
          this.emailSendStatus = true;
        }
      });
    },
    //记录是否已下载
    customerDataDownLoad() {
      let { functionCode, productFunctionCode, serviceId, servicesId, serviceNo, workOrderId, id } = this.item;
      customerDataDownLoad({
        functionCode: functionCode || productFunctionCode,
        serviceId: serviceId || servicesId || serviceNo,
        workId: workOrderId || id,
      }).then((res) => {
        this.$emit('fetch');
        this.$message.success('下载成功');
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  line-height: 40px;
  .red {
    color: red;
  }
  .icon {
    font-size: 20px;
    position: relative;
    top: 2px;
  }
}
.footer {
  text-align: center;
  padding-top: 30px;
}

.copy-email {
  color: @primary-color;
  margin-left: 10px;
  cursor: pointer;
  text-decoration: underline;
}
</style>
