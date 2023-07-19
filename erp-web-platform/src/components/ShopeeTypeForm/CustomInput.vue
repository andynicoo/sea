<template>
  <a-input-group compact>
    <a-input
      v-model="customValue[fieldNames.value]"
      :style="{ width: unitList.length ? '70%' : '100%' }"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="(e) => onChange(fieldNames.value, e.target.value, 'input')"
    ></a-input>
    <a-select
      v-if="unitList.length"
      v-model="customValue[fieldNames.unit]"
      placeholder="请选择"
      style="width:30%"
      @change="(val) => onChange(fieldNames.unit, val)"
      :disabled="disabled"
      :getPopupContainer="(target) => target.parentNode"
    >
      <a-select-option v-for="item in unitList" :key="item">
        {{ item }}
      </a-select-option>
    </a-select>
  </a-input-group>
</template>

<script>
import { pattern } from './common'
const initVal = {
  valueId: 0
}
export default {
  props: {
    unitList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fieldNames: {
      type: Object,
      default: () => ({
        value: 'originalValueName',
        unit: 'valueUnit'
      })
    },
    inputValidationType: {
      type: String,
      default: 'STRING_TYPE'
    }
  },
  data() {
    return {
      customValue: { ...initVal }
    }
  },
  watch: {
    value: {
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const val = this.value
      if (val?.length) {
        const [first = {}] = val
        this.customValue = { ...first, ...initVal }
      }
    },
    onChange(key, val, type) {
      this.$set(this.customValue, key, val)
      this.$emit('input', [this.customValue])
      this.$emit('change', [this.customValue])
      if (type === 'input') {
        const reg = pattern[this.inputValidationType]
        this.addtemp = val.replace(reg, '$1')
      }
    }
  }
}
</script>

<style></style>
