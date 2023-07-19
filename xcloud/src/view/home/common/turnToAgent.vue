<template>
  <div :style="contentStyleObj" class="content home-list">
    <div v-if="!showDetail">
      <p class="home-list-title">转代理列表</p>
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
            <DatePicker type="date" placeholder="请选择开始日期" v-model="searchForm.startTime" format="yyyy-MM-dd" style="width:108px;"></DatePicker>
            至
            <DatePicker type="date" placeholder="请选择结束日期" v-model="searchForm.endTime" format="yyyy-MM-dd" style="width:108px;"></DatePicker>
          </FormItem>
          <FormItem>
            <Input v-model="searchForm.searchContent" clearable placeholder="手机号/服务号/服务公司名称" style="width:200px;" />
          </FormItem>
          <FormItem>
            <Select clearable v-model="searchForm.isRemarkRecord" placeholder="有无备注进度记录" style="width:158px;">
              <Option value="1">有记录</Option>
              <Option value="2">无记录</Option>
            </Select>
          </FormItem>
          <Button type="primary" @click="getList(1)" style="margin:0 10px 0 6px;">
            <img src="@/assets/images/home/search.png" />搜索
          </Button>
          <Button class="gary" @click="reset">
            <img src="@/assets/images/home/reset.png" />重置
          </Button>
        </Form>
        <Button type="primary" @click="batchRemined" v-if="searchForm.progressBar==28||searchForm.progressBar==32||searchForm.progressBar==36||searchForm.progressBar==38">短信提醒</Button>
      </div>
      <Table :data="data" :columns="columns" @on-selection-change="selectChange" border>
        <template slot="processRecord" slot-scope="{row}">
          <div class="blue processRecord" @click="checkProcess(row.remarkRecords)">
            <img src="@/assets/images/home/search-blue.png" alt="">查看
          </div>
        </template>
        <template slot="operation" slot-scope="{row}">
          <div class="blue operation">
            <span @click="toDetail(row.id,row.countryCode, row.userId)"><img src="@/assets/images/home/search-blue.png" alt="">查看</span>
            <span @click="remarkInfo.serviceId=row.id;processLogModal=true;remarkInfo.content = ''"><img src="@/assets/images/home/xiangqing.png" alt="">记录进展</span>
          </div>
        </template>
      </Table>
      <div class="page-info">
        <Page @on-change="changePageHandler" @on-page-size-change="handlePageSize" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator show-sizer />
      </div>
    </div>
    <turnToAgentDetail v-if="showDetail" :id="detailId" :userId="userId" :countryCode="countryCode" :isService="true" @back="showDetail=false" @refresh="refreshList"></turnToAgentDetail>
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
  </div>
</template>
<script>
import '@/assets/style/common.css'
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/taxService/workOrder.js';
import * as API1 from '@/api/taxService/taxModule.js';
import * as API3 from '@/api/home/service.js';
import turnToAgentDetail from '@/view/module/taxService/serviceManage/declareServiceDetail'
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  components: {
    turnToAgentDetail
  },
  data() {
    return {
      contentStyleObj: {
        height: ""
      },
      SupplierByConditionList: [],
      searchForm: {
        countryCode: this.$route.params.countryCode,
        progressBar: this.$route.params.status,
        startTime: this.$route.params.startTime,
        endTime: this.$route.params.endTime,
        supplierId: this.$route.params.supplierId,
        searchContent: '',
        isRemarkRecord: ''
      },
      countryList: [],
      tableLoading: false,
      data: [
        {}
      ],
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
          align: 'center',
          key: 'companyName'
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
          align: 'center'
        },
        {
          title: '跟进人',
          key: 'followUserName'
        },
        {
          title: '服务进度',
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
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
          width: 166,
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
          align: 'center',
          key: 'companyName'
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
          align: 'center'
        },
        {
          title: '跟进人',
          key: 'followUserName'
        },
        {
          title: '服务进度',
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
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
          width: 166,
          slot: 'operation'
        },
      ],
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
        35: "待上传零申报凭证",
        38: "待授权转代理",
      },
      listTotal: 0,
      pageInfo: {
        page: 1,
        limit: 10
      },
      selectList: [],
      statusList: [
        {
          key: 28,
          value: '待上传资料'
        },
        {
          key: 29,
          value: '转代理中'
        },
        {
          key: 31,
          value: '转代理资料待审核'
        },
        {
          key: 38,
          value: '待授权转代理'
        },
        {
          key: 36,
          value: '待授权海牙认证'
        },
        {
          key: 37,
          value: '海牙认证中'
        },
        {
          key: 30,
          value: '转代理完成'
        },
        {
          key: 32,
          value: '转代理资料驳回'
        },
      ],
      processLogModal: false,
      rowInfo: {},
      checkProcessModal: false,
      showDetail: false,
      detailId: '',
      userId: '',
      progressBar: '',
      serviceId: '',
      userId: '',
      countryCode: '',
      detailId: '',
      remarkList: [],
      remarkInfo: {
        content: '',
        serviceId: '',
        label: ''
      },
      remarkRecords: []
    }
  },
  computed: {
    columns(){
      if(this.hasAuthority('turnToAgent_lookSupplier')){
        return this.columns_showSupplierName;
      }else{
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
      params.startTime = this.formatDate(this.searchForm.startTime, 'date')
      params.endTime = this.formatDate(this.searchForm.endTime, 'date')
      if (this.searchForm.countryCode == undefined || this.searchForm.countryCode == -1) {
        params.countryCode = ''
      }
      API3.transformProxyListAPI(params).then((res) => {
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
      API.supplierByCondition({
        countryCode: params.countryCode,
        supplierType:1,
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
    selectChange(val) {
      this.selectList = val
    },
    //批量提醒发送短信
    batchRemined() {
      // console.log(this.selectList)
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
      API1.batchMessageTrs(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('批量发送短信成功')
          this.selectList = []
        }
      })
    },
    //查看详情
    toDetail(id, countryCode, userId) {
      this.serviceId = id
      this.showDetail = true;
      this.detailId = id;
      this.countryCode = countryCode
      this.userId = userId
    },
    //重置
    reset() {
      this.searchForm = {
        countryCode: '',
        progressBar: '',
        startTime: '',
        endTime: '',
        supplierId: '',
        searchContent: ''
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
    //查看备注
    checkProcess(remarkRecords) {
      if (remarkRecords !== '') {
        this.checkProcessModal = true
        this.remarkRecords = JSON.parse(remarkRecords)
      } else {
        this.$Message.info('暂无记录')
      }
    },
    refreshList() {
      this.showDetail = false;
      this.getList()
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
.process-box {
  border-bottom: 1px solid rgba(218, 218, 218);
  padding-bottom: 10px;
  margin-bottom: 20px;
  .process-content {
    font-size: 18px;
  }
  .lebel {
    margin: 8px 0;
    span {
      display: inline-block;
      margin-right: 8px;
      padding: 4px 8px;
      color: #02a7f0;
      background-color: rgba(227, 245, 253);
    }
  }
  .process-time {
    color: #aaa;
  }
}
</style>


