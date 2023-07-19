<template>
    <div class="container">
        <div class="content">
            <Row type="flex"
                justify="space-between"
                align="middle"
                class-name="content-title">
                <Col span="6">
                    <p class="title-name">渠道数据概览</p>
                </Col>
                <Col span="7">
                    <div class="timepicker">
                        <DatePicker type="daterange"
                                    :value="[this.channelDataObj.startTime, this.channelDataObj.endTime]"
                                    @on-change="channelDataChange"
                                    placeholder="Select date"
                                    style="width: 200px"></DatePicker>
                        <!-- <DatePicker type="year"
                                    :value="currentYear"
                                    @on-change="operatDateChange"
                                    placeholder="选择年份"
                                    style="width: 100px;margin-right:10px;"></DatePicker>
                        <Select clearable
                                v-model="channelDataObj.month"
                                style="width: 100px;margin-right:10px;"
                                placeholder="选择月份">
                            <Option v-for="(item,index) in monthList"
                                    :value="item.month"
                                    :key="index">{{ item.monthLabel }}</Option>
                        </Select> -->
                        <Button type="primary"
                                @click="getchannelData"
                                style="margin-left:10px;">查询</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <div class="itemList">
                    <div class="item">
                        <div class="item-title">
                        注册用户数
                        <img src="@/assets/images/home/info-circle.png"
                            alt="">
                        </div>
                        <div class="item-content">
                            {{ channelData.registerUserCount || 0 }}
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
                            {{ channelData.payUserCount || 0 }}
                        <span class="item-unit">
                            人
                        </span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-title">
                        成交税号数
                        <img src="@/assets/images/home/info-circle.png"
                            alt="">
                        </div>
                        <div class="item-content">
                            {{ channelData.taxVatServiceCount || 0 }}
                        <span class="item-unit">
                        </span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-title">
                        退款税号数
                        <img src="@/assets/images/home/info-circle.png"
                            alt="">
                        </div>
                        <div class="item-content">
                            {{ channelData.refundTaxVatServiceCount || 0 }}
                        <span class="item-unit">
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
                            {{ channelData.payAmount || 0 }}
                        <span class="item-unit">
                        </span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="item-title">
                        退款金额
                        <img src="@/assets/images/home/info-circle.png"
                            alt="">
                        </div>
                        <div class="item-content">
                            {{ channelData.refundAmount || 0 }}
                        <span class="item-unit">
                        </span>
                        </div>
                    </div>
                </div>
            </Row>
            <div class="departmentContent">
                <div class="title">
                    渠道用户数据统计
                </div>
                <div class="content">
                    <span style="margin-right:10px">
                    <Select v-model="channelUserDataObj.countryCode" style="width:200px" placeholder="全部国家">
                        <Option value="" key="-1">全部国家</Option>
                        <Option 
                            v-for="(item,index) in countryList" 
                            :value="item.countryCode" 
                            :key="index">{{ item.countryNameZh }}</Option>
                    </Select>
                    </span>
                    <DatePicker type="daterange"
                                :value="[this.channelUserDataObj.startTime, this.channelUserDataObj.endTime]"
                                @on-change="channelUserDataChange"
                                placeholder="Select date"
                                style="width: 200px"></DatePicker>
                    <Button type="primary"
                            @click="getchannelUserData"
                            style="margin-left:10px;">查询</Button>
                    <Table height="420"
                        style="margin-top:20px;"
                        :columns="operationUserColums"
                        :data="channelUserData"></Table>
                    <Page :total="totalLength" 
                        show-total 
                        :page-size="pageInfo.limit"
                        @on-change="pageChange" 
                        :current="pageInfo.page"/>
                </div>
                
            </div>   
        </div>
    </div>
</template>

<script>
import { getTaxCountry } from '@/api/taxService/common.js'
import { channelUserApi,channelApi } from '@/api/taxService/overView'
export default {
    data() {
        return {
            totalLength:0,
            channelData: {},
            countryList: [],
            channelUserDataObj: {
                startTime: '',
                endTime: '',
                countryCode:''
            },
            channelDataObj: {
                // year: '',
                // month: ''
                startTime: '',
                endTime: ''
            },
            // monthList: function () {
            //     let list = []
            //     for (let index = 1; index < 13; index++) {
            //     let obj = {
            //         month: index.toString(),
            //         monthLabel: index + '月'
            //     }
            //     list.push(obj)
            //     }
            //     return list
            // }(),
            currentYear: function (params) {
                let oDay = new Date();
                let year = oDay.getFullYear(); //当前年份
                return year.toString()
            }(),
            // currentMonth: function (params) {
            //     let oDay = new Date();
            //     let month = oDay.getMonth() + 1; //当前月份
            //     return month.toString()
            // }(),
            operationUserColums: [
                {
                    title:'序号',
                    type: 'index'
                },
                {
                    title:'用户昵称',
                    key:'userNickname'
                },
                {
                    title:'用户手机号',
                    key:'userMobile'
                },
                {
                    title:'成交订单',
                    key:'payOrderCount',
                    sortable: true
                },
                {
                    title:'成交金额',
                    key:'payAmount',
                    sortable: true
                },
                {
                    title:'退款金额',
                    key:'refundAmount',
                    sortable: true
                },
                {
                    title:'成交税号数',
                    key:'taxVatServiceCount',
                    sortable: true
                },
                {
                    title:'退款税号数',
                    key:'refundTaxVatServiceCount',
                    sortable: true
                }
            ],
            channelUserData:[],
            pageInfo:{
                page: 1,
                limit: 10
            }
        }
    },
    methods:{
        //获取税号国家下拉数据
        getCountryList() {
            getTaxCountry().then((res) => {
                if (res.code == 0) {
                this.countryList = res.data
                }
            })
        },
        channelDataChange(val) {
            this.channelDataObj.startTime = val[0]
            this.channelDataObj.endTime = val[1]
        },
        getCurrentMonthFirst() {
            var date = new Date()
            date.setDate(1)
            var month = parseInt(date.getMonth() + 1)
            var day = date.getDate()
            if (month < 10) month = '0' + month
            if (day < 10) day = '0' + day
            this.channelUserDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
            this.channelDataObj.startTime = date.getFullYear() + '-' + month + '-' + day
            return date.getFullYear() + '-' + month + '-' + day

        },
        getCurrentMonthLast() {
            var date = new Date()
            var month = parseInt(date.getMonth() + 1)
            var day = date.getDate()
            if (month < 10) month = '0' + month
            if (day < 10) day = '0' + day
            this.channelUserDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
            this.channelDataObj.endTime = date.getFullYear() + '-' + month + '-' + day
            return date.getFullYear() + '-' + month + '-' + day
        },
        getchannelUserData() {
            let params = { ...this.channelUserDataObj, ...this.pageInfo }
            channelUserApi(params).then(res => {
                if (res.code === 0) {
                if (JSON.stringify(res.data) !== '{}') {
                    this.channelUserData = res.data.records
                    this.totalLength = Number(res.data.total)
                } else {
                    this.$Message.error('暂无服务数据')
                }
                }
            })
        },
        channelUserDataChange(val) {
            this.channelUserDataObj.startTime = val[0]
            this.channelUserDataObj.endTime = val[1]
        },
        operatDateChange(val) {
            this.channelDataObj.year = val
        },
        getchannelData() {
            if (this.channelDataObj.startTime === '' && this.channelDataObj.endTime === '') {
                this.$Message.error('请选择时间')
                return
            }
            // console.log(this.channelDataObj)
            channelApi(this.channelDataObj).then((res) => {
                if (res.code === 0) {
                this.channelData = res.data
                }
            })
        },
        pageChange(page) {
            this.pageInfo.page = page
            this.getsaleUserData()
        }
    },
    created() {
        // this.channelDataObj.month = this.currentMonth
        this.channelDataObj.year = this.currentYear
        this.getCurrentMonthFirst()
        this.getCurrentMonthLast()
    },
    mounted() {
        this.getCountryList()
        this.getchannelData()
        this.getchannelUserData()
    }
}
</script>

<style lang="less" scoped>
.title-name {
    font-size: 18px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
  }
.container{
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
      width: 15.5%;
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
</style>