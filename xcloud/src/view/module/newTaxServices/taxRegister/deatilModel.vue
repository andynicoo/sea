<template>
  <div class="model">
    <!-- 服务商编码弹窗 -->
    <el-dialog title="修改服务商分配编码" :visible.sync="dialog.ServiceModel" width="400px">
      <el-input v-model="supplierAssignsCode" size="small" placeholder="请输入服务商分配编码" />
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.ServiceModel = false">取消</el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitSupplierCode">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改服务商 -->
    <el-dialog title="修改服务商" :visible.sync="dialog.showVatUkModel" width="400px">
      <el-form :model="shenHeform" :rules="ruleShenHeform" label-width="130px" ref="shenHeform">
        <el-form-item label="国家：">{{ detailObj.countryNameZh }}</el-form-item>
        <el-form-item label="选择服务商：" prop="supplierId">
          <el-select v-model="shenHeform.supplierId" clearable filterable>
            <el-option v-for="(item, key) in supplierList" :key="key" :value="item.supplierId" :label="item.shortName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.showVatUkModel = false"> 取消 </el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitApply">保存</el-button>
      </div>
    </el-dialog>
    <!-- 上传翻译件 -->
    <el-dialog title="上传翻译件" :visible.sync="dialog.uploadFileModel" width="400px" @close="closeFile">
      <div style="text-align: center">
        <UploadFile :fileClass="true" :showTip="true" :maxSize="50" :limit="detailObj.countryCode === 'FR' ? 10 : 1" :fileList.sync="translationFile"></UploadFile>
      </div>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.uploadFileModel = false"> 取消 </el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitUploadFile">保存</el-button>
      </div>
    </el-dialog>
    <!-- 查看翻译件 -->
    <el-dialog title="查看翻译件" :visible.sync="dialog.seeFileModel" width="650px">
      <el-table :data="translateList" border>
        <div slot="empty" v-if="['FR'].includes(detailObj.countryCode)">
          <span style="width: 360px; display: inline-block"> 暂无 </span>
          <span style="width: 249px; display: inline-block">
            <el-link type="primary" :underline="false" @click="updateMutlFile()"> 上传翻译件 </el-link>
          </span>
        </div>
        <Empty slot="empty" v-else />
        <el-table-column align="center" label="文件名称" show-overflow-tooltip>
          <template slot-scope="scope">翻译件 {{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">
              <a :href="scope.row" target="_blank"> 查看 </a>
            </el-link>
            <el-link type="primary" :underline="false" target="_blank" @click="download(scope.row)">
              <!-- <a :href="scope.row"  target="_blank" > -->
              下载
              <!-- </a> -->
            </el-link>
            <el-link type="primary" :underline="false" @click="updateFile(scope.row, scope.$index + 1)"> 修改 </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.seeFileModel = false">取消</el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="dialog.seeFileModel = false">保存</el-button>
      </div>
    </el-dialog>
    <!-- 录入SIRET号 -->
    <el-dialog title="录入SIRET号" :visible.sync="dialog.siretModel" width="400px" @close="closeSiret">
      <el-form label-width="120px" :model="siretfrom" ref="siretfrom" :rules="rulesSiretfrom">
        <el-form-item label="税号生效日期：" prop="taxEffectiveDate">
          <el-date-picker v-model="siretfrom.taxEffectiveDate" type="datetime" placeholder="请选择税号生效日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 220px"></el-date-picker>
        </el-form-item>
        <el-form-item label="SIRET号：" prop="siretNumber">
          <el-input v-model="siretfrom.siretNumber" placeholder="请输入法国SIRET号" style="width: 220px" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.siretModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitServiceID">保存</el-button>
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
        <el-button size="small" style="width: 65px" type="default" @click="dialog.progressModel = false"> 取消 </el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitReject">保存</el-button>
      </div>
    </el-dialog>
    <!-- 录入税号信息 -->
    <el-dialog :title="editorTaxNumModel ? '修改税号信息' : '录入税号信息'" :visible.sync="dialog.taxInfoModel" width="650px" @close="closeTaxInfo">
      <el-form label-width="130px" style="max-height: 500px; overflow: auto" ref="taxInfoForm" :rules="taxInfoForm" :model="taxInfo">
        <el-form-item label="注册国家：" v-if="detailObj.functionCode == 23 && !dialog.editorTaxNumModel">
          {{ detailObj.countryNameZh }}
        </el-form-item>
        <el-form-item label="国家：" v-else>{{ detailObj.countryNameZh }}</el-form-item>
        <el-form-item label="税号：" prop="vatTaxNumber">
          <!-- 英国税号不支持存在空格，针对英国做去空格处理 -->
          <el-input v-model.trim="taxInfo.vatTaxNumber" :disabled="editorTaxNumModel" placeholder="请输入税号" style="width: 300px" v-if="detailObj.countryNameZh == '英国'" />
          <el-input v-model="taxInfo.vatTaxNumber" :disabled="editorTaxNumModel" placeholder="请输入税号" style="width: 300px" v-else />
        </el-form-item>
        <el-form-item label="SIRET号：" prop="siretNumber" v-if="detailObj.countryCode === 'FR' && editorTaxNumModel">
          <el-input v-model="taxInfo.siretNumber" :disabled="editorTaxNumModel" placeholder="请输入SIRET号" style="width: 300px" />
        </el-form-item>
        <el-form-item label="税号下发日期：" prop="taxIssueDate">
          <el-date-picker v-model="taxInfo.taxIssueDate" type="date" placeholder="请选择税号下发日期" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss" :disabled="editorTaxNumModel"></el-date-picker>
          <Tooltip content="自动获取当天日期" placement="top">
            <i class="el-icon-question" style="color: #e6a23c; padding: 0 12px"></i>
          </Tooltip>
        </el-form-item>
        <el-form-item label="税号生效日期：" prop="taxEffectiveDate">
          <el-date-picker v-model="taxInfo.taxEffectiveDate" type="date" placeholder="请选择税号生效日期" style="width: 300px" value-format="yyyy-MM-dd HH:mm:ss" :disabled="editorTaxNumModel"></el-date-picker>
          <Tooltip content="自动获取客户填写的税号生效日期" placement="top">
            <i class="el-icon-question" style="color: #e6a23c; padding: 0 12px"></i>
          </Tooltip>
        </el-form-item>
        <el-form-item label="EORI号：" v-if="detailObj.countryCode != 'AE' && detailObj.countryCode != 'SA'">
          <el-input v-model="taxInfo.eoriNumber" placeholder="请输入EORI号" style="width: 300px" />
        </el-form-item>
        <el-form-item label="税号文件：">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatTaxNumberFile"></UploadFile>
        </el-form-item>
        <el-form-item label="VAT证书：" v-if="['GB', 'DE', 'IT', 'ES', 'FR', 'PL', 'NL', 'CZ', 'AT'].includes(detailObj.countryCode) && detailObj.functionCode == 5">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatCertificate"></UploadFile>
        </el-form-item>
        <el-form-item label="EORI文件：" v-if="['IT', 'GB', 'ES', 'FR', 'PL', 'NL', 'CZ', 'AT', 'DE'].includes(detailObj.countryCode) && detailObj.functionCode == 5">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.eoriNumberFile"></UploadFile>
        </el-form-item>
        <!-- <el-form-item label="注册授权书：" v-if="detailObj.countryCode == 'IT' ">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.authorizeFile"></UploadFile>
        </el-form-item> -->
        <el-form-item prop="gatewayId" label="gateway 账号：" v-if="detailObj.countryCode == 'GB' && (detailObj.functionCode == 2 || detailObj.functionCode == 5)">
          <el-input v-model="taxInfo.gatewayId" placeholder="请输入gateway ID" style="width: 300px" />
        </el-form-item>
        <el-form-item prop="gatewayPassword" label="gateway密码：" v-if="detailObj.countryCode == 'GB' && (detailObj.functionCode == 2 || detailObj.functionCode == 5)">
          <el-input v-model="taxInfo.gatewayPassword" placeholder="请输入gateway密码" style="width: 300px" />
        </el-form-item>
        <el-form-item prop="secret" label="密钥：" v-if="detailObj.countryCode == 'GB' && (detailObj.functionCode == 2 || detailObj.functionCode == 5)">
          <el-input v-model="taxInfo.secret" placeholder="请输入密钥" style="width: 300px" />
        </el-form-item>
        <el-form-item label="DE欧盟证书：" v-if="detailObj.countryCode == 'DE' && detailObj.functionCode == 5">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.deEuCertificate"></UploadFile>
        </el-form-item>
        <el-form-item label="税务副本：" v-if="detailObj.countryCode == 'DE' && detailObj.functionCode == 5">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.vatTaxNumberCopyFile"></UploadFile>
        </el-form-item>
        <el-form-item label="欧盟税号：" prop="vatTaxEuNumber" v-if="(detailObj.countryCode == 'ES' || detailObj.countryCode == 'AT') && detailObj.functionCode == 5">
          <Input v-model="taxInfo.vatTaxEuNumber" style="width: 220px" placeholder="请输入欧盟税号" />
        </el-form-item>
        <el-form-item label="欧盟税号证书：" v-if="(detailObj.countryCode == 'ES' || detailObj.countryCode == 'AT') && detailObj.functionCode == 5">
          <UploadFile :fileClass="true" :showTip="true" :fileList.sync="taxInfo.deEuCertificate"></UploadFile>
        </el-form-item>

        <template v-if="detailObj.functionCode == 5 && (detailObj.countryCode == 'SA' || detailObj.countryCode == 'AE')">
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
    <!-- 填写申报 -->
    <el-dialog title="填写申报周期" :visible.sync="dialog.declareModel" width="650px">
      <el-form label-width="190px" :model="declaraForm" ref="declaraForm" :rules="ruleDeclaraForm">
        <el-form-item label="周期类型：" prop="declarePeriod">
          <el-select style="width: 250px" v-model="declaraForm.declarePeriod" filterable>
            <el-option v-for="(item, index) in declareList" :key="index" :label="item.type" :value="item.status"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下一次申报周期：" prop="time">
          <el-date-picker v-if="['SA', 'AE'].includes(detailObj.countryCode)" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 250px" value-format="yyyy-MM-dd HH:mm:ss" v-model="declaraForm.time"></el-date-picker>
          <el-date-picker v-else v-model="declaraForm.time" type="monthrange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"> </el-date-picker>
        </el-form-item>
        <div v-if="detailObj.countryCode == 'PL'">
          <!-- <el-form-item label="银行名称（Bank Name）：">
            <el-input v-model="declaraForm.bureauBankName"></el-input>
          </el-form-item> -->
          <el-form-item label="银行账号（IBAN）：" prop="bureauBankAccount">
            <el-input placeholder="请填写银行账号" v-model="declaraForm.bureauBankAccount"></el-input>
          </el-form-item>
          <!-- <el-form-item label="BIC：">
            <el-input v-model="declaraForm.bureauSwiftBic"></el-input>
          </el-form-item>
          <el-form-item label="银行地址（Bank Address）：">
            <el-input v-model="declaraForm.bureauBankAddress"></el-input>
          </el-form-item> -->
        </div>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.declareModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitTax" :loading="declareLoading"> 保存 </el-button>
      </div>
    </el-dialog>
    <!-- 修改服务商地址 -->
    <el-dialog title="修改服务商地址" :visible.sync="dialog.addreModel" center width="450px">
      <el-form :model="addressform" label-width="120px">
        <el-form-item label="选择注册地址：" prop="registrarAddress" :rules="[{ required: true, message: '地址不能为空' }]">
          <el-select style="width: 220px" v-model="addressform.registrarAddress" placeholder="国家" filterable>
            <el-option v-for="(item, index) in addressList" :key="index" :label="item.registerAddress" :value="item.registerAddress"></el-option>
          </el-select>
          <p class="text-desc">注：英国为API报税，需选择注册地址</p>
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
        <el-button size="small" style="width: 65px" type="primary" @click="approved">确定</el-button>
      </div>
    </el-dialog>

    <!-- 上传DE欧盟证书 -->
    <el-dialog title="上传DE欧盟证书" :visible.sync="dialog.uploadDEEUCertificate" width="400px" @close="closeFile">
      <div style="text-align: center">
        <UploadFile :fileClass="true" :maxSize="100" :showTip="true" :fileList.sync="deCertificate"></UploadFile>
      </div>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" type="default" @click="dialog.uploadDEEUCertificate = false"> 取消 </el-button>
        <el-button size="small" style="width: 65px" type="primary" @click="submitUploadDEFile">保存</el-button>
      </div>
    </el-dialog>

    <!-- 是否自动生成税号文件 -->
    <el-dialog title="提示" :visible.sync="autoFileModel" width="400px">
      <el-form label-width="300px" label-position="top">
        <el-form-item label="是否自动生成税号文件：" prop="isMakeTaxNumberFile">
          <el-radio v-model="isMakeTaxNumberFile" :label="true">是</el-radio>
          <br />
          <el-radio v-model="isMakeTaxNumberFile" :label="false">否，人工上传</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="autoFileModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitFile">确认</el-button>
      </div>
    </el-dialog>

    <!--录入邮箱小弹窗 -->
    <el-dialog title="录入邮箱" :visible.sync="dialog.uploadMailbox" width="450px">
      <p class="usre-email-dialog-style">注：此邮箱用于接收税局调查问卷</p>
      <el-form ref="userUpdateEmailFrom" :model="userEmail" :rules="userUpdateEmailFrom" label-width="100px">
        <el-form-item label="邮箱地址:" prop="address">
          <el-input v-model="userEmail.address" placeholder="请输入接收税局调查问卷" />
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.uploadMailbox = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="saveMailbox">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { updateTranslate, taxReporting, updateInputTaxInfo, updateTaxInfoDefile, saveRegistrarEmail } from '@/api/newApi/taxServices/taxRegister.js';
import { updateSupplierCode, changeSiret, auditInfo, updateSupplier, saveRegistrarAddress, changeVatInfo } from '@/api/newApi/taxServices/serviceManage.js';
import UploadImages from '@/components/UploadImgs/index'; // 上传图片组件
import UploadFile from '@/components/UploadFile'; // 上传文件组件
import { statusNodeCode } from './staticList';
import { getRejectCode, getCountrySelectList } from '@/api/newApi/common.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { getSupplierById } from '@/api/newApi/supplyChain/serviceproviderManage.js';
import { batchModifyRtSupplier } from '@/api/newApi/taxServices/taxRegister.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import moment from 'moment';
export default {
  components: { UploadImages, UploadFile },
  props: {
    dialog: { type: Object },
    orderServices: { type: Object },
    getWorkOrderDetail: { type: Function },
    translateList: { type: Array },
    serviceInfo: { type: Object },
    workOrderId: [String, Number],
    detailObj: { type: Object },
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb();
      }
      cb(new Error('请录入正确的邮箱'));
    };
    return {
      countrySelect: [], // 国家列表
      supplierList: [],
      taxStatus: statusNodeCode,
      serviceId: this.$route.query.serviceId,
      imgUrl: '',
      translationFile: [], // 翻译件
      deCertificate: [], // DE证书
      supplierFrom: {}, // 修改服务商
      addressform: {}, // 服务商地址
      supplierAssignsCode: '', // 服务商编码弹窗
      siretfrom: {
        // 录入siret税号信息
        siretNumber: '',
      },
      taxInfo: {
        servicesId: this.$route.query.serviceId,
        vatTaxNumberFile: [],
        vatCertificate: [],
        eoriNumberFile: [],
        deEuCertificate: [],
        vatTaxNumberCopyFile: [],
        // authorizeFile: [],
        taxIssueDate: '',
        taxEffectiveDate: '',
      }, // 税号信息
      shenHeform: {
        // 修改服务商
        countryCode: this.detailObj.countryCode,
        supplierId: this.detailObj.supplierId,
        serviceId: this.$route.query.serviceId,
        status: 1,
      },
      needApiIT: false,
      nodeName: '',
      progress: {
        sendMsg: false,
      },
      declaraForm: {}, // 申报周期
      declareList: [],
      addressList: [], // 服务商地址
      ruleDeclaraForm: {
        declarePeriod: [{ required: true, message: '请选择周期类型', trigger: 'change' }],
        time: [{ required: true, message: '请选择申报周期', trigger: 'change' }],
        bureauBankAccount: [{ required: true, message: '请填写银行账号', trigger: 'blue' }],
      },
      ruleShenHeform: {
        countryCode: [{ required: true, message: '请选择', trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      // 录入siret
      rulesSiretfrom: {
        siretNumber: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        taxEffectiveDate: [{ required: true, message: '请选择税号生效日期', trigger: 'change' }],
      },
      // 税号信息校验
      taxInfoForm: {
        vatTaxNumber: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        taxIssueDate: [{ required: true, message: '请选择税号下发日期', trigger: 'change' }],
        taxEffectiveDate: [{ required: true, message: '请选择税号生效日期', trigger: 'change' }],
        siretNumber: [{ required: true, message: '请输入SIRET号', trigger: 'blur' }],
        gatewayPassword: [{ required: true, message: '请输入gateway密码', trigger: 'blur' }],
        vatTaxEuNumber: [{ max: 50, message: '长度小于50个字符', trigger: 'blur' }],
        gatewayId: [{ required: true, message: '请输入gateway账号', trigger: 'blur' }],
        secret: [{ required: true, message: '请输入密钥', trigger: 'blur' }],
      },
      editorTaxNumModel: false,
      declareLoading: false,
      isMakeTaxNumberFile: true,
      autoFileModel: false,
      // 修改用户邮箱
      userEmail: {
        address: '',
      },
      userUpdateEmailFrom: {
        address: [
          {
            required: true,
            message: '请录入邮箱',
            trigger: 'blur',
          },
          { validator: checkEmail, trigger: 'blur' },
        ],
      },
    };
  },
  watch: {
    'dialog.uploadMailbox': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.userEmail.address = this.detailObj.email;
        }
      },
    },
    'dialog.progressModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this._getRejectCode(); // 获取驳回节点
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
    'dialog.uploadFileModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.translationFile = [];
        }
      },
    },
    'dialog.editorTaxNumModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.editorTaxNumModel = newVal;
          this.taxInfo = {
            servicesId: this.$route.query.serviceId,
            vatTaxNumberFile: this.urlFormat(this.detailObj.vatTaxNumberFile),
            vatCertificate: this.urlFormat(this.detailObj.vatCertificate),
            eoriNumberFile: this.urlFormat(this.detailObj.eoriNumberFile),
            deEuCertificate: this.urlFormat(this.detailObj.deEuCertificate),
            vatTaxNumberCopyFile: this.urlFormat(this.detailObj.vatTaxNumberCopyFile),
            // authorizeFile: this.urlFormat(this.detailObj.authorizeFile),
            taxIssueDate: this.detailObj.taxIssueDate,
            vatTaxEuNumber: this.detailObj.vatTaxEuNumber,
            taxEffectiveDate: this.detailObj.taxEffectiveDate,
            eoriNumber: this.detailObj.eoriNumber,
            gatewayId: this.detailObj.gatewayId,
            gatewayPassword: this.detailObj.gatewayPassword,
            secret: this.detailObj.secret,
            siretNumber: this.detailObj.siretNumber,
            vatTaxEuNumber: this.detailObj.vatTaxEuNumber,
            vatTaxNumber: this.detailObj.vatTaxNumber,
          };
        }
      },
    },
    'dialog.taxInfoModel': {
      handler(newVal, oldVal) {
        if (newVal && !this.dialog.editorTaxNumModel) {
          this.taxInfo.taxIssueDate = moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00';
          try {
            let materialData = JSON.parse(this.detailObj.materialData);
            if (materialData.taxEffectiveDate) {
              this.taxInfo.taxEffectiveDate = materialData.taxEffectiveDate + ' 00:00:00';
            }
          } catch (error) {}
        }
      },
    },
  },
  created() {
    this.getCountry();
    this.getAddress();
  },
  methods: {
    /**邮箱 */
    saveMailbox() {
      this.$refs.userUpdateEmailFrom.validate((valid) => {
        if (valid) {
          this.saveRegistrarEmailApi();
        }
      });
    },

    async saveRegistrarEmailApi() {
      try {
        let { code, message } = await saveRegistrarEmail({
          email: this.userEmail.address,
          workId: this.workOrderId,
        });
        code === 0 ? this.$message.success('邮箱添加成功') : this.$message.error(message);
        this.dialog.uploadMailbox = false;
      } catch (err) {
        this.$message.error('数据异常，请联系管理员');
      } finally {
        this.getWorkOrderDetail();
      }
    },
    /** 审核通过 意大利/法国 */
    approved() {
      workOrderCommonOperator('commit', {
        workOrderId: this.workOrderId,
        material: this.detailObj.materialData,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('审核成功');
          this.getWorkOrderDetail();
          this.dialog.shenHeModel = false;
        }
      });
    },
    /** 填写申报区间 */
    submitTax() {
      this.$refs.declaraForm.validate((valid) => {
        if (valid) {
          let beginTime = '';
          let endTime = '';
          if (this.detailObj.countryCode != 'AE' && this.detailObj.countryCode != 'SA') {
            beginTime = this.declaraForm.time[0] + ' 00:00:00';
            endTime = moment(this.declaraForm.time[1]).endOf('month').format('YYYY-MM-DD') + ' 00:00:00';
          } else {
            beginTime = this.declaraForm.time[0];
            endTime = this.declaraForm.time[1];
          }
          this.declareLoading = true;
          taxReporting({
            regServiceId: this.detailObj.serviceId,
            declarePeriod: this.declaraForm.declarePeriod,
            beginTime,
            endTime,
            bureauBankName: this.declaraForm.bureauBankName,
            bureauBankAccount: this.declaraForm.bureauBankAccount,
            bureauSwiftBic: this.declaraForm.bureauSwiftBic,
            bureauBankAddress: this.declaraForm.bureauBankAddress,
          })
            .then((res) => {
              this.declareLoading = false;
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.dialog.declareModel = false;
                this.$router.push({ path: '/newTaxServices/taxRegister/index' });
              }
            })
            .finally((err) => {
              this.declareLoading = false;
            });
        }
      });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList().then((res) => {
        this.countrySelect = res.data;
        let taxtype = this.countrySelect.find((item) => item.countryCode == this.detailObj.countryCode).taxPeriod;
        let taxPeriod = [...taxtype];
        taxPeriod.forEach((item) => {
          if (item === '0') this.declareList.push({ type: '月报', status: '0' });
          if (item === '1') this.declareList.push({ type: '季报', status: '1' });
          if (item === '2') this.declareList.push({ type: '年报', status: '2' });
        });
      });
    },
    /** 获取服务商列表 */
    getSuppllier() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.detailObj.functionCode,
        countryCode: this.detailObj.countryCode,
      }).then((res) => {
        this.supplierList = res.data.records;
      });
    },
    /** 修改服务商 */
    submitApply() {
      this.$refs.shenHeform.validate((valid) => {
        if (valid) {
          batchModifyRtSupplier({
            serviceIds: [this.$route.query.serviceId],
            countryCode: this.detailObj.countryCode,
            functionCode: this.detailObj.functionCode,
            curNodeCode: this.detailObj.cureentNodeCode,
            countryNameZh: this.detailObj.countryNameZh,
            newSupplierId: this.shenHeform.supplierId,
            newNodeCode: this.detailObj.cureentNodeCode,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功');
              this.dialog.showVatUkModel = false;
              this.getWorkOrderDetail();
            }
          });
        }
      });
    },
    /** 修改服务商地址 */
    submitAddress() {
      saveRegistrarAddress({
        workId: this.detailObj.workId,
        registrarAddress: this.addressform.registrarAddress,
      }).then((res) => {
        this.$message.success('操作成功');
        this.dialog.addreModel = false;
        this.getWorkOrderDetail();
      });
    },
    getAddress() {
      getSupplierById({
        id: this.detailObj.supplierId,
      }).then((res) => {
        if (res.data.registerAddress != '') {
          this.addressList = JSON.parse(res.data.registerAddress);
        }
      });
    },
    /** 驳回 */
    submitReject() {
      workOrderCommonOperator('reject', {
        serviceWorkOrderId: this.detailObj.orderId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功');
          this.dialog.progressModel = false;
          this.getWorkOrderDetail();
        }
      });
    },
    /** 获取驳回节点 (驳回节点可能为空) */
    _getRejectCode() {
      getRejectCode({
        nodeCode: this.detailObj.currentNodeCode,
        nodeId: this.detailObj.nodeId,
        workFlowId: this.detailObj.workflowId,
      }).then((res) => {
        if (res.code == 0) {
          this.nodeName = res.data.nodeName;
        }
      });
    },
    download(row) {
      this.$util.downloadFile(row);
    },
    /** 修改服务商编码 */
    submitSupplierCode() {
      if (this.supplierAssignsCode != '') {
        updateSupplierCode({ workId: this.detailObj.workId, supplierAssignsCode: this.supplierAssignsCode }).then((res) => {
          if (res.code == 0) {
            this.$message.success('修改成功');
            this.dialog.ServiceModel = false;
            if (this.getWorkOrderDetail) {
              this.getWorkOrderDetail();
            }
            this.$emit('refresh');
          }
        });
      } else {
        this.$message.warning('请输入服务商编码');
      }
    },
    /** 录入SIRET号 */
    submitServiceID() {
      this.$refs.siretfrom.validate((valid) => {
        if (valid) {
          changeSiret({
            ...this.siretfrom,
            countryCode: this.detailObj.countryCode,
            workId: this.detailObj.workId,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('录入成功');
              this.dialog.siretModel = false;
              this.getWorkOrderDetail();
            }
          });
        }
      });
    },
    /** 录入税号信息保存 */
    submitTaxInfo() {
      this.$refs.taxInfoForm.validate((valid) => {
        if (valid) {
          if (this.editorTaxNumModel && this.detailObj.countryCode == 'FR' && this.detailObj.companyNameEn && this.detailObj.vatTaxNumber && this.detailObj.siretNumber && this.taxInfo.taxEffectiveDate) {
            this.autoFileModel = true;
            return;
          }
          this.confirmTaxInfo();
        }
      });
    },
    submitFile() {
      this.confirmTaxInfo(true);
    },
    confirmTaxInfo(flag) {
      this.taxInfo.workId = this.detailObj.workId;
      this.taxInfo.countryCode = this.detailObj.countryCode;
      let deEuCertificate = this.fileFormat(this.taxInfo.deEuCertificate);
      let requestData = {
        ...this.taxInfo,
        isUpdate: this.editorTaxNumModel ? true : false,
        // authorizeFile: this.fileFormat(this.taxInfo.authorizeFile),
        vatTaxNumberFile: this.fileFormat(this.taxInfo.vatTaxNumberFile),
        vatCertificate: this.fileFormat(this.taxInfo.vatCertificate),
        eoriNumberFile: this.fileFormat(this.taxInfo.eoriNumberFile),
        deEuCertificate: deEuCertificate ? this.detailObj.deEuCertificate : deEuCertificate,
        vatTaxNumberCopyFile: this.fileFormat(this.taxInfo.vatTaxNumberCopyFile),
      };
      if (flag) {
        requestData.isMakeTaxNumberFile = this.isMakeTaxNumberFile;
      }
      this.updateTaxInfoFunc(requestData);
    },
    // 清空税号数据
    closeTaxInfo() {
      this.$emit('closeModal', true);
    },
    // inputTaxInfoFunc(requestData) {
    //   changeVatInfo(requestData).then((res) => {
    //     if (res.code == 0) {
    //       this.$message.success('录入成功');
    //       this.dialog.taxInfoModel = false;
    //       this.getWorkOrderDetail();
    //     }
    //   });
    // },
    updateTaxInfoFunc(requestData) {
      changeVatInfo(requestData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功');
          this.dialog.taxInfoModel = false;
          this.dialog.editorTaxNumModel = false;
          if (this.autoFileModel) {
            this.autoFileModel = false;
          }
          if (this.getWorkOrderDetail) {
            this.getWorkOrderDetail();
          }
          this.$emit('refresh');
        }
      });
    },

    fileFormat(file) {
      if (file) {
        return file.map((item) => item.url).join(',');
      } else {
        return '';
      }
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
    /** 上传翻译件 */
    submitUploadFile() {
      updateTranslate({
        workId: this.detailObj.workId,
        translationFile: this.translationFile.map((item) => item.url).join(','),
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('上传成功');
          this.dialog.uploadFileModel = false;
          this.dialog.seeFileModel = false;
        }
      });
    },

    /**
     * 上传DE欧盟证书
     */
    async submitUploadDEFile() {
      let file = this.deCertificate.map((item) => item.url).join(',');
      if (!file) {
        this.$message.warning('请先选择文件');
        return;
      }
      let { message, code } = await changeVatInfo({
        isUpdate: true,
        workId: this.detailObj.workId,
        deEuCertificate: file,
      });
      if (code == 0) {
        this.dialog.uploadDEEUCertificate = false;
        this.$message.success('上传成功');
        this.$emit('refresh');
      }
    },

    /** 修改翻译件 */
    updateFile(row, index) {
      this.translationFile = [];
      this.dialog.uploadFileModel = true;
      this.translationFile.push({ url: row, name: '翻译件' + index });
    },
    updateMutlFile() {
      this.dialog.uploadFileModel = true;
    },
    closeFile() {
      this.translationFile = [{ url: '' }];
    },

    closeSiret() {
      this.siretfrom.siretNumber = '';
    },
    uploadSuccess(filelist) {
      this.translationFile = filelist;
    },
  },
};
</script>
<style scoped lang="scss">
.usre-email-dialog-style {
  color: #e57910;
  padding-left: 6%;
}
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

/deep/ .el-table__empty-text {
  width: 100%;
}
</style>
