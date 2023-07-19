<template>
  <Modal class="integral-mal-modal-details" v-model="view" :width="dialogWidth" :footer-hide="true" @on-cancel="handleClose">
    <div class="details-close" slot="close"></div>
    <div class="details-head" slot="header">
      <span>可用积分余额</span>
      <p><b>{{ info.integral }}</b>积分</p>
    </div>
    <div class="details-body">
      <div class="details-body-head clearfix">
        <div class="details-body-head-tabs fl">
          <div class="item" :class="{ active: (index+1) === +type}" v-for="(item, index) in typeList" :key="index" @click="type = index+1">{{ item }}</div>
        </div>
        <p class="tips fr">为您展示近一年积分明细</p>
      </div>
      <div class="details-body-content">
        <Spin v-if="loading" fix>加载中...</Spin>
        <div class="details-body-content-list" v-if="Object.keys(list).length && !loading">
          <div class="details-body-content-panel" v-for="(value, key) in list" :key="key">
            <h4>{{ key }}</h4>
            <div class="list">
              <Row v-for="(val, index) in value" :key="`${index}_val`">
                <Col span="10">{{ val.createTime }}</Col>
                <Col span="10"><div class="ellipsis">{{ changeReason[val.changeReason] }}</div></Col>
                <Col span="4">{{ val.changeIntegral }}</Col>
              </Row>
            </div>
          </div>
        </div>
        <integral-mal-none v-if="!Object.keys(list).length && !loading" />
      </div>
    </div>
  </Modal>
</template>
<script>
import { getUserIntegralDetails, getUserInegralAccount } from '@/api/user/integralMal.js'
import IntegralMalNone from './integralMalNone.vue'
export default {
  name: 'IntegralMalModalDetails',
  inject: ['dialogWidth'],
  data() {
    return {
      loading: true,
      list: {},
      view: false,
      type: 1, // 1收入 2支出 3退回
      typeList: ['积分收入', '积分消耗'],
      changeReason: {
        1: '注册赠送',
        2: '登录赠送',
        3: '消费赠送',
        4: '分享小程序赠送',
        5: '邀请好友赠送',
        6: '积分兑换赠送商品',
        7: '后台管理员修改'
      }
    }
  },
  props: {
    info: {
      type: Object,
      default: ()=> {}
    }
  },
  computed: {
    userId() {
      let id = this.info.userId || ''
      return id
    }
  },
  watch: {
    type: {
      handler(v) {
        if(v) this.getUserIntegralDetails()
      }
    }
  },
  components: { IntegralMalNone },
  methods: {
    /**
     * 列表按日期分块处理
     */
    filterListByDate(list) {
      let temp = {}
      list.forEach(v=> {
        let year = v.createTime.split(' ')[0].split('-')[0]
        let mon = v.createTime.split(' ')[0].split('-')[1]
        let date = `${year}年${mon}月`
        if(!temp[date]) {
          temp[date] = [v]
        }else {
          temp[date].push(v)
        }
      })
      return temp
    },
    /**
     * 获取积分明细列表
     * @param userId
     */
    getUserIntegralDetails() {
      this.loading = true
      getUserIntegralDetails({
        changeType: this.type,
        enterpriseId: 30,
        limit: 100,
        page: 1,
        userId: this.userId
      }).then(res=> {
        if(+res.code === 0) {
          const list = res.data.records
          this.list = this.filterListByDate(list)
        }
      }).finally(()=> {
        this.loading = false
      })
    },
    /**
     * 弹窗显示 初始化
     */
    show() {
      this.view = true
      this.type = 1
      this.getUserIntegralDetails()
    },
    /**
     * 弹窗关闭
     */
    handleClose() {
      this.view = false
    },
  }
}
</script>
<style lang="less" scoped>
@import "../common.less";
.integral-mal-modal-details {
  .details {
    &-head {
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 0 0 26px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(255,255,255,0.9);
      line-height: 24px;
      box-sizing: border-box;
      background: url("../images/bg-dialog.png") no-repeat center/cover;
      p {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        height: auto;
        line-height: 22px;
        b {
          font-size: 28px;
          font-weight: 600;
          line-height: 40px;
          margin-right: 4px;
        }
      }
    }
    &-body {
      padding: 24px 0;
      font-size: 14px;
      color: rgba(0,0,0,0.6);
      line-height: 22px;
      &-head {
        margin: 0 24px 24px;
        &-tabs {
          font-size: 18px;
          font-weight: 500;
          color: rgba(0,0,0,0.4);
          line-height: 24px;
          display: flex;
          .item {
            margin-right: 24px;
            cursor: pointer;
            &.active {
              color: rgba(0,0,0,0.9);
              position: relative;
              &:after {
                content: '';
                position: absolute;
                width: 36px;
                height: 4px;
                background: #3F9DF4;
                border-radius: 22px;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
        }
      }
      &-content {
        height: 300px;
        overflow-y: auto;
        margin-left: 24px;
        position: relative;
        &-panel {
          margin-bottom: 24px;
          h4 {
            font-size: 14px;
            font-weight: 500;
            color: rgba(0,0,0,0.9);
            margin-bottom: 12px;
          }
          &:last-child {
            margin-bottom: 0;
          }
          .ivu-col {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .box-none {
          height: calc(100% - 40px);
        }
      }
    }
    &-close {
      width: 16px;
      height: 16px;
      background: url("../images/icon-close.png") no-repeat center/cover;
    }
  }
}
</style>
