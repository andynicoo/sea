<!-- 首页推荐  -->
<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader>
          <template slot="left">
            <el-radio-group size="medium" v-model="activeName" @input="handleCurrentChange(1)">
              <el-radio-button :label="tab.value" v-for="tab in tabs" :key="tab.value">{{ tab.label }}</el-radio-button>
            </el-radio-group>
          </template>
          <template slot="right">
            <el-button type="primary" @click="exportData" v-show="hasAuthority('R2_1')">导出</el-button>
            <el-button type="primary" @click="importDataDialog = true" v-show="hasAuthority('R2_2')">导入</el-button>
            <el-button type="primary" @click="answerDialog = true" v-show="hasAuthority('R2_3')">新增答案</el-button>
            <el-button type="primary" @click="addData" v-show="hasAuthority('R2_4')">新增合规项</el-button>
          </template>
        </SiteSettingsModularHader>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <el-form :model="{ list: list }" ref="form" id="form">
        <el-table ref="table" border :data="list" :height="tableHeight" v-loading="tableLoading" highlight-current-row element-loading-spinner="icon loading" element-loading-text="拼命加载中">
          <Empty slot="empty" />
          <el-table-column align="center" label="*国家" prop="countryZh">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.countryZh'" :rules="baseRule">
                <el-select v-model="row.countryZh" filterable :disabled="!row.isEdit">
                  <el-option v-for="(item, index) in countryList" :key="index" :label="item.countryNameZh" :value="item.countryNameZh"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="*合规项" prop="complianceItem">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.complianceItem'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                <el-input v-model="row.complianceItem" clearable :disabled="!row.isEdit" :maxlength="15"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="*优先级" prop="priority">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.priority'" :rules="baseRule">
                <el-select v-model="row.priority" :disabled="!row.isEdit">
                  <el-option :value="1" label="强制"></el-option>
                  <el-option :value="2" label="非强制"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合规标识/证书示例" prop="authenticationMark">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.authenticationMark'">
                <UploadFileUrl :drag="false" accept=".jpeg,.jpg,.tiff,.raw,.bmp,.gif,.png" :maxSize="100" :fileList.sync="row.authenticationMark" listType="picture-card" :disabled="!row.isEdit"> </UploadFileUrl>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="*产品推荐" prop="productImage">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.productImage'">
                <div v-if="isVaildId(row.productId)">
                  <span>{{ row.product }}</span>
                  <span class="icon icon-close" @click="clearProduct(row)" v-if="row.isEdit"></span>
                </div>
                <template v-else>
                  <el-link type="primary" :underline="false" @click="addGoods(row, $index)" :disabled="!row.isEdit" v-if="!row.productImage">+添加商品</el-link>
                  <el-link type="primary" :underline="false" v-show="!row.productImage" :disabled="!row.isEdit" @click="addImage($index)">+添加图片</el-link>
                  <UploadFileUrl :class="row.productImage ? '' : 'hidden-image-upload'" :drag="false" accept=".jpeg,.jpg,.tiff,.raw,.bmp,.gif,.png" :maxSize="100" :fileList.sync="row.productImage" listType="picture-card" :disabled="!row.isEdit">
                    <div slot="uploadBtn" style="margin-left: 10px">
                      <el-link type="primary" :underline="false" :ref="`uploadImage${$index}`">+添加图片</el-link>
                    </div>
                  </UploadFileUrl>
                </template>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="链接名称" prop="urlName">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.urlName'">
                <el-input v-model="row.urlName" clearable :disabled="!row.isEdit"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="链接" prop="url">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.url'" :rules="{ pattern: /^http(s)?:\/\/(.)+$/, message: '链接格式错误', trigger: 'blur' }">
                <el-input v-model="row.url" clearable :disabled="!row.isEdit"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="remark">
            <template slot-scope="{ row, $index }">
              <el-form-item :prop="'list.' + $index + '.remark'">
                <el-input v-model="row.remark" clearable :disabled="!row.isEdit" :maxlength="100"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="*配置关系" prop="operateName">
            <template slot-scope="{ row, $index }">
              <el-link type="primary" :underline="false" v-if="!row.isEdit" @click="relationDetail(row, $index)">详情</el-link>
              <el-link type="primary" :underline="false" v-else @click="relationDetail(row, $index)">+添加</el-link>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="180px">
            <template slot-scope="{ row, $index }">
              <el-link type="primary" :underline="false" v-if="!row.isEdit" @click="editItem(row)" v-show="hasAuthority('R2_5')">编辑</el-link>
              <template v-else>
                <el-link type="primary" :underline="false" @click="cancel(row, $index)">取消</el-link>
                <el-link type="primary" :underline="false" @click="saveItem(row, $index)">保存</el-link>
              </template>
              <el-link type="primary" :underline="false" @click="delItem(row, $index)" v-show="hasAuthority('R2_6')">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- pagination -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <AnswerDialog :answerDialog.sync="answerDialog" />
    <ImportDataDialog :importDataDialog.sync="importDataDialog" :type="activeName" @refresh="getList" />
    <RelationDialog :relationDialog.sync="relationDialog" :checkRow="checkRow" @saveRule="saveRule" />
    <AddGoodsDialog :addGoodsDialog.sync="addGoodsDialog" :clientList="['APPLET']" @selectProduct="selectProduct" :limit="1"></AddGoodsDialog>
  </div>
</template>

<script>
import SiteSettingsModularHader from '../components/siteSettingsModularHader.vue';
import * as comps from './components/index';
import AddGoodsDialog from '@/view/module/extension/activityManagement/components/addGoodsDialog';
import UploadFileUrl from '@/components/UploadFileUrl';
import { searchPage, searchSave, searchDel, ruleSave, searchDownload } from '@/api/newApi/siteSettings/testingTool';
import { getCountrySelectList } from '@/api/newApi/common.js';
export default {
  data() {
    return {
      tabs: [
        { label: 'VAT', value: '1' },
        { label: 'EPR', value: '2' },
        { label: '认证检测', value: '3' },
        { label: '授权代表', value: '4' },
      ],
      activeName: '1',
      form: {
        current: 1,
        size: 10,
      },
      baseRule: { required: true, message: '请选择', trigger: 'blur' },
      tableLoading: false,
      listTotal: 0,
      list: [],
      countryList: [],
      answerDialog: false,
      importDataDialog: false,
      relationDialog: false,
      addGoodsDialog: false,
      row: {},
      checkRow: {},
      checkIndex: 0,
    };
  },
  components: {
    SiteSettingsModularHader,
    ...comps,
    AddGoodsDialog,
    UploadFileUrl,
  },
  mounted() {
    this.getList();
    this.getCountryList();
  },
  methods: {
    addImage(index) {
      this.$refs[`uploadImage${index}`].$el.click();
    },
    getList() {
      searchPage({
        ...this.form,
        type: this.activeName - 0,
      }).then((res) => {
        res.data.records.forEach((item) => {
          item.isEdit = false;
        });
        this.list = res.data.records;
        this.listTotal = res.data.total - 0;
      });
    },
    /** 获取国家下拉框数据 */
    getCountryList() {
      getCountrySelectList().then((res) => {
        this.countryList = res.data;
      });
    },
    // 导出
    exportData() {
      searchDownload({
        type: this.activeName,
      }).then((res) => {
        this.$util.exportExcel(res, '合规列表');
      });
    },
    // 新增合规项
    addData() {
      this.list.push({
        type: this.activeName,
        countryZh: '',
        complianceItem: '',
        priority: '',
        authenticationMark: '',
        product: '',
        productId: '',
        productImage: '',
        productType: '',
        urlName: '',
        url: '',
        remark: '',
        isEdit: true,
      });
    },
    // 查看/添加关系
    relationDetail(row, index) {
      this.checkRow = row;
      this.checkIndex = index;
      this.relationDialog = true;
    },
    // 保存规则
    saveRule(rule) {
      this.list[this.checkIndex].rule = rule;
    },
    // 发布规则
    publishRule(row, searchNo) {
      if (row.rule && row.rule.length) {
        ruleSave({
          complianceRuleList: row.rule.map((item) => ({
            ...item,
            searchNo,
            version: 0,
          })),
          searchNo,
          version: 0,
        });
      }
    },
    // 操作编辑
    editItem(row) {
      if (row.searchNo) {
        this.row[row.searchNo] = JSON.parse(JSON.stringify(row));
        row.isEdit = true;
      }
    },
    // 取消
    cancel(row, index) {
      // 已有的数据
      if (row.searchNo) {
        this.$set(this.list, index, {
          ...JSON.parse(JSON.stringify(this.row[row.searchNo])),
          isEdit: false,
        });
      } else {
        // 删除未保存的数据
        this.list.splice(index, 1);
      }
    },
    validateField(index) {
      let result = true;
      let props = ['countryZh', 'complianceItem', 'priority'].map((item) => `list.${index}.${item}`);
      this.$refs.form.validateField(props, (error) => {
        if (error !== '') {
          result = false;
        }
      });
      return result;
    },
    // 操作保存
    saveItem(row, index) {
      let isValid = this.validateField(index);
      if (isValid) {
        if (!this.isVaildId(row.productId) && !row.productImage) {
          this.$message.warning('请上传产品推荐');
          return;
        }
        let { rule, ...data } = row;
        searchSave({
          ...data,
          productType: !this.isVaildId(row.productId) && row.productImage ? 2 : row.productType,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('保存成功');
            row.isEdit = false;
            this.listTotal += 1;
            if (!row.searchNo) {
              this.publishRule(row, res.data);
            }
            row.searchNo = res.data;
          }
        });
      }
    },
    isVaildId(id) {
      return id && id !== '0';
    },
    // 操作删除
    delItem(row, index) {
      if (!row.searchNo) {
        this.list.splice(index, 1);
        this.$message.success('删除成功');
        return;
      }
      this.$confirm(`确认删除？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        searchDel(row.searchNo).then((res) => {
          if (res.code === 0) {
            this.$message.success('删除成功');
            this.list.splice(index, 1);
            this.listTotal -= 1;
          }
        });
      });
    },
    // 清除商品
    clearProduct(row) {
      row.product = '';
      row.productId = '';
      row.productType = '';
    },
    // 添加商品
    addGoods(row, index) {
      this.checkIndex = index;
      this.addGoodsDialog = true;
    },
    selectProduct(productList) {
      if (productList.length) {
        this.list[this.checkIndex].product = `${productList[0].productName}  ${productList[0].currency}${productList[0].salePrice}起`;
        this.list[this.checkIndex].productId = productList[0].id;
        this.list[this.checkIndex].productType = 1;
      } else {
        this.list[this.checkIndex].product = '';
        this.list[this.checkIndex].productId = '';
        this.list[this.checkIndex].productType = '';
      }
      this.addGoodsDialog = false;
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-add {
  margin-right: 0px;
}
.icon-close {
  margin-top: 1px;
  margin-left: 10px;
  cursor: pointer;
}
.table-container {
  .el-form-item--small {
    // margin-bottom: 0 !important;
  }
}
.hidden-image-upload {
  width: 0px;
  height: 0px;
  overflow: hidden;
}
</style>
