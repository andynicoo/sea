<template>
  <div class="index-world-map" :class="{ pb80: NODE_PLA === 'wg' }">
    <div class="center ksy-w1320" style="width: 1200px; margin: 0 auto">
      <div class="index-world-map-title">
        <h4>全球服务地区</h4>
        <p v-if="NODE_PLA === 'ksy'">业务覆盖全球200+国家和地区，已为全球40万+ 出海企业提供国际合规服务</p>
        <p v-if="NODE_PLA === 'kby'">覆盖全球多个国家与地区的商标与专利服务，助力卖家开拓全球市场</p>
        <p v-if="NODE_PLA === 'wg'">业务覆盖全球200+国家和地区， 出海企业提供国际合规服务</p>
        <p v-if="NODE_PLA === 'kqy'">业务覆盖多个国家，助力卖家开拓全球市场</p>
      </div>
      <!-- 地图start -->
      <div class="map">
        <img src="@/assets/images/mapAbout/Earth.svg" alt="" />
        <div class="map-tags">
          <p v-if="NODE_PLA === 'ksy'">
            <img :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />{{ `已上线${ksy.length - 1}国VAT` }}
          </p>
          <p v-if="NODE_PLA === 'kby'"><img :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />已上线国家</p>
          <p v-if="NODE_PLA === 'wg'"><img :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />已上线国家</p>
          <p v-if="NODE_PLA === 'ksy'"><img :src="require('@/assets/images/mapAbout/orangeq.png')" alt="" />总部</p>
          <p v-if="NODE_PLA === 'kqy'"><img :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />已上线国家</p>
        </div>
        <div
          class="map-item"
          :class="{ big: +c.tipsType === 0 }"
          v-for="(c, index) in list"
          :key="index"
          :style="{ top: c.position[1] + 'px', left: c.position[0] + 'px' }"
        >
          <div class="map-item-position">
            <a-popover
              placement="top"
              v-if="+c.tipsType !== 0 && NODE_PLA !== 'wg'"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode;
                }
              "
            >
              <template slot="title">
                <div class="map-popover-head" :class="{ 'map-popover-kby-head': NODE_PLA === 'kby' }">
                  <img :src="require(`@/assets/images/mapAbout/flag/${c.countryName}.png`)" alt="" />
                  {{ c.chineseName | stringSlice(4) }}
                </div>
              </template>
              <template slot="content">
                <ul>
                  <li v-for="(con, con_index) in getContentList(c[NODE_PLA])" :key="`con_${con_index}`">{{ con }}</li>
                </ul>
              </template>
              <div class="map-item-position-wrap">
                <template v-if="+c.tipsType === 1">
                  <div class="water1 blue"></div>
                  <img v-if="+c.tipsType === 1" :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />
                </template>
                <template v-if="+c.tipsType === 0">
                  <div class="water1 orange1"></div>
                  <img v-if="+c.tipsType === 0" :src="require('@/assets/images/mapAbout/oranges.png')" alt="" />
                </template>
                <span :class="c.textPosition">{{ c.chineseName }}</span>
              </div>
            </a-popover>
            <div class="map-item-position-wrap" v-if="NODE_PLA === 'wg'">
              <template v-if="+c.tipsType === 1">
                <div class="water1 blue"></div>
                <img v-if="+c.tipsType === 1" :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />
              </template>
              <template v-if="+c.tipsType === 0">
                <div class="water1 orange1"></div>
                <img v-if="+c.tipsType === 0" :src="require('@/assets/images/mapAbout/oranges.png')" alt="" />
              </template>
              <span :class="c.textPosition">{{ c.chineseName }}</span>
            </div>
            <div class="map-item-position-wrap" v-if="+c.tipsType === 0">
              <template v-if="+c.tipsType === 1">
                <div class="water1 blue"></div>
                <img v-if="+c.tipsType === 1" :src="require('@/assets/images/mapAbout/blueq.png')" alt="" />
              </template>
              <template v-if="+c.tipsType === 0">
                <div class="water1 orange1"></div>
                <img v-if="+c.tipsType === 0" :src="require('@/assets/images/mapAbout/oranges.png')" alt="" />
              </template>
              <span :class="c.textPosition">{{ c.countryName }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 地图end -->
      <ul class="index-world-map-bottom" v-if="NODE_PLA === 'ksy'">
        <li :class="`bg-${index + 1}`" v-for="(b, index) in mapBottomArr" :key="index">{{ b.label }}</li>
      </ul>
      <ul class="index-world-map-bottom" v-if="NODE_PLA === 'kby'">
        <li :class="`bg-kby-${index + 1}`" v-for="(b, index) in mapBottomKbyArr" :key="index">{{ b.label }}</li>
      </ul>
      <ul class="index-world-map-bottom kqybtm" v-if="NODE_PLA === 'kqy'">
        <li :class="`bg-kqy-${index + 1}`" v-for="(b, index) in mapBottomKqyArr" :key="index">{{ b.label }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import maplist from "../../static/maplist";
export default {
  name: "IndexWorldMap",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      ksy: [
        "加拿大",
        "墨西哥",
        "英国",
        "爱尔兰",
        "西班牙",
        "荷兰",
        "比利时",
        "法国",
        "德国",
        "波兰",
        "捷克",
        "奥地利",
        "意大利",
        "瑞典",
        "塞浦路斯",
        "沙特",
        "阿联酋",
        "日本",
        "中国跨税云",
      ],
      kby: [
        "中国跨标云",
        "加拿大",
        "美国",
        "墨西哥",
        "瑞典",
        "英国",
        "法国",
        "西班牙",
        "德国",
        "欧盟",
        "奥地利",
        "意大利",
        "塞浦路斯",
        "沙特",
        "阿联酋",
        "韩国",
        "日本",
        "新加坡",
        "印度尼西亚",
        "菲律宾",
        "越南",
        "爱尔兰",
      ],
      wg: [
        "加拿大",
        "英国",
        "欧盟",
        "美国",
        "俄罗斯",
        "欧盟",
        "印度",
        "马来西亚",
        "南非",
        "沙特",
        "阿联酋",
        "韩国",
        "日本",
        "新加坡",
        "印度尼西亚",
        "菲律宾",
        "越南",
        "澳大利亚",
      ],
      kqy: [
        "英国",
        "美国",
        "马来西亚",
        "新加坡",
        "印度尼西亚",
        "菲律宾",
        "越南",
        "法国",
        "西班牙",
        "意大利",
        "塞浦路斯",
        "泰国",
        "中国香港",
        "中国澳门",
        "中国海南",
        "瑞士",
        "葡萄牙",
        "中国",
        "日本",
        "韩国",
        "加拿大",
        "英属维尔京群岛(BVI)",
        "荷兰",
        "澳大利亚",
        "开曼群岛"
      ],
      mapBottomKbyArr: [
        {
          label: "美国商标局",
        },
        {
          label: "英国商标局",
        },
        {
          label: "日本商标局",
        },
        {
          label: "欧盟商标局",
        },
      ],
      mapBottomArr: [
        {
          label: "英国税局官方认证",
        },
        {
          label: "德国税局官方认证",
        },
        {
          label: "法国税局官方认证",
        },
        {
          label: "意大利税局官方认证",
        },
        {
          label: "西班牙税局官方认证",
        },
      ],
      mapBottomKqyArr: [
        {
          label: "美国",
        },
        {
          label: "菲律宾",
        },
        {
          label: "马来西亚",
        },
        {
          label: "中国香港",
        },
        {
          label: "汇丰银行",
        },
        {
          label: "花旗银行",
        },
        {
          label: "渣打银行",
        },
      ],
      mapArray: maplist,
    };
  },
  computed: {
    list() {
      return this.getCountryListByCode();
    },
  },
  filters: {
    stringSlice(value, length) {
      value === undefined || value === null ? (value = "") : "";
      value.length > length ? (value = value.slice(0, length) + "...") : value;
      return value;
    },
  },
  methods: {
    getCountryListByCode() {
      let NODE_PLA = this.NODE_PLA;
      var list = [];
      if (NODE_PLA === "ksy") {
        this.$data.ksy.map((item) => {
          let countryInfo = this.mapArray.filter((ele) => item === ele.chineseName);
          countryInfo.length ? list.push(countryInfo[0]) : "";
        });
      }
      if (NODE_PLA === "kby") {
        this.$data.kby.map((item) => {
          let countryInfo = this.mapArray.filter((ele) => item === ele.chineseName);
          countryInfo.length ? list.push(countryInfo[0]) : "";
        });
      }
      if (NODE_PLA === "wg") {
        this.$data.wg.map((item) => {
          let countryInfo = this.mapArray.filter((ele) => item === ele.chineseName);
          countryInfo.length ? list.push(countryInfo[0]) : "";
        });
      }
      if (NODE_PLA === "kqy") {
        this.$data.kqy.map((item) => {
          let countryInfo = this.mapArray.filter((ele) => item === ele.chineseName);
          countryInfo.length ? list.push(countryInfo[0]) : "";
        });
      }
      return list;
    },
    getContentList(str = "") {
      return str.toString().split("、");
    },
  },
};
</script>
<style lang="less" scoped>
.map-bottom-kby-bg(@n, @i: 1) when (@i =< @n) {
  .bg-kby-@{i} {
    background: url("@/assets/images/mapAbout/kby/bt-@{i}.png") no-repeat center top/112px auto;
  }
  .map-bottom-kby-bg(@n, (@i + 1));
}
.map-bottom-bg(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: url("@/assets/images/mapAbout/bottom-@{i}.png") no-repeat center top/112px auto;
  }
  .map-bottom-bg(@n, (@i + 1));
}
.map-bottom-bg(5);
.map-bottom-kby-bg(4);


.map-bottom-kqy-bg(@n, @i: 1) when (@i =< @n) {
  .bg-kqy-@{i} {
    background: url("@/assets/images/mapAbout/kqy/bt-@{i}.png") no-repeat center top/112px auto;
  }
  .map-bottom-kqy-bg(@n, (@i + 1));
}
.map-bottom-kqy-bg(7);
/deep/ .ant-popover {
  width: 102px;
  &-title {
    margin: 0;
    padding: 0;
    min-width: inherit;
    min-height: inherit;
    .map-popover-head {
      height: 28px;
      background: rgba(@primaryColor, 0.6);
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #fff;
      padding: 0 0 0 8px;
      // .line-clamp(1);
      img {
        width: 24px;
        height: auto;
        margin-right: 4px;
      }
    }
    .map-popover-kby-head {
      background: linear-gradient(90deg, #04a1ff 0%, #2f77ff 100%);
    }
  }
  &-inner-content {
    padding: 0;
    ul {
      margin: 0;
      li {
        display: flex;
        align-items: center;
        height: 28px;
        color: @textColor6;
        font-size: 12px;
        position: relative;
        padding-left: 16px;
        &:after {
          position: absolute;
          content: "";
          width: 4px;
          height: 4px;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          background: @primaryColor;
        }
      }
    }
  }
}
.index-world-map {
  background: #f5f7fa;
  padding: 80px 0 0 0;
  &-title {
    font-size: 14px;
    color: @textColor;
    line-height: 16px;
    margin-bottom: 42px;
    text-align: center;
    h4 {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      margin-bottom: 8px;
    }
  }
  .map {
    text-align: center;
    position: relative;
    > img {
      display: block;
      width: 100%;
    }
    &-tags {
      position: absolute;
      left: 0;
      bottom: 96px;
      p {
        display: flex;
        align-items: center;
        img {
          margin-right: 14px;
        }
      }
    }
    &-item {
      position: absolute;
      cursor: pointer;
      &.big {
        img {
          width: 34px;
          height: 34px;
        }
        .water1 {
          top: 12px;
          left: 12px;
        }
        .right {
          position: absolute;
          left: 40px;
          top: 6px;
        }
      }
      &:hover .water1 {
        visibility: initial;
      }
      &-position {
        &-wrap {
          position: relative;
          display: inline-block;
          white-space: nowrap;
          .right {
            position: absolute;
            left: 30px;
          }
          .left {
            position: absolute;
            right: 30px;
          }
          .bottom {
            position: absolute;
            left: 0;
            top: 40px;
          }
        }
      }
    }
  }
  &-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @textColor;
    font-size: 14px;
    line-height: 22px;
    height: 132px;
    position: relative;
    top: 66px;
    text-align: center;
    background: #ffffff;
    box-shadow: 0px 2px 12px 1px rgba(16, 68, 166, 0.07);
    border-radius: 4px 4px 4px 4px;
    margin-bottom: 0;
    li {
      flex: 1;
      padding-top: 50px;
    }
  }
  .kqybtm {
    background: linear-gradient(180deg, #F6FAFF 0%, #F9FBFF 40%, #FFFFFF 100%);
box-shadow: 0px 5px 21px 0px rgba(16,68,166,0.09);
  }
  .water1 {
    width: 12px;
    height: 12px;
    box-shadow: 0 0 120px 30px rgba(235, 31, 137, 1) inset;
    border-radius: 100%;
    z-index: 1;
    opacity: 0;
    position: absolute;
    display: block;
    top: 5px;
    left: 4px;
    visibility: hidden;
    -webkit-animation: warn 2s ease-out 0.1s infinite;
    animation: warn 2s ease-out 0.1s infinite;
    transform-origin: center center;
    &.orange {
      box-shadow: inset #ff7800 0 0 5px;
    }
    &.orange1 {
      box-shadow: 0 0 120px 30px #f16425 inset;
    }
    &.blue {
      box-shadow: 0 0 120px 30px #3c7efb inset;
    }
  }
  .label-box:hover .water1 {
    visibility: initial;
  }
  .label-img {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: relative;
    margin: 0 4px;
    img {
      display: block;
    }
  }
  @-webkit-keyframes warn {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
    }

    5% {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: scale(4);
      transform: scale(4);
    }
  }

  @keyframes warn {
    0% {
      opacity: 0;
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
    }

    5% {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: scale(4);
      transform: scale(4);
    }
  }
}
.pb80{
  padding-bottom: 80px;
}
</style>
