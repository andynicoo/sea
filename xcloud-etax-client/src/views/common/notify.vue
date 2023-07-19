<template>
  <div class="login-all">
    <div class="top-banner"></div>
    <div class="content">
      <div class="box">
        <Tabs value="name1">
          <TabPane label="注册申报流程"
                   name="name1">
            <ul>
              <p>注册申报流程</p>
              <li>【第一步】注册/登录跨税云平台账号；</li>
              <li>进入工作台，点击【购买VAT服务】，购买您需要的注册申报服务（可以微信、支付宝、银联三种方式进行支付）；
                <img src="@/assets/images/newsPeople/zhuce_1.png" />
                <img src="@/assets/images/newsPeople/zhuce_2.png" />
                <img src="@/assets/images/newsPeople/zhuce_3.png" />
              </li>
              <li>【第三步】成功购买注册申报服务后，在工作台【税务管理】即可开始注册税号啦；<br>
                备注：注册税号需要先提交注册税号资料，不同国家要求不同，您可以先准备好营业执照、法人身份证相关资料；
                <img src="@/assets/images/newsPeople/zhuce_4.png" />
                <img src="@/assets/images/newsPeople/zhuce_5.png" />
              </li>
              <li>【第四步】提交完成资料后，我们会对资料进行审核，审核通过后直接提交给税局进行注册（注册时效根据不同国家而定）；
                <img src="@/assets/images/newsPeople/zhuce_6.png" />
                <img src="@/assets/images/newsPeople/zhuce_7.png" />
              </li>
              <li>【第五步】税号注册完成后，系统会根据您的税号情况，来提醒您进行申报；
                <img src="@/assets/images/newsPeople/zhuce_8.png" />
              </li>
              <li>【第六步】系统会根据您的申报情况，每个月/季度1号提醒您开始报税；
                <img src="@/assets/images/newsPeople/zhuce_9.png" />
              </li>
              <li>【第七步】从亚马逊/其它平台下载您的销售数据后，计算税金后即可提交申报啦（备注：申报的数据一旦提交就不可更改了哦，系统会自动提交到税局进行申报）；
                <img src="@/assets/images/newsPeople/zhuce_10.png" />
              </li>
              <li>【第八步】提交申报后，根据系统的税金确认单进行缴纳税金，把缴税凭证上传到平台后申报就结束啦；
                <img src="@/assets/images/newsPeople/zhuce_11.png" />
                <img src="@/assets/images/newsPeople/zhuce_12.png" />
              </li>
            </ul>
          </TabPane>
          <TabPane label="税务申报指引"
                   name="name2">
            <ul>
              <p>税务申报流程</p>
              <li>【第一步】注册/登录跨税云平台账号；</li>
              <li>【第二步】进入工作台，点击【购买VAT服务】，购买您需要的转代理申报服务（可以微信、支付宝、银联三种方式进行支付）；
                <img src="@/assets/images/newsPeople/shenbao_1.png" />
                <img src="@/assets/images/newsPeople/shenbao_2.png" />
                <img src="@/assets/images/newsPeople/shenbao_3.png" />
              </li>
              <li>【第三步】成功购买转代理申报服务后，在工作台【税务管理】即可开始转申报啦；<br>
                备注：转代理需要先提交转代理资料，不同国家要求不同，您可以先准备好历史申报回执、税号文件相关资料；
                <img src="@/assets/images/newsPeople/shenbao_4.png" />
                <img src="@/assets/images/newsPeople/shenbao_5.png" />
              </li>
              <li>【第四步】转代理成功后，即可开始申报（如还未到下一次申报的时间，则等待申报即可）；
                <img src="@/assets/images/newsPeople/shenbao_6.png" />
              </li>
              <li>【第五步】系统会根据您的申报情况，每个月/季度1号提醒您开始报税；
                <img src="@/assets/images/newsPeople/shenbao_7.png" />
              </li>
              <li>【第六步】从亚马逊/其它平台下载您的销售数据后，计算税金后即可提交申报啦（备注：申报的数据一旦提交就不可更改了哦，系统会自动提交到税局进行申报）；
                <img src="@/assets/images/newsPeople/shenbao_8.png" />
              </li>
              <li>【第七步】提交申报后，根据系统的税金确认单进行缴纳税金，把缴税凭证上传到平台后申报就结束啦；
                <img src="@/assets/images/newsPeople/shenbao_9.png" />
                <img src="@/assets/images/newsPeople/shenbao_10.png" />
              </li>
            </ul>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <OtherFooter></OtherFooter>
  </div>
</template>
<script>
import "@/styles/common.less";
import OtherFooter from '@/views/common/otherFooter'
export default {
  components: {
    OtherFooter
  },
  props: {},
  data() {
    return {};
  },
  metaInfo: {
    title: '跨税云-VAT注册、VAT注册申报新手指引', // set a title
    meta: [{                 // set meta
      name: 'keyWords',
      content: 'VTA注册流程，VAT申报流程'
    },
    {
      name: 'description',
      content: '跨税云一站式跨境财税专业服务平台，主专注欧洲VAT注册，欧洲VAT申报服务，英国VAT申报,法国VAT税号，德国VAT注册，意大利VAT，西班牙VAT注册绿色通道，时效快，VAT申报流程跟踪，为跨境卖家提供英国VAT申报,亚马逊VAT注册，等跨境税务咨询服务!'
    },
    {
      property: 'og:title',
      content: '跨税云-VAT注册、VAT注册申报新手指引'
    },
    {
      property: 'og:description',
      content: '跨税云一站式跨境财税专业服务平台，主专注欧洲VAT注册，欧洲VAT申报服务，英国VAT申报,法国VAT税号，德国VAT注册，意大利VAT，西班牙VAT注册绿色通道，时效快，VAT申报流程跟踪，为跨境卖家提供英国VAT申报,亚马逊VAT注册，等跨境税务咨询服务!'
    },
    ],
    link: [{                 // set link
      rel: 'asstes',
      href: 'https://www.itaxs.com/notify'
    }]
  },
  watch: {},
  methods: {},
  created() { }
};
</script>
<style lang='less' scoped>
.login-all {
  background-color: #f5f6f7;
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: 0;
  left: 0;
  .loginHead {
    background-color: #ffffff;
    height: 71px;
    .loginImg {
      width: 80%;
      margin: 0 auto;
      img {
        float: left;
        padding-top: 10px;
      }
    }
  }
}
.top-banner {
  margin-top: 60px;
  width: 100%;
  height: 350px;
  background: url("../../assets/images/aboutHome/newGays.png") center center
    no-repeat;
}
.content {
  height: 100%;
  width: 100%;
  background-color: #f1f1f3;
  .box {
    margin: 0 19%;
    background-color: #ffffff;
    padding: 20px 30px;
  }
  .box ul {
    padding: 20px 30px;
    font-size: 14px;
    p {
      font-weight: bold;
      padding-bottom: 20px;
    }
    li {
      width: 100%;
      padding: 10px;
      list-style: none;
    }
    img {
      width: 100%;
    }
  }
}
</style>
