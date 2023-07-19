<!-- （操作记录）供应商信息组件-->
<template>
  <div v-show="isShow ">
    <div v-for="(item , index) in list" :key="index">
      <div class="item">
        <div class="left">
          <div class="item-dot"></div>
          <div class="item-line"></div>
        </div>
        <div class="right">
          <div class="item-header">
            <span class="item-hader-time item-son">
              <span class="">{{item.YMD}}</span>
              <span>{{item.HMS}}</span>
            </span>
            <span>
              {{item.username}}
            </span>
          </div>
          <div class="item-info item-son" v-for="(vv,i) in  item.businessOperateName " :key="i">
            <span class="item-info-user">{{ vv.realName }}</span>
            <span class="item-info-proportion">{{vv.percentage}}%</span>
          </div>
        </div>
      </div>
    </div>
    <center v-show="list.length == 0" style="margin-top:20px"> 暂无数据 </center>
  </div>

</template>

<script>
import eaitMixins from "../../util/eaitMixins.js";
import { getListByNo } from "@/api/newApi/supplyChain/allocationRules.js";
export default {
  name: "AddEditSupplierInfo",
  mixins: [eaitMixins],
  props: {
    listByNoInfo: {
      type: Object,
    },
    tabkey: {
      //当前点击的tab Key
      type: [Number, String],
      default: "1",
    },
    comKey: {
      //组件的key
      type: [Number, String],
      default: "1",
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getListByNoApi();
  },
  methods: {
    /**
     * 获取操作记录数据
     */
    async getListByNoApi() {
      let { data } = await getListByNo(this.listByNoInfo);
      let newData = this.dataProcessing(data);
      this.list = newData;
    },

    dataProcessing(array) {
      let newArray = array.map((element) => {
        if (element.businessOperateTime) {
          let newDate = this.setDate(element.businessOperateTime);
          element = { ...element, ...newDate };
          element.businessOperateName = JSON.parse(element.businessOperateName);
        }
        return element;
      });
      return newArray;
    },

    setDate(date) {
      let wordArr = date.split(" ");
      return {
        YMD: wordArr[0],
        HMS: wordArr[1],
      };
    },
  },
};
</script>
<style lang='scss' scoped>
.item {
  display: grid;
  grid-template-columns: 75px 76%;

  font-size: 14.5px;
  .item-header {
    display: grid;
    grid-template-columns: 75% 25%;
    padding-bottom: 5px;
    .item-hader-time-year {
      padding-right: 10px;
    }
  }
  .item-son {
    display: grid;
    grid-template-columns: 80px 80px;
  }
  .left {
    position: relative;
    .item-dot {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 100%;
      background: #999999;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      top: 4px;
      left: 60%;
    }
    .item-line {
      width: 1px;
      height: 100%;
      border: 1px solid #999999;
      position: absolute;
      top: 4px;
      left: 69%;
    }
  }
  .right {
    color: black;
    padding: 8px 0px;
  }
}
</style>