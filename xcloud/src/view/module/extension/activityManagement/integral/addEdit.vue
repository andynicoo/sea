<template>
  <div class="app-container">
    <BackHerader @back="goback" :title="urlQuery.type === '0' ? '添加产品' : '编辑产品'"></BackHerader>
    <!-- 表单 -->
    <!-- {{ form }}
    <br />
    {{ couponSelection }} -->
    <div class="form-container" v-loading="pageLoading">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <el-form-item label="选择商品：" prop="goodsType">
          <el-radio-group v-model="form.goodsType" :disabled="urlQuery.type === '1'" @change="changeGoodsType">
            <el-radio :label="1">实物商品</el-radio>
            <el-radio :label="2">优惠券</el-radio>
            <el-radio :label="3">会员卡</el-radio>
            <el-radio :label="4">虚拟商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品分类：" prop="integralProductCategoryId">
          <el-select placeholder="请选择" v-model="form.integralProductCategoryId">
            <el-option :label="item.categoryName" :value="item.integralProductCategoryId" v-for="item in classifyList" :key="item.integralProductCategoryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" clearable class="inputwidth" />
        </el-form-item>
        <el-form-item label="商品封面：" prop="goodsImg">
          <UploadImage ref="uploadImageRef" :imageUrl="form.goodsImg" :imgType="1" :on-success="(v) => (form.goodsImg = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <!-- 新增产品， 选择商品，勾选优惠券的时候，才能添加优惠券 -->
        <el-form-item label="优惠券：" prop="businessId" v-if="(urlQuery.type === '0' && form.goodsType === 2) || (urlQuery.type === '1' && form.goodsType === 2)">
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
        <el-form-item label="会员卡：" prop="businessId" v-if="form.goodsType == 3">
          <el-select placeholder="请选择" v-model="form.businessId">
            <el-option :label="item.membershipCardName" :value="item.membershipCardId" v-for="item in cardList" :key="item.membershipCardId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场价：" prop="marketPrice"> <el-input-number v-model="form.marketPrice" :min="0" :max="999999" label="请输入市场价"></el-input-number>元 </el-form-item>
        <el-form-item label="发放库存：" prop="goodsStock">
          <el-input-number v-model="form.goodsStock" :min="1" :max="form.goodsType === 2 && couponSelection.length && couponSelection[0].surplusNum > 0 ? couponSelection[0].surplusNum : 999999" label="请输入库存" :disabled="isStock"></el-input-number>
          <span v-if="form.goodsType === 2 && couponSelection.length"
            >剩余券数:
            <span v-if="couponSelection[0].surplusNum > 0">{{ couponSelection[0].surplusNum }}</span>
            <span v-else>无限制</span>
          </span>
        </el-form-item>
        <!-- {{ couponSelection }} -->
        <el-form-item label="兑换积分：" prop="integralPrice"> <el-input-number v-model="form.integralPrice" :min="1" :max="999999" label="请输入库存"></el-input-number>积分 </el-form-item>
        <el-form-item label="物流配送" prop="logisticsFlag" v-if="form.goodsType === 1">
          <el-radio-group v-model="form.logisticsFlag">
            <el-radio :label="1">快递(包邮)</el-radio>
            <el-radio :label="2">无需快递</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="兑换次数限制：">
          <el-radio-group v-model="maximumExchangeType" @change="exchange">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1"
              >限制
              <el-input-number v-model="form.maximumExchange" controls-position="right" placeholder="" style="width: 120px; margin: 0 10px" clearable :min="1" :max="999999" v-if="maximumExchangeType == 1" />
              <span v-if="maximumExchangeType == 1">次</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户限制：">
          <el-radio-group v-model="form.userLimit">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="1">会员限制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容详情：" prop="content">
          <Editor :value.sync="form.contentHtml" style="width: 1000px"></Editor>
          <!-- <div v-html="form.content" style="word-break: break-all" v-else></div> -->
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="999999" label="请输入排序"></el-input-number>
        </el-form-item>
        <el-form-item label="商品状态：" prop="status"> <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch> </el-form-item>

        <el-form-item>
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
import Editor from '@/components/quillEditor/index';
import { updateIntegralGoods, addIntegralProduct, getIntegralGoodsDetail, integralClassifyList } from '@/api/newApi/extension/coupon.js';
import { cardListPage } from '@/api/newApi/extension/activity.js';
import UploadImage from '@/components/UploadImage/index.vue';
import Coupon from './couponPage/index.vue';
export default {
  components: {
    BackHerader,
    Editor,
    UploadImage,
    Coupon,
  },
  data() {
    return {
      form: {
        goodsName: '',
        goodsType: 1,
        marketPrice: 1,
        goodsStock: 1,
        integralPrice: 1,
        logisticsFlag: 1,
        content: '',
        contentHtml: '',
        sort: 1,
        status: 1,
        goodsImg: '',
        maximumExchange: 0,
        userLimit: 0,
        businessId: '', // 优惠券id
      },
      classifyList: [],
      maximumExchangeType: 0,
      formRules: {
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goodsImg: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
        businessId: [{ required: true, message: '请选择优惠券', trigger: 'change' }],
        integralProductCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        card: [{ required: true, message: '请选会员卡', trigger: 'change' }],
      },
      submitting: false,
      urlQuery: {},
      pageLoading: false,
      dialogVisible: false,
      couponSelection: [], // 弹窗选择的优惠券
      couponSelectionTemp: [], // 弹窗选择的优惠券临时
      isStock: false,
      cardList: [],
    };
  },
  watch: {
    couponSelection: {
      handler(newVal, oldVal) {
        if (newVal.length && newVal[0].marketingCouponActivityId) {
          this.form.businessId = newVal[0].marketingCouponActivityId;
        }
      },
    },
  },
  created() {
    this.urlQuery = this.$route.query;
    if (this.urlQuery.goodsId) {
      this.isStock = true;
    }
    console.log(this.$Base64.decode('PHA+6Zi/5Y+R55qE5Y+R55qEPC9wPjxwPjEyMzwvcD4='));
  },
  mounted() {
    let { goodsId } = this.urlQuery;
    if (goodsId) {
      this.getIntegralGoodsDetail(goodsId);
    }
    this.getClassifyList();
    this.getCardListPage();
  },
  computed: {},
  methods: {
    deleteCouponSelection() {
      this.couponSelection = [];
    },
    async getIntegralGoodsDetail(id) {
      this.pageLoading = true;
      await getIntegralGoodsDetail({ goodsId: id })
        .then((res) => {
          if (res.code == 0) {
            this.form = res.data.omsIntegralGoods;
            this.form.contentHtml = this.$Base64.decode(this.form.content);
            this.maximumExchangeType = Number(this.form.maximumExchange) > 0 ? 1 : 0;
            this.couponSelection = [];
            this.couponSelection[0] = res.data.marketingCouponActivity;
            this.couponSelection[0].couponContent = res.data.couponContent;
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
          this.pageLoading = false;
        });
    },
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let { type } = this.urlQuery;
          if (type === '0') {
            this.createProduct();
          } else {
            this.editProduct();
          }
        } else {
          return false;
        }
      });
    },
    // 活动编辑
    editProduct() {
      this.submitting = true;
      const enterpriseId = localStorage.getItem('enterpriseId');
      this.form.content = this.form.contentHtml;

      let data = {
        enterpriseId: enterpriseId,
        ...this.form,
      };
      updateIntegralGoods(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.goback();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 创建活动
    createProduct() {
      this.submitting = true;
      const enterpriseId = localStorage.getItem('enterpriseId');
      this.form.content = this.form.contentHtml;
      let data = {
        enterpriseId: enterpriseId,
        ...this.form,
      };
      addIntegralProduct(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.goback();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/integral/index',
        name: 'integral',
      });
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
    getClassifyList() {
      integralClassifyList({ status: 1 })
        .then((res) => {
          if (res.code == 0) {
            // 设置列表和总条数
            this.classifyList = res.data;
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    getCardListPage() {
      cardListPage({
        current: 1,
        size: 100,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        membershipCard: {
          status: 1,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.cardList = res.data.records;
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    exchange(val) {
      if (val == 0) {
        this.form.maximumExchange = 0;
      }
    },
    changeGoodsType() {
      this.form.businessId = '';
      this.couponSelection = [];
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
  .inputwidth {
    width: 360px;
  }
}
</style>
