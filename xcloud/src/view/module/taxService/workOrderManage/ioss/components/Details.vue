<template>
  <div class="">
    <div class="back" @click="goBack()">
      <Icon type="md-arrow-back" />返回列表
    </div>
    <div class="content">
      <div class="content-l">
        <Card>
          <p slot="title" class="companyTitleBox">
            <span>注册资料</span>
            <span>
              <Button
                type="primary"
                ghost
                style="margin-right:10px;"
                v-if="[1,3,4].includes(detailInfo.progressBar)"
                v-show="hasAuthority('IOSS_downLoad')"
                @click="downLoad"
                >下载资料</Button
              >
              <Button
                type="primary"
                style="margin-right:10px;"
                v-if="detailInfo.progressBar == 1"
                v-show="hasAuthority('IOSS_checkData')"
                @click="checkDataModal = true,checkDataForm = {}"
                >审核</Button
              >
              <Button
                type="primary"
                style="margin-right:10px;"
                v-if="detailInfo.progressBar == 3"
                v-show="hasAuthority('IOSS_editRegisterType')"
                @click="openEditRegisterTypeModal"
                >修改注册方式</Button
              >
              <Button
                type="primary"
                style="margin-right:10px;"
                v-if="detailInfo.progressBar == 3"
                v-show="hasAuthority('IOSS_addIOSSInfo')"
                @click="addIOSSInfoModal = true,addIOSSInfoForm = {}"
                >录入IOSS信息</Button
              >
              <Button
                type="primary"
                v-if="detailInfo.progressBar == 3"
                v-show="hasAuthority('IOSS_dataReject')"
                @click="dataRejectModal = true,dataRejectReason = ''"
                >资料驳回</Button
              >
            </span>
          </p>
          <!-- IOSS提交资料 -->
          <div>
            <div class="companyInfo">
              公司信息
              <p class="classTitle">
                <span></span>
                <span
                  v-if="
                    detailInfo.progressBar == 0 ||
                      detailInfo.progressBar == 8 ||
                      detailInfo.progressBar == 1
                  "
                  @click="isCompanyInfoEdit = true"
                  >【修改】</span
                >
              </p>
              <Form
                :model="submitForm"
                :label-width="180"
                class="formstyle"
                :rules="formLeftRules"
                ref="formLeft"
              >
                <FormItem
                  label="公司类型"
                  class="requiredItem"
                  prop="companyType"
                >
                  <RadioGroup
                    v-model="submitForm.companyType"
                    @on-change="companyTypeChange($event)"
                  >
                    <Radio :disabled="!isCompanyInfoEdit" :label="'1'"
                      >大陆公司</Radio
                    >
                    <Radio :disabled="!isCompanyInfoEdit" :label="'2'"
                      >香港公司</Radio
                    >
                    <Radio :disabled="!isCompanyInfoEdit" :label="'3'"
                      >境外公司</Radio
                    >
                  </RadioGroup>
                </FormItem>
                <FormItem
                  prop="companyBusinessLicense"
                  label="公司营业执照"
                  class="requiredItem"
                  v-if="submitForm.companyType === '1'"
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyBusinessLicense'
                        );
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
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="submitForm.companyBusinessLicense">
                    <div
                      class="fileBox"
                      v-if="submitForm.companyBusinessLicense != ''"
                    >
                      <a
                        target="_blank"
                        @click="previewFile(submitForm.companyBusinessLicense)"
                      >
                        {{ "营业执照" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="
                            removeHandler('', '', 'companyBusinessLicense')
                          "
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyBusinessRegistrationBr"
                  label="商业登记证BR扫描件"
                  class="requiredItem"
                  v-if="submitForm.companyType === '2'"
                >
                  <Upload
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyBusinessRegistrationBr'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyBusinessRegistrationBr'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="submitForm.companyBusinessRegistrationBr">
                    <div
                      class="fileBox"
                      v-if="submitForm.companyBusinessRegistrationBr != ''"
                    >
                      <a
                        @click="
                          previewFile(submitForm.companyBusinessRegistrationBr)
                        "
                      >
                        {{ "商业登记证BR扫描件" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="
                            removeHandler(
                              '',
                              '',
                              'companyBusinessRegistrationBr'
                            )
                          "
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyRegistrationCi"
                  label="公司注册证明书CI扫描件"
                  class="requiredItem"
                  v-if="submitForm.companyType === '2'"
                >
                  <Upload
                    ref="CIFILE"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyRegistrationCi'
                        );
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
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="submitForm.companyRegistrationCi">
                    <div
                      class="fileBox"
                      v-if="submitForm.companyRegistrationCi != ''"
                    >
                      <a
                        target="_blank"
                        @click="previewFile(submitForm.companyRegistrationCi)"
                      >
                        {{ "公司注册证明书CI扫描件" }}
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="
                            removeHandler('', '', 'companyRegistrationCi')
                          "
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyCorporateFoundingNnc1"
                  label="法团成立表格NNC1扫描件"
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyCorporateFoundingNnc1'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyCorporateFoundingNnc1'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="submitForm.companyCorporateFoundingNnc1">
                      <div v-if="submitForm.companyCorporateFoundingNnc1 != ''">
                        <a
                          target="_blank"
                          @click="
                            previewFile(submitForm.companyCorporateFoundingNnc1)
                          "
                        >
                          {{ "法团成立表格NNC1扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="
                              removeHandler(
                                '',
                                '',
                                'companyCorporateFoundingNnc1'
                              )
                            "
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyBusinessLicense"
                  label="英文营业执照"
                  class="requiredItem"
                  v-if="submitForm.companyType === '3'"
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyBusinessLicense'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyBusinessLicense'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="submitForm.companyBusinessLicense">
                    <div
                      class="fileBox"
                      v-if="submitForm.companyBusinessLicense != ''"
                    >
                      <a
                        target="_blank"
                        @click="
                          previewFile(submitForm.companyBusinessLicense)
                        "
                      >
                        英文营业执照
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="
                            removeHandler(
                              '',
                              '',
                              'companyBusinessLicense'
                            )
                          "
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="articlesOfAssociationFile"
                  label="英文公司章程"
                  class="requiredItem"
                  v-if="submitForm.companyType === '3'"
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'articlesOfAssociationFile'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'articlesOfAssociationFile'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div v-if="submitForm.articlesOfAssociationFile">
                    <div
                      class="fileBox"
                      v-if="submitForm.articlesOfAssociationFile != ''"
                    >
                      <a
                        target="_blank"
                        @click="
                          previewFile(submitForm.articlesOfAssociationFile)
                        "
                      >
                        英文公司章程
                        <Icon
                          v-if="isCompanyInfoEdit"
                          type="ios-close-circle"
                          @click.stop="
                            removeHandler('', '', 'articlesOfAssociationFile')
                          "
                        />
                      </a>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  label="公司中文名称："
                  class="requiredItem"
                  prop="companyNameZh"
                >
                  <!-- <AutoComplete
                    v-model="submitForm.companyNameZh"
                    :data="lenovoSearchList"
                    filterable
                    :disabled="!isCompanyInfoEdit"
                    @on-select="selectCompany"
                    style="width:300px;"
                    placeholder="请输入公司中文名称"
                  >
                  </AutoComplete> -->
                  <!-- <Select
                    v-model="submitForm.companyNameZh"
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司中文名称"
                    @on-change="selectCompany"
                    style="width:300px;"
                    filterable
                  >
                    <Option
                      v-for="(option, index) in lenovoSearchList"
                      :value="option"
                      :key="index"
                      >{{ option }}</Option
                    >
                  </Select> -->
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司中文名称"
                    v-model="submitForm.companyNameZh"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="公司英文名称："
                  class="requiredItem"
                  prop="companyNameEn"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司英文名称"
                    v-model="submitForm.companyNameEn"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="公司邮箱："
                  class="requiredItem"
                  prop="companyEmail"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司邮箱"
                    v-model="submitForm.companyEmail"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="公司英文地址："
                  class="requiredItem"
                  prop="companyAddressEn"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司英文地址(根据营业执照填写)"
                    v-model="submitForm.companyAddressEn"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem label="公司电话：" class="noRedIcon">
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入公司电话"
                    v-model="submitForm.companyTel"
                    style="width: 300px"
                  />
                </FormItem>
                <p class="classTitle">
                  <span>法人信息</span>
                </p>
                <FormItem
                  label="证件类型："
                  class="requiredItem"
                  prop="certificateType"
                >
                  <RadioGroup v-model="submitForm.certificateType">
                    <Radio
                      :disabled="
                        !isCompanyInfoEdit || submitForm.companyType == '3'
                      "
                      label="1"
                      >身份证</Radio
                    >
                    <Radio :disabled="!isCompanyInfoEdit" label="2">护照</Radio>
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyLegalPersonCardFront'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyLegalPersonCardFront'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="submitForm.companyLegalPersonCardFront">
                      <div v-if="submitForm.companyLegalPersonCardFront != ''">
                        <a
                          target="_blank"
                          @click="
                            previewFile(submitForm.companyLegalPersonCardFront)
                          "
                        >
                          {{ "法人身份证正面扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="
                              removeHandler(
                                '',
                                '',
                                'companyLegalPersonCardFront'
                              )
                            "
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyLegalPersonCardReverse'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyLegalPersonCardReverse'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="submitForm.companyLegalPersonCardReverse">
                      <div
                        v-if="submitForm.companyLegalPersonCardReverse != ''"
                      >
                        <a
                          target="_blank"
                          @click="
                            previewFile(
                              submitForm.companyLegalPersonCardReverse
                            )
                          "
                        >
                          {{ "法人身份证反面扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="
                              removeHandler(
                                '',
                                '',
                                'companyLegalPersonCardReverse'
                              )
                            "
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  prop="companyLegalPersonCardPassport"
                  label="法人护照扫描件："
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
                        successHandler(
                          res,
                          file,
                          fileList,
                          'companyLegalPersonCardPassport'
                        );
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(
                          file,
                          fileList,
                          'companyLegalPersonCardPassport'
                        );
                      }
                    "
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    style="width:300px"
                    :disabled="!isCompanyInfoEdit"
                    :show-upload-list="false"
                  >
                    <div style="padding: 10px 0">
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="submitForm.companyLegalPersonCardPassport">
                      <div
                        v-if="submitForm.companyLegalPersonCardPassport != ''"
                      >
                        <a
                          target="_blank"
                          @click="
                            previewFile(
                              submitForm.companyLegalPersonCardPassport
                            )
                          "
                        >
                          {{ "法人护照扫描件" }}
                          <Icon
                            v-if="isCompanyInfoEdit"
                            type="ios-close-circle"
                            @click.stop="
                              removeHandler(
                                '',
                                '',
                                'companyLegalPersonCardPassport'
                              )
                            "
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormItem>
                <FormItem
                  label="法人中文姓名："
                  class="requiredItem"
                  prop="companyLegalPersonZh"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入法人中文姓名"
                    v-model="submitForm.companyLegalPersonZh"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem
                  label="法人英文姓名："
                  class="requiredItem"
                  prop="companyLegalPersonEn"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入法人英文姓名"
                    v-model="submitForm.companyLegalPersonEn"
                    style="width: 300px"
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
                <FormItem
                  label="法人出生日期："
                  class="requiredItem"
                  prop="companyLegalPersonBirthday"
                >
                  <DatePicker
                    :disabled="!isCompanyInfoEdit"
                    v-model="submitForm.companyLegalPersonBirthday"
                    type="date"
                    placeholder="请选择法人出生日期"
                    style="width: 300px"
                  ></DatePicker>
                </FormItem>
                <!-- <FormItem
                  label="法人身份证英文地址："
                  class="requiredItem"
                  prop="companyLegalPersonCardAddress"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入身份证英文地址"
                    v-model="submitForm.companyLegalPersonCardAddress"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="法人身份证中文地址："
                  prop="companyLegalPersonCardAddressZh"
                  class="requiredItem"
                >
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
                          submitForm.companyLegalPersonSign !== '' &&
                            submitForm.companyLegalPersonSign !== undefined
                        "
                        :src="submitForm.companyLegalPersonSign"
                        alt=""
                      />
                    </div>
                  </div>
                </FormItem> -->
                <p class="classTitle">
                  <span>店铺信息</span>
                </p>
                <FormItem
                  label="店铺所在电商平台:"
                  prop="shopSalePlatformName"
                  class="requiredItem"
                >
                  <RadioGroup v-model="submitForm.shopSalePlatformName">
                    <Radio label="Amazon" :disabled="!isCompanyInfoEdit"
                      >Amazon</Radio
                    >
                    <Radio label="eBay" :disabled="!isCompanyInfoEdit"
                      >eBay</Radio
                    >
                    <Radio label="速卖通" :disabled="!isCompanyInfoEdit"
                      >速卖通</Radio
                    >
                    <Radio label="独立站/自建站" :disabled="!isCompanyInfoEdit"
                      >独立站/自建站</Radio
                    >
                    <Radio label="其他" :disabled="!isCompanyInfoEdit"
                      >其他</Radio
                    >
                  </RadioGroup>
                </FormItem>
                <FormItem
                  label="销售网站链接："
                  prop="shopHref"
                  class="requiredItem"
                >
                  <Input
                    v-model="submitForm.shopHref"
                    style="width: 300px"
                    placeholder="请输入销售网站链接或站点链接"
                    :disabled="!isCompanyInfoEdit"
                  ></Input>
                </FormItem>
                <FormItem
                  label="商品销往国："
                  class="requiredItem"
                  prop="productSalesCountry"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入商品销往国，如果多个，用英文逗号隔开"
                    v-model="submitForm.productSalesCountry"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="任一欧盟国家税号："
                  style="width:300px;"
                >
                  <Row style="width:300px;">
                    <Col :span="12">
                      <Input
                        v-model="submitForm.taxVatCountry"
                        placeholder="税号国家（中文）"
                        style="width:140px;margin-right:10px;"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </Col>
                    <Col :span="12">
                      <Input
                        v-model="submitForm.shopOtherEuTaxNumber"
                        style="width:150px;"
                        placeholder="请输入该国税号"
                        :disabled="!isCompanyInfoEdit"
                      ></Input>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="该国税号文件：" >
                  <Upload
                    ref="vatTaxEuFile"
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
                      <Icon
                        type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"
                      ></Icon>
                      <span>请拖拽文件到此区域上传或点击上传</span>
                    </div>
                  </Upload>
                  <div class="fileBox">
                    <div v-if="submitForm.vatTaxEuFile">
                      <div v-if="submitForm.vatTaxEuFile != ''">
                        <a
                          target="_blank"
                          @click="previewFile(submitForm.vatTaxEuFile)"
                        >
                          该国税号文件
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
                <FormItem
                  label="税号生效日期:"
                  prop="shopTaxEffectiveData"
                  style="width:300px;"
                >
                  <DatePicker
                    type="date"
                    :options="datePicker"
                    placeholder="请选择税号生效日期"
                    v-model="submitForm.shopTaxEffectiveData"
                    class="tax-date"
                    :disabled="!isCompanyInfoEdit"
                  ></DatePicker>
                </FormItem>
                <p class="classTitle">
                  <span>银行信息</span>
                </p>
                <FormItem
                  label="IBAN（银行卡号）："
                  class="requiredItem"
                  prop="bankAccount"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入IBAN（银行卡号）"
                    v-model="submitForm.bankAccount"
                    style="width:300px;"
                  />
                </FormItem>
                <FormItem
                  label="BIC（银行识别码）："
                  class="requiredItem"
                  prop="swiftBic"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入IBAN（银行卡号）"
                    v-model="submitForm.swiftBic"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="Account name："
                  class="requiredItem"
                  prop="bankAccountName"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入Account name（账号名称）"
                    v-model="submitForm.bankAccountName"
                    style="width: 300px"
                  />
                </FormItem>
                <FormItem
                  label="Account address："
                  class="requiredItem"
                  prop="bankAddressEn"
                >
                  <Input
                    :disabled="!isCompanyInfoEdit"
                    placeholder="请输入Account address（账号地址）"
                    v-model="submitForm.bankAddressEn"
                    style="width: 300px"
                  />
                </FormItem>
              </Form>
              <p class="fileBtn" v-if="isCompanyInfoEdit">
                <Button
                  type="primary"
                  @click="submitFile"
                  :loading="submitLoading"
                  >提交</Button
                >
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div class="content-r">
        <!-- 税号信息 -->
        <Card>
          <p slot="title">
            <span>税号信息</span>
          </p>
          <Form :label-width="110" v-if="JSON.stringify(detailInfo) != '{}'">
            <FormItem label="IOSS税号：">
              <span>{{
                detailInfo.iossNumber ? detailInfo.iossNumber : "暂无"
              }}</span>
            </FormItem>
            <FormItem label="税号下发日期：">
              <span>{{ detailInfo.taxIssueDate.substring(0, 10) || '暂无' }}</span>
            </FormItem>
            <FormItem label="税号生效日期：">
              <span>{{ detailInfo.taxEffectiveDate.substring(0, 10) || '暂无' }}</span>
            </FormItem>
            <FormItem label="IOSS税号文件：">
              <span>
                <a :href="detailInfo.iossNumberFile" v-if="detailInfo.iossNumberFile" target="_blank">{{
                  "IOSS税号文件"
                }}</a>
                <span v-if="!detailInfo.iossNumberFile">暂无</span>
              </span>
            </FormItem>
          </Form>
        </Card>
        <!-- 服务信息 -->
        <Card style="margin-top: 6px;">
          <p slot="title">
            <span>服务信息</span>
          </p>
          <Form :label-width="110">
            <FormItem label="订单号：">
              <span>{{ orderNo }}</span>
            </FormItem>
            <FormItem label="服务号：">
              <span>{{ detailInfo.serverNo }}</span>
            </FormItem>
            <FormItem label="注册状态：">
              <span>{{
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
              }}</span>
            </FormItem>
            <FormItem label="服务截止时间：">
              <span>{{ detailInfo.expirationTime }}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{ detailInfo.companyName }}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <!-- <span>{{detailInfo.productName}}</span> -->
              <span>{{
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
                  : detailInfo.productFunctionCode == "23"
                  ? "IOSS注册"
                  : ""
              }}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{ detailInfo.iossCountryName }}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{ detailInfo.createTime }}</span>
            </FormItem>
            <FormItem label="注册国家：">
              <span>{{ detailInfo.iossCountryName }}</span>
            </FormItem>
            <FormItem label="服务商：">
              <span>{{ detailInfo.supplierName || "暂无" }}</span>
            </FormItem>
            <FormItem label="服务商分配编码：">
              <span>{{ detailInfo.supplierAssignsServiceId }}</span>
              <Icon
                class="editIcon"
                type="ios-create-outline"
                @click="
                  (supplierServiceIDModal = true),
                    (supplierServiceID = detailInfo.supplierAssignsServiceId)
                "
              />
            </FormItem>
            <FormItem label="审核时间：">
              <span>{{ detailInfo.materialAuditDate }}</span>
            </FormItem>
          </Form>
        </Card>
        <!-- 用户信息 -->
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
        <!-- 操作记录 -->
        <Card style="margin-top: 6px;" class="operationLogs">
          <p slot="title">操作记录</p>
          <div v-if="consoleOperationLogs.length > 0" class="logsContent">
            <div v-for="(row, index) in consoleOperationLogs" :key="index">
              <div>
                <p class="itemTop">{{ row.instruction }}</p>
                <p v-if="row.remark">备注：{{ row.remark }}</p>
                <div class="itemBottom">
                  <span style="margin-right:10px;"
                    >时间：{{ row.createTime }}</span
                  >
                  <span
                    >操作人：{{
                      row.adminUserNickName || row.adminUserMobile
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <Modal title="修改服务商分配编码" v-model="supplierServiceIDModal">
      <Input
        style="width:300px;"
        placeholder="请输入服务商分配编码"
        v-model="supplierServiceID"
      ></Input>
      <p slot="footer">
        <Button type="primary" @click="confirmUpdateSupplierServiceID"
          >确认</Button
        >
      </p>
    </Modal>
    <!-- 审核资料 -->
    <Modal v-model="checkDataModal" class="checkDataModal" title="审核资料">
      <Form :label-width="120" ref="checkDataForm">
        <FormItem label="是否通过：" class="requiredItem">
          <RadioGroup v-model="checkDataForm.status">
            <Radio label="1">
              <span>审核通过</span>
            </Radio>
            <Radio label="0">
              <span>资料不对，驳回</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <template v-if="checkDataForm.status == 1">
          <FormItem label="选择注册国家：" class="requiredItem">
            <Select
              style="width:200px;"
              clearable
              filterable
              v-model="checkDataForm.countryCode"
              @on-change="countryChange($event,8)"
              placeholder="注册国家"
            >
              <Option
                v-for="(item, index) in countryList"
                :value="item.code"
                :key="index"
                >{{ item.value }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="注册方式：" class="requiredItem">
            <RadioGroup v-model="checkDataForm.registerType">
              <Radio label="1">
                <span>服务商注册</span>
              </Radio>
              <Radio label="2">
                <span>自行注册</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            label="请选择服务商："
            class="requiredItem"
            v-if="checkDataForm.registerType == 1"
          >
            <Select
              style="width:200px;"
              clearable
              filterable
              v-model="checkDataForm.supplierId"
              placeholder="服务商"
            >
              <Option
                v-for="(item, index) in facilitatorList"
                :value="item.id"
                :key="index"
                >{{ item.shortName }}</Option
              >
            </Select>
          </FormItem>
        </template>
        <template v-if="checkDataForm.status == 0">
          <FormItem label="请输入驳回原因：" class="requiredItem">
            <Input
              type="textarea"
              v-model="checkDataForm.reason"
              :rows="4"
              placeholder="请填写驳回原因"
              style="width: 300px"
            ></Input>
          </FormItem>
        </template>
      </Form>
      <p slot="footer">
        <Button
          type="primary"
          ghost
          style="margin-right:20px;"
          @click="checkDataModal = false"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="checkDataloading"
          @click="checkDataConfirm"
          >确认</Button
        >
      </p>
    </Modal>
    <!-- 修改注册方式 -->
    <Modal
      v-model="editRegisterTypeModal"
      class="checkDataModal"
      title="修改注册方式"
    >
      <Form :label-width="120" ref="checkDataForm">
        <FormItem label="选择注册国家：" class="requiredItem">
          <Select
            style="width:200px;"
            clearable
            filterable
            v-model="editRegisterTypeForm.countryCode"
            @on-change="countryChange($event,8)"
            placeholder="注册国家"
          >
            <Option
              v-for="(item, index) in countryList"
              :value="item.code"
              :key="index"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="注册方式：" class="requiredItem">
          <RadioGroup v-model="editRegisterTypeForm.registerType">
            <Radio label="1">
              <span>服务商注册</span>
            </Radio>
            <Radio label="2">
              <span>自行注册</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="请选择服务商："
          class="requiredItem"
          v-if="editRegisterTypeForm.registerType == 1"
        >
          <Select
            style="width:200px;"
            clearable
            filterable
            v-model="editRegisterTypeForm.supplierId"
            placeholder="服务商"
          >
            <Option
              v-for="(item, index) in facilitatorList"
              :value="item.id"
              :key="index"
              >{{ item.shortName }}</Option
            >
          </Select>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button
          type="primary"
          ghost
          style="margin-right:20px;"
          @click="editRegisterTypeModal = false"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="editRegisterTypeLoading"
          @click="editRegisterTypeConfirm"
          >确认</Button
        >
      </p>
    </Modal>
    <!-- 资料驳回 -->
    <Modal v-model="dataRejectModal" class="checkDataModal" title="资料驳回">
      <Form :label-width="120" ref="checkDataForm">
        <FormItem label="请输入驳回原因：" class="requiredItem">
          <Input
            type="textarea"
            v-model="dataRejectReason"
            :rows="4"
            placeholder="请填写驳回原因"
            style="width: 300px"
          ></Input>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button
          type="primary"
          ghost
          style="margin-right:20px;"
          @click="dataRejectModal = false"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="dataRejectLoading"
          @click="dataRejectConfirm"
          >确认</Button
        >
      </p>
    </Modal>
    <!-- 录入IOSS信息 -->
    <Modal
      v-model="addIOSSInfoModal"
      class="checkDataModal"
      title="录入IOSS信息"
    >
      <Form :label-width="120" ref="addIOSSInfoForm">
        <FormItem label="IOSS税号：" class="requiredItem">
          <Input
            placeholder="请输入IOSS税号"
            v-model="addIOSSInfoForm.iossNumber"
            style="width: 300px"
          />
        </FormItem>
        <FormItem label="税号下发日期：" class="requiredItem">
          <DatePicker
            v-model="taxIssueDate"
            type="date"
            @on-change="taxIssueDateChange($event)"
            placeholder="请选择税号下发日期"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem label="税号生效日期：" class="requiredItem">
          <DatePicker
            v-model="taxEffectiveDate"
            type="date"
            @on-change="taxEffectiveDateChange($event)"
            placeholder="请选择税号生效日期"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem label="税号文件：">
          <Upload
            ref="iossNumberFile"
            type="drag"
            :action="fileUpload"
            :data="{ prefix: '' }"
            :on-success="
              (res, file, fileList) => {
                addIOSSInfoSuccessHandler(
                  res,
                  file,
                  fileList,
                  'iossNumberFile'
                );
              }
            "
            :on-remove="
              (file, fileList) => {
                addIOSSInfoRemoveHandler(file, fileList, 'iossNumberFile');
              }
            "
            :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
            style="width:300px"
            :show-upload-list="false"
          >
            <div style="padding: 10px 0">
              <Icon
                type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"
              ></Icon>
              <span>请拖拽文件到此区域上传或点击上传</span>
            </div>
          </Upload>
          <div class="fileBox">
            <div v-if="addIOSSInfoForm.iossNumberFile">
              <div v-if="addIOSSInfoForm.iossNumberFile != ''">
                <a
                  target="_blank"
                  @click="previewFile(addIOSSInfoForm.iossNumberFile)"
                >
                  税号文件
                  <Icon
                    type="ios-close-circle"
                    @click.stop="
                      addIOSSInfoRemoveHandler('', '', 'iossNumberFile')
                    "
                  />
                </a>
              </div>
            </div>
          </div>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button
          type="primary"
          ghost
          style="margin-right:20px;"
          @click="addIOSSInfoModal = false"
          >取消</Button
        >
        <Button
          type="primary"
          :loading="addIOSSInfoLoading"
          @click="addIOSSInfoConfirm"
          >确认</Button
        >
      </p>
    </Modal>
  </div>
</template>

<script>
import * as API from "@/api/taxService/workOrder.js";
import * as API1 from "@/api/taxService/regAndDeclare.js";
import * as API2 from "@/api/taxService/taxModule.js";
import * as API3 from "@/api/taxService/ioss.js";
import { getTaxCountry } from "@/api/taxService/common.js";
import facilitatorAndTax from "@/view/module/taxService/common/facilitatorAndTax.js";
import { getToken } from "@/libs/util";
import { Throttle } from "@/libs/throttle";
export default {
  extends: facilitatorAndTax,
  props: ["id", "progressBar", "userId", "isService"],
  data() {
    return {
      orderNo: "",
      detailInfo: {},
      consoleOperationLogs: [],
      submitForm: {},
      formLeftRules: {
        taxAuthorityNameZh: [
          {
            required: true,
            trigger: "blur",
            message: "请输入公司所在地的税务机关名称（中文）"
          }
        ],
        taxAuthorityNameEn: [
          {
            required: true,
            trigger: "blur",
            message: "请输入公司所在地的税务机关名称（英文）"
          }
        ],
        taxAuthorityAddrZh: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上述税务机关的地址（中文）"
          }
        ],
        taxAuthorityAddrEn: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上述税务机关的地址（英文）"
          }
        ],
        officeAddressEn: [
          { required: true, trigger: "blur", message: "请输入完整的经营地址" }
        ],

        amazonShopAccount: [
          {
            required: true,
            trigger: "blur",
            message: "请输入亚马逊账号的完整名称"
          }
        ],
        amazonSellerLink: [
          {
            required: true,
            trigger: "blur",
            message: "请输入亚马逊卖家信息链接"
          }
        ],
        amazonProductsLink: [
          {
            required: true,
            trigger: "blur",
            message: "请输入亚马逊销售的产品的链接或描述"
          }
        ],
        fbaCountry: [
          {
            required: true,
            trigger: "blur",
            message: "请输入使用“FBA”（亚马逊履行）的国家"
          }
        ],
        businessInitialTime: [
          {
            required: false,
            trigger: "change",
            message: "请选择在荷兰开展业务的初始日期",
            type: "date"
          }
        ],
        warehouseInitialTime: [
          {
            required: false,
            trigger: "change",
            message: "请选择第一次使用荷兰仓库的日期",
            type: "date"
          }
        ],
        expectedTaxable: [
          {
            required: true,
            trigger: "blur",
            message: "请输入预计今年荷兰的应税营业额（欧元）"
          }
        ],
        expectedTaxableNext: [
          {
            required: true,
            trigger: "blur",
            message: "请输入预计未来下个财政年度荷兰的应税营业额（欧元"
          }
        ],
        customerType: [
          { required: true, trigger: "change", message: "请选择客户类型" }
        ],
        importerInfo: [
          {
            required: true,
            trigger: "blur",
            message: "您是否会将商品进口荷兰，谁将作为进口记录的进口商？"
          }
        ],
        goodsImportedFrom: [
          { required: true, trigger: "blur", message: "货物从哪里进口？" }
        ],
        goodsPurchased: [
          { required: true, trigger: "blur", message: "商品是在哪里购买的？" }
        ],
        fbaNetherlandsAddrs: [
          {
            required: true,
            trigger: "blur",
            message: "请填写亚马逊物流仓储中心在荷兰的名称和地址"
          }
        ],
        eoriNumber: [
          {
            required: true,
            trigger: "blur",
            message: "EORI号码（如果已经有别的欧盟国家的EORI号码，请提供）"
          }
        ],
        storageAddressCountry: [
          { required: true, trigger: "blur", message: "请输入仓储地址国家" }
        ],
        future30Sale: [
          {
            required: true,
            trigger: "blur",
            message: "请输入预计未来30天销售额"
          }
        ],
        shopSaleBefore: [
          { required: true, trigger: "blur", message: "请输入前12个月的销售额" }
        ],
        bankSubBranchName: [
          { required: true, trigger: "blur", message: "请输入支行英文名称" }
        ],
        bankAccountAddressPostcode: [
          { required: true, trigger: "blur", message: "请输入所在地邮编号码" }
        ],
        bankAccountAddressEn: [
          { required: true, trigger: "blur", message: "请输入账户主体地址" }
        ],
        bankAddressEn: [
          { required: true, trigger: "blur", message: "请输入银行英文地址" }
        ],
        shippingProcess: [
          {
            required: true,
            trigger: "blur",
            message: "请输入货物进口及配送流程"
          }
        ],
        swiftBic: [
          { required: true, trigger: "blur", message: "请输入Swift / BIC" }
        ],
        bankCountryEn: [
          { required: true, trigger: "blur", message: "请输入开户国家" }
        ],
        bankName: [
          { required: true, trigger: "blur", message: "请输入银行英文名称" }
        ],
        bankAccount: [
          { required: true, trigger: "blur", message: "请输入IBAN/银行账户" }
        ],
        bankAccountName: [
          { required: true, trigger: "blur", message: "请输入银行账户名称" }
        ],
        shopOtherEuTaxNumber: [
          { required: true, trigger: "blur", message: "请输入VAT增值税号" }
        ],
        otherEoriNumber: [
          { required: true, trigger: "blur", message: "请输入欧盟国EORI号" }
        ],
        companyPostCode: [
          { required: true, trigger: "blur", message: "请输入公司邮编号码" }
        ],
        legalPersonPostCode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入法人出生地邮编号码"
          }
        ],
        shopPredictSale: [
          { required: true, trigger: "blur", message: "请输入今年预计销售额" }
        ],
        shopNextYearSale: [
          { required: true, trigger: "blur", message: "请输入明年预计销售额" }
        ],
        future2YearSale: [
          { required: true, trigger: "blur", message: "请输入预计第二年销售额" }
        ],
        isThereEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否有EORI号" }
        ],
        certificateType: [
          { required: true, trigger: "change", message: "请选择证件类型" }
        ],
        useEntrepot: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否使用意大利/西班牙/捷克任何仓库"
          }
        ],
        isThereShop: [
          { required: true, trigger: "change", message: "请选择是否有店铺" }
        ],
        dredgeEuronext: [
          { required: true, trigger: "change", message: "请选择是否开通泛欧" }
        ],
        isOtherGulfStateDutyOrServices: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否有其它欧盟国VAT"
          }
        ],
        taxVatCountry: [
          {
            required: true,
            trigger: "change",
            message: "请选择有税号的中东国家"
          }
        ],
        firstOrderTime: [
          {
            required: true,
            trigger: "change",
            message: "选择预计/实际第一笔订单时间",
            type: "date"
          }
        ],
        shopSalePlatformAccount: [
          {
            required: true,
            trigger: "blur",
            message: "请填写电商平台账号完整名称"
          }
        ],
        isThereSale: [
          { required: true, trigger: "change", message: "请选择是否销售" }
        ],
        companyBusinessLicenseAnyway: [
          { required: true, trigger: "change", message: "请选择营业执照模板" }
        ],
        bankAddress: [
          { required: true, trigger: "blur", message: "请填写支行英文地址" }
        ],
        shopSaleBeforeFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传过往12个月销售报告"
          }
        ],
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
        storageAddressImg: [
          { required: true, trigger: "change", message: "请上传仓储地址截图" }
        ],
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
        personCardAddressCountryEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证英文地址"
          }
        ],
        personCardAddressCityEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证英文地址"
          }
        ],
        personCardAddressEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证英文地址"
          }
        ],
        localBankAccountInfo: [
          { required: true, trigger: "blur", message: "请填写本地银行账户信息" }
        ],
        legalPersonBirthplaceCityEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人的出生城市英文"
          }
        ],
        legalPersonBirthplaceCityZh: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人的出生城市中文"
          }
        ],
        legalPersonBirthplaceProvinceEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人的出生省份英文"
          }
        ],
        legalPersonBirthplaceProvinceZh: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人的出生省份中文"
          }
        ],
        legalPersonSex: [
          { required: true, trigger: "blur", message: "请选择法人性别" }
        ],
        legalPersonMaritalStatus: [
          { required: true, trigger: "change", message: "请选择法人婚姻状态" }
        ],
        companyRegisteredCityZh: [
          {
            required: true,
            trigger: "blur",
            message: "请填公司营业执照注册城市"
          }
        ],
        companyRegisteredCityEn: [
          {
            required: true,
            trigger: "blur",
            message: "请填公司营业执照注册城市"
          }
        ],
        companyLegalPersonCardAddressZh: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证中文地址"
          }
        ],
        companyRegisteredCapital: [
          { required: true, trigger: "blur", message: "请输入公司注册资本" }
        ],
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
        leaseAgreement: [
          { required: true, trigger: "change", message: "请上传租房合同 " }
        ],
        certificateOfEmployment: [
          { required: true, trigger: "change", message: "请上传工作证明 " }
        ],
        companyLegalPersonCardPassport: [
          { required: true, trigger: "change", message: "请上传护照扫描件" }
        ],
        needEoriNumber: [
          { required: true, trigger: "change", message: "请选择是否有EORI号" }
        ],
        shopTaxRate: [
          { required: true, trigger: "change", message: "请选择税率" }
        ],
        shopLogisticsCompanyName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入物流承运商公司名称"
          }
        ],
        shopSalePlan: [
          {
            required: true,
            trigger: "blur",
            message: "请输入未来12个月预计销售额"
          }
        ],
        shopLogisticsCompany: [
          { required: true, trigger: "blur", message: "请输入物流承运商地址" }
        ],
        shopEntrepotAddress: [
          { required: true, trigger: "blur", message: "请输入德国仓库地址" }
        ],
        shopPostCode: [
          { required: true, trigger: "blur", message: "请填写邮政编码" }
        ],
        companyBusinessModeDescribe: [
          { required: true, trigger: "blur", message: "请填写公司经营内容" }
        ],
        shopConsoleConfirmationLetter: [
          { required: true, trigger: "change", message: "请上传店铺确认函 " }
        ],
        shopSalePlatformName: [
          {
            required: true,
            trigger: "change",
            message: "请选择店铺所在电商平台"
          }
        ],
        shopHref: [
          { required: true, trigger: "blur", message: "请填写店铺链接" }
        ],
        shopName: [
          { required: true, trigger: "blur", message: "请填写店铺名称" }
        ],
        companyLegalPersonCard: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证/护照号码"
          }
        ],
        companyLegalPersonMobile: [
          { required: true, trigger: "blur", message: "请填写法人电话" }
        ],
        companyLegalPersonBirthplace: [
          { required: true, trigger: "change", message: "请选择法人出生地" }
        ],
        companyLegalPersonCardAddress: [
          {
            required: true,
            trigger: "blur",
            message: "请填写法人身份证英文地址"
          }
        ],

        companyLegalPersonCitizenship: [
          { required: true, trigger: "change", message: "请选择法人国籍" }
        ],
        companyLegalPersonEn: [
          { required: true, trigger: "blur", message: "请填写英文名字" }
        ],
        companyLegalPersonZh: [
          { required: true, trigger: "blur", message: "请填写法人中文名" }
        ],
        companyEmail: [
          { required: true, trigger: "blur", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyLegalPersonEmail: [
          { required: true, trigger: "blur", message: "请填写法人邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" }
        ],
        companyTel: [
          { required: true, trigger: "blur", message: "请填写公司电话" }
        ],
        companyCreditCode: [
          {
            required: true,
            trigger: "blur",
            message: "请填写公司统一社会信用代码"
          }
        ],
        companyAddressEn: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEnCity: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],
        companyAddressEnCountry: [
          { required: true, trigger: "blur", message: "请填写公司英文地址" }
        ],

        isShopConsoleScreenshot: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否有店铺后台截图"
          }
        ],
        companyCitizenship: [
          { required: true, trigger: "change", message: "请选择公司国籍" }
        ],
        companyAddressZh: [
          { required: true, trigger: "blur", message: "请填写公司中文地址" }
        ],
        companyNameEn: [
          { required: true, trigger: "blur", message: "请填写公司英文名" }
        ],
        declarePeriod: [
          { required: true, trigger: "change", message: "请选择报税周期" }
        ],
        companyNameZh: [
          { required: true, trigger: "blur", message: "请填写公司中文名" }
        ],
        shopNature: [
          { required: true, trigger: "change", message: "请选择店铺类型" }
        ],
        companyType: [
          { required: true, trigger: "change", message: "请选择公司类型" }
        ],

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
      lenovoSearchList: [],
      submitLoading: false,
      isCompanyInfoEdit: true,
      fileUpload: this.workOrderFile,
      supplierServiceIDModal: false,
      supplierServiceID: "",
      spinShow: false,
      nowDownload: false,
      countryList: [],
      facilitatorList: [],
      datePicker: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      checkDataModal: false,
      checkDataloading: false,
      checkDataForm: {},
      checkDataRules: {
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否通过"
          }
        ],
        countryCode: [
          {
            required: true,
            trigger: "change",
            message: "请选择注册国家"
          }
        ],
        registerType: [
          {
            required: true,
            trigger: "change",
            message: "请选择注册方式"
          }
        ],
        supplierId: [
          {
            required: true,
            trigger: "change",
            message: "请选择服务商"
          }
        ],
        reason: [
          {
            required: true,
            trigger: "blur",
            message: "请输入驳回原因"
          }
        ]
      },

      editRegisterTypeModal: false,
      editRegisterTypeLoading: false,
      editRegisterTypeForm: {},

      dataRejectModal: false,
      dataRejectLoading: false,
      dataRejectReason: "",

      addIOSSInfoModal: false,
      addIOSSInfoLoading: false,
      addIOSSInfoForm: {},

      taxIssueDate:'',
      taxEffectiveDate:'',
    };
  },
  mounted() {
    this.getregisterInfo();
    this.getCompanyList();
    this.getCountryList();
  },
  methods: {
    //返回列表页
    goBack() {
      this.$emit("back");
    },
    // 税号下发日期change
    taxIssueDateChange(val){
      this.addIOSSInfoForm.taxIssueDate = val + ' 00:00:00';
    },
    // 税号生效日期change
    taxEffectiveDateChange(val){
      this.addIOSSInfoForm.taxEffectiveDate = val + ' 00:00:00';
    },
    // 审核确认
    checkDataConfirm() {
      if (this.checkDataForm.status == undefined) {
        this.$Message.warning("请选择是否通过！");
        return;
      }
      if (this.checkDataForm.status == 1) {
        if (!this.checkDataForm.countryCode) {
          this.$Message.warning("请选择注册国家！");
          return;
        }
        if (!this.checkDataForm.registerType) {
          this.$Message.warning("请选择注册方式！");
          return;
        }
        if (
          this.checkDataForm.registerType == 1 &&
          !this.checkDataForm.supplierId
        ) {
          this.$Message.warning("请选择服务商！");
          return;
        }
      }
      if (this.checkDataForm.status == 0) {
        if (!this.checkDataForm.reason) {
          this.$Message.warning("请填写驳回原因！");
          return;
        }
      }
      let params = {
        workId: this.workId,
        serviceId: this.detailInfo.id,
        ...this.checkDataForm
      };
      if (this.checkDataForm.status == 1) {
        delete params.reason;
        if (this.checkDataForm.registerType == 2) {
          delete params.supplierId;
        }
      } else if (this.checkDataForm.status == 0) {
        delete params.countryCode;
        delete params.registerType;
        delete params.supplierId;
      }
      this.checkDataloading = true;
      API3.material(params)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success("审核成功");
            this.checkDataModal = false;
            this.checkDataForm = {};
            this.getregisterInfo();
          }
        })
        .finally(() => {
          this.checkDataloading = false;
        });
    },
    // 开启注册方式弹窗
    openEditRegisterTypeModal(){
      this.editRegisterTypeForm = {
        countryCode:this.detailInfo.iossCountryCode,
        supplierId:String(this.detailInfo.supplierId),
        registerType:this.detailInfo.supplierId ? '1':'2'
      };
      this.countryChange(this.detailInfo.iossCountryCode,8);
      this.editRegisterTypeModal = true;
    },
    // 修改注册方式
    editRegisterTypeConfirm() {
      if (!this.editRegisterTypeForm.countryCode) {
        this.$Message.warning("请选择注册国家！");
        return;
      }
      if (!this.editRegisterTypeForm.registerType) {
        this.$Message.warning("请选择注册方式！");
        return;
      }
      if (this.editRegisterTypeForm.registerType == 1 && !this.editRegisterTypeForm.supplierId) {
        this.$Message.warning("请选择服务商！");
        return;
      }
      let params = {
        workId: this.workId,
        serviceId: this.detailInfo.id,
        ...this.editRegisterTypeForm
      };
      this.editRegisterTypeLoading = true;
      API3.workOrderChange(params)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success("修改成功");
            this.editRegisterTypeModal = false;
            this.editRegisterTypeForm = {};
            this.getregisterInfo();
          }
        })
        .finally(() => {
          this.editRegisterTypeLoading = false;
        });
    },
    // 录入IOSS信息
    addIOSSInfoConfirm() {
      if (!this.addIOSSInfoForm.iossNumber) {
        this.$Message.warning("请填写IOSS税号！");
        return;
      }
      if (!this.addIOSSInfoForm.taxIssueDate) {
        this.$Message.warning("请选择税号下发日期！");
        return;
      }
      if (!this.addIOSSInfoForm.taxEffectiveDate) {
        this.$Message.warning("请选择税号生效日期！");
        return;
      }
      // if (!this.addIOSSInfoForm.iossNumberFile) {
      //   this.$Message.warning("请上传税号文件！");
      //   return;
      // }
      let params = {
        workId: this.workId,
        serviceId: this.detailInfo.id,
        ...this.addIOSSInfoForm
      };
      this.addIOSSInfoLoading = true;
      API3.iossInfo(params)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success("审核成功");
            this.addIOSSInfoModal = false;
            this.addIOSSInfoForm = {};
            this.getregisterInfo();
          }
        })
        .finally(() => {
          this.addIOSSInfoLoading = false;
        });
    },
    // 资料驳回
    dataRejectConfirm() {
      if (!this.dataRejectReason) {
        this.$Message.warning("请填写驳回原因！");
        return;
      }
      let params = {
        workId: this.workId,
        serviceId: this.detailInfo.id,
        reason: this.dataRejectReason
      };
      this.dataRejectLoading = true;
      API3.reject(params)
        .then(res => {
          if (res.code === 0) {
            this.$Message.success("驳回成功");
            this.dataRejectModal = false;
            this.dataRejectReason = "";
            this.getregisterInfo();
          }
        })
        .finally(() => {
          this.dataRejectLoading = false;
        });
    },
    //获取IOSS国家下拉数据
    getCountryList() {
      API3.getCountryByIoss().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    // 获取公司列表
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
      xmlResquest.open(
        "post",
        this.baseUrl + "/etax/workorder/management/register/down/material",
        true
      );
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
    // 公司change
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
                if (
                  res.data.hasOwnProperty(key) &&
                  that.submitForm.hasOwnProperty(key)
                ) {
                  that.submitForm[key] = res.data[key];
                }
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }),
    //公司类型change
    companyTypeChange(val) {
      console.log(val);
      if (val == "3") {
        this.submitForm.certificateType = "2";
      }
    },
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
    //获取注册详情
    getregisterInfo() {
      API1.getRegDetailInfo({ serviceId: this.id })
        .then(res => {
          if (res.code == 0) {
            this.orderNo = res.data.orderNo;
            this.orderRemark = res.data.remark;
            this.detailInfo = res.data.orderServices;
            this.isCompanyInfoEdit =
              res.data.orderServices.progressBar == 0 ? true : false;
            this.detailInfo.beginTime = res.data.orderServices.beginTime.substring(
              0,
              7
            );
            this.detailInfo.endTime = res.data.orderServices.endTime.substring(
              0,
              7
            );
            window.localStorage.setItem(
              "declareInterval",
              JSON.stringify(res.data)
            );
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
              this.formLeft.isOtherGulfStateDutyOrServices = String(
                val.isOtherGulfStateDutyOrServices
              );
              this.formLeft.isOtherBusinessActivities = String(
                val.isOtherBusinessActivities
              );
              this.formLeft.isShopConsoleScreenshot = String(
                val.isShopConsoleScreenshot
              );
              this.formLeft.declareRule = String(val.declareRule);
              this.formLeft.certificateType = String(val.certificateType);
              this.formLeft.companyType = String(val.companyType);
              this.formLeft.companyBusinessLicenseAnyway = String(
                val.companyBusinessLicenseAnyway
              );
              this.formLeft.legalPersonSex = String(val.legalPersonSex);
              this.formLeft.declarePeriod = String(val.declarePeriod);
              this.formLeft.isThereEoriNumber = String(val.isThereEoriNumber);
              this.formLeft.shopPredictSale = String(val.shopPredictSale);
              this.formLeft.shopNextYearSale = String(val.shopNextYearSale);
              this.formLeft.shopSalePlan = String(val.shopSalePlan);
              this.formLeft.companyRegisteredCapital = String(
                val.companyRegisteredCapital
              );
              this.formLeft.shopTaxRate = String(val.shopTaxRate);
              this.formLeft.useEntrepot = String(val.useEntrepot);
              this.formLeft.dredgeEuronext = String(val.dredgeEuronext);
              this.formLeft.future30Sale = String(val.future30Sale);
              this.formLeft.future2YearSale = String(val.future2YearSale);
              if (val.companyStockCondition != "") {
                this.sharesList = JSON.parse(val.companyStockCondition);
              }
            }
            // 判断是否授权
            // this.isHasAuth(this.detailInfo)
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
              this.deductionInfo =
                res.data.taxWorkOrderList[0].listTaxDeductionItem;
              this.serviceId = this.workId = res.data.taxWorkOrderList[0].id;
            } else {
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
            // this.getBaseInfo(this.detailInfo.countryCode)
            this.consoleOperationLogs = res.data.consoleOperationLogs;
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //提交注册资料
    submitFile() {
      this.$refs["formLeft"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          let data = { ...this.submitForm };
          if(!['Amazon','eBay','速卖通','独立站/自建站','其他'].includes(this.submitForm.shopSalePlatformName)){
            this.$Message.warning('请选择店铺所在电商平台');
            return;
          };
          data.businessInitialTime = this.formatDate(
            this.submitForm.businessInitialTime
          );
          data.warehouseInitialTime = this.formatDate(
            this.submitForm.warehouseInitialTime
          );
          data.shopTaxEffectiveData = this.formatDate(
            this.submitForm.shopTaxEffectiveData
          );
          data.companyLegalPersonBirthday = this.formatDate(
            this.submitForm.companyLegalPersonBirthday
          );
          data.companyRegisterData = this.formatDate(
            this.submitForm.companyRegisterData
          );
          data.thresholdValueTime = this.formatDate(
            this.submitForm.thresholdValueTime
          );
          data.firstOrderTime = this.formatDate(this.submitForm.firstOrderTime);
          data.servicesId = this.id;
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
    },
    //保存注册资料
    saveFile() {
      this.saveLoading = true;
      let data = { ...this.submitForm };
      data.businessInitialTime = this.formatDate(
        this.submitForm.businessInitialTime
      );
      data.warehouseInitialTime = this.formatDate(
        this.submitForm.warehouseInitialTime
      );
      data.shopTaxEffectiveData = this.formatDate(
        this.submitForm.shopTaxEffectiveData
      );
      data.companyLegalPersonBirthday = this.formatDate(
        this.submitForm.companyLegalPersonBirthday
      );
      data.companyRegisterData = this.formatDate(
        this.submitForm.companyRegisterData
      );
      data.thresholdValueTime = this.formatDate(
        this.submitForm.thresholdValueTime
      );
      data.firstOrderTime = this.formatDate(this.submitForm.firstOrderTime);
      data.servicesId = this.id;
      API1.saveRegInfo(data)
        .then(res => {
          this.$Message.success("保存成功");
          window.scroll(0, 0);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    //点击预览文件
    previewFile(url) {
      window.open(url);
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
      // this.submitForm[item] = res.data.fileUrl;
      this.$set(this.submitForm, item, res.data.fileUrl);
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
    addIOSSInfoSuccessHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.$set(this.addIOSSInfoForm, item, res.data.fileUrl);
    },
    addIOSSInfoRemoveHandler(file, fileList, item) {
      this.addIOSSInfoForm[item] = "";
    }
  }
};
</script>

<style scoped lang="less">
.back {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  margin-bottom: 5px;
  cursor: pointer;
}
.content {
  width: 100%;
  display: flex;
  .content-l {
    flex: 1;
    .fileBtn {
      text-align: center;
      margin-top: 20px;
    }
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
        line-height: 40px !important;
      }
    }
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
    .editIcon {
      margin-left: 10px;
      font-size: 20px;
      color: #2d8cf0;
      cursor: pointer;
    }
  }
}
.checkDataModal {
  /deep/ .requiredItem {
    .ivu-form-item-label::before {
      content: "*" !important;
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
}
.noRedIcon{
  /deep/ .ivu-form-item-label::before {
      content: " " !important;
    }
}
</style>
