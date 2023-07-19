<template>
  <div class="detailWrapper">
    <div class="back">
      <p @click="goBack()" class="backBtn">
        <Icon type="md-arrow-back" />返回列表
      </p>
    </div>
    <div class="content" v-if="JSON.stringify(detailInfo) !='{}'">
      <div class="content-l">
        <Card>
          <p slot="title" class="declareFileBox">
            <span>申报资料</span>
            <span>
              <span class="btnArea" v-if="detailInfo.progressBar == 20 || detailInfo.progressBar == 21 || detailInfo.progressBar == 22 || detailInfo.progressBar == 18 || detailInfo.progressBar == 23 || detailInfo.progressBar == 25">
                <Button v-if="detailInfo.countryCode == 'FR' && detailInfo.eoriNumber == ''" type="primary" @click="eoriBox=true" style="margin-right:8px;">录入EORI号</Button>

              </span>
              <span class="btnArea view" v-if="detailInfo.progressBar >= 20 && detailInfo.progressBar <=27 ">
                <Button @click="viewInformationModal = true">查看信息</Button>
                <Button type="primary" style="margin-left:10px;" v-if="detailInfo.countryCode === 'GB' && !isAuth" @click="startTaxFun(detailInfo)">授权报税</Button>
                <Button type="primary" @click="downloadTransfer" v-if="detailInfo.progressBar!=20" style="margin-left:8px;">下载转代理资料</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 19">
                <!-- <Button type="primary" ghost @click="sendMessage" style="margin-right:10px;">发送提醒</Button>   -->
                <Button type="primary" @click="fileTaxModal=true" v-if="detailInfo.taxType==1">填写报税信息</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 20">

                <!-- <Button type="primary"
                        ghost
                        @click="sendMessage(detailInfo.progressBar)"
                        style="margin-right:10px;">发送提醒</Button> -->
                <Button type="primary" @click="fileTaxModal=true" v-if="detailInfo.taxType==1">修改报税信息</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 21">
                <Button @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px">发送提醒</Button>
                <Button type="primary" v-if="detailInfo.countryCode !== 'GB'" @click="caculateTax" style="margin-right:10px">计算税金</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 18">
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh == '阿联酋'">下载申报资料</Button>
                <Button @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px">发送提醒</Button>
                <Button type="primary" v-if="detailInfo.countryCode == 'SA'" @click="invoicaBoxShow=true">录入发票号</Button>
                <Button v-if="detailInfo.countryCode == 'AE'" type="primary" @click="gibanBox=true">录入GIBAN</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 29">
                <!-- <Button type="primary" ghost @click="sendMessage" style="margin-right:10px;">发送提醒</Button>                             -->
                <!-- <Button type="primary" ghost v-if="!detailInfo.submitTaxTime" @click="submitTaxModal=true" style="margin-right:10px;" v-show="hasAuthority('declareService_submitTaxTime')">提交税局</Button> -->
                <Button type="primary" ghost v-if="!detailInfo.submitServiceTime" @click="submitServiceModal=true" style="margin-right:10px;" v-show="hasAuthority('declareService_submitServiceTime')">提交资料</Button>
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'&&tranferAgentInfo.taxTrackingNumber==''&&detailInfo.supplierId==43" @click="sendTaxBox=true" style="margin-right:8px;">填写寄送税局单号</Button>
                <Button v-if="detailInfo.countryCode == 'FR'" type="primary" @click="eoriBox=true" style="margin-right:8px;">录入EORI号</Button>
                <Button type="primary" v-show="hasAuthority('work_order_list13')" :disabled="detailInfo.submitServiceTime==''" @click="finishAgent">完成转代理</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 31">
                <Button type="primary" ghost @click="auditModal=true" style="margin-right:10px;">审核资料</Button>
                <Button type="primary" ghost style="margin-right:10px;" @click="supplierModal = true" v-if="detailInfo.countryCode === 'FR' || detailInfo.countryCode === 'ES'|| detailInfo.countryCode === 'DE' ">选择服务商</Button>
                <Button type="primary" ghost @click="PreTaxCode=true" v-if="detailInfo.countryCode === 'IT'" style="margin-right:10px;">录入前税代编码</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 25">
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh != '法国'&&detailInfo.countryNameZh != '意大利'">下载申报资料</Button>
                <Button type="primary" v-if="detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'DE'" @click="uploadReceiptModal=true">上传回执</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 27">
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh ==='西班牙'">下载申报资料</Button>
                <Button v-if="detailInfo.countryCode == 'FR' && detailInfo.eoriNumber == ''" type="primary" @click="eoriBox=true" style="margin-right:8px;">录入EORI号</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 22">
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh ==='西班牙' || detailInfo.countryNameZh ==='英国'">下载申报资料</Button>
                <Button type="primary" @click="taxFileModal=true" v-show="hasAuthority('work_order_list10')">上传缴税凭证</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 23">
                <Button type="primary" v-if="detailInfo.countryNameZh == '捷克' || detailInfo.countryNameZh == '奥地利'" @click="auditDeclareModal=true">审核申报</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 24">
                <Button type="primary" v-if="detailInfo.countryNameZh == '捷克' || detailInfo.countryNameZh == '奥地利'" @click="submitDeclare">提交申报</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 33">
                <Button type="primary" @click="auditModal=true" style="margin-right:10px;">审核</Button>
                <Button type="primary" @click="downloadTransfer" v-if="detailInfo.progressBar!=20" style="margin-right:10px;">下载转代理资料</Button>
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh ==='西班牙'">下载申报资料</Button>
                <Button type="primary" ghost style="margin-right:10px;" @click="supplierModal = true" v-if="detailInfo.countryCode === 'FR' || detailInfo.countryCode === 'ES'">选择服务商</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 34">
                <Button type="primary" @click="downloadTransfer" style="margin-right:10px;">下载转代理资料</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 34 && detailInfo.countryNameZh === '意大利'">

                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'">下载申报资料</Button>
                <Button type="primary" @click="taxFileModal=true" v-show="hasAuthority('work_order_list10')">上传缴税凭证</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.progressBar == 35">
                <Button type="primary" @click="downloadTransfer" v-if="detailInfo.progressBar!=20" style="margin-right:10px;">下载转代理资料</Button>
                <Button type="primary" @click="downLoad" ghost style="margin-right:10px;" v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'">下载申报资料</Button>
                <Button type="primary" @click="taxFileModal=true" v-show="hasAuthority('work_order_list10')">上传缴税凭证</Button>
              </span>
              <span v-if="detailInfo.progressBar==36">
                <!-- 36-待授权海牙认证 -->
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'" @click="authorizationHauge=true">已发送服务商</Button>
              </span>
              <span v-if="detailInfo.progressBar==37">
                <!-- 37-海牙认证中 -->
                <!-- <Button type="primary" v-show="hasAuthority('work_order_list05')" ghost @click="downLoad" style="margin-right:10px;">下载资料</Button> -->
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'&&tranferAgentInfo.hyTrackingNumber==''&&detailInfo.supplierId==43" style="margin-right:10px;" @click="enterTrankingNumber=true">填写寄送海牙单号</Button>
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'" @click="enterHaugeInfo=true">录入海牙信息</Button>
              </span>
              <span class="btnArea" v-if="detailInfo.countryNameZh  == '德国'&&detailInfo.progressBar>=19&&detailInfo.progressBar<=27">
                <Button type="primary" @click="creatAnnalsFun" ghost style="margin-left:10px;">生成年报工单</Button>
              </span>
            </span>
          </p>
          <div class="basicInfo">
            <Form ref="companyInfo" :model="companyInfo" :label-width=120>
              <FormItem label="申报状态：">
                <span>{{progressStatus[detailInfo.progressBar]}}</span>
              </FormItem>
              <FormItem label="提交申报结果：" v-if="detailInfo.countryCode=='FR'">
                <span v-if="declareInfo.declarationStatus==0">暂无</span>
                <span v-if="declareInfo.declarationStatus==1" style="color:#2d8cf0">提交成功</span>
                <span v-if="declareInfo.declarationStatus==2" style="color:red">扣款失败</span>
                <span v-if="declareInfo.declarationStatus==3" style="color:red">提交失败</span>
                <span style="cursor:pointer;" v-if="declareInfo.declarationStatus==3" @click="lookReason(1,'','isDeclareInfo')">【重新提交】</span>
                <span style="cursor:pointer;" v-if="declareInfo.declarationStatus==2" @click="lookReason(2,'','isDeclareInfo')">【查看原因】</span>
              </FormItem>
              <FormItem label="当前申报次数：">
                <span>{{detailInfo.declareCout}}</span>
              </FormItem>
              <FormItem label="当前申报区间：">
                <span v-if="tableData.length!=0">{{tableData[0].beginTime.substring(0,7)}}至{{tableData[0].endTime.substring(0,7)}}</span>
                <span v-else>{{detailInfo.beginTime}}至{{detailInfo.endTime}}</span>
              </FormItem>
              <FormItem label="申报回执：" v-if="detailInfo.progressBar === 25 || detailInfo.progressBar === 22 || detailInfo.progressBar === 27">
                <Button v-if="tableData[0].declareReceipt == '' && detailInfo.progressBar == 25 " type="primary" @click="uploadReceiptModal=true">点击上传</Button>
                <div v-else-if="declareInfo.declareReceipt != ''">
                  <a target="_blank" v-for="(item,index) in declareInfo.declareReceipt.split(';')" :key="index" :href="item" style="margin-right:5px;">{{"申报回执"}}</a>
                  <Button v-if="detailInfo.countryCode === 'IT' && (detailInfo.progressBar == 27) " @click="uploadReceiptModal=true">重新上传</Button>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="扣款回执：" v-if="((detailInfo.countryCode === 'IT' && detailInfo.supplierId!=50)||detailInfo.countryCode === 'FR'||detailInfo.countryCode === 'ES') && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <Button v-if="tableData[0].debitReceipt == '' && detailInfo.progressBar == 25 " type="primary" @click="uploadReceiptModal=true">点击上传</Button>
                <a v-if="declareInfo.debitReceipt != ''" :href="declareInfo.debitReceipt" target="_blank">{{"扣款回执"}}
                  <Button v-if="detailInfo.countryCode === 'IT'&& (detailInfo.progressBar == 27) " @click="uploadReceiptModal=true">重新上传</Button>
                </a>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="其它平台销售额：" v-if="tableData.length!=0">
                <span>{{tableData[0].otherIncludTaxAmt || '暂无'}}</span>
              </FormItem>
              <FormItem label="其它平台销售额文件：" v-if="tableData.length!=0">
                <div v-if="tableData[0].otherSaleFileUrl != ''">
                  <a target="_blank" :href="tableData[0].otherSaleFileUrl" style="margin-right:5px;">{{"点击下载"}}</a>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="销售额文件：" v-if="tableData.length!=0">
                <div v-if="tableData[0].sellFile != ''">
                  <a target="_blank" :href="tableData[0].sellFile.slice(0,5)=='http:'?(tableData[0].sellFile.slice(0,4)+'s'+tableData[0].sellFile.slice(4)):tableData[0].sellFile" style="margin-right:5px;">{{"点击下载"}}</a>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="gateway 账号：" v-if="detailInfo.countryCode=='GB'">
                <span>{{detailInfo.gatewayId}}</span>
              </FormItem>
              <FormItem label="gateway 密码：" v-if="detailInfo.countryCode=='GB'">
                <span>{{detailInfo.gatewayPassword}}</span>
              </FormItem>
              <div v-if="detailInfo.countryCode === 'SA' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <FormItem label="发票开具通知：">
                  <a v-if="tableData[0].invoiceReceipt != ''" :href="tableData[0].invoiceReceipt" target="_blank">{{"发票开具通知"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="纳税付款发票信件：">
                  <a v-if="tableData[0].payLetterInvoiceReceipt != ''" :href="tableData[0].payLetterInvoiceReceipt" target="_blank">{{"纳税付款发票信件"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="纳税付款系统发票：">
                  <a v-if="tableData[0].paySystemInvoiceReceipt != ''" :href="tableData[0].paySystemInvoiceReceipt" target="_blank">{{"纳税付款系统发票"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="税务申报接收通知：">
                  <a v-if="tableData[0].taxDeclareReceiveInformReceipt != ''" :href="tableData[0].taxDeclareReceiveInformReceipt" target="_blank">{{"税务申报接收通知"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="税务申请表：">
                  <a v-if="tableData[0].taxDeclareBlankReceipt != ''" :href="tableData[0].taxDeclareBlankReceipt" target="_blank">{{"税务申请表"}}</a>
                  <span v-else>暂无</span>
                </FormItem>
              </div>
              <FormItem label="税金收款回执：" v-if="detailInfo.countryCode === 'AE' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <a v-if="tableData[0].taxesReceipt != ''" :href="tableData[0].taxesReceipt" target="_blank">{{"税金收款回执"}}</a>
                <span v-else>暂无</span>
              </FormItem>
            </Form>

          </div>
          <div class="declareData"
              v-if="((detailInfo.progressBar == 20 && productFunctionCode == 2) || detailInfo.progressBar == 21 || detailInfo.progressBar == 22 ||detailInfo.progressBar == 23 ||detailInfo.progressBar == 24 || detailInfo.progressBar == 25 || detailInfo.progressBar == 26 || detailInfo.progressBar == 27) &&!isService">
            <p>申报数据：</p>
            <p style="text-align:right">
              <Button type="primary" @click="buShenBaoModalHandel" v-if="detailInfo.progressBar == 21 && canGeneSupperDecl">生成补申报工单</Button>
            </p>
            <Form ref="declareInfo" :model="declareInfo" :label-width=120>
              <FormItem label="计税方式：">
                <RadioGroup v-model="declareInfo.declareRule">
                  <Radio :label="0" :disabled="detailInfo.progressBar!=21">
                    <span>目的国</span>
                  </Radio>
                  <Radio :label="1" :disabled="detailInfo.progressBar!=21">
                    <span>发出国</span>
                  </Radio>
                  <Radio :label="2" :disabled="detailInfo.progressBar!=21">
                    <span>零申报</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="含税销售额：">
                <Input :disabled="detailInfo.progressBar!=21" placeholder="请输入含税销售额" v-model="declareInfo.includTaxPrice" style="width:220px;" />
              </FormItem>
              <FormItem label="不含税销售额：">
                <Input :disabled="detailInfo.progressBar!=21" placeholder="请输入不含税销售额" v-model="declareInfo.excludeTaxPrice" style="width:220px;" />
              </FormItem>
              <FormItem label="销项税额：">
                <Input :disabled="detailInfo.progressBar!=21" placeholder="请输入抵扣税金" v-model="declareInfo.allTaxPrice" style="width:220px;" />
              </FormItem>
              <FormItem label="抵扣总金额：">
                <Input :disabled="detailInfo.progressBar!=21" placeholder="请输入抵扣税金" v-model="declareInfo.deductionPrice" style="width:220px;" />
              </FormItem>
              <FormItem label="最终缴纳税金：">
                <Input :disabled="detailInfo.progressBar!=21" placeholder="请输入缴纳税金" v-model="declareInfo.allTaxPrice" style="width:220px;" />
              </FormItem>
              <FormItem label="税金缴纳凭证：" v-if="detailInfo.progressBar == 25 || detailInfo.progressBar == 27">
                <div v-if="declareInfo.taxCertificate != ''">
                  <a target="_blank" v-for="(item,index) in declareInfo.taxCertificate" :key="index" :href="item" style="margin-right:5px;">{{"缴税凭证"}}</a>
                </div>
              </FormItem>
              <FormItem label="抵扣明细：">
                <Table :data='deductionInfo' :columns='columns1'>
                  <template slot="deductionType" slot-scope="{ row }">
                    <span>{{row.deductionType == '1' ? '进口增值税抵扣' : row.deductionType == '2' ? '发票抵扣' : row.deductionType == '3' ? '欧盟内采购' : row.deductionType == '4' ? 'B2B发票': '其他'}}</span>
                  </template>
                  <template slot="deductFile" slot-scope="{ row }">
                    <a :href="row.deductionFile" target="_blank">{{row.fileOriginalName}}</a>
                  </template>
                  <template slot="operate" slot-scope="{ row }">
                    <span v-if="detailInfo.progressBar == 23" style="cursor: pointer;" @click="editDeduction(row)">【修改】</span>
                  </template>
                </Table>
              </FormItem>
            </Form>
          </div>
          <div class="transferAgentBox"
              v-if="detailInfo.progressBar==19||(detailInfo.progressBar==20 && productFunctionCode==2)||detailInfo.progressBar==29 || detailInfo.progressBar==31 || detailInfo.progressBar==32 || detailInfo.progressBar==28|| detailInfo.progressBar==36 ||detailInfo.progressBar==37 || detailInfo.progressBar==38 ||isService">
            <div class="btnBox">
              <span>转代理资料</span>
              <div>
                
                <Button type="primary" @click="downloadTransfer">下载转代理资料</Button>

                <Button type="primary" @click="buShenBaoModalHandel" v-if="detailInfo.progressBar==20 && canGeneSupperDecl" style="margin-left:10px;">生成补申报工单</Button>
              </div>
            </div>
            <Form :label-width="190" :model="tranferAgentInfo" ref="tranferAgentInfo" :rules="ruleForm">
              <FormItem label="VAT税号：" prop="vatTaxNumber">
                <Input v-model="tranferAgentInfo.vatTaxNumber" style="width:220px;" placeholder="请输入VAT税号" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="报税周期：" prop="declarePeriod">
                <Select v-model="tranferAgentInfo.declarePeriod" placeholder="请选择报税周期" style="width:220px;" :disabled="!isEditor">
                  <Option :value="item.status" v-for="(item,index) in declareList" :key="index" :disabled="detailInfo.countryCode == 'CZ' && item.status != 0">{{item.type}}</Option>
                </Select>
              </FormItem>
              <FormItem label="前代理名称：" prop="formerAgentName" v-if="detailInfo.countryNameZh=='法国'">
                <Input v-model="tranferAgentInfo.formerAgentName" style="width:220px;" placeholder="请输入前代理名称" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="前代理地址：" prop="formerAgentAddress" v-if="detailInfo.countryNameZh=='法国'">
                <Input v-model="tranferAgentInfo.formerAgentAddress" style="width:220px;" placeholder="请输入前代理地址" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="前代理siret号：" prop="formerAgentSiret" v-if="detailInfo.countryNameZh=='法国'">
                <Input v-model="tranferAgentInfo.formerAgentSiret" style="width:220px;" placeholder="请输入前代理siret号" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="前代理税号：" prop="formerAgentVatNumber" v-if="detailInfo.countryNameZh=='法国'">
                <Input v-model="tranferAgentInfo.formerAgentVatNumber" style="width:220px;" placeholder="请输入前代理税号" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="公司中文名称：" prop="companyNameZh">
                <AutoComplete v-if="detailInfo.progressBar === 28" v-model="tranferAgentInfo.companyNameZh" :data="lenovoSearchList" @on-select="selectCompany" :disabled="!isEditor" style="width:220px;" placeholder="请输入公司中文名称">
                </AutoComplete>
                <Input v-else v-model="tranferAgentInfo.companyNameZh" style="width:220px;" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="公司英文名称：" prop="companyNameEn">
                <Input v-model="tranferAgentInfo.companyNameEn" style="width:220px;" placeholder="请输入公司英文名称" :disabled="!isEditor" />
              </FormItem>
              <FormItem label="公司中文地址：" prop="companyAddressCn" class="requiredItem" v-if="detailInfo.countryNameZh === '西班牙'">
                <Input v-model="tranferAgentInfo.companyAddressCn" :disabled="!isEditor" placeholder="请输入公司中文地址" style="width:220px;" />
              </FormItem>
              <FormItem label="公司英文地址：" prop="companyAddressEnCountry" class="requiredItem" v-if="!(detailInfo.countryNameZh=='意大利' && detailInfo.supplierId == 50)">
                <Input v-model="tranferAgentInfo.companyAddressEnCountry" :disabled="!isEditor" placeholder="如:China" style="width:148px;margin-right:6px" />
                <Input v-model="tranferAgentInfo.companyAddressEnProvince" :disabled="!isEditor" placeholder="如：GuangDong" style="width:148px;" /><br />
                <Input v-model="tranferAgentInfo.companyAddressEnCity" :disabled="!isEditor" placeholder="如：ShenZhen" style="width:148px;" /><br />
                <Input v-model="tranferAgentInfo.companyAddressEn" :disabled="!isEditor" placeholder="请输入公司英文地址" style="width: 300px;margin-top:10px;" type="textarea" />
              </FormItem>
              <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEnCountry" v-if="detailInfo.countryNameZh=='意大利' && detailInfo.supplierId == 50">
                  <Input v-model="tranferAgentInfo.companyAddressEnCountry" :disabled="!isEditor" placeholder="如:China" style="width:97px;margin-right:3px" />
                  <Input v-model="tranferAgentInfo.companyAddressEnProvince" :disabled="!isEditor" placeholder="如：GuangDong" style="width:97px;margin-right:3px" />
                  <Input v-model="tranferAgentInfo.companyAddressEnCity" :disabled="!isEditor" placeholder="如：ShenZhen" style="width:100px;" /><br />
                  <Input v-model="tranferAgentInfo.companyAddressEn" :disabled="!isEditor" placeholder="请输入公司英文地址" style="width: 300px" type="textarea" />
              </FormItem>
              <FormItem label="欧盟税号：" prop="vatTaxEuNumber" v-if="detailInfo.countryNameZh=='德国'">
                <Input v-model="tranferAgentInfo.vatTaxEuNumber" style="width:220px;" placeholder="请输入欧盟税号" :disabled="!isEditor" />
              </FormItem>
              <div v-if="detailInfo.countryNameZh=='德国'">
                <FormItem label="邮编号码：" prop="postCode">
                  <Input v-model="tranferAgentInfo.postCode" style="width:220px;" placeholder="请输入邮编号码" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upBeginTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="本地税号文件：" prop="vatTaxLocalFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxLocalFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxLocalFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxLocalFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxLocalFile!=''">
                      <a :href="tranferAgentInfo.vatTaxLocalFile" target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxLocalFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="欧盟税号文件：" prop="vatTaxEuFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxEuFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxEuFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxEuFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxEuFile!=''">
                      <a :href="tranferAgentInfo.vatTaxEuFile" target="_blank" style="margin-right:20px;margin-left:20px">欧盟税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxEuFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="税务文件副本：" prop="vatTaxFileCopy">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxFileCopy')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxFileCopy')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxFileCopy==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxFileCopy!=''">
                      <a :href="tranferAgentInfo.vatTaxFileCopy" target="_blank">税务文件副本</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxFileCopy')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="申报周期更改信件：" v-if="tranferAgentInfo.declarePeriod == '1' || tranferAgentInfo.declarePeriod == '2'" prop="declarePeriodChangeLetter">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'declarePeriodChangeLetter')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'declarePeriodChangeLetter')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.declarePeriodChangeLetter==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.declarePeriodChangeLetter">
                      <a :href="tranferAgentInfo.declarePeriodChangeLetter" target="_blank" style="margin-right:20px;margin-left:20px">申报周期更改信件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','declarePeriodChangeLetter')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='英国'">
                <FormItem label="法人中文名：" prop="companyLegalPersonZh">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司邮箱：" prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司电话：" prop="companyTel">
                  <Input v-model="tranferAgentInfo.companyTel" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="描述下公司的经营内容：" prop="companyBusinessModeDescribe">
                  <Input v-model="tranferAgentInfo.companyBusinessModeDescribe" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate">
                  <DatePicker type="date" placeholder="请选择税号生效日期" style="width:200px" v-model="tranferAgentInfo.taxEffectiveDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upEndTime">
                  <DatePicker type="month" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="报税方式：" prop="declareRule">
                  <Select v-model="tranferAgentInfo.declareRule" style="width:200px">
                    <Option value="0">目的国</Option>
                    <Option value="1">发出国</Option>
                  </Select>
                </FormItem>
                <FormItem label="报税税率：" prop="taxRate">
                  <Select v-model="tranferAgentInfo.taxRate" style="width:200px">
                    <Option value="6.5">6.5%</Option>
                    <Option value="7.5">7.5%</Option>
                    <Option value="16.5">16.5%</Option>
                    <Option value="20">20%</Option>
                  </Select>
                  <p style="color:#ed4014;">请按照实际情况选择，如不清楚，可询问前税代；</p>
                </FormItem>
                <FormItem label="申报回执第五行金额：" prop="returnReceiptBox5">
                  <Input v-model="tranferAgentInfo.returnReceiptBox5" style="width:220px;" placeholder="请输入BOX5金额" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="英国地址邮编：" prop="gbAddressPostcode">
                  <Input v-model="tranferAgentInfo.gbAddressPostcode" style="width:220px;" placeholder="请输入英国地址邮编" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="Gateway  账号：" prop="gatewayId">
                  <Input v-model="tranferAgentInfo.gatewayId" style="width:220px;" :disabled='!isEditor'></Input>
                </FormItem>
                <FormItem label="Gateway  密码：" prop="gatewayPassword">
                  <Input v-model="tranferAgentInfo.gatewayPassword" style="width:220px;" :disabled='!isEditor'></Input>
                </FormItem>
                <FormItem label="是否能够提供Gateway验证码：" prop="gatewayVerificationCode">
                  <RadioGroup v-model="tranferAgentInfo.gatewayVerificationCode">
                    <Radio label="1" :disabled="!isEditor">是</Radio>
                    <Radio label="0" :disabled="!isEditor">否</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="Gateway  绑定邮箱：" prop="gatewayEmail">
                  <Input v-model="tranferAgentInfo.gatewayEmail" style="width:220px;" :disabled='!isEditor'></Input>
                </FormItem>
                <FormItem label="最后一次登录Gateway时间：" prop="gatewayLastLoginDate">
                  <DatePicker type="date" placeholder="请选择最后一次登录Gateway时间" style="width:200px" v-model="tranferAgentInfo.gatewayLastLoginDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="注册税号日期：">
                  <DatePicker type="date" placeholder="请选择注册税号日期" style="width:200px" v-model="tranferAgentInfo.registerTaxDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="营业执照扫描件/照片：" prop="companyBusinessLicense">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="身份证正反面/护照：" prop="legalPersonPapers">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'legalPersonPapers')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'legalPersonPapers')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.legalPersonPapers==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.legalPersonPapers!=''">
                    <a :href="tranferAgentInfo.legalPersonPapers" target="_blank">{{'身份证正反面/护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','legalPersonPapers')" />
                  </div>
                </FormItem>
                <FormItem label="VAT证书：" prop="vatCertificate">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatCertificate!=''">
                    <a :href="tranferAgentInfo.vatCertificate" target="_blank">{{'VAT证书'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatCertificate')" />
                  </div>
                </FormItem>
                <FormItem label="在前代理最后一次申报回执：" prop="lastDeclareReceipt">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">{{'申报回执'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="在前代理最后一次支付凭证：" prop="lastPayCertificate">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">{{'支付凭证'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='意大利' && detailInfo.supplierId != 50">
                <FormItem label="公司统一社会信用代码：" prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人身份证/护照号码：" prop="companyLegalPersonCard">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生地：" prop="companyLegalPersonBirthplace">
                  <Input v-model="tranferAgentInfo.companyLegalPersonBirthplace" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday">
                  <DatePicker :disabled="!isEditor" v-model="tranferAgentInfo.companyLegalPersonBirthday" type="date" placeholder="请选择法人出生日期" style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="描述下公司的经营内容：" prop="companyBusinessModeDescribe">
                  <Input v-model="tranferAgentInfo.companyBusinessModeDescribe" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate">
                  <DatePicker type="date" placeholder="请选择税号生效日期" style="width:200px" v-model="tranferAgentInfo.taxEffectiveDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upEndTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="税号文件：" prop="vatTaxNumberFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史扣款回执：" prop="lastPayCertificate">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                      <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">历史扣款回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：" prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf','zip']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="转代理授权书：">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'registrationAuthorization')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'registrationAuthorization')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.registrationAuthorization==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.registrationAuthorization!=''">
                      <a :href="tranferAgentInfo.registrationAuthorization" target="_blank">转代理授权书</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','registrationAuthorization')" />
                    </div>
                  </div>
                </FormItem>
              </div>

              <div v-if="detailInfo.countryNameZh=='意大利' && detailInfo.supplierId == 50">
                <FormItem label="公司统一社会信用代码：" prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate">
                  <DatePicker type="date" placeholder="请选择税号生效日期" style="width:200px" v-model="tranferAgentInfo.taxEffectiveDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upEndTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="是否已有EORI号：" class="requiredItem" prop="isThereEoriNumber">
                  <RadioGroup v-model="tranferAgentInfo.isThereEoriNumber">
                    <Radio label="1" :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio label="2" :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <p>（2选1）营业执照扫描件/商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件 --- 必填</p>
                <FormItem label="公司类型" class="requiredItem" prop="companyType">
                  <RadioGroup v-model="tranferAgentInfo.companyType">
                    <Radio :disabled="!isEditor" :label="'1'">大陆公司</Radio>
                    <Radio :disabled="!isEditor" :label="'2'">香港公司</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="营业执照扫描件/照片：" class="requiredItem" prop="companyBusinessLicense" v-if="tranferAgentInfo.companyType==1">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="商业登记证BR：" class="requiredItem" prop="companyBusinessRegistrationBr" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                    <a :href="tranferAgentInfo.companyBusinessRegistrationBr" target="_blank">商业登记证BR</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                  </div>
                </FormItem>
                <FormItem label="公司注册证明书CI：" class="requiredItem" prop="companyRegistrationCi" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                    <a :href="tranferAgentInfo.companyRegistrationCi" target="_blank">公司注册证明书CI</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
                  </div>
                </FormItem>
                <FormItem label="法团成立表格NNC1：" class="requiredItem" prop="companyCorporateFoundingNnc1" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                    <a :href="tranferAgentInfo.companyCorporateFoundingNnc1" target="_blank">法团成立表格NNC1</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                  </div>
                </FormItem>
                <p>（2选1）身份证正反面扫描件 / 护照扫描件 --- 必填</p>
                <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                  <RadioGroup v-model="tranferAgentInfo.certificateType">
                    <Radio :disabled="!isEditor" :label="'1'">身份证</Radio>
                    <Radio :disabled="!isEditor" :label="'2'">护照</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="身份证正面：" class="requiredItem" prop="companyLegalPersonCardFront" v-if="tranferAgentInfo.certificateType == 1">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">{{'身份证正面'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
                <FormItem label="身份证反面：" class="requiredItem" prop="companyLegalPersonCardReverse" v-if="tranferAgentInfo.certificateType == 1">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardReverse')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardReverse==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardReverse!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardReverse" target="_blank">{{'身份证反面'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardReverse')" />
                  </div>
                </FormItem>
                <FormItem label="护照：" class="requiredItem" prop="companyLegalPersonCardPassport" v-if="tranferAgentInfo.certificateType == 2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="店铺后台信息截图：" prop="shopConsoleScreenshot" class="requiredItem">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                    <a :href="tranferAgentInfo.shopConsoleScreenshot" target="_blank">{{'店铺后台信息截图'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件：" class="requiredItem" prop="vatTaxNumberFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史扣款回执：" prop="lastPayCertificate" class="requiredItem">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                      <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">历史扣款回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：" prop="lastDeclareReceipt" class="requiredItem">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf','zip']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="转代理授权书：">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'registrationAuthorization')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'registrationAuthorization')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.registrationAuthorization==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.registrationAuthorization!=''">
                      <a :href="tranferAgentInfo.registrationAuthorization" target="_blank">转代理授权书</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','registrationAuthorization')" />
                    </div>
                  </div>
                </FormItem>
              </div>

              <div v-if="detailInfo.countryNameZh=='西班牙'">
                <!-- <FormItem label='公司邮政编号：'
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
                </div> -->
                <FormItem label="公司统一社会信用代码：" prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <!-- <FormItem label="公司注册资本："
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
                </FormItem>-->
                <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                  <Input :disabled="!isEditor" placeholder="请输入法人中文姓名" v-model="tranferAgentInfo.companyLegalPersonZh" style="width:300px;" />
                </FormItem>
                <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                  <Input :disabled="!isEditor" placeholder="请输入法人英文姓名" v-model="tranferAgentInfo.companyLegalPersonEn" style="width:300px;" />
                </FormItem>
                <!-- <FormItem label="法人出生日期："
                          class="requiredItem">
                  <DatePicker @on-change="changeLegalBirthDate"
                              :disabled="!isEditor"
                              :value="tranferAgentInfo.companyLegalPersonBirthday"
                              v-model="tranferAgentInfo.companyLegalPersonBirthday"
                              type="date"
                              placeholder="请选择法人出生日期"
                              style="width: 300px"></DatePicker>
                </FormItem> -->
                <FormItem label="护照/身份证号码：" class="requiredItem" prop="companyLegalPersonCard">
                  <Input :disabled="!isEditor" placeholder="请输入护照/身份证号码" v-model="tranferAgentInfo.companyLegalPersonCard" style="width:300px;" />
                </FormItem>
                <!-- <FormItem label="婚姻状况："
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
                </FormItem> -->
                <FormItem v-if="detailInfo.countryNameZh=='西班牙'" label="法人出生省市（中文）：" class="requiredItem" prop="legalPersonBirthplaceProvinceEn">
                  <Input :disabled="!isEditor" placeholder="请输入省份" v-model="tranferAgentInfo.legalPersonBirthplaceProvinceZh" style="width: 150px" />
                  <Input :disabled="!isEditor" placeholder="请输入城市" v-model="tranferAgentInfo.legalPersonBirthplaceProvinceEn" style="width: 150px" />
                </FormItem>
                <FormItem v-if="detailInfo.countryNameZh=='AA'" label="法人出生省市（英文）：" class="requiredItem">
                  <Input :disabled="!isEditor" placeholder="请输入省份拼音" v-model="tranferAgentInfo.legalPersonBirthplaceCityZh" style="width: 150px" />
                  <Input :disabled="!isEditor" placeholder="请输入城市拼音" v-model="tranferAgentInfo.legalPersonBirthplaceCityEn" style="width: 150px" />
                </FormItem>
                <FormItem label="法人身份证中文地址：" class="requiredItem" prop="companyLegalPersonCardAddressCn">
                  <Input :disabled="!isEditor" placeholder="请输入法人身份证中文地址" v-model="tranferAgentInfo.companyLegalPersonCardAddressCn" style="width:300px;" />
                </FormItem>
                <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                  <Input :disabled="!isEditor" placeholder="请输入法人身份证英文地址" v-model="tranferAgentInfo.companyLegalPersonCardAddress" style="width:300px;" />
                </FormItem>
                <!-- <FormItem label="邮编号码："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入邮编号码"
                         v-model="tranferAgentInfo.postCode"
                         style="width:300px;" />
                </FormItem> -->
                <FormItem label="平台店铺链接：" class="requiredItem" prop="shopHref">
                  <Input :disabled="!isEditor" placeholder="请输入平台店铺链接" v-model="tranferAgentInfo.shopHref" style="width:300px;" />
                </FormItem>
                <!-- <FormItem label="是否已有EORI号："
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
                </FormItem>-->
                <FormItem label="上一次申报区间：" prop="upEndTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <p>（2选1）营业执照扫描件/商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件 --- 必填</p>
                <FormItem label="公司类型" class="requiredItem" prop="companyType">
                  <RadioGroup v-model="tranferAgentInfo.companyType">
                    <Radio :disabled="!isEditor" :label="'1'">大陆公司</Radio>
                    <Radio :disabled="!isEditor" :label="'2'">香港公司</Radio>
                    <Radio :disabled="!isEditor" :label="'3'">海外公司</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="营业执照扫描件/照片：" prop="companyBusinessLicense" v-if="tranferAgentInfo.companyType==1 || tranferAgentInfo.companyType==3">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="!isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="公司国籍：" prop="companyCitizenship" v-if="tranferAgentInfo.companyType==3" class="requiredItem">
                  <Select v-model="tranferAgentInfo.companyCitizenship" placeholder="请选择公司国籍" style="width:300px;" :disabled="!isEditor">
                    <Option v-for="item in placeList" :value="item" :key="item.value">{{ item }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="商业登记证BR：" prop="companyBusinessRegistrationBr" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                    <a :href="tranferAgentInfo.companyBusinessRegistrationBr" target="_blank">商业登记证BR</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                  </div>
                </FormItem>
                <FormItem label="公司注册证明书CI：" prop="companyRegistrationCi" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                    <a :href="tranferAgentInfo.companyRegistrationCi" target="_blank">公司注册证明书CI</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
                  </div>
                </FormItem>
                <FormItem label="法团成立表格NNC1：" prop="companyCorporateFoundingNnc1" v-if="tranferAgentInfo.companyType==2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                    <a :href="tranferAgentInfo.companyCorporateFoundingNnc1" target="_blank">法团成立表格NNC1</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                  </div>
                </FormItem>
                <p>（2选1）身份证正反面扫描件 / 护照扫描件 --- 必填</p>
                <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                  <RadioGroup v-model="tranferAgentInfo.certificateType">
                    <Radio :disabled="!isEditor" :label="'1'">身份证</Radio>
                    <Radio :disabled="!isEditor" :label="'2'">护照</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="身份证正反面：" prop="companyLegalPersonCardFront" v-if="tranferAgentInfo.certificateType == 1">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">{{'身份证正反面/护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
                <FormItem label="护照：" prop="companyLegalPersonCardPassport" v-if="tranferAgentInfo.certificateType == 2">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="法人国籍：" prop="companyLegalPersonCitizenship" v-if="tranferAgentInfo.certificateType == 2" class="requiredItem">
                  <Select v-model="tranferAgentInfo.companyLegalPersonCitizenship" placeholder="请选择法人国籍" style="width:300px;" :disabled="!isEditor">
                    <Option v-for="item in placeList" :value="item" :key="item.value">{{ item }}</Option>
                  </Select>
                </FormItem>
                <p>以下三种必填 --- 必填</p>
                <FormItem label="公司信用报告：" class="requiredItem" prop="companyCreditReport" v-if="detailInfo.countryNameZh=='AA'">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCreditReport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCreditReport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCreditReport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCreditReport!=''">
                    <a :href="tranferAgentInfo.companyCreditReport" target="_blank">{{'公司信用报告'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCreditReport')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件：" prop="vatTaxNumberFile" class="requiredItem">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：" prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf','zip']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='法国'">
                <FormItem label="公司邮箱：" prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司邮编号码：" prop="companyPostCode">
                  <Input v-model="tranferAgentInfo.companyPostCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人中文名：" prop="companyLegalPersonZh" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday">
                  <DatePicker v-model="tranferAgentInfo.companyLegalPersonBirthday" type="date" placeholder="请选择法人出生日期" style="width: 200px" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="邮编号码：" prop="legalPersonPostCode">
                  <Input v-model="tranferAgentInfo.legalPersonPostCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="身份证/护照号码：">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard" placeholder="请填身份证号码" style="width:220px;" :disabled="!isEditor" />
                  <Input v-model="tranferAgentInfo.legalPersonCardPassportNumber" placeholder="请填护照号码" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生省份：" prop="legalPersonBirthplaceProvinceZh">
                  <Input v-model="tranferAgentInfo.legalPersonBirthplaceProvinceZh" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人国籍：" prop="companyLegalPersonCitizenship" class="requiredItem">
                  <Select v-model="tranferAgentInfo.companyLegalPersonCitizenship" placeholder="请选择法人国籍" :disabled="!isEditor" style="width:300px;">
                    <Option v-for="item in placeList" :value="item" :key="item.value">{{ item }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="公司统一社会信用代码：" prop="companyCreditCode">
                  <Input v-model="tranferAgentInfo.companyCreditCode" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司注册资本：" prop="companyRegisteredCapital" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyRegisteredCapital" type="number" style="width:220px;" placeholder=" 请输入完整的注册资本金额，如10W，则输入100000"  :disabled="!isEditor" />元
                </FormItem>
                <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="是否已有EORI号：" class="requiredItem" prop="needEoriNumber">
                  <RadioGroup v-model="tranferAgentInfo.needEoriNumber">
                    <Radio label="1" :disabled="!isEditor">
                      <span>是</span>
                    </Radio>
                    <Radio label="0" :disabled="!isEditor">
                      <span>否</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="税号生效日期：" class="requiredItem" prop="taxEffectiveDate">
                  <DatePicker v-model="tranferAgentInfo.taxEffectiveDate" type="date" placeholder="请选择税号生效日期" style="width: 200px" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="是否有欧盟其他国家税号：">
                  <Input :disabled="!isEditor" placeholder="如有可填写" v-model="tranferAgentInfo.shopOtherEuTaxNumber" style="width: 300px" />
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upEndTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                 <FormItem label="公司类型" prop="companyType">
                  <RadioGroup v-model="tranferAgentInfo.companyType" @on-change="companyTypeChange">
                      <Radio :disabled="!isEditor" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isEditor" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isEditor" :label="'3'">海外公司</Radio>
                    </RadioGroup>
                </FormItem>
                <!-- <p>（2选1）营业执照扫描件/商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件 --- 必填</p> -->
                <FormItem label="营业执照扫描件/照片：" v-if="tranferAgentInfo.companyType == 1">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
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
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                    <a :href="tranferAgentInfo.companyBusinessRegistrationBr" target="_blank">商业登记证BR</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
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
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                    <a :href="tranferAgentInfo.companyRegistrationCi" target="_blank">公司注册证明书CI</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
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
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                    <a :href="tranferAgentInfo.companyCorporateFoundingNnc1" target="_blank">法团成立表格NNC1</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                  </div>
                </FormItem>
                 <FormItem label="公司章程：" prop="articlesOfAssociationFile" class="requiredItem"  v-if="tranferAgentInfo.companyType == 3">
                  <div class="upload-file-box">
                    {{tranferAgentInfo.articlesOfAssociationFile}}
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.articlesOfAssociationFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.articlesOfAssociationFile!=''">
                      <a :href="tranferAgentInfo.articlesOfAssociationFile" target="_blank">公司章程</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','articlesOfAssociationFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="银行账号文件："  prop="bankAccountFile" v-if="tranferAgentInfo.companyType == 3">
                  {{tranferAgentInfo.bankAccountFile}}
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bankAccountFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'bankAccountFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.bankAccountFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.bankAccountFile!=''">
                      <a :href="tranferAgentInfo.bankAccountFile" target="_blank">银行账号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','bankAccountFile')" />
                    </div>
                  </div>
                </FormItem>
                  <FormItem label="公司本国税号文件：" prop="companyTaxNumFile" v-if="tranferAgentInfo.companyType == 3">
                  {{tranferAgentInfo.companyTaxNumFile}}
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyTaxNumFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyTaxNumFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyTaxNumFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyTaxNumFile!=''">
                      <a :href="tranferAgentInfo.companyTaxNumFile" target="_blank">公司本国税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyTaxNumFile')" />
                    </div>
                  </div>
                </FormItem>
               
                <p>（2选1）身份证正反面扫描件 / 护照扫描件 --- 必填</p>
                <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="tranferAgentInfo.certificateType">
                      <Radio :disabled="!isEditor || tranferAgentInfo.companyType == '3' "
                             :label="'1'">身份证</Radio>
                      <Radio :disabled="!isEditor"
                             :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                <FormItem label="身份证正面：" v-if="tranferAgentInfo.certificateType == 1" prop="companyLegalPersonCardFront">
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
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront"
                       target="_blank">{{'身份证正面'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
                <FormItem label="身份证反面：" v-if="tranferAgentInfo.certificateType == 1" prop="companyLegalPersonCardReverse">
                  <Upload type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}"
                          :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardReverse')}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          style="width:300px"
                          :disabled='!isEditor'
                          :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload"
                            size="30"
                            style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardReverse==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardReverse!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardReverse"
                       target="_blank">{{'身份证反面'}}</a>
                    <Icon v-if="isEditor"
                          type="ios-close-circle"
                          @click.stop="removeHandler('','','companyLegalPersonCardReverse')" />
                  </div>
                </FormItem>
                <FormItem label="护照：" v-if="tranferAgentInfo.certificateType == 2" prop="companyLegalPersonCardPassport">
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
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <p>以下三种必填 --- 必填</p>
                <FormItem label="后台截图：" prop="shopConsoleScreenshot" class="requiredItem">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                    <a :href="tranferAgentInfo.shopConsoleScreenshot" target="_blank">{{'后台截图'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件：" prop="vatTaxNumberFile">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                      <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">本地税号文件</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：" prop="lastDeclareReceipt">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                      <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史支付回执：" prop="lastPayCertificate">
                  <div v-if="JSON.stringify(tranferAgentInfo)!='{}'">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastPayCertificate')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                      <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">历史支付回执</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                    </div>
                  </div>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='沙特'">
                <FormItem label="联系电话：" prop="companyLegalPersonMobile" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonMobile" style="width:220px;" placeholder="请输入常用联系手机号" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系邮箱：" prop="companyLegalPersonEmail" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEmail" style="width:220px;" placeholder="请输入常用联系邮箱" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="店铺性质：" prop="shopNature" class="requiredItem">
                  <RadioGroup v-model="tranferAgentInfo.shopNature">
                    <Radio label="1" :disabled="!isEditor">公司经营</Radio>
                    <Radio label="2" :disabled="!isEditor">个体工商户</Radio>
                  </RadioGroup>
                </FormItem>
                <div v-if="tranferAgentInfo.shopNature==1">
                  <FormItem label="统一社会信用代码：" prop="companyCreditCode" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyCreditCode" placeholder=" 请输入营业执照的信用代码" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司成立日期：" prop="companyRegisterData" class="requiredItem">
                    <DatePicker type="date" placeholder="请选择公司成立日期" v-model="tranferAgentInfo.companyRegisterData" format="yyyy-MM-dd" class="tax-date" :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人中文名：" prop="companyLegalPersonZh" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonZh" placeholder="请填写中文名字" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人英文名：" prop="companyLegalPersonEn" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonEn" placeholder="请填写英文名字" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday" class="requiredItem">
                    <DatePicker type="date" placeholder="请选择法人出生日期" v-model="tranferAgentInfo.companyLegalPersonBirthday" format="yyyy-MM-dd" class="tax-date" :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress" placeholder="请输入法人身份证英文地址" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="账户名称：" prop="bankAccountName" class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAccountName" placeholder="请输入账户名称" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="银行名称：" prop="bankName" class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankName" placeholder="请输入银行名称" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="银行地址：" prop="bankAddress" class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAddress" placeholder="请输入支行名称" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" prop="bankAccount" class="requiredItem">
                    <Input v-model="tranferAgentInfo.bankAccount" placeholder="请输入IBAN/银行账户" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="Swift / BIC：" prop="swiftBic" class="requiredItem">
                    <Input v-model="tranferAgentInfo.swiftBic" placeholder="请输入Swift / BIC" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司网站：" prop="companyWebsite" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyWebsite" placeholder="请填写公司网站" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司股份情况：" prop="companyStockCondition" class="requiredItem">
                    <div class="shares-box" v-for="(item,index) in sharesList" :key="index">
                      <FormItem label="股东姓名：" prop="shareholderZhName" :label-width="110" class="requiredItem">
                        <Input v-model="item.shareholderZhName" placeholder="中文名" :disabled="!isEditor" style="width:120px;"></Input>
                        <Input v-model="item.shareholderEnName" placeholder="英文名" :disabled="!isEditor" style="width:150px;margin-left:10px;"></Input>
                      </FormItem>
                      <FormItem label="股东职位：" prop="position" :label-width="110" class="requiredItem">
                        <Select v-model="item.position" placeholder="股东职位" :disabled="!isEditor">
                          <Option :value="i.value" v-for="(i,index) in positionList" :key="index">{{i.value}}</Option>
                        </Select>
                      </FormItem>
                      <FormItem label="占股百分比：" prop="stockProportion" :label-width="110" class="requiredItem">
                        <Input v-model="item.stockProportion" placeholder="中文名" :disabled="!isEditor" style="width:285px;"></Input>%
                      </FormItem>
                      <FormItem label="出生日期：" :label-width="110" prop="shareholderBirthday">
                        <DatePicker type="date" placeholder="请选择出生日期" v-model="item.shareholderBirthday" format="yyyy-MM-dd" :disabled="!isEditor" style="width:285px;"></DatePicker>
                      </FormItem>
                      <Button v-if="index>0&&isEditor" @click="removeShares(index)">删除</Button>
                    </div>
                    <p class="shares-tips">温馨提示：请详细填写完整的公司股份占比信息；</p>
                    <Button @click="addShares">+添加</Button>
                  </FormItem>
                </div>
                <div v-if="tranferAgentInfo.shopNature==2">
                  <FormItem label="法人中文名：" prop="companyLegalPersonZh" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonZh" placeholder="请填写中文名字" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人英文名：" prop="companyLegalPersonEn" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonEn" placeholder="请填写英文名字" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday" class="requiredItem">
                    <DatePicker type="date" placeholder="请选择法人出生日期" v-model="tranferAgentInfo.companyLegalPersonBirthday" format="yyyy-MM-dd" class="tax-date" :disabled="!isEditor"></DatePicker>
                  </FormItem>
                  <FormItem label="法人出生地：" prop="companyLegalPersonBirthplace" class="requiredItem">
                    <Select v-model="tranferAgentInfo.companyLegalPersonBirthplace" placeholder="请选择法人出生地" :disabled="!isEditor">
                      <Option v-for="item in placeList" :value="item" :key="item.value">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="职业：" prop="profession" class="requiredItem">
                    <Input v-model="tranferAgentInfo.profession" placeholder="请输入职业" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码：" prop="companyCreditCode" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyCreditCode" placeholder="工商统一信用代码" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress" placeholder="请输入法人身份证英文地址" :disabled="!isEditor"></Input>
                  </FormItem>
                </div>
                <Divider />

                <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" placeholder=" 请输入店铺后台链接" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="电商平台账号完整名称：" prop="shopSalePlatformAccount" class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSalePlatformAccount" style="width:220px;" placeholder=" 请输入电商平台账号完整名称" :disabled="!isEditor"></Input>
                </FormItem>

                <FormItem label="税号生效日期：" prop="taxEffectiveDate" class="requiredItem">
                  <DatePicker type="date" placeholder="请选择税号生效日期" @on-change="changeVatDate($event,'taxEffectiveDate')" v-model="tranferAgentInfo.taxEffectiveDate" class="tax-date" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="在沙特前12个月的销售额：" prop="shopSaleBefore" class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSaleBefore" placeholder=" 请输入在沙特前12个月的销售额" :disabled="!isEditor" style="width:220px"></Input>SAR（币种：沙特里亚尔）
                </FormItem>
                <FormItem label="预计未来12个月销售额：" prop="shopSalePlan" class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSalePlan" placeholder=" 请输入预计未来12个月销售额" :disabled="!isEditor" style="width:220px"></Input>SAR（币种：沙特里亚尔）
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upBeginTime">
                  <div class="clearfix">
                    <div class="fl">
                      <FormItem class="requiredItem">
                        <DatePicker type="month" placeholder="开始时间" @on-change="changeVatDate($event,'upBeginTime')" style="width: 160px" v-model="tranferAgentInfo.upBeginTime" format="yyyy-MM" :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                    <span style="text-align: center" class="fl">——</span>
                    <div class="fl">
                      <FormItem prop="upEndTime">
                        <DatePicker type="month" placeholder="结束时间" @on-change="changeVatDate($event,'upEndTime')" style="width: 160px" v-model="tranferAgentInfo.upEndTime" format="yyyy-MM" :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="营业执照扫描件：" prop="companyBusinessLicense">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="公司章程：" prop="articlesOfAssociationFile" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.articlesOfAssociationFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.articlesOfAssociationFile!=''">
                      <a :href="tranferAgentInfo.articlesOfAssociationFile" target="_blank">公司章程</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','articlesOfAssociationFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="电商平台协议/合同（选填）：">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopSalePlatformContract')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopSalePlatformContract')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopSalePlatformContract==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopSalePlatformContract!=''">
                      <a :href="tranferAgentInfo.shopSalePlatformContract" target="_blank">电商平台协议/合同</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopSalePlatformContract')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="法人护照扫描件：" prop="companyLegalPersonCardPassport" class="requiredItem">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">{{'护照'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="后台店铺截图：" prop="shopConsoleScreenshot" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload type="drag" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" style="width:300px" :disabled="!isEditor">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                      <a :href="tranferAgentInfo.shopConsoleScreenshot" target="_blank">{{'后台店铺截图'}}</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="税号文件：" prop="vatTaxNumberFile" class="requiredItem">
                  <Upload type="drag" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">{{'税号文件'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：" prop="lastDeclareReceipt" class="requiredItem">
                  <Upload type="drag" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastDeclareReceipt')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf','zip']" :show-upload-list="false" :disabled="!isEditor" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">{{'历史申报回执'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="历史扣款回执：" prop="lastPayCertificate" class="requiredItem">
                  <Upload type="drag" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastPayCertificate')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf','zip']" :show-upload-list="false" :disabled="!isEditor" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">{{'历史扣款回执'}}</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="转代理原因：" prop="transformProxyReason" class="reason requiredItem">
                  <Input v-model="tranferAgentInfo.transformProxyReason" placeholder="请填写转代理原因" :disabled="!isEditor" type="textarea" :rows="4"></Input>
                </FormItem>
              </div>
              <div v-if="detailInfo.countryNameZh=='阿联酋'">
                <FormItem label="邮政编码：" prop="postCode" class="requiredItem">
                  <Input v-model="tranferAgentInfo.postCode" placeholder="请输入邮政编码" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系电话：" prop="companyLegalPersonMobile" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonMobile" placeholder="请输入常用联系手机号" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="联系邮箱：" prop="companyLegalPersonEmail" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEmail" placeholder="请输入常用联系邮箱" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="账户名称：" prop="bankAccountName" class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankAccountName" placeholder="请输入账户名称" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="银行英文名称：" prop="bankName" class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankName" placeholder="请输入银行名称" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="银行地址：" prop="bankAddress" class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankAddress" placeholder="请输入银行名称" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="支行英文名称：" prop="bankSubBranchName" class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankSubBranchName" placeholder="请输入支行名称" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="IBAN/银行账户：" prop="bankAccount" class="requiredItem">
                  <Input v-model="tranferAgentInfo.bankAccount" placeholder="请输入IBAN/银行账户" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="Swift / BIC：" prop="swiftBic" class="requiredItem">
                  <Input v-model="tranferAgentInfo.swiftBic" placeholder="请输入Swift / BIC" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人中文名：" prop="companyLegalPersonZh" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonZh" placeholder="请填写中文名字" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn" class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" placeholder="请填写英文名字" :disabled="!isEditor"></Input>
                </FormItem>
                <!-- <FormItem label="法人护照号："
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
                </FormItem> -->
                <Divider />
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate" class="requiredItem">
                  <DatePicker type="date" placeholder="请选择税号生效日期" @on-change="changeVatDate($event,'taxEffectiveDate')" v-model="tranferAgentInfo.taxEffectiveDate" class="tax-date" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="超过阈值或预计超过阈值的日期：" prop="thresholdValueTime" class="requiredItem">
                  <DatePicker type="date" placeholder="请选择超过阈值或预计超过阈值的日期" @on-change="changeVatDate($event,'thresholdValueTime')" v-model="tranferAgentInfo.thresholdValueTime" class="tax-date" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <!-- <FormItem label="过去12个月在阿联酋的营业额："
                          prop="shopSaleBefore"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopSaleBefore"
                         placeholder=" 请输入过去12个月在阿联酋的营业额"
                         :disabled="!isEditor"
                         style="width:220px"></Input>AED（币种：阿联酋迪拉姆）
                </FormItem> -->
                <FormItem label="预计未来30天的营业额：" prop="future30Sale" class="requiredItem">
                  <Input v-model="tranferAgentInfo.future30Sale" placeholder=" 请输入预计未来30天的营业额" :disabled="!isEditor" style="width:220px"></Input>AED（币种：阿联酋迪拉姆）
                </FormItem>
                <!-- <FormItem label="是否在其它海湾国家有税号或在该国有事进出口业务？："
                          prop="otherGulfStateDutyOrServices"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.otherGulfStateDutyOrServices"
                         placeholder=" 如没有，请填写无"
                         :disabled="!isEditor"></Input>
                </FormItem> -->
                <FormItem label="是否有其他海湾国税号或业务：" prop="isOtherGulfStateDutyOrServices">
                  <RadioGroup v-model="tranferAgentInfo.isOtherGulfStateDutyOrServices">
                    <Radio label="1">是</Radio>
                    <Radio label="2">否</Radio>
                  </RadioGroup>
                </FormItem>
                <!-- <FormItem label="选择申请人的其它商业活动："
                          prop="otherBusinessActivities"
                          class="requiredItem">
                  <Select v-model="tranferAgentInfo.otherBusinessActivities"
                          placeholder="请选择"
                          :disabled="!isEditor">
                    <Option :value="i.value"
                            v-for="(i,index) in commerceList"
                            :key="index">{{i.value}}</Option>
                  </Select>
                </FormItem> -->
                <FormItem label="上一次申报区间：" class="requiredItem">
                  <div class="clearfix">
                    <div class="fl">
                      <FormItem prop="upBeginTime">
                        <DatePicker type="month" placeholder="开始时间" @on-change="changeVatDate($event,'upBeginTime')" style="width: 160px" v-model="tranferAgentInfo.upBeginTime" format="yyyy-MM" :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                    <span style="text-align: center" class="fl">——</span>
                    <div class="fl">
                      <FormItem prop="upEndTime">
                        <DatePicker type="month" placeholder="结束时间" @on-change="changeVatDate($event,'upEndTime')" style="width: 160px" v-model="tranferAgentInfo.upEndTime" format="yyyy-MM" :disabled="!isEditor"></DatePicker>
                      </FormItem>
                    </div>
                  </div>
                </FormItem>
                <Divider />
                <FormItem label="营业执照扫描件：" prop="companyBusinessLicense" class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="法人护照扫描件：" prop="companyLegalPersonCardPassport" class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardPassport')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">法人护照扫描件</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                  </div>
                </FormItem>
                <FormItem label="税号文件：" prop="vatTaxNumberFile" class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="后台店铺截图：" prop="shopConsoleScreenshot" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload type="drag" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" style="width:300px" :disabled="!isEditor">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopConsoleScreenshot==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                      <a :href="tranferAgentInfo.shopConsoleScreenshot" target="_blank">{{'后台店铺截图'}}</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="公司章程：" prop="articlesOfAssociationFile" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.articlesOfAssociationFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.articlesOfAssociationFile!=''">
                      <a :href="tranferAgentInfo.articlesOfAssociationFile" target="_blank">公司章程</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','articlesOfAssociationFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="过往12个月销售报告：" prop="shopSaleBeforeFile" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopSaleBeforeFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopSaleBeforeFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.shopSaleBeforeFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.shopSaleBeforeFile!=''">
                      <a :href="tranferAgentInfo.shopSaleBeforeFile" target="_blank">过往12个月销售报告</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopSaleBeforeFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="股份分配证书：" class="requiredItem" prop="companyStockConditionFile">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyStockConditionFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyStockConditionFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyStockConditionFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyStockConditionFile!=''">
                      <a :href="tranferAgentInfo.companyStockConditionFile" target="_blank">股份分配证书</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyStockConditionFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="清关报告：" class="requiredItem" prop="customsClearanceReport">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'customsClearanceReport')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'customsClearanceReport')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.customsClearanceReport==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.customsClearanceReport!=''">
                      <a :href="tranferAgentInfo.customsClearanceReport" target="_blank">清关报告</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','customsClearanceReport')" />
                    </div>
                  </div>
                </FormItem>

                <FormItem label="上传销售证据：" prop="salesEvidenceFile" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'salesEvidenceFile')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'salesEvidenceFile')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.salesEvidenceFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.salesEvidenceFile!=''">
                      <a :href="tranferAgentInfo.salesEvidenceFile" target="_blank">销售证据</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','salesEvidenceFile')" />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="历史缴税支付证明：" prop="lastPayCertificate" class="requiredItem">
                  <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastPayCertificate')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastPayCertificate')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf','zip']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastPayCertificate==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastPayCertificate!=''">
                    <a :href="tranferAgentInfo.lastPayCertificate" target="_blank">历史缴税支付证明</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastPayCertificate')" />
                  </div>
                </FormItem>
                <FormItem label="罚款记录和交罚款证明（选填）：" prop="recordOfPenaltyCharges">
                  <Upload :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'recordOfPenaltyCharges')}" :on-remove="(file,fileList)=>{removeHandler (file,fileList,'recordOfPenaltyCharges')}" :action="fileUpload" :data="{prefix:''}" :format="['jpg','jpeg','png','gif','pdf','zip']" :show-upload-list="false" :disabled="!isEditor" type="drag" style="width:300px">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.recordOfPenaltyCharges==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.recordOfPenaltyCharges!=''">
                    <a :href="tranferAgentInfo.recordOfPenaltyCharges" target="_blank">罚款记录和交罚款证明</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','recordOfPenaltyCharges')" />
                  </div>
                </FormItem>
                <Divider />
                <p>阿联酋税局账号和密码（选填）</p>
                <FormItem label="税局账号：" style="margin-top:18px">
                  <Input v-model="tranferAgentInfo.gatewayId" :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="密码：">
                  <Input v-model="tranferAgentInfo.gatewayPassword" :disabled="!isEditor"></Input>
                </FormItem>
              </div>
              <!-- <div v-if="detailInfo.countryNameZh=='波兰'">
                <FormItem label="社会统一信用代码："
                          prop="companyCreditCode"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyCreditCode"
                         placeholder="工商统一信用代码"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="法人英文名："
                          prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn"
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
                <FormItem label="法人身份证/护照号码："
                          prop="companyLegalPersonCard">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人出生地："
                          prop="companyLegalPersonBirthplace">
                  <Input v-model="tranferAgentInfo.companyLegalPersonBirthplace"
                         style="width:220px;"
                         :disabled="!isEditor" />
                </FormItem>
                <FormItem label="法人身份证英文地址："
                          class="requiredItem">
                  <Input :disabled="!isEditor"
                         placeholder="请输入法人身份证英文地址"
                         v-model="tranferAgentInfo.companyLegalPersonCardAddress"
                         style="width:300px;" />
                </FormItem>
                <FormItem label="未来12个月预计销售额（欧元）："
                          prop="shopSalePlan">
                  <Input v-model="tranferAgentInfo.shopSalePlan"
                         placeholder=" 请输入未来12个月预计销售额"
                         :disabled="!isEditor">
                  </Input>
                </FormItem>
                <FormItem label="是否有其它国家VAT号："
                          prop="shopOtherEuTaxNumber"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.shopOtherEuTaxNumber"
                         placeholder=" 如没有，请填写无"
                         :disabled="!isEditor"></Input>
                </FormItem>
                <FormItem label="描述下公司的经营内容："
                          prop="companyBusinessModeDescribe"
                          class="requiredItem">
                  <Input v-model="tranferAgentInfo.companyBusinessModeDescribe"
                         placeholder="请输入英文描述，如服装 clothing"
                         :disabled="!isEditor"></Input>
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
                <FormItem label="历史申报回执：">
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
                </FormItem>
              </div> -->
              <!-- 波兰提交资料 -->
              <div v-if="detailInfo.countryNameZh=='波兰'">
                <div class="companyInfo">公司信息
                  <FormItem label="公司类型：" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="tranferAgentInfo.companyType">
                      <Radio :disabled="!isEditor" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isEditor" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.companyType == '1'" prop="companyBusinessLicense" label="公司营业执照：" class="requiredItem">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" style="width:300px" :disabled='!isEditor' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyBusinessLicense">
                      <div class="fileBox" v-if="tranferAgentInfo.companyBusinessLicense!=''">
                        <a target="_blank" @click="previewFile(tranferAgentInfo.companyBusinessLicense)">
                          {{"营业执照"}}
                          <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.companyType == '2'" prop="companyBusinessRegistrationBr" label="商业登记证BR扫描件：" class="requiredItem">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                        <a @click="previewFile(tranferAgentInfo.companyBusinessRegistrationBr)">
                          {{"商业登记证BR扫描件"}}
                          <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.companyType == '2'" prop="companyRegistrationCi" label="公司注册证明书CI扫描件：" class="requiredItem">
                    <Upload ref="CIFILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyRegistrationCi">
                      <div class="fileBox" v-if="tranferAgentInfo.companyRegistrationCi!=''">
                        <a target="_blank" @click="previewFile(tranferAgentInfo.companyRegistrationCi)">
                          {{"公司注册证明书CI扫描件"}}
                          <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.companyType == '2'" prop="companyCorporateFoundingNnc1" label="法团成立表格NNC1扫描件：" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1">
                        <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.companyCorporateFoundingNnc1)">
                            {{"法团成立表格NNC1扫描件"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="公司中文名称：" class="requiredItem">
                    <AutoComplete v-model="tranferAgentInfo.companyNameZh" :data="lenovoSearchList" :disabled="!isEditor" @on-select="selectCompany" style="width:300px;" placeholder="请输入公司中文名称">
                    </AutoComplete>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem">
                    <Input :disabled="!isEditor" placeholder="请输入公司英文名称" v-model="tranferAgentInfo.companyNameEn" style="width: 300px" />
                  </FormItem>
                  <FormItem label="社会统一信用代码：" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyCreditCode" placeholder=" 请输入营业执照的信用代码" style="width: 300px" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="公司联系邮编：" class="requiredItem">
                    <Input :disabled="!isEditor" placeholder="请输入公司联系邮编" v-model="tranferAgentInfo.companyPostCode" style="width: 300px" />
                  </FormItem>
                  <FormItem label="公司成立时间：" class="requiredItem">
                    <DatePicker :disabled="!isEditor" type="date" placeholder="请选择公司成立时间" style="width: 300px" :value="tranferAgentInfo.companyRegisterData" v-model="tranferAgentInfo.companyRegisterData"></DatePicker>
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyAddressEnCountry" :disabled="!isEditor" placeholder="如:China" style="width:148px;margin-right:6px" />
                    <Input v-model="tranferAgentInfo.companyAddressEnCity" :disabled="!isEditor" placeholder="如：ShenZhen" style="width:148px;" /><br />
                    <Input v-model="tranferAgentInfo.companyAddressEn" :disabled="!isEditor" placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替" style="width: 300px" type="textarea" />
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" prop="certificateType" class="requiredItem">
                    <RadioGroup v-model="tranferAgentInfo.certificateType">
                      <Radio :disabled="!isEditor" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isEditor" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.certificateType === '1'" prop="companyLegalPersonCardFront" label="法人身份证正面扫描件" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.companyLegalPersonCardFront">
                        <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.companyLegalPersonCardFront)">
                            {{"法人身份证正面扫描件"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.certificateType === '1'" prop="companyLegalPersonCardReverse" label="法人身份证反面扫描件" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardReverse')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.companyLegalPersonCardReverse">
                        <div v-if="tranferAgentInfo.companyLegalPersonCardReverse!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.companyLegalPersonCardReverse)">
                            {{"法人身份证反面扫描件"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardReverse')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem v-if="tranferAgentInfo.certificateType === '2'" prop="companyLegalPersonCardPassport" label="法人护照扫描件" class="requiredItem">
                    <Upload ref="passportFILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.companyLegalPersonCardPassport">
                        <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.companyLegalPersonCardPassport)">
                            {{"法人护照扫描件"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人身份证号码：" v-if="tranferAgentInfo.certificateType === '1'">
                    <Input :disabled="!isEditor" placeholder="请输入法人身份证号码" v-model="tranferAgentInfo.companyLegalPersonCard" style="width: 300px" /> (个人店铺必填)
                  </FormItem>
                  <FormItem label="法人护照号码：" v-if="tranferAgentInfo.certificateType === '2'">
                    <Input :disabled="!isEditor" placeholder="请输入法人护照" v-model="tranferAgentInfo.legalPersonCardPassportNumber" style="width: 300px" /> (个人店铺必填)
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem">
                    <Input :disabled="!isEditor" placeholder="请输入法人中文姓名" v-model="tranferAgentInfo.companyLegalPersonZh" style="width:300px;" />
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem">
                    <Input :disabled="!isEditor" placeholder="请输入法人英文姓名" v-model="tranferAgentInfo.companyLegalPersonEn" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem">
                    <DatePicker :disabled="!isEditor" v-model="tranferAgentInfo.companyLegalPersonBirthday" type="date" placeholder="请选择法人出生日期" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem label="法人联系邮箱：" class="requiredItem" v-if="detailInfo.countryNameZh=='英国' || detailInfo.countryNameZh=='德国'">
                    <Input :disabled="!isEditor" placeholder="请输入法人联系邮箱" v-model="tranferAgentInfo.companyLegalPersonEmail" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人出生地：" class="requiredItem">
                    <Input :disabled="!isEditor" placeholder="请输入法人出生地" v-model="tranferAgentInfo.companyLegalPersonBirthplace" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" prop="companyLegalPersonCardAddressZh" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddressZh" placeholder="请输入法人身份证中文地址" style="width: 300px" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddress" placeholder="请输入法人身份证英文地址" style="width: 300px" :disabled="!isEditor"></Input>
                  </FormItem>

                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="tranferAgentInfo.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isEditor">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isEditor">eBay</Radio>
                      <Radio label="其它" :disabled="!isEditor">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input v-model="tranferAgentInfo.shopHref" style="width: 300px" placeholder=" 请输入店铺后台链接" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem">
                    <DatePicker :disabled="!isEditor" type="date" placeholder="请选择税号生效日期" style="width: 300px" :value="tranferAgentInfo.taxEffectiveDate" v-model="tranferAgentInfo.taxEffectiveDate"></DatePicker>
                  </FormItem>
                  <FormItem label="预计未来12个月销售额：" class="requiredItem" prop="shopSalePlan">
                    <Input v-model="tranferAgentInfo.shopSalePlan" placeholder="请输入完整的销售额" style="width: 300px" :disabled="!isEditor">
                    <span slot="append">欧元（EUR）</span>
                    </Input>
                    <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注： 请输入完整的销售额，如10W，则输入100000；</p>
                  </FormItem>
                  <FormItem label="是否有其它欧盟国VAT:" prop="isOtherGulfStateDutyOrServices" class="requiredItem requiredItem" v-if="tranferAgentInfo.isThereShop=='1'">
                    <RadioGroup v-model="tranferAgentInfo.isOtherGulfStateDutyOrServices">
                      <Radio label="1" :disabled="!isEditor">是</Radio>
                      <Radio label="2" :disabled="!isEditor">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="是否有其它欧盟国VAT:" prop="isOtherGulfStateDutyOrServices" class="requiredItem requiredItem">
                    <RadioGroup v-model="tranferAgentInfo.isOtherGulfStateDutyOrServices">
                      <Radio label="1" :disabled="!isEditor">是</Radio>
                      <Radio label="2" :disabled="!isEditor">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="VAT增值税号：" class="requiredItem" prop="shopOtherEuTaxNumber">
                    <Input v-model="tranferAgentInfo.shopOtherEuTaxNumber" style="width: 300px" placeholder="请填写相对应国家的税号" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="是否有欧盟国EORI号:" prop="isThereEoriNumber" class="requiredItem requiredItem">
                    <RadioGroup v-model="tranferAgentInfo.isThereEoriNumber">
                      <Radio label="1" :disabled="!isEditor">是</Radio>
                      <Radio label="2" :disabled="!isEditor">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="欧盟国EORI号：" class="requiredItem" prop="eoriNumber">
                    <Input v-model="tranferAgentInfo.eoriNumber" placeholder="请填写欧盟国EORI号" style="width: 300px" :disabled="!isEditor"></Input>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem">
                    <Input type="textarea" :disabled="!isEditor" placeholder="请输入经营内容" v-model="tranferAgentInfo.companyBusinessModeDescribe" style="width: 300px" />
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图：" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.shopConsoleScreenshot">
                        <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.shopConsoleScreenshot)">
                            {{"后台店铺截图"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="vatCertificate" label="意大利或法国VAT证书：" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.vatCertificate">
                        <div v-if="tranferAgentInfo.vatCertificate!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.vatCertificate)">
                            {{"意大利或法国VAT证书"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatCertificate')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>银行信息</span>
                  </p>
                  <div class="item-content">
                    <FormItem label="银行账户名称：" class="requiredItem" prop="bankAccountName">
                      <Input v-model="tranferAgentInfo.bankAccountName" style="width: 300px" placeholder="请输入银行账户名称" :disabled="!isEditor"></Input>
                    </FormItem>
                    <FormItem label="IBAN/银行账户：" class="requiredItem" prop="bankAccount">
                      <Input v-model="tranferAgentInfo.bankAccount" placeholder="请输入IBAN/银行账户" style="width: 300px" :disabled="!isEditor"></Input>
                    </FormItem>
                    <FormItem label="银行英文名称：" class="requiredItem" prop="bankName">
                      <Input v-model="tranferAgentInfo.bankName" placeholder="请输入银行英文名称" style="width: 300px" :disabled="!isEditor"></Input>
                    </FormItem>
                    <FormItem label="开户国家：" class="requiredItem" prop="bankAccountCountryEn">
                      <Input v-model="tranferAgentInfo.bankAccountCountryEn" placeholder="请输入开户国家" style="width: 300px" :disabled="!isEditor"></Input>
                    </FormItem>
                    <FormItem label="Swift / BIC：" class="requiredItem" prop="swiftBic">
                      <Input v-model="tranferAgentInfo.swiftBic" placeholder="请输入Swift / BIC" style="width: 300px" :disabled="!isEditor"></Input>
                    </FormItem>
                  </div>
                </div>
              </div>
              <!-- 荷兰提交资料 -->
              <div v-if="detailInfo.countryNameZh=='荷兰'">
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>

                <FormItem label="法人身份证号码：" prop="companyLegalPersonCard">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upBeginTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate">
                  <DatePicker type="date" placeholder="请选择税号生效日期" style="width:200px" v-model="tranferAgentInfo.taxEffectiveDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="公司成立日期：" class="requiredItem">
                  <DatePicker @on-change="changeLegalBirthDate" :disabled="!isEditor" :value="tranferAgentInfo.companyRegisterData" v-model="tranferAgentInfo.companyRegisterData" type="date" placeholder="请选择公司成立日期" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="公司邮箱：" prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号文件：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="营业执照：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="法人身份证正反面：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">法人身份证正反面</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
              </div>
              <!-- 奥地利提交资料 -->
              <div v-if="detailInfo.countryNameZh=='奥地利'">
                <FormItem label="法人英文名：" prop="companyLegalPersonEn">
                  <Input v-model="tranferAgentInfo.companyLegalPersonEn" style="width:220px;" :disabled="!isEditor" />
                </FormItem>

                <FormItem label="法人身份证号码：" prop="companyLegalPersonCard">
                  <Input v-model="tranferAgentInfo.companyLegalPersonCard" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="店铺链接：" prop="shopHref">
                  <Input v-model="tranferAgentInfo.shopHref" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="上一次申报区间：" prop="upBeginTime">
                  <DatePicker type="month" @on-change="dateChangeBefore($event,0)" placeholder="请选择上一次申报开始时间" style="width:200px" v-model="tranferAgentInfo.upBeginTime" :disabled="!isEditor"></DatePicker>
                  <DatePicker type="month" @on-change="dateChangeBefore($event,1)" placeholder="请选择上一次申报结束时间" style="width:200px" v-model="tranferAgentInfo.upEndTime" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="税号生效日期：" prop="taxEffectiveDate">
                  <DatePicker type="date" placeholder="请选择税号生效日期" style="width:200px" v-model="tranferAgentInfo.taxEffectiveDate" :disabled="!isEditor"></DatePicker>
                </FormItem>
                <FormItem label="公司成立日期：" class="requiredItem">
                  <DatePicker @on-change="changeLegalBirthDate" :disabled="!isEditor" :value="tranferAgentInfo.companyRegisterData" v-model="tranferAgentInfo.companyRegisterData" type="date" placeholder="请选择公司成立日期" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="公司邮箱：" prop="companyEmail">
                  <Input v-model="tranferAgentInfo.companyEmail" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="公司电话：" prop="companyTel">
                  <Input v-model="tranferAgentInfo.companyTel" style="width:220px;" :disabled="!isEditor" />
                </FormItem>
                <FormItem label="税号文件：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                    <a :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                  </div>
                </FormItem>
                <FormItem label="历史申报回执：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                    <a :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                  </div>
                </FormItem>
                <FormItem label="营业执照：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                    <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                  </div>
                </FormItem>
                <FormItem label="法人身份证正反面：">
                  <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                      <span v-else>点击或拖拽文件到此区域重新上传</span>
                    </div>
                  </Upload>
                  <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                    <a :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">法人身份证正反面</a>
                    <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                  </div>
                </FormItem>
              </div>
              <!-- 捷克提交资料 -->
              <div v-if="detailInfo.countryNameZh=='捷克'">
                <div class="companyInfo">公司信息
                  <FormItem label="公司类型" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="tranferAgentInfo.companyType">
                      <Radio :label="'1'">大陆公司</Radio>
                      <Radio :label="'2'">香港公司</Radio>
                      <Radio :label="'3'">境外公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="营业执照扫描件/照片：" class="requiredItem" prop="companyBusinessLicense" v-if="tranferAgentInfo.companyType==1">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyBusinessLicense==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyBusinessLicense!=''">
                      <a :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
                      <Icon v-if="!isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                    </div>
                  </FormItem>
                  <FormItem label="商业登记证/海外证书：" class="requiredItem" prop="companyBusinessLicenseCopy" v-if="tranferAgentInfo.companyType==3">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicenseCopy')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicenseCopy')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyBusinessLicenseCopy==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyBusinessLicenseCopy!=''">
                      <a :href="tranferAgentInfo.companyBusinessLicenseCopy" target="_blank">商业登记证/海外证书</a>
                      <Icon v-if="!isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicenseCopy')" />
                    </div>
                  </FormItem>
                  <FormItem label="商业登记证BR：" class="requiredItem" prop="companyBusinessRegistrationBr" v-if="tranferAgentInfo.companyType==2">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyBusinessRegistrationBr==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyBusinessRegistrationBr!=''">
                      <a :href="tranferAgentInfo.companyBusinessRegistrationBr" target="_blank">商业登记证BR</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                    </div>
                  </FormItem>
                  <FormItem label="公司注册证明书CI：" class="requiredItem" prop="companyRegistrationCi" v-if="tranferAgentInfo.companyType==2">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyRegistrationCi==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyRegistrationCi!=''">
                      <a :href="tranferAgentInfo.companyRegistrationCi" target="_blank">公司注册证明书CI</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
                    </div>
                  </FormItem>
                  <FormItem label="法团成立表格NNC1：" class="requiredItem" prop="companyCorporateFoundingNnc1" v-if="tranferAgentInfo.companyType==2">
                    <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="tranferAgentInfo.companyCorporateFoundingNnc1==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="tranferAgentInfo.companyCorporateFoundingNnc1!=''">
                      <a :href="tranferAgentInfo.companyCorporateFoundingNnc1" target="_blank">法团成立表格NNC1</a>
                      <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                    </div>
                  </FormItem>
                  <FormItem label="统一信用代码：" class="requiredItem" prop="companyCreditCode">
                    <Input placeholder="请输入统一信用代码" v-model="tranferAgentInfo.companyCreditCode" style="width: 300px" />
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：">
                    <RadioGroup v-model="tranferAgentInfo.certificateType">
                      <Radio :label="'1'">身份证</Radio>
                      <Radio :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <Row v-if="tranferAgentInfo.certificateType === '1'">
                    <FormItem label="法人身份证正面扫描件：" class="requiredItem" prop="companyLegalPersonCardFront">
                      <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="tranferAgentInfo.companyLegalPersonCardFront==''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="tranferAgentInfo.companyLegalPersonCardFront!=''">
                        <a :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">{{'法人身份证正面扫描件'}}</a>
                        <Icon type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')" />
                      </div>
                    </FormItem>
                  </Row>
                  <Row v-if="tranferAgentInfo.certificateType === '1'">
                    <FormItem label="法人身份证反面扫描件：" class="requiredItem" prop="companyLegalPersonCardReverse">
                      <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardReverse')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="tranferAgentInfo.companyLegalPersonCardReverse==''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="tranferAgentInfo.companyLegalPersonCardReverse!=''">
                        <a :href="tranferAgentInfo.companyLegalPersonCardReverse" target="_blank">{{'法人身份证反面扫描件'}}</a>
                        <Icon type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardReverse')" />
                      </div>
                    </FormItem>
                  </Row>
                  <Row v-if="tranferAgentInfo.certificateType === '2'">
                    <FormItem label="护照：" class="requiredItem" prop="companyLegalPersonCardPassport">
                      <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="tranferAgentInfo.companyLegalPersonCardPassport==''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="tranferAgentInfo.companyLegalPersonCardPassport!=''">
                        <a :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">{{'护照'}}</a>
                        <Icon type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')" />
                      </div>
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem label="税号文件：" class="requiredItem" prop="vatTaxNumberFile">
                      <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatTaxNumberFile')}" :format="['jpg','jpeg','png','gif','pdf','zip']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="tranferAgentInfo.vatTaxNumberFile==''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="tranferAgentInfo.vatTaxNumberFile!=''">
                        <a :href="tranferAgentInfo.vatTaxNumberFile.includes('http') > 0 ? tranferAgentInfo.vatTaxNumberFile.replace('http://','https://') : ''" target="_blank">{{'税号文件'}}</a>
                        <Icon type="ios-close-circle" @click.stop="removeHandler('','','vatTaxNumberFile')" />
                      </div>
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem label="申报回执：" class="requiredItem" prop="lastDeclareReceipt">
                      <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'lastDeclareReceipt')}" :format="['jpg','jpeg','png','gif','pdf','zip']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="tranferAgentInfo.lastDeclareReceipt==''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="tranferAgentInfo.lastDeclareReceipt!=''">
                        <a :href="tranferAgentInfo.lastDeclareReceipt.includes('http') > 0 ? tranferAgentInfo.lastDeclareReceipt.replace('http://','https://') : ''" target="_blank">{{'申报回执'}}</a>
                        <Icon type="ios-close-circle" @click.stop="removeHandler('','','lastDeclareReceipt')" />
                      </div>
                    </FormItem>
                  </Row>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input placeholder="请输入法人英文姓名" v-model="tranferAgentInfo.companyLegalPersonEn" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input placeholder="请输入法人中文姓名" v-model="tranferAgentInfo.companyLegalPersonZh" style="width:300px;" />
                  </FormItem>
                  <FormItem label="法人身份证号码：" class="requiredItem" v-if="tranferAgentInfo.certificateType === '1'" prop="companyLegalPersonCard">
                    <Input placeholder="请输入身份证号码" v-model="tranferAgentInfo.companyLegalPersonCard" style="width: 300px" /> (个人店铺必填)
                  </FormItem>
                  <FormItem label="法人护照号码：" class="requiredItem" v-if="tranferAgentInfo.certificateType === '2'" prop="legalPersonCardPassportNumber">
                    <Input placeholder="请填护照号码" v-model="tranferAgentInfo.legalPersonCardPassportNumber" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker v-model="tranferAgentInfo.companyLegalPersonBirthday" type="date" placeholder="请选择法人出生日期" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input placeholder="请输入身份证英文地址" v-model="tranferAgentInfo.companyLegalPersonCardAddress" style="width: 300px" />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" prop="companyLegalPersonCardAddressZh" class="requiredItem">
                    <Input v-model="tranferAgentInfo.companyLegalPersonCardAddressZh" placeholder="请输入法人身份证中文地址" style="width: 300px"></Input>
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <FormItem label="法人签名：" prop="companyLegalPersonSign">
                      <div class="legalPersonSign">
                        <img v-if="tranferAgentInfo.companyLegalPersonSign !== '' && tranferAgentInfo.companyLegalPersonSign !== undefined" :src="tranferAgentInfo.companyLegalPersonSign" alt="">
                      </div>
                    </FormItem>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="tranferAgentInfo.shopSalePlatformName">
                      <Radio label="亚马逊">亚马逊</Radio>
                      <Radio label="eBay">eBay</Radio>
                      <Radio label="其它">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺链接：" prop="shopHref" class="requiredItem">
                    <Input v-model="tranferAgentInfo.shopHref" style="width: 300px" placeholder=" 请输入店铺链接"></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input placeholder="请输入公司英文名称" v-model="tranferAgentInfo.companyNameEn" style="width: 300px" />

                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input placeholder="请复制店铺后台的邮编号码" v-model="tranferAgentInfo.companyPostCode" style="width: 300px" />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input v-model="tranferAgentInfo.companyAddressEnCountry" placeholder="如:China" style="width:148px;margin-right:6px;margin-bottom:10px;" />
                    <Input v-model="tranferAgentInfo.companyAddressEnCity" placeholder="如：ShenZhen" style="width:148px;margin-bottom:10px;" /><br />
                    <Input v-model="tranferAgentInfo.companyAddressEn" placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替" style="width: 300px" type="textarea" />
                  </FormItem>
                  <FormItem :prop="tranferAgentInfo.shopSalePlatformName != '亚马逊' ? 'shopConsoleScreenshot' :''" :class="{'requiredItem':tranferAgentInfo.shopSalePlatformName != '亚马逊'}" label="后台店铺截图">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.shopConsoleScreenshot">
                        <div v-if="tranferAgentInfo.shopConsoleScreenshot!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.shopConsoleScreenshot)">
                            {{"后台店铺截图"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>银行信息</span>
                  </p>
                  <FormItem label="账号名称：" class="requiredItem" prop="bankAccountName">
                    <Input :disabled="!isEditor" placeholder="请输入开户公司名称" v-model="tranferAgentInfo.bankAccountName" style="width:300px;" />
                  </FormItem>
                  <FormItem label="银行英文名称：" class="requiredItem" prop="bankName">
                    <Input :disabled="!isEditor" placeholder="请输入开户银行名称" v-model="tranferAgentInfo.bankName" style="width: 300px" />
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" class="requiredItem" prop="bankAccount">
                    <Input :disabled="!isEditor" placeholder="请输入开户银行账户号码" v-model="tranferAgentInfo.bankAccount" style="width: 300px" />
                  </FormItem>
                  <FormItem label="银行BIC：" class="requiredItem" prop="swiftBic">
                    <Input :disabled="!isEditor" placeholder="请输入银行BIC" v-model="tranferAgentInfo.swiftBic" style="width: 300px" />
                  </FormItem>
                  <FormItem label="银行英文地址：" class="requiredItem" prop="bankAddressEn">
                    <Input v-model="tranferAgentInfo.bankCountryEn" :disabled="!isEditor" placeholder="如:China" style="width:148px;margin-right:6px;margin-bottom:10px;" />
                    <Input v-model="tranferAgentInfo.bankCityEn" :disabled="!isEditor" placeholder="如：ShenZhen" style="width:148px;margin-bottom:10px;" /><br />
                    <Input v-model="tranferAgentInfo.bankAddressEn" :disabled="!isEditor" placeholder="请请输入银行详细英文地址" style="width: 300px" type="textarea" />
                  </FormItem>
                  <FormItem label="账户主体地址：" class="requiredItem" prop="bankAccountAddressEn">
                    <Input v-model="tranferAgentInfo.bankAccountAddressEn" :disabled="!isEditor" placeholder="请输入开户公司的英文地址" style="width: 300px" type="textarea" />
                  </FormItem>
                  <FormItem prop="bankAccountCertify" label="银行账户证明" class="requiredItem">
                    <Upload ref="NNC1FILE" type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bankAccountCertify')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'bankAccountCertify')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px" :disabled='!isEditor' :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="tranferAgentInfo.bankAccountCertify!=''">
                        <div v-if="tranferAgentInfo.bankAccountCertify!=''">
                          <a target="_blank" @click="previewFile(tranferAgentInfo.bankAccountCertify)">
                            {{"银行账户证明"}}
                            <Icon v-if="isEditor" type="ios-close-circle" @click.stop="removeHandler('','','bankAccountCertify')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </div>
              </div>
              <FormItem label="法人签名：" v-if="((detailInfo.countryCode === 'IT' && detailInfo.supplierId == 50 ) || detailInfo.countryCode === 'GB' || detailInfo.countryCode === 'DE'|| detailInfo.countryCode === 'ES'|| detailInfo.countryCode === 'PL'|| detailInfo.countryCode === 'NL')" prop="companyLegalPersonSign">
                <div class="legalPersonSign">
                  <img v-if="tranferAgentInfo.companyLegalPersonSign !== '' && tranferAgentInfo.companyLegalPersonSign !== undefined" :src="tranferAgentInfo.companyLegalPersonSign" alt="">
                </div>
              </FormItem>
              <FormItem>
                <Button v-if="detailInfo.progressBar==28" :loading="saveLosding" @click="saveForm" style="margin-right:15px;">保存</Button>
                <Button v-if="detailInfo.progressBar==32 || detailInfo.progressBar==28 || detailInfo.progressBar==31" type="primary" :loading="submitLoading" @click="clickSubmit">提交</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
        <Card style="margin-top:10px;" v-if="detailInfo.countryCode === 'DE'&&!isService">
          <p slot="title">年度申报</p>
          <Table :loading="deYearLoading" :columns="deYearColumns" :data="deYearData">
            <template slot="operation" slot-scope="{row}">
              <div>
                <span v-if="row.status==21" style="cursor:pointer;" @click="goAnnalsDE(row)">【提交申报】</span>
                <span v-if="row.status==27&&row.declareReceipt!=''">
                  <a :href="row.declareReceipt" target="_blank">【查看回执】</a>
                </span>
                <span @click="getDEyearDetailFun(row)" style="cursor:pointer;">【详情】</span>
              </div>
            </template>
          </Table>
        </Card>
        <Card style="margin-top:10px;">
          <p slot="title">历史申报记录</p>
          <Table :loading="tableLoading" :columns="columns" :data="tableData">
            <template slot="lookData" slot-scope="{row}">
              <div>
                <span style="cursor:pointer;color:#2D8cF0;" @click="taxModal=true;taxBaseData=row">点击查看</span>
              </div>
            </template>
            <template slot="operate" slot-scope="{ row }">
              <div v-if="row.taxCertificate.length !== 0 ">
                <a style="display:block;" v-for="(item, index) in row.taxCertificate" :key="index" :href="item" target="_blank">缴税凭证</a>
              </div>
              <div v-if="row.countryCode == 'SA' && row.status === 18" style="cursor: pointer;" @click="entryInvoice(row)">【录入发票号】</div>
              <div v-if="row.countryCode == 'AE' && row.status === 18" style="cursor: pointer;" @click="entryGIBAN(row)">【录入GIBAN】</div>
              <div style="cursor: pointer;" v-if="row.countryCode === 'GB' && row.status === 21" @click="goToDeclare(row)">【去报税】</div>
              <div style="cursor: pointer;color: rgb(45, 140, 240);4" v-if="row.countryCode === 'GB' && row.status > 21" @click="getLink(row)">英国申报回执</div>
              <!-- <a style="cursor: pointer;color: rgb(45, 140, 240);4"
                 v-if="row.countryCode !== 'GB' && row.status > 21 && row.declareReceipt !==''"
                 :href="row.declareReceipt"
                 target="_blank">查看回执</a> -->
              <p v-for="(v,i) in row.declareReceipt.split(';')" :key="i">
                <a :href="v" v-if="row.countryCode !== 'GB' && row.status > 21 && row.declareReceipt !==''" target="_blank">查看回执</a>
              </p>
              <div @click="seeReceipt($event, row.id)" style="cursor: pointer;" v-if="row.declareReceipt === '' && row.countryCode === 'IT'&& row.declareRule === 2 && row.status > 21">
                【查看回执】
              </div>
              <div @click="downLoad($event, row)" style="cursor: pointer;" v-if="row.countryCode === 'ES' && (row.status === 22 || row.status === 25 ||row.status === 27)">
                【下载申报资料】
              </div>
              <div style="cursor: pointer;" @click="caculateTax(row)" v-if="row.status === 21 && row.countryCode !== 'GB'">【去报税】</div>
              <div style="cursor: pointer;" @click="taxFileRecordModal(row)" v-if="(row.status === 22 || row.status === 34 || row.status === 35) ">【上传缴税凭证】</div>
              <div style="cursor: pointer;" @click="uploadReceiptModalFun(row)" v-if="(row.status === 27 || row.status === 25) && (row.countryCode !== 'GB' && row.countryCode !== 'DE')">【上传回执】</div>
              <div style="cursor: pointer;" @click="auditFun(row)" v-if="row.status === 33">【审核】</div>
              <div style="cursor: pointer;" @click="lookReason(1,row)" v-if="row.declarationStatus === 3">【重新提交】</div>
              <div style="cursor: pointer;" @click="lookReason(2,row)" v-if="row.declarationStatus === 2">【查看原因】</div>
              <div style="cursor: pointer;" v-if="(row.status === 24) && (row.countryCode === 'AT' || row.countryCode === 'CZ')" @click="resubmissionDeclaration(row)">【提交申报】</div>
              <div style="cursor: pointer;" v-if="(row.status === 23 ) && (row.countryCode === 'AT' || row.countryCode === 'CZ')" @click="auditDeclareModalFun(row)">【审核申报】</div>
              <div style="cursor: pointer;" v-show="hasAuthority('work_order_list14')" v-if="row.status == 18 || row.status == 22 || (row.status == 25 && row.countryCode!='GB' && row.countryCode!='DE')" @click="toUpdateStatus(row)">【更改状态】</div>
            </template>
            <template slot="declareRule" slot-scope="{ row }">
              <span>{{row.declareRule == '0' ? '目的国' : row.declareRule == '1' ? '发出国' : row.declareRule == '2' ? '零申报' : ''}}</span>
            </template>
            <template slot="status" slot-scope="{ row }">
              <span>{{row.status==0?'待上传资料':row.status==1?'待审核资料':row.status==2?'待续费':row.status==3?'注册中':row.status==4?'注册完成':row.status==5?'待授权海牙认证':row.status==6?'海牙认证中':row.status==7?'待授权注册':row.status==8?'资料驳回':row.status==19?'等待申报中':row.status==20?'等待申报中':row.status==21?'待提交报税资料':row.status==23?'待审核申报':row.status==24?'申报驳回':row.status==18?'申报中':row.status==22?'待缴纳税金':row.status==25?'申报完成':row.status==27?'申报完成':row.status==26?'申报失败':row.status==28?'待上传资料':row.status==29?'转代理中':row.status==31?'待审核转代理资料':row.status==32?'转代理资料驳回':row.status==33?'税金待审核':row.status==34?'缴税凭证被驳回':row.status==35?'待上传零申报凭证':row.status==36?'待授权海牙认证':row.status==37?'海牙认证中':row.status==38?'待授权转代理':row.status==51?'待上传资料':row.status==52?'待审核':row.status==53?'注销中':row.status==54?'已完成':row.status==55?'资料驳回':row.status==56?'注销失败':'暂无'}}</span>
            </template>
          </Table>
        </Card>
      </div>
      <div class="content-r">
        <Card>
          <p slot="title">税号信息</p>
          <Form :label-width=100 v-if="detailInfo.progressBar >19 && detailInfo.progressBar < 28">
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
            <FormItem label="本地税号文件：" v-if="detailInfo.countryCode === 'DE'">
              <span v-if="tranferAgentInfo.vatTaxLocalFile!==''">
                <a :href="tranferAgentInfo.vatTaxLocalFile" target="_blank">{{"本地税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="欧盟税号文件：" v-if="detailInfo.countryCode === 'DE'">
              <span v-if="tranferAgentInfo.vatTaxEuFile!==''">
                <a :href="tranferAgentInfo.vatTaxEuFile" target="_blank">{{"欧盟税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="税务副本：" v-if="detailInfo.countryCode === 'DE'">
              <span v-if="detailInfo.vatTaxNumberCopyFile!==''">
                <a :href="detailInfo.vatTaxNumberCopyFile" target="_blank">{{"税务副本"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>

            <!-- 德国 end-->
            <FormItem label="VAT税号文件：" v-if="detailInfo.countryCode !== 'DE'">
              <span v-if="detailInfo.vatTaxNumberFile!==''">
                <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{"VAT税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="EORI文件：" v-if="detailInfo.countryCode !== 'GB'">
              <span v-if="detailInfo.eoriNumberFile!==''">
                <a :href="detailInfo.eoriNumberFile" target="_blank">{{"EORI文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="VAT证书：" v-if="detailInfo.countryCode !== 'DE'">
              <span v-if="detailInfo.vatCertificate!==''">
                <a :href="detailInfo.vatCertificate" target="_blank">{{"VAT证书"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="gateway 账号：" v-if="detailInfo.countryCode=='GB'">
              <span>{{detailInfo.gatewayId ? detailInfo.gatewayId :''}}</span>
            </FormItem>
            <FormItem label="gateway 密码：" v-if="detailInfo.countryCode=='GB'">
              <span>{{detailInfo.gatewayPassword ? detailInfo.gatewayPassword : '暂无'}}</span>
            </FormItem>
            <FormItem label="欧盟税号证书：" v-if="detailInfo.countryCode=='ES'">
              <span v-if="detailInfo.deEuCertificate!==''">
                <a :href="detailInfo.deEuCertificate" target="_blank">{{"欧盟税号证书"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="海牙文件：" v-if="detailInfo.countryCode=='ES'">
              <span v-if="detailInfo.hyFile!==''">
                <a :href="detailInfo.hyFile" target="_blank">{{"海牙文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="前税代终止授权书：" v-if="detailInfo.countryCode=='FR'">
              <a class="wrap" v-if="formerAgentTerminationAuthorizationLetter" :href="formerAgentTerminationAuthorizationLetter" target="_blank">前税代终止授权书</a>
            </FormItem>
            <!-- <FormItem label="VAT税号证书（新）：" v-if="detailInfo.countryCode=='IT'">
                            <span v-if="detailInfo.vatCertificateNew!==''"><a :href="detailInfo.vatCertificateNew" target="_blank">{{"VAT税号证书（新）"}}</a></span>
                            <span v-else>{{'暂无'}}</span>
                        </FormItem> -->
          </Form>
          <Form :label-width=100 v-else>
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
            <FormItem label='转代理授权书：' v-if="detailInfo.countryCode=='IT'">
              <span v-if="tranferAgentInfo.registrationAuthorization==''">{{"暂无"}}</span>
              <a :href="tranferAgentInfo.registrationAuthorization" target="_blank" v-if="tranferAgentInfo.registrationAuthorization!==''">{{"注册授权书"}}</a>
            </FormItem>
            <!-- 法国服务转代理授权书 -->
              <div v-if="detailInfo.countryCode=='FR'">
                  <!-- eco显示2个授权书-->
                  <div v-if="tranferAgentInfo.supplierId == 61">
                    <FormItem label='代表授权书ECO TAX：'>
                      <span v-if="tranferAgentInfo.registrationAuthorization==''">{{"暂无"}}</span>
                      <a :href="tranferAgentInfo.registrationAuthorization" target="_blank" v-if="tranferAgentInfo.registrationAuthorization!==''">{{"代表授权书ECO TAX"}}</a>
                    </FormItem>
                    <FormItem label='欧洲公司授权税务代理书：'>
                      <span v-if="tranferAgentInfo.registrationAuthorization1==''">{{"暂无"}}</span>
                      <a :href="tranferAgentInfo.registrationAuthorization1" target="_blank" v-if="tranferAgentInfo.registrationAuthorization1!==''">{{"欧洲公司授权税务代理书"}}</a>
                    </FormItem>
                  </div>
                  <!-- 陈氏的转代理显示 授权书 + 前税代终止授权书 -->
                  <div v-else-if="tranferAgentInfo.supplierId==42">
                    <FormItem label='授权书：'>
                        <span v-if="tranferAgentInfo.registrationAuthorization==''">{{"暂无"}}</span>
                        <a :href="tranferAgentInfo.registrationAuthorization" target="_blank" v-if="tranferAgentInfo.registrationAuthorization!==''">{{"授权书"}}</a>
                    </FormItem>
                    <FormItem label="前税代终止授权书：" v-if="detailInfo.countryCode=='FR'">
                        <a class="wrap" v-if="formerAgentTerminationAuthorizationLetter" :href="formerAgentTerminationAuthorizationLetter" target="_blank">前税代终止授权书</a>
                    </FormItem>
                  </div>
                  <!-- 其他服务商显示一个授权书 -->
                  <div v-else>
                    <FormItem label='授权书：'>
                      <span v-if="tranferAgentInfo.registrationAuthorization==''">{{"暂无"}}</span>
                      <a :href="tranferAgentInfo.registrationAuthorization" target="_blank" v-if="tranferAgentInfo.registrationAuthorization!==''">{{"授权书"}}</a>
                    </FormItem>
                  </div>
              </div>
            <FormItem label="VAT税号文件：">
              <span v-if="detailInfo.vatTaxNumberFile!==''">
                <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{"VAT税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="EORI号：" v-if="detailInfo.countryCode=='FR'">
              <span>{{detailInfo.eoriNumber ? detailInfo.eoriNumber : '暂无'}}</span>
            </FormItem>
      

          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">服务信息</p>
          <Form :label-width=110>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="订单备注：">
              <span>{{orderRemark}}</span>
            </FormItem>
            <FormItem label="服务号：">
              <span>{{detailInfo.serverNo}}</span>
            </FormItem>
            <FormItem label="申报状态：">
              <span>{{progressStatus[detailInfo.progressBar]}}</span>
            </FormItem>
            <FormItem label="服务截止时间：">
              <span>{{detailInfo.expirationTime}}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{detailInfo.companyName}}</span>
            </FormItem>
            <FormItem label="服务商：" v-if="detailInfo.countryCode=='FR'||detailInfo.countryCode=='DE'||detailInfo.countryCode=='IT'">
              <span>{{detailInfo.supplierName || '暂无'}}</span>
            </FormItem>
            <FormItem label="服务商分配编码：">
              <span>{{detailInfo.supplierAssignsServiceId}}</span>
              <Icon class="editIcon" type="ios-create-outline" @click="supplierServiceIDModal = true,supplierServiceID = detailInfo.supplierAssignsServiceId" />
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
            <FormItem label="翻译件：">
              <span v-if="detailInfo.translationMaterial">
                <a :href="detailInfo.translationMaterial.slice(0,5)=='http:'?detailInfo.translationMaterial.slice(0,4)+'s'+detailInfo.translationMaterial.slice(4):detailInfo.translationMaterial" target="_blank">{{"翻译件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
              <span v-if="detailInfo.progressBar==31 || detailInfo.progressBar==38 || detailInfo.progressBar==36 || detailInfo.progressBar==37 || detailInfo.progressBar==29">
                <span v-if="detailInfo.translationMaterial" style="color:red;margin-left:20px;cursor: pointer;" @click="submitTranslationMaterialModel=true" v-show="hasAuthority('declareService_submitTranslationMaterial')">修改</span>
                <span v-else style="color:rgb(22, 173, 233);margin-left:20px;cursor: pointer;" @click="submitTranslationMaterialModel=true" v-show="hasAuthority('declareService_submitTranslationMaterial')">上传</span>
              </span>
            </FormItem>
            <FormItem label="审核时间：">
                <span>{{detailInfo.materialAuditDate}}</span>
              </FormItem>
            <FormItem label="提交服务商时间：">
              <span>{{detailInfo.submitServiceTime?detailInfo.submitServiceTime.slice(0,10):''}}</span>
            </FormItem>
            <FormItem label="提交税局时间：">
              <span>{{detailInfo.submitTaxTime?detailInfo.submitTaxTime.slice(0,10):''}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card v-if="detailInfo.countryCode=='ES'&&detailInfo.progressBar !==28&&detailInfo.progressBar !==33&&detailInfo.progressBar !==38" style="margin-top: 6px;">
          <p slot="title">物流信息</p>
          <Form :label-width=100>
            <FormItem label="寄送海牙单号：">
              <span>{{tranferAgentInfo.hyTrackingNumber==''?'暂无':tranferAgentInfo.hyTrackingNumber}}</span>
              <!-- <Button v-if="tranferAgentInfo.hyTrackingNumber!==''" @click="enterTrankingNumber=true">修改</Button> -->
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
        <Card style="margin-top: 6px;" class="operationLogs">
          <p slot="title">操作记录</p>
          <div v-if="consoleOperationLogs.length > 0" class="logsContent">
            <div v-for="(row, index) in consoleOperationLogs" :key="index">
              <div>
                <p class="itemTop">{{row.instruction}}</p>
                <p v-if="row.remark">备注：{{row.remark}}</p>
                <p class="itemBottom">
                  <span style="margin-right:10px;">时间：{{row.createTime}}</span>
                  <span>操作人：{{row.adminUserNickName || row.adminUserMobile}}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Modal v-model="uploadReceiptModal" @on-visible-change="modalState" title="上传回执">
        <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,1)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,1)}" style="width:260px" v-if="countryCode=='GB'||countryCode=='DE'">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="detailInfo.countryCode=='CZ'||detailInfo.countryCode=='AT'||countryCode=='IT'||countryCode=='ES'||countryCode=='FR'||countryCode=='NL'||countryCode=='PL' ">
          <p v-if="detailInfo.countryCode=='IT' && detailInfo.supplierId ==50">申报回执（必填）：</p>
          <p v-else>申报回执（选填）：</p>
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,1)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,1)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执（可上传多张）</span>
            </div>
          </Upload>
          <p v-if="detailInfo.countryCode !=='CZ'&&detailInfo.countryCode !=='AT' && (detailInfo.countryCode !=='IT' || (detailInfo.countryCode =='IT' && detailInfo.supplierId !=50))">扣款回执（选填）：</p>
          <Upload ref="declareFile"
                  v-if="detailInfo.countryCode !=='CZ'&&detailInfo.countryCode !=='AT' && (detailInfo.countryCode !=='IT' || (detailInfo.countryCode =='IT' && detailInfo.supplierId !=50))"
                  type="drag"
                  :action="fileUpload"
                  :data="{ prefix: '' }"
                  :before-upload="beroreDeclareUploadDebitReceipt"
                  :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,2)}"
                  :on-remove="(file,fileList)=>{removeDeclare(file,fileList,2)}"
                  style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传扣款回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode=='SA'">
          <p>发票开具通知：</p>
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,5)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,5)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <div v-if="!isRowBtn && tableData.length!=0&&tableData[0].declareRule!=2">
            <p>纳税付款发票信件：</p>
            <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,6)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,6)}" style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,7)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,7)}" style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <div v-if="isRowBtn && rowData.declareRule!=2">
            <p>纳税付款发票信件：</p>
            <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,6)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,6)}" style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,7)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,7)}" style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <p>税务申报接收通知：</p>
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,8)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,8)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <p>税务申请表：</p>
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,9)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,9)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode=='AE'">
          <p>税金收款回执：</p>
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,10)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,10)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="uploadReceiptModal=false">取消</Button>
          <Button type="primary" @click="sureUpload">确认</Button>
        </p>
      </Modal>
      <Modal v-model="taxFileModal" @on-visible-change="modalState" title="上传缴税凭证">
        <Upload ref="taxFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreTaxUpload" :on-success="taxUploadSuccess" :on-remove="removetax" style="width:260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="taxFileModal=false">取消</Button>
          <Button type="primary" @click="sureUploadTax">确认</Button>
        </p>
      </Modal>
      <Modal v-model="fileTaxModal" :title="detailInfo.progressBar == 19?'填写报税信息':'修改报税信息'">
        <Form :model="fileTaxForm" label-position="top">
          <FormItem label='当前申报区间：'>
            <DatePicker type="month" @on-change="dateChange($event,0)" placeholder="请选择下一次申报开始时间" v-model="bindTime.beginTime" style="width:200px;margin-right:10px;"></DatePicker>
            <DatePicker type="month" @on-change="dateChange($event,1)" placeholder="请选择下一次申报结束时间" v-model="bindTime.endTime" style="width:200px"></DatePicker>
          </FormItem>
          <FormItem label="申报周期：">
            <Select v-model="fileTaxForm.periodType" clearable placeholder="请选择申报周期">
              <Option :value="item.status" v-for="(item,index) in declearList" :disabled="detailInfo.countryCode == 'CZ' && item.status != 0" :key="index">{{item.type}}</Option>
            </Select>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="fileTaxModal=false">取消</Button>
          <Button type="primary" @click="sureFileTax">确认</Button>
        </p>
      </Modal>
      <Modal v-model="auditModal" @on-visible-change="modalState" :title="detailInfo.progressBar==31?'审核资料':'审核税金到账'">
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
          <Input v-model="remark" type="textarea" placeholder="请输入驳回原因" />
        </p>
        <div v-if="countryCode=='IT' && detailInfo.supplierId != 50">
          <Checkbox v-model="needApiIT">API提交转代理申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="countryCode=='FR'">
          <Checkbox v-model="needApiFR">API提交转代理申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="countryCode=='FR'&&detailInfo.progressBar==33" style="margin-top:10px;">
          <Checkbox v-model="frRetaxInfo.disabledSingle">补缴税金（需要补缴税金时勾选,此内容会传输到法国软件商）</Checkbox>
          <div v-if="frRetaxInfo.disabledSingle">
            补缴金额：
            <Input v-model="frRetaxInfo.extraPrice" style="width:150px;margin:8px;" />元
            <Input v-for="(item, index) in frRetaxInfo.resonList" :key="index" v-model="item.reason" style="margin:8px;" placeholder="备注说明，每行最多512个字符" max-width="512" />
          </div>
        </div>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="auditModal=false">取消</Button>
          <Button type="primary" v-if="isRowBtn" @click="rowSureAudit">确认</Button>
          <!-- 审核转代理资料 -->
          <Button type="primary" v-else @click="sureAudit">确认</Button>
        </p>
      </Modal>

      <Modal v-model="auditDeclareModal" title="是否审核通过">
        <Form ref="auditForm" :model="auditForm" :rules="ruleDeclareForm">
          <FormItem prop="status">
            <RadioGroup v-model="auditForm.status">
              <Radio label="1">审核通过</Radio>
              <Radio label="0">审核不通过</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="remark" v-if="auditForm.status === '0'">
            <Input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入不通过原因（必填）" />
          </FormItem>
        </Form>
        <div slot="footer" style="text-align:center;">
          <Button type="primary" @click="auditDeclareSubmit('auditForm')">确定</Button>
        </div>
      </Modal>
      <Modal v-model="PreTaxCode" :mask-closable="false" title="填写前税代编码">
        <Input type="text" v-model="cfOldRap" placeholder="只能输入字母和数字"></Input>
        <p slot="footer">
          <Button type="primary" @click="sureEnterCfOldRap">确认</Button>
        </p>
      </Modal>
      <!-- 开始报税弹窗 -->
      <!-- <Modal v-model="startTax" title="选择报税时间" :mask-closable="false" :closable="false">
                <p>
                  VAT税号: {{detailInfo.vatTaxNumber}}
                </p>
                <p>
                  公司英文名称: {{detailInfo.companyName}}
                </p>
                <Table
                  border
                  :loading="tableLoading"
                  :columns="columns3"
                  :data="VatObligationsData"
                >
                <template slot="declareInterval" slot-scope="{ row }">
                    {{row.start}}至{{row.end}}
                </template>
                <template slot="operateDeclare" slot-scope="{ row }">
                  <Button type="primary" @click="goToDeclare(row)">去报税</Button>
                </template>
                </Table>
              <div slot="footer">

              </div>
            </Modal> -->
      <!-- 授权海牙认证 -->
      <Modal v-model="authorizationHauge" :mask-closable="false">
        <!-- <p slot="header"
           class="hauge-header">是否确认收到声明书和授权书</p>
        <div class="hauge-content">
          <p>温馨提示：收到董事声明书和授权书后，记得寄送资料到海牙哦；</p>
          <p style="color:red;">寄送资料如下：</p>
          <p style="margin-left:15px;">1、董事声明书；</p>
          <p style="margin-left:15px;">2、注册授权书；</p>
        </div> -->
        <p slot="header" class="hauge-header">是否确认发送给服务商</p>
        <div class="hauge-content">
          <p>资料清单：</p>
          <p>1、海牙授权书；</p>
          <p>2、资质证明；</p>
          <p>3、营业执照扫描件与翻译件；</p>
          <p>4、法人身份证扫描件与翻译件；</p>
        </div>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="authorizationHauge=false">取消</Button>
          <Button type="primary" @click="sureReceived">确认收到</Button>
        </p>
      </Modal>
      <!-- 录入海牙信息 -->
      <Modal v-model="enterHaugeInfo" :mask-closable="false" title="录入海牙信息">
        <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreHaugeload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,3)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,3)}" style="width:260px" v-if="detailInfo.countryCode!='IT'">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" @click="sureEnterHaugeInfo">确认</Button>
        </p>
      </Modal>
      <!-- 填写寄送海牙单号 -->
      <Modal v-model="enterTrankingNumber" :mask-closable="false" title="填写寄送海牙单号">
        <Input v-model="hyNumber"></Input>
        <p slot="footer">
          <Button type="primary" @click="sureEnterTrankingNumber">确认</Button>
        </p>
      </Modal>
      <!-- 填写寄送税局的物流单号 -->
      <Modal v-model="sendTaxBox" :mask-closable="false" title="填写寄送税局的物流单号">
        <Input v-model="taxSendNumber"></Input>
        <p slot="footer">
          <Button type="primary" @click="sureTaxTrankingNumber">确认</Button>
        </p>
      </Modal>
      <Modal v-model="viewInformationModal" footer-hide title="申报信息" class-name="viewInformation" width="700">
        <Form class="form">
          <FormItem label='VAT税号：' v-if="tranferAgentInfo.countryCode !== 'FR'" :label-width="200">
            <span>{{tranferAgentInfo.vatTaxNumber}}</span>
          </FormItem>
          <!-- <FormItem label='欧盟税号：' v-if="declareInfo.countryCode === 'DE'"  :label-width="200">
                  <span>{{declareInfo.companyNameZh}}</span>
                </FormItem> -->
          <FormItem label='报税周期：' v-if="tranferAgentInfo.countryCode !== 'FR'" :label-width="200">
            <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报' : detailInfo.periodType == 1 ? '年报' : detailInfo.periodType == -1 ? '暂无' : ''}}</span>
          </FormItem>
          <FormItem label='公司中文名称：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'DE' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.companyNameZh !== ''">{{tranferAgentInfo.companyNameZh}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司英文名称：' :label-width="200">
            <span v-if="tranferAgentInfo.companyNameEn !== ''">{{tranferAgentInfo.companyNameEn}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司英文地址：' :label-width="200">
            <span>{{tranferAgentInfo.companyAddressEnCountry}}{{tranferAgentInfo.companyAddressEnCity}}{{tranferAgentInfo.companyAddressEn}}</span>
          </FormItem>
          <FormItem label='公司邮政编号：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span>{{tranferAgentInfo.companyPostCode}}</span>
          </FormItem>
          <FormItem label='公司统一社会信用代码：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyCreditCode !== ''">{{tranferAgentInfo.companyCreditCode}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司注册资本：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyRegisteredCapital !== ''">{{tranferAgentInfo.companyRegisteredCapital}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司成立日期：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyRegisterData !== ''">{{tranferAgentInfo.companyRegisterData}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司营业执照注册城市：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyRegisteredCityZh !== ''">{{tranferAgentInfo.companyRegisteredCityZh}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='邮编号码：' v-if="tranferAgentInfo.countryCode === 'DE' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.postCode !== ''">{{tranferAgentInfo.postCode}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='上次申报月份：' v-if="tranferAgentInfo.countryCode === 'DE'" :label-width="200">
            <span v-if="tranferAgentInfo.upBeginTime !== ''">{{tranferAgentInfo.upBeginTime}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='本地税号文件：' v-if="tranferAgentInfo.countryCode === 'DE'" :label-width="200">
            <a v-if="tranferAgentInfo.vatTaxLocalFile!==''" :href="tranferAgentInfo.vatTaxLocalFile" target="_blank">本地税号文件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='欧盟税号文件：' v-if="tranferAgentInfo.countryCode === 'DE'" :label-width="200">
            <a v-if="tranferAgentInfo.vatTaxEuFile!==''" :href="tranferAgentInfo.vatTaxEuFile" target="_blank">欧盟税号文件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='税务副本：' v-if="tranferAgentInfo.countryCode === 'DE'" :label-width="200">
            <a v-if="tranferAgentInfo.vatTaxFileCopy!==''" :href="tranferAgentInfo.vatTaxFileCopy" target="_blank">税务副本</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人中文名：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonZh !== ''">{{tranferAgentInfo.companyLegalPersonZh}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人英文名：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonEn !== ''">{{tranferAgentInfo.companyLegalPersonEn}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人身份证/护照号码：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonCard !== ''">{{tranferAgentInfo.companyLegalPersonCard}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人身份证英文地址：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonCardAddress !== ''">{{tranferAgentInfo.companyLegalPersonCardAddress}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='婚姻状况：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.legalPersonMaritalStatus !== ''">{{tranferAgentInfo.legalPersonMaritalStatus === 1 ? '未婚' : '已婚'}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人性别：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.legalPersonSex !== ''">{{tranferAgentInfo.legalPersonSex === 1 ? '男' : '女'}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人出生省份：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.legalPersonBirthplaceProvinceZh !== ''">{{tranferAgentInfo.legalPersonBirthplaceProvinceZh}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人出生城市：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.legalPersonBirthplaceCityEn !== ''">{{tranferAgentInfo.legalPersonBirthplaceCityEn}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人身份证中文地址：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonCardAddressZh !== ''">{{tranferAgentInfo.companyLegalPersonCardAddressZh}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人出生地：' v-if="tranferAgentInfo.countryCode === 'IT'" :label-width="200">
            <span v-if="tranferAgentInfo.legalPersonBirthplaceCityEn !== ''">{{tranferAgentInfo.legalPersonBirthplaceCityEn}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人出生日期：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyLegalPersonBirthday !== ''">{{tranferAgentInfo.companyLegalPersonBirthday}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法人身份证正反面：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <a v-if="tranferAgentInfo.legalPersonPapers" :href="tranferAgentInfo.legalPersonPapers" target="_blank">身份证正反面/护照</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司邮箱：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <span v-if="tranferAgentInfo.companyEmail !== ''">{{tranferAgentInfo.companyEmail}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='店铺链接：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.shopHref !== ''" :href="tranferAgentInfo.shopHref" target="_blank">店铺链接</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='是否有EORI号：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.needEoriNumber !== ''">{{tranferAgentInfo.needEoriNumber === 0?'否':'是'}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司电话：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <span v-if="tranferAgentInfo.companyTel !== ''">{{tranferAgentInfo.companyTel}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='描述下公司的经营内容：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.companyBusinessModeDescribe !== ''">{{tranferAgentInfo.companyBusinessModeDescribe}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='货物进口及配送流程：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.shippingProcess !== ''">{{tranferAgentInfo.shippingProcess}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='西班牙本地银行账户信息：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.localBankAccountInfo !== ''">{{tranferAgentInfo.localBankAccountInfo}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='是否使用西班牙任何仓库：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.useEntrepot !== ''">{{tranferAgentInfo.useEntrepot === 1 ? '是' : '否'}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='是否开通泛欧：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <span v-if="tranferAgentInfo.dredgeEuronext !== ''">{{tranferAgentInfo.dredgeEuronext === 1 ? '否' : '是'}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='是否有欧盟其它国家税号：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.shopOtherEuTaxNumber !== ''">{{tranferAgentInfo.shopOtherEuTaxNumber}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='税号生效日期：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.taxEffectiveDate !== ''">{{tranferAgentInfo.taxEffectiveDate}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='上一次申报区间：' v-if="tranferAgentInfo.countryCode === 'GB' || tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode == 'FR'" :label-width="200">
            <span v-if="tranferAgentInfo.upBeginTime !== '' && tranferAgentInfo.upEndTime !== ''">{{tranferAgentInfo.upBeginTime}}至{{tranferAgentInfo.upEndTime}}</span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='营业执照扫描件/照片：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <a v-if="tranferAgentInfo.companyBusinessLicense !== ''" :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件/照片</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='VAT证书：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <a v-if="tranferAgentInfo.vatCertificate!==''" :href="tranferAgentInfo.vatCertificate" target="_blank">VAT证书</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='税号文件：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <a v-if="tranferAgentInfo.vatTaxNumberFile!==''" :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='营业执照扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyBusinessLicense!==''" :href="tranferAgentInfo.companyBusinessLicense" target="_blank">营业执照扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='商业登记证/海外证书：' v-if="tranferAgentInfo.countryCode === 'CZ' && tranferAgentInfo.companyType === '3'" :label-width="200">
            <a v-if="tranferAgentInfo.companyBusinessLicenseCopy!==''" :href="tranferAgentInfo.companyBusinessLicenseCopy" target="_blank">商业登记证/海外证书</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='商业登记证BR扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyBusinessRegistrationBr!==''" :href="tranferAgentInfo.companyBusinessRegistrationBr" target="_blank">商业登记证BR扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司注册证明书CI扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyRegistrationCi!==''" :href="tranferAgentInfo.companyRegistrationCi" target="_blank">公司注册证明书CI扫描件：</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法团成立表格NNC1扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyCorporateFoundingNnc1!==''" :href="tranferAgentInfo.companyCorporateFoundingNnc1" target="_blank">法团成立表格NNC1扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='身份证正反面扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyLegalPersonCardFront!==''" :href="tranferAgentInfo.companyLegalPersonCardFront" target="_blank">身份证正反面扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='护照扫描件：' v-if="tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.companyLegalPersonCardPassport!==''" :href="tranferAgentInfo.companyLegalPersonCardPassport" target="_blank">护照扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='后台店铺截图：' v-if="tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.shopConsoleScreenshot!==''" :href="tranferAgentInfo.shopConsoleScreenshot" target="_blank">后台店铺截图</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司信用报告：' v-if="tranferAgentInfo.countryCode === 'ES'" :label-width="200">
            <a v-if="tranferAgentInfo.companyCreditReport!==''" :href="tranferAgentInfo.companyCreditReport" target="_blank">公司信用报告</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='历史申报回执：' v-if="tranferAgentInfo.countryCode === 'IT' || tranferAgentInfo.countryCode === 'ES' || tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.lastDeclareReceipt!==''" :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">历史申报回执</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='在前代理最后一次申报回执和支付凭证：' v-if="tranferAgentInfo.countryCode === 'GB'" :label-width="200">
            <a v-if="tranferAgentInfo.lastDeclareReceipt!==''" :href="tranferAgentInfo.lastDeclareReceipt" target="_blank">在前代理最后一次申报回执和支付凭证</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='税号文件：' v-if="tranferAgentInfo.countryCode === 'FR'" :label-width="200">
            <a v-if="tranferAgentInfo.vatTaxNumberFile!==''" :href="tranferAgentInfo.vatTaxNumberFile" target="_blank">税号文件</a>
            <span v-else>暂无</span>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="finishAgentModal" title="完成转代理">
        <p style="text-align:center;margin-bottom: 20px;">确认后不可修改，客户进入正常申报流程</p>
        <p v-if="canGeneSupperDecl" style="color:red;margin-bottom: 20px;text-align:center;">提示：客户有需进行补申报的工单，请提醒客户及时购买补申报服务。</p>
        <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatCertificateNew')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'vatCertificateNew')}" :format="['jpg','jpeg','png','gif','pdf']" style="width:300px;margin: auto;" :show-upload-list="false">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span v-if="tranferAgentInfo.vatCertificateNew==''">上传税号证书（新）</span>
            <span v-else>点击或拖拽文件到此区域重新上传</span>
          </div>
        </Upload>
        <div style="text-align: center;" v-if="tranferAgentInfo.vatCertificateNew!=''">
          <a :href="tranferAgentInfo.vatCertificateNew" target="_blank">VAT税号证书（新）</a>
          <Icon type="ios-close-circle" @click.stop="removeHandler('','','vatCertificateNew')" />
        </div>
        <p slot="footer">
          <Button @click="finishAgentModal = false">取消</Button>
          <Button type="primary" @click="finishAgentBtn">确认</Button>
        </p>
      </Modal>
      <Modal v-model="finishAgentPLModal" title="完成转代理">
        <p style="margin-bottom: 10px;font-size:12px;">完成转代理前请完善此税号的税局收款信息！</p>
        <p style="margin-bottom: 10px;font-size:16px;">请补充税局收款账户信息：</p>
        <p style="margin-bottom: 10px;font-size:14px;">温馨提示：不同税号对应的税局收款账户不一致，请点击
          <a href="https://www.podatki.gov.pl/generator-
mikrorachunku-podatkowego" target="_blank">https://www.podatki.gov.pl/generator- mikrorachunku-podatkowego
          </a>查看当前税号的收款账户
        </p>
        <p v-if="canGeneSupperDecl" style="color:red;margin-bottom: 10px;">提示：客户有需进行补申报的工单，请提醒客户及时购买补申报服务。</p>
        <Form label-position="top">
          <FormItem label='银行名称（Bank Name）：'>
            <Input v-model="AgentPLForm.bureauBankName"></Input>
          </FormItem>
          <FormItem label='银行账号（IBAN）：'>
            <Input v-model="AgentPLForm.bureauBankAccount"></Input>
          </FormItem>
          <FormItem label='BIC：'>
            <Input v-model="AgentPLForm.bureauSwiftBic"></Input>
          </FormItem>
          <FormItem label='银行地址（Bank Address）：'>
            <Input v-model="AgentPLForm.bureauBankAddress"></Input>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button @click="finishAgentPLModal = false">取消</Button>
          <Button type="primary" @click="finishPLAgentBtn">确认</Button>
        </p>
      </Modal>
    </div>
    <Modal title="录入发票号" @on-visible-change="modalState" v-model="invoicaBoxShow">
      <Form>
        <FormItem label='发票号：' :label-width="100">
          <Input v-model="invoiceInfo.invoiceNumber"></Input>
        </FormItem>
        <FormItem label='发票号文件（选填）：' :label-width="100">
          <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreHaugeload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,4)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,4)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="invoicaBoxShow=false">取消</Button>
        <Button type="primary" @click="submitInvice">确认</Button>
      </p>
    </Modal>
    <Modal title="录入EORI号" @on-visible-change="modalState" v-model="eoriBox">
      <Form>
        <FormItem>
          <span style="color:red">*</span>
          <span>EORI号</span>
          <Input v-model="eoriForm.eoriNumber"></Input>
        </FormItem>
        <FormItem label='EORI文件：' :label-width="100">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreEoriload" :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,11)}" :on-remove="(file,fileList)=>{removeDeclare(file,fileList,11)}" style="width:260px">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="invoicaBoxShow=false">取消</Button>
        <Button type="primary" @click="submitEori">确认</Button>
      </p>
    </Modal>
    <Modal title="录入GIBAN码" @on-visible-change="modalState" v-model="gibanBox">
      <p>GIBAN码：</p>
      <Input v-model="gibanCode"></Input>
      <p slot="footer">
        <Button type="primary" @click="submitGiban">确认</Button>
      </p>
    </Modal>
    <Modal title="修改服务商分配编码" v-model="supplierServiceIDModal">
        <Input style="width:300px;" placeholder="请输入服务商分配编码" v-model="supplierServiceID"></Input>
        <p slot="footer">
          <Button type="primary" @click="confirmUpdateSupplierServiceID">确认</Button>
        </p>
    </Modal>
    <Modal title="选择服务商" v-model="supplierModal">
      <Select clearable @on-change="supplierSelectFun" v-model="supplierId" placeholder="选择服务商">
        <Option v-for="(item,index) in SupplierByConditionList" :value="item.id" :key="index">{{item.shortName}}</Option>
      </Select>
      <p slot="footer">
        <Button type="primary" @click="supplierModal = false">确认</Button>
      </p>
    </Modal>
    <Modal v-model="resonModelFR" :title="resonModelTitle">
      <div>
        <p>失败原因：{{frReason}}</p>
      </div>
      <div slot="footer" v-if="declareRow.declarationStatus==3">
        <Button @click="resonModelFR = false">取消</Button>
        <Button type="primary" @click="submitFRagain">重新提交</Button>
      </div>
    </Modal>
    <Modal title="年报详情" v-model="deYearDetail" width="1000" footer-hide>
      <Row>
        <Col span="12">
        <span class="tax-info-name">公司英文名称：</span>
        <span class="tax-info-value">{{detailInfo.companyNameEn}}</span>
        </Col>
        <Col span="12">
        <span class="tax-info-name">VAT税号：</span>
        <span class="tax-info-value">{{detailInfo.vatTaxNumber}}</span>
        </Col>
      </Row>
      <Row style="margin-top:10px;">
        <Col span="12">
        <span class="tax-info-name">年度申报时间/年：</span>
        <span class="tax-info-value">{{thatDEinfo.year}}年</span>
        </Col>
        <Col span="12">
        <span class="tax-info-name">申报区间：</span>
        <span class="tax-info-value">{{thatDEinfo.beginTime}}至{{thatDEinfo.endTime}}</span>
        </Col>
      </Row>
      <Divider />
      <p>申报回执：
        <a target="_blank" :href="thatDEinfo.declareReceipt" v-if="thatDEinfo.declareReceipt!=''">查看</a>
      </p>
      <p style="margin:10px 0;">申报数据：</p>
      <Table :data="deAnnalsData" :columns="deAnnalsColumns" border>
        <template slot="fillDiscount" slot-scope="{row}">
          <div @click="discountBox = true;dataIndex=row._index" style="cursor:pointer;">查看</div>
        </template>
        <template slot="declareReceipt" slot-scope="{row}">
          <div>
            <span v-if="row.declareReceipt==''">暂无</span>
            <a v-else :href="row.declareReceipt" target="_blank">查看</a>
          </div>
        </template>
        <template slot="payReceipt" slot-scope="{row}">
          <div>
            <span v-if="row.payReceipt==''">暂无</span>
            <a v-else :href="row.payReceipt" target="_blank">查看</a>
          </div>
        </template>
      </Table>
    </Modal>
    <Modal v-model="discountBox" title="抵扣金额" :mask-closable="false">
      <Form :model="deAnnalsData[dataIndex]" :label-width="127" v-if="deAnnalsData.length>0">
        <FormItem label="发票抵扣">
          <Input v-model="deAnnalsData[dataIndex].invoiceDeductiontPrice" placeholder="请输入发票抵扣金额" style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
        <FormItem label="增值税抵扣">
          <Input v-model="deAnnalsData[dataIndex].c88DeductiontPrice" placeholder="请输入增值税抵扣" style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
        <FormItem label="其它抵扣">
          <Input v-model="deAnnalsData[dataIndex].euDeductiontPrice" placeholder="请输入其它抵扣" style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
      </Form>
      <div slot="footer" class="discount-footer">
        <Button type="primary" @click="discountBox=false">确认</Button>
      </div>
    </Modal>
    <Modal v-model="taxModal" title="报税信息" :width="800">
      <div v-if="JSON.stringify(taxBaseData)!='{}'">
        <Row>
          <Col span="12">
          <span class="tax-info-name">VAT税号</span>
          <span class="tax-info-value">{{taxBaseData.vatTaxNumber}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">含税销售额</span>
          <span class="tax-info-value">{{taxBaseData.includTaxPrice}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <span class="tax-info-name">报税区间</span>
          <span class="tax-info-value">{{taxBaseData.beginTime.slice(0,7)}}至{{taxBaseData.endTime.slice(0,7)}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">不含税销售额</span>
          <span class="tax-info-value">{{taxBaseData.excludeTaxPrice}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <span class="tax-info-name">抵扣总金额</span>
          <span class="tax-info-value">{{taxBaseData.deductionPrice}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">销项税金</span>
          <span class="tax-info-value">{{taxBaseData.taxAmtTotal}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <span class="tax-info-name">最终缴税金额</span>
          <span class="tax-info-value">{{taxBaseData.allTaxPrice}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">亚马逊销售文件</span>
          <span class="tax-info-value">
            <a :href="taxBaseData.sellFile" v-if="taxBaseData.sellFile!=''">点击下载</a>
          </span>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
          <span class="tax-info-name">税金确认单</span>
          <span class="tax-info-value">
            <a href="javascript:void(0);" @click="downloadShuijinForms(taxBaseData)">点击查看</a>
          </span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">其他平台销售额</span>
          <span class="tax-info-value">{{taxBaseData.otherIncludTaxAmt}}</span>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
          <span class="tax-info-name">其他平台销售额文件</span>
          <span class="tax-info-value">
            <a :href="taxBaseData.otherSaleFileUrl.slice(0,5)=='http:'?(taxBaseData.otherSaleFileUrl.slice(0,4)+'s'+taxBaseData.otherSaleFileUrl.slice(4)):taxBaseData.otherSaleFileUrl" v-if="taxBaseData.otherSaleFileUrl!=''" target="_blank">点击下载</a>
          </span>
          </Col>
        </Row>
        <!-- <div class="country-list">
        <p class="country-list-left">VAT国家（已注册）：</p>
        <p class="country-list-right">
          <span v-for="(item,index) in alist" :key="index">{{ index == alist.length-1? item : item+'、' }}</span>
        </p>
      </div> -->
        <Divider />
        <Table :data="taxBaseData.listTaxDeductionItem" :columns="discountColumns" border>
          <template slot="deductionFile" slot-scope="{row}">
            <div>
              <a :href="row.deductionFile" target="_blank">{{row.fileOriginalName}}</a>
            </div>
          </template>
        </Table>
      </div>
    </Modal>
    <Modal v-model="editDeductionModal" title="编辑抵扣明细">
      <Form ref="deductionForm" :model="deductionForm">
        <FormItem label="抵扣类型：" prop="deductionType">
          <Select v-model="deductionForm.deductionType" style="width:300px;" placeholder="请选择抵扣类型">
            <Option :value="1">进口增值税抵扣</Option>
            <Option :value="2">发票抵扣</Option>
            <Option :value="3">欧盟内采购</Option>
            <Option :value="4">B2B发票</Option>
          </Select>
        </FormItem>
        <FormItem label="单据日期：" prop="billDate">
          <DatePicker placement="bottom-end" @on-change="changeBillDate" v-model='deductionForm.billDate' style="width:300px;" placeholder="请选择单据日期"></DatePicker>
        </FormItem>
        <FormItem label="抵扣金额：" prop="deductiontAmt">
          <Input placeholder="请输入抵扣金额" style="width:300px;" v-model="deductionForm.deductiontAmt"></Input>
        </FormItem>
        <FormItem label="抵扣凭证：" prop="deductionFile">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beforeUploadHandlerDeductionFile" :on-success="(res,file,fileList)=>{successHandlerDeductionFile(res,file,fileList,'deductionFile')}" :on-remove="(file,fileList)=>{removeHandlerDeductionFile(file,fileList,'deductionFile')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span v-if="deductionForm.deductionFile==''">请拖拽文件到此区域上传或点击上传</span>
              <span v-else>点击或拖拽文件到此区域重新上传</span>
            </div>
          </Upload>
          <div v-if="deductionForm.deductionFile!=''">
            <a :href="deductionForm.deductionFile" target="_blank">{{deductionForm.fileOriginalName}}</a>
            <Icon type="ios-close-circle" @click.stop="removeHandlerDeductionFile('','','deductionFile')" />
          </div>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="deductionFormSubmit(1)">确定</Button>
        <Button type="primary" @click="deductionFormSubmit(2)">删除</Button>
      </div>
    </Modal>
    <Modal v-model="updateStatus" title="更改状态">
      <p>当前状态：<span>{{progressStatus[updateStatusObj.status]}}</span></p>
      <br />
      <div>
        <p>更改状态为</p>
        <br />
        <RadioGroup v-model="updateStatusData.status">

          <Radio label="21" v-if="updateStatusObj.status==18 || updateStatusObj.status==22 || (updateStatusObj.status==25 && updateStatusObj.countryCode!='GB' && updateStatusObj.countryCode!='DE')">待提交申报</Radio>

          <Radio label="22" v-if="updateStatusObj.status==25 && (updateStatusObj.countryCode=='AE' || updateStatusObj.countryCode=='SA')">待缴纳税金</Radio>

        </RadioGroup>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="updateStatus=false">取消</Button>
        <Button type="primary" @click="sureUpdateStatus">确认</Button>
      </p>
    </Modal>
    <Modal v-model="buShenBaoModal" title="生成补申报工单">
      <p style="margin-bottom:20px">
        <span>申报周期：</span>
        <span>{{declarePeriod == 0 ? '月报' : declarePeriod == 1 ? '季报': declarePeriod == 2 ? '年报' : declarePeriod == -1 ? '暂无' : ''}}</span>
      </p>
      <p style="margin-bottom:20px">
        <span>上次申报区间：</span>
        <span>{{lastUpBeginTime.slice(0,10)}} 至 {{lastUpEndTime.slice(0,10)}}</span>
      </p>
      <p style="margin-bottom:20px">
        <span>补申报订单号：</span>
        <span>{{orderNo1}}</span>
      </p>
      <div style="display:flex;margin-bottom:20px">
        <span style="margin-right:10px;margin-bottom:20px">补申报区间：</span>
        <DatePicker type="month" @on-change="suppleDeclChange" v-model="suppleDeclStartTime" placeholder="开始月份" style="width: 100px"></DatePicker>
        <span>——</span>
        <DatePicker type="month" @on-change="suppleDeclChange" v-model="suppleDeclEndTime" placeholder="结束月份" style="width: 100px"></DatePicker>
      </div>
      <p style="color:red;position: relative;top:-20px;left:83px;" v-if="errorMassage">请选择正确的补申报区间</p>
      <div style="margin-bottom:20px">
        <span style="margin-right:10px">是否合并申报：</span>
        <RadioGroup v-model="isHebing" @on-change="suppleDeclChange">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </div>
      <p style="color:red;position: relative;top:-20px;left:83px;" v-if="errorMassage1">请选择是否合并申报</p>
      <Divider />
      <p style="margin-bottom:20px">补申报工单如下：</p>
      <p style="margin-bottom:20px" v-for="(item,index) in dataList" :key="index">{{ item.suppleDeclStartTime }} 至 {{ item.suppleDeclEndTime }}</p>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="buShenBaoModal=false">取消</Button>
        <Button type="primary" @click="sureBuShenBao">确认生成</Button>
      </p>
    </Modal>
    <Modal v-model="submitServiceModal" title="提交资料确认">
      <p style="text-align:center;margin-bottom:10px">请输入提交服务商资料时间</p>
      <div style="display:flex;margin-bottom:10px;justify-content:center;">
        <div style="margin-right:10px">
          <DatePicker v-model="submitServiceTime" type="date" placeholder="请选择提交服务商资料时间" style="width: 200px"></DatePicker>
        </div>
        <div>
          <Button type="primary" @click="todayTime('service')">今天</Button>
        </div>
      </div>
      <p style="color:rgb(247, 151, 40);text-align:center;margin-bottom:10px">温馨提示：提交后时间不能更改，请谨慎填写</p>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="submitServiceModal=false">取消</Button>
        <Button type="primary" @click="submitServiceHandel">确认</Button>
      </div>
    </Modal>
    <Modal v-model="submitTaxModal" title="提交税局确认">
      <p style="text-align:center;margin-bottom:10px">请输入提交税局时间</p>
      <div style="display:flex;margin-bottom:10px;justify-content:center;">
        <div style="margin-right:10px">
          <DatePicker v-model="submitTaxTime" type="date" placeholder="请选择提交税局时间" style="width: 200px"></DatePicker>
        </div>
        <div>
          <Button type="primary" @click="todayTime('tax')">今天</Button>
        </div>
      </div>
      <p style="color:rgb(247, 151, 40);text-align:center;margin-bottom:10px">温馨提示：提交后时间不能更改，请谨慎填写</p>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="submitTaxModal=false">取消</Button>
        <Button type="primary" @click="submitTaxHandel">确认</Button>
      </div>
    </Modal>
    <Modal v-model="submitTranslationMaterialModel" :title="detailInfo.translationMaterial?'修改翻译件':'上传翻译件'">
      <div style="display:flex">
        <span>翻译件：</span>
        <div>
          <Upload ref="taxFile" 
                  type="drag" 
                  :action="fileUpload" 
                  :data="{ prefix: '' }" 
                  :before-upload="beroreTaxUpload" 
                  :on-success="translationMaterialUploadSuccess" 
                  :on-remove="removeTranslationMateria" 
                  style="width:260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        </div>
      </div>
      <p style="color:rgb(247, 151, 40);">注：支持JPG、JPEG、PNG、PDF 和压缩包</p>
      <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="submitTranslationMaterialModel=false">取消</Button>
          <Button type="primary" @click="sureUploadTranslationMaterial">确认</Button>
        </p>
    </Modal>
    <!-- <Spin size="large"
          fix
          v-if="spinShow">
      <Icon type="ios-loading"
            size=18
            class="demo-spin-icon-load"></Icon>
      <div>正在下载，请稍后</div>
    </Spin> -->
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
  props: ['id', 'countryCode', 'userId', 'isService','productFunctionCode'],
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
      supplierServiceIDModal:false,
      translationMaterial:'',
      submitTranslationMaterialModel:false,
      submitServiceTime:'',
      submitTaxTime:'',
      submitServiceModal:false,
      submitTaxModal:false,
      supplierServiceID:'',
      formerAgentTerminationAuthorizationLetter:'',
      alist: ['德国', '法国', '意大利', '德国', '法国', '意大利', '德国', '法国', '意大利', '德国', '法国', '意大利'],
      auditForm: {
        status: '',
        remark: '',
        workId: ''
      },
      orderNo1: '',
      suppleDeclStartTime: '',
      suppleDeclEndTime: '',
      suppleDeclList: [
        {
          suppleDeclStartTime: '2020-10',
          suppleDeclEndTime: '2020-12'
        },
        {
          suppleDeclStartTime: '2021-01',
          suppleDeclEndTime: '2021-03'
        },
      ],
      dataList: [],
      buShenBaoModal: false,
      isHebing: '',
      canGeneSupperDecl: false,
      lastUpBeginTime: '',
      lastUpEndTime: '',
      declarePeriod: '',
      spinShow: false,
      nowDownload: false,
      updateStatusData: {
        status: ''
      },
      errorMassage: false,
      errorMassage1: false,
      updateStatusObj: {},
      updateStatus: false,
      eoriBox: false,
      eoriForm: {
        eoriNumber: '',
        eoriFile: ''
      },
      auditDeclareModal: false,
      lenovoSearchList: [],
      fileUpload: this.workOrderFile,
      consoleOperationLogs: [], //操作日志
      describeText: '',
      isEditor: false,
      allNotSub: false,
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
          // render(h, params) {
          //   return h('span', params.index + 1)
          // },
        },
        {
          title: '申报区间',
          render: (h, params) => {
            let self = this
            let beginTime = params.row.beginTime !== '' ? params.row.beginTime.slice(0, 7) : '';
            let endTime = params.row.endTime !== '' ? params.row.endTime.slice(0, 7) : '';
            let biaoShi = params.row.isSuppleDecl && params.row.isSuppleDecl == 1 ? '补申报：' : ''
            return h('span', [
              h('span', {
                style: {
                  color: 'red'
                }
              }, biaoShi),
              h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : ''),
            ])
          },
          minWidth: 80,
          align: 'center'
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
          slot: 'operate',
          minWidth: 80
        }
      ],
      // 选择报税区间
      columns3: [
        {
          title: '报税区间',
          slot: 'declareInterval',
        },
        {
          title: '税金到账截止日期',
          key: 'due'
        },
        {
          title: '操作',
          slot: 'operateDeclare'
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
      taxFileModal: false, //缴税凭证弹窗
      deductionInfo: [],//抵扣明细,
      orderNo: '',
      orderRemark: '',
      columns1: [
        {
          title: '抵扣类型',
          slot: 'deductionType',
          width: 120
        },
        {
          title: '抵扣金额',
          key: 'deductiontAmt',
          width: 100
        },
        {
          title: '单据日期',
          key: 'billDate',
          width: 150
        },
        {
          title: '抵扣文件',
          slot: 'deductFile'
        },
        {
          title: '操作',
          slot: 'operate'
        },
      ],
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
        gatewayVerificationCode: '',
        companyLegalPersonCardReverse: '',
        companyLegalPersonCardPassport: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonBirthday: '',
        companyRegisteredCapital: '',
        needEoriNumber: '',
        isThereEoriNumber: '',
        formerAgentName: '',
        formerAgentVatNumber: '',
        formerAgentSiret: '',
        formerAgentAddress: '',
        shopSalePlatformName: '',
        companyLegalPersonCardAddressZh: '',
        future30Sale: '',
        swiftBic: '',
        bankAccount: '',
        bankSubBranchName: '',
        bankAccountName: '',
        bankAddress: '',
        bankName: '',
        transformProxyReason: '',
        shopSalePlan: '',
        shopSalePlatformAccount: '',
        companyLegalPersonEmail: '',
        shopSaleBefore: '',
        legalPersonBirthplaceProvinceEn: '',
        companyLegalPersonMobile: '',
        shopNature: '',
        vatTaxNumber: "",
        legalPersonBirthplaceProvinceZh: '',
        declarePeriod: "",
        companyNameEn: "",
        vatTaxEuNumber: '',
        companyType: '1',
        certificateType: '1',
        companyCitizenship: '',
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyPostCode: '',
        companyEmail: "",
        returnReceiptBox5: '',
        gbAddressPostcode: '',
        companyTel: "",
        companyBusinessModeDescribe: "",
        taxEffectiveDate: "",
        upBeginTime: "",
        upEndTime: "",
        declareRule: '',
        taxRate: '',
        companyBusinessLicense: "",
        companyBusinessLicenseCopy: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        gatewayId: "",
        gatewayEmail: '',
        registerTaxDate: '',
        gatewayLastLoginDate: '',
        gatewayPassword: "",
        postCode: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        declarePeriodChangeLetter: '',
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
        companyLegalPersonCitizenship: '',
        companyCreditReport: '',
        localBankAccountInfo: '',
        shopNature: '',
        isThereShop: '',
        articlesOfAssociationFile: '',
        bankAccountFile: '',
        companyTaxNumFile: '',
        salesEvidenceFile: '',
        recordOfPenaltyCharges: '',
        vatCertificateNew: '',
        legalPersonPostCode: '',
        //新增字段
        shopSaleBeforeFile: '',
        shopSalePlatformContract: '',
        companyStockConditionFile: '',
        customsClearanceReport: '',
        bankAddress: '',
        isOtherGulfStateDutyOrServices: ''
      },//转代理资料
      progressStatus: {
        8: "资料驳回",
        18: "申报中",
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
        35: "待上传零申报凭证",
        38: "待授权转代理",
        36: "待授权海牙认证",
        37: "海牙认证中",
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
      ruleDeclareForm: {
        status: [
          { required: true, message: '请审核', trigger: 'change' }
        ],
        remark: [
          { required: true, type: 'string', message: '请输入不通过原因', trigger: 'blur' }
        ]
      },
      ruleForm: {
        legalPersonPostCode: [
          { required: true, trigger: "blur", message: "请填写法人出生地邮政编号" }
        ],
        companyLegalPersonCardAddressZh: [
          { required: true, trigger: "blur", message: "请填写法人身份证中文地址" }
        ],
        formerAgentName: [
          { required: true, trigger: "blur", message: "请填写前代理名称" }
        ],
        formerAgentVatNumber: [
          { required: true, trigger: "blur", message: "请填写前代理税号" }
        ],
        formerAgentSiret: [
          { required: true, trigger: "blur", message: "请填写前代理siret号" }
        ],
        companyRegisteredCapital: [
          { required: true, trigger: "blur", message: "请填写公司注册资本" }
        ],
        formerAgentAddress: [
          { required: true, trigger: "blur", message: "请填写前代理地址" }
        ],
        future30Sale: [
          { required: true, trigger: "blur", message: "请输入预计未来30天销售额" }
        ],
        swiftBic: [
          { required: true, trigger: "blur", message: "请输入Swift / BIC" }
        ],
        bankAccount: [
          { required: true, trigger: "blur", message: "请输入IBAN/银行账户" }
        ],
        bankSubBranchName: [
          { required: true, trigger: "blur", message: "请输入支行英文名称" }
        ],
        bankName: [
          { required: true, trigger: "blur", message: "请输入银行英文名称" }
        ],
        bankAddress: [
          { required: true, trigger: "blur", message: "请填写支行英文地址" }
        ],
        bankAccountName: [
          { required: true, trigger: "blur", message: "请输入银行账户名称" }
        ],
        shopSalePlan: [
          { required: true, trigger: "blur", message: "请填写预计未来12个月销售额" }
        ],
        transformProxyReason: [
          { required: true, trigger: "blur", message: "请填写转代理原因" }
        ],
        shopSaleBefore: [
          { required: true, trigger: "blur", message: "请填写前12个月的销售额" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "blur", message: "请填写电商平台账号完整名称" }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "blur", message: "请填写联系电话" }
        ],
        registerTaxDate: [
          { required: true, trigger: "blur", message: "请填写注册税号日期", type: 'date' }
        ],
        legalPersonBirthplaceProvinceEn: [
          { required: true, trigger: "blur", message: "请填写法人出生省市" }
        ],
        legalPersonBirthplaceProvinceZh: [
          { required: true, trigger: "blur", message: "请填写法人出生省份" }
        ],
        companyPostCode: [
          { required: true, trigger: "blur", message: "请填写公司邮政编号" }
        ],
        companyLegalPersonZh: [
          { required: true, trigger: "blur", message: "请填写法人中文名称" }
        ],
        gatewayId: [
          { required: true, trigger: "blur", message: "请填写Gateway ID" }
        ],
        companyCitizenship: [
          { required: true, trigger: "blur", message: "请填写公司国籍" }
        ],
        companyType: [
          { required: true, trigger: "change", message: "请选择公司类型" }
        ],
        shopSalePlatformName: [
          { required: true, trigger: "change", message: "请选择店铺所在电商平台" }
        ],
        needEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否已有EORI号" }
        ],
        isThereEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否已有EORI号" }
        ],
        shopNature: [
          { required: true, trigger: "change", message: "请选择店铺性质" }
        ],
        isOtherGulfStateDutyOrServices: [
          { required: true, trigger: "change", message: "请选择是否有其他海湾国税号或业务" }
        ],
        gatewayPassword: [
          { required: true, trigger: "blur", message: "请填写Gateway 密码" }
        ],
        vatTaxNumber: [
          { required: true, trigger: "blur", message: "请填写VAT税号" }
        ],
        vatTaxEuNumber: [
          { required: true, trigger: "blur", message: "请填写欧盟税号" }
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
        companyAddressCn: [
          { required: true, trigger: "blur", message: "请填写公司中文地址" }
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
        gatewayEmail: [
          { required: true, trigger: "blur", message: "请填写Gateway  绑定邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写联系邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        returnReceiptBox5: [
          { required: true, trigger: "blur", message: "请填写BOX5金额" }
        ],
        gbAddressPostcode: [
          { required: true, trigger: "blur", message: "请填写英国地址邮编" }
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
        companyLegalPersonCitizenship: [
          { required: true, trigger: "change", message: "请选择法人国籍" }
        ],
        certificateType: [
          { required: true, trigger: "change", message: "请选择证件类型" }
        ],
        companyLegalPersonCard: [
          { required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }
        ],
        companyLegalPersonCardAddress: [
          { required: true, trigger: "blur", message: "请填写法人身份证英文地址" }
        ],
        companyLegalPersonCardAddressCn: [
          { required: true, trigger: "blur", message: "请填写法人身份证中文地址" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "blur", message: "请填写法人出生地" }
        ],
        companyLegalPersonBirthday: [
          {
            required: true,
            trigger: "change",
            message: "选择法人出生日期",
            type: "date"
          }
        ],
        thresholdValueTime: [
          { required: true, trigger: "change", message: "请选择超过阈值或预计超过阈值的日期", type: 'date' }
        ],
        shopHref: [
          { required: true, trigger: "blur", message: "请填写店铺链接" }
        ],
        declareRule: [
          { required: true, trigger: "blur", message: "请选择报税方式" }
        ],
        gatewayVerificationCode: [
          { required: true, trigger: "blur", message: "请选择是否能够提供Gateway验证码" }
        ],
        taxRate: [
          { required: true, trigger: "blur", message: "请选择报税税率" }
        ],
        taxEffectiveDate: [
          {
            required: true,
            trigger: "change",
            message: "选择税号生效日期",
            type: "date"
          }
        ],
        gatewayLastLoginDate: [
          {
            required: true,
            trigger: "change",
            message: "选择最后一次登录Gateway时间",
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
        companyBusinessLicenseCopy: [
          {
            required: true,
            trigger: "change",
            message: "请上传商业登记证/海外证书"
          }
        ],
        companyBusinessRegistrationBr: [
          {
            required: true,
            trigger: "change",
            message: "请上传商业登记证BR"
          }
        ],
        companyRegistrationCi: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司注册证明书CI"
          }
        ],
        companyCorporateFoundingNnc1: [
          {
            required: true,
            trigger: "change",
            message: "请上传法团成立表格NNC1"
          }
        ],
        companyLegalPersonCardReverse: [
          {
            required: true,
            trigger: "change",
            message: "请上传法人身份证反面扫描件"
          }
        ],
        companyLegalPersonCardPassport: [
          {
            required: true,
            trigger: "change",
            message: "请上传法人护照扫描件"
          }
        ],
        // companyLegalPersonCardFront: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     message: "请上传法人身份证反面扫描件"
        //   }
        // ],
        companyStockConditionFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传股份分配证书"
          }
        ],
        customsClearanceReport: [
          {
            required: true,
            trigger: "change",
            message: "请上传清关报告"
          }
        ],
        legalPersonPapers: [
          { required: true, trigger: "change", message: "请上传身份证正反面" }
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传最后一次申报回执"
          }
        ],
        companyLegalPersonCardFront: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证扫描件"
          }
        ],
        shopConsoleScreenshot: [
          {
            required: true,
            trigger: "change",
            message: "请上传后台店铺截图"
          }
        ],
        vatCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传意大利或法国VAT证书"
          }
        ],
        salesEvidenceFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传销售证据"
          }
        ],
        companyLegalPersonCardPassport: [
          {
            required: true,
            trigger: "change",
            message: "请上传法人护照扫描件"
          }
        ],
        articlesOfAssociationFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司章程"
          }
        ],
        bankAccountFile: [
        ],
        companyTaxNumFile: [
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
        declarePeriodChangeLetter: [
          { required: true, trigger: "change", message: "请上传申报周期更改信件" }
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
        shopSaleBeforeFile: [
          { required: true, trigger: "blur", message: "请上传过往12个月销售报告" }
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
      viewInformationModal: false,  // 信息展示弹窗
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
      finishAgentPLModal: false,//波兰完成转代理
      AgentPLForm: {
        bureauBankAccount: '',
        bureauBankAddress: '',
        bureauBankName: '',
        bureauSwiftBic: ''
      },//波兰转代理资料
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
      needApiFR: true,
      isAuth: true,
      //德国年报
      deYearLoading: false,
      deYearColumns: [
        {
          title: '年度申报时间',
          align: 'center',
          render(h, params) {
            return h('span', params.row.year + '年')
          },
        },
        {
          title: '年度申报区间',
          align: 'center',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7)
            let endTime = params.row.endTime.slice(0, 7)
            if(beginTime == ''){
              return h('span','暂无')
            }else{
              return h('span', beginTime + '至' + endTime)
            }
          },
        },
        {
          title: '状态',
          align: 'center',
          render(h, params) {
            let status = params.row.status,
              rowStatus = status == 21 ? '待申报' : status == 27 ? '已申报' : ''
            return h('span', rowStatus)
          },
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operation'
        },
      ],
      deYearData: [],
      deYearDetail: false,
      thatDEinfo: {},
      deAnnalsData: [],
      deAnnalsColumns: [
        {
          title: '申报周期',
          align: 'center',
          render(h, params) {
            let declarePeriod = params.row.declarePeriod
            return h('span', declarePeriod == 0 ? '月报' : declarePeriod == 1 ? '季报' : declarePeriod == 2 ? '年报' : '')
          },
        },
        {
          title: '申报月份/季度',
          align: 'center',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7)
            let endTime = params.row.endTime.slice(0, 7)
            return h('span', beginTime + '至' + endTime)
          },
        },
        {
          title: '不含税销售额（欧元）',
          align: 'center',
          key: 'excludeTaxPrice'
        },
        {
          title: '缴税金额（欧元）',
          align: 'center',
          key: 'allTaxPrice'
        },
        {
          title: '抵扣金额（选填）',
          align: 'center',
          slot: 'fillDiscount'
        },
        {
          title: '税率',
          align: 'center',
          render(h, params) {
            return h('span', params.row.taxRate + '%')
          },
        },
        {
          title: '申报回执',
          align: 'center',
          slot: 'declareReceipt'
        },
        {
          title: '缴费凭证',
          align: 'center',
          slot: 'payReceipt'
        },
      ],
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
      declareRow: {},
      isDeclareInfo: false,
      editDeductionModal: false,
      deductionForm: {
        deductionType: '',
        billDate: '',
        deductiontAmt: '',
        deductionFile: '',
        fileOriginalName: ''
      },
    }
  },
  created() {
    this.getDetailInfo()
    this.getBaseInfo()

  },
  mounted() {
    this.automaticInformationFilling()
    if (this.countryCode == 'FR' || this.countryCode == 'ES' || this.countryCode == 'DE') {
      this.getSupplierByCondition(this.countryCode)
    }

  },
  methods: {
    //公司类型change
    companyTypeChange(val) {
      if (val == "3") {
        this.tranferAgentInfo.certificateType = "2";
      }
    },
    translationMaterialUploadSuccess(res, file, fileList){
      this.translationMaterial = res.data.fileUrl
    },
    removeTranslationMateria(file, fileList){
      this.translationMaterial = ''
    },
    sureUploadTranslationMaterial(){
      if(this.translationMaterial==''){
        this.$Message.warning('请上传翻译件')
        return;
      }
      let data = {
        serverNo:this.detailInfo.serverNo,
        translationMaterial:this.translationMaterial
      }
      API.updateOrSave(data).then(res=>{
        if(res.code == 0){
          this.$Message.success('上传成功')
          this.submitTranslationMaterialModel = false
          this.getDetailInfo()
        }
      })
    },
    submitServiceHandel(){
      if(this.submitServiceTime == ''){
        this.$Message.warning('提交服务商资料时间不能为空')
        return;
      }
      let data = {
        serverNo:this.detailInfo.serverNo,
        submitServiceTime:this.submitServiceTime,
        workId:this.workId
      }
      data.submitServiceTime = this.formatDate(data.submitServiceTime)
      API.turnToAgentYiSubFile(data).then(res=>{
        if(res.code == 0){
          this.$Message.success('提交成功')
          this.submitServiceModal = false
          this.getDetailInfo()
        }
      })
    },
    submitTaxHandel(){
      if(this.submitTaxTime == ''){
        this.$Message.warning('提交税局时间不能为空')
        return;
      }
      let data = {
        serverNo:this.detailInfo.serverNo,
        submitTaxTime:this.submitTaxTime
      }
      data.submitTaxTime = this.formatDate(data.submitTaxTime)
      API.taxTime(data).then(res=>{
        if(res.code == 0){
          this.$Message.success('提交成功')
          this.submitTaxModal = false
          this.getDetailInfo()
        }
      })
    },
    todayTime(type){
      let time = new Date()
      if(type == 'service'){
        this.submitServiceTime = this.formatDate(time)
      }else if(type == 'tax'){
        this.submitTaxTime = this.formatDate(time)
      }
    },
    // 修改服务商分配编码
    confirmUpdateSupplierServiceID(){
      if(!this.detailInfo.serverNo){
        this.$Message.warning('当前工单没有服务号！')
        return false;
      }
      if(!this.supplierServiceID){
        this.$Message.warning('请填写服务商分配编码！')
        return false;
      }
      let params = {
        serverNo:this.detailInfo.serverNo,
        supplierAssignsServiceId:this.supplierServiceID,
      };
      API.updateSupplierAssignsServiceId(params)
      .then(res => {
        this.$Message.success('修改成功！')
        this.supplierServiceIDModal = false;
        this.supplierServiceID = '';
        this.getDetailInfo()
      })
      .catch(err=>{
        console.log(err)
      })
      .finally(()=>{
      })
    },
    sureBuShenBao() {
      if (this.orderNo1 == '') {
        this.$Modal.warning({
          title: '提示',
          content: '<p>客户尚未购买补申报服务，请联系销售通知客户购买补申报服务。</p>',
          okText: '我知道了',
        });
        return
      }
      if (this.suppleDeclStartTime != this.suppleDeclList[0].suppleDeclStartTime || this.suppleDeclEndTime != this.suppleDeclList[this.suppleDeclList.length - 1].suppleDeclEndTime) {
        this.errorMassage = true
        return
      }
      this.errorMassage = false
      if (this.isHebing == '') {
        this.errorMassage1 = true
        return
      }
      this.errorMassage1 = false
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认生成补申报工单，生成后不可修改，请确认！</p>',
        onOk: () => {
          this.suppleDeclStartTime = this.formatDate(this.suppleDeclStartTime, 'month')
          this.suppleDeclEndTime = this.formatDate(this.suppleDeclEndTime, 'month')
          let data = {
            suppleDeclStartTime: this.suppleDeclStartTime,
            suppleDeclEndTime: this.suppleDeclEndTime,
            isMergeSupple: this.isHebing,
            supplelDeclDateVoList: this.dataList,
            declarePeriod: this.declarePeriod,
            workId: this.tranferAgentInfo.id,
            upBeginTime: this.lastUpBeginTime,
            upEndTime: this.lastUpEndTime,
            orderNo: this.orderNo1
          }
          API.createSupperDeclTaxWorkOrder(data).then(res => {
            if (res.code == 0) {
              this.$Message.success('操作成功')
              this.buShenBaoModal = false
              this.getDetailInfo()
            }
          })
        }
      });
    },
    suppleDeclChange() {
      this.dataList = []
      this.suppleDeclStartTime = this.formatDate(this.suppleDeclStartTime, 'month')
      this.suppleDeclEndTime = this.formatDate(this.suppleDeclEndTime, 'month')
      let length = this.suppleDeclList.length - 1
      if (this.suppleDeclStartTime != this.suppleDeclList[0].suppleDeclStartTime || this.suppleDeclEndTime != this.suppleDeclList[this.suppleDeclList.length - 1].suppleDeclEndTime) {
        this.errorMassage = true
        return
      }
      this.errorMassage = false
      if (this.isHebing === '0') {
        this.dataList = this.suppleDeclList
        this.errorMassage1 = false
      } else if (this.isHebing === '1') {
        this.dataList.push({
          suppleDeclStartTime: this.suppleDeclList[0].suppleDeclStartTime,
          suppleDeclEndTime: this.suppleDeclList[length].suppleDeclEndTime
        })
        this.errorMassage1 = false
      }
    },
    buShenBaoModalHandel() {
      this.dataList = []
      API.geneSupperDeclParam({ workId: this.tranferAgentInfo.id }).then(res => {
        if (res.code == 0) {
          this.suppleDeclList = res.data.supplelDeclDateVoList
          this.lastUpBeginTime = res.data.upBeginTime
          this.lastUpEndTime = res.data.upEndTime
          if (res.data.orderNo == 0) {
            this.orderNo1 = ''
          } else {
            this.orderNo1 = res.data.orderNo
          }
          this.isHebing = res.data.isMergeSupple
          this.declarePeriod = res.data.declarePeriod
          this.suppleDeclStartTime = res.data.suppleDeclStartTime
          this.suppleDeclEndTime = res.data.suppleDeclEndTime
          this.buShenBaoModal = true
        }
      })
    },
    //提交EORI
    submitEori() {
      if (this.eoriForm.eoriNumber == '') {
        this.$Message.info('请填写EORI号')
        return
      }
      // if(this.eoriForm.eoriFile == ''){
      //   this.$Message.info('请上传EORI文件')
      //   return
      // }
      this.eoriForm.workId = this.tranferAgentInfo.id
      API.enterEoriNum(this.eoriForm).then(res => {
        if (res.code == 0) {
          this.eoriBox = false
          this.$Message.success('录入成功')
          this.getDetailInfo()
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
    sureUpdateStatus() {
      if (this.updateStatusData.status == '') {
        this.$Message.info('请先选择要更改的状态')
        return
      }
      this.updateStatusData.servicesId = this.id
      this.updateStatusData.workId = this.updateStatusObj.id
      // console.log(this.updateStatusData)
      API.updateShenbaoStatus(this.updateStatusData).then(res => {
        if (res.code == 0) {
          this.$Message.success('状态更改成功')
          this.updateStatus = false
          this.getDetailInfo()
        }
      })

    },
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
    getSupplierByCondition(countryCode) {
      API.supplierByCondition({
        countryCode,
        supplierType: 1,
      }).then(res => {
        this.SupplierByConditionList = res.data
        if (this.countryCode == 'ES') {
          this.supplierId = '44'
        }
        if (this.countryCode == 'DE') {
          this.supplierId = '45'
        }
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
          this.formerAgentTerminationAuthorizationLetter = res.data.transformProxyWorkOrder.formerAgentTerminationAuthorizationLetter
          this.orderNo = res.data.orderNo
          this.orderRemark = res.data.orderRemark
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
            this.workId = res.data.transformProxyWorkOrder.id
            this.tranferAgentInfo.declarePeriod = String(res.data.transformProxyWorkOrder.declarePeriod)
            this.tranferAgentInfo.declareRule = String(res.data.transformProxyWorkOrder.declareRule)
            this.tranferAgentInfo.taxRate = String(res.data.transformProxyWorkOrder.taxRate)
            let val = res.data.transformProxyWorkOrder
            this.tranferAgentInfo.shopNature = String(val.shopNature)
            this.tranferAgentInfo.certificateType = String(val.certificateType)
            this.tranferAgentInfo.isThereShop = String(val.isThereShop)
            this.tranferAgentInfo.needEoriNumber = String(val.needEoriNumber)
            this.tranferAgentInfo.companyRegisteredCapital = String(val.companyRegisteredCapital)
            this.tranferAgentInfo.companyType = String(val.companyType)
            this.tranferAgentInfo.isThereEoriNumber = String(val.isThereEoriNumber)
            this.tranferAgentInfo.isOtherGulfStateDutyOrServices = String(res.data.transformProxyWorkOrder.isOtherGulfStateDutyOrServices)
            if ((val.companyStockCondition) != '') {
              this.sharesList = JSON.parse(val.companyStockCondition)
            }
            if(this.detailInfo.countryCode === 'CZ' && val.companyType == 3){
              this.$set(this.tranferAgentInfo,'companyBusinessLicenseCopy',val.companyBusinessLicense)
            }else{
              this.$set(this.tranferAgentInfo,'companyBusinessLicenseCopy','')
            }
            if (this.detailInfo.countryCode === 'FR' && !this.tranferAgentInfo.formerAgentName) {
              this.allNotSub = true
            }
            if (this.detailInfo.countryCode == 'ES') {
              if (val.companyStockCondition != '') {
                this.stockGreaterThan25 = '0'
                this.sharesList = JSON.parse(val.companyStockCondition)
              }
            }
          }
          if((this.detailInfo.progressBar==20 || this.detailInfo.progressBar==21) && this.detailInfo.productFunctionCode == 2){
            API.canGeneSupperDecl({workId:this.tranferAgentInfo.id}).then(res=>{
              if(res.code==0){
                this.canGeneSupperDecl = res.data
              }
            })
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
          this.consoleOperationLogs = res.data.consoleOperationLogs
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    changeVatDate(date, item) {
      // this.tranferAgentInfo[item] = date;
    },

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
    downloadShuijinForms(row) {
      API1.getShuijinForms({
        workOrderId: row.id,
        userId: row.userId,
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != '{}') {
            window.open(res.data)
          }
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
    //点击预览文件
    previewFile(url) {
      window.open(url)
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
    //德国提交年报
    goAnnalsDE(row) {
      let beginTime = row.beginTime.slice(0, 7)
      let endTime = row.endTime.slice(0, 7)
      let baseData = {
        companyName: this.detailInfo.companyName,
        vatTaxNumber: this.detailInfo.vatTaxNumber,
        companyNameEn: this.detailInfo.companyNameEn,
        year: row.year,
        time: beginTime + '至' + endTime,
        endTime:endTime,
        beginTime:beginTime,
        productFunctionCode:this.detailInfo.productFunctionCode,
      }
      let detailsReturnData = {
        allTaxPrice: row.allTaxPrice,
        deductionPrice: row.deductionPrice,
        excludeTaxPrice: row.excludeTaxPrice
      }
      this.$emit('showAnnalsModal', row.id, baseData,detailsReturnData)
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
    downLoad($event, row) {
      let self = this;
      // if(this.spinShow){
      //   self.$Message.warning('资料已经下载，请勿重复点击');
      //   return
      // }
      // if(this.nowDownload){
      //   self.$Message.warning('资料正在下载，请稍后');
      //   return
      // }
      // this.nowDownload = true
      let formData = new FormData()
      if (row) {
        formData.append('workId', row.id)
      } else {
        if (this.detailInfo.countryCode === "GB" || this.detailInfo.countryCode === "ES") {
          formData.append('workId', this.workId)
        } else {
          formData.append('workOrderId', this.workId)
        }
      }
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      if (this.detailInfo.countryCode === "GB" || this.detailInfo.countryCode === "ES") {
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
          // self.spinShow = true
        } else {
          self.$Message.warning('下载出错！');
          // self.spinShow = false
          // self.nowDownload = false
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
    beroreEoriload() {
      let self = this;
      const check = self.eoriForm.eoriFile == "";
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
      } else if (type == 11) {
        //录入EORI文件
        this.eoriForm.eoriFile = file.response.data.fileUrl
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
      } else if (type == 10) {
        //录入EORI文件
        this.eoriForm.eoriFile = ''
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
    taxFileRecordModal(row) {
      this.taxFileModal = true
      this.rowData = row
      this.isRowBtn = true
    },
    //查看回执
    seeReceipt(e, id) {
      API1.downloadReceipt({
        workOrderId: id
      }).then(res => {
        if (res.code === 0) {
          window.open(res.data)
        }
      })
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
        // if (this.tableData[0].declareRule != 2) {
        //   if (this.receiptList.payLetterInvoiceReceipt == '') {
        //     this.$Message.info('请上传纳税付款发票信件')
        //     return
        //   }
        //   if (this.receiptList.paySystemInvoiceReceipt == '') {
        //     this.$Message.info('请上传纳税付款系统发票')
        //     return
        //   }
        // }
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
        if (this.rowData.status == 27 && this.rowData.countryCode === 'IT') {
          this.uploadDeclearAgain(params)
        } else {
          this.uploadDeclearFirst(params)
        }
        return
      }
      if (this.detailInfo.progressBar == 27) {
        this.uploadDeclearAgain(params)
      } else {
        this.uploadDeclearFirst(params)
      }
    },
    //上传申报回执
    uploadDeclearFirst(params) {
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
    //重新上传申报回执
    uploadDeclearAgain(params) {
      API.ITReSubmit(params).then((res) => {
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
    //确认上传缴税凭证
    sureUploadTax() {
      let certificateUrl = ''
      const self = this
      if (this.taxCertificate.length == 0) {
        this.$Message.info('请先上传缴税凭证')
        return
      }
      this.taxCertificate.map((v, i) => {
        if (i != self.taxCertificate.length - 1) {
          certificateUrl += v.response.data.fileUrl + ';'
        } else {
          certificateUrl += v.response.data.fileUrl
        }
      })
      let params = {
        certificateUrl: certificateUrl,
        workId: this.workId,
        // servicesId: this.detailInfo.orderServicesId
      }
      if (this.isRowBtn) {
        params.workId = this.rowData.id
      }
      API.uploadTaxNew(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('缴税凭证上传成功')
          this.taxFileModal = false
          if (this.isRowBtn) {
            this.getDetailInfo()
          } else {
            this.$emit('refresh')
          }
          this.$emit('refresh')
        } else {
          this.$Message.warning(res.message)
        }
      })
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
      if (this.countryCode === 'IT' || this.countryCode === 'FR') {
        this.finishAgentModal = true
        return
      }
      if (this.countryCode === 'PL') {
        this.finishAgentPLModal = true
        return
      }
      let con = this.canGeneSupperDecl ? '<p style="color:red;margin-top:10px;">提示：客户有需进行补申报的工单，请提醒客户及时购买补申报服务。</p>' : ''
      this.$Modal.confirm({
        title: '是否确认完成转代理',
        content: '<p>确认后不可修改，客户进入正常申报流程</p>' + con,
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
    },
    // 意大利完成转代理
    finishAgentBtn() {
      if (this.tranferAgentInfo.vatCertificateNew === '' && this.countryCode != 'FR') {
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
    //波兰完成转代理
    finishPLAgentBtn() {
      console.log(666)
      console.log(this.AgentPLForm)
      let data = { ...this.AgentPLForm }
      data.servicesId = this.id
      API.finishAgent(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    //下载转代理资料
    downloadTransfer() {
      let formData = new FormData()
      let self = this;
      if (this.spinShow) {
        self.$Message.warning('资料已经下载，请勿重复点击');
        return
      }
      if (this.nowDownload) {
        self.$Message.warning('资料正在下载，请稍后');
        return
      }
      this.nowDownload = true
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
          self.spinShow = true
        } else {
          self.$Message.warning('下载出错！');
          self.spinShow = false
          self.nowDownload = false
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
      if (this.detailInfo.countryCode === 'IT' && this.detailInfo.supplierId != 50) {
        if (this.needApiIT) {
          params.apiStatus = 1
          data.apiStatus = 1
        } else {
          params.apiStatus = 0
          data.apiStatus = 0
        }
      }
      if (this.detailInfo.countryCode === 'IT' && this.detailInfo.supplierId == 50) {
        params.apiStatus = 0
        data.apiStatus = 0
      }
      if (this.detailInfo.countryCode === 'FR') {
        if (this.needApiFR) {
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
        if (this.detailInfo.countryCode === 'FR' && this.isAudit == 1 && this.allNotSub) {
          this.$Message.info('请先完善资料并提交')
          return
        }
        if ((this.detailInfo.countryCode === 'DE' || this.detailInfo.countryCode === 'FR' || this.detailInfo.countryCode === 'ES') && this.supplierId === '' && this.isAudit == 1) {
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
      if (this.detailInfo.countryCode === 'IT' && this.detailInfo.supplierId != 50) {
        if (this.needApiIT) {
          params.apiStatus = 1
          data.apiStatus = 1
        } else {
          params.apiStatus = 0
          data.apiStatus = 0
        }
      }
      if (this.detailInfo.countryCode === 'IT' && this.detailInfo.supplierId == 50) {
        params.apiStatus = 0
        data.apiStatus = 0
      }
      if (this.detailInfo.countryCode === 'FR') {
        if (this.needApiFR) {
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
        if (this.rowData.countryCode === 'DE' && this.supplierId === '') {
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
      this.$refs["tranferAgentInfo"].validate(valid => {
        if (valid) {
          let params = { ...this.tranferAgentInfo }
          if (params.shopNature == 1) {
            this.sharesList.map((item, index) => {
              this.sharesList[index].shareholderBirthday = this.formatDate(item.shareholderBirthday)
            })
            params.companyStockCondition = JSON.stringify(this.sharesList)
          }
          params.upBeginTime = this.formatDate(this.tranferAgentInfo.upBeginTime)
          params.upEndTime = this.formatDate(this.tranferAgentInfo.upEndTime)
          params.taxEffectiveDate = this.formatDate(this.tranferAgentInfo.taxEffectiveDate)
          if (this.countryCode == 'FR') params.companyNameEn = params.companyNameEn.toUpperCase()
          params.companyRegisterData = this.formatDate(this.tranferAgentInfo.companyRegisterData)
          params.companyLegalPersonBirthday = this.formatDate(this.tranferAgentInfo.companyLegalPersonBirthday)
          params.thresholdValueTime = this.formatDate(this.tranferAgentInfo.thresholdValueTime)
          params.gatewayLastLoginDate = this.formatDate(this.tranferAgentInfo.gatewayLastLoginDate)
          params.registerTaxDate = this.formatDate(this.tranferAgentInfo.registerTaxDate)
          params.orderServicesId = this.id
          if (this.countryCode == 'ES') {
            if (this.stockGreaterThan25 == '0') {
              params.companyStockCondition = JSON.stringify(this.sharesList)
            } else {
              params.companyStockCondition = ''
            }
          }
          // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
          if(this.countryCode == 'CZ' && this.tranferAgentInfo.companyType == 3){
            params.companyBusinessLicense = this.tranferAgentInfo.companyBusinessLicenseCopy;
          }
          console.log('提交参数：',params)
          API1.submitAgent(params).then(res => {
            if (res.code === 0) {
              this.$Message.success('提交成功')
              this.$emit('refresh')
            }
          })
        } else {
          this.$Message.error("请填写完整信息");
        }
      })

    },
    //保存转代理资料
    saveForm() {
      let params = { ...this.tranferAgentInfo }
      if (params.shopNature == 1) {
        this.sharesList.map((item, index) => {
          this.sharesList[index].shareholderBirthday = this.formatDate(item.shareholderBirthday)
        })
        params.companyStockCondition = JSON.stringify(this.sharesList)
      }
      params.upBeginTime = this.formatDate(this.tranferAgentInfo.upBeginTime)
      params.upEndTime = this.formatDate(this.tranferAgentInfo.upEndTime)
      params.taxEffectiveDate = this.formatDate(this.tranferAgentInfo.taxEffectiveDate)
      if (this.countryCode == 'FR' && params.companyNameEn) params.companyNameEn = params.companyNameEn.toUpperCase()
      params.companyRegisterData = this.formatDate(this.tranferAgentInfo.companyRegisterData)
      params.companyLegalPersonBirthday = this.formatDate(this.tranferAgentInfo.companyLegalPersonBirthday)
      params.thresholdValueTime = this.formatDate(this.tranferAgentInfo.thresholdValueTime)
      params.gatewayLastLoginDate = this.formatDate(this.tranferAgentInfo.gatewayLastLoginDate)
      params.registerTaxDate = this.formatDate(this.tranferAgentInfo.registerTaxDate)
      params.orderServicesId = this.id
      if (this.countryCode == 'ES') {
        if (this.stockGreaterThan25 == '0') {
          params.companyStockCondition = JSON.stringify(this.sharesList)
        } else {
          params.companyStockCondition = ''
        }
      }
      // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
      if(this.countryCode == 'CZ' && this.tranferAgentInfo.companyType == 3){
        params.companyBusinessLicense = this.tranferAgentInfo.companyBusinessLicenseCopy;
      }
      console.log('保存参数：',params)
      API1.saveAgent(params).then(res => {
        if (res.code === 0) {
          this.$Message.success('保存成功')
        }
      })
    },
    //时间格式转换
    formatDate(date, type) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        if (type == "month") {
          return y + "-" + m;
        }
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
            that.getDetailInfo()
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
    hasAuthFun(detailInfo) {
      let that = this
      API1.ifAuth({
        serviceId: detailInfo.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            that.hasAuth = true
            that.getVatObligations()
            that.$store.commit('hasAuth', {
              vatTaxNumber: detailInfo.vatTaxNumber,
              auth: true
            })
          } else {
            that.hasAuth = false
            that.getwayFun(detailInfo)
          }
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
            this.$Message.info('该公司还没授权，请点击授权报税按钮进行授权')
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
    //去报税
    goToDeclare(row) {
      // 选择报税区间
      this.startTax = false
      var declareInfo = { ...this.detailInfo, ...this.tableData, ...row }
      this.$store.commit('getDeclareInfo', declareInfo)
      this.$emit('showTaxModal', this.tableData[0].id, this.id, declareInfo)
    },
    goToDeclareDetail(row) {
      console.log(row)
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
    lookReason(type, row, clickType) {
      this.resonModelFR = true
      this.declareRow = row
      if (type == 1) {
        this.resonModelTitle = '重新提交'
      } else if (type == 2) {
        this.resonModelTitle = '扣款失败原因'
      }
      if (clickType === 'isDeclareInfo') {
        this.isDeclareInfo = true
      } else {
        this.isDeclareInfo = false
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
      let data = { workId: '' }
      if (this.isDeclareInfo) {
        data.workId = this.declareInfo.id
      } else {
        data.workId = this.declareRow.id
      }
      API.frReSubmit(data).then(res => {
        this.resonModelFR = false
      })
    },
    //德国生成年报工单
    creatAnnalsFun() {
      let data = { serviceId: this.detailInfo.id }
      APIDE.creatAnnalsApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('生成年报成功')
          this.getDetailInfo()
        }
      })
    },
    //获取德国年报工单详情
    getDEyearDetailFun(row) {
      this.thatDEinfo = {
        year: row.year,
        beginTime: row.beginTime,
        endTime: row.endTime,
        declareReceipt: row.declareReceipt
      }
      this.deYearDetail = true
      let data = { workId: row.id }
      APIDE.deAnnalsApiDetail(data).then(res => {
        if (res.code === 0) {
          this.deAnnalsData = res.data
        }
      })
    },
    // 审核 审核申报 弹窗
    auditDeclareSubmit(name) {
      if (this.isRowBtnAuditDeclare) {
        this.auditForm.workId = this.rowDataAuditDeclare.id
      } else {
        this.auditForm.workId = this.tableData[0].id
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          API1.auditTaxWorkOrder(this.auditForm).then(res => {
            if (res.code === 0) {
              this.$Message.success('操作成功');
              this.$emit('refresh')
            }
          }).catch(error => {
            console.log(error)
          })
        } else {

        }
      })
    },
    //提交申报
    submitDeclare() {
      let params = {}
      params = {
        workId: this.workId,
        allTaxPrice: this.declareInfo.taxTotal,
        deductionPrice: this.declareInfo.deductionPrice,
        excludeTaxPrice: this.declareInfo.excludeTaxAmtTotal,
        taxAmtTotal: this.declareInfo.taxAmtTotal,
        includTaxPrice: this.declareInfo.includTaxAmtTotal,
        listTaxDeductionItem: this.deductionInfo.listTaxDeductionItemp[0],
        sellFile: this.declareInfo.saleFileUrl,
        declareRule: this.declareInfo.declareRule,
        taxRate: this.declareInfo.taxRate,
        serviceId: this.id,
        otherIncludTaxAmt: this.declareInfo.otherIncludTaxAmt,
        otherSaleFileUrl: this.declareInfo.otherSaleFileUrl
      }
      // console.log('params', params)
      // console.log('this.declareInfo', this.declareInfo)
      API.submitDeclareNew(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          this.$emit('refresh')
        } else {
          // this.$Message.warning(res.message)
        }
      })
    },
    // 修改抵扣明细
    editDeduction(row) {
      this.deductionForm = JSON.parse(JSON.stringify(row))
      this.editDeductionModal = true
    },
    beforeUploadHandlerDeductionFile(file) {
      let self = this;
      const check = self.deductionForm.deductionFile == '';
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    successHandlerDeductionFile(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.deductionForm.deductionFile = res.data.fileUrl;
      this.deductionForm.fileOriginalName = res.data.origFileName;
    },
    removeHandlerDeductionFile(file, fileList, item) {
      this.deductionForm.deductionFile = "";
      this.deductionForm.fileOriginalName = '';
    },
    changeBillDate(val) {
      this.deductionForm.billDate = val
    },
    deductionFormSubmit(type) {
      if (this.deductionForm.deductionType === '') {
        this.$Message.error('请选择抵扣类型')
        return
      }
      if (this.deductionForm.billDate === '') {
        this.$Message.error('请选择单据日期')
        return
      }
      if (this.deductionForm.deductiontAmt === '') {
        this.$Message.error('请输入抵扣金额')
        return
      }
      if (this.deductionForm.deductionFile === '') {
        this.$Message.error('请上传抵扣凭证')
        return
      }
      this.deductionForm.billDate = this.formatDate(this.deductionForm.billDate)
      let data = { ...this.deductionForm, ...{ taxWorkId: this.workId } }
      if (type === 1) {
        API1.taxDeductionItem(data).then(res => {
          if (res.code === 0) {
            this.$Message.success('修改成功')
            this.editDeductionModal = false
            this.getDetailInfo()
          }
        }).catch(error => {
          console.log(error)
        })
      } else if (type === 2) {
        API1.taxDeleteDeductionItem(data).then(res => {
          if (res.code === 0) {
            this.$Message.success('删除成功')
            this.editDeductionModal = false
            this.getDetailInfo()
          }
        }).catch(error => {
          console.log(error)
        })
      }

    },
    // 申报驳回后 重新提交申报
    resubmissionDeclaration($event, row) {
      let params = {}
      if (row && row !== undefined) {
        params = {
          workId: row.id,
          allTaxPrice: row.allTaxPrice,
          declareRule: row.declareRule,
          deductionPrice: row.deductionPrice,
          deductionB2bPrice: row.deductionB2bPrice,
          excludeTaxPrice: row.excludeTaxPrice,
          taxAmtTotal: row.taxAmtTotal,
          includTaxPrice: row.includTaxPrice,
          isShop: row.isShop,
          listTaxDeductionItem: row.listTaxDeductionItem,
          sellFile: row.sellFile,
          taxRate: row.taxRate,
          serviceId: row.orderServicesId,
          otherIncludTaxAmt: row.otherIncludTaxAmt,
          otherSaleFileUrl: row.otherSaleFileUrl
        }
      } else {
        params = {
          workId: this.workId,
          allTaxPrice: this.declareInfo.allTaxPrice,
          declareRule: this.declareInfo.declareRule,
          deductionPrice: this.declareInfo.deductionPrice,
          deductionB2bPrice: this.declareInfo.deductionB2bPrice,
          excludeTaxPrice: this.declareInfo.excludeTaxPrice,
          taxAmtTotal: this.declareInfo.taxAmtTotal,
          includTaxPrice: this.declareInfo.includTaxPrice,
          isShop: this.declareInfo.isShop,
          listTaxDeductionItem: this.deductionInfo,
          sellFile: this.declareInfo.sellFile,
          taxRate: this.declareInfo.taxRate,
          serviceId: this.id,
          otherIncludTaxAmt: this.declareInfo.otherIncludTaxAmt,
          otherSaleFileUrl: this.declareInfo.otherSaleFileUrl
        }
      }
      this.$Modal.confirm({
        title: '是否重新提交申报',
        onOk: () => {
          API.submitDeclareNew(params).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.$emit('refresh')
            }
          })
        },
        onCancel: () => {

        }
      });
    },
    auditDeclareModalFun(row) {
      this.auditDeclareModal = true
      this.isRowBtnAuditDeclare = true
      this.rowDataAuditDeclare = JSON.parse(JSON.stringify(row))
    },
    supplierSelectFun(val) {
      let that = this
      API1.updateSupplier({
        supplierId: val,
        workId: this.tranferAgentInfo.id
      }).then(res => {
        console.log('res', res)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.country-list {
  display: flex;
  font-size: 16px;
  margin-top: 5px;
  .country-list-left {
    width: 176px;
  }
}
/deep/ .ivu-form-item-required{
  .ivu-form-item-label:before{
    content:'' !important;
  }
}
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
    .operationLogs {
      .logsContent {
        font-size: 12px;
      }
      .itemTop {
        font-weight: bold;
      }
      .itemBottom {
        margin-bottom: 10px;
        border-bottom: 1px #f2f2f2 dashed;
        padding-bottom: 5px;
      }
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
    content: "*" !important;
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
  max-height: 300px;
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
  width: 135px;
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
.wrap{
  word-break: break-all;
}
.editIcon{
  margin-left:10px;
  font-size:20px;
  color:#2D8cF0;
  cursor:pointer;
}
</style>
