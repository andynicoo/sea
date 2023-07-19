<template>
  <div>
    <a-form-model
      ref="productinfoForm"
      :model="product"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item label="商品名称" prop="name">
        <a-input v-model="product.name" />
      </a-form-model-item>
      <a-form-model-item
        :wrapper-col="{ span: 19 }"
        label="短描述"
        prop="shortDescription"
      >
        <AttrsInput
          :attr="{ name: 'shortDescription', inputType: 'richText' }"
          v-model="product.shortDescription"
        />
      </a-form-model-item>
      <a-form-model-item
        :wrapper-col="{ span: 19 }"
        label="详细描述"
        prop="description"
      >
        <AttrsInput
          ref="productDescription"
          type="richText"
          :attr="{ name: 'description', inputType: 'richText' }"
          v-model="product.description"
        />
      </a-form-model-item>
      <!-- <a-form-model-item label="视频URL" prop="video">
        <a-input v-model="product.video" />
      </a-form-model-item> -->
    </a-form-model>

    <a-form-model
      ref="productinfoAttributesForm"
      :model="product.attributes"
      :rules="attributesRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 10 }"
    >
      <template v-if="product.attributes">
        <a-form-model-item
          label="品牌"
          required
          :wrapper-col="{ span: 19 }"
          class="me-mb-0"
        >
          <a-form-model-item prop="brand" class="me-ib" style="width: 470px">
            <a-select v-model="product.attributes.brand">
              <a-select-option value="No Brand"> No Brand </a-select-option>
              <a-select-option
                v-for="(option, index) in brandOptions"
                :key="index"
                :value="option"
              >
                {{ option }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="me-ib">
            <a-button type="link" @click="setNoBrand"> 无品牌 </a-button>
          </a-form-model-item>
        </a-form-model-item>
      </template>
      <a-form-model-item
        v-show="showAttrs"
        v-for="attr in attributes"
        :key="attr.name"
        :label="attr.label"
        :prop="attr.name"
      >
        <AttrsInput :attr="attr" v-model="product.attributes[attr.name]" />
      </a-form-model-item>
    </a-form-model>

    <p v-if="attributes.length" class="me-text-center">
      <template v-if="showAttrs">
        <a-button @click="showAttrs = !showAttrs" type="link">
          收起
          <a-icon type="up" />
        </a-button>
      </template>
      <template v-else>
        <a-button @click="showAttrs = !showAttrs" type="link">
          展开
          <a-icon type="down" />
        </a-button>
      </template>
    </p>
  </div>
</template>

<script>
import bus from '@/bus'
import AttrsInput from './AttrsInput'
import { cloneDeep } from 'lodash'

export default {
  components: {
    AttrsInput
  },
  props: {
    product: Object
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  computed: {
    rules() {
      let obj = {
        description: [{ required: true, message: '描述必填' }],
        name: [{ required: true, message: '商品名称必填' }]
        // shortDescription: [{ required: true, message: '短描述必填' }]
      }

      return obj
    },
    attributesRules() {
      let obj = {
        brand: [
          {
            validator: (rule, value, callback) => {
              if (!value) callback('品牌必填')
              callback()
            }
          }
        ]
      }
      const attributeVOList = this.$props.product.attributeVOList
      attributeVOList?.forEach((attr) => {
        if (attr.name === 'brand') return
        if (attr.name === 'description') return
        if (attr.name === 'shortDescription') return
        if (attr.name === 'name') return
        if (attr.isMandatory) {
          obj[attr.name] = [
            {
              required: true,
              message: `${attr.label}必填`
            }
          ]
        }
      })
      return obj
    },
    attributes() {
      const attributeVOList = this.$props.product.attributeVOList
      if (!attributeVOList) return []
      return attributeVOList.filter((attribute) => {
        if (attribute.name === 'name') return false
        if (attribute.name === 'brand') return false
        if (attribute.name === 'short_description') return false
        if (attribute.name === 'description') return false
        if (attribute.name === 'video') return false
        if (attribute.name === '__images__') return false
        if (attribute.name === 'package_weight') return false
        if (attribute.name === 'package_length') return false
        if (attribute.name === 'package_width') return false
        if (attribute.name === 'package_height') return false
        if (attribute.attributeType === 'sku') return false
        return true
      })
    },
    brandOptions() {
      const attributeVOList = this.$props.product.attributeVOList
      if (!attributeVOList) return []
      const brand = attributeVOList.find((attribute) => {
        if (attribute.name === 'brand') return true
      })
      if (Array.isArray(brand.options)) return brand.options
      return Array.isArray(brand.options)
    }
  },
  data() {
    return {
      attrs: {},
      showAttrs: false
    }
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
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        const validInfo = this.$refs.productinfoForm.validate()
        const validAttrs = this.$refs.productinfoAttributesForm.validate()
        Promise.all([validInfo, validAttrs])
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
            this.$data.showAttrs = true
          })
      })
    },
    /**类目选择改变事件 */
    onLazadaEditBasicInfoCategoryChange(value) {
      this.$props.product.attributeVOList = value
    },
    /**设置无品牌 */
    setNoBrand() {
      const product = cloneDeep(this.$props.product)
      product.attributes.brand = 'No Brand'
      this.$emit('input', product)
    },
    //翻译修改描述
    changeDescription(product) {
      this.$refs['productDescription'].changeEditContainer(product.description)
    }
  }
}
</script>

<style lang="scss" scoped></style>
