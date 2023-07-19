<template>
    <div>
        <div class="back">
            <p @click="goBack()" class="backBtn">
                <Icon type="md-arrow-back"/>返回列表
            </p>
        </div>
        <p class="title">用户信息</p>
        <div class="userInfo">
            <Row>
                <Col span="8"><p class="name-title">用户ID：</p><span>{{userDetail.userId}}</span></Col>
                <Col span="8"><p class="name-title">用户昵称：</p><span>{{userDetail.userNickname}}</span></Col>
                <Col span="8"><p class="name-title">登录账号：</p><span>{{userDetail.userMobile}}</span></Col>
            </Row>
            <Row>
                <Col span="8"><p class="name-title">用户邮箱：</p><span>{{userDetail.userEmail}}</span></Col>
                <Col span="8"><p class="name-title">用户级别：</p><span></span></Col>
                <Col span="8"><p class="name-title">用户来源：</p><span>{{userDetail.source==0?'PC网页端':userDetail.source==1?'微信小程序':userDetail.source==3?'APP':''}}</span></Col>
            </Row>
            <Row>
                <Col span="8"><p class="name-title">公司名称：</p><span>{{userDetail.userCompanyName}}</span></Col>
                <Col span="8"><p class="name-title">地址：</p><span>{{userDetail.country}}{{userDetail.province}}{{userDetail.city}}</span></Col>
                <Col span="8"><p class="name-title">注册时间：</p><span>{{userDetail.createTime}}</span></Col>
            </Row>
        </div>
         <p class="title">服务信息</p>
         <div class="serviceInfo" v-for="(item,index) in servicesOrderDetail" :key="index">
             <Row>
                <Col span="6">
                    <p class="userinfoType">VAT信息</p>
                    <div class="bottom-box" v-if="item.orderServices">
                        <p class="userContent">
                            <span class="left">服务名称：</span>
                            <span class="right">{{item.orderServices.countryNameZh}}{{item.orderServices.productFunctionCode==1?'税号注册':item.orderServices.productFunctionCode==2?'转代理申报':item.orderServices.productFunctionCode==5?'注册+申报':''}}</span>
                        </p>
                        <p class="userContent">
                            <span class="left">服务号：</span>
                            <span>{{item.orderServices.serverNo}}</span>
                        </p>
                        <p class="userContent">
                            <span class="left">服务国家：</span>
                            {{item.orderServices.countryNameZh}}
                        </p>
                        <p class="userContent">
                            <span class="left">申报次数：</span>
                            {{item.orderServices.declareCout}}
                        </p>
                        <p class="userContent">
                            <span class="left">服务进度：</span>
                            {{taxStatus(item.orderServices.progressBar)}}
                        </p>
                    </div>
                </Col>
                <Col span="6" v-if="item.orderServices.productFunctionCode==1||item.orderServices.productFunctionCode==5">
                    <p class="userinfoType" >注册资料</p>
                    <div class="bottom-box">
                        <div v-if="JSON.stringify(item.registerWorkOrder)!='{}' && item.orderServices.countryCode=='IT'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司中文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyAddressEnCountry}}{{item.registerWorkOrder.companyAddressEnCity}}{{item.registerWorkOrder.companyAddressEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司统一社会信用代码：</span>
                                <span class="fl">{{item.registerWorkOrder.companyCreditCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人英文姓名：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl"> 身份证/护照号码：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonCard}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人身份证英文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonCardAddress}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生地：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonBirthplace}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生日期：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonBirthday}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺链接：</span>
                                <span class="fl">{{item.registerWorkOrder.shopHref}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否有EORI号：</span>
                                <span class="fl">{{item.registerWorkOrder.needEoriNumber==0?'否':'是'}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">税号生效日期：</span>
                                <span class="fl">{{item.registerWorkOrder.shopTaxEffectiveData}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司经营内容：</span>
                                <span class="fl">{{item.registerWorkOrder.companyBusinessModeDescribe}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">货物进口及配送流程：</span>
                                <span class="fl">{{item.registerWorkOrder.shippingProcess}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否使用意大利任何仓库：</span>
                                <span class="fl">{{item.registerWorkOrder.useEntrepot==1?'是':'否'}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否开通泛欧：</span>
                                <span class="fl">{{item.registerWorkOrder.dredgeEuronext==1?'否':'是'}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否有欧盟其他国家税号：</span>
                                <span class="fl">{{item.registerWorkOrder.shopOtherEuTaxNumber}}</span>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessLicense!==''">
                                <span class="regLeft fl">营业执照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessLicense" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessRegistrationBr!=''">
                                <span class="regLeft fl">商业登记证BR：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessRegistrationBr" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyRegistrationCi!=''">
                                <span class="regLeft fl">公司注册证明书CI：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyRegistrationCi" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyCorporateFoundingNnc1!=''">
                                <span class="regLeft fl">发团成立表格NNC1：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyCorporateFoundingNnc1" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardFront!=''">
                                <span class="regLeft fl">身份证正反面扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardFront" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardPassport!=''">
                                <span class="regLeft fl">护照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardPassport" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyCreditReport!=''">
                                <span class="regLeft fl">公司信用报告：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyCreditReport" target="_blank">查看</a>
                            </p>
                        </div>
                        <div v-if="JSON.stringify(item.registerWorkOrder)!='{}' && item.orderServices.countryCode=='DE'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司中文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司中文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyAddressZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyAddressEnCountry}}{{item.registerWorkOrder.companyAddressEnCity}}{{item.registerWorkOrder.companyAddressEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司邮箱：</span>
                                <span class="fl">{{item.registerWorkOrder.companyEmail}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司电话：</span>
                                <span class="fl">{{item.registerWorkOrder.companyTel}}</span>
                            </p>
                           <!-- 法人信息 -->
                           <p class="userContent clearfix">
                                <span class="regLeft fl">法人中文姓名：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人英文姓名：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人身份证英文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonCardAddress}}</span>
                            </p>
                      
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生日期：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonBirthday}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人身份证地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonCardAddress}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人邮箱：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonEmail}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人电话：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonMobile}}</span>
                            </p>
                            <!-- 店铺信息 -->
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺链接：</span>
                                <span class="fl">{{item.registerWorkOrder.shopHref}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺名称：</span>
                                <span class="fl">{{item.registerWorkOrder.shopName}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">销售平台名称：</span>
                                <span class="fl">{{item.registerWorkOrder.shopSalePlatformName}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">税号生效日期：</span>
                                <span class="fl">{{item.registerWorkOrder.shopTaxEffectiveData}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">今年预计销售额：</span>
                                <span class="fl">{{item.registerWorkOrder.shopPredictSale}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">明年预计销售额：</span>
                                <span class="fl">{{item.registerWorkOrder.shopNextYearSale}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司经营内容：</span>
                                <span class="fl">{{item.registerWorkOrder.companyBusinessModeDescribe}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">邮编号码：</span>
                                <span class="fl">{{item.registerWorkOrder.shopPostCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否有EORI号：</span>
                                <span class="fl">{{item.registerWorkOrder.needEoriNumber==0?'否':'是'}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否有其他欧盟税号：</span>
                                <span class="fl">{{item.registerWorkOrder.shopOtherEuTaxNumber}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">德国仓库地址：</span>
                                <span class="fl">{{item.registerWorkOrder.shopEntrepotAddress}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">物流承运商公司名称：</span>
                                <span class="fl">{{item.registerWorkOrder.shopLogisticsCompanyName}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">物流承运商地址：</span>
                                <span class="fl">{{item.registerWorkOrder.shopLogisticsCompany}}</span>
                            </p>
                            <!-- 文件信息 -->
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessLicense!==''">
                                <span class="regLeft fl">营业执照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessLicense" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessLicenseTranslate!==''">
                                <span class="regLeft fl">营业执照翻译扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessLicenseTranslate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessRegistrationBr!=''">
                                <span class="regLeft fl">商业登记证BR：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessRegistrationBr" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyRegistrationCi!=''">
                                <span class="regLeft fl">公司注册证明书CI：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyRegistrationCi" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyCorporateFoundingNnc1!=''">
                                <span class="regLeft fl">发团成立表格NNC1：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyCorporateFoundingNnc1" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardFront!=''">
                                <span class="regLeft fl">身份证正反面扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardFront" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardFront!=''">
                                <span class="regLeft fl">身份证正反面翻译扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardFrontTranslate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardPassport!=''">
                                <span class="regLeft fl">护照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardPassport" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.shopConsoleScreenshot!=''">
                                <span class="regLeft fl">店铺后台截图：</span>
                                <a class="fl" :href="item.registerWorkOrder.shopConsoleScreenshot" target="_blank">查看</a>
                            </p>
                        </div>
                        <div v-if="JSON.stringify(item.registerWorkOrder)!='{}' && item.orderServices.countryCode=='GB'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司中文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.registerWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司中文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyAddressZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">邮编号码：</span>
                                <span class="fl">{{item.registerWorkOrder.shopPostCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司统一社会信用代码：</span>
                                <span class="fl">{{item.registerWorkOrder.companyCreditCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司成立日期：</span>
                                <span class="fl">{{item.registerWorkOrder.companyRegisterData}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.registerWorkOrder.companyAddressEnCountry}}{{item.registerWorkOrder.companyAddressEnCity}}{{item.registerWorkOrder.companyAddressEn}}</span>
                            </p>
                            <!-- 法人信息 -->
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人中文姓名：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人英文姓名：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生日期：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonBirthday}}</span>
                            </p>
                             <p class="userContent clearfix">
                                <span class="regLeft fl">法人邮箱：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonEmail}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生地：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonBirthplace}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl"> 身份证/护照号码：</span>
                                <span class="fl">{{item.registerWorkOrder.companyLegalPersonCard}}</span>
                            </p>
                            <!-- 店铺信息 -->
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺链接：</span>
                                <span class="fl">{{item.registerWorkOrder.shopHref}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺名称：</span>
                                <span class="fl">{{item.registerWorkOrder.shopName}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">销售平台名称：</span>
                                <span class="fl">{{item.registerWorkOrder.shopSalePlatformName}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">是否有EORI号：</span>
                                <span class="fl">{{item.registerWorkOrder.needEoriNumber==0?'否':'是'}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">税号生效日期：</span>
                                <span class="fl">{{item.registerWorkOrder.shopTaxEffectiveData}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司经营内容：</span>
                                <span class="fl">{{item.registerWorkOrder.companyBusinessModeDescribe}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">未来12个月预计销售额：</span>
                                <span class="fl">{{item.registerWorkOrder.shopSalePlan}}</span>
                            </p>
                             <p class="userContent clearfix">
                                <span class="regLeft fl">税率：</span>
                                <span class="fl">{{item.registerWorkOrder.shopTaxRate==0?'低税率':item.registerWorkOrder.shopTaxRate==1?'标准税率':''}}</span>
                            </p>
                           <!-- 文件信息 -->
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessLicense!==''">
                                <span class="regLeft fl">营业执照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessLicense" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyBusinessRegistrationBr!=''">
                                <span class="regLeft fl">商业登记证BR：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyBusinessRegistrationBr" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyRegistrationCi!=''">
                                <span class="regLeft fl">公司注册证明书CI：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyRegistrationCi" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyCorporateFoundingNnc1!=''">
                                <span class="regLeft fl">发团成立表格NNC1：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyCorporateFoundingNnc1" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardFront!=''">
                                <span class="regLeft fl">身份证正反面扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardFront" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.companyLegalPersonCardPassport!=''">
                                <span class="regLeft fl">护照扫描件：</span>
                                <a class="fl" :href="item.registerWorkOrder.companyLegalPersonCardPassport" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.shopConsoleScreenshot!=''">
                                <span class="regLeft fl">店铺后台截图：</span>
                                <a class="fl" :href="item.registerWorkOrder.shopConsoleScreenshot" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.certificateOfEmployment!=''">
                                <span class="regLeft fl">工作证明：</span>
                                <a class="fl" :href="item.registerWorkOrder.certificateOfEmployment" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.leaseAgreement!=''">
                                <span class="regLeft fl">租房合同：</span>
                                <a class="fl" :href="item.registerWorkOrder.leaseAgreement" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.marriageLicense!=''">
                                <span class="regLeft fl">结婚证：</span>
                                <a class="fl" :href="item.registerWorkOrder.marriageLicense" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.divorceCertificate!=''">
                                <span class="regLeft fl">离婚证：</span>
                                <a class="fl" :href="item.registerWorkOrder.divorceCertificate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.houseProprietaryCertificate!=''">
                                <span class="regLeft fl">房产证：</span>
                                <a class="fl" :href="item.registerWorkOrder.houseProprietaryCertificate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.birthCertificate!=''">
                                <span class="regLeft fl">出生证/户口本：</span>
                                <a class="fl" :href="item.registerWorkOrder.birthCertificate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.registerWorkOrder.otherCertificate!=''">
                                <span class="regLeft fl">房屋贷款明细：</span>
                                <a class="fl" :href="item.registerWorkOrder.otherCertificate" target="_blank">查看</a>
                            </p>
                        </div>
                        
                    </div>
                </Col>
                <Col span="6" v-if="item.orderServices.productFunctionCode==2">
                    <p class="userinfoType" >转代理资料</p>
                    <div class="bottom-box">
                        <div v-if="JSON.stringify(item.transformProxyWorkOrder)!='{}' && item.orderServices.countryCode=='GB'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">VAT税号：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.vatTaxNumber}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">报税周期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.declarePeriod==0?'月报':item.transformProxyWorkOrder.declarePeriod==1?'季报':item.transformProxyWorkOrder.declarePeriod==2?'年报':''}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyAddressEnCountry}}{{item.transformProxyWorkOrder.companyAddressEnCity}}{{item.transformProxyWorkOrder.companyAddressEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人中文名：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonZh}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人英文名：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司邮箱：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyEmail}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司电话：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyTel}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司经营内容：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyBusinessModeDescribe}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">税号生效日期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.taxEffectiveDate}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">上一次申报区间：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.upBeginTime}}至{{item.transformProxyWorkOrder.upEndTime}}</span>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.companyBusinessLicense!==''">
                                <span class="regLeft fl">营业执照扫描件：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.companyBusinessLicense" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.legalPersonPapers!==''">
                                <span class="regLeft fl">身份证正反面/护照：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.legalPersonPapers" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.vatCertificate!==''">
                                <span class="regLeft fl">VAT证书：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.vatCertificate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.lastDeclareReceipt!==''">
                                <span class="regLeft fl">申报回执：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.lastDeclareReceipt" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.lastPayCertificate!==''">
                                <span class="regLeft fl">支付凭证：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.lastPayCertificate" target="_blank">查看</a>
                            </p>
                        </div>
                        <div v-if="JSON.stringify(item.transformProxyWorkOrder)!='{}' && item.orderServices.countryCode=='DE'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">VAT税号：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.vatTaxNumber}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">报税周期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.declarePeriod==0?'月报':item.transformProxyWorkOrder.declarePeriod==1?'季报':item.transformProxyWorkOrder.declarePeriod==2?'年报':''}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyAddressEnCountry}}{{item.transformProxyWorkOrder.companyAddressEnCity}}{{item.transformProxyWorkOrder.companyAddressEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">邮编号码：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.postCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">上次申报区间：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.upBeginTime.slice(0,10)}}至{{item.transformProxyWorkOrder.upEndTime.slice(0,10)}}</span>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.vatTaxLocalFile!==''">
                                <span class="regLeft fl">本地税号文件：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.vatTaxLocalFile" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.vatTaxEuFile!==''">
                                <span class="regLeft fl">欧盟税号文件：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.vatTaxEuFile" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.vatTaxFileCopy!==''">
                                <span class="regLeft fl">税务文件副本：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.vatTaxFileCopy" target="_blank">查看</a>
                            </p>
                        </div>
                        <div v-if="JSON.stringify(item.transformProxyWorkOrder)!='{}' && item.orderServices.countryCode=='IT'">
                            <p class="userContent clearfix">
                                <span class="regLeft fl">VAT税号：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.vatTaxNumber}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">报税周期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.declarePeriod==0?'月报':item.transformProxyWorkOrder.declarePeriod==1?'季报':item.transformProxyWorkOrder.declarePeriod==2?'年报':''}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文名称：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyNameEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">统一社会信用代码：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyCreditCode}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司英文地址：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyAddressEnCountry}}{{item.transformProxyWorkOrder.companyAddressEnCity}}{{item.transformProxyWorkOrder.companyAddressEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人英文名：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonEn}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">身份证/护照号码：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonCard}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">身份证英文地址：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonCardAddress}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生地：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonBirthplace}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">法人出生日期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyLegalPersonBirthday}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">店铺链接：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.shopHref}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">税号生效日期：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.taxEffectiveDate}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">公司经营内容：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.companyBusinessModeDescribe}}</span>
                            </p>
                            <p class="userContent clearfix">
                                <span class="regLeft fl">上次申报区间：</span>
                                <span class="fl">{{item.transformProxyWorkOrder.upBeginTime.slice(0,10)}}至{{item.transformProxyWorkOrder.upEndTime.slice(0,10)}}</span>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.vatTaxNumberFile!==''">
                                <span class="regLeft fl">税号文件：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.vatTaxNumberFile" target="_blank">查看</a>
                            </p>
                             <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.lastPayCertificate!==''">
                                <span class="regLeft fl">历史扣款回执：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.lastPayCertificate" target="_blank">查看</a>
                            </p>
                            <p class="userContent clearfix" v-if="item.transformProxyWorkOrder.lastDeclareReceipt!==''">
                                <span class="regLeft fl">历史申报回执：</span>
                                <a class="fl" :href="item.transformProxyWorkOrder.lastDeclareReceipt" target="_blank">查看</a>
                            </p>
                        </div>
                    </div>
                </Col>
                <Col span="6">
                    <p class="userinfoType">申报信息</p>
                    <div class="bottom-box" >
                        <div v-if="item.taxWorkOrderList.length>0">
                            <div v-for="(v,i) in item.taxWorkOrderList" :key="i">
                                <p class="userContent">
                                    <span class="left">申报区间：</span>
                                    <span>{{v.beginTime.slice(0,10)}}至{{v.endTime.slice(0,10)}}</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">报税次数：</span>
                                    <span>{{v.declareCout}}</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">申报状态：</span>
                                    <span>{{taxStatus(v.status)}}</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">申报规则：</span>
                                    <span>{{v.declareRule==0?'目的国':v.declareRule==1?'发出国':v.declareRule==2?'零申报':''}}</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">税率：</span>
                                    <span>{{v.taxRate}}%</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">缴纳税金：</span>
                                    <span>{{v.allTaxPrice}}</span>
                                </p>
                                <p class="userContent">
                                    <span class="left">税金确认单：</span>
                                    <a :href="v.taxAffirmForms" target="_blank" v-if="v.taxAffirmForms!==''">查看</a>
                                </p>
                                <p class="userContent">
                                    <span class="left">申报回执：</span>
                                    <a :href="v.declareReceipt" target="_blank" v-if="v.declareReceipt!==''">查看</a>
                                </p> 
                            </div>
                            
                        </div>
                    </div>
                </Col>
            </Row>
         </div>
    </div>
</template>
<script>
import * as API from '@/api/taxService/serviceQuery.js';
import {taxStatus} from '@/libs/tax.js'
export default {
    props:['orderId','userId'],
    data(){
        return{
            userDetail:{},
            servicesOrderDetail:[],
            taxStatus:taxStatus
        }
    },
    methods:{
        getDetails(){
            let data={
                orderId:this.orderId,
                userId:this.userId
            }
            API.serviceDetailInfoApi(data).then(res=>{
                if(res.code===0){
                    this.userDetail=res.data.user
                    this.servicesOrderDetail=res.data.servicesOrderDetailVo
                }
            })
        },
        goBack() {
            this.$emit('back')
        }
    },
    mounted(){
        this.getDetails()
    }
}
</script>
<style scoped lang="less">
.container{
    padding: 15px;
}
.title{
    font-size: 14px;
    font-weight: 700;
    margin: 12px 0;
}
.userInfo{
    background-color: #f2f2f2;
    padding: 12px;
    .name-title{
        width: 80px;
        text-align: right;
        display: inline-block;
    }
    /deep/ .ivu-row{
        margin-bottom: 10px;
    }
}
.serviceInfo{
    /deep/ .ivu-col-span-6{
        width: 30%;
        border: 1px solid #d7d7d7;
        margin-right: 10px;
    }
    /deep/ .ivu-row{
        margin-bottom: 10px;
    }
    .userinfoType{
        background-color: #f2f2f2;
        padding: 4px;
        font-size: 14px;
    }
    .userContent{
        margin: 5px 0;
        .left{
            width: 80px;
            text-align: right;
            display: inline-block;
        }
        .regLeft{
            min-width:100px;
            text-align: right;
            display: inline-block;
        }
    }
    .bottom-box{
        height: 280px;
        overflow-y: scroll;
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
.clearfix::after{
    display: block;
    line-height: 0px;
    content: '';
    clear: both;
}
.fl{
    float: left;
}
.fr{
    float: right;
    margin-right: 92px;
}
</style>


