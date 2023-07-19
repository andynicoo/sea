<template>
  <div>
    <ul>
      <li>
        不建议注册的情况
        <p>
          1、同类目差一个单词，或差一个符号/数字/字母，如NUMBER-ONE与NUMBER 1； <br />
          2、同类目已注册 同类目已注册；<br />
          3、词库已有或查看维基百科、谷歌等具有参考价值的网站平台如果命中以下任意一条则通过率为：不建议<br />
          <span style="display: block; padding-left: 20px">
            A、是否认为人物形象或人名；<br />
            B、是否是注明品牌或商标；<br />
            C、是否是常见的名词或形容词；<br />
            D、是否是国家/地区的本地地名；<br />
            E、是否是国外地名 ；<br />
            F、是否是本国或外国国旗，宝徽，国歌，军旗，军徽、勋音等相同或近似；<br />
            G、是否是本国或外国知名院校、体育组织、环保组织、慈善组织、恐怖组织、邪教组织、黑社会等机构或相近 ；<br />
            H、是否是本国或外国，地区，政治组织领导人姓名，或相近 ；
            I、是否是本国或外国国家党派或政府机构名称或相近；<br />
            J、是否是本国或外国党政机关、军队、警察等职务、职级、职衔名称或相近；<br />
            K、是否带有民族歧视性质 ；<br />
            L、是否是宗教信仰、宗教感情相关的；<br /><br />
          </span>
        </p>
      </li>
    </ul>
    <template v-if="data.trademarkName.length === 3">
      <ul>
        <li>
          3个字母，例如：kts
          <p>
            1、同类前面1个字母相似，后面不相似：kdf。（通过率：70%）<br />
            2、同类前面2个字母相似：kdf（通过率：小于50%）<br />
            3、同类后面2个字母相似：ktf（通过率：60%）<br />
            4、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 4">
      <ul>
        <li>
          4个字母，例如：ktso
          <p>
            1、同类前面1-2个字母前后顺序一样：kbpe/ktde，其他类目有2/3个字母一样，产品有关联。（通过率：60%）<br />
            2、同类前面3个字母一样：ktse（通过率：小于50%）<br />
            3、同类后面3个字母一样：ptso通过率：小于50%）<br />
            4、前面2个字母一样：ktfa（通过率：60%）<br />
            5、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 5">
      <ul>
        <li>
          5个字母，例如：ktsor
          <p>
            1、同类前面1-2个字母前后顺序一样：ktpeb/ktdem（通过率：60%）<br />
            2、同类前面3个字母一样：ktsep（通过率：小于50%）<br />
            3、同类后面3个字母一样：pbsor（通过率：60%）<br />
            4、同类前面3个字母一样：ktsel（通过率：小于50%）<br />
            5、同类中间/后面3个字母一样：ptsof（通过率：60%）<br />
            6、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 6">
      <ul>
        <li>
          6个字母 例如：arengi KUVAUS, 整体查询没有很相似的；12类查询前半部分有KUMA产品为收割机、KUGA汽车、FORD
          KUGA汽车卡车及其零部件等；查询中间部分uav非军事无人机;查询后半部分有同名公司注册的VANS产品是自行车摩托车把手套等。
          <p>
            1、同类前面2个字母顺序一样：arpokl（通过率：75%）<br />
            2、同类前面3个字母顺序一样：areokl（通过率：小于50%）<br />
            3、同类后面2个字母一样：pohigi/pohngi（通过率：80%）<br />
            4、同类后面3-4个字母一样：poengi/porngi（通过率：75%）<br />
            5、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 7">
      <ul>
        <li>
          7个字母 例如：arengin
          <p>
            1、同类前面1-2个字母顺序一样：arpokhe/aheokhe（通过率：80%）<br />
            2、同类前面3个字母顺序一样：areokhe（通过率：70%）<br />
            3、同类前面4-5个字母顺序一样：arenkhe/arengyi /aorenken（通过率：小于50%）<br />
            4、同类后面1-2个字母顺序一样：arpokhe/aheokhe（通过率：85%）<br />
            5、同类后面3个字母顺序一样：phrogin（通过率：80%）<br />
            6、同类后面4-5个字母顺序一样：phongin/phengin（通过率：75%）<br />
            7、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 8">
      <ul>
        <li>
          8个字母 例如：arpokhel
          <p>
            1、同类前面1-2个字母顺序一样：arpokhel/aheokhel（通过率：80%）<br />
            2、同类前面3个字母顺序一样：areokhel（通过率：75%）<br />
            3、同类前面4-5个字母顺序一样：arenkhel/arenghel（通过率：小于50%）<br />
            4、同类后面1-2个字母顺序一样：fapokhnl/faeokhel<br />
            5、同类后面3个字母顺序一样：fapokinl<br />
            6、同类后面4-5个字母顺序一样：phonginl/phorginl<br />
            7、同类后面6个字母顺序一样：phenginl/prenginl（通过率：60%）<br />
            8、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 9 || data.trademarkName.length === 10">
      <ul>
        <li>
          9-10个字母：例如：arenginloe
          <p>
            1、任意4个连在一起的字母相似：aren/areng/reng/rengi/engin（通过率：75%）<br />
            2、前面5-7个字母相似live:arengick/arengoko（通过率：小于50%）<br />
            3、中间或者后面任意4个连在一起的字母相似：hdengicke /hdcakinlo（通过率：75%）<br />
            4、中间或者后面任意5-7个连在一起的字母相似：hdenginck /hdcnginlo/hdcenginlo（通过率：60%）<br />
            5、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <template v-if="data.trademarkName.length === 11">
      <ul>
        <li>
          11个字母及以上：例如：arenginloed
          <p>
            1、任意50%字母数（向下取整，如11个字母，50%字母数则是5）连在一起的字母相似：areng<br />
            2、前面75%个字母数（向下取整，如11个字母，65%字母数则是7）相似live:arenginck（通过率：小于50%）<br />
            3、中间或者后面任意50%个字母数连在一起的字母相似：hdengicke /hdcakinlo（通过率：75%）<br />
            4、中间或者后面任意75%个连在一起的字母相似：hdenginck /hdcnginlo/hdcenginlo（通过率：60%）<br />
            5、若相似商标的产品与要注册商标指定的商品具有关联性，通过率下调一个档次。<br /><br />
          </p>
        </li>
      </ul>
    </template>
    <ul>
      <li>
        不区分字数，先判断是否为单词或单词变形，拆分前后两部分分别查询；再拆分三部分，前面中间两部分作为一个整体拆分前后部分依次查询
        例如 doceminkeng
        <p>
          1、拆分两部分的时候 前面一半相似度不高的，docewiepler（通过率：酌情给70%-75%）<br />
          2、拆分两部分的时候 前面一半有相似的，docemiepler（通过率：小于50%）<br />
          3、拆分三部分的时候 前面两部分相似度不高的，docebiepler（通过率：酌情给70%-75%）<br />
          4、拆分三部分的时候 前面两部分有相似的，docemiepler（通过率：酌情给60%、小于50%、不建议）<br /><br />
        </p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { reactive, inject } from 'vue';

const data = reactive({
  trademarkName: inject('trademarkName') as string,
});
</script>
