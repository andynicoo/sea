<template>
  <div class="password">
    <Form ref="formpass" :model="formpass" :rules="rulePass" :label-width="100">
      <div style="height:0px; overflow:hidden">
        <input type="text" name="hidden1" />
        <input type="password" name="hidden2" />
      </div>
      <FormItem style="width: 344px" label="登录手机号:" prop="mobile">
        {{ infos.userMobile || '-' }}
      </FormItem>
      <FormItem style="width: 344px" label="验证码:" prop="code" class="code">
        <Input type="text" v-model="formpass.code" placeholder="请输入验证码" autocomplete="off"></Input>
        <Button class="bt" type="primary" :loading="codeing" @click="getCode(code)">{{ btLogin }}</Button>
      </FormItem>
      <FormItem style="width: 344px" label="新密码:" prop="newPassword">
        <Input type="password" v-model="formpass.newPassword" placeholder="请输入新密码" autocomplete="off"></Input>
      </FormItem>
      <FormItem style="width: 344px" label="确认密码:" prop="surePassword">
        <Input type="password" v-model="formpass.surePassword" placeholder="请输入确认密码" autocomplete="off"></Input>
      </FormItem>
      <FormItem>
        <Button class="bt" type="primary" :loading="updateLoading" @click="updatePass('formpass')">确认修改</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { changePass, sedSmsCode , slidingSMSLogin, smsUpdatePassword} from '@/api/login/login';
export default {
  data() {
    return {
      infos: {},
      code: '',
      codeing: false,
      ifClick: false,
      btLogin: '获取验证码',
      formpass: {
        code: '',
        newPassword: '',
        surePassword: '',
      },
      updateLoading: false,
      rulePass: {
        code: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (value.length < 6) {
                  callback(new Error('请输入6位验证码'));
                } else {
                  callback();
                }
              } else {
                callback(new Error('验证码不能为空'));
              }
            },
          },
        ],
        newPassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^\w{6,15}$/.test(value)) {
                  callback(new Error('密码为6-15位字母，数字，下划线组成'));
                } else {
                  callback();
                }
              } else {
                callback(new Error('密码不能为空'));
              }
            },
          },
        ],
        surePassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^\w{6,15}$/.test(value)) {
                  callback(new Error('密码为6-15位字母，数字，下划线'));
                } else if (value !== this.formpass.newPassword) {
                  callback(new Error('确认密码不一致'));
                } else {
                  callback();
                }
              } else {
                callback(new Error('密码不能为空'));
              }
            },
          },
        ],
      },
    };
  },
  created() {
    this.infos = JSON.parse(localStorage.getItem('objInfo'));
  },
  methods: {
    /**
     * 修改密码
     */
    updatePass(all) {
      // console.log(this.formpass);
      this.$refs[all].validate((valid) => {
        if (valid) {
          smsUpdatePassword({
            newPassword: this.formpass.newPassword,
            code: this.formpass.code,
            sessionId: localStorage.getItem('sessionId'),
            token:localStorage.getItem('token')
          }).then((res) => {
            if (res.code === 0) {
              localStorage.removeItem('token');
              localStorage.removeItem('sessionId');

              Cookies.remove('token');
              Cookies.remove('sessionId');

              this.$Modal.success({
                title: '修改成功',
                content: '密码修改成功，请重新登录！',
                onOk: function() {
                  location.reload();
                },
              });
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    },
    getCode() {
      let self = this;
      if (self.ifClick) return;
      self.verificationCodeCount = 120;
      let params = {
        mobile: this.infos.userMobile,
        useType: 7,
      };

      sedSmsCode(params)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$Message.success('短信发送成功');
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount === 0) {
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
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
            // self.$refs.alidationModal.validationFun
            // this.$Message.error(err.message);
            self.ifClick = false;
          }
        )
        .finally(() => {
          self.ifClick = false;
        });
    },
  },
};
</script>
<style lang="less">
.password {
  padding: 16px;
}
.code {
  position: relative;
  .bt {
    position: absolute;
    right: 0px;
    top: 1px;
  }
}
</style>
