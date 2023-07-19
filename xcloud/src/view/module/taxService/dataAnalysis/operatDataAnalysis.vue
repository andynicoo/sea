<template>
  <div class="container">
    <div class="content">
      <Row type="flex"
           justify="space-between"
           align="middle"
           class-name="content-title">
        <Col span="6">
        <p class="title-name">运营数据概览</p>
        </Col>
        <Col span="7">
        <div class="timepicker">
          <DatePicker type="daterange"
                      :value="[this.operatDataObj.startTime, this.operatDataObj.endTime]"
                      @on-change="operatDateChange"
                      placeholder="Select date"
                      style="width: 200px"></DatePicker>
          <!-- <DatePicker type="year"
                      :value="currentYear"
                      @on-change="operatDateChange"
                      placeholder="选择年份"
                      style="width: 100px;margin-right:10px;"></DatePicker>
          <Select clearable
                  v-model="operatDataObj.month"
                  style="width: 100px;margin-right:10px;"
                  placeholder="选择月份">
            <Option v-for="(item,index) in monthList"
                    :value="item.month"
                    :key="index">{{ item.monthLabel }}</Option>
          </Select> -->
          <Button type="primary"
                  @click="getOperatData"
                  style="margin-left:10px;">查询</Button>
        </div>
        </Col>
      </Row>
      <Row>
        <div class="itemList">
          <div class="item">
            <div class="item-title">
              运营线索数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{operatData.clewCount || 0}}
              <span class="item-unit">
                人
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              注册用户数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{operatData.registerUserCount || 0}}
              <span class="item-unit">
                人
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              成交用户数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{operatData.payUserCount || 0}}
              <span class="item-unit">
                人
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              税号数
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{operatData.taxVatServiceCount || 0}}
              <span class="item-unit">
                个
              </span>
            </div>
          </div>
          <div class="item">
            <div class="item-title">
              成交金额
              <img src="@/assets/images/home/info-circle.png"
                   alt="">
            </div>
            <div class="item-content">
              {{operatData.payAmount || 0}}
              <span class="item-unit">
                元
              </span>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        <div class="departmentContent">
          <div class="title">
            部门数据统计
          </div>
          <div class="content">
            <DatePicker type="daterange"
                        :value="[this.operatUserDataObj.startTime, this.operatUserDataObj.endTime]"
                        @on-change="operatUserDataChange"
                        placeholder="Select date"
                        style="width: 200px"></DatePicker>
            <Button type="primary"
                    @click="getoperatUserData"
                    style="margin-left:10px;">查询</Button>
            <Table style="margin-top:20px;"
                   :columns="operationUserColums"
                   :data="operatUserData"></Table>
            <div style="margin-top:20px;">
              <Select clearable
                      v-model="operatViewObj.departmentId"
                      @on-change="departmentChange"
                      style="width: 100px;margin-right:10px;"
                      placeholder="选择部门">
                <Option v-for="(item,index) in departmentList"
                        :value="item.departmentId"
                        :key="index">{{ item.departmentName }}</Option>
              </Select>
              <Select clearable
                      v-model="operatViewObj.departmentUserId"
                      style="width: 100px;margin-right:10px;"
                      placeholder="选择人员">
                <Option v-for="(item,index) in departmentUserListData"
                        :value="item.userId"
                        :key="index">{{ item.nickName }}</Option>
              </Select>
              <DatePicker type="year"
                          :value="currentYear"
                          @on-change="operatYearDateChange"
                          placeholder="选择年月"
                          style="width: 100px;margin-right:10px;"></DatePicker>
              <Select clearable
                      v-model="operatViewObj.month"
                      style="width: 100px;margin-right:0px;"
                      placeholder="选择月份">
                <Option v-for="(item,index) in monthList"
                        :value="item.month"
                        :key="index">{{ item.monthLabel }}</Option>
              </Select>
              <Button type="primary"
                      @click="getoperatViewData"
                      style="margin-left:10px;">查询</Button>
              <div class="myChart">
                <div v-show="ishasData">
                  <div id="myChart"
                       :style="{width: '100%', height: '300px'}"></div>
                </div>
                <img v-if="!ishasData"
                     src="@/assets/images/home/emptyStatus.png"
                     alt="">
              </div>
            </div>

          </div>
        </div>
      </Row>
    </div>
    <Modal v-model="editModal"
           :title="madalTitle">
      <Form v-model="targetForm"
            :label-width="80">
        <FormItem label="目标线索数">
          <Input v-model="targetForm.clew"
                 placeholder="请输入目标线索数"></Input>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                @click="editModal=false">取消</Button>
        <Button type="primary"
                @click="submit">确认</Button>
      </p>
    </Modal>
  </div>

</template>
<script>
import {
  operationApi,
  operationUserApi,
  operationViewApi,
  departmentListApi,
  departmentUserListApi,
  operatSaveOrUpdate
} from '@/api/taxService/overView'
import echarts from 'echarts'
export default {
  name: '',
  props: {},
  data() {
    return {
      indexTitle: '',
      operatDataObj: {
        // year: '',
        // month: ''
        startTime:'',
        endTime:''
      },
      operatUserDataObj: {
        startTime: '',
        endTime: '',
      },
      targetForm: {
        clew: ''
      },
      madalTitle: '',
      editModal: false,
      operatUserData: [],
      operationUserColums: [
        {
          title: '排名',
          type: 'index'
        },
        {
          title: '人员名称',
          key: 'departmentUserName'
        },
        {
          title: 'PV',
          key: 'pvCount',
          sortable: true
        },
        {
          title: 'UV',
          key: 'uvCount',
          sortable: true
        },
        {
          title: '目标线索数',
          key: 'clewCount',
          sortable: true,
          render: (h, params) => {
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  marginTop: '-2px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                }
              })
            ])
            return h('div', [
              h('span', params.row.clewCount),
              edit
            ])
          }
        },
        {
          title: '邀请注册数',
          key: 'registerUserCount',
          sortable: true
        },
        {
          title: '成交用户数',
          key: 'payUserCount',
          sortable: true
        },
        {
          title: '本月新成交用户',
          key: 'payUserDataCount',
          sortable: true
        },
        {
          title: '税号数',
          key: 'taxVatServiceCount',
          sortable: true
        }
      ],
      ishasData: true,
      operatData: {},
      operatViewData: [],
      operatViewObj: {
        year: '',
        month: '',
        departmentId: '',
        departmentUserId: ''
      },
      departmentList: [],
      departmentUserListData: [],
      dailyTotalCount: [],
      monthList: function () {
        let list = []
        for (let index = 1; index < 13; index++) {
          let obj = {
            month: index.toString(),
            monthLabel: index + '月'
          }
          list.push(obj)
        }
        return list
      }(),
      currentYear: function (params) {
        let oDay = new Date();
        let year = oDay.getFullYear(); //当前年份
        return year.toString()
      }(),
      currentMonth: function (params) {
        let oDay = new Date();
        let month = oDay.getMonth() + 1; //当前月份
        return month.toString()
      }(),
    }
  },
  methods: {
    getOperatData() {
      if (this.operatDataObj.startTime === '' && this.operatDataObj.endTime === '') {
        this.$Message.error('请选择时间')
        return
      }
      operationApi(this.operatDataObj).then((res) => {
        if (res.code === 0) {
          this.operatData = res.data
        }
      })
    },
    edit(row) {
      this.targetForm.clew = row.clewCount
      this.targetForm.userId = row.departmentUserId
      this.editModal = true
      this.madalTitle = `修改${row.departmentUserName}的目标线索数`
    },
    submit() {
      if (this.targetForm.clew === '') {
        this.$Message.error('请输入目标数')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否保存该数据',
        onOk: () => {
          operatSaveOrUpdate(this.targetForm).then(res => {
            if (res.code === 0) {
              this.$Message.success('修改成功')
              this.editModal = false
              this.getoperatUserData()
            }
          })
        },
      });
    },
    draw() {
      let that = this
      let myChart = echarts.init(document.getElementById('myChart'))
      let xAxisList = []
      if (that.operatViewObj.month === undefined) {
        for (let index = 1; index < 13; index++) {
          let item = index + '月'
          xAxisList.push(item)
        }
      } else {
        for (let index = 1; index < 32; index++) {
          let item = index + '日'
          xAxisList.push(item)
        }
      }
      let departmentNameList = []
      let seriesList = []
      let colorList = ['#1890FF', '#FCBB1C']
      if (this.operatViewData.length > 0) {
        for (let i = 0; i < this.operatViewData.length; i++) {
          departmentNameList.push(this.operatViewData[i].departmentName)
          seriesList[i] = {
            name: `${this.operatViewData[i].departmentName}`,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: colorList[i],
            },
            areaStyle: {
              color: '#1890FF33',
            },
            symbol: 'circle',
            symbolSize: 7,
            itemStyle: {
              normal: {
                color: colorList[i],
              }
            },
            data: this.operatViewData[i].totalList,
          }
        }
      } else {
        seriesList = [{
          name: ``,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#1890FF',
          },
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: {
            normal: {
              color: '#1890FF',
            }
          },
          data: [],
        }]
      }
      // 绘制图表
      let option = {
        xAxis: {
          type: 'category',
          data: xAxisList,
          axisLine: {
            show: false,
            onZero: true,
          },
          minInterval: 1,
          axisTick: {
            show: false
          },
          axisLabel: {
            fontWeight: 'bold',
            fontSize: 14
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          splitLine: {
            // show: false
          },
          axisLine: {
            show: false,
            onZero: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontWeight: 'bold',
            fontSize: 14
          },
        },
        grid: {
          left: '70',
          top: '40',
          width: '90%'
        },
        tooltip: {
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          formatter: function (obj) {
            console.log(obj)
            console.log(that.operatViewData)
            let data = {}
            for (let index = 0; index < that.operatViewData.length; index++) {
              const element = that.operatViewData[index];
              if (element.departmentName === obj.seriesName) {
                data = JSON.parse(JSON.stringify(element))
              }
            }
            let departmentUserName = ''
            let ind = obj.dataIndex
            if (that.operatViewObj.departmentUserId) {
              for (let index = 0; index < data.list.length; index++) {
                const element = data.list[index];
                if (element.departmentUserName !== '') {
                  departmentUserName = element.departmentUserName
                  break;
                }
              }
            }
            let text =
              ` <div style="padding:0px 10px;">
                    <div>${data.departmentName}${departmentUserName}${obj.name}数据</div>
                    <div>运营线索数：${data.list[ind].operationClewCount}</div>
                    <div>注册用户数：${data.list[ind].registerUserCount}</div>
                    <div>成交用户数：${data.list[ind].payUserCount}</div>
                    <div>税号数：${data.list[ind].taxVatServiceCount}</div>
                    <div>成交金额：${data.list[ind].payAmount}</div>
                  </div>
                `
            return text
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          data: departmentNameList
        },
        series: seriesList
      };

      myChart.setOption(option, true);
    },
    getCurrentMonthFirst() {
      var date = new Date()
      date.setDate(1)
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.operatUserDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
      this.operatDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day

    },
    getCurrentMonthLast() {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.operatUserDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      this.operatDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
      return date.getFullYear() + '-' + month + '-' + day
    },
    operatDateChange(val) {
      this.operatDataObj.startTime = val[0]
      this.operatDataObj.endTime = val[1]
      // this.operatDataObj.year = val
    },
    operatYearDateChange(val) {
      this.operatViewObj.year = val
    },
    operatUserDataChange(val) {
      this.operatUserDataObj.startTime = val[0]
      this.operatUserDataObj.endTime = val[1]
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    getoperatUserData() {
      operationUserApi(this.operatUserDataObj).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            this.operatUserData = res.data
          } else {
            this.$Message.error('暂无服务数据')
          }
        }
      })
    },
    getDepartmentListData() {
      departmentListApi({
        departmentCode: '001'
      }).then((res) => {
        if (res.code === 0) {
          this.departmentList = res.data
        }
      })
    },
    getoperatViewData() {
      operationViewApi(this.operatViewObj).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') {
            for (let index = 0; index < res.data.length; index++) {
              res.data[index].totalList = res.data[index].list.map((ele) => {
                return ele.totalDate
              })
            }
            this.$nextTick(() => {
              this.ishasData = true
              this.operatViewData = res.data
              this.draw()
            })
          } else {
            this.$nextTick(() => {
              this.ishasData = false
              this.operatViewData = []
              this.draw()
            })
          }
        }
      })
    },
    departmentUserList(val) {
      let obj = {}
      if (val) {
        obj = {
          'departmentId': val
        }
      } else {
        obj = {
          'departmentCode': '001'
        }
      }
      departmentUserListApi(obj).then(res => {
        if (res.code === 0) {
          this.departmentUserListData = res.data
        }
      })
    },

    departmentChange(val) {
      this.operatViewObj.departmentId = val
      this.departmentUserList(val)
    },
  },
  created() {
    // this.operatDataObj.month = this.currentMonth
    // this.operatDataObj.year = this.currentYear
    this.operatViewObj.year = this.currentYear
    this.operatViewObj.month = this.currentMonth
    this.getCurrentMonthFirst()
    this.getCurrentMonthLast()
    this.getOperatData()
    this.getoperatUserData()
    this.getDepartmentListData()
    this.getoperatViewData()
    this.departmentUserList()
  },
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
/deep/ .ivu-table td {
  font-size: 16px;
  font-family: PingFangSC;
  color: #333333;
  line-height: 14px;
}
/deep/ .ivu-table th {
  font-weight: bold;
}
.content {
  text-align: left;
  .content-title {
    padding: 14px;
    background: #ffffff;
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 14px;
    .timepicker {
      float: right;
    }
  }
  .itemList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    .item {
      // min-width: 155px;
      width: 19%;
      height: 88px;
      background: #ffffff;
      border-radius: 4px;
      padding: 12px;
      .item-title {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        img {
          width: 10px;
          float: right;
          margin-top: 5px;
        }
      }
      .item-content {
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 38px;
      }
      .item-unit {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
      }
    }
  }
  .businessAnalysis {
    background: #ffffff;
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px 24px;
      font-size: 18px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .businessContent {
      .businessSwiper {
        padding: 20px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left,
        .right {
          display: block;
          img {
            width: 16px;
            cursor: pointer;
          }
        }
        .center {
          width: 100%;
          height: 110px;
          margin: 0px 12px;
          position: relative;
          overflow: hidden;
          .list {
            display: flex;
            align-items: center;
            position: absolute;
            left: 0px;
            top: 0px;
            transition: 0.5s ease;
            width: 100%;
            .box {
              width: 250px;
              min-width: 250px;
              border-top: 1px solid #e9e9e9;
              border-bottom: 1px solid #e9e9e9;
              border-right: 1px solid #e9e9e9;
              padding: 20px 16px;
              background: rgba(153, 153, 153, 0.08);
              cursor: pointer;
              .top {
                display: flex;
                align-items: center;
                img {
                  width: 24px;
                  height: 24px;
                  margin-right: 12px;
                }
                .word {
                  font-size: 16px;
                  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
                  font-weight: 500;
                  color: rgba(0, 0, 0, 0.85);
                  line-height: 24px;
                  margin-right: 10px;
                }
                .num {
                  font-size: 24px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #333333;
                  line-height: 32px;
                }
              }
              .bottom {
                font-size: 14px;
                font-family: SourceHanSansSC-Normal, SourceHanSansSC;
                font-weight: 400;
                color: #666666;
                line-height: 20px;
                margin-top: 10px;
                padding-left: 35px;
              }
            }
            .active {
              box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.09);
              background: #ffffff;
              border-radius: 4px 0px 0px 4px;
              border: 1px solid #e9e9e9;
            }
          }
        }
        @media screen and (min-width: 1800px) {
          .left,
          .right {
            display: none;
          }
          .center {
            .list {
              .box {
                width: 16.5%;
                min-width: 250px;
              }
            }
          }
        }
      }
    }
    .chartContent {
      padding: 0px 24px 0px 24px;
    }
  }
  .departmentContent {
    background: #ffffff;
    margin-top: 24px;
    /deep/ .ivu-table th {
      background-color: #16ade933;
      text-align: center;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 14px;
    }
    /deep/ .ivu-table td {
      text-align: center;
      font-family: PingFangSC;
      color: #333333;
      line-height: 14px;
    }
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px 24px;
      font-size: 18px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .content {
      padding: 20px 24px;
    }
  }
  .unit {
    font-size: 16px;
  }
  .title-name {
    font-size: 18px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
  }
  .content-type {
    padding: 20px;
    background: #ffffff;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .topSearch {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dcdee2;
    .title-name {
      line-height: 20px;
      font-size: 14px;
      color: #17233d;
      font-weight: bold;
    }
  }
  .myChart {
    text-align: center;
    height: 300px;
    img {
      width: 106px;
      margin-top: 100px;
    }
  }
}

.bottom {
  margin-top: 15px;
}

.pageContent {
  text-align: right;
  padding-top: 20px;
}

.num-info {
  .title {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }
  .value {
    .total {
      color: rgba(0, 0, 0, 0.85);
      display: inline-block;
      line-height: 32px;
      height: 32px;
      font-size: 24px;
      margin-right: 32px;
    }
    .subtotal {
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      vertical-align: top;
      margin-right: 0;
      i {
        font-size: 22px;
        color: red;
        transform: scale(0.82);
        margin-left: 4px;
      }
    }
  }
}

#chart,
#myChart {
  width: 100%;
  height: 100px;
  margin: auto;
  top: -10px;
}

#search,
#search1 {
  height: 100px;
}

#pie {
  height: 300px;
}

#sale,
#scan {
  height: 300px;
}

.ivu-divider-horizontal {
  margin: 10px 0;
}

.txt-left {
  text-align: left;
  .title,
  a {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  .num {
    font-size: 30px;
    color: #000;
    margin-bottom: 10px;
  }
  .des,
  .footer {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    i {
      font-size: 22px;
      margin-right: 10px;
    }
  }
  .des {
    margin-top: 23px;
  }
  .chart_divider {
    margin-top: -55px;
  }
  .progress {
    margin: 8px 0;
  }
}

.tab {
  margin-top: 15px;
  padding: 20px 10px 15px;
  background-color: #fff;
  .extra-item {
    display: inline-block;
    margin-right: 24px;
    a {
      margin-left: 24px;
    }
  }
  .title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    text-align: left;
  }
}
</style>
