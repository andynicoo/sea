<template>
  <div class="container-wrapper">
    <div class="echarts-title">
      <div class="title-text">
        <span> 留存分析</span>
      </div>
      <div class="searchbox">
        <a-space>
          时间范围:
          <!-- {{ time1 }} -->
          <a-range-picker
            v-model="time1"
            :ranges="ranges"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            size="small"
            :allow-clear="false"
            :disabled-date="disabledDate"
            @change="onChange"
          />
          <!-- {{ choose1 }} -->
          <a-select
            v-model="choose1"
            style="width: 100px"
            class="fr"
            size="small"
            @change="handleChange"
          >
            <a-select-option
              v-for="(item, index) in conditions1"
              :key="item + index"
              :value="item.key"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <!-- {{ choose2 }} -->
          <a-select
            v-model="choose2"
            style="width: 100px"
            class="fr"
            size="small"
            @change="handleChange"
          >
            <a-select-option
              v-for="(item, index) in conditions2"
              :key="item + index"
              :value="item.key"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-select
            v-model="choose3"
            style="width: 100px"
            class="fr"
            size="small"
            @change="handleChange"
          >
            <a-select-option
              v-for="(item, index) in conditions3"
              :key="item + index"
              :value="item.key"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-space>
      </div>
    </div>
    <div class="echarts-wrapper">
      <a-table
        :pagination="false"
        :columns="columns"
        :data-source="dataSource"
        :scroll="{ x: 1500, y: 500 }"
        :bordered="false"
        :row-key="(record, index) => record.byValue + index"
      >
        <template
          slot="byValue"
          slot-scope="text, record"
        >
          <div style="padding:0px 16px">
            {{ record.byValue }}{{ record.byValue.length===10?'('+ (moment(record.byValue).format('dddd')).toString().substring(2,3)+')':'' }}
          </div>
        </template>
        <template
          slot="次日"
          slot-scope="text, record"
        >
          <div
            v-if="record['次日']"
            :style="{
              background:
                'rgba(247, 98, 47, ' + record['次日'].percent / 100 + ')'
            }"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次日'].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次日'].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div>
                <h3>{{ record['次日'].people + '人' }}</h3>
                <span class="xx">{{ record['次日'].percent + '%' }}</span>
              </div>
            </a-popover>
          </div>
        </template>

        <template
          v-for="index in this.dayNum"
          :slot="`第${index}日`"
          slot-scope="text, record"
        >
          <div
            :key="index"
            class="ssss"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}日`].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}日`].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div
                v-if="record[`第${index}日`]"
                :style="{
                  background:
                    'rgba(247, 98, 47, ' +
                    record[`第${index}日`].percent / 100 +
                    ')'
                }"
              >
                <h3>{{ record[`第${index}日`].people+ '人' }}</h3>
                <span class="xx">{{ record[`第${index}日`].percent }}%</span>
              </div>
            </a-popover>
          </div>
        </template>

        <template
          slot="次周"
          slot-scope="text, record"
        >
          <div
            v-if="record['次周']"
            :style="{
              background:
                'rgba(247, 98, 47, ' + record['次周'].percent / 100 + ')'
            }"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次周'].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次周'].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div>
                <h3>{{ record['次周'].people + '人' }}</h3>
                <span class="xx">{{ record['次周'].percent + '%' }}</span>
              </div>
            </a-popover>
          </div>
        </template>
        <template
          v-for="index in this.weekNum"
          :slot="`第${index}周`"
          slot-scope="text, record"
        >
          <div
            :key="index"
            class="ssss"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}周`].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}周`].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div
                v-if="record[`第${index}周`]"
                :style="{
                  background:
                    'rgba(247, 98, 47, ' +
                    record[`第${index}周`].percent / 100 +
                    ')'
                }"
              >
                <h3>{{ record[`第${index}周`].people + '人' }}</h3>
                <span class="xx">{{ record[`第${index}周`].percent }}%</span>
              </div>
            </a-popover>
          </div>
        </template>

        <template
          slot="次月"
          slot-scope="text, record"
        >
          <div
            v-if="record['次月']"
            :style="{
              background:
                'rgba(247, 98, 47, ' + record['次月'].percent / 100 + ')'
            }"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次月'].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record['次月'].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div>
                <h3>{{ record['次月'].people + '人' }}</h3>
                <span class="xx">{{ record['次月'].percent + '%' }}</span>
              </div>
            </a-popover>
          </div>
        </template>
        <template
          v-for="index in this.weekNum"
          :slot="`第${index}月`"
          slot-scope="text, record"
        >
          <div
            :key="index"
            class="ssss"
          >
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}月`].horizontalTime,
                        1,
                        record.byValue
                      )
                    "
                  >导出留存数据</a-button>
                </p>
                <p>
                  <a-button
                    @click="
                      handleExport(
                        record[`第${index}月`].horizontalTime,
                        2,
                        record.byValue
                      )
                    "
                  >导出流失数据</a-button>
                </p>
              </template>
              <div
                v-if="record[`第${index}月`]"
                :style="{
                  background:
                    'rgba(247, 98, 47, ' +
                    record[`第${index}月`].percent / 100 +
                    ')'
                }"
              >
                <h3>{{ record[`第${index}月`].people + '人' }}</h3>
                <span class="xx">{{ record[`第${index}月`].percent }}%</span>
              </div>
            </a-popover>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
// import { maxOptions } from '../options'
// import { cloneDeep } from 'lodash'
import { getRetention, exportRetained } from '@/api/overview'
import { download } from '@/utils/index'
import moment from 'moment'
import selectData from '@/mixins/selectData'

export default {
  components: {},
  mixins: [selectData],
  data() {
    return {
      data: {},
      list: [],
      options: {},
      choose1: 1,
      conditions2: [],
      choose2: 1,
      choose3: 1,
      time: moment().subtract(8, 'days'),
      time1: [moment()
            .startOf('day')
            .subtract(1, 'days').format('YYYY-MM-DD'), moment()
            .startOf('day')
            .subtract(1, 'days').format('YYYY-MM-DD')],
      analysisDatas: {},
      dataSource: [],
      columns: [],
      dayNum: [],
      weekNum: []
    }
  },
  watch: {
    time1(val) {
      this.getList()
    },
    // 按天 按周 按月 条件改变
    choose1(val) {
      console.log(val)
      if (val === 1) {
        this.conditions2 = this.conditions21
      }
      if (val === 2) {
        this.conditions2 = this.conditions22
      }
      if (val === 3) {
        this.conditions2 = this.conditions23
      }
      this.choose2 = 1
      this.getList()
    },
    choose2(val) {
      this.getList()
    },
    choose3(val) {
      this.getList()
    }
  },
  created() {},
  mounted() {
    for (let i = 2; i < 61; i++) {
      this.dayNum.push(i)
    }
    for (let i = 2; i < 25; i++) {
      this.weekNum.push(i)
    }
    this.conditions2 = this.conditions21
    this.getList()
  },
  methods: {
    onChange(dates, dateStrings) {
      // console.log('From: ', dates[0], ', to: ', dates[1])
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    moment,
    // onChange(time) {
    //   this.time = time
    //   this.getList()
    // },
    async getList() {
      const params = {
        startTime: this.time1.length ? this.time1[0] : '',
        endTime: this.time1.length ? this.time1[1] : '',
        type: this.choose3,
        per: this.choose1,
        fewDays: this.choose2
      }
      try {
        const { data } = await getRetention(params)
        this.analysisDatas = data

        this.dataSource = data.rows
        var antData = []
        var temp = []
        // 动态表头
        if (data.title.length) {
          data.title.map((item) => {
            // console.log(item)
            this.columnsTemp.title = item
            this.columnsTemp.dataIndex = item
            temp.push({
              title: item,
              dataIndex: item,
              align: 'center',
              scopedSlots: { customRender: item }
              // scopedSlots: {
              //   customRender: (text) => {
              //   return <div class="text-maAccount" click="xxx">{text}-</div>
              // } }
              // customRender: (text, record) => {
              //   return (
              //     <div class="text-maAccount" click="xxx">
              //       {record}-
              //     </div>
              //   )
              // }
            })
          })

          // 整合表格数据
          antData = data.rows
          antData.map((item) => {
            if (item.cells.length) {
              //
              console.log(item.cells)
              data.title.map((it, index) => {
                item[it] = item.cells[index]
              })
            } else {
              //
              // console.log('else', this.getTitleData(data.title))
              this.getTitleData(data.title)
            }
            return item
          })
          console.log('temp', temp)
          this.columns = this.originColumns.concat(temp)
        } else {
           this.columns = this.originColumns
        }
      } catch (error) {
        console.error(error)
      }
    },
    getTitleData(arr) {
      var newArr = []
      arr.map((item) => {
        newArr.push({
          item: null
        })
        // console.log(item)
      })
      return newArr
    },
    xxx() {
      alert('xxx')
    },
    getTime(time) {
      const _M = moment(time || new Date()).format('YYYY-MM-DD 00:00:00')
      if (time) {
        return {
          startTime: _M,
          endTime: moment(_M).format('YYYY-MM-DD 23:59:59')
        }
      } else {
        return {
          startTime: _M,
          endTime: moment(_M).format('YYYY-MM-DD 23:59:59')
        }
      }
    },
    disabledDate(val) {
      if (!val) {
        return false
      }
      return val.valueOf() > Date.now()
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    // 导出留存数据
    async handleExport(time, key, verticalTime) {
      const params = {
        // startTime: this.time1.length ? this.time1[0] : '',
        // endTime: this.time1.length ? this.time1[1] : '',
        type: key,
        per: this.choose1,
        fewDays: this.choose2,
        horizontalTime: time,
        verticalTime: verticalTime
      }
      try {
        const result = await exportRetained(params)
        const typeName = key === 1 ? '留存' : '流失'
        download(result, `${verticalTime}${typeName}数据`)
        this.$message.success('导出成功')
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
  background: #ffffff;
  border-radius: 2px;
  box-shadow: -10px 10px 20px 0px rgba(30, 30, 30, 0.06);
  padding: 20px 24px;
  padding-bottom: 10px;
  .echarts-title {
    height: 50px;
    display: flex;
    justify-content: space-between;
  }
  .title-text {
    & > span {
      font-weight: bold;
      font-size: 16px;
      margin-right: 10px;
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
    h3 {
      color: #000;
      font-size: 16px;
      margin-bottom: 2px;
      cursor: pointer;
    }
    h3:hover {
      text-decoration:underline
    }
    span.xx {
      font-size: 12px;
      cursor: pointer;
    }
    span.xx:hover{
      text-decoration:underline
    }
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
  .export {
    &:not([disabled]) {
      border-color: rgba(255, 114, 13, 1);
      color: rgba(255, 114, 13, 1);
    }
  }
  .fenxi {
    .title {
      display: flex;
      background: #eee;
      padding: 10px 10px;
      font-size: 16px;
      font-weight: bold;
      .tit1 {
        width: 200px;
      }
    }
    .cells {
      height: 45px;
      line-height: 45px;
      padding: 0 5px;
      display: flex;
      .cell {
        width: 200px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      div {
        cursor: pointer;
      }
    }
  }
}
.popdiv {
  background: #000;
}
</style>
<style>
.echarts-wrapper .ant-table-row-hover > td {
  background: #fff !important;
}
.echarts-wrapper .ant-table-tbody > tr > td {
  padding: 0px;
}
</style>
