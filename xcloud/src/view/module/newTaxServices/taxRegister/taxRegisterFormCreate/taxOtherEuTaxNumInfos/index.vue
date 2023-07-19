<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.otherEuTaxNumInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column label="产品信息" align="center">
          <el-table-column min-width="150px" align="center" label="* 税号所在国(国家英文全拼,如France)" prop="taxNumCountry">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.taxNumCountry'" :rules="baseRule">
                <el-input v-model="scope.row.taxNumCountry" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 税号" prop="vatTaxNumber">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.vatTaxNumber'" :rules="baseRule">
                <el-input v-model="scope.row.vatTaxNumber" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 税号生效日期" prop="taxEffectiveDate">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.taxEffectiveDate'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.taxEffectiveDate" clearable size="small" /> -->
                <el-date-picker  value-format="yyyy-MM-dd" v-model="scope.row.taxEffectiveDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 负责欧盟市场物流的公司或负责人名称(英文，没有填N/A)" prop="logisticsCompanyNameEn">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.logisticsCompanyNameEn'" :rules="baseRule">
                <el-input v-model="scope.row.logisticsCompanyNameEn" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 物流公司地址(英文，没有填N/A)" prop="logisticsCompanyAddressEn">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.logisticsCompanyAddressEn'" :rules="baseRule">
                <el-input v-model="scope.row.logisticsCompanyAddressEn" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 负责欧盟市场清关的公司或负责人名称(英文，没有填N/A)" prop="clearCompanyNameEn">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.clearCompanyNameEn'" :rules="baseRule">
                <el-input v-model="scope.row.clearCompanyNameEn" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 清关公司地址(英文，没有填N/A)" prop="clearCompanyAddressEn">
            <template slot-scope="scope">
              <el-form-item :prop="'otherEuTaxNumInfos.' + scope.$index + '.clearCompanyAddressEn'" :rules="baseRule">
                <el-input v-model="scope.row.clearCompanyAddressEn" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
              <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.otherEuTaxNumInfos.length > 1">
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: true,
    },
    showOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: {
        taxNumCountry: '',
        vatTaxNumber: '',
        taxEffectiveDate: '',
        logisticsCompanyNameEn: '',
        logisticsCompanyAddressEn: '',
        clearCompanyNameEn: '',
        clearCompanyAddressEn: '',
      },
      form: {
        otherEuTaxNumInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      rules: {
        taxNumCountry: [this.baseRule],
        vatTaxNumber: [this.baseRule],
        taxEffectiveDate: [this.baseRule],
        logisticsCompanyNameEn: [this.baseRule],
        logisticsCompanyAddressEn: [this.baseRule],
        clearCompanyNameEn: [this.baseRule],
        clearCompanyAddressEn: [this.baseRule],
      },
    };
  },
  components: {
    UploadFile,
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.form.otherEuTaxNumInfos = val;
        }
      },
      immediate: true,
    },
    'form.otherEuTaxNumInfos': {
      handler() {
        for (let i = 0; i < this.form.otherEuTaxNumInfos.length; i++) {
          let item = this.form.otherEuTaxNumInfos[i];
          let verify = this.verifyEmpty(item);
          if (!verify.flag && !verify.isEmpty) {
            this.$emit('input', '');
            return;
          }
          if (verify.flag) {
            this.$emit('input', []);
            return;
          }
        }
        this.$emit('input', this.form.otherEuTaxNumInfos);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item == '';
      });
      let isEmpty = arr.every(function (item) {
        return item != '';
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },
    addItem(index) {
      if (this.form.otherEuTaxNumInfos.length < 4) {
        this.form.otherEuTaxNumInfos.splice(index + 1, 0, { ...this.item });
        this.$set(this.form, 'otherEuTaxNumInfos', this.form.otherEuTaxNumInfos);
      } else {
        this.$message.warning('最多只可添加四行');
      }
    },
    delItem(index) {
      this.form.otherEuTaxNumInfos.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  width: 120px !important;
}
::v-deep .el-input__inner {
  width: 120px !important;
}
::v-deep .el-upload__text {
  white-space: nowrap;
}
</style>
