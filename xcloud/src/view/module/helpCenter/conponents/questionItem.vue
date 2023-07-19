<template>
  <div id="commonProblemContent">
    <div class="tab-box" v-if="index == 1">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">VAT注册</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">个人店铺能注册英德意法西的VAT吗？需要什么资料？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">除了营业执照不需要提供之外，其他的资料都是一样的呢；</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">没有店铺链接可以注册五国税号吗？用独立站可以申请vat吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国，意大利，西班牙，沙特，阿联酋，波兰可以，其他国家没有店铺链接不可以注册税号哦，您可以提供独立站的链接注册税号，需要提供独立站的店铺信息以及商业计划、销售数据等资料，这样才能比较快的下税号呢。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">后台的名称跟地址是中文名，是否可以提交注册VAT？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">中文的不符合要求，所有提供至税局的资料都必须是英文格式哦。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">生效日期填写的关键影响因素是什么？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果是新账户的话，各国VAT税号生效日期建议填写您预计发FBA的时间，税号生效日是您在该国第一次申报开始的时间。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">我没有产品怎么创建FBA仓储？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  先发布一款产品，然后配送方式选择亚马逊配送，接下来按照步骤操作即可（没有listing，要先创建）。创建好后建议不要保存，直接获取截图后咨询在线客服是否符合要求，确认没问题后移除。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q6:</div>
                <div class="content">英国注册时效，遇到问卷怎么办？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国VAT注册时效：一般需要56个工作日（提交注册资料后请关注注册提交的邮箱，如收到税局邮件补充调查问卷，需在规定时间内准备好相关资料回复税局，不清楚如何填写可联系在线客服了解）。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q7:</div>
                <div class="content">营业执照跟后台地址不一致，需要把后台变更成营业执照的地址才可以注册VAT吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">为了保证后续绑定信息一致，需要把地址更改成营业执照一样才能注册VAT税号的哦。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q8:</div>
                <div class="content">提交的资料怎么被驳回，我该怎么办？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  请登录跨税云平台查看驳回原因，根据提示原因进行修正，修正好后直接提交，如有其他疑问，可咨询平台在线客服；
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 2">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">VAT转代理</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">您好，英国转代理如果是地址没有修改成功的话有什么影响？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国转代理如果是地址没有修改成功的话是有以下两种影响：(1)现代理会收不到c79文件,标准税率申报，需要用这份文件来做抵扣；(2)清关时，要注意税号地址直接使用VIES网站上面查询到的地址进行清关，在地址为修改成功之前，不要用新代理的地址进行清关。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">上月/季度没有申报怎么办，是否能转代理过来？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  与前代理结束代理关系后，可以在直接将转代理资料提交我司进行转代理，转代理成功后需要购买补申报服务进行补申报操作。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">代理转那么久都没有转成功，我们无法申报，会不会有罚金啊？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果您是因为转代理导致延迟申报，我们可以向税局解释为何延迟申报，解释后就不会产生滞纳金了。如果不是因为转代理的原因延迟缴税的话是会产生滞纳金的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">我想把代理转到你们这里，会不会店铺被封啊？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">转代理是属于正常的行为，不会因为转代理导致账号被关闭的呢。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">转代理你们建议什么时间转比较好？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  转申报的最佳时间是刚刚在前代理那里申报完最后一次。不过其他时间转代理也是可以的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q6:</div>
                <div class="content">什么是gateway帐户和密码？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  gateway帐户和密码是登录英国税局（HMRC）网站的账号，不过需要绑定了您自己税号的gateway才有效哦。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q7:</div>
                <div class="content">后台地址与证书地址不致要填写哪个？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  您在系统填写转代理资料时，公司英文地址还是要填写您后台的公司英文地址。这是为了避免线上无法修改税号地址时，我们在线下给您填写改地址文件的时候需要用到您后台的英文地址。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 3">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">VAT申报</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">VAT申报的资料有哪些？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  从您销售平台下载对应的销售记录，并提供抵税凭证（清关文件C88或C79/欧盟当地采购发票即成本发票）如有。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">注册VAT却不履行税务缴纳会有什么后果</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  不履行纳税义务这相当于是偷税漏税，被税局查到首先产生罚金／滞纳金，情节严重会被关店，冻结店铺资金，FBA仓库，有些甚至还会影响法人出国。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">零申报是什么？零申报有什么风险？少申报和零申报被查到的风险是一样大吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  当您注册了VAT税号，在申报当期未产生销售的情况下是符合做零申报条件的，零申报不需要缴纳销售税。但长期零申报可能会引起税局的关注，或被税局直接注销（此类注销不会有任何通知）。少申报其实属于逃漏税，任何的逃漏税都会有风险哦。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">目的国报税怎么算？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  目的国计税方式（以德国为例：其他欧盟国家发到德国（含德国发德国）和德国发到其他欧盟国家（有税号国家排除）。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">如何合理避税做低申报？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  自己的税号清关，并在进口货物时向您的进口商索取欧盟间合规的发票，就可以抵扣您的销售VAT，降低税负。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q6:</div>
                <div class="content">延迟报税会对账号有什么影响的吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">申报建议在规定的时间内完成的哦，每个国家延迟申报都会有相应的罚金产生。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q7:</div>
                <div class="content">交税时备注写错会有什么后果？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  缴税备注将是税局认为支持的唯一凭证，错误备注、漏备注会导致税局查账时是不知道款税归属哪个税号，从而被认为您的税金未支付，而产生罚金及滞纳金哦
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q8:</div>
                <div class="content">
                  应缴税金这些不是在账户自动扣的？卖家是转账，税局是自动扣除代理的银行账户税金么？
                </div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英德意1是客户自己支付税金到税局，意2法西需要通过当地的会计师事务所进行缴纳，会计师事务所收到客户支付的税金再支付到当地税局。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 4">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">各国申报时间</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: none">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">您好，英国转代理如果是地址没有修改成功的话有什么影响？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国转代理如果是地址没有修改成功的话是有以下两种影响：(1)现代理会收不到c79文件,标准税率申报，需要用这份文件来做抵扣；(2)清关时，要注意税号地址直接使用VIES网站上面查询到的地址进行清关，在地址为修改成功之前，不要用新代理的地址进行清关。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">上月/季度没有申报怎么办，是否能转代理过来？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  与前代理结束代理关系后，可以在直接将转代理资料提交我司进行转代理，转代理成功后需要购买补申报服务进行补申报操作。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">代理转那么久都没有转成功，我们无法申报，会不会有罚金啊？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果您是因为转代理导致延迟申报，我们可以向税局解释为何延迟申报，解释后就不会产生滞纳金了。如果不是因为转代理的原因延迟缴税的话是会产生滞纳金的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">我想把代理转到你们这里，会不会店铺被封啊？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">转代理是属于正常的行为，不会因为转代理导致账号被关闭的呢。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">转代理你们建议什么时间转比较好？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  转申报的最佳时间是刚刚在前代理那里申报完最后一次。不过其他时间转代理也是可以的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q6:</div>
                <div class="content">什么是gateway帐户和密码？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  gateway帐户和密码是登录英国税局（HMRC）网站的账号，不过需要绑定了您自己税号的gateway才有效哦。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q7:</div>
                <div class="content">后台地址与证书地址不致要填写哪个？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  您在系统填写转代理资料时，公司英文地址还是要填写您后台的公司英文地址。这是为了避免线上无法修改税号地址时，我们在线下给您填写改地址文件的时候需要用到您后台的英文地址。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: block">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 5">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">欧代</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">什么是CE标志？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  “CE”标志是一种安全认证标志，被视为制造商打开并进入欧洲市场的护照。在欧盟市场“CE”标志属强制性认证标志，不论是欧盟内部企业生产的产品，还是其他国家生产的产品，要想在欧盟市场上自由流通，就必须加贴“CE”标志(印制在商品本身，商品包装或随附的其他文件上)，以表明产品符合欧盟《技术协调与标准化新方法》指令的基本要求。CE认证涉及欧洲市场80%的工业和消费品和70%的欧盟进口产品，如果产品没有经过CE认证，而贸然出口到欧盟，将被认为是违法行为。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">怎样判断是否需要“欧代”？同时满足以下两个条件的卖家，需要“欧代”：</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  <div>①、产品在欧洲经济区EEA(包括EU与EFTA)境内销售。</div>
                  <div>
                    ②、所销售的商品属于CE认证范围内，需CE认证的产品
                    链接查询：https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">没有欧代的卖家会有什么影响？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  在亚马逊欧洲销售CE标商品，若无欧代将被视为违法。虽说法规是2021年 7 月
                  16日生效，但在这之前，亚马逊会不定期进行抽查，如抽查到不符合规范的，也会对您的产品进行处罚等。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">多个账号共用一个欧代，会不会关联？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  不会关联，欧盟外几百万个卖家店铺，不可能在欧盟有几百万个专业做欧代的。且亚马逊有告知过不会关联。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">欧代注册好后，客户还需要做什么操作吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  <div>①欧代信息要印刷在产品、外包装和说明书上（印刷方式客户可自己调整）。</div>
                  <div>②您需要 case 回复亚马逊，您已有欧代，亚马逊会给您发邮件通知您填写代理信息到后台；</div>
                  <div>
                    ③您的产品做完CE认证及相关认证后，需要向我们提供最新技术文档， 如果在认证结束取得证书的 30
                    天内，或“自我声明”产品在使用 CE 标志之前，仍然没有 提供给我们符合要求的 CE
                    技术文档（电子档），欧代协议自动失效，卖家承担 由此而引起的所有后果。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 6">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">英代</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">自发货需要办理英代/欧代吗？不用做UKCA/CE认证的产品需要办理英代/欧代吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  依据英国/欧盟法规，出口到英国/欧盟的所有产品都需要英代/欧代，只不过现在对CE标的产品比较严格而已。是否需办理欧代英代跟客户的发货方式无关。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">办理欧代/英代，是否一定要提供CE/UKAC认证等相关检测证书及报告？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">客户申请欧代/英代的时候，客户需提供CE认证等相关产品合规检测报告。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">
                  客户的公司信息变更了，但没有在亚马逊后台更新，仅更新营业执照，请问店铺后台主体和亚马逊后台主体不一致的情况，申请主体以哪个为准？
                </div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果亚马逊查的话可能会看店铺主体，如果政府抽查一般看的是产品外包装上的公司信息。亚马逊和政府看的地方都不一样，不过我们之前客户基本上是以亚马逊平台登记的店铺主体为主的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">英代信息可给客户清关吗？英代是进口商吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">不可以，我们提供的只是授权代表，不是客户的进口商，不对客户产品质量负责。</div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">客户有英国公司/欧盟公司，他们可以自己做英代/欧代吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果客户的公司在当地有运营有人办公，且客户产品出现问题了，当地有人负责和相关政府沟通，则客户的英国公司/欧盟公司可自行做英代/欧代。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 7">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">退税</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">退税的方式？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国退税有三种方式：1、以支票形式退回国内（确认是否需要邮寄回国，邮费自付，支票汇兑请自行找相关金融机构，支票有效期6个月）；2、退到英国本地银行账户（银行账户名称必须与VAT英文名称一致）；3、留到VAT名下抵扣销售税；目前我司暂无退税服务
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">怎样取消支票退税？是否由税务代理操作？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果您购买退税的服务后，税务代理可协助操作，未购买退税服务，请自行于工作日下午四点以后通过以下网址联系税局https://www.gov.uk/government/organisations/hm-revenue-customs/contact/vat-enquiries，让对方取消支票，提供账户给税局进行转账退税，
                  <div>退税所需银行账户信息：</div>
                  <div>VAT number：（9位数字）</div>
                  <div>Account name：(与税号英文名完全一致）</div>
                  <div>Account number：（8位数字）</div>
                  <div>sort code：（6位数字</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-box" v-if="index == 8">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">税号/EORI 查询</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: none">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">退税的方式？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  英国退税有三种方式：1、以支票形式退回国内（确认是否需要邮寄回国，邮费自付，支票汇兑请自行找相关金融机构，支票有效期6个月）；2、退到英国本地银行账户（银行账户名称必须与VAT英文名称一致）；3、留到VAT名下抵扣销售税；目前我司暂无退税服务
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">怎样取消支票退税？是否由税务代理操作？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果您购买退税的服务后，税务代理可协助操作，未购买退税服务，请自行于工作日下午四点以后通过以下网址联系税局https://www.gov.uk/government/organisations/hm-revenue-customs/contact/vat-enquiries，让对方取消支票，提供账户给税局进行转账退税，
                  <div>退税所需银行账户信息：</div>
                  <div>VAT number：（9位数字）</div>
                  <div>Account name：(与税号英文名完全一致）</div>
                  <div>Account number：（8位数字）</div>
                  <div>sort code：（6位数字</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: block">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="tab-box" v-if="index == 9">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">税号绑定销售平台</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">税号为什么绑定失败？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  <div>税号绑定失败原因如下：</div>
                  <div>(1)税号注册成功但是生效日期未到。</div>
                  <div>(2)税号填写格式问题 或是证书上传有误。</div>
                  <div>(3)税号注册主体和后台信息不完全一致。</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="tab-box" v-if="index == 10">
      <!-- 菜单点击的名称 -->
      <div class="tab-title">其他问题</div>
      <div class="tab-content">
        <!-- 通用的问题列表-->
        <div class="simple-data" style="display: block">
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q1:</div>
                <div class="content">什么是EORI号？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  EORI号码是欧盟国家内凡是有经济活动，尤其是有进出口生意的个人/企业必备的一个清关登记号码。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q2:</div>
                <div class="content">什么是ien码？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  IEN号也就是货物在英国进口申报时生成的一个清关流水号，全称是Import
                  EntryNumber。只要进口清关缴税后在C88文件上都会有这个编码;如果卖家用的是自己的VAT清关的话，那么C88上面就有一个单独的IEN编码。这个数字具备唯一性，这也意味着，之前采用双清包税的按照一般贸易的模式的清关的，都可能无法为每个卖家提供IEN号码，这也意味着亚马逊终于开始和欧洲各国税局合作，以确保平台的合规性免受质疑。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q3:</div>
                <div class="content">EORI没生效能发货吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  您好，在EORI码没生效时，可以用货代的税号发货清关，即双清包税的渠道（英国不行，因为需要对应的IEN码）。如果运输计划可行时，建议用自己的税号清关。在还没有税号，但是着急发货，可以小批量的发快递或者空派，找物流双清包税就好。
                  <div>
                    (1)EORI号在VAT税号生效日后的2-3周生效，实际生效日取决于税局办理进度，建议在
                    发货前一个月办理税号，预留时间方便做发货计划。
                  </div>
                  <div>
                    (2)当EORI码没有生效时，想提前发货，可以找税代双清关包税发货，此方式不建议发
                    大量的货，因为会影响后续申报抵扣进口关税，且用税代税号会有发货扣留货物风险。
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q4:</div>
                <div class="content">如果我们英国自发货，就不用VAT或者EORI号吧？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  您好，如果您是再电商平台销售，建议办理税号，从2021年开始英国国内自发货也是需要缴税的。
                  <div>例如eBay、亚马逊现在没有税号平台会暂停您的销售权限，如果您是自发货的话是 不需要eori清关。</div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q5:</div>
                <div class="content">使用货代的VAT税号清关有什么风险？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  您好，使用货代的VAT税号清关：
                  <div>
                    (1)用货代的VAT税号清关给不到IEN号和C88税金文件，没有C88无法抵扣进项，
                    没有IEN对产品造成影响可能产生罚金，严重封店；
                  </div>
                  <div>
                    (2)只有销项没有进项，货物来源无法追溯，有可能被税局查到要求解释货物从哪里来，
                    没有合理解释可能会对税号/店铺造成影响；
                  </div>
                  <div>
                    (3)目前英国的话不建议走包税渠道，因为英国查的比较严，目前相对德国政策宽松点，
                    因为德国清关难度还是比较大的，综合来讲要完全合规 ，无论哪个国家都建议 用自己的税号清关。
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q6:</div>
                <div class="content">英国账号挂了，不注销税号有影响吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果您这边相同公司主体名下没有再销售的可能，建议注销VAT，否则税号还是需要根据申报周期完成申报的，否则可能会产生一定的罚金，或者还会影响公司法人出入境呢。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q7:</div>
                <div class="content">VAT被自动注销的原因有哪些？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  VAT被自动注销的原因的话，比如是：
                  <div>(1)长期零申报，或者不申报；</div>
                  <div>(2)一般是因为您之前有一些历史遗留的税务问题没有处理，才会被会计师单方面注销。</div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q8:</div>
                <div class="content">具体哪些发票可以做抵扣？抵扣的流程是什么，需要卖家准备什么信息？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  关于欧洲抵扣退税：
                  <div>
                    (1)可以提供的文件：VAT发票，例如亚马逊开给卖家的广告VAT发票（英国、德国税法
                    规定广告发票不可以抵扣），或卖家自己获取到的VAT发票（B2B发票）。
                  </div>
                  <div>2，进口VAT可以抵扣，进口关税不能抵扣，特指标准税率时可以抵扣；</div>
                  <div>(2)抵扣流程，卖家提供可抵扣发票，提供销售数据上传到申报跨税云申报系统中 抵扣销售税；</div>
                  <div>(3)对冲发票：Gutschrift 账单，这就是销售账单的一个返回账单。一般卖家不会提供。</div>
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q9:</div>
                <div class="content">转代理前代理移除了地址对申报有影响吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  关于前代理移除税号地址，对申报是不会有影响的，地址主要是用于接收C79文件，C79文件可以通过C88向海关拿到的。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q10:</div>
                <div class="content">在荷兰清关，进口税可以在德国抵扣吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果你在荷兰清关销售到德国，这种运输方式没有荷兰税号属于递延清关，缴纳税金在德国清算缴纳税金。德国缴税申报正常处理的，进口税不能抵扣。在德国销售，办理德国税号，缴纳税金。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q11:</div>
                <div class="content">有税务稽查不补缴税金会怎么样？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  如果被税务稽查不补缴税金，会产生如下影响：1.首先您的店铺会被封，收款账户中的金额会被冻结，产品会被平台销毁处理2.对于补缴金额比较大的，对法人去欧洲出入境会有影响，并有可能进入欧洲信用体系黑名单。
                </div>
              </div>
            </div>
          </div>
          <div class="question-item">
            <div class="question-title">
              <div class="question-inner">
                <div class="label">Q12:</div>
                <div class="content">老销售账号一定要补税吗？</div>
              </div>
            </div>
            <div class="question-answer">
              <div class="question-inner">
                <div class="label">答:</div>
                <div class="content">
                  目前的欧洲税法里英意法西目前没有强制补缴要求，注册税号的时候填现在或者往后的税号生效日，当作一个新账户申请税号。您也可以选择主动补缴，或等税号注册下来之后被查税时补缴。如果不是主动补缴，后续有概率收到罚金，滞纳金等罚款。具体金额不定。法国最为严格，罚金可以是税金的30-80%。所以依据店铺实际情况销售金额，建议实际缴纳，避免引起二次问题。
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 税号/EORI查询的列表 -->
        <div class="shuihao-data" style="display: none">
          <div class="sh-item">
            <div class="sh-title">英国税号查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-vat-number/enter-vat-details" target="_blank">
                https://www.tax.service.gov.uk/check-vat-number/enter-vat-details
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">英国EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://www.tax.service.gov.uk/check-eori-number" target="_blank">
                https://www.tax.service.gov.uk/check-eori-number
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟税号查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/vies/vatResponse.html" target="_blank">
                https://ec.europa.eu/taxation_customs/vies/vatResponse.html
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">欧盟EORI查询链接：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en" target="_blank">
                https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">需CE认证的产品链接查询：</div>
            <div class="sh-link">
              <a href="https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en" target="_blank">
                https://ec.europa.eu/growth/single-market/ce-marking/manufacturers_en
              </a>
            </div>
          </div>
          <div class="sh-item">
            <div class="sh-title">国家企业信用信息公示系统链接：</div>
            <div class="sh-link">
              <a href="http://www.gsxt.gov.cn/index.html" target="_blank">http://www.gsxt.gov.cn/index.html</a>
            </div>
          </div>
        </div>
        <!-- 各国申报时间 -->
        <div class="shenbao-data" style="display: none">
          <table>
            <thead>
              <tr>
                <th class="th-gj">国家</th>
                <th class="th-sj">申报时间</th>
                <th class="th-jl">举例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="td-gj">英国</td>
                <td class="td-sj">申报次月的5号之前</td>
                <td class="td-jl">申报1-3月，是在5月5号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">法国</td>
                <td class="td-sj">申报次月的18号之前</td>
                <td class="td-jl">申报3月，是在4月18号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">意大利</td>
                <td class="td-sj">申报次月的13号之前，税金到账时间15号</td>
                <td class="td-jl">申报3月，是在4月13号之前必须完成申报，15号税金必须到账税局</td>
              </tr>
              <tr>
                <td class="td-gj">西班牙</td>
                <td class="td-sj">申报次月的20号之前</td>
                <td class="td-jl">申报1-3月，是在4月20号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">德国</td>
                <td class="td-sj">申报当月的9号之前</td>
                <td class="td-jl">申报3月，是在4月9号之前必须完成（税金必须到账税局）</td>
              </tr>
              <tr>
                <td class="td-gj">阿联酋</td>
                <td class="td-sj">申报当月的25号之前</td>
                <td class="td-jl">申报3月，是在4月25号之前支付税金（看支付日期，不是看到账时间）</td>
              </tr>
              <tr>
                <td class="td-gj">沙特</td>
                <td class="td-sj">申报当月的20号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">波兰</td>
                <td class="td-sj">申报当月的15号之前</td>
                <td class="td-jl">申报3月，是在4月20号之前支付税金（税金必须到账）</td>
              </tr>
              <tr>
                <td class="td-gj">奥地利</td>
                <td class="td-sj">申报次月的15号之前</td>
                <td class="td-jl">申报1-3月，是在4月15号之前必须完成（税金必须到账税局）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["index"],
  data() {
    return {};
  },
  methods: {
    handleOpen() {
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-box {
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e4e4e4;
  padding: 30px 40px;

  .tab-title {
    font-size: 18px;
    font-weight: 500;
    color: #16ade9;
    padding-bottom: 30px;
  }

  .tab-content {
    .question-item {
      margin-bottom: 30px;
      .question-title {
        .question-inner {
          display: flex;
          .label {
            width: 35px;
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            color: #16ade9;
            line-height: 24px;
          }
          .content {
            flex: 1;
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            padding-left: 10px;
            line-height: 24px;
          }
        }
      }
      .question-answer {
        margin-top: 14px;
        .question-inner {
          display: flex;
          .label {
            width: 35px;
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            color: #16ade9;
            line-height: 24px;
          }
          .content {
            flex: 1;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            line-height: 24px;
            padding-left: 10px;
          }
        }
      }
    }
    .shuihao-data {
      .sh-item {
        margin-bottom: 30px;
        .sh-title {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        }
        .sh-link {
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          padding-top: 10px;
        }
      }
    }
    .shenbao-data {
      table {
        border-collapse: collapse;
        width: 100%;
        /* min-height: 100%; */
      }
      tr {
        background: rgba(22, 173, 233, 0.22);
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        text-align: center;
      }
      th {
        font-size: 14px;
        font-weight: 400;
        color: #666;
        line-height: 14px;
      }

      td,
      th,
      tr {
        border: solid 1px #c6c6c6;
      }
      td {
        background: #fff;
        font-size: 14px;
      }
      .th-gj {
        width: 100px;
      }
      .th-sj {
        width: 270px;
      }
      .th-jl {
      }
    }
  }
}
</style>
