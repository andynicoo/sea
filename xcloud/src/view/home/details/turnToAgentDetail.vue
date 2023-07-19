<template>
  <div class="detailWrapper">
    <div class="back">
      <p @click="goBack()"
         class="backBtn">
        <Icon type="md-arrow-back" />返回列表
      </p>
    </div>
    <div class="content"
         v-if="JSON.stringify(detailInfo) !='{}'">
      <div class="content-l">
        <Card>
          <p slot="title"
             class="declareFileBox">
            <span>申报资料</span>
            <span>
              <span class="btnArea view"
                    v-if="detailInfo.progressBar >= 20 && detailInfo.progressBar <=27">
                <Button type="primary"
                        style="margin-left:10px;"
                        v-if="detailInfo.countryCode === 'GB' && !isAuth"
                        @click="startTaxFun(detailInfo)">授权报税</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 19">
                <!-- <Button type="primary" ghost @click="sendMessage" style="margin-right:10px;">发送提醒</Button>   -->
                <Button type="primary"
                        @click="fileTaxModal=true"
                        v-if="detailInfo.taxType==1">填写报税信息</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 20">
                <Button type="primary"
                        ghost
                        @click="sendMessage(detailInfo.progressBar)"
                        style="margin-right:10px;">发送提醒</Button>
                <Button type="primary"
                        @click="fileTaxModal=true"
                        v-if="detailInfo.taxType==1">修改报税信息</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 21">
                <Button @click="sendMessage(detailInfo.progressBar)"
                        style="margin-right:10px">发送提醒</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode !== 'GB'"
                        @click="caculateTax"
                        style="margin-right:10px">计算税金</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 18">
                <Button type="primary"
                        @click="downLoad"
                        ghost
                        style="margin-right:10px;"
                        v-if="detailInfo.countryNameZh == '阿联酋'">下载申报资料</Button>
                <Button @click="sendMessage(detailInfo.progressBar)"
                        style="margin-right:10px">发送提醒</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode == 'SA'"
                        @click="invoicaBoxShow=true">录入发票号</Button>
                <Button v-if="detailInfo.countryCode == 'AE'"
                        type="primary"
                        @click="gibanBox=true">录入GIBAN</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 29">
                <!-- <Button type="primary" ghost @click="sendMessage" style="margin-right:10px;">发送提醒</Button>                             -->
                <Button type="primary"
                        v-if="detailInfo.countryCode === 'ES'&&tranferAgentInfo.taxTrackingNumber==''"
                        @click="sendTaxBox=true"
                        style="margin-right:8px;">填写寄送税局单号</Button>
                <Button type="primary"
                        v-show="hasAuthority('work_order_list13')"
                        @click="finishAgent">完成转代理</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 31">
                <Button type="primary"
                        ghost
                        @click="auditModal=true"
                        style="margin-right:10px;">审核资料</Button>
                <Button type="primary"
                        ghost
                        style="margin-right:10px;"
                        @click="supplierModal = true"
                        v-if="detailInfo.countryCode === 'FR'">选择服务商</Button>
                <Button type="primary"
                        ghost
                        @click="PreTaxCode=true"
                        v-if="detailInfo.countryCode === 'IT'"
                        style="margin-right:10px;">录入前税代编码</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 25">
                <Button type="primary"
                        @click="downLoad"
                        ghost
                        style="margin-right:10px;"
                        v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'&&detailInfo.countryNameZh != '意大利'">下载申报资料</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'DE'"
                        @click="uploadReceiptModal=true">上传回执</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 33">
                <Button type="primary"
                        @click="auditModal=true">审核</Button>
                <Button type="primary"
                        ghost
                        style="margin-right:10px;"
                        @click="supplierModal = true"
                        v-if="detailInfo.countryCode === 'FR'">选择服务商</Button>
              </span>
              <span v-if="detailInfo.progressBar==36">
                <!-- 36-待授权海牙认证 -->
                <Button type="primary"
                        v-if="detailInfo.countryCode === 'ES'"
                        @click="authorizationHauge=true">已收到资料</Button>
              </span>
              <span v-if="detailInfo.progressBar==37">
                <!-- 37-海牙认证中 -->
                <!-- <Button type="primary" v-show="hasAuthority('work_order_list05')" ghost @click="downLoad" style="margin-right:10px;">下载资料</Button> -->
                <Button type="primary"
                        v-if="detailInfo.countryCode === 'ES'&&tranferAgentInfo.hyTrackingNumber==''"
                        style="margin-right:10px;"
                        @click="enterTrankingNumber=true">填写寄送海牙单号</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode === 'ES'"
                        @click="enterHaugeInfo=true">录入海牙信息</Button>
              </span>
            </span>
          </p>
          <div class="basicInfo">
            <Form ref="companyInfo"
                  :model="companyInfo"
                  :label-width=120>
              <FormItem label="申报状态：">
                <span>{{progressStatus[detailInfo.progressBar]}}</span>
              </FormItem>
              <FormItem label="提交申报结果："
                        v-if="detailInfo.countryCode=='FR'">
                <span v-if="declareInfo.declarationStatus==0">暂无</span>
                <span v-if="declareInfo.declarationStatus==1"
                      style="color:#2d8cf0">提交成功</span>
                <span v-if="declareInfo.declarationStatus==2"
                      style="color:red">扣款失败</span>
                <span v-if="declareInfo.declarationStatus==3"
                      style="color:red">提交失败</span>
                <span style="cursor:pointer;"
                      v-if="declareInfo.declarationStatus==3"
                      @click="lookReason(1)">【重新提交】</span>
                <span style="cursor:pointer;"
                      v-if="declareInfo.declarationStatus==2"
                      @click="lookReason(2)">【查看原因】</span>
              </FormItem>
              <FormItem label="当前申报次数：">
                <span>{{detailInfo.declareCout}}</span>
              </FormItem>
              <FormItem label="当前申报区间：">
                <span v-if="tableData.length!=0">{{tableData[0].beginTime.substring(0,7)}}至{{tableData[0].endTime.substring(0,7)}}</span>
                <span v-else>{{detailInfo.beginTime}}至{{detailInfo.endTime}}</span>
              </FormItem>
              <FormItem label="申报回执："
                        v-if="detailInfo.progressBar === 25 || detailInfo.progressBar === 22 || detailInfo.progressBar === 27">
                <Button v-if="tableData[0].declareReceipt == '' && detailInfo.progressBar == 25 "
                        type="primary"
                        @click="uploadReceiptModal=true">点击上传</Button>
                <div v-else-if="declareInfo.declareReceipt != ''">
                  <a target="_blank"
                     v-for="(item,index) in declareInfo.declareReceipt.split(';')"
                     :key="index"
                     :href="item"
                     style="margin-right:5px;">{{"申报回执"}}</a>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="扣款回执："
                        v-if="(detailInfo.countryCode === 'IT'||detailInfo.countryCode === 'FR'||detailInfo.countryCode === 'ES') && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <a @click="previewDebit"
                   v-if="declareInfo.debitReceipt != 0">{{"扣款回执"}}</a>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="销售额文件："
                        v-if="tableData.length!=0">
                <div v-if="tableData[0].sellFile != ''">
                  <a target="_blank"
                     :href="tableData[0].sellFile"
                     style="margin-right:5px;">{{"点击下载"}}</a>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="Gateway ID："
                        v-if="detailInfo.countryCode=='GB'">
                <span>{{detailInfo.gatewayId}}</span>
              </FormItem>
              <FormItem label="密码："
                        v-if="detailInfo.countryCode=='GB'">
                <span>{{detailInfo.gatewayPassword}}</span>
              </FormItem>
              <div v-if="detailInfo.countryCode === 'SA' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <FormItem label="发票开具通知：">
                  <a v-if="tableData[0].invoiceReceipt != ''"
                     :href="tableData[0].invoiceReceipt"
                     target="_blank">{{"发票开具通知"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="纳税付款发票信件：">
                  <a v-if="tableData[0].payLetterInvoiceReceipt != ''"
                     :href="tableData[0].payLetterInvoiceReceipt"
                     target="_blank">{{"纳税付款发票信件"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="纳税付款系统发票：">
                  <a v-if="tableData[0].paySystemInvoiceReceipt != ''"
                     :href="tableData[0].paySystemInvoiceReceipt"
                     target="_blank">{{"纳税付款系统发票"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="税务申报接收通知：">
                  <a v-if="tableData[0].taxDeclareReceiveInformReceipt != ''"
                     :href="tableData[0].taxDeclareReceiveInformReceipt"
                     target="_blank">{{"税务申报接收通知"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="税务申请表：">
                  <a v-if="tableData[0].taxDeclareBlankReceipt != ''"
                     :href="tableData[0].taxDeclareBlankReceipt"
                     target="_blank">{{"税务申请表"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
              </div>
              <FormItem label="税金收款回执："
                        v-if="detailInfo.countryCode === 'AE' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <a v-if="tableData[0].taxesReceipt != ''"
                   :href="tableData[0].taxesReceipt"
                   target="_blank">{{"税金收款回执"}}</a>
                <span v-else>暂无</span>
              </FormItem>
            </Form>
          </div>
          <div class="transferAgentBox">
            <p class="btnBox">
              <span>转代理资料</span>
              <Button type="primary"
                      @click="downloadTransfer">下载转代理资料</Button>
            </p>
            <Form :label-width=168
                  :model="tranferAgentInfo"
                  ref="tranferAgentInfo"
                  :rules="ruleForm">
              <FormItem label="VAT税号："
                        prop="vatTaxNumber">
                <Input v-model="tranferAgentInfo.vatTaxNumber"
                       style="width:220px;"
                       :disabled="!isEditor" />
              </FormItem>
              <FormItem label="报税周期："
                        prop="declarePeriod">
                <Select v-model="tranferAgentInfo.declarePeriod"
                        placeholder="请选择报税周期"
                        style="width:220px;"
                        :disabled="!isEditor">
                  <Option :value="item.status"
                          v-for="(item,index) in declareList"
                          :key="index">{{item.type}}</Option>
                </Select>
              </FormItem>
              <FormItem label="公司中文名称："
                        prop="companyNameZh">
                <AutoComplete v-if="detailInfo.progressBar === 28"
                              v-model="tranferAgentInfo.companyNameZh"
                              :data="lenovoSearchList"
                              @on-select="selectCompany"
                              :disabled="!isEditor"
                              style="width:220px;"
                              placeholder="请输入公司中文名称">
                </AutoComplete>
                <Input v-else
                       v-model="tranferAgentInfo.companyNameZh"
                       style="width:220px;"
                       :disabled="!isEditor" />
              </FormItem>
              <FormItem label="公司英文名称："
                        prop="companyNameEn">
                <Input v-model="tranferAgentInfo.companyNameEn"
                       style="width:220px;"
                       :disabled="!isEditor" />
              </FormItem>
              <FormItem label="公司英文地址："
                        prop="companyAddressEnCountry"
                        class="requiredItem">
                <Input v-model="tranferAgentInfo.companyAddressEnCountry"
                       :disabled="!isEditor"
                       placeholder="如:China"
                       style="width:148px;margin-right:6px" />
                <Input v-model="tranferAgentInfo.companyAddressEnCity"
                       :disabled="!isEditor"
                       placeholder="如：ShenZhen"
                       style="width:148px;" /><br />
                <Input v-model="tranferAgentInfo.companyAddressEn"
                       :disabled="!isEditor"
                       placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                       style="width: 300px;margin-top:10px;"
                       type="textarea" />
              </FormItem>
              <div v-if="detailInfo.countryNameZh=='德国'">
                <FormItem label="邮编号码："
                          prop="postCode">
                  <Input v-model="tranferAgentInfo.postCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,0)"
                              placeholder="请选择上一次申报开始时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upBeginTime"
                              :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,1)"
                              placeholder="请选择上一次申报结束时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upEndTime"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="本地税号文件："
                          prop="vatTaxLocalFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxLocalFile')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxLocalFile')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxLocalFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxLocalFile!=''">
                      <a :href="tranferAgentInfo.vatTaxLocalFile"
                         target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxLocalFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="欧盟税号文件："
                          prop="vatTaxEuFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxEuFile')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxEuFile')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxEuFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxEuFile!=''">
                      <a :href="tranferAgentInfo.vatTaxEuFile"
                         target="_blank"
                         style="margin-right:20px;margin-left:20px">欧盟税号文件</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxEuFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="税务文件副本："
                          prop="vatTaxFileCopy">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxFileCopy')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxFileCopy')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxFileCopy==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxFileCopy!=''">
                      <a :href="tranferAgentInfo.vatTaxFileCopy"
                         target="_blank">税务文件副本</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxFileCopy')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='英国'">
                <FormItem label="法人中文名："
                          prop="companyLegalPersonZh">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名："
                          prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司邮箱："
                          prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司电话："
                          prop="companyTel">
                  <Input v-model="tranferAgentInfo.companyTel"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="描述下公司的经营内容："
                          prop="companyBusinessModeDescribe">
                  <Input v-model="tranferAgentInfo.companyBusinessModeDescribe"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期："
                          prop="taxEffectiveDate">
                  <DatePicker type="date"
                              placeholder="请选择税号生效日期"
                              style="width:200px"
                              v-model="tranferAgentInfo.taxEffectiveDate"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <DatePicker type="month"
                              placeholder="请选择上一次申报开始时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upBeginTime"
                              :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month"
                              placeholder="请选择上一次申报结束时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upEndTime"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="Gateway  ID：">
                  <Input v-model="tranferAgentInfo.gatewayId"
                         style="width:220px;"
                         :disabled='!isEditor'></Input>
                </FormItem>
                <FormItem label="密码：">
                  <Input v-model="tranferAgentInfo.gatewayPassword"
                         style="width:220px;"
                         :disabled='!isEditor'></Input>
                </FormItem>
                <FormItem label="营业执照扫描件/照片：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense"
                       target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="身份证正反面/护照：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'legalPersonPapers')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'legalPersonPapers')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.legalPersonPapers==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.legalPersonPapers!=''">
                    <a :href="tranferAgentInfo.legalPersonPapers"
                       target="_blank">{{'身份证正反面/护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','legalPersonPapers')" />
                  </div>
                </FormItem>
                <FormItem label="VAT证书：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatCertificate')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatCertificate')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatCertificate!=''">
                    <a :href="tranferAgentInfo.vatCertificate"
                       target="_blank">{{'VAT证书'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','vatCertificate')" />
                  </div>
                </FormItem>
                <FormItem label="在前代理最后一次申报回执：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt"
                       target="_blank">{{'申报回执'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="在前代理最后一次支付凭证：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate"
                       target="_blank">{{'支付凭证'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='意大利'">
                <FormItem label="公司统一社会信用代码："
                          prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名："
                          prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人身份证/护照号码："
                          prop="companyLegalPersonCard">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人身份证英文地址："
                          prop="companyLegalPersonCardAddress">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生地："
                          prop="companyLegalPersonBirthplace">
                  <Input v-model="tranferAgentInfo.companyLegalPersonBirthplace"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生日期："
                          prop="companyLegalPersonBirthday">
                  <DatePicker @on-change="changeLegalBirthDate"
                              :disabled="!isEditor"
                              :value="tranferAgentInfo.companyLegalPersonBirthday"
                              v-model="tranferAgentInfo.companyLegalPersonBirthday"
                              type="date"
                              placeholder="请选择法人出生日期"
                              style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="店铺链接："
                          prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="描述下公司的经营内容："
                          prop="companyBusinessModeDescribe">
                  <Input v-model="tranferAgentInfo.companyBusinessModeDescribe"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期："
                          prop="taxEffectiveDate">
                  <DatePicker type="date"
                              placeholder="请选择税号生效日期"
                              style="width:200px"
                              v-model="tranferAgentInfo.taxEffectiveDate"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,0)"
                              placeholder="请选择上一次申报开始时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upBeginTime"
                              :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,1)"
                              placeholder="请选择上一次申报结束时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upEndTime"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="税号文件："
                          prop="vatTaxNumberFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile"
                         target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史扣款回执："
                          prop="lastPayCertificate">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                      <a :href="tranferAgentInfo.lastPayCertificate"
                         target="_blank">历史扣款回执</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','lastPayCertificate')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执："
                          prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt"
                         target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="转代理授权书："
                          prop="registrationAuthorization">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'registrationAuthorization')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'registrationAuthorization')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.registrationAuthorization==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.registrationAuthorization!=''">
                      <a :href="tranferAgentInfo.registrationAuthorization"
                         target="_blank">转代理授权书</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','registrationAuthorization')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='西班牙'">
                <FormItem label='公司邮政编号：'
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyPostCode"
                         placeholder="公司邮政编号"
                         :disabled="!isEditor"
                         style="width:200px;"></Input>
                </FormItem>
                <FormItem label="是否有股权占比25%以上的股东："
                          class="requiredItem">
                  <RadioGroup v-model="stockGreaterThan25">
                    <Radio label="0"
                           :disabled="!isEditor">是</Radio>
                    <Radio label="1"
                           :disabled="!isEditor">否，没有</Radio>
                  </RadioGroup>
                </FormItem>
                <div v-for="(item,index) in sharesList"
                     :key="index"
                     v-if="stockGreaterThan25=='0'">
                  <FormItem label="股东姓名："
                            prop="shareholderZhName"
                            class="requiredItem">
                    <Input v-model="item.shareholderZhName"
                           placeholder="中文名"
                           :disabled="!isEditor"
                           style="width:148px;"></Input>
                    <Input v-model="item.shareholderEnName"
                           placeholder="英文名"
                           :disabled="!isEditor"
                           style="width:148px;margin-left:10px;"></Input>
                  </FormItem>
                  <FormItem label="股东身份证号码："
                            prop="identityCard"
                            class="requiredItem">
                    <Input v-model="item.identityCard"
                           style="width:300"
                           placeholder="请输入大股东身份证号码"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                </div>
                <FormItem label="公司统一社会信用代码："
                          prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司注册资本："
                          prop="companyRegisteredCapital"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyRegisteredCapital"
                         style="width:220px;"
                         :disabled="!isEditor" />万元
                </FormItem>
                <FormItem label="公司成立日期："
                          class="requiredItem">
                  <DatePicker @on-change="changeLegalBirthDate"
                              :disabled="!isEditor"
                              :value="tranferAgentInfo.companyRegisterData"
                              v-model="tranferAgentInfo.companyRegisterData"
                              type="date"
                              placeholder="请选择公司成立日期"
                              style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="公司营业执照注册城市："
                          prop="companyCreditCode"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyRegisteredCityZh"
                         style="width:150px;"
                         :disabled="!isEditor"
                         placeholder="请输入中文，如：深圳市" />
                  <Input v-model="tranferAgentInfo.companyRegisteredCityEn"
                         style="width:150px;"
                         :disabled="!isEditor"
                         placeholder="请输入英文，如：ShenZhen" />
                </FormItem>
                <FormItem label="法人中文姓名："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入法人中文姓名"
                         v-model="tranferAgentInfo.companyLegalPersonZh"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="法人英文姓名："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入法人英文姓名"
                         v-model="tranferAgentInfo.companyLegalPersonEn"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="法人出生日期："
                          class="requiredItem">
                  <DatePicker @on-change="changeLegalBirthDate"
                              :disabled="!isEditor"
                              :value="tranferAgentInfo.companyLegalPersonBirthday"
                              v-model="tranferAgentInfo.companyLegalPersonBirthday"
                              type="date"
                              placeholder="请选择法人出生日期"
                              style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="护照/身份证号码："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入护照/身份证号码"
                         v-model="tranferAgentInfo.companyLegalPersonCard"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="婚姻状况："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.legalPersonMaritalStatus">
                    <Radio :label="2"
                           :disabled="!isEditor">
                      <span>已婚</span>
                    </Radio>
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>未婚</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="法人性别："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.legalPersonSex">
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>男</span>
                    </Radio>
                    <Radio :label="2"
                           :disabled="!isEditor">
                      <span>女</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem v-if="detailInfo.countryNameZh=='西班牙'"
                          label="法人出生省市（中文）："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入省份"
                         v-model="tranferAgentInfo.legalPersonBirthplaceProvinceZh"
                         style="width: 150px" />
                  <Input :disabled="!isEditor"
                         placeholder="请输入城市"
                         v-model="tranferAgentInfo.legalPersonBirthplaceProvinceEn"
                         style="width: 150px" />
                </FormItem>
                <FormItem v-if="detailInfo.countryNameZh=='西班牙'"
                          label="法人出生省市（英文）："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入省份拼音"
                         v-model="tranferAgentInfo.legalPersonBirthplaceCityZh"
                         style="width: 150px" />
                  <Input :disabled="!isEditor"
                         placeholder="请输入城市拼音"
                         v-model="tranferAgentInfo.legalPersonBirthplaceCityEn"
                         style="width: 150px" />
                </FormItem>
                <FormItem label="法人身份证中文地址："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入法人身份证中文地址"
                         v-model="tranferAgentInfo.companyLegalPersonCardAddressZh"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="法人身份证英文地址："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入法人身份证英文地址"
                         v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="邮编号码："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入邮编号码"
                         v-model="tranferAgentInfo.postCode"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="平台店铺链接："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入平台店铺链接"
                         v-model="tranferAgentInfo.shopHref"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="是否已有EORI号："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.needEoriNumber">
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio :label="0"
                           :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="税号生效日期："
                          class="requiredItem">
                  <DatePicker v-model="tranferAgentInfo.taxEffectiveDate"
                              type="date"
                              placeholder="请选择税号生效日期"
                              style="width: 200px"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="描述下公司经营内容："
                          class="requiredItem">
                  <Input type="textarea"
                         :disabled="!isEditor"
                         placeholder="请输入经营内容"
                         v-model="tranferAgentInfo.companyBusinessModeDescribe"
                         style="width: 300px" />
                </FormItem>
                <FormItem label="货物进口及配送流程："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入货物进口及配送流程"
                         type="textarea"
                         v-model="tranferAgentInfo.shippingProcess"
                         style="width: 300px" />
                </FormItem>
                <FormItem label="西班牙本地银行账户信息："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入西班牙本地银行账户信息"
                         type="textarea"
                         v-model="tranferAgentInfo.localBankAccountInfo"
                         style="width: 300px" />
                </FormItem>
                <FormItem label="是否使用西班牙任何仓库："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.useEntrepot">
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio :label="2"
                           :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="是否开通泛欧："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.dredgeEuronext">
                    <Radio :label="2"
                           :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="是否有欧盟其他国家税号：">
                  <Input :disabled="!isEditor"
                         placeholder="如有可填写"
                         v-model="tranferAgentInfo.shopOtherEuTaxNumber"
                         style="width: 300px" />
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,0)"
                              placeholder="请选择上一次申报开始时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upBeginTime"
                              :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,1)"
                              placeholder="请选择上一次申报结束时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upEndTime"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <p>（2选1）营业执照扫描件/商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件 --- 必填</p>
                <FormItem label="营业执照扫描件/照片：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense"
                       target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="!isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="商业登记证BR：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                    <a :href="tranferAgentInfo.companyBusinessRegistrationBr"
                       target="_blank">商业登记证BR</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                  </div>
                </FormItem>
                <FormItem label="公司注册证明书CI：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                    <a :href="tranferAgentInfo.companyRegistrationCi"
                       target="_blank">公司注册证明书CI</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyRegistrationCi')" />
                  </div>
                </FormItem>
                <FormItem label="法团成立表格NNC1：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                    <a :href="tranferAgentInfo.companyCorporateFoundingNnc1"
                       target="_blank">法团成立表格NNC1</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                  </div>
                </FormItem>
                <p>（2选1）身份证正反面扫描件 / 护照扫描件 --- 必填</p>
                <FormItem label="身份证正反面：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront"
                       target="_blank">{{'身份证正反面/护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
                <FormItem label="护照：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport"
                       target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <p>以下三种必填 --- 必填</p>
                <FormItem label="公司信用报告："
                          class="requiredItem">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCreditReport')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCreditReport')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCreditReport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCreditReport!=''">
                    <a :href="tranferAgentInfo.companyCreditReport"
                       target="_blank">{{'公司信用报告'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyCreditReport')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件："
                          prop="vatTaxNumberFile"
                          class="requiredItem">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile"
                         target="_blank">税号文件</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执："
                          prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt"
                         target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='法国'">
                <FormItem label="公司邮箱："
                          prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司邮编号码："
                          prop="companyPostCode">
                  <Input v-model="tranferAgentInfo.companyPostCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人中文名："
                          prop="companyLegalPersonZh"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名："
                          prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生日期："
                          prop="companyLegalPersonBirthday">
                  <DatePicker v-model="tranferAgentInfo.companyLegalPersonBirthday"
                              type="date"
                              placeholder="请选择税号生效日期"
                              style="width: 200px"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="邮编号码："
                          prop="legalPersonPostCode">
                  <Input v-model="tranferAgentInfo.legalPersonPostCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="身份证/护照号码：">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard"
                         placeholder="请填身份证号码"
                         style="width:220px;"
                         :disabled="!isEditor" />
                  <Input v-model="tranferAgentInfo.legalPersonCardPassportNumber"
                         placeholder="请填护照号码"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生省份："
                          prop="legalPersonBirthplaceProvinceZh">
                  <Input v-model="tranferAgentInfo.legalPersonBirthplaceProvinceZh"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司统一社会信用代码："
                          prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司注册资本："
                          prop="companyRegisteredCapital"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyRegisteredCapital"
                         style="width:220px;"
                         :disabled="!isEditor" />万元
                </FormItem>
                <FormItem label="法人身份证英文地址："
                          prop="companyLegalPersonCardAddress">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="店铺链接："
                          prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="是否已有EORI号："
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.needEoriNumber">
                    <Radio :label="1"
                           :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio :label="0"
                           :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="税号生效日期："
                          class="requiredItem">
                  <DatePicker v-model="tranferAgentInfo.taxEffectiveDate"
                              type="date"
                              placeholder="请选择税号生效日期"
                              style="width: 200px"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="是否有欧盟其他国家税号：">
                  <Input :disabled="!isEditor"
                         placeholder="如有可填写"
                         v-model="tranferAgentInfo.shopOtherEuTaxNumber"
                         style="width: 300px" />
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,0)"
                              placeholder="请选择上一次申报开始时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upBeginTime"
                              :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month"
                              @on-change="dateChangeBefore($event,1)"
                              placeholder="请选择上一次申报结束时间"
                              style="width:200px"
                              v-model="tranferAgentInfo.upEndTime"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <p>（2选1）营业执照扫描件/商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件 --- 必填</p>
                <FormItem label="营业执照扫描件/照片：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense"
                       target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="商业登记证BR：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                    <a :href="tranferAgentInfo.companyBusinessRegistrationBr"
                       target="_blank">商业登记证BR</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                  </div>
                </FormItem>
                <FormItem label="公司注册证明书CI：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                    <a :href="tranferAgentInfo.companyRegistrationCi"
                       target="_blank">公司注册证明书CI</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyRegistrationCi')" />
                  </div>
                </FormItem>
                <FormItem label="法团成立表格NNC1：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                    <a :href="tranferAgentInfo.companyCorporateFoundingNnc1"
                       target="_blank">法团成立表格NNC1</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                  </div>
                </FormItem>
                <p>（2选1）身份证正反面扫描件 / 护照扫描件 --- 必填</p>
                <FormItem label="身份证正反面：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront"
                       target="_blank">{{'身份证正反面/护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
                <FormItem label="护照：">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport"
                       target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <p>以下三种必填 --- 必填</p>
                <FormItem label="后台截图："
                          prop="shopConsoleScreenshot"
                          class="requiredItem">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                    <a :href="tranferAgentInfo.shopConsoleScreenshot"
                       target="_blank">{{'后台截图'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件："
                          prop="vatTaxNumberFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile"
                         target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执："
                          prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt"
                         target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史支付回执："
                          prop="lastPayCertificate">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isEditor'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                      <a :href="tranferAgentInfo.lastPayCertificate"
                         target="_blank">历史支付回执</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','lastPayCertificate')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='沙特'">
                <FormItem label="联系电话："
                          prop="companyLegalPersonMobile"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonMobile"
                         placeholder="请输入常用联系手机号"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系邮箱："
                          prop="companyLegalPersonEmail"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEmail"
                         placeholder="请输入常用联系邮箱"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="店铺性质："
                          prop="shopNature"
                          class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.shopNature">
                    <Radio label="1"
                           :disabled="!isEditor">公司经营</Radio>
                    <Radio label="2"
                           :disabled="!isEditor">个体工商户</Radio>
                  </RadioGroup>
                </FormItem>
                <div v-if="tranferAgentInfo.shopNature==1">
                  <FormItem label="统一社会信用代码："
                            prop="companyCreditCode"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyCreditCode"
                           placeholder=" 请输入营业执照的信用代码"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司成立日期："
                            prop="companyRegisterData"
                            class="requiredItem">
                    <DatePicker type="date"
                                placeholder="请选择公司成立日期"
                                v-model="tranferAgentInfo.companyRegisterData"
                                format="yyyy-MM-dd"
                                class="tax-date"
                                :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人中文名："
                            prop="companyLegalPersonZh"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonZh"
                           placeholder="请填写中文名字"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人英文名："
                            prop="companyLegalPersonEn"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                           placeholder="请填写英文名字"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人出生日期："
                            prop="companyLegalPersonBirthday"
                            class="requiredItem">
                    <DatePicker type="date"
                                placeholder="请选择法人出生日期"
                                v-model="tranferAgentInfo.companyLegalPersonBirthday"
                                format="yyyy-MM-dd"
                                class="tax-date"
                                :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址："
                            prop="companyLegalPersonCardAddress"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                           placeholder="请输入法人身份证英文地址"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="账户名称："
                            prop="bankAccountName"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAccountName"
                           placeholder="请输入账户名称"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="银行名称："
                            prop="bankName"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankName"
                           placeholder="请输入银行名称"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="银行地址："
                            prop="bankAddress"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAddress"
                           placeholder="请输入支行名称"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="IBAN/银行账户："
                            prop="bankAccount"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAccount"
                           placeholder="请输入IBAN/银行账户"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="Swift / BIC："
                            prop="swiftBic"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.swiftBic"
                           placeholder="请输入Swift / BIC"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司网站："
                            prop="companyWebsite"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyWebsite"
                           placeholder="请填写公司网站"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司股份情况："
                            prop="companyStockCondition"
                            class="requiredItem">
                    <div class="shares-box"
                         v-for="(item,index) in sharesList"
                         :key="index">
                      <FormItem label="股东姓名："
                                prop="shareholderZhName"
                                :label-width="110"
                                class="requiredItem">
                        <Input v-model="item.shareholderZhName"
                               placeholder="中文名"
                               :disabled="!isEditor"
                               style="width:120px;"></Input>
                        <Input v-model="item.shareholderEnName"
                               placeholder="英文名"
                               :disabled="!isEditor"
                               style="width:150px;margin-left:10px;"></Input>
                      </FormItem>
                      <FormItem label="股东职位："
                                prop="position"
                                :label-width="110"
                                class="requiredItem">
                        <Select v-model="item.position"
                                placeholder="股东职位"
                                :disabled="!isEditor">
                          <Option :value="i.value"
                                  v-for="(i,index) in positionList"
                                  :key="index">{{i.value}}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="占股百分比："
                                prop="stockProportion"
                                :label-width="110"
                                class="requiredItem">
                        <Input v-model="item.stockProportion"
                               placeholder="中文名"
                               :disabled="!isEditor"
                               style="width:285px;"></Input>%
                      </FormItem>
                      <FormItem label="出生日期："
                                :label-width="110"
                                prop="shareholderBirthday">
                        <DatePicker type="date"
                                    placeholder="请选择出生日期"
                                    v-model="item.shareholderBirthday"
                                    format="yyyy-MM-dd"
                                    :disabled="!isEditor"
                                    style="width:285px;"></DatePicker>
                      </FormItem>
                      <Button v-if="index>0&&isEditor"
                              @click="removeShares(index)">删除</Button>
                    </div>
                    <p class="shares-tips">温馨提示：请详细填写完整的公司股份占比信息；</p>
                    <Button @click="addShares">+添加</Button>
                  </FormItem>
                </div>
                <div v-if="tranferAgentInfo.shopNature==2">
                  <FormItem label="法人中文名："
                            prop="companyLegalPersonZh"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonZh"
                           placeholder="请填写中文名字"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人英文名："
                            prop="companyLegalPersonEn"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                           placeholder="请填写英文名字"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人出生日期："
                            prop="companyLegalPersonBirthday"
                            class="requiredItem">
                    <DatePicker type="date"
                                placeholder="请选择法人出生日期"
                                v-model="tranferAgentInfo.companyLegalPersonBirthday"
                                format="yyyy-MM-dd"
                                class="tax-date"
                                :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人出生地："
                            prop="companyLegalPersonBirthplace"
                            class="requiredItem">
                    <Select v-model="tranferAgentInfo.companyLegalPersonBirthplace"
                            placeholder="请选择法人出生地"
                            :disabled="!isEditor">
                      <Option v-for="item in placeList"
                              :value="item"
                              :key="item.value">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="职业："
                            prop="profession"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.profession"
                           placeholder="请输入职业"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码："
                            prop="companyCreditCode"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyCreditCode"
                           placeholder="工商统一信用代码"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人身份证英文地址："
                            prop="companyLegalPersonCardAddress"
                            class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                           placeholder="请输入法人身份证英文地址"
                           :disabled="!isEditor"></Input>
                  </FormItem>
                </div>
                <Divider />

                <FormItem label="店铺后台链接："
                          prop="shopHref"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopHref"
                         placeholder=" 请输入店铺后台链接"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="电商平台账号完整名称："
                          prop="shopSalePlatformAccount"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSalePlatformAccount"
                         placeholder=" 请输入电商平台账号完整名称"
                         :disabled="!isEditor"></Input>
                </FormItem>

                <FormItem label="税号生效日期："
                          prop="taxEffectiveDate"
                          class="requiredItem">
                  <DatePicker type="date"
                              placeholder="请选择税号生效日期"
                              @on-change="changeVatDate($event,'taxEffectiveDate')"
                              v-model="tranferAgentInfo.taxEffectiveDate"
                              class="tax-date"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="在沙特前12个月的销售额："
                          prop="shopSaleBefore"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSaleBefore"
                         placeholder=" 请输入在沙特前12个月的销售额"
                         :disabled="!isEditor"
                         style="width:220px"></Input>SAR（币种：沙特里亚尔）
                </FormItem>
                <FormItem label="预计未来12个月销售额："
                          prop="shopSalePlan"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSalePlan"
                         placeholder=" 请输入预计未来12个月销售额"
                         :disabled="!isEditor"
                         style="width:220px"></Input>SAR（币种：沙特里亚尔）
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime">
                  <div class="clearfix">
                    <div class="fl">
                      <FormItem class="requiredItem">
                        <DatePicker type="month"
                                    placeholder="开始时间"
                                    @on-change="changeVatDate($event,'upBeginTime')"
                                    style="width: 160px"
                                    v-model="tranferAgentInfo.upBeginTime"
                                    format="yyyy-MM"
                                    :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                    <span style="text-align: center"
                          class="fl">——</span>
                    <div class="fl">
                      <FormItem prop="upEndTime">
                        <DatePicker type="month"
                                    placeholder="结束时间"
                                    @on-change="changeVatDate($event,'upEndTime')"
                                    style="width: 160px"
                                    v-model="tranferAgentInfo.upEndTime"
                                    format="yyyy-MM"
                                    :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="营业执照扫描件："
                          prop="companyBusinessLicense">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense"
                       target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="法人护照扫描件："
                          prop="companyLegalPersonCardPassport"
                          class="requiredItem">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport"
                       target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="后台店铺截图："
                          prop="shopConsoleScreenshot"
                          class="requiredItem">
                  <div class="upload-file-box">
                    <Upload type="drag"
                            :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            style="width:300px"
                            :disabled="!isEditor">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                      <a :href="tranferAgentInfo.shopConsoleScreenshot"
                         target="_blank">{{'后台店铺截图'}}</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="税号文件："
                          prop="vatTaxNumberFile"
                          class="requiredItem">
                  <Upload type="drag"
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile"
                       target="_blank">{{'税号文件'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="历史申报回执："
                          prop="lastDeclareReceipt"
                          class="requiredItem">
                  <Upload type="drag"
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastDeclareReceipt')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf','zip']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt"
                       target="_blank">{{'历史申报回执'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="历史扣款回执："
                          prop="lastPayCertificate"
                          class="requiredItem">
                  <Upload type="drag"
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastPayCertificate')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf','zip']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate"
                       target="_blank">{{'历史扣款回执'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="转代理原因："
                          prop="transformProxyReason"
                          class="reason requiredItem">
                  <Input v-model="tranferAgentInfo.transformProxyReason"
                         placeholder="请填写转代理原因"
                         :disabled="!isEditor"
                         type="textarea"
                         :rows="4"></Input>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='阿联酋'">
                <FormItem label="邮政编码："
                          prop="postCode"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.postCode"
                         placeholder="请输入邮政编码"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系电话："
                          prop="companyLegalPersonMobile"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonMobile"
                         placeholder="请输入常用联系手机号"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系邮箱："
                          prop="companyLegalPersonEmail"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEmail"
                         placeholder="请输入常用联系邮箱"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="账户名称："
                          prop="bankAccountName"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankAccountName"
                         placeholder="请输入账户名称"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="银行名称："
                          prop="bankName"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankName"
                         placeholder="请输入银行名称"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="支行名称："
                          prop="bankSubBranchName"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankSubBranchName"
                         placeholder="请输入支行名称"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="IBAN/银行账户："
                          prop="bankAccount"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankAccount"
                         placeholder="请输入IBAN/银行账户"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="Swift / BIC："
                          prop="swiftBic"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.swiftBic"
                         placeholder="请输入Swift / BIC"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人中文名："
                          prop="companyLegalPersonZh"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh"
                         placeholder="请填写中文名字"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人英文名："
                          prop="companyLegalPersonEn"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn"
                         placeholder="请填写英文名字"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人护照号："
                          prop="legalPersonCardPassportNumber"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.legalPersonCardPassportNumber"
                         placeholder="请填写法人护照号"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="护照到期时间："
                          prop="legalPersonCardPassportPastTime"
                          class="requiredItem">
                  <DatePicker type="date"
                              placeholder="请选择护照到期时间"
                              v-model="tranferAgentInfo.legalPersonCardPassportPastTime"
                              format="yyyy-MM-dd"
                              class="tax-date"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <Divider />
                <FormItem label="店铺链接："
                          prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期："
                          prop="taxEffectiveDate"
                          class="requiredItem">
                  <DatePicker type="date"
                              placeholder="请选择税号生效日期"
                              @on-change="changeVatDate($event,'taxEffectiveDate')"
                              v-model="tranferAgentInfo.taxEffectiveDate"
                              class="tax-date"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="超过阈值或预计超过阈值的日期："
                          prop="thresholdValueTime"
                          class="requiredItem">
                  <DatePicker type="date"
                              placeholder="请选择超过阈值或预计超过阈值的日期"
                              @on-change="changeVatDate($event,'thresholdValueTime')"
                              v-model="tranferAgentInfo.thresholdValueTime"
                              class="tax-date"
                              :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="过去12个月在阿联酋的营业额："
                          prop="shopSaleBefore"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSaleBefore"
                         placeholder=" 请输入过去12个月在阿联酋的营业额"
                         :disabled="!isEditor"
                         style="width:220px"></Input>AED（币种：阿联酋迪拉姆）
                </FormItem>
                <FormItem label="预计未来30天的营业额："
                          prop="future30Sale"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.future30Sale"
                         placeholder=" 请输入预计未来30天的营业额"
                         :disabled="!isEditor"
                         style="width:220px"></Input>AED（币种：阿联酋迪拉姆）
                </FormItem>
                <FormItem label="是否在其它海湾国家有税号或在该国有事进出口业务？："
                          prop="otherGulfStateDutyOrServices"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.otherGulfStateDutyOrServices"
                         placeholder=" 如没有，请填写无"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="选择申请人的其它商业活动："
                          prop="otherBusinessActivities"
                          class="requiredItem">
                  <Select v-model="tranferAgentInfo.otherBusinessActivities"
                          placeholder="请选择"
                          :disabled="!isEditor">
                    <Option :value="i.value"
                            v-for="(i,index) in commerceList"
                            :key="index">{{i.value}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="上一次申报区间："
                          prop="upBeginTime"
                          class="requiredItem">
                  <div class="clearfix">
                    <div class="fl">
                      <FormItem>
                        <DatePicker type="month"
                                    placeholder="开始时间"
                                    @on-change="changeVatDate($event,'upBeginTime')"
                                    style="width: 160px"
                                    v-model="tranferAgentInfo.upBeginTime"
                                    format="yyyy-MM"
                                    :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                    <span style="text-align: center"
                          class="fl">——</span>
                    <div class="fl">
                      <FormItem prop="upEndTime">
                        <DatePicker type="month"
                                    placeholder="结束时间"
                                    @on-change="changeVatDate($event,'upEndTime')"
                                    style="width: 160px"
                                    v-model="tranferAgentInfo.upEndTime"
                                    format="yyyy-MM"
                                    :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="营业执照扫描件："
                          prop="companyBusinessLicense"
                          class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          type="drag"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense"
                       target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="法人护照扫描件："
                          prop="companyLegalPersonCardPassport"
                          class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardPassport')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          type="drag"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport"
                       target="_blank">法人护照扫描件</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件："
                          prop="vatTaxNumberFile"
                          class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          type="drag"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile"
                       target="_blank">税号文件</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="后台店铺截图："
                          prop="shopConsoleScreenshot"
                          class="requiredItem">
                  <div class="upload-file-box">
                    <Upload type="drag"
                            :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            style="width:300px"
                            :disabled="!isEditor">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                      <a :href="tranferAgentInfo.shopConsoleScreenshot"
                         target="_blank">{{'后台店铺截图'}}</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="公司章程："
                          prop="articlesOfAssociationFile"
                          class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            :disabled="!isEditor"
                            type="drag"
                            style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.articlesOfAssociationFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.articlesOfAssociationFile!=''">
                      <a :href="tranferAgentInfo.articlesOfAssociationFile"
                         target="_blank">公司章程</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','articlesOfAssociationFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="上传销售证据："
                          prop="salesEvidenceFile"
                          class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'salesEvidenceFile')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'salesEvidenceFile')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            :disabled="!isEditor"
                            type="drag"
                            style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.salesEvidenceFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.salesEvidenceFile!=''">
                      <a :href="tranferAgentInfo.salesEvidenceFile"
                         target="_blank">销售证据</a>
                      <Icon v-if="isEditor"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','salesEvidenceFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史缴税支付证明："
                          prop="lastPayCertificate"
                          class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastPayCertificate')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf','zip']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          type="drag"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate"
                       target="_blank">历史缴税支付证明</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
                <FormItem label="罚款记录和交罚款证明（选填）："
                          prop="recordOfPenaltyCharges"
                          class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'recordOfPenaltyCharges')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'recordOfPenaltyCharges')}"
                          :action="fileUpload"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf','zip']"
                          :show-upload-list="false"
                          :disabled="!isEditor"
                          type="drag"
                          style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.recordOfPenaltyCharges==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.recordOfPenaltyCharges!=''">
                    <a :href="tranferAgentInfo.recordOfPenaltyCharges"
                       target="_blank">罚款记录和交罚款证明</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','recordOfPenaltyCharges')" />
                  </div>
                </FormItem>
                <Divider />
                <p>阿联酋税局账号和密码（选填）</p>
                <FormItem label="税局账号："
                          style="margin-top:18px">
                  <Input v-model="tranferAgentInfo.gatewayId"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="密码：">
                  <Input v-model="tranferAgentInfo.gatewayPassword"
                         :disabled="!isEditor"></Input>
                </FormItem>
              </div>
              <FormItem label="法人签名："
                        v-if="(detailInfo.progressBar === 28 || detailInfo.progressBar === 29 || detailInfo.progressBar === 31 || detailInfo.progressBar === 32) && (detailInfo.countryCode === 'GB' || detailInfo.countryCode === 'DE')"
                        prop="companyLegalPersonSign">
                <div class="legalPersonSign">
                  <img v-if="tranferAgentInfo.companyLegalPersonSign !== '' && tranferAgentInfo.companyLegalPersonSign !== undefined"
                       :src="tranferAgentInfo.companyLegalPersonSign"
                       alt="">
                </div>
              </FormItem>
              <FormItem>
                <Button v-if="detailInfo.progressBar==32 || detailInfo.progressBar==28"
                        :loading="saveLosding"
                        @click="saveForm"
                        style="margin-right:15px;">保存</Button>
                <Button v-if="detailInfo.progressBar==32 || detailInfo.progressBar==28 || detailInfo.progressBar==31"
                        type="primary"
                        :loading="submitLoading"
                        @click="clickSubmit">提交</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
      <div class="content-r">
        <Card>
          <p slot="title">税号信息</p>
          <Form :label-width=100
                v-if="detailInfo.progressBar >19 && detailInfo.progressBar < 28">
            <FormItem label="VAT税号：">
              <span>{{detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber: "暂无"}}</span>
            </FormItem>
            <FormItem label="EORI号：">
              <span>{{detailInfo.eoriNumber ? detailInfo.eoriNumber: "暂无"}}</span>
            </FormItem>
            <FormItem label="税号下发日期：">
              <span>{{detailInfo.taxIssueDate ? detailInfo.taxIssueDate.substring(0,10): "暂无"}}</span>
            </FormItem>
            <FormItem label="税号生效日期：">
              <span>{{detailInfo.taxEffectiveDate ? detailInfo.taxEffectiveDate.substring(0,10): "暂无"}}</span>
            </FormItem>
            <FormItem label="申报周期：">
              <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报': detailInfo.periodType == 2 ? '年报' : detailInfo.periodType == -1 ? '暂无' : ''}}</span>
            </FormItem>
            <FormItem label="申报国家：">
              <span>{{detailInfo.countryNameZh ? detailInfo.countryNameZh : '暂无'}}</span>
            </FormItem>
            <FormItem label="前税代编码：">
              <span>{{detailInfo.cfOldRap ? detailInfo.cfOldRap : '暂无'}}</span>
            </FormItem>

            <!-- 德国 -->
            <FormItem label="本地税号文件："
                      v-if="detailInfo.countryCode === 'DE'">
              <span v-if="tranferAgentInfo.vatTaxLocalFile!==''">
                <a :href="tranferAgentInfo.vatTaxLocalFile"
                   target="_blank">{{"本地税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="欧盟税号文件："
                      v-if="detailInfo.countryCode === 'DE'">
              <span v-if="tranferAgentInfo.vatTaxEuFile!==''">
                <a :href="tranferAgentInfo.vatTaxEuFile"
                   target="_blank">{{"欧盟税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="税务副本："
                      v-if="detailInfo.countryCode === 'DE'">
              <span v-if="detailInfo.vatTaxNumberCopyFile!==''">
                <a :href="detailInfo.vatTaxNumberCopyFile"
                   target="_blank">{{"税务副本"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>

            <!-- 德国 end-->
            <FormItem label="VAT税号文件："
                      v-if="detailInfo.countryCode !== 'DE'">
              <span v-if="detailInfo.vatTaxNumberFile!==''">
                <a :href="detailInfo.vatTaxNumberFile"
                   target="_blank">{{"VAT税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="EORI文件：">
              <span v-if="detailInfo.eoriNumberFile!==''">
                <a :href="detailInfo.eoriNumberFile"
                   target="_blank">{{"EORI文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="VAT证书："
                      v-if="detailInfo.countryCode !== 'DE'">
              <span v-if="detailInfo.vatCertificate!==''">
                <a :href="detailInfo.vatCertificate"
                   target="_blank">{{"VAT证书"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="Gateway ID："
                      v-if="detailInfo.countryCode=='GB'">
              <span>{{detailInfo.gatewayId ? detailInfo.gatewayId :''}}</span>
            </FormItem>
            <FormItem label="密码："
                      v-if="detailInfo.countryCode=='GB'">
              <span>{{detailInfo.gatewayPassword ? detailInfo.gatewayPassword : '暂无'}}</span>
            </FormItem>
            <FormItem label="海牙文件："
                      v-if="detailInfo.countryCode=='ES'">
              <span v-if="detailInfo.hyFile!==''">
                <a :href="detailInfo.hyFile"
                   target="_blank">{{"海牙文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
          </Form>
          <Form :label-width=100
                v-else>
            <FormItem label="VAT税号：">
              <span>{{detailInfo.vatTaxNumber}}</span>
            </FormItem>
            <FormItem label="税号下发日期：">
              <span>{{detailInfo.taxIssueDate.substring(0,10)}}</span>
            </FormItem>
            <FormItem label="税号生效日期：">
              <span>{{detailInfo.taxEffectiveDate.substring(0,10)}}</span>
            </FormItem>
            <FormItem label="申报周期：">
              <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报': detailInfo.periodType == 2 ? '年报' : detailInfo.periodType == -1 ? '暂无' : ''}}</span>
            </FormItem>
            <FormItem label="申报国家：">
              <span>{{detailInfo.countryNameZh}}</span>
            </FormItem>
            <FormItem label="前税代编码：">
              <span>{{tranferAgentInfo.cfOldRap ? tranferAgentInfo.cfOldRap : '暂无'}}</span>
            </FormItem>
            <FormItem label='转代理授权书：'
                      v-if="detailInfo.countryCode=='IT'||detailInfo.countryCode=='FR'">
              <span v-if="tranferAgentInfo.registrationAuthorization==''">{{"暂无"}}</span>
              <a :href="tranferAgentInfo.registrationAuthorization"
                 target="_blank"
                 v-if="tranferAgentInfo.registrationAuthorization!==''">{{"注册授权书"}}</a>
            </FormItem>
            <FormItem label="VAT税号文件：">
              <span v-if="detailInfo.vatTaxNumberFile!==''">
                <a :href="detailInfo.vatTaxNumberFile"
                   target="_blank">{{"VAT税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <!-- <FormItem label="VAT税号证书（新）：" v-if="detailInfo.countryCode=='IT' && (detailInfo.progressBar === 33 || detailInfo.progressBar === 34 || detailInfo.progressBar === 35) ">
                            <span v-if="detailInfo.vatCertificateNew!==''"><a :href="detailInfo.vatCertificateNew" target="_blank">{{"VAT税号证书（新）"}}</a></span>
                            <span v-else>{{'暂无'}}</span>
                        </FormItem> -->
            <FormItem label="服务商："
                      v-if="detailInfo.countryCode=='FR'">
              <span>{{detailInfo.supplierName || '暂无'}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">服务信息</p>
          <Form :label-width=100>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="服务号：">
              <span>{{detailInfo.serverNo}}</span>
            </FormItem>
            <FormItem label="申报状态：">
              <span>{{progressStatus[detailInfo.progressBar]}}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{detailInfo.companyName}}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>{{ detailInfo.productFunctionCode == '1' ? "税号注册" : detailInfo.productFunctionCode == '2' ? "税务申报" : detailInfo.productFunctionCode == '3' ? "税务补缴" : detailInfo.productFunctionCode == '4' ? "转代理" : ''}}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{detailInfo.countryNameZh}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{detailInfo.createTime}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card v-if="detailInfo.countryCode=='ES'&&detailInfo.progressBar !==28&&detailInfo.progressBar !==33&&detailInfo.progressBar !==38"
              style="margin-top: 6px;">
          <p slot="title">物流信息</p>
          <Form :label-width=100>
            <FormItem label="寄送海牙单号：">
              <span>{{tranferAgentInfo.hyTrackingNumber==''?'暂无':tranferAgentInfo.hyTrackingNumber}}</span>
            </FormItem>
            <FormItem label="寄送税局单号：">
              <span>{{tranferAgentInfo.taxTrackingNumber==''?'暂无':tranferAgentInfo.taxTrackingNumber}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width=100>
            <FormItem label="用户昵称：">
              <span>{{detailInfo.userNickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{detailInfo.userMobile}}</span>
            </FormItem>
            <FormItem label="用户级别：">
              <span>{{''}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{detailInfo.userCompanyName}}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{detailInfo.userAddress}}</span>
            </FormItem>
          </Form>
        </Card>
      </div>
      <Modal v-model="uploadReceiptModal"
             @on-visible-change="modalState"
             title="上传回执">
        <Upload ref="declareFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :before-upload="beroreDeclareUpload"
                :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,1)}"
                :on-remove="(file,fileList)=>{removeDeclare(file,fileList,1)}"
                style="width:260px"
                v-if="countryCode=='GB'||countryCode=='DE'">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="countryCode=='IT'||countryCode=='ES'||countryCode=='FR'">
          <p>申报回执（选填）：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUpload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,1)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,1)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传申报回执（可上传多张）</span>
            </div>
          </Upload>
          <p>扣款回执（选填）：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUploadDebitReceipt"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,2)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,2)}"
                  style="width:260px">
            <span v-if="tranferAgentInfo.uploadDebitReceipt==''">扣款回执</span>
            <span v-else>点击或拖拽文件到此区域重新上传</span>
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传扣款回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode=='SA'">
          <p>发票开具通知：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUpload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,5)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,5)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <div v-if="!isRowBtn && tableData.length!=0&&tableData[0].declareRule!=2">
            <p>纳税付款发票信件：</p>
            <Upload ref="declareFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreDeclareUpload"
                    :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,6)}"
                    :on-remove="(file,fileList)=>{removeDeclare(file,fileList,6)}"
                    style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload ref="declareFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreDeclareUpload"
                    :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,7)}"
                    :on-remove="(file,fileList)=>{removeDeclare(file,fileList,7)}"
                    style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <div v-if="isRowBtn && rowData.declareRule!=2">
            <p>纳税付款发票信件：</p>
            <Upload ref="declareFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreDeclareUpload"
                    :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,6)}"
                    :on-remove="(file,fileList)=>{removeDeclare(file,fileList,6)}"
                    style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload ref="declareFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreDeclareUpload"
                    :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,7)}"
                    :on-remove="(file,fileList)=>{removeDeclare(file,fileList,7)}"
                    style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <p>税务申报接收通知：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUpload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,8)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,8)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <p>税务申请表：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUpload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,9)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,9)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode=='AE'">
          <p>税金收款回执：</p>
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUpload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,10)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,10)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="uploadReceiptModal=false">取消</Button>
          <Button type="primary"
                  @click="sureUpload">确认</Button>
        </p>
      </Modal>
      <Modal v-model="fileTaxModal"
             :title="detailInfo.progressBar == 19?'填写报税信息':'修改报税信息'">
        <Form :model="fileTaxForm"
              label-position="top">
          <FormItem label='当前申报区间：'>
            <DatePicker type="month"
                        @on-change="dateChange($event,0)"
                        placeholder="请选择下一次申报开始时间"
                        v-model="bindTime.beginTime"
                        style="width:200px"></DatePicker>
            <DatePicker type="month"
                        @on-change="dateChange($event,1)"
                        placeholder="请选择下一次申报结束时间"
                        v-model="bindTime.endTime"
                        style="width:200px"></DatePicker>
          </FormItem>
          <FormItem label="申报周期：">
            <Select v-model="fileTaxForm.periodType"
                    clearable
                    placeholder="请选择申报周期">
              <Option :value="item.status"
                      v-for="(item,index) in declearList"
                      :key="index">{{item.type}}</Option>
            </Select>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="fileTaxModal=false">取消</Button>
          <Button type="primary"
                  @click="sureFileTax">确认</Button>
        </p>
      </Modal>
      <Modal v-model="auditModal"
             @on-visible-change="modalState"
             :title="detailInfo.progressBar==31?'审核资料':'审核税金到账'">
        <p>{{detailInfo.progressBar==31?'审核通过后开始提交注册':'是否确认用户税金到账？'}}</p>
        <p>
          <RadioGroup v-model="isAudit">
            <Radio label="1">
              <span>{{detailInfo.progressBar==31?'审核通过':'确认到账'}}</span>
            </Radio>
            <Radio label="0">
              <span>{{detailInfo.progressBar==31?'资料不对，驳回':'税金有误，驳回'}}</span>
            </Radio>
          </RadioGroup>
        </p>
        <p v-show="isAudit=='0'">
          <Input v-model="remark"
                 type="textarea"
                 placeholder="请输入驳回原因" />
        </p>
        <div v-if="countryCode=='IT'">
          <Checkbox v-model="needApiIT">API提交转代理申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="countryCode=='FR'&&detailInfo.progressBar==33"
             style="margin-top:10px;">
          <Checkbox v-model="frRetaxInfo.disabledSingle">补缴税金（需要补缴税金时勾选,此内容会传输到法国软件商）</Checkbox>
          <div v-if="frRetaxInfo.disabledSingle">
            补缴金额：
            <Input v-model="frRetaxInfo.extraPrice"
                   style="width:150px;margin:8px;" />元
            <Input v-for="item in frRetaxInfo.resonList"
                   :key="item"
                   v-model="item.reason"
                   style="margin:8px;"
                   placeholder="备注说明，每行最多512个字符"
                   max-width="512" />
          </div>
        </div>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="auditModal=false">取消</Button>
          <Button type="primary"
                  v-if="isRowBtn"
                  @click="rowSureAudit">确认</Button>
          <!-- 审核转代理资料 -->
          <Button type="primary"
                  v-else
                  @click="sureAudit">确认</Button>
        </p>
      </Modal>
      <Modal v-model="PreTaxCode"
             :mask-closable="false"
             title="填写前税代编码">
        <Input type="text"
               v-model="cfOldRap"
               placeholder="只能输入字母和数字"></Input>
        <p slot="footer">
          <Button type="primary"
                  @click="sureEnterCfOldRap">确认</Button>
        </p>
      </Modal>
      <Modal v-model="authorizationHauge"
             :mask-closable="false">
        <p slot="header"
           class="hauge-header">是否确认收到声明书和授权书</p>
        <div class="hauge-content">
          <p>温馨提示：收到董事声明书和授权书后，记得寄送资料到海牙哦；</p>
          <p style="color:red;">寄送资料如下：</p>
          <p style="margin-left:15px;">1、董事声明书；</p>
          <p style="margin-left:15px;">2、注册授权书；</p>
        </div>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="authorizationHauge=false">取消</Button>
          <Button type="primary"
                  @click="sureReceived">确认收到</Button>
        </p>
      </Modal>
      <!-- 录入海牙信息 -->
      <Modal v-model="enterHaugeInfo"
             :mask-closable="false"
             title="录入海牙信息">
        <Upload ref="declareFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :before-upload="beroreHaugeload"
                :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,3)}"
                :on-remove="(file,fileList)=>{removeDeclare(file,fileList,3)}"
                style="width:260px"
                v-if="detailInfo.countryCode!='IT'">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary"
                  @click="sureEnterHaugeInfo">确认</Button>
        </p>
      </Modal>
      <!-- 填写寄送海牙单号 -->
      <Modal v-model="enterTrankingNumber"
             :mask-closable="false"
             title="填写寄送海牙单号">
        <Input v-model="hyNumber"></Input>
        <p slot="footer">
          <Button type="primary"
                  @click="sureEnterTrankingNumber">确认</Button>
        </p>
      </Modal>
      <!-- 填写寄送税局的物流单号 -->
      <Modal v-model="sendTaxBox"
             :mask-closable="false"
             title="填写寄送税局的物流单号">
        <Input v-model="taxSendNumber"></Input>
        <p slot="footer">
          <Button type="primary"
                  @click="sureTaxTrankingNumber">确认</Button>
        </p>
      </Modal>
      <Modal v-model="finishAgentModal"
             title="完成转代理">
        <p style="text-align:center;margin-bottom: 20px;">确认后不可修改，客户进入正常申报流程</p>
        <Upload type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatCertificateNew')}"
                :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatCertificateNew')}"
                :format="['jpg','jpeg','png','gif','pdf']"
                style="width:300px;margin: auto;"
                :show-upload-list="false">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span v-if="tranferAgentInfo.vatCertificateNew==''">上传税号证书（新）</span>
            <span v-else>点击或拖拽文件到此区域重新上传</span>
          </div>
        </Upload>
        <!-- <div style="text-align: center;" v-if="tranferAgentInfo.vatCertificateNew!=''" >
                    <a :href="tranferAgentInfo.vatCertificateNew" target="_blank" >VAT税号证书（新）</a><Icon type="ios-close-circle" @click.stop="removeHandler('','','vatCertificateNew')"/>
                </div> -->
        <p slot="footer">
          <Button @click="finishAgentModal = false">取消</Button>
          <Button type="primary"
                  @click="finishAgentBtn">确认</Button>
        </p>
      </Modal>
    </div>
    <Modal title="录入发票号"
           @on-visible-change="modalState"
           v-model="invoicaBoxShow">
      <Form>
        <FormItem label='发票号：'
                  :label-width="100">
          <Input v-model="invoiceInfo.invoiceNumber"></Input>
        </FormItem>
        <FormItem label='发票号文件（选填）：'
                  :label-width="100">
          <Upload ref="declareFile"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreHaugeload"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,4)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,4)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload"
                    size="30"
                    style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="invoicaBoxShow=false">取消</Button>
        <Button type="primary"
                @click="submitInvice">确认</Button>
      </p>
    </Modal>
    <Modal title="录入GIBAN码"
           @on-visible-change="modalState"
           v-model="gibanBox">
      <p>GIBAN码：</p>
      <Input v-model="gibanCode"></Input>
      <p slot="footer">
        <Button type="primary"
                @click="submitGiban">确认</Button>
      </p>
    </Modal>
    <Modal title="选择服务商"
           v-model="supplierModal">
      <Select clearable
              v-model="supplierId"
              placeholder="选择服务商">
        <Option v-for="(item,index) in SupplierByConditionList"
                :value="item.id"
                :key="index">{{item.shortName}}</Option>
      </Select>
      <p slot="footer">
        <Button type="primary"
                @click="supplierModal = false">确认</Button>
      </p>
    </Modal>
    <Modal v-model="resonModelFR"
           :title="resonModelTitle">
      <div>
        <p>失败原因：{{frReason}}</p>
      </div>
      <div slot="footer"
           v-if="declareInfo.declarationStatus==3">
        <Button @click="resonModelFR = false">取消</Button>
        <Button type="primary"
                @click="submitFRagain">重新提交</Button>
      </div>
    </Modal>
  </div>
</template>  
<script>
import * as API from '@/api/taxService/workOrder.js';
import * as API1 from '@/api/taxService/taxModule.js';
import * as API2 from '@/api/taxService/regAndDeclare.js';
import * as APIDE from '@/api/taxService/annalsDE.js';
import { getToken } from '@/libs/util'
import { Throttle } from '@/libs/throttle'

export default {
  props: ['id', 'countryCode', 'userId'],
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请输入后台店铺邮编号码'));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value - 0)) {
          callback(new Error('请输入正确的邮编号码'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      lenovoSearchList: [],
      fileUpload: this.workOrderFile,
      isEditor: false,
      companyInfo: {
        cn_name: '布莱恩',
        en_name: 'brain',
        cn_address: '光浩国际中心',
        en_address: 'sadiyago',
        code: '123123213213123',
        createTime: '2020-03-02'
      },
      tableLoading: false,
      auditModal: false,
      PreTaxCode: false,
      cfOldRap: '',
      isAudit: '1',
      startTax: false, //  开始申报弹窗
      remark: '',//驳回原因
      pageInfo: {
        page: 1,
        pageSize: 10
      },
      rowData: {},
      listTotal: 10,
      columns: [
        {
          title: '报税次数',
          key: 'declareCout',
          render(h, params) {
            return h('span', params.index + 1)
          },
        },
        {
          title: '申报区间',
          render: (h, params) => {
            let self = this
            let beginTime = params.row.beginTime !== '' ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== '' ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          },
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '税率',
          key: 'taxRate'
        },
        {
          title: '申报规则',
          slot: 'declareRule',
          // render:(h,params) => {
          //     return h('span',)
          // }
        },
        {
          title: '报税数据',
          slot: 'lookData'
        },
        {
          title: '缴纳税金',
          key: 'allTaxPrice'
        },
        {
          title: '提交申报结果',
          render: (h, params) => {
            let result = '',
              declarationStatus = params.row.declarationStatus
            result = declarationStatus == 0 ? '暂无' : declarationStatus == 1 ? '提交成功' : declarationStatus == 2 ? '扣款失败' : declarationStatus == 3 ? '提交失败' : ''
            return h('span', result)

          }
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      formsLink: '', // 英国申报凭证
      // 选择报税区间数据
      VatObligationsData: [],
      isTaxModalShow: false,
      tableData: [],//申报历史
      detailInfo: {},
      taxCertificate: '',//税金缴纳凭证
      declareInfo: {},//申报数据
      declareReceipt: [],//申报回执
      uploadDebitReceipt: '',//扣款回执
      uploadReceiptModal: false,
      isRowBtn: false,
      deductionInfo: [],//抵扣明细,
      orderNo: '',
      date: '',
      fileTaxModal: false,//报税信息 modal
      fileTaxForm: {
        beginTime: '',
        endTime: '',
        periodType: '',
      },
      bindTime: {
        beginTime: '',
        endTime: ''
      },
      tranferAgentInfo: {
        vatTaxNumber: "",
        declarePeriod: "",
        companyNameEn: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyEmail: "",
        companyTel: "",
        companyBusinessModeDescribe: "",
        taxEffectiveDate: "",
        upBeginTime: "",
        upEndTime: "",
        companyBusinessLicense: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        gatewayId: "",
        gatewayPassword: "",
        postCode: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        vatTaxFileCopy: "",
        registrationAuthorization: '',
        vatTaxNumberFile: '',
        shopHref: '',
        shopConsoleScreenshot: '',
        companyRegisterData: '',
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonCardPassport: '',
        companyCreditReport: '',
        localBankAccountInfo: '',
        shopNature: '',
        isThereShop: '',
        articlesOfAssociationFile: '',
        salesEvidenceFile: '',
        recordOfPenaltyCharges: '',
        vatCertificateNew: '',
        legalPersonPostCode: ''
      },//转代理资料
      progressStatus: {
        8: "资料驳回",
        28: "待上传资料(转代理)",
        29: "转代理中",
        19: "未开始",
        20: "未开始(已开始报税)",
        21: "待提交报税资料",
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
        35: "待上传零申报凭证"
      },
      workId: '',
      declearList: [],
      declareList: [
        {
          status: '0',
          type: '月报'
        },
        {
          status: '1',
          type: '季报'
        },
        {
          status: '2',
          type: '年报'
        },
      ],
      ruleForm: {
        legalPersonPostCode: [
          { required: true, trigger: "blur", message: "请填写法人出生地邮政编号" }
        ],
        vatTaxNumber: [
          { required: true, trigger: "blur", message: "请填写VAT税号" }
        ],
        declarePeriod: [
          { required: true, trigger: "change", message: "请选择报税周期" }
        ],
        companyNameZh: [
          { required: true, trigger: "blur", message: "请填写公司中文名" }
        ],
        companyNameEn: [
          { required: true, trigger: "blur", message: "请填写公司英文名" }
        ],
        companyAddressEnCountry: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEn: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEnCity: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyLegalPersonEn: [
          { required: true, trigger: "blur", message: "请填写英文名字" }
        ],
        companyEmail: [
          { required: true, trigger: "blur", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyTel: [
          { required: true, trigger: "blur", message: "请填写公司电话" }
        ],
        companyBusinessModeDescribe: [
          { required: true, trigger: "blur", message: "请填写公司经营内容" }
        ],
        companyCreditCode: [
          { required: true, trigger: "blur", message: "请填写公司统一社会信用代码" }
        ],
        companyLegalPersonCard: [
          { required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }
        ],
        companyLegalPersonCardAddress: [
          { required: true, trigger: "blur", message: "请填写法人身份证英文地址" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "blur", message: "请填写法人出生地" }
        ],
        companyLegalPersonBirthday: [
          { required: true, trigger: "change", message: "请填写法人出生日期" }
        ],
        shopHref: [
          { required: true, trigger: "blur", message: "请填写店铺链接" }
        ],
        taxEffectiveDate: [
          {
            required: true,
            trigger: "change",
            message: "选择税号生效日期",
            type: "date"
          }
        ],
        upBeginTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择开始时间",
            type: "date"
          }
        ],
        companyBusinessLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照扫描件/照片"
          }
        ],
        legalPersonPapers: [
          { required: true, trigger: "change", message: "请上传身份证正反面" }
        ],
        vatCertificate: [
          { required: true, trigger: "change", message: "请上传VAT证书" }
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传最后一次申报回执"
          }
        ],
        lastPayCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传最后一次支付凭证"
          }
        ],
        postCode: [
          { required: true, validator: validateNumber }
        ],
        vatTaxLocalFile: [
          { required: true, trigger: "change", message: "请上传本地税号文件" }
        ],
        vatTaxEuFile: [
          { required: true, trigger: "change", message: "请上传欧盟税号文件" }
        ],
        vatTaxFileCopy: [
          { required: true, trigger: "change", message: "请上传税务副本" }
        ],
        vatTaxNumberFile: [
          { required: true, trigger: "change", message: "请上传税号文件" }
        ],
        registrationAuthorization: [
          { required: true, trigger: "change", message: "请上传转代理授权书" }
        ],
        upEndTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择结束时间",
            type: "date"
          }
        ],
      },
      hasAuth: false, // 是否授权过的  
      submitLoading: false,
      saveLosding: false,
      authorizationHauge: false,
      enterHaugeInfo: false,
      hyFile: '',
      enterTrankingNumber: false,
      hyNumber: '',
      sendTaxBox: false,
      taxSendNumber: '',
      positionList: [
        {
          value: 'CEO(首席执行官)'
        },
        {
          value: 'COO(运营总监)'
        },
        {
          value: 'CFO(财务总监)'
        },
        {
          value: 'GM(总经理)'
        },
        {
          value: 'CTO(Technical Director)技术总监'
        },
        {
          value: 'HRD(人力资源总监)'
        },
        {
          value: 'MD(市场总监)'
        },
        {
          value: 'sales director(销售总监)'
        },
        {
          value: 'Production Manager(生产经理)'
        },
        {
          value: 'project manager(项目经理)'
        },
        {
          value: 'other(其它)'
        },
      ],
      sharesList: [
        {
          shareholderZhName: '',
          shareholderEnName: '',
          position: '',
          stockProportion: '',
          shareholderBirthday: ''
        }
      ],
      placeList: [],//法人出生地
      invoicaBoxShow: false,
      invoiceInfo: {
        invoiceNumber: '',
        invoiceUrl: ''
      },
      receiptList: {
        invoiceReceipt: '',
        payLetterInvoiceReceipt: '',
        paySystemInvoiceReceipt: '',
        taxDeclareBlankReceipt: '',
        taxDeclareReceiveInformReceipt: '',
        taxesReceipt: ''
      },
      commerceList: [
        {
          value: '消费类电子产品'
        },
        {
          value: '服饰'
        },
        {
          value: '汽车摩托车配件'
        },
        {
          value: '玩具'
        },
        {
          value: '户外用品'
        },
        {
          value: '首饰'
        },
        {
          value: '家具'
        },
        {
          value: '办公配件'
        },
        {
          value: '母婴用品'
        },
        {
          value: '其它'
        }
      ],
      gibanBox: false,
      gibanCode: '',
      finishAgentModal: false, // 意大利完成转代理弹窗
      stockGreaterThan25: '1',
      sharesList: [
        {
          shareholderZhName: '',
          shareholderEnName: '',
          position: '',
          stockProportion: '',
          shareholderBirthday: '',
          identityCard: ''
        }
      ],
      SupplierByConditionList: [], // 法国服务商
      supplierModal: false,
      supplierId: '',
      resonModelFR: false,
      resonModelTitle: '扣款失败原因',
      frReason: '',
      disabledSingle: false,
      frRetaxInfo: {
        disabledSingle: false,
        extraPrice: '',
        resonList: [
          { reason: '' },
          { reason: '' },
          { reason: '' },
          { reason: '' },
          { reason: '' },
        ]
      },
      needApiIT: true,//意大利是否需要API对接
      isAuth: true,
      discountBox: false,
      dataIndex: 0,
      taxModal: false,
      taxBaseData: {},
      discountColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '抵扣类型',
          align: 'center',
          render(h, params) {
            let type = params.row.deductionType,
              deductionType = type == 1 ? 'C79/88' : type == 2 ? '发票抵扣' : type == 3 ? '欧盟内采购' : type == 4 ? 'B2B发票' : '其他'
            return h('span', deductionType)
          },
        },
        {
          title: '单据日期',
          align: 'center',
          key: 'billDate'
        },
        {
          title: '抵扣金额',
          align: 'center',
          render(h, params) {
            return h('span', '€' + params.row.deductiontAmt)
          },
        },
        {
          title: '凭证',
          align: 'center',
          slot: 'deductionFile'
        },
      ],
    }
  },
  created() {
    this.getDetailInfo()
    this.getBaseInfo()

  },
  mounted() {
    this.automaticInformationFilling()
    this.getSupplierByCondition()

  },
  methods: {
    // 公司资料信息自动填充
    automaticInformationFilling() {
      // console.log('userId', this.userId)
      var that = this
      API2.getLenovoSearchCompany({
        userId: this.userId
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== "{}") {
            this.lenovoSearchList = res.data
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 获取法国服务商
    getSupplierByCondition() {
      API.supplierByCondition({
        countryCode: 'FR',
        supplierType:1,
      }).then(res => {
        this.SupplierByConditionList = res.data
      })
    },
    selectCompany: Throttle(function (obj) {
      let that = this
      API2.getMaterial({
        userId: that.userId,
        companyName: obj
      }).then(res => {
        if (res.code === 0) {
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key) && that.tranferAgentInfo.hasOwnProperty(key)) {
              that.tranferAgentInfo[key] = res.data[key]
            }
          }
          if (JSON.stringify(res.data) === "{}") {
            for (const key in that.tranferAgentInfo) {
              if (that.tranferAgentInfo.hasOwnProperty(key)) {
                that.tranferAgentInfo[key] = ''
              }
            }
            that.tranferAgentInfo.companyNameZh = obj
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }),
    //获取基础配置信息
    getBaseInfo() {
      API1.baseInfoByCondition({ countryCode: this.countryCode }).then((res) => {
        if (res.code === 0) {
          const data = res.data
          if (data.monthPeriod === 0) this.declearList.push({ type: '月报', status: 0 })
          if (data.quarterPeriod === 0) this.declearList.push({ type: '季报', status: 1 })
          if (data.yearPeriod === 0) this.declearList.push({ type: '年报', status: 2 })
        }
      })
      API.getBirthPlace().then((res) => {
        if (res.code == 0) {
          this.placeList = res.data;
        }
      })
    },
    //获取详情信息
    getDetailInfo() {
      API.getDeclareServiceDetail({ serviceId: this.id }).then((res) => {
        if (res.code == 0) {
          this.detailInfo = res.data.orderServices
          this.orderNo = res.data.orderNo
          this.isHasAuth(this.detailInfo)
          this.tableData = res.data.taxWorkOrderList;
          this.tableData.forEach(element => {
            if (element.taxCertificate !== '') {
              element.taxCertificate = element.taxCertificate.split(';')
            } else {
              element.taxCertificate = []
            }
          })
          this.detailInfo.beginTime = res.data.orderServices.beginTime.substring(0, 7)
          this.detailInfo.endTime = res.data.orderServices.endTime.substring(0, 7)
          if (JSON.stringify(res.data.transformProxyWorkOrder) !== '{}') {
            this.tranferAgentInfo = res.data.transformProxyWorkOrder
            this.tranferAgentInfo.declarePeriod = String(res.data.transformProxyWorkOrder.declarePeriod)
            let val = res.data.transformProxyWorkOrder
            this.tranferAgentInfo.shopNature = String(val.shopNature)
            this.tranferAgentInfo.isThereShop = String(val.isThereShop)
            if (val.shopNature == 1 && (val.companyStockCondition) != '') {
              this.sharesList = JSON.parse(val.companyStockCondition)
            }
            if (this.detailInfo.countryCode == 'ES') {
              if (val.companyStockCondition != '') {
                this.stockGreaterThan25 = '0'
                this.sharesList = JSON.parse(val.companyStockCondition)
              }
            }
          }
          if (res.data.taxWorkOrderList.length > 0) {
            this.declareInfo = res.data.taxWorkOrderList[0];
            this.deductionInfo = res.data.taxWorkOrderList[0].listTaxDeductionItem;
            this.workId = res.data.taxWorkOrderList[0].id
          }
          if (this.detailInfo.progressBar == 20) {
            this.fileTaxForm = {
              beginTime: this.detailInfo.beginTime,
              endTime: this.detailInfo.endTime,
              periodType: this.detailInfo.periodType,
            }
            this.bindTime = {
              beginTime: this.detailInfo.beginTime,
              endTime: this.detailInfo.endTime
            }
          }
          if (this.detailInfo.progressBar == 28 || this.detailInfo.progressBar == 32 || this.detailInfo.progressBar == 31) {
            this.isEditor = true
          } else {
            this.isEditor = false
          }
          if (this.detailInfo.countryCode === 'DE' && res.data.yearTaxWorkOrderList.length > 0) {
            this.deYearData = res.data.yearTaxWorkOrderList
          }
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    changeVatDate(date, item) {
      // this.tranferAgentInfo[item] = date;
    },
    // 获取英国申报回执
    getLink(row) {
      API1.getForms({
        workOrderId: row.id,
        userId: row.userId,
      }).then(res => {
        if (res.code === 0) {
          window.open(res.data)
        }
      })
    },
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    //发送提醒
    sendMessage(progressBar) {
      let params = {
        serviceId: this.detailInfo.id,

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
    //计算税金
    caculateTax(row) {
      if (row.orderServicesId !== undefined) {
        this.$emit('showTaxModal', row.id, row.orderServicesId)
      } else {
        this.$emit('showTaxModal', this.workId, this.id)
      }
      this.$store.commit('getDeclareInfo', this.declareInfo)
    },
    //选择法人出生时间
    changeLegalBirthDate(val) {
      this.tranferAgentInfo.companyLegalPersonBirthday = val;
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.tranferAgentInfo[item] = res.data.fileUrl;
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.tranferAgentInfo[item] = "";
    },
    //税金缴纳凭证上传之前
    beforeLiceseUpload(file, fileList) {

    },
    //税金缴纳凭证上传成功
    licenseUploadSuccess(res, file, fileList) {
      this.taxCertificate = file.response.data.fileUrl;
    },
    //移除税金缴纳凭证
    removeLicenseFile(file, fileList) {
      this.taxCertificate = '';
    },
    //下载申报资料
    downLoad() {
      let formData = new FormData()
      if (this.detailInfo.countryCode === "GB") {
        formData.append('workId', this.workId)
      } else {
        formData.append('workOrderId', this.workId)
      }
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      if (this.detailInfo.countryCode === "GB") {
        xmlResquest.open('post', this.baseUrl + '/etax/tax/workorder/management/down/material', true)
      } else {
        xmlResquest.open('post', this.baseUrl + '/etax/derive/management/tax/export', true)
      }

      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = fileName

        elink.style.display = 'none'

        let blob = new Blob([content])

        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    //申报回执上传之前
    beroreDeclareUpload() {

    },
    beroreDeclareUploadDebitReceipt() {
      let self = this;
      const check = self.uploadDebitReceipt == '';
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1张图片"
        });
      }
      return check;
    },
    beroreHaugeload() {
      let self = this;
      const check = self.hyFile == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //申报回执上传成功
    declareUploadSuccess(res, file, fileList, type) {
      if (type == 1) {
        this.declareReceipt = fileList;
      } else if (type == 2) {
        this.uploadDebitReceipt = file.response.data.fileUrl;
      } else if (type == 3) {
        this.hyFile = file.response.data.fileUrl;
      } else if (type == 4) {
        //发票号文件
        this.invoiceInfo.invoiceUrl = file.response.data.fileUrl
      } else if (type == 4) {
        //发票号文件
        this.invoiceInfo.invoiceUrl = file.response.data.fileUrl
      } else if (type == 5) {
        //发票开具通知
        this.receiptList.invoiceReceipt = file.response.data.fileUrl
      } else if (type == 6) {
        //纳税付款发票信件
        this.receiptList.payLetterInvoiceReceipt = file.response.data.fileUrl
      } else if (type == 7) {
        //纳税付款系统发票
        this.receiptList.paySystemInvoiceReceipt = file.response.data.fileUrl
      } else if (type == 8) {
        //税务申报接收通知
        this.receiptList.taxDeclareReceiveInformReceipt = file.response.data.fileUrl
      } else if (type == 9) {
        //税务申请表
        this.receiptList.taxDeclareBlankReceipt = file.response.data.fileUrl
      } else if (type == 10) {
        //税金收款回执
        this.receiptList.taxesReceipt = file.response.data.fileUrl
      }
    },
    //移除申报回执
    removeDeclare(file, fileList, type) {
      if (type == 1) {
        this.declareReceipt = fileList
      } else if (type == 2) {
        this.uploadDebitReceipt = ''
      } else if (type == 3) {
        this.hyFile = ''
      } else if (type == 4) {
        this.invoiceInfo.invoiceUrl = ''
      } else if (type == 5) {
        //发票开具通知
        this.receiptList.invoiceReceipt = ''
      } else if (type == 6) {
        //纳税付款发票信件
        this.receiptList.payLetterInvoiceReceipt = ''
      } else if (type == 7) {
        //纳税付款系统发票
        this.receiptList.paySystemInvoiceReceipt = ''
      } else if (type == 8) {
        //税务申报接收通知
        this.receiptList.taxDeclareReceiveInformReceipt = ''
      } else if (type == 9) {
        //税务申请表
        this.receiptList.taxDeclareBlankReceipt = ''
      } else if (type == 10) {
        //税金收款回执
        this.receiptList.taxesReceipt = ''
      }
    },
    //缴税凭证上传之前
    beroreTaxUpload() {

    },
    //缴税凭证上传成功
    taxUploadSuccess(res, file, fileList) {
      this.taxCertificate = fileList;
    },
    //移除缴税凭证
    removetax(file, fileList) {
      this.taxCertificate = fileList
    },
    //预览申报回执
    previewBack() {
      window.open(this.declareInfo.declareReceipt)
    },
    //预览扣款回执
    previewDebit() {
      window.open(this.declareInfo.debitReceipt)
    },
    //预览税金缴纳凭证
    previewTax(url) {
      window.open(url)
    },
    //预览抵扣文件
    previewDeduct(url) {
      window.open(url)
    },
    //确认上传申报回执
    sureUpload() {
      let params = {}
      if (this.detailInfo.countryCode == 'AE') {
        if (this.receiptList.taxesReceipt == '') {
          this.$Message.info('请上传税金收款回执')
          return
        }
        params = { ...this.receiptList }
        params.workId = this.workId
      } else if (this.detailInfo.countryCode == 'SA') {
        if (this.receiptList.invoiceReceipt == '') {
          this.$Message.info('请上传发票开具通知')
          return
        }
        if (this.receiptList.taxDeclareReceiveInformReceipt == '') {
          this.$Message.info('请上传税务申报接收通知')
          return
        }
        if (this.receiptList.taxDeclareBlankReceipt == '') {
          this.$Message.info('请上传税务申请表')
          return
        }
        params = { ...this.receiptList }
        params.workId = this.workId
      } else {
        let declareReceipt = ''
        const self = this
        this.declareReceipt.map((v, i) => {
          if (i != self.declareReceipt.length - 1) {
            declareReceipt += v.response.data.fileUrl + ';'
          } else {
            declareReceipt += v.response.data.fileUrl
          }
        })
        params = {
          declareReceipt,
          workId: this.workId,
          uploadDebitReceipt: this.uploadDebitReceipt
        }
      }
      if (this.isRowBtn) {
        params.workId = this.rowData.id
      }
      API.uploadDeclareNew(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('上传成功')
          this.uploadReceiptModal = false
          if (this.isRowBtn) {
            this.getDetailInfo()
          } else {
            this.$emit('refresh')
          }
        } else {
          this.$Message.warning(res.message)
        }
      })
    },
    uploadReceiptModalFun(row) {
      this.uploadReceiptModal = true
      this.isRowBtn = true
      this.rowData = row
    },
    //报税信息弹窗=选择申报区间
    dateChange(date, type) {
      if (type == 0) {
        this.fileTaxForm.beginTime = date;
      } else if (type == 1) {
        this.fileTaxForm.endTime = date;
      }
    },
    dateChangeBefore(date, type) {
      if (type == 0) {
        this.tranferAgentInfo.beginTime = date;
      } else if (type == 1) {
        this.tranferAgentInfo.endTime = date;
      }
    },
    //确认提交报税信息
    sureFileTax() {
      let params = { ...this.fileTaxForm }
      params.servicesId = this.id
      API.firstDeclear(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('报税信息填写成功');
          this.$emit('refresh')
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //完成转代理
    finishAgent() {
      if (this.countryCode === 'IT') {
        this.finishAgentModal = true
      } else {
        this.$Modal.confirm({
          title: '是否确认完成转代理',
          content: '<p>确认后不可修改，客户进入正常申报流程</p>',
          onOk: () => {
            let params = {
              servicesId: this.id
            }
            API.finishAgent(params).then((res) => {
              if (res.code == 0) {
                this.$Message.success('操作成功');
                this.$emit('refresh')
              }
            })
          },
          onCancel: () => {

          }
        });
      }
    },
    // 意大利完成转代理
    finishAgentBtn() {
      if (this.tranferAgentInfo.vatCertificateNew === '') {
        this.$Message.info('请上传税号证书(新)');
        return
      }
      let params = {
        servicesId: this.id,
        vatCertificateNew: this.tranferAgentInfo.vatCertificateNew
      }
      API.finishAgent(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.finishAgentModal = false
          this.$emit('refresh')
        }
      })
    },
    //下载转代理资料
    downloadTransfer() {
      let formData = new FormData()
      formData.append('workId', this.tranferAgentInfo.id)
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/tax/workorder/management/down/proxy/material', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = fileName
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    //审核操作
    sureAudit() {
      let params = {
        serviceId: this.detailInfo.id,
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      let data = {
        workId: this.workId,
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      if (this.detailInfo.countryCode === 'IT') {
        if (this.needApiIT) {
          params.apiStatus = 1
          data.apiStatus = 1
        } else {
          params.apiStatus = 0
          data.apiStatus = 0
        }
      }
      if (this.isAudit == 1) {
        delete params.remark
      }
      if (this.isRowBtn) {
        data.workId = this.rowData.id
      }
      if (this.detailInfo.progressBar == 31) {
        if (this.detailInfo.countryCode === 'FR' && this.supplierId === '') {
          this.$Message.info('请先选择服务商')
          return
        }
        API.auditTurnAgent(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.auditModal = false
            this.$emit('refresh')
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      } else if (this.detailInfo.progressBar == 33) {
        if (this.frRetaxInfo.disabledSingle) {
          if (this.frRetaxInfo.extraPrice == '') {
            this.$Message.info('请填写补缴金额')
            return
          }
          data.extraPrice = this.frRetaxInfo.extraPrice
          data.declarationRemark = ''
          this.frRetaxInfo.resonList.map((item, index) => {
            if (item.reason != '') {
              data.declarationRemark += item.reason + ';'
            }
          })
        }
        API2.auditTaxCertificate(data).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            if (this.isRowBtn) {
              this.getDetailInfo()
            } else {
              this.$emit('refresh')
            }
            this.auditModal = false
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      }
    },
    //审核操作
    rowSureAudit() {
      let params = {
        serviceId: this.rowData.orderServicesId,
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      let data = {
        workId: this.rowData.id,
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      if (this.detailInfo.countryCode === 'IT') {
        if (this.needApiIT) {
          params.apiStatus = 1
          data.apiStatus = 1
        } else {
          params.apiStatus = 0
          data.apiStatus = 0
        }
      }
      if (this.isAudit == 1) {
        delete params.remark
      }
      if (this.rowData.status == 31) {

        if (this.rowData.countryCode === 'FR' && this.supplierId === '') {
          this.$Message.info('请先选择服务商')
          return
        }
        API.auditTurnAgent(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.auditModal = false
            this.getDetailInfo()
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      } else if (this.rowData.status == 33) {

        API2.auditTaxCertificate(data).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.getDetailInfo()
            this.auditModal = false
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      }
    },
    //提交转代理资料
    clickSubmit() {
      let params = { ...this.tranferAgentInfo }
      if (params.shopNature == 1) {
        params.companyStockCondition = JSON.stringify(this.sharesList)
      }
      params.upBeginTime = this.formatDate(this.tranferAgentInfo.upBeginTime)
      params.upEndTime = this.formatDate(this.tranferAgentInfo.upEndTime)
      params.taxEffectiveDate = this.formatDate(this.tranferAgentInfo.taxEffectiveDate)
      params.companyLegalPersonBirthday = this.formatDate(this.tranferAgentInfo.companyLegalPersonBirthday)
      params.orderServicesId = this.id
      if (this.countryCode == 'ES') {
        if (this.stockGreaterThan25 == '0') {
          params.companyStockCondition = JSON.stringify(this.sharesList)
        } else {
          params.companyStockCondition = ''
        }
      }
      API1.submitAgent(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          this.$emit('refresh')
        }
      })
    },
    //保存转代理资料
    saveForm() {
      let params = { ...this.tranferAgentInfo }
      if (params.shopNature == 1) {
        params.companyStockCondition = JSON.stringify(this.sharesList)
      }
      params.upBeginTime = this.formatDate(this.tranferAgentInfo.upBeginTime)
      params.upEndTime = this.formatDate(this.tranferAgentInfo.upEndTime)
      params.taxEffectiveDate = this.formatDate(this.tranferAgentInfo.taxEffectiveDate)
      params.companyLegalPersonBirthday = this.formatDate(this.tranferAgentInfo.companyLegalPersonBirthday)
      params.orderServicesId = this.id
      if (this.countryCode == 'ES') {
        if (this.stockGreaterThan25 == '0') {
          params.companyStockCondition = JSON.stringify(this.sharesList)
        } else {
          params.companyStockCondition = ''
        }
      }
      API1.saveAgent(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('保存成功')
        }
      })
    },
    //时间格式转换
    formatDate(date) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d + ' 00:00:00'
      } else {
        return date
      }
    },
    // 开始授权
    startTaxFun(detailInfo) {
      let that = this
      API1.ifAuth({
        serviceId: detailInfo.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          if (res.data) {
            that.getregisterInfo()
          } else {
            that.getwayFun(detailInfo)
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //税局getway 进去授权
    getwayFun(detailInfo) {
      API1.mtdAuth({
        serviceId: this.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber,
        location: 2
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          window.location.href = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 判读是否授权
    isHasAuth(detailInfo) {
      let that = this
      if (detailInfo.countryCode !== 'GB') return
      if (!(detailInfo.progressBar >= 20 && detailInfo.progressBar <= 27)) return
      API1.ifAuth({
        serviceId: detailInfo.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      }).then(res => {
        if (res.code === 0) {
          this.isAuth = res.data
          if (res.data === false && detailInfo.countryCode === 'GB') {
            if (detailInfo.progressBar !== 20) {
              this.$Modal.warning({
                title: '温馨提示',
                content: '该公司还没授权，请点击授权报税按钮进行授权'
              });
            } else {
              this.$Message.error('该公司还没授权，请点击授权报税按钮进行授权')
            }
          } else if (res.data && detailInfo.countryCode === 'GB') {
            that.getVatObligations()
            that.$store.commit('hasAuth', {
              vatTaxNumber: detailInfo.vatTaxNumber,
              auth: true
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 检索增值税义务
    getVatObligations() {
      let that = this
      API1.vatObligations({
        serviceId: that.id,
        userId: that.detailInfo.userId,
        vatTaxNumber: that.detailInfo.vatTaxNumber
      }).then(res => {
        if (res.code === 0) {
          that.VatObligationsData = res.data;
          that.$store.commit('getVatObligationsData', res.data)
          // that.startTax = true
          API.getDeclareServiceDetail({ serviceId: that.id }).then((res) => {
            that.tableData = []
            that.tableData = res.data.taxWorkOrderList
            that.tableData.forEach(element => {
              if (element.taxCertificate !== '') {
                element.taxCertificate = element.taxCertificate.split(';')
              } else {
                element.taxCertificate = []
              }
            })
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 确认收到授权书
    sureReceived() {
      API.confirmReceiptES({ workId: this.tranferAgentInfo.id }).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    // 录入海牙信息
    sureEnterHaugeInfo() {
      let data = {
        hyFile: this.hyFile,
        workId: this.tranferAgentInfo.id
      }
      API.enteringHaugeInfo(data).then(res => {
        if (res.code === 0) {
          this.enterHaugeInfo = false
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    //填写寄送海牙单号
    sureEnterTrankingNumber() {
      let data = {
        hyNumber: this.hyNumber,
        workId: this.tranferAgentInfo.id
      }
      API.enteringHaugeTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.enterTrankingNumber = false
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    // 录入前税代
    sureEnterCfOldRap() {
      var reg = /^[0-9a-zA-Z]+$/
      if (!reg.test(this.cfOldRap)) {
        this.$Message.error('请输入正确格式');
        return
      }
      let data = {
        cfOldRap: this.cfOldRap,
        workId: this.tranferAgentInfo.id
      }
      API.cfOldRap(data).then(res => {
        if (res.code === 0) {
          this.PreTaxCode = false
          this.$Message.success('操作成功');
          this.getDetailInfo()
        }
      })
    },
    //填写寄送税局的物流单号
    sureTaxTrankingNumber() {
      let data = {
        taxSendNumber: this.taxSendNumber,
        workId: this.tranferAgentInfo.id
      }
      API.enteringTaxTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.sendTaxBox = false
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    //分割
    splitFun(item) {
      return item.split(';')
    },
    //沙特股份列表
    addShares() {
      let obj = {
        shareholderZhName: '',
        shareholderEnName: '',
        position: '',
        stockProportion: '',
        shareholderBirthday: ''
      }
      this.sharesList.push(obj)
    },
    removeShares(i) {
      this.sharesList.splice(i, 1)
    },
    //提交发票信息
    submitInvice() {
      if (this.invoiceInfo.invoiceNumber == '') {
        this.$Message.info('请填写发票号')
        return
      }
      if (this.isRowBtn) {
        this.invoiceInfo.workId = this.rowData.id
      } else {
        this.invoiceInfo.workId = this.tableData[0].id
      }
      API1.inputInvoice(this.invoiceInfo).then(res => {
        if (res.code === 0) {
          this.invoicaBoxShow = false
          this.$Message.success('提交成功')
          if (this.isRowBtn) {
            this.getDetailInfo()
          } else {
            this.$emit('refresh')
          }
          this.isRowBtn = false
        }
      })
    },
    //录入GIBAN码
    submitGiban() {
      if (this.gibanCode == '') {
        this.$Message.info('请填写GIBAN码')
        return
      }
      let data = {
        gibanCode: this.gibanCode,
        workId: this.tableData[0].id
      }
      if (this.isRowBtn) {
        data.workId = this.rowData.id
      }
      API1.inputGibancode(data).then(res => {
        if (res.code === 0) {
          this.gibanBox = false
          this.$Message.success('提交成功')
          if (this.isRowBtn) {
            this.getDetailInfo()
          } else {
            this.$emit('refresh')
          }
          this.isRowBtn = false
        }
      })
    },
    // 审核
    auditFun(row) {
      this.rowData = JSON.parse(JSON.stringify(row))
      this.auditModal = true
      this.isRowBtn = true
    },
    entryInvoice(row) {
      this.rowData = row
      this.invoicaBoxShow = true
      this.isRowBtn = true
    },
    entryGIBAN(row) {
      this.rowData = row
      this.gibanBox = true
      this.isRowBtn = true
    },
    modalState(val) {
      if (val === false) {
        this.isRowBtn = false
      }
    },
    //查看原因
    lookReason(type, row) {
      this.resonModelFR = true
      if (type == 1) {
        this.resonModelTitle = '重新提交'
      } else if (type == 2) {
        this.resonModelTitle = '扣款失败原因'
      }
      this.getFRrecordFun(row)
    },
    //获取法国提交失败原因
    getFRrecordFun(row) {
      let data = { workId: this.workId }
      if (row != undefined) {
        data.workId = row.id
      }
      API.frRecord(data).then(res => {
        if (res.code == 0) {
          if (res.data.erreurLibelle != '') {
            this.frReason = res.data.erreurLibelle + ';'
          } else {
            this.frReason = ''
          }
          if (res.data.errorRecordList.length > 0) {
            res.data.errorRecordList.map((item, index) => {
              this.frReason += item.libelle + ';'
            })
          }
        }
      })
    },
    //重新提交
    submitFRagain() {
      let data = { workId: this.workId }
      API.frReSubmit(data).then(res => {
        this.resonModelFR = false
      })
    },
  }
}
</script>
<style lang="less" scoped>
.back {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  margin-bottom: 5px;
  .backBtn {
    width: 200px;
    cursor: pointer;
  }
}
.content {
  display: flex;

  .content-l {
    flex: 1;

    .declareFileBox {
      display: flex;
      justify-content: space-between;
      height: 40px;
      .span {
        display: inline-block;
        &:first-child {
          margin-right: 8px;
        }
      }
      .view {
        margin-right: 10px;
      }
    }
    .basicInfo {
      border-bottom: 1px solid #666;
      margin-bottom: 10px;
    }
    .deductItem {
      display: block;
    }
    .legalPersonSignBox {
      margin-top: 20px;
    }
    .legalPersonSign {
      width: 300px;
      height: 200px;
      background: #f2f2f2;
      img {
        width: 300px;
        height: 200px;
      }
    }
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
  }
  .transferAgentBox {
    .btnBox {
      display: flex;
      justify-content: space-between;
      span {
        font-weight: 700;
        padding-left: 5px;
      }
    }
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
/deep/ .ivu-card-head {
  padding: 4px 16px;
  p {
    height: 34px;
    line-height: 34px;
  }
}
&/deep/ .ivu-select-dropdown-list {
  height: 300px;
}
.viewInformation {
  .form {
    /deep/ .ivu-form-item {
      margin-bottom: 0px !important;
      padding-left: 30px;
    }
  }
}
.shares-box {
  background-color: #f2f2f2;
  padding: 15px 10px;
  /deep/ .ivu-form-item {
    margin-bottom: 14px;
  }
  /deep/ .ivu-select.ivu-select-single.ivu-select-default {
    width: 285px;
    display: inline-block;
  }
}
.shares-tips {
  color: red;
}
.tax-info-name {
  width: 100px;
  text-align: right;
  display: inline-block;
}
.tax-info-name {
  display: inline-block;
  min-width: 118px;
  font-size: 16px;
  font-family: PingFangSC;
  color: rgba(102, 102, 102, 1);
  line-height: 16px;
  text-align: right;
  margin-right: 16px;
}
.tax-info-value {
  font-size: 16px;
  font-family: "PingFangSC-Medium,PingFang SC";
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 18px;
  a {
    color: #16ade9;
  }
  img {
    vertical-align: middle;
    margin-right: 5px;
    width: 18px;
  }
}
/deep/ .ivu-row {
  margin: 8px 0;
}
</style>