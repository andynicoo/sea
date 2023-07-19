<template>
  <a-form-model
    ref="extraInfoForm"
    :model="product"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item
      :label="$t('edit.itemWeight')"
      prop="weight"
      :wrapperCol="{ span: 13 }"
    >
      <a-input v-model="product.weight" suffix="KG" @change="weightChange" />
    </a-form-model-item>
    <a-form-model-item :label="$t('edit.sizeSpec')" :wrapperCol="{ span: 14 }">
      <template v-if="volumeError" #help>
        <p style="color: #f5222d">
          {{ volumeError }}
        </p>
      </template>
      <template slot="help" v-if="checkProductSize">
        <p style="color: #f5222d">长宽高都填写或都不填写</p>
      </template>
      <a-form-model-item prop="packageLength" class="me-ib me-mr-1">
        <a-input
          v-model="product.packageLength"
          :placeholder="$t('edit.length')"
          suffix="CM"
          v-enterIntNumber
        />
      </a-form-model-item>
      <a-form-model-item prop="packageWidth" class="me-ib me-mr-1">
        <a-input
          v-model="product.packageWidth"
          :placeholder="$t('edit.width')"
          suffix="CM"
          v-enterIntNumber
        />
      </a-form-model-item>
      <a-form-model-item prop="packageHeight" class="me-ib me-mr-1">
        <a-input
          v-model="product.packageHeight"
          :placeholder="$t('edit.height')"
          suffix="CM"
          v-enterIntNumber
        />
      </a-form-model-item>
    </a-form-model-item>
    <template v-if="editType != 0">
      <a-form-model-item :label="$t('edit.ItemCondition')" prop="itemCondition">
        <a-radio-group v-model="product.itemCondition">
          <a-radio value="NEW"> NEW </a-radio>
          <a-radio value="USED"> USED </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        v-if="product.merchantId === 0"
        :label="$t('edit.isAppointment')"
        prop="isPreOrder"
      >
        <a-radio-group v-model="product.isPreOrder" @change="preOrderChange">
          <a-radio :value="false"> {{ $t('edit.no') }} </a-radio>
          <a-radio :value="true" :disabled="!shipLimit.shipMinLimit">
            {{ $t('edit.yes') }}
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- 预购&&非cnsc -->
      <template v-if="product.isPreOrder && !product.merchantId">
        <a-form-model-item :label="$t('edit.deliveryDate')" prop="daysToShip">
          <a-input-number
            :min="0"
            style="width: 200px"
            v-model="product.daysToShip"
            :placeholder="
              $t('edit.deliveryDateRange', {
                min: shipLimit.shipMinLimit,
                max: shipLimit.shipMaxLimit
              })
            "
          />
        </a-form-model-item>
      </template>
      <!-- cnsc -->
      <template v-if="product.merchantId">
        <a-form-model-item :label="$t('edit.deliveryDate')">
          我需要
          <a-input-number
            :min="3"
            :max="10"
            style="width: 200px"
            v-model="product.daysToShip"
            @change="handlerDaysChange"
          />
          出货天数
          <span>(预售商品:5-10天)</span>
        </a-form-model-item>
      </template>
      <a-form-model-item
        :label="$t('edit.logisticsType')"
        :rules="loginsticsRules"
        prop="logistics"
        v-if="storeType == 'normal'"
      >
        <template slot="help">
          <p style="color: #f5222d">
            {{ product._logistics_valid_ || logisticsValidError }}
          </p>
        </template>
        <div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onLogisticsCheckAll"
          >
            {{ $t('edit.all') }}
          </a-checkbox>
        </div>
        <div v-for="(item, index) in product.logistics" :key="item.logisticId">
          <a-row>
            <a-col :span="16">
              <a-checkbox
                @change="onLogisticsChange($event, index)"
                v-model="item.enabled"
                :disabled="item.maskChannelId != 0"
              >
                {{ item.logisticName }}
                <span class="loginstics-flag">{{
                  item | formatDimension
                }}</span>
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox :disabled="!item.enabled" v-model="item.isFree">
                {{ $t('edit.isFree') }}
              </a-checkbox>
            </a-col>
            <a-col :span="8" v-if="item.sizes && item.sizes.length">
              <a-select :disabled="!item.enabled" v-model="item.sizeId">
                <a-select-option
                  v-for="size in item.sizes"
                  :key="size.size_id"
                  :value="size.size_id"
                >
                  {{ size.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </div>
        <div
          v-if="product && (!product.logistics || !product.logistics.length)"
          class="loginstics-error"
        >
          <p>获取不到物流方式：</p>
          <p>1.检查店铺授权是否过期</p>
          <p>2.检查店铺后台是否设置物流方式</p>
        </div>
      </a-form-model-item>
    </template>
  </a-form-model>
</template>
<script>
import { cloneDeep } from 'lodash'
import { PRICE } from '@/util/regex'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      logisticsValidError: null,
      storeType: null,
      volumeError: false,
      loginsticsRules: [{ required: true, message: '物流不能为空' }]
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: Object,
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 20 })
    }
  },
  filters: {
    formatDimension(item) {
      const itemMaxDimension = item.itemMaxDimension
      const weightLimit = item.weightLimit
      const volumeLimit = item.volumeLimit
      const arr = []
      if (
        [
          itemMaxDimension.length,
          itemMaxDimension.width,
          itemMaxDimension.height
        ].some(Boolean)
      ) {
        arr.push(
          `尺寸${itemMaxDimension.length}x${itemMaxDimension.width}x${itemMaxDimension.height}`
        )
      }
      if (weightLimit.item_max_weight) {
        arr.push(` 重量:max${weightLimit.item_max_weight}`)
      }
      if (volumeLimit.item_max_volume) {
        arr.push(` 体积:max:${volumeLimit.item_max_volume}`)
      }
      let str = ''
      arr.forEach((it) => {
        str += it
      })
      return str ? `(${str})` : str
    }
  },
  computed: {
    ...mapState({
      storeLimit: (state) => state.product.storeLimit,
      shipLimit: (state) => state.vars?.shipLimit || {}
    }),
    // 选中的物流
    selectLogistics({ product }) {
      return product.logistics?.filter(({ enabled }) => enabled) || []
    },
    /**是否全选 */
    checkAll() {
      const { logistics } = this.$props.product
      const arr = logistics
      if (!logistics?.length) return
      let enabled = arr.map(({ enabled }) => enabled)
      enabled = enabled.every(Boolean)
      return enabled
    },
    /**是否半选 */
    indeterminate() {
      const { logistics } = this.$props.product
      const arr = logistics
      if (!logistics) return
      let enabled = arr.map(({ enabled }) => enabled)
      enabled = enabled.filter(Boolean)
      if (enabled.length > 0 && enabled.length < arr.length) {
        return true
      }
      return false
    },
    checkProductSize() {
      const { packageLength, packageWidth, packageHeight } = this.$props.product
      console.log(packageLength, packageWidth, packageHeight)
      if (
        (packageLength && packageWidth && packageHeight) ||
        (!packageLength && !packageWidth && !packageHeight)
      ) {
        return false
      }
      return true
    },
    /**校验规则 */
    rules() {
      return {
        weight: [
          { required: true, message: this.$t('edit.wieghtValid') },
          {
            pattern: PRICE,
            message: this.$t('edit.wieghtValid2')
          },
          {
            validator: this.customCheckWeight
          }
        ],
        // packageLength: [
        //   {
        //     required: true,
        //     message: this.$t('edit.lengthIsRequired')
        //   },
        //   {
        //     pattern: POSITIVE_NUMBER,
        //     message: this.$t('edit.packageLengthValid')
        //   },
        //   {
        //     validator: (rule, value, callback) =>
        //       this.customCheck(rule, value, callback, 'length')
        //   }
        // ],
        // packageWidth: [
        //   {
        //     required: true,
        //     message: this.$t('edit.widthIsRequired')
        //   },
        //   {
        //     pattern: POSITIVE_NUMBER,
        //     message: this.$t('edit.packageWidthValid')
        //   },
        //   {
        //     validator: (rule, value, callback) =>
        //       this.customCheck(rule, value, callback, 'width')
        //   }
        // ],
        // packageHeight: [
        //   {
        //     required: true,
        //     message: this.$t('edit.heightIsRequired')
        //   },
        //   {
        //     pattern: POSITIVE_NUMBER,
        //     message: this.$t('edit.packageHeightValid')
        //   },
        //   {
        //     validator: (rule, value, callback) =>
        //       this.customCheck(rule, value, callback, 'height')
        //   }
        // ],
        itemCondition: [
          { required: true, message: this.$t('edit.itemStatusValid') }
        ],
        isPreOrder: [
          { required: true, message: this.$t('edit.isAppointmentValid') }
        ],
        daysToShip: [
          { required: true, message: this.$t('edit.deliveryDateValid') },
          {
            validator: (rule, value, callback) =>
              this.customCheckDaysToShip(rule, value, callback)
          }
        ]
      }
    },
    /**编辑类型 */
    editType() {
      return this.$route.query.edit
    }
  },
  mounted() {
    const { storeId, merchantId } = this.$route.query
    this.storeType = storeId ? 'normal' : this.storeType
    this.storeType = merchantId ? 'cnsc' : this.storeType
  },
  methods: {
    /**物流方式全选 */
    onLogisticsCheckAll({ target }) {
      const value = target.checked
      const product = cloneDeep(this.$props.product)
      const arr = product.logistics
      if (!value) {
        product.logistics = arr.map((ele) => {
          ele.enabled = false
          ele.isFree = false
          return ele
        })
      } else {
        product.logistics = arr.map((ele) => {
          ele.enabled = true
          ele.isFree = false
          return ele
        })
      }
      this.$emit('input', product)
      this.validLogistics(product)
    },
    /**物流方式变化事件 */
    onLogisticsChange({ target }, index) {
      const product = cloneDeep(this.$props.product)
      const value = target.checked
      if (!value) product.logistics[index].isFree = false
      this.validLogistics(product)
    },
    /**物流校验 */
    validLogistics(product) {
      if (this.editType == 0) return false
      if (!product) {
        product = cloneDeep(this.$props.product)
      }
      product._logistics_valid_ = null
      this.$data.logisticsValidError = null
      // const v = product.logistics.map(({ enabled }) => enabled)
      const arr = product.logistics
      const v = arr.map(({ enabled }) => enabled)
      if (!v.some(Boolean)) {
        product._logistics_valid_ = this.$t('edit.logisticsValidError')
        this.$data.logisticsValidError = this.$t('edit.logisticsValidError')
      }
      product.logistics = arr
      this.$emit('input', product)
      return v.some(Boolean)
    },
    weightChange(e) {
      const val = e.target.value
      this.product.weight = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    },
    /**校验 */
    async validate() {
      let errorInfo = []
      if (
        this.$data.storeType !== 'cnsc' &&
        !this.$props.product.logistics.length
      ) {
        this.$confirm({
          content: (h) => {
            return (
              <div>
                <p>获取不到物流方式：</p>
                <p>1.检查店铺授权是否过期 2.检查店铺后台是否设置物流方式</p>
              </div>
            )
          }
        })
        errorInfo.push('请前往店铺后台设置物流方式')
      }
      try {
        const valid = await this.$refs.extraInfoForm.validate()
        console.log(valid)
        let volume = true
        let validLogistics = true
        if (this.$route.query.edit != 0 && this.product.storeId != '0') {
          validLogistics = this.validLogistics()
          try {
            volume = await this.customCheckVolume()
          } catch (error) {
            console.log(error)
            volume = false
            errorInfo.push(error)
          }
        }
        if (errorInfo.length) {
          return Promise.reject([
            ...errorInfo,
            this.$t('edit.extraInfoValidError')
          ])
        }
        if (valid && validLogistics && volume && !this.checkProductSize) {
          return Promise.resolve()
        } else {
          return Promise.reject([
            ...errorInfo,
            this.$t('edit.extraInfoValidError')
          ])
        }
      } catch (error) {
        console.error(error)
        return Promise.reject(errorInfo.join(','))
      }
    },
    // 校验选中物流限制的长宽高
    customCheck(rule, value, callback, key) {
      const map = {
        length: '长',
        width: '宽',
        height: '高'
      }
      if (!value) {
        callback()
        return
      }
      if (this.selectLogistics?.length) {
        const limit = this.getLimitCount(
          this.selectLogistics,
          'itemMaxDimension',
          key
        )
        console.log(limit, `最大${map[key]}`)
        if (value >= limit) {
          callback(new Error(`${map[key]}不能大于${limit}`))
          return
        }
      }
      if (Number(value) > 1000000 || 0 >= Number(value)) {
        callback(new Error(this.$t('edit.sizeError')))
        return
      }
      this.customCheckVolume()
      callback()
    },
    // 校验选中的物流限制的最大重量
    customCheckWeight(rule, value, callback) {
      if (value == 0) return callback('请输入大于0的数字')
      if (value && this.selectLogistics?.length) {
        const limit = this.getLimitCount(
          this.selectLogistics,
          'weightLimit',
          'item_max_weight'
        )
        console.log(limit, '最大重量')
        if (value >= limit) {
          callback(new Error(`重量不能大于或等于${limit}`))
          return
        }
      }
      callback()
    },
    // 校验选中物流的体积限制
    async customCheckVolume() {
      this.volumeError = false
      const limit = this.getLimitCount(
        this.selectLogistics,
        'volumeLimit',
        'item_max_volume'
      )
      const { packageHeight, packageLength, packageWidth } = this.product
      if (packageHeight * packageLength * packageWidth >= limit) {
        const str = `长宽高的乘积不能大于${limit}`
        this.volumeError = str
        return Promise.reject(str)
      }
      return Promise.resolve(true)
    },
    getLimitCount(arr, parentKey, key) {
      // 过滤出有值的
      const list = arr.filter((item) => item[parentKey][key])
      return Math.min(...list.map((item) => item[parentKey][key]))
    },
    handlerDaysChange(data) {
      if (data == 4) {
        this.product.daysToShip = 3
      }
    },
    customCheckDaysToShip(rule, value, callback) {
      if (this.shipLimit) {
        let { shipMinLimit: preStart, shipMaxLimit: preEnd } = this.shipLimit
        preEnd = Number(preEnd)
        preStart = Number(preStart)
        const err = this.$t('edit.deliveryValid', {
          prestart: preStart,
          preend: preEnd
        })
        value = Number(value)
        if (preEnd < value || value < preStart) {
          callback(new Error(err))
          return
        }
      }
      callback()
    },
    preOrderChange(e) {
      // 预约为否时，取接口返回的默认值goods/goods-shopee-category-en/syncLimit
      if (!e.target.value) {
        this.product.daysToShip = this.shipLimit.daysToShip
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.loginstics-flag {
  font-size: 12px;
}
.loginstics-error {
  color: red;

  & > p {
    margin: 0;
    line-height: 18px;
  }
}
</style>
