<template>
  <div class="container" :style="{ 'margin-left': !showTit ? '0px' : '0px' }">
    <div class="headContent" v-if="showTit">
      <div class="bottom">合规服务</div>
    </div>
    <div class="content">
      <div v-if="productListCountry.length > 0">
        <div class="countries" v-for="(v, i) in productListCountry" :key="i">
          <div class="serviceList">
            <div v-for="(item, index) in v.list" :key="index">
              <template v-if="item && item.productName">
                <div class="countryTitle">{{ item.productName }}</div>
                <service-item :info="item"></service-item>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serviceItem from '@/views/common/shoppingCart/serviceItem';
import { baseInfo, productInfo } from '@/api/shoppingCar/shoppingCar';
import { zeroBuyStatusAPI } from '@/api/activity';
import '@/styles/common.less';
import { array } from 'yargs';
export default {
  props: {
    codeList: {
      type: array,
      default: () => [],
    },
    showTit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      countryCode: [], // 国家code
      productList: [],
      countryInfo: [],
      curent: -1,
      btnFlag: false,
      scrollTop: 0,
      taxInspection: [],
      productListCountry: [],
      listQuery: {
        applySit: 1,
        status: 1,
        // functionCodes: [16, 31, 32],
        functionCodes: this.codeList,
      },
      zeroProductList: [],
    };
  },
  components: {
    serviceItem,
  },
  watch: {
    productList(val, old) {
      this.productListCountry = JSON.parse(JSON.stringify(this.productListCountry));
      if (this.productListCountry.length == 0) this.getProductInfo();
      this.productListCountry = JSON.parse(JSON.stringify(val));
      let idList = this.ActiveConfig.producIdList;
      
      this.productListCountry.map((res) => {
        res.list.map((item, index) => {
          if (idList.includes(item.id)) {
            delete res.list[index];
            // res.list.splice(index,1)
          }
        });
      });
    },
  },
  created() {
    this.getBaseInfo();
    this.getZeroProductList();
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop);
  },
  methods: {
    getBaseInfo() {
      baseInfo().then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.countryCode.push(res.data[i].countryCode);
          this.countryInfo = res.data;
        }
      });
    },
    getProductInfo() {
      const self = this;
      productInfo(this.listQuery).then((res) => {
        let arr = JSON.parse(JSON.stringify(res.data.records));
        arr.forEach((item) => {
          if (typeof item.productId == 'undefined') {
            item.productId = item.id;
          }
          item.functionCode = item.productCategoryVo.functionCode;
          item.serviceType = item.productCategoryVo.functionCode;
          item.id = item.productId;
        });
        localStorage.setItem('productInfo', JSON.stringify(arr));
        // this.productList = arr;
        // 0元购活动关联商品信息
        arr.map((item) => {
          item.oldUser = true;
          self.zeroProductList.map((vv) => {
            // 0元购商品
            if (item.productId === vv.productId) {
              item.buy = vv.buy;
              item.empty = vv.empty;
              item.limit = vv.limit;
              item.oldUser = false;
              console.log(item);
            }
          });
        });
        this.taxInspection = [];
        this.listQuery.functionCodes.map((item) => {
          let obj = {
            list: [],
          };
          arr.map((i, v) => {
            if (i.productCategoryVo.functionCode == item) {
              obj.list.push(i);
            }
          });
          if (obj.list.length > 0) {
            self.$nextTick(() => {
              self.productList.push(obj);
            });
          }
        });
        self.$nextTick(() => {
          self.productListCountry = JSON.parse(JSON.stringify(self.productList));
        });
      });
    },
    getZeroProductList() {
      zeroBuyStatusAPI()
        .then((res) => {
          if (res.code === 0) {
            if (JSON.stringify(res.data) !== '{}') this.zeroProductList = res.data;
          }
        })
        .finally(() => {
          this.getProductInfo();
        });
    },
    // currentItem(index, item) {
    //   this.productListCountry = []
    //   let itemArr = []
    //   this.curent = index
    //   let data = JSON.parse(JSON.stringify(this.productList))
    //   if (index === -1) {
    //     this.productListCountry = data
    //   } else {
    //     itemArr = data.filter(ele => {
    //       if (ele.countryNameEn === item.countryNameEn) {
    //         return ele
    //       }
    //     })
    //     this.productListCountry.push(...itemArr)
    //   }
    // },
    backTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      const that = this;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 100) {
        that.btnFlag = true;
      } else {
        that.btnFlag = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin-left: 24px;
  margin-top: 10px;
  padding-bottom: 24px;
  background: #f6f5f8;
  min-height: calc(100vh - 86px);
  .headContent {
    margin-top: -10px;
    margin-left: -24px;
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
  }
  .title {
    padding: 24px;
    background: #ffffff;
    font-size: 16px;
    font-size: 24px;
    font-family: 'Microsoft Yahei', PingFangSC-Semibold, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    border-radius: 10px;
    // margin-bottom: -20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f6f6f6;
    margin-top: 24px;
    .tab {
      margin-right: 44px;
      cursor: pointer;
    }
    .active {
      color: #16ade9;
    }
  }
  .content {
    margin-right: 24px;
    margin-top: 24px;
    .item-box {
      background: #ffffff;
      border-bottom: 1px solid #f6f6f6;
      margin-top: 20px;
      padding: 10px 24px;
      font-size: 16px;
      color: #333333;
      line-height: 22px;
      .right {
        width: 90%;
      }
      .item {
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        cursor: pointer;
        margin-right: 29px;
        padding: 4px 8px;
        border-radius: 2px;
        line-height: 40px;
      }
      .item-active {
        background: #16ade9;
        color: #ffffff;
      }
    }
    .countries {
      background: #ffffff;
      padding: 20px;
      // margin-top: 20px;
      // overflow-x: auto;
      padding-right: 0px;
      .countryTitle {
        margin-bottom: 5px;
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        color: #333333;
        // border-bottom: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        padding: 0px 10px 10px;
        img {
          width: 26px;
          margin-right: 10px;
          margin-bottom: 2px;
          margin-left: -5px;
        }
      }
      .serviceList {
        display: flex;
        flex-flow: wrap;
        // justify-content: space-between;
        /deep/ .serviceItem:nth-child(3) {
          border-right: none;
        }
      }
    }
  }
  .up {
    background: #1890ff;
    position: fixed;
    right: 0px;
    width: 42px;
    height: 58px;
    bottom: 131px;
    padding: 7px;
    display: flex;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /deep/ .ivu-tooltip-rel {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    /deep/ .ivu-tooltip-popper {
      top: 12px !important;
      left: -93px !important;
    }
    span {
      font-size: 14px;
      color: #ffffff;
    }
    img {
      width: 20px;
      height: 20px;
      margin-bottom: 3px;
    }
  }
}
</style>
