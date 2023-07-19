<template>
  <div>
    <el-form :model="form" ref="form" id="form" :disabled="disabled">
      <el-table border :data="form.weeeInfos" style="margin: 20px 0" highlight-current-row>
        <el-table-column :label="(isEPRTaxServices ? '转代理' : '注册') + '产品信息'" align="center">
          <el-table-column min-width="150px" align="center" label="* 产品类别" prop="productCategory">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.productCategory'" :rules="baseRule">
                <!-- <el-input v-model="scope.row.productCategory" clearable size="small" /> -->
                <el-select v-model="scope.row.productCategory" clearable filterable>
                  <el-option
                    v-for="item in productCategoryList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 产品名称（中/英文）" prop="productName">
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
          <el-table-column min-width="150px" align="center" label="* 单边最大尺寸/cm" prop="sideMaxSize">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.sideMaxSize'" :rules="baseRule">
                <el-input v-model="scope.row.sideMaxSize" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="150px" align="center" label="* 预计当年销售总量" prop="saleWeight">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.saleWeight'" :rules="baseRule">
                <el-input v-model="scope.row.saleWeight" clearable size="small" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column min-width="150px" align="center" label="* 生效月份" prop="effectDate">
            <template slot-scope="scope">
              <el-form-item :prop="'weeeInfos.' + scope.$index + '.effectDate'" :rules="baseRule">
                <el-date-picker
                  v-model="scope.row.effectDate"
                  type="month"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="100px" fixed="right" v-if="!showOnly">
            <template slot-scope="scope">
              <el-link type="primary" @click="addItem(scope.$index)" :disabled="disabled">添加</el-link>
              <el-link
                type="primary"
                @click="delItem(scope.$index)"
                :disabled="disabled"
                v-if="form.weeeInfos.length > 1"
              >
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
import UploadFile from "@/components/UploadFile/index";
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
  },
  data() {
    return {
      item: {
        productCategory: "",
        productName: "",
        productLogo: "",
        sideMaxSize: "",
        saleWeight: "",
        effectDate: "",
      },
      form: {
        weeeInfos: [],
      },
      baseRule: { required: true, message: "请输入", trigger: "blur" },
      productCategoryList: [
        { value: "热交换器" },
        { value: "显示屏或屏幕大于100平方厘米的显示设备" },
        { value: "照明设备" },
        { value: "大型电子设备（能收缩到最短距离的长度超过50cm）" },
        { value: "小型电子电器设备（能收缩到最短距离的长度不超过50cm）" },
        { value: "小型IT和电信设备（外部尺寸不超过50cm）" },
      ],
    };
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
    "form.weeeInfos": {
      handler() {
        for (let i = 0; i < this.form.weeeInfos.length; i++) {
          let item = this.form.weeeInfos[i];
          let verify = this.verifyEmpty(item);
          if (!verify.flag && !verify.isEmpty) {
            this.$emit("input", []);
            return;
          }
          if (verify.flag) {
            this.$emit("input", []);
            return;
          }
        }
        this.$emit("input", this.form.weeeInfos);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item == "";
      });
      let isEmpty = arr.every(function (item) {
        return item != "";
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },
    addItem(index) {
      this.form.weeeInfos.splice(index + 1, 0, { ...this.item });
      this.$set(this.form, "weeeInfos", this.form.weeeInfos);
    },
    delItem(index) {
      this.form.weeeInfos.splice(index, 1);
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
