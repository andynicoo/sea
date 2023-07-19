<template>
  <div :style="contentStyleObj" class="content home-list">
    <div v-if="!showDetail&&!goAnnalsDe&&!taxModalShow">
      <p class="home-list-title">申报列表</p>
      <div class="search-bar">
        <Form :model="searchForm" inline>
          <FormItem>
            <Select clearable v-model="searchForm.countryCode" @on-change="countryChange" placeholder="税号国家">
              <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select clearable v-model="searchForm.supplierId" placeholder="服务商" style="width:150px;">
              <Option v-for="(item,index) in facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select clearable v-model="searchForm.progressBar" placeholder="状态" style="width:158px;">
              <Option v-for="(item,index) in statusList" :value="item.key" :key="index">{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select v-model="searchForm.disposeId" clearable placeholder="税务经理">
              <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem>
            <Select clearable v-model="searchForm.supplierId" style="width:100px" placeholder="选择服务商">
              <Option v-for="(item,index) in SupplierByConditionList" :value="item.id" :key="index">{{item.shortName}}</Option>
            </Select>
          </FormItem> -->
          <FormItem>
            <DatePicker type="month" placeholder="请选择开始日期" v-model="searchForm.declareStartTime" style="width:108px;"></DatePicker>
            ——
            <DatePicker type="month" placeholder="请选择结束日期" v-model="searchForm.declareEndTime" style="width:108px;"></DatePicker>
          </FormItem>
          <FormItem>
            <Input v-model="searchForm.searchContent" clearable placeholder="手机号/服务号/服务公司名称/公司英文名" style="width:200px;" />
          </FormItem>
          <FormItem>
            <Select clearable v-model="searchForm.isRemarkRecord" placeholder="有无备注进度记录" style="width:158px;">
              <Option value="1">有记录</Option>
              <Option value="2">无记录</Option>
            </Select>
          </FormItem>
          <Button type="primary" style="margin:0 10px 0 6px;" @click="getList(1)">
            <img src="@/assets/images/home/search.png" />搜索
          </Button>
          <Button class="gary" @click="reset">
            <img src="@/assets/images/home/reset.png" />重置
          </Button>
        </Form>
        <Button type="primary" @click="batchRemined" v-if="searchForm.progressBar==21||searchForm.progressBar==22" style="margin-right:10px;">短信提醒</Button>
        <Button type="primary" @click="batchReminedMobile" v-if="searchForm.progressBar==21||searchForm.progressBar==22" style="margin-right:10px;">电话提醒</Button>
        <Button type="primary" @click="uploadChoseModal=true">下载申报数据</Button>
      </div>
      <Table :data="data" :columns="columns" @on-selection-change="selectChange" border>
        <template slot="processRecord" slot-scope="{row}">
          <div class="blue processRecord" @click="checkProcess(row.remarkRecords)">
            <img src="@/assets/images/home/search-blue.png" alt="">查看
          </div>
        </template>
        <template slot="operation" slot-scope="{row}">
          <div class="blue operation">
            <span @click="toDetail(row.id,row.countryCode, row.userId,row.productFunctionCode)"><img src="@/assets/images/home/search-blue.png" alt="">查看</span>
            <span @click="remarkInfo.serviceId=row.id;processLogModal=true;remarkInfo.content = ''"><img src="@/assets/images/home/xiangqing.png" alt="">记录进展</span>
          </div>
        </template>
      </Table>
      <div class="page-info">
        <Page @on-change="changePageHandler" @on-page-size-change="handlePageSize" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator show-sizer />
      </div>
    </div>
    <Modal v-model="processLogModal" title="记录进度">
      <Input type="textarea" v-model="remarkInfo.content" />
      <CheckboxGroup v-model="remarkList" style="margin-top:10px;">
        <Checkbox label="提交资料" border>提交资料</Checkbox>
        <Checkbox label="税局通知" border></Checkbox>
        <Checkbox label="申报" border></Checkbox>
        <Checkbox label="联系方式" border></Checkbox>
        <Checkbox label="备注" border></Checkbox>
        <Checkbox label="其它" border></Checkbox>
      </CheckboxGroup>
      <div slot="footer">
        <Button type="primary" @click="submitRemark">完成</Button>
      </div>
    </Modal>
    <Modal v-model="uploadChoseModal" title="下载申报数据" @on-ok="uploadDeclear">
      <RadioGroup v-model="uploadType" vertical>
        <Radio label="1">
          <Icon type="social-apple"></Icon>
          <span>所有申报工单（默认）</span>
        </Radio>
        <Radio label="2">
          <Icon type="social-android"></Icon>
          <span>已申报工单</span>
        </Radio>
        <Radio label="3">
          <Icon type="social-windows"></Icon>
          <span>待申报工单</span>
        </Radio>
      </RadioGroup>
    </Modal>
    <Modal v-model="checkProcessModal" title="查看进度" footer-hide>
      <div class="process-box" v-for="(item,index) in remarkRecords" :key="index">
        <div class="process-content">{{item.content}}</div>
        <div class="lebel" v-if="item.label!=''">
          <span v-for="i in item.label.split(';')" :key="i">{{i}}</span>
        </div>
        <div class="process-time">
          记录时间：{{item.createTime}}
        </div>
      </div>
    </Modal>
    <declareDetail v-if="showDetail" :id="detailId" :isService="false" :userId="userId" :productFunctionCode="productFunctionCode" :countryCode="countryCode" @showTaxModal="showTaxModal" @showAnnalsModal="showAnnalsModal" @back="showDetail=false" @refresh="refreshList"></declareDetail>
    <annalsDE v-if="goAnnalsDe" :workId="annalsId" :serviceId="serviceId" @back="showDetail=true;goAnnalsDe=false" :baseData="baseData"></annalsDE>
    <taxModal v-if="taxModalShow" :serviceId="serviceId" :workId="computeId" @refresh="refreshList" @back="isDetailShow=true;taxModalShow=false"></taxModal>
  </div>
</template>
<script>
import '@/assets/style/common.css'
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API2 from '@/api/taxService/taxModule.js';
import * as API3 from '@/api/home/service.js';
import * as API4 from '@/api/taxService/workOrder.js';
import declareDetail from '@/view/module/taxService/serviceManage/declareServiceDetail'
import annalsDE from '@/view/module/taxService/components/annalsDE'
import taxModal from '@/view/module/taxService/serviceManage/taxModal'
import { getToken } from '@/libs/util'
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  components: {
    declareDetail,
    annalsDE,
    taxModal
  },
  data() {
    return {
      contentStyleObj: {
        height: ""
      },
      SupplierByConditionList: [],
      searchForm: {
        countryCode: this.$route.params.countryCode || '',
        progressBar: this.$route.params.status,
        declareStartTime: this.$route.params.declareTime,
        declareEndTime: this.$route.params.declareTime,
        supplierId: this.$route.params.supplierId,
        searchContent: '',
        isRemarkRecord: ''
      },
      showDetail: false,
      checkProcessModal: false,
      processLogModal: false,
      remarkList: [],
      remarkInfo: {
        content: '',
        serviceId: '',
        label: ''
      },
      remarkRecords: [],
      countryList: [],
      progressStatus: {
        0: '待上传资料',
        1: '待审核资料',
        2: '待续费',
        3: '注册中',
        4: '注册完成',
        5: '待授权海牙认证',
        6: '海牙认证中',
        7: '待授权注册税号',
        8: "资料驳回",
        28: "待上传资料(转代理)",
        29: "转代理中",
        19: "未开始",
        20: "未开始(已开始报税)",
        21: "待提交报税资料",
        18: "申报中",
        22: "待缴纳税金",
        23: "待审核申报",
        24: "申报驳回",
        25: "申报完成（客户端完成）",
        26: "申报失败",
        27: "申报完成(整体完成)",
        31: "转代理资料待审核",
        32: "转代理资料驳回",
        33: "税金待审核",
        34: "缴税凭证被驳回",
        35: "待上传零申报凭证"
      },
      data: [],
      columns_showSupplierName: [
        {
          title: '全选',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'companyName',
          align: 'center'
        },
        {
          title: '国家',
          key: 'countryNameZh',
          align: 'center'
        },
        {
          title: '服务商',
          key: 'supplierName'
        },
        {
          title: '服务名称',
          align: 'center',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 1 ? '税务注册' : code == 2 ? '税务申报' : code == 3 ? '税务补缴' : code == 4 ? '转代理' : code == 5 ? '注册+申报' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          align: 'center',
          width: 114
        },
        {
          title: '工单状态',
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '申报周期',
          align: 'center',
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '';
            let endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            let biaoShi = params.row.isSuppleDecl && params.row.isSuppleDecl == 1 ? '补申报：' : ''
            return h('span', [
              h('span', {
                style: {
                  color: 'red'
                }
              }, biaoShi),
              h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : ''),
            ])
          }
        },
        {
          title: '税务经理',
          key: 'disposeName',
        },
        {
          title: '进度记录',
          align: 'center',
          width: 90,
          slot: 'processRecord'
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          slot: 'operation'
        },
      ],
      columns_noShowSupplierName: [
        {
          title: '全选',
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'companyName',
          align: 'center'
        },
        {
          title: '国家',
          key: 'countryNameZh',
          align: 'center'
        },
        {
          title: '服务名称',
          align: 'center',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 1 ? '税务注册' : code == 2 ? '税务申报' : code == 3 ? '税务补缴' : code == 4 ? '转代理' : code == 5 ? '注册+申报' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          align: 'center',
          width: 114
        },
        {
          title: '工单状态',
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '申报周期',
          align: 'center',
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '';
            let endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            let biaoShi = params.row.isSuppleDecl && params.row.isSuppleDecl == 1 ? '补申报：' : ''
            return h('span', [
              h('span', {
                style: {
                  color: 'red'
                }
              }, biaoShi),
              h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : ''),
            ])
          }
        },
        {
          title: '税务经理',
          key: 'disposeName',
        },
        {
          title: '进度记录',
          align: 'center',
          width: 90,
          slot: 'processRecord'
        },
        {
          title: '操作',
          align: 'center',
          width: 200,
          slot: 'operation'
        },
      ],
      listTotal: 0,
      productFunctionCode:'',
      pageInfo: {
        page: 1,
        limit: 10
      },
      statusList: [
        {
          key: 19,
          value: '未开始'
        },
        {
          key: 20,
          value: '未开始(已开始报税)'
        },
        {
          key: 21,
          value: '待申报'
        },
        {
          key: 18,
          value: '申报中'
        },
        {
          key: 22,
          value: '待缴纳税金'
        },
        {
          key: 33,
          value: '税金待审核'
        },
        {
          key: 34,
          value: '缴税凭证被驳回'
        },
        {
          key: 25,
          value: '申报完成'
        },
        {
          key: 26,
          value: '申报驳回'
        },
        {
          key: 27,
          value: '申报整体完成'
        },
      ],
      serviceId: '',
      userId: '',
      countryCode: '',
      detailId: '',
      goAnnalsDe: false,
      annalsId: '',
      baseData: {},
      taxModalShow: false,
      computeId: '',
      selectList: [],
      uploadChoseModal: false,
      uploadType: '1'
    }
  },
  computed: {
    columns() {
      if (this.hasAuthority('declare_lookSupplier')) {
        return this.columns_showSupplierName;
      } else {
        return this.columns_noShowSupplierName;
      }
    },
  },
  methods: {
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
          this.countryChange(this.searchForm.countryCode);
        }
      })
    },
    //获取列表
    getList(page) {
      if (page) this.pageInfo.page = page
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      params.declareStartTime = this.formatDate(this.searchForm.declareStartTime, 'month')
      params.declareEndTime = this.formatDate(this.searchForm.declareEndTime, 'month')
      if (this.searchForm.countryCode == undefined || this.searchForm.countryCode == -1) {
        params.countryCode = ''
      }
      API3.taxWorkOrderListAPI(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.data = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    getSupplierByCondition() {
      let params = { ...this.searchForm }
      if (this.searchForm.countryCode == undefined) {
        params.countryCode = ''
      }
      API4.supplierByCondition({
        countryCode: params.countryCode,
        supplierType: 1,
      }).then(res => {
        this.SupplierByConditionList = res.data
        this.SupplierByConditionList = JSON.parse(JSON.stringify(this.SupplierByConditionList))
      })
    },
    changeCountry() {
      this.searchForm.supplierId = ''
      this.getSupplierByCondition()
    },
    //翻页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getList()
    },
    //调整页数
    handlePageSize(limit) {
      this.pageInfo.limit = limit
      this.getList(1)
    },
    reset() {
      this.searchForm = {
        countryCode: '',
        progressBar: '',
        supplierId: '',
        declareStartTime: '',
        searchContent: '',
        declareEndTime: ''
      }
    },
    selectChange(val) {
      this.selectList = val
    },
    //批量提醒电话
    batchReminedMobile() {
      let ids = ''
      this.selectList.map((item, index) => {
        ids += item.id + ','
      })
      let data = {
        ids,
        ...this.searchForm
      }
      data.declareStartTime = this.formatDate(this.searchForm.declareStartTime, 'month')
      data.declareEndTime = this.formatDate(this.searchForm.declareEndTime, 'month')
      if (this.searchForm.progressBar == undefined) {
        data.progressBar = ''
      }
      console.log('data', data)
      this.$Modal.confirm({
        title: '电话提醒',
        content: `
          <p style="font-weight:bold;">发起电话提醒后，系统将自动拨打电话给客户提醒申报</p>
          <p>温馨提示：确认提醒后，请与技术部同步拨打电话信息！确保拨打电话顺畅；</p>
        `,
        onOk: () => {
          API2.batchCallDeclear(data).then(res => {
            if (res.code === 0) {
              this.$Message.success('批量智能电话提醒执行成功')
              this.selectList = []
            }
          })
        },
      });

    },
    //批量提醒发送短信
    batchRemined() {
      if (this.selectList.length < 0) {
        this.$Message.info('请先选择服务')
        return
      }
      let ids = ''
      this.selectList.map((item, index) => {
        ids += item.id + ','
      })
      let data = {
        ids,
        progressBar: this.searchForm.progressBar
      }
      if (this.searchForm.progressBar == undefined) {
        data.progressBar = ''
      }
      API2.batchMessageDeclear(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('批量发送短信成功')
          this.selectList = []
        }
      })
    },
    //查看详情
    toDetail(id, countryCode, userId,productFunctionCode) {
      this.serviceId = id
      this.showDetail = true;
      this.detailId = id;
      this.countryCode = countryCode
      this.productFunctionCode = productFunctionCode
      this.userId = userId
    },
    //查看德国年报详情
    showAnnalsModal(id, baseData) {
      // console.log(id)
      this.showDetail = false;
      this.goAnnalsDe = true
      this.annalsId = id
      this.baseData = baseData
    },
    showTaxModal(id, serviceId) {
      this.computeId = id;
      this.serviceId = serviceId;
      this.showDetail = false;
      this.taxModalShow = true;
    },
    //返回并刷新列表
    refreshList() {
      this.showDetail = false;
      this.getList()
    },
    //下载申报数据
    uploadDeclear() {
      // console.log(this.uploadType)
      let ids = ''
      this.selectList.map((item, index) => {
        ids += item.id + ','
      })
      let formData = new FormData()

      if (this.searchForm.countryCode != undefined) {
        formData.append('countryCode', this.searchForm.countryCode)
      }
      if (this.searchForm.progressBar != undefined) {
        formData.append('progressBar', this.searchForm.progressBar)
      }
      formData.append('exportTaxWorkOrderType', this.uploadType)
      formData.append('declareStartTime', this.formatDate(this.searchForm.declareStartTime, 'month'))
      formData.append('declareEndTime', this.formatDate(this.searchForm.declareEndTime, 'month'))
      formData.append('searchContent', this.searchForm.searchContent)
      formData.append('serviceIds', ids)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/worktable/management/taxWorkOrder/list/export', true)
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
    //查看备注
    checkProcess(remarkRecords) {
      if (remarkRecords !== '') {
        this.checkProcessModal = true
        this.remarkRecords = JSON.parse(remarkRecords)
      } else {
        this.$Message.info('暂无记录')
      }
    },
    //时间格式转换
    formatDate(date, type) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        if (type == 'date') {
          return y + '-' + m + '-' + d + ' 00:00:00'
        } else if (type == 'month') {
          return y + '-' + m
        }
      } else {
        return date
      }
    },
    //提交备注
    submitRemark() {
      this.remarkInfo.label = this.remarkList.join(';')
      API3.addRemarkAPI(this.remarkInfo).then(res => {
        if (res.code == 0) {
          this.$Message.success('提交备注成功')
          this.processLogModal = false
          this.getList()
          this.remarkInfo.content = ''
        }
      })
    },
  },
  mounted() {
    this.contentStyleObj.height = window.screen.height - 200 + "px";
    this.getCountryList()
    this.getList()
    this.getSupplierByCondition()
  },
}
</script>
<style lang="less" scoped>
.content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}
img {
  vertical-align: middle;
}
</style>


