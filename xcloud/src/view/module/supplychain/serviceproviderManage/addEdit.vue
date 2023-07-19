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
          <el-step title="结算信息"></el-step>
        </el-steps>
        <template v-if="tabNav == 0">
          <el-form :model="form" ref="basicInfoForm" :rules="basicInfoRules" label-width="130px">
            <el-form-item label="所属企业">
              <el-input
                v-model="enterpriseName"
                clearable
                style="width: 300px"
                size="small"
                disabled
                placeholder="请输入所属企业"
              />
            </el-form-item>
            <el-form-item label="服务商编码" prop="supplierCode">
              <el-input
                v-model="form.supplierCode"
                clearable
                style="width: 300px"
                size="small"
                :disabled="!!id"
                placeholder="请输入服务商编码"
              />
            </el-form-item>
            <el-form-item label="服务商名称" prop="supplierName">
              <el-input
                v-model="form.supplierName"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入服务商名称"
              />
            </el-form-item>
            <el-form-item label="简称" prop="shortName">
              <el-input v-model="form.shortName" clearable style="width: 300px" size="small" placeholder="请输入简称" />
            </el-form-item>
            <el-form-item label="商品分类" prop="categoryIds">
              <!-- <el-select style="width: 300px" size="small" clearable filterable multiple v-model="form.categoryNames">
                <el-option
                  v-for="item in functionCode"
                  :key="item.id"
                  :value="item.categoryName"
                  :label="item.categoryName"
                ></el-option>
              </el-select> -->
              <el-cascader
                style="width: 300px"
                clearable
                v-model="form.categoryIds"
                :options="serviceCascader"
                :show-all-levels="false"
                :props="{
                  multiple: true,
                  children: 'childrenProductCategoryVo',
                  value: 'id',
                  label: 'categoryName',
                  emitPath: false
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="联系人" prop="contacts">
              <el-input
                v-model="form.contacts"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入联系人"
              />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactsTell">
              <el-input
                v-model="form.contactsTell"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入联系电话"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" clearable style="width: 300px" size="small" placeholder="请输入邮箱" />
              <i class="el-icon-warning" style="color: #e6a23c; padding: 0 12px"></i>
              <span class="item-tip">服务商通过邮箱接收注册资料、申报数据，请确保信息填写无误</span>
            </el-form-item>
            <el-form-item label="是否分配该服务商" prop="status">
              <el-select style="width: 300px" size="small" clearable v-model="form.status">
                <el-option :value="1" label="分配">分配</el-option>
                <el-option :value="2" label="不分配">不分配</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
              <el-input
                v-model="form.companyName"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入公司名称"
              />
            </el-form-item>
            <el-form-item label="国家" prop="countryName">
              <el-select style="width: 300px" size="small" clearable filterable v-model="form.countryName">
                <el-option
                  v-for="item in countrySelectList"
                  :key="item.id"
                  :value="item.countryNameZh"
                  :label="item.countryNameZh"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮编" prop="postcode">
              <el-input v-model="form.postcode" clearable style="width: 300px" size="small" placeholder="请输入邮编" />
            </el-form-item>
            <el-form-item label="州">
              <el-input v-model="form.province" clearable style="width: 150px" size="small" placeholder="请输入州" />
              <span class="item-title">城市</span>
              <el-input v-model="form.city" clearable style="width: 150px" size="small" placeholder="请输入城市" />
              <span class="item-title">街道地址</span>
              <el-input
                v-model="form.streetAddress"
                clearable
                style="width: 150px"
                size="small"
                placeholder="请输入街道地址"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="supplierAddress">
              <el-input
                v-model="form.supplierAddress"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入详细地址"
              />
            </el-form-item>

            <el-form-item
              v-for="(domain, index) in form.registerAddress"
              label="地址产品"
              :key="index"
              :prop="'registerAddress.' + index + '.registerAddress'"
            >
              <!-- :rules="{
                required: true,
                message: '请输入地址产品',
                trigger: 'blur',
              }" -->
              <el-input style="width: 300px" placeholder="请输入地址产品" v-model="domain.registerAddress"></el-input>
              <el-button @click="addDomain" type="success" style="margin-left: 10px">
                <i class="icon icon-adds"></i>
                新增地址产品
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click.prevent="removeDomain(domain, index)"
                v-if="form.registerAddress.length > 1"
              >
                删除
              </el-button>
            </el-form-item>
            <el-form-item label="税号文件：" style="position: relative;width: 400px;" v-if="form.countryCode === 'FR' || form.countryName === '法国'">
              <UploadFile :showTooltip="true"  :fileClass="true" :fileList.sync="form.vatTaxNumberFile" :accept="'.pdf'" :maxSize="10"></UploadFile>
            </el-form-item>
          </el-form>
          <div class="btn-group">
            <el-button type="primary" size="small" @click="next">下一步</el-button>
            <el-button size="small" @click="back">取消</el-button>
          </div>
        </template>
        <template v-if="tabNav == 1">
          <el-form :model="form" :rules="settlementInfoRules" label-width="180px">
            <el-form-item label="合同号" prop="contractNum">
              <el-input
                v-model="form.contractNum"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入合同号"
              />
            </el-form-item>
            <el-form-item label="合作时间" prop="contractDate">
              <el-date-picker
                v-model="form.contractDate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 450px"
                align="right"
                size="small"
                clearable
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结算币种" prop="currency">
              <el-select style="width: 300px" size="small" v-model="form.currency" filterable>
                <el-option
                  v-for="item in currencyList"
                  :key="item.currencyCode"
                  :value="item.currencyCode"
                  :label="item.currencyCodeName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否支付税金" prop="isPayTaxes">
              <el-radio v-model="form.isPayTaxes" :label="2">是</el-radio>
              <el-radio v-model="form.isPayTaxes" :label="1">否</el-radio>
            </el-form-item> -->
            <el-form-item label="结算周期" prop="closePeriod">
              <el-radio v-model="form.closePeriod" :label="1">月</el-radio>
              <el-radio v-model="form.closePeriod" :label="2">季</el-radio>
              <el-radio v-model="form.closePeriod" :label="3">年</el-radio>
            </el-form-item>
            <el-form-item label="结算成本" prop="closeMethod">
              <div style="margin-bottom: 10px">
                <el-radio v-model="form.closeMethod" :label="1">阶梯式单价</el-radio>
                <i class="el-icon-warning" style="color: #ff9900; padding: 0 12px"></i>
                <span class="item-tip">规定周期T内，若累计单量＜=N，则按照单价P计价</span>
              </div>
              <span v-for="(item, index) in closeMethod1Rule" :key="index">
                <div style="margin-bottom: 10px">
                  累计单量大于等于
                  <el-input
                    v-model="item.amount"
                    @blur="amountChange(index)"
                    :min="0"
                    clearable
                    style="width: 150px"
                    size="small"
                    type="number"
                  ></el-input>
                  <span class="item-title">单价</span>
                  <el-input-number
                    v-model="item.price"
                    :min="0"
                    :precision="2"
                    style="width: 150px"
                    size="small"
                  ></el-input-number>
                  <span class="item-title">元</span>
                </div>
              </span>
              <el-radio v-model="form.closeMethod" :label="2" style="margin-bottom: 20px">分成式单价</el-radio>
              <div style="margin-bottom: 20px">
                销售价的百分比
                <el-input-number
                  v-model="form.closeMethod2Rule"
                  clearable
                  :min="0"
                  :max="100"
                  style="width: 200px"
                  size="small"
                />
                %
                <!-- <span class="item-title">元</span> -->
              </div>
            </el-form-item>
            <el-form-item label="IBAN" prop="iban">
              <el-input v-model="form.iban" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="Bank Identifier Code (BIC)" prop="bankIdentifierCode">
              <el-input
                v-model="form.bankIdentifierCode"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="Bank Name" prop="bankName">
              <el-input v-model="form.bankName" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="Bank Address" prop="bankAddress">
              <el-input v-model="form.bankAddress" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="Account name" prop="accountName">
              <el-input v-model="form.accountName" clearable style="width: 300px" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="Account Address" prop="accountAddress">
              <el-input
                v-model="form.accountAddress"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                clearable
                style="width: 300px"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <div v-for="(item, index) in form.thirdPartyPayment" :key="index" style="display: flex">
              <el-form-item label="第三方支付">
                <el-select style="width: 120px" clearable placeholder="账户平台" v-model="item.platName">
                  <el-option label="支付宝Alipay" :value="'支付宝Alipay'"></el-option>
                  <el-option label="Paypal" :value="'Paypal'"></el-option>
                  <el-option label="Payoneer(P卡)" :value="'Payoneer(P卡)'"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="account">
                <el-input
                  style="width: 255px; margin-left: 10px"
                  placeholder="请输入收款账户名"
                  v-model="item.accountname"
                ></el-input>
              </el-form-item>
              <el-form-item class="account">
                <el-button @click="addAccount" type="primary" style="margin-left: 10px">
                  <i class="icon icon-adds"></i>
                  新增账户
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click.prevent="removeAccount(item, index)"
                  v-if="form.thirdPartyPayment.length > 1"
                >
                  <i class="icon icon-del"></i>
                  删除
                </el-button>
              </el-form-item>
            </div>
          </el-form>
          <div class="btn-group">
            <el-button type="success" size="small" @click="preStep">上一步</el-button>
            <el-button type="primary" size="small" @click="submit" v-if="hasAuthority('E1_18')">提交</el-button>
            <el-button size="small" @click="back">取消</el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSupplierById,
  updateSupplier,
  addSupplier,
  getCurrencyCode
} from "@/api/newApi/supplyChain/serviceproviderManage.js";
import UploadFile from "@/components/UploadFile"; //上传文件组件
import { getallcategory } from "@/api/newApi/servicemerchant/serviceMerchant.js";
import { getCountrySelectList, getFunctionCode } from "@/api/newApi/common.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      enterpriseName: localStorage.getItem("enterpriseName"),
      id: this.$route.query.id,
      tabNav: 0,
      form: {
        status: 1,
        contractDate: [],
        closePeriod: "",
        isPayTaxes: 2,
        categoryList: [],
        countryName: '',
        countryCode: '',
        vatTaxNumberFile: [],
        registerAddress: [{ registerAddress: "" }],
        thirdPartyPayment: [
          {
            platName: "",
            accountname: ""
          }
        ]
      },
      value: "",
      basicInfoRules: {
        countryName: [{ required: true, message: "请选择国家", trigger: "change" }],
        supplierCode: [{ required: !this.$route.params.id, message: "请输入服务商编码", trigger: "blur" }],
        supplierName: [{ required: true, message: "请输入服务商名称", trigger: "blur" }],
        categoryIds: [{ required: true, message: "请选择商品分类", trigger: "change" }],
        shortName: [{ required: true, message: "请输入简称", trigger: "blur" }]
        // email: [
        //   { required: true, message: "请填写法人邮箱", trigger: "blur" },
        //   { type: "email", message: "请填写正确邮箱", trigger: "blur" },
        // ],
      },
      settlementInfoRules: {},
      closeMethod1Rule: Array.apply(null, { length: 3 }).map(item => ({ amount: "", price: 0 })),
      checkList: [],
      functionCode: [],
      countrySelectList: [],
      currencyList: [],
      serviceCascader: [],
    };
  },
  created() {
    this.init();
  },
  components: { UploadFile },
  methods: {
    //返回列表页
    ...mapMutations(["closeTag"]),
    async init() {
      await this._getFunctionCode();
      await this._getCountrySelectList();
      await this._getCurrencyCode();
      await this._getallcategory();
      if (this.id) {
        this.getInfo();
      }
    },
    getInfo() {
      getSupplierById({
        id: this.id
      }).then(res => {
        let result = res.data;
        // 格式化服务分类
        result.categoryIds = result.productcategoryIds
          .split(",")
          .filter(item => item !== "")
          .map(item => item - 0);
        result.categoryNames = result.categoryNames.split(",").filter(item => item !== "");
        result.functionCodes = result.functionCodes.split(",").filter(item => item !== "");
        result.categoryList = [];
        result.categoryIds.forEach((item, index) => {
          result.categoryList.push({
            categoryName: result.categoryNames[index],
            id: item,
            functionCode: result.functionCodes[index] - 0
          });
        });
        // 格式化国家信息
        // result.countryCode = result.countryCodes.split(",")[0];
        // result.countryNameZh = result.countryNames.split(",")[0];
        // result.countryNameEn = result.countryNameEns.split(",")[0];
        // result.countryNameZh = result.countryName;
        // 格式化日期
        if (result.contractStartDate) {
          result.contractDate = [result.contractStartDate, result.contractEndDate];
        } else {
          result.contractDate = [];
        }
        // 格式化计算成本
        if (result.closeMethod === 1) {
          let closeMethod1Rule = result.closeMethod1Rule
            .replace("[", "")
            .replace("]", "")
            .split(",");
          let ruleList = [];
          closeMethod1Rule.forEach((item, index) => {
            let [amount, price] = item.split(":");
            ruleList[index] = { amount, price: price - 0 };
          });
          this.closeMethod1Rule = ruleList;
        }
        if (result.thirdPartyPayment != "") {
          result.thirdPartyPayment = JSON.parse(result.thirdPartyPayment);
        } else {
          result.thirdPartyPayment = [{ platName: "", accountname: "" }];
        }
        if (result.registerAddress != "") {
          result.registerAddress = JSON.parse(result.registerAddress);
          // result.address = [];
          // let address = result.registerAddress.split(",");
          // address.map(item => {
          //   result.address.push({
          //     value: item
          //   });
          // });
        } else {
          result.registerAddress = [{ registerAddress: "" }];
        }
        if (result.countryCode == 'FR' && result.taxNumberFileTemp) {
          result.vatTaxNumberFile = [{ url: result.taxNumberFileTemp, name: "文件1" }];
        }
        this.form = result;
      });
    },
    amountChange(index) {
      let value = this.closeMethod1Rule[index].amount;
      if (value < 0) {
        this.closeMethod1Rule[index].amount = 0;
      }
    },
    // 获取服务分类
    _getFunctionCode() {
      return new Promise(resolve => {
        getFunctionCode().then(res => {
          this.functionCode = res.data;
          resolve();
        });
      });
    },
    // 获取国家列表
    _getCountrySelectList() {
      return new Promise(resolve => {
        getCountrySelectList().then(res => {
          this.countrySelectList = res.data;
          resolve();
        });
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      return new Promise(resolve => {
        getallcategory().then(res => {
          if (res.code == 0) {
            this.formatCategory(res.data);
            this.serviceCascader = res.data;
            resolve();
          }
        });
      });
    },
    formatCategory(data) {
      data.forEach(item => {
        if (item.childrenProductCategoryVo && item.childrenProductCategoryVo.length) {
          this.formatCategory(item.childrenProductCategoryVo);
        } else {
          item.childrenProductCategoryVo = void 0;
        }
      });
    },
    _getCurrencyCode() {
      return new Promise(resolve => {
        getCurrencyCode().then(res => {
          this.currencyList = res.data;
        });
        resolve();
      });
    },
    // 上一步
    preStep() {
      // this.tabNav = "basicInfo";
      this.tabNav = 0;
    },
    // 保存并下一步
    next() {
      this.$refs["basicInfoForm"].validate(valid => {
        if (valid) {
          this.tabNav = 1;
        } else {
          this.$message({
            message: "请检查输入的数据",
            type: "warning"
          });
        }
      });
    },
    // 取消
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/supplychain/serviceproviderManage/index"
      });
    },
    // 提交
    submit() {
      let data = {
        accountName: "",
        bankAddress: "",
        bankIdentifierCode: "",
        bankName: "",
        city: "",
        closeMethod: 0,
        closeMethod1Rule: "",
        closeMethod2Rule: 0,
        closePeriod: 0,
        companyName: "",
        contacts: "",
        contactsTell: "",
        contractEndDate: "",
        contractNum: "",
        contractStartDate: "",
        countryCode: "",
        countryName: "",
        currency: "",
        currencyName: "",
        email: "",
        erpSupplierId: "",
        iban: "",
        isPayTaxes: 2,
        param: "",
        postcode: "",
        // productCategoryId: '',
        province: "",
        remark: "",
        shortName: "",
        status: 2,
        streetAddress: "",
        supplierAddress: "",
        supplierCategoryList: [],
        supplierCode: "",
        supplierName: ""
      };
      for (let key in data) {
        if (this.form.hasOwnProperty(key)) {
          let value = this.form[key];
          data = Object.assign(data, { [key]: value });
        }
      }
      data.registerAddress = JSON.stringify(this.form.registerAddress);
      data.thirdPartyPayment = JSON.stringify(this.form.thirdPartyPayment);
      // 处理服务分类和国家组合数据
      let country = this.countrySelectList.find(item => item.countryNameZh === this.form.countryName) || {};
      if (this.form.categoryIds && this.form.categoryIds.length) {
        let categorysMap = new Map();
        // 拼接数据
        let categorys = this.functionCode.concat(this.form.categoryList).map(item => ({
          categoryName: item.categoryName,
          id: item.id,
          functionCode: item.functionCode
        }));
        // 数据去重、过滤
        categorys = categorys
          .filter(item => !categorysMap.has(item.id) && categorysMap.set(item.id, 1))
          .filter(item => this.form.categoryIds.includes(item.id));
        categorys.forEach(item => {
          data.supplierCategoryList.push({
            categoryName: item.categoryName,
            countryCode: country.countryCode || this.form.countryCode,
            // countryNameEn: country.countryNameEn || this.form.countryNameEn,
            countryNameZh: country.countryNameZh || this.form.countryName,
            functionCode: item.functionCode,
            productCategoryId: item.id
          });
        });
      } else if (this.form.countryName) {
        data.supplierCategoryList.push({
          categoryName: "",
          countryCode: country.countryCode || this.form.countryCode,
          // countryNameEn: country.countryNameEn || this.form.countryNameEn,
          countryNameZh: country.countryNameZh || this.form.countryName,
          functionCode: "",
          productCategoryId: ""
        });
      }
      data.countryCode = country.countryCode || this.form.countryCode;
      data.countryNameZh = country.countryNameZh || this.form.countryNameZh;
      if (data.currency) {
        data.currencyName = this.currencyList.find(item => item.currencyCode === data.currency).currencyCodeName;
      }
      // 处理时间
      if (this.form.contractDate.length) {
        data.contractStartDate = this.form.contractDate[0];
        data.contractEndDate = this.form.contractDate[1];
      }
      // 处理结算成本
      if (data.closeMethod === 1) {
        let amountList = [],
          priceList = [];
        this.closeMethod1Rule.forEach(item => {
          let { amount, price } = item;
          amountList.push(amount);
          priceList.push(price);
          amountList = amountList.filter(i => i !== "");
          priceList = priceList.filter(i => !!i);
        });
        if (amountList.length !== priceList.length || amountList.length === 0) {
          this.$message.warning("请输入阶梯式单价数据");
          return;
        }
        let ruleList = this.closeMethod1Rule
          .filter(item => item.amount !== "")
          .map(item => item.amount + ":" + item.price)
          .join();
        data.closeMethod1Rule = "[" + JSON.stringify(ruleList).replaceAll('"', "") + "]";
        data.closeMethod2Rule = 0;
      } else if (data.closeMethod === 2) {
        if (!data.closeMethod2Rule) {
          this.$message.warning("请输入百分比");
          return;
        }
        data.closeMethod1Rule = "";
      }
      if(data.countryCode == 'FR'){
        if (this.form.vatTaxNumberFile && this.form.vatTaxNumberFile.length) {
          data.taxNumberFileTemp = this.form.vatTaxNumberFile.map((item) => item.url).join(",")
        } else {
          data.taxNumberFileTemp = ''
        }
      }
      
      if (this.id) {
        this._updateSupplier(data);
      } else {
        this._addSupplier(data);
      }
    },
    // 更新
    _updateSupplier(data) {
      updateSupplier({
        ...data,
        id: this.id
      }).then(res => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.back();
        }
      });
    },
    // 新增
    _addSupplier(data) {
      addSupplier(data).then(res => {
        if (res.code === 0) {
          this.$message.success("操作成功");
          this.back();
        }
      });
    },
    //新增地址
    addDomain() {
      this.form.registerAddress.push({
        registerAddress: ""
      });
    },
    removeDomain(item, index) {
      this.form.registerAddress.splice(index, 1);
    },
    /** 新增第三方支付 */
    addAccount() {
      this.form.thirdPartyPayment.push({
        platName: "",
        accountname: ""
      });
    },
    //动态删除
    removeAccount(index) {
      this.form.thirdPartyPayment.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.item-title {
  padding: 0 12px;
}
.back {
  margin: 0 30px;
  cursor: pointer;
}

.btn-group {
  // text-align: center;
  margin-left: 130px;
  padding: 50px;
}
.header-container {
  position: relative;
  &::after {
    position: absolute;
    content: "";
    width: 200px;
    height: 60px;
    top: 0;
    left: 80px;
    z-index: 100;
  }
}
.account {
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
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
        color: #1890ff;
        .el-step__line {
          border-color: #1890ff;
          background-color: #1890ff;
        }
      }
      &.is-process {
        color: #1890ff;
      }
      &.is-finish,
      &.is-process {
        .el-step__icon {
          &.is-text {
            border: 1px solid #1890ff;
            background-color: #1890ff;
            color: #fff;
          }
        }
      }
      .el-step__line {
        left: 0;
        right: 10px;
        background-color: #eeeeee;
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
          color: #1890ff;
        }
      }
    }
  }
}
</style>
