<template>
  <div class="attach-spesc-warp">
    <el-link :underline="false" type="info" @click="goBack" style="padding: 15px">
      <i class="el-icon-arrow-left"></i>
      返回列表
    </el-link>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模板名称" prop="templateName">
        <el-input class="w300" v-model="ruleForm.templateName"></el-input>
      </el-form-item>
      <el-form-item label="规格名称" prop="specsName">
        <el-input :disabled="true" class="w300 me-mr2" v-model="ruleForm.specsName"></el-input>
        <el-button v-show="!id" @click="dialogVisible = true" type="text" size="small">选择规格</el-button>
      </el-form-item>
      <el-form-item label="计算类型" prop="calcType">
        <el-select class="w300" v-model="ruleForm.calcType" placeholder="请选择">
          <el-option label="按数量计算" value="QUANTITY"></el-option>
          <el-option label="按阶梯计算" value="LADDER"></el-option>
        </el-select>
      </el-form-item>
      <div class="table-container">
        <el-table :data="tableData" class="additional-spec-table" v-if="ruleForm.calcType == 'QUANTITY'">
          <el-table-column prop="specName" label="附加规格名称" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.specName" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="specUnitPrice" label="单价RMB" width="300">
            <template slot="header" slot-scope="scope">
              单价RMB /
              <el-select class="attach-spec-unit" v-model="ruleForm.specUnitTxt" placeholder="请选择" @change="specUnitChange">
                <el-option v-for="item in specUnitList" :key="item.key" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <div class="attach-service-price">
                单件服务价格 <el-input-number :controls="false" :precision="2" v-model="scope.row.specUnitPrice" controls-position="right" :min="0"> </el-input-number><span class="attach-service-price-unit"> / {{ ruleForm.specUnitTxt }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.$index == tableData.length - 1" @click="addSpecHandle(scope.row, scope.$index)" type="text" size="small">添加</el-button>
              <el-button v-if="!(scope.$index == 0 && tableData.length == 1)" type="text" size="small" @click="delSpecHandle(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData" class="additional-spec-table" v-else>
          <el-table-column prop="specName" label="阶梯" width="200">
            <template slot-scope="scope"> 阶梯{{ scope.$index + 1 }} </template>
          </el-table-column>
          <el-table-column prop="specUnitPrice" label="数量区间" width="350">
            <template slot-scope="scope">
              <div class="attach-quantity-range attach-service-price">
                数量区间<el-input-number :controls="false" :precision="0" v-model="scope.row.specQuantityMin" :min="2"></el-input-number> ~ <el-input-number :controls="false" :precision="0" v-model="scope.row.specQuantityMax" :min="3"> </el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="specUnitPrice" label="单价RMB" width="300">
            <template slot="header" slot-scope="scope">
              单价RMB /
              <el-select class="attach-spec-unit" v-model="ruleForm.specUnitTxt" placeholder="请选择">
                <el-option v-for="item in specUnitList" :key="item.key" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <div class="attach-service-price">
                单件服务价格 <el-input-number :controls="false" :precision="2" v-model="scope.row.specUnitPrice" controls-position="right" :min="0"> </el-input-number><span class="attach-service-price-unit">{{ ruleForm.specUnitTxt }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.$index == tableData.length - 1" @click="addSpecHandle(scope.row, scope.$index)" type="text" size="small">添加</el-button>
              <el-button v-if="!(scope.$index == 0 && tableData.length == 1)" type="text" size="small" @click="delSpecHandle(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="attach-save-btn">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-form>
    <el-dialog title="选择规格(单选)" :visible.sync="dialogVisible" width="90%">
      <div>
        商品分类/子分类:
        <el-cascader clearable v-model="form.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 168px"></el-cascader>
        <el-button type="primary" @click="search">查找</el-button>
        <el-button class="float-right" type="primary" @click="$router.push('/serviceMerchant/channelGoods/goodsAttribute')">新建商品规格</el-button>
        <el-table class="goods-specs-list-table" border :data="goodsSpecsList" v-loading="tableLoading" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row @current-change="handleCurrentRow">
          <el-table-column align="center" label="规格编码" prop="specsCode" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" label="规格名称" prop="specsName" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" label="商品分类" prop="productCategoryName" show-overflow-tooltip>
            <template slot-scope="scope"> {{ scope.row.productCategoryName }} / {{ scope.row.subProductCategoryName }} </template>
          </el-table-column>
        </el-table>
        <!-- 全部分页 -->
        <div class="pagination-container text-align-right">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="currentSpecsOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsSpecs, productAdditionSpecListSpecUnit, productAdditionSpecSave, productAdditionSpecDetail } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { clone } from 'mathjs';
import goodsMixin from './goodsMixin';
import { cloneDeep } from 'lodash';
export default {
  mixins: [goodsMixin],
  data() {
    return {
      id: '',
      dialogVisible: false,
      specUnitList: [],
      goodsSpecsList: [],
      total: 0,
      form: {
        size: 10,
        current: 1,
        productCategoryId: '',
      },
      currentRow: '',
      tableData: [
        {
          specUnitPrice: '',
          specName: '',
          specQuantityMin: '',
          specQuantityMax: '',
        },
      ],
      ruleForm: {
        specType: 'SINGLE',
        templateName: '',
        specsName: '',
        specId: '',
        calcType: 'QUANTITY',
        specUnit: 'PIECE',
        specUnitTxt: '件',
      },
      rules: {
        templateName: [{ required: true, message: '请输入', trigger: 'blur' }],
        specsName: [{ required: true, message: '请选择', trigger: 'change' }],
        calcType: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  async created() {
    this.getSpecsPageList();
    let { data } = await productAdditionSpecListSpecUnit();
    this.specUnitList = data;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      productAdditionSpecDetail(this.id).then((res) => {
        let { templateName, calcType, specsName, specId } = res.data;
        let specUnit = res.data.specDetailDTOList[0].specUnit;
        this.ruleForm.templateName = templateName;
        this.ruleForm.calcType = calcType;
        this.ruleForm.specsName = specsName;
        this.ruleForm.specId = specId;
        this.ruleForm.specUnit = specUnit;
        this.ruleForm.specUnitTxt = this.specUnitList.filter((item) => item.key == specUnit)[0].name;
        this.tableData = res.data.specDetailDTOList;
      });
    }
  },
  methods: {
    //返回列表
    goBack() {
      this.$router.push({ path: '/serviceMerchant/channelGoods/goodsData', query: { tag: 'attach' } });
    },
    //新增规格
    addSpecHandle(row, index) {
      console.log(row, index);
      this.tableData.push({
        specUnitPrice: '',
        specName: '',
      });
    },
    //删除规格
    delSpecHandle(index) {
      console.log(index);
      this.tableData.splice(index, 1);
    },
    //修改单位
    specUnitChange(value) {
      this.ruleForm.specUnit = this.specUnitList.filter((item) => item.name == value)[0].key;
      console.log(this.ruleForm, 'this.ruleForm');
    },
    //校验
    tableDataValid() {
      let flag = true;
      if (this.ruleForm.calcType == 'QUANTITY') {
        for (var i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].specName || !this.tableData[i].specUnitPrice) {
            flag = false;
            this.$message({
              message: `请正确填写规格信息！`,
              type: 'warning',
              duration: 2000,
            });
            return;
          }
        }
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].specUnitPrice || !this.tableData[i].specQuantityMin || !this.tableData[i].specQuantityMax) {
            flag = false;
            this.$message({
              message: `请正确填写规格信息！`,
              type: 'warning',
              duration: 2000,
            });
            return;
          }
        }
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].specQuantityMax - this.tableData[i].specQuantityMin < 0) {
            flag = false;
            this.$message({
              message: `数量区间值不正确，请检查！`,
              type: 'warning',
              duration: 2000,
            });
            return;
          }
        }
        for (var i = 0; i < this.tableData.length - 1; i++) {
          //重叠判断，-1代表最后一个不进行判断
          if (this.tableData[i].specQuantityMax - this.tableData[i + 1].specQuantityMin >= 0) {
            flag = false;
            this.$message({
              message: `数量区间不正确，请检查！`,
              type: 'warning',
              duration: 2000,
            });
            return;
          }
        }
      }
      return flag;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tableDataValid()) {
            console.log(this.tableData, 'this.tableData');
            let ruleFormHandle = cloneDeep(this.ruleForm);
            ruleFormHandle.specDetailVOList = this.tableData.map((item) => {
              item.specUnit = this.ruleForm.specUnit;
              return item;
            });
            if (this.id) ruleFormHandle.id = this.id;
            productAdditionSpecSave(ruleFormHandle).then((res) => {
              this.$message({
                message: `操作成功！`,
                type: 'success',
                duration: 2000,
              });
              this.goBack();
            });
          } else {
            return false;
          }
          console.log(this.ruleForm, this.tableData, 'valid');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //选中行
    handleCurrentRow(val) {
      this.currentRow = val;
    },
    //确定选中
    currentSpecsOk() {
      if (!this.currentRow)
        return this.$message({
          message: `请选择一条规格！`,
          type: 'warning',
          duration: 2000,
        });
      this.ruleForm.specId = this.currentRow.specsCode;
      this.ruleForm.specsName = this.currentRow.specsName;
      this.dialogVisible = false;
      console.log(this.currentRow, 'this.currentRow');
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.size = val;
      this.getSpecsPageList();
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getSpecsPageList();
    },
    //查找
    search() {
      this.searchFlag = true;
      this.form.current = 1;
      this.getSpecsPageList();
    },
    //获取规格列表
    getSpecsPageList() {
      this.tableLoading = true;
      let data = this.form;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      console.log(this.form, 'this.form123', this.form.productCategoryId);
      if (this.form.productCategoryId) {
        data.productCategoryId = Array.isArray(this.form.productCategoryId) ? this.form.productCategoryId[this.form.productCategoryId.length - 1] : this.form.productCategoryId;
      }
      getGoodsSpecs(data)
        .then((res) => {
          this.goodsSpecsList = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.attach-spesc-warp {
  background-color: #fff;
  min-height: 768px;

  .w300 {
    width: 300px;
  }

  .attach-spec-unit {
    ::v-deep .el-input {
      width: 80px;
    }
  }
}

.additional-spec-table {
  margin: 10px 20px;

  ::v-deep td .el-input {
    width: 150px;
  }
}

.goods-specs-list-table {
  margin: 20px 0;
  cursor: pointer;
  ::v-deep .el-table__row {
    td:first-child ::before {
      content: '';
      border: 1px solid #dcdfe6;
      width: 14px;
      height: 14px;
      position: absolute;
      left: 15px;
      top: 17px;
      border-radius: 2px;
      line-height: 12px;
    }
  }
  ::v-deep .current-row {
    td:first-child ::before {
      content: '✓';
      border-color: #409eff;
      background: #409eff;
      color: #fff;
    }
  }
}

.attach-service-price {
  position: relative;
  width: 200px;

  ::v-deep .el-input-number {
    width: 100px;
    margin-left: 5px;

    .el-input {
      width: 100px;
    }
  }
}

.attach-service-price-unit {
  position: absolute;
  right: 0;
  top: 5px;
}

.attach-quantity-range {
  width: 300px;
}

.table-container {
  padding-right: 50px;
}

.attach-save-btn {
  text-align: center;
  padding: 30px;
}
</style>
