<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled && isEdit">
      <el-table border :data="form.weeeInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column :label="(isEPRTaxServices ? '转代理' : '注册') + '产品信息'" align="center">
          <el-table-column min-width="150px" align="center" label="* 产品类别" prop="productCategory">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.productCategory'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.productCategory" clearable size="small" /> -->
                <el-select v-model="scope.row.productCategory" clearable filterable>
                  <el-option v-for="item in isDE ? productCategoryListDE : productCategoryList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" :label="isDE ? '* 产品名称 (中文+英文)' : '* 产品名称（中/英文）'" prop="productName">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.productName'" :rules="baseRule">
                <el-input v-model="scope.row.productName" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 对应的品牌LOGO" prop="productLogo">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.productLogo'" :rules="baseRule">
                <el-input v-model="scope.row.productLogo" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" :label="isDE ? '* 单边最大尺寸（厘米）' : '* 单边最大尺寸/cm'" prop="sideMaxSize">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.sideMaxSize'" :rules="baseRule">
                <el-input v-model="scope.row.sideMaxSize" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" :label="isDE ? '* 预估年投放量（千克）' : '* 预计当年销售总量'" prop="saleWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.saleWeight'" :rules="baseRule">
                <el-input v-model="scope.row.saleWeight" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="isRemark ? '备注' : '操作'" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <span v-if="isRemark">{{ scope.row.isBuy ? '已续费' : '' }} </span>
              <template v-else>
                <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled && isEdit">添加</el-link>
                <el-link type="primary" @click="delItem(scope.$index)" :disabled="disabled && isEdit" v-if="form.weeeInfos.length > 1"> 删除 </el-link>
              </template>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import { productCategoryList } from '@/utils/constant';
import bus from '@/bus';
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
    isEPRTaxServices: {
      type: Boolean,
      default: false,
    },
    countryCode: {
      type: String,
      default: '',
    },
    isRemark: Boolean,
  },
  data() {
    return {
      item: {
        productCategory: '',
        productName: '',
        productLogo: '',
        sideMaxSize: '',
        saleWeight: '',
      },
      form: {
        weeeInfos: [],
      },
      baseRule: { required: true, message: '请输入', trigger: 'blur' },
      productCategoryList: [
        { value: '热交换器' },
        { value: '显示屏或屏幕大于100平方厘米的显示设备' },
        { value: '照明设备' },
        { value: '大型电子设备（能收缩到最短距离的长度超过50cm）' },
        { value: '小型电子电器设备（能收缩到最短距离的长度不超过50cm）' },
        { value: '小型IT和电信设备（外部尺寸不超过50cm）' },
      ],
      productCategoryListDE: productCategoryList,
      isEdit: true,
    };
  },
  computed: {
    isDE() {
      return this.countryCode === 'DE';
    },
  },
  components: {
    UploadFile,
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.form.weeeInfos = val;
        }
      },
      immediate: true,
    },
    'form.weeeInfos': {
      handler() {
        // const hasValueTrue = this.form.weeeInfos.filter(item => this.verifyEmpty(item).isEmpty === true )
        // const emptyValue = this.form.weeeInfos.filter(item => this.verifyEmpty(item).flag === true )
        // for (let i = 0; i < this.form.weeeInfos.length; i++) {
        //   let item = this.form.weeeInfos[i];
        //   let verify = this.verifyEmpty(item);
        //   console.log('111')
        //   if (!verify.flag && !verify.isEmpty) {
        //     this.$emit("input", []);
        //     return;
        //   }
        //   if (verify.flag) {

        //     this.$emit("input", []);
        //     return;
        //   }
        // }
        this.$emit('input', this.form.weeeInfos);
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
      this.form.weeeInfos.splice(index + 1, 0, { ...this.item });
      this.$set(this.form, 'weeeInfos', this.form.weeeInfos);
    },
    delItem(index) {
      this.form.weeeInfos.splice(index, 1);
    },
  },
  mounted() {
    bus.$on('changeEdit', (data) => {
      let { isEdit } = data;
      this.isEdit = isEdit;
    });
  },
  destroyed() {
    bus.$off('changeEdit');
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
