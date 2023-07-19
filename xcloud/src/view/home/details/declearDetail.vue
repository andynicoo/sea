<template>
  <div class="waitUploadWrapper">
    <div class="back"
         @click="goBack()">
      <Icon type="md-arrow-back" />返回列表
    </div>
    <div class="content">
      <div class="content-l">
        <Card>
          <p slot="title"
             class="declareFileBox">
            <span>申报资料</span>
            <span>
              <span class="btnArea view"
                    v-if="progressBar >= 20 && progressBar <=27">
                <Button @click="viewInformationModal = true">查看注册信息</Button>
                <Button type="primary"
                        style="margin-left:10px;"
                        v-if="detailInfo.countryCode === 'GB'  && !isAuth"
                        v-show="hasAuthority('work_order_list07')"
                        @click="startTaxFun(detailInfo)">授权报税</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 19">
                <!-- <Button type="primary" ghost @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px;">发送提醒</Button>   -->
                <Button type="primary"
                        @click="fileTaxModal=true"
                        v-if="detailInfo.taxType==1">填写报税信息</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 20">
                <Button type="primary"
                        ghost
                        @click="sendMessage(detailInfo.progressBar)"
                        style="margin-right:10px ;">发送提醒</Button>
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
                        @click="caculateTax">计算税金</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 18">
                <Button type="primary"
                        @click="downLoadDeclare"
                        ghost
                        style="margin-right:10px;">下载申报资料</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode == 'SA'"
                        @click="invoicaBoxShow=true">录入发票号</Button>
                <Button v-if="detailInfo.countryCode == 'AE'"
                        type="primary"
                        @click="gibanBox=true">录入GIBAN</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 29">
                <!-- <Button type="primary" ghost @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px;">发送提醒</Button>                             -->
                <Button type="primary"
                        v-show="hasAuthority('work_order_list13')"
                        @click="finishAgent">完成转代理</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 25">
                <Button type="primary"
                        @click="downLoadDeclare"
                        ghost
                        style="margin-right:10px;"
                        v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'">下载申报资料</Button>
                <Button type="primary"
                        v-if="detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'DE'"
                        @click="uploadReceiptModal=true">上传回执</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 22">
                <Button type="primary"
                        @click="downLoadDeclare"
                        ghost
                        style="margin-right:10px;"
                        v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'">下载申报资料</Button>
                <Button type="primary"
                        @click="taxFileModal=true"
                        v-if="tableData.length!=0 &&tableData[0].declareRule==2">上传零申报凭证</Button>
                <Button type="primary"
                        @click="taxFileModal=true"
                        v-show="hasAuthority('work_order_list10')"
                        v-else>上传缴税凭证</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 33">
                <Button type="primary"
                        @click="auditModal=true">审核</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 34 && detailInfo.countryNameZh === '意大利'">
                <Button type="primary"
                        @click="downLoadDeclare"
                        ghost
                        style="margin-right:10px;">下载申报资料</Button>
                <Button type="primary"
                        @click="taxFileModal=true"
                        v-show="hasAuthority('work_order_list10')">上传缴税凭证</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.progressBar == 35">
                <Button type="primary"
                        @click="downLoadDeclare"
                        ghost
                        style="margin-right:10px;"
                        v-if="detailInfo.countryNameZh != '西班牙'&&detailInfo.countryNameZh != '法国'">下载申报资料</Button>
                <Button type="primary"
                        @click="taxFileModal=true"
                        v-show="hasAuthority('work_order_list10')">上传缴税凭证</Button>
              </span>
              <span class="btnArea"
                    v-if="detailInfo.countryNameZh  == '德国'">
                <Button type="primary"
                        @click="creatAnnalsFun"
                        ghost
                        style="margin-left:10px;">生成年报工单</Button>
              </span>
            </span>
          </p>
          <div class="basicInfo">
            <Form ref="submitForm"
                  :model="submitForm"
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
                      @click="lookReason(1,'','isDeclareInfo')">【重新提交】</span>
                <span style="cursor:pointer;"
                      v-if="declareInfo.declarationStatus==2"
                      @click="lookReason(2,'','isDeclareInfo')">【查看原因】</span>
              </FormItem>
              <FormItem label="当前申报次数：">
                <span>{{detailInfo.declareCout}}</span>
              </FormItem>
              <FormItem label="当前申报区间：">
                <span v-if="tableData.length!=0">{{tableData[0].beginTime.substring(0,7)}}至{{tableData[0].endTime.substring(0,7)}}</span>
                <span v-else>{{detailInfo.nextDeclareTime}}</span>
              </FormItem>
              <FormItem label="申报回执："
                        v-if="tableData.length!=0">
                <Button v-if="tableData[0].declareReceipt == '' && detailInfo.progressBar == 25"
                        type="primary"
                        @click="uploadReceiptModal=true">点击上传</Button>
                <div v-else-if="tableData[0].declareReceipt != ''">
                  <a target="_blank"
                     v-for="(item,index) in tableData[0].declareReceipt.split(';')"
                     :href="item"
                     style="margin-right:5px;"
                     :key="index">{{"申报回执"}}</a>
                </div>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="扣款回执："
                        v-if="detailInfo.countryCode === 'IT' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)">
                <a @click="previewDebit"
                   v-if="detailInfo.debitReceipt != 0">{{"扣款回执"}}</a>
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
          <div class="declareData"
               v-if="detailInfo.progressBar == 21 || detailInfo.progressBar == 22 || detailInfo.progressBar == 25 || detailInfo.progressBar == 26 || detailInfo.progressBar == 27">
            <p>申报数据：</p>
            <Form ref="declareInfo"
                  :model="declareInfo"
                  :label-width=120>
              <FormItem label="含税销售额：">
                <Input :disabled="detailInfo.progressBar!=21"
                       placeholder="请输入含税销售额"
                       number
                       v-model="declareInfo.includTaxPrice"
                       style="width:300px;" />
              </FormItem>
              <FormItem label="不含税销售额：">
                <Input :disabled="detailInfo.progressBar!=21"
                       placeholder="请输入不含税销售额"
                       number
                       v-model="declareInfo.excludeTaxPrice"
                       style="width:300px;" />
              </FormItem>
              <FormItem label="销项税额：">
                <Input :disabled="detailInfo.progressBar!=21"
                       placeholder="请输入抵扣税金"
                       v-model="declareInfo.allTaxPrice"
                       style="width:300px;" />
              </FormItem>
              <FormItem label="抵扣总金额：">
                <Input :disabled="detailInfo.progressBar!=21"
                       placeholder="请输入抵扣税金"
                       v-model="declareInfo.deductionPrice"
                       style="width:300px;" />
              </FormItem>
              <FormItem label="最终缴纳税金：">
                <Input :disabled="detailInfo.progressBar!=21"
                       placeholder="请输入缴纳税金"
                       v-model="declareInfo.allTaxPrice"
                       style="width:300px;" />
              </FormItem>
              <FormItem label="税金缴纳凭证："
                        v-if="detailInfo.progressBar == 25 || detailInfo.progressBar == 27">
                <div v-if="declareInfo.taxCertificate != ''">
                  <a target="_blank"
                     v-for="(item,index) in declareInfo.taxCertificate"
                     :key="index"
                     :href="item"
                     style="margin-right:5px;">{{"缴税凭证"}}</a>
                </div>
              </FormItem>
              <FormItem label="抵扣明细：">
                <Table :data='deductionInfo'
                       :columns='columns1'>
                  <template slot="deductionType"
                            slot-scope="{ row }">
                    <span>{{row.deductionType == '1' ? '进口增值税抵扣' : row.deductionType == '2' ? '发票抵扣' : row.deductionType == '3' ? '其他' : ''}}</span>
                  </template>
                  <template slot="deductFile"
                            slot-scope="{ row }">
                    <a :href="row.deductionFile"
                       target="_blank">{{row.fileOriginalName}}</a>
                  </template>
                </Table>
              </FormItem>
            </Form>
          </div>
        </Card>
        <Card style="margin-top:10px;"
              v-if="detailInfo.countryCode === 'DE'">
          <p slot="title">年度申报</p>
          <Table :loading="deYearLoading"
                 :columns="deYearColumns"
                 :data="deYearData">
            <template slot="operation"
                      slot-scope="{row}">
              <div>
                <span v-if="row.status==21"
                      style="cursor:pointer;"
                      @click="goAnnalsDE(row)">【提交申报】</span>
                <span v-if="row.status==27&&row.declareReceipt!=''">
                  <a :href="row.declareReceipt"
                     target="_blank">【查看回执】</a>
                </span>
                <span @click="getDEyearDetailFun(row)"
                      style="cursor:pointer;">【详情】</span>
              </div>
            </template>
          </Table>
        </Card>
        <Card style="margin-top:10px;">
          <p slot="title">历史申报记录</p>
          <Table :loading="tableLoading"
                 :columns="columns"
                 :data="tableData">
            <template slot="lookData"
                      slot-scope="{row}">
              <div>
                <span v-if="row.status==25||row.status==27"
                      style="cursor:pointer;color:#2D8cF0;"
                      @click="taxModal=true;taxBaseData=row">点击查看</span>
              </div>
            </template>
            <template slot="operate"
                      slot-scope="{ row }">
              <div style="cursor: pointer;"
                   v-if="row.countryCode === 'GB' && row.status === 21"
                   @click="goToDeclare(row)">【去报税】</div>
              <div v-if="row.taxCertificate.length !== 0 && row.declareRule !=2 ">
                <a style="display:block;"
                   v-for="(item, index) in row.taxCertificate"
                   :key="index"
                   :href="item"
                   target="_blank">缴税凭证</a>
              </div>
              <div v-if="row.taxCertificate.length !== 0 &&row.declareRule ==2 ">
                <a style="display:block;"
                   v-for="(item, index) in row.taxCertificate"
                   :key="index"
                   :href="item"
                   target="_blank">零申报凭证</a>
              </div>
              <div v-if="row.countryCode == 'SA' && row.status === 18"
                   style="cursor: pointer;"
                   @click="entryInvoice(row)">【录入发票号】</div>
              <div v-if="row.countryCode == 'AE' && row.status === 18"
                   style="cursor: pointer;"
                   @click="entryGIBAN(row)">【录入GIBAN】</div>
              <div style="cursor: pointer;color: #2D8cF0;"
                   v-if="row.countryCode === 'GB' && row.status > 21"
                   @click="getLink(row)">英国申报回执</div>
              <a style="cursor: pointer;color: rgb(45, 140, 240);4"
                 v-if="row.countryCode === 'DE' && row.status > 21 && row.declareReceipt !==''"
                 :href="row.declareReceipt"
                 target="_blank">德国申报回执</a>
              <div style="cursor: pointer;"
                   @click="caculateTax(row)"
                   v-if="row.status === 21 && row.countryCode !== 'GB'">【去报税】</div>
              <div style="cursor: pointer;"
                   @click="taxFileRecordModal(row)"
                   v-if="(row.status === 22 || row.status === 34 || row.status === 35) ">【上传缴税凭证】</div>
              <div style="cursor: pointer;"
                   @click="uploadReceiptModalFun(row)"
                   v-if="row.status === 25 && ( row.countryCode !== 'GB' && row.countryCode !== 'DE')">【上传回执】</div>
              <div style="cursor: pointer;"
                   @click="auditFun(row)"
                   v-if="row.status === 33">【审核】</div>
              <div style="cursor: pointer;"
                   @click="lookReason(1,row)"
                   v-if="row.declarationStatus === 3">【重新提交】</div>
              <div style="cursor: pointer;"
                   @click="lookReason(2,row)"
                   v-if="row.declarationStatus === 2">【查看原因】</div>
            </template>
            <template slot="declareRule"
                      slot-scope="{ row }">
              <span>{{row.declareRule == '0' ? '目的国' : row.declareRule == '1' ? '发出国' :row.declareRule == '2' ? '零申报' : ''}}</span>
            </template>
            <template slot="status"
                      slot-scope="{ row }">
              <span>{{row.status==0?'待上传资料':row.status==1?'待审核资料':row.status==2?'待续费':row.status==3?'注册中':row.status==4?'注册完成':row.status==5?'待授权海牙认证':row.status==6?'海牙认证中':row.status==7?'待授权注册':row.status==8?'资料驳回':row.status==19?'等待申报中':row.status==20?'等待申报中':row.status==21?'待提交报税资料':row.status==18?'申报中':row.status==22?'待缴纳税金':row.status==25?'申报完成':row.status==27?'申报完成':row.status==26?'申报失败':row.status==28?'待上传资料':row.status==29?'转代理中':row.status==31?'待审核转代理资料':row.status==32?'转代理资料驳回':row.status==33?'税金待审核':row.status==34?'缴税凭证被驳回':row.status==35?'待上传零申报凭证':row.status==36?'待授权海牙认证':row.status==37?'海牙认证中':row.status==38?'待授权转代理':row.status==51?'待上传资料':row.status==52?'待审核':row.status==53?'注销中':row.status==54?'已完成':row.status==55?'资料驳回':row.status==56?'注销失败':'暂无'}}</span>
            </template>
          </Table>
          <!-- <Page
                                @on-change="changePageHandler"
                                :current="pageInfo.page"
                                :total="listTotal"
                                :page-size="pageInfo.pageSize"
                                show-total
                                show-elevator
                            /> -->
        </Card>
      </div>
      <div class="content-r">
        <Card v-if="progressBar >= 20 && progressBar <=27">
          <p slot="title">
            <span>税号信息</span>
            <span @click="editTaxInfo(detailInfo)"
                  style="float:right;font-weight: 400;margin-top: 2px;cursor: pointer;">【修改税号信息】</span>
          </p>
          <Form :label-width=100
                v-if="JSON.stringify(detailInfo) != '{}'">
            <FormItem label="VAT税号：">
              <span>{{detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber: "暂无"}}</span>
            </FormItem>
            <FormItem label="EORI号："
                      v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
              <span>{{detailInfo.eoriNumber ? detailInfo.eoriNumber: "暂无"}}</span>
            </FormItem>
            <FormItem label="税号下发日期：">
              <span>{{detailInfo.taxIssueDate.substring(0,10)}}</span>
            </FormItem>
            <FormItem label="税号生效日期：">
              <span>{{detailInfo.taxEffectiveDate.substring(0,10)}}</span>
            </FormItem>
            <FormItem label="申报周期：">
              <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报' : detailInfo.periodType == -1 ? '暂无' : ''}}</span>
            </FormItem>
            <FormItem label="申报国家：">
              <span>{{detailInfo.countryNameZh}}</span>
            </FormItem>
            <!-- 德国 -->
            <FormItem label="VAT税号文件："
                      v-if="detailInfo.countryCode === 'DE'">
              <span v-if="detailInfo.vatTaxNumberFile!==''">
                <a :href="detailInfo.vatTaxNumberFile"
                   target="_blank">{{"VAT税号文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="DE欧盟证书："
                      v-if="detailInfo.countryCode === 'DE'">
              <span v-if="detailInfo.deEuCertificate!==''">
                <a :href="detailInfo.deEuCertificate"
                   target="_blank">{{"DE欧盟证书"}}</a>
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
            <FormItem label="EORI文件："
                      v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
              <span v-if="detailInfo.eoriNumberFile!==''">
                <a :href="detailInfo.eoriNumberFile"
                   target="_blank">{{"EORI文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="VAT证书："
                      v-if="detailInfo.countryCode !== 'DE' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
              <span v-if="detailInfo.vatCertificate!==''">
                <a :href="detailInfo.vatCertificate"
                   target="_blank">{{"VAT证书"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
            </FormItem>
            <FormItem label="gateway 账号："
                      v-if="detailInfo.countryCode=='GB'">
              <span v-if="detailInfo.gatewayId !== ''">{{detailInfo.gatewayId}}</span>
              <span v-else>
                <span>暂无</span>
                <!-- <span class="addGetWatId"
                        @click="getWayModal = true">点击填写</span> -->
              </span>
            </FormItem>
            <FormItem label="gateway 密码："
                      v-if="detailInfo.countryCode=='GB'">
              <span v-if="detailInfo.gatewayPassword">{{detailInfo.gatewayPassword}}</span>
              <span v-else>暂无</span>
            </FormItem>
            <FormItem label="税局账号："
                      v-if="detailInfo.countryCode=='SA' || detailInfo.countryCode=='AE'">
              <span v-if="detailInfo.gatewayId !== ''">{{detailInfo.gatewayId}}</span>
              <span v-else>
                <span>暂无</span>
              </span>
            </FormItem>
            <FormItem label="密码："
                      v-if="detailInfo.countryCode=='SA' || detailInfo.countryCode=='AE'">
              <span v-if="detailInfo.gatewayPassword">{{detailInfo.gatewayPassword}}</span>
              <span v-else>暂无</span>
            </FormItem>
            <FormItem label="海牙文件："
                      v-if="detailInfo.countryCode=='ES'">
              <span v-if="detailInfo.hyFile!==''">
                <a :href="detailInfo.hyFile"
                   target="_blank">{{"海牙文件"}}</a>
              </span>
              <span v-else>{{'暂无'}}</span>
              <!-- <span @click="enterHaugeInfo=true"
                      style="margin-left:10px;cursor:pointer;">{{detailInfo.hyFile==''?'点击上传':'重新上传'}}</span> -->
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
              <span>{{ detailInfo.productFunctionCode == '1' ? "税号注册" : detailInfo.productFunctionCode == '2' ? "税务申报" : detailInfo.productFunctionCode == '3' ? "税务补缴" : detailInfo.productFunctionCode == '4' ? "转代理" : detailInfo.productFunctionCode == '5' ? "注册+申报" :''}}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{detailInfo.countryNameZh}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{detailInfo.createTime}}</span>
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
      <Modal v-model="auditModal"
             @on-visible-change="modalState"
             :title="detailInfo.progressBar==1?'审核资料':'审核税金到账'">
        <p>{{detailInfo.progressBar==1?'审核通过后开始提交注册':'是否确认用户税金到账？'}}</p>
        <p>
          <RadioGroup v-model="isAudit">
            <Radio label="1">
              <span>{{detailInfo.progressBar==1?'审核通过':'确认到账'}}</span>
            </Radio>
            <Radio label="0">
              <span>{{detailInfo.progressBar==1?'资料不对，驳回':'税金有误，驳回'}}</span>
            </Radio>
          </RadioGroup>
        </p>
        <p v-show="isAudit=='0'">
          <Input v-model="remark"
                 type="textarea"
                 placeholder="请输入驳回原因" />
        </p>
        <div v-if="detailInfo.countryCode=='IT'">
          <Checkbox v-model="needApiIT">API提交注册申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="detailInfo.countryCode=='FR'&&detailInfo.progressBar==33"
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

          <Button v-if="isRowBtn"
                  type="primary"
                  @click="rowSureAudit">确认</Button>
          <Button v-else
                  type="primary"
                  @click="sureAudit">确认</Button>
        </p>
      </Modal>
      <Modal v-model="taxNumModal"
             title="录入税号">
        <Form :label-width="130">
          <FormItem label="VAT税号："
                    class="requiredItem">
            <Input v-model="addTaxNum.vatTaxNumber"
                   placeholder="请输入VAT税号"
                   @on-blur="changeEORI"
                   style="width:200px" />
          </FormItem>
          <FormItem label="税号下发日期："
                    class="requiredItem">
            <DatePicker @on-change="changeTax1"
                        v-model="addTaxNum.taxIssueDate"
                        type="date"
                        placeholder="请选择税号下发日期"
                        style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="税号生效日期："
                    class="requiredItem">
            <DatePicker @on-change="changeTax2"
                        v-model="addTaxNum.taxEffectiveDate"
                        type="date"
                        placeholder="请选择税号生效日期"
                        style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="EORI号："
                    v-if="detailInfo.countryNameZh != '沙特'">
            <Input v-model="addTaxNum.eoriNumber"
                   placeholder="请输入EORI号"
                   :disabled="eoriDisabled"
                   style="width:200px" />
          </FormItem>
          <FormItem label="VAT税号文件：">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="VAT证书："
                    v-if="detailInfo.countryNameZh != '德国'&& detailInfo.countryNameZh != '意大利' && detailInfo.countryNameZh != '沙特' && detailInfo.countryNameZh != '阿联酋'&& detailInfo.countryNameZh != '西班牙'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatCertificate')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatCertificate')}">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="欧盟证书："
                    v-if="detailInfo.countryNameZh=='德国'||detailInfo.countryNameZh=='西班牙'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'deEuCertificate')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'deEuCertificate')}">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="税务副本："
                    v-if="detailInfo.countryNameZh=='德国'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberCopyFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberCopyFile')}">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="EORI文件："
                    v-if="detailInfo.countryNameZh != '沙特'&&detailInfo.countryNameZh != '阿联酋'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'eoriNumberFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'eoriNumberFile')}">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="gateway 账号："
                    v-if="detailInfo.countryNameZh=='英国'">
            <Input v-model="addTaxNum.gatewayId"
                   placeholder="请输入gateway 账号"
                   style="width:200px" />
          </FormItem>
          <FormItem label="gateway 密码："
                    v-if="detailInfo.countryNameZh=='英国'">
            <Input v-model="addTaxNum.gatewayPassword"
                   placeholder="请输入密码"
                   style="width:200px" />
          </FormItem>
          <div v-if="detailInfo.countryNameZh == '沙特' || detailInfo.countryNameZh == '阿联酋'">
            <FormItem label="税局账号（选填）：">
              <Input v-model="addTaxNum.gatewayId"
                     placeholder="请输入税局账号"
                     style="width:200px" />
            </FormItem>
            <FormItem label="密码（选填）：">
              <Input v-model="addTaxNum.gatewayPassword"
                     placeholder="请输入密码"
                     style="width:200px" />
            </FormItem>
          </div>
        </Form>
        <p slot="footer">
          <Button @click="cancelEnter">取消</Button>
          <Button type="primary"
                  @click="enterTaxNumInfo">提交</Button>
        </p>
      </Modal>
      <Modal v-model="editTaxNumModal"
             title="修改税号信息">
        <Form :label-width="130">
          <FormItem label="VAT税号："
                    class="requiredItem">
            <Input v-model="addTaxNum.vatTaxNumber"
                   placeholder="请输入VAT税号"
                   style="width:200px"
                   :disabled="true" />
          </FormItem>
          <FormItem label="税号下发日期："
                    class="requiredItem">
            <DatePicker @on-change="changeTax1"
                        v-model="addTaxNum.taxIssueDate"
                        type="date"
                        placeholder="请选择税号下发日期"
                        style="width: 200px"
                        :disabled="true"></DatePicker>
          </FormItem>
          <FormItem label="税号生效日期："
                    class="requiredItem">
            <DatePicker @on-change="changeTax2"
                        v-model="addTaxNum.taxEffectiveDate"
                        type="date"
                        placeholder="请选择税号生效日期"
                        style="width: 200px"
                        :disabled="true"></DatePicker>
          </FormItem>
          <FormItem label="EORI号："
                    v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
            <Input v-model="addTaxNum.eoriNumber"
                   placeholder="请输入EORI号"
                   style="width:200px" />
          </FormItem>
          <FormItem label="VAT税号文件：">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}"
                    :disabled="addTaxNum.vatTaxNumberFile !==''"
                    :show-upload-list="false">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatTaxNumberFile !==''">
              <a :href="addTaxNum.vatTaxNumberFile"
                 target="_blank">VAT税号文件</a>
              <Icon type="ios-close-circle"
                    style="cursor:pointer;"
                    @click.stop="removeItem('vatTaxNumberFile')" />
            </div>
          </FormItem>
          <FormItem label="VAT证书："
                    v-if="detailInfo.countryNameZh != '德国' && detailInfo.countryNameZh != '沙特' && detailInfo.countryNameZh != '阿联酋'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatCertificate')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatCertificate')}"
                    :disabled="addTaxNum.vatCertificate !==''"
                    :show-upload-list="false">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatCertificate !==''">
              <a :href="addTaxNum.vatCertificate"
                 target="_blank">VAT证书</a>
              <Icon type="ios-close-circle"
                    style="cursor:pointer;"
                    @click.stop="removeItem('vatCertificate')" />
            </div>
          </FormItem>
          <FormItem label="DE欧盟证书："
                    v-if="detailInfo.countryNameZh=='德国'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'deEuCertificate')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'deEuCertificate')}"
                    :disabled="addTaxNum.deEuCertificate !==''"
                    :show-upload-list="false">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.deEuCertificate !==''">
              <a :href="addTaxNum.deEuCertificate"
                 target="_blank">DE欧盟证书</a>
              <Icon type="ios-close-circle"
                    style="cursor:pointer;"
                    @click.stop="removeItem('deEuCertificate')" />
            </div>
          </FormItem>
          <FormItem label="税务副本："
                    v-if="detailInfo.countryNameZh=='德国'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberCopyFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberCopyFile')}"
                    :disabled="addTaxNum.vatTaxNumberCopyFile !==''"
                    :show-upload-list="false">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatTaxNumberCopyFile !==''">
              <a :href="addTaxNum.vatTaxNumberCopyFile"
                 target="_blank">税务副本</a>
              <Icon type="ios-close-circle"
                    style="cursor:pointer;"
                    @click.stop="removeItem('vatTaxNumberCopyFile')" />
            </div>
          </FormItem>
          <FormItem label="EORI文件："
                    v-if="detailInfo.countryNameZh != '沙特'&&detailInfo.countryNameZh != '阿联酋'">
            <Upload ref="vatFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beforeVatFileUpload"
                    :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'eoriNumberFile')}"
                    :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'eoriNumberFile')}"
                    :disabled="addTaxNum.eoriNumberFile !==''"
                    :show-upload-list="false">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.eoriNumberFile !==''">
              <a :href="addTaxNum.eoriNumberFile"
                 target="_blank">EORI文件</a>
              <Icon type="ios-close-circle"
                    style="cursor:pointer;"
                    @click.stop="removeItem('eoriNumberFile')" />
            </div>
          </FormItem>
          <FormItem label="gateway 账号："
                    v-if="detailInfo.countryNameZh=='英国'">
            <Input v-model="addTaxNum.gatewayId"
                   placeholder="请输入gateway 账号"
                   style="width:200px" />
          </FormItem>
          <FormItem label="gateway 密码："
                    v-if="detailInfo.countryNameZh=='英国'">
            <Input v-model="addTaxNum.gatewayPassword"
                   placeholder="请输入密码"
                   style="width:200px" />
          </FormItem>
          <div v-if="detailInfo.countryNameZh == '沙特' || detailInfo.countryNameZh == '阿联酋'">
            <FormItem label="税局账号（选填）：">
              <Input v-model="addTaxNum.gatewayId"
                     placeholder="请输入税局账号"
                     style="width:200px" />
            </FormItem>
            <FormItem label="密码（选填）：">
              <Input v-model="addTaxNum.gatewayPassword"
                     placeholder="请输入密码"
                     style="width:200px" />
            </FormItem>
          </div>
        </Form>
        <p slot="footer">
          <Button @click="editTaxNumModal = false">取消</Button>
          <Button type="primary"
                  @click="editTaxNumInfo">提交</Button>
        </p>
      </Modal>
      <Modal v-model="fileTaxModal"
             :title="detailInfo.progressBar == 4?'填写报税信息':detailInfo.progressBar == 19?'填写报税信息':'修改报税信息'">
        <Form :model="fileTaxForm"
              label-position="top">
          <FormItem label='下一次申报区间：'>
            <DatePicker type="month"
                        @on-change="dateChange($event,0)"
                        placeholder="请选择下一次申报开始时间"
                        style="width:200px"></DatePicker>
            <DatePicker type="month"
                        @on-change="dateChange($event,1)"
                        placeholder="请选择下一次申报结束时间"
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
                v-if="detailInfo.countryCode=='GB'||detailInfo.countryCode=='DE'">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div v-if="detailInfo.countryCode=='IT'||detailInfo.countryCode=='FR'||detailInfo.countryCode=='ES'">
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
      <Modal v-model="taxFileModal"
             @on-visible-change="modalState"
             title="上传缴税凭证">
        <Upload ref="taxFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :before-upload="beroreTaxUpload"
                :on-success="taxUploadSuccess"
                :on-remove="removetax"
                style="width:260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="taxFileModal=false">取消</Button>
          <Button type="primary"
                  @click="sureUploadTax">确认</Button>
        </p>
      </Modal>
      <Modal v-model="vatCertificateFileModal"
             title="上传VAT证书">
        <Upload ref="taxFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :before-upload="beroreVATcarUpload"
                :on-success="VATcarUploadSuccess"
                :on-remove="removeVATcar"
                style="width:260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="vatCertificateFileModal=false">取消</Button>
          <Button type="primary"
                  @click="sureUploadVATcar">确认</Button>
        </p>
      </Modal>
      <Modal v-model="vatTaxNumberFileModal"
             title="VAT税号文件">
        <Upload ref="taxFile"
                type="drag"
                :action="fileUpload"
                :data="{ prefix: '' }"
                :before-upload="beroreVATcarUpload"
                :on-success="vatTaxNumberFileUploadSuccess"
                :on-remove="removeVatTaxNumberFile"
                style="width:260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload"
                  size="30"
                  style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="vatTaxNumberFileModal=false">取消</Button>
          <Button type="primary"
                  @click="sureUploadVatTaxNumberFile">确认</Button>
        </p>
      </Modal>
      <!-- 开始报税弹窗 -->
      <Modal v-model="startTax"
             title="选择报税时间"
             :mask-closable="false"
             :closable="false">
        <p>
          VAT税号: {{detailInfo.vatTaxNumber}}
        </p>
        <p>
          公司英文名称: {{detailInfo.companyName}}
        </p>
        <Table border
               :loading="tableLoading"
               :columns="columns3"
               :data="VatObligationsData">
          <template slot="declareInterval"
                    slot-scope="{ row }">
            {{row.start}}至{{row.end}}
          </template>
          <template slot="operateDeclare"
                    slot-scope="{ row }">
            <Button type="primary"
                    @click="goToDeclare(row)">去报税</Button>
          </template>
        </Table>
        <div slot="footer">

        </div>
      </Modal>
      <!-- 授权海牙认证 -->
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
      <Modal v-model="viewInformationModal"
             footer-hide
             title="注册信息"
             class-name="viewInformation">
        <Form class="form">

          <!-- 公司信息 -->
          <FormItem label='公司中文名称：'
                    :label-width=200>
            <span>{{submitForm.companyNameZh ? submitForm.companyNameZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司英文名称：'
                    :label-width=200>
            <span>{{submitForm.companyNameEn ? submitForm.companyNameEn : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司中文地址：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.companyAddressZh ? submitForm.companyAddressZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='邮编号码：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'ES' || submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopPostCode ? submitForm.shopPostCode : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司英文地址(亚马逊后台地址）：'
                    :label-width=200>
            <span>{{submitForm.companyAddressEnCountry}}{{submitForm.companyAddressEnCity}}{{submitForm.companyAddressEn}}</span>
          </FormItem>
          <FormItem label='公司邮箱：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.companyEmail ? submitForm.companyEmail : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司电话：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.companyTel ? submitForm.companyTel : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司统一社会信用代码：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'|| submitForm.countryCode === 'FR'"
                    :label-width=200>
            <span>{{submitForm.companyCreditCode ? submitForm.companyCreditCode : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司注册资本：'
                    v-if="submitForm.countryCode === 'ES'||submitForm.countryCode === 'FR'"
                    :label-width=200>
            <span>{{submitForm.companyRegisteredCapital ? submitForm.companyRegisteredCapital : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司营业执照注册城市：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.companyRegisteredCityZh ? submitForm.companyRegisteredCityZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='公司成立日期：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonBirthday ? submitForm.companyLegalPersonBirthday : '暂无'}}</span>
          </FormItem>
          <!-- 法人 -->
          <FormItem label='法人中文名字：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonZh ? submitForm.companyLegalPersonZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人英文名字：'
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonEn ? submitForm.companyLegalPersonEn : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人出生日期：'
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonBirthday ? submitForm.companyLegalPersonBirthday : '暂无'}}</span>
          </FormItem>
          <FormItem label='婚姻状况：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span v-if="submitForm.legalPersonMaritalStatus !==''">{{ submitForm.legalPersonMaritalStatus === 1 ? '未婚' : '已婚'}}</span>
            <span v-else>
              暂无
            </span>
          </FormItem>
          <FormItem label='法人性别：'
                    v-if="submitForm.countryCode === 'ES' || submitForm.countryCode === 'FR'"
                    :label-width=200>
            <span v-if="submitForm.legalPersonSex !==''">{{ submitForm.legalPersonSex === 1 ? '男' : '女'}}</span>
            <span v-else>
              暂无
            </span>
          </FormItem>
          <FormItem label='法人出生省份：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.legalPersonBirthplaceProvinceZh ? submitForm.legalPersonBirthplaceProvinceZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人出生城市：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.legalPersonBirthplaceCityZh ? submitForm.legalPersonBirthplaceCityZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='身份证/护照号码：'
                    v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonCard ? submitForm.companyLegalPersonCard : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人出生地：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'IT'"
                    :label-width=200>
            <span>{{submitForm.legalPersonBirthplaceCityEn ? submitForm.legalPersonBirthplaceCityEn : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人护照/身份证号码（个人店铺必填）：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonCard ? submitForm.companyLegalPersonCard : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人邮箱：'
                    v-if="submitForm.countryCode === 'DE' || submitForm.countryCode === 'GB'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonEmail ? submitForm.companyLegalPersonEmail : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人电话：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonMobile ? submitForm.companyLegalPersonMobile : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人身份证中文地址：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonCardAddressZh ? submitForm.companyLegalPersonCardAddressZh : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人身份证地址英文：'
                    v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES' || submitForm.countryCode === 'FR'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonCardAddress ? submitForm.companyLegalPersonCardAddress : '暂无'}}</span>
          </FormItem>
          <FormItem label='法人身份证地址：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.companyLegalPersonCardAddress ? submitForm.companyLegalPersonCardAddress : '暂无'}}</span>
          </FormItem>

          <!-- 店铺 -->
          <FormItem label='税号生效日期：'
                    :label-width=200>
            <span>{{submitForm.taxEffectiveDate ? submitForm.taxEffectiveDate : '暂无'}}</span>
          </FormItem>
          <FormItem label='店铺名称：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopName ? submitForm.shopName : '暂无'}}</span>
          </FormItem>
          <FormItem label='店铺链接：'
                    v-if="submitForm.countryCode !== 'GB'"
                    :label-width=200>
            <span v-if="submitForm.shopHref !== ''">
              <a :href="submitForm.shopHref"
                 target="_blank">店铺链接</a>
            </span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='销售平台名称：'
                    v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopSalePlatformName ? submitForm.shopSalePlatformName : '暂无'}}</span>
          </FormItem>
          <FormItem label='描述下公司的经营内容：'
                    :label-width=200>
            <span>{{submitForm.companyBusinessModeDescribe ? submitForm.companyBusinessModeDescribe : '暂无'}}</span>
          </FormItem>
          <!-- <FormItem label='邮编号码：' v-if="submitForm.countryCode === 'DE' || submitForm.countryCode === 'ES'" :label-width=200>
                    <span>{{submitForm.postCode ? submitForm.postCode : '暂无'}}</span>
                  </FormItem> -->
          <FormItem label='未来12个月预计销售额（英镑）：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <span>{{submitForm.shopSalePlan ? submitForm.shopSalePlan : '暂无'}}</span>
          </FormItem>
          <FormItem label='未来一年预计销售额（欧元）：'
                    v-if="submitForm.countryCode === 'FR'"
                    :label-width=200>
            <span>{{submitForm.shopSalePlan ? submitForm.shopSalePlan : '暂无'}}</span>
          </FormItem>
          <FormItem label='货物进口及配送流程：'
                    v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.shippingProcess ? submitForm.shippingProcess : '暂无'}}</span>
          </FormItem>
          <FormItem label='西班牙本地银行账户信息：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.localBankAccountInfo ? submitForm.localBankAccountInfo : '暂无'}}</span>
          </FormItem>
          <FormItem label='是否使用西班牙任何仓库：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.useEntrepot === 1 ?'是':'否'}}</span>
          </FormItem>
          <FormItem label='是否使用意大利任何仓库：'
                    v-if="submitForm.countryCode === 'IT'"
                    :label-width=200>
            <span>{{submitForm.useEntrepot === 1 ?'是':'否'}}</span>
          </FormItem>
          <FormItem label='是否开通泛欧：'
                    v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.dredgeEuronext === 1 ?'是':'否'}}</span>
          </FormItem>
          <FormItem label='今年预计销售额（欧元）：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopPredictSale ? submitForm.shopPredictSale : '暂无'}}</span>
          </FormItem>
          <FormItem label='明年预计销售额（欧元）：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopNextYearSale ? submitForm.shopNextYearSale : '暂无'}}</span>
          </FormItem>
          <FormItem label='是否有其它欧盟税号：'
                    v-if="submitForm.countryCode !== 'GB' || submitForm.countryCode === 'ES'"
                    :label-width=200>
            <span>{{submitForm.shopOtherEuTaxNumber ? submitForm.shopOtherEuTaxNumber : '暂无'}}</span>
          </FormItem>
          <FormItem label='德国仓库地址：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopEntrepotAddress ? submitForm.shopEntrepotAddress : '暂无'}}</span>
          </FormItem>
          <FormItem label='物流承运商公司名称：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopLogisticsCompanyName ? submitForm.shopLogisticsCompanyName : '暂无'}}</span>
          </FormItem>
          <FormItem label='物流承运商地址：'
                    v-if="submitForm.countryCode === 'DE'"
                    :label-width=200>
            <span>{{submitForm.shopLogisticsCompany ? submitForm.shopLogisticsCompany : '暂无'}}</span>
          </FormItem>
          <FormItem label='税率：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <span>{{submitForm.shopTaxRate === 0 ? '低税率' : '标准税率'}}</span>
          </FormItem>
          <FormItem label='是否有EORI号：'
                    :label-width=200>
            <span>{{submitForm.needEoriNumber==0?'否':'是'}}</span>
          </FormItem>
          <FormItem label='营业执照扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyBusinessLicense!==''"
               :href="submitForm.companyBusinessLicense"
               target="_blank">营业执照扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='商业登记证BR扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyBusinessRegistrationBr!==''"
               :href="submitForm.companyBusinessRegistrationBr"
               target="_blank">商业登记证BR扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司注册证明书CI扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyRegistrationCi!==''"
               :href="submitForm.companyRegistrationCi"
               target="_blank">公司注册证明书CI扫描件：</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='法团成立表格NNC1扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyCorporateFoundingNnc1!==''"
               :href="submitForm.companyCorporateFoundingNnc1"
               target="_blank">法团成立表格NNC1扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='身份证正反面扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyLegalPersonCardFront!==''"
               :href="submitForm.companyLegalPersonCardFront"
               target="_blank">身份证正反面扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='护照扫描件：'
                    :label-width=200>
            <a v-if="submitForm.companyLegalPersonCardPassport!==''"
               :href="submitForm.companyLegalPersonCardPassport"
               target="_blank">护照扫描件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='公司信用报告：'
                    v-if="submitForm.countryCode === 'ES' || submitForm.countryCode === 'IT'"
                    :label-width=200>
            <a v-if="submitForm.companyCreditReport!==''"
               :href="submitForm.companyCreditReport"
               target="_blank">公司信用报告</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='亚马逊证明文件：'
                    v-if="submitForm.countryCode === 'ES'"
                    :label-width=200>
            <a v-if="submitForm.amazonProveFile!==''"
               :href="submitForm.amazonProveFile"
               target="_blank">亚马逊证明文件</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='后台店铺截图：'
                    v-if="submitForm.countryCode === 'FR' || submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.shopConsoleScreenshot!==''"
               :href="submitForm.shopConsoleScreenshot"
               target="_blank">后台店铺截图</a>
            <span v-else>暂无</span>
          </FormItem>

          <FormItem label='工作证明：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.certificateOfEmployment!==''"
               :href="submitForm.certificateOfEmployment"
               target="_blank">工作证明</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='租房合同：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.leaseAgreement!==''"
               :href="submitForm.leaseAgreement"
               target="_blank">租房合同</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='结婚证：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.marriageLicense!==''"
               :href="submitForm.marriageLicense"
               target="_blank">结婚证</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='离婚证：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.divorceCertificate!==''"
               :href="submitForm.divorceCertificate"
               target="_blank">离婚证</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='房产证：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.houseProprietaryCertificate!==''"
               :href="submitForm.houseProprietaryCertificate"
               target="_blank">房产证</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='工作证明：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.certificateOfEmployment!==''"
               :href="submitForm.certificateOfEmployment"
               target="_blank">工作证明</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='出生证/户口本：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.birthCertificate!==''"
               :href="submitForm.birthCertificate"
               target="_blank">出生证/户口本</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label='房屋贷款明细：'
                    v-if="submitForm.countryCode === 'GB'"
                    :label-width=200>
            <a v-if="submitForm.otherCertificate!==''"
               :href="submitForm.otherCertificate"
               target="_blank">房屋贷款明细</a>
            <span v-else>暂无</span>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="填写gateway"
             v-model="getWayModal"
             @on-ok="addGetWatId"
             @on-cancel="getWayModal = false">
        <Form>
          <FormItem label='getway账号：'
                    :label-width=130>
            <Input v-model="gateWayForm.account"></Input>
          </FormItem>
          <FormItem label='getway密码：'
                    :label-width=130>
            <Input v-model="gateWayForm.password"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="录入发票号"
             @on-visible-change="modalState"
             v-model="invoicaBoxShow">
        <Form>
          <FormItem label='发票号：'
                    :label-width=130>
            <Input v-model="invoiceInfo.invoiceNumber"></Input>
          </FormItem>

          <FormItem label='发票号文件（选填）：'
                    :label-width=130>
            <Upload ref="declareFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreHaugeload"
                    :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList,4)}"
                    :on-remove="(file,fileList)=>{removeDeclare(file,fileList,4)}"
                    style="width:260px"
                    v-if="detailInfo.countryCode!='IT'">
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
             v-if="declareRow.declarationStatus==3">
          <Button @click="resonModelFR = false">取消</Button>
          <Button type="primary"
                  @click="submitFRagain">重新提交</Button>
        </div>
      </Modal>
    </div>
    <Modal title="年报详情"
           v-model="deYearDetail"
           footer-hide>
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
        <span class="tax-info-value">{{thatDEinfo.startTime}}至{{thatDEinfo.endTime}}</span>
        </Col>
      </Row>
      <Divider />
      <p>申报回执：
        <a target="_blank"
           :href="thatDEinfo.declareReceipt"
           v-if="thatDEinfo.declareReceipt!=''">查看</a>
      </p>
      <p style="margin:10px 0;">申报数据：</p>
      <Table :data="deAnnalsData"
             :columns="deAnnalsColumns"
             border>
        <template slot="fillDiscount"
                  slot-scope="{row}">
          <div @click="discountBox = true;dataIndex=row._index"
               style="cursor:pointer;">查看</div>
        </template>
        <template slot="declareReceipt"
                  slot-scope="{row}">
          <div>
            <span v-if="row.declareReceipt==''">暂无</span>
            <a v-else
               :href="row.declareReceipt"
               target="_blank">查看</a>
          </div>
        </template>
        <template slot="payReceipt"
                  slot-scope="{row}">
          <div>
            <span v-if="row.payReceipt==''">暂无</span>
            <a v-else
               :href="row.payReceipt"
               target="_blank">查看</a>
          </div>
        </template>
      </Table>
    </Modal>
    <Modal v-model="discountBox"
           title="抵扣金额"
           :mask-closable="false">
      <Form :model="deAnnalsData[dataIndex]"
            :label-width="127"
            v-if="deAnnalsData.length>0">
        <FormItem label="发票抵扣">
          <Input v-model="deAnnalsData[dataIndex].invoiceDeductiontPrice"
                 placeholder="请输入发票抵扣金额"
                 style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
        <FormItem label="增值税抵扣">
          <Input v-model="deAnnalsData[dataIndex].c88DeductiontPrice"
                 placeholder="请输入增值税抵扣"
                 style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
        <FormItem label="其它抵扣">
          <Input v-model="deAnnalsData[dataIndex].euDeductiontPrice"
                 placeholder="请输入其它抵扣"
                 style="width:200px;margin-right:10px;"></Input>EUR（欧元）
        </FormItem>
      </Form>
      <div slot="footer"
           class="discount-footer">
        <Button type="primary"
                @click="discountBox=false">确认</Button>
      </div>
    </Modal>
    <Modal v-model="taxModal"
           title="报税信息"
           :width="800">
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
            <a :href="taxBaseData.sellFile"
               v-if="taxBaseData.sellFile!=''">点击下载</a>
          </span>
          </Col>
        </Row>
        <Divider />
        <Table :data="taxBaseData.listTaxDeductionItem"
               :columns="discountColumns"
               border>
          <template slot="deductionFile"
                    slot-scope="{row}">
            <div>
              <a :href="row.deductionFile"
                 target="_blank">{{row.fileOriginalName}}</a>
            </div>
          </template>
        </Table>
      </div>
    </modal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/workOrder.js';
import * as API1 from '@/api/taxService/regAndDeclare.js';
import * as API2 from '@/api/taxService/taxModule.js';
import * as APIDE from '@/api/taxService/annalsDE.js';
import { getToken } from '@/libs/util';
import { Throttle } from '@/libs/throttle'
export default {
  props: ['id', 'progressBar', 'userId'],
  data() {
    return {
      fileUpload: this.workOrderFile,
      isCompanyInfoEdit: false,
      auditModal: false,
      isAudit: '1',
      startTax: false, // 开始报税弹窗
      remark: '',//驳回原因
      salePlatName: '',
      lenovoSearchList: [],  // 联想搜索结果列表
      companyBusinessLicense: [],//营业执照文件
      companyBusinessRegistrationBr: [],//商业登记证文件
      companyRegistrationCi: [],//CI扫描件
      companyCorporateFoundingNnc1: [], //法团成立表格NNC1扫描件,
      taxNumModal: false,//录入税号信息modal
      editTaxNumModal: false,
      addTaxNum: {
        vatTaxNumber: '',
        taxIssueDate: '',
        taxEffectiveDate: '',
        eoriNumber: '',
        vatTaxNumberFile: '',
        vatCertificate: '',
        gatewayId: '',
        gatewayPassword: '',
        eoriNumberFile: '',
        vatTaxNumberCopyFile: '',
        deEuCertificate: ''
      },//录入税号信息
      detailInfo: {},
      fileInfo: {},//文件信息
      placeList: [],//法人出生地
      isEng: true,
      submitForm: {
        companyNameZh: '',
        companyNameEn: '',
        companyAddressZh: '',
        companyAddressEnCountry: '',
        companyAddressEnCity: '',
        companyAddressEn: '',
        companyCreditCode: '',
        companyRegisterData: '',
        companyTel: '',
        companyEmail: '',
        companyLegalPersonZh: '',
        companyLegalPersonEn: '',
        companyLegalPersonBirthday: '',
        companyLegalPersonCardAddress: '',
        companyLegalPersonBirthplace: '',
        companyLegalPersonEmail: '',
        companyLegalPersonCard: '',
        companyLegalPersonMobile: '',
        shopHref: '',
        shopName: '',
        shopTaxEffectiveData: '',
        shopSalePlatformName: '',
        // shopPredictSale:'',
        // shopNextYearSale:'',
        companyBusinessModeDescribe: '',
        // shopSalePlan:'',
        shopPostCode: '',
        shopOtherEuTaxNumber: '',
        shopEntrepotAddress: '',
        shopLogisticsCompany: '',
        shopLogisticsCompanyName: '',
        shopTaxRate: '',
        needEoriNumber: '',
        companyBusinessLicense: '',
        companyBusinessLicenseTranslate: '',
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonCardFrontTranslate: '',
        companyLegalPersonCardPassport: '',
        certificateOfEmployment: '',
        leaseAgreement: '',
        marriageLicense: '',
        divorceCertificate: '',
        houseProprietaryCertificate: '',
        birthCertificate: '',
        otherCertificate: '',
        shopConsoleScreenshot: '',
        companyRegisteredCapital: '',
        companyLegalPersonCardAddressZh: '',
        companyRegisteredCityZh: '',
        companyRegisteredCityEn: '',
        legalPersonMaritalStatus: '',
        legalPersonSex: '',
        legalPersonBirthplaceProvinceZh: '',
        legalPersonBirthplaceProvinceEn: '',
        legalPersonBirthplaceCityZh: '',
        legalPersonBirthplaceCityEn: '',
        localBankAccountInfo: "",
        companyCreditReport: '',
        storageAddressImg: '',
        articlesOfAssociationFile: '',
        salesEvidenceFile: ''
      },
      saveLoading: false,
      submitLoading: false,
      fileTaxForm: {},
      declearList: [],
      //申报相关
      formsLink: '', // 英国申报凭证
      tableLoading: false,
      pageInfo: {
        page: 1,
        pageSize: 10
      },
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
            let beginTime = params.row.beginTime !== '' ? params.row.beginTime.slice(0, 7) : '';
            let endTime = params.row.endTime !== '' ? params.row.endTime.slice(0, 7) : '';
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
      taxFileModal: false, //缴税凭证弹窗
      deductionInfo: [],//抵扣明细,
      serviceId: '',
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
      tranferAgentInfo: {},//转代理资料
      progressStatus: {
        8: "资料驳回",
        28: "待上传资料(转代理)",
        29: "转代理中",
        19: "未开始",
        20: "未开始(已开始报税)",
        21: "待申报",
        22: "待缴纳税金",
        23: "待审核申报",
        24: "申报驳回",
        25: "申报完成（客户端完成）",
        26: "申报失败",
        27: "申报完成(整体完成)",
        33: '待审核税金',
        34: "缴税凭证被驳回",
        35: "待上传零申报凭证"
      },
      workId: '',
      orderNo: '',
      vatCertificateFileModal: false,
      vatTaxNumberFileModal: false,
      vatCertificate: '',//VAT证书
      vatTaxNumberFile: '',//VAT税号证书
      authorizationHauge: false,
      enterHaugeInfo: false,
      hyFile: '',
      enterTrankingNumber: false,
      hyNumber: '',
      sendTaxBox: false,
      taxSendNumber: '',
      uploadAuthorizationFR: false,
      viewInformationModal: false,
      getWayModal: false,
      gateWayForm: {
        account: '',
        password: ''
      },
      orderServices: {},
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
      formLeft: {
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
        companyLegalPersonSign: '',
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
        //意大利新增字段
        companyLegalPersonCard: '',
        companyLegalPersonCardAddress: '',
        companyLegalPersonBirthday: '',
        shopHref: '',
        lastDeclareReceipt: '',
        vatTaxNumberFile: '',
        registrationAuthorization: '',
        companyLegalPersonBirthplace: '',
        companyRegisteredCapital: '',
        companyRegisterData: '',
        legalPersonMaritalStatus: '',
        legalPersonBirthplaceProvinceZh: '',
        legalPersonBirthplaceProvinceEn: '',
        legalPersonBirthplaceCityZh: '',
        legalPersonBirthplaceCityEn: '',
        companyLegalPersonCardAddressZh: '',
        needEoriNumber: '',
        shippingProcess: '',
        useEntrepot: '',
        dredgeEuronext: '',
        shopOtherEuTaxNumber: '',
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        companyRegisteredCityZh: '',
        companyRegisteredCityEn: '',
        localBankAccountInfo: '',
        companyCreditReport: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonCardPassport: '',
        shopConsoleScreenshot: '',
        customsClearanceReport: '',
        auditReport: '',
        servicesId: this.servicesId
      },
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
      rowData: {},
      isRowBtn: false,
      resonModelFR: false,
      resonModelTitle: '扣款失败原因',
      frReason: '',
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
            return h('span', beginTime + '至' + endTime)
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
          title: '支付回执',
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
      eoriDisabled: false,
      declareRow: {},
      isDeclareInfo: false
    }
  },
  mounted() {
    this.getregisterInfo()
    this.getBirthPlace()
    this.getCompanyList()
    this.getSupplierByCondition()
  },
  methods: {
    //获取基础配置信息
    getBaseInfo(countryCode) {
      API2.baseInfoByCondition({ countryCode }).then((res) => {
        if (res.code === 0) {
          const data = res.data
          if (data.monthPeriod === 0) this.declearList.push({ type: '月报', status: 0 })
          if (data.quarterPeriod === 0) this.declearList.push({ type: '季报', status: 1 })
          if (data.yearPeriod === 0) this.declearList.push({ type: '年报', status: 2 })
        }
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
    //获取法人出生地
    getBirthPlace() {
      API.getBirthPlace().then((res) => {
        if (res.code == 0) {
          this.placeList = res.data;
        }
      })
    },
    //点击预览文件
    previewFile(url) {
      window.open(url)
    },
    //获取注册详情
    getregisterInfo() {
      API1.getRegDetailInfo({ serviceId: this.id }).then((res) => {
        if (res.code == 0) {
          this.orderNo = res.data.orderNo
          this.detailInfo = res.data.orderServices
          this.isCompanyInfoEdit = res.data.orderServices.progressBar == 0 ? true : false
          this.detailInfo.beginTime = res.data.orderServices.beginTime.substring(0, 7)
          this.detailInfo.endTime = res.data.orderServices.endTime.substring(0, 7)
          window.localStorage.setItem('declareInterval', JSON.stringify(res.data))
          if (JSON.stringify(res.data.registerWorkOrder) != '{}') {
            this.formLeft = this.submitForm = res.data.registerWorkOrder
            let val = res.data.registerWorkOrder
            this.formLeft.shopNature = String(val.shopNature)
            this.formLeft.isThereShop = String(val.isThereShop)
            if (val.shopNature == 1 && (val.companyStockCondition) != '') {
              this.sharesList = JSON.parse(val.companyStockCondition)
            }
            if (this.detailInfo.countryCode == 'ES') {
              if (val.companyStockCondition != '') {
                this.stockGreaterThan25 = '0'
                this.sharesList = JSON.parse(val.companyStockCondition)
              }
            }
            if (this.detailInfo.countryCode == 'DE') {
              this.addTaxNum.taxEffectiveDate = val.shopTaxEffectiveData
            }
          }
          // 判断是否授权
          this.isHasAuth(this.detailInfo)
          if (res.data.taxWorkOrderList.length > 0) {
            this.tableData = res.data.taxWorkOrderList;
            this.tableData.forEach(element => {
              if (element.taxCertificate !== '') {
                element.taxCertificate = element.taxCertificate.split(';')
              } else {
                element.taxCertificate = []
              }
            })
            this.declareInfo = res.data.taxWorkOrderList[0];
            this.deductionInfo = res.data.taxWorkOrderList[0].listTaxDeductionItem;
            this.serviceId = this.workId = res.data.taxWorkOrderList[0].id
          } else {
            // console.log('还没生产工单')
            // API2.vatObligations({
            //     serviceId: this.id,
            //     userId: this.detailInfo.userId,
            //     vatTaxNumber: this.detailInfo.vatTaxNumber
            // }).then(res => {
            //     if (res.code === 0) {
            //         this.getregisterInfo() 
            //     }
            // }).catch(error => {
            //     console.log(error)
            // })
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
          this.getBaseInfo(this.detailInfo.countryCode)

          if (this.detailInfo.countryCode === 'DE' && res.data.yearTaxWorkOrderList.length > 0) {
            this.deYearData = res.data.yearTaxWorkOrderList
          }
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    // 获取英国申报
    getLink(row) {
      API2.getForms({
        workOrderId: row.id,
        userId: row.userId,
      }).then(res => {
        if (res.code === 0) {
          window.open(res.data)
        }
      })
    },
    // 没工单的时候去生成工单
    createWorkOrder() {

      API1.getRegDetailInfo({ serviceId: this.id })
        .then((res) => {
          console.log()
        })
        .catch(error => {
          console.log(error)
        })
    },
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    //选择公司成立时间
    changeCompanyDate(val) {
      this.submitForm.companyRegisterData = val;
    },
    //选择法人出生时间
    changeLegalBirthDate(val) {
      this.submitForm.companyLegalPersonBirthday = val;
    },
    //选择税号生效时间-店铺信息
    changeTaxNumDate(val) {
      this.submitForm.shopTaxEffectiveData = val;
    },
    //选择税号生效时间-录入税号
    changeTax2(val) {
      this.addTaxNum.taxEffectiveDate = val;
    },
    changeVatDate(data, item) {
      this.formLeft[item] = data;
    },
    //选择税号下发时间
    changeTax1(val) {
      this.addTaxNum.taxIssueDate = val;
    },
    //下载注册资料
    downLoad() {
      let self = this;
      let formData = new FormData()
      formData.append('workId', this.submitForm.id)
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/workorder/management/register/down/material', true)
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
    //下载申报资料
    downLoadDeclare() {
      let self = this;
      let formData = new FormData()
      if (this.detailInfo.countryCode === "GB") {
        formData.append('workId', this.tableData[0].id)
      } else {
        formData.append('workOrderId', this.tableData[0].id)
      }
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
    //审核操作
    sureAudit() {
      let params = {
        workId: '',
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      if (this.detailInfo.countryCode === 'IT') {
        if (this.needApiIT) {
          params.apiStatus = 1
        } else {
          params.apiStatus = 0
        }
      }
      if (this.isAudit == 1) {
        delete params.remark
      }
      if (this.detailInfo.progressBar == 1) {
        if (this.detailInfo.countryCode === 'FR' && this.supplierId === '') {
          this.$Message.info('请先选择服务商')
          return
        }
        params.workId = this.submitForm.id
        API1.auditInfo(params).then((res) => {
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
        params.workId = this.tableData[0].id
        if (this.frRetaxInfo.disabledSingle) {
          if (this.frRetaxInfo.extraPrice == '') {
            this.$Message.info('请填写补缴金额')
            return
          }
          params.extraPrice = this.frRetaxInfo.extraPrice
          params.declarationRemark = ''
          this.frRetaxInfo.resonList.map((item, index) => {
            if (item.reason != '') {
              params.declarationRemark += item.reason + ';'
            }
          })
        }
        API1.auditTaxCertificate(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.auditModal = false
            this.$emit('refresh')
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      }

    },
    rowSureAudit() {
      let params = {
        workId: '',
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      }
      if (this.isAudit == 1) {
        delete params.remark
      }
      if (this.detailInfo.countryCode === 'IT') {
        if (this.needApiIT) {
          params.apiStatus = 1
        } else {
          params.apiStatus = 0
        }
      }
      if (this.rowData.status == 1) {
        if (this.rowData.countryCode === 'FR' && this.supplierId === '') {
          this.$Message.info('请先选择服务商')
          return
        }
        params.workId = this.submitForm.id
        API1.auditInfo(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.auditModal = false
            this.isRowBtn = false
            this.getregisterInfo()
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      } else if (this.rowData.status == 33) {
        params.workId = this.rowData.id
        API1.auditTaxCertificate(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功')
            this.auditModal = false
            this.getregisterInfo()
            this.isRowBtn = false
          } else {
            this.$Message.warning(res.message)
          }
        })
          .catch(err => console.log(err))
      }

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
      this.submitForm[item] = res.data.fileUrl;
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.submitForm[item] = "";
    },
    //英国EORI号根据税号改变
    changeEORI(e) {
      if (this.detailInfo.countryCode == 'GB' && this.submitForm.needEoriNumber == 0) {
        this.addTaxNum.eoriNumber = 'GB' + this.addTaxNum.vatTaxNumber + '000'
        this.eoriDisabled = true
      }
    },
    //提交录入税号信息 
    enterTaxNumInfo() {
      if (this.addTaxNum.vatTaxNumber === '') {
        this.$Message.warning('VAT税号不能为空');
        return
      }
      if (this.addTaxNum.taxIssueDate === '') {
        this.$Message.warning('税号下发日期不能为空');
        return
      }
      if (this.addTaxNum.taxEffectiveDate === '') {
        this.$Message.warning('税号生效日期不能为空');
        return
      }
      // if(this.addTaxNum.vatTaxNumberFile =='') {
      //     this.$Message.warning('VAT税号文件不能为空');
      //     return
      // }

      let params = { ...this.addTaxNum }
      params.workId = this.submitForm.id
      params.taxEffectiveDate = this.formatDate(this.addTaxNum.taxEffectiveDate)
      // console.log('录入税号params',params);
      API1.logTaxInfo(params).then((res) => {
        if (res.code == 0) {
          this.$emit('refresh')
          this.$Message.success("录入税号成功")
          this.taxNumModal = false;
          this.addTaxNum = {}
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //取消录入税号信息
    cancelEnter() {
      this.addTaxNum = {};
      this.taxNumModal = false;
      this.$refs.vatFile.clearFiles()
    },
    //税号文件上传之前
    beforeVatFileUpload() { },
    //税号文件上传成功
    vatFileUploadSuccess(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.addTaxNum[item] = res.data.fileUrl
    },
    //移除税号文件
    removeVatFile(file, fileList, item) {
      this.addTaxNum[item] = 0
    },
    //发送提醒
    sendMessage(progressBar) {
      let params = {
        serviceId: this.detailInfo.id
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
    //
    blur(type) {
      let reg = /^(?!_)([A-Za-z ]+)$/;
      if (type == 1) {
        if (!reg.test(this.submitForm.companyNameEn)) {
          this.isEng = false;
        } else {
          this.isEng = true;
        }
      }
    },
    //提交注册资料
    submitFile() {
      this.submitLoading = true
      let data = { ...this.submitForm }
      data.shopTaxEffectiveData = this.formatDate(this.submitForm.shopTaxEffectiveData)
      data.companyLegalPersonBirthday = this.formatDate(this.submitForm.companyLegalPersonBirthday)
      if (this.detailInfo.countryCode == 'SA') {
        data = { ...this.formLeft }
        data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData)
        data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday)
        if (data.shopNature == 1) {
          data.companyStockCondition = JSON.stringify(this.sharesList)
        }
      }
      data.servicesId = this.id
      if (this.countryCode == 'ES') {
        if (this.stockGreaterThan25 == '0') {
          data.companyStockCondition = JSON.stringify(this.sharesList)
        } else {
          data.companyStockCondition = ''
        }
      }
      API1.submitRegInfo(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          window.scroll(0, 0);
          this.$emit('refresh')
        }
      }).finally(() => {
        this.submitLoading = false
      })
      // console.log(this.submitForm)
    },
    //保存注册资料
    saveFile() {
      this.saveLoading = true
      let data = { ...this.submitForm }
      data.shopTaxEffectiveData = this.formatDate(this.submitForm.shopTaxEffectiveData)
      data.companyLegalPersonBirthday = this.formatDate(this.submitForm.companyLegalPersonBirthday)
      if (this.detailInfo.countryCode == 'SA') {
        data = { ...this.formLeft }
        data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData)
        data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday)
        if (data.shopNature == 1) {
          data.companyStockCondition = JSON.stringify(this.sharesList)
        }
      }
      data.servicesId = this.id
      if (this.countryCode == 'ES') {
        if (this.stockGreaterThan25 == '0') {
          data.companyStockCondition = JSON.stringify(this.sharesList)
        } else {
          data.companyStockCondition = ''
        }
      }
      API1.saveRegInfo(data).then(res => {
        this.$Message.success('保存成功')
        window.scroll(0, 0);
      }).finally(() => {
        this.saveLoading = false
      })
    },
    //填写报税信息
    sureFileTax() {
      // console.log(this.fileTaxForm)
      let params = { ...this.fileTaxForm }
      // console.log(this.id)
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
    //计算税金
    caculateTax(row) {
      if (row.orderServicesId !== undefined) {
        this.$emit('showTaxModal', row.id, row.orderServicesId)
      } else {
        this.$emit('showTaxModal', this.workId, this.id)
      }
      this.$store.commit('getDeclareInfo', this.declareInfo)
    },
    //分页
    changePageHandler(page) {

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
      this.taxCertificate = fileList;
    },
    //预览申报回执
    previewBack() {
      window.open(this.tableData[0].declareReceipt)
    },
    //预览扣款回执
    previewDebit() {
      window.open(this.tableData[0].debitReceipt)
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
        console.log('row')
        params.workId = this.rowData.id
      }
      API.uploadDeclareNew(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('上传成功')
          if (this.isRowBtn) {
            this.getregisterInfo()
          } else {
            this.$emit('refresh')
          }
          this.uploadReceiptModal = false
        } else {
          this.$Message.warning(res.message)
        }
      })
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
          if (this.isRowBtn) {
            this.getregisterInfo()
          } else {
            this.$emit('refresh')
          }
          this.taxFileModal = false
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
    //完成转代理
    finishAgent() {
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

    },
    beroreVATcarUpload() { },
    VATcarUploadSuccess(res, file, fileList) {
      this.vatCertificate = res.data.fileUrl
    },
    removeVATcar(file, fileList) {
      this.vatCertificate = ''
    },
    vatTaxNumberFileUploadSuccess(res, file, fileList) {
      this.vatTaxNumberFile = res.data.fileUrl
    },
    removeVatTaxNumberFile(file, fileList) {
      this.vatTaxNumberFile = ''
    },
    //确认上传VAT证书
    sureUploadVATcar() {
      let data = {
        vatCertificate: this.vatCertificate,
        workId: this.submitForm.id
      }
      API2.uploadVatCertificate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('上传成功')
          this.getregisterInfo()
          this.vatCertificateFileModal = false
        }
      })
    },
    //确认VAT税号文件
    sureUploadVatTaxNumberFile() {
      let data = {
        vatTaxNumberFile: this.vatTaxNumberFile,
        workId: this.submitForm.id
      }
      API2.uploadVatCertificate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('上传成功')
          this.getregisterInfo()
          this.vatTaxNumberFileModal = false
        }
      })
    },
    getCompanyList() {
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
    selectCompany: Throttle(function (obj) {
      let that = this
      API2.getMaterial({
        companyName: obj,
        userId: that.userId
      }).then(res => {
        if (res.code === 0) {
          let that = this
          for (const key in res.data) {
            if (res.data.hasOwnProperty(key) && that.submitForm.hasOwnProperty(key)) {
              that.submitForm[key] = res.data[key]
              if (that.detailInfo.countryCode == 'SA') {
                that.formLeft[key] = res.data[key]
              }
            }
          }
          if (JSON.stringify(res.data) === "{}") {
            for (const key in that.submitForm) {
              if (that.submitForm.hasOwnProperty(key)) {
                that.submitForm[key] = ''
              }
            }
            that.submitForm.companyNameZh = obj
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }),
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
    // 判读是否授权
    isHasAuth(detailInfo) {
      let that = this
      if (detailInfo.countryCode !== 'GB') return
      if (!(detailInfo.progressBar >= 20 && detailInfo.progressBar <= 27)) return
      API2.ifAuth({
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
    // 开始授权
    startTaxFun(detailInfo) {
      if (!detailInfo) {
        var detailInfo = this.detailInfo
      }
      let that = this
      API2.ifAuth({
        serviceId: this.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            that.getVatObligations()
          } else {
            that.getwayFun(detailInfo)
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 判断是否授权
    hasAuthFun(detailInfo) {
      let that = this
      API2.ifAuth({
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
    //税局getway 进去授权
    getwayFun(detailInfo) {
      API2.mtdAuth({
        serviceId: this.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber,
        location: 1
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          // window.localStorage.setItem('detailInfoForAuth', JSON.stringify(detailInfo))
          window.location.href = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 检索增值税义务
    getVatObligations() {
      let that = this
      API2.vatObligations({
        serviceId: that.id,
        userId: that.detailInfo.userId,
        vatTaxNumber: that.detailInfo.vatTaxNumber
      }).then(res => {
        if (res.code === 0) {
          that.VatObligationsData = res.data;
          that.$store.commit('getVatObligationsData', res.data)
          //   that.startTax = true
          API1.getRegDetailInfo({ serviceId: this.id }).then((res) => {
            that.tableData = []
            that.tableData = res.data.taxWorkOrderList;
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
    //选择报税区间去报税 
    goToDeclare(row) {
      var declareInfo = { ...this.detailInfo, ...this.tableData, ...row }
      this.$store.commit('getDeclareInfo', declareInfo)
      this.startTax = false
      this.$emit('showTaxModal', this.tableData[0].id, this.id)
    },
    // 确认收到授权书
    sureReceived() {
      API1.confirmReceiptES({ workId: this.submitForm.id }).then(res => {
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
        workId: this.submitForm.id
      }
      API1.enteringHaugeInfo(data).then(res => {
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
        workId: this.submitForm.id
      }
      API1.enteringHaugeTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.enterTrankingNumber = false
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    //填写寄送税局的物流单号
    sureTaxTrankingNumber() {
      let data = {
        taxSendNumber: this.taxSendNumber,
        workId: this.submitForm.id
      }
      API1.enteringTaxTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.sendTaxBox = false
          this.$Message.success('操作成功');
          this.$emit('refresh')
        }
      })
    },
    // 添加getway账号密码
    addGetWatId() {
      var data = {
        workId: this.submitForm.id,
        gatewayId: this.gateWayForm.account,
        gatewayPassword: this.gateWayForm.password
      }
      API2.uploadVatCertificate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('修改成功');
          this.getregisterInfo()
        }
      }).catch(error => {
        console.log(error)
      })
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
      API2.inputInvoice(this.invoiceInfo).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          if (this.isRowBtn) {
            this.getregisterInfo()
          } else {
            this.$emit('refresh')
          }
          this.invoicaBoxShow = false
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
      API2.inputGibancode(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          if (this.isRowBtn) {
            this.getregisterInfo()
          } else {
            this.$emit('refresh')
          }
          this.gibanBox = false
        }
      })
    },
    // 修改税号信息
    editTaxInfo(detailInfo) {
      var data = JSON.parse(JSON.stringify(detailInfo))
      this.addTaxNum = data
      this.editTaxNumModal = true
    },
    // 删除修改税号信息文件
    removeItem(item) {
      this.addTaxNum[item] = ''
    },
    //修改税号信息
    editTaxNumInfo() {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>请确认您要上传的资料是否正确</p>',
        onOk: () => {
          API2.uploadVatCertificate({
            deEuCertificate: this.addTaxNum.deEuCertificate,
            eoriNumber: this.addTaxNum.eoriNumber,
            eoriNumberFile: this.addTaxNum.eoriNumberFile,
            gatewayId: this.addTaxNum.gatewayId,
            gatewayPassword: this.addTaxNum.gatewayPassword,
            vatCertificate: this.addTaxNum.vatCertificate,
            vatTaxNumberCopyFile: this.addTaxNum.vatTaxNumberCopyFile,
            vatTaxNumberFile: this.addTaxNum.vatTaxNumberFile,
            workId: this.submitForm.id
          }).then(res => {
            if (res.code === 0) {
              this.$Message.success('文件修改成功')
              this.getregisterInfo()
              this.editTaxNumModal = false
            }
          })
        },
      })
    },
    taxFileRecordModal(row) {
      this.isRowBtn = true
      this.taxFileModal = true
      this.rowData = row
    },
    uploadReceiptModalFun(row) {
      this.rowData = row
      this.uploadReceiptModal = true
      this.isRowBtn = true
    },
    auditFun(row) {
      this.rowData = row
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
          this.frReason = res.data.erreurLibelle
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
    //德国提交年报
    goAnnalsDE(row) {
      let beginTime = row.beginTime.slice(0, 7)
      let endTime = row.endTime.slice(0, 7)
      let baseData = {
        companyName: this.detailInfo.companyName,
        vatTaxNumber: this.detailInfo.vatTaxNumber,
        companyNameEn: this.detailInfo.companyNameEn,
        year: row.year,
        time: beginTime + '至' + endTime
      }
      this.$emit('showAnnalsModal', row.id, baseData)
    },
    //德国生成年报工单
    creatAnnalsFun() {
      let data = { serviceId: this.detailInfo.id }
      APIDE.creatAnnalsApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('生成年报成功')
          this.getregisterInfo()
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
    }
  },
}
</script>
<style lang="less" scoped>
.back {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  margin-bottom: 5px;
  cursor: pointer;
}
.content {
  display: flex;
  .content-l {
    flex: 1;

    .companyTitleBox {
      display: flex;
      justify-content: space-between;
    }
    .classTitle {
      display: flex;
      justify-content: space-between;
      span {
        &:first-child {
          font-size: 16px;
          font-weight: 700;
          padding-left: 10px;
        }
        &:last-child {
          cursor: pointer;
        }
      }
    }

    .legalPersonInfo,
    .shopInfo,
    .fileInfo {
      padding-top: 10px;
      border-top: 1px solid #666;
    }

    .classifyTitleBox {
      padding: 10px 5px;
      // font-size: 12px;
      // color: #18CEA5;
      .classifyTitle {
        font-weight: bold;
        font-size: 14px;
        color: #666;
      }
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
    .fileBtn {
      text-align: center;
      margin-top: 20px;
    }

    .titleItem {
      text-align: right;
      padding-right: 12px;
    }
    .fileBox {
      display: flex;
      flex-wrap: wrap;
      a {
        text-decoration: none;
        margin-right: 40px;
      }
    }
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
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
    height: 40px !important;
    // line-height: 34px;
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
      .span {
        margin-right: 5px;
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
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
    .addGetWatId {
      margin-left: 20px;
      color: #2d8cf0;
      border-bottom: 1px solid #2d8cf0;
      cursor: pointer;
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
.hauge-header {
  text-align: center;
  font-weight: 700;
  color: #333;
}
.hauge-content {
  padding: 12px;
  background-color: #f2f2f2;
  p {
    line-height: 30px;
  }
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