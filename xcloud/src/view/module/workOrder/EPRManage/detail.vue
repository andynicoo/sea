<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <SendCustomFileModal
          btnText="发送注册资料"
          :params="{
            serviceId: orderServices.id,
            customerData: orderServices.customerData,
            smsSend: orderServices.smsSend,
            functionCode: orderServices.productFunctionCode,
            countryCode: orderServices.countryCode,
            enterpriseId: orderServices.enterpriseId,
          }"
          @submit="getInfo()"
          v-if="orderServices.cureentNodeCode === 'NODE0065' || orderServices.cureentNodeCode === 'NODE0265'"
          v-show="hasAuthority('xcloudplat_workOrder_EPRManage_registerInfo')"
        />
        <SendEmailModal
          btnText="客户发送邮件状态"
          :params="{
            serviceId: orderServices.id,
            emailSend: orderServices.emailSend,
            functionCode: orderServices.productFunctionCode,
          }"
          @submit="getInfo()"
          v-if="orderServices.cureentNodeCode === 'NODE0065' || orderServices.cureentNodeCode === 'NODE0265'"
          v-show="hasAuthority('xcloudplat_workOrder_EPRManage_emailState')"
        />

        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="showEdit && !isEdit && hasAuthority('J2_7')">编辑</el-button>
        <template v-if="isEdit && showEdit">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSave" v-show="hasAuthority('J2_8')">保存</el-button>
        </template>

        <!-- 授权书编辑 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="showEditAuth && !isEdit && hasAuthority('J2_7')">编辑</el-button>
        <template v-if="isEdit && showEditAuth">
          <el-button size="small" @click="isEdit = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSubmitAuth" v-show="hasAuthority('J2_8')">提交</el-button>
        </template>

        <a href="#relwork" v-show="hasAuthority('J2_33')" class="m-10" v-if="showEditRelWork"><el-button size="small" type="primary" @click="relWork">关联极简工单</el-button></a>
        <el-button size="small" type="primary" @click="isEdit = true" v-if="showEditWork && !isEdit" v-show="hasAuthority('J2_34')">编辑注册工单品类信息</el-button>

        <!-- 待上传资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD">
          <!-- <el-button size="small" type="primary" @click="changeServiceProviderDialog = true"">修改服务商</el-button> -->
          <el-button size="small" type="primary" @click="submit" v-show="hasAuthority('J2_9')" :disabled="!(info.dataReview && info.dataReview.length && !isEdit) || isCancel">提交</el-button>
          <el-button :disabled="isCancel" size="small" @click="sendRemind" v-show="hasAuthority('J2_10')">发送提醒</el-button>
        </template>
        <!-- 待审核资料 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_REVIEW">
          <el-button :disabled="isCancel" size="small" type="primary" @click="changeServiceProviderDialog = true" v-show="hasAuthority('J2_11')">修改服务商</el-button>
          <el-button size="small" type="primary" @click="audit" :disabled="isEdit || isCancel" v-show="hasAuthority('J2_12')">审核</el-button>
        </template>
        <!-- 驳回按钮 -->
        <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-if="rejectNodeName" v-show="hasAuthority('J2_13')">驳回</el-button>

        <!-- 已审核 -->
        <template v-if="info.nodeCode === progressBarObj.REVIEWED">
          <el-button
            :disabled="isCancel"
            size="small"
            type="primary"
            @click="
              uploadCertificateDialog = true;
              isReplace = false;
            "
            v-show="hasAuthority('J2_26')"
            >替换授权书</el-button
          >
          <el-button size="small" type="primary" @click="audit" :disabled="isCancel" v-show="hasAuthority('J2_27')">审核通过</el-button>
        </template>
        <!-- 待授权 -->
        <template v-if="info.nodeCode === progressBarObj.WAIT_AUTHORIZE">
          <el-button :disabled="isCancel" size="small" type="primary" @click="sendRemind" v-show="hasAuthority('J2_10')">发送提醒</el-button>
        </template>
        <!-- 授权待确认 -->
        <template v-if="info.nodeCode === progressBarObj.AUTHORIZE_WAIT_CONFIRM">
          <!-- <el-button size="small" type="primary" @click="rejectAuthorizationFunc" :disabled="isEdit">授权驳回</el-button> -->
          <el-button size="small" type="primary" @click="commitSupplierFunc" :disabled="isEdit || isCancel" v-show="hasAuthority('J2_15')">提交服务商</el-button>
        </template>

        <!-- 待审核回收费 -->
        <AuditRecyclingDialog :serviceId="serviceId" @refresh="getInfo" :nodeCodeName="info.nodeCodeName" v-if="info.nodeCodeName === '待审核回收费'" />

        <!-- 下载资料 -->
        <el-button v-if="info.nodeCode && info.nodeCode !== progressBarObj.WAIT_UPLOAD && hasAuthority('J2_16')">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>

        <el-button type="primary" v-if="info.nodeCode == 'NODE0365' && hasAuthority('J2_35')">
          <a @click="uploadPayDialog = true">上传缴费凭证</a>
        </el-button>

        <el-button type="primary" v-if="info.nodeCode == 'NODE0366' && hasAuthority('J2_23')">
          <a @click="UINCertificateVisible = true">录入UIN号</a>
        </el-button>

        <el-button :disabled="isCancel" size="small" type="primary" @click="regVisible = true" v-if="info.nodeCode == 'NODE0366'" v-show="hasAuthority('J2_18')">完成注册</el-button>

        <!-- 注册中 -->
        <template v-if="info.nodeCode === progressBarObj.REGISTERING">
          <!-- <el-button :disabled="isCancel" size="small" type="primary" @click="showUINModal(false)" v-if="!eprBaseInfo.uinStr && orderServices.countryCode == 'FR'" v-show="hasAuthority('J2_23')">录入UIN号</el-button> -->
          <el-button :disabled="isCancel" size="small" type="primary" @click="recordDialog = true" v-show="hasAuthority('J2_25')">录入注册结果</el-button>
          <el-button
            :disabled="isCancel"
            size="small"
            type="primary"
            @click="completeRegister"
            v-if="(eprBaseInfo.registrationReceipt.length > 0 && (orderServices.countryCode != 'FR' || (eprBaseInfo.uinStr && orderServices.countryCode == 'FR')) && orderServices.serviceName.indexOf('法国weee') == -1 && orderServices.serviceName.indexOf('法国WEEE') == -1) || isFRAndWeeeAndTextile"
            v-show="hasAuthority('J2_18')"
            >完成注册</el-button
          >
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ info.nodeCodeName }}</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <!-- <div style="text-align: right; height: 20px" >
            <el-link
              type="primary"
              icon="el-icon-edit"
              @click="isEdit = true"
              v-if="info.nodeCode === progressBarObj.WAIT_UPLOAD || info.nodeCode === progressBarObj.WAIT_REVIEW"
            >
              编辑
            </el-link>
          </div> -->
          <div class="el-form-wrapper">
            <!-- 动态表单组件 -->
            <el-tabs v-model="activeName" v-if="showTabs">
              <el-tab-pane label="客户资料" name="customerMaterial"></el-tab-pane>
              <el-tab-pane label="授权书" name="auth">
                <DynamicForm ref="auth" :moduleList="authReview" :showSampleFile="true" :workOrderId="serviceId" :workInfo="info" />
              </el-tab-pane>
            </el-tabs>
            <!-- 动态表单组件 -->
            <DynamicForm v-show="activeName === 'customerMaterial' || !showTabs" ref="dynamicForm" :moduleList="dataReview" :countryCode="info.orderServices ? info.orderServices.countryCode : ''" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />

            <div style="width: 96%" v-if="isFRContribute">
              <div class="titleStyle" style="margin-bottom: 20px">
                <div class="talkbubble">回收费缴纳信息</div>
                <div class="triangle"></div>
              </div>
              <div>
                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>国际银行账号 IBAN：</span>
                    <span>{{ bankPayInfos.ban }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>银行识别码 BIC：</span>
                    <span>{{ bankPayInfos.bankIdentifierCode }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>银行名称 Dank Name：</span>
                    <span>{{ bankPayInfos.bankName }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>账户名称 Account Name：</span>
                    <span>{{ bankPayInfos.accountName }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>官费金额：</span>
                    <span>€{{ bankPayInfos.officialFee }}EUR</span>
                  </el-col>
                  <el-col :span="12">
                    <span>收款备注：</span>
                    <span> {{ eprBaseInfo.uinStr }} &nbsp;&nbsp; {{ bankPayInfos.invoiceNo }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>支付方式：</span>
                    <span>{{ eprBaseInfo.payChannel == 'LIANLIANGLOBAL' ? '连连国际' : '' }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>支付状态：</span>
                    <span>{{ eprBaseInfo.payStatus | filterStatus }}</span>
                  </el-col>
                </el-row>

                <el-row style="margin-bottom: 15px">
                  <el-col :span="12">
                    <span>缴费凭证：</span>
                    <!-- <el-image style="width: 60px; height: 40px" :src="eprBaseInfo.voucherFiles[0]" :preview-src-list="eprBaseInfo.voucherFiles"></el-image> -->
                    <el-link target="_blank" :href="item" type="primary" v-for="item in eprBaseInfo.voucherFiles" :key="item" :underline="false" style="margin-right: 10px"> 查看 </el-link>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div style="width: 96%" v-if="historyBuyInfoList.length">
              <div class="titleStyle">
                <div class="talkbubble">加类加品牌工单</div>
                <div class="triangle"></div>
              </div>
              <div style="display: flex">
                <label class="el-form-item__label" style="width: 110px">
                  <span>{{ isWeee ? 'WEEE产品信息' : '' }} {{ isBatt ? '德国电池法产品信息' : '' }}</span>
                </label>

                <div style="width: calc(100% - 110px)">
                  <WeeeProductDtos :value="historyBuyInfoList" :disabled="true" :showOnly="true" v-if="isWeee" />
                  <BatteryProductDtos :value="historyBuyInfoList" :disabled="true" :showOnly="true" v-if="isBatt" />
                </div>
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
                    <WeeeRelWorkDtos :value="item.dataFormatList" :disabled="item.disabled" v-if="isWeee" :countryCode="info.orderServices ? info.orderServices.countryCode : ''" />
                    <BatteryProductDtos :value="item.dataFormatList" :disabled="item.disabled" v-if="isBatt" />
                  </div>
                </div>
              </div>
            </div>

            <div style="width: 96%" v-if="showSimpleWork">
              <div class="titleStyle">
                <div class="talkbubble">极简工单</div>
                <div class="triangle"></div>
                <el-input v-model="simpleServiceNo" placeholder="请输入极简工单服务号" style="width: 300px" class="mr-10" />
                <span style="line-height: 32px" v-show="isBatt">回收包额度：</span>
                <el-input-number style="width: 150px" :min="0" v-model="amount" placeholder="请输入金额" v-show="isBatt" class="mr-10" />
                <el-button @click="resetWorkNo()" class="mr-10">取消</el-button>
                <el-button @click="saveWorkNo(infos, simpleServiceNo, amount)" v-show="hasAuthority('J2_33')">保存</el-button>
              </div>
              <div style="display: flex">
                <label class="el-form-item__label form-required" style="width: 110px">
                  <span> {{ isWeee ? 'WEEE产品信息' : '' }} {{ isBatt ? '德国电池法产品信息' : '' }}</span>
                </label>

                <div style="width: calc(100% - 110px)">
                  <WeeeRelWorkDtos :value="infos" :disabled="false" v-if="isWeee" :countryCode="info.orderServices ? info.orderServices.countryCode : ''" />
                  <BatteryProductDtos :value="infos" :disabled="false" v-if="isBatt" />
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
              <span class="info-block-title">工单号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span>{{ info.nodeCodeName }}</span>
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
              <span>{{ eprBaseInfo.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ eprBaseInfo.completionTime }}</span>
            </div>
            <div v-if="[progressBarObj.WAIT_RECOVER, progressBarObj.AUTH_RECOVER, progressBarObj.REGISTERING, progressBarObj.REGISTER_COMPLETE, progressBarObj.AUTHORIZE_WAIT_CONFIRM].includes(info.nodeCode)">
              <div class="block-title">文件信息</div>
              <div class="sub-title">授权资料</div>
              <div v-for="item in authFileLists" :key="item.id" class="info-block-item">
                <span class="info-block-title">{{ item.keyLabel }}：</span>
                <span v-if="!lodash.isEmpty(item.reView)">
                  <el-link v-for="(img, i) in $util.convertImage(item.reView)" :key="i" :href="img" type="primary" target="_blank" style="vertical-align: initial"> 查看 </el-link>
                </span>
              </div>
              <div v-for="item in info.downloadTemplateList" :key="item.id" class="info-block-item">
                <span class="info-block-title">{{ item.templateName }}：</span>
                <span v-if="item.templateUrl">
                  <el-link style="vertical-align: initial" :href="item.templateUrl" type="primary" target="_blank"> 查看 </el-link>
                </span>
              </div>
              <div v-if="!authFileLists.length && !info.downloadTemplateList.length" class="info-block-item">
                <span class="info-block-title">暂无</span>
              </div>
            </div>

            <div v-if="info.nodeCode === progressBarObj.WAIT_RECOVER || info.nodeCode === progressBarObj.AUTH_RECOVER || info.nodeCode == progressBarObj.REGISTER_COMPLETE">
              <div class="sub-title">缴费信息</div>
              <div class="info-block-item">
                <span class="info-block-title">账单：</span>
                <span v-for="(item, i) in eprBaseInfo.billFiles" :key="i" style="margin-right: 10px">
                  <el-link style="vertical-align: initial" v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">查看</el-link>
                </span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">缴费凭证：</span>
                <span v-for="item in eprBaseInfo.voucherFiles" :key="item" style="margin-right: 10px">
                  <el-link target="_blank" :href="item" type="primary" :underline="false" style="margin-right: 10px; vertical-align: initial"> 查看 </el-link>
                </span>
              </div>
            </div>
            <div v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE">
              <div class="sub-title">下号信息</div>
              <div class="info-block-item">
                <span class="info-block-title">证书：</span>
                <span v-for="(item, i) in eprBaseInfo.registrationReceipt" :key="i" style="margin-right: 10px">
                  <el-link style="vertical-align: initial" v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">查看</el-link>
                  <!-- <i class="el-icon-delete" @click="deleteCertificate(i)" style="margin-left:6px;font-size:16px;vertical-align:middle;cursor:pointer"></i> -->
                </span>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">UIN号：</span>
                <span style="margin-right: 10px">{{ eprBaseInfo.uinStr }}</span>
                <el-button v-if="eprBaseInfo.uinStr" id="uinStr" data-clipboard-action="copy" :data-clipboard-text="eprBaseInfo.uinStr" type="text" size="mini" @click="copyUIN">复制</el-button>
              </div>
              <div class="info-block-item">
                <span class="info-block-title">服务截止时间：</span>
                <span>{{ eprBaseInfo.expirationTime }}</span>
              </div>
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
            <div class="info-block-item">
              <span class="info-block-title">发送注册资料：</span>
              <span>
                <template v-if="orderServices.flagCustomerData === true"> 是 </template>
                <template v-else-if="orderServices.flagCustomerData === false"> 否 </template>
                <template v-else> - </template>
              </span>
              <span>
                <SendCustomFileModal
                  btnText="操作"
                  :params="{
                    serviceId: orderServices.id,
                    customerData: orderServices.customerData,
                    smsSend: orderServices.smsSend,
                    functionCode: orderServices.productFunctionCode,
                    countryCode: orderServices.countryCode,
                    enterpriseId: orderServices.enterpriseId,
                  }"
                  @submit="getInfo()"
                  v-if="orderServices.cureentNodeCode === 'NODE0065' || orderServices.cureentNodeCode === 'NODE0265'"
                  v-show="hasAuthority('xcloudplat_workOrder_EPRManage_registerInfo')"
                />
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">客户发送邮件状态：</span>
              <span>
                <template v-if="orderServices.emailSend === true"> 是 </template>
                <template v-else-if="orderServices.emailSend === false"> 否 </template>
                <template v-else> - </template>
              </span>
              <span>
                <SendEmailModal
                  btnText="操作"
                  :params="{
                    serviceId: orderServices.id,
                    emailSend: orderServices.emailSend,
                    functionCode: orderServices.productFunctionCode,
                  }"
                  @submit="getInfo()"
                  v-if="orderServices.cureentNodeCode === 'NODE0065' || orderServices.cureentNodeCode === 'NODE0265'"
                  v-show="hasAuthority('xcloudplat_workOrder_EPRManage_emailState')"
                />
              </span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <!-- <AuditDialog :auditDialog.sync="auditDialog" :serviceId="serviceId" :nodeCode="info.nodeCode" @refresh="getInfo"></AuditDialog> -->
      <RecordDialog
        :recordDialog.sync="recordDialog"
        :nextNodeCode="info.nextNodeCode"
        :eprWorkOrder="eprBaseInfo"
        :serviceName="orderServices.serviceName"
        :serviceId="serviceId"
        :certificates="eprBaseInfo.registrationReceipt"
        :uinStr="eprBaseInfo.uinStr"
        :countryCode="orderServices.countryCode"
        :billFiles="eprBaseInfo.billFiles"
        @refresh="getInfo"
      ></RecordDialog>
      <UINCertificateDialog :UINCertificateVisible.sync="UINCertificateVisible" :serviceId="serviceId" :certificates="eprBaseInfo.registrationReceipt" :uinStr="eprBaseInfo.uinStr" :countryCode="orderServices.countryCode" @refresh="getInfo"></UINCertificateDialog>

      <UploadPayModel :uploadPayDialog.sync="uploadPayDialog" :serviceId="serviceId" @refresh="getInfo"></UploadPayModel>

      <UINDialog :UINDialog.sync="UINDialog" :isEditUIN="isEditUIN" :serviceId="serviceId" @refresh="getInfo"></UINDialog>
      <ChangeContractAndPower :changeContract.sync="changeContractAndPower" :fileObj="fileObj" :replace="replace" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false"></ChangeContractAndPower>
      <ChangeServiceProviderDialog :productFunctionCode="orderServices.productFunctionCode" :changeServiceProviderDialog.sync="changeServiceProviderDialog" :serviceId="serviceId" :countryCode="orderServices.countryCode" @refresh="getInfo"></ChangeServiceProviderDialog>
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="serviceId" :nodeCodeName="info.nodeCodeName" :rejectNodeName="rejectNodeName" @refresh="getInfo"></RejectDialog>
      <UploadCertificateDialog :uploadCertificateDialog.sync="uploadCertificateDialog" :authorizeFileInfo="authorizeFileInfo" :serviceId="serviceId" @refresh="getInfo" @changeReplace="replace = false" :isReplace="isReplace"></UploadCertificateDialog>

      <el-dialog title="提示" :visible.sync="regVisible" width="30%">
        <div>确认完成注册吗？</div>
        <!-- <div v-if="orderServices.productFunctionCode === 31 || orderServices.productFunctionCode === 32"> -->
        证书有效年份:
        <el-date-picker v-model="regTime" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期"> </el-date-picker>
        <!-- </div> -->
        <div style="color: red">提示：如因注册时效问题，实际完成注册日期与当前日期跨年，可通过补充实际完成注册日期，进行服务年份和服务到期日期自动更新</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="(regVisible = false), (regTime = '')">取 消</el-button>
          <el-button type="primary" @click="sureToReg()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import lodash from 'lodash';
import { progressBarObj, weeeObj, battObj, productFunctionCodeMap } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { getNodeField } from '@/api/newApi/taxServices/serviceManage.js';
import { getAuthAgentInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import { getRejectCode } from '@/api/newApi/common';
import { saveEpr, submitEpr, eprCheck, eprRejectAuthorization, eprCommitSupplier, eprComplete, eprCertificate, eprNotice, eprDeclareRel, queryWeee, queryBat, getHistoryList, getBatHistoryList } from '@/api/newApi/workOrder/EPRManage';
import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import WeeeRelWorkDtos from './components/weeeRelWorkDtos'; //WEEE产品信息
import BatteryProductDtos from '@/components/WorkOrderComponents/EPRProductItems/batteryProductDtos'; //电池法产品信息
import WeeeProductDtos from '@/components/WorkOrderComponents/EPRProductItems/weeeProductDtos'; //WEEE产品信息
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
import AuditRecyclingDialog from './components/auditRecyclingDialog';

export default {
  data() {
    return {
      lodash,
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      isEdit: false,
      infos: [],
      info: {},
      info2: {},
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
      showSimpleWork: false,
      showSimpleWork2: false,
      amount: '',
      amount2: '',
      isWeee: false,
      isBatt: false,
      authorizedAgentWorkOrder: {},
      orderServices: {},
      orderServicesVO: {},
      simpleServiceNo: '',
      simpleServiceNo2: '',
      fileObj: '',
      replace: false,
      moduleList: [],
      countrySelectList: [],
      auditDialog: false,
      recordDialog: false,
      changeContractAndPower: false,
      uploadCertificateDialog: false,
      changeServiceProviderDialog: false,
      UINDialog: false,
      rejectDialog: false,
      UINCertificateVisible: false,
      rejectNodeName: '',
      tabNav: 'all',
      userInfo: {},
      authorizeFileInfo: [],
      realWorkList: [],
      realWorkList2: [],
      historyBuyInfoList: [],
      isReplace: false,
      isEditUIN: false,
      bankPayInfos: {},
      copyRealWorkList: [],
      copyRealWorkList2: [],
      fold: false,
      regVisible: false,
      regTime: '',
      activeName: 'auth',
      resAuthReview: [],
      isShowDownloadTemplateList: false,
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
    SendCustomFileModal,
    SendEmailModal,
    AuditRecyclingDialog,
  },
  computed: {
    showEdit() {
      return this.info.nodeCode === this.progressBarObj.WAIT_UPLOAD || this.info.nodeCode === this.progressBarObj.WAIT_REVIEW;
    },
    showEditWork() {
      return this.info.nodeCode === this.progressBarObj.REGISTER_COMPLETE && ((this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 || (this.orderServices.serviceName || '').indexOf('德国电池法') != -1);
    },
    showEditRelWork() {
      return (this.orderServices.serviceName || '').indexOf('德国WEEE') != -1 || (this.orderServices.serviceName || '').indexOf('德国电池法') != -1;
    },
    // 授权书节点
    showEditAuth() {
      return this.activeName === 'auth' && [this.progressBarObj.WAIT_AUTHORIZE].includes(this.info.nodeCode);
    },

    // 展示完成注册按钮 中的一个条件
    isFRAndWeeeAndTextile() {
      const isFR = this.orderServices.countryCode === 'FR';
      const isWEEE = this.orderServices.productFunctionCode === productFunctionCodeMap.weee;
      const isTextile = this.orderServices.productFunctionCode === productFunctionCodeMap.textile;
      const isNextCOMPLETE = this.info.nextNodeCode === this.progressBarObj.REGISTER_COMPLETE;
      const isCurrREGISTERING = this.info.nodeCode === this.progressBarObj.REGISTERING;
      // 是法国 &&  (weee || 纺织法) && 当前节点是注册中 && 下一节点是完成注册
      return isFR && (isWEEE || isTextile) && isCurrREGISTERING && isNextCOMPLETE;
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
    authReview() {
      if (this.showEditAuth) {
        this.resAuthReview.forEach((pro) => {
          pro.columns.forEach((item) => {
            if (!item.hasOwnProperty('disabled')) {
              this.$set(item, 'disabled', !this.isEdit);
            } else {
              item.disabled = !this.isEdit;
            }
          });
        });
        return this.resAuthReview;
      }
      return [];
    },
    showTabs() {
      return [progressBarObj.WAIT_AUTHORIZE].includes(this.info.nodeCode);
    },
    authFileLists() {
      return this.info?.authorizeColumns || [];
    },
    // 法国回收费缴纳信息展示
    isFRContribute() {
      const isFR = this.orderServices.countryCode === 'FR';
      const isWEEE = this.orderServices.productFunctionCode === productFunctionCodeMap.weee;
      const isTextile = this.orderServices.productFunctionCode === productFunctionCodeMap.textile;
      const isWAIT_RECOVER = this.info.nodeCode === this.progressBarObj.WAIT_RECOVER;
      const isREGISTER_COMPLETE = this.info.nodeCode === this.progressBarObj.REGISTER_COMPLETE;
      const isAUTH_RECOVER = this.info.nodeCode === this.progressBarObj.AUTH_RECOVER;
      // 是法国, 并且是(weee或者纺织法). 并且在节点(待缴纳回收费 || 待审核回收费 || 注册完成)
      return isFR && (isWEEE || isTextile) && (isWAIT_RECOVER || isREGISTER_COMPLETE || isAUTH_RECOVER);
    },
  },
  watch: {
    activeName() {
      if (this.activeName === 'customerMaterial') {
        this.isEdit = false;
      }
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
      downloadTemp(this.serviceId).then((res) => {
        if (res.message) {
          this.$message.error(res.message);
        } else {
          window.open(this.baseUrl + '/workorder/management/vat/download/' + this.serviceId);
        }
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
    getInfo() {
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

        this.resAuthReview = this.translateReviewIntoSourceFileUrl(res.data.dataReview);

        if (res.data.eprWorkOrder.bankPayInfos) {
          this.bankPayInfos = JSON.parse(res.data.eprWorkOrder.bankPayInfos);
        }
        if (res.data.dataReview.length) {
          if ([this.progressBarObj.WAIT_UPLOAD, this.progressBarObj.WAIT_REVIEW, this.progressBarObj.REGISTER_COMPLETE].includes(res.data.nodeCode)) {
            this.moduleList = res.data.dataReview;
          } else {
            this.moduleList = res.data.firstReview;
            // this.authorizeFileInfo = res.data.dataReview;
            this.authorizeFileInfo = JSON.parse(JSON.stringify(res.data.dataReview));
          }
          this.eprBaseInfo = res.data.eprWorkOrder;
        } else {
          this.getData();
        }
        this._getRejectCode();
        this.getOperationLog(this.orderServices.serviceNo, 2);
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
        eprNotice({
          idColl: [this.serviceId],
          code: this.info.nodeCode,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('发送成功！');
          }
        });
      });
    },
    showUINModal(falg) {
      this.isEditUIN = falg;
      this.UINDialog = true;
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
          submitEpr({
            materialData: info,
            serviceId: this.serviceId,
          }).then((res) => {
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
    formSubmitAuth() {
      this.$refs.auth.onSubmit().then((materialData) => {
        this.$confirm('是否确认提交？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(async () => {
          submitEpr({
            materialData,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('提交成功');
              this.isEdit = false;
              this.getInfo();
            }
          });
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
      this.$refs.dynamicForm.onSubmit().then((info) => {
        this.$confirm('确认审核通过？', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          eprCheck({
            status: 1,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('审核成功');
              this.getInfo();
            }
          });
        });
      });
    },
    // 提交服务商
    commitSupplierFunc() {
      this.$confirm('确认提交服务商？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        eprCommitSupplier(this.serviceId).then((res) => {
          if (res.code === 0) {
            this.$message.success('审核成功');
            this.getInfo();
          }
        });
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
    async sureToReg() {
      let { regTime } = this.$data;
      // let params= '';
      // regTime===''? params= '/%E2%80%9C%E2%80%9D/': params= '/'+regTime
      let data = {
        serviceId: this.serviceId,
        eprEffectiveDate: regTime,
      };
      let res = await eprComplete(data);
      if (res.code === 0) {
        this.$message.success('操作成功');
        this.getInfo();
      }
      this.regVisible = false;
      this.regTime = '';
    },
    // 完成注册
    completeRegister() {
      this.regVisible = true;
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/EPRManage/index',
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
    relWork() {
      this.infos = this.isWeee ? [{ ...weeeObj }] : [{ ...battObj }];
      this.showSimpleWork = true;
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
    copyUIN() {
      //复制链接
      let _this = this;
      let clipboard = new this.clipboard('#uinStr');
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
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
.sub-title {
  font-size: 12px;
  margin: 8px 0;
  font-weight: bold;
  color: #333;
}
</style>
