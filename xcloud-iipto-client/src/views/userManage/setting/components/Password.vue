<template>
  <div class="password">
    <Form ref="formpass" :model="formpass" :rules="rulePass" :label-width="100">
      <FormItem style="width: 344px" label="当前密码:" prop="oldPassword">
        <Input type="password" v-model="formpass.oldPassword" placeholder="请输入当前密码"></Input>
      </FormItem>
      <FormItem style="width: 344px" label="新密码:" prop="newPassword">
        <Input type="password" v-model="formpass.newPassword" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem style="width: 344px" label="确认密码:" prop="surePassword">
        <Input type="password" v-model="formpass.surePassword" placeholder="请输入确认密码"></Input>
      </FormItem>
      <FormItem>
        <Button class="bt" type="primary" :loading="updateLoading" @click="updatePass('formpass')">确认修改</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { changePass } from '@/api/login/login'
export default {
  data () {
    return {
      formpass: {
        oldPassword: '',
        newPassword: '',
        surePassword: ''
      },
      updateLoading: false,
      rulePass: {
        oldPassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^\w{6,15}$/.test(value)) {
                  callback(new Error('密码为6-15位字母，数字，下划线组成'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('密码不能为空'))
              }
            }
          }
        ],
        newPassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^\w{6,15}$/.test(value)) {
                  callback(new Error('密码为6-15位字母，数字，下划线组成'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('密码不能为空'))
              }
            }
          }
        ],
        surePassword: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^\w{6,15}$/.test(value)) {
                  callback(new Error('密码为6-15位字母，数字，下划线'))
                } else if (value !== this.formpass.newPassword) {
                  callback(new Error('确认密码不一致'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('密码不能为空'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 修改密码
     */
    updatePass (all) {
      // console.log(this.formpass);
      this.$refs[all].validate((valid) => {
        if (valid) {
          changePass({
            newPassword: this.formpass.newPassword,
            oldPassword: this.formpass.oldPassword
          }).then((res) => {
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
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.password {
  padding: 16px;
}
</style>
