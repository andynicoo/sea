<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" class="clearfix" :model="form" inline label-width="80px">
          <el-form-item label="资讯标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入资讯标题" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item :label="meatTit === '案例管理' ? '案例分类' : '资讯分类'" prop="categoryId">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.categoryId">
              <el-option v-for="(item, index) in categoryList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.enabled">
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="form.createTime" type="datetimerange" align="right" size="small" clearable unlink-panels range-separator="到" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 340px">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <!-- 资讯列表 案例列表共用页面，区分按钮权限 -->
              <AttrWordBtn @setAttr="goSetAttrWord" :disabled="!multipleSelection.length" :tip="meatTit === '资讯列表' ? '请选择资讯' : '请选择案例'" />
              <UploadAndDownload :method="getList" :api="`${baseUrl}/information/management/newsDocument/upload`" :moduleName="meatTit === '资讯列表' ? 'INFORMATION' : 'CASE'" :list="multipleSelection" />
              <el-button type="primary" size="small" class="yellow-btn" @click="add" v-if="meatTit === '资讯列表'" v-show="hasAuthority('H2_5')">
                <i class="icon icon-white-upload"></i>
                <span>发布</span>
              </el-button>
              <el-button type="primary" size="small" class="yellow-btn" @click="add" v-else v-show="hasAuthority('CASE_TOP_PUB')">
                <i class="icon icon-white-upload"></i>
                <span>发布</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="multipleTable" border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" @selection-change="handleSelectionChange" row-key="id">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"> </el-table-column>
        <!-- <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="ID" width="180px" show-overflow-tooltip prop="id"></el-table-column>
        <el-table-column align="center" label="主图" width="180px" show-overflow-tooltip prop="supplierTypeName">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 40px" :src="scope.row.mainPicUrl" :preview-src-list="[scope.row.mainPicUrl]"> </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="meatTit === '案例管理' ? '案例分类' : '资讯分类'" width="180px" show-overflow-tooltip prop="categoryName"></el-table-column>
        <el-table-column align="center" :label="meatTit === '案例管理' ? '案例标题' : '资讯标题'" width="180px" prop="title">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
              <a v-if="mainId === '40' && scope.row.enabled === 0" :href="`${websiteUrl}?id=${scope.row.id}`">{{ scope.row.title | stringSlice(10) }}</a>
              <a v-else>{{ scope.row.title | stringSlice(10) }}</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签(关键词)" width="200px" prop="labelList">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.labelList" :key="item.id" style="margin-right: 2px" :title="item.labelName">
              {{ item.labelName | stringSlice(10) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="属性词" width="200px" prop="attributeWordDTOList">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.attributeWordDTOList" :key="item.id" style="margin-right: 2px" :title="item.attributeWordName">
              {{ item.attributeWordName | stringSlice(10) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="状态" show-overflow-tooltip prop="enabled">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled === 0">
              <span class="dot-success"></span>
              已发布
            </span>
            <span v-if="scope.row.enabled === 1">
              <span class="dot-info"></span>
              未发布
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" label="发布时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" width="150" label="发布人" show-overflow-tooltip prop="createName"></el-table-column>
        <el-table-column align="center" width="150" label="修改人" show-overflow-tooltip prop="modifyName">
          <template slot-scope="{ row }">{{ row.modifyName || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="修改时间" show-overflow-tooltip prop="updateTime">
          <template slot-scope="{ row }">{{ row.updateTime || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" width="188" label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- 资讯列表 案例列表共用页面，区分按钮权限 -->
            <template v-if="meatTit === '资讯列表'">
              <el-tooltip content="查看" placement="top">
                <el-link type="primary" :underline="false" @click="detail(scope.row.id)" v-show="hasAuthority('H2_6')">
                  <i class="icon icon-see"></i>
                  <!-- 查看 -->
                </el-link>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-link type="primary" :underline="false" @click="edit(scope.row.id)" v-show="hasAuthority('H2_7')">
                  <i class="icon icon-edit"></i>
                  <!-- 编辑 -->
                </el-link>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-link type="primary" :underline="false" @click="del(scope.row.id)" v-if="hasAuthority('H2_8') && scope.row.enabled === 1">
                  <i class="icon icon-del"></i>
                  <!-- 删除 -->
                </el-link>
              </el-tooltip>
              <el-tooltip :content="scope.row.enabled === 0 ? '取消发布' : '发布'" placement="top">
                <el-link type="primary" :underline="false" @click="disabled(scope.row)" v-show="hasAuthority('H2_9')">
                  <i class="icon" :class="scope.row.enabled === 0 ? 'icon-square-close' : 'icon-publish'"></i>
                </el-link>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tooltip content="查看" placement="top">
                <el-link type="primary" :underline="false" @click="detail(scope.row.id)" v-show="hasAuthority('VIEW_CASE')">
                  <i class="icon icon-see"></i>
                  <!-- 查看 -->
                </el-link>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-link type="primary" :underline="false" @click="edit(scope.row.id)" v-show="hasAuthority('EDIT_CASE')">
                  <i class="icon icon-edit"></i>
                  <!-- 编辑 -->
                </el-link>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-link type="primary" :underline="false" @click="del(scope.row.id)" v-if="hasAuthority('DEL_CASE') && scope.row.enabled === 1">
                  <i class="icon icon-del"></i>
                  <!-- 删除 -->
                </el-link>
              </el-tooltip>
              <el-tooltip :content="scope.row.enabled === 0 ? '取消发布' : '发布'" placement="top">
                <el-link type="primary" :underline="false" @click="disabled(scope.row)" v-show="hasAuthority('ADD_CASE')">
                  <i class="icon" :class="scope.row.enabled === 0 ? 'icon-square-close' : 'icon-publish'"></i>
                </el-link>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <div class="itemnum">
        <span @click="deleteReal">删除</span>
        <label
          >选中<span>{{ multipleSelection.length }}</span
          >条</label
        >
      </div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <SetAttrWord ref="setattrword" @returnWords="returnWords" />
  </div>
</template>

<script>
import { batchDelete, getNewsDocumentList, delNewsDocument, disabledNewsDocument, addWordRelation } from '@/api/newApi/consultingCenter/consultingManage';
import { getCategoryByModuleType } from '@/api/newApi/consultingCenter/classifiManage';
import cacheQuery from '@/mixins/cacheQuery';
import SetAttrWord from '@/components/setattrword/index.vue';
import AttrWordBtn from './components/attrWordBtn.vue';
import UploadAndDownload from './components/uploadAndDownload.vue';
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      websiteUrl: '',
      mainId: '',
      isSwitchPage: '',
      form: {
        page: 1,
        limit: 20,
        title: '',
        enabled: '',
        categoryId: '',
        createTimeStart: '',
        createTimeEnd: '',
        createTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      categoryList: [],
      statusList: [
        { name: '已发布', value: '0' },
        { name: '未发布', value: '1' },
      ],
      searchFlag: false,
      multipleSelection: [],
      meatTit: this.$route.meta.title,
      setAttrType: 'add',
    };
  },
  components: {
    SetAttrWord,
    AttrWordBtn,
    UploadAndDownload,
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 0:
          return '已发布';
        case 1:
          return '未发布';
      }
    },
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCategory();
    this.getList();
  },
  mounted() {
    let path = this.meatTit === '资讯列表' ? '/article/realDetail' : '/article/type/caseDetail';
    this.websiteUrl = process.env.VUE_APP_BASE_WEBSITE_URL + path;
    this.mainId = localStorage.enterpriseId;
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    goSetAttrWord(type) {
      this.setAttrType = type;
      this.$refs.setattrword.dialogVisible = true;
    },
    deleteReal() {
      let ids = [];
      this.multipleSelection.forEach((item) => {
        ids.push(item.id);
      });
      if (ids.length > 0) {
        this.$confirm('确认删除掉已选中的文章吗？删除后不可恢复。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then((res) => {
          let newsType = this.meatTit == '资讯列表' ? 'INFORMATION' : 'CASE';
          batchDelete({ ids, newsType }).then(
            (res) => {
              if (res.code === 0) {
                this.getList();
                this.$message('删除成功！');
              }
            },
            (err) => {
              this.$message('删除失败！');
            }
          );
        });
      } else {
        this.$message('请先选择要删除的文章');
      }
    },
    // 设置属性词
    async returnWords(words) {
      let documentIds = [];
      this.multipleSelection.map((ele) => {
        documentIds.push(ele.id);
      });
      let parmas = {
        attributeWordIds: words,
        documentIds: documentIds,
      };
      let url = this.setAttrType === 'cover' ? '/information/documentAttributeWordRelation/cover' : undefined;
      let { code, data } = await addWordRelation(parmas, url);
      if (code === 0) {
        this.$message({
          message: '设置成功',
          type: 'success',
        });
        this.$refs.setattrword.dialogVisible = false;
        this.getList();
      }
    },
    getList() {
      this.tableLoading = true;
      if (this.form.createTime && this.form.createTime.length) {
        [this.form.createTimeStart, this.form.createTimeEnd] = this.form.createTime;
      } else {
        [this.form.createTimeStart, this.form.createTimeEnd] = ['', ''];
      }
      if(!this.isSwitchPage){
        this.form.page = 1
      }
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      getNewsDocumentList({
        // 资讯与案例共用页面，逻辑相同，提交的newsType参数不同
        newsType: this.$route.name === 'xcloudplat_consultingList' ? 'INFORMATION' : 'CASE',
        ...formData,
      })
        .then((res) => {
          if(!this.isSwitchPage){
            this.multipleSelection = [];
            this.$refs.multipleTable.clearSelection();
          }
          this.isSwitchPage=false
          this.list = res.data.records;
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
          this.searchFlag = false;
        });
    },
    _getCategory() {
      getCategoryByModuleType(this.meatTit === '案例管理' ? 3 : 2).then((res) => {
        this.categoryList = res.data;
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.isSwitchPage=true
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    add() {
      let name = this.$route.name;
      // 去往资讯编辑 & 案例编辑
      if (name === 'xcloudplat_consultingList') {
        this.$router.push({
          path: '/consultingList/add',
        });
      } else {
        this.$router.push({
          path: '/caseList/add',
        });
      }
    },
    edit(id) {
      let name = this.$route.name;
      // 去往资讯编辑 & 案例编辑
      if (name === 'xcloudplat_consultingList') {
        this.$router.push({
          path: '/consultingList/add',
          query: {
            id,
          },
        });
      } else {
        this.$router.push({
          path: '/caseList/add',
          query: {
            id,
          },
        });
      }
    },
    detail(id) {
      this.$router.push({
        path: '/consultingList/detail',
        query: {
          id,
        },
      });
    },
    del(id) {
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        delNewsDocument(id).then((res) => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
    disabled(row) {
      this.$confirm(`是否确认${row.enabled === 0 ? '取消' : ''}发布?`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning',
        center: true,
      }).then(() => {
        this.tableLoading = true;
        disabledNewsDocument(row.id, 1 - row.enabled)
          .then((res) => {
            if (res.code == 0) {
              this.$message('操作成功');
              this.getList();
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  display: flex;
  align-items: center;
  height: auto;
}
.header-container {
  overflow: visible;
}
.itemnum {
  float: left;
  margin-left: 20px;
  color: #333;
  display: flex;
  align-items: center;
  > span {
    cursor: pointer;
    padding: 2px 12px;
    border: 1px solid #ddd;
    &:hover {
      background: #1890ff;
      color: #fff;
      border-color: #1890ff;
    }
  }
  > label {
    padding-left: 10px;
    > span {
      padding: 0 4px;
      color: #1890ff;
    }
  }
}
.clearfix::before {
  content: '';
  display: block;
  clear: both;
}
</style>
