<template>
  <div class="container">
    <div class="oAheader">
      <el-card v-if="isOaDetail" style="margin-bottom: 10px">
        <span class="return-box" @click="backList"><i class="el-icon-arrow-left"></i>返回列表</span>
      </el-card>
    </div>
    <div class="top-container">
      <div class="left-container" :class="{ 'app-container-fold': oaFold }">
        <div class="title">
          <div>商标详情</div>
          <div class="fold" v-if="isOaDetail" @click="oaFold = !oaFold">{{ oaFold ? '展开' : '收缩' }}</div>
        </div>
        <div class="scroll-container" :key="workerDetailKey">
          <div class="tab-box" v-if="rowInfo.nodeCode != 'NODE0033' && rowInfo.nodeCode != 'NODE0034'">
            <span class="tab-span" @click="tabs = 1" :class="tabs == 1 ? 'tab-active' : ''">商标信息</span>
            <span class="tab-span" @click="tabs = 2" :class="tabs == 2 ? 'tab-active' : ''">文件信息</span>
            <span class="tab-span" v-if="!isOaDetail" @click="tabs = 3" :class="tabs == 3 ? 'tab-active' : ''">客户上传的材料</span>
            <span class="tab-span" @click="tabs = 4" :class="tabs == 4 ? 'tab-active' : ''">商标局商标信息</span>
            <span class="tab-span" @click="tabs = 5" :class="tabs == 5 ? 'tab-active' : ''">商标局商标文件</span>
          </div>
          <div v-if="tabs == 1">
            <div class="details-box">
              <div v-if="!isOaDetail && this.rowInfoDetail">
                <div class="box-title">商标注册信息</div>
                <div class="box-bottom">
                  <row>
                    <Col :span="12">
                      <p>
                        <span class="left-item">受理号：</span><span class="right-item"> {{ this.rowInfoDetail.acceptNum || '暂无数据' }}</span>
                      </p>
                    </Col>

                    <Col :span="12">
                      <p>
                        <span class="left-item">备案验证码：</span><span class="right-item"> {{ this.rowInfoDetail.verificationCode || '暂无数据' }} </span>
                      </p>
                    </Col>

                    <Col :span="24">
                      <p>
                        <span class="left-item">注册号：</span><span class="right-item">{{ this.rowInfoDetail.registerNo || '暂无数据' }}</span>
                      </p>
                    </Col>
                  </row>
                </div>
              </div>
            </div>
            <div class="details-box" v-for="(item, index) in workflowColumns" :key="index">
              <div v-if="item.moduleName == '商标分类' && trademarkCategoryList.length > 0">
                <div class="box-title">{{ item.moduleName }}</div>
                <div class="box-bottom" v-for="(categoryItem, categoryIndex) in trademarkCategoryList" :key="categoryIndex">
                  <p>
                    <span class="left-item">商标分类：</span>
                    <span class="right-item">{{ categoryItem.category1Num }}&nbsp;{{ categoryItem.category1Name }}</span>
                  </p>
                  <p>
                    <span class="left-item">商标小类名称：</span>
                  </p>
                  <div class="info-table">
                    <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
                      <tr class="header">
                        <th style="width: 68px">序号</th>
                        <th style="width: 206px" v-show="!showCNItem(categoryItem.listTrademarkCategory2)">商标小类（中文）</th>
                        <th style="width: 428px" v-if="workOrderInfo.countryCode !== 'CN'">商标小类（英文）</th>
                        <th style="width: 428px" v-if="workOrderInfo.countryCode === 'KR'">商标小类（韩文）</th>
                        <th style="width: 428px" v-if="workOrderInfo.countryCode === 'DE'">商标小类（德文）</th>
                        <th style="width: 428px" v-if="workOrderInfo.countryCode == 'JP'">商标小类（日文）</th>
                        <th style="width: 428px" v-if="workOrderInfo.countryCode == 'JP'">类似群组</th>
                        <th style="width: 166px; border-right: none" v-if="workOrderInfo.countryCode == 'US'">指定关键词</th>
                      </tr>
                      <tr v-show="subItem.category2NameEn !== '' || subItem.category2Name !== ''" v-for="(subItem, index) in categoryItem.listTrademarkCategory2" :key="index">
                        <td style="width: 68px">{{ index + 1 }}</td>
                        <td style="width: 206px" v-show="subItem.category2Name || subItem.category2NameEn">{{ subItem.category2Name || subItem.category2NameEn }}</td>
                        <td style="width: 428px" v-if="workOrderInfo.countryCode !== 'CN'">{{ subItem.category2NameEn }}</td>
                        <td style="width: 428px" v-if="workOrderInfo.countryCode === 'KR'">{{ subItem.categoryNameMore || '--' }}</td>
                        <td style="width: 428px" v-if="workOrderInfo.countryCode === 'DE'">{{ subItem.categoryNameMore || '--' }}</td>
                        <td style="width: 428px" v-if="workOrderInfo.countryCode == 'JP'">{{ subItem.categoryNameJp || '--' }}</td>
                        <td style="width: 428px" v-if="workOrderInfo.countryCode == 'JP'">{{ subItem.similarGroup || '--' }}</td>
                        <td style="width: 166px; border-right: none" v-if="workOrderInfo.countryCode == 'US'">
                          <span v-if="subItem.keyword">{{ subItem.keyword[0] }}</span>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="box-title">{{ item.moduleName }}</div>
                <div class="box-bottom">
                  <Row>
                    <div v-for="(vv, ii) in setColumns(item.columns)" :key="ii">
                      <Col :span="12" v-if="vv.keyName != 'marketHref' && vv.keyName != 'companyLegalPersonSign'">
                        <p style="display: flex">
                          <span class="left-item">{{ vv.keyLabel }}：</span>
                          <span class="right-item item-box" v-if="(vv.keyName == 'useEvidence' || vv.keyName == 'useProductImg') && vv.keyNameValue != ''">
                            <div>
                              <a :href="replaceHttps(q.fileUrl)" target="_blank" style="color: #1890ff" v-for="(q, w) in JSON.parse(vv.keyNameValue)" :key="w"><img src="@/assets/images/infoDetail/bainji-blue.svg" alt="" />{{ q.fileName }}</a>
                            </div>
                          </span>
                          <span class="right-item item-box" v-else-if="+vv.inputType === 4 && vv.keyNameValue != ''">
                            <div>
                              <a :href="replaceHttps(aa.fileUrl || aa)" target="_blank" style="color: #1890ff" v-for="(aa, cc) in keyNameValueFilter(vv.keyNameValue)" :key="cc"><img src="@/assets/images/infoDetail/bainji-blue.svg" alt="" />{{ vv.keyLabel }}</a>
                            </div>
                          </span>
                          <span class="right-item" v-else-if="+vv.inputType === 5 || +vv.inputType === 2">{{ selectReturnFunc(vv) || vv.keyNameValue }}</span>
                          <span class="right-item" v-else-if="vv.keyName == 'trademarkNameEn'" v-html="vv.keyNameValue"></span>
                          <span class="right-item" v-else>{{ JSON.stringify(vv.keyNameValue) == '{}' ? '暂无数据' : vv.keyNameValue }}</span>
                        </p>
                      </Col>
                      <Col :span="24" v-if="vv.keyName == 'companyLegalPersonSign'">
                        <div v-if="vv.keyName == 'companyLegalPersonSign'">
                          <p>
                            <span class="left-item">{{ vv.keyLabel }}：</span>
                          </p>
                          <img :src="vv.keyNameValue" alt="" style="width: 300px; height: 200px" />
                        </div>
                      </Col>
                      <Col :span="24" v-if="vv.keyName == 'marketHref'">
                        <div v-if="vv.keyName == 'marketHref'">
                          <p>
                            <span class="left-item">销售链接：</span>
                          </p>
                          <div class="info-table">
                            <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
                              <tr class="header">
                                <th style="width: 68px">序号</th>
                                <th style="width: 402px">销售链接</th>
                                <th style="width: 400px; border-right: none">指定商标小类</th>
                              </tr>
                              <tr v-for="(item, index) in marketHrefList" :key="index">
                                <td style="width: 68px">{{ index + 1 }}</td>
                                <td style="width: 402px">
                                  <p>{{ item.marketHref }}</p>
                                </td>
                                <td style="width: 400px; border-right: none">
                                  <p>
                                    {{ item.category2NameEn }}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
          </div>
          <!-- 公共详情文件信息 -->
          <my-details v-show="tabs == 2" :oaFileList="oaFileList" :registrationAuthorizationList="registrationAuthorizationList"></my-details>
          <!-- oa文件关联信息 -->
          <relation-oa-file v-if="tabs == 2 && isOaDetail" :tableTitle="'关联文件信息：'"></relation-oa-file>
          <div v-if="tabs == 3">
            <!-- 平台审核和审核授权书[1, 4].includes(workOrderInfo.serviceProgress),是否需要上传授权书authFlag -->
            <div class="info-table" v-if="answerFileList.length > 0 || userAuthFlag">
              <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
                <tr class="header">
                  <th style="width: 68px">序号</th>
                  <th style="width: 310px">文件</th>
                  <th style="width: 200px">备注</th>
                  <th style="width: 170px">上传时间</th>
                  <th v-if="registrationAuthorizationList.length" style="width: 270px">驳回原因</th>
                  <th style="width: 140px; border-right: none">操作</th>
                </tr>
                <tr v-for="(item, index) in answerFileList" :key="index">
                  <td style="width: 68px">{{ index + 1 }}</td>
                  <td style="width: 310px">
                    <a :disabled="isCancel" :href="replaceHttps(item.answerFile)" target="_blank" style="color: #00a3ff">{{ initFileName(item.answerFile) }}（可点击查看）</a>
                  </td>
                  <td style="width: 200px">{{ item.remark || '答复审核意见 ' }}</td>
                  <td style="width: 170px">{{ item.answerDate || '无' }}</td>
                  <td v-if="registrationAuthorizationList.length">--</td>
                  <td style="width: 140px; border-right: none" class="operation-td">
                    <div>
                      <el-link
                        :disabled="isCancel"
                        type="primary"
                        :underline="false"
                        @click="
                          answerInfo = item;
                          auditModal = true;
                        "
                        v-if="item.status == 6"
                        v-show="hasAuthority('U1_9')"
                        >平台审核</el-link
                      >
                    </div>
                    <div>
                      <el-link
                        :disabled="isCancel"
                        type="primary"
                        :underline="false"
                        @click="
                          answerInfo = item;
                          auditModal = true;
                        "
                        v-if="item.status == 7"
                        v-show="hasAuthority('U1_10')"
                        >律师审核</el-link
                      >
                    </div>
                  </td>
                </tr>
                <!-- 商标注册授权书客户上传的文件 -->
                <template v-if="userAuthFlag">
                  <tr v-for="(item, index) in registrationAuthorizationList" :key="item.columnId">
                    <td>{{ answerFileList.length + index + 1 }}</td>
                    <td>
                      <a v-if="item.keyNameValue && JSON.stringify(item.keyNameValue) !== '{}'" :href="item.keyNameValue" target="_blank" style="color: #00a3ff">{{ item.keyLabel }}（点击查看） </a>
                    </td>
                    <td>--</td>
                    <td>--</td>
                    <td>{{ workOrderInfo.rejectInfo ? workOrderInfo.rejectInfo : '无' }}</td>
                    <td>--</td>
                  </tr>
                </template>
              </table>
            </div>
            <div class="null-file" v-else>
              <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
              <p class="first-p">暂无文件</p>
            </div>
          </div>
          <!-- 商标局信息 -->
          <trademark-office-info v-if="tabs === 4" :remarkResultInfo="remarkResultInfo || {}" />
          <!-- 商标局文件 -->
          <trademark-office-file v-if="tabs === 5" :trademarkOfficeFileList="trademarkOfficeFileList" />
        </div>
      </div>
      <div class="right-container" :class="{ 'info-block-wrapper-fold': fold || oaFold }" v-if="isOaDetail">
        <rightInfo v-if="JSON.stringify(workOrderInfo) != '{}'" :workOrderInfo="workOrderInfo" :userInfo="userInfo" :operationLog="operationLog"></rightInfo>
      </div>
    </div>
    <!-- 审核 -->
    <Modal v-model="auditModal" :title="answerInfo.status == 24 ? '平台审核' : answerInfo.status == 25 ? '律师审核' : ''">
      <div v-if="answerInfo.status == 24">
        <p style="font-weight: 700">注意：审核以客户上传的最新材料为准</p>
        <p>审核通过后，将由律师审核；资料不对，被驳回的，客户需按照要求修改资料</p>
      </div>
      <p v-if="answerInfo.status == 25">律师审核通过，即已撰写官文回复商标局；资料不对，则驳回，填写驳回原因，客户需按照要求修改资料</p>
      <RadioGroup v-model="auditType" style="margin: 20px 0">
        <Radio label="0">审核通过</Radio>
        <Radio label="1">资料不对，驳回</Radio>
      </RadioGroup>
      <div v-if="auditType == 1">
        <p>驳回原因：</p>
        <Input v-model="rejectAnswerReason" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入驳回原因"></Input>
      </div>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="auditModal = false">取消</el-button>
        <el-button type="primary" @click="auditFunc">确认</el-button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';
import { getBusinessLogListByNo } from '@/api/newApi/common.js';
import RelationOaFile from './relationOaFile';
import RightInfo from '../../components/rightInfo';
import TrademarkOfficeInfo from './trademarkOfficeInfo';
import TrademarkOfficeFile from './trademarkOfficeFile';
import { initFileNameFunc } from '../../util.js';
import { log } from 'mathjs';
export default {
  props: ['workflowColumnsDetail', 'rowInfoDetail', 'oaFileListDetail', 'workOrderInfoDetail', 'fold', 'isCancel', 'remarkResultInfo'],
  components: {
    RelationOaFile,
    RightInfo,
    MyDetails: () => import('./details/index.vue'),
    TrademarkOfficeInfo,
    TrademarkOfficeFile,
  },
  provide() {
    return {
      workerDetailGetList: this.getList,
    };
  },
  data() {
    return {
      formInfo: {},
      useEvidenceList: [],
      usrProductImgList: [],
      status: '',
      tabs: 1,
      fileList: [],
      trademarkCategoryList: [],
      operateType: 0,
      helpFileList: [],
      formFile: {
        fileType: '',
        fileUrl: '',
        officialDate: '',
      },
      auditType: '0',
      oaFileId: '',
      defaultFileList: [],
      serverNo: '',
      rejectAnswerReason: '',
      answerFileList: [],
      answerInfo: {},
      auditModal: false,
      serviceList: [],
      serviceItemList: [],
      isOaDetail: false,
      serviceId: '',
      operationLog: [],
      userInfo: {},
      workflowColumns: [],
      rowInfo: {},
      oaFileList: [],
      workOrderInfo: {},
      workerDetailKey: 0,
      oaFold: false,
      registrationAuthorizationList: [],
    };
  },
  computed: {
    userAuthFlag() {
      //是否显示用户上传授权书
      if (this.workOrderInfoDetail.nodeCode === 'NODE0035') {
        return this.registrationAuthorizationList.length > 0 && this.workOrderInfoDetail.authFlag && ![1, 4].includes(this.workOrderInfoDetail.serviceProgress);
      }
      return this.registrationAuthorizationList.length > 0 && this.workOrderInfoDetail.authFlag;
    },
    marketHrefList() {
      let returnList = '';
      this.workflowColumns.map((item) => {
        if (item.moduleName == '商标使用证据') {
          item.columns.map((vv) => {
            // console.log('销售链接',vv);
            if (vv.keyName == 'marketHref') {
              // console.log('marketHref0',vv.keyNameValue);
              try {
                returnList = JSON.parse(vv.keyNameValue);
              } catch {}
            }
          });
        }
      });
      return returnList;
    },
    // 商标局文件
    trademarkOfficeFileList() {
      return (this.remarkResultInfo.remarkFiles && JSON.parse(this.remarkResultInfo.remarkFiles).data) || [];
    },
  },
  watch: {
    oaFileListDetail(val, oldVal) {
      if (val) {
        this.oaFileList = val;
        this.getDetailFun();
      }
    },
    'rowInfoDetail.nodeCode'() {
      this.getList();
    },
  },
  methods: {
    keyNameValueFilter(val) {
      let arr = val;
      try {
        arr = JSON.parse(val);
      } catch (error) {
        if (typeof val == 'string') {
          arr = [val];
        }
      }
      return arr;
    },
    async getList() {
      this.serviceId = this.$route.query.serviceId;
      if (this.$route.query.isOaDetail) {
        this.isOaDetail = true;
        let res = await API.oaWorkorderDetailAPI({
          serviceId: this.serviceId,
        });
        this.workflowColumns = [...res.data.workflowColumns];
        this.oaFileList = res.data.fileOaWorkOrderList;
        this.workOrderInfo = res.data.trademarkOrderServiceInfoVO;
        this.userInfo = res.data.trademarkOrderUserInfoVO;
        this.getOperationLog(this.workOrderInfo.serviceNo, 2);
        this.tabs = 2;
      } else {
        this.workflowColumns = [...this.workflowColumnsDetail];
        this.rowInfo = this.rowInfoDetail;
        this.oaFileList = this.oaFileListDetail;
        this.workOrderInfo = this.workOrderInfoDetail;
      }
      this.getDetailFun();
      this.workerDetailKey = new Date().getTime();
    },
    auditFunc() {
      if (this.auditType == 0) {
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 6 ? '2' : this.answerInfo.status == 7 ? '4' : '',
        };
        API.passAnswerAPI(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('notice');
          }
        });
      } else if (this.auditType == 1) {
        if (this.rejectAnswerReason == '') {
          this.$Message.info('请填写驳回原因');
          return;
        }
        let data = {
          oaFileId: this.answerInfo.id,
          operationType: this.answerInfo.status == 6 ? '1' : this.answerInfo.status == 7 ? '3' : '',
          reason: this.rejectAnswerReason,
        };
        API.rejectAnswerAPI(data).then((res) => {
          if (res.code == 0) {
            this.auditModal = false;
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.$emit('notice');
          }
        });
      }
    },

    initFileName: (val) => initFileNameFunc(val),

    showCNItem(list) {
      return list && list.findIndex((item) => item.category2Name || item.category2NameEn) == -1 ? true : false;
    },
    backList(type) {
      this.$router.push({ path: '/intellectualProperty/OA/index' });
    },

    /**
     * 修复申请人证件bug
     * 重新转json数组
     */
    setColumns(data) {
      // console.log(data);
      data.forEach((element) => {
        let keyName = element.keyName,
          keyNameValue = element.keyNameValue,
          inputType = element.inputType;
        if (keyName == 'useEvidence' || keyName == 'useProductImg') {
          if (!this.isJson(keyNameValue)) {
            element.keyNameValue = JSON.stringify(keyNameValue);
          }
        } else if (+inputType === 4 && keyNameValue != '' && keyName != 'trademarkCategory') {
          if (this.isJson(keyNameValue)) {
            // console.log("是json", keyNameValue);
            if (!Array.isArray(JSON.parse(keyNameValue))) element.keyNameValue = JSON.stringify([JSON.parse(keyNameValue)]);
          } else if (typeof keyNameValue == 'string') {
            if (keyNameValue.substr(0, 5) == 'http:') {
              element.keyNameValue = JSON.stringify([keyNameValue]);
            }
          }
        }
      });
      return data;
    },

    /* 判断 是不是json格式
     */
    isJson(data) {
      try {
        JSON.parse(data);
        return true;
      } catch (e) {
        return false;
      }
    },
    // 初始化工单资料
    getControlData(datalist) {
      let childList = datalist.filter((item) => item.columnPid != ''),
        newData = datalist.filter((item) => item.columnPid == ''),
        nowData = [...newData];
      newData.map((item) => {
        childList.map((vv) => {
          if (vv.columnPid == item.columnId && vv.columnOption.includes(item.keyNameValue)) {
            nowData.push(vv);
          }
        });
      });

      return nowData.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
    //获取工单资料
    getDetailFun() {
      // console.log(this.workOrderInfo);
      this.registrationAuthorizationList = [];
      this.workflowColumnsDetail.forEach((modules) => {
        modules.columns.forEach((columns) => {
          //上传授权书 固定三个字段
          if (['registrationAuthorization', 'registrationAuthorization2', 'registrationAuthorization3'].includes(columns.keyName)) {
            this.registrationAuthorizationList.push(columns);
          }
        });
      });
      this.workflowColumns.map((item, i) => {
        item.columns = this.getControlData(item.columns);
        if (item.moduleName == '商标分类') {
          if (item.columns[0].keyNameValue != '') {
            this.trademarkCategoryList = JSON.parse(item.columns[0].keyNameValue);
          }
        }
      });
      this.fileList = [];
      this.answerFileList = [];
      this.oaFileList.map((item) => {
        let obj = { ...item };
        obj.overdue = false;
        if (new Date(item.officialExpirationDate) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
          obj.overdue = true;
        }
        this.fileList.push(obj);

        if (item.answerFile != '') {
          this.answerFileList.push(item);
        }
      });
    },

    // select回显
    selectReturnFunc(data) {
      let text = '',
        optionList = JSON.parse(data.info.replace(/\'/g, '"')).groups,
        selecd = optionList.filter((item) => {
          return item.value == data.keyNameValue;
        });
      if (selecd.length > 0) text = selecd[0].label;
      return text;
    },

    // 获取操作日志
    getOperationLog(businessNo, businessType) {
      getBusinessLogListByNo({
        businessNo,
        businessType,
      }).then((res) => {
        if (res.code === 0) {
          this.operationLog = res.data;
        }
      });
    },
  },
  mounted() {
    this.getList();
    console.log('this.workflowColumnsDetail mounted', this.$parent._data.workflowColumns);
  },
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
