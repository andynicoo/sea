<template>
  <div>
    <div class="app-container">
      <div class="header-container">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <el-steps :active="tabNav" style="width: 60%; padding: 30px">
          <el-step title="基础信息"></el-step>
          <el-step title="律师执照"></el-step>
        </el-steps>
        <template v-if="tabNav == 0">
          <el-form :model="form" ref="basicInfoForm" :rules="basicInfoRules" label-width="120px">
            <el-form-item label="所属企业：">
              <el-input v-model="enterpriseName" clearable style="width: 300px" size="small" disabled />
            </el-form-item>
            <el-form-item label="律师编码" prop="attorneyCode">
              <el-input v-model="form.attorneyCode" clearable style="width: 300px" size="small" :disabled="!!id" />
            </el-form-item>
            <el-form-item label="律所名称" prop="attorneyName">
              <el-input v-model="form.attorneyName" clearable style="width: 300px" size="small" placeholder="请输入律师名称" />
            </el-form-item>
            <el-form-item label="律师英文名称" prop="attorneyAbbreviation">
              <el-input v-model="form.attorneyAbbreviation" clearable style="width: 300px" size="small" placeholder="请输入简称" />
            </el-form-item>
            <el-form-item label="服务分类" prop="categoryNames">
              <el-select style="width: 300px" size="small" @change="getCategory" clearable filterable multiple v-model="form.categoryNames">
                <el-option v-for="item in functionCode" :key="item.id" :value="item.categoryName" :label="item.categoryName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="attorneyTel">
              <el-input v-model="form.attorneyTel" clearable style="width: 300px" size="small" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="邮箱1" prop="attorneyEmail">
              <el-input v-model="form.attorneyEmail" clearable style="width: 300px" size="small" placeholder="请输入邮箱1" />
            </el-form-item>
            <el-form-item label="邮箱2" prop="attorneyTwoEmail">
              <el-input v-model="form.attorneyTwoEmail" clearable style="width: 300px" size="small" placeholder="请输入邮箱2" />
            </el-form-item>
            <el-form-item label="律师所在公司" prop="attorneyCompanyNameEn">
              <el-input v-model="form.attorneyCompanyNameEn" clearable style="width: 300px" size="small" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="国家" prop="countryNames">
              <el-select style="width: 300px" size="small" @change="getCountry" clearable filterable multiple v-model="form.countryNames">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryNameZh" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="州">
              <el-input v-model="form.attorneyProvinceEn" clearable style="width: 150px" size="small" placeholder="请输入州" />
              <span class="item-title">城市</span>
              <el-input v-model="form.attorneyCityEn" clearable style="width: 150px" size="small" placeholder="请输入城市" />
              <span class="item-title">街道地址</span>
              <el-input v-model="form.attorneyStreetEn" clearable style="width: 150px" size="small" placeholder="请输入街道地址" />
            </el-form-item>
            <el-form-item label="详细地址" prop="attorneyAddressEn">
              <el-input v-model="form.attorneyAddressEn" clearable style="width: 300px" size="small" placeholder="请输入详细地址" />
            </el-form-item>
            <el-form-item label="邮编" prop="attorneyPostcode">
              <el-input v-model="form.attorneyPostcode" clearable style="width: 300px" size="small" placeholder="请输入邮编" />
            </el-form-item>
            <el-form-item label="传真号" prop="attorneyFaxNo">
              <el-input v-model="form.attorneyFaxNo" clearable style="width: 300px" size="small" placeholder="请输入传真号" />
            </el-form-item>
            <el-form-item label="律师代表" prop="attorneyRepresentative">
              <el-input v-model="form.attorneyRepresentative" clearable style="width: 300px" size="small" placeholder="请输入律师代表" />
            </el-form-item>
            <el-form-item label="状态" prop="isOpen">
              <el-select style="width: 300px" size="small" v-model="form.isOpen">
                <el-option :value="1" label="启用">启用</el-option>
                <el-option :value="2" label="禁用">禁用</el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="btn-group">
            <el-button type="primary" size="small" @click="next">下一步</el-button>
            <el-button size="small" @click="back">取消</el-button>
          </div>
        </template>
        <template v-if="tabNav == 1">
          <el-form :model="form" ref="settlementInfoForm" :rules="settlementInfoRules" label-width="180px">
            <el-form-item label="参考号" prop="attorneyCertificateReferenceNum">
              <el-input v-model="form.attorneyCertificateReferenceNum" clearable style="width: 300px" size="small" placeholder="请输入参考号" />
            </el-form-item>
            <el-form-item label="获得律师执照的年份" prop="attorneyCertificateDate">
              <el-date-picker v-model="form.attorneyCertificateDate" type="date" :value-format="'yyyy-MM-dd HH:mm:ss'" style="width: 300px" align="right" size="small" clearable unlink-panels></el-date-picker>
            </el-form-item>
            <el-form-item label="律师执照所在国家" prop="attorneyCertificateCountryNameEn">
              <el-input v-model="form.attorneyCertificateCountryNameEn" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="律师执照所在州" prop="attorneyCertificateProvinceEn">
              <el-input v-model="form.attorneyCertificateProvinceEn" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="律师执照编号" prop="attorneyCertificateNum">
              <el-input v-model="form.attorneyCertificateNum" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="上传证件" prop="attorneyCertificate">
              <UploadImage ref="uploadImageRef" :imageUrl="form.attorneyCertificate" :imgType="1" :on-success="uploadSuccess" :on-remove="uploadRemove" upload-tips="上传图片"></UploadImage>
            </el-form-item>
            <el-form-item label="备注" prop="comment">
              <el-input v-model="form.comment" type="textarea" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
          </el-form>
          <div class="btn-group">
            <el-button type="primary" size="small" @click="submit" v-if="hasAuthority('E1_17')">提交</el-button>
            <el-button size="small" @click="back">取消</el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getAttorneyInfoById, updateLawyer, addLawyer } from "@/api/newApi/supplyChain/lawyerManage.js";
import { getCountrySelectList, getFunctionCode } from "@/api/newApi/common.js";
import UploadImage from "@/components/UploadImage/index";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      enterpriseName: localStorage.getItem("enterpriseName"),
      id: this.$route.params.id || 0,
      tabNav: 0,
      form: {
        isOpen: 1,
        attorneyCertificate: "",
        categoryList: [],
      },
      basicInfoRules: {
        attorneyCode: [{ required: !this.$route.params.id, message: "请输入律师编码", trigger: "blur" }],
        attorneyName: [{ required: true, message: "请输入律师名称", trigger: "blur" }],
        attorneyAbbreviation: [{ required: true, message: "请输入简称", trigger: "blur" }],
        attorneyEmail: [
          { required: true, message: "请填写法人邮箱", trigger: "blur" },
          { type: "email", message: "请填写正确邮箱", trigger: "blur" },
        ],
        attorneyTwoEmail: [{ type: "email", message: "请填写正确邮箱", trigger: "blur" }],
      },
      settlementInfoRules: {},
      functionCode: [],
      countrySelectList: [],
    };
  },
  components: {
    UploadImage,
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this._getFunctionCode();
      await this._getCountrySelectList();
      if (this.id) {
        this.getInfo();
      }
    },
    getCountry(e) {
      this.countryListData = e || [];
    },
    getCategory(e) {
      this.categoryListData = e || [];
    },
    getInfo() {
      getAttorneyInfoById({
        id: this.id,
      }).then((res) => {
        let result = res.data;
        // 格式化服务分类
        result.productcategoryIds = result.productcategoryIds
          .split(",")
          .filter((item) => item !== "")
          .map((item) => item - 0);
        result.categoryNames = result.categoryNames.split(",").filter((item) => item !== "");
        result.functionCodes = result.functionCodes.split(",").filter((item) => item !== "");
        result.countryNames = result.countryNames.split(",").filter((item) => item !== "");
        result.categoryList = [];

        result.productcategoryIds.forEach((item, index) => {
          result.categoryList.push({
            categoryName: result.categoryNames[index],
            id: item,
            functionCode: result.functionCodes[index] - 0,
          });
        });
        // 格式化国家信息
        // result.countryCode = result.countryCodes.split(",")[0];
        // result.countryNameZh = result.countryNames.split(",")[0];
        // result.countryNameEn = result.countryNameEns.split(",")[0];
        // result.countryNameEn = result.countryNameEns.split(",")[0];
        this.form = result;
      });
    },
    // 获取服务分类
    _getFunctionCode() {
      return new Promise((resolve) => {
        getFunctionCode().then((res) => {
          this.functionCode = res.data;
          resolve();
        });
      });
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
    // 保存并下一步
    next() {
      this.$refs["basicInfoForm"].validate((valid) => {
        if (valid) {
          this.tabNav = 1;
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning",
          });
        }
      });
    },
    //返回列表页
    ...mapMutations(["closeTag"]),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/supplychain/lawyerManage/index",
      });
    },
    uploadSuccess(v) {
      this.form.attorneyCertificate = v.file.fileUrl;
    },
    uploadRemove() {
      this.form.attorneyCertificate = "";
    },
    // 提交
    submit() {
      let data = {
        attorneyAbbreviation: "",
        attorneyAddressEn: "",
        attorneyCategoryAddDTOList: [],
        attorneyCertificate: "",
        attorneyCertificateCountryNameEn: "",
        attorneyCertificateDate: "",
        attorneyCertificateNum: "",
        attorneyCertificateProvinceEn: "",
        attorneyCertificateReferenceNum: "",
        attorneyCityEn: "",
        attorneyCode: "",
        attorneyCompanyNameEn: "",
        // attorneyCountryCode: '',
        // attorneyCountryNameEn: '',
        attorneyEmail: "",
        attorneyFaxNo: "",
        attorneyName: "",
        attorneyPostcode: "",
        attorneyProvinceEn: "",
        attorneyRepresentative: "",
        attorneyStreetEn: "",
        attorneyTel: "",
        attorneyTwoEmail: "",
        comment: "",
        isOpen: "",
        // productCategoryId: ''
      };
      for (let key in data) {
        if (this.form.hasOwnProperty(key)) {
          let value = this.form[key];
          data = Object.assign(data, { [key]: value });
        }
      }
      // 处理服务分类和国家组合数据
      // let country = this.countrySelectList.find((item) => item.countryNameZh === this.form.countryNameZh) || {};
      // let
      let countrys = []; //国家数组
      if (this.form.countryNames.length == 0) {
        this.$message.error("请选择国家");
        return;
      }
      this.form.countryNames.forEach((item) => {
        let val = this.countrySelectList.find((i) => i.countryNameZh == item);
        val && countrys.push(val); //比对添加国家的数据
      });

      if (this.form.categoryNames.length > 0) {
        let categorys = [];
        this.form.categoryNames.forEach((item) => {
          let val = this.functionCode.find((i) => i.categoryName == item);
          val && categorys.push(val);
        });
        // let categorysMap = new Map();
        // // 拼接数据
        // let categorys = this.functionCode.concat(this.form.categoryList).map((item) => ({
        //   categoryName: item.categoryName,
        //   id: item.id,
        //   functionCode: item.functionCode,
        // }));
        // // 数据去重、过滤
        // categorys = categorys
        //   .filter((item) => !categorysMap.has(item.id) && categorysMap.set(item.id, 1))
        //   .filter((item) => this.form.categoryNames.includes(item.categoryName));

        categorys.forEach((item) => {
          countrys.forEach((i) => {
            data.attorneyCategoryAddDTOList.push({
              categoryName: item.categoryName,
              countryCode: i.countryCode,
              countryNameEn: i.countryNameEn,
              countryNameZh: i.countryNameZh,
              functionCode: item.functionCode,
              productCategoryId: item.id,
            });
          });
        });
      } else if (this.form.countryCode) {
        // debugger
        countrys.forEach((i) => {
          data.attorneyCategoryAddDTOList.push({
            categoryName: "",
            countryCode: i.countryCode,
            countryNameEn: i.countryNameEn,
            countryNameZh: i.countryNameZh,
            functionCode: "",
            productCategoryId: "",
          });
        });
      }

      if (this.id) {
        this._updateLawyer(data);
      } else {
        this._addLawyer(data);
      }
    },
    // 更新
    _updateLawyer(data) {
      updateLawyer({
        ...data,
        id: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.back();
        }
      });
    },
    // 新增
    _addLawyer(data) {
      addLawyer({
        ...data,
        supplierId: this.form.supplierId,
        enterpriseId: localStorage.getItem("enterpriseId"),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.back();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.back {
  margin: 0 30px;
  cursor: pointer;
}
.item-title {
  padding: 0 12px;
}
.item-tip {
  padding: 0 12px;
  color: #999;
}
.btn-group {
  margin-left: 60px;
  padding: 50px;
}
.header-container {
  position: relative;
  min-height: calc(100vh - 120px);
  &::after {
    position: absolute;
    content: "";
    width: 300px;
    height: 60px;
    top: 0;
    left: 80px;
    z-index: 100;
  }
}
::v-deep.el-steps {
  width: 90%;
  .el-step {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    .el-step__head {
      text-align: left;
      color: #999;
      border-color: #999;
      &.is-finish {
        color: #1890FF;
        .el-step__line {
          border-color: #1890FF;
          background-color: #1890FF;
        }
      }
      &.is-process {
        color: #1890FF;
      }
      &.is-finish,
      &.is-process {
        .el-step__icon {
          &.is-text {
            border: 1px solid #1890FF;
            background-color: #1890FF;
            color: #fff;
          }
        }
      }
      .el-step__line {
        left: 0;
        right: 10px;
        background-color: #EEEEEE;
      }
      .el-step__icon {
        &.is-text {
          border: 1px solid #999;
          color: #999;
        }
      }
    }
    .el-step__main {
      position: absolute;
      left: 0;
      margin-top: -5px;
      padding: 0 10px 0 34px;
      background-color: #fff;
      .el-step__title {
        white-space: nowrap;
        font-weight: normal;
        color: #666;
        &.is-finish,
        &.is-process {
          color: #1890FF;
        }
      }
    }
  }
}
/deep/ .el-select .el-tag__close.el-icon-close{
  background-color: #e0e0e0 !important;
  margin-right: 5px;
}
</style>
