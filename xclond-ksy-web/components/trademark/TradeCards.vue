<template>
  <div class="cards">
    <h2>
      跨标云智能起名结果如下
      <a-button @click="getAiName()" type="link" class="ksy-fr" :loading="changeLoading">换一批</a-button>
    </h2>
    <a-spin :spinning="false">
      <div class="tradecards ksy-mt-1 flex">
        <div
          @click="handleClickItem(sortList[index].name, index)"
          class="card"
          :class="[`card${arrRenew[index]}`, { active: curName === sortList[index].name }]"
          v-for="(item, index) in sortList"
          :key="index"
        >
          <span>{{ sortList[index].name }}</span>
          <div class="cur" v-if="curIndex === index"></div>
          <Collect :nameInfo="setNameInfo(index)" />
          <div class="sw-mask"></div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import { mapState, mapMutations } from "vuex";
import trademark from "@/apis/trademark";
import moment from "moment";
import Cookies from "js-cookie";
import IndexMixins from "@/mixins";

export default {
  mixins: [IndexMixins],
  data() {
    return {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      arrRenew: [],
      nameJsonData: [], // 商标集合
      trademarkAiName: {}, // 商标信息，用于换一批查询，与商标集合一起传输
      curName: "", //当前选中的商标名
      curIndex: 0,
      changeLoading: false, // 换一批 按钮
      reLoading: false, // 重新取名
      collectParamsInfo: {
        trademarkAiNameId: "", // AI取名ID
        trademarkAiNameNo: "", // ai名称唯一标识
        trademarkAiNameTime: "", // AI取名时间
        trademarkLogInfo: "", // 商标log样式 class 名称
        trademarkName: "", // 商标名称
      },
    };
  },
  props: {
    formData: {
      default: () => {},
      type: Object,
    },
    sort: null,
    sortKey: String,
  },
  watch: {
    sortList: {
      handler() {
        this.curIndex = 0;
        this.getCollectParams();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(["collectParams"]),
    sortList() {
      const arrIn = [];
      const arrOut = [];
      if (+this.sort === 0) {
        return this.nameJsonData.slice(0, 16);
      } else {
        this.nameJsonData.map((v) => {
          if (+this.sort === 1) {
            if (v.name.toLowerCase().startsWith(this.sortKey)) {
              arrIn.push(v);
            } else {
              arrOut.push(v);
            }
          } else if (+this.sort === 2) {
            if (v.name.toLowerCase().endsWith(this.sortKey)) {
              arrIn.push(v);
            } else {
              arrOut.push(v);
            }
          }
        });
        return arrIn.concat(arrOut).slice(0, 16);
      }
    },
  },
  mounted() {
    this.$bus.$on("changeCollect", (data) => {
      console.log("changeCollect", data);
      this.nameJsonData.map((v) => {
        if (v.nameNo === data.trademarkAiNameNo) {
          v.isFavourite = data.status;
        }
        return v;
      });
    });
    this.randomArray();
    // 获取上个页面查询的商标信息 nameJson
    this.nameJsonData = sessionStorage.getItem("nameJson") ? JSON.parse(sessionStorage.getItem("nameJson")) : [];
    this.trademarkAiName = sessionStorage.getItem("trademarkAiName")
      ? JSON.parse(sessionStorage.getItem("trademarkAiName"))
      : [];
    // let namePreferForm = sessionStorage.getItem("nameJson") ? JSON.parse(sessionStorage.getItem("nameJson")) : {};
    if (this.nameJsonData?.length) {
      this.curName = this.nameJsonData.length ? this.nameJsonData[0].name : "";
      this.curIndex = 0;
      this.getCollectParams();
    }
  },
  destroyed() {
    this.$bus.$off("updateCollect");
    // sessionStorage.removeItem("nameJson");
    // sessionStorage.removeItem("trademarkAiName");
  },
  methods: {
    ...mapMutations(["setCollectParams"]),
    ...mapMutations("common", ["setSearching"]),
    listSortByType(type) {},
    setNameInfo(index) {
      const cur = this.nameJsonData[index];
      const { isFavourite, name, nameNo } = cur;
      const { id, createTime } = this.trademarkAiName;
      const trademarkLogInfo = `card${this.arrRenew[index]}`;
      return {
        trademarkAiNameId: id,
        trademarkName: name,
        trademarkAiNameNo: nameNo,
        trademarkAiNameTime: createTime,
        trademarkLogInfo,
        isFavourite,
      };
    },
    getCollectParams() {
      if (this.trademarkAiName && this.nameJsonData?.length) {
        this.collectParamsInfo.trademarkAiNameId = this.trademarkAiName.id || "";
        this.collectParamsInfo.trademarkAiNameTime = this.trademarkAiName.createTime || "";
        this.collectParamsInfo.createTime = this.trademarkAiName.createTime || "";
        this.collectParamsInfo.trademarkAiNameNo = this.nameJsonData[this.curIndex]["nameNo"];
        this.collectParamsInfo.trademarkLogInfo = `card${this.arrRenew[this.curIndex]}`;
        this.collectParamsInfo.trademarkName = this.nameJsonData[this.curIndex]["name"];
        this.collectParamsInfo.isFavourite = this.nameJsonData[this.curIndex]["isFavourite"];
        this.setCollectParams(this.collectParamsInfo);
      }
    },
    collectItem(index) {
      const cur = this.nameJsonData[index];
      const { name, nameNo } = cur;
      this.collectParamsInfo.trademarkAiNameNo = nameNo;
      this.collectParamsInfo.trademarkName = name;
      this.collectParamsInfo.trademarkLogInfo = `card${this.arrRenew[index]}`;
      this.setCollectParams(this.collectParamsInfo);
    },
    handleClickItem(name, index) {
      this.curName = name;
      this.curIndex = index;
      this.getCollectParams();
    },
    randomArray() {
      let array = cloneDeep(this.arr);
      let length = array.length;
      for (let index = 0; index < length - 1; index++) {
        let randomIndex = Math.floor(Math.random() * (length - index)) + index;
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
      }
      this.arrRenew = array;
    },
    async getAiName() {
      let { id } = this.trademarkAiName;
      this.changeLoading = true;
      let res = await this.$axiosApi(trademark.getChangeName.url, trademark.getChangeName.methods, {
        aiNameId: id,
      });
      this.nameJsonData = res.data.nameJson;
      this.trademarkAiName = res.data.trademarkAiName;
      this.randomArray();
      this.curName = this.nameJsonData?.[0]?.name || "";
      this.curIndex = 0;
      this.changeLoading = false;
      this.getCollectParams();
      console.log(res);
    },
    async sendName() {
      this.reLoading = true;
      this.setSearching({ show: true });
      let res = await this.$axiosApi(trademark.getAiName.url, trademark.getAiName.methods, this.formData);
      console.log(res);
      this.nameJsonData = res.data.nameJson;
      this.trademarkAiName = res.data.trademarkAiName;
      this.reLoading = false;
      this.setSearching({ show: false });
    },
    // 重新取名
    async reGetName() {
      await this.handleSearchFree();
      this.sendName();
    },
  },
};
</script>

<style lang="less" scoped>
.cards {
  // height: 290px;
  background: #ffffff;
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  padding: 24px;
  padding-top: 19px;
  padding-bottom: 8px;
  h2 {
    height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.9);
    line-height: 30px;
  }
  .tradecards {
    flex-wrap: wrap;
  }
  .card {
    margin-right: 14px;
    margin-bottom: 16px;
    position: relative;
    cursor: pointer;
    width: 130px;
    height: 94px;
    font-size: 20px;
    text-align: center;
    border-radius: 4px;
    padding-left: 5px;
    /* padding-top: 33px; */
    padding-right: 5px;
    word-break: break-all;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    border: 1px solid #dcdcdc;
    > span {
      .line-clamp(3);
    }
  }
  .card:hover {
    // filter: alpha(Opacity=80);
    // -moz-opacity: 0.8;
    // opacity: 0.8;
    .sw-mask,
    .collect {
      display: block !important;
    }
  }
  .cur {
    width: 45px;
    height: 45px;
    background: url("@/assets/images/cardcur.png") no-repeat;
    background-size: cover;
    position: absolute;
    right: -1px;
    top: -1px;
  }
  .sw-mask {
    display: none;
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 0;
    left: 0;
    z-index: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
    opacity: 0.2;
  }
  .active {
    box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
      0px 4px 6px -3px rgba(0, 0, 0, 0.02);
  }
}
</style>
