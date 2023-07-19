<template>
  <div class="verify-brand" v-if="detail">
    <a-row type="flex" justify="space-between" align="middle" class="panel-hd">
      <a-col class="title">核名商标</a-col>
      <a-col>
        <a-button
          type="link"
          @click="emit('edit')"
          v-if="!allReport?.checkResult && !allReport?.checkConclusion && useButton('trademarkDetail_brand_edit')"
          >修改</a-button
        >
      </a-col>
    </a-row>
    <a-row class="panel-bd">
      <a-row style="width: 100%">
        <a-col :span="6">
          <dl>
            <dt>待检索商标：</dt>
            <dd>{{ detail.trademarkName }}</dd>
          </dl>
        </a-col>
        <a-col :span="18">
          <dl>
            <dt>商标类别：</dt>
            <dd>
              <span v-for="(cate, cIndex) in detail.trademarkCategories" :key="cIndex"
                >{{ +cate.categoryNum > 9 ? cate.categoryNum : `${cate.categoryNum}` }}类-{{ cate.categoryName
                }}{{ cIndex === detail.trademarkCategories.length - 1 ? '' : '，' }}</span
              >
            </dd>
          </dl>
        </a-col>
        <a-col :span="6">
          <dl>
            <dt>国家：</dt>
            <dd>{{ detail.countryName }}</dd>
          </dl>
        </a-col>
        <a-col :span="18">
          <dl>
            <dt>商标含义：</dt>
            <dd>{{ detail.trademarkMeaning || '--' }}</dd>
          </dl>
        </a-col>
      </a-row>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { inject } from 'vue';
import { useButton } from '@/utils/utils';

const detail = inject('detail') as any;
const allReport = inject('allReport') as any;
interface Emits {
  (e: 'edit'): void;
}
const emit = defineEmits<Emits>();
</script>
<style lang="less" scoped>
.verify-brand {
  background: #fff;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
  }
  .panel {
    &-bd {
      dl {
        display: flex;
        justify-content: space-between;
        dt {
          width: 90px;
          text-align: right;
          word-break: break-all;
        }
        dd {
          flex: 1;
          color: #999;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
