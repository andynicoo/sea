<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <!-- NODE0090 提交续费申请
        NODE0091 待开启续费通道
        NODE0092 待续费
        NODE0093 续费中
        NODE0094 续费完成 -->
        <!-- {{ weeeEdit }}
        <el-button size="small" @click="weeeEditChange(false)">weee 开</el-button>
        <el-button size="small" @click="weeeEditChange(true)">weee 关</el-button> -->

        <!-- 提交续费申请 -->
        <template v-if="eprData.orderServices.cureentNodeCode === 'NODE0090'">
          <el-button size="small" type="primary" @click="weeeEditChange(false)" v-if="!weeeEdit">编辑</el-button>
          <el-button size="small" type="primary" @click="submit" v-if="weeeEdit">提交</el-button>
          <el-button size="small" @click="sendRemind">短信提醒</el-button>
        </template>
        <!-- 待续费 -->
        <template v-if="eprData.orderServices.cureentNodeCode === 'NODE0092'">
          <el-button size="small" type="primary" @click="audit">审核</el-button>
        </template>
        <!-- 续费中 -->
        <template v-if="eprData.orderServices.cureentNodeCode === 'NODE0093'">
          <el-button size="small" type="primary" @click="weeeDone">续费完成</el-button>
          <el-button>
            <a @click="_downloadTemp">下载资料</a>
          </el-button>
          <el-button type="primary">
            <a @click="uploadPayDialog = true">上传回执</a>
          </el-button>
        </template>
        <!-- 续费完成 -->
        <template v-if="eprData.orderServices.cureentNodeCode === 'NODE0094'">
          <el-button>
            <a @click="_downloadTemp">下载资料</a>
          </el-button>
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">
              <span>{{ eprData.nodeCodeName }}</span>
            </div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>

          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :countryCode="info.countryCode" :moduleList="dataReview" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />

            <!-- 待续费展示节点 -->
            <div class="titleStyle" style="margin-bottom: 20px" v-if="eprData.orderServices.cureentNodeCode === 'NODE0092'">
              <div class="talkbubble">续费统计</div>
              <div class="triangle"></div>
            </div>
            <div class="el-table el-table--border category-table" v-if="eprData.orderServices.cureentNodeCode === 'NODE0092'">
              <div class="el-table__header-wrapper basic-table">
                <table class="el-table__header">
                  <tbody>
                    <tr>
                      <td class="el-table__cell"><div class="cell">已购类别</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.historyCategory }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">已续品牌</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.historyLogo }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">本次续费类别</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.category }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">本次续费品牌</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.logo }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">未续类别</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.stayCategory }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td class="el-table__cell"><div class="cell">未续品牌</div></td>
                      <td class="el-table__cell">
                        <div class="cell">{{ eprData.renewCategoryStatisticsVO.stayLogo }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div id="relwork">
              <div style="width: 96%" v-for="(item, i) in realWorkList" :key="item.id">
                <div class="titleStyle">
                  <div class="talkbubble">极简工单</div>
                  <div class="triangle"></div>

                  <el-input v-model="item.simpleServiceNo" placeholder="请输入极简工单服务号" v-show="!item.disabled" style="width: 300px" class="mr-10" />
                  <span style="line-height: 32px" v-show="isBatt">回收包额度：</span>
                  <el-input-number style="width: 150px" :min="0" v-model="item.amount" placeholder="请输入金额" v-show="!item.disabled && isBatt" class="mr-10" />

                  <el-link type="primary" target="_blank" :underline="false" v-if="item.disabled" @click="simpleDetail(item.simpleServiceId, item)">{{ item.simpleServiceNo }}</el-link>
                  <el-button @click="changeDisable(i)" class="mr-10" v-show="hasAuthority('J2_33')" v-if="item.disabled">编辑极简工单</el-button>
                  <el-button @click="cancelSimpleWork(item)" v-if="!item.disabled" class="mr-10" v-show="hasAuthority('J2_33')">取消</el-button>
                  <el-button @click="saveWorkNo(item.dataFormatList, item.simpleServiceNo, item.amount, item.id)" v-if="!item.disabled" class="mr-10" v-show="hasAuthority('J2_33')">保存</el-button>
                </div>

                <div style="display: flex">
                  <label class="el-form-item__label form-required" style="width: 110px">
                    <span> {{ isWeee ? 'WEEE产品信息' : '' }} {{ isBatt ? '德国电池法产品信息' : '' }}</span>
                  </label>

                  <div style="width: calc(100% - 110px)">
                    <WeeeRelWorkDtos :value="item.dataFormatList" :disabled="item.disabled" v-if="isWeee" />
                    <BatteryProductDtos :value="item.dataFormatList" :disabled="item.disabled" v-if="isBatt" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备案：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span>{{ eprData.nodeCodeName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ orderServices.serviceName }} <span v-if="orderServicesVO.specName">({{ orderServicesVO.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ orderServices.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServices.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ orderServices.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ eprData.orderServices.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ eprData.orderServices.completionTime }}</span>
            </div>
            <div class="info-block-item" v-if="nodeCode != progressBarObj.WAIT_UPLOAD && nodeCode != progressBarObj.WAIT_REVIEW && nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">合同：</span>
              <span v-if="eprBaseInfo.contract && eprBaseInfo.contract != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.contract)" :key="i" :href="img" type="primary" target="_blank"> 合同 </el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="nodeCode != progressBarObj.WAIT_UPLOAD && nodeCode != progressBarObj.WAIT_REVIEW && nodeCode != progressBarObj.REVIEWED">
              <span class="info-block-title">授权书：</span>
              <span v-if="eprBaseInfo.authCertificate && eprBaseInfo.authCertificate != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.authCertificate)" :key="i" :href="img" type="primary" target="_blank"> 授权书 </el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="nodeCode == 'NODE0365' || nodeCode == 'NODE0366' || nodeCode == progressBarObj.REGISTERING || nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">证书：</span>
              <span v-for="(item, i) in eprBaseInfo.registrationReceipt" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">证书</el-link>
                <!-- <i class="el-icon-delete" @click="deleteCertificate(i)" style="margin-left:6px;font-size:16px;vertical-align:middle;cursor:pointer"></i> -->
              </span>
            </div>
            <div class="info-block-item" v-if="(nodeCode == 'NODE0365' || nodeCode == 'NODE0366' || nodeCode === progressBarObj.REGISTERING || nodeCode === progressBarObj.REGISTER_COMPLETE) && eprBaseInfo.uinStr">
              <span class="info-block-title">UIN号：</span>
              <span>{{ eprBaseInfo.uinStr }}</span>
            </div>
            <div class="info-block-item" v-if="nodeCode == 'NODE0365' || nodeCode == 'NODE0366' || nodeCode == progressBarObj.REGISTERING || nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">账单：</span>
              <span v-for="(item, i) in eprBaseInfo.billFiles" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">账单</el-link>
              </span>
            </div>
            <div class="info-block-item" v-if="nodeCode == progressBarObj.REGISTER_COMPLETE">
              <span class="info-block-title">服务截止时间：</span>
              <span>{{ eprBaseInfo.expirationTime }}</span>
            </div>
          </template>
          <template v-if="JSON.stringify(userInfo) != '{}' && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ userInfo.userLogin.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ orderServices.companyNameZh }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <UploadPayModel :uploadPayDialog.sync="uploadPayDialog" :serviceNo="serviceNo" @refresh="getInfo"> </UploadPayModel>

      <el-dialog title="审核" :visible.sync="examineDialog" width="30%">
        <div>
          <el-form ref="form" :model="examine" label-width="100px">
            <el-form-item label="是否审核通过">
              <el-switch v-model="examine.status" active-color="#13ce66" inactive-color="#dddddd"> </el-switch>
            </el-form-item>
            <el-form-item label="是否发短信">
              <el-switch v-model="examine.sendMsg" active-color="#13ce66" inactive-color="#dddddd"> </el-switch>
            </el-form-item>
            <el-form-item label="审批备注">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="examine.remark"> </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="examineDialog = false">取 消</el-button>
          <el-button type="primary" @click="sureExamine">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { progressBarObj, weeeObj, battObj } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getAuthAgentInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import { saveEpr, submitEpr, sendSmsWeee, eprRejectAuthorization, eprWeeeExport, saveWeeePro, eprCertificate, eprNotice, eprDeclareRel, queryWeee, queryBat, getHistoryList, getBatHistoryList, getWeeeInfo, weeeSave, approvalWeee, completelWeee } from '@/api/newApi/workOrder/EPRManage';
import { getRejectCode } from '@/api/newApi/common';
import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import WeeeRelWorkDtos from './components/weeeRelWorkDtos'; //WEEE产品信息
import BatteryProductDtos from '@/components/WorkOrderComponents/EPRProductItems/batteryProductDtos'; //电池法产品信息
import WeeeProductDtos from '@/components/WorkOrderComponents/EPRProductItems/weeeProductDtos'; //WEEE产品信息
import bus from '@/bus';
export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      // nodeCode: this.$route.query.nodeCode,
      serviceNo: this.$route.query.serviceNo,
      progressBarObj: progressBarObj,
      isEdit: false,
      infos: [],
      info: {},
      uploadPayDialog: false,
      productCategoryList: [
        { value: '热交换器' },
        { value: '显示屏或屏幕大于100平方厘米的显示设备' },
        { value: '照明设备' },
        { value: '大型电子设备（能收缩到最短距离的长度超过50cm）' },
        { value: '小型电子电器设备（能收缩到最短距离的长度不超过50cm）' },
        { value: '小型IT和电信设备（外部尺寸不超过50cm）' },
      ],
      eprBaseInfo: {},
      amount: '',
      isWeee: false,
      isBatt: false,
      authorizedAgentWorkOrder: {},
      orderServices: {},
      orderServicesVO: {},
      simpleServiceNo: '',
      fileObj: '',
      replace: false,
      moduleList: [],
      countrySelectList: [],
      auditDialog: false,
      changeContractAndPower: false,
      changeServiceProviderDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      userInfo: {},
      authorizeFileInfo: [],
      realWorkList: [],
      historyBuyInfoList: [],
      isReplace: false,
      isEditUIN: false,
      copyRealWorkList: [],
      fold: false,
      pageLoading: true,
      weeeEdit: false,
      eprData: {},
      examineDialog: false,
      examine: {
        remark: '',
        sendMsg: false,
        status: true,
      },
    };
  },
  mixins: [mixin, operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    WeeeProductDtos,
    WeeeRelWorkDtos,
    BatteryProductDtos,
  },
  computed: {
    showEdit() {
      return this.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.nodeCode === this.progressBarObj.WAIT_REVIEW;
    },
    showEditWork() {
      return this.nodeCode === this.progressBarObj.REGISTER_COMPLETE && ((this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 || (this.orderServices.serviceName || '').indexOf('德国电池法') != -1);
    },
    showEditRelWork() {
      return (this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 || (this.orderServices.serviceName || '').indexOf('德国电池法') != -1;
    },

    dataReview() {
      if (this.showEditWork) {
        this.moduleList.forEach((pro) => {
          if (pro.moduleCode != 'productInfo') {
            pro.columns.forEach((item) => {
              item.disabled = true;
            });
          } else {
            pro.columns.forEach((item) => {
              if (!item.hasOwnProperty('disabled')) {
                this.$set(item, 'disabled', !this.isEdit);
              } else {
                item.disabled = !this.isEdit;
              }
            });
          }
        });
        return this.moduleList;
      }
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
        });
      });
      return this.moduleList;
    },
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case '1':
          return '待付款';
        case '2':
          return '付款中';
        case '3':
          return '已付款';
        case '4':
          return '已取消';
        default:
          return '';
      }
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    golisk() {
      console.log('..,');
    },
    _downloadTemp() {
      // window.open(this.eprData.eprWorkOrder.registrationReceipt[0]);
      let data = {
        ids: [this.serviceId],
        productFunctionCode: '80',
        nodeCode: this.nodeCode,
      };
      eprWeeeExport(data).then((res) => {
        this.$util.exportExcel(res);
      });
    },
    queryWeee() {
      const fnName = (this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 ? queryWeee : queryBat;
      fnName(this.serviceId).then((res) => {
        res.data.map((item) => {
          item.disabled = true;
          return item;
        });
        this.realWorkList = res.data;
        this.copyRealWorkList = JSON.parse(JSON.stringify(res.data));
      });
    },
    changeDisable(i) {
      this.$set(this.realWorkList[i], 'disabled', false);
    },
    cancelSimpleWork() {
      this.realWorkList = JSON.parse(JSON.stringify(this.copyRealWorkList));
    },
    // 页面数据由两部分组成，WEEE产品信息除外部分是由getAuthAgentInfo完成，WEEE是由EPR续费工单列表详情接口完成
    async getInfo() {
      let eprData = await getWeeeInfo({ serviceNo: this.serviceNo });
      this.eprData = eprData.data;
      getAuthAgentInfo({
        serviceId: this.serviceId,
      }).then((res) => {
        this.info = res.data;

        this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
        this.orderServices = res.data.orderServices;
        this.orderServicesVO = res.data.orderServicesVO;

        this.ifCancel(res.data.orderServices.status);
        const serviceName = this.orderServices.serviceName || '';
        if (serviceName.indexOf('德国WEEE') != -1 || serviceName.indexOf('德国电池法') != -1) {
          this.queryWeee();
          this.getHistoryBuyInfo();
        }
        this.isWeee = serviceName.indexOf('德国WEEE') != -1 ? true : false;
        this.isBatt = serviceName.indexOf('德国电池法') != -1 ? true : false;
        this.userInfo = res.data.userInfoVo;

        // if (res.data.eprWorkOrder.bankPayInfos) {
        //   this.bankPayInfos = JSON.parse(res.data.eprWorkOrder.bankPayInfos);
        // }
        this.moduleList = eprData.data.firstReview;
        // this.authorizeFileInfo = eprData.data.dataReview;
        if (res.data.dataReview.length) {
          this.eprBaseInfo = res.data.eprWorkOrder;
        } else {
          this.getData();
        }
        this._getRejectCode();
        this.getOperationLog(this.serviceNo, 2);
      });
    },
    getData() {
      getNodeField({
        nodeCode: this.$route.query.nodeCode,
        nodeId: '',
        workFlowId: this.orderServices.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    _getRejectCode() {
      getRejectCode({
        nodeCodeName: this.info.nodeCodeName,
        nodeId: this.info.nodeId,
        workFlowId: this.orderServices.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    // 发送提醒
    sendRemind() {
      this.$confirm('系统将给客户发送短信，提醒客户提交资料，是否确认发送短信？', '短信提醒', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        sendSmsWeee({
          serviceNos: this.serviceNo,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('发送成功！');
          }
        });
      });
    },
    // 提交
    submit() {
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          let { weeeInfos } = JSON.parse(info);
          let data = {
            id: this.eprData.eprWorkOrder.id,
            serviceId: this.eprData.eprWorkOrder.serviceId,
            weeeInfos: weeeInfos,
            materialData: this.eprData.eprWorkOrder.materialData,
          };
          console.log(weeeInfos, info);
          weeeSave(data).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.getInfo();
            }
          });
        });
      });
    },
    // 保存
    formSave() {
      this.$refs.dynamicForm.onSave().then((materialData) => {
        saveEpr({
          materialData,
          serviceId: this.serviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('保存成功');
            this.isEdit = false;
            this.getInfo();
          }
        });
      });
    },
    saveWorkNo(arrs, simpleServiceNo, amount, id) {
      const obj = this.isWeee ? weeeObj : battObj;
      let arr = Object.keys(obj);
      let flag = true;
      arrs.forEach((item) => {
        flag = arr.every(function (el) {
          return item[el] != '' && item[el] != null && item[el] != undefined;
        });
      });
      if (!flag) {
        this.$message.error('请输入完整信息');
        return;
      }
      if (!simpleServiceNo) {
        this.$message.error('请输入极简工单');
        return;
      }
      if ((amount === '' || amount === null || amount === undefined) && this.isBatt) {
        this.$message.error('请输入金额');
        return;
      }
      eprDeclareRel({
        data: JSON.stringify(arrs),
        eprType: 1,
        simpleServiceNo: simpleServiceNo,
        amount,
        serviceId: this.serviceId,
        id: id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功');
          this.isEdit = false;
          // this.getInfo();
          this.queryWeee();
          if (!id) {
            this.resetWorkNo();
          }
        }
      });
    },
    // 审核
    audit() {
      this.examineDialog = true;
      this.examine = {
        remark: '',
        sendMsg: false,
        status: true,
      };
      // this.$refs.dynamicForm.onSubmit().then((info) => {
      //   this.$confirm('确认审核通过？', '提示', {
      //     customClass: 'custom-confirm',
      //     confirmButtonText: '确认',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     center: true,
      //   }).then(() => {
      //     approvalWeee({
      //       status: 1,
      //       serviceId: this.serviceId,
      //     }).then((res) => {
      //       if (res.code === 0) {
      //         this.$message.success('审核成功');
      //         this.getInfo();
      //       }
      //     });
      //   });
      // });
    },
    sureExamine() {
      let data = {
        id: this.eprData.orderServices.id,
        sendMsg: this.examine.sendMsg,
        status: this.examine.status ? 1 : 2,
        remark: this.examine.remark,
      };
      approvalWeee(data).then((res) => {
        if (res.code === 0) {
          this.examineDialog = false;
          this.$message.success('审核成功');
          this.getInfo();
        }
      });
    },
    // 续费完成
    weeeDone() {
      let data = {
        serviceNos: this.eprData.orderServices.serviceNo,
      };
      completelWeee(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('续费完成');
          this.getInfo();
        }
      });
    },

    getHistoryBuyInfo() {
      const fnName = (this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 ? getHistoryList : getBatHistoryList;
      fnName({
        serviceNo: this.$route.query.serviceNo,
        checkPassTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).then((res) => {
        if (res.code === 0) {
          this.historyBuyInfoList = res.data;
        }
      });
    },
    // 授权驳回
    rejectAuthorizationFunc() {
      this.$confirm('客户上传的授权书或者合同有误，需要客户重新提交', '驳回', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(() => {
          eprRejectAuthorization({
            serviceId: this.serviceId,
            remark: '客户上传的授权书或者合同有误，需要客户重新提交',
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('审核成功');
              this.getInfo();
            }
          });
        })
        .catch((action) => {});
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/eprRenew/index',
      });
    },
    ifBack() {
      if (this.isEdit) {
        this.$confirm('本页面如有填写资料，请先点击页面顶部的保存按钮保存资料，再离开', '温馨提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '我已点保存按钮',
          cancelButtonText: '还没点保存按钮',
          type: 'warning',
          center: true,
        }).then(() => {
          this.back();
        });
      } else {
        this.back();
      }
    },
    initURL(obj = '') {
      let url = '';
      if (this.IsJsonString(obj)) {
        url = this.replaceHttps(JSON.parse(obj)[0] || '');
      } else {
        url = this.replaceHttps(obj);
      }
      return url;
    },
    resetWorkNo() {
      this.infos = this.isWeee ? [{ ...weeeObj }] : [{ ...battObj }];
      this.simpleServiceNo = '';
      this.showSimpleWork = false;
    },
    // 判断是不是json
    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    // 跳转详情页面
    simpleDetail(id, item) {
      this.$router.push({
        name: 'VATOtherServiceDetail',
        query: {
          id,
        },
        params: {
          rowData: {
            countryNameZh: item.countryNameZh,
            simpleServiceNo: item.simpleServiceNo,
            serviceName: item.serviceName,
            countryCode: item.countryCode,
            serviceNo: item.serviceNo,
          },
        },
      });
    },
    // 删除证书
    deleteCertificate(i) {
      this.$confirm('是否确认删除证书？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        let certificatesList = this.eprBaseInfo.registrationReceipt;
        certificatesList.splice(i, 1);
        eprCertificate({
          certificates: certificatesList,
          serviceId: this.serviceId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getInfo();
          }
        });
      });
    },
    weeeEditChange(status) {
      bus.$emit('changeEdit', { isEdit: status });
      this.weeeEdit = !status;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;

  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-top: 10px;
    transition: all 0.3s ease-in-out;

    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }

    .header-container {
      padding-left: 30px;

      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;

        .fold {
          cursor: pointer;
          font-size: 14px;
        }
      }

      .el-form-wrapper {
        height: calc(100vh - 312px);
        overflow-y: auto;
      }
    }
  }

  .info-block {
    max-height: calc(100vh - 272px);
  }
}

.titleStyle {
  display: inline-flex;
  font-size: 14px;

  .talkbubble {
    height: 30px;
    background-color: #eaeaea;
    padding: 0 15px;
    line-height: 30px;
  }

  .triangle {
    width: 15px;
    border: 15px solid transparent;
    border-left: 10px solid #eaeaea;
  }
}

.form-required::before {
  content: '*';
  color: #f5222d;
  margin-right: 4px;
}

.m-10 {
  margin: 0 10px;
}

.category-table {
  .el-table__header {
    width: 100%;

    .el-table__cell {
      height: 48px;
    }
  }

  /deep/ .el-table__header th {
    background: #fff !important;
  }

  /deep/ .el-table__cell {
    background: #fff !important;
  }

  .w-300 {
    width: 300px;
  }
}
</style>
