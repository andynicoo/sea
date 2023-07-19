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
                      class="requiredItem"
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
                      v-if="formLeft.shopNature === '1'"
                      style="width:300px;"
                      class="requiredItem"
                      prop="companyType">
              <RadioGroup v-model="formLeft.companyType">
                <Radio :disabled="notChange"
                       label="1">大陆公司</Radio>
                <Radio :disabled="notChange"
                       label="2">香港公司</Radio>
                <Radio :disabled="notChange"
                       label="3">海外公司</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="营业执照扫描件"
                      v-if="formLeft.shopNature === '1'&&formLeft.companyType==='1'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessLicense">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
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
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="主体国家对应的营业执照"
                      v-if="formLeft.shopNature === '1' && formLeft.companyType==='3'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessLicense1">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessLicense1')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessLicense1')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyBusinessLicense1')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyBusinessLicense1 !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyBusinessLicense1"
                     target="_blank"
                     class="show-pdf">
                    主体国家对应的营业执照
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyBusinessLicense1')"
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
                      v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyBusinessRegistrationBr">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyBusinessRegistrationBr')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyBusinessRegistrationBr')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
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
                      v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyRegistrationCi">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyRegistrationCi')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyRegistrationCi')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
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
                      v-if="formLeft.shopNature === '1'&&formLeft.companyType==='2'"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyCorporateFoundingNnc1">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCorporateFoundingNnc1')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyCorporateFoundingNnc1')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
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
                      v-if="formLeft.shopNature === '1'"
                      style="width:300px;"
                      class="requiredItem requiredItem"
                      prop="companyNameZh">
              <AutoComplete v-model="formLeft.companyNameZh"
                            :data="lenovoSearchList"
                            @on-select="selectCompany"
                            placeholder="请输入公司中文名称"
                            :disabled="notChange">
              </AutoComplete>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请填写与营业执照一致的公司中文名称</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="社会统一信用代码"
                      v-if="formLeft.shopNature === '1'"
                      style="width:300px;"
                      class="requiredItem"
                      prop="companyCreditCode">
              <Input v-model="formLeft.companyCreditCode"
                     placeholder="请输入社会统一信用代码"
                     :disabled="notChange"></Input>
            <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请填写与营业执照一致的信用代码</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司信用报告"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="companyCreditReport">
              <Upload :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'companyCreditReport')}"
                      :on-remove="(file,fileList)=>{removeHandler (file,fileList,'companyCreditReport')}"
                      :action="ImgUrl"
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      :on-exceeded-size="handleMaxSize"
                      :disabled="notChange">
                <div class="inner"
                     @click="beforType('companyCreditReport')">
                  <img class="uplad-symbol"
                       src="@/assets/images/common/uploadIcon1.png"
                       alt="">
                  <span class="uplad-word">点击上传</span>
                </div>
              </Upload>
              <div class="out-img-box"
                   v-if="formLeft.companyCreditReport !==''">
                <div class="inner img-box">
                  <a :href="formLeft.companyCreditReport"
                     target="_blank"
                     class="show-pdf">
                    公司信用报告
                  </a>
                  <Button class="deletBtn">
                    <img @click="removeHandler(1,1,'companyCreditReport')"
                         class="closeImg"
                         v-if="!notChange"
                         src="@/assets/images/common/activeCloseImg.png"
                         alt="">
                  </Button>
                </div>
              </div>
              <div class="upload-tip">
                <a href="https://fdfs.itaxs.com/group1/M00/00/1F/rBLKNV6n0kKAU23YAASrdiyBiIs540.pdf"
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
              <FormItem label="公司中文地址"
                        style="width:300px;"
                        class="requiredItem"
                        prop="companyAddressZh">
                <Input v-model="formLeft.companyAddressZh"
                      placeholder="请输入公司中文地址"
                      :disabled="notChange"></Input>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请填写与营业执照一致公司地址</p>
              </FormItem>
            </Col>
             <Col :span="8">
              <FormItem label="公司注册登记城市英文"
                        style="width:300px;"
                        class="requiredItem"
                        prop="companyRegisteredCityEn">
                <Input v-model="formLeft.companyRegisteredCityEn"
                      placeholder="请输入公司注册登记城市英文"
                      :disabled="notChange"></Input>
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请输入与营业执照一致的登记城市的英文</p>
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
                      prop="certificateType"
                      style="width:300px;"
                      class="requiredItem">
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
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
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
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
                      style="margin-top:16px;"
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
                      :class="{'notChange': notChange}"
                      :data="{prefix:''}"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png','pdf']"
                      :max-size="102400"
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
                   v-if="formLeft.companyLegalPersonCardPassport !==''">
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
            <Col :span="8">
            <FormItem label="法人身份证中文地址"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCardAddressZh">
              <Input v-model="formLeft.companyLegalPersonCardAddressZh"
                     placeholder="请输入法人身份证中文地址"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="法人中文姓名"
                        class="requiredItem"
                        style="width:300px;"
                        prop="companyLegalPersonZh">
                <Input v-model="formLeft.companyLegalPersonZh"
                      placeholder="请输入法人中文姓名"
                      :disabled="notChange"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人英文姓名"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonEn">
              <Input v-model="formLeft.companyLegalPersonEn"
                     placeholder="请用拼音输入"
                     :disabled="notChange"></Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：英文姓名需要“名在前姓在后”（如张三，San Zhang）</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人身份证号码"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCard">
              <Input v-model="formLeft.companyLegalPersonCard"
                     placeholder="请输入法人身份证号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人出生日期"
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
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="法人出生地"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonBirthplace">
              <Select v-model="formLeft.companyLegalPersonBirthplace"
                      placeholder="请选择法人出生地"
                      :disabled="notChange"
                      filterable
                      >
                <Option v-for="item in birthplaceList"
                        :value="item"
                        :key="item.value">{{ item }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="法人身份证英文地址"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyLegalPersonCardAddress">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="省 如Guangdong"
                       v-model="formLeft.personCardAddressProvinceEn"
                       :disabled="notChange"
                       style="width:130px;margin-right:8px;margin-left:0px;" />
                <Input type="text"
                       placeholder="市 如shenzhen"
                       v-model="formLeft.personCardAddressCityEn"
                       :disabled="notChange"
                       style="width:127px" />
              </div>
              <div style="display:block;">
                <Input v-model="formLeft.companyLegalPersonCardAddress"
                      type="textarea"
                      placeholder="请输入详细地址"
                      :disabled="notChange"
                      :rows="4"
                      style="margin-top:10px;display:block;" />
                <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">注：请用拼音输入身份证详细地址</p>
              </div>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem prop="companyLegalPersonSign">
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
                说明：法人签名主要应用于注册+申报,请使用英文格式签名
                <br/>
                <a style="font-size: 12px;font-weight: 400;"
                   href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                   target="_black">查看示例>></a>
              </p>
            </div>
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
                      class="requiredItem requiredItem">
              <RadioGroup v-model="formLeft.shopSalePlatformName">
                <Radio label="亚马逊"
                       :disabled="notChange">亚马逊</Radio>
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
            <FormItem label="店铺后台链接"
                      class="requiredItem"
                      style="width:300px;"
                      prop="shopHref">
              <Input v-model="formLeft.shopHref"
                     placeholder="请输入店铺后台链接"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司英文名称"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyNameEn">
              <Input v-model="formLeft.companyNameEn"
                     placeholder="请输入公司英文名称"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司邮编号码"
                      class="requiredItem"
                      style="width:300px;"
                      prop="companyPostCode">
              <Input v-model="formLeft.companyPostCode"
                     placeholder="请输入公司邮编号码"
                     :disabled="notChange"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            
            <Col :span="8">
            <FormItem label="税号生效日期:"
                      class="requiredItem"
                      style="width:300px;"
                      prop="shopTaxEffectiveData">
              <Tooltip placement="right"
                       style="position: absolute;top: 6px;left: 114px;">
                <span class="tips-icon">
                  <img src="@/assets/images/common/wenhao.png"
                       alt=""></span>
                <div slot="content">
                  <p>请如实填写应交税日期，税号从此日期开始生效（一个星期内）；</p>
                </div>
              </Tooltip>
              <DatePicker type="date"
                          placeholder="请选择预计第一笔销售产生的时间"
                          v-model="formLeft.shopTaxEffectiveData"
                          class="tax-date"
                          :disabled="notChange"></DatePicker>
              </Input>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="申报周期"
                      style="width:300px;"
                      class="requiredItem"
                      prop="declarePeriod">
              <Select v-model="formLeft.declarePeriod"
                      placeholder="请选择申报周期"
                      :disabled="notChange">
                <Option value="0">月度申报</Option>
                <Option value="1">季度申报</Option>
              </Select>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;"> 注：季度申报需多缴纳1%税金，月度申报/每个月申报一次</p>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="公司英文地址"
                      class="requiredItem"
                      style="width:400px;"
                      prop="companyAddressEn">
              <div style="display:inline-block;">
                <Input type="text"
                       placeholder="国家 如China"
                       v-model="formLeft.companyAddressEnCountry"
                       :disabled="notChange"
                       style="width:100px;margin-left:0px;" />
                <Input type="text"
                       placeholder="省 如Guangdong"
                       v-model="formLeft.companyAddressEnProvince"
                       :disabled="notChange"
                       style="width:130px" />
                <Input type="text"
                       placeholder="市 如Shenzhen"
                       v-model="formLeft.companyAddressEnCity"
                       :disabled="notChange"
                       style="width:120px" />
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
          </Row>
          <Row>
            <Col :span="8">
            <FormItem label="是否使用意大利仓库"
                      class="requiredItem"
                      style="width:300px;"
                      prop="useEntrepot">
              <RadioGroup v-model="formLeft.useEntrepot">
                <Radio label="1"
                       :disabled="notChange">是</Radio>
                <Radio label="2"
                       :disabled="notChange">否</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="是否开通泛欧"
                      class="requiredItem"
                      style="width:300px;"
                      prop="dredgeEuronext">
              <RadioGroup v-model="formLeft.dredgeEuronext">
                <Radio label="2"
                       :disabled="notChange">是</Radio>
                <Radio label="1"
                       :disabled="notChange">否</Radio>
              </RadioGroup>
            </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="货物进口及配送流程"
                      class="requiredItem"
                      style="width:300px;"
                      prop="shippingProcess">
              <Input v-model="formLeft.shippingProcess"
                     placeholder="如货物从哪国配送到哪国？是否经过其它欧盟国家"
                     :disabled="notChange">
              </Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <FormItem label="是否有欧盟EORI号"
                        class="requiredItem"
                        style="width:300px;"
                        prop="isThereEoriNumber">
                <RadioGroup v-model="formLeft.isThereEoriNumber">
                  <Radio label="1"
                        :disabled="notChange">有EORI号</Radio>
                  <Radio label="2"
                        :disabled="notChange">无EORI号</Radio>
                </RadioGroup>

              </FormItem>
              <!-- 选择有，则显示输入框，选择无则显示是否申请欧盟eori -->
              <FormItem 
                        v-if="formLeft.isThereEoriNumber == 1"
                        style="width:300px;"
                        label="欧盟EORI号"
                       >
                <Input v-model="formLeft.eoriNumber"  placeholder="请输入欧盟EORI号" :disabled="notChange">
                </Input>
              </FormItem>
              <FormItem 
                        v-if="formLeft.isThereEoriNumber == 2"
                        class="requiredItem"
                        style="width:300px;"
                        prop="needEoriNumber"
                        label="是否申请欧盟EORI号">
                <RadioGroup v-model="formLeft.needEoriNumber">
                  <Radio label="1"
                        :disabled="notChange">是</Radio>
                  <Radio label="0"
                        :disabled="notChange">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>

            <Col :span="8">
              <FormItem label="是否有其他欧盟税号" style="width:300px;">
                <Input v-model="formLeft.shopOtherEuTaxNumber"
                      placeholder="如有，则填写税号信息"
                      :disabled="notChange">
                </Input>
              </FormItem>
            </Col>
            <Col :span="8">
            <FormItem label="描述下公司经营内容"
                      class="requiredItem"
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
              <FormItem label="后台店铺截图"
                      style="margin-bottom:15px;width:300px;"
                      class="flex-direction requiredItem"
                      prop="shopConsoleScreenshot">
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
                   v-if="formLeft.shopConsoleScreenshot !==''">
                <div class="inner img-box">
                  <a :href="formLeft.shopConsoleScreenshot"
                     target="_blank"
                     class="show-pdf">
                    后台店铺截图
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
                <a href="https://fdfs.itaxs.com/group1/M00/00/27/rBLKNV61CJKACMtaAAtFQeS7riM549.pdf"
                   target="_blank">
                  <img src="@/assets/images/common/searchImg.png"
                       alt="">
                  查看示例
                </a>
              </div>
            </FormItem>
            </Col>
           <Col :span="8">
            <!-- <FormItem label="预计未来12个月销售额"
                      class="requiredItem"
                      style="width:300px;"
                      prop="shopSalePlan">
              <Input v-model="formLeft.shopSalePlan"
                     placeholder="请输入预计未来12个月销售额"
                     :disabled="notChange"
                     >
                     <template slot="append">EUR</template>
                     </Input>
              <p style="font-size: 14px;font-weight: 400;color: #FBB73C;line-height: 18px;margin-top: 10px;">注：请输入完整的销售额</p>
            </FormItem> -->
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';
import { getMaterialSubmit, getRegTaxDetail, getMaterialSave, getAllServiceCompanies, getCompanyInformation, getCompanyLegalPersonSign,getCompanyLegalPersonSignUrl } from "@/api/registerInfo/registerInfo";
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
        return callback(new Error('请填写销售额'));
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
        shopTaxRate: '1',
        companyType: '1',
        certificateType: '1',
        vatTaxNumber: "",
        declarePeriod: "",
        companyNameEn: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEnProvince:'',
        companyAddressEn: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyEmail: "",
        companyTel: "",
        companyBusinessModeDescribe: "",
        shopSalePlan:'',
        companyLegalPersonSign: '',
        taxEffectiveDate: "",
        upBeginTime: "",
        upEndTime: "",
        companyBusinessLicense: "",
        companyBusinessLicense1:'',
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
        companyLegalPersonCard: '',
        companyLegalPersonCardAddressZh:'',
        companyLegalPersonCardReverse: '',
        personCardAddressEn: '',
        companyLegalPersonAddressEnCountry:'',
        companyLegalPersonCardAddress:'',
        personCardAddressCityEn:'',
        personCardAddressProvinceEn:'',
        companyLegalPersonBirthday: '',
        shopHref: '',
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
        servicesId: this.servicesId,
        articlesOfAssociationFile: '',
        salesEvidenceFile: '',
        shopSaleBeforeFile: '',
        companyStockConditionFile: '',
        isOtherBusinessActivities: '2',
        isThereShop: '1',
        isThereSale: '1',
        isOtherGulfStateDutyOrServices: '1',
        taxRegisterLetter: '',
        companyCreditCode: '',
        companyAddressZh:'',
        companyPostCode: '',
        personCardAddressCountryEn: '',
        personCardAddressCityEn: '',
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
        legalPersonSex: '',
        legalPersonPostCode: '',
        isThereEoriNumber: '',
        eoriNumber :'',
        declareRule: '',
        needEoriNumber: '',
        companyNameZh: ''
      },
      ruleForm: {
        shopOtherEuTaxNumber: [
          { required: true, trigger: "change", message: "请输入是否有其他欧盟税号", }
        ],
        isThereEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否有欧盟EORI号", }
        ],
        needEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否申请欧盟EORI号", }
        ],
         eoriNumber: [
          { required: true, trigger: "blur", message: "请输入欧盟EORI号", }
        ],
        companyPostCode: [
          { required: true, trigger: "change", message: "请输入公司邮编号码", }
        ],
        shopNature: [
          { required: true, trigger: "change", message: "请选择开店主体", }
        ],
        companyType: [
          { required: true, trigger: "change", message: "请选择公司类型", }
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
        shopSalePlatformName: [
          { required: true, trigger: "change", message: "请选择店铺所在电商平台", }
        ],
        certificateType: [
          { required: true, trigger: "change", message: "请选择证件类型", }
        ],
        taxRegisterLetter: [
          { required: true, trigger: "blur", message: "请上传税务申请函", }
        ],
        isOtherGulfStateDutyOrServices: [
          { required: true, trigger: "blur", message: "请选择是否有其他海湾国税号或业务", }
        ],
        isThereShop: [
          { required: true, trigger: "blur", message: "请选择是否有店铺", }
        ],
        isThereSale: [
          { required: true, trigger: "blur", message: "请选择是否销售", }
        ],
        shopSaleBefore: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        future30Sale: [
          { required: true, trigger: "blur", message: "请填写阿拉伯数字", validator: onlyNumber }
        ],
        legalPersonCardPassportNumber: [
          { required: true, trigger: "blur", message: "请填写法人护照号" }
        ],
        swiftBic: [
          { required: true, trigger: "blur", message: "请填写Swift / BIC" }
        ],
        bankAddress: [
          { required: true, trigger: "blur", message: "请填写支行英文地址" }
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
        shopPostCode: [
          { required: true, trigger: "blur", message: "请填写邮政编码" }
        ],
        profession: [
          { required: true, trigger: "blur", message: "请填写职业" }
        ],
        shopSalePlatformAccount: [
          { required: true, trigger: "blur", message: "请填写电商平台账号完整名称" }
        ],
        shopSaleBeforeFile: [
          { required: true, trigger: "blur", message: "请上传过往12个月销售报告" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写常用联系邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
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
        companyLegalPersonCardAddressZh: [
          { required: true, trigger: "blur", message: "请填写法人身份证中文地址" }
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
        companyAddressZh: [
          { required: true, trigger: "blur", message: "请填写公司中文地址" }
        ],
        companyRegisteredCityEn: [
          { required: true, trigger: "blur", message: "请填写公司注册登记城市英文" }
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
        shopSalePlan: [
          { required: true, trigger: "blur",
           validator:(rule,value,callback)=>{
            if(value == '' || value == undefined){
              callback(new Error('请输入预计未来12个月销售额'));
            }else{
              callback();
            }
           }
          }
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
        companyBusinessLicense1: [
          {
            required: true,
            trigger: "change",
            message: "请上传主体国家对应的营业执照"
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
      this.formLeft[item] = date;
    },
    getLegalpersonCountry() {
      legalpersonCountry().then(res => {
        if (res.code === 0) {
          this.birthplaceList = res.data
        }
      })
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
      this.$forceUpdate();

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
      this.$forceUpdate();
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
    saveData() {
      let data = { ...this.formLeft }
      // 意大利海外的 主体国家对应的营业执照
      if(this.formLeft.companyType == 3){
        data.companyBusinessLicense = this.formLeft.companyBusinessLicense1;
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
      this.$refs['formLeft'].validate((valid) => {
        if (valid) {
          let data = { ...this.formLeft }
          // 意大利海外的 主体国家对应的营业执照
          if(this.formLeft.companyType == 3){
            data.companyBusinessLicense = this.formLeft.companyBusinessLicense1;
          }
          this.translateDate(data)
          getMaterialSubmit(data)
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
    //转换日期
    translateDate(data) {
      data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData, 'date')
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, 'date')
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, 'date')
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
    this.getLegalpersonCountry()
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
          this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber)
          this.formLeft.needEoriNumber = String(val.needEoriNumber)
          this.formLeft.legalPersonSex = String(val.legalPersonSex)
          this.formLeft.shopSalePlatformName = String(val.shopSalePlatformName)
          this.formLeft.dredgeEuronext = String(val.dredgeEuronext)
          this.formLeft.useEntrepot = String(val.useEntrepot)
          this.formLeft.declarePeriod = String(val.declarePeriod)
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
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

