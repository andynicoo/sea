<template>
  <div>
    <a-form-model
      ref="couponForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="名称" prop="couponName">
        <a-input
          v-model="form.couponName"
          :maxLength="30"
          placeholder="请输入（用于优惠券显示）"
        />
      </a-form-model-item>
      <a-form-model-item label="兑换码" prop="exchangeCode">
        <a-input v-model="form.exchangeCode" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="类型" prop="couponType">
        <a-select
          :disabled="!!coupon"
          v-model="form.couponType"
          placeholder="请选择优惠券类型"
        >
          <a-select-option :value="1"> 会员体验券 </a-select-option>
          <a-select-option :value="2"> 旺币券 </a-select-option>
          <a-select-option :value="3"> 满减券 </a-select-option>
          <a-select-option :value="4"> 折扣券 </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="form.couponType === 1">
        <a-form-model-item prop="fieid1" label="体验设置" required>
          <a-select
            :disabled="!!coupon"
            v-model="form.fieid1"
            placeholder="请选择会员类型"
            class="setting-1"
          >
            <a-select-option
              :value="meal.id"
              v-for="meal of meals"
              :key="meal.id"
            >
              {{ meal.name }}
            </a-select-option>
          </a-select>
          <a-input
            class="setting-2"
            :disabled="!!coupon"
            v-model="form.fieid2"
            placeholder="免费天数"
            type="number"
            suffix="天"
          />
        </a-form-model-item>
      </template>
      <template v-if="form.couponType === 2">
        <a-form-model-item label="赠送旺币" prop="fieid1" required>
          <a-input
            v-model="form.fieid1"
            :disabled="!!coupon"
            type="number"
            suffix="RMB"
          />
        </a-form-model-item>
      </template>
      <template v-if="form.couponType === 3">
        <a-form-model-item label="满减设置" prop="fieid1" required>
          <a-input
            :disabled="!!coupon"
            v-model="form.fieid1"
            placeholder="满多少钱"
            class="setting-1"
            type="number"
            suffix="RMB"
          />
          <a-input
            class="setting-2"
            :disabled="!!coupon"
            v-model="form.fieid2"
            placeholder="减多少钱"
            type="number"
            suffix="RMB"
          />
        </a-form-model-item>
      </template>
      <template v-if="form.couponType === 4">
        <a-form-model-item label="折扣设置" prop="fieid1" required>
          <a-input
            :disabled="!!coupon"
            v-model="form.fieid1"
            placeholder="满多少钱"
            class="setting-1"
            type="number"
            suffix="RMB"
          />
          <a-input
            class="setting-2"
            :disabled="!!coupon"
            v-model="form.fieid2"
            placeholder="折扣"
            type="number"
            suffix="折"
          />
        </a-form-model-item>
      </template>
      <a-form-model-item label="券总数量" prop="totalQuantity">
        <a-input
          type="number"
          v-model="form.totalQuantity"
          placeholder="请输入数字，0表示无限制"
        />
      </a-form-model-item>
      <a-form-model-item label="有效期" prop="validity">
        <a-input
          type="number"
          v-model="form.validity"
          placeholder="领取多少天内可使用，当天开始计算"
        />
      </a-form-model-item>
      <a-form-model-item label="个人上限" prop="upperLimit">
        <a-input
          type="number"
          v-model="form.upperLimit"
          placeholder="每人上限领取数量"
        />
      </a-form-model-item>
      <a-form-model-item label="启用时间" prop="times">
        <a-range-picker
          :placeholder="['开始时间', '结束时间']"
          :disabled-date="disabledDate"
          v-model="form.times"
          showTime
          style="width: 100%"
        />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="couponStatus">
        <a-radio-group v-model="form.couponStatus">
          <a-radio :value="1"> 启用 </a-radio>
          <a-radio :value="2"> 停用 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remark">
        <a-textarea
          v-model="form.remark"
          :rows="8"
          placeholder="选填"
          :maxLength="100"
        />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { getMarketSelect } from '@/api/usermanage'
import { mgCouponEdit } from '@/api/coupon'
import moment from 'moment'
import { range } from 'lodash'

const fmt = 'YYYY-MM-DD HH:mm:ss'

export default {
  props: {
    coupon: Object
  },
  data() {
    return {
      form: {
        couponType: 1,
        couponStatus: 1
      },
      rules: {
        couponName: [
          { required: true, message: '名称不能为空' },
          { max: 30, message: '最大长度为30' }
        ],
        couponType: [{ required: true, message: '类型不能为空' }],
        fieid1: [
          {
            validator: () => {
              let { couponType, fieid1, fieid2 } = this.form
              const error = '请输入大于0的正整数'
              if (couponType === 1) {
                /** field1 */
                if (!fieid1) return Promise.reject('会员类型不能为空')

                /** field2 */
                if (!fieid2) return Promise.reject('免费天数不能为空')
                if (/^0/.test(fieid2)) return Promise.reject(error)
                fieid2 = Number(fieid2)
                if (!Number.isInteger(fieid2)) return Promise.reject(error)
                if (fieid2 <= 0) return Promise.reject(error)
              } else if (couponType === 2) {
                if (!fieid1) return Promise.reject('旺币不能为空')
                if (/^0/.test(fieid1)) return Promise.reject(error)
                fieid1 = Number(fieid1)
                if (!Number.isInteger(fieid1)) return Promise.reject(error)
                if (fieid1 <= 0) return Promise.reject(error)
              } else if (couponType === 3) {
                /** fieid2 */
                if (!fieid2) return Promise.reject('满减金额不能为空')
                if (/^0/.test(fieid2)) return Promise.reject(error)
                if (Number(fieid2) < 0) return Promise.reject(error)

                /** fieid1 */
                if (!fieid1) return Promise.reject('满减条件不能为空')
                if (Number(fieid1) < 0) return Promise.reject(error)
              } else if (couponType === 4) {
                const error2 = '折扣请输入1~100之间的数字'

                /** fieid2 */
                if (!fieid2) return Promise.reject('折扣不能为空')
                if (Number(fieid2) <= 0) {
                  return Promise.reject('请输入0~1的数字')
                }

                if (Number(fieid2) > 1) return Promise.reject('折扣请输入0~1的数字')
                if (Number(fieid2) !== 1) {
                  if (!/\.\d{2}$/.test(fieid2)) {
                    return Promise.reject('请输入两位小数的数字')
                  }
                }

                /** fieid1 */
                if (!fieid1) return Promise.reject('满减条件不能为空')
                if (Number(fieid1) < 0) return Promise.reject('满折金额不能小于0')
              }

              return Promise.resolve()
            }
          }
        ],
        totalQuantity: [
          { required: true, message: '券总数量不能为空' },
          {
            validator: (_, value) => {
              if (value.length > 1 && /^0/.test(value)) {
                return Promise.reject('请输入大于0的正整数')
              }
              value = Number(value)
              if (!Number.isInteger(value)) {
                return Promise.reject('请输入大于0的正整数')
              }
              if (value < 0) return Promise.reject('请输入大于、等于0的正整数')
              return Promise.resolve()
            }
          }
        ],
        validity: [
          { required: true, message: '有效期不能为空' },
          {
            validator: (_, value) => {
              if (/^0/.test(value)) return Promise.reject('请输入大于0的正整数')
              value = Number(value)
              if (!Number.isInteger(value)) {
                return Promise.reject('请输入大于0的正整数')
              }
              if (value <= 0) return Promise.reject('请输入大于0的正整数')
              return Promise.resolve()
            }
          }
        ],
        upperLimit: [
          { required: true, message: '个人上限不能为空' },
          {
            validator: (_, value) => {
              if (/^0/.test(value)) return Promise.reject('请输入大于0的正整数')
              value = Number(value)
              if (!Number.isInteger(value)) {
                return Promise.reject('请输入大于0的正整数')
              }
              if (value <= 0) return Promise.reject('请输入大于0的正整数')
              return Promise.resolve()
            }
          }
        ],
        times: [{ required: true, message: '启用时间不能为空' }],
        status: [{ required: true, message: '状态不能为空' }]
      },
      meals: []
    }
  },
  mounted() {
    getMarketSelect().then((res) => {
      this.meals = res.data
    })

    if (this.$props.coupon) {
      const { startTime, endTime, ...args } = this.$props.coupon
      let times = []
      if (startTime && endTime) {
        times = [moment(startTime).format(fmt), moment(endTime).format(fmt)]
      }
      this.form = { ...args, times }
    }
  },
  methods: {
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.couponForm.validate((valid) => {
          if (valid) {
            const { times, ...args } = this.form
            const [startTime, endTime] = times
            const data = {
              ...args,
              startTime: moment(startTime).format(fmt),
              endTime: moment(endTime).format(fmt)
            }
            mgCouponEdit(data).then(resolve).catch(reject)
          }
        })
      })
    },
    // 禁用日期
    disabledDate(current) {
      return moment().isAfter(moment(current).add(1, 'days'))
    },
    // 禁用时间
    disabledDateTime() {
      const hours = moment().get('hours')
      const minutes = moment().get('minutes')
      const seconds = moment().get('seconds')
      return {
        disabledHours: () => range(0, hours),
        disabledMinutes: () => range(0, minutes),
        disabledSeconds: () => range(0, seconds)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setting-1,
.setting-2 {
  display: inline-block;
  width: 300px;
  margin-right: 10px;
}
</style>
