<template>
  <div>
    <Card>
      <p class="title"
         style="font-size:18px;">交付数据</p>
      <div class="content-box">
        <div class="box border">
          <div class="top-content first">
            <Select v-model="handlerRole"
                    @on-change="changeHandler"
                    style="width:110px">
              <Option v-for="item in handlerList"
                      :value="item.value"
                      :key="item.value">{{ item.handlerRole }}</Option>
            </Select>
            <div class="tabs-box">
              <span v-for="item in productList"
                    :value="item.id"
                    :key="item.id"
                    :class="item.isChecked?'isChecked':''"
                    @click="changeProduct(item.id)">{{item.paroductName}}</span>
            </div>
            <Tooltip placement="left"
                     v-show="handlerRole==1"
                     style="float:right;line-height:42px;"
                     :transfer="true"
                     max-width="400"
                     content="统计周期：指初审处理日期区间。
初审效率：统计周期内，处理人操作指定服务的效率。
处理次数：统计周期内，处理人初审指定服务的所有次数（一个服务多次初审算多次）。
通过率：统计周期内，处理人初审业务时结果为通过的次数之和/处理次数*100%。
二次驳回率：统计周期内，该处理人该业务，在律师审核时被驳回的次数之和/处理人初审业务时结果为通过的次数之和*100%。
处理时效：统计周期内，该处理人该业务，所有（初审时间减去提交资料时间）的平均值"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
            <Tooltip placement="left"
                     v-show="handlerRole==2"
                     :transfer="true"
                     max-width="400"
                     style="float:right;line-height:42px;"
                     content="统计周期：指律师审核的日期区间。
律师审核效率：统计周期内，处理人/律师操作指定服务的效率。
下载资料件数：统计周期内，处理人下载指定服务的所有件数（一个服务下载多次算一次）。
下载时效：统计周期内，所有（最新的下载时间减去初审通过时间）的平均值。
上传受理号件数：统计周期内，处理人上传受理号的所有件数（一个服务上传多次算一次）。此，不考虑下载和上传受理的处理人不一致的情况，仅记录下载的处理人。
受理时效：统计周期内，所有（录入受理信息的时间减去最新的下载时间）的平均值。"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
            <Tooltip placement="left"
                     v-show="handlerRole==3"
                     :transfer="true"
                     max-width="400"
                     style="float:right;line-height:42px;"
                     content="统计周期：指受理日期区间。
列表：统计周期内，被下OA的服务。
一次OA/官方日期：指一次OA的官方日期。
二次OA/官方日期：指二次OA的官方日期。"
                     theme="light">
              <img src="@/assets/images/iipto-common/wenhao.svg">
            </Tooltip>
          </div>
          <div class="top-content second">
            <Form :model="searchForm"
                  inline
                  class="form-box">
              <FormItem label="统计周期"
                        style="width:250px;">
                <DatePicker type="daterange"
                            placement="bottom-start"
                            :clearable="false"
                            :value="deafaultDate"
                            :options="options"
                            @on-change="changeDealDate"
                            placeholder="选择周期"
                            style="width: 190px"></DatePicker>
              </FormItem>
              <FormItem label="统计范围:"
                        style="width:410px;"
                        v-if="handlerRole!=3">
                <Select v-model="searchForm.type"
                        @on-change="changeType"
                        placeholder="部门"
                        style="width: 100px">
                  <Option value="0">不限</Option>
                  <Option value="1">部门</Option>
                  <Option value="2">员工</Option>
                </Select>
                <Select v-model="searchForm.depId"
                        v-if="searchForm.type!=0"
                        @on-change="changeDepartment"
                        placeholder="部门名称"
                        style="width: 100px;margin:0 16px;">
                  <Option :value="item.departmentId"
                          v-for="(item,index) in departmentList"
                          :key="index">{{item.departmentName}}</Option>
                </Select>
                <Select v-model="searchForm.userId"
                        @on-change="changeUser"
                        placeholder="员工姓名"
                        style="width: 100px"
                        v-show="searchForm.type==2">
                  <Option :value="item.userId"
                          v-for="(item,index) in staffList"
                          :key="index">{{item.nickName}}</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
          <div class="bottom-content">
            <div class="title">
              <span class="left-num">详细数据</span>
              <span class="right-btn"
                    @click="exportFunc">导出Excel</span>
            </div>
            <div v-if="handlerRole==1">
              <ul class="statics-box">
                <li>总处理次数：
                  <span>{{staticsInfo.totalDealNum||0}}</span> 次；</li>
                <li>平均通过率：
                  <span>{{staticsInfo.avgPassRate||0}}</span> %；</li>
                <li>平均二次驳回率：
                  <span>{{staticsInfo.avgSecondRejectRate||0}}</span> %；</li>
                <li>平均处理时效：
                  <span>{{changeHourMinutestr(staticsInfo.avgPrescription)}}</span>
                </li>
              </ul>
              <Table :data="tableData"
                     :columns="columns1"
                     style="margin:10px 0;"></Table>
            </div>
            <div v-if="handlerRole==2">
              <ul class="statics-box">
                <li>总下载资料件数：
                  <span>{{staticsInfo.totalDownNum||0}}</span> 件；</li>
                <li>平均下载时效：
                  <span>{{changeHourMinutestr(staticsInfo.avgDownTimeliness||0)}}</span> ；</li>
                <li>总上传受理号件数：
                  <span>{{staticsInfo.upLoadAcceptNumCount||0}}</span> 件；</li>
                <li>平均受理时效：
                  <span>{{changeHourMinutestr(staticsInfo.avgDealTimeliness)}}</span>
                </li>
              </ul>
              <Table :data="tableData"
                     :columns="columns2"
                     style="margin:10px 0;"></Table>
            </div>
            <div v-if="handlerRole==3">
              <ul class="statics-box">
                <li>一次OA数量：
                  <span>{{staticsInfo.onceTotal||0}}</span> ；</li>
                <li>二次OA数量：
                  <span>{{staticsInfo.secondTotal||0}}</span> ；</li>
              </ul>
              <Table :data="tableData"
                     :columns="columns3"
                     :loading="tableLoading"
                     style="margin:10px 0;">
                <template slot="serviceInfo"
                          slot-scope="{ row }">
                  <p style="color:#3AA1FF;cursor:pointer"
                     @click="toServiceDetail(row.servcieId)">{{row.servcieNo}}</p>
                </template>
              </Table>
            </div>
            <Page @on-change="changePageHandler"
                  @on-page-size-change="handlePageSize"
                  :current="pageInfo.page"
                  :total="listTotal"
                  :page-size="pageInfo.limit"
                  show-elevator
                  show-sizer
                  style="float:right;" />
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { getInitialAuditEfficiencyListApi, getInitialAuditEfficiencyCountStatisticsApi, getOaStatisticsListApi, getOaCountStatisticsApi, lawyerAuditListApi, lawyerAuditStaticsApi, getAllUserAndDepartmentApi } from '@/api/iipto/deliveryData'
import { getToken } from '@/libs/util'
export default {
  data() {
    return {
      tableLoading: false,
      handlerList: [
        {
          handlerRole: '初审效率',
          value: '1'
        },
        {
          handlerRole: '律师审核时效',
          value: '2'
        },
        {
          handlerRole: 'OA次数',
          value: '3'
        },
      ],
      handlerRole: '1',
      productList: [
        {
          paroductName: '全部',
          id: '0',
          isChecked: true,
          countryCode: '',
          functionCode: ''
        },
        {
          paroductName: '美国商标',
          id: '1',
          isChecked: false,
          countryCode: 'US',
          functionCode: '1'
        },
        {
          paroductName: '美国商标(顾问)',
          id: '2',
          isChecked: false,
          countryCode: 'US',
          functionCode: '3'
        },
        {
          paroductName: '欧盟商标',
          id: '3',
          isChecked: false,
          countryCode: 'EU',
          functionCode: '1'
        },
        {
          paroductName: '英国商标',
          id: '4',
          isChecked: false,
          countryCode: 'GB',
          functionCode: '1'
        },
        {
          paroductName: '日本商标',
          id: '5',
          isChecked: false,
          countryCode: 'JP',
          functionCode: '1'
        },
      ],
      tableData: [],
      columns1: [
        {
          title: '所属部门',
          key: 'depName'
        },
        {
          title: '处理人',
          key: 'userName'
        },
        {
          title: '处理业务',
          render: (h, params) => {
            return h('span', params.row.countryNameZh + this.$functionCodeList(params.row.fucntionCode))
          },
        },
        {
          title: '处理次数',
          sortable: true,
          key: 'totalDealTimes',
        },
        {
          title: '通过率',
          sortable: true,
          render(h, params) {
            return h('span', params.row.passRate + '%')
          },
          key: 'passRate',
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          }
        },
        {
          title: '二次驳回率',
          sortable: true,
          key: 'secondRejectRate',
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          },
          render(h, params) {
            return h('span', params.row.secondRejectRate + '%')
          },
        },
        {
          title: '处理时效',
          sortable: true,
          key: 'prescription',
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          },
          render: (h, params) => {
            let dealTime = this.changeHourMinutestr(params.row.prescription)
            return h('span', dealTime)
          },
        },
      ],
      columns2: [
        {
          title: '所属部门',
          key: 'consoleDepName'
        },
        {
          title: '处理人',
          key: 'consoleUserName'
        },
        {
          title: '下载资料件数',
          key: 'downLoadCount',
          sortable: true,
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          }
        },
        {
          title: '下载时效',
          key: 'downLoadCountTimeliness',
          render: (h, params) => {
            let dealTime = this.changeHourMinutestr(params.row.downLoadCountTimeliness)
            return h('span', dealTime)
          },
          sortable: true,
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          }
        },
        {
          title: '律师姓名',
          key: 'attorneyName',
        },
        {
          title: '上传受理号件数',
          key: 'upLoadAcceptNumCount'
        },
        {
          title: '受理时效',
          sortable: true,
          key: 'dealTimeliness',
          sortMethod: (a, b, type) => {  //核心是这里
            if (type === 'asc') {
              return parseInt(a) < parseInt(b) ? 1 : -1;
            } else {
              return parseInt(a) > parseInt(b) ? 1 : -1;
            }
          },
          render: (h, params) => {
            let dealTime = this.changeHourMinutestr(params.row.dealTimeliness)
            return h('span', dealTime)
          },
        },
      ],
      columns3: [
        {
          title: '服务编号',
          slot: 'serviceInfo',
          key: 'servcieNo'
        },
        {
          title: '一次OA/官方日期',
          sortable: true,
          key: 'firstTime'
        },
        {
          title: '二次OA/官方日期',
          sortable: true,
          key: 'secondTime'
        },
        {
          title: '受理日期',
          sortable: true,
          key: 'acceptTime',
        }
      ],
      options: {
        disabledDate(date) {
          return (date > Date.now())
        }
      },
      searchForm: {
        type: '0',
        startDate: new Date().pattern("yyyy-MM-") + '01',
        endDate: new Date().pattern("yyyy-MM-dd"),
        // userId: this.$store.state.user.userId,
        userId: '',
        depId: '',
        countryCode: '',
        functionCode: ''
      },
      deafaultDate: [new Date().pattern("yyyy-MM-") + '01', new Date().pattern("yyyy-MM-dd")],
      departmentList: [],
      staffList: [],
      listTotal: 0,
      pageInfo: {
        page: 1,
        limit: 10
      },
      staticsInfo: {}
    }
  },
  mounted() {
    this.getUserAPi()
    this.getTableFunc(1)
  },
  methods: {
    changeProduct(id) {
      this.productList.map(item => {
        item.isChecked = false
        if (item.id == id) {
          item.isChecked = true
          this.searchForm.countryCode = item.countryCode
          this.searchForm.functionCode = item.functionCode
        }
      })
      this.getTableFunc(1)
    },
    changeDealDate(val) {
      this.searchForm.startDate = val[0]
      this.searchForm.endDate = val[1]
      this.getTableFunc(1)
    },
    getUserAPi() {
      getAllUserAndDepartmentApi({ 'userId': this.searchForm.userId }).then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.departmentList = res.data
          }
        }
      })
    },
    changeHandler(val) {
      this.getTableFunc(1)
    },
    changeType(val) {
      if (val == '0') {
        this.searchForm.userId = '',
          this.searchForm.depId = ''
        this.getTableFunc(1)
      } else if (val == '1') {
        this.searchForm.userId = ''
        if (this.searchForm.depId) {
          this.changeDepartment()
        }
      }
    },
    changeDepartment(val) {
      if (this.searchForm.type == 1) {
        this.searchForm.userId = ''
        this.getTableFunc(1)
      }
      this.departmentList.map(item => {
        if (val == item.departmentId) {
          this.staffList = item.children
        }
      })
    },
    changeUser(val) {
      if (val != undefined) {
        this.getTableFunc(1)
      }
    },
    getTableFunc(page) {
      this.tableLoading = true
      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      if (this.handlerRole == 1) {
        this.efficiencyFunc(data)
      } else if (this.handlerRole == 3) {
        this.oaNumFunc(data)
      } else if (this.handlerRole == 2) {
        this.lawyerAuditFunc(data)
      }
    },
    //翻页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getTableFunc()
    },
    //调整页数
    handlePageSize(limit) {
      this.pageInfo.limit = limit
      this.getTableFunc(1)
    },
    //初审效率
    efficiencyFunc(data) {
      getInitialAuditEfficiencyListApi(data).then(res => {
        if (res.code == 0) {
          this.listTotal = res.data.total - 0
          this.tableData = res.data.records
        }
      }).finally(() => {
        this.tableLoading = false
      })
      getInitialAuditEfficiencyCountStatisticsApi(data).then(res => {
        if (res.code == 0) {
          this.staticsInfo = res.data
        }
      })
    },
    //律师审核
    lawyerAuditFunc(data) {
      lawyerAuditListApi(data).then(res => {
        if (res.code == 0) {
          this.listTotal = res.data.total - 0
          this.tableData = res.data.records
        }
      }).finally(() => {
        this.tableLoading = false
      })
      lawyerAuditStaticsApi(data).then(res => {
        if (res.code == 0) {
          this.staticsInfo = res.data
        }
      })
    },
    //oa数据
    oaNumFunc(data) {
      getOaStatisticsListApi(data).then(res => {
        if (res.code == 0) {
          this.listTotal = res.data.total - 0
          this.tableData = res.data.records
        }
      }).finally(() => {
        this.tableLoading = false
      })
      getOaCountStatisticsApi(data).then(res => {
        if (res.code == 0) {
          this.staticsInfo = res.data
        }
      })
    },
    changeHourMinutestr(str) {
      if (str !== "0" && str !== "" && str !== null && str !== undefined) {
        return ((Math.floor(str / 60)).toString().length < 2 ? + (Math.floor(str / 60)).toString() :
          (Math.floor(str / 60)).toString()) + "小时" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString()) + '分';
      } else {
        return "";
      }
    },
    exportFunc() {
      let formData = new FormData()
      formData.append('startDate', this.searchForm.startDate)
      formData.append('endDate', this.searchForm.endDate)
      formData.append('countryCode', this.searchForm.countryCode)
      formData.append('functionCode', this.searchForm.functionCode)
      if (this.handlerRole != 2) {
        formData.append('type', this.searchForm.type)
        formData.append('userId', this.searchForm.userId)
        formData.append('depId', this.searchForm.depId)
      }
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      if (this.handlerRole == 1) {
        xmlResquest.open('post', this.baseUrl + '/trademark/workOrderInitialAuditEfficiency/export', true)
      } else if (this.handlerRole == 2) {
        xmlResquest.open('post', this.baseUrl + '/trademark/workOrderMaterialDownloadOperateRecord/export', true)
      } else if (this.handlerRole == 3) {
        xmlResquest.open('post', this.baseUrl + '/trademark/workOrderOaStatistics/export', true)
      }

      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    toServiceDetail(id) {
      this.$router.push({
        name: 'iiptoWorkOrderList',
        params: {
          id,
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-card-body {
  padding: 0;
}
/deep/ .ivu-card-body {
  .title {
    font-size: 16px;
    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
    padding: 16px 20px;
  }
  .title.line {
    border-bottom: 1px solid #dddddd;
  }
  .content-box {
    padding: 16px 20px;
    .box.border {
      border: 1px solid #ddd;
      padding-bottom: 40px;
      .top-content {
        background-color: #f4f6f7;
        padding: 0 20px;
        border-bottom: 1px solid #dddddd;
        .tabs-box {
          display: inline-block;
          span {
            display: inline-block;
            margin-left: 26px;
            cursor: pointer;
          }
          span.isChecked {
            color: #fff;
            padding: 10px 20px;
            background-color: #1890ff;
          }
        }
        button {
          float: right;
          margin-top: 4px;
        }
      }
      .top-content.second {
        background-color: #fff;
        padding-top: 14px;
      }
      .bottom-content {
        padding: 30px 20px;
        .title {
          padding: 0;
          .left-num {
            font-weight: 700;
            color: #333;
          }
          .right-btn {
            float: right;
            cursor: pointer;
            color: #3aa1ff;
          }
        }
        .statics-box {
          margin-top: 8px;
          padding: 8px 10px;
          border: 1px solid rgba(186, 231, 255, 1);
          background-color: #e6f7ff;
          li {
            display: inline-block;
            margin-right: 10px;
            span {
              color: #000;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}
/deep/ .top-content.first .ivu-select-selection {
  border: none;
  background-color: #f4f6f7;
}
.set-box {
  position: relative;
  .operation-box {
    position: absolute;
    bottom: 0;
    right: 8px;
    img {
      margin-right: 10px;
    }
  }
}
/deep/ .ivu-tooltip-inner {
  max-width: 400px;
  white-space: break-spaces;
}
/deep/ .ivu-form-item {
  margin-bottom: 14px;
}
</style>

