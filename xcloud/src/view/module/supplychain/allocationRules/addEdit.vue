<template>
  <div class="main-wrapper">
    <div class="app-container">
      <div class="header-container">
        <span class="back" @click="cancel()">
          <Icon type="ios-arrow-back" />
          返回列表
        </span>
        <el-form :model="form" ref="formRef" :rules="ruleValidate" label-width="130px">
          <el-form-item label="商品分类" prop="productCategoryId">
            <!-- <el-select style="width: 300px" size="small" v-model="form.productCategoryId" filterable>
              <el-option
                v-for="item in functionCode"
                :key="item.id"
                :value="item.id"
                :label="item.categoryName"
              ></el-option>
            </el-select> -->
            <el-cascader
              style="width: 300px"
              clearable
              @change="productCategoryChange"
              v-model="form.productCategoryId"
              :options="serviceCascader"
              :show-all-levels="false"
              :props="{
                children: 'childrenProductCategory',
                value: 'id',
                label: 'categoryName',
                emitPath: false,
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="国家" prop="countryName">
            <el-select style="width: 300px" size="small" v-model="form.countryName" clearable filterable @change="productCategoryChange">
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryNameZh" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.productCategoryId && typeInfo">
            <el-form-item label="所属工单类型" required> {{ typeInfo.functionName || '无匹配数据，配置入口：工单管理-工单类型管理' }} </el-form-item>
            <el-form-item label="已发布流程" required>
              <template v-if="typeInfo.workFlowsVOList && typeInfo.workFlowsVOList.length">
                <p v-for="workFlow in typeInfo.workFlowsVOList" :key="workFlow.flowId">{{ workFlow.flowName }}</p>
              </template>
              <p v-else>暂无数据，配置入口：工单管理-工单配置：流程配置</p>
            </el-form-item>
          </template>
          <el-form-item label="供应商类型" prop="supplierType">
            <el-select style="width: 300px" size="small" v-model="form.supplierType" filterable>
              <el-option :value="1" label="服务商"></el-option>
              <el-option :value="2" label="律师"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="执行时间范围" prop="dateRange">
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 450px"
              align="right"
              size="small"
              unlink-panels
            ></el-date-picker>
          </el-form-item> -->
          <!-- <el-form-item label="预分配律师" prop="preSupplierId" v-if="form.supplierType == 2">
            <el-select style="width: 300px" size="small" v-model="form.preSupplierId" clearable filterable>
              <el-option value="请选择预分配律师" :label="-1">
                <span style="float: left">名称</span>
                <span style="float: right; color: #8492a6; font-size: 13px">联系方式</span>
              </el-option>
              <el-option v-for="item in lawyerList" :key="item.id" :value="item.id" :label="item.attorneyName">
                <span style="float: left">{{ item.attorneyName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.attorneyTel }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="使用证据补正律师" prop="evidenceCorrectionAttorneyId" v-if="form.productCategoryId && form.productCategoryId == categoryId">
            <el-select style="width: 300px" size="small" v-model="form.evidenceCorrectionAttorneyId" clearable filterable>
              <el-option value="请选择使用证据补正律师" :label="-1">
                <span style="float: left">名称</span>
                <span style="float: right; color: #8492a6; font-size: 13px">联系方式</span>
              </el-option>
              <el-option v-for="item in lawyerList" :key="item.id" :value="item.id" :label="item.attorneyName">
                <span style="float: left">{{ item.attorneyName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.attorneyTel }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="总基数" prop="baseNum">
            <el-input-number v-model="form.baseNum" :min="1" :precision="0" style="width: 300px" size="small" />
          </el-form-item> -->
          <!-- <el-form-item label="状态" prop="status"> -->
          <!-- <el-radio v-model="form.status" :label="1">启用</el-radio>
            <el-radio v-model="form.status" :label="2">禁用</el-radio> -->
          <!-- <el-select style="width: 300px" size="small" clearable v-model="form.status">
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="2" label="禁用">禁用</el-option>
            </el-select> -->
          <!-- </el-form-item> -->
          <el-tooltip placement="top">
            <div class="addEdit-tips" slot="content">
              <!-- <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i> -->
              <h6>操作提示</h6>
              <ul>
                <li>百分比仅限录入10的倍数（如20、30…），录入值最小为10，最大为100</li>
                <li>全部比例之和必须等于100</li>
                <li>默认分配基数为10，即每10单按设定的比例进行分配</li>
                <li>调整分配比例并提交后，即刻生效</li>
              </ul>
            </div>
            <el-form-item label="分配比例" prop="channelUserName">
              <div v-for="(rule, index) in ruleList" :key="index" style="margin-bottom: 10px">
                <!-- <span class="item-title">处理人</span> -->
                <div>
                  <el-select style="width: 300px" placeholder="请选择跟进人" size="small" filterable v-model="rule.supplierId" @change="changeHandleUser($event, index)" :disabled="ruleDisabled">
                    <el-option-group>
                      <div class="option_title" style="background: #f6f8fa">
                        <span>编码</span>
                        <span>名称</span>
                        <!-- <span>联系方式</span> -->
                      </div>
                      <el-option v-for="item in handlerUserList" :key="item.supplierCode" :label="item.shortName" :value="item.id" class="option_title">
                        <span>{{ item.supplierCode }}</span>
                        &nbsp;
                        <span>{{ item.shortName }}</span>
                        <!-- &nbsp;
                    <span>{{ item.mobile }}</span> -->
                      </el-option>
                    </el-option-group>
                  </el-select>
                  <span class="item-title">百分比%</span>
                  <el-input-number v-model="rule.percentage" :step="10" step-strictly :min="10" :max="100" clearable style="width: 150px; margin-right: 20px" size="small" />
                  <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="addRuleList(index)"> 添加 </el-button>
                  <!-- <el-input-number v-model="rule.percentage" :min="0" :max="100" clearable style="width: 150px; margin-right: 20px" size="small" />
                <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="addRuleList(index)">
                  添加
                </el-button> -->
                  <el-button size="small" icon="el-icon-delete" type="danger" @click="delRuleList(index)" v-if="ruleList.length > 1"> 删除 </el-button>
                </div>
              </div>
            </el-form-item>
          </el-tooltip>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" clearable style="width: 300px" size="small" />
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button type="primary" :loading="loading" size="small" @click="submit" v-show="hasAuthority('E1_26')">提交</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 页面右侧信息展示栏 -->
    <add-edit-right :key="addRightKey"></add-edit-right>
  </div>
</template>

<script>
import { getSupplierAllotRuleInfo, updateSupplierAllotRule, addSupplierAllotRule, getHandlerUserList, getInfoByCategory } from '@/api/newApi/supplyChain/allocationRules.js';
import { getLawyerList } from '@/api/newApi/supplyChain/lawyerManage.js';
import { getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getCountrySelectList, getFunctionCode } from '@/api/newApi/common.js';
import { mapMutations } from 'vuex';
import AddEditRight from './components/addEditRight.vue';
export default {
  components: {
    AddEditRight,
  },
  data() {
    return {
      id: this.$route.query.id || '',
      menuId: this.$route.query.menuId,
      allocationFunctionCode: this.$route.query.functionCode || 0,
      showType: 1,
      form: {
        supplierType: 1,
        status: 1,
        baseNum: 0,
        productCategoryId: '',
        countryCode: '',
        countryName: '',
        dateRange: [],
      },
      ruleValidate: {
        supplierType: [{ required: true, message: '请选择对象类型', trigger: 'blur' }],
        productCategoryId: [{ required: true, message: '请选择服务分类', trigger: 'blur' }],
        countryName: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        dateRange: [{ type: 'array', required: true, message: '请选择执行时间单范围', trigger: 'blur' }],
        baseNum: [{ required: true, message: '请输入总基数', trigger: 'blur' }],
      },
      ruleList: [
        {
          supplierId: '',
          percentage: 10,
        },
      ],
      serviceCascader: [],
      functionCode: [],
      countrySelectList: [],
      handlerUserList: [],
      loading: false,
      lawyerList: [],
      infoData: {},
      categoryId: '',
      addRightKey: new Date().getTime(),
      typeInfo: null,
      //
    };
  },
  computed: {
    ruleDisabled() {
      const { supplierType, productCategoryId, countryName } = this.form;
      const result = !(supplierType && productCategoryId && countryName);
      if (!result) {
        this._getHandlerUserList();
        this.ruleList = [
          {
            supplierId: '',
            percentage: 10,
          },
        ];
      }
      return result;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this._getCountrySelectList();
      await this._getallcategory();
      await this.getLawyerListFunc();
      if (this.id) {
        this.getInfo();
      }
    },
    getInfo() {
      getSupplierAllotRuleInfo({
        id: this.id,
        showType: this.showType,
        functionCode: this.allocationFunctionCode || 0,
      }).then((res) => {
        let result = res.data;
        this.infoData = res.data;
        this.addRightKey = new Date().getTime();
        if (result.startDate) {
          result.dateRange = [result.startDate, result.endDate];
        }
        setTimeout(() => {
          this.ruleList = this.setRuleList(result.supplierAllotRuleDetailsVOList);
        });
        this.form = result;
        this._getHandlerUserList();
        this.productCategoryChange(res.data.productCategoryId);
      });
    },

    setRuleList(array) {
      let arr = [];
      array.forEach((item) => {
        if (item.id !== 0 && item.id && item.id != '') {
          arr.push({
            realName: item.realName,
            percentage: item.percentage,
            supplierId: item.supplierId,
          });
        }
      });
      return arr;
    },
    // 获取律师列表
    getLawyerListFunc() {
      let data = {
        attorneyAbbreviation: '',
        countryCodes: '',
        enterpriseId: '',
        isOpen: 1,
        limit: -1,
        page: -1,
        productCategoryIds: '',
        menuId: this.menuId || this.$parent.menuId,
      };
      getLawyerList(data).then((res) => {
        if (res.code == 0) {
          this.lawyerList = res.data.records;
        }
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
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      return new Promise((resolve) => {
        getProductCategory({
          size: -1,
          status: 'ENABLE',
        }).then((res) => {
          if (res.code == 0) {
            let data = res.data.records.filter((item) => item.childrenProductCategory && item.childrenProductCategory.length);
            this.formatCategory(data);
            this.serviceCascader = data;
            resolve();
          }
        });
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    // 根据商品分配查询工单类型和已发布流程信息
    productCategoryChange() {
      let { productCategoryId,countryName } = this.$data.form;
      if(!productCategoryId){
        this.$message({
          message: '请选择产品分类',
          type: 'warning'
        });
        return
      }
      if(!countryName) return
      let countryCode = this.$data.countrySelectList.find(item=> item.countryNameZh === countryName).countryCode;
      getInfoByCategory({
        productCategoryId: productCategoryId,
        countryCode: countryCode
      }).then((res) => {
        if (res.code === 0) {
          this.typeInfo = res.data;
        }
      });
    },
    // 获取处理人列表
    _getHandlerUserList() {
      const { countryName, countryCode, productCategoryId, supplierType, dateRange } = this.form;
      let country = this.countrySelectList.find((item) => item.countryNameZh === countryName);
      let newCountryCode = country ? country.countryCode : countryCode;
      let data = {
        countryCode: newCountryCode,
        countryCodeList: [newCountryCode],
        supplierType,
        productCategoryId,
        // startDate: dateRange[0],
        // endDate: dateRange[1],
      };
      getHandlerUserList(data).then((res) => {
        this.handlerUserList = res.data;
      });
    },
    changeHandleUser(e, index) {
      this.ruleList[index].realName = this.handlerUserList.find((user) => user.id === e).shortName;
    },
    addRuleList(index) {
      this.ruleList.splice(index + 1, 0, {
        supplierId: '',
        percentage: 0,
      });
    },
    delRuleList(index) {
      if (this.ruleList.length === 1) {
        this.$message.error('不能删除了！');
        return;
      }
      this.ruleList.splice(index, 1);
    },
    submit() {
      let percentage = this.ruleList.reduce((pre, cur) => {
        return this.$util.parseAdd(pre, cur.percentage);
      }, 0);
      if (percentage !== 100) {
        this.$message.error('分配规则百分比之和不为100%！');
        return;
      }
      if (this.ruleList.some((item) => !item.supplierId)) {
        this.$message.error('请选择处理人！');
        return;
      }
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          let country = this.countrySelectList.find((item) => item.countryNameZh === this.form.countryName);
          let category = {};
          for (let item of this.serviceCascader) {
            let c = item.childrenProductCategory.find((child) => child.id === this.form.productCategoryId);
            if (c) {
              category = c;
              break;
            }
          }
          let data = {
            // baseNum: this.form.baseNum,
            countryCode: country ? country.countryCode : this.form.countryCode,
            countryName: this.form.countryName,
            // endDate: this.form.dateRange[1],
            productCategoryId: this.form.productCategoryId,
            productCategoryName: category ? category.categoryName : this.form.productCategoryName,
            remark: this.form.remark,
            // startDate: this.form.dateRange[0],
            // status: this.form.status,
            supplierAllotRuleDetailsAddDTOList: this.ruleList,
            supplierType: this.form.supplierType,
            // preSupplierId: this.form.preSupplierId,
            evidenceCorrectionAttorneyId: this.form.productCategoryId == this.categoryId ? this.form.evidenceCorrectionAttorneyId : '',
          };
          this.loading = true;
          if (this.id) {
            this.updateRule(data);
          } else {
            this.addRule(data);
          }
        } else {
          this.$message({
            message: '请检查输入的数据',
            type: 'warning',
          });
        }
      });
    },
    // 更新
    updateRule(data) {
      updateSupplierAllotRule({
        ...data,
        id: this.id,
      })
        .then((res) => {
          this.$message.success('操作成功');
          this.loading = false;
          this.cancel();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    // 新增
    addRule(data) {
      addSupplierAllotRule(data)
        .then((res) => {
          this.$message.success('操作成功');
          this.loading = false;
          this.cancel();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    ...mapMutations(['closeTag']),
    // 取消
    cancel() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/supplychain/allocationRules/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 550px);
    flex: 0 0 calc(100% - 550px);
    margin-top: 10px;
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}
.header-container {
  min-height: calc(100vh - 130px);
}
.back {
  padding: 15px;
  cursor: pointer;
}
.item-title {
  padding: 0 12px;
}
.item-tip {
  padding: 0 12px;
}
.btn-group {
  // text-align: center;
  margin-left: 60px;
  padding: 50px;
}
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 2;
  }
}
.addEdit-tips {
  ul {
    padding: 0% 0% 0% 3.5%;
  }
}
</style>
