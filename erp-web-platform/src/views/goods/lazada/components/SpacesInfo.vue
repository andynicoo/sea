<template>
  <div>
    <a-form-model
      :model="product"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <template v-if="product.specsInfo && product.specsInfo.length">
        <a-form-model-item label="规格名称" name="spaces" required>
          <div class="spaces-content">
            <a-form-model-item
              v-for="(space, index) in product.specsInfo"
              :key="index"
              class="me-mb-0"
            >
              <a-form-model-item class="space-name me-mb-0">
                <span>
                  {{ space.name }}
                </span>
              </a-form-model-item>
              <a-form-model-item class="me-mb-0">
                <a-form-model-item
                  v-for="(option, cindex) in spaceInfoHide
                    ? space.options.slice(0, 10)
                    : space.options"
                  :key="cindex"
                  class="spaces-option"
                  :validate-status="spaceValidates[index][cindex] && 'error'"
                  :help="spaceValidates[index][cindex]"
                >
                  <a-select
                    :disabled="$route.query.edit == 2"
                    v-model="space.options[cindex]"
                    showSearch
                    @search="onSpaceSearch($event, index)"
                    @select="onSpaceSelect"
                  >
                    <a-select-option
                      v-for="option in space.__options__"
                      :value="option"
                      :key="option"
                      :disabled="space.options.includes(option)"
                    >
                      {{ option }}
                    </a-select-option>
                  </a-select>
                  <template v-if="space.options.length > 1">
                    <a-button
                      :disabled="$route.query.edit == 2"
                      shape="circle"
                      class="me-ml-2"
                      @click="onRemoveSpaceOption(index, cindex)"
                    >
                      <a-icon type="delete" />
                    </a-button>
                  </template>
                </a-form-model-item>
                <p class="me-mb-2 me-error" v-if="spaceOptionsValidates[index]">
                  {{ spaceOptionsValidates[index] }}
                </p>
                <a-button
                  :disabled="$route.query.edit == 2"
                  type="dashed"
                  block
                  @click="onOptionsPush(index)"
                >
                  <a-icon type="plus" />
                </a-button>
              </a-form-model-item>
            </a-form-model-item>
          </div>
          <div class="me-text-center" v-if="hasAnyOptionsLength">
            <template v-if="spaceInfoHide">
              <span class="me-link-h" @click="spaceInfoHide = false">展开</span>
            </template>
            <template v-else>
              <span class="me-link-h" @click="spaceInfoHide = true">收起</span>
            </template>
          </div>
        </a-form-model-item>
      </template>

      <a-form-model-item
        label="商品规格列表"
        required
        :validateStatus="variationsTableErrors.length ? 'error' : ''"
        :help="variationsTableErrors.length && variationsTableErrors.join()"
      >
        <a-table
          :scroll="{ x: 1700 }"
          bordered
          :columns="columns"
          :data-source="
            variationsHide
              ? product.variationsRecordVOList.slice(0, 10)
              : product.variationsRecordVOList
          "
          :pagination="false"
        >
          <span
            v-for="(spec, index) in product.specsInfo"
            :key="index"
            :slot="`spaces_${index}`"
            slot-scope="text, record"
          >
            <template v-if="record.specsData">
              {{ record.specsData[spec.name] }}
            </template>
          </span>

          <!-- 图片 -->
          <template slot="images" slot-scope="text, record, index">
            <template v-if="text">
              <a-popover>
                <template slot="content">
                  <EditImages
                    @change="(value) => onEditImagesChange(value, index)"
                    :images="text"
                    :storeId="product.storeId"
                  />
                </template>
                <template v-if="text.length">
                  <img style="width: 30px" :src="text[0]" />
                </template>
                共 {{ text.length }} 张图片
                <p class="images-error">
                  {{
                    variationValidates[index] &&
                      variationValidates[index].images
                  }}
                </p>
              </a-popover>
            </template>
          </template>

          <!-- SKU Head -->
          <template slot="imagesHead">
            <span class="ant-form-item-required"> sku图片 </span>
          </template>

          <!-- SKU Head -->
          <template slot="variationsSkuHead">
            <span class="ant-form-item-required">
              SKU
              <a-button
                :disabled="$route.query.edit == 2"
                type="link"
                size="small"
                @click="skuVisible = true"
              >
                一键生成
              </a-button>
            </span>
          </template>

          <!-- stock Head -->
          <template slot="stockHead">
            <a-space>
              <span> 库存 </span>
              <a-input ref="stockHeadInput" size="small" style="width: 100px" />
              <a-button @click="applayStock" size="small" type="link">
                应用全部
              </a-button>
            </a-space>
          </template>

          <!-- price Head -->
          <template slot="priceHead">
            <a-space>
              <span class="ant-form-item-required"> 价格 </span>
              <!-- <a-input ref="priceHeadInput" size="small" style="width: 100px" /> -->

              <a-input-number
                ref="priceHeadInput"
                :min="0"
                :precision="2"
                size="small"
                style="width: 100px"
              />
              <a-button @click="applayPrice" size="small" type="link">
                应用全部
              </a-button>
            </a-space>
          </template>

          <!-- specialPrice Head -->
          <template slot="specialPriceHead">
            <a-space>
              <span> 促销价 </span>
              <!-- <a-input
                ref="specialPriceHeadInput"
                size="small"
                style="width: 100px"
              /> -->
              <a-input-number
                ref="specialPriceHeadInput"
                :min="0"
                :precision="2"
                size="small"
                style="width: 100px"
              />
              <a-button @click="applaySpecialPrice" size="small" type="link">
                应用全部
              </a-button>
            </a-space>
          </template>

          <!-- specialFromTime Head -->
          <template slot="specialFromTimeHead">
            <a-space>
              <span> 促销时间 </span>
              <a-range-picker
                @change="onDatePickerChange"
                size="small"
                style="width: 100px"
              />
              <a-button @click="applaySpecialFromTime" size="small" type="link">
                应用全部
              </a-button>
            </a-space>
          </template>

          <!-- SKU -->
          <template slot="variationsSku" slot-scope="text, record, index">
            <a-form-model-item
              class="me-mb-0"
              :validate-status="
                variationValidates[index] &&
                variationValidates[index].variationsSku
                  ? 'error'
                  : 'success'
              "
              :help="
                variationValidates[index] &&
                  variationValidates[index].variationsSku
              "
            >
              <a-input
                :disabled="$route.query.edit == 2"
                :value="text"
                @blur="onFieldBlur($event, index, 'variationsSku')"
              />
            </a-form-model-item>
          </template>

          <!-- 库存 -->
          <template slot="stock" slot-scope="text, record, index">
            <a-input
              :value="text"
              @blur="onFieldBlur($event, index, 'stock')"
            />
          </template>

          <!-- 价格 -->
          <template slot="price" slot-scope="text, record, index">
            <a-form-model-item
              class="me-mb-0"
              :validate-status="
                variationValidates[index] && variationValidates[index].price
                  ? 'error'
                  : 'success'
              "
              :help="
                variationValidates[index] && variationValidates[index].price
              "
            >
              <a-input-number
                :value="text"
                :min="0"
                :precision="2"
                style="width: 225px"
                @blur="onFieldBlur($event, index, 'price')"
              />
            </a-form-model-item>
          </template>

          <!-- 促销价 -->
          <template slot="specialPrice" slot-scope="text, record, index">
            <a-input-number
              :value="text"
              :min="0"
              :precision="2"
              style="width: 225px"
              @blur="onFieldBlur($event, index, 'specialPrice')"
            />
          </template>

          <!-- 促销时间 -->
          <template slot="specialFromTime" slot-scope="text, record">
            <a-range-picker
              :value="[record.specialFromTime, record.specialToTime]"
              @change="onSpecTimeChange($event, record)"
            />
          </template>

          <!-- 操作 -->
          <template slot="actions"> 应用全部 </template>

          <template
            slot="footer"
            v-if="product.variationsRecordVOList.length > 10"
          >
            <template v-if="variationsHide">
              <p class="me-text-center">
                <span class="me-link-h" @click="variationsHide = false">
                  展开
                </span>
              </p>
            </template>
            <template v-else>
              <p class="me-text-center">
                <span class="me-link-h" @click="variationsHide = true">
                  收起
                </span>
              </p>
            </template>
          </template>
        </a-table>
      </a-form-model-item>
    </a-form-model>

    <a-modal v-model="skuVisible" title="SKU生成规则" @ok="onGenerator">
      <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item class="me-mb-0" label="前缀">
          <a-input v-model="skuPrefix" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import bus from '@/bus'
import EditImages from './EditImages.vue'
import { cloneDeep, range } from 'lodash'
import moment from 'moment'

export default {
  components: {
    EditImages
  },
  data() {
    return {
      dateString: [],
      spaceValidates: [[], []],
      spaceOptionsValidates: [],
      variationValidates: [],
      variationsTableErrors: [],
      skuVisible: false,
      variationsHide: true,
      spaceInfoHide: true,
      skuPrefix: ''
    }
  },
  props: {
    product: Object
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  mounted() {
    bus.$on(
      'lazadaEditBasicInfoCategoryChange',
      this.onLazadaEditBasicInfoCategoryChange
    )
  },
  destroyed() {
    bus.$off('lazadaEditBasicInfoCategoryChange')
  },
  computed: {
    rules() {
      return {}
    },
    columns() {
      const specsInfo = this.$props.product.specsInfo
      const getSpecsColumns = () => {
        if (!specsInfo) return []
        return specsInfo.map((spec, index) => {
          return {
            title: spec.name,
            dataIndex: `spaces_${index}`,
            key: `spaces_${index}`,
            scopedSlots: { customRender: `spaces_${index}` },
            width: 130
          }
        })
      }

      return [
        {
          dataIndex: 'images',
          key: 'images',
          scopedSlots: { customRender: 'images' },
          slots: { title: 'imagesHead' },
          width: 130
        },
        {
          dataIndex: 'variationsSku',
          key: 'variationsSku',
          scopedSlots: { customRender: 'variationsSku' },
          slots: { title: 'variationsSkuHead' },
          width: 250
        },
        ...getSpecsColumns(),
        {
          dataIndex: 'stock',
          key: 'stock',
          scopedSlots: { customRender: 'stock' },
          slots: { title: 'stockHead' },
          width: 250
        },
        {
          dataIndex: 'price',
          key: 'price',
          scopedSlots: { customRender: 'price' },
          slots: { title: 'priceHead' },
          width: 250
        },
        {
          dataIndex: 'specialPrice',
          key: 'specialPrice',
          scopedSlots: { customRender: 'specialPrice' },
          slots: { title: 'specialPriceHead' },
          width: 270
        },
        {
          dataIndex: 'specialFromTime',
          key: 'specialFromTime',
          scopedSlots: { customRender: 'specialFromTime' },
          slots: { title: 'specialFromTimeHead' },
          width: 270
        }
        // {
        //   title: '操作',
        //   dataIndex: 'actions',
        //   key: 'actions',
        //   scopedSlots: { customRender: 'actions' },
        //   width: 100,
        //   align: 'center'
        // }
      ]
    },
    hasAnyOptionsLength() {
      const optionss = this.$props.product.specsInfo.filter(({ options }) => {
        return options.length > 10
      })
      return optionss.length > 0
    }
  },
  methods: {
    onDatePickerChange(date, dateString) {
      this.$data.dateString = dateString
    },
    async validate() {
      await this.validateSpecsInfo()
      await this.validateVariations()
      return Promise.resolve()
    },
    /**校验规格 */
    validateSpecsInfo() {
      const product = this.$props.product
      const spaceValidates = this.$data.spaceValidates
      const spaceOptionsValidates = this.$data.spaceOptionsValidates
      if (!product.specsInfo) return
      const vspecs = product.specsInfo.map((spec, index) => {
        this.$set(spaceOptionsValidates, index, null)
        if (!spec.options.length) {
          this.$set(spaceOptionsValidates, index, '请至少添加一个规格属性')
          this.$data.spaceInfoHide = false
          return Promise.reject('请至少添加一个规格属性')
        }
        const voptions = spec.options.map((option, cindex) => {
          if (!option) {
            this.$set(spaceValidates[index], cindex, '请选择规格')
            this.$data.spaceInfoHide = false
            return Promise.reject(false)
          } else {
            this.$set(spaceValidates[index], cindex, null)
            return Promise.resolve()
          }
        })
        return Promise.all(voptions)
      })
      return Promise.all(vspecs)
    },
    /**校验变体 */
    validateVariations() {
      const product = this.$props.product
      const variationValidates = this.$data.variationValidates
      const variationsTableErrors = this.$data.variationsTableErrors
      const list = product.variationsRecordVOList

      const vvariations = list.map((variation, index) => {
        let valid = true
        let errors = {}

        if (!variation.images || !variation.images.length) {
          errors.images = '请上传图片'
          valid = false
        }

        if (!variation.variationsSku) {
          errors.variationsSku = '请输入SKU'
          valid = false
        }

        if (!variation.price) {
          errors.price = '请输入价格'
          valid = false
        }

        this.$set(variationValidates, index, errors)
        if (valid) return Promise.resolve()
        this.$data.variationsHide = false
        return Promise.reject()
      })
      if (!list.length) {
        this.$set(variationsTableErrors, 0, '请至少保留一个SKU')
        this.$data.variationsHide = false
        return Promise.reject('请至少保留一个SKU')
      }
      if (list.length > 50) {
        this.$set(variationsTableErrors, 0, 'SKU数量不能大于50个')
        this.$data.variationsHide = false
        return Promise.reject('SKU数量不能大于50个')
      }
      return Promise.all(vvariations)
    },
    /**类目选择改变事件 */
    onLazadaEditBasicInfoCategoryChange(value) {
      const specsProps = value
        .filter(({ isSaleProp, attributeType }) => {
          return isSaleProp && attributeType === 'sku'
        })
        .slice(0, 2)
      const specsInfo = cloneDeep(this.$props.product.specsInfo)

      if (!specsInfo) return

      console.log(specsProps)

      this.$props.product.specsInfo = specsProps.map((ele, index) => {
        const getOptions = () => {
          if (!ele.options) return []
          return ele.options.map(({ name }) => name)
        }
        return {
          imagesUrl: [],
          name: ele.name,
          __options__: getOptions(),
          __cp_options__: getOptions(),
          options: specsInfo[index] ? specsInfo[index].options : []
        }
      })

      /**加一个默认规格值 */
      this.$props.product.specsInfo.forEach((info) => {
        if (!info.options.length) this.onOptionsPush(1, info.__options__[0])
      })

      this.renderSpaces(this.$props.product)
    },
    /**字段值失去焦点事件 */
    onFieldBlur(event, index, field) {
      const value = event.target.value
      const product = this.$props.product
      product.variationsRecordVOList[index][field] = value
      this.renderSpaces(product)
    },
    /**时间修改事件 */
    onSpecTimeChange(event, record) {
      if (!event || !event.length) return
      const [startTime, endTime] = event
      const fmt = 'YYYY-MM-DD HH:mm:ss'
      this.$set(record, 'specialFromTime', moment(startTime).format(fmt))
      this.$set(record, 'specialToTime', moment(endTime).format(fmt))
    },
    /**字段搜索功能 */
    onSpaceSearch(event, index) {
      const product = this.$props.product
      console.log(product.specsInfo)
      let __cp_options__ = product.specsInfo[index].__cp_options__
      product.specsInfo[index].__options__ = [event, ...__cp_options__]
      this.$emit('input', product)
    },
    /**规格新增 */
    onOptionsPush(index, value) {
      const product = this.$props.product
      product.specsInfo[index].options.push(value)
      this.renderSpaces(product)
      this.$data.spaceValidates = [[], []]
      this.$data.variationValidates = []
      this.$data.spaceOptionsValidates = []
      this.$data.spaceInfoHide = false
      this.$data.variationsHide = false
    },
    /**规格删除 */
    onRemoveSpaceOption(index, cindex) {
      const product = this.$props.product
      product.specsInfo[index].options.splice(cindex, 1)
      this.renderSpaces(product)
      this.$data.spaceValidates = [[], []]
      this.$data.variationValidates = []
    },
    /**规格选择事件 */
    onSpaceSelect() {
      this.renderSpaces()
    },
    /**变体渲染 */
    renderSpaces(product = this.$props.product) {
      if (!product.specsInfo) return
      const historyList = cloneDeep(product.variationsRecordVOList)
      let variationsSku = this.renderVariationsSku(product)
      const list = this.mergeVariants(historyList, variationsSku)
      product.variationsRecordVOList = list
      this.$emit('input', product)
    },
    /**生成索引 */
    renderVariationsSku(product = this.$props.product) {
      const specsInfo = product.specsInfo
      const ranges = specsInfo.map(({ options }) => range(options.length))
      let __indexs__ = []
      const befor = range(ranges.length).map((index) => {
        return `specsInfo[${index}].options.forEach((index${index}) => {`
      })
      const after = range(ranges.length).map(() => `})`)
      const center = range(ranges.length).map((index) => `index${index}`)
      const centerStr = `__indexs__.push([${center.join(',')}])`
      const evalStr = [...befor, centerStr, ...after].join('')
      eval(evalStr)
      return __indexs__
    },
    /**合并 */
    mergeVariants(olds = [], next) {
      const productRecordId = this.$props.product.productRecordId
      const specsInfo = this.$props.product.specsInfo
      return next.map((vindex, index) => {
        const specsData = {}
        vindex.forEach((value, index) => {
          specsData[specsInfo[index].name] = value
        })
        let current = olds.find((old) => old.vindex === vindex.join())
        if (!current) {
          current = {
            ...olds[index],
            images: olds[index]?.images || [],
            productRecordId: productRecordId,
            specsData: specsData,
            variationsSku: vindex.join(' - '),
            vindex: vindex.join(',')
          }
        } else {
          current.specsData = specsData
        }
        return current
      })
    },
    /**一键生成 */
    onGenerator() {
      const skuPrefix = this.$data.skuPrefix
      if (!skuPrefix) return
      const product = this.$props.product
      let variationsRecordVOList = product.variationsRecordVOList
      const list = variationsRecordVOList.map((ele) => {
        const list = ele.vindex.split(',')
        list.unshift(skuPrefix)
        ele.variationsSku = list.join(' - ')
        return ele
      })
      product.variationsRecordVOList = list
      this.$emit('input', product)
      this.$data.skuVisible = false
    },
    /**库存应用 */
    applayStock() {
      const stockHeadInput = this.$refs.stockHeadInput
      this.setVariationsItem('stock', stockHeadInput.stateValue)
    },
    /**价格应用 */
    applayPrice() {
      const priceHeadInput = this.$refs.priceHeadInput
      console.log(priceHeadInput.$refs.inputNumberRef.currentValue)
      this.setVariationsItem(
        'price',
        priceHeadInput.$refs.inputNumberRef.currentValue
      )
    },
    /**应用促销价 */
    applaySpecialPrice() {
      const specialPriceHeadInput = this.$refs.specialPriceHeadInput
      this.setVariationsItem(
        'specialPrice',
        specialPriceHeadInput.$refs.inputNumberRef.currentValue
      )
    },
    /**应用促销时间 */
    applaySpecialFromTime() {
      const [startTime, endTime] = this.$data.dateString
      if (!startTime && !endTime) return
      const product = this.$props.product
      product.variationsRecordVOList = product.variationsRecordVOList.map(
        (ele) => {
          ele.specialFromTime = startTime
          ele.specialToTime = endTime
          return ele
        }
      )
      this.$emit('input', product)
    },
    /**修改变体字段值 */
    setVariationsItem(field, value) {
      const product = this.$props.product
      product.variationsRecordVOList = product.variationsRecordVOList.map(
        (ele) => {
          ele[field] = value
          return ele
        }
      )
      this.$emit('input', product)
    },
    /**变体图片改变事件 */
    onEditImagesChange(value, index) {
      const product = this.$props.product
      product.variationsRecordVOList[index].images = value
      this.$emit('input', product)
    }
  }
}
</script>

<style lang="scss" scoped>
.spaces-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}
.space-name {
  display: block;
  position: relative;
}
.me-error,
.images-error {
  color: red;
}
</style>
<style lang="scss">
.spaces-option {
  .ant-form-item-children {
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss">
::-webkit-scrollbar {
  height: 18px !important;
  cursor: pointer;
}
</style>
