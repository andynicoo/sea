// 商品编辑专用mixin
import { throttle } from '@/util'
import { mapState } from 'vuex'
const GetAnchor = (type) => {
  let primaryOption = {
    '#BaseInfo': {
      name: `商品信息`,
      warning: false
    },
    '#Pictrue': {
      name: '商品图片',
      warning: false
    },
    '#Spec': {
      name: '商品规格',
      warning: false
    },
    '#Attach': {
      name: '附加信息',
      warning: false
    }
  }
  let storeOption = {
    '#Cate': {
      name: '店铺和类目',
      warning: false
    }
  }
  return type == 0 ? primaryOption : Object.assign(storeOption, primaryOption)
}
export default {
  data() {
    return {
      editItems: GetAnchor(this.$route.query.edit)
    }
  },
  computed: {
    ...mapState({
      editProductInfo: (state) => state.product.editProductInfo,
      logistics: (state) => state.product.logistics,
      storeList: (state) => state.auth.storeList,
      validateOptions: (state) => state.product.validate,
      targetLangList: (state) => state.product.targetLangList
    })
  },
  watch: {
    dataSource: {
      handler(newData) {
        if (newData) {
          this.throttle(this)
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    throttle: throttle((vm) => {
      vm.$store.commit('setEditProductInfo', vm.dataSource)
    }),
    //锚点定位
    goAnchor(selector) {
      this.$el.querySelector(selector).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'end'
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('clear')
    this.productDetail = {}
    this.$store.commit('setEditProductInfo', {})
    this.$store.commit('setCategory', null)
    this.$store.commit('setLogistics', {})
    next()
  }
}
