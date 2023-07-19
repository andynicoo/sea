<template>
  <div class="absolute bottom-0 left-0 w-full dark:border-white/20 pt-2 bg-white">
    <div class="w-full p-2 mx-auto max-w-3xl">
      输入模块：
      <Select
        @change="handleTemplateChange"
        :options="templateOptions"
        v-model:value="template"
        class="w-[200px]"
      />
      <div class="flex rounded-md mb-6 mt-2 flex-grow relative border border-black/20 bg-white p-2">
        <a-dropdown :trigger="['click']" placement="topLeft">
          <PlusOutlined class="text-lg cursor-pointer flex mt-1" />
          <template #overlay>
            <a-menu class="flex flex-col max-h-[150px] overflow-y-auto">
              <a-menu-item
                v-for="(item, index) in contentList"
                :key="index"
                @click="selectContent(item)"
              >
                <div class="w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {{ item.title }}
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-textarea
          v-model:value="Qinput"
          :bordered="false"
          placeholder="点击＋号添加已有内容/收藏素材"
          :rows="5"
          class="resize-none"
        />
        <SendOutlined class="text-lg cursor-pointer mt-[95px]" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { PlusOutlined, SendOutlined } from '@ant-design/icons-vue';
  import { Select, Dropdown, Menu } from 'ant-design-vue';
  import type { SelectProps } from 'ant-design-vue';
  import { getContentList } from '/@/api/subscribe';
  import { ContentListGetResultModel } from '/@/api/model/subscribeModel';

  export default defineComponent({
    components: {
      Select,
      PlusOutlined,
      SendOutlined,
      ADropdown: Dropdown,
      AMenu: Menu,
      AMenuItem: Menu.Item,
    },

    setup() {
      const Qinput = ref<string>(''); // 文本框输入
      const template = ref('1'); // 模板选择
      const contentList = ref<ContentListGetResultModel>([]); // 内容列表
      const templateOptions = ref<SelectProps['options']>([
        {
          value: '1',
          label: '政策解读模板',
          content: '政策解读',
        },
        {
          value: '2',
          label: '资讯解读模板',
          content: '资讯解读',
        },
      ]);

      onMounted(async () => {
        const res = await getContentList();
        contentList.value = res;
      });

      // 切换模板
      function handleTemplateChange(_, ...args) {
        Qinput.value += `${Qinput.value && '\n'}${args[0]?.content}`;
      }

      // 选择内容
      function selectContent(item) {
        Qinput.value = item.title + '\n' + Qinput.value;
      }

      return {
        handleTemplateChange,
        template,
        templateOptions,
        Qinput,
        contentList,
        selectContent,
      };
    },
  });
</script>
