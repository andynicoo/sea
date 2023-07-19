<template>
  <div class="time-select">
    <div>
      <a-date-picker
        v-model="startDate"
        :disabled-date="disabledStartDate"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="(val)=>change('startDate',val)"
      />
      <a-time-picker
        v-model="startTime"
        format="HH:mm"
        value-format="HH:mm"
        style="margin-left:15px"
        :disabled="!startDate"
        :minute-step="10"
        :disabled-hours="disabledStartHours"
        :disabled-minutes="disabledStartMinutes"
        @change="(val,time)=>change('startTime',val,time)"
      />
    </div>
    <span class="g-mr10 g-ml10">至</span>
    <div>
      <a-date-picker
        v-model="endDate"
        :disabled="!startTime"
        :disabled-date="disabledEndDate"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="(val)=>change('endDate',val)"
      />
      <a-time-picker
        v-model="endTime"
        format="HH:mm"
        value-format="HH:mm"
        style="margin-left:15px"
        :minute-step="10"
        :disabled="!endDate"
        :disabled-hours="disabledEndHours"
        :disabled-minutes="disabledEndMinutes"
        @change="(val)=>change('endTime',val)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { checkTime, checkIncludes } from '../common'
export default {
  name: 'TimeSelect',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    validList: {
      type: Array,
      default: () => []
    },
    minTime: {
      type: Number,
      default: 0
    },
    maxTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      startDate: this.value.startDate,
      startTime: this.value.startTime,
      endDate: this.value.endDate,
      endTime: this.value.endTime,
      count: 0,
      start: undefined,
      end: undefined,
      hours: [],
      minutes: []
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.count) return
        this.setVal(val)
      }
    }
  },
  created() {
    this.hours = this.range(0, 24)
    this.minutes = this.range(0, 60)
  },
  methods: {
    setVal(val) {
      const { startTime, startDate, endTime, endDate } = val
      this.startTime = startTime
      this.startDate = startDate
      this.endTime = endTime
      this.endDate = endDate
      this.count++
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        let val = i < 10 ? `0${i}` : i
        result.push(val)
      }
      return result
    },
    mapMinTime(list, soure) {
      let arr = list.map(item => moment(item.startTime).valueOf()).filter(item => moment(item).endOf('day') > soure)
      return arr.length ? Math.min(...arr) : 0
    },
    // 开始日期校验
    checkDate(val) {
      let time = val.valueOf()
      return this.validList.some(item => {
        return time > moment(item.startTime).endOf('day') && time < moment(item.endTime).startOf('day')
      })
    },
    checkEndDate(val) {
      const a = new Date(`${this.startDate} ${this.startTime}`).valueOf()
      const b = val.valueOf()
      return checkTime(a, b, this.validList)
    },
    change(key, val, time) {
      const { startTime, startDate, endTime, endDate } = this
      const obj = {
        startTime,
        startDate,
        endTime,
        endDate,
        [key]: val
      }
      if (startDate) {
        this.start = moment(`${startDate} ${startTime || '00:00'}`)
      }
      if (endDate) {
        this.end = moment(`${endDate} ${endTime || '00:00'}`)
      }
      if (key === 'startDate') {
        obj.startTime = undefined
        obj.endDate = undefined
        obj.endTime = undefined
      }
      if (key === 'endDate') {
        obj.endTime = undefined
      }
      Object.entries(obj).forEach(([key, val]) => {
        this[key] = val
      })
      this.$emit('input', obj)
      this.$emit('change', obj)
    },
    disabledStartDate(val) {
      return val.valueOf() < moment().startOf('day') || this.checkDate(val)
    },
    disabledStartHours() {
      const result = []
      this.hours.forEach(item => {
        const a = new Date(`${this.startDate} ${item}:59`).valueOf()
        const val = checkIncludes(a, this.validList)
        if (val) {
          result.push(+item)
        }
      })
      return result
    },
    disabledStartMinutes(selectedHour) {
      const result = []
      this.minutes.forEach(item => {
        const a = new Date(`${this.startDate} ${selectedHour}:${item}`).valueOf()
        const val = checkIncludes(a, this.validList)
        if (val) result.push(+item)
      })
      return result
    },
    disabledEndDate(val) {
      return this.checkEndDate(val)
    },
    disabledEndHours() {
      const result = []
      const a = new Date(`${this.startDate} ${this.startTime}`).valueOf()
      this.hours.forEach(item => {
        const b = new Date(`${this.endDate} ${item}:00`).valueOf()
        if (checkTime(a, b, this.validList)) {
          result.push(item)
        }
      })
      return result
    },
    disabledEndMinutes(selectedHour) {
      const result = []
      const a = new Date(`${this.startDate} ${this.startTime}`).valueOf()
      this.minutes.forEach(item => {
        const b = new Date(`${this.endDate} ${selectedHour}:${item}`).valueOf()
        if (checkTime(a, b, this.validList)) {
          result.push(item)
        }
      })
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.time-select {
  display: flex;
  flex-wrap: wrap;
  div {
    display: flex;
    align-items: center;
  }
}
</style>
