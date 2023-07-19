<template>
  <div ref="floatDrag" class="float-position" :style="{ left: left + 'px', top: top + 'px', zIndex: zIndex }" @touchmove.prevent @mousemove.prevent @mousedown="mouseDown" @mouseup="mouseUp">
    <el-tooltip class="item" effect="dark" :content="toolTip" placement="top">
      <el-badge :value="value">
        <i style="font-size: 22px" class="el-icon-edit-outline"></i>
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script>
import { getWarningRecords } from '../../api/home/service';
export default {
  name: 'DragBall',

  props: {
    toolTip: {
      type: String,
      default: '工单跟进',
    },
    distanceRight: {
      type: Number,
      default: 38,
    },
    distanceBottom: {
      type: Number,
      default: 100,
    },
    isScrollHidden: {
      type: Boolean,
      default: false,
    },
    isCanDraggable: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 50,
    },
    workId: [String, Number],
  },

  data() {
    return {
      clientWidth: null,
      clientHeight: null,
      left: 0,
      top: 0,
      timer: null,
      currentTop: 0,
      mousedownX: 0,
      mousedownY: 0,

      value: 0,
    };
  },

  async created() {
    try {
      const { data: followData } = await getWarningRecords({ serviceOrderId: this.workId, size: -1 });
      this.value = followData.records.length;
    } catch (error) {
      this.value = 0;
    }

    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
  },

  mounted() {
    this.isCanDraggable &&
      this.$nextTick(() => {
        this.floatDrag = this.$refs.floatDrag;
        // 获取元素位置属性
        this.floatDragDom = this.floatDrag.getBoundingClientRect();
        // 设置初始位置
        this.left = (this.clientWidth || document.documentElement.clientWidth) - this.floatDragDom.width - this.distanceRight;

        this.top = (this.clientHeight || document.documentElement.clientHeight) - this.floatDragDom.height - this.distanceBottom;
        this.initDraggable();
      });

    this.isScrollHidden && window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  methods: {
    /**
     * 设置滚动监听
     * 设置滚动时隐藏悬浮按钮，停止时显示
     */
    handleScroll() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleScrollEnd();
      }, 200);
      this.currentTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (this.left > this.clientWidth / 2) {
        // 判断元素位置再左侧还是右侧
        this.left = this.clientWidth + this.floatDragDom.width - this.distanceRight;
      } else {
        this.left = -this.floatDragDom.width;
      }
    },
    /**
     * 滚动结束
     */
    handleScrollEnd() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        console.log(this.left);
        if (this.left > this.clientWidth / 2) {
          // 判断元素位置再左侧还是右侧
          this.left = this.clientWidth - this.floatDragDom.width - this.distanceRight;
        } else {
          this.left = 0;
        }
        clearTimeout(this.timer);
      }
    },
    /**
     * 窗口resize监听
     */
    handleResize() {
      console.log('监听窗口', 111);
      this.clientWidth = document.documentElement.clientWidth;
      this.clientHeight = document.documentElement.clientHeight;
      this.checkDraggablePosition();
    },
    /**
     * 初始化draggable
     */
    initDraggable() {
      this.floatDrag.addEventListener('touchstart', this.toucheStart);
      this.floatDrag.addEventListener('touchmove', (e) => this.touchMove(e));
      this.floatDrag.addEventListener('touchend', this.touchEnd);
    },
    mouseDown(e) {
      console.log('点击');
      const event = e || window.event;
      this.mousedownX = event.screenX;
      this.mousedownY = event.screenY;
      const that = this;
      let floatDragWidth = this.floatDragDom.width / 2;
      let floatDragHeight = this.floatDragDom.height / 2;
      if (event.preventDefault) {
        event.preventDefault();
      }
      this.canClick = false;
      this.floatDrag.style.transition = 'none';
      document.onmousemove = function (e) {
        var event = e || window.event;
        that.left = event.clientX - floatDragWidth;
        that.top = event.clientY - floatDragHeight;
        if (that.left < 0) that.left = 0;
        if (that.top < 0) that.top = 0;
        if (that.left >= that.clientWidth - floatDragWidth * 2) {
          that.left = that.clientWidth - floatDragWidth * 2;
        }
        if (that.top >= that.clientHeight - floatDragHeight * 2) {
          that.top = that.clientHeight - floatDragHeight * 2;
        }
      };
    },
    mouseUp(e) {
      const event = e || window.event;
      //判断只是单纯的点击，没有拖拽
      if (this.mousedownY == event.screenY && this.mousedownX == event.screenX) {
        this.$emit('handlepaly');
      }
      document.onmousemove = null;
      this.checkDraggablePosition();
      this.floatDrag.style.transition = 'all 0.3s';
    },
    toucheStart() {
      this.canClick = false;
      this.floatDrag.style.transition = 'none';
    },
    touchMove(e) {
      this.canClick = true;
      if (e.targetTouches.length === 1) {
        // 单指拖动
        let touch = event.targetTouches[0];
        this.left = touch.clientX - this.floatDragDom.width / 2;
        this.top = touch.clientY - this.floatDragDom.height / 2;
      }
    },
    touchEnd() {
      if (!this.canClick) return; // 解决点击事件和touch事件冲突的问题
      this.floatDrag.style.transition = 'all 0.3s';
      this.checkDraggablePosition();
    },
    /**
     * 判断元素显示位置
     * 在窗口改变和move end时调用
     */
    checkDraggablePosition() {
      this.left = this.clientWidth - this.floatDragDom.width - this.distanceRight;
      this.top = this.clientHeight - this.floatDragDom.height - this.distanceBottom;
      console.log('left and top', this.left, this.top);
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>
<style lang="less" scoped>
@import './index.less';
</style>
