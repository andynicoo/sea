<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="title">待授权</div>
        <div class="subInfo">
          <img
            src="@/assets/images/common/gantanhao.png"
            style="width: 15px; margin-right: 5px; margin-bottom: 2px"
            alt=""
          />
          <p v-if="productFunctionCode == 16">温馨提示：英代/欧代授权代表服务需要签署协议到给税务代理；</p>
          <p v-else>
            备注：
            以下资料下载打印以后，在授权书、合同签名处（加盖公章、签署日期、签署法人英文名称（名前姓后），完成签章后再上传文件；（保证图片清晰）
          </p>
        </div>
        <p class="red-tip" v-if="productFunctionCode == 16">
          备注：以下资料下载打印后需要进行法人签名及盖章，再进行上传即可；（上传清晰的协议）
        </p>
        <DynamicForm
          ref="dynamicForm"
          :isCancel="isCancel"
          :moduleList="authorizerData"
          :showSave="false"
          :showSourceFile="[31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 32].includes(productFunctionCode)"
          @formsubmit="formSubmit"
          @formSave="formSave"
          :isOld="true"
        ></DynamicForm>
      </div>
    </div>
  </div>
</template>

<script>
import { authAgentCommit, authAgentSave, EPRSave, EPRCommit } from '@/api/taxModule.js';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
export default {
  props: ['serviceId', 'authorizerData', 'productFunctionCode', 'isCancel'],
  components: {
    DynamicForm,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    async formSubmit(materialData) {
      let data = {
        serviceId: this.serviceId,
        materialData: materialData,
      };
      const res = this.productFunctionCode == 16 ? await authAgentCommit(data) : await EPRCommit(data);
      if (res.code == 0) {
        this.$Message.success('提交成功');
        let path = this.productFunctionCode == 16 ? '/complianceBusiness/manageList' : '/complianceBusiness/EPRList';
        this.$router.push(path);
      } else {
        this.$Message.error(res.msg);
      }
    },
    // 保存表单
    formSave(materialData, next) {
      let requestFunc = authAgentSave;
      requestFunc({
        serviceId: this.serviceId,
        materialData: materialData,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
            if (next) {
              this.$refs.dynamicForm.stepsIndex = 3;
              this.$store.dispatch('app/setStepIndex', 3);
            }
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.content {
  margin: 23px;
  background: #ffffff;
  padding: 24px 32px;
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
  }
  .title {
    font-size: 18px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: 600;
    color: #333333;
    line-height: 24px;
    margin-bottom: 10px;
  }
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 16px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    // float: none;
  }
  .ivu-form-item-content {
    width: 100%;
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-size: 12px;
    color: #ed4014;
  }
}
/deep/ .ivu-upload {
  width: 100%;
  cursor: pointer;
  .inner {
    width: 268px;
    height: 32px;
    background: #16ade9;
    border-radius: 2px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
      margin-top: 0px;
    }
    .uplad-word {
      color: #ffffff;
    }
  }
}
.out-img-box {
  .img-box {
    position: relative;
    text-align: center;
    width: 268px;
    .show-pdf {
      color: #16ade9;
    }
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: 8px;
      height: 0px;
      z-index: 1;
      margin-left: 3px;
      img.closeImg {
        width: 13px;
        height: 13px;
      }
    }
  }
}
.upload-tip {
  font-size: 14px;
  color: #cccccc;
  vertical-align: bottom;
  margin-right: 16px;
  a {
    color: #16ade9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-top: 9px;
    float: left;
    margin-right: 3px;
  }
  display: inline-block;
}
.red-tip {
  margin: 20px 0;

  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
}
.footer {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
</style>
