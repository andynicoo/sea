<!-- 签署合同 -->
<template>
  <div>
    <el-dialog title="签署合同" :visible.sync="visible" width="460px" @close="close">
      <el-row class="title bold">
        <el-col :span="12">订单号：{{ detailInfo.orderNo }}</el-col>
        <el-col :span="12">已付金额：{{ detailInfo.orderPaymentDetails[0].paymentAmount | formatQianFenWei }}元</el-col>
      </el-row>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="签订方式：" prop="contractSignType">
          <el-select placeholder="请选择" style="width: 300px" clearable filterable v-model="form.contractSignType">
            <el-option
              v-for="(item, index) in [
                { label: '电子合同签订', value: SIGNEM.ONLINE },
                { label: '线下签订', value: SIGNEM.OFFLINE },
              ]"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签订主体：" prop="contractSubjectType">
          <el-radio-group v-model="form.contractSubjectType" @change="resetContractSubjectId">
            <el-radio label="PERSON">个人签订</el-radio>
            <el-radio label="ENTERPRISE">企业签订</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-select :placeholder="'选择' + subjectTypeStr" style="width: 300px" clearable filterable v-model="form.contractSubjectId" @change="contractSubjectIdChange">
            <el-option v-for="(item, index) in subjectList" :key="index" :label="form.contractSubjectType == SUBJECTEM.PERSON ? item.contactPerson : item.companyName" :value="item.contractSubjectId"></el-option>
          </el-select>
          <el-link @click="addOrEditContractSubject" style="color: blueviolet" v-show="form.contractSubjectType == SUBJECTEM.ENTERPRISE || form.contractSubjectId">{{ form.contractSubjectId && form.contractSubjectType == SUBJECTEM.PERSON ? '编辑' : '新增' }}{{ subjectTypeStr }}</el-link>
        </el-form-item>
        <el-form-item v-if="form.contractSignType == SIGNEM.ONLINE" label="合同模板：" prop="templateId">
          <el-select placeholder="请选择" style="width: 300px" clearable filterable v-model="form.templateId" :rules="[{ required: true, message: '请选择合同模板', trigger: 'blur' }]">
            <el-option v-for="(item, index) in signTemplatesList" :key="index" :label="item.templateName" :value="item.templateId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="合同文件：" prop="contractOfflineUrl">
          <UploadFileUrl :drag="true" :showTip="false" :fileList.sync="form.contractOfflineUrl" :maxSize="20"> </UploadFileUrl>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitSigned" size="small" :loading="signedLoad">提 交</el-button>
      </span>
      <AddSignInfo v-if="showAddSignInfo" @sumbit="saveSignSubjectAPI" :title="(form.contractSubjectId ? '编辑' : '新增') + subjectTypeStr" :visible.sync="showAddSignInfo" :type="form.contractSubjectType" :checkedItem="checkedItem" />
    </el-dialog>
    <el-dialog :title="(form.contractSubjectType == this.SUBJECTEM.PERSON ? '个人' : '企业') + '签订'" :visible.sync="showSignInfo" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="460px">
      <el-form label-width="100px">
        <template v-if="form.contractSubjectType == this.SUBJECTEM.ENTERPRISE">
          <el-form-item label="企业名称：">
            <span>{{ checkedItem.companyName }}</span>
          </el-form-item>
          <el-form-item label="企业地址：">
            <span>{{ checkedItem.contactAddress }}</span>
          </el-form-item>
        </template>
        <el-form-item label="联系人：">
          <span>{{ checkedItem.contactPerson }}</span>
        </el-form-item>
        <el-form-item label="联系方式：">
          <span>{{ checkedItem.contactPhone }}</span>
        </el-form-item>
        <el-form-item label="联系地址：" v-if="form.contractSubjectType == this.SUBJECTEM.PERSON">
          <span>{{ checkedItem.contactAddress }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddSignInfo = true" size="small">修改</el-button>
        <el-button type="primary" @click="confirmSignInfo" size="small" :loading="signedLoad">确认无误</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { CONTRACTEM } from '@/libs/contractEM.js';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { signTemplatesApi, contractSignApi, getSignSubject } from '@/api/newApi/orderManage/salesorder.js';
import AddSignInfo from '@/components/signInfo/addSignInfo';
import { log } from 'mathjs';
export default {
  name: 'Contract',
  props: {
    signedModel: Boolean,
    detailInfo: { type: Object },
    userMobile: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      signedLoad: false,
      enterpriseId: this.$util.getLocalStorage('enterpriseId'),
      SUBJECTEM: CONTRACTEM.SUBJECTEM,
      SIGNEM: CONTRACTEM.SIGNEM,
      signTemplatesList: [], //合同模板
      subjectList: [],
      showAddSignInfo: false,
      form: {
        orderId: this.detailInfo.id,
        contractSubjectType: CONTRACTEM.SUBJECTEM.PERSON,
        contractSignType: CONTRACTEM.SIGNEM.ONLINE,
      },
      showSignInfo: false,
      checkedItem: {},
    };
  },
  components: {
    UploadFileUrl,
    AddSignInfo,
  },
  computed: {
    visible: {
      get() {
        return this.signedModel;
      },
      set(val) {
        // this.$parent.dialogShowObj.signedModel = val;
        this.$emit('update:signedModel', val);
      },
    },
    subjectTypeStr() {
      return this.form.contractSubjectType == this.SUBJECTEM.PERSON ? '联系人' : '公司';
    },
  },
  watch: {
    'form.contractSubjectType': function () {
      this.contractSubjectList();
    },
  },
  created() {
    this.getSignTemplates();
    this.contractSubjectList();
  },

  methods: {
    /**
     * 获取合同模板列表
     */
    async getSignTemplates() {
      let { data } = await signTemplatesApi({ enterpriseId: this.enterpriseId });
      this.signTemplatesList = data || [];
    },

    /**签署合同 */
    submitSigned() {
      let self = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.signTemplatesList, this.form.templateId);
          let templateId = this.form.templateId;
          if (templateId) {
            this.form.templateName = this.signTemplatesList.find((item) => item.templateId == templateId).templateName;
          }

          let { orderId } = this.detailInfo;
          this.contractSign({ ...self.form, enterpriseId: this.enterpriseId, orderId });
        }
      });
    },
    contractSign(data) {
      this.signedLoad = true;
      contractSignApi(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '该合同正在发送中，请稍后刷新页面!',
              type: 'success',
            });
            this.parentFn.getDeatilData();
          }
          this.visible = false;
          this.signedLoad = false;
        })
        .catch((err) => {
          this.visible = false;
          this.signedLoad = false;
        });
    },

    /**新建联系人 新建企业 */
    saveSignSubjectAPI(func) {
      let {
        form: { contractSubjectType },
      } = this;
      func(this.contractSubjectList, (data) => {
        this.checkedItem = data.form;
        return { userMobile: this.detailInfo.userMobile, contractSubjectType, contractSubjectId: null, ...data.form };
      });
    },
    /** 获取 联系人企业列表*/
    async contractSubjectList() {
      let {
        detailInfo: { userMobile },
        form: { contractSubjectType },
      } = this;
      let { data } = await getSignSubject({ userMobile, contractSubjectType });
      this.subjectList = data || [];
    },
    addOrEditContractSubject() {
      if (!this.form.contractSubjectId) {
        this.checkedItem = {};
      }
      this.showAddSignInfo = true;
    },
    contractSubjectIdChange() {
      if (this.form.contractSubjectId) {
        this.checkedItem = this.subjectList.find((item) => item.contractSubjectId === this.form.contractSubjectId);
        this.showSignInfo = true;
      } else {
        this.checkedItem = {};
      }
    },
    confirmSignInfo() {
      if (!this.checkedItem.contactPerson) {
        this.$message.warning('请点击修改补全信息');
        return;
      }
      this.showSignInfo = false;
    },
    resetContractSubjectId() {
      this.form.contractSubjectId = '';
      this.checkedItem = {};
    },
    close() {
      this.visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  margin: 0 0px 10px 0px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 30px;
  }
}
</style>
