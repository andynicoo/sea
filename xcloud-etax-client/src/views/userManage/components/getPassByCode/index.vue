<template>
  <Form ref="loginForm" :model="loginForm" :rules="loginRule" :label-width="100" style="width: 400px;padding-bottom: 1px;">
    <FormItem label="手机号">{{ phone }}</FormItem>
    <FormItem prop="code" label="验证码">
      <Input name="code" type="text" maxlength="8" search :enter-button="btLogin" @on-search="getVerificationCode" autocomplete="off" v-model="loginForm.code" placeholder="请输入验证码"></Input>
      <div v-if="smsValidation">
        <div
          class="ivu-poptip-popper"
          style="position: absolute; will-change: top, left; top: 32px; left: 0px; width: 100%"
          x-placement="bottom-end"
        >
          <div class="ivu-poptip-content">
            <div class="ivu-poptip-arrow"></div>
            <div class="ivu-poptip-inner">
              <div class="ivu-poptip-title">
                <div class="ivu-poptip-title-inner">
                  滑块验证
                  <img
                    src="@/assets/images/common/close.png"
                    @click="smsValidation = false"
                    style="
                      width: 10px;
                      height: 10px;
                      cursor: pointer;
                      float: right;
                      margin-right: 0px;
                      margin-top: 5px;
                    "
                    alt=""
                  />
                </div>
              </div>
              <div class="ivu-poptip-body" style="padding: 20px 16px">
                <div class="ivu-poptip-body-content" style="overflow: hidden">
                  <div class="ivu-poptip-body-content-inner">
                    <!-- 阿里云滑动验证 -->
                    <AliSlideValidation
                      scene="nc_message"
                      ref="alidationBindPhoneModal"
                      @validationData="getValidationData"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormItem>
    <FormItem prop="password" label="新密码">
      <Input
        name="password"
        password
        type="password"
        autocomplete="off"
        v-model="loginForm.password"
        placeholder="请输入你的密码"
      ></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('loginForm')">确认修改</Button>
    </FormItem>
  </Form>
</template>

<script>
import AliSlideValidation from '@/components/AliSlideValidation';
import { getPass, slidingSMSLogin } from '@/api/login/login';
import Cookies from "js-cookie";
export default {
  name: "GetPassByCode",
  components: { AliSlideValidation },
  props: {
    phone: String
  },
  data() {
    return {
      loginForm: {},
      loginRule: {
        password: [
          {
            required: true,
            message: '请输入你的密码',
            trigger: 'blur',
            type: 'string',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
            type: 'string',
          },
        ]
      },
      smsValidation: false,
      ifClick: false,
      validationDataObj: {},
      wxQRcode: '',
      btLogin: '获取验证码',
    }
  },
  methods: {
    // 发送验证码
    getVerificationCode() {
      if (this.ifClick) return;
      this.smsValidation = !this.smsValidation;
    },
    getValidationData(data) {
      this.smsValidation = false;
      this.validationDataObj = data;
      if (this.validationDataObj.scene === 'nc_message' && this.loginType !== 1) {
        this.getGeetest()
      }
    },
    getGeetest() {
      let self = this;
      if (self.ifClick) return;
      self.verificationCodeCount = 120;
      let params = {
        mobile: self.phone,
        useType: 3, // 使用类型,1-注册验证码 2-登录验证码 3-忘记密码 4-微信绑定 5-修改手机账号验证 6-新手机账号验证
      };
      params = { ...params, ...this.validationDataObj };
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code == 0) {
              self.$Message.success('短信发送成功');
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount == 0) {
                  self.btLogin = '获取验证码';
                  clearInterval(self.verificationCodeTimer);
                  self.ifClick = false;
                } else {
                  self.ifClick = true;
                  self.verificationCodeCount--;
                  self.btLogin = `${self.verificationCodeCount}秒后重新获取`;
                }
              }, 1000);
            } else {
              self.ifClick = false;
            }
          },
          (err) => {
            // this.$Message.error(err.message);
            self.ifClick = false;
          }
        )
        .finally(() => {
          self.ifClick = false;
        });
    },
    //  登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (JSON.stringify(this.validationDataObj) === '{}') {
            this.$Message.error('请先滑动验证');
            return;
          }
          this.handleForget();
        }
      });
    },
    // 找回密码
    handleForget(name) {
      let self = this;
      let obj = {
        code: this.loginForm.code,
        mobile: this.phone,
        newPassword: this.loginForm.password,
      };
      obj = { ...obj, ...this.validationDataObj };
      getPass(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.$Message.success('新密码设置成功，请登录');
              localStorage.removeItem('token');
              localStorage.removeItem('sessionId');
              localStorage.removeItem('sidebarStatus');

              Cookies.remove('token');
              Cookies.remove('sessionId');
              this.$store.commit('saveLogin', false);
              this.$store.commit('saveLeft', false);
              sessionStorage.removeItem('showGuideFromLogin');
              this.$router.push('/work');
            } else {
              // 登陆异常，则重置验证码滑块
              if (this.$refs.alidationBindPhoneModal) {
                this.$refs.alidationBindPhoneModal.reset();
                this.$refs.alidationBindPhoneModal.refresh();
              }
            }
          },
          (err) => {
            // 登陆异常，则重置验证码滑块
            if (this.$refs.alidationBindPhoneModal) {
              this.$refs.alidationBindPhoneModal.reset();
              this.$refs.alidationBindPhoneModal.refresh();
            }
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
    //获得tiket
    getUrlParam(params, url) {
      let value = '';
      let a = url.split('?');
      return (value = a[1].substr(7));
    },
    //登陆成功跳转
    loginSuccess(data) {
      localStorage.setItem('token', data.token); // save local
      localStorage.setItem('sessionId', data.sessionId);

      Cookies.set('token', res.data.token);
      Cookies.set('sessionId', res.data.sessionId);
      // window.location.href = "/work";
      this.$store.commit('saveLogin', true);
      sessionStorage.setItem('showGuideFromLogin', JSON.stringify(true));
      this.$router.push('/work');
      location.reload();
    },
  }
};
</script>

<style lang="less" scoped>

</style>
