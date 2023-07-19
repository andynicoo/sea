<template>
  <div>
    <div
      class="me-custom-time-range-content"
      style="width: 100%"
      v-for="(time, index) in times"
      :key="time.site"
    >
      <span class="me-custom-time-range-btn">
        {{ time.countryName }}
      </span>
      <div>
        <template v-if="time.bootsTimes">
          <a-form-model-item
            v-for="(ctime, cindex) in time.bootsTimes"
            :key="cindex"
            class="me-custom-time-range-group me-mb-0"
            :validateStatus="errors[`${index},${cindex}`] && 'error'"
          >
            <span
              class="me-time-error"
              slot="help"
              v-if="errors[`${index},${cindex}`]"
            >
              {{ errors[`${index},${cindex}`] }}
            </span>
            <span class="me-ml-4 me-mr-4">
              {{ $t('autoUp.timeGroup1') }}
            </span>
            <a-time-picker
              :allowClear="false"
              format="HH:mm"
              class="picker-item me-ib time-start"
              v-model="ctime.startTime"
              @change="onStartChange(index, cindex)"
            >
              <span slot="suffixIcon">
                {{ $t('autoUp.timeGroup2') }}
              </span>
            </a-time-picker>
            <a-time-picker
              :allowClear="false"
              format="HH:mm"
              class="picker-item me-ib time-end"
              v-model="ctime.endTime"
              @change="onValid(index, cindex)"
            >
            </a-time-picker>
            <template v-if="time.bootsTimes.length > 1">
              <span
                class="me-ml-4 me-mr-4 me-link"
                @click="remove(index, cindex)"
              >
                {{ $t('autoUp.timeGroup3') }}
              </span>
            </template>
          </a-form-model-item>
        </template>
        <a-form-model-item class="me-custom-time-range-group me-mb-0">
          <a-button
            :disabled="getDisabled(index)"
            @click="pushRange(index)"
            style="margin-left: 72px; width: 256px; color: #ff720d"
          >
            +{{ $t('autoUp.timeGroup4') }}
          </a-button>
        </a-form-model-item>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment'

let todayEnd = moment()
todayEnd.hours(0)
todayEnd.minutes(0)
todayEnd.seconds(0)
todayEnd.add(24, 'h')

const format = 'HH:mm'

export default {
  model: {
    prop: 'times',
    event: 'input'
  },
  props: {
    times: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      errors: {}
    }
  },
  methods: {
    /**薪增置顶时段 */
    pushRange(index) {
      const range = { startTime: null, endTime: null }
      let times = cloneDeep(this.$props.times)
      const bootsTimes = times[index].bootsTimes

      const last = bootsTimes[bootsTimes.length - 1]

      if (last && last.startTime && last.endTime) {
        range.startTime = moment(last.endTime).add(1, 'seconds')
        range.endTime = moment(range.startTime).add(4, 'h').add(-1, 'seconds')
      }

      bootsTimes.push(range)
      this.$emit('input', times)
      this.onValid(index, bootsTimes.length - 1, times)
    },
    /**移除置顶时段 */
    remove(index, cindex) {
      let times = cloneDeep(this.$props.times)
      times[index].bootsTimes.splice(cindex, 1)
      this.$emit('input', times)
    },
    /**开始时间改变事件 */
    onStartChange(index, cindex) {
      let times = cloneDeep(this.$props.times)
      const current = times[index].bootsTimes[cindex]
      const startTime = moment(current.startTime)
      startTime.seconds(0)
      const endtime = moment(startTime).add(4, 'h').add(-1, 'seconds')
      times[index].bootsTimes[cindex].endTime = endtime
      this.$emit('input', times)
      this.onValid(index, cindex, times)
    },
    /**时间校验 */
    onValid(index, cindex, times = this.$props.times) {
      const { errors } = this.$data
      const oldTime = times[index].bootsTimes[cindex - 1]
      const current = times[index].bootsTimes[cindex]

      this.$set(errors, `${index},${cindex}`, null)

      const cur_startTime = moment(current.startTime)
      const cur_endTime = moment(current.endTime).add(1, 'seconds')

      const cur_startTime_minute = moment(cur_startTime).minute()
      const cur_startTime_hour = moment(cur_startTime).hour()
      const cur_endTime_minute = moment(cur_endTime).minute()
      const cur_endTime_hour = moment(cur_endTime).hour()

      /**
       * 校验非空
       */
      if (!current.startTime || !current.endTime) {
        const msg = this.$t('autoUp.timeValidMsg1')
        this.$set(errors, `${index},${cindex}`, msg)
        return Promise.reject(msg)
      }

      /**
       * 结束时间大于开始时间
       */
      if (moment(current.endTime).isBefore(current.startTime)) {
        const msg = this.$t('autoUp.timeValidMsg2')
        this.$set(errors, `${index},${cindex}`, msg)
        return Promise.reject(msg)
      }

      /**
       * 校验大于上一个时间
       */
      if (oldTime && moment(current.startTime).isBefore(oldTime.endTime)) {
        const mgs = this.$t('autoUp.timeValidMsg3')
        this.$set(errors, `${index},${cindex}`, mgs)
        return Promise.reject(mgs)
      }

      /**
       * 4倍校验
       */
      if (cur_startTime_minute !== cur_endTime_minute) {
        const msg = this.$t('autoUp.timeValidMsg4')
        this.$set(errors, `${index},${cindex}`, msg)
        return Promise.reject(msg)
      }
      if ((cur_endTime_hour - cur_startTime_hour) % 4 !== 0) {
        const msg = this.$t('autoUp.timeValidMsg4')
        this.$set(errors, `${index},${cindex}`, msg)
        return Promise.reject(msg)
      }

      return Promise.resolve({
        startTime: moment(current.startTime).format(format),
        endTime: moment(current.endTime).format(format)
      })
    },
    /**新增置顶时段状态 */
    getDisabled(index) {
      const times = this.$props.times
      const bootsTimes = times[index].bootsTimes
      if (bootsTimes.length >= 6) return true
      const last = bootsTimes[bootsTimes.length - 1]
      if (last && last.startTime && last.endTime) {
        let startTime = cloneDeep(last.startTime)
        startTime = moment(startTime).add(4, 'h')

        let endTime = cloneDeep(last.endTime)
        endTime = moment(endTime).add(4, 'h')

        return (
          !startTime.isSameOrBefore(todayEnd) ||
          !endTime.isSameOrBefore(todayEnd)
        )
      } else {
      }
      return false
    },
    async validate() {
      const times = cloneDeep(this.$props.times)
      const timesValids = times.map(async (time, index) => {
        const bootsTimeValids = time.bootsTimes.map((bootsTime, cindex) => {
          return this.onValid(index, cindex)
        })
        const res = await Promise.all(bootsTimeValids)
        time.bootsTimes = res
        return time
      })
      return await Promise.all(timesValids)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-custom-time-range-content {
  display: grid;
  grid-template-columns: 80px 1fr;
  margin-bottom: 20px;

  .me-custom-time-range-btn {
    height: 24px;
    background: #fef5f0;
    border-radius: 4px;
    border: 1px solid #fcece8;
    padding: 0;
    text-align: center;
    font-size: 12px;
    color: #b38a6d;
    line-height: 24px;
    margin-top: 7px;
  }

  .me-time-error {
    margin-left: 70px;
  }
}
</style>

<style lang="scss">
.me-custom-time-range-group {
  .picker-item {
    &.time-start {
      .ant-time-picker-input {
        border-radius: 4px 0 0 4px;
        border-right: none;
      }
    }
    &.time-end {
      .ant-time-picker-input {
        border-radius: 0 4px 4px 0;
        border-left: none;
      }
    }
  }
}
</style>