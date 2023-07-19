<template>
  <div class="SAcontent">
    <div class="container">

      <Form :model="formLeft"
            label-position="top"
            class="formstyle"
            :rules="ruleForm"
            ref="formLeft">

        <div class="big-row">
          <div class="subTitle">公司信息</div>
          <div class="form">
            <div class="stepH">
              <div>
                <FormItem class="requiredItem"
                          prop="vatTaxNumber">
                  <p class="top-lable"><span>*</span>VAT税号</p>
                  <Input placeholder="请输入报税税号"
                        v-model="formLeft.vatTaxNumber"
                        :maxlength="vatNumberSuffixDigitLength"
                        :disabled="ischange">
                  </Input>
                  <p style="color:#F59A23;font-size:12px;">注：请输入ATU开头的税号；</p>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="declarePeriod">
                  <p class="top-lable"><span>*</span>报税周期</p>
                  <Select v-model="formLeft.declarePeriod"
                          placeholder="请选择报税周期"
                          :disabled="ischange">
                    <Option :value="item.status"
                            v-for="(item,index) in declare"
                            :key="index">{{item.type}}</Option>
                  </Select>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyTel">
                  <p class="top-lable"><span>*</span>公司联系电话</p>
                  <Input v-model="formLeft.companyTel"
                        placeholder="请输入公司联系电话"
                        :disabled="ischange"></Input>
                </FormItem>
              </div>
              <div>
                <FormItem class="requiredItem"
                          prop="companyNameZh">
                  <p class="top-lable"><span>*</span>公司中文名称</p>
                  <AutoComplete v-model="formLeft.companyNameZh"
                                :data="lenovoSearchList"
                                @on-select="selectCompany"
                                placeholder="请输入公司中文名称"
                                :disabled="ischange">
                  </AutoComplete>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyNameEn">
                  <p class="top-lable" style="margin-top:30px"><span>*</span>公司英文名称</p>
                  <Input v-model="formLeft.companyNameEn"
                        placeholder="需与税号在VIES上面显示的公司名一致"
                        :disabled="ischange"></Input>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyRegisterData">
                  <p class="top-lable"><span>*</span>公司成立日期</p>
                  <DatePicker type="date"
                              placeholder="请选择公司成立日期"
                              v-model="formLeft.companyRegisterData"
                              format="yyyy-MM-dd"
                              class="tax-date"
                              :options="optionsDate"
                              :disabled="ischange"></DatePicker>
                </FormItem>
              </div>
              <div>
                <FormItem class="requiredItem"
                          prop="companyAddressEn">
                  <p class="top-lable"><span>*</span>公司英文地址</p>
                  <Input type="text"
                        placeholder="国家 如：China"
                        v-model="formLeft.companyAddressEnCountry"
                        :disabled="ischange"
                        style="width:118px;margin-right:5px;" />
                  <Input type="text"
                        placeholder="城市加省份 如: shenzhenshi guangdong"
                        v-model="formLeft.companyAddressEnCity"
                        :disabled="ischange"
                        style="width:168px" />
                  <br>
                  <Input class="addressEn"
                        v-model="formLeft.companyAddressEn"
                        type="textarea"
                        placeholder="请直接复制后台英文地址，包含城市、省份、邮编、国家。"
                        :disabled="ischange"
                        :rows="4"
                        style="width: 294px;margin-top:7px" />
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyEmail">
                  <p class="top-lable" style="margin-top:10px"><span>*</span>公司联系邮箱</p>
                  <Input v-model="formLeft.companyEmail"
                        placeholder="请填写公司邮箱"
                        :disabled="ischange"></Input>
                </FormItem>
              </div>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">法人信息</div>
          <div class="form">
            <div class="stepH">
              <FormItem class="requiredItem"
                        prop="companyLegalPersonEn">
                <p class="top-lable"><span>*</span>法人英文名</p>
                <Input v-model="formLeft.companyLegalPersonEn"
                      placeholder="请填写英文名字"
                      :disabled="ischange"></Input>
              </FormItem>
              <FormItem class="requiredItem"
                        prop="companyLegalPersonCard">
                <p class="top-lable"><span>*</span>法人身份证号</p>
                <Input v-model="formLeft.companyLegalPersonCard"
                      placeholder="请填写法人身份证号码"
                      :disabled="ischange"></Input>
              </FormItem>
              <div style="width:294px"></div>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">店铺信息</div>
          <div class="form">
            <div class="stepH">
              <FormItem class="requiredItem"
                        prop="shopHref">
                <p class="top-lable"><span>*</span>店铺链接</p>
                <Input v-model="formLeft.shopHref"
                      placeholder="请输入店铺链接"
                      :disabled="ischange">
                </Input>
              </FormItem>
              <FormItem class="requiredItem"
                        prop="taxEffectiveDate">
                <p class="top-lable"><span>*</span>税号生效日期</p>
                <DatePicker type="date"
                            placeholder="请选择税号生效日期"
                            v-model="formLeft.taxEffectiveDate"
                            format="yyyy-MM-dd"
                            class="tax-date"
                            :disabled="ischange"></DatePicker>
              </FormItem>
              <FormItem class="requiredItem">
                <p class="top-lable"><span>*</span>上一次申报区间</p>
                <div class="clearfix">
                  <div class="fl">
                    <FormItem prop="upBeginTime">
                      <DatePicker type="month"
                                  placeholder="开始时间"
                                  style="width: 124px;margin-right:7px;"
                                  :options="options"
                                  v-model="formLeft.upBeginTime"
                                  format="yyyy-MM"
                                  :disabled="ischange"></DatePicker>
                    </FormItem>
                  </div>
                  <span style="text-align: center"
                        class="fl">------</span>
                  <div class="fl">
                    <FormItem prop="upEndTime">
                      <DatePicker type="month"
                                  placeholder="结束时间"
                                  style="width: 124px;margin-left:7px;"
                                  :options="options"
                                  v-model="formLeft.upEndTime"
                                  format="yyyy-MM"
                                  :disabled="ischange"></DatePicker>
                    </FormItem>
                  </div>
                </div>
              </FormItem>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">文件信息</div>
          <div class="form">
            <div class="stepH">
              <div style="width:294px">
                <FormItem class="requiredItem"
                          prop="vatTaxNumberFile">
                  <p class="top-lable"><span>*</span>税号文件</p>
                  <div class="upload-file-box">
                    <Upload :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}"
                            :action="ImgUrl"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            style="margin-right:20px"
                            
                            :class="{'ischange': ischange}"
                            :disabled="ischange">
                      <div class="inner"
                          @click="beforType('vatTaxNumberFile')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box"
                        v-if="formLeft.vatTaxNumberFile!=''">
                      <div class="inner img-box">
                        
                        <a :href="formLeft.vatTaxNumberFile"
                          target="_blank"
                          class="show-pdf">税号文件</a>
                          <Button class="deletBtn"
                                v-if="!ischange">
                          <img @click="removeHandler(1,1,'vatTaxNumberFile')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt="">
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyLegalPersonCardFront">
                  <p class="top-lable"><span>*</span>法人身份证正反面</p>
                  <div class="upload-file-box">
                    <Upload :before-upload="beforeUploadHandler"
                            :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardFront')}"
                            :action="ImgUrl"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            style="margin-right:20px"
                            
                            :class="{'ischange': ischange}"
                            :disabled="ischange">
                      <div class="inner"
                          @click="beforType('companyLegalPersonCardFront')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box"
                        v-if="formLeft.companyLegalPersonCardFront!=''">
                      <div class="inner img-box">
                        
                        <a :href="formLeft.companyLegalPersonCardFront"
                          target="_blank"
                          class="show-pdf">法人身份证正反面</a>
                          <Button class="deletBtn"
                                v-if="!ischange">
                          <img @click="removeHandler(1,1,'companyLegalPersonCardFront')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt="">

                        </Button>
                      </div>
                    </div>
                    <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                  </div>
                  <p class="upload-tip" style="line-height:20px" v-if="!ischange">注：需要把正反面照片合并到一个文件<br/>支持JPG、JPEG、PNG、PDF格式上传</p>
                  <span class="explame" v-if="!ischange">
                    <a href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/fa97530f1a994956bcd3fffee24c13ed.jpg"
                      target="_blank" style="color:#16ADE9">
                      <img src="@/assets/images/common/serch.png">
                      查看示例
                    </a>
                  </span>
                </FormItem>
              </div>
              <div style="width:294px">
                <FormItem class="requiredItem"
                        prop="lastDeclareReceipt">
                <p class="top-lable"><span>*</span>历史申报回执</p>
                <div class="upload-file-box">
                  <Upload :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastDeclareReceipt')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf','zip','rar']"
                          :show-upload-list="false"
                          style="margin-right:20px"
                          
                          :class="{'ischange': ischange}"
                          :disabled="ischange">
                    <div class="inner"
                        @click="beforType('lastDeclareReceipt')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                        点击上传
                      </span>
                    </div>
                  </Upload>
                  <div class="out-img-box"
                      v-if="formLeft.lastDeclareReceipt!=''">
                    <div class="inner img-box">
                      
                      <a :href="formLeft.lastDeclareReceipt"
                        target="_blank"
                        class="show-pdf">历史申报回执</a>
                        <Button class="deletBtn"
                              v-if="!ischange">
                        <img @click="removeHandler(1,1,'lastDeclareReceipt')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                </div>
                <p class="upload-tip" style="line-height:20px" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传<br/>如有多个请上传压缩包ZIP格式</p>
              </FormItem>
              </div>
              <div style="width:294px">
                <FormItem class="requiredItem"
                        prop="companyBusinessLicense">
                <p class="top-lable"><span>*</span>营业执照</p>
                <div class="upload-file-box">
                  <Upload :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :format="['jpg','jpeg','png','gif','pdf']"
                          :show-upload-list="false"
                          style="margin-right:20px"
                          
                          :class="{'ischange': ischange}"
                          :disabled="ischange">
                    <div class="inner"
                        @click="beforType('companyBusinessLicense')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                        点击上传
                      </span>
                    </div>
                  </Upload>
                  <div class="out-img-box"
                      v-if="formLeft.companyBusinessLicense!=''">
                    <div class="inner img-box">
                      
                      <a :href="formLeft.companyBusinessLicense"
                        class="show-pdf"
                        target="_blank">营业执照</a>
                        <Button class="deletBtn"
                              v-if="!ischange">
                        <img @click="removeHandler(1,1,'companyBusinessLicense')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                </div>
                <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/21a947d6a6074e0ba329a115bc1ba854.jpg"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
              </FormItem>
              </div>
              
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">法人签名</div>
          <div class="form">
            <FormItem class="legalPersonSignatureBox requiredItem">
            <div class="legalPersonSignature ">
              <div class="signContent">
                
                <div class="flex">
                  <div id="qrcode"
                       v-show="status == 28 || status == 32">
                    <p>请扫码进行转代理授权</p>
                  </div>
                  <div class="signature">
                    <img v-if="formLeft.companyLegalPersonSign !== '' && formLeft.companyLegalPersonSign !== undefined"
                         :src="formLeft.companyLegalPersonSign"
                         alt="">
                    <Button v-else
                            type="primary"
                            @click="hasSignature">我已签名</Button>
                    <span v-if="(status == 28 || status == 32) && (formLeft.companyLegalPersonSign !== '' && formLeft.companyLegalPersonSign !== undefined)"
                          :src="formLeft.companyLegalPersonSign"
                          @click="hasSignature">
                      <img class="refresh"
                           src="@/assets/images/common/refreshBlue.png"
                           alt="">
                    </span>
                  </div>
                </div>
                <div class="" style="color:#FBB73C;margin-top:30px">
                  说明：法人签名主要应用于转代理POA授权,请使用英文格式签名，如张三（San Zhang）
                  <p>
                    <a href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                      target="_black" style="color:#16ADE9">
                      <img src="@/assets/images/common/serch.png" style="position: relative; top:4px">
                      查看示例
                    </a>
                  </p>
                  
                </div>
              </div>
            </div>
          </FormItem>
          </div>
        </div>
        
      </Form>
    </div>
  </div>
</template>

<script>
import {
  saveAgentForm,
  submitAgentForm,
  getAgentForm
} from "@/api/turnToAgent/turnToAgent";
import { getCompanyInformation, getCompanyLegalPersonSignUrl, getAllServiceCompanies, getCompanyLegalPersonSign } from "@/api/registerInfo/registerInfo";
import { legalpersonCountry, taxInfo } from "@/api/taxModule"
import { baseInfoByCondition } from "@/api/taxModule";
import { Throttle } from "@/libs/throttle.js"
import QRCode from 'qrcodejs2'
export default {
  props: ['ischange', 'leftFrom', 'status', 'servicesId'],
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
        return callback(new Error('请填写销售额'));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value - 0)) {
          callback(new Error('请填写销售额'));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      formLeft: {
        vatTaxNumber: "",
        declarePeriod: "1",
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
        shopTaxEffectiveData: '',
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
        orderServicesId: this.servicesId,
        articlesOfAssociationFile: '',
        salesEvidenceFile: '',
        recordOfPenaltyCharges: ''
      },
      ruleForm: {
        shopSaleBefore: [
          { required: true, trigger: "change", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        future30Sale: [
          { required: true, trigger: "change", message: "请填写阿拉伯数字", validator: onlyNumber }
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
        legalPersonCardPassportNumber: [
          { required: true, trigger: "change", message: "请填写法人护照号" }
        ],
        swiftBic: [
          { required: true, trigger: "change", message: "请填写Swift / BIC" }
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
        postCode: [
          { required: true, trigger: "change", message: "请填写邮政编码" }
        ],
        transformProxyReason: [
          { required: true, trigger: "change", message: "请填写转代理原因" }
        ],
        profession: [
          { required: true, trigger: "change", message: "请填写职业" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "change", message: "请填写电商平台账号完整名称" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "change", message: "请填写常用联系邮箱" }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "change", message: "请填写常用联系手机号" }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "change", message: "请填写西班牙本地银行信息" }
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
          { required: true, trigger: "change", message: "请填写法人身份证/护照号码" }
        ],
        companyLegalPersonBirthday: [
          { required: true, trigger: "change", message: "请选择法人出生日期", type: "date" }
        ],
        legalPersonMaritalStatus: [
          { required: true, trigger: "change", message: "请选择法人婚姻状态" }
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
          { required: true, trigger: "change", message: "请输入公司注册资本（万元）", type: "number" }
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
        shopConsoleScreenshot: [
          {
            required: true,
            trigger: "change",
            message: "请上传后台店铺截图"
          }
        ],
        legalPersonPapers: [
          { required: true, trigger: "change", message: "请上传身份证正反面" }
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
            message: "请上传支付凭证"
          }
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
        companyLegalPersonCardFront: [
          {
            required: true,
            trigger: "change",
            message: "请上传法人身份证正反面"
          }
        ],
        salesEvidenceFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传销售证据"
          }
        ],
      },
      lenovoSearchList: [], //联想列表
      fileType: {
        companyBusinessLicense: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastPayCertificate: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        vatTaxFileCopy: "",
        companyBusinessRegistrationBr: '',
        companyRegistrationCi: '',
        companyCorporateFoundingNnc1: '',
        shopConsoleScreenshot: '',
        vatTaxNumberFile: '',
        companyLegalPersonCardPassport: '',
        companyLegalPersonCardFront: '',
        companyCreditReport: '',
        articlesOfAssociationFile: '',
        salesEvidenceFile: '',
        recordOfPenaltyCharges: ''
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
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;;
        }
      },
      vatNumberSuffixDigitLength: 0, //税号的长度
      vatNumberPrefix: 'GB',
      declare: [],
      options: {
        disabledDate(date) {
          const dates = new Date(),
            nowDate = date.getDate() + 1;
          return date && date.valueOf() > Date.now() - 86400000 * nowDate;
        }
      },
      nowFile: ''
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
    getInfo() {
      //获取申报周期
      baseInfoByCondition({ countryCode: this.$route.query.countryCode })
        .then(res => {
          if (res.code == 0) {
            this.vatNumberPrefix = res.data.vatNumberPrefix;
            this.vatNumberSuffixDigitLength =
              res.data.vatNumberSuffixDigitLength;
            let data = res.data,
              obj = {};
            if (data.monthPeriod === 0)
              this.declare.push({ type: "月报", status: "0" });
            if (data.quarterPeriod === 0)
              this.declare.push({ type: "季报", status: "1" });
            if (data.yearPeriod === 0)
              this.declare.push({ type: "年报", status: "2" });
          }
        })
        .finally(() => { });
    },
    changeVatDate(date, item) {
      // this.formLeft[item] = date;
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
      this.fileType[item] = res.data.suffix;
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    beforType(item) {
      this.nowFile = item;
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
    },
    beforeUploadHandler(item) {
      let self = this;
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    saveData() {
      let data = { ...this.formLeft }
      this.translateDate(data)
      //转换税号
      data.vatTaxNumber = String(this.formLeft.vatTaxNumber);
      saveAgentForm(data).then(
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
      let data = { ...this.formLeft }
      this.translateDate(data)
      //转换税号
      data.vatTaxNumber = String(this.formLeft.vatTaxNumber);
      this.$refs['formLeft'].validate((valid) => {
        if (valid) {
          submitAgentForm(data)
            .then(
              res => {
                if (res.code == 0) {
                  this.$Message.success('提交资料成功')
                  this.$emit('submitSuccess', res.timestamp)
                }else{
                  this.$Message.error('资料填写有误')
                }
              },
              err => { })
            .catch(e => { })
            .finally(() => {
            })
        } else {
          this.$Message.error('请完善资料后进行提交')
        }
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
    // 生成二维码
    qrcode() {
      let servicesId = this.$route.query.servicesId
      getCompanyLegalPersonSignUrl({
        servicesId: servicesId
      }).then(res => {
        if (res.code === 0) {
          let qrcode = new QRCode('qrcode', {
            width: 144,
            height: 144,
            text: res.data, // 二维码地址
            colorDark: "#000",
            colorLight: "#fff",
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //转换日期
    translateDate(data) {
      data.legalPersonCardPassportPastTime = this.formatDate(this.formLeft.legalPersonCardPassportPastTime, 'date')
      data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData, 'date')
      data.thresholdValueTime = this.formatDate(this.formLeft.thresholdValueTime, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
      data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
      data.upEndTime = this.formatDate(this.formLeft.upEndTime, 'month')
      data.upBeginTime = this.formatDate(this.formLeft.upBeginTime, 'month')
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
    this.getInfo();
    this.qrcode()
    this.automaticInformationFilling()
  },
  watch: {
    leftFrom: {
      immediate: true,  // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val, oldval) {
        if (JSON.stringify(val) != '{}') {
          this.formLeft = val
          this.formLeft.shopNature = String(val.shopNature)
          this.formLeft.isThereShop = String(val.isThereShop)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.container {
  border-radius: 4px;
  font-size: 14px;
  .formstyle {
    margin-top: 20px;
    .explame {
      a{
        color: #16ade9;
      }
      
      cursor: pointer;
      img{
        position: relative;
        top: 4px;
      }
    }
    .form{
      padding: 0 32px 32px 32px;
      .flex-item{
        display: flex;
        justify-content: space-between;
        
      }
      .top-lable{  
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        margin-bottom: 8px;
        span{
          color: #FA5555;
          margin-right: 4px;
        }
        .tips-icon {
          width: 17px;
          height: 17px;
          font-weight: 500;
          border-radius: 50%;
          display: inline-block;
          line-height: 17px;
          text-align: center;
          background-color: #FBB73C;
          color: #fff;
          cursor: pointer;
        }
      }
      .upload-tip {
          font-size: 14px;
          color: #FBB73C;
          vertical-align: bottom;
          
        }
    }
  }
}
.big-row{
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 24px;
}
.subTitle {
  
  font-size: 18px;
  margin-bottom: 28px;
  font-weight: 700;
  color: #333;
  height: 55px;
  background: rgba(24, 144, 255, 0.19);
  line-height: 55px;
  padding-left: 32px;
  border-radius: 4px 4px 0px 0px;
}
div.inner {
  width: 294px;
  height: 32px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  border-radius: 2px;
  background: #16ADE9;
  cursor: pointer;
  .uplad-symbol {
    margin-top: 30px;
  }
  .main-text {
    font-size: 12px;
    line-height: 24px;
  }
}
.SAcontent {
  min-width: 1024px;
  // margin-top: 20px;
}
.stepH {
  background-color: #fff;
  // padding: 0 100px;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
  // /deep/ .ivu-row {
  //   width: 100%;
  // }
  // /deep/ .ivu-form-item {
  //   width: 100% !important;
  // }
  .redTip::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  .tips-icon {
    width: 17px;
    height: 17px;
    border: 1px solid rgba(237, 62, 62, 1);
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    text-align: center;
    color: #ed3e3e;
    cursor: pointer;
  }
}
.title {
  padding-left: 10px;
  font-size: 14px;
  font-weight: 700;
  padding-bottom: 20px;
  span.line {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: rgba(22, 173, 233, 1);
    margin-right: 10px;
  }
  .remark {
    margin-left: 15px;
    font-size: 14px;
    color: #515a6e;
    font-weight: 400;
  }
}
.container .write-info .wrapper .company-title {
  padding-top: 20px;
}
& .form-item {
  padding-bottom: 20px;
  position: relative;
  & .label {
    color: #626466;
    font-size: 14px;
    display: inline-block;
    min-width: 278px;
    padding-bottom: 10px;
    white-space: nowrap;
    text-align: right;
    padding-right: 24px;
  }
  & .file {
    width: 172px;
  }
  & input {
    width: 400px;
    font-size: 14px;
    border: 1px solid #dadada;
    text-indent: 8px;
    height: 34px;
  }
  & input::-webkit-input-placeholder {
    color: #c6c8cc;
  }

  & .ivu-select {
    height: 38px;
    width: 400px;
    height: 34px;
    text-align: left;
    & /deep/ .ivu-select-selection {
      height: 38px;
      border-radius: 0px;
      border-color: #dadada;
      & .ivu-select-placeholder,
      & .ivu-select-selected-value {
        height: 38px;
        line-height: 38px;
        font-size: 14px;
      }
      & .ivu-tag {
        height: 30px;
        line-height: 30px;
      }
    }
  }

  & .ivu-radio-group {
    line-height: 20px;
    text-align: left;
    width: 402px;
  }

  & .ivu-date-picker {
    height: 34px;
    width: 400px;
    & /deep/ .ivu-date-picker-rel {
      // height: 34px;
      & .ivu-input-wrapper {
        // height: 34px;
        & input {
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          border-radius: 0px;
          border-color: #dadada;
        }
      }
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
    width: 400px;
    display: inline-block;
  }
}
.shares-tips {
  color: red;
}
.inner {
  width: 100px;
  height: 100px;
  // border: 1px solid #e6e6e6;
  text-align: center;
  color: #16ade9;
  border-radius: 4px;
  cursor: pointer;
  .uplad-symbol {
    margin-top: 30px;
  }
  .main-text {
    font-size: 12px;
    line-height: 24px;
  }
}
.inner.img-box {
  position: relative;
  overflow: hidden;
  // display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  // width: 200px;
  // height: 124px;
  img {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  // .deletBtn {
  //   position: absolute;
  //   bottom: 10px;
  //   left: 22px;
  //   display: none;
  // }
  .show-pdf {
    display: inline-block;
    color: #313233;
    font-size: 14px;
    // margin-top: 24px;
  }
}
// .inner.img-box:hover .deletBtn {
//   display: block;
// }
.upload-tip {
  font-size: 12px;
  color: #cccccc;
  vertical-align: bottom;
  a {
    color: #16ade9;
  }
}
& .ivu-upload {
  width: 104px;
  display: inline-block;
  & /deep/ .ivu-upload-drag {
    height: 104px;
    & .inner {
      margin-top: 26px;
      & .uplad-symbol {
        width: 24px;
        height: auto;
      }
      & .main-text {
        color: #16ade9;
        font-size: 12px;
      }
    }
  }

  & /deep/ .ivu-upload-list {
    text-align: left;
    & .ivu-upload-list-file {
      background: #f5f5f5;
      & span {
        color: #9a9ca1;
        font-size: 12px;
      }
      & .ivu-upload-list-remove {
        opacity: 1;
        color: #444;
      }
    }
    // & .ivu-upload-list-file:hover {
    //   background: #f5f5f5;
    // }

    & .ivu-progress-success .ivu-progress-bg {
      background: #16ade9;
    }
  }
}
.container {
  .stepAE {
    width: 100% !important;
    padding: 24px;
    /deep/ .ivu-form {
      .ivu-form-item-label {
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        @media (min-width: 1920px) {
          width: 300px !important;
        }
      }
    }
    /deep/ .inputHFlex {
      display: flex;
      flex-wrap: wrap;
      & > .ivu-form-item {
        width: 100%;
        display: inline-block;
      }
      .redTip {
        width: 147px;
        min-width: auto;
        padding-right: 13px;
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        @media (min-width: 1920px) {
          width: 300px;
        }
      }
      .shopNatureClass {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        & > .ivu-form-item {
          width: 100%;
          display: inline-block;
        }
      }
      /deep/ .fileClass {
        padding-left: 40px;
        width: 100%;
        .ivu-form-item-label {
          text-align: left;
          width: 200px !important;
        }
        .ivu-form-item-content {
          margin-left: 0px !important;
        }
        .expand {
          margin: 20px 0;
          font-size: 16px;
          font-family: "Noto Sans S Chinese";
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          min-width: 306px;
          text-align: left;
          color: #666666;
          font-weight: bold;
          margin-left: -20px;
        }
      }
    }
    .title {
      width: 100%;
      font-size: 14px;
      margin-bottom: 28px;
      font-weight: 700;
      color: #333;
      height: 40px;
      background: rgba(22, 173, 233, 0.2);
      line-height: 40px;
      padding-left: 20px;
    }
    /deep/ .ivu-upload {
      width: 200px;
      height: 124px;
      background: #f4f5f6;
      border-radius: 2px;
      position: relative;
      margin-right: 10px;
      cursor: pointer;
      .inner {
        width: 100%;
        height: 100%;
        background: #f4f5f6;
        margin: auto;
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
          width: 50px;
          height: auto;
          margin-top: 0px;
        }
      }
    }
    .out-img-box {
      .img-box {
        width: 200px;
        height: 124px;
        overflow: hidden;
        border: 1px dashed #dcdee2;
        position: relative;
        text-align: center;
        z-index: 11;
        background: #fff;
        button {
          width: 0px;
          padding: 0px;
          border: none;
          position: absolute;
          top: -13px;
          height: 0px;
          z-index: 1;
          img.closeImg {
            position: absolute;
            width: 26px;
            height: 26px;
            top: 16px;
            right: -194px;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
        .deletBtn {
          left: auto;
          display: none;
        }
      }
      .img-box:hover .deletBtn {
        display: block;
      }
    }
    .upload-file-box {
      .upload-tip {
        display: block;
        width: 200px;
        margin-left: 183px;
        img {
          width: 16px;
          height: 16px;
          float: left;
          margin-top: 7px;
        }
      }
    }
  }
}
.reason /deep/ textarea.ivu-input,
.addressEn /deep/ textarea.ivu-input {
  margin-left: 0 !important;
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
.container {
  .stepAE {
    padding: 24px 0px;
    /deep/ .ivu-form {
      .ivu-form-item-label {
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        @media (min-width: 1920px) {
          width: 127px !important;
        }
      }
    }
    /deep/ .inputHFlex {
      display: flex;
      flex-wrap: wrap;
      & > .ivu-form-item {
        width: 100%;
        display: inline-block;
      }
      .redTip {
        width: 147px;
        min-width: auto;
        padding-right: 13px;
        color: #666666;
        font-size: 14px;
        font-weight: 500;
        @media (min-width: 1920px) {
          width: 300px;
        }
      }
      .shopNatureClass {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        & > .ivu-form-item {
          width: 100%;
          display: inline-block;
        }
      }
    }
    .title {
      width: 100%;
      font-size: 14px;
      margin-bottom: 28px;
      font-weight: 700;
      color: #333;
      height: 40px;
      background: rgba(22, 173, 233, 0.2);
      line-height: 40px;
      padding-left: 20px;
    }
    /deep/ .ivu-form-item-content {
      // margin-left: 20px !important;
    }
    /deep/ .ivu-upload {
      width: 200px;
      height: 124px;
      background: #f4f5f6;
      border-radius: 2px;
      position: relative;
      margin-right: 10px;
      cursor: pointer;
      .inner {
        width: 100%;
        height: 100%;
        background: #f4f5f6;
        margin: auto;
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
          width: 50px;
          height: auto;
          margin-top: 0px;
        }
      }
      .img-box {
      }
    }
    .ischange {
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
      width: auto;
      .img-box {
        width: 200px;
        height: 124px;
        overflow: hidden;
        border: 1px dashed #dcdee2;
        position: relative;
        text-align: center;
        z-index: 11;
        background: #fff;
        button {
          width: 0px;
          padding: 0px;
          border: none;
          position: absolute;
          top: -13px;
          height: 0px;
          z-index: 1;
          img.closeImg {
            position: absolute;
            width: 26px;
            height: 26px;
            top: 16px;
            right: -194px;
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
        .deletBtn {
          left: auto;
          display: none;
        }
      }
      .img-box:hover .deletBtn {
        display: block;
      }
    }
    .upload-file-box {
      .upload-tip {
        display: block;
        width: 200px;
        margin-left: 183px;
        img {
          width: 16px;
          height: 16px;
          float: left;
          margin-top: 7px;
        }
      }
    }
  }
}
/deep/ .ivu-tooltip {
  margin-right: 8px;
  margin-left: -13px;
}
/deep/ .ivu-tooltip-inner {
  max-width: 350px;
  white-space: inherit;
}
/deep/ .legalPersonSignatureBox.ivu-form-item {
  width: 100% !important;
  .ivu-form-item-content {
    margin-left: 0px !important;
    width: 100%;
  }
  .ivu-form-item-error-tip {
    left: 8% !important;
  }
}
.signature {
  background: #f2f2f2;
  width: 368px;
  height: 144px;
  display: inline-block;
  margin-left: 8px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  img.refresh {
    width: 30px;
    height: 30px;
    margin: 10px;
    position: absolute;
    right: 0px;
    cursor: pointer;
  }
  button {
    position: absolute;
    top: 0px;
    left: 132px;
    right: 0px;
    bottom: 0px;
    margin: auto;
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
    width: 144px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #626466;
  }
}
</style>

