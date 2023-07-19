<template>
  <div>
    <div class="top" >
      <p class="title typeTitle">
        {{
          status == 28
            ? "待上传转代理资料"
            : status == 32
            ? "审核未通过"
            : status == 36
            ? "待授权海牙认证"
            : status == 37
            ? "海牙认证中"
            : status == 38
            ? "待授权注册税号"
            : "注册详情"
        }}
        <span class="smallTitle">({{ countryNameZh }}转代理+申报)</span>
      </p>
      <div class="top-speed" v-if="status == 'NODE0016'">
        <p>
          <img src="@/assets/images/common/zdl1.svg" />
          <span class="status1" v-if="submitMaterialTime">提交时间：{{ submitMaterialTime }}</span>
        </p>
      </div>
      <div class="top-speed" v-if="status == 'NODE0019'">
        <p v-if="materialAuditDate !== ''">
          <img src="@/assets/images/common/zdl2.svg" />
          <span class="status1" v-if="submitMaterialTime">提交时间：{{ submitMaterialTime }}</span>
          <span class="status2" v-if="materialAuditDate">审核时间：{{ materialAuditDate }}</span>
        </p>
      </div>
      <div class="top-speed" v-if="status == 32">
        <p>
          <img src="@/assets/images/common/status4.svg" />
          <span class="status1" v-if="submitMaterialTime">提交时间：{{ submitMaterialTime }}</span>
        </p>
      </div>
      <div class="top-tip" v-if="status == 'NODE0015'">
        <p class="wramTip">
          <img src="@/assets/images/common/Shape.png" />
          温馨提示：转代理时长根据各国政策变动，参考时效可
          <span @click="agingBox = true">查看>></span>
        </p>
      </div>
      <!-- 资料被驳回原因提示 -->
      <div class="top-reason" v-if="status == 32">
        <p>
          <img src="@/assets/images/common/reason.png" />
          转代理资料被驳回（原因：
          <span>{{ formLeft.remark }}</span
          >）
        </p>
      </div>
      <div class="tabTitle" v-if="status != 28 && status != 21">
        <span class="active-tab">转代理资料</span>
      </div>
    </div>
    <div v-if="!submitFinish">
      <div :style="contentStyleObj" class="container agentClass">
        <Form
          :model="formLeft"
          class="formstyle"
          ref="formLeft"
          label-position="top"
          :rules="ruleForm"
          v-if="
            countryCode !== 'CZ' &&
            countryCode !== 'AT' &&
            countryCode !== 'SA' &&
            countryCode !== 'AE' &&
            countryCode !== 'PL' &&
            countryCode !== 'NL'
          "
        >
          <!-- 公司信息 -->
          <div class="big-row" v-if="countryCode != 'IT' || (countryCode == 'IT' && productId != 35)">
            <div class="subTitle">公司信息</div>
            <div class="form">
              <div class="clearfix fileClass" v-if="countryCode == 'ES'">
                <span class="top-lable"><span>*</span>任选1种上传（大陆公司/香港公司/海外公司）</span>
                <!-- <FormItem
                            style="width:385px"
                            class="requiredItem"
                            prop="companyType"> -->
                <RadioGroup v-model="formLeft.companyType">
                  <Radio :disabled="ischange" label="1">大陆公司</Radio>
                  <Radio :disabled="ischange" label="2">香港公司</Radio>
                  <Radio :disabled="ischange" label="3">海外公司</Radio>
                </RadioGroup>
                <!-- </FormItem> -->
                <FormItem
                  v-if="formLeft.companyType == '1' || formLeft.companyType == '3'"
                  prop="companyBusinessLicense"
                >
                  <p class="top-lable" style="margin-top: 23px"><span>*</span>营业执照</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
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
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('companyBusinessLicense')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                    <!-- <p class="corres-name"></p> -->
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.companyBusinessLicense != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.companyBusinessLicense" target="_blank" class="show-pdf">营业执照</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'companyBusinessLicense')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                    <!-- <p class="corres-name">营业执照</p> -->
                  </div>
                  <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <span class="explame" v-if="!ischange">
                    <a
                      href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/dd8bbaecac6b49a5b400beff9cd89f7e.jpg"
                      target="_blank"
                      style="color: #16ade9"
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </a>
                  </span>
                </FormItem>
                <div class="flex-item" style="margin-top: 23px" v-if="formLeft.companyType == '2'">
                  <FormItem prop="companyBusinessRegistrationBr">
                    <p class="top-lable"><span>*</span>商业登记证BR</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyBusinessRegistrationBr')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyBusinessRegistrationBr != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyBusinessRegistrationBr" target="_blank" class="show-pdf"
                          >商业登记证BR</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyBusinessRegistrationBr')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">商业登记证BR</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyRegistrationCi">
                    <p class="top-lable"><span>*</span>公司注册证明书CI</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyRegistrationCi')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyRegistrationCi != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyRegistrationCi" target="_blank" class="show-pdf">公司注册证明书CI</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyRegistrationCi')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">公司注册证明书CI</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyCorporateFoundingNnc1">
                    <p class="top-lable"><span>*</span>法团成立表格NNC1</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyCorporateFoundingNnc1')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyCorporateFoundingNnc1 != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyCorporateFoundingNnc1" target="_blank" class="show-pdf"
                          >法团成立表格NNC1</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyCorporateFoundingNnc1')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">法团成立表格NNC1</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                </div>
              </div>

              <div class="stepH">
                <div>
                  <FormItem prop="vatTaxNumber" v-if="countryCode == 'DE'">
                    <p class="top-lable"><span>*</span>VAT税号</p>
                    <Input
                      placeholder="请输入德国税号"
                      v-model="formLeft.vatTaxNumber"
                      maxlength="100"
                      :disabled="ischange"
                    >
                    </Input>
                  </FormItem>
                  <FormItem prop="vatTaxNumber" v-else>
                    <p class="top-lable"><span>*</span>VAT税号</p>
                    <Input
                      placeholder="请输入报税税号"
                      v-model="formLeft.vatTaxNumber"
                      maxlength="100"
                      :disabled="ischange"
                    >
                    </Input>
                    <p  v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">
                      注：请填写带11位数字的FR税号，不要有空格。
                    </p>
                  </FormItem>
                  <FormItem prop="declarePeriod">
                    <p class="top-lable"><span>*</span>报税周期</p>
                    <Select v-model="formLeft.declarePeriod" placeholder="请选择报税周期" :disabled="ischange">
                      <Option :value="item.status" v-for="(item, index) in declare" :key="index">{{
                        item.type
                      }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem v-if="countryCode == 'FR'" prop="companyPostCode">
                    <p class="top-lable"><span>*</span>公司邮政编号</p>
                    <Input
                      v-model="formLeft.companyPostCode"
                      placeholder="请输入公司邮政编号"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                  <FormItem v-if="countryCode == 'DE'" prop="postCode">
                    <p class="top-lable"><span>*</span>邮编号码</p>
                    <Input
                      v-model="formLeft.postCode"
                      :disabled="ischange"
                      placeholder="请输入店铺后台邮编号码"
                    ></Input>
                  </FormItem>
                  <FormItem v-if="countryCode == 'ES' && formLeft.companyType == '3'" prop="companyCitizenship">
                    <p class="top-lable"><span>*</span>公司国籍</p>
                    <Select v-model="formLeft.companyCitizenship" placeholder="请选择公司国籍" :disabled="ischange">
                      <Option v-for="item in birthplaceList" :value="item" :key="item.value">{{ item }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem v-if="countryCode == 'ES'" prop="companyAddressCn">
                    <p class="top-lable"><span>*</span>公司中文地址</p>
                    <Input
                      v-model="formLeft.companyAddressCn"
                      :disabled="ischange"
                      placeholder="请输入公司中文地址"
                    ></Input>
                  </FormItem>
                  <FormItem prop="companyPostCode" v-if="countryCode == 'IT'">
                    <p class="top-lable"><span>*</span>公司邮编号码</p>
                    <Input
                      placeholder="请输入公司邮编号码"
                      v-model="formLeft.companyPostCode"
                      :maxlength="20"
                      :disabled="ischange"
                    >
                    </Input>
                  </FormItem>
                  <FormItem v-if="countryCode == 'ES'" prop="companyRegisteredCityEn">
                    <p class="top-lable"><span>*</span>营业执照登记城市英文名：</p>
                    <Input
                      v-model="formLeft.companyRegisteredCityEn"
                      :disabled="ischange"
                      style="width: 300px"
                      placeholder="请输入营业执照登记城市 如 shenzhen"
                    ></Input>
                    <p style="font-size: 14px; font-weight: 400; color: #fbb73c">
                      注：请与营业执照登记机关所在城市一致
                    </p>
                  </FormItem>
                  <!-- todo 新增字段 -->
                  <FormItem v-if="countryCode == 'DE'" prop="coRegionCode">
                    <p class="top-lable"><span>*</span>公司所在地区：</p>
                    <Select
                      v-model="formLeft.coRegionCode"
                      :disabled="ischange"
                      style="width: 300px"
                      placeholder="请选择公司所在地区"
                    >
                      <Option :value="item.code" v-for="(item,index) in allRegionList" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div>
                  <FormItem prop="companyNameZh">
                    <p class="top-lable"><span>*</span>公司中文名称</p>
                    <AutoComplete
                      v-model="formLeft.companyNameZh"
                      :data="lenovoSearchList"
                      @on-select="selectCompany"
                      placeholder="请输入公司中文名称"
                      :disabled="ischange"
                    >
                    </AutoComplete>
                  </FormItem>
                  <FormItem prop="companyNameEn" v-if="countryCode == 'DE'">
                    <p class="top-lable"><span>*</span>公司英文名称</p>
                    <Input
                      v-model="formLeft.companyNameEn"
                      placeholder="与销售平台上英文公司名一致"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                  <FormItem prop="companyNameEn" v-if="countryCode != 'DE'">
                    <p class="top-lable"><span>*</span>公司英文名称</p>
                    <Input
                      v-model="formLeft.companyNameEn"
                      placeholder="需与税号在VIES上面显示的公司名一致"
                      :disabled="ischange"
                    ></Input>
                    <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">注：请根据您提供的税号文件显示的公司英文名称来填写</p>
                  </FormItem>
                  <FormItem prop="companyCreditCode" v-if="countryCode == 'FR'">
                    <p class="top-lable"><span>*</span>公司统一社会信用代码</p>
                    <Input
                      v-model="formLeft.companyCreditCode"
                      placeholder="请输入营业执照上统一代码"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                  <FormItem v-if="countryCode == 'DE'">
                    <p class="top-lable"><span>*</span>上一次申报区间</p>
                    <div class="clearfix">
                      <div class="fl">
                        <FormItem prop="upBeginTime">
                          <DatePicker
                            type="month"
                            placeholder="开始时间"
                            @on-change="changeVatDate($event, 'upBeginTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upBeginTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                      <div class="fl" style="text-align: center">— —</div>
                      <div class="fl">
                        <FormItem prop="upEndTime">
                          <DatePicker
                            type="month"
                            placeholder="结束时间"
                            @on-change="changeVatDate($event, 'upEndTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upEndTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="companyRegisteredCityEn" v-if="countryCode == 'IT'">
                    <p class="top-lable"><span>*</span>公司注册登记城市英文</p>
                    <Input
                      placeholder="请输入公司注册登记城市 如：shenzhen"
                      v-model="formLeft.companyRegisteredCityEn"
                      :maxlength="20"
                      :disabled="ischange"
                    >
                    </Input>
                    <p style="font-size: 14px; font-weight: 400; color: #fbb73c">
                      注：请输入与营业执照一致的登记城市的英文
                    </p>
                  </FormItem>
                  <FormItem v-if="countryCode == 'ES'" prop="companyRegisterData">
                    <p class="top-lable"><span>*</span>公司成立日期：</p>
                    <DatePicker
                      v-model="formLeft.companyRegisterData"
                      :disabled="ischange"
                      style="width: 300px"
                      placeholder="请选择公司成立日期"
                    ></DatePicker>
                    <p style="font-size: 14px; font-weight: 400; color: #fbb73c">注：请与营业执照一致</p>
                  </FormItem>
                  <!-- todo 新增 -->
                  <FormItem v-if="countryCode == 'DE'"  style="width: 300px" prop="shopHref">
                    <p class="top-lable"><span>*</span>店铺后台链接</p>
                    <Input v-model="formLeft.shopHref" placeholder="请输入店铺后台链接" :disabled="ischange"></Input>
                    <br />
                    <a
                      style="font-size: 12px; font-weight: 400"
                      href="https://file.itaxs.com/dev/20210319/13a27afdd0cd46609ac424361f1e1514.pdf"
                      target="_black"
                      >链接获取方法>></a
                    >
                  </FormItem>
                </div>
                <div>
                  <FormItem prop="companyCreditCode" v-if="countryCode == 'ES' || countryCode == 'IT'">
                    <p class="top-lable"><span>*</span>公司统一社会信用代码</p>
                    <Input
                      v-model="formLeft.companyCreditCode"
                      placeholder="请输入营业执照上统一代码"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                  <p class="top-lable"><span>*</span>公司英文地址</p>
                  <div class="clearfix flex">
                    <div class="fl">
                      <FormItem prop="companyAddressEnCountry" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnCountry"
                          style="width: 118px; margin-right: 8px"
                          placeholder="国家 如China"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                    <div class="fl">
                      <FormItem prop="companyAddressEnProvince" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnProvince"
                          style="width: 130px"
                          placeholder="省 如guangdong"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                    <div class="fl">
                      <FormItem prop="companyAddressEnCity" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnCity"
                          style="width: 130px"
                          placeholder="市 如shenzhen"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                  </div>
                  <div>
                    <FormItem prop="companyAddressEn" :show-message="false">
                      <Input
                        class="addressEn"
                        v-model="formLeft.companyAddressEn"
                        type="textarea"
                        placeholder="请直接复制后台英文地址，包含城市、省份、邮编、国家"
                        :disabled="ischange"
                        :rows="4"
                        v-if="countryCode !== 'ES'"
                      />
                      <Input
                        class="addressEn"
                        v-model="formLeft.companyAddressEn"
                        type="textarea"
                        placeholder="请直接复制店铺后台英文地址（不包括国家、邮编）"
                        :disabled="ischange"
                        :rows="4"
                        v-if="countryCode == 'ES'"
                      />
                    </FormItem>
                  </div>
                  <p style="font-size: 14px; font-weight: 400; color: #fbb73c; margin-top: 15px">
                    注：请直接复制后台英文地址，但注意与国家省份城市框内重复的信息请删除，邮编号也删除。
                  </p>

                  <FormItem prop="vatTaxEuNumber" v-if="countryCode == 'DE'">
                    <p class="top-lable"><span>*</span>欧盟税号</p>
                    <Input
                      placeholder="请输入DE欧盟税号"
                      v-model="formLeft.vatTaxEuNumber"
                      :maxlength="20"
                      :disabled="ischange"
                    >
                    </Input>
                  </FormItem>
                  <FormItem prop="shopOtherEuTaxNumber" v-if="countryCode == 'IT'">
                    <p class="top-lable">是否有欧盟其他税号</p>
                    <Input
                      placeholder="如有，则 填写税号信息"
                      v-model="formLeft.shopOtherEuTaxNumber"
                      :maxlength="20"
                      :disabled="ischange"
                    >
                    </Input>
                  </FormItem>
                </div>
                <!-- <div v-if="countryCode=='ES'"
                    class="stepH">
                  <FormItem label="是否有股权占比25%以上的股东："
                            class="requiredItem">
                    <RadioGroup v-model="stockGreaterThan25">
                      <Radio label="0"
                            :disabled="ischange">是</Radio>
                      <Radio label="1"
                            :disabled="ischange">否，没有</Radio>
                    </RadioGroup>
                  </FormItem>
                  <div v-if="stockGreaterThan25=='0'"
                      style="width:100%;">
                    <div v-for="(item,index) in sharesList"
                        :key="index"
                        class="flex">
                      <FormItem label="股东姓名："
                                prop="shareholderZhName"
                                class="requiredItem">
                        <Input v-model="item.shareholderZhName"
                              placeholder="中文名"
                              :disabled="ischange"
                              style="width:160px;"></Input>
                        <Input v-model="item.shareholderEnName"
                              placeholder="英文名"
                              :disabled="ischange"
                              style="width:165px;margin-left:10px;"></Input>
                      </FormItem>
                      <FormItem label="股东身份证号码："
                                prop="identityCard"
                                class="requiredItem">
                        <Input v-model="item.identityCard"
                              placeholder="请输入大股东身份证号码"
                              :disabled="ischange"></Input>
                      </FormItem>
                    </div>
                  </div>
                  <FormItem label="公司注册资本："
                            prop="companyRegisteredCapital">
                    <Input v-model="formLeft.companyRegisteredCapital"
                          placeholder="请输入公司注册资本（万元）"
                          number
                          :disabled="ischange"
                          style="width: 340px;"></Input>（万元）
                  </FormItem>
                  <FormItem label="公司成立日期："
                            prop="companyRegisterData">
                    <DatePicker type="date"
                                placeholder="请选择公司成立日期"
                                v-model="formLeft.companyRegisterData"
                                format="yyyy-MM-dd"
                                class="tax-date"
                                :options="optionsDate"
                                :disabled="ischange"></DatePicker>
                  </FormItem>
                  <FormItem label="公司营业执照注册城市："
                            prop="companyRegisteredCityZh">
                    <Input v-model="formLeft.companyRegisteredCityZh"
                          placeholder="请输入中文，如：深圳市"
                          :disabled="ischange"
                          style="width:178px;"></Input>
                    <Input type="text"
                          v-model="formLeft.companyRegisteredCityEn"
                          placeholder="请输入英文，如：ShenZhen"
                          :disabled="ischange"
                          style="width:198px;margin-left:10px;"></Input>
                  </FormItem>
                </div> -->
              </div>
            </div>
          </div>

          <!-- 公司信息意大利新服务商 -->
          <div class="big-row" v-if="countryCode == 'IT' && productId == 35">
            <div class="subTitle">公司信息</div>
            <div class="form">
              <div class="clearfix fileClass">
                <span class="top-lable"><span>*</span>任选1种上传（大陆公司/香港公司）</span>
                <RadioGroup v-model="formLeft.companyType">
                  <Radio :disabled="ischange" label="1">大陆公司</Radio>
                  <Radio :disabled="ischange" label="2">香港公司</Radio>
                </RadioGroup>
                <FormItem v-if="formLeft.companyType == '1'" prop="companyBusinessLicense">
                  <p class="top-lable" style="margin-top: 23px"><span>*</span>营业执照</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
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
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('companyBusinessLicense')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.companyBusinessLicense != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.companyBusinessLicense" target="_blank" class="show-pdf">营业执照</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'companyBusinessLicense')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                  </div>
                  <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <span class="explame" v-if="!ischange">
                    <a
                      href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/dd8bbaecac6b49a5b400beff9cd89f7e.jpg"
                      target="_blank"
                      style="color: #16ade9"
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </a>
                  </span>
                </FormItem>
                <div class="flex-item" style="margin-top: 23px" v-if="formLeft.companyType == '2'">
                  <FormItem prop="companyBusinessRegistrationBr">
                    <p class="top-lable"><span>*</span>商业登记证BR</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyBusinessRegistrationBr')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyBusinessRegistrationBr != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyBusinessRegistrationBr" target="_blank" class="show-pdf"
                          >商业登记证BR</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyBusinessRegistrationBr')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyRegistrationCi">
                    <p class="top-lable"><span>*</span>公司注册证明书CI</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyRegistrationCi')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyRegistrationCi != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyRegistrationCi" target="_blank" class="show-pdf">公司注册证明书CI</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyRegistrationCi')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyCorporateFoundingNnc1">
                    <p class="top-lable"><span>*</span>法团成立表格NNC1</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyCorporateFoundingNnc1')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyCorporateFoundingNnc1 != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyCorporateFoundingNnc1" target="_blank" class="show-pdf"
                          >法团成立表格NNC1</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyCorporateFoundingNnc1')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                </div>
              </div>
              <div class="stepH">
                <div>
                  <FormItem prop="companyNameZh">
                    <p class="top-lable"><span>*</span>公司中文名称</p>
                    <AutoComplete
                      v-model="formLeft.companyNameZh"
                      :data="lenovoSearchList"
                      @on-select="selectCompany"
                      placeholder="请输入营业执照上的公司名称"
                      :disabled="ischange"
                    >
                    </AutoComplete>
                    <p class="upload-tip" style="margin-top: 0px" v-if="!ischange">
                      注：如个人注册，则填写个人姓名为公司名称
                    </p>
                  </FormItem>
                  <p class="top-lable"><span>*</span>公司英文地址</p>
                  <div class="clearfix flex">
                    <div class="fl">
                      <FormItem prop="companyAddressEnCountry" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnCountry"
                          style="width: 100px; margin-right: 8px"
                          placeholder="国家 如China"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                    <div class="fl">
                      <FormItem prop="companyAddressEnProvince" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnProvince"
                          style="width: 130px; margin-right: 8px"
                          placeholder="省 如Guangdong"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                    <div class="fl">
                      <FormItem prop="companyAddressEnCity" :show-message="false">
                        <Input
                          v-model="formLeft.companyAddressEnCity"
                          style="width: 120px"
                          placeholder="市 如Shenzhen"
                          :disabled="ischange"
                        ></Input>
                      </FormItem>
                    </div>
                  </div>
                  <div class="clearfix flex">
                    <FormItem prop="companyAddressEnCity" :show-message="false">
                      <Input
                        class="addressEn"
                        v-model="formLeft.companyAddressEn"
                        type="textarea"
                        style="width: 366px"
                        placeholder="请直接复制后台英文地址，包含城市、省份、邮编、国家"
                        :disabled="ischange"
                        :rows="4"
                      />
                    </FormItem>
                  </div>
                  <p class="upload-tip" style="margin-top: 0px" v-if="!ischange">注：与亚马逊店铺后台一致</p>
                </div>
                <div>
                  <FormItem prop="companyNameEn">
                    <p class="top-lable"><span>*</span>公司英文名称</p>
                    <Input
                      v-model="formLeft.companyNameEn"
                      placeholder="请直接复制店铺后台英文公司名"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                </div>
                <div>
                  <FormItem prop="companyCreditCode">
                    <p class="top-lable"><span>*</span>公司统一社会信用代码</p>
                    <Input
                      v-model="formLeft.companyCreditCode"
                      placeholder="请输入营业执照上的统一信用代码"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>

          <!-- 意大利新服务商基本信息 -->
          <div class="big-row" v-if="countryCode == 'IT' && productId == 35">
            <div class="subTitle">基本信息</div>
            <div class="form">
              <div class="stepH">
                <div>
                  <FormItem prop="vatTaxNumber">
                    <p class="top-lable"><span>*</span>VAT税号</p>
                    <Input
                      placeholder="请输入报税税号"
                      v-model="formLeft.vatTaxNumber"
                      maxlength="100"
                      :disabled="ischange"
                    >
                    </Input>
                  </FormItem>
                  <FormItem prop="vatTaxNumberFile">
                    <p class="top-lable"><span>*</span>税号文件</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxNumberFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxNumberFile');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf','zip','rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('vatTaxNumberFile')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.vatTaxNumberFile != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.vatTaxNumberFile" target="_blank" class="show-pdf">税号文件</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'vatTaxNumberFile')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/b99da2a6ca7e4048a6e0343a6f643add.pdf"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                </div>
                <div>
                  <FormItem prop="declarePeriod">
                    <p class="top-lable"><span>*</span>报税周期</p>
                    <Select v-model="formLeft.declarePeriod" placeholder="请选择报税周期" :disabled="ischange">
                      <Option :value="item.status" v-for="(item, index) in declare" :key="index">{{
                        item.type
                      }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem prop="lastDeclareReceipt">
                    <p class="top-lable"><span>*</span>历史申报回执</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandlerzip"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'lastDeclareReceipt');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'lastDeclareReceipt');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('lastDeclareReceipt')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.lastDeclareReceipt != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.lastDeclareReceipt" target="_blank" class="show-pdf">历史申报回执</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'lastDeclareReceipt')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                  </FormItem>
                </div>
                <div>
                  <FormItem>
                    <p class="top-lable"><span>*</span>上一次申报区间</p>
                    <div class="clearfix">
                      <div class="fl">
                        <FormItem prop="upBeginTime">
                          <DatePicker
                            type="month"
                            placeholder="开始时间"
                            @on-change="changeVatDate($event, 'upBeginTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upBeginTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                      <div class="fl" style="text-align: center">— —</div>
                      <div class="fl">
                        <FormItem prop="upEndTime">
                          <DatePicker
                            type="month"
                            placeholder="结束时间"
                            @on-change="changeVatDate($event, 'upEndTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upEndTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem prop="lastPayCertificate">
                    <p class="top-lable"><span>*</span>历史扣款回执</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'lastPayCertificate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'lastPayCertificate');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('lastPayCertificate')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.lastPayCertificate != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.lastPayCertificate" target="_blank" class="show-pdf">历史扣款回执</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'lastPayCertificate')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>

          <!-- 法人信息 -->
          <div class="big-row" v-if="countryCode != 'DE'">
            <div class="subTitle">法人信息</div>

            <!-- 英国 -->
            <div v-if="countryCode == 'GB'">
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="companyLegalPersonZh">
                      <p class="top-lable"><span>*</span>法人中文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonZh"
                        placeholder="请填写中文名字"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyLegalPersonEn">
                      <p class="top-lable"><span>*</span>法人英文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonEn"
                        placeholder="请填写英文名字"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyEmail">
                      <p class="top-lable"><span>*</span>公司邮箱</p>
                      <Input v-model="formLeft.companyEmail" placeholder="请输入有效邮箱" :disabled="ischange"></Input>
                    </FormItem>
                    <FormItem prop="companyTel">
                      <p class="top-lable"><span>*</span>公司电话</p>
                      <Input v-model="formLeft.companyTel" placeholder="请输入常用电话" :disabled="ischange"></Input>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyBusinessModeDescribe">
                      <p class="top-lable"><span>*</span>请描述下公司的经营内容</p>
                      <Input
                        v-model="formLeft.companyBusinessModeDescribe"
                        type="textarea"
                        placeholder="请输入英文描述 如服装：Clothing"
                        :rows="4"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>

            <!-- 意大利 -->
            <div v-if="countryCode == 'IT' && productId != 35">
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="companyLegalPersonZh">
                      <p class="top-lable"><span>*</span>法人中文姓名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonZh"
                        placeholder="请填写法人中文名字"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyLegalPersonBirthday">
                      <p class="top-lable"><span>*</span>法人出生日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择法人出生日期"
                        v-model="formLeft.companyLegalPersonBirthday"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :options="optionsDate"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyLegalPersonEn">
                      <p class="top-lable"><span>*</span>法人英文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonEn"
                        placeholder="请填写英文名字"
                        :disabled="ischange"
                      ></Input>
                      <p class="upload-tip">注：英文姓名需要“名在前姓在后”（如张三，San Zhang）</p>
                    </FormItem>
                    <FormItem prop="companyLegalPersonCard">
                      <p class="top-lable"><span>*</span>法人身份证/护照号码</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCard"
                        placeholder="请填写法人身份证/护照号码"
                        :disabled="ischange"
                      ></Input>
                      <p class="upload-tip">注：身份证号/护照号选填一个即可</p>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyLegalPersonBirthplace">
                      <p class="top-lable"><span>*</span>法人出生地</p>
                      <Input
                        v-model="formLeft.companyLegalPersonBirthplace"
                        placeholder="请填写法人出生地"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <!-- <FormItem prop="companyLegalPersonCardAddress">
                      <p class="top-lable"><span>*</span>法人身份证英文地址</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCardAddress"
                        placeholder="请填写法人身份证英文地址"
                        :disabled="ischange"
                      ></Input>
                    </FormItem> -->
                    <!-- 拆分旧字段，分开来显示 -->
                    <p class="top-lable"><span>*</span>法人身份证英文地址</p>
                    <div class="clearfix flex">
                      <div class="fl">
                        <FormItem prop="legalPersonBirthplaceCountryEn" :show-message="false">
                          <Input
                            v-model="formLeft.legalPersonBirthplaceCountryEn"
                            placeholder="国家 如 China"
                            :disabled="ischange"
                            style="display: inline-block; width: 110px"
                          ></Input>
                        </FormItem>
                      </div>
                      <div class="fl">
                        <FormItem prop="legalPersonBirthplaceProvinceEn" :show-message="false">
                          <Input
                            v-model="formLeft.legalPersonBirthplaceProvinceEn"
                            placeholder="省 如 guangdong"
                            :disabled="ischange"
                            style="display: inline-block; width: 120px"
                          ></Input>
                        </FormItem>
                      </div>
                      <div class="fl">
                        <FormItem prop="legalPersonBirthplaceCityEn" :show-message="false">
                          <Input
                            v-model="formLeft.legalPersonBirthplaceCityEn"
                            placeholder="市 如 shenzhen"
                            :disabled="ischange"
                            style="display: inline-block; width: 120px"
                          ></Input>
                        </FormItem>
                      </div>
                    </div>
                    <div class="clearfix flex">
                      <FormItem prop="companyLegalPersonCardAddress" :show-message="false">
                        <Input
                          v-model="formLeft.companyLegalPersonCardAddress"
                          placeholder="请输入详细地址"
                          :disabled="ischange"
                          type="textarea"
                          :rows="4"
                        ></Input>
                        <p class="upload-tip">注：请用拼音输入身份证详细地址</p>
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 意大利新服务商法人信息  -->
            <div v-if="countryCode == 'IT' && productId == 35">
              <div class="big-row">
                <div class="form">
                  <div class="clearfix fileClass">
                    <span class="top-lable"><span>*</span>任选1种上传（身份证/护照）</span>
                    <RadioGroup v-model="formLeft.certificateType">
                      <Radio label="1">身份证</Radio>
                      <Radio label="2">护照</Radio>
                    </RadioGroup>
                    <FormItem v-if="formLeft.certificateType == '1'" prop="companyLegalPersonCardFront">
                      <p class="top-lable" style="margin-top: 33px"><span>*</span>身份证</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('companyLegalPersonCardFront')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              身份证（人像面）
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.companyLegalPersonCardFront != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.companyLegalPersonCardFront" target="_blank" class="show-pdf"
                              >身份证（人像面）</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'companyLegalPersonCardFront')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div class="upload-file-box" style="margin-top: 10px">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('companyLegalPersonCardReverse')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              身份证（国徽面）
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.companyLegalPersonCardReverse != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.companyLegalPersonCardReverse" target="_blank" class="show-pdf"
                              >身份证（国徽面）</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'companyLegalPersonCardReverse')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p class="upload-tip" style="margin-top: 0" v-if="!ischange">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                    </FormItem>
                    <FormItem v-if="formLeft.certificateType == '2'" prop="companyLegalPersonCardPassport">
                      <p class="top-lable" style="margin-top: 33px"><span>*</span>护照扫描件</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('companyLegalPersonCardPassport')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.companyLegalPersonCardPassport != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.companyLegalPersonCardPassport" target="_blank" class="show-pdf"
                              >护照扫描件</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'companyLegalPersonCardPassport')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p class="upload-tip" style="margin-top: 0" v-if="!ischange">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/b99dadf9e3f043a78d69ea3bfdb2db74.jpg"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                  </div>
                  <div class="stepH">
                    <div>
                      <FormItem prop="companyLegalPersonEn">
                        <p class="top-lable"><span>*</span>法人英文名</p>
                        <Input
                          v-model="formLeft.companyLegalPersonEn"
                          placeholder="请填写英文名字"
                          :disabled="ischange"
                        ></Input>
                        <p class="upload-tip" style="margin-top: 0px" v-if="!ischange">注：请输入姓名拼音作为英文名</p>
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 西班牙 -->
            <div v-if="countryCode == 'ES'">
              <div class="form">
                <div class="clearfix fileClass">
                  <span class="top-lable"><span>*</span>任选1种上传（身份证/护照）</span>
                  <RadioGroup v-model="formLeft.certificateType">
                    <Radio label="1">身份证</Radio>
                    <Radio label="2">护照</Radio>
                  </RadioGroup>
                  <FormItem v-if="formLeft.certificateType == '1'" prop="companyLegalPersonCardFront">
                    <p class="top-lable" style="margin-top: 33px"><span>*</span>身份证正反面扫描件</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('companyLegalPersonCardFront')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.companyLegalPersonCardFront != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.companyLegalPersonCardFront" target="_blank" class="show-pdf"
                            >身份证正反面扫描件</a
                          >
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'companyLegalPersonCardFront')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <span class="explame">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/fa97530f1a994956bcd3fffee24c13ed.jpg"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                  <FormItem v-if="formLeft.certificateType == '2'" prop="companyLegalPersonCardPassport">
                    <p class="top-lable" style="margin-top: 33px"><span>*</span>护照扫描件</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('companyLegalPersonCardPassport')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.companyLegalPersonCardPassport != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.companyLegalPersonCardPassport" target="_blank" class="show-pdf"
                            >护照扫描件</a
                          >
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'companyLegalPersonCardPassport')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/9dca4e7e2fee45f8801c48d0aa411a31.jpg"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                </div>
                <div class="stepH">
                  <div>
                    <FormItem prop="companyLegalPersonEn">
                      <p class="top-lable"><span>*</span>法人英文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonEn"
                        placeholder="请输入法人英文姓名"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyLegalPersonCard">
                      <p class="top-lable"><span>*</span>法人护照/身份证号码</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCard"
                        placeholder="请输入护照/身份证号码"
                        :disabled="ischange"
                        @on-blur="appendCompanyBirthday"
                      ></Input>
                      <p class="upload-tip" style="margin-top: 0">注：身份证号/护照号选填一个即可</p>
                    </FormItem>
                    <FormItem prop="companyLegalPersonBirthday">
                      <p class="top-lable"><span>*</span>法人出生日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择法人出生日期"
                        v-model="formLeft.companyLegalPersonBirthday"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :options="optionsDate"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyLegalPersonCardAddress">
                      <p class="top-lable"><span>*</span>法人身份证英文地址</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCardAddress"
                        placeholder="请输入法人身份证英文地址"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyLegalPersonCardAddressCn">
                      <p class="top-lable"><span>*</span>法人身份证中文地址</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCardAddressCn"
                        placeholder="请输入法人身份证中文地址"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem v-if="formLeft.certificateType == '2'" prop="companyLegalPersonCitizenship">
                      <p class="top-lable"><span>*</span>法人国籍</p>
                      <Select
                        v-model="formLeft.companyLegalPersonCitizenship"
                        placeholder="请选择法人国籍"
                        :disabled="ischange"
                      >
                        <Option v-for="item in birthplaceList" :value="item" :key="item.value">{{ item }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem class="requiredItem" style="margin-top: 50px" prop="companyLegalPersonMaritalStatus">
                      <p class="top-lable"><span>*</span>法人婚姻状况：</p>
                      <RadioGroup v-model="formLeft.companyLegalPersonMaritalStatus">
                        <Radio label="1" :disabled="ischange">未婚</Radio>
                        <Radio label="2" :disabled="ischange">已婚</Radio>
                        <Radio label="3" :disabled="ischange">离异</Radio>
                        <Radio label="4" :disabled="ischange">丧偶</Radio>
                      </RadioGroup>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem>
                      <p class="top-lable"><span>*</span>法人出生省份</p>
                      <div class="clearfix">
                        <div class="fl">
                          <FormItem prop="legalPersonBirthplaceProvinceZh" :show-message="false">
                            <Input
                              v-model="formLeft.legalPersonBirthplaceProvinceZh"
                              style="width: 143px; margin-right: 8px"
                              placeholder="请输入中文"
                              :disabled="ischange"
                            ></Input>
                          </FormItem>
                        </div>
                        <div class="fl">
                          <FormItem prop="legalPersonBirthplaceProvinceEn" :show-message="false">
                            <Input
                              v-model="formLeft.legalPersonBirthplaceProvinceEn"
                              style="width: 143px"
                              placeholder="请输入英文"
                              :disabled="ischange"
                            ></Input>
                          </FormItem>
                        </div>
                      </div>
                      <p class="upload-tip" style="line-height: 20px">注：请输入中文省份，如：广东省</p>
                      <p class="upload-tip" style="line-height: 18px; margin-left: 28px; margin-top: 0">
                        请输入英文省份，如：Guangdong
                      </p>
                    </FormItem>
                    <FormItem prop="companyLegalPersonZh">
                      <p class="top-lable"><span>*</span>法人中文名称</p>
                      <Input
                        v-model="formLeft.companyLegalPersonZh"
                        placeholder="请输入法人中文名称"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem class="requiredItem" style="width: 300px" prop="personCardAddressCityEn">
                      <p class="top-lable"><span>*</span>法人身份证所在城市的英文名称：</p>
                      <Input
                        v-model="formLeft.personCardAddressCityEn"
                        placeholder="请输入法人身份证城市英文 如 shenzhen"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>

            <!-- 法国 -->
            <div v-if="countryCode == 'FR'">
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="companyLegalPersonZh">
                      <p class="top-lable"><span>*</span>法人中文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonZh"
                        placeholder="请输入法人中文姓名"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyLegalPersonEn">
                      <p class="top-lable"><span>*</span>法人英文名</p>
                      <Input
                        v-model="formLeft.companyLegalPersonEn"
                        placeholder="请填写英文名字"
                        :disabled="ischange"
                      ></Input>
                      <p style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">
                        注：英文姓名需要“姓在前名在后”（如张三，Zhang San）
                      </p>
                    </FormItem>
                    <FormItem>
                      <!-- <p class="top-lable"><span>*</span>身份证/护照号码</p> -->
                      <p style="margin-bottom: 10px">
                        <span class="top-lable" style="margin-right: 10px;"><span>*</span>身份证/护照号码</span>
                        <RadioGroup v-model="formLeft.certificateType">
                          <Radio label="1" :disabled="ischange">身份证</Radio>
                          <Radio label="2" :disabled="ischange">护照</Radio>
                        </RadioGroup>
                      </p>

                      <Input
                        v-model="formLeft.companyLegalPersonCard"
                        placeholder="请填写身份证号码"
                        :disabled="ischange"
                        v-if="formLeft.certificateType == '1'"
                      ></Input>
                      <!-- <br/> -->
                      <!-- <div style="height:10px"></div> -->
                      <Input
                        v-model="formLeft.legalPersonCardPassportNumber"
                        placeholder="请填写护照号码"
                        :disabled="ischange"
                        v-if="formLeft.certificateType == '2'"
                      ></Input>
                      <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">注：此处填写的身份证/护照号，请与下面上传的证件保持一致</p>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyLegalPersonBirthday">
                      <p class="top-lable"><span>*</span>法人出生日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择法人出生日期"
                        v-model="formLeft.companyLegalPersonBirthday"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :options="optionsDate"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                    <FormItem prop="legalPersonPostCode">
                      <p class="top-lable"><span>*</span>法人出生地邮编号码</p>
                      <Input
                        v-model="formLeft.legalPersonPostCode"
                        placeholder="请填写法人出生地邮政编号"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem prop="companyRegisteredCapital">
                      <p class="top-lable"><span>*</span>公司注册资本</p>
                      <Input
                        v-model="formLeft.companyRegisteredCapital"
                        placeholder="请输入公司注册资本（元）"
                        number
                        :disabled="ischange"
                      >
                        <span slot="append">元</span>
                      </Input>
                      <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">注：请输入完整的注册资本金额，如10W，则输入100000</p>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="companyLegalPersonCardAddress">
                      <p class="top-lable"><span>*</span>法人身份证英文地址</p>
                      <Input
                        v-model="formLeft.companyLegalPersonCardAddress"
                        placeholder="请填写法人身份证英文地址"
                        :disabled="ischange"
                      ></Input>
                    </FormItem>
                    <FormItem v-if="countryCode == 'FR'" prop="companyEmail">
                      <p class="top-lable"><span>*</span>公司联系邮箱</p>
                      <Input v-model="formLeft.companyEmail" placeholder="请输入有效邮箱" :disabled="ischange"></Input>
                    </FormItem>
                    <FormItem v-if="countryCode == 'FR'" prop="companyLegalPersonCitizenship">
                      <p class="top-lable"><span>*</span>法人国籍</p>
                      <Select
                        v-model="formLeft.companyLegalPersonCitizenship"
                        placeholder="请选择法人国籍"
                        :disabled="ischange"
                      >
                        <Option v-for="item in birthplaceList" :value="item" :key="item.value">{{ item }}</Option>
                      </Select>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 意大利店铺信息 -->
          <div v-if="countryCode == 'IT' && productId != 35">
            <div class="big-row">
              <div class="subTitle">店铺信息</div>
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="shopHref">
                      <p class="top-lable"><span>*</span>店铺链接</p>
                      <Input v-model="formLeft.shopHref" placeholder="请填写店铺链接" :disabled="ischange"></Input>
                    </FormItem>
                    <FormItem prop="companyBusinessModeDescribe">
                      <p class="top-lable"><span>*</span>请描述下公司的经营内容</p>
                      <Input
                        v-model="formLeft.companyBusinessModeDescribe"
                        type="textarea"
                        placeholder="请输入英文描述 如服装：Clothing"
                        :rows="4"
                        :disabled="ischange"
                      ></Input>
                      <p class="upload-tip">温馨提示：推荐使用谷歌翻译</p>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="taxEffectiveDate">
                      <p class="top-lable"><span>*</span>税号生效日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择税号生效日期"
                        v-model="formLeft.taxEffectiveDate"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                    <!-- <FormItem prop="shopSalePlan">
                      <p class="top-lable"><span>*</span>预计未来12个月销售额</p>
                      <Input
                        v-model="formLeft.shopSalePlan"
                        placeholder="请输入预计未来12个月销售额"
                        :disabled="ischange"
                      >
                        <template slot="append">EUR</template>
                      </Input>
                      <p class="upload-tip">注：请输入完整的销售额</p>
                    </FormItem> -->
                  </div>
                  <div>
                    <FormItem prop="upBeginTime">
                      <p class="top-lable"><span>*</span>上一次申报区间</p>
                      <div class="clearfix">
                        <div class="fl">
                          <FormItem prop="upBeginTime">
                            <DatePicker
                              type="month"
                              placeholder="开始时间"
                              @on-change="changeVatDate($event, 'upBeginTime')"
                              style="width: 124px"
                              :options="options"
                              v-model="formLeft.upBeginTime"
                              format="yyyy-MM"
                              :disabled="ischange"
                            ></DatePicker>
                          </FormItem>
                        </div>
                        <span style="text-align: center" class="fl">——</span>
                        <div class="fl">
                          <FormItem prop="upEndTime">
                            <DatePicker
                              type="month"
                              placeholder="结束时间"
                              @on-change="changeVatDate($event, 'upEndTime')"
                              style="width: 124px"
                              :options="options"
                              v-model="formLeft.upEndTime"
                              format="yyyy-MM"
                              :disabled="ischange"
                            ></DatePicker>
                          </FormItem>
                        </div>
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 意大利新服务商店铺信息 -->
          <div v-if="countryCode == 'IT' && productId == 35">
            <div class="big-row">
              <div class="subTitle">店铺信息</div>
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="shopHref">
                      <p class="top-lable"><span>*</span>店铺链接</p>
                      <Input v-model="formLeft.shopHref" placeholder="请填写店铺链接" :disabled="ischange"></Input>
                    </FormItem>
                    <FormItem prop="shopConsoleScreenshot">
                      <p class="top-lable"><span>*</span>店铺后台信息截图</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('shopConsoleScreenshot')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.shopConsoleScreenshot != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.shopConsoleScreenshot" target="_blank" class="show-pdf"
                              >店铺后台信息截图</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'shopConsoleScreenshot')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p class="upload-tip" style="margin-top: 0" v-if="!ischange">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/7b4849709e5a4d40a1d1f08cb0ea8c26.jpg"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="taxEffectiveDate">
                      <p class="top-lable"><span>*</span>税号生效日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择税号生效日期"
                        v-model="formLeft.taxEffectiveDate"
                        format="yyyy-MM-dd"
                        class="tax-date"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="isThereEoriNumber">
                      <span class="top-lable" style="margin-right: 18px"><span>*</span>是否已经注册EORI号</span>
                      <RadioGroup v-model="formLeft.isThereEoriNumber">
                        <Radio label="1" :disabled="ischange">是</Radio>
                        <Radio label="2" :disabled="ischange">否</Radio>
                      </RadioGroup>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 西班牙店铺信息 -->
          <div v-if="countryCode == 'ES'">
            <div class="big-row">
              <div class="subTitle">店铺信息</div>
              <div class="form">
                <div class="stepH">
                  <FormItem prop="shopHref">
                    <p class="top-lable"><span>*</span>店铺链接</p>
                    <Input v-model="formLeft.shopHref" placeholder="请输入店铺链接" :disabled="ischange"></Input>
                  </FormItem>
                  <FormItem prop="upBeginTime">
                    <p class="top-lable"><span>*</span>上一次申报区间</p>
                    <div class="clearfix flex">
                      <div class="fl">
                        <FormItem>
                          <DatePicker
                            type="month"
                            placeholder="开始时间"
                            @on-change="changeVatDate($event, 'upBeginTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upBeginTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                      <span class="fl" style="margin: 0 7px">— —</span>
                      <div class="fl">
                        <FormItem prop="upEndTime">
                          <DatePicker
                            type="month"
                            placeholder="结束时间"
                            @on-change="changeVatDate($event, 'upEndTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upEndTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                    </div>
                  </FormItem>
                  <div style="width: 294px"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 英国报税信息 -->
          <div v-if="countryCode == 'GB'">
            <div class="big-row">
              <div class="subTitle">报税信息</div>
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="declareRule">
                      <p class="top-lable"><span>*</span>报税方式</p>
                      <Select v-model="formLeft.declareRule" :disabled="ischange">
                        <Option value="0">目的国</Option>
                        <Option value="1">发出国</Option>
                      </Select>
                    </FormItem>
                    <FormItem prop="upBeginTime">
                      <p class="top-lable"><span>*</span>上一次申报区间</p>
                      <div class="clearfix flex">
                        <div class="fl">
                          <FormItem>
                            <DatePicker
                              type="month"
                              placeholder="开始时间"
                              @on-change="changeVatDate($event, 'upBeginTime')"
                              style="width: 124px"
                              :options="options"
                              v-model="formLeft.upBeginTime"
                              format="yyyy-MM"
                              :disabled="ischange"
                            ></DatePicker>
                          </FormItem>
                        </div>
                        <span style="margin: 0 7px" class="fl"> — — </span>
                        <div class="fl">
                          <FormItem prop="upEndTime">
                            <DatePicker
                              type="month"
                              placeholder="结束时间"
                              @on-change="changeVatDate($event, 'upEndTime')"
                              style="width: 124px"
                              :options="options"
                              v-model="formLeft.upEndTime"
                              format="yyyy-MM"
                              :disabled="ischange"
                            ></DatePicker>
                          </FormItem>
                        </div>
                      </div>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="taxRate">
                      <p class="top-lable"><span>*</span>报税税率</p>
                      <Select v-model="formLeft.taxRate" :disabled="ischange">
                        <Option value="6.5">6.5%</Option>
                        <Option value="7.5">7.5%</Option>
                        <Option value="16.5">16.5%</Option>
                        <Option value="20">20%</Option>
                      </Select>
                      <p style="color: #fbb73c">请按照实际情况选择，如不清楚，可询问前税代</p>
                    </FormItem>
                    <FormItem prop="returnReceiptBox5">
                      <p class="top-lable"><span>*</span>申报回执第五行金额</p>
                      <Input v-model="formLeft.returnReceiptBox5" placeholder="请输入金额" :disabled="ischange"></Input>
                      <p style="color: #fbb73c">最后一次申报回执对应的已支付完成的BOX5金额</p>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="taxEffectiveDate">
                      <p class="top-lable"><span>*</span>税号生效日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择税号生效日期"
                        @on-change="changeVatDate($event, 'taxEffectiveDate')"
                        v-model="formLeft.taxEffectiveDate"
                        class="tax-date"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                    <FormItem prop="gbAddressPostcode">
                      <p class="top-lable"><span>*</span>英国地址邮编</p>
                      <Input
                        v-model="formLeft.gbAddressPostcode"
                        placeholder="请输入英国地址邮编"
                        :disabled="ischange"
                      ></Input>
                      <p style="color: #fbb73c; width: 295px; line-height: 20px">
                        税号在HMRC备案的英国地址邮编，查询网站：https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
                      </p>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 英国文件信息 -->
          <div v-if="countryCode == 'GB'">
            <div class="big-row">
              <div class="subTitle">文件信息</div>
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="companyBusinessLicense">
                      <p class="top-lable"><span>*</span>营业执照扫描件/照片</p>
                      <Upload
                        :before-upload="beforeUploadHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('companyBusinessLicense')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>

                      <div class="out-img-box" v-if="formLeft.companyBusinessLicense != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.companyBusinessLicense" target="_blank" class="show-pdf">营业执照扫描件</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'companyBusinessLicense')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <p class="upload-tip" style="margin-bottom: 64px" v-if="!ischange">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                    </FormItem>
                    <FormItem prop="lastDeclareReceipt">
                      <p class="top-lable"><span>*</span>最后一次申报回执和支付凭证</p>
                      <div class="clearfix">
                        <div>
                          <FormItem>
                            <Upload
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, 'lastDeclareReceipt');
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, 'lastDeclareReceipt');
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf','zip','rar']"
                              :show-upload-list="false"
                              style="margin-right: 20px"
                              :class="{ ischange: ischange }"
                              :disabled="ischange"
                            >
                              <div class="inner" @click="beforType('lastDeclareReceipt')">
                                <span class="uplad-word">
                                  <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                                  点击上传申报回执
                                </span>
                              </div>
                            </Upload>
                            <div class="out-img-box" v-if="formLeft.lastDeclareReceipt != ''">
                              <div class="inner img-box">
                                <a :href="formLeft.lastDeclareReceipt" target="_blank" class="show-pdf">申报回执</a>
                                <Button class="deletBtn" v-if="!ischange">
                                  <img
                                    @click="removeHandler(1, 1, 'lastDeclareReceipt')"
                                    class="closeImg"
                                    src="@/assets/images/common/activeCloseImg.png"
                                    alt=""
                                  />
                                </Button>
                              </div>
                              <!-- <p class="corres-name">申报回执</p> -->
                            </div>
                          </FormItem>
                        </div>
                        <div style="margin-top: 8px">
                          <FormItem prop="lastPayCertificate">
                            <Upload
                              :before-upload="beforeUploadHandler"
                              :on-format-error="formatErrorHandler"
                              :on-success="
                                (res, file, fileList) => {
                                  successHandler(res, file, fileList, 'lastPayCertificate');
                                }
                              "
                              :on-remove="
                                (file, fileList) => {
                                  removeHandler(file, fileList, 'lastPayCertificate');
                                }
                              "
                              :action="ImgUrl"
                              :data="{ prefix: '' }"
                              :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                              :show-upload-list="false"
                              :class="{ ischange: ischange }"
                              :disabled="ischange"
                            >
                              <div class="inner" @click="beforType('lastPayCertificate')">
                                <span class="uplad-word">
                                  <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                                  点击上传支付凭证
                                </span>
                              </div>
                            </Upload>
                            <div class="out-img-box" v-if="formLeft.lastPayCertificate != ''">
                              <div class="inner img-box">
                                <a :href="formLeft.lastPayCertificate" target="_blank" class="show-pdf">支付凭证</a>
                                <Button class="deletBtn" v-if="!ischange">
                                  <img
                                    @click="removeHandler(1, 1, 'lastPayCertificate')"
                                    class="closeImg"
                                    src="@/assets/images/common/activeCloseImg.png"
                                    alt=""
                                  />
                                </Button>
                              </div>
                              <!-- <p class="corres-name">支付凭证</p> -->
                            </div>
                          </FormItem>
                        </div>
                        <p class="upload-tip" v-if="!ischange" style="margin-top: 20px">
                          注：支持JPG、JPEG、PNG、PDF、ZIP格式上传
                        </p>
                      </div>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="legalPersonPapers">
                      <p class="top-lable"><span>*</span>身份证正反面/护照</p>
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'legalPersonPapers');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'legalPersonPapers');
                          }
                        "
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('legalPersonPapers')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传身份证正反面 / 护照
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.legalPersonPapers != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.legalPersonPapers" target="_blank" class="show-pdf">身份证正反面 / 护照</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'legalPersonPapers')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/fa97530f1a994956bcd3fffee24c13ed.jpg"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="vatCertificate">
                      <p class="top-lable"><span>*</span>VAT证书</p>
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('vatCertificate')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.vatCertificate != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.vatCertificate" target="_blank" class="show-pdf">VAT证书</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'vatCertificate')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                      <span
                        class="explame"
                        v-if="!ischange"
                        @click="
                          vatCertificate = true;
                          exampleIndex = 1;
                        "
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例</span
                      >
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>

            <div class="big-row">
              <div class="subTitle">gateway信息</div>
              <p class="gateway-style">
                英国需提供gateway信息（ <span @click="gatewayFunction = true">gateway获取方法？</span>)
              </p>
              <div class="form">
                <div class="stepH">
                  <div>
                    <FormItem prop="gatewayId" style="margin-top: 18px">
                      <p class="top-lable"><span>*</span>Gateway 账号</p>
                      <Input v-model="formLeft.gatewayId" :disabled="ischange" style="width: 294px"></Input>
                    </FormItem>
                    <FormItem prop="gatewayVerificationCode">
                      <span class="top-lable" style="margin-right: 18px"><span>*</span>是否能够提供Gateway验证码</span>
                      <RadioGroup v-model="formLeft.gatewayVerificationCode">
                        <Radio label="1" :disabled="ischange">是</Radio>
                        <Radio label="0" :disabled="ischange">否</Radio>
                      </RadioGroup>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem prop="gatewayPassword" style="margin-top: 18px">
                      <p class="top-lable"><span>*</span>Gateway 密码</p>
                      <Input v-model="formLeft.gatewayPassword" :disabled="ischange" style="width: 294px"></Input>
                    </FormItem>
                    <FormItem prop="gatewayLastLoginDate">
                      <p class="top-lable"><span>*</span>最后一次登录Gateway时间</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择最后一次登录Gateway时间"
                        @on-change="changeVatDate($event, 'gatewayLastLoginDate')"
                        v-model="formLeft.gatewayLastLoginDate"
                        class="tax-date"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                  </div>

                  <div>
                    <FormItem prop="gatewayEmail" style="margin-top: 18px">
                      <p class="top-lable"><span>*</span>Gateway 绑定邮箱</p>
                      <Input v-model="formLeft.gatewayEmail" :disabled="ischange" style="width: 294px"></Input>
                    </FormItem>
                    <FormItem>
                      <p class="top-lable">注册税号日期</p>
                      <DatePicker
                        type="date"
                        placeholder="请选择注册税号日期"
                        @on-change="changeVatDate($event, 'registerTaxDate')"
                        v-model="formLeft.registerTaxDate"
                        class="tax-date"
                        :disabled="ischange"
                      ></DatePicker>
                    </FormItem>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 法国基本信息 -->
          <div class="big-row" v-if="countryCode == 'FR'">
            <div class="subTitle">基本信息</div>
            <div class="form">
              <div class="stepH">
                <div>
                  <FormItem prop="shopHref">
                    <p class="top-lable"><span>*</span>店铺链接</p>
                    <Input v-model="formLeft.shopHref" placeholder="请填写店铺链接" :disabled="ischange"></Input>
                  </FormItem>
                  <FormItem prop="needEoriNumber">
                    <span class="top-lable" style="margin-right: 18px"><span>*</span>是否有欧盟国EORI号</span>
                    <RadioGroup v-model="formLeft.needEoriNumber">
                      <Radio label="1" :disabled="ischange">有EORI号</Radio>
                      <Radio label="0" :disabled="ischange">无EORI号</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem prop="shopOtherEuTaxNumber">
                    <p class="top-lable">是否有欧盟其他国家税号（选填）</p>
                    <Input
                      v-model="formLeft.shopOtherEuTaxNumber"
                      placeholder="欧盟其他国家税号（如有，请输入）"
                      :disabled="ischange"
                    ></Input>
                  </FormItem>
                </div>
                <div>
                  <FormItem prop="taxEffectiveDate">
                    <p class="top-lable"><span>*</span>税号生效日期</p>
                    <!-- :options="optionsDate" -->
                    <DatePicker
                      type="date"
                      placeholder="请选择税号生效日期"
                      v-model="formLeft.taxEffectiveDate"
                      format="yyyy-MM-dd"
                      class="tax-date"
                      :disabled="ischange"
                    ></DatePicker>
                    <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">注：税号生效日期请根据您提供的税号文件显示的税号生效日期来填写</p>
                  </FormItem>
                </div>
                <div>
                  <FormItem>
                    <p class="top-lable"><span>*</span>上一次申报区间</p>
                    <div class="clearfix">
                      <div class="fl">
                        <FormItem prop="upBeginTime">
                          <DatePicker
                            type="month"
                            placeholder="开始时间"
                            @on-change="changeVatDate($event, 'upBeginTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upBeginTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                      <div class="fl" style="text-align: center">— —</div>
                      <div class="fl">
                        <FormItem prop="upEndTime">
                          <DatePicker
                            type="month"
                            placeholder="结束时间"
                            @on-change="changeVatDate($event, 'upEndTime')"
                            style="width: 124px"
                            :options="options"
                            v-model="formLeft.upEndTime"
                            format="yyyy-MM"
                            :disabled="ischange"
                          ></DatePicker>
                        </FormItem>
                      </div>
                    </div>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>

          <!-- 法国文件信息 -->
          <div class="big-row" v-if="countryCode == 'FR'">
            <div class="subTitle">文件信息</div>
            <div class="form">
              <div class="clearfix fileClass">
                <span class="top-lable"><span>*</span>任选1种上传（大陆公司/香港公司/海外公司）</span>
                <!-- <FormItem
                                style="width:385px"
                                class="requiredItem"
                                prop="companyType"> -->
                <RadioGroup v-model="formLeft.companyType" @on-change="companyTypeChange">
                  <Radio :disabled="ischange" label="1">大陆公司</Radio>
                  <Radio :disabled="ischange" label="2">香港公司</Radio>
                  <Radio :disabled="ischange" label="3">海外公司</Radio>
                </RadioGroup>
                <!-- </FormItem> -->
                <FormItem v-if="formLeft.companyType == '3'" prop="articlesOfAssociationFile">
                  <p class="top-lable" style="margin-top: 23px"><span>*</span>公司章程</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
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
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('articlesOfAssociationFile')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                    <!-- <p class="corres-name"></p> -->
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.articlesOfAssociationFile != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.articlesOfAssociationFile" target="_blank" class="show-pdf">公司章程</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'articlesOfAssociationFile')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                    <!-- <p class="corres-name">公司章程</p> -->
                  </div>
                  <p class="upload-tip" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <span class="explame">
                    <a
                      href="http://file.itaxs.com/pro/20210726/eb485d6ee08e44d5a06dc029577d7b6a.pdf"
                      target="_blank"
                      style="color: #16ade9"
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </a>
                  </span>
                </FormItem>
                <FormItem v-if="formLeft.companyType == '3'" prop="bankAccountFile">
                  <p class="top-lable" style="margin-top: 23px">银行账号文件</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'bankAccountFile');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'bankAccountFile');
                      }
                    "
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('bankAccountFile')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                    <!-- <p class="corres-name"></p> -->
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.bankAccountFile != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.bankAccountFile" target="_blank" class="show-pdf">银行账号文件</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'bankAccountFile')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                    <!-- <p class="corres-name">银行账号文件</p> -->
                  </div>
                  <p class="upload-tip" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </FormItem>
                <FormItem v-if="formLeft.companyType == '3'" prop="companyTaxNumFile">
                  <p class="top-lable" style="margin-top: 23px">公司本国税号文件</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
                    :on-format-error="formatErrorHandler"
                    :on-success="
                      (res, file, fileList) => {
                        successHandler(res, file, fileList, 'companyTaxNumFile');
                      }
                    "
                    :on-remove="
                      (file, fileList) => {
                        removeHandler(file, fileList, 'companyTaxNumFile');
                      }
                    "
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('companyTaxNumFile')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                    <!-- <p class="corres-name"></p> -->
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.companyTaxNumFile != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.companyTaxNumFile" target="_blank" class="show-pdf">公司本国税号文件</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'companyTaxNumFile')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                    <!-- <p class="corres-name">公司本国税号文件</p> -->
                  </div>
                  <p class="upload-tip" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </FormItem>

                <FormItem v-if="formLeft.companyType == '1'" prop="companyBusinessLicense">
                  <p class="top-lable" style="margin-top: 23px"><span>*</span>营业执照</p>
                  <Upload
                    :before-upload="beforeUploadHandler"
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
                    :action="ImgUrl"
                    :data="{ prefix: '' }"
                    :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                    :show-upload-list="false"
                    style="margin-right: 30px"
                    :class="{ ischange: ischange }"
                    :disabled="ischange"
                  >
                    <div class="inner" @click="beforType('companyBusinessLicense')">
                      <span class="uplad-word">
                        <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                        点击上传
                      </span>
                    </div>
                    <!-- <p class="corres-name"></p> -->
                  </Upload>
                  <div class="out-img-box" v-if="formLeft.companyBusinessLicense != ''">
                    <div class="inner img-box">
                      <a :href="formLeft.companyBusinessLicense" target="_blank" class="show-pdf">营业执照</a>
                      <Button class="deletBtn" v-if="!ischange">
                        <img
                          @click="removeHandler(1, 1, 'companyBusinessLicense')"
                          class="closeImg"
                          src="@/assets/images/common/activeCloseImg.png"
                          alt=""
                        />
                      </Button>
                    </div>
                    <!-- <p class="corres-name">营业执照</p> -->
                  </div>
                  <p class="upload-tip" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <span class="explame">
                    <a
                      href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/3065c451c732424ba24a6d3aa9b17741.jpg"
                      target="_blank"
                      style="color: #16ade9"
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </a>
                  </span>
                </FormItem>
                <div class="flex-item" style="margin-top: 23px" v-if="formLeft.companyType == '2'">
                  <FormItem prop="companyBusinessRegistrationBr">
                    <p class="top-lable"><span>*</span>商业登记证BR(香港公司)</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyBusinessRegistrationBr')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyBusinessRegistrationBr != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyBusinessRegistrationBr" target="_blank" class="show-pdf"
                          >商业登记证BR</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyBusinessRegistrationBr')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">商业登记证BR</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyRegistrationCi">
                    <p class="top-lable"><span>*</span>公司注册证明书CI(香港公司)</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyRegistrationCi')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <p class="corres-name"></p>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyRegistrationCi != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyRegistrationCi" target="_blank" class="show-pdf">公司注册证明书CI</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyRegistrationCi')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">公司注册证明书CI</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                  <FormItem prop="companyCorporateFoundingNnc1">
                    <p class="top-lable"><span>*</span>法团成立表格NNC1(香港公司)</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyCorporateFoundingNnc1')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                      <!-- <p class="corres-name"></p> -->
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyCorporateFoundingNnc1 != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyCorporateFoundingNnc1" target="_blank" class="show-pdf"
                          >法团成立表格NNC1</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyCorporateFoundingNnc1')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                      <!-- <p class="corres-name">法团成立表格NNC1</p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 6">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  </FormItem>
                </div>
              </div>
              <div class="clearfix fileClass">
                <span class="top-lable"><span>*</span>任选1种上传（身份证/护照）</span>
                <RadioGroup v-model="formLeft.certificateType">
                  <Radio label="1" :disabled="formLeft.companyType == '3'">身份证</Radio>
                  <Radio label="2">护照</Radio>
                </RadioGroup>
                <div class="flex-item">
                  <div style="display: flex" v-if="formLeft.certificateType == '1'">
                    <FormItem v-if="formLeft.certificateType == '1'" prop="companyLegalPersonCardFront">
                      <p class="top-lable" style="margin-top: 33px"><span>*</span>身份证正面扫描件</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('companyLegalPersonCardFront')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.companyLegalPersonCardFront != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.companyLegalPersonCardFront" target="_blank" class="show-pdf"
                              >身份证正面扫描件</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'companyLegalPersonCardFront')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p class="upload-tip" v-if="!ischange" style="margin-top: 0">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/dca637afbb3c469a96a76d0f2cbbd267.jpg"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                    <FormItem v-if="formLeft.certificateType == '1'" prop="companyLegalPersonCardReverse">
                      <p class="top-lable" style="margin-top: 33px"><span>*</span>身份证反面扫描件</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
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
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('companyLegalPersonCardReverse')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.companyLegalPersonCardReverse != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.companyLegalPersonCardReverse" target="_blank" class="show-pdf"
                              >身份证反面扫描件</a
                            >
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'companyLegalPersonCardReverse')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p class="upload-tip" v-if="!ischange" style="margin-top: 0">
                        注：支持JPG、JPEG、PNG、PDF格式上传
                      </p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/dca637afbb3c469a96a76d0f2cbbd267.jpg"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                  </div>
                  <FormItem v-if="formLeft.certificateType == '2'" prop="companyLegalPersonCardPassport">
                    <p class="top-lable" style="margin-top: 33px"><span>*</span>护照扫描件</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('companyLegalPersonCardPassport')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.companyLegalPersonCardPassport != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.companyLegalPersonCardPassport" target="_blank" class="show-pdf"
                            >护照扫描件</a
                          >
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'companyLegalPersonCardPassport')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/b99dadf9e3f043a78d69ea3bfdb2db74.jpg"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                </div>
              </div>
              <div class="clearfix fileClass">
                <div class="flex-item" style="margin-top: 33px">
                  <FormItem prop="shopConsoleScreenshot">
                    <p class="top-lable"><span>*</span>后台截图</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
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
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('shopConsoleScreenshot')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.shopConsoleScreenshot != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.shopConsoleScreenshot" target="_blank" class="show-pdf">后台截图</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'shopConsoleScreenshot')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px;">请提供带有店铺名、公司名称和地址等信息的截图</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="http://file.itaxs.com/dev/20210722/b0f4e00b9dcf4aa4be7336bbb4843fda.png"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                  <FormItem prop="vatTaxNumberFile">
                    <p class="top-lable"><span>*</span>税号证书</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'vatTaxNumberFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'vatTaxNumberFile');
                          }
                        "
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('vatTaxNumberFile')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.vatTaxNumberFile != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.vatTaxNumberFile" target="_blank" class="show-pdf">税号证书</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'vatTaxNumberFile')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/03fa7cfe4d444051a8377999ef623915.jpg"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                  <FormItem prop="lastDeclareReceipt">
                    <p class="top-lable"><span>*</span>历史申报回执</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandlerzip"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'lastDeclareReceipt');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'lastDeclareReceipt');
                          }
                        "
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('lastDeclareReceipt')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.lastDeclareReceipt != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.lastDeclareReceipt" target="_blank" class="show-pdf">历史申报回执</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'lastDeclareReceipt')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                      <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                    </div>
                    <p class="upload-tip" v-if="!ischange" style="margin-top: 0">
                      注：支持JPG、JPEG、PNG、PDF、rar、zip格式上传
                    </p>
                    <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px">
                      如您的报税周期是月报，请根据您上一次申报区间，提供至少近3个月的申报回执；<br>
                      如您的报税周期是季报，请根据您上一次申报区间，提供至少近1个季度的申报回执</p>
                  </FormItem>
                </div>
              </div>
              <div class="clearfix fileClass" style="margin-top: 33px">
                <FormItem prop="lastPayCertificate">
                  <p class="top-lable"><span>*</span>历史支付回执</p>
                  <div class="upload-file-box">
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandlerzip"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'lastPayCertificate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'lastPayCertificate');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('lastPayCertificate')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.lastPayCertificate != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.lastPayCertificate" target="_blank" class="show-pdf">历史支付回执</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'lastPayCertificate')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                  </div>
                  <p class="upload-tip" v-if="!ischange" style="margin-top: 0">
                    注：支持JPG、JPEG、PNG、PDF、rar、zip格式上传<br />请上传过往的税金缴费单
                  </p>
                    <p v-if="countryCode == 'FR'" style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px;">
                    如您的报税周期是月报，请根据您上一次申报区间，提供至少近3个月的支付回执；<br>
                    如您的报税周期是季报，请根据您上一次申报区间，提供至少近1个季度的支付回执。<br>
                    如前代理实在无法提供支付回执，可上传空白截图并注明无法提供的原因
                    </p>
                </FormItem>
              </div>
            </div>
          </div>

          <!-- 德国文件信息 -->
          <div class="big-row" v-if="countryCode == 'DE'">
            <div class="subTitle">文件信息</div>
            <div class="form">
              <div class="stepH">
                <div>
                  <FormItem prop="vatTaxLocalFile">
                    <p class="top-lable"><span>*</span>税号文件</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'vatTaxLocalFile');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'vatTaxLocalFile');
                          }
                        "
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('vatTaxLocalFile')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.vatTaxLocalFile != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.vatTaxLocalFile" target="_blank" class="show-pdf">税号文件</a>
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'vatTaxLocalFile')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <p
                      class="explame"
                      v-if="!ischange"
                      @click="
                        vatCertificate = true;
                        exampleIndex = 2;
                      "
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </p>
                  </FormItem>
                  <FormItem
                    prop="declarePeriodChangeLetter"
                    v-if="formLeft.declarePeriod == '1' || formLeft.declarePeriod == '2'"
                  >
                    <p class="top-lable"><span>*</span>申报周期更改信件</p>
                    <div class="upload-file-box">
                      <Upload
                        :before-upload="beforeUploadHandler"
                        :on-format-error="formatErrorHandler"
                        :on-success="
                          (res, file, fileList) => {
                            successHandler(res, file, fileList, 'declarePeriodChangeLetter');
                          }
                        "
                        :on-remove="
                          (file, fileList) => {
                            removeHandler(file, fileList, 'declarePeriodChangeLetter');
                          }
                        "
                        :action="ImgUrl"
                        :data="{ prefix: '' }"
                        :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                        :show-upload-list="false"
                        style="margin-right: 20px"
                        :class="{ ischange: ischange }"
                        :disabled="ischange"
                      >
                        <div class="inner" @click="beforType('declarePeriodChangeLetter')">
                          <span class="uplad-word">
                            <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                            点击上传
                          </span>
                        </div>
                      </Upload>
                      <div class="out-img-box" v-if="formLeft.declarePeriodChangeLetter != ''">
                        <div class="inner img-box">
                          <a :href="formLeft.declarePeriodChangeLetter" target="_blank" class="show-pdf"
                            >申报周期更改信件</a
                          >
                          <Button class="deletBtn" v-if="!ischange">
                            <img
                              @click="removeHandler(1, 1, 'declarePeriodChangeLetter')"
                              class="closeImg"
                              src="@/assets/images/common/activeCloseImg.png"
                              alt=""
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                    <p class="explame" v-if="!ischange">
                      <a
                        style="color: #16ade9"
                        href="https://file.itaxs.com/dev/20210319/fafee618b9514f5ba21ef3ba15f49c15.png"
                        target="_blank"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </p>
                  </FormItem>
                </div>

                <FormItem prop="vatTaxEuFile">
                  <p class="top-lable"><span>*</span>欧盟税号文件</p>
                  <div class="upload-file-box">
                    <Upload
                      :before-upload="beforeUploadHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('vatTaxEuFile')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.vatTaxEuFile != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.vatTaxEuFile" target="_blank" class="show-pdf">欧盟税号文件</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'vatTaxEuFile')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <p
                    class="explame"
                    v-if="!ischange"
                    @click="
                      vatCertificate = true;
                      exampleIndex = 3;
                    "
                  >
                    <img src="@/assets/images/common/serch.png" />
                    查看示例
                  </p>
                </FormItem>
                <FormItem>
                  <p class="top-lable">税务副本</p>
                  <div class="upload-file-box">
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxFileCopy');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxFileCopy');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('vatTaxFileCopy')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.vatTaxFileCopy != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.vatTaxFileCopy" target="_blank" class="show-pdf">税务副本</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'vatTaxFileCopy')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <p
                    class="explame"
                    v-if="!ischange"
                    @click="
                      vatCertificate = true;
                      exampleIndex = 4;
                    "
                  >
                    <img src="@/assets/images/common/serch.png" />
                    查看示例
                  </p>
                </FormItem>
              </div>
              <!-- todo 新增 -->
              <div class="clearfix fileClass">
                <span class="top-lable"><span>*</span>法人证件</span>
                <RadioGroup v-model="formLeft.certificateType">
                  <Radio label="1">身份证</Radio>
                  <Radio label="2">护照</Radio>
                </RadioGroup>
                <FormItem v-if="formLeft.certificateType == '1'" prop="companyLegalPersonCardFront">
                  <p class="top-lable" style="margin-top: 33px"><span>*</span>身份证</p>
                  <div class="upload-file-box">
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyLegalPersonCardFront')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          身份证（人像面）
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyLegalPersonCardFront != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyLegalPersonCardFront" target="_blank" class="show-pdf"
                          >身份证（人像面）</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyLegalPersonCardFront')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div class="upload-file-box" style="margin-top: 10px">
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyLegalPersonCardReverse')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          身份证（国徽面）
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyLegalPersonCardReverse != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyLegalPersonCardReverse" target="_blank" class="show-pdf"
                          >身份证（国徽面）</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyLegalPersonCardReverse')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                </FormItem>
                <FormItem v-if="formLeft.certificateType == '2'" prop="companyLegalPersonCardPassport">
                  <p class="top-lable" style="margin-top: 33px"><span>*</span>法人护照扫描件</p>
                  <div class="upload-file-box">
                    <Upload
                      :before-upload="beforeUploadHandler"
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
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                      :show-upload-list="false"
                      style="margin-right: 20px"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('companyLegalPersonCardPassport')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.companyLegalPersonCardPassport != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.companyLegalPersonCardPassport" target="_blank" class="show-pdf"
                          >法人护照扫描件</a
                        >
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'companyLegalPersonCardPassport')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                  <!-- <span class="explame" v-if="!ischange">
                    <a
                      href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/b99dadf9e3f043a78d69ea3bfdb2db74.jpg"
                      target="_blank"
                      style="color: #16ade9"
                    >
                      <img src="@/assets/images/common/serch.png" />
                      查看示例
                    </a>
                  </span> -->
                </FormItem>
              </div>
            </div>
          </div>

          <!-- 意大利文件信息 -->
          <div v-if="countryCode == 'IT' && productId != 35">
            <div class="big-row">
              <div class="subTitle">文件信息</div>
              <div class="form">
                <div class="stepH">
                  <FormItem prop="vatTaxNumberFile">
                    <p class="top-lable"><span>*</span>税号文件</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'vatTaxNumberFile');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'vatTaxNumberFile');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf','zip','rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('vatTaxNumberFile')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.vatTaxNumberFile != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.vatTaxNumberFile" target="_blank" class="show-pdf">税号文件</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'vatTaxNumberFile')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                    <span class="explame" v-if="!ischange">
                      <a
                        href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/b99da2a6ca7e4048a6e0343a6f643add.pdf"
                        target="_blank"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" />
                        查看示例
                      </a>
                    </span>
                  </FormItem>
                  <FormItem prop="lastDeclareReceipt">
                    <p class="top-lable"><span>*</span>历史申报回执</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandlerzip"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'lastDeclareReceipt');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'lastDeclareReceipt');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('lastDeclareReceipt')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.lastDeclareReceipt != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.lastDeclareReceipt" target="_blank" class="show-pdf">历史申报回执</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'lastDeclareReceipt')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                  </FormItem>
                  <FormItem prop="lastPayCertificate">
                    <p class="top-lable"><span>*</span>历史扣款回执</p>
                    <Upload
                      :before-upload="beforeUploadHandler"
                      :on-format-error="formatErrorHandler"
                      :on-success="
                        (res, file, fileList) => {
                          successHandler(res, file, fileList, 'lastPayCertificate');
                        }
                      "
                      :on-remove="
                        (file, fileList) => {
                          removeHandler(file, fileList, 'lastPayCertificate');
                        }
                      "
                      :action="ImgUrl"
                      :data="{ prefix: '' }"
                      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                      :show-upload-list="false"
                      :class="{ ischange: ischange }"
                      :disabled="ischange"
                    >
                      <div class="inner" @click="beforType('lastPayCertificate')">
                        <span class="uplad-word">
                          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                          点击上传
                        </span>
                      </div>
                    </Upload>
                    <div class="out-img-box" v-if="formLeft.lastPayCertificate != ''">
                      <div class="inner img-box">
                        <a :href="formLeft.lastPayCertificate" target="_blank" class="show-pdf">历史扣款回执</a>
                        <Button class="deletBtn" v-if="!ischange">
                          <img
                            @click="removeHandler(1, 1, 'lastPayCertificate')"
                            class="closeImg"
                            src="@/assets/images/common/activeCloseImg.png"
                            alt=""
                          />
                        </Button>
                      </div>
                    </div>
                    <p class="upload-tip" style="margin-top: 0" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF、ZIP格式上传</p>
                  </FormItem>
                </div>
              </div>
            </div>
          </div>

          <!-- 西班牙文件信息 -->
          <div v-if="countryCode == 'ES'">
            <div class="big-row">
              <div class="subTitle">文件信息</div>
              <div class="form">
                <div class="clearfix fileClass">
                  <div class="flex-item" style="margin-top: 33px">
                    <FormItem prop="vatTaxNumberFile">
                      <p class="top-lable"><span>*</span>税号文件</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandler"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'vatTaxNumberFile');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'vatTaxNumberFile');
                            }
                          "
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('vatTaxNumberFile')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.vatTaxNumberFile != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.vatTaxNumberFile" target="_blank" class="show-pdf">税号文件</a>
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'vatTaxNumberFile')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                        <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                      </div>
                      <p class="upload-tip" v-if="!ischange">注：支持JPG、JPEG、PNG、PDF格式上传</p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/c937af996cd74fea88ad59edaa342563.PDF"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                    <FormItem prop="lastDeclareReceipt">
                      <p class="top-lable"><span>*</span>历史申报回执</p>
                      <div class="upload-file-box">
                        <Upload
                          :before-upload="beforeUploadHandler"
                          :on-format-error="formatErrorHandlerzip"
                          :on-success="
                            (res, file, fileList) => {
                              successHandler(res, file, fileList, 'lastDeclareReceipt');
                            }
                          "
                          :on-remove="
                            (file, fileList) => {
                              removeHandler(file, fileList, 'lastDeclareReceipt');
                            }
                          "
                          :action="ImgUrl"
                          :data="{ prefix: '' }"
                          :format="['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'rar']"
                          :show-upload-list="false"
                          style="margin-right: 20px"
                          :class="{ ischange: ischange }"
                          :disabled="ischange"
                        >
                          <div class="inner" @click="beforType('lastDeclareReceipt')">
                            <span class="uplad-word">
                              <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
                              点击上传
                            </span>
                          </div>
                        </Upload>
                        <div class="out-img-box" v-if="formLeft.lastDeclareReceipt != ''">
                          <div class="inner img-box">
                            <a :href="formLeft.lastDeclareReceipt" target="_blank" class="show-pdf">历史申报回执</a>
                            <Button class="deletBtn" v-if="!ischange">
                              <img
                                @click="removeHandler(1, 1, 'lastDeclareReceipt')"
                                class="closeImg"
                                src="@/assets/images/common/activeCloseImg.png"
                                alt=""
                              />
                            </Button>
                          </div>
                        </div>
                        <!-- <p class="example-name"  @click="vatCertificate=true;exampleIndex=2">查看示例>></p> -->
                      </div>
                      <p class="upload-tip" style="line-height: 20px" v-if="!ischange">
                        注：支持JPG、JPEG、PNG、PDF格式上传<br />如有多个请上传压缩包ZIP格式
                      </p>
                      <span class="explame" v-if="!ischange">
                        <a
                          href="https://ksyvat.oss-cn-shenzhen.aliyuncs.com/dev/20210121/1ef0258578f24d6ca7a8cb192c532605.pdf"
                          target="_blank"
                          style="color: #16ade9"
                        >
                          <img src="@/assets/images/common/serch.png" />
                          查看示例
                        </a>
                      </span>
                    </FormItem>
                    <div style="width: 294px"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 法人签名 -->
          <div class="big-row">
            <FormItem
              prop="companyLegalPersonSign"
              class="legalPersonSignatureBox"
              v-if="
                countryCode == 'GB' ||
                countryCode == 'DE' ||
                countryCode == 'ES' ||
                (countryCode == 'IT' && productId == 35)
              "
            >
              <div class="legalPersonSignature">
                <p class="titleSign">法人签名</p>
                <div class="signContent">
                  <div class="flex">
                    <div id="qrcode" v-show="status == 28 || status == 32">
                      <p>请扫码进行转代理授权</p>
                    </div>
                    <div class="signature">
                      <img
                        v-if="formLeft.companyLegalPersonSign !== '' && formLeft.companyLegalPersonSign !== undefined"
                        :src="formLeft.companyLegalPersonSign"
                        alt=""
                      />
                      <Button v-else type="primary" @click="hasSignature">我已签名</Button>
                      <span
                        v-if="
                          (status == 28 || status == 32) &&
                          formLeft.companyLegalPersonSign !== '' &&
                          formLeft.companyLegalPersonSign !== undefined
                        "
                        :src="formLeft.companyLegalPersonSign"
                        @click="hasSignature"
                      >
                        <img class="refresh" src="@/assets/images/common/refreshBlue.png" alt="" />
                      </span>
                    </div>
                  </div>
                  <p class="" style="color: #fbb73c; margin-top: 30px" v-if="countryCode === 'ES'">
                    说明：法人签名主要应用于转代理+申报,请使用中文进行签名
                    <!-- <a href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                        target="_black">查看示例>></a> -->
                  </p>
                  <div class="" style="color: #fbb73c; margin-top: 30px" v-else>
                    说明：法人签名主要应用于转代理+申报,请使用英文格式签名，如张三（San Zhang）
                    <p>
                      <a
                        href="https://pre-fdfs.itaxs.com/group1/M00/00/57/rBLKLV7YahKARoyDAAuLPibt4uQ699.jpg"
                        target="_black"
                        style="color: #16ade9"
                      >
                        <img src="@/assets/images/common/serch.png" style="position: relative; top: 4px" />
                        查看示例
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </FormItem>
          </div>
        </Form>

        <div v-if="countryCode == 'SA' && leftFrom != null">
          <SaturnToAgent
            :ischange="ischange"
            :leftFrom="leftFrom"
            :status="status"
            :servicesId="servicesId"
            ref="childSA"
            @submitSuccess="submitsuccessSA"
          ></SaturnToAgent>
        </div>

        <AeturnToAgent
          v-if="countryCode == 'AE' && leftFrom != null"
          :ischange="ischange"
          :leftFrom="leftFrom"
          :status="status"
          :servicesId="servicesId"
          ref="childAE"
          @submitSuccess="submitsuccessSA"
        ></AeturnToAgent>
        <PlturnToAgent
          v-if="countryCode == 'PL' && leftFrom != null"
          :ischange="ischange"
          :leftFrom="leftFrom"
          :status="status"
          :servicesId="servicesId"
          ref="childPL"
          @submitSuccess="submitsuccessSA"
        ></PlturnToAgent>
        <NlturnToAgent
          v-if="countryCode == 'NL' && leftFrom != null"
          :ischange="ischange"
          :leftFrom="leftFrom"
          :status="status"
          :servicesId="servicesId"
          ref="childNL"
          @submitSuccess="submitsuccessSA"
        ></NlturnToAgent>
        <CzturnToAgent
          v-if="countryCode == 'CZ' && leftFrom != null"
          :ischange="ischange"
          :leftFrom="leftFrom"
          :status="status"
          :servicesId="servicesId"
          ref="childCZ"
          @submitSuccess="submitsuccessSA"
        ></CzturnToAgent>
        <AtturnToAgent
          v-if="countryCode == 'AT' && leftFrom != null"
          :ischange="ischange"
          :leftFrom="leftFrom"
          :status="status"
          :servicesId="servicesId"
          ref="childAT"
          @submitSuccess="submitsuccessSA"
        ></AtturnToAgent>

        <Modal v-model="vatCertificate" footer-hide width="866" class="example-modal">
          <img src="@/assets/images/survey/vatCercitifyEx.png" v-if="exampleIndex == 1" />
          <img src="@/assets/images/survey/localVatFile.png" v-if="exampleIndex == 2" />
          <img src="@/assets/images/survey/euVatFile.png" v-if="exampleIndex == 3" />
          <img src="@/assets/images/survey/declareCopyFile.png" v-if="exampleIndex == 4" />
        </Modal>
        <Modal v-model="gatewayFunction" footer-hide title="Gateway获取方法：">
          <div class="gateway-box">
            <p>1、有申请单独Gateway账户，请直接提供ID和密码</p>
            <p>2、如不清楚是否有单独的Gateway账户，可找原税务代理提供（一般原税代都有注册）</p>
            <p>3.确认以上都没有，您也可以联系我们的客服，我们将竭力帮您解决；</p>
          </div>
        </Modal>
      </div>
      <div class="btn-box">
        <Button
          :loading="saveLosding"
          style="border-color: #16ade9; color: #16ade9"
          @click="saveForm"
          v-if="status == 28 || status == 32"
          >保存</Button
        >
        <Button
          type="primary"
          :loading="submitLoading"
          @click="clickSubmit('formLeft')"
          v-if="status == 28 || status == 32"
          >提交</Button
        >
      </div>
      <!-- <div class="up"
          @click="backTop">
        <img src="@/assets/images/common/up.png"
            alt="">
        <span>回到顶部</span>
      </div> -->
      <!-- <div class="up" @click="backTop">
        <Tooltip content="回到顶部" placement="left-start">
          <img src="@/assets/images/common/up.svg" alt="" />
          <span>顶部</span>
        </Tooltip>
      </div> -->
    </div>
    <div class="submit-finish" v-if="submitFinish">
      <div class="main">
        <img src="@/assets/images/common/chenggong.png" />
        <p class="tip-success">提交注册资料成功，已通知税务师进行审核！</p>
        <p class="submit-time">
          提交时间：<span>{{ submitTime }}</span>
        </p>
        <p class="caokao-time">{{ countryNameZh }}转代理参考时效：{{ transformEfficiency }}，请耐心等待</p>
        <Button type="info" ghost style="width: 142px" @click="backToHome">返回工作台</Button>
        <div class="gongzhonghao">
          <p class="vat-jindu">关注跨税云公众号，实时查看VAT进度；</p>
          <img src="@/assets/images/common/erweima.png" width="140" />
        </div>
      </div>
    </div>
    <Modal v-model="agingBox" footer-hide title="转代理时效说明">
      <div class="aging-box">
        <div class="aging-country">英国：</div>
        <div class="aging-container">英国转代理时效为2-4周左右，改地址时效为1-3个月；</div>
        <div class="aging-country">德国：</div>
        <div class="aging-container">转代理时效为1周左右；</div>
        <div class="remark">备注：具体以实际情况为准，以上时间仅供参考；</div>
      </div>
    </Modal>
    <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{ formLeft.remark }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="tipsModal = false">知道了</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { saveAgentForm, submitAgentForm, getAgentForm } from "@/api/turnToAgent/turnToAgent";
import {
  getAllServiceCompanies,
  getCompanyInformation,
  getCompanyLegalPersonSign,
  getCompanyLegalPersonSignUrl,
  getTransformEfficiency,
  getRegionList
} from "@/api/registerInfo/registerInfo";
import { baseInfoByCondition, legalpersonCountry } from "@/api/taxModule";
import { Throttle } from "@/libs/throttle.js";
import QRCode from "qrcodejs2";
// import { apiUrl } from '@/config/index'
import SaturnToAgent from "@/views/home/components/registerComponents/SaturnToAgent.vue";
import AeturnToAgent from "@/views/home/components/registerComponents/AeturnToAgent.vue";
import PlturnToAgent from "@/views/home/components/registerComponents/PlturnToAgent.vue";
import NlturnToAgent from "@/views/home/components/registerComponents/NlturnToAgent.vue";
import AtturnToAgent from "@/views/home/components/registerComponents/AtturnToAgent.vue";
import CzturnToAgent from "@/views/home/components/registerComponents/CzturnToAgent.vue";
export default {
  components: {
    SaturnToAgent,
    AeturnToAgent,
    PlturnToAgent,
    NlturnToAgent,
    AtturnToAgent,
    CzturnToAgent,
  },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请输入后台店铺邮编号码"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value - 0)) {
          callback(new Error("请输入正确的邮编号码"));
        } else {
          callback();
        }
      }, 500);
    };
    return {
      birthplaceList: [],
      materialAuditDate: "",
      submitMaterialTime: "",
      idCardNum: "1",
      companyCateNum: "1",
      transformEfficiency: "",
      submitTime: "",
      submitFinish: false,
      contentStyleObj: {
        "min-height": "",
        "min-width": "1024px",
      },
      countryCode: this.$route.query.countryCode,
      countryNameZh: this.$route.query.countryNameZh,
      supplierId: this.$route.query.supplierId,
      productId: this.$route.query.productId,
      agingBox: false,
      vatCertificate: false,
      gatewayFunction: false,
      allRegionList:[],
      formLeft: {
        gatewayVerificationCode: "",
        taxRate: "",
        declareRule: "",
        vatTaxNumber: "",
        vatTaxEuNumber: "",
        declarePeriod: "",
        companyType: "1",
        companyAddressZh: "",
        companyAddressCn: "",
        certificateType: "1",
        companyNameEn: "",
        companyPostCode: "",
        companyAddressEnCountry: "",
        companyAddressEnCity: "",
        coRegionCode:'',
        companyAddressEnProvince: "",
        companyAddressEn: "",
        companyLegalPersonZh: "",
        companyLegalPersonEn: "",
        companyEmail: "",
        companyTel: "",
        companyBusinessModeDescribe: "",
        companyLegalPersonSign: "",
        taxEffectiveDate: "",
        shopSalePlan: "",
        upBeginTime: "",
        upEndTime: "",
        companyBusinessLicense: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        gatewayId: "",
        gatewayPassword: "",
        gatewayEmail: "",
        registerTaxDate: "",
        gatewayLastLoginDate: "",
        postCode: "",
        companyCitizenship: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        declarePeriodChangeLetter: "",
        vatTaxFileCopy: "",
        orderServicesId: this.$route.query.servicesId,
        //意大利新增字段
        companyLegalPersonCard: "",
        companyLegalPersonCardAddress: "",
        companyLegalPersonBirthday: "",
        shopHref: "",
        returnReceiptBox5: "",
        gbAddressPostcode: "",
        lastDeclareReceipt: "",
        vatTaxNumberFile: "",
        registrationAuthorization: "",
        companyLegalPersonBirthplace: "",
        companyRegisteredCapital: "",
        companyRegisterData: "",
        legalPersonMaritalStatus: "",
        legalPersonBirthplaceCountryEn: "",
        legalPersonBirthplaceProvinceZh: "",
        legalPersonBirthplaceProvinceEn: "",
        legalPersonBirthplaceCityZh: "",
        legalPersonBirthplaceCityEn: "",
        companyLegalPersonCitizenship: "",
        companyLegalPersonCardAddressZh: "",
        companyLegalPersonCardAddressCn: "",
        companyLegalPersonMaritalStatus: "",
        needEoriNumber: "",
        isThereEoriNumber: "",
        shippingProcess: "",
        useEntrepot: "",
        dredgeEuronext: "",
        articlesOfAssociationFile: "",
        bankAccountFile: "",
        companyTaxNumFile: "",
        shopOtherEuTaxNumber: "",
        companyBusinessRegistrationBr: "",
        companyRegistrationCi: "",
        companyCorporateFoundingNnc1: "",
        companyRegisteredCityZh: "",
        companyRegisteredCityEn: "",
        localBankAccountInfo: "",
        companyCreditReport: "",
        companyLegalPersonCardFront: "",
        companyLegalPersonCardReverse: "",
        companyLegalPersonCardPassport: "",
        shopConsoleScreenshot: "",
        legalPersonPostCode: "",
      },
      vatNumberPrefix: "GB", //vat税号的前几位
      vatNumberSuffixDigitLength: 0, //税号的长度
      exampleIndex: 0,
      saveLosding: false,
      submitLoading: false,
      nowFile: "",
      ruleForm: {
        taxRate: [{ required: true, trigger: "change", message: "请选择报税税率" }],
        declareRule: [{ required: true, trigger: "change", message: "请选择报税方式" }],
        companyType: [{ required: true, trigger: "change", message: "请选择公司类型" }],
        certificateType: [{ required: true, trigger: "change", message: "请选择证件类型" }],
        companyLegalPersonCitizenship: [{ required: true, trigger: "change", message: "请选择法人国籍" }],
        companyRegisteredCityZh: [{ required: true, trigger: "blur", message: "请填公司营业执照注册城市" }],
        localBankAccountInfo: [{ required: true, trigger: "blur", message: "请填写本地银行账户信息" }],
        vatTaxNumber: [{ required: true, trigger: "blur", message: "请填写VAT税号" }],
        companyAddressZh: [{ required: true, trigger: "blur", message: "请填写公司中文地址" }],
        companyRegisteredCityEn: [{ required: true, trigger: "blur", message: "请填写公司注册登记城市英文" }],
        companyAddressCn: [{ required: true, trigger: "blur", message: "请填写公司中文地址" }],
        vatTaxEuNumber: [{ required: true, trigger: "blur", message: "请填写欧盟税号" }],
        gatewayId: [{ required: true, trigger: "blur", message: "请填写Gateway ID" }],
        gatewayPassword: [{ required: true, trigger: "blur", message: "请填写Gateway 密码" }],
        gatewayVerificationCode: [{ required: true, trigger: "blur", message: "请选择是否能够提供Gateway验证码" }],
        declarePeriod: [{ required: true, trigger: "change", message: "请选择报税周期" }],
        personCardAddressCityEn: [{ required: true, trigger: "blur", message: "请输入法人身份证所在城市的英文名称" }],
        companyLegalPersonMaritalStatus: [{ required: true, trigger: "change", message: "请选择法人婚姻状况" }],
        companyNameZh: [{ required: true, trigger: "blur", message: "请填写公司中文名" }],
        companyLegalPersonZh: [{ required: true, trigger: "blur", message: "请填写法人中文名" }],
        companyLegalPersonEn: [{ required: true, trigger: "blur", message: "请填写法人英文名" }],
        companyNameEn: [{ required: true, trigger: "blur", message: "请填写公司英文名" }],
        companyPostCode: [{ required: true, trigger: "blur", message: "请填写公司邮政编号" }],
        companyLegalPersonBirthplace: [{ required: true, trigger: "blur", message: "请填写法人出生地" }],
        companyLegalPersonSign: [{ required: true, trigger: "blur", message: "请填写上传法人签名" }],
        companyLegalPersonCardAddress: [{ required: true, trigger: "blur", message: "请填写法人身份证英文地址" }],
        companyLegalPersonCard: [{ required: true, trigger: "blur", message: "请填写法人身份证/护照号码" }],
        companyLegalPersonBirthday: [
          { required: true, trigger: "change", message: "请选择法人出生日期", type: "date" },
        ],
        coRegionCode:[
          { required: true, trigger: "change", message: "请选择公司所在地区", },
        ],
        legalPersonMaritalStatus: [{ required: true, trigger: "change", message: "请选择法人婚姻状态" }],
        legalPersonSex: [{ required: true, trigger: "change", message: "请选择法人性别" }],
        needEoriNumber: [{ required: true, trigger: "change", message: "请选择是否有欧盟国EORI号" }],
        isThereEoriNumber: [{ required: true, trigger: "change", message: "请选择是否已经注册EORI号" }],
        useEntrepot: [{ required: true, trigger: "change", message: "请选择是否使用任何西班牙仓库" }],
        dredgeEuronext: [{ required: true, trigger: "change", message: "请选择是否开通泛欧" }],
        shopHref: [{ required: true, trigger: "blur", message: "请填写店铺链接" }],
        returnReceiptBox5: [{ required: true, trigger: "blur", message: "请填写BOX5金额" }],
        gbAddressPostcode: [{ required: true, trigger: "blur", message: "请填写英国地址邮编" }],
        shippingProcess: [{ required: true, trigger: "blur", message: "请填写货物进口及配送流程" }],
        companyAddressEnCountry: [{ required: true, trigger: "blur", message: "请填写公司英文国家" }],
        companyAddressEnProvince: [{ required: true, trigger: "blur", message: "请填写公司英文省" }],
        companyAddressEnCity: [{ required: true, trigger: "blur", message: "请填写公司英文市" }],
        companyAddressEn: [{ required: true, trigger: "blur", message: "请填写公司英文地址" }],
        companyCreditCode: [{ required: true, trigger: "blur", message: "请填写统一社会信用代码" }],
        legalPersonBirthplaceCountryEn: [{ required: true, trigger: "blur", message: "请填写国家" }],
        legalPersonBirthplaceProvinceZh: [{ required: true, trigger: "blur", message: "请填写省份中文" }],
        legalPersonBirthplaceProvinceEn: [{ required: true, trigger: "blur", message: "请填写省份英文" }],
        companyCitizenship: [{ required: true, trigger: "change", message: "请选择公司国籍" }],
        legalPersonBirthplaceCityZh: [{ required: true, trigger: "blur", message: "请填写法人的出生城市中文" }],
        legalPersonBirthplaceCityEn: [{ required: true, trigger: "blur", message: "请填写法人的出生城市英文" }],
        companyLegalPersonCardAddressZh: [{ required: true, trigger: "blur", message: "请填写法人身份证中文地址" }],
        companyLegalPersonCardAddressCn: [{ required: true, trigger: "blur", message: "请填写法人身份证中文地址" }],
        legalPersonPostCode: [{ required: true, trigger: "blur", message: "请填写法人出生地邮政编号" }],
        companyRegisteredCapital: [
          { required: true, trigger: "blur", message: "请输入公司注册资本（元）", type: "number" },
        ],
        companyRegisterData: [
          {
            required: true,
            trigger: "change",
            message: "请选择公司成立日期",
            type: "date",
          },
        ],
        companyEmail: [
          { required: true, trigger: "blur", message: "请填写公司邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" },
        ],
        gatewayEmail: [
          { required: true, trigger: "blur", message: "请填写Gateway  绑定邮箱" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" },
        ],
        companyTel: [{ required: true, trigger: "blur", message: "请填写公司电话" }],
        companyBusinessModeDescribe: [{ required: true, trigger: "blur", message: "请填写公司经营内容" }],
        taxEffectiveDate: [
          {
            required: true,
            trigger: "change",
            message: "选择税号生效日期",
            type: "date",
          },
        ],
        shopSalePlan: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "" || value == undefined) {
                callback(new Error("请输入预计未来12个月销售额"));
              } else {
                callback();
              }
            },
          },
        ],
        gatewayLastLoginDate: [
          {
            required: true,
            trigger: "change",
            message: "请选择最后一次登录Gateway时间",
            type: "date",
          },
        ],
        upBeginTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择开始时间",
            type: "date",
          },
        ],
        shopConsoleScreenshot: [
          {
            required: true,
            trigger: "change",
            message: "请上传后台店铺截图",
          },
        ],
        legalPersonPapers: [{ required: true, trigger: "change", message: "请上传身份证正反面" }],
        vatCertificate: [{ required: true, trigger: "change", message: "请上传VAT证书" }],
        companyCreditReport: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司信用报告",
          },
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传最后一次申报回执",
          },
        ],
        lastPayCertificate: [
          {
            required: true,
            trigger: "change",
            message: "请上传历史支付回执",
          },
        ],
        postCode: [{ required: true, validator: validateNumber }],
        vatTaxLocalFile: [{ required: true, trigger: "change", message: "请上传本地税号文件" }],
        vatTaxEuFile: [{ required: true, trigger: "change", message: "请上传欧盟税号文件" }],
        declarePeriodChangeLetter: [{ required: true, trigger: "change", message: "请上传申报周期更改信件" }],
        vatTaxFileCopy: [{ required: true, trigger: "change", message: "请上传税务副本" }],
        upEndTime: [
          {
            required: true,
            trigger: "change",
            message: "请选择结束时间",
            type: "date",
          },
        ],
        lastDeclareReceipt: [
          {
            required: true,
            trigger: "change",
            message: "请上传历史申报回执",
          },
        ],
        vatTaxNumberFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传税号文件",
          },
        ],
        companyBusinessLicense: [
          {
            required: true,
            trigger: "change",
            message: "请上传营业执照",
          },
        ],
        companyLegalPersonCardFront: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证扫描件",
          },
        ],
        companyLegalPersonCardReverse: [
          {
            required: true,
            trigger: "change",
            message: "请上传身份证扫描件",
          },
        ],
        articlesOfAssociationFile: [
          {
            required: true,
            trigger: "change",
            message: "请上传公司章程文件",
          },
        ],
        // registrationAuthorization: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     message: "请上传转代理授权书"
        //   }
        // ],
      },
      declare: [],
      status: this.$route.query.status,
      fileType: {
        companyBusinessLicense: "",
        legalPersonPapers: "",
        vatCertificate: "",
        lastDeclareReceipt: "",
        lastPayCertificate: "",
        vatTaxLocalFile: "",
        vatTaxEuFile: "",
        declarePeriodChangeLetter: "",
        vatTaxFileCopy: "",
        companyBusinessRegistrationBr: "",
        companyRegistrationCi: "",
        companyCorporateFoundingNnc1: "",
        shopConsoleScreenshot: "",
        vatTaxNumberFile: "",
        companyLegalPersonCardPassport: "",
        companyLegalPersonCardFront: "",
        companyLegalPersonCardReverse: "",
        companyCreditReport: "",
      },
      options: {
        disabledDate(date) {
          const dates = new Date(),
            nowDate = date.getDate() + 1;
          return date && date.valueOf() > Date.now() - 86400000 * nowDate;
        },
      },
      optionsDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      ischange: false,
      lenovoSearchList: [], //联想列表
      leftFrom: null,
      servicesId: this.$route.query.servicesId,
      stockGreaterThan25: "1",
      sharesList: [
        {
          shareholderZhName: "",
          shareholderEnName: "",
          position: "",
          stockProportion: "",
          shareholderBirthday: "",
          identityCard: "",
        },
      ],
      tipsModal: false,
    };
  },
  methods: {
    //公司类型change
    companyTypeChange(val) {
      if (val == "3") {
        this.formLeft.certificateType = "2";
      }
    },
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 220 + "px";
    },
    getLegalpersonCountry() {
      legalpersonCountry().then((res) => {
        if (res.code === 0) {
          this.birthplaceList = res.data;
        }
      });
    },
    getTFormEfficiency() {
      getTransformEfficiency().then((res) => {
        if (res.code == 0) {
          let list = res.data;
          list.map((item) => {
            if (item.countryCode == this.countryCode) {
              this.transformEfficiency = item.transformEfficiency;
            }
          });
        }
      });
    },
    queryRegion(){
      getRegionList().then(res=>{
        if(res.code == 0){
          this.allRegionList=res.data;
        }
      })
    },
    getInfo() {
      //获取申报周期
      baseInfoByCondition({ countryCode: this.$route.query.countryCode })
        .then((res) => {
          if (res.code == 0) {
            this.vatNumberPrefix = res.data.vatNumberPrefix;
            this.vatNumberSuffixDigitLength = res.data.vatNumberSuffixDigitLength;
            let data = res.data,
              obj = {};
            if (data.monthPeriod === 0) this.declare.push({ type: "月报", status: "0" });
            if (data.quarterPeriod === 0) this.declare.push({ type: "季报", status: "1" });
            if (data.yearPeriod === 0) this.declare.push({ type: "年报", status: "2" });
          }
        })
        .finally(() => {
          this.getFormInfo();
        });
    },
    changeVatDate(date, item) {
      // this.formLeft[item] = date;
    },
    beforeUploadHandler() {
      let self = this;
      const check = self.formLeft[this.nowFile] == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件",
        });
      }
      return check;
    },
    beforType(item) {
      this.nowFile = item;
    },
    successHandler(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传",
        });
        return false;
      }
      this.formLeft[item] = res.data.fileUrl;
      this.fileType[item] = res.data.suffix;
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件",
      });
    },
    formatErrorHandlerzip() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg, jpeg, png, gif,pdf,zip,rar格式的文件",
      });
    },
    removeHandler(file, fileList, item) {
      let self = this;
      this.formLeft[item] = "";
    },
    //提交弹窗
    clickSubmit() {
      this.$Modal.confirm({
        title: "是否确认提交",
        content:
          '<p style="text-align:left">温馨提示：提交后不可修改，不同国家转代理时效不同；请确认资料的完整性（资料不正确有可能影响时效及申报）</p>',
        cancelText: "取消",
        okText: "提交",
        onOk: () => {
          setTimeout(() => {
            this.submitForm();
          }, 100);
        },
      });
    },
    //提交验证和接口
    submitForm() {
      if (this.countryCode == "SA") {
        this.$refs.childSA.submitData();
        return;
      }
      if (this.countryCode == "AE") {
        this.$refs.childAE.submitData();
        return;
      }
      if (this.countryCode == "PL") {
        this.$refs.childPL.submitData();
        return;
      }
      if (this.countryCode == "NL") {
        this.$refs.childNL.submitData();
        return;
      }
      if (this.countryCode == "AT") {
        this.$refs.childAT.submitData();
        return;
      }
      if (this.countryCode == "CZ") {
        this.$refs.childCZ.submitData();
        return;
      }
      // console.log(data.taxEffectiveDate)
      let data = { ...this.formLeft };

      // if(this.countryCode == 'FR') {
      //   data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate,"month")
      // }else{
      data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate, "date");
      // }

      data.registerTaxDate = this.formatDate(this.formLeft.registerTaxDate, "date");
      data.gatewayLastLoginDate = this.formatDate(this.formLeft.gatewayLastLoginDate, "date");
      data.upBeginTime = this.formatDate(this.formLeft.upBeginTime, "month");
      data.upEndTime = this.formatDate(this.formLeft.upEndTime, "date");
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, "date");
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, "date");
      //转换税号
      data.vatTaxNumber = String(this.formLeft.vatTaxNumber);
      // 德国的公司所在地
      if(this.countryCode == 'DE'){
      let findRegion = this.allRegionList.find(item=>item.code == this.formLeft.coRegionCode);
        if(findRegion){
          data.coRegionName = findRegion.name;
        }
      }
      if (this.countryCode == "ES") {
        if (this.stockGreaterThan25 == "0") {
          data.companyStockCondition = JSON.stringify(this.sharesList);
        } else {
          data.companyStockCondition = "";
        }
      }
      this.$refs["formLeft"].validate(
        (valid) => {
          // console.log(data);
          if (valid) {
            this.submitLoading = true;
            if (this.countryCode == "FR") data.companyNameEn = data.companyNameEn.toUpperCase();
            submitAgentForm(data)
              .then((res) => {
                this.submitLoading = true;
                if (res.code === 0) {
                  this.$Message.success("提交成功");
                  let myDate = new Date();
                  const year = myDate.getFullYear();
                  let mounth = myDate.getMonth() + 1;
                  let day = myDate.getDate();
                  let hours = myDate.getHours();
                  let minutes = myDate.getMinutes();
                  if (mounth < 10) mounth = "0" + mounth;
                  if (day < 10) day = "0" + day;
                  if (hours < 10) hours = "0" + hours;
                  if (minutes < 10) minutes = "0" + minutes;
                  this.submitTime = year + "-" + mounth + "-" + day + " " + hours + ":" + minutes;
                  this.submitFinish = true;
                  // this.$router.push({ path: "work" });
                } else {
                  this.$Message.error("资料填写有误");
                }
              })
              .finally(() => {
                this.submitLoading = false;
              });
          } else {
            this.$Message.error("请填写完整信息");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //回到工作台
    backToHome() {
      this.$router.push({ path: "work" });
    },
    //保存
    saveForm() {
      // console.log('formLeft', this.formLeft)
      if (this.countryCode == "SA") {
        this.$refs.childSA.saveData();
        return;
      }
      if (this.countryCode == "AE") {
        this.$refs.childAE.saveData();
        return;
      }
      if (this.countryCode == "PL") {
        this.$refs.childPL.saveData();
        return;
      }
      if (this.countryCode == "NL") {
        this.$refs.childNL.saveData();
        return;
      }
      if (this.countryCode == "AT") {
        this.$refs.childAT.saveData();
        return;
      }
      if (this.countryCode == "CZ") {
        this.$refs.childCZ.saveData();
        return;
      }
      this.saveLosding = true;
      let data = { ...this.formLeft };
      // if(this.countryCode == 'FR') {
      //   data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate,"month")
      // }else{
      data.taxEffectiveDate = this.formatDate(this.formLeft.taxEffectiveDate, "date");
      // }
      if (this.countryCode == "FR" && data.companyNameEn) data.companyNameEn = data.companyNameEn.toUpperCase();
      data.registerTaxDate = this.formatDate(this.formLeft.registerTaxDate, "date");
      data.gatewayLastLoginDate = this.formatDate(this.formLeft.gatewayLastLoginDate, "date");
      data.upBeginTime = this.formatDate(this.formLeft.upBeginTime, "month");
      data.upEndTime = this.formatDate(this.formLeft.upEndTime, "date");
      data.companyLegalPersonBirthday = this.formatDate(this.formLeft.companyLegalPersonBirthday, "date");
      data.companyRegisterData = this.formatDate(this.formLeft.companyRegisterData, "date");
      //转换税号
      data.vatTaxNumber = String(this.formLeft.vatTaxNumber);
      data.orderServicesId = this.$route.query.servicesId;
      // 德国的公司所在地
      if(this.countryCode == 'DE'){
        let findRegion = this.allRegionList.find(item=>item.code == this.formLeft.coRegionCode);
          if(findRegion){
            data.coRegionName = findRegion.name;
          }
      }
      if (this.countryCode == "ES") {
        if (this.stockGreaterThan25 == "0") {
          data.companyStockCondition = JSON.stringify(this.sharesList);
        } else {
          data.companyStockCondition = "";
        }
      }
      saveAgentForm(data)
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success("保存成功");
            window.scroll(0, 0);
          }
        })
        .finally(() => {
          this.saveLosding = false;
        });
    },
    //获取
    getFormInfo() {
      getAgentForm({ servicesId: this.$route.query.servicesId }).then((res) => {
        if (res.code == 0) {
          this.leftFrom = res.data;
          if (JSON.stringify(res.data) !== "{}") {
            // console.log(res.data)
            this.formLeft = res.data;
            let data = res.data;
            this.materialAuditDate = res.data.materialAuditDate;
            // this.materialAuditDate = this.materialAuditDate.split(' ')
            // this.materialAuditDate = this.materialAuditDate[0]
            this.submitMaterialTime = res.data.submitMaterialTime;
            // this.submitMaterialTime = this.submitMaterialTime.split(' ')
            // this.submitMaterialTime = this.submitMaterialTime[0]
            this.formLeft.declarePeriod = String(res.data.declarePeriod);
            this.formLeft.legalPersonMaritalStatus = String(res.data.legalPersonMaritalStatus);
            this.formLeft.legalPersonSex = String(res.data.legalPersonSex);
            this.formLeft.needEoriNumber = String(res.data.needEoriNumber);
            this.formLeft.isThereEoriNumber = String(res.data.isThereEoriNumber);
            this.formLeft.useEntrepot = String(res.data.useEntrepot);
            this.formLeft.companyType = String(res.data.companyType);
            this.formLeft.declareRule = String(res.data.declareRule);
            this.formLeft.taxRate = String(res.data.taxRate);
            this.formLeft.dredgeEuronext = String(res.data.dredgeEuronext);
            this.formLeft.certificateType = String(res.data.certificateType);
            this.formLeft.companyLegalPersonMaritalStatus = String(res.data.companyLegalPersonMaritalStatus);
            this.formLeft.taxEffectiveDate = res.data.taxEffectiveDate.slice(0, 10);

            this.formLeft.vatTaxNumber = data.vatTaxNumber;

            if (JSON.stringify(res.data) != "{}") {
              if (this.countryCode == "ES") {
                if (res.data.companyStockCondition != "") {
                  this.stockGreaterThan25 = "0";
                  this.sharesList = JSON.parse(res.data.companyStockCondition);
                }
              }
            }
            this.fileType = {
              companyBusinessLicense: this.getFileType(data.companyBusinessLicense),
              legalPersonPapers: this.getFileType(data.legalPersonPapers),
              vatCertificate: this.getFileType(data.vatCertificate),
              lastDeclareReceipt: this.getFileType(data.lastDeclareReceipt),
              lastPayCertificate: this.getFileType(data.lastPayCertificate),
              vatTaxLocalFile: this.getFileType(data.vatTaxLocalFile),
              vatTaxEuFile: this.getFileType(data.vatTaxEuFile),
              declarePeriodChangeLetter: this.getFileType(data.declarePeriodChangeLetter),
              vatTaxFileCopy: this.getFileType(data.vatTaxFileCopy),
              companyBusinessRegistrationBr: this.getFileType(data.companyBusinessRegistrationBr),
              companyRegistrationCi: this.getFileType(data.companyRegistrationCi),
              companyCorporateFoundingNnc1: this.getFileType(data.companyCorporateFoundingNnc1),
              vatTaxNumberFile: this.getFileType(data.vatTaxNumberFile),
              shopConsoleScreenshot: this.getFileType(data.shopConsoleScreenshot),
              companyLegalPersonCardPassport: this.getFileType(data.companyLegalPersonCardPassport),
              companyLegalPersonCardFront: this.getFileType(data.companyLegalPersonCardFront),
              companyLegalPersonCardReverse: this.getFileType(data.companyLegalPersonCardReverse),
              companyCreditReport: this.getFileType(data.companyCreditReport),
            };
          }
        }
      });
    },
    getFileType(filePath) {
      let startIndex = filePath.lastIndexOf(".");
      if (startIndex != -1) return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
      else return "";
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
        } else if (type == "date") return y + "-" + m + "-" + d + " 00:00:00";
      } else {
        return date;
      }
    },
    /**
     * 输入身份证，解析出生日
     */
    /**
     * 通过身份证获取出生日期及性别
     * @param idCard 15/18位身份证号码
     * @return JSON对象
     *         sex：0-女、1-男；
     *         birthDay：yyyy-MM-dd
     */
    getBirthdayAndSex(idCard) {
      var info = {};
      var birth = idCard.length === 18 ? idCard.slice(6, 14) : idCard.slice(6, 12);
      // 18位：提取第17位数字；15位：提取最后一位数字
      var order = idCard.length == 18 ? idCard.slice(-2, -1) : idCard.slice(-1);
      info.birthDay =
        idCard.length === 18
          ? [birth.slice(0, 4), birth.slice(4, 6), birth.slice(-2)].join("-")
          : ["19" + birth.slice(0, 2), birth.slice(2, 4), birth.slice(-2)].join("-");
      // 余数为0代表女性，不为0代表男性
      info.sex = order % 2 === 0 ? 0 : 1;
      return info;
    },
    appendCompanyBirthday() {
      let idCard = this.formLeft.companyLegalPersonCard;
      // 身份证号验证通过才会填充法人出生日期字段
      if (
        /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(
          idCard
        )
      ) {
        // 412824199201122211
        let personInfo = this.getBirthdayAndSex(idCard);
        console.log(personInfo);
        this.formLeft.companyLegalPersonBirthday = personInfo.birthDay;
      }
    },

    // 公司资料信息自动填充
    automaticInformationFilling() {
      getAllServiceCompanies()
        .then((res) => {
          if (res.code === 0) {
            this.lenovoSearchList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectCompany: Throttle(function (obj) {
      let that = this;
      getCompanyInformation({
        companyName: obj,
      })
        .then((res) => {
          if (res.code === 0) {
            if (JSON.stringify(res.data) !== "{}") {
              for (const key in res.data) {
                if (res.data.hasOwnProperty(key) && that.formLeft.hasOwnProperty(key)) {
                  that.formLeft[key] = res.data[key];
                }
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }),
    // 生成二维码
    qrcode() {
      let servicesId = this.$route.query.servicesId;
      getCompanyLegalPersonSignUrl({
        servicesId: servicesId,
      })
        .then((res) => {
          if (res.code === 0) {
            let qrcode = new QRCode("qrcode", {
              width: 144,
              height: 144,
              text: res.data, // 二维码地址
              colorDark: "#000",
              colorLight: "#fff",
            });
          }
        })
        .catch((error) => {
          console.log(res);
        });
    },
    // 我已签名
    hasSignature: Throttle(function () {
      getCompanyLegalPersonSign({
        servicesId: this.$route.query.servicesId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success("刷新成功");
            this.formLeft.companyLegalPersonSign = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000),
    //沙特提交成功
    submitsuccessSA(timestamp) {
      this.$router.replace({
        path: "/submitSuccess",
        query: {
          countryCode: this.countryCode,
          countryNameZh: this.countryNameZh,
          timestamp: timestamp,
          productFunctionCode: "2",
        },
      });
    },
    backTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      const that = this;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    },
  },
  mounted() {
    this.getHeight();
    this.getInfo();
    if (this.status != 28 && this.status != 32) {
      this.ischange = true;
    }
    this.automaticInformationFilling();
    if (
      this.countryCode == "GB" ||
      this.countryCode == "DE" ||
      this.countryCode == "ES" ||
      (this.countryCode == "IT" && this.productId == 35)
    )
      this.qrcode();
    window.addEventListener("scroll", this.scrollToTop);
    if (this.status == 32) this.tipsModal = true;
    this.getTFormEfficiency();
    this.getLegalpersonCountry();
    this.queryRegion();
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-form-item-content {
  line-height: 21px;
}
.top-speed {
  text-align: center;
  p {
    margin: 0 auto;
    position: relative;
    width: 642px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    .status1 {
      position: absolute;
      top: 27px;
      left: 102px;
    }
    .status2 {
      position: absolute;
      top: 27px;
      left: 364px;
    }
  }
}
.submit-finish {
  margin: 24px;
  background-color: #fff;
  .main {
    text-align: center;
    padding: 50px;
    .gongzhonghao {
      width: 730px;
      background-color: rgba(22, 173, 233, 0.1);
      padding: 24px;
      margin: 32px auto;
      .vat-jindu {
        font-size: 14px;
        font-family: PingFangSC;
        color: #333333;
        line-height: 20px;
        margin-bottom: 12px;
      }
    }
    .tip-success {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
      margin-top: 25px;
    }
    .submit-time {
      font-size: 12px;
      font-family: PingFangSC;
      color: #333333;
      line-height: 17px;
      margin-top: 17px;
    }
    .caokao-time {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ed3e3e;
      margin-top: 8px;
      margin-bottom: 24px;
    }
  }
}
.title {
  font-size: 20px;
  font-weight: 700;
  margin-top: 16px;
  padding-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  span.smallTitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin-left: 10px;
    font-weight: 400;
  }
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
.top {
  min-width: 1024px;
  background-color: #fff;
  padding: 20px 0 0 32px;
  font-size: 14px;
  /deep/ .ivu-breadcrumb {
    font-size: 14px !important;
  }
  .top-reason {
    margin-top: 20px;
    padding: 11px 21px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    background: #fff1dd;
    span {
      color: rgba(250, 85, 85, 1);
    }
    img {
      position: relative;
      top: 3px;
    }
  }
  .tabTitle {
    border-bottom: 1px solid #e9e9e9ff;
    margin-top: 10px;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      font-family: PingFangSC;
      color: #333333;
      line-height: 40px;
      margin-right: 46px;
      cursor: pointer;
    }
    .active-tab {
      color: #1890ffff;
      border-bottom: 2px solid #1890ffff;
      font-weight: 600;
    }
  }
}
.top-tip {
  padding-bottom: 18px;
  padding-right: 32px;
  background-color: #fff;
  border-radius: 4px;
  .wramTip {
    font-size: 14px;
    padding: 10px;
    background-color: rgba(22, 173, 233, 0.19);
    color: #333;
    cursor: pointer;
    img {
      position: relative;
      top: 4px;
    }
    span {
      color: #1890ff;
    }
  }
}
.container {
  margin: 24px;
  border-radius: 4px;
  font-size: 14px;
  .formstyle {
    margin-top: 20px;
    .form {
      padding: 0 32px 32px 32px;
      .flex-item {
        display: flex;
        justify-content: space-between;
      }
      .top-lable {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        margin-bottom: 8px;
        span {
          color: #fa5555;
          margin-right: 4px;
        }
      }
    }
    div.inner {
      width: 294px;
      height: 32px;
      font-size: 14px;
      text-align: center;
      color: #fff;
      border-radius: 2px;
      background: #16ade9;
      cursor: pointer;
      .uplad-symbol {
        margin-top: 30px;
      }
      .main-text {
        font-size: 12px;
        line-height: 24px;
      }
    }
    .upload-file-box {
      display: inline-block;
      // margin-right: 14px;
      .inner.DE {
        color: #999999;
        p {
          font-size: 44px;
          font-family: auto;
          font-weight: 100;
          margin-top: 16px;
          margin-bottom: 4px;
        }
      }
      .example-name {
        font-size: 12px;
        color: #16ade9;
        text-align: center;
        cursor: pointer;
      }
    }
    .out-img-box {
      // display: inline-block;
      // margin-right: 20px;
      vertical-align: top;
      width: 100px;
    }
    .inner.img-box {
      position: relative;
      overflow: hidden;
      display: inline-block;
      // margin-right: 20px;
      vertical-align: top;
      img {
        width: 100%;
        // height: auto;
        overflow: hidden;
      }
      // .deletBtn {
      //   position: absolute;
      //   bottom: 10px;
      //   left: 22px;
      //   display: none;
      // }
      .show-pdf {
        // display: inline-block;
        // color: #313233;
        font-size: 14px;
        // margin-top: 24px;
      }
    }
    // .inner.img-box:hover .deletBtn {
    //   display: block;
    // }
    .corres-name {
      font-size: 12px;
      width: 100px;
      text-align: center;
      color: #666666;
      margin-top: 6px;
      line-height: 18px;
    }
    .gateway-style {
      margin-left: 32px;
      font-size: 16px;
      font-family: PingFangSC;
      color: #333333;
      span {
        color: #16ade9;
        cursor: pointer;
      }
    }
    .upload-tip {
      font-size: 14px;
      color: #fbb73c;
      vertical-align: bottom;
      // margin-top: 20px;
    }
    .explame-out {
      display: inline-block;
      vertical-align: bottom;
      margin-left: 8px;
      font-size: 12px;
    }
    .explame {
      color: #16ade9;
      cursor: pointer;
      img {
        position: relative;
        top: 4px;
      }
    }
  }
  /deep/ .stepH {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .ivu-form-item-content {
      margin-left: 0;
    }
    .ivu-form-item {
      // width: 30%;
    }
  }
}
.aging-box {
  margin: 0 28px;
  font-size: 18px;
  line-height: 40px;
  padding-bottom: 30px;
  .aging-country {
    color: #16ade9;
    font-weight: 700;
  }
  .remark {
    color: #aaaaaa;
  }
  .example-modal {
    img {
      width: 100%;
    }
  }
}
.gateway-box {
  padding: 0 20px 25px 20px;
  p {
    margin: 15px 0;
  }
}
.btn-box {
  text-align: center;

  // position: fixed;
  // left: 0px;
  // bottom: 0px;
  // width: 100%;
  // background: #ffffff;
  // padding: 20px;
  // box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.04);
  // z-index: 11;
  padding-bottom: 24px;
  button {
    width: 88px;
    margin-right: 15px;
  }
}
.legalPersonSignature {
  // padding: 0px 100px 50px;
  .titleSign {
    font-size: 18px;
    margin-bottom: 28px;
    font-weight: 700;
    color: #333;
    height: 55px;
    background: rgba(24, 144, 255, 0.19);
    line-height: 55px;
    padding-left: 32px;
    border-radius: 4px 4px 0px 0px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .signContent {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    padding-left: 32px !important;
    padding-bottom: 32px !important;
    @media (min-width: 1920px) {
      padding-left: 32px !important;
    }
  }
  .signature {
    background: #f2f2f2;
    width: 368px;
    height: 144px;
    display: inline-block;
    margin-left: 8px;
    position: relative;
    border: 1px solid #d9d9d9;
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
    bottom: -28px;
    width: 144px;
    font-size: 12px;
    color: #333;
    text-align: center;
    font-weight: 600;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
/deep/ .legalPersonSignatureBox {
  .ivu-form-item-content {
    margin-left: 0px !important;
    line-height: 18px !important;
  }
  .ivu-form-item-error-tip {
    left: 8% !important;
  }
}
/deep/ .ivu-form-item-error-tip {
  // @media (min-width: 1920px) {
  //   left: 155px !important;
  // }
  // width: 300px;
}
&/deep/ .ivu-select-dropdown-list {
  max-height: 300px;
}
/deep/ .ivu-input-prefix,
.ivu-input-suffix {
  top: 8px;
}
/deep/ .ivu-input-wrapper {
  // width: 294px;
}
/deep/ .ivu-select {
  width: 294px;
}
/deep/ .ivu-upload {
  display: inline-block;
}
/deep/ .ivu-modal-header-inner {
  font-weight: 700;
}
/deep/ .ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text.ivu-date-picker-editor {
  // width: 124px;
}
/deep/ .ivu-radio-checked .ivu-radio-inner {
  background-color: #fff !important;
}
&/deep/ .ivu-radio-inner:after {
  width: 8px;
  height: 8px;
  left: 3px;
  top: 3px;
  background-color: #2d8cf0 !important;
}
/deep/ .tax-date .ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text.ivu-date-picker-editor {
  width: 294px;
}
/deep/ .ivu-divider-horizontal {
  margin: 16px 0 40px 0;
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
/deep/ .ivu-form .ivu-form-item-label {
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  @media (min-width: 1920px) {
    width: 300px !important;
  }
}

.agentClass {
  .big-row {
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 24px;
  }
  .typeTitle {
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    border-bottom: none;
    padding-bottom: 10px;
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
  /deep/ .ivu-upload {
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    .inner {
      // width: 100%;
      // height: 100%;
      // background: #f4f5f6;
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
        margin-bottom: 14px;
        margin-top: 0px !important;
      }
      .main-text {
        position: absolute;
        bottom: 10px;
      }
    }
    .corres-name {
      width: 100%;
    }
  }
  /deep/ .ivu-form-item-content {
    .addressEn {
      textarea.ivu-input {
        @media (min-width: 1920px) {
          // margin-left: 151px;
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
      .img-box {
        background-color: #fff;
        position: relative;
        text-align: center;
        .show-pdf {
          color: #16ade9;
          line-height: 34px;
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
  }
  /deep/ .fileClass {
    .ivu-form-item-label {
      text-align: left;
      width: 200px !important;
    }
    .ivu-form-item-content {
      margin-left: 0px !important;
      // line-height: 18px !important;
    }
    .expand {
      margin: 20px 0;
      font-size: 16px;
      font-family: "Noto Sans S Chinese";
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      max-width: 300px;
      text-align: left;
      color: #666666;
      font-weight: bold;
      margin-left: -20px;
    }
  }
}
.up {
  background: #1890ff;
  position: fixed;
  width: 42px;
  height: 58px;
  right: 0px;
  bottom: 131px;
  display: flex;
  padding: 7px;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /deep/ .ivu-tooltip-popper {
    top: 12px !important;
    left: -93px !important;
  }
  /deep/ .ivu-tooltip-rel {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  span {
    font-size: 14px;
    color: #ffffff;
  }
  img {
    width: 20px;
    height: 20px;
    margin-bottom: 3px;
  }
}
.redTip::before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 14px;
  color: #ed4014;
}
.tipsModal-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
.tipsModal-contnet {
  font-size: 18px;
  .tip-title {
    color: #d9001b;
    margin-bottom: 18px;
  }
}
</style>
