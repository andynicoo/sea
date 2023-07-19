<template>
  <div class="set-price-tem-box">
    <div class="teplate-formula">
      <strong>
        <a-icon type="info-circle" class="info-circle-icon" />{{
          $t('common.message')
        }}
      </strong>
      <p>
        {{ $t('goodsCollection.setPriceTem14') }}
      </p>
      <p class="me-handler-red">*{{ $t('goodsCollection.setPriceTem15') }}</p>
      <p class="me-handler-red">*{{ $t('goodsCollection.setPriceTem16') }}</p>
    </div>
    <a-form-model
      class="set-price-form"
      ref="ruleForm"
      :model="form"
      :rules="rules"
    >
      <div class="form-items">
        <div class="form-title">
          <span class="me-handler-red">*</span>
          {{ $t('goodsCollection.templateName') }}:
        </div>
        <div class="form-content">
          <a-form-model-item ref="name" prop="name">
            <a-input
              class="me-w200"
              v-model="form.name"
              :placeholder="$t('goodsCollection.message1')"
              :maxLength="20"
            />
          </a-form-model-item>
        </div>
      </div>
      <div class="form-items me-mb-4">
        <div class="form-title">{{ $t('goodsCollection.setPriceTem65') }}:</div>
        <div class="form-content">
          {{ $t('goodsCollection.setPriceTem64') }}
        </div>
      </div>
      <div class="form-items">
        <div class="form-title" style="line-height: 1">
          {{ $t('goodsCollection.setPriceTem66') }}:
        </div>
        <div class="form-content">
          <a-radio-group v-model="form.freightType" @change="freightTypeChange">
            <div class="form-radio-items">
              <a-radio :value="1">
                <span
                  :class="{ 'me-status-primary': form.freightType === 1 }"
                  >{{ $t('goodsCollection.setPriceTem18') }}</span
                >&nbsp;&nbsp;
                <span class="me-status-skip"
                  >*{{ $t('goodsCollection.setPriceTem19') }}</span
                >
              </a-radio>
              <a-checkbox
                :checked="form.isFreeShipping == 1"
                @change="pinkageChange"
                :disabled="form.freightType !== 1"
              >
                {{ $t('goodsCollection.setPriceTem54') }}
              </a-checkbox>
            </div>
            <div class="form-radio-items me-mb-2">
              <a-radio :value="2">
                <span :class="{ 'me-status-primary': form.freightType === 2 }">
                  {{ $t('goodsCollection.setPriceTem20') }} </span
                >&nbsp;&nbsp;
                <span class="me-status-skip"
                  >*{{ $t('goodsCollection.setPriceTem21') }}</span
                >
              </a-radio>
              <a-tooltip>
                <template slot="title">
                  {{ $t('goodsCollection.setPriceTem22') }}
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </div>
            <div>
              <div class="price-tem-item">
                <span class="price-tem-label">{{
                  $t('goodsCollection.setPriceTem23')
                }}</span>
                <a-form-model-item prop="firstWeightPrice">
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-w160"
                    :placeholder="$t('goodsCollection.columnPrice')"
                    v-positiveNumber="{ fixedNum: 2 }"
                    v-model="form.firstWeightPrice"
                    addon-after="RMB"
                  />
                </a-form-model-item>
                <span class="divide-flex">/</span>
                <a-form-model-item prop="firstWeight">
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-w160"
                    v-model="form.firstWeight"
                    style="border-left: 0"
                    :placeholder="$t('goodsCollection.weight')"
                    addon-after="KG"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                </a-form-model-item>
              </div>
              <div class="price-tem-item">
                <span class="price-tem-label">{{
                  $t('goodsCollection.setPriceTem25')
                }}</span>
                <a-form-model-item prop="additionalWeightPrice">
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-w160"
                    v-model="form.additionalWeightPrice"
                    :placeholder="$t('goodsCollection.columnPrice')"
                    addon-after="RMB"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                </a-form-model-item>
                <span class="divide-flex">/</span>
                <a-form-model-item prop="additionalWeight">
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-w160"
                    v-model="form.additionalWeight"
                    :placeholder="$t('goodsCollection.weight')"
                    addon-after="KG"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="form-radio-items price-tem-item">
              <a-radio :value="3">
                <span :class="{ 'me-status-primary': form.freightType === 3 }">
                  {{ $t('goodsCollection.setPriceTem26') }}
                </span>
              </a-radio>
              <a-form-model-item prop="fixedPrice">
                <a-input
                  :disabled="form.freightType !== 3"
                  class="item-content"
                  v-model="form.fixedPrice"
                  v-positiveNumber="{ fixedNum: 2 }"
                  addon-after="RMB"
                />
              </a-form-model-item>
            </div>
          </a-radio-group>
        </div>
      </div>
      <div class="form-items">
        <div class="form-title">{{ $t('goodsCollection.setPriceTem27') }}:</div>
        <div class="form-content">
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem28')
            }}</span>
            <a-input
              class="item-content"
              v-model="form.otherCost"
              v-positiveNumber="{ fixedNum: 2 }"
              addon-after="RMB"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem29') }}</span
            >
          </a-form-model-item>
        </div>
      </div>
      <div class="form-items">
        <div class="form-title">{{ $t('goodsCollection.setPriceTem30') }}:</div>
        <div class="form-content">
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem53')
            }}</span>
            <a-input
              class="item-content"
              :class="{ 'has-error': isGreater100 }"
              v-model="form.serviceRate"
              v-positiveNumber="{ maxNum: 99, minNum: 0, isInteger: 1 }"
              addon-after="%"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem67') }}</span
            >
          </a-form-model-item>
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem31')
            }}</span>
            <a-input
              class="item-content"
              :class="{ 'has-error': isGreater100 }"
              v-model="form.commissionRate"
              v-positiveNumber="{ maxNum: 99, minNum: 0, isInteger: 1 }"
              addon-after="%"
            />
            <a-popover
              v-model="commissionVisible"
              placement="top"
              trigger="hover"
              overlay-class-name="commis-popover"
            >
              <div slot="content">
                <img
                  src="@/assets/images/price.png"
                  style="height: 160px"
                  alt=""
                />
              </div>
              <a-icon class="me-ml-2 me-cp" type="question-circle" />
            </a-popover>
          </a-form-model-item>
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem33')
            }}</span>
            <a-input
              class="item-content"
              :class="{ 'has-error': isGreater100 }"
              v-model="form.transactionFeeRate"
              v-positiveNumber="{ maxNum: 99, minNum: 0, isInteger: 1 }"
              addon-after="%"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem34') }}</span
            >
          </a-form-model-item>
        </div>
      </div>
      <div class="form-items">
        <div class="form-title">
          {{ $t('goodsCollection.setPriceTem35') }}&nbsp;&nbsp;
        </div>
        <div class="form-content">
          <span style="line-height: 40px" class="me-status-skip"
            >*{{ $t('goodsCollection.setPriceTem36') }}</span
          >
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem37')
            }}</span>
            <a-input
              class="item-content"
              :class="{ 'has-error': isGreater100 }"
              v-model="form.profitRate"
              v-positiveNumber="{ maxNum: 99, minNum: 0, fixedNum: 2 }"
              addon-after="%"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem68') }}</span
            >
          </a-form-model-item>

          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem39')
            }}</span>
            <a-input
              class="item-content"
              v-model="form.discountRate"
              v-positiveNumber="{ maxNum: 100, minNum: 1, isInteger: 1 }"
              addon-after="%"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem40') }}</span
            >
          </a-form-model-item>
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label"
              >{{ $t('goodsCollection.setPriceTem38') }}:</span
            >
            1RMB ≈
            <a-input
              class="item-content"
              style="width: 140px"
              v-model="curRate"
              v-positiveNumber="{ fixedNum: 4 }"
              :disabled="isDisabledRate"
            />
            <span class="me-ml-2 me-status-skip">{{
              $t('goodsCollection.setPriceTem69')
            }}</span>
            <span
              class="me-ml-2 me-status-link me-cp"
              @click="handleRateClick"
              >{{
                isDisabledRate
                  ? $t('goodsCollection.setPriceTem70')
                  : $t('common.ok')
              }}</span
            >
          </a-form-model-item>
        </div>
      </div>
      <div class="form-items">
        <div class="form-title">
          {{ $t('goodsCollection.setPriceTem41') }}&nbsp;&nbsp;
        </div>
        <div class="form-content">
          <span style="line-height: 40px" class="me-status-skip"
            >*{{ $t('goodsCollection.setPriceTem42') }}</span
          >
          <a-form-model-item class="price-tem-item">
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem43')
            }}</span>
            <a-select
              v-model="form.mantissaType"
              :options="mantissaTypeOptions"
              class="item-content"
            >
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            class="price-tem-item"
            v-if="form.mantissaType !== 4"
          >
            <span class="form-item-label">{{
              $t('goodsCollection.setPriceTem44')
            }}</span>
            <a-input
              class="item-content"
              v-model="form.mantissaFix"
              v-positiveNumber="{ isInteger: 1 }"
            />
            <span class="me-ml-2 me-status-skip"
              >*{{ $t('goodsCollection.setPriceTem45') }}</span
            >
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import { isEmpty, add } from '@/util'
import { positiveNumber } from '@/directive/number'

/*
平台佣金率、交易手续费率、活动服务费率、利润率、折扣率这些费率
除了利润率，其他都是只能整数
*/
export default {
  props: {
    countryCode: {
      type: String,
      defalut: ''
    },
    countryRate: {
      type: Number,
      defalut: 1
    },
    formData: {
      type: Object,
      defalut: {}
    }
  },
  directives: {
    positiveNumber
  },
  data() {
    return {
      form: {
        additionalWeight: null, // 续重
        additionalWeightPrice: null, // 续重价格
        commissionRate: 0, // 平台佣金率
        discountRate: 100, //  折扣率
        exchangeRate: null, //  汇率
        firstWeight: null, //  首重
        firstWeightPrice: null, //  首重价格
        fixedPrice: null, //  统一运费
        freightType: 2, //  运费类型  1、跨境店；2、本土店；3、统一运费
        mantissaFix: null, //  固定尾数
        mantissaType: 1, //  尾数处理类型  1、向上取整；2、向下取整；3、四舍五入；4、不处理
        name: '', //  模板名称
        otherCost: 0, //  其他成本
        // profit: null,  //  利润
        profitRate: 0, //  利润率
        // purchaseCostType: null,  //  采购成本类型
        serviceRate: null, //  活动服务费率
        site: this.countryCode, //  站点
        transactionFeeRate: 0, //  交易手续费率
        isFreeShipping: 0 // 是否包邮
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('goodsCollection.setPriceTem46'),
            trigger: 'blur'
          }
        ],
        firstWeightPrice: [
          {
            required: true,
            message: this.$t('goodsCollection.setPriceTem47'),
            trigger: 'blur'
          }
        ],
        firstWeight: [
          {
            required: true,
            message: this.$t('goodsCollection.setPriceTem48'),
            trigger: 'blur'
          }
        ],
        additionalWeight: [
          {
            required: true,
            message: this.$t('goodsCollection.setPriceTem49'),
            trigger: 'blur'
          }
        ],
        additionalWeightPrice: [
          {
            required: true,
            message: this.$t('goodsCollection.setPriceTem50'),
            trigger: 'blur'
          }
        ],
        fixedPrice: [
          {
            required: false,
            message: this.$t('goodsCollection.setPriceTem51'),
            trigger: 'blur'
          }
        ]
      },
      mantissaTypeOptions: [
        { label: this.$t('goodsCollection.setPriceTem10'), value: 1 },
        { label: this.$t('goodsCollection.setPriceTem11'), value: 2 },
        { label: this.$t('goodsCollection.setPriceTem9'), value: 3 },
        { label: this.$t('goodsCollection.setPriceTem52'), value: 4 }
      ],
      isGreater100: false,
      isDisabledRate: true,
      curRate: this.countryRate,
      commissionVisible: false
    }
  },
  mounted() {
    // 编辑
    if (!isEmpty(this.formData)) {
      this.form = Object.assign(this.form, this.formData)
      this.curRate = this.formData['exchangeRate']
      this.rulesReset(this.form.freightType)
    }
  },
  methods: {
    // 取整数
    async strTurnNum() {
      this.form.exchangeRate =
        !this.curRate || this.curRate == 0
          ? this.form.exchangeRate
          : this.curRate
      let numArr = [
        'discountRate',
        'profitRate',
        'transactionFeeRate',
        'commissionRate',
        'otherCost',
        'fixedPrice',
        'additionalWeight',
        'additionalWeightPrice',
        'firstWeight',
        'firstWeightPrice',
        'serviceRate',
        'exchangeRate'
      ]
      await Promise.all(
        numArr.map((item) => {
          this.form[item] = Number(this.form[item])
        })
      )
    },
    async submit() {
      await this.strTurnNum()
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        // eslint-disable-line
        let rate = await add(
          this.form.commissionRate,
          add(
            this.form.transactionFeeRate,
            add(this.form.profitRate, this.form.serviceRate)
          )
        )
        if (rate >= 100) {
          this.isGreater100 = true
          this.errorAlert(this.$t('goodsCollection.setPriceTem63'))
          reject()
          return
        } else {
          this.isGreater100 = false
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            Goods.addPriductPriceTemplate(this.form)
              .then((res) => {
                resolve(this.form.name)
              })
              .catch((error) => {
                reject(error)
              })
          } else {
            reject()
          }
        })
      })
    },
    async editSubmit() {
      await this.strTurnNum()
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        // eslint-disable-line
        let rate = await add(
          this.form.commissionRate,
          add(
            this.form.transactionFeeRate,
            add(this.form.profitRate, this.form.serviceRate)
          )
        )
        if (rate >= 100) {
          this.isGreater100 = true
          this.errorAlert(this.$t('goodsCollection.setPriceTem63'))
          reject()
          return
        } else {
          this.isGreater100 = false
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            Goods.editPriductPriceTemplate(this.form)
              .then((res) => {
                resolve(this.form.name)
              })
              .catch((error) => {
                reject(error)
              })
          } else {
            reject()
          }
        })
      })
    },
    freightTypeChange(event) {
      const value = event.target.value
      this.rulesReset(value)
    },
    rulesReset(value) {
      this.$refs.ruleForm.clearValidate([
        'firstWeightPrice',
        'firstWeight',
        'additionalWeight',
        'additionalWeightPrice',
        'fixedPrice'
      ])
      this.rules.firstWeightPrice[0].required = false
      this.rules.firstWeight[0].required = false
      this.rules.additionalWeight[0].required = false
      this.rules.additionalWeightPrice[0].required = false
      this.rules.fixedPrice[0].required = false
      if (value === 2) {
        this.rules.firstWeightPrice[0].required = true
        this.rules.firstWeight[0].required = true
        this.rules.additionalWeight[0].required = true
        this.rules.additionalWeightPrice[0].required = true
      } else if (value === 3) {
        this.rules.fixedPrice[0].required = true
      }
    },
    pinkageChange(e) {
      const checked = e.target.checked
      this.form.isFreeShipping = checked ? 1 : 0
    },
    handleRateClick() {
      this.isDisabledRate = !this.isDisabledRate
      this.curRate = Number(this.curRate)
        ? this.curRate
        : this.form.exchangeRate
      this.form.exchangeRate = !this.isDisabledRate
        ? this.curRate
        : this.form.exchangeRate
    }
  }
}
</script>
<style lang="scss">
.commis-popover {
  padding: 0;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
</style>
<style lang="scss" scoped>
.set-price-tem-box {
  height: 69vh;
  overflow-y: auto;
  padding: 16px 25px;
}
.teplate-formula {
  background-color: #fdf6ec;
  color: #e6a23c;
  width: 100%;
  padding: 16px 32px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 16px;
  .info-circle-icon {
    margin-left: -20px;
    font-size: 16px;
    margin-right: 6px;
    vertical-align: sub;
  }
}
.form-radio-items + .form-radio-items {
  margin-top: 16px;
}
.price-tem-item {
  display: flex;
  line-height: 32px;
  box-sizing: border-box;
  > label {
    width: 100px;
    margin-right: 8px;
    line-height: 40px;
  }
  .item-content {
    flex: 1;
    width: 200px;
    display: inline-table;
  }
}
.price-tem-label {
  margin-left: 26px;
  width: 82px;
  line-height: 40px;
}
.form-item-label {
  width: 96px;
  margin-left: 4px;
  margin-right: 5px;
  text-align: left;
  display: inline-block;
}
.form-items {
  display: flex;
  .form-title {
    width: 150px;
    text-align: right;
    margin-right: 10px;
    font-size: 16px;
    line-height: 40px;
    font-weight: 600;
  }
  .form-content {
    line-height: 40px;
    flex: 1;
  }
}

.tooltip-question-icon {
  font-size: 16px;
  margin-left: 10px;
}
.divide-flex {
  flex: 1 1 0;
  text-align: center;
  margin: 0 8px;
  padding-top: 4px;
}

// 修改滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: inherit;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #f0f0f0;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
