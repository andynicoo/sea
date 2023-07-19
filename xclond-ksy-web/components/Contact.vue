<template>
  <div class="service">
    <div class="databg">
      <h2>核名查询</h2>
      <p>别等驳回才发现</p>
      <p>名称不能使用！</p>
    </div>
    <div class="liuzi">
      <div class="form">
        <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
          <a-form-model-item>
            <a-input v-model="formInline.company" placeholder="请填写公司名称" class="input1" />
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="formInline.mobile" type="text" placeholder="请输入您的手机号码" class="input1" />
          </a-form-model-item>
          <a-form-model-item style="margin-right:0px">
            <a-button type="primary" html-type="submit" icon="search" class="btn"> 立即查询能否注册 </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="user">
        <div class="tip"><span class="tits">最新查询结果：</span>目前已有<span class="num">3458752</span>次查询</div>
      </div>
      <div class="users">
        <UserData />
      </div>
    </div>
  </div>
</template>

<script>
import common from "@/apis/common";
import { Modal } from "ant-design-vue";

export default {
  data() {
    return {
      Modal,
      formInline: {
        company: "",
        mobile: "",
        platform: "51",
      },
    };
  },

  mounted() {},
  methods: {
    async handleSubmit(e) {
      this.Modal.suss;
      console.log(this.formInline);
      let { company, mobile } = this.formInline;
      if (company.trim() === "" || mobile.trim() === "" || !/^1[3|4|5|7|8|9]\d{9}$/.test(mobile)) {
        this.$message.error("请填写公司名称和正确的手机号码");
      } else {
        let { code, message } = await this.$axiosApi(
          common.setUserData.url,
          common.setUserData.methods,
          this.formInline
        );
        if (code === 0) {
          this.formInline.company = "";
          this.formInline.mobile = "";
          this.Modal.success({
            title: "操作成功！",
            okText: "确认",
            content: (
              <div>
                <p>请等待管理员与您联系。</p>
              </div>
            ),
          });
        } else {
          this.$message.error(message);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.service {
  height: 162px;
  background: linear-gradient(180deg, #f6faff 0%, #f9fbff 40%, #ffffff 100%);
  box-shadow: 0px 5px 21px 0px rgba(16, 68, 166, 0.09);
  border-radius: 5px 5px 5px 5px;
  opacity: 1;
  display: flex;
  flex-direction: row;
  .databg {
    width: 160px;
    height: 162px;
    background-image: url(@/assets/images/databg.png);
    background-size: 160px 162px;
    h2 {
      height: 30px;
      font-size: 20px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 30px;
      text-align: center;
      margin-top: 38px;
    }
    p {
      height: 22px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
      margin-left: 31px;
      margin-bottom: 3px;
    }
  }
  .liuzi {
    flex: 1;
    padding: 32px;
    .input1 {
      width: 355px;
      height: 52px;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
      border: 1px solid #e7e7e7;
    }
    .btn {
      width: 224px;
      height: 52px;
      background: @primaryColor;
      border-radius: 0px 0px 0px 0px;
      opacity: 1;
    }
    .user {
      color: @textColor;
      height: 24px;
      font-size: 16px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      margin-top: 20px;
      width: 300px;
      float: left;
      .tip {
        .tits {
          color: @textColor6;
        }
      }
      .num {
        color: @primaryColor;
      }
    }
    .users {
      margin-top: 20px;
    }
  }
}
</style>
