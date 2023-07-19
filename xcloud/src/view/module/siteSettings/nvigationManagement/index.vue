<!-- 合作伙伴  -->
<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader>
          <template slot="left">导航管理</template>
          <el-button slot="right" type="primary" @click="addFirstNav">新增导航</el-button>
        </SiteSettingsModularHader>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <el-table ref="table" border :data="list" row-key="navId" :height="tableHeight" v-loading="tableLoading" highlight-current-row element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column show-overflow-tooltip align="center" label="导航名称" prop="name"></el-table-column>
        <el-table-column align="center" label="导航类型">
          <template slot-scope="scope">
            <!-- <el-link v-if="scope.parentId" type="primary" href="https://baidu.com">{{ scope.link1 }}</el-link> -->
            <span>{{ scope.row.parentId == 0 ? '一级导航' : '二级导航' }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="简介" prop="info"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="链接地址" prop="link">
          <template slot-scope="scope">
            <el-link v-if="scope.row.link" type="primary" :href="scope.row.link">{{ scope.row.link }}</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="是否启用" prop="isEnable">
          <template slot-scope="scope">
            {{ scope.row.status == true ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="排序" prop="sort"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="是否新窗口打开" prop="openType">
          <template slot-scope="scope">
            {{ scope.row.openType == true ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作人" prop="updateBy"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="350px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" v-if="scope.row.level == 1" class="" content="编辑" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-edit" @click.stop="editNav(1, scope.row)"></el-link>
            </el-tooltip>
            <el-link v-if="scope.row.level == 1 && scope.row.subordinate == true" type="primary" :underline="false" @click.stop="addSecondNav(scope.row)">新增二级导航</el-link>

            <el-link v-if="scope.row.level == 2" type="primary" :underline="false" @click.stop="editNav(2, scope.row)">编辑二级导航</el-link>
            <el-link v-if="scope.row.level == 2 && scope.row.subordinate == true" type="primary" :underline="false" @click.stop="addthreeNav(scope.row)">编辑三级导航</el-link>
            <el-tooltip effect="dark" class="" content="删除" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-del" @click.stop="deleteRow(scope.row)"></el-link>
            </el-tooltip>
            <el-link type="primary" :underline="false" @click="editSeoFrom(scope.row)" v-show="hasAuthority('DH_ADD')"> SEO设置 </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- pagination -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 一级二级导航 -->
    <SecondNav :title="setSeconNavTitlt" :show.sync="isOpenNav" v-if="isOpenNav" />
    <!-- 三级导航 -->
    <ThreeLayersModel :show.sync="isShowAddModel" dialogWidth="1300px" v-if="isShowAddModel" />

    <!-- seo设置 -->
    <el-dialog title="seo设置" :visible.sync="editSEO" :close-on-click-modal="false" width="550px" :before-close="handleClose" :destroy-on-close="true">
      <EditSEO v-if="editSEO" :info="info" @subSeoInfo="subSeoInfo" />
    </el-dialog>
  </div>
</template>

<script>
import SiteSettingsModularHader from '../components/siteSettingsModularHader.vue';
import EditSEO from '@/components/siteconfig/EditSeo.vue';
import { getNavigationList, delectNavigaiontion } from '@/api/newApi/siteSettings/index.js';
export default {
  provide() {
    return {
      highest: this,
    };
  },
  data() {
    return {
      tableLoading: false,
      isOpenNav: false, //打开弹窗
      isShowAddModel: false,
      listQuery: {
        current: 1,
        size: 20,
      },
      listTotal: 0,
      list: [],
      navLevel: 1, //导航等级
      outTimeSign: false,
      isQuery: false,
      isAdd: false,
      editId: undefined,
      rowInfo: null,
      treeID: null,
      editSEO: false,
      info: {}, // seo设置
    };
  },
  computed: {
    setSeconNavTitlt() {
      let title = '';
      if (this.navLevel == 1) {
        if (this.isAdd) {
          title = '新增导航';
        } else {
          title = '编辑导航';
        }
      } else {
        if (this.isAdd) {
          title = '新增二级导航';
        } else {
          title = '编辑二级导航';
        }
      }
      return title;
    },
  },
  components: {
    SecondNav: () => import('./navigation/second/fromCreate.vue'),
    ThreeLayersModel: () => import('./navigation/addModel/index.vue'),
    SiteSettingsModularHader,
    EditSEO,
  },

  created() {
    this.isQuery = true;
    this.getList();
  },

  methods: {
    getList() {
      clearTimeout(this.outTimeSign);
      this.tableLoading = true;
      this.outTimeSign = setTimeout(() => this.getNavigationListAPI(), 300);
    },

    async getNavigationListAPI() {
      this.outTimeSign = setTimeout(() => {
        this.tableLoading = false;
      }, 300);
      let { code, data } = await getNavigationList({ ...this.listQuery });
      if (code == 0) {
        this.list = this.setList(data);
        this.listTotal = Number(data.total);
        if (this.isQuery) {
          this.$message({
            message: `搜索完成，为您搜索${this.listTotal}条结果`,
            type: 'success',
            duration: 2000,
          });
          this.isQuery = false;
        }
      }
    },

    setList(data) {
      return data.records.map((item) => {
        function setChildren(children) {
          let list = [];
          children.forEach((element) => {
            element.level = 2;
            list.push(element);
          });
          return list;
        }

        Object.defineProperty(item, 'children', {
          value: setChildren(item.sonNavs),
          enumerable: true,
        });
        item.level = 1;
        return item;
      });
    },
    /**
     * 编辑导航
     * @param {*} level 层级
     * @param {*} row
     */
    editNav(level, row) {
      this.editId = row.navId;
      this.navLevel = level;
      this.setNavDialog(level, false);
    },

    /** 新增|| 编辑 层级导航 */
    setNavDialog(level, isAdd) {
      this.isAdd = isAdd;
      this.navLevel = level;
      this.isOpenNav = true;
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    /**新增一级导航 */
    addFirstNav() {
      this.setNavDialog(1, true);
    },
    /**新增二级导航 */
    addSecondNav(row) {
      this.rowInfo = row;
      this.setNavDialog(2, true);
    },
    addthreeNav(row) {
      this.isShowAddModel = true;
      this.treeID = row.navId;
    },
    /* delect */
    deleteRow(row) {
      this.$confirm('是否确定删除', '删除', {
        customClass: 'custom-confirm',
        center: true,
      })
        .then(async () => {
          let { code } = await delectNavigaiontion({ id: row.navId });
          if (code == 0) {
            this.$message.success('操作成功');
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `您已取消删除`,
          });
        });
    },
    editSeoFrom(row) {
      console.log(row);
      let { seoTitle, keyword, seoDescribe, navId } = row;
      this.info.seoTitle = seoTitle;
      this.info.keyword = keyword;
      this.info.seoDescribe = seoDescribe;
      this.info.id = navId;
      this.editSEO = true;
    },
    subSeoInfo() {
      this.editSEO = false;
      this.getList();
    },
    handleClose() {
      this.editSEO = false;
    },
  },
};
</script>
<style lang="less" scoped>
.table-image {
  width: 40px;
}
</style>
