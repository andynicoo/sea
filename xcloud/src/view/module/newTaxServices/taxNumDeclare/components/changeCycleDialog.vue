<template>
  <el-dialog title="变更申报周期类型" :visible.sync="dialogvisible" width="450px" center @close="reset">
    <el-form label-width="120px" ref="declarePeriodForm" :rules="ruleForm" :model="form">
      <el-form-item label="最新报税周期">
        <span>{{ period == 0 ? '月报' : period == 1 ? '季报' : period == 2 ? '年报' : '' }}</span>
      </el-form-item>
      <el-form-item label="更改报税周期为" prop="declarePeriod">
        <el-select style="width: 250px" v-model="form.declarePeriod" @change="changeDeclarePeriod" clearable placeholder="请选择周期类型" @focus="periodFocus">
          <el-option v-for="item in declarePeriod" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="变更起始时间" prop="time">
        <el-date-picker v-model="form.time" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" value-format="yyyy-MM" clearable @change="ineffective" style="width: 250px"></el-date-picker>
        <el-tooltip class="item" effect="dark" content="更改的申报周期从选择的时间开始生效" placement="top">
          <i class="el-icon-question" style="color: orange; margin-left: 10px"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" @click="submit" size="small" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { declarePeriodModifyApi } from '@/api/newApi/taxServices/taxNumDeclare.js';
import { getCountrySelectList } from '@/api/newApi/common.js';

export default {
  props: {
    changeCycleDialog: Boolean,
    period: Number,
    getserviceDetail: {
      type: Function,
      default: null,
    },
    declareList: {
      type: Array,
      default: () => [],
    },
    countryCode: String,
    serviceId: String,
  },
  data() {
    return {
      form: {
        declarePeriod: '',
        time: [],
      },
      declarePeriodList: [
        {
          value: '0',
          label: '月报',
        },
        {
          value: '1',
          label: '季报',
        },
        {
          value: '2',
          label: '年报',
        },
      ],
      countrySelect: [],
      loading: false,
      ruleForm: {
        declarePeriod: [{ required: true, message: '请选择周期类型', trigger: 'change' }],
        time: [{ required: true, message: '请选择变更起始时间', trigger: 'change' }],
      },
    };
  },
  mounted() {
    this.getCountry(); // 国家列表
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeCycleDialog;
      },
      set(val) {
        this.$emit('update:changeCycleDialog', val);
      },
    },
    declarePeriod() {
      // 排除现有周期
      return this.declarePeriodList.filter((item) => {
        return item.value != this.period;
      });
    },
  },
  methods: {
    reset() {
      if (this.$refs.declarePeriodForm) {
        this.$refs.declarePeriodForm.resetFields();
      }
    },
    submit() {
      this.$refs.declarePeriodForm.validate((valid) => {
        if (valid) {
          let declarePeriod = this.form.declarePeriod;
          if (declarePeriod == 0 && this.$util.isOverOneMonth(this.form.time)) {
            return this.$message.error('月报只能是一个月');
          }
          if (declarePeriod == 1 && this.$util.isOverThreeMonth(this.form.time)) {
            return this.$message.error('季报只能是三个月');
          }
          if (declarePeriod == 2 && this.$util.isOverYear(this.form.time)) {
            return this.$message.error('年报只能是一年');
          }
          this.confirmOperation();
        }
      });
    },
    // 操作确认
    confirmOperation() {
      this.loading = true;
      let data = {
        beginTime: this.form.time[0],
        declarePeriod: this.form.declarePeriod,
        endTime: this.form.time[1],
        serviceId: this.serviceId,
      };
      declarePeriodModifyApi(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功');
            this.dialogvisible = false;
            this.getserviceDetail();
          }
        })
        // .catch(err => {
        //   this.$message.error(err.msg);
        // })
        .finally(() => {
          this.loading = false;
        });
    },
    // 确认提醒
    ineffective() {
      if (this.declareList && this.declareList.length && this.form.time[0]) {
        let endTime = new Date(this.declareList[0].endTime);
        let beginTime = new Date(this.form.time[0]);
        if (endTime > beginTime) {
          // 延时执行
          setTimeout(() => {
            this.$confirm('更改申报周期的起始时间内存在申报区间，更改申报周期生效后历史申报数据将作废，重新生成申报区间，请谨慎选择！', '提示', {
              confirmButtonText: '确定，继续操作',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {})
              .catch(() => {
                this.form.time = [];
              });
          }, 300);
        }
      }
    },
    changeDeclarePeriod() {
      this.form.time = [];
    },
    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
          // 根据countryCode 获取 countrySelect 中的 taxPeriod
          let countryInfo = this.countrySelect.find((item) => {
            return item.countryCode == this.countryCode;
          });
          let periodList = countryInfo.taxPeriod.split(',');
          this.declarePeriodList = this.declarePeriodList.filter((item) => {
            return periodList.includes(item.value);
          });
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 无可变更周期提醒
    periodFocus() {
      if (this.declarePeriod && this.declarePeriod.length == 0) {
        this.$message.warning('当前国家无可变更周期类型');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  color: #999999;
}
</style>
