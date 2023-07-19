<template>
  <div class="taxDeclare_wrapper">
    <div class="mainPage"
         v-if="!isDetailShow && !taxModalShow && !goAnnalsDe">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="手机号/服务号/服务公司名称"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="税号国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.serviceStatus"
                  placeholder="服务状态">
            <Option v-for="(item,index) in serviceStatusList"
                    :value="item.status"
                    :key="index">{{ item.serviceStatus }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.gainWay"
                  placeholder="获取方式">
            <Option value="1">购买</Option>
            <Option value="2">活动</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList()"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name="-1"></TabPane>
          <TabPane label="待上传资料"
                   name="28"></TabPane>
          <TabPane label="转代理资料待审核"
                   name="31"></TabPane>
          <TabPane label="转代理资料驳回"
                   name="32"></TabPane>
          <TabPane label="待授权海牙认证"
                   name="36"></TabPane>
          <TabPane label="海牙认证中"
                   name="37"></TabPane>
          <TabPane label="待授权转代理"
                   name="38"></TabPane>
          <TabPane label="转代理中"
                   name="29"></TabPane>
          <TabPane label="未开始"
                   name="19"></TabPane>
          <TabPane label="未开始(已开始报税)"
                   name="20"></TabPane>
          <TabPane label="待申报"
                   name="21"></TabPane>
          <TabPane label="申报中"
                   name="18"></TabPane>
          <TabPane label="待缴纳税金"
                   name="22"></TabPane>
          <TabPane label="待审核申报"
                   name="23"></TabPane>
          <TabPane label="申报驳回"
                   name="24"></TabPane>
          <TabPane label="税金待审核"
                   name="33"></TabPane>
          <TabPane label="申报完成"
                   name="25"></TabPane>
          <TabPane label="申报（标记）完成"
                   name="27"></TabPane>
          <TabPane label="申报失败"
                   name="26"></TabPane>
          <TabPane label="缴税凭证被驳回"
                   name="34"></TabPane>
          <TabPane label="待上传零申报凭证"
                   name="35"></TabPane>
        </Tabs>
        <div v-if="searchForm.status==28">
          <Button @click="batchRemined">批量提醒</Button>
        </div>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData"
               @on-selection-change="selectChange">
          <template slot="operate"
                    slot-scope="{ row }">
            <div style="padding:5px 0">
                <div style="display:flex;margin-bottom:8px">
                  <Button ghost
                          v-if="row.progressBar==19 || row.progressBar == 21 || row.progressBar ==22"
                          type="info"
                          style="margin-right:8px;"
                          size="small"
                          @click="sendMessage(row)">发送提醒</Button>
                  <Button ghost
                        type="info"
                        v-show="hasAuthority('work_order_list11')"
                        size="small"
                        v-if="(row.progressBar<28 || row.progressBar==34 || row.progressBar==35) && row.serviceStatus != 4"
                        @click="turnToOut(row)">转出申报</Button>
                </div>
                
                <div style="display:flex">
                    <Button ghost
                            type="info"
                            size="small"
                            v-show="hasAuthority('work_order_list02')"
                            style="margin-right:8px;"
                            @click="toDetail(row.serviceId,row.countryCode, row.userId)">查看</Button>
                    <Button
                        type="info"
                        size="small"
                        @click="allFinish(row)">已处理</Button>
                </div>
                
                
            </div>
            
          </template>
          <template slot="status"
                    slot-scope="{ row }">
            <span>{{declareStatus[row.serviceStatus]}}</span>
          </template>
          <template slot="remark"
                    slot-scope="{ row }">
            <div>
                {{row.remark==''?'':row.remark}}
                <img
                style="width:16px;cursor: pointer;"
                src="@/assets/images/home/edit1.png"
                @click="editorModal=true;formEditor={...row}"
                alt />
            </div>
            
          </template>
          <template slot="serviceName"
                    slot-scope="{ row }">
            <span>{{row.productFunctionCode == '1' ? "税号注册" : row.productFunctionCode == '2' ? "税务申报" : row.productFunctionCode == '3' ? "税务补缴" : row.productFunctionCode == '4' ? "转代理" : ''}}</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              @on-page-size-change="handlePageSize"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator
              show-sizer />
      </div>
    </div>
    <detailInfo v-if="isDetailShow"
                @showTaxModal="showTaxModal"
                @showAnnalsModal="showAnnalsModal"
                @back="isDetailShow=false"
                @refresh="refreshList"
                :id="detailId"
                :userId="userId"
                :countryCode="countryCode"></detailInfo>
    <taxModal v-if="taxModalShow"
              :serviceId="serviceId"
              @declareShow="declareShow"
              @zeroDeclareShow="zeroDeclareShow"
              :workId="computeId"
              @refresh="refreshList"
              @back="isDetailShow=true;taxModalShow=false"></taxModal>
    <submitDeclareGB v-if="declareModalShow"
                     @changeState="submitDeclareGBModel"></submitDeclareGB>
    <zeroDeclare v-if="zeroDeclareModalShow"
                 @changeState="zeroDeclareModel"></zeroDeclare>
    <annalsDE v-if="goAnnalsDe"
              :workId="annalsId"
              :serviceId="serviceId"
              @back="isDetailShow=true;goAnnalsDe=false"
              :baseData="baseData"></annalsDE>
    <Modal v-model="editorModal"
           title="服务备注"
           @on-ok="editRemark">
      <Form :model="formEditor"
            :label-width="120">
        <FormItem label="备注：">
          <Input v-model="formEditor.remark"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="最多可输入30个字符"
                 :maxlength='30'></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import detailInfo from "@/view/module/taxService/serviceManage/declareServiceDetail";
import taxModal from '@/view/module/taxService/serviceManage/taxModal';
import annalsDE from '@/view/module/taxService/components/annalsDE';
import * as API1 from '@/api/taxService/taxModule.js';
import * as API from '@/api/taxService/workOrder.js';
import * as API2 from '@/api/taxService/regAndDeclare.js';
import { getTaxCountry } from '@/api/taxService/common.js';
import submitDeclareGB from '@/view/module/taxService/serviceRegManage/components/submitDeclareGB';
import zeroDeclare from '@/view/module/taxService/serviceRegManage/components/zeroDeclare';
export default {
  name: 'mainList',
  components: {
    detailInfo,
    taxModal,
    submitDeclareGB,
    zeroDeclare,
    annalsDE
  },
  data() {
    return {
      isDetailShow: false,
      declareModalShow: false,
      zeroDeclareModalShow: false,
      editorModal:false,
      formEditor:{},
      searchForm: {
        status: '-1',
        searchContent: '',
        countryCode: '',
        gainWay: '',
        serviceStatus:''
      },
      serviceStatusList:[
        {
          status:'0',
          serviceStatus:'未购买'
        },
        {
          status:'1',
          serviceStatus:'正常'
        },
        {
          status:'2',
          serviceStatus:'待续费'
        },
        {
          status:'3',
          serviceStatus:'注销税号'
        },
        {
          status:'4',
          serviceStatus:'已转出'
        }
      ],
      date: '',
      tableLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 80,
        },
        {
          title: '申报性质',
          key: 'productFunctionCode',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 1 ? '税务注册' : code == 2 ? '转代理+申报' : code == 3 ? '税务补缴' : code == 4 ? '转代理' : code == 5 ? '注册+申报' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80
        },
        {
          title: '申报次数',
          key: 'declareCout',
          width: 86
        },
        {
          title: '下一次申报区间',
          // key:'nextDeclareTime'
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          }
        },
        {
          title: '状态',
          slot: 'status',
          width: 80,
        },
        {
          title: '服务截止时间',
          key: 'expirationTime',
          width: 100,
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '跟进人',
          key: 'followUserName'
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '备注',
          slot: 'remark',
          width: 100,
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth:50
        }
      ],
      tableData: [
        {
          orderNo: 'G1211343414141343',
          createTime: '2020-02-29',
          cn_name: '这是一个公司名称',
          service_name: '英国注册申报服务',
          service_amount: '299.0',
          pay_amount: '199.0',
          country: '英国',
          status: 2,
          id: 1
        }
      ],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      countryList: [],
      workId: '',
      taxModalShow: false,
      computeId: '',
      serviceId: '',
      progressStatus: {
        // 0: '待上传资料',
        // 1: '待审核资料',
        // 3: '注册中',
        // 4: '注册完成',
        8: "资料驳回",
        28: "待上传资料",
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
        36: "待授权海牙认证",
        37: "海牙认证中",
        38: "待授权注册税号"
      },
      declareStatus: {
        0: '未购买',
        1: '正常',
        2: '待续费',
        3: '注销税号'
      },
      countryCode: '',
      userId: '',
      selectList: [],
      goAnnalsDe: false,
      annalsId: '',
      baseData: {}
    }
  },
  mounted() {
    this.getList()
    this.getCountryList()
    this.getwayCallBackFun()
  },
  methods: {
    // 业务进度(税务注册：0、待上传资料 1、待审核资料 3、注册中 4、注册完成 8、资料驳回 税务申报：19、未开始 
    // 20、未开始(已开始报税) 21、待提交报税资料 22、待缴纳税金 
    // 25、申报完成（客户端完成） 26、申报失败 27、申报完成(整体完成) 28、待上传资料(转代理) 29、转代理中)
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      if(params.status == -1 ) params.status = ''
      API.getDeclareServiceAbnormalList(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
          this.workId = res.data.records.workId;
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    turnToOut(row){
      this.$Modal.confirm({
          title: '转出确认',
          content: '转出后该公司将不能在本平台继续报税，是否确认转出申报？',
          onOk:()=>{
            // console.log('确认转出')
            API2.changeServiceStatusTransferredOut({serviceId:row.serviceId}).then(res=>{
              if(res.code == 0){
                this.$Message.success('转出申报成功')
                this.getList()
              }
            })
          }
      });
    },
    allFinish(row){
        this.$Modal.confirm({
          title: '处理确认',
          content: '确认后异常工单将从列表移除，是否继续？',
          onOk:()=>{
            API.chuliDeclareServiceAbnormalList({workId:row.id}).then(res=>{
              if(res.code == 0){
                this.$Message.success('提交成功')
                this.getList()
              }
            })
            console.log('确认移除')
          }
      });
    },
    editRemark(){
        let data = {
        workId: this.formEditor.id,
        remark: this.formEditor.remark
      }
      API.beizhuDeclareServiceAbnormalList(data).then(res=>{
        if(res.code == 0){
          this.$Message.success('提交成功')
          this.getList()
        }
      })
      console.log(data)
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //搜索列表
    searchList(type) {
      this.pageInfo.page = 1;
      this.searchForm.status = '-1';
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {
        status: '-1',
        searchContent: '',
        countryCode: '',
      }
      this.pageInfo = {
        limit: 10,
        page: 1,
      }
      this.date = "";
      this.getList()
    },
    //工单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //选择tab状态
    tabsChange(name) {
      this.pageInfo.page = 1
      this.searchForm.status = name;
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.getList();
    },
    //查看详情
    toDetail(id, countryCode, userId) {
      this.serviceId = id
      this.isDetailShow = true;
      this.detailId = id;
      this.countryCode = countryCode
      this.userId = userId
    },
    //发送提醒
    sendMessage(rowData) {
      // 20:未开始 21：待申报 22：待缴纳税金
      let params = {
        serviceId: rowData.id
      }
      this.$Modal.confirm({
        title: '是否发送短信',
        content: '',
        onOk: () => {
          API.sendMessage(params).then(res => {
            if (res.code == 0) {
              this.$Message.success('发送提醒成功')
            } else {
              this.$Message.warning(res.message)
            }
          })
            .catch(err => console.log(err))
        },
        onCancel: () => {

        }
      });
    },
    refreshList() {
      this.isDetailShow = false;
      this.taxModalShow = false;
      // this.pageInfo.page = 1;
      // this.searchForm = {};
      // this.date = '';
      // this.searchForm.status = -1;
      this.getList()
    },
    showTaxModal(id, serviceId) {
      this.computeId = id;
      this.serviceId = serviceId;
      this.isDetailShow = false;
      this.taxModalShow = true;
    },
    showAnnalsModal(id, baseData) {
      this.isDetailShow = false;
      this.goAnnalsDe = true
      this.annalsId = id
      this.baseData = baseData
    },
    // 获取Url参数
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return (false);
    },
    // 授权回调
    getwayCallBackFun() {
      var that = this
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.getQueryVariable('code')
        var state = this.getQueryVariable('state')
        API1.getwayCallback({
          code: code,
          state: state,
          location: 2
        }).then(res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
        var url = window.location.href;
        url = url.split('?')[0];
        window.history.pushState({}, 0, url);
      }
    },
    submitDeclareGBModel(obj) {
      this.declareModalShow = obj.state;
    },
    zeroDeclareModel() {
      this.zeroDeclareModalShow = obj.state
    },
    declareShow() {
      this.declareModalShow = true
    },
    zeroDeclareShow() {
      this.zeroDeclareModalShow = true
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
        progressBar: this.searchForm.status
      }
      API1.batchMessageTrs({ ids }).then(res => {
        if (res.code === 0) {
          this.$Message.success('批量发送短信成功')
          this.selectList = []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// div{
//     display: flex;
// }
</style>