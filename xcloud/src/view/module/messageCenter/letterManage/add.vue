<template>
  <div class="app-container">
    <div class="header-container">
      <div class="back" @click="navigate()">
        <Icon type="ios-arrow-back" />
        发送信件
      </div>
      <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="130px">
        <FormTitle value="选择客户" style="margin: 20px" />
        <el-form-item label="发送方式" prop="sendMethod">
          <el-radio-group v-model="form.sendMethod" @change="sendMethodChange">
            <el-radio :label="1">单个发送</el-radio>
            <el-radio :label="2">批量发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传收件人名单" prop="recipientsFile" key="recipientsFile" v-if="form.sendMethod == 2">
          <div style="display: flex">
            <UploadFile :fileList.sync="form.recipientsFile" :limit="1" :maxSize="100"></UploadFile>
            <i class="el-icon-warning tip-icon"></i>
            <span>
              <div class="text-tips item-tip">
                <p style="color: orange">注：</p>
                <p>
                  1.
                  <el-link type="primary" @click="downloadTemplate"> 下载模板 </el-link>
                </p>
                <p>2. 请正确填写收件人税号，若无法匹配到正确税号，客户将不会收到信件</p>
              </div>
            </span>
          </div>
        </el-form-item>
        <template v-else>
          <el-form-item label="VAT税号" key="vatTaxNumber" prop="vatTaxNumber">
            <el-input v-model="form.vatTaxNumber" clearable placeholder="请输入VAT税号" style="width: 300px" size="small" @input="vatTaxNumberInputDebounce" />
          </el-form-item>
          <el-form-item label="税号对应国家" prop="taxCountryCode" key="taxCountryCode">
            <el-select placeholder="请选择" size="small" style="width: 300px" clearable v-model="form.taxCountryCode" filterable @change="(e) => getUserMobile('taxCountryCode', e)">
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户手机号" prop="taxUserMobileInfo" key="taxUserMobileInfo">
            <el-select placeholder="请选择" size="small" style="width: 300px" clearable value-key="serviceNo" v-model="form.taxUserMobileInfo" @change="taxUserMobileChange()">
              <el-option v-for="(item, index) in taxUserMobileList" :key="index" :value="item" :label="item.userMobile"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户公司名称" prop="companyNameZh" key="companyNameZh">
            <el-input v-model="form.companyNameZh" clearable placeholder="请输入客户公司名称" style="width: 300px" size="small" disabled />
          </el-form-item>
        </template>
        <FormTitle value="编辑信件" style="margin: 20px" />
        <el-form-item label="信件类型" prop="type" key="type">
          <el-select style="width: 300px" size="small" v-model="form.type" filterable @change="letterTypeChange">
            <el-option v-for="(item, index) in letterTypeList" :key="index" :label="item.letterType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信件内容" prop="processSuggestions" key="processSuggestions">
          <el-input v-model="form.processSuggestions" type="textarea" placeholder="请输入信件内容" clearable style="width: 600px" rows="8" size="small" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="是否需处理" prop="processStatus">
          <el-radio-group v-model="form.processStatus">
            <el-radio :label="0">无需处理</el-radio>
            <el-radio :label="1">需要用户处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附件是否相同" prop="annex" v-if="form.sendMethod == 2">
          <el-radio-group v-model="form.annex" @change="annexChange">
            <el-radio :label="1">不同收件人，附件相同或无附件</el-radio>
            <el-radio :label="2">不同收件人，附件不相同</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="信件接收时间" prop="receiveTime">
          <el-date-picker
            v-model="form.receiveTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            placeholder="请选择时间"
            style="width: 300px"
            align="right"
            size="small"
            unlink-panels
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="上传附件" prop="letterFile">
          <div style="display: flex">
            <UploadFile :fileList.sync="form.letterFile" :limit="1" accept=".zip" :maxSize="200" v-if="form.annex == 2"></UploadFile>
            <UploadFile :fileList.sync="form.letterFile" :limit="Infinity" :maxSize="100" v-else></UploadFile>
            <i class="el-icon-warning tip-icon"></i>
            <span>
              <div class="text-tips item-tip">
                <p style="color: orange">注：</p>
                <template v-if="form.annex == 2">
                  <p>1. 限制上传1个压缩文件</p>
                  <p>2. 压缩包内文件以【税号_文件名】命名，通过税号匹配客户</p>
                  <p>3. 一个客户可以匹配多个文件</p>
                </template>
                <p v-else>可以上传多份附件</p>
              </div>
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button type="primary" size="small" @click="submit(1)" :loading="submitLoading">发送</el-button>
        <!-- <el-button size="small" @click="submit(0)" v-if="showSave">保存</el-button> -->
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import FormTitle from '@/components/WorkOrderComponents/FormTitle/index';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getStationLetterInfo, addStationLetter, updateStationLetter, getUserMobileApi, getTemplateListApi, getOrderServicesByVatTaxNumbersApi } from '@/api/newApi/messageCenter/letterManage';
import { Debounce } from '@/libs/throttle';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      id: this.$route.params.id || 0,
      taxUserMobileList: [],
      form: {
        isSend: '',
        letterFile: [],
        processStatus: 1,
        processSuggestions: '',
        receiveTime: '',
        taxCountryCode: '',
        taxUserMobileInfo: null,
        type: '',
        vatTaxNumber: '',
        companyNameZh: '',
        annex: '',
        recipientsFile: [],
        sendMethod: 1,
      },
      letterTypeList: [],
      countrySelectList: [],
      ruleValidate: {
        type: [{ required: true, message: '请选择信件类型', trigger: 'change' }],
        processStatus: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
        sendMethod: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
        vatTaxNumber: [{ required: true, message: '请输入VAT税号', trigger: 'blur' }],
        receiveTime: [{ required: true, message: '请选择信件接收时间', trigger: 'blur' }],
        // letterFile: [{ required: true, message: "请上传信件", trigger: "blur" }],
        taxCountryCode: [{ required: true, message: '请选择税号对应国家', trigger: 'change' }],
        taxUserMobileInfo: [{ required: true, message: '请填写客户手机号', trigger: 'change' }],
        companyNameZh: [{ required: true, message: '请填写客户名称', trigger: 'change' }],
        annex: [{ required: true, message: '请选择附件是否相同', trigger: 'change' }],
        recipientsFile: [{ required: true, message: '请上传收件人附件', trigger: 'blur' }],
        processSuggestions: [{ required: true, message: '请填写信件内容', trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
          return time.getTime() < date.getTime();
        },
      },
      copyListQuery: {},
      submitLoading: false,
    };
  },
  components: {
    UploadFile,
    FormTitle,
  },
  computed: {
    showSave() {
      if (this.form.receiveTime) {
        return this.$util.formatDateToStr(new Date()) !== this.form.receiveTime.split(' ')[0];
      }
      return true;
    },
  },
  created() {
    this.copyListQuery = { ...this.form };
    this.init();
    this.getLetterType();
  },
  methods: {
    async init() {
      await this._getCountrySelectList();
      if (this.id) {
        this.getInfo();
      }
    },
    getInfo() {
      getStationLetterInfo(this.id).then((res) => {
        let result = res.data;
        let fileNames = result.fileNames.split(',');
        let letterFile = result.letterFile.split(',');
        let recipientsFile = result.recipientsFile.split(',');
        result.letterFile = [];
        result.recipientsFile = [];
        letterFile.forEach((item, index) => {
          result.letterFile.push({
            name: fileNames[index],
            url: item,
          });
        });
        recipientsFile.forEach((item, index) => {
          result.recipientsFile.push({
            name: fileNames[index],
            url: item,
          });
        });
        this.form = result;
      });
    },
    // 获取信件类型
    getLetterType() {
      getTemplateListApi()
        .then((res) => {
          if (res.code === 0) {
            this.letterTypeList = res.data;
          }
        })
        .catch((err) => {});
    },
    // 获取国家列表
    _getCountrySelectList() {
      return new Promise((resolve) => {
        getCountrySelectList().then((res) => {
          this.countrySelectList = res.data;
          resolve();
        });
      });
    },
    vatTaxNumberInputDebounce: Debounce('vatTaxNumberInput'),
    vatTaxNumberInput(e) {
      this.getUserMobile('vatTaxNumber', e);
    },
    // 根据税号及国家获取手机号
    getUserMobile(key, value) {
      if (!this.form.vatTaxNumber) {
        this.resetCustom();
        return;
      }
      getOrderServicesByVatTaxNumbersApi({
        vatTaxNumbers: [this.form.vatTaxNumber],
        countryCode: this.form.taxCountryCode,
      }).then((res) => {
        if (res.code == 0) {
          if (res.data.length) {
            let item = res.data[0];
            if (!(key === 'taxCountryCode' && value === '')) {
              this.form.taxCountryCode = item.countryCode;
            }
            if (this.form.taxCountryCode) {
              this.taxUserMobileList = res.data.filter((item) => item.countryCode === this.form.taxCountryCode);
            } else {
              this.taxUserMobileList = res.data;
            }
            this.form.taxUserMobileInfo = item;
            this.form.companyNameZh = item.companyNameZh;
          } else {
            this.resetCustom();
          }
        }
      });
    },
    resetCustom() {
      this.taxUserMobileList = [];
      this.form.taxUserMobileInfo = null;
      this.form.companyNameZh = '';
    },
    downloadTemplate() {
      this.$util.downloadFile('https://file.itaxs.com/dev/20220601/fa8cb225e6714dbdbafbb6f8bf18985b.xlsx');
    },
    submit(isSend) {
      this.$refs.formRef.validate((vaild) => {
        if (vaild) {
          let data = {
            ...this.form,
            letterFile: this.form.letterFile.map((item) => item.url).join(','),
            fileNames: this.form.letterFile.map((item) => item.name).join(','),
            recipientsFile: this.form.recipientsFile.map((item) => item.url).join(','),
            taxUserMobile: this.form.sendMethod == 1 ? this.form.taxUserMobileInfo.userMobile : '',
            isSend,
          };
          if (!this.id) {
            // 新增
            this._addStationLetter(data);
          } else {
            // 编辑
            this._updateStationLetter(data);
          }
        }
      });
    },
    sendMethodChange() {
      let { sendMethod, processSuggestions, type, processStatus, ...form } = this.copyListQuery;
      this.form = {
        sendMethod: this.form.sendMethod,
        processSuggestions: this.form.processSuggestions,
        type: this.form.type,
        processStatus: this.form.processStatus,
        ...form,
      };
    },
    annexChange() {
      this.form.letterFile = [];
    },
    taxUserMobileChange() {
      try {
        this.form.companyNameZh = this.form.taxUserMobileInfo.companyNameZh;
        this.form.taxCountryCode = this.form.taxUserMobileInfo.countryCode;
      } catch (error) {
        this.form.companyNameZh = '';
      }
    },
    letterTypeChange(val) {
      this.form.processSuggestions = this.letterTypeList.find((item) => item.id == val).letterContent;
    },
    _addStationLetter(data) {
      this.submitLoading = true;
      addStationLetter(data)
        .then((res) => {
          this.back();
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    _updateStationLetter(data) {
      updateStationLetter({
        ...data,
        id: this.id,
      }).then((res) => {
        this.back();
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.$message.success('操作成功');
      this.closeTag(this.$route);
      this.navigate();
    },
    // 取消
    cancel() {
      this.$confirm(`是否确认取消！`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        center: true,
      }).then(() => {
        this.navigate();
      });
    },
    navigate() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/messageCenter/letterManage/index',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.item-title {
  padding: 0 12px;
}
.back {
  margin-left: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}
.item-tip {
  padding: 0 12px;
  color: #999;
}
.tip-icon {
  color: #ff9900;
  padding-right: 12px;
}
.btn-group {
  // text-align: center;
  margin-left: 80px;
  padding: 50px;
}
</style>
