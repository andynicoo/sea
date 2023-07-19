<template>
  <div class="me-pa-2">
    <div class="play-content">
      <div class="account">
        {{ $t('overView.accountBalance') }} {{ account
        }}{{ $t('overView.wangbi') }}
        <span @click="refresh">{{ $t('overView.refresh') }}</span>
      </div>
      <div class="play-account">
        <label>{{ $t('overView.rechargeNumber') }}:</label>
        <div class="paly-box">
          <a-button
            v-for="(item, index) in playList"
            :key="index"
            class="me-mr-2"
            :type="activeIndex == index ? 'primary' : ''"
            @click="clickIndex(item, index)"
          >
            {{ item.payAmount }}{{ $t('overView.yuan') }} ({{
              item.rechargeAmount
            }}{{ $t('overView.wangbi') }})
          </a-button>
        </div>
        <!-- TODO产品说去掉 -->
        <div class="play-btn">
          <!-- <a-button type="primary" @click="submitPlay">
            {{ $t('overView.recharge') }}
          </a-button> -->
          <a-button type="primary" @click="openRecharge">
            {{ $t('overView.recharge') }}
          </a-button>
        </div>
      </div>
    </div>
    <div class="asked">
      <div class="red-text">
        <!-- <p>1.充值后请稍等几分，然后刷新页面。</p>
        <p>2.请务必认真填写清楚订单流水号。</p> -->
      </div>
    </div>
    <div class="record-content">
      <div class="search-content">
        <a-input
          :placeholder="$t('overView.busniessNo')"
          v-model="buzNo"
          allowClear
          style="width:200px;margin-right:20px"
        ></a-input>
        <a-button class="mr-3" type="primary" @click="search">{{
          $t('common.search')
        }}</a-button>
      </div>
      <div class="table-content">
        <a-table
          :columns="columns"
          :data-source="rechargeRecords"
          :pagination="getPagination"
          @change="changePage"
          rowKey="id"
        >
          <template slot="buzAmount" slot-scope="text, record">
            <span v-if="record.buzStatusDisplay === '已出账'">-</span>
            <span v-else>+</span>
            {{ record.buzAmount }}
          </template>
        </a-table>
      </div>
    </div>
    <div class="text-center pt-2" v-show="rechargeRecords.length"></div>
    <!-- 二维码的弹窗 -->
    <a-modal v-model="dialogCode" width="320px" @ok="surePay()">
      <div class="pay-modal">
        <span class="alipay-icon"></span>
        <span class="icon-text">{{ $t('overView.zhifubaoScan') }}</span>
        <!-- <span class="wechat-icon"></span>
        <span class="icon-text">{{ $t('overView.wechat') }}</span> -->
        <div class="pay-count">{{ count }}</div>
        <div class="view-box">
          <img :src="imgUrl" style="width:100%" />
        </div>
      </div>
    </a-modal>

    <!-- 充值弹窗 -->
    <Recharge
      :showModal="showRechargeModal"
      :playList="playList"
      :account="account"
      :activeIndex="activeIndex"
      @close="showRechargeModal = false"
      @ok="completeRecharge()"
      @clickLi="clickLi"
    />
  </div>
</template>

<script>
import Play from '@/api/play'
import tableMixins from '@/mixins/tableMixins'
import Recharge from './components/Recharge'
export default {
  mixins: [tableMixins],
  components: { Recharge },
  data() {
    return {
      imgUrl: '',
      dialogCode: false,
      paginationData: {
        current: 1,
        pages: 1,
        size: 10
      },
      buzNo: '',
      current: 1,
      columns: [
        { title: this.$t('overView.time'), dataIndex: 'recordTime' },
        {
          title: this.$t('overView.busniessType'),
          dataIndex: 'buzTypeDisplay'
        },
        { title: this.$t('overView.busniessNo'), dataIndex: 'buzNo' },
        { title: this.$t('overView.desc'), dataIndex: 'buzDsp' },
        {
          title: this.$t('overView.wangbi'),
          dataIndex: 'buzAmount',
          scopedSlots: { customRender: 'buzAmount' }
        },
        { title: this.$t('overView.status'), dataIndex: 'buzStatusDisplay' }
      ],
      rechargeRecords: [],
      account: '',
      playList: [],
      activeIndex: 0,
      count: '',
      showRechargeModal: false
    }
  },
  mounted() {
    this.getPlayList()
    this.getAccount()
    this.loadData()
  },
  methods: {
    /**
     * 加载初始化数据
     */
    async loadData(flag) {
      if (flag == 'delete') {
        if (this.$data.dataSource.length == 1) {
          this.$data.paginationData.current -= 1
        }
      }
      try {
        const { data } = await this.getTableData()
        this.$data.dataSource = data.records
        this.$data.paginationData = this.getPageFromResp(data)
      } catch (error) {
        console.warn(error)
      } finally {
        this.$data.tableLoading = false
      }
    },
    // 获取账号余额
    getAccount() {
      let params = {}
      Play.getAccount(params).then((res) => {
        if (res.code == 0) {
          this.account = res.data.accBalance
        }
      })
    },
    // 获取支付配置
    getPlayList() {
      let params = {}
      Play.getPlayList(params).then((res) => {
        if (res.code == 0) {
          this.playList = res.data
          this.count =
            this.playList[0].payAmount +
            '元 (' +
            this.playList[0].rechargeAmount +
            '旺币)'
        }
      })
    },
    // 获取充值记录
    getTableData() {
      let params = {
        buzNo: this.buzNo,
        current: this.paginationData.current,
        size: this.paginationData.size
      }
      Play.getPlayRecord(params).then((res) => {
        if (res.code == 0) {
          let rechargeRecords = res.data.records
          this.rechargeRecords = rechargeRecords
          this.paginationData = this.getPageFromRespNum(res.data)
        }
      })
    },
    // 发起提交支付
    submitPlay() {
      if (this.playList.length == 0) return false
      let params = {
        confId: this.playList[this.activeIndex].id,
        payChannel: 'aliPay',
        payWay: 'ALIPAY' // WECHATPAY    ALIPAY
      }
      Play.submitPlay(params).then((res) => {
        if (res.code == 0) {
          // let url =
          //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAFIklEQVR4Xu2dCU/jQAyFp9zlKDf//++Vo0C5z65eVkHZbpt5CaXE9htpJaQ66drvi+05Ar3hcDRJGmEj0BMAYbUvHP8CYDDox45EMO/H4ycBEEzzf9wVAJHVTykJAAGgEhCZAWWAyOqrBARXXwAIAJWA4AwIAAGgWUBkBpQBIquvJjC4+gJAAKgEBGdAAAgAzQIiM6AMEFl9NYHB1RcAAkAlIDgDAkAAaBYQmQFlgMjqqwkMrr4AEAAqAcEZEAACQLOAyAwoA0RWX01gcPUFgABQCQjOgAAQAJoFRGZAGSCy+moCg6svAASASkBwBgSAANAsIDIDygCR1ffWBE4mk9Tr9YJL2sx98xkAot/f36eXl5f08fGRVlZW0sbGRtrd3U2rq6vNohHQ2jQAn5+faTQaFcJPD2SCw8PDtL6+HlBW3mXTANze3qbn5+e53iIDnJyc8NEIaGkWADz9FxcXWcmQBVASNGZHwCwAr6+v6fr6Oqvrzs5O0Q9oOAPg7e2tqP+5AfEBgYYzAND9n5+fZ3VVCagPkdkSALfu7u7S4+PjXA8xAzg6OspCEtnANADIAugDUA6mB2YAePq1FuA4A5SuPTw8JDSFAAGClwtBWhXM5zbTGSDvnixyERAAuQg5/1wAOBc4554AyEWo8jn2HLDxhH4D/cXm5maxyGS51xAAJAAQHwtPWIKuDjSd+/v7ZjedBAAJwOXl5cxdR1xueedRABAAIO1jqlk3kAmw6ITzCJaGAMiohdR/dXWVsOiUG1h/wOKTpSEAMmqNx+P09PT3DywzA/3A1tYWY9oJG1cAoDvHARE8rejQvysEnn7U/iYDpeD4+NjMzMAFABAcT+r06SAAMBgMWovB1P5ZcFjagjYPQN2GEMRpW5dxX5w4Ymr/NARoBHEUzcL6gHkAsBuI1F83UA4ODg6aZPKi60cGaDv29vbS9vZ228uXdp1pAJqkaIgBUZiBpx61f3rRh7m2tLFyINUsAOyRsKpobG1uAlYdFBZOI5kFoG5lrk4UNIX9fn+uCZ563LtN7Z++aZvS0yTLLMLWJADffULrTgrf3NwUbxktapyennZ6ddAcAG3m5rPExHlBZIO1tbWvj5su+jCQ5DIOc4+ftDEHQO5toKbBQrMGCN7f3+du9jS9Z9W+7TT0O9/Z5FpTACzq6W8SoEXYnp2ddXZNwBQAP5GiFyFw7h5d3h8wAwD7IkhOjN/4HLMO9AJdHGYAQGeODt3i6HIfYAYAvAGEN4EsDjSZ2CHs4jADAPbk0QNYHF1eEDIDwCJX6JYNEY6KdfU3lZgBAKJh/b88lr1sEdt8X/mKWlfFh0+mAKiKUP29QNV1+1k/Y18+Z4N7lzZ19uX/YXqvANeU/8rFJZ0HaPPY6JqlRsBsBlhqlBx/mQBwLC7jmgBgouTYRgA4FpdxTQAwUXJsIwAci8u4JgCYKDm2EQCOxWVcEwBMlBzbCADH4jKuCQAmSo5tBIBjcRnXBAATJcc2AsCxuIxrAoCJkmMbAeBYXMY1AcBEybGNAHAsLuOaAGCi5NhGADgWl3FNADBRcmwjAByLy7gmAJgoObYRAI7FZVwTAEyUHNsIAMfiMq4JACZKjm0EgGNxGdcEABMlxzYCwLG4jGsCgImSYxsB4FhcxjUBwETJsY0AcCwu45oAYKLk2EYAOBaXcU0AMFFybCMAHIvLuCYAmCg5thEAjsVlXBMATJQc2wgAx+Iyrv0HAHORbPxFoDccjib+3JJHbAT+AIQPsD1nvr7BAAAAAElFTkSuQmCC'
          // this.imgUrl = res.data?.qrCodeUrl || url
          // this.dialogCode = true
          let sureParams = {
            rechargeOrderNo: res.data.rechargeOrderNo
          }
          this.playSure(sureParams)
        }
      })
    },
    // 提交充值
    playSure(sureParams) {
      Play.setPlay(sureParams).then((res) => {
        if (res.code == 0) {
          this.imgUrl = 'data:image/png;base64,' + res.data
          this.dialogCode = true
        }
      })
    },
    search() {
      this.$data.paginationData = {
        current: 1
      }
      this.onSelectChange([], [])
      this.reLoadData()
    },
    refresh() {
      this.loadData()
      this.getAccount()
    },
    clickIndex(item, index) {
      if (this.activeIndex == index) return false
      this.activeIndex = index
      this.count = item.payAmount + '元 (' + item.rechargeAmount + '旺币)'
    },

    // 点击分页
    changePage({ pageSize, current }) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        size: pageSize,
        current
      }
      this.onSelectChange([], [])
      this.loadData()
    },

    surePay() {
      this.dialogCode = !this.dialogCode
      this.getAccount()
      this.getPlayRecord()
    },
    //打开充值弹窗
    openRecharge() {
      if (this.playList.length == 0) return false
      this.showRechargeModal = true
    },
    //完成充值
    completeRecharge() {
      this.showRechargeModal = false
      this.refresh()
    },
    //切换充值金额
    clickLi(index) {
      this.clickIndex(this.playList[index], index)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-content {
  background: #fff;
  border-radius: 2px;
  padding: 24px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
  .account {
    margin: 32px 0px;
    height: 104px;
    background: rgb(245, 166, 35);
    border-radius: 8px;
    color: rgb(255, 255, 255);
    font-size: 24px;
    letter-spacing: 2px;
    text-align: center;
    line-height: 104px;
    position: relative;
    span {
      position: absolute;
      cursor: pointer;
      color: #409eff;
      font-size: 14px;
      bottom: 0px;
      right: 10px;
      line-height: 40px;
    }
  }
  .play-account {
    overflow: hidden;
    label {
      float: left;
      line-height: 36px;
      margin-right: 10px;
    }
    span {
      float: left;
    }
    .paly-box {
      float: left;
      .v-btn {
        background: none;
        border: 1px solid rgb(204, 204, 204);
        margin-right: 15px;
        border-radius: 0;
        font-size: 14px;
      }
    }
    b {
      float: left;
      font-weight: normal;
      line-height: 36px;
    }
    .play-btn {
      float: right;
    }
  }
  .notice {
    color: #f44336;
    font-size: 14px;
    padding-left: 84px;
    line-height: 40px;
  }
}
.asked {
  overflow: hidden;
  .red-text {
    float: left;
    margin-top: 10px;
    p {
      color: #f44336;
      font-size: 14px;
      line-height: 30px;
      margin-bottom: 0;
    }
  }
}
.record-content {
  .search-content {
    background: #fff;
    border-radius: 2px;
    padding: 24px;
    box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
      0 1px 3px 1px rgba(60, 64, 67, 0.16);
    margin-bottom: 15px;
    button {
      margin-right: 20px;
    }
  }
}
.pay-modal {
  margin: 0;
  .alipay-icon {
    width: 28px;
    height: 28px;
    background: url('../../assets/images/aiply.png');
    background-size: cover;
    float: left;
    margin-left: 79px;
  }
  .wechat-icon {
    width: 42px;
    height: 28px;
    background: url('../../assets/images/wechat.png');
    background-size: cover;
    float: left;
    margin-left: 66px;
  }
}
</style>
