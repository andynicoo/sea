<template>
  <a-spin :spinning="spinning">
    <a-form
      layout="horizontal"
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      @submit="onSubmit"
    >
      <a-form-item :label="$t('role.name')">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: this.$t('member.roleNamePlease') }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('role.menus')">
        <a-tree-select
          v-decorator="[
            'menus',
            {
              rules: [
                { required: true, message: this.$t('member.selectPermission') }
              ]
            }
          ]"
          :showCheckedStrategy="SHOW_ALL"
          :tree-data="menuList"
          tree-checkable
          search-placeholder="Please select"
          :replaceFields="{
            children: 'children',
            title: 'menuLang',
            key: 'menuId',
            value: 'menuId'
          }"
        />
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import Member from '@/api/member'
import Store from '@/api/store'
import { mapState } from 'vuex'
import { TreeSelect } from 'ant-design-vue'
import Cookies from 'js-cookie'
const SHOW_ALL = TreeSelect.SHOW_ALL

export default {
  props: {
    role: Object
  },
  computed: {
    ...mapState({
      menuList: (state) => state.auth.menuList
    })
  },
  data() {
    return {
      SHOW_ALL,
      form: this.$form.createForm(this),
      rules: {},
      spinning: false,
      halfId: [],
      HalfIdDel: [],
      originStore: [] // 原始店铺信息
    }
  },
  created() {
    this.languageTrans(this.menuList)
  },
  mounted() {
    this.$data.spinning = true
    const { role } = this.$props
    const { form } = this.$data
    if (role) {
      form.setFieldsValue({ name: role.name })
      Member.getMemberRuleMenuStoreList(role.roleId)
        .then(({ data }) => {
          this.removeHalfId(data.memberMenuId, this.menuList)
          //过滤掉半选的id
          data.memberMenuId = data.memberMenuId.filter((item) => {
            let idList = this.$data.HalfIdDel.map((v) => v)
            return !idList.includes(item)
          })
          form.setFieldsValue({ menus: data.memberMenuId })
          form.setFieldsValue({ stores: data.memberStoreId })
        })
        .finally(() => {
          this.$data.spinning = false
        })
    } else {
      this.$data.spinning = false
    }

    // 获取所有的店铺信息，供勾选
    this.getStoreData()

    // 添加角色，无店铺数据-选择全部的状态
    if (this.$props.role == null) {
      this.$data.indeterminate = false
    }
  },
  methods: {
    alerts() {
      // const { form } = this.$data
      console.log(this.$data.form.getFieldValue('stores'))
    },
    //获取店铺列表
    getStoreData() {
      let params = Object.assign(
        { current: 1, size: 1000, total: 1000 },
        {
          storeAlias: null
          // storeName: 'highend 3c mall'
        }
      )
      Store.getStoreList(params).then(({ data }) => {
        console.log(data.records)
        // this.$data.form.setFieldsValue({ stores: data.records })
        this.$data.originStore = data.records
      })
    },
    menuLang(value) {
      const obj = JSON.parse(value.menuI18n)
      return obj && obj[Cookies.get('language')]
        ? obj[Cookies.get('language')]
        : value.menuName
    },
    languageTrans(menuList) {
      menuList.forEach((item) => {
        this.$set(item, 'menuLang', this.menuLang(item))
        if (item.children && item.children.length) {
          this.languageTrans(item.children)
        }
      })
    },
    removeHalfId(menus, menuList) {
      menuList.forEach((item) => {
        this.removeHalfId2(menus, item.children, item.menuId)
      })
    },
    removeHalfId2(menus, menuList2, oneId) {
      let twoIdLen = 0
      if (menuList2) {
        menuList2.forEach((item) => {
          if (menus.includes(item.menuId)) {
            twoIdLen = twoIdLen + 1
            if (item.children) {
              this.removeHalfId3(menus, item.children, item.menuId, oneId)
            }
          }
        })
        if (twoIdLen !== menuList2.length) {
          this.$data.HalfIdDel.push(oneId)
        }
      }
    },

    removeHalfId3(menus, menuList3, twoId, oneId) {
      let threeIdLen = 0
      menuList3.forEach((item) => {
        if (menus.includes(item.menuId)) {
          threeIdLen = threeIdLen + 1
        }
      })
      if (threeIdLen !== menuList3.length) {
        this.$data.HalfIdDel.push(oneId)
        this.$data.HalfIdDel.push(twoId)
      }
    },

    findIdList(data2, id) {
      var arrRes = []
      let rev = (data, id) => {
        if (!data) {
          return
        }
        for (var i = 0; i < data.children.length; i++) {
          let item = data.children[i]
          if (item.menuId == id) {
            // eslint-disable-next-line no-irregular-whitespace
            // 将匹配到的结果保存到数组
            // eslint-disable-next-line no-irregular-whitespace
            arrRes.unshift(item.menuId) // 递归它的父级
            rev(data2, data.menuId, 0)
            break
          } else if (item.children && item.children.length > 0) {
            //如果有子集，则把子集作为参数重新执行本方法
            rev(item, id)
          }
        }
      }
      rev(data2, id)
      return arrRes
    },

    //获取半选id
    getHalfId(menus, menuList) {
      menus.forEach((item) => {
        this.$data.halfId.push(...this.findIdList({ children: menuList }, item))
      })
    },

    onSubmit() {
      const { role } = this.$props
      const { form } = this.$data
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then(async (data) => {
            let res
            this.getHalfId(data.menus, this.menuList)

            data.menus = Array.from(new Set([...this.$data.halfId]))
            const store = this.$data.form.getFieldValue('stores')
            if (role) {
              res = await Member.handleUpdateRuleStoreInfo({
                ...role,
                ...data,
                ...store
              })
            } else {
              // data.store = store
              res = await Member.handleAddMemberRule(data)
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.storesgroup {
  display: contents;
}
</style>
