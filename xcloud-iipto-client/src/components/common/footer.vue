<template>
  <div>
    <div class="footer-box">
      <div class="content flex-between">
        <div class="left">
          <img src="@/assets/images/common/bottomLogo.svg"
               alt="">
          <ul class="contract">
            <li>
              <img src="@/assets/images/common/tel.png"
                   alt="">
              <span>0755-82399299</span>
            </li>
            <li>
              <img src="@/assets/images/common/email.png"
                   alt="">
              <a href="mailto:support@iipto.com.com"
                 class="mailto"
                 data-extlink=""
                 onmousedown="dataLayer.push({'event': 'eventTracker', 'eventCat': 'Email Clicks', 'eventAct':'Click', 'eventLbl': 'support@iipto.com.com', 'eventVal': 0, 'nonInteraction': 0});">
                <font style="vertical-align: inherit;">
                  <font style="vertical-align: inherit;">support@iipto.com</font>
                </font>
              </a>
            </li>
            <li>
              <img src="@/assets/images/common/address.png"
                   alt="">
              <span>深圳市龙华区1970科技小镇4栋302</span>
            </li>
          </ul>
        </div>
        <div class="line"></div>
        <div class="right">
          <p class="title">合作伙伴</p>
          <div class="links flex-between">
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
            <ul class="footer-ul"></ul>
          </div>
        </div>
        <div class="line"></div>
        <div class="qr-box flex-between">
          <div class="qr-left">
            <p>官方服务号</p>
            <img src="@/assets/images/common/officeAccount.svg"
                 alt="">
          </div>
          <!-- <div>
        <p>官方小程序</p>
        <img src="/images/aboutHome/miniProgram.png" alt="">
      </div> -->
        </div>
      </div>
      <p class="bottomBox">
        <a href="https://ori.iipto.com/agreement.html" target="_blank">《跨标云用户协议》</a>
        <a href="https://ori.iipto.com/privacy.html" target="_blank">《跨标云隐私策略》</a> ICP证:
        <a href="http://beian.miit.gov.cn/" target="_blank">粤ICP备20016192号</a> Copyright @ 2020 跨标云
      </p>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    const linkList = [
      {
        link: 'https://www.uspto.gov/',
        name: '美国商标局',
        type: '0'
      },
      {
        link: 'https://www.trademarkia.com/',
        name: 'TradeMarkia',
        type: '1'
      },
      {
        link: 'https://euipo.europa.eu/',
        name: '欧洲商标局',
        type: '2'
      },
      {
        link: 'https://www.gov.uk/government/organisations/intellectual-property-office',
        name: '英国商标局',
        type: '3'
      },
      {
        link: 'https://www.jpo.go.jp/',
        name: '日本商标局',
        type: '4'
      },
      {
        link: 'http://patft.uspto.gov/',
        name: '美国专利局',
        type: '5'
      },
      {
        name: '谷歌专利搜索',
        link: 'https://www.google.com/?tbm=pts&gws_rd=ssl',
        type: '6'
      },
      {
        name: '欧洲专利局',
        link: 'https://www.epo.org/searching-for-patents.html',
        type: '0'
      },
    ]
    let linkBox = document.getElementsByClassName('footer-ul')
    linkList.map((item, index) => {
      if (item.type === 'fllow') {
        linkBox[item.type].innerHTML += ('<li><a href="' + item.link + '" target="_blank">' + item.name + '</a></li>')
      } else {
        linkBox[item.type].innerHTML += ('<li><a rel="nofllow" href="' + item.link + '" target="_blank">' + item.name + '</a></li>')
      }
    })
  },
  methods: {

  },
}
</script>
<style>
.footer-box {
  width: 100%;
  background-color: #2b303b;
  color: rgba(255, 255, 255, 0.65);
  padding: 15px 0 0px 0;
  font-size: 14px;
}

.footer-box .content {
  height: 185px;
  max-width: 1200px;
  margin: auto;
  padding: 18px 0 20px 0;
  border-bottom: 1px solid rgba(153, 153, 153, 0.4);
}

.footer-box .content .line {
  width: 1px;
  height: 173px;
  background: rgba(153, 153, 153, 1);
  opacity: 0.4;
}

.footer-box .content .right {
  text-align: left;
}

.footer-box .content .right .flex-between {
  align-items: flex-start;
}

.footer-box .content .right .links li {
  line-height: 24px;
}

.footer-box .content .right .links a {
  color: #999;
}

.footer-box .content .title {
  color: #fff;
  font-size: 14px;
  margin-bottom: 20px;
}

.footer-box .content .links {
  margin-top: 18px;
  padding-bottom: 24px;
}

.footer-box .content .links ul {
  margin-right: 18px;
}

.footer-box .content .left img {
  width: 152px;
  height: 43px;
}

.footer-box .content .left .contract {
  color: #fff;
  text-align: left;
  margin-top: 32px;
}

.footer-box .content .left .contract li {
  margin-top: 16px;
}

.footer-box .content .left .contract li a {
  color: #fff;
}

.footer-box .content .left .contract img {
  width: 20px;
  height: 20px;
}

.footer-box .content .qr-box {
  color: #fff;
  align-items: initial;
}

.footer-box .content .qr-box .qr-left {
  margin-right: 26px;
}

.footer-box .content .qr-box img {
  margin-top: 26px;
  width: 120px;
}

.footer-box .bottomBox {
  text-align: center;
  padding: 20px 0px;
}

.footer-box .bottomBox a {
  color: rgba(255, 255, 255, 0.65);
}
</style>
