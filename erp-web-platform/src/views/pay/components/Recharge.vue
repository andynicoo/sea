<template>
  <a-modal
    :visible="showModal"
    :title="$t('overView.rechargeWangbi')"
    width="880px"
    @cancel="close()"
    @ok="handleOk()"
  >
    <div class="head">
      <div class="head-portrait">
        <img src="@/assets/images/avatar.png" contain />
      </div>
      <div class="info">
        <p class="phone">{{ $t('login.mobile') }}： {{ maAccount }}</p>
        <p class="wangbi">
          {{ $t('overView.accountBalance') }}: {{ account }}
          {{ $t('overView.wangbi') }}
        </p>
      </div>
    </div>
    <div class="cell">
      <div class="title-text">{{ $t('overView.choicePayAmount') }}</div>
      <div class="cont">
        <div class="amount-list">
          <div
            class="li"
            v-for="(li, index) of playList"
            :key="index"
            :class="{ active: activeIndex === index }"
            @click="changeAmount(index)"
          >
            <p class="coin">
              {{ li.rechargeAmount }} {{ $t('overView.wangbi') }}
            </p>
            <p class="amount">¥{{ li.payAmount }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="cell">
      <div class="title-text">{{ $t('overView.choicePayWay') }}</div>
      <div class="cont">
        <div class="pay-way-wrap">
          <div class="way-list">
            <div
              class="li"
              v-for="(li, index) of paymentList"
              :key="index"
              :class="{ active: configIndex === index }"
              @click="changeConfig(index)"
            >
              {{ li.payWay }}
            </div>
          </div>
          <div class="code-img">
            <a-spin :spinning="codeUrlLoading">
              <div class="img">
                <img :src="payInfo.codeUrl" />
              </div>
            </a-spin>
            <div class="tips">
              <p class="amount">
                ¥ <span>{{ payInfo.payAmount || 0 }}</span>
              </p>
              <p class="text">{{ payInfo.explain || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import Play from '@/api/play'
import { mapState } from 'vuex'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    playList: {
      default: []
    },
    account: {
      default: 0
    },
    activeIndex: {
      default: 0
    }
  },
  computed: {
    ...mapState({
      maAccount: (state) => {
        let tel = String(state.auth?.userInfo?.maAccount)
        if (tel) {
          tel = tel.substr(0, 3) + '****' + tel.substr(7)
        }
        return tel
      }
    })
  },
  watch: {
    showModal: {
      handler(newData) {
        if (newData) {
          this.getAvailableList()
        }
      }
    }
  },
  data() {
    return {
      configIndex: 0,
      paymentList: [], //支付方式
      payInfo: {},
      codeUrlLoading: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleOk() {
      this.$emit('ok')
    },
    getAvailableList() {
      Play.getAvailableList({ payForm: 'pc' }).then((res) => {
        if (res.code == 0) {
          this.paymentList = res.data || []
          this.changeCode()
        }
      })
    },
    changeAmount(index) {
      if (this.activeIndex != index) {
        this.$emit('clickLi', index)
        this.changeCode(this.playList[index].payAmount)
      }
    },
    changeConfig(index) {
      if (this.configIndex != index) {
        this.configIndex = index
        this.changeCode()
      }
    },
    changeCode(payAmount) {
      if (this.playList.length === 0 || this.paymentList.length === 0) {
        return false
      }
      let parm = {
        payForm: 'pc',
        payAmount: payAmount || this.playList[this.activeIndex].payAmount,
        payWayConfId: this.paymentList[this.configIndex].payWayConfId
      }
      this.payInfo = {}
      this.codeUrlLoading = true

      // console.log(parm)
      Play.payment(parm)
        .then((res) => {
          if (res.code == 0) {
            this.payInfo = res.data || {}
            this.codeUrlLoading = false
          }
        })
        .catch(() => {
          this.codeUrlLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 15px;
  .head-portrait {
    width: 48px;
    height: 48px;
    margin: 0 22px;
    img {
      width: 100%;
    }
  }
  .info {
    flex: 1;
    .phone {
      font-size: 16px;
      font-weight: bold;
      color: #745e47;
    }
    .wangbi {
      font-size: 14px;
      color: #9e8a75;
    }
  }
}
.cell {
  .title-text {
    color: #606166;
    font-size: 14px;
    line-height: 34px;
    margin-top: 10px;
    margin-bottom: 6px;
  }
}

.amount-list {
  overflow: hidden;
  .li.active {
    border: 2px solid #e8c895;
    background: #fff7eb;
  }
  .li {
    float: left;
    width: 140px;
    height: 72px;
    text-align: center;
    border: 2px solid #eee;
    border-radius: 4px;
    margin-right: 12px;
    margin-bottom: 12px;
    cursor: pointer;

    .coin {
      font-size: 20px;
      color: #ebaf5b;
      line-height: 28px;
      margin-top: 10px;
    }
    .amount {
      font-size: 14px;
      color: #909099;
    }
  }
}
.pay-way-wrap {
  border: 1px solid #e1e1e1;
  border-radius: 2px;
  padding: 10px 0;
  display: flex;
  .way-list {
    width: 178px;
    background: #f5f5f5;
    .li {
      height: 48px;
      line-height: 48px;
      padding-left: 20px;
      font-size: 14px;
      color: #313a4c;
      cursor: pointer;
    }
    .li.active {
      background: #fff;
    }
  }
  .code-img {
    flex: 1;
    display: flex;
    .img {
      width: 136px;
      height: 136px;
      margin: 18px;
      border: 1px solid #dcdcdc;
      background: #f5f5f5;
      img {
        width: 100%;
      }
    }
    .tips {
      flex: 1;
      .amount {
        color: #ff6a00;
        margin-top: 50px;
        span {
          font-size: 24px;
          font-weight: bold;
        }
      }
      .text {
        font-size: 14px;
        color: #909099;
      }
    }
  }
}
</style>
