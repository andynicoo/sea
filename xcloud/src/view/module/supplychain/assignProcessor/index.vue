<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searhForm" :model="listQuery" inline>
          <el-form-item label="工单类型" prop="serviceType">
            <el-cascader
              style="width: 168px"
              @change="onhouChange"
              clearable
              filterable
              placeholder="请选择"
              v-model="listQuery.serviceType"
              :options="workCategoryCascader"
              :props="{
                expandTrigger: 'hover',
                children: 'workFunctionList',
                value: 'code',
                label: 'name',
                emitPath: false,
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商品分类" prop="goodsClassify">
            <el-select v-model="listQuery.productCategoryId" placeholder="请选择" size="small" style="width: 168px" clearable filterable multiple>
              <el-option v-for="item in productCategoryArry" :key="item.productCategoryId" :value="item.productCategoryId" :label="item.productCategoryName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select v-model="listQuery.countryCode" placeholder="请选择" size="small" style="width: 168px" clearable filterable>
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="listQuery.status" placeholder="请选择" size="small" style="width: 168px" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
              <el-option label="已过期" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="clearForm('searhForm')">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="showAddModal" size="small" v-if="hasAuthority('E1_27')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="list" style="width: 100%" v-loading="listLoading" border max-height="700" highlight-current-row :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工单类型" prop="serviceTypeName"></el-table-column>
        <el-table-column align="center" label="商品分类">
          <template slot-scope="scope">
            <div v-if="scope.row.productCategoryNameList.length">{{ scope.row.productCategoryNameList.toString() }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务国家" prop="countryName"></el-table-column>
        <el-table-column align="center" label="总基数" prop="baseNum"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">
              <span class="dot-success"></span>
              启用
            </span>
            <span v-else-if="scope.row.status == 2">
              <span class="dot-danger"></span>
              禁用
            </span>
            <span v-else>
              <span class="dot-danger"></span>
              已过期
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" sortable></el-table-column>
        <el-table-column align="center" label="执行时间范围" sortable>
          <template slot-scope="scope">
            {{ scope.row.startDate.substr(0, 10) }}~
            {{ scope.row.endDate.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('E1_28')">
              <el-link type="primary" :underline="false" @click="showEditModal(scope.row)" v-if="scope.row.status !== 3" class="icon icon-edit"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('E1_29')">
              <el-link type="primary" :underline="false" @click="bankDetail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="复制" placement="top" v-if="hasAuthority('E1_30')">
              <el-link type="primary" :underline="false" @click="copy(scope.row)" v-if="scope.row.status !== 3" class="icon icon-copy"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top" v-if="hasAuthority('E1_31')">
              <el-link type="primary" :underline="false" @click="enableDisable(scope.row)" v-if="scope.row.status == 1" class="icon icon-disable"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top" v-if="hasAuthority('E1_32')">
              <el-link type="primary" :underline="false" @click="enableDisable(scope.row)" v-if="scope.row.status == 2" class="icon icon-use"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" v-if="hasAuthority('E1_33')">
              <el-link type="info" :underline="false" @click="handleDelete(scope.row)" v-if="scope.row.status !== 3" class="icon icon-del"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { pageList, deleteHandler, handlerStatus, goodsCategory } from '@/api/newApi/supplyChain/assignProcessor.js';
import { workCategoryList } from '@/api/newApi/workOrder/typeConfig.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        countryCode: '',
        serviceType: '',
        status: '',
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      searchFlag: false,
      //数据
      list: [],
      listLoading: false,
      editForm: {
        id: '',
        name: '',
        desc: '',
        status: '',
      },
      workCategoryCascader: [],
      countrySelectList: [],
      detailModal: false,
      productCategoryArry: [],
    };
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryData(); //列表
    this.getCountryList(); //国家列表
    this.getWorkCategoryList();
    if (this.listQuery.serviceType) {
      this.getGoodsCategory(this.listQuery.serviceType);
    }
    // this.getGoodsCategory();
  },
  methods: {
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.setPageCache();
      pageList(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            setTimeout(() => {
              this.listLoading = false;
            }, 300);
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
            this.getTotalList();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    getWorkCategoryList() {
      workCategoryList().then((res) => {
        res.data.forEach((item, index) => {
          item.code = 'i' + index;
        });
        this.workCategoryCascader = res.data;
      });
    },
    onhouChange(val) {
      if (val) {
        this.getGoodsCategory(val);
        this.listQuery.productCategoryId = [];
      }
    },
    getGoodsCategory(val) {
      goodsCategory({ type: val }).then((res) => {
        if (res.code == 0) {
          this.productCategoryArry = res.data;
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    /** 重置 */
    clearForm(searhForm) {
      // this.$refs[searhForm].resetFields();
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
    },
    // 获取国家列表
    getCountryList() {
      return new Promise((resolve) => {
        getCountrySelectList().then((res) => {
          this.countrySelectList = res.data;
          resolve();
        });
      });
    },

    /**
     * 新增
     */
    showAddModal() {
      this.$router.push({ name: 'assignProcessorAddEdit' });
    },

    /**
     * 编辑弹框
     */
    showEditModal(row) {
      this.$router.push({
        name: 'assignProcessorAddEdit',
        query: { id: row.id, flag: 'update' },
      });
    },
    /** 详情 */
    bankDetail(row) {
      this.$router.push({
        name: 'assignProcessorDetail',
        query: { id: row.id },
      });
    },
    /** 复制 */
    copy(row) {
      this.$router.push({
        name: 'assignProcessorAddEdit',
        query: { id: row.id },
      });
    },
    handleSubmit() {},
    /** 启用禁用 */
    enableDisable(row) {
      let text = row.status == 1 ? '确定禁用该数据？' : row.status == 2 ? '确定启用该数据' : '';
      this.$confirm(text, '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        handlerStatus({ xcloudHaxndlerAllotId: row.id })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('操作成功');
              this.queryData(); //列表
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      });
    },
    /**
     * 根据id删除活动
     */
    handleDelete(row) {
      this.$confirm('确定删除该数据？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        deleteHandler({ xcloudHaxndlerAllotId: row.id })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('删除成功');
              this.queryData(); //列表
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
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
