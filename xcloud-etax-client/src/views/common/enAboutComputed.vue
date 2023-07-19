<template>
  <div class="layout ">
    <div class="container">
      <div class="bgContent banner-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="@/assets/images/computedTax/bannerEn.png"
                 alt="">
          </div>
        </div>
      </div>
      <div class="title">
        <div class="content">
          <a href="https://www.itaxs.com/en">Home</a>
          <a href="">Calculate Taxes</a>
        </div>
      </div>
      <div>
        <ComputedPage></ComputedPage>
      </div>
      <OtherFooter></OtherFooter>
    </div>
  </div>
</template>

<script>
import ComputedPage from '@/views/home/computeTax/enIndex.vue'
import OtherFooter from '@/views/common/otherFooterEn'
export default {
  data() {
    return {
      link: '',
      bannerList: []
    }
  },
  components: {
    ComputedPage,
    OtherFooter
  },
  methods: {
    toLogin() {
      this.$router.push({ path: `/login` })
    },
  },
  mounted() {

  },
  metaInfo: {
    title: '一键算税_德国VAT转申报_英国VAT注册申报_意大利VAT申请', // set a title
    meta: [{                 // set meta
      name: 'keyWords',
      content: '一键算税，英国vat注册，英国vat申报，英国vat转申报，德国vat注册，德国vat申报，德国vat转申报，意大利vat注册，意大利vat申报，意大利vat转申报'
    },
    {
      name: 'description',
      content: '跨税云专注跨境电商VAT税务，智能一键算税平台；我们提供英国vat注册，英国vat申报，英国vat转申报，德国vat注册，德国vat申报，德国vat转申报，意大利vat注册，意大利vat申报，意大利vat转申报等欧洲vat注册申报服务。'
    },
    {
      property: 'og:title',
      content: '一键算税_德国VAT转申报_英国VAT注册申报_意大利VAT申请'
    },
    {
      property: 'og:description',
      content: '跨税云专注跨境电商VAT税务，智能一键算税平台；我们提供英国vat注册，英国vat申报，英国vat转申报，德国vat注册，德国vat申报，德国vat转申报，意大利vat注册，意大利vat申报，意大利vat转申报等欧洲vat注册申报服务。'
    },
    ],
    link: [{                 // set link
      rel: 'asstes',
      href: 'https://itaxs.com/aboutComputed'
    }]
  },
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 60px;
  left: 0px;
  width: 100%;
  .bgContent {
    height: 278px;
    width: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    @media (max-width: 1440px) {
      .small {
        display: block;
      }
      .big {
        display: none;
      }
    }
    @media (min-width: 1441px) {
      .small {
        display: none;
      }
      .big {
        display: block;
      }
    }
  }
  .title {
    background: #f6f8fb;
    .content {
      max-width: 1200px;
      margin: auto;
      height: 40px;
      line-height: 40px;
      a {
        color: #666666;
        margin: 0px 10px;
        font-weight: bold;
        &:hover {
          color: #019dfa;
        }
      }
    }
  }
  .footer {
    height: 54px;
    background: #010e1d;
    color: #cccccc;
  }
}
</style>
