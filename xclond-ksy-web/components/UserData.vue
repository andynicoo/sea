<template>
  <swiper class="swiper" :options="swiperOption">
    <swiper-slide v-for="(item, index) in userData" :key="index">
      <div class="item">
        <div class="ksy-fl item1">
          <span>
            {{ item.a.name }}
          </span>
          <span>
            {{ item.a.mobile }}
          </span>
          查询 <span class="gs">[***贸易有限公司] </span>可以注册
        </div>
        <div class="ksy-fl item2">
          <span>
            {{ item.b.name }}
          </span>
          <span>
            {{ item.b.mobile }}
          </span>
          查询 <span class="gs">[***贸易有限公司] </span>可以注册
        </div>
      </div>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  data() {
    return {
      userData: [
        { a: { name: "李先生", mobile: '150****2548' }, b: { name: "赵先生", mobile: '130****7562' } },
        { a: { name: "张女士", mobile: '130****2547' }, b: { name: "钱先生", mobile: '156****1257' } },
        { a: { name: "刘先生", mobile: '132****2658' }, b: { name: "李先生", mobile: '132****7452' } },
        { a: { name: "王先生", mobile: '131****2158' }, b: { name: "刘先生", mobile: '156****9657' } },
        { a: { name: "钱先生", mobile: '150****2478' }, b: { name: "张女士", mobile: '131****9524' } },
        { a: { name: "赵先生", mobile: '136****4785' }, b: { name: "王先生", mobile: '152****18542' } },
      ],
      swiperOption: {
        direction: "vertical",
        loop: true,
        autoplay: true,
      },
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>

<style lang="less" scoped>
.swiper {
  height: 30px;
  overflow: hidden;
  .item {
    .item1,
    .item2 {
      width: 324px;
      height: 30px;
      background: rgba(1, 115, 255, 0.06);
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      line-height: 30px;
      padding-left: 12px;
      font-size: 12px;
      .gs{
        color: @primaryColor;
      }
    }
    .item1{
      margin-right: 27px;
    }
  }
}
</style>
