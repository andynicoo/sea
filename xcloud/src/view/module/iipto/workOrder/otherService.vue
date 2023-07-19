<template>
  <div>
    <Card v-if="!isShowDetail" class="top-card">
      <p class="title" slot="title">数据筛选</p>
      <Form ref="searchForm" :model="searchForm" class="top-serach-box" inline>
        <FormItem style="margin-bottom: 10px">
          <Input v-model="searchForm.searchContent" clearable placeholder="手机号/服务号/订单号" style="width: 150px" />
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <Input v-model="searchForm.productName" clearable placeholder="服务名称" style="width: 150px" />
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <Select clearable v-model="searchForm.countryCode" placeholder="国家">
            <Option v-for="(item, index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
            <!-- <Option v-for="(item, index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option> -->
          </Select>
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <Select clearable v-model="searchForm.servicesStatus" placeholder="服务状态">
            <Option v-for="(item, index) in serviceBarList" :value="item.key" :key="index">{{ item.val }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <Input v-model="searchForm.followContent" clearable placeholder="订单跟进人" style="width: 150px" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.orderBusinessSource" placeholder="订单来源">
            <Option value="0">未知</Option>
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <Select clearable v-model="searchForm.orderSource" placeholder="渠道来源">
            <Option value="0">PC网页端</Option>
            <Option value="2">H5</Option>
            <Option value="3">录入订单</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <DatePicker type="daterange" placeholder="选择创建时间" v-model="searchForm.declareEndTime" @on-change="changeDate" style="width: 180px"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom: 10px">
          <DatePicker type="daterange" placeholder="选择更新时间" v-model="searchForm.updateTime" @on-change="changeUpdateDate" style="width: 180px"></DatePicker>
        </FormItem>
        <FormItem class="search-btn">
          <Button type="primary" @click="getList(1)" style="margin: 0 12px">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top: 15px; padding-bottom: 70px" v-if="!isShowDetail">
      <div class="tableArea">
        <Tabs :value="searchForm.businessHandleProgress" :animated="false" @on-click="tabsChange">
          <TabPane label="全部" name=""></TabPane>
          <TabPane label="待处理" name="1"></TabPane>
          <TabPane label="处理中" name="2"></TabPane>
          <TabPane label="已完成" name="3"></TabPane>
          <Button style="float: right; margin-left: 20px" @click="exportList">批量导出</Button>
          <Button style="float: right" @click="batchChangeHandlerFunc">批量更新处理进度</Button>
          <!-- <Button style="float: right; margin-left: 20px" v-show="hasAuthority('task_list_20')" @click="exportOrderFunc">批量导出</Button>
          <Button style="float: right" v-show="hasAuthority('task_list_20')" @click="batchChangeHandlerFunc">批量更新处理进度</Button> -->
        </Tabs>
        <Table border :loading="tableLoading" :columns="columns" :data="tableData" style="margin-top: 14px" @on-selection-change="selectChange">
          <template slot="operate" slot-scope="{ row }">
            <span class="va-btn" @click="toDetail(row)">更新处理进度</span>
            <!-- <span class="va-btn" v-show="hasAuthority('task_list01')" @click="toDetail(row)">更新处理进度</span> -->
            <!-- <p class="va-btn" v-if="row.status == 2" @click="toDetail(row)">更新处理进度</p> -->
          </template>
        </Table>
      </div>
    </Card>
    <Card class="page-box" v-if="!isShowDetail">
      <Page @on-change="changePageHandler" @on-page-size-change="handlePageSize" :current="pageInfo.page" :total="pageInfo.total" :page-size="pageInfo.limit" show-total show-elevator show-sizer />
    </Card>
    <!-- 更新处理进度弹框 -->
    <Modal v-model="handlerTypeModal" :title="modalTitle">
      <Form :model="formCodeItem" ref="formCodeItem">
        <FormItem prop="assessmentType">
          <Select
            v-if="handlerTypeModal"
            clearable
            v-model="formCodeItem.serviceIds"
            @on-change="changeAssessmentType"
            label-in-value
            :placeholder="handlerObj[separateData.handleProcess] || '请选择处理进度'"
          >
            <Option v-for="(item, index) in handlerList" :value="item.value" :key="index">{{ item.roleType }}</Option>
            <!-- <Option value="1">待处理</Option>
            <Option value="1">处理中</Option>
            <Option value="1">已完成</Option> -->
          </Select>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right: 20px" @click="handlerTypeModal = false">取消</Button>
        <Button type="primary" @click="sureFilingCode('formCodeItem')">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { getToken } from '@/libs/util'
import { getServiceCountry } from '@/api/iipto/common.js'
import { getList, UpdateServiceStatus } from '@/api/otherService/otherServiceApi.js'
export default {
  data() {
    return {
      countryList: [],
      searchForm: {
        // tab栏数据 空为全部
        businessHandleProgress: ''
      },
      tableLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '订单编号',
          key: 'orderNo',
          align: 'center'
        },
        {
          title: '服务编号',
          key: 'serverNo',
          align: 'center'
        },
        {
          title: '服务名称',
          // slot: 'trademarkInfo',
          key: 'productName',
          align: 'center'
          // width: 180
        },
        {
          title: '服务项目',
          key: 'serviceItem',
          align: 'center'
        },
        {
          title: '处理进度',
          key: 'handleProcess',
          align: 'center',

          // render(h, params) {
          //   let applyType = params.row.applyType
          //   let applyName = ''
          //   if (applyType == 1) {
          //     applyName = params.row.applycompanyEn
          //   } else if (applyType == 0) {
          //     if (params.row.applyLastNameEn != '') {
          //       applyName = params.row.applyLastNameEn + ',' + params.row.applyNameEn
          //     }
          //   }

          //   return h('span', applyName)
          // }
          render(h, params) {
            const val = params.row.handleProcess
            const handleProcess = val == 1 ? '待处理' : val == 2 ? '处理中' : val == 3 ? '已完成' : ''
            return h('span', handleProcess)
          }
        },
        {
          title: '服务状态',
          key: 'status',
          align: 'center',
          // render: (h, { row }) => {
          //   let status = row.handleProcess
          //   return h('span', this.$iiptoProgressBar(status))
          // },
          render: (h, { row }) => {
            const val = row.status
            const status = val == 1 ? '正常' : val == 2 ? '已退款' : val == 3 ? '退款中' : ''
            return h('span', status)
          }
        },
        {
          title: '订单跟进人',
          key: 'followUserName',
          align: 'center'
        },
        {
          title: '订单备注',
          // slot: 'acceptInfo',
          // key: 'progressRemark',
          key: 'orderRemark',
          align: 'center'
        },
        {
          title: '创建时间',
          sortable: true, // 可供选择
          key: 'createTime',
          align: 'center'
        },
        {
          title: '更新时间',
          sortable: true,
          // slot: 'handleInfo',
          align: 'center',
          key: 'updateTime'
          // key: 'dataSubmitTime'
        },
        {
          title: '操作',
          slot: 'operate',
          align: 'center'
        }
      ],
      tableData: [],
      pageInfo: {
        total: 0,
        limit: 10,
        page: 1
      },
      isShowDetail: false,
      orderStatus: '',
      selectList: [], // 多选选中的项
      countryCode: '',
      handleProcessList: [],
      serviceBarList: [
        {
          key: '1',
          val: '正常'
        },
        {
          key: '2',
          val: '已退款'
        },
        {
          key: '3',
          val: '退款中'
        }
      ],
      handlerTypeModal: false,
      formCodeItem: {},
      handlerList: [
        {
          roleType: '待处理',
          value: '1'
        },
        {
          roleType: '处理中',
          value: '2'
        },
        {
          roleType: '已完成',
          value: '3'
        }
      ],
      handlerObj: {
        1: '待处理',
        2: '处理中',
        3: '已完成'
      },
      handlerModal: false,
      staffInfo: {
        realName: ''
      },
      departmentList: [],
      staffList: [],
      lawyerList: [],
      categoryCount: '',
      productFunctionCode: 0,
      modalTitle: '', // 更新处理进度弹框标题
      seizeOption: false, // 单项选择标记
      separateData: '' // 单项数据
    }
  },
  created() {
    if (this.$route.params.id != undefined) {
      this.isShowDetail = true
    } else {
      this.getCountryList()
      this.getList()
    }
  },
  methods: {
    // 获取数据 查询按钮，page=1
    getList(page) {
      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      delete data.declareEndTime // 删除两个input传入的多余字段
      delete data.updateTime

      // 如果status为空则请求全部，删除status
      if (data.businessHandleProgress == '') {
        delete data.businessHandleProgress
      }
      data.page = this.pageInfo.page // 传入页码
      data.limit = this.pageInfo.limit // 传入每页行数
      this.selectList = [] // 清空多选查询列表
      // console.log('请求的参数')
      // console.log(data)
      getList(data).then((res) => {
        // console.log('收到的数据')
        // console.log(res)
        if (res.code == 0) {
          this.tableData = res.data.records
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: Number(res.data.size)
          }
        }
      })
    },
    // 重置搜索条件
    resetList() {
      this.searchForm = {}
    },
    selectChange(val) {
      // 多选项选择后赋值
      this.selectList = val
    },
    tabsChange(name) {
      this.searchForm.businessHandleProgress = name
      // 调用该tab栏的第一页数据
      this.getList(1)
    },
    // 单项更新处理进度
    toDetail(row) {
      // new
      // console.log(row)
      this.separateData = row // 单项数据赋值
      this.seizeOption = true // 单项选择标记
      this.modalTitle = '更新处理进度' // 设定弹框title
      this.formCodeItem.serviceIds = '' //设定选择框为空
      this.handlerTypeModal = true // 弹框显示
      this.formCodeItem.serviceStatus = '' // 清空处理进度状态
      this.formCodeItem.label = '' // 清空处理进度状态
      // this.formCodeItem.handleProcess = row.countryNameEn // 自定义参数测试
    },

    //批量更新处理进度
    batchChangeHandlerFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务')
        return
      }
      this.seizeOption = false
      this.formCodeItem.serviceIds = '' //设定选择框为空
      this.separateData = '' //多项数据为空 显示请选择处理进度
      this.formCodeItem.handleProcess = '' // 清空选项
      this.formCodeItem.serviceStatus = '' // 清空处理进度状态
      this.formCodeItem.label = ''
      this.modalTitle = '批量更新处理进度' // 设定弹框title
      this.handlerTypeModal = true // 弹框显示
    },
    // 改变弹框选项
    changeAssessmentType(val) {
      // 选择处理人类型
      // console.log(val)
      if (val !== undefined) {
        // 处理进度状态
        this.formCodeItem.serviceStatus = val.value
        this.formCodeItem.label = val.label
      }
      this.staffInfo.realName = ''
    },
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getList()
    },
    handlePageSize(pageSize) {
      this.pageInfo.limit = pageSize
      this.getList(1)
    },
    copyLink() {
      let _this = this
      let clipboard = new this.clipboard('.cobyOrderSn')
      clipboard.on('success', function () {
        _this.$Message.success('复制成功')
      })
      clipboard.on('error', function () {
        _this.$Message.info('复制失败')
      })
      setTimeout(() => {
        clipboard.destroy()
      }, 1000)
    },
    changeDate(date) {
      this.searchForm.createEndTime = date[1]
      this.searchForm.createStartTime = date[0]
    },
    changeUpdateDate(date) {
      this.searchForm.updateEndTime = date[1]
      this.searchForm.updateStartTime = date[0]
    },
    changeAcceptDate(date) {
      this.searchForm.acceptEndTime = date[1]
      this.searchForm.acceptStartTime = date[0]
    },
    changeLaywyer(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label
        this.staffInfo.userId = val.value
      }
    },
    // 确认提交弹框
    sureFilingCode() {
      if (!this.formCodeItem.serviceStatus) {
        this.$Message.info('请先选择处理进度')
        return
      }
      let serviceIds = ''
      if (this.seizeOption) {
        // 单项选择
        serviceIds = this.separateData.id
      } else {
        this.selectList.map((item) => {
          serviceIds += item.id + ','
        })
      }
      // console.log(this.selectList)
      // console.log(serviceIds)
      let data = {}
      data.serviceIds = serviceIds
      data.serviceStatus = this.formCodeItem.serviceStatus
      // console.log(data)
      this.$Modal.confirm({
        title: '更新处理进度',
        content: `所选工单的处理进度将改为${this.formCodeItem.label}。你确定要修改吗？`,
        okText: '确认修改',
        cancelText: '取消',
        onOk: () => {
          UpdateServiceStatus(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success(`成功更新了${this.seizeOption ? 1 : this.selectList.length}条数据`)
              this.formCodeItem = {} // 选中状态清除
              this.handlerTypeModal = false
              this.getList()
            }
          })
        }
      })
    },
    // 确认到账按钮
    determineMoneyFn() {
      // console.log('确定到账按钮')
      // console.log('选择的项', this.auditTypeDetermine)
    },
    // 批量导出
    /*   exportOrderFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务')
        return
      }
      let ids = ''
      this.selectList.map((item) => {
        ids += item.trademarkWorkOrderId + ','
      })
      let formData = new FormData()
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      // xmlResquest.open('get', this.baseUrl + '/trademark/management/services/importWorkOrderEvidenceList?workOrderEvidenceIds=' + ids, true)
      xmlResquest.open('get', this.baseUrl + '/trademark/management/otherservice/downloadOtherServiceList?workOrderEvidenceIds=' + ids, true)
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
    }, */
    exportList() {
      let formData = new FormData()
      let data = this.searchForm
      delete data.declareEndTime
      delete data.updateTime
      let query = ''
      // console.log(data)
      for (let item in data) {
        // console.log(item)
        // console.log(data[item])
        if (data[item]) {
          query += query ? '&' : '?'
          query += item + '=' + data[item]
        }
      }
      // console.log(query)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', this.baseUrl + '/trademark/management/otherservice/downloadOtherServiceList' + query, true)
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
    // 获取国家列表
    getCountryList() {
      getServiceCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.page-box {
  position: fixed;
  bottom: 0;
  right: 28px;
  left: 220px;
  z-index: 999;
}
.handler-class {
  cursor: pointer;
  color: '#0079FE';
}
.top-card {
  position: relative;
}
.va-btn {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
.va-btn:hover {
  text-decoration: underline;
}
</style>