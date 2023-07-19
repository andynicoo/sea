<template>
    <div class="waitUploadWrapper">
        <div class="back" @click="goBack()"><Icon type="md-arrow-back" />返回列表</div>
        <div class="content">
           <div class="content-l">
                <Card>
                    <p slot="title" class="companyTitleBox">
                        <span>注册资料</span>
                        <span v-if="detailInfo.progressBar==0">
                            <!-- 0-待上传资料 -->
                            <Button type="primary" @click="sendMessage" ghost style="margin-right:10px">发送提醒</Button>
                            <Button type="primary" @click="submitFile">提交审核</Button>
                        </span>
                        <span v-if="detailInfo.progressBar==1">
                            <!-- 1-待审核资料 -->
                            <Button type="primary" ghost @click.once="downLoad" style="margin-right:10px;">下载资料</Button>
                            <Button type="primary" @click="auditModal=true">审核</Button>
                        </span>
                        <span v-if="detailInfo.progressBar==3">
                            <!-- 3-注册中 -->
                            <Button type="primary" @click="taxNumModal = true">录入税号信息</Button>
                        </span>
                        <span v-if="detailInfo.progressBar==4">
                            <!-- 4-注册完成 -->
                        </span>
                        <span v-if="detailInfo.progressBar==8">
                            <!-- 8-资料驳回 -->
                            <Button type="primary" @click="submitFile">重新提交</Button>
                        </span>
                    </p>
                    <div class="companyInfo">
                        <p class="classTitle">
                            <span>公司信息</span>
                            <span v-if="detailInfo.progressBar ==0 || detailInfo.progressBar ==8" @click="isCompanyInfoEdit = true">【修改】</span>
                        </p>
                        <Form ref="submitForm" :model="submitForm" :label-width=160>
                            <FormItem label="公司中文名称：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司中文名称" v-model="submitForm.companyNameZh" style="width:300px;" />
                            </FormItem>
                            <FormItem label="公司英文名称：" class="requiredItem">
                                <Input @on-blur="blur(1)" :disabled="!isCompanyInfoEdit" placeholder="请输入公司英文名称" v-model="submitForm.companyNameEn" style="width: 300px" />
                                <!-- <span style="color:#EE113D" v-if="!isEng">只能输入英文，如有标点符号请用空格代替</span> -->
                            </FormItem>
                            <FormItem label="公司中文地址：">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司中文地址" v-model="submitForm.companyAddressZh" style="width:300px;" />
                            </FormItem>
                            <FormItem label="公司英文地址："  class="requiredItem">
                                <Input v-model="submitForm.companyAddressEnCountry" :disabled="!isCompanyInfoEdit" placeholder="如:China" style="width:148px;margin-right:6px" />
                                <Input v-model="submitForm.companyAddressEnCity" :disabled="!isCompanyInfoEdit" placeholder="如：ShenZhen" style="width:148px;" /><br/>
                                <Input v-model="submitForm.companyAddressEn" :disabled="!isCompanyInfoEdit" placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替" style="width: 300px" type="textarea" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="统一信用代码：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入统一信用代码" v-model="submitForm.companyCreditCode" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="公司成立时间：" class="requiredItem">
                                <DatePicker @on-change="changeCompanyDate" :disabled="!isCompanyInfoEdit" type="date" placeholder="请选择公司成立时间" style="width: 300px" :value="submitForm.companyRegisterData" v-model="submitForm.companyRegisterData"></DatePicker>
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="公司电话：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司电话" v-model="submitForm.companyTel" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="公司邮箱：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入公司邮箱" v-model="submitForm.companyEmail" style="width: 300px" />
                            </FormItem>
                        </Form>
                    </div>
                    <div class="legalPersonInfo">
                        <p class="classTitle">
                            <span>法人信息</span>
                        </p>
                        <Form ref="submitForm" :model="submitForm" :label-width=160>
                            <FormItem label="法人中文姓名：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入法人中文姓名" v-model="submitForm.companyLegalPersonZh" style="width:300px;" />
                            </FormItem>
                            <FormItem label="法人英文姓名：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入法人英文姓名" v-model="submitForm.companyLegalPersonEn" style="width: 300px" />
                            </FormItem>
                            <FormItem label="法人出生日期：" class="requiredItem">
                                <DatePicker @on-change="changeLegalBirthDate" :disabled="!isCompanyInfoEdit" :value="submitForm.companyLegalPersonBirthday" v-model="submitForm.companyLegalPersonBirthday" type="date" placeholder="请选择法人出生日期" style="width: 300px"></DatePicker>
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="法人身份证地址：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入身份证地址" v-model="submitForm.companyLegalPersonCardAddress" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="法人出生地：" class="requiredItem">
                                <Select style="width:300px;" :disabled="!isCompanyInfoEdit" clearable v-model="submitForm.companyLegalPersonBirthplace" placeholder="请选择法人出生地" class="requiredItem">
                                    <Option
                                        v-for="(item,index)  in placeList"
                                        :value="item"
                                        :key="index"
                                        >{{item}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="法人联系邮箱：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入法人联系邮箱" v-model="submitForm.companyLegalPersonEmail" style="width: 300px" />
                            </FormItem>
                            <FormItem label="法人护照/身份证号码：" v-if="detailInfo.countryNameZh!=='德国'">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入法人护照/身份证号码" v-model="submitForm.companyLegalPersonCard" style="width: 300px" />
                                (个人店铺必填)
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="法人电话：">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入法人电话" v-model="submitForm.companyLegalPersonMobile" style="width: 300px" />
                            </FormItem>
                        </Form>
                    </div>
                    <div class="shopInfo">
                        <p class="classTitle">
                            <span>店铺信息</span>
                        </p>
                        <Form ref="submitForm" :model="submitForm" :label-width=180>
                            <FormItem label="平台店铺链接：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入平台店铺链接" v-model="submitForm.shopHref" style="width:300px;"/>
                            </FormItem>
                            <FormItem label="平台店铺名称：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入平台店铺名称" v-model="submitForm.shopName" style="width: 300px"/>
                            </FormItem>
                            <FormItem label="税号生效日期：" class="requiredItem">
                                <DatePicker @on-change="changeTaxNumDate" :disabled="!isCompanyInfoEdit" type="date" placeholder="请选择税号生效日期" style="width: 300px" :value="submitForm.shopTaxEffectiveData" v-model="submitForm.shopTaxEffectiveData"></DatePicker>
                            </FormItem>
                            <FormItem label="销售平台名称：" class="requiredItem">
                                <RadioGroup v-model="submitForm.shopSalePlatformName">
                                    <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">
                                        <span>亚马逊</span>
                                    </Radio>
                                    <Radio label="eBay" :disabled="!isCompanyInfoEdit">
                                        <span>eBay</span>
                                    </Radio>
                                    <Radio label="其他" :disabled="!isCompanyInfoEdit">
                                        <span>其他</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="今年预计销售额(欧元)：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入今年预计销售额" number v-model="submitForm.shopPredictSale" style="width: 300px"/>
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="明年预计销售额(欧元)：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" number placeholder="请输入明年预计销售额" v-model="submitForm.shopNextYearSale" style="width: 300px"/>
                            </FormItem>
                            <!-- <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="平台销售账号用户名：" class="requiredItem">
                                <Input v-model="submitForm.shopSalePlatformAccount" :disabled="!isCompanyInfoEdit" style="width: 300px;" placeholder="请输入平台销售账号用户名" />
                                (即店铺/公司英文名)
                            </FormItem> -->
                            <FormItem label="描述下公司经营内容：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入经营内容" v-model="submitForm.companyBusinessModeDescribe" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="未来12个月预计销售额(英镑)：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入未来12个月预计销售额" number v-model="submitForm.shopSalePlan" style="width: 300px" />
                            </FormItem>
                            <FormItem label="邮编号码：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请复制店铺后台的邮编号码" v-model="submitForm.shopPostCode" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="其他国家欧盟税号(如有可填写)：">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入其他国家欧盟税号" v-model="submitForm.shopOtherEuTaxNumber" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="德国仓库地址：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入德国仓库地址" v-model="submitForm.shopEntrepotAddress" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="物流承运商地址：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入物流承运商地址" v-model="submitForm.shopLogisticsCompany" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh=='德国'" label="物流承运商公司名称：" class="requiredItem">
                                <Input :disabled="!isCompanyInfoEdit" placeholder="请输入物流承运商公司名称" v-model="submitForm.shopLogisticsCompanyName" style="width: 300px" />
                            </FormItem>
                            <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="税率：" class="requiredItem">
                                <RadioGroup v-model="submitForm.shopTaxRate">
                                    <Radio :label="0" :disabled="!isCompanyInfoEdit">
                                        <span>低税率</span>
                                    </Radio>
                                    <Radio :label="1" :disabled="!isCompanyInfoEdit">
                                        <span>标准税率</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="是否已有EORI号：" class="requiredItem">
                                <RadioGroup v-model="submitForm.needEoriNumber">
                                    <Radio :label="1" :disabled="!isCompanyInfoEdit">
                                        <span>是</span>
                                    </Radio>
                                    <Radio :label="0" :disabled="!isCompanyInfoEdit">
                                        <span>否</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="FileInfo">
                        <p class="classTitle">
                            <span>文件信息</span>
                        </p>
                        <div class="companyFile">
                            <p class="classifyTitleBox">
                                <span class="classifyTitle">公司信息文件</span>
                                (以下两种请至少上传一种：公司营业执照扫描件 / 商业登记证BR扫描件、公司注册证明书CI扫描件、法团成立表格NNC1扫描件)
                            </p>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">公司营业执照:</p>                                   
                                </Col>
                                <Col span="18">
                                    <Upload
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :on-format-error="formatErrorHandler"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicense')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>
                                    <div v-if="submitForm.companyBusinessLicense">
                                        <div class="fileBox" v-if="submitForm.companyBusinessLicense!=''">
                                            <a  target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                                                {{"营业执照"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicense')"/>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row v-if="detailInfo.countryNameZh=='德国'">
                                <Col span="6">
                                    <p class="titleItem">公司营业执照翻译件:</p>                                   
                                </Col>
                                <Col span="18">
                                    <Upload
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :on-format-error="formatErrorHandler"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicenseTranslate')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessLicenseTranslate')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>
                                    <div v-if="submitForm.companyBusinessLicenseTranslate">
                                        <div class="fileBox" v-if="submitForm.companyBusinessLicenseTranslate!=''">
                                            <a target="_blank" @click="previewFile(submitForm.companyBusinessLicenseTranslate)">
                                                {{"营业执照翻译件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessLicenseTranslate')"/>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">商业登记证BR扫描件:</p>                
                                </Col>
                                <Col span="18">  
                                    <Upload
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-format-error="formatErrorHandler"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyBusinessRegistrationBr')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                  
                                    <div v-if="submitForm.companyBusinessRegistrationBr">
                                        <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr!=''">
                                            <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                                                {{"商业登记证BR扫描件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyBusinessRegistrationBr')"/>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">公司注册证明书CI扫描件:</p>
                                </Col>
                                <Col span="18">   
                                    <Upload
                                        ref="CIFILE"
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyRegistrationCi')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                 
                                    <div v-if="submitForm.companyRegistrationCi">
                                        <div class="fileBox" v-if="submitForm.companyRegistrationCi!=''">
                                            <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                                                {{"公司注册证明书CI扫描件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyRegistrationCi')"/>
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">法团成立表格NNC1扫描件:</p>
                                </Col>
                                <Col span="18"> 
                                    <Upload
                                        ref="NNC1FILE"
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyCorporateFoundingNnc1')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                   
                                    <div class="fileBox">
                                        <div v-if="submitForm.companyCorporateFoundingNnc1">
                                            <div v-if="submitForm.companyCorporateFoundingNnc1!=''">
                                                <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                                                    {{"法团成立表格NNC1扫描件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyCorporateFoundingNnc1')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div class="companyFile">
                                <p v-if="detailInfo.countryNameZh!=='德国'" class="classifyTitleBox">
                                    <span class="classifyTitle">法人信息文件</span>
                                    (以下两种请至少上传一种：法人身份证扫描件正反面/ 法人护照扫描件)
                                </p>
                                <p v-if="detailInfo.countryNameZh=='德国'" class="classifyTitleBox">
                                    <span class="classifyTitle">法人信息文件</span>
                                    (以下两种请至少上传一种：1.法人身份证扫描件正反面、身份证正反面翻译件/ 2.法人护照扫描件)
                                </p>
                            </div>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">法人身份证正反面扫描件:</p>
                                </Col>
                                <Col span="18"> 
                                    <Upload
                                        ref="NNC1FILE"
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFront')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                   
                                    <div class="fileBox">
                                        <div v-if="submitForm.companyLegalPersonCardFront">
                                            <div v-if="submitForm.companyLegalPersonCardFront!=''">
                                                <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                                                    {{"法人身份证正反面扫描件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFront')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row v-if="detailInfo.countryNameZh=='德国'">
                                <Col span="6">
                                    <p class="titleItem">法人身份证正反面翻译件:</p>
                                </Col>
                                <Col span="18"> 
                                    <Upload
                                        ref="NNC1FILE"
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFrontTranslate')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardFrontTranslate')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                   
                                    <div class="fileBox">
                                        <div v-if="submitForm.companyLegalPersonCardFrontTranslate">
                                            <div v-if="submitForm.companyLegalPersonCardFrontTranslate!=''">
                                                <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFrontTranslate)">
                                                    {{"法人身份证正反面翻译件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardFrontTranslate')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="6">
                                    <p class="titleItem">法人护照扫描件:</p>
                                </Col>
                                <Col span="18"> 
                                    <Upload
                                        ref="passportFILE"
                                        type="drag"
                                        :action="fileUpload"
                                        :data="{ prefix: '' }"
                                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                                        :on-remove="(file,fileList)=>{removeHandler(file,fileList,'companyLegalPersonCardPassport')}"
                                        :format="['jpg','jpeg','png','gif','pdf']"
                                        style="width:300px"
                                        :disabled='!isCompanyInfoEdit'
                                        :show-upload-list="false"
                                        >
                                        <div style="padding: 10px 0">
                                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                            <span>请拖拽文件到此区域上传或点击上传</span>
                                        </div>
                                    </Upload>                                   
                                    <div class="fileBox">
                                        <div v-if="submitForm.companyLegalPersonCardPassport">
                                            <div v-if="submitForm.companyLegalPersonCardPassport!=''">
                                                <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                                                    {{"法人护照扫描件"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','companyLegalPersonCardPassport')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div class="otherFileBox" v-if="detailInfo.countryNameZh!=='德国'">
                                <p class="classifyTitleBox">
                                    <span class="classifyTitle">其他证明文件</span>
                                    (以下七种资料请至少选择两种上传)
                                </p>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">工作证明:</p>
                                    </Col>
                                    <Col span="18">  
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'certificateOfEmployment')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'certificateOfEmployment')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>                                  
                                        <div class="fileBox">
                                            <div v-if="submitForm.certificateOfEmployment">
                                                <div v-if="submitForm.certificateOfEmployment!=''">
                                                    <a target="_blank" @click="previewFile(submitForm.certificateOfEmployment)">
                                                        {{"工作证明"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','certificateOfEmployment')"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">租房合同:</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'leaseAgreement')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'leaseAgreement')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox">
                                            <div v-if="submitForm.leaseAgreement">
                                                <div v-if="submitForm.leaseAgreement!=''">
                                                    <a target="_blank" @click="previewFile(submitForm.leaseAgreement)">
                                                        {{"租房合同"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','leaseAgreement')"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">结婚证：</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'marriageLicense')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'marriageLicense')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox">
                                            <div v-if="submitForm.marriageLicense">
                                                <div v-if="submitForm.marriageLicense!=''">
                                                    <a target="_blank" @click="previewFile(submitForm.marriageLicense)">
                                                        {{"结婚证"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','marriageLicense')"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">离婚证：</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'divorceCertificate')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'divorceCertificate')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox">
                                            <div v-if="submitForm.divorceCertificate">
                                                <div v-if="submitForm.divorceCertificate!=''">
                                                    <a target="_blank" @click="previewFile(submitForm.divorceCertificate)">
                                                        {{"离婚证"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','divorceCertificate')"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">房产证：</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'houseProprietaryCertificate')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'houseProprietaryCertificate')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox" v-if="submitForm.houseProprietaryCertificate">
                                            <div v-if="submitForm.houseProprietaryCertificate!=''">
                                                <a target="_blank" @click="previewFile(submitForm.houseProprietaryCertificate)">
                                                    {{"房产证"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','houseProprietaryCertificate')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">出生证/户口本（户主页+本人页）：</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'birthCertificate')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'birthCertificate')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox" v-if="submitForm.birthCertificate">
                                            <div v-if="submitForm.birthCertificate!=''">
                                                <a target="_blank" @click="previewFile(submitForm.birthCertificate)">
                                                    {{"出身证/户口本"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','birthCertificate')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">房屋贷款明细：</p>
                                    </Col>
                                    <Col span="18"> 
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'otherCertificate')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'otherCertificate')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>
                                        <div class="fileBox" v-if="submitForm.otherCertificate">
                                            <div v-if="submitForm.otherCertificate!=''">
                                                <a target="_blank" @click="previewFile(submitForm.otherCertificate)">
                                                    {{"其他证明"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','otherCertificate')"/>
                                                </a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div class="shopCut">
                                <p class="classifyTitleBox">
                                    <span class="classifyTitle">后台店铺截图</span>
                                </p>
                                <Row>
                                    <Col span="6">
                                        <p class="titleItem">后台店铺截图：</p>
                                    </Col>
                                    <Col span="18">  
                                        <Upload
                                            ref="NNC1FILE"
                                            type="drag"
                                            :action="fileUpload"
                                            :data="{ prefix: '' }"
                                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'shopConsoleScreenshot')}"
                                            :format="['jpg','jpeg','png','gif','pdf']"
                                            style="width:300px"
                                            :disabled='!isCompanyInfoEdit'
                                            :show-upload-list="false"
                                            >
                                            <div style="padding: 10px 0">
                                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                                <span>请拖拽文件到此区域上传或点击上传</span>
                                            </div>
                                        </Upload>                                  
                                        <div class="fileBox">
                                            <div v-if="submitForm.shopConsoleScreenshot">
                                                <div v-if="submitForm.shopConsoleScreenshot!=''">
                                                    <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                                                        {{"后台店铺截图"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','shopConsoleScreenshot')"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            <p class="fileBtn" v-if="isCompanyInfoEdit">
                                <Button type="primary" ghost @click="saveFile" style="margin-right: 10px;" :loading="saveLoading">保存</Button>
                                <!-- <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button> -->
                            </p>
                        </div>
                        
                    </div>
                </Card>
            </div>
            <div class="content-r">
                <Card v-if="detailInfo.progressBar ==3 || detailInfo.progressBar ==4">
                    <p slot="title">税号信息</p>
                    <Form :label-width=100>
                            <FormItem label='VAT税号：'>
                        <span>{{detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber: "暂无"}}</span>
                        </FormItem>
                        <FormItem label='税号下发日期：'>
                            <span>{{detailInfo.taxIssueDate ? detailInfo.taxIssueDate : "暂无"}}</span>
                        </FormItem>
                        <FormItem label='税号生效日期：'>
                            <span>{{detailInfo.taxEffectiveDate ? detailInfo.taxEffectiveDate : "暂无"}}</span>
                        </FormItem>
                        <FormItem label='申报周期：'>
                            <span>{{detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? "季报" : detailInfo.periodType == -1 ? '暂无' :""}}</span>
                        </FormItem>
                        <FormItem label='VAT税号文件：' >
                            <a :href="detailInfo.vatTaxNumberFile" target="_blank" v-if="detailInfo.vatTaxNumberFile!==''">{{"VAT税号文件"}}</a>
                            <span v-if="detailInfo.vatTaxNumberFile==''">暂无</span>
                        </FormItem>
                        <FormItem label='EORI号：'>
                            <span>{{detailInfo.eoriNumber?detailInfo.eoriNumber:"暂无"}}</span>
                        </FormItem>
                        <FormItem label='VAT证书：' v-if="detailInfo.progressBar ==4">
                            <span v-if="detailInfo.vatCertificate==''">暂无</span>
                            <a v-else :href="detailInfo.vatCertificate" target="_blank">点击查看</a>
                            <span @click="vatCertificateFileModal=true" style="margin-left:10px;cursor:pointer;">{{detailInfo.vatCertificate==''?'点击上传':'重新上传'}}</span>
                        </FormItem>
                        <FormItem label="gateway 账号：" v-if="detailInfo.countryCode=='GB'&&detailInfo.progressBar ==4">
                            <span>{{detailInfo.gatewayId}}</span>
                        </FormItem>
                        <FormItem label="gateway 密码：" v-if="detailInfo.countryCode=='GB'&&detailInfo.progressBar ==4">
                            <span>{{detailInfo.gatewayPassword}}</span>
                        </FormItem>
                    </Form>
                </Card>
                <Card>
                    <p slot="title">服务信息</p>
                    <Form :label-width=100>
                        <FormItem label="订单号：">
                            <span>{{orderNo}}</span>
                        </FormItem>
                        <FormItem label="工单号：">
                            <span>{{detailInfo.workNo}}</span>
                        </FormItem>
                        <FormItem label="注册状态：">
                            <span>{{detailInfo.progressBar == '0' ? "待上传资料" : detailInfo.progressBar == '1' ? "待审核资料" : detailInfo.progressBar == '3' ? "注册中" : detailInfo.progressBar == '4' ? "注册完成" :  detailInfo.progressBar == '8' ?"资料驳回" : ''}}</span>
                        </FormItem>
                        <FormItem label="服务公司：">
                            <span>{{detailInfo.companyName}}</span>
                        </FormItem>
                        <FormItem label="服务名称：">
                            <!-- <span>{{detailInfo.productName}}</span> -->
                            <span>{{ detailInfo.productFunctionCode == '1' ? "税号注册" : detailInfo.productFunctionCode == '2' ? "税务申报" : detailInfo.productFunctionCode == '3' ? "税务补缴" : detailInfo.productFunctionCode == '4' ? "转代理" : detailInfo.productFunctionCode == '5' ? "注册+申报" : ''}}</span>
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
            <Modal v-model="taxNumModal" title="录入税号">
                <Form :label-width="130">
                    <FormItem label="VAT税号：" class="requiredItem">
                        <Input v-model="addTaxNum.vatTaxNumber" placeholder="请输入VAT税号" style="width:200px" />
                    </FormItem>
                    <FormItem label="税号下发日期：" class="requiredItem">
                        <DatePicker @on-change="changeTax1" v-model="addTaxNum.taxIssueDate" type="date" placeholder="请选择税号下发日期" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="税号生效日期：" class="requiredItem">
                        <DatePicker @on-change="changeTax2" v-model="addTaxNum.taxEffectiveDate" type="date" placeholder="请选择税号生效日期" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="EORI号：">
                        <Input v-model="addTaxNum.eoriNumber" placeholder="请输入EORI号" style="width:200px" />
                    </FormItem>
                    <FormItem label="VAT税号文件：" class="requiredItem">
                        <Upload
                            ref="vatFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :before-upload="beforeVatFileUpload"
                            :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                            :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}"
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <p>请拖拽文件到此区域上传或点击上传</p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="VAT证书：" v-if="detailInfo.countryNameZh != '德国'">
                        <Upload
                            ref="vatFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :before-upload="beforeVatFileUpload"
                            :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatCertificate')}"
                            :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatCertificate')}"
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <p>请拖拽文件到此区域上传或点击上传</p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="DE欧盟证书：" v-if="detailInfo.countryNameZh=='德国'">
                        <Upload
                            ref="vatFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :before-upload="beforeVatFileUpload"
                            :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'deEuCertificate')}"
                            :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'deEuCertificate')}"
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <p>请拖拽文件到此区域上传或点击上传</p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="税务副本：" v-if="detailInfo.countryNameZh=='德国'">
                        <Upload
                            ref="vatFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :before-upload="beforeVatFileUpload"
                            :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberCopyFile')}"
                            :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberCopyFile')}"
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <p>请拖拽文件到此区域上传或点击上传</p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="EORI文件：">
                        <Upload
                            ref="vatFile"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :before-upload="beforeVatFileUpload"
                            :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'eoriNumberFile')}"
                            :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'eoriNumberFile')}"
                            >
                            <div style="padding: 10px 0">
                                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                                <p>请拖拽文件到此区域上传或点击上传</p>
                            </div>
                        </Upload>
                    </FormItem>
                    <FormItem label="gateway ID：" v-if="detailInfo.countryNameZh=='英国'">
                        <Input v-model="addTaxNum.gatewayId" placeholder="请输入gateway ID" style="width:200px" />
                    </FormItem>
                    <FormItem label="密码：" v-if="detailInfo.countryNameZh=='英国'">
                        <Input v-model="addTaxNum.gatewayPassword" placeholder="请输入密码" style="width:200px" />
                    </FormItem>
                </Form>
                <p slot="footer">
                    <Button @click="cancelEnter">取消</Button>
                    <Button type="primary" @click="enterTaxNumInfo">提交</Button>
                </p>
            </Modal>
            <Modal v-model="vatCertificateFileModal" title="上传VAT证书">
               <Upload
                    ref="taxFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreVATcarUpload"
                    :on-success="VATcarUploadSuccess"
                    :on-remove="removeVATcar"
                    style="width:260px"
                    >
                    <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                </Upload>
                <p slot="footer">
                    <Button type="primary" ghost style="margin-right:20px;" @click="vatCertificateFileModal=false">取消</Button>
                    <Button type="primary" @click="sureUploadVATcar">确认</Button>
                </p>
            </Modal>
        </div>
    </div>
</template>
<script>
import * as API from '@/api/taxService/workOrder.js';
import * as API1 from '@/api/taxService/regAndDeclare.js';
import * as API2 from '@/api/taxService/taxModule.js';
import { getToken } from '@/libs/util';
export default {
    props: ['id','progressBar'],
    data() {
        return {
            fileUpload: this.workOrderFile,
            isCompanyInfoEdit: false,
            auditModal: false,
            vatCertificateFileModal:false,
            isAudit: '1',
            remark: '',//驳回原因
            salePlatName: '',
            companyBusinessLicense: [],//营业执照文件
            companyBusinessRegistrationBr: [],//商业登记证文件
            companyRegistrationCi: [],//CI扫描件
            companyCorporateFoundingNnc1: [], //法团成立表格NNC1扫描件,
            taxNumModal: false,//录入税号信息modal
            addTaxNum:{
                vatTaxNumber:'',
                taxIssueDate:'',
                taxEffectiveDate:'',
                eoriNumber:'',
                vatTaxNumberFile:'',
                vatCertificate:'',
                gatewayId:'',
                gatewayPassword:'',
                eoriNumberFile: '',
                vatTaxNumberCopyFile: '',
                deEuCertificate: ''
            },//录入税号信息
            detailInfo: {},
            fileInfo:{},//文件信息
            placeList:[],//法人出生地
            isEng: true,
            submitForm:{
                companyNameZh:'',
                companyNameEn:'',
                companyAddressZh:'',
                companyAddressEnCountry:'',
                companyAddressEnCity:'',
                companyAddressEn:'',
                companyCreditCode:'',
                companyRegisterData:'',
                companyTel:'',
                companyEmail:'',
                companyLegalPersonZh:'',
                companyLegalPersonEn:'',
                companyLegalPersonBirthday:'',
                companyLegalPersonCardAddress:'',
                companyLegalPersonBirthplace:'',
                companyLegalPersonEmail:'',
                companyLegalPersonCard:'',
                companyLegalPersonMobile:'',
                shopHref:'',
                shopName:'',
                shopTaxEffectiveData:'',
                shopSalePlatformName:'',
                // shopPredictSale:'',
                // shopNextYearSale:'',
                companyBusinessModeDescribe:'',
                // shopSalePlan:'',
                shopPostCode:'',
                shopOtherEuTaxNumber:'',
                shopEntrepotAddress:'',
                shopLogisticsCompany:'',
                shopLogisticsCompanyName:'',
                shopTaxRate:'',
                needEoriNumber:'',
                companyBusinessLicense:'',
                companyBusinessLicenseTranslate:'',
                companyBusinessRegistrationBr:'',
                companyRegistrationCi:'',
                companyCorporateFoundingNnc1:'',
                companyLegalPersonCardFront:'',
                companyLegalPersonCardFrontTranslate:'',
                companyLegalPersonCardPassport:'',
                certificateOfEmployment:'',
                leaseAgreement:'',
                marriageLicense:'',
                divorceCertificate:'',
                houseProprietaryCertificate:'',
                birthCertificate:'',
                otherCertificate:'',
                shopConsoleScreenshot:''
            },
            saveLoading:false,
            submitLoading:false,
            vatCertificate:'',
            orderNo: ''
        }
    },
    mounted() {
        this.getregisterInfo()
        this.getBirthPlace()
    },
    methods: {
        //获取法人出生地
        getBirthPlace() {
            API.getBirthPlace().then((res) => {
                if(res.code == 0) {
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
            API1.getRegDetailInfo({serviceId: this.id}).then((res) => {
                if(res.code == 0) {
                    this.orderNo = res.data.orderNo
                    this.detailInfo = res.data.orderServices
                    this.isCompanyInfoEdit=res.data.orderServices.progressBar==0?true:false
                    this.detailInfo.beginTime=res.data.orderServices.beginTime.substring(0,7)
                    this.detailInfo.endTime=res.data.orderServices.endTime.substring(0,7)
                    if(JSON.stringify(res.data.registerWorkOrder) != '{}'){
                        this.submitForm=res.data.registerWorkOrder
                    }
                }else {
                    this.$Message.warning(res.message)
                }
            })
            .catch(err => console.log(err))
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
        //选择税号下发时间
        changeTax1(val) {
            this.addTaxNum.taxIssueDate = val;
        },
      //下载注册资料
        downLoad() {
            let self = this;
            // API.downLoadRegiFile({workId: this.id}).then((res) => {
            //     if(res.code == 0) {
            //         // window.open(res.data.fileUrl)
            //         console.log('下载then')
            //         const content = res
            //         const blob = new Blob([content.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
            //         const fileNameSplit = res.headers['content-disposition'].split('=')
            //         const fileName = decodeURI(fileNameSplit[fileNameSplit.length - 1])
            //         console.log('fileName',fileName)

            //     }else {
            //         this.$Message.warning(res.message)
            //     }
            // })
            // .catch(err => console.log(err))

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
                if(xmlResquest.getResponseHeader('content-disposition')){
                    fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
                }else{
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
                workId: this.submitForm.id,
                status: this.isAudit,
                remark: this.remark
            }
            if(this.isAudit == 1) {
                delete params.remark
            }
            API1.auditInfo(params).then((res) => {
                if(res.code == 0) {
                    this.$Message.success('审核成功')
                    this.auditModal = false
                    this.$emit('refresh')
                }else {
                    this.$Message.warning(res.message)
                }
            })
            .catch(err => console.log(err))
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
        //提交录入税号信息 
        enterTaxNumInfo() {
            if(this.addTaxNum.vatTaxNumber === '') {
                this.$Message.warning('VAT税号不能为空');
                return
            }
            if(this.addTaxNum.taxIssueDate === '') {
                this.$Message.warning('税号下发日期不能为空');
                return
            }
            if(this.addTaxNum.taxEffectiveDate === '') {
                this.$Message.warning('税号生效日期不能为空');
                return
            }
            if(this.addTaxNum.vatTaxNumberFile =='') {
                this.$Message.warning('VAT税号文件不能为空');
                return
            }
            
            let params={...this.addTaxNum}
            params.workId=this.submitForm.id
            // console.log('录入税号params',params);
            API1.logTaxInfo(params).then((res) => {
                if(res.code == 0) {
                    this.$emit('refresh')
                    this.$Message.success("录入税号成功")
                    this.taxNumModal = false;
                    this.this.addTaxNum={}
                }else {
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
        beforeVatFileUpload() {},
        //税号文件上传成功
        vatFileUploadSuccess(res,file,fileList,item) {
            let self = this;
            if (res.code !== 0) {
                self.$Notice.warning({
                title: "警告",
                desc: "请尝试再次上传"
                });
                return false;
            }
            this.addTaxNum[item]=res.data.fileUrl
        },
        //移除税号文件
        removeVatFile(file,fileList) {
            this.addTaxNum[item]=0
        },
        //发送提醒
        sendMessage() {
            let params = {
                serviceId: this.detailInfo.id
            }
            this.$Modal.confirm({
                title: '是否发送短信',
                content: '',
                onOk: () => {
                    API.sendMessage(params).then(res => {
                        if(res.code == 0) {
                            this.$Message.success('发送提醒成功')
                        }else {
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
            let reg=/^(?!_)([A-Za-z ]+)$/;
            if(type == 1) {
                if(!reg.test(this.submitForm.companyNameEn)) {
                    this.isEng = false;
                }else {
                    this.isEng = true;
                }
            }
        },
        //提交
        submitFile(){
            this.submitLoading=true
            let data ={...this.submitForm}
            data.servicesId=this.id
            API1.submitRegInfo(data).then(res=>{
                if(res.code===0){
                    this.$Message.success('提交成功')
                    window.scroll(0, 0);
                    this.$emit('refresh')
                }
            }).finally(()=>{
                this.submitLoading=false
            })
            // console.log(this.submitForm)
        },
        //保存
        saveFile(){
            this.saveLoading=true
            let data ={...this.submitForm}
            data.servicesId=this.id
            API1.saveRegInfo(data).then(res=>{
                this.$Message.success('保存成功')
                window.scroll(0, 0);
            }).finally(()=>{
                this.saveLoading=false
            })
        },
         //报税信息弹窗=选择申报区间
        dateChange(date,type) {
            if(type==0){
                this.fileTaxForm.beginTime = date;
            }else if(type==1){
                this.fileTaxForm.endTime = date;
            }
        },
        //填写报税信息
        sureFileTax(){
            // console.log(this.fileTaxForm)
            let params = {...this.fileTaxForm}
            // console.log(this.id)
            params.servicesId=this.id
            API.firstDeclear(params).then((res) => {
                if(res.code == 0) {
                    this.$Message.success('报税信息填写成功');
                    this.$emit('refresh')
                }else {
                    this.$Message.warning(res.message)
                }
            })
            .catch(err => console.log(err))
        },
        beroreVATcarUpload(){},
        VATcarUploadSuccess(res,file,fileList){
            this.vatCertificate=res.data.fileUrl
        },
        removeVATcar(file,fileList){
            this.vatCertificate=''
        },
        //确认上传VAT证书
        sureUploadVATcar(){
            let data={
                vatCertificate:this.vatCertificate,
                workId:this.submitForm.id
            }
            API2.uploadVatCertificate(data).then(res=>{
                if(res.code===0){
                    this.$Message.success('上传成功')
                    this.getregisterInfo()
                    this.vatCertificateFileModal=false
                }
            })
        }
    }
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
            .fileBtn {
                text-align: center;
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
            height: 34px;
            line-height: 34px;
        }
    }
</style>