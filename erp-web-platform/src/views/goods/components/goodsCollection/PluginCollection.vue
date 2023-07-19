<template>
  <div class="">
    <div class="m-plug-box">
      <div class="m-plug-title">
        <h3>{{ $t('goodsCollection.pluginMessage1') }}</h3>
        <p>{{ $t('goodsCollection.pluginMessage2') }}</p>
        <!-- <a-button
          type="primary"
          @click="openPage(systemConfig.plugDownloadUrl)"
        >
          {{ $t('goodsCollection.pluginMessage3') }}
        </a-button> -->
      </div>
      <div class="step-wrap">
        <div class="step-item">
          <img src="@/assets/images/goods/plugin-step1.png" alt="" />
          <p>{{ $t('goodsCollection.downloadPlugin') }}</p>
          <div class="line"></div>
        </div>
        <div class="step-item">
          <img src="@/assets/images/goods/plugin-step2.png" alt="" />
          <p>{{ $t('goodsCollection.viewGoods') }}</p>
          <div class="line"></div>
        </div>
        <div class="step-item">
          <img src="@/assets/images/goods/plugin-step3.png" alt="" />
          <p>{{ $t('goodsCollection.collectGoods') }}</p>
        </div>
      </div>
      <div>
        <a-button
          icon="download"
          type="primary"
          @click="openPage(systemConfig.plugDownloadUrl, '_blank')"
          size="large"
        >
          {{ $t('goodsCollection.pluginMessage3') }}
        </a-button>
      </div>
      <p style="line-height:40px;margin-top:20px">
        {{ $t('goodsCollection.pluginMessage9') }}
        <a
          @click="openPage('/information/info?type=1&listId=1&newsId=4')"
          target="_blank"
        >
          {{ $t('goodsCollection.installTutorial') }}</a
        >
      </p>
      <div class="m-plug-img">
        <div class="site-list">
          <div>{{ $t('goodsCollection.pluginMessage4') }}:</div>
          <div
            v-for="(item, index) in imgLogoPlugArr"
            :key="index"
            class="site-item"
          >
            <!-- 目前插件不支持爱搜鞋 -->
            <a-tooltip
              placement="bottom"
              v-if="!notDisplayArr.includes(item.platCode)"
            >
              <template slot="title">
                <span>{{ item.displayName }}</span>
              </template>
              <a :href="item.url" target="__blank">
                <a-avatar
                  :src="item.selectImg"
                  :size="28"
                  :alt="item.displayName"
                  shape="square"
                />
              </a>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCollectSites } from '@/util'
export default {
  computed: {
    ...mapState({
      systemConfig: (state) => state.app.systemConfig
    })
  },
  data() {
    return {
      imgLogoPlugArr: getCollectSites(),
      notDisplayArr: []
    }
  }
}
</script>

<style lang="scss" scoped>
.m-plug-box {
  font-size: 14px;
  //   background: rgb(242, 242, 242);
  height: calc(100% - 60px);
  width: calc(100% - 20px);
  margin: 0 auto;
  padding: 20px;
  padding-left: 0px;
  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  > div + div {
    margin-top: 30px;
  }
  .m-plug-title {
    // background-color: rgb(242, 242, 242);
    position: relative;
    box-sizing: border-box;
    width: 100%;
    > button {
      position: absolute;
      right: 15%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .step-wrap {
    display: flex;
    transform: translateX(-20px);
    .step-item {
      width: 100px;
      height: 100px;
      position: relative;
      margin-right: 60px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        line-height: 36px;
        color: #606166;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
      }
      .line {
        position: absolute;
        top: 35px;
        left: 90px;
        height: 1px;
        width: 80px;
        border-bottom: 1px dashed #ff9974;
      }
    }
  }
  .m-plug-img {
    display: flex;
    align-items: center;
    line-height: 48px;
    margin-top: 20px;
    .site-list {
      display: flex;
      .site-item {
        margin: 0 8px;
      }
    }
  }
}
</style>
