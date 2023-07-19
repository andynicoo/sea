<template>
  <div class="mainContent">
    <div class="my-card "
         :style="contentStyleObj">
      <p class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='kby'"/>
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='wg'" />
        修改密码</p>
      <Form ref="formpass"
            :model="formpass"
            :rules="rulePass"
            :label-width="100">
        <FormItem style="height:30px;width:344px;"
                  label="当前密码:"
                  prop="oldPassword">
          <Input type="password"
                 v-model="formpass.oldPassword"></Input>
        </FormItem>
        <FormItem style="height:30px;width:344px;"
                  label="新密码:"
                  prop="newPassword">
          <Input type="password"
                 v-model="formpass.newPassword"></Input>
        </FormItem>
        <FormItem style="height:30px;width:344px;"
                  label="确认密码:"
                  prop="newPass">
          <Input type="password"
                 v-model="formpass.newPass"></Input>
        </FormItem>
        <FormItem>
          <Button class="bt"
                  type="primary"
                  :loading="updateLoading"
                  @click="updatePass('formpass')">确认修改</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { getInfo, changePass, getImgCodeApi, getYzm, changeNext, newChangePhone } from "@/api/login/login";
export default {
  data() {
    return {
      contentStyleObj: {
        "min-height": ""
      },
      formpass: {},
      updateLoading: false,
      rulePass: {
        newPassword: [{ required: true, message: "不可为空", trigger: "blur" }],
        oldPassword: [{ required: true, message: "不可为空", trigger: "blur" }]
      },
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 220 + "px";
    },
    updatePass(all) {
      // console.log(this.formpass);
      this.$refs[all].validate(valid => {
        if (valid) {
          if (this.formpass.newPassword !== this.formpass.newPass) {
            this.$Message.error("新密码两次输入不一致，请重新输入");
          } else {
            let obj = {
              newPassword: this.formpass.newPassword,
              oldPassword: this.formpass.oldPassword
            };
            changePass(obj)
              .then(
                res => {
                  if (res.code === 0) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("sessionId");

                    Cookies.remove('token');
                    Cookies.remove('sessionId');
                    this.$Modal.success({
                      title: "修改成功",
                      content: "密码修改成功，请重新登录！",
                      onOk: function () {
                        location.reload();
                      }
                    });
                  } else {
                    this.$Message.error(res.message);
                  }
                },
                err => {
                  this.$Message.error(err.message);
                }
              )
              .finally(() => { });
          }
        } else {
        }
      });
    },
  },
  created() {
    this.getHeight()
  }
}
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid #ebebeb;
      font-family: PingFangSC-Medium, PingFang SC;
      img {
        vertical-align: middle;
      }
    }
    form {
      margin-top: 24px;
    }
    .bt {
      box-shadow: 0px 2px 6px 0px rgba(22, 173, 233, 0.4);
      background-color: #00a3ff;
      border-color: #00a3ff;
    }
  }
  /deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
  }
}
</style>
