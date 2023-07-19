<template>
  <!-- :rules="rules" -->
  <a-form-model
    ref="extraInfoForm"
    :model="product"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item :label="$t('edit.itemWeight')" prop="weight">
      <a-input
        style="width: 150px"
        v-model="product.weight"
        suffix="KG"
        v-positiveNumber="{ maxNum: 1000000, minNum: 0.01, fixedNum: 2 }"
        :disabled="!isEdit"
      />
    </a-form-model-item>
    <a-form-model-item :label="$t('edit.sizeSpec')">
      <a-form-model-item
        prop="packageLength"
        class="me-ib me-mr-2"
        style="width: 200px"
      >
        <a-input
          v-model="product.packageLength"
          :prefix="$t('edit.length')"
          v-positiveNumber="{ maxNum: 1000000, minNum: 1, isInteger: 1 }"
          suffix="CM"
          :disabled="!isEdit"
        />
      </a-form-model-item>
      <a-form-model-item
        prop="packageWidth"
        class="me-ib me-mr-2"
        style="width: 200px"
      >
        <a-input
          v-model="product.packageWidth"
          :prefix="$t('edit.width')"
          suffix="CM"
          v-positiveNumber="{ maxNum: 1000000, minNum: 1, isInteger: 1 }"
          :disabled="!isEdit"
        />
      </a-form-model-item>
      <a-form-model-item
        prop="packageHeight"
        class="me-ib me-mr-2"
        style="width: 200px"
      >
        <a-input
          v-model="product.packageHeight"
          :prefix="$t('edit.height')"
          suffix="CM"
          v-positiveNumber="{ maxNum: 1000000, minNum: 1, isInteger: 1 }"
          :disabled="!isEdit"
        />
      </a-form-model-item>
    </a-form-model-item>
    <template>
      <a-form-model-item :label="$t('edit.ItemCondition')" prop="itemCondition">
        <a-radio-group v-model="product.itemCondition" :disabled="!isEdit">
          <a-radio value="NEW"> NEW </a-radio>
          <a-radio value="USED"> USED </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- <a-form-model-item :label="$t('edit.isAppointment')" prop="isPreOrder">
        <a-radio-group v-model="product.isPreOrder">
          <a-radio :value="false"> {{ $t('edit.no') }} </a-radio>
          <a-radio :value="true"> {{ $t('edit.yes') }} </a-radio>
        </a-radio-group>
      </a-form-model-item> -->
      <!-- <template v-if="product.isPreOrder"> -->
      <a-form-model-item :label="$t('edit.deliveryDate')" prop="daysToShip">
        我需要
        <a-input-number
          :min="3"
          :max="10"
          style="width: 200px"
          v-model="product.daysToShip"
          :disabled="!isEdit"
          @change="handlerDaysChange"
        />
        出货天数
        <span v-if="isEdit">(可以填写3，5到10)</span>
      </a-form-model-item>
      <!-- </template> -->
      <a-form-model-item
        required
        :label="$t('edit.logisticsType')"
        prop="logistics"
        v-if="!isEdit"
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
        <div
          v-for="(logistics, index) in filterEnableList(product.logistics)"
          :key="logistics.logisticId"
        >
          <a-row>
            <a-col :span="8">
              <a-checkbox
                @change="onLogisticsChange($event, index)"
                v-model="logistics.enabled"
                :disabled="logistics.maskChannelId != 0"
              >
                {{ logistics.logisticName }}
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox
                :disabled="!logistics.enabled"
                v-model="logistics.isFree"
              >
                {{ $t('edit.isFree') }}
              </a-checkbox>
            </a-col>
            <a-col :span="8" v-if="logistics.sizes && logistics.sizes.length">
              <a-select
                :disabled="!logistics.enabled"
                v-model="logistics.sizeId"
              >
                <a-select-option
                  v-for="size in logistics.sizes"
                  :key="size.sizeId"
                  :value="size.sizeId"
                >
                  {{ size.name }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </div>
      </a-form-model-item>
    </template>
  </a-form-model>
</template>
<script>
import { cloneDeep } from 'lodash'
// import { POSITIVE_NUMBER_2, POSITIVE_NUMBER } from '@/util/regex'
import { mapState } from 'vuex'
import { positiveNumber } from '@/directive/number'
export default {
  data() {
    return {
      logisticsValidError: null
    }
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  directives: {
    positiveNumber
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    },
    labelCol: {
      type: Object,
      default: () => ({ span: 3 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 12 })
    }
  },
  computed: {
    // 过滤掉不能选的
    filterEnableList() {
      return (list) => {
        return list ? list.filter((item) => item.maskChannelId == 0) : []
      }
    },
    /**是否全选 */
    checkAll() {
      const { logistics } = this.$props.product
      if (!logistics) return
      let enabled = logistics.map(({ enabled }) => enabled)
      enabled = enabled.every(Boolean)
      return enabled
    },
    /**是否半选 */
    indeterminate() {
      const { logistics } = this.$props.product
      if (!logistics) return
      let enabled = logistics.map(({ enabled }) => enabled)
      enabled = enabled.filter(Boolean)
      if (enabled.length > 0 && enabled.length < logistics.length) {
        return true
      }
      return false
    },
    /**校验规则 */
    rules() {
      return {}
    }
  },
  mounted() {},
  methods: {
    /**物流方式全选 */
    onLogisticsCheckAll({ target }) {
      const value = target.checked
      const product = cloneDeep(this.$props.product)
      if (!value) {
        product.logistics = product.logistics.map((ele) => {
          ele.enabled = false
          ele.isFree = false
          return ele
        })
      } else {
        product.logistics = product.logistics.map((ele) => {
          ele.enabled = true
          ele.isFree = false
          return ele
        })
      }
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
      if (!product) {
        product = cloneDeep(this.$props.product)
      }
      product._logistics_valid_ = null
      this.$data.logisticsValidError = null
      const v = product.logistics.map(({ enabled }) => enabled)
      setTimeout(() => {
        this.$emit('input', product)
      }, 500)
      return v.some(Boolean)
    },
    /**校验 */
    validate() {
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        try {
          const valid = await this.$refs.extraInfoForm.validate()
          let validLogistics = true
          if (this.$route.query.edit != 0 && this.product.storeId != '0') {
            validLogistics = this.validLogistics()
          }
          if (valid && validLogistics) {
            resolve(true)
          } else {
            reject(this.$t('edit.extraInfoValidError'))
          }
        } catch (error) {
          console.error(error)
          reject(this.$t('edit.extraInfoValidError'))
        }
      })
    },
    handlerDaysChange(data) {
      if (data == 4) {
        this.product.daysToShip = 3
      }
    }
  }
}
</script>
