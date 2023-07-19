<template>
  <div class="app-container">
    <!-- <p class="title" style="font-size:18px;">交付数据</p> -->
    <div ref="searchBox" class="search-box header-container" :class="moreSerch ? 'styleclass' : ''">
      <el-form ref="searchForm" inline label-width="90px">
        <el-form-item label="统计周期">
          <el-date-picker @change="changeDealDate" v-model="deafaultDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="统计内容:">
          <el-select v-model="handlerRole" @change="changeHandler" clearable filterable placeholder="请选择">
            <el-option v-for="item in handlerList" :key="item.value" :label="item.handlerRole" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计国家:">
          <el-select v-model="countryCode" @change="changeCountry" clearable filterable placeholder="请选择">
            <el-option v-for="item in productList" :key="item.id" :label="item.paroductName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计范围:">
          <el-select v-model="searchForm.type" @change="changeType" placeholder="部门" clearable filterable>
            <el-option :value="0" label="不限">不限</el-option>
            <el-option :value="2" label="员工">员工</el-option>
            <el-option :value="1" label="部门">部门</el-option>
          </el-select>
          <el-select v-model="searchForm.depId" v-if="searchForm.type!=0" @change="changeDepartment" placeholder="部门名称" style="width: 100px;margin:0 16px;">
            <el-option :value="item.departmentId" v-for="(item,index) in departmentList" :key="index" :label="item.departmentName"></el-option>
          </el-select>
          <el-select v-model="searchForm.userId" @change="changeUser" placeholder="员工姓名" style="width: 100px" v-show="searchForm.type==2">
            <el-option :value="item.code" v-for="(item,index) in staffList" :key="index" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="excelAndDate">
        <span class="left-num">
          <div>详细数据</div>
          <el-tooltip v-show="handlerRole==1" class="item" effect="dark" placement="top-start">
            <div slot="content" style="max-width:400px">
              统计周期：指初审处理日期区间。
              初审效率：统计周期内，处理人操作指定服务的效率。
              处理次数：统计周期内，处理人初审指定服务的所有次数（一个服务多次初审算多次）。
              通过率：统计周期内，处理人初审业务时结果为通过的次数之和/处理次数*100%。
              二次驳回率：统计周期内，该处理人该业务，在律师审核时被驳回的次数之和/处理人初审业务时结果为通过的次数之和*100%。
              处理时效：统计周期内，该处理人该业务，所有（初审时间减去提交资料时间）的平均值
            </div>
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
          <el-tooltip v-show="handlerRole==2" class="item" effect="dark" placement="top-start">
            <div slot="content" style="max-width:400px">
              统计周期：指律师审核的日期区间。
              律师审核效率：统计周期内，处理人/律师操作指定服务的效率。
              下载资料件数：统计周期内，处理人下载指定服务的所有件数（一个服务下载多次算一次）。
              下载时效：统计周期内，所有（最新的下载时间减去初审通过时间）的平均值。
              上传受理号件数：统计周期内，处理人上传受理号的所有件数（一个服务上传多次算一次）。此，不考虑下载和上传受理的处理人不一致的情况，仅记录下载的处理人。
              受理时效：统计周期内，所有（录入受理信息的时间减去最新的下载时间）的平均值
            </div>
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
          <el-tooltip v-show="handlerRole==3" class="item" effect="dark" placement="top-start">
            <div slot="content" style="max-width:400px">
              统计周期：指律师审核的日期区间。
              律师审核效率：统计周期内，处理人/律师操作指定服务的效率。
              下载资料件数：统计周期内，处理人下载指定服务的所有件数（一个服务下载多次算一次）。
              下载时效：统计周期内，所有（最新的下载时间减去初审通过时间）的平均值。
              上传受理号件数：统计周期内，处理人上传受理号的所有件数（一个服务上传多次算一次）。此，不考虑下载和上传受理的处理人不一致的情况，仅记录下载的处理人。
              受理时效：统计周期内，所有（录入受理信息的时间减去最新的下载时间）的平均值。
            </div>
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
        </span>
        <div class="right-btn">
          <span @click="exportFunc">
            导出Excel
          </span>
        </div>
      </div>
      <div class="listMsg" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <div v-if="handlerRole==1">
          <ul class="statics-box">
            <li>总处理次数：
              <span>{{staticsInfo.totalDealNum||0}}</span> 次；
            </li>
            <li>平均通过率：
              <span>{{staticsInfo.avgPassRate||0}}</span> %；
            </li>
            <li>平均二次驳回率：
              <span>{{staticsInfo.avgSecondRejectRate||0}}</span> %；
            </li>
            <li>平均处理时效：
              <span>{{changeHourMinutestr(staticsInfo.avgPrescription)}}</span>
            </li>
          </ul>
          <Table :data="tableData" :columns="columns1" style="margin:10px 0;"></Table>
        </div>
        <div v-if="handlerRole==2">
          <ul class="statics-box">
            <li>总下载资料件数：
              <span>{{staticsInfo.totalDownNum||0}}</span> 件；
            </li>
            <li>平均下载时效：
              <span>{{changeHourMinutestr(staticsInfo.avgDownTimeliness||0)}}</span> ；
            </li>
            <li>总上传受理号件数：
              <span>{{staticsInfo.upLoadAcceptNumCount||0}}</span> 件；
            </li>
            <li>平均受理时效：
              <span>{{changeHourMinutestr(staticsInfo.avgDealTimeliness)}}</span>
            </li>
          </ul>
          <Table :data="tableData" :columns="columns2" style="margin:10px 0;"></Table>
        </div>
        <div v-if="handlerRole==3">
          <ul class="statics-box">
            <li>一次OA数量：
              <span>{{staticsInfo.onceTotal||0}}</span> ；
            </li>
            <li>二次OA数量：
              <span>{{staticsInfo.secondTotal||0}}</span> ；
            </li>
          </ul>
          <Table :data="tableData" :columns="columns3" :loading="tableLoading" style="margin:10px 0;">
            <template slot="serviceInfo" slot-scope="{ row }">
              <p style="color:#3AA1FF;cursor:pointer" @click="toServiceDetail(row.servcieId)">{{row.servcieNo}}</p>
            </template>
          </Table>
        </div>
      </div>

    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handlePageSize" @current-change="changePageHandler" :current-page.sync="pageInfo.page" :page-sizes="[10, 20, 30, 50]" :page-size="pageInfo.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getInitialAuditEfficiencyListApi, getInitialAuditEfficiencyCountStatisticsApi, getOaStatisticsListApi, getOaCountStatisticsApi, lawyerAuditListApi, lawyerAuditStaticsApi, getDepartmentAll, getEmployees } from '@/api/newApi/trademarkaAainData/deliveryData'
import { getToken } from '@/libs/util'
export default {
  data() {
    return {
      moreSerch: false, //更多查询条件
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
      countryCode: '0',
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
          functionCode: '61'
        },
        {
          paroductName: '美国商标(顾问)',
          id: '2',
          isChecked: false,
          countryCode: 'US',
          functionCode: '63'
        },
        {
          paroductName: '欧盟商标',
          id: '3',
          isChecked: false,
          countryCode: 'EU',
          functionCode: '61'
        },
        {
          paroductName: '英国商标',
          id: '4',
          isChecked: false,
          countryCode: 'GB',
          functionCode: '61'
        },
        {
          paroductName: '日本商标',
          id: '5',
          isChecked: false,
          countryCode: 'JP',
          functionCode: '61'
        },
        {
          paroductName: '加拿大商标',
          id: '5',
          isChecked: false,
          countryCode: 'CA',
          functionCode: '61'
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
        type: 0,
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
    this.getDepartmenAPi() //获取所有部门
    this.getTableFunc(1)
    // this.setDmoHeader();
  },
  methods: {
    /**
     * 设置节点样式
     */
    // setDmoHeader() {
    //   console.log(document.getElementsByClassName('ivu-table-tip'));
    // },
    // changeProduct(id) {
    //   console.log(" ", id);
    //   this.productList.map(item => {
    //     item.isChecked = false
    //     if (item.id == id) {
    //       item.isChecked = true
    //       this.searchForm.countryCode = item.countryCode
    //       this.searchForm.functionCode = item.functionCode
    //     }
    //   })
    //   this.getTableFunc(1)
    // },
    changeDealDate(val) {
      this.searchForm.startDate = val[0]
      this.searchForm.endDate = val[1]
      this.getTableFunc(1)
    },
    /**
     * 统计国家
     */
    changeCountry(val) {
      let item = this.productList.find(item => item.id == val);
      console.log(item);
      if (item) {
        item.isChecked = true
        this.searchForm.countryCode = item.countryCode
        this.searchForm.functionCode = item.functionCode
        this.getTableFunc(1)
      }
    },
    /**
     * 获取所有部门
     */
    getDepartmenAPi() {
      getDepartmentAll({}).then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.departmentList = res.data
          }
        }
      })
    },
    changeHandler(val) {
      console.log('val121', val);
      this.getTableFunc(1)
    },
    /**
     * 选择部门
     */
    changeType(val) {
      if (val == '0') {
        this.searchForm.userId = '',
          this.searchForm.depId = ''
        this.getTableFunc(1)
      } else if (val == '1') {
        console.log('部门');
        this.searchForm.userId = ''
        if (this.searchForm.depId) {
          this.changeDepartment()
        }
      } else {

        console.log('员工');
      }
    },
    /**
     * 根据部门获取所有员工
     */
    async getEmployeesApi(departmentId) {
      let { code, message, data } = await getEmployees({ departmentId });
      if (code == 0) {
        this.staffList = data;
      } else {
        this.$message.error(message)
      }
    },

    /**
     * 子下拉-选择部门
     */
    changeDepartment(val) {
      console.log("选择部门");
      val && this.getEmployeesApi(val);
      if (this.searchForm.type == 1) {
        this.searchForm.userId = ''
        this.getTableFunc(1)
      }

    },
    /**
    * 子下拉-选择员工
    */
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
        xmlResquest.open('post', this.baseUrl + '/workorder/workOrderInitialAuditEfficiency/export', true)
      } else if (this.handlerRole == 2) {
        xmlResquest.open('post', this.baseUrl + '/workorder/workOrderMaterialDownloadOperateRecord/export', true)
      } else if (this.handlerRole == 3) {
        xmlResquest.open('post', this.baseUrl + '/workorder/workOrderOaStatistics/export', true)
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
.app-container {
  // background: #fff;
  .search-box {
    form {
      // display: flex;
      // justify-content: space-between;
    }
  }
  .table-container {
    .excelAndDate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 20px;
      .left-num {
        font-weight: 700;
        color: #333;
        display: flex;
        align-items: center;
      }
      .right-btn {
        float: right;
        cursor: pointer;
        color: #3aa1ff;
      }
    }
    .listMsg {
      padding: 0px 20px;
      .statics-box {
        display: flex;
        margin-top: 8px;
        padding: 8px 10px;
        border: 1px solid rgba(186, 231, 255, 1);
        background-color: #e6f7ff;
        border-radius: 5px;
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
      // border: 1px solid #ddd;
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

