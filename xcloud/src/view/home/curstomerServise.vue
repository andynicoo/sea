<template>
  <div class="content">
    <div class="top-content clearfix">
      <div class="fl welcome">
        <img src="@/assets/images/home/welcome.png" />
        <p>欢迎回来！</p>
      </div>
      <div class="line fl"></div>
      <div class="flex flex-around">
        <div class="flex-item">
          <a href="https://pro.itaxs.com/aboutComputed"
             target="_blank"><img src="@/assets/images/home/calculateTax.png" />一键算税</a>
        </div>
        <div class="flex-item"
             @click="openTab('TaxReconciliation')">
          <img src="@/assets/images/home/taxReconciliation.png" />税金对账
        </div>
        <div class="flex-item"
             @click="openTab('logoutTaxNumList')">
          <img src="@/assets/images/home/cancelTaxNumber.png" />注销税号
        </div>
        <div class="flex-item gray"
             @click="openTab('')">
          <img src="@/assets/images/home/taxCheck.png" />税务稽查
        </div>
      </div>
    </div>
    <div class="search-content">
      <p class="search-title">服务查询</p>
      <div class="search-box">
        <Input v-model="serviceSearch.searchContent"
               placeholder="请输入公司名称/手机号/服务号"></Input>
        <Button type="primary"
                @click="searchServiceFun">
          <img src="@/assets/images/home/search.png" />查询
        </Button>
        <Button class="gary"
                @click="resetService">
          <img src="@/assets/images/home/reset.png" />重置
        </Button>
      </div>
    </div>
    <div class="reg-turn flex">
      <div class="flex-item register-box">
        <div class="tool-bar">
          <span class="type">税号注册</span>
          <span class="default-box"
                @click="setDefault(3)">
            <img src="@/assets/images/home/setting.png"
                 alt="">设置默认
          </span>
          <Select v-model="registerSearch.countryCode"
                  style="width:100px"
                  @on-change="changeCountry($event,3)">
            <Option value="-1">所有国家</Option>
            <Option :value="item.countryCode"
                    v-for="(item,index) in countryList"
                    :key="index">{{item.countryNameZh}}</Option>
          </Select>
          <Select clearable
                v-model="registerSearch.suppliarId"
                @on-change="changeSuppliar($event,3)"
                style="width:100px"
                placeholder="选择服务商">
          <Option v-for="(item,index) in SupplierByConditionList3"
                  :value="item.id"
                  :key="index">{{item.supplierName}}</Option>
        </Select>
          <DatePicker type="date"
                      placeholder="请选择开始日期"
                      v-model="registerSearch.startTime"
                      format="yyyy-MM-dd"
                      style="width:100px;"></DatePicker>
          至
          <DatePicker type="date"
                      placeholder="请选择结束日期"
                      v-model="registerSearch.endTime"
                      format="yyyy-MM-dd"
                      style="width:100px;"
                      @on-change="handleChange3"></DatePicker>
        </div>
        <div class="item-list">
          <p class="items clearfix"
             @click="goRegister(0)">
            <span class="fl">待上传注册资料（
              <span class="defalut-color">{{registerStaticInfo.uploadCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(1)">
            <span class="fl">待审核（
              <span class="red">{{registerStaticInfo.auditCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(7)"
             v-if="registerSearch.countryCode=='FR'||registerSearch.countryCode=='IT'">
            <span class="fl">待授权注册税号（
              <span class="red">{{registerStaticInfo.authorizationCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(5)"
             v-if="registerSearch.countryCode=='ES'">
            <span class="fl">待海牙认证（
              <span class="defalut-color">{{registerStaticInfo.haiYaCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(6)"
             v-if="registerSearch.countryCode=='ES'">
            <span class="fl">海牙认证中（
              <span class="defalut-color">{{registerStaticInfo.haiYaIngCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(3)">
            <span class="fl">注册中（
              <span class="defalut-color">{{registerStaticInfo.registerIngCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(4)">
            <span class="fl">注册完成（
              <span class="defalut-color">{{registerStaticInfo.registerCompleteCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goRegister(8)">
            <span class="fl">资料驳回（
              <span class="red">{{registerStaticInfo.rejectCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
        </div>
      </div>
      <div class="flex-item">
        <div class="tool-bar">
          <span class="type">转代理管理</span>
          <span class="default-box"
                @click="setDefault(2)">
            <img src="@/assets/images/home/setting.png"
                 alt="">设置默认
          </span>
          <Select v-model="agentSearch.countryCode"
                  style="width:100px"
                  @on-change="changeCountry($event,2)">
            <Option value="-1">所有国家</Option>
            <Option :value="item.countryCode"
                    v-for="(item,index) in countryList"
                    :key="index">{{item.countryNameZh}}</Option>
          </Select>
          <Select clearable
                v-model="agentSearch.suppliarId"
                style="width:100px"
                @on-change="changeSuppliar($event,2)"
                placeholder="选择服务商">
          <Option v-for="(item,index) in SupplierByConditionList2"
                  :value="item.id"
                  :key="index">{{item.supplierName}}</Option>
        </Select>
          <DatePicker type="date"
                      placeholder="请选择开始日期"
                      v-model="agentSearch.startTime"
                      format="yyyy-MM-dd"
                      style="width:100px;"></DatePicker>
          至
          <DatePicker type="date"
                      placeholder="请选择结束日期"
                      v-model="agentSearch.endTime"
                      format="yyyy-MM-dd"
                      style="width:100px;"
                      @on-change="handleChange2"></DatePicker>
        </div>
        <div class="item-list">
          <p class="items clearfix"
             @click="goAgentPage(28)">
            <span class="fl">待上传转代理资料（
              <span class="defalut-color">{{agentStaticInfo.uploadCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(31)">
            <span class="fl">待审核（
              <span class="red">{{agentStaticInfo.auditCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(38)"
             v-if="agentSearch.countryCode=='FR'||agentSearch.countryCode=='IT'">
            <span class="fl">待授权转代理（
              <span class="red">{{agentStaticInfo.authorizationCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(36)"
             v-if="agentSearch.countryCode=='ES'">
            <span class="fl">待海牙认证（
              <span class="defalut-color">{{agentStaticInfo.haiYaCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(37)"
             v-if="agentSearch.countryCode=='ES'">
            <span class="fl">海牙认证中（
              <span class="defalut-color">{{agentStaticInfo.haiYaIngCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(29)">
            <span class="fl">转代理中（
              <span class="defalut-color">{{agentStaticInfo.transformProxyIngCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(30)">
            <span class="fl">转代理完成（
              <span class="defalut-color">{{agentStaticInfo.transformProxyCompleteCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
          <p class="items clearfix"
             @click="goAgentPage(32)">
            <span class="fl">资料驳回（
              <span class="red">{{agentStaticInfo.rejectCount}}</span>）</span>
            <img src="@/assets/images/home/Rectangle.png"
                 alt=""
                 class="fr">
          </p>
        </div>
      </div>
    </div>
    <div class="declear-box">
      <div class="tool-bar clearfix">
        <span class="type">申报管理</span>
        <div class="fr">
          <span class="default-box"
                @click="setDefault(1)">
            <img src="@/assets/images/home/setting.png"
                 alt="">设置默认
          </span>
          <Select v-model="declareSearch.countryCode"
                  style="width:100px"
                  @on-change="changeCountry($event,1)">
            <Option value="-1">所有国家</Option>
            <Option :value="item.countryCode"
                    v-for="(item,index) in countryList"
                    :key="index">{{item.countryNameZh}}</Option>
          </Select>
          <Select clearable
                v-model="declareSearch.suppliarId"
                style="width:100px"
                @on-change="changeSuppliar($event,1)"
                placeholder="选择服务商">
          <Option v-for="(item,index) in SupplierByConditionList1"
                  :value="item.id"
                  :key="index">{{item.supplierName}}</Option>
        </Select>
          <DatePicker type="month"
                      placeholder="请选择月份"
                      v-model="declareSearch.declareTime"
                      placement="top-end"
                      style="width:100px;"
                      @on-change="handleChange1"></DatePicker>
        </div>
      </div>

      <Row type="flex"
           class="declear-list">
        <Col span="6"
             v-if="declareSearch.countryCode=='GB'">
        <div class="declear-item"
             @click="toDeclare()">
          <img src="@/assets/images/home/declear1.png"
               alt="">
          <p>英国待授权报税（
            <span class="defalut-color">{{declareStaticInfo.mtdAuthorizationCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(20)">
          <img src="@/assets/images/home/declear2.png"
               alt="">
          <p>未开始（
            <span class="defalut-color">{{declareStaticInfo.notStartCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(21)">
          <img src="@/assets/images/home/declear5.png"
               alt="">
          <p>待申报（
            <span class="yellow">{{declareStaticInfo.uploadCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(18)">
          <img src="@/assets/images/home/declear4.png"
               alt="">
          <p>申报中（
            <span class="defalut-color">{{declareStaticInfo.taxIngCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(22)">
          <img src="@/assets/images/home/declear5.png"
               alt="">
          <p>待缴纳税金（
            <span class="yellow">{{declareStaticInfo.paymentCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6"
             v-if="declareSearch.countryCode=='IT'|| declareSearch.countryCode=='ES'|| declareSearch.countryCode=='FR'">
        <div class="declear-item"
             @click="toDeclare(33)">
          <img src="@/assets/images/home/declear6.png"
               alt="">
          <p>税金待审核（
            <span class="defalut-color">{{declareStaticInfo.auditCertificateCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(25)">
          <img src="@/assets/images/home/declear7.png"
               alt="">
          <p>申报完成（
            <span class="defalut-color">{{declareStaticInfo.taxStampCompleteCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(27)">
          <img src="@/assets/images/home/declear8.png"
               alt="">
          <p>申报整体完成（
            <span class="defalut-color">{{declareStaticInfo.taxCompleteCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6"
             v-if="declareSearch.countryCode=='IT'||declareSearch.countryCode=='ES'">
        <div class="declear-item">
          <img src="@/assets/images/home/declear9.png"
               alt="">
          <p>缴税凭证被驳回（
            <span class="defalut-color">{{declareStaticInfo.rejectCertificateCount}}</span>
            ）
          </p>
        </div>
        </Col>
        <Col span="6">
        <div class="declear-item"
             @click="toDeclare(26)">
          <img src="@/assets/images/home/declear8.png"
               alt="">
          <p>申报驳回（
            <span class="defalut-color">{{declareStaticInfo.taxStampFailedCount}}</span>
            ）
          </p>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import '@/assets/style/common.css'
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API1 from '@/api/taxService/workOrder.js';
import * as API from '@/api/home/service.js';
import { taxCountry } from '@/api/taxService/taxModule.js';
export default {
  data() {
    return {
      value: '',
      countryList: [],
      serviceSearch: {
        searchContent: '',
        page: 1,
        limit: 20
      },
      registerSearch: {
        countryCode: '-1',
        suppliarId:'',
        startTime: '',
        endTime: ''
      },
      SupplierByConditionList1:[],
      SupplierByConditionList2:[],
      SupplierByConditionList3:[],
      registerStaticInfo: {
        "uploadCount": 0,
        "rejectCount": 0,
        "auditCount": 0,
        "haiYaCount": 0,
        "haiYaIngCount": 0,
        "registerIngCount": 0,
        "registerCompleteCount": 0,
        "authorizationCount": 0
      },
      agentSearch: {
        countryCode: '-1',
        startTime: '',
        suppliarId:'',
        endTime: ''
      },
      agentStaticInfo: {
        "uploadCount": 0,
        "rejectCount": 0,
        "auditCount": 0,
        "haiYaCount": 0,
        "haiYaIngCount": 0,
        "transformProxyIngCount": 0,
        "transformProxyCompleteCount": 0,
        "authorizationCount": 0
      },
      declareSearch: {
        declareTime: '',
        countryCode: '-1',
        suppliarId:''
      },
      declareStaticInfo: {
        "mtdAuthorizationCount": 0,
        "notStartCount": 0,
        "uploadCount": 0,
        "paymentCount": 0,
        "rejectCertificateCount": 0,
        "auditCertificateCount": 0,
        "taxStampCompleteCount": 0,
        "taxStampFailedCount": 0,
        "taxCompleteCount": 0,
        "taxIngCount": 0
      }
    }
  },
  mounted() {
    // this.initDeclearDate()
    // this.getCountryList()
  },
  methods: {
    //初始化申报查询日期
    initDeclearDate() {
      let date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1
      this.declareSearch.declareTime = year + '-' + month
    },
    //获取税号国家下拉数据
    getCountryList() {
      return
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
      //设置默认国家
      API.getDefaultCountry().then(res => {
        if (res.code == 0) {
          res.data.map((item, index) => {
            switch (item.taxWorkOrderType) {
              case 1:
                this.declareSearch.countryCode = item.countryCode
                break;
              case 2:
                this.agentSearch.countryCode = item.countryCode
                break;
              case 3:
                this.registerSearch.countryCode = item.countryCode
                break;
              default:
                break;
            }
          })
        }
      }).finally(() => {
        this.registerStaticFun()
        this.agentStaticFun()
        this.taxWorkOrderStaticFun()
      })
    },
    //注册统计接口
    registerStaticFun() {
      return
      let data = {
        startTime: this.formatDate(this.registerSearch.startTime, 'date'),
        endTime: this.formatDate(this.registerSearch.endTime, 'date'),
        countryCode: this.registerSearch.countryCode,
        supplierId: this.registerSearch.suppliarId
      }
      if (this.registerSearch.countryCode == -1) {
        data.countryCode = ''
      }
      console.log(this.registerSearch.suppliarId)
      API.registerStatisticsAPI(data).then(res => {
        if (res.code == 0) {
          this.registerStaticInfo = res.data
        }
      })
    },
    //转代理统计接口
    agentStaticFun() {
      return
      let data = {
        startTime: this.formatDate(this.agentSearch.startTime, 'date'),
        endTime: this.formatDate(this.agentSearch.endTime, 'date'),
        countryCode: this.agentSearch.countryCode,
        supplierId: this.agentSearch.suppliarId
      }
      if (this.agentSearch.countryCode == -1) {
        data.countryCode = ''
      }
      API.transformProxyStatisticsAPI(data).then(res => {
        if (res.code == 0) {
          this.agentStaticInfo = res.data
          this.getSupplierByCondition2()
        }
      })
    },
    //申报工单统计接口
    taxWorkOrderStaticFun() {
      return
      let data = {
        declareTime: this.formatDate(this.declareSearch.declareTime, 'month'),
        countryCode: this.declareSearch.countryCode,
        supplierId: this.declareSearch.suppliarId
      }
      if (this.declareSearch.countryCode == -1) {
        data.countryCode = ''
      }
      API.taxWorkOrderStatisticsAPI(data).then(res => {
        if (res.code == 0) {
          this.declareStaticInfo = res.data
          this.getSupplierByCondition1()
        }
      })
    },
    //跳转到注册列表
    goRegister(status) {
      return
      this.$router.push({
        name: 'register',
        params: {
          status: status,
          countryCode: this.registerSearch.countryCode,
          startTime: this.registerSearch.startTime,
          endTime: this.registerSearch.endTime,
          supplierId: this.registerSearch.suppliarId
        }
      })
    },
    //跳转到转代理列表
    goAgentPage(status) {
      return
      this.$router.push({
        name: 'turnToAgent',
        params: {
          status: status,
          countryCode: this.agentSearch.countryCode,
          startTime: this.agentSearch.startTime,
          endTime: this.agentSearch.endTime,
          supplierId: this.agentSearch.suppliarId
        }
      })
    },
    //跳转到工单查询列表
    toDeclare(status) {
      return
      this.$router.push({
        name: 'declare',
        params: {
          status: status,
          declareTime: this.declareSearch.declareTime,
          countryCode: this.declareSearch.countryCode,
          supplierId: this.declareSearch.suppliarId
        }
      })
    },
    //顶部tab打开页面
    openTab(type) {
      this.$Message.info('暂未开放，敬请期待！')
      return
      if (type != '') {
        this.$router.push({
          name: type
        })
      } else {
        this.$Message.info('暂未开放，敬请期待！')
      }
    },
    //服务查询重置
    resetService() {
      this.serviceSearch.searchContent = ''
    },
    //服务查询
    searchServiceFun() {
      return
      this.$router.push({
        name: 'serviceQuery',
        params: {
          searchContent: this.serviceSearch.searchContent
        }
      })
    },
    getSupplierByCondition3() {
      return
      let self = this;
      this.SupplierByConditionList3 = [];
      let data = {...this.registerSearch}
      if (this.registerSearch.countryCode == -1) {
        data.countryCode = ''
      }
      if (this.registerSearch.countryCode == undefined) {
        data.countryCode = ''
      }
      this.SupplierByConditionList3 = []
      API1.supplierByCondition({
        countryCode: data.countryCode,
        supplierType:1,
      }).then(res => {
        self.$set(self,'SupplierByConditionList3',res.data);
      })
    },
    getSupplierByCondition2() {
      return
      let self = this;
      this.SupplierByConditionList2 = [];
      let data = {...this.agentSearch}
      if (this.agentSearch.countryCode == -1) {
        data.countryCode = ''
      }
      if (this.agentSearch.countryCode == undefined) {
        data.countryCode = ''
      }
      this.SupplierByConditionList2 = []
      API1.supplierByCondition({
        countryCode: data.countryCode,
        supplierType:1,
      }).then(res => {
        self.$set(self,'SupplierByConditionList2',res.data);
      })
    },
    getSupplierByCondition1() {
      return
      let self = this;
      this.SupplierByConditionList1 = [];
      let data = {...this.declareSearch}
      if (this.declareSearch.countryCode == -1) {
        data.countryCode = ''
      }
      if (this.declareSearch.countryCode == undefined) {
        data.countryCode = ''
      }
      this.SupplierByConditionList1 = []
      API1.supplierByCondition({
        countryCode: data.countryCode,
        supplierType:1,
      }).then(res => {
        self.$set(self,'SupplierByConditionList1',res.data);
      })
    },
    //国家发生改变
    changeCountry(country, type) {
      return
      switch (type) {
        case 1:
          this.taxWorkOrderStaticFun()
          this.getSupplierByCondition3()
          break;
        case 2:
          this.agentStaticFun()
          this.getSupplierByCondition3()
          break;
        case 3:
          this.registerStaticFun()
          this.getSupplierByCondition3()
          break;
        default:
          break;
      }
    },
    changeSuppliar(country, type) {
      return
      switch (type) {
        case 1:
          this.taxWorkOrderStaticFun()
          break;
        case 2:
          this.agentStaticFun()
          break;
        case 3:
          this.registerStaticFun()
          break;
        default:
          break;
      }
    },
    //设置默认国家
    setDefault(taxWorkOrderType) {
      return
      let data = {
        taxWorkOrderType,
        countryCode: ''
      }
      switch (taxWorkOrderType) {
        case 1:
          data.countryCode = this.declareSearch.countryCode
          break;
        case 2:
          data.countryCode = this.agentSearch.countryCode
          break;
        case 3:
          data.countryCode = this.registerSearch.countryCode
          break;
        default:
          break;
      }
      if (data.countryCode == undefined) {
        data.countryCode = ''
      }
      API.updateDefaultCountry(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('设置成功')
        }
      })
    },
    //税号注册
    handleChange3(date) {
      this.registerStaticFun()
    },
    //转代理
    handleChange2(date) {
      this.agentStaticFun()
    },
    //申报
    handleChange1(date) {
      this.taxWorkOrderStaticFun()
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
  }
}

</script>
<style lang="less"scoped>
.content {
  padding: 15px;
  color: #333333;
  .top-content {
    background-color: #fff;
    padding: 10px 20px 10px 46px;
    .welcome {
      font-size: 18px;
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
      color: #333333;
      line-height: 25px;
    }
    .line {
      width: 1px;
      height: 66px;
      background: rgba(22, 173, 233, 0.22);
      margin-left: 42px;
      margin-top: 26px;
    }
    .flex {
      margin-left: 20px;
      .flex-item {
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px rgba(5, 103, 159, 0.12);
        border-radius: 4px;
        padding: 18px 28px 20px 26px;
        color: #16ade9;
        font-size: 24px;
        margin-top: 20px;
        cursor: pointer;
        a {
          color: #16ade9;
        }
        img {
          vertical-align: middle;
          margin-right: 10px;
        }
      }
    }
  }
  .search-content {
    margin-top: 16px;
    background-color: #fff;
    padding: 20px;
    .search-title {
      font-size: 18px;
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
      color: #333333;
    }
    .search-box {
      text-align: center;
      padding-bottom: 20px;
      /deep/ .ivu-input-wrapper {
        width: 392px;
        margin-right: 22px;
      }
      /deep/ .ivu-input {
        height: 40px;
      }
      /deep/ .ivu-btn-primary {
        background-color: #16ade9;
        border-color: #16ade9;
        img {
          vertical-align: middle;
        }
      }
      .gary {
        border-color: #999999;
        margin-left: 6px;
      }
      &:hover {
        color: #16ade9;
      }
    }
  }
  .reg-turn {
    border-radius: 4px;
    margin-top: 16px;
    width: 100%;
    .flex-item {
      width: 49%;
      padding: 20px;
      background-color: #fff;

      .item-list {
        margin-top: 14px;
        .items {
          padding: 10px 0;
          width: 100%;
          font-size: 14px;
          border-bottom: 1px solid #dddddd;
          cursor: pointer;
          &:hover {
            background: rgba(22, 173, 233, 0.1);
          }
        }
      }
    }
    .register-box {
      margin-right: 2%;
    }
  }
  .declear-box {
    background-color: #fff;
    margin-top: 10px;
    padding: 20px;
    .tool-bar {
      margin-bottom: 20px;
    }
    .declear-list {
      margin-bottom: 16px;
      .declear-item {
        padding: 18px;
        text-align: center;
        width: 190px;
        cursor: pointer;
        p {
          margin-top: 12px;
        }
      }
      .declear-item:hover {
        box-shadow: 0px 2px 12px 0px rgba(9, 124, 170, 0.12);
        border-radius: 4px;
      }
    }
  }
  .tool-bar {
    .type {
      font-size: 18px;
      font-family: "PingFangSC-Medium", "PingFang SC";
      font-weight: 500;
    }
    .default-box {
      color: #16ade9;
      cursor: pointer;
      margin: 10px;
    }
    /deep/ .ivu-select {
      margin-right: 10px;
    }
  }
}
.gray {
  color: #999999;
}
.defalut-color {
  color: #16ade9;
}
.red {
  color: #ed3e3e;
}
.yellow {
  color: #fbb73c;
}
</style>