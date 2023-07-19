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
                <Radio :disabled="notChange" label="1">公司主体（含个体工商户）</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司类型"
                      prop="companyType"
                      style="width:300px;">
              <RadioGroup v-model="formLeft.companyType">
                <Radio :disabled="notChange" label="1">大陆公司</Radio>
                <Radio :disabled="notChange" label="2">香港公司</Radio>
                <Radio :disabled="notChange" label="3">境外公司</Radio>
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner" @click="beforType('companyBusinessLicense')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessLicense">
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
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
                   v-if="formLeft.companyBusinessRegistrationBr">
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
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
                   v-if="formLeft.companyRegistrationCi">
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
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
                   v-if="formLeft.companyCorporateFoundingNnc1">
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
            <FormItem label="商业登记证/海外证书"
                      v-if="formLeft.companyType==='3'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessLicenseCopy">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicenseCopy')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicenseCopy')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner" @click="beforType('companyBusinessLicenseCopy')">
                  <img class="uplad-symbol" src="@/assets/images/common/uploadIcon1.png" alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessLicenseCopy">
                <div class="inner img-box">
                  <a :href="formLeft.companyBusinessLicenseCopy"
                     target="_blank"
                     class="show-pdf">
                    商业登记证/海外证书
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyBusinessLicenseCopy')"
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
            <FormItem label="社会统一信用代码："
                      v-if="formLeft.shopNature === '1'"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyCreditCode">
              <Input v-model="formLeft.companyCreditCode"
                     placeholder="工商统一信用代码"
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
                <Radio :disabled="notChange"
                       label="2">护照</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8" v-if="formLeft.certificateType === '1'">
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
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
                   v-if="formLeft.companyLegalPersonCardFront">
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      style="margin-top:16px;"
                      :class="{'notChange': notChange}"
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
            <Col :span="8" v-if="formLeft.certificateType === '2'">
            <FormItem label="法人护照扫描件"
                      v-if="formLeft.certificateType === '2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyLegalPersonCardPassport">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardPassport')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyLegalPersonCardPassport')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyLegalPersonCardPassport">
                <div class="inner img-box">
                  <a :href="formLeft.companyLegalPersonCardPassport"
                     target="_blank"
                     class="show-pdf">
                    法人护照扫描件
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyLegalPersonCardPassport')"
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
          </Row>
          <Row>

            <Col :span="8" v-if="formLeft.certificateType=='1'">
            <FormItem label="法人身份证号码"
                      v-if="formLeft.certificateType=='1'"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCard">
              <Input v-model="formLeft.companyLegalPersonCard"
                     placeholder="请输入法人身份证号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8" v-if="formLeft.certificateType=='2'">
            <FormItem label="法人护照号码："
                      v-if="formLeft.certificateType=='2'"
                      class="requiredItem"
                      style="width:300px;"
                      prop="legalPersonCardPassportNumber">
              <Input v-model="formLeft.legalPersonCardPassportNumber"
                     placeholder="请填写护照号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人英文姓名"
                      prop="companyLegalPersonEn"
                      style="width:300px;">
              <Input v-model="formLeft.companyLegalPersonEn"
                     placeholder="请用拼音输入"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请用拼音输入姓名</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人中文姓名"
                      prop="companyLegalPersonZh"
                      style="width:300px;">
              <Input v-model="formLeft.companyLegalPersonZh"
                     placeholder="请输入法人中文姓名"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人出生日期："
                      class="requiredItem"
                      style="width:300px;"
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
            <Col :span="8">
            <FormItem label="法人身份证英文地址"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCardAddress">
              <Input v-model="formLeft.companyLegalPersonCardAddress"
                     type="textarea"
                     placeholder="请输入法人身份证英文地址"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请用拼音输入身份证详细地址</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人身份证中文地址"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCardAddressZh">
              <Input v-model="formLeft.companyLegalPersonCardAddressZh"
                     type="textarea"
                     placeholder="请输入法人身份证中文地址"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <div class="legalPersonSignature">
              <p class="titleSign requiredItem">
                法人签名
              </p>

              <div class="flex">
                <div id="qrcode"
                     v-show="status == 0 || status == 8">
                </div>
                <div class="signature">
                  <img v-if="formLeft.companyLegalPersonSign !== '' && formLeft.companyLegalPersonSign !== undefined"
                       :src="formLeft.companyLegalPersonSign"
                       alt="">
                  <Button v-else
                          type="primary"
                          @click="hasSignature()">我已签名</Button>
                  <span v-if="(status == 0 || status == 8) && (formLeft.companyLegalPersonSign !== '' && formLeft.companyLegalPersonSign !== undefined)"
                        @click="hasSignature">
                    <img class="refresh"
                         src="../../../../assets/images/common/refreshBlue.png"
                         alt="">
                  </span>
                </div>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top:10px;">
                说明：法人签名主要应用于注册税号POA授权,请使用英文格式签名，如张三（San Zhang）
                <a style="font-size: 12px;font-weight: 400;"
                   href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                   target="_black">查看示例>></a>
              </p>
            </div>
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
                      class="requiredItem requiredItem">
              <RadioGroup v-model="formLeft.shopSalePlatformName">
                <Radio label="亚马逊"
                       :disabled="notChange">亚马逊</Radio>
                <Radio label="速卖通"
                       :disabled="notChange">速卖通</Radio>
                <Radio label="eBay"
                       :disabled="notChange">eBay</Radio>
                <Radio label="其它"
                       :disabled="notChange">其它</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>

            <Col :span="8">

            <FormItem label="店铺链接"
                      prop="shopHref"
                      style="width:300px;">
              <Input v-model="formLeft.shopHref"
                     placeholder="请复制店铺后台链接"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司英文名称"
                      style="width:300px;"
                      prop="companyNameEn">
              <Input v-model="formLeft.companyNameEn"
                     placeholder="请输入店铺后台公司英文名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司邮编号码"
                      prop="companyPostCode"
                      style="width:300px;">
              <Input v-model="formLeft.companyPostCode"
                     placeholder="请输入店铺后台的邮编号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="公司英文地址"
                      class="requiredItem"
                      prop="companyAddressEn"
                      style="width:300px;">
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
                     placeholder="请直接复制后台英文地址"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请根据您的店铺后台英文地址进行填写（需保持一致）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="税号生效日期:"
                      prop="shopTaxEffectiveData"
                      style="width:300px;">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 114px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt=""></span>
                <div slot="content">
                  <p>温馨提示：捷克税号下达的日期为税号生效日期。请填写预期发货日期。如果填写日期早于税号下达日期，则需回溯申报，回溯申报将导致产生罚金/滞纳金/利息；</p>
                  <p>建议在开始销售前注册捷克VAT税号；</p>
                </div>
              </Tooltip>
              <DatePicker type="date"
                          :options="datePicker"
                          placeholder="建议一个月左右日期"
                          v-model="formLeft.shopTaxEffectiveData"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：实际税号生效日期，以税局下发税号时间为准</p>
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
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">温馨提示：推荐使用谷歌翻译</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="是否有其他欧盟VAT"
                      class="requiredItem flex-direction "
                      prop="isOtherGulfStateDutyOrServices"
                      style="width:300px;">
              <RadioGroup v-model="formLeft.isOtherGulfStateDutyOrServices">
                <Radio label="1"
                       :disabled="notChange">有</Radio>
                <Radio label="2"
                       :disabled="notChange">无</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="VAT增值税号"
                      v-if="formLeft.isOtherGulfStateDutyOrServices === '1'"
                      class="requiredItem"
                      prop="shopOtherEuTaxNumber"
                      style="width:300px;">
              <Input v-model="formLeft.shopOtherEuTaxNumber"
                     placeholder="请输入欧盟国税号，如有多个，则全部输入"
                     :disabled="notChange">
              </Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="预计未来12个月销售额："
                      class="requiredItem"
                      prop="shopSalePlan"
                      style="width:300px;">
              <Input v-model="formLeft.shopSalePlan"
                     placeholder="请输入完整的销售额"
                     type="number"
                     :disabled="notChange">
              <span slot="append">EUR</span>
              </Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注： 请输入完整的销售额，如10W，则输入100000</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="是否有欧盟EORI号"
                      class="requiredItem flex-direction "
                      prop="isThereEoriNumber"
                      style="width:300px;">
              <RadioGroup v-model="formLeft.isThereEoriNumber">
                <Radio label="1"
                       :disabled="notChange">有</Radio>
                <Radio label="2"
                       :disabled="notChange">无</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="欧盟国EORI号"
                      v-if="formLeft.isThereEoriNumber === '1'"
                      class="requiredItem"
                      prop="otherEoriNumber"
                      style="width:300px;">
              <Input v-model="formLeft.otherEoriNumber"
                     placeholder="请输入欧盟国EORI-清关号"
                     :disabled="notChange">
              </Input>
            </FormItem>
            </Col>
            <!-- <Col :span="8">
              <FormItem label="是否使用捷克任何仓"
                        class="requiredItem flex-direction "
                        prop="useEntrepot"
                        style="width:300px;">
                <RadioGroup v-model="formLeft.useEntrepot" @on-change="isUseCZStoreChange($event)">
                  <Radio label="1" :disabled="notChange">有</Radio>
                  <Radio label="2" :disabled="notChange">无</Radio>
                </RadioGroup>
              </FormItem>
            </Col> -->
            <Col :span="8">
              <FormItem label="店铺后台公司信息页面截图"
                        style="margin-bottom:15px;width:300px;"
                        :prop="formLeft.shopSalePlatformName != '亚马逊' ? 'shopConsoleScreenshot' :''"
                        class="flex-direction"
                        :class="{'requiredItem':formLeft.shopSalePlatformName != '亚马逊'}">
                <Upload :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :class="{'notChange': notChange}"
                        :on-exceeded-size="handleMaxSize"
                        :disabled="notChange">
                  <div class="inner"
                      @click="beforType('shopConsoleScreenshot')">
                    <img class="uplad-symbol"
                        src="@/assets/images/common/uploadIcon1.png"
                        alt="">
                    <span class="uplad-word">点击上传</span>
                  </div>
                </Upload>
                <div class="out-img-box"
                    v-if="formLeft.shopConsoleScreenshot">
                  <div class="inner img-box">
                    <a :href="formLeft.shopConsoleScreenshot"
                      target="_blank"
                      class="show-pdf">
                      店铺后台公司信息页面截图
                    </a>
                    <Button class="deletBtn">
                      <img @click="removeHandler(1,1,'shopConsoleScreenshot')"
                          class="closeImg"
                          v-if="!notChange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <div class="upload-tip">
                  <a href="http://file.itaxs.com/dev/20210705/ab68e2f7c291475b9694484ae4e9522a.pdf"
                    target="_blank">
                    <img src="@/assets/images/common/searchImg.png"
                        alt="">
                    查看示例
                  </a>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <FormItem label="捷克仓库地址："
              v-if="formLeft.shopSalePlatformName == 'eBay' || formLeft.shopSalePlatformName == '其它'"
                        class="requiredItem"
                        prop="czEntrepotAddress"
                        style="width:300px;">
                <Input v-model="formLeft.czEntrepotAddress"
                      placeholder="请输入捷克仓库地址"
                      :disabled="notChange"></Input>
              </FormItem>              
            </Col>
            <Col :span="8">
              <FormItem label="捷克仓库地址链接："
              v-if="formLeft.shopSalePlatformName == 'eBay' || formLeft.shopSalePlatformName == '其它'"
                        class="requiredItem"
                        prop="czEntrepotAddressLink"
                        style="width:300px;">
                <Input v-model="formLeft.czEntrepotAddressLink"
                      placeholder="请输入捷克仓库地址链接"
                      :disabled="notChange"></Input>
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
                      prop="bankAccountName"
                       style="width:300px;">
              <Input v-model="formLeft.bankAccountName"
                     placeholder="请输入开户公司名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="银行英文名称："
                      class="requiredItem"
                      prop="bankName"
                       style="width:300px;">
              <Input v-model="formLeft.bankName"
                     placeholder="请输入开户银行名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="IBAN/银行账户："
                      class="requiredItem"
                      prop="bankAccount"
                       style="width:300px;">
              <Input v-model="formLeft.bankAccount"
                     placeholder="请输入开户银行账户号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="Swift / BIC："
                      class="requiredItem"
                      prop="swiftBic"
                       style="width:300px;">
              <Input v-model="formLeft.swiftBic"
                     placeholder="请输入Swift / BIC"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">备注：银行编码，通常为一串大写字母</p>
            </FormItem>
            </Col>
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
                     placeholder=" 请请输入银行详细英文地址"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：银行的地址（请使用英文输入）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="开户公司英文地址："
                      class="requiredItem"
                       style="width:300px;"
                      prop="bankAccountAddressEn">
              <Input v-model="formLeft.bankAccountAddressEn"
                     type="textarea"
                     placeholder="请输入开户公司英文地址；"
                     :disabled="notChange"
                     :rows="4"
                     style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：开户公司英文地址（请使用英文输入）</p>
            </FormItem>
            </Col>
          </Row>
          <Row>
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
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :class="{'notChange': notChange}"
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
                   v-if="formLeft.bankAccountCertify">
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
                <a href="https://pre-fdfs.itaxs.com/group1/M00/00/DA/rBLKLV_gXR-AX1-gAAINSeOjGYw489.png"
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
import QRCode from 'qrcodejs2';
import { getMaterialSubmit, getRegTaxDetail, getMaterialSave, getAllServiceCompanies, getCompanyInformation, getCompanyLegalPersonSign, getCompanyLegalPersonSignUrl } from "@/api/registerInfo/registerInfo";
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
        companyBusinessLicenseCopy: "",
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
        companyRegisterData: '',
        legalPersonMaritalStatus: '',
        legalPersonBirthplaceProvinceZh: '',
        legalPersonBirthplaceProvinceEn: '',
        legalPersonBirthplaceCityZh: '',
        legalPersonBirthplaceCityEn: '',
        companyLegalPersonCardAddressZh: '',
        shippingProcess: '',
        useEntrepot: '1',
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
        personCardAddressCountryEn: '',
        personCardAddressCityEn: '',
        personCardAddressEn: '',
        shopSalePlatformName: '亚马逊',
        shopSalePlatformAccount: '',
        firstOrderTime: '',
        taxVatCountry: '',
        shopSalePlatformContract: '',
        driverLicense: '',
        shopTaxEffectiveData: '',
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
        czEntrepotAddress:'',
        czEntrepotAddressLink:'',
        bankName: '',
        swiftBic: '',
        bankAccountAddressPostcode: '',
        bankAccountCountryEn: '',
        bankAccountCityEn: '',
        bankAccountAddressEn: '',
        bankAddressEn: '',
        bankCountryEn: '',
        bankCityEn: '',
        bankAccountCertify: '',
        companyLegalPersonMobile: '',
        future2YearSale: '',
        isThereEoriNumber: '1',
        otherEoriNumber: '',
        storageAddressCountry: '',
        otherTaxCertificate: '',

      },
      ruleForm: {
        otherTaxCertificate: [
          { required: true, trigger: "change", message: "请上传完税/纳税证明" }
        ],
        storageAddressCountry: [
          { required: true, trigger: "change", message: "请输入仓储地址国家" }
        ],
        otherEoriNumber: [
          { required: true, trigger: "change", message: "请输入欧盟国EORI号" }
        ],
        isThereEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否有欧盟国EORI号", }
        ],
        isOtherGulfStateDutyOrServices: [
          { required: true, trigger: "change", message: "请选择是否有其他欧盟VAT", }
        ],
        shopOtherEuTaxNumber: [
          { required: true, trigger: "change", message: "请输入VAT增值税号", }
        ],
        articlesOfAssociationFile: [
          { required: true, trigger: "change", message: "请上传公司章程", }
        ],
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

        czEntrepotAddress: [
          { required: true, trigger: "change", message: "请填写捷克仓库地址" }
        ],
        czEntrepotAddressLink: [
          { required: true, trigger: "change", message: "请填写捷克仓库地址链接" }
        ],


        bankAccountName: [
          { required: true, trigger: "change", message: "请填写账户名称" }
        ],
        companyPostCode: [
          { required: true, trigger: "change", message: "请填写邮政编码" }
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
        legalPersonCardPassportNumber: [
          { required: true, trigger: "change", message: "请填写法人护照号码" }
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
          { required: true, trigger: "blur", validator: onlyNumber, message: "请输入公司注册资本（万元）", type: "number" }
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
        companyBusinessLicenseCopy: [
          {
            required: true,
            trigger: "change",
            message: "请上传商业登记证/海外证书"
          }
        ],
      },
      datePicker: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
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
    // 是否使用捷克仓
    isUseCZStoreChange(val){
      if(val == 2){
        this.$Modal.info({
        title: "温馨提示",
        content: `<p>如您不使用捷克任何仓，税局会默认</p><p>无需申请捷克税号，请谨慎选择</p>`
      });
      }
    },
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
      self.$set(self.formLeft,item,res.data.fileUrl);
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
    // 生成二维码
    qrcode() {
      let servicesId = this.servicesId
      getCompanyLegalPersonSignUrl({
        servicesId: servicesId
      }).then(res => {
        if (res.code === 0) {
          let qrcode = new QRCode('qrcode', {
            width: 115,
            height: 115,
            text: res.data, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff",
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 我已签名
    hasSignature: Throttle(function () {
      getCompanyLegalPersonSign({
        servicesId: this.$route.query.servicesId
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success('刷新成功')
          this.formLeft.companyLegalPersonSign = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    }, 1000),
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
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
      const check = !self.formLeft[this.nowFile];
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
    saveData() {
      if (this.formLeft.shopSalePlan < 0) {
        this.$Message.error('请输入预计未来12个月销售额')
        return
      }
      let data = { ...this.formLeft }
      // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
      if(this.formLeft.companyType == 3){
        data.companyBusinessLicense = this.formLeft.companyBusinessLicenseCopy;
      }
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
        this.$Message.error('请输入预计未来12个月销售额')
        return
      }
      self.$refs['formLeft'].validate((valid) => {
        if (valid) {
          let data = { ...self.formLeft }
          // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
          if(self.formLeft.companyType == 3){
            data.companyBusinessLicense = self.formLeft.companyBusinessLicenseCopy;
          }
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
    this.qrcode()
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
          this.formLeft.isOtherGulfStateDutyOrServices = String(val.isOtherGulfStateDutyOrServices)
          this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber)
          this.formLeft.useEntrepot = String(val.useEntrepot)
          if(val.companyType == 3){
            this.$set(this.formLeft,'companyBusinessLicenseCopy',val.companyBusinessLicense)
          }else{
            this.$set(this.formLeft,'companyBusinessLicenseCopy','')
          }
        }
      }
    },
  }
}
</script>
<style scoped lang="less">
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
  .signature {
    background: #f2f2f2;
    width: 172px;
    height: 115px;
    display: inline-block;
    margin-left: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
    img.refresh {
      width: 20px;
      height: 20px;
      margin: 10px;
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
    }
    button {
      position: absolute;
      top: 0px;
      left: 42px;
      right: 0px;
      bottom: 0px;
      margin: auto;
    }
  }
}
.legalPersonSignature {
  .titleSign {
    font-size: 16px;
    font-family: PingFangSC-Medium, "PingFang SC", sans-serif;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    padding: 10px 12px 10px 0;
    &:before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun, sans-serif;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .signature {
    background: #f2f2f2;
    width: 172px;
    height: 115px;
    display: inline-block;
    margin-left: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
    img.refresh {
      width: 20px;
      height: 20px;
      margin: 10px;
      position: absolute;
      top: 0px;
      right: 0px;
      cursor: pointer;
    }
    button {
      position: absolute;
      top: 0px;
      left: 42px;
      right: 0px;
      bottom: 0px;
      margin: auto;
    }
  }
}
#qrcode {
  display: inline-block;
  position: relative;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff;
    padding: 6px;
  }
  p {
    position: absolute;
    bottom: -24px;
    width: 200px;
    font-size: 14px;
    color: #626466;
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

