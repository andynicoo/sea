<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.productInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column label="电池法产品信息" align="center">
          <el-table-column min-width="120px" align="center" label="* 电池类别" prop="batteryType">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.batteryType'">
                <el-select v-model="scope.row.batteryType" clearable filterable>
                  <el-option v-for="item in batteryTypeOptions" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 电池所在设备" prop="device">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.device'" :rules="baseRule">
                <el-input v-model="scope.row.device" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 单位重量（克）" prop="unitWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.unitWeight'" :rules="baseRule">
                <el-input-number style="width: 120px" v-model="scope.row.unitWeight" :precision="2" :min="0" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 年发货数量（个）" prop="yearDeliveryNum">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.yearDeliveryNum'" :rules="baseRule">
                <el-input-number style="width: 120px" v-model="scope.row.yearDeliveryNum" :precision="0" :min="0" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 电池品牌" prop="batteryBrand">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.batteryBrand'">
                <el-input v-model="scope.row.batteryBrand" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
              <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.productInfos.length > 1"> 删除 </el-link>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
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
        batteryType: '',
        device: '',
        unitWeight: 0,
        yearDeliveryNum: 0,
        batteryBrand: '',
      },
      form: {
        productInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      batteryTypeOptions: ['纽扣电池 Pilas de botón', '碱性电池 Pilas de alcalina', '碳性电池 Pilas de salina', '锂电池 Pilas de litio', '锂离子电池 Batería de iones de litio', '蓄电池 Pilas acumuladores', '其他 Otros'],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.form.productInfos = val;
        }
      },
      immediate: true,
    },
    'form.productInfos': {
      handler() {
        for (let i = 0; i < this.form.productInfos.length; i++) {
          let item = this.form.productInfos[i];
          let requiredKeys = ['batteryType', 'device', 'unitWeight', 'yearDeliveryNum', 'batteryBrand'];
          if (requiredKeys.some((key) => item[key] === '')) {
            this.$emit('input', []);
            return;
          }
        }
        let data = this.form.productInfos.map((item) => ({
          ...item,
        }));
        console.log(111, data);
        this.$emit('input', data);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    addItem(index) {
      this.form.productInfos.splice(index + 1, 0, { ...this.item });
      this.$set(this.form, 'productInfos', this.form.productInfos);
    },
    delItem(index) {
      this.form.productInfos.splice(index, 1);
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
