<template>
  <div id="countryEditContent" v-loading="loading">
    <el-form
      :model="addFormList"
      label-position="right"
      label-width="100px"
      :rules="formRule"
      ref="addCountryForm"
    >
      <el-form-item label="企业名称">
        <span>{{ enterpriseName }}</span>
      </el-form-item>

      <el-form-item label="国家名称" prop="countryNameZh">
        <el-select
          style="width: 200px"
          size="small"
          v-model="addFormList.countryNameZh"
          @change="changeCountry"
          clearable
          filterable
        >
          <el-option
            v-for="item in countryCodeList"
            :key="item.countryCode"
            :value="item.countryName"
            :label="item.countryName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国家代码" prop="countryCode">
        <el-input
          v-model="addFormList.countryCode"
          placeholder="国家代码"
          clearable
          style="width: 200px"
          size="small"
          disabled
        />
      </el-form-item>
      <el-form-item label="英文名称" prop="countryNameEn">
        <el-input
          v-model="addFormList.countryNameEn"
          placeholder="英文名称"
          clearable
          style="width: 200px"
          size="small"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio v-model="addFormList.status" :label="0">启用</el-radio>
        <el-radio v-model="addFormList.status" :label="1">禁用</el-radio>
      </el-form-item>

      <el-form-item label="国旗" prop="countryImgUrl">
        <UploadImage
          ref="uploadImageRef"
          :imageUrl="addFormList.countryImgUrl"
          :imgType="1"
          :on-success="uploadSuccess"
          upload-tips="上传图片"
        >
        </UploadImage>
      </el-form-item>
      <el-form-item label="报税周期" prop="taxPeriod">
        <el-checkbox-group v-model="addFormList.taxPeriod">
          <el-checkbox label="0">月报</el-checkbox>
          <el-checkbox label="1">季报</el-checkbox>
          <el-checkbox label="2">年报</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="申报税率" prop="declareTax">
        <el-checkbox-group v-model="addFormList.declareTax">
          <el-checkbox
            :label="item"
            v-for="(item, index) in taxList"
            :key="index"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="_addCountryData()">
          保存
        </el-button>
        <el-button type="cancel" size="small" @click="back()"> 取消 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage/index.vue";
import { getCountriesName } from "@/api/newApi/common.js";
import {
  addCountryData,
  getCountryById,
  getDeclareTax,
} from "@/api/newApi/basementPaper/basementPaper.js";
export default {
  components: { UploadImage },
  data() {
    return {
      enterpriseName: localStorage.getItem("enterpriseName"),
      id: this.$route.params.id || 0,
      addFormList: {
        id: "",
        countryNameZh: "",
        countryNameEn: "",
        countryCode: "",
        status: 0,
        countryImgUrl: "",
        taxPeriod: [],
        declareTax: [],
      },
      formRule: {
        countryNameZh: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        countryNameEn: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z]+$/,
            message: "请输入正确数据",
            trigger: "blur",
          },
        ],
        countryImgUrl: [
          { required: true, message: "请上传国旗", trigger: "blur" },
        ],
        taxPeriod: [
          {
            type: "array",
            required: true,
            message: "请选择报税周期",
            trigger: "change",
          },
        ],
        declareTax: [
          {
            type: "array",
            required: true,
            message: "请选择申报税率",
            trigger: "change",
          },
        ],
      },
      countryCodeList: [],
      taxList: [],
      loading: false,
      checkList: [],
    };
  },
  created() {
    if (this.$route.params.rowData != null) {
      this.addFormList = this.$route.params.rowData;
    }
    this.initData();
  },
  methods: {
    async initData() {
      await this._getCountryCode();
      await this._getDeclareTax();
      if (this.id) {
        this.getInfo();
      }
    },
    back() {
      this.$router.push({
        path: "/basementPaper/country/country",
      });
    },
    getInfo() {
      getCountryById({ id: this.id }).then((res) => {
        let result = res.data;
        result.declareTax = result.declareTax
          .split(",")
          .filter((item) => item !== "");
        result.taxPeriod = result.taxPeriod
          .split(",")
          .filter((item) => item !== "");
        this.addFormList = result;
      });
    },
    _getCountryCode() {
      return new Promise((resolve) => {
        getCountriesName().then((res) => {
          this.countryCodeList = res.data;
          resolve();
        });
      });
    },
    _getDeclareTax() {
      return new Promise((resolve) => {
        getDeclareTax().then((res) => {
          this.taxList = res.data;
          resolve();
        });
      });
    },
    changeCountry(e) {
      this.addFormList.countryCode = this.countryCodeList.find(
        (item) => item.countryName === e
      ).countryCode;
    },
    _addCountryData() {
      this.$refs["addCountryForm"].validate((valid) => {
        if (valid) {
          this.$confirm("确认操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.loading = true;
              const {
                countryCode,
                countryImgUrl,
                countryNameEn,
                countryNameZh,
                status,
                declareTax,
                taxPeriod,
              } = this.addFormList;
              let data = {
                countryCode,
                countryImgUrl,
                countryNameEn,
                status,
                countryNameZh,
                declareTax: declareTax.join(","),
                taxPeriod: taxPeriod.join(","),
              };
              if (this.id) {
                data.id = this.id;
              }
              addCountryData(data)
                .then((res) => {
                  if (res.code == 0) {
                    this.$message({
                      type: "success",
                      message: "'操作成功'",
                    });
                    this.back();
                  }
                  this.loading = false;
                })
                .catch((err) => {
                  console.log(err);
                  this.loading = false;
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning",
          });
          return false;
        }
      });
    },
    uploadSuccess(v) {
      this.addFormList.countryImgUrl = v.file.fileUrl;
    },
  },
};
</script>
<style lang="scss">
#countryEditContent {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  min-height: 700px;
}
</style>