<template>
  <div>
    <a-form-model
      ref="couponForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      class="put-give-coupon"
    >
      <div class="sub-title">选择优惠券</div>
      <a-form-model-item label="优惠券" prop="mgCouponId">
        <a-select
          allowClear
          v-model="form.mgCouponId"
          placeholder="请选择优惠券"
        >
          <a-select-option
            v-for="coupon in coupons"
            :key="coupon.mgCouponId"
            :value="coupon.mgCouponId"
          >
            {{ coupon.couponName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <div class="sub-title">条件筛选</div>
      <a-form-model-item label="用户类型" prop="userType">
        <a-radio-group v-model="form.userType">
          <a-radio :value="1">全部人员</a-radio>
          <a-radio :value="2">自然用户</a-radio>
          <a-radio :value="3">指定用户</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <template v-if="form.userType === 3">
        <a-form-model-item label="指定用户" prop="designatedUser">
          <a-input
            v-model="form.designatedUser"
            placeholder="请输入用户手机号，多个用“,”隔开"
          />
        </a-form-model-item>
      </template>
      <a-form-model-item label="注册时间" prop="registerTimes">
        <a-range-picker showTime v-model="form.registerTimes" />
      </a-form-model-item>
      <a-form-model-item label="会员付费时间" prop="payTimes">
        <a-range-picker showTime v-model="form.payTimes" />
      </a-form-model-item>
      <a-form-model-item label="订单设置" class="form-item-inline-parent">
        <a-form-model-item prop="orderSet">
          <a-select v-model="form.orderSet" allowClear>
            <a-select-option :value="7">过去7天</a-select-option>
            <a-select-option :value="15">过去15天</a-select-option>
            <a-select-option :value="30">过去30天</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="orderGt">
          <a-input v-model="form.orderGt" placeholder="数量" type="number" />
        </a-form-model-item>
        <a-form-model-item>≤订单≤</a-form-model-item>
        <a-form-model-item prop="orderLt">
          <a-input v-model="form.orderLt" placeholder="数量" type="number" />
        </a-form-model-item>
      </a-form-model-item>

      <a-form-model-item label="发布商品数量" class="form-item-inline-parent">
        <a-form-model-item prop="pushProductSet">
          <a-select v-model="form.pushProductSet" allowClear>
            <a-select-option :value="7">过去7天</a-select-option>
            <a-select-option :value="15">过去15天</a-select-option>
            <a-select-option :value="30">过去30天</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="pushProductGt">
          <a-input
            v-model="form.pushProductGt"
            placeholder="天数"
            type="number"
          />
        </a-form-model-item>
        <a-form-model-item>≤发布≤</a-form-model-item>
        <a-form-model-item prop="pushProductLt">
          <a-input
            v-model="form.pushProductLt"
            placeholder="天数"
            type="number"
          />
        </a-form-model-item>
      </a-form-model-item>

      <a-form-model-item label="实际发送人数" prop="publishCount">
        <a-space>
          <template v-if="giveGrant">
            <span>
              {{ giveGrant.grantNumber }}
              <span>人（可发放剩余</span>
              {{
                giveGrant.surplusGrantNumber === 0 &&
                giveGrant.totalQuantity === 0
                  ? '无限'
                  : giveGrant.surplusGrantNumber
              }}
              <span>张）</span>
            </span>
          </template>
          <template v-else>
            <span>0 人</span>
          </template>
          <span class="action-button" @click="onPreview">预览人数</span>
          <span class="action-button" @click="onDetail">人员明细</span>
        </a-space>
      </a-form-model-item>
      <a-form-model-item prop="isSendMsg" label="通知消息">
        <a-radio-group v-model="form.isSendMsg">
          <a-radio :value="1">发送</a-radio>
          <a-radio :value="0">不发送</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remask">
        <a-textarea :rows="8" v-model="form.remask" />
      </a-form-model-item>
    </a-form-model>

    <a-modal
      destroyOnClose
      :visible="detailVisible"
      title="人员明细"
      @cancel="detailVisible = false"
      :width="800"
      :maskClosable="false"
      :footer="null"
    >
      <template v-if="giveGrant">
        <a-table :columns="columns" :data-source="giveGrant.grantMembers" />
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mgCouponGiveSave, mgCouponList, mgCouponGiveGrant } from '@/api/coupon'
import moment from 'moment'

const fmt = 'YYYY-MM-DD HH:mm:ss'

const columns = [{ title: '手机号', key: 'maAccount', dataIndex: 'maAccount' }]

export default {
  data() {
    return {
      form: {
        registerTimes: [],
        payTimes: [],
        userType: 1,
        isSendMsg: 1
      },
      rules: {
        mgCouponId: [{ required: true, message: '请选择优惠券' }],
        userType: [{ required: true, message: '请选择用户类型' }],
        designatedUser: [{ required: true, message: '请输入用户手机号' }],
        // 订单设置
        orderSet: [
          {
            validator: (_, value) => {
              const { orderLt, orderGt } = this.form
              if (orderLt && orderGt) {
                if (!value) return Promise.reject('请选择设置条件')
              }
              return Promise.resolve()
            }
          }
        ],
        // 发布商品数量
        pushProductSet: [
          {
            validator: (_, value) => {
              const { pushProductLt, pushProductGt } = this.form
              if (pushProductLt && pushProductGt) {
                if (!value) return Promise.reject('请选择设置条件')
              }
              return Promise.resolve()
            }
          }
        ],
        // 订单小于
        orderGt: [
          {
            validator: (_, value) => {
              if (!this.form.orderSet) return Promise.resolve()
              if (value < 0) return Promise.reject('请输入大于0的整数')
              if (/\./.test(value)) return Promise.reject('请输入大于0的整数')
              if (!value) return Promise.reject('请选择订单条件')
              if (!(value < this.form.orderLt)) {
                return Promise.reject('订单小于条件必须小于订单大于条件')
              }
              this.$refs.couponForm.validateField('orderLt')
              return Promise.resolve()
            }
          }
        ],
        // 订单大于
        orderLt: [
          {
            validator: (_, value) => {
              if (!this.form.orderSet) return Promise.resolve()
              if (value <= 0) return Promise.reject('请输入大于0的整数')
              if (/\./.test(value)) return Promise.reject('请输入大于0的整数')
              if (!value) return Promise.reject('请选择订单条件')
              if (!(this.form.orderGt < value)) {
                return Promise.reject('订单小于条件必须小于订单大于条件')
              }
              this.$refs.couponForm.validateField('orderGt')
              return Promise.resolve()
            }
          }
        ],
        // 天数小于
        pushProductGt: [
          {
            validator: (_, value) => {
              if (!this.form.pushProductSet) return Promise.resolve()
              if (value < 0) return Promise.reject('请输入大于0的整数')
              if (/\./.test(value)) return Promise.reject('请输入大于0的整数')
              if (!value) return Promise.reject('请选择订单条件')
              if (!(value < this.form.pushProductLt)) {
                return Promise.reject('订单小于条件必须小于订单大于条件')
              }
              this.$refs.couponForm.validateField('pushProductLt')
              return Promise.resolve()
            }
          }
        ],
        // 天数大于
        pushProductLt: [
          {
            validator: (_, value) => {
              if (!this.form.pushProductSet) return Promise.resolve()
              if (value <= 0) return Promise.reject('请输入大于0的整数')
              if (/\./.test(value)) return Promise.reject('请输入大于0的整数')
              if (!value) return Promise.reject('请选择订单条件')
              if (!(this.form.pushProductGt < value)) {
                return Promise.reject('订单小于条件必须小于订单大于条件')
              }
              this.$refs.couponForm.validateField('pushProductGt')
              return Promise.resolve()
            }
          }
        ],
        isSendMsg: [{ required: true, message: '请选择是否发送消息通知' }]
      },
      coupons: [],
      giveGrant: null,
      detailVisible: false,
      columns
    }
  },
  mounted() {
    mgCouponList().then((res) => {
      this.coupons = res.data
    })
  },
  methods: {
    // 提交
    async submit() {
      const data = await this.getData()
      return mgCouponGiveSave(data)
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.couponForm.validate((valid) => {
          if (!valid) return reject()

          let { registerTimes, payTimes, ...args } = this.form

          if (registerTimes && registerTimes.length) {
            const [startTime, endTime] = registerTimes
            args.regStartTime = moment(startTime).format(fmt)
            args.regEndTime = moment(endTime).format(fmt)
          }

          if (payTimes && payTimes.length) {
            const [startTime, endTime] = payTimes
            args.payStartTime = moment(startTime).format(fmt)
            args.payEndTime = moment(endTime).format(fmt)
          }

          if (args.orderGt) {
            args.orderGt = parseInt(args.orderGt)
          }
          if (args.orderLt) {
            args.orderLt = parseInt(args.orderLt)
          }
          if (args.pushProductGt) {
            args.pushProductGt = parseInt(args.pushProductGt)
          }
          if (args.pushProductLt) {
            args.pushProductLt = parseInt(args.pushProductLt)
          }
          resolve(args)
        })
      })
    },
    // 预览
    onPreview() {
      this.getData().then((args) => {
        mgCouponGiveGrant(args).then((res) => {
          this.giveGrant = res.data
        })
      })
    },
    // 人员明细
    onDetail() {
      this.getData().then((args) => {
        mgCouponGiveGrant(args).then((res) => {
          this.giveGrant = res.data
          this.detailVisible = true
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-button {
  color: #4c86ff;

  &:hover {
    color: #4c86ff;
  }
}
</style>

<style lang="less">
.put-give-coupon {
  .sub-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .ant-calendar-picker {
    width: 100% !important;
  }

  .form-item-inline-parent {
    margin-bottom: 0;

    & > .ant-form-item-control-wrapper {
      & > .ant-form-item-control {
        & > .ant-form-item-children {
          display: grid;
          grid-template-columns: 1fr 120px 80px 120px;
          gap: 10px;

          .ant-form-item {
            &:nth-child(3) {
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
