<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline>
        <el-form-item label="企业主体">
          <el-select v-model="listQuery.enterpriseId" placeholder="选择企业主体" clearable filterable default-first-option style="width: 300px" @change="changeEnterprise('reuseForm')">
            <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="listQuery.platform" placeholder="活动平台" clearable filterable default-first-option>
            <el-option label="PC端" value="pc"></el-option>
            <el-option label="微信小程序" value="applets"></el-option>
            <el-option label="H5" value="h5"></el-option>
            <el-option label="线下" value="offline"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="listQuery.linkName" placeholder="活动名称" clearable style="width: 200px" size="small" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" v-show="hasAuthority('E2_4')" icon="el-icon-plus" @click="editPage('add')" size="small"> 新增 </el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="线上活动" name="first"></el-tab-pane>
        <el-tab-pane label="线下活动" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="listLoading" :height="lineTableHeight" highlight-current-row ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="企业主体">
          <template slot-scope="scope">{{ enterprise(scope.row.enterpriseId) }}</template>
        </el-table-column>
        <el-table-column align="center" label="平台" type="expand " width="150">
          <template slot-scope="scope">{{ platformType[scope.row.platform] }}</template>
        </el-table-column>
        <el-table-column align="center" label="链接名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.linkName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="链接">
          <template slot-scope="scope">
            {{ scope.row.linkUrl }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推广链接数">
          <template slot-scope="scope">{{ scope.row.urlCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="注册用户总数">
          <template slot-scope="scope">{{ scope.row.registerCount }}</template>
          <template slot="header">
            注册用户总数
            <el-tooltip class="item" effect="dark" content="专属推广链接带来的注册用户数" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单转化数" width="150">
          <template slot-scope="scope">{{ scope.row.orderCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单转化金额" width="150">
          <template slot-scope="scope">{{ scope.row.orderSaleMoney }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="150">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="150">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" v-show="hasAuthority('E2_1')">
              <el-link type="primary" class="icon" effect="dark" :underline="false" @click="showDetailModal(scope.row)">
                <img src="@/assets/images/zt-upgrade-1/seeDetails.svg" />
              </el-link>
            </el-tooltip>
            <el-tooltip content="编辑" effect="dark" placement="top" v-show="hasAuthority('E2_2')">
              <el-link class="icon" type="primary" :underline="false" @click="editPage('edit', scope.row)" v-if="scope.row.status != 1">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import cacheQuery from '@/mixins/cacheQuery';
import { getFirm } from '@/api/newApi/common.js';
import { linkAddressPageList } from '@/api/newApi/extension/promotionExtend.js';
export default {
  data() {
    return {
      // 分页
      list: [],
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
      },
      platformType:{
        'pc' : 'pc端',
        'h5' : 'H5',
        'applets' : '小程序',
        'offline' : '线下'
      },
      activeName: 'first',
      copyListQuery: {},
      listLoading: false,
      searchFlag: false,
      cacheKey: 'listQuery',
      firmList: [],
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

    enterprise() {
      return (enterpriseId) => {
        let obj = this.firmList.find((item) => item.id == enterpriseId);
        let name = (obj && obj.name) || '';
        return name;
      };
    },
  },
  async created() {
    this.copyListQuery = { ...this.listQuery };
    this.getfirmList();
    this.search();
  },
  methods: {
    async search() {
      this.listLoading = true;
      this.searchFlag = true;
      let  newObj = JSON.parse(JSON.stringify(this.listQuery))
      if(this.activeName == 'first') {
        
        if(newObj.platform) {
          newObj.platform = [newObj.platform]
        } else {
          newObj.platform = ['pc','h5','applets']
        }
      } else {
        newObj.platform = ['offline']
      }
      try {
        let { code, data } = await linkAddressPageList(newObj);
        if (code == 0) {
          this.listTotal = Number(data.total);
          this.list = data.records;
          this.listLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.listTotal}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        }
      } catch (error) {
        this.searchFlag = false;
        this.listLoading = false;
      }
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.search();
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.removePageCache();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.search();
    },

    /**
     * 编辑/新增
     */
    editPage(key, row) {
      if (key == 'edit') {
        window.sessionStorage.setItem('staffEditObj', JSON.stringify(row));
        this.$router.push({
          path: '/extension/promotionExtend/staff/add/add',
          query: { linkAddressId: row.linkAddressId,status:'edit' },
        });
      } else {
        this.$router.push({
          path: '/extension/promotionExtend/staff/add/add',
        });
      }
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      window.sessionStorage.setItem('staffEditObj', JSON.stringify(row));
      this.$router.push({
        path: '/extension/promotionExtend/staff/detail/detail',
        query: { linkAddressId: row.linkAddressId },
      });
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
