<template>
  <el-dialog title="翻译OA" :visible.sync="dialogvisible" width="560px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="是否需要客户处理" prop="processing">
        <el-radio-group v-model="form.processing">
          <el-radio :label="2">需要处理</el-radio>
          <el-radio :label="1">无需处理</el-radio>
        </el-radio-group>
      </el-form-item>
      <span v-if="form.processing === 2">
        <el-form-item label="答复建议" prop="processingSuggestion" :rules="[{ required: true, message: '请输入答复建议', trigger: 'blur' }]">
          <el-input v-model="form.processingSuggestion" placeholder="请输入答复建议" clearable type="textarea" style="width: 300px" size="small" maxlength="500" />
        </el-form-item>
        <el-form-item label="是否需要付费" prop="isNeedPay">
          <el-radio-group v-model="form.isNeedPay">
            <el-radio :label="2">需要付费</el-radio>
            <el-radio :label="1">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="item-tip"><i class="icon icon-tip"></i>付费类型，金额一旦确定后，将不能再修改</div>
        <el-table :data="payInfo" v-show="form.isNeedPay === 2" style="margin-bottom: 20px">
          <el-table-column label="服务">
            <template slot-scope="{ row, $index }">
              <div style="padding: 8px 0">
                <el-select v-model="row.productId" filterable clearable @change="changeService($event, $index)" placeholder="选择服务" style="margin-bottom: 10px">
                  <el-option v-for="item in serviceList" :key="item.id" :value="item.id" :label="item.productName"></el-option>
                </el-select>
                <el-select v-model="row.productSkuId" filterable clearable @change="changeServiceItem($event, $index)" placeholder="选择服务项目">
                  <el-option v-for="(item, index) in serviceItemList" :key="index" :value="item.id" :label="item.specsName"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="国家" prop="countryNameZh"></el-table-column>
          <el-table-column align="center" label="售价" prop="price"></el-table-column>
        </el-table>
        <el-form-item label="客户截止日期" prop="lastDealDate">
          <el-date-picker v-model="form.lastDealDate" type="date" :clearable="false" placeholder="选择客户截止日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <div class="item-tip">
          <i class="icon icon-tip"></i>注意：客户必须在官方截止日期内确认答复，否则，会被官方默认放弃申请
          <div>尽量在官方截止时间的基础上预留15天给至律师处理</div>
        </div>
        <el-form-item label="审查意见翻译文件" prop="interpretFileStr">
          <UploadFileUrl :fileList.sync="form.interpretFileStr" :maxSize="2" initTip="文件限制：文件大小不超过5M" :showTip="false">
            <div slot="content">支持扩展名:.doc.docx.pdf.jpg.xls.xlsx，每个文件大小2M内，最多1个文件</div>
          </UploadFileUrl>
        </el-form-item>
        <div class="item-tip"><i class="icon icon-tip"></i>审查意见翻译文件将展示给客户，用于指引客户提供答复OA的材料</div>
      </span>
      <span v-else>
        <el-form-item label="OA答复文件" prop="fileStr" label-width="100px">
          <UploadFileUrl :fileList.sync="form.fileStr" uploadText="点击上传" fileClass uploadWithName accept=".pdf,.doc,.docx,.zip,.rar" :maxSize="5" :limit="20" initTip="文件限制：文件大小不超过5M" :showTip="false"> </UploadFileUrl>
        </el-form-item>
        <el-form-item label="备注" prop="processingSuggestion">
          <el-input v-model="form.processingSuggestion" placeholder="请输入备注说明" clearable type="textarea" style="width: 300px" size="small" maxlength="500" />
        </el-form-item>
      </span>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { OAPatentTranslate } from '@/api/newApi/intellectualProperty/OAAppearancePatent';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { productListAPI } from '@/api/newApi/intellectualProperty/oa.js';
export default {
  props: {
    translateDialog: Boolean,
    workOrderId: String,
    oaDetailWorkOrderVO: Object,
  },
  data() {
    return {
      pickerOptions: {},
      form: {
        processing: 2,
        processingSuggestion: '',
        isNeedPay: 1,
        lastDealDate: '',
        interpretFileStr: '',
        fileStr: '',
      },
      rules: {
        // processingSuggestion: [{required: true, message: '请输入答复建议', trigger: 'blur'}],
        lastDealDate: [{ required: true, message: '请选择客户截止日期', trigger: 'blur' }],
        interpretFileStr: [{ required: true, message: '请上传审查意见翻译文件', trigger: 'blur' }],
        fileStr: [{ required: true, message: '请上传OA答复文件', trigger: 'blur' }],
      },
      payInfo: [
        {
          productId: '',
          productSkuId: '',
          countryNameZh: '',
          price: '',
          productName: '',
        },
      ],
      serviceList: [],
      serviceItemList: [],
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.translateDialog;
      },
      set(val) {
        this.$emit('update:translateDialog', val);
      },
    },
  },
  created() {
    let _this = this;
    this.pickerOptions = {
      disabledDate(time) {
        let t = time.getTime();
        return t < +new Date(_this.oaDetailWorkOrderVO.officeStartDate) || t > +new Date(_this.oaDetailWorkOrderVO.officialExpirationDate);
      },
    };
    this.getProduct();
  },
  methods: {
    // 获取OA商品
    getProduct() {
      let data = { functionCode: this.$constant.OA_APPEARANCE_FUNCTION_CODE, isCombinationProduct: 'NOT_COMBINATION_PRODUCT' };
      productListAPI(data).then((res) => {
        if (res.code == 0) {
          this.serviceList = res.data.records;
        }
      });
    },
    // 选择OA商品
    changeService(val, index) {
      this.payInfo[index].productSkuId = '';
      this.payInfo[index].price = '';

      let service = this.serviceList.find((item) => item.id === val);
      this.serviceItemList = service ? service.productSpecsDTOList : [];
      if (this.serviceItemList.length === 1) {
        this.serviceItemList[0].skuName = service.productName;
      }
      this.payInfo[index].productName = this.serviceItemList[0].specsName;
      this.payInfo[index].countryNameZh = service ? service.countryCodeName : '';
    },
    changeServiceItem(val, index) {
      let serviceItem = this.serviceItemList.find((item) => item.id === val);
      this.payInfo[index].price = serviceItem ? serviceItem.servicePrice : '';
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      OAPatentTranslate({
        ...this.form,
        productId: this.payInfo[0].productId,
        productSkuId: this.payInfo[0].productSkuId,
        productName: this.payInfo[0].productName,
        productMoney: this.payInfo[0].price,
        workOrderId: this.workOrderId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.$emit('refresh');
        }
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.item-tip {
  margin-bottom: 20px;
}
</style>
