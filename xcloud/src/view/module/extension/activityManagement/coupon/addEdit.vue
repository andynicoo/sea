<template>
  <div class="app-container">
    <div class="header-container">
      <BackHerader @back="goBack" :title="addFrom.source === sourceEnum.MANUAL ? '发放优惠券' : '创建优惠券'" class="backHerder"></BackHerader>
      <el-form label-position="left" :model="addFrom" ref="editFormRef" label-width="120px">
        <!-- 基础设置 -->
        <FormTitle value="基础设置："></FormTitle>
        <div>
          <el-form-item
            label="优惠券名称: "
            prop="couponName"
            :rules="[
              { required: true, message: '优惠券名称不能为空', trigger: 'blur' },
              { min: 2, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' },
            ]"
          >
            <el-input v-model="addFrom.couponName" placeholder="如：庆国庆优惠券，最多10个字" maxlength="10" class="wd-300" :disabled="isDisabled()"></el-input>
          </el-form-item>
          <el-form-item label="优惠券备注: " prop="remark">
            <el-input v-model="addFrom.remark" placeholder="仅在系统内部展示，最多10个字" maxlength="10" class="wd-300" :disabled="isDisabled()"></el-input>
          </el-form-item>

          <el-form-item label="优惠券类型: " prop="couponType" :rules="{ required: true, message: '优惠券类型必选', trigger: 'blur' }">
            <el-select :disabled="isDisabled()" v-model="addFrom.couponType">
              <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="addFrom.source === sourceEnum.ACTIVITY" label="优惠券活动栏目: " prop="activityType">
            <el-select :disabled="isDisabled()" v-model="addFrom.activityType">
              <el-option v-for="item in activityTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-row v-if="addFrom.source === sourceEnum.ACTIVITY">
            <el-col :span="12">
              <el-form-item label="发放总量: " prop="couponTotalRadio">
                <el-radio-group :disabled="isDisabled(true)" v-model="addFrom.couponTotalRadio" @change="(val) => (addFrom.couponTotal = val == '1' ? -1 : 0)">
                  <el-radio :label="1">不限制数量</el-radio>
                  <el-radio :label="2">自定义总数</el-radio>
                </el-radio-group>
                <div class="mg-left-70 mg-top-20">
                  <el-form-item v-if="addFrom.couponTotalRadio == 2" required>
                    发放
                    <el-input-number v-model="addFrom.couponTotal" :min="0" :max="1000000" @change="updateTips"></el-input-number>
                    张
                    <el-row class="tips-style"> 编辑进行中的优惠券，发放总量只能增加不能减少，请谨慎设置。最多1000000张</el-row>
                  </el-form-item>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="用券时间: " prop="useTimeType">
            <el-radio-group :disabled="isDisabled()" v-model="addFrom.useTimeType">
              <el-radio v-for="item in useTimeTypeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
            <div class="mg-top-20">
              <el-form-item v-if="addFrom.useTimeType === useTimeTypeEnum.FIXED_TIME" required>
                <el-form-item prop="useTimeConfig.effectiveTime" :rules="[{ required: true, message: '开始结束时间必选', trigger: 'change' }]" label="固定时间：">
                  <el-date-picker :disabled="isDisabled()" type="datetimerange" placeholder="请选择日期" :picker-options="pickerOptions" v-model="addFrom.useTimeConfig.effectiveTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
              </el-form-item>
              <el-form-item v-else-if="addFrom.useTimeType === useTimeTypeEnum.TERM_EFFECTIVE" required prop="useTimeConfig.day">
                发券当日起<el-input-number v-model="addFrom.useTimeConfig.day" :min="1" :max="2000" :step="1" step-strictly></el-input-number>
                天内可用
              </el-form-item>
              <el-form-item v-else required prop="useTimeConfig">
                发券
                <el-input-number v-model="addFrom.useTimeConfig.afterDayStart" :min="1" :max="2000" :step="1" step-strictly></el-input-number>
                天后生效
                <el-input-number v-model="addFrom.useTimeConfig.afterDayEnd" :step="1" step-strictly :min="1" :max="2000"></el-input-number>
                天内可用
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item v-if="addFrom.source === sourceEnum.ACTIVITY" label="标签: " prop="label">
            <el-select :disabled="isDisabled()" v-model="addFrom.label">
              <el-option v-for="item in labelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <FormTitle value="优惠设置："></FormTitle>
        <div>
          <el-form-item label="优惠内容: " prop="content">
            {{ addFrom.couponType === couponTypeEnum.FULL_REDUCTION ? '减免' : '打' }}
            <span v-if="addFrom.couponType === couponTypeEnum.FULL_REDUCTION">
              <el-input-number v-model="addFrom.content" :disabled="isDisabled()" :step="0.1" :min="0.01" class="num_input" :max="addFrom.couponType === couponTypeEnum.FULL_REDUCTION ? 100000 : 1" @input.native="($event) => changeInputPt($event, 3)"></el-input-number>
            </span>

            <span v-else>
              <el-input-number v-model="addFrom.content" :disabled="isDisabled()" :step="1" :min="1" class="num_input" @input.native="changeInputPt($event)" :max="10"></el-input-number>
            </span>

            {{ addFrom.couponType === couponTypeEnum.FULL_REDUCTION ? '元' : '折' }}
            <div class="mg-left-70 mg-top-20 tips-style">
              <span v-if="addFrom.couponType === couponTypeEnum.DISCOUNT"> 优惠内容是平台单独给消费者的优惠金额，设置大额优惠金额时需谨慎，以免造成资损（测试活动建议设置小额优惠内容）。 </span>
              <span v-else> 面额需大于等于0.01元，支持两位小数，优惠内容是平台单独给消费者的优惠金额，设置大额优惠金额时需谨慎，以免造成资损（测试活动建议设置小额优惠内容）。 </span>
            </div>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用门槛: " prop="useThresholdType">
                <el-radio-group :disabled="isDisabled()" v-model="addFrom.useThresholdType">
                  <el-radio v-for="item in useThresholdTypeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
                <el-form-item v-if="addFrom.useThresholdType !== useThresholdTypeEnum.NO_THRESHOLD" required class="mg-left-70 mg-top-20" prop="useThresholdValue">
                  <div v-if="addFrom.useThresholdType === useThresholdTypeEnum.USE_CONDITION_BY_MONEY">
                    订单满
                    <el-input-number v-model="addFrom.useThresholdValue" :min="0.01" :precision="2" :step="0.01" :max="100000" @input.native="($event) => changeInputPt($event, 3)"></el-input-number>
                    元 可用
                  </div>
                  <div v-if="addFrom.useThresholdType === useThresholdTypeEnum.USE_CONDITION_BY_PIECE">
                    订单满
                    <el-input-number v-model="addFrom.useThresholdValue" :min="1" :step="1" :max="9999" @input.native="($event) => changeInputPt($event, 3)"></el-input-number>
                    件 可用
                  </div>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="适用商品: " prop="applyProductType">
            <el-radio-group :disabled="isDisabled()" v-model="addFrom.applyProductType">
              <el-radio v-for="item in applyProductTypeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
            <el-form-item class="mg-left-70 mg-top-20" v-show="[applyProductTypeEnum.SPECIFIED_PRODUCT_ENABLE, applyProductTypeEnum.SPECIFIED_PRODUCT_DISABLE].includes(addFrom.applyProductType)" prop="activitiesApplyDTOS">
              <el-cascader ref="cascader" v-model="addFrom.activitiesApplyDTOS" :key="isResouceShow" :props="serviceCascaderProps" :options="options" popper-class="my-cascader-class" collapse-tags clearable filterable style="width: 398px"> </el-cascader>
            </el-form-item>
          </el-form-item>
          <el-form-item v-if="addFrom.couponType === couponTypeEnum.FULL_REDUCTION" label="优惠叠加: " prop="couponSuperpose">
            <el-checkbox :disabled="isDisabled()" v-model="addFrom.couponSuperpose" :true-label="couponSuperposeEnum.ORIGINAL_PRICE" :false-label="couponSuperposeEnum.ACTIVITY_PRODUCT">优惠券仅原价购买时可用</el-checkbox>
          </el-form-item>
        </div>

        <div v-if="addFrom.source === sourceEnum.ACTIVITY">
          <!-- 发放和领取设置 -->
          <FormTitle value="发放和转赠设置: "></FormTitle>
          <div>
            <el-form-item label="转赠设置: ">
              <el-checkbox :disabled="isDisabled()" v-model="addFrom.donationSetting">优惠券允许转赠给好友</el-checkbox>
              <el-tooltip class="item" effect="dark" content="转赠的优惠券被领取后不扣减优惠券库存，只做所属权的转移" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="领取人限制: " prop="receiveCondition">
              <el-radio-group :disabled="isDisabled()" v-model="addFrom.receiveCondition">
                <el-radio :label="receiveConditionEnum.ALL_PERSON">不限制，所有人可领</el-radio>
                <el-tooltip class="item" effect="dark" content="指累计在客户端内支付成功订单数为0的客户，仅下1单且全额退款完成也会认定为新客" placement="right">
                  <el-radio :label="receiveConditionEnum.NEW_PERSON"> 新客户可用 <i class="el-icon-question"></i> </el-radio>
                </el-tooltip>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="每人限领次数: " prop="receiveLimitType">
              <el-radio-group :disabled="isDisabled()" v-model="addFrom.receiveLimitType">
                <el-radio v-for="item in receiveLimitTypeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
              <div class="mg-left-70 mg-top-20" v-if="addFrom.receiveLimitType !== receiveLimitTypeEnum.NO_LIMIT">
                <el-form-item required>
                  {{ addFrom.receiveLimitType === receiveLimitTypeEnum.NO_LIMIT ? '限制领取' : '每天限制领取' }}
                  <el-input-number v-if="addFrom.receiveLimitType != void 0" :key="addFrom.receiveLimitType" :disabled="isDisabled()" v-model="addFrom.receiveLimitTimes" :min="0" :step="1" step-strictly></el-input-number>
                  次
                </el-form-item>
              </div>
            </el-form-item>
          </div>
        </div>
        <div v-else>
          <FormTitle value="发放和转赠设置: "></FormTitle>
          <div>
            <el-form-item label="转赠设置: ">
              <el-checkbox :disabled="isDisabled()" v-model="addFrom.donationSetting">优惠券允许转赠给好友</el-checkbox>
              <el-tooltip class="item" effect="dark" content="转赠的优惠券被领取后不扣减优惠券库存，只做所属权的转移" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="每人发放张数: ">
              <el-input-number :disabled="isDisabled()" :step="1" step-strictly v-model="addFrom.num"></el-input-number>
            </el-form-item>
            <el-form-item v-for="(userItem, index) in addFrom.userDTOS" :key="index" :label="index == 0 ? '客户手机号: ' : ''" :prop="'userDTOS.' + index + '.mobile'" :rules="[{ required: true, validator: validateUserPhone, trigger: 'blur' }]">
              <el-col :span="4" style="min-width: 270px">
                <el-input :disabled="isDisabled()" v-model.number="userItem.mobile" placeholder="请输入客户手机号" style="width: 250px"></el-input>
              </el-col>
              <el-col :span="1"> <el-button :disabled="isDisabled()" type="primary" @click="addFrom.userDTOS.push({ mobile: '', userId: '' })">添加</el-button></el-col>
              <el-col :span="1" v-if="addFrom.userDTOS.length > 1"> <el-button :disabled="isDisabled()" type="danger" @click="addFrom.userDTOS.splice(index, 1)">删除</el-button></el-col>
            </el-form-item>
          </div>
        </div>

        <el-form-item class="btns-style">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { sendCoupon, getInfoByMobile, createCoupon, couponInfo, editCoupon } from '@/api/newApi/extension/coupon.js';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import BackHerader from '@/components/backHerader';
import { listByCountryCode } from '@/api/newApi/manuelorder/addOrder.js';
import { getallcategory, getProductList, getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { setObj, flatten, getCategory, getProductSkuList, setNewServiceCascaderList } from './addEditUtil.js';
import {
  couponTypeList,
  couponTypeEnum,
  statusList,
  statusEnum,
  activityTypeList,
  activityTypeEnum,
  applyProductTypeList,
  applyProductTypeEnum,
  receiveLimitTypeList,
  receiveLimitTypeEnum,
  useTimeTypeList,
  useTimeTypeEnum,
  labelList,
  labelEnum,
  couponSuperposeEnum,
  useThresholdTypeList,
  useThresholdTypeEnum,
  receiveConditionEnum,
  sourceEnum,
} from './enumObj.js';
export default {
  components: {
    BackHerader,
    FormTitle,
  },
  data() {
    const validateUserPhone = (rule, value, callback) => {
      let phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/,
        self = this;
      let userArr = this.addFrom.userDTOS;
      let isIncludes = userArr.filter((filterTtem) => filterTtem.mobile == value);

      if (value == '') {
        callback(new Error('请输入手机号'));
      } else if (!phonereg.test(value)) {
        callback(new Error('手机号格式不正确'));
      } else if (isIncludes.length > 1) {
        callback(new Error('请勿输入重复的手机号'));
      } else {
        getInfoByMobile({ mobile: value.toString() }).then((res) => {
          let { code, data } = res;
          if (code != 0 || data == {} || JSON.stringify(data) == '{}') {
            callback(new Error('用户不存在'));
          } else {
            let idx = userArr.findIndex((findIndexTtem) => findIndexTtem.mobile == value);
            if (idx != -1) self.addFrom.userDTOS[idx].userId = Number(data.userId);
            callback();
          }
        });
      }
    };
    return {
      isResouceShow: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      addFrom: {
        couponType: couponTypeEnum.FULL_REDUCTION,
        useTimeConfig: {
          afterDayStart: 1,
          effectiveTime: '',
          day: 0,
          afterDayEnd: 0,
        },
        activityType: activityTypeEnum.VIP_COUPON,
        activitiesApplyDTOS: [],
        content: 1,
        couponName: '',
        useTimeType: useTimeTypeEnum.FIXED_TIME,
        useThresholdType: useThresholdTypeEnum.NO_THRESHOLD, //使用门槛类型
        useThresholdValue: 0,
        applyProductType: applyProductTypeEnum.ALL_PRODUCT,
        couponSuperpose: couponSuperposeEnum.ACTIVITY_PRODUCT,
        donationSetting: false,
        num: 1, //每人发放张数
        userDTOS: [{ mobile: '', userId: '' }],
        source: this.$route.query.source,
        status: 0, //状态
        enterpriseId: window.localStorage.getItem('enterpriseId'),
        couponTotal: -1,
        couponTotalRadio: 1,
        label: labelEnum.NO_USE_LABEL,
        receiveCondition: receiveConditionEnum.ALL_PERSON,
        receiveLimitType: receiveLimitTypeEnum.NO_LIMIT,
        receiveLimitTimes: 1,
      },
      // 优惠券类型列表
      couponTypeList,
      // 优惠券类型枚举
      couponTypeEnum,
      // 状态列表
      statusList,
      // 状态枚举
      statusEnum,
      // 活动类型列表
      activityTypeList,
      // 可用商品类型列表
      applyProductTypeList,
      // 可用商品类型枚举
      applyProductTypeEnum,
      // 限领次数列表
      receiveLimitTypeList,
      // 限领次数枚举
      receiveLimitTypeEnum,
      // 用券时间列表
      useTimeTypeList,
      // 用券时间枚举
      useTimeTypeEnum,
      // 标签列表
      labelList,
      // 优惠叠加枚举
      couponSuperposeEnum,
      // 使用门槛列表
      useThresholdTypeList,
      // 使用门槛枚举
      useThresholdTypeEnum,
      // 领取人枚举
      receiveConditionEnum,
      // 来源方式枚举
      sourceEnum,

      serviceCascaderList: [],
      serviceCascaderProps: {
        expandTrigger: 'hover',
        emitPath: true,
        multiple: true,
        // lazy: true,
        // lazyLoad: this.lazyLoad,
      },
      options: [],

      //商品服务名称列表
      serviceList: [],
      validateUserPhone,
      submitLoading: false,
      updateTipsSign: 0,
      isEdit: this.$route.query.isEdit, //是不是编辑 或者查看
      childgoryids: [], //商品id集合
      saveActivitiesApplyDTOS: [], //记录 activitiesApplyDTOS
      nodeTree: new Set(),
      nodeSecond: new Map(),
      categoryList: [],
      showDetail: false,
    };
  },

  watch: {
    'addFrom.useThresholdValue': {
      handler: function (value) {
        this.addFrom.couponType === this.couponTypeEnum.FULL_REDUCTION && this.validThreshold(value);
      },
      deep: true,
      immediate: true,
    },

    'addFrom.couponType': {
      handler: function (value) {
        this.addFrom.content = 1;
      },
    },
  },

  computed: {
    /**按钮禁用 */
    isDisabled() {
      let disabledType = this.$route.query.disabledType;
      return (special = false) => !(disabledType === statusEnum.NOT_STARTED || (disabledType === statusEnum.PROCESSING && special));
    },
  },
  mounted() {
    if (this.isEdit && !this.showDetail) {
      this.getDetailAPi();
    }
    this.getCategoryList();
  },

  methods: {
    validThreshold(value) {
      let valid = value < this.addFrom.content && this.addFrom.useThresholdType === useThresholdTypeEnum.USE_CONDITION_BY_MONEY;
      valid && this.$message.warning('门槛金额不能低于优惠金额');
      return !valid;
    },

    /**
     *   限制 输入  小数 位数
     * @param {*} e
     * @param {*} number
     */
    changeInputPt(e, number = 2) {
      let event = e.target.value;
      if (event.indexOf('.') >= 0) {
        e.target.value = event.substring(0, event.indexOf('.') + number);
      }
    },

    goBack() {
      this.$router.push({ path: '/extension/activityManagement/coupon/index' });
    },

    /**获得 详情回显数据 */
    async getDetailAPi() {
      return new Promise(async (resolve) => {
        let { code, data } = await couponInfo({ couponId: this.isEdit, enterpriseId: window.localStorage.getItem('enterpriseId') - 0 });
        code == 0 && this.$set(this, 'addFrom', await this.transformData(data, 'echo'));
        this.showDetail = true;
        resolve();
      });
    },
    // 懒加载获取商品
    async lazyLoad(node, resolve) {
      if (this.isEdit && !this.showDetail) {
        await this.getDetailAPi();
      }
      let activitiesApplyDTOS = [...this.addFrom.activitiesApplyDTOS];
      const { level, value } = node;
      if (level === 0) {
        if (!this.categoryList.length) {
          await this.getCategoryList();
        }
        if (this.isEdit) {
          resolve(this.cascadeoptionsrOptions);
        } else {
          resolve(this.categoryList);
        }
      } else if (level === 1) {
        let result = this.serviceList[value];
        if (!result) {
          result = await this.getProductInfoList({ productCategoryId: value });
        }
        if (this.isEdit) {
          this.options.forEach((item) => {
            if (item.value === value && !item.children) {
              item.children = result;
            }
          });
          resolve();
        } else {
          resolve(result);
        }
      } else {
        resolve();
      }
      if (level !== 0) {
        this.$nextTick(() => {
          if (JSON.stringify(this.addFrom.activitiesApplyDTOS) !== activitiesApplyDTOS) {
            this.addFrom.activitiesApplyDTOS = activitiesApplyDTOS;
          }
          let panel = this.$refs.cascader.panel;
          setTimeout(() => {
            if (level === 1) {
              this.checkNode = node;
              panel.handleExpand(node, true);
              panel.$refs.menu = [node];
              panel.scrollIntoView();
            }
            if (level === 2) {
              if (this.checkNode && this.checkNode.value !== node.parent.value) {
                panel.handleExpand(this.checkNode, true);
                panel.handleExpand(node, true);
                panel.activePath = [this.checkNode, node];
              } else {
                panel.handleExpand(node.parent, true);
                panel.handleExpand(node, true);
                panel.activePath = [node.parent, node];
              }
            }
          }, 0);
        });
      }
    },
    // 获取商品分类
    getCategoryList() {
      return new Promise((resolve) => {
        getProductCategory({
          size: -1,
          status: 'ENABLE',
        }).then((res) => {
          let data = res.data.records;
          data.forEach((item) => {
            item.label = item.categoryName;
            item.value = item.id;
          });
          this.categoryList = data;
          this.getOptions();
          // if (this.isEdit) {
          //   this.categoryList.forEach((item) => {
          //     this.options.push({
          //       value: item.id,
          //       label: item.categoryName,
          //       children: this.serviceList[item.id],
          //     });
          //   });
          // }
          resolve();
        });
      });
    },
    getOptions() {
      let list = this.categoryList.map((item) => this.getProductInfoList({ productCategoryId: item.id }));
      const p = Promise.all(list);
      p.then((res) => {
        this.options = this.categoryList.map((item, index) => ({
          ...item,
          children: res[index].length ? res[index] : undefined,
        }));
        this.isResouceShow++;
      });
    },
    // 获取商品信息
    getProductInfoList({ productCategoryId }) {
      return new Promise((resolve) => {
        getProductList({
          size: -1,
          productStatus: 'PENDED_PUBLISH', // 上架商品
          productCategoryId,
        }).then((res) => {
          let data = res.data.records;
          data.forEach((item) => {
            item.label = item.productName;
            item.value = item.id;
            if (this.isCombinationProduct(item.isCombinationProduct)) {
              item.children = item.productInfoDTOList.map((p) => ({
                // ...p,
                label: p.productName,
                value: p.id,
                leaf: true,
              }));
            } else if (item.productSpecsDTOList && item.productSpecsDTOList.length) {
              item.children = item.productSpecsDTOList.map((p) => ({
                // ...p,
                label: p.specsName,
                value: p.id,
                leaf: true,
              }));
            }
          });
          this.serviceList[productCategoryId] = data;
          resolve(data);
        });
      });
    },
    isCombinationProduct(value) {
      return value === 'IS_COMBINATION_PRODUCT';
    },

    updateTips(current, old) {
      const tem = '<p>你正在修改优惠券信息，会影响*张已领取未使用的优惠券,' + '并且使用门槛、优惠内容、用券时间信息在微信卡包处无法同步修改,' + '导致微信卡包处展示的信息和实际不一致，易引起客户投诉。</p>';
      if (this.$route.query.disabledType === statusEnum.PROCESSING && this.updateTipsSign == 0) {
        this.updateTipsSign = 1;
        this.$confirm(tem, '温馨提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            this.addFrom.couponTotal = current;
          })
          .catch(() => {
            this.addFrom.couponTotal = old;
            this.$message({
              type: 'info',
              message: '已取消编辑',
            });
          });
      }
    },

    onSubmit() {
      if (!this.validThreshold(this.addFrom.useThresholdValue)) return;
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          const param = await this.transformData(JSON.parse(JSON.stringify({ ...this.addFrom })), 'create'); //设置参数
          this.isEdit ? await this.editCoupon(param) : await this.createTypeCoupon(param);
          setTimeout(this.goBack, 300);
          this.submitLoading = false;
        }
      });
    },

    /*创建优惠券*/
    async createTypeCoupon(param) {
      return new Promise(async (resolve) => {
        let ble = this.addFrom.source === sourceEnum.MANUAL;
        let { code } = ble ? await sendCoupon(param) : await createCoupon(param);
        if (code == 0) this.$message.success('操作成功');
        resolve();
      });
    },
    /**编辑优惠券 */
    async editCoupon(param) {
      return new Promise(async (resolve) => {
        let { code } = await editCoupon(param);
        if (code == 0) this.$message.success('编辑成功');
        resolve();
      });
    },
    formatDTO() {
      let arr = [];
      let categoryList = [...new Set(this.addFrom.activitiesApplyDTOS.map((item) => item[0]))];
      let m = new Map();
      this.addFrom.activitiesApplyDTOS.forEach((item) => {
        let ids = m.get(item[0]) || [];
        ids.push(item[1]);
        ids = [...new Set(ids)];
        m.set(item[0], ids);
      });
      categoryList.forEach((item) => {
        let obj = {
          productCategoryId: item,
          productCategoryName: this.categoryList.find((c) => c.id === item).categoryName,
          productList: [],
        };
        let productIdList = m.get(item);
        if (this.serviceList[item].length > productIdList.length) {
          obj.productList = this.serviceList[item]
            .filter((p) => productIdList.includes(p.id))
            .map((p) => ({
              productName: p.productName,
              productInfoId: p.id,
            }));
        }
        arr.push(obj);
      });
      return arr;
    },
    /**
     * 工厂函数
     * 优惠券保存设置参数 || 编辑时回显数据
     * @param {*} oldValue 旧数据
     * @param {*} type 设置参数 , 设置回显数据
     */
    async transformData(params, type) {
      return new Promise(async (resolve) => {
        type = type == 'create' ? true : false;
        const donationSetting = () => {
          return type ? (params['donationSetting'] == true ? 'ALLOW ' : 'NOT_ALLOW') : params['donationSetting'] == 'ALLOW' ? true : false;
        };
        // const couponSuperpose = () => {
        //   return type ? (params['couponSuperpose'] == true ? 'ORIGINAL_PRICE' : 'ACTIVITY_PRODUCT') : params['couponSuperpose'] == 'ORIGINAL_PRICE' ? true : false;
        // };
        const setUseTimeConfig = () => {
          let value = params['useTimeConfig'];
          const useTimeConfig = () => {
            if (value.effectiveTime && value.effectiveTime.length > 0) {
              return {
                ...value,
                validStartDate: value.effectiveTime[0],
                effectiveEndDate: value.effectiveTime[1],
              };
            } else {
              return value;
            }
          };
          return type ? useTimeConfig() : { ...value, effectiveTime: [value.validStartDate, value.effectiveEndDate] };
        };

        const setCouponTotalRadioVal = () => {
          return params['couponTotal'] != -1 ? (params.couponTotalRadio = 2) : (params.couponTotalRadio = 1);
        };

        // const activitiesApplyDTOS = () => (type ? self.setTreeData(params['activitiesApplyDTOS']) : self.cchoCascader(params['activitiesApplyDTOS']));
        let activitiesApplyDTOS = [];
        if (type) {
          activitiesApplyDTOS = this.formatDTO();
        } else {
          activitiesApplyDTOS = await this.cchoCascader(params['activitiesApplyDTOS']);
        }
        resolve({
          ...params,
          // couponSuperpose: couponSuperpose(),
          donationSetting: donationSetting(),
          useTimeConfig: setUseTimeConfig(),
          activitiesApplyDTOS: activitiesApplyDTOS,
          ...(!type && { couponTotalRadio: setCouponTotalRadioVal() }),
        });
      });
    },

    /**
     * 遍历所有三级数据
     * 通过用户选择的数据 转为后端需要的二维数据
     * @param {*} treeList
     */
    setTreeData(treeList) {
      const cascader = this.$refs.cascader;
      if (cascader && cascader.getCheckedNodes()) {
        let nodes = cascader.getCheckedNodes().filter((item) => item.level == 2),
          nodeSecond = new Map(),
          list = [];
        nodes.forEach((item) => nodeSecond.set(item.value, item));
        //过滤不要的数据
        treeList = treeList.filter((item) => !nodeSecond.has(JSON.parse(item).productCategoryId));
        treeList.forEach((tree) => {
          tree = JSON.parse(tree);
          // 是否找到
          let signIndex = list.findIndex((val) => val.productCategoryId == tree.productCategoryId);
          if (signIndex != -1) {
            // 找到就在指定对象后新增

            list[signIndex].productList.push(...getProductSkuList(tree.productSkuVOList));
          } else {
            //没有push一个新的

            list.push({
              ...setObj(tree, ['productCategoryId', 'productCategoryName']),
              productList: getProductSkuList(tree.productSkuVOList) || [],
            });
          }
        });

        nodeSecond.forEach((item) => {
          list.push({
            productCategoryId: item.value,
            productCategoryName: item.label,
            productList: [],
          });
        });
        return list;
      } else {
        return [];
      }
    },

    /**回显三级联动 */
    async cchoCascader(value) {
      let m = [];
      value.forEach((item) => {
        m[item.productCategoryId] = item.productList.map((p) => p.productInfoId);
      });
      let arr = [];
      let keys = Object.keys(m);
      return new Promise((resolve) => {
        if (!keys.length) {
          resolve(arr);
        }
        keys.forEach(async (productCategoryId, i) => {
          await this.getProductInfoList({ productCategoryId });
          let value = m[productCategoryId];
          let list = this.serviceList[productCategoryId];
          if (value.length) {
            list = this.serviceList[productCategoryId].filter((product) => value.includes(product.value));
          }
          list.forEach((product) => {
            product.children.forEach((p) => {
              arr.push([productCategoryId, product.value, p.value]);
            });
          });
          if (i === keys.length - 1) {
            resolve(arr);
          }
        });
      });
    },

    /**
     * 对照寻找 回显三级联动用户选择的 数据
     * @param {*} activities info接口数据
     * @param {*} cascader   组件数据
     */
    echoActivitiesApplyDTOS(activities, cascader) {
      const list = flatten(cascader)
        .map((item) => (typeof JSON.parse(item.value) == 'object' ? item : void 0)) // 过滤一级二级
        .filter((item) => item != void 0); // 所有

      let result = [];
      activities.forEach((activitie) => {
        let second = list.filter((l) => JSON.parse(l.value).productCategoryId === activitie.productCategoryId);
        if (activitie.productList.length) {
          second.forEach((s) => {
            activitie.productList.forEach((a) => {
              let skuIds = JSON.parse(s.value).productSkuVOList.map((p) => p.skuId);
              if (skuIds.includes(a.productSkuId)) {
                result.push(s);
              }
            });
          });
        } else {
          result = result.concat(second);
        }
      });
      return result.map((item) => item.value);
    },
  },
};
</script>

<style lang="less" scoped>
@import url(./less/addEdit.less);
.app-container {
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;
  .titleStyle {
    margin-bottom: 20px;
  }
  .el-form {
    padding-top: 20px;
  }
  .el-form-item__label {
    text-align: right;
  }
}
</style>

<style lang="less">
v::deep.el-cascader-panel {
  .el-scrollbar:first-child {
    .el-checkbox {
      display: none;
    }
  }
}

.my-cascader-class {
  .el-scrollbar {
    &:first-child {
      .el-checkbox {
        display: none;
      }
    }
    &:nth-child(3) {
      .el-checkbox {
        cursor: no-drop;
        pointer-events: none;
      }
    }
  }
}
</style>
