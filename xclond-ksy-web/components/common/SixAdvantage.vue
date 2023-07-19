<template>
  <div class="advan">
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys1.png" alt="智能算税" />
        </dt>
        <dd>
          智能算税
          <p>税局认可，安全可靠</p>
        </dd>
      </dl>
    </div>
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys2.png" alt="一键申报" />
        </dt>
        <dd>
          一键申报
          <p>自主上传，实时核对</p>
        </dd>
      </dl>
    </div>
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys3.png" alt="秒下回执" />
        </dt>
        <dd>
          秒下回执
          <p>官方认可，直连税局</p>
        </dd>
      </dl>
    </div>
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys4.png" alt="税号管理" />
        </dt>
        <dd>
          税号管理
          <p>多号管理，实时提醒</p>
        </dd>
      </dl>
    </div>
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys5.png" alt="信件接收" />
        </dt>
        <dd>
          信件接收
          <p>线下收信，高效回传</p>
        </dd>
      </dl>
    </div>
    <div class="box ksy-ib">
      <dl>
        <dt class="ksy-fl">
          <img src="~/assets/images/ys6.png" alt="远程销售额监控" />
        </dt>
        <dd>
          远程销售额监控
          <p>风险监控，安全放心</p>
        </dd>
      </dl>
    </div>
  </div>
</template>

<style lang="less" scoped>
.advan {
  max-width: 1320px;
  margin: 0 auto;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  height: 109px;
  padding-top: 35px;
  padding-bottom: 36px;
  .box {
    width: 220px;
  }
  dl {
    dt {
      margin-right: 15px;
    }
    dd {
      font-size: 14px;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: bold;
      color: @textColor;
      p {
        font-size: 12px;
        color: @textColor6;
        margin-top: 10px;
      }
    }
  }
}
</style>
