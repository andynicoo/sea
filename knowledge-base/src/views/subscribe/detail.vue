<template>
  <PageWrapper title="文章标题" content="" contentBackground @back="goBack">
    <template #extra>
      <a-button type="primary" @click="goCreation"> 创作内容 </a-button>
    </template>

    <a-card>
      <a-row>
        <a-col :span="6">数据源：墨西哥XXXX官网</a-col>
        <a-col :span="6">数据源类型：XX XX</a-col>
        <a-col :span="6">创建时间：2017-01-10</a-col>
        <a-col :span="6">附件：XX XX</a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          内容标签：<a-tag>标签一</a-tag><a-tag>标签二</a-tag><a-tag>标签三</a-tag>
        </a-col>
      </a-row>
    </a-card>

    <!-- 内容概述 -->
    <a-card>
      <a-typography-title :level="4">内容概述</a-typography-title>
      <a-typography-title :level="5" class="text-center">这里是标题</a-typography-title>
      <div class="text-cool-gray-500 mt-5">
        <span class="mr-5">数据源：墨西哥XXXX官网</span>
        <span class="mr-5">网站：XXXXXX</span>
        <span class="mr-5">作者：XXXXXX</span>
        <span class="mr-5">创建时间：XXXXXX</span>
      </div>
      <a-divider />
      <p>
        这篇文章的中心内容是关于墨西哥税务局（SAT）的一项通知，针对个人简化信任制度的纳税人，延长了工资单电子发票（CFDI）版本的发行和电子签名的获取期限。由于2022年税收改革的要求，接收方需要包括RFC、名称、社会原因或名称、税务住所的邮政编码和CFDI使用情况等强制字段。因此，为了确保在发行CFDI时提供的数据与SAT数据库中的数据相一致，必须符合法律法规的要求，必须在2023年3月31日之前使用版本3.3发行工资单CFDI，以满足版本4.0的要求。对于个人简化信任制度的纳税人来说，他们需要获得电子签名才能享受这一制度的税收优惠。为了让他们能够获得电子签名并继续享受这一制度的优惠，SAT已经给予了延长至2023年3月31日的电子签名获取期限。
      </p>
    </a-card>

    <!-- 内容详情 -->
    <a-card>
      <a-typography-title :level="4">内容详情</a-typography-title>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="原文内容">
          <a-typography-title :level="5" class="text-center">
            税务管理局（SAT）通报了延长发放工资CFDI版本和获得电子签名的期限
          </a-typography-title>
          <a-divider />
          <div>
            <p>
              税务管理局（SAT）通报了延长发放工资CFDI版本和获得电子签名的期限，适用于简化信任制度下的自然人纳税人。
            </p>
            <p>
              SAT公告：由于2022年财政改革，CFDI接收者必须填写以下字段：RFC、名称、社会原因或名称、财政住所邮政编码和CFDI用途。
            </p>
            <p>
              鉴于此，为了使提供给CFDI发行的数据与SAT数据库中的数据一致，那些有义务发行工资类税务凭证的纳税人将有权在其3.3版本中执行此操作，直到2023年3月31日，以便在此期间能够满足所有财政规定中预期的CDFI4.0版本发行要求。
            </p>
            <p>
              另一方面，简化信任制度适用于自然人，是一种行政和管理简化，使纳税人能够快速、有效、简单地履行其财政义务，但必须满足在该制度下纳税的一些要求，其中包括拥有电子签名（e.firma）。
            </p>
            <p>
              在这方面，为了使在简化信任制度下纳税的纳税人能够履行拥有电子签名的义务并继续享受该制度提供的财政优惠，SAT已经提供了获得电子签名的便利性直到2023年3月31日，而不会违反财政规定
            </p>
            <p> 我们为改变做出贡献！ </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="logs" tab="翻译内容">
          <a-typography-title :level="5" class="text-center">
            El SAT informa sobre la prórroga para la emisión del CFDI de nómina en su versión y la
            obtención de la e. firma
          </a-typography-title>
          <a-divider />
          <div>
            <p>
              El SAT informa sobre la prórroga para la emisión del CFDI de nómina en su versión y la
              obtención de la e. firma para contribuyentes del Régimen Simplificado de Confianza
              para personas físicas Servicio de Administración Tributaria | 01 de noviembre de 2022
              | Comunicado
            </p>
            <p>
              Derivado de la reforma fiscal para 2022 se incluyeron como datos obligatorios para el
              receptor del CFDI los siguientes campos: RFC, nombre, razón o denominación social,
              código postal del domicilio fiscal y el uso del CFDI.
            </p>
            <p>
              En razón de lo anterior y con la finalidad de que los datos que se proporcionen para
              la emisión del CFDI y aquellos que se encuentran en las bases de datos del SAT sean
              coincidentes, aquellos contribuyentes que se encuentren obligados a emitir
              comprobantes fiscales de tipo nómina, tendrán la opción de realizarlo en su versión
              3.3 hasta el 31 de marzo de 2023, a fin de que durante dicho periodo puedan contar con
              todos los requisitos previstos en las disposiciones fiscales para la emisión del CDFI
              en su versión 4.0.
            </p>
            <p>
              Por otra parte, el Régimen Simplificado de Confianza para personas físicas es una
              simplificación administrativa y de gestión que les permite a los contribuyentes
              cumplir con sus obligaciones fiscales de manera rápida, eficaz y sencilla, sin
              embargo, deben cumplir con algunos requisitos para tributar en dicho régimen, entre
              ellos, contar con la firma electrónica (e.firma).
            </p>
            <p>
              En este sentido, con la finalidad de que los contribuyentes que tributan en el Régimen
              Simplificado de Confianza puedan cumplir con la obligación de contar con la e.firma y
              continuar disfrutando de los beneficios fiscales que ofrece este régimen, el SAT ha
              otorgado la facilidad para obtener la e.firma hasta el 31 de marzo de 2023, sin que
              esto implique un incumplimiento a las disposiciones fiscales.
            </p>
            <p> ¡Contribuimos para transformar! </p>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs, Divider, Card, Typography, Row, Col, Tag } from 'ant-design-vue';
  export default defineComponent({
    name: 'SubScribeDetail',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      ADivider: Divider,
      ACard: Card,
      ATypographyTitle: Typography.Title,
      ARow: Row,
      ACol: Col,
      ATag: Tag,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const userId = ref(route.params?.id);
      const currentKey = ref('detail');
      // const { setTitle } = useTabs();

      // 设置Tab的标题（不会影响页面标题）
      // setTitle('内容创作');

      // 页面左侧点击返回链接时的操作
      function goBack() {
        go('/subscribe/mine');
      }

      // 跳转到内容创作
      function goCreation() {
        window.open('/creation');
      }
      return { userId, currentKey, goBack, goCreation };
    },
  });
</script>

<style></style>
