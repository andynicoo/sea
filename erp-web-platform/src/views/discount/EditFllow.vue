<template>
  <div class="me-pa-2 xxx">
    <div class="me-pb-2">
      <a-breadcrumb class="me-ib">
        <a-breadcrumb-item>优惠券</a-breadcrumb-item>
        <a-breadcrumb-item v-if="editType === 'eidt'">编辑</a-breadcrumb-item>
        <a-breadcrumb-item v-else-if="editType === 'view'"
          >查看</a-breadcrumb-item
        >
        <a-breadcrumb-item v-else>创建</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-form-model
      :model="form"
      :rules="rules"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div class="me-card">
        <h2>
          基本信息
        </h2>
        <a-form-model-item label="选择店铺" prop="storeId">
          <a-select
            v-model="form.storeId"
            class="me-w560"
            placeholder="请选择"
            :disabled="editType === 'edit' || editType === 'view'"
          >
            <a-select-option
              v-for="item in storeList"
              :key="item.storeId"
              :value="item.storeId"
            >
              {{ item.storeAlias || item.storeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关注有礼名称" prop="followPrizeName">
          <a-input
            v-model="form.followPrizeName"
            :disabled="editType === 'view'"
            :suffix="form.followPrizeName.length + '/ 20'"
          />
        </a-form-model-item>
        <!-- :disabled-time="disabledRangeTime" -->
        <div class="porptips">
          <a-form-model-item label="领取期限" prop="setTime">
            <a-range-picker
              :show-time="{ format: 'HH:mm:ss' }"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              v-model="form.setTime"
              style="min-width: 425px"
              :disabled-date="disabledDate"
              :disabled-time="disabledRangeTime"
              :disabled="editType === 'view'"
            />
          </a-form-model-item>
          <div class="tips">领取后7天内可以使用</div>
        </div>
      </div>
      <div class="me-card">
        <h2>
          优惠设置
        </h2>
        <a-form-model-item label="优惠类型">
          <a-radio v-model="djj">代金券</a-radio>
        </a-form-model-item>
        <h2>
          奖励设置
        </h2>
        <a-form-model-item label="奖励类型">
          <a-radio-group
            name="radioGroup"
            v-model="form.type"
            :disabled="editType === 'edit' || editType === 'view'"
            @change="onChangeType"
          >
            <!-- type: 1,2 -->
            <a-radio :value="1">
              折扣
            </a-radio>
            <a-radio :value="2">
              shopee币回扣
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="折扣类型/优惠限额"
          :prop="form.searchType === 'zk' ? 'discountAmount' : 'percentage'"
        >
          <!-- searchType: zk,bfb -->
          <a-input-group compact>
            <a-select
              v-model="form.searchType"
              style="width:110px"
              :disabled="editType === 'edit' || editType === 'view'"
            >
              <!-- 选shopee币回扣的时候只能填 百分比折扣 -->
              <a-select-option value="zk" v-if="form.type === 1">
                折扣金额
              </a-select-option>
              <a-select-option value="bfb">
                百分比折扣
              </a-select-option>
            </a-select>
            <!-- :prefix="currency" -->
            <a-input
              v-model="form.discountAmount"
              style="width: 316px"
              placeholder="请输入金额"
              v-if="form.searchType === 'zk'"
              v-enterIntNumber
              :disabled="editType === 'edit' || editType === 'view'"
              :prefix="currency"
            />
            <a-input
              v-model="form.percentage"
              style="width: 316px"
              placeholder="请输入百分比"
              v-else
              suffix="%"
              v-enterIntNumber
              :disabled="editType === 'edit'"
            />
          </a-input-group>
        </a-form-model-item>
        <!-- 选择折扣金额时，无最高限额选项 -->
        <a-form-model-item
          label="最高限额"
          prop="maxPrice"
          v-if="form.searchType === 'bfb'"
        >
          <!-- 奖励类型选择shopee币回扣的时候，不显示最高限额 -->
          <a-input
            placeholder="请输入最高限额"
            v-model="form.maxPrice"
            v-enterIntNumber
            :disabled="editType === 'edit' || editType === 'view'"
            :prefix="currency"
          />
        </a-form-model-item>
        <a-form-model-item label="最低消费金额" prop="minSpend">
          <a-input
            v-model="form.minSpend"
            v-enterIntNumber
            placeholder="请输入最低消费金额"
            :prefix="currency"
            :disabled="editType === 'view'"
          />
        </a-form-model-item>
        <a-form-model-item label="发放数量" prop="usageQuantity">
          <a-input
            v-model="form.usageQuantity"
            v-enterIntNumber
            placeholder="请输入发放数量"
            :disabled="editType === 'view'"
          />
        </a-form-model-item>
      </div>
    </a-form-model>

    <div class="me-card">
      <a-space>
        <a-button
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType !== 'view'"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="submit"
          :loading="submitIng"
          v-if="editType === 'edit' || editType === undefined"
        >
          确认
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType === 'view'"
        >
          确认
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import Store from '@/api/store'
import Discount from '@/api/discount'
import { disabledDate, disabledRangeTime } from '@/util/timeOperation'
export default {
  data() {
    return {
      disabledDate,
      disabledRangeTime,
      rules: {
        storeId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        followPrizeName: [
          {
            required: true,
            message: '请输入关注有礼名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '不超过20个字符',
            trigger: 'blur'
          }
        ],
        setTime: [
          {
            required: true,
            message: '请输入领取期限',
            trigger: 'blur'
          }
        ],
        usageQuantity: [
          {
            required: true,
            message: '请输入发放数量',
            trigger: 'blur'
          },
          { validator: this.checkUsageQuantity }
        ],
        maxPrice: [
          {
            required: true,
            message: '请输入最大限额',
            trigger: 'blur'
          }
        ],
        minSpend: [
          {
            required: true,
            message: '请输入最低消费金额',
            trigger: 'blur'
          }
        ],
        percentage: [
          {
            required: true,
            message: '请输入百分比',
            trigger: 'blur'
          }
        ],
        discountAmount: [
          {
            required: true,
            message: '请输入折扣金额',
            trigger: 'blur'
          }
        ]
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      djj: true,
      submitIng: false,
      form: {
        followPrizeName: '',
        setTime: null,
        type: 1, // 接口传参的时候传rewardType，折扣金额1，百分百折扣2，shopee币回扣3
        searchType: 'zk',
        storeId: null,
        discountAmount: null,
        percentage: null,
        maxPrice: null,
        minSpend: null,
        usageQuantity: null,
        limit: true // 最高限额，设定金额/没有限制
      },
      storeList: [], //店铺列表
      currency: '' // 选择店铺时，获取对应的币种
    }
  },
  computed: {
    // 通过url传递的编辑类型，id, 当前活动状态
    editType() {
      return this.$route.query.edit
    },
    discountId() {
      return this.$route.query.id
    },
    editStatus() {
      return this.$route.query.status
    }
  },
  watch: {
    'form.storeId': {
      handler(val) {
        this.getCurrency(val)
      },
      deep: true
    }
  },
  created() {
    this.getStoreAllStore()
  },
  async mounted() {
    // 编辑时获取活动详情
    if (this.discountId) {
      await this.getDiscountDetail()
    }
  },
  methods: {
    //获取所有可用店铺
    getStoreAllStore() {
      Store.getAllStore({ platform: 1 }).then(({ data }) => {
        this.storeList = data
      })
    },
    async submit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { type, setTime, searchType } = this.$data.form
          let params = this.$data.form
          if (type === 1 && searchType === 'zk') {
            params.rewardType = 1
          } else if (type === 1 && searchType === 'bfb') {
            params.rewardType = 2
          } else if (type === 2) {
            params.rewardType = 3
          }
          if (setTime && setTime.length) {
            params.startTime = setTime[0]
            params.endTime = setTime[1]
          }
          params.usageQuantity = Number(params.usageQuantity)
          params.maxPrice = Number(params.maxPrice)
          params.minSpend = Number(params.minSpend)
          params.shopId = Number(this.getPlatformId())
          params.discountAmount = Number(params.discountAmount)

          this.submitIng = true
          let { code } = await Discount.editFollow(params).catch(() => {
            this.submitIng = false
          })
          this.submitIng = false
          console.log(code)
          if (code === 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.openPage(`/discount/follow`)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkUsageQuantity(rule, value, callback) {
      if (value < 1 || value > 10000) {
        callback('1 ~ 200000之间')
      }
      callback()
    },

    getPlatformId() {
      let shopId = null
      this.$data.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          shopId = ele.platformId
        }
      })
      return shopId
    },
    // 根据url id，获取活动信息
    getDiscountDetail() {
      Discount.getFollowDetail({ id: this.discountId }).then((res) => {
        console.log(res)
        this.$data.form = res.data
        this.$set(this.$data.form, 'setTime', [
          res.data.startTime,
          res.data.endTime
        ])
        // this.$data.form.setTime = [res.data.startTime, res.data.endTime]
        if (res.data.rewardType === 1) {
          this.$data.form.type = 1
          this.$data.form.searchType = 'zk'
          this.$set(this.$data.form, 'searchType', 'zk')
        } else if (res.data.rewardType === 2) {
          this.$data.form.type = 1
          this.$data.form.searchType = 'bfb'
          this.$set(this.$data.form, 'searchType', 'bfb')
        } else if (res.data.rewardType === 3) {
          this.$data.form.type = 2
          this.$data.form.searchType = 'bfb'
        }
      })
    },
    // 根据storeId，获取对应币种显示
    getCurrency(val) {
      this.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          this.currency = ele.currency
        }
      })
    },
    // 选shopee币回扣的时候只能填 百分比折扣
    onChangeType(e) {
      console.log('radio checked', e.target.value)
      if (e.target.value === 2) {
        this.$data.form.searchType = 'bfb'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.me-card {
  h2 {
    font-size: 16px;
    margin: 10px 0px 0px 10px;
  }
}
.btnwid90 {
  width: 90px;
}
.radioStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
.porptips {
  position: relative;
  .tips {
    position: absolute;
    left: 583px;
    top: 10px;
  }
}
</style>
<style lang="scss">
.xxx {
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 50px !important;
  }
}
</style>
