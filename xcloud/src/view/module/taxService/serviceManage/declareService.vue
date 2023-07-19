<template>
  <div class="container">
    <div class="mainPage" v-if="!isDetailShow && !taxModalShow && !goAnnalsDe">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="手机号/服务号/服务公司名称/税号" style="width:200px;" />
        </FormItem>
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
          <Select clearable v-model="searchForm.serviceStatus" placeholder="服务状态">
            <Option v-for="(item,index) in serviceStatusList" :value="item.status" :key="index">{{ item.serviceStatus }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.disposeId" clearable placeholder="税务经理">
            <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.gainWay" placeholder="获取方式">
            <Option value="1">购买</Option>
            <Option value="2">活动</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.companyBody"
                  placeholder="归属公司">
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date1"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange1($event,'create')"
                      placeholder="订单创建时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange1($event,'audit')"
                      placeholder="审核时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date2"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange1($event,'service')"
                      placeholder="提交服务商时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date3"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange1($event,'tax')"
                      placeholder="提交税局时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList()" style="margin-right:5px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tab">
        <Button type="primary" v-if="['28','31'].includes(searchForm.status)" style="margin-right:10px;" v-show="hasAuthority('declareService_batchEditSupplier')" @click="openEditSupplierModal()">修改服务商</Button>
        <Button type="primary" style="margin-right:10px;" v-show="hasAuthority('declareService_batchClaimTaxManager')" @click="openClaimTaxManagerModal()">修改税务经理</Button>
        <Button type="primary" v-if="searchForm.status==28" @click="batchRemined">批量提醒</Button>
      </div>
      <div class="tableArea">
        <Tabs :value="searchForm.status" :animated="false" @on-click="tabsChange">
          <TabPane label="全部" name="-1"></TabPane>
          <TabPane label="待上传资料" name="28"></TabPane>
          <TabPane label="转代理资料待审核" name="31"></TabPane>
          <TabPane label="转代理资料驳回" name="32"></TabPane>
          <TabPane label="待授权海牙认证" name="36"></TabPane>
          <TabPane label="海牙认证中" name="37"></TabPane>
          <TabPane label="待授权转代理" name="38"></TabPane>
          <TabPane label="转代理中" name="29"></TabPane>
          <TabPane label="已取消" name="82"></TabPane>
          <TabPane label="未开始" name="19"></TabPane>
          <TabPane label="未开始(已开始报税)" name="20"></TabPane>
          <TabPane label="待申报" name="21"></TabPane>
          <TabPane label="申报中" name="18"></TabPane>
          <TabPane label="待缴纳税金" name="22"></TabPane>
          <TabPane label="待审核申报" name="23"></TabPane>
          <TabPane label="申报驳回" name="24"></TabPane>
          <TabPane label="税金待审核" name="33"></TabPane>
          <TabPane label="申报完成" name="25"></TabPane>
          <TabPane label="申报（标记）完成" name="27"></TabPane>
          <TabPane label="申报失败" name="26"></TabPane>
          <TabPane label="缴税凭证被驳回" name="34"></TabPane>
          <TabPane label="待上传零申报凭证" name="35"></TabPane>
        </Tabs>
        <Table border :loading="tableLoading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operate" slot-scope="{ row }">
            <div class="action">
              <Button type="primary" ghost size="small" v-if="(row.progressBar==19 || row.progressBar == 21 || row.progressBar ==22) && row.status != 4" @click="sendMessage(row)">发送提醒</Button>
              <Button type="primary" ghost size="small" v-show="hasAuthority('work_order_list02')" @click="toDetail(row)">查看</Button>
              <Button type="primary" ghost size="small" v-if="row.progressBar == 38 || row.progressBar == 29"  v-show="hasAuthority('work_order_list14')" @click="toUpdateStatus(row)">更改状态</Button>
              <Button type="primary" ghost size="small" v-show="hasAuthority('work_order_list11')"  v-if="(row.progressBar<28 || row.progressBar==34 || row.progressBar==35) && row.status != 4" @click="turnToOut(row)">转出申报</Button>
              <Button type="primary" ghost  size="small"  @click="toRemark(row)" v-show="hasAuthority('declareService_remark')">备注</Button>
            </div>
          </template>
          <template slot="supplierName" slot-scope="{ row }">
            <div class="supplierName">
              <span v-show="hasAuthority('declareService_lookSupplier')">{{row.supplierName}}</span>
              <Icon v-if="[28,31].includes(row.progressBar)" class="icon" type="md-create" v-show="hasAuthority('declareService_editSupplier')" @click="openEditSupplierModal(row)"></Icon>
            </div>
          </template>
          <template slot="disposeName" slot-scope="{ row }">
            <div class="disposeName">
              <span v-if="row.disposeId">{{row.disposeName}}</span>
              <span v-if="!row.disposeId" class="button" v-show="hasAuthority('declareService_claimTaxManager')" @click="openClaimTaxManagerModal(row)">认领</span>
            </div>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span>{{declareStatus[row.status]}}</span>
          </template>
          <template slot="serviceName" slot-scope="{ row }">
            <span>{{row.productFunctionCode == '1' ? "税号注册" : row.productFunctionCode == '2' ? "税务申报" : row.productFunctionCode == '3' ? "税务补缴" : row.productFunctionCode == '4' ? "转代理" : ''}}</span>
          </template>
          <template slot="remarkContent" slot-scope="{ row }">
            <span style="color:rgb(22, 173, 233);cursor:pointer;" @click="showRemarkList(row)">查看</span>
          </template>
          <template slot="refuseReason" slot-scope="{ row }">
            <span style="color:rgb(22, 173, 233);cursor:pointer;" @click="showRefuseReason(row)">查看</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler" @on-page-size-change="handlePageSize" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator show-sizer />
      </div>
    </div>
    <detailInfo v-if="isDetailShow" @showTaxModal="showTaxModal" @showAnnalsModal="showAnnalsModal" @back="isDetailShow=false" @refresh="refreshList" :id="detailId" :productFunctionCode="productFunctionCode" :userId="userId" :countryCode="countryCode"></detailInfo>
    <taxModal v-if="taxModalShow" :serviceId="serviceId" @declareShow="declareShow" @zeroDeclareShow="zeroDeclareShow" :workId="computeId" @refresh="refreshList" @back="isDetailShow=true;taxModalShow=false"></taxModal>
    <submitDeclareGB v-if="declareModalShow" @changeState="submitDeclareGBModel"></submitDeclareGB>
    <zeroDeclare v-if="zeroDeclareModalShow" @changeState="zeroDeclareModel"></zeroDeclare>
    <annalsDE v-if="goAnnalsDe" :workId="annalsId" :serviceId="serviceId" @back="isDetailShow=true;goAnnalsDe=false" :baseData="baseData" :detailsReturnData="detailsReturnData"></annalsDE>
    <Modal v-model="updateStatus" title="更改状态">
      <p>当前状态：<span>{{progressStatus[updateStatusObj.progressBar]}}</span></p>
      <br />
      <div>
        <p>更改状态为</p>
        <br />
        <RadioGroup v-model="updateStatusData.status">
          <Radio label="31" v-if="updateStatusObj.progressBar==38 || updateStatusObj.progressBar==29">待审核</Radio>

          <Radio label="38" v-if="updateStatusObj.progressBar==29 && ((updateStatusObj.countryCode=='IT' && updateStatusObj.supplierId != 50) || updateStatusObj.countryCode=='FR' || updateStatusObj.countryCode=='NL')">待授权转代理</Radio>

          <Radio label="21" v-if="updateStatusObj.progressBar==18 || updateStatusObj.progressBar==22 || (updateStatusObj.progressBar==25 && updateStatusObj.countryCode!='GB' && updateStatusObj.countryCode!='DE')">待提交申报</Radio>

          <Radio label="22" v-if="updateStatusObj.progressBar==25 && (updateStatusObj.countryCode=='AE' || updateStatusObj.countryCode=='SA')">待缴纳税金</Radio>

        </RadioGroup>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="updateStatus=false">取消</Button>
        <Button type="primary" @click="sureUpdateStatus">确认</Button>
      </p>
    </Modal>
    <!-- 修改服务商 -->
    <Modal class="modal" v-model="editSupplierModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="editSupplierForm.ids">
        <p v-if="editSupplierForm.type == 2 && editSupplierForm.ids.length > 1">共选择了{{editSupplierForm.ids.length}}条工单</p>
        <p v-if="editSupplierForm.type == 1 || editSupplierForm.ids.length == 1">
          <span>当前服务商：</span>
          <span>{{editSupplierForm.supplierName}}</span>
        </p>
        <p>
          <span>修改服务商：</span>
          <Select clearable v-model="editSupplierForm.supplierId" placeholder="服务商" style="width:200px;">
            <Option v-for="(item,index) in editSupplierForm.facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </p>
        <p style="color:red;">提示：更改服务商后，资料模板也将更新，客户需要重新提交资料，请谨慎操作！</p>
      </div>
      <div slot="header" class="header">
        <p>修改服务商</p>
        <Icon class="closeBtn" @click="editSupplierCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="editSupplierCancel()">取消</Button>
        <Button type="primary" :loading="editSupplierLoading" @click="editSupplierSubmit()">确认</Button>
      </div>
    </Modal>
    <!-- 修改税务经理 -->
    <Modal class="modal" v-model="claimTaxManagerModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="claimTaxManagerForm.ids">
        <p v-if="claimTaxManagerForm.type == 2 && claimTaxManagerForm.ids.length > 1">共选择了{{claimTaxManagerForm.ids.length}}条工单</p>
        <p v-if="claimTaxManagerForm.type == 1 || claimTaxManagerForm.ids.length == 1">
          <span>当前税务经理：</span>
          <span>{{claimTaxManagerForm.OldDisposeName}}</span>
        </p>
        <p>
          <span>修改税务经理：</span>
          <Select v-model="claimTaxManagerForm.disposeId" clearable placeholder="税务经理" style="width:200px;">
            <Option v-for="(item,index) in taxManagerModalList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </p>
      </div>
      <div slot="header" class="header">
        <p>修改税务经理</p>
        <Icon class="closeBtn" @click="claimTaxManagerCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="claimTaxManagerCancel()">取消</Button>
        <Button type="primary" :loading="claimTaxManagerLoading" @click="claimTaxManagerSubmit()">确认</Button>
      </div>
    </Modal>
    <Modal v-model="remarkModal" title="添加备注">
      <div style="width:489px;margin-bottom:10px">
          <Input v-model="remarkObj.remarkComment" type="textarea" placeholder="请输入备注" />
      </div>
      <div style="display:flex;justify-content:center;">
        <span>附件：</span>
        <div>
          <Upload ref="taxFile" 
                  type="drag" 
                  :action="fileUpload" 
                  :data="{ prefix: '' }" 
                  :before-upload="beroreRemarkUpload" 
                  :on-success="remarkUploadSuccess" 
                  :on-remove="removeremark" 
                  style="width:260px"
                  :show-upload-list="false">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="remarkObj.annex" style="width:300px">
          <a :href="remarkObj.annex" target="_blank">{{ remarkObj.annexName }}</a>
          <Button class="deletBtn" type="text" ghost @click="removeremark">
            <img class="closeImg"
                  src="@/assets/images/activeCloseImg.png"
                  alt="">
          </Button>
        </div>
        </div>
      </div>
      <p style="color:rgb(247, 151, 40);text-align:center;">注：支持JPG、JPEG、PNG、PDF</p>
      <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="remarkModal=false">取消</Button>
          <Button type="primary" @click="sureRemark">确认</Button>
        </p>
    </Modal>
    <Modal v-model="remarkListModal" title="备注信息">
      <div v-if="remarkList.length>0" :class="remarkList.length>3?'overflow':''" style="padding-right: 15px;">
        <div class="remark-list" v-for="(item,index) in remarkList" :key="index">
          <p>
            <span>备注人：</span>
            <span>{{ item.remarkBy }}</span>
          </p>
          <p>
            <span>备注内容：</span>
            <span>{{ item.remarkComment }}</span>
          </p>
          <p v-if="item.annex">
            <span>附件：</span>
            <a :href="item.annex.slice(0,5)=='http:'?item.annex.slice(0,4)+'s'+item.annex.slice(4):item.annex" target="_blank">{{ item.annexName?item.annexName:'附件' }}</a>
          </p>
          <p>
            <span>备注时间：</span>
            <span>{{ item.remarkTime }}</span>
          </p>
          <span class="delet" @click="deletRemarkHandel(item.id,index)" v-show="hasAuthority('declareService_deletRemark')">X</span>
        </div>
      </div>
      <div v-else style="text-align:center;font-size:30px;line-height:212px">
        当前服务单无备注
      </div>
      <p slot="footer" style="text-align:center">
        <Button type="primary" ghost @click="remarkListModal=false">关闭</Button>
      </p>
    </Modal>
    <Modal v-model="refuseReasonModal" title="驳回详情">
      <div v-if="refuseReasonList.length>0" :class="refuseReasonList.length>3?'overflow':''" style="padding-right: 15px;">
        <div class="remark-list" v-for="(item,index) in refuseReasonList" :key="index">
          <p>
            <span>驳回人：</span>
            <span>{{ item.refuseBy }}</span>
          </p>
          <p>
            <span>驳回原因：</span>
            <span>{{ item.refuseReason }}</span>
          </p>
          <p>
            <span>驳回时间：</span>
            <span>{{ item.refuseTime }}</span>
          </p>
        </div>
      </div>
      <div v-else style="text-align:center;font-size:30px;line-height:212px">
        当前服务单无驳回
      </div>
      <p slot="footer" style="text-align:center">
        <Button type="primary" ghost @click="refuseReasonModal=false">关闭</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import detailInfo from "./declareServiceDetail";
import * as API2 from '@/api/taxService/regAndDeclare.js';
import taxModal from './taxModal';
import annalsDE from '../components/annalsDE';
import * as API1 from '@/api/taxService/taxModule.js';
import * as API from '@/api/taxService/workOrder.js';
import { getTaxCountry } from '@/api/taxService/common.js';
import submitDeclareGB from '../serviceRegManage/components/submitDeclareGB';
import zeroDeclare from '../serviceRegManage/components/zeroDeclare';
import * as extendsAPI from "@/api/extends/facilitatorAndTax";
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
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
      updateStatus: false,
      updateStatusData: {
        status: ''
      },
      productFunctionCode:'',
      updateStatusObj: {},
      remarkList:[],
      remarkObj:{
        serverNo:'',
        annex:'',
        ids:'',
        annexName:'',
        remarkComment:''
      },
      fileUpload: this.workOrderFile,
      remarkModal:false,
      remarkListModal:false,
      refuseReasonModal:false,
      refuseReasonList:[],
      declareModalShow: false,
      zeroDeclareModalShow: false,
      searchForm: {
        status: '-1',
        searchContent: '',
        auditTimeBegin:'',
        startCreateTime:'',
        endCreateTime:'',
        startSubmitTaxTime:'',
        endSubmitTaxTime:'',
        startSubmitServiceTime:'',
        endSubmitServiceTime:'',
        auditTimeEnd:'',
        countryCode: '',
        taxWorkOrderType: '2',
        gainWay: '',
        serviceStatus: ''
      },
      serviceStatusList: [
        {
          status: '0',
          serviceStatus: '未购买'
        },
        {
          status: '1',
          serviceStatus: '正常'
        },
        {
          status: '2',
          serviceStatus: '待续费'
        },
        {
          status: '3',
          serviceStatus: '注销税号'
        },
        {
          status: '4',
          serviceStatus: '已转出'
        }
      ],
      date: '',
      date1: '',
      date2: '',
      date3: '',
      tableLoading: false,
      columns_showSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 20
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '国家',
          key: 'countryNameZh',
        },
        {
          title: '服务商',
          slot: 'supplierName',
          minWidth:20
        },
        {
          title: '申报次数',
          key: 'declareCout',
        },
        {
          title: '下一次申报区间',
          // key:'nextDeclareTime'
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          },
          minWidth: 40
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: '服务截止时间',
          key: 'expirationTime',
          minWidth: 20
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          minWidth: 20
        },
        {
          title: '跟进人',
          key: 'followUserName'
        },
        {
          title: '申报性质',
          render: (h, params) => {
            return h('span', params.row.taxType == 1 ? '正常申报' : params.row.taxType == 2 ? '转代理申报' : '')
          }
        },
        {
          title: '备注',
          slot: 'remarkContent',
        },
        {
          title: '驳回原因',
          slot: 'refuseReason',
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 20
        }
      ],
      columns_noShowSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 20
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '国家',
          key: 'countryNameZh',
        },
        {
          title: '申报次数',
          key: 'declareCout',
        },
        {
          title: '下一次申报区间',
          // key:'nextDeclareTime'
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          },
          minWidth: 40
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: '服务截止时间',
          key: 'expirationTime',
          minWidth: 20
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          minWidth: 20
        },
        {
          title: '跟进人',
          key: 'followUserName'
        },
        {
          title: '申报性质',
          render: (h, params) => {
            return h('span', params.row.taxType == 1 ? '正常申报' : params.row.taxType == 2 ? '转代理申报' : '')
          }
        },
        {
          title: '备注',
          slot: 'remarkContent',
        },
        {
          title: '驳回原因',
          slot: 'refuseReason',
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 20
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
        38: "待授权转代理"
      },
      declareStatus: {
        0: '未购买',
        1: '正常',
        2: '待续费',
        3: '注销税号',
        4: '已转出'
      },
      countryCode: '',
      userId: '',
      selectList: [],
      goAnnalsDe: false,
      annalsId: '',
      baseData: {},
      detailsReturnData:{},
      editSupplierModal: false,
      editSupplierLoading: false,
      editSupplierForm: {},

      claimTaxManagerModal: false,
      claimTaxManagerLoading: false,
      claimTaxManagerForm: {},

    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles;
    },
    columns(){
      if(this.hasAuthority('declareService_lookSupplier')){
        return this.columns_showSupplierName;
      }else{
        return this.columns_noShowSupplierName;
      }
    },
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
      if (params.status == -1) params.status = ''
      API.getDeclareServiceList(params).then((res) => {
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
    showRefuseReason(row){
      API2.getRefuseList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.refuseReasonList = res.data
          this.refuseReasonModal = true
        }
      })
    },
    saveRemarkList(index){
      this.$Modal.confirm({
          title: '删除提醒',
          content: `<p>您确定要删除该备注吗？</p>`,
          onOk: () => {
            API2.addOrDeletRemark(this.remarkObj).then(res=>{
              if(res.code == 0){
                this.$Message.success('删除成功')
                this.remarkObj.ids = ''
                this.remarkList.splice(index,1)
              }
            })
          },
      });
    },
    deletRemarkHandel(id,index){
      this.remarkObj.ids = id
      // if(this.remarkObj.ids == ''){
      //   this.remarkObj.ids = id
      // }else{
      //   this.remarkObj.ids = this.remarkObj.ids+';'+id
      // }
      this.saveRemarkList(index)
    },
    sureRemark(){
      if(this.remarkObj.remarkComment == ''){
        this.$Message.info('请输入备注内容')
        return
      }
      API2.addOrDeletRemark(this.remarkObj).then(res=>{
        if(res.code == 0){
          this.$Message.success('添加成功')
          this.remarkModal = false
        }
      })
    },
    //备注附件上传之前
    beroreRemarkUpload() {

    },
    //备注附件上传成功
    remarkUploadSuccess(res, file, fileList) {
      this.remarkObj.annex = res.data.fileUrl
      this.remarkObj.annexName = res.data.origFileName
    },
    //移除备注附件
    removeremark(file, fileList) {
      this.remarkObj.annex = ''
      this.remarkObj.annexName = ''
    },
    showRemarkList(row){
      this.remarkObj = {
        serverNo:'',
        annex:'',
        ids:'',
        remarkComment:''
      }
      this.remarkObj.serverNo = row.serverNo
      API2.getRemarkList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.remarkList = res.data
          this.remarkListModal = true
        }
      })
    },
    toRemark(row){
      this.remarkObj = {
        serverNo:'',
        annex:'',
        annexName:'',
        ids:'',
        remarkComment:''
      }
      this.remarkObj.serverNo = row.serverNo
      this.remarkModal = true
    },
    dateChange1(date,type) {
      switch(type){
        case 'create':
          this.searchForm.startCreateTime = date[0];
          this.searchForm.endCreateTime = date[1];
          break;
        case 'tax':
          this.searchForm.startSubmitTaxTime = date[0];
          this.searchForm.endSubmitTaxTime = date[1];
          break;
        case 'service':
          this.searchForm.startSubmitServiceTime = date[0];
          this.searchForm.endSubmitServiceTime = date[1];
          break;
        case 'audit':
          this.searchForm.auditTimeBegin = date[0];
          this.searchForm.auditTimeEnd = date[1];
          break;
      }
    },
    sureUpdateStatus(){
      if(this.updateStatusData.status == ''){
        this.$Message.info('请先选择要更改的状态')
        return
      }
      this.updateStatusData.servicesId = this.updateStatusObj.id
      this.updateStatusData.serverNo = this.updateStatusObj.serverNo
      API2.agentUpdateStatus(this.updateStatusData).then(res => {
        if (res.code == 0) {
          this.$Message.success('状态更改成功')
          this.updateStatus = false
          this.getList()
        }
      })
    },
    toUpdateStatus(row) {
      this.updateStatusData = {
        status: ''
      }
      this.updateStatusObj = { ...row }
      this.updateStatus = true
    },
    turnToOut(row) {
      this.$Modal.confirm({
        title: '转出确认',
        content: '转出后该公司将不能在本平台继续报税，是否确认转出申报？',
        onOk: () => {
          // console.log('确认转出')
          API2.changeServiceStatusTransferredOut({ serviceId: row.id }).then(res => {
            if (res.code == 0) {
              this.$Message.success('转出申报成功')
              this.getList()
            }
          })
        }
      });
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
        auditTimeBegin:'',
        auditTimeEnd :'',
        taxWorkOrderType:'2',
        countryCode: '',
        startCreateTime:'',
        endCreateTime:'',
        startSubmitTaxTime:'',
        endSubmitTaxTime:'',
        startSubmitServiceTime:'',
        endSubmitServiceTime:'',
      }
      this.pageInfo = {
        limit: 10,
        page: 1,
      }
      this.date = "";
      this.date1 = "";
      this.date2 = "";
      this.date3 = "";
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
    toDetail(row) {
      // 如果当前用户是税务经理，且税务经理未认领，不可查看详情
      if (!row.disposeId && this.roles.some(el => el.roleCode == 'tax_commissioner')) {
        this.$Message.warning('该工单未认领！');
        return false;
      }
      this.serviceId = row.id
      this.isDetailShow = true;
      this.detailId = row.id;
      this.productFunctionCode = row.productFunctionCode;
      this.countryCode = row.countryCode
      this.userId = row.userId
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
    showAnnalsModal(id, baseData, detailsReturnData) {
      this.isDetailShow = false;
      this.goAnnalsDe = true
      this.annalsId = id
      this.baseData = baseData
      this.detailsReturnData = detailsReturnData
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
    },

    // 开启修改服务商弹窗
    openEditSupplierModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      let params = {};
      if (row) {
        if (![28, 31].includes(row.progressBar)) {
          this.$Message.warning('仅进度为待上传资料和待审核的工单可以修改服务商！')
          return false;
        }
        params = {
          countryCode: row.countryCode,
          supplierType: 1,
        };
        self.editSupplierForm.type = 1;
        self.editSupplierForm.ids = [row.id];
        self.editSupplierForm.supplierName = row.supplierName;
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        if (this.selectList.some(el => ![28, 31].includes(el.progressBar))) {
          this.$Message.warning('仅进度为待上传资料和待审核的工单可以修改服务商！')
          return false;
        }
        if (this.selectList.some(el => el.countryCode != this.selectList[0].countryCode)) {
          this.$Message.warning('仅支持同一个国家的工单批量修改服务商，请重新选择！')
          return false;
        }
        params = {
          countryCode: self.selectList[0].countryCode,
          supplierType: 1,
        };
        self.editSupplierForm.type = 2;
        self.editSupplierForm.ids = self.selectList.map(el => el.id);
        self.editSupplierForm.supplierName = self.selectList[0].supplierName;
      }
      self.editSupplierForm.countryCode = params.countryCode;
      extendsAPI.getSupplierCondition(params)
        .then((res) => {
          if (res.code == 0) {
            self.editSupplierModal = true;
            self.editSupplierForm.facilitatorList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    // 取消修改
    editSupplierCancel() {
      this.editSupplierModal = false;
      this.editSupplierForm = {};
    },
    // 修改服务商
    editSupplierSubmit() {
      let self = this;
      if (!self.editSupplierForm.supplierId) {
        this.$Message.warning('请选择要修改的服务商！')
        return false;
      }
      let params = {
        ...this.editSupplierForm,
        productFunctionCode: '2',
        supplierType:1,
      };
      this.editSupplierLoading = true;
      this.extendsEditSupplier(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('修改成功！');
            self.getList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.editSupplierLoading = false;
          self.selectList = [];
          self.editSupplierCancel();
        });
    },

    // 开启修改税务经理弹窗
    openClaimTaxManagerModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      if (row) {
        // self.claimTaxManagerForm.type = 1;
        // self.claimTaxManagerForm.ids = [row.id];
        // self.claimTaxManagerForm.OldDisposeName = row.disposeName;
        let params = {
          serviceId: row.id
        };
        self.$Modal.confirm({
          title: '确定认领吗？',
          content: '',
          onOk: () => {
            self.orderServiceClaimTaxManager(params)
              .then((res) => {
                if (res.code == 0) {
                  self.$Message.success('认领成功！');
                  self.getList();
                }
              })
              .catch((err) => {
                console.log(err);
              })
          },
          onCancel: () => { }
        });
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        self.claimTaxManagerForm.type = 2;
        self.claimTaxManagerForm.ids = self.selectList.map(el => el.id);
        self.claimTaxManagerForm.OldDisposeName = self.selectList[0].disposeName;
        self.claimTaxManagerModal = true;
      }
    },
    // 取消税务经理
    claimTaxManagerCancel() {
      this.claimTaxManagerModal = false;
      this.claimTaxManagerForm = {};
    },
    // 修改税务经理
    claimTaxManagerSubmit() {
      let self = this;
      if (!self.claimTaxManagerForm.disposeId) {
        this.$Message.warning('请选择要修改的税务经理！')
        return false;
      }
      let params = {
        ...this.claimTaxManagerForm,
        disposeName: self.taxManagerModalList.find(el => el.id == self.claimTaxManagerForm.disposeId).name,
        productFunctionCode: '2',
      };
      this.claimTaxManagerLoading = true;
      this.extendsClaimTaxManager(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('修改成功！');
            self.getList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.claimTaxManagerLoading = false;
          self.selectList = [];
          self.claimTaxManagerCancel();
        });
    },
  }
}
</script>
<style lang="less" scoped>
.deletBtn{
  padding: 0;
}
.closeImg {
  width: 11px;
  height: 11px;
}
/deep/ .ivu-modal-body{
  padding-right: 0;
}
.overflow{
  height: 450px;
  overflow: auto;
}
.remark-list{
  position: relative;
  font-size: 14px;
  border-bottom: 1px solid #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  word-break: break-all;
  white-space: pre-wrap;
  p{
    width: 90%;
  }
  .delet{
    position: absolute;
    color: red;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    top: 0;
    right: 0;
  }
}
.container {
  background: #fff;
  padding: 15px;
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 15px;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
}
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.supplierName {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
  }
}
.tab {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.modal {
  /deep/ .ivu-modal-header {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .closeBtn {
      font-size: 31px;
      cursor: pointer;
    }
  }
  /deep/ .ivu-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ivu-table-wrapper {
    overflow: visible;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
  .text {
    p {
      height: 40px;
      line-height: 40px;
    }
  }
}
.action{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /deep/ .ivu-btn{
    margin: 5px 0;
  }
}
</style>