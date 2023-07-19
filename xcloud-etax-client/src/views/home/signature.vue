<template>
  <div>
    <div class="mask">
      <p class="title">
        法人签名 <span style="color:red;font-size: 12px;">请使用英文格式签名，如张三（San Zhang）</span>
      </p>
      <section class="signature">
        <div class="signatureBox">
          <div class="canvasBox"
               ref="canvasHW">
            <canvas ref="canvasF"
                    @touchstart='touchStart'
                    @touchmove='touchMove'
                    @touchend='touchEnd'
                    @mousedown="mouseDown"
                    @mousemove="mouseMove"
                    @mouseup="mouseUp"></canvas>
            <div class="btnBox">
              <Button @click="overwrite">重写</Button>
              <Button @click="commit">提交签名</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { upLoadSign } from "@/api/taxModule";
import { Throttle } from "@/libs/throttle.js"
import Cookies from "js-cookie";
export default {
  data() {
    return {
      fullscreen: true,
      imgUrl: '',
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false,
      token: '',
      sessionId: '',
      servicesId: '',
      hasSign: false
    }
  },
  created() {
    this.token = this.getQueryVariable('token')
    this.sessionId = this.getQueryVariable('sessionId')
    this.servicesId = this.getQueryVariable('servicesId')
    localStorage.setItem('token', this.token)
    localStorage.setItem('sessionId', this.sessionId)

    Cookies.set('token', res.data.token);
    Cookies.set('sessionId', res.data.sessionId);
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      let canvas = this.$refs.canvasF
      canvas.height = window.screen.height - 280
      canvas.width = window.screen.width
      this.canvasTxt = canvas.getContext('2d')
    },
    touchStart(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clienX,
          y: ev.targetTouches[0].clientY - 50
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    touchMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY - 50
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.lineWidth = 4
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
        this.hasSign = true
      }
    },
    touchEnd(ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX - 30,
          y: ev.targetTouches[0].clientY - 60
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    //pc
    mouseDown(ev) {
      ev = ev || event
      ev.preventDefault()
      // console.log(ev)
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        // console.log(obj)
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.isDown = true
      }
    },
    mouseMove(ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        // 绘制文字之前填充白色
        context.fillRect(0, 0, canvas.width, canvas.height);
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    mouseUp(ev) {
      ev = ev || event
      ev.preventDefault()
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
        this.points.push({ x: -1, y: -1 })
        this.isDown = false
      }
    },
    //重写
    overwrite() {
      this.hasSign = false
      this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height)
      this.points = []
    },
    //提交签名
    commit: Throttle(function () {
      if (this.hasSign === false) {
        this.$Message.error('请签名')
        return
      }
      upLoadSign({
        servicesId: this.servicesId,
        signBase64String: this.$refs.canvasF.toDataURL(),
      }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$Message.success('您已完成签名，请在pc端继续完善资料')
        } else {
          this.$Message.error(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    }, 3000),
    // 获取url参数
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return decodeURIComponent(pair[1]);
        }
      }
      return (false);
    },
  }
}
</script>

<style lang="less" scoped>
.mask {
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 100vh;
  left: 0px;
  background: #ffffff;
  z-index: 1001;
  .title {
    padding: 10px;
    font-size: 15px;
    border-bottom: 1px solid #cccccc;
  }
}
/deep/ .signatureContent {
  .ivu-modal-body {
    padding: 0px !important;
  }
}
.pageContent {
  height: 100%;
  padding: 30px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.signature {
  width: 100%;
}
.signatureBox {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  z-index: 100;
}
.canvasBox {
  display: block;
}
.btnBox {
  padding: 10px;
  text-align: center;
  border-top: 1px solid #cccccc;
}
// .btnBox button:first-of-type {
//   background: transparent;
//   border-radius: 4px;
//   height: 40px;
//   width: 80px;
//   font-size: 14px;
// }
// .btnBox button:last-of-type {
//   background: #71b900;
//   color: #fff;
//   border-radius: 4px;
//   height: 40px;
//   width: 80px;
//   font-size: 14px;
// }
</style>