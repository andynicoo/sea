<template>
  <div class="brand-board">
    <div class="brand-left">
      <div class="nav-section">
        <div
          v-for="(item, index) in cateList"
          :key="index"
          :class="{ nav: true, active: cateIndex === index }"
          @click="changeCate(item)"
        >
          <span>{{ Number(item.categoryNum) > 9 ? `${item.categoryNum}类` : `0${item.categoryNum}类` }}</span>
          <div class="name">{{ item.categoryName }}</div>
        </div>
      </div>
    </div>
    <div class="brand-right">
      <div class="secton-item">
        <div class="header">
          <div class="name">{{ title }}</div>
          <div class="change" @click="eChange">
            <span></span>
            <div>换一换</div>
          </div>
        </div>
        <!-- <div class="cate">
          <div>分类</div>
          <span
            v-for="(item, index) in statusArry"
            :key="index"
            :class="{ active: statusIndex === index }"
            @click="tabChange(item, index)"
            >{{ item.name }}</span
          >
        </div> -->
        <div class="loading" v-if="brandLoading">
          <a-spin size="large" />
        </div>
        <ul v-if="list.length > 0">
          <li v-for="(item, index) in list" :key="index">
            <div class="item">
              <img :src="item.imageUrl" alt="" />
              <div class="item-title">
                <div class="title">{{ item.allSimilarRemark }}</div>
                <div class="status">{{ item.oneStatusName }}</div>
                <div class="details">
                  <a-button @click="changeMonit(item)" :loading="item.loading" type="link">
                    {{ item.monitStatus === 0 ? "监测商标" : "取消监测" }}
                  </a-button>
                  <nuxt-link :to="'/trademarkdetails?countryCode=' + item.resultOrigin + '&id=' + item.remarkNumber + '&anchor=box1'">
                    <a-button type="link">查看详情</a-button>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="notice-item">
              <div class="title">申请人:</div>
              <div class="text">{{ item.ownerName }}</div>
            </div>
            <div class="notice-item">
              <div class="title">大类:</div>
              <div class="text">{{ title }}</div>
            </div>
            <div class="notice-item">
              <div class="title">申请号:</div>
              <div class="text">{{ item.remarkNumber }}</div>
            </div>
            <div class="notice-item">
              <div class="title">申请日期:</div>
              <div class="text">{{ item.applyDate }}</div>
            </div>

            <div class="notice-item" @mouseenter="viewTranslate(item)">
              <div class="title">小类:</div>
              <a-tooltip :overlayStyle="{ 'max-width': '560px' }">
                <template slot="title">
                  <div class="translate-box">
                    <div class="translate-box-top">
                      <span v-for="(valeu, index) in item.remarkSmallCategory" :key="index">{{ valeu }}</span>
                    </div>
                    <div class="translate-box-bottom">
                      参考翻译：<span v-for="(trans, tIndex) in translateArr" :key="tIndex">{{
                        tIndex === translateArr.length - 1 ? trans.val : trans.val + "；"
                      }}</span>
                    </div>
                  </div>
                </template>
                <div class="text smallText">
                  <span v-for="(valeu, index) in item.remarkSmallCategory" :key="index">{{ valeu }}</span>
                </div>
              </a-tooltip>
            </div>
          </li>
        </ul>
        <div class="empty" v-else>
          <img src="@/assets/images/depot/column.svg" alt="" />
          <div class="text">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
export default {
  data() {
    return {
      cateIndex: 0,
      title: "",
      statusArry: [
        { name: "审核期", status: "审核期 ", arry: [] },
        { name: "公告期", status: "公告期", arry: [] },
        { name: "注册异常", status: "注册异常", arry: [] },
      ],
      statusIndex: 0,
      list: [],
      categoryNum: "",
      translateArr: [],
    };
  },
  props: {
    cateList: {
      type: Array,
      default: [],
    },
    trademarkList: {
      type: Array,
      default: [],
    },
    cateBrand: {
      type: String,
      default: "1",
    },
    brandLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    cateBrand(val) {
      this.categoryNum = val;
      this.cateIndex = this.cateList.find((item) => item.categoryNum == val).categorySort - 1;
    },
    trademarkList(val) {
      // let arry1 = val.filter((item) => item.oneStatusName === "审核期");
      // let arry2 = val.filter((item) => item.oneStatusName === "公告期");
      // let arry3 = val.filter((item) => item.oneStatusName === "注册异常");
      // this.statusArry[0].arry = arry1;
      // this.statusArry[1].arry = arry2;
      // this.statusArry[2].arry = arry3;
      this.list = val;
    },
  },
  mounted() {
    let item = this.cateList[0];
    this.getTitel(item);
  },
  methods: {
    changeCate(item) {
      // this.cateIndex = index;
      this.statusIndex = 0;
      this.getTitel(item);
      this.$emit("changeCategory", item.categoryNum);
    },
    getTitel(item) {
      let title = Number(item.categoryNum) > 9 ? `${item.categoryNum}类 ` : `0${item.categoryNum}类`;
      this.title = title + " " + item.categoryName;
      this.categoryNum = item.categoryNum;
    },
    tabChange(item, index) {
      this.statusIndex = index;
      this.list = item.arry;
    },
    eChange() {
      this.statusIndex = 0;
      this.$emit("changePage", this.categoryNum);
    },
    async changeMonit(item) {
      let data = {
        countryCode: item.resultOrigin,
        remarkNumber: item.remarkNumber,
        trademarkCategoryNum: item.resultClassNum[0],
        action: item.monitStatus,
      };
      this.$set(item, "loading", true);
      let res = await this.$axiosApi(trademark.monitTrademark.url, trademark.monitTrademark.methods, data, true);
      this.$set(item, "loading", false);
      if (res.code === 0) {
        this.$set(item, "monitStatus", item.monitStatus === 0 ? 1 : 0);
      } else {
        // this.$message.error(res.message)
        const host = `${this.$store.state.host.server_url}/login`;
        localStorage.searchFlag = "trademarkquery";
        window.location = host;
      }
      console.log(res);
    },
    async viewTranslate(item) {
      const translateArr = [];
      let categoryNames = item.remarkSmallCategory;
      const params = { countryCode: "US", categoryNames: categoryNames, status: 1 };
      const res = await this.$axiosApi(trademark.getTranslationText.url, trademark.getTranslationText.methods, params);
      if (res.code === 0) {
        if (res.data.length > 0) {
          categoryNames.forEach((v) => {
            let temp = {
              key: v,
              val: "",
            };
            const cur = res.data.filter((tras) => tras.categoryNameEn.toLowerCase() === v.toLowerCase());
            if (cur.length) {
              temp.val = cur[0]?.categoryName;
              translateArr.push(temp);
            }
          });
          this.translateArr = translateArr.filter((trans) => trans.val);
        } else {
          this.translateArr = [];
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.brand-board {
  margin-top: 16px;
  display: flex;

  .brand-left {
    padding: 20px 12px;
    width: 148px;
    margin-right: 16px;
    background: #fff;

    .nav-section {
      .nav {
        height: 46px;
        overflow: hidden;
        color: #606266;
        line-height: 46px;
        padding-left: 16px;
        border-left: 1px solid #d9d9d9;
        cursor: pointer;

        span {
          float: left;
          margin-right: 4px;
        }

        .name {
          float: left;
        }
      }

      .active {
        color: #3a7fff;
        border-left: 2px solid #3a7fff;
        background: #f2f6ff;
      }
    }
  }

  .brand-right {
    flex: 1;
    background: #fff;
    padding: 16px;

    .secton-item {
      position: relative;
      .loading {
        z-index: 999;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        padding-top: 500px;
      }
      .header {
        overflow: hidden;

        .name {
          float: left;
          font-size: 18px;
          font-weight: 500;
          color: #303132;
          line-height: 26px;
        }

        .change {
          overflow: hidden;
          float: right;
          cursor: pointer;

          div {
            font-size: 14px;
            color: #919498;
            line-height: 22px;
            float: left;
          }

          span {
            width: 16px;
            height: 16px;
            background: url("@/assets/images/depot/change.svg") no-repeat;
            background-size: contain;
            float: left;
            margin-top: 3px;
            margin-right: 3px;
          }
        }
      }

      .cate {
        overflow: hidden;
        margin: 20px 0;
        position: relative;

        div {
          font-size: 14px;
          color: #606266;
          line-height: 30px;
          float: left;
          margin-right: 24px;
        }

        span {
          cursor: pointer;
          margin-right: 12px;
          background: #ffffff;
          border: 1px solid #d9d9d9;
          color: @textColor4;
          padding: 0 16px;
          line-height: 30px;
          float: left;
        }

        .active {
          background: #3370ff;
          border: 1px solid #3370ff;
          color: #fff;
        }
      }

      ul {
        overflow: hidden;

        li {
          padding: 16px;
          float: left;
          width: 314px;
          height: 350px;
          margin-right: 17px;
          margin-bottom: 20px;

          .item {
            display: flex;
            margin-bottom: 16px;

            img {
              display: block;
              width: 108px;
              height: 108px;
              margin-right: 12px;
            }

            .item-title {
              flex: 1;

              .title {
                font-size: 24px;
                font-weight: 500;
                color: @textColor;

                line-height: 32px;
                .line-clamp(1);
              }

              .status {
                margin-top: 8px;
                background: rgba(178, 201, 255, 0.2);
                border-radius: 1px 1px 1px 1px;
                line-height: 24px;
                padding: 0 8px;
                color: #3370ff;
                margin-bottom: 10px;
                display: inline-block;
              }

              .details {
                overflow: hidden;
                //display: none;
                span {
                  width: 20px;
                  height: 20px;
                  background: url("@/assets/images/depot/change.svg") no-repeat;
                  background-size: contain;
                  margin-right: 3px;
                  float: left;
                }

                .text {
                  font-size: 14px;
                  color: #3a7fff;
                  line-height: 22px;
                  float: left;
                  cursor: pointer;
                }

                .text:first-of-type {
                  margin-right: 24px;
                }
                /deep/ .ant-btn-link {
                  color: #3a7fff;
                  padding: 0;
                  margin-right: 10px;
                }
              }
            }
          }

          .notice-item {
            display: flex;
            margin-bottom: 6px;

            .title {
              font-size: 14px;
              color: @textColor4;
              line-height: 22px;
              width: 70px;
            }

            .text {
              flex: 1;
              font-size: 14px;
              color: @textColor6;
              line-height: 22px;
              .line-clamp(1);
            }
            .smallText {
              .line-clamp(3);
            }
          }
        }

        li:nth-child(3n) {
          margin-right: 0;
        }

        li:hover {
          background: #f5f9ff;
          .item {
            .item-title {
              .details {
                display: block;
              }
            }
          }
        }
      }
      .empty {
        width: 74px;
        margin: 120px auto;
        img {
          display: block;
          width: 100%;
        }
        .text {
          margin-top: 8px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.25);
          line-height: 22px;
          text-align: center;
        }
      }
    }
  }
  .translate {
    &-box {
      font-size: 12px;
      line-height: 20px;
      &-top {
        //.line-clamp(2);
        color: #303132;
      }
      &-bottom {
        border-top: 1px solid #f0f0f0;
        margin-top: 8px;
        color: #606266;
        //.line-clamp(2);
        padding-top: 8px;
      }
    }
  }
}
</style>
