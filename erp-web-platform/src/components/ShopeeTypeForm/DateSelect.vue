<template>
  <a-date-picker
    v-model="time.originalValueName"
    :formmat="dateFormat[item.dateFormatType]"
    :valueFormat="dateFormat[item.dateFormatType]"
    :disabled="disabled"
    class="date-select"
    style="width:100%"
    @change="change"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, Array],
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      time: {},
      dateFormat: {
        YEAR_MONTH: 'YYYY-MM-DD',
        YEAR_MONTH_DAY: 'YYYY-MM'
      }
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
        this.time = { ...first }
      }
    },
    change(val) {
      const value = [
        {
          originalValueName: val,
          valueId: 0
        }
      ]
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-select {
  ::v-deep .ant-input[disabled] {
    background-color: #f5f5f5;
  }
}
</style>
