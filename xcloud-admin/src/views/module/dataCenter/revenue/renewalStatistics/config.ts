import { ref, shallowRef } from 'vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect, getCountrySelectList, getproductInfoList } from '@/api/base/basicsData';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';

//获取ids
const getIds = (list: Array<any>, idsArr: Array<number> = []): Array<number> => {
  let listArr: Array<any> = [];
  if (list.length > 0) {
    for (const li of list) {
      idsArr.push(li.id);
      listArr = listArr.concat(li.childrenProductCategoryVo || []);
    }
    return getIds(listArr, idsArr);
  } else {
    return idsArr;
  }
};

export const rule: any = ref([
  {
    title: '企业',
    field: 'enterpriseIdList',
    type: 'select',
    options: async () => {
      return ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '服务截止日期',
    field: 'expirationTimeList',
    type: 'datePicker',
    value: [
      dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    on: {
      change: () => {
        rule.value[2].value = null;
        rule.value[3].value = null;
      },
    },
  },
  {
    title: '国家',
    field: 'countryCodeList',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '部门',
    field: 'departmentIdList',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '人员',
    field: 'attributionIdList',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '客户手机号',
    field: 'custUserMobileList',
    type: 'input',
  },
  {
    title: '商品分类',
    field: 'productCategoryIdList',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
    update(val: any) {
      console.log(val);
      if (val && val.params) {
        getproductInfoList({
          subProductCategoryIds: val.params,
          current: 1,
          size: 9999,
        }).then((res: any) => {
          const list = Array.isArray(res.records) ? res.records : [];
          rule.value[7].options = list.map((v: any) => {
            return {
              value: v.id,
              label: v.productName,
            };
          });
        });
      }
    },
  },
  {
    title: '商品',
    field: 'productSpecsIdList',
    type: 'select',
    props: {
      mode: 'multiple',
    },
    options: async () => {
      return ((await getproductInfoList({
        current: 1,
        size: 9999,
      })) as any).records.map((v: { id: string; productName: string }) => {
        return {
          value: v.id,
          label: v.productName,
        };
      });
    },
  },
]);
