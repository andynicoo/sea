<template>
  <div class="container-wrapper">
    <div class="echarts-title">
      <div class="p-title">
        <span>月交易额</span>
        <a-month-picker
          :allow-clear="false"
          size="small"
          :value="time"
          value-format="YYYY-MM"
          @change="change"
        />
      </div>
      <p class="count-num" :title="data.totalRegNum">
        <RenderExpand :render="renderMoney" />
      </p>
    </div>
    <div class="echarts-wrapper">
      <Echarts v-if="list.length" id="turnover" :options="options" />
      <a-empty v-else />
    </div>
    <div class="attach-info">
      <span class="label">今日</span>
      <span>{{ data.thisDayTurnover | formatMoney }}</span>
    </div>
  </div>
</template>

<script>
import Echarts from '@/components/echarts'
import RenderExpand from '../render'
import { minOptions } from '../options'
import { merge, cloneDeep } from 'lodash'
import { getTurnover } from '@/api/overview'
import moment from 'moment'
function toMoney(num) {
  num = num.toFixed(2)
  num = parseFloat(num)
  num = num.toLocaleString()
  return num
}
function formatMoney(money) {
  if (money) {
    const num = parseInt(money)
    const len = String(num).length
    if (len > 8) {
      return toMoney(money / 100000000) + '亿'
    }
    if (len > 4) {
      return toMoney(money / 10000) + '万'
    }
    return money + '元'
  } else {
    return 0
  }
}
export default {
  components: {
    Echarts,
    RenderExpand
  },
  filters: { formatMoney },
  data() {
    return {
      data: {},
      list: [],
      options: {},
      time: moment().format('YYYY-MM')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    init(data) {
      const options = cloneDeep(minOptions)
      const obj = {
        tooltip: {
          formatter(val) {
            let str = ''
            val.forEach((item) => {
              const money = formatMoney(item.value)
              str = `${item.marker}${item.name} ${money}<br>`
            })
            return str
          }
        },
        xAxis: {
          data: data.map((item) => item.name)
        },
        series: [
          {
            type: 'bar',
            data: data.map((item) => item.value),
            barMaxWidth: 20
          }
        ]
      }
      return merge(options, obj)
    },
    async getList() {
      const params = this.getTime(this.time)
      try {
        const { data = {}} = await getTurnover(params)
        this.data = data || {}
        this.list = data?.data || []
        this.options = this.init(this.list)
        console.log(data)
      } catch (error) {
        console.error(error)
      }
    },
    change(time) {
      this.time = time
      this.getList()
    },
    getTime(time) {
      const _M = moment(time || new Date()).format('YYYY-MM-01 00:00:00')
      if (time) {
        return {
          startTime: _M,
          endTime: moment(_M)
            .add(1, 'months')
            .subtract(1, 'days')
            .format('YYYY-MM-DD 23:59:59')
        }
      } else {
        return {
          startTime: _M,
          endTime: moment(_M)
            .add(1, 'months')
            .subtract(1, 'days')
            .format('YYYY-MM-DD 23:59:59')
        }
      }
    },
    renderMoney() {
      const money = this.data.totalTurnover ?? 0
      const num = parseInt(money)
      const len = String(num).length
      if (len > 8) {
        return (
          <span>
            {toMoney(money / 100000000)}
            <span class='money-unit'>亿</span>
          </span>
        )
      }
      if (len > 4) {
        return (
          <span>
            {toMoney(money / 10000)}
            <span class='money-unit'>万</span>
          </span>
        )
      }
      return (
        <span>
          {money}
          {!!money && <span class='money-unit'>元</span>}
        </span>
      )
    }
  }
}
</script>

<style lang="less" scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 2px;
  box-shadow: -10px 10px 20px 0px rgba(30, 30, 30, 0.06);
  padding: 20px 24px;
  padding-bottom: 10px;
  .echarts-title {
    height: 75px;
  }
  .p-title {
    display: flex;
    justify-content: space-between;
    & > span {
      font-weight: bold;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .count-num {
    font-size: 32px;
    font-family: HelveticaNeue;
    color: rgba(0, 0, 0, 0.85);
    line-height: 38px;
    height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .money-unit {
      font-size: 14px;
    }
  }
  .echarts-wrapper {
    height: calc(100% - 75px - 27px);
    width: 100%;
  }
  .attach-info {
    border-top: 1px solid #e8e8e8;
    padding-top: 5px;
    color: rgba(0, 0, 0, 0.85);
    .label {
      margin-right: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
