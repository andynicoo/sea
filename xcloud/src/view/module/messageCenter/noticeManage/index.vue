<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline>
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="请输入标题" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="客户手机号">
            <el-input
              v-model="form.customersMobile"
              placeholder="请输入客户手机号"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="发送时间">
            <el-date-picker
              v-model="form.sendTime"
              type="datetimerange"
              align="right"
              size="small"
              clearable
              unlink-panels
              range-separator="到"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="default" @click="handleReset" icon="el-icon-refresh">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" size="small" @click="add(0)" icon="el-icon-message" v-if="hasAuthority('G2_5')">
              发送公告
            </el-button>
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
        :height="tableHeight"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        >
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="标题" show-overflow-tooltip prop="title"></el-table-column>
        <el-table-column align="center" label="公告类型" show-overflow-tooltip prop="type">
          <template slot-scope="scope">{{ scope.row.type | filterType }}</template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          width="300"
          label="内容描述"
          show-overflow-tooltip
          prop="content"
        >
          <template slot-scope="scope">{{$Base64.decode(scope.row.content)}}</template>
        </el-table-column> -->
        <el-table-column align="center" label="是否发送" show-overflow-tooltip prop="isSend">
          <template slot-scope="scope">{{ scope.row.isSend | filterIsSend }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="发送时间"
          show-overflow-tooltip
          prop="sendTime"
          sortable
        ></el-table-column>
        <el-table-column align="center" label="发送人" show-overflow-tooltip prop="sendName"></el-table-column>
        <el-table-column align="center" width="170" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('G2_6')">
              <el-link type="primary" :underline="false" @click="detail(scope.row.id)" class="icon icon-see"></el-link>
            </el-tooltip>
            <template v-if="scope.row.isSend === 1">
              <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('G2_7')">
                <el-link type="primary" :underline="false" @click="add(scope.row.id)" class="icon icon-edit"></el-link>
              </el-tooltip>
              <el-tooltip effect="dark" content="立刻发送" placement="top" v-if="hasAuthority('G2_8')">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="sendImme(scope.row.id)"
                  class="icon icon-receipt"
                ></el-link>
              </el-tooltip>
            </template>
            <el-tooltip effect="dark" content="删除" placement="top" v-else-if="hasAuthority('G2_81')">
                <el-link
                  type="primary"
                  class="icon icon-del"
                  :underline="false"
                  @click="handleRemove(scope.row)"
                >
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
import { getAnnouncementList, sendAnnouncement,delAnnouncement } from "@/api/newApi/messageCenter/noticeManage";
import cacheQuery from '@/mixins/cacheQuery'
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        title: "",
        customersMobile: "",
        createTimeStart: "",
        createTimeEnd: "",
        sendTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      searchFlag: false,
      moreSerch: false,
    };
  },
  filters: {
    filterIsSend(isSend) {
      switch (isSend) {
        case 1:
          return "未发送";
        case 2:
          return "已发送";
      }
    },
    filterType(type) {
      switch (type) {
        case 1:
          return "通知";
        case 2:
          return "公告";
        case 3:
          return "弹窗公告";  
      }
    },
  },
  mixins: [cacheQuery],
  mounted() {
    this.copyListQuery = {...this.form}
    this.getPageCache()
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      if (this.form.sendTime && this.form.sendTime.length) {
        [this.form.createTimeStart, this.form.createTimeEnd] = this.form.sendTime;
      } else {
        [this.form.createTimeStart, this.form.createTimeEnd] = ["", ""];
      }
      this.setPageCache()
      let {sendTime, ...formData} = this.form
      getAnnouncementList(formData)
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
    /**
     * 分页
     */
    handleReset() {
      this.form = {...this.copyListQuery}
      this.removePageCache()
      // this.form = {
      //   page: 1,
      //   limit: 20,
      //   title: "",
      //   customersMobile: "",
      //   createTimeStart: "",
      //   createTimeEnd: "",
      // };
    },
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
    detail(id) {
      this.$router.push({
        name: "noticeManageDetail",
        params: {
          id,
        },
      });
    },
    add(id) {
      this.$router.push({
        name: "noticeManageAdd",
        params: {
          id,
        },
      });
    },
    // 立刻发送
    sendImme(id) {
      this.$confirm("是否确认立刻发送！", "提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        sendAnnouncement(id).then((res) => {
          if (res.code === 0) {
            this.$message.success("发送成功");
            this.getList();
          }
        });
      });
    },
    //删除公告通知
    handleRemove (row) {
      this.$Modal.confirm({
        title: '删除公告',
        content:`确定删除？${row.title}`,
        onOk: () => {
          delAnnouncement(row.id).then(res => {
            if (res.code === 0) {
              this.$Message.success('删除成功')
              this.getList();
            }
          })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
// .app-container .header-container {
//     margin-bottom: 0;
// }
</style>
