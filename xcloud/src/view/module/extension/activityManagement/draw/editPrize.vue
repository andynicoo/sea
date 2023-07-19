<template>
  <div class="app-container">
    <BackHerader @back="goback" title="奖品编辑"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <el-form-item label="奖品名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入奖品名称" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.describe" placeholder="请输入描述" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="奖品图片：" prop="url">
          <UploadImage ref="uploadImageRef" :imageUrl="form.url" :imgType="1" :on-success="(v) => (form.url = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <el-form-item label="奖品类型：">
          <el-radio-group v-model="form.goodsType">
            <el-radio :label="1">未中奖</el-radio>
            <el-radio :label="2">优惠券</el-radio>
            <el-radio :label="3">实物商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券：" prop="businessId" v-if="form.goodsType === 2">
          <div class="subTips">活动期间若剩余券数为0，则不赠送</div>
          <div v-if="couponSelection.length">
            <el-table :data="couponSelection" stripe style="width: 480px">
              <el-table-column prop="couponName" label="优惠券名称" width="180"> </el-table-column>
              <el-table-column prop="couponContent" label="优惠内容" width="180"> </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="dialogVisible = true"> 修改 </el-button>
                  <el-button type="text" size="small" @click="deleteCouponSelection"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button @click="dialogVisible = true" v-else>选择优惠券</el-button>
        </el-form-item>
        <el-form-item label="奖品数量：" prop="num">
          <el-input v-model="form.num" placeholder="请输入奖品数量" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="抽中概率：" prop="probability">
          <el-input v-model="form.probability" placeholder="请输入抽中概率" clearable style="width: 360px" :disabled="isEdit" />
          <div>概率不能超过100%，可保留两位小数</div>
        </el-form-item>
        <el-form-item label="中奖规则：">
          <el-select v-model="form.activityType" placeholder="请选择活动类型" clearable style="width: 360px" disabled>
            <el-option v-for="item in activityType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抽中提示语：" prop="clew">
          <el-input v-model="form.clew" placeholder="请输入抽中提示语" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button type="primary" :loading="submitting" @click="handleSubmit"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="900" center destroy-on-close>
      <Coupon ref="coupon" @getCouponSelection="getCouponSelection" :couponSelectionProp="couponSelection" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="couponSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import UploadImage from '@/components/UploadImage/index.vue';
import Coupon from '../integral/couponPage/index.vue';
import { getFirm } from '@/api/newApi/common.js';
import { activityEditApi, activityGetDetailApi, activitySaveApi } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    UploadImage,
    Coupon,
  },
  data() {
    return {
      form: {
        name: '',
        describe: '',
        goodsType: 1,
        num: 1,
        probability: 0,
        activityType: '1',
        url: '',
        clew: '',
      },
      activityType: [
        {
          value: '1',
          label: '按中奖概率开出',
        },
      ],
      selectList: [],
      firmList: [],
      tableData: [],
      formRules: {
        name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入奖品数量', trigger: 'blur' }],
        probability: [{ required: true, message: '请输入抽中概率', trigger: 'blur' }],
        clew: [{ required: true, message: '请输入抽中提示语', trigger: 'blur' }],
        url: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
      },
      submitting: false,
      setSecondKillDialog: false,
      addGoodsDialog: false,
      fromWhere: this.$route.query.key,
      rowData: this.$route.params.rowData,
      modifyInventoryDialog: false,
      modifyInventoryForm: {},
      checkedActivities: false,
      prizeData: [
        {
          name: '笔记本',
          type: '电器',
          num: '2',
          pcProductImgUrl: '',
          mobileProductImgUrl: '',
          probability: '0.22',
          rule: 'fdsfsfs',
        },
      ],
      dialogVisible: false,
      couponSelection: [], // 弹窗选择的优惠券
      couponSelectionTemp: [], // 弹窗选择的优惠券临时
    };
  },
  created() {
    this.getfirmList();
  },
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
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
          let priceFlag = false;
          let stockFlag = false;
          let zeroFlag = false;
          this.form.marketingActivitiesProductDTOS.map((item) => {
            // 非零元购商品不支持0元
            if (item.flashPrice == 0 && this.form.activityType != 1) zeroFlag = true;
            // 判断秒杀价格是否填写
            if ((!item.flashPrice && this.form.activityType != 1) || (!item.flashPrice && item.flashPrice != 0 && this.form.activityType == 1)) priceFlag = true;
            // 判断库存数量是否填写
            if (!item.flashStock) stockFlag = true;
          });
          if (zeroFlag) return this.$message.warning('非秒杀商品秒杀价格不能为0！');
          if (priceFlag) return this.$message.warning('请完整输入每项的秒杀价格！');
          if (stockFlag) return this.$message.warning('请完整输入每项的秒杀库存！');
          let { activityTime, marketingActivitiesProductVOS, totalBuyLimit, showStock, showProgress, ...form } = this.form;
          let data = {
            ...form,
            showStock: showStock ? 1 : 0,
            showProgress: showProgress ? 'IS_SHOW' : 'NOT_SHOW',
            totalBuyLimit: totalBuyLimit == '' || totalBuyLimit == 0 || !totalBuyLimit ? -1 : totalBuyLimit,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
            buyLimit: this.form.forPurchasing == 2 ? this.form.buyLimit : -1,
            supportPayType: this.form.supportPayType.join('|'),
            marketingActivitiesProductDTOS: this.form.marketingActivitiesProductDTOS.map((item) => {
              return {
                enterpriseId: item.enterpriseId,
                pcProductImgUrl: item.pcProductImgUrl,
                productInfoId: item.productId || item.productInfoId,
                productName: item.productName,
                standardPrice: item.basePrice || item.standardPrice,
                flashPrice: item.flashPrice,
                flashStock: item.flashStock,
                batchNo: item.batchNo,
                productStartTime: item.independentTime ? item.independentTime[0] : '',
                productFinishTime: item.independentTime ? item.independentTime[1] : '',
                sort: item.sort,
                productInfoSkuId: (item.productSkuVOList && item.productSkuVOList[0] && item.productSkuVOList[0].skuId) || item.productInfoSkuId,
                marketingActivitiesProductId: item.marketingActivitiesProductId || '',
                marketingActivityId: item.marketingActivityId || '',
              };
            }),
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
    // 获取一个活动
    getActivity() {
      activityGetDetailApi({ id: this.rowData.marketingActivityId }).then((res) => {
        if (res.code == 0) {
          this.form = res.data;
          this.$set(this.form, 'activityTime', [this.form.startTime, this.form.finishTime]);
          this.$set(this.form, 'forPurchasing', this.form.buyLimit == -1 ? 1 : 2);
          if (this.form.totalBuyLimit == -1) this.form.totalBuyLimit = '';
          this.form.supportPayType = res.data.supportPayType.split('|');
          this.form.showStock = res.data.showStock == 1 ? true : false;
          this.form.showProgress = res.data.showProgress == 'IS_SHOW' ? true : false;
          this.form.marketingActivitiesProductDTOS = res.data.marketingActivitiesProductVOS.map((item) => ({
            ...item,
            independentTime: [item.productStartTime, item.productFinishTime],
          }));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      activityEditApi(data, this.rowData.marketingActivityId)
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
    deleteGoods(key, index) {
      this.$confirm('确定删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (key === 'form') {
            this.form.marketingActivitiesProductDTOS = [];
          } else {
            this.form.marketingActivitiesProductDTOS.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    /**清空商品数组 */
    resetGoods() {
      this.form.marketingActivitiesProductDTOS = [];
      // this.$set(this.form, 'marketingActivitiesProductDTOS', []);
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
      this.form.marketingActivitiesProductDTOS = [];
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
      this.form.marketingActivitiesProductDTOS.push(...val);
      // 给商品添加批次号batchNo
      this.form.marketingActivitiesProductDTOS.map((item, index) => {
        item.batchNo = index;
      });
      this.addGoodsDialog = false;
    },
    // 获取默认图片 优先pc端
    getImgSrc(pcImg, mobileImg) {
      if (pcImg) {
        return JSON.parse(pcImg)[0].imgUrl;
      } else if (mobileImg) {
        return JSON.parse(mobileImg)[0].imgUrl;
      }
    },
    // 返回列表
    goback() {
      this.$router.back();
    },
    getCouponSelection(data) {
      console.log(data);
      this.couponSelectionTemp = data;
    },
    couponSure() {
      this.$refs.coupon.getCouponSelection();
      let couponLength = this.couponSelectionTemp.length;
      if (couponLength && couponLength > 1) {
        this.$message({
          type: 'error',
          message: '只能选择一个优惠券',
        });
      }
      if (!couponLength || couponLength === 1) {
        this.couponSelection = this.couponSelectionTemp;
        this.dialogVisible = false;
      }
    },
    deleteCouponSelection() {
      this.couponSelection = [];
    },
  },
};
</script>
<style lang="less" scoped>
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
  .setting {
    color: #cccccc;
    font-size: 12px;
    line-height: 20px;
    padding-left: 22px;
  }
}
.tooltip-box {
  width: 150px;
  .grid-content {
    height: 50px;
    background: #cccccc;
    text-align: center;
    line-height: 48px;
    margin: 2px;
  }
  .tooltip-text {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
