import Goods from '@/api/goods'
import moment from 'moment'
import { compact } from 'lodash'

export default {
  data() {
    return {
      minuteNum: 0,
      autoNum: [],
      autoNumMin: [0, 1, 3, 5, 10, 15, 20, 30, 40, 50],
      autoNumHour: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 24]
    }
  },
  methods: {
    getAutoNum() {
      const { autoNumMin, autoNumHour } = this.$data
      autoNumMin.map((ele) => {
        const item = {
          text: ele + this.$t('common.minute'),
          num: ele
        }
        this.$data.autoNum.push(item)
      })
      autoNumHour.map((ele) => {
        const item = {
          text: ele + this.$t('common.hour'),
          num: ele * 60
        }
        this.$data.autoNum.push(item)
      })
    },
    /**
     * 批量定时发布点击事件
     */
    onShowDatePicker(open) {
      //   const { selectedRowKeys, selectedRows } = this.$data
      // 勾选商品有cscn产品时，过滤掉cscn,不能进行旧批量编辑
      //   if (selectedRows.some((item) => item.merchantId)) {
      //     this.$message.error('CNSC产品不支持批量定时发布')
      //     this.$data.selectedRowKeys = []
      //     this.$data.selectedRows = this.$data.selectedRows.map((item) => {
      //       if (!item.merchantId) {
      //         this.$data.selectedRowKeys.push(item.id)
      //         return item
      //       }
      //     })
      //     this.$data.selectedRows = compact(this.$data.selectedRows)
      //     if (!this.$data.selectedRowKeys.length) {
      //       return
      //     }
      //   }
      //   if (!selectedRowKeys.length) {
      //     this.$message.error(this.$t('toBeEdit.showDatePickerError'))
      //     return
      //   }
      this.$data.datePickerVisible = open
    },
    /**
     * 批量定时发布OK
     */
    onDatePickerOk(date) {
      const { selectedRowKeys, minuteNum } = this.$data
      // 批量定时发布，选择的定时发布时间小于提交按钮的时间时，按照立即发布处理
      // if (
      //   moment(date)
      //     .add(this.$data.minuteNum, 'minutes')
      //     .isBefore(moment())
      // ) {
      //   this.$message.error(this.$t('toBeEdit.datePickerOkError'))
      //   return
      // }
      const time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      let params = {
        definiteTime: time,
        productIds: selectedRowKeys,
        timeInterval: minuteNum
      }
      this.$data.batchTimePublishLoading = true
      Goods.setTimedReleaseTime(params)
        .then(() => {
          this.$data.datePickerVisible = false
          this.$message.success(this.$t('common.handlerSuccess'))
          this.reLoadData()
        })
        .finally(() => {
          this.$data.batchTimePublishLoading = false
        })
    },
    range(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    disabledDateTime(date) {
      const time = moment(date).format('YYYY-MM-DD HH:mm:ss')
      const timeDay = moment(date).format('YYYY-MM-DD')
      var now = new Date()
      var hour = now.getHours()
      var minutes = now.getMinutes()
      var seconds = now.getSeconds()
      return {
        disabledHours: () => {
          if (timeDay == moment(now).format('YYYY-MM-DD')) {
            return this.range(0, 24).splice(0, hour > 9 ? hour : '0' + hour)
          } else {
            return []
          }
        },
        disabledMinutes: (h) => {
          // console.log(h, minutes)
          if (timeDay == moment(now).format('YYYY-MM-DD')) {
            if (h > hour) {
              return []
            } else if (h == hour) {
              return this.range(0, minutes)
            } else {
              return this.range(0, 60)
            }
          } else {
            return []
          }
        },
        disabledSeconds: () => [0, 59]
      }
    }
  }
}
