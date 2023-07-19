<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline label-width="80">
          <el-form-item label="商品分类">
            <el-cascader
              style="width: 168px"
              clearable
              v-model="form.productCategoryIds"
              :options="serviceCascader"
              collapse-tags
              :props="{
                multiple: true,
                children: 'childrenProductCategory',
                value: 'id',
                label: 'categoryName',
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="国家">
            <el-select style="width: 168px" size="small" multiple clearable v-model="form.countryCodes" filterable>
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="form.handlerName" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="归属人">
            <el-select class="form-item" placeholder="请选择" size="small" clearable filterable style="width: 168px" v-model="form.affiliationCreateId">
              <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
            <el-button type="default" @click="handleReset" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" icon="el-icon-edit" @click="modifyOwner" v-if="hasAuthority('E1_37')"> 修改归属人 </el-button>
            <el-button type="success" size="small" @click="edit('')" v-if="hasAuthority('E1_19')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" :span-method="arraySpanMethod" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
        <Empty slot="empty" />
        <!-- <el-table-column align="center" label="序号" width="70" prop="numberd">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="商品分类" prop="productCategoryName" width="200"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="国家" prop="countryName"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="供应商" prop="realName"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="百分比" prop="percentage"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="当月分配数" prop="curMonthAllotCount"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="规则开始时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.updateTime || '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="创建人" prop="createName"></el-table-column> -->
        <el-table-column align="center" label="归属人" prop="affiliationCreateName"></el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('E1_20')">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('E1_21')">
              <el-link type="primary" :underline="false" @click="edit(scope.row)" class="icon icon-edit"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" v-if="hasAuthority('E1_22')">
              <el-link type="info" :underline="false" v-if="scope.row.status === 2" @click="del(scope.row.id)" class="icon icon-del"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <ModifyOwnerModel :changeModifyOwnerDialog.sync="changeModifyOwnerDialog" :serviceIdColl="serviceIdColl" :isMultiple="true" :fromWhere="'allocationRules'" @reset="getList"></ModifyOwnerModel>
  </div>
</template>
<script>
import { getSupplierAllotRuleList, deleteSupplierAllotRule, getFunctionCodeByCategory } from '@/api/newApi/supplyChain/allocationRules.js';
import { getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getCountrySelectList, getFunctionCode } from '@/api/newApi/common.js';
import store from '@/store';
import cacheQuery from '@/mixins/cacheQuery';
import { getUserNormal } from '@/api/user.js';
export default {
  data() {
    return {
      // 分页
      total: 0,
      form: {
        page: 1,
        limit: 20,
        handlerName: '',
        countryCodes: [],
        productCategoryIds: [],
        status: '',
        supplierType: '',
        affiliationCreateId: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      tableLoading: false,
      searchFlag: false,
      // 数据
      list: [],
      countrySelectList: [],
      serviceCascader: [],
      functionCodeList: [],
      menuId: '',
      selectList: [],
      serviceIdColl: [],
      userList: [],
      changeModifyOwnerDialog: false,
    };
  },
  components: {
    ModifyOwnerModel: () => import('./components/modifyOwnerModel.vue'),
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    this._getallcategory();
    this.getUserList();
    this.getList();
    const menus = store.state.user.menus;
    const pathname = location.pathname.substr(1);
    const menu = menus.find((item) => item.path === pathname);
    this.menuId = menu.menuId;
  },
  methods: {
    /**
     * 表格数据处理合并行&列
     */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let tableCloumnList = ['percentage', 'realName', 'numberd', 'curMonthAllotCount'];
      if (!tableCloumnList.includes(column.property)) {
        if (row.itemID === 1) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    handleReset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },

    /**
     * 获取初始化数据
     */
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getSupplierAllotRuleList({
        ...this.form,
        productCategoryIds: this.form.productCategoryIds.join(','),
        countryCodes: this.form.countryCodes.join(','),
      })
        .then((res) => {
          let list = res.data.records;
          this.sourceList = res.data.records;
          list.forEach((item) => {
            if (item.startDate) {
              item.timeRange = item.startDate.split(' ')[0] + ' - ' + item.endDate.split(' ')[0];
            }
          });
          this.list = this.conversionList(list);
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

    /**
     * 转换数据结构将数据转换成单元格展示类型数据
     */
    conversionList(list) {
      let newList = [];
      list.forEach((item, index) => {
        if (item.detailList && Array.isArray(item.detailList) && item.detailList.length > 0) {
          this.rqSonItem(item, item.detailList, newList);
        }
      });
      const datailData = newList;
      return datailData;
    },

    /**
     *将每条子数据加上标识
     */
    rqSonItem(fatherItem, list, newList) {
      list.forEach((item, index) => {
        let orther = {
          itemID: index + 1,
          rowspan: list.length,
        };
        newList.push({ ...orther, ...item, ...fatherItem });
      });
    },

    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取归属人列表
    getUserList() {
      getUserNormal().then((res) => {
        if (res.code === 0) {
          this.userList = res.data;
        }
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getProductCategory({
        size: -1,
        status: 'ENABLE',
      }).then((res) => {
        if (res.code == 0) {
          let data = res.data.records.filter((item) => item.childrenProductCategory && item.childrenProductCategory.length);
          this.formatCategory(data);
          this.serviceCascader = data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    /**
     * 通过 productCategoryId 比对 childrenProductCategoryVo.id 找到 functionCode
     */
    getItemfunctionCode(productCategoryId) {
      return new Promise(async (resolve) => {
        let { code, data } = await getFunctionCodeByCategory(productCategoryId);
        if (code === 0 && data.code) {
          resolve(data.code);
        }
        resolve(0);
      });
    },
    // 多选勾选
    handleSelectionChange(val) {
      this.selectList = val;
    },
    /**
     * 修改归属人
     */
    modifyOwner() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择你要变更归属人的规则');
        return;
      }
      let ids = [];
      this.selectList.map((item) => {
        ids.push(item.id);
      });
      this.serviceIdColl = ids;
      this.changeModifyOwnerDialog = true;
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },

    /**
     * 详情
     */
    async detail(row) {
      let functionCode = await this.getItemfunctionCode(row.productCategoryId);
      this.$router.push({
        name: 'allocationrulesDetail',
        query: {
          id: row.id,
          menuId: this.menuId,
          functionCode,
        },
      });
    },
    /**
     * 编辑
     */
    async edit(row) {
      if (row && row.id) {
        let functionCode = await this.getItemfunctionCode(row.productCategoryId);
        this.$router.push({
          path: '/allocationrules/addEdit',
          query: {
            id: row.id,
            menuId: this.menuId,
            functionCode,
          },
        });
      } else {
        this.$router.push({
          path: '/allocationrules/addEdit',
          query: {
            menuId: this.menuId,
          },
        });
      }
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
        deleteSupplierAllotRule({ id }).then((res) => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/fixedSearch.scss';
// .app-container .header-container {
//   margin-bottom: 0;
// }
</style>
