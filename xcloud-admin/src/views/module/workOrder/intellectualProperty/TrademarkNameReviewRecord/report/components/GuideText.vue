<template>
  <div class="fixed-tips-wrap" :style="tipsStyle">
    <div class="content">
      <!-- <div @click="showTips = false" class="hold">>> 收起指引</div> -->
      <div class="content-box" v-if="data.nowStep === 0">
        <h3>关于商标含义，可以在词库已有或查看维基百科、谷歌等具有参考价值的网站平台 判断以下存在可能：</h3>
        <ul>
          <li>
            <p>
              1、是否认为人物形象或人名；<br />
              2、是否是著名品牌或商标； <br />
              3、是否是常见的名词或形容词；<br />
              4、是否是国家/地区的本地地名；<br />
              5、是否是国外地名 ；<br />
              6、是否是本国或外国国旗，宝徽，国歌，军旗，军徽、勋音等相同或近似；<br />
              7、是否是本国或外国知名院校、体育组织、环保组织、慈善组织、恐怖组织、邪教组织、黑社会等机构或相近；<br />
              8、是否是本国或外国，地区，政治组织领导人姓名，或相近 ； <br />
              9、是否是本国或外国国家党派或政府机构名称或相近；<br />
              10、是否是本国或外国党政机关、军队、警察等职务、职级、职衔名称或相近； <br />
              11、是否带有民族歧视性质 ；<br />
              12、是否是宗教信仰、宗教感情相关的；
            </p>
          </li>
        </ul>
      </div>
      <div class="content-box" v-if="data.nowStep === 1">
        <h3>一、待检索商标只有一个类目的情况</h3>
        <ul>
          <li>
            同类检索情况（XX类）
            <p>
              1、用整体去检索，没发现特别近似的商标；<br />
              2、用前面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              3、用中间面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              4、用后面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；
            </p>
          </li>
          <li>
            跨类检索情况（XX类）
            <p>
              1、用整体去检索，没发现特别近似的商标；<br />
              2、用前面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；
            </p>
          </li>
        </ul>
        <h3>二、待检索商标有多个类目的情况需要逐一检索</h3>
        <ul>
          <li>
            同类检索情况（XX类）
            <p>
              1、用整体去检索，没发现特别近似的商标；<br />
              2、用前面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              3、用中间面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              4、用后面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；
            </p>
          </li>
          <li>
            同类检索情况（XX类）
            <p>
              1、用整体去检索，没发现特别近似的商标；<br />
              2、用前面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              3、用中间面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；<br />
              4、用后面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；
            </p>
          </li>
          <li>
            跨类检索情况（XX类）
            <p>
              1、用整体去检索，没发现特别近似的商标；<br />
              2、用前面部分字母去检索，发现近似的商标有XXXX(产品为XXX)与XXXX（产品为XXXX）；
            </p>
          </li>
        </ul>
      </div>
      <div class="content-box" v-if="data.nowStep === 2">
        <h3>一、近似检索原则</h3>
        <ul>
          <li>
            <p>
              1、同类目检索，跨类检索判断：跨类已注册（大类目不同，且产品品类无关联性）：60%；<br />需注意若注册商标的使用场景是在亚马逊上开店备案使用，存在该同名也在亚马逊开店的，后注册商标会无法顺利备案的情况；
              <br />2、跨类未注册，但有近似标，产品无关联则通过率75%,产品有关联则通过率60%。<br />产品有无关联判断标准：主要看产品属性及材质是否一致等。例如：家纺与服装有关联，电动玩具与服装无关联。
              <br />3、同类及跨类近似取值规则，跨类与同类通过率取其低者<br />
              <span style="padding-left: 20px; display: block">
                A、同类有同名，无论跨类是否有同名与近似——都取值同类通过率<br />
                B、同类无同名，有近似；跨类有同名——取值两者较低的通过率<br />
                D、同类无同名，有近似；跨类有近似——取值两者较低的通过率<br />
                E、同类无同名，有近似；跨类无同名/近似——取值同类通过率
              </span>
              <br />4、空格不计入字母数量，按照以上检索规则给对应通过率。
              <br />5、倒序判断：检索的商标名和在先注册的商标字母数量一致且是完全倒序(如检索商标名ABCDEFG，在线注册商标名GFEDCBA)按照近似考虑，其他的非完全倒序不予考虑。
              <br />6、数字计入字母数量考虑近似 。 <br />7、商标检索建议让客户提供主营产品名/小类名（英文名优先）。
              <br />8、发音近似也需要考虑，主要针对整体发音和前半部分的发音。
            </p>
          </li>
        </ul>
        <h3>二、通过率评定</h3>
        <GuideTextTable />
        <h3>三、修改建议模版</h3>
        <ul>
          <li>
            <p>
              1、XXX近似，可尝试注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />2、前面X个字母一样，机会与风险同在，建议修改近似部份，提高通过率
              <br />3、前面部分字母有相似，整体相似度一般，可尝试注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />3、后面部分XXX近似，可考虑注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />4、后半部分的XXX近似，可尝试注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />5、后半部分字母有相似，整体相似度一般，可尝试注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />6、中间部分X个字母一样，机会与风险同在，建议修改近似部份，提高通过率
              <br />7、中间部分XXX近似，可考虑注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />8、中间部分字母有相似，整体相似度一般，可尝试注册，建议设计logo/意向申请/避开近似商标的小类，可提高通过率
              <br />9、没有查到较近似的商标，建议尽早注册，以避免被抢注
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, reactive, computed } from 'vue';
import GuideTextTable from './GuideTextTable.vue';

const data = reactive({
  nowStep: inject('nowStep') as number,
  showTips: inject('showTips') as boolean,
});
const tipsStyle = computed(() => {
  return {
    width: data.showTips ? '500px' : '0',
    'border-left': data.showTips ? '20px solid #f0f2f5' : '0',
  };
});
</script>
<style lang="less" scoped>
.fixed-tips-wrap {
  width: 0;
  overflow: auto;
  background: #fff;
  border-left: 20px solid #f0f2f5;
  transition: all 0.3s;
  .content {
    padding: 20px;
    width: 480px;
    box-sizing: border-box;
    .hold {
      cursor: pointer;
      margin-bottom: 20px;
      color: #40a9ff;
    }
    &-box {
      margin-bottom: 20px;
      ::v-deep h3 {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
      }
      ::v-deep li {
        margin-bottom: 6px;
        font-size: 16px;
        p {
          line-height: 28px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
