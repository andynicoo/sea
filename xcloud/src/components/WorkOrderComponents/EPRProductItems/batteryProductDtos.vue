<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.batteryInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column label="产品信息" align="center">
          <el-table-column min-width="150px" align="center" label="* 产品中文名称" prop="productName">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.productName'" :rules="baseRule">
                <el-input v-model="scope.row.productName" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 电池类型" prop="batteryType">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.batteryType'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.batteryType" clearable size="small" /> -->
                <el-select v-model="scope.row.batteryType" clearable filterable>
                  <el-option v-for="item in batteryTypeList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 单位重量" prop="unitWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.unitWeight'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.unitWeight" clearable size="small" /> -->
                <el-select
                  v-model="scope.row.unitWeight"
                  clearable
                  filterable
                  @change="
                    scope.row.isCharge = '';
                    scope.row.materialType = '';
                  "
                >
                  <el-option v-for="item in unitWeightList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :prop="'batteryInfos.' + scope.$index + '.batteryWeight'" :rules="baseRule" v-if="scope.row.unitWeight == '1KG以上'">
                <el-input-number style="width: 120px" v-model="scope.row.batteryWeight" :precision="2" :min="0" clearable size="small" placeholder="单个电池重量" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 是否可以充电" prop="isCharge">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.isCharge'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.isCharge" clearable size="small" /> -->
                <el-select v-model="scope.row.isCharge" clearable filterable @change="scope.row.materialType = ''">
                  <el-option v-for="item in getFormatList(scope.row, 'isCharge')" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 材料类型" prop="materialType">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.materialType'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.materialType" clearable size="small" /> -->
                <el-select v-model="scope.row.materialType" clearable filterable>
                  <el-option v-for="item in getFormatList(scope.row, 'materialType')" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="150px" align="center" label="* 年发货数量/个" prop="yearDeliveryNum">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.yearDeliveryNum'" :rules="baseRule">
                <el-input v-model="scope.row.yearDeliveryNum" type="number" min="0" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 电池品牌" prop="batteryBrand">
            <template slot-scope="scope">
              <el-form-item :prop="'batteryInfos.' + scope.$index + '.batteryBrand'" :rules="baseRule">
                <el-input v-model="scope.row.batteryBrand" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
              <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled" v-if="form.batteryInfos.length > 1"> 删除 </el-link>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import { getBatteryList } from '@/api/newApi/workOrder/EPRManage';
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
        productName: '',
        batteryType: '',
        materialType: '',
        isCharge: '',
        unitWeight: '',
        yearDeliveryNum: '',
        batteryBrand: '',
      },
      form: {
        batteryInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      batteryTypeList: [{ value: '工业电池' }, { value: '汽车电池' }, { value: '便携式电池' }],
      unitWeightList: [],
    };
  },
  components: {
    UploadFile,
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.form.batteryInfos = val;
        }
      },
      immediate: true,
    },
    'form.batteryInfos': {
      handler() {
        for (let i = 0; i < this.form.batteryInfos.length; i++) {
          let item = this.form.batteryInfos[i];
          let verify = this.verifyEmpty(item);
          if (!verify.flag && !verify.isEmpty) {
            this.$emit('input', []);
            return;
          }
          if (verify.flag) {
            this.$emit('input', []);
            return;
          }
        }
        let data = this.form.batteryInfos.map((item) => ({
          ...item,
        }));
        this.$emit('input', data);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getBatteryList().then((res) => {
        this.unitWeightList = res.data;
      });
    },
    getFormatList(row, key) {
      if (key === 'isCharge') {
        return (this.unitWeightList.find((item) => item.value === row.unitWeight) || { children: [] }).children;
      } else if (key === 'materialType') {
        return (this.getFormatList(row, 'isCharge').find((item) => item.value === row.isCharge) || { children: [] }).children;
      }
    },
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
      this.form.batteryInfos.splice(index + 1, 0, { ...this.item });
      this.$set(this.form, 'batteryInfos', this.form.batteryInfos);
    },
    delItem(index) {
      this.form.batteryInfos.splice(index, 1);
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
