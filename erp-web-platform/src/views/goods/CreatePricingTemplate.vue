<template>
  <div class="me-pa-2">
    <!-- 面包屑 -->
    <a-breadcrumb class="me-tabs-warp">
      <a-breadcrumb-item>
        <router-link to="./pricing-template" class="me-link-h">{{
          '定价模板'
        }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $route.query.title || '创建模板'
      }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="me-pricing-con">
      <a-form :form="form" layout="inline">
        <dl class="me-pricing-dl">
          <dt>基础信息</dt>
          <dd>
            <a-form-item label="模板名称">
              <a-input
                class="me-pricing-name"
                :maxLength="60"
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '必填!' }]
                  }
                ]"
            /></a-form-item>
          </dd>
          <dd>
            <a-form-item label="站点" class="me-mr-40">
              <a-select
                :disabled="!!$route.query.id"
                class="me-pricing-site me-w251"
                v-decorator="[
                  'site',
                  {
                    rules: [{ required: true, message: '必填!' }]
                  }
                ]"
                placeholder="请选择"
                @change="handleSelectSite"
              >
                <a-select-option
                  :value="item.key"
                  v-for="(item, index) in calcSite"
                  :key="index"
                >
                  {{ $t('goodsCollection.' + item.lang) }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-show="currSite.currency != 'CNY'"
              label="汇率"
              class="me-rate"
            >
              1CNY ≈
              <a-input
                class="me-w251"
                :suffix="currSite.currency"
                placeholder="不填写将默认系统自动换算"
                @change="changeRate"
                v-decorator="['exchangeRateB']"
                v-positiveNumber="{ fixedNum: 4, maxNum: 1000000, minNum: 0 }"
              />
            </a-form-item>
          </dd>
        </dl>
        <i class="me-line-s"></i>
        <dl class="me-pricing-dl">
          <dt>利润设置</dt>
          <dd>
            <a-form-item label="利润类型" class="me-mr-40">
              <a-select
                class="me-w251"
                v-decorator="[
                  'profitType',
                  {
                    rules: [{ required: true, message: '必填!' }]
                  }
                ]"
                placeholder="请选择"
              >
                <a-select-option :value="3">
                  售价利润率
                </a-select-option>
                <a-select-option :value="1">
                  成本利润率
                </a-select-option>
                <a-select-option :value="2">
                  固定利润率
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="form.getFieldValue('profitType') == 2"
              label="利润金额"
              key="profit"
            >
              <a-input
                class="me-profit-margin"
                :suffix="unit"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                v-decorator="[
                  'profit',
                  {
                    rules: [{ required: true, message: '必填!' }]
                  }
                ]"
              />
            </a-form-item>
            <a-form-item label="利润率" key="profitRate" v-else>
              <a-input
                class="me-profit-margin"
                suffix="%"
                v-positiveNumber="{ fixedNum: 2, maxNum: 99.99, minNum: 0 }"
                v-decorator="[
                  'profitRate',
                  {
                    rules: [{ required: true, message: '必填!' }]
                  }
                ]"
              />
            </a-form-item>
          </dd>
          <dd>
            <a-form-item label="折扣">
              <a-input
                class="me-w251"
                suffix="折"
                @change="changeDiscountRate"
                v-positiveNumber="{ fixedNum: 1, maxNum: 10 }"
                v-decorator="['discountRate']"
              />
            </a-form-item>
          </dd>
        </dl>
        <i class="me-line-s"></i>
        <dl class="me-pricing-dl me-minh589">
          <dt>
            <a-form-item
              label="货币单位"
              class="me-monetary-unit"
              v-show="currSite.currency != 'CNY'"
            >
              <a-select
                v-decorator="['currency', { initialValue: 'CNY' }]"
                @change="handleMonetaryUnit"
              >
                <a-select-option value="CNY">
                  CNY
                </a-select-option>
                <a-select-option :value="currSite.currency">
                  {{ currSite.currency }}
                </a-select-option>
              </a-select> </a-form-item
            >成本设置
          </dt>
          <dd class="me-freight-cost">
            <a-form-item label="运费成本(藏价)">
              <a-radio-group
                v-decorator="['freightType', { initialValue: 2 }]"
                class="me-calc-type"
                @change="calcTypeChange"
              >
                <a-radio :value="2">按照公式计算</a-radio>
                <div class="me-mt-2" v-if="formCalcType == 2">
                  <a-form-item label="首重价格">
                    <a-input
                      :suffix="unit"
                      v-positiveNumber="{
                        fixedNum: 2,
                        maxNum: 1000000,
                        minNum: 0
                      }"
                      v-decorator="[
                        'firstWeightPrice',
                        {
                          rules: [
                            {
                              required: true,
                              message: '必填!'
                            }
                          ]
                        }
                      ]"
                  /></a-form-item>

                  <a-form-item label="/" class="me-unLabel me-mr-55">
                    <a-input
                      suffix="KG"
                      v-positiveNumber="{
                        fixedNum: 2,
                        maxNum: 1000000,
                        minNum: 0
                      }"
                      v-decorator="[
                        'firstWeight',
                        {
                          rules: [
                            {
                              required: true,
                              message: '必填!'
                            }
                          ]
                        }
                      ]"
                    />
                  </a-form-item>
                  <a-form-item label="续重价格"
                    ><a-input
                      :suffix="unit"
                      v-positiveNumber="{
                        fixedNum: 2,
                        maxNum: 1000000,
                        minNum: 0
                      }"
                      v-decorator="[
                        'additionalWeightPrice',
                        {
                          rules: [
                            {
                              required: true,
                              message: '必填!'
                            }
                          ]
                        }
                      ]"
                  /></a-form-item>

                  <a-form-item label="/" class="me-unLabel"
                    ><a-input
                      suffix="KG"
                      v-positiveNumber="{
                        fixedNum: 2,
                        maxNum: 1000000,
                        minNum: 0
                      }"
                      v-decorator="[
                        'additionalWeight',
                        {
                          rules: [
                            {
                              required: true,
                              message: '必填!'
                            }
                          ]
                        }
                      ]"
                  /></a-form-item>
                </div>
                <div class="me-fixed-calc">
                  <a-radio :value="3">按统一运费计算</a-radio>
                  <div class="me-mt-2" v-if="formCalcType == 3">
                    <a-form-item label="统一运费">
                      <a-input
                        :suffix="unit"
                        v-positiveNumber="{
                          fixedNum: 2,
                          maxNum: 1000000,
                          minNum: 0
                        }"
                        v-decorator="[
                          'fixedPrice',
                          {
                            rules: [
                              {
                                required: true,
                                message: '必填!'
                              }
                            ]
                          }
                        ]"
                      />
                    </a-form-item>
                  </div>
                </div>
              </a-radio-group>
            </a-form-item>
          </dd>
          <i class="me-line-d"></i>
          <dd class="me-other-item">
            <a-form-item label="活动服务费率">
              <a-input
                suffix="%"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                v-decorator="['serviceRate']"
              />
            </a-form-item>
            <a-form-item class="me-ml25" label="平台佣金费率">
              <a-input
                suffix="%"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                v-decorator="['commissionRate']"
              />
            </a-form-item>
          </dd>
          <dd class="me-other-item">
            <a-form-item label="交易手续费率">
              <a-input
                suffix="%"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                v-decorator="['transactionFeeRate']"
              />
            </a-form-item>
            <a-form-item class="me-ml25" label="其他成本">
              <a-input
                :suffix="unit"
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                v-decorator="['otherCost']"
              />
            </a-form-item>
          </dd>
        </dl>
        <div class="me-btn">
          <a-button class="me-mr-2" size="large" @click="$router.go(-1)"
            >取消</a-button
          ><a-button type="primary" size="large" @click="handleSubmit"
            >保存</a-button
          >
        </div>
      </a-form>
      <div class="me-trial">
        <dl class="me-pricing-dl">
          <dt>试算一下左边设置的定价模板吧~</dt>
          <dd class="me-trial-formula">
            <p class="me-mt-3 me-mb-1">售价利润率公式定价</p>
            <span class="me-cff7"
              >定价（折前价）= [采购成本+运费（藏价）+其他成本] /
              [(1-利润率-手续费率)X折扣率]</span
            >
            <p class="me-mt-3 me-mb-1">成本利润率公式定价</p>
            <span class="me-cff7"
              >定价（折前价）= [采购成本 X（1+利润率）+运费（藏价）+其他成本] /
              [(1-手续费率)X折扣率]</span
            >
            <p class="me-mt-3 me-mb-1">固定润率公式定价</p>
            <span class="me-cff7"
              >定价（折前价）= [采购成本 + 利润 +运费（藏价）+其他成本]/
              [(1-手续费率)X折扣率]</span
            >
          </dd>
        </dl>
        <i class="me-line-s"></i>
        <dl class="me-pricing-dl">
          <dt>计算器</dt>
          <dd class="me-calculator">
            <div>
              <i class="me-status-error">*</i>
              <span class="ilabel">采购价：</span
              ><a-input
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                class="me-w170"
                v-model="trialPrice"
                suffix="CNY"
              />
            </div>
            <div>
              <i class="me-status-error">*</i
              ><span class="ilabel">产品重量：</span
              ><a-input
                v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
                class="me-w170"
                v-model="trialWeight"
                suffix="KG"
              />
            </div>
            <div class="me-pl-85">
              <a-button class="me-mr-2" @click="trialReset">重置</a-button
              ><a-button type="primary" @click="trialOk">计算</a-button>
            </div>
          </dd>
          <dt>计算结果</dt>
          <dd :class="{ 'me-cnsc': currSite.currency == 'CNY' }">
            <div class="me-calculation-results">
              折前售价-<span
                ><b>{{ priceBeforeDiscount }} {{ currSite.currency }}</b
                >{{ getCNY(priceBeforeDiscount) }} CNY</span
              >
            </div>
            <div class="me-calculation-results">
              折后售价<span
                ><b>{{ priceAfterDiscount }} {{ currSite.currency }}</b
                >{{ getCNY(priceAfterDiscount) }} CNY</span
              >
            </div>
            <div class="me-calculation-results">
              利润<span
                ><b>{{ priceProfit }} {{ currSite.currency }}</b
                >{{ getCNY(priceProfit) }} CNY</span
              >
            </div>
            <div class="me-calculation-results">
              成本<span
                ><b
                  >{{ Number(priceCost).toFixed(2) }} {{ currSite.currency }}</b
                >{{ getCNY(priceCost) }} CNY</span
              >
            </div>
            <ul class="me-calculation-results">
              <li>
                采购成本<span
                  ><b
                    >{{ Number((this.trialPrice * this.rate).toFixed(2)) }}
                    {{ currSite.currency }}</b
                  >{{ trialPrice || '0.00' }} CNY</span
                >
              </li>
              <li>
                运费<span
                  ><b>{{ priceFreight }} {{ currSite.currency }}</b
                  >{{ getCNY(priceFreight) }} CNY</span
                >
              </li>
              <li>
                活动服务费<span
                  ><b>{{ priceService }} {{ currSite.currency }}</b
                  >{{ getCNY(priceService) }} CNY</span
                >
              </li>
              <li>
                平台佣金<span
                  ><b>{{ priceCommission }} {{ currSite.currency }}</b
                  >{{ getCNY(priceCommission) }} CNY</span
                >
              </li>
              <li>
                交易手续费<span
                  ><b>{{ priceTransactionFee }} {{ currSite.currency }}</b
                  >{{ getCNY(priceTransactionFee) }} CNY</span
                >
              </li>
              <li>
                其他成本<span
                  ><b
                    >{{
                      (unit == 'CNY'
                        ? getOrigin(form.getFieldValue('otherCost'))
                        : form.getFieldValue('otherCost')) || 0
                    }}
                    {{ currSite.currency }}</b
                  >{{
                    unit == 'CNY'
                      ? form.getFieldValue('otherCost')
                      : getCNY(form.getFieldValue('otherCost')) || 0
                  }}
                  CNY</span
                >
              </li>
            </ul>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
// import { getMixinsOptions } from '@/util'
// import { mapState } from 'vuex'
import { positiveNumber } from '@/directive/number'
import { mcl, division, add, floatSub } from '@/util'
const CALC_SITE = [
  { key: 'CNSC', lang: 'cnsc', currency: 'CNY', langName: '全球店铺(CNSC)' },
  { key: 'SG', lang: 'xjp', currency: 'SGD', langName: '新加坡' },
  { key: 'PH', lang: 'flb', currency: 'PHP', langName: '菲律宾' },
  { key: 'MY', lang: 'mlxy', currency: 'MYR', langName: '马来西亚' },
  { key: 'ID', lang: 'ydnxy', currency: 'IDR', langName: '印度尼西亚' },
  { key: 'TH', lang: 'tg', currency: 'THB', langName: '泰国' },
  { key: 'VN', lang: 'yn', currency: 'VND', langName: '越南' },
  { key: 'BR', lang: 'bx', currency: 'BRL', langName: '巴西' },
  { key: 'TW', lang: 'tw', currency: 'TWD', langName: '台湾' },
  { key: 'MX', lang: 'mxg', currency: 'MXN', langName: '墨西哥' },
  { key: 'CL', lang: 'zl', currency: 'CLP', langName: '智利' },
  { key: 'CO', lang: 'glby', currency: 'COP', langName: '哥伦比亚' }
]
export default {
  data() {
    return {
      visible: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      unit: 'CNY',
      formCalcType: 2,
      calcSite: CALC_SITE,
      currSite: '',
      rate: 1,
      getRate: 1,
      trialWeight: '',
      trialPrice: '',
      priceBeforeDiscount: 0,
      priceAfterDiscount: 0,
      priceService: 0,
      priceCommission: 0,
      priceTransactionFee: 0,
      priceFreight: 0,
      priceCost: 0,
      priceProfit: 0
    }
  },
  directives: {
    positiveNumber
  },
  computed: {
    getCNY() {
      return function(originV) {
        return (originV / this.rate).toFixed(2)
      }
    },
    getOrigin() {
      return function(originV) {
        return (originV * this.rate).toFixed(2)
      }
    }
  },
  async created() {
    if (this.$route.query.id) {
      let { data } = await Goods.getPriductPriceTemplateDetails(
        this.$route.query.id
      )
      this.rate = data.exchangeRate
      this.formCalcType = data.freightType
      this.handleSelectSite(data.site)
      this.$nextTick(async () => {
        this.form.setFieldsValue(data)
        if (data.exchangeRate) {
          this.form.setFieldsValue({ exchangeRateB: data.exchangeRate })
        } else {
          this.currSite = this.calcSite.filter(
            (item) => item.key == data.site
          )[0]
          let res = await Basic.getCurrencyRate(this.currSite.currency)
          this.rate = res.data
        }
        if (data.currency == 'CNY') {
          this.unit = 'CNY'
        } else {
          this.currSite = this.calcSite.filter(
            (item) => item.key == data.site
          )[0]
          this.unit = this.currSite.currency
          this.form.setFieldsValue({ currency: this.currSite.currency })
        }
        if (data.freightType == 1) {
          this.form.setFieldsValue({ freightType: 2 })
          this.formCalcType = 2
        }
        setTimeout(() => {
          if (data.profitType == 2) {
            this.form.setFieldsValue({ profit: data.profit })
          }
        })
      })
    }
  },
  mounted() {},
  methods: {
    //修改汇率
    changeRate(e) {
      if (e.target.value == '') {
        this.rate = this.getRate
      } else {
        this.rate = e.target.value
      }
    },
    //获取汇率
    getCurrencyRate(isUpdated = false) {
      Basic.getCurrencyRate(this.currSite.currency).then((res) => {
        this.getRate = res.data
        if (this.form.getFieldValue('exchangeRateB')) {
          this.rate = Number(this.form.getFieldValue('exchangeRateB'))
        } else {
          this.rate = res.data
        }
        // if (isUpdated) {
        //   this.handleChange()
        // }
        if (this.trialWeight !== '' && this.trialPrice !== '') {
          this.trialOk()
        }
      })
    },
    //选择站点
    handleSelectSite(v) {
      this.currSite = this.calcSite.filter((item) => item.key == v)[0]
      this.unit = this.currSite.currency
      this.form.setFieldsValue({ currency: this.unit })
      this.getCurrencyRate()
    },
    //货币单位切换
    handleMonetaryUnit(v) {
      this.unit = v
      this.exchangeRateConv(v, this.form.getFieldsValue())
    },
    //利润率校验-所有的成本费率不能超过99.99%
    costRateVerification(params) {
      let flag = false
      let {
        profitType,
        profitRate,
        serviceRate,
        commissionRate,
        transactionFeeRate
      } = params
      let allRate =
        Number(serviceRate) +
        Number(commissionRate) +
        Number(transactionFeeRate)
      if (profitType == 3) {
        if ((allRate + Number(profitRate)).toFixed(2) > 99.99) {
          flag = true
        }
      } else {
        if (allRate.toFixed(2) > 99.99) {
          flag = true
        }
      }
      return flag
    },
    //汇率转换
    exchangeRateConv(unit, fValue, isSubmit) {
      console.log(unit, fValue, isSubmit, this.rate)
      let {
        firstWeightPrice,
        additionalWeightPrice,
        fixedPrice,
        otherCost,
        profit
      } = fValue
      if (unit == 'CNY') {
        firstWeightPrice = firstWeightPrice
          ? (firstWeightPrice / this.rate).toFixed(2)
          : firstWeightPrice
        additionalWeightPrice = additionalWeightPrice
          ? (additionalWeightPrice / this.rate).toFixed(2)
          : additionalWeightPrice
        fixedPrice = fixedPrice
          ? (fixedPrice / this.rate).toFixed(2)
          : fixedPrice
        otherCost = otherCost ? (otherCost / this.rate).toFixed(2) : otherCost
        profit = profit ? (profit / this.rate).toFixed(2) : profit
        this.form.setFieldsValue({
          firstWeightPrice,
          additionalWeightPrice,
          fixedPrice,
          otherCost,
          profit
        })
      } else {
        firstWeightPrice = firstWeightPrice
          ? (firstWeightPrice * this.rate).toFixed(2)
          : firstWeightPrice
        additionalWeightPrice = additionalWeightPrice
          ? (additionalWeightPrice * this.rate).toFixed(2)
          : additionalWeightPrice
        fixedPrice = fixedPrice
          ? (fixedPrice * this.rate).toFixed(2)
          : fixedPrice
        otherCost = otherCost ? (otherCost * this.rate).toFixed(2) : otherCost
        profit = profit ? (profit * this.rate).toFixed(2) : profit
        if (isSubmit) {
          fValue.firstWeightPrice = firstWeightPrice
          fValue.additionalWeightPrice = additionalWeightPrice
          fValue.fixedPrice = fixedPrice
          fValue.otherCost = otherCost
          fValue.profit = profit

          return fValue
        } else {
          this.form.setFieldsValue({
            firstWeightPrice,
            additionalWeightPrice,
            fixedPrice,
            otherCost,
            profit
          })
        }
      }
    },
    //成本设置切换计算类型
    calcTypeChange(e) {
      this.formCalcType = e.target.value
    },
    //保存
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = cloneDeep(values)
          if (this.costRateVerification(params)) {
            return this.$message.warning('所有的成本费率不能超过99.99%！')
          }
          if (this.zeroVerification(params)) {
            return this.$message.warning(
              '汇率，折扣，首重，续重的值必须大于0！'
            )
          }

          if (params.exchangeRateB) {
            params.exchangeRate = params.exchangeRateB
          }
          params.mantissaType = 4
          // if (this.unit == 'CNY') {
          //   this.exchangeRateConv('', params, true)
          // }
          if (this.$route.query.id) {
            //编辑
            params.id = this.$route.query.id
            Goods.editPriductPriceTemplate(params).then((res) => {
              this.$message.success('操作成功！')
              this.$router.go(-1)
            })
          } else {
            //新增
            Goods.addPriductPriceTemplate(params).then((res) => {
              this.$message.success('操作成功！')
              this.$router.go(-1)
            })
          }
        }
      })
    },
    //确定试算
    trialOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.trialWeight !== '' && this.trialPrice !== '') {
            if (this.costRateVerification(values)) {
              return this.$message.warning('所有的成本费率不能超过99.99%！')
            }
            if (this.zeroVerification(values)) {
              return this.$message.warning(
                '汇率，折扣，首重，续重的值必须大于0！'
              )
            }
            this.trialFn(values)
          } else {
            this.$message.warning('请先填写采购价，产品重量！')
          }
        }
      })
    },
    //试算函数
    trialFn(values) {
      let finalPrice = 0
      let freight = 0
      let trialWeight = Number(this.trialWeight)
      let trialPrice = Number((this.trialPrice * this.rate).toFixed(2))
      let params = cloneDeep(values)
      if (this.unit == 'CNY') {
        this.exchangeRateConv('', params, true)
      }
      params.discountRate = params.discountRate ? params.discountRate : 10
      params.serviceRate = params.serviceRate ? params.serviceRate : 0
      params.commissionRate = params.commissionRate ? params.commissionRate : 0
      params.transactionFeeRate = params.transactionFeeRate
        ? params.transactionFeeRate
        : 0
      params.otherCost = params.otherCost ? params.otherCost : 0
      let handlingRate =
        (Number(params.serviceRate) +
          Number(params.commissionRate) +
          Number(params.transactionFeeRate)) /
        100
      console.log(params)

      if (this.formCalcType == 3) {
        // 按照统一运费计算
        freight = Number(params.fixedPrice)
      } else {
        // 按照公式计算 trialWeight产品重量,firstWeight首重重量
        if (trialWeight > Number(params.firstWeight)) {
          // overweight 超重质量
          let overweight = floatSub(trialWeight, Number(params.firstWeight))

          // additionalWeightPrice续重价格，additionalWeight续重质量
          // freight = mcl(
          //   parseInt(division(overweight, Number(params.additionalWeight))),
          //   Number(params.additionalWeightPrice)
          // )
          freight = mcl(
            floatSub(trialWeight, Number(params.firstWeight)),
            division(
              Number(params.additionalWeightPrice),
              Number(params.additionalWeight)
            )
          )
          if (
            /[.]/.test(division(overweight, Number(params.additionalWeight)))
          ) {
            // freight = add(freight, Number(params.additionalWeightPrice))
          }
          // console.log(
          //   freight,
          //   Number(params.firstWeightPrice),
          //   overweight,
          //   Number(params.additionalWeight),
          //   division(overweight, Number(params.additionalWeight))
          // )
          freight = add(freight, Number(params.firstWeightPrice))
        } else {
          freight = Number(params.firstWeightPrice)
        }
      }
      // trialPrice采购价，freight运费，otherCost其他成本，profitRate利润率，handlingRate处理率？,discountRate折扣
      if (params.profitType == 3) {
        finalPrice =
          (trialPrice + freight + Number(params.otherCost)) /
          ((1 - params.profitRate / 100 - handlingRate) *
            (params.discountRate / 10))
      } else if (params.profitType == 1) {
        finalPrice =
          (trialPrice * (1 + params.profitRate / 100) +
            freight +
            Number(params.otherCost)) /
          ((1 - handlingRate) * (params.discountRate / 10))
      } else {
        finalPrice =
          (trialPrice +
            Number(params.profit) +
            freight +
            Number(params.otherCost)) /
          ((1 - handlingRate) * (params.discountRate / 10))
      }
      //折前售价
      this.priceBeforeDiscount = finalPrice.toFixed(2)
      //折后售价
      this.priceAfterDiscount = (
        (this.priceBeforeDiscount * params.discountRate) /
        10
      ).toFixed(2)
      //利润
      if (params.profitType == 1) {
        this.priceProfit = ((trialPrice * params.profitRate) / 100).toFixed(2)
      } else if (params.profitType == 2) {
        this.priceProfit = Number(params.profit)
      } else {
        this.priceProfit = (
          ((this.priceBeforeDiscount * params.profitRate) / 100) *
          (params.discountRate / 10)
        ).toFixed(2)
      }
      //活动服务费
      this.priceService = (
        (this.priceAfterDiscount * params.serviceRate) /
        100
      ).toFixed(2)
      //平台佣金费
      this.priceCommission = (
        (this.priceAfterDiscount * params.commissionRate) /
        100
      ).toFixed(2)
      //交易手续费
      this.priceTransactionFee = (
        (this.priceAfterDiscount * params.transactionFeeRate) /
        100
      ).toFixed(2)
      //运费
      this.priceFreight = freight
      //成本
      this.priceCost =
        trialPrice +
        Number(freight) +
        Number(this.priceService) +
        Number(this.priceCommission) +
        Number(this.priceTransactionFee) +
        Number(params.otherCost)
    },
    //重置试算
    trialReset() {
      this.trialWeight = ''
      this.trialPrice = ''
    },
    changeDiscountRate(e) {
      if (e.target.value == '') {
        this.form.setFieldsValue({ discountRate: '' })
      }
      // console.log(e)
    },
    //输入0校验
    zeroVerification(params) {
      let flag = false
      let {
        exchangeRateB,
        discountRate,
        firstWeight,
        additionalWeight
      } = params
      console.log(
        exchangeRateB,
        discountRate,
        Number(exchangeRateB),
        Number(discountRate)
      )
      if (
        (!!exchangeRateB && Number(exchangeRateB) <= 0) ||
        (!!discountRate && Number(discountRate) <= 0) ||
        Number(firstWeight) <= 0 ||
        Number(additionalWeight) <= 0
      ) {
        flag = true
      }
      return flag
    }
  }
}
</script>
<style lang="scss" scoped>
//模板信息
.me-pricing-con {
  margin-top: 10px;
  display: flex;
  ::v-deep .ant-form-inline .ant-form-item {
    // margin-right: 0;
    label {
      display: inline-block;
      min-width: 88px;
      text-align: left;
    }
  }
  form {
    flex-grow: 1;
    margin-right: 10px;
    background: #fff;
    dd {
      margin-top: 10px;
      label {
        display: inline-block;
      }
    }
  }
}
.me-freight-cost {
  margin-top: -10px;
  ::v-deep > .ant-form-item {
    > div.ant-form-item-control-wrapper {
      width: 100%;
      margin-top: 10px;
    }
  }

  ::v-deep .ant-form-item {
    margin-right: 0;
    input {
      width: 113px;
    }
  }
  ::v-deep .me-unLabel.ant-form-item {
    label {
      min-width: auto !important;
    }
  }
  .me-fixed-calc {
    ::v-deep .ant-form-item {
      input {
        width: 251px;
      }
    }
  }
}
.me-pricing-dl {
  padding: 20px;
  background: #fff;
  dt {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    position: relative;
  }
}
.me-calc-type {
  display: block;
  width: 100%;
}
.me-pricing-name {
  width: 645px;
}
.me-profit-margin {
  width: 266px;
}
.me-unLabel {
  ::v-deep .ant-form-item-required {
    padding: 0 9px;
    &::before,
    &::after {
      display: none;
    }
  }
}

.me-fixed-calc {
  margin: 25px 0 20px;
}
.me-other-item {
  margin-top: 20px !important;
  margin-bottom: -13px;
  ::v-deep .ant-form-item {
    label {
      width: 105px !important;
    }
    input {
      width: 234px;
    }
  }
}
.me-monetary-unit {
  position: absolute;
  top: -10px;
  right: 0px;
  font-weight: normal;
}
.me-line-d {
  display: block;
  width: 100%;
  height: 0;
  border-top: 1px dashed #ebebeb;
}
.me-line-s {
  display: block;
  height: 0;
  margin: -1px 20px 0;
  border-top: 1px solid #ebebeb;
}
.me-btn {
  border-top: 1px solid #ebebeb;
  padding: 12px;
  text-align: right;
}
.me-w251 {
  width: 251px;
}
.me-mr-40 {
  margin-right: 40px !important;
}
.me-mr-55 {
  margin-right: 55px !important;
}
.me-rate {
  ::v-deep .ant-form-item-label {
    label {
      min-width: 50px !important;
    }
  }
}
//试算
.me-pr0 {
  padding-right: 0px;
}
.me-trial {
  width: 300px;
  min-width: 300px;
}
.me-trial-formula {
  font-size: 12px;
}
.me-calculator {
  div {
    margin-bottom: 20px;
    .ilabel {
      display: inline-block;
      width: 80px;
    }
  }
}
.me-pl-85 {
  padding-left: 85px;
}
.me-ml25 {
  margin-left: 25px;
}
.me-calculation-results {
  overflow: hidden;
  border-bottom: 1px dashed #ccc;
  position: relative;
  padding: 15px 10px 15px 0;
  font-size: 16px;
  span {
    position: absolute;
    right: 0;
    top: 12px;
    font-size: 12px;
    color: #a8a8b3;
    text-align: right;
    b {
      display: block;
      font-size: 14px;
      color: #ff5748; // 标红色
      line-height: 100%;
    }
  }
  li {
    position: relative;
    font-size: 14px;
    padding-bottom: 12px;
    padding-left: 10px;
    span {
      top: -4px;
      line-height: 100%;
      color: #a8a8b3;
      b {
        color: #303133;
      }
    }
  }
}
ul.me-calculation-results {
  padding-top: 20px;
  padding-bottom: 5px;
  padding-right: 0;
}
.me-cff7 {
  color: #ff720d;
}
.me-w170 {
  width: 170px;
}
// .me-minh589 {
//   min-height: 589px;
// }
.me-cnsc {
  .me-calculation-results {
    span {
      font-size: 14px;
      color: #ff5748;
      font-weight: bold;
      top: 17px;
    }
    li span {
      top: 3px;
    }
    b {
      display: none;
    }
  }
}
.me-tabs-warp {
  padding: 5px 0;
}
</style>
