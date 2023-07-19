<template>
  <div class="info">
    <Form label-position="left" :label-width="100">
      <FormItem label="昵称"> {{ infos.nickname }} </FormItem>
      <FormItem label="登录账号"> {{ infos.account || '-' }} </FormItem>
      <FormItem label="手机号"> {{ infos.userMobile || '-' }} </FormItem>
      <FormItem label="邮箱"
        >{{ infos.email || '-' }}
        <!-- <a style="margin-left: 30px" @click="changeEmail">修改</a> -->
      </FormItem>
      <FormItem label="会员等级"> {{ vipName }} </FormItem>
    </Form>
    <!-- 邮箱设置 -->
    <Modal v-model="emailModal" title="设置邮箱" @on-ok="handleSubmit" width="500" :loading="refuseLoading">
      <Form :model="emailForm" :rules="ruleValidate" :label-width="100" ref="formValidate">
        <FormItem label="邮箱" prop="email">
          <Input type="text" placeholder="请输入邮箱" style="width: 200px; margin-right: 10px" v-model="emailForm.email" clearable />
        </FormItem>
        <FormItem label="验证码" prop="verifyCode">
          <Input type="password" v-model="emailForm.verifyCode" placeholder="请输入验证码" style="width: 200px; margin-right: 10px" />
          <!-- 正常能发送验证码 -->
          <Button :loading="sendCodeLoading" v-if="countDownNum <= 0" class="verify-btn" type="primary" @click="handleValidMobile">
            获取验证码
          </Button>
          <!-- 倒计时中 -->
          <Button v-else disabled class="verify-btn" type="default"> {{ countDownNum }}秒后获取 </Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      infos: {},
      // 邮箱认证
      emailModal: false,
      // 获取短信验证码和loading
      countDownNum: 0,
      sendCodeLoading: false,
      refuseLoading: false,
      emailForm: {
        email: '',
        verifyCode: '',
      },
      ruleValidate: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
        ],
        verifyCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
      },
      vipName: localStorage.getItem('vipName'),
    };
  },
  created() {
    this.infos = JSON.parse(localStorage.getItem('objInfo'));
  },
  methods: {
    /**
     * 邮箱提交
     */
    handleSubmit() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
        }
      });
    },
    changeEmail() {
      this.emailModal = true;
      this.$refs.formValidate.resetFields();
    },
    /**
     * 短信验证码
     */
    handleValidMobile() {
      this.sendCodeLoading = true;
      this.startCountDown();
    },
    // 开始倒计时
    startCountDown() {
      this.countDownNum = 60;
      let timer = setInterval(() => {
        this.countDownNum--;
        if (this.countDownNum <= 0) {
          this.countDownNum = 0;
          // 倒计时结束，清除滑动验证码的状态
          window.nc && window.nc.reset();
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>
.info {
  padding: 16px;
}
</style>
