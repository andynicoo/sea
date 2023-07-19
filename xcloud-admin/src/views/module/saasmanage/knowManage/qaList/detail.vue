<template>
  <div class="report-detail">
    <label class="back-btn" @click="back"><LeftOutlined class="icon" /><span>返回列表</span></label>
    <h6>报告详情</h6>
    <ul>
      <li>
        <span>问答分类：</span><span>{{ data.detailData.categoryName }}</span>
      </li>
      <li>
        <span>问答标题：</span><span>{{ data.detailData.title }}</span>
      </li>
      <li>
        <span>提问人：</span><span>{{ data.detailData.questioner }}</span>
      </li>
      <li>
        <span>seo标题：</span><span>{{ data.detailData.seoTitle }}</span>
      </li>
      <li>
        <span>seo关键词：</span><span>{{ data.detailData.keyword }}</span>
      </li>
      <li>
        <span>seo描述：</span><span>{{ data.detailData.seoDescribe }}</span>
      </li>
      <li>xcloudplat_saasManage_activity_create
        <span>问题描述：</span><span v-html="data.detailData.questionDescribe"></span>
      </li>
      <li>
        <span>回答：</span>
        <AnswerTable :dataSource="data.detailData.answerDTOList" :operation="false" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { LeftOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { getDetail } from "@/api/saasManage/kownManage/qaList";
import { useRoute } from "vue-router";
import { jumpPage, useButton } from '@/utils/utils';
import { reactive, ref, onBeforeMount } from "vue";
import AnswerTable from "./components/answerTable.vue";

const data = reactive({
  id: "",
  detailData: {},
});

onBeforeMount(() => {
  const router = useRoute();
  data.id = router.query.id;
  getReportDetail();
});

async function getReportDetail() {
  let result = await getDetail({ id: data.id });
  data.detailData = result || {};
}

function back() {
  jumpPage(`/saasmanage/knowManage/qaList`);
}
</script>

<style scoped lang="less">
.report-detail {
  background: #fff;
  padding: 20px;
  .back-btn {
    color: #333;
    font-size: 14px;
    display: block;
    line-height: 30px;
    margin-bottom: 6px;
    cursor: pointer;
    &:hover {
      color: #2090ff;
    }
    .icon {
      margin-right: 5px;
    }
  }
  > h6 {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    line-height: 40px;
    padding-left: 4px;
    margin-bottom: 5px;
  }
  > ul {
    width: 90%;
    padding-left: 20px;
    > li {
      display: flex;
      margin-bottom: 20px;
      > span:first-child {
        text-align: right;
        flex-basis: 90px !important;
        max-width: 90px;
        min-width: 90px;
      }
      > span {
        flex: 1;
        > img {
          width: 180px;
          height: 180px;
        }
      }
    }
  }
}
:deep(.answer-table) {
  margin-left: 0;
}
</style>
