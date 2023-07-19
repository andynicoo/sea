<template>
  <el-dialog title="款项确认" :visible.sync="dialogvisible" width="1100px" center>
    <template v-if="countryCode == 'DE'">
      <el-table border :data="summaryObj.productResult" highlight-current-row>
        <el-table-column label="汇总数据" align="center">
          <el-table-column align="center" label="Material type 材料类别" prop="cate"> </el-table-column>
          <el-table-column align="center" label="当年实际出货总重量 Kg" prop="actualWeight"> </el-table-column>
          <el-table-column align="center" label="已购重量（Kg）" prop="buyWeight"> </el-table-column>
          <el-table-column align="center" label="溢出重量（吨）" prop="overflowWeight"> </el-table-column>
          <el-table-column align="center" label="需补缴金额（元）" prop="excess">
            <template slot-scope="scope">
              <el-input-number :precision="2" :min="0" :step="1" v-model="scope.row.payAmount" clearable size="small" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="待申报重量（Kg）" prop="decalareWeight"> </el-table-column>
        </el-table-column>
      </el-table>
      <el-row class="table-row">
        <el-col class="table-col" :span="16"><div class="grid-content">* 注释： 如当年实际申报低于已购重量，则无需补缴，默认按照已购重量进行年度申报</div></el-col>

        <el-col class="table-col" :span="4">
          <div class="grid-content">需补缴金额总计： {{ totalCheckPrice }}</div>
        </el-col>
        <el-col class="table-col" style="border-right: 1px solid #ebeef5" :span="4"></el-col>
      </el-row>
    </template>

    <template v-if="countryCode == 'FR'">
      <el-table border :data="productList" highlight-current-row>
        <el-table-column align="center" label="*产品系列" prop="cate">
          <template slot-scope="scope">
            <el-select v-model="scope.row.parentProductCategoryName" @change="(val) => changeParentProductCategoryName(val, scope.$index)" clearable filterable>
              <el-option v-for="item in productCategoryList" :key="item.id" :label="item.productCategoryZh" :value="item.productCategoryZh"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="*产品" prop="actualWeight">
          <template slot-scope="scope">
            <el-select v-model="scope.row.productCategoryId" @change="(val) => changeProductCategoryId(val, scope.$index)" clearable filterable>
              <el-option v-for="item in subProductCategoryList[scope.$index]" :key="item.id" :label="item.productCategoryZh" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="*包装数量（最外层包装数CSU）" prop="outerPackageQuantity">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.outerPackageQuantity" :min="0" :precision="0" clearable size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" label="包装数量（最小包装数CU）" prop="inPackageQuantity">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.inPackageQuantity" :min="0" :precision="0" clearable size="small"></el-input-number>
          </template>
        </el-table-column>

        <el-table-column align="center" label="回收官费（欧元）" prop="excess">
          <template slot-scope="scope">
            <el-input-number :precision="2" :min="0" :step="1" v-model="scope.row.payAmount" clearable size="small" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="excess">
          <template slot-scope="scope">
            <el-link type="primary" @click="addProduct">添加</el-link>
            <el-link type="primary" @click="remove(scope.$index)" v-if="productList.length > 1"> 删除 </el-link>
          </template>
        </el-table-column>
      </el-table>

      <div class="upload-box">
        <span class="upload-label required-font">上传资料:</span>
        <UploadFile :drag="false" :accept="'.jpg,.png,.pdf,.zip, xls, .xlsx, .csv,.txt,.rar,.doc,.docx'" :fileList.sync="fileList">
          <div slot="uploadBtn">
            <el-button class="float-right">点击上传</el-button>
          </div>
        </UploadFile>
      </div>
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确 定</el-button>
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { confirmExpensesApi } from '@/api/newApi/taxServices/serviceManage.js';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
import { declareProductCategory, confirmExpensesFrApi } from '@/api/newApi/workOrder/epr';
export default {
  props: {
    confirmFeeVisible: Boolean,
    getInfo: Function,
    eprDeclare: Object,
    countryCode: String,
    supplierCode: String,
  },
  components: { UploadFile },
  data() {
    return {
      summaryObj: {},
      productList: [],
      productCategoryList: [],
      subProductCategoryList: {},
      fileList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.confirmFeeVisible;
      },
      set(val) {
        this.$emit('update:confirmFeeVisible', val);
      },
    },
    totalCheckPrice() {
      if (!this.summaryObj.productResult) {
        return '';
      }
      const price = this.summaryObj.productResult.reduce((pre, cur) => {
        return cur.payAmount == -1 ? pre : this.$util.accAdd(pre, cur.payAmount - 0);
      }, 0);
      this.$set(this.summaryObj, 'toalPayAmount', price);

      return price;
    },
  },
  watch: {
    confirmFeeVisible(newVal, oldVal) {
      if (newVal) {
        if (this.countryCode == 'FR') {
          this.getDeclareProductCategory();
          if (this.eprDeclare.summary) {
            this.productList = JSON.parse(this.eprDeclare.summary).frEprProductCateFeeList;
          } else {
            this.addProduct();
          }
        } else if (this.countryCode == 'DE') {
          this.summaryObj = JSON.parse(this.eprDeclare.summary);
        }
      }
    },
  },
  created() {},
  methods: {
    getDeclareProductCategory() {
      declareProductCategory({ countryCode: 'FR', supplierCode: this.supplierCode }).then((res) => {
        this.productCategoryList = res.data;
        if (!this.productCategoryList.length) return;
        this.productList.forEach((item, index) => {
          this.changeParentProductCategoryName(item.parentProductCategoryName, index, true);
        });
      });
    },
    changeParentProductCategoryName(val, index, flag) {
      this.productList[index].parentProductCategoryName = val;

      const eprDeclareProductCategoryPriceList = (this.productCategoryList.find((el) => el.productCategoryZh == val) || {}).eprDeclareProductCategoryPriceList;
      this.$set(this.subProductCategoryList, index, eprDeclareProductCategoryPriceList);
      if (!flag) {
        this.productList[index].productCategoryId = '';
        this.productList[index].productCategoryName = '';
        this.productList[index].productCategoryCode = '';
      }
    },

    changeProductCategoryId(val, index) {
      this.productList[index].productCategoryId = val;
      const productObj = this.subProductCategoryList[index].find((el) => el.id == val) || {};
      this.productList[index].productCategoryName = productObj.productCategoryZh;
      this.productList[index].productCategoryCode = productObj.code;
    },

    remove(index) {
      this.productList.splice(index, 1);
    },
    addProduct() {
      this.productList.push({
        parentProductCategoryName: '',
        productCategoryId: '',
        productCategoryName: '',
        productCategoryCode: '',
        outerPackageQuantity: 0,
        inPackageQuantity: 0,
        overflowWeight: 0,
        payAmount: 0,
      });
    },

    submit() {
      if (this.countryCode == 'FR') {
        const totalPayAmount = this.productList.reduce((pre, cur) => {
          return cur.payAmount == -1 ? pre : this.$util.accAdd(pre, cur.payAmount - 0);
        }, 0);
        const simulateurDetailFileUrl = this.fileList.length ? this.fileList.map((el) => el.url).join(',') : '';
        const req = {
          totalPayAmount,
          simulateurDetailFileUrl,
          frEprProductCateFeeList: this.productList,
        };
        confirmExpensesFrApi({
          ...this.eprDeclare,
          summary: JSON.stringify(req),
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.dialogvisible = false;
            this.getInfo();
          }
        });
        return;
      }
      confirmExpensesApi({
        ...this.eprDeclare,
        summary: JSON.stringify(this.summaryObj),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('提交成功');
          this.dialogvisible = false;
          this.getInfo();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-row {
  height: 60px;
  .table-col {
    border: 1px solid #ebeef5;
    border-top: none;
    height: 60px;
    line-height: 60px;
    border-right: none;
    padding-left: 10px;
  }
}
.upload-box {
  display: flex;
  margin-top: 20px;
  .upload-label {
    line-height: 33px;
    margin-right: 10px;
  }
}
.required-font::before {
  content: '*';
  color: #f5222d;
  margin-right: 4px;
}
</style>
