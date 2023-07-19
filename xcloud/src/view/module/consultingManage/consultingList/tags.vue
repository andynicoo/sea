<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="资讯标题" prop="labelName">
            <el-input v-model="form.labelName" placeholder="请输入资讯标题" clearable style="width: 168px" size="small" />
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button class="zt-mr-2" @click="downloadTemp()"> 下载模板 </el-button>
            <el-upload class="tagup" :action="baseUrl + '/information/label/upload'" :headers="uploadHeaders" :multiple="false" accept=".xls" :show-file-list="false" :limit="1" :on-success="updateSucess" :on-error="updateError" :on-progress="updateProgress" v-show="hasAuthority('UPLOAD_LAB')">
              <el-button size="small" type="primary" :loading="tagUploading">上传标签</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签名称" width="180px" show-overflow-tooltip prop="labelName">
          <template slot-scope="scope">
            <p style="width: 155px" class="yincang">
              {{ scope.row.labelName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="SEO标题" width="180px" show-overflow-tooltip prop="seoTitle">
          <template slot-scope="scope">
            <p style="width: 155px" class="yincang">
              {{ scope.row.seoTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" label="关键词" show-overflow-tooltip prop="keyword">
          <template slot-scope="scope">
            <p style="width: 175px" class="yincang">
              {{ scope.row.keyword }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="SEO描述" show-overflow-tooltip prop="seoDescribe">
          <template slot-scope="scope">
            <p class="desc11">
              {{ scope.row.seoDescribe }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="创建人" show-overflow-tooltip prop="createName"> </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="editTag(scope.row)" v-show="hasAuthority('EDIT_LAB')"> 编辑 </el-link>
            <el-link type="danger" @click="delTag(scope.row.id)" v-show="hasAuthority('DEL_LAB')"> 删除 </el-link>
            <el-link type="primary" @click="editSeoFrom(scope.row)" v-show="hasAuthority('LABS_SEO')"> SEO设置 </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- seo设置 -->
    <el-dialog title="seo设置" :visible.sync="editSEO" :close-on-click-modal="false" width="550px" :before-close="handleClose" :destroy-on-close="true">
      <EditSEO v-if="editSEO" :type="'tags'" :info="info" @subSeoInfo="subSeoInfo" />
    </el-dialog>

    <!-- 编辑标签 -->
    <el-dialog title="编辑标签" :visible.sync="editTags" :close-on-click-modal="false" width="550px" :before-close="handleCloseTag" :destroy-on-close="true">
      <el-form :model="curTagVal" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="curTagVal.labelName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editTags = false">取消</el-button>
          <el-button type="primary" @click="sureTags()">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import EditSEO from '@/components/siteconfig/EditSeo.vue';
import { getToken } from '@/libs/util';

import { getTagsPage, deleteTag, editTag } from '@/api/newApi/consultingCenter/consultingManage';
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        current: 1,
        size: 20,
        labelName: '',
      },
      searchFlag: false,
      editSEO: false,
      info: {}, // seo设置
      editTags: false,
      curTagVal: {},
      tagUploading: false,
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken(),
        enterpriseId: localStorage.getItem('enterpriseId'),
      },
    };
  },
  components: {
    EditSEO,
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      getTagsPage(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
          }
        })
        .finally(() => {
          this.tableLoading = false;
        })
        .catch((err) => {
          this.searchFlag = false;
        });
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
    search() {
      this.searchFlag = true;
      this.form.currentcurrent = 1;
      this.getList();
    },
    reset() {
      this.form.labelName = '';
      this.search();
    },
    editSeoFrom(row) {
      console.log(row);
      let { seoTitle, keyword, seoDescribe, id } = row;
      this.info.seoTitle = seoTitle;
      this.info.keyword = keyword;
      this.info.seoDescribe = seoDescribe;
      this.info.id = id;
      this.editSEO = true;
    },
    subSeoInfo() {
      this.editSEO = false;
      this.getList();
    },
    handleClose() {
      this.editSEO = false;
    },
    delTag(id) {
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        deleteTag({ id: id }).then((res) => {
          if (res.code === 0) {
            this.getList();
          }
        });
      });
    },
    editTag(item) {
      this.editTags = true;
      this.curTagVal = {
        id: item.id,
        labelName: item.labelName,
      };
    },
    sureTags() {
      editTag(this.curTagVal).then((res) => {
        if (res.code === 0) {
          this.$message.success('编辑成功');
          this.handleCloseTag();
          this.getList();
        }
      });
    },
    handleCloseTag() {
      this.editTags = false;
    },
    updateSucess(response, file, fileList) {
      console.log(response, file, fileList);
      let { code } = response;
      if (code === 0) {
        this.$message.success('上传成功!');
        this.search();
      }
      setTimeout(() => {
        this.tagUploading = false;
      }, 1000);
    },
    updateError(err, file, fileList) {
      console.log(err, file, fileList);
      this.$message.error('请检查文件后重试！');
      setTimeout(() => {
        this.tagUploading = false;
      }, 1000);
    },
    updateProgress(file) {
      console.log(file);
      this.tagUploading = true;
    },
    downloadTemp() {
      window.open('/temp/labeltemp.xls');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';

.tagup {
  display: inline-block;
}
.desc11 {
  max-width: 600px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.yincang {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
