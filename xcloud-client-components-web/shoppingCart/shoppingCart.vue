<template>
  <div class="mainContent">
    <div class="no-data" v-if="carList.length == 0">
      <img src="https://fdfs.itaxs.com/group1/M00/04/9B/rBLKNV_HhkiAdyssAABP3OKB26c631.png" alt="" />
      <p>您还没有购买过服务哦~</p>
      <!-- <button @click="goHome">去首页</button> -->
    </div>
    <div class="content" v-else>
      <table>
        <tr class="name">
          <th style="width: 130px">
            <Checkbox @click.prevent.native="handleCheckAll" v-model="checkAll"></Checkbox>
          </th>
          <th width="320px">服务</th>
          <th>国家</th>
          <th>价格</th>
          <th>数量</th>
          <th>小计</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in carList" :key="item.productUniqueKey" :class="{ solOut: item.status === 2 }">
          <td>
            <!-- v-if="item.status === 1" -->
            <Checkbox v-model="item.checked" @on-change="checkChange(item.checked, index)" style="margin-left: 26px">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Checkbox>
            <!-- <span v-else class="solOutStatus">已售完</span> -->
          </td>
          <td>
            <div class="serviceName">
              <img @click="toShoppingDetail(item.productId)" :src="item.pcProductImgUrl" alt="" />
              <div class="right">
                <p @click="toShoppingDetail(item.productId)">{{ item.productName }}</p>
                <p v-if="item.productSpecs.length">
                  服务项目：{{ item.productSpecs.map((spec) => spec.productSpecName).join() }}
                </p>
                <template v-for="specs in item.productSpecs">
                  <template v-if="specs.productAdditionSpecs.productAdditionSpecCalcType">
                    <dl
                      :key="specs.productSpecId"
                      v-if="specs.productAdditionSpecs.productAdditionSpecCalcType == 'QUANTITY'"
                      class="product-addition-spec"
                    >
                      <dt>附加服务：</dt>
                      <dd>
                        <div
                          :key="index"
                          v-for="(addiSpec, index) in specs.productAdditionSpecs.productAdditionSpecDetail"
                        >
                          {{ addiSpec.productAdditionSpecName }} * {{ addiSpec.productAdditionSpecQuantity }}
                        </div>
                      </dd>
                    </dl>
                  </template>
                </template>
                <div v-if="item.groupProducts.length" class="group-products-box">
                  <template v-for="goods in item.groupProducts">
                    <div :key="goods.orderProductId" v-if="goods.productSpecs.length" class="group-products-child-name">
                      服务{{ index + 1 }}：{{ goods.productName }}
                    </div>
                    <div :key="goods.orderProductId + 'b'" v-if="goods.productSpecs.length">
                      服务项目：{{ goods.productSpecs.map((spec) => spec.productSpecName).join() }}
                    </div>
                    <div v-for="specs in goods.productSpecs" :key="specs.productSpecId">
                      <dl
                        v-if="specs.productAdditionSpecs.productAdditionSpecCalcType == 'QUANTITY'"
                        class="product-addition-spec"
                      >
                        <dt>附加服务：</dt>
                        <dd>
                          <div
                            :key="index"
                            v-for="(addiSpec, index) in specs.productAdditionSpecs.productAdditionSpecDetail"
                          >
                            {{ addiSpec.productAdditionSpecName }} * {{ addiSpec.productAdditionSpecQuantity }}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </td>
          <td class="countryName">
            {{ item.countryName }}
          </td>
          <td class="price">
            <p>￥{{ item.productPaymentMoney }}</p>
          </td>
          <td>
            <div class="changeNum">
              <button :disabled="isAddMin" @click="minute(item)" :class="item.quantity == 1 ? 'disable' : ''">-</button>
              <input type="text" :value="item.quantity" @blur="changeblur(item, $event)" />
              <button :disabled="isAddMin" class="add" @click="add(item)">+</button>
            </div>
          </td>
          <td>
            <div>
              <span>￥{{ (item.quantity * item.productPaymentMoney).toFixed(2) }}</span>
            </div>
          </td>
          <td>
            <div class="delete cursor" @click="handleDel(index)">
              <img src="@/assets/images/shoppingCar/shanchu.png" alt="" />
              删除
            </div>
          </td>
        </tr>
      </table>

      <div class="footer flex-between">
        <div class="left">
          <Checkbox @click.prevent.native="handleCheckAll" v-model="checkAll">全选</Checkbox>
        </div>
        <div class="right flex-center">
          <div class="selectedItems">已选 {{ selectedList.length }} 件</div>
          <div class="total">
            合计：
            <span class="red">￥{{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div class="settlement fr" @click="settlement">去结算</div>
    </div>
  </div>
</template>

<script>
import { Throttle } from './../utils/throttle.js';
import {
  modifyShoppingCartNumber,
  totalShoppingCart,
  deleteCartItems,
  getListItems,
  getChannelListItems,
} from './../api/shoppingCar';
import { cloneDeep } from 'lodash';
export default {
  data() {
    return {
      carList: [], // 购物车列表
      checkAll: false, // 是否全选
      selectedList: [], // 购物车选中的列表
      totalPrice: 0, // 总价
      productList: [], // 商品列表
      isToOrderPage: true, // 是否可以去订单页面
      countryList: [],
      isAddMin: false,
      enterpriseid: JSON.parse(localStorage.getItem('objInfo')).enterpriseId,
    };
  },
  computed: {
    contentStyleObj() {
      return { 'min-height': window.screen.height - 240 + 'px' };
    },
  },
  methods: {
    handleDel(i) {
      deleteCartItems({
        productUniqueKey: this.carList[i].productUniqueKey,
      }).then((res) => {
        if (res.code === 0) {
          this.carList.splice(i, 1);
          this.selectedList.splice(i, 1);
          this.$Message.success('删除成功');
          localStorage.setItem('selectedList', JSON.stringify(this.selectedList));
          this.calculateSelectedNum();
          this.getShoppingCar();
        }
      });
    },
    minute(item) {
      if (item.quantity > 1) {
        if (this.isAddMin) return false;
        this.isAddMin = true;
        item.quantity--;
        this.modifyCountNumber(item.productUniqueKey, item.quantity);
      }
    },
    add(item) {
      if (this.isAddMin) return false;
      this.isAddMin = true;
      item.quantity++;
      this.modifyCountNumber(item.productUniqueKey, item.quantity);
      this.isToOrderPage = true;
    },
    /**
     * user Manual input ,update totolMoeny
     */
    changeblur(item, event) {
      if (event.target.value > 0) {
        item.quantity = event.target.value;
      } else {
        item.quantity = 1;
      }
      this.modifyCountNumber(item.productUniqueKey, item.quantity);
      this.calculateSelectedNum();
    },
    // 获取购物车数量
    getShoppingCar() {
      totalShoppingCart().then((res) => {
        this.$store.commit('saveCarNumStatue', res.data);
      });
    },
    modifyCountNumber: Throttle(function(id, quantity) {
      console.log(this.isAddMin, 'this.isAddMin');
      modifyShoppingCartNumber({
        productUniqueKey: id,
        quantity: quantity,
      }).then((res) => {
        this.getCarList();
      });
    }, 1000),

    calculateSelectedNum() {
      this.totalPrice = 0;
      this.selectedList = [];
      for (let index = 0; index < this.carList.length; index++) {
        if (this.carList[index].checked) {
          this.selectedList.push(this.carList[index]);
          var a = Number(this.carList[index].quantity * this.carList[index].productPaymentMoney);
          this.totalPrice +=
            Number(this.carList[index].quantity * this.carList[index].productPaymentMoney).toFixed(2) * 1;
        }
      }
      if (this.selectedList.length === this.carList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      localStorage.setItem('selectedList', JSON.stringify(this.selectedList));
    },
    checkChange(data, i) {
      this.carList[i].checked = data;
      if (!data) {
        this.checkAll = false;
      }
      this.calculateSelectedNum();
    },
    handleCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.carList.forEach((item, i) => {
          item.checked = true;
        });
      } else {
        this.carList.forEach((item, i) => {
          item.checked = false;
        });
      }

      this.calculateSelectedNum();
    },
    async getCarList() {
      getListItems().then((res) => {
        this.isAddMin = false;
        if (res.code === 0) {
          let carListHD = cloneDeep(this.carList);
          this.carList = res.data.map((v, i) => {
            this.$set(v, 'checked', false);
            carListHD.forEach((item) => {
              if (item.productUniqueKey == v.productUniqueKey) {
                this.$set(v, 'checked', item.checked);
              }
            });
            return v;
          });
          this.calculateSelectedNum();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    settlement() {
      var that = this;
      if (this.selectedList.length === 0) {
        this.$Message.info('您还没有选择服务哦~');
        return;
      }
      if (Number(this.totalPrice) < 0) {
        return;
      }
      this.selectedList.forEach((item, i) => {
        if (item.quantity === 0) {
          that.isToOrderPage = false;
        }
      });
      if (this.isToOrderPage) {
        this.$router.push({ path: '/sureOrder', query: { from: 'car' } });
      }
    },
    toShoppingDetail(id) {
      this.$router.push({ path: localStorage.productDetailPath, query: { id: id } });
    },
    goHome() {
      let url = '';
      if (this.invitedCode != null) {
        url = this.homePageUrl + '?invitedCode=' + this.invitedCode;
      } else if (this.promteCode != null) {
        url = this.homePageUrl + '?promteCode=' + this.promteCode;
      } else {
        url = this.homePageUrl;
      }
      window.open(url);
    },
  },
  async created() {
    this.getShoppingCar();
    if (this.enterpriseid != 42) {
      this.getCarList();
    } else {
      let { data } = await getChannelListItems({
        page: 1,
        limit: 50,
      });
      this.isAddMin = false;
      let carListHD = cloneDeep(this.carList);
      this.carList = data.map((v, i) => {
        this.$set(v, 'checked', false);
        carListHD.forEach((item) => {
          if (item.productUniqueKey == v.productUniqueKey) {
            this.$set(v, 'checked', item.checked);
          }
        });
        return v;
      });
      this.calculateSelectedNum();
    }
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 100%;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  background-color: #fff;

  .title {
    padding-bottom: 22px;
    border-bottom: 1px solid #ebebeb;
    img {
      vertical-align: middle;
    }
    span.title {
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 20px;
      font-weight: 500;
      border: none;
    }
  }
  .no-data {
    margin: 56px auto;
    text-align: center;
    p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-top: 10px;
    }
    button {
      width: 98px;
      height: 32px;
      background: #00a3ff;
      margin-top: 12px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
  }
  .content {
    background: #ffffff;
    padding: 20px;
    margin-top: 20px;
    overflow: hidden;
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 14px;
      .name {
        height: 48px;
        background: #d5f0ff;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .serviceName {
        img,
        p {
          cursor: pointer;
        }
      }
      .solOut {
        .solOutStatus,
        .countryName,
        .price {
          color: #cccccc;
        }

        .serviceName {
          p {
            color: #cccccc !important;
          }
        }
        .changeNum {
          button {
            background: #f8f8f8 !important;
            border: 1px solid #eeeeee !important;
            color: #cccccc !important;
          }
          input {
            background: #f8f8f8 !important;
            color: #cccccc !important;
            border-color: #eeeeee;
          }
        }
      }
      tr {
        border-bottom: 1px solid #f6f6f6;
        th {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          text-align: center;
        }
        td {
          color: #333333;
          text-align: center;
          .serviceName {
            padding: 20px 0px;
            display: flex;
            justify-content: center;
            .right {
              text-align: left;
              width: 238px;
              margin-left: 20px;
              p:nth-child(1) {
                color: #333333;
                font-weight: 500;
                font-size: 14px;
                margin-bottom: 13px;
                margin-top: -3px;
              }
              p:nth-child(2) {
                color: #999999;
                font-size: 12px;
                line-height: 18px;
              }
            }
            img {
              width: 84px;
              height: 73px;
            }
          }
          .red {
            font-size: 16px;
            font-weight: bold;
            color: #ed3e3e;
          }
          .changeNum {
            input {
              text-align: center;
              width: 30px;
              height: 21px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(204, 204, 204, 1);
              font-size: 12px;
              color: #666666;
              outline: none;
            }
            & button:nth-child(1) {
              width: 20px;
              height: 21px;
              background: #fff;
              border: 1px solid rgba(238, 238, 238, 1);
              outline: none;
              cursor: pointer;
            }
            button.disable {
              background: #f8f8f8;
              color: #ccc;
            }
            .add {
              width: 20px;
              height: 21px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(204, 204, 204, 1);
              color: rgba(102, 102, 102, 1);
              outline: none;
              cursor: pointer;
            }
          }
          .cursor {
            cursor: pointer;
          }
          .delete {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 15px;
              height: 15px;
              margin-right: 5px;
            }
          }
          .oriange-price {
            font-size: 13px;
            font-family: PingFangSC;
            color: #999999;
            text-decoration: line-through;
          }
        }
      }
    }
    .footer {
      margin-top: 26px;
      z-index: 11;
      margin-left: 50px;
      .right {
        color: #333333;
        .total {
          margin: 0px 20px 0px 40px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          .red {
            color: #ff6600;
            font-size: 18px;
          }
        }

        .selectedItems {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
    .settlement {
      width: 114px;
      height: 38px;
      background: #00a3ff;
      border-radius: 2px;
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      line-height: 38px;
      cursor: pointer;
      margin-top: 14px;
      margin-right: 12px;
    }
  }
}
.product-addition-spec {
  margin-bottom: 0;
  color: #999999;
  font-size: 12px;
  dd {
    margin-bottom: 0;
  }
  dt {
    display: none;
  }
}
.product-addition-spec:nth-child(3),
.product-addition-spec:first-child {
  dt {
    display: block;
  }
}
.group-products-box {
  color: #999999;
  font-size: 12px;
  .group-products-child-name {
    margin-top: 10px;
    color: #333333;
  }
}

//其它主题
.OrangeTheme {
  .content {
    table .name {
      background: #ffdc87;
    }
    .settlement {
      background: #f6b417;
    }
  }
}
</style>
