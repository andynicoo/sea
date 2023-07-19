<template>
  <a-spin :spinning="loading">
    <div ref="wrap" class="filter-height">
      <div v-if="chooseedList.length" class="filter-height-item" style="margin-bottom: 20px">
        <div class="item-title">已选项：</div>
        <div v-if="filters" class="item-content">
          <span v-for="(item, index) in chooseedList" :key="index">
            <span v-if="item.name" class="fil-item flex flex-c-c"
              >{{ item.count === -1 ? item.nameZh : item.name }}<i @click="removeItem(item)">x</i></span
            >
            <span v-else class="fil-item flex flex-c-c"
              >{{ +item.categoryNum > 9 ? item.categoryNum : `0${item.categoryNum}` }}类 {{ item.categoryName }}（{{
                item.tradermarkNum
              }}）<i @click="removeItem(item)">x</i></span
            >
          </span>
        </div>
        <div v-else class="item-content">
          <span v-for="(item, index) in chooseedList" :key="index">
            <span v-if="Object.keys(item).length === 4" class="fil-item flex flex-c-c"
              >{{ item.name }}类 {{ item.nameZh }}<i @click="removeItem(item)">x</i></span
            >
            <span v-else class="fil-item flex flex-c-c">{{ item.name }}<i @click="removeItem(item)">x</i></span>
          </span>
        </div>
        <a-button class="clearBtn" @click="removeAll" type="primary">全部清除</a-button>
      </div>
      <div
        ref="itemcategoryList"
        :style="{
          height: innerMoreStatus['categoryList'] && innerMoreStatus['categoryList'].open ? 'auto' : '22px',
        }"
        class="filter-height-item"
      >
        <div class="item-title">商标大类</div>
        <div ref="contentcategoryList" class="item-content">
          <div @click="choose(index)" v-for="(item, index) in riskList" :key="index" :class="{ active: item.checked }">
            <template v-if="filters"
              >{{ item.categoryNum > 9 ? item.categoryNum : `0${item.categoryNum}` }} {{ item.categoryName }}（{{
                +item.tradermarkNum > 999 ? "999+" : item.tradermarkNum
              }}）
            </template>
            <template v-else>
              {{ item.name > 9 ? item.name : `0${item.name}` }}类 {{ item.nameZh }}（{{
                +item.count > 999 ? "999+" : item.count
              }}）
            </template>
          </div>
        </div>
        <div
          v-if="innerMoreStatus['categoryList'] && innerMoreStatus['categoryList'].show"
          @click="innerViewMore('categoryList')"
          class="item-more"
        >
          <template v-if="innerMoreStatus['categoryList'].open">
            收起
            <i class="icon-up"></i
          ></template>
          <template v-else>
            更多
            <i class="icon-down"></i
          ></template>
        </div>
      </div>
      <div
        v-for="(val, key, index) in list"
        v-if="index < outIndex"
        v-show="val.options.length"
        :key="key"
        :ref="`item${key}`"
        :class="innerMoreStatus[key] && innerMoreStatus[key].open ? 'open' : hideClass"
        class="filter-height-item"
      >
        <div class="item-title">{{ titleMap[key] }}</div>
        <div :ref="`content${key}`" class="item-content">
          <div v-if="['申请人姓名', '代理律师'].includes(titleMap[key]) && val.options.length" class="item-input">
            <i class="icon-search"></i>
            <input type="text" v-model="formSearch[key]" placeholder="输入关键词筛选条件" />
          </div>
          <template v-if="Object.keys(formSearch).includes(key)">
            <div
              @click="chooseItem(key, item)"
              v-for="(item, index) in searchFilter(formSearch[key], val.options)"
              v-if="item.name"
              :key="index"
              :class="{
                active: chooseValues[key] && chooseValues[key].includes(item.name),
              }"
              v-html="+item.count === -1 ? `${item.nameZh}（${item.count}）` : `${item.name}（${item.count}）`"
            />
          </template>
          <template v-else>
            <div
              @click="chooseItem(key, item)"
              v-for="(item, index) in val.options"
              v-if="item.name"
              :key="index"
              :class="{
                active: chooseValues[key] && chooseValues[key].includes(item.name),
              }"
              v-html="dealItemData(item)"
            />
          </template>
        </div>
        <div v-if="innerMoreStatus[key] && innerMoreStatus[key].show" @click="innerViewMore(key)" class="item-more">
          <template v-if="innerMoreStatus[key].open">
            收起
            <i class="icon-up"></i
          ></template>
          <template v-else>
            更多
            <i class="icon-down"></i
          ></template>
        </div>
      </div>
    </div>
    <div class="filter-height-btn" v-if="showBtn" @click="handleOutBtn">
      <template v-if="outOpen">
        收起筛选条件
        <i class="icon-up"></i
      ></template>
      <template v-else>
        展开筛选条件
        <i class="icon-down"></i
      ></template>
    </div>
  </a-spin>
</template>
<script>
import trademark from "@/apis/trademark";
import { mapMutations, mapState } from "vuex";
import moment from "moment";

export default {
  props: {
    // 商标大类
    riskList: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Object,
      default: () => {},
    },
    rangeDate: {
      type: Array,
      default: () => [],
    },
    trade: String,
    typeStr: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      outToggle: false,
      innerMoreStatus: {
        categoryList: {
          show: true,
          open: false,
        },
      },
      hideClass: "",
      outOpen: false,
      outIndex: 0,
      chooseValues: {},
      filterData: {},
      endNum: 1,
      list: {},
      titleMap: {
        applyDateList: "申请年份",
        attorneyNameList: "代理律师",
        categoryList: "商标大类",
        organizedList: "申请地区",
        ownerNameList: "申请人姓名",
        smallCategorylist: "商标小类",
        statusList: "商标状态",
        categoryStatus: "同类近似",
        oneStatusList: "商标状态",
        twoStatusList: "细分状态",
      },
      // 风险大类项
      chooseBigData: [],
      // 动态筛选项
      chooseItemData: [],
      // 组合
      chooseData: [],
      formSearch: {
        attorneyNameList: "",
        ownerNameList: "",
      },
    };
  },
  computed: {
    ...mapState("trademark", ["tempRiskList", "bigTypeArr"]),
    // 已选项：
    chooseedList() {
      return [...this.chooseBigData, ...this.chooseItemData];
    },
    // 收起筛选条件按钮是否存在
    showBtn() {
      if (this.list && Object.keys(this.list).length > this.endNum) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    riskList: {
      handler(v) {
        this.chooseBigData = v.filter((item) => item.checked);
      },
      deep: true,
    },
    chooseedList: {
      async handler(newVal, oldVal) {
        if (this.diff(newVal, oldVal)) return;
        if (newVal) {
          let bigArr = [];
          let formData = {};
          if (this.filters) {
            bigArr = this.riskList.filter((item) => item.checked).map((item) => item.categoryNum);
          } else {
            // 近似商标大类
            if (this.filters) {
              bigArr = this.riskList.filter((item) => item.checked).map((item) => item.categoryNum);
            } else {
              // 精准查询商标大类
              bigArr = this.riskList.filter((item) => item.checked).map((item) => item.name);
            }
          }
          formData = { ...this.chooseValues };
          if (bigArr.length) {
            formData.categoryList = bigArr;
          }
          if (formData?.statusList?.length) {
            formData.statusList = formData.statusList.map((sItem) => {
              return (sItem = sItem === "其他" ? "" : sItem);
            });
          }
          if (formData?.twoStatusList?.length) {
            formData.twoStatusList = formData.twoStatusList.map((sItem) => {
              return (sItem = sItem === "其他" ? "" : sItem);
            });
          }
          if (formData?.organizedList?.length) {
            formData.organizedList = formData.organizedList.map((sItem) => {
              return (sItem = sItem === "其他" ? "" : sItem);
            });
          }
          this.$emit("filterUpdate", formData);
        }
        if (!this.filters) {
          await this.getData();
        } else {
          this.list = this.filters;
        }
        this.$forceUpdate();
      },
      deep: true,
    },
    chooseValues: {
      handler(v) {
        this.chooseItemData = [];
        if (Object.keys(this.chooseValues)) {
          for (let k in this.chooseValues) {
            let val = null;
            if (Array.isArray(val)) {
              val = this.chooseValues[k].map((item) => {
                item = item.replace(/<.*?>/g, "");
                return item;
              });
            } else {
              val = this.chooseValues[k];
            }

            let arrIn = this.list[k].options.filter((item) => val.includes(item.name));
            this.chooseItemData.push(...arrIn);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("trademark", ["setRiskList", "updateBigTypeArr"]),
    // 判断两个对象是否相等
    diff(obj1, obj2) {
      var o1 = obj1 instanceof Object;
      var o2 = obj2 instanceof Object;
      // 判断是不是对象
      if (!o1 || !o2) {
        return obj1 === obj2;
      }
      //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
      //例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      }
      for (var o in obj1) {
        var t1 = obj1[o] instanceof Object;
        var t2 = obj2[o] instanceof Object;
        if (t1 && t2) {
          if (!this.diff(obj1[o], obj2[o])) {
            return false;
          }
        } else if (obj1[o] !== obj2[o]) {
          return false;
        }
      }
      return true;
    },
    dealItemData(item) {
      // 固定筛选项
      if (this.filters) {
        return +item.count === -1 ? `${item.nameZh}` : `${item.name}`;
      } else {
        return +item.count === -1 ? `${item.nameZh}（${item.count}）` : `${item.name}（${item.count}）`;
      }
    },
    removeAll() {
      for (let key in this.chooseValues) {
        this.$delete(this.chooseValues, key);
      }
      const list = this.riskList.map((item) => {
        item.checked = false;
        return item;
      });
      this.setRiskList([]);
      this.updateBigTypeArr(list);
      this.$emit("update:riskList", [...list]);
      this.formSearch = { ...{ attorneyNameList: "", ownerNameList: "" } };
      this.$forceUpdate();
    },
    removeItem(item) {
      if (Object.keys(item).length === 6) {
        // 高级筛选项移除
        let k = "";
        let i = "";
        for (let key in this.chooseValues) {
          let innerData = this.chooseValues[key];
          if (innerData.includes(item.name)) {
            if (Array.isArray(this.chooseValues[key])) {
              const index = this.chooseValues[key].findIndex((v) => v === item.name);
              if (index !== -1) {
                k = key;
                i = index;
              }
            } else {
              k = key;
            }
          }
        }
        if (Array.isArray(this.chooseValues[k])) {
          this.chooseValues[k].splice(i, 1);
          if (this.chooseValues[k].length === 0) {
            this.$delete(this.chooseValues, k);
          }
        } else {
          this.$delete(this.chooseValues, k);
        }
        this.$forceUpdate();
      } else {
        // 商标大类移除
        let index = 0;
        if (this.filters) {
          // 近似大类
          this.setRiskList(this.tempRiskList.filter((temp) => temp !== item.categoryNum));
          index = this.riskList.findIndex((v) => v.categoryName === item.categoryName);
        } else {
          index = this.riskList.findIndex((v) => v.nameZh === item.nameZh);
        }
        const tmpArr = [...this.riskList];
        tmpArr[index].checked = false;
        this.updateBigTypeArr(tmpArr);
        this.$emit("update:riskList", tmpArr);
      }
    },
    getTenNum(num) {
      return +num > 9 ? num : `0${num}`;
    },
    // 获取当月最后一天
    getMothLastDate(year, month) {
      let d = new Date(year, month, 0).getDate();
      return this.getTenNum(d);
    },
    // 动态筛选项
    async getData() {
      this.loading = true;
      let chooseItems = { ...this.chooseValues };
      if (chooseItems?.statusList?.length) {
        chooseItems.statusList = chooseItems.statusList.map((sItem) => {
          return (sItem = sItem === "其他" ? "" : sItem);
        });
      }
      if (chooseItems?.twoStatusList?.length) {
        chooseItems.twoStatusList = chooseItems.twoStatusList.map((sItem) => {
          return (sItem = sItem === "其他" ? "" : sItem);
        });
      }
      if (chooseItems?.organizedList?.length) {
        chooseItems.organizedList = chooseItems.organizedList.map((sItem) => {
          return (sItem = sItem === "其他" ? "" : sItem);
        });
      }
      let params = {
        aggregationSize: 30,
        country: "US",
        categoryList: this.chooseBigData.map((item) => item.name),
        ...chooseItems,
      };
      if (this.rangeDate.length === 0) {
        if (["/fastResult/brandLawyer", "/fastResult/brandPersonnel"].includes(this.$route.path)) {
          let nowYear = moment().year();
          let nowMonth = moment().month() + 1;
          const dates = [
            ...[
              `${nowYear - 1}-${this.getTenNum(nowMonth)}-01`,
              `${nowYear}-${this.getTenNum(nowMonth)}-${this.getMothLastDate(nowYear, nowMonth)}`,
            ],
          ];
          params.applyDateStr = [...dates].join(",");
        }
      } else {
        params.applyDateStr = this.rangeDate.join(",");
      }
      if (this.typeStr) {
        params[this.typeStr] = [this.trade];
      } else {
        params.keyWord = this.trade;
      }
      const res = await this.$axiosApi(trademark.getAdvanceConditions.url, trademark.getAdvanceConditions.methods, {
        ...params,
      });
      if (res.code === 0) {
        let temp = {};
        for (let k in res.data) {
          const val = res.data[k];
          temp[k] = {
            single: true,
            options: val,
          };
          if (k === "statusList") {
            temp[k] = {
              single: true,
              options: val.map((sVal) => {
                if (sVal.name === "") {
                  sVal.name = "其他";
                }
                return sVal;
              }),
            };
          }
          if (k === "twoStatusList") {
            temp[k] = {
              single: true,
              options: val.map((sVal) => {
                if (sVal.name === "") {
                  sVal.name = "其他";
                }
                return sVal;
              }),
            };
          }
          if (k === "organizedList") {
            temp[k] = {
              single: true,
              options: val.map((sVal) => {
                if (sVal.name === "") {
                  sVal.name = "其他";
                }
                return sVal;
              }),
            };
          }
        }
        // 删除律师名或者申请人名
        if (this.typeStr) {
          this.$delete(temp, this.typeStr);
        }
        this.list = temp;
        // if (this.type) {
        //   const typeData = this.list[this.type].options[0].name;
        //   this.$set(this.chooseValues, this.type, [typeData]);
        // }
      }
      this.loading = false;
    },
    searchFilter(key, list) {
      if (key) {
        const reg = new RegExp(key, "g");
        const string = `<span style="color:#FBB52C">${key}</span>`;
        const arr = list.map((item) => {
          let temp = { ...item };
          if (temp.name && reg.test(temp.name)) {
            temp.name = temp.name.replace(reg, string);
          }
          return temp;
        });
        return arr.filter((item) => item.name.includes("#FBB52C"));
      } else {
        return list;
      }
    },
    handleOutBtn() {
      this.outOpen = !this.outOpen;
      if (this.outOpen) {
        this.outIndex = Object.keys(this.list).length;
      } else {
        this.outIndex = this.endNum;
      }
      // 选项全部收起
      if (!this.outOpen) {
        let keys = Object.keys(this.innerMoreStatus);
        if (keys.length) {
          keys.map((item) => {
            let show = this.innerMoreStatus[item].show;
            this.$set(this.innerMoreStatus, item, {
              open: false,
              show,
            });
          });
        }
      }
    },
    // 商标大类选择
    choose(index) {
      const list = this.riskList;
      this.$set(list, index, { ...list[index], checked: !list[index].checked });
      const choose = list.filter((item) => item.checked);
      this.chooseData.push(...choose);
      this.updateBigTypeArr(this.riskList);
      this.$emit("update:riskList", [...list]);
      this.$forceUpdate();
    },
    // 动态筛选选择
    chooseItem(key, item) {
      let choose = [];
      const { single } = this.list[key];
      // 选择同类近似必须先选择一个大类
      if (key === "categoryStatus") {
        const checkedBig = this.riskList.filter((big) => big.checked);
        if (!checkedBig.length) {
          return this.$message.error("请先选择一个大类");
        }
      }
      if (single) {
        if (this.filters) {
          this.$set(this.chooseValues, key, item.name);
        } else {
          this.$set(this.chooseValues, key, [item.name.replace(/<.*?>/g, "")]);
        }
      } else {
        if (this.chooseValues[key]) {
          const index = this.chooseValues[key].findIndex((v) => v === item.name);
          if (index > -1) {
            this.chooseValues[key].splice(index, 1);
          } else {
            this.chooseValues[key].push(item.name);
          }
        } else {
          this.$set(this.chooseValues, key, [item.name]);
        }
      }
      if (Object.keys(this.chooseValues).length) {
        for (let key in this.chooseValues) {
          let temp = {};
          const list = this.list[key];
          const val = this.chooseValues[key];
          if (Array.isArray(val)) {
            val.forEach((item) => {
              temp = list.options.filter((v) => v.name === item)[0];
              choose.push(temp);
            });
          } else {
            temp = list.options.filter((item) => item.name === val)[0];
            choose.push(temp);
          }
        }
        this.chooseData.push(...choose);
      }
      this.$forceUpdate();
      this.$emit("change", this.chooseValues);
    },
    innerViewMore(key) {
      this.innerMoreStatus[key].open = !this.innerMoreStatus[key].open;
    },
    updateInnerMoreStatus() {
      if (Object.keys(this.list)) {
        this.outIndex = Object.keys(this.list).length;
        Object.keys(this.list).map((item) => {
          this.$set(this.innerMoreStatus, item, { show: false, open: false });
        });
        this.$nextTick(() => {
          let temp = {};
          Object.keys(this.list).map((item) => {
            const h = this.$refs[`content${item}`][0].offsetHeight;
            temp = {
              show: h > 32 ? true : false,
              open: false,
            };
            this.$set(this.innerMoreStatus, item, temp);
            this.hideClass = "hide";
            this.outIndex = this.endNum;
          });
        });
      }
    },
    async init() {
      if (!this.filters) {
        await this.getData();
      } else {
        this.list = this.filters;
      }
      this.updateInnerMoreStatus();
      this.$forceUpdate();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang="less" scoped>
.filter-height {
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  background: #fff;
  padding: 16px 24px 12px;
  font-size: 14px;
  color: @textColor;
  line-height: 22px;
  .clearBtn {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
  &-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    overflow: hidden;
    &:last-child {
      margin-bottom: 0;
    }
    &.open {
      height: auto;
    }
    &.hide {
      height: 22px;
    }
  }
  .item {
    &-title {
      width: 108px;
      color: @textColor6;
    }
    &-content {
      flex: 1;
      width: 0;
      display: flex;
      flex-wrap: wrap;
      > div {
        margin-right: 28px;
        margin-bottom: 10px;
        cursor: pointer;
        &.active {
          color: @primaryColor;
        }
      }
      .fil-item {
        height: 24px;
        background: #f1f5ff;
        border-radius: 2px;
        margin: 0 16px 10px 0;
        font-size: 12px;
        color: #606266;
        padding: 0 8px;
        cursor: pointer;
        i {
          margin-left: 10px;
          font-weight: 500;
        }
        &:hover {
          color: @primaryColor;
        }
      }
    }
    &-more {
      color: #919498;
      cursor: pointer;
    }
    &-input {
      display: flex;
      align-items: center;
      min-width: 166px;
      height: 22px;
      background: #fafafa;
      border-radius: 40px;
      padding-left: 9px;
      input {
        height: 100%;
        color: #fbb52c;
        border: none;
        background: none;
        margin-left: 8px;
        font-size: 14px;
      }
    }
  }
  &-btn {
    position: relative;
    width: 124px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: #ffffff;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    &::after {
      content: "";
      position: absolute;
      border: 12px solid transparent;
      border-top-color: #fff;
      border-left-color: #fff;
      left: 100%;
      top: 0;
    }
    &::before {
      content: "";
      position: absolute;
      border: 12px solid transparent;
      border-top-color: #fff;
      border-right-color: #fff;
      right: 100%;
      top: 0;
    }
  }
  .icon-search {
    font-size: 16px;
    color: @primaryColor;
  }
}
</style>
