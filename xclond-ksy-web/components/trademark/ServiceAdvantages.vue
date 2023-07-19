<template>
  <div class="advan">
    <h2>服务优势</h2>
    <p>
      3000+优质商标可选，商品齐全，商标信息真实有效！更多海量库存持续更新，价格透明公正，低至4988元起，平台全程保障交易安全性。
    </p>
    <div class="content ksy-w1320">
      <div class="top">
        <a-row :gutter="[20, 0]">
          <a-col class="gutter-row" :span="6" v-for="(item, index) in RType" :key="item.title + index">
            <div class="items">
              <div class="item">
                <img :src="require(`@/assets/images/trademark/${item.img}`)" :alt="item.title" />
                <h3>
                  {{ item.title }}
                </h3>
                <p>
                  {{ item.subTit }}
                </p>
                <div class="chat" @click="customerFunc">立即咨询</div>
                <div class="mengban"></div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="bottom">
        <a-row :gutter="[40, 0]">
          <a-col class="gutter-row" :span="8" v-for="(item, index) in RType2" :key="item.user + index">
            <div class="user">
              <!-- <span>”</span> -->
              <div class="img">
                <img :src="require(`@/assets/images/trademark/${item.img}`)" :alt="item.title" />
              </div>
              <p>
                {{ item.desc }}
              </p>
              <p class="people">--微信用户</p>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { customerFunc } from "@/utils/index";

export default {
  data() {
    return {
      customerFunc,
      RType: [
        {
          title: "Curitis",
          subTit: "资深商标专员",
          img: "servicea1.png",
        },
        {
          title: "小琳",
          subTit: "资深商标专员",
          img: "servicea2.png",
        },
        {
          title: "涂建",
          subTit: "资深商标专员",
          img: "servicea3.png",
        },
        {
          title: "魏亚钧",
          subTit: "资深商标专员",
          img: "servicea4.png",
        },
      ],
      RType2: [
        {
          user: "微信客户",
          desc: "你们是我见过最敬业的代理了，一般别人都是问什么回答什么，你们很站在客户角度考虑，想在我们前边了呀！",
          img: "user1.png",
        },
        {
          user: "微信客户",
          desc: "对比了好几家，也聊了这么多天，还是觉得你们更专业！",
          img: "user2.png",
        },
        {
          user: "微信客户",
          desc: " 你们靠谱！有其他产品折扣的话一定告诉我，有朋友需要我就推荐你们啊！",
          img: "user3.png",
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.advan {
  background: url("@/assets/images/trademark/serviceabg.png") no-repeat;
  height: 873px;
  background: #001428;
  padding-top: 60px;
  h2 {
    font-size: 28px;
    color: @textColorW;
    text-align: center;
    margin: 0 !important;
  }
  p {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 40px;
    text-align: center;
    color: @textColorW;
  }
  .content {
    margin: 0 auto;
    .item {
      height: 349px;
      text-align: center;
      position: relative;
      img {
        // max-height: 349px;
        width: 100%;
      }
      h3 {
        display: none;
        position: absolute;
        font-size: 20px;
        color: #ffffff;
      }
      p {
        display: none;
        position: absolute;
        font-size: 16px;
        color: #ffffff;
      }
      .chat {
        display: none;
        position: absolute;
      }
      .mengban {
        display: none;
        position: absolute;
      }
    }
    .item:hover {
      z-index: 10;
      h3 {
        display: block;
        z-index: 1000;
        top: 40%;
        left: 40%;
        z-index: 9999;
      }
      p {
        display: block;
        z-index: 1000;
        top: 60%;
        left: 30%;
        z-index: 9999;
      }
      .chat {
        height: 52px;
        width: 100%;
        line-height: 52px;
        background: @primaryColor;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        bottom: 0px;
        left: 0px;
        display: block;
        color: #ffffff;
        font-size: 16px;
        cursor: pointer;
        z-index: 9999;
      }
      .mengban {
        background: #001428;
        border-radius: 4px 4px 4px 4px;
        opacity: 0.8;
        filter: blur(0px);
        height: 308px;
        display: block;
        top: 0px;
        width: 100%;
        z-index: 8888;
      }
    }
    .user {
      color: #ffffff;
      margin-top: 44px;
      height: 220px;
      background: rgba(255, 255, 255, 0.2);
      filter: blur(0px);
      position: relative;
      padding: 15px 24px;
      // span {
      //   position: absolute;
      //   font-size: 80px;
      //   right: 20px;
      //   top: 0px;
      //   color: #ffffff;
      //   opacity: 0.1;
      // }
      background-image: url("@/assets/images/index/swiper-bg-02.png");
      background-position: right 30px top 30px;
      background-repeat: no-repeat;
      background-size: auto 23px;
      .img {
        height: 64px;
        img {
          height: 64px;
        }
      }
      p {
        text-align: left;
        font-size: 16px;
        margin-bottom: 15px;
        height: 72px;
      }
      .people {
        color: @textColorW6;
        text-align: right;
      }
    }
  }
}
</style>
