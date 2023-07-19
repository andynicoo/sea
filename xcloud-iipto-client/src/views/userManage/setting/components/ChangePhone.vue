<template>
  <div class="phone">
    <div class="steps">
      <Steps :current="current" size="small">
        <Step title="验证身份"></Step>
        <Step title="修改已验证手机"></Step>
        <Step title="完成"></Step>
      </Steps>
    </div>
    <div class="from" style="width: 460px; height: 400px">
      <div class="fromBox" v-if="current == 0">
        <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <FormItem label="已验证手机"> {{ userMobile }} </FormItem>
          <FormItem label="手机校验码" prop="sendCode">
            <Input v-model="formValidate.sendCode" placeholder="请填写手机校验码" maxlength="6" clearable style="width: 200px" />
            <!-- 倒计时中 -->
            <Button @click="handleValidMobile(5)" :disabled="ifClick" class="verify-btn" style="margin-left: 10px" type="primary">
              {{ btLogin }}
            </Button>
            <div v-if="smsValidation">
              <div class="ivu-poptip-popper" style="
                  position: absolute;
                  will-change: top, left;
                  top: 24px;
                  left: 0px;
                  width: 100%;
                " x-placement="bottom-end">
                <div class="ivu-poptip-content">
                  <div class="ivu-poptip-arrow"></div>
                  <div class="ivu-poptip-inner">
                    <div class="ivu-poptip-title">
                      <div class="ivu-poptip-title-inner">
                        滑块验证
                        <img src="@/assets/images/common/close.png" @click="smsValidation = false" style="
                            width: 10px;
                            height: 10px;
                            cursor: pointer;
                            float: right;
                            margin-right: 0px;
                            margin-top: 5px;
                          " alt="" />
                      </div>
                    </div>
                    <div class="ivu-poptip-body" style="padding: 20px 16px">
                      <div class="ivu-poptip-body-content" style="overflow: hidden">
                        <div class="ivu-poptip-body-content-inner">
                          <sliding-validation scene="nc_message" ref="alidationBindPhoneModal" @validationData="getValidationData"></sliding-validation>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submit">下一步</Button>
          </FormItem>
        </Form>
      </div>
      <div v-if="current == 1">
        <Form :label-width="100" ref="formNewValidate" :model="formNewValidate" :rules="newRuleValidate">
          <FormItem label="我的手机号" prop="newMobile">
            <Input v-model="formNewValidate.newMobile" placeholder="请填写新手机号" maxlength="11" clearable style="width: 200px" />
          </FormItem>
          <FormItem label="手机校验码" prop="sendCode">
            <Input v-model="formNewValidate.sendCode" placeholder="请填写手机校验码" clearable style="width: 200px" />
            <!-- 倒计时中 -->
            <Button @click="handleValidMobile(6)" type="primary" class="verify-btn" :disabled="newClick">
              {{ newBtLogin }}
            </Button>
            <div v-if="newSmsValidation">
              <div class="ivu-poptip-popper" style="
                  position: absolute;
                  will-change: top, left;
                  top: 24px;
                  left: 0px;
                  width: 100%;
                " x-placement="bottom-end">
                <div class="ivu-poptip-content">
                  <div class="ivu-poptip-arrow"></div>
                  <div class="ivu-poptip-inner">
                    <div class="ivu-poptip-title">
                      <div class="ivu-poptip-title-inner">
                        滑块验证
                        <img src="@/assets/images/common/close.png" @click="newSmsValidation = false" style="
                            width: 10px;
                            height: 10px;
                            cursor: pointer;
                            float: right;
                            margin-right: 0px;
                            margin-top: 5px;
                          " alt="" />
                      </div>
                    </div>
                    <div class="ivu-poptip-body" style="padding: 20px 16px">
                      <div class="ivu-poptip-body-content" style="overflow: hidden">
                        <div class="ivu-poptip-body-content-inner">
                          <sliding-validation scene="nc_message" ref="alidationBindPhoneModal" @validationData="newGetValidationData"></sliding-validation>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="bindSubmit">绑定</Button>
          </FormItem>
        </Form>
      </div>
      <div class="finish" v-if="current == 2">
        <Icon type="md-checkmark" size="34" />
        恭喜您，手机修改成功
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import slidingValidation from '@/components/login/slidingValidation'
import { changeNext, changePhone, slidingSMSLogin } from '@/api/login/login.js'
export default {
  components: {
    slidingValidation: slidingValidation
  },
  data () {
    return {
      current: 0,
      // 验证旧手机
      formValidate: {
        sendCode: '',
        imgCode: ''
      },
      // 新手机号
      formNewValidate: {
        newMobile: '',
        imgCode: '',
        sendCode: ''
      },
      userMobile: '',
      // 获取短信验证码和loading
      verificationCodeCount: 0,
      btLogin: '获取验证码',
      newBtLogin: '获取验证码',
      ifClick: false,
      newClick: false,
      smsValidation: false,
      newSmsValidation: false,
      validationDataObj: {},
      newValidationDataObj: {},
      ruleValidate: {
        sendCode: [
          {
            required: true,
            message: '手机校验码不可为空',
            trigger: 'blur'
          }
        ],
        imgCode: [
          {
            required: true,
            message: '图片验证码不可为空',
            trigger: 'blur'
          }
        ]
      },
      newRuleValidate: {
        sendCode: [
          {
            required: true,
            message: '手机校验码不可为空',
            trigger: 'blur'
          }
        ],
        imgCode: [
          {
            required: true,
            message: '图片验证码不可为空',
            trigger: 'blur'
          }
        ],
        newMobile: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^[1-9][0-9]{10}$/.test(value)) {
                  callback(new Error('手机号码格式错误'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('手机号码不能为空'))
              }
            }
          }
        ]
      }
    }
  },
  created () {
    this.userMobile = JSON.parse(localStorage.getItem('objInfo')).userMobile
  },
  methods: {
    /**
     * 短信验证码
     */
    handleValidMobile (type) {
      if (type === 5) {
        this.smsValidation = !this.smsValidation
      } else {
        if (this.newClick) return
        if (JSON.stringify(this.formNewValidate.newMobile) === '') {
          this.$Message.error('请输入手机号码')
          return
        }
        if (!/^1[3456789]\d{9}$/.test(this.formNewValidate.newMobile)) {
          this.$Message.error('请填写正确的手机号码')
          return false
        }
        this.newSmsValidation = !this.newSmsValidation
      }

      this.loginType = type
    },
    getValidationData (data) {
      this.smsValidation = false
      this.validationDataObj = data
      if (this.validationDataObj.scene === 'nc_message') {
        this.getGeetest(5)
      }
    },
    newGetValidationData (data) {
      this.newSmsValidation = false
      this.newValidationDataObj = data
      if (this.newValidationDataObj.scene === 'nc_message') {
        this.newGetGeetest(6)
      }
    },
    // send code 验证手机
    getGeetest (type) {
      let self = this
      if (self.ifClick) return
      self.verificationCodeCount = 120
      let params = {
        mobile: this.userMobile,
        useType: type
      }
      params = { ...params, ...this.validationDataObj }
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$Message.success('短信发送成功')
              self.verificationCodeTimer = setInterval(() => {
                if (self.verificationCodeCount === 0) {
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
              self.ifClick = false
            }
          },
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
            self.$refs.alidationModal.validationFun
            // this.$Message.error(err.message);
            self.ifClick = false
          }
        )
        .finally(() => {
          self.ifClick = false
        })
    },
    // send code 更换手机
    newGetGeetest (type) {
      let self = this
      if (self.newClick) return
      self.verifiCodeCount = 120
      let params = {
        mobile: this.formNewValidate.newMobile,
        useType: type
      }
      params = { ...params, ...this.newValidationDataObj }
      slidingSMSLogin(params)
        .then(
          (res) => {
            if (res.code === 0) {
              self.$Message.success('短信发送成功')
              self.newVerificationCodeTimer = setInterval(() => {
                if (self.verifiCodeCount === 0) {
                  self.newBtLogin = '获取验证码'
                  clearInterval(self.newverificationCodeTimer)
                  self.newClick = false
                } else {
                  self.newClick = true
                  self.verifiCodeCount--
                  self.newBtLogin = `${self.verifiCodeCount}秒后重新获取`
                }
              }, 1000)
            } else {
              self.newClick = false
            }
          },
          // eslint-disable-next-line handle-callback-err
          (err) => {
            // eslint-disable-next-line no-unused-expressions
            self.$refs.alidationModal.validationFun
            // this.$Message.error(err.message);
            self.newClick = false
          }
        )
        .finally(() => {
          self.newClick = false
        })
    },
    /**
     * 提交验证手机
     */
    submit () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          changeNext({
            code: this.formValidate.sendCode
          }).then((res) => {
            if (res.code === 0) {
              this.current = 1
            } else {
              this.$Message.success(res.message)
            }
          })
        }
      })
    },
    /** 绑定 */
    bindSubmit () {
      this.$refs.formNewValidate.validate((valid) => {
        if (valid) {
          changePhone({
            newMobile: this.formNewValidate.newMobile,
            code: this.formNewValidate.sendCode
          }).then((res) => {
            if (res.code === 0) {
              this.current = 2
              localStorage.removeItem('token')
              localStorage.removeItem('sessionId')

              Cookies.remove('token');
              Cookies.remove('sessionId');
              this.$Modal.success({
                title: '更换成功',
                content: '手机号更换成功，请重新登录！',
                onOk: function () {
                  location.reload()
                }
              })
            } else {
              this.$Message.success(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.phone {
  padding: 16px;
  .steps {
    width: 600px;
    margin: 40px auto;
  }
}
.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
  background: #7abd54;
  color: #fff;
  border: 1px solid #7abd54;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
  background: #7abd54;
  color: #fff;
  border: 1px solid #7abd54;
}
.ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail > i:after {
  background: #7abd54;
}
.finish {
  text-align: center;
  color: #33cc33;
  font-size: 20px;
  padding: 10px 0;
  .md-checkmark {
    color: #7abd54;
  }
}
</style>
