<template>
  <div style="max-height: 60vh; overflow-y: auto">
    <div id="u408" class="ax_default _三级标题">
      <div id="u408_div" class=""></div>
      <div id="u408_text" class="text">
        <p>
          <span
            style="font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif; font-weight: 700; color: #000000"
            >一、名词释义</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;1.统计周期：指选择处理日期区间。</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;2.总处理次数：所选统计周期内进行过操作的总次数,</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp;&nbsp; 例如：提交资料—初审通过/驳回 视为1次<br />
            3.处理工单数：统计周期内处理的工单数，同一条服务工单在工段内多次重复操作工单数为1<br />
            4.工单时效：统计周期内 所处理工单花费时间的平均值<br />&nbsp; &nbsp; 计算规则：工单处理时长总量/ 处理次数<br />
            5.一次通过率：统计周期内所处理工单的一次通过的百分比(不含存在驳回记录的工单)<br />&nbsp; &nbsp;
            计算规则：一次通过处理工单数/总处理工单数*100%<br />
            6.二次驳回数：统计周期内所处理工单被驳回二次的工单数(不含超过二次驳回的工单)</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;7.二次驳回率：统计周期内所处理工单驳回二次的百分比<br />&nbsp; &nbsp;
            计算规则：二次驳回工单数/总处理工单数*100%</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;8.三次及以上驳回数：统计周期内所处理工单被三次及以上驳回的工单数</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;9.三次及以上驳回率：统计周期内所处理工单的驳回超过三次(含三次)的百分比<br />&nbsp; &nbsp;
            计算规则：三次及以上驳回工单数/总处理工单数*100%</span
          >
        </p>
        <p>
          <span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"><br /></span>
        </p>
      </div>
    </div>
    <div id="u407" class="ax_default _三级标题">
      <div id="u407_div" class=""></div>
      <div id="u407_text" class="text">
        <p>
          <span
            style="font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif; font-weight: 700; color: #000000"
            >二、对应类型工段统时效计算规则</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            ><br />1 商标注册工段统时效计算规则<br />&nbsp; 商标注册初审时效：初审（通过或驳回）时间—提交资料时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp; 平台审核时效(顾问单)：平台审核(通过或驳回)时间—使用证据完成时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp; 平台审核时效(非顾问单)：平台审核(通过或驳回)时间—初审通过时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"><br /></span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >2 VAT注册业务工段时效统计算规则<br />&nbsp;&nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">VAT注册初审时效：</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >初审（通过或驳回）时间—提交资料时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; 提交注册时效(无授权书)：提交注册时间—初审(通过)时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; 提交注册时效(有授权书)：提交注册时间—上传授权书时间<br />&nbsp;&nbsp;
            注册完成时效：录入税号时间—提交注册时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"><br /></span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >3 转代理业务工段时效统计算规则</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">VAT转代理初审时效：</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >初审（通过或驳回）时间—提交资料时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; 提交转代理时效(无授权书)：提交转代理时间—初审(通过)时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; 提交转代理时效(有授权书)：提交转代理时间—待授权（提交审核/编辑）时间<br />&nbsp;&nbsp;
            转代理完成时效：录入税号时间—提交转代理时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400"><br /></span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >4 申报工段统计算规则<br />&nbsp; 申报初审时效：</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400">待审核申报（</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400"
            >通过或者驳回)时间-资料提交时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp; 申报申报税金时效：</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"
            >待审核税金(通过或驳回)</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">-</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"
            >待缴纳税金(上传缴税凭证)时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"><br /></span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000">5 </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英代/欧代授权代表</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >工段时效统计算规则</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp; </span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"> </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英/欧代</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >初审时效：</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400">待审核资料(</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400"
            >通过或者驳回)时间-资料提交时间<br /></span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400">&nbsp; &nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英/欧代</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400">授权</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >时效：授权审核通过或驳回时间-授权书上传时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp;&nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英/欧代</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >注册完成时效(有授权书)：注册完成时间-授权书上传时间<br />&nbsp; &nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英/欧代</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >注册完成时效(无授权书)：注册完成时间-初审通时间<br /></span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #d9001b"
            >&nbsp;&nbsp; </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"> </span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">英/欧代备案完成时效</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >：备案完成(通过或驳回)时间-备案初审通过时间
          </span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"><br /></span>
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400">6 EPR注册</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >工段时效统计算规则</span
          >
        </p>
        <p>
          <span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"
            >&nbsp;&nbsp;&nbsp; EPR</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >初审时效：</span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400">待审核申报（</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400"
            >通过或者驳回)时间-资料提交时间<br /></span
          ><span style="font-family: 'PingFang SC ', 'PingFang SC', sans-serif; font-weight: 400"
            >&nbsp; &nbsp; EPR授权</span
          ><span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >时效：授权审核通过或驳回时间-授权书上传时间</span
          >
        </p>
        <p>
          <span style="font-family: 'Arial Normal', 'Arial', sans-serif; font-weight: 400; color: #000000"
            >&nbsp;&nbsp;&nbsp; 注册完成时效(有授权书)：注册完成时间-授权书上传时间<br />&nbsp; &nbsp;
            注册完成时效(无授权书)：注册完成时间-初审通时间</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
