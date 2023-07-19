import { ref } from 'vue';

const globalCount = ref(0);

const addGlobalCount = () => {
  globalCount.value++;
};

const subGlobalCount = () => {
  globalCount.value--;
};

export function useCount() {
  return {
    globalCount,
    addGlobalCount,
    subGlobalCount,
  };
}
