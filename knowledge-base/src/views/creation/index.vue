<template>
  <div class="overflow-hidden w-full h-full relative">
    <div class="h-full fixed inset-y-0 w-[260px] flex-col bg-stone-900 text-white">
      <nav class="flex h-full flex-1 flex-col p-2">
        <a
          class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 text-white transition-colors duration-200 cursor-pointer text-sm mb-2 border border-white/20"
        >
          <PlusOutlined /> 新创作
        </a>
        <div class="flex-col flex flex-1 overflow-y-auto">
          <a
            :class="`flex py-3 px-3 items-center gap-3 relative mb-2 rounded-md hover:bg-[#2A2B32] cursor-pointer ${
              current === index && 'bg-[#2A2B32]'
            }`"
            v-for="(item, index) in conversationList"
            :key="index"
            @click="changeConversation(index)"
          >
            <MessageOutlined />
            <div class="flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all">
              {{ item.title }}
            </div>
          </a>
        </div>
      </nav>
    </div>
    <div class="flex h-full flex-1 flex-col pl-[260px]">
      <main class="relative h-full w-full flex flex-col overflow-hidden items-stretch flex-1">
        <div class="flex-1 overflow-hidden pb-[220px]">
          <div class="flex flex-col overflow-y-auto h-full items-center">
            <QAItem
              type="Q"
              content="BUSINESS CITIZENS Temporary change of VAT rates for the year 2023 A temporary reduction in
                  VAT rates (-1 percentage point) applies from 1 January 2023 to 31 December 2023. The
                  following VAT rates are applicable during this period: * standard rate: 16 % (decrease
                  from 17 % to 16 %); * intermediate rate: 13 % (decrease from 14 % to 13 %); * reduced
                  rate: 7 % (decrease from 8 % to 7 %). The super-reduced rate of 3 % remains unchanged.
                  Taxes paid by means of stamps (stamp duty) are exempt from VAT. 
                  我的要求是：
                  1、输出一篇解读文章，要求是生成一篇面向中国跨境电商卖家的政策解读文章
                  2、如果碰到数字的变化，除了文本描述外，请额外生成一个表格展示； 2、以简体中文输出文章；"
            />
            <QAItem
              type="A"
              content="尊敬的中国跨境电商卖家：
近日，欧洲国家发布了一项临时增值税（VAT）税率调整的政策。自2023年1月1日至12月31日，VAT税率将会有所下调，此次调整为期一年。具体调整内容如下：
税率类型     新税率     调整幅度
标准税率     16%     下调1%
中间税率     13%     下调1%
减免税率     7%     下调1%
超减税率     3%     不变
在此期间，以印花税的形式支付的税金将被免除VAT。
此次政策的实施，将为在欧洲开展跨境电商业务的中国卖家带来利好。降低的VAT税率将会使得商品的进口成本降低，提高产品的竞争力。此外，消费者的购买力也会得到提升，有望进一步促进欧洲市场的消费增长。
此次调整虽然是临时性的，但是也给中国卖家提供了一个更好的发展机遇。在此背景下，卖家可以积极利用政策优惠，加大在欧洲市场的推广力度，扩大销售规模。
需要注意的是，不同的商品和服务适用的税率是不同的。卖家在开展业务时，需仔细了解所售商品或服务适用的税率，以免因为税率的不同而导致经营不畅。
最后，提醒卖家要严格遵守欧洲国家的税收法规，确保自身业务合法合规。
祝商祺！"
            />
          </div>
        </div>
        <Send />
      </main>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { MessageOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { ConversationListItem } from '/@/api/model/creationModel';
  import { getConversationList } from '/@/api/creation';
  import QAItem from './QAItem.vue';
  import Send from './Send.vue';
  export default defineComponent({
    components: {
      MessageOutlined,
      PlusOutlined,
      QAItem,
      Send,
    },

    setup() {
      const conversationList = ref<ConversationListItem[]>([]); // 会话列表
      const current = ref<number>(0); // 当前会话index

      onMounted(async () => {
        const res = await getConversationList();
        conversationList.value = res;
      });

      // 切换会话
      function changeConversation(index) {
        current.value = index;
      }

      return {
        conversationList,
        changeConversation,
        current,
      };
    },
  });
</script>
<style scoped>
  a {
    color: white;
  }
</style>
