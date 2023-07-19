<template>
  <a-form-model
    ref="logisticsInfoForm"
    :model="product"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 10 }"
  >
    <!-- <a-form-model-item label="税">
      <a-select v-model="product.taxClass">
        <a-select-option value="default"> default </a-select-option>
      </a-select>
    </a-form-model-item> -->

    <a-form-model-item label="包裹重量" prop="packageWeight">
      <a-input suffix="KG" v-model="product.packageWeight" />
    </a-form-model-item>

    <a-form-model-item
      label="包裹尺寸"
      :wrapper-col="{ span: 20 }"
      class="me-mb-0"
      required
    >
      <a-space>
        <a-form-model-item class="me-ib" prop="packageLength">
          <a-input prefix="长" suffix="CM" v-model="product.packageLength" />
        </a-form-model-item>
        <a-form-model-item class="me-ib" prop="packageWidth">
          <a-input prefix="宽" suffix="CM" v-model="product.packageWidth" />
        </a-form-model-item>
        <a-form-model-item class="me-ib" prop="packageHeight">
          <a-input prefix="高" suffix="CM" v-model="product.packageHeight" />
        </a-form-model-item>
      </a-space>
    </a-form-model-item>

    <!-- <a-form-model-item label="危险品">
      <a-checkbox-group :options="plainOptions" v-model="product.Hazmat" />
    </a-form-model-item> -->

    <a-form-model-item label="包装内容">
      <a-textarea :rows="6" v-model="product.packageContent" />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { PRICE } from '@/util/regex'
export default {
  props: {
    product: Object
  },
  model: {
    prop: 'product',
    event: 'input'
  },
  computed: {
    rules() {
      return {
        packageWeight: [
          { required: true, message: '包裹重量不能为空' },
          { pattern: PRICE, message: '请输入大于0的数字,小数点后最多两位' }
        ],
        packageLength: [
          { required: true, message: '长不能为空' },
          { pattern: PRICE, message: '请输入大于0的数字,小数点后最多两位' }
        ],
        packageWidth: [
          { required: true, message: '宽不能为空' },
          { pattern: PRICE, message: '请输入大于0的数字,小数点后最多两位' }
        ],
        packageHeight: [
          { required: true, message: '高不能为空' },
          { pattern: PRICE, message: '请输入大于0的数字,小数点后最多两位' }
        ]
      }
    }
  },
  data() {
    return {
      plainOptions: ['None', 'Battery', 'Flammable', 'Liquid']
    }
  },
  methods: {
    validate() {
      return this.$refs.logisticsInfoForm.validate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
