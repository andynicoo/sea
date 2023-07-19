<template>
  <a-spin :spinning="spinning">
    <a-form
      layout="horizontal"
      :form="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      @submit="onSubmit"
    >
      <a-form-item :label="$t('member.account')">
        <a-input v-decorator="['maAccount', { rules: [rules.required] }]" />
      </a-form-item>
      <a-form-item :label="$t('member.trueName')">
        <a-input v-decorator="['maName', { rules: [rules.required] }]" />
      </a-form-item>
      <a-form-item :label="$t('member.password')">
        <a-input v-decorator="['password', { rules: getPasswordRules }]" />
      </a-form-item>
      <a-form-item :label="$t('member.chooseRules')">
        <a-select v-decorator="['roleId', { rules: [rules.required] }]">
          <a-select-option
            v-for="role in ruleData"
            :key="role.roleId"
            :value="role.roleId"
          >
            {{ role.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('role.dataarry')">
        <div>
          {{ $t('member.string9') }}
        </div>
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onCheckAllChange"
          v-if="originStore.length != 0"
        >
          {{ $t('member.selectall') }}
        </a-checkbox>
        <a-checkbox-group
          v-decorator="[
            'storeIds',
            {
              rules: [{ required: true, message: this.$t('member.chosestore') }]
            }
          ]"
          @change="onChange"
          class="storesgroup"
        >
          <a-checkbox
            :value="item.storeId"
            v-for="item in originStore"
            :key="item.storeId"
          >
            {{ item.storeName }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item :label="$t('member.accountStatus')">
        <a-radio-group
          v-decorator="['status', { initialValue: 1, rules: [rules.required] }]"
        >
          <a-radio :value="1"> {{ $t('common.open') }} </a-radio>
          <a-radio :value="0"> {{ $t('common.close') }} </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script>
import Member from '@/api/member'
import { PASSWORD } from '@/util/regex'
import Store from '@/api/store'
export default {
  props: {
    member: Object
  },
  data() {
    return {
      form: this.$form.createForm(this),
      ruleData: [],
      rules: {
        required: { required: true, message: this.$t('member.reqThis') },
        password: {
          pattern: PASSWORD,
          message: this.$t('member.passwordMsg')
        }
      },
      spinning: false,
      originStore: [], // 原始店铺信息
      plainOptions: [], // 所有店铺，数据集合，storeid
      checkedList: [], //this.$form.getFieldValue('stores'),
      indeterminate: true,
      checkAll: false
    }
  },
  computed: {
    getPasswordRules() {
      const { member } = this.$props
      const { rules } = this.$data
      if (member) return [rules.password]
      return [rules.required, rules.password]
    }
  },
  async mounted() {
    this.$data.spinning = true
    const { member } = this.$props
    const { form } = this.$data
    const rules = await Member.getMemberRuleList()
    this.$data.ruleData = rules.data

    // 获取所有的店铺信息，供勾选
    this.getStoreData()

    if (member) {
      const { maAccount, maName, roleId, status, storeIds } = member
      form.setFieldsValue({ maAccount, maName, roleId, status, storeIds })
    }
    this.$data.spinning = false
  },
  methods: {
    onSubmit() {
      const { member } = this.$props
      const { form } = this.$data
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then(async (data) => {
            let res
            if (member) {
              res = await Member.handleUpdateMember({ ...member, ...data })
            } else {
              res = await Member.handleAddSubMember(data)
            }
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
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
        if (data.records.length) {
          data.records.map((ele) => {
            this.$data.plainOptions.push(ele.storeId)
          })
        }
        // console.log(this.$data.form)
      })
    },
    onChange(checkedList) {
      const { form } = this.$data
      this.indeterminate =
        !!checkedList.length &&
        checkedList.length < this.$data.plainOptions.length
      this.checkAll = checkedList.length === this.$data.plainOptions.length
    },
    onCheckAllChange(e) {
      const { form } = this.$data
      Object.assign(this, {
        checkedList: e.target.checked
          ? form.setFieldsValue({ storeIds: this.$data.plainOptions })
          : form.setFieldsValue({ storeIds: [] }),
        indeterminate: false,
        checkAll: e.target.checked
      })
    }
  }
}
</script>
