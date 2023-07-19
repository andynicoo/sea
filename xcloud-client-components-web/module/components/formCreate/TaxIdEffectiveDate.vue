<template>
  <div>
    <a-select
      :value="currentVal"
      style="width: 300px"
      @change="changeValue"
      allowClear
      :placeholder="formItem.placeHolder"
      :getPopupContainer="
        (triggerNode) => {
          return triggerNode.parentNode;
        }
      "
    >
      <a-select-option v-for="(item, index) in timeArray" :key="index" :value="item">
        {{ item }}
      </a-select-option>
      <a-select-option value="其他日期">
        其他日期
      </a-select-option>
    </a-select>
    <a-drawer
      title="税号生效日期——其它日期"
      placement="right"
      :closable="false"
      :visible="taxIdEffectiveVisible"
      width="520"
      @close="visible = false"
    >
      <ul class="taxIdEffective-con">
        <li>
          <h3>1、目前是否已产生德国境内的应税销售额？</h3>
          <a-radio-group v-model="salesVolume" @change="salesVolumeChange">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="2">
              否
            </a-radio>
          </a-radio-group>
        </li>
        <li v-if="salesVolume === 1">
          <h3>2、税号生效日期</h3>
          <p>
            若目前已产生销售额，请选择<span>第一笔销售开始时间</span>，如果您选择的年份为<span>去年或更早的年份，税局可能要求卖家对历史销售完成补税合规</span>，才会下号，请悉知。
          </p>
          <a-date-picker :value="firstSalesTime" @change="firstSalesTimeChange" :disabled-date="disabledDate" />
        </li>
        <li v-if="salesVolume === 2">
          <h3>2、期望税号生效期日范围</h3>
          <a-radio-group v-model="dateRange" @change="dateRangeChange">
            <a-radio :value="1">
              近三个月内
            </a-radio>
            <a-radio :value="2">
              未来三个月以后
            </a-radio>
          </a-radio-group>
        </li>
        <li v-if="dateRange === 1 && salesVolume === 2">
          <h3>3、税号生效日期</h3>
          <a-select :value="inThreeMonths" style="width: 300px" @change="inThreeMonthsChange">
            <a-select-option v-for="(item, index) in timeArray" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </li>
        <li v-if="dateRange === 2 && salesVolume === 2">
          <h3>3、税号生效日期</h3>
          <p>1、税号生效日期超过未来三个月，下号时效可能较慢；</p>
          <p>2、日期，系统默认为当前选择月份的1号，有利于快速下号。</p>
          <a-month-picker
            placeholder="请选择"
            @change="monthDateChange"
            :disabled-date="disabledMonthDate"
            :value="monthDate"
          />
        </li>
      </ul>
      <div class="drawer-footer">
        <a-button :style="{ marginRight: '8px' }" @click="taxIdEffectiveVisible = false">
          取消
        </a-button>
        <a-button type="primary" @click="drawerOk">
          确认
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: {
    value: { type: String },
    formItem: { type: Object },
    fApi: { type: Object },
  },
  data() {
    return {
      currentVal: undefined,
      timeArray: [],
      taxIdEffectiveVisible: false,
      salesVolume: '',
      dateRange: '',
      monthDate: '',
      firstSalesTime: '',
      inThreeMonths: '',
    };
  },
  mounted() {
    this.dateHandle();
  },
  watch: {
    value: {
      immediate: true, // 这是为了第一次拿到值的时候就对sd进行监听
      handler(val) {
        if (val) {
          this.currentVal = val;
        } else {
          this.currentVal = undefined;
        }
      },
    },
  },
  methods: {
    //期望税号生效期日范围
    dateRangeChange(e) {
      let val = e.target.value;
      if (val === 2) {
        this.$confirm({
          title: '若将期望税号生效日期，选择在未来三个月以后，下号时效可能较慢，继续保持当前选择吗？',
          centered: true,
          onOk: () => {
            this.dateRange = 2;
          },
          onCancel: () => {
            this.dateRange = 1;
          },
        });
      } else {
        this.dateRange = val;
      }
    },
    //不可选月份
    disabledMonthDate(current) {
      return (
        current &&
        current <
          moment(new Date())
            .add(3, 'months')
            .endOf('day')
      );
    },
    //不可选日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    //确认
    drawerOk() {
      // 已产生销售额
      if (this.salesVolume === 1) {
        if (this.firstSalesTime) {
          this.currentVal = this.firstSalesTime;
          this.$emit('input', this.currentVal);
          this.taxIdEffectiveVisible = false;
        } else {
          this.$message.warning('请选择时间!');
        }
      } else if (this.salesVolume === 2) {
        // 近三个月内
        if (this.dateRange === 1) {
          if (this.inThreeMonths) {
            this.currentVal = this.inThreeMonths;
            this.$emit('input', this.currentVal);
            this.taxIdEffectiveVisible = false;
          } else {
            this.$message.warning('请选择时间!');
          }
        } else if (this.dateRange === 2) {
          //三个月外
          if (this.monthDate) {
            this.currentVal = moment(this.monthDate).format('YYYY-MM') + '-01';
            this.$emit('input', this.currentVal);
            this.taxIdEffectiveVisible = false;
          } else {
            this.$message.warning('请选择时间!');
          }
        } else {
          this.$message.warning('请选择期望税号生效期日范围!');
        }
      } else {
        this.$message.warning('请选择是否已产生德国境内的应税销售额!');
      }
    },
    //三个月外
    monthDateChange(value) {
      this.monthDate = value;
    },
    //三个月内
    inThreeMonthsChange(value) {
      this.inThreeMonths = value;
    },
    //第一笔销售时间
    firstSalesTimeChange(date, dateString) {
      this.firstSalesTime = dateString;
    },

    //是否产生销售额
    salesVolumeChange(e) {
      this.salesVolume = e.target.value;
    },
    //选择日期
    changeValue(val) {
      this.currentVal = val;
      if (this.currentVal === '其他日期') {
        this.taxIdEffectiveVisible = true;
        this.$emit('input', '');
      } else {
        this.$emit('input', this.currentVal);
      }
    },
    //下拉日期列表处理
    dateHandle() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month > 8) {
        this.monthDate = year + 1 + '-' + (month - 8);
      }
      this.timeArray = [moment(date).format('YYYY-MM') + '-01'];
      for (let i = 1; i < 4; i++) {
        this.timeArray.push(
          moment(new Date())
            .add(i, 'months')
            .format('YYYY-MM') + '-01'
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.drawer-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
.taxIdEffective-con {
  h3 {
    font-size: 14px;
    margin-bottom: 16px;
    margin-top: 32px;
  }
  p {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    margin-top: -6px;
    margin-bottom: 16px;
    span {
      color: #e94e49;
    }
  }
}
</style>
