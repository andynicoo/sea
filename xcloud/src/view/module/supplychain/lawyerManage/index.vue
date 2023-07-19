<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form ref="searchForm" inline label-width="100px">
            <el-form-item label="律师英文名称">
              <el-input
                v-model="form.attorneyAbbreviation"
                placeholder="律师英文名称"
                clearable
                style="width: 168px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="律师编码">
              <el-input
                v-model="form.attorneyCode"
                placeholder="律师编码"
                clearable
                style="width: 168px"
                size="small"
              />
            </el-form-item>
            <el-form-item label="服务国家">
              <el-select style="width: 168px" size="small" multiple clearable v-model="form.countryCodes" filterable>
                <el-option
                  v-for="item in countrySelectList"
                  :key="item.id"
                  :value="item.countryCode"
                  :label="item.countryNameZh"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- <el-select style="width: 168px" size="small" clearable multiple v-model="form.productCategoryIds" filterable>
              <el-option
                v-for="item in functionCode"
                :key="item.id"
                :value="item.id"
                :label="item.categoryName"
              ></el-option>
            </el-select> -->
              <el-cascader
                style="width: 168px"
                clearable
                v-model="form.productCategoryIds"
                :options="serviceCascader"
                collapse-tags
                :props="{
                  multiple: true,
                  children: 'childrenProductCategoryVo',
                  value: 'id',
                  label: 'categoryName',
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
              <el-button type="default" @click="handleReset" icon="el-icon-refresh">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? "收起" : "更多" }}筛选
              </el-button>
            </el-form-item>

            <el-form-item style="float: right">
              <el-button
                type="success"
                size="small"
                @click="modifyOwner()"
                icon="el-icon-edit"
                v-if="hasAuthority('E1_39')"
              >
                修改归属人
              </el-button>
              <el-button type="success" size="small" @click="edit(0)" v-if="hasAuthority('E1_9')">
                <i class="icon icon-adds"></i>
                新增律师
              </el-button>
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="状态">
                <el-select style="width: 168px" size="small" clearable v-model="form.status">
                  <el-option :value="1" label="启用">启用</el-option>
                  <el-option :value="2" label="禁用">禁用</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="律所名称">
                <el-input
                  v-model="form.attorneyName"
                  placeholder="律所名称"
                  clearable
                  style="width: 168px"
                  size="small"
                />
              </el-form-item>
              <el-form-item label="归属人">
                <el-select
                  class="form-item"
                  placeholder="请选择"
                  size="small"
                  clearable
                  filterable
                  style="width: 168px"
                  v-model="form.affiliationCreateId"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="list"
        v-loading="tableLoading"
        :height="tableHeight"
        ref="table"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
      >
        <Empty slot="empty" />
        <!-- <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          align="center"
          width="150"
          label="律师名称"
          prop="attorneyName"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column align="center" width="150" label="律师英文名称" prop="attorneyAbbreviation"></el-table-column>
        <el-table-column align="center" width="150" label="律师编码" prop="attorneyCode"></el-table-column>
        <el-table-column align="center" label="商品分类" prop="categoryNames" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="服务国家" prop="countryName"></el-table-column>
        <el-table-column align="center" label="状态" prop="isOpen">
          <template slot-scope="scope">
            <span v-if="scope.row.isOpen === 1">
              <span class="dot-success"></span>
              启用
            </span>
            <span v-if="scope.row.isOpen === 2">
              <span class="dot-danger"></span>
              禁用
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" width="150" label="律师代表" prop="attorneyRepresentative"></el-table-column> -->
        <!-- <el-table-column align="center" width="150" label="联系电话" prop="attorneyTel"></el-table-column> -->
        <!-- <el-table-column
          align="center"
          width="180"
          label="联系邮箱"
          prop="attorneyEmail"
          show-overflow-tooltip
        ></el-table-column> -->
        <el-table-column align="center" label="归属人" prop="affiliationCreateName"></el-table-column>
        <el-table-column align="center" width="150" label="创建时间" prop="createTime" sortable></el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('E1_10')">
              <el-link type="primary" :underline="false" @click="detail(scope.row.id)" class="icon icon-see"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('E1_11')">
              <el-link type="primary" :underline="false" @click="edit(scope.row.id)" class="icon icon-edit"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top" v-if="hasAuthority('E1_12')">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.isOpen === 1"
                @click="_changeDisableStatus(scope.row.id)"
                class="icon icon-disable"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" v-if="hasAuthority('E1_13')">
              <el-link
                type="info"
                :underline="false"
                v-if="scope.row.isOpen === 2"
                @click="del(scope.row.id)"
                class="icon icon-del"
              ></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <ModifyOwnerModel
      :changeModifyOwnerDialog.sync="changeModifyOwnerDialog"
      :serviceIdColl="serviceIdColl"
      @reset="_getLawyerList"
      :fromWhere="'lawyerManage'"
    ></ModifyOwnerModel>
  </div>
</template>
<script>
import {
  getLawyerList,
  activateAttorneyDisabledState,
  deleteAttorneyInfo,
} from "@/api/newApi/supplyChain/lawyerManage.js";
import { getallcategory } from "@/api/newApi/servicemerchant/serviceMerchant.js";
import { getCountrySelectList, getFunctionCode } from "@/api/newApi/common.js";
import { getUserNormal } from "@/api/user.js";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      // 分页
      total: 0,
      form: {
        countryCodes: [],
        attorneyAbbreviation: "",
        attorneyName: "",
        isOpen: "",
        limit: 20,
        page: 1,
        productCategoryIds: [],
        attorneyCode: "",
        affiliationCreateId: "",
      },
      cacheKey: "form",
      copyListQuery: {},
      tableLoading: false,
      // 数据
      list: [],
      countrySelectList: [],
      functionCode: [],
      serviceCascader: [],
      searchFlag: false,
      selectList: [],
      serviceIdColl: [],
      userList: [],
      changeModifyOwnerDialog: false,
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return "启用";
        case 2:
          return "禁用";
        default:
          return status;
      }
    },
  },
  components: {
    ModifyOwnerModel: () => import("@/view/module/supplychain/allocationRules/components/modifyOwnerModel.vue"),
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    // this._getFunctionCode();
    this._getallcategory();
    this.getUserList();
    this._getLawyerList();
  },
  methods: {
    handleReset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
      // this.form = {
      //   countryCodes: [],
      //   attorneyAbbreviation: "",
      //   isOpen: "",
      //   limit: 20,
      //   page: 1,
      //   productCategoryIds: [],
      // };
    },
    _getLawyerList() {
      this.tableLoading = true;
      this.setPageCache();
      getLawyerList({
        ...this.form,
        countryCodes: this.form.countryCodes.join(","),
        productCategoryIds: this.form.productCategoryIds.join(","),
      })
        .then((res) => {
          let list = res.data.records;
          list.forEach((item) => {
            item.countryName = item.countryNames.split(",")[0];
          });
          this.list = list;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取服务分类
    _getFunctionCode() {
      getFunctionCode().then((res) => {
        this.functionCode = res.data;
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
      getallcategory().then((res) => {
        if (res.code == 0) {
          this.formatCategory(res.data);
          this.serviceCascader = res.data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategoryVo && item.childrenProductCategoryVo.length) {
          this.formatCategory(item.childrenProductCategoryVo);
        } else {
          item.childrenProductCategoryVo = void 0;
        }
      });
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this._getLawyerList();
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
        this.$message.warning("请先选择律师");
        return;
      }
      let ids = [];
      this.selectList.map((item) => {
        ids.push(item.id);
      });
      this.serviceIdColl = ids;
      this.changeModifyOwnerDialog = true;
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this._getLawyerList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this._getLawyerList();
    },
    /**
     * 详情
     */
    detail(id) {
      this.$router.push({
        name: "lawyermanageDetail",
        params: {
          id,
        },
      });
    },
    /**
     * 编辑
     */
    edit(id) {
      this.$router.push({
        name: "lawyermanageAddEdit",
        params: {
          id,
        },
      });
    },
    /**
     * 切换禁用状态
     */
    _changeDisableStatus(id) {
      this.$confirm("是否确认禁用?", "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        this.tableLoading = true;
        activateAttorneyDisabledState({ id })
          .then((res) => {
            if (res.code == 0) {
              this.$message("操作成功");
              this._getLawyerList();
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
    /**
     * 删除
     */
    del(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        deleteAttorneyInfo({ id }).then((res) => {
          if (res.code === 0) {
            this._getLawyerList();
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/styles/fixedSearch.scss";
// .app-container .header-container {
//   margin-bottom: 0;
// }
</style>
