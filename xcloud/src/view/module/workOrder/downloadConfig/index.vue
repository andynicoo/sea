<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item label="模板名称">
          <el-input v-model="listQuery.templateName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-cascader clearable style="width: 200px" :props="{ value: 'code', label: 'name', children: 'workFunctionList' }" v-model="listQuery.functionCode" :options="workOrderTypeList"></el-cascader>
        </el-form-item>
        <el-form-item label="国家">
          <el-select style="width: 120px" v-model="listQuery.countryCode" clearable @change="changeCountryCode" placeholder="选择国家" filterable>
            <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商">
          <el-select style="width: 200px" v-model="listQuery.supplierId" @change="querySupplierList" placeholder="选择服务商" clearable filterable>
            <el-option :value="item.id" :label="item.shortName" v-for="item in supplierList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="default" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" @click="toEditProcess" icon="el-icon-plus" v-show="hasAuthority('H1_1')"> 新增 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="模板名称">
          <template slot-scope="{ row }">{{ row.templateName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务商" prop="supplierId">
          <template slot-scope="{ row }">{{ row.supplierName }}</template>
        </el-table-column>
        <el-table-column align="center" label="工单类型">
          <template slot-scope="{ row }">{{ row.functionName }}</template>
        </el-table-column>
        <el-table-column align="center" label="国家">
          <template slot-scope="{ row }">{{ row.countryName }}</template>
        </el-table-column>
        <el-table-column align="center" label="是否应用到客户端">
          <template slot-scope="{ row }">
            {{ row.applyPlatform == 1 ? '是' : row.applyPlatform == 2 ? '否' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="定位到字段">
          <template slot-scope="{ row }">{{ row.columnName }}</template>
        </el-table-column>
        <el-table-column align="center" label="文件格式">
          <template slot-scope="{ row }">
            {{ row.templateSuffix }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="最后操作人">
          <template slot-scope="{ row }">
            {{ row.modifyName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="最后操作时间" width="150">
          <template slot-scope="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-tooltip content="查看详情" placement="top" v-show="hasAuthority('H1_2')">
              <el-link type="primary" :underline="false" @click="toPreviewTemplate(row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="替换模板" placement="top" v-show="hasAuthority('H1_3')">
              <el-link type="primary" :underline="false" @click="toEditProcess(row)">
                <img src="@/assets/images/zt-upgrade-1/replace.svg" alt="" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="模版删除" placement="top" v-show="hasAuthority('H1_5')">
              <el-link type="primary" :underline="false" @click="downloadTemplateRemove(row)">
                <i class="el-icon-delete"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="选择字段" :visible.sync="dialogVisible" width="60%" destroy-on-close>
      <div v-if="dialogVisible">
        <FieldSelection :listParams="listParams" :columnIds="columnIds" :scene="'list'" @cancel="cancel" @submit="submit" />
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.pageNo" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { findProducts, findCountrys, newfindProcesses, downloadTemplate } from '@/api/newApi/processFields/processConfig';
import { workCategoryList, downloadTemplateRemove } from '@/api/newApi/workOrder/typeConfig.js';
import FieldSelection from './components/FieldSelection';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  components: {
    FieldSelection,
  },
  data() {
    return {
      //工单类型列表
      workOrderTypeList: [],
      // 商品，国家，服务商，状态
      productList: [],
      countryList: [],
      supplierList: [],
      originSupplierList: [],

      // 分页查询
      dataSource: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        functionCode: '',
        countryCode: '',
        supplierId: '',
        pageNo: 1,
        pageSize: 10,
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      dialogVisible: false,
      listParams: {},
      columnIds: [],
    };
  },
  mixins: [cacheQuery],
  watch: {
    'listQuery.countryCode'(val) {
      if (val) {
        this.querySupplierList();
      } else {
        this.listQuery.supplierId = '';
        this.supplierList = [];
      }
    },
  },
  async created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    // this.queryProductList();
    this.queryCountryList();
    this.querySupplierList();
    this.queryList();
    workCategoryList().then((res) => {
      if (res.code === 0) {
        res.data.forEach((item) => {
          item.code = 'i' + item.id;
        });
        this.workOrderTypeList = res.data;
      }
    });
  },
  methods: {
    downloadTemplateRemove(item) {
      const { id } = item;
      this.$confirm('确认要删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        try {
          this.listLoading = true;
          downloadTemplateRemove(id).then((res) => {
            if (res.code === 0) {
              this.listLoading = true;
              this.$message.success('删除成功');
              this.queryList();
            }
          });
        } finally {
          this.listLoading = false;
        }
      });
    },
    openFieldSelection(item) {
      this.columnIds = [item.columnId];

      this.listParams = {
        templateId: item.id,
        workflowId: item.flowId,
        functionCode: item.functionCode.length ? item.functionCode[1] : '',
        countryCode: item.countryCode,
        supplierId: item.supplierId,
      };
      this.dialogVisible = true;
    },
    /**
     * 查询商品列表
     */
    queryProductList() {
      findProducts().then((res) => {
        if (res.code === 0) {
          this.productList = res.data;
        }
      });
    },

    /**
     * 切换业务分类
     */
    changeFunctionCode() {
      this.listQuery.supplierId = '';
      this.querySupplierList();
    },
    /**
     * 查询国家列表
     */
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 改变国家code，查询服务商
     */
    changeCountryCode() {
      this.listQuery.supplierId = '';
    },
    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList() {
      newfindProcesses({
        functionCode: this.listQuery.functionCode.length ? this.listQuery.functionCode[1] : '',
        countryCode: this.listQuery.countryCode,
        page: 1,
        limit: 9999,
        // supplierType: '1',
      }).then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data;
        }
      });
    },

    getValueByKey(val, key, arr, rVal) {
      const aa = arr.find((item) => val === item[key]);
      return aa[rVal];
    },

    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      const params = {
        functionCode: this.listQuery.functionCode.length ? this.listQuery.functionCode[1] : '',
        countryCode: this.listQuery.countryCode,
        supplierId: this.listQuery.supplierId,
        page: this.listQuery.pageNo,
        limit: this.listQuery.pageSize,
        templateName: this.listQuery.templateName,
      };
      this.setPageCache();
      downloadTemplate(params)
        .then((res) => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code === 0) {
            this.$data.dataSource = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .catch(() => {
          this.listLoading = false;
        });

      // auditProcess({
      //   flowId: this.flowId,
      //   operation: this.auditForm.status
      // }).then(res => {
      //   if (res.code == 0) {
      //     this.$message({
      //       type: "success",
      //       message: "操作成功"
      //     });
      //     this.auditModal = false;
      //     this.goback();
      //   }
      // });
    },
    search() {
      this.listQuery.pageNo = 1;
      this.queryList();
    },
    handleReset() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.queryList();
    },
    changePageNo(val) {
      this.listQuery.pageNo = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.pageSize = val;
      this.queryList();
    },

    /**
     * 跳转到节点配置页面
     */
    toEditProcess(row) {
      console.log(row);
      this.$router.push({
        path: '/workOrder/downloadConfig/editDownload',
        query: {
          tempId: row.id,
        },
      });
    },

    /**
     * 跳转到节点配置预览页面
     */
    toPreviewTemplate(row) {
      this.$router.push({
        path: '/workOrder/downloadConfig/details',
        query: {
          tempId: row.id,
          preView: true,
        },
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    submit() {
      this.dialogVisible = false;
      this.queryList();
    },
  },
};
</script>
<style scoped lang="scss">
.btn {
  display: flex;
  align-items: center;
}
.app-container {
  .followPerson {
    text-align: center;
    padding: 10px;
    font-size: 14px;
  }
  .pagination-container {
    // margin-top: 24px;
    // padding-top: 20px !important;
    // padding-bottom: 20px !important;
  }
}
</style>
