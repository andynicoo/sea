<template>
  <div>
    <div class="back" @click="goBack()">
      <Icon type="md-arrow-back" />返回列表
    </div>
    <div class="content">
      <div class="content-l">
        <Card>
          <p slot="title" class="companyTitleBox">
            <span>注册资料</span>
            <span v-if="detailObj.progressBar==60">
              <Button type="primary" @click="sendMassage = true" v-show="hasAuthority('authorizedRepresent_sendMessage')" ghost>发送提醒</Button>
              <Button type="primary" @click="sureSuccessBox = true" v-show="hasAuthority('authorizedRepresent_submitInformation')" style="margin-left:20px">提交审核</Button>
            </span>
            <span v-else-if="detailObj.progressBar==61">
              <Button type="primary" @click="download" ghost style="margin-right:12px" v-show="hasAuthority('authorizedRepresent_downloadMaterial')">下载资料</Button>
              <Button type="primary" @click="supplierModal=true" v-show="hasAuthority('authorizedRepresent_selectService')" ghost style="margin-right:12px">选择服务商</Button>
              <Button type="primary" @click="detailModel = true" v-show="hasAuthority('authorizedRepresent_verifyMaterial')">审核</Button>
            </span>
            <span v-else-if="detailObj.progressBar==66">
              <Button type="primary" @click="download" ghost style="margin-right:12px" v-show="hasAuthority('authorizedRepresent_downloadMaterial')">下载资料</Button>
              <Button type="primary" @click="subCerModel = true">上传协议和证书</Button>
            </span>
            <span v-else-if="detailObj.progressBar==62">
              <Button type="primary" @click="download" ghost style="margin-right:12px" v-show="hasAuthority('authorizedRepresent_downloadMaterial')">下载资料</Button>
              <Button type="primary" @click="finishBoxFunc" style="margin-right:12px" v-if="detailObj.countryCode=='EU'" v-show="hasAuthority('authorizedRepresent_submitAgreementInfo')">录入欧代信息</Button>
              <Button type="primary" @click="finishBox1Func" style="margin-right:12px" v-if="detailObj.countryCode=='GB'" v-show="hasAuthority('authorizedRepresent_submitAgreementInfo')">录入英代信息</Button>
              <Button type="primary" @click="rejectAuthorizationModal = true" ghost v-show="hasAuthority('authorizedRepresent_reject')">驳回</Button>
            </span>
            <span v-else>
              <Button type="primary" @click="download" ghost v-show="hasAuthority('authorizedRepresent_downloadMaterial')">下载资料</Button>
            </span>
          </p>
          <div class="companyInfo">
            <Form ref="submitForm" :label-width="166" :model="submitForm" :rules="submitFormRules">
              <p class="classTitle">
                <span>公司信息</span>
                <span v-if="detailObj.progressBar ==60 || detailObj.progressBar ==61 || detailObj.progressBar ==63" @click="isCompanyInfoEdit = true">【修改】</span>
              </p>
              <FormItem label="公司类型" prop="companyType">
                <RadioGroup v-model="submitForm.companyType">
                  <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                  <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                  <Radio :disabled="!isCompanyInfoEdit" :label="'3'">境外公司</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="营业执照：" v-if="submitForm.companyType == '1' || submitForm.companyType == '3'" prop="companyBusinessLicense">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.companyBusinessLicense">
                  <div class="fileBox" v-if="submitForm.companyBusinessLicense!=''">
                    <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                      {{"营业执照"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="商业登记证BR扫描件:" v-if="submitForm.companyType == '2'" prop="companyBusinessRegistrationBr">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.companyBusinessRegistrationBr">
                  <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr!=''">
                    <a target="_blank" @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                      {{"商业登记证BR扫描件"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="公司注册证明书CI扫描件:" v-if="submitForm.companyType == '2'" prop="companyRegistrationCi">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.companyRegistrationCi">
                  <div class="fileBox" v-if="submitForm.companyRegistrationCi!=''">
                    <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                      {{"公司注册证明书CI扫描件"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="法团成立表格NNC1扫描件:" v-if="submitForm.companyType == '2'" prop="companyCorporateFoundingNnc1">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.companyCorporateFoundingNnc1">
                  <div class="fileBox" v-if="submitForm.companyCorporateFoundingNnc1!=''">
                    <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                      {{"法团成立表格NNC1扫描件"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="公司中文名称：" prop="companyNameZh">
                <AutoComplete v-model="submitForm.companyNameZh" :data="lenovoSearchList" placeholder="请输入公司中文名称" :disabled="!isCompanyInfoEdit">
                </AutoComplete>
              </FormItem>
              <FormItem label="统一社会信用代码：" prop="companyCreditCode">
                <Input v-model="submitForm.companyCreditCode" placeholder=" 请输入营业执照的信用代码" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="公司英文名称：" prop="companyNameEn">
                <Input v-model="submitForm.companyNameEn" placeholder="请输入公司英文名称" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="公司英文地址：" prop="companyAddressEn">
                <Input v-model="submitForm.companyAddressEn" placeholder="请输入公司英文地址" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="公司邮编号码：" prop="companyPostCode">
                <Input v-model="submitForm.companyPostCode" placeholder="请输入公司邮编号码" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="店铺后台链接：" prop="shopHref">
                <Input v-model="submitForm.shopHref" placeholder=" 请输入店铺后台链接" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <p class="classTitle">
                <span>申请人信息</span>
              </p>
              <FormItem label="法人中文名：" prop="companyLegalPersonZh">
                <Input v-model="submitForm.companyLegalPersonZh" placeholder="请填写中文名字" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="法人联系电话：" prop="companyLegalPersonPhone" class="requiredItem">
                <Input v-model="submitForm.companyLegalPersonPhone" placeholder="请输入法人联系电话" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="法人姓名拼音：" prop="companyLegalPersonPinyin">
                <Input v-model="submitForm.companyLegalPersonPinyin" placeholder="请使用拼音输入姓名" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="法人手机号：" prop="companyLegalPersonMobilePhone">
                <Input v-model="submitForm.companyLegalPersonMobilePhone" placeholder="请输入法人手机号" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="法人邮箱：" prop="companyLegalPersonEmail">
                <Input v-model="submitForm.companyLegalPersonEmail" placeholder="请输入法人邮箱" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="联系人中文名：">
                <Input v-model="submitForm.contactNameZh" placeholder="请填写中文名字" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="联系人电话：">
                <Input v-model="submitForm.contactNamePhone" placeholder="请输入联系人电话" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="联系人邮箱：" prop="contactNameEmail">
                <Input v-model="submitForm.contactNameEmail" placeholder="请输入联系人邮箱" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>

              <FormItem label="联系人英文姓名：">
                <Input v-model="submitForm.contactNameEn" placeholder="请填写联系人英文姓名" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <FormItem label="联系人手机：">
                <Input v-model="submitForm.contactNameMobilePhone" placeholder="请输入联系人手机号" :disabled="!isCompanyInfoEdit"></Input>
              </FormItem>
              <p class="classTitle">
                <span>产品信息</span>
              </p>
              <Table border :columns="columns" :data="submitForm.productList">
                <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" size="small" style="margin-right: 5px" @click="addProduct" v-if="isCompanyInfoEdit">添加</Button>
                  <Button type="error" size="small" @click="remove(index)" v-if="index != 0 && isCompanyInfoEdit">删除</Button>
                </template>
              </Table>
              <p class="classTitle">
                <span>申请文件（至少上传一种）</span>
              </p>
              <FormItem label="CE证书：" prop="ceCertificate">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'ceCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'ceCertificate')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.ceCertificate">
                  <div class="fileBox" v-if="submitForm.ceCertificate!=''">
                    <a target="_blank" @click="previewFile(submitForm.ceCertificate)">
                      {{"CE证书"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','ceCertificate')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="UKCA证书：" v-if="detailObj.countryCode=='GB'">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'ukcaCertificate')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'ukcaCertificate')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.ukcaCertificate">
                  <div class="fileBox" v-if="submitForm.ukcaCertificate!=''">
                    <a target="_blank" @click="previewFile(submitForm.ukcaCertificate)">
                      {{"UKCA证书"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','ukcaCertificate')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <FormItem label="产品检测报告：">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productExaminationReport')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'productExaminationReport')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.productExaminationReport">
                  <div class="fileBox" v-if="submitForm.productExaminationReport!=''">
                    <a target="_blank" @click="previewFile(submitForm.productExaminationReport)">
                      {{"产品检测报告"}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','productExaminationReport')" />
                    </a>
                  </div>
                </div>
              </FormItem>
              <!-- <FormItem label="DOC声明：">
                                <Upload type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :disabled='!isCompanyInfoEdit'
                                        :on-format-error="formatErrorHandler"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'docStatement')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'docStatement')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        :show-upload-list="false">
                                <div style="padding: 10px 0;width:300px">
                                    <Icon type="ios-cloud-upload"
                                        size="30"
                                        style="color: #3399ff"></Icon>
                                    <span>请拖拽文件到此区域上传或点击上传</span>
                                </div>
                                </Upload>
                                <div v-if="submitForm.docStatement">
                                <div class="fileBox"
                                    v-if="submitForm.docStatement!=''">
                                    <a target="_blank"
                                    @click="previewFile(submitForm.docStatement)">
                                    {{"DOC声明"}}
                                    <Icon v-if="isCompanyInfoEdit"
                                            type="ios-close-circle"
                                            @click.stop="removeHandler('','','docStatement')" />
                                    </a>
                                </div>
                                </div>
                            </FormItem> -->
              <FormItem label="产品文件（标签/介绍/说明书等)：">
                <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :disabled='!isCompanyInfoEdit' :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'productDocumentations')}" :on-remove="(file,fileList)=>{removeHandler(file,fileList,'productDocumentations')}" :format="['jpg','jpeg','png','gif','pdf','zip','rar']" :show-upload-list="false">
                  <div style="padding: 10px 0;width:300px">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <span>请拖拽文件到此区域上传或点击上传</span>
                  </div>
                </Upload>
                <div v-if="submitForm.productDocumentations.length!=0">
                  <div class="fileBox" v-for="(item,index) in submitForm.productDocumentations" :key="item.fileUrl">
                    <a target="_blank" @click="previewFile('productDocumentations',index)">
                      {{item.fileName}}
                      <Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','productDocumentations',index)" />
                    </a>
                  </div>
                </div>
              </FormItem>
            </Form>
            <p class="fileBtn" v-if="isCompanyInfoEdit">
              <Button type="primary" ghost v-if="detailObj.progressBar ==60" @click="saveFile" style="margin-right: 10px;" :loading="saveLoading">保存</Button>
              <Button type="primary" @click="sureSuccessBox = true" :loading="submitLoading">提交</Button>
            </p>
          </div>
        </Card>
      </div>
      <div class="content-r">
        <Card style="margin-top: 6px;" v-if="detailObj.progressBar==65">
          <p slot="title">{{submitForm.countryCode == 'GB'?'英代':'欧代'}}信息</p>
          <Form :label-width=100>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="订单备注：">
              <span>{{orderRemark}}</span>
            </FormItem>
            <FormItem label="国家：" v-if="submitForm.countryCode=='EU'">
              <span>{{submitForm.serviceProviderCompanyCountryEn}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{submitForm.serviceProviderCompanyNameEn}}</span>
            </FormItem>
            <FormItem label="城市：" v-if="submitForm.countryCode=='EU'">
              <span>{{submitForm.serviceProviderCompanyCityEn}}</span>
            </FormItem>
            <FormItem label="电话：">
              <span>{{submitForm.serviceProviderCompanyTel}}</span>
            </FormItem>
            <FormItem label="邮箱：">
              <span>{{submitForm.serviceProviderCompanyEmail}}</span>
            </FormItem>
            <FormItem label="邮编：" v-if="submitForm.countryCode=='EU'">
              <span>{{submitForm.serviceProviderCompanyPostCode}}</span>
            </FormItem>
            <FormItem label="街道详细地址：">
              <span>{{submitForm.serviceProviderCompanyAddressEn}}</span>
            </FormItem>
            <FormItem label="协议生效日期：">
              <span>{{submitForm.agreementTakeEffectDate}}</span>
            </FormItem>
            <FormItem label="协议到期日期：">
              <span>{{submitForm.agreementExpiryDate}}</span>
            </FormItem>
            <FormItem label="欧代标签文件：" v-if="submitForm.countryCode=='EU'">
              <a :href="submitForm.labelFile" target="_blank" v-if="submitForm.labelFile">欧代标签文件</a>
            </FormItem>
            <FormItem label="欧代标签文件：" v-if="submitForm.countryCode=='GB'">
              <a :href="submitForm.labelFile" target="_blank" v-if="submitForm.labelFile">英代标签文件</a>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">服务信息</p>
          <Form :label-width=100>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="订单备注：">
              <span>{{orderRemark}}</span>
            </FormItem>
            <FormItem label="工单号：">
              <span>{{submitForm.authorisedRepresentativeWorkOrderNo}}</span>
            </FormItem>
            <FormItem label="状态：">
              <span style="color:#F79728">{{progressStatus[detailObj.progressBar]}}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{submitForm.companyNameZh}}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>{{submitForm.countryNameZh}}授权代表</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{submitForm.countryNameZh}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{submitForm.createTime}}</span>
            </FormItem>
            <FormItem label="审核通过时间：">
              <span>{{serviceInfo.checkPassTime}}</span>
            </FormItem>
            <FormItem label="服务商：" v-if="detailObj.progressBar>61 && detailObj.progressBar!=63">
              <span>{{submitForm.serviceProviders || '暂无'}}</span>
            </FormItem>
            <FormItem :label="submitForm.countryCode == 'GB'?'英代协议：':'欧代协议：'">
              <a :href="submitForm.serviceProvidersAgreementBySigned" target="_blank" v-if="submitForm.serviceProvidersAgreementBySigned">{{submitForm.countryCode == 'GB'?'英代':'欧代'}}协议</a>
            </FormItem>
            <FormItem :label="submitForm.countryCode == 'GB'?'英代证书：':'欧代证书：'">
              <a :href="submitForm.serviceProvidersCertificate" target="_blank" v-if="submitForm.serviceProvidersCertificate">{{submitForm.countryCode == 'GB'?'英代':'欧代'}}证书</a>
              <Button type="primary" style="margin-left:10px;padding:0 10px" v-show="hasAuthority('authorizedRepresent_submitAgreeAndCer')" size="small" @click="subAginCerModel=true" v-if="detailObj.progressBar==62">上传</Button>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width=100>
            <FormItem label="用户昵称：">
              <span>{{submitForm.userNickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{submitForm.userMobile}}</span>
            </FormItem>
            <FormItem label="电子邮箱：">
              <span>{{submitForm.userEmail}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{submitForm.userCompanyName}}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{submitForm.userAddress}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;" class="operationLogs" v-if="detailObj.progressBar!=60">
          <p slot="title">操作记录</p>
          <div v-if="consoleOperationLogs.length > 0" class="logsContent">
            <div v-for="(row, index) in consoleOperationLogs" :key="index">
                <div>
                  <p class="itemTop">{{row.instruction}}</p>
                  <p v-if="row.remark">备注：{{row.remark}}</p>
                  <div class="itemBottom">
                    <span style="margin-right:10px;">时间：{{row.createTime}}</span>
                    <span>操作人：{{row.adminUserNickName || row.adminUserMobile}}</span>
                  </div>
                </div>
              </div>
          </div>
        </Card>
      </div>
  </div>
    <Modal v-model="sendMassage" title="是否确认发送">
      <p style="padding:10px 0;font-size:16px;">温馨提示：确认后，系统将给客户发送相关短信提醒；</p>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="sendMassage=false">取消</Button>
        <Button type="primary" @click="sureSendMassage">确认</Button>
      </div>
    </Modal>
    <Modal v-model="finishBox" title="录入欧代信息">
      <Form :model="enterRepFeil" :rules="enterRepFeilRulse" ref="enterRepFeil" :label-width="80">
        <FormItem label="国家：" prop="serviceProviderCompanyCountryEn">
          <Input v-model="enterRepFeil.serviceProviderCompanyCountryEn"></Input>
        </FormItem>
        <FormItem label="公司名称：" prop="serviceProviderCompanyNameEn">
          <Input v-model="enterRepFeil.serviceProviderCompanyNameEn"></Input>
        </FormItem>
        <FormItem label="城市：" prop="serviceProviderCompanyCityEn">
          <Input v-model="enterRepFeil.serviceProviderCompanyCityEn"></Input>
        </FormItem>
        <FormItem label="电话：" prop="serviceProviderCompanyTel">
          <Input v-model="enterRepFeil.serviceProviderCompanyTel"></Input>
        </FormItem>
        <FormItem label="邮箱：" prop="serviceProviderCompanyEmail">
          <Input v-model="enterRepFeil.serviceProviderCompanyEmail"></Input>
        </FormItem>
        <FormItem label="邮编：" prop="serviceProviderCompanyPostCode">
          <Input v-model="enterRepFeil.serviceProviderCompanyPostCode"></Input>
        </FormItem>
        <FormItem label="街道详细地址：" prop="serviceProviderCompanyAddressEn">
          <Input v-model="enterRepFeil.serviceProviderCompanyAddressEn"></Input>
        </FormItem>
        <FormItem label="协议生效日期：" prop="agreementTakeEffectDate">
          <DatePicker type="date" @on-change="timeChange1" v-model="enterRepFeil.agreementTakeEffectDate" placeholder="请选择协议生效日期"></DatePicker>
        </FormItem>
        <FormItem label="协议到期日期：" prop="agreementExpiryDate">
          <DatePicker type="date" disabled v-model="enterRepFeil.agreementExpiryDate" placeholder="请选择协议到期日期"></DatePicker>
        </FormItem>
        <FormItem label="欧代标签文件：" prop="labelFile">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler2(res,file,fileList,'labelFile')}" :on-remove="(file,fileList)=>{removeHandler2(file,fileList,'labelFile')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="enterRepFeil.labelFile">
            <div class="fileBox" v-if="enterRepFeil.labelFile!=''">
              <a target="_blank" @click="previewFile(enterRepFeil.labelFile)">
                {{"欧代标签文件"}}
                <Icon type="ios-close-circle" @click.stop="removeHandler2('','','labelFile')" />
              </a>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="finishBox=false">取消</Button>
        <Button type="primary" @click="finishSubmit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="finishBox1" title="录入英代信息">
      <Form :model="enterRepFeil1" :rules="enterRepFeilRulse" ref="enterRepFeil1" :label-width="80">
        <FormItem label="公司名称：" prop="serviceProviderCompanyNameEn">
          <Input v-model="enterRepFeil1.serviceProviderCompanyNameEn"></Input>
        </FormItem>
        <FormItem label="地址：" prop="serviceProviderCompanyAddressEn">
          <Input v-model="enterRepFeil1.serviceProviderCompanyAddressEn"></Input>
        </FormItem>
        <FormItem label="电话：" prop="serviceProviderCompanyTel">
          <Input v-model="enterRepFeil1.serviceProviderCompanyTel"></Input>
        </FormItem>
        <FormItem label="邮箱：" prop="serviceProviderCompanyEmail">
          <Input v-model="enterRepFeil1.serviceProviderCompanyEmail"></Input>
        </FormItem>
        <FormItem label="邮编：" prop="serviceProviderCompanyPostCode" v-if="enterRepFeil1.serviceProviderCompanyPostCode">
          <Input v-model="enterRepFeil1.serviceProviderCompanyPostCode"></Input>
        </FormItem>
        <FormItem label="协议生效日期：" prop="agreementTakeEffectDate">
          <DatePicker type="date" @on-change="timeChange1" v-model="enterRepFeil1.agreementTakeEffectDate" placeholder="请选择协议生效日期"></DatePicker>
        </FormItem>
        <FormItem label="协议到期日期：" prop="agreementExpiryDate">
          <DatePicker type="date" disabled v-model="enterRepFeil1.agreementExpiryDate" placeholder="请选择协议到期日期"></DatePicker>
        </FormItem>
        <FormItem label="英代标签文件：" prop="labelFile">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler2(res,file,fileList,'labelFile')}" :on-remove="(file,fileList)=>{removeHandler2(file,fileList,'labelFile')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="enterRepFeil1.labelFile">
            <div class="fileBox" v-if="enterRepFeil1.labelFile!=''">
              <a target="_blank" @click="previewFile(enterRepFeil1.labelFile)">
                {{"英代标签文件"}}
                <Icon type="ios-close-circle" @click.stop="removeHandler2('','','labelFile')" />
              </a>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="finishBox1=false">取消</Button>
        <Button type="primary" @click="finishSubmit">提交</Button>
      </div>
    </Modal>
    <Modal v-model="sureSuccessBox">
      <p class="sure-submit">是否确认提交</p>
      <div slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="sureSuccessBox=false">取消</Button>
        <Button type="primary" @click="submitFile">确认</Button>
      </div>
    </Modal>
    <Modal v-model="detailModel" title="审核资料">
      <Form ref="auditForm" :model="auditForm">
        <FormItem prop="status">
          <RadioGroup v-model="auditForm.status">
            <Radio label="1">审核通过</Radio>
            <Radio label="2">资料不对，驳回</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="remark" v-if="auditForm.status === '2'">
          <Input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入驳回原因（必填）" />
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="audit">确定</Button>
      </div>
    </Modal>
    <Modal v-model="subCerModel" title="上传文件">
      <Form ref="auditForm" :model="auditForm">
        <FormItem :label="detailObj.countryCode=='EU'?'欧代协议(模板)：':'英代协议(模板)'" prop="serviceProvidersAgreement">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'serviceProvidersAgreement')}" :on-remove="(file,fileList)=>{removeHandler1(file,fileList,'serviceProvidersAgreement')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="auditForm.serviceProvidersAgreement">
            <div class="fileBox" v-if="auditForm.serviceProvidersAgreement!=''">
              <a target="_blank" @click="previewFile(auditForm.serviceProvidersAgreement)">
                {{detailObj.countryCode=='EU'?'欧代协议：':'英代协议'}}
                <Icon type="ios-close-circle" @click.stop="removeHandler1('','','serviceProvidersAgreement')" />
              </a>
            </div>
          </div>
        </FormItem>
        <FormItem :label="detailObj.countryCode=='EU'?'欧代证书：':'英代证书'" prop="serviceProvidersCertificate">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler1(res,file,fileList,'serviceProvidersCertificate')}" :on-remove="(file,fileList)=>{removeHandler1(file,fileList,'serviceProvidersCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="auditForm.serviceProvidersCertificate">
            <div class="fileBox" v-if="auditForm.serviceProvidersCertificate!=''">
              <a target="_blank" @click="previewFile(auditForm.serviceProvidersCertificate)">
                {{detailObj.countryCode=='EU'?'欧代证书：':'英代证书'}}
                <Icon type="ios-close-circle" @click.stop="removeHandler1('','','serviceProvidersCertificate')" />
              </a>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="subCer">确定</Button>
      </div>
    </Modal>
    <Modal v-model="subAginCerModel" title="上传文件">
      <Form ref="subAginForm" :model="subAginForm" :rules="subAginFormRules">
        <FormItem :label="detailObj.countryCode=='EU'?'欧代协议：':'英代协议'" prop="serviceProvidersAgreementBySigned">
          <Upload type="drag" 
                  :action="fileUpload" 
                  :data="{ prefix: '' }" 
                  :on-format-error="formatErrorHandler" 
                  :on-success="(res,file,fileList)=>{successHandler3(res,file,fileList,'serviceProvidersAgreementBySigned')}" 
                  :on-remove="(file,fileList)=>{removeHandler3(file,fileList,'serviceProvidersAgreementBySigned')}" 
                  :format="['jpg','jpeg','png','gif','pdf']" 
                  :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="subAginForm.serviceProvidersAgreementBySigned">
            <div class="fileBox" v-if="subAginForm.serviceProvidersAgreementBySigned!=''">
              <a target="_blank" @click="previewFile(subAginForm.serviceProvidersAgreementBySigned)">
                {{detailObj.countryCode=='EU'?'欧代协议：':'英代协议'}}
                <Icon type="ios-close-circle" @click.stop="removeHandler3('','','serviceProvidersAgreementBySigned')" />
              </a>
            </div>
          </div>
        </FormItem>
        <FormItem :label="detailObj.countryCode=='EU'?'欧代证书：':'英代证书'" prop="serviceProvidersCertificate">
          <Upload type="drag" :action="fileUpload" :data="{ prefix: '' }" :on-format-error="formatErrorHandler" :on-success="(res,file,fileList)=>{successHandler3(res,file,fileList,'serviceProvidersCertificate')}" :on-remove="(file,fileList)=>{removeHandler1(file,fileList,'serviceProvidersCertificate')}" :format="['jpg','jpeg','png','gif','pdf']" :show-upload-list="false">
            <div style="padding: 10px 0;width:300px">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div v-if="subAginForm.serviceProvidersCertificate">
            <div class="fileBox" v-if="subAginForm.serviceProvidersCertificate!=''">
              <a target="_blank" @click="previewFile(subAginForm.serviceProvidersCertificate)">
                {{detailObj.countryCode=='EU'?'欧代证书：':'英代证书'}}
                <Icon type="ios-close-circle" @click.stop="removeHandler3('','','serviceProvidersCertificate')" />
              </a>
            </div>
          </div>
        </FormItem>
        <p style="color:rgb(247, 151, 40)">请同时上传服务商最新下发的协议和证书</p>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="subAginCer">确定</Button>
      </div>
    </Modal>
    <Modal title="选择服务商" v-model="supplierModal">
      <div>
        <Select clearable v-model="auditForm.serviceProviderId" placeholder="选择服务商">
          <Option v-for="(item,index) in serviceProvidersList" :key="index" :value="item.id">{{ item.supplierName }}</Option>
        </Select>
      </div>
      <p slot="footer">
        <Button type="primary" @click="supplierModal = false">确认</Button>
      </p>
    </Modal>
    <Modal v-model="rejectAuthorizationModal" title="驳回">
      <Input v-model="rejectAuthorizationReason" type="textarea" :rows="4" placeholder="请输入驳回原因（必填）" />
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="rejectAuthorization">确定</Button>
      </div>
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
import { getDeclareServiceDetail } from '@/api/taxService/workOrder.js';
import * as API from '@/api/taxService/compliance.js';
import { getToken } from '@/libs/util';
export default {
  props: ['serviceId', 'detailObj'],
  data() {
    return {
      progressStatus: {
        60: "待上传资料",
        61: "待审核",
        62: "注册中",
        63: "资料驳回",
        64: "待授权",
        65: "注册完成",
        66: "已审核",
      },
      serviceInfo:{},
      auditForm: {
        status: '1',
        remark: '',
        serviceProvidersAgreement: '',
        serviceProvidersCertificate: '',
        serviceProviderId:'',
      },
      serviceProvidersList:[],
      subAginCerModel:false,
      subAginForm:{
        serviceId:'',
        serviceProvidersAgreementBySigned:'',
        serviceProvidersCertificate:'',
      },
      subAginFormRules:{
        serviceProvidersAgreementBySigned: [
          { required: true, message: '请上传协议', trigger: 'change' }
        ],
        serviceProvidersCertificate: [
          { required: true, message: '请上传证书', trigger: 'change' }
        ],
      },
      spinShow: false,
      subCerModel: false,
      nowDownload: false,
      finishBox1: false,
      enterRepFeil1: {},
      enterRepFeil: {},
      enterRepFeilRulse: {
        serviceProviderCompanyCountryEn: [
          { required: true, message: '请填写国家', trigger: 'blur' }
        ],
        serviceProviderCompanyNameEn: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        serviceProviderCompanyCityEn: [
          { required: true, message: '请填写城市', trigger: 'blur' }
        ],
        serviceProviderCompanyTel: [
          { required: true, message: '请填写电话', trigger: 'blur' }
        ],
        serviceProviderCompanyEmail: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        serviceProviderCompanyPostCode: [
          { required: true, message: '请填写邮编', trigger: 'blur' }
        ],
        serviceProviderCompanyAddressEn: [
          { required: true, message: '请填写街道详细地址', trigger: 'blur' }
        ],
        agreementTakeEffectDate: [
          { required: true, trigger: "change", message: "请选择协议生效日期", type: "date" }
        ],
        agreementExpiryDate: [
          { required: true, message: '请选择协议到期日期', trigger: 'change', type: "date" }
        ],
        labelFile: [
          { required: true, message: '请上传标签文件', trigger: 'change' }
        ],
      },
      supplierModal: false,
      consoleOperationLogs: [],
      detailInfo: {},
      noSub: false,
      saveLoading: false,
      submitLoading: false,
      finishBox: false,
      sendMassage: false,
      sureSuccessBox: false,
      detailModel: false,
      isCompanyInfoEdit: false,
      errorReason: '',
      submitResult: '',
      fileUpload: this.workOrderFile,
      lenovoSearchList: [],
      columns: [
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h('span', {
                  style: {
                    'color': 'red',
                    'marginRight': '3px'
                  }
                }, '*'),
                h('span', {
                  style: {
                    'color': '#333'
                  }
                }, 'Product Name/产品中文')
              ]),
              h('p', {
                style: {
                  'color': '#999'
                }
              }, '如：toy/玩具')
            ])
          },
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.productName,
                size: 'small',
                placeholder: '请填写Product Name/产品中文',
                maxlength: 100,
                disabled: !this.isCompanyInfoEdit
              },
              on: {
                input: val => {
                  this.submitForm.productList[params.index].productName = val
                }
              }
            })
          },
          align: 'center',
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h('span', {
                  style: {
                    'color': 'red',
                    'marginRight': '3px'
                  }
                }, '*'),
                h('span', {
                  style: {
                    'color': '#333'
                  }
                }, 'Brand')
              ]),
              h('p', {
                style: {
                  'color': '#999'
                }
              }, '填已注册备案的品牌，若未注册，可填写正在使用的品牌名')
            ])
          },
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.brand,
                size: 'small',
                placeholder: '请填写Brand',
                maxlength: 100,
                disabled: !this.isCompanyInfoEdit
              },
              on: {
                input: val => {
                  this.submitForm.productList[params.index].brand = val
                }
              }
            })
          },
          align: 'center',
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h('span', {
                  style: {
                    'color': 'red',
                    'marginRight': '3px'
                  }
                }, '*'),
                h('span', {
                  style: {
                    'color': '#333'
                  }
                }, 'Models')
              ]),
              h('p', {
                style: {
                  'color': '#999'
                }
              }, '若该类产品为区分/无型号，需与证书的保持一致')
            ])
          },
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.models,
                size: 'small',
                placeholder: '请填写Models',
                maxlength: 500,
                disabled: !this.isCompanyInfoEdit
              },
              on: {
                input: val => {
                  this.submitForm.productList[params.index].models = val
                }
              }
            })
          },
          align: 'center',
        },
        {
          renderHeader: (h, params) => {
            return h('div', [
              h('p', [
                h('span', {
                  style: {
                    'color': 'red',
                    'marginRight': '3px'
                  }
                }, '*'),
                h('span', {
                  style: {
                    'color': '#333'
                  }
                }, 'Classification')
              ]),
              h('p', {
                style: {
                  'color': '#999'
                }
              }, '（分类，需要与亚马逊大类目一致）')
            ])
          },
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.classification,
                size: 'small',
                placeholder: '请填写Classification',
                maxlength: 100,
                disabled: !this.isCompanyInfoEdit
              },
              on: {
                input: val => {
                  this.submitForm.productList[params.index].classification = val
                }
              }
            })
          },
          align: 'center',
        },
        // {
        //     renderHeader:(h,params)=>{
        //         return h('div',[
        //             h('p',[
        //                 h('span',{
        //                     style:{
        //                         'color':'#333'
        //                     }
        //                 },'Manufacturer')
        //             ]),
        //             h('p',{
        //                 style:{
        //                     'color':'#999'
        //                 }
        //             },'制造商名称（如与店铺企业不一致）')
        //         ])
        //     },
        //     render: (h, params) => {
        //         return h('Input', {
        //         props: {
        //             value: params.row.manufacturer,
        //             size: 'small',
        //             placeholder: '请填写Manufacturer',
        //             maxlength:100,
        //             disabled:!this.isCompanyInfoEdit
        //         },
        //         on: {
        //             input: val => {
        //             this.submitForm.productList[params.index].manufacturer = val
        //             }
        //         }
        //         })
        //     },
        //     align:'center',
        // },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      submitForm: {
        companyType: '1',
        companyBusinessLicense: '',
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        companyNameZh: '',
        companyCreditCode: '',
        companyNameEn: '',
        companyAddressEn: '',
        companyPostCode: '',
        shopHref: '',
        companyLegalPersonZh: '',
        companyLegalPersonPhone: '',
        contactNameZh: '',
        contactNamePhone: '',
        contactNameEmail: '',
        companyLegalPersonPinyin: '',
        companyLegalPersonMobilePhone: '',
        companyLegalPersonEmail: '',
        contactNameEn: '',
        contactNameMobilePhone: '',
        ceCertificate: '',
        ukcaCertificate: '',
        productDocumentations: [],
        productExaminationReport: '',
        docStatement: '',
        productList: [
          {
            productName: '',
            brand: '',
            models: '',
            classification: '',
            manufacturer: ''
          }
        ]
      },
      submitFormRules: {
        companyType: [
          { required: true, message: '请选择公司类型', trigger: 'blur' }
        ],
        companyNameZh: [
          { required: true, message: '请填写公司中文名称', trigger: 'blur' }
        ],
        companyLegalPersonEmail: [
          { required: true, message: '请填写法人邮箱', trigger: 'blur' },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        contactNameEmail: [
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyLegalPersonMobilePhone: [
          { required: true, message: '请填写法人手机号', trigger: 'blur' }
        ],
        companyLegalPersonPinyin: [
          { required: true, message: '请填写法人姓名拼音', trigger: 'blur' }
        ],
        companyLegalPersonPhone: [
          { required: true, message: '请填写法人联系电话', trigger: 'blur' }
        ],
        companyLegalPersonZh: [
          { required: true, message: '请填写法人中文名', trigger: 'blur' }
        ],
        shopHref: [
          { required: true, message: '请填写店铺后台链接', trigger: 'blur' }
        ],
        companyPostCode: [
          { required: true, message: '请填写公司所在地邮编号码', trigger: 'blur' }
        ],
        companyAddressEn: [
          { required: true, message: '请填写公司英文地址', trigger: 'blur' }
        ],
        companyNameEn: [
          { required: true, message: '请填写公司英文名称', trigger: 'blur' }
        ],
        companyCreditCode: [
          { required: true, message: '请填写统一社会信用代码', trigger: 'blur' }
        ],
        companyBusinessLicense: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        companyBusinessRegistrationBr: [
          { required: true, message: '请上传商业登记证BR扫描件', trigger: 'change' }
        ],
        companyRegistrationCi: [
          { required: true, message: '请上传公司注册证明书CI扫描件', trigger: 'change' }
        ],
        companyCorporateFoundingNnc1: [
          { required: true, message: '请上传法团成立表格NNC1扫描件', trigger: 'change' }
        ],
      },
      rejectAuthorizationModal:false,
      rejectAuthorizationReason:'',
      orderNo:'',
      orderRemark:'',
    }
  },
  methods: {
    finishBoxFunc(){
      if(this.submitForm.serviceProvidersCertificate==''){
        this.$Modal.warning({
          title: '温馨提醒',
          okText: '知道了',
          content: '系统检测到【欧盟授权代表】服务信息中，欧代证书为空，请您在【录入欧代信息】前，上传证书，注册完成后不再提供上传功能'
        });
        return
      }
      API.euroEnProxyNews({serviceProviderId:this.serviceInfo.serviceProviderId}).then(res=>{
        if(res.code == 0){
          this.enterRepFeil = {
            serviceProviderCompanyCountryEn:res.data.countryName,
            serviceProviderCompanyNameEn:res.data.supplierName,
            serviceProviderCompanyCityEn:res.data.city,
            serviceProviderCompanyTel:res.data.contactsTell,
            serviceProviderCompanyEmail:res.data.email,
            serviceProviderCompanyPostCode:res.data.postcode,
            serviceProviderCompanyAddressEn:res.data.supplierAddr,
            labelFile:res.data.supplierTempUrl,
            agreementTakeEffectDate: '',
            agreementExpiryDate: ''
          }
          this.finishBox = true
        }
      })
      
    },
    subAginCer(){
      this.$refs['subAginForm'].validate((valid) => {
        if (valid) {
          this.subAginForm.serviceId = this.serviceId
          API.subComplianAgin(this.subAginForm).then(res=>{
            if(res.code == 0){
              this.$Message.success('提交成功')
              this.subAginCerModel = false
              this.getDetail()
            }
          })
        }
      })
    },
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    getDetail() {
      API.getComplianceDetail({ serviceId: this.serviceId }).then(res => {
        if (res.code == 0) {

          if (JSON.stringify(res.data.authorisedRepresentativeWorkOrder) != '{}') {
            this.submitForm = res.data.authorisedRepresentativeWorkOrder
            this.submitForm.companyType = String(res.data.authorisedRepresentativeWorkOrder.companyType)
          }
          this.consoleOperationLogs = res.data.consoleOperationLogs
          this.serviceInfo = res.data.orderServices
          this.orderNo = res.data.orderNo
          this.orderRemark = res.data.remark
        }
      })
    },
    timeChange1(val) {
      let d = new Date(val)
      let y = d.getFullYear() + 1
      let m = (d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))
      let day = d.getDate() - 1
      if (this.finishBox) {
        this.enterRepFeil.agreementExpiryDate = y + '-' + m + '-' + day
      } else {
        this.enterRepFeil1.agreementExpiryDate = y + '-' + m + '-' + day
      }

    },
    timeChange2(val) {
      if (this.finishBox) {
        this.enterRepFeil.agreementExpiryDate = val
      } else {
        this.enterRepFeil1.agreementExpiryDate = val
      }

    },
    formatDate(date, type) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    finishBox1Func() {
      if(this.submitForm.serviceProvidersCertificate==''){
        this.$Modal.warning({
          title: '温馨提醒',
          okText: '知道了',
          content: '系统检测到【英国授权代表】服务信息中，英代证书为空，请您在【录入英代信息】前，上传证书，注册完成后不再提供上传功能'
        });
        return
      }
      API.euroEnProxyNews({serviceProviderId:this.serviceInfo.serviceProviderId}).then(res=>{
        if(res.code == 0){
          this.enterRepFeil1 = {
            serviceProviderCompanyNameEn:res.data.supplierName,
            serviceProviderCompanyTel:res.data.contactsTell,
            serviceProviderCompanyEmail:res.data.email,
            serviceProviderCompanyPostCode:res.data.postcode,
            serviceProviderCompanyAddressEn:res.data.supplierAddr,
            labelFile:res.data.supplierTempUrl,
            agreementTakeEffectDate: '',
            agreementExpiryDate: ''
          }
          this.finishBox1 = true
        }
      })
    },
    serviceProvidersChange() {
      this.auditForm.serviceProvidersCertificate = ''
      this.auditForm.serviceProvidersAgreement = ''
    },
    subCer() {
      if (this.auditForm.serviceProvidersAgreement == '') {
        this.$Message.error('请上传协议')
        return
      }
      let data = {
        serviceProvidersAgreement: this.auditForm.serviceProvidersAgreement,
        serviceProvidersCertificate: this.auditForm.serviceProvidersCertificate,
        serviceId: this.serviceId,
      }
      API.subComplian(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('上传成功')
          this.$emit('back')
          this.$emit('refresh')
        }
      })

    },
    audit() {
      if (this.auditForm.serviceProviderId == '' && this.auditForm.status == 1) {
        this.$Message.error('请先选择服务商')
        return
      }
      if (this.auditForm.status == 2 && this.auditForm.remark == '') {
        this.$Message.error('驳回原因不能为空')
        return
      }
      let data = {
        status: this.auditForm.status,
        remark: this.auditForm.remark,
        serviceProviderId:this.auditForm.serviceProviderId,
        serviceId: this.serviceId,
      }
      if(this.auditForm.status == 1){
        let item = this.serviceProvidersList.find(item=>item.id == this.auditForm.serviceProviderId)
        data.serviceProviders = item.supplierName
      }
      API.shenheComplian(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('审核成功')
          this.$emit('back')
          this.$emit('refresh')
        }
      })
    },
    // 驳回
    rejectAuthorization() {
      if (this.rejectAuthorizationReason == '') {
        this.$Message.error('驳回原因不能为空')
        return
      }
      let data = {
        status: this.auditForm.status,
        remark: this.rejectAuthorizationReason,
        serviceProviderId: this.auditForm.serviceProviderId,
        serviceId: this.serviceId,
      }
      API.shenheComplian(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('驳回成功')
          this.$emit('back')
          this.$emit('refresh')
        }
      })
    },
    download() {
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
      let formData = new FormData()
      formData.append('serviceId', this.serviceId)
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/authorisedRepresentativeManagement/down/material', true)
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
    saveFile() {
      this.saveLoading = true
      let data = { ...this.submitForm }
      data.serviceId = this.serviceId
      data.operationType = '1'
      API.saveOrSubmitCompliance(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('保存成功');
          this.saveLoading = false
        }
      })

    },
    submitFile() {
      this.submitLoading = true
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.submitForm.productList.length; i++) {
            if (this.submitForm.productList[i].productName == '' || this.submitForm.productList[i].brand == '' || this.submitForm.productList[i].models == '' || this.submitForm.productList[i].classification == '') {
              this.$Message.error('请填写产品信息')
              this.submitLoading = false
              this.sureSuccessBox = false
              this.noSub = true
              break
            } else {
              this.noSub = false
            }
          }
          if (this.submitForm.ceCertificate == '' && this.submitForm.productExaminationReport == '' && this.submitForm.docStatement == '' && this.submitForm.productDocumentations.length == 0) {
            if (this.detailObj.countryCode == 'GB' && this.submitForm.ukcaCertificate == '') {
              this.$Message.error('申请文件请至少选择一种上传')
              this.submitLoading = false
              this.sureSuccessBox = false
              return
            } else if (this.detailObj.countryCode == 'EU') {
              this.$Message.error('申请文件请至少选择一种上传')
              this.submitLoading = false
              this.sureSuccessBox = false
              return
            }

          }
          if (!this.noSub) {
            // console.log(this.submitForm)
            this.submitForm.serviceId = this.serviceId
            this.submitForm.operationType = '2'
            API.saveOrSubmitCompliance(this.submitForm).then(res => {
              if (res.code == 0) {
                this.$Message.success('提交成功')
                this.goBack()
                this.$emit('refresh')
              }
            })

          }
        } else {
          this.$Message.error('请完善资料后进行提交')
          this.submitLoading = false
          this.sureSuccessBox = false
          return
        }
        this.sureSuccessBox = false
        this.submitLoading = false
      })
    },
    addProduct() {
      this.submitForm.productList.push({
        productName: '',
        brand: '',
        models: '',
        classification: '',
        manufacturer: ''
      })
    },
    remove(index) {
      this.submitForm.productList.splice(index, 1);
    },
    previewFile(url, index) {
      // console.log(url)
      if (url == 'productDocumentations') {
        let u = this.submitForm.productDocumentations[index].fileUrl
        window.open(u)
      } else {
        window.open(url)
      }

    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    successHandler2(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      if (this.finishBox) {
        this.enterRepFeil[item] = res.data.fileUrl;
      } else {
        this.enterRepFeil1[item] = res.data.fileUrl;
      }

    },
    successHandler1(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.auditForm[item] = res.data.fileUrl;
    },
    successHandler3(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.subAginForm[item] = res.data.fileUrl;
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
      if (item == 'productDocumentations') {
        this.submitForm[item].push({
          fileUrl: res.data.fileUrl,
          fileName: res.data.origFileName
        })
      } else {
        this.submitForm[item] = res.data.fileUrl;
      }

      // console.log(this.submitForm)
    },
    removeHandler2(file, fileList, item, index) {
      let self = this;
      if (this.finishBox) {
        this.enterRepFeil[item] = "";
      } else {
        this.enterRepFeil1[item] = "";
      }

    },
    removeHandler1(file, fileList, item, index) {
      let self = this;
      this.auditForm[item] = "";
    },
    removeHandler3(file, fileList, item, index) {
      let self = this;
      this.subAginForm[item] = "";
    },
    removeHandler(file, fileList, item, index) {
      let self = this;
      if (item == 'productDocumentations') {
        this.submitForm[item].splice(index, 1)
      } else {
        this.submitForm[item] = "";
      }

    },
    //确认发送信息
    sureSendMassage() {
      API.sendXinxiTixing({ serviceId: this.serviceId }).then(res => {
        if (res.code == 0) {
          this.$Message.success('发送提醒成功')
        } else {
          this.$Message.warning(res.message)
        }

      })
    },
    //确认开始处理
    sureSuccessSubmit() {
      let data = {
        id: this.detailObj.id,
      }
      API.startChuli(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.goBack()
          this.$emit('refresh')
        }
      })
    },
    finishSubmit() {

      if (this.finishBox) {
        this.$refs['enterRepFeil'].validate((valid) => {
          if (valid) {
            this.enterRepFeil.agreementTakeEffectDate = this.formatDate(this.enterRepFeil.agreementTakeEffectDate, 'date')
            this.enterRepFeil.agreementExpiryDate = this.formatDate(this.enterRepFeil.agreementExpiryDate, 'date')
            this.enterRepFeil.serviceId = this.serviceId
            // console.log(this.enterRepFeil)
            API.enterComplian(this.enterRepFeil).then(res => {
              if (res.code == 0) {
                this.$Message.success('信息录入成功')
                this.goBack()
                this.$emit('refresh')
              }
            })

          } else {
            this.$Message.error('请完善资料后进行提交')
            return
          }
        })
      } else {

        this.$refs['enterRepFeil1'].validate((valid) => {
          if (valid) {
            this.enterRepFeil1.agreementTakeEffectDate = this.formatDate(this.enterRepFeil1.agreementTakeEffectDate, 'date')
            this.enterRepFeil1.agreementExpiryDate = this.formatDate(this.enterRepFeil1.agreementExpiryDate, 'date')
            this.enterRepFeil1.serviceId = this.serviceId
            // console.log(this.enterRepFeil1)
            API.enterComplian(this.enterRepFeil1).then(res => {
              if (res.code == 0) {
                this.$Message.success('信息录入成功')
                this.goBack()
                this.$emit('refresh')
              }
            })
          } else {
            this.$Message.error('请完善资料后进行提交')
            return
          }
        })
      }

    }
  },
  created() {
    if (this.detailObj.progressBar == 60) {
      this.isCompanyInfoEdit = true
    }
    if(this.detailObj.progressBar==61){
      let data = {}
      if(this.detailObj.countryCode == 'EU'){
        data.supplierType = '5'
      }else if(this.detailObj.countryCode == 'GB'){
        data.supplierType = '6'
      }
      API.showProvider(data).then(res=>{
        if(res.code == 0){
          this.serviceProvidersList = res.data
        }
      })
    }
    this.getDetail()
  },
}
</script>
<style lang="less" scoped>
/deep/ .ivu-upload {
  width: 300px;
}
/deep/ .ivu-form-item-content {
  width: 300px;
}
.sure-submit {
  font-size: 18px;
  text-align: center;
  padding: 30px 0;
  font-weight: 600;
}
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
      min-height: 34px;
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
    width: 409px;
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
}
.file-box {
  .fl {
    width: 110px;
    float: left;
  }
}
</style>