<template>
  <div class="login">
    <div class="login-box">
      <div class="login-logo g-pb20">
        <img
          src="@/assets/logo-white2.png"
          alt=""
          width="300px"
        >
      </div>
      <a-form-model
        ref="form"
        :model="formModel"
        class="form-box"
        :rules="rules"
        :colon="false"
      >
        <a-form-model-item
          prop="account"
          label="账号/手机号"
        >
          <a-input
            v-model="formModel.account"
            placeholder="请输入账号/手机号"
            @pressEnter="submit"
          ><a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          /></a-input>
        </a-form-model-item>
        <a-form-model-item
          prop="password"
          label="密码"
        >
          <a-input-password
            v-model="formModel.password"
            type="password"
            placeholder="请输入密码"
            @pressEnter="submit"
          ><a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          /></a-input-password>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="submit"
          >登录</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <Footer />
  </div>
</template>

<script>
import { getUserInfo, loginNew } from '@/api/login'
import menuList from '@/utils/menuList'
import { listToTree } from '@/utils'
import Footer from './components/Footer.vue'
export default {
  name: 'Login',
  components: {
    Footer
  },
  data() {
    return {
      formModel: {
        account: '',
        password: '',
        type: 2
      },
      rules: {
        account: [{ required: true, message: '请输入账号/手机号 ' }],
        password: [{ required: true, message: '请输入密码 ' }]
      },
      loading: false,
      accessToken: ''
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.login()
        }
      })
    },
    async login() {
      this.loading = true
      loginNew({
        grant_type: 'password',
        client_id: 'emalacca_erp_mg',
        authType: 'tms',
        client_secret: '66d2dd0591cd1ebda67b7c250919d597',
        username: this.formModel.account,
        password: this.formModel.password,
        language: 'zh_cn',
        scope: 'all'
      })
        .then(async (res2) => {
          let resCon = res2
          if (resCon.access_token) {
            this.accessToken = resCon.access_token
            //
            // 无token不获取userinfo
            if (this.accessToken === '') {
              return
            }
            this.$store.commit('setVars', {
              auth: {
                token: this.accessToken
              }
            })
            const { data = {} } = await getUserInfo({})
            data.userInfo = {
              headPortrait: data.headPortrait,
              maAccount: data.maAccount,
              managerAccount: data.managerAccount,
              managerName: data.managerName,
              memberId: data.memberId,
              role: data.role
            }
            const treeMenu = listToTree(
              data?.menuList || [],
              (parentObj, item) => item.menuType !== 'F'
            )
            this.$store.commit('setVars', {
              auth: {
                ...data,
                treeMenu,
                routeAuthMap: this.mapRouteName(data?.menuList ?? []),
                roles: this.initRoles(data?.menuList ?? []),
                token: this.accessToken
              }
            })
            this.$router.push('/')
            this.loading = false
          } else {
            this.$message.error(resCon.message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    // map操作页面的按钮权限
    initRoles(data = []) {
      const map = data.reduce((init, cur) => {
        init[cur.menuId] = cur
        return init
      }, {})
      const roles = data.filter((item) => item.menuType === 'F')
      return (
        roles &&
        roles.reduce((init, cur) => {
          if (map[cur.parentId]) {
            const key = map[cur.parentId].menuCode
            init[key]
              ? init[key].push(cur.menuCode || cur.menuName)
              : (init[key] = [cur.menuCode || cur.menuName])
          }
          return init
        }, {})
      )
    },
    formatList(list = []) {
      return menuList.filter((item) => {
        if (item.auth || list.find((it) => it.menuCode === item.menuCode)) {
          item.children =
            item.children &&
            item.children.length > 0 &&
            item.children.filter(
              (v) => v.auth || list.find((it) => it.menuCode === v.menuCode)
            )
          return true
        }
        return false
      })
    },
    // map页面权限
    mapRouteName(list = []) {
      const map = list.reduce((acc, cur) => {
        acc[cur.menuId] = cur
        return acc
      }, {})
      const routeAuthMap = list.map((item) => {
        let obj = map[item.parentId]
        if (item.menuType === 'F' && obj) {
          return `${obj.menuCode}_${item.menuCode}`
        }
        return item.menuCode
      })
      return Object.freeze(routeAuthMap)
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #272c34;
}
.login-box {
  width: 560px;
  margin: auto;
  /deep/.ant-form-item-label > label {
    color: #fff;
  }
  .login-logo {
    display: flex;
    justify-content: center;
  }
}
</style>
