<template>
  <div class="waitUploadWrapper">
    <div class="back" @click="goBack()">
      <Icon type="md-arrow-back" />
      返回列表
    </div>
    <div class="content" style="width:100%;">
      <div
        v-if="
          progressBar == 0 ||
            progressBar == 1 ||
            progressBar == 3 ||
            progressBar == 4 ||
            progressBar == 5 ||
            progressBar == 6 ||
            progressBar == 7 ||
            progressBar == 8 ||
            isService
        "
        class="content"
        style="width:100%;"
      >
        <div class="content-l">
          <Card>
            <p slot="title" class="companyTitleBox">
              <span>注册资料</span>
              <span v-if="detailInfo.progressBar == 0">
                <!-- 0-待上传资料 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list01')"
                  @click="sendMessage(detailInfo.progressBar)"
                  ghost
                  style="margin-right:10px"
                >
                  发送提醒
                </Button>
                <Button type="primary" v-show="hasAuthority('work_order_list03')" @click="submitFile">提交审核</Button>
              </span>
              <span v-if="detailInfo.progressBar == 1">
                <!-- 1-待审核资料 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button
                  type="primary"
                  ghost
                  style="margin-right:10px;"
                  @click="supplierModal = true"
                  v-if="
                    detailInfo.countryNameZh === '德国' ||
                      detailInfo.countryNameZh === '法国' ||
                      detailInfo.countryNameZh === '西班牙'
                  "
                >
                  选择服务商
                </Button>
                <Button type="primary" v-show="hasAuthority('work_order_list04')" @click="auditModal = true">
                  审核
                </Button>
              </span>
              <span v-if="detailInfo.progressBar == 3">
                <!-- 3-注册中 -->
                <!-- <Button type="primary"
                        v-if="detailInfo.countryCode === 'NL'"
                        @click="NLshenhe=true"
                        style="margin-right:8px;">审核</Button> -->
                <!-- <Button type="primary" ghost v-if="!detailInfo.submitTaxTime" @click="submitTaxModal=true" style="margin-right:10px;" v-show="hasAuthority('mainList_submitTaxTime')">提交税局</Button> -->
                <Button
                  type="primary"
                  ghost
                  v-if="!detailInfo.submitServiceTime"
                  @click="submitServiceModal = true"
                  style="margin-right:10px;"
                  v-show="hasAuthority('mainList_submitServiceTime')"
                >
                  提交资料
                </Button>
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button
                  type="primary"
                  v-if="
                    detailInfo.countryCode === 'ES' && submitForm.taxTrackingNumber == '' && detailInfo.supplierId == 43
                  "
                  @click="sendTaxBox = true"
                  style="margin-right:8px;"
                >
                  填写寄送税局单号
                </Button>
                <Button
                  type="primary"
                  ghost
                  @click="SIRETMadol = true"
                  v-if="detailInfo.countryCode === 'FR'"
                  style="margin-right:10px;"
                >
                  录入SIRET号
                </Button>
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list06')"
                  :disabled="detailInfo.submitServiceTime == ''"
                  @click="
                    (taxNumModal = true), (addTaxNum.taxEffectiveDate = formatDate(submitForm.shopTaxEffectiveData))
                  "
                >
                  录入税号信息
                </Button>
              </span>
              <span v-if="detailInfo.progressBar == 4">
                <!-- 4-注册完成 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button
                  type="primary"
                  v-if="detailInfo.countryCode === 'GB' && !isAuth"
                  v-show="hasAuthority('work_order_list07')"
                  @click="startTaxFun(detailInfo)"
                >
                  授权报税
                </Button>

                <Button
                  type="primary"
                  style="margin-right:10px;"
                  v-if="detailInfo.countryCode !== 'GB'"
                  v-show="hasAuthority('work_order_list07')"
                  @click="fileTaxModal = true"
                >
                  填写报税时间
                </Button>
                <Button
                  type="primary"
                  v-if="detailInfo.countryCode === 'FR' && detailInfo.vatTaxNumber == ''"
                  v-show="hasAuthority('work_order_list06')"
                  @click="
                    (taxNumModal = true), (addTaxNum.taxEffectiveDate = formatDate(submitForm.shopTaxEffectiveData))
                  "
                >
                  录入税号信息
                </Button>
                <Button
                  type="primary"
                  ghost
                  @click="SIRETMadol = true"
                  v-if="detailInfo.countryCode === 'FR' && detailInfo.siretNumber == ''"
                  style="margin-right:10px;"
                >
                  录入SIRET号
                </Button>
              </span>
              <span v-if="detailInfo.progressBar == 5">
                <!-- 4-待授权海牙认证 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'" @click="authorizationHauge = true">
                  已发送服务商
                </Button>
              </span>
              <span v-if="detailInfo.progressBar == 6">
                <!-- 6-海牙认证中 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button
                  type="primary"
                  v-if="
                    detailInfo.countryCode === 'ES' && submitForm.hyTrackingNumber == '' && detailInfo.supplierId == 43
                  "
                  style="margin-right:10px;"
                  @click="enterTrankingNumber = true"
                >
                  填写寄送海牙单号
                </Button>
                <Button type="primary" v-if="detailInfo.countryCode === 'ES'" @click="enterHaugeInfo = true">
                  录入海牙信息
                </Button>
              </span>

              <span v-if="detailInfo.progressBar == 7">
                <!-- 7-待授权注册税号 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <!-- <Button type="primary" v-if="detailInfo.countryCode === 'FR'" style="margin-right:10px;" @click="uploadAuthorizationFR=true">上传授权书</Button> -->
              </span>
              <span v-if="detailInfo.progressBar == 8">
                <!-- 8-资料驳回 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('work_order_list05')"
                  ghost
                  @click="downLoad"
                  style="margin-right:10px;"
                >
                  下载资料
                </Button>
                <Button type="primary" v-show="hasAuthority('work_order_list08')" @click="submitFile">重新提交</Button>
              </span>
            </p>
            <!-- 英国提交资料 -->
            <div v-if="detailInfo.countryCode === 'GB'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" :rules="formLeftRules" class="formstyle" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">个体户（个人名义）</Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">海外公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司营业执照"
                    prop="companyBusinessLicense"
                    class="requiredItem"
                    v-if="
                      submitForm.shopNature === '1' &&
                        (submitForm.companyType === '1' || submitForm.companyType === '3')
                    "
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          营业执照
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="商业登记证BR扫描件"
                    prop="companyBusinessRegistrationBr"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="公司注册证明书CI扫描件"
                    prop="companyRegistrationCi"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法团成立表格NNC1扫描件"
                    prop="companyCorporateFoundingNnc1"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    prop="companyCreditCode"
                    label="统一信用代码："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="公司中文名称："
                    prop="companyNameZh"
                    class="requiredItem"
                    v-if="submitForm.shopNature == '1'"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    prop="companyRegisterData"
                    label="公司成立时间："
                    class="requiredItem"
                  >
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">驾驶证</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="法人身份证正面扫描件"
                    prop="companyLegalPersonCardFront"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法人身份证反面扫描件"
                    prop="companyLegalPersonCardReverse"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法人护照扫描件"
                    prop="companyLegalPersonCardPassport"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人驾驶证" prop="driverLicense" v-if="submitForm.certificateType === '3'">
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'driverLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'driverLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.driverLicense">
                        <div v-if="submitForm.driverLicense != ''">
                          <a target="_blank" @click="previewFile(submitForm.driverLicense)">
                            {{ "法人驾驶证" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'driverLicense')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem label="法人中文姓名：" prop="companyLegalPersonZh" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="法人英文姓名：" prop="companyLegalPersonEn" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday" class="requiredItem">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>

                  <FormItem label="法人身份证号码：" prop="companyLegalPersonCard" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人联系邮箱：" prop="companyLegalPersonEmail" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人联系邮箱"
                      v-model="submitForm.companyLegalPersonEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="邮编号码：" prop="shopPostCode" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.shopPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" prop="companyAddressEn" class="requiredItem">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" prop="shopTaxEffectiveData" class="requiredItem">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="未来12个月预计销售额(英镑)：" prop="shopSalePlan" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入未来12个月预计销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="税率：" prop="shopTaxRate" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopTaxRate">
                      <Radio :label="'0'" :disabled="!isCompanyInfoEdit">
                        <span>低税率</span>
                      </Radio>
                      <Radio :label="'1'" :disabled="!isCompanyInfoEdit">
                        <span>标准税率</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" prop="companyBusinessModeDescribe" class="requiredItem">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有店铺后台截图：" prop="isShopConsoleScreenshot" class="requiredItem">
                    <RadioGroup v-model="submitForm.isShopConsoleScreenshot">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">
                        <span>有截图</span>
                      </Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">
                        <span>无截图</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="后台店铺截图："
                    v-if="submitForm.isShopConsoleScreenshot === '1'"
                    class="requiredItem"
                    prop="shopConsoleScreenshot"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="店铺确认函："
                    v-if="submitForm.isShopConsoleScreenshot === '2'"
                    class="requiredItem"
                    prop="shopConsoleConfirmationLetter"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleConfirmationLetter');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleConfirmationLetter');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleConfirmationLetter">
                        <div v-if="submitForm.shopConsoleConfirmationLetter != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleConfirmationLetter)">
                            {{ "店铺确认函" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleConfirmationLetter')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <div class="otherFileBox">
                    <p class="classifyTitleBox">
                      <span class="classifyTitle">其他证明文件</span>
                      <span v-if="submitForm.isShopConsoleScreenshot === '2'">
                        (以下资料至少上传二种文件，工作证明和租房合同为必选)
                      </span>
                    </p>
                    <FormItem label="工作证明：" prop="certificateOfEmployment" class="requiredItem">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'certificateOfEmployment');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'certificateOfEmployment');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.certificateOfEmployment">
                          <div v-if="submitForm.certificateOfEmployment != ''">
                            <a target="_blank" @click="previewFile(submitForm.certificateOfEmployment)">
                              {{ "工作证明" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'certificateOfEmployment')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem label="租房合同：" prop="leaseAgreement" class="requiredItem">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'leaseAgreement');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'leaseAgreement');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.leaseAgreement">
                          <div v-if="submitForm.leaseAgreement != ''">
                            <a target="_blank" @click="previewFile(submitForm.leaseAgreement)">
                              {{ "租房合同" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'leaseAgreement')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem v-if="submitForm.isShopConsoleScreenshot === '2'" label="结婚证：">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'marriageLicense');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'marriageLicense');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.marriageLicense">
                          <div v-if="submitForm.marriageLicense != ''">
                            <a target="_blank" @click="previewFile(submitForm.marriageLicense)">
                              {{ "结婚证" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'marriageLicense')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem v-if="submitForm.isShopConsoleScreenshot === '2'" label="离婚证：">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'divorceCertificate');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'divorceCertificate');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.divorceCertificate">
                          <div v-if="submitForm.divorceCertificate != ''">
                            <a target="_blank" @click="previewFile(submitForm.divorceCertificate)">
                              {{ "离婚证" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'divorceCertificate')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem v-if="submitForm.isShopConsoleScreenshot === '2'" label="房产证：">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'houseProprietaryCertificate');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'houseProprietaryCertificate');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox" v-if="submitForm.houseProprietaryCertificate">
                        <div v-if="submitForm.houseProprietaryCertificate != ''">
                          <a target="_blank" @click="previewFile(submitForm.houseProprietaryCertificate)">
                            {{ "房产证" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'houseProprietaryCertificate')"
                            />
                          </a>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem
                      v-if="submitForm.isShopConsoleScreenshot === '2'"
                      label="出生证/户口本（户主页+本人页）："
                    >
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'birthCertificate');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'birthCertificate');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox" v-if="submitForm.birthCertificate">
                        <div v-if="submitForm.birthCertificate != ''">
                          <a target="_blank" @click="previewFile(submitForm.birthCertificate)">
                            {{ "出身证/户口本" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'birthCertificate')"
                            />
                          </a>
                        </div>
                      </div>
                    </FormItem>
                    <FormItem v-if="submitForm.isShopConsoleScreenshot === '2'" label="房屋贷款明细：">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'otherCertificate');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'otherCertificate');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox" v-if="submitForm.otherCertificate">
                        <div v-if="submitForm.otherCertificate != ''">
                          <a target="_blank" @click="previewFile(submitForm.otherCertificate)">
                            {{ "其他证明" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'otherCertificate')"
                            />
                          </a>
                        </div>
                      </div>
                    </FormItem>
                  </div>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 德国提交资料 -->
            <div v-if="detailInfo.countryCode === 'DE'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">个体户（个人名义）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="营业执照模板选择:" prop="companyBusinessLicenseAnyway" class="requiredItem">
                    <RadioGroup v-model="submitForm.companyBusinessLicenseAnyway">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">横版</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">竖版</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- <FormItem label="公司统一信用编码：">
                    <Input :disabled="!isCompanyInfoEdit"
                           placeholder="请输入统一信用编码"
                           v-model="submitForm.companyCreditCode"
                           style="width: 300px" />
                  </FormItem> -->
                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="公司联系电话："
                    class="requiredItem"
                    prop="companyTel"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="公司联系邮箱："
                    class="requiredItem"
                    prop="companyEmail"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系邮箱"
                      v-model="submitForm.companyEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="公司成立时间："
                    class="requiredItem"
                    prop="companyRegisterData"
                  >
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <!-- <FormItem label="身份证头像截图">
                    <Upload ref="NNC1FILE"
                            type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'screenshotOfIdAvatar')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'screenshotOfIdAvatar')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            style="width:300px"
                            :disabled='!isCompanyInfoEdit'
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.screenshotOfIdAvatar">
                        <div v-if="submitForm.screenshotOfIdAvatar!=''">
                          <a target="_blank"
                             @click="previewFile(submitForm.screenshotOfIdAvatar)">
                            {{"身份证头像截图"}}
                            <Icon v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('','','screenshotOfIdAvatar')" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem> -->
                  <FormItem prop="screenshotOfIdCardFront" label="身份证正面截图">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'screenshotOfIdCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'screenshotOfIdCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.screenshotOfIdCardFront">
                        <div v-if="submitForm.screenshotOfIdCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.screenshotOfIdCardFront)">
                            {{ "身份证正面截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'screenshotOfIdCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="screenshotOfIdCardReverse" label="身份证反面截图">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'screenshotOfIdCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'screenshotOfIdCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.screenshotOfIdCardReverse">
                        <div v-if="submitForm.screenshotOfIdCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.screenshotOfIdCardReverse)">
                            {{ "身份证反面截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'screenshotOfIdCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="screenshotOfBusinessLicense" label="营业执照截图">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'screenshotOfBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'screenshotOfBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.screenshotOfBusinessLicense">
                        <div v-if="submitForm.screenshotOfBusinessLicense != ''">
                          <a target="_blank" @click="previewFile(submitForm.screenshotOfBusinessLicense)">
                            {{ "营业执照截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'screenshotOfBusinessLicense')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人中文姓名：" prop="companyLegalPersonZh" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人联系邮箱：" class="requiredItem" prop="companyLegalPersonEmail">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人联系邮箱"
                      v-model="submitForm.companyLegalPersonEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人联系电话：" class="requiredItem" prop="companyLegalPersonMobile">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人联系电话"
                      v-model="submitForm.companyLegalPersonMobile"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生地邮编号码：" class="requiredItem" prop="legalPersonPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填写法人出生地邮政编号"
                      v-model="submitForm.legalPersonPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <Row>
                      <Col span="5">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="平台店铺名称：" class="requiredItem" prop="shopName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入平台店铺名称"
                      v-model="submitForm.shopName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="邮编号码：" class="requiredItem" prop="shopPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.shopPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="是否已有EORI号：" class="requiredItem" prop="needEoriNumber">
                    <RadioGroup v-model="submitForm.needEoriNumber">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio label="0" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="其他国家欧盟税号(如有可填写)：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="德国仓库地址：" class="requiredItem" prop="shopEntrepotAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入德国仓库地址"
                      v-model="submitForm.shopEntrepotAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="物流承运商地址：" class="requiredItem" prop="shopLogisticsCompany">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入物流承运商地址"
                      v-model="submitForm.shopLogisticsCompany"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="物流承运商公司名称：" class="requiredItem" prop="shopLogisticsCompanyName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入物流承运商公司名称"
                      v-model="submitForm.shopLogisticsCompanyName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="今年预计销售额(欧元)：" class="requiredItem" prop="shopPredictSale">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入今年预计销售额"
                      v-model="submitForm.shopPredictSale"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="明年预计销售额(欧元)：" class="requiredItem" prop="shopNextYearSale">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入明年预计销售额"
                      v-model="submitForm.shopNextYearSale"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="storageAddressImg" label="仓储地址截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'storageAddressImg');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'storageAddressImg');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.storageAddressImg">
                        <div v-if="submitForm.storageAddressImg != ''">
                          <a target="_blank" @click="previewFile(submitForm.storageAddressImg)">
                            {{ "仓储地址截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'storageAddressImg')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>

                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 法国提交资料 -->
            <div v-if="detailInfo.countryCode === 'FR'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType" @on-change="companyTypeChange">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">海外公司</Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem
                    label="公司章程："
                    class="requiredItem"
                    prop="articlesOfAssociationFile"
                    v-if="submitForm.companyType == 3"
                  >
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.articlesOfAssociationFile == ''">
                            请拖拽文件到此区域上传或点击上传
                          </span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.articlesOfAssociationFile != ''">
                        <a :href="submitForm.articlesOfAssociationFile" target="_blank">公司章程</a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'articlesOfAssociationFile')"
                        />
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="银行账号文件：" class="" prop="bankAccountFile" v-if="submitForm.companyType == 3">
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'bankAccountFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.bankAccountFile == ''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.bankAccountFile != ''">
                        <a :href="submitForm.bankAccountFile" target="_blank">银行账号文件</a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'bankAccountFile')"
                        />
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="公司本国税号文件："
                    class=""
                    prop="companyTaxNumFile"
                    v-if="submitForm.companyType == 3"
                  >
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyTaxNumFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.companyTaxNumFile == ''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.companyTaxNumFile != ''">
                        <a :href="submitForm.companyTaxNumFile" target="_blank">公司本国税号文件</a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'companyTaxNumFile')"
                        />
                      </div>
                    </div>
                  </FormItem>

                  <FormItem
                    label="公司中文名称："
                    prop="companyNameZh"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="统一信用代码："
                    prop="companyCreditCode"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="公司成立时间："
                    prop="companyRegisterData"
                    class="requiredItem"
                  >
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="公司联系电话："
                    prop="companyTel"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="公司注册资本："
                    v-if="submitForm.shopNature === '1'"
                    prop="companyRegisteredCapital"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      type="number"
                      placeholder=" 请输入完整的注册资本金额，如10W，则输入100000"
                      v-model="submitForm.companyRegisteredCapital"
                      style="width: 300px"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" prop="certificateType" class="requiredItem">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit || submitForm.companyType == '3'" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" prop="companyLegalPersonEn" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday" class="requiredItem">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人性别：" class="requiredItem" prop="legalPersonSex">
                    <RadioGroup v-model="submitForm.legalPersonSex">
                      <Radio :label="'1'" :disabled="!isCompanyInfoEdit">
                        <span>男</span>
                      </Radio>
                      <Radio :label="'2'" :disabled="!isCompanyInfoEdit">
                        <span>女</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="法人身份证号码：" class="requiredItem" prop="companyLegalPersonCard">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人国籍：" class="requiredItem" prop="companyLegalPersonCitizenship">
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyLegalPersonCitizenship"
                      placeholder="请选择法人国籍"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="法人出生地邮编号码：" class="requiredItem" prop="legalPersonPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填写法人出生地邮政编号"
                      v-model="submitForm.legalPersonPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnProvince"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：GuangDong"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:100px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="month"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="是否有其它欧盟国家税号（选填）：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有欧盟国EORI号:" prop="isThereEoriNumber" class="requiredItem requiredItem">
                    <RadioGroup v-model="submitForm.isThereEoriNumber">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="预计未来12个月销售额：" class="requiredItem" prop="shopSalePlan">
                    <Input
                      v-model="submitForm.shopSalePlan"
                      type="number"
                      :minlength="4"
                      placeholder="请输入完整的销售额"
                      @on-blur="shopSalePlanChange"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    >
                      <span slot="append">欧元（EUR）</span>
                    </Input>
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 波兰提交资料 -->
            <div v-if="detailInfo.countryCode === 'PL'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">个体户（个人名义）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="公司中文名称：" class="requiredItem" prop="companyNameZh">
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="社会统一信用代码：" class="requiredItem" prop="companyCreditCode">
                    <Input
                      v-model="submitForm.companyCreditCode"
                      placeholder=" 请输入营业执照的信用代码"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司联系邮编：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系邮编"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司成立时间：" class="requiredItem" prop="companyRegisterData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法人身份证号码："
                    v-if="submitForm.certificateType === '1'"
                    prop="companyLegalPersonCard"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                    (个人店铺必填)
                  </FormItem>
                  <FormItem
                    label="法人护照号码："
                    v-if="submitForm.certificateType === '2'"
                    class="requiredItem"
                    prop="legalPersonCardPassportNumber"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人护照"
                      v-model="submitForm.legalPersonCardPassportNumber"
                      style="width: 300px"
                    />
                    (个人店铺必填)
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <!-- <FormItem label="法人联系邮箱："
                            class="requiredItem"
                            prop="companyLegalPersonEmail">
                    <Input :disabled="!isCompanyInfoEdit"
                           placeholder="请输入法人联系邮箱"
                           v-model="submitForm.companyLegalPersonEmail"
                           style="width: 300px" />
                  </FormItem> -->
                  <FormItem label="法人出生地：" class="requiredItem" prop="companyLegalPersonBirthplace">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人出生地"
                      v-model="submitForm.companyLegalPersonBirthplace"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" prop="companyLegalPersonCardAddressZh" class="requiredItem">
                    <Input
                      v-model="formLeft.companyLegalPersonCardAddressZh"
                      placeholder="请输入法人身份证中文地址"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress" class="requiredItem">
                    <Input
                      v-model="formLeft.companyLegalPersonCardAddress"
                      placeholder="请输入法人身份证英文地址"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <Row>
                      <Col span="6">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="预计未来12个月销售额：" class="requiredItem" prop="shopSalePlan">
                    <Input
                      v-model="submitForm.shopSalePlan"
                      placeholder="请输入完整的销售额"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    >
                      <span slot="append">欧元（EUR）</span>
                    </Input>
                    <p style="font-size: 14px;font-weight: 400;color: #FBB73C;">
                      注： 请输入完整的销售额，如10W，则输入100000；
                    </p>
                  </FormItem>
                  <FormItem
                    label="是否有其它欧盟国VAT:"
                    prop="isOtherGulfStateDutyOrServices"
                    class="requiredItem"
                    v-if="submitForm.isThereShop == '1'"
                  >
                    <RadioGroup v-model="submitForm.isOtherGulfStateDutyOrServices">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="VAT增值税号：" class="requiredItem" prop="shopOtherEuTaxNumber">
                    <Input
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                      placeholder="请填写相对应国家的税号"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="是否有欧盟国EORI号:" prop="isThereEoriNumber" class="requiredItem requiredItem">
                    <RadioGroup v-model="submitForm.isThereEoriNumber">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="欧盟国EORI号：" class="requiredItem" prop="otherEoriNumber">
                    <Input
                      v-model="submitForm.otherEoriNumber"
                      placeholder="请填写欧盟国EORI号"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="vatCertificate" label="意大利或法国VAT证书" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatCertificate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatCertificate');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.vatCertificate">
                        <div v-if="submitForm.vatCertificate != ''">
                          <a target="_blank" @click="previewFile(submitForm.vatCertificate)">
                            {{ "意大利或法国VAT证书" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'vatCertificate')"
                            />
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
                      <Input
                        v-model="submitForm.bankAccountName"
                        placeholder="请输入银行账户名称"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </FormItem>
                    <FormItem label="IBAN/银行账户：" class="requiredItem" prop="bankAccount">
                      <Input
                        v-model="submitForm.bankAccount"
                        placeholder="请输入IBAN/银行账户"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </FormItem>
                    <FormItem label="银行英文名称：" class="requiredItem" prop="bankName">
                      <Input
                        v-model="submitForm.bankName"
                        placeholder="请输入银行英文名称"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </FormItem>
                    <FormItem label="开户国家：" class="requiredItem" prop="bankCountryEn">
                      <Input
                        v-model="submitForm.bankCountryEn"
                        placeholder="请输入开户国家"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </FormItem>
                    <FormItem label="Swift / BIC：" class="requiredItem" prop="swiftBic">
                      <Input
                        v-model="submitForm.swiftBic"
                        placeholder="请输入Swift / BIC"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </FormItem>
                  </div>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 意大利老服务商提交资料 -->
            <div v-if="detailInfo.countryCode === 'IT' && detailInfo.supplierId != 50">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="统一信用代码："
                    class="requiredItem"
                    prop="companyCreditCode"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="公司中文地址："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyAddressZh"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文地址"
                      v-model="submitForm.companyAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    prop="companyCreditReport"
                    label="公司信用报告"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCreditReport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCreditReport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCreditReport">
                        <div v-if="submitForm.companyCreditReport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                            {{ "公司信用报告" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCreditReport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证号码：" class="requiredItem" prop="companyLegalPersonCard">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生地：" class="requiredItem" prop="companyLegalPersonBirthplace">
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyLegalPersonBirthplace"
                      placeholder="请选择法人出生地"
                      class="requiredItem"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" class="requiredItem" prop="companyLegalPersonCardAddressZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证中文地址"
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <!-- <Input v-model="submitForm.personCardAddressCountryEn" :disabled="!isCompanyInfoEdit" placeholder="如:China" style="width:97px;margin-right:3px" /> -->
                    <Input
                      v-model="submitForm.personCardAddressProvinceEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：GuangDong"
                      style="width:148px;margin-right:4px"
                    />
                    <Input
                      v-model="submitForm.personCardAddressCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyLegalPersonCardAddress"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem prop="companyLegalPersonSign" label="法人签名：" class="requiredItem">
                    <div class="legalPersonSignBox">
                      <div class="legalPersonSign">
                        <img
                          v-if="
                            submitForm.companyLegalPersonSign !== '' && submitForm.companyLegalPersonSign !== undefined
                          "
                          :src="submitForm.companyLegalPersonSign"
                          alt=""
                        />
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnProvince"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：GuangDong"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:100px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="申报周期：" class="requiredItem" prop="declarePeriod">
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.declarePeriod"
                      placeholder="请选择申报周期"
                      class="requiredItem"
                    >
                      <Option value="0">月度申报</Option>
                      <Option value="1">季度申报</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="是否有其它欧盟国家税号（选填）：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有欧盟国EORI号:" prop="isThereEoriNumber" class="requiredItem">
                    <RadioGroup v-model="submitForm.isThereEoriNumber">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="是否使用意大利仓库：" class="requiredItem" prop="useEntrepot">
                    <RadioGroup v-model="submitForm.useEntrepot">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="是否开通泛欧：" class="requiredItem" prop="dredgeEuronext">
                    <RadioGroup v-model="submitForm.dredgeEuronext">
                      <Radio label="2" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio label="1" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="货物进口及配送流程：" class="requiredItem" prop="shippingProcess">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入货物进口及配送流程"
                      type="textarea"
                      v-model="submitForm.shippingProcess"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 意大利新服务商提交资料 -->
            <div v-if="detailInfo.countryCode === 'IT' && detailInfo.supplierId == 50">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="统一信用代码："
                    class="requiredItem"
                    prop="companyCreditCode"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="公司中文地址："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyAddressZh"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文地址"
                      v-model="submitForm.companyAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>

                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="companyLegalPersonSign" label="法人签名：" class="requiredItem">
                    <div class="legalPersonSignBox">
                      <div class="legalPersonSign">
                        <img
                          v-if="
                            submitForm.companyLegalPersonSign !== '' && submitForm.companyLegalPersonSign !== undefined
                          "
                          :src="submitForm.companyLegalPersonSign"
                          alt=""
                        />
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="销售平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnProvince"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：GuangDong"
                      style="width:97px;margin-right:3px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:100px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="申报周期：" class="requiredItem" prop="declarePeriod">
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.declarePeriod"
                      placeholder="请选择申报周期"
                      class="requiredItem"
                    >
                      <Option value="0">月度申报</Option>
                      <Option value="1">季度申报</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="是否注册EORI号:" prop="needEoriNumber" class="requiredItem">
                    <RadioGroup v-model="submitForm.needEoriNumber">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="0" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图：" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 西班牙提交资料 -->
            <div v-if="detailInfo.countryCode === 'ES' && detailInfo.hyFlag != 2">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">海外公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="
                      submitForm.shopNature === '1' &&
                        (submitForm.companyType === '1' || submitForm.companyType === '3')
                    "
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    label="公司国籍："
                    class="requiredItem"
                    v-if="submitForm.companyType === '3'"
                    prop="companyCitizenship"
                  >
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyCitizenship"
                      placeholder="请选择公司国籍"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    label="公司中文地址："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyAddressZh"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文地址"
                      v-model="submitForm.companyAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="统一信用代码："
                    class="requiredItem"
                    prop="companyCreditCode"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    prop="companyCreditReport"
                    label="公司信用报告"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCreditReport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCreditReport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCreditReport">
                        <div v-if="submitForm.companyCreditReport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                            {{ "公司信用报告" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCreditReport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCreditReport"
                    label="股东信息文件"
                    class="requiredItem"
                    v-if="submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCreditReport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCreditReport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCreditReport">
                        <div v-if="submitForm.companyCreditReport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                            {{ "股东信息文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCreditReport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法人身份证号码："
                    v-if="submitForm.certificateType === '1'"
                    class="requiredItem"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="护照号码："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填护照号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="法人国籍："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                    prop="companyLegalPersonCitizenship"
                  >
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyLegalPersonCitizenship"
                      placeholder="请选择法人国籍"
                      class="requiredItem"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生省份：" class="requiredItem" prop="legalPersonBirthplaceProvinceEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入中文，如：广东"
                      v-model="submitForm.legalPersonBirthplaceProvinceZh"
                      style="width: 150px"
                    />
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入英文，如：GuangDong"
                      v-model="submitForm.legalPersonBirthplaceProvinceEn"
                      style="width: 150px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" class="requiredItem" prop="companyLegalPersonCardAddressZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证中文地址"
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <Row>
                      <Col span="5">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="shopPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.shopPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px;margin-bottom:10px;"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem prop="amazonProveFile" label="亚马逊证明文件" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'amazonProveFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'amazonProveFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.amazonProveFile">
                        <div v-if="submitForm.amazonProveFile != ''">
                          <a target="_blank" @click="previewFile(submitForm.amazonProveFile)">
                            {{ "亚马逊证明文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'amazonProveFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="vatTaxEuFile" label="其它欧盟税号文件" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.vatTaxEuFile">
                        <div v-if="submitForm.vatTaxEuFile != ''">
                          <a target="_blank" @click="previewFile(submitForm.vatTaxEuFile)">
                            {{ "其他欧盟税号文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'vatTaxEuFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 西班牙提交资料-无海牙认证版 -->
            <div v-if="detailInfo.countryCode === 'ES' && detailInfo.hyFlag == 2">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="公司类型"
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyType"
                  >
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">海外公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="
                      submitForm.shopNature === '1' &&
                        (submitForm.companyType === '1' || submitForm.companyType === '3')
                    "
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem
                    label="公司国籍："
                    class="requiredItem"
                    v-if="submitForm.companyType === '3'"
                    prop="companyCitizenship"
                  >
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyCitizenship"
                      placeholder="请选择公司国籍"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    label="公司中文地址："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyAddressZh"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文地址"
                      v-model="submitForm.companyAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="submitForm.shopNature === '1'"
                    label="统一信用代码："
                    class="requiredItem"
                    prop="companyCreditCode"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    prop="companyCreditReport"
                    label="公司信用报告"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCreditReport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCreditReport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCreditReport">
                        <div v-if="submitForm.companyCreditReport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                            {{ "公司信用报告" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCreditReport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCreditReport"
                    label="股东信息文件"
                    class="requiredItem"
                    v-if="submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCreditReport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCreditReport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCreditReport">
                        <div v-if="submitForm.companyCreditReport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                            {{ "股东信息文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCreditReport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardPassport"
                    label="法人护照扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                  >
                    <Upload
                      ref="passportFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardPassport">
                        <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                            {{ "法人护照扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="法人身份证号码："
                    v-if="submitForm.certificateType === '1'"
                    class="requiredItem"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="护照号码："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填护照号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="法人国籍："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                    prop="companyLegalPersonCitizenship"
                  >
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyLegalPersonCitizenship"
                      placeholder="请选择法人国籍"
                      class="requiredItem"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生省份：" class="requiredItem" prop="legalPersonBirthplaceProvinceEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入中文，如：广东"
                      v-model="submitForm.legalPersonBirthplaceProvinceZh"
                      style="width: 150px"
                    />
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入英文，如：GuangDong"
                      v-model="submitForm.legalPersonBirthplaceProvinceEn"
                      style="width: 150px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" class="requiredItem" prop="companyLegalPersonCardAddressZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证中文地址"
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <Row>
                      <Col span="5">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="shopPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.shopPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="国家 如：China"
                      style="width:300px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEnProvince"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="省份 如: guangdong"
                      style="width:148px;margin-right:6px;margin-bottom:10px;"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="城市 如: shenzhen"
                      style="width:148px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEnStreet"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="街道 如：minzhi"
                      style="width:148px;margin-right:6px;margin-bottom:10px;"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnHouseNo"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="门牌号 如: 23"
                      style="width:148px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem prop="amazonProveFile" label="亚马逊证明文件" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'amazonProveFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'amazonProveFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.amazonProveFile">
                        <div v-if="submitForm.amazonProveFile != ''">
                          <a target="_blank" @click="previewFile(submitForm.amazonProveFile)">
                            {{ "亚马逊证明文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'amazonProveFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="vatTaxEuFile" label="其它欧盟税号文件" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.vatTaxEuFile">
                        <div v-if="submitForm.vatTaxEuFile != ''">
                          <a target="_blank" @click="previewFile(submitForm.vatTaxEuFile)">
                            {{ "其他欧盟税号文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'vatTaxEuFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="shopConsoleScreenshot" label="后台店铺截图" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 荷兰提交资料 -->
            <div v-if="detailInfo.countryCode === 'NL'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="公司类型" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicenseTranslate"
                    label="营业执照英文公证翻译件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicenseTranslate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicenseTranslate');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicenseTranslate">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicenseTranslate != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicenseTranslate)">
                          {{ "营业执照英文公证翻译件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicenseTranslate')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="公司中文名称：" class="requiredItem" prop="companyNameZh">
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem label="统一信用代码：" class="requiredItem" prop="companyCreditCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司联系电话：" class="requiredItem" prop="companyTel">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司联系邮箱：" class="requiredItem" prop="companyEmail">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系邮箱"
                      v-model="submitForm.companyEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司成立时间：" class="requiredItem" prop="companyRegisterData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="公司网址(选填)：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司网址"
                      v-model="submitForm.companyWebsite"
                      style="width: 300px"
                    />
                  </FormItem>

                  <FormItem label="公司注册资金：" class="requiredItem" prop="companyRegisteredCapital">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      type="number"
                      placeholder="请输入公司注册资金"
                      v-model="submitForm.companyRegisteredCapital"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司所在地的税务机关名称（中文）：" class="requiredItem" prop="taxAuthorityNameZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司所在地的税务机关名称（中文）"
                      v-model="submitForm.taxAuthorityNameZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司所在地的税务机关名称（英文）：" class="requiredItem" prop="taxAuthorityNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司所在地的税务机关名称（英文）"
                      v-model="submitForm.taxAuthorityNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="上述税务机关的地址（中文）：" class="requiredItem" prop="taxAuthorityAddrZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入上述税务机关的地址（中文）"
                      v-model="submitForm.taxAuthorityAddrZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="上述税务机关的地址（英文）：" class="requiredItem" prop="taxAuthorityAddrEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入上述税务机关的地址（英文）"
                      v-model="submitForm.taxAuthorityAddrEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="完整的经营地址：" class="requiredItem" prop="officeAddressEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入完整的经营地址"
                      v-model="submitForm.officeAddressEn"
                      style="width: 300px"
                    />
                  </FormItem>

                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem prop="companyLegalPersonCardFront" label="法人身份证正面扫描件" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="companyLegalPersonCardReverse" label="法人身份证反面扫描件" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFrontTranslate"
                    label="身份证公证翻译件正面"
                    class="requiredItem"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFrontTranslate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFrontTranslate');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFrontTranslate">
                        <div v-if="submitForm.companyLegalPersonCardFrontTranslate != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFrontTranslate)">
                            {{ "身份证公证翻译件正面" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFrontTranslate')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverseTranslate"
                    label="身份证公证翻译件反面"
                    class="requiredItem"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverseTranslate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverseTranslate');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverseTranslate">
                        <div v-if="submitForm.companyLegalPersonCardReverseTranslate != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverseTranslate)">
                            {{ "身份证公证翻译件反面" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverseTranslate')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                      v-model="submitForm.companyLegalPersonBirthday"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="personCardAddressEn">
                    <Input
                      v-model="submitForm.personCardAddressCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.personCardAddressCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.personCardAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文地址，包含城市、省份、邮编、国家。"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" class="requiredItem" prop="companyLegalPersonCardAddressZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证中文地址"
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人邮编号码：" class="requiredItem" prop="legalPersonPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证所在地邮政编码"
                      v-model="submitForm.legalPersonPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>

                  <FormItem label="亚马逊账号的完整名称：" class="requiredItem" prop="amazonShopAccount">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入亚马逊账号的完整名称"
                      v-model="submitForm.amazonShopAccount"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="亚马逊卖家信息链接：" class="requiredItem" prop="amazonSellerLink">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入亚马逊卖家信息链接"
                      v-model="submitForm.amazonSellerLink"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="亚马逊销售的产品的链接或描述：" class="requiredItem" prop="amazonProductsLink">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入亚马逊销售的产品的链接或描述"
                      v-model="submitForm.amazonProductsLink"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="使用“FBA”（亚马逊履行）的国家：" class="requiredItem" prop="fbaCountry">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入使用“FBA”（亚马逊履行）的国家"
                      v-model="submitForm.fbaCountry"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="在荷兰开展业务的初始日期：">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择在荷兰开展业务的初始日期"
                      style="width: 300px"
                      v-model="submitForm.businessInitialTime"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="第一次使用荷兰仓库的日期：">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择第一次使用荷兰仓库的日期"
                      style="width: 300px"
                      v-model="submitForm.warehouseInitialTime"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="预计今年荷兰的应税营业额（欧元）：" class="requiredItem" prop="expectedTaxable">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      type="number"
                      placeholder="请输入预计今年荷兰的应税营业额（欧元）"
                      v-model="submitForm.expectedTaxable"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="预计未来下个财政年度荷兰的应税营业额（欧元）："
                    class="requiredItem"
                    prop="expectedTaxableNext"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      type="number"
                      placeholder="请输入预计未来下个财政年度荷兰的应税营业额（欧元）"
                      v-model="submitForm.expectedTaxableNext"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="B2B/B2C/Both 客户类型：" class="requiredItem" prop="customerType">
                    <RadioGroup v-model="submitForm.customerType">
                      <Radio label="B2B" :disabled="!isCompanyInfoEdit">B2B</Radio>
                      <Radio label="B2C" :disabled="!isCompanyInfoEdit">B2C</Radio>
                      <Radio label="B2B+B2C" :disabled="!isCompanyInfoEdit">B2B+B2C</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="您是否会将商品进口荷兰，谁将作为进口记录的进口商？："
                    class="requiredItem"
                    prop="importerInfo"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=""
                      v-model="submitForm.importerInfo"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="货物从哪里进口？：" class="requiredItem" prop="goodsImportedFrom">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=""
                      v-model="submitForm.goodsImportedFrom"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="商品是在哪里购买的？：" class="requiredItem" prop="goodsPurchased">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=""
                      v-model="submitForm.goodsPurchased"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="亚马逊物流仓储中心在荷兰的名称和地址："
                    class="requiredItem"
                    prop="fbaNetherlandsAddrs"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=""
                      v-model="submitForm.fbaNetherlandsAddrs"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="EORI号码（如果已经有别的欧盟国家的EORI号码，请提供）："
                    class="requiredItem"
                    prop="eoriNumber"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=""
                      v-model="submitForm.eoriNumber"
                      style="width: 300px"
                    />
                  </FormItem>

                  <!-- <FormItem label="完税证明（一年内有效）">
                    <Upload type="drag"
                            :action="fileUpload"
                            :data="{ prefix: '' }"
                            style="width:300px"
                            :disabled='!isCompanyInfoEdit'
                            :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'otherTaxCertificate')}"
                            :on-remove="(file,fileList)=>{removeHandler(file,fileList,'otherTaxCertificate')}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.otherTaxCertificate">
                      <div class="fileBox"
                          v-if="submitForm.otherTaxCertificate!=''">
                        <a target="_blank"
                          @click="previewFile(submitForm.otherTaxCertificate)">
                          {{"完税证明"}}
                          <Icon v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('','','otherTaxCertificate')" />
                        </a>
                      </div>
                    </div>
                  </FormItem> -->
                  <FormItem prop="articlesOfAssociationFile" label="章程及翻译件" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.articlesOfAssociationFile">
                      <div class="fileBox" v-if="submitForm.articlesOfAssociationFile != ''">
                        <a target="_blank" @click="previewFile(submitForm.articlesOfAssociationFile)">
                          {{ "章程及翻译件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'articlesOfAssociationFile')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>银行信息</span>
                  </p>
                  <FormItem label="账号名称：" class="requiredItem" prop="bankAccountName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称/个体户名称"
                      v-model="submitForm.bankAccountName"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="所在地邮编号码：" class="requiredItem" prop="bankAccountAddressPostcode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称/个体户所在地邮编"
                      v-model="submitForm.bankAccountAddressPostcode"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="账户主体地址：" class="requiredItem" prop="bankAccountAddressEn">
                    <Input
                      v-model="submitForm.bankAccountCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.bankAccountCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.bankAccountAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="银行英文名称：" class="requiredItem" prop="bankName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行名称"
                      v-model="submitForm.bankName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" class="requiredItem" prop="bankAccount">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行账户号码"
                      v-model="submitForm.bankAccount"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行BIC：" class="requiredItem" prop="swiftBic">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入银行BIC"
                      v-model="submitForm.swiftBic"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行英文地址：" class="requiredItem" prop="bankAddressEn">
                    <Input
                      v-model="submitForm.bankCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.bankCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.bankAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="  请请输入银行详细英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem prop="bankAccountCertify" label="银行账户证明" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'bankAccountCertify');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'bankAccountCertify');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.bankAccountCertify != ''">
                        <div v-if="submitForm.bankAccountCertify != ''">
                          <a target="_blank" @click="previewFile(submitForm.bankAccountCertify)">
                            {{ "银行账户证明" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'bankAccountCertify')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 奥地利提交资料 -->
            <div v-if="detailInfo.countryCode === 'AT'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="公司类型" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>

                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem label="公司联系电话：" class="requiredItem" prop="companyTel">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司联系邮箱：" class="requiredItem" prop="companyEmail">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司联系邮箱"
                      v-model="submitForm.companyEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司成立时间：" class="requiredItem" prop="companyRegisterData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem
                    label="公司注册资本："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyRegisteredCapital"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司注册资本"
                      v-model="submitForm.companyRegisteredCapital"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem prop="articlesOfAssociationFile" label="章程" class="requiredItem">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.articlesOfAssociationFile">
                      <div class="fileBox" v-if="submitForm.articlesOfAssociationFile != ''">
                        <a target="_blank" @click="previewFile(submitForm.articlesOfAssociationFile)">
                          {{ "章程" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'articlesOfAssociationFile')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人性别：" class="requiredItem" prop="legalPersonSex">
                    <RadioGroup v-model="submitForm.legalPersonSex">
                      <Radio :label="'1'" :disabled="!isCompanyInfoEdit">
                        <span>男</span>
                      </Radio>
                      <Radio :label="'2'" :disabled="!isCompanyInfoEdit">
                        <span>女</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    label="法人身份证号码："
                    v-if="submitForm.certificateType === '1'"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                    (个人店铺必填)
                  </FormItem>
                  <FormItem
                    label="法人护照号码："
                    v-if="submitForm.certificateType === '2'"
                    prop="legalPersonCardPassportNumber"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填护照号码"
                      v-model="submitForm.legalPersonCardPassportNumber"
                      style="width: 300px"
                    />
                  </FormItem>

                  <FormItem label="法人联系电话：" prop="companyLegalPersonMobile" class="requiredItem">
                    <Input
                      v-model="formLeft.companyLegalPersonMobile"
                      placeholder="请输入常用联系手机号"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="法人联系邮箱：" prop="companyLegalPersonEmail" class="requiredItem">
                    <Input
                      v-model="formLeft.companyLegalPersonEmail"
                      placeholder="请输入法人联系邮箱"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" prop="companyLegalPersonCardAddressZh" class="requiredItem">
                    <Input
                      v-model="formLeft.companyLegalPersonCardAddressZh"
                      placeholder="请输入法人身份证中文地址"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <div class="legalPersonSignBox">
                    <Row>
                      <Col span="5">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺名称：" prop="shopName" class="requiredItem">
                    <Input
                      v-model="submitForm.shopName"
                      style="width: 300px"
                      placeholder=" 请输入欧盟站点店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="欧盟站点店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入欧盟站点店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="预计第一年销售额：" class="requiredItem" prop="shopSalePlan">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入预计第一年销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="预计第二年销售额：" class="requiredItem" prop="future2YearSale">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入预计第二年销售额"
                      v-model="submitForm.future2YearSale"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有其他欧盟VAT：" class="requiredItem" prop="isOtherGulfStateDutyOrServices">
                    <RadioGroup v-model="submitForm.isOtherGulfStateDutyOrServices">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.isOtherGulfStateDutyOrServices === '1'"
                    label="其他国家欧盟税号(如有可填写)："
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有欧盟EORI号：" class="requiredItem" prop="isOtherGulfStateDutyOrServices">
                    <RadioGroup v-model="submitForm.isThereEoriNumber">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.isThereEoriNumber === '1'"
                    label="欧盟国EORI号："
                    class="requiredItem"
                    prop="otherEoriNumber"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入欧盟国EORI号"
                      v-model="submitForm.otherEoriNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="仓储地址国家：" class="requiredItem" prop="storageAddressCountry">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入仓储地址国家"
                      v-model="submitForm.storageAddressCountry"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="完税/纳税证明">
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'otherTaxCertificate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'otherTaxCertificate');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.otherTaxCertificate">
                      <div class="fileBox" v-if="submitForm.otherTaxCertificate != ''">
                        <a target="_blank" @click="previewFile(submitForm.otherTaxCertificate)">
                          {{ "完税证明" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'otherTaxCertificate')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>银行信息</span>
                  </p>
                  <FormItem label="账号名称：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称/个体户名称"
                      v-model="submitForm.bankAccountName"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="银行英文名称：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行名称"
                      v-model="submitForm.bankName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="IBAN/银行账户：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行账户号码"
                      v-model="submitForm.bankAccount"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行BIC：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入银行BIC"
                      v-model="submitForm.swiftBic"
                      style="width: 300px"
                    />
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 捷克提交资料 -->
            <div v-if="detailInfo.countryCode === 'CZ'">
              <div class="companyInfo">
                公司信息
                <p class="classTitle">
                  <span></span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form :model="submitForm" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="公司类型" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'3'">境外公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicenseCopy"
                    label="商业登记证/海外证书"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '3'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicenseCopy');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicenseCopy');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicenseCopy">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicenseCopy != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicenseCopy)">
                          商业登记证/海外证书
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicenseCopy')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="公司中文名称：" class="requiredItem" prop="companyNameZh">
                    <AutoComplete
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      :disabled="!isCompanyInfoEdit"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                  </FormItem>
                  <FormItem label="统一信用代码：" class="requiredItem" prop="companyCreditCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <p class="classTitle">
                    <span>法人信息</span>
                  </p>
                  <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">身份证</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardFront"
                    label="法人身份证正面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardFront');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardFront">
                        <div v-if="submitForm.companyLegalPersonCardFront != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                            {{ "法人身份证正面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyLegalPersonCardReverse"
                    label="法人身份证反面扫描件"
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardReverse');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyLegalPersonCardReverse">
                        <div v-if="submitForm.companyLegalPersonCardReverse != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardReverse)">
                            {{ "法人身份证反面扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyLegalPersonCardReverse')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem" prop="companyLegalPersonEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人中文姓名：" class="requiredItem" prop="companyLegalPersonZh">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    label="法人身份证号码："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '1'"
                    prop="companyLegalPersonCard"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                    (个人店铺必填)
                  </FormItem>
                  <FormItem
                    label="法人护照号码："
                    class="requiredItem"
                    v-if="submitForm.certificateType === '2'"
                    prop="legalPersonCardPassportNumber"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填护照号码"
                      v-model="submitForm.legalPersonCardPassportNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="companyLegalPersonCardAddress">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="法人身份证中文地址：" prop="companyLegalPersonCardAddressZh" class="requiredItem">
                    <Input
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      placeholder="请输入法人身份证中文地址"
                      style="width: 300px"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="法人签名：">
                    <div class="legalPersonSignBox">
                      <div class="legalPersonSign">
                        <img
                          v-if="
                            submitForm.companyLegalPersonSign !== '' && submitForm.companyLegalPersonSign !== undefined
                          "
                          :src="submitForm.companyLegalPersonSign"
                          alt=""
                        />
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>店铺信息</span>
                  </p>
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopSalePlatformName">
                      <Radio label="亚马逊" :disabled="!isCompanyInfoEdit">亚马逊</Radio>
                      <Radio label="eBay" :disabled="!isCompanyInfoEdit">eBay</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="submitForm.shopHref"
                      style="width: 300px"
                      placeholder=" 请输入店铺链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem" prop="companyNameEn">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮编号码：" class="requiredItem" prop="companyPostCode">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="未来12个月预计销售额(欧元)：" class="requiredItem" prop="shopSalePlan">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入未来12个月预计销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem" prop="companyAddressEn">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px;margin-bottom:10px;"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：Gaungdong ShenZhen"
                      style="width:148px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" prop="shopTaxEffectiveData">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="描述下公司经营内容：" class="requiredItem" prop="companyBusinessModeDescribe">
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有其他欧盟VAT：" prop="isOtherGulfStateDutyOrServices" class="requiredItem">
                    <RadioGroup v-model="submitForm.isOtherGulfStateDutyOrServices">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.isOtherGulfStateDutyOrServices === '1'"
                    label="VAT增值税号："
                    rop="shopOtherEuTaxNumber"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入VAT增值税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否有欧盟EORI号：" prop="isThereEoriNumber" class="requiredItem">
                    <RadioGroup v-model="submitForm.isThereEoriNumber">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="submitForm.isThereEoriNumber === '1'"
                    label="欧盟国EORI号："
                    prop="otherEoriNumber"
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入欧盟国EORI号"
                      v-model="submitForm.otherEoriNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="是否使用捷克任何仓：" class="requiredItem" prop="useEntrepot">
                    <RadioGroup v-model="submitForm.useEntrepot">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    :prop="submitForm.shopSalePlatformName != '亚马逊' ? 'shopConsoleScreenshot' : ''"
                    :class="{ requiredItem: submitForm.shopSalePlatformName != '亚马逊' }"
                    label="后台店铺截图"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.shopConsoleScreenshot">
                        <div v-if="submitForm.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <p class="classTitle">
                    <span>银行信息</span>
                  </p>
                  <FormItem label="账号名称：" class="requiredItem" prop="bankAccountName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称"
                      v-model="submitForm.bankAccountName"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="银行英文名称：" class="requiredItem" prop="bankName">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行名称"
                      v-model="submitForm.bankName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" class="requiredItem" prop="bankAccount">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行账户号码"
                      v-model="submitForm.bankAccount"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行BIC：" class="requiredItem" prop="swiftBic">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入银行BIC"
                      v-model="submitForm.swiftBic"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行英文地址：" class="requiredItem" prop="bankAddressEn">
                    <Input
                      v-model="submitForm.bankCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px;margin-bottom:10px;"
                    />
                    <Input
                      v-model="submitForm.bankCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;margin-bottom:10px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.bankAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="  请请输入银行详细英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="账户主体地址：" class="requiredItem" prop="bankAccountAddressEn">
                    <Input
                      v-model="submitForm.bankAccountAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司的英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem prop="bankAccountCertify" label="银行账户证明" class="requiredItem">
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'bankAccountCertify');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'bankAccountCertify');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.bankAccountCertify != ''">
                        <div v-if="submitForm.bankAccountCertify != ''">
                          <a target="_blank" @click="previewFile(submitForm.bankAccountCertify)">
                            {{ "银行账户证明" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'bankAccountCertify')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
            <!-- 其他国家 -->
            <div
              v-if="
                detailInfo.countryCode != 'CZ' &&
                  detailInfo.countryCode != 'AT' &&
                  detailInfo.countryCode != 'NL' &&
                  detailInfo.countryCode != 'ES' &&
                  detailInfo.countryCode != 'IT' &&
                  detailInfo.countryCode != 'FR' &&
                  detailInfo.countryCode != 'PL' &&
                  detailInfo.countryCode != 'DE' &&
                  detailInfo.countryCode != 'SA' &&
                  detailInfo.countryCode != 'AE' &&
                  detailInfo.countryCode != 'GB'
              "
            >
              <div class="companyInfo">
                <p class="classTitle">
                  <span>公司信息</span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form ref="formLeft" :rules="formLeftRules" :model="submitForm" :label-width="160">
                  <FormItem label="公司中文名称：" class="requiredItem">
                    <AutoComplete
                      v-if="detailInfo.progressBar === 0"
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                    <Input
                      v-else
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文名称"
                      v-model="submitForm.companyNameZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="公司英文名称：" class="requiredItem">
                    <Input
                      @on-blur="blur(1)"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                    <!-- <span style="color:#EE113D" v-if="!isEng">只能输入英文，如有标点符号请用空格代替</span> -->
                  </FormItem>
                  <FormItem
                    label="公司中文地址："
                    v-if="detailInfo.countryNameZh == '英国' || detailInfo.countryNameZh == '德国'"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文地址"
                      v-model="submitForm.companyAddressZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="公司英文地址：" class="requiredItem">
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '荷兰'" label="公司邮箱：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司邮箱"
                      v-model="submitForm.companyEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh !== '德国' && detailInfo.countryNameZh !== '荷兰'"
                    label="统一信用代码："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入统一信用代码"
                      v-model="submitForm.companyCreditCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '荷兰'" label="公司邮编号码：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司所在地邮编号码"
                      v-model="submitForm.companyPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '荷兰'" label="公司联系电话：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司常用联系电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '荷兰'" label="公司网址(选填)：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司网址"
                      v-model="submitForm.companyWebsite"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="
                      detailInfo.countryNameZh == '英国' ||
                        detailInfo.countryNameZh == '德国' ||
                        detailInfo.countryNameZh == '荷兰'
                    "
                    label="公司成立时间："
                    class="requiredItem"
                  >
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择公司成立时间"
                      style="width: 300px"
                      v-model="submitForm.companyRegisterData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '法国'" label="公司注册资本：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司注册资本"
                      v-model="submitForm.companyRegisteredCapital"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="
                      detailInfo.countryNameZh == '德国' ||
                        detailInfo.countryNameZh == '意大利' ||
                        detailInfo.countryNameZh == '法国'
                    "
                    label="公司电话："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司电话"
                      v-model="submitForm.companyTel"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="公司邮政编号：" class="requiredItem" v-if="detailInfo.countryNameZh == '法国'">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司邮政编号"
                      v-model="submitForm.companyPostCode"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '德国' || detailInfo.countryNameZh == '意大利'"
                    label="公司邮箱："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司邮箱"
                      v-model="submitForm.companyEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == 'AA'" label="公司营业执照注册城市：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder=" 请填写中文，如深圳市"
                      v-model="submitForm.companyRegisteredCityZh"
                      style="width: 150px"
                    />
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填写英文，如ShenZhen"
                      v-model="submitForm.companyRegisteredCityEn"
                      style="width: 150px"
                    />
                  </FormItem>
                  <FormItem label="公司邮政编号：" v-if="detailInfo.countryNameZh == 'AA'">
                    <Input
                      v-model="submitForm.companyPostCode"
                      placeholder="请输入公司注册地邮编号"
                      class="requiredItem"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <div v-if="detailInfo.countryNameZh == 'AA'">
                    <FormItem label="是否有股权占比25%以上的股东：" class="requiredItem">
                      <RadioGroup v-model="stockGreaterThan25">
                        <Radio label="0" :disabled="!isCompanyInfoEdit">是</Radio>
                        <Radio label="1" :disabled="!isCompanyInfoEdit">否，没有</Radio>
                      </RadioGroup>
                    </FormItem>
                    <div v-for="(item, index) in sharesList" :key="index" v-if="stockGreaterThan25 == '0'">
                      <FormItem label="股东姓名：" prop="shareholderZhName" class="requiredItem">
                        <Input
                          v-model="item.shareholderZhName"
                          placeholder="中文名"
                          :disabled="!isCompanyInfoEdit"
                          style="width:148px;"
                        ></Input>
                        <Input
                          v-model="item.shareholderEnName"
                          placeholder="英文名"
                          :disabled="!isCompanyInfoEdit"
                          style="width:148px;margin-left:10px;"
                        ></Input>
                      </FormItem>
                      <FormItem label="股东身份证号码：" prop="identityCard" class="requiredItem">
                        <Input
                          v-model="item.identityCard"
                          style="width:300"
                          placeholder="请输入大股东身份证号码"
                          :disabled="!isCompanyInfoEdit"
                        ></Input>
                      </FormItem>
                    </div>
                  </div>
                </Form>
              </div>
              <div class="legalPersonInfo" v-if="detailInfo.countryNameZh == '荷兰'">
                <p class="classTitle">
                  <span>银行信息</span>
                </p>
                <Form ref="submitForm" :model="submitForm" :label-width="160">
                  <FormItem label="账号名称：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称/个体户名称"
                      v-model="submitForm.bankAccountName"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="所在地邮编号码：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户公司名称/个体户所在地邮编"
                      v-model="submitForm.bankAccountAddressPostcode"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="账户主体地址：" class="requiredItem">
                    <Input
                      v-model="submitForm.bankAccountCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.bankAccountCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.bankAccountAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="银行英文名称：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行名称"
                      v-model="submitForm.bankName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入开户银行账户号码"
                      v-model="submitForm.bankAccount"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行BIC：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入银行BIC"
                      v-model="submitForm.swiftBic"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="银行英文地址：" class="requiredItem">
                    <Input
                      v-model="submitForm.bankCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.bankCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.bankAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="  请请输入银行详细英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                </Form>
              </div>
              <div class="legalPersonInfo">
                <p class="classTitle">
                  <span>法人信息</span>
                </p>
                <Form ref="submitForm" :model="submitForm" :label-width="160">
                  <FormItem
                    label="法人中文姓名："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh == '英国' || detailInfo.countryNameZh == '德国'"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人中文姓名"
                      v-model="submitForm.companyLegalPersonZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem label="法人英文姓名：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文姓名"
                      v-model="submitForm.companyLegalPersonEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="法人出生日期："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh !== '西班牙' && detailInfo.countryNameZh !== '荷兰'"
                  >
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '德国'" label="法人身份证地址：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '荷兰'" label="法人身份证地址：" class="requiredItem">
                    <Input
                      v-model="submitForm.personCardAddressCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.personCardAddressCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.personCardAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人身份证详细英文地址"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == 'AA'" label="法人身份证地址：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证地址"
                      v-model="submitForm.companyLegalPersonCardAddressZh"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="
                      detailInfo.countryNameZh == '意大利' ||
                        detailInfo.countryNameZh == '西班牙' ||
                        detailInfo.countryNameZh == '法国' ||
                        detailInfo.countryNameZh == '波兰'
                    "
                    label="法人身份证英文地址："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入身份证英文地址"
                      v-model="submitForm.companyLegalPersonCardAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '波兰'" label="法人出生地：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人出生地"
                      v-model="submitForm.companyLegalPersonBirthplace"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '英国' || detailInfo.countryNameZh == '意大利'"
                    label="法人出生地："
                    class="requiredItem"
                  >
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.companyLegalPersonBirthplace"
                      placeholder="请选择法人出生地"
                      class="requiredItem"
                    >
                      <Option v-for="(item, index) in placeList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                  </FormItem>

                  <FormItem
                    label="法人联系邮箱："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh == '英国' || detailInfo.countryNameZh == '德国'"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人联系邮箱"
                      v-model="submitForm.companyLegalPersonEmail"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="法人护照/身份证号码："
                    v-if="
                      detailInfo.countryNameZh !== '德国' &&
                        detailInfo.countryNameZh != '法国' &&
                        detailInfo.countryNameZh != '荷兰'
                    "
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人护照/身份证号码"
                      v-model="submitForm.companyLegalPersonCard"
                      style="width: 300px"
                    />
                    (个人店铺必填)
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '德国'" label="法人电话：">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人电话"
                      v-model="submitForm.companyLegalPersonMobile"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="婚姻状况：" class="requiredItem" v-if="detailInfo.countryNameZh == 'AA'">
                    <RadioGroup v-model="submitForm.legalPersonMaritalStatus">
                      <Radio :label="2" :disabled="!isCompanyInfoEdit">
                        <span>已婚</span>
                      </Radio>
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>未婚</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="法人性别：" class="requiredItem" v-if="detailInfo.countryNameZh == '法国'">
                    <RadioGroup v-model="submitForm.legalPersonSex">
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>男</span>
                      </Radio>
                      <Radio :label="2" :disabled="!isCompanyInfoEdit">
                        <span>女</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '西班牙'" label="法人出生省份：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入中文，如：广东"
                      v-model="submitForm.legalPersonBirthplaceProvinceZh"
                      style="width: 150px"
                    />
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入英文，如：GuangDong"
                      v-model="submitForm.legalPersonBirthplaceProvinceEn"
                      style="width: 150px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == 'AA'" label="法人出生城市：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入中文，如：深圳"
                      v-model="submitForm.legalPersonBirthplaceCityZh"
                      style="width: 150px"
                    />
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入英文，如：ShenZhen"
                      v-model="submitForm.legalPersonBirthplaceCityEn"
                      style="width: 150px"
                    />
                  </FormItem>
                  <FormItem
                    label="法人出生地邮编号码："
                    v-if="
                      detailInfo.countryNameZh == '法国' ||
                        detailInfo.countryNameZh == '德国' ||
                        detailInfo.countryNameZh == '荷兰'
                    "
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请填写法人出生地邮政编号"
                      v-model="submitForm.legalPersonPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <div v-if="detailInfo.countryNameZh == '法国'">
                    <FormItem label="身份证/护照号码：">
                      <Input
                        :disabled="!isCompanyInfoEdit"
                        placeholder="请填身份证号码"
                        v-model="submitForm.companyLegalPersonCard"
                        style="width: 300px"
                      />
                      <Input
                        :disabled="!isCompanyInfoEdit"
                        placeholder="请填护照号码"
                        v-model="submitForm.legalPersonCardPassportNumber"
                        style="width: 300px"
                      />
                    </FormItem>
                    <FormItem label="法人出生省份：">
                      <Input
                        :disabled="!isCompanyInfoEdit"
                        placeholder="请输入法人出生省份"
                        v-model="submitForm.legalPersonBirthplaceProvinceZh"
                        style="width: 300px"
                      />
                    </FormItem>
                  </div>
                </Form>
              </div>
              <div class="shopInfo">
                <p class="classTitle">
                  <span>店铺信息</span>
                </p>
                <Form ref="submitForm" :model="submitForm" :label-width="180">
                  <FormItem
                    label="平台店铺链接："
                    class="requiredItem"
                    v-if="
                      detailInfo.countryNameZh == '德国' ||
                        detailInfo.countryNameZh == '意大利' ||
                        detailInfo.countryNameZh == '西班牙' ||
                        detailInfo.countryNameZh == '法国'
                    "
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入平台店铺链接"
                      v-model="submitForm.shopHref"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    label="平台店铺名称："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh == '德国' || detailInfo.countryNameZh == '意大利'"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入平台店铺名称"
                      v-model="submitForm.shopName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem label="申报周期：" class="requiredItem" v-if="detailInfo.countryNameZh == '意大利'">
                    <Select
                      style="width:300px;"
                      :disabled="!isCompanyInfoEdit"
                      clearable
                      v-model="submitForm.declareRule"
                      placeholder="请选择申报周期"
                      class="requiredItem"
                    >
                      <Option value="0">月度申报</Option>
                      <Option value="1">季度申报</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="税号生效日期：" class="requiredItem" v-if="detailInfo.countryNameZh != '西班牙'">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      type="date"
                      placeholder="请选择税号生效日期"
                      style="width: 300px"
                      v-model="submitForm.shopTaxEffectiveData"
                    ></DatePicker>
                  </FormItem>
                  <FormItem
                    label="销售平台名称："
                    class="requiredItem"
                    v-if="
                      detailInfo.countryNameZh != '意大利' &&
                        detailInfo.countryNameZh != '西班牙' &&
                        detailInfo.countryNameZh != '法国' &&
                        detailInfo.countryNameZh != '波兰' &&
                        detailInfo.countryNameZh != '荷兰'
                    "
                  >
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
                  <FormItem
                    v-if="detailInfo.countryNameZh == '德国'"
                    label="今年预计销售额(欧元)："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入今年预计销售额"
                      v-model="submitForm.shopPredictSale"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '德国'"
                    label="明年预计销售额(欧元)："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入明年预计销售额"
                      v-model="submitForm.shopNextYearSale"
                      style="width: 300px"
                    />
                  </FormItem>
                  <!-- <FormItem v-if="detailInfo.countryNameZh!=='德国'" label="平台销售账号用户名：" class="requiredItem">
                                        <Input v-model="submitForm.shopSalePlatformAccount" :disabled="!isCompanyInfoEdit" style="width: 300px;" placeholder="请输入平台销售账号用户名" />
                                        (即店铺/公司英文名)
                                    </FormItem> -->
                  <FormItem
                    label="描述下公司经营内容："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh != '西班牙'"
                  >
                    <Input
                      type="textarea"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入经营内容"
                      v-model="submitForm.companyBusinessModeDescribe"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '英国'"
                    label="未来12个月预计销售额(英镑)："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入未来12个月预计销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '波兰'"
                    label="未来12个月预计销售额(欧元)："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入未来12个月预计销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="邮编号码："
                    class="requiredItem"
                    v-if="
                      detailInfo.countryNameZh != '意大利' &&
                        detailInfo.countryNameZh != '法国' &&
                        detailInfo.countryNameZh != '西班牙' &&
                        detailInfo.countryNameZh != '波兰' &&
                        detailInfo.countryNameZh != '荷兰'
                    "
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请复制店铺后台的邮编号码"
                      v-model="submitForm.shopPostCode"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '德国' || detailInfo.countryNameZh == '波兰'"
                    label="其他国家欧盟税号(如有可填写)："
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '德国'" label="德国仓库地址：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入德国仓库地址"
                      v-model="submitForm.shopEntrepotAddress"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '德国'" label="物流承运商地址：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入物流承运商地址"
                      v-model="submitForm.shopLogisticsCompany"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '德国'" label="物流承运商公司名称：" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入物流承运商公司名称"
                      v-model="submitForm.shopLogisticsCompanyName"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == '英国'" label="税率：" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopTaxRate">
                      <Radio :label="0" :disabled="!isCompanyInfoEdit">
                        <span>低税率</span>
                      </Radio>
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>标准税率</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="是否已有EORI号："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh != '西班牙' && detailInfo.countryNameZh != '荷兰'"
                  >
                    <RadioGroup v-model="submitForm.needEoriNumber">
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio :label="0" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '意大利'"
                    label="货物进口及配送流程："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入货物进口及配送流程"
                      type="textarea"
                      v-model="submitForm.shippingProcess"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="是否使用意大利仓库："
                    v-if="detailInfo.countryNameZh == '意大利'"
                    class="requiredItem"
                  >
                    <RadioGroup v-model="submitForm.useEntrepot">
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio :label="2" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="是否开通泛欧："
                    class="requiredItem"
                    v-if="
                      detailInfo.countryNameZh != '西班牙' &&
                        detailInfo.countryNameZh != '波兰' &&
                        detailInfo.countryNameZh != '荷兰'
                    "
                  >
                    <RadioGroup v-model="submitForm.dredgeEuronext">
                      <Radio :label="2" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>否</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="是否有店铺后台截图：" class="requiredItem" v-if="detailInfo.countryNameZh == '英国'">
                    <RadioGroup v-model="submitForm.isShopConsoleScreenshot">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">
                        <span>有截图</span>
                      </Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">
                        <span>无截图</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '法国'"
                    label="未来一年预计销售额(欧元)："
                    class="requiredItem"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入未来一年预计销售额"
                      v-model="submitForm.shopSalePlan"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    v-if="detailInfo.countryNameZh == '意大利' || detailInfo.countryNameZh == '法国'"
                    label="是否有欧盟其他国家税号："
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如有可填写"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem v-if="detailInfo.countryNameZh == 'AA'" label="西班牙本地银行账户信息" class="requiredItem">
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="西班牙本地银行账户信息"
                      v-model="submitForm.localBankAccountInfo"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="是否使用西班牙任何仓库："
                    class="requiredItem"
                    v-if="detailInfo.countryNameZh == 'AA'"
                  >
                    <RadioGroup v-model="submitForm.useEntrepot">
                      <Radio :label="1" :disabled="!isCompanyInfoEdit">
                        <span>是</span>
                      </Radio>
                      <Radio :label="2" :disabled="!isCompanyInfoEdit">
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
                    (以下两种请至少上传一种：公司营业执照扫描件 /
                    商业登记证BR扫描件、公司注册证明书CI扫描件、法团成立表格NNC1扫描件)
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
                        :disabled="!isCompanyInfoEdit"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyBusinessLicense');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyBusinessLicense');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.companyBusinessLicense">
                        <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                            {{ "营业执照" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                            />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row v-if="detailInfo.countryNameZh != '荷兰'">
                    <Col span="6">
                      <p class="titleItem">商业登记证BR扫描件:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.companyBusinessRegistrationBr">
                        <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                          <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                            {{ "商业登记证BR扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                            />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row v-if="detailInfo.countryNameZh != '荷兰'">
                    <Col span="6">
                      <p class="titleItem">公司注册证明书CI扫描件:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        ref="CIFILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyRegistrationCi');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyRegistrationCi');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.companyRegistrationCi">
                        <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                            {{ "公司注册证明书CI扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                            />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row v-if="detailInfo.countryNameZh != '荷兰'">
                    <Col span="6">
                      <p class="titleItem">法团成立表格NNC1扫描件:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.companyCorporateFoundingNnc1">
                          <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                            <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                              {{ "法团成立表格NNC1扫描件" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row v-if="detailInfo.countryNameZh === '荷兰'">
                    <Col span="6">
                      <p class="titleItem">银行账户证明:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        ref="NNC1FILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'bankAccountCertify');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'bankAccountCertify');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.bankAccountCertify">
                          <div v-if="submitForm.bankAccountCertify != ''">
                            <a target="_blank" @click="previewFile(submitForm.bankAccountCertify)">
                              {{ "银行账户证明" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'bankAccountCertify')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div class="companyFile">
                    <p v-if="detailInfo.countryNameZh == '英国'" class="classifyTitleBox">
                      <span class="classifyTitle">法人信息文件</span>
                      (以下两种请至少上传一种：法人身份证扫描件正反面/ 法人护照扫描件)
                    </p>
                    <p
                      v-if="
                        detailInfo.countryNameZh == '德国' ||
                          detailInfo.countryNameZh == '意大利' ||
                          detailInfo.countryNameZh == '西班牙' ||
                          detailInfo.countryNameZh == '法国'
                      "
                      class="classifyTitleBox"
                    >
                      <span class="classifyTitle">法人信息文件</span>
                      (以下两种请至少上传一种：1.法人身份证扫描件正反面/ 2.法人护照扫描件)
                    </p>
                  </div>
                </div>
                <div
                  class="shopCut"
                  v-if="
                    detailInfo.countryNameZh == '德国' ||
                      detailInfo.countryNameZh == '英国' ||
                      detailInfo.countryNameZh == '意大利' ||
                      detailInfo.countryNameZh == '西班牙' ||
                      detailInfo.countryNameZh == '法国' ||
                      detailInfo.countryNameZh == '波兰' ||
                      detailInfo.countryNameZh == '荷兰'
                  "
                >
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
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyLegalPersonCardFront');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyLegalPersonCardFront');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.companyLegalPersonCardFront">
                          <div v-if="submitForm.companyLegalPersonCardFront != ''">
                            <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardFront)">
                              {{ "法人身份证正反面扫描件" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'companyLegalPersonCardFront')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <!-- <Row v-if="detailInfo.countryNameZh=='德国'">
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
                                    </Row> -->
                  <Row v-if="detailInfo.countryNameZh !== '荷兰'">
                    <Col span="6">
                      <p class="titleItem">法人护照扫描件:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        ref="passportFILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.companyLegalPersonCardPassport">
                          <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                            <a target="_blank" @click="previewFile(submitForm.companyLegalPersonCardPassport)">
                              {{ "法人护照扫描件" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row v-if="detailInfo.countryNameZh == '英国'">
                    <Col span="6">
                      <p class="titleItem">驾驶证:</p>
                    </Col>
                    <Col span="18">
                      <Upload
                        ref="passportFILE"
                        type="drag"
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'driverLicense');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'driverLicense');
                          }
                        "
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                        :show-upload-list="false"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.driverLicense">
                          <div v-if="submitForm.driverLicense != ''">
                            <a target="_blank" @click="previewFile(submitForm.driverLicense)">
                              {{ "法人驾驶证" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'driverLicense')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div
                    class="otherFileBox"
                    v-if="detailInfo.countryNameZh == '英国' && submitForm.isShopConsoleScreenshot === '2'"
                  >
                    <p class="classifyTitleBox">
                      <span class="classifyTitle">店铺后台确认函</span>
                    </p>
                    <Row>
                      <Col span="6">
                        <p class="titleItem">确认函:</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          ref="NNC1FILE"
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'shopConsoleConfirmationLetter');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'shopConsoleConfirmationLetter');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.shopConsoleConfirmationLetter">
                            <div v-if="submitForm.shopConsoleConfirmationLetter != ''">
                              <a target="_blank" @click="previewFile(submitForm.shopConsoleConfirmationLetter)">
                                {{ "确认函" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'certificateOfEmployment')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="otherFileBox"
                    v-if="detailInfo.countryNameZh == '英国' && submitForm.isShopConsoleScreenshot === '2'"
                  >
                    <p class="classifyTitleBox">
                      <span class="classifyTitle">其他证明文件</span>
                      (以下七种资料请至少选择一种上传)
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'certificateOfEmployment');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'certificateOfEmployment');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.certificateOfEmployment">
                            <div v-if="submitForm.certificateOfEmployment != ''">
                              <a target="_blank" @click="previewFile(submitForm.certificateOfEmployment)">
                                {{ "工作证明" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'certificateOfEmployment')"
                                />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'leaseAgreement');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'leaseAgreement');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.leaseAgreement">
                            <div v-if="submitForm.leaseAgreement != ''">
                              <a target="_blank" @click="previewFile(submitForm.leaseAgreement)">
                                {{ "租房合同" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'leaseAgreement')"
                                />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'marriageLicense');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'marriageLicense');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.marriageLicense">
                            <div v-if="submitForm.marriageLicense != ''">
                              <a target="_blank" @click="previewFile(submitForm.marriageLicense)">
                                {{ "结婚证" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'marriageLicense')"
                                />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'divorceCertificate');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'divorceCertificate');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.divorceCertificate">
                            <div v-if="submitForm.divorceCertificate != ''">
                              <a target="_blank" @click="previewFile(submitForm.divorceCertificate)">
                                {{ "离婚证" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'divorceCertificate')"
                                />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'houseProprietaryCertificate');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'houseProprietaryCertificate');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox" v-if="submitForm.houseProprietaryCertificate">
                          <div v-if="submitForm.houseProprietaryCertificate != ''">
                            <a target="_blank" @click="previewFile(submitForm.houseProprietaryCertificate)">
                              {{ "房产证" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'houseProprietaryCertificate')"
                              />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'birthCertificate');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'birthCertificate');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox" v-if="submitForm.birthCertificate">
                          <div v-if="submitForm.birthCertificate != ''">
                            <a target="_blank" @click="previewFile(submitForm.birthCertificate)">
                              {{ "出身证/户口本" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'birthCertificate')"
                              />
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
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'otherCertificate');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'otherCertificate');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox" v-if="submitForm.otherCertificate">
                          <div v-if="submitForm.otherCertificate != ''">
                            <a target="_blank" @click="previewFile(submitForm.otherCertificate)">
                              {{ "其他证明" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'otherCertificate')"
                              />
                            </a>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="shopCut"
                    v-if="
                      detailInfo.countryNameZh == '德国' ||
                        detailInfo.countryNameZh == '法国' ||
                        detailInfo.countryNameZh == '英国' ||
                        detailInfo.countryNameZh == '波兰'
                    "
                  >
                    <p class="classifyTitleBox" v-if="submitForm.isShopConsoleScreenshot === '1'">
                      <span class="classifyTitle">后台店铺截图</span>
                    </p>
                    <Row v-if="submitForm.isShopConsoleScreenshot === '1'">
                      <Col span="6">
                        <p class="titleItem">后台店铺截图：</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          ref="NNC1FILE"
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'shopConsoleScreenshot');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'shopConsoleScreenshot');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.shopConsoleScreenshot">
                            <div v-if="submitForm.shopConsoleScreenshot != ''">
                              <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                                {{ "后台店铺截图" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div class="shopCut" v-if="detailInfo.countryNameZh == '德国'">
                    <p class="classifyTitleBox">
                      <span class="classifyTitle">仓储地址截图</span>
                    </p>
                    <Row>
                      <Col span="6">
                        <p class="titleItem">仓储地址截图：</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          ref="NNC1FILE"
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'storageAddressImg');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'storageAddressImg');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.storageAddressImg">
                            <div v-if="submitForm.storageAddressImg != ''">
                              <a target="_blank" @click="previewFile(submitForm.storageAddressImg)">
                                {{ "仓储地址截图" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'storageAddressImg')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div v-if="detailInfo.countryNameZh == '意大利' || detailInfo.countryNameZh == '西班牙'">
                    <Row>
                      <Col span="6">
                        <p class="titleItem">公司信用报告：</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          ref="NNC1FILE"
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'companyCreditReport');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'companyCreditReport');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.companyCreditReport">
                            <div v-if="submitForm.companyCreditReport != ''">
                              <a target="_blank" @click="previewFile(submitForm.companyCreditReport)">
                                {{ "公司信用报告" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'companyCreditReport')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <!-- <Row v-if="detailInfo.countryNameZh=='意大利'">
                                            <Col span="6">
                                                <p class="titleItem">注册授权书：</p>
                                            </Col>
                                            <Col span="18">
                                                <Upload
                                                    ref="NNC1FILE"
                                                    type="drag"
                                                    :action="fileUpload"
                                                    :data="{ prefix: '' }"
                                                    :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'registrationAuthorization')}"
                                                    :on-remove="(file,fileList)=>{removeHandler(file,fileList,'registrationAuthorization')}"
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
                                                    <div v-if="submitForm.registrationAuthorization">
                                                        <div v-if="submitForm.registrationAuthorization!=''">
                                                            <a target="_blank" @click="previewFile(submitForm.registrationAuthorization)">
                                                                {{"注册授权书"}}<Icon v-if="isCompanyInfoEdit" type="ios-close-circle" @click.stop="removeHandler('','','registrationAuthorization')"/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row> -->
                  </div>
                  <div class="shopCut" v-if="detailInfo.countryNameZh == 'AA' || detailInfo.countryNameZh == '西班牙'">
                    <Row>
                      <Col span="6">
                        <p class="titleItem">亚马逊证明文件：</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'amazonProveFile');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'amazonProveFile');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.amazonProveFile">
                            <div v-if="submitForm.amazonProveFile != ''">
                              <a target="_blank" @click="previewFile(submitForm.amazonProveFile)">
                                {{ "亚马逊证明文件" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'amazonProveFile')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="shopCut"
                    v-if="detailInfo.countryNameZh == '波兰' || detailInfo.countryNameZh == '西班牙'"
                  >
                    <Row>
                      <Col span="6">
                        <p class="titleItem">其他欧盟税号文件：</p>
                      </Col>
                      <Col span="18">
                        <Upload
                          type="drag"
                          :action="fileUpload"
                          :data="{ prefix: '' }"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'vatTaxEuFile');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'vatTaxEuFile');
                            }
                          "
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          style="width:300px"
                          :disabled="!isCompanyInfoEdit"
                          :show-upload-list="false"
                        >
                          <div style="padding: 10px 0">
                            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                            <span>请拖拽文件到此区域上传或点击上传</span>
                          </div>
                        </Upload>
                        <div class="fileBox">
                          <div v-if="submitForm.vatTaxEuFile">
                            <div v-if="submitForm.vatTaxEuFile != ''">
                              <a target="_blank" @click="previewFile(submitForm.vatTaxEuFile)">
                                {{ "其他欧盟税号文件" }}
                                <Icon
                                  v-if="isCompanyInfoEdit"
                                  type="ios-close-circle"
                                  @click.stop="removeHandler('', '', 'vatTaxEuFile')"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="legalPersonSignBox"
                    v-if="
                      detailInfo.countryCode === 'GB' ||
                        detailInfo.countryCode === 'DE' ||
                        detailInfo.countryCode === 'ES' ||
                        detailInfo.countryCode === 'PL' ||
                        detailInfo.countryCode === 'NL'
                    "
                  >
                    <Row>
                      <Col span="6">
                        <p class="titleItem">法人签名:</p>
                      </Col>
                      <Col span="18">
                        <div class="legalPersonSign">
                          <img
                            v-if="
                              submitForm.companyLegalPersonSign !== '' &&
                                submitForm.companyLegalPersonSign !== undefined
                            "
                            :src="submitForm.companyLegalPersonSign"
                            alt=""
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p class="fileBtn" v-if="isCompanyInfoEdit">
                    <Button
                      type="primary"
                      ghost
                      v-if="detailInfo.progressBar == 0"
                      @click="saveFile"
                      style="margin-right: 10px;"
                      :loading="saveLoading"
                    >
                      保存
                    </Button>
                    <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                  </p>
                </div>
              </div>
            </div>
            <!-- 沙特提交资料 -->
            <div v-if="detailInfo.countryCode == 'SA'">
              <div class="companyInfo">
                公司信息
                <span
                  style="float:right;cursor;"
                  v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                  @click="isCompanyInfoEdit = true"
                >
                  【修改】
                </span>
              </div>
              <Form :model="formLeft" :label-width="180" class="formstyle" :rules="formLeftRules" ref="formLeft">
                <FormItem></FormItem>
                <FormItem></FormItem>
                <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                  <RadioGroup v-model="formLeft.shopNature">
                    <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="公司类型" class="requiredItem" prop="companyType">
                  <RadioGroup v-model="formLeft.companyType">
                    <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                    <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem
                  prop="companyBusinessLicense"
                  label="公司营业执照"
                  class="requiredItem"
                  v-if="formLeft.shopNature === '1' && formLeft.companyType === '1'"
                >
                  <Upload
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyBusinessLicense');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyBusinessLicense');
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="formLeft.companyBusinessLicense">
                    <div class="fileBox" v-if="formLeft.companyBusinessLicense != ''">
                      <a target="_blank" @click="previewFile(formLeft.companyBusinessLicense)">
                        {{ "营业执照" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyBusinessRegistrationBr"
                  label="商业登记证BR扫描件"
                  class="requiredItem"
                  v-if="formLeft.shopNature === '1' && formLeft.companyType === '2'"
                >
                  <Upload
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="formLeft.companyBusinessRegistrationBr">
                    <div class="fileBox" v-if="formLeft.companyBusinessRegistrationBr != ''">
                      <a @click="previewFile(formLeft.companyBusinessRegistrationBr)">
                        {{ "商业登记证BR扫描件" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyRegistrationCi"
                  label="公司注册证明书CI扫描件"
                  class="requiredItem"
                  v-if="formLeft.shopNature === '1' && formLeft.companyType === '2'"
                >
                  <Upload
                    ref="CIFILE"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyRegistrationCi');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyRegistrationCi');
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="formLeft.companyRegistrationCi">
                    <div class="fileBox" v-if="formLeft.companyRegistrationCi != ''">
                      <a target="_blank" @click="previewFile(formLeft.companyRegistrationCi)">
                        {{ "公司注册证明书CI扫描件" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyCorporateFoundingNnc1"
                  label="法团成立表格NNC1扫描件"
                  class="requiredItem"
                  v-if="formLeft.shopNature === '1' && formLeft.companyType === '2'"
                >
                  <Upload
                    ref="NNC1FILE"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="formLeft.companyCorporateFoundingNnc1">
                      <div v-if="formLeft.companyCorporateFoundingNnc1 != ''">
                        <a target="_blank" @click="previewFile(formLeft.companyCorporateFoundingNnc1)">
                          {{ "法团成立表格NNC1扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem label="证件类型：" class="requiredItem" prop="certificateType">
                  <RadioGroup v-model="formLeft.certificateType">
                    <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="公司中文名称：" prop="companyNameZh" class="requiredItem">
                  <AutoComplete
                    v-model="formLeft.companyNameZh"
                    :data="lenovoSearchList"
                    @on-select="selectCompany"
                    placeholder="请输入公司中文名称"
                    :disabled="!isCompanyInfoEdit"
                  ></AutoComplete>
                </FormItem>
                <FormItem label="公司英文名称：" prop="companyNameEn" class="requiredItem">
                  <Input
                    v-model="formLeft.companyNameEn"
                    placeholder="需与税号在VIES上面显示的公司名一致"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="公司英文地址：" class="form-item requiredItem" prop="companyAddressEn">
                  <Input
                    type="text"
                    placeholder="如：China"
                    v-model="formLeft.companyAddressEnCountry"
                    :disabled="!isCompanyInfoEdit"
                    style="width:120px;margin-right:15px;"
                  ></Input>
                  <Input
                    type="text"
                    placeholder="复制店铺后台中的城市和省份,空格隔开"
                    v-model="formLeft.companyAddressEnCity"
                    :disabled="!isCompanyInfoEdit"
                    style="width:260px"
                  ></Input>
                  <br />
                  <Input
                    v-model="formLeft.companyAddressEn"
                    type="textarea"
                    placeholder="请直接复制后台英文地址，不包含城市、省份、邮编、国家，如有标点或换行，请用空格替代。"
                    :disabled="!isCompanyInfoEdit"
                    :rows="4"
                    style="width: 400px;margin-left:0;margin-top:20px"
                  ></Input>
                </FormItem>
                <FormItem label="统一社会信用代码：" prop="companyCreditCode" class="requiredItem">
                  <Input
                    v-model="formLeft.companyCreditCode"
                    placeholder=" 请输入营业执照的信用代码"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="公司所在地邮编号码：" prop="companyPostCode" class="requiredItem">
                  <Input
                    v-model="formLeft.companyPostCode"
                    placeholder="请输入常用联系邮箱"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="法人中文名：" prop="companyLegalPersonZh" class="requiredItem">
                  <Input
                    v-model="formLeft.companyLegalPersonZh"
                    placeholder="请填写中文名字"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="法人英文名：" prop="companyLegalPersonEn" class="requiredItem">
                  <Input
                    v-model="formLeft.companyLegalPersonEn"
                    placeholder="请填写英文名字"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="法人出生日期：" prop="companyLegalPersonBirthday" class="requiredItem">
                  <DatePicker
                    type="date"
                    placeholder="请选择法人出生日期"
                    v-model="formLeft.companyLegalPersonBirthday"
                    format="yyyy-MM-dd"
                    class="tax-date"
                    :disabled="!isCompanyInfoEdit"
                  ></DatePicker>
                </FormItem>
                <FormItem label="法人身份证英文地址：" prop="companyLegalPersonCardAddress" class="requiredItem">
                  <Input
                    v-model="formLeft.companyLegalPersonCardAddress"
                    placeholder="请输入法人身份证英文地址"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="法人联系电话：" prop="companyLegalPersonMobile" class="requiredItem">
                  <Input
                    v-model="formLeft.companyLegalPersonMobile"
                    placeholder="请输入常用联系手机号"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="法人联系邮箱：" prop="companyLegalPersonEmail" class="requiredItem">
                  <Input
                    v-model="formLeft.companyLegalPersonEmail"
                    placeholder="请输入法人联系邮箱"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="账户名称：" prop="bankAccountName" class="requiredItem">
                  <Input
                    v-model="formLeft.bankAccountName"
                    placeholder="请输入账户名称"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="银行英文名称：" prop="bankName" class="requiredItem">
                  <Input
                    v-model="formLeft.bankName"
                    placeholder="请输入银行英文名称"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="支行英文名称：" prop="bankSubBranchName" class="requiredItem">
                  <Input
                    v-model="formLeft.bankSubBranchName"
                    placeholder="请输入支行英文名称"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="支行英文地址：" prop="bankAddress" class="requiredItem">
                  <Input
                    v-model="formLeft.bankAddress"
                    placeholder="请输入支行名称"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="IBAN/银行账户：" prop="bankAccount" class="requiredItem">
                  <Input
                    v-model="formLeft.bankAccount"
                    placeholder="请输入IBAN/银行账户"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="Swift / BIC：" prop="swiftBic" class="requiredItem">
                  <Input
                    v-model="formLeft.swiftBic"
                    placeholder="请输入Swift / BIC"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem label="公司股份情况：" prop="companyStockCondition" class="requiredItem">
                  <div class="shares-box" v-for="(item, index) in sharesList" :key="index">
                    <FormItem label="股东姓名：" prop="shareholderZhName" :label-width="110">
                      <Input
                        v-model="item.shareholderZhName"
                        placeholder="中文名"
                        :disabled="!isCompanyInfoEdit"
                        style="width:120px;"
                      ></Input>
                      <Input
                        v-model="item.shareholderEnName"
                        placeholder="英文名"
                        :disabled="!isCompanyInfoEdit"
                        style="width:150px;margin-left:10px;"
                      ></Input>
                    </FormItem>
                    <FormItem label="占股百分比：" prop="stockProportion" :label-width="110" class="requiredItem">
                      <Input
                        v-model="item.stockProportion"
                        placeholder="占股百分比"
                        :disabled="!isCompanyInfoEdit"
                        style="width:285px;"
                      ></Input>
                      %
                    </FormItem>
                    <FormItem label="分红比利：" prop="shareholderBonusScale" :label-width="110" class="requiredItem">
                      <Input
                        v-model="item.shareholderBonusScale"
                        placeholder="分红比利"
                        :disabled="!isCompanyInfoEdit"
                        style="width:285px;"
                      ></Input>
                      %
                    </FormItem>
                    <Button v-if="index > 0 && isCompanyInfoEdit" @click="removeShares(index)">删除</Button>
                  </div>
                  <p class="shares-tips">温馨提示：请详细填写完整的公司股份占比信息；</p>
                  <Button @click="addShares">+添加</Button>
                </FormItem>
                <Divider />
                <div class="title">店铺信息</div>
                <FormItem label="是否已有店铺：" prop="isThereShop" class="requiredItem">
                  <RadioGroup v-model="formLeft.isThereShop">
                    <Radio label="1" :disabled="!isCompanyInfoEdit">已有店铺</Radio>
                    <Radio label="2" :disabled="!isCompanyInfoEdit">无店铺</Radio>
                  </RadioGroup>
                </FormItem>
                <div v-if="formLeft.isThereShop == 1">
                  <FormItem label="店铺所在电商平台:" prop="shopSalePlatformName" class="requiredItem">
                    <RadioGroup v-model="formLeft.shopSalePlatformName">
                      <Radio label="Amazon" :disabled="!isCompanyInfoEdit">Amazon</Radio>
                      <Radio label="Noon" :disabled="!isCompanyInfoEdit">Noon</Radio>
                      <Radio label="Jollychic" :disabled="!isCompanyInfoEdit">Jollychic</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="是否已有销售:" prop="isThereSale" class="requiredItem">
                    <RadioGroup v-model="formLeft.isThereSale">
                      <Radio label="1" :disabled="!isCompanyInfoEdit">是</Radio>
                      <Radio label="2" :disabled="!isCompanyInfoEdit">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="店铺后台链接：" prop="shopHref" class="requiredItem">
                    <Input
                      v-model="formLeft.shopHref"
                      placeholder=" 请输入店铺后台链接"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="电商平台账号完整名称：" prop="shopSalePlatformAccount" class="requiredItem">
                    <Input
                      v-model="formLeft.shopSalePlatformAccount"
                      placeholder=" 请输入电商平台账号完整名称"
                      :disabled="!isCompanyInfoEdit"
                    ></Input>
                  </FormItem>
                  <FormItem label="在沙特前12个月的销售额：" prop="shopSaleBefore" class="requiredItem">
                    <Input
                      v-model="formLeft.shopSaleBefore"
                      placeholder=" 请输入在沙特前12个月的销售额"
                      :disabled="!isCompanyInfoEdit"
                      style="width:300px"
                    ></Input>
                    SAR（币种：沙特里亚尔）
                  </FormItem>
                </div>
                <FormItem label="税号生效日期：" prop="shopTaxEffectiveData" class="requiredItem">
                  <DatePicker
                    type="date"
                    placeholder="请选择税号生效日期"
                    v-model="formLeft.shopTaxEffectiveData"
                    class="tax-date"
                    :disabled="!isCompanyInfoEdit"
                  ></DatePicker>
                </FormItem>
                <FormItem label="预计/实际第一笔订单时间:" prop="firstOrderTime">
                  <DatePicker
                    type="date"
                    placeholder="请选择预计/实际第一笔订单时间"
                    v-model="formLeft.firstOrderTime"
                    class="tax-date"
                    :disabled="!isCompanyInfoEdit"
                  ></DatePicker>
                </FormItem>
                <FormItem label="预计未来30天销售额：" prop="future30Sale" class="requiredItem">
                  <Input
                    v-model="formLeft.future30Sale"
                    placeholder=" 请输入预计未来30天销售额"
                    :disabled="!isCompanyInfoEdit"
                    style="width:300px"
                  ></Input>
                  SAR（币种：沙特里亚尔）
                </FormItem>
                <Divider />
                <div class="title">文件信息</div>

                <FormItem label="法人护照扫描件：" prop="companyLegalPersonCardPassport" class="requiredItem">
                  <Upload
                    type="drag"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                      }
                    "
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    :disabled="!isCompanyInfoEdit"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="formLeft.companyLegalPersonCardPassport">
                      <div v-if="formLeft.companyLegalPersonCardPassport != ''">
                        <a target="_blank" @click="previewFile(formLeft.companyLegalPersonCardPassport)">
                          {{ "法人护照扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  label="其他股东护照/身份证扫描件："
                  prop="companyShareholderPassportCard"
                  class="requiredItem"
                >
                  <Upload
                    type="drag"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyShareholderPassportCard');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyShareholderPassportCard');
                      }
                    "
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    :disabled="!isCompanyInfoEdit"
                  >
                    <div style="padding: 10px 0">
                      <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="formLeft.companyShareholderPassportCard">
                      <div v-if="formLeft.companyShareholderPassportCard != ''">
                        <a target="_blank" @click="previewFile(formLeft.companyShareholderPassportCard)">
                          {{ "其他股东护照/身份证扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyShareholderPassportCard')"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  label="后台店铺截图："
                  prop="shopConsoleScreenshot"
                  class="requiredItem"
                  v-if="formLeft.isThereShop == 1"
                >
                  <div class="upload-file-box">
                    <Upload
                      type="drag"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopConsoleScreenshot');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right:20px"
                      :disabled="!isCompanyInfoEdit"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="formLeft.shopConsoleScreenshot">
                        <div v-if="formLeft.shopConsoleScreenshot != ''">
                          <a target="_blank" @click="previewFile(formLeft.shopConsoleScreenshot)">
                            {{ "后台店铺截图" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem label="销售/零销售证明：" prop="salesEvidenceFile" class="requiredItem">
                  <div class="upload-file-box">
                    <Upload
                      type="drag"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'salesEvidenceFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'salesEvidenceFile');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right:20px"
                      :disabled="!isCompanyInfoEdit"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="formLeft.salesEvidenceFile">
                        <div v-if="formLeft.salesEvidenceFile != ''">
                          <a target="_blank" @click="previewFile(formLeft.salesEvidenceFile)">
                            {{ "销售/零销售证明" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'salesEvidenceFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem label="电商平台协议/合同（选填）：">
                  <div class="upload-file-box">
                    <Upload
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'shopSalePlatformContract');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'shopSalePlatformContract');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :disabled="!isCompanyInfoEdit"
                      type="drag"
                      style="width:300px"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="submitForm.shopSalePlatformContract == ''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="formLeft.shopSalePlatformContract">
                      <a :href="formLeft.shopSalePlatformContract" target="_blank">电商平台协议/合同</a>
                      <Icon
                        v-if="isCompanyInfoEdit"
                        type="ios-close-circle"
                        @click.stop="removeHandler('', '', 'shopSalePlatformContract')"
                      />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="公司章程：" class="requiredItem" prop="articlesOfAssociationFile">
                  <div class="upload-file-box">
                    <Upload
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'articlesOfAssociationFile');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :disabled="!isCompanyInfoEdit"
                      type="drag"
                      style="width:300px"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="formLeft.articlesOfAssociationFile == ''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="formLeft.articlesOfAssociationFile != ''">
                      <a :href="formLeft.articlesOfAssociationFile" target="_blank">公司章程</a>
                      <Icon
                        v-if="isCompanyInfoEdit"
                        type="ios-close-circle"
                        @click.stop="removeHandler('', '', 'articlesOfAssociationFile')"
                      />
                    </div>
                  </div>
                </FormItem>
                <FormItem label="其它中东国家税号文件（选填）：">
                  <div class="upload-file-box">
                    <Upload
                      type="drag"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxEuFile');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right:20px"
                      :disabled="!isCompanyInfoEdit"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="formLeft.vatTaxEuFile">
                        <div v-if="formLeft.vatTaxEuFile != ''">
                          <a target="_blank" @click="previewFile(formLeft.vatTaxEuFile)">
                            {{ "其它中东国家税号文件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'vatTaxEuFile')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormItem>
              </Form>
              <p class="fileBtn" v-if="isCompanyInfoEdit">
                <Button
                  type="primary"
                  ghost
                  v-if="detailInfo.progressBar == 0"
                  @click="saveFile"
                  style="margin-right: 10px;"
                  :loading="saveLoading"
                >
                  保存
                </Button>
                <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
              </p>
            </div>
            <!-- 阿联酋提交资料 -->
            <div v-if="detailInfo.countryCode == 'AE'">
              <div class="companyInfo">
                <p class="classTitle">
                  <span>公司信息</span>
                  <span
                    v-if="detailInfo.progressBar == 0 || detailInfo.progressBar == 8 || detailInfo.progressBar == 1"
                    @click="isCompanyInfoEdit = true"
                  >
                    【修改】
                  </span>
                </p>
                <Form ref="formLeft" :model="submitForm" :rules="formLeftRules" :label-width="160">
                  <FormItem></FormItem>
                  <FormItem></FormItem>
                  <FormItem label="开店主体：" prop="shopNature" class="requiredItem">
                    <RadioGroup v-model="submitForm.shopNature">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">公司主体（含个体工商户）</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="公司类型" class="requiredItem" prop="companyType">
                    <RadioGroup v-model="submitForm.companyType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'1'">大陆公司</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">香港公司</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessLicense"
                    label="公司营业执照"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '1'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessLicense');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessLicense">
                      <div class="fileBox" v-if="submitForm.companyBusinessLicense != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyBusinessLicense)">
                          {{ "营业执照" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessLicense')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyBusinessRegistrationBr"
                    label="商业登记证BR扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyBusinessRegistrationBr');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyBusinessRegistrationBr">
                      <div class="fileBox" v-if="submitForm.companyBusinessRegistrationBr != ''">
                        <a @click="previewFile(submitForm.companyBusinessRegistrationBr)">
                          {{ "商业登记证BR扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyBusinessRegistrationBr')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyRegistrationCi"
                    label="公司注册证明书CI扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="CIFILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyRegistrationCi');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyRegistrationCi">
                      <div class="fileBox" v-if="submitForm.companyRegistrationCi != ''">
                        <a target="_blank" @click="previewFile(submitForm.companyRegistrationCi)">
                          {{ "公司注册证明书CI扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('', '', 'companyRegistrationCi')"
                          />
                        </a>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    prop="companyCorporateFoundingNnc1"
                    label="法团成立表格NNC1扫描件"
                    class="requiredItem"
                    v-if="submitForm.shopNature === '1' && submitForm.companyType === '2'"
                  >
                    <Upload
                      ref="NNC1FILE"
                      type="drag"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyCorporateFoundingNnc1');
                        }
                      "
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      style="width:300px"
                      :disabled="!isCompanyInfoEdit"
                      :show-upload-list="false"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span>请拖拽文件到此区域上传或点击上传</span>
                      </div>
                    </Upload>
                    <div class="fileBox">
                      <div v-if="submitForm.companyCorporateFoundingNnc1">
                        <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                          <a target="_blank" @click="previewFile(submitForm.companyCorporateFoundingNnc1)">
                            {{ "法团成立表格NNC1扫描件" }}
                            <Icon
                              v-if="isCompanyInfoEdit"
                              type="ios-close-circle"
                              @click.stop="removeHandler('', '', 'companyCorporateFoundingNnc1')"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="公司中文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameZh"
                  >
                    <AutoComplete
                      v-if="detailInfo.progressBar === 0"
                      v-model="submitForm.companyNameZh"
                      :data="lenovoSearchList"
                      @on-select="selectCompany"
                      style="width:300px;"
                      placeholder="请输入公司中文名称"
                    ></AutoComplete>
                    <Input
                      v-else
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司中文名称"
                      v-model="submitForm.companyNameZh"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    label="公司英文名称："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyNameEn"
                  >
                    <Input
                      @on-blur="blur(1)"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入公司英文名称"
                      v-model="submitForm.companyNameEn"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="公司英文地址："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyAddressEn"
                  >
                    <Input
                      v-model="submitForm.companyAddressEnCountry"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.companyAddressEnCity"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.companyAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请直接复制店铺后台英文地址，如有换行，请用空格代替"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="公司邮政编码：" v-if="submitForm.shopNature === '1'" prop="companyPostCode">
                    <Input
                      v-model="submitForm.companyPostCode"
                      placeholder="请输入邮政编码"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="社会统一信用代码：" v-if="submitForm.shopNature === '1'" prop="companyCreditCode">
                    <Input
                      v-model="submitForm.companyCreditCode"
                      placeholder="请输入邮政编码"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="公司联系电话：" v-if="submitForm.shopNature === '1'" prop="companyTel">
                    <Input
                      v-model="submitForm.companyTel"
                      placeholder="请输入常用联系手机号"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem
                    label="描述下公司经营内容："
                    v-if="submitForm.shopNature === '1'"
                    class="requiredItem"
                    prop="companyBusinessModeDescribe"
                  >
                    <Input
                      v-model="submitForm.companyBusinessModeDescribe"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入英文描述经营内容"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem
                    label="公司联系邮箱："
                    v-if="submitForm.shopNature === '1'"
                    prop="companyEmail"
                    class="requiredItem"
                  >
                    <Input
                      v-model="formLeft.companyEmail"
                      placeholder="请输入常用联系邮箱"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="银行账户名称：" prop="bankAccountName" class="requiredItem">
                    <Input
                      v-model="submitForm.bankAccountName"
                      placeholder="请输入银行账户名称"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="IBAN/银行账户：" prop="bankAccount" class="requiredItem">
                    <Input
                      v-model="submitForm.bankAccount"
                      placeholder="请输入IBAN/银行账户"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="银行英文名称：" prop="bankName" class="requiredItem">
                    <Input
                      v-model="submitForm.bankName"
                      placeholder="请输入银行英文名称"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="支行英文名称：" prop="bankSubBranchName" class="requiredItem">
                    <Input
                      v-model="submitForm.bankSubBranchName"
                      placeholder="请输入支行英文名称"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="Swift / BIC：" prop="swiftBic" class="requiredItem">
                    <Input
                      v-model="submitForm.swiftBic"
                      placeholder="请输入Swift / BIC"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <!-- <FormItem label="法人中文名："
                            prop="companyLegalPersonZh">
                    <Input v-model="submitForm.companyLegalPersonZh"
                           placeholder="请填写中文名字"
                           :disabled="!isCompanyInfoEdit"></Input>
                  </FormItem> -->
                  <!-- <FormItem label="法人英文名："
                            prop="companyLegalPersonEn">
                    <Input v-model="submitForm.companyLegalPersonEn"
                           placeholder="请填写英文名字"
                           :disabled="!isCompanyInfoEdit"></Input>
                  </FormItem> -->
                  <FormItem label="法人英文名：" prop="companyLegalPersonEn" class="requiredItem">
                    <Input
                      v-model="submitForm.companyLegalPersonEn"
                      placeholder="请填写英文名字"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="法人出生日期：" class="requiredItem" prop="companyLegalPersonBirthday">
                    <DatePicker
                      :disabled="!isCompanyInfoEdit"
                      v-model="submitForm.companyLegalPersonBirthday"
                      type="date"
                      placeholder="请选择法人出生日期"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <FormItem label="法人身份证英文地址：" class="requiredItem" prop="personCardAddressEn">
                    <Input
                      v-model="submitForm.personCardAddressCountryEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如:China"
                      style="width:148px;margin-right:6px"
                    />
                    <Input
                      v-model="submitForm.personCardAddressCityEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="如：ShenZhen"
                      style="width:148px;"
                    />
                    <br />
                    <Input
                      v-model="submitForm.personCardAddressEn"
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入法人英文地址，包含城市、省份、邮编、国家。"
                      style="width: 300px"
                      type="textarea"
                    />
                  </FormItem>
                  <FormItem label="证件类型：" prop="certificateType" class="requiredItem">
                    <RadioGroup v-model="submitForm.certificateType">
                      <Radio :disabled="!isCompanyInfoEdit" :label="'2'">护照</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- <FormItem label="法人护照号："
                            prop="legalPersonCardPassportNumber">
                    <Input v-model="submitForm.legalPersonCardPassportNumber"
                           placeholder="请填写法人护照号"
                           :disabled="!isCompanyInfoEdit"></Input>
                  </FormItem> -->
                  <!-- <FormItem label="护照到期时间："
                            prop="legalPersonCardPassportPastTime">
                    <DatePicker type="date"
                                placeholder="请选择护照到期时间"
                                v-model="submitForm.legalPersonCardPassportPastTime"
                                format="yyyy-MM-dd"
                                class="tax-date"
                                :disabled="!isCompanyInfoEdit"></DatePicker>
                  </FormItem> -->
                  <Divider />
                  <div class="title">店铺信息</div>
                  <FormItem label="是否有店铺：" prop="isThereShop" class="requiredItem">
                    <RadioGroup v-model="submitForm.isThereShop">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="是否产生销售："
                    v-if="submitForm.isThereShop === '1'"
                    prop="isThereSale"
                    class="requiredItem"
                  >
                    <RadioGroup v-model="submitForm.isThereSale">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="是否在中东其它国家有税号："
                    prop="isOtherGulfStateDutyOrServices"
                    class="requiredItem"
                  >
                    <RadioGroup v-model="submitForm.isOtherGulfStateDutyOrServices">
                      <Radio :disabled="!isCompanyInfoEdit" label="1">是</Radio>
                      <Radio :disabled="!isCompanyInfoEdit" label="2">否</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="店铺所在电商平台:"
                    v-if="submitForm.isThereShop === '1'"
                    prop="shopSalePlatformName"
                    class="requiredItem"
                  >
                    <RadioGroup v-model="formLeft.shopSalePlatformName">
                      <Radio label="Amazon" :disabled="!isCompanyInfoEdit">Amazon</Radio>
                      <Radio label="Noon" :disabled="!isCompanyInfoEdit">Noon</Radio>
                      <Radio label="Jollychic" :disabled="!isCompanyInfoEdit">Jollychic</Radio>
                      <Radio label="其它" :disabled="!isCompanyInfoEdit">其它</Radio>
                    </RadioGroup>
                  </FormItem>
                  <!-- <FormItem label="法人/股东是否在阿联酋参与其它经营活动："
                            prop="isThereSale">
                    <RadioGroup v-model="submitForm.isOtherBusinessActivities">
                      <Radio label="1"
                             disabled="disabled">是</Radio>
                      <Radio label="2"
                             disabled="disabled">否</Radio>
                    </RadioGroup>
                  </FormItem> -->
                  <FormItem
                    label="平台店铺链接："
                    v-if="submitForm.isThereShop === '1'"
                    class="requiredItem"
                    prop="shopHref"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入平台店铺链接"
                      v-model="submitForm.shopHref"
                      style="width:300px;"
                    />
                  </FormItem>
                  <FormItem
                    label="VAT增值税号："
                    prop="shopOtherEuTaxNumber"
                    class="requiredItem"
                    v-if="submitForm.isOtherGulfStateDutyOrServices === '1'"
                  >
                    <Input
                      :disabled="!isCompanyInfoEdit"
                      placeholder="请输入其他国家欧盟税号"
                      v-model="submitForm.shopOtherEuTaxNumber"
                      style="width: 300px"
                    />
                  </FormItem>
                  <FormItem
                    label="电商平台账号完整名称："
                    v-if="submitForm.isThereShop === '1'"
                    prop="shopSalePlatformAccount"
                    class="requiredItem"
                  >
                    <Input
                      v-model="submitForm.shopSalePlatformAccount"
                      placeholder=" 请输入电商平台账号完整名称"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></Input>
                  </FormItem>
                  <FormItem label="预计/实际第一笔订单时间:" prop="firstOrderTime" class="requiredItem">
                    <DatePicker
                      type="date"
                      placeholder="请选择预计/实际第一笔订单时间"
                      v-model="submitForm.firstOrderTime"
                      class="tax-date"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    ></DatePicker>
                  </FormItem>
                  <!-- <FormItem label="税号生效日期："
                            prop="shopTaxEffectiveData">
                    <DatePicker type="date"
                                placeholder="请选择税号生效日期"
                                @on-change="changeVatDate($event,'shopTaxEffectiveData')"
                                v-model="submitForm.shopTaxEffectiveData"
                                class="tax-date"
                                :disabled="!isCompanyInfoEdit"></DatePicker>
                  </FormItem>
                  <FormItem label="超过阈值或预计超过阈值的日期："
                            prop="thresholdValueTime">
                    <DatePicker type="date"
                                placeholder="请选择超过阈值或预计超过阈值的日期"
                                @on-change="changeVatDate($event,'thresholdValueTime')"
                                v-model="submitForm.thresholdValueTime"
                                class="tax-date"
                                :disabled="!isCompanyInfoEdit"></DatePicker>
                  </FormItem> -->
                  <FormItem
                    label="过去12个月在阿联酋的营业额："
                    v-if="submitForm.isThereShop === '1'"
                    prop="shopSaleBefore"
                    class="requiredItem"
                  >
                    <Input
                      v-model="submitForm.shopSaleBefore"
                      placeholder=" 请输入过去12个月在阿联酋的营业额"
                      :disabled="!isCompanyInfoEdit"
                      style="width:300px"
                    ></Input>
                    AED（币种：阿联酋迪拉姆）
                  </FormItem>
                  <FormItem label="预计未来30天的营业额：" prop="future30Sale" class="requiredItem">
                    <Input
                      v-model="submitForm.future30Sale"
                      placeholder=" 请输入预计未来30天的营业额"
                      :disabled="!isCompanyInfoEdit"
                      style="width:300px"
                    ></Input>
                    AED（币种：阿联酋迪拉姆）
                  </FormItem>
                  <FormItem
                    label="请选择有税号的中东国家："
                    v-if="submitForm.isOtherGulfStateDutyOrServices === '1'"
                    class="requiredItem"
                    prop="taxVatCountry"
                  >
                    <Select
                      v-model="submitForm.taxVatCountry"
                      placeholder="请选择税号的中东国家"
                      :disabled="!isCompanyInfoEdit"
                      style="width: 300px"
                    >
                      <Option value="Saudi Arabia-沙特阿拉伯">沙特阿拉伯</Option>
                      <Option value="The united Arab Emirates-阿拉伯联合酋长国">阿拉伯联合酋长国</Option>
                      <Option value="Bahrain-巴林">巴林</Option>
                      <Option value="Kuwait-科威特">科威特</Option>
                      <Option value="Qatar-卡塔尔">卡塔尔</Option>
                      <Option value="Oman-阿曼">阿曼</Option>
                    </Select>
                  </FormItem>

                  <Divider />
                  <div class="title">文件信息</div>

                  <FormItem label="法人护照扫描件：" prop="companyLegalPersonCardPassport" class="requiredItem">
                    <Upload
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'companyLegalPersonCardPassport');
                        }
                      "
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :disabled="!isCompanyInfoEdit"
                      type="drag"
                      style="width:300px"
                    >
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                        <span v-if="submitForm.companyLegalPersonCardPassport == ''">
                          请拖拽文件到此区域上传或点击上传
                        </span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.companyLegalPersonCardPassport != ''">
                      <a :href="submitForm.companyLegalPersonCardPassport" target="_blank">法人护照扫描件</a>
                      <Icon
                        v-if="isCompanyInfoEdit"
                        type="ios-close-circle"
                        @click.stop="removeHandler('', '', 'companyLegalPersonCardPassport')"
                      />
                    </div>
                  </FormItem>
                  <FormItem label="电商平台协议/合同（选填）：">
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'shopSalePlatformContract');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'shopSalePlatformContract');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.shopSalePlatformContract == ''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.shopSalePlatformContract">
                        <a
                          :href="submitForm.shopSalePlatformContract"
                          v-if="submitForm.shopSalePlatformContract != ''"
                          target="_blank"
                        >
                          电商平台协议/合同
                        </a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'shopSalePlatformContract')"
                        />
                      </div>
                    </div>
                  </FormItem>
                  <FormItem
                    label="后台店铺截图："
                    v-if="submitForm.isThereShop === '1'"
                    prop="shopConsoleScreenshot"
                    class="requiredItem"
                  >
                    <div class="upload-file-box">
                      <Upload
                        type="drag"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'shopConsoleScreenshot');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'shopConsoleScreenshot');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="width:300px"
                        :disabled="!isCompanyInfoEdit"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span>请拖拽文件到此区域上传或点击上传</span>
                        </div>
                      </Upload>
                      <div class="fileBox">
                        <div v-if="submitForm.shopConsoleScreenshot">
                          <div v-if="submitForm.shopConsoleScreenshot != ''">
                            <a target="_blank" @click="previewFile(submitForm.shopConsoleScreenshot)">
                              {{ "后台店铺截图" }}
                              <Icon
                                v-if="isCompanyInfoEdit"
                                type="ios-close-circle"
                                @click.stop="removeHandler('', '', 'shopConsoleScreenshot')"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                  <!-- <FormItem label="税务申请函："
                            prop="taxRegisterLetter">
                    <Upload :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'taxRegisterLetter')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'taxRegisterLetter')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            :disabled="!isCompanyInfoEdit"
                            type="drag"
                            style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="submitForm.taxRegisterLetter==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.taxRegisterLetter!=''">
                      <a :href="submitForm.taxRegisterLetter"
                         target="_blank">税务申请函</a>
                      <Icon v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','taxRegisterLetter')" />
                    </div>
                  </FormItem> -->
                  <FormItem label="公司章程：" prop="articlesOfAssociationFile" class="requiredItem">
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'articlesOfAssociationFile');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.articlesOfAssociationFile == ''">
                            请拖拽文件到此区域上传或点击上传
                          </span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.articlesOfAssociationFile != ''">
                        <a :href="submitForm.articlesOfAssociationFile" target="_blank">公司章程</a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'articlesOfAssociationFile')"
                        />
                      </div>
                    </div>
                  </FormItem>

                  <!-- <FormItem label="过往12个月销售报告："
                            prop="shopSaleBeforeFile">
                    <Upload :on-format-error="formatErrorHandler"
                            :on-success="(res,file,fileList)=>{successHandler(res,file,fileList,'shopSaleBeforeFile')}"
                            :on-remove="(file,fileList)=>{removeHandler (file,fileList,'shopSaleBeforeFile')}"
                            :action="fileUpload"
                            :data="{prefix:''}"
                            :format="['jpg','jpeg','png','gif','pdf']"
                            :show-upload-list="false"
                            :disabled="!isCompanyInfoEdit"
                            type="drag"
                            style="width:300px">
                      <div style="padding: 10px 0">
                        <Icon type="ios-cloud-upload"
                              size="30"
                              style="color: #3399ff"></Icon>
                        <span v-if="submitForm.shopSaleBeforeFile==''">请拖拽文件到此区域上传或点击上传</span>
                        <span v-else>点击或拖拽文件到此区域重新上传</span>
                      </div>
                    </Upload>
                    <div v-if="submitForm.shopSaleBeforeFile!=''">
                      <a :href="submitForm.shopSaleBeforeFile"
                         target="_blank">过往12个月销售报告</a>
                      <Icon v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="removeHandler('','','shopSaleBeforeFile')" />
                    </div>
                  </FormItem> -->

                  <FormItem label="上传销售证据：" prop="salesEvidenceFile" class="requiredItem">
                    <div class="upload-file-box">
                      <Upload
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'salesEvidenceFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'salesEvidenceFile');
                          }
                        "
                        :action="fileUpload"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :disabled="!isCompanyInfoEdit"
                        type="drag"
                        style="width:300px"
                      >
                        <div style="padding: 10px 0">
                          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                          <span v-if="submitForm.salesEvidenceFile == ''">请拖拽文件到此区域上传或点击上传</span>
                          <span v-else>点击或拖拽文件到此区域重新上传</span>
                        </div>
                      </Upload>
                      <div v-if="submitForm.salesEvidenceFile != ''">
                        <a :href="submitForm.salesEvidenceFile" target="_blank">上传销售证据</a>
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="removeHandler('', '', 'salesEvidenceFile')"
                        />
                      </div>
                    </div>
                  </FormItem>
                </Form>
                <p class="fileBtn" v-if="isCompanyInfoEdit">
                  <Button
                    type="primary"
                    ghost
                    v-if="detailInfo.progressBar == 0"
                    @click="saveFile"
                    style="margin-right: 10px;"
                    :loading="saveLoading"
                  >
                    保存
                  </Button>
                  <Button type="primary" @click="submitFile" :loading="submitLoading">提交</Button>
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div class="content-r">
          <Card v-if="detailInfo.progressBar > 2">
            <p slot="title">
              <span>税号信息</span>
              <span
                @click="editTaxInfo(detailInfo)"
                v-if="detailInfo.progressBar == 4"
                style="float:right;font-weight: 400;margin-top: 2px;cursor: pointer;"
              >
                【修改税号信息】
              </span>
            </p>
            <Form :label-width="100" v-if="JSON.stringify(detailInfo) != '{}'">
              <FormItem label="VAT税号：">
                <span>{{ detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="SIRET号：" v-if="detailInfo.countryCode === 'FR'">
                <span>{{ detailInfo.siretNumber ? detailInfo.siretNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="EORI号：" v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
                <span>{{ detailInfo.eoriNumber ? detailInfo.eoriNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="税号下发日期：">
                <span>{{ detailInfo.taxIssueDate.substring(0, 10) }}</span>
              </FormItem>
              <FormItem label="税号生效日期：">
                <span>{{ detailInfo.taxEffectiveDate.substring(0, 10) }}</span>
              </FormItem>
              <FormItem label="申报周期：">
                <span>
                  {{
                    detailInfo.periodType == 0
                      ? "月报"
                      : detailInfo.periodType == 1
                      ? "季报"
                      : detailInfo.periodType == 2
                      ? "年报"
                      : detailInfo.periodType == -1
                      ? "暂无"
                      : ""
                  }}
                </span>
              </FormItem>
              <FormItem label="申报国家：">
                <span>{{ detailInfo.countryNameZh }}</span>
              </FormItem>
              <!-- 德国 -->
              <FormItem label="VAT税号证书：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.vatTaxNumberFile !== ''">
                  <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{ "VAT税号证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="DE欧盟证书：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.deEuCertificate !== ''">
                  <a :href="detailInfo.deEuCertificate" target="_blank">{{ "DE欧盟证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="税务副本：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.vatTaxNumberCopyFile !== ''">
                  <a :href="detailInfo.vatTaxNumberCopyFile" target="_blank">{{ "税务副本" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <!-- 德国 end-->
              <FormItem label="注册授权书：" v-if="detailInfo.countryCode == 'IT'">
                <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                <a
                  :href="submitForm.registrationAuthorization"
                  target="_blank"
                  v-if="submitForm.registrationAuthorization !== ''"
                >
                  {{ "注册授权书" }}
                </a>
              </FormItem>
              <!-- 法国服务授权书 -->
              <div v-if="detailInfo.countryCode == 'FR'">
                <!-- eco显示2个授权书-->
                <div v-if="submitForm.supplierId == 61">
                  <FormItem label="代表授权书ECO TAX：">
                    <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization !== ''"
                    >
                      {{ "代表授权书ECO TAX" }}
                    </a>
                  </FormItem>
                  <FormItem label="欧洲公司授权税务代理书：">
                    <span v-if="submitForm.registrationAuthorization1 == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization1"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization1 !== ''"
                    >
                      {{ "欧洲公司授权税务代理书" }}
                    </a>
                  </FormItem>
                </div>
                <!-- 陈氏和其他服务商显示一个授权书 -->
                <div v-else>
                  <FormItem label="授权书：">
                    <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization !== ''"
                    >
                      {{ "授权书" }}
                    </a>
                  </FormItem>
                </div>
              </div>
              <FormItem label="VAT税号文件：" v-if="detailInfo.countryCode !== 'DE'">
                <span v-if="detailInfo.vatTaxNumberFile !== ''">
                  <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{ "VAT税号文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem
                label="EORI文件："
                v-if="
                  detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'
                "
              >
                <span v-if="detailInfo.eoriNumberFile !== ''">
                  <a :href="detailInfo.eoriNumberFile" target="_blank">{{ "EORI文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem
                label="VAT证书："
                v-if="
                  detailInfo.countryCode !== 'DE' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'
                "
              >
                <span v-if="detailInfo.vatCertificate !== ''">
                  <a :href="detailInfo.vatCertificate" target="_blank">{{ "VAT证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="gateway 账号：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.gatewayId !== ''">{{ detailInfo.gatewayId }}</span>
                <span v-else>
                  <span>暂无</span>
                </span>
              </FormItem>
              <FormItem label="gateway 密码：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.gatewayPassword">{{ detailInfo.gatewayPassword }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="密钥：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.secret">{{ detailInfo.secret }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="欧盟税号证书：" v-if="detailInfo.countryCode == 'ES'">
                <span v-if="detailInfo.vatCertificate !== ''">
                  <a :href="detailInfo.vatCertificate" target="_blank">{{ "欧盟税号证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="海牙文件：" v-if="detailInfo.countryCode == 'ES'">
                <span v-if="detailInfo.hyFile !== ''">
                  <a :href="detailInfo.hyFile" target="_blank">{{ "海牙文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="税局账号：" v-if="detailInfo.countryCode == 'SA' || detailInfo.countryCode == 'AE'">
                <span v-if="detailInfo.gatewayId !== ''">{{ detailInfo.gatewayId }}</span>
                <span v-else>
                  <span>暂无</span>
                </span>
              </FormItem>
              <FormItem label="密码：" v-if="detailInfo.countryCode == 'SA' || detailInfo.countryCode == 'AE'">
                <span v-if="detailInfo.gatewayPassword">{{ detailInfo.gatewayPassword }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <!-- <FormItem label="法国税号证书："
                        v-if="detailInfo.countryCode=='FR'">
                <span v-if="detailInfo.frTaxCertificate">
                  <a :href="detailInfo.frTaxCertificate"
                     target="_blank">{{"法国税号证书"}}</a>
                </span>
                <span v-else>{{'暂无'}}</span>
              </FormItem> -->
            </Form>
          </Card>
          <Card>
            <p slot="title">服务信息</p>
            <Form :label-width="110">
              <FormItem label="订单号：">
                <span>{{ orderNo }}</span>
              </FormItem>
              <FormItem label="订单备注：">
                <span>{{ orderRemark }}</span>
              </FormItem>
              <FormItem label="工单号：">
                <span>{{ detailInfo.workNo }}</span>
              </FormItem>
              <FormItem label="注册状态：">
                <span>
                  {{
                    detailInfo.progressBar == "0"
                      ? "待上传资料"
                      : detailInfo.progressBar == "1"
                      ? "待审核资料"
                      : detailInfo.progressBar == "3"
                      ? "注册中"
                      : detailInfo.progressBar == "4"
                      ? "注册完成"
                      : detailInfo.progressBar == "8"
                      ? "资料驳回"
                      : ""
                  }}
                </span>
              </FormItem>
              <FormItem label="服务截止时间：">
                <span>{{ detailInfo.expirationTime }}</span>
              </FormItem>
              <FormItem label="服务公司：">
                <span>{{ detailInfo.companyName }}</span>
              </FormItem>
              <FormItem label="服务名称：">
                <!-- <span>{{detailInfo.productName}}</span> -->
                <span>
                  {{
                    detailInfo.productFunctionCode == "1"
                      ? "税号注册"
                      : detailInfo.productFunctionCode == "2"
                      ? "税务申报"
                      : detailInfo.productFunctionCode == "3"
                      ? "税务补缴"
                      : detailInfo.productFunctionCode == "4"
                      ? "转代理"
                      : detailInfo.productFunctionCode == "5"
                      ? "注册+申报"
                      : ""
                  }}
                </span>
              </FormItem>
              <FormItem label="国家：">
                <span>{{ detailInfo.countryNameZh }}</span>
              </FormItem>
              <FormItem label="创建时间：">
                <span>{{ detailInfo.createTime }}</span>
              </FormItem>
              <FormItem
                label="服务商："
                v-if="
                  detailInfo.countryNameZh === '法国' ||
                    detailInfo.countryNameZh === '德国' ||
                    detailInfo.countryNameZh === '意大利'
                "
              >
                <span>{{ detailInfo.supplierName || "暂无" }}</span>
              </FormItem>
              <FormItem label="服务商分配编码：">
                <span>{{ detailInfo.supplierAssignsServiceId }}</span>
                <Icon
                  class="editIcon"
                  type="ios-create-outline"
                  @click="(supplierServiceIDModal = true), (supplierServiceID = detailInfo.supplierAssignsServiceId)"
                />
              </FormItem>
              <FormItem label="注册税号证书：" v-if="detailInfo.countryNameZh === '阿联酋'">
                <a :href="formLeft.taxRegisterLetter" target="_blank" v-if="formLeft.taxRegisterLetter != ''">查看</a>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="翻译件：">
                <span v-if="detailInfo.translationMaterial">
                  <a
                    :href="
                      detailInfo.translationMaterial.slice(0, 5) == 'http:'
                        ? detailInfo.translationMaterial.slice(0, 4) + 's' + detailInfo.translationMaterial.slice(4)
                        : detailInfo.translationMaterial
                    "
                    target="_blank"
                  >
                    {{ "翻译件" }}
                  </a>
                </span>
                <span v-else>{{ "暂无" }}</span>
                <span
                  v-if="
                    detailInfo.progressBar == 1 ||
                      detailInfo.progressBar == 7 ||
                      detailInfo.progressBar == 5 ||
                      detailInfo.progressBar == 6 ||
                      detailInfo.progressBar == 3
                  "
                >
                  <span
                    v-if="detailInfo.translationMaterial"
                    style="color:red;margin-left:20px;cursor: pointer;"
                    @click="submitTranslationMaterialModel = true"
                    v-show="hasAuthority('mainList_submitTranslationMaterial')"
                  >
                    修改
                  </span>
                  <span
                    v-else
                    style="color:rgb(22, 173, 233);margin-left:20px;cursor: pointer;"
                    @click="submitTranslationMaterialModel = true"
                    v-show="hasAuthority('mainList_submitTranslationMaterial')"
                  >
                    上传
                  </span>
                </span>
              </FormItem>
              <FormItem label="审核时间：">
                <span>{{ detailInfo.materialAuditDate }}</span>
              </FormItem>
              <FormItem label="提交服务商时间：">
                <span>{{ detailInfo.submitServiceTime ? detailInfo.submitServiceTime.slice(0, 10) : "" }}</span>
              </FormItem>
              <FormItem label="提交税局时间：">
                <span>{{ detailInfo.submitTaxTime ? detailInfo.submitTaxTime.slice(0, 10) : "" }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card
            v-if="
              detailInfo.countryCode == 'ES' &&
                detailInfo.progressBar !== 0 &&
                detailInfo.progressBar !== 1 &&
                detailInfo.progressBar !== 5 &&
                detailInfo.progressBar !== 8
            "
            style="margin-top: 6px;"
          >
            <p slot="title">物流信息</p>
            <Form :label-width="100">
              <FormItem label="寄送海牙单号：">
                <span>{{ submitForm.hyTrackingNumber == "" ? "暂无" : submitForm.hyTrackingNumber }}</span>
                <!-- <Button v-if="submitForm.hyTrackingNumber!==''" @click="enterTrankingNumber=true">修改</Button> -->
              </FormItem>
              <FormItem label="寄送税局单号：">
                <span>{{ submitForm.taxTrackingNumber == "" ? "暂无" : submitForm.taxTrackingNumber }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 6px;">
            <p slot="title">用户信息</p>
            <Form :label-width="100">
              <FormItem label="用户昵称：">
                <span>{{ detailInfo.userNickname }}</span>
              </FormItem>
              <FormItem label="手机号：">
                <span>{{ detailInfo.userMobile }}</span>
              </FormItem>
              <FormItem label="用户级别：">
                <span>{{ "" }}</span>
              </FormItem>
              <FormItem label="公司名称：">
                <span>{{ detailInfo.userCompanyName }}</span>
              </FormItem>
              <FormItem label="地址：">
                <span>{{ detailInfo.userAddress }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 6px;" class="operationLogs">
            <p slot="title">操作记录</p>
            <div v-if="consoleOperationLogs.length > 0" class="logsContent">
              <div v-for="(row, index) in consoleOperationLogs" :key="index">
                <div>
                  <p class="itemTop">{{ row.instruction }}</p>
                  <p v-if="row.remark">备注：{{ row.remark }}</p>
                  <div class="itemBottom">
                    <span style="margin-right:10px;">时间：{{ row.createTime }}</span>
                    <span>操作人：{{ row.adminUserNickName || row.adminUserMobile }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div v-else class="content">
        <div class="content-l">
          <Card>
            <p slot="title" class="declareFileBox">
              <span>申报资料</span>
              <span>
                <span class="btnArea view" v-if="progressBar >= 20 && progressBar <= 27">
                  <Button @click="viewInformationModal = true">查看注册信息</Button>
                  <Button
                    type="primary"
                    v-show="hasAuthority('work_order_list05')"
                    ghost
                    @click="downLoad"
                    style="margin-left:10px;"
                  >
                    下载注册资料
                  </Button>
                </span>
                <span v-show="hasAuthority('work_order_list07')">
                  <Button
                    type="primary"
                    style="margin-left:10px;"
                    v-if="detailInfo.countryCode === 'GB' && !isAuth"
                    @click="startTaxFun(detailInfo)"
                  >
                    授权报税
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 19">
                  <!-- <Button type="primary" ghost @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px;">发送提醒</Button>   -->
                  <Button type="primary" @click="fileTaxModal = true" v-if="detailInfo.taxType == 1">
                    填写报税信息
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 20">
                  <Button type="primary" ghost @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px ;">
                    发送提醒
                  </Button>
                  <Button type="primary" @click="fileTaxModal = true" v-if="detailInfo.taxType == 1">
                    修改报税信息
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 21">
                  <Button @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px">发送提醒</Button>
                  <Button type="primary" v-if="detailInfo.countryCode !== 'GB'" @click="caculateTax">计算税金</Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 23">
                  <Button
                    type="primary"
                    v-if="detailInfo.countryNameZh == '捷克' || detailInfo.countryNameZh == '奥地利'"
                    @click="auditDeclareModal = true"
                  >
                    审核申报
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 18">
                  <Button type="primary" @click="downLoadDeclare" ghost style="margin-right:10px;">下载申报资料</Button>
                  <Button type="primary" v-if="detailInfo.countryCode == 'SA'" @click="invoicaBoxShow = true">
                    录入发票号
                  </Button>
                  <Button v-if="detailInfo.countryCode == 'AE'" type="primary" @click="gibanBox = true">
                    录入GIBAN
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 29">
                  <!-- <Button type="primary" ghost @click="sendMessage(detailInfo.progressBar)" style="margin-right:10px;">发送提醒</Button>                             -->
                  <Button type="primary" v-show="hasAuthority('work_order_list13')" @click="finishAgent">
                    完成转代理
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 25">
                  <Button
                    type="primary"
                    @click="downLoadDeclare"
                    ghost
                    style="margin-right:10px;"
                    v-if="detailInfo.countryNameZh != '法国'"
                  >
                    下载申报资料
                  </Button>
                  <Button
                    type="primary"
                    v-if="detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'DE'"
                    @click="uploadReceiptModal = true"
                  >
                    上传回执
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 27">
                  <Button
                    type="primary"
                    @click="downLoadDeclare"
                    ghost
                    style="margin-right:10px;"
                    v-if="detailInfo.countryNameZh === '西班牙'"
                  >
                    下载申报资料
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 22">
                  <Button
                    type="primary"
                    @click="downLoadDeclare"
                    ghost
                    style="margin-right:10px;"
                    v-if="detailInfo.countryNameZh === '西班牙' || detailInfo.countryNameZh === '英国'"
                  >
                    下载申报资料
                  </Button>
                  <Button
                    type="primary"
                    @click="taxFileModal = true"
                    v-if="tableData.length != 0 && tableData[0].declareRule == 2"
                  >
                    上传零申报凭证
                  </Button>
                  <Button type="primary" @click="taxFileModal = true" v-show="hasAuthority('work_order_list10')" v-else>
                    上传缴税凭证
                  </Button>
                </span>
                <span v-if="detailInfo.progressBar == 24">
                  <Button
                    type="primary"
                    v-if="detailInfo.countryNameZh == '捷克' || detailInfo.countryNameZh == '奥地利'"
                    @click="resubmissionDeclaration"
                  >
                    提交申报
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 33">
                  <Button
                    type="primary"
                    v-show="hasAuthority('work_order_list05')"
                    ghost
                    @click="downLoad"
                    style="margin-right:10px;"
                  >
                    下载注册资料
                  </Button>
                  <Button
                    type="primary"
                    @click="downLoadDeclare"
                    ghost
                    style="margin-right:10px;"
                    v-if="detailInfo.countryNameZh === '西班牙'"
                  >
                    下载申报资料
                  </Button>
                  <Button type="primary" @click="auditModal = true">审核</Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 34">
                  <Button
                    type="primary"
                    v-show="hasAuthority('work_order_list05')"
                    ghost
                    @click="downLoad"
                    style="margin-right:10px;"
                  >
                    下载注册资料
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 34 && detailInfo.countryNameZh === '意大利'">
                  <Button type="primary" @click="downLoadDeclare" ghost style="margin-right:10px;">下载申报资料</Button>
                  <Button type="primary" @click="taxFileModal = true" v-show="hasAuthority('work_order_list10')">
                    上传缴税凭证
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.progressBar == 35">
                  <Button
                    type="primary"
                    v-show="hasAuthority('work_order_list05')"
                    ghost
                    @click="downLoad"
                    style="margin-right:10px;"
                  >
                    下载注册资料
                  </Button>
                  <Button
                    type="primary"
                    @click="downLoadDeclare"
                    ghost
                    style="margin-right:10px;"
                    v-if="detailInfo.countryNameZh != '西班牙' && detailInfo.countryNameZh != '法国'"
                  >
                    下载申报资料
                  </Button>
                  <Button type="primary" @click="taxFileModal = true" v-show="hasAuthority('work_order_list10')">
                    上传缴税凭证
                  </Button>
                </span>
                <span class="btnArea" v-if="detailInfo.countryNameZh == '德国'">
                  <Button type="primary" @click="creatAnnalsFun" ghost style="margin-left:10px;">生成年报工单</Button>
                </span>
                <span v-if="detailInfo.countryCode === 'FR'">
                  <Button
                    type="primary"
                    v-if="detailInfo.vatTaxNumber == ''"
                    v-show="hasAuthority('work_order_list06')"
                    @click="
                      (taxNumModal = true), (addTaxNum.taxEffectiveDate = formatDate(submitForm.shopTaxEffectiveData))
                    "
                  >
                    录入税号信息
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    @click="SIRETMadol = true"
                    v-if="detailInfo.siretNumber == ''"
                    style="margin-right:10px;"
                  >
                    录入SIRET号
                  </Button>
                </span>
              </span>
            </p>
            <div class="basicInfo">
              <Form ref="submitForm" :model="submitForm" :label-width="120">
                <FormItem label="申报状态：">
                  <span>{{ progressStatus[detailInfo.progressBar] }}</span>
                </FormItem>
                <FormItem label="提交申报结果：" v-if="detailInfo.countryCode == 'FR'">
                  <span v-if="declareInfo.declarationStatus == 0">暂无</span>
                  <span v-if="declareInfo.declarationStatus == 1" style="color:#2d8cf0">提交成功</span>
                  <span v-if="declareInfo.declarationStatus == 2" style="color:red">扣款失败</span>
                  <span v-if="declareInfo.declarationStatus == 3" style="color:red">提交失败</span>
                  <span
                    style="cursor:pointer;"
                    v-if="declareInfo.declarationStatus == 3"
                    @click="lookReason(1, '', 'isDeclareInfo')"
                  >
                    【重新提交】
                  </span>
                  <span
                    style="cursor:pointer;"
                    v-if="declareInfo.declarationStatus == 2"
                    @click="lookReason(2, '', 'isDeclareInfo')"
                  >
                    【查看原因】
                  </span>
                </FormItem>
                <FormItem label="当前申报次数：">
                  <span>{{ detailInfo.declareCout }}</span>
                </FormItem>
                <FormItem label="当前申报区间：">
                  <span v-if="tableData.length != 0">
                    {{ tableData[0].beginTime.substring(0, 7) }}至{{ tableData[0].endTime.substring(0, 7) }}
                  </span>
                  <span v-else>{{ detailInfo.nextDeclareTime }}</span>
                </FormItem>
                <FormItem label="申报回执：" v-if="tableData.length != 0">
                  <Button
                    v-if="tableData[0].declareReceipt == '' && detailInfo.progressBar == 25"
                    type="primary"
                    @click="uploadReceiptModal = true"
                  >
                    点击上传
                  </Button>
                  <div v-else-if="tableData[0].declareReceipt != ''">
                    <a
                      target="_blank"
                      v-for="(item, index) in tableData[0].declareReceipt.split(';')"
                      :href="item.slice(0, 5) == 'http:' ? item.slice(0, 4) + 's' + item.slice(4) : item"
                      style="margin-right:5px;"
                      :key="index"
                    >
                      {{ "申报回执" }}
                    </a>
                    <Button
                      v-if="detailInfo.countryCode === 'IT' && detailInfo.progressBar == 27"
                      @click="uploadReceiptModal = true"
                      style="margin-left:10px"
                    >
                      重新上传
                    </Button>
                  </div>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem
                  label="扣款回执："
                  v-if="
                    detailInfo.countryCode === 'IT' &&
                      (detailInfo.progressBar === 25 || detailInfo.progressBar === 27) &&
                      detailInfo.supplierId != 50
                  "
                >
                  <a v-if="tableData[0].debitReceipt != 0" :href="tableData[0].debitReceipt" target="_blank">
                    {{ "扣款回执" }}
                  </a>
                  <Button
                    v-if="detailInfo.progressBar === 27"
                    @click="uploadReceiptModal = true"
                    style="margin-left:10px"
                  >
                    重新上传
                  </Button>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="其它平台销售额：" v-if="tableData.length != 0">
                  <span>{{ tableData[0].otherIncludTaxAmt || "暂无" }}</span>
                </FormItem>
                <FormItem label="其它平台销售额文件：" v-if="tableData.length != 0">
                  <div v-if="tableData[0].otherSaleFileUrl != ''">
                    <a target="_blank" :href="tableData[0].otherSaleFileUrl" style="margin-right:5px;">
                      {{ "点击下载" }}
                    </a>
                  </div>
                  <span v-else>暂无</span>
                </FormItem>
                <FormItem label="销售额文件：" v-if="tableData.length != 0">
                  <div v-if="tableData[0].sellFile != ''">
                    <a
                      target="_blank"
                      :href="
                        tableData[0].sellFile.slice(0, 5) == 'http:'
                          ? tableData[0].sellFile.slice(0, 4) + 's' + tableData[0].sellFile.slice(4)
                          : tableData[0].sellFile
                      "
                      style="margin-right:5px;"
                    >
                      {{ "点击下载" }}
                    </a>
                  </div>
                  <span v-else>暂无</span>
                </FormItem>
                <div
                  v-if="
                    detailInfo.countryCode === 'SA' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)
                  "
                >
                  <FormItem label="发票开具通知：">
                    <a v-if="tableData[0].invoiceReceipt != ''" :href="tableData[0].invoiceReceipt" target="_blank">
                      {{ "发票开具通知" }}
                    </a>
                    <span v-else>暂无</span>
                  </FormItem>
                  <FormItem label="纳税付款发票信件：">
                    <a
                      v-if="tableData[0].payLetterInvoiceReceipt != ''"
                      :href="tableData[0].payLetterInvoiceReceipt"
                      target="_blank"
                    >
                      {{ "纳税付款发票信件" }}
                    </a>
                    <span v-else>暂无</span>
                  </FormItem>
                  <FormItem label="纳税付款系统发票：">
                    <a
                      v-if="tableData[0].paySystemInvoiceReceipt != ''"
                      :href="tableData[0].paySystemInvoiceReceipt"
                      target="_blank"
                    >
                      {{ "纳税付款系统发票" }}
                    </a>
                    <span v-else>暂无</span>
                  </FormItem>
                  <FormItem label="税务申报接收通知：">
                    <a
                      v-if="tableData[0].taxDeclareReceiveInformReceipt != ''"
                      :href="tableData[0].taxDeclareReceiveInformReceipt"
                      target="_blank"
                    >
                      {{ "税务申报接收通知" }}
                    </a>
                    <span v-else>暂无</span>
                  </FormItem>
                  <FormItem label="税务申请表：">
                    <a
                      v-if="tableData[0].taxDeclareBlankReceipt != ''"
                      :href="tableData[0].taxDeclareBlankReceipt"
                      target="_blank"
                    >
                      {{ "税务申请表" }}
                    </a>
                    <span v-else>暂无</span>
                  </FormItem>
                </div>
                <FormItem
                  label="税金收款回执："
                  v-if="
                    detailInfo.countryCode === 'AE' && (detailInfo.progressBar === 25 || detailInfo.progressBar === 27)
                  "
                >
                  <a v-if="tableData[0].taxesReceipt != ''" :href="tableData[0].taxesReceipt" target="_blank">
                    {{ "税金收款回执" }}
                  </a>
                  <span v-else>暂无</span>
                </FormItem>
              </Form>
            </div>
            <div
              class="declareData"
              v-if="
                detailInfo.progressBar == 21 ||
                  detailInfo.progressBar == 22 ||
                  detailInfo.progressBar == 23 ||
                  detailInfo.progressBar == 24 ||
                  detailInfo.progressBar == 25 ||
                  detailInfo.progressBar == 26 ||
                  detailInfo.progressBar == 27
              "
            >
              <p>申报数据：</p>
              <Form ref="declareInfo" :model="declareInfo" :label-width="120">
                <FormItem label="含税销售额：">
                  <Input
                    :disabled="detailInfo.progressBar != 21"
                    placeholder="请输入含税销售额"
                    number
                    v-model="declareInfo.includTaxPrice"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem label="不含税销售额：">
                  <Input
                    :disabled="detailInfo.progressBar != 21"
                    placeholder="请输入不含税销售额"
                    number
                    v-model="declareInfo.excludeTaxPrice"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem label="销项税额：">
                  <Input
                    :disabled="detailInfo.progressBar != 21"
                    placeholder="请输入抵扣税金"
                    v-model="declareInfo.allTaxPrice"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem label="抵扣总金额：">
                  <Input
                    :disabled="detailInfo.progressBar != 21"
                    placeholder="请输入抵扣税金"
                    v-model="declareInfo.deductionPrice"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem label="最终缴纳税金：">
                  <Input
                    :disabled="detailInfo.progressBar != 21"
                    placeholder="请输入缴纳税金"
                    v-model="declareInfo.allTaxPrice"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem label="税金缴纳凭证：" v-if="detailInfo.progressBar == 25 || detailInfo.progressBar == 27">
                  <div v-if="declareInfo.taxCertificate != ''">
                    <a
                      target="_blank"
                      v-for="(item, index) in declareInfo.taxCertificate"
                      :key="index"
                      :href="item"
                      style="margin-right:5px;"
                    >
                      {{ "缴税凭证" }}
                    </a>
                  </div>
                </FormItem>
                <FormItem label="抵扣明细：">
                  <Table :data="deductionInfo" :columns="columns1">
                    <template slot="deductionType" slot-scope="{ row }">
                      <span>
                        {{
                          row.deductionType == "1"
                            ? "进口增值税抵扣"
                            : row.deductionType == "2"
                            ? "发票抵扣"
                            : row.deductionType == "3"
                            ? "欧盟内采购"
                            : row.deductionType == "4"
                            ? "B2B发票"
                            : "其他"
                        }}
                      </span>
                    </template>
                    <template slot="deductFile" slot-scope="{ row }">
                      <a :href="row.deductionFile" target="_blank">{{ row.fileOriginalName }}</a>
                    </template>
                    <template slot="operate" slot-scope="{ row }">
                      <span v-if="detailInfo.progressBar == 23" style="cursor: pointer;" @click="editDeduction(row)">
                        【修改】
                      </span>
                    </template>
                  </Table>
                </FormItem>
              </Form>
            </div>
          </Card>
          <Card style="margin-top:10px;" v-if="detailInfo.countryCode === 'DE'">
            <p slot="title">年度申报</p>
            <Table :loading="deYearLoading" :columns="deYearColumns" :data="deYearData">
              <template slot="operation" slot-scope="{ row }">
                <div>
                  <span v-if="row.status == 21" style="cursor:pointer;" @click="goAnnalsDE(row)">【提交申报】</span>
                  <span v-if="row.status == 27 && row.declareReceipt != ''">
                    <a
                      :href="
                        row.declareReceipt.slice(0, 4) == 'http:'
                          ? row.declareReceipt.slice(0, 4) + 's' + row.declareReceipt.slice(4)
                          : row.declareReceipt
                      "
                      target="_blank"
                    >
                      【查看回执】
                    </a>
                  </span>
                  <span @click="getDEyearDetailFun(row)" style="cursor:pointer;">【详情】</span>
                </div>
              </template>
            </Table>
          </Card>
          <Card style="margin-top:10px;">
            <p slot="title">历史申报记录</p>
            <Table :loading="tableLoading" :columns="columns" :data="tableData">
              <template slot="lookData" slot-scope="{ row }">
                <div>
                  <span
                    style="cursor:pointer;color:#2D8cF0;"
                    @click="
                      taxModal = true;
                      taxBaseData = row;
                    "
                  >
                    点击查看
                  </span>
                </div>
              </template>
              <template slot="operate" slot-scope="{ row }">
                <div
                  style="cursor: pointer;"
                  v-if="row.countryCode === 'GB' && row.status === 21"
                  @click="goToDeclare(row)"
                >
                  【去报税】
                </div>
                <div v-if="row.taxCertificate.length !== 0 && row.declareRule != 2">
                  <a
                    style="display:block;"
                    v-for="(item, index) in row.taxCertificate"
                    :key="index"
                    :href="item.slice(0, 5) == 'http:' ? item.slice(0, 4) + 's' + item.slice(4) : item"
                    target="_blank"
                  >
                    缴税凭证
                  </a>
                </div>
                <div v-if="row.taxCertificate.length !== 0 && row.declareRule == 2">
                  <a
                    style="display:block;"
                    v-for="(item, index) in row.taxCertificate"
                    :key="index"
                    :href="item.slice(0, 5) == 'http:' ? item.slice(0, 4) + 's' + item.slice(4) : item"
                    target="_blank"
                  >
                    零申报凭证
                  </a>
                </div>
                <div
                  v-if="row.countryCode == 'SA' && row.status === 18"
                  style="cursor: pointer;"
                  @click="entryInvoice(row)"
                >
                  【录入发票号】
                </div>
                <div
                  v-if="row.countryCode == 'AE' && row.status === 18"
                  style="cursor: pointer;"
                  @click="entryGIBAN(row)"
                >
                  【录入GIBAN】
                </div>
                <div
                  style="cursor: pointer;color: #2D8cF0;"
                  v-if="row.countryCode === 'GB' && row.status > 21"
                  @click="getLink(row)"
                >
                  英国申报回执
                </div>
                <!-- <a style="cursor: pointer;color: rgb(45, 140, 240);4"
                   v-if="row.countryCode !== 'GB' && row.status > 21 && row.declareReceipt !==''"
                   :href="row.declareReceipt"
                   target="_blank">查看回执</a> -->
                <p v-for="(v, i) in row.declareReceipt.split(';')" :key="i">
                  <a
                    :href="v.slice(0, 5) == 'http:' ? v.slice(0, 4) + 's' + v.slice(4) : v"
                    v-if="row.countryCode !== 'GB' && row.status > 21 && row.declareReceipt !== ''"
                    target="_blank"
                  >
                    查看回执
                  </a>
                </p>
                <div
                  @click="seeReceipt($event, row.id)"
                  style="cursor: pointer;"
                  v-if="
                    row.declareReceipt === '' && row.countryCode === 'IT' && row.declareRule === 2 && row.status > 21
                  "
                >
                  【查看回执】
                </div>
                <div
                  @click="downLoadDeclare($event, row.id)"
                  style="cursor: pointer;"
                  v-if="row.countryCode === 'ES' && (row.status === 22 || row.status === 25 || row.status === 27)"
                >
                  【下载申报资料】
                </div>
                <div
                  style="cursor: pointer;"
                  @click="caculateTax(row)"
                  v-if="row.status === 21 && row.countryCode !== 'GB'"
                >
                  【去报税】
                </div>
                <div
                  style="cursor: pointer;"
                  @click="taxFileRecordModal(row)"
                  v-if="row.status === 22 || row.status === 34 || row.status === 35"
                >
                  【上传缴税凭证】
                </div>
                <div
                  style="cursor: pointer;"
                  @click="uploadReceiptModalFun(row)"
                  v-if="
                    (row.status === 27 || row.status === 25) && row.countryCode !== 'GB' && row.countryCode !== 'DE'
                  "
                >
                  【上传回执】
                </div>
                <div style="cursor: pointer;" @click="auditFun(row)" v-if="row.status === 33">【审核】</div>
                <div style="cursor: pointer;" @click="lookReason(1, row, '')" v-if="row.declarationStatus === 3">
                  【重新提交】
                </div>
                <div style="cursor: pointer;" @click="lookReason(2, row, '')" v-if="row.declarationStatus === 2">
                  【查看原因】
                </div>
                <div
                  style="cursor: pointer;"
                  v-if="row.status === 24 && (row.countryCode === 'AT' || row.countryCode === 'CZ')"
                  @click="resubmissionDeclaration(row)"
                >
                  【提交申报】
                </div>
                <div
                  style="cursor: pointer;"
                  v-if="row.status === 23 && (row.countryCode === 'AT' || row.countryCode === 'CZ')"
                  @click="auditDeclareModalFun(row)"
                >
                  【审核申报】
                </div>
                <!-- && row.countryCode!='GB' && row.countryCode!='DE' -->
                <div
                  style="cursor: pointer;"
                  v-show="hasAuthority('work_order_list14')"
                  v-if="row.status == 20 || row.status == 18 || row.status == 22 || row.status == 25"
                  @click="toUpdateStatus(row)"
                >
                  【更改状态】
                </div>
              </template>
              <template slot="declareRule" slot-scope="{ row }">
                <span>
                  {{
                    row.declareRule == "0"
                      ? "目的国"
                      : row.declareRule == "1"
                      ? "发出国"
                      : row.declareRule == "2"
                      ? "零申报"
                      : ""
                  }}
                </span>
              </template>
              <template slot="status" slot-scope="{ row }">
                <span>
                  {{
                    row.status == 0
                      ? "待上传资料"
                      : row.status == 1
                      ? "待审核资料"
                      : row.status == 2
                      ? "待续费"
                      : row.status == 3
                      ? "注册中"
                      : row.status == 4
                      ? "注册完成"
                      : row.status == 5
                      ? "待授权海牙认证"
                      : row.status == 6
                      ? "海牙认证中"
                      : row.status == 7
                      ? "待授权注册"
                      : row.status == 8
                      ? "资料驳回"
                      : row.status == 19
                      ? "等待申报中"
                      : row.status == 20
                      ? "等待申报中"
                      : row.status == 21
                      ? "待提交报税资料"
                      : row.status == 23
                      ? "待审核申报"
                      : row.status == 24
                      ? "申报驳回"
                      : row.status == 18
                      ? "申报中"
                      : row.status == 22
                      ? "待缴纳税金"
                      : row.status == 25
                      ? "申报完成"
                      : row.status == 27
                      ? "申报完成"
                      : row.status == 26
                      ? "申报失败"
                      : row.status == 28
                      ? "待上传资料"
                      : row.status == 29
                      ? "转代理中"
                      : row.status == 31
                      ? "待审核转代理资料"
                      : row.status == 32
                      ? "转代理资料驳回"
                      : row.status == 33
                      ? "税金待审核"
                      : row.status == 34
                      ? "缴税凭证被驳回"
                      : row.status == 35
                      ? "待上传零申报凭证"
                      : row.status == 36
                      ? "待授权海牙认证"
                      : row.status == 37
                      ? "海牙认证中"
                      : row.status == 38
                      ? "待授权转代理"
                      : row.status == 51
                      ? "待上传资料"
                      : row.status == 52
                      ? "待审核"
                      : row.status == 53
                      ? "注销中"
                      : row.status == 54
                      ? "已完成"
                      : row.status == 55
                      ? "资料驳回"
                      : row.status == 56
                      ? "注销失败"
                      : "暂无"
                  }}
                </span>
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
          <Card>
            <p slot="title">
              <span>税号信息</span>
              <span
                @click="editTaxInfo(detailInfo)"
                style="float:right;font-weight: 400;margin-top: 2px;cursor: pointer;"
              >
                【修改税号信息】
              </span>
            </p>
            <Form :label-width="100" v-if="JSON.stringify(detailInfo) != '{}'">
              <FormItem label="VAT税号：">
                <span>{{ detailInfo.vatTaxNumber ? detailInfo.vatTaxNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="SIRET号：" v-if="detailInfo.countryCode === 'FR'">
                <span>{{ detailInfo.siretNumber ? detailInfo.siretNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="EORI号：" v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
                <span>{{ detailInfo.eoriNumber ? detailInfo.eoriNumber : "暂无" }}</span>
              </FormItem>
              <FormItem label="税号下发日期：">
                <span>{{ detailInfo.taxIssueDate.substring(0, 10) }}</span>
              </FormItem>
              <FormItem label="税号生效日期：">
                <span>{{ detailInfo.taxEffectiveDate.substring(0, 10) }}</span>
              </FormItem>
              <FormItem label="申报周期：">
                <span>
                  {{
                    detailInfo.periodType == 0
                      ? "月报"
                      : detailInfo.periodType == 1
                      ? "季报"
                      : detailInfo.periodType == 2
                      ? "年报"
                      : detailInfo.periodType == -1
                      ? "暂无"
                      : ""
                  }}
                </span>
              </FormItem>
              <FormItem label="申报国家：">
                <span>{{ detailInfo.countryNameZh }}</span>
              </FormItem>
              <!-- 德国 -->
              <FormItem label="VAT税号证书：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.vatTaxNumberFile !== ''">
                  <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{ "VAT税号证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="DE欧盟证书：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.deEuCertificate !== ''">
                  <a :href="detailInfo.deEuCertificate" target="_blank">{{ "DE欧盟证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="税务副本：" v-if="detailInfo.countryCode === 'DE'">
                <span v-if="detailInfo.vatTaxNumberCopyFile !== ''">
                  <a :href="detailInfo.vatTaxNumberCopyFile" target="_blank">{{ "税务副本" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <!-- 德国 end-->
              <FormItem label="注册授权书：" v-if="detailInfo.countryCode == 'IT'">
                <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                <a
                  :href="submitForm.registrationAuthorization"
                  target="_blank"
                  v-if="submitForm.registrationAuthorization !== ''"
                >
                  {{ "注册授权书" }}
                </a>
              </FormItem>

              <!-- 法国服务授权书 -->
              <div v-if="detailInfo.countryCode == 'FR'">
                <!-- eco显示2个授权书-->
                <div v-if="submitForm.supplierId == 61">
                  <FormItem label="代表授权书ECO TAX：">
                    <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization !== ''"
                    >
                      {{ "代表授权书ECO TAX" }}
                    </a>
                  </FormItem>
                  <FormItem label="欧洲公司授权税务代理书：">
                    <span v-if="submitForm.registrationAuthorization1 == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization1"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization1 !== ''"
                    >
                      {{ "欧洲公司授权税务代理书" }}
                    </a>
                  </FormItem>
                </div>
                <!-- 陈氏和其他服务商显示一个授权书 -->
                <div v-else>
                  <FormItem label="授权书：">
                    <span v-if="submitForm.registrationAuthorization == ''">{{ "暂无" }}</span>
                    <a
                      :href="submitForm.registrationAuthorization"
                      target="_blank"
                      v-if="submitForm.registrationAuthorization !== ''"
                    >
                      {{ "授权书" }}
                    </a>
                  </FormItem>
                </div>
              </div>

              <FormItem label="VAT税号文件：" v-if="detailInfo.countryCode !== 'DE'">
                <span v-if="detailInfo.vatTaxNumberFile !== ''">
                  <a :href="detailInfo.vatTaxNumberFile" target="_blank">{{ "VAT税号文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem
                label="EORI文件："
                v-if="
                  detailInfo.countryCode !== 'GB' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'
                "
              >
                <span v-if="detailInfo.eoriNumberFile !== ''">
                  <a :href="detailInfo.eoriNumberFile" target="_blank">{{ "EORI文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem
                label="VAT证书："
                v-if="
                  detailInfo.countryCode !== 'DE' && detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'
                "
              >
                <span v-if="detailInfo.vatCertificate !== ''">
                  <a :href="detailInfo.vatCertificate" target="_blank">{{ "VAT证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="gateway 账号：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.gatewayId !== ''">{{ detailInfo.gatewayId }}</span>
                <span v-else>
                  <span>暂无</span>
                </span>
              </FormItem>
              <FormItem label="gateway 密码：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.gatewayPassword">{{ detailInfo.gatewayPassword }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="密钥：" v-if="detailInfo.countryCode == 'GB'">
                <span v-if="detailInfo.secret">{{ detailInfo.secret }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="欧盟税号证书：" v-if="detailInfo.countryCode == 'ES'">
                <span v-if="detailInfo.vatCertificate !== ''">
                  <a :href="detailInfo.vatCertificate" target="_blank">{{ "欧盟税号证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="海牙文件：" v-if="detailInfo.countryCode == 'ES'">
                <span v-if="detailInfo.hyFile !== ''">
                  <a :href="detailInfo.hyFile" target="_blank">{{ "海牙文件" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="税局账号：" v-if="detailInfo.countryCode == 'SA' || detailInfo.countryCode == 'AE'">
                <span v-if="detailInfo.gatewayId !== ''">{{ detailInfo.gatewayId }}</span>
                <span v-else>
                  <span>暂无</span>
                </span>
              </FormItem>
              <FormItem label="密码：" v-if="detailInfo.countryCode == 'SA' || detailInfo.countryCode == 'AE'">
                <span v-if="detailInfo.gatewayPassword">{{ detailInfo.gatewayPassword }}</span>
                <span v-else>暂无</span>
              </FormItem>
              <FormItem label="法国税号证书：" v-if="detailInfo.countryCode == 'FR'">
                <span v-if="detailInfo.frTaxCertificate">
                  <a :href="detailInfo.frTaxCertificate" target="_blank">{{ "法国税号证书" }}</a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 6px;">
            <p slot="title">服务信息</p>
            <Form :label-width="110">
              <FormItem label="订单号：">
                <span>{{ orderNo }}</span>
              </FormItem>
              <FormItem label="订单备注：">
                <span>{{ orderRemark }}</span>
              </FormItem>
              <FormItem label="服务号：">
                <span>{{ detailInfo.serverNo }}</span>
              </FormItem>
              <FormItem label="服务截止时间：">
                <span>{{ detailInfo.expirationTime }}</span>
              </FormItem>
              <FormItem label="申报状态：">
                <span>{{ progressStatus[detailInfo.progressBar] }}</span>
              </FormItem>
              <FormItem label="服务公司：">
                <span>{{ detailInfo.companyName }}</span>
              </FormItem>
              <FormItem label="服务名称：">
                <span>
                  {{
                    detailInfo.productFunctionCode == "1"
                      ? "税号注册"
                      : detailInfo.productFunctionCode == "2"
                      ? "税务申报"
                      : detailInfo.productFunctionCode == "3"
                      ? "税务补缴"
                      : detailInfo.productFunctionCode == "4"
                      ? "转代理"
                      : detailInfo.productFunctionCode == "5"
                      ? "注册+申报"
                      : ""
                  }}
                </span>
              </FormItem>
              <FormItem
                label="服务商："
                v-if="
                  detailInfo.countryNameZh === '法国' ||
                    detailInfo.countryNameZh === '德国' ||
                    detailInfo.countryNameZh === '意大利'
                "
              >
                <span>{{ detailInfo.supplierName || "暂无" }}</span>
              </FormItem>
              <FormItem label="服务商分配编码：">
                <span>{{ detailInfo.supplierAssignsServiceId }}</span>
                <Icon
                  class="editIcon"
                  type="ios-create-outline"
                  @click="(supplierServiceIDModal = true), (supplierServiceID = detailInfo.supplierAssignsServiceId)"
                />
              </FormItem>
              <FormItem label="国家：">
                <span>{{ detailInfo.countryNameZh }}</span>
              </FormItem>
              <FormItem label="创建时间：">
                <span>{{ detailInfo.createTime }}</span>
              </FormItem>
              <FormItem label="翻译件：">
                <span v-if="detailInfo.translationMaterial">
                  <a
                    :href="
                      detailInfo.translationMaterial.slice(0, 5) == 'http:'
                        ? detailInfo.translationMaterial.slice(0, 4) + 's' + detailInfo.translationMaterial.slice(4)
                        : detailInfo.translationMaterial
                    "
                    target="_blank"
                  >
                    {{ "翻译件" }}
                  </a>
                </span>
                <span v-else>{{ "暂无" }}</span>
              </FormItem>
              <FormItem label="审核时间：">
                <span>{{ detailInfo.materialAuditDate }}</span>
              </FormItem>
              <FormItem label="提交服务商时间：">
                <span>{{ detailInfo.submitServiceTime }}</span>
              </FormItem>
              <FormItem label="提交税局时间：">
                <span>{{ detailInfo.submitTaxTime }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 6px;">
            <p slot="title">用户信息</p>
            <Form :label-width="100">
              <FormItem label="用户昵称：">
                <span>{{ detailInfo.userNickname }}</span>
              </FormItem>
              <FormItem label="手机号：">
                <span>{{ detailInfo.userMobile }}</span>
              </FormItem>
              <FormItem label="用户级别：">
                <span>{{ "" }}</span>
              </FormItem>
              <FormItem label="公司名称：">
                <span>{{ detailInfo.userCompanyName }}</span>
              </FormItem>
              <FormItem label="地址：">
                <span>{{ detailInfo.userAddress }}</span>
              </FormItem>
            </Form>
          </Card>
          <Card style="margin-top: 6px;" class="operationLogs">
            <p slot="title">操作记录</p>
            <div v-if="consoleOperationLogs.length > 0" class="logsContent">
              <div v-for="(row, index) in consoleOperationLogs" :key="index">
                <div>
                  <p class="itemTop">{{ row.instruction }}</p>
                  <p v-if="row.remark">备注：{{ row.remark }}</p>
                  <p class="itemBottom">
                    <span style="margin-right:10px;">时间：{{ row.createTime }}</span>
                    <span>操作人：{{ row.adminUserNickName || row.adminUserMobile }}</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        v-model="submitTranslationMaterialModel"
        :title="detailInfo.translationMaterial ? '修改翻译件' : '上传翻译件'"
      >
        <div style="display:flex">
          <span>翻译件：</span>
          <div>
            <Upload
              ref="taxFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreTaxUpload"
              :on-success="translationMaterialUploadSuccess"
              :on-remove="removeTranslationMateria"
              style="width:260px"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
              </div>
            </Upload>
          </div>
        </div>
        <p style="color:rgb(247, 151, 40);">注：支持JPG、JPEG、PNG、PDF 和压缩包</p>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="submitTranslationMaterialModel = false">
            取消
          </Button>
          <Button type="primary" @click="sureUploadTranslationMaterial">确认</Button>
        </p>
      </Modal>
      <Modal v-model="submitServiceModal" title="提交资料确认">
        <p style="text-align:center;margin-bottom:10px">请输入提交服务商资料时间</p>
        <div style="display:flex;margin-bottom:10px;justify-content:center;">
          <div style="margin-right:10px">
            <DatePicker
              v-model="submitServiceTime"
              type="date"
              placeholder="请选择提交服务商资料时间"
              style="width: 200px"
            ></DatePicker>
          </div>
          <div>
            <Button type="primary" @click="todayTime('service')">今天</Button>
          </div>
        </div>
        <p style="color:rgb(247, 151, 40);text-align:center;margin-bottom:10px">
          温馨提示：提交后时间不能更改，请谨慎填写
        </p>
        <div slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="submitServiceModal = false">取消</Button>
          <Button type="primary" @click="submitServiceHandel">确认</Button>
        </div>
      </Modal>
      <Modal v-model="submitTaxModal" title="提交税局确认">
        <p style="text-align:center;margin-bottom:10px">请输入提交税局时间</p>
        <div style="display:flex;margin-bottom:10px;justify-content:center;">
          <div style="margin-right:10px">
            <DatePicker
              v-model="submitTaxTime"
              type="date"
              placeholder="请选择提交税局时间"
              style="width: 200px"
            ></DatePicker>
          </div>
          <div>
            <Button type="primary" @click="todayTime('tax')">今天</Button>
          </div>
        </div>
        <p style="color:rgb(247, 151, 40);text-align:center;margin-bottom:10px">
          温馨提示：提交后时间不能更改，请谨慎填写
        </p>
        <div slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="submitTaxModal = false">取消</Button>
          <Button type="primary" @click="submitTaxHandel">确认</Button>
        </div>
      </Modal>
      <!-- 审核荷兰授权书和申请函 -->
      <Modal v-model="NLshenhe" title="审核资料">
        <p>审核通过后开始提交注册</p>
        <p>
          <RadioGroup v-model="shenheAdite">
            <Radio label="1">
              <span>审核通过</span>
            </Radio>
            <Radio label="0">
              <span>资料不对，驳回</span>
            </Radio>
          </RadioGroup>
        </p>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="NLshenhe = false">取消</Button>
          <Button type="primary" @click="sureNLshenhe">确认</Button>
        </p>
      </Modal>
      <!-- 审核资料&审核税金到账 -->
      <Modal
        v-model="auditModal"
        @on-visible-change="modalState"
        :title="detailInfo.progressBar == 1 ? '审核资料' : '审核税金到账'"
        :width="[isAudit == '1' && detailInfo.countryNameZh == '英国' ? 600 : 450]"
      >
        <p>{{ detailInfo.progressBar == 1 ? "审核通过后开始提交注册" : "是否确认用户税金到账？" }}</p>
        <p>
          <RadioGroup v-model="isAudit">
            <Radio label="1">
              <span>{{ detailInfo.progressBar == 1 ? "审核通过" : "确认到账" }}</span>
            </Radio>
            <Radio label="0">
              <span>{{ detailInfo.progressBar == 1 ? "资料不对，驳回" : "税金有误，驳回" }}</span>
            </Radio>
          </RadioGroup>
        </p>

        <p v-show="isAudit == '1' && detailInfo.countryNameZh == '英国'" style="margin-top:20px">
          <span style="margin-right:20px">
            <span style="color:red;font-size:18px">*</span>
            选择注册地址
          </span>
          <Select v-model="registrarAddress">
            <Option value="3rd Floor,207 / 209 Regent Street,London,W1B 3HH" :key="1">
              3rd Floor,207 / 209 Regent Street,London,W1B 3HH
            </Option>
            <Option value="40 Argyle Place,Edinburgh,EH9 1JT" :key="2">40 Argyle Place,Edinburgh,EH9 1JT</Option>
            <Option value="132-134 Great Ancoats Street,Manchester,M4 6DE" :key="3">
              132-134 Great Ancoats Street,Manchester,M4 6DE
            </Option>
            <Option value="UNIT39STOLAVSCOURT,CITYBUSINESSCENTRE,LOWERROAD,GREATERLONDON,SE162XB" :key="4">
              UNIT39STOLAVSCOURT,CITYBUSINESSCENTRE,LOWERROAD,GREATERLONDON,SE162XB
            </Option>
          </Select>
        </p>
        <p v-show="isAudit == '0'">
          <Input v-model="remark" type="textarea" placeholder="请输入驳回原因" />
        </p>
        <div v-if="detailInfo.countryCode == 'IT' && detailInfo.supplierId != 50">
          <Checkbox v-model="needApiIT">API提交注册申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="detailInfo.countryCode == 'FR'">
          <Checkbox v-model="needApiFR">API提交注册申报（如未选择API申报，则需要线下进行申报处理）</Checkbox>
        </div>
        <div v-if="detailInfo.countryCode == 'FR' && detailInfo.progressBar == 33" style="margin-top:10px;">
          <Checkbox v-model="frRetaxInfo.disabledSingle">
            补缴税金（需要补缴税金时勾选,此内容会传输到法国软件商）
          </Checkbox>
          <div v-if="frRetaxInfo.disabledSingle">
            补缴金额：
            <Input v-model="frRetaxInfo.extraPrice" style="width:150px;margin:8px;" />
            元
            <Input
              v-for="(item, index) in frRetaxInfo.resonList"
              :key="index"
              v-model="item.reason"
              style="margin:8px;"
              placeholder="备注说明，每行最多512个字符"
              max-width="512"
            />
          </div>
        </div>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="auditModal = false">取消</Button>

          <Button v-if="isRowBtn" type="primary" @click="rowSureAudit">确认</Button>
          <Button v-else type="primary" @click="sureAudit">确认</Button>
        </p>
      </Modal>
      <Modal v-model="taxNumModal" title="录入税号">
        <Form :label-width="130">
          <FormItem label="VAT税号：" class="requiredItem">
            <Input
              v-model="addTaxNum.vatTaxNumber"
              placeholder="请输入VAT税号"
              @on-blur="changeEORI"
              style="width:200px"
            />
          </FormItem>
          <FormItem label="税号下发日期：" class="requiredItem">
            <DatePicker
              v-model="addTaxNum.taxIssueDate"
              type="date"
              placeholder="请选择税号下发日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="税号生效日期：" class="requiredItem">
            <DatePicker
              v-model="addTaxNum.taxEffectiveDate"
              type="date"
              placeholder="请选择税号生效日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="EORI号：" v-if="detailInfo.countryNameZh != '沙特'">
            <Input
              v-model="addTaxNum.eoriNumber"
              placeholder="请输入EORI号"
              :disabled="eoriDisabled"
              style="width:200px"
            />
          </FormItem>
          <FormItem label="VAT税号文件：">
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatTaxNumberFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatTaxNumberFile');
                }
              "
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem
            label="VAT证书："
            v-if="
              detailInfo.countryNameZh != '德国' &&
                detailInfo.countryNameZh != '意大利' &&
                detailInfo.countryNameZh != '沙特' &&
                detailInfo.countryNameZh != '阿联酋' &&
                detailInfo.countryNameZh != '西班牙'
            "
          >
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatCertificate');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatCertificate');
                }
              "
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem
            label="欧盟证书："
            v-if="detailInfo.countryNameZh == '德国' || detailInfo.countryNameZh == '西班牙'"
          >
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'deEuCertificate');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'deEuCertificate');
                }
              "
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="税务副本：" v-if="detailInfo.countryNameZh == '德国'">
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatTaxNumberCopyFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatTaxNumberCopyFile');
                }
              "
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem
            label="EORI文件："
            v-if="
              detailInfo.countryNameZh != '英国' &&
                detailInfo.countryNameZh != '沙特' &&
                detailInfo.countryNameZh != '阿联酋'
            "
          >
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'eoriNumberFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'eoriNumberFile');
                }
              "
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
          </FormItem>
          <FormItem label="gateway账号：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.gatewayId" placeholder="请输入gateway ID" style="width:200px" />
          </FormItem>
          <FormItem label="gateway密码：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.gatewayPassword" placeholder="请输入密码" style="width:200px" />
          </FormItem>
          <FormItem label="密钥：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.secret" placeholder="请输入密钥" style="width:200px" />
          </FormItem>
          <div v-if="detailInfo.countryNameZh == '沙特' || detailInfo.countryNameZh == '阿联酋'">
            <FormItem label="税局账号：" class="requiredItem">
              <Input v-model="addTaxNum.gatewayId" placeholder="请输入税局账号" style="width:200px" />
            </FormItem>
            <FormItem label="密码：" class="requiredItem">
              <Input v-model="addTaxNum.gatewayPassword" placeholder="请输入密码" style="width:200px" />
            </FormItem>
          </div>
        </Form>
        <p slot="footer">
          <Button @click="cancelEnter">取消</Button>
          <Button type="primary" @click="enterTaxNumInfo">提交</Button>
        </p>
      </Modal>
      <Modal v-model="editTaxNumModal" title="修改税号信息">
        <Form :label-width="130">
          <FormItem label="VAT税号：" class="requiredItem">
            <Input v-model="addTaxNum.vatTaxNumber" placeholder="请输入VAT税号" style="width:200px" :disabled="true" />
          </FormItem>
          <FormItem label="税号下发日期：" class="requiredItem">
            <DatePicker
              v-model="addTaxNum.taxIssueDate"
              type="date"
              placeholder="请选择税号下发日期"
              style="width: 200px"
              :disabled="true"
            ></DatePicker>
          </FormItem>
          <FormItem label="税号生效日期：" class="requiredItem">
            <DatePicker
              v-model="addTaxNum.taxEffectiveDate"
              type="date"
              placeholder="请选择税号生效日期"
              style="width: 200px"
              :disabled="true"
            ></DatePicker>
          </FormItem>
          <FormItem label="EORI号：" v-if="detailInfo.countryCode !== 'AE' && detailInfo.countryCode !== 'SA'">
            <Input v-model="addTaxNum.eoriNumber" placeholder="请输入EORI号" style="width:200px" />
          </FormItem>
          <FormItem label="VAT税号文件：">
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatTaxNumberFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatTaxNumberFile');
                }
              "
              :disabled="addTaxNum.vatTaxNumberFile !== ''"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatTaxNumberFile !== ''">
              <a :href="addTaxNum.vatTaxNumberFile" target="_blank">VAT税号文件</a>
              <Icon type="ios-close-circle" style="cursor:pointer;" @click.stop="removeItem('vatTaxNumberFile')" />
            </div>
          </FormItem>
          <FormItem
            label="VAT证书："
            v-if="
              detailInfo.countryNameZh != '德国' &&
                detailInfo.countryNameZh != '沙特' &&
                detailInfo.countryNameZh != '阿联酋'
            "
          >
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatCertificate');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatCertificate');
                }
              "
              :disabled="addTaxNum.vatCertificate !== ''"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatCertificate !== ''">
              <a :href="addTaxNum.vatCertificate" target="_blank">VAT证书</a>
              <Icon type="ios-close-circle" style="cursor:pointer;" @click.stop="removeItem('vatCertificate')" />
            </div>
          </FormItem>
          <FormItem label="DE欧盟证书：" v-if="detailInfo.countryNameZh == '德国'">
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'deEuCertificate');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'deEuCertificate');
                }
              "
              :disabled="addTaxNum.deEuCertificate !== ''"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.deEuCertificate !== ''">
              <a :href="addTaxNum.deEuCertificate" target="_blank">DE欧盟证书</a>
              <Icon type="ios-close-circle" style="cursor:pointer;" @click.stop="removeItem('deEuCertificate')" />
            </div>
          </FormItem>
          <FormItem label="税务副本：" v-if="detailInfo.countryNameZh == '德国'">
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'vatTaxNumberCopyFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'vatTaxNumberCopyFile');
                }
              "
              :disabled="addTaxNum.vatTaxNumberCopyFile !== ''"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.vatTaxNumberCopyFile !== ''">
              <a :href="addTaxNum.vatTaxNumberCopyFile" target="_blank">税务副本</a>
              <Icon type="ios-close-circle" style="cursor:pointer;" @click.stop="removeItem('vatTaxNumberCopyFile')" />
            </div>
          </FormItem>
          <FormItem
            label="EORI文件："
            v-if="
              detailInfo.countryNameZh != '英国' &&
                detailInfo.countryNameZh != '沙特' &&
                detailInfo.countryNameZh != '阿联酋'
            "
          >
            <Upload
              ref="vatFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beforeVatFileUpload"
              :on-success="
                (res, file, fileList) => {
                  vatFileUploadSuccess(res, file, fileList, 'eoriNumberFile');
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeVatFile(file, fileList, 'eoriNumberFile');
                }
              "
              :disabled="addTaxNum.eoriNumberFile !== ''"
              :show-upload-list="false"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <p>请拖拽文件到此区域上传或点击上传</p>
              </div>
            </Upload>
            <div v-if="addTaxNum.eoriNumberFile !== ''">
              <a :href="addTaxNum.eoriNumberFile" target="_blank">EORI文件</a>
              <Icon type="ios-close-circle" style="cursor:pointer;" @click.stop="removeItem('eoriNumberFile')" />
            </div>
          </FormItem>
          <FormItem label="gateway账号：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.gatewayId" placeholder="请输入gateway ID" style="width:200px" />
          </FormItem>
          <FormItem label="gateway密码：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.gatewayPassword" placeholder="请输入密码" style="width:200px" />
          </FormItem>
          <FormItem label="密钥：" v-if="detailInfo.countryNameZh == '英国'">
            <Input v-model="addTaxNum.secret" placeholder="请输入密钥" style="width:200px" />
          </FormItem>
          <div v-if="detailInfo.countryNameZh == '沙特' || detailInfo.countryNameZh == '阿联酋'">
            <FormItem label="税局账号（选填）：">
              <Input v-model="addTaxNum.gatewayId" placeholder="请输入税局账号" style="width:200px" />
            </FormItem>
            <FormItem label="密码（选填）：">
              <Input v-model="addTaxNum.gatewayPassword" placeholder="请输入密码" style="width:200px" />
            </FormItem>
          </div>
        </Form>
        <p slot="footer">
          <Button @click="editTaxNumModal = false">取消</Button>
          <Button type="primary" @click="editTaxNumInfo">提交</Button>
        </p>
      </Modal>
      <Modal
        v-model="fileTaxModal"
        :title="
          detailInfo.progressBar == 4 ? '填写报税信息' : detailInfo.progressBar == 19 ? '填写报税信息' : '修改报税信息'
        "
      >
        <Form :model="fileTaxForm" label-position="top">
          <FormItem label="下一次申报区间：">
            <DatePicker
              :type="detailInfo.countryCode == 'SA' ? 'date' : detailInfo.countryCode == 'AE' ? 'date' : 'month'"
              @on-change="dateChange($event, 0)"
              placeholder="请选择下一次申报开始时间"
              style="width:200px;margin-right:10px;"
            ></DatePicker>
            <DatePicker
              :type="detailInfo.countryCode == 'SA' ? 'date' : detailInfo.countryCode == 'AE' ? 'date' : 'month'"
              @on-change="dateChange($event, 1)"
              placeholder="请选择下一次申报结束时间"
              style="width:200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="申报周期：" label-position="top">
            <Select v-model="fileTaxForm.periodType" clearable placeholder="请选择申报周期" style="width:300px;">
              <Option
                :value="item.status"
                v-for="(item, index) in declearList"
                :disabled="detailInfo.countryCode == 'CZ' && item.status != 0"
                :key="index"
              >
                {{ item.type }}
              </Option>
            </Select>
          </FormItem>
          <div v-if="detailInfo.countryCode == 'PL'">
            <FormItem label="银行名称（Bank Name）：">
              <Input v-model="fileTaxForm.bureauBankName"></Input>
            </FormItem>
            <FormItem label="银行账号（IBAN）：">
              <Input v-model="fileTaxForm.bureauBankAccount"></Input>
            </FormItem>
            <FormItem label="BIC：">
              <Input v-model="fileTaxForm.bureauSwiftBic"></Input>
            </FormItem>
            <FormItem label="银行地址（Bank Address）：">
              <Input v-model="fileTaxForm.bureauBankAddress"></Input>
            </FormItem>
          </div>
        </Form>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="fileTaxModal = false">取消</Button>
          <Button type="primary" @click="sureFileTax">确认</Button>
        </p>
      </Modal>
      <Modal v-model="uploadReceiptModal" @on-visible-change="modalState" title="上传回执">
        <Upload
          ref="declareFile"
          type="drag"
          :action="fileUpload"
          :data="{ prefix: '' }"
          :before-upload="beroreDeclareUpload"
          :on-success="
            (res, file, fileList) => {
              declareUploadSuccess(res, file, fileList, 1);
            }
          "
          :on-remove="
            (file, fileList) => {
              removeDeclare(file, fileList, 1);
            }
          "
          style="width:260px"
          v-if="detailInfo.countryCode == 'GB' || detailInfo.countryCode == 'DE'"
        >
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <div
          v-if="
            detailInfo.countryCode == 'CZ' ||
              detailInfo.countryCode == 'AT' ||
              detailInfo.countryCode == 'IT' ||
              detailInfo.countryCode == 'FR' ||
              detailInfo.countryCode == 'ES' ||
              detailInfo.countryCode == 'NL' ||
              detailInfo.countryCode == 'PL'
          "
        >
          <p v-if="detailInfo.countryCode == 'IT' && detailInfo.supplierId == 50">申报回执（必填）：</p>
          <p v-else>申报回执（选填）：</p>
          <Upload
            ref="declareFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUpload"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 1);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 1);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执（可上传多张）</span>
            </div>
          </Upload>
          <p
            v-if="
              detailInfo.countryCode !== 'CZ' &&
                detailInfo.countryCode !== 'AT' &&
                (detailInfo.countryCode !== 'IT' || (detailInfo.countryCode == 'IT' && detailInfo.supplierId != 50))
            "
          >
            扣款回执（选填）：
          </p>
          <Upload
            ref="declareFile"
            v-if="
              detailInfo.countryCode !== 'CZ' &&
                detailInfo.countryCode !== 'AT' &&
                (detailInfo.countryCode !== 'IT' || (detailInfo.countryCode == 'IT' && detailInfo.supplierId != 50))
            "
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUploadDebitReceipt"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 2);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 2);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传扣款回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode == 'SA'">
          <p>发票开具通知：</p>
          <Upload
            ref="declareFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUpload"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 5);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 5);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <div v-if="!isRowBtn && tableData.length != 0 && tableData[0].declareRule != 2">
            <p>纳税付款发票信件：</p>
            <Upload
              ref="declareFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreDeclareUpload"
              :on-success="
                (res, file, fileList) => {
                  declareUploadSuccess(res, file, fileList, 6);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeDeclare(file, fileList, 6);
                }
              "
              style="width:260px"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload
              ref="declareFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreDeclareUpload"
              :on-success="
                (res, file, fileList) => {
                  declareUploadSuccess(res, file, fileList, 7);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeDeclare(file, fileList, 7);
                }
              "
              style="width:260px"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <div v-if="isRowBtn && rowData.declareRule != 2">
            <p>纳税付款发票信件：</p>
            <Upload
              ref="declareFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreDeclareUpload"
              :on-success="
                (res, file, fileList) => {
                  declareUploadSuccess(res, file, fileList, 6);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeDeclare(file, fileList, 6);
                }
              "
              style="width:260px"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
            <p>纳税付款系统发票：</p>
            <Upload
              ref="declareFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreDeclareUpload"
              :on-success="
                (res, file, fileList) => {
                  declareUploadSuccess(res, file, fileList, 7);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeDeclare(file, fileList, 7);
                }
              "
              style="width:260px"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>点击上传申报回执</span>
              </div>
            </Upload>
          </div>
          <p>税务申报接收通知：</p>
          <Upload
            ref="declareFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUpload"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 8);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 8);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
          <p>税务申请表：</p>
          <Upload
            ref="declareFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUpload"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 9);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 9);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <div v-if="detailInfo.countryCode == 'AE'">
          <p>税金收款回执：</p>
          <Upload
            ref="declareFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beroreDeclareUpload"
            :on-success="
              (res, file, fileList) => {
                declareUploadSuccess(res, file, fileList, 10);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeDeclare(file, fileList, 10);
              }
            "
            style="width:260px"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span>点击上传申报回执</span>
            </div>
          </Upload>
        </div>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="uploadReceiptModal = false">取消</Button>
          <Button type="primary" @click="sureUpload">确认</Button>
        </p>
      </Modal>
      <Modal v-model="taxFileModal" @on-visible-change="modalState" title="上传缴税凭证">
        <Upload
          ref="taxFile"
          type="drag"
          :action="fileUpload"
          :data="{ prefix: '' }"
          :before-upload="beroreTaxUpload"
          :on-success="taxUploadSuccess"
          :on-remove="removetax"
          style="width:260px"
        >
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="taxFileModal = false">取消</Button>
          <Button type="primary" @click="sureUploadTax">确认</Button>
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
          <Button type="primary" ghost style="margin-right:20px;" @click="vatCertificateFileModal = false">取消</Button>
          <Button type="primary" @click="sureUploadVATcar">确认</Button>
        </p>
      </Modal>
      <Modal v-model="vatTaxNumberFileModal" title="VAT税号文件">
        <Upload
          ref="taxFile"
          type="drag"
          :action="fileUpload"
          :data="{ prefix: '' }"
          :before-upload="beroreVATcarUpload"
          :on-success="vatTaxNumberFileUploadSuccess"
          :on-remove="removeVatTaxNumberFile"
          style="width:260px"
        >
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="vatTaxNumberFileModal = false">取消</Button>
          <Button type="primary" @click="sureUploadVatTaxNumberFile">确认</Button>
        </p>
      </Modal>
      <!-- 开始报税弹窗 -->
      <Modal v-model="startTax" title="选择报税时间" :mask-closable="false" :closable="false">
        <p>VAT税号: {{ detailInfo.vatTaxNumber }}</p>
        <p>公司英文名称: {{ detailInfo.companyName }}</p>
        <Table border :loading="tableLoading" :columns="columns3" :data="VatObligationsData">
          <template slot="declareInterval" slot-scope="{ row }">{{ row.start }}至{{ row.end }}</template>
          <template slot="operateDeclare" slot-scope="{ row }">
            <Button type="primary" @click="goToDeclare(row)">去报税</Button>
          </template>
        </Table>
        <div slot="footer"></div>
      </Modal>
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
          <Button type="primary" ghost style="margin-right:20px;" @click="authorizationHauge = false">取消</Button>
          <Button type="primary" @click="sureReceived">确认收到</Button>
        </p>
      </Modal>
      <!-- 录入海牙信息 -->
      <Modal v-model="enterHaugeInfo" :mask-closable="false" title="录入海牙信息">
        <Upload
          ref="declareFile"
          type="drag"
          :action="fileUpload"
          :data="{ prefix: '' }"
          :before-upload="beroreHaugeload"
          :on-success="
            (res, file, fileList) => {
              declareUploadSuccess(res, file, fileList, 3);
            }
          "
          :on-remove="
            (file, fileList) => {
              removeDeclare(file, fileList, 3);
            }
          "
          style="width:260px"
          v-if="detailInfo.countryCode != 'IT'"
        >
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
      <!-- 填写寄送海牙单号 -->
      <Modal v-model="SIRETMadol" :mask-closable="false" title="录入SIRET号">
        <Input v-model="SIRETNumber"></Input>
        <p slot="footer">
          <Button type="primary" @click="sureEnterSIRETNumber">确认</Button>
        </p>
      </Modal>
      <!-- 填写寄送税局的物流单号 -->
      <Modal v-model="sendTaxBox" :mask-closable="false" title="填写寄送税局的物流单号">
        <Input v-model="taxSendNumber"></Input>
        <p slot="footer">
          <Button type="primary" @click="sureTaxTrankingNumber">确认</Button>
        </p>
      </Modal>
      <Modal v-model="viewInformationModal" footer-hide title="注册信息" class-name="viewInformation">
        <Form class="form">
          <!-- 公司信息 -->
          <FormItem label="公司中文名称：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyNameZh ? submitForm.companyNameZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="公司英文名称：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyNameEn ? submitForm.companyNameEn : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="公司中文地址："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyAddressZh ? submitForm.companyAddressZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="邮编号码："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'ES' || submitForm.countryCode === 'DE'"
            :label-width="200"
          >
            <span style="word-break: break-all">{{ submitForm.shopPostCode ? submitForm.shopPostCode : "暂无" }}</span>
          </FormItem>
          <FormItem label="公司英文地址(亚马逊后台地址）：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyAddressEnCountry }}{{ submitForm.companyAddressEnCity
              }}{{ submitForm.companyAddressEn }}
            </span>
          </FormItem>
          <FormItem
            label="公司邮箱："
            v-if="submitForm.countryCode === 'DE' || submitForm.countryCode === 'NL'"
            :label-width="200"
          >
            <span style="word-break: break-all">{{ submitForm.companyEmail ? submitForm.companyEmail : "暂无" }}</span>
          </FormItem>
          <FormItem label="公司电话：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">{{ submitForm.companyTel ? submitForm.companyTel : "暂无" }}</span>
          </FormItem>
          <FormItem
            label="公司统一社会信用代码："
            v-if="
              submitForm.countryCode === 'GB' ||
                submitForm.countryCode === 'IT' ||
                submitForm.countryCode === 'ES' ||
                submitForm.countryCode === 'FR'
            "
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyCreditCode ? submitForm.companyCreditCode : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="公司注册资本："
            v-if="submitForm.countryCode === 'ES' || submitForm.countryCode === 'FR'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyRegisteredCapital ? submitForm.companyRegisteredCapital : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="公司营业执照注册城市：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyRegisteredCityZh ? submitForm.companyRegisteredCityZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="公司成立日期："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonBirthday ? submitForm.companyLegalPersonBirthday : "暂无" }}
            </span>
          </FormItem>
          <!-- 法人 -->
          <FormItem
            label="法人中文名字："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonZh ? submitForm.companyLegalPersonZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人英文名字：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonEn ? submitForm.companyLegalPersonEn : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人出生日期：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonBirthday ? submitForm.companyLegalPersonBirthday : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="婚姻状况：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span v-if="submitForm.legalPersonMaritalStatus !== ''">
              {{ submitForm.legalPersonMaritalStatus === 1 ? "未婚" : "已婚" }}
            </span>
            <span v-else>
              暂无
            </span>
          </FormItem>
          <FormItem
            label="法人性别："
            v-if="submitForm.countryCode === 'ES' || submitForm.countryCode === 'FR'"
            :label-width="200"
          >
            <span v-if="submitForm.legalPersonSex !== ''">{{ submitForm.legalPersonSex === 1 ? "男" : "女" }}</span>
            <span v-else>
              暂无
            </span>
          </FormItem>
          <FormItem label="法人出生省份：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.legalPersonBirthplaceProvinceZh ? submitForm.legalPersonBirthplaceProvinceZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人出生城市：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.legalPersonBirthplaceCityZh ? submitForm.legalPersonBirthplaceCityZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="身份证/护照号码："
            v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonCard ? submitForm.companyLegalPersonCard : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="法人出生地："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'IT'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.legalPersonBirthplaceCityEn ? submitForm.legalPersonBirthplaceCityEn : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="法人护照/身份证号码（个人店铺必填）："
            v-if="submitForm.countryCode === 'GB'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonCard ? submitForm.companyLegalPersonCard : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="法人邮箱："
            v-if="submitForm.countryCode === 'DE' || submitForm.countryCode === 'GB'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonEmail ? submitForm.companyLegalPersonEmail : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人电话：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonMobile ? submitForm.companyLegalPersonMobile : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人身份证中文地址：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonCardAddressZh ? submitForm.companyLegalPersonCardAddressZh : "暂无" }}
            </span>
          </FormItem>
          <FormItem
            label="法人身份证地址英文："
            v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES' || submitForm.countryCode === 'FR'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonCardAddress ? submitForm.companyLegalPersonCardAddress : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="法人身份证地址：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyLegalPersonCardAddress ? submitForm.companyLegalPersonCardAddress : "暂无" }}
            </span>
          </FormItem>

          <!-- 店铺 -->
          <FormItem label="税号生效日期：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.taxEffectiveDate ? submitForm.taxEffectiveDate : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="店铺名称：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">{{ submitForm.shopName ? submitForm.shopName : "暂无" }}</span>
          </FormItem>
          <FormItem label="店铺链接：" v-if="submitForm.countryCode !== 'GB'" :label-width="200">
            <span v-if="submitForm.shopHref !== ''">
              <a :href="submitForm.shopHref" target="_blank">店铺链接</a>
            </span>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem
            label="销售平台名称："
            v-if="submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.shopSalePlatformName ? submitForm.shopSalePlatformName : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="描述下公司的经营内容：" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.companyBusinessModeDescribe ? submitForm.companyBusinessModeDescribe : "暂无" }}
            </span>
          </FormItem>
          <!-- <FormItem label='邮编号码：' v-if="submitForm.countryCode === 'DE' || submitForm.countryCode === 'ES'" :label-width="200">
                    <span>{{submitForm.postCode ? submitForm.postCode : '暂无'}}</span>
                  </FormItem> -->
          <FormItem label="未来12个月预计销售额（英镑）：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <span>{{ submitForm.shopSalePlan ? submitForm.shopSalePlan : "暂无" }}</span>
          </FormItem>
          <FormItem label="未来一年预计销售额（欧元）：" v-if="submitForm.countryCode === 'FR'" :label-width="200">
            <span>{{ submitForm.shopSalePlan ? submitForm.shopSalePlan : "暂无" }}</span>
          </FormItem>
          <FormItem
            label="货物进口及配送流程："
            v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span style="word-break: break-all">
              {{ submitForm.shippingProcess ? submitForm.shippingProcess : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="西班牙本地银行账户信息：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.localBankAccountInfo ? submitForm.localBankAccountInfo : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="是否使用西班牙任何仓库：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <span>{{ submitForm.useEntrepot === 1 ? "是" : "否" }}</span>
          </FormItem>
          <FormItem label="是否使用意大利任何仓库：" v-if="submitForm.countryCode === 'IT'" :label-width="200">
            <span>{{ submitForm.useEntrepot === 1 ? "是" : "否" }}</span>
          </FormItem>
          <FormItem label="是否使用捷克任何仓库：" v-if="submitForm.countryCode === 'CZ'" :label-width="200">
            <span>{{ submitForm.useEntrepot === 1 ? "是" : "否" }}</span>
          </FormItem>
          <FormItem
            label="是否开通泛欧："
            v-if="submitForm.countryCode === 'IT' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span>{{ submitForm.dredgeEuronext === 1 ? "是" : "否" }}</span>
          </FormItem>
          <FormItem label="今年预计销售额（欧元）：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span>{{ submitForm.shopPredictSale ? submitForm.shopPredictSale : "暂无" }}</span>
          </FormItem>
          <FormItem label="明年预计销售额（欧元）：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span>{{ submitForm.shopNextYearSale ? submitForm.shopNextYearSale : "暂无" }}</span>
          </FormItem>
          <FormItem
            label="是否有其它欧盟税号："
            v-if="submitForm.countryCode !== 'GB' || submitForm.countryCode === 'ES'"
            :label-width="200"
          >
            <span>{{ submitForm.shopOtherEuTaxNumber ? submitForm.shopOtherEuTaxNumber : "暂无" }}</span>
          </FormItem>
          <FormItem label="德国仓库地址：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.shopEntrepotAddress ? submitForm.shopEntrepotAddress : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="物流承运商公司名称：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.shopLogisticsCompanyName ? submitForm.shopLogisticsCompanyName : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="物流承运商地址：" v-if="submitForm.countryCode === 'DE'" :label-width="200">
            <span style="word-break: break-all">
              {{ submitForm.shopLogisticsCompany ? submitForm.shopLogisticsCompany : "暂无" }}
            </span>
          </FormItem>
          <FormItem label="税率：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <span>{{ submitForm.shopTaxRate === 0 ? "低税率" : "标准税率" }}</span>
          </FormItem>
          <FormItem label="是否有EORI号：" :label-width="200">
            <span>{{ submitForm.needEoriNumber == 0 ? "否" : "是" }}</span>
          </FormItem>
          <FormItem
            label="营业执照扫描件："
            :label-width="200"
            v-if="!(submitForm.countryCode == 'CZ' && submitForm.companyType == 3)"
          >
            <a
              v-if="submitForm.companyBusinessLicense !== ''"
              :href="submitForm.companyBusinessLicense"
              target="_blank"
            >
              营业执照扫描件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem
            label="商业登记证/海外证书："
            :label-width="200"
            v-if="submitForm.countryCode == 'CZ' && submitForm.companyType == 3"
          >
            <a
              v-if="submitForm.companyBusinessLicenseCopy !== ''"
              :href="submitForm.companyBusinessLicenseCopy"
              target="_blank"
            >
              商业登记证/海外证书
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="商业登记证BR扫描件：" :label-width="200">
            <a
              v-if="submitForm.companyBusinessRegistrationBr !== ''"
              :href="submitForm.companyBusinessRegistrationBr"
              target="_blank"
            >
              商业登记证BR扫描件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="公司注册证明书CI扫描件：" :label-width="200">
            <a v-if="submitForm.companyRegistrationCi !== ''" :href="submitForm.companyRegistrationCi" target="_blank">
              公司注册证明书CI扫描件：
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="法团成立表格NNC1扫描件：" :label-width="200">
            <a
              v-if="submitForm.companyCorporateFoundingNnc1 !== ''"
              :href="submitForm.companyCorporateFoundingNnc1"
              target="_blank"
            >
              法团成立表格NNC1扫描件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="身份证正反面扫描件：" :label-width="200">
            <a
              v-if="submitForm.companyLegalPersonCardFront !== ''"
              :href="submitForm.companyLegalPersonCardFront"
              target="_blank"
            >
              身份证正反面扫描件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="护照扫描件：" :label-width="200">
            <a
              v-if="submitForm.companyLegalPersonCardPassport !== ''"
              :href="submitForm.companyLegalPersonCardPassport"
              target="_blank"
            >
              护照扫描件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem
            label="公司信用报告："
            v-if="submitForm.countryCode === 'ES' || submitForm.countryCode === 'IT'"
            :label-width="200"
          >
            <a v-if="submitForm.companyCreditReport !== ''" :href="submitForm.companyCreditReport" target="_blank">
              公司信用报告
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="亚马逊证明文件：" v-if="submitForm.countryCode === 'ES'" :label-width="200">
            <a v-if="submitForm.amazonProveFile !== ''" :href="submitForm.amazonProveFile" target="_blank">
              亚马逊证明文件
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem
            label="后台店铺截图："
            v-if="submitForm.countryCode === 'FR' || submitForm.countryCode === 'GB' || submitForm.countryCode === 'DE'"
            :label-width="200"
          >
            <a v-if="submitForm.shopConsoleScreenshot !== ''" :href="submitForm.shopConsoleScreenshot" target="_blank">
              后台店铺截图
            </a>
            <span v-else>暂无</span>
          </FormItem>

          <FormItem label="工作证明：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a
              v-if="submitForm.certificateOfEmployment !== ''"
              :href="submitForm.certificateOfEmployment"
              target="_blank"
            >
              工作证明
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="租房合同：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a v-if="submitForm.leaseAgreement !== ''" :href="submitForm.leaseAgreement" target="_blank">租房合同</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="结婚证：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a v-if="submitForm.marriageLicense !== ''" :href="submitForm.marriageLicense" target="_blank">结婚证</a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="离婚证：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a v-if="submitForm.divorceCertificate !== ''" :href="submitForm.divorceCertificate" target="_blank">
              离婚证
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="房产证：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a
              v-if="submitForm.houseProprietaryCertificate !== ''"
              :href="submitForm.houseProprietaryCertificate"
              target="_blank"
            >
              房产证
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="工作证明：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a
              v-if="submitForm.certificateOfEmployment !== ''"
              :href="submitForm.certificateOfEmployment"
              target="_blank"
            >
              工作证明
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="出生证/户口本：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a v-if="submitForm.birthCertificate !== ''" :href="submitForm.birthCertificate" target="_blank">
              出生证/户口本
            </a>
            <span v-else>暂无</span>
          </FormItem>
          <FormItem label="房屋贷款明细：" v-if="submitForm.countryCode === 'GB'" :label-width="200">
            <a v-if="submitForm.otherCertificate !== ''" :href="submitForm.otherCertificate" target="_blank">
              房屋贷款明细
            </a>
            <span v-else>暂无</span>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="填写gateway" v-model="getWayModal" @on-ok="addGetWatId" @on-cancel="getWayModal = false">
        <Form>
          <FormItem label="getway账号：" :label-width="130">
            <Input v-model="gateWayForm.account"></Input>
          </FormItem>
          <FormItem label="getway密码：" :label-width="130">
            <Input v-model="gateWayForm.password"></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="录入发票号" @on-visible-change="modalState" v-model="invoicaBoxShow">
        <Form>
          <FormItem label="发票号：" :label-width="130">
            <Input v-model="invoiceInfo.invoiceNumber"></Input>
          </FormItem>

          <FormItem label="发票号文件（选填）：" :label-width="130">
            <Upload
              ref="declareFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreHaugeload"
              :on-success="
                (res, file, fileList) => {
                  declareUploadSuccess(res, file, fileList, 4);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeDeclare(file, fileList, 4);
                }
              "
              style="width:260px"
              v-if="detailInfo.countryCode != 'IT'"
            >
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
              </div>
            </Upload>
          </FormItem>
        </Form>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right:20px;" @click="invoicaBoxShow = false">取消</Button>
          <Button type="primary" @click="submitInvice">确认</Button>
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
        <Select clearable v-model="supplierId" @on-change="supplierSelectFun" placeholder="选择服务商">
          <Option v-for="(item, index) in SupplierByConditionList" :value="item.id" :key="index">
            {{ item.shortName }}
          </Option>
        </Select>
        <p slot="footer">
          <Button type="primary" @click="supplierModal = false">确认</Button>
        </p>
      </Modal>
      <Modal v-model="resonModelFR" :title="resonModelTitle">
        <div>
          <p>失败原因：{{ frReason }}</p>
        </div>
        <div slot="footer" v-if="declareRow.declarationStatus == 3">
          <Button @click="resonModelFR = false">取消</Button>
          <Button type="primary" @click="submitFRagain">重新提交</Button>
        </div>
      </Modal>
    </div>
    <Modal title="年报详情" v-model="deYearDetail" width="1000" footer-hide>
      <Row>
        <Col span="12">
          <span class="tax-info-name">公司英文名称：</span>
          <span class="tax-info-value">{{ detailInfo.companyNameEn }}</span>
        </Col>
        <Col span="12">
          <span class="tax-info-name">VAT税号：</span>
          <span class="tax-info-value">{{ detailInfo.vatTaxNumber }}</span>
        </Col>
      </Row>
      <Row style="margin-top:10px;">
        <Col span="12">
          <span class="tax-info-name">年度申报时间/年：</span>
          <span class="tax-info-value">{{ thatDEinfo.year }}年</span>
        </Col>
        <Col span="12">
          <span class="tax-info-name">申报区间：</span>
          <span class="tax-info-value">{{ thatDEinfo.beginTime }}至{{ thatDEinfo.endTime }}</span>
        </Col>
      </Row>
      <Divider />
      <p>
        申报回执：
        <a target="_blank" :href="thatDEinfo.declareReceipt" v-if="thatDEinfo.declareReceipt != ''">查看</a>
      </p>
      <p style="margin:10px 0;">申报数据：</p>
      <Table :data="deAnnalsData" :columns="deAnnalsColumns" border>
        <template slot="fillDiscount" slot-scope="{ row }">
          <div
            @click="
              discountBox = true;
              dataIndex = row._index;
            "
            style="cursor:pointer;"
          >
            查看
          </div>
        </template>
        <template slot="declareReceipt" slot-scope="{ row }">
          <div>
            <span v-if="row.declareReceipt == ''">暂无</span>
            <a v-else :href="row.declareReceipt" target="_blank">查看</a>
          </div>
        </template>
        <template slot="payReceipt" slot-scope="{ row }">
          <div>
            <span v-if="row.payReceipt == ''">暂无</span>
            <a v-else :href="row.payReceipt" target="_blank">查看</a>
          </div>
        </template>
      </Table>
    </Modal>
    <Modal v-model="discountBox" title="抵扣金额" :mask-closable="false">
      <Form :model="deAnnalsData[dataIndex]" :label-width="127" v-if="deAnnalsData.length > 0">
        <FormItem label="发票抵扣">
          <Input
            v-model="deAnnalsData[dataIndex].invoiceDeductiontPrice"
            placeholder="请输入发票抵扣金额"
            style="width:200px;margin-right:10px;"
          ></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="增值税抵扣">
          <Input
            v-model="deAnnalsData[dataIndex].c88DeductiontPrice"
            placeholder="请输入增值税抵扣"
            style="width:200px;margin-right:10px;"
          ></Input>
          EUR（欧元）
        </FormItem>
        <FormItem label="其它抵扣">
          <Input
            v-model="deAnnalsData[dataIndex].euDeductiontPrice"
            placeholder="请输入其它抵扣"
            style="width:200px;margin-right:10px;"
          ></Input>
          EUR（欧元）
        </FormItem>
      </Form>
      <div slot="footer" class="discount-footer">
        <Button type="primary" @click="discountBox = false">确认</Button>
      </div>
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
    <Modal v-model="taxModal" title="报税信息" width="800">
      <div v-if="JSON.stringify(taxBaseData) != '{}'">
        <Row>
          <Col span="12">
            <span class="tax-info-name">VAT税号</span>
            <span class="tax-info-value">{{ taxBaseData.vatTaxNumber }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">含税销售额</span>
            <span class="tax-info-value">{{ taxBaseData.includTaxPrice }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">报税区间</span>
            <span class="tax-info-value">
              {{ taxBaseData.beginTime.slice(0, 7) }}至{{ taxBaseData.endTime.slice(0, 7) }}
            </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">不含税销售额</span>
            <span class="tax-info-value">{{ taxBaseData.excludeTaxPrice }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">抵扣总金额</span>
            <span class="tax-info-value">{{ taxBaseData.deductionPrice }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">销项税金</span>
            <span class="tax-info-value">{{ taxBaseData.taxAmtTotal }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">最终缴税金额</span>
            <span class="tax-info-value">{{ taxBaseData.allTaxPrice }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">亚马逊销售文件</span>
            <!-- .slice(0,5)=='http:'?(taxBaseData.sellFile.slice(0,4)+'s'+taxBaseData.sellFile.slice(4)):taxBaseData.sellFile -->
            <span class="tax-info-value">
              <a
                :href="
                  taxBaseData.sellFile.slice(0, 5) == 'http:'
                    ? taxBaseData.sellFile.slice(0, 4) + 's' + taxBaseData.sellFile.slice(4)
                    : taxBaseData.sellFile
                "
                v-if="taxBaseData.sellFile != ''"
                target="_blank"
              >
                点击下载
              </a>
            </span>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <span class="tax-info-name">税金确认单</span>
            <span class="tax-info-value">
              <a href="javascript:void(0);" @click="downLoadShuijinForms(taxBaseData)">点击查看</a>
            </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">其他平台销售额</span>
            <span class="tax-info-value">{{ taxBaseData.otherIncludTaxAmt }}</span>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <span class="tax-info-name">其他平台销售额文件</span>
            <span class="tax-info-value">
              <a
                :href="
                  taxBaseData.otherSaleFileUrl.slice(0, 5) == 'http:'
                    ? taxBaseData.otherSaleFileUrl.slice(0, 4) + 's' + taxBaseData.otherSaleFileUrl.slice(4)
                    : taxBaseData.otherSaleFileUrl
                "
                v-if="taxBaseData.otherSaleFileUrl != ''"
                target="_blank"
              >
                点击下载
              </a>
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
          <template slot="deductionFile" slot-scope="{ row }">
            <div>
              <a :href="row.deductionFile" target="_blank">{{ row.fileOriginalName }}</a>
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
          <DatePicker
            placement="bottom-end"
            v-model="deductionForm.billDate"
            style="width:300px;"
            placeholder="请选择单据日期"
          ></DatePicker>
        </FormItem>
        <FormItem label="抵扣金额：" prop="deductiontAmt">
          <Input placeholder="请输入抵扣金额" style="width:300px;" v-model="deductionForm.deductiontAmt"></Input>
        </FormItem>
        <FormItem label="抵扣凭证：" prop="deductionFile">
          <Upload
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :before-upload="beforeUploadHandlerDeductionFile"
            :on-success="
              (res, file, fileList) => {
                successHandlerDeductionFile(res, file, fileList, 'deductionFile');
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandlerDeductionFile(file, fileList, 'deductionFile');
              }
            "
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
            :show-upload-list="false"
          >
            <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
              <span v-if="deductionForm.deductionFile == ''">请拖拽文件到此区域上传或点击上传</span>
              <span v-else>点击或拖拽文件到此区域重新上传</span>
            </div>
          </Upload>
          <div v-if="deductionForm.deductionFile != ''">
            <a :href="deductionForm.deductionFile" target="_blank">{{ deductionForm.fileOriginalName }}</a>
            <Icon type="ios-close-circle" @click.stop="removeHandlerDeductionFile('', '', 'deductionFile')" />
          </div>
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="deductionFormSubmit(1)">确定</Button>
        <Button type="primary" @click="deductionFormSubmit(2)">删除</Button>
      </div>
    </Modal>
    <Modal v-model="updateStatus" title="更改状态">
      <p>
        当前状态：
        <span>{{ progressStatus[updateStatusObj.status] }}</span>
      </p>
      <br />
      <div>
        <p>更改状态为</p>
        <br />
        <RadioGroup v-model="updateStatusData.status">
          <Radio label="4" v-if="updateStatusObj.status == 20">注册完成</Radio>

          <Radio
            label="21"
            v-if="
              updateStatusObj.status == 18 ||
                updateStatusObj.status == 22 ||
                (updateStatusObj.status == 25 &&
                  updateStatusObj.countryCode != 'GB' &&
                  updateStatusObj.countryCode != 'DE')
            "
          >
            待提交申报
          </Radio>
          <!-- && (updateStatusObj.countryCode=='AE' || updateStatusObj.countryCode=='SA') -->
          <Radio label="22" v-if="updateStatusObj.status == 25">待缴纳税金</Radio>
        </RadioGroup>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="updateStatus = false">取消</Button>
        <Button type="primary" @click="sureUpdateStatus">确认</Button>
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
import * as API from "@/api/taxService/workOrder.js";
import * as API1 from "@/api/taxService/regAndDeclare.js";
import * as API2 from "@/api/taxService/taxModule.js";
import * as APIDE from "@/api/taxService/annalsDE.js";
import { getToken } from "@/libs/util";
import { Throttle } from "@/libs/throttle";
export default {
  //isService是客服工作台调用
  props: ["id", "progressBar", "userId", "isService"],
  data() {
    return {
      supplierServiceIDModal: false,
      translationMaterial: "",
      submitTranslationMaterialModel: false,
      submitServiceTime: "",
      submitTaxTime: "",
      submitServiceModal: false,
      submitTaxModal: false,
      supplierServiceID: "",
      alist: ["德国", "法国", "意大利", "德国", "法国", "意大利", "德国", "法国", "意大利", "德国", "法国", "意大利"],
      auditForm: {
        status: "",
        remark: "",
        workId: ""
      },
      updateStatusData: {
        status: ""
      },
      updateStatusObj: {},
      shopSalePlan: "",
      updateStatus: false,
      spinShow: false,
      nowDownload: false,
      auditDeclareModal: false,
      fileUpload: this.workOrderFile,
      isCompanyInfoEdit: false,
      auditModal: false,
      NLshenhe: false,
      shenheAdite: "1",
      allsub: false,
      isAudit: "1",
      registrarAddress: "3rd Floor,207 / 209 Regent Street,London,W1B 3HH",
      idCardJieTu: "",
      startTax: false, // 开始报税弹窗
      remark: "", //驳回原因
      salePlatName: "",
      lenovoSearchList: [], // 联想搜索结果列表
      consoleOperationLogs: [], //操作日志
      describeText: "",
      companyBusinessLicense: [], //营业执照文件
      companyBusinessLicenseCopy: [], //商业登记证/海外证书
      companyBusinessRegistrationBr: [], //商业登记证文件
      companyRegistrationCi: [], //CI扫描件
      companyCorporateFoundingNnc1: [], //法团成立表格NNC1扫描件,
      taxNumModal: false, //录入税号信息modal
      editTaxNumModal: false,
      addTaxNum: {
        vatTaxNumber: "",
        taxIssueDate: "",
        taxEffectiveDate: "",
        eoriNumber: "",
        vatTaxNumberFile: "",
        vatCertificate: "",
        gatewayId: "",
        secret: "",
        gatewayPassword: "",
        eoriNumberFile: "",
        vatTaxNumberCopyFile: "",
        deEuCertificate: ""
      }, //录入税号信息
      detailInfo: {},
      fileInfo: {}, //文件信息
      placeList: [], //法人出生地
      isEng: true,
      submitForm: {
        bankAccountName: "",
        companyShareholderPassportCard: "",
        future30Sale: "",
        shopSaleBefore: "",
        bankAccountAddressPostcode: "",
        shopSalePlan: "",
        bankSubBranchName: "",
        bankAddressEn: "",
        bankAccountAddressEn: "",
        amazonProveFile: "",
        vatTaxEuFile: "",
        dredgeEuronext: "",
        shippingProcess: "",
        useEntrepot: "",
        companyBusinessLicenseAnyway: "0",
        swiftBic: "",
        bankCountryEn: "",
        bankName: "",
        bankAccount: "",
        isOtherGulfStateDutyOrServices: "",
        otherEoriNumber: "",
        companyPostCode: "",
        shopPredictSale: "",
        legalPersonPostCode: "",
        screenshotOfIdAvatar: "",
        screenshotOfIdCardFront: "",
        screenshotOfIdCardReverse: "",
        screenshotOfBusinessLicense: "",
        bankAccountCertify: "",
        otherTaxCertificate: "",
        articlesOfAssociationFile: "",
        bankAccountFile: "",
        companyTaxNumFile: "",
        companyLegalPersonCardReverseTranslate: "",
        companyLegalPersonCardFrontTranslate: "",
        companyBusinessLicenseTranslate: "",
        companyType: "1",
        shopNature: "1",
        companyNameZh: "",
        declarePeriod: "",
        companyNameEn: "",
        companyAddressZh: "",
        companyCitizenship: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        companyCreditCode: "",
        companyRegisterData: "",
        shopNextYearSale: "",
        companyTel: "",
        companyEmail: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyLegalPersonCitizenship: "",
        companyLegalPersonBirthday: "",
        companyLegalPersonCardAddress: "",
        companyLegalPersonBirthplace: "",
        companyLegalPersonEmail: "",
        companyLegalPersonCard: "",
        companyLegalPersonMobile: "",
        shopHref: "",
        shopName: "",
        shopTaxEffectiveData: "",
        shopSalePlatformName: "",
        isShopConsoleScreenshot: "1",
        shopConsoleConfirmationLetter: "",
        companyBusinessModeDescribe: "",
        shopPostCode: "",
        shopOtherEuTaxNumber: "",
        shopEntrepotAddress: "",
        shopLogisticsCompany: "",
        shopLogisticsCompanyName: "",
        shopTaxRate: "1",
        needEoriNumber: "",
        companyBusinessLicense: "",
        companyBusinessLicenseCopy: "",
        companyBusinessRegistrationBr: "",
        companyRegistrationCi: "",
        companyCorporateFoundingNnc1: "",
        companyLegalPersonCardFront: "",
        companyLegalPersonCardPassport: "",
        certificateOfEmployment: "",
        leaseAgreement: "",
        marriageLicense: "",
        divorceCertificate: "",
        houseProprietaryCertificate: "",
        birthCertificate: "",
        otherCertificate: "",
        shopConsoleScreenshot: "",
        vatCertificate: "",
        companyRegisteredCapital: "",
        companyLegalPersonCardAddressZh: "",
        companyRegisteredCityZh: "",
        companyRegisteredCityEn: "",
        legalPersonMaritalStatus: "",
        legalPersonSex: "",
        legalPersonBirthplaceProvinceZh: "",
        legalPersonBirthplaceProvinceEn: "",
        legalPersonBirthplaceCityZh: "",
        legalPersonBirthplaceCityEn: "",
        localBankAccountInfo: "",
        companyCreditReport: "",
        storageAddressImg: "",
        salesEvidenceFile: "",
        //阿联酋新增字段
        shopSaleBeforeFile: "",
        bankAddress: "",
        isOtherBusinessActivities: "2",
        isThereSale: "1",
        personCardAddressCountryEn: "",
        personCardAddressCityEn: "",
        personCardAddressEn: "",
        shopSalePlatformAccount: "",
        firstOrderTime: "",
        taxVatCountry: "",
        isThereShop: "1",
        declareRule: "",
        certificateType: "",
        companyLegalPersonCardReverse: "",
        isThereEoriNumber: "",
        future2YearSale: "",
        storageAddressCountry: ""
      },
      formLeftRules: {
        taxAuthorityNameZh: [{ required: true, trigger: "blur", message: "请输入公司所在地的税务机关名称（中文）" }],
        taxAuthorityNameEn: [{ required: true, trigger: "blur", message: "请输入公司所在地的税务机关名称（英文）" }],
        taxAuthorityAddrZh: [{ required: true, trigger: "blur", message: "请输入上述税务机关的地址（中文）" }],
        taxAuthorityAddrEn: [{ required: true, trigger: "blur", message: "请输入上述税务机关的地址（英文）" }],
        officeAddressEn: [{ required: true, trigger: "blur", message: "请输入完整的经营地址" }],

        amazonShopAccount: [{ required: true, trigger: "blur", message: "请输入亚马逊账号的完整名称" }],
        amazonSellerLink: [{ required: true, trigger: "blur", message: "请输入亚马逊卖家信息链接" }],
        amazonProductsLink: [{ required: true, trigger: "blur", message: "请输入亚马逊销售的产品的链接或描述" }],
        fbaCountry: [{ required: true, trigger: "blur", message: "请输入使用“FBA”（亚马逊履行）的国家" }],
        businessInitialTime: [
          { required: false, trigger: "change", message: "请选择在荷兰开展业务的初始日期", type: "date" }
        ],
        warehouseInitialTime: [
          { required: false, trigger: "change", message: "请选择第一次使用荷兰仓库的日期", type: "date" }
        ],
        expectedTaxable: [{ required: true, trigger: "blur", message: "请输入预计今年荷兰的应税营业额（欧元）" }],
        expectedTaxableNext: [
          { required: true, trigger: "blur", message: "请输入预计未来下个财政年度荷兰的应税营业额（欧元" }
        ],
        customerType: [{ required: true, trigger: "change", message: "请选择客户类型" }],
        importerInfo: [
          { required: true, trigger: "blur", message: "您是否会将商品进口荷兰，谁将作为进口记录的进口商？" }
        ],
        goodsImportedFrom: [{ required: true, trigger: "blur", message: "货物从哪里进口？" }],
        goodsPurchased: [{ required: true, trigger: "blur", message: "商品是在哪里购买的？" }],
        fbaNetherlandsAddrs: [
          { required: true, trigger: "blur", message: "请填写亚马逊物流仓储中心在荷兰的名称和地址" }
        ],
        eoriNumber: [
          { required: true, trigger: "blur", message: "EORI号码（如果已经有别的欧盟国家的EORI号码，请提供）" }
        ],
        storageAddressCountry: [{ required: true, trigger: "blur", message: "请输入仓储地址国家" }],
        future30Sale: [{ required: true, trigger: "blur", message: "请输入预计未来30天销售额" }],
        shopSaleBefore: [{ required: true, trigger: "blur", message: "请输入前12个月的销售额" }],
        bankSubBranchName: [{ required: true, trigger: "blur", message: "请输入支行英文名称" }],
        bankAccountAddressPostcode: [{ required: true, trigger: "blur", message: "请输入所在地邮编号码" }],
        bankAccountAddressEn: [{ required: true, trigger: "blur", message: "请输入账户主体地址" }],
        bankAddressEn: [{ required: true, trigger: "blur", message: "请输入银行英文地址" }],
        shippingProcess: [{ required: true, trigger: "blur", message: "请输入货物进口及配送流程" }],
        swiftBic: [{ required: true, trigger: "blur", message: "请输入Swift / BIC" }],
        bankCountryEn: [{ required: true, trigger: "blur", message: "请输入开户国家" }],
        bankName: [{ required: true, trigger: "blur", message: "请输入银行英文名称" }],
        bankAccount: [{ required: true, trigger: "blur", message: "请输入IBAN/银行账户" }],
        bankAccountName: [{ required: true, trigger: "blur", message: "请输入银行账户名称" }],
        shopOtherEuTaxNumber: [{ required: true, trigger: "blur", message: "请输入VAT增值税号" }],
        otherEoriNumber: [{ required: true, trigger: "blur", message: "请输入欧盟国EORI号" }],
        companyPostCode: [{ required: true, trigger: "blur", message: "请输入公司邮编号码" }],
        legalPersonPostCode: [{ required: true, trigger: "blur", message: "请输入法人出生地邮编号码" }],
        shopPredictSale: [{ required: true, trigger: "blur", message: "请输入今年预计销售额" }],
        shopNextYearSale: [{ required: true, trigger: "blur", message: "请输入明年预计销售额" }],
        future2YearSale: [{ required: true, trigger: "blur", message: "请输入预计第二年销售额" }],
        isThereEoriNumber: [{ required: true, trigger: "change", message: "请选择是否有EORI号" }],
        certificateType: [{ required: true, trigger: "change", message: "请选择证件类型" }],
        useEntrepot: [{ required: true, trigger: "change", message: "请选择是否使用意大利/西班牙/捷克任何仓库" }],
        isThereShop: [{ required: true, trigger: "change", message: "请选择是否有店铺" }],
        dredgeEuronext: [{ required: true, trigger: "change", message: "请选择是否开通泛欧" }],
        isOtherGulfStateDutyOrServices: [{ required: true, trigger: "change", message: "请选择是否有其它欧盟国VAT" }],
        taxVatCountry: [{ required: true, trigger: "change", message: "请选择有税号的中东国家" }],
        firstOrderTime: [
          {
            required: true,
            trigger: "change",
            message: "选择预计/实际第一笔订单时间",
            type: "date"
          }
        ],
        shopSalePlatformAccount: [{ required: true, trigger: "blur", message: "请填写电商平台账号完整名称" }],
        isThereSale: [{ required: true, trigger: "change", message: "请选择是否销售" }],
        companyBusinessLicenseAnyway: [{ required: true, trigger: "change", message: "请选择营业执照模板" }],
        bankAddress: [{ required: true, trigger: "blur", message: "请填写支行英文地址" }],
        shopSaleBeforeFile: [{ required: true, trigger: "change", message: "请上传过往12个月销售报告" }],
        salesEvidenceFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传销售证据"
          }
        ],
        amazonProveFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传亚马逊证明文件"
          }
        ],
        vatTaxEuFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传其它欧盟税号文件"
          }
        ],
        storageAddressImg: [{ required: true, trigger: "change", message: "请上传仓储地址截图" }],
        companyCreditReport: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司信用报告"
          }
        ],
        screenshotOfIdAvatar: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证头像截图"
          }
        ],
        personCardAddressCountryEn: [{ required: true, trigger: "blur", message: "请填写法人身份证英文地址" }],
        personCardAddressCityEn: [{ required: true, trigger: "blur", message: "请填写法人身份证英文地址" }],
        personCardAddressEn: [{ required: true, trigger: "blur", message: "请填写法人身份证英文地址" }],
        localBankAccountInfo: [{ required: true, trigger: "blur", message: "请填写本地银行账户信息" }],
        legalPersonBirthplaceCityEn: [{ required: true, trigger: "blur", message: "请填写法人的出生城市英文" }],
        legalPersonBirthplaceCityZh: [{ required: true, trigger: "blur", message: "请填写法人的出生城市中文" }],
        legalPersonBirthplaceProvinceEn: [{ required: true, trigger: "blur", message: "请填写法人的出生省份英文" }],
        legalPersonBirthplaceProvinceZh: [{ required: true, trigger: "blur", message: "请填写法人的出生省份中文" }],
        legalPersonSex: [{ required: true, trigger: "blur", message: "请选择法人性别" }],
        legalPersonMaritalStatus: [{ required: true, trigger: "change", message: "请选择法人婚姻状态" }],
        companyRegisteredCityZh: [{ required: true, trigger: "blur", message: "请填公司营业执照注册城市" }],
        companyRegisteredCityEn: [{ required: true, trigger: "blur", message: "请填公司营业执照注册城市" }],
        companyLegalPersonCardAddressZh: [{ required: true, trigger: "blur", message: "请填写法人身份证中文地址" }],
        companyRegisteredCapital: [{ required: true, trigger: "blur", message: "请输入公司注册资本" }],
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
        companyLegalPersonCardReverse: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证国徽面"
          }
        ],
        leaseAgreement: [{ required: true, trigger: "change", message: "请上传租房合同 " }],
        certificateOfEmployment: [{ required: true, trigger: "change", message: "请上传工作证明 " }],
        companyLegalPersonCardPassport: [{ required: true, trigger: "change", message: "请上传护照扫描件" }],
        needEoriNumber: [{ required: true, trigger: "change", message: "请选择是否有EORI号" }],
        shopTaxRate: [{ required: true, trigger: "change", message: "请选择税率" }],
        shopLogisticsCompanyName: [{ required: true, trigger: "blur", message: "请输入物流承运商公司名称" }],
        shopSalePlan: [{ required: true, trigger: "blur", message: "请输入未来12个月预计销售额" }],
        shopLogisticsCompany: [{ required: true, trigger: "blur", message: "请输入物流承运商地址" }],
        shopEntrepotAddress: [{ required: true, trigger: "blur", message: "请输入德国仓库地址" }],
        shopPostCode: [{ required: true, trigger: "blur", message: "请填写邮政编码" }],
        companyBusinessModeDescribe: [{ required: true, trigger: "blur", message: "请填写公司经营内容" }],
        shopConsoleConfirmationLetter: [{ required: true, trigger: "change", message: "请上传店铺确认函 " }],
        shopSalePlatformName: [{ required: true, trigger: "change", message: "请选择店铺所在电商平台" }],
        shopHref: [{ required: true, trigger: "blur", message: "请填写店铺链接" }],
        shopName: [{ required: true, trigger: "blur", message: "请填写店铺名称" }],
        companyLegalPersonCard: [{ required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }],
        companyLegalPersonMobile: [{ required: true, trigger: "blur", message: "请填写法人电话" }],
        companyLegalPersonBirthplace: [{ required: true, trigger: "change", message: "请选择法人出生地" }],
        companyLegalPersonCardAddress: [{ required: true, trigger: "blur", message: "请填写法人身份证英文地址" }],

        companyLegalPersonCitizenship: [{ required: true, trigger: "change", message: "请选择法人国籍" }],
        companyLegalPersonEn: [{ required: true, trigger: "blur", message: "请填写英文名字" }],
        companyLegalPersonZh: [{ required: true, trigger: "blur", message: "请填写法人中文名" }],
        companyEmail: [
          { required: true, trigger: "blur", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写法人邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyTel: [{ required: true, trigger: "blur", message: "请填写公司电话" }],
        companyCreditCode: [{ required: true, trigger: "blur", message: "请填写公司统一社会信用代码" }],
        companyAddressEn: [{ required: true, trigger: "blur", message: "请填写公司英文地址" }],
        companyAddressEnCity: [{ required: true, trigger: "blur", message: "请填写公司英文地址" }],
        companyAddressEnCountry: [{ required: true, trigger: "blur", message: "请填写公司英文地址" }],

        isShopConsoleScreenshot: [{ required: true, trigger: "change", message: "请选择是否有店铺后台截图" }],
        companyCitizenship: [{ required: true, trigger: "change", message: "请选择公司国籍" }],
        companyAddressZh: [{ required: true, trigger: "blur", message: "请填写公司中文地址" }],
        companyNameEn: [{ required: true, trigger: "blur", message: "请填写公司英文名" }],
        declarePeriod: [{ required: true, trigger: "change", message: "请选择报税周期" }],
        companyNameZh: [{ required: true, trigger: "blur", message: "请填写公司中文名" }],
        shopNature: [{ required: true, trigger: "change", message: "请选择店铺类型" }],
        companyType: [{ required: true, trigger: "change", message: "请选择公司类型" }],

        companyLegalPersonCardFront: [
          {
            required: true,
            trigger: "change",
            message: "请上传 身份证（人像面）"
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
        companyBusinessRegistrationBr: [
          {
            required: true,
            trigger: "change",
            message: "请上传商业登记证BR"
          }
        ],
        companyRegisterData: [
          {
            required: true,
            trigger: "change",
            message: "选择公司成立时间",
            type: "date"
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
        companyLegalPersonBirthday: [
          {
            required: true,
            trigger: "change",
            message: "请选择法人出生日期",
            type: "date"
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
        companyBusinessLicenseTranslate: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照英文公证翻译件"
          }
        ],
        companyLegalPersonCardFrontTranslate: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证公证翻译件正面"
          }
        ],
        companyLegalPersonCardReverseTranslate: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证公证翻译件反面"
          }
        ],
        articlesOfAssociationFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司章程"
          }
        ],
        bankAccountFile: [],
        companyTaxNumFile: [],
        otherTaxCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传完税/纳税证明"
          }
        ],
        companyShareholderPassportCard: [
          {
            required: true,
            trigger: "change",
            message: "请上传其他股东护照/身份证扫描件"
          }
        ],
        bankAccountCertify: [
          {
            required: true,
            trigger: "change",
            message: "请上传银行账户证明"
          }
        ]
      },
      saveLoading: false,
      submitLoading: false,
      declearList: [],
      //申报相关
      formsLink: "", // 英国申报凭证
      tableLoading: false,
      pageInfo: {
        page: 1,
        pageSize: 10
      },
      listTotal: 10,
      isRowBtnAuditDeclare: false,
      rowDataAuditDeclare: {},
      columns: [
        {
          title: "报税次数",
          key: "declareCout",
          render(h, params) {
            return h("span", params.index + 1);
          }
        },
        {
          title: "申报区间",
          render: (h, params) => {
            let self = this;
            let beginTime = params.row.beginTime !== "" ? params.row.beginTime.slice(0, 7) : "",
              endTime = params.row.endTime !== "" ? params.row.endTime.slice(0, 7) : "";
            return h("span", beginTime !== "" && endTime !== "" ? beginTime + "至" + endTime : "");
          }
        },
        {
          title: "状态",
          slot: "status"
        },
        {
          title: "税率",
          key: "taxRate"
        },
        {
          title: "申报规则",
          slot: "declareRule"
          // render:(h,params) => {
          //     return h('span',)
          // }
        },
        {
          title: "报税数据",
          slot: "lookData"
        },
        {
          title: "缴纳税金",
          key: "allTaxPrice"
        },
        {
          title: "提交申报结果",
          render: (h, params) => {
            let result = "",
              declarationStatus = params.row.declarationStatus;
            result =
              declarationStatus == 0
                ? "暂无"
                : declarationStatus == 1
                ? "提交成功"
                : declarationStatus == 2
                ? "扣款失败"
                : declarationStatus == 3
                ? "提交失败"
                : "";
            return h("span", result);
          }
        },
        {
          title: "操作",
          slot: "operate",
          minWidth: 80
        }
      ],
      ruleDeclareForm: {
        status: [{ required: true, message: "请审核", trigger: "change" }],
        remark: [{ required: true, type: "string", message: "请输入不通过原因", trigger: "blur" }]
      },
      // 选择报税区间
      columns3: [
        {
          title: "报税区间",
          slot: "declareInterval"
        },
        {
          title: "税金到账截止日期",
          key: "due"
        },
        {
          title: "操作",
          slot: "operateDeclare"
        }
      ],
      // 选择报税区间数据
      VatObligationsData: [],
      isTaxModalShow: false,
      tableData: [], //申报历史
      taxCertificate: "", //税金缴纳凭证
      declareInfo: {}, //申报数据
      declareReceipt: [], //申报回执
      uploadDebitReceipt: "", //扣款回执
      uploadReceiptModal: false,
      taxFileModal: false, //缴税凭证弹窗
      deductionInfo: [], //抵扣明细,
      serviceId: "",
      columns1: [
        {
          title: "抵扣类型",
          slot: "deductionType",
          width: 120
        },
        {
          title: "抵扣金额",
          key: "deductiontAmt",
          width: 100
        },
        {
          title: "单据日期",
          key: "billDate",
          width: 150
        },
        {
          title: "抵扣文件",
          slot: "deductFile"
        },
        {
          title: "操作",
          slot: "operate"
        }
      ],
      date: "",
      fileTaxModal: false, //报税信息 modal
      fileTaxForm: {
        beginTime: "",
        endTime: "",
        periodType: ""
      },
      bindTime: {
        beginTime: "",
        endTime: ""
      },
      tranferAgentInfo: {}, //转代理资料
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
        33: "待审核税金",
        34: "缴税凭证被驳回",
        35: "待上传零申报凭证"
      },
      workId: "",
      orderNo: "",
      vatCertificateFileModal: false,
      vatTaxNumberFileModal: false,
      vatCertificate: "", //VAT证书
      vatTaxNumberFile: "", //VAT税号证书
      authorizationHauge: false,
      enterHaugeInfo: false,
      hyFile: "",
      enterTrankingNumber: false,
      hyNumber: "",
      sendTaxBox: false,
      SIRETMadol: false,
      SIRETNumber: "",
      taxSendNumber: "",
      uploadAuthorizationFR: false,
      viewInformationModal: false,
      getWayModal: false,
      editDeductionModal: false,
      gateWayForm: {
        account: "",
        password: ""
      },
      orderServices: {},
      positionList: [
        {
          value: "CEO(首席执行官)"
        },
        {
          value: "COO(运营总监)"
        },
        {
          value: "CFO(财务总监)"
        },
        {
          value: "GM(总经理)"
        },
        {
          value: "CTO(Technical Director)技术总监"
        },
        {
          value: "HRD(人力资源总监)"
        },
        {
          value: "MD(市场总监)"
        },
        {
          value: "sales director(销售总监)"
        },
        {
          value: "Production Manager(生产经理)"
        },
        {
          value: "project manager(项目经理)"
        },
        {
          value: "other(其它)"
        }
      ],
      formLeft: {
        companyBusinessLicenseAnyway: "0",
        companyShareholderPassportCard: "",
        future30Sale: "",
        shopSaleBefore: "",
        bankSubBranchName: "",
        bankAccountAddressPostcode: "",
        bankAccountAddressPostcode: "",
        bankAccountAddressEn: "",
        bankAddressEn: "",
        amazonProveFile: "",
        vatTaxEuFile: "",
        dredgeEuronext: "",
        shippingProcess: "",
        useEntrepot: "",
        bankCountryEn: "",
        swiftBic: "",
        bankAccount: "",
        bankAccountName: "",
        isOtherGulfStateDutyOrServices: "",
        otherEoriNumber: "",
        companyPostCode: "",
        screenshotOfIdAvatar: "",
        legalPersonPostCode: "",
        screenshotOfIdCardFront: "",
        screenshotOfIdCardReverse: "",
        screenshotOfBusinessLicense: "",
        companyType: "1",
        shopNature: "1",
        companyNameZh: "",
        declarePeriod: "",
        companyNameEn: "",
        companyAddressZh: "",
        companyCitizenship: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        companyAddressEn: "",
        companyCreditCode: "",
        companyRegisterData: "",
        companyTel: "",
        companyEmail: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyLegalPersonCitizenship: "",
        companyLegalPersonBirthday: "",
        companyLegalPersonCardAddress: "",
        companyLegalPersonBirthplace: "",
        companyLegalPersonEmail: "",
        companyLegalPersonCard: "",
        companyLegalPersonMobile: "",
        shopHref: "",
        shopName: "",
        shopTaxEffectiveData: "",
        shopSalePlatformName: "",
        isShopConsoleScreenshot: "1",
        shopConsoleConfirmationLetter: "",
        shopPredictSale: "",
        shopNextYearSale: "",
        companyBusinessModeDescribe: "",
        shopSalePlan: "",
        shopPostCode: "",
        shopOtherEuTaxNumber: "",
        shopEntrepotAddress: "",
        shopLogisticsCompany: "",
        shopLogisticsCompanyName: "",
        shopTaxRate: 1,
        needEoriNumber: "",
        companyBusinessLicense: "",
        companyBusinessLicenseCopy: "",
        companyBusinessLicenseTranslate: "",
        companyBusinessRegistrationBr: "",
        companyRegistrationCi: "",
        companyCorporateFoundingNnc1: "",
        companyLegalPersonCardFront: "",
        companyLegalPersonCardFrontTranslate: "",
        companyLegalPersonCardPassport: "",
        certificateOfEmployment: "",
        leaseAgreement: "",
        marriageLicense: "",
        divorceCertificate: "",
        houseProprietaryCertificate: "",
        birthCertificate: "",
        otherCertificate: "",
        shopConsoleScreenshot: "",
        vatCertificate: "",
        companyRegisteredCapital: "",
        companyLegalPersonCardAddressZh: "",
        companyRegisteredCityZh: "",
        companyRegisteredCityEn: "",
        legalPersonMaritalStatus: "",
        legalPersonSex: "",
        legalPersonBirthplaceProvinceZh: "",
        legalPersonBirthplaceProvinceEn: "",
        legalPersonBirthplaceCityZh: "",
        legalPersonBirthplaceCityEn: "",
        localBankAccountInfo: "",
        companyCreditReport: "",
        storageAddressImg: "",
        articlesOfAssociationFile: "",
        salesEvidenceFile: "",
        //阿联酋新增字段
        shopSaleBeforeFile: "",
        bankAddress: "",
        isOtherBusinessActivities: "2",
        isThereSale: "1",
        personCardAddressCountryEn: "",
        personCardAddressCityEn: "",
        personCardAddressEn: "",
        shopSalePlatformAccount: "",
        firstOrderTime: "",
        taxVatCountry: "",
        isThereShop: "1",
        declareRule: "",
        certificateType: "",
        companyLegalPersonCardReverse: "",
        isThereEoriNumber: "",
        taxRegisterLetter: "",
        future2YearSale: "",
        storageAddressCountry: "",
        otherTaxCertificate: "",
        taxRegisterLetter: ""
      },
      invoicaBoxShow: false,
      invoiceInfo: {
        invoiceNumber: "",
        invoiceUrl: ""
      },
      receiptList: {
        invoiceReceipt: "",
        payLetterInvoiceReceipt: "",
        paySystemInvoiceReceipt: "",
        taxDeclareBlankReceipt: "",
        taxDeclareReceiveInformReceipt: "",
        taxesReceipt: ""
      },
      commerceList: [
        {
          value: "消费类电子产品"
        },
        {
          value: "服饰"
        },
        {
          value: "汽车摩托车配件"
        },
        {
          value: "玩具"
        },
        {
          value: "户外用品"
        },
        {
          value: "首饰"
        },
        {
          value: "家具"
        },
        {
          value: "办公配件"
        },
        {
          value: "母婴用品"
        },
        {
          value: "其它"
        }
      ],
      gibanBox: false,
      gibanCode: "",
      stockGreaterThan25: "1",
      sharesList: [
        {
          shareholderZhName: "",
          shareholderEnName: "",
          position: "",
          stockProportion: "",
          shareholderBirthday: "",
          identityCard: "",
          shareholderBonusScale: ""
        }
      ],
      SupplierByConditionList: [], // 法国服务商
      supplierModal: false,
      supplierId: "",
      rowData: {},
      isRowBtn: false,
      resonModelFR: false,
      resonModelTitle: "扣款失败原因",
      frReason: "",
      frRetaxInfo: {
        disabledSingle: false,
        extraPrice: "",
        resonList: [{ reason: "" }, { reason: "" }, { reason: "" }, { reason: "" }, { reason: "" }]
      },
      needApiIT: true, //意大利是否需要API对接
      needApiFR: true,
      needApiDE: true,
      isAuth: true,
      //德国年报
      deYearLoading: false,
      deYearColumns: [
        {
          title: "年度申报时间",
          align: "center",
          render(h, params) {
            return h("span", params.row.year + "年");
          }
        },
        {
          title: "年度申报区间",
          align: "center",
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            if (beginTime == "") {
              return h("span", "暂无");
            } else {
              return h("span", beginTime + "至" + endTime);
            }
          }
        },
        {
          title: "状态",
          align: "center",
          render(h, params) {
            let status = params.row.status,
              rowStatus = status == 21 ? "待申报" : status == 27 ? "已申报" : "";
            return h("span", rowStatus);
          }
        },
        {
          title: "操作",
          align: "center",
          slot: "operation"
        }
      ],
      deYearData: [],
      deYearDetail: false,
      thatDEinfo: {},
      deAnnalsData: [],
      deAnnalsColumns: [
        {
          title: "申报周期",
          align: "center",
          render(h, params) {
            let declarePeriod = params.row.declarePeriod;
            return h(
              "span",
              declarePeriod == 0 ? "月报" : declarePeriod == 1 ? "季报" : declarePeriod == 2 ? "年报" : ""
            );
          }
        },
        {
          title: "申报月份/季度",
          align: "center",
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            return h("span", beginTime + "至" + endTime);
          }
        },
        {
          title: "不含税销售额（欧元）",
          align: "center",
          key: "excludeTaxPrice"
        },
        {
          title: "缴税金额（欧元）",
          align: "center",
          key: "allTaxPrice"
        },
        {
          title: "抵扣金额（选填）",
          align: "center",
          slot: "fillDiscount"
        },
        {
          title: "税率",
          align: "center",
          render(h, params) {
            return h("span", params.row.taxRate + "%");
          }
        },
        {
          title: "申报回执",
          align: "center",
          slot: "declareReceipt"
        },
        {
          title: "缴费凭证",
          align: "center",
          slot: "payReceipt"
        }
      ],
      discountBox: false,
      dataIndex: 0,
      taxModal: false,
      taxBaseData: {},
      discountColumns: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "抵扣类型",
          align: "center",
          render(h, params) {
            let type = params.row.deductionType,
              deductionType =
                type == 1
                  ? "C79/88"
                  : type == 2
                  ? "发票抵扣"
                  : type == 3
                  ? "欧盟内采购"
                  : type == 4
                  ? "B2B发票"
                  : "其他";
            return h("span", deductionType);
          }
        },
        {
          title: "单据日期",
          align: "center",
          key: "billDate"
        },
        {
          title: "抵扣金额",
          align: "center",
          render(h, params) {
            return h("span", "€" + params.row.deductiontAmt);
          }
        },
        {
          title: "凭证",
          align: "center",
          slot: "deductionFile"
        }
      ],
      eoriDisabled: false,
      declareRow: {},
      isDeclareInfo: false,
      deductionForm: {
        deductionType: "",
        billDate: "",
        deductiontAmt: "",
        deductionFile: "",
        fileOriginalName: ""
      },
      deductionFormRules: {
        deductionType: [{ required: true, trigger: "change", message: "抵扣类型不能为空" }],
        billDate: [{ required: true, trigger: "change", message: "请选择单据日期" }],
        deductiontAmt: [{ required: true, trigger: "change", message: "请输入抵扣金额" }],
        deductionFile: [{ required: true, trigger: "change", message: "请上传抵扣文件" }]
      },
      orderRemark: ""
    };
  },
  mounted() {
    this.getregisterInfo();
    this.getBirthPlace();
    this.getCompanyList();
  },
  methods: {
    //公司类型change
    companyTypeChange(val) {
      if (val == "3") {
        this.submitForm.certificateType = "2";
      }
    },
    translationMaterialUploadSuccess(res, file, fileList) {
      this.translationMaterial = res.data.fileUrl;
    },
    removeTranslationMateria(file, fileList) {
      this.translationMaterial = "";
    },
    sureUploadTranslationMaterial() {
      if (this.translationMaterial == "") {
        this.$Message.warning("请上传翻译件");
        return;
      }
      let data = {
        serverNo: this.detailInfo.serverNo,
        translationMaterial: this.translationMaterial
      };
      API.updateOrSave(data).then(res => {
        if (res.code == 0) {
          this.$Message.success("上传成功");
          this.submitTranslationMaterialModel = false;
          this.getregisterInfo();
        }
      });
    },
    submitServiceHandel() {
      if (this.submitServiceTime == "") {
        this.$Message.warning("提交服务商资料时间不能为空");
        return;
      }
      let data = {
        serverNo: this.detailInfo.serverNo,
        submitServiceTime: this.submitServiceTime,
        workId: this.workId
      };
      data.submitServiceTime = this.formatDate(data.submitServiceTime);
      API.yiSubFile(data).then(res => {
        if (res.code == 0) {
          this.$Message.success("提交成功");
          this.submitServiceModal = false;
          this.getregisterInfo();
        }
      });
    },
    submitTaxHandel() {
      if (this.submitTaxTime == "") {
        this.$Message.warning("提交税局时间不能为空");
        return;
      }
      let data = {
        serverNo: this.detailInfo.serverNo,
        submitTaxTime: this.submitTaxTime
      };
      data.submitTaxTime = this.formatDate(data.submitTaxTime);
      API.taxTime(data).then(res => {
        if (res.code == 0) {
          this.$Message.success("提交成功");
          this.submitTaxModal = false;
          this.getregisterInfo();
        }
      });
    },
    todayTime(type) {
      let time = new Date();
      if (type == "service") {
        this.submitServiceTime = this.formatDate(time);
      } else if (type == "tax") {
        this.submitTaxTime = this.formatDate(time);
      }
    },
    // 修改服务商分配编码
    confirmUpdateSupplierServiceID() {
      if (!this.detailInfo.serverNo) {
        this.$Message.warning("当前工单没有服务号！");
        return false;
      }
      if (!this.supplierServiceID) {
        this.$Message.warning("请填写服务商分配编码！");
        return false;
      }
      let params = {
        serverNo: this.detailInfo.serverNo,
        supplierAssignsServiceId: this.supplierServiceID
      };
      API.updateSupplierAssignsServiceId(params)
        .then(res => {
          this.$Message.success("修改成功！");
          this.supplierServiceIDModal = false;
          this.supplierServiceID = "";
          this.getregisterInfo();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    },
    // 法国，预计未来12月销售额最小为1000欧元
    shopSalePlanChange() {
      let val = this.submitForm.shopSalePlan;
      if (!isNaN(val) && Number(val) < 1000) {
        this.$Message.warning("预计未来12月销售额需最小为1000欧元");
        this.submitForm.shopSalePlan = "";
      }
    },
    sureNLshenhe() {
      console.log(this.shenheAdite);
      this.NLshenhe = false;
    },
    //获取基础配置信息
    getBaseInfo(countryCode) {
      API2.baseInfoByCondition({ countryCode }).then(res => {
        if (res.code === 0) {
          const data = res.data;
          if (data.monthPeriod === 0) this.declearList.push({ type: "月报", status: 0 });
          if (data.quarterPeriod === 0) this.declearList.push({ type: "季报", status: 1 });
          if (data.yearPeriod === 0) this.declearList.push({ type: "年报", status: 2 });
        }
      });
    },
    toUpdateStatus(row) {
      this.updateStatusData = {
        status: ""
      };
      this.updateStatusObj = { ...row };
      this.updateStatus = true;
    },
    sureUpdateStatus() {
      if (this.updateStatusData.status == "") {
        this.$Message.info("请先选择要更改的状态");
        return;
      }
      this.updateStatusData.servicesId = this.id;
      this.updateStatusData.workId = this.updateStatusObj.id;
      API.updateShenbaoStatus(this.updateStatusData).then(res => {
        if (res.code == 0) {
          this.$Message.success("状态更改成功");
          this.updateStatus = false;
          this.getregisterInfo();
        }
      });
    },
    // 获取法国服务商
    getSupplierByCondition(countryCode) {
      API.supplierByCondition({
        countryCode,
        supplierType: 1
      }).then(res => {
        this.SupplierByConditionList = res.data;
      });
    },
    //获取法人出生地
    getBirthPlace() {
      API.getBirthPlace().then(res => {
        if (res.code == 0) {
          this.placeList = res.data;
        }
      });
    },
    //点击预览文件
    previewFile(url) {
      window.open(url);
    },
    //获取注册详情
    getregisterInfo() {
      API1.getRegDetailInfo({ serviceId: this.id })
        .then(res => {
          if (res.code == 0) {
            this.orderNo = res.data.orderNo;
            this.orderRemark = res.data.remark;
            this.detailInfo = res.data.orderServices;
            this.isCompanyInfoEdit = res.data.orderServices.progressBar == 0 ? true : false;
            this.detailInfo.beginTime = res.data.orderServices.beginTime.substring(0, 7);
            this.detailInfo.endTime = res.data.orderServices.endTime.substring(0, 7);
            window.localStorage.setItem("declareInterval", JSON.stringify(res.data));
            if (JSON.stringify(res.data.registerWorkOrder) != "{}") {
              this.formLeft = this.submitForm = res.data.registerWorkOrder;
              this.workId = res.data.registerWorkOrder.id;
              let val = res.data.registerWorkOrder;
              this.formLeft.shopNature = String(val.shopNature);
              this.formLeft.needEoriNumber = String(val.needEoriNumber);
              this.formLeft.isThereShop = String(val.isThereShop);
              this.formLeft.isThereSale = String(val.isThereSale);
              this.formLeft.shopSaleBefore = String(val.shopSaleBefore);
              this.submitForm.shopSaleBefore = String(val.shopSaleBefore);
              this.formLeft.isOtherGulfStateDutyOrServices = String(val.isOtherGulfStateDutyOrServices);
              this.formLeft.isOtherBusinessActivities = String(val.isOtherBusinessActivities);
              this.formLeft.isShopConsoleScreenshot = String(val.isShopConsoleScreenshot);
              this.formLeft.declareRule = String(val.declareRule);
              this.formLeft.certificateType = String(val.certificateType);
              this.formLeft.companyType = String(val.companyType);
              this.formLeft.companyBusinessLicenseAnyway = String(val.companyBusinessLicenseAnyway);
              this.formLeft.legalPersonSex = String(val.legalPersonSex);
              this.formLeft.declarePeriod = String(val.declarePeriod);
              this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber);
              this.formLeft.shopPredictSale = String(val.shopPredictSale);
              this.formLeft.shopNextYearSale = String(val.shopNextYearSale);
              this.formLeft.shopSalePlan = String(val.shopSalePlan);
              this.formLeft.companyRegisteredCapital = String(val.companyRegisteredCapital);
              this.formLeft.shopTaxRate = String(val.shopTaxRate);
              this.formLeft.useEntrepot = String(val.useEntrepot);
              this.formLeft.dredgeEuronext = String(val.dredgeEuronext);
              this.formLeft.future30Sale = String(val.future30Sale);
              this.formLeft.future2YearSale = String(val.future2YearSale);
              if (val.companyStockCondition != "") {
                this.sharesList = JSON.parse(val.companyStockCondition);
              }
              if (this.detailInfo.countryCode === "DE") {
                if (this.submitForm.companyBusinessLicenseAnyway != "0") {
                  this.allsub = true;
                }
              }
              if (this.detailInfo.countryCode == "ES") {
                if (val.companyStockCondition != "") {
                  this.stockGreaterThan25 = "0";
                  this.sharesList = JSON.parse(val.companyStockCondition);
                }
              }
              if (this.detailInfo.countryCode == "DE") {
                this.addTaxNum.taxEffectiveDate = val.shopTaxEffectiveData;
              }
              if (
                this.detailInfo.countryCode === "ES" ||
                this.detailInfo.countryCode === "FR" ||
                this.detailInfo.countryCode === "DE"
              ) {
                this.getSupplierByCondition(this.detailInfo.countryCode);
                if (this.detailInfo.countryCode === "ES") {
                  this.supplierId = "44";
                }
                if (this.detailInfo.countryCode === "DE") {
                  this.supplierId = "45";
                }
              }
              if (this.detailInfo.countryCode === "CZ" && val.companyType == 3) {
                this.$set(this.formLeft, "companyBusinessLicenseCopy", val.companyBusinessLicense);
              } else {
                this.$set(this.formLeft, "companyBusinessLicenseCopy", "");
              }
            }
            // 判断是否授权
            this.isHasAuth(this.detailInfo);
            if (res.data.taxWorkOrderList.length > 0) {
              this.tableData = res.data.taxWorkOrderList;
              this.tableData.forEach(element => {
                if (element.taxCertificate !== "") {
                  element.taxCertificate = element.taxCertificate.split(";");
                } else {
                  element.taxCertificate = [];
                }
              });
              this.declareInfo = res.data.taxWorkOrderList[0];
              this.deductionInfo = res.data.taxWorkOrderList[0].listTaxDeductionItem;
              this.serviceId = this.workId = res.data.taxWorkOrderList[0].id;
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
                periodType: this.detailInfo.periodType
              };
              this.bindTime = {
                beginTime: this.detailInfo.beginTime,
                endTime: this.detailInfo.endTime
              };
            }
            this.getBaseInfo(this.detailInfo.countryCode);

            if (this.detailInfo.countryCode === "DE" && res.data.yearTaxWorkOrderList.length > 0) {
              this.deYearData = res.data.yearTaxWorkOrderList;
            }
            this.consoleOperationLogs = res.data.consoleOperationLogs;
          } else {
            this.$Message.warning(res.message);
          }
          if (
            this.detailInfo.countryCode === "ES" ||
            this.detailInfo.countryCode === "FR" ||
            this.detailInfo.countryCode === "DE"
          ) {
            this.getSupplierByCondition(this.detailInfo.countryCode);
            if (this.detailInfo.countryCode === "ES") {
              this.supplierId = "44";
            }
            if (this.detailInfo.countryCode === "DE") {
              this.supplierId = "45";
            }
          }
        })
        .catch(err => console.log(err));
    },
    // 获取英国申报
    getLink(row) {
      API2.getForms({
        workOrderId: row.id,
        userId: row.userId
      }).then(res => {
        if (res.code === 0) {
          window.open(res.data);
        }
      });
    },
    downLoadShuijinForms(row) {
      API2.getShuijinForms({
        workOrderId: row.id,
        userId: row.userId
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != "{}") {
            let url = res.data;
            if (url.slice(0, 5) == "http:") url = url.slice(0, 4) + "s" + url.slice(4);
            window.open(url);
          }
        }
      });
    },
    // 没工单的时候去生成工单
    createWorkOrder() {
      API1.getRegDetailInfo({ serviceId: this.id })
        .then(res => {
          console.log();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //返回列表页
    goBack() {
      this.$emit("back");
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
      if (this.spinShow) {
        self.$Message.warning("资料已经下载，请勿重复点击");
        return;
      }
      if (this.nowDownload) {
        self.$Message.warning("资料正在下载，请稍后");
        return;
      }
      this.nowDownload = true;
      let formData = new FormData();
      formData.append("workId", this.submitForm.id);
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open("post", this.baseUrl + "/etax/workorder/management/register/down/material", true);
      // 设置请求token
      xmlResquest.setRequestHeader("Authorization", "Bearer " + getToken());
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function(oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(
            xmlResquest
              .getResponseHeader("content-disposition")
              .split(";")[1]
              .split("=")[1]
          );
          self.spinShow = true;
        } else {
          self.$Message.warning("下载出错！");
          self.spinShow = false;
          self.nowDownload = false;
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    //下载申报资料
    downLoadDeclare($event, id) {
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
      let formData = new FormData();
      if (id) {
        formData.append("workId", id);
      } else {
        if (this.detailInfo.countryCode === "GB" || this.detailInfo.countryCode === "ES") {
          formData.append("workId", this.tableData[0].id);
        } else {
          formData.append("workOrderId", this.tableData[0].id);
        }
      }
      let xmlResquest = new XMLHttpRequest();
      if (this.detailInfo.countryCode === "GB" || this.detailInfo.countryCode === "ES") {
        xmlResquest.open("post", this.baseUrl + "/etax/tax/workorder/management/down/material", true);
      } else {
        xmlResquest.open("post", this.baseUrl + "/etax/derive/management/tax/export", true);
      }
      // 设置请求token
      xmlResquest.setRequestHeader("Authorization", "Bearer " + getToken());
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function(oEvent) {
        let content = xmlResquest.response;
        let fileName = "";
        if (xmlResquest.getResponseHeader("content-disposition")) {
          fileName = decodeURI(
            xmlResquest
              .getResponseHeader("content-disposition")
              .split(";")[1]
              .split("=")[1]
          );
          // self.spinShow = true
        } else {
          self.$Message.warning("下载出错！");
          // self.spinShow = false
          // self.nowDownload = false
          return;
        }
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = fileName;
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    //审核操作
    sureAudit() {
      let params = {
        workId: "",
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      };
      if (this.detailInfo.countryCode === "IT" && this.detailInfo.supplierId != 50) {
        if (this.needApiIT) {
          params.apiStatus = 1;
        } else {
          params.apiStatus = 0;
        }
      }
      if (this.detailInfo.countryCode === "IT" && this.detailInfo.supplierId == 50) {
        params.apiStatus = 0;
      }
      if (this.detailInfo.countryCode === "GB" && this.isAudit == "1") {
        params.registrarAddress = this.registrarAddress;
      }
      if (this.detailInfo.countryCode === "DE" && this.isAudit == "1") {
        if (this.submitForm.companyBusinessLicenseAnyway == "0") {
          this.auditModal = false;
          this.$Message.info("请先选择营业执照模板");
          return;
        }
        if (!this.allsub) {
          this.auditModal = false;
          this.$Message.info("请先提交资料");
          return;
        }
      }
      if (this.detailInfo.countryCode === "FR") {
        if (this.needApiFR) {
          params.apiStatus = 1;
        } else {
          params.apiStatus = 0;
        }
      }
      if (this.isAudit == 1) {
        delete params.remark;
      }
      if (this.detailInfo.progressBar == 1) {
        if (
          (this.detailInfo.countryCode === "FR" || this.detailInfo.countryCode === "ES") &&
          this.supplierId === "" &&
          this.isAudit == 1
        ) {
          this.$Message.info("请先选择服务商");
          return;
        }
        params.workId = this.submitForm.id;
        API1.auditInfo(params)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success("审核成功");
              this.auditModal = false;
              this.$emit("refresh");
            } else {
              this.$Message.warning(res.message);
            }
          })
          .catch(err => console.log(err));
      } else if (this.detailInfo.progressBar == 33) {
        params.workId = this.tableData[0].id;
        if (this.frRetaxInfo.disabledSingle) {
          if (this.frRetaxInfo.extraPrice == "") {
            this.$Message.info("请填写补缴金额");
            return;
          }
          params.extraPrice = this.frRetaxInfo.extraPrice;
          params.declarationRemark = "";
          this.frRetaxInfo.resonList.map((item, index) => {
            if (item.reason != "") {
              params.declarationRemark += item.reason + ";";
            }
          });
        }
        API1.auditTaxCertificate(params)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success("审核成功");
              this.auditModal = false;
              this.$emit("refresh");
            } else {
              this.$Message.warning(res.message);
            }
          })
          .catch(err => console.log(err));
      }
    },
    rowSureAudit() {
      let params = {
        workId: "",
        status: this.isAudit,
        remark: this.remark,
        supplierId: this.supplierId
      };
      if (this.isAudit == 1) {
        delete params.remark;
      }
      if (this.detailInfo.countryCode === "IT" && this.detailInfo.supplierId != 50) {
        if (this.needApiIT) {
          params.apiStatus = 1;
        } else {
          params.apiStatus = 0;
        }
      }
      if (this.detailInfo.countryCode === "IT" && this.detailInfo.supplierId == 50) {
        params.apiStatus = 0;
      }
      if (this.detailInfo.countryCode === "FR") {
        if (this.needApiFR) {
          params.apiStatus = 1;
        } else {
          params.apiStatus = 0;
        }
      }
      if (this.rowData.status == 1) {
        if (this.rowData.countryCode === "FR" && this.supplierId === "") {
          this.$Message.info("请先选择服务商");
          return;
        }
        if (this.rowData.countryCode === "DE" && this.supplierId === "") {
          this.$Message.info("请先选择服务商");
          return;
        }
        params.workId = this.submitForm.id;
        API1.auditInfo(params)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success("审核成功");
              this.auditModal = false;
              this.isRowBtn = false;
              this.getregisterInfo();
            } else {
              this.$Message.warning(res.message);
            }
          })
          .catch(err => console.log(err));
      } else if (this.rowData.status == 33) {
        params.workId = this.rowData.id;
        API1.auditTaxCertificate(params)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success("审核成功");
              this.auditModal = false;
              this.getregisterInfo();
              this.isRowBtn = false;
            } else {
              this.$Message.warning(res.message);
            }
          })
          .catch(err => console.log(err));
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
      if (this.detailInfo.countryCode == "SA") {
        this.formLeft[item] = res.data.fileUrl;
      } else {
        this.submitForm[item] = res.data.fileUrl;
      }

      // console.log(this.submitForm[item])
      // console.log(this.submitForm.bankAccountCertify)
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件"
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      if (this.detailInfo.countryCode == "SA") {
        this.formLeft[item] = "";
      } else {
        this.submitForm[item] = "";
      }
    },
    //英国EORI号根据税号改变
    changeEORI(e) {
      if (this.detailInfo.countryCode == "GB" && this.submitForm.needEoriNumber == 0) {
        this.addTaxNum.eoriNumber = "GB" + this.addTaxNum.vatTaxNumber + "000";
        this.eoriDisabled = true;
      }
    },
    //提交录入税号信息
    enterTaxNumInfo() {
      if (this.addTaxNum.vatTaxNumber === "") {
        this.$Message.warning("VAT税号不能为空");
        return;
      }
      if (this.addTaxNum.taxIssueDate === "") {
        this.$Message.warning("税号下发日期不能为空");
        return;
      }
      if (this.addTaxNum.taxEffectiveDate === "") {
        this.$Message.warning("税号生效日期不能为空");
        return;
      }
      if (
        (this.detailInfo.countryNameZh == "沙特" || this.detailInfo.countryNameZh == "阿联酋") &&
        this.addTaxNum.gatewayId == ""
      ) {
        this.$Message.warning("税局账号不能为空");
        return;
      }
      if (
        (this.detailInfo.countryNameZh == "沙特" || this.detailInfo.countryNameZh == "阿联酋") &&
        this.addTaxNum.gatewayPassword == ""
      ) {
        this.$Message.warning("税局账号密码不能为空");
        return;
      }
      // if(this.addTaxNum.vatTaxNumberFile =='') {
      //     this.$Message.warning('VAT税号文件不能为空');
      //     return
      // }

      let params = { ...this.addTaxNum };
      params.workId = this.submitForm.id;
      params.taxEffectiveDate = this.formatDate(this.addTaxNum.taxEffectiveDate);
      params.taxIssueDate = this.formatDate(this.addTaxNum.taxIssueDate);
      // console.log('录入税号params',params);
      API1.logTaxInfo(params)
        .then(res => {
          if (res.code == 0) {
            this.$emit("refresh");
            this.$Message.success("录入税号成功");
            this.taxNumModal = false;
            this.addTaxNum = {};
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //取消录入税号信息
    cancelEnter() {
      this.addTaxNum = {};
      this.taxNumModal = false;
      this.$refs.vatFile.clearFiles();
    },
    //税号文件上传之前
    beforeVatFileUpload() {},
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
      this.addTaxNum[item] = res.data.fileUrl;
    },
    //移除税号文件
    removeVatFile(file, fileList, item) {
      this.addTaxNum[item] = 0;
    },
    //发送提醒
    sendMessage(progressBar) {
      let params = {
        serviceId: this.detailInfo.id
      };
      this.$Modal.confirm({
        title: "是否发送短信",
        content: "",
        onOk: () => {
          API.sendMessage(params)
            .then(res => {
              if (res.code == 0) {
                this.$Message.success("发送提醒成功");
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch(err => console.log(err));
        },
        onCancel: () => {}
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
      this.$refs["formLeft"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let data = { ...this.submitForm };
          if (this.detailInfo.countryCode == "FR") {
            data.companyNameEn = data.companyNameEn.toUpperCase();
            if (!isNaN(this.submitForm.shopSalePlan) && Number(this.submitForm.shopSalePlan) < 1000) {
              this.$Message.warning("预计未来12个月销售额，最少1000欧元");
            }
          }
          data.businessInitialTime = this.formatDate(this.submitForm.businessInitialTime);
          data.warehouseInitialTime = this.formatDate(this.submitForm.warehouseInitialTime);
          data.shopTaxEffectiveData = this.formatDate(this.submitForm.shopTaxEffectiveData);
          data.companyLegalPersonBirthday = this.formatDate(this.submitForm.companyLegalPersonBirthday);
          data.companyRegisterData = this.formatDate(this.submitForm.companyRegisterData);
          data.thresholdValueTime = this.formatDate(this.submitForm.thresholdValueTime);
          data.firstOrderTime = this.formatDate(this.submitForm.firstOrderTime);
          if (this.detailInfo.countryCode == "SA") {
            data = { ...this.formLeft };
            data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData);
            data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday);
            data.firstOrderTime = this.formatDate(this.formLeft.firstOrderTime);
            data.companyStockCondition = JSON.stringify(this.sharesList);
          }
          data.servicesId = this.id;
          if (this.countryCode == "ES") {
            if (this.stockGreaterThan25 == "0") {
              data.companyStockCondition = JSON.stringify(this.sharesList);
            } else {
              data.companyStockCondition = "";
            }
          }
          // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
          if (this.detailInfo.countryCode == "CZ" && this.submitForm.companyType == 3) {
            data.companyBusinessLicense = this.submitForm.companyBusinessLicenseCopy;
          }
          API1.submitRegInfo(data)
            .then(res => {
              if (res.code === 0) {
                this.$Message.success("提交成功");
                window.scroll(0, 0);
                this.$emit("refresh");
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          this.$Message.warning("请填完整信息");
        }
      });

      // console.log(this.submitForm)
    },
    //查看回执
    seeReceipt(e, id) {
      API2.downloadReceipt({
        workOrderId: id
      }).then(res => {
        if (res.code === 0) {
          window.open(res.data);
        }
      });
    },
    //保存注册资料
    saveFile() {
      this.saveLoading = true;
      let data = { ...this.submitForm };
      if (this.detailInfo.countryCode == "FR" && data.companyNameEn)
        data.companyNameEn = data.companyNameEn.toUpperCase();
      if (this.detailInfo.countryCode == "FR") {
        if (!isNaN(this.submitForm.shopSalePlan) && Number(this.submitForm.shopSalePlan) < 1000) {
          this.$Message.warning("预计未来12个月销售额，最少1000欧元");
        }
      }
      data.businessInitialTime = this.formatDate(this.submitForm.businessInitialTime);
      data.warehouseInitialTime = this.formatDate(this.submitForm.warehouseInitialTime);
      data.shopTaxEffectiveData = this.formatDate(this.submitForm.shopTaxEffectiveData);
      data.companyLegalPersonBirthday = this.formatDate(this.submitForm.companyLegalPersonBirthday);
      data.companyRegisterData = this.formatDate(this.submitForm.companyRegisterData);
      data.thresholdValueTime = this.formatDate(this.submitForm.thresholdValueTime);
      data.firstOrderTime = this.formatDate(this.submitForm.firstOrderTime);
      if (this.detailInfo.countryCode == "SA") {
        data = { ...this.formLeft };
        data.shopTaxEffectiveData = this.formatDate(this.formLeft.shopTaxEffectiveData);
        data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday);
        data.firstOrderTime = this.formatDate(this.formLeft.firstOrderTime);
        data.companyStockCondition = JSON.stringify(this.sharesList);
      }
      data.servicesId = this.id;
      if (this.countryCode == "ES") {
        if (this.stockGreaterThan25 == "0") {
          data.companyStockCondition = JSON.stringify(this.sharesList);
        } else {
          data.companyStockCondition = "";
        }
      }
      // 因营业执照和商业登记证/海外证书在接口定义时用的字段都是companyBusinessLicense
      if (this.detailInfo.countryCode == "CZ" && this.submitForm.companyType == 3) {
        data.companyBusinessLicense = this.submitForm.companyBusinessLicenseCopy;
      }

      API1.saveRegInfo(data)
        .then(res => {
          this.$Message.success("保存成功");
          window.scroll(0, 0);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    //填写报税信息
    sureFileTax() {
      let params = { ...this.fileTaxForm };
      params.servicesId = this.id;
      if (this.countryCode == "PL") {
        API.firstDeclear(params).then(res => {
          if (res.code == 0) {
            this.$Message.success("报税信息填写成功");
            this.$emit("refresh");
          } else {
            this.$Message.warning(res.message);
          }
        });
        return;
      }
      API.firstDeclear(params)
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("报税信息填写成功");
            this.$emit("refresh");
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //计算税金
    caculateTax(row) {
      if (row.orderServicesId !== undefined) {
        this.$emit("showTaxModal", row.id, row.orderServicesId);
      } else {
        this.$emit("showTaxModal", this.workId, this.id);
      }
      this.$store.commit("getDeclareInfo", this.declareInfo);
    },
    //分页
    changePageHandler(page) {},
    //申报回执上传之前
    beroreDeclareUpload() {},
    beroreDeclareUploadDebitReceipt() {
      let self = this;
      const check = self.uploadDebitReceipt == "";
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
        this.invoiceInfo.invoiceUrl = file.response.data.fileUrl;
      } else if (type == 5) {
        //发票开具通知
        this.receiptList.invoiceReceipt = file.response.data.fileUrl;
      } else if (type == 6) {
        //纳税付款发票信件
        this.receiptList.payLetterInvoiceReceipt = file.response.data.fileUrl;
      } else if (type == 7) {
        //纳税付款系统发票
        this.receiptList.paySystemInvoiceReceipt = file.response.data.fileUrl;
      } else if (type == 8) {
        //税务申报接收通知
        this.receiptList.taxDeclareReceiveInformReceipt = file.response.data.fileUrl;
      } else if (type == 9) {
        //税务申请表
        this.receiptList.taxDeclareBlankReceipt = file.response.data.fileUrl;
      } else if (type == 10) {
        //税金收款回执
        this.receiptList.taxesReceipt = file.response.data.fileUrl;
      }
    },
    //移除申报回执
    removeDeclare(file, fileList, type) {
      if (type == 1) {
        this.declareReceipt = fileList;
      } else if (type == 2) {
        this.uploadDebitReceipt = "";
      } else if (type == 3) {
        this.hyFile = "";
      } else if (type == 4) {
        this.invoiceInfo.invoiceUrl = "";
      } else if (type == 5) {
        //发票开具通知
        this.receiptList.invoiceReceipt = "";
      } else if (type == 6) {
        //纳税付款发票信件
        this.receiptList.payLetterInvoiceReceipt = "";
      } else if (type == 7) {
        //纳税付款系统发票
        this.receiptList.paySystemInvoiceReceipt = "";
      } else if (type == 8) {
        //税务申报接收通知
        this.receiptList.taxDeclareReceiveInformReceipt = "";
      } else if (type == 9) {
        //税务申请表
        this.receiptList.taxDeclareBlankReceipt = "";
      } else if (type == 10) {
        //税金收款回执
        this.receiptList.taxesReceipt = "";
      }
    },
    //缴税凭证上传之前
    beroreTaxUpload() {},
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
      window.open(this.tableData[0].declareReceipt);
    },
    //预览扣款回执
    previewDebit() {
      window.open(this.tableData[0].debitReceipt);
    },
    //预览税金缴纳凭证
    previewTax(url) {
      window.open(url);
    },
    //预览抵扣文件
    previewDeduct(url) {
      window.open(url);
    },
    //确认上传申报回执
    sureUpload() {
      let params = {};
      if (this.detailInfo.countryCode == "AE") {
        if (this.receiptList.taxesReceipt == "") {
          this.$Message.info("请上传税金收款回执");
          return;
        }
        params = { ...this.receiptList };
        params.workId = this.workId;
      } else if (this.detailInfo.countryCode == "SA") {
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
        if (this.receiptList.invoiceReceipt == "") {
          this.$Message.info("请上传发票开具通知");
          return;
        }
        if (this.receiptList.taxDeclareReceiveInformReceipt == "") {
          this.$Message.info("请上传税务申报接收通知");
          return;
        }
        if (this.receiptList.taxDeclareBlankReceipt == "") {
          this.$Message.info("请上传税务申请表");
          return;
        }
        params = { ...this.receiptList };
        params.workId = this.workId;
      } else {
        let declareReceipt = "";
        const self = this;
        this.declareReceipt.map((v, i) => {
          if (i != self.declareReceipt.length - 1) {
            declareReceipt += v.response.data.fileUrl + ";";
          } else {
            declareReceipt += v.response.data.fileUrl;
          }
        });
        params = {
          declareReceipt,
          workId: this.workId,
          uploadDebitReceipt: this.uploadDebitReceipt
        };
      }
      if (this.isRowBtn) {
        params.workId = this.rowData.id;
        if (this.rowData.status == 27 && this.rowData.countryCode === "IT") {
          this.uploadDeclearAgain(params);
        } else {
          this.uploadDeclearFirst(params);
        }
        return;
      }
      if (this.progressBar == 27) {
        this.uploadDeclearAgain(params);
      } else {
        this.uploadDeclearFirst(params);
      }
    },
    //上传申报回执
    uploadDeclearFirst(params) {
      API.uploadDeclareNew(params).then(res => {
        if (res.code == 0) {
          this.$Message.success("上传成功");
          if (this.isRowBtn) {
            this.getregisterInfo();
          } else {
            this.$emit("refresh");
          }
          this.uploadReceiptModal = false;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    //重新上传申报回执
    uploadDeclearAgain(params) {
      API.ITReSubmit(params).then(res => {
        if (res.code == 0) {
          this.$Message.success("上传成功");
          if (this.isRowBtn) {
            this.getregisterInfo();
          } else {
            this.$emit("refresh");
          }
          this.uploadReceiptModal = false;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    //确认上传缴税凭证
    sureUploadTax() {
      let certificateUrl = "";
      const self = this;
      if (this.taxCertificate.length == 0) {
        this.$Message.info("请先上传缴税凭证");
        return;
      }
      this.taxCertificate.map((v, i) => {
        if (i != self.taxCertificate.length - 1) {
          certificateUrl += v.response.data.fileUrl + ";";
        } else {
          certificateUrl += v.response.data.fileUrl;
        }
      });
      let params = {
        certificateUrl: certificateUrl,
        workId: this.workId
        // servicesId: this.detailInfo.orderServicesId
      };
      if (this.isRowBtn) {
        params.workId = this.rowData.id;
      }
      API.uploadTaxNew(params).then(res => {
        if (res.code == 0) {
          this.$Message.success("缴税凭证上传成功");
          if (this.isRowBtn) {
            this.getregisterInfo();
          } else {
            this.$emit("refresh");
          }
          this.taxFileModal = false;
        } else {
          this.$Message.warning(res.message);
        }
      });
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
        title: "是否确认完成转代理",
        content: "<p>确认后不可修改，客户进入正常申报流程</p>",
        onOk: () => {
          let params = {
            servicesId: this.id
          };
          API.finishAgent(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.$emit("refresh");
            }
          });
        },
        onCancel: () => {}
      });
    },
    beroreVATcarUpload() {},
    VATcarUploadSuccess(res, file, fileList) {
      this.vatCertificate = res.data.fileUrl;
    },
    removeVATcar(file, fileList) {
      this.vatCertificate = "";
    },
    vatTaxNumberFileUploadSuccess(res, file, fileList) {
      this.vatTaxNumberFile = res.data.fileUrl;
    },
    removeVatTaxNumberFile(file, fileList) {
      this.vatTaxNumberFile = "";
    },
    //确认上传VAT证书
    sureUploadVATcar() {
      let data = {
        vatCertificate: this.vatCertificate,
        workId: this.submitForm.id
      };
      API2.uploadVatCertificate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success("上传成功");
          this.getregisterInfo();
          this.vatCertificateFileModal = false;
        }
      });
    },
    //确认VAT税号文件
    sureUploadVatTaxNumberFile() {
      let data = {
        vatTaxNumberFile: this.vatTaxNumberFile,
        workId: this.submitForm.id
      };
      API2.uploadVatCertificate(data).then(res => {
        if (res.code === 0) {
          this.$Message.success("上传成功");
          this.getregisterInfo();
          this.vatTaxNumberFileModal = false;
        }
      });
    },
    getCompanyList() {
      API2.getLenovoSearchCompany({
        userId: this.userId
      })
        .then(res => {
          if (res.code === 0) {
            if (JSON.stringify(res.data) !== "{}") {
              this.lenovoSearchList = res.data;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectCompany: Throttle(function(obj) {
      let that = this;
      API2.getMaterial({
        companyName: obj,
        userId: that.userId
      })
        .then(res => {
          if (res.code === 0) {
            let that = this;
            if (JSON.stringify(res.data) !== "{}") {
              for (const key in res.data) {
                if (res.data.hasOwnProperty(key) && that.submitForm.hasOwnProperty(key)) {
                  that.submitForm[key] = res.data[key];
                  if (that.detailInfo.countryCode == "SA") {
                    that.formLeft[key] = res.data[key];
                  }
                }
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }),
    //时间格式转换
    formatDate(date) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d + " 00:00:00";
      } else {
        return date;
      }
    },
    // 判读是否授权
    isHasAuth(detailInfo) {
      let that = this;
      if (detailInfo.countryCode !== "GB") return;
      if (!(detailInfo.progressBar >= 4)) return;
      API2.ifAuth({
        serviceId: detailInfo.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      })
        .then(res => {
          if (res.code === 0) {
            this.isAuth = res.data;
            if (res.data === false && detailInfo.countryCode === "GB") {
              this.$Message.info("该公司还没授权，请点击授权报税按钮进行授权");
            } else if (res.data && detailInfo.countryCode === "GB") {
              that.getVatObligations();
              that.$store.commit("hasAuth", {
                vatTaxNumber: detailInfo.vatTaxNumber,
                auth: true
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 开始授权
    startTaxFun(detailInfo) {
      if (!detailInfo) {
        var detailInfo = this.detailInfo;
      }
      let that = this;
      API2.ifAuth({
        serviceId: this.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      })
        .then(res => {
          if (res.code === 0) {
            if (res.data) {
              that.getVatObligations();
            } else {
              that.getwayFun(detailInfo);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 判断是否授权
    hasAuthFun(detailInfo) {
      let that = this;
      API2.ifAuth({
        serviceId: detailInfo.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber
      })
        .then(res => {
          if (res.code === 0) {
            if (res.data) {
              that.hasAuth = true;
              that.getVatObligations();
              that.$store.commit("hasAuth", {
                vatTaxNumber: detailInfo.vatTaxNumber,
                auth: true
              });
            } else {
              that.hasAuth = false;
              that.getwayFun(detailInfo);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //税局getway 进去授权
    getwayFun(detailInfo) {
      API2.mtdAuth({
        serviceId: this.id,
        userId: detailInfo.userId,
        vatTaxNumber: detailInfo.vatTaxNumber,
        location: 1
      })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            // window.localStorage.setItem('detailInfoForAuth', JSON.stringify(detailInfo))
            this.getVatObligations();
            window.location.href = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 检索增值税义务
    getVatObligations() {
      let that = this;
      API2.vatObligations({
        serviceId: that.id,
        userId: that.detailInfo.userId,
        vatTaxNumber: that.detailInfo.vatTaxNumber
      })
        .then(res => {
          if (res.code === 0) {
            that.VatObligationsData = res.data;
            that.$store.commit("getVatObligationsData", res.data);
            //   that.startTax = true
            API1.getRegDetailInfo({ serviceId: this.id }).then(res => {
              that.tableData = [];
              that.tableData = res.data.taxWorkOrderList;
              that.tableData.forEach(element => {
                if (element.taxCertificate !== "") {
                  element.taxCertificate = element.taxCertificate.split(";");
                } else {
                  element.taxCertificate = [];
                }
              });
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选择报税区间去报税
    goToDeclare(row) {
      var declareInfo = { ...this.detailInfo, ...this.tableData, ...row };
      this.$store.commit("getDeclareInfo", declareInfo);
      this.startTax = false;
      this.$emit("showTaxModal", this.tableData[0].id, this.id);
    },
    // 确认收到授权书
    sureReceived() {
      API1.confirmReceiptES({ workId: this.submitForm.id }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.$emit("refresh");
        }
      });
    },
    // 录入海牙信息
    sureEnterHaugeInfo() {
      let data = {
        hyFile: this.hyFile,
        workId: this.submitForm.id
      };
      API1.enteringHaugeInfo(data).then(res => {
        if (res.code === 0) {
          this.enterHaugeInfo = false;
          this.$Message.success("操作成功");
          this.$emit("refresh");
        }
      });
    },
    //填写寄送海牙单号
    sureEnterTrankingNumber() {
      let data = {
        hyNumber: this.hyNumber,
        workId: this.submitForm.id
      };
      API1.enteringHaugeTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.enterTrankingNumber = false;
          this.$Message.success("操作成功");
          this.$emit("refresh");
        }
      });
    },
    //填写SIRET号
    sureEnterSIRETNumber() {
      let data = {
        siretNumber: this.SIRETNumber,
        workId: this.submitForm.id
      };
      API2.enterSIRETNumber(data).then(res => {
        if (res.code === 0) {
          this.SIRETMadol = false;
          this.$Message.success("操作成功");
          this.declearList = [];
          this.getregisterInfo();
        }
      });
    },
    //填写寄送税局的物流单号
    sureTaxTrankingNumber() {
      let data = {
        taxSendNumber: this.taxSendNumber,
        workId: this.submitForm.id
      };
      API1.enteringTaxTrankingNumber(data).then(res => {
        if (res.code === 0) {
          this.sendTaxBox = false;
          this.$Message.success("操作成功");
          this.$emit("refresh");
        }
      });
    },
    // 添加getway账号密码
    addGetWatId() {
      var data = {
        workId: this.submitForm.id,
        gatewayId: this.gateWayForm.account,
        gatewayPassword: this.gateWayForm.password
      };
      API2.uploadVatCertificate(data)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success("修改成功");
            this.getregisterInfo();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //沙特股份列表
    addShares() {
      let obj = {
        shareholderZhName: "",
        shareholderEnName: "",
        position: "",
        stockProportion: "",
        shareholderBirthday: "",
        shareholderBonusScale: ""
      };
      this.sharesList.push(obj);
    },
    removeShares(i) {
      this.sharesList.splice(i, 1);
    },
    //提交发票信息
    submitInvice() {
      if (this.invoiceInfo.invoiceNumber == "") {
        this.$Message.info("请填写发票号");
        return;
      }
      if (this.isRowBtn) {
        this.invoiceInfo.workId = this.rowData.id;
      } else {
        this.invoiceInfo.workId = this.tableData[0].id;
      }
      API2.inputInvoice(this.invoiceInfo).then(res => {
        if (res.code === 0) {
          this.$Message.success("提交成功");
          if (this.isRowBtn) {
            this.getregisterInfo();
          } else {
            this.$emit("refresh");
          }
          this.invoicaBoxShow = false;
        }
      });
    },
    //录入GIBAN码
    submitGiban() {
      if (this.gibanCode == "") {
        this.$Message.info("请填写GIBAN码");
        return;
      }
      let data = {
        gibanCode: this.gibanCode,
        workId: this.tableData[0].id
      };
      if (this.isRowBtn) {
        data.workId = this.rowData.id;
      }
      API2.inputGibancode(data).then(res => {
        if (res.code === 0) {
          this.$Message.success("提交成功");
          if (this.isRowBtn) {
            this.getregisterInfo();
          } else {
            this.$emit("refresh");
          }
          this.gibanBox = false;
        }
      });
    },
    // 修改税号信息
    editTaxInfo(detailInfo) {
      var data = JSON.parse(JSON.stringify(detailInfo));
      this.addTaxNum = data;
      this.editTaxNumModal = true;
    },
    // 删除修改税号信息文件
    removeItem(item) {
      this.addTaxNum[item] = "";
    },
    //修改税号信息
    editTaxNumInfo() {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "<p>请确认您要上传的资料是否正确</p>",
        onOk: () => {
          API2.uploadVatCertificate({
            deEuCertificate: this.addTaxNum.deEuCertificate,
            eoriNumber: this.addTaxNum.eoriNumber,
            eoriNumberFile: this.addTaxNum.eoriNumberFile,
            gatewayId: this.addTaxNum.gatewayId,
            gatewayPassword: this.addTaxNum.gatewayPassword,
            secret: this.addTaxNum.secret,
            vatCertificate: this.addTaxNum.vatCertificate,
            vatTaxNumberCopyFile: this.addTaxNum.vatTaxNumberCopyFile,
            vatTaxNumberFile: this.addTaxNum.vatTaxNumberFile,
            workId: this.submitForm.id
          }).then(res => {
            if (res.code === 0) {
              this.$Message.success("文件修改成功");
              this.getregisterInfo();
              this.editTaxNumModal = false;
            }
          });
        }
      });
    },
    taxFileRecordModal(row) {
      this.isRowBtn = true;
      this.taxFileModal = true;
      this.rowData = row;
    },
    uploadReceiptModalFun(row) {
      this.rowData = row;
      this.uploadReceiptModal = true;
      this.isRowBtn = true;
    },
    auditFun(row) {
      this.rowData = row;
      this.auditModal = true;
      this.isRowBtn = true;
    },
    entryInvoice(row) {
      this.rowData = row;
      this.invoicaBoxShow = true;
      this.isRowBtn = true;
    },
    entryGIBAN(row) {
      this.rowData = row;
      this.gibanBox = true;
      this.isRowBtn = true;
    },
    modalState(val) {
      if (val === false) {
        this.isRowBtn = false;
      }
    },
    //查看原因
    lookReason(type, row, clickType) {
      this.resonModelFR = true;
      this.declareRow = row;
      if (type == 1) {
        this.resonModelTitle = "重新提交";
      } else if (type == 2) {
        this.resonModelTitle = "扣款失败原因";
      }
      if (clickType === "isDeclareInfo") {
        this.isDeclareInfo = true;
      } else {
        this.isDeclareInfo = false;
      }
      this.getFRrecordFun(row);
    },
    //获取法国提交失败原因
    getFRrecordFun(row) {
      let data = { workId: this.workId };
      if (row != undefined) {
        data.workId = row.id;
      }
      API.frRecord(data).then(res => {
        if (res.code == 0) {
          this.frReason = res.data.erreurLibelle;
          if (res.data.errorRecordList.length > 0) {
            res.data.errorRecordList.map((item, index) => {
              this.frReason += item.libelle + ";";
            });
          }
        }
      });
    },
    //重新提交
    submitFRagain() {
      let data = { workId: "" };
      if (this.isDeclareInfo) {
        data.workId = this.declareInfo.id;
      } else {
        data.workId = this.declareRow.id;
      }
      API.frReSubmit(data).then(res => {
        this.resonModelFR = false;
      });
    },
    //德国提交年报
    goAnnalsDE(row) {
      let beginTime = "";
      if (this.detailInfo.productFunctionCode == 5 || (this.detailInfo.productFunctionCode == 2 && row.beginTime)) {
        beginTime = row.beginTime.slice(0, 7);
      }
      let endTime = row.endTime.slice(0, 7);
      let baseData = {
        companyName: this.detailInfo.companyName,
        vatTaxNumber: this.detailInfo.vatTaxNumber,
        companyNameEn: this.detailInfo.companyNameEn,
        year: row.year,
        time: beginTime + "至" + endTime,
        endTime: endTime,
        beginTime: beginTime,
        productFunctionCode: this.detailInfo.productFunctionCode
      };
      let detailsReturnData = {
        allTaxPrice: row.allTaxPrice,
        deductionPrice: row.deductionPrice,
        excludeTaxPrice: row.excludeTaxPrice
      };
      this.$emit("showAnnalsModal", row.id, baseData, detailsReturnData);
    },
    //德国生成年报工单
    creatAnnalsFun() {
      let data = { serviceId: this.detailInfo.id };
      APIDE.creatAnnalsApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success("生成年报成功");
          this.getregisterInfo();
        }
      });
    },
    //获取德国年报工单详情
    getDEyearDetailFun(row) {
      this.thatDEinfo = {
        year: row.year,
        beginTime: row.beginTime,
        endTime: row.endTime,
        declareReceipt: row.declareReceipt
      };
      this.deYearDetail = true;
      let data = { workId: row.id };
      APIDE.deAnnalsApiDetail(data).then(res => {
        if (res.code === 0) {
          this.deAnnalsData = res.data;
        }
      });
    },
    // 审核 审核申报 弹窗
    auditDeclareSubmit(name) {
      if (this.isRowBtnAuditDeclare) {
        this.auditForm.workId = this.rowDataAuditDeclare.id;
      } else {
        this.auditForm.workId = this.tableData[0].id;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          API2.auditTaxWorkOrder(this.auditForm)
            .then(res => {
              if (res.code === 0) {
                this.$Message.success("操作成功");
                this.$emit("refresh");
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
        }
      });
    },
    // 修改抵扣明细
    editDeduction(row) {
      this.deductionForm = JSON.parse(JSON.stringify(row));
      this.editDeductionModal = true;
    },
    beforeUploadHandlerDeductionFile(file) {
      let self = this;
      const check = self.deductionForm.deductionFile == "";
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
      this.deductionForm.fileOriginalName = "";
    },
    changeBillDate(val) {
      this.deductionForm.billDate = val;
    },
    deductionFormSubmit(type) {
      if (this.deductionForm.deductionType === "") {
        this.$Message.error("请选择抵扣类型");
        return;
      }
      if (this.deductionForm.billDate === "") {
        this.$Message.error("请选择单据日期");
        return;
      }
      if (this.deductionForm.deductiontAmt === "") {
        this.$Message.error("请输入抵扣金额");
        return;
      }
      if (this.deductionForm.deductionFile === "") {
        this.$Message.error("请上传抵扣凭证");
        return;
      }
      this.deductionForm.billDate = this.formatDate(this.deductionForm.billDate);
      let data = { ...this.deductionForm, ...{ taxWorkId: this.workId } };
      if (type === 1) {
        API2.taxDeductionItem(data)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success("修改成功");
              this.editDeductionModal = false;
              this.getregisterInfo();
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (type === 2) {
        API2.taxDeleteDeductionItem(data)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success("删除成功");
              this.editDeductionModal = false;
              this.getregisterInfo();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 申报驳回后 重新提交申报
    resubmissionDeclaration($event, row) {
      let params = {};
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
        };
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
        };
      }
      this.$Modal.confirm({
        title: "是否重新提交申报",
        onOk: () => {
          API.submitDeclareNew(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.$emit("refresh");
            }
          });
        },
        onCancel: () => {}
      });
    },
    auditDeclareModalFun(row) {
      this.auditDeclareModal = true;
      this.isRowBtnAuditDeclare = true;
      this.rowDataAuditDeclare = JSON.parse(JSON.stringify(row));
    },
    supplierSelectFun(val) {
      let that = this;
      API2.updateSupplierReg({
        supplierId: val,
        workId: this.formLeft.id
      }).then(res => {
        console.log("res", res);
      });
    }
  }
};
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
/deep/ .ivu-form-item-required {
  .ivu-form-item-label:before {
    content: "" !important;
  }
}
/deep/ .ivu-select-dropdown {
  max-height: 240px;
}
/deep/ .ivu-select-dropdown-list {
  max-width: 300px;
  overflow: hidden;
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
.editIcon {
  margin-left: 10px;
  font-size: 20px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
