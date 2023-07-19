<template>
  <div class="serviceItem" :class="{ notShelves: info.status === 2 }">
    <div class="left">
      <img
        :src="info.productuploadUrl"
        @click="toShoppingDetail(info)"
        alt=""
      />
    </div>
    <div class="right">
      <div class="serviceTitle" @click="toShoppingDetail(info)">
        {{ info.productName }}
      </div>
      <div class="info">
        {{ info.productContent }}
      </div>
      <div class="price" v-if="info.status === 0">
        <span class="sign">¥</span>
        <span>{{ info.price }}</span>
        <span class="sign">/{{ info.unit === 1 ? "年" : "个" }}</span>
      </div>
      <div class="price" v-else>敬请期待</div>
      <div class="buy">
        <button
          :disabled="info.status === 2"
          class="addCartBtn"
          @click="add(info.id)"
        >
          <img
            v-if="info.status === 0"
            src="@/assets/images/shoppingCar/gouwuche.png"
            alt=""
          />
          <img
            v-else
            src="@/assets/images/shoppingCar/gouwuchegray.png"
            alt=""
          />
          加入购物车
        </button>
        <button
          :disabled="info.status === 2"
          class="buyNowBtn"
          @click="buyNow(info.id, info)"
        >
          立即购买
        </button>
      </div>
    </div>
    <!-- <div class="line"></div> -->
    <Modal v-model="tipsModal">
      <p slot="header" class="tipsModal-title">温馨提示</p>
      <p class="tipsModal-content">
        注销税号服务目前仅支持在跨标云办理过VAT业务的用户，购买前建议联系客服咨询，如果不便之处敬请谅解！
      </p>
      <Divider />
      <div slot="footer">
        <Button @click="tipsModalSure" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { addToCart, totalShoppingCart } from '@/api/shoppingCar/shoppingCar'
export default {
  props: {
    info: {}
  },
  data () {
    return {
      tipsModal: false,
      id: ''
    }
  },
  created () {},
  methods: {
    add (id) {
      addToCart({
        count: 1,
        productId: id
      }).then((res) => {
        // console.log(res)
        if (res.code === 0) {
          this.$Message.success('已加入购物车')
          totalShoppingCart().then((res) => {
            this.$store.commit('saveCarNumStatue', res.data)
          })
        } else {
          this.$Message.error('加入购车车失败')
        }
      })
    },
    push (href) {
      this.$router.push('shoppingCart')
    },
    toShoppingDetail (info) {
      // console.log(info)
      if (info.status === 0) {
        this.$router.push({ path: '/serviceDetail', query: { id: info.id } })
      }
    },
    buyNow (id, info) {
      if (info.functionCode === 6) {
        this.tipsModal = true
      } else {
        this.$router.push({
          path: '/sureOrder',
          query: { id: id, from: 'list' }
        })
      }
      this.id = id
    },
    tipsModalSure () {
      this.$router.push({
        path: '/sureOrder',
        query: { id: this.id, from: 'list' }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.serviceItem {
  width: 33%;
  height: 118px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: flex-start;
  margin-right: 20px;
  position: relative;
  border-right: 1px solid #dddddd;
  border-radius: 0px;
  padding-right: 20px;
  .left {
    img {
      width: 134px;
      height: 118px;
      cursor: pointer;
      border-radius: 6px;
    }
    margin-right: 12px;
  }
  .right {
    height: 100%;
    width: 100%;
    .serviceTitle {
      font-size: 16px;
      font-weight: 500;
      color: #00a3ff;
      margin-bottom: 5px;
      margin-top: -3px;
      cursor: pointer;
    }
    .info {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 18px;
      margin-bottom: 4px;
      height: 36px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .price {
      font-size: 18px;
      font-weight: bold;
      color: rgba(237, 62, 62, 1);
      margin-bottom: 5px;
      display: flex;
      align-items: baseline;
      .sign {
        font-size: 12px;
      }
    }
    .buy {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .addCartBtn,
      .buyNowBtn {
        width: 50%;
        border-radius: 4px;
        height: 28px;
        font-size: 12px;
        font-weight: 400;
        line-height: 13px;
        padding: 5px 10px;
        border: none;
        outline: none;
        cursor: pointer;
        box-shadow: 0px 2px 4px 0px rgba(3, 93, 129, 0.1);
      }
      .addCartBtn {
        background: rgba(237, 248, 252, 1);
        border: 1px solid #00a3ff;
        border-radius: 4px;
        color: #00a3ff;
        margin-right: 10px;
        display: flex;
        padding: 0px;
        align-items: center;
        justify-content: center;
        img {
          margin-right: 2px;
          width: 12px;
          height: 11px;
          margin-bottom: 2px;
        }
      }
      .buyNowBtn {
        color: #ffffff;
        background: #00a3ff;
        border-color: #00a3ff;
      }
    }
  }
  .line {
    width: 1px;
    height: 105px;
    background: #dddddd;
    position: absolute;
    right: -30px;
    top: 7px;
  }
}
.notShelves {
  .right {
    .buy {
      .addCartBtn {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(200, 200, 200, 1);
        color: rgba(200, 200, 200, 1);
        border-color: #c8c8c8;
      }
      .buyNowBtn {
        background: rgba(200, 200, 200, 1);
        color: rgba(255, 255, 255, 1);
        border-color: #c8c8c8;
      }
    }
  }
}
@media (min-width: 1440px) {
  .serviceItem .right .buy {
    .addCartBtn,
    .buyNowBtn {
      max-width: 108px;
    }
  }
}
@media (min-width: 1920px) {
  .serviceItem {
    height: 140px;
    .left {
      img {
        width: 160px;
        height: 100%;
      }
    }
    .right {
      .serviceTitle {
        margin-bottom: 10px;
      }
      .info {
        margin-bottom: 10px;
      }
      .price {
        margin-bottom: 8px;
      }
    }
  }
}
.tipsModal-title {
  font-size: 22px;
  color: #333;
  font-weight: 600;
}
.tipsModal-content {
  font-size: 16px;
  line-height: 26px;
}
</style>
