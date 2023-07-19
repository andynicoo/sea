import { ref, onMounted } from 'vue';
import {
  getTrademarkDetail,
  getTrademarkAllReport,
} from '@/api/workOrder/intellectualProperty/trademark';
import { isEmpty } from 'lodash-es';

const useDetailFn = (id: any) => {
  const trademarkDetail = ref<any>({});
  const allReport = ref<any>(null);
  const getData = () => {
    getTrademarkDetail(id).then((res: any) => {
      trademarkDetail.value = res;
    });
    getTrademarkAllReport(id).then((res: any) => {
      allReport.value = isEmpty(res) ? null : res;
    });
  };
  onMounted(() => {
    getData();
  });
  return {
    trademarkDetail,
    allReport,
    update: () => getData(),
  };
};
export default useDetailFn;
