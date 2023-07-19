<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="弹窗标题" prop="title">
            <el-input class="form-item" v-model="form.title" placeholder="请输入弹窗标题" clearable size="small" />
          </el-form-item>
          <el-form-item label="发布人" prop="createId">
            <el-select class="form-item" placeholder="请选择" size="small" filterable clearable v-model="form.createId">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="createTime">
            <el-date-picker
              class="form-item-date-range"
              v-model="form.createTime"
              type="daterange"
              clearable
              :picker-options="dateOptions"
              start-placeholder="开始时间"
              range-separator="至"
              end-placeholder="结束时间"
              unlink-panels
              :default-time="[, '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button
                type="primary"
                size="small"
                class="green-btn"
                @click="addSystemNotice"
                v-show="hasAuthority('H2_19')"
              >
                <i class="icon icon-square-add"></i>
                <span>新建弹框</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="list"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        :height="tableHeight"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="弹框标题"
          min-width="300px"
          show-overflow-tooltip
          prop="title"
        ></el-table-column>
        <el-table-column align="center" label="状态" min-width="150px" show-overflow-tooltip prop="isSend">
          <template slot-scope="{ row }">
            {{ row.isSend | filterIsSend }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="发布人"
          min-width="150px"
          show-overflow-tooltip
          prop="sendName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="发布时间"
          min-width="200px"
          show-overflow-tooltip
          prop="sendTime"
        ></el-table-column>
        <el-table-column align="center" width="188" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="预览" placement="top">
              <el-link type="primary" :underline="false" @click="preview(scope.row.id)" v-show="hasAuthority('H2_20')">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="停用" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="disabledSystemNotice(scope.row.id)"
                v-if="hasAuthority('H2_21') && scope.row.isSend === 2"
              >
                <i class="icon icon-disable"></i>
              </el-link>
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
  </div>
</template>

<script>
import { getAnnouncementList } from "@/api/newApi/messageCenter/noticeManage";
import { stopAnnouncementById } from "@/api/newApi/consultingCenter/systemNotice";
import cacheQuery from "@/mixins/cacheQuery";
import { getUserNormal } from "@/api/user.js";
export default {
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date > new Date().setHours(23, 59, 59);
        },
      },
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        title: "",
        createId: "",
        // 查看类型，0客户端公告 1系统公告 2全部公告(默认客户端公告)
        showType: 1,
        createTime: [],
      },
      cacheKey: "form",
      copyListQuery: {},
      searchFlag: false,
      userList: [],
    };
  },
  filters: {
    filterIsSend(isSend) {
      let result = isSend;
      switch (isSend) {
        case 0:
          result = "已停用";
          break;
        case 2:
          result = "运行中";
          break;
      }
      return result;
    },
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getUserList();
  },
  methods: {
    formatTime() {
      [this.form.createTimeStart, this.form.createTimeEnd] =
        this.form.createTime && this.form.createTime.length ? this.form.createTime : ["", ""];
    },
    getList() {
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, ...data } = this.form;
      getAnnouncementList(data)
        .then((res) => {
          this.list = res.data.records;
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
          this.searchFlag = false;
        });
    },
    // 获取发布人列表
    getUserList() {
      getUserNormal().then((res) => {
        if (res.code === 0) {
          this.userList = res.data;
        }
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
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    addSystemNotice() {
      this.$router.push({
        path: "/systemNotice/detail",
        query: {
          flag: "addOrEdit",
        },
      });
    },
    preview(id) {
      this.$router.push({
        path: "/systemNotice/detail",
        query: {
          id,
          flag: "preview",
        },
      });
    },
    disabledSystemNotice(id) {
      this.$confirm(`是否停用?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true,
      }).then(() => {
        this.tableLoading = true;
        stopAnnouncementById({
          id,
        })
          .then((res) => {
            if (res.code == 0) {
              this.$message("操作成功");
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
@import "@/styles/fixedSearch.scss";
.form-item {
  width: 180px;
}
.form-item-date-range {
  width: 340px;
}
</style>
