<template>
  <div>
    <div class="windows">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="5">
          <div class="list">
            <div class="list-item" v-if="list.length === 1">
              <h2 @click="handleClickJump(list[0].link, list[0].openType)">{{ list[0].name }}</h2>
              <p v-html="list[0].info"></p>
            </div>
            <template v-else>
              <div class="slide-wrap">
                <div v-for="(item, index) in list" :key="`drop_${index}`">
                  <div
                    class="slide-wrap-item"
                    :class="{ 'slide-wrap-item-active': activeKey === index }"
                    @click="handleSlideChange(index)"
                    v-sensors="{
                      type: 'BrandServeView',
                      event: 'click',
                      getParams: () => brandServeView(item),
                    }"
                  >
                    {{ item.name }}
                  </div>
                  <br />
                </div>
              </div>
            </template>
            <!-- <nuxt-link :to="link" class="bottom" v-show="false">查看所有服务></nuxt-link> -->
          </div>
        </a-col>
        <a-col class="gutter-row" :span="19">
          <div class="content">
            <div class="content-list-out" ref="content">
              <div class="content-list-kby">
                <div class="content-list-kby-item" v-for="(item, index) in serviceList" :key="`p_${index}`">
                  <h5>{{ item.name }}</h5>
                  <div class="bd">
                    <a :title="i.productInfoClientVo.productName || i.platformName" v-for="(i, idx) in item.items" @click="handleClickLink(i)" :key="`drop_link_${idx}`">
                      <img v-if="i.country" :src="require(`@/assets/images/countryFlag/${i.country}.svg`)" alt="" />
                      <span class="ellipsis" :style="{ width: NODE_PLA === 'kby' ? '128px' : '140px' }">{{ i.productInfoClientVo.productName || i.platformName }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="recommend-wrap">
              <div class="recommend">
                <h2>活动推荐</h2>
                <div class="active-wrap" v-if="recommendList.length">
                  <template v-for="(com, index) in recommendList">
                    <a v-if="com.url" :key="`a_${index}`" :href="com.url" target="_blank" class="active">
                      <img :src="com.picPath" :alt="com.name" />
                    </a>
                    <div v-else class="active" :key="`div_${index}`">
                      <img :src="com.picPath" :alt="com.name" />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getAdByAdPositionKey } from '@/api/myOrder.js';
// import { getImgByCountryCode } from "@/utils/index";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      NODE_ENV: process.env.NODE_ENV,
      recommendList: [],
      activeKey: 0,
      // getImgByCountryCode,
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    link: {
      type: String,
      default() {
        return '';
      },
    },
  },
  inheritAttrs: false,
  computed: {
    serviceList() {
      let { list, activeKey } = this;
      return list[activeKey].navTertiary.aggregates || [];
    },
  },
  mounted() {
    // 弹窗右侧推荐
    this.getRecommendList();
  },
  methods: {
    handleClickJump(url, openType) {
      if (openType) {
        window.open(url);
      } else {
        window.location.href = url;
      }
    },
    async getRecommendList() {
      let res = await getAdByAdPositionKey({ adKey: 'ProductService_hover_banner' });
      console.log(res);
      this.recommendList = res.data;
    },
    // 单点登录版本需求，跨标云、卖家成长的外观专利产品，直接跳到外观专利详情页,判定id，跳转到对应的id上去
    handleClickLink(item) {
      // 对应的id关系，key是跨标云的id，val是辰智云的id,作跳转
      // const contrast = {
      //   "1600311229671739393": "1600660762217877506",
      // };
      // if (this.NODE_PLA === "kby" && contrast[item.id]) {
      //   var wgUrl = "https://sit2-patent.itaxs.com";
      //   if (this.NODE_ENV === "prod") {
      //     wgUrl = "https://chenhaiip.itaxs.com";
      //   }
      //   let crossSessionId= Cookies.get('sessionId');
      //   if(crossSessionId){
      //     window.open(wgUrl+ `/client/productDetail?id=${contrast[item.id]}&pagefrom=pro&crossSessionId=${crossSessionId}`);
      //   }else{
      //     window.open(wgUrl+ `/client/productDetail?id=${contrast[item.id]}&pagefrom=pro`);
      //   }
      //   return false;
      // }

      this.$router.push({ path: `/productDetail?id=${item.productId}&pagefrom=pro` });
    },
    handleAnchorClick(e) {
      // 阻止 a 标签默认事件
      e.preventDefault();
    },
    handleSlideChange(index) {
      this.activeKey = index;
    },
    // 神策商标服务详情页浏览
    brandServeView(item) {
      return {
        product_affilation_country: item.countryNameZh,
        brand_serve_page_source: 'tab栏点击',
        brand_kind: item.country,
        brand_serve_project: '一标一类',
        brand_original_price: item.oldPrice,
        brand_current_price: item.price,
        quantity_unit: item.unit === 1 ? '类' : '次',
      };
    },
  },
};
</script>

<style lang="less" scoped>
@rightWidth: 400px;
.windows {
  // max-width: 1320px;
  // height: 570px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 1px rgba(16, 68, 166, 0.07);
  border-radius: 0;
  .list {
    // width: 241px;
    height: 570px;
    border-right: 1px solid #d9d9d9;
    position: relative;
    padding: 36px 24px 16px 62px;
    // float: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 20;
    &-item {
      line-height: initial;
      word-break: break-all;
      h2 {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.9);
        line-height: 24px;
        margin-bottom: 12px;
      }
      p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
      }
    }
    .slide-wrap {
      flex: 1;
      height: 0;
      overflow-y: auto;
      line-height: initial;
      &-item {
        cursor: pointer;
        display: inline-block;
        margin-bottom: 28px;
        font-size: 16px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.9);
        &-active,
        &:hover {
          color: #3a7fff;
          border-bottom: 2px solid #3a7fff;
        }
      }
    }

    .bottom {
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
  .content {
    // float: left;
    // width: 81%;
    height: 100%;
    padding-top: 36px;
    &-list-out {
      height: 100%;
      overflow-y: auto;
      float: left;
      width: calc(100% - @rightWidth);
      &::-webkit-scrollbar {
        width: 4px;
        background: none;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(#ccc, 0.01);
        border: 0;
      }
      &::-webkit-scrollbar-track {
        display: none;
      }
    }
    &-list {
      width: 100%;
      height: auto;
      column-count: 3;
      column-gap: 40px;
      padding: 0 40px 36px;
      &-kby {
        padding: 0 40px 36px;
        &-item {
          margin-bottom: 36px;
          h5 {
            line-height: 22px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 12px;
          }
          .bd {
            display: grid;
            justify-content: space-between;
            grid-template-columns: repeat(3, auto);
            grid-row-gap: 10px;
            a {
              color: rgba(0, 0, 0, 0.6);
              line-height: 20px;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              font-size: 12px;
            }
            img {
              width: 32px;
              margin-right: 4px;
            }
          }
        }
      }
      &-item {
        line-height: initial;
        break-inside: avoid;
        margin-bottom: 36px;
        h5 {
          line-height: 22px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.9);
          margin-bottom: 12px;
        }
        a {
          color: rgba(0, 0, 0, 0.6);
          line-height: 20px;
          margin-bottom: 6px;
          display: block;
          font-size: 12px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .recommend {
      margin-left: 18px;
      &-wrap {
        float: right;
        width: @rightWidth;
        img {
          display: block;
          width: 100%;
        }
      }
      h2 {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 20px;
        margin-bottom: 20px;
      }
      .active-wrap {
        width: 326px;
        height: 454px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
        &::-webkit-scrollbar-track {
          display: none;
        }
      }
      .active {
        &:last-child {
          margin-bottom: 0;
        }
        h3 {
          font-size: 18px;
          color: rgba(0, 0, 0, 1);
          line-height: 20px;
          align-items: center;
          cursor: pointer;
          span {
            display: block;
            max-width: 200px;
          }
        }
        p {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 25px;
        }
      }
    }
  }
}
.content-list-kby {
  max-height: 500px;
}
</style>
