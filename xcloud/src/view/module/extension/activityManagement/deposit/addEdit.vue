<template>
  <div class="app-container">
    <BackHerader @back="goback" title="创建砍价活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础设置："></FormTitle>
        <el-form-item label="活动名称：" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" clearable style="width: 360px" :disabled="isEdit && status != 'PROCESSING'" maxlength="20" />
        </el-form-item>
        <el-form-item label="定金支付时间：" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            align="right"
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 360px"
            :disabled="isEdit && status != 'PROCESSING'"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="尾款支付时间：" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetimerange"
            align="right"
            size="small"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 360px"
            :disabled="isEdit && status != 'PROCESSING'"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动图片：" prop="backgroundImg">
          <UploadImage ref="uploadImageRef" :imageUrl="form.activityPictureUrl" :imgType="1" :on-success="(v) => (form.activityPictureUrl = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <el-button type="text" @click="resetBackgroundImg" :disabled="isEdit && status != 'PROCESSING'">恢复默认图</el-button>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <div v-html="form.activityRule" style="word-break: break-all" v-if="isEdit && status != 'PROCESSING'"></div>
          <Editor :value.sync="form.activityRule" style="width: 1000px" :disabled="isEdit && status != 'PROCESSING'" v-else></Editor>
        </el-form-item>
        <FormTitle value="活动商品："></FormTitle>
        <el-form-item label="定金膨胀：">
          <el-radio-group v-model="form.buyMethod" :disabled="isEdit">
            <el-radio label="1">开启</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="砍价商品：" prop="bargainActivityProductList">
          <el-button type="text" @click="addGoods" :disabled="isEdit">+ 添加砍价商品</el-button>
          <el-button type="text" @click="resetGoods" :disabled="isEdit">全部清空</el-button>
          <el-table border :data="form.bargainActivityProductList" v-if="form.bargainActivityProductList && form.bargainActivityProductList.length > 0">
            <Empty slot="empty" />
            <el-table-column align="center" label="商品图片" width="150px">
              <template slot-scope="scope">
                <el-image style="width: 48px; height: 33px" :src="getImgSrc(scope.row.pcProductImgUrl, scope.row.mobileProductImgUrl)" :preview-src-list="[getImgSrc(scope.row.pcProductImgUrl, scope.row.mobileProductImgUrl)]">
                  <div slot="error" class="image-slot">
                    <img src="@/assets/images/infoDetail/default.png" alt="" />
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称">
              <template slot-scope="scope">
                {{ scope.row.productName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="价格" width="100px" prop="supplierId">
              <template slot-scope="scope">{{ scope.row.basePrice }}</template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="首刀价格">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bargainFirstPrice" :min="0" :max="scope.row.basePrice" :active-change="false" :precision="2" controls-position="right" clearable size="small" :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="低价价格">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bargainLowestPrice" :min="0" :max="scope.row.bargainFirstPrice" :active-change="false" :precision="2" controls-position="right" clearable size="small" :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="总库存" v-if="this.status != 'PROCESSING'">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bargainStock" :min="1" :max="99999999999" :step="1" controls-position="right" clearable size="small" :step-strictly="true" :disabled="isEdit && status != 'PROCESSING'"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" label="已砍库存/总库存" v-if="this.status == 'PROCESSING'">
              <template slot-scope="scope"
                >{{ scope.row.initStock - scope.row.bargainStock }}/ {{ scope.row.initStock }}
                <el-tooltip content="修改库存" class="icon" placement="top">
                  <el-link type="primary" :underline="false" @click="editStock(scope.row)">
                    <i class="icon icon-edit"></i>
                  </el-link>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="帮砍人数" width="160px">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.bargainHelpPersonNum" :min="0" :disabled="isEdit"></el-input-number></template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="排序" width="160px">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.sort" :min="0" :disabled="isEdit"></el-input-number></template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteGoods('table', scope.$index)" :disabled="isEdit">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
    <AddGoodsDialog :addGoodsDialog.sync="addGoodsDialog" @selectProduct="selectProduct" :tableData="form.bargainActivityProductList"></AddGoodsDialog>
    <el-dialog title="编辑库存" :visible.sync="dialogVisible" width="400px" center destroy-on-close>
      <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRulesEdit" :model="editForm">
        <el-form-item label="修改库存" prop="initStock">
          <el-input-number v-model="editForm.initStock" controls-position="right" placeholder="" style="width: 200px" clearable :min="1" :max="999" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import AddGoodsDialog from '../components/addGoodsDialog';
import UploadImage from '@/components/UploadImage/index.vue';
import { presseDetails, presseAdd, presseEdit, addStock } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    AddGoodsDialog,
    UploadImage,
  },
  data() {
    return {
      form: {
        activityName: '',
        activityTime: [],
        activityPictureUrl: 'https://file.itaxs.com/dev/20221215/f9896b703d0c4adaad4f65c97f30b4e3.png',
        activityRule: '',
        buyMethod: 'LOWEST_PRICE',
        bargainAmountType: 'RANDOM',
        bargainEffectiveHour: '',
        timeLimit: '',
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        bargainActivityProductList: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      tableData: [],
      formRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        bargainEffectiveHour: [{ required: true, message: '请输入砍价有效期', trigger: 'blur' }],
        timeLimit: [{ required: true, message: '请输入每人发起次数', trigger: 'blur' }],
        bargainActivityProductList: [{ required: true, message: '请选择商品', trigger: 'blur' }],
      },
      submitting: false,
      setSecondKillDialog: false,
      addGoodsDialog: false,
      fromWhere: this.$route.query.key,
      rowData: this.$route.params.rowData,
      modifyInventoryForm: {},
      modifyInventoryDialog: false,
      checkedActivities: false,
      status: this.$route.query.status,
      dialogVisible: false,
      editForm: {},
      formRulesEdit: {
        initStock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
  },
  computed: {
    isEdit() {
      return this.$route.query.key == 'view' || this.status == 'PROCESSING';
    },
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let priceFlag = false;
          let stockFlag = false;
          let headPriceFlag = false;
          let headStockFlag = false;
          if (this.form.bargainActivityProductList.length == 0) {
            this.$message.warning('请选择商品！');
            return false;
          }
          this.form.bargainActivityProductList.map((item) => {
            // 非零元购商品不支持0元
            // if (item.groupPrice == 0) zeroFlag = true;
            // 判断秒杀价格是否填写
            if (item.bargainFirstPrice === '') priceFlag = true;
            // 判断库存数量是否填写
            if (this.status != 'PROCESSING') {
              if (!item.bargainStock) stockFlag = true;
            }
            if (item.bargainLowestPrice === '') headPriceFlag = true;
            if (item.bargainHelpPersonNum === '') headStockFlag = true;
          });
          // if (zeroFlag) return this.$message.warning('非秒杀商品秒杀价格不能为0！');
          if (priceFlag) return this.$message.warning('请完整输入每项的首刀价格！');
          if (stockFlag) return this.$message.warning('请完整输入每项的已砍库存！');
          if (headPriceFlag) return this.$message.warning('请完整输入每项的低价价格！');
          if (headStockFlag) return this.$message.warning('请完整输入每项的帮砍人数！');
          let data = {
            ...this.form,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
            bargainActivityProductList: this.form.bargainActivityProductList.map((item) => {
              return {
                activityProductImgUrl: item.pcProductImgUrl,
                productInfoId: item.productId || item.productInfoId,
                productInfoSkuId: (item.productSkuVOList && item.productSkuVOList[0] && item.productSkuVOList[0].skuId) || item.productInfoSkuId,
                productName: item.productName,
                bargainFirstPrice: item.bargainFirstPrice,
                bargainLowestPrice: item.bargainLowestPrice,
                standardPrice: item.basePrice,
                bargainStock: item.bargainStock,
                bargainHelpPersonNum: item.bargainHelpPersonNum,
                initStock: item.bargainStock,
                sort: item.sort,
              };
            }),
          };
          delete data.activityTime;
          if (this.fromWhere == 'edit') {
            this.editActivity(data);
          } else {
            delete data.bargainActivityId;
            this.createActivity(data);
          }
        } else {
          return false;
        }
      });
    },
    // 获取一个活动
    getActivity() {
      presseDetails({ bargainActivityId: this.$route.query.id }).then((res) => {
        if (res.code == 0) {
          this.form = res.data;
          this.$set(this.form, 'activityTime', [this.form.startTime, this.form.finishTime]);
          this.form.bargainActivityProductList = res.data.bargainActivityProductList.map((item) => ({
            ...item,
            pcProductImgUrl: item.activityProductImgUrl,
            basePrice: item.standardPrice,
          }));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      data.bargainActivityId = this.$route.query.id;
      presseEdit(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push({ path: '/extension/activityManagement/presse/index' });
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
      presseAdd(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({ path: '/extension/activityManagement/presse/index' });
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
            this.form.bargainActivityProductList = [];
          } else {
            this.form.bargainActivityProductList.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    /**清空商品数组 */
    resetGoods() {
      this.form.bargainActivityProductList = [];
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
      this.form.bargainActivityProductList = [];
    },
    // 确认选择商品
    selectProduct(val) {
      // 合并选择的商品
      this.form.bargainActivityProductList.push(...val);
      // 给商品添加批次号batchNo
      this.form.bargainActivityProductList.map((item, index) => {
        item.batchNo = index;
        if (typeof item.bargainLowestPrice == 'object') {
          item.bargainLowestPrice = 0;
        }
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
    resetBackgroundImg() {
      this.form.activityPictureUrl = 'https://file.itaxs.com/dev/20221215/f9896b703d0c4adaad4f65c97f30b4e3.png';
    },
    // 返回列表
    goback() {
      this.$router.push({ path: '/extension/activityManagement/presse/index' });
    },
    editStock(row) {
      this.dialogVisible = true;
      this.editForm.id = this.$route.query.id;
      this.editForm.productId = row.productInfoId;
      this.editForm.productInfoSkuId = row.productInfoSkuId;
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          let data = this.editForm;
          addStock(data).then((res) => {
            if (res.code == 0) {
              this.dialogVisible = false;
              this.getActivity();
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });
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
