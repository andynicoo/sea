<style lang="scss">
.custom-anchor {
  .ant-anchor-wrapper {
    position: absolute;
    right: -20px;
    top: 40px;
    transform: translateX(100%);
    padding: 10px 20px;

    .ant-anchor {
      padding: 0;

      .ant-anchor-ink {
        display: none;
      }

      & > p {
        line-height: 30px;
        cursor: pointer;

        &:hover {
          color: $linkColor !important;
        }

        &.error {
          color: red;
        }
      }
    }
  }
}
</style>

<template>
  <div class="custom-anchor">
    <a-anchor :offsetTop="63">
      <p @click="gotoView('basicInfo')" :class="{ error: errors['basicInfo'] }">
        <a-icon v-if="errors['basicInfo']" type="exclamation" /> 基本信息
      </p>
      <p
        @click="gotoView('productinfo')"
        :class="{ error: errors['productinfo'] }"
      >
        <a-icon v-if="errors['productinfo']" type="exclamation" /> 商品信息
      </p>
      <p
        @click="gotoView('mediaManager')"
        :class="{ error: errors['mediaManager'] }"
      >
        <a-icon v-if="errors['mediaManager']" type="exclamation" /> 媒体管理
      </p>
      <p
        @click="gotoView('spacesInfo')"
        :class="{ error: errors['spacesInfo'] }"
      >
        <a-icon v-if="errors['spacesInfo']" type="exclamation" /> 规格信息
      </p>
      <p
        @click="gotoView('logisticsInfo')"
        :class="{ error: errors['logisticsInfo'] }"
      >
        <a-icon v-if="errors['logisticsInfo']" type="exclamation" /> 物流信息
      </p>
    </a-anchor>
  </div>
</template>

<script>
import scrollIntoView from 'scroll-into-view-if-needed'
export default {
  props: {
    errors: Object
  },
  methods: {
    gotoView(view) {
      scrollIntoView(document.getElementById(view))
    }
  }
}
</script>
