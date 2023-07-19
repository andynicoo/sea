<template>
  <div class="report-detail">
    <label class="back-btn" @click="back"><LeftOutlined class="icon" /><span>返回列表</span></label>
    <h6>活动详情</h6>
    <ul>
      <li>
        <span>活动标题：</span><span>{{ data.detailData.title }}</span>
      </li>
      <li>
        <span>活动时间：</span
        ><span>{{ data.detailData.startTime }} - {{ data.detailData.endTime }}</span>
      </li>
      <li>
        <span>参与对象：</span><span>{{ data.detailData.participants }}</span>
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
      <li>
        <span>主图：</span
        ><span class="img"><img :src="data.detailData.mainPicUrl" /></span>
      </li>
      <li>
        <span>报名二维码：</span
        ><span class="img"><img :src="data.detailData.applyCord" /></span>
      </li>
      <li>
        <span>活动详情：</span><span v-html="data.detailData.activityDetail"></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { LeftOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { getDetail } from "@/api/saasManage/kownManage/activityList";
import { useRoute } from "vue-router";
import { reactive, ref, onBeforeMount } from "vue";
import { jumpPage, useButton } from '@/utils/utils';

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
  jumpPage(`/saasmanage/knowManage/activityList`);
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
    width: 70%;
    padding-left: 20px;
    > li {
      display: flex;
      margin-bottom: 20px;
      > span:first-child {
        text-align: right;
        flex-basis: 90px !important;
        max-width: 90px;
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
</style>
