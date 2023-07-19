<template>
  <div :class="[/discount\/edit/.test($route.path) ? 'me-pa-2' : '']">
    <div class="me-pb-2">
      <a-breadcrumb class="me-ib">
        <a-breadcrumb-item v-if="editType == 'addDiscountPro'">
          在线商品
        </a-breadcrumb-item>
        <a-breadcrumb-item v-else>营销活动</a-breadcrumb-item>
        <a-breadcrumb-item>编辑活动</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-spin :spinning="dataloading">
      <a-page-header class="me-page-header" title="编辑活动信息">
      </a-page-header>
      <div class="me-card">
        <a-form-model
          ref="ruleForm"
          :model="discountInfo"
          :rules="rules"
          labelAlign="right"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-model-item label="选择店铺" prop="storeId">
            <a-select
              v-model="discountInfo.storeId"
              :disabled="
                discountStatus == '接下来的活动' || discountStatus == '进行中'
                  ? true
                  : false
              "
              class="me-w560"
              placeholder="请选择"
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
          <a-form-model-item label="折扣活动名称" prop="discountName">
            <a-input
              v-model="discountInfo.discountName"
              class="me-w560"
              placeholder="请输入"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="折扣活动时间" prop="setTime">
            <a-range-picker
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm:ss"
              class="me-w560"
              v-model="discountInfo.setTime"
              :disabled-date="disabledDate"
              :disabled-time="disabledRangeTime"
              style="min-width: 560px"
              :disabled="
                discountStatus == '接下来的活动' || discountStatus == '进行中'
                  ? true
                  : false
              "
            />
          </a-form-model-item>
        </a-form-model>
      </div>

      <a-page-header class="me-page-header" title="活动商品">
        <template slot="extra">
          <a-button
            key="1"
            type="primary"
            @click="addProduct"
            v-if="dataSource.length > 0"
            class="me-mr-3"
          >
            添加商品
          </a-button>
          <a-radio-group :value="options" v-if="dataSource.length > 0">
            <a-radio-button
              value="option1"
              @click="handleButtonChange('discount')"
            >
              批量折扣
            </a-radio-button>
            <a-radio-button
              value="option1"
              @click="handleButtonChange('stock')"
            >
              批量活动库存
            </a-radio-button>
            <a-radio-button value="option1" @click="handleButtonChange('buy')">
              批量购买限制
            </a-radio-button>
          </a-radio-group>
        </template>
      </a-page-header>
      <div class="me-card protable">
        <a-button
          icon="plus-circle"
          class="addbutton"
          @click="addProduct"
          v-if="dataSource.length == 0"
        >
          添加商品
        </a-button>
        <a-table
          :loading="tableLoading"
          :columns="columns"
          :data-source="dataSource"
          :pagination="getPagination"
          :rowSelection="rowSelection"
          @change="changePage"
          rowKey="itemId"
          v-if="dataSource.length"
        >
          <template slot="product_info" slot-scope="text, record, index">
            <div class="product-info">
              <a-popover :placement="index < 5 ? 'rightTop' : 'rightBottom'">
                <template slot="content">
                  <img
                    v-lazy="record.mainImage"
                    style="width: 280px; height: 280px; border-radius: 2px"
                  />
                </template>
                <img
                  v-lazy="record.mainImage"
                  style="width: 70px; height: 70px; border-radius: 2px"
                />
              </a-popover>

              <div class="info-text">
                <a class="name"> {{ record.name }}</a>
                <p>
                  <span class="me-mr-5 me-status-primary">
                    {{ record.countryCode }}
                  </span>
                </p>
              </div>
            </div>
          </template>
          <template slot="variantsName" slot-scope="text, record">
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p
                  v-for="item in record.variants"
                  :key="item.variationId"
                  class="me-em1"
                  :title="item.name"
                >
                  {{ item.name }}
                </p>
              </div>
            </template>
            <template v-else>-</template>
          </template>
          <!-- 折扣价/促销价 -->
          <template slot="variants" slot-scope="text, record, index">
            <!-- 有变体，在变体里设置折扣价或折扣，无变体，在外层设置折扣价或变体 -->
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p v-for="item in record.variants" :key="item.variationId">
                  <span>
                    价格
                    <a-input-number
                      :min="0"
                      :max="item.price - 1"
                      v-model="item.discountedPrice"
                      class="me-w120"
                      @change="handleChangeDiscountNumber(item, index)"
                      :class="{ warn: !item.discountedPrice }"
                  /></span>
                  <span>或</span>
                  <span>
                    <a-input-number
                      :min="0.1"
                      :max="9.9"
                      v-model="item.percent"
                      class="me-w100"
                      :step="0.1"
                      @change="handlePercentChange(item, index)"
                      :class="{ warn: !item.percent }"
                      :precision="1"
                    />
                    折</span
                  >
                </p>
              </div>
            </template>
            <template v-else>
              <span>
                价格
                <a-input-number
                  :min="0"
                  :max="record.price - 1"
                  v-model="record.discountedPrice"
                  class="me-w120"
                  @change="handleChangeDiscountNumber(record, index)"
                  :class="{ warn: !record.discountedPrice }"
                />
              </span>
              <span>或</span>
              <span>
                <a-input-number
                  :min="0.1"
                  :max="9.9"
                  v-model="record.percent"
                  class="me-w100"
                  @change="handlePercentChange(record, index)"
                  :class="{ warn: !record.percent }"
                  :precision="1"
                />
                折
              </span>
            </template>
          </template>
          <template slot="price" slot-scope="text, record">
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p v-for="item in record.variants" :key="item.variationId">
                  {{ item.price }}
                </p>
              </div>
            </template>
            <template v-else>
              {{ record.price }}
            </template>
          </template>
          <!-- 库存 -->
          <template slot="normalStock" slot-scope="text, record">
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p v-for="item in record.variants" :key="item.variationId">
                  {{ item.normalStock }}
                </p>
              </div>
            </template>
            <template v-else> {{ record.normalStock }} </template>
          </template>
          <!-- 库存限制 -->
          <template slot="promotionStock" slot-scope="text, record, index">
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p v-for="item in record.variants" :key="item.variationId">
                  <a-input-group compact class="me-w190">
                    <a-select
                      v-model="item.stockNumLimit"
                      class="me-w100"
                      @change="onChange(item, index)"
                    >
                      <a-select-option value="1"> 无限制 </a-select-option>
                      <a-select-option value="2"> 设定限制 </a-select-option>
                    </a-select>
                    <a-input-number
                      class="me-w70"
                      v-if="item.stockNumLimit == '2'"
                      v-model="item.promotionStock"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      @change="onChange(item, index)"
                    />
                  </a-input-group>
                </p>
              </div>
            </template>
            <template v-else>
              <a-input-group compact class="me-w190">
                <a-select
                  v-model="record.stockNumLimit"
                  class="me-w100"
                  @change="onChange(record, index)"
                >
                  <a-select-option value="1"> 无限制 </a-select-option>
                  <a-select-option value="2"> 设定限制 </a-select-option>
                </a-select>
                <a-input-number
                  class="me-w70"
                  v-if="record.stockNumLimit == '2'"
                  v-model="record.promotionStock"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  @change="onChange(record, index)"
                />
              </a-input-group>
            </template>
          </template>
          <!-- 购买限制 -->
          <template slot="buyNumLimit" slot-scope="text, record, index">
            <template>
              <a-input-group compact class="me-w190">
                <a-select
                  v-model="record.buyNumLimit"
                  class="me-w100"
                  @change="onChangeBuy(record, index, record.buyNumLimit)"
                >
                  <a-select-option value="1"> 无限制 </a-select-option>
                  <a-select-option value="2"> 设定限制 </a-select-option>
                </a-select>
                <a-input-number
                  class="me-w70"
                  v-if="record.buyNumLimit == '2'"
                  v-model="record.purchaseLimit"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  @change="onChange(record, index)"
                />
              </a-input-group>
            </template>
          </template>
          <template slot="reasons" slot-scope="text, record, index">
            <!-- 是否启用 -->
            <template v-if="record.variants && record.variants.length">
              <div
                class="me-spec-all"
                :class="{ 'me-show': record._viewflag_ }"
              >
                <p v-for="item in record.variants" :key="item.variationId">
                  <!-- {{ item.isOpen }} -->
                  <a-switch
                    v-model="item._isOpen_"
                    @change="chandleChangeOpenStatus(item, index)"
                  ></a-switch>
                </p>
              </div>
            </template>
            <template v-else>-</template>
          </template>
          <template slot="actionSlot" slot-scope="text, record, index">
            <a-button
              type="link"
              class="me-error"
              @click="handleDeleteGoods(record, index)"
              >移除</a-button
            >
            <div>
              <a-button
                type="link"
                @click="viewAll(index)"
                v-if="record.variants"
              >
                {{
                  record._viewflag_
                    ? $t('toBeEdit.shouqi')
                    : $t('toBeEdit.viewall')
                }}
              </a-button>
            </div>
          </template>
        </a-table>

        <a-affix :offset-bottom="0" class="custom-affix">
          <div
            class="button-group"
            :class="{ 'button-group-fixed': affixFixed }"
          >
            <a-space align="center" class="center">
              <a-button class="me-w150 me-h40" @click="goBack"> 取消 </a-button>
              <a-button
                class="me-w150 me-h40"
                type="primary"
                @click="handleValid"
                :loading="saveLoading"
              >
                确认
              </a-button>
            </a-space>
          </div>
        </a-affix>
      </div>
    </a-spin>

    <a-modal
      title="选择商品"
      :visible="editVisible"
      :confirm-loading="sdConfirmLoading"
      @ok="syncOk"
      @cancel="editVisible = false"
      width="800px"
      destroyOnClose
      :maskClosable="false"
    >
      <ProductList
        ref="productlist"
        :storeId="discountInfo.storeId"
        @getCheckPro="getCheckPro"
        :checkedProduct="dataSource"
      />
    </a-modal>

    <a-modal
      title="批量设置"
      :visible="batchVisible"
      @cancel="resetForm, (batchVisible = false)"
      width="450px"
      destroyOnClose
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button @click="applyChecked" class="me-mr-1"> 应用至选中 </a-button>
        <a-button type="primary" @click="syncOkBatch"> 应用至全部 </a-button>
      </template>
      <a-form-model
        ref="ruleForm2"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          ref="discount"
          label="批量折扣数:"
          prop="discount"
          v-if="batchModel == 'discount'"
        >
          <a-input-number
            v-model="form.discount"
            :min="0.1"
            :max="9.9"
            :step="0.1"
          />
        </a-form-model-item>
        <a-form-model-item
          ref="stock"
          label="批量活动库存:"
          prop="stock"
          v-if="batchModel == 'stock'"
        >
          <a-input-number v-model="form.stock" :min="0" :max="100000" />
        </a-form-model-item>
        <a-form-model-item
          ref="buy"
          label="批量购买限制:"
          prop="buy"
          v-if="batchModel == 'buy'"
        >
          <a-input-number v-model="form.buy" :min="0" :max="100000" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import Discount from '@/api/discount'
// import { mcl, division } from '@/util'
// import { limitPercentNumber } from '@/directive/number'
import moment from 'moment'
import ProductList from './components/ProductList'
import tableMixins from '@/mixins/tableMixins'
import { mcl, division } from '@/util'
import { cloneDeep } from 'lodash'
import { disabledDate, disabledRangeTime } from '@/util/timeOperation'

export default {
  mixins: [tableMixins],
  components: {
    ProductList
  },
  data() {
    return {
      disabledDate,
      disabledRangeTime,
      editVisible: false,
      sdConfirmLoading: false,
      affixFixed: false,
      moment,
      paginationData: {},
      // discountId: null, //当前折扣ID
      storeList: [], //店铺列表
      addGoodVisible: false, //添加商品弹框可见
      columns: [
        {
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' },
          title: '商品名称',
          width: 350
        },
        {
          title: '规格名称',
          key: 'variantsName',
          dataIndex: 'variantsName',
          scopedSlots: { customRender: 'variantsName' },
          width: 170
        },
        {
          title: '促销价/ 折扣',
          key: 'variants',
          dataIndex: 'variants',
          scopedSlots: { customRender: 'variants' },
          width: 320
        },
        {
          title: '价格',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          dataIndex: 'price',
          width: 100
        },
        {
          title: '库存',
          key: 'normalStock',
          scopedSlots: { customRender: 'normalStock' },
          dataIndex: 'normalStock',
          width: 100
        },
        {
          title: '库存限制',
          key: 'promotionStock',
          scopedSlots: { customRender: 'promotionStock' },
          dataIndex: 'promotionStock',
          width: 100
        },
        {
          title: '购买限制',
          key: 'buyNumLimit',
          dataIndex: 'buyNumLimit',
          scopedSlots: { customRender: 'buyNumLimit' },
          width: 50
        },
        {
          title: '启用/停用',
          key: 'reasons',
          dataIndex: 'reasons',
          scopedSlots: { customRender: 'reasons' },
          width: 100
        },
        {
          title: this.$t('common.handler'),
          key: 'actionSlot',
          dataIndex: 'actionSlot',
          scopedSlots: { customRender: 'actionSlot' }
        }
      ],
      // discountGoodsList: [], //参加活动的商品
      // discountGoodsListSource: [], //源
      // goodsList: [], //可选商品列表
      // discountGoodsCheckAll: false,
      // indeterminate: false,

      discountInfo: {
        storeId: null,
        discountName: null,
        setTime: null
      },
      // 活动信息规则
      rules: {
        storeId: [
          {
            required: true,
            message: this.$t('discount.inputChoseStore'),
            trigger: 'blur'
          }
        ],
        discountName: [
          {
            required: true,
            message: this.$t('discount.inputActName'),
            trigger: 'blur'
          }
        ],
        setTime: [
          {
            required: true,
            message: '请选择时间范围'
          }
        ]
      },

      //批量操作
      batch: {
        discountPercent: null,
        limitNumber: null,
        buyNumLimit: '1'
      },
      isCopy: false, //如果是拷贝需要做两件事，把变体的isOpen全部默认打开，在提交时用新增接口
      discountStatus: '', // 折扣状态，状态是'进行中'时，不再判定开始时间
      goodsName: '',
      dataloading: false,
      estimateGoods: [], //选中商品弹窗翻页记录选中状态
      saveLoading: false,
      options: 'option1', // 按钮组
      batchVisible: false,
      batchModel: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        discount: 9,
        stock: 0,
        buy: 1
      }
    }
  },
  computed: {
    // 开关0 1 转换
    calcIsOpen: {
      get: function() {
        return true
      },
      set: function(newVal) {
        console.log(newVal)
      }
    },
    editType() {
      return this.$route.query.edit
    },
    discountId() {
      return this.$route.query.id
    }
  },
  watch: {},
  created() {
    this.getStoreAllStore()
  },
  async mounted() {
    // 编辑时获取活动详情
    if (this.$route.query.id) {
      this.$data.dataloading = true
      await this.getDiscountDetail()
      // this.$data.dataloading = false
    }
    // this.isCopy = this.$route.query.copy
  },
  methods: {
    async loadData(flag) {},
    getTableData() {
      var data = { records: [] }
      return data
    },
    affixChange(val) {
      this.affixFixed = val
    },

    //获取所有可用店铺
    getStoreAllStore() {
      Store.getAllStore({ platform: 1 }).then(({ data }) => {
        this.storeList = data
      })
    },
    goBack() {
      // this.$router.push('/discount/list')
      if (this.editType == 'addDiscountPro') {
        this.$router.push('/goods/on-sale')
      } else {
        this.$router.go(-1)
      }
    },
    async handleValid() {
      let { discountName, storeId, setTime } = this.$data.discountInfo
      let { dataSource } = this.$data
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.validDataSource()) {
            this.$data.saveLoading = true
            // 编辑活动
            if (this.discountId) {
              console.log('编辑')

              //编辑活动
              let updateItems = []
              let addItems = []
              dataSource.forEach((item) => {
                if (item.isNew) {
                  addItems.push(item)
                }
                if (item.isChange && !item.isNew) {
                  updateItems.push(item)
                }
              })
              addItems = this.computedData(addItems)
              updateItems = this.computedData(updateItems)
              let params = {
                discountName: discountName,
                startTime: moment(setTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(setTime[1]).format('YYYY-MM-DD HH:mm:ss'),
                storeId: storeId,
                discountId: this.discountId,
                updateItems: updateItems,
                addItems: addItems
              }
              console.log(params)
              const data = await Discount.updateDiscountProduct(params).finally(
                () => {
                  this.$data.saveLoading = false
                }
              )
              if (data.code == 0) {
                this.$message.success(this.$t('common.handlerSuccess'))
              }
              this.$data.saveLoading = false
              // 从在线商品列表参加活动过来添加完成后，清除信息，返回在线商品
              if (this.editType == 'addDiscountPro') {
                sessionStorage.setItem('addDiscountPro', {})
                this.openPage(`/goods/on-sale`)
              } else {
                this.goBack()
              }
            } else {
              // 添加活动,添加产品初始折扣和折扣价为null,如果用户设置了折扣，需要将折扣和折扣价给后端；如果用户设置了折扣价，给折扣价
              dataSource.forEach((item) => {
                if (item.variants) {
                  // 启用 停用设置
                  item.variants.forEach((it) => {
                    if (it.buyNumLimit == '1') {
                      it.purchaseLimit = 0
                    }
                    if (it.stockNumLimit == '1') {
                      it.promotionStock = 0
                    }
                  })
                } else {
                  if (item.buyNumLimit == '1') {
                    item.purchaseLimit = 0
                  }
                  if (item.stockNumLimit == '1') {
                    item.promotionStock = 0
                  }
                }
              })
              // 有折扣，计算价格给后端，不体现在页面上
              let data = this.computedData(dataSource)
              let params = {
                discountName: discountName,
                startTime: moment(setTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(setTime[1]).format('YYYY-MM-DD HH:mm:ss'),
                storeId: storeId,
                items: data
              }
              let diff =
                (new Date(moment(setTime[0]).format('YYYY-MM-DD HH:mm:ss')) -
                  new Date(moment(setTime[1]).format('YYYY-MM-DD HH:mm:ss'))) /
                (24 * 60 * 60 * 1000)
              if (Math.abs(diff) > 180) {
                this.$message.error(this.$t('discount.less180'))
                this.$data.saveLoading = false
                return
              }
              await Discount.addDiscount(params).finally(() => {
                this.$data.saveLoading = false
              })
              this.$message.success(this.$t('common.handlerSuccess'))
              this.goBack()
            }
          } else {
            this.$message.error('请完善活动商品中红色标记的数值!')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    validDataSource() {
      const { dataSource } = this.$data
      var isValid = true
      dataSource.map((item) => {
        if (item.variants) {
          item.variants.map((it) => {
            if (it.discountedPrice == null && it.percent == null) {
              // console.log(it.discountedPrice, it.percent)
              isValid = false
              return
            }
          })
        } else {
          if (item.discountedPrice == null && item.percent == null) {
            isValid = false
            return
          }
        }
      })
      return isValid
    },
    // 有折扣，计算价格给后端，不体现在页面上
    computedData(dataSource) {
      let data = cloneDeep(dataSource)
      data.forEach((item) => {
        if (item.variants) {
          item.variants.forEach((it) => {
            if (it.percent) {
              it.discountedPrice = mcl(it.price, it.percent * 0.1).toFixed(2)
            }
          })
        } else {
          item.discountedPrice = mcl(item.price, item.percent * 0.1).toFixed(2)
        }
      })
      return data
    },
    addProduct() {
      const { discountInfo } = this.$data
      console.log(discountInfo)
      if (discountInfo.storeId == null) {
        this.$message.error('请先选择店铺！')
        return
      }
      this.$data.editVisible = true
    },
    syncOk() {
      this.$refs.productlist.getCheckPro()
    },
    getCheckPro(data) {
      // this.$data.sdConfirmLoading = true
      console.log('s')
      if (data.length != 0) {
        this.$data.editVisible = false
      }
      // selectedGoods.map((el) => {
      //   el.isNew = 1
      // })
      console.log(data)
      const converData = []
      data.map((item) => {
        converData.push({
          id: item.id,
          itemId: item.itemId,
          mainImage: item.mainImage,
          name: item.name,
          countryCode: item.countryCode,
          normalStock: item.stock,
          price: item.price,
          reasons: item.reasons,
          isNew: 1, // 新添加的产品
          buyNumLimit: '1', // 是否限制购买，1不限制
          purchaseLimit: 0, // 设定限制数
          stockNumLimit: '1', // 库存限制
          promotionStock: 0, //库存限制数
          percent: null, // 折扣设定
          discountedPrice: null, // 折扣价
          variants: this.changeVariants(item.variants),
          _viewflag_: false
        })
      })
      this.$data.dataSource = this.$data.dataSource.concat(converData)
      console.log('e')
    },
    changeVariants(variants) {
      if (variants && variants.length) {
        variants = variants.map((item) => {
          // item.isOpen = 1
          this.$set(item, 'isOpen', 1)
          this.$set(item, '_isOpen_', true)
          this.$set(item, 'percent', null)
          this.$set(item, 'discountedPrice', null)
          // this.$set(item, 'buyNumLimit', '1')
          // this.$set(item, 'purchaseLimit', 0)
          this.$set(item, 'stockNumLimit', '1')
          this.$set(item, 'promotionStock', 0)
          this.$set(item, 'normalStock', item.stock)
          return item
        })
        return variants
      }
    },
    // 活动变体开关
    chandleChangeOpenStatus(item, index) {
      item.isOpen = item._isOpen_ ? 1 : 0
      this.$data.dataSource[index].isChange = true
    },
    //折扣输入变化
    handlePercentChange(record, index) {
      this.$data.dataSource[index].isChange = true

      let { percent, price } = record
      this.$set(record, 'discountedPrice', mcl(price, percent * 0.1).toFixed(2))
    },
    //折扣价输入变化
    handleChangeDiscountNumber(record, index) {
      this.$data.dataSource[index].isChange = true

      let { price, discountedPrice } = record
      console.log(record)
      this.$set(
        record,
        'percent',
        division(discountedPrice * 10, price).toFixed(2)
      )
    },
    viewAll(index) {
      this.$data.dataSource[index]._viewflag_ = !this.$data.dataSource[index]
        ._viewflag_
    },
    getDiscountDetail() {
      Discount.getDiscountDetail({ discountId: this.discountId })
        .then(({ data }) => {
          this.$data.discountInfo.storeId = data.storeId
          this.$data.discountInfo.discountName = data.discountName
          this.$data.discountInfo.setTime = [data.startTime, data.endTime]
          this.$data.discountStatus = data.status
          data.items.forEach((item) => {
            this.$set(item, '_viewflag_', false)
            this.$set(item, 'isNew', 0)

            if (item.variants) {
              // 启用 停用设置
              item.variants.forEach((it) => {
                const percent =
                  Number.parseFloat(it.discountedPrice / it.price) * 10
                this.$set(it, 'percent', percent.toFixed(2))
                if (it.isOpen == 1) {
                  this.$set(it, '_isOpen_', true)
                } else {
                  this.$set(it, '_isOpen_', false)
                }
                it.promotionStock == 0
                  ? this.$set(it, 'stockNumLimit', '1')
                  : this.$set(it, 'stockNumLimit', '2')
              })
              item.purchaseLimit == 0
                ? this.$set(item, 'buyNumLimit', '1')
                : this.$set(item, 'buyNumLimit', '2')
            } else {
              console.log(item)
              const percent =
                Number.parseFloat(item.discountedPrice / item.price) * 101
              this.$set(item, 'percent', percent.toFixed(2))
              if (item.isOpen == 1) {
                this.$set(item, '_isOpen_', true)
              } else {
                this.$set(item, '_isOpen_', false)
              }
              item.purchaseLimit == 0
                ? this.$set(item, 'buyNumLimit', '1')
                : this.$set(item, 'buyNumLimit', '2')
              item.promotionStock == 0
                ? this.$set(item, 'stockNumLimit', '1')
                : this.$set(item, 'stockNumLimit', '2')
            }
          })
          this.$data.dataSource = data.items
          console.log(this.$data.dataSource)
        })
        .finally(() => {
          this.$data.dataloading = false
          if (this.editType == 'addDiscountPro') {
            let item = JSON.parse(sessionStorage.getItem('addDiscountPro'))
            console.log(item)
            let converData = {
              id: item.id,
              itemId: item.itemId,
              mainImage: item.mainImage,
              name: item.name,
              countryCode: item.countryCode,
              normalStock: item.stock,
              price: item.price,
              reasons: item.reasons,
              isNew: 1, // 新添加的产品
              buyNumLimit: '1', // 是否限制购买，1不限制
              purchaseLimit: 0, // 设定限制数
              stockNumLimit: '1', // 库存限制
              promotionStock: 0, //库存限制数
              percent: null, // 折扣设定
              discountedPrice: null, // 折扣价
              variants: this.changeVariants(item.variants),
              _viewflag_: false
            }
            this.$data.dataSource = this.$data.dataSource.concat(converData)
          }
        })
    },
    handleDeleteGoods(record, index) {
      // add type
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定删除当前产品吗？',
        onOk: async () => {
          // 删除本地dataSource数据，或保存的活动产品
          if (record.isNew) {
            this.$data.dataSource.splice(index, 1)
          } else {
            const data = await Discount.deleteDiscountProduct({
              discountId: this.discountId,
              itemIds: [record.itemId]
            })
            if (data.code == 0) {
              this.$message.success(this.$t('common.handlerSuccess'))
              this.$data.dataSource.splice(index, 1)
            } else {
              this.$message.error(data.message)
            }
          }
        }
      })
    },
    onChangeBuy(item, index, buyNumLimit) {
      this.$data.dataSource[index].isChange = true
      if (buyNumLimit == '1') {
        this.$set(item, 'purchaseLimit', 0)
      }
    },
    onChange(item, index) {
      this.$data.dataSource[index].isChange = true
    },
    handleButtonChange(e) {
      this.$data.batchModel = e
      this.$data.batchVisible = true
      // this.resetForm()
    },
    // 应用至全部
    syncOkBatch() {
      const { dataSource, selectedRows, selectedRowKeys } = this.$data
      dataSource.forEach((item) => {
        this.$set(item, 'isChange', true)
        this.batchChangeData(item)
      })
      this.$data.batchVisible = false
    },
    // 应用至选中
    applyChecked() {
      const { dataSource, selectedRows, selectedRowKeys } = this.$data
      if (!selectedRowKeys.length) {
        this.errorAlert(this.$t('discount.inputChoseGoods'))
        return
      }
      dataSource.forEach((item) => {
        if (selectedRowKeys.includes(item.itemId)) {
          this.$set(item, 'isChange', true)
          this.batchChangeData(item)
        }
      })
      this.$data.batchVisible = false
    },
    batchChangeData(item) {
      const { batchModel } = this.$data
      const { discount, stock, buy } = this.$data.form
      if (item.variants && item.variants.length) {
        item.variants.map((ele) => {
          if (batchModel == 'discount') {
            // 批量折扣
            this.$set(
              ele,
              'discountedPrice',
              mcl(ele.price, discount * 0.1).toFixed(2)
            )
            this.$set(ele, 'percent', discount)
          }
          if (batchModel == 'stock') {
            // 批量库存
            if (stock == 0) {
              this.$set(ele, 'stockNumLimit', '1')
              this.$set(ele, 'promotionStock', 0)
            } else {
              this.$set(ele, 'stockNumLimit', '2')
              this.$set(ele, 'promotionStock', stock)
            }
          }
        })
      } else {
        const discountedPrice = mcl(item.price, discount * 0.1).toFixed(2)
        if (batchModel == 'discount') {
          this.$set(item, 'discountedPrice', discountedPrice)
          this.$set(item, 'percent', discount)
        }
        if (batchModel == 'stock') {
          // 批量库存
          if (stock == 0) {
            this.$set(item, 'stockNumLimit', '1')
            this.$set(item, 'promotionStock', 0)
          } else {
            this.$set(item, 'stockNumLimit', '2')
            this.$set(item, 'promotionStock', stock)
          }
        }
      }
      //批量购买限制，在最外层，不在变体里
      if (batchModel == 'buy') {
        if (buy == 0) {
          this.$set(item, 'buyNumLimit', '1')
          this.$set(item, 'purchaseLimit', 0)
        } else {
          this.$set(item, 'buyNumLimit', '2')
          this.$set(item, 'purchaseLimit', buy)
        }
      }
      return item
    },
    resetForm() {
      this.$refs.ruleForm2.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '@/theme/table.scss';
.ant-form-item {
  margin-right: 30px;
  margin-bottom: 5px;
}
.button-group {
  padding: 10px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  &-fixed {
    background-color: #ffffff;
    box-shadow: 0 -2px 6px 0 rgb(0 0 0 / 12%);
  }
}
.addbutton {
  color: $primaryColor;
  border: 1px solid $primaryColor;
}

@import './components/table.scss';
@import '@/theme/mixins.scss';
.me-em1 {
  @include ellipsisMultiline(1);
}
.me-w100 {
  width: 100px;
}
.me-w120 {
  width: 120px;
}
.me-w150 {
  width: 150px;
}
.me-w190 {
  width: 190px;
}
.me-w560 {
  width: 560px;
}
.me-h40 {
  height: 40px;
}
.warn {
  border: 1px solid red;
}
.me-spec-all {
  height: 72px;
  overflow: hidden;
}
.me-show {
  height: auto;
}
</style>

<style lang="scss">
.protable {
  p {
    height: 36px;
    line-height: 36px;
  }
  .ant-input-group-addon {
    padding: 0 3px;
  }
}
</style>
