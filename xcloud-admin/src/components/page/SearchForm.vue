<!-- 菜单页面搜索组件，仅适用于菜单页面头部搜索位置 -->
<template>
  <div class="search-wrap">
    <slot name="topSlot" />
    <div class="form-create-wrap" :class="{ open: openFlag }">
      <form-create
        class="form-create"
        v-model="data.formModal"
        v-model:api="data.fApi"
        :rule="props.rule"
        :option="data.option"
      />
      <div class="search-btn" :style="{ left: searchPosition + 'px' }">
        <a-space>
          <a-button type="primary" @click="submit()">
            <SearchOutlined />
            <span>搜索</span>
          </a-button>
          <a-button type="primary" ghost @click="reset()">
            <SyncOutlined />
            <span>重置</span>
          </a-button>
          <a-button v-if="showMore" type="link" size="small" @click="openFlag = !openFlag">
            <UpOutlined v-if="openFlag" />
            <DownOutlined v-else />
            <span>{{ openFlag ? '收起筛选' : '更多筛选' }}</span>
          </a-button>
        </a-space>
      </div>
      <div class="operation-wrap">
        <a-space>
          <slot name="operationSlot" />
        </a-space>
      </div>
    </div>
    <slot name="bottomSlot" />
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined, SyncOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import type { FormRule } from '@form-create/ant-design-vue';

interface Props {
  rule: FormRule[];
  initSearch?: boolean;
  searchOpen?: boolean;
  searchPosition?: number;
}
const props = withDefaults(defineProps<Props>(), {
  initSearch: true,
  searchOpen: false,
  searchPosition: 640,
});
const emit = defineEmits(['submitParams']);

/** 更多筛选 */
const openFlag = ref(false);
const showMore = ref(false);
const setShowMore = () => {
  nextTick(() => {
    if (Number(document.querySelector('.search-wrap .form-create-wrap .form-create')?.clientHeight) > 82) {
      showMore.value = true;
    } else {
      showMore.value = false;
    }
  });
};
onMounted(() => (openFlag.value = props.searchOpen));
watch(
  () => props.searchOpen,
  () => setShowMore(),
  { immediate: true }
);

/** 表单相关 */
const { setPageCache, cacheData } = useSearchFormCache();
const data: any = reactive({
  formModal: {},
  fApi: null,
  option: {
    form: {
      layout: 'horizontal',
      labelCol: {},
    },
    submitBtn: {
      show: false,
    },
    global: {
      input: {
        props: {
          placeholder: '请输入',
          allowClear: true,
        },
        style: {
          width: '200px',
        },
      },
      inputNumber: {
        props: {
          placeholder: '请输入',
        },
        style: {
          width: '200px',
        },
      },
      cascader: {
        props: {
          placeholder: '请选择',
          allowClear: true,
          showArrow: true,
          maxTagCount: 1,
          showSearch: true,
        },
        style: {
          width: '200px',
        },
      },
      select: {
        props: {
          placeholder: '请选择',
          allowClear: true,
          showArrow: true,
          showSearch: true,
          maxTagCount: 1,
          maxTagTextLength: 5,
          optionFilterProp: 'label',
        },
        style: {
          width: '200px',
        },
      },
      datePicker: {
        style: {
          width: '240px',
        },
      },
    },
  },
});
const submit = () => {
  setTimeout(() => {
    data.fApi.submit((formData: any, fApi: any) => {
      emit('submitParams', formData);
      setPageCache(formData);
    });
  }, 60);
};
const reset = () => {
  data.fApi.resetFields();
};
onMounted(() => {
  // 初始化搜索
  reset();
  data.formModal = { ...cacheData.value };
  props.initSearch && submit();
});

//暴露方法
defineExpose({ submit, reset, data });
</script>

<style scoped lang="less">
.search-wrap {
  position: relative;
  padding: 20px 10px 0;
  background-color: #fff;
  min-width: 1240px;
  margin-bottom: 10px;
  .form-create-wrap {
    position: relative;
    height: 52px;
    min-height: 52px;
    overflow: hidden;
    .form-create {
      padding: 0 15px;
    }
    .search-btn {
      position: absolute;
      top: 0;
      left: 640px;
      width: 274px;
    }
    .operation-wrap {
      position: absolute;
      top: 0;
      right: 0;
      text-align: right;
      overflow: hidden;
    }
  }
  .form-create-wrap.open {
    overflow-y: auto;
    height: auto;
    max-height: 300px;
  }
}
&:deep(.form-create-wrap .ant-row .ant-row) {
  margin-bottom: 20px;
}
&:deep(.form-create-wrap .ant-col-24) {
  display: inline-block;
  flex: 0 0 auto;
  margin-right: 10px;
  &:nth-child(2) {
    flex: 0 0 calc(100% - 460px);
  }
}
</style>
