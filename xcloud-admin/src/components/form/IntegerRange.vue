<!-- 整数区间输入框组件，整数 -->
<template>
  <div>
    <a-input-number v-model:value="val.start" :min="0" :precision="0" placeholder="请输入" @blur="changeVal" />
    <span style="margin: 0 6px">至</span>
    <a-form-item-rest>
      <a-input-number v-model:value="val.end" :min="0" :precision="0" placeholder="请输入" @blur="changeVal" />
    </a-form-item-rest>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    default: {
      start: null,
      end: null,
    },
  },
});
const emit = defineEmits(['update:modelValue']);

const val = ref({
  start: null,
  end: null,
});
watch(props, (newVal: any) => {
  val.value = {
    start: newVal.modelValue.start,
    end: newVal.modelValue.end,
  };
});

//改变
const changeVal = () => {
  emit('update:modelValue', JSON.parse(JSON.stringify(val.value)));
};
</script>

<style scoped lang="less"></style>
