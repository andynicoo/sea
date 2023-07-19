<template>
  <div class="me-pa-2">
    <a-card :bordered="false">
      <template slot="extra">
        <a-button type="link" @click="onExchangeCode"> 兑换码 </a-button>
      </template>
      <template slot="title">
        <span class="me-mr-5">我的优惠券</span>
        <router-link to="/information/info?type=1&listId=17&newsId=243">
          <a style="color: #4c86ff">
            <a-icon type="question-circle" />
            使用说明
          </a>
        </router-link>
      </template>
      <a-tabs type="card" class="mg-custom-tabs">
        <a-tab-pane key="1" tab="未使用">
          <CouponList type="unused" ref="couponUnusedRef" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="已使用">
          <CouponList type="used" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="已过期">
          <CouponList type="expired" />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      :visible="exchangeCodeVisible"
      destroyOnClose
      title="兑换码"
      @ok="onExchangeCodeOk"
      @cancel="onExchangeCodeCancel"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="兑换码">
          <a-input
            v-decorator="['exchangeCode', { rules: rules.exchangeCode }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import CouponList from './components/CouponList'
import Member from '@/api/member'
export default {
  components: {
    CouponList
  },
  data() {
    return {
      exchangeCodeVisible: false,
      form: this.$form.createForm(this),
      rules: {
        exchangeCode: [{ required: true, message: 'Please input your note!' }]
      }
    }
  },
  mounted() {
    Member.getMemberList().then((res) => {
      this.$store.dispatch('setMeals', res.data)
    })
  },
  methods: {
    onExchangeCode() {
      this.exchangeCodeVisible = true
      this.form.resetFields()
    },
    onExchangeCodeOk() {
      this.form.validateFields().then((value) => {
        Member.couponExchange(value)
          .then((res) => {
            this.onExchangeCodeCancel()
            this.$confirm({
              title: '恭喜您兑换成功',
              content: res.data,
              onOk: () => {
                this.$refs.couponUnusedRef.reLoadData()
              },
              onCancel: () => {
                this.$refs.couponUnusedRef.reLoadData()
              }
            })
          })
          .catch((error) => {
            this.$message.error(error.response.data.message)
          })
      })
    },
    onExchangeCodeCancel() {
      this.exchangeCodeVisible = false
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less">
.mg-custom-tabs {
  .ant-tabs-tab {
    margin-right: -1px !important;
  }
}
</style>
