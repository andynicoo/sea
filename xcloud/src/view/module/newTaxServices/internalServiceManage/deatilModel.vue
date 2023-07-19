<template>
  <div class="model">
    <!-- 服务商编码弹窗 -->
    <el-dialog title="修改服务商分配编码" :visible.sync="dialog.ServiceModel" width="400px">
      <el-input v-model="supplierAssignsCode" placeholder="请输入服务商分配编码" />
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.ServiceModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitSupplierCode">保存</el-button>
      </div>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog title="修改服务商" :visible.sync="dialog.showVatUkModel" width="400px">
      <el-form :model="shenHeform" :rules="ruleShenHeform" ref="shenHeform" label-width="130px">
        <el-form-item label="国家：">{{ serviceInfo.countryNameZh }}</el-form-item>
        <el-form-item label="选择服务商：" prop="supplierId">
          <el-select v-model="shenHeform.supplierId" clearable filterable>
            <el-option v-for="(item, key) in supplierList" :key="key" :value="item.supplierId" :label="item.shortName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.showVatUkModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitApply">保存</el-button>
      </div>
    </el-dialog>
    <!-- 驳回 -->
    <el-dialog title="驳回进度" :visible.sync="dialog.progressModel" width="530px">
      <el-form ref="ruleForm" label-width="110px" :model="progress">
        <el-form-item label="当前进度：">
          {{ detailObj.nodeCodeName }}
        </el-form-item>
        <el-form-item label="更改为：">{{ nodeName }}</el-form-item>
        <el-form-item label="更改原因：" prop="remark" :rules="[{ required: true, message: '请填写更改原因', trigger: 'blur' }]">
          <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="progress.remark" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="发短信给客户：">
          <el-radio-group v-model="progress.sendMsg">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <p class="text-red font-12">如果选择发短信给客户，系统将会一并发送更改原因，请详细填写</p>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.progressModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitReject">保存</el-button>
      </div>
    </el-dialog>
    <!-- 完成转代理 -->
    <el-dialog title="完成转代理" :visible.sync="dialog.finishModel" width="560px">
      <p style="margin-bottom: 10px">
        <i class="el-icon-warning text-warning" style="font-size: 24px"></i>
        完成转代理后，服务进入申报流程，不可修改。 确认完成转代理？
      </p>
      <el-form :model="transForm" ref="transForm">
        <el-form-item label="税号证书：（非必填）">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="vatTaxNumberFile"></UploadFile>
        </el-form-item>
        <div v-if="detailObj.countryCode == 'PL'">
          <!-- <el-form-item label="银行名称（Bank Name）：">
            <el-input v-model="transForm.bankName"></el-input>
          </el-form-item> -->
          <el-form-item label="银行账号（IBAN）：" prop="iban" :rules="{ required: true, message: '请输入银行账号', trigger: 'blur' }">
            <el-input v-model="transForm.iban"></el-input>
          </el-form-item>
          <!-- <el-form-item label="BIC：">
            <el-input v-model="transForm.bic"></el-input>
          </el-form-item>
          <el-form-item label="银行地址（Bank Address）：">
            <el-input v-model="transForm.bankAddr"></el-input>
          </el-form-item> -->
        </div>

        <el-form-item label="转代理开始申报周期：" prop="selectMonth" :rules="{ required: true, type: 'array', message: '请选择转代理开始申报周期', trigger: 'change' }">
          <el-date-picker v-model="transForm.selectMonth" type="monthrange" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"> </el-date-picker>
        </el-form-item>

        <el-form-item label="申报周期类型：" prop="upBeginTime">
          <span>
            {{ detailObj.declarePeriod == 0 ? '月报' : detailObj.declarePeriod == 1 ? '季报' : detailObj.declarePeriod == 2 ? '年报' : '' }}
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.finishModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitFile" :loading="finishLoading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改服务商地址 -->
    <el-dialog title="修改服务商地址" :visible.sync="dialog.addreModel" center width="400px">
      <el-form :model="addressform" label-width="120px">
        <el-form-item label="选择注册地址：" prop="registrarAddress" :rules="[{ required: true, message: '地址不能为空' }]">
          <el-select style="width: 168px" v-model="addressform.registrarAddress" placeholder="国家" filterable>
            <el-option v-for="(item, index) in addressList" :key="index" :label="item.registerAddress" :value="item.registerAddress"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.addreModel = false"> 取消 </el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitAddress">保存</el-button>
      </div>
    </el-dialog>
    <!-- 审核通过 -->
    <el-dialog title="确认审核通过吗？" :visible.sync="dialog.shenHeModel" width="400px">
      <div>
        <el-checkbox v-model="needApiIT">API提交注册资料</el-checkbox>
        <p>注：若勾选API提交，注册资料将直接传送至服务商的系统；反之则需要线下提交注册资料给服务商</p>
      </div>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.shenHeModel = false">取消</el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="approved">保存</el-button>
      </div>
    </el-dialog>

    <!-- 修改税号信息 -->
    <el-dialog title="修改税号信息" :visible.sync="dialog.taxInfoModel" width="650px">
      <el-form label-width="130px" style="max-height: 500px; overflow: auto" ref="taxInfoForm" :rules="taxInfoForm" :model="taxInfo">
        <el-form-item label="税号：" prop="vatTaxNumber">
          <el-input v-model.trim="taxInfo.vatTaxNumber" disabled placeholder="请输入税号" style="width: 300px" v-if="serviceInfo.countryNameZh == '英国'" />
          <el-input v-model="taxInfo.vatTaxNumber" disabled placeholder="请输入税号" style="width: 300px" v-else />
        </el-form-item>

        <!-- <el-form-item label="税号生效日期：" prop="taxEffectiveDate">
          <el-date-picker v-model="taxInfo.taxEffectiveDate" type="date" placeholder="请选择税号生效日期" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss" disabled></el-date-picker>
        </el-form-item> -->

        <el-form-item label="SIRET号：" prop="siretNumber" v-if="serviceInfo.countryCode == 'FR'">
          <el-input v-model="taxInfo.siretNumber" disabled placeholder="请输入SIRET号" style="width: 300px" />
        </el-form-item>

        <el-form-item label="EORI号：" v-if="serviceInfo.countryCode != 'AE' && serviceInfo.countryCode != 'SA'">
          <el-input v-model="taxInfo.eoriNumber" placeholder="请输入EORI号" style="width: 300px" />
        </el-form-item>

        <el-form-item label="EORI文件：" v-if="serviceInfo.countryCode != 'AE' && serviceInfo.countryCode != 'SA'">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.eoriNumberFile"></UploadFile>
        </el-form-item>

        <el-form-item label="税号文件：">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatTaxNumberFile"></UploadFile>
        </el-form-item>

        <el-form-item label="VAT证书：" v-if="serviceInfo.countryCode != 'AE' && serviceInfo.countryCode != 'SA'">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatCertificate"></UploadFile>
        </el-form-item>

        <el-form-item label="gateway 账号：" v-if="serviceInfo.countryCode == 'GB'">
          <el-input v-model="taxInfo.gatewayId" placeholder="请输入gateway ID" style="width: 300px" />
        </el-form-item>
        <el-form-item label="gateway密码：" v-if="serviceInfo.countryCode == 'GB'">
          <el-input v-model="taxInfo.gatewayPassword" placeholder="请输入gateway密码" style="width: 300px" />
        </el-form-item>
        <el-form-item label="秘钥：" v-if="serviceInfo.countryCode == 'GB'">
          <el-input v-model="taxInfo.secret" placeholder="请输入秘钥" style="width: 300px" />
        </el-form-item>

        <el-form-item label="DE欧盟证书：" v-if="serviceInfo.countryCode == 'DE'">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.deEuCertificate"></UploadFile>
        </el-form-item>

        <el-form-item label="税务副本：" v-if="serviceInfo.countryCode == 'DE'">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatTaxNumberCopyFile"></UploadFile>
        </el-form-item>

        <el-form-item label="欧盟税号证书：" v-if="serviceInfo.countryCode == 'ES' || serviceInfo.countryCode == 'AT'">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.deEuCertificate"></UploadFile>
        </el-form-item>

        <template v-if="serviceInfo.countryCode == 'SA' || serviceInfo.countryCode == 'AE'">
          <el-form-item label="税局账号：" prop="gatewayId">
            <el-input v-model="taxInfo.gatewayId" placeholder="请输入税局账号" style="width: 300px" />
          </el-form-item>
          <el-form-item label="密码：" prop="gatewayPassword">
            <el-input v-model="taxInfo.gatewayPassword" placeholder="请输入密码" style="width: 300px" />
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.taxInfoModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitTaxInfo">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadFile from '@/components/UploadFile'; //上传文件组件
import { statusNodeCode } from './staticList';
import { reject, updateSupplier, updateSupplierCode, submitTransProxy, saveRegistrarAddress, auditInfo } from '@/api/newApi/taxServices/serviceManage.js';
import { updateInputTaxInfo } from '@/api/newApi/taxServices/taxRegister.js';
import { getRejectCode, getCountrySelectList } from '@/api/newApi/common.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { getSupplierById } from '@/api/newApi/supplyChain/serviceproviderManage.js';
import { batchModifyRtSupplier } from '@/api/newApi/taxServices/taxRegister.js';
import moment from 'moment';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    dialog: { type: Object },
    serviceInfo: { type: Object },
    getOrderDetail: { type: Function },
    detailObj: { type: Object },
    workOrderId: [String, Number],
  },
  components: {
    UploadFile,
  },
  data() {
    return {
      taxStatus: statusNodeCode,
      progress: {
        //驳回
        sendMsg: false,
      },
      supplierAssignsCode: '', //服务商编码
      supplierList: [],
      shenHeform: {
        //修改服务商
        status: 1,
        countryCode: this.serviceInfo.countryCode,
        supplierId: this.serviceInfo.supplierId,
        serviceId: this.$route.query.serviceId,
      },
      needApiIT: false,
      addressform: {}, //修改服务商地址
      countrySelect: [], //国家列表
      vatTaxNumberFile: [], //税号文件
      nodeName: '',
      ruleShenHeform: {
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      addressList: [],
      transForm: {
        bankName: '',
        iban: '',
        bic: '',
        bankAddr: '',
        selectMonth: [],
      },
      // 税号信息校验
      taxInfoForm: {
        vatTaxNumber: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        taxIssueDate: [{ required: true, message: '请选择税号下发日期', trigger: 'change' }],
        taxEffectiveDate: [{ required: true, message: '请选择税号生效日期', trigger: 'change' }],
        gatewayPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        gatewayId: [{ required: true, message: '请输入税局账号', trigger: 'blur' }],
      },
      taxInfo: {
        servicesId: this.$route.query.serviceId,
        vatTaxNumberFile: [],
        vatCertificate: [],
        eoriNumberFile: [],
        secret: '',
        deEuCertificate: [],
        vatTaxNumberCopyFile: [],
        authorizeFile: [],
        taxIssueDate: '',
        taxEffectiveDate: '',
      }, // 税号信息
      finishLoading: false,
    };
  },
  watch: {
    'dialog.progressModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this._getRejectCode(); //获取驳回节点
        }
      },
    },
    'dialog.showVatUkModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getSuppllier();
        }
      },
    },
    'dialog.taxInfoModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          let registerWorkOrder = { ...this.detailObj.registerWorkOrder };
          this.taxInfo = {
            servicesId: this.$route.query.serviceId,
            vatTaxNumberFile: this.urlFormat(registerWorkOrder.vatTaxNumberFile),
            vatCertificate: this.urlFormat(registerWorkOrder.vatCertificate),
            eoriNumberFile: this.urlFormat(registerWorkOrder.eoriNumberFile),
            deEuCertificate: this.urlFormat(registerWorkOrder.deEuCertificate),
            vatTaxNumberCopyFile: this.urlFormat(registerWorkOrder.vatTaxNumberCopyFile),
            authorizeFile: this.urlFormat(registerWorkOrder.authorizeFile),
            taxIssueDate: registerWorkOrder.taxIssueDate,
            taxEffectiveDate: registerWorkOrder.taxEffectiveDate,
            eoriNumber: registerWorkOrder.eoriNumber,
            gatewayId: registerWorkOrder.gatewayId,
            siretNumber: registerWorkOrder.siretNumber,
            gatewayPassword: registerWorkOrder.gatewayPassword,
            secret: registerWorkOrder.secret,
            vatTaxNumber: registerWorkOrder.vatTaxNumber,
          };
        }
      },
    },
  },

  created() {
    this.getCountry();
    this.getAddress();
  },
  methods: {
    /** 修改税号信息保存 */
    submitTaxInfo() {
      this.$refs.taxInfoForm.validate((valid) => {
        if (valid) {
          this.confirmTaxInfo();
        }
      });
    },
    confirmTaxInfo() {
      this.taxInfo.workId = this.serviceInfo.workflowId;
      this.taxInfo.countryCode = this.serviceInfo.countryCode;
      let deEuCertificate = this.fileFormat(this.taxInfo.deEuCertificate);
      let requestData = {
        ...this.taxInfo,
        servicesId: this.$route.query.serviceId,
        authorizeFile: this.fileFormat(this.taxInfo.authorizeFile),
        vatTaxNumberFile: this.fileFormat(this.taxInfo.vatTaxNumberFile),
        vatCertificate: this.fileFormat(this.taxInfo.vatCertificate),
        eoriNumberFile: this.fileFormat(this.taxInfo.eoriNumberFile),
        deEuCertificate: deEuCertificate == '' ? this.detailObj.registerWorkOrder.deEuCertificate : deEuCertificate,
        vatTaxNumberCopyFile: this.fileFormat(this.taxInfo.vatTaxNumberCopyFile),
      };
      this.updateTaxInfoFunc(requestData);
    },
    updateTaxInfoFunc(requestData) {
      updateInputTaxInfo(requestData)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('修改成功');
            this.dialog.taxInfoModel = false;
            this.dialog.editorTaxNumModel = false;
            if (this.autoFileModel) {
              this.autoFileModel = false;
            }
            this.getOrderDetail();
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    urlFormat(file) {
      let data = [];
      if (file === '') {
        // return data
      } else {
        let obj = {
          url: file,
          name: file,
        };
        data.push(obj);
      }
      return data;
    },

    fileFormat(file) {
      if (file) {
        return file.map((item) => item.url).join(',');
      } else {
        return '';
      }
    },
    /** 审核通过 意大利/法国 */
    approved() {
      workOrderCommonOperator('commit', {
        workOrderId: this.workOrderId,
        material: this.detailObj.materialData,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('审核成功');
            this.getOrderDetail();
            this.dialog.shenHeModel = false;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /** 完成转代理提交 */
    submitFile() {
      this.$refs.transForm.validate((valid) => {
        if (valid) {
          if (this.transForm.selectMonth && this.transForm.selectMonth.length) {
            var a = moment(this.transForm.selectMonth[0]);
            var b = moment(this.transForm.selectMonth[1]);
            var month = b.diff(a, 'month');
            if (this.detailObj.declarePeriod == 0 && month != 0) {
              return this.$message.error('月报申报周期必须等于1个月！');
            }
            if (this.detailObj.declarePeriod == 1 && month != 2) {
              return this.$message.error('季报申报周期必须等于3个月！');
            }
            if (this.detailObj.declarePeriod == 2 && month != 11) {
              return this.$message.error('年报申报周期必须等于12个月！');
            }
          }
          const { selectMonth, ...FormData } = this.transForm;
          if (this.vatTaxNumberFile) {
            this.finishLoading = true;
            submitTransProxy({
              workId: this.detailObj.workId,
              vatTaxNumberFile: this.vatTaxNumberFile.map((item) => item.url).join(','),
              plIban: FormData,
              declarePeriod: this.detailObj.declarePeriod,
              beginTime: this.transForm.selectMonth[0] + '-01 00:00:00',
              endTime: moment(this.transForm.selectMonth[1]).endOf('month').format('YYYY-MM-DD') + ' 00:00:00',
            })
              .then((res) => {
                this.finishLoading = false;
                if (res.code == 0) {
                  this.$message.success('操作成功');
                  this.dialog.finishModel = false;
                  this.getOrderDetail();
                }
              })
              .catch((err) => {
                this.finishLoading = false;
                this.$message.error(err.message);
              });
          } else {
            this.$message.warning('请上传税号文件');
          }
        }
      });
    },
    /** 获取服务商列表 */
    getSuppllier() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.detailObj.productFunctionCode,
        countryCode: this.detailObj.countryCode,
      }).then((res) => {
        this.supplierList = res.data.records;
      });
    },
    /** 修改服务商编码 */
    submitSupplierCode() {
      if (this.supplierAssignsCode != '') {
        updateSupplierCode({ workId: this.detailObj.workId, supplierAssignsCode: this.supplierAssignsCode })
          .then((res) => {
            if (res.code == 0) {
              this.$message.success('修改成功');
              this.dialog.ServiceModel = false;
              this.getOrderDetail();
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      } else {
        this.$message.warning('请输入服务商编码');
      }
    },
    /** 驳回 */
    submitReject() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          workOrderCommonOperator('reject', {
            serviceWorkOrderId: this.detailObj.orderId,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.dialog.progressModel = false;
                this.getOrderDetail();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    /**获取驳回节点 (驳回节点可能为空)*/
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.detailObj.currentNodeCode,
        nodeId: this.detailObj.nodeId,
        workFlowId: this.detailObj.workflowId,
      })
        .then((res) => {
          if (res.code == 0) {
            this.nodeName = res.data.nodeName;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /** 修改服务商 */
    submitApply() {
      this.$refs.shenHeform.validate((valid) => {
        if (valid) {
          batchModifyRtSupplier({
            serviceIds: [this.$route.query.serviceId],
            countryCode: this.serviceInfo.countryCode,
            functionCode: this.serviceInfo.productFunctionCode,
            curNodeCode: this.serviceInfo.cureentNodeCode,
            countryNameZh: this.serviceInfo.countryNameZh,
            newSupplierId: this.shenHeform.supplierId,
            newNodeCode: this.serviceInfo.cureentNodeCode,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.dialog.showVatUkModel = false;
                this.getOrderDetail();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    /** 修改服务商地址 */
    submitAddress() {
      saveRegistrarAddress({
        workId: this.detailObj.workId,
        registrarAddress: this.addressform.registrarAddress,
      })
        .then((res) => {
          this.$message.success('操作成功');
          this.dialog.addreModel = false;
          this.getOrderDetail();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    getAddress() {
      getSupplierById({
        id: this.detailObj.supplierId,
      }).then((res) => {
        if (res.data.registerAddress != '') {
          // this.addressList = JSON.parse(res.data.registerAddress);
          try {
            this.addressList = JSON.parse(res.data.registerAddress);
          } catch {
            this.addressList = res.data.registerAddress;
          }
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.ope-wrapper {
  max-height: 300px;
  overflow-y: auto;
  .ope-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    color: #666;
  }
}
</style>
