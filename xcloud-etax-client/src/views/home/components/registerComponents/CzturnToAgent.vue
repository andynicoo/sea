<template>
  <div class="SAcontent">

    <div class="container">
      <Form :model="formLeft"
            label-position="top"
            class="formstyle"
            :rules="ruleForm"
            ref="formLeft">

        <div class="big-row">
          <div class="subTitle">基本信息</div>
          <div class="form">
            <div class="stepH">
              <div>
                <FormItem class="requiredItem"
                          prop="vatTaxNumber">
                  <p class="top-lable"><span>*</span>VAT税号</p>
                  <Input placeholder="请输入捷克报税税号"
                        v-model="formLeft.vatTaxNumber"
                        :maxlength="vatNumberSuffixDigitLength"
                        :disabled="ischange">
                  </Input>
                  <p style="color:#F59A23;font-size:12px;">注：请输入11位数税号（CZ+9位数）</p>
                </FormItem>
                <FormItem class="flex-direction requiredItem"
                          prop="vatTaxNumberFile">
                  <p class="top-lable"><span>*</span>税号文件</p>
                  <Upload :before-upload="beforeUploadHandler"
                          
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'vatTaxNumberFile')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'vatTaxNumberFile')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png','pdf','zip']"
                          :max-size="102400"
                          :on-exceeded-size="handleMaxSize"
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
                      v-if="formLeft.vatTaxNumberFile">
                    <div class="inner img-box">
                      <a :href="formLeft.vatTaxNumberFile"
                        target="_blank"
                        class="show-pdf">
                        税号文件
                      </a>
                      <Button class="deletBtn">
                        <img @click="removeHandler(1,1,'vatTaxNumberFile')"
                            class="closeImg"
                            v-if="!ischange"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                  <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</br>如有多个，请上传压缩包ZIP格式</p>
                </FormItem>
              </div>
              <div>
                <FormItem class="flex-direction requiredItem"
                          prop="taxEffectiveDate"
                          style="width:300px;">
                          <p class="top-lable"><span>*</span>税号生效日期</p>
                  <DatePicker type="date"
                              :options="optionsDate"
                              placeholder="税号生效日期"
                              v-model="formLeft.taxEffectiveDate"
                              class="tax-date"
                              :disabled="ischange"></DatePicker>
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：若不清楚，可咨询前代理</p>
                </FormItem>
                <FormItem class="flex-direction requiredItem"
                          prop="lastDeclareReceipt">
                  <p class="top-lable"><span>*</span>申报回执：<b style="font-size: 14px;">（请上传近半年所有申报回执）</b></p>
                  <Upload :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
                          
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'lastDeclareReceipt')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'lastDeclareReceipt')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png','pdf','zip']"
                          :max-size="102400"
                          :on-exceeded-size="handleMaxSize"
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
                  <div class="out-img-box" v-if="formLeft.lastDeclareReceipt">
                    <div class="inner img-box">
                      <a :href="formLeft.lastDeclareReceipt"
                        target="_blank"
                        class="show-pdf">
                        申报回执
                      </a>
                      <Button class="deletBtn">
                        <img @click="removeHandler(1,1,'lastDeclareReceipt')"
                            class="closeImg"
                            v-if="!ischange"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                  <p class="upload-tip" style="line-height:20px" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</br>如有多个请上传压缩包ZIP格式</p>
                </FormItem>
              </div>
              <div>
              <FormItem prop="upBeginTime">
                <p class="top-lable"><span>*</span>上一次申报区间</p>
                <div class="clearfix flex">
                  <div class="fl">
                    <FormItem>
                      <DatePicker type="month"
                                  placeholder="开始时间"
                                  style="width: 124px"
                                  :options="options"
                                  v-model="formLeft.upBeginTime"
                                  @on-change="changeVatDate($event,'upBeginTime')"
                                  format="yyyy-MM"
                                  :disabled="ischange"></DatePicker>
                    </FormItem>
                  </div>
                  <span style="text-align: center"
                        class="fl">—</span>
                  <div class="fl">
                    <FormItem prop="upEndTime">
                      <DatePicker type="month"
                                  placeholder="结束时间"
                                  style="width: 124px"
                                  :options="options"
                                  v-model="formLeft.upEndTime"
                                  @on-change="changeVatDate($event,'upEndTime')"
                                  format="yyyy-MM"
                                  :disabled="ischange"></DatePicker>
                    </FormItem>
                  </div>
                </div>
                <p style="color:#F59A23;font-size:12px;margin-top: 10px;">注：请选择上一次在前税代的申报月份</p>
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
                  <p style="color:#F59A23;font-size:12px;">注：请选择在前税代的申报周期（月报/季报）</p>
                </FormItem>
                </div>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">公司信息</div>
          <div class="form">
            <FormItem class="requiredItem"
                      prop="companyType">
              <span class="top-lable" style="margin-right:10px"><span>*</span>公司类型</span>
              <RadioGroup v-model="formLeft.companyType">
                <Radio label="1">大陆公司</Radio>
                <Radio label="2">香港公司</Radio>
                <Radio label="3">境外公司</Radio>
              </RadioGroup>
            </FormItem>
            <div class="stepH" v-if="formLeft.companyType==='1'">
              <FormItem class="flex-direction requiredItem"
                        prop="companyBusinessLicense">
                <p class="top-lable"><span>*</span>营业执照扫描件</p>
                <Upload :before-upload="beforeUploadHandler"
                        
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/42ce835f4fbe4fe8ba43969b0e7a5781.jpg"
                    target="_blank" style="color:#16ADE9">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
              </FormItem>
            </div>
            <div class="stepH" v-if="formLeft.companyType==='2'">
              <FormItem class="flex-direction requiredItem"
                        prop="companyBusinessRegistrationBr">
                <p class="top-lable"><span>*</span>商业登记证BR</p>
                <Upload :before-upload="beforeUploadHandler"
                        
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessRegistrationBr')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
                        :class="{'ischange': ischange}"
                        :disabled="ischange">
                  <div class="inner"
                      @click="beforType('companyBusinessRegistrationBr')">
                    <span class="uplad-word">
                      <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                      点击上传
                    </span>
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_dOACF2FAALt-Hjd_Jk072.png"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
              
              </FormItem>
              <FormItem class="flex-direction requiredItem"
                        prop="companyRegistrationCi">
                <p class="top-lable"><span>*</span>公司注册证明书CI</p>
                <Upload :before-upload="beforeUploadHandler"
                        
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyRegistrationCi')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
                        :class="{'ischange': ischange}"
                        :disabled="ischange">
                  <div class="inner"
                      @click="beforType('companyRegistrationCi')">
                    <span class="uplad-word">
                      <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                      点击上传
                    </span>
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_kyADlfrAAJWob8GDgQ847.png"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
                
              </FormItem>
              <FormItem class="flex-direction requiredItem"
                        prop="companyCorporateFoundingNnc1">
                <p class="top-lable"><span>*</span>法团成立表格NNC1</p>
                <Upload :before-upload="beforeUploadHandler"
                        
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyCorporateFoundingNnc1')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
                        :class="{'ischange': ischange}"
                        :disabled="ischange">
                  <div class="inner"
                      @click="beforType('companyCorporateFoundingNnc1')">
                    <span class="uplad-word">
                      <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                      点击上传
                    </span>
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV61AOOAaaUDAAMDXiZXCZo609.png"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
                
              </FormItem>
            </div>
            <div class="stepH" v-if="formLeft.companyType==='3'">
              <FormItem class="flex-direction requiredItem"
                        prop="companyBusinessLicenseCopy">
                <p class="top-lable"><span>*</span>商业登记证/海外证书</p>
                <Upload :before-upload="beforeUploadHandler"
                        
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicenseCopy')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicenseCopy')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
                        :class="{'ischange': ischange}"
                        :disabled="ischange">
                  <div class="inner"
                      @click="beforType('companyBusinessLicenseCopy')">
                    <span class="uplad-word">
                      <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                      点击上传
                    </span>
                  </div>
                </Upload>
                <div class="out-img-box"
                    v-if="formLeft.companyBusinessLicenseCopy">
                  <div class="inner img-box">
                    <a :href="formLeft.companyBusinessLicenseCopy"
                      target="_blank"
                      class="show-pdf">
                      商业登记证BR
                    </a>
                    <Button class="deletBtn">
                      <img @click="removeHandler(1,1,'companyBusinessLicenseCopy')"
                          class="closeImg"
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                 <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="https://fdfs.itaxs.com/group1/M00/00/26/rBLKNV60_dOACF2FAALt-Hjd_Jk072.png"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
               
              </FormItem>
            </div>
            <div class="stepH">
              <FormItem class="requiredItem requiredItem"
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
                        prop="companyCreditCode">
                <p class="top-lable"><span>*</span>社会统一信用代码</p>
                <Input v-model="formLeft.companyCreditCode"
                      placeholder="工商统一信用代码"
                      :disabled="ischange"></Input>
              </FormItem>
              <div style="width:294px"></div>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">法人信息</div>
          <div class="form">
            <FormItem prop="certificateType">
              <span class="top-lable" style="margin-right:10px"><span>*</span>任选1种上传（身份证/护照）</span>
              <RadioGroup v-model="formLeft.certificateType">
                <Radio label="1">身份证</Radio>
                <Radio label="2">护照</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if="formLeft.certificateType === '1'"
                    style="margin-bottom:15px;"
                    class="flex-direction requiredItem">
              <div class="stepH">
                <div style="margin-right:316px">
                  <p class="top-lable"><span>*</span>身份证正面扫描件</p>
                  <Upload :before-upload="beforeUploadHandler"
                          
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardFront')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardFront')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png','pdf']"
                          :max-size="102400"
                          :on-exceeded-size="handleMaxSize"
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
                            v-if="!ischange"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </div>
                <div>
                  <p class="top-lable"><span>*</span>身份证反面扫描件</p>
                  <Upload :before-upload="beforeUploadHandler"
                          
                          :on-format-error="formatErrorHandler"
                          :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardReverse')}"
                          :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardReverse')}"
                          :action="ImgUrl"
                          :data="{prefix:''}"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png','pdf']"
                          :max-size="102400"
                          :on-exceeded-size="handleMaxSize"
                          :class="{'ischange': ischange}"
                          :disabled="ischange">
                    <div class="inner"
                        @click="beforType('companyLegalPersonCardReverse')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                        点击上传
                      </span>
                    </div>
                  </Upload>
                  <div class="out-img-box"
                      v-if="formLeft.companyLegalPersonCardReverse">
                    <div class="inner img-box">
                      <a :href="formLeft.companyLegalPersonCardReverse"
                        target="_blank"
                        class="show-pdf">
                        身份证（国徽面）
                      </a>
                      <Button class="deletBtn">
                        <img @click="removeHandler(1,1,'companyLegalPersonCardReverse')"
                            class="closeImg"
                            v-if="!ischange"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt="">
                      </Button>
                    </div>
                  </div>
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </div>
              </div>
              
            </FormItem>
            <FormItem v-if="formLeft.certificateType === '2'"
                      style="margin-bottom:15px;"
                      class="flex-direction requiredItem"
                      prop="companyLegalPersonCardPassport">
              <p class="top-lable"><span>*</span>法人护照扫描件</p>
              <Upload :before-upload="beforeUploadHandler"
                      
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyLegalPersonCardPassport')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyLegalPersonCardPassport')}"
                      :action="ImgUrl"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :class="{'ischange': ischange}"
                      :disabled="ischange">
                <div class="inner"
                    @click="beforType('companyLegalPersonCardPassport')">
                  <span class="uplad-word">
                    <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                    点击上传
                  </span>
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
                        v-if="!ischange"
                        src="@/assets/images/common/activeCloseImg.png"
                        alt="">
                  </Button>
                </div>
              </div>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
              <span class="explame" v-if="!ischange">
                <a href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/e2bb6685726645a6b0652288364fbc4f.jpg"
                  target="_blank" style="color:#16ADE9">
                  <img src="@/assets/images/common/serch.png">
                  查看示例
                </a>
              </span>
            </FormItem>
            <div class="stepH" style="margin-top:33px">
              <div>
                <FormItem v-if="formLeft.certificateType=='1'"
                          class="requiredItem"
                          prop="companyLegalPersonCard">
                  <p class="top-lable"><span>*</span>法人身份证号码</p>
                  <Input v-model="formLeft.companyLegalPersonCard"
                        placeholder="请输入法人身份证号码"
                        :disabled="ischange"></Input>
                </FormItem>
                <FormItem v-if="formLeft.certificateType=='2'"
                          class="requiredItem"
                          prop="legalPersonCardPassportNumber">
                  <p class="top-lable"><span>*</span>法人护照号码</p>
                  <Input v-model="formLeft.legalPersonCardPassportNumber"
                        placeholder="请填写护照号码"
                        :disabled="ischange"></Input>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyLegalPersonBirthday">
                  <p class="top-lable"><span>*</span>法人出生日期</p>
                  <DatePicker type="date"
                              placeholder="请选择法人出生日期"
                              v-model="formLeft.companyLegalPersonBirthday"
                              format="yyyy-MM-dd"
                              class="tax-date"
                              :options="optionsDate"
                              :disabled="ischange"></DatePicker>
                </FormItem>
              </div>
              <div>
                <FormItem prop="companyLegalPersonZh">
                  <p class="top-lable"><span>*</span>法人中文姓名</p>
                  <Input v-model="formLeft.companyLegalPersonZh"
                        placeholder="请输入法人中文姓名"
                        :disabled="ischange"></Input>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyLegalPersonEn">
                  <p class="top-lable"><span>*</span>法人英文名</p>
                  <Input v-model="formLeft.companyLegalPersonEn"
                        placeholder="请填写英文名字"
                        :disabled="ischange"></Input>
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请用拼音输入姓名</p>
                </FormItem>
              </div>
              <div>
                <FormItem class="requiredItem"
                          prop="companyLegalPersonCardAddressZh">
                  <p class="top-lable"><span>*</span>法人身份证中文地址</p>
                  <Input v-model="formLeft.companyLegalPersonCardAddressZh"
                        type="textarea"
                        placeholder="请输入法人身份证中文地址"
                        :disabled="ischange"></Input>
                </FormItem>
                <FormItem class="requiredItem"
                          prop="companyLegalPersonCardAddress">
                  <p class="top-lable"><span>*</span>法人身份证英文地址</p>
                  <Input v-model="formLeft.companyLegalPersonCardAddress"
                        type="textarea"
                        placeholder="请输入法人身份证英文地址"
                        :disabled="ischange"></Input>
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请用拼音输入身份证详细地址</p>
                </FormItem>
              </div>
            </div>
          </div>
        </div>

        <div class="big-row">
          <div class="subTitle">店铺信息</div>
          <div class="form">
            <FormItem prop="shopSalePlatformName"
                      class="requiredItem requiredItem">
              <span class="top-lable" style="margin-right:10px"><span>*</span>销售平台</span>
              <RadioGroup v-model="formLeft.shopSalePlatformName">
                <Radio label="亚马逊"
                       :disabled="ischange">亚马逊</Radio>
                <Radio label="eBay"
                       :disabled="ischange">eBay</Radio>
                <Radio label="其它"
                       :disabled="ischange">其它</Radio>
              </RadioGroup>
            </FormItem>
            <div class="stepH">
              <FormItem prop="shopHref">
                <p class="top-lable"><span>*</span>店铺后台链接</p>
                <Input v-model="formLeft.shopHref"
                      placeholder="请输入店铺链接"
                      :disabled="ischange"></Input>
              </FormItem>
              <FormItem class="requiredItem"
                        prop="companyNameEn">
                <p class="top-lable"><span>*</span>公司英文名称</p>
                <Input v-model="formLeft.companyNameEn"
                      placeholder="请直接复制后台英文名称"
                      :disabled="ischange"></Input>
              </FormItem>
              <FormItem prop="companyPostCode">
                <p class="top-lable"><span>*</span>公司邮编号码</p>
                <Input v-model="formLeft.companyPostCode"
                      placeholder="请输入店铺后台的邮编号码"
                      :disabled="ischange"></Input>
              </FormItem>
            </div>
            <div class="stepH">
              <FormItem class="requiredItem"
                        prop="companyAddressEn">
                <p class="top-lable"><span>*</span>公司英文地址</p>
                <div style="display:inline-block;">
                  <Input type="text"
                        placeholder="国家 如：China"
                        v-model="formLeft.companyAddressEnCountry"
                        :disabled="ischange"
                        style="width:118px;margin-right:8px;margin-left:0px;" />
                  <Input type="text"
                        placeholder="城市加省份 如: shenzhenshi guangdong"
                        v-model="formLeft.companyAddressEnCity"
                        :disabled="ischange"
                        style="width:168px" />
                </div>
                <Input v-model="formLeft.companyAddressEn"
                      type="textarea"
                      placeholder="请输入详细地址"
                      :disabled="ischange"
                      :rows="4"
                      style="margin-top:10px;display:block;" />
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;width:294px">注：请根据您的店铺后台英文地址进行填写（需保持一致）</p>
              </FormItem>
              <FormItem style="margin-bottom:15px;"
                        class="flex-direction"
                        :prop="formLeft.shopSalePlatformName != '亚马逊' ? 'shopConsoleScreenshot' :''">
                <p class="top-lable"><span v-if="formLeft.shopSalePlatformName != '亚马逊'">*</span>店铺后台公司信息页面截图</p>
                <Upload :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopConsoleScreenshot')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopConsoleScreenshot')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :on-exceeded-size="handleMaxSize"
                        :class="{'ischange': ischange}"
                        :disabled="ischange">
                  <div class="inner"
                      @click="beforType('shopConsoleScreenshot')">
                    <span class="uplad-word">
                      <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
                      点击上传
                    </span>
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                <span class="explame" v-if="!ischange">
                  <a href="http://file.itaxs.com/dev/20210705/ab68e2f7c291475b9694484ae4e9522a.pdf"
                    target="_blank" style="color:#16ADE9">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </span>
              </FormItem>
              <div style="width:294px"></div>
            </div>
          </div>
        </div>
        <div class="big-row">
          <div class="subTitle">银行信息</div>
          <div class="form">
            <div class="stepH">
              <FormItem prop="bankAccountName"
                        style="width:300px;"
                        class="requiredItem">
                <span class="top-lable" style="margin-right:10px"><span>*</span>账号名称</span>
                <Input v-model="formLeft.bankAccountName"
                      placeholder="请输入开户公司名称"
                      :disabled="ischange"></Input>
              </FormItem>
              <FormItem prop="bankName"
                        style="width:300px;"
                        class="requiredItem">
                <span class="top-lable" style="margin-right:10px"><span>*</span>银行英文名称</span>
                <Input v-model="formLeft.bankName"
                      placeholder="请输入开户银行名称"
                      :disabled="ischange"></Input>
              </FormItem>
              <FormItem prop="bankAccount"
                        style="width:300px;"
                        class="requiredItem">
                <span class="top-lable" style="margin-right:10px"><span>*</span>IBAN/银行账户</span>
                <Input v-model="formLeft.bankAccount"
                      placeholder="请输入开户银行账户号码"
                      :disabled="ischange"></Input>
              </FormItem>
            </div>
            <div class="stepH">
              <FormItem prop="swiftBic">
                <p class="top-lable"><span>*</span>Swift / BIC</p>
                <Input v-model="formLeft.swiftBic"
                      placeholder="请输入Swift / BIC"
                      :disabled="ischange"></Input>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">备注：银行编码，通常为一串大写字母</p>
              </FormItem>
              <FormItem class="requiredItem"
                        style="width:300px;"
                        prop="bankAddressEn">
                <p class="top-lable"><span>*</span>银行英文地址</p>
                <div style="display:inline-block;">
                <Input type="text"
                      placeholder="国家 如：China"
                      v-model="formLeft.bankCountryEn"
                      :disabled="ischange"
                      style="width:114px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                      placeholder="城市加省份 如: shenzhenshi guangdong"
                      v-model="formLeft.bankCityEn"
                      :disabled="ischange"
                      style="width:143px" />
              </div>
              <Input v-model="formLeft.bankAddressEn"
                    type="textarea"
                    placeholder=" 请请输入银行详细英文地址"
                    :disabled="ischange"
                    :rows="4"
                    style="margin-top:10px;display:block;" />
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：银行的地址（请使用英文输入）</p>
              </FormItem>
              <FormItem class="requiredItem"
                        style="width:300px;"
                        prop="bankAccountAddressEn">
                <p class="top-lable"><span>*</span>开户公司英文地址</p>
                <Input v-model="formLeft.bankAccountAddressEn"
                      type="textarea"
                      :rows="4"
                      style="margin-top:10px;display:block;"
                      placeholder="请输入开户公司英文地址"
                      :disabled="ischange"></Input>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：开户公司英文地址（请使用英文输入）</p>
              </FormItem>
            </div>
            <div class="stepH">
              <FormItem style="margin-bottom:15px;"
                        class="flex-direction"
                        prop="bankAccountCertify">
                        <p class="top-lable"><span>*</span>银行账户证明</p>
                <Upload :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'bankAccountCertify')}"
                        :on-remove="(file,fileList)=>{removeHandler (file,fileList,'bankAccountCertify')}"
                        :action="ImgUrl"
                        :data="{prefix:''}"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png','pdf']"
                        :max-size="102400"
                        :class="{'ischange': ischange}"
                        :on-exceeded-size="handleMaxSize"
                        :disabled="ischange">
                  <div class="inner" @click="beforType('bankAccountCertify')">
                    <Icon type="ios-cloud-upload-outline" style="font-size:18px" />
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
                          v-if="!ischange"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt="">
                    </Button>
                  </div>
                </div>
                <div class="explame">
                  <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：与以上填写的银行信息保持一致，需要英文证明（可以证明银行账号正确的证明）</p>
                  <a href="https://pre-fdfs.itaxs.com/group1/M00/00/DA/rBLKLV_gXR-AX1-gAAINSeOjGYw489.png"
                    target="_blank">
                    <img src="@/assets/images/common/serch.png">
                    查看示例
                  </a>
                </div>
              </FormItem>
              <div style="width:294px"></div>
              <div style="width:294px"></div>
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
import { getCompanyInformation, getCompanyLegalPersonSignUrl,getAllServiceCompanies, getCompanyLegalPersonSign } from "@/api/registerInfo/registerInfo";
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
        declarePeriod: "0",
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
        companyBusinessLicenseCopy: "",
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
        recordOfPenaltyCharges: '',
        companyType: '1',
        companyLegalPersonCardReverse: '',
        certificateType: '1',
        bankAccountCountryEn: '',
        companyPostCode: '',
        shopSalePlatformName: '亚马逊',

        bankAccountCertify:'',
      },
      ruleForm: {
        shopSaleBefore: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        future30Sale: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
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
          { required: true, trigger: "blur", message: "请填写法人护照号" }
        ],
        swiftBic: [
          { required: true, trigger: "blur", message: "请填写Swift / BIC" }
        ],
        bankAccount: [
          { required: true, trigger: "blur", message: "请填写IBAN/银行账户" }
        ],
        bankSubBranchName: [
          { required: true, trigger: "blur", message: "请填写支行名称" }
        ],
        bankName: [
          { required: true, trigger: "blur", message: "请填写银行名称" }
        ],
        bankAccountName: [
          { required: true, trigger: "blur", message: "请填写账户名称" }
        ],
        postCode: [
          { required: true, trigger: "blur", message: "请填写邮政编码" }
        ],
        transformProxyReason: [
          { required: true, trigger: "blur", message: "请填写转代理原因" }
        ],
        profession: [
          { required: true, trigger: "blur", message: "请填写职业" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "blur", message: "请填写电商平台账号完整名称" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写常用联系邮箱" }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "blur", message: "请填写常用联系手机号" }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "blur", message: "请填写西班牙本地银行信息" }
        ],
        companyRegisteredCityZh: [
          { required: true, trigger: "blur", message: "请填公司营业执照注册城市" }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "blur", message: "请填写本地银行账户信息" }
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
        companyLegalPersonZh: [
          { required: true, trigger: "blur", message: "请填写法人中文名" }
        ],
        companyLegalPersonEn: [
          { required: true, trigger: "blur", message: "请填写法人英文名" }
        ],
        companyNameEn: [
          { required: true, trigger: "blur", message: "请填写公司英文名" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "blur", message: "请填写法人出生地" }
        ],
        companyLegalPersonSign: [
          { required: true, trigger: "blur", message: "请填写上传法人签名" }
        ],
        companyLegalPersonCardAddress: [
          { required: true, trigger: "blur", message: "请填写法人身份证英文地址" }
        ],
        companyLegalPersonCard: [
          { required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }
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
          { required: true, trigger: "blur", message: "请填写店铺链接" }
        ],
        shopSalePlatformName: [
          { required: true, trigger: "change", message: "请选择店铺所在电商平台" }
        ],
        shippingProcess: [
          { required: true, trigger: "blur", message: "请填写货物进口及配送流程" }
        ],
        companyAddressEnCountry: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEn: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyCreditCode: [
          { required: true, trigger: "blur", message: "请填写统一社会信用代码" }
        ],
        legalPersonBirthplaceProvinceZh: [
          { required: true, trigger: "blur", message: "请填写法人的出生省份中文" }
        ],
        legalPersonBirthplaceProvinceEn: [
          { required: true, trigger: "blur", message: "请填写法人的出生省份英文" }
        ],
        legalPersonBirthplaceCityZh: [
          { required: true, trigger: "blur", message: "请填写法人的出生城市中文" }
        ],
        legalPersonBirthplaceCityEn: [
          { required: true, trigger: "blur", message: "请填写法人的出生城市英文" }
        ],
        companyLegalPersonCardAddressZh: [
          { required: true, trigger: "blur", message: "请填写法人身份证中文地址" }
        ],
        companyRegisteredCapital: [
          { required: true, trigger: "blur", message: "请输入公司注册资本（万元）", type: "number" }
        ],
        companyRegisterData: [
          {
            required: true,
            trigger: "change",
            message: "请选择公司成立日期",
            type: "date"
          }
        ],
        shopPostCode: [
          { required: true, trigger: "change", message: "请填写邮政编码" }
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
        companyPostCode: [
          { required: true, trigger: "blur", message: "请填写公司邮政编号" }
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
        companyBusinessLicenseCopy: [
          {
            required: true,
            trigger: "change",
            message: "请上传商业登记证/海外证书"
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
        salesEvidenceFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传销售证据"
          }
        ],
      },
      lenovoSearchList: [], //联想列表
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
          value: 'other（其它）'
        },
      ],
      birthplaceList: [],
      fileType: {
        companyBusinessLicense: "",
        companyBusinessLicenseCopy: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
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
        recordOfPenaltyCharges: '',
        companyLegalPersonCardReverse: ''
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
      let servicesId = this.servicesId
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
            // if (data.quarterPeriod === 0)
            //   this.declare.push({ type: "季报", status: "1" });
            // if (data.yearPeriod === 0)
            //   this.declare.push({ type: "年报", status: "2" });
          }
        })
        .finally(() => { });
    },
    getLegalpersonCountry() {
      legalpersonCountry().then(res => {
        if (res.code === 0) {
          this.birthplaceList = res.data
        }
      })
    },
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
      // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
      if(this.formLeft.companyType == 3){
        data.companyBusinessLicense = this.formLeft.companyBusinessLicenseCopy;
      }
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
      // this.$refs['formLeft'].validate((valid) => {
      //   if (valid) {

      //   } else {
      //     this.$Message.error('请完善资料后进行提交')
      //   }
      // })

    },
    submitData() {
      let self = this
      this.$refs['formLeft'].validate((valid) => {
        if (valid) {
          let data = { ...this.formLeft }
          this.translateDate(data)
          //转换税号
          data.vatTaxNumber = String(this.formLeft.vatTaxNumber);
          // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
          if(self.formLeft.companyType == 3){
            data.companyBusinessLicense = self.formLeft.companyBusinessLicenseCopy;
          }
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
            .finally(() => {})
        } else {
          this.$Message.error('请完善资料后进行提交')
        }
      })

    },
    //转换日期
    translateDate(data) {
      data.legalPersonCardPassportPastTime = this.formatDate(this.formLeft.legalPersonCardPassportPastTime, 'date')
      data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData, 'date')
      data.thresholdValueTime = this.formatDate(this.formLeft.thresholdValueTime, 'date')
      data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
      data.upEndTime = this.formatDate(this.formLeft.upEndTime, 'month')
      data.upBeginTime = this.formatDate(this.formLeft.upBeginTime, 'month')
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, 'date')
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
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '上传文件不超过100M'
      });
    },
  },
  mounted() {
    this.getInfo();
    this.getLegalpersonCountry()
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
          this.formLeft.companyType = String(val.companyType)
          this.formLeft.certificateType = String(val.certificateType)
          this.formLeft.isOtherGulfStateDutyOrServices = String(val.isOtherGulfStateDutyOrServices)
          this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber)
          if(val.companyType == 3){
            this.$set(this.formLeft,'companyBusinessLicenseCopy',val.companyBusinessLicense)
          }else{
            this.$set(this.formLeft,'companyBusinessLicenseCopy','')
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
// /deep/ .ivu-row {
//   width: 100%;
//   margin-left: 0px;
// }
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
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
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
  padding: 0px;
  background-color: none;
  .content {
    width: 100%;
  }
  .stepAE {
    width: 100% !important;
    padding: 0px;
    /deep/ .ivu-radio-group {
      margin-top: 4px;
    }
    /deep/
      .ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text.ivu-date-picker-editor {
      width: 100%;
    }
    /deep/ .ivu-form {
      .ivu-form-item-label {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        text-align: left;
        // float: none;
      }
      .ivu-form-item-content {
        width: 100%;
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
    /deep/ .ivu-form-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
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
      height: auto;
      cursor: pointer;
      background: none;
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
          margin-bottom: 0px;
        }
        .uplad-word {
          color: #ffffff;
        }
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
      width: 100%;
      .img-box {
        position: relative;
        text-align: center;
        border: none;
        cursor: pointer;
        height: auto;
        width: 100%;
        .show-pdf {
          color: #16ade9;
          font-size: 14px;
        }
        // .deletBtn {
        //   display: inline-block;
        // }
        button {
          // margin-top: 21px;
          // margin-left: 3px;
          width: 0px;
          padding: 0px;
          border: none;
          top: 8px;
          height: 0px;
          z-index: 1;
          margin-left: 3px;
          img.closeImg {
            position: inherit;
            width: 13px;
            height: 13px;
            top: 2px;
          }
        }
      }
      // .img-box:hover .deletBtn {
      //   display: inline-block;
      // }
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
      left: 132px;
      right: 0px;
      bottom: 0px;
      margin: auto;
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
      left: 132px;
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
    width: 144px;
    height: 144px;
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

