import { ref, reactive } from 'vue';
const useFn = () => {
  const countryMap: any = reactive({
    US: '美国',
    EU: '欧盟',
    GB: '英国',
    JP: '日本',
  });
  return {
    countryMap,
  };
};
export default useFn;
