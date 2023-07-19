<!-- 315导航栏 -->
<template>
  <div>
    <!-- {{ index == 1}}{{sign}} -->
    <div class="atNode" :class=" [sign == index ? 'isActivity':'', sign == 0 && index == 1  ? 'midden': sign  == 2 && index == 1 ? 'midden2':'' ]">
      <div class="time">
        {{item.time }}
      </div>
      <div class="state">

        <div class="text" v-show="actNodeState == 3">秒杀待开始</div>
        <!-- //正在开始 -->
        <div class="text" v-show="actNodeState == 1"><img src="@/assets/images/activity315/purchase.png" width="184px"></div>
        <div class="text" v-show="actNodeState == 2">活动已结束</div>
        <img v-if="isActivity" src="@/assets/images/activity315/middle/state.svg" alt="">
      </div>
    </div>
  </div>
</template>
 
 
<script>
import { actNode } from "../util/util.js"
export default {
  name: "Bar",
  props: {
    sign: {
      type: Number,
      default: 0,
    },
    index: Number,
    isActivity: Boolean,
    item: {
      time: {
        type: String,
        default: "",

      },
      state: {
        type: String,
        default: "3"
      },
    },
    actInfo: {
      type: Array,
      required: true,
    }
    // actStatus: Number
  },
  data() {
    return {
      // actInfo: this.$parent.actInfoData,

    };
  },

  // components: {},

  computed: {
    actNodeState: function () {
      return actNode(this.actInfo, this.index).type;
    },
  },
  created() {

    // this.actInfo = ;
    // this.nodeState(this.actInfo);
    // console.log("bar", this.actInfo);
  },
  mounted() {
    // console.log("bar", this.index);

  },

  methods: {

  }
}

</script>
<style lang='less' scoped>
.atNode {
  height: 82px;
  display: grid;
  align-items: center;
  .state {
    .text {
      font-size: 22px;
      font-family: Alibaba PuHuiTi;
      font-weight: 400;
    }
  }
}
.midden {
  // border-left: 1px solid #f3ba36;
  border-right: 2px solid #f3ba36;
}
.midden2 {
  border-left: 2px solid #f3ba36;
  // border-right: 1px solid #f3ba36;
}
.isActivity {
  background-color: rgba(239, 122, 51, 1);
  border-radius: 10px;
  color: #f5f0de;
}
</style>