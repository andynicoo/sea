<template>
  <div class="common-setting">
    <a-anchor
      class="setting-left-nav"
      :affix="false"
      :getContainer="() => $refs.setting"
    >
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#claimSettingTitle1'"
        :title="$t('goodsCollection.claimSettingTitle1')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#claimSettingTitle2'"
        :title="$t('goodsCollection.claimSettingTitle2')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#claimSettingTitle3'"
        :title="$t('goodsCollection.claimSettingTitle3')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#claimSettingTitle4'"
        :title="$t('goodsCollection.claimSettingTitle4')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#claimSettingTitle5'"
        :title="$t('goodsCollection.claimSettingTitle5')"
      />
    </a-anchor>
    <div class="setting-content" ref="setting">
      <!-- 该表单不需要做校验 -->
      <a-form
        layout="horizontal"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        class="me-common-form"
      >
        <div
          class="setting-content-item"
          id="claimSettingTitle1"
          style="padding-top: 10px;"
        >
          <a-form-item :label="$t('goodsCollection.claimSettingTitle10')">
            <a-radio-group
              :options="itemConditionOptions"
              v-model="claimSetForm.itemCondition"
              :name="'itemCondition'"
            />
          </a-form-item>
        </div>
        <a-form-item :label="$t('goodsCollection.claimSettingTitle11')">
          <div class="setting-content-item" style="padding: 10px 0;">
            <a-radio-group v-model="claimSetForm.isPreOrder" :name="'preOrder'">
              <p>
                <a-radio :value="false">
                  {{ $t('goodsCollection.claimSettingTitle12') }}
                </a-radio>
              </p>
              <p>
                <a-radio :value="true">
                  {{ $t('goodsCollection.claimSettingTitle13') }}
                  <a-input-number
                    @formatter="numberFormatter"
                    :min="1"
                    :max="30"
                    :precision="0"
                    class="w110 me-handler-wrap-hide"
                    v-model="claimSetForm.daysToShip"
                    :placeholder="$t('goodsCollection.claimSettingTitle15')"
                  />
                  {{ $t('goodsCollection.claimSettingTitle14') }}
                </a-radio>
              </p>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.claimSettingTitle2')">
          <div
            class="setting-content-item"
            id="claimSettingTitle2"
            style="padding-right: 20px;"
            v-if="claimSetForm.priceConfig.length > 0"
          >
            <a-col
              :span="6"
              v-for="(item, index) in claimSetForm.priceConfig"
              :key="index"
            >
              <a-checkbox
                :checked="item.inUse"
                @change="checkboxPriceChange($event, item)"
              >
                {{ item.countryName }}
              </a-checkbox>
              <span
                class="priceConfigBtn"
                @click="setPriceClick(item, index)"
                >{{ $t('goodsCollection.claimSettingTitle16') }}</span
              >
            </a-col>
          </div>
          <div
            class="setting-content-item"
            id="claimSettingTitle2"
            style="padding-right: 20px;"
            v-else
          >
            <router-link to="/store">
              <a-alert
                class="vw35"
                :message="$t('goodsCollection.claimSettingTitle35')"
                type="warning"
                show-icon
              />
            </router-link>
          </div>
        </a-form-item>

        <a-form-item :label="$t('goodsCollection.claimSettingTitle3')">
          <div id="claimSettingTitle3">
            <a-checkbox
              :checked="claimSetForm.delMaxSkuSize"
              @change="checkboxChange($event, 'delMaxSkuSize')"
              >{{ $t('goodsCollection.claimSettingTitle17') }}</a-checkbox
            >
          </div>
          <div>
            <a-checkbox
              :checked="claimSetForm.delMaxSkuLength"
              @change="checkboxChange($event, 'delMaxSkuLength')"
              >{{ $t('goodsCollection.claimSettingTitle18') }}</a-checkbox
            >
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.claimSettingTitle19')">
          <div>
            <a-checkbox
              :checked="claimSetForm.completionMainImages"
              @change="checkboxChange($event, 'completionMainImages')"
              >{{ $t('goodsCollection.claimSettingTitle20') }}</a-checkbox
            >
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.claimSettingTitle4')">
          <div class="setting-content-item inline" id="claimSettingTitle4">
            <a-radio-group
              v-model="titleConfig.handlerType"
              :name="'title'"
              @change="titleRadioChange"
            >
              <a-radio :value="1">
                {{ $t('goodsCollection.claimSettingTitle21') }}
              </a-radio>
              <a-radio :value="4">
                <a-select
                  v-model="titleConfig.handlerTypeItem"
                  style="width: 110px"
                  :options="titleOptions"
                  @change="titleSelectChange"
                >
                </a-select>
                {{ $t('goodsCollection.addKeywords') }}
              </a-radio>
            </a-radio-group>
          </div>

          <div class="setting-content-item">
            <a-input
              class="vw35"
              v-model="titleConfig.keyWordsStr"
              :placeholder="$t('goodsCollection.placeholder2')"
              @change="keyWordsChange(titleConfig.keyWordsStr)"
              @keydown="keyWordsChange(titleConfig.keyWordsStr)"
            />
            <a-button
              icon="edit"
              class="managementBt"
              @click="manageKeyWordsClick(titleConfig.keyWordsStr)"
              >{{ $t('goodsCollection.manageKeywords') }}</a-button
            >
            <em
              >{{ $t('goodsCollection.total') }}(<strong
                class="me-handler-danger"
                >{{ titleConfig.keyNum }}</strong
              >){{ $t('goodsCollection.UNIT1') }}</em
            >
          </div>
          <div class="setting-content-item inline">
            {{ $t('goodsCollection.claimSettingTitle22') }}
            <a-input-number
              @formatter="numberFormatter"
              :precision="0"
              class="w110 me-handler-wrap-hide"
              v-model="titleConfig.keyWordSize"
            />
            个
          </div>
          <div class="setting-content-item inline me-handler-red">
            {{ $t('goodsCollection.claimSettingTitle23') }}
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.claimSettingTitle5')">
          <div class="setting-content-item" id="claimSettingTitle5">
            <a-radio-group
              v-model="descriptionConfig.type"
              :options="descriptionOptions"
              :name="'description'"
            />
          </div>
          <div v-if="descriptionConfig.type === 1">
            <a-checkbox
              :checked="descriptionConfig.filterBrand"
              @change="descriptionChange($event, 'filterBrand')"
              >{{ $t('goodsCollection.claimSettingTitle24') }}
            </a-checkbox>
          </div>
          <div class="setting-content-item" v-if="descriptionConfig.type === 2">
            <a-textarea
              class="vw35"
              :placeholder="$t('goodsCollection.claimSettingTitle25')"
              v-model="descriptionConfig.description"
              allow-clear
            />
          </div>
          <p class="me-handler-red">
            {{ $t('goodsCollection.claimSettingTitle26') }}
          </p>
        </a-form-item>
      </a-form>
    </div>
    <!-- 管理关键词 -->
    <a-modal
      :visible="manageVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.manageKeywords')"
      :footer="null"
      @cancel="manageKeyCancel"
      destroyOnClose
      :width="800"
    >
      <ManageKeyWords ref="keyWords" :keyArr="keyWordsArr" />
    </a-modal>
    <!-- 设置售价 -->
    <a-modal
      :visible="setPriceVisible"
      :title="$t('goodsCollection.claimSettingTitle27')"
      @ok="setPriceOk"
      @cancel="setPriceCancel"
      :maskClosable="false"
      destroyOnClose
      :width="650"
      :bodyStyle="{ padding: '10px 16px 20px' }"
    >
      <SetPriceTemplate ref="setPriceTemplate" :list="[priceConfig]" />
    </a-modal>
  </div>
</template>

<script>
import CrawlApi from '@/api/crawl'
import Basic from '@/api/basic'
import ManageKeyWords from './ManageKeyWords'
import SetPriceTemplate from '../setPriceTemplate/SetPriceTemplate'
import { isEmpty } from '@/util'
import { cloneDeep } from 'lodash'
import { COUNTRY } from '@/util/erp.conf'

export default {
  components: {
    ManageKeyWords,
    SetPriceTemplate
  },
  props: {
    setData: {
      type: Object,
      defalut: {}
    },
    setTabs: {
      type: Number,
      defalut: 2
    }
  },
  data() {
    return {
      claimSetForm: {
        completionMainImages: false, //是否补全主图9张
        // currentMemberId: null,    //当前登录会员ID
        daysToShip: null, //出货天数
        // defaultTemplate: null,    //是否是默认模板
        delMaxSkuLength: false, //Sku规格名称超过20个，自动删减
        delMaxSkuSize: false, //超过50sku自动删除多余规格
        delMaxSkuArr: [],
        descriptionConfig: {}, //描述配置
        // inUse: null,    //是否正在使用
        isPreOrder: false, //是否预购
        itemCondition: 'NEW', //物品类型 NEW/USED
        // memberId: null,    //会员ID
        priceConfig: [], //售价配置
        templateId: null, //ID
        templateName: null, //模版名称
        titleConfig: {} //标题配置
      },
      descriptionConfig: {
        description: '', //自定义描述
        filterBrand: false, //是否过滤品牌词
        type: 1 //描述处理方式 1:使用来源描述或属性信息作为产品描述 2：自定义描述
      }, //描述配置
      titleConfig: {
        keyWordSize: null, //添加关键词数量
        keyWords: [], //关键词
        keyWordsStr: '',
        handlerType: 1,
        handlerTypeItem: 2,
        type: 1, //标题处理方式 1:随机新标题 2：标题前 3：标题后
        keyNum: 0
      }, //标题配置
      priceConfig: {}, //售价配置
      itemConditionOptions: [
        { label: this.$t('goodsCollection.claimSettingTitle29'), value: 'NEW' },
        { label: this.$t('goodsCollection.claimSettingTitle30'), value: 'USED' }
      ],
      titleOptions: [
        { label: this.$t('goodsCollection.claimSettingTitle31'), value: 2 },
        { label: this.$t('goodsCollection.claimSettingTitle32'), value: 3 }
      ],
      descriptionOptions: [
        { label: this.$t('goodsCollection.claimSettingTitle33'), value: 1 },
        { label: this.$t('goodsCollection.claimSettingTitle34'), value: 2 },
        { label: this.$t('goodsCollection.claimSettingTitle36'), value: 3 }
      ],
      manageVisible: false,
      keyWordsArr: [],
      keyWordsType: null,
      setPriceVisible: false,
      priceConfigIndex: 0
    }
  },
  watch: {
    setData: {
      handler: function(value) {
        if (this.setTabs === 2) {
          this.initData()
          this.assignData()
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化参数
    initData() {
      this.claimSetForm = {
        completionMainImages: false, //是否补全主图9张
        daysToShip: null, //出货天数
        delMaxSkuLength: false, //Sku规格名称超过20个，自动删减
        delMaxSkuSize: false, //超过50sku自动删除多余规格
        delMaxSkuArr: [],
        descriptionConfig: {}, //描述配置
        isPreOrder: false, //是否预购
        itemCondition: 'NEW', //物品类型 NEW/USED
        priceConfig: [], //售价配置
        templateId: null, //ID
        templateName: null, //模版名称
        titleConfig: {} //标题配置
      }
      this.descriptionConfig = {
        description: '', //自定义描述
        filterBrand: false, //是否过滤品牌词
        type: 1 //描述处理方式 1:使用来源描述或属性信息作为产品描述 2：自定义描述
      } //描述配置
      this.titleConfig = {
        keyWordSize: null, //添加关键词数量
        keyWords: [], //关键词
        keyWordsStr: '',
        handlerType: 1,
        handlerTypeItem: 2,
        type: 1, //标题处理方式 1:随机新标题 2：标题前 3：标题后
        keyNum: 0
      } //标题配置
    },
    // 赋值对应的参数
    assignData() {
      const data = cloneDeep(this.setData)
      const { titleConfig, descriptionConfig } = data
      this.claimSetForm = data // 设置
      // 处理描述
      if (!isEmpty(descriptionConfig.type)) {
        this.descriptionConfig = Object.assign(
          this.descriptionConfig,
          descriptionConfig
        ) // 描述配置
      }
      // 标题处理
      if (!isEmpty(titleConfig.type)) {
        if (titleConfig.type === 1) {
          this.titleConfig.handlerType = 1
          this.titleConfig.handlerTypeItem = 2
        } else {
          this.titleConfig.handlerType = 4
          this.titleConfig.handlerTypeItem = titleConfig.type
        }
        this.titleConfig = Object.assign(this.titleConfig, titleConfig) // 标题配置
        // 标题处理——删除关键词
        let titleConfigArr = []
        if (!isEmpty(this.titleConfig.keyWords)) {
          titleConfigArr = this.titleConfig.keyWords.filter((key) => !!key)
        }
        this.titleConfig.keyNum = titleConfigArr.length
        this.titleConfig.keyWordsStr =
          titleConfigArr.length !== 0 ? titleConfigArr.join(',') : ''
      }
    },
    // 字符串转数字类型
    numberFormatter(value) {
      return Number(value)
    },
    // SKU设置change
    checkboxChange(e, key) {
      this.claimSetForm[key] = e.target.checked
    },
    // 描述设置change
    descriptionChange(e, key) {
      this.descriptionConfig[key] = e.target.checked
    },
    submit() {
      /* eslint-disable */
      return new Promise(async (resolve) => {
        /* eslint-disable */
        let { claimSetForm, descriptionConfig, titleConfig } = this.$data
        // 处理来源标题处理——删除关键字重复字段
        titleConfig.keyWords = this.keyWordsRepeat(titleConfig.keyWordsStr)
        claimSetForm.descriptionConfig = Object.assign(
          claimSetForm.descriptionConfig,
          descriptionConfig
        )
        claimSetForm.titleConfig = Object.assign(
          claimSetForm.titleConfig,
          titleConfig
        )
        let params = Object.assign({}, claimSetForm)
        const { data } = await CrawlApi.editClaimTemplate(params)
        resolve(data)
      })
    },
    // 处理——删除关键字重复字段(去重)
    keyWordsRepeat(str) {
      const items = str.split(/,|，/).filter((key) => !!key)
      const array = Array.from(new Set(items)) || []
      return array
    },
    sourcePictureChange(event) {
      this.sourcePicture.randomNum = false
      this.sourcePicture.skuOneReplaceMain = false
      if (event.target.value === 2) {
        this.sourcePicture.skuOneReplaceMain = true
      } else if (event.target.value === 3) {
        this.sourcePicture.randomNum = true
      }
    },
    // 管理关键词
    manageKeyWordsClick(str) {
      this.manageVisible = true
      // 去重
      this.keyWordsArr = this.keyWordsRepeat(str)
    },
    manageKeyCancel() {
      this.manageVisible = false
      let obj = this.$refs.keyWords.cancel()
      this.titleConfig.keyWordsStr = obj.str
      this.titleConfig.keyNum = obj.num
    },
    keyWordsChange(str) {
      let arr = str.split(/,|，/).filter((key) => !!key)
      this.titleConfig.keyNum = arr.length
    },
    // 标题处理 Radio change
    titleRadioChange(e) {
      this.titleConfig.type =
        e.target.value === 1 ? 1 : this.titleConfig.handlerTypeItem
    },
    // 标题处理 Select change
    titleSelectChange(e) {
      this.titleConfig.type = e === 1 ? 1 : this.titleConfig.handlerTypeItem
    },
    checkboxPriceChange(e, item) {
      item.inUse = e.target.checked
    },
    async setPriceClick(item, index) {
      if (!isEmpty(item.countryCode)) {
        const currency = COUNTRY.filter(
          (val) => val.key === item.countryCode
        )[0]?.currency
        item.currency = currency || 'CNY'
        let rate = await this.getCurrencyRate(currency)
        item.rate = rate
      }
      this.priceConfig = Object.assign({}, item)
      this.priceConfigIndex = index
      this.setPriceVisible = true
    },
    async setPriceOk() {
      const setPriceTemplate = this.$refs.setPriceTemplate
      let error = await setPriceTemplate.verifyData()
      if (!isEmpty(error)) {
        this.errorAlert(error)
        return
      }
      const data = setPriceTemplate.getData()
      let obj = {
        formulaAdd: data.addNum, // 公式 + 变量
        formulaMantissa: data.mantissaAmount, //公式 尾数金额
        formulaMultiply: data.multiplyNum, //公式 * 变量
        formulaRounding: data.integerType, //公式 取整方式 1：四舍五入 2：向上取整 3：向下取整 4：保留1位小数 5：保留2位小数
        formulaSubtract: data.subtractNum, //公式 - 变量
        priceTemplateId: data.currentTemplateId, //定价模版ID
        type: data.priceRadio, //定价方式 1:定价模版 2：统一价格 3：公式
        unifyPrice: data.flatPrice //统一价格
      }
      this.claimSetForm.priceConfig[this.priceConfigIndex] = Object.assign(
        this.priceConfig,
        obj
      )
      this.setPriceVisible = false
    },
    setPriceCancel() {
      this.setPriceVisible = false
    },
    async getCurrencyRate(currency) {
      const { data } = await Basic.getCurrencyRate(currency)
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.common-setting {
  display: flex;
  .setting-left-nav {
    width: 16%;
    background-color: #f5f7fa;
    .setting-left-nav-items {
      display: block;
      background: #f5f7fa;
      padding: 14px 0 12px 15px;
      cursor: pointer;
      border-left: 3px solid #f0f0f1;
      &.ant-anchor-link-active {
        background: #fff;
        border-left: 3px solid #f7622f;
      }
    }
  }
  .setting-content {
    flex: 1;
    height: 69vh;
    overflow-y: auto;
    .setting-content-item {
      input {
        display: inline-block;
        width: auto;
      }
      .ant-select {
        width: 25%;
        max-width: 200px;
      }
      .w110 {
        width: 110px;
      }
      .w180 {
        width: 180px;
      }
      .vw35 {
        width: 35vw;
      }
      p + p {
        margin-top: 10px;
      }
      span + span {
        margin-left: 12px;
      }
      &.inline {
        > span {
          min-width: 103px;
          display: inline-block;
          margin-right: 10px;
        }
        span:nth-of-type(2) {
          text-align: right;
        }
        textarea {
          vertical-align: top;
        }
      }
      .icon-circle {
        font-size: 20px;
        cursor: pointer;
        margin-left: 5px;
        vertical-align: middle;
      }
      .managementBt {
        margin: 0 10px;
        padding: 0 6px;
      }
    }
    .setting-content-item + .setting-content-item {
      margin-top: 10px;
    }
  }
}
.priceConfigBtn {
  cursor: pointer;
  color: #f7622f;
  margin: 0 20px;
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
