import { ref, shallowRef } from 'vue';
import dayjs from 'dayjs';
import ChannelCompanyCascader from '@/components/form/ChannelCompanyCascader.vue';
import { getAllUsers } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '统计时间',
    field: 'statisTime',
    type: 'datePicker',
    value: [
      dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      allowClear: false,
    },
  },
  {
    title: '渠道',
    field: 'channelCompanyList',
    type: 'component',
    component: shallowRef(ChannelCompanyCascader),
  },
  {
    title: '员工',
    field: 'userIds',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map(
        (v: { userId: string; nickName: string; mobile: string; departmentName: string }) => {
          return {
            value: v.userId,
            label: v.nickName + '——' + v.departmentName,
          };
        }
      );
    },
    props: {
      mode: 'multiple',
    },
  },
]);
