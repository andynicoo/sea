<template>
  <div>
    <div class="app-container">
      <div class="header-wrapper" ref="searchBox">
        <div class="back-container">
          <div class="status-wrapper">
            <el-link :underline="false" type="primary" @click="goBack">
              <i class="el-icon-arrow-left"></i>
              返回列表
            </el-link>
            <div class="status">申报详情 ——— {{ taxWorkOrder.status | filterStatus }}</div>
          </div>
          <div>
            <template v-if="!taxWorkOrder.invalid">
              <!--  待申报  -->
              <template v-if="[statusObj.WAIT_SUBMIT, statusObj.Sub_REJECT].includes(taxWorkOrder.status)">
                <el-button :disabled="isCancel" type="primary" :underline="false" v-show="hasAuthority('M1_40')" @click="checkSubmitProgress" v-if="taxWorkOrder.closeFlag == 0 && !isProcess && [('GB', 'DE')].includes(countryCode) && taxWorkOrder.responseStatus === 'WAIT'"> 查看申报进度 </el-button>
                <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('M1_12')" @click="submit" v-if="(normalStatus || serviceInfo.status === 2) && taxWorkOrder.closeFlag == 0">
                  提交申报
                  <el-tooltip :content="taxWorkOrder.responseMessage" v-if="taxWorkOrder.responseStatus === 'FAIL'">
                    <i class="el-icon-warning icon-warning"></i>
                  </el-tooltip>
                </el-button>
                <el-button @click="clickOpenOrClolsedeclare" type="primary"> {{ taxWorkOrder.closeFlag == 1 ? '开启' : '关闭' }}申报 </el-button>
                <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('M1_36')" @click="showOfflineDeclareDialog" v-if="['DE', 'GB'].includes(countryCode)"> 线下申报 </el-button>
              </template>
              <!-- 待审核税金 -->
              <template v-if="taxWorkOrder.status === statusObj.WAIT_AUDIT && normalStatus">
                <el-button @click="audit" v-show="hasAuthority('M1_16')" :disabled="isCancel" type="primary"> 审核通过 </el-button>
              </template>
              <!-- 待审核申报 -->
              <el-button @click="auditDeclare" v-if="taxWorkOrder.status === statusObj.WAIT_AUDIT_DECLARE" v-show="hasAuthority('M1_13')" :disabled="isCancel" type="primary"> 审核通过 </el-button>
              <!-- 驳回 -->
              <el-button @click="doReject" v-if="normalStatus && getRejectBtn()" v-show="hasAuthority('M1_24')" :disabled="isCancel"> 驳回 </el-button>
              <!-- 录入发票号 -->
              <el-button @click="recordInvoiceNum" v-if="normalStatus && taxWorkOrder.status === statusObj.DECLARING" v-show="hasAuthority('M1_14')" :disabled="isCancel" type="primary"> 录入发票号 </el-button>
              <!-- 转出代理、申报完成 -->
              <template v-if="[statusObj.VOUCHER_REJECT, statusObj.DECLARE_COMPLETE].includes(taxWorkOrder.status)">
                <el-button type="primary" v-if="!isProcess && countryCode === 'GB' && !taxWorkOrder.declareReceipt" @click="downloadShuijinForms" v-show="hasAuthority('M1_29')">查看回执</el-button>
                <el-button type="primary" v-if="taxWorkOrder.declareReceipt" @click="showReceiptImgModel = true" v-show="hasAuthority('M1_29')">查看回执</el-button>
              </template>
              <!-- 替换回执 -->
              <template v-if="taxWorkOrder.status === statusObj.DECLARE_COMPLETE || (normalStatus && ([statusObj.DECLARING].includes(taxWorkOrder.status) || ([statusObj.WAIT_PAID, statusObj.Tax_REJECT].includes(taxWorkOrder.status) && countryCode === 'DE')))">
                <el-button @click="changeReceipt" v-show="hasAuthority('M1_23')" :disabled="isCancel" type="primary"> 替换回执 </el-button>
              </template>
              <!-- 待缴纳税金 -->
              <el-button @click="uploadTaxVoucher" v-if="[statusObj.WAIT_PAID, statusObj.Tax_REJECT].includes(taxWorkOrder.status)" v-show="hasAuthority('M1_15')" :disabled="isCancel" type="primary"> 上传缴税凭证 </el-button>
              <!-- 上传回执 -->
              <el-button @click="uploadReceipt" v-if="taxWorkOrder.status === statusObj.DECLARE_DOCK_COMPLATE" v-show="hasAuthority('M1_17')" :disabled="isCancel" type="primary"> 上传回执 </el-button>
              <!-- 修复申报 -->
              <el-button @click="repairDeclare" v-if="normalStatus && countryCode === 'DE' && taxWorkOrder.status === statusObj.DECLARE_COMPLETE && !taxWorkOrder.declMethod" v-show="hasAuthority('M1_22')" :disabled="isCancel" type="primary"> 修复申报 </el-button>
              <!-- 待续费 -->
              <el-button @click="openDeclarePortDialog = true" v-show="hasAuthority('M1_35') && serviceInfo.status == 2"> 开通申报端口 </el-button>
              <el-button :disabled="isCancel" type="primary" @click="downloadDeclareFileDialog = true" v-show="hasAuthority('M1_29')">下载申报文件</el-button>
            </template>
            <el-button type="warning" :disabled="isCancel" v-show="hasAuthority('M1_33')" v-if="countryCode === 'GB' && !isProcess" @click="getwayFun">重新授权</el-button>
            <el-button type="primary" :disabled="isCancel" v-show="hasAuthority('M1_8') && countryCode == 'DE'" @click="creatAnnalsFun">生成年报</el-button>
            <template v-if="taxWorkOrder.invalid">
              <el-button type="info" disabled> 作废 </el-button>
            </template>

            <el-link type="primary" :disabled="isCancel" v-if="[2, 5, 23].includes(serviceInfo.regFunctionCode)" @click="_downloadTemp" v-show="hasAuthority('M1_32')"> 下载{{ serviceInfo.regFunctionCode === 2 ? '转代理' : '注册' }}资料 </el-link>
          </div>
        </div>
        <div class="tips" v-if="[statusObj.Sub_REJECT, statusObj.Tax_REJECT].includes(taxWorkOrder.status)">{{ taxWorkOrder.rejectReason }}</div>
      </div>

      <div class="main-wrapper">
        <div class="table" :class="{ 'app-container-fold': fold }">
          <div class="company-name-wrapper">
            <div class="company-name">{{ serviceInfo.companyNameZh }} {{ serviceInfo.countryNameZh }} {{ taxWorkOrder.declarePeriod | filterDeclarePeriod }}</div>
          </div>
          <el-descriptions :column="3" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
            <!-- <el-descriptions-item label="已经申报月数">{{  }}</el-descriptions-item> -->
            <el-descriptions-item label="本次申报区间">{{ (taxWorkOrder.beginTime || '').split(' ')[0] }}至{{ (taxWorkOrder.endTime || '').split(' ')[0] }}</el-descriptions-item>
            <el-descriptions-item label="本次申报截止日期">{{ (taxWorkOrder.taxDeclarationDeadline || '').split(' ')[0] }}</el-descriptions-item>
            <el-descriptions-item label="本次税金到账截止日期">{{ (taxWorkOrder.taxPaymentDeadline || '').split(' ')[0] }}</el-descriptions-item>
          </el-descriptions>
          <DeclareInfo
            class="table-container"
            v-if="hasGetTaxesDate && ![statusObj.FAILURE, statusObj.WAIT_SUBMIT, statusObj.Sub_REJECT].includes(taxWorkOrder.status)"
            :serviceInfo="serviceInfo"
            :countryCode="countryCode"
            :taxesDate="taxesDate"
            :id="id"
            :declareRule="taxWorkOrder.declareRule"
            :isDongDong="serviceInfo.isDongDong"
            :salesDataFile="taxWorkOrder.salesDataFile"
          >
            <span class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</span>
          </DeclareInfo>
          <div class="table-container" v-else>
            <div class="tittle">
              <span class="text-info">申报信息</span>
              <span class="text-detail" @click="seeDeatil()" v-if="countryCode == 'GB'">
                <img v-if="!isLoading" src="@/assets/images/iipto-common/finger.svg" />
                <i v-if="isLoading" class="el-icon-loading" style="margin-right: 5px"></i>
                查看税局已申报区间
              </span>
              <div style="float: right">
                <span class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</span>
              </div>
            </div>
            <div class="empty-wrapper" v-if="taxWorkOrder.status === statusObj.FAILURE">
              <div class="empty-wrapper-title">暂无申报信息</div>
              <div class="empty-wrapper-subtitle">距离申报开始还有：{{ taxWorkOrder.declareCountdownDay }}天</div>
            </div>
            <Submit
              ref="submit"
              v-if="[statusObj.WAIT_SUBMIT, statusObj.Sub_REJECT].includes(taxWorkOrder.status)"
              :id="id"
              :key="submitKey"
              :countryCode="countryCode"
              :regFunctionCode="serviceInfo.regFunctionCode"
              :serviceId="serviceId"
              :taxData="taxWorkOrder"
              :serviceInfo="serviceInfo"
              :isProcess="isProcess"
              @refresh="getserviceDetail"
            />
          </div>
        </div>

        <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
          <el-tabs class="el-tabs" v-model="tabNav">
            <el-tab-pane name="all" label="全部"></el-tab-pane>
            <el-tab-pane name="serviceInfo" label="工单信息"></el-tab-pane>
            <el-tab-pane name="vatInfo" label="税号信息"></el-tab-pane>
            <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
          </el-tabs>
          <div class="info-block">
            <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
              <div class="block-title">工单信息</div>
              <div class="info-block-item">
                <span class="info-block-title">公司中文名：</span>
                <span>{{ serviceInfo.companyNameZh }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">公司英文名：</span>
                <span>{{ serviceInfo.companyNameEn }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">客户手机号：</span>
                <span>{{ serviceInfo.userMobile }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">申报国家：</span>
                <span>{{ serviceInfo.countryNameZh }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">当期周期类型：</span>
                <span>{{ taxWorkOrder.declarePeriod | filterDeclarePeriod }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">最新周期类型：</span>
                <span>{{ vatInfo.declarePeriod | filterDeclarePeriod }}</span>
                <!-- 服务国家不等于英国且状态为服务中 -->
                <el-button type="text" class="el-icon-edit" @click="changeCycleDialog = true" style="margin-left: 10px" v-if="countryCode !== 'GB' && serviceInfo.status === 1" v-show="hasAuthority('M1_25')">修改 </el-button>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">VAT税号：</span>
                <span>{{ taxWorkOrder.vatTaxNumber }}</span>
              </div>
              <div class="info-block-item" v-if="countryCode !== 'GB' || isProcess">
                <span class="info-block-title">首次申报月份：</span>
                <span>{{ (taxWorkOrder.firstDeclareMonth || '').split(' ')[0] }}</span>
                <el-button type="text" class="el-icon-edit" @click="changeFirstMonthDialog = true" style="margin-left: 10px" v-show="hasAuthority('M1_41')">修改 </el-button>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务截止时间：</span>
                <span>{{ (serviceInfo.expirationTime || '').split(' ')[0] }}</span>
                <el-link icon="el-icon-edit" type="primary" v-show="hasAuthority('M1_34')" @click="modifyExpireTime = true" :underline="false" v-if="serviceInfo.status == 1 || serviceInfo.status == 2"> 修改 </el-link>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">商品名称：</span>
                <span>{{ serviceInfo.serviceName }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">订单号：</span>
                <span>{{ serviceInfo.orderNo }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">订单归属人：</span>
                <span>{{ serviceInfo.attributionName }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">订单备注：</span>
                <span>{{ orderRemarksText }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务号：</span>
                <span>{{ serviceInfo.serviceNo }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">工单号：</span>
                <span>{{ serviceInfo.workNo }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务商：</span>
                <span>{{ serviceInfo.supplierName }}</span>
                <el-link :disabled="isCancel" type="primary" class="el-icon-edit" v-if="[statusObj.FAILURE, statusObj.WAIT_SUBMIT, statusObj.Sub_REJECT].includes(taxWorkOrder.status)" @click="changeSupplierDialog = true" v-show="hasAuthority('M1_42')"></el-link>
              </div>
              <div class="info-block-item">
                <span class="info-block-title"> 服务商编码：</span>
                <span> {{ serviceInfo.supplierAssignsCode }}</span>
                <el-link :disabled="isCancel" type="primary" class="el-icon-edit" @click="addCode" v-show="hasAuthority('M1_18')"></el-link>
              </div>

              <!-- <div class="info-block-item">
                <span class="info-block-title">税务类型：</span>
                <span>{{ serviceInfo.productFunctionCode | functionCode }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务状态：</span>
                <span>{{ serviceInfo.status | serviceStatus }}</span>
              </div> -->
            </template>
            <template v-if="tabNav === 'all' || tabNav === 'vatInfo'">
              <div class="block-title">税号信息</div>
              <div class="info-block-item">
                <span class="info-block-title">税号：</span>
                <span>{{ taxWorkOrder.vatTaxNumber }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">税号下发日期：</span>
                <span>{{ taxWorkOrder.taxIssueDate }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">税号生效日期：</span>
                <span>{{ taxWorkOrder.taxEffectiveDate }}</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">税号文件：</span>
                <el-link type="primary" :href="taxWorkOrder.vatTaxNumberFile" target="_blank" v-if="taxWorkOrder.vatTaxNumberFile"> 查看 </el-link>
                <span v-else>暂无</span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">VAT证书：</span>
                <el-link type="primary" :underline="false" :href="vatInfo.vatCertificate" target="_blank" v-if="vatInfo.vatCertificate"> 查看 </el-link>
                <span v-else>暂无</span>
              </div>

              <!-- 除沙特、阿联酋 -->
              <template v-if="!['SA', 'AE'].includes(countryCode)">
                <div class="info-block-item">
                  <span class="info-block-title">EORI号：</span>
                  <span>{{ vatInfo.eoriNumber }}</span>
                </div>
                <div class="info-block-item">
                  <span class="info-block-title">EORI文件：</span>
                  <el-link type="primary" :underline="false" :href="vatInfo.eoriNumberFile" target="_blank" v-if="vatInfo.eoriNumberFile"> 查看 </el-link>
                  <span v-else>暂无</span>
                </div>
              </template>
              <!-- 英国 -->
              <template v-if="countryCode == 'GB'">
                <div class="info-block-item">
                  <span class="info-block-title">gateway 账号：</span>
                  <span>{{ taxWorkOrder.gatewayId }}</span>
                </div>
                <div class="info-block-item">
                  <span class="info-block-title">gateway 密码：</span>
                  <span>{{ taxWorkOrder.gatewayPassword }}</span>
                </div>
                <div class="info-block-item">
                  <span class="info-block-title">密钥：</span>
                  <span>{{ vatInfo.secret }}</span>
                </div>
              </template>
              <template v-if="countryCode == 'DE'">
                <div class="info-block-item">
                  <span class="info-block-title">DE欧盟证书：</span>
                  <span v-if="vatInfo.deEuCertificate">
                    <el-link type="primary" :underline="false" :href="vatInfo.deEuCertificate" target="_blank"> 下载 </el-link>
                  </span>
                  <span v-else> 暂无 </span>
                </div>
                <div class="info-block-item">
                  <span class="info-block-title">税务副本：</span>
                  <template v-if="vatInfo.vatTaxNumberCopyFile">
                    <template v-if="vatInfo.vatTaxNumberCopyFile.indexOf('[') != -1">
                      <el-link type="primary" :underline="false" :href="item" v-for="item in JSON.parse(vatInfo.vatTaxNumberCopyFile)" :key="item" target="_blank"> 查看 </el-link>
                    </template>
                    <el-link v-else type="primary" :underline="false" :href="vatInfo.vatTaxNumberCopyFile" target="_blank"> 查看 </el-link>
                  </template>
                  <span v-else>暂无</span>
                </div>
              </template>
              <div class="info-block-item" v-if="countryCode == 'FR'">
                <span class="info-block-title">SIRET号：</span>
                <span>{{ vatInfo.siretNumber }}</span>
              </div>
              <template v-if="isEU">
                <div class="info-block-item">
                  <span class="info-block-title">欧盟税号：</span>
                  <span>{{ vatInfo.vatTaxEuNumber }}</span>
                </div>
                <div class="info-block-item">
                  <span class="info-block-title">欧盟税号证书：</span>
                  <el-link type="primary" :underline="false" :href="vatInfo.vatTaxEuFile" target="_blank" v-if="vatInfo.vatTaxEuFile"> 查看 </el-link>
                  <span v-else>暂无</span>
                </div>
              </template>
              <div class="info-block-item" v-if="['SA', 'AE'].includes(countryCode)">
                <span class="info-block-title">税局账号：</span>
                <span>{{ serviceInfo.gatewayId }}</span>
              </div>
            </template>
            <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'">
              <template #title v-if="dataInfo.chiefServiceNo">
                <el-link type="primary" :underline="false" @click="showHistoryLogDialog = true">历史操作记录</el-link>
              </template>
            </OperationLog>
          </div>
        </div>
      </div>
      <div class="related-wrapper">
        <div class="tittle">
          <span class="text-info">关联工单</span>
          <div style="float: right">
            <el-link type="primary" @click="hiddenInvalidDialog = true" v-if="validRefDeclareInfoColl.length === refDeclareInfoColl.length">隐藏作废工单</el-link>
            <el-link type="primary" @click="validRefDeclareInfoColl = refDeclareInfoColl" v-else>显示作废工单</el-link>
          </div>
        </div>
        <el-table border ref="table" :data="validRefDeclareInfoColl" v-loading="listLoading" highlight-current-row maxHeight="300" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
          <el-table-column show-overflow-tooltip align="center" label="申报第次" prop="declarePeriodFormatter"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip align="center" label="购买第次" prop=""></el-table-column> -->
          <el-table-column show-overflow-tooltip align="center" label="申报工单号" prop="workNo"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="申报区间">
            <template slot-scope="{ row }">{{ (row.beginTime || '').split(' ')[0] }}至{{ (row.endTime || '').split(' ')[0] }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="申报进度" prop="progressDesc"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="服务商" prop="supplierName"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="服务商编码" prop="supplierAssignsCode"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="工单状态" prop="workStatus">
            <template slot-scope="{ row }">{{ row.workStatus | filterWorkStatus }}</template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="250px">
            <template slot-scope="{ row }">
              <el-link type="info" v-if="workId === row.workId">当前申报</el-link>
              <template v-else>
                <el-link type="info" :underline="false" v-if="row.invalid">作废</el-link>
                <el-link v-else type="primary" :underline="false" @click="associationDetail(row)">查看详情</el-link>
                <el-link type="primary" :underline="false" @click="associationData(row)" v-if="![statusObj.FAILURE, statusObj.WAIT_SUBMIT].includes(row.status)">申报数据</el-link>
              </template>
              <el-link :disabled="isCancel" type="primary" :underline="false" v-show="hasAuthority('M1_12')" @click="submit(row)" v-if="row.closeFlag == 0 && [statusObj.WAIT_SUBMIT, statusObj.Sub_REJECT].includes(row.status)"> 提交申报 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <HiddenInvalidDialog :hiddenInvalidDialog.sync="hiddenInvalidDialog" :refDeclareInfoColl="refDeclareInfoColl" @hiddenInvalidItems="hiddenInvalidItems" />
    <UploadTaxVoucherDialog :uploadTaxVoucherDialog.sync="uploadTaxVoucherDialog" :getserviceDetail="getserviceDetail" :id="id"></UploadTaxVoucherDialog>
    <AuditDialog :auditDialog.sync="auditDialog" :getserviceDetail="getserviceDetail" :id="id" :rejectNode="rejectNode" :countryCode="countryCode"></AuditDialog>
    <UploadReceiptDialog :uploadReceiptDialog.sync="uploadReceiptDialog" :getserviceDetail="getserviceDetail" :id="id" :isChange="isChange"></UploadReceiptDialog>
    <RecordInvoiceNumDialog :recordInvoiceNumDialog.sync="recordInvoiceNumDialog" :getserviceDetail="getserviceDetail" :id="id"></RecordInvoiceNumDialog>
    <AuditDeclareDialog v-if="auditDeclareDialog" :auditDeclareDialog.sync="auditDeclareDialog" :getserviceDetail="getserviceDetail" :id="id" :rejectNode="rejectNode" :taxWorkOrder="taxWorkOrder"></AuditDeclareDialog>
    <CheckInfoDialog :checkInfoDialog.sync="checkInfoDialog" :taxesDate="associationTaxesDate" :row="row" :companyNameZh="serviceInfo.companyNameZh" :productFunctionCode="serviceInfo.regFunctionCode" :countryCode="countryCode"></CheckInfoDialog>
    <RejectReasonDialog :rejectReasonDialog.sync="rejectReasonDialog"></RejectReasonDialog>
    <RejectDetailDialog v-if="rejectDetailDialog" :rejectDetailDialog.sync="rejectDetailDialog" :serviceId="serviceNo" apiKey="taxNumDeclare"></RejectDetailDialog>
    <ServiceDialog :serviceDialog.sync="serviceDialog" :workId="workId" :getserviceDetail="getserviceDetail"></ServiceDialog>
    <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :declareReceipt="taxWorkOrder.declareReceipt" :id="id" :debitReceipt="taxWorkOrder.debitReceipt"></ShowReceiptDialog>
    <ChangeCycleDialog v-if="countryCode" :changeCycleDialog.sync="changeCycleDialog" :period="vatInfo.declarePeriod" :getserviceDetail="getserviceDetail" :declareList="list" :countryCode="countryCode" :serviceId="serviceId"></ChangeCycleDialog>
    <ChangeFirstMonthDialog :changeFirstMonthDialog.sync="changeFirstMonthDialog" :month="taxWorkOrder.firstDeclareMonth" :workId="workId" @refresh="getserviceDetail" />
    <RejectDialog :rejectDialog.sync="rejectDialog" :getserviceDetail="getserviceDetail" :workId="workId" :rejectNode="rejectNode"></RejectDialog>
    <add-remark-dialog v-if="addRemarkDialog" :addRemarkDialog.sync="addRemarkDialog" :queryData="getserviceDetail" apiKey="saveDeclareWorkOrder" :serviceNo="serviceNo"></add-remark-dialog>
    <CheckRemarkDialog :checkRemarkDialog.sync="checkRemarkDialog" :serviceNo="serviceNo" :queryData="getserviceDetail"></CheckRemarkDialog>
    <OpenDeclarePortDialog :openDeclarePortDialog.sync="openDeclarePortDialog" :serviceNo="serviceId" :getserviceDetail="getserviceDetail" />
    <OfflineDeclareDialog :id="id" :offlineDeclareDialog.sync="offlineDeclareDialog" :getserviceDetail="getserviceDetail" />
    <!-- 批量下载申报回执弹窗 -->
    <el-dialog title="批量下载申报回执" :visible.sync="downloadReceiptDialog" width="460px" :close-on-click-modal="false" center :before-close="clearSetInterval">
      <p class="loading-text">{{ uploadStatus ? '文件已生成' : '文件生成中，请稍等……' }}</p>
      <p>备注：</p>
      <p :class="uploadStatus ? '' : 'color-red'">1.文件生成完成才可下载；</p>
      <p>2.批量下载的文件每一个工单为一个文件夹。</p>
      <p>3.单次批量下载文件大小为50M，约100个回执，批量下载时请控制数量；</p>
      <div class="upload-box" v-if="uploadStatus">
        <el-button type="primary" @click="downFunc">下载</el-button>
      </div>
    </el-dialog>
    <ModifyExpirationTime :modifyExpireTime.sync="modifyExpireTime" :serviceId="serviceId" @refresh="getserviceDetail" :declarePeriod="taxWorkOrder.declarePeriod" :expirationTime="serviceInfo.expirationTime" :productFunctionCode="serviceInfo.regFunctionCode" />
    <HistoryDeclareDialog :historyDeclareDialog.sync="historyDeclareDialog" :vatTaxNumber="taxWorkOrder.vatTaxNumber" :historyDeclareList="historyDeclareList" />
    <DownloadDeclareFileDialog :downloadDeclareFileDialog.sync="downloadDeclareFileDialog" :serviceId="serviceId" />
    <SubmitConfirmDialog :submitConfirmDialog.sync="submitConfirmDialog" submitStatus="WAIT" :productFunctionCode="serviceInfo.regFunctionCode" :countryCode="countryCode" :id="id" />
    <ChangeSupplierDialog :changeSupplierDialog.sync="changeSupplierDialog" :countryCode="countryCode" :countryNameZh="serviceInfo.countryNameZh" :workId="workId" @refresh="getserviceDetail" />
    <ShowHistoryLogDialog :showHistoryLogDialog.sync="showHistoryLogDialog" :chiefServiceNo="dataInfo.chiefServiceNo" />
  </div>
</template>
<script>
import * as comps from './components/index';
import { statusObj, statusList, ruleObj, ruleList, otherOmCountryList } from './enumObj.js';
import OperationLog from '../components/OperationLog'; // 操作记录
import { serviceDetail, declarePage, taxesList, downloadBritainReceipt, repair, rejectNode, handleWorkOrderCloseFlag, downloadMultipleReceipt, queryMultipleReceipt, creatAnnalsApi, pullSellFile, flagRelateTaxNo, getVatObligations } from '@/api/newApi/taxServices/taxNumDeclare.js';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import { updateSupplierCode } from '@/api/newApi/taxServices/serviceManage.js';
import { ifAuth, vatObligations, mtdAuth } from '@/api/newApi/taxServices/taxRegister.js';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import ModifyExpirationTime from '../components/modifyExpirationTime';
import HistoryDeclareDialog from './components/historyDeclareDialog';
import ShowHistoryLogDialog from '../components/showHistoryLogDialog';
import Submit from './submit';
import { downloadUrl } from '@/components/DynamicForm/commonOperator';
export default {
  data() {
    return {
      serviceId: '',
      id: '',
      workNo: '',
      workId: this.$route.query.workId,
      otherOmCountryList: otherOmCountryList,
      listLoading: false,
      statusObj: statusObj,
      ruleObj: ruleObj,
      modifyExpireTime: false,
      openDeclarePortDialog: false,
      historyDeclareDialog: false,
      offlineDeclareDialog: false,
      historyDeclareList: [],
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },
      countryCode: '',
      taxWorkOrder: {},
      refDeclareInfoColl: [],
      validRefDeclareInfoColl: [],
      serviceInfo: {}, // 服务信息
      serviceNo: '',
      vatInfo: {}, // 税号信息
      list: [],
      activities: [],
      changeCycleTypeDialog: false, // 修改周期类型
      editDialog: false, // 编辑补申报
      uploadTaxVoucherDialog: false, // 上传缴税凭证
      auditDialog: false, // 审核税金
      uploadReceiptDialog: false, // 上传回执
      downloadReceiptDialog: false, //下载回执
      uploadZeroDeclareVoucherDialog: false, // 上传零申报凭证
      recordInvoiceNumDialog: false, // 录入发票号
      auditDeclareDialog: false, // 审核申报
      checkInfoDialog: false, // 查看申报数据
      rejectReasonDialog: false, // 查看驳回原因
      rejectDetailDialog: false, // 驳回详情
      serviceDialog: false, // 修改服务商编码
      showReceiptImgModel: false, // 查看回执弹窗
      changeCycleDialog: false, // 修改申报周期
      hiddenInvalidDialog: false, // 隐藏作废工单
      changeFirstMonthDialog: false, // 修改首次申报日期
      rejectDialog: false, // 驳回弹窗
      downloadDeclareFileDialog: false, // 下载申报文件
      changeSupplierDialog: false, // 修改服务商
      imglist: [],
      row: {},
      associationTaxesDate: {},
      taxesDate: {},
      hasGetTaxesDate: false,
      tabNav: 'all',
      isAuth: null,
      isChange: false, // 是否替换回执
      addRemarkDialog: false,
      openOrClolsedeclare: false,
      checkRemarkDialog: false,
      uploadStatus: false,
      isLoading: false,
      flagRelateTaxNo: false, //申报的税号是否关联店铺
      isProcess: false, // 是否为英国美欧
      initHeight: 52,
      fold: false,
      checkItem: {},
      submitConfirmDialog: false,
      showHistoryLogDialog: false,
      rejectNode: '',
      isCancel: false,
      submitKey: Date.now(),
      dataInfo: {},
    };
  },
  components: {
    ...comps,
    OperationLog,
    ModifyExpirationTime,
    HistoryDeclareDialog,
    ShowHistoryLogDialog,
    Submit,
  },
  filters: {
    filterStatus(status) {
      if (status < 10) {
        return '未开始';
      }
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    filterRule(rule) {
      let result = ruleList.find((item) => item.value === rule);
      return result ? result.label : '-';
    },
    filterDeclarePeriod(declarePeriod) {
      switch (declarePeriod) {
        case 0:
          return '月报';
        case 1:
          return '季报';
        case 2:
          return '年报';
        default:
          return declarePeriod;
      }
    },
    filterWorkStatus(workStatus) {
      switch (workStatus) {
        case 1:
          return '正常';
        case 2:
          return '已取消';
        default:
          return workStatus;
      }
    },
  },
  computed: {
    orderRemarksText() {
      let { orderRemark } = this.serviceInfo;
      try {
        let remark = orderRemark && orderRemark != '' ? JSON.parse(orderRemark).creator.remark : '';
        return remark;
      } catch (error) {
        return '暂无信息';
      }
    },
    normalStatus() {
      return this.serviceInfo.status === 1;
    },
    // 欧盟国
    isEU() {
      return ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'GR', 'ES', 'FI', 'FR', 'MC', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'].includes(this.countryCode);
    },
  },
  mixins: [operationLog],
  beforeRouteUpdate(to, from, next) {
    next();
    this.workId = this.$route.query.workId;
    this.getserviceDetail();
  },
  mounted() {
    this.getserviceDetail();
  },
  methods: {
    _downloadTemp() {
      this.$util.downFile(downloadUrl(this.serviceInfo.regWorkId));
    },
    /** 备注 */
    clickRemarksSubmit() {
      this.addRemarkDialog = true;
      this.serviceNo = this.taxWorkOrder.taxWorkNo;
    },
    seeDeatil() {
      this.isLoading = true;
      getVatObligations({
        serviceId: this.serviceId,
        vatTaxNumber: this.taxWorkOrder.vatTaxNumber,
        userId: this.serviceInfo.userId,
      })
        .then((res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.historyDeclareList = res.data;
            this.historyDeclareDialog = true;
          }
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },

    // 税局getway 进去授权
    getwayFun() {
      mtdAuth({
        serviceId: this.serviceId,
        vatTaxNumber: this.taxWorkOrder.vatTaxNumber,
        location: this.serviceInfo.regFunctionCode == 5 ? 1 : 2,
        userId: this.serviceInfo.userId,
      })
        .then((res) => {
          if (res.code === 0) {
            window.open(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /** 查看备注 */
    LookRemarks(row) {
      this.checkRemarkDialog = true;
      this.serviceNo = row.taxWorkNo;
    },

    clickOpenOrClolsedeclare() {
      let parm = { closeFlag: this.taxWorkOrder.closeFlag === 0 ? 1 : 0, id: this.id };
      let tips = this.taxWorkOrder.closeFlag === 0 ? '关闭申报后，此申报区间不在客户端展示，不可继续提交申报；是否继续关闭申报？' : '开启申报';
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.handleWorkOrderCloseFlagApi(parm);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭',
          });
        });
    },

    //生成当期销售报告
    createSalesReport(row) {
      this.$confirm('点击确定后系统会自动获取当期的销售报告', '确认获取当期销售报告？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        pullSellFile(row.id).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getserviceDetail();
          }
        });
      });
    },

    //申报的税号是否关联店铺
    flagRelateTaxNoFun() {
      flagRelateTaxNo({
        taxNo: this.taxWorkOrder.vatTaxNumber,
      }).then((res) => {
        if (res.code === 0) {
          this.flagRelateTaxNo = res.data || false;
        }
      });
    },

    // 下载申报回执
    downloadReceipt() {
      this.downloadReceiptDialog = true;
      downloadMultipleReceipt({
        serviceIdList: [this.serviceId],
      }).then((res) => {
        if (res.code === 0) {
          this.uploadReceiptResultFunc(res.data);
        }
      });
    },
    uploadReceiptResultFunc(id) {
      this.setIntervalTimer = setInterval(() => {
        queryMultipleReceipt(id).then((res) => {
          if (res.code === 0) {
            if (res.data.downloadStatus === 2) {
              this.$message.warning('下载失败');
              this.downloadReceiptDialog = false;
              clearInterval(this.setIntervalTimer);
            } else if (res.data.downloadStatus === 1) {
              this.uploadStatus = true;
              clearInterval(this.setIntervalTimer);
              this.uploadObj = res.data;
            }
          }
        });
      }, 1000);
    },

    clearSetInterval() {
      clearInterval(this.setIntervalTimer);
      this.uploadStatus = false;
      this.uploadObj = {};
      this.downloadReceiptDialog = false;
    },
    downFunc() {
      var link = document.createElement('a'); // 构建一个a标签
      link.href = this.uploadObj.fileUrl; // 把路径给它
      link.download = this.uploadObj.fileName; // 下载的文件名字
      link.click(); // 模拟点击
      this.downloadReceiptDialog = false;
      this.uploadStatus = false;
    },
    async handleWorkOrderCloseFlagApi(parm) {
      try {
        let { code, message } = await handleWorkOrderCloseFlag(parm);
        code == 0 ? this.$message.success('操作成功') : this.$message.error(message);
      } finally {
        this.getserviceDetail();
      }
    },

    // 离开页面清除定时
    beforeDestroy() {
      if (this.setIntervalTimer) {
        clearInterval(this.setIntervalTimer);
      }
    },
    getTfnCountryName(tfnCountryCode = '') {
      let tfnCountryCodeList = tfnCountryCode.split(',');
      return this.otherOmCountryList
        .filter((item) => tfnCountryCodeList.includes(item.countryCode))
        .map((item) => item.countryName)
        .join(',');
    },
    goBack() {
      this.$router.push('/newTaxServices/taxNumDeclare/index');
    },
    getRejectBtn() {
      // 待审核申报、待缴税、待缴税(驳回)、等待回执、待审核税金 且 （非德国 或 非英国非美欧）
      if ([statusObj.WAIT_AUDIT_DECLARE, statusObj.WAIT_PAID, statusObj.Tax_REJECT, statusObj.DECLARE_DOCK_COMPLATE, statusObj.WAIT_AUDIT].includes(this.taxWorkOrder.status) && (!['DE', 'GB'].includes(this.countryCode) || this.isProcess)) {
        return true;
      }
      return false;
    },
    hiddenInvalidItems(val) {
      let ids = val.map((item) => item.id);
      this.validRefDeclareInfoColl = this.refDeclareInfoColl.filter((item) => !ids.includes(item.id));
    },
    ifCancel(status) {
      if (!((status === 1 || status === 2) && this.taxWorkOrder.closeFlag == 0)) {
        this.isCancel = true;
        this.$message.warning(`该工单服务状态为：${this.$options.filters.serviceStatus(status)}，停止交付。`);
      }
    },
    // 工单详情
    getserviceDetail() {
      serviceDetail(this.workId)
        .then((res) => {
          if (res.code === 0) {
            // 是否为英国美欧
            this.isProcess = res.data.isProcess;
            this.refDeclareInfoColl = res.data.refDeclareInfoColl;
            this.validRefDeclareInfoColl = res.data.refDeclareInfoColl;
            this.serviceInfo = res.data.serviceInfo; // 服务信息
            this.vatInfo = res.data.vatInfo; // 税号信息
            this.taxWorkOrder = res.data.taxWorkOrder;
            this.taxWorkOrder.supplierIdSa = res.data.supplierIdSa; //服务商是否是沙特自营-沙特自营审核需要填写发票号
            this.id = res.data.taxWorkOrder.id;
            this.serviceId = res.data.taxWorkOrder.serviceId;
            this.countryCode = res.data.taxWorkOrder.countryCode;
            this.dataInfo = res.data;
            this.$nextTick(() => {
              this.submitKey = Date.now();
            });
            this.ifCancel(res.data.serviceInfo.status);
            if (![statusObj.FAILURE, statusObj.WAIT_SUBMIT].includes(this.taxWorkOrder.status)) {
              this.checkInfo();
            }
            // this.getDeclarePage();
            this.workNo = this.refDeclareInfoColl.find((item) => item.workId === this.workId).workNo;
            this.getOperationLog(this.workNo, 3);
            // 英国服务中才调用
            if (this.countryCode === 'GB' && !this.isProcess) {
              this.isHasAuth();
            }
            this.flagRelateTaxNoFun();
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /** 先查询是否授权 */
    isHasAuth() {
      ifAuth({
        workOrderId: this.workId,
        // serviceId: this.serviceId,
        vatTaxNumber: this.taxWorkOrder.vatTaxNumber,
        userId: this.serviceInfo.userId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.isAuth = res.data;
            if (res.data === false) {
              this.$message.warning('该公司还没授权，请点击授权报税按钮进行授权');
            } else {
              if (this.serviceInfo.status == 1) {
                this.getVatObligations();
                this.$store.commit('hasAuth', {
                  vatTaxNumber: this.taxWorkOrder.vatTaxNumber,
                  auth: true,
                });
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 检索增值税义务
    getVatObligations() {
      vatObligations({
        serviceId: this.serviceId,
        vatTaxNumber: this.taxWorkOrder.vatTaxNumber,
      })
        .then((res) => {
          if (res.code === 0) {
            // this.getWorkOrderDetail();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 申报记录
    getDeclarePage() {
      declarePage({
        serviceId: this.serviceId,
        ...this.listQuery,
      }).then((res) => {
        if (res.code === 0) {
          res.data.records.map((item) => {
            item.receiptImg = item.declareReceipt !== '' ? item.declareReceipt.split(',') : [];
          });
          this.list = res.data.records;
          if (this.list && this.list.length) {
            const serviceNos = this.list.map((s) => s.serviceNo);
            const serviceNoStr = [...new Set(serviceNos)].join();
            this.getOperationLog(serviceNoStr, 2);
          } else {
            this.getOperationLog(this.serviceInfo.serviceNo, 2);
          }
          let effective = this.list.filter((item) => item.invalid == false);
          let failure = this.list.filter((item) => item.invalid == true);
          this.list = effective.concat(failure);
          this.listTotal = Number(res.data.total);
        }
      });
    },
    // 德国生成年报工单
    creatAnnalsFun() {
      creatAnnalsApi({ serviceId: this.serviceId }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('生成年报成功');
          this.getregisterInfo();
        }
      });
    },
    // 下载税金确认文件
    downloadShuijinForms() {
      this.$util.downFile(this.baseUrl + '/workorder/management/download/receipt?workId=' + this.id);
      // downloadBritainReceipt({ workId: this.id }).then((res) => {
      //   if (JSON.stringify(res.data) !== '{}') {
      //     this.$util.exporDdf(res);
      //   }
      // });
    },

    // 查看驳回详情
    checkRejectInfo(row) {
      this.rejectDetailDialog = true;
      this.serviceNo = row.taxWorkNo;
      // this.getListReject(row);
    },
    // 驳回原因列表
    // getListReject(row) {
    //   filingRejectInfo({ workNo: row.taxWorkNo })
    //     .then((res) => {
    //       if (res.code === 0) {
    //         this.model.rejectList = res.data;
    //       }
    //     })
    //     .catch((err) => {
    //       this.$message.error(err.message);
    //     });
    // },
    // 查看申报进度
    checkSubmitProgress() {
      this.submitConfirmDialog = true;
    },
    // 提交申报
    submit() {
      // this.$util.setLocalStorage('taxData', JSON.stringify(row));
      // this.$router.push({
      //   name: 'taxNumDeclareSubmit',
      //   query: {
      //     id: this.id,
      //     countryCode: this.taxWorkOrder.countryCode,
      //     productFunctionCode: this.serviceInfo.productFunctionCode,
      //     serviceId: this.serviceId,
      //     isProcess: this.isProcess,
      //   },
      // });
      this.$refs.submit.submitFn();
    },
    // 上传缴税凭证
    uploadTaxVoucher() {
      this.uploadTaxVoucherDialog = true;
    },
    // 审核税金
    audit() {
      rejectNode(this.id).then((res) => {
        if (res.code === 0) {
          this.auditDialog = true;
          this.rejectNode = res.data;
        }
      });
    },
    // 审核申报
    auditDeclare() {
      rejectNode(this.id).then((res) => {
        if (res.code === 0) {
          this.auditDeclareDialog = true;
          this.rejectNode = res.data;
        }
      });
    },
    // 审核申报
    doReject() {
      rejectNode(this.id).then((res) => {
        if (res.code === 0) {
          this.rejectDialog = true;
          this.rejectNode = res.data;
        }
      });
    },
    // 上传回执
    uploadReceipt() {
      this.isChange = false;
      this.uploadReceiptDialog = true;
    },
    // 修改回执
    changeReceipt() {
      this.isChange = true;
      this.uploadReceiptDialog = true;
    },
    // 修复申报
    repairDeclare() {
      repair(this.id).then((res) => {
        if (res.code === 0) {
          this.$message.success('德国税局申报数据已更新，申报回执已替换');
        }
      });
    },

    // 查看回执
    showReceiptImg(row) {
      this.showReceiptImgModel = true;
      if (row.declareReceipt.indexOf(',') !== -1) {
        this.imglist = row.declareReceipt.split(',');
      } else if (row.declareReceipt.indexOf(';') !== -1) {
        this.imglist = row.declareReceipt.split(';');
      } else {
        this.imglist = [row.declareReceipt];
      }

      this.row = row;
    },
    // 上传零申报凭证
    uploadZeroDeclareVoucher(row) {
      this.uploadZeroDeclareVoucherDialog = true;
      // this.id = row.id;
    },
    showOfflineDeclareDialog(row) {
      this.offlineDeclareDialog = true;
      // this.id = row.id;
    },
    // 录入发票号
    recordInvoiceNum() {
      this.recordInvoiceNumDialog = true;
    },
    // 查看（申报数据）
    checkInfo() {
      taxesList(this.id).then((res) => {
        if (res.code === 0) {
          this.hasGetTaxesDate = true;
          this.taxesDate = res.data;
        }
      });
      // this.checkInfoDialog = true;
      // this.row = row;
    },

    // 添加/修改服务商分配编码
    addCode() {
      this.$prompt('', '修改服务商分配编码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入服务商分配编码',
      }).then(({ value }) => {
        updateSupplierCode({ workId: this.workId, supplierAssignsCode: value })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.getserviceDetail();
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      });
    },
    // 关联工单查看详情
    associationDetail(row) {
      this.$router.push({
        name: 'taxNumDeclareDetail',
        query: { workId: row.workId },
      });
    },
    // 关联工单查看申报数据
    associationData(row) {
      taxesList(row.id).then((res) => {
        if (res.code === 0) {
          this.associationTaxesDate = res.data;
        }
      });
      this.checkInfoDialog = true;
      this.row = row;
    },
  },
};
</script>

<style scoped lang="less">
.header-wrapper {
  margin: 0px 5px 0 10px;
  border-radius: 2px;
  .back-container {
    padding: 15px 20px;
    display: flex;
    margin-bottom: 15px;
    justify-content: space-between;
    background-color: #e3f1ff;
    .status-wrapper {
      display: flex;
      align-items: center;
      .status {
        position: relative;
        padding-left: 50px;
        font-size: 16px;
        font-weight: bold;
        &::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 100%;
          background-color: #ddd;
          left: 25px;
        }
      }
    }
  }
}
.main-wrapper {
  margin: 0 5px 0 10px;
  display: flex;
  .table {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    // height: calc(100vh - 330px);
    transition: all 0.3s ease-in-out;
    .company-name-wrapper {
      font-size: 16px;
      font-weight: bold;
      padding: 10px 20px;
      background-color: #fff;
      .company-name {
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
      }
    }
    .el-descriptions {
      padding: 10px 20px;
      margin-bottom: 15px;
      background-color: #fff;
    }
    .table-container {
      height: calc(100vh - 330px);
      margin: 0;
      padding: 20px 15px;
      // overflow: auto;
    }
    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }
  }
}
.fold {
  cursor: pointer;
  margin-left: 10px;
  font-weight: normal !important;
}
.tittle {
  overflow: hidden;
  margin-bottom: 10px;
  span {
    font-weight: bold;
    font-size: 14px;
  }
}
.upload-box {
  text-align: center;
}
.color-red {
  color: #d72323;
}
.loading-text {
  margin-bottom: 20px;
  font-size: 20px;
  color: #f1854f;
}

.text-detail {
  margin-left: 15px;
  vertical-align: middle;
  color: #1890ff;
  cursor: pointer;

  img {
    width: 20px;
    vertical-align: middle;
  }
}
.icon-warning {
  color: #ff6600;
}
.info-block-wrapper {
  margin-top: 0px;
  height: calc(100vh - 214px);
  overflow: auto;
}
.empty-wrapper {
  background-color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 355px);
  .empty-wrapper-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .empty-wrapper-subtitle {
    color: #999;
  }
}
.related-wrapper {
  margin: 5px 10px;
  padding: 20px 15px;
  background-color: #fff;
}
</style>
