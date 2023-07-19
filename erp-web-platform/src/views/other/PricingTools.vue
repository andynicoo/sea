<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="定价工具"> </a-page-header>
    <div class="me-card pricing-tools">
      <div>
        <div class="teplate-formula">
          <strong>
            <a-icon type="info-circle" class="info-circle-icon" />
            {{ $t('common.message') }}
          </strong>
          <p>
            {{ $t('goodsCollection.setPriceTem14') }}
          </p>
          <p class="me-handler-red">
            *{{ $t('goodsCollection.setPriceTem15') }}
          </p>
          <p class="me-handler-red">
            *{{ $t('goodsCollection.setPriceTem16') }}
          </p>
        </div>

        <a-form-model
          class="set-price-form"
          :model="form"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-col :span="24" class="form-col-items me-mb-3">
            <a-col :span="12" class="price-tem-item">
              <a-col :span="4" class="item-label">{{ $t('edit.site') }}</a-col>
              <a-select
                v-model="form.site"
                style="width: 190px"
                @change="handleSelect"
              >
                <a-select-option
                  :value="item.key"
                  v-for="(item, index) in calcSite"
                  :key="index"
                >
                  {{ $t('goodsCollection.' + item.lang) }}
                </a-select-option>
              </a-select>
            </a-col>
            <template v-if="currency !== 'CNSC'">
              <a-col :span="12" class="price-tem-item">
                <a-col :span="3" class="item-label">
                  {{ $t('goodsCollection.setPriceTem38') }}
                </a-col>
                <a-col :span="6" class="item-label">1RMB ≈ </a-col>
                <a-input
                  @change="handleChange"
                  class="me-suffix-price-input"
                  v-model="form.exchangeRate"
                  v-positiveNumber="{ fixedNum: 4 }"
                  :suffix="currency"
                />
              </a-col>
            </template>
          </a-col>
          <div class="form-title me-mb-3 me-mt-3">
            {{ $t('goodsCollection.setPriceTem35') }}
            <span class="me-handler-red">
              *{{ $t('goodsCollection.setPriceTem36') }}
            </span>
          </div>
          <a-col :span="24">
            <a-col :span="4">{{ $t('goodsCollection.setPriceTem39') }}</a-col>
            <a-col :span="12" class="me-mb-3">
              <a-input
                @change="handleChange"
                class="me-suffix-price-input"
                style="max-width: 200px"
                v-model="form.discountRate"
                v-positiveNumber="{ maxNum: 100, minNum: 1, isInteger: 1 }"
                suffix="%"
              />
            </a-col>
          </a-col>
          <a-radio-group v-model="form.profitType" @change="handleChange">
            <a-col :span="24" class="form-col-items">
              <a-radio :value="1">
                {{ $t('goodsCollection.pricingTools1') }}
                <a-input
                  :disabled="form.profitType !== 1"
                  @change="handleChange"
                  class="me-suffix-price-input"
                  style="max-width: 200px"
                  v-model="form.profitRate"
                  v-positiveNumber="{ maxNum: 99.99, minNum: 0.01 }"
                  suffix="%"
                />
              </a-radio>
            </a-col>
            <a-col :span="24" class="form-col-items">
              <a-radio :value="2">
                {{ $t('goodsCollection.pricingTools2') }}
                <a-input
                  :disabled="form.profitType !== 2"
                  class="me-suffix-price-input"
                  @change="handleChange"
                  style="max-width: 200px"
                  v-model="form.profit"
                  v-positiveNumber="{ fixedNum: 2 }"
                  suffix="RMB"
                />
              </a-radio>
            </a-col>
            <a-col :span="12" class="form-col-items">
              <a-radio :value="3">
                {{ $t('goodsCollection.pricingTools3') }}
                <a-input
                  :disabled="form.profitType !== 3"
                  class="me-suffix-price-input"
                  @change="handleChange"
                  style="max-width: 200px"
                  v-model="form.listPriceLocal"
                  v-positiveNumber="{ fixedNum: 2 }"
                  :suffix="currency === 'CNSC' ? 'RMB' : currency"
                />
              </a-radio>
            </a-col>
          </a-radio-group>

          <template v-if="currency !== 'CNSC'">
            <div class="form-title">
              {{ $t('goodsCollection.setPriceTem17') }}
            </div>
            <a-col :span="24" class="me-mb-3">
              <a-col :span="4">
                {{ $t('goodsCollection.autoPublishSet19') }}
              </a-col>
              <a-input
                class="me-suffix-price-input"
                style="max-width: 200px"
                @change="handleChange"
                v-model="form.weight"
                v-positiveNumber="{ fixedNum: 2 }"
                suffix="KG"
              />
            </a-col>
            <a-radio-group v-model="form.freightType" @change="handleChange">
              <a-col :span="24" class="form-col-items">
                <a-radio :value="1">
                  {{ $t('goodsCollection.setPriceTem18') }}
                  <span class="me-handler-red">
                    *{{ $t('goodsCollection.setPriceTem19') }}
                  </span>
                </a-radio>
              </a-col>
              <a-col :span="24" class="form-col-items">
                <a-radio :value="2">
                  {{ $t('goodsCollection.setPriceTem20') }}
                  <span class="me-handler-red">
                    *{{ $t('goodsCollection.setPriceTem21') }}
                  </span>
                </a-radio>
                <a-tooltip>
                  <template slot="title">
                    {{ $t('goodsCollection.setPriceTem22') }}
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              </a-col>
              <a-col :span="24" class="form-col-items">
                <a-col :span="12" class="price-tem-item">
                  <span class="form-item-label me-w100">
                    {{ $t('goodsCollection.setPriceTem23') }}
                  </span>
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-suffix-price-input me-w120 suffix-pr40"
                    @change="handleChange"
                    :placeholder="$t('goodsCollection.setPriceTem23')"
                    v-positiveNumber="{ fixedNum: 2 }"
                    v-model="form.firstWeightPrice"
                    suffix="RMB"
                  />
                  <span class="divide-flex">/</span>
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-suffix-price-input me-w120"
                    @change="handleChange"
                    v-model="form.firstWeight"
                    style="border-left: 0"
                    :placeholder="$t('goodsCollection.setPriceTem24')"
                    suffix="KG"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                </a-col>
                <a-col :span="12" class="price-tem-item">
                  <span class="form-item-label me-w100">
                    {{ $t('goodsCollection.setPriceTem25') }}
                  </span>
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-suffix-price-input me-w120 suffix-pr40"
                    v-model="form.additionalWeightPrice"
                    @change="handleChange"
                    :placeholder="$t('goodsCollection.setPriceTem25')"
                    suffix="RMB"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                  <span class="divide-flex">/</span>
                  <a-input
                    :disabled="form.freightType !== 2"
                    class="me-suffix-price-input me-w120"
                    @change="handleChange"
                    v-model="form.additionalWeight"
                    :placeholder="$t('goodsCollection.setPriceTem59')"
                    suffix="KG"
                    v-positiveNumber="{ fixedNum: 2 }"
                  />
                </a-col>
              </a-col>
              <a-col :span="12" class="form-col-items price-tem-item">
                <a-radio :value="3">
                  {{ $t('goodsCollection.setPriceTem26') }}
                </a-radio>
                <a-input
                  :disabled="form.freightType !== 3"
                  @change="handleChange"
                  class="me-suffix-price-input item-content suffix-pr40"
                  v-model="form.fixedPrice"
                  v-positiveNumber="{ fixedNum: 2 }"
                  suffix="RMB"
                />
              </a-col>
            </a-radio-group>
          </template>
          <div class="form-title">
            {{ $t('goodsCollection.pricingTools4') }}
          </div>
          <a-form-model-item :wrapper-col="{ span: 24 }">
            <a-col :span="12" class="price-tem-item">
              <span class="form-item-label">
                {{ $t('goodsCollection.pricingTools4') }}
              </span>
              <a-input
                class="me-suffix-price-input item-content suffix-pr40"
                @change="handleChange"
                v-model="form.purchaseCost"
                v-positiveNumber="{ fixedNum: 2 }"
                suffix="RMB"
              />
            </a-col>
          </a-form-model-item>

          <div class="form-title">
            {{ $t('goodsCollection.setPriceTem27') }}
          </div>
          <a-form-model-item :wrapper-col="{ span: 24 }">
            <a-col :span="12" class="price-tem-item">
              <span class="form-item-label">
                {{ $t('goodsCollection.setPriceTem28') }}
              </span>
              <a-input
                class="me-suffix-price-input item-content suffix-pr40"
                @change="handleChange"
                v-model="form.otherCost"
                v-positiveNumber="{ fixedNum: 2 }"
                suffix="RMB"
              />
            </a-col>
            <span class="me-ml-2">
              *{{ $t('goodsCollection.setPriceTem29') }}
            </span>
          </a-form-model-item>

          <template v-if="currency !== 'CNSC'">
            <div class="form-title">
              {{ $t('goodsCollection.setPriceTem30') }}
            </div>
            <a-form-model-item
              :wrapper-col="{ span: 24 }"
              class="form-col-items"
            >
              <a-col :span="12" class="price-tem-item">
                <span class="form-item-label"
                  >{{ $t('goodsCollection.setPriceTem31') }}
                  <a-tooltip>
                    <template slot="title">
                      {{ $t('goodsCollection.setPriceTem32') }}
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <a-input
                  class="me-suffix-price-input item-content"
                  v-model="form.commissionRate"
                  v-positiveNumber="{ maxNum: 99, minNum: 0, isInteger: 1 }"
                  suffix="%"
                  @change="handleChange"
                />
              </a-col>
              <a-col :span="12" class="price-tem-item">
                <span class="form-item-label">
                  {{ $t('goodsCollection.setPriceTem33') }}
                  <a-tooltip>
                    <template slot="title">
                      {{ $t('goodsCollection.setPriceTem34') }}
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <a-input
                  class="me-suffix-price-input item-content"
                  @change="handleChange"
                  v-model="form.transactionFeeRate"
                  v-positiveNumber="{ maxNum: 99, minNum: 0, isInteger: 1 }"
                  suffix="%"
                />
              </a-col>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 24 }">
              <a-col :span="12" class="price-tem-item">
                <span class="form-item-label">
                  {{ $t('goodsCollection.setPriceTem53') }}
                </span>
                <a-input
                  @change="handleChange"
                  class="me-suffix-price-input item-content"
                  v-model="form.serviceRate"
                  v-positiveNumber="{ maxNum: 100, isInteger: 1 }"
                  suffix="%"
                />
              </a-col>
            </a-form-model-item>
          </template>
        </a-form-model>
      </div>

      <!-- 计算结果 start -->
      <div class="pricing-result-box">
        <h3>{{ $t('goodsCollection.pricingTools5') }}</h3>

        <!-- 折前售价 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <h5 class="me-handler-red">
              {{ $t('goodsCollection.pricingTools6') }}
            </h5>
            <div>
              <p class="fw-bold me-handler-red">
                {{ resultCNSCList.originalPrice }} RMB
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <h5 class="me-handler-red">
              {{ $t('goodsCollection.pricingTools6') }}
            </h5>
            <div>
              <p class="fw-bold me-handler-red">
                {{ resultList.originalPriceLocal }} {{ currency }}
              </p>
              <p class="tfee-rmb">{{ resultList.originalPriceCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 折后售价 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <h5>{{ $t('goodsCollection.pricingTools7') }}</h5>
            <div>
              <p class="fw-bold">{{ resultCNSCList.price }} RMB</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <h5>{{ $t('goodsCollection.pricingTools7') }}</h5>
            <div>
              <p class="fw-bold">
                {{ resultList.listPriceLocal }} {{ currency }}
              </p>
              <p class="tfee-rmb">{{ resultList.listPriceCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 成本 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <h5>{{ $t('goodsCollection.pricingTools8') }}</h5>
            <div>
              <p class="fw-bold">{{ resultCNSCList.cost }} RMB</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <h5>{{ $t('goodsCollection.pricingTools8') }}</h5>
            <div>
              <p class="fw-bold">
                {{ resultList.allCostLocal }} {{ currency }}
              </p>
              <p class="tfee-rmb">{{ resultList.allCostCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 运费 start -->
        <template v-if="currency !== 'CNSC'">
          <div class="result-items">
            <!-- 卖家承担海外运费 -->
            <div class="result-item">
              <div class="items-title">
                {{ $t('goodsCollection.pricingTools9') }}
              </div>
              <div>
                <p>{{ resultList.sellerFreightLocal }} {{ currency }}</p>
                <p class="tfee-rmb">{{ resultList.sellerFreightCNY }} RMB</p>
              </div>
            </div>
            <!-- 海外总运费 -->
            <div class="result-item">
              <div class="items-title me-mr-4">
                {{ $t('goodsCollection.pricingTools10') }}
              </div>
              <div>
                <p>{{ resultList.allFreightLocal }} {{ currency }}</p>
                <p class="tfee-rmb">{{ resultList.allFreightCNY }} RMB</p>
              </div>
            </div>
          </div>
        </template>
        <!-- 运费 end -->

        <!-- 采购成本 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools4') }}
            </div>
            <div>
              <p>{{ resultCNSCList.purchaseCost }} RMB</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools4') }}
            </div>
            <div>
              <p>{{ resultList.purchaseCostLocal }} {{ currency }}</p>
              <p class="tfee-rmb">{{ resultList.purchaseCostCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 其他成本 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools11') }}
            </div>
            <div>
              <p>{{ resultCNSCList.otherCost }} RMB</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools11') }}
            </div>
            <div>
              <p>{{ resultList.otherCostLocal }} {{ currency }}</p>
              <p class="tfee-rmb">{{ resultList.otherCostCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 平台佣金费用 -->
        <template v-if="currency !== 'CNSC'">
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools12') }} <br />
              Commission Fee
            </div>
            <div>
              <p>{{ resultList.commissionLocal }} {{ currency }}</p>
              <p class="tfee-rmb">{{ resultList.commissionCNY }} RMB</p>
            </div>
          </div>

          <!-- 活动服务费 -->
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools13') }} <br />Service Fee
            </div>
            <div>
              <p>{{ resultList.serviceLocal }} {{ currency }}</p>
              <p class="tfee-rmb">{{ resultList.serviceCNY }} RMB</p>
            </div>
          </div>

          <!-- 交易手续费 -->
          <div class="result-item">
            <div class="items-title">
              {{ $t('goodsCollection.pricingTools14') }} <br />Transaction Fee
            </div>
            <div>
              <p>{{ resultList.transactionFeeLocal }} {{ currency }}</p>
              <p class="tfee-rmb">{{ resultList.transactionFeeCNY }} RMB</p>
            </div>
          </div>
        </template>

        <!-- 利润 -->
        <template v-if="currency === 'CNSC'">
          <div class="result-item">
            <h5 class="me-handler-red">
              {{ $t('goodsCollection.pricingTools15') }}
              <span class="me-ml-2">{{ resultCNSCList.profitRate }}%</span>
            </h5>
            <div>
              <p class="fw-bold me-handler-red">
                {{ resultCNSCList.profit }} RMB
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="result-item">
            <h5 class="me-handler-red">
              {{ $t('goodsCollection.pricingTools15') }}
              <span class="me-ml-2">{{ resultList.profitRate }}%</span>
            </h5>
            <div>
              <p class="fw-bold me-handler-red">
                {{ resultList.profitLocal }} {{ currency }}
              </p>
              <p class="tfee-rmb">{{ resultList.profitCNY }} RMB</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { add } from '@/util'
import { positiveNumber } from '@/directive/number'
import Basic from '@/api/basic'
import { debounce } from 'lodash'

export const CALC_SITE = [
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
  { key: 'CO', lang: 'glby', currency: 'COP', langName: '哥伦比亚' },
  { key: 'CNSC', lang: 'cnsc', currency: 'CNSC', langName: '全球店铺(CNSC)' }
]

export default {
  data() {
    return {
      form: {
        additionalWeight: 0, // 续重
        additionalWeightPrice: 0, // 续重价格
        commissionRate: 0, // 平台佣金率
        discountRate: 100, //  折扣率
        exchangeRate: null, //  汇率
        firstWeight: 0, //  首重
        firstWeightPrice: 0, //  首重价格
        fixedPrice: 0, //  统一运费
        freightType: 1, //  运费类型  1、跨境店；2、本土店；3、统一运费
        profitType: 1,
        otherCost: 0, //  其他成本
        profit: null, //  利润
        profitRate: 0, //  利润率
        listPriceLocal: null, // 定价
        serviceRate: 0, //  活动服务费率
        site: 'MY', //  站点
        purchaseCost: 0, // 采购成本
        transactionFeeRate: 0, //  交易手续费率
        weight: 0 // 包裹重量
      },
      calcSite: CALC_SITE,
      currency: 'MYR',
      resultList: {
        allFreightCNY: 0, //海外总运费(人民币)
        allFreightLocal: 0, //海外总运费(站点)
        commissionCNY: 0, //平台佣金费用(人民币)
        commissionLocal: 0, //平台佣金费用(站点)
        listPriceCNY: 0, //定价（人民币）
        listPriceLocal: 0, //定价（站点）
        originalPriceCNY: 0, //折前价（人民币）
        originalPriceLocal: 0, //折前价（站点）
        otherCostCNY: 0, //其他成本(人民币)
        otherCostLocal: 0, //其他成本(站点)
        profitCNY: 0, //利润(人民币)
        profitLocal: 0, //利润(站点)
        profitRate: 0, //利润率
        allCostLocal: 0, //成本(站点)
        purchaseCostCNY: 0, //采购成本(人民币)
        purchaseCostLocal: 0, //采购成本(站点)
        sellerFreightCNY: 0, //海外运费(卖家承担_人民币)
        sellerFreightLocal: 0, //海外运费(卖家承担_站点)
        serviceCNY: 0, //活动服务费(人民币)
        serviceLocal: 0, //活动服务费(站点)
        transactionFeeCNY: 0, //交易手续费(人民币)
        transactionFeeLocal: 0 //交易手续费(站点)
      },
      resultCNSCList: {
        originalPrice: 0, // 折前售价
        price: 0, // 折后售价
        cost: 0, // 成本
        purchaseCost: 0, // 采购成本
        otherCost: 0, // 其他成本
        profit: 0, // 利润
        profitRate: 0 // 利润率
      }
    }
  },
  directives: {
    positiveNumber
  },
  mounted() {
    this.getCurrencyRate()
    this.debounceHandlerChange = debounce(this.onHandleChange, 500)
    this.debounceHandlerCNSCChange = debounce(this.onHandleCNSCChange, 500)
  },
  methods: {
    getCurrencyRate(isUpdated = false) {
      Basic.getCurrencyRate(this.currency).then((res) => {
        this.form.exchangeRate = res.data
        if (isUpdated) {
          this.handleChange()
        }
      })
    },
    handleSelect(event) {
      const obj = this.calcSite.filter((item) => item.key === event)[0]
      this.currency = obj.currency
      if (event === 'CNSC') return
      this.getCurrencyRate(true)
    },
    handleChange() {
      if (this.$data.currency === 'CNSC') {
        return this.debounceHandlerCNSCChange()
      }
      this.debounceHandlerChange()
    },
    onHandleCNSCChange() {
      let {
        purchaseCost,
        otherCost,
        discountRate,
        profitRate,
        profit,
        listPriceLocal,
        profitType
      } = this.form
      purchaseCost = Number(purchaseCost) /*采购陈本*/
      otherCost = Number(otherCost) /*其他成本*/
      discountRate = Number(discountRate) /*折扣率*/
      profitRate = Number(profitRate) /*根据利润率计算售价、利润*/
      profit = Number(profit) /*根据利润计算售价、利润率*/
      listPriceLocal = Number(listPriceLocal) /*根据售价计算利润、利润率*/
      profitType = Number(profitType) /*目标利润率类型*/

      // 折后售价 =（采购成本+其他成本）/（1-利润率）X 折扣率

      const cb = purchaseCost + otherCost

      switch (profitType) {
        case 1:
          profitRate = profitRate / 100
          break
        case 2:
          profitRate = profit / (profit + cb)
          break
        case 3:
          profit = listPriceLocal - cb
          profitRate = profit / (profit + cb)
          break
        default:
          break
      }

      if (!(0 < profitRate && profitRate < 1)) return

      console.log(`profitRate: ${profitRate}`)

      const pc = cb / (1 - profitRate)
      const dpc = pc / (discountRate / 100)

      const tf = (value) => Number(value).toFixed(2)

      this.$set(this.resultCNSCList, 'originalPrice', tf(dpc)) // 折前售价
      this.$set(this.resultCNSCList, 'price', tf(pc)) // 折后售价
      this.$set(this.resultCNSCList, 'profit', tf(pc - cb)) // 利润
      this.$set(this.resultCNSCList, 'profitRate', tf(profitRate * 100)) // 利润率
      this.$set(this.resultCNSCList, 'cost', tf(cb)) // 成本
      this.$set(this.resultCNSCList, 'purchaseCost', tf(purchaseCost)) // 采购成本
      this.$set(this.resultCNSCList, 'otherCost', tf(otherCost)) // 其他成本
    },
    onHandleChange() {
      let params = Object.assign({}, this.form)
      // profitType: 1, // 计划利润类型    1、利润率计算profitRate；2、利润profit；3、售价listPriceLocal
      params.profitRate = null
      params.profit = null
      params.listPriceLocal = null
      switch (params.profitType) {
        //链接采集
        case 1:
          params.profitRate = this.form.profitRate
          break
        case 2:
          params.profit = this.form.profit
          break
        case 3:
          params.listPriceLocal = this.form.listPriceLocal
          break
        default:
          break
      }
      // 取整再请求
      for (let key in params) {
        if (!['freightType', 'site', 'profitType'].includes(key)) {
          params[key] = Number(params[key])
        }
      }
      console.log(params, 'params')
      Basic.calcPriceTemplate(params).then((res) => {
        const data = res.data
        this.resultList = data
        this.resultList.costCNY = add(data.purchaseCostCNY, data.otherCostCNY)
        this.resultList.costLocal = add(
          data.purchaseCostLocal,
          data.otherCostLocal
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pricing-tools {
  display: flex;
  justify-content: space-around;
  > div:first-child {
    background: #f9f9f9;
    padding: 20px;
    width: 60%;
  }
  .pricing-result-box {
    width: 30%;
  }
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
.price-tem-item {
  display: flex;
  line-height: 32px;
  box-sizing: border-box;
  > label {
    width: 100px;
    margin-right: 8px;
    line-height: 32px;
  }
  .item-content {
    flex: 1;
    max-width: 200px;
    display: inline-table;
  }
}
.form-col-items + .form-col-items {
  margin-top: 10px;
}
.form-item-label {
  width: 120px;
  margin-right: 8px;
  text-align: right;
  display: inline-block;
}
.set-price-form {
  .form-title {
    padding: 10px 0;
    font-size: 1.2em;
    .me-handler-red {
      font-size: 12px;
    }
  }
}
.tooltip-question-icon {
  font-size: 16px;
  margin-left: 10px;
}
.divide-flex {
  flex: 1 1 0;
  text-align: center;
}

.pricing-result-box {
  padding: 20px;
  > h3 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .result-items {
    padding: 15px 0;
    background-color: rgba(242, 242, 242, 1);
    .result-item {
      border-bottom: 0;
      margin: 0;
    }
    .result-item:last-child {
      margin-top: 10px;
      justify-content: flex-start;
    }
  }
  .result-item {
    display: flex;
    justify-content: space-between;
    margin: 15px auto;
    font-size: 16px;
    border-bottom: 1px #ccc solid;
    h5 {
      font-weight: 600;
      font-size: 1.5rem;
    }
    .fw-bold {
      font-weight: 600;
      font-size: 1.3rem;
    }
    .tfee-rmb {
      text-align: right;
      color: #999;
    }
  }
}
.item-label {
  font-weight: 600;
  font-size: 16px;
}
</style>
