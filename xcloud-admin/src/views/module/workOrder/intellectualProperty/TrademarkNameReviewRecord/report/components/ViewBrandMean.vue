<template>
  <div class="view-page">
    <a-row class="panel-hd" justify="space-between">
      <h4><slot name="title"></slot></h4>
      <a-button type="link" v-if="detail.meaningCheckUrl" @click="hide = !hide">{{ !hide ? '收起' : '展开' }}</a-button>
    </a-row>
    <div class="panel-bd">
      <div class="result-wrap">
        <h6>商标含义检索结果</h6>
        <div class="content result-text">
          <div class="result-text-item">
            <!-- <h6>商标含义部分：</h6> -->
            <a-textarea :value="mean" :autoSize="true" disabled></a-textarea>
          </div>
        </div>
      </div>
      <div class="imgs-wrap" v-if="detail.meaningCheckUrl" v-show="!hide">
        <h6>商标含义截图上传</h6>
        <a-row>
          <a-image-preview-group>
            <a-image
              height="150px"
              v-for="(img, index) in detail.meaningCheckUrl.split(',')"
              :key="index"
              :src="img"
            ></a-image>
          </a-image-preview-group>
        </a-row>
      </div>
    </div>
    <div class="slider"></div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';

interface Props {
  detail: any;
}
const props = defineProps<Props>();
const hide = ref(false);
const mean = computed(() => {
  if (props.detail?.checkConclusion) {
    return JSON.parse(props.detail.checkConclusion)?.mean;
  } else {
    return '';
  }
});
</script>
<style lang="less" scoped>
.view-page {
  .panel-hd {
    padding: 10px 20px;
    border-bottom: 1px solid rgba(#000, 0.06);
    h4 {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .panel-bd {
    padding: 20px;
    h6 {
      font-size: 16px;
    }
    .result-wrap {
      margin-bottom: 20px;
      .content {
        background: #eee;
        min-height: 100px;
        padding: 10px;
        margin: 10px 0 0;
        h6 {
          margin-bottom: 10px;
        }
      }
    }
    .imgs-wrap {
      .ant-row {
        // margin: 10px 0 0;
        ::v-deep .ant-image {
          margin: 10px;
        }
      }
    }
  }
  .slider {
    height: 10px;
    background: #f0f2f5;
  }
  .result-text {
    &-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      p {
        color: #999;
      }
    }
  }
}
</style>
