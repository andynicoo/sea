<template>
  <!-- 美图图片编辑器 -->
  <div id="xiuxiuimg">
    <!-- <div id="altContent"></div> -->
  </div>
</template>
<script>
export default {
  name: 'meitu',
  data() {
    return {
      nowimgurl: ''
    }
  },

  mounted() {
    this.nowimgurl = this.$route.query.img
    this.meituxiuxiu()
    // let source = JSON.parse(localStorage.getItem('meituImageInfo'))
    // localStorage.setItem(
    //   'meituImageInfo',
    //   JSON.stringify(
    //     Object.assign(
    //       {
    //         img:
    //           'https://gd1.alicdn.com/imgextra/i1/2667919459/O1CN01CwnYBn2JkH0bVtmwL_!!2667919459-0-lubanu-s.jpg'
    //       },
    //       source
    //     )
    //   )
    // )
  },
  beforeRouteLeave(to) {
    window.location.href = to.path
  },
  methods: {
    //美图秀秀Api
    meituxiuxiu() {
      var that = this
      let xiuxiu = window.xiuxiu
      xiuxiu.params.allowFullscreen = !1
      xiuxiu.params.movie = ''
      xiuxiu.params.wmode = 'transparent'
      xiuxiu.setLaunchVars('customMenu', ['decorate', 'puzzle'])
      xiuxiu.setLaunchVars('nav', 'decorate/basicEdit')
      /*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/

      //修改为您自己的图片上传接口
      xiuxiu.setUploadURL(
        `${process.env.VUE_APP_BASE_API}/acc/basic/config/platform/uploadImage`
      )
      xiuxiu.setUploadType(2)
      xiuxiu.setUploadDataFieldName('file')

      xiuxiu.onBeforeUpload = function(data) {
        var size = data.size
        if (size > 2 * 1024 * 1024) {
          alert('图片不能超过2M')
          return false
        }
        return true
      }
      xiuxiu.onInit = function() {
        xiuxiu.loadPhoto(that.nowimgurl)
      }
      xiuxiu.onDebug = function(data1) {
        console.log('错误响应' + data1)
      }
      xiuxiu.onUploadResponse = function(data) {
        var res = JSON.parse(data)
        if (res.code == 0) {
          that.successAlert('保存成功!')
          let source = JSON.parse(localStorage.getItem('meituImageInfo'))
          //   that.$store.commit('setMeituImageUrl', res.data[0])
          localStorage.setItem(
            'meituImageInfo',
            JSON.stringify(
              Object.assign(
                {
                  img: res.data[0]
                },
                source
              )
            )
          )
          setTimeout(() => {
            window.opener = null
            window.open('', '_self')
            window.close()
          }, 1000)
        }
      }

      xiuxiu.embedSWF('xiuxiuimg', 3, '100%', '100%')
    }
  }
}
</script>
<style>
#xiuxiuimg {
  width: 100vw;
  height: 100vh;
}
</style>
