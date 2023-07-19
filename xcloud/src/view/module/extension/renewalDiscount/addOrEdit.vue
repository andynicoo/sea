<template>
  <div class="app-container">
    <div class="header-container">
      <div class="back-wrapper">
        <el-link :underline="false" @click="back">
          <i class="el-icon-arrow-left back"></i>
          返回列表
        </el-link>
      </div>
      <div class="info-container">
        <el-form label-position="left" label-width="110px" :model="form" :rules="editFormRules" ref="editFormRef">
          <el-form-item label="优惠名称" prop="renewalName">
            <el-input v-model="form.renewalName" class="form-item" size="small" maxlength="20" show-word-limit placeholder="如：提前一个月续费9折"></el-input>
          </el-form-item>
          <el-form-item label="优惠形式" prop="renewalMethod">
            <el-radio-group v-model="form.renewalMethod">
              <el-radio :label="1">按提前天数</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提前天数" prop="beforeMinDay">
            <el-input-number v-model="form.beforeMinDay" controls-position="right" :precision="0" :min="1" size="small" placeholder="最小天数" :step-strictly="true"></el-input-number>
            天 ~
            <el-input-number v-model="form.beforeMaxDay" controls-position="right" :precision="0" :min="1" size="small" placeholder="最大天数" :step-strictly="true"></el-input-number>
            天
            <div>注：续费优惠开启，且当客户的剩余服务时间等于最大提前天数时，自动发送续费优惠提醒短信</div>
          </el-form-item>
          <el-form-item label="优惠力度" prop="renewalDiscount">
            <el-input-number v-model="form.renewalDiscount" controls-position="right" placeholder="如：7.5" :precision="1" :step="0.1" :min="0.1" :max="9.9" size="small" :step-strictly="true"></el-input-number>
            折
          </el-form-item>
          <el-form-item label="适用业务类型" prop="functionCode">
            <el-select size="small" class="form-item" v-model="form.functionCode" filterable clearable>
              <el-option v-for="item in functionCodeList" :key="item.value" :label="item.dataValue" :value="item.dataCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用国家" prop="countryCode">
            <el-select size="small" class="form-item" v-model="form.countryCode" multiple filterable clearable>
              <el-option v-for="(item, index) in countryList" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select size="small" class="form-item" v-model="form.status" filterable>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="back">取消</el-button>
            <el-button type="primary" size="small" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { countryList } from '@/api/newApi/extension/coupon.js';
import { getRenewalInfo, addOrEditRenewal } from '@/api/newApi/extension/renewalDiscount';
import { getBaseDataByDataType } from '@/api/newApi/common';
export default {
  data() {
    var validateDays = (rule, value, callback) => {
      if (!this.form.beforeMaxDay) {
        callback(new Error('请输入最大天数'));
      } else if (this.form.beforeMinDay > this.form.beforeMaxDay) {
        callback(new Error('最大天数需大于最小天数'));
      } else {
        callback();
      }
    };
    return {
      id: this.$route.query.id || 0,
      form: {
        renewalName: '',
        renewalMethod: 1,
        // beforeMinDay: undefined,
        // beforeMaxDay: "",
        // renewalDiscount: "",
        functionCode: '',
        countryCode: '',
        status: '',
      },
      functionCodeList: [],
      countryList: [],
      //检验
      editFormRules: {
        renewalName: [{ required: true, message: '请输入优惠名称', trigger: 'blur' }],
        renewalMethod: [{ required: true, message: '请选择优惠形式', trigger: 'blur' }],
        beforeMinDay: [
          { required: true, message: '请输入最小天数', trigger: 'blur' },
          { validator: validateDays, trigger: 'blur' },
        ],
        renewalDiscount: [{ required: true, message: '请输入优惠力度', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择适用国家', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getCountryList();
    this.getFunctionCodeList();
    if (this.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      getRenewalInfo(this.id).then((res) => {
        let { renewalOfferCountryVOS } = res.data;
        for (let key in this.form) {
          this.form[key] = res.data[key];
        }
        this.form.countryCode = renewalOfferCountryVOS.map((item) => item.countryCode);
        console.log(this.form);
      });
    },
    submit() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          let country = this.countryList.filter((item) => this.form.countryCode.includes(item.countryCode));
          let data = {
            ...this.form,
            renewalOfferCountryVOS: country.map((item) => ({
              countryCode: item.countryCode,
              countryName: item.countryNameZh,
            })),
          };
          if (this.id) {
            data.renewalOfferId = this.id;
          }
          let { countryCode, ...formData } = data;
          addOrEditRenewal(formData).then((res) => {
            if (res.code === 0) {
              this.$message.success('操作成功');
              this.back();
            }
          });
        }
      });
    },
    /**
     * 获取国家
     */
    getCountryList() {
      countryList({
        page: 1,
        limit: 999,
        status: 0,
      }).then((res) => {
        if (res.code == 0) {
          this.countryList = res.data.records;
        }
      });
    },
    // 获取业务类型
    getFunctionCodeList() {
      getBaseDataByDataType({
        dataType: this.$constant.dataType.FUNCTION_CODE_RENEWAL,
      }).then((res) => {
        res.data.forEach((item) => {
          item.dataCode = +item.dataCode;
        });
        this.functionCodeList = res.data;
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/extension/renewalDiscount/index',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header-container {
  min-height: calc(100vh - 130px);
}
.back-wrapper {
  margin-bottom: 20px;
  .back {
    margin-right: 6px;
    cursor: pointer;
  }
}

.info-container {
  padding-left: 40px;
}
.form-item {
  width: 330px;
}
</style>
