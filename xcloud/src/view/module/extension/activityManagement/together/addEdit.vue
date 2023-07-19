<template>
  <div class="app-container">
    <BackHerader @back="goback" title="创建拼团活动"></BackHerader>
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <FormTitle value="基础设置："></FormTitle>
        <el-form-item label="活动名称：" prop="activityName">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" clearable style="width: 360px"
            :disabled="isEdit && form.activityStatus != 'PROCESSING'" maxLength="20" />
        </el-form-item>
        <el-form-item label="活动时间：" prop="activityTime">
          <el-date-picker v-model="form.activityTime" type="datetimerange" align="right" size="small" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 360px"
            :disabled="isEdit && form.activityStatus != 'PROCESSING'" :picker-options="pickerOptions"></el-date-picker>
          <div>拼团活动开始和结束时间，可以手动提前结束活动</div>
        </el-form-item>
        <el-form-item label="活动栏目：" prop="actionBucket">
          <el-select placeholder="请选择" style="width: 360px" v-model="form.actionBucket" disabled>
            <el-option label="小程序拼团" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成团有效期：" prop="spellGroupEffectiveTime">
          <el-input-number v-model="form.spellGroupEffectiveTime" controls-position="right" placeholder="请输入"
            style="width: 130px; margin-right: 10px" clearable :min="1" :max="999" :disabled="isEdit" />
          <span>小时</span>
          <div>开团后的成团有效期，超出时间还未成团则拼团失败</div>
        </el-form-item>
        <el-form-item label="成团人数：" prop="spellGroupPersonNum">
          <el-input-number v-model="form.spellGroupPersonNum" controls-position="right" placeholder="请输入"
            style="width: 130px; margin-right: 10px" clearable :min="2" :max="999" :disabled="isEdit" />
          <span>人</span>
          <div>设置商品拼团人数，最少2人成团，最多100人，取整数</div>
        </el-form-item>
        <el-form-item label="购买限制：">
          <el-radio-group v-model="totalBuyLimitType" :disabled="isEdit">
            <el-radio :label="1">不限制</el-radio>
            <el-radio :label="2">限制</el-radio>
          </el-radio-group>
          <div v-if="totalBuyLimitType == 2">
            <div style="margin-top: 10px">
              <span>活动总限购</span>
              <el-input-number v-model="form.totalBuyLimit" controls-position="right" placeholder="请输入"
                style="width: 100px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit" />
              <span>件/人</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动渠道：" prop="activityChannel">
          <el-checkbox v-model="checkAllChannel" @change="handleCheckAllChangeChannel" :disabled="isEdit">全选</el-checkbox>
          <el-checkbox-group v-model="form.activityChannel" @change="handleCheckedCitiesChangeChannel">
            <el-checkbox v-for="(item, index) in applyChannel" :label="item.label" :key="index" :disabled="isEdit">{{
              item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <Editor :value.sync="form.activityRule" style="width: 1000px" :disabled="isEdit" v-if="!isEdit"></Editor>
          <div v-html="form.activityRule" style="word-break: break-all" v-else></div>
        </el-form-item>
        <FormTitle value="活动商品："></FormTitle>
        <el-form-item label="拼团商品：" prop="activityProductList">
          <el-button type="text" @click="addGoods" :disabled="isEdit">+ 添加拼团商品</el-button>
          <el-button type="text" @click="resetGoods" :disabled="isEdit">全部清空</el-button>
          <el-table border :data="form.activityProductList" :span-method="objectSpanMethod" ref="table"
            v-if="form.activityProductList && form.activityProductList.length > 0">
            <Empty slot="empty" />
            <el-table-column align="center" label="商品图片" width="150px" prop="productImagePc">
              <template slot-scope="scope">
                <UploadFileUrl :fileList.sync="scope.row.productImagePc" hiddenUpload listType="picture-card" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="100px" prop="productName"></el-table-column>
            <el-table-column align="center" label="商品规格" width="100px" prop="specsName"></el-table-column>
            <el-table-column align="center" label="原价" width="100px" prop="servicePrice"></el-table-column>
            <el-table-column align="center" label="拼团价格" width="180px">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.groupPrice" :min="isZeroBuy(form.activityType) ? 0 : 0.01"
                  :max="scope.row.basePrice" :active-change="false" :precision="2" controls-position="right" clearable
                  size="small" :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="库存">
              <template slot-scope="scope">
                <span v-if="form.activityStatus === 'PROCESSING'">{{ scope.row.initStock - scope.row.groupStock || 0 }}/
                </span>
                <el-input-number v-model="scope.row.groupStock" :min="fromWhere == 'view' ? -Infinity : 1"
                  :max="99999999999" :step="1" controls-position="right" clearable size="small" :step-strictly="true"
                  :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" disabled="isEdit" label="排序" width="160px" prop="sort">
              <template slot-scope="scope"> <el-input-number v-model="scope.row.sort" :min="1"
                  :disabled="isEdit"></el-input-number></template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px" prop="singleOperator">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="deleteGoods('single', scope.$index, scope.row)" :disabled="isEdit || isCombinationProduct(scope.row.isCombinationProduct)">移除</el-button> -->
                <el-button type="text" @click="modifyInventory(scope.row)" v-if="form.activityStatus === 'PROCESSING'"
                  v-show="hasAuthority('E2_14')"> 修改库存 </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteGoods('item', scope.$index, scope.row)"
                  :disabled="isEdit">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <FormTitle value="其他设置："></FormTitle>
        <!-- <el-form-item label="开启凑团：">
          <el-radio-group v-model="form.joinGroupFlag" :disabled="isEdit">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div>开启后，活动商品详情页展示未成团的团列表，买家可以任选一个团参团，提升成团率。</div>
        </el-form-item> -->
        <el-form-item label="虚拟成团：">
          <el-radio-group v-model="form.virtualGroupFlag" :disabled="isEdit">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div>开启后在成团有效期内未满的团，系统以匿名买家模拟成团，虚拟用户不生成订单</div>
          <div v-if="form.virtualGroupFlag == 1">
            <div style="margin-top: 10px">
              <span>参团人数≥</span>
              <el-input-number v-model="form.virtualGroupPersonNum" controls-position="right" placeholder="请输入"
                style="width: 130px; margin: 0 10px" clearable :min="0" :max="999" :disabled="isEdit" />
              <span>人</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="团长优惠：">
          <el-radio-group v-model="form.headDiscountFlag" :disabled="isEdit">
            <el-radio :label="0">不开启</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
          <div v-if="form.activityProductList.length == 0 && form.headDiscountFlag == 1" style="color: red">请选择商品</div>
          <el-table border :data="form.activityProductList" :span-method="objectSpanMethod" ref="table"
            v-if="form.activityProductList && form.activityProductList.length > 0 && form.headDiscountFlag == 1">
            <Empty slot="empty" />
            <el-table-column align="center" label="商品图片" width="150px" prop="productImagePc">
              <template slot-scope="scope">
                <UploadFileUrl :fileList.sync="scope.row.productImagePc" hiddenUpload listType="picture-card" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" width="100px" prop="productName"></el-table-column>
            <el-table-column align="center" label="商品规格" width="100px" prop="specsName"></el-table-column>
            <el-table-column align="center" label="拼团价格" width="180px">
              <template slot-scope="scope">
                {{ scope.row.groupPrice }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="团长价" width="180px">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.headGroupPrice" :min="isZeroBuy(form.activityType) ? 0 : 0.01"
                  :max="scope.row.basePrice" :active-change="false" :precision="2" controls-position="right" clearable
                  size="small" :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column align="center" width="180px" label="团长价商品数" prop="flashStock">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.headGroupStock" :min="fromWhere == 'view' ? -Infinity : 1"
                  :max="99999999999" :step="1" controls-position="right" clearable size="small" :step-strictly="true"
                  :disabled="isEdit"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" v-show="hasAuthority('E2_13')"
            :disabled="isEdit && form.activityStatus != 'PROCESSING'"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <AddGoodsDialog :addGoodsDialog.sync="addGoodsDialog" @selectProduct="selectProduct"
      :tableData="form.activityProductList"></AddGoodsDialog>
    <ModifyInventoryDialog :modifyInventoryDialog.sync="modifyInventoryDialog" :rowData="modifyInventoryForm"
      @refresh="getActivity"></ModifyInventoryDialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import AddGoodsDialog from '../components/addGoodsDialog';
import ModifyInventoryDialog from './components/modifyInventoryDialog';
import { togetherAdd, togetherEdit, togetherDetails, togetherDetailsCopyInfo } from '@/api/newApi/extension/activity.js';
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
        activityName: '',
        activityTime: [],
        actionBucket: '1',
        totalBuyLimit: '',
        spellGroupEffectiveTime: '',
        spellGroupPersonNum: '',
        activityChannel: ['PC', 'XCX', 'H5'],
        activityRule: '',
        joinGroupFlag: 1,
        virtualGroupFlag: 1,
        virtualGroupPersonNum: 1,
        headDiscountFlag: 0,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        activityProductList: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      totalBuyLimitType: 1,
      applyChannel: [
        { label: 'PC', name: 'PC' },
        { label: 'XCX', name: '小程序' },
        { label: 'H5', name: 'H5' },
      ],
      channelAll: ['PC', 'XCX', 'H5'],
      checkAllChannel: true,
      selectList: [],
      firmList: [],
      tableData: [],
      formRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        actionBucket: [{ required: true, message: '请选择活动栏目', trigger: 'change' }],
        activityRule: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
        spellGroupEffectiveTime: [{ required: true, message: '请输入成团有效期', trigger: 'blur' }],
        spellGroupPersonNum: [{ required: true, message: '请输入成团人数', trigger: 'blur' }],
        activityChannel: [{ required: true, message: '请选择活动渠道', trigger: 'change' }],
        activityProductList: [{ required: true, message: '请选择商品', trigger: 'blur' }],
      },
      submitting: false,
      setSecondKillDialog: false,
      addGoodsDialog: false,
      fromWhere: this.$route.query.key,
      rowData: this.$route.params.rowData,
      modifyInventoryDialog: false,
      modifyInventoryForm: {},
      checkedActivities: false,
    };
  },
  mounted() {
    if (this.fromWhere == 'edit' || this.fromWhere == 'copy' || this.fromWhere == 'view') this.getActivity();
    if (this.form.enterpriseId == 30) {
      this.activityType = [
        {
          value: '1',
          label: '零元购',
        },
        {
          value: '2',
          label: '爆款低价秒杀区',
        },
        {
          value: '6',
          label: '限时折扣',
        },
        {
          value: '5',
          label: '优惠券',
        },
        {
          value: '1',
          label: '新人专享',
        },
        {
          value: '7',
          label: '限时秒杀',
        },
      ];
    }
  },
  computed: {
    isEdit() {
      let isEdit = false;
      if (this.$route.query.key == 'view') {
        isEdit = true;
      } else if (this.$route.query.key == 'edit' && this.form.activityStatus == 'PROCESSING') {
        isEdit = true;
      }
      return isEdit;
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
          let headPriceFlag = false;
          let headStockFlag = false;
          let isSort = false;
          let categoryIdsStock = {};
          if (this.form.activityProductList.length == 0) {
            this.$message.warning('请选择商品！');
          }
          this.form.activityProductList.map((item) => {
            // 多规格时。 库存可能只有一部分。用productCategoryId key 存起来。 没有就给一个
            // 有问题。 会覆盖没有填写库存的项
            const categoryIdkey = item.productCategoryId + item.id;
            categoryIdsStock[categoryIdkey] = item.groupStock || categoryIdsStock[categoryIdkey];
            item.groupStock = categoryIdsStock[categoryIdkey];
            // 非零元购商品不支持0元
            if (item.groupPrice == 0 && !this.isZeroBuy(this.form.activityType)) zeroFlag = true;
            // 判断秒杀价格是否填写
            // let requiredItem = arr.find((a) => a.batchNo === item.batchNo);
            // if (this.isRequired(item.isRequired)) {
            //   if (!requiredItem.flashPrice) {
            //     priceFlag = true;
            //   }
            // } else if ((!item.groupPrice && !this.isZeroBuy(this.form.activityType)) || (!item.groupPrice && item.groupPrice != 0 && this.isZeroBuy(this.form.activityType))) {
            //   priceFlag = true;
            // }
            if (!item.groupPrice) {
              priceFlag = true;
            }
            // 判断库存数量是否填写
            // if (this.isRequired(item.isRequired)) {
            //   if (!requiredItem.groupStock) {
            //     stockFlag = true;
            //   }
            // } else if (!item.groupStock) {
            //   stockFlag = true;
            // }

            if (!item.groupStock) {
              stockFlag = true;
            }
            if (this.form.headDiscountFlag == 1) {
              if (item.headGroupPrice == 0) zeroFlag = true;
              if (!item.headGroupPrice || (!item.headGroupPrice && item.headGroupPrice != 0)) headPriceFlag = true;
              if (!item.headGroupStock) headStockFlag = true;
            }
          });

          if (zeroFlag) return this.$message.warning('非秒杀商品秒杀价格不能为0！');
          if (priceFlag) return this.$message.warning('完整输入每项的拼团价格！');
          if (stockFlag) return this.$message.warning('请完整输入每项的库存！');
          if (headPriceFlag) return this.$message.warning('请完整输入每项的团长价！');
          // if (headStockFlag) return this.$message.warning('请完整输入团长价商品数！');
          let newData = this.arrayTransfer(this.form.activityProductList);
          let data = {
            ...this.form,
            finishTime: this.form.activityTime[1],
            startTime: this.form.activityTime[0],
            totalBuyLimit: this.totalBuyLimitType == 2 ? this.form.totalBuyLimit : -1,
            virtualGroupPersonNum: this.form.virtualGroupFlag == 1 ? this.form.virtualGroupPersonNum : '',
            activityChannel: this.form.activityChannel.join(','),
            activityProductList: newData.map((item, index) => {
              return {
                enterpriseId: Number(localStorage.getItem('enterpriseId')),
                activityProductImgUrl: item.activityProductImgUrl,
                groupFlag: item.groupFlag,
                productInfoId: item.productInfoId,
                productName: item.productName,
                serviceContext: item.serviceContext,
                specsList: this.getSpecsList(item.children, item.isCombinationProduct),
                sort: item.sort ? item.sort : 1,
              };
            }),
          };
          delete data.activityTime;
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
    arrayTransfer(data) {
      const resultArr = [];
      data.forEach((item) => {
        let currentSpecItem = '';
        if (item.productSpecsDTOList) {
          currentSpecItem = item.productSpecsDTOList.find((specItem) => specItem.id === item.productSpecsId);
        }
        if (item.specsList) {
          currentSpecItem = item.specsList.find((specItem) => specItem.productSpecsId === item.productSpecsId);
        }
        let obj = {
          batchNo: item.batchNo,
          groupPrice: item.groupPrice,
          groupStock: item.groupStock,
          headGroupPrice: item.headGroupPrice,
          headGroupStock: item.headGroupStock,
          initStock: item.initStock,
          joinSkuIds: item.joinSkuIds,
          productSpecsId: item.productSpecsId,
          productCategoryId: currentSpecItem ? currentSpecItem.productCategoryId : '',
          productSpecsName: item.specsName,
          servicePrice: item.servicePrice,
          isCombinationProduct: item.isCombinationProduct,
          isRequired: item.isRequired,
        };
        const hasChildIndex = resultArr.findIndex((resultItem) => resultItem.productInfoId === (item.productInfoId || item.id));
        if (hasChildIndex !== -1) {
          resultArr[hasChildIndex].children.push(obj);
        } else {
          resultArr.push({
            productInfoId: item.productInfoId || item.id,
            productName: item.productName,
            serviceContext: item.serviceContext,
            sort: item.sort,
            activityProductImgUrl: item.productImagePc,
            groupFlag: item.isCombinationProduct == 'IS_COMBINATION_PRODUCT' ? 1 : 0,
            children: [obj],
          });
        }
      });
      return resultArr;
    },
    getSpecsList(row, type) {
      let arry = [];
      row.forEach((item) => {
        let itemArry = {
          batchNo: item.batchNo,
          groupPrice: item.groupPrice,
          groupStock: item.groupStock,
          headGroupPrice: item.headGroupPrice,
          headGroupStock: item.headGroupStock,
          initStock: item.initStock,
          productSpecsId: type == 'IS_COMBINATION_PRODUCT' ? 0 : item.productSpecsId,
          productSpecsName: item.productSpecsName,
          productCategoryId: item.productCategoryId,
          servicePrice: item.servicePrice,
          isRequired: item.isRequired,
        };
        if (item.joinSkuIds) {
          let basic = item.joinSkuIds.substr(1);
          basic = basic.substr(0, basic.length - 1);
          let joinSkuIdsArry = {
            batchNo: -1,
            groupPrice: 0,
            groupStock: item.groupStock,
            headGroupPrice: item.headGroupPrice,
            headGroupStock: item.headGroupStock,
            initStock: item.initStock,
            productSpecsId: type == 'IS_COMBINATION_PRODUCT' ? 0 : basic,
            productSpecsName: item.productSpecsName,
            productCategoryId: item.productCategoryId,
            servicePrice: 0,
            isRequired: item.isRequired,
          };
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
        res = await togetherDetailsCopyInfo(this.$route.query.id);
      } else {
        res = await togetherDetails(this.$route.query.id);
      }
      if (res.code == 0) {
        this.form = res.data;
        this.$set(this.form, 'activityTime', [this.form.startTime, this.form.finishTime]);
        this.$set(this.form, 'activityChannel', this.form.activityChannel.split(','));
        this.$set(this.form, 'headDiscountFlag', this.form.headDiscountFlag ? 1 : 0);
        this.$set(this.form, 'joinGroupFlag', this.form.joinGroupFlag ? 1 : 0);
        this.$set(this.form, 'virtualGroupFlag', this.form.virtualGroupFlag ? 1 : 0);
        if (this.form.activityChannel.length == this.applyChannel.length) {
          this.checkAllChannel = true;
        } else {
          this.checkAllChannel = false;
        }
        this.totalBuyLimitType = this.form.totalBuyLimit > -1 ? 2 : 1;

        let data = JSON.parse(JSON.stringify(this.form.activityProductList));
        //判断是否有官费
        data.forEach((item) => {
          item.specsList.forEach((val) => {
            if (val.batchNo > -1) {
              if (this.getNewComent(val, item.specsList).isProduct) {
                val.joinSkuIds = '[' + this.getNewComent(val, item.specsList).productSpecsId + ']';
              }
            }
          });
        });
        this.form.activityProductList = this.getProductList(data);
      } else {
        this.$message.error(res.message);
      }
    },
    getNewComent(val, item) {
      let newData = {
        isProduct: false,
      };
      item.forEach((k) => {
        if (k.productCategoryId == val.productCategoryId && k.productSpecsName == val.productSpecsName && k.batchNo != val.batchNo) {
          newData.isProduct = true;
          newData.productSpecsId = k.productSpecsId;
        }
      });
      return newData;
    },
    getProductList(productList) {
      let list = [];
      productList.forEach((item) => {
        if (item.specsList) {
          item.specsList.forEach((spec, i) => {
            if (spec.batchNo > -1) {
              list.push({
                ...item,
                productImagePc: item.activityProductImgUrl,
                productSpecsId: spec.productSpecsId,
                goodsRowspan: this.getgoodsRowspanLength(item.specsList),
                rowspan: spec.batchNo,
                isCombinationProduct: item.groupFlag ? 'IS_COMBINATION_PRODUCT' : '',
                index: i,
                joinSkuIds: spec.joinSkuIds,
                batchNo: spec.batchNo,
                initStock: spec.initStock,
                groupPrice: spec.groupPrice,
                groupStock: spec.groupStock,
                headGroupPrice: spec.headGroupPrice,
                productCategoryId: spec.productCategoryId,
                headGroupStock: spec.headGroupStock,
                productInfoId: item.productInfoId,
                specsName: spec.productSpecsName,
                servicePrice: spec.servicePrice,
                isRequired: spec.isRequired,
              });
            }
          });
        } else {
          list.push(item);
        }
      });
      return list;
    },

    getgoodsRowspanLength(specsList) {
      let i = 0;
      specsList.forEach((item) => {
        if (item.batchNo > -1) {
          i++;
        }
      });
      return i;
    },
    // 活动编辑
    editActivity(data) {
      this.submitting = true;
      data.spellGroupActivityId = this.$route.query.id;
      togetherEdit(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('编辑成功');
            this.$router.push({
              path: '/extension/activityManagement/together/index.vue',
              name: 'together',
            });
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
      togetherAdd(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('创建成功');
            this.$router.push({
              path: '/extension/activityManagement/together/index.vue',
              name: 'together',
            });
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
          this.form.activityProductList.splice(index, row.goodsRowspan || 1);
        } else if (key === 'single') {
          this.form.activityProductList.forEach((item) => {
            if (item.id === row.id) {
              item.goodsRowspan -= row.rowspan;
              if (item.index > row.index) {
                item.index -= row.rowspan;
              }
            }
          });
          this.form.activityProductList.splice(index, row.rowspan || 1);
        }
      });
    },
    /**清空商品数组 */
    resetGoods() {
      this.form.activityProductList = [];
    },
    // 修改库存
    modifyInventory(row) {
      this.modifyInventoryDialog = true;
      row.spellGroupActivityId = this.form.spellGroupActivityId;
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
      this.form.activityProductList = [];
    },
    // 确认选择商品
    selectProduct(val) {
      // 合并选择的商品
      this.form.activityProductList = this.form.activityProductList.concat(this.formatListData(val));
      // 给商品添加批次号batchNo
      this.form.activityProductList.forEach((item, index, arr) => {
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
              initStock: spec.initStock,
              productInfoId: spec.productInfoId,
              specsName: spec.specsName,
              joinSkuIds: spec.joinSkuIds,
              servicePrice: spec.servicePrice,
              isRequired: spec.isRequired,
            });
          });
        } else {
          list.push(item);
        }
      });
      return list;
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/together/index.vue',
        name: 'together',
      });
    },
    handleCheckAllChangeChannel(val) {
      this.form.activityChannel = val ? this.channelAll : [];
    },
    handleCheckedCitiesChangeChannel(value) {
      let checkedCount = value.length;
      this.checkAllChannel = checkedCount === this.channelAll.length;
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
