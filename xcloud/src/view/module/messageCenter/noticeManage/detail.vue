<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="back" @click="goBack()">
        <Icon type="ios-arrow-back" />
        返回列表
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="state">
          <span>
            <span>{{ info.title }}</span>
            <span class="statusStyle">
              <span class="talkbubble">{{ info.isSend | filterIsSend }}</span>
            </span>
          </span>
        </div>

        <el-descriptions>
          <el-descriptions-item label="公告类型">{{ info.type | filterType }}</el-descriptions-item>
          <el-descriptions-item label="发送时间">{{ info.sendTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border-box" style="margin: 20px 0">
        <div class="block-title big-size">基础信息</div>
        <el-descriptions>
          <el-descriptions-item label="公告类型">{{ info.type | filterType }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ info.title }}</el-descriptions-item>
          <el-descriptions-item label="发送时间">{{ info.sendTime }}</el-descriptions-item>
          <el-descriptions-item label="发送人">{{ info.sendName }}</el-descriptions-item>
          <el-descriptions-item label="修改人">{{ info.modifyName }}</el-descriptions-item>
          <el-descriptions-item label="修改时间">{{ info.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="页面位置" :span="3" v-if="info.type==3">
            {{navList.filter(item => info.pagePosition == item.value)[0].label}}
          </el-descriptions-item>
          <el-descriptions-item label="附件/图片" :span="3">
            <span v-for="(item, index) in info.fileList" :key="index">
              <el-image v-if="item.isImage" class="block-img" :src="item.url" :preview-src-list="[item.url]"></el-image>
              <div v-else style="margin-bottom: 5px">
                <el-link type="primary" :href="item.url" class="el-icon-paperclip">{{ item.name }}</el-link>
              </div>
            </span>
          </el-descriptions-item>

          <el-descriptions-item label="跳转链接" :span="3" v-if="info.type==3">
            {{info.url}}
          </el-descriptions-item>
          <el-descriptions-item label="内容" :span="3" v-else>
            <div v-html="info.content" style="word-break: break-all"></div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="table-container">
        <el-table border :data="list">
          <el-table-column align="center" label="序号" width="70">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户手机号" show-overflow-tooltip prop="userMobile"></el-table-column>
          <el-table-column align="center" label="昵称" show-overflow-tooltip prop="userNickName"></el-table-column>
          <el-table-column align="center" label="接收时间" show-overflow-tooltip prop="createTime" sortable></el-table-column>
          <el-table-column align="center" label="状态" show-overflow-tooltip prop="isRead">
            <template slot-scope="scope">{{ scope.row.isRead | filterIsRead }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="app-container" style="padding-top: 20px">
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
    </div>
  </div>
</template>

<script>
import { getAnnouncementAllInfo, announcementUserList } from "@/api/newApi/messageCenter/noticeManage.js";
import { getNavigationList } from '@/api/newApi/siteSettings/index.js';
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.id,
      list: [],
      info: {},
      total: 0,
      form: {
        page: 1,
        limit: 20,
      },
      navList:[
        {label:"首页",value:"index"},
        {label:"商标查询",value: "search"},
        {label:"产品服务",value: "productservice"},
        {label:"商标转让",value: "trademarktransfer"}
      ]
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
    filterIsRead(isRead) {
      switch (isRead) {
        case 1:
          return "未读";
        case 2:
          return "已读";
      }
    },
  },
  async created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getInfo();
      this.getList();
    },
    getInfo() {
      return new Promise((resolve) => {
        getAnnouncementAllInfo(this.id).then((res) => {
          let result = res.data;
          result.content = this.$Base64.decode(result.content);
          let imgSuffix = ["jpg", "png", "jpge", "gif"];
          let files = result.files.split(",");
          let fileNames = result.fileNames.split(",");
          result.fileList = files
            .map((item, index) => ({
              isImage: imgSuffix.includes(item.substr(item.lastIndexOf(".") + 1).toLowerCase()),
              name: fileNames[index],
              url: files[index].replace("http:", "https:"),
            }))
            .sort((a, b) => a.isImage - b.isImage);
          this.info = result;
          resolve();
        });
      });
    },
    getList() {
      this.tableLoading = true;
      announcementUserList(this.id, this.form).then((res) => {
        this.list = res.data.records;
        this.total = parseInt(res.data.total);
        this.tableLoading = false;
      });
    },
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    // 返回
        ...mapMutations(["closeTag"]),
    goBack() {
      this.closeTag(this.$route)
      this.$router.push("/messageCenter/noticeManage/index");
    },
  },
};
</script>

<style lang="scss" scoped>
.block-title{
  margin-bottom: 20px;
}
.back {
  margin-bottom: 20px;
  cursor: pointer;
}
.border-box {
  border: 1px solid #eeeeee;
  margin: 30px 0;
  padding: 20px 30px;
}
::v-deep .el-descriptions-item__label {
  white-space: nowrap;
}
.saleDetail {
  .header-container {
    padding: 20px;
    background-color: #fff;
    .state {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 20px 0;
      .sn {
        font-size: 14px;
        margin-left: 5px;
        font-weight: bold;
      }
    }
  }
  .block-img {
    width: 200px;
    height: 100px;
    margin-right: 10px;
    cursor: zoom-in;
  }
  .table-title {
    font-size: 16px;
    padding: 20px 0;
    color: #333;
  }
  .check-btn {
    width: 100% !important;
    text-align: right !important;
    border-top: 1px solid #ccc;
  }
  .other-info-wrapper {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .ope-block {
      display: flex;
      margin-right: 30px;
      margin-bottom: 50px;
      .avatar {
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .ope-info {
        width: 250px;
        margin-left: 10px;
        .ope-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
