<template>
  <div class="container">
    <div
      class="subInfo"
      v-if="['AE', 'SA', 'NL', 'IT', 'FR', 'ES'].includes(serviceInfo.countryCode) && serviceInfo.functionCode !== '6'"
    >
      <img
        src="@/assets/images/common/gantanhao.png"
        style="width: 15px; margin-right: 5px; margin-bottom: 2px"
        alt=""
      />
      <p v-if="serviceInfo.countryCode == 'AE'">
        阿联酋特别说明：根据阿联酋税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；
      </p>
      <p v-if="serviceInfo.countryCode == 'SA'">
        沙特特别说明：根据沙特局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；
      </p>
      <p v-if="serviceInfo.countryCode == 'NL'">
        荷兰特别说明：根据荷兰税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="serviceInfo.countryCode == 'IT' && serviceInfo.functionCode == '2'">
        意大利特别说明：根据意大利税局要求，合规进行VAT服务，需要卖家提供授权书；
      </p>
      <p v-if="serviceInfo.countryCode == 'IT' && serviceInfo.functionCode == '5'">
        意大利特别说明：根据意大利税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="serviceInfo.countryCode == 'FR' && serviceInfo.functionCode == '2'">
        法国特别说明：根据法国税局要求，合规进行VAT服务，需要卖家提供授权书；
      </p>
      <p v-if="serviceInfo.countryCode == 'FR' && serviceInfo.functionCode == '5'">
        法国特别说明：根据法国税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；
      </p>
      <p v-if="serviceInfo.countryCode == 'ES'">
        西班牙特别说明：根据西班牙海关要求，合理进行VAT税号注册及申报服务（包括海牙认证），需要卖家提供真实有效的相关证明；
      </p>
    </div>
    <div class="content">
      <p class="red-tip" v-if="!hyAuthorized">备注：以下资料下载打印后需要进行法人签名及盖章，再进行上传即可；</p>
      <p class="red-tip" v-if="hyAuthorized">
        备注：以下资料下载打印后需要进行线下邮寄（法人签名及盖章、授权书需要盖骑缝章、建议彩色打印）；
      </p>
      <DynamicForm
        :moduleList="fileDataReview"
        :showSubmit="showSubmit"
        :isCancel="isCancel"
        :showSave="false"
        @formsubmit="formsubmit"
        :showAuthorizeFile="showAuthorizeFile"
        :hyAuthorized="hyAuthorized"
        :workInfo="serviceInfo"
        :isOld="true"
      />
    </div>
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import mixin from '@/views/home/mixin';
import { uploadAuthorization } from '@/api/taxRegister.js';
export default {
  props: {
    serviceInfo: { type: Object },
    fileDataReview: { type: Array },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    hyAuthorized: {
      type: Boolean,
      default: false,
    },
    // 是否显示授权书
    showAuthorizeFile: {
      type: Boolean,
      default: false,
    },
    // 是否取消中或已取消状态，禁用按钮
    isCancel: {
      type: Boolean,
      default: false,
    },
  },
  components: { DynamicForm },
  mixins: [mixin],
  data() {
    return {};
  },
  created() {},
  methods: {
    // 提交表单
    formsubmit(materialData) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>请确认已全部签字盖章上传</p>',
        onOk: () => {
          setTimeout(() => {
            if (!this.hyAuthorized) {
              uploadAuthorization({
                workOrderId: this.serviceInfo.workId,
                material: materialData,
              }).then((res) => {
                this.backToHome();
                // this.$emit('formsubmit', materialData);
              });
            } else {
              this.$emit('formsubmit', materialData);
            }
          }, 100);
        },
      });
    },
    //回到工作台
    backToHome() {
      this.$router.push({ path: '/myVantService' });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 60px);
}
.subInfo {
  // width: 1104px;
  height: 40px;
  background: #fff1dd;
  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  color: #333333ff;
  line-height: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-weight: 500;
  margin-bottom: -24px;
}
.content {
  margin: 23px 0;
  background: #ffffff;

  .title {
    font-size: 18px;
    font-family: 'Microsoft Yahei', 'PingFangSC-Medium', 'PingFang SC', sans-serif;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    margin-bottom: 10px;
  }
}
.red-tip {
  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
  padding: 10px 35px;
}
</style>
