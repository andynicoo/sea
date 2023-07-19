<template>
  <div class="container-wrapper">
    <div class="echarts-title">
      <p class="p-title">
        月绑定店铺数
      </p>
      <p class="count-num" :title="data.totalBindShopNum | formatMoney">
        <span>{{ data.totalBindShopNum | formatMoney }}</span>
      </p>
    </div>
    <div class="echarts-wrapper">
      <Echarts v-if="list.length" id="shop" :options="options" />
      <a-empty v-else />
    </div>
    <div class="attach-info">
      <span class="label">今日</span>
      <span>{{ data.thisdayBindShopNum | formatMoney }}</span>
    </div>
  </div>
</template>

<script>
import Echarts from '@/components/echarts'
import { minOptions } from '../options'
import { merge, cloneDeep } from 'lodash'
import { getBindShop } from '@/api/overview'
export default {
  components: {
    Echarts
  },
  data() {
    return {
      data: {},
      list: [],
      options: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    init(data) {
      const options = cloneDeep(minOptions)
      const obj = {
        xAxis: {
          data: data.map((item) => item.name)
        },
        series: [
          {
            data: data.map((item) => item.value),
            areaStyle: {
              color: '#09b596'
            },
            lineStyle: {
              color: '#09b596'
            }
          }
        ]
      }
      return merge(options, obj)
    },
    async getList() {
      try {
        const { data } = await getBindShop()
        this.data = data || {}
        this.list = data?.data || []
        this.options = this.init(this.list)
        console.log(data)
      } catch (error) {
        console.error(error)
      }
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
    font-weight: bold;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
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
