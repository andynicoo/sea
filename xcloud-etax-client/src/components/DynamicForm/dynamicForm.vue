<template>
  <div class="formCreate" v-if="isOld">
    <form-create :rule="rule" class="form-create" :option="option" v-model="fApi" />
    <div class="btn-group">
      <Button :disabled="isCancel" class="keep" @click="preserveBtn" v-if="showSave">保存</Button>
      <Button :disabled="isCancel" type="primary" @click="submit" v-if="showSubmit">提交</Button>
    </div>
    <div style="padding-bottom: 50px" v-show="showBtn"></div>
  </div>
  <div class="formCreate" v-else>
    <ul
      class="data-steps"
      v-if="
        moduleListUpload.length &&
        showSubmit &&
        !['/complianceBusiness/addCategoryBrandDetails'].includes(this.$route.path)
      "
    >
      <li class="ds-icon ds-current">
        <span><a-icon v-if="stepsIndex > 1" type="check" /><span v-else>1</span></span
        >准备资料
      </li>
      <li class="ds-icon" :class="{ 'ds-current': stepsIndex > 1 }">
        <span><a-icon v-if="stepsIndex > 2" type="check" /><span v-else>2</span></span
        >填写资料
      </li>
      <li :class="{ 'ds-current': stepsIndex == 3 }"><span>3</span>预览提交</li>
    </ul>
    <ul class="data-steps" v-else-if="moduleList.length && showSubmit">
      <li class="ds-icon ds-current">
        <span><a-icon v-if="stepsIndex > 2" type="check" /><span v-else>1</span></span
        >填写资料
      </li>
      <li :class="{ 'ds-current': stepsIndex == 3 }"><span>2</span>预览提交</li>
    </ul>
    <DataPreparation
      v-if="stepsIndex == 1"
      :moduleListUpload="moduleListUpload"
      :workInfo="workInfo"
      :moduleListUploadSelect="moduleListUploadSelect"
    />
    <DataPreviews
      @nextStep="nextStep"
      v-if="stepsIndex == 3"
      :moduleListEPR="moduleList"
      :workOrderId="workOrderId"
      :tabsCurrent="tabsCurrent"
      :showSubmit="showSubmit"
      :workInfo="workInfo"
    />
    <div class="form-create-wrap">
      <div class="form-create-anchor">
        <a-anchor :target-offset="350" v-show="stepsIndex == 2" :getContainer="getAnchorContainer">
          <a-anchor-link
            v-for="item in moduleList"
            :href="'#' + item.moduleName"
            :title="item.moduleName"
            :key="item.moduleId"
          />
        </a-anchor>
      </div>
      <form-create
        v-show="stepsIndex == 2"
        :rule="rule"
        class="form-create form-create-new"
        :option="option"
        v-model="fApi"
      />
    </div>
    <div class="btn-group">
      <Button v-if="stepsIndex == 1" :disabled="isCancel" class="keep" @click="$router.go(-1)">取消</Button>
      <Button v-if="stepsIndex == 1" :disabled="isCancel" type="primary" @click="nextStep(2, true)">下一步</Button>
      <Button
        v-if="
          stepsIndex > 1 &&
          moduleListUpload.length &&
          showSubmit &&
          !['/complianceBusiness/addCategoryBrandDetails'].includes(this.$route.path)
        "
        :disabled="isCancel"
        class="keep"
        @click="nextStep(stepsIndex - 1)"
        >上一步</Button
      >
      <Button v-if="stepsIndex == 2 && showSave" :disabled="isCancel" class="keep" @click="preserveBtn">暂存</Button>
      <Button :disabled="isCancel" type="primary" @click="submit" v-if="showSubmit && stepsIndex == 3">提交</Button>
      <Button v-if="stepsIndex == 2" :disabled="isCancel" type="primary" @click="nextStep(3)">下一步</Button>
      <Button type="primary" v-if="!showSubmit && stepsIndex == 3" @click="$router.go(-1)">返回</Button>
    </div>
    <div style="padding-bottom: 50px" v-show="showBtn"></div>
    <div ref="assistantRef" class="assistant-tips" v-if="assistantShow" v-drag>
      <a-popconfirm ok-text="继续关闭" cancel-text="取消" width="120" @confirm="assistantShow = false"
        ><template slot="title">
          <p class="assistant-close-tips">暂时关闭小助手后，再次点击输入框就可以唤起小助手拉</p> </template
        ><a-icon type="close" class="drag-close-icon"
      /></a-popconfirm>
      <dl>
        <dt>{{ assistantInfo.keyLabel }}</dt>
        <dd class="remind-message">{{ assistantInfo.remindMessage }}</dd>
        <dd>
          <a
            v-if="assistantInfo.fileModelUrl"
            :href="assistantInfo.fileModelUrl"
            target="_blank"
            style="color: #16ade9; margin-right: 20px"
          >
            <img
              class="fileModel"
              :src="assistantInfo.fileModelUrl"
              v-if="
                assistantInfo.fileModelUrl.includes('png') ||
                assistantInfo.fileModelUrl.includes('jpg') ||
                assistantInfo.fileModelUrl.includes('jpeg')
              "
            />
            <div v-else class="fileModel-other">{{ fileModelUrlSuffix(assistantInfo.fileModelUrl) }}</div>
          </a>
        </dd>
      </dl>
      <div class="customer-service">
        <div class="customer-service-txt">
          挡住视线可以我把拖走呦<br />还有疑问？可以点击<span
            v-sensors="{
              type: 'LittleAssistant',
              event: 'click',
              getParams: () => {
                return { field_name: assistantInfo.keyLabel };
              },
            }"
            onclick="easemobim.bind({configId: `16969a62-0320-44bd-b2e3-b1cae76fb523`})"
            >询问客服</span
          >
        </div>
      </div>
    </div>
    <Modal
      v-model="automaticRecognitionModal"
      :title="automaticTitle[automaticType] + '上传成功'"
      @on-ok="automaticOk"
      @on-cancel="automaticCancel"
      ok-text="自动填写"
      class="automatic-recognition-modal antd-style-modal"
      width="700"
    >
      <div class="automatic-recognition-tips">
        识别到以下信息，是否自动完成填写
        <p>识别成功，如果问题，鼠标悬停在内容上即可修改</p>
      </div>
      <dl class="identify-content">
        <dt v-if="automaticValuable">识别内容</dt>
        <template v-if="this.automaticType == 'COMPANY_LICENSE'">
          <dd><span>营业执照号：</span><Input v-model="businessLicenseInfo.businessLicenseNumber"></Input></dd>
          <dd><span>公司名称：</span><Input v-model="businessLicenseInfo.companyNameZh"></Input></dd>
          <dd><span>经营地址：</span><Input v-model="businessLicenseInfo.addressOfBusiness"></Input></dd>
          <dd><span>法定代表人：</span><Input v-model="businessLicenseInfo.companyLegalPersonCh"></Input></dd>
          <dd><span>注册日期：</span><Input v-model="businessLicenseInfo.dateOfRegistration"></Input></dd>
        </template>
        <template v-if="this.automaticType == 'ID_CARD'">
          <dd><span>证件持有人姓名：</span><Input v-model="idCardInfo.nameOfCertificateHolder"></Input></dd>
          <dd><span>证件号码：</span><Input v-model="idCardInfo.documentNumber"></Input></dd>
          <dd><span>证件持有人住址：</span><Input v-model="idCardInfo.addressOfDocumentHolder"></Input></dd>
        </template>
        <template v-if="this.automaticType == 'ID_CARD_REVERSE'">
          <dd><span>证件有效期：</span><Input v-model="idCardReverseInfo.validityPeriodOfCertificate"></Input></dd>
        </template>
      </dl>
      <dl class="current-content" v-if="automaticValuable">
        <dt>当前内容</dt>

        <dd v-if="automaticType == 'COMPANY_LICENSE' && businessLicenseInfoCurrent.BusinessLicenseNumber">
          <span>营业执照号：</span>{{ businessLicenseInfoCurrent.BusinessLicenseNumber }}
        </dd>
        <dd v-if="automaticType == 'COMPANY_LICENSE' && businessLicenseInfoCurrent.companyNameZh">
          <span>公司名称：</span>{{ businessLicenseInfoCurrent.companyNameZh }}
        </dd>
        <dd v-if="automaticType == 'COMPANY_LICENSE' && businessLicenseInfoCurrent.AddressOfBusiness">
          <span>经营地址：</span>{{ businessLicenseInfoCurrent.AddressOfBusiness }}
        </dd>
        <dd v-if="automaticType == 'COMPANY_LICENSE' && businessLicenseInfoCurrent.companyLegalPersonCh">
          <span>法定代表人：</span>{{ businessLicenseInfoCurrent.companyLegalPersonCh }}
        </dd>
        <dd v-if="automaticType == 'COMPANY_LICENSE' && businessLicenseInfoCurrent.DateOfRegistration">
          <span>注册日期：</span>{{ businessLicenseInfoCurrent.DateOfRegistration }}
        </dd>
        <dd v-if="automaticType == 'ID_CARD_REVERSE' && idCardReverseInfoCurrent.ValidityPeriodOfCertificate">
          <span>证件有效期：</span>{{ idCardReverseInfoCurrent.ValidityPeriodOfCertificate }}
        </dd>
        <dd v-if="automaticType == 'ID_CARD' && idCardInfoCurrent.NameOfCertificateHolder">
          <span>证件持有人姓名：</span>{{ idCardInfoCurrent.NameOfCertificateHolder }}
        </dd>
        <dd v-if="automaticType == 'ID_CARD' && idCardInfoCurrent.DocumentNumber">
          <span>证件号码：</span>{{ idCardInfoCurrent.DocumentNumber }}
        </dd>
        <dd v-if="automaticType == 'ID_CARD' && idCardInfoCurrent.AddressOfDocumentHolder">
          <span>证件持有人住址：</span>{{ idCardInfoCurrent.AddressOfDocumentHolder }}
        </dd>
      </dl>
    </Modal>
    <Modal
      v-model="importTemplatesModal"
      title="用模板导入"
      @on-ok="importTemplatesOk"
      @on-cancel="importTemplatesCancel"
      class="import-templates-modal antd-style-modal"
      width="634"
    >
      <div class="import-templates-info">
        <h2 class="import-templates-title"><b>1</b>下载信息表，填写内容</h2>
        <p class="import-templates-desc">请按照模板的格式填写服务资料，模板中的表头名称不可更改，表头不能删除。</p>
        <Button @click="downloadHandle"><a-icon type="download" class="mr-8" />下载</Button>
      </div>
      <div class="import-templates-info">
        <h2 class="import-templates-title"><b>2</b>上传填写好的信息表</h2>
        <p class="import-templates-desc">请按照模板填写信息后再上传，需请勿上传压缩包，格式限制为：xlsx。</p>
        <Upload class="upload-box" :max-size="30 * 1024" :before-upload="beforeUploadAccept" action="">
          <Button type="primary"><a-icon type="upload" class="mr-8" />上传</Button>
        </Upload>
        <span class="upload-file-name" v-if="uploadFileName"
          ><a-icon type="paper-clip" />{{ uploadFileName
          }}<a-icon @click="uploadFileName = ''" v-if="uploadFileName" type="delete"
        /></span>
      </div>
      <p class="import-templates-desc">
        上传结束后系统将自动匹配信息，请再次确认和修改信息吧，最终提交且审核通过后，不支持修改和退款哦。
      </p>
    </Modal>
  </div>
</template>
<script>
import { dynamicForm } from '@/libs/dynamicForm.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
import { workFlowColumnRelationDownloadMaterialExcel } from '@/api/commonOperator.js';
import { clientOcr } from '@/api/commonOperator';
import SampleFile from '@/components/WorkOrderComponents/SampleFile';
import DataPreparation from './dataPreparation.vue';
import DataPreviews from './dataPreviews.vue';
import { cloneDeep, uniqBy } from 'lodash';
export default {
  props: {
    // 数据列表
    moduleList: { type: Array },
    // 是否显示所有按钮
    showBtn: {
      type: Boolean,
      default: false,
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: true,
    },
    // 是否显示保存按钮
    showSave: {
      type: Boolean,
      default: true,
    },
    // 是否显示提交按钮
    showSubmit: {
      type: Boolean,
      default: true,
    },
    // 是否税务稽查
    taxInspection: {
      type: Boolean,
      default: false,
    },
    // 税务稽查国家
    taxInspectionCountry: String,
    // 是否注销税号
    logoutTaxNum: {
      type: Boolean,
      default: false,
    },
    // 注销税号国家
    logoutTaxNumCountry: String,
    // 是否显示授权书
    showAuthorizeFile: {
      type: Boolean,
      default: false,
    },
    // 是否海牙授权
    hyAuthorized: {
      type: Boolean,
      default: false,
    },
    // 是否取消中或已取消状态，禁用按钮
    isCancel: {
      type: Boolean,
      default: false,
    },
    // EPR显示模板文件
    showSourceFile: {
      type: Boolean,
      default: false,
    },
    // 工单id
    workOrderId: {
      type: String,
      default: '',
    },
    // 工单详情
    workInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    // Tabs选中的值
    tabsCurrent: {
      type: String | Number,
      default: '1',
    },
    //旧布局
    isOld: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
        let odiv = el; //获取当前元素
        el.onmousedown = (e) => {
          //算出鼠标相对元素的位置
          let disY = e.clientY - odiv.offsetTop;
          let top = '';
          let bottomY = document.documentElement.clientHeight - 150;

          let disX = e.clientX - odiv.offsetLeft;
          let left = '';
          let rightX = document.documentElement.clientWidth - 150;
          document.onmousemove = (e) => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            top = e.clientY - disY;
            //绑定元素位置到positionY上面
            //移动当前元素
            odiv.style.top = top > 0 && top < bottomY ? top + 'px' : top <= 0 ? 0 : bottomY + 'px';
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            left = e.clientX - disX;
            //绑定元素位置到positionX上面
            //移动当前元素
            odiv.style.left = left > 0 && left < rightX ? left + 'px' : left <= 0 ? 0 : rightX + 'px';
          };
          document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  components: {
    SampleFile,
    DataPreparation,
    DataPreviews,
  },
  computed: {
    rule() {
      console.log('dynamicForm rule', dynamicForm(this.moduleList, this._props));
      return dynamicForm(this.moduleList, this._props);
    },
  },
  watch: {
    //自动识别监听
    '$store.state.app.businessLicense': {
      handler(newVal) {
        let valHandel = newVal.split('|');
        this.automaticType = valHandel[0];
        clientOcr({
          fileType: valHandel[0],
          fileUrl: valHandel[1],
        }).then((res) => {
          if (res.code === 0) {
            if (this.automaticType == 'COMPANY_LICENSE') {
              this.businessLicenseInfo = Object.assign(this.businessLicenseInfo, res.data.ocrCompanyBusinessLicense);
              this.fApi.display(true, [
                'BusinessLicenseNumber',
                'companyNameZh',
                'AddressOfBusiness',
                'companyLegalPersonCh',
                'DateOfRegistration',
              ]);
            } else if (this.automaticType == 'ID_CARD') {
              this.idCardInfo = Object.assign(this.idCardInfo, res.data.ocrIdCard);
              this.fApi.display(true, ['NameOfCertificateHolder', 'DocumentNumber', 'AddressOfDocumentHolder']);
            } else if (this.automaticType == 'ID_CARD_REVERSE') {
              this.idCardReverseInfo = Object.assign(this.idCardReverseInfo, res.data.ocrIdReverseCard);
              this.fApi.display(true, ['ValidityPeriodOfCertificate']);
            }
            this.automaticOk();
          }
        });
      },
    },
    moduleList: {
      handler(newVal) {
        if (this.watchOpen && newVal && newVal.length) {
          this.watchOpen = false;
          newVal.forEach((module) => {
            module.columns.forEach((item) => {
              if (item.remindMessage) {
                this.fApi.on(`native-${item.keyName.replace(/([A-Z])/g, '-$1').toLowerCase()}-click`, (e) =>
                  this.eleHandleclick(e, item)
                );
              }
            });
          });
          //上传资料处理
          this.moduleListUpload = cloneDeep(newVal);
          let map = new Map();
          this.moduleListUpload.forEach((module) => {
            module.uploadArr = [];
            // module.uploadArrParent = {};
            module.columns.forEach((item) => {
              if (item.columnId) {
                map.set(item.columnId, item);
              }
              if (item.inputType == 4) {
                module.uploadArr.push(item);
              }
              if (item.inputType == 4 && item.columnPid) {
                let columnParrent = cloneDeep(map.get(item.columnPid));
                if (columnParrent && columnParrent.info) {
                  columnParrent.info = JSON.parse(columnParrent.info);
                  columnParrent.value =
                    ['""', '{}'].includes(JSON.stringify(columnParrent.reView)) || !columnParrent.reView
                      ? columnParrent.info.groups[0].value
                      : columnParrent.reView;
                  this.moduleListUploadSelect.push(columnParrent);
                }
              }
            });
          });
          this.moduleListUploadSelect = uniqBy(this.moduleListUploadSelect, 'columnId');
          this.moduleListUpload = this.moduleListUpload.filter((module) => {
            if (module.uploadArr.length) {
              return module;
            }
          });
          if (
            this.moduleListUpload.length &&
            !['/complianceBusiness/addCategoryBrandDetails'].includes(this.$route.path)
          ) {
            this.stepsIndex = 1;
            this.$store.dispatch('app/setStepIndex', 1);
          } else {
            this.stepsIndex = 2;
            this.$store.dispatch('app/setStepIndex', 2);
          }
          if (!this.showSubmit) {
            this.stepsIndex = 3;
            this.$store.dispatch('app/setStepIndex', 3);
          }
          console.log('this.stepsIndex :>> ', this.stepsIndex);
        }
      },
      deep: true,
    },
  },

  data() {
    return {
      receptFile: '',
      fApi: {},
      option: {
        form: { labelWidth: undefined, labelPosition: 'top' },
        resetBtn: false,
        submitBtn: false,
      },

      assistantShow: false,
      assistantInfo: {},
      moduleListUpload: [],
      moduleListUploadSelect: [],
      stepsIndex: 1,
      watchOpen: true,
      automaticRecognitionModal: false,
      automaticValuable: false, //是否有值
      automaticType: '', //自动识别类型身份证正面：ID_CARD；身份证反面：ID_CARD_REVERSE；公司营业执照：COMPANY_LICENSE
      automaticTitle: {
        COMPANY_LICENSE: '营业执照',
        ID_CARD: '身份证(人像面)',
        ID_CARD_REVERSE: '身份证(国徽面)',
      },
      businessLicenseInfo: {
        title: '营业执照',
        businessLicenseNumber: '营业执照号',
        companyNameZh: '公司名称',
        addressOfBusiness: '经营地址',
        companyLegalPersonCh: '法定代表人',
        dateOfRegistration: '注册日期',
      },
      businessLicenseInfoCurrent: {
        BusinessLicenseNumber: '营业执照号',
        companyNameZh: '公司名称',
        AddressOfBusiness: '经营地址',
        companyLegalPersonCh: '法定代表人',
        DateOfRegistration: '日期',
      },
      idCardInfo: {
        title: '身份证(人像面)',
        nameOfCertificateHolder: '证件持有人姓名',
        documentNumber: '证件号码',
        addressOfDocumentHolder: '证件持有人住址',
      },
      idCardInfoCurrent: {
        NameOfCertificateHolder: '证件持有人姓名',
        DocumentNumber: '证件号码',
        AddressOfDocumentHolder: '证件持有人住址',
      },
      idCardReverseInfo: {
        title: '身份证(国徽面)',
        validityPeriodOfCertificate: '证件有效期',
      },
      idCardReverseInfoCurrent: {
        ValidityPeriodOfCertificate: '证件有效期',
      },
      importTemplatesModal: false,
      importTemplateData: {},
      uploadFileName: '',
    };
  },
  mounted() {
    document.querySelector('.main-container').addEventListener('scroll', () => {
      this.assistantShow = false;
    });
  },
  methods: {
    getAnchorContainer() {
      return document.querySelector('.main-container');
    },
    //模板上传资料
    beforeUploadAccept(file) {
      const check = this.uploadFileName == '';
      const self = this;
      if (!check) {
        self.$Notice.warning({
          title: '最多只可上传1个文件',
        });
        return check;
      } else if (file.size > 2097152 * 15) {
        self.$Notice.warning({
          title: '文件大小超过30M',
        });
        return false;
      }
      this.uploadFile(file);
      return false;
    },
    uploadFile(file) {
      let _this = this;
      var data = new FormData();
      data.append('countryCode', this.$route.query.code);
      data.append('excelFile', file);

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', this.baseUrl + 'workorder/client/workFlowColumnRelation/importList');
      // 请求头固定传参
      const token = localStorage.getItem('token');
      xhr.setRequestHeader('enterprisecode', 'ksy');
      xhr.setRequestHeader('enterpriseid', 29);
      if (token) {
        xhr.setRequestHeader('token', token);
      }
      xhr.send(data);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = JSON.parse(xhr.response);
          if (res.code == 0) {
            _this.importTemplateData = res.data;
            _this.$Message.warning('模板数据上传成功！');
            _this.uploadFileName = file.name;
          } else {
            _this.$Message.warning(res.message);
          }
        }
      };
    },
    //下载资料清单
    async downloadHandle() {
      let { data } = await workFlowColumnRelationDownloadMaterialExcel({
        workflowId: this.workInfo.workflowId,
        currentNodeCode: this.workInfo.currentNodeCode || this.workInfo.cureentNodeCode,
        serviceId: this.workInfo.serviceId || this.workInfo.id,
      });
      this.$util.downloadFile(data, '资料清单');
    },
    // 联动数据
    getControlData(datalist) {
      let map = new Map();
      let data = [];
      datalist.forEach((item) => {
        if (item.columnId) {
          map.set(item.columnId, item);
        }
      });
      datalist.forEach((item) => {
        const parent = map.get(item.columnPid);
        if (parent) {
          (parent.control || (parent.control = [])).push({
            handle: (val) => {
              return item.columnOption.split(',').includes(val);
            },
            rule: [item],
          });
        } else {
          data.push(item);
        }
      });

      return data;
    },
    //获取文件后缀
    fileModelUrlSuffix(url) {
      let urlArray = url.split('.');
      return urlArray[urlArray.length - 1];
    },
    //模板导入确定
    importTemplatesOk() {
      let _this = this;
      this.uploadFileName = '';
      this.$confirm({
        title: '是否覆盖当前已填好的内容?',
        okText: '确定',
        cancelText: '取消',
        content: (h) => <div>检测到已填写部分内容，是否要用信息表的内容覆盖当前已填好的内容</div>,
        onOk() {
          let importTemplateDataKeys = Object.keys(_this.importTemplateData);
          _this.moduleList.forEach((ml) => {
            ml.columns.forEach((sub) => {
              if (
                !['上传产品图', '上传订单详情截图', '申请人签名 （确认上述信息无误，并完成签名）'].includes(
                  sub.keyLabel
                )
              ) {
                if (importTemplateDataKeys.includes(sub.keyLabel)) {
                  if (sub.keyLabel == '商标分类') {
                    sub.keyNameValue = JSON.stringify(_this.importTemplateData[sub.keyLabel]);
                  } else if (sub.inputType == 2) {
                    sub.infoJson.groups.forEach((group) => {
                      if (group.label == _this.importTemplateData[sub.keyLabel]) {
                        sub.keyNameValue = group.value;
                      }
                    });
                  } else {
                    sub.keyNameValue = _this.importTemplateData[sub.keyLabel];
                  }
                }
              }
            });
          });
          _this.onSubmit();
        },
        class: 'test',
      });
    },
    //模板导入取消
    importTemplatesCancel() {
      this.uploadFileName = '';
    },
    //自动识别确定
    automaticOk() {
      if (this.automaticType == 'COMPANY_LICENSE') {
        this.fApi.setValue({
          BusinessLicenseNumber: this.businessLicenseInfo.businessLicenseNumber,
          companyNameZh: this.businessLicenseInfo.companyNameZh,
          AddressOfBusiness: this.businessLicenseInfo.addressOfBusiness,
          companyLegalPersonCh: this.businessLicenseInfo.companyLegalPersonCh,
          DateOfRegistration: this.businessLicenseInfo.dateOfRegistration,
        });
      }
      if (this.automaticType == 'ID_CARD') {
        this.fApi.setValue({
          NameOfCertificateHolder: this.idCardInfo.nameOfCertificateHolder,
          DocumentNumber: this.idCardInfo.documentNumber,
          AddressOfDocumentHolder: this.idCardInfo.addressOfDocumentHolder,
        });
      }
      if (this.automaticType == 'ID_CARD_REVERSE') {
        this.fApi.setValue({
          ValidityPeriodOfCertificate: this.idCardReverseInfo.validityPeriodOfCertificate,
        });
      }
    },
    //自动识别取消
    automaticCancel() {},
    //下一步
    async nextStep(index, isPre) {
      this.assistantShow = false;
      if (isPre) {
        let setObj = {};
        this.moduleListUploadSelect.forEach((item) => {
          setObj[item.keyName] = item.value;
        });
        this.fApi.setValue(setObj);
        this.$nextTick(() => {
          document.querySelector('.main-container').scrollTop = 0;
        });
      }
      if (index == 3 && this.showSave) {
        this.onSubmit().then(async (res) => {
          if (this.workOrderId) {
            let { testField, ...materialData } = this.fApi.form;
            let material = JSON.stringify(this.removePropertyOfNull(materialData));
            let { code } = await workOrderCommonOperator('save', {
              material,
              workOrderId: this.workOrderId,
            });
            if (code === 0) {
              this.$Message.success('保存成功');
              this.stepsIndex = 3;
              this.$store.dispatch('app/setStepIndex', 3);
              this.$nextTick(() => {
                document.querySelector('.main-container').scrollTop = 0;
              });
            }
          } else {
            this.$emit('formSave', res, true);
            this.$nextTick(() => {
              document.querySelector('.main-container').scrollTop = 0;
            });
          }
        });
      } else {
        this.stepsIndex = index;
        this.$store.dispatch('app/setStepIndex', index);
        this.$nextTick(() => {
          document.querySelector('.main-container').scrollTop = 0;
        });
      }
    },
    //点击元素
    eleHandleclick(e, v) {
      console.log(`click!!"点击了"`, e, v, this.assistantShow);
      this.assistantShow = true;
      this.assistantInfo = v;
    },

    // 取消
    cancelBtn() {
      this.$emit('formCancel');
    },
    //获取表单数据
    getMaterial() {
      let { testField, ...materialData } = this.fApi.form;
      let material = JSON.stringify(this.removePropertyOfNull(materialData));
      return material;
    },
    //保存
    async preserveBtn() {
      // this.onSubmit().then((res) => {
      let { testField, ...materialData } = this.fApi.form;
      let material = JSON.stringify(this.removePropertyOfNull(materialData));
      if (this.workOrderId) {
        let { code } = await workOrderCommonOperator('save', {
          material,
          workOrderId: this.workOrderId,
        });
        code === 0 && this.$Message.success('保存成功');
      }
      this.$emit('formSave', material);
      // });
    },
    // 移除对象中的空属性
    removePropertyOfNull(obj) {
      return Object.fromEntries(Object.entries(obj).filter((item) => item[1] !== ''));
    },
    submit() {
      this.onSubmit().then(async (res) => {
        if (this.workOrderId) {
          let { code } = await workOrderCommonOperator('commit', {
            material: res,
            workOrderId: this.workOrderId,
          });
          if (code === 0) {
            this.$Message.success('提交成功');
            localStorage.backPath = '/myVantService';
            this.$router.push('/submittedSucceeded');
          }
        }
        this.$emit('formsubmit', res);
      });
    },
    // 提交表单
    onSubmit() {
      return new Promise((resolve) => {
        this.fApi.submit(
          (formData, fApi) => {
            let { testField, ...materialData } = formData;
            resolve(JSON.stringify(materialData));
          },
          (...error) => {
            console.log('error :>> ', error);
            this.$Message.warning('请检查输入的数据');
            this.$nextTick(() => {
              let topNum =
                document.querySelector('.main-container').scrollTop +
                document.querySelector('.ivu-form-item-error-tip').getBoundingClientRect().top -
                120;
              document.querySelector('.main-container').scrollTo({
                top: topNum,
                behavior: 'smooth',
              });
            });
          }
        );
      });
    },
  },
};
</script>
<style scoped lang="less">
.formCreate {
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  padding: 24px;
  margin-bottom: 75px;
  min-height: calc(100vh - 245px);
  /deep/ .ivu-upload {
    max-width: 332px;
  }
  // margin: 24px;
  .form-create {
    /deep/ .ivu-upload-list-remove {
      display: inherit !important;
    }
    .text-tips {
      color: rgb(251, 183, 60);
    }
    /deep/ .ivu-input {
      width: 300px;
    }
    /deep/ .el-textarea {
      width: 300px;
    }
    /deep/ .ivu-select {
      width: 300px;
    }
    // /deep/ .ivu-col {
    //   padding: 0 32px;
    // }
    /deep/ .ivu-col-span-8 {
      padding: 0 32px;
    }
    /deep/ .ivu-col-span-23 {
      padding-left: 32px;
    }
    /deep/ .ivu-upload-list-file {
      padding: 4px;
      color: #515a6e;
      border-radius: 4px;
      transition: background-color 0.2s ease-in-out;
      overflow: hidden;
      position: relative;
    }
    //上传文件样式
    /deep/ .ivu-upload-select {
      min-width: 110px;
      color: #919498;
      border: 1px solid #d9d9d9;
      line-height: 36px;
      height: 36px;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      .ivu-icon-ios-cloud-upload-outline {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.EPRDeclareDetails {
  .formCreate {
    margin-bottom: 0;
  }
}
.btn-group {
  text-align: center;
  height: 64px;
  padding-top: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  box-shadow: 0px -1px 10px 0px #ebf0f5;
  button {
    margin: 5px;
    height: 32px;
    border-radius: 0;
  }
  .ivu-btn-primary {
    background: #3a7fff;
    border-color: #3a7fff;
  }
}
/deep/ .ivu-input-group {
  display: -webkit-inline-box !important;
}

.form-create-new {
  padding: 24px;
  /deep/ .tittleStyle {
    height: auto;
    line-height: 100%;
    padding-top: 48px;
    border-top: 1px solid #f0f0f0;
    border-radius: 0;
    margin-top: 24px;
  }
  /deep/ .form-title-one {
    .tittleStyle {
      padding-top: 24px;
      border-top: none;
    }
  }
  /deep/ .ivu-radio-wrapper {
    margin-right: 24px;
  }
  /deep/ .ivu-input {
    border-radius: 0;
  }
  /deep/ .ivu-form-item {
    .ivu-upload-list {
      margin-bottom: 0;
    }
    .ivu-form-item-label {
      width: 150px;
      text-align: left;
      position: relative;
      top: 10px;
      font-size: 14px;
      color: #515a6e;
      font-weight: normal;
      line-height: 14px;
    }
    .ivu-form-item-label + .ivu-form-item-content {
      display: inline-block;
      vertical-align: top;
      width: auto;
    }
    .ivu-form-item-label {
      position: relative;
      &::before {
        position: absolute;
      }
      span {
        padding-left: 10px;
        display: inline-block;
      }
    }
    .ivu-form-item-error-tip {
      padding-top: 3px;
    }
  }
  /deep/ .productListTable-wrap {
    .ivu-form-item-content {
      width: 98% !important;
      margin-top: 10px;
      display: block !important;
    }
  }
}
.antd-style-modal {
  /deep/ .ivu-modal-header {
    background: #fff !important;

    border: 1px solid #f0f0f0;
  }
  /deep/.ivu-modal-content {
    box-shadow: none;
  }
  /deep/ .ivu-modal-footer {
    border-top: 1px solid #f0f0f0 !important;
    padding-top: 12px !important;
    .ivu-btn-text {
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #d9d9d9;
    }
    .ivu-btn-primary {
      background: #3a7fff;
      border-radius: 2px 2px 2px 2px;
      border-color: #3a7fff;
    }
  }
}
.automatic-recognition-tips {
  color: #303132;
  margin-bottom: 24px;
  font-size: 16px;
  p {
    color: #919498;
    font-size: 14px;
  }
}
.identify-content,
.current-content {
  min-height: 150px;
  span {
    display: inline-block;
    min-width: 113px;
  }
  /deep/ .ivu-input-wrapper {
    width: 380px;
    position: relative;
    top: -2px;
    .ivu-input {
      border: 1px solid #f6ffed;
      background: #f6ffed;
      border-radius: 0;
    }
  }

  border-radius: 4px;
  background: #f6ffed;
  border: 1px solid #63ca31;
  padding: 24px 110px 24px 24px;
  position: relative;
  dt {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 48px;
    background: #63ca31;
    color: #fff;
    writing-mode: vertical-lr;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    letter-spacing: 8px;
  }
  dd {
    margin-bottom: 0;
  }
}
.current-content {
  background: #f5f5f5;
  border: 1px solid #c0c4cb;
  span {
    width: 120px;
  }
  dt {
    background: #c0c4cb;
  }
  dd {
    margin-bottom: 10px;
  }
}
.assistant-tips {
  position: fixed;
  top: 35%;
  right: 20%;
  z-index: 1000;
  width: 342px;
  min-height: 300px;
  padding: 30px 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f2f7fc 100%);
  box-shadow: 10px 4px 34px 0px rgba(216, 227, 252, 0.3), -3px 0px 20px 0px rgba(216, 227, 252, 0.1);
  border-radius: 10px 10px 10px 10px;
  opacity: 1;
  border: 4px solid #ffffff;
  dt {
    color: #303132;
    font-size: 16px;
    padding: 0 20px;
  }
  dd {
    padding: 0 20px;
  }
  .remind-message {
    font-size: 12px;
    color: #303132;
    margin: 20px 0;
  }
  .customer-service {
    width: 272px;
    height: 77px;
    position: absolute;
    bottom: -30px;
    right: -34px;
    background: url('./../../assets/images/common/customerService.png') no-repeat;
    background-size: cover;
  }
  .customer-service-txt {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin: 26px 0 0 13px;
    line-height: 18px;
    span {
      color: #3a7fff;
      cursor: pointer;
    }
  }
  // .drag-icon {
  //   display: block;
  //   position: absolute;
  //   top: 10px;
  //   right: 10px;
  //   width: 13px;
  //   height: 15px;
  //   cursor: move;
  //   background: url('./../../assets/images/common/dynamicForm/icon_tuozhuai.png') no-repeat;
  // }
  .drag-close-icon {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    color: #666;
    cursor: pointer;
  }
}
.data-steps {
  width: 100%;
  display: flex;
  margin-bottom: 0;
  li {
    // width: 33%;
    flex-grow: 1;
    height: 48px;
    border: 1px solid #f5f5f5;
    background-color: #f5f5f5;
    position: relative;
    margin-right: 6px;
    line-height: 48px;
    padding-left: 48px;
    color: #919498;
    font-size: 16px;
    > span {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #d9d9d9;
      border-radius: 50%;
      color: #fff;
      line-height: 24px;
      text-align: center;
      margin-right: 20px;
    }
  }
  .ds-icon {
    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 34px;
      height: 34px;
      background: #f5f5f5;
      // border-top: 1px solid #d9d9d9;
      // border-right: 1px solid #d9d9d9;
      top: 6px;
      right: -17px;
      transform: rotate(45deg);
      z-index: 1;
    }
    &::before {
      right: -25px;
      background: #fff;
    }
  }
  li.ds-current {
    background: #549bff;
    border-color: #549bff;
    color: #fff;
    > span {
      background: #fff;
      color: #6caaff;
    }
    &::after {
      background: #549bff;
      border-color: #549bff;
    }
  }
}
.ivu-btn-default,
.ivu-btn-primary {
  color: #515a6e;
  border-radius: 0;
  margin-left: 32px;
}
.ivu-btn-primary {
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
}

.import-templates-info {
  background: rgba(58, 127, 255, 0.04);
  padding: 24px 32px;
  margin-bottom: 24px;
  /deep/.ivu-upload-list {
    margin-left: 32px;
  }
  .import-templates-title {
    font-size: 16px;
    color: #303132;
    b {
      text-align: center;
      line-height: 24px;
      width: 24px;
      height: 24px;
      background: #3a7fff;
      display: inline-block;
      border-radius: 50%;
      color: #fff;
      margin-right: 8px;
      font-weight: normal;
    }
  }
  .import-templates-desc {
    font-size: 14px;
    color: #606266;
    padding-left: 32px;
    margin-bottom: 10px;
  }
}
.upload-file-name {
  color: #016eff;
  margin-left: 29px;
  /deep/.anticon {
    color: #666;
    position: relative;
    top: 1px;
    margin-right: 5px;
  }
  /deep/ .anticon-delete {
    display: none;
    cursor: pointer;
    margin-left: 10px;
    color: #666;
  }
  &:hover {
    .anticon-delete {
      display: inline-block;
    }
  }
}
.assistant-close-tips {
  width: 222px;
}
.import-templates-modal {
  /deep/.ivu-modal-body {
    padding: 24px !important;
  }
  .import-templates-desc {
    font-size: 12px;
    color: #919498;
  }
  .mr-8 {
    margin-right: 8px;
  }
}
.automatic-recognition-modal {
  /deep/.ivu-modal-body {
    padding: 24px !important;
  }
}
.form-create-wrap {
  display: flex;
  .form-create-anchor {
    margin-top: 44px;
  }
  /deep/ .ant-anchor-wrapper {
    overflow: inherit;
  }
  /deep/ .ant-affix {
    top: 80px !important;
  }
  /deep/ .ant-anchor-link {
    padding: 7px 16px 7px 0;
    text-align: right;
    margin-bottom: 15px;
    position: relative;
    border-right: 2px solid #f0f0f0;
  }
  /deep/ .ant-anchor-link-active {
    border-right-color: #3a7fff;
    .ant-anchor-link-title {
      color: #3a7fff;
    }
  }
  /deep/ .ant-anchor-ink {
    left: auto;
    right: 0;
    .ant-anchor-ink-ball {
      display: none;
    }
    &::before {
      background-color: #f0f0f0;
    }
  }
}
.fileModel {
  width: 52px;
  height: 52px;
  border: 1px solid #d9d9d9;
}
.fileModel-other {
  width: 52px;
  height: 52px;
  background: #cb6565;
  border: 1px solid #d9d9d9;
  font-size: 14px;
  color: #fff;
  text-align: center;
  line-height: 52px;
}
</style>
