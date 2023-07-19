<template>
  <div>
    <a-select
      v-model="section"
      class="me-w120"
      @change="handleChange"
    >
      <a-select-option
        v-for="item in selectData"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
    <!-- v-show="section === 'user'" -->
    <a-range-picker
      v-show="section === 'user'"
      v-model="userTime"
      :format="format"
      class="me-w220"
      :value-format="format"
      :disabled="section !== 'user'"
      @change="timeChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  inject: ['for'],
  props: {
    name: {
      type: String,
      default: ''
    },
    // 时间区间 和下拉值，统一调整为根据传进来的type来决定，适应添加数据和编辑数据的模式
    type: {
      type: Number,
      default: 1
    },
    timeValue: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  data() {
    return {
      section: 7,
      userTime: null,
      selectData: this.for
    }
  },
  created() {
    // 根据传入的type重新为下拉框赋值
    this.section = this.getValueByType()
  },
  methods: {
    handleChange(value) {
      this.changeTimeSection(value)
    },
    // 调整时间选择区间,赋予时间区间或者空值
    changeTimeSection(val) {
      if (typeof val !== 'number') {
        this.userTime = []
      } else {
        this.userTime = [
          moment()
            .subtract(val, 'days')
            .format(this.format),
          moment().format(this.format)
        ]
      }
      this.sendEvent()
    },
    sendEvent() {
      let type = this.getTypeByValue()
      this.$emit('changeTime', {
        time: this.userTime,
        name: this.name,
        type: type
      })
    },
    timeChange(e) {
      let { section } = this.$data
      section === 'user' ? this.sendEvent() : console.log('no')
    },
    getTypeByValue() {
      let { selectData, section } = this.$data
      let temp = selectData.filter((ele) => ele.value === section)
      return temp[0].type
    },
    getValueByType() {
      let { selectData, section } = this.$data
      let temp = selectData.filter((ele) => ele.type === this.type)
      // console.log(temp[0].value)
      if (this.type === 6) {
        this.userTime = this.timeValue
      }
      return temp && temp.length ? temp[0].value : 7
    }
  }
}
</script>

<style lang="less" scoped>
.me-w220 {
  width: 220px;
  min-width: 220px !important;
}
.me-w120 {
  width: 120px !important;
  min-width: 120px !important;
}
</style>
