<template>
  <el-dialog title="宣誓延期" :visible.sync="visible" :destroy-on-close="true" @close="cancel" @closed="resetForm('form')" width="30%">
    <div v-show="curFooterType === 'default'">
      <el-form v-loading="loading" :model="form" :rules="rules" ref="form">
        <el-form-item label="服务商品：" prop="product" :required="true">
          <div class="select-group">
            <el-select placeholder="请选择国家" clearable v-model="form.product.country" filterable style="width: 150px">
              <el-option v-for="item in country" :key="item.countryCode" :label="item.countryCodeName" :value="item.countryCode"> </el-option>
            </el-select>
            <el-select placeholder="请选择服务商品" clearable v-model="form.product.product" filterable style="margin: 0 10px">
              <el-option v-for="item in optionsProduct" :key="item.id" :label="item.productName" :value="item.id"> </el-option>
            </el-select>
            <el-select placeholder="请选择服务项目" clearable v-model="form.product.project" filterable>
              <el-option v-for="item in optionsProject" :key="item.id" :label="item.specsName" :value="item.id"> </el-option>
            </el-select>
          </div>
        </el-form-item>
        <p class="text-money" v-if="tipsText" v-html="tipsText"></p>
        <el-form-item label="宣誓截止日期：" prop="date">
          <el-date-picker v-model="form.date" type="date" :picker-options="pickerOptions" placeholder="选择日期时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <InnerSuccess v-show="curFooterType === 'success'" />
    <span slot="footer" class="dialog-footer" v-show="!loading">
      <el-button @click="() => footerEnums[curFooterType].cancelFn()" v-if="footerEnums[curFooterType].cancelShow">{{ footerEnums[curFooterType].cancelText }}</el-button>
      <el-button type="primary" @click="() => footerEnums[curFooterType].okFn()" :data-clipboard-text="payLink" class="copy">{{ footerEnums[curFooterType].okText }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { productInfoList } from '@/api/newApi/manuelorder/addOrder.js';
import { reCreateVowOrder } from '@/api/newApi/intellectualProperty/trademark.js';
import InnerSuccess from './InnerSuccess.vue';

export default {
  props: ['defaultFileList', 'workOrderId'],
  components: {
    InnerSuccess,
  },
  data() {
    var validateProduct = (rule, value, callback) => {
      if (value.country && value.product && value.project) {
        callback();
      } else {
        callback(new Error('请将选项补充完整'));
      }
    };
    return {
      visible: false,
      loading: true,
      form: {
        // 官方日期
        date: '',
        // 服务商品
        product: {
          country: '',
          // 服务商品
          product: '',
          // 服务项目
          project: '',
        },
      },
      rules: {
        date: [{ required: true, message: '请选择官宣截止日期', trigger: 'blur' }],
        product: [
          { required: true, message: '请将选项补充完整', trigger: 'click' },
          { validator: validateProduct, trigger: 'click' },
        ],
      },
      curFooterType: 'default',
      productList: [],
      country: [],
      // 服务商品下拉框选项
      optionsProduct: [],
      // 服务项目下拉框选项
      optionsProject: [],
      functionCode: 9999,
      price: 0,
      payLink: '',
      pickerOptions: {
        disabledDate: (time) => {
          const today = new Date(); // 当前日期
          return time.getTime() < today.getTime(); // 返回 true 表示禁用日期
        },
      },
    };
  },
  computed: {
    footerEnums() {
      return {
        default: {
          cancelText: '取消',
          cancelFn: () => this.cancel(),
          cancelShow: true,
          okText: '确认',
          okFn: () => this.submit(),
        },
        success: {
          cancelText: '返回修改',
          cancelFn: () => this.reFill(),
          cancelShow: false,
          okText: '复制付款链接并发送给销售',
          okFn: () => this.copyPaylnk(),
        },
      };
    },
    tipsText() {
      if (this.form.product.project) {
        let productText = '';
        let projectText = '';
        const curProduct = this.productList.filter((item) => item.id === this.form.product.product)[0];
        const curProject = curProduct.productSpecsDTOList.filter((item) => item.id === this.form.product.project)[0];
        productText = curProduct.productName;
        projectText = curProject.specsName;
        this.price = curProject.servicePrice;
        return `${productText}-${projectText}<span>￥ ${this.price}</span>`;
      } else {
        return '';
      }
    },
  },
  watch: {
    'form.product.country': function (country) {
      if (country) {
        let arr = [];
        arr = this.productList.filter((item) => item.countryCode === country).map((item) => ({ id: item.id, productName: item.productName }));
        let uniqueArr = Array.from(new Set(arr.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
        this.optionsProduct = [...uniqueArr];
        this.form.product.product = '';
        this.form.product.project = '';
      } else {
        this.optionsProduct = this.optionsProduct.slice(0);
        this.form.product.product = '';
        this.form.product.project = '';
      }
    },
    'form.product.product': function (id) {
      if (id) {
        const arr = this.productList.filter((item) => item.id === id)[0].productSpecsDTOList;
        this.optionsProject = [...arr];
        this.form.product.project = '';
      } else {
        this.optionsProject = this.optionsProject.slice(0);
        this.form.product.project = '';
      }
    },
  },
  methods: {
    async relive() {
      const params = {
        workOrderId: this.workOrderId,
        lastDealDate: this.form.date,
        vowProductId: this.form.product.product,
        vowProductSpecId: this.form.product.project,
      };
      const res = await reCreateVowOrder(params);
      if (res.code === 0) {
        this.payLink = res.data;
      }
    },
    async getProduct() {
      const res = await productInfoList({ functionCode: this.functionCode, isCombinationProduct: 'NOT_COMBINATION_PRODUCT' });
      if (res.code === 0) {
        this.productList = res.data.records;
        const arrCountry = this.productList.map((item) => ({ countryCode: item.countryCode, countryCodeName: item.countryCodeName }));
        // 去重
        let uniqueArr = Array.from(new Set(arrCountry.map((item) => JSON.stringify(item)))).map((item) => JSON.parse(item));
        this.country = [...uniqueArr];
      }
    },
    async getData() {
      await this.getProduct();
      this.loading = false;
    },
    resetForm() {
      this.curFooterType = 'default';
      this.form.product.country = '';
      this.form.date = '';
      this.price = 0;
    },
    async show() {
      await this.getData();
      this.visible = true;
      this.resetForm();
    },
    copyPaylnk() {
      this.$util.copyLink('.copy', '已复制付款链接');
      this.visible = false;
    },
    // 重新填写
    reFill() {
      this.curFooterType = 'default';
    },
    cancel() {
      this.visible = false;
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log('验证通过');
          try {
            this.loading = true;
            await this.relive();
            this.curFooterType = 'success';
            this.$emit('update');
          } finally {
            this.loading = false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.text {
  &-tips {
    margin-left: 92px;
    color: #999999bf;
    font-size: 12px;
  }
}
.select-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-money {
  margin: 0 0 19px 92px;
  ::v-deep span {
    margin-left: 20px;
  }
}

.inner-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  i {
    font-size: 60px;
    color: #52c41a;
  }
}
</style>
