<template>
  <div class="remain-renew-btn" @mouseenter="remainRenewVisiable = true">
    <div class="remain-renew-tips" v-if="remainRenewVisiable">
      <dl class="renewalReminder-content">
        <dt>
          <a-icon type="close" @click="remainRenewVisiable = false" /><img
            src="@/assets/images/user/renewalReminderIcon.png"
          />续费提醒
        </dt>
        <dd>
          {{ renewalBeforeData.companyNameZh }} {{ renewalBeforeData.serviceName }} 将于
          {{ dateHandle }}过期，若超出续费截止日服务将自动失效，请及时续费。
        </dd>
        <dd class="renewalReminder-button">
          <a-button type="link" @click="remainRenewVisiable = false">稍后提醒</a-button
          ><a-button
            type="primary"
            size="small"
            @click="$router.push({ path: '/renewal', query: { type: 'THIRTY_DAY_WITHIN' } })"
            >立即续费</a-button
          >
        </dd>
      </dl>
    </div>
    请及时续费 <a-icon type="question-circle" />
  </div>
</template>
<script>
import moment from 'moment';
export default {
  props: {
    renewalBeforeData: {
      type: Object,
    },
  },
  computed: {
    //日期处理
    dateHandle() {
      let text = this.renewalBeforeData.expirationTime;
      let len = moment(this.renewalBeforeData.expirationTime).diff(new Date(), 'days');
      if (len < 30) {
        text = `${len}天后(${this.renewalBeforeData.expirationTime})`;
      }
      return text;
    },
  },
  data() {
    return {
      remainRenewVisiable: false,
    };
  },
  created() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.remain-renew-btn {
  position: absolute;
  top: 0;
  left: 8px;
  padding: 2px 15px;
  background: linear-gradient(270deg, #376fff 0%, #88baff 100%);
  color: #fff;
  text-align: center;
  border-radius: 0 0 10px 0;
  cursor: pointer;
  z-index: 1000;
  // width: 92px;
  // height: 16px;
  &:hover .remain-renew-tips {
    display: block;
  }
}
.remain-renew-tips {
  // display: none;
  position: absolute;
  left: 50%;
  margin-left: -235px;
  bottom: 37px;
  width: 470px;
  min-height: 123px;
  background: #eaf2ff;
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #3a7fff;
  &::before,
  &::after {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    margin-left: -12px;
    border: 12px solid transparent;
    border-top-color: #eaf2ff;
    z-index: 2;
  }
  &::after {
    bottom: -26px;
    margin-left: -13px;
    border: 13px solid transparent;
    border-top-color: #3a7fff;
    z-index: 1;
  }
}
.renewalReminder-content {
  padding: 16px;
  color: #606266;
  text-align: left;
  line-height: 20px;
  margin: 0;
  dd {
    margin-bottom: 0;
  }
  dt {
    font-size: 14px;
    color: #303132;
    line-height: 22px;
    margin-bottom: 5px;
    .anticon-close {
      float: right;
      font-size: 16px;
      color: #999;
    }

    img {
      width: 26px;
      vertical-align: top;
    }
  }
}
.renewalReminder-button {
  text-align: right;
  .ant-btn-primary {
    min-width: 84px;
    height: 20px;
    line-height: 19px;
    background: #3a7fff;
    border-color: #3a7fff;
    border-radius: 4px !important;
    font-size: 12px;
  }
  .ant-btn-link {
    font-size: 12px;
    margin-right: 10px;
  }
}
.remain-gutter-box-yellow {
  .remain-renew-btn {
    background: linear-gradient(270deg, #fa8214 0%, #faad14 100%);
  }
  .remain-renew-tips {
    background: #fff6e9;
    border: 1px solid #faad14;
    &::before {
      border-top-color: #fff6e9;
    }
    &::after {
      border-top-color: #faad14;
    }
  }
  .ant-btn-primary {
    background: #faad14;
    border-color: #faad14;
  }
}
</style>
