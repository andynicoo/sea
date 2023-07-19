<template>
  <div class="app-container">
    <div class="item">
      <Title class="title" titieName="基础信息"></Title>
      <el-form label-position="left" label-width="100px" class="message">
        <el-form-item label="推广人姓名">
          {{ userinfo.adminUserName }}
        </el-form-item>
        <el-form-item label="推广人手机号">
          {{ userinfo.adminUserMobile }}
        </el-form-item>
        <!-- <el-form-item label="部门名称"> {{ userinfo.channelName }} </el-form-item>
      <el-form-item label="企业名称"> {{ userinfo.channelName }} </el-form-item> -->
      </el-form>
    </div>

    <div class="item">
      <!-- <p class="title">链接信息</p> -->
      <Title class="title" titieName="链接信息"></Title>
      <el-table border class="table" :data="list" v-loading="listLoading" ref="table" :height="settableHeight">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="链接名称">
          <template slot-scope="scope">{{ scope.row.pageName }}</template>
        </el-table-column>
        <el-table-column align="center" label="网页链接">
          <template slot-scope="scope">{{ scope.row.pageUrl }}</template>
        </el-table-column>
        <el-table-column align="center" label="浏览量PV">
          <template slot-scope="scope">{{ scope.row.pvCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="浏览用户UV">
          <template slot-scope="scope">{{ scope.row.uvCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="注册用户数">
          <template slot-scope="scope">{{ scope.row.registerCount }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="付费用户数">
          <template slot-scope="scope"> {{ scope.row.paidCount }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="创建人">
          <template slot-scope="scope"> {{ scope.row.createName }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-danger flex-item" v-if="scope.row.status == 0">
              <img src="@/assets/images/zt-upgrade-1/stuts_jinyong.svg" />
              禁用
            </span>
            <span class="text-success flex-item" v-else-if="scope.row.status == 1">
              <img src="@/assets/images/zt-upgrade-1/stuts_qiyong_yfb.svg" />
              启用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ scope, row }">
            <Button label="small" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="row.pageUrl + (row.pageUrl.indexOf('?') !== -1 ? '&' : '?') + 'promteCode=' + row.promteCode" @click="copyLink">复制链接</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal || 0"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDeatil } from '@/api/newApi/extension/promotionExtend.js';
import Title from '@/components/title/index';
export default {
  components: {
    Title,
  },
  data() {
    return {
      // 分页
      list: [],
      listTotal: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        service: '',
        status: '',
        level: 1,
      },
      userinfo: {},
      sourceData: {},
    };
  },
  created() {
    this.getDetail();
  },
  computed: {
    settableHeight() {
      return this.tableHeight + 200;
    },
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      getDeatil({
        pageIndex: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        channelId: this.$route.query.channelId,
      }).then((res) => {
        // 延迟loading关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
        if (res.code == 0) {
          // 设置列表和总条数
          this.userinfo = res.data;
          this.sourceData = res;
          // this.list = res.data.records;
          let data = this.publicDataPaging();
          this.list = data.records;
          this.listTotal = Number(data.total) || 0;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getDetail();
      // this.publicDataPaging();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getDetail();
      // this.publicDataPaging();
    },
    //复制链接
    copyLink(row) {
      let _this = this;
      let clipboard = new this.clipboard('.cobyOrderSn');
      console.log('clipboard', clipboard);
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },

    /**
     * 前端自动分页设置
     */
    publicDataPaging(limit, page, source = this.sourceData) {
      let { code, data, message } = source;
      // console.log(11);
      if (code == 0) {
        let total = data.records.length;
        return this.setNewDetailObj(total);
      }
    },

    setNewDetailObj(total) {
      let { pageNo, pageSize } = this.listQuery,
        records = total == 0 ? [] : this.getNewList();
      let obj = {
        current: pageNo, //当前页
        pages: Math.ceil(total / pageSize), //总页数
        size: pageSize, // 每页数据量
        total: total, //总数据量
        records,
      };
      // console.log(obj);
      return obj;
    },
    /**
     * 返回新数据
     */
    getNewList() {
      let {
          sourceData: {
            data: { records },
          },
          listQuery: { pageNo, pageSize },
        } = this,
        beforeEnd = 0,
        beforeStart = 0,
        start = 0,
        end = 0;
      beforeEnd = pageNo * pageSize; //数组结束下标等于：第几页 * 数据量
      end = beforeEnd >= records.length ? records.length : beforeEnd; //数组结束值数组结束下标
      beforeStart = Math.abs((pageNo - 1) * pageSize); // 数组开始下标等于 总数量 - 已经展示过的数据
      start = beforeStart < 0 ? 0 : beforeStart; //数组起始下标
      // console.log("end11", end);
      // console.log("start", start);
      return records.slice(start, end);
    },
  },
};
</script>
<style lang="less" scoped>
.app-container {
}
.title {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  padding: 15px 0;
}
.item {
  border: 1px solid #eeeeee;
  padding-left: 20px;
  padding-top: 15px;
  .table {
    height: calc(624px - 205px);
  }

  .message {
    display: grid;
    grid-template-columns: repeat(4, 25%);
  }
}
.pagination-container {
  margin-top: 24px;
}
.flex-item {
  display: flex;
  justify-items: center;
  justify-content: center;
}
</style>
