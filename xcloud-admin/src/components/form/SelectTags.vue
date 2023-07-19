<!-- 输入多个转换下拉框组件 -->
<template>
  <a-select
    v-model:value="val"
    :options="list"
    placeholder="请输入或粘贴（以空格分隔数据）"
    :maxTagCount="1"
    :maxTagTextLength="5"
    mode="tags"
    :token-separators="[' ']"
    allowClear
    showArrow
    @change="changeVal"
    style="width: 250px"
  ></a-select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: {
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const list = ref<Array<any>>([]);
const val = ref<Array<any>>([]);
watch(props, newVal => {
  val.value = newVal.modelValue || [];
});

onMounted(() => {
  val.value = props.modelValue || [];
});

//改变
const changeVal = (val: string, selectedOptions: any) => {
  emit('update:modelValue', val);
};
</script>

<style scoped lang="less"></style>
