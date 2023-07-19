<template>
  <div class="app-container">
    <BackHerader @back="goBack" title="新增活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础服务："></FormTitle>
        <el-form-item label="活动名称：" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="活动类型：" prop="activityType">
          <el-select v-model="form.activityType" placeholder="请选择活动类型" clearable style="width: 360px" :disabled="isEdit">
            <el-option v-for="item in activityType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间：" prop="activityTime">
          <el-date-picker v-model="form.activityTime" type="datetimerange" align="right" size="small" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 360px"
            :disabled="isEdit"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动标签：" prop="activityLabel">
          <el-input v-model="form.activityLabel" maxlength="8" minlength="2" placeholder="请输入活动标签" clearable
            style="width: 360px" :disabled="isEdit" />
          <span style="padding-left: 10px">
            <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
            <span class="text-tips item-tip" style="padding: 10px 0"> 活动期间展示于商品详情的价格旁边，2至8字 </span>
          </span>
        </el-form-item>
        <el-form-item label="每人限购：" prop="forPurchasing">
          <el-radio-group v-model="form.forPurchasing" @change="changeForPurchasing" :disabled="isEdit">
            <el-radio :label="1">不限购</el-radio>
            <el-radio :label="2">开启限购</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="">

        </el-form-item> -->
        <div v-if="form.forPurchasing == 2">
          <el-form-item prop="buyLimit">
            <el-row>
              <span>每单限购</span>
              <el-input-number v-model="form.buyLimit" controls-position="right" placeholder="请输入每单限购数量"
                style="width: 190px; margin: 0 10px" clearable :min="0" :max="99999999999" :disabled="isEdit" />
              <span>件/人</span>
            </el-row>
          </el-form-item>

          <el-form-item prop="totalBuyLimit">
            <el-row>
              <el-checkbox v-model="checkedActivities">活动总限购</el-checkbox>
              <el-input-number v-model="form.totalBuyLimit" controls-position="right" placeholder="请输入总限购数量"
                style="width: 190px; margin: 0 10px" clearable :min="0" :max="99999999999"
                :disabled="isEdit || !checkedActivities" />
              <span>件/人</span>
            </el-row>
          </el-form-item>
        </div>

        <el-form-item label="订单取消时间：" prop="orderCancelTime">
          <span>买家</span>
          <el-input-number v-model="form.orderCancelTime" controls-position="right" placeholder="请输入订单取消时间"
            style="width: 190px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit" />
          <span>分钟未支付订单，订单取消</span>
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <Editor :value.sync="form.activityRule" style="width: 1000px" :disabled="isEdit" v-if="!isEdit"></Editor>
          <div v-html="form.activityRule" style="word-break: break-all" v-else></div>
        </el-form-item>
        <el-form-item label="库存方式：" prop="destockingMethod">
          <el-radio-group v-model="form.destockingMethod" :disabled="isEdit">
            <el-radio label="PAYMENT_DESTOCKING">付款减库存</el-radio>
            <el-radio label="PLACE_AN_ORDER_DESCTOCKING">下单减库存</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="支持支付类型：" prop="supportPayType">
          <el-checkbox-group v-model="form.supportPayType" :disabled="isEdit">
            <el-checkbox label="1">微信</el-checkbox>
            <el-checkbox label="2">支付宝</el-checkbox>
            <el-checkbox label="3">银联</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="活动渠道：" prop="enterpriseId">
          <el-radio-group v-model="form.enterpriseId" disabled>
            <el-radio v-for="item in firmList" :key="item.id" :label="item.id">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库存显示：" prop="showStock"> <el-switch v-model="form.showStock" active-value="SHOW_STOCK"
            inactive-value="NO_SHOW_STOCK"> </el-switch> {{ form.showStock === 'SHOW_STOCK' ? '显示' : '隐藏' }}
        </el-form-item>
        <el-form-item label="进度条显示：" prop="showProgress"> <el-switch v-model="form.showProgress" active-value="IS_SHOW"
            inactive-value="NOT_SHOW"> </el-switch> {{ form.showProgress === 'IS_SHOW' ? '显示' : '隐藏' }} </el-form-item>
        <FormTitle value="秒杀商品设置："></FormTitle>
        <el-form-item label="选择商品：" prop="productDTOList">
          <el-button type="text" @click="addGoods" :disabled="isEdit">+ 添加秒杀商品</el-button>
          <el-button type="text" @click="resetGoods" :disabled="isEdit">全部清空</el-button>
          <el-table border :data="form.productDTOList" :span-method="objectSpanMethod" ref="table"
            v-if="form.productDTOList && form.productDTOList.length > 0">
            <Empty slot="empty" />
            <el-table-column align="center" label="商品图片" width="150px" prop="productImagePc">
              <template slot-scope="scope">
                <UploadFileUrl :fileList.sync="scope.row.productImagePc" hiddenUpload listType="picture-card" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="100px" prop="productName"></el-table-column>
            <el-table-column align="center" label="商品规格" width="100px" prop="specsName"></el-table-column>
            <el-table-column align="center" label="价格" width="100px" prop="servicePrice"></el-table-column>
            <el-table-column align="center" label="秒杀价格" width="180px">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.flashPrice" :min="isZeroBuy(form.activityType) ? 0 : 0.01"
                  :max="scope.row.basePrice" :active-change="false" :precision="2" controls-position="right" clearable
                  size="small" :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="已购买/总库存">
              <template slot-scope="scope">
                <span>{{ scope.row.initStock - scope.row.flashStock || 0 }}</span> /
                <el-input-number v-model="scope.row.flashStock" :min="fromWhere == 'view' ? -Infinity : 1"
                  :max="99999999999" :step="1" controls-position="right" clearable size="small" :step-strictly="true"
                  :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="排序" width="160px" prop="sort">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.sort"
                  :min="0"></el-input-number></template>
            </el-table-column>
            <el-table-column align="center" width="480px" label="独立活动时间" prop="independentTime">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.independentTime" type="datetimerange" align="right" size="small"
                  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 360px" :disabled="isEdit"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="deleteGoods('single', scope.$index, scope.row)" :disabled="isEdit || isCombinationProduct(scope.row.isCombinationProduct)">移除</el-button> -->
                <el-button type="text" @click="modifyInventory(scope.row)"
                  v-if="fromWhere === 'view' && form.activityStatus === 'PROCESSING'" v-show="hasAuthority('E2_14')"> 修改库存
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteGoods('item', scope.$index, scope.row)"
                  :disabled="isEdit">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button type="primary" :loading="submitting" @click="handleSubmit" v-show="hasAuthority('E2_13')"> 保存
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <AddGoodsDialog :addGoodsDialog.sync="addGoodsDialog" @selectProduct="selectProduct" :tableData="form.productDTOList">
    </AddGoodsDialog>
    <ModifyInventoryDialog :modifyInventoryDialog.sync="modifyInventoryDialog" :rowData="modifyInventoryForm"
      @refresh="getActivity"></ModifyInventoryDialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import AddGoodsDialog from './components/addGoodsDialog';
import ModifyInventoryDialog from './components/modifyInventoryDialog';
import { getFirm } from '@/api/newApi/common.js';
import { activityEditApi, activityGetDetailApi, activitySaveApi, activityGetCopyDetailApi } from '@/api/newApi/extension/activity.js';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    AddGoodsDialog,
    ModifyInventoryDialog,
    UploadFileUrl,
  },
  data() {
    return {
      form: {
        activityLabel: '',
        activityName: '',
        activityRule: '',
        activityType: null,
        buyLimit: undefined,
        forPurchasing: 1,
        destockingMethod: null,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        orderCancelTime: 30,
        // groupFlag: false,
        showStock: 'NO_SHOW_STOCK',
        showProgress: 'NOT_SHOW', // 是否显示进度条
        activityTime: [],
        supportPayType: [],
        productDTOList: [],
        totalBuyLimit: '',
      },
      activityType: [
        {
          value: 'WEBSITE_SECOND_KILL',
          label: '官网限时秒杀',
        },
        {
          value: 'ZERO_BUY',
          label: '零元购',
        },
        {
          value: 'LOW_PRICE_SPIKE',
          label: '爆款低价秒杀区',
        },
        {
          value: 'LIMIT_TIME_DISCOUNT',
          label: '限时折扣商品区',
        },
        {
          value: 'COMPLIANCE_SECOND_KILL',
          label: '合规秒杀区',
        },
        {
          value: 'NEW_USER',
          label: '新人专享',
        },
      ],
      selectList: [],
      firmList: [],
      tableData: [],
      formRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        activityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        forPurchasing: [{ required: true, message: '请选择是否限购', trigger: 'change' }],
        buyLimit: [{ required: true, message: '请输入限购数量', trigger: 'blur' }],
        orderCancelTime: [{ required: true, message: '请选择活动结束时间', trigger: 'blur' }],
        destockingMethod: [{ required: true, message: '请选择库存方式', trigger: 'change' }],
        enterpriseId: [{ required: true, message: '请选择支付渠道', trigger: 'change' }],
        groupFlag: [{ required: true, message: '请选择是否未组合商品', trigger: 'change' }],
        productDTOList: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        supportPayType: [{ required: true, message: '请选择支付类型', trigger: 'change' }],
      },
      submitting: false,
      setSecondKillDialog: false,
      addGoodsDialog: false,
      fromWhere: this.$route.query.key,
      rowData: this.$route.params.rowData,
      marketingActivityId: this.$route.query.marketingActivityId || '',
      modifyInventoryDialog: false,
      modifyInventoryForm: {},
      checkedActivities: false,
    };
  },
  created() {
    this.getfirmList();
  },
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
    if (this.form.enterpriseId == 30) {
      this.activityType = [
        {
          value: 'WEBSITE_SECOND_KILL',
          label: '官网秒杀',
        },
        {
          value: 'ZERO_BUY',
          label: '零元购',
        },
        {
          value: 'LOW_PRICE_SPIKE',
          label: '爆款低价秒杀区',
        },
        {
          value: 'LIMIT_TIME_DISCOUNT',
          label: '限时折扣',
        },
        {
          value: 'LIMIT_TIME_SECOND',
          label: '限时秒杀',
        },
        {
          value: 'NEW_USER',
          label: '新人专享',
        },
      ];
    }
  },
  computed: {
    isEdit() {
      return this.$route.query.key == 'view';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 开启限购
          if (this.form.forPurchasing == 2 && this.checkedActivities) {
            if (this.form.totalBuyLimit && this.form.totalBuyLimit < this.form.buyLimit) {
              this.$message.warning('每单限购数量不能超过活动总限购数量！');
              return;
            }
          }
          let priceFlag = false;
          let stockFlag = false;
          let zeroFlag = false;
          this.form.productDTOList.map((item, index, arr) => {
            // 非零元购商品不支持0元
            if (item.flashPrice == 0 && !this.isZeroBuy(this.form.activityType)) zeroFlag = true;
            // 判断秒杀价格是否填写
            let requiredItem = arr.find((a) => a.batchNo === item.batchNo);
            if (this.isRequired(item.isRequired)) {
              if (!requiredItem.flashPrice) {
                priceFlag = true;
              }
            } else if ((!item.flashPrice && !this.isZeroBuy(this.form.activityType)) || (!item.flashPrice && item.flashPrice != 0 && this.isZeroBuy(this.form.activityType))) {
              priceFlag = true;
            }
            // 判断库存数量是否填写
            if (this.isRequired(item.isRequired)) {
              if (!requiredItem.flashStock) {
                stockFlag = true;
              }
            } else if (!item.flashStock) {
              stockFlag = true;
            }
          });
          if (zeroFlag) return this.$message.warning('非秒杀商品秒杀价格不能为0！');
          if (priceFlag) return this.$message.warning('请完整输入每项的秒杀价格！');
          if (stockFlag) return this.$message.warning('请完整输入每项的秒杀库存！');
          if (this.form.productDTOList.filter((item) => item.index === 0).some((item) => !item.sort && item.sort !== 0)) {
            this.$message.warning('请输入秒杀排序！');
            return;
          }
          console.log(this.form.productDTOList, 7878)

          let { activityTime, activityStatus, totalBuyLimit, forPurchasing, supportPayType, marketingActivityId, ...form } = this.form;
          let data = {
            ...form,
            totalBuyLimit: totalBuyLimit == '' || totalBuyLimit == 0 || !totalBuyLimit ? -1 : totalBuyLimit,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
            buyLimit: this.form.forPurchasing == 2 ? this.form.buyLimit : -1,
            // supportPayType: this.form.supportPayType.join('|'),
            marketingActivityId: this.fromWhere === 'edit' ? marketingActivityId : '',
            productDTOList: this.getProductDTOList()
          };
          if (this.fromWhere == 'edit') {
            this.editActivity(data);
          } else {
            this.createActivity(data);
          }
        } else {
          return false;
        }
      });
    },

    //
    getProductDTOList() {
      let arry = [];
      this.form.productDTOList.forEach((item) => {
        let p = this.form.productDTOList.find((p) => p.id === item.id && p.index === 0);
        let groupFlag = this.isCombinationProduct(item.isCombinationProduct);
        let itemArry = {
          activityProductImgUrl: p.productImagePc,
          enterpriseId: item.enterpriseId,
          flashPrice: item.flashPrice,
          flashStock: this.isRequired(item.isRequired) ? p.flashStock : item.flashStock,
          marketingActivityId: item.marketingActivityId || '',
          productFinishTime: p.independentTime ? p.independentTime[1] : '',
          productInfoId: item.id,
          productName: item.productName,
          productSpecsId: item.productSpecsId || '',
          productStartTime: p.independentTime ? p.independentTime[0] : '',
          servicePrice: item.servicePrice,
          sort: p.sort,
          specsName: !groupFlag ? item.specsName : '',
          isRequired: !groupFlag ? item.isRequired : 'IS_REQUIRED',
          groupFlag,
          batchNo: item.batchNo,
          marketingActivitiesProductId: item.marketingActivitiesProductId || '',
        };
        if (item.joinSkuIds) {
          let basic = item.joinSkuIds.substr(1);
          basic = basic.substr(0, basic.length - 1);
          let joinSkuIdsArry = {
            activityProductImgUrl: p.productImagePc,
            enterpriseId: item.enterpriseId,
            flashPrice: item.flashPrice,
            flashStock: this.isRequired(item.isRequired) ? p.flashStock : item.flashStock,
            marketingActivityId: item.marketingActivityId || '',
            productFinishTime: p.independentTime ? p.independentTime[1] : '',
            productInfoId: item.id,
            productName: item.productName,
            productSpecsId: item.isCombinationProduct == 'IS_COMBINATION_PRODUCT' ? 0 : basic,
            productStartTime: p.independentTime ? p.independentTime[0] : '',
            servicePrice: 0,
            sort: p.sort,
            specsName: !groupFlag ? item.specsName : '',
            isRequired: !groupFlag ? item.isRequired : 'IS_REQUIRED',
            groupFlag,
            batchNo: -1,
            marketingActivitiesProductId: item.marketingActivitiesProductId || '',
          }
          arry.push.apply(arry, [itemArry, joinSkuIdsArry]);
        } else {
          arry.push.apply(arry, [itemArry]);
        }
      });
      return arry;
    },

    // 获取一个活动
    async getActivity() {
      let res = '';
      if (this.fromWhere === 'copy') {
        res = await activityGetCopyDetailApi({
          id: this.marketingActivityId,
          enterpriseId: Number(localStorage.getItem('enterpriseId')),
        });
      } else {
        res = await activityGetDetailApi({
          id: this.marketingActivityId,
          enterpriseId: Number(localStorage.getItem('enterpriseId')),
        });
      }
      if (res.code == 0) {
        let { channelCode, platformCode, ...params } = res.data;
        this.form = params;
        this.$set(this.form, 'activityTime', [this.form.startTime, this.form.finishTime]);
        this.$set(this.form, 'forPurchasing', this.form.buyLimit == -1 ? 1 : 2);
        if (this.form.totalBuyLimit == -1) this.form.totalBuyLimit = '';
        // this.form.supportPayType = res.data.supportPayType.split('|');
        let batchNoMap = new Map();
        this.form.productDTOList.forEach((item) => {
          let batchNoNum = batchNoMap.get(item.batchNo) || 0;
          batchNoMap.set(item.batchNo, batchNoNum + 1);
        });
        let newData = JSON.parse(JSON.stringify(res.data.productDTOList));
        let arry = [];
        newData.forEach(item => {
          let specsList = res.data.productDTOList.filter((p) => p.productInfoId === item.productInfoId && p.batchNo > -1);
          let batchNoNum = batchNoMap.get(item.batchNo);
          if (item.batchNo > -1) {
            let json = {
              ...item,
              id: item.productInfoId,
              productImagePc: item.activityProductImgUrl,
              isCombinationProduct: item.groupFlag ? 'IS_COMBINATION_PRODUCT' : 'NOT_COMBINATION_PRODUCT',
              specsName: item.groupFlag ? '组合商品' : item.specsName,
              goodsRowspan: specsList.length,
              rowspan: batchNoNum,
              index: specsList.findIndex((p) => p.productSpecsId === item.productSpecsId),
              independentTime: [item.productStartTime, item.productFinishTime],
              isRequired: batchNoNum > 1 ? 'IS_REQUIRED' : 'NOT_REQUIRED',
            }
            let isJoinSkuIds = this.getIsJoinSkuIds(newData, item.productInfoId)
            if (isJoinSkuIds.length > 0) {
              json.joinSkuIds = isJoinSkuIds
            }
            arry.push(json)
          }
        })
        this.form.productDTOList = this.formatListData(arry);
      } else {
        this.$message.error(res.message);
      }
    },
    getIsJoinSkuIds(newData, productInfoId) {
      let JoinSkuIds = '';
      newData.forEach(item => {
        if (item.productInfoId == productInfoId && item.batchNo == -1) {
          JoinSkuIds = '[' + item.productSpecsId + ']';
        }
      })
      return JoinSkuIds
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      activityEditApi(data, this.marketingActivityId)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push({ path: '/extension/activityManagement/secondsKillActivity' });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 创建活动
    createActivity(data) {
      this.submitting = true;
      activitySaveApi(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({ path: '/extension/activityManagement/secondsKillActivity' });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 添加秒杀商品
    addGoods() {
      this.addGoodsDialog = true;
    },
    // 删除商品
    deleteGoods(key, index, row) {
      this.$confirm('确定删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (key === 'item') {
          this.form.productDTOList.splice(index, row.goodsRowspan || 1);
        } else if (key === 'single') {
          this.form.productDTOList.forEach((item) => {
            if (item.id === row.id) {
              item.goodsRowspan -= row.rowspan;
              if (item.index > row.index) {
                item.index -= row.rowspan;
              }
            }
          });
          this.form.productDTOList.splice(index, row.rowspan || 1);
        }
      });
    },
    /**清空商品数组 */
    resetGoods() {
      this.form.productDTOList = [];
      this.getfirmList();
    },
    // 修改库存
    modifyInventory(row) {
      this.modifyInventoryDialog = true;
      this.modifyInventoryForm = row;
    },
    // 更改采购方式
    changeForPurchasing(val) {
      if (this.form.forPurchasing == 1) {
        this.form.buyLimit = -1;
      } else {
        this.form.buyLimit = undefined;
      }
    },
    // 更改商品类别
    changeGroupFlag() {
      this.form.productDTOList = [];
    },
    // 获取企业列表
    getfirmList() {
      getFirm().then((res) => {
        if (res.code == 0) {
          this.firmList = res.data.reverse();
        }
      });
    },
    // 确认选择商品
    selectProduct(val) {
      // 合并选择的商品
      this.form.productDTOList = this.form.productDTOList.concat(this.formatListData(val));
      // 给商品添加批次号batchNo
      this.form.productDTOList.forEach((item, index, arr) => {
        if (this.isRequired(item.isRequired) && index !== 0 && this.isRequired(arr[index - 1].isRequired)) {
          item.batchNo = arr[index - 1].batchNo;
        } else {
          item.batchNo = index;
        }
      });
      this.addGoodsDialog = false;
    },
    formatListData(productList) {
      let list = [];
      productList.forEach((item, index) => {
        if (this.isCombinationProduct(item.isCombinationProduct)) {
          item.productSpecsDTOList = [
            {
              specsName: '组合商品',
              servicePrice: item.servicePrice,
            },
          ];
        } else if (item.productSpecsDTOList && !item.productSpecsDTOList.length) {
          item.productSpecsDTOList = [
            {
              specsName: item.productName,
              servicePrice: item.servicePrice,
            },
          ];
        }
        if (item.productSpecsDTOList) {
          let isRequiredList = item.productSpecsDTOList.filter((spec) => this.isRequired(spec.isRequired));
          let notRequiredList = item.productSpecsDTOList.filter((spec) => !this.isRequired(spec.isRequired));
          item.productSpecsDTOList = isRequiredList.concat(notRequiredList);

          item.productSpecsDTOList.forEach((spec, i) => {
            list.push({
              ...item,
              productSpecsId: spec.id,
              id: item.id,
              goodsRowspan: item.productSpecsDTOList.length,
              rowspan: this.isRequired(spec.isRequired) ? isRequiredList.length : 1,
              index: i,
              specsName: spec.specsName,
              servicePrice: spec.servicePrice,
              joinSkuIds: spec.joinSkuIds,
              isRequired: spec.isRequired,
            });
          });
        } else {
          list.push(item);
        }
      });
      return list;
    },
    objectSpanMethod({ row, column }) {
      let combineList = ['productImagePc', 'productName', 'sort', 'independentTime', 'operator'];
      let requiredCombineList = ['flashStock', 'singleOperator'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.goodsRowspan, 1];
        } else {
          return [0, 0];
        }
      } else if (this.isRequired(row.isRequired) && requiredCombineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    // 组合商品
    isCombinationProduct(value) {
      return value === 'IS_COMBINATION_PRODUCT';
    },
    // 必选规格
    isRequired(value) {
      return value === 'IS_REQUIRED';
    },
    // 零元购
    isZeroBuy(value) {
      return value === 'ZERO_BUY';
    },
    // 返回列表
    goBack() {
      this.$router.push({
        path: '/extension/activityManagement/secondsKillActivity',
        name: 'secondsKillActivity',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;

  .el-page-header {
    padding: 20px 0px 30px 0px;

    .el-page-header__left {
      display: flex;
      align-items: baseline;
    }
  }

  .form-container {
    background: #fff;
    border-radius: 4px;

    .titleStyle {
      margin-bottom: 20px;
    }
  }
}
</style>
