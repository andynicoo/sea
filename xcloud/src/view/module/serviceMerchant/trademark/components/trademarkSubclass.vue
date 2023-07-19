<template>
  <div>
    <!-- 查询条件 -->
    <div class="header-container" style="padding-top: 0">
      <div class="search-box" ref="searchBox">
        <el-form ref="searchForm" inline label-width="100px" style="display: flex; flex-wrap: warp; justify-content: space-between">
          <span>
            <el-form-item label="商标分类">
              <el-select style="width: 168px" v-model="form.parentNums" multiple clearable filterable>
                <el-option :label="item.categoryName" :value="item.categoryNum" v-for="item in classList" :key="item.categoryNum"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="小类名称">
              <el-input v-model="form.subCategoryName" placeholder="请输入小类名称" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="国家">
              <el-select style="width: 168px" v-model="form.countryCodes" clearable filterable placeholder="请选择">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
          </span>
          <el-form-item style="white-space: nowrap">
            <el-button type="primary" v-if="activeName === '0'" @click="batchConfirmSubCategoryFn" v-show="hasAuthority('D1_36')"> 批量确认商标小类 </el-button>
            <el-button type="success" @click="batchDelSubCategoryFn" v-show="hasAuthority('D1_35')"> 批量删除商标小类 </el-button>
            <el-button type="success" @click="addSubClassDialogVisible = true" v-show="hasAuthority('D1_22')"> <i class="icon icon-adds"></i> 新增分类 </el-button>
            <el-button type="primary" @click="_import()" v-show="hasAuthority('D1_23')"> <i class="icon icon-import"></i> 导入 </el-button>
            <el-button class="yellow-btn" :loading="exportLoading" @click="_export()" v-show="hasAuthority('D1_24')"> <i class="icon icon-export"></i> 导出 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-tabs v-model="activeName" ref="elTabs" @tab-click="handleClick">
        <el-tab-pane label="已确认" name="1"> </el-tab-pane>
        <el-tab-pane label="未确认" name="0"> </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="subClassList" v-loading="tableLoading" @selection-change="handleSelectionChange" ref="table" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商标分类" prop="parentMarkName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="商标小类(中文)" prop="categoryName" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="form.countryCodes !== 'CN'" align="center" label="商标小类(英文)" prop="categoryNameEn" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="form.countryCodes === 'JP'" align="center" label="商标小类(日文)" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.categoryNameJp || '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="form.countryCodes === 'DE'" align="center" label="商标小类(德文)" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.categoryNameMore || '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="form.countryCodes === 'KR'" align="center" label="商标小类(韩文)" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.categoryNameMore || '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="form.countryCodes.includes('JP')" align="center" label="类似群组" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.similarGroup || '--' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家" prop="countryName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="创建人" prop="createName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="edit(scope.row)" v-show="hasAuthority('D1_25')"> </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link type="info" class="icon icon-del" :underline="false" @click="del(scope.row.id)" v-show="hasAuthority('D1_26')"> </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/编辑子分类 -->
    <el-dialog :visible.sync="addSubClassDialogVisible" :title="(checkId ? '编辑' : '新增') + '子分类'" width="392px" @close="closeAddSubDialog">
      <el-form :model="addSubClassForm" ref="addSubClassForm" :rules="addSubClassRules" label-width="120px">
        <el-form-item label="国家" prop="countryCode">
          <el-select style="width: 168px" v-model="addSubClassForm.countryCode" clearable filterable placeholder="请选择">
            <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商标分类" prop="parentCategoryNum">
          <el-select style="width: 168px" v-model="addSubClassForm.parentCategoryNum" clearable filterable placeholder="请选择">
            <el-option v-for="item in classList" :key="item.id" :value="item.categoryNum" :label="item.categoryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商标小类(中文)" prop="categoryName">
          <el-input v-model="addSubClassForm.categoryName" placeholder="请输入商标分类" style="width: 168px" />
        </el-form-item>
        <el-form-item label="商标小类(英文)" prop="categoryNameEn" v-if="addSubClassForm.countryCode !== 'CN'">
          <el-input v-model="addSubClassForm.categoryNameEn" placeholder="请输入商标分类" style="width: 168px" />
        </el-form-item>
        <template v-if="addSubClassForm.countryCode == 'JP'">
          <el-form-item label="商标小类(日文)" prop="categoryNameJp">
            <el-input v-model="addSubClassForm.categoryNameJp" placeholder="请输入商标小类日文名称" style="width: 168px" />
          </el-form-item>
          <el-form-item label="类似群组" prop="similarGroup">
            <el-input v-model="addSubClassForm.similarGroup" placeholder="请输入商标小类类似群组" style="width: 168px" />
          </el-form-item>
        </template>
        <el-form-item label="商标小类(德文)" prop="categoryNameMore" v-if="addSubClassForm.countryCode == 'DE'">
          <el-input v-model="addSubClassForm.categoryNameMore" placeholder="请输入商标小类德文名称" style="width: 168px" />
        </el-form-item>
        <el-form-item label="商标小类(韩文)" prop="categoryNameMore" v-if="addSubClassForm.countryCode == 'KR'">
          <el-input v-model="addSubClassForm.categoryNameMore" placeholder="请输入商标小类韩文名称" style="width: 168px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubClassConfirm">确 定</el-button>
        <el-button @click="addSubClassDialogVisible = false">取 消</el-button>
        <div style="margin-top: 10px" v-if="activeName === '0'">确认后该小类将显示在“已确认”栏目，并显示在客户端</div>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getTradeMarkConditionList, getTradeMarkSubCateGory, addSubCateGory, updateSubCateGory, deleteSubCateGory, categoryImportFile, batchDelSubCategory, batchAuditSubCategory } from '@/api/newApi/servicemerchant/trademark.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import util from '@/utils/util.js';
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
  data() {
    return {
      total: 0,
      tableLoading: false,
      form: {
        countryCodes: 'US',
        limit: 10,
        page: 1,
        parentNums: [],
        subCategoryName: '',
      },
      addSubClassForm: {
        categoryName: '',
        categoryNameEn: '',
        countryCode: '',
        parentCategoryNum: '',
        categoryNameJp: '',
        categoryNameMore: '',
        similarGroup: '',
      },
      copyAddSubClassForm: { ...this.addSubClassForm },
      addSubClassRules: {
        parentCategoryNum: [{ required: true, message: '请选择商标分类', trigger: 'blur' }],
        categoryName: [{ required: true, message: '请填写商标小类(中文)', trigger: 'blur' }],
        categoryNameEn: [
          { required: true, message: '请填写商标小类(英文)', trigger: 'blur' },
          { validator: validateEN, trigger: 'blur' },
        ],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
      },
      classList: [],
      subClassList: [],
      countrySelectList: [],
      addSubClassDialogVisible: false,
      searchFlag: false,
      checkId: 0,
      exportLoading: false,
      checkIds: [],
      activeName: '1',
    };
  },
  watch: {
    'addSubClassForm.countryCode': {
      immediate: true,
      handler(val) {
        if (['JP'].find((item) => item == val)) {
          this.addRule('categoryName', []);
          this.addRule('categoryNameEn', []);
        } else if (['DE'].find((item) => item == val)) {
          this.addRule('categoryNameMore', [{ required: true, message: '请填写商标小类(德文)', trigger: 'blur' }]);
        } else if (['KR'].find((item) => item == val)) {
          this.addRule('categoryNameMore', [{ required: true, message: '请填写商标小类(韩文)', trigger: 'blur' }]);
        } else {
          this.addRule('categoryName', [{ required: true, message: '请填写商标小类(中文)', trigger: 'blur' }]);
          this.addRule('categoryNameEn', [
            { required: true, message: '请填写商标小类(英文)', trigger: 'blur' },
            { validator: validateEN, trigger: 'blur' },
          ]);
        }
      },
    },
  },
  created() {
    this._getCountrySelectList();
    this.getClassList();
    this.getSubClassList();
  },
  methods: {
    addRule(prop, rule) {
      this.$set(this.addSubClassRules, prop, rule);
    },
    getClassList() {
      getTradeMarkConditionList().then((res) => {
        this.classList = res.data;
      });
    },
    handleClick() {
      this.$util.interruptRequest();
      this.getSubClassList();
    },
    getSubClassList() {
      setTimeout(() => {
        this.tableLoading = true;
      });
      getTradeMarkSubCateGory({
        ...this.form,
        parentNums: this.form.parentNums.join(','),
        countryCodes: this.form.countryCodes,
        status: this.activeName - 0,
      })
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
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getSubClassList();
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.id);
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getSubClassList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getSubClassList();
    },
    closeAddSubDialog() {
      this.addSubClassForm = { ...this.copyAddSubClassForm };
      this.checkId = 0;
    },
    /**
     * 编辑
     */
    edit(row) {
      const { categoryName, categoryNameEn, countryCode, parentCategoryNum, categoryNameJp, similarGroup } = row;
      this.addSubClassForm = {
        categoryName,
        categoryNameEn,
        countryCode,
        parentCategoryNum,
        categoryNameJp,
        similarGroup,
      };
      this.checkId = row.id;
      this.addSubClassDialogVisible = true;
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
        deleteSubCateGory({
          categoryId: id,
        }).then((res) => {
          if (res.code === 0) {
            this.getSubClassList();
          }
        });
      });
    },
    addSubClassConfirm() {
      this.$refs['addSubClassForm'].validate((valid) => {
        if (valid) {
          if (this.checkId) {
            // 确认编辑
            updateSubCateGory({
              ...this.addSubClassForm,
              id: this.checkId,
            }).then((res) => {
              if (res.code === 0) {
                this.addOrUpdateSuccess();
              }
            });
          } else {
            // 确认新增
            addSubCateGory(this.addSubClassForm).then((res) => {
              if (res.code === 0) {
                this.addOrUpdateSuccess();
              }
            });
          }
        } else {
          this.$message({
            message: '请检查输入的数据',
            type: 'warning',
          });
        }
      });
    },
    addOrUpdateSuccess() {
      this.$message.success('操作成功');
      this.addSubClassDialogVisible = false;
      this.resetAddSubClassDialog();
      this.getSubClassList();
    },
    resetAddSubClassDialog() {
      this.addSubClassForm = { ...this.copyAddSubClassForm };
    },
    batchConfirmSubCategoryFn() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择商标小类');
        return;
      }
      this.$confirm('确认已检查选中的商标小类的信息，确认后将同步显示在客户端？', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        batchAuditSubCategory({
          ids: this.checkIds,
        }).then((res) => {
          if (res.code === 0) {
            this.getSubClassList();
          }
        });
      });
    },
    batchDelSubCategoryFn() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择商标小类');
        return;
      }
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        batchDelSubCategory({
          categoryIds: this.checkIds.join(','),
        }).then((res) => {
          if (res.code === 0) {
            this.getSubClassList();
          }
        });
      });
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
        countryCodes: Array.isArray(this.form.countryCodes) ? this.form.countryCodes.join(',') : this.form.countryCodes,
        subCategoryName: this.form.subCategoryName,
        ids: this.checkIds.join(','),
      }).then((res) => {
        this.exportLoading = false;
        util.exportExcel(res);
      });
    },
  },
};
</script>

<style>
.yellow-btn {
  color: #fff !important;
}
</style>
