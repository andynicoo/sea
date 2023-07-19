<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline>
        <el-form-item label="推广人手机号">
          <el-input v-model="listQuery.adminUserMobile" placeholder="请输入手机号" clearable style="width: 168px" size="small" />
        </el-form-item>
        <el-form-item label="推广人名字">
          <el-input v-model="listQuery.adminUserName" placeholder="请输入推广人名字" clearable style="width: 168px" size="small" />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-select style="width: 120px" v-model="listQuery.enterpriseId" size="small" clearable filterable @change="serchData">
            <el-option v-for="(item, index) in firmList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select style="width: 120px" v-model="listQuery.status" size="small" @change="search" clearable>
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="warning" size="small" class="yellow-btn" v-show="hasAuthority('E2_15')" @click="_export()" :loading="exportLoading"> <i class="icon icon-export"></i>导出 </el-button>
          <el-button type="success" v-show="hasAuthority('E2_4')" icon="el-icon-plus" @click="editPage" size="small"> 新增 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="listLoading" :height="lineTableHeight" highlight-current-row ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="推广人名字" type="expand " width="150">
          <template slot-scope="scope">{{ scope.row.adminUserName }}</template>
        </el-table-column>
        <el-table-column align="center" label="推广人手机号" width="150">
          <template slot-scope="scope">
            {{ scope.row.adminUserMobile }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推广链接总数量">
          <template slot-scope="scope">
            {{ scope.row.channelPageCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="浏览总量">
          <template slot-scope="scope">{{ scope.row.pvCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="注册用户总数">
          <template slot-scope="scope">{{ scope.row.registerCount }}</template>
        </el-table-column>

        <el-table-column align="center" label="创建时间" width="150">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-danger" v-if="scope.row.status == 1">
              <img src="@/assets/images/zt-upgrade-1/stuts_jinyong.svg" />
              禁用
            </span>
            <span class="text-success" v-else-if="scope.row.status == 0">
              <img src="@/assets/images/zt-upgrade-1/stuts_qiyong_yfb.svg" />
              启用
            </span>
            <span class="text-warning" v-else>锁定</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" v-show="hasAuthority('E2_1')">
              <el-link type="primary" class="icon" effect="dark" :underline="false" @click="showDetailModal(scope.row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" />
              </el-link>
            </el-tooltip>

            <el-tooltip content="编辑" effect="dark" placement="top" v-show="hasAuthority('E2_2')">
              <el-link class="icon" type="primary" :underline="false" @click="editPage(scope.row)" v-if="scope.row.status != 1">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>

            <el-tooltip content="禁用" effect="dark" placement="top" v-show="hasAuthority('E2_3')">
              <el-link type="primary" :underline="false" class="icon" @click="handleClickDisable(scope.row)" v-if="scope.row.status == 0">
                <img src="@/assets/images/zt-upgrade-1/prohibit.svg" />
              </el-link>
            </el-tooltip>

            <el-tooltip content="启用" placement="top" v-show="hasAuthority('E2_3')">
              <el-link type="primary" :underline="false" @click="handleClickEnable(scope.row)" v-if="scope.row.status == 1">
                <img src="@/assets/images/zt-upgrade-1/enable.svg" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getList, deleteList, getUpdateChannelStatus, excelList } from '@/api/newApi/extension/promotionExtend.js';
import { getFirm } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';

export default {
  data() {
    return {
      // 分页
      list: [],
      listTotal: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        adminUserMobile: '',
        status: '',
        adminUserName: '',
        enterpriseId: '',
      },
      copyListQuery: {},
      listLoading: false,
      cacheKey: 'listQuery',
      firmList: [], //企业列表
      enterpriseId: '',
      exportLoading: false,
      searchFlag: false,
    };
  },
  mixins: [cacheQuery],
  computed: {
    lineTableHeight() {
      let { tableHeight, otherHeight } = this;
      if (otherHeight == '205') {
        this.otherHeight = 205 + 74;
      }
      return tableHeight;
    },
  },
  async created() {
    this.copyListQuery = { ...this.listQuery };
    this.listQuery.enterpriseId = +window.localStorage.getItem('enterpriseId');
    this.getPageCache();
    this.getfirmList();
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    search() {
      this.searchFlag = true;
      this.queryData();
    },
    queryData() {
      this.listLoading = true;
      this.setPageCache();
      getList(this.listQuery)
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
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

    handleReset() {
      // this.listQuery = { ...this.copyListQuery }
      (this.listQuery = {
        pageIndex: 1,
        pageSize: 10,
        adminUserMobile: '',
        status: '',
        adminUserName: '',
        enterpriseId: '',
      }),
        this.removePageCache();
      this.queryData();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.queryData();
    },
    serchData() {
      this.queryData();
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then((res) => {
        if (res.code == 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    /**
     * 编辑/新增
     */
    editPage(row, index) {
      window.localStorage.setItem('editObj', JSON.stringify(row));
      this.$router.push({
        path: '/extension/promotionExtend/line/addEdit',
      });
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: '/extension/promotionExtend/line/detail',
        query: { channelId: row.channelId },
      });
    },
    /**
     * 启用
     */
    handleClickEnable(row) {
      this.$confirm('确定启用吗？', '启用提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        getUpdateChannelStatus({
          channelId: row.channelId,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '启用成功',
            });
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    /**禁用 */
    handleClickDisable(row) {
      this.$confirm('确定禁用吗？', '禁用提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        getUpdateChannelStatus({
          channelId: row.channelId,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '禁用成功',
            });
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    /**
     * 删除
     */
    handleDelet(row) {
      this.$confirm('确定删除该数据？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        deleteList({
          id: row.id,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            let totalPage = Math.ceil((this.listTotal - 1) / this.listQuery.pageSize); // 总页数
            let currentPage = this.listQuery.pageIndex > totalPage ? totalPage : this.listQuery.pageIndex;
            this.listQuery.pageIndex = currentPage < 1 ? 1 : currentPage;
            this.queryData();
          } else {
            this.$message({
              message: res.message,
              type: 'error',
            });
          }
        });
      });
    },
    _export() {
      this.$confirm(`当前选择${this.listTotal}条数据 ，是否确认导出？`, '数据导出', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.exportLoading = true;
        excelList(this.listQuery)
          .then((res) => {
            this.exportLoading = false;
            this.$util.exportExcel(res, '员工推广统计_' + this.$util.formatDate(new Date(), 'yyyyMMddHHmmss'));
          })
          .catch((e) => {
            this.exportLoading = false;
          });
      });
    },
  },
};
</script>
<style scoped lang="less">
.action {
  a {
    margin-right: 5px;
  }
}

.text-success {
  display: flex;
  justify-items: center;
  justify-content: center;
  img {
    margin-right: 3px;
  }
}
</style>
