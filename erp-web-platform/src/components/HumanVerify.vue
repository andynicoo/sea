// 人机验证
<template>
  <div id="wrap" class="middleCenter" v-if="show"></div>
</template>

<script>
export default {
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    }
  },

  computed: {
    show: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('close', v)
      }
    },
    language() {
      return this.$store.getters.language
    }
  },

  mounted() {
    const AWSC = window.AWSC
    AWSC.use('nvc', function(state, module) {
      // 初始化 调用module.init进行初始化
      window.nvc = module.init({
        appkey: 'FFFF0N00000000009BFF',
        scene: 'nvc_register',
        isH5: false,
        popUp: false,
        renderTo: '#wrap',
        nvcCallback: function(data) {
          // data为getNVCVal()的值，此函数为二次验证滑动或者刮刮卡通过后的回调函数
          // data跟业务请求一起上传，由后端请求AnalyzeNvc接口，接口会返回100或者900
        },
        trans: { key1: 'code0', nvcCode: 400 },
        language: 'cn'
      })
    })
  },

  methods: {
    langTransfor() {
      let langTag = 'cn'
      if (this.language == 'zh_cn') {
        langTag = 'cn'
      } else if (this.language == 'zh_tw') {
        langTag = 'tw'
      } else if (this.language == 'en_bg') {
        langTag = 'en'
      } else if (this.language == 'ma_ma') {
        langTag = 'ma'
      } else if (this.language == 'th_th') {
        langTag = 'th_TH'
      } else if (this.language == 'in_id') {
        langTag = 'in_ID'
      } else if (this.language == 'pt_pt') {
        langTag = 'pt'
      } else if (this.language == 'vi_vn') {
        langTag = 'vi_VN'
      }
      return langTag
    },
    getAliValid() {
      console.log('开始无痕验证')
      this.initNontraceValidation()
    },
    // 初始化无痕验证
    initNontraceValidation() {
      let THIS = this
      window.nvc.getNVCValAsync(function(nvcVal) {
        let validInfo = {
          data: decodeURIComponent(nvcVal),
          type: 'nvc'
        }
        window.nvc.reset()
        THIS.$emit('onSuccess', validInfo)
      })
    },

    getASlidliValid() {
      // 实例化ic对象
      let THIS = this
      const AWSC = window.AWSC
      var myLang = {
        ma: {
          //加载状态提示。
          LOADING: 'Memuatkan...',
          //等待滑动状态提示。
          SLIDE: 'Leret ke kanan untuk mengesahkan',
          //验证通过状态提示。
          SUCCESS: 'Disahkan',
          //验证失败触发拦截状态提示。
          ERROR: 'Maaf, terdapat ralat rangkaian...',
          //验证失败触发拦截状态提示。
          FAIL: 'Pengesahan gagal, sila cuba lagi'
        },
        pt: {
          //加载状态提示。
          LOADING: 'Carregando...',
          //等待滑动状态提示。
          SLIDE: 'Deslize para a direita para verificar',
          //验证通过状态提示。
          SUCCESS: 'Verificado',
          //验证失败触发拦截状态提示。
          ERROR: 'Desculpe, ocorreu um erro de rede...',
          //验证失败触发拦截状态提示。
          FAIL: 'falha na verificação'
        }
      }

      AWSC.use('nc', function(state, module) {
        // 初始化
        window.ic = module.init({
          language: THIS.langTransfor(),
          upLang: myLang,
          // 应用类型标识。它和使用场景标识（scene字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
          appkey: 'FFFF0N00000000009BFF',
          // 使用场景标识。它和应用类型标识（appkey字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
          scene: 'nc_register',
          // 声明智能验证需要渲染的目标元素ID。
          renderTo: 'wrap',
          width: '240',
          default_txt: THIS.$t('login.afterVerification'),
          // 验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
          success: function(data) {
            window.ic.reset()
            let validInfo = {
              sessionId: data.sessionId,
              sig: data.sig,
              token: data.token,
              scene: 'nc_register',
              type: 'nc'
            }
            THIS.$emit('onSuccess', validInfo)
          },
          // 验证失败时触发该回调参数
          fail: function(failCode) {
            THIS.errorAlert(THIS.$t('login.validationFailed'))
            window.ic.reset()
            console.log(failCode)
          },
          // 验证码加载异常时触发该回调参数
          error: function(errorCode) {
            THIS.errorAlert(THIS.$t('login.tryAgainLater'))
            window.ic.reset()
            console.log(errorCode)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
#wrap {
  width: 100%;
  height: 100%;
  > div {
    height: 100%;
    > div.nc_wrapper {
      width: 100%;
      height: 100%;
      .nc_scale {
        height: 100%;
        background: #bfbfbf;
        .btn_slide {
          height: 100%;
          width: 16%;
          font-size: 16px;
          line-height: 46px;
          color: #000;
        }
        .slidetounlock {
          line-height: 46px;
        }
        .nc-lang-cnt {
          height: 50px;
          line-height: 46px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
