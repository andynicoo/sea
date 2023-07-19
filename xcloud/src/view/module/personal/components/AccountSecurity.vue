<template>
  <div>
    <div class="securityBox">
      <div class="reminder">
        <p class="tittle">温馨提示：</p>
        <p>1.账户安全体系是保障您的账户安全，防止信息泄露的重要手段；</p>
        <p>2.手机号码用户账户安全验证，请及时绑定；</p>
        <p>3.绑定手机、邮箱，可享受账户密码找回等服务；</p>
      </div>
      <div class="grade">
        <span>安全等级：</span>
        <span class="text">中</span>
        <span class="line" v-for="(item, index) in 3" :key="index"></span>
      </div>
      <div class="accountBox">
        <div class="account_tittle">账号安全</div>
        <div class="box">
          <i class="el-icon-success" style="font-size: 24px; color: #f5406c" />
          <i class="el-icon-warning" style="font-size: 24px; color: #19be6b" />
          <span>已设置</span>
          <span class="bold">登录密码</span>
          <el-divider direction="vertical"></el-divider>
          <span>建议密码由6位以上数字、字母和特殊字符组成</span>
          <a @click="resetPassword">修改</a>
        </div>
        <div class="box">
          <i class="el-icon-success" style="font-size: 24px; color: #f5406c" />
          <i class="el-icon-warning" style="font-size: 24px; color: #19be6b" />
          <span>已设置</span>
          <span class="bold">手机绑定</span>
          <el-divider direction="vertical"></el-divider>
          <span>您已绑定手机号码：1464613132</span>
          <a @click="mobileModal = true"> 修改</a>
        </div>
        <div class="box">
          <i class="el-icon-success" style="font-size: 24px; color: #f5406c" />
          <i class="el-icon-warning" style="font-size: 24px; color: #19be6b" />
          <span>已设置</span>
          <span class="bold">邮箱绑定</span>
          <el-divider direction="vertical"></el-divider>
          <span>您尚未设置邮箱</span>
          <a @click="emailModal = true">设置</a>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="passwordModal" title="修改密码" width="500px">
      <el-form
        ref="formPassword"
        :model="formPassword"
        :rules="passwordValid"
        label-width="110px"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="formPassword.oldPassword"
            placeholder="请输入旧密码"
            style="width: 300px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            v-model="formPassword.password"
            placeholder="输入新密码（6-15位字母，数字和下划线组成）"
            style="width: 300px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="formPassword.confirmPassword"
            placeholder="再次输入新密码"
            style="width: 300px"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 邮箱设置 -->
    <el-dialog :visible.sync="emailModal" title="设置邮箱" width="500px">
      <el-form
        ref="formMobile"
        :model="emailForm"
        :rules="emailValid"
        label-width="100px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            placeholder="请输入邮箱"
            style="width: 200px; margin-right: 10px"
            v-model="emailForm.email"
            clearable
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input
            type="password"
            v-model="emailForm.verifyCode"
            placeholder="请输入验证码"
            style="width: 200px; margin-right: 10px"
            size="small"
          ></el-input>
          <!-- 正常能发送验证码 -->
          <el-button
            :loading="sendCodeLoading"
            v-popover:popover
            v-if="countDownNum <= 0"
            class="verify-btn"
            type="primary"
            @click="handleValidMobile"
            size="small"
          >
            获取验证码
          </el-button>
          <!-- 倒计时中 -->
          <el-button
            v-else
            disabled
            class="verify-btn"
            type="default"
            size="small"
          >
            {{ countDownNum }}秒后获取
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 手机认证 -->
    <el-dialog :visible.sync="mobileModal" title="手机认证" width="500px">
      <el-form
        ref="formMobile"
        :model="mobileForm"
        :rules="mobileValid"
        label-width="100px"
      >
        <el-form-item label="手机号"> 131312**6546 </el-form-item>

        <el-form-item label="验证码" prop="verifyCode">
          <el-input
            type="password"
            v-model="mobileForm.verifyCode"
            placeholder="请输入验证码"
            style="width: 200px; margin-right: 10px"
            size="small"
          ></el-input>
          <!-- 正常能发送验证码 -->
          <el-button
            :loading="sendCodeLoading"
            v-popover:popover
            v-if="countDownNum <= 0"
            class="verify-btn"
            type="primary"
            @click="handleValidMobile"
            size="small"
          >
            获取验证码
          </el-button>
          <!-- 倒计时中 -->
          <el-button
            v-else
            disabled
            class="verify-btn"
            type="default"
            size="small"
          >
            {{ countDownNum }}秒后获取
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mobileModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { changePassword, getBaseUserInfo } from '@/api/user'
import { mapActions } from 'vuex'
import store from '@/store'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      let reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.formPassword.password) {
        callback(new Error('两次输入密码不一致'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度6到18个字符'))
      } else {
        callback()
      }
    }

    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPassword.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 修改密码弹窗
      passwordModal: false,
      // userInfo: {},
      formPassword: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      // 获取短信验证码和loading
      countDownNum: 0,
      sendCodeLoading: false,
      // 邮箱认证
      emailModal: false,
      emailForm: {
        email: '',
        verifyCode: ''
      },
      // 手机认证
      mobileModal: false,
      mobileForm: {
        verifyCode: ''
      },

      // 手机认证校验
      mobileValid: {
        verifyCode: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^[0-9]{6}$/.test(value)) {
                  callback(new Error('验证码为6位数字'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请输入短信验证码'))
              }
            }
          }
        ]
      },
      // 修改密码校验
      passwordValid: {
        oldPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '不允许为空'
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' }
        ]
      },
      // 邮箱校验
      emailValid: {
        email: [
          {
            required: true,
            trigger: 'blur',
            message: '不可为空'
          }
        ],
        verifyCode: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^[0-9]{6}$/.test(value)) {
                  callback(new Error('验证码为6位数字'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请输入短信验证码'))
              }
            }
          }
        ]
      }
    }
  },
  props: ['userInfo'],
  created () {
    // console.log(2)
    // console.log(this.userInfo)
    // this.getInfo()
  },
  watch: {
    userInfo: function (a, b) {
      console.log(a, b)
    }
  },
  methods: {
    /** 修改弹窗 */
    resetPassword () {
      this.passwordModal = true
      // 重置表单
      if (this.$refs.formPassword) {
        this.$refs.formPassword.resetFields()
      }
    },
    // 获取用户信息
    getInfo () {
      getBaseUserInfo({
        userId: store.state.user.userId
      }).then(res => {
        if (res.code === 0) {
          this.userInfo = res.data
        }
      })
    },
    /**
     * 修改密码
     */
    ...mapActions(['handleLogout']),
    handleSubmit () {
      this.$refs.formPassword.validate((valid) => {
        if (valid) {
          changePassword(this.formPassword).then((res) => {
            if (res.code === 0) {
              // 更新密码后，强制退出用户，并弹框提示
              this.$Modal.success({
                title: '密码修改成功',

                content: '',
                onOk: () => {
                  this.handleLogout().then(() => {
                    // 清空路由
                    this.$router.options.routes = []
                    this.$router.push({
                      name: 'login'
                    })
                  })
                }
              })
            }
          })
        } else {
          setTimeout(() => {
            this.refuseLoading = false
            this.$nextTick(() => {
              this.refuseLoading = true
            })
          }, 1000)
        }
      })
    },
    /**
     * 短信验证码
     */
    handleValidMobile () {
      this.sendCodeLoading = true
      this.startCountDown()
    },
    // 开始倒计时
    startCountDown () {
      this.countDownNum = 60
      let timer = setInterval(() => {
        this.countDownNum--
        if (this.countDownNum <= 0) {
          this.countDownNum = 0
          // 倒计时结束，清除滑动验证码的状态
          window.nc && window.nc.reset()
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.securityBox {
  font-size: 14px;
  .reminder {
    background: rgb(235, 247, 255);
    padding: 20px;
    p {
      margin: 10px 0;
    }
    .tittle {
      font-weight: bold;
    }
  }
  .grade {
    padding: 30px 20px;
    .text {
      color: rgb(245, 65, 108);
    }
    .line {
      width: 60px;
      height: 10px;
      background: #f5416c;
      display: inline-flex;
      margin: 0 5px;
    }
  }
  /deep/ .ivu-table-wrapper {
    border: 0;
  }
  .accountBox {
    .account_tittle {
      padding: 15px 20px;
      background: rgb(237, 238, 240);
      font-size: 16px;
    }
    .box {
      height: 70px;
      line-height: 70px;
      border-bottom: 1px solid #e8eaec;
      padding: 0 20px;
      span {
        margin: 0 10px;
      }
      & .bold {
        font-weight: bold;
      }
      a {
        float: right;
        margin-right: 50px;
      }
    }
  }
}
</style>
