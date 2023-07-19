<template>
  <div>
    <!-- 查询条件 -->
    <div class="header-container">
      <div class="search-box" ref="searchBox">
        <el-form ref="searchForm" inline label-width="130px" style="display: flex; flex-wrap: warp; justify-content: space-between">
          <span>
            <el-form-item label="商标分类/子分类" v-if="tabIndex == 0">
              <el-cascader clearable v-model="form.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 168px"></el-cascader>
            </el-form-item>
            <el-form-item label="规格名称" v-if="tabIndex == 0">
              <el-input v-model="form.specsName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" v-if="tabIndex == 0">
              <el-date-picker
                v-model="form.createTime"
                type="datetimerange"
                align="right"
                size="small"
                clearable
                unlink-panels
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 340px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="分组名称" v-if="tabIndex == 1">
              <el-input v-model="form.name" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button icon="el-icon-refresh" @click="resetSearch">重置</el-button>
            </el-form-item>
          </span>
          <el-form-item style="white-space: nowrap">
            <el-button type="success" @click="enterGoodsAttribute" v-show="hasAuthority('GC_5')"> <i class="icon icon-adds"></i> 商品属性管理 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="subClassList" v-loading="tableLoading" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="规格编码" prop="specsCode" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="规格名称" prop="specsName" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="商品分类" prop="productCategoryName" show-overflow-tooltip>
          <template slot-scope="scope"> {{ scope.row.productCategoryName }} / {{ scope.row.subProductCategoryName }} </template>
        </el-table-column>
        <el-table-column align="center" label="规格别名" prop="productCategoryName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="goods-specification-alias" @click="specificationAlias(scope.row)">{{ scope.row.specsAlias ? scope.row.specsAlias : '这里可以自定义规格名称' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="关联规格" prop="subSpecsCode">
          <template slot-scope="scope">
            {{ scope.row.subSpecsList.map((item) => item.specsName).join('，') }}
            <el-tooltip class="sub-specs-code" effect="dark" content="关联规格" placement="top"><i class="el-icon-link" @click="edit(scope.row)"></i> </el-tooltip>
            <el-tooltip content="取消关联" placement="top" v-if="scope.row.subSpecsList.length">
              <el-link type="primary" :underline="false" @click="cancelRelation(scope.row)" v-show="hasAuthority('GC_10')">
                <i class="icon icon-del"></i>
                <!-- 删除 -->
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否支持续费" prop="isSupportRenew" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isSupportRenew == 'IS_SUPPORT_RENEW' ? true : false" @change="(val) => renewChange(val, scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" v-show="hasAuthority('GC_6')" @click="editSpecification(scope.row.productCategoryId)"> </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 全部分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!-- 关联规格 -->
    <el-dialog :visible.sync="addSubClassDialogVisible" title="选择关联规格" width="800px" @close="closeAddSubDialog" destroy-on-close>
      <el-form :model="addSubClassForm" ref="addSubClassForm" label-width="120px">
        <!-- <el-form-item label="分组名称" prop="name">
          <el-input v-model="addSubClassForm.name" placeholder="分组名称" style="width: 168px" />
        </el-form-item> -->
        <el-form-item label="商标分类/子分类" v-if="tabIndex == 0">
          <el-cascader clearable v-model="addSubClassForm.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 168px"></el-cascader> <el-button type="primary" icon="el-icon-search" @click="addSubSearch">搜索</el-button>
        </el-form-item>
        <div class="specs-current">
          已选择：<template v-if="selectList.length"
            ><el-tag v-for="(tag, index) in selectList" :key="tag.specsCode" closable @close="specsHandleClose(index)">
              {{ tag.specsName }}
            </el-tag>
          </template>
        </div>
        <div class="table-container-spec">
          <el-table class="gs-custom-grouping" border :data="specListPop" v-loading="tableLoading" ref="multipleTable" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @select="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column align="center" label="序号" width="70">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="规格编码" prop="specsCode" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" label="规格名称" prop="specsName" show-overflow-tooltip> </el-table-column>
            <el-table-column align="center" label="商品分类" prop="productCategoryName" show-overflow-tooltip> </el-table-column>
          </el-table>
        </div>
        <!-- 全部分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChangePop"
            @current-change="handleCurrentChangePop"
            :current-page.sync="specPagePop.current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="specPagePop.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="specPagePop.total"
          ></el-pagination>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubClassConfirm">确 定</el-button>
        <el-button @click="addSubClassDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTradeMarkConditionList, getTradeMarkSubCateGory, addSubCateGory, updateSubCateGory, deleteSubCateGory, categoryImportFile } from '@/api/newApi/servicemerchant/trademark.js';
import { getGoodsSpecs, getGoodsCategory, addSpecs, getSpecsPage, productBaseCombinationSpecsEdit, productBaseCombinationSpecsDel, productBaseSpecsEdit } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import util from '@/utils/util.js';
import { cloneDeep, difference, uniq } from 'lodash';
import goodsMixin from './../goodsMixin';
const validateCN = (rule, value, callback) => {
  let reg = /^[\u4e00-\u9fa5]+$/;
  if (!reg.test(value)) {
    callback(new Error('请输入中文'));
  } else {
    callback();
  }
};
const validateEN = (rule, value, callback) => {
  if (/[\u4E00-\u9FA5]/g.test(value)) {
    callback(new Error('请输入英文'));
  } else {
    callback();
  }
};
export default {
  mixins: [goodsMixin],
  data() {
    return {
      total: 0,
      tableLoading: false,
      activeName: 'first',
      form: {
        size: 10,
        current: 1,
        createTime: '',
        productCategoryId: '',
        specsName: '',
      },
      addSubClassForm: {
        productCategoryId: [],
      },
      copyAddSubClassForm: { ...this.addSubClassForm },
      selectList: [],
      classList: [],
      subClassList: [],
      splaceClassList: [],
      serviceCascader: [],
      countrySelectList: [],
      addSubClassDialogVisible: false,
      searchFlag: false,
      checkId: 0,
      checkRow: '',
      exportLoading: false,
      tabIndex: 0,
      specListPop: [],
      specPagePop: {
        size: 10,
        current: 1,
        total: 0,
      },
    };
  },
  created() {
    this._getCountrySelectList();
    this.getClassList();
    this.getSubClassList();
    this.getSubClassListPop();
  },
  methods: {
    //自定义规格别名
    specificationAlias(row) {
      this.$prompt('请输入', '规格别名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputValue: row.specsAlias,
        inputErrorMessage: '请输入规格别名',
      })
        .then(({ value }) => {
          productBaseSpecsEdit({ ...row, specsAlias: value }).then((res) => {
            this.$message({
              message: `操作成功`,
              type: 'success',
              duration: 2000,
            });
            this.getSubClassList();
          });
        })
        .catch(() => {});
    },
    //是否续费切换
    renewChange(val, row) {
      console.log(val, row);
      this.$confirm('您确定修改此规格续费设置吗？', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      })
        .then(() => {
          productBaseSpecsEdit({ ...row, isSupportRenew: val ? 'IS_SUPPORT_RENEW' : 'NOT_SUPPORT_RENEW' }).then((res) => {
            this.$message({
              message: `操作成功`,
              type: 'success',
              duration: 2000,
            });
            this.getSubClassList();
          });
        })
        .catch(() => {
          row;
        });
    },
    //组合规格处理
    productSpecssHD(row) {
      let specsTxt = row.productSpecss.map((item) => item.specsName);
      return specsTxt.join('，');
    },

    handleClick(tab) {
      this.tabIndex = tab.index;
      this.resetSearch();
    },

    getClassList() {
      getTradeMarkConditionList().then((res) => {
        this.classList = res.data;
      });
    },
    //弹窗规格列表
    addSubSearch() {
      this.specPagePop.current = 1;
      this.getSubClassListPop();
    },
    getSubClassListPop() {
      this.tableLoading = true;
      getGoodsSpecs({ ...this.specPagePop, productCategoryId: this.addSubClassForm.productCategoryId && (this.addSubClassForm.productCategoryId.length ? this.addSubClassForm.productCategoryId[1] : '') })
        .then((res) => {
          this.specListPop = res.data.records;
          this.specPagePop.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.specsRowSelection();
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    getSubClassList() {
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
      if (data.createTime && data.createTime.length) {
        data.startTime = data.createTime[0];
        data.endTime = data.createTime[1];
      } else {
        data.startTime = '';
        data.endTime = '';
      }
      getGoodsSpecs(data)
        .then((res) => {
          this.subClassList = res.data.records;
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
    getSpecsPageList() {
      this.tableLoading = true;
      let data = this.form;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      getSpecsPage(data)
        .then((res) => {
          this.splaceClassList = res.data.records;
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
    enterGoodsAttribute() {
      this.$router.push({
        name: 'goodsAttribute',
        params: {},
      });
    },
    search() {
      this.searchFlag = true;
      this.form.current = 1;
      if (this.tabIndex == 0) {
        this.getSubClassList();
      } else {
        this.getSpecsPageList();
      }
    },
    resetSearch() {
      this.searchFlag = true;
      this.form = {
        size: 10,
        current: 1,
        createTime: '',
        productCategoryId: '',
        specsName: '',
      };
      if (this.tabIndex == 0) {
        this.getSubClassList();
      } else {
        this.getSpecsPageList();
      }
    },
    //弹窗重置
    resetSearchPop() {
      this.specPagePop = {
        size: 10,
        current: 1,
        total: 0,
      };
      this.getSubClassListPop();
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.size = val;
      if (this.tabIndex == 0) {
        this.getSubClassList();
      } else {
        this.getSpecsPageList();
      }
    },
    handleCurrentChange(val) {
      this.form.current = val;
      if (this.tabIndex == 0) {
        this.getSubClassList();
      } else {
        this.getSpecsPageList();
      }
    },
    //关联规格弹窗分页
    handleSizeChangePop(val) {
      this.specPagePop.size = val;
      this.getSubClassListPop();
    },
    handleCurrentChangePop(val) {
      this.specPagePop.current = val;
      this.getSubClassListPop();
    },
    closeAddSubDialog() {
      this.addSubClassForm = { ...this.copyAddSubClassForm };
      this.checkId = 0;
      this.checkRow = '';
    },
    //关联规格弹窗选择
    handleSelectionChange(selection, row) {
      console.log(selection, row, 99);
      if (this.selectList.filter((item) => item.specsCode == row.specsCode).length) {
        this.selectList = this.selectList.filter((item) => item.specsCode != row.specsCode);
      } else {
        this.selectList.push(row);
      }
    },
    specsHandleClose(index) {
      this.selectList.splice(index, 1);
      this.specsRowSelection();
      // console.log(this.selectList, 'this.selectList');
      // this.$refs.multipleTable.clearSelection();
      // this.$nextTick(() => {
      //   this.selectList.forEach((row) => {
      //     this.$refs.multipleTable.toggleRowSelection(row);
      //   });
      // });
      // this.$nextTick(() => {

      // });
    },
    //关联规格选中状态回显
    specsRowSelection() {
      let selectListHD = cloneDeep(this.selectList).map((item) => item.specsCode);
      this.$refs.multipleTable.clearSelection();
      this.specListPop.forEach((row) => {
        if (selectListHD.includes(row.specsCode)) {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          });
        }
      });
    },
    //编辑规格
    editSpecification(productCategoryId) {
      console.log(productCategoryId, 'productCategoryId');
      this.$router.push({
        name: 'goodsAttribute',
        params: {
          id: productCategoryId,
        },
      });
    },
    /**
     * 编辑关联规格
     */
    edit(row) {
      this.selectList = row.subSpecsList.length ? row.subSpecsList : [];
      this.resetSearchPop();
      this.checkId = row.id;
      this.checkRow = row;
      this.addSubClassDialogVisible = true;
    },
    //取消规格关联
    cancelRelation(row) {
      this.$confirm('确定取消规格关联？', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        productBaseSpecsEdit({ ...row, subSpecsCode: [] }).then((res) => {
          this.$message({
            message: `操作成功`,
            type: 'success',
            duration: 2000,
          });
          this.addSubClassDialogVisible = false;
          this.getSubClassList();
        });
      });
    },
    /**
     * 删除
     */
    del(id) {
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        productBaseCombinationSpecsDel({
          id: id,
        }).then((res) => {
          if (res.code === 0) {
            if (this.tabIndex == 0) {
              this.getSubClassList();
            } else {
              this.getSpecsPageList();
            }
          }
        });
      });
    },
    addSubClassConfirm() {
      if (this.selectList.length == 0) {
        this.$message({
          message: '请检选择规格',
          type: 'warning',
        });
      } else {
        productBaseSpecsEdit({ ...this.checkRow, subSpecsCode: this.selectList.map((item) => item.specsCode) }).then((res) => {
          this.$message({
            message: `操作成功`,
            type: 'success',
            duration: 2000,
          });
          this.addSubClassDialogVisible = false;
          this.getSubClassList();
        });
      }
    },
    addOrUpdateSuccess() {
      this.$message.success('操作成功');
      this.addSubClassDialogVisible = false;
      this.resetAddSubClassDialog();
      if (this.tabIndex == 0) {
        this.getSubClassList();
      } else {
        this.getSpecsPageList();
      }
    },
    resetAddSubClassDialog() {
      this.addSubClassForm = { ...this.copyAddSubClassForm };
    },
    _import() {
      this.$router.push({
        name: 'trademarkSubclassImport',
      });
    },
    _export() {
      this.exportLoading = true;
      categoryImportFile({
        parentNums: this.form.parentNums.join(','),
        countryCodes: this.form.countryCodes.join(','),
        subCategoryName: this.form.subCategoryName,
      }).then((res) => {
        this.exportLoading = false;
        util.exportExcel(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.yellow-btn {
  color: #fff !important;
}

.gs-custom-grouping {
  th .el-checkbox {
    display: none;
  }
}
.goods-specification-alias,
.sub-specs-code {
  color: #409eff;
  cursor: pointer;
}
.sub-specs-code {
  font-size: 18px;
  position: relative;
  top: 3px;
}
.table-container-spec {
  padding: 10px 0;
}
.specs-current {
  span {
    margin-right: 5px;
  }
}
</style>
