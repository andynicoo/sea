<template>
  <div class="me-pa-2" style="min-width:1100px;">
    <a-page-header
      class="me-page-header"
      :title="title"
      v-show="$route.path.indexOf('/oms/') !== 0"
    ></a-page-header>
    <a-layout class="me-page-layout">
      <div class="me-split-order">
        <h2>
          拆分订单<span>订单号：{{ orderSn }}</span>
        </h2>
        <p>
          您可以为这个订单中的商品选择不同的包裹来完成拆分订单，您也可以添加更多包裹，但请注意，一旦您的包裹已发货，您将无法撤销次操作。
        </p>
        <dl
          class="me-pack-list"
          v-for="(pack, index) in packageList"
          :key="index"
        >
          <dt>
            <span
              v-if="index > 1"
              class="me-fr ant-btn-link me-f12 me-mt-1 me-cp"
              @click="deletePack(pack, index)"
              >删除包裹</span
            >包裹{{ index + 1 }}
          </dt>
          <dd class="me-selgoods-list">
            <div class="item-order-goods" v-if="pack.length">
              <div
                class="goods-item goods-item-border"
                v-for="(goodsItem, k) in pack"
                :key="k"
              >
                <div class="order-left me-ml-2">
                  <a-popover placement="right">
                    <template slot="content">
                      <img
                        style="width: 220px; height: 220px"
                        v-lazy="goodsItem.imageUrl"
                      />
                    </template>
                    <img
                      style="width: 60px; height: 60px"
                      v-lazy="goodsItem.imageUrl"
                    />
                  </a-popover>
                </div>
                <div class="order-right">
                  <div class="order-t-box me-minh33">
                    <span class="me-go-goods me-em2">{{
                      goodsItem.itemName
                    }}</span>
                  </div>
                  <p class="c909 me-f12 me-mt-1">
                    商品编码：{{ goodsItem.itemSku }}
                  </p>
                  <p class="me-mt-1">
                    规格：{{ goodsItem.variationName }}
                    {{ $t('common.unitPrice') }}：{{
                      goodsItem.variationOriginalPrice
                    }}
                    {{ $t('common.producNum') }}：{{
                      goodsItem.variationQuantityPurchased
                    }}
                  </p>
                </div>
                <div class="me-delete">
                  <span @click="deletePackGoods(pack, goodsItem, k)">删除</span>
                </div>
              </div>
            </div>
            <div class="me-add">
              <a-button type="link" @click="addGoods(index + 1)"
                ><a-icon type="plus" />请点击选择商品</a-button
              >
            </div>
          </dd>
        </dl>
        <div>
          <a-button
            v-if="packageList.length < goodsInfo.length"
            class="me-add-pack"
            type="link"
            @click="addPack"
            ><a-icon type="plus" />添加包裹</a-button
          >
        </div>
        <div class="me-ok-cacel">
          <div class="me-tips">
            <p v-if="goodsInfoUsable.length">
              {{ goodsInfoUsable.length }}个等待被选择的商品
            </p>
            <p v-else>所有的商品已被选中</p>
            如果需要更改，请删除原有商品或者重新选择。
          </div>
          <a-button
            type="primary"
            class="me-mr-4"
            :loading="btnLoading"
            @click="splitOrderOk"
            :disabled="!!goodsInfoUsable.length"
          >
            确定拆单
          </a-button>
          <a-button @click="$router.go(-1)">取消</a-button>
        </div>
      </div>
    </a-layout>
    <a-modal
      :title="`选择包裹中的商品${packageNum}`"
      :visible="selGoodsVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      width="700px"
      wrapClassName="me-goods-pop"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :disabled="!selLen || singlePackLen"
        >
          确定
        </a-button>
      </template>
      <div class="item-order-goods">
        <div
          class="goods-item goods-item-border"
          v-for="(goodsItem, k) in goodsInfoUsable"
          :key="k"
        >
          <a-checkbox v-model="goodsItem.check" class="me-mt-4"></a-checkbox>
          <div class="order-left me-ml-2">
            <a-popover placement="right">
              <template slot="content">
                <img
                  style="width: 220px; height: 220px"
                  v-lazy="goodsItem.imageUrl"
                />
              </template>
              <img
                style="width: 60px; height: 60px"
                v-lazy="goodsItem.imageUrl"
              />
            </a-popover>
          </div>
          <div class="order-right">
            <div class="order-t-box me-minh33">
              <span class="me-go-goods me-em2">{{ goodsItem.itemName }}</span>
            </div>
            <p class="c909 me-f12 me-mt-1">商品编码：{{ goodsItem.itemSku }}</p>
            <p class="me-mt-1">
              规格：{{ goodsItem.variationName }}
              {{ $t('common.unitPrice') }}：{{
                goodsItem.variationOriginalPrice
              }}
              {{ $t('common.producNum') }}：{{
                goodsItem.variationQuantityPurchased
              }}
            </p>
          </div>
        </div>
        <div v-for="(pack, index) in packageList" :key="'a' + index">
          <div class="me-pack-title" v-if="pack.length">
            包裹{{ index + 1 }}
          </div>
          <div
            class="goods-item goods-item-border"
            v-for="(goodsItem, k2) in pack"
            :key="'b' + k2"
          >
            <div class="order-left me-ml-2">
              <a-popover placement="right">
                <template slot="content">
                  <img
                    style="width: 220px; height: 220px"
                    v-lazy="goodsItem.imageUrl"
                  />
                </template>
                <img
                  style="width: 60px; height: 60px"
                  v-lazy="goodsItem.imageUrl"
                />
              </a-popover>
            </div>
            <div class="order-right">
              <div class="order-t-box me-minh33">
                <span class="me-go-goods me-em2">{{ goodsItem.itemName }}</span>
              </div>
              <p class="c909 me-f12 me-mt-1">
                商品编码：{{ goodsItem.itemSku }}
              </p>
              <p class="me-mt-1">
                规格：{{ goodsItem.variationName }}
                {{ $t('common.unitPrice') }}：{{
                  goodsItem.variationOriginalPrice
                }}
                {{ $t('common.producNum') }}：{{
                  goodsItem.variationQuantityPurchased
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p :class="{ 'me-status-error': singlePackLen }">
        {{ selLen }}/{{ goodsInfoUsable.length
        }}<span v-if="singlePackLen"
          >不允许把所有商品到1个包裹，请重新选择商品</span
        >
      </p>
    </a-modal>
  </div>
</template>

<script>
import Order from '@/api/order'

export default {
  components: {},
  data() {
    return {
      title: '待处理订单/拆分订单',
      orderSn: '',
      goodsInfo: [],
      goodsInfoUsable: [],
      selGoodsVisible: false,
      packageNum: 1,
      packageList: [[], []],
      btnLoading: false
    }
  },
  async created() {
    this.$data.orderSn = this.$route.query.id
    let { data } = await Order.getOrderList({ ordersn: this.$data.orderSn })
    this.$data.goodsInfo = data.records[0].items.map((item) => {
      this.$set(item, 'check', false)
      return item
    })
    this.updataGoods()
    console.log(this.$data.goodsInfo)
  },
  computed: {
    //选中个数
    selLen() {
      return this.goodsInfoUsable.filter((item) => item.check).length
    },
    //单个包裹总数
    singlePackLen() {
      if (
        this.$data.goodsInfo.length ==
        this.selLen + this.packageList[this.packageNum - 1].length
      ) {
        return true
      }
      return false
    }
  },
  mounted() {},

  methods: {
    //删除包裹
    deletePack(pack, index) {
      pack.forEach((item) => {
        item.check = false
      })
      this.updataGoods()
      this.$data.packageNum = index - 1
      this.packageList.splice(index, 1)
      console.log(this.packageList)
    },
    //添加包裹
    addPack() {
      this.packageList.push([])
    },
    //包裹添加商品
    addGoods(index) {
      if (!this.goodsInfoUsable.length)
        return this.$warning({
          title: '提示',
          content:
            '对不起，订单中所有的商品都被选中。如果需要修改，请删除包裹或删除包裹中的物品，然后再重新选择商品。'
        })
      this.$data.packageNum = index
      this.$data.selGoodsVisible = true
      this.updataGoods()
    },
    //确认添加
    handleOk() {
      let { packageNum, goodsInfoUsable } = this.$data
      this.$data.packageList[packageNum - 1].push(
        ...goodsInfoUsable.filter((item) => item.check)
      )
      this.updataGoods()
      this.$data.selGoodsVisible = false
    },
    //取消添加
    handleCancel() {
      this.$data.goodsInfoUsable = this.$data.goodsInfoUsable.map((item) => {
        item.check = false
        return item
      })
      this.$data.selGoodsVisible = false
    },
    //包裹删除商品
    deletePackGoods(pack, item, index) {
      item.check = false
      pack.splice(index, 1)
      this.updataGoods()
    },
    //更新可选商品
    updataGoods() {
      let { goodsInfo } = this.$data
      this.$data.goodsInfoUsable = goodsInfo.filter((item) => !item.check)
    },
    //确定拆单
    async splitOrderOk() {
      let { orderSn, packageList } = this.$data
      let package_list = []
      packageList.forEach((item) => {
        if (item.length) {
          let item_list = []
          item.forEach((item2) => {
            item_list.push({
              item_id: item2.itemId,
              model_id: item2.variationId
            })
          })
          package_list.push({ item_list })
        }
      })
      if (!package_list.length)
        return this.$message.warning('请在包裹中添加商品！')
      this.$data.btnLoading = true
      await Order.orderSplitOrder({
        order_sn: orderSn,
        package_list
      })
      this.$data.btnLoading = false
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/theme/mixins.scss';
.me-em2 {
  @include ellipsisMultiline(1);
}
.c909 {
  color: #909099;
}
.me-f12 {
  font-size: 12px !important;
  line-height: 14px;
}
.me-split-order {
  padding: 20px;
  width: 80%;
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
    span {
      font-size: 12px;
      margin-left: 20px;
    }
  }
}
.me-pack-list {
  margin-top: 15px;
  dt {
    font-size: 16px;
  }
  dd {
    border: 1px solid #eee;
    border-radius: 2px;
  }
  .me-add {
    text-align: center;
    margin: 5px 0;
  }
}
.me-add-pack {
  padding: 0px;
  margin-top: 10px;
}
.me-ok-cacel {
  margin-top: 30px;
  text-align: center;
  position: relative;
}
.me-tips {
  position: absolute;
  left: 0;
  top: -5px;
  text-align: left;
}

.me-goods-pop {
  .ant-modal-body {
    padding: 0 0px 10px;
    overflow-y: auto;
    max-height: 500px;
  }
}
.item-order-goods {
  .goods-item {
    display: flex;
    margin-bottom: 20px;
    .order-left {
      flex: 0 0 40px;
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .v-input {
      margin-top: 23px;
    }
    .order-right {
      padding-left: 12px;
      .order-t-box {
        .mark-wrap {
          width: auto;
          color: rgba(0, 0, 0, 0.38);
          padding-right: 15px;
          float: left;
          .mark-item {
            color: #1abc9c;
            font-size: 16px;
            margin-right: 6px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
.me-selgoods-list {
  .goods-item {
    border-bottom: 1px solid #eee;
    margin: 0;
    padding: 10px 0;
  }
  .me-go-goods {
    width: 600px;
  }
}
.me-delete {
  display: flex;
  align-items: center;
  span {
    color: red;
    cursor: pointer;
    padding-left: 50px;
  }
}
.me-pack-title {
  background: #f5f5f5;
  margin-bottom: 10px;
  padding: 2px 10px;
}
</style>
