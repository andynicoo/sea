<template>
  <div class="mainContent"
       :style="contentStyleObj">
    <Tabs value="tab1">
      <TabPane label="修改密码"
               name="tab1">
        <div class="form-module">
          <Form ref="formpass"
                :model="formpass"
                :rules="rulePass"
                :label-width="100">
            <FormItem style="height:30px"
                      label="当前密码:"
                      prop="oldPassword">
              <Input type="password"
                     v-model="formpass.oldPassword"></Input>
            </FormItem>
            <FormItem style="height:30px"
                      label="新密码:"
                      prop="newPassword">
              <Input type="password"
                     v-model="formpass.newPassword"></Input>
            </FormItem>
            <FormItem style="height:30px"
                      label="确认密码:"
                      prop="newPass">
              <Input type="password"
                     v-model="formpass.newPass"></Input>
            </FormItem>
            <FormItem>
              <Button class="login-btn"
                      type="primary"
                      @click="updatePass('formpass')">确认修改</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane v-if="isbig==='0'"
               label="更换手机号"
               name="tab2">
        <div class="form-module">
          <Form v-show="!isNext"
                ref="formphoneold"
                :model="formphoneold"
                :rules="rulePhoneold"
                :label-width="100">
            <FormItem style="height:30px"
                      label="原手机号:">
              <Input type="text"
                     :value="oldtel"
                     disabled></Input>
            </FormItem>
            <FormItem style="height:30px"
                      label="密码验证:"
                      prop="password">
              <Input type="password"
                     v-model="formphoneold.password"></Input>
            </FormItem>
            <FormItem style="height:30px"
                      label="验证码:"
                      prop="code">
              <Row>
                <Col span="15">
                <Input type="text"
                       v-model="formphoneold.code"
                       placeholder="请输入验证码"></Input>
                </Col>
                <Col span="8"
                     offset="1">
                <Button class="login-btn"
                        :class="ifClick===true?'diD':''"
                        type="primary"
                        @click="getVerificationCode('',5)"
                        :disabled="ifClick">{{btLogin}}</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button class="login-btn"
                      type="primary"
                      @click="changeStep('formphoneold')">下一步</Button>
            </FormItem>
          </Form>
          <Form v-show="isNext"
                ref="formphonenew"
                :model="formphonenew"
                :rules="rulePhonenew"
                :label-width="100">
            <Form ref="formPhone"
                  :model="formPhone"
                  :rules="rulePhone"
                  :label-width="100">
              <FormItem label="新手机号:"
                        prop="mobile">
                <Input type="text"
                       v-model="formPhone.mobile"
                       placeholder="请输入您的手机号"></Input>
              </FormItem>
            </Form>

            <FormItem label="验证码:"
                      prop="code">
              <Row>
                <Col span="15">
                <Input type="text"
                       v-model="formphonenew.code"
                       placeholder="请输入验证码"></Input>
                </Col>
                <Col span="8"
                     offset="1">
                <Button class="login-btn"
                        :class="ifClick===true?'diD':''"
                        type="primary"
                        @click="getVerificationCode('formPhone',6)"
                        :disabled="ifClick">{{btLogin}}</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button class="login-btn"
                      type="primary"
                      @click="updatePhone('formphonenew')">确认修改</Button>
            </FormItem>
          </Form>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import '@/styles/common.less'
import {
  changePass,
  changePhone,
  changeNext,
  getYzm,
  changePassBig
} from '@/api/login/login'
import Cookies from "js-cookie";

export default {
  props: {},
  data() {
    return {
      oldtel: '',
      btLogin: '获取验证码',
      ifClick: false,
      isNext: false,
      verificationCodeCount: 0,
      formpass: {},
      rulePass: {
        newPassword: [{ required: true, message: '不可为空', trigger: 'blur' }],
        oldPassword: [{ required: true, message: '不可为空', trigger: 'blur' }]
      },
      formphonenew: {},
      rulePhonenew: {
        newMobile: [{ required: true, message: '不可为空', trigger: 'blur' }],
        code: [{ required: true, message: '不可为空', trigger: 'blur' }]
      },
      formphoneold: {},
      rulePhoneold: {
        password: [{ required: true, message: '不可为空', trigger: 'blur' }],
        code: [{ required: true, message: '不可为空', trigger: 'blur' }]
      },
      rulePhoneold: {
        password: [{ required: true, message: '不可为空', trigger: 'blur' }],
        code: [{ required: true, message: '不可为空', trigger: 'blur' }]
      },
      // 验证手机
      formPhone: {
        mobile: ''
      },
      rulePhone: {
        mobile: [
          {
            type: 'number',
            message: '请填写正确手机号',
            trigger: 'blur',
            transform(value) {
              let reg = new RegExp('^[1][3-9][0-9]{9}$')
              if (!reg.test(value)) {
                return false
              } else {
                return Number(value)
              }
            }
          }
        ]
      },

      contentStyleObj: {
        height: ''
      }
    }
  },
  methods: {
    // 屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.screen.height - 220 + 'px'
    },
    // 点击获取验证码
    getVerificationCode(phone, type) {
      let self = this
      // this.ifClick = true;
      // console.log(phone);
      if (phone) {
        this.$refs[phone].validate(valid => {
          if (valid) {
            this.getGeetest(type)
          } else {
            this.ifClick = false
          }
        })
      } else {
        self.getGeetest(type)
      }
    },
    // send code
    getGeetest(type) {
      let self = this
      self.verificationCodeCount = 120
      let params = {
        type: type,
        signSource: 1
      }
      if (type === 5) {
        params.mobile = this.oldtel
      }
      if (type === 6) {
        params.mobile = this.formPhone.mobile
      }

      getYzm(params)
        .then(
          res => {
            // console.log(res);
            if (res.code === 0) {
              this.$Message.success('短信发送成功')
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount == 0) {
                  self.btLogin = '获取验证码'
                  clearInterval(self.verificationCodeTimer)
                  self.ifClick = false
                } else {
                  self.ifClick = true
                  self.verificationCodeCount--
                  self.btLogin = `${self.verificationCodeCount}秒后重新获取`
                }
              }, 1000)
            } else {
              self.$Message.error(res.message)
              self.ifClick = false
            }
          },
          err => {
            // console.log(err);
            if (err.code === 1001) {
              self.$Message.error('您还未注册请先注册')
            } else {
              this.$Message.warning(err.message)
            }
            self.ifClick = false
          }
        )
        .finally(() => {
          self.ifClick = false
        })
    },
    // edit pass
    updatePass(all) {
      // console.log(this.formpass);
      this.$refs[all].validate(valid => {
        if (valid) {
          if (this.formpass.newPassword !== this.formpass.newPass) {
            this.$Message.error('新密码两次输入不一致，请重新输入')
          } else {
            if (this.isbig === '0') {
              let obj = {
                newPassword: this.formpass.newPassword,
                oldPassword: this.formpass.oldPassword
              }
              changePass(obj)
                .then(
                  res => {
                    //   console.log(res);
                    if (res.code === 0) {
                      localStorage.removeItem('token')
                      localStorage.removeItem('sessionId')

                      Cookies.remove('token');
                      Cookies.remove('sessionId');                       
                      this.$Modal.success({
                        title: '修改成功',
                        content: '密码修改成功，请重新登录！',
                        onOk: function () {
                          location.reload()
                        }
                      })
                    } else {
                      this.$Message.error(res.message)
                    }
                  },
                  err => {
                    // if (err.code === 1001) {
                    this.$Message.error(err.message)
                    // }
                  }
                )
                .finally(() => { })
            } else {
              let obj = {
                newPwd: this.formpass.newPassword,
                oldPwd: this.formpass.oldPassword
              }
              changePassBig(obj)
                .then(
                  res => {
                    //   console.log(res);
                    if (res.code === 0) {
                      localStorage.removeItem('token')
                      localStorage.removeItem('sessionId')

                      Cookies.remove('token');
                      Cookies.remove('sessionId');                       
                      this.$Modal.success({
                        title: '修改成功',
                        content: '密码修改成功，请重新登录！',
                        onOk: function () {
                          location.reload()
                        }
                      })
                    } else {
                      this.$Message.error(res.message)
                    }
                  },
                  err => {
                    // if (err.code === 1001) {
                    this.$Message.error(err.message)
                    // }
                  }
                )
                .finally(() => { })
            }
          }
        } else {
        }
      })
    },
    // 下一步
    changeStep(all) {
      let obj = {
        code: this.formphoneold.code,
        password: this.formphoneold.password
      }
      this.$refs[all].validate(valid => {
        if (valid) {
          changeNext(obj)
            .then(
              res => {
                // console.log(res);
                if (res.code === 0) {
                  this.isNext = true
                  this.verificationCodeCount = 0
                } else {
                  this.$Message.error(res.message)
                }
              },
              err => {
                // if (err.code === 1001) {
                this.$Message.error(err.message)
                // }
              }
            )
            .finally(() => { })
        } else {
        }
      })
    },
    // edit phone
    updatePhone(all) {
      let self = this
      let obj = {
        code: self.formphonenew.code,
        newMobile: self.formPhone.mobile
      }
      // console.log(all);
      self.$refs[all].validate(valid => {
        if (valid) {
          changePhone(obj)
            .then(
              res => {
                // console.log(res);
                if (res.code === 0) {
                  localStorage.removeItem('token')
                  localStorage.removeItem('sessionId')

                  Cookies.remove('token');
                  Cookies.remove('sessionId');                   
                  self.$Modal.success({
                    title: '手机绑定成功',
                    content: '更换绑定手机，请重新登录！',
                    onOk: function () {
                      location.reload()
                    }
                  })
                } else {
                  self.$Message.error(res.message)
                }
              },
              err => {
                // if (err.code === 1001) {
                self.$Message.error(err.message)
                // }
              }
            )
            .finally(() => { })
        } else {
        }
      })
    }
  },
  created() {
    this.getHeight()
    // console.log(JSON.parse(localStorage.getItem("objInfo")));
    let obj = JSON.parse(localStorage.getItem('objInfo'))
    this.oldtel = obj.customer_tel
  }
}
</script>
<style lang="less" scoped>
.mainContent {
  .form-module {
    width: 450px;
    margin-left: 50px;
    margin-top: 20px;
  }
  .diD {
    background-color: #e6e6e6 !important;
  }
  .login-btn {
    background-color: #ffdb33;
    border: none;
    color: #444141;
    width: 118px;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
