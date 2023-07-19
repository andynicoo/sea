<template>
  <div class="common-setting">
    <a-anchor
      class="setting-left-nav"
      :affix="false"
      :getContainer="() => $refs.setting"
    >
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#priceSet'"
        :title="$t('goodsCollection.priceSet')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#stockSet'"
        :title="$t('goodsCollection.stockSet')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#sourcePictureSet'"
        :title="$t('goodsCollection.sourcePictureSet')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#sourceTitleSet'"
        :title="$t('goodsCollection.sourceTitleSet')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#sourceDescribeSet'"
        :title="$t('goodsCollection.sourceDescribeSet')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#unitSet'"
        :title="$t('goodsCollection.weightSize')"
      />
      <a-anchor-link
        class="setting-left-nav-items"
        :href="'#' + $route.path + '#skipConfigSet'"
        :title="$t('goodsCollection.skipConfigSet')"
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
        <!-- 价格设置外套个div，处理padding-top时，锚点对应 -->
        <div id="priceSet" style="padding-top: 10px;">
          <a-form-item :label="$t('goodsCollection.priceSet')">
            <div class="setting-content-item">
              <span>{{ $t('goodsCollection.sourceGoodsSelect') }}</span>
              <a-tooltip :title="$t('goodsCollection.tooltipTitle1')">
                <a-select v-model="price.supplyPlatform">
                  <a-select-option :value="1">
                    {{ $t('goodsCollection.acquisitionCost') }}
                  </a-select-option>
                  <a-select-option :value="2">
                    {{ $t('goodsCollection.collectionWholesalePrice') }}
                  </a-select-option>
                </a-select>
              </a-tooltip>
            </div>
            <div class="setting-content-item">
              <span>{{ $t('goodsCollection.retailGoodsSelect') }}</span>
              <a-tooltip :title="$t('goodsCollection.tooltipTitle2')">
                <a-select v-model="price.sellPlatform">
                  <a-select-option :value="1">
                    {{ $t('goodsCollection.acquisitionCost') }}
                  </a-select-option>
                  <a-select-option :value="2">
                    {{ $t('goodsCollection.collectDiscountPrices') }}
                  </a-select-option>
                </a-select>
              </a-tooltip>
            </div>
          </a-form-item>
        </div>

        <a-form-item :label="$t('goodsCollection.inventory')">
          <div class="setting-content-item" id="stockSet">
            <a-radio-group v-model="stock.type" :name="'stock'">
              <a-radio :value="1">
                {{ $t('goodsCollection.usingSourceInventory') }}
              </a-radio>
              <a-radio :value="2">
                {{ $t('goodsCollection.usingUnifiedInventory') }}:
                <a-tooltip :title="$t('goodsCollection.tooltipTitle3')">
                  <a-input-number
                    @formatter="numberFormatter"
                    :min="0"
                    :precision="0"
                    class="w110 me-handler-wrap-hide"
                    v-model="stock.value"
                    :placeholder="$t('goodsCollection.inventory')"
                  />
                </a-tooltip>
              </a-radio>
            </a-radio-group>
          </div>
          <div class="setting-content-item">
            {{ $t('goodsCollection.sourceSKUInventoryBelow') }}
            <a-input-number
              @formatter="numberFormatter"
              :min="0"
              :precision="0"
              class="w110 me-handler-wrap-hide"
              v-model="stock.minNum"
            />
            {{ $t('goodsCollection.setItTo0') }}
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.sourceMasterMapProcess')">
          <div class="setting-content-item" id="sourcePictureSet">
            <span>
              {{ $t('goodsCollection.beforeDelMasterMap') }}
              <a-tooltip :title="$t('goodsCollection.tooltipTitle7')">
                <a-input-number
                  :min="0"
                  :precision="0"
                  @formatter="numberFormatter"
                  class="w110 me-handler-wrap-hide"
                  v-model="sourcePicture.delePreNum"
                />
              </a-tooltip>
              {{ $t('goodsCollection.UNIT2') }}
            </span>
            <span>
              {{ $t('goodsCollection.afterDelMasterMap') }}
              <a-tooltip :title="$t('goodsCollection.tooltipTitle7')">
                <a-input-number
                  :min="0"
                  :precision="0"
                  @formatter="numberFormatter"
                  class="w110 me-handler-wrap-hide"
                  v-model="sourcePicture.deleAfterNum"
                />
              </a-tooltip>
              {{ $t('goodsCollection.UNIT2') }}
            </span>
            <span>
              {{ $t('goodsCollection.delMasterFigure') }}
              <a-tooltip :title="$t('goodsCollection.tooltipTitle7')">
                <a-input
                  class="w180"
                  v-model="sourcePicture.deleNums"
                  :placeholder="$t('goodsCollection.placeholder1')"
                />
              </a-tooltip>
              {{ $t('goodsCollection.UNIT2') }}
            </span>
          </div>
          <div class="setting-content-item">
            <a-radio-group
              v-model="sourcePicture.type"
              @change="sourcePictureChange"
              :name="'sourcePicture'"
            >
              <p>
                <a-radio :value="1">
                  {{ $t('goodsCollection.willBeOriginal') }}
                  <a-select v-model="sourcePicture.moveToOne" class="w110">
                    <a-select-option
                      v-for="(item, index) in 5"
                      :value="item"
                      :key="index"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                  {{ $t('goodsCollection.movePictureToFirst') }}
                </a-radio>
              </p>
              <p>
                <a-radio :value="2">
                  {{ $t('goodsCollection.firstSKUDiagramReplacesFirstImage') }}
                </a-radio>
              </p>
              <p>
                <a-radio :value="3">
                  {{ $t('goodsCollection.randomlyDisruptOrder') }}
                </a-radio>
              </p>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.sourceTitleProcess')">
          <div class="setting-content-item inline" id="sourceTitleSet">
            <span>{{ $t('goodsCollection.addPrefixContent') }}:</span>
            <a-input
              class="w180"
              v-model="sourceTitle.preContent"
              :placeholder="$t('goodsCollection.titlePrefix')"
            />
            <span>{{ $t('goodsCollection.addSuffixContent') }}:</span>
            <a-input
              class="w180"
              v-model="sourceTitle.afterContent"
              :placeholder="$t('goodsCollection.titleSuffix')"
            />
          </div>
          <div
            class="setting-content-item inline"
            v-for="(item, index) in sourceTitle.replaceKeywordsArr"
            :key="index"
          >
            <span>{{ $t('goodsCollection.titleKeyword') }}: </span>
            <a-input
              class="w180"
              v-model="item.replaceKey"
              :placeholder="$t('goodsCollection.titleKeyword')"
            />
            <span>{{ $t('goodsCollection.replaceTo') }}:</span>
            <a-input
              class="w180"
              v-model="item.replaceValue"
              :placeholder="$t('goodsCollection.replaceContent')"
            />
            <a-icon
              v-if="index === 0"
              type="plus-circle"
              class="icon-circle"
              @click="plusReplaceClick"
            />
            <a-icon
              v-else
              type="minus-circle"
              class="icon-circle"
              @click="minusReplaceClick(index)"
            />
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.delKeywords') }}:</span>
            <a-input
              class="vw35"
              v-model="sourceTitle.deleKeywords"
              :placeholder="$t('goodsCollection.placeholder2')"
              @change="keyWordsChange(sourceTitle.deleKeywords, 1)"
              @keydown="keyWordsKeydown(sourceTitle.deleKeywords, 1)"
            />
            <a-button
              icon="edit"
              class="managementBt"
              @click="manageKeyWordsClick(sourceTitle.deleKeywords, 1)"
              >{{ $t('goodsCollection.manageKeywords') }}</a-button
            >
            <em
              >{{ $t('goodsCollection.total') }}(<strong
                class="me-handler-danger"
                >{{ sourceTitle.keyNum }}</strong
              >){{ $t('goodsCollection.UNIT1') }}</em
            >
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.sourceDescriptionProcess')">
          <div class="setting-content-item inline" id="sourceDescribeSet">
            <span>{{ $t('goodsCollection.firstAddedContent') }}:</span>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle6')">
              <a-textarea
                :rows="3"
                class="vw35"
                v-model="sourceDescribe.preContent"
                :placeholder="$t('goodsCollection.descriptionPrefix')"
              />
            </a-tooltip>
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.tailAddedContent') }}:</span>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle5')">
              <a-textarea
                :rows="3"
                class="vw35"
                v-model="sourceDescribe.afterContent"
                :placeholder="$t('goodsCollection.descriptionSuffix')"
              />
            </a-tooltip>
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.delKeywords') }}:</span>
            <a-input
              class="vw35"
              v-model="sourceDescribe.deleKeywords"
              :placeholder="$t('goodsCollection.placeholder2')"
              @change="keyWordsChange(sourceDescribe.deleKeywords, 2)"
              @keydown="keyWordsKeydown(sourceDescribe.deleKeywords, 2)"
            />
            <a-button
              icon="edit"
              class="managementBt"
              @click="manageKeyWordsClick(sourceDescribe.deleKeywords, 2)"
              >{{ $t('goodsCollection.manageKeywords') }}</a-button
            >
            <em
              >{{ $t('goodsCollection.total') }}(<strong
                class="me-handler-danger"
                >{{ sourceDescribe.keyNum }}</strong
              >){{ $t('goodsCollection.UNIT1') }}</em
            >
          </div>
          <!-- <div class="setting-content-item inline">
            <span>{{$t('goodsCollection.notCollectWidthLess')}}</span>
            <a-input-number :min="0" @formatter="numberFormatter" class="w110 me-handler-wrap-hide" v-model="sourceDescribe.minWidth" :placeholder="$t('goodsCollection.width')" />
            {{$t('goodsCollection.pxOrHeightLess')}}
            <a-input-number :min="0" @formatter="numberFormatter" class="w110 me-handler-wrap-hide" v-model="sourceDescribe.minHeight" :placeholder="$t('goodsCollection.height')" />
            {{$t('goodsCollection.pxPicture')}}
          </div> -->
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.weightSize')">
          <div class="setting-content-item" id="unitSet">
            <em>{{ $t('goodsCollection.weight') }}:</em>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle4')">
              <a-input
                class="w110 me-mr-2 me-input-after"
                v-model="unit.weight"
                :placeholder="$t('goodsCollection.weight')"
                addon-after="KG"
              />
            </a-tooltip>
            <em>{{ $t('goodsCollection.dimensionSize') }}:</em>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle4')">
              <a-input
                class="w110 me-input-after"
                v-model="unit.length"
                :placeholder="$t('goodsCollection.long')"
                addon-after="CM"
              />
            </a-tooltip>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle4')">
              <a-input
                class="w110 me-input-after"
                v-model="unit.width"
                :placeholder="$t('goodsCollection.wide')"
                addon-after="CM"
              />
            </a-tooltip>
            <a-tooltip :title="$t('goodsCollection.tooltipTitle4')">
              <a-input
                class="w110 me-input-after"
                v-model="unit.height"
                :placeholder="$t('goodsCollection.high')"
                addon-after="CM"
              />
            </a-tooltip>
          </div>
        </a-form-item>
        <a-form-item :label="$t('goodsCollection.skipConfigSet')">
          <div class="setting-content-item" id="skipConfigSet">
            <a-checkbox-group
              v-model="skipConfig.skinArr"
              :options="skinOptions"
            />
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.skipTitleKeyword') }}:</span>
            <a-input
              class="vw35"
              v-model="skipConfig.titleKeywords"
              :placeholder="$t('goodsCollection.placeholder2')"
            />
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.skipSKUKeywords') }}:</span>
            <a-input
              class="vw35"
              v-model="skipConfig.skuKeywords"
              :placeholder="$t('goodsCollection.placeholder2')"
            />
          </div>
          <div class="setting-content-item inline">
            <span>{{ $t('goodsCollection.skipBrandKeywords') }}:</span>
            <a-input
              class="vw35"
              v-model="skipConfig.brandKeywords"
              :placeholder="$t('goodsCollection.placeholder2')"
            />
          </div>
          <div class="setting-content-item">
            <a-checkbox :checked="autoClaimStore" @change="handleClaimChange">{{
              $t('goodsCollection.claimSettingTitle7')
            }}</a-checkbox>
            <a-button type="primary" class="managementBt" @click="claimClick">{{
              $t('goodsCollection.claimSettingTitle8')
            }}</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <!-- 管理模板 -->
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
    <!-- 自动认领的店铺 -->
    <a-modal
      :visible="claimVisible"
      :maskClosable="false"
      :title="$t('goodsCollection.claimSettingTitle9')"
      @ok="claimOk"
      @cancel="claimVisible = false"
      destroyOnClose
      width="70%"
    >
      <StoreTableModal
        ref="storeTable"
        :selectedKeys="storesVisible"
        :list="basicStoreList"
        :isBasicStore="true"
      />
    </a-modal>
  </div>
</template>

<script>
import CrawlApi from '@/api/crawl'
import ManageKeyWords from './ManageKeyWords'
import StoreTableModal from '../StoreTableModal'
import { mapState } from 'vuex'

export default {
  components: {
    ManageKeyWords,
    StoreTableModal
  },
  props: {
    setData: {
      type: Object,
      defalut: {}
    },
    setTabs: {
      type: Number,
      defalut: 1
    }
  },
  data() {
    return {
      formItemLayout: {},
      price: {
        sellPlatform: 2, //1采集售价 2采集批发价
        supplyPlatform: 2 //1采集售价 2采集折扣价
      }, // 价格设置
      stock: {
        type: 1, // 1来源库存 2统一库存
        value: null, // 库存值
        minNum: null // 低于多少设置为0
      }, // 库存
      sourcePicture: {
        type: 1,
        deleAfterNum: null, //	删除主图后多少张
        deleNums: '', //	删除第几张
        delePreNum: null, //	删除主图前多少张
        moveToOne: 1, //	移动第几张到第一张
        randomNum: false, //	随机打乱顺序
        skuOneReplaceMain: false //	第一张sku图替换首图
      }, //来源主图处理
      sourceTitle: {
        afterContent: '', //	增加后缀内容
        deleKeywords: '', //	删除关键字
        preContent: '', //	增加前缀内容
        replaceKeywordsArr: [
          {
            replaceKey: '', // 标题关键字
            replaceValue: '' // 标题替换为
          }
        ], //	关键字替换
        keyNum: 0 // 删除关键词的数量
      }, //来源标题处理
      sourceDescribe: {
        afterContent: '', //	增加后缀内容
        deleKeywords: '', //	删除关键词
        minHeight: null, //	不采集高度低于多少
        minWidth: null, //	不采集宽度小于多少
        preContent: '', //	增加前缀内容
        keyNum: 0 // 删除关键词的数量
      }, //来源描述处理
      unit: {
        height: null, //	高
        length: null, //	长
        weight: null, //	重量
        width: null //	宽
      }, //重量尺寸
      skipConfig: {
        brandKeywords: '', //	跳过品牌关键字
        skinBrand: false, //	跳过有品牌的商品
        skinHasCrawl: false, //	跳过已采集商品
        skinNoFreeShipping: false, //	跳过不包邮商品
        skinOffShelf: false, //	跳过已下架商品
        skinPreSale: false, //	跳过预售
        skinZeroStock: false, //	跳过0本地SKU
        skuKeywords: '', //	跳过sku关键字
        titleKeywords: '', //	跳过标题关键字
        skinArr: []
      }, //跳过配置
      skinOptions: [
        { value: 'skinHasCrawl', label: this.$t('goodsCollection.plain1') },
        // { value: 'skinOffShelf', label: this.$t('goodsCollection.plain2') },
        // { value: 'skinNoFreeShipping', label: this.$t('goodsCollection.plain3') },
        { value: 'skinZeroStock', label: this.$t('goodsCollection.plain4') },
        // { value: 'skinPreSale', label: this.$t('goodsCollection.plain5') },
        { value: 'skinBrand', label: this.$t('goodsCollection.plain6') }
      ],
      manageVisible: false,
      keyWordsArr: [],
      keyWordsType: null,
      autoClaimStore: false,
      stores: [],
      storesVisible: [],
      claimVisible: false
    }
  },
  watch: {
    setData: {
      handler: function(value) {
        if (this.setTabs === 1) {
          if (!value.price) {
            // 初始化刚刚创建的模板
            this.initData()
          } else {
            this.assignData()
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      basicStoreList: (state) => state.auth.basicStoreList
    })
  },
  mounted() {},
  methods: {
    // 初始化参数
    initData() {
      this.price = {
        sellPlatform: 2, //1采集售价 2采集批发价
        supplyPlatform: 2 //1采集售价 2采集折扣价
      } // 价格设置
      this.stock = {
        type: 1, // 1来源库存 2统一库存
        value: null, // 库存值
        minNum: null // 低于多少设置为0
      } // 库存
      this.sourcePicture = {
        type: 1,
        deleAfterNum: null, //	删除主图后多少张
        deleNums: '', //	删除第几张
        delePreNum: null, //	删除主图前多少张
        moveToOne: 1, //	移动第几张到第一张
        randomNum: false, //	随机打乱顺序
        skuOneReplaceMain: false //	第一张sku图替换首图
      } //来源主图处理
      this.sourceTitle = {
        afterContent: '', //	增加后缀内容
        deleKeywords: '', //	删除关键字
        preContent: '', //	增加前缀内容
        replaceKeywordsArr: [
          {
            replaceKey: '', // 标题关键字
            replaceValue: '' // 标题替换为
          }
        ], //	关键字替换
        keyNum: 0 // 删除关键词的数量
      } //来源标题处理
      this.sourceDescribe = {
        afterContent: '', //	增加后缀内容
        deleKeywords: '', //	删除关键字
        minHeight: null, //	不采集高度低于多少
        minWidth: null, //	不采集宽度小于多少
        preContent: '', //	增加前缀内容
        keyNum: 0 // 删除关键词的数量
      } //来源描述处理
      this.unit = {
        height: null, //	高
        length: null, //	长
        weight: null, //	重量
        width: null //	宽
      } //重量尺寸
      this.skipConfig = {
        brandKeywords: '', //	跳过品牌关键字
        skinBrand: false, //	跳过有品牌的商品
        skinHasCrawl: false, //	跳过已采集商品
        skinNoFreeShipping: false, //	跳过不包邮商品
        skinOffShelf: false, //	跳过已下架商品
        skinPreSale: false, //	跳过预售
        skinZeroStock: false, //	跳过0本地SKU
        skuKeywords: '', //	跳过sku关键字
        titleKeywords: '', //	跳过标题关键字
        skinArr: []
      } //跳过配置
      this.autoClaimStore = false
      this.stores = []
    },
    // 赋值对应的参数
    assignData() {
      const {
        price,
        stock,
        sourcePicture,
        sourceTitle,
        sourceDescribe,
        unit,
        skipConfig
      } = this.setData
      this.price = Object.assign({}, price) // 价格设置
      this.stock = Object.assign({}, stock) // 库存
      this.sourcePicture = Object.assign(this.sourcePicture, sourcePicture) // 来源主图处理
      this.sourceDescribe = Object.assign({}, sourceDescribe) // 来源描述处理
      this.unit = Object.assign({}, unit) // 重量尺寸
      this.sourceTitle = Object.assign(this.sourceTitle, sourceTitle) //来源标题处理
      this.skipConfig = Object.assign(this.skipConfig, skipConfig) //跳过配置
      // 处理来源主图处理--选中状态
      // randomNum&&skuOneReplaceMain === false时，默认为1
      this.sourcePicture['type'] =
        sourcePicture.randomNum && !sourcePicture.skuOneReplaceMain
          ? 3
          : sourcePicture.skuOneReplaceMain
          ? 2
          : 1
      // 处理来源标题处理——关键字替换
      this.sourceTitle.replaceKeywordsArr = []
      Object.keys(sourceTitle.replaceKeywords).forEach((key, index) => {
        this.sourceTitle.replaceKeywordsArr.push({
          replaceKey: key, // 标题关键字
          replaceValue: sourceTitle.replaceKeywords[key] // 标题替换为
        })
      })
      // 处理来源标题处理——删除关键字
      let sourceTitleArr = sourceTitle.deleKeywords
        .split(/,|，/)
        .filter((key) => !!key)
      this.sourceTitle.keyNum = sourceTitleArr.length
      // 来源描述处理——删除关键字
      let sourceDescribeArr = sourceDescribe.deleKeywords
        .split(/,|，/)
        .filter((key) => !!key)
      this.sourceDescribe.keyNum = sourceDescribeArr.length
      // 处理跳过配置——关键字替换
      Object.keys(skipConfig).forEach((key, index) => {
        if (skipConfig[key] === true) {
          this.skipConfig.skinArr.push(key)
        }
      })
      if (this.setData.autoClaimStore === 1) {
        this.autoClaimStore = true
      }
      // 处理stores： '[1,2,3,4]'转数组
      this.stores = JSON.parse(this.setData.stores) || []
    },
    // 字符串转数字类型
    numberFormatter(value) {
      return Number(value)
    },
    plusReplaceClick() {
      this.sourceTitle.replaceKeywordsArr.push({
        replaceKey: '',
        replaceValue: ''
      })
    },
    minusReplaceClick(index) {
      this.sourceTitle.replaceKeywordsArr.splice(index, 1)
    },
    submit() {
      return new Promise((resolve, reject) => {
        let {
          price,
          stock,
          sourcePicture,
          sourceTitle,
          sourceDescribe,
          unit,
          skipConfig
        } = this.$data
        // 处理标题关键字替换，兼容后端请求参数
        let obj = {}
        let repeatKeyArr = []
        sourceTitle.replaceKeywordsArr.forEach((item, index) => {
          // 查询是否有重复字段obj.hasOwnProperty(item.replaceKey)
          if (Object.prototype.hasOwnProperty.call(obj, item.replaceKey)) {
            repeatKeyArr.push(item.replaceKey)
          }
          let itemObj = {}
          itemObj[item.replaceKey] = item.replaceValue
          obj = Object.assign(obj, itemObj)
        })
        sourceTitle['replaceKeywords'] = obj
        // 处理跳过配置
        // 初始化
        skipConfig.skinBrand = false
        skipConfig.skinZeroStock = false
        skipConfig.skinHasCrawl = false
        if (skipConfig.skinArr.length > 0) {
          skipConfig.skinArr.forEach((item) => {
            skipConfig[item] = true
          })
        }
        // 来源标题处理——标题关键字重复字段提示
        if (repeatKeyArr.length > 0) {
          let repString = repeatKeyArr.toString()
          this.$message.warning(
            this.$t('goodsCollection.warningContent1') +
              '【' +
              repString +
              '】' +
              this.$t('goodsCollection.warningContent2')
          )
          return
        }
        // 处理来源标题处理——删除关键字重复字段
        let sourceTitleArr = this.keyWordsRepeat(sourceTitle.deleKeywords)
        sourceTitle.deleKeywords =
          sourceTitleArr.length > 0 ? sourceTitleArr.join(',') : ''
        // 来源描述处理——删除关键字重复字段
        let sourceDescribeArr = this.keyWordsRepeat(sourceDescribe.deleKeywords)
        sourceDescribe.deleKeywords =
          sourceDescribeArr.length > 0 ? sourceDescribeArr.join(',') : ''

        let setParams = {
          price,
          stock,
          sourcePicture,
          sourceTitle,
          sourceDescribe,
          skipConfig,
          unit,
          autoClaimStore: this.autoClaimStore ? 1 : 0,
          stores: JSON.stringify(this.stores)
        }
        let setData = { ...this.setData }
        let params = Object.assign(setData, setParams)
        CrawlApi.updateCrawlTemplate(params).then((res) => {
          console.log(res.data)
          resolve(res.data)
        })
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
      // this.sourcePicture.type = event.target.value
      if (event.target.value === 2) {
        this.sourcePicture.skuOneReplaceMain = true
      } else if (event.target.value === 3) {
        this.sourcePicture.randomNum = true
      }
    },
    // 管理关键词
    manageKeyWordsClick(str, type) {
      this.manageVisible = true
      this.keyWordsType = type
      // 去重
      this.keyWordsArr = this.keyWordsRepeat(str)
    },
    manageKeyCancel() {
      this.manageVisible = false
      let obj = this.$refs.keyWords.cancel()
      if (this.keyWordsType === 1) {
        //来源标题处理
        this.sourceTitle.deleKeywords = obj.str
        this.sourceTitle.keyNum = obj.num
      } else {
        //来源描述处理
        this.sourceDescribe.deleKeywords = obj.str
        this.sourceDescribe.keyNum = obj.num
      }
    },
    keyWordsChange(str, num) {
      let arr = str.split(/,|，/).filter((key) => !!key)
      if (num === 1) {
        //来源标题处理
        this.sourceTitle.keyNum = arr.length
      } else {
        //来源描述处理
        this.sourceDescribe.keyNum = arr.length
      }
    },
    keyWordsKeydown(str, num) {
      let arr = str.split(/,|，/).filter((key) => !!key)
      if (num === 1) {
        //来源标题处理
        this.sourceTitle.keyNum = arr.length
      } else {
        //来源描述处理
        this.sourceDescribe.keyNum = arr.length
      }
    },
    // 自动认领
    handleClaimChange(e) {
      this.autoClaimStore = e.target.checked
    },
    claimClick() {
      this.claimVisible = true
      this.storesVisible = this.stores
    },
    claimOk() {
      this.claimVisible = false
      this.stores = this.$refs.storeTable.selectedRowKeys
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
