<template>
  <div v-if="formItem.infoJson">
    <!-- <p class="remind-message">{{ formItem.remindMessage }}</p> -->
    <div class="upload-dragger-wrap">
      <a-upload-dragger
        class="upload-wrap"
        name="file"
        :action="ImgUrl"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :accept="handleAccepts"
        @change="handleChange"
      >
        <div v-if="!imageUrl">
          <p class="ant-upload-drag-icon">
            <img src="@comp/images/dynamicForm/upload.png" />
          </p>
          <p class="ant-upload-text">
            {{ formItem.keyLabel }}
          </p>
          <p class="ant-upload-hint">可点击，也可拖拽文件到上传框内上传</p>
        </div>
      </a-upload-dragger>
      <!-- <p v-if="isSignature" class="signature">公司章程文件中存在数字签名!</p> -->
      <div class="thumbnail" v-if="imageUrl">
        <div class="thumbnail-operate">
          <a-icon type="eye" @click="drawerOpen" /><a-icon type="delete" @click="imageDel" />
        </div>
        <embed v-if="imageUrl.includes('.pdf')" :src="imageUrl" type="application/pdf" width="100%" height="100%" />
        <img
          v-else-if="imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') || imageUrl.includes('.png')"
          :src="imageUrl"
        />
        <div class="upload-successful" v-else>
          <img src="@comp/images/dynamicForm/uploadSuccessful.png" />
          <p>上传成功</p>
        </div>
      </div>
    </div>
    <div class="example-file">
      <dl class="example-file-ul" v-if="formItem.fileModelUrl">
        <dt>示例</dt>
        <dd>
          <div class="example-fileA">
            <embed
              v-if="formItem.fileModelUrl.includes('.pdf')"
              :src="formItem.fileModelUrl"
              type="application/pdf"
              width="100%"
              height="100%"
            />
            <viewer v-else @inited="initedA" :images="[formItem.fileModelUrl]">
              <img :src="formItem.fileModelUrl" />
            </viewer>
          </div>
          <b @click="exampleFile('$viewerA', formItem.fileModelUrl)">查看示例</b>
        </dd>
        <!-- <dd>
          <div class="example-fileOr">或</div>
        </dd>
        <dd>
          <div class="example-fileB">
            <viewer @inited="initedB" :images="['https://sit2-xcloud-console.itaxs.com/bg.png']">
              <img src="https://sit2-xcloud-console.itaxs.com/bg.png" />
            </viewer>
          </div>
          <b @click="$viewerB.show()">查看示例</b>
        </dd> -->
      </dl>
      <dl class="example-file-ul" v-if="formItem.keyName === 'identityCardFront'">
        <dt>错误示例</dt>
        <dd class="error-example">
          <img src="@comp/images/dynamicForm/idcard1.png" />
          <img src="@comp/images/dynamicForm/idcard2.png" />
          <img src="@comp/images/dynamicForm/idcard3.png" />
        </dd>
      </dl>
      <dl class="example-file-ul" v-if="formItem.keyName === 'identityCardReverse'">
        <dt>错误示例</dt>
        <dd class="error-example">
          <img src="@comp/images/dynamicForm/idcard4.png" />
          <img src="@comp/images/dynamicForm/idcard5.png" />
          <img src="@comp/images/dynamicForm/idcard6.png" />
        </dd>
      </dl>
      <dl class="example-file-ul" v-if="formItem.keyName === 'companyBusinessLicense'">
        <dt>错误示例</dt>
        <dd class="error-example">
          <img src="@comp/images/dynamicForm/businesslicense1.png" />
          <img src="@comp/images/dynamicForm/businesslicense2.png" />
          <img src="@comp/images/dynamicForm/businesslicense3.png" />
        </dd>
      </dl>
    </div>
    <a-modal wrapClassName="loading-modal" :visible="loading" :closable="false" :footer="null" width="448px" centered>
      <a-spin size="large" />
      <p v-if="needOCR() && !needBackfill">文件信息加载中，请稍等</p>
      <p v-else-if="needOCR()">文件信息识别中，请稍等</p>
      <p v-else>文件上传中，请稍等</p>
    </a-modal>
    <a-drawer
      :title="`${formItem.keyLabel}信息`"
      placement="right"
      :visible="drawerVisible"
      width="520px"
      @close="drawerVisible = false"
    >
      <table class="automatic-recognition-info">
        <tr v-for="(item, index) in automaticRecognitionInfo" :key="index" v-show="item.value">
          <td class="bl-label">{{ item.label }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </table>

      <div class="ocr-describe">
        上述信息为系统根据您上传的证件智能识别生成，为确保文本和证件相符暂不支持自主修改。请注意查对上传的证件是否正确。如有疑问，<span
          onclick="easemobim.bind({configId: `16969a62-0320-44bd-b2e3-b1cae76fb523`})"
          >可咨询客服</span
        >
      </div>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button @click="drawerVisible = false"> 关闭 </a-button>
      </div>
    </a-drawer>

    <div class="preview-box" v-if="drawerVisible">
      <embed v-if="imageUrl.includes('.pdf')" :src="imageUrl" type="application/pdf" width="100%" height="100%" />
      <img ref="ocrImg" v-else :src="imageUrl" />
      <div class="viewer-toolbar" v-if="!imageUrl.includes('.pdf')">
        <ul>
          <li
            @click="rotateScaleImg('in')"
            tabindex="0"
            role="button"
            class="viewer-zoom-in"
            data-viewer-action="zoom-in"
          ></li>
          <li
            @click="rotateScaleImg('out')"
            tabindex="0"
            role="button"
            class="viewer-zoom-out"
            data-viewer-action="zoom-out"
          ></li>
          <li @click="rotateScaleImg" tabindex="0" role="button" class="viewer-reset" data-viewer-action="reset"></li>
          <li
            @click="rotateScaleImg('left')"
            tabindex="0"
            role="button"
            class="viewer-rotate-left"
            data-viewer-action="rotate-left"
          ></li>
          <li
            @click="rotateScaleImg('right')"
            tabindex="0"
            role="button"
            class="viewer-rotate-right"
            data-viewer-action="rotate-right"
          ></li>
        </ul>
      </div>
    </div>
    <viewer v-show="false" @inited="initedFile" :images="[imageUrl]">
      <img :src="imageUrl" />
    </viewer>
    <viewer v-show="false" @inited="tutorialInitedFile" :images="[tutorialUrl]">
      <img :src="tutorialUrl" />
    </viewer>
  </div>
</template>

<script>
import { clientFromOcr } from '@comp/api/taxRegister.js';
import { cloneDeep } from 'lodash';
import moment from 'moment';
export default {
  props: {
    value: { type: Array },
    formItem: { type: Object },
    fApi: { type: Object },
    workInfo: { type: Object },
    moduleListBlock: Array,
    isReject: Boolean,
  },
  data() {
    return {
      loading: false,
      imageUrl: '',
      tutorialUrl: require('@comp/images/dynamicForm/articlesOfAssociationFile.png'),
      drawerVisible: false,
      needBackfill: false, //是否需要回填信息
      isHorizontal: true, //营业执照是否是横板
      //ocr识别类型
      ocrType: {
        companyBusinessLicense: 'businessLicenseType', //营业执照
        identityCardFront: 'idCardFaceType', //身份证正面
        identityCardReverse: 'idCardBackType', //身份证反面
        storageAddressImg: 'storageType', //仓储地址截图
        vatTaxNumberFile: 'taxNumberType', //本土VAT税号文件
        vatTaxEuFile: 'taxNumberEuType', //欧盟VAT税号文件
      },
      //营业执照，身份证信息等识别字段
      automaticRecognitionInfo: [
        {
          id: 'companyNameZh',
          label: '公司中文名称',
          value: '',
        },
        {
          id: 'companyCreditCode',
          label: '社会统一信用代码',
          value: '',
        },
        {
          id: 'companyAddressZhCountry',
          label: '公司地址所属国家',
          value: '',
        },
        {
          id: 'companyAddressZhProvince',
          label: '公司地址的省份',
          value: '',
        },
        {
          id: 'companyAddressZhCity',
          label: '公司地址的城市',
          value: '',
        },
        {
          id: 'licenseRegisteredCompanyAddressZhDistrict',
          label: '公司地址的区',
          value: '',
        },
        {
          id: 'companyAddressZh',
          label: '公司的详细地址',
          value: '',
        },
        {
          id: 'licenseRegisteredCompanyPostCode',
          label: '公司地址的邮编',
          value: '',
        },
        {
          id: 'companyRegisterData',
          label: '公司注册日期',
          value: '',
        },
        {
          id: 'companyRegisteredCapitalCny',
          label: '公司注册资本',
          value: '',
        },
        {
          id: 'companyLegalPersonZh',
          label: '法人中姓名',
          value: '',
        },
        {
          id: 'companyLegalPersonCard',
          label: '法人身份证号码',
          value: '',
        },
        {
          id: 'companyLegalPersonBirthday',
          label: '法人出生日期',
          value: '',
        },
        {
          id: 'nationality',
          label: '法人民族',
          value: '',
        },
        {
          id: 'legalPersonSex',
          label: '法人性别',
          value: '',
        },
        {
          id: 'personCardAddressCountryZh',
          label: '身份证地址国家',
          value: '',
        },
        {
          id: 'personCardAddressProvinceZh',
          label: '身份证地址省份',
          value: '',
        },
        {
          id: 'personCardAddressCityZh',
          label: '身份证地址城市',
          value: '',
        },
        {
          id: 'personCardAddressZh',
          label: '身份证详细地址',
          value: '',
        },
        {
          id: 'legalPersonPostCode',
          label: '身份证地址邮编',
          value: '',
        },
        {
          id: 'idCardValidityPeriod',
          label: '身份证有效期限',
          value: '',
        },
        {
          id: 'vatTaxNumber',
          label: '本土VAT税号',
          value: '',
        },
        {
          id: 'vatTaxEuNumber',
          label: '欧盟VAT税号',
          value: '',
        },
      ],
      isSignature: false, //公司章程是否有数字签名
      countryCode: '',
      companyLegalPersonEn: '',
      rotateVal: 0,
      scaleVal: 1,
    };
  },

  mounted() {
    if (['vatTaxNumberFile', 'vatTaxEuFile'].includes(this.formItem.keyName)) {
      this.countryCode = 'DE';
    }
    if (!['[]', '{}'].includes(JSON.stringify(this.value))) {
      this.imageUrl = this.value[0];
    }
  },
  computed: {
    //上传文件类型处理
    handleAccepts() {
      let accArr = this.formItem.infoJson.accepts.map((item) => '.' + item);
      return accArr.join();
    },
  },
  methods: {
    //旋转放大缩小图
    rotateScaleImg(key) {
      if (key === 'right') {
        this.rotateVal += 90;
      } else if (key === 'left') {
        this.rotateVal -= 90;
      } else if (key === 'in') {
        this.scaleVal += 0.1;
      } else if (key === 'out') {
        this.scaleVal -= 0.1;
      } else {
        this.rotateVal = 0;
        this.scaleVal = 1;
      }
      this.$refs.ocrImg.style.transform = `rotate(${this.rotateVal}deg) scale(${this.scaleVal})`;
    },
    //初始化查看示例A
    initedA(viewer) {
      this.$viewerA = viewer;
    },
    //初始化公司章程教程
    tutorialInitedFile(viewer) {
      this.$tutorialInitedFile = viewer;
    },

    //初始化查看示例B
    // initedB(viewer) {
    //   this.$viewerB = viewer;
    // },
    //初始化查看上传文件
    initedFile(viewer) {
      this.$initedFile = viewer;
    },
    //点击查看示例
    exampleFile(key, url) {
      if (url.includes('.pdf')) {
        window.open(url);
      } else {
        this[key].show();
      }
    },
    //需要OCR
    needOCR() {
      let isOpen = false;
      if (this.formItem.keyName === 'companyBusinessLicense' && Number(this.fApi.getValue('companyType')) === 1) {
        isOpen = true;
      } else if (
        ['identityCardFront', 'identityCardReverse'].includes(this.formItem.keyName) &&
        Number(this.fApi.getValue('certificateType')) === 1
      ) {
        isOpen = true;
      } else if (['vatTaxNumberFile'].includes(this.formItem.keyName)) {
        isOpen = true;
      } else if (['vatTaxEuFile'].includes(this.formItem.keyName)) {
        isOpen = true;
      }
      return isOpen;
    },
    //上传成功处理
    handleChange(info) {
      if (info.file.status === 'uploading') {
        if (this.needOCR()) {
          this.needBackfill = true;
        }
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        if (!this.isSignature) {
          this.imageUrl = info.file.response.data.fileUrl;
        }
        this.fApi.clearValidateState(this.formItem.keyName);
        if (this.needOCR()) {
          this.OCR();
        } else {
          if (!this.isSignature) {
            this.$emit('input', [this.imageUrl]);
            this.$message.success(`${this.formItem.keyLabel}上传成功!`);
          }
          this.loading = false;
        }
      }
    },
    //上传前的校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      let reader = new FileReader();
      let _this = this;
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        let data = e.target.result;
        let image = new Image();
        image.src = data;
        image.onload = function() {
          _this.isHorizontal = image.height - image.width < 10;
        };
      };
      if (!isLt2M) {
        this.$message.error('文件不能大于20M!');
      }
      if (this.formItem.keyName === 'articlesOfAssociationFile' && file.type === 'application/pdf') {
        this.PDFsignature(file);
      }
      return isLt2M;
    },
    // 检查PDF文件中是否存在数字签名
    PDFsignature(file) {
      this.isSignature = false;
      let formData = new FormData();
      formData.append('file', file);
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open('post', this.baseUrl + '/workorder/management/files_handle/signatures', true);
      // 设置请求token
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'));
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'));
      // 返回
      let _this = this;
      xmlResquest.onload = function(oEvent) {
        let content = xmlResquest.response;
        if (JSON.parse(content).data) {
          _this.isSignature = true;
          // _this.$message.error(
          //   '您上传的公司章程中含有数字签名，系统无法压缩文件。请查看下方教程，将原文件转换为副本，并上传副本文件!'
          // );

          _this.loading = false;
          _this.$confirm({
            title:
              '您上传的公司章程中含有数字签名，系统无法压缩文件。请查看下方教程，将原文件转换为副本，并上传副本文件',
            okText: '查看教程',
            cancelText: '知道了,重新上传',
            onOk() {
              _this.$tutorialInitedFile.show();
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      };
      xmlResquest.send(formData);
    },
    //OCR识别
    OCR() {
      clientFromOcr({
        type: this.ocrType[this.formItem.keyName],
        sourceUri: this.imageUrl,
        country: this.countryCode,
      })
        .then((res) => {
          if (res.code === 0) {
            if (res.data.ok) {
              this.$emit('input', [this.imageUrl]);
              this.loading = false;
              this.drawerVisible = true;
              this.automaticBackfill(res.data);
              this.setCompanyLegalPersonEn(res.data.companyLegalPersonEn);
              this.$message.success(`${this.formItem.keyLabel}上传成功!`);

              if (
                ['identityCardFront'].includes(this.formItem.keyName) ||
                (this.isReject && ['identityCardFront', 'companyBusinessLicense'].includes(this.formItem.keyName))
              ) {
                this.validateIdentityCardFront();
              }
              if (this.formItem.keyName === 'identityCardReverse') {
                this.validatedate('idCardValidityPeriod', '身份证');
              } else if (this.formItem.keyName === 'companyBusinessLicense') {
                this.validatedate('licenseBusinessPeriod', '营业执照');
              }
            } else {
              this.VATnumber();
              if (!['vatTaxNumberFile', 'vatTaxEuFile'].includes(this.formItem.keyName)) {
                this.$message.error(res.data.message || '文件内容识别失败请重新上传!', 6);
              }
            }
          } else {
            this.VATnumber();
          }
        })
        .catch((e) => {
          this.VATnumber();
        });
    },
    // 验证身份证正面
    validateIdentityCardFront() {
      let validateNameIsSame = (rule, value, callback) => {
        let licenseRegisteredLegalPersonZh = '';
        if (this.isReject) {
          licenseRegisteredLegalPersonZh = this.fApi.getValue('licenseRegisteredLegalPersonZh');
        } else {
          licenseRegisteredLegalPersonZh = this.moduleListBlock[0].fApi.getValue('licenseRegisteredLegalPersonZh');
        }
        let companyLegalPersonZh = this.fApi.getValue('companyLegalPersonZh');
        if (
          licenseRegisteredLegalPersonZh &&
          companyLegalPersonZh &&
          licenseRegisteredLegalPersonZh !== companyLegalPersonZh
        ) {
          return callback(new Error('身份证中文姓名和营业执照法人中文姓名要一致！'));
        } else {
          callback();
        }
      };
      let validator = [
        {
          validator: validateNameIsSame,
        },
      ];
      this.fApi.updateValidate(this.formItem.keyName, validator, true);
      this.$nextTick(() => {
        this.fApi.validateField(this.formItem.keyName);
      });
    },
    // 验证日期（营业执照、身份证背面）
    validatedate(key, name) {
      let validate = (rule, value, callback) => {
        let date = this.fApi.getValue(key);
        let days = moment(date[1]).diff(moment(new Date()), 'days');
        if (days < 90) {
          return callback(new Error(`${name}有效期需要大于90天！`));
        } else {
          callback();
        }
      };
      let validator = [
        {
          validator: validate,
        },
      ];
      this.fApi.updateValidate(this.formItem.keyName, validator, true);
      this.$nextTick(() => {
        this.fApi.validateField(this.formItem.keyName);
      });
    },
    //允许税号识别不到
    VATnumber() {
      if (['vatTaxNumberFile', 'vatTaxEuFile'].includes(this.formItem.keyName)) {
        this.$emit('input', [this.imageUrl]);
      } else {
        this.imageUrl = '';
      }
      this.loading = false;
    },
    //自动识别回填信息
    automaticBackfill(data) {
      if (this.needBackfill) {
        let dataHandle = cloneDeep(data);
        if (dataHandle.legalPersonSex) {
          dataHandle.legalPersonSex = dataHandle.legalPersonSex === '男' ? '1' : '2';
        }
        if (dataHandle.companyRegisterData) {
          let registerData = dataHandle.companyRegisterData.replace(/['年'|'月']/g, '-');
          registerData = registerData.replace(/['日']/g, '  00:00:00');
          dataHandle.companyRegisterData = registerData;
        }
        if (dataHandle.idCardValidityPeriod) {
          dataHandle.idCardValidityPeriod = dataHandle.idCardValidityPeriod.split('-');
        }
        if (dataHandle.licenseBusinessPeriod) {
          dataHandle.licenseBusinessPeriod = dataHandle.licenseBusinessPeriod.split('-');
        }

        //营业执照类型
        if (this.formItem.keyName === 'companyBusinessLicense') {
          this.fApi.setValue({ companyBusinessLicenseType: this.isHorizontal ? '0' : '1' });
        }
        this.fApi.setValue({
          ...dataHandle,
          personCardAddressCountryZh: 'CN',
        });
      }
      Object.keys(data).forEach((key) => {
        this.automaticRecognitionInfo.forEach((item) => {
          if (key === item.id) {
            item.value = data[key];
          }
        });
      });
    },
    //查看上传文件
    drawerOpen() {
      if (this.needOCR()) {
        this.needBackfill = false;
        this.loading = true;
        this.OCR();
      } else {
        if (this.imageUrl.includes('.jpg') || this.imageUrl.includes('.jpeg') || this.imageUrl.includes('.png')) {
          this.$initedFile.show();
        } else {
          window.open(this.imageUrl);
        }
      }
    },
    //删除上传文件
    imageDel() {
      if (this.needOCR()) {
        this.$confirm({
          title: `删除当前${this.formItem.keyLabel}，会同步清空当前自动识别的${this.formItem.keyLabel}信息，确认删除吗？`,
          centered: true,
          onOk: () => {
            this.imageUrl = '';
            this.$emit('input', []);
            this.setCompanyLegalPersonEn('');
            this.clearIdentificationFields();
          },
        });
      } else {
        this.isSignature = false;
        this.imageUrl = '';
        this.$emit('input', []);
        this.setCompanyLegalPersonEn('');
      }
    },
    setCompanyLegalPersonEn(val) {
      if (this.formItem.keyName === 'identityCardFront') {
        this.companyLegalPersonEn = val;
        let el = this.fApi.el('companyLegalPersonSign');
        el.$set(el, 'userName', val.replaceAll(' ', '%20'));
        el.updateSignCode();
      }
    },
    //清除识别字段
    clearIdentificationFields() {
      if (this.formItem.keyName === 'companyBusinessLicense' && Number(this.fApi.getValue('companyType')) === 1) {
        this.fApi.setValue({
          companyBusinessLicenseType: '',
          companyCreditCode: '',
          companyNameZh: '',
          licenseRegisteredCompanyNameEn: '',
          licenseRegisteredLegalPersonZh: '',
          licenseRegisteredLegalPersonLastname: '',
          licenseRegisteredLegalPersonFirstname: '',
          companyRegisteredCapital: '',
          companyRegisterData: '',
          licenseBusinessPeriod: '',
          companyAddressZhCountry: '',
          companyAddressEnCountry: '',
          companyAddressZhProvince: '',
          companyAddressEnProvince: '',
          companyAddressZhCity: '',
          companyRegisteredCityEn: '',
          licenseRegisteredCompanyAddressZhDistrict: '',
          licenseRegisteredCompanyAddressEnDistrict: '',
          companyAddressZh: '',
          licenseRegisteredCompanyEnAddress: '',
          licenseRegisteredCompanyPostCode: '',
        });
      } else if (this.formItem.keyName === 'vatTaxNumberFile') {
        this.fApi.setValue({ vatTaxNumber: '' });
      } else if (this.formItem.keyName === 'vatTaxEuFile') {
        this.fApi.setValue({ vatTaxEuNumber: '' });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.remind-message {
  line-height: 16px;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
}
.upload-dragger-wrap {
  width: 240px;
  height: 200px;
  position: relative;
  display: inline-block;
  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    display: flex;
    align-items: center; /* 主轴居中 */
    justify-content: center; /* 副轴居中 */
    padding: 12px;
    img {
      max-width: 100%;
      max-height: 100%;
    }
    .thumbnail-operate {
      border-radius: 10px;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      align-items: center; /* 主轴居中 */
      justify-content: center; /* 副轴居中 */
    }
    &:hover .thumbnail-operate {
      display: flex;
    }
  }
}
.thumbnail-operate {
  .anticon {
    cursor: pointer;
    font-size: 30px;
    color: #fff;
    margin: 0 15px;
  }
}
.upload-wrap {
  width: 240px;
  height: 200px;
  display: block;
  /deep/.ant-upload.ant-upload-drag {
    border-radius: 10px;
    background: #f9f9f9;
    border: 1px dashed rgba(0, 0, 0, 0.2);
    .ant-upload-text {
      color: rgba(0, 0, 0, 0.6);
    }
    .ant-upload-hint {
      color: rgba(0, 0, 0, 0.4);
      font-size: 12px;
    }
  }
  .ant-upload-drag-icon {
    margin-bottom: 10px !important;
    img {
      width: 62px;
    }
  }
}
.automatic-recognition-info {
  border: 1px solid #f0f0f0;
  width: 100%;
  td {
    border: 1px solid #f0f0f0;
    padding: 12px 16px;
  }
  .bl-label {
    background: #fafafa;
    width: 160px;
  }
}
.preview-box {
  // background: #fff;
  position: fixed;
  height: 60%;
  width: 60%;
  top: 20%;
  left: calc(20% - 260px);
  display: flex;
  align-items: center; /* 主轴居中 */
  justify-content: center; /* 副轴居中 */
  z-index: 99999;
  img {
    max-width: 100%;
    max-height: 100%;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
    transition: all 0.3s;
  }
  .viewer-toolbar {
    position: fixed;
    bottom: 0px;
  }
}

.example-file {
  display: inline-block;
  vertical-align: top;
  dt {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 16px;
  }
  dd {
    float: left;
    text-align: center;
  }
  b {
    font-weight: normal;
    color: #3a7fff;
    font-size: 12px;
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .error-example {
    width: 150px;
    text-align: left;
    img {
      width: 54px;
      margin-right: 11px;
    }
  }
}
.example-fileA,
.example-fileB,
.example-fileOr {
  padding: 10px;
  width: 208px;
  height: 145px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center; /* 主轴居中 */
  justify-content: center; /* 副轴居中 */
  cursor: pointer;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center; /* 主轴居中 */
    justify-content: center; /* 副轴居中 */
    cursor: pointer;
  }
}
.example-fileB {
  width: 147px;
}
.example-fileOr {
  width: 36px;
  border: none;
  color: rgba(0, 0, 0, 0.4);
}

.example-file-ul {
  display: inline-block;
  margin: 0 0 0 24px;
  dd {
    margin: 0;
  }
}
.signature {
  color: #ed4014;
}
.ocr-describe {
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 24px;
  padding-top: 20px;
  span {
    color: #3a7fff;
    cursor: pointer;
  }
}
.upload-successful {
  img {
    width: 108px;
  }
  p {
    padding-top: 12px;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>
<style lang="less">
.loading-modal {
  .ant-modal-content {
    border-radius: 20px;
  }
  .ant-modal-body {
    text-align: center;
    height: 182px;
    .ant-spin {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    > p {
      color: #000;
    }
  }
}
</style>
