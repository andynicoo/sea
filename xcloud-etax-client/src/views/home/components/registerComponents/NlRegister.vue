<template>
  <div class="stepH stepAE">
    <div class="title">公司信息</div>
    <div class="content">
      <Form :model="formLeft"
            class="formstyle inputHFlex"
            :rules="ruleForm"
            ref="formLeft">
        <div class="item-content">
          <Row>
            <Col :span="8">
            <FormItem label="开店主体"
                      style="width:300px;"
                      prop="shopNature">
              <RadioGroup v-model="formLeft.shopNature">
                <Radio :disabled="notChange"
                       label="1">公司主体（含个体工商户）</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司类型"
                      style="width:300px;"
                      prop="companyType">
              <RadioGroup v-model="formLeft.companyType">
                <Radio :disabled="notChange"
                       label="1">大陆公司</Radio>
                <Radio :disabled="notChange"
                       label="2">香港公司</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="营业执照扫描件"
                      v-if="formLeft.companyType==='1'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessLicense">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyBusinessLicense')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessLicense !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyBusinessLicense"
                     target="_blank"
                     class="show-pdf">
                    营业执照扫描件
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyBusinessLicense')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="营业执照英文公证翻译件"
                      v-if="formLeft.companyType==='1'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessLicenseTranslate">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicenseTranslate')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicenseTranslate')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyBusinessLicenseTranslate')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessLicenseTranslate !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyBusinessLicenseTranslate"
                     target="_blank"
                     class="show-pdf">
                    营业执照英文公证翻译件
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyBusinessLicenseTranslate')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="http://file.itaxs.com/dev/20210303/f99fe4c5c5784ac582a79394e0c8aeec.pdf"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="商业登记证BR"
                      v-if="formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessRegistrationBr">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessRegistrationBr')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyBusinessRegistrationBr')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessRegistrationBr !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyBusinessRegistrationBr"
                     target="_blank"
                     class="show-pdf">
                    商业登记证BR
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyBusinessRegistrationBr')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_dOACF2FAALt-Hjd_Jk072.png"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司注册证明书CI"
                      v-if="formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyRegistrationCi">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyRegistrationCi')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyRegistrationCi')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyRegistrationCi !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyRegistrationCi"
                     target="_blank"
                     class="show-pdf">
                    公司注册证明书CI
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyRegistrationCi')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_kyADlfrAAJWob8GDgQ847.png"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法团成立表格NNC1"
                      v-if="formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyCorporateFoundingNnc1">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyCorporateFoundingNnc1')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyCorporateFoundingNnc1')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyCorporateFoundingNnc1 !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyCorporateFoundingNnc1"
                     target="_blank"
                     class="show-pdf">
                    法团成立表格NNC1
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyCorporateFoundingNnc1')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV61AOOAaaUDAAMDXiZXCZo609.png"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司中文名称："
                      class="requiredItem requiredItem"
                      style="width:300px;"
                      prop="companyNameZh">
              <AutoComplete v-model="formLeft.companyNameZh"
                            :data="lenovoSearchList"
                            @on-select="selectCompany"
                            placeholder="请输入公司中文名称"
                            :disabled="notChange">
              </AutoComplete>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="社会统一信用代码"
            style="width:300px;"
                      prop="companyCreditCode">
              <Input v-model="formLeft.companyCreditCode"
                     placeholder="请输入社会统一信用代码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司成立时间日期"
            style="width:300px;"
                      prop="companyRegisterData">
              <DatePicker type="date"
                          placeholder="请选择公司成立时间日期"
                          v-model="formLeft.companyRegisterData"
                          format="yyyy-MM-dd"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司联系电话"
            style="width:300px;"
                      prop="companyTel">
              <Input v-model="formLeft.companyTel"
                     placeholder="请输入公司联系电话"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司联系邮箱"
            style="width:300px;"
                      prop="companyEmail">
              <Input v-model="formLeft.companyEmail"
                     placeholder="请输入常用的联系邮箱"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司网址(选填)：" style="width:300px;">
              <Input v-model="formLeft.companyWebsite"
                     placeholder="请输入公司网址"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <FormItem label="公司所在地的税务机关名称（中文）" prop="taxAuthorityNameZh" style="width:300px;">
                <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 261px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>例：国家税务总局深圳市福田区税务局福田税务所</p>
                </div>
                </Tooltip>
                <Input v-model="formLeft.taxAuthorityNameZh"
                     placeholder="请输入公司所在地的税务机关名称(中文)"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="公司所在地的税务机关的地址（中文）" prop="taxAuthorityAddrZh" style="width:300px;">
                <Input v-model="formLeft.taxAuthorityAddrZh"
                     placeholder="请输入公司所在地的税务机关的地址(中文)"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司注册资金"
                      v-if="formLeft.shopNature === '1'"
                      style="width:300px;"
                      class="requiredItem"
                      prop="companyRegisteredCapital">
              <Input v-model="formLeft.companyRegisteredCapital"
                     placeholder="请输入公司注册资金"
                     :disabled="notChange">
              <span slot="append">欧元</span>
              </Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <FormItem label="公司所在地的税务机关名称（英文）" prop="taxAuthorityNameEn" style="width:300px;">
                <Input v-model="formLeft.taxAuthorityNameEn"
                     placeholder="请输入公司所在地的税务机关名称(英文)"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="公司所在地的税务机关的地址（英文）" prop="taxAuthorityAddrEn" style="width:300px;">
                <Input v-model="formLeft.taxAuthorityAddrEn"
                     placeholder="请输入公司所在地的税务机关的地址(英文)"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司英文地址"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyAddressEn">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="国家 如：China"
                       v-model="formLeft.companyAddressEnCountry"
                       :disabled="notChange"
                       style="width:114px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                       placeholder="城市加省份 如: shenzhenshi guangdong"
                       v-model="formLeft.companyAddressEnCity"
                       :disabled="notChange"
                       style="width:143px" />
              </div>
              <Input v-model="formLeft.companyAddressEn"
                     type="textarea"
                     placeholder="请输入详细地址"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请根据您的店铺后台英文地址进行填写（需保持一致）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司中文地址" prop="officeAddressEn" style="width:300px;">
                <Input v-model="formLeft.officeAddressEn"
                     placeholder="请输入公司中文地址"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div class="line"></div>
        <div class="title">法人信息</div>
        <div class="item-content">
          <Row>
            <Col :span="8">
            <FormItem label="证件类型"
            style="width:300px;"
                      prop="certificateType">
              <RadioGroup v-model="formLeft.certificateType">
                <Radio :disabled="notChange"
                       label="1">身份证</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人身份证"
                      v-if="formLeft.certificateType === '1'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardFront')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyLegalPersonCardFront')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">身份证（人像面）</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyLegalPersonCardFront !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyLegalPersonCardFront"
                     target="_blank"
                     class="show-pdf">
                    身份证（人像面）
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyLegalPersonCardFront')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardReverse')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      style="margin-top:16px;"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyLegalPersonCardReverse')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">身份证（国徽面）</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyLegalPersonCardReverse !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyLegalPersonCardReverse"
                     target="_blank"
                     class="show-pdf">
                    身份证（国徽面）
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyLegalPersonCardReverse')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="身份证公证翻译件"
                      v-if="formLeft.certificateType === '1'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFrontTranslate')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardFrontTranslate')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyLegalPersonCardFrontTranslate')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">身份证（人像面）</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyLegalPersonCardFrontTranslate !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyLegalPersonCardFrontTranslate"
                     target="_blank"
                     class="show-pdf">
                    身份证（人像面）
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyLegalPersonCardFrontTranslate')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverseTranslate')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardReverseTranslate')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      style="margin-top:16px;"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyLegalPersonCardReverseTranslate')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">身份证（国徽面）</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyLegalPersonCardReverseTranslate !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyLegalPersonCardReverseTranslate"
                     target="_blank"
                     class="show-pdf">
                    身份证（国徽面）
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyLegalPersonCardReverseTranslate')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="http://file.itaxs.com/dev/20210303/d40a206e3f08408990c05d044e2ef4cb.pdf"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人英文姓名"
            style="width:300px;"
                      prop="companyLegalPersonEn">
              <Input v-model="formLeft.companyLegalPersonEn"
                     placeholder="请用拼音输入"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：英文姓名需要“名在前姓在后”（如张三，San Zhang）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人中文姓名"
            style="width:300px;"
                      prop="companyLegalPersonZh">
              <Input v-model="formLeft.companyLegalPersonZh"
                     placeholder="请输入法人中文姓名"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人出生地邮编号码"
            style="width:300px;"
                      class="requiredItem"
                      prop="legalPersonPostCode">
              <Input v-model="formLeft.legalPersonPostCode"
                     placeholder="请输入法人出生地邮编号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人身份证中文地址" prop="companyLegalPersonCardAddressZh" style="width:300px;">
                <Input v-model="formLeft.companyLegalPersonCardAddressZh"
                     placeholder="请输入法人身份证中文地址"
                     :disabled="notChange"></Input>
              </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人身份证英文地址："
                      class="requiredItem"
                      style="width:300px;"
                      prop="personCardAddressEn">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="国家 如：China"
                       v-model="formLeft.personCardAddressCountryEn"
                       :disabled="notChange"
                       style="width:114px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                       placeholder="城市加省份 如: shenzhenshi guangdong"
                       v-model="formLeft.personCardAddressCityEn"
                       :disabled="notChange"
                       style="width:143px" />
              </div>
              <Input v-model="formLeft.personCardAddressEn"
                     type="textarea"
                     placeholder="请输入法人英文地址，包含城市、省份、邮编、国家。"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
            </FormItem>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请使用拼音输入身份证地址</p>
            </Col>
            <Col :span="8">
            <FormItem label="法人出生日期"
                      style="width:300px"
                      prop="companyLegalPersonBirthday">
              <DatePicker type="date"
                          placeholder="请选择法人出生日期"
                          v-model="formLeft.companyLegalPersonBirthday"
                          format="yyyy-MM-dd"
                          class="tax-date"
                          :options="optionsDate"
                          :disabled="notChange"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </div>
        <div class="line"></div>
        <div class="title">店铺信息</div>
        <div class="item-content">
          
          <Row>
            <Col :span="12">
            <FormItem label="店铺所在电商平台"
                      prop="shopSalePlatformName"
                      style="width:300px;"
                      class="requiredItem requiredItem">
              <RadioGroup v-model="formLeft.shopSalePlatformName">
                <Radio label="亚马逊"
                       :disabled="notChange">亚马逊</Radio>
                <Radio label="其它"
                       :disabled="notChange">其它</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="亚马逊账号的完整名称"
                      style="width:300px"
                      prop="amazonShopAccount">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 173px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果是其他平台，请写其他平台的店铺账户名称</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.amazonShopAccount"
                     placeholder="请输入亚马逊账号的完整名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="亚马逊卖家信息链接"
                      style="width:300px"
                      prop="amazonSellerLink">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 158px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果是其他平台，请写其他平台的卖家信息链接</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.amazonSellerLink"
                     placeholder="请输入亚马逊卖家信息链接"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="亚马逊销售的产品的链接或描述"
                      style="width:300px"
                      prop="amazonProductsLink">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 237px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果是其他平台，请写其他平台的产品的链接</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.amazonProductsLink"
                     placeholder="请输入亚马逊产品的链接或描述"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="店铺后台链接"
            style="width:300px;"
                      prop="shopHref">
              <Input v-model="formLeft.shopHref"
                     placeholder="请输入店铺后台链接"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司英文名称"
            style="width:300px;"
                      prop="companyNameEn">
              <Input v-model="formLeft.companyNameEn"
                     placeholder="请输入公司英文名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司邮编号码"
            style="width:300px;"
                      prop="companyPostCode">
              <Input v-model="formLeft.companyPostCode"
                     placeholder="请输入店铺后台的邮编号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="税号生效日期:"
            style="width:300px;"
                      prop="shopTaxEffectiveData">
              <DatePicker type="date"
                          placeholder="请选择预计第一笔销售产生的时间"
                          v-model="formLeft.shopTaxEffectiveData"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="使用“FBA”（亚马逊履行）的国家"
            style="width:300px;"
                      prop="fbaCountry">
                      <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 270px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>所有使用了FBA的国家都要填上</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.fbaCountry"
                     placeholder="请输入使用“FBA”（亚马逊履行）的国家"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="描述下公司经营内容"
            style="width:300px;"
                      prop="companyBusinessModeDescribe">
              <Input v-model="formLeft.companyBusinessModeDescribe"
                     placeholder="请用英文描述经营内容，一两种即可"
                     :disabled="notChange"
                     type="textarea"
                     :rows="3"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">温馨提示：请使用英文输入经营内容</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="在荷兰开展业务的初始日期（选填）"
                      style="width:300px"
                      prop="businessInitialTime">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 249px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果在申请税号前已在荷兰开展了业务，必须选择开展日期</p>
                </div>
              </Tooltip>
              <DatePicker type="date"
                          placeholder="请选择在荷兰开展业务的初始日期"
                          v-model="formLeft.businessInitialTime"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="第一次使用荷兰仓库的日期（选填）"
                      style="width:300px"
                      prop="warehouseInitialTime">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 248px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果没有使用，则不选择</p>
                </div>
              </Tooltip>
              <DatePicker type="date"
                          placeholder="请选择第一次使用荷兰仓库的日期"
                          v-model="formLeft.warehouseInitialTime"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="预计今年荷兰的应税营业额"
                      style="width:300px;"
                      prop="expectedTaxable">
              <Input v-model="formLeft.expectedTaxable"
                     placeholder="请输入预计今年荷兰的应税营业额"
                     :disabled="notChange">
              <span slot="append">欧元</span>
              </Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="预计未来下个财政年度荷兰的应税营业额"
                      style="width:312px;"
                      prop="expectedTaxableNext">
              <Input v-model="formLeft.expectedTaxableNext"
                     placeholder="请输入预计未来下个财政年度荷兰的应税营业额"
                     :disabled="notChange"
                     style="width:270px;">
              <span slot="append">欧元</span>
              </Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="您是否会将商品进口荷兰，谁将作为进口记录的进口商？"
                      style="width:436px;"
                      prop="importerInfo">
                      <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 407px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>若自己作为进口商，写自己公司的英文名；若是以亚马逊FBA的方式将商品进口到荷兰，填写Amazon FBA；若是以其他方式进口到荷兰，请如实填写进口商</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.importerInfo"
                     placeholder="请输入详情"
                     :disabled="notChange"
                     style="width:300px;">
              </Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
            <FormItem label="客户类型"
                      prop="customerType"
                      style="width:300px;"
                      class="requiredItem">
              <RadioGroup v-model="formLeft.customerType">
                <Radio label="B2B"
                       :disabled="notChange">B2B</Radio>
                <Radio label="B2C"
                       :disabled="notChange">B2C</Radio>
                <Radio label="B2B+B2C"
                       :disabled="notChange">B2B+B2C</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="货物从哪里进口"
                      style="width:300px"
                      prop="goodsImportedFrom">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 126px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>通过亚马逊仓库进口到波兰，填写Amazon FBA warehouse；从中国的自发货，填写China；如果是其他进口货物方式，请如实填写</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.goodsImportedFrom"
                     placeholder="请输入货物从哪里进口"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="商品是在哪里购买的"
                      style="width:300px"
                      prop="goodsPurchased">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 158px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>货物来自的国家。如果原产地是中国，填写China</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.goodsPurchased"
                     placeholder="请输入商品是在哪里购买的"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="EORI号码"
                      style="width:300px"
                      prop="eoriNumber">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 85px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果没有，写no</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.eoriNumber"
                     placeholder="请输入EORI号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="亚马逊物流仓储中心在荷兰的名称和地址"
                      style="width:312px"
                      prop="fbaNetherlandsAddrs">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 301px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt="">
                </span>
                <div slot="content">
                  <p>如果没有仓储，写no</p>
                </div>
              </Tooltip>
              <Input v-model="formLeft.fbaNetherlandsAddrs"
                     placeholder="请输入物流仓储中心在荷兰的名称和地址"
                     :disabled="notChange"
                     style="width:300px"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <!-- <Col :span="8">
              <FormItem
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="otherTaxCertificate">
              <p class="top-lable">完税证明（一年内有效）</p>
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'otherTaxCertificate')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'otherTaxCertificate')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('otherTaxCertificate')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.otherTaxCertificate !==''">
                <div class="inner img-box">
                  <a :href="formLeft.otherTaxCertificate"
                     target="_blank"
                     class="show-pdf">
                    完税证明
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'otherTaxCertificate')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="http://file.itaxs.com/dev/20210225/e661fa7aa9d049ceb19c07531fb4563b.pdf"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：公司成立一年内不需要完税证明</p>
            </FormItem>
            </Col> -->
            <Col :span="8">
              <FormItem label="章程及翻译件"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="articlesOfAssociationFile">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'articlesOfAssociationFile')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'articlesOfAssociationFile')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('articlesOfAssociationFile')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.articlesOfAssociationFile !==''">
                <div class="inner img-box">
                  <a :href="formLeft.articlesOfAssociationFile"
                     target="_blank"
                     class="show-pdf">
                    章程及翻译件
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'articlesOfAssociationFile')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://file.itaxs.com/dev/20210225/cd08c247ca0c4405ac214f68786ea0f8.pdf"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
            </FormItem>
            </Col>
          </Row>
        </div>
        <div class="title">银行信息</div>
        <div class="item-content">
          <Row>
            <Col :span="8">
            <FormItem label="账号名称："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankAccountName">
              <Input v-model="formLeft.bankAccountName"
                     placeholder="请输入开户公司名称/个体户名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="银行英文名称："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankName">
              <Input v-model="formLeft.bankName"
                     placeholder="请输入开户银行名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="IBAN/银行账户："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankAccount">
              <Input v-model="formLeft.bankAccount"
                     placeholder="请输入开户银行账户号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="银行BIC："
                      class="requiredItem"
                      style="width:300px;"
                      prop="swiftBic">
              <Input v-model="formLeft.swiftBic"
                     placeholder="请输入银行BIC"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="所在地邮编号码："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankAccountAddressPostcode">
              <Input v-model="formLeft.bankAccountAddressPostcode"
                     placeholder="请输入开户公司名称/个体户所在地邮编"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：开户的公司/个体户所在地邮编号码，如：518000</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="账户主体地址："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankAccountAddressEn">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="国家 如：China"
                       v-model="formLeft.bankAccountCountryEn"
                       :disabled="notChange"
                       style="width:114px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                       placeholder="城市加省份 如: shenzhenshi guangdong"
                       v-model="formLeft.bankAccountCityEn"
                       :disabled="notChange"
                       style="width:143px" />
              </div>
              <Input v-model="formLeft.bankAccountAddressEn"
                     type="textarea"
                     placeholder="请输入账户主体英文地址；"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：开户的公司/个体户详细地址（请使用英文输入）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="银行英文地址："
                      class="requiredItem"
                      style="width:300px;"
                      prop="bankAddressEn">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="国家 如：China"
                       v-model="formLeft.bankCountryEn"
                       :disabled="notChange"
                       style="width:114px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                       placeholder="城市加省份 如: shenzhenshi guangdong"
                       v-model="formLeft.bankCityEn"
                       :disabled="notChange"
                       style="width:143px" />
              </div>
              <Input v-model="formLeft.bankAddressEn"
                     type="textarea"
                     placeholder=" 请输入银行详细英文地址"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：银行的地址（请使用英文输入）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="银行账户证明"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="bankAccountCertify">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bankAccountCertify')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'bankAccountCertify')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :class="{'notChange': notChange}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('bankAccountCertify')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.bankAccountCertify !==''">
                <div class="inner img-box">
                  <a :href="formLeft.bankAccountCertify"
                     target="_blank"
                     class="show-pdf">
                    银行账户证明
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'bankAccountCertify')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://pre-fdfs.itaxs.com/group1/M00/00/B3/rBLKLV-jsFuAO8vkAAPlsYdN3WA528.png"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：与以上填写的银行信息保持一致，需要英文证明（可以证明银行账号正确的证明）</p>
            </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { getMaterialSubmit, getRegTaxDetail, getMaterialSave, getAllServiceCompanies, getCompanyInformation, getCompanyLegalPersonSign } from "@/api/registerInfo/registerInfo";
import { legalpersonCountry, taxInfo, identifyBusinessLicense, identifyIdCard } from "@/api/taxModule"
import { Throttle } from "@/libs/throttle.js"
export default {
  props: ['notChange', 'leftFrom', 'status', 'servicesId'],
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
    const onlyNumber = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('请填写销售额'))
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (isNaN(value)) {
          callback(new Error('请填写销售额'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      formLeft: {
        shopNature: '1',
        shopTaxRate: '0',
        companyType: '1',
        certificateType: '1',
        vatTaxNumber: "",
        declarePeriod: "",
        companyNameEn: "",
        companyNameZh: '',
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        officeAddressEn:'',
        amazonShopAccount:'',
        amazonProductsLink:'',
        amazonSellerLink:'',
        companyLegalPersonCardAddressCn:'',
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyEmail: "",
        taxAuthorityNameZh:'',
        taxAuthorityAddrZh:'',
        taxAuthorityNameEn:'',
        taxAuthorityAddrEn:'',
        companyTel: "",
        companyBusinessModeDescribe: "",
        companyLegalPersonSign: '',
        taxEffectiveDate: "",
        upBeginTime: "",
        upEndTime: "",
        companyBusinessLicense: "",
        companyBusinessLicenseTranslate: "",
        companyLegalPersonCardFrontTranslate: "",
        companyLegalPersonCardReverseTranslate: "",
        articlesOfAssociationFile: "",
        otherTaxCertificate: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastPayCertificate: "",
        gatewayId: "",
        gatewayPassword: "",
        postCode: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        vatTaxFileCopy: "",
        companyLegalPersonCard: '',
        companyLegalPersonCardReverse: '',
        companyLegalPersonCardAddress: '',
        companyLegalPersonBirthday: '',
        shopHref: '',
        lastDeclareReceipt: '',
        vatTaxNumberFile: '',
        registrationAuthorization: '',
        companyLegalPersonBirthplace: '',
        companyRegisteredCapital: '',
        expectedTaxable:'',
        expectedTaxableNext:'',
        importerInfo:'',
        companyRegisterData: '',
        legalPersonMaritalStatus: '',
        legalPersonBirthplaceProvinceZh: '',
        legalPersonBirthplaceProvinceEn: '',
        legalPersonBirthplaceCityZh: '',
        legalPersonBirthplaceCityEn: '',
        companyLegalPersonCardAddressZh: '',
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
        auditReport: '',
        servicesId: this.servicesId,
        articlesOfAssociationFile: '',
        salesEvidenceFile: '',
        shopSaleBeforeFile: '',
        companyStockConditionFile: '',
        customsClearanceReport: '',
        isOtherBusinessActivities: '2',
        isThereShop: '1',
        isThereSale: '1',
        isOtherGulfStateDutyOrServices: '1',
        taxRegisterLetter: '',
        companyCreditCode: '',
        companyPostCode: '',
        fbaCountry:'',
        personCardAddressCountryEn: '',
        personCardAddressCityEn: '',
        personCardAddressEn: '',
        shopSalePlatformName: '亚马逊',
        customerType:'',
        goodsImportedFrom:'',
        goodsPurchased:'',
        eoriNumber:'',
        fbaNetherlandsAddrs:'',
        shopSalePlatformAccount: '',
        firstOrderTime: '',
        taxVatCountry: '',
        shopSalePlatformContract: '',
        driverLicense: '',
        shopTaxEffectiveData: '',
        businessInitialTime:'',
        warehouseInitialTime:'',
        isShopConsoleScreenshot: '1',
        otherCertificate: '',
        birthCertificate: '',
        houseProprietaryCertificate: '',
        divorceCertificate: '',
        marriageLicense: '',
        rentContract: '',
        certificateOfEmployment: '',
        leaseAgreement: '',
        shopPostCode: '',
        shopConsoleConfirmationLetter: '',
        shopSalePlan: '',
        companyLegalPersonEmail: '',
        companyWebsite: '',
        legalPersonPostCode: '',
        bankAccountName: '',
        bankName: '',
        swiftBic: '',
        bankAccountAddressPostcode: '',
        bankAccountCountryEn: '',
        bankAccountCityEn: '',
        bankAccountAddressEn: '',
        bankAddressEn: '',
        bankCountryEn: '',
        bankCityEn: '',
        bankAccountCertify: ''
      },
      ruleForm: {
        bankAccountCertify: [
          { required: true, trigger: "change", message: "请上传银行账户证明", }
        ],
        bankAddressEn: [
          { required: true, trigger: "change", message: "请输入银行英文地址", }
        ],
        bankAccountAddressEn: [
          { required: true, trigger: "change", message: "请输入账户主体地址", }
        ],
        bankAccountAddressPostcode: [
          { required: true, trigger: "change", message: "请输入所在地邮编号码：", }
        ],
        legalPersonPostCode: [
          { required: true, trigger: "change", message: "请输入法人身份证所在地邮编号码", }
        ],
        otherCertificate: [
          { required: true, trigger: "change", message: "请上传房屋贷款明细 ", }
        ],
        birthCertificate: [
          { required: true, trigger: "change", message: "请上传出生证/户口本 ", }
        ],
        houseProprietaryCertificate: [
          { required: true, trigger: "change", message: "请上传房产证 ", }
        ],
        divorceCertificate: [
          { required: true, trigger: "change", message: "请上传离婚证 ", }
        ],
        marriageLicense: [
          { required: true, trigger: "change", message: "请上传结婚证 ", }
        ],
        leaseAgreement: [
          { required: true, trigger: "change", message: "请上传租房合同 ", }
        ],
        certificateOfEmployment: [
          { required: true, trigger: "change", message: "请上传工作证明 ", }
        ],
        personCardAddressEn: [
          { required: true, trigger: "change", message: "请输入法人身份证英文地址 ", }
        ],
        shopConsoleConfirmationLetter: [
          { required: true, trigger: "change", message: "请上传店铺确认函 ", }
        ],
        isShopConsoleScreenshot: [
          { required: true, trigger: "change", message: "请选择是否有店铺截图 ", }
        ],
        shopTaxRate: [
          { required: true, trigger: "change", message: "请选择税率", }
        ],
        shopSalePlan: [
          { required: true, trigger: "change", validator: onlyNumber, message: "请输入销售额", }
        ],
        shopNature: [
          { required: true, trigger: "change", message: "请选择开店主体", }
        ],
        companyType: [
          { required: true, trigger: "change", message: "请选择公司类型", }
        ],
        driverLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传法人驾驶证"
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
        certificateType: [
          { required: true, trigger: "change", message: "请选择证件类型", }
        ],
        isThereShop: [
          { required: true, trigger: "change", message: "请选择是否有店铺", }
        ],
        isThereSale: [
          { required: true, trigger: "change", message: "请选择是否销售", }
        ],
        shopSaleBefore: [
          { required: true, trigger: "change", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        future30Sale: [
          { required: true, trigger: "change", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        shopSalePlatformName: [
          { required: true, trigger: "change", message: "请选择店铺所在电商平台" }
        ],
        customerType: [
          { required: true, trigger: "change", message: "请选择客户类型" }
        ],
        goodsImportedFrom: [
          { required: true, trigger: "change", message: "请填写货物从哪里进口" }
        ],
        goodsPurchased: [
          { required: true, trigger: "change", message: "请填写商品是在哪里购买的" }
        ],
        eoriNumber: [
          { required: true, trigger: "change", message: "请填写EORI号码" }
        ],
        fbaNetherlandsAddrs: [
          { required: true, trigger: "change", message: "请填写亚马逊物流仓储中心在荷兰的名称和地址" }
        ],
        legalPersonCardPassportNumber: [
          { required: true, trigger: "change", message: "请填写法人护照号" }
        ],
        swiftBic: [
          { required: true, trigger: "change", message: "请填写Swift / BIC" }
        ],
        bankAddress: [
          { required: true, trigger: "change", message: "请填写支行英文地址" }
        ],
        bankAccount: [
          { required: true, trigger: "change", message: "请填写IBAN/银行账户" }
        ],
        bankSubBranchName: [
          { required: true, trigger: "change", message: "请填写支行名称" }
        ],
        bankName: [
          { required: true, trigger: "change", message: "请填写银行名称" }
        ],
        bankAccountName: [
          { required: true, trigger: "change", message: "请填写账户名称" }
        ],
        companyPostCode: [
          { required: true, trigger: "change", message: "请填写邮政编码" }
        ],
        fbaCountry: [
          { required: true, trigger: "change", message: "请输入使用“FBA”（亚马逊履行）的国家" }
        ],
        profession: [
          { required: true, trigger: "change", message: "请填写职业" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "change", message: "请填写电商平台账号完整名称" }
        ],
        shopSaleBeforeFile: [
          { required: true, trigger: "change", message: "请上传过往12个月销售报告" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "change", message: "请填写法人联系邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "change" }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "change", message: "请填写常用联系手机号" }
        ],
        companyRegisteredCityZh: [
          { required: true, trigger: "change", message: "请填公司营业执照注册城市" }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "change", message: "请填写本地银行账户信息" }
        ],
        vatTaxNumber: [
          { required: true, trigger: "change", message: "请填写VAT税号" }
        ],
        declarePeriod: [
          { required: true, trigger: "change", message: "请选择报税周期" }
        ],
        companyNameZh: [
          { required: true, trigger: "change", message: "请填写公司中文名" }
        ],
        companyLegalPersonZh: [
          { required: true, trigger: "change", message: "请填写法人中文名" }
        ],
        companyLegalPersonEn: [
          { required: true, trigger: "change", message: "请填写法人英文名" }
        ],
        companyNameEn: [
          { required: true, trigger: "change", message: "请填写公司英文名" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "change", message: "请填写法人出生地" }
        ],
        companyLegalPersonSign: [
          { required: true, trigger: "change", message: "请填写上传法人签名" }
        ],
        companyLegalPersonCardAddress: [
          { required: true, trigger: "change", message: "请填写法人身份证英文地址" }
        ],
        companyLegalPersonCard: [
          { required: true, trigger: "change", message: "请填写法人身份证号码" }
        ],
        companyLegalPersonBirthday: [
          { required: true, trigger: "change", message: "请选择法人出生日期", type: "date" }
        ],
        legalPersonMaritalStatus: [
          { required: true, trigger: "change", message: "请选择法人婚姻状态" }
        ],
        legalPersonSex: [
          { required: true, trigger: "change", message: "请选择法人性别" }
        ],
        useEntrepot: [
          { required: true, trigger: "change", message: "请选择是否使用任何西班牙仓库" }
        ],
        dredgeEuronext: [
          { required: true, trigger: "change", message: "请选择是否开通泛欧" }
        ],
        shopHref: [
          { required: true, trigger: "change", message: "请填写店铺链接" }
        ],
        shippingProcess: [
          { required: true, trigger: "change", message: "请填写货物进口及配送流程" }
        ],
        companyAddressEnCountry: [
          { required: true, trigger: "change", message: "请填写公司英文地址" }
        ],
        companyAddressEn: [
          { required: true, trigger: "change", message: "请填写公司英文地址" }
        ],
        officeAddressEn: [
          { required: true, trigger: "change", message: "请填写公司中文地址" }
        ],
        amazonShopAccount: [
          { required: true, trigger: "change", message: "请填写亚马逊账号的完整名称" }
        ],
        amazonProductsLink: [
          { required: true, trigger: "change", message: "请填写亚马逊销售的产品的链接或描述" }
        ],
        amazonSellerLink: [
          { required: true, trigger: "change", message: "请填写亚马逊卖家信息链接" }
        ],
        companyLegalPersonCardAddressCn: [
          { required: true, trigger: "change", message: "请填写法人身份证中文地址" }
        ],
        companyCreditCode: [
          { required: true, trigger: "change", message: "请填写统一社会信用代码" }
        ],
        legalPersonBirthplaceProvinceZh: [
          { required: true, trigger: "change", message: "请填写法人的出生省份中文" }
        ],
        legalPersonBirthplaceProvinceEn: [
          { required: true, trigger: "change", message: "请填写法人的出生省份英文" }
        ],
        legalPersonBirthplaceCityZh: [
          { required: true, trigger: "change", message: "请填写法人的出生城市中文" }
        ],
        legalPersonBirthplaceCityEn: [
          { required: true, trigger: "change", message: "请填写法人的出生城市英文" }
        ],
        companyLegalPersonCardAddressZh: [
          { required: true, trigger: "change", message: "请填写法人身份证中文地址" }
        ],
        companyRegisteredCapital: [
          { required: true, trigger: "change", message: "请输入公司注册资金（欧元）",}
        ],
        expectedTaxable: [
          { required: true, trigger: "change", message: "请输入预计今年荷兰的应税营业额", }
        ],
        expectedTaxableNext: [
          { required: true, trigger: "change", message: "请输入预计未来下个财政年度荷兰的应税营业额",}
        ],
        importerInfo: [
          { required: true, trigger: "change", message: "请输入详情" }
        ],
        companyRegisterData: [
          {
            required: true,
            trigger: "change",
            message: "请选择公司成立日期",
            type: "date"
          }
        ],
        companyEmail: [
          { required: true, trigger: "change", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "change" }
        ],
        companyTel: [
          { required: true, trigger: "change", message: "请填写公司电话" }
        ],
        taxAuthorityNameZh: [
          { required: true, trigger: "change", message: "请填写公司所在地的税务机关名称（中文）" }
        ],
        taxAuthorityAddrZh: [
          { required: true, trigger: "change", message: "请填写公司所在地的税务机关的地址（中文）" }
        ],
        taxAuthorityNameEn: [
          { required: true, trigger: "change", message: "请填写公司所在地的税务机关名称（英文）" }
        ],
        taxAuthorityAddrEn: [
          { required: true, trigger: "change", message: "请填写公司所在地的税务机关的地址（英文）" }
        ],
        companyBusinessModeDescribe: [
          { required: true, trigger: "change", message: "请填写公司经营内容" }
        ],
        shopTaxEffectiveData: [
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
        legalPersonCardPassportPastTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择护照到期时间",
            type: "date"
          }
        ],
        thresholdValueTime: [
          {
            required: true,
            trigger: "change",
            message: "超过阈值或预计超过阈值的日期",
            type: "date"
          }
        ],
        shopConsoleScreenshot: [
          {
            required: true,
            trigger: "change",
            message: "请上传后台店铺截图"
          }
        ],
        companyLegalPersonCardPassport: [
          { required: true, trigger: "change", message: "请上传护照扫描件" }
        ],
        vatCertificate: [
          { required: true, trigger: "change", message: "请上传VAT证书" }
        ],
        companyCreditReport: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司信用报告"
          }
        ],
        lastPayCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传支付凭证"
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
        upEndTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择结束时间",
            type: "date"
          }
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传历史申报回执"
          }
        ],
        vatTaxNumberFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传税号文件"
          }
        ],
        companyBusinessLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照扫描件"
          }
        ],
        companyBusinessLicenseTranslate: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照英文公证翻译件"
          }
        ],
        articlesOfAssociationFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司章程"
          }
        ],
      },
      lenovoSearchList: [], //联想列表
      birthplaceList: [],
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;;
        }
      },
      base64URI: ''
    }
  },
  methods: {
    selectCompany: Throttle(function (obj) {
      let that = this
      getCompanyInformation({
        companyName: obj,
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== "{}") {
            for (const key in res.data) {
              if (res.data.hasOwnProperty(key) && that.formLeft.hasOwnProperty(key)) {
                that.formLeft[key] = res.data[key]
              }
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }),
    changeVatDate(date, item) {
      // console.log('date', date)
      // console.log('item', item)
      this.formLeft[item] = date;
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
      this.formLeft[item] = res.data.fileUrl;
      if (res.size > 4096) {
        return
      }
      this.identifyFun(item, res.data.fileUrl)
    },
    identifyFun(item, fileUrl) {
      let that = this
      if (item === 'companyBusinessLicense') {
        identifyBusinessLicense({
          image: fileUrl,
          servicesId: this.servicesId
        }).then(res => {
          if (res.code === 0) {
            that.traverseResult(res.data, that)
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (item === 'companyLegalPersonCardFront') {
        identifyIdCard({
          image: fileUrl,
          servicesId: this.servicesId,
          side: 'front'
        }).then(res => {
          that.traverseResult(res.data, that)
        }).catch(err => {
          console.log(err)
        })
      }
      if (item === 'companyLegalPersonCardReverse') {
        identifyIdCard({
          image: fileUrl,
          servicesId: this.servicesId,
          side: 'back'
        }).then(res => {
          that.traverseResult(res.data, that)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    traverseResult(resData, that) {
      if (JSON.stringify(resData) !== "{}") {
        for (const key in resData) {
          if (resData.hasOwnProperty(key) && that.formLeft.hasOwnProperty(key)) {
            if (resData[key] !== '无' && that.formLeft[key] === '') {
              that.formLeft[key] = resData[key]
            }
          }
          if (that.formLeft.hasOwnProperty(key) === false) {
            if (resData[key] !== '无' && that.formLeft[key] === '') {
              that.formLeft[key] = resData[key]
            }
          }
        }
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
    },
    beforeUploadHandler(file) {

      this.base64URI = ''
      const reader = new FileReader();
      //将文件读取为 DataURL 以data:开头的字符串
      reader.readAsDataURL(file);
      reader.onload = e => {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        const code = e.target.result;
        this.base64URI = code.replace('data:image/jpeg;base64,', '')
      }

      let self = this;
      // console.log(this.nowFile)
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    beforType(item) {
      this.nowFile = item;
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M'
      });
    },
    shopSalePlanFun() {
      if (this.formLeft.shopSalePlan - 0 >= 150000) {
        this.formLeft.shopTaxRate = '1'
      } else {
        this.formLeft.shopTaxRate = '0'
      }
    },
    saveData() {
      if (this.formLeft.shopSalePlan < 0) {
        this.$Message.error('请输入正确的销售额')
        return
      }
      if (this.formLeft.expectedTaxable!='' && parseFloat(this.formLeft.expectedTaxable).toString() == 'NaN') {
        this.$Message.error('请填写正确的预计今年荷兰的应税营业额')
        return
      }
      if (this.formLeft.expectedTaxableNext!='' && parseFloat(this.formLeft.expectedTaxableNext).toString() == 'NaN') {
        this.$Message.error('请填写正确的预计未来下个财政年度荷兰的应税营业额')
        return
      }
      if (this.formLeft.companyRegisteredCapital!='' && parseFloat(this.formLeft.companyRegisteredCapital).toString() == 'NaN') {
        this.$Message.error('请填写正确的公司注册资金')
        return
      }
      let data = { ...this.formLeft }
      this.translateDate(data)
      getMaterialSave(data).then(
        res => {
          if (res.code == 0) {
            this.$Message.success('保存成功')
            window.scroll(0, 0);
          } else {
            // self.$Message.warning(res.message);
          }
        },
        err => {
          // self.$Message.warning(err.message);
        }
      )
        .catch(e => { })
        .finally(() => { });
    },
    submitData() {
      let self = this
      if (self.formLeft.shopSalePlan < 0) {
        this.$Message.error('请输入正确的销售额')
        return
      }
      if (self.formLeft.companyLegalPersonCardFrontTranslate == '') {
        this.$Message.error('请上传身份证公证翻译件人像面')
        return
      }
      if (self.formLeft.companyLegalPersonCardReverseTranslate == '') {
        this.$Message.error('请上传身份证公证翻译件国徽面')
        return
      }
      if (this.formLeft.expectedTaxable!='' && parseFloat(self.formLeft.expectedTaxable).toString() == 'NaN') {
       this.$Message.error('请填写正确的预计今年荷兰的应税营业额')
        return
      }
      if (this.formLeft.expectedTaxableNext!='' && parseFloat(self.formLeft.expectedTaxableNext).toString() == 'NaN') {
       this.$Message.error('请填写正确的预计未来下个财政年度荷兰的应税营业额')
        return
      }
      if (this.formLeft.companyRegisteredCapital!='' && parseFloat(self.formLeft.companyRegisteredCapital).toString() == 'NaN') {
       this.$Message.error('请填写正确的公司注册资金')
        return
      }
      self.$refs['formLeft'].validate((valid) => {
        if (valid) {
          let data = { ...self.formLeft }
          self.translateDate(data)
          getMaterialSubmit(data)
            .then(
              res => {
                if (res.code == 0) {
                  self.$Message.success('提交资料成功')
                  self.$emit('submitSuccess', res.timestamp)
                }else{
                  this.$Message.error('资料填写有误')
                }
              },
              err => { })
            .catch(e => { })
            .finally(() => {
            })
        } else {
          self.$Message.error('请完善资料后进行提交')
        }
      })
    },
    //转换日期
    translateDate(data) {
      data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
      data.businessInitialTime = this.formatDate(this.formLeft.businessInitialTime, 'date')
      data.warehouseInitialTime = this.formatDate(this.formLeft.warehouseInitialTime, 'date')
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, 'date')
    },
    // 公司资料信息自动填充
    automaticInformationFilling() {
      getAllServiceCompanies().then(res => {
        if (res.code === 0) {
          this.lenovoSearchList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    formatDate(date, type) {
      if (typeof date === "object" && date) {
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
  },
  mounted() {
    this.automaticInformationFilling()
    // console.log(this.formLeft)
  },
  watch: {
    leftFrom: {
      immediate: true,  // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val, oldval) {
        if (JSON.stringify(val) != '{}') {
          this.formLeft = val
          this.formLeft.shopNature = String(val.shopNature)
          this.formLeft.isThereShop = String(val.isThereShop)
          this.formLeft.shopTaxRate = String(val.shopTaxRate)
          this.formLeft.isShopConsoleScreenshot = String(val.isShopConsoleScreenshot)
          this.formLeft.companyType = String(val.companyType)
          this.formLeft.certificateType = String(val.certificateType)
          this.formLeft.expectedTaxable = String(val.expectedTaxable)
          this.formLeft.expectedTaxableNext = String(val.expectedTaxableNext)
          this.formLeft.companyRegisteredCapital = String(val.companyRegisteredCapital)
        }
      }
    },
  }
}
</script>
<style scoped lang="less">
/deep/ .ivu-form-item-error-tip{
  width: 312px;
}
.top-lable{
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    padding: 10px 12px 10px 0;
}
/deep/ .ivu-row {
  width: 100%;
  margin-left: 0px;
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.stepH {
  .tips-icon {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    text-align: center;
    color: #ed3e3e;
    cursor: pointer;
    img {
      width: 100%;
      margin-top: 7px;
    }
  }
}
.container {
  .stepAE {
    width: 100% !important;
    padding: 0px;
    /deep/ .ivu-radio-group {
      margin-top: 4px;
    }
    /deep/ .ivu-form {
      .ivu-form-item {
        margin-bottom: 15px;
      }
      .ivu-form-item-label {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        // float: none;
      }
      .ivu-form-item-content {
        width: 90%;
      }
    }
    /deep/ .ivu-input-wrapper {
      width: 100%;
    }
    /deep/ .ivu-select {
      width: 100%;
    }
    /deep/ .ivu-tooltip-popper {
      width: 200px;
    }
    /deep/ .ivu-date-picker {
      width: 100%;
    }
    // /deep/ .ivu-form-item {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: flex-start;
    // }
    /deep/ textarea.ivu-input {
      margin-left: 0px;
    }
    .title {
      width: 100%;
      height: 40px;
      background: #d6e8fd;
      padding-left: 32px;
      font-size: 18px;
      height: 55px;
      line-height: 55px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .line {
      background: #f6f5f8;
      height: 24px;
      width: 100%;
    }
    .item-content {
      width: 100%;
      background: #ffffff;
      padding: 24px 32px;
    }
    /deep/ .ivu-upload {
      width: 100%;
      cursor: pointer;
      .inner {
        width: 100%;
        height: 32px;
        background: #16ade9;
        border-radius: 2px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 20px;
          height: 20px;
          margin-top: 0px;
        }
        .uplad-word {
          color: #ffffff;
        }
      }
    }
    .notChange {
      .inner {
        background: #9999991f;
        .uplad-word {
          color: #666666;
        }
        img {
          display: none;
        }
      }
    }
    .out-img-box {
      .img-box {
        position: relative;
        text-align: center;
        .show-pdf {
          color: #16ade9;
        }
        button {
          width: 0px;
          padding: 0px;
          border: none;
          position: absolute;
          top: 8px;
          height: 0px;
          z-index: 1;
          margin-left: 3px;
          img.closeImg {
            width: 13px;
            height: 13px;
          }
        }
      }
    }
    .upload-tip {
      font-size: 12px;
      color: #cccccc;
      vertical-align: bottom;
      a {
        color: #16ade9;
      }
      img {
        width: 14px;
        height: 14px;
        margin-top: 9px;
        float: left;
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
</style>

