<template>
  <el-dialog title="翻译授权书" :visible.sync="dialogvisible" width="560px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="是否需要付费" prop="isNeedPay">
        <el-radio-group v-model="form.isNeedPay">
          <el-radio :label="2">需要付费</el-radio>
          <el-radio :label="1">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="item-tip" v-show="form.isNeedPay === 2"><i class="icon icon-tip"></i>付费类型，金额一旦确定后，将不能再修改</div>
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
      <!-- <div class="item-tip"><i class="icon icon-tip"></i>注意：客户必须在官方截止日期内确认答复，否则，会被官方默认放弃申请
        <div>尽量在官方截止时间的基础上预留15天给至律师处理</div>
      </div> -->
      <el-form-item label="授权书翻译文件" prop="interpretFileStr">
        <UploadFileUrl :fileList.sync="form.interpretFileStr" :maxSize="2" initTip="文件限制：文件大小不超过5M" :showTip="false">
          <div slot="content">支持扩展名:.doc.docx.pdf.jpg.xls.xlsx，每个文件大小2M内，最多1个文件</div>
        </UploadFileUrl>
      </el-form-item>
      <div class="item-tip"><i class="icon icon-tip"></i>授权书翻译文件将展示给客户，方便客户查阅授权书</div>
      <el-form-item label="客户截止日期" prop="lastDealDate" v-if="form.isNeedPay === 2">
        <el-date-picker v-model="form.lastDealDate" type="date" :clearable="false" placeholder="请选择客户截止日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { authorizationTranslate } from '@/api/newApi/intellectualProperty/certificate';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { productListAPI } from '@/api/newApi/intellectualProperty/oa.js';
export default {
  props: {
    translateDialog: Boolean,
    workOrderId: String,
  },
  data() {
    return {
      form: {
        isNeedPay: 1,
        interpretFileStr: '',
      },
      rules: {
        interpretFileStr: [{ required: true, message: '请上传审查意见翻译文件', trigger: 'change' }],
        lastDealDate: [{ required: true, message: '请选择客户截止日期', trigger: 'blur' }],
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
    this.getProduct();
  },
  methods: {
    // 获取OA商品
    getProduct() {
      let data = { functionCode: this.$constant.CERTIFICATE_FUNCTION_CODE, isCombinationProduct: 'NOT_COMBINATION_PRODUCT' };
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
      authorizationTranslate({
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
