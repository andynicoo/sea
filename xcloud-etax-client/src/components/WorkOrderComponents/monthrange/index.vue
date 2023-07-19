<template>
  <div>
    <DatePicker type="month" placeholder="开始月份" :value="startMonth" @on-change="startMonthChange" :disabled="disabled"></DatePicker>
    <DatePicker type="month" placeholder="结束月份" :value="endMonth" @on-change="endMonthChange" :disabled="disabled"></DatePicker>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default() {
        return ['', '']
      }
    },
    disabled: Boolean
  },
  data() {
    return {
      startMonth: '',
      endMonth: ''
    };
  },
  mounted() {
    [this.startMonth, this.endMonth] = this.value
  },
  computed: {
    monthValue() {
      return [this.startMonth, this.endMonth]
    }
  },
  watch: {
    monthValue(val) {
      if(this.startMonth && this.endMonth) {
        if(+(new Date(this.startMonth)) > +(new Date(this.endMonth))) {
          this.$emit('input', [])
          return
        }
        this.$emit('input', [this.startMonth, this.endMonth])
      } else {
        this.$emit('input', [])
      }
    }
  },
  methods: {
    startMonthChange(month) {
      if(this.endMonth && +(new Date(month)) > +(new Date(this.endMonth))) {
        this.$Message.warning('开始月份要早于结束月份！')
        this.startMonth = ''
      } else {
        this.startMonth = month
      }
    },
    endMonthChange(month) {
      if(this.startMonth && +(new Date(month)) < +(new Date(this.startMonth))) {
        this.$Message.warning('开始月份要早于结束月份！')
        this.endMonth = ''
      } else {
        this.endMonth = month
      }
    }
  }
};
</script>

<style>
.el-icon-error {
  color: #2d8cf0 !important;
}
</style>
