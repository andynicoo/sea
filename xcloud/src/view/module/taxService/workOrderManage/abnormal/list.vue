<template>
  <div class="registerTaxNum_wrapper">
    <div class="mainPage" v-if="!isDetailShow&& !taxModalShow &&!goAnnalsDe &&!isDetailShow1 && !taxModalShow1 &&!goAnnalsDe1">
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="公司名称/手机号/服务号" style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.countryCode" placeholder="税号国家">
            <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.serviceStatus" placeholder="服务状态">
            <Option v-for="(item,index) in serviceStatusList" :value="item.status" :key="index">{{ item.serviceStatus }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList('searchForm')" style="margin: 0 12px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <!-- <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name="-1"></TabPane>
          <TabPane label="待上传注册资料"
                   name="0"></TabPane>
          <TabPane label="待审核"
                   name="1"></TabPane>
          <TabPane label="待海牙认证"
                   name="5"></TabPane>
          <TabPane label="海牙认证中"
                   name="6"></TabPane>
          <TabPane label="注册中"
                   name="3"></TabPane>
          <TabPane label="注册完成"
                   name="4"></TabPane>
          <TabPane label="待授权注册税号"
                   name="7"></TabPane>
          <TabPane label="资料驳回"
                   name="8"></TabPane>
          <TabPane label="未开始(已开始报税)"
                   name="20"></TabPane>
          <TabPane label="待提交申报"
                   name="21"></TabPane>
          <TabPane label="申报中"
                   name="18"></TabPane>
          <TabPane label="待缴纳税金"
                   name="22"></TabPane>
          <TabPane label="待审核申报"
                   name="23"></TabPane>
          <TabPane label="申报驳回"
                   name="24"></TabPane>
          <TabPane label="待审核税金"
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
        </Tabs> -->
        <!-- <div v-if="searchForm.status==0">
          <Button @click="batchRemined">批量提醒</Button>
        </div> -->
        <Table border :loading="tableLoading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operate" slot-scope="{ row }">
            <!-- <Button v-if="row.status == 0" type="info" @click="sendMessage(row)" ghost>发送提醒</Button> -->
            <div style="padding:5px 0">
              <div style="display:flex;">
                <Button type="info" ghost size="small" style="margin-right:8px" v-if="row.productFunctionCode == 5" v-show="hasAuthority('work_order_list02')" @click="toDetail(row)">查看</Button>
                <Button ghost type="info" size="small" v-show="hasAuthority('work_order_list02')" v-if="row.productFunctionCode == 2" style="margin-right:8px;" @click="toDetail1(row.serviceId,row.countryCode, row.userId)">查看</Button>
                <Button type="info" size="small" @click="allFinish(row)">已处理</Button>
              </div>
              <!-- <div style="display:flex;">
                <Button type="info"
                        ghost
                        size="small"
                        style="margin-right:8px"
                        v-if="row.progressBar == 4 || row.progressBar >= 18"
                        @click="toTaxDetail(row)">查看税号信息</Button>
                <Button type="info"
                        ghost
                        size="small"
                        v-show="hasAuthority('work_order_list11')"
                        v-if="(row.progressBar == 4 || row.progressBar >= 18) && row.serviceStatus != 4"
                        @click="turnToOut(row)">转出申报</Button>
              </div> -->
            </div>

          </template>
          <template slot="status" slot-scope="{ row }">
            <span>{{declareStatus[row.serviceStatus]}}</span>
          </template>
          <template slot="remark" slot-scope="{ row }">
            <div>
              {{row.remark==''?'':row.remark}}
              <img style="width:16px;cursor: pointer;" src="@/assets/images/home/edit1.png" @click="editorModal=true;formEditor={...row}" alt />
            </div>

          </template>
          <template slot="serviceName" slot-scope="{ row }">
            <span>{{row.productFunctionCode == '1' ? "税号注册" : row.productFunctionCode == '2' ? "税务申报" : row.productFunctionCode == '3' ? "税务补缴" : row.productFunctionCode == '4' ? "转代理" : ''}}</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler" @on-page-size-change="handlePageSize" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator show-sizer />
      </div>
      <Modal v-model="auditModal" title="审核资料">
        <p>审核通过后开始提交注册</p>
        <p>
          <RadioGroup v-model="isAudit">
            <Radio label="1">
              <span>审核通过</span>
            </Radio>
            <Radio label="0">
              <span>资料不对，驳回</span>
            </Radio>
          </RadioGroup>
        </p>
        <p v-show="isAudit=='0'">
          <Input v-model="remark" type="textarea" placeholder="请输入驳回原因" />
        </p>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="auditModal=false">取消</Button>
          <Button type="primary" @click="sureAudit">确认</Button>
        </p>
      </Modal>
      <Modal v-model="editorModal" title="服务备注" @on-ok="editRemark">
        <Form :model="formEditor" :label-width="120">
          <FormItem label="备注：">
            <Input v-model="formEditor.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="最多可输入30个字符" :maxlength='30'></Input>
          </FormItem>
        </Form>
      </Modal>
    </div>
    <detailInfo v-if="isDetailShow1" @showTaxModal1="showTaxModal" @showAnnalsModal="showAnnalsModal1" @back="isDetailShow1=false" @refresh="refreshList1" :id="detailId" :userId="userId" :countryCode="countryCode"></detailInfo>
    <waitUpload v-if="isDetailShow" @showTaxModal="showTaxModal" @back="isDetailShow=false" @showAnnalsModal="showAnnalsModal" :id="detailId" :userId="userId" :progressBar="progressBar" @refresh="refreshList"></waitUpload>
    <taxModal v-if="taxModalShow" :serviceId="serviceId" @declareShow="declareShow" @zeroDeclareShow="zeroDeclareShow" @back="isDetailShow=true;taxModalShow=false" :workId="computeId" @refresh="refreshList"></taxModal>
    <submitDeclareGB v-if="declareModalShow" @changeState="submitDeclareGBModel"></submitDeclareGB>
    <zeroDeclare v-if="zeroDeclareModalShow" @changeState="zeroDeclareModel"></zeroDeclare>
    <annalsDE v-if="goAnnalsDe" :workId="annalsId" :serviceId="serviceId" @back="isDetailShow=true;goAnnalsDe=false" :baseData="baseData"></annalsDE>
    <annalsDE1 v-if="goAnnalsDe1" :workId="annalsId" :serviceId="serviceId" @back="isDetailShow1=true;goAnnalsDe1=false" :baseData="baseData"></annalsDE1>
    <taxModal1 v-if="taxModalShow1" :serviceId="serviceId" @declareShow="declareShow" @zeroDeclareShow="zeroDeclareShow" :workId="computeId" @refresh="refreshList1" @back="isDetailShow1=true;taxModalShow1=false"></taxModal1>
    <Modal v-model="showTaxDetail" title="税号信息">
      <Form :label-width=100>
        <FormItem label="VAT税号：">
          <span>{{detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber: "暂无"}}</span>
        </FormItem>
        <FormItem label="SIRET号：" v-if="detailInfo.countryCode === 'FR'">
          <span>{{detailInfo.siretNumber ? detailInfo.siretNumber: "暂无"}}</span>
        </FormItem>
        <FormItem label="EORI号：" v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
          <span>{{detailInfo.eoriNumber ? detailInfo.eoriNumber: "暂无"}}</span>
        </FormItem>
        <FormItem label="税号下发日期：">
          <span>{{detailInfo.taxIssueDate? detailInfo.taxIssueDate.substring(0,10):''}}</span>
        </FormItem>
        <FormItem label="税号生效日期：">
          <span>{{detailInfo.taxEffectiveDate? detailInfo.taxEffectiveDate.substring(0,10):''}}</span>
        </FormItem>
        <FormItem label="申报周期：">
          <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报' : detailInfo.periodType == 2 ? '年报': detailInfo.periodType == -1 ? '暂无' : ''}}</span>
        </FormItem>
        <FormItem label="申报国家：">
          <span>{{detailInfo.countryNameZh}}</span>
        </FormItem>
        <!-- 德国 -->
        <FormItem label="VAT税号证书：" v-if="detailInfo.countryCode === 'DE'">
          <span v-if="detailInfo.vatTaxNumberFile!==''">
            <a :href="detailInfo.vatTaxNumberFile && detailInfo.vatTaxNumberFile.slice(0,5)=='http:'?(detailInfo.vatTaxNumberFile.slice(0,4)+'s'+detailInfo.vatTaxNumberFile.slice(4)):detailInfo.vatTaxNumberFile" target="_blank">{{"VAT税号证书"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="DE欧盟证书：" v-if="detailInfo.countryCode === 'DE'">
          <span v-if="detailInfo.deEuCertificate!==''">
            <a :href="detailInfo.deEuCertificate && detailInfo.deEuCertificate.slice(0,5)=='http:'?(detailInfo.deEuCertificate.slice(0,4)+'s'+detailInfo.deEuCertificate.slice(4)):detailInfo.deEuCertificate" target="_blank">{{"DE欧盟证书"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="税务副本：" v-if="detailInfo.countryCode === 'DE'">
          <span v-if="detailInfo.vatTaxNumberCopyFile!==''">
            <a :href="detailInfo.vatTaxNumberCopyFile && detailInfo.vatTaxNumberCopyFile.slice(0,5)=='http:'?(detailInfo.vatTaxNumberCopyFile.slice(0,4)+'s'+detailInfo.vatTaxNumberCopyFile.slice(4)):detailInfo.vatTaxNumberCopyFile" target="_blank">{{"税务副本"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <!-- 德国 end-->
        <FormItem label='注册授权书：' v-if="detailInfo.countryCode=='IT'||detailInfo.countryCode=='FR'">
          <span v-if="submitForm.registrationAuthorization==''">{{"暂无"}}</span>
          <a :href="submitForm.registrationAuthorization && submitForm.registrationAuthorization.slice(0,5)=='http:'?(submitForm.registrationAuthorization.slice(0,4)+'s'+submitForm.registrationAuthorization.slice(4)):submitForm.registrationAuthorization" target="_blank" v-if="submitForm.registrationAuthorization!==''">{{"注册授权书"}}</a>
        </FormItem>
        <FormItem label="VAT税号文件：" v-if="detailInfo.countryCode !== 'DE'">
          <span v-if="detailInfo.vatTaxNumberFile !==''">
            <a :href="detailInfo.vatTaxNumberFile && detailInfo.vatTaxNumberFile.slice(0,5)=='http:'?(detailInfo.vatTaxNumberFile.slice(0,4)+'s'+detailInfo.vatTaxNumberFile.slice(4)):detailInfo.vatTaxNumberFile" target="_blank">{{"VAT税号文件"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="EORI文件：" v-if="detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
          <span v-if="detailInfo.eoriNumberFile!==''">
            <a :href="detailInfo.eoriNumberFile && detailInfo.eoriNumberFile.slice(0,5)=='http:'?(detailInfo.eoriNumberFile.slice(0,4)+'s'+detailInfo.eoriNumberFile.slice(4)):detailInfo.eoriNumberFile" target="_blank">{{"EORI文件"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="VAT证书：" v-if="detailInfo.countryCode !== 'DE' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
          <span v-if="detailInfo.vatCertificate!==''">
            <a :href="detailInfo.vatCertificate && detailInfo.vatCertificate.slice(0,5)=='http:'?(detailInfo.vatCertificate.slice(0,4)+'s'+detailInfo.vatCertificate.slice(4)):detailInfo.vatCertificate" target="_blank">{{"VAT证书"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="gateway 账号：" v-if="detailInfo.countryCode=='GB'">
          <span v-if="detailInfo.gatewayId !== ''">{{detailInfo.gatewayId}}</span>
          <span v-else>
            <span>暂无</span>
          </span>
        </FormItem>
        <FormItem label="gateway 密码：" v-if="detailInfo.countryCode=='GB'">
          <span v-if="detailInfo.gatewayPassword">{{detailInfo.gatewayPassword}}</span>
          <span v-else>暂无</span>
        </FormItem>
        <FormItem label="密钥：" v-if="detailInfo.countryCode=='GB'">
          <span v-if="detailInfo.secretKey">{{detailInfo.secretKey}}</span>
          <span v-else>暂无</span>
        </FormItem>
        <FormItem label="欧盟税号证书：" v-if="detailInfo.countryCode=='ES'">
          <span v-if="detailInfo.vatCertificate!==''">
            <a :href="detailInfo.vatCertificate && detailInfo.vatCertificate.slice(0,5)=='http:'?(detailInfo.vatCertificate.slice(0,4)+'s'+detailInfo.vatCertificate.slice(4)):detailInfo.vatCertificate" target="_blank">{{"欧盟税号证书"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="海牙文件：" v-if="detailInfo.countryCode=='ES'">
          <span v-if="detailInfo.hyFile!==''">
            <a :href="detailInfo.hyFile && detailInfo.hyFile.slice(0,5)=='http:'?(detailInfo.hyFile.slice(0,4)+'s'+detailInfo.hyFile.slice(4)):detailInfo.hyFile" target="_blank">{{"海牙文件"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
        <FormItem label="税局账号：" v-if="detailInfo.countryCode=='SA' || detailInfo.countryCode=='AE'">
          <span v-if="detailInfo.gatewayId !== ''">{{detailInfo.gatewayId}}</span>
          <span v-else>
            <span>暂无</span>
          </span>
        </FormItem>
        <FormItem label="密码：" v-if="detailInfo.countryCode=='SA' || detailInfo.countryCode=='AE'">
          <span v-if="detailInfo.gatewayPassword">{{detailInfo.gatewayPassword}}</span>
          <span v-else>暂无</span>
        </FormItem>
        <FormItem label="法国税号证书：" v-if="detailInfo.countryCode=='FR'">
          <span v-if="detailInfo.frTaxCertificate">
            <a :href="detailInfo.frTaxCertificate && detailInfo.frTaxCertificate.slice(0,5)=='http:'?(detailInfo.frTaxCertificate.slice(0,4)+'s'+detailInfo.frTaxCertificate.slice(4)):detailInfo.frTaxCertificate" target="_blank">{{"法国税号证书"}}</a>
          </span>
          <span v-else>{{'暂无'}}</span>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" @click="showTaxDetail=false">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import waitUpload from '@/view/module/taxService/serviceRegManage/components/waitUpload';
import * as API from '@/api/taxService/regAndDeclare.js';
import * as API2 from '@/api/taxService/taxModule.js';
import { getTaxCountry } from '@/api/taxService/common.js';
import taxModal from '@/view/module/taxService/serviceManage/taxModal';
import submitDeclareGB from '@/view/module/taxService/serviceRegManage/components/submitDeclareGB';
import zeroDeclare from '@/view/module/taxService/serviceRegManage/components/zeroDeclare';
import annalsDE from '@/view/module/taxService/components/annalsDE';
import detailInfo from '@/view/module/taxService/serviceManage/declareServiceDetail';
import taxModal1 from '@/view/module/taxService/serviceManage/taxModal';
import annalsDE1 from '@/view/module/taxService/components/annalsDE';
export default {
  name: 'mainList',
  components: {
    waitUpload,
    annalsDE1,
    taxModal1,
    detailInfo,
    taxModal,
    submitDeclareGB,
    zeroDeclare,
    annalsDE,
  },
  data() {
    return {
      formEditor: {},
      editorModal: false,
      detailInfo: {},
      submitForm: {},
      showTaxDetail: false,
      declareModalShow: false,
      zeroDeclareModalShow: false,
      isDetailShow: false,
      isDetailShow1: false,
      searchForm: {
        status: '-1',
        searchContent: '',
        countryCode: '',
        serviceStatus: '',
      },
      serviceStatusList: [
        {
          status: '0',
          serviceStatus: '未购买',
        },
        {
          status: '1',
          serviceStatus: '正常',
        },
        {
          status: '2',
          serviceStatus: '待续费',
        },
        {
          status: '3',
          serviceStatus: '注销税号',
        },
        {
          status: '4',
          serviceStatus: '已转出',
        },
      ],
      date: '',
      countryList: [],
      tableLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '服务号',
          key: 'serverNo',
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this;
            return h('span', self.progressStatus[params.row.progressBar]);
          },
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80,
        },
        {
          title: '公司名称',
          key: 'companyName',
        },
        {
          title: '服务名称',
          key: 'productFunctionCode',
          render(h, params) {
            let serviceName = '',
              code = params.row.productFunctionCode;
            serviceName =
              code == 1
                ? '税务注册'
                : code == 2
                ? '转代理+申报'
                : code == 3
                ? '税务补缴'
                : code == 4
                ? '转代理'
                : code == 5
                ? '注册+申报'
                : '';
            return h('span', serviceName);
          },
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          width: 114,
        },
        {
          title: '跟进人',
          key: 'followUserName',
        },
        {
          title: '申报次数',
          key: 'declareCout',
        },
        {
          title: '申报周期',
          render: (h, params) => {
            let self = this;
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '',
              endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '');
          },
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
          title: '备注',
          slot: 'remark',
          width: 100,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200,
        },
      ],
      tableData: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      auditModal: false,
      taxModalShow: false,
      taxModalShow1: false,
      isAudit: '1',
      remark: '',
      workId: '',
      detailId: '',
      progressBar: '',
      computeId: '',
      serviceId: '',
      progressStatus: {
        0: '待上传资料',
        1: '待审核资料',
        2: '待续费',
        3: '注册中',
        4: '注册完成',
        5: '待授权海牙认证',
        6: '海牙认证中',
        7: '待授权注册税号',
        8: '资料驳回',
        28: '待上传资料(转代理)',
        29: '转代理中',
        19: '未开始',
        20: '未开始(已开始报税)',
        21: '待提交报税资料',
        18: '申报中',
        22: '待缴纳税金',
        23: '待审核申报',
        24: '申报驳回',
        25: '申报完成（客户端完成）',
        26: '申报失败',
        27: '申报完成(整体完成)',
        31: '转代理资料待审核',
        32: '转代理资料驳回',
        33: '税金待审核',
        34: '缴税凭证被驳回',
        35: '待上传零申报凭证',
      },
      declareStatus: {
        0: '未购买',
        1: '正常',
        2: '待续费',
        3: '注销税号',
        4: '已转出',
      },
      userId: '',
      selectList: [],
      goAnnalsDe: false,
      goAnnalsDe1: false,
      annalsId: '',
      baseData: {},
    };
  },
  mounted() {
    this.getList();
    this.getCountryList();
    this.authorizedCallBack();
  },
  methods: {
    //已处理
    allFinish(row) {
      this.$Modal.confirm({
        title: '处理确认',
        content: '确认后异常工单将从列表移除，是否继续？',
        onOk: () => {
          API.chuliAbnormal({ workId: row.id }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('提交成功');
              this.getList();
            }
          });
        },
      });
    },
    //添加备注
    editRemark() {
      let data = {
        workId: this.formEditor.id,
        remark: this.formEditor.remark,
      };
      API.subRemark(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功');
          this.getList();
        }
      });
    },
    //查看税号信息
    toTaxDetail(row) {
      API.getRegDetailInfo({ serviceId: row.serviceId }).then((res) => {
        if (res.code == 0) {
          this.showTaxDetail = true;
          this.detailInfo = res.data.orderServices;
          if (JSON.stringify(res.data.registerWorkOrder) != '{}') {
            this.submitForm = res.data.registerWorkOrder;
          }
        }
      });
    },
    turnToOut(row) {
      this.$Modal.confirm({
        title: '转出确认',
        content: '转出后该公司将不能在本平台继续报税，是否确认转出申报？',
        onOk: () => {
          // console.log('确认转出')
          API.changeServiceStatusTransferredOut({ serviceId: row.serviceId }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('转出申报成功');
              this.getList();
            }
          });
        },
      });
    },
    //获取列表
    getList() {
      this.tableLoading = true;
      // if(this.searchForm.status == -1){
      //   this.searchForm.status = ''
      // }
      let params = { ...this.searchForm, ...this.pageInfo };
      if (params.status == -1) {
        params.status = '';
      }
      API.getAbnormalProductInfo(params)
        .then((res) => {
          this.tableLoading = false;
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.listTotal = Number(res.data.total);
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch((err) => console.log(err));
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    //搜索列表
    searchList(type) {
      this.pageInfo.page = 1;
      this.getList();
    },
    //重置列表
    resetList() {
      (this.searchForm = {
        status: '-1',
        searchContent: '',
        countryCode: '',
        serviceStatus: '',
      }),
        (this.pageInfo = {
          limit: 10,
          page: 1,
        }),
        (this.date = '');
      this.getList();
    },
    //工单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //选择tab状态
    tabsChange(name) {
      // if(name == -1) name = ''
      // console.log(name)
      this.pageInfo.page = 1;
      this.searchForm.status = name;
      this.getList();
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
    //
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.getList();
    },
    //查看详情
    toDetail(row) {
      this.isDetailShow = true;
      this.detailId = row.serviceId;
      this.progressBar = row.progressBar;
      this.userId = row.userId;
    },
    toDetail1(id, countryCode, userId) {
      this.serviceId = id;
      this.isDetailShow1 = true;
      this.detailId = id;
      this.countryCode = countryCode;
      this.userId = userId;
    },
    //发送提醒
    sendMessage(rowData) {
      let params = {
        serviceId: rowData.id,
      };
      this.$Modal.confirm({
        title: '是否发送短信',
        content: '',
        onOk: () => {
          API.sendMessage(params)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('发送提醒成功');
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch((err) => console.log(err));
        },
        onCancel: () => {},
      });
    },
    refreshList() {
      this.isDetailShow = false;
      this.taxModalShow = false;
      this.getList();
    },
    refreshList1() {
      this.isDetailShow1 = false;
      this.taxModalShow1 = false;
      this.getList();
    },
    showTaxModal(id, serviceId) {
      this.computeId = id;
      this.serviceId = serviceId;
      this.isDetailShow = false;
      this.taxModalShow = true;
    },
    showTaxModal1(id, serviceId) {
      this.computeId = id;
      this.serviceId = serviceId;
      this.isDetailShow1 = false;
      this.taxModalShow1 = true;
    },
    showAnnalsModal(id, baseData) {
      this.isDetailShow = false;
      this.goAnnalsDe = true;
      this.annalsId = id;
      this.baseData = baseData;
    },
    showAnnalsModal1(id, baseData) {
      this.isDetailShow1 = false;
      this.goAnnalsDe1 = true;
      this.annalsId = id;
      this.baseData = baseData;
    },
    //审核操作
    handleAudit(rowData) {
      this.auditModal = true;
      this.workId = rowData.workId;
    },
    //确认审核
    sureAudit() {
      let params = {
        workId: this.workId,
        status: this.isAudit,
        remark: this.remark,
      };
      if (this.isAudit == 1) {
        delete params.remark;
      }
      API.handleAudit(params)
        .then((res) => {
          console.log('审核操作res', res);
          if (res.code == 0) {
            this.$Message.success('审核成功');
            this.auditModal = false;
            this.getList();
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch((err) => console.log(err));
    },
    // 获取url参数的方法
    GetQueryValue(queryName) {
      var query = decodeURI(window.location.search.substring(1));
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == queryName) {
          return pair[1];
        }
      }
      return null;
    },
    // 获取Url参数
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return false;
    },
    // 授权回调
    authorizedCallBack() {
      var that = this;
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.getQueryVariable('code');
        var state = this.getQueryVariable('state');
        API2.getwayCallback({
          code: code,
          state: state,
          location: 1,
        })
          .then((res) => {})
          .catch((error) => {});
        var url = window.location.href;
        url = url.split('?')[0];
        window.history.pushState({}, 0, url);
      }
    },
    submitDeclareGBModel(obj) {
      this.declareModalShow = obj.state;
    },
    zeroDeclareModel(obj) {
      this.zeroDeclareModalShow = obj.state;
    },
    declareShow() {
      
      this.declareModalShow = true;
    },
    zeroDeclareShow() {
      this.zeroDeclareModalShow = true;
    },
    selectChange(val) {
      this.selectList = val;
    },
    //批量提醒发送短信
    batchRemined() {
      // console.log(this.selectList)
      if (this.selectList.length < 0) {
        this.$Message.info('请先选择服务');
        return;
      }
      let ids = '';
      this.selectList.map((item, index) => {
        ids += item.id + ',';
      });
      let data = {
        ids,
        progressBar: this.searchForm.status,
      };
      API2.batchMessageReg(data).then((res) => {
        if (res.code === 0) {
          this.$Message.success('批量发送短信成功');
          this.selectList = [];
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
// div{
//     cursor: pointer;
// }
</style>