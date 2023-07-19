<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.productInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column label="WEEE产品信息" align="center">
          <el-table-column min-width="120px" align="center" label="* 产品类别" prop="prodType">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodType'">
                <!-- <el-input v-model="scope.row.companyName" clearable size="small" /> -->
                <el-select v-model="scope.row.prodType" clearable filterable>
                  <el-option v-for="item in prodTypeOptions" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="* 产品名称（中英文）" prop="prodName">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodName'" :rules="baseRule">
                <el-input v-model="scope.row.prodName" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 对应的品牌" prop="prodBrand">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodBrand'" :rules="baseRule">
                <el-input v-model="scope.row.prodBrand" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 单边最大尺寸（厘米）" prop="maxSize">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.maxSize'" :rules="baseRule">
                <el-input-number style="width: 120px" v-model="scope.row.maxSize" :min="0" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="* 产品链接" prop="prodLink">
            <template slot-scope="scope">
              <el-form-item :prop="'productInfos.' + scope.$index + '.prodLink'">
                <el-input v-model="scope.row.prodLink" clearable size="small" />
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
        prodType: '',
        prodName: '',
        prodBrand: '',
        maxSize: 0,
        prodLink: '',
      },
      form: {
        productInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      prodTypeOptions: [
        '热交换器 Aparatos de intercambio de temperatura',
        '显示屏或屏幕 Monitores o pantallas',
        '照明设备 Lámparas',
        '大型电子设备 Grandes aparatos',
        '小型电子电器设备 Pequeños aparatos',
        '小型IT和电信设备 Equipo de informática y telecomunicaciones pequeños',
        '大型光伏面板 Paneles fotovoltaicos grandes',
      ],
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
          let requiredKeys = ['prodType', 'prodName', 'prodBrand', 'maxSize', 'prodLink'];
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
