<template>
  <div class="w-time-picker clearfloat">
    <p v-show="!hideTitle">
      {{ checkedItems }}
    </p>
    <div class="time-picker-wrap ">
      <div
        class="time-picker-cells-list overflow-y clearfloat"
        :ref="timeItem.key"
        v-for="(timeItem, timeIndex) in filterTimeOpts"
        :key="timeIndex"
        :style="itemsWidth"
      >
        <ul>
          <li
            v-for="(item, index) in timeItem.list"
            :key="index"
            :class="{ active: checked[timeItem.key] == item }"
            @click="timeClick(item, timeItem.key)"
            :style="paddingLeft"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div class="confirm" v-show="!hideFooter">
      <span class="confirm-btn cancel">取消</span>
      <span class="confirm-btn ok">确认</span>
    </div>
  </div>
</template>

<script>
const ITEM_HEIGHT = 24 //元素像素高度
const TIME_OPTS = [
  {
    key: 'hour',
    list: Array.from({ length: 24 }, (v, k) => {
      return k < 10 ? '0' + k : k
    })
  },
  {
    key: 'minutes',
    list: Array.from({ length: 60 }, (v, k) => {
      return k < 10 ? '0' + k : k
    })
  },
  {
    key: 'seconds',
    list: Array.from({ length: 60 }, (v, k) => {
      return k < 10 ? '0' + k : k
    })
  }
]
export default {
  data() {
    return {
      checked: {
        hour: '00',
        minutes: '00',
        seconds: '00'
      }
    }
  },
  props: {
    value: {
      type: String,
      default: '00:00:00'
    },
    type: {
      type: String,
      default: 'minutes',
      viladator: function(value) {
        return ['hour', 'minutes', 'seconds'].includes(value)
      }
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    showCurTime:{
      type: Boolean,
      default: false      
    }    
  },
  watch: {
    value: {
      handler(newVal) {
        this.setChecked(newVal)
      }
    }
  },
  computed: {
    filterTimeOpts() {
      let levelIndex = TIME_OPTS.findIndex((item) => item.key == this.type)
      return TIME_OPTS.slice(0, levelIndex + 1)
    },
    checkedItems() {
      return Object.values(this.checked)
        .filter(Boolean)
        .join(':')
    },
    paddingLeft() {
      const opts = {
        hour: 'padding-left:150px',
        minutes: 'padding-left:75px',
        seconds: 'padding-left:48px'
      }
      return opts[this.type]
    },
    itemsWidth() {
      const opts = {
        hour: 'width:100%',
        minutes: 'width:50%',
        seconds: 'width:33.3%'
      }
      return opts[this.type]
    }
  },

  created() {
    this.getCurTime();
    this.$emit('input', this.checkedItems)
  },

  methods: {
    getCurTime() {
      if(this.showCurTime){
        var now = new Date()
        var hour= now.getHours()
        var minutes= now.getMinutes()
        var seconds= now.getSeconds()

        this.checked.hour = hour>9? hour: '0'+ hour
        this.checked.minutes = minutes>9? minutes: '0'+ minutes
        this.timeClick(this.checked.hour, 'hour')
        this.timeClick(this.checked.minutes, 'minutes'); 
      }
    },
    setChecked(time) {
      if (typeof time == 'string') {
        let timeArr = time.split(':')
        Object.keys(this.checked).forEach((key, index) => {
          this.checked[key] = timeArr[index]
          this.timeClick(timeArr[index], key)
        })
      } else {
        console.error('时间格式错误')
      }
    },
    //item 数字  key hour minute seconds
    timeClick(item, key) {
      this.checked[key] = item
      this.handleScroll(key, parseInt(item))
    },

    //控制滚动
    handleScroll(key, index) {
      let targetOffsetY = ITEM_HEIGHT * index
      if (this.$refs[key]) {
        this.$refs[key][0].scrollTo(0, targetOffsetY)
      }
      this.$emit('input', this.checkedItems)
    }
  }
}
</script>

<style lang="scss" scope>
.w-time-picker {
  max-height: 360px;
  width: 324px;
  background: #fff;
  position: relative;
  overflow: hidden;
  p {
    padding: 0;
    margin: 0;
    height: 41px;
    line-height: 40px;
    text-align: center;
    color: $primaryColor;
    font-weight: bolder;
    border-bottom: 1px solid #ededed;
  }
  .time-picker-wrap {
    min-width: 230px;
    height: 259px;
    background: #fff;
    // border-top: 1px solid #ededed;
    .time-picker-cells-list {
      width: 108px;
      height: 100%;
      overflow: hidden;
      float: left;

      &:hover {
        overflow-x: hidden;
        overflow-y: auto;
      }

      ul {
        height: auto;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        position: relative;
        padding-bottom: 235px;
        &::after {
          content: '';
          height: 100%;
          width: 1px;
          background: #ededed;
          position: absolute;
          top: 0;
          right: 0;
        }
        li {
          cursor: pointer;
          line-height: 24px;
          font-size: 14px;
          &.active {
            background: #f5f5f5;
            color: $primaryColor;
          }
          &:hover {
            background: #f5f5f5;
          }
        }
      }
    }
  }
  .confirm {
    height: 36px;
    display: flex;
    justify-content: flex-end;
    line-height: 36px;
    &-btn {
      font-size: 14px;
      padding: 0 12px;
      cursor: pointer;
      &.ok {
        color: $primaryColor;
      }
      &.cancel {
        color: #999;
      }
    }
  }
}
</style>
