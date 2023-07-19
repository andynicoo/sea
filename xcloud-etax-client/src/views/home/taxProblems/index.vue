<template>
  <div class="container">
    <div class="headContent">
      <div class="top">
        <Breadcrumb>
          <BreadcrumbItem>
            <span class="flink">工作台</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span class="clink">税务问题</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="bottom">
        税务问题
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="taxProblems">
          <div class="item"
               @click="selected(item, index)"
               v-for="(item, index) in bulletinsList"
               :key="index"
               :class="{'active': chooseIndex == index}">
            【VAT知识】{{item.bulletinTitle}}
          </div>
        </div>
        <div class="pageSetion">
          <Page class="pagination"
                size="small"
                v-if="bulletinsListTotal > 10"
                :current="bulletinsForm.page"
                :total="bulletinsListTotal"
                @on-change="registerChangePageHandler"
                :page-size="bulletinsForm.limit" />
        </div>
      </div>
      <div class="right">
        <div v-html="bulletinContent"></div>
      </div>
    </div>

  </div>
</template>

<script>
import { bulletinsHomeList } from "@/api/home/home";
export default {
  data() {
    return {
      bulletinsList: [],
      bulletinsForm: {
        limit: 10,
        page: 1,
        bulletinType: 8,
      },
      bulletinsListTotal: 0,
      bulletinContent: '',
      chooseIndex: this.$route.query.index || 0
    }
  },
  mounted() {
    // this.getBulletinsHomeList()
  },
  methods: {
    // 客户端资讯列表
    getBulletinsHomeList() {
      bulletinsHomeList(this.bulletinsForm).then(res => {
        if (res.code === 0) {
          this.bulletinsList = res.data.records
          this.bulletinsListTotal = res.data.totalCount - 0
          this.bulletinContent = decodeURIComponent(this.bulletinsList[0].bulletinContent)
        }
      })
    },
    registerChangePageHandler(page) {
      this.bulletinsForm.page = page;
      this.getBulletinsHomeList();
    },
    selected(item, index) {
      this.chooseIndex = index
      this.bulletinContent = decodeURIComponent(item.bulletinContent)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: calc(100vh - 60px);
  .headContent {
    height: 100px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
  }
  .content {
    padding: 24px;
    display: flex;
    align-items: center;
    height: calc(100vh - 160px);
    justify-content: center;
    .left {
      height: 100%;
      background: #ffffff;
      flex: 0 0 300px;
      margin-right: 24px;
      .taxProblems {
        .item {
          font-size: 12px;
          font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 22px;
          padding: 12px 18px;
          border-bottom: 1px solid #e9e9e9ff;
          cursor: pointer;
        }
        .active {
          color: #1890ff;
        }
      }
    }
    .right {
      flex: 1;
      height: 100%;
      background: #ffffff;
      padding: 16px 24px;
    }
  }
  .pageSetion {
    text-align: center;
    margin-top: 20px;
    .pagination {
      display: inline-block;
      line-height: 20px;
    }
    .totalNum {
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
</style>