<template>
  <div class="header-container">
    <el-form label-position="left" label-width="100px">
      <el-form-item label="头像：">
        <UploadImage
          ref="uploadImageRef"
          :imageUrl="form.imageUrl"
          :on-success="uploadSuccess"
          :on-error="onUploadError"
          :on-remove="onUploadRemove"
        >
        </UploadImage>
      </el-form-item>
      <el-form-item label="手机号码：">
        {{ userInfo.mobile }}
        <!-- <template>
          <el-button type="warning" style="margin: 0 10px" size="small"
            >未认证</el-button
          >
          <el-button type="text" @click="mobileModal = true">去认证</el-button>
        </template>
         -->
      </el-form-item>
      <el-form-item label="邮箱："> {{ userInfo.email || '--' }}</el-form-item>
      <el-form-item label="密码：">
        <el-button type="text" @click="resetPassword">修改密码</el-button>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="真实姓名：">
        <el-input
          v-model="userInfo.nickName"
          placeholder="请输入真实姓名"
          clearable
          style="width: 168px"
          size="small"
          readonly
        />
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="userInfo.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="企业名称："> {{ userInfo.companyName || '--'}} </el-form-item>
      <el-form-item label="部门名称："> {{ userInfo.departmentName }} </el-form-item>
      <el-form-item label="职能角色："> {{ userInfo.userType === 'normal' ? '普通管理员' : '超级管理员' }} </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" size="small">确定</el-button>
        <el-button style="margin-left: 8px" size="small">取消</el-button>
      </el-form-item> -->
    </el-form>
    <!-- 手机认证 -->
    <el-dialog :visible.sync="mobileModal" title="手机认证" width="500px">
      <el-form
        ref="formMobile"
        :model="mobileForm"
        :rules="mobileValid"
        label-width="100px"
      >
        <el-form-item label="手机号"> {{ userInfo.mobile }} </el-form-item>

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
    <!-- 修改密码 -->
    <el-dialog :visible.sync="passwordModal" title="修改密码" width="550px" :modal-append-to-body="true">
      <el-form
        ref="formPassword"
        :model="formPassword"
        :rules="passwordValid"
        label-width="110px"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            type="password"
            v-model="formPassword.oldPwd"
            placeholder="请输入旧密码"
            style="width: 350px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="新登录密码" prop="newPwd">
          <el-input
            type="password"
            v-model="formPassword.newPwd"
            placeholder="密码设置至少8个字符，且至少包含一个字母、一个数字和一个符号"
            style="width: 350px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input
            type="password"
            v-model="formPassword.confirmPwd"
            placeholder="再次输入新密码"
            style="width: 350px"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordModal = false" size="small">取 消</el-button>
        <el-button @click="handleSubmit" type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UploadImage from '@/components/UploadImage/index.vue' // 头像上传
import { changeManagerPwd } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  components: { UploadImage },
  props: ['userInfo'],
  data () {
    const validatePass = (rule, value, callback) => {
      // let reg2 = /^.{6,20}$/
      let reg2 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[. @$!%*#_~?&^{}【】\-+/|\\':;])[\da-zA-Z. @$!%*#_~?&^{}【】\-+/|\\':;]{8,}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === this.formPassword.oldPwd) {
        callback(new Error('新密码不能与旧密码相同'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('密码设置至少8个字符，且至少包含一个字母、一个数字和一个符号'))
      } else {
        callback()
      }
    }

    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formPassword.newPwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        gender: '',
        userName: '',
        imageUrl: '',
        mobile: this.userInfo.mobile
      },
      // 获取短信验证码和loading
      countDownNum: 0,
      sendCodeLoading: false,
      // 手机认证
      mobileModal: false,
      mobileForm: {
        verifyCode: ''
      },
      // 修改密码弹窗
      passwordModal: false,
      formPassword: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
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
        oldPwd: [
          {
            required: true,
            trigger: 'blur',
            message: '不允许为空'
          }
        ],
        newPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validatePassConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // console.log(this.userInfo)
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
    /**
     * 修改密码
     */
    ...mapActions(['handleLogout']),
    handleSubmit () {
      this.$refs.formPassword.validate((valid) => {
        if (valid) {
          changeManagerPwd(this.formPassword).then((res) => {
            if (res.code === 0) {
              this.passwordModal = false
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
    },
    /**
     * 修改头像
     */
    uploadSuccess (file) {
      console.log(file)
      this.form.imageUrl = file.url
    },
    // 上传失败
    onUploadError (file) {},
    // 上传移除
    onUploadRemove (file) {
      this.form.imageUrl = ''
    }
  }
}
</script>
