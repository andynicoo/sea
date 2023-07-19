<template>
  <PageWrapper title="内容列表" dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable
      @register="registerTable"
      :searchInfo="searchInfo"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                icon: 'clarity:info-standard-line',
                onClick: handleView.bind(null, record),
              },
            ]"
          />
        </template>
        <template v-if="column.key === 'tags'">
          <Tag v-for="(tag, index) in record.tags" :key="index">{{ tag }}</Tag>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getContentList } from '/@/api/subscribe';
  import { columns, searchFormSchema } from './config.data';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'MySubscribeList',
    components: { BasicTable, PageWrapper, TableAction, Tag },
    setup() {
      const go = useGo();
      const searchInfo = reactive<Recordable>({});
      const [registerTable] = useTable({
        api: getContentList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('handleSearchInfoFn', info);
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
        },
      });

      // 跳转详情
      function handleView(record: Recordable) {
        go('/subscribe/detail/' + record.id);
      }

      return {
        registerTable,
        handleView,
        searchInfo,
      };
    },
  });
</script>
