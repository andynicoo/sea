<template>
  <div class="wrapper">
    <a-tabs v-model="activeKey">
      <a-tab-pane
        v-for="item in tabsList"
        :key="item.key"
        :tab="item.title"
      >
        <component
          :is="item.componentId"
          v-if="item.key === activeKey"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AdList from './AdList'
import Blogroll from './Blogroll'
import AdPosition from './AdPosition'
import Message from './Message'
import PromotionRebate from './PromotionRebate'
export default {
  components: {
    AdList,
    Blogroll,
    AdPosition,
    Message,
    PromotionRebate
  },
  data() {
    return {
      activeKey: 'Advertising',
      tabsList: [
        {
          title: '广告列表',
          key: 'Advertising',
          componentId: AdList
        },
        {
          title: '消息通知',
          key: 'Message',
          componentId: Message
        },
        {
          title: '友情链接',
          key: 'Blogroll',
          componentId: Blogroll
        },
        {
          title: '推广返利规则描述',
          key: 'PromotionRebate',
          componentId: PromotionRebate
        }
        // {
        //   title: '广告位',
        //   key: 'AdPosition',
        //   componentId: AdPosition
        // }
      ]
    }
  }
}
</script>

<style></style>
