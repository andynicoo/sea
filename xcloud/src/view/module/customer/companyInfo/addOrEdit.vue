<template>
  <div class="app-container">
    <div class="header-container" style="padding-left: 24px">
      <el-link :underline="false" type="info" @click="cancel"><i class="el-icon-arrow-left"></i> 编辑 </el-link>
      <div class="tittle">
        <h3 class="text-default"><el-divider direction="vertical"></el-divider>客户信息</h3>
      </div>
      <el-form :model="companyInfo" ref="customInfo" :rules="rules" label-width="140px" class="el-form">
        <div class="form-block">
          <el-form-item label="客户手机号" prop="userMobile">
            <el-input v-model="companyInfo.userMobile" style="width: 300px" @blur="customersMobileBlur" @change="companyInfo.companyNameZh = ''" />
          </el-form-item>
          <el-form-item label="客户名称" prop="custUserName">
            <el-input v-model="companyInfo.custUserName" style="width: 300px" disabled />
          </el-form-item>
        </div>
      </el-form>

      <el-tabs v-model="activeName">
        <el-tab-pane label="公司信息" name="companyInfo">
          <el-form :model="companyInfo" ref="companyInfo" :rules="rules" label-width="140px" class="el-form">
            <div class="form-block">
              <el-form-item label="公司中文名称" prop="companyNameZh">
                <el-input v-model="companyInfo.companyNameZh" style="width: 300px" @blur="companyNameZhBlur" />
              </el-form-item>
              <el-form-item label="公司英文名称" prop="companyNameEn">
                <el-input v-model="companyInfo.companyNameEn" style="width: 300px" />
              </el-form-item>
              <el-form-item label="统一信用代码" prop="companyCreditCode">
                <el-input v-model="companyInfo.companyCreditCode" style="width: 300px" />
              </el-form-item>
              <el-form-item label="公司邮箱" prop="companyEmail">
                <el-input v-model="companyInfo.companyEmail" style="width: 300px" />
              </el-form-item>
              <el-form-item label="联系人" prop="contactPerson" :rules="[{ required: true, message: '请输入联系人', trigger: 'blur' }]">
                <el-input v-model="companyInfo.contactPerson" style="width: 300px" />
              </el-form-item>
              <el-form-item label="公司成立日期" prop="companyRegisterData">
                <el-date-picker v-model="companyInfo.companyRegisterData" :picker-options="pickerOptions" type="date" align="right" size="small" clearable unlink-panels value-format="yyyy-MM-dd" style="width: 300px"> </el-date-picker>
              </el-form-item>
              <el-form-item label="联系方式" prop="companyTel" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
                <el-input v-model="companyInfo.companyTel" style="width: 300px" />
              </el-form-item>
              <el-form-item label="公司所在地区" prop="coRegionCode" >
                <el-select style="width: 300px" v-model="companyInfo.coRegionCode" filterable>
                  <el-option :value="region.regionCode" :label="region.regionName" v-for="region in regionList" :key="region.regionCode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公司中文地址" prop="companyAddressZh" :rules="[{ required: true, message: '请输入公司中文地址', trigger: 'blur' }]">
                <el-input v-model="companyInfo.companyAddressZh" style="width: 300px" placeholder="请输入公司中文地址" />
              </el-form-item>
              <el-form-item label="公司网址" prop="companySite">
                <el-input v-model="companyInfo.companySite" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="国家/省/市">
                <el-select style="width: 168px; margin-right: 10px" v-model="companyInfo.companyAddrCountryId" placeholder="国家" filterable @change="countryChange">
                  <el-option :value="country.id" :label="country.name" v-for="country in countryList" :key="country.id"></el-option>
                </el-select>
                <el-select style="width: 168px; margin-right: 10px" v-model="companyInfo.companyAddrProvinceId" placeholder="省" filterable @change="provinceChange">
                  <el-option :value="province.id" :label="province.name" v-for="province in provinceList" :key="province.id"></el-option>
                </el-select>
                <el-select style="width: 168px" v-model="companyInfo.companyAddrCityId" placeholder="市" filterable>
                  <el-option :value="city.id" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="one-line-item" label="公司英文地址">
                <el-input v-model="companyInfo.companyAddressEnCountry" style="width: 168px" placeholder="如:China" />
                <el-input v-model="companyInfo.companyAddressEnCity" style="width: 168px; margin-left: 20px" placeholder="如：ShenZhen" />
                <el-input v-model="companyInfo.companyAddressEn" style="width: 168px; margin-left: 20px" placeholder="请输出详细地址" />
              </el-form-item>
              <el-form-item class="one-line-item" label="公司类型" prop="companyType">
                <el-radio-group v-model="companyInfo.companyType">
                  <el-radio :label="1">大陆公司</el-radio>
                  <el-radio :label="2">香港公司</el-radio>
                  <el-radio :label="3">境外公司</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 大陆公司文件 -->
              <template v-if="companyInfo.companyType === 1">
                <el-form-item class="one-line-item" label="公司营业执照" prop="companyBusinessLicense">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyBusinessLicense" />
                    <div class="img-example-wrapper" @click="showExample(example.companyBusinessLicense)">
                      <el-image :src="example.companyBusinessLicense" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="one-line-item" label="营业执照英文公证翻译件" prop="companyBusinessLicenseTranslate">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyBusinessLicenseTranslate" />
                    <div class="img-example-wrapper" @click="showExample(example.companyBusinessLicenseTranslate)">
                      <el-image :src="example.companyBusinessLicenseTranslate" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
              </template>
              <!-- 香港公司文件 -->
              <template v-if="companyInfo.companyType === 2">
                <el-form-item class="one-line-item" label="商业登记证BR扫描件" prop="companyBusinessRegistrationBr">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyBusinessRegistrationBr" />
                    <div class="img-example-wrapper" @click="showExample(example.companyBusinessRegistrationBr)">
                      <el-image :src="example.companyBusinessRegistrationBr" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="one-line-item" label="公司注册证明书CI扫描件" prop="companyRegistrationCi">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyRegistrationCi" />
                    <div class="img-example-wrapper" @click="showExample(example.companyRegistrationCi)">
                      <el-image :src="example.companyRegistrationCi" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="one-line-item" label="法团成立表格NNC1扫描件" prop="companyCorporateFoundingNnc1">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyCorporateFoundingNnc1" />
                    <div class="img-example-wrapper" @click="showExample(example.companyCorporateFoundingNnc1)">
                      <el-image :src="example.companyCorporateFoundingNnc1" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
              </template>
              <!-- 境外公司文件 -->
              <template v-if="companyInfo.companyType === 3">
                <el-form-item class="one-line-item" label="商业登记证/海外证书" prop="brScanFileOrOverseasCertificate">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.brScanFileOrOverseasCertificate" />
                    <div class="img-example-wrapper" @click="showExample(example.brScanFileOrOverseasCertificate)">
                      <el-image :src="example.brScanFileOrOverseasCertificate" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="one-line-item" label="营业执照中文和英文翻译件" prop="companyBusinessLicenseTranslateEnAndCh">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyBusinessLicenseTranslateEnAndCh" />
                    <div class="img-example-wrapper" @click="showExample(example.companyBusinessLicenseTranslateEnAndCh)">
                      <el-image :src="example.companyBusinessLicenseTranslateEnAndCh" class="img-example" />
                      <div>示例图 <i class="el-icon-zoom-in"></i></div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="one-line-item" label="公司英文章程" prop="companyConstitutionEn">
                  <div class="form-block">
                    <UploadFiles :fileList.sync="companyInfo.companyConstitutionEn" listType="text" />
                    <a :underline="false" :href="example.companyConstitutionEn" target="_blank" style="margin: 0">
                      <div class="img-example-wrapper">
                        <el-image src="http://file.itaxs.com/dev/20211227/d5d92a984ad146b78a60c97b94a2b99e.png" class="img-example" />
                        <div>示例图 <i class="el-icon-zoom-in"></i></div>
                      </div>
                    </a>
                  </div>
                </el-form-item>
              </template>
              <el-form-item class="one-line-item" label="公司的业务模式/经营内容（零售/批发）描述" prop="companyBusinessModeDescribe">
                <el-input v-model="companyInfo.companyBusinessModeDescribe" type="textarea" style="width: 360px" rows="4" />
              </el-form-item>
              <el-form-item class="one-line-item" label="状态" prop="status">
                <el-radio-group v-model="companyInfo.status">
                  <el-radio :label="1">正常</el-radio>
                  <el-radio :label="2">失效</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="法人信息" name="legalInfo">
          <el-form :model="legalInfo" ref="legalInfo" label-width="140px" class="el-form">
            <div class="form-block">
              <el-form-item label="法人中文名称" prop="companyLegalPersonZh">
                <el-input v-model="legalInfo.companyLegalPersonZh" style="width: 300px" />
              </el-form-item>
              <el-form-item label="法人英文名称" prop="companyLegalPersonEn">
                <el-input v-model="legalInfo.companyLegalPersonEn" style="width: 300px" />
              </el-form-item>
              <el-form-item label="法人电话" prop="companyLegalPersonMobile">
                <el-input v-model="legalInfo.companyLegalPersonMobile" style="width: 300px" />
              </el-form-item>
              <el-form-item label="法人联系邮箱" prop="companyLegalPersonEmail">
                <el-input v-model="legalInfo.companyLegalPersonEmail" style="width: 300px" />
              </el-form-item>
              <el-form-item label="法人出生日期" prop="companyLegalPersonBirthday">
                <el-date-picker v-model="legalInfo.companyLegalPersonBirthday" type="date" align="right" size="small" clearable unlink-panels value-format="yyyy-MM-dd" style="width: 300px"> </el-date-picker>
              </el-form-item>
              <el-form-item label="法人身份证号码" prop="companyLegalPersonCard">
                <el-input v-model="legalInfo.companyLegalPersonCard" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="法人身份证中文地址" prop="companyLegalPersonCardAddressZh">
                <el-input v-model="legalInfo.companyLegalPersonCardAddressZh" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="法人身份证英文地址" prop="companyLegalPersonCardAddressEn">
                <el-input v-model="legalInfo.companyLegalPersonCardAddressEn" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="法人出生地邮编号码" prop="companyLegalPersonBirthPostCode">
                <el-input v-model="legalInfo.companyLegalPersonBirthPostCode" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="法人身份证正面扫描件" prop="companyLegalPersonCardFront">
                <div class="form-block">
                  <UploadFiles :fileList.sync="legalInfo.companyLegalPersonCardFront" />
                  <div class="img-example-wrapper" @click="showExample(example.companyLegalPersonCardFront)">
                    <el-image :src="example.companyLegalPersonCardFront" class="img-example" />
                    <div class="text-desc">示例图 <i class="el-icon-zoom-in"></i></div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item class="one-line-item" label="法人驾驶证" prop="driverLicense">
                <div class="form-block">
                  <UploadFiles :fileList.sync="legalInfo.driverLicense" />
                  <div class="img-example-wrapper" @click="showExample(example.driverLicense)">
                    <el-image :src="example.driverLicense" class="img-example" />
                    <div>示例图 <i class="el-icon-zoom-in"></i></div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item class="one-line-item" label="法人护照扫描件" prop="companyLegalPersonCardPassport">
                <div class="form-block">
                  <UploadFiles :fileList.sync="legalInfo.companyLegalPersonCardPassport" />
                  <div class="img-example-wrapper" @click="showExample(example.companyLegalPersonCardPassport)">
                    <el-image :src="example.companyLegalPersonCardPassport" class="img-example" />
                    <div>示例图 <i class="el-icon-zoom-in"></i></div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="店铺信息" name="shopInfo">
          <el-form :model="shopInfo" ref="shopInfo" label-width="140px" class="el-form">
            <div class="form-block">
              <el-form-item class="one-line-item" label="店铺所在电商平台" prop="shopSalePlatformName">
                <el-radio-group v-model="shopInfo.shopSalePlatformName">
                  <el-radio label="亚马逊">亚马逊</el-radio>
                  <el-radio label="eBay">eBay</el-radio>
                  <el-radio label="其他">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="店铺后台链接" prop="shopHref">
                <el-input v-model="shopInfo.shopHref" style="width: 300px" placeholder="请输入店铺后台链接" />
              </el-form-item>
              <el-form-item label="邮编号码" prop="postCode">
                <el-input v-model="shopInfo.postCode" style="width: 300px" placeholder="请复制店铺后台的邮编号码" />
              </el-form-item>
              <el-form-item label="税号生效日期" prop="taxEffectiveDate">
                <el-date-picker v-model="shopInfo.taxEffectiveDate" :picker-options="pickerOptions" type="date" align="right" size="small" clearable unlink-panels value-format="yyyy-MM-dd" style="width: 300px"> </el-date-picker>
              </el-form-item>
              <el-form-item label="平台店铺名称" prop="shopName">
                <el-input v-model="shopInfo.shopName" style="width: 300px" />
              </el-form-item>
              <el-form-item class="one-line-item" label="是否有欧盟EORI号" prop="needEoriNumber">
                <el-radio-group v-model="shopInfo.needEoriNumber">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="one-line-item" label="税率" prop="shopTaxRate">
                <el-radio-group v-model="shopInfo.shopTaxRate">
                  <el-radio :label="1">低税率</el-radio>
                  <el-radio :label="2">标准税率</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="one-line-item" label="后台店铺截图" prop="shopAddressScreenshot">
                <div class="form-block">
                  <UploadFiles :fileList.sync="shopInfo.shopAddressScreenshot" />
                  <div class="img-example-wrapper" @click="showExample(example.shopAddressScreenshot)">
                    <el-image :src="example.shopAddressScreenshot" class="img-example" />
                    <div>示例图 <i class="el-icon-zoom-in"></i></div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- </el-form> -->
      <div class="btn-group">
        <el-button type="primary" @click="submit" v-show="hasAuthority('C1_12')">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
    <el-image-viewer v-if="showViewer" :on-close="() => (showViewer = false)" :url-list="[exampleImg]" />
  </div>
</template>

<script>
import UploadFiles from './components/UploadFiles';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { mapMutations } from 'vuex';
import { getUserCompanyMaterialInfo, getUserList, addUserCompanyMaterial, updateUserCompanyMaterial, getWorldCountryListByLevel, getWorldCountryListByPid, getRegionList, validateCompany } from '@/api/newApi/customer/companyInfo';
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          return time.getTime() > date.getTime();
        },
      },
      activeName: 'companyInfo',
      id: this.$route.query.id || 0,
      customer: null,
      companyInfo: {
        coRegionCode: '',
        coRegionName: '',
        companyAddrCityId: '',
        companyAddrCountryId: '',
        companyAddrProvinceId: '',
        companyAddressEn: '',
        companyAddressEnCity: '',
        companyAddressEnCountry: '',
        companyAddressZh: '',
        companyBusinessLicense: '',
        companyBusinessLicenseTranslate: '',
        companyBusinessModeDescribe: '',
        companyBusinessRegistrationBr: '',
        companyCorporateFoundingNnc1: '',
        brScanFileOrOverseasCertificate: '',
        companyBusinessLicenseTranslateEnAndCh: '',
        companyConstitutionEn: '',
        companyCreditCode: '',
        companyEmail: '',
        companyNameEn: '',
        companyNameZh: '',
        companyRegisterData: '',
        companyRegistrationCi: '',
        companySite: '',
        companyTel: '',
        companyType: 1,
        status: 1,
        userId: 0,
        userMobile: '',
        custUserName: '',
      },
      legalInfo: {
        companyLegalPersonBirthPostCode: '',
        companyLegalPersonBirthday: '',
        companyLegalPersonCard: '',
        companyLegalPersonCardAddressEn: '',
        companyLegalPersonCardAddressZh: '',
        companyLegalPersonCardFront: '',
        companyLegalPersonCardPassport: '',
        companyLegalPersonEmail: '',
        companyLegalPersonEn: '',
        companyLegalPersonMobile: '',
        companyLegalPersonZh: '',
        driverLicense: '',
      },
      shopInfo: {
        needEoriNumber: 0,
        postCode: '',
        shopAddressScreenshot: '',
        shopHref: '',
        shopName: '',
        shopSalePlatformName: '',
        shopTaxRate: 0,
        taxEffectiveDate: '',
      },
      countryList: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      rules: {
        userMobile: [{ required: true, message: '请输入客户手机号', trigger: 'blur' }],
        companyNameZh: [{ required: true, message: '请输入公司中文名称', trigger: 'blur' }],
        companyCreditCode: [{ required: true, message: '请输入统一信用代码', trigger: 'blur' }],
        companyEmail: [{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
        companyLegalPersonEmail: [{ type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
      },
      // 示例图
      example: {
        // 公司营业执照
        companyBusinessLicense: 'http://file.itaxs.com/dev/20211223/090d5b00583d4b45a8c3aa9c63d67ec9.png',
        // 营业执照英文公证翻译件
        companyBusinessLicenseTranslate: 'http://file.itaxs.com/dev/20211223/ecb28633367040589831903d625f6943.png',
        // 商业登记证BR扫描件
        companyBusinessRegistrationBr: 'http://file.itaxs.com/dev/20211223/788389708a3b4d99a2d5998c0e4932a8.png',
        // 公司注册证明书CI扫描件
        companyRegistrationCi: 'http://file.itaxs.com/dev/20211223/56f7e1ca4ad9490cbe878e161e7eab5a.png',
        // 法团成立表格NNC1扫描件
        companyCorporateFoundingNnc1: 'http://file.itaxs.com/dev/20211223/f9d5ddd1a2744fd7bb8ba5c4aba4533b.png',
        // TODO商业登记证/海外证书
        brScanFileOrOverseasCertificate: '',
        // 营业执照中文和英文翻译件
        companyBusinessLicenseTranslateEnAndCh: 'http://file.itaxs.com/dev/20211223/d2312ab4f1754e24a917775c7861c33d.png',
        // 公司英文章程
        companyConstitutionEn: 'http://file.itaxs.com/dev/20211227/007b3c9e23e84ee0b1110c7e8b6ee844.pdf',
        // 法人身份证正面扫描件
        companyLegalPersonCardFront: 'http://file.itaxs.com/dev/20211223/073593fcb1234bc3976eff4111aacb9d.png',
        // 法人驾驶证
        driverLicense: 'http://file.itaxs.com/dev/20211223/db27b0e36bec42e6ac9fb6394962f16c.png',
        // 法人护照扫描件
        companyLegalPersonCardPassport: 'http://file.itaxs.com/dev/20211223/9ec3ad2104c04228976cc049cfcb79a1.png',
        // 后台店铺截图
        shopAddressScreenshot: 'http://file.itaxs.com/dev/20211223/9f5cf6e702df427885d4505530d91992.png',
      },
      exampleImg: '',
      showViewer: false,
      companyExist: false, // 公司是否存在
    };
  },
  components: {
    UploadFiles,
    ElImageViewer,
  },
  watch: {
    customer() {
      let res = '';
      if (this.customer) {
        res = this.customer.nickname;
      }
      this.companyInfo.custUserName = res;
    },
  },
  mounted() {
    if (this.id) {
      this.getInfo();
    }
    this.getCountryList();
    this._getRegionList();
  },
  methods: {
    getInfo() {
      getUserCompanyMaterialInfo(this.id).then((res) => {
        if (res.code === 0) {
          let imageKeys = Object.keys(this.example);
          for (let key in res.data) {
            let value = res.data[key];
            if (imageKeys.includes(key)) {
              value = this.formatImage(value).join(',');
            }
            if (this.companyInfo.hasOwnProperty(key)) {
              this.companyInfo[key] = value;
            }
            if (this.legalInfo.hasOwnProperty(key)) {
              this.legalInfo[key] = value;
            }
            if (this.shopInfo.hasOwnProperty(key)) {
              this.shopInfo[key] = value;
            }
          }
          if (this.companyInfo.companyAddrCountryId) {
            this.getProvinceOrCityList(this.companyInfo.companyAddrCountryId, 'province');
          }
          if (this.companyInfo.companyAddrProvinceId) {
            this.getProvinceOrCityList(this.companyInfo.companyAddrProvinceId, 'city');
          }
          this.customer = {
            userId: this.companyInfo.userId,
            custUserName: this.companyInfo.custUserName,
          };
        }
      });
    },
    formatImage(imageList) {
      let res = [];
      if (typeof imageList === 'object') {
        res = imageList;
      } else if (imageList) {
        try {
          res = JSON.parse(imageList);
        } catch (error) {
          try {
            res = imageList.split(',');
          } catch (e) {}
        }
      }
      return res;
    },
    // 客户手机号失焦事件
    customersMobileBlur(e) {
      this.customer = null;
      if (this.companyInfo.userMobile.trim() !== '') {
        this.getUser();
      }
    },
    // 验证客户信息是否存在
    getUser() {
      getUserList({
        type: 1,
        mobile: this.companyInfo.userMobile,
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.records.length) {
            this.customer = res.data.records[0];
          } else {
            this.$message.warning('手机号输入有误/不存在当前客户，请仔细输入！');
          }
        } else {
          this.$message.warning('服务器错误！');
        }
      });
    },
    // 公司中文名称失焦事件
    companyNameZhBlur() {
      this.companyExist = false;
      if (this.companyInfo.userMobile.trim() === '') {
        this.$message.warning('请先输入客户手机号！');
        return;
      } else if (!this.customer) {
        this.$message.warning('手机号输入有误/不存在当前客户，请仔细输入！');
        return;
      }
      if (this.companyInfo.companyNameZh.trim() !== '') {
        this._validateCompany();
      }
    },
    // 验证公司是否存在
    _validateCompany() {
      validateCompany({
        companyNameZh: this.companyInfo.companyNameZh,
        userId: this.customer.userId,
        materialId: this.id,
      }).then((res) => {
        this.companyExist = res.data;
        if (res.data === true) {
          this.$message.warning('公司名称已存在，请仔细核对！');
        }
      });
    },
    // 获取国家列表
    getCountryList() {
      getWorldCountryListByLevel({
        level: 1,
      }).then((res) => {
        this.countryList = res.data;
      });
    },
    // 获取省市列表
    getProvinceOrCityList(pid, type) {
      getWorldCountryListByPid({
        pid,
      }).then((res) => {
        if (type === 'province') {
          this.provinceList = res.data;
        } else if (type === 'city') {
          this.cityList = res.data;
        }
      });
    },
    // 更改国家
    countryChange(id) {
      this.getProvinceOrCityList(id, 'province');
      this.cityList = [];
      this.companyInfo.companyAddrProvinceId = '';
      this.companyInfo.companyAddrCityId = '';
    },
    // 更改省
    provinceChange(id) {
      this.getProvinceOrCityList(id, 'city');
      this.companyInfo.companyAddrCityId = '';
    },
    // 公司所在地区列表
    _getRegionList() {
      getRegionList().then((res) => {
        this.regionList = res.data;
      });
    },
    // 处理验证
    getValidate(key) {
      return new Promise((resolve, reject) => {
        this.$refs[key].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    // 确认
    async submit() {
      if (this.companyInfo.userMobile.trim() === '') {
        this.$message.warning('请先输入客户手机号！');
        return;
      }
      if (!this.customer) {
        this.$message.warning('手机号输入有误/不存在当前客户，请仔细输入！');
        return;
      }
      if (this.companyInfo.companyNameZh && this.companyExist) {
        this.$message.warning('公司名称已存在，请仔细核对！');
        return;
      }

      const customInfo = this.getValidate('customInfo');
      const companyInfo = this.getValidate('companyInfo');
      Promise.all([customInfo, companyInfo]).then(
        (res) => {
          let data = {
            companyInfo: {
              ...this.companyInfo,
              userId: this.customer.userId,
            },
            legalInfo: this.legalInfo,
            shopInfo: this.shopInfo,
          };
          if (this.companyInfo.coRegionCode) {
            data.companyInfo.coRegionName = this.regionList.find((item) => item.regionCode === this.companyInfo.coRegionCode).regionName;
          }
          if (this.id) {
            data.companyInfo.id = this.id;
            this.update(data);
          } else {
            this.add(data);
          }
        },
        (err) => {
          this.$message.warning('请检查输入的数据');
        }
      );
    },

    // 新增
    add(data) {
      addUserCompanyMaterial(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('添加成功！');
          this.cancel();
        }
      });
    },
    // 修改
    update(data) {
      updateUserCompanyMaterial(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功！');
          this.cancel();
        }
      });
    },
    // 查看示例图
    showExample(url) {
      this.exampleImg = url;
      this.showViewer = true;
    },
    // 取消
    ...mapMutations(['closeTag']),
    cancel() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/customer/companyInfo/index',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
.btn-group {
  text-align: center;
  padding: 10px;
  border-top: 1px solid #e4e7ed;
}
::v-deep .el-tabs__content {
  height: calc(100vh - 357px);
  overflow-y: auto;
}
.form-block {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-form-item {
    flex: 0 0 35%;
  }
  .one-line-item {
    flex: 0 0 100%;
  }
  .img-example-wrapper {
    width: 168px;
    height: 168px;
    max-height: 168px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    border-radius: 2px;
    margin-left: 13px;
    color: #999999;
    .img-example {
      width: 100%;
      height: 90px;
    }
  }
}
.tittle {
  font-weight: 500;
  padding: 27px 0;
}
</style>
