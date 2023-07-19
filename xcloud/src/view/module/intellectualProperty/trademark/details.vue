<template>
  <div class="main">
    <!-- 顶部按钮 -->
    <el-card style="margin-bottom: 10px">
      <div style="overflow: hidden">
        <span class="return-box" @click="backList">
          <i class="el-icon-arrow-left"></i>
          返回列表
        </span>
        <!-- 9 == 取消工单 -->
        <div v-show="servicesStatus != 9">
          <SendCustomFileModal
            btnText="发送注册资料"
            :params="{
              workId: workOrderInfo.workOrderId,
              serviceId: workOrderInfo.serviceId,
              customerData: workOrderInfo.customerData,
              smsSend: workOrderInfo.smsSend,
              functionCode: workOrderInfo.productFunctionCode,
              countryCode: workOrderInfo.countryCode,
              enterpriseId: workOrderInfo.enterpriseId,
            }"
            @submit="getData()"
            style="float: right"
            v-if="workOrderInfo.productFunctionCode === 61 && workOrderInfo.nodeCode === 'NODE0035' && workOrderInfo.serviceProgress === 3"
            v-show="hasAuthority('trademark_registration_registerInfo')"
          />
          <SendEmailModal
            btnText="客户发送邮件状态"
            :params="{
              trademarkType: 1,
              workId: workOrderInfo.workOrderId,
              serviceId: workOrderInfo.serviceId,
              emailSend: workOrderInfo.emailSend,
              functionCode: workOrderInfo.productFunctionCode,
            }"
            @submit="getData()"
            style="float: right"
            v-if="workOrderInfo.productFunctionCode === 61 && workOrderInfo.nodeCode === 'NODE0035' && workOrderInfo.serviceProgress === 3 && workOrderInfo.flagCustomerData"
            v-show="hasAuthority('trademark_registration_emailState')"
          />
          <el-button :disabled="isCancel" type="primary" style="float: right" @click="isEditor = true" v-if="workOrderInfo.nodeCode == 'NODE0034'" v-show="hasAuthority('T1_5')"> 修改资料 </el-button>
          <el-button :disabled="isCancel" type="primary" style="float: right" @click="sendSmsFunc" v-if="workOrderInfo.nodeCode == 'NODE0033'" v-show="hasAuthority('T1_6')"> 发送短信 </el-button>
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode != 'NODE0033'" style="float: right; margin-right: 8px" @click="isHandler = true" v-show="hasAuthority('T1_7')"> 修改处理人 </el-button>
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0034' && (rejectNodeCode != '' || nextNodeCode != '')" style="float: right; margin-right: 8px" @click="preAuditModal = true" v-show="hasAuthority('T1_8')"> 初步审核 </el-button>
          <template v-if="getIdexOfStr(workOrderInfo.serviceName)">
            <template v-if="workOrderInfo.subNodeCode == 'NODE0043' && workOrderInfo.status == 1">
              <el-button type="primary" v-if="workOrderInfo.nodeCode == 'NODE0035' && (workOrderInfo.countryCode == 'US' || workOrderInfo.countryCode == 'GB' || workOrderInfo.countryCode == 'EU')" style="float: right; margin-right: 8px" @click="uploadZip" v-show="hasAuthority('T1_9')">
                下载资料
              </el-button>
            </template>
          </template>

          <template v-else>
            <el-button type="primary" v-if="!['NODE0033', 'NODE0034', 'NODE0139', 'NODE0140', 'NODE0141', 'NODE0142'].includes(workOrderInfo.nodeCode)" style="float: right; margin-right: 8px" @click="uploadZip" v-show="hasAuthority('T1_9')"> 下载资料 </el-button>
          </template>

          <el-button :disabled="isCancel" type="primary" v-if="!['NODE0033', 'NODE0034', 'NODE0035', 'NODE0139', 'NODE0140', 'NODE0141', 'NODE0142'].includes(workOrderInfo.nodeCode)" style="float: right; margin-right: 8px" @click="acceptInfoModal = true" v-show="hasAuthority('T1_11')">
            <!-- {{ workOrderInfo.nodeCode == "NODE0035" ? "律师通过" : }} -->
            修改受理信息
          </el-button>

          <!-- 平台审核，非顾问单 或 顾问单状态为使用证据完成 -->
          <!-- workOrderInfo.serviceProgress 3平台审核待录入受理号,4平台审核上传授权书,5平台审核审核授权书,6平台审核授权书被驳回] -->
          <el-button
            :disabled="isCancel"
            type="primary"
            v-if="workOrderInfo.nodeCode == 'NODE0035' && ![3, 4, 5, 6].includes(workOrderInfo.serviceProgress) && (!workOrderInfo.subServicesId || workOrderInfo.subNodeCode === 'NODE0043')"
            style="float: right; margin-right: 8px"
            @click="auditModal = true"
            v-show="hasAuthority('T1_22')"
          >
            平台审核
          </el-button>
          <!-- 平台审核-签署授权书 -->
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0035' && [4, 6].includes(workOrderInfo.serviceProgress)" style="float: right; margin-right: 8px" @click="uploadAuthorization(true)" v-show="hasAuthority('UA1_1')"> 上传授权书 </el-button>
          <!-- 平台审核-审核授权书 -->
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0035' && workOrderInfo.serviceProgress === 5" style="float: right; margin-right: 8px" @click="auditAuthorizationLetterModal = true" v-show="hasAuthority('UA1_2')"> 审核授权书 </el-button>
          <!-- 平台审核-待录入受理号 -->
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0035' && workOrderInfo.serviceProgress === 3" style="float: right; margin-right: 8px" @click="acceptInfoModal = true" v-show="hasAuthority('T1_23')"> 录入受理信息 </el-button>
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0033' || workOrderInfo.nodeCode == 'NODE0034'" style="float: right; margin-right: 8px" @click="cancelWorkOrder = true" v-show="hasAuthority('T1_16')"> 取消工单 </el-button>
          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0037' || workOrderInfo.nodeCode == 'NODE0036'" style="float: right; margin-right: 8px" @click="showUploadOaFile = true" v-show="hasAuthority('T1_12')"> 上传官方文件 </el-button>

          <el-button :disabled="isCancel" type="primary" v-if="workOrderInfo.nodeCode == 'NODE0038' || workOrderInfo.nodeCode == 'NODE0142'" style="float: right; margin-right: 8px" @click="showUploadTrandemarkFile = true" v-show="hasAuthority('T1_17')"> 上传商标证书 </el-button>
          <el-button
            :disabled="isCancel"
            type="primary"
            v-if="!workOrderInfo.noticeDate && (workOrderInfo.nodeCode == 'NODE0036' || workOrderInfo.nodeCode == 'NODE0038' || workOrderInfo.nodeCode == 'NODE0037')"
            style="float: right; margin-right: 8px"
            @click="acceptInfoModalAnnouncement = true"
            v-show="hasAuthority('T1_13')"
          >
            录入公告
          </el-button>
          <el-button :disabled="isCancel" type="primary" v-if="showBtnRegister" style="float: right; margin-right: 8px" @click="acceptInfoModalRegistered = true" v-show="hasAuthority('T1_14')"> 录入注册日 </el-button>
          <Close v-if="workOrderInfo.nodeCode == 'NODE0036' || workOrderInfo.nodeCode == 'NODE0037'" :id="workOrderInfo.serviceNo" :disabled="isCancel" style="float: right; margin-right: 8px" @onOk="() => getData()" />
          <!-- 待提交资料，美国/欧盟/日本/英国显示 -->
          <el-button :disabled="isCancel" type="primary" style="float: right; margin-right: 8px" @click="importDialog = true" v-if="workOrderInfo.nodeCode === 'NODE0033' && ['US', 'EU', 'JP', 'GB'].includes(workOrderInfo.countryCode)" v-show="hasAuthority('T1_25')"> 资料导入 </el-button>
          <el-button :disabled="isCancel" type="primary" style="float: right; margin-right: 8px" @click="isHandleLawyer = true" v-if="['NODE0033', 'NODE0034', 'NODE0035', 'NODE0036', 'NODE0037', 'NODE0038'].includes(workOrderInfo.nodeCode)" v-show="hasAuthority('T1_20')"> 修改律师 </el-button>
          <!-- 意向注册流程新增 -->
          <div style="float: right; margin-right: 8px">
            <el-button :disabled="isCancel" v-if="workOrderInfo.nodeCode === 'NODE0037' && +workOrderInfo.productFunctionCode === 62" type="primary" @click="hanldeClickIntention('NOA')" v-show="hasAuthority('IN_1')">上传NOA文件</el-button>
            <el-button :disabled="isCancel" v-if="['NODE0139', 'NODE0140'].includes(workOrderInfo.nodeCode)" type="primary" @click="hanldeClickIntention('fill')" v-show="hasAuthority('IN_2')">填写使用证据</el-button>
            <el-button :disabled="isCancel" v-if="workOrderInfo.nodeCode === 'NODE0141'" type="primary" @click="hanldeClickIntention('check')" v-show="hasAuthority('IN_3')">审核使用证据</el-button>
            <el-button :disabled="isCancel" v-if="showBtnRelive" type="primary" @click="hanldeClickIntention('relive')" v-show="hasAuthority('IN_4')">宣誓延期</el-button>
            <el-button :disabled="isCancel" v-if="['NODE0141', 'NODE0142'].includes(workOrderInfo.nodeCode)" type="primary" @click="hanldeClickIntention('download')" v-show="hasAuthority('IN_5')">下载使用证据</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 顶部按钮END -->

    <div class="top-container" :key="componentKey">
      <div class="left-container" :class="{ 'app-container-fold': fold }">
        <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
        <!-- 未审核前递交资料 -->
        <workOrderForm
          v-if="workflowColumns.length > 0 && isEditor"
          :isCancel="isCancel"
          :workflowColumns="workflowColumns"
          :servicesStatus="servicesStatus"
          :trademarkAapplicantColumns="trademarkAapplicantColumns"
          :rowInfo="rowInfo"
          :existSubclass="workOrderInfo.existSubclass"
          :trademarkCategoryCount="trademarkCategoryCount"
          @back="getSunMsg"
        ></workOrderForm>
        <!-- 审核通过后详情页 -->
        <workerDetail
          v-on="$listeners"
          v-if="workflowColumns.length > 0 && !isEditor"
          :workflowColumnsDetail="workflowColumns"
          :rowInfoDetail="rowInfo"
          :oaFileListDetail="oaFileList"
          :workOrderInfoDetail="workOrderInfo"
          :remarkResultInfo="remarkResultInfo"
          :isCancel="isCancel"
          @notice="getSunMsg"
          :fold="fold"
          @foldRight="(e) => (fold = e)"
        ></workerDetail>
      </div>
      <div class="right-container" :class="{ 'info-block-wrapper-fold': fold }">
        <rightInfo :workOrderInfo="workOrderInfo" :userInfo="userInfo" :operationLog="operationLog" :serviceId="serviceId" :isTrademark="true"></rightInfo>
      </div>
    </div>
    <!-- 初步审核 -->
    <el-dialog :visible.sync="preAuditModal" title="审核资料">
      <p>
        <el-radio-group v-model="auditRadio" v-if="workOrderInfo.nodeCode != 'NODE0035'">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0" v-if="rejectNodeCode != ''">资料不对，驳回</el-radio>
        </el-radio-group>
        <el-input v-model="remarkPass" v-if="auditRadio == 1" :maxlength="500" type="textarea" style="margin-top: 10px" placeholder="如果通过率太低，与客户沟通后任执意进行注册需备注好通过原因" />
        <el-input v-model="remark" v-if="auditRadio == 0" type="textarea" style="margin-top: 10px" placeholder="请输入驳回原因" />
      </p>
      <p style="margin-top: 10px">
        <span style="margin-right: 12px">短信通知</span>
        <el-radio-group v-model="sendSms">
          <el-radio :label="true">通知用户</el-radio>
          <el-radio :label="false">不通知用户</el-radio>
        </el-radio-group>
      </p>

      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="preAuditModal = false">取消</el-button>
        <el-button type="primary" @click="rejectAudit">确认</el-button>
      </p>
    </el-dialog>
    <!-- 平台审核 -->
    <el-dialog :visible.sync="auditModal" title="平台审核">
      <p>
        <span style="margin-right: 12px">审核工单</span>
        <el-radio-group v-model="auditRadio">
          <el-radio :label="1">平台审核通过</el-radio>
          <el-radio :label="0" v-if="rejectNodeCode != ''">平台审核驳回</el-radio>
          <el-radio :label="2" v-if="workOrderInfo.subServicesId">驳回使用证据</el-radio>
        </el-radio-group>
      </p>
      <p style="position: relative; margin-top: 10px" v-if="auditRadio === 1">
        <span style="margin-right: 12px"><i style="color: #f5222d; margin-right: 4px">*</i>是否需要签署授权书</span>
        <el-radio-group v-model="signingAuth">
          <el-radio :label="1">签署</el-radio>
          <el-radio :label="0">不签署</el-radio>
        </el-radio-group>
      </p>
      <p style="margin-top: 10px" v-if="auditRadio === 0">
        <span style="margin-right: 12px">短信通知</span>
        <el-radio-group v-model="sendSms">
          <el-radio :label="true">通知用户</el-radio>
          <el-radio :label="false">不通知用户</el-radio>
        </el-radio-group>
      </p>
      <p style="margin-top: 10px">
        <span style="margin-right: 12px">{{ auditRadio === 1 ? '工单审核备注' : '驳回原因备注' }}</span>
        <el-input v-model="remark" type="textarea" maxlength="500" style="margin-top: 10px" :placeholder="auditRadio === 1 ? '如果注册通过率过低，与客户沟通后任执意进行注册需备注好通过原因' : '请输入驳回原因'" />
      </p>

      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="auditModal = false">取消</el-button>
        <el-button type="primary" @click="platformAudit">确认</el-button>
      </p>
    </el-dialog>
    <!-- 审核授权书 -->
    <el-dialog :visible.sync="auditAuthorizationLetterModal" title="审核授权书">
      <div v-for="(item, index) in registrationAuthorizationList" :key="index" class="authorization-letter-list">
        {{ item.keyLabel }}： <a v-if="item.keyNameValue && JSON.stringify(item.keyNameValue) !== '{}'" :href="item.keyNameValue" target="_blank" style="color: #00a3ff">{{ item.keyNameValue }}（点击查看） </a>
      </div>
      <p style="margin-top: 20px">
        <span style="margin-right: 12px">审核</span>
        <el-radio-group v-model="auditRadio">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核驳回</el-radio>
        </el-radio-group>
      </p>
      <p style="margin-top: 10px" v-if="auditRadio === 0">
        <span style="margin-right: 12px">驳回原因</span>
        <el-input v-model="remark" type="textarea" maxlength="500" style="margin-top: 10px" placeholder="请输入驳回原因" />
      </p>

      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="auditAuthorizationLetterModal = false">取消</el-button>
        <el-button type="primary" @click="authorizationLetterAudit">确认</el-button>
      </p>
    </el-dialog>
    <!-- 录入受理信息 -->
    <el-dialog :visible.sync="acceptInfoModal" title="录入受理信息">
      <p style="margin-top: 10px">
        <span style="margin-right: 12px">审核工单</span>
        <el-radio-group v-model="auditRadio">
          <el-radio :label="1">已获取受理信息</el-radio>
          <el-radio :label="0" v-if="rejectNodeCode != ''">驳回注册资料</el-radio>
          <el-radio :label="2" v-if="workOrderInfo.subServicesId">驳回使用证据</el-radio>
        </el-radio-group>
      </p>
      <template v-if="auditRadio === 1">
        <p style="margin-top: 10px; color: red; font-size: 14px">请核对律师信息后，再录入受理信息。</p>
        <p style="margin: 10px 0; font-size: 14px">代理律师：{{ workOrderInfo.attorneyName }}</p>
        <p>
          <el-input v-model="acceptObj.acceptNum" placeholder="请输入受理号" clearable style="width: 200px" />
          <el-date-picker type="date" placeholder="选择获得受理号的日期" v-model="acceptObj.acceptTime" :options="options" style="margin-top: 10px; width: 200px; margin-left: 10px"></el-date-picker>
        </p>
      </template>
      <p style="margin-top: 10px" v-if="auditRadio === 0">
        <span style="margin-right: 12px">短信通知</span>
        <el-radio-group v-model="sendSms">
          <el-radio :label="true">通知用户</el-radio>
          <el-radio :label="false">不通知用户</el-radio>
        </el-radio-group>
      </p>
      <p style="margin-top: 10px" v-show="auditRadio === 1">注意：受理书、电子证书等官方文件，可点击【抓取官方文件】下载，或点击【上传官方文件】自行上传。</p>
      <p style="margin-top: 10px" v-if="auditRadio !== 1">
        <span style="margin-right: 12px">驳回原因备注</span>
        <el-input v-model="remark" type="textarea" maxlength="500" style="margin-top: 10px" placeholder="请输入驳回原因" />
      </p>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="acceptInfoModal = false">取消</el-button>
        <el-button type="primary" @click="acceptConfirm">确认</el-button>
      </p>
    </el-dialog>

    <el-dialog :visible.sync="acceptInfoModalAnnouncement" title="录入公告日期">
      <p>
        <el-date-picker type="date" placeholder="选择公告日期" v-model="acceptObj.noticeDate" :options="options" style="margin-top: 10px; width: 200px"></el-date-picker>
      </p>
      <br />
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="acceptInfoModalAnnouncement = false"> 取消 </el-button>
        <el-button type="primary" @click="acceptSureAudit">确认</el-button>
      </p>
    </el-dialog>

    <el-dialog :visible.sync="acceptInfoModalRegistered" title="录入注册日期">
      <p>
        <el-input v-model="acceptObj.registerNo" placeholder="输入注册号" clearable style="width: 200px" />
        <el-date-picker type="date" placeholder="选择获得注册号的日期" v-model="acceptObj.registerDate" :options="options" style="margin-top: 10px; width: 200px; margin-left: 10px"></el-date-picker>
      </p>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="acceptInfoModalRegistered = false"> 取消 </el-button>
        <el-button type="primary" @click="acceptSureAudit">确认</el-button>
      </p>
    </el-dialog>
    <el-dialog :visible.sync="cancelWorkOrder" title="提示">
      <p>确认要取消工单么?</p>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="cancelWorkOrder = false"> 取消 </el-button>
        <el-button type="primary" @click="cancelWorkeOrderfun()">确认</el-button>
      </p>
    </el-dialog>
    <!-- <Drag style="cursor: pointer" @handlepaly="showWaringDrawer = true" :workId="workOrderInfo.workOrderId" /> -->
    <!-- 修改处理人 -->
    <HandleUser v-if="isHandler" :type="workOrderInfo.productFunctionCode" :rowInfo="rowInfo" :serviceIds="serviceId" @cancelFunc="handleCancel"></HandleUser>
    <!-- 上传官方文件 -->
    <uploadFileOa v-if="showUploadOaFile" :workOrderId="workOrderInfo.workOrderId" :nowFileInfo="{}" @cancelOa="cancelOa"></uploadFileOa>
    <!-- 资料导入 -->
    <ImportDialog :importDialog.sync="importDialog" :serviceId="serviceId" :nodeCode="nodeCode" :countryCode="workOrderInfo.countryCode" @refresh="refresh" v-if="workOrderInfo.countryCode" />
    <!-- 修改律师 -->
    <HandleLawyer
      v-if="isHandleLawyer"
      :serviceIds="serviceId"
      v-show="hasAuthority('T1_20')"
      :countryCode="workOrderInfo.countryCode"
      :functionCode="workOrderInfo.productFunctionCode"
      :showConsumed="!['NODE0033', 'NODE0034', 'NODE0035'].includes(workOrderInfo.nodeCode)"
      @cancelFunc="handleCancelLawyer"
    ></HandleLawyer>
    <!-- 上传商标证书 -->
    <el-dialog :visible.sync="showUploadTrandemarkFile" title="上传商标证书">
      <template>
        <el-form>
          <el-form-item label="上传文件：">
            <el-upload
              :format="['pdf', 'word']"
              :max-size="5 * 1024"
              :action="workOrderFileName"
              :file-list="uploadTrandemarkFileList"
              :before-upload="beforeuploadTrandemarkAccept"
              :on-format-error="beforeuploadTrandemarkErrorHandler"
              :on-success="
                (res, file, fileList) => {
                  successHandlerAccept(res, file, fileList);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeHandlerAccept(file, fileList);
                }
              "
              style="accept-upload"
            >
              <el-button icon="ios-cloud-upload-outline">上传文件</el-button>
            </el-upload>
            <p class="">文件限制：文件大小不超过5M</p>
          </el-form-item>
          <el-form-item :label="'官方日期：'" prop="showUploadTrandemarkFileDate">
            <el-date-picker type="date" v-model="showUploadTrandemarkFileDate" placeholder="2020/01/01" style="width: 300px"></el-date-picker>
          </el-form-item>
        </el-form>
      </template>

      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="showUploadTrandemarkFile = false"> 取消 </el-button>
        <el-button type="primary" @click="acceptUploadTrandemarkFileDateFun">确认</el-button>
      </p>
    </el-dialog>
    <UploadAuthorizationLetter :serviceId="serviceId" :nodeCode="nodeCode" @uploadAuthorization="uploadAuthorization" @getData="getData" v-if="uploadAuthorizationLetterVisiale" />
    <!-- 意向注册相关弹窗 -->
    <DialogUploadNoa ref="NOA" @update="getData" :workOrderId="workOrderInfo.workOrderId"></DialogUploadNoa>
    <DialogBrandRelive ref="relive" @update="getData" :workOrderId="workOrderInfo.workOrderId"></DialogBrandRelive>
    <DialogCheckLCE ref="check" @update="getData" :nodeCode="workOrderInfo.nodeCode" :serviceId="serviceId"></DialogCheckLCE>
    <DialogFillEvidence ref="fill" :rowInfo="rowInfo" :workflowColumns="workflowColumns" :categoryCount="trademarkCategoryCount" :trademarkAapplicantColumns="trademarkAapplicantColumns" v-if="fillShow" @close="fillShow = false" @update="updateFill"></DialogFillEvidence>
    <DialogFillSuccessToPay ref="toPay" :payLink="payLink" @edit="hanldeClickIntention('fill')"></DialogFillSuccessToPay>
  </div>
</template>
<script>
import workOrderForm from './workerForm';
import workerDetail from './workerDetail';
import rightInfo from '../components/rightInfo';
import HandleUser from '../components/handleUser';
import { formatDate } from '@/libs/tools.js';
import uploadFileOa from '../components/uploadFileOa';
import ImportDialog from '../components/importDialog';
import Close from './close';
import HandleLawyer from '../components/handleLawyer';
import * as API from '@/api/newApi/intellectualProperty/trademark';
import { addFileOaAPI } from '@/api/newApi/intellectualProperty/oa.js';
import { getBusinessLogListByNo } from '@/api/newApi/common';
import { getToken } from '@/libs/util';
import { Debounce } from '@/libs/throttle';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
import UploadAuthorizationLetter from './trademarkComponents/uploadAuthorizationLetter.vue';
// 注册意向相关弹窗
import DialogUploadNoa from './components/DialogUploadNoa.vue';
import DialogBrandRelive from './components/DialogBrandRelive.vue';
import DialogCheckLCE from './components/DialogCheckLCE.vue';
import DialogFillEvidence from './components/DialogFillEvidence.vue';
import DialogFillSuccessToPay from './components/DialogFillSuccessToPay.vue';
import moment from 'moment';
import qs from 'qs';

export default {
  // props: ['rowInfo'],
  components: {
    workOrderForm,
    rightInfo,
    workerDetail,
    HandleUser,
    uploadFileOa,
    ImportDialog,
    Close,
    HandleLawyer,
    UploadAuthorizationLetter,
    WaringDrawer: () => import('../../../../components/waringDrawer/waringDrawer.vue'),
    SendCustomFileModal,
    SendEmailModal,
    DialogUploadNoa,
    DialogBrandRelive,
    DialogCheckLCE,
    DialogFillEvidence,
    DialogFillSuccessToPay,
  },
  provide() {
    return {
      tradeMarkGetData: this.getData(),
      existSubclass: () => {
        return this.workOrderInfo.existSubclass;
      },
    };
  },
  mixins: [isServiceCancel],
  data() {
    return {
      options: {
        disabledDate(date) {
          return date > Date.now();
        },
      },
      workOrderInfo: {},
      userInfo: {},
      operationLog: [],
      workflowColumns: [],
      workFormFlowColumns: [],
      oaFileList: [],
      trademarkCategoryCount: 0,
      showUploadTrandemarkFileDate: '',
      // 审核
      auditRadio: 1,
      isEditor: false,
      preAuditModal: false,
      auditModal: false,
      remark: '',
      remarkPass: '',
      remarkInfo: '',
      componentKey: 0,
      // 公告信息
      acceptInfoModal: false,
      acceptObj: {
        acceptNum: '',
        acceptTime: '',
        acceptReceipt: '',
        acceptBook: '',
        // 公告期
        noticeDate: '',
        // 注册日期
        registerDate: '',
        // 注册号
        registerNo: '',
      },
      rowInfo: {},
      acceptInfoModalAnnouncement: false,
      acceptInfoModalRegistered: false,
      showUploadTrandemarkFile: false, // 商标证书文件上传
      cancelWorkOrder: false,
      isHandler: false,
      showUploadOaFile: false,
      nextNodeCode: '',
      trademarkAapplicantColumns: [],
      uploadTrandemarkFileList: [],
      rejectNodeCode: '',
      sendSms: true,
      nodeCode: this.$route.query.nodeCode,
      serviceId: this.$route.query.serviceId,
      servicesStatus: this.$route.query.servicesStatus,
      importDialog: false,
      fold: false,
      isHandleLawyer: false,
      //是否需求签署授权书
      signingAuth: null,
      auditAuthorizationLetterModal: false,
      registrationAuthorizationList: [],
      uploadAuthorizationLetterVisiale: false,
      serviceId: this.$route.query.serviceId,
      // 填写使用证据弹窗
      fillShow: false,
      payLink: '',
    };
  },
  created() {
    this.getData();
  },
  computed: {
    showBtnRegister() {
      const normalCheck = !this.workOrderInfo.registerNo && (this.workOrderInfo.nodeCode == 'NODE0038' || this.workOrderInfo.nodeCode == 'NODE0037') && +this.workOrderInfo.productFunctionCode === 61;
      const envidenceCheck = this.workOrderInfo.nodeCode === 'NODE0142' && +this.workOrderInfo.productFunctionCode === 62;
      if (normalCheck || envidenceCheck) {
        return true;
      }
    },
    showBtnRelive() {
      if (this.workOrderInfo && this.workOrderInfo.nodeCode) {
        const code = this.workOrderInfo.nodeCode;
        const currentDate = moment();
        const targetDate = moment(this.workOrderInfo.vowExpirationTime);
        // 过期显示复活按钮
        if (code === 'NODE0139' && currentDate.isAfter(targetDate)) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    // 意向注册相关按钮操作
    hanldeClickIntention(type = '') {
      let emums = {
        // 上传NOA文件
        NOA: () => {
          this.$refs.NOA.show();
        },
        // 商标复活
        relive: () => {
          this.$refs.relive.show();
        },
        check: () => {
          this.$refs.check.show();
        },
        // 填写使用证据
        fill: () => {
          const code = this.workOrderInfo.nodeCode;
          const currentDate = moment();
          const targetDate = moment(this.workOrderInfo.vowExpirationTime);
          if (code === 'NODE0139' && currentDate.isAfter(targetDate)) {
            this.$Message.warning('已超过宣誓截止时间，需要先进行商标复活');
          } else {
            this.fillShow = true;
          }
        },
        download: async () => {
          const res = await API.downloadEvidence(this.serviceId);
          let timestamp = new Date().getTime();
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });
          const link = document.createElement('a');
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          link.href = href;
          link.download = timestamp + '.zip'; // 下载后文件名
          document.body.appendChild(link);
          link.click(); // 点击下载
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        },
        toPay: () => {
          this.$refs.toPay.show();
        },
      };
      return emums[type]();
    },
    // 填写使用证据后刷新
    async updateFill(e) {
      this.fillShow = false;
      this.payLink = e;
      await this.getData();
      // 待支付宣誓费用
      if (this.workOrderInfo.nodeCode === 'NODE0139' && this.payLink) {
        const enterpriseId = localStorage.getItem('enterpriseId');
        const eviParams = qs.stringify(this.$route.query);
        let pt = '';
        switch (+enterpriseId) {
          case 30:
            pt = 'iipto';
            break;
          case 28:
            pt = 'sg';
            break;
          default:
            pt = '';
        }
        //this.payLink = encodeURI(`${this.payLink}&fromEvidence=${pt}&${eviParams}`);
        console.log('this.payLink', this.payLink);
        this.hanldeClickIntention('toPay');
      }
    },
    /**
     * 取消工单按钮
     */
    async cancelWorkeOrderfun() {
      let { productId, orderNo, serviceNo } = this.workOrderInfo;
      let { code, data, message } = await API.cacelWordOrder({ productId, orderNo, serviceNo });
      if (code == 0) {
        this.$Message.success('取消工单成功');
        this.$router.push({ path: '/intellectualProperty/trademark/index' });
      } else {
        this.$router.push({ path: '/intellectualProperty/trademark/index' });

        this.$Message.warning(message);
      }
      this.cancelWorkOrder = false;
    },
    /**
     * 上传商标证据的文件
     */
    beforeuploadTrandemarkAccept(file) {
      const MAX_SIZE = file.size / 1024 / 1024 < 5;
      if (!MAX_SIZE) {
        this.$message({
          message: `上传图片大小不能超过5M`,
          type: 'error',
        });
        return false;
      } else if (this.uploadTrandemarkFileList.length >= 1) {
        this.$Notice.warning({
          title: '最多只能上传一个文件',
        });
        return false;
      }
      return true;
    },

    beforeuploadTrandemarkErrorHandler() {
      this.$Notice.warning({
        title: '文件上传失败',
      });
    },
    successHandlerAccept(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      let obj = {
        name: file.name,
        url: file.response.data.fileUrl,
      };
      this.uploadTrandemarkFileList.push(obj);
    },
    removeHandlerAccept(res, file, fileList, item) {
      this.uploadTrandemarkFileList = [...fileList];
    },
    getIdexOfStr(data) {
      // console.log(data, data.indexOf("美国商标注册（顾问）") == - 1 ? false : true);
      return !(data && data.indexOf && data.indexOf('美国商标注册（顾问）') == -1);
    },

    acceptUploadTrandemarkFileDateFun: Debounce('acceptUploadTrandemarkFileDate'),
    /**
     * 确认提交商标证书
     */
    async acceptUploadTrandemarkFileDate() {
      this.showUploadTrandemarkFileDate = new Date(this.showUploadTrandemarkFileDate);
      this.showUploadTrandemarkFileDate = formatDate(this.showUploadTrandemarkFileDate, 'date');
      if (this.uploadTrandemarkFileList < 0) {
        this.$Message.warning('请先上传文件');
        console.log(this.uploadTrandemarkFileList);
        return;
      }
      if (!this.showUploadTrandemarkFileDate) {
        this.$Message.warning('请选择官方日期');
        return;
      }
      console.log(this.uploadTrandemarkFileList);
      let parms = {
        fileType: 8,
        fileUrl: this.uploadTrandemarkFileList[0].url,
        officialDate: this.showUploadTrandemarkFileDate,
        workOrderId: this.workOrderInfo.workOrderId,
      };
      let { data, code, message } = await addFileOaAPI(parms);
      if ((data, code, message)) {
        if (code == 0) {
          this.$Message.success('上传成功');
        } else {
          this.$Message.warning(message);
        }
        this.showUploadTrandemarkFile = false;
        window.location.reload();
      }
    },
    /**
     * 获取子组件消息
     */
    getSunMsg() {
      console.log('数据消息');
      this.getData();
    },

    backList() {
      this.$router.push({ path: '/intellectualProperty/trademark/index', params: { page: 'detail' } });
    },
    /**
     * 更新dom
     */
    updateDom() {
      this.componentKey = new Date().getTime();
    },
    // 刷新
    refresh() {
      this.workflowColumns = [];
      this.getData();
    },

    getData() {
      API.workorderDetailAPI({
        serviceId: this.serviceId,
      })
        .then((res) => {
          this.workflowColumns = JSON.parse(JSON.stringify(res.data.workflowColumns));
          this.workFormFlowColumns = JSON.parse(JSON.stringify(res.data.workflowColumns));
          this.trademarkAapplicantColumns = res.data.workflowColumns.find((item) => item.moduleCode == 'trademarkAapplicant');
          this.trademarkAapplicantColumns = JSON.parse(JSON.stringify(this.trademarkAapplicantColumns.columns));
          this.oaFileList = res.data.fileOaWorkOrderList;
          this.trademarkCategoryCount = res.data.trademarkOrderServiceInfoVO.trademarkCategoryCount;
          this.isEditor = res.data.trademarkOrderServiceInfoVO.nodeCode === 'NODE0033';
          this.workOrderInfo = res.data.trademarkOrderServiceInfoVO;
          this.remarkResultInfo = res.data.remarkResultInfoVO;
          this.rowInfo = res.data.trademarkOrderServiceInfoVO;
          this.servicesStatus = res.data.trademarkOrderServiceInfoVO.status;
          this.ifCancel(res.data.trademarkOrderServiceInfoVO.status);

          this.userInfo = res.data.trademarkOrderUserInfoVO;
          this.acceptObj = {
            acceptNum: this.workOrderInfo.acceptNum,
            acceptTime: this.workOrderInfo.acceptTime,
            acceptReceipt: this.workOrderInfo.acceptReceipt,
            acceptBook: this.workOrderInfo.acceptBook,
            // V3.8
            // 公告期
            noticeDate: this.workOrderInfo.noticeDate,
            // 注册日期
            registerDate: this.workOrderInfo.registerDate,
            // 注册号
            registerNo: this.workOrderInfo.registerNo,
          };
          if (this.acceptObj.acceptTime == '') {
            this.acceptObj.acceptTime = new Date().pattern('yyyy-MM-dd');
          }
          this.nextNodeCode = res.data.nextNodeCode;
          this.rejectNodeCode = res.data.rejectNodeCode;
          this.getOperationLog(this.workOrderInfo.serviceNo, 2);
          this.registrationAuthorizationList = [];
          this.workflowColumns.forEach((modules) => {
            modules.columns.forEach((columns) => {
              //上传授权书 固定三个字段
              if (['registrationAuthorization', 'registrationAuthorization2', 'registrationAuthorization3'].includes(columns.keyName)) {
                this.registrationAuthorizationList.push(columns);
              }
            });
          });
          console.log('workflowColumns', this.workflowColumns);
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
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
    // 初步审核
    rejectAudit() {
      let key = +this.auditRadio === 1 ? 'operateLogRemark' : 'operateLogoperateReason';
      let requestData = {
        json: { [key]: this.auditRadio == 1 ? this.remarkPass : this.remark },
        nodeCode: this.workOrderInfo.nodeCode,
        serviceId: this.serviceId,
        path: this.auditRadio == 1,
        sendSms: this.sendSms,
      };
      API.updateNodeAPI(requestData).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.preAuditModal = false;
          this.getData();
        }
      });
    },
    // 平台审核
    platformAudit(type = true) {
      if (this.auditRadio !== 1 && this.remark === '') {
        this.$message.warning('请输入驳回原因');
        return;
      }
      if (this.signingAuth === null && type && +this.auditRadio === 1) {
        this.$message.warning('请勾选是否需要签署授权书');
        return;
      }
      let data = {
        nodeCode: this.workOrderInfo.nodeCode,
        serviceId: this.serviceId,
      };
      switch (this.auditRadio) {
        case 1:
          // 审核通过
          data = {
            ...data,
            json: { operateLogRemark: this.remark },
            progressBar: this.signingAuth === 1 ? 4 : 3,
          };
          break;
        case 0:
          // 审核驳回
          data = {
            ...data,
            json: { operateLogoperateReason: this.remark },
            path: false,
            sendSms: this.sendSms,
          };
          break;
        case 2:
          // 使用证据驳回
          data = {
            ...data,
            json: { operateLogoperateReason: this.remark },
            subProgressBar: 2,
          };
          break;
      }
      API.updateNodeAPI(data).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.auditModal = false;
          this.acceptInfoModal = false;
          this.getData();
        }
      });
    },
    // 录入受理信息
    acceptConfirm() {
      if (this.auditRadio === 1) {
        this.acceptSureAudit();
      } else {
        this.platformAudit(false);
      }
    },
    acceptSureAudit: async function () {
      if (this.acceptObj.acceptNum == '' && ['US', 'EU', 'JP', 'GB', 'CA', 'AU'].includes(this.workOrderInfo.countryCode)) {
        this.$Message.error('请填写受理号');
        return;
      }
      if (this.acceptObj.acceptTime == '') {
        this.$Message.error('请选择获得受理号的日期');
        return;
      }
      this.$confirm('请再次确认录入的受理信息无误后，点击确定', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          let requestData = {
              json: {},
              nodeCode: this.workOrderInfo.nodeCode,
              serviceId: this.serviceId,
              path: true,
            },
            data = {};
          if (this.acceptInfoModal) {
            // 录入受理信息
            data.acceptNum = this.acceptObj.acceptNum;
            data.operateLogRemark = this.remarkInfo;
            data.acceptTime = this.formatDate(this.acceptObj.acceptTime, 'date');
            if (this.workOrderInfo.nodeCode != 'NODE0035') requestData.path = '';
          }
          if (this.acceptInfoModalAnnouncement) {
            // 录入公告
            data.noticeDate = this.formatDate(this.acceptObj.noticeDate, 'date');
            if (data.noticeDate.endsWith(' 00:00:00')) {
              data.noticeDate = data.noticeDate.substring(0, data.noticeDate.length - 9);
            }
          }
          if (this.acceptInfoModalRegistered) {
            // 录入注册日
            // 注册日期
            data.registerDate = this.formatDate(this.acceptObj.registerDate, 'date');
            // // 注册号
            data.registerNo = this.acceptObj.registerNo;
          }
          requestData['json'] = { ...data };
          API.updateNodeAPI(requestData).then((res) => {
            if (res.code !== 0) return;
            this.$Message.success('提交成功');
            this.acceptInfoModal = false;
            this.acceptInfoModalAnnouncement = false;
            this.acceptInfoModalRegistered = false;
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '操作失败',
          });
        });
    },
    //审核授权书
    authorizationLetterAudit() {
      if (this.auditRadio !== 1 && this.remark === '') {
        this.$message.warning('请输入驳回原因');
        return;
      }
      let data = {
        nodeCode: this.workOrderInfo.nodeCode,
        serviceId: this.serviceId,
      };
      switch (this.auditRadio) {
        case 1:
          // 审核通过
          data = {
            ...data,
            json: { operateLogRemark: '' },
            progressBar: 3,
          };
          break;
        case 0:
          // 审核驳回
          data = {
            ...data,
            json: { operateLogoperateReason: this.remark },
            progressBar: 6,
          };
          break;
      }
      API.updateNodeAPI(data).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.auditAuthorizationLetterModal = false;
          this.getData();
        }
      });
    },
    // 下载资料
    uploadZip() {
      let self = this;
      let formData = new FormData();
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      // 美国、欧盟、英国下载资料
      // if (this.workOrderInfo.countryCode == 'US' || this.workOrderInfo.countryCode == 'GB' || this.workOrderInfo.countryCode == 'JP' || this.workOrderInfo.countryCode == 'EU') {
      xmlResquest.open('get', this.baseUrl + '/workorder/management/trademark/workorder/standard/zipdowload?trademarkWorkOrderId=' + this.workOrderInfo.workOrderId, true);
      // }
      // 除 美国、欧盟、英国、日本下载资料
      // if (this.workOrderInfo.countryCode != 'US' && this.workOrderInfo.countryCode != 'GB' && this.workOrderInfo.countryCode != 'EU' && this.workOrderInfo.countryCode != 'JP') {
      //   xmlResquest.open('get', this.baseUrl + '/workorder/management/trademark/workorder/other/zipdowload?trademarkWorkOrderId=' + this.workOrderInfo.workOrderId, true);
      // }
      // 设置请求token
      xmlResquest.setRequestHeader('enterpriseid', localStorage.getItem('enterpriseId'));
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken());
      xmlResquest.responseType = 'blob';
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        let fileName = '';
        console.log(oEvent);
        if (oEvent.currentTarget.status == 200 && oEvent.currentTarget.readyState == 4) {
          fileName = self.serverNo + '.zip';
          if (oEvent.loaded === 0) {
            self.$Message.warning('文件内容缺失，请补全再下载！');
            return;
          }
        } else {
          self.$Message.warning('文件内容缺失，请补全再下载！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a');
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = 'none';

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    uploadZipNew() {
      let requestAPI;
      if (this.workOrderInfo.countryCode == 'US' || this.workOrderInfo.countryCode == 'GB' || this.workOrderInfo.countryCode == 'JP' || this.workOrderInfo.countryCode == 'EU') {
        requestAPI = API.dowloadWordOrder;
      } else {
        requestAPI = API.dowloadZipWordOrder;
      }

      requestAPI({ trademarkWorkOrderId: this.workOrderInfo.workOrderId })
        .then((res) => {
          this.btnLoading = false;
          let timestamp = new Date().getTime();
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });
          const link = document.createElement('a');
          const href = window.URL.createObjectURL(blob); // 创建下载的链接
          link.href = href;
          link.download = timestamp + '.zip'; // 下载后文件名
          document.body.appendChild(link);
          link.click(); // 点击下载
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(href); // 释放掉blob对象
        })
        .catch((err) => {
          console.log(err.response);
        })
        .finally((res) => {
          console.log(res);
        });
    },
    handleCancel(val) {
      this.isHandler = false;
      if (val) this.getData();
    },
    cancelOa(val) {
      this.showUploadOaFile = false;
      if (val) {
        this.getData();
      }
    },
    // 发送短信
    sendSmsFunc() {
      API.sendSmsAPI({ serviceId: this.serviceId }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
      });
    },
    handleCancelLawyer(val) {
      this.isHandleLawyer = false;
      if (val) this.getData();
    },
    //显示商标注册上传授权书弹窗
    uploadAuthorization(flag) {
      this.uploadAuthorizationLetterVisiale = flag;
    },
  },
};
</script>
<style scoped lang="less">
.main {
  min-width: 1300px;
}
.return-box {
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
}
.top-container {
  display: flex;
  .left-container {
    position: relative;
    flex: 1;
    // overflow: scroll;
    transition: all 0.3s ease-in-out;
    &.app-container-fold {
      flex: 100%;
    }
    .fold {
      position: absolute;
      z-index: 1;
      right: 30px;
      top: 15px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .right-container {
    width: 390px;
    margin-left: 10px;
    background: #fff;
    transition: all 0.3s ease-in-out;
    &.info-block-wrapper-fold {
      width: 0;
      margin-left: 0;
      overflow: hidden;
    }
  }
}
.authorization-letter-list {
  margin-bottom: 10px;
  a {
    color: #2d8cf0;
  }
}
.tips-error {
  position: absolute;
  left: 0;
  bottom: -13px;
  color: #f5222d;
  font-size: 12px;
}
</style>
