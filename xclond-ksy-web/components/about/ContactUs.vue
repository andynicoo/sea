<template>
  <div class="lxwm">
    <h2>联系我们</h2>
    <div class="content ksy-w1320">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="8">
          <div class="left heightkb">
            <h1>深圳总部</h1>
            <p>电话：400-812-8878</p>
          </div>
          <div class="item">
            <h3>武汉办事处</h3>
            <p>电话：15171462535 周先生</p>
            <p>地址：武汉市东湖开发区当代国际花园15栋710-1</p>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <h3>郑州办事处</h3>
            <p>电话：15093053903 张先生</p>
            <p>地址：郑州市二七区陇海西路嵩山南路东方大厦二七双创中心</p>
          </div>
          <div class="item">
            <h3>广州办事处</h3>
            <p>电话：18689486584 尹先生</p>
            <p>地址：广州白云区龙禧中心云峰大厦D1栋208</p>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="item">
            <h3>太原办事处</h3>
            <p>电话：18035502756 段先生</p>
            <p>地址：山西省太原市迎泽区中泰广场12层</p>
          </div>
          <div class="item">
            <h3>长沙办事处</h3>
            <p>电话：19118365576 曹先生</p>
            <p>地址：湖南省长沙市岳麓大道57号长沙奥克斯环球广场A座1018号</p>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
export default {
  name: "ContactUs",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
    };
  },
};
</script>

<style lang="less" scoped>
.lxwm {
  height: 770px;
  padding: 80px 0px 0px 0px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
  }
  .content {
    margin: 0 auto;
    margin-top: 40px;
    .heightks {
      height: 520px;
    }
    .heightkb {
      height: 342px;
      margin-bottom: 14px;
    }
    .item {
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
      border-radius: 4px 4px 4px 4px;
      padding: 28px 32px 32px;
      margin-bottom: 16px;
      h3 {
        font-size: 20px;
        color: @textColor;
        margin-bottom: 16px;
      }
      p {
        height: 22px;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 6px;
        color: @textColor6;
      }
    }
    .left {
      background-image: url(@/assets/images/lxwmbg2.png);
      background-repeat: no-repeat;
      width: 429px;
      padding: 33px 40px;
      margin-right: 18px;
      h1 {
        font-size: 40px;
        color: @textColor;
        margin-bottom: 28px;
      }
      p {
        height: 28px;
        font-size: 20px;
        line-height: 28px;
        color: @textColor6;
        margin-top: 14px;
        margin-bottom: 0px;
      }
    }
  }
}
</style>
