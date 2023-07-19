<template>
  <div class="container">
    <div class="container-wrap">
      <!-- 同类 -->
      <div class="my-table-title">
        同类近似检索详情列表{{ dataSourceB1.length ? `(${title})` : '' }}
        <a-button v-if="!readonly" type="link" @click="emit('refresh')">刷新</a-button>
      </div>
      <a-table
        :dataSource="dataSourceB1"
        :columns="columns3B1"
        :loading="props.loading"
        bordered
        :pagination="false"
        style="margin-bottom: 40px"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'queryItem'"> 用 {{ text }} 检索 </template>
          <template v-if="column.dataIndex === 'similarTm'">
            {{ text }}
            <div>
              <span v-if="!readonly" style="margin: 0 10px; color: #999"
                ><form-outlined style="cursor: pointer" @click="handleEditBrandRecord(record)"
              /></span>
              <a
                v-if="record.isLast"
                href="javascript:void(0);"
                style="color: #999; font-size: 12px"
                @click="handleMoreTable(record)"
                >更多</a
              >
            </div>
          </template>
        </template>
      </a-table>
      <!-- 跨类 -->
      <div class="my-table-title">
        全类别近似检索结果<a-button v-if="!readonly" type="link" @click="emit('refresh')">刷新</a-button>
      </div>
      <a-table :dataSource="dataSourceB2" :columns="columns3B2" :loading="props.loading" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'queryItem'"> 用 {{ text }} 检索 </template>
          <template v-if="column.dataIndex === 'similarTm'">
            {{ text }}
            <div>
              <span v-if="!readonly">
                <form-outlined
                  v-if="!readonly"
                  @click="handleEditBrandRecord(record, 'all')"
                  style="cursor: pointer; margin: 0 10px; color: #999"
                />
              </span>
              <a
                v-if="record.isLast"
                href="javascript:void(0);"
                style="color: #999; font-size: 12px"
                @click="handleMoreTable(record)"
                >更多</a
              >
            </div>
          </template>
        </template>
      </a-table>
    </div>
    <DialogTableMore
      v-if="DialogTableMoreInfo.show"
      :title="DialogTableMoreInfo.title"
      :columns="DialogTableMoreInfo.columns"
      :data="DialogTableMoreInfo.data"
      @close="DialogTableMoreInfo.show = false"
    />
    <ModalEditBrandSimilar
      v-if="editBrandSimilarShow"
      @close="editBrandSimilarShow = false"
      @change="changeRecord"
    ></ModalEditBrandSimilar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { QueryTrademarkNameRes } from '@/api/workOrder/intellectualProperty/type';
import DialogTableMore from './DialogTableMore.vue';
import { FormOutlined } from '@ant-design/icons-vue';
import ModalEditBrandSimilar from './ModalEditBrandSimilar.vue';

type SingData = QueryTrademarkNameRes['trademarkSearchCheckResultList'][0];
interface Props {
  data: QueryTrademarkNameRes;
  title: string;
  loading: boolean;
  readonly?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['edit', 'refresh']);
const DialogTableMoreInfo = reactive({
  show: false,
  title: '',
  columns: [],
  data: [],
});
const editBrandSimilarShow = ref(false);
const eidtId = ref('');
// 默认同类表单
const useTableType = ref('com');
provide('useTableType', useTableType);
// 修改近似商标
const handleEditBrandRecord = (item: any, type = 'com') => {
  editBrandSimilarShow.value = true;
  eidtId.value = item.id;
  useTableType.value = type;
};
const changeRecord = (e: any) => {
  const {
    similarRemark: similarTm,
    oneStatusName: similarTmStatus,
    remarkNumber: remarkNumber,
    ownerName,
    remarkSmallCategoryName: categorySmall,
  } = e;
  const p = {
    id: eidtId.value,
    similarTm,
    remarkNumber,
    ownerName,
    categorySmall,
    similarTmStatus,
  };
  emit('edit', p);
};
const handleMoreTable = (record: SingData) => {
  const { dimensionName, typeName, queryItem } = record;
  DialogTableMoreInfo.show = true;
  if (typeName === '同类目检索情况') {
    DialogTableMoreInfo.title = `同类近似检索详情列表'(${props.title})`;
    DialogTableMoreInfo.columns = columns3B1More as [];
  } else {
    DialogTableMoreInfo.title = '全类别近似检索结果';
    DialogTableMoreInfo.columns = columns3B2More as [];
  }
  DialogTableMoreInfo.data = dataSourceB.value.filter(
    (item: SingData) =>
      item.dimensionName === dimensionName && item.typeName === typeName && item.queryItem === queryItem
  ) as [];
};

const dataSourceB = computed(() => props.data?.trademarkSearchCheckResultList);
const dataSourceB1 = computed(() => {
  const arr = props.data.trademarkSearchCheckResultList.filter(item => item.typeName === '同类目检索情况');
  return getFiveTable(arr);
});
const dataSourceB2 = computed(() => {
  const arr = props.data.trademarkSearchCheckResultList.filter(item => item.typeName === '跨类目检索情况');
  return getFiveTable(arr);
});

const getFiveTable = (arr: QueryTrademarkNameRes['trademarkSearchCheckResultList']) => {
  const result = arr.reduce((acc: QueryTrademarkNameRes['trademarkSearchCheckResultList'], obj: SingData) => {
    const temp: SingData = obj;
    if (obj.dimensionName === '整体检索') {
      const arr1 = arr.filter((item: SingData) => item.dimensionName === '整体检索').slice(0, 5);
      const typeCount = acc.filter((item: SingData) => item.dimensionName === obj.dimensionName).length;
      if (typeCount < 5) {
        acc.push(temp);
        arr1.length === typeCount + 1 ? (temp.isLast = true) : (temp.isLast = false);
      }
    } else {
      temp.isLast = true;
      const arr2 = arr.filter(item => item.dimensionName !== '整体检索');
      if (arr2.length) {
        if (arr2[0].queryItem === obj.queryItem) {
          const arrFirstItem = arr.filter((item: SingData) => item.queryItem === obj.queryItem).slice(0, 5);
          const typeCount = acc.filter((item: SingData) => item.queryItem === obj.queryItem).length;
          if (typeCount < 5) {
            acc.push(temp);
            arrFirstItem.length === typeCount + 1 ? (temp.isLast = true) : (temp.isLast = false);
          }
        } else {
          if (!acc.find(item => item.queryItem === obj.queryItem)) {
            temp.isLast = true;
            acc.push(temp);
          }
        }
      }
    }
    return acc;
  }, []);
  return result;
};
// 合并单元格
const mergeSpan = (
  _: SingData,
  index: number,
  title: keyof SingData,
  data: QueryTrademarkNameRes['trademarkSearchCheckResultList']
) => {
  const resArr = mergeSpanData(title, data);
  const sing = resArr.find(item => item.startIndex === index);
  if (sing) {
    return { rowSpan: sing.spanNum };
  } else {
    return {
      rowSpan: 0,
    };
  }
};

// 合并单元格算法
const mergeSpanData = (title: keyof SingData, data: QueryTrademarkNameRes['trademarkSearchCheckResultList']) => {
  let startIndex = 0;
  let spanNum = 0;

  const result: { startIndex: number; spanNum: number }[] = [];

  // 类型 维度

  let preVal: string | number = '';
  data.forEach((item, index) => {
    const currentVal = item[title];
    // 当前项与前一项相同. 则合并数加1, 第一次需要加2,
    if (preVal === currentVal) {
      spanNum += 1;
      result.push({
        startIndex: index,
        spanNum: 0,
      });
      // 如果是最后一次则插入结果
      if (index === data.length - 1) {
        result.push({
          startIndex,
          spanNum,
        });
      }
    } else {
      // 当前项与前一项不同, 则插入累计结果,
      if (index !== 0) {
        // 插入上一次的结果
        result.push({
          startIndex,
          spanNum,
        });
      }

      startIndex = index;
      spanNum = 1;
      preVal = currentVal;

      // 如果是最后一次则插入结果
      if (index === data.length - 1) {
        result.push({
          startIndex,
          spanNum,
        });
      }
    }
  });
  return result;
};
const columns3B1 = ref<any>([
  {
    title: '检索维度',
    dataIndex: 'dimensionName',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => mergeSpan(_, index, 'dimensionName', dataSourceB1.value),
  },
  {
    title: '检索项',
    dataIndex: 'queryItem',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      return mergeSpan(_, index, 'queryItem', dataSourceB1.value);
      // if (_.dimensionName === '整体检索') {
      //   return mergeSpan(_, index, 'queryItem', dataSourceB1.value);
      // }
    },
  },
  {
    title: '近似商标',
    dataIndex: 'similarTm',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标状态',
    dataIndex: 'similarTmStatus',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  // {
  //   title: '相似度',
  //   dataIndex: 'similarTmSimilarity',
  //   align: 'center',
  //   width: 140,
  //   customCell: (_: SingData, index: number) => {
  //     if (_.remark === '此项完全命中注意风险') {
  //       return {
  //         class: 'cell-bg',
  //       };
  //     }
  //   },
  //   customRender: (p: { text: string }) => p.text + '%',
  // },
  {
    title: '受理号',
    dataIndex: 'remarkNumber',
    align: 'center',
    width: 140,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标申请人',
    dataIndex: 'ownerName',
    ellipsis: true,
    width: 200,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标小类',
    dataIndex: 'categorySmall',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
]);
const columns3B1More = ref<any>([
  {
    title: '检索项',
    dataIndex: 'queryItem',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      return mergeSpan(
        _,
        index,
        'queryItem',
        dataSourceB.value.filter(item => item.queryItem === _.queryItem)
      );
    },
  },
  {
    title: '近似商标',
    dataIndex: 'similarTm',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标状态',
    dataIndex: 'similarTmStatus',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  // {
  //   title: '相似度',
  //   dataIndex: 'similarTmSimilarity',
  //   align: 'center',
  //   width: 140,
  //   customCell: (_: SingData, index: number) => {
  //     if (_.remark === '此项完全命中注意风险') {
  //       return {
  //         class: 'cell-bg',
  //       };
  //     }
  //   },
  //   customRender: (p: { text: string }) => p.text + '%',
  // },
  {
    title: '受理号',
    dataIndex: 'remarkNumber',
    align: 'center',
    width: 140,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标申请人',
    dataIndex: 'ownerName',
    ellipsis: true,
    width: 200,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标小类',
    dataIndex: 'categorySmall',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
]);
const columns3B2 = ref<any>([
  {
    title: '检索维度',
    dataIndex: 'dimensionName',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => mergeSpan(_, index, 'dimensionName', dataSourceB2.value),
  },
  {
    title: '检索项',
    dataIndex: 'queryItem',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      return mergeSpan(_, index, 'queryItem', dataSourceB2.value);
      // if (_.dimensionName === '整体检索') {
      //   return mergeSpan(_, index, 'queryItem', dataSourceB1.value);
      // }
    },
  },
  {
    title: '近似商标',
    dataIndex: 'similarTm',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标状态',
    dataIndex: 'similarTmStatus',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  // {
  //   title: '相似度',
  //   dataIndex: 'similarTmSimilarity',
  //   align: 'center',
  //   width: 140,
  //   customCell: (_: SingData, index: number) => {
  //     if (_.remark === '此项完全命中注意风险') {
  //       return {
  //         class: 'cell-bg',
  //       };
  //     }
  //   },
  //   customRender: (p: { text: string }) => p.text + '%',
  // },
  {
    title: '受理号',
    dataIndex: 'remarkNumber',
    align: 'center',
    width: 140,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标类别',
    dataIndex: 'categoryBig',
    ellipsis: true,
    width: 100,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标申请人',
    dataIndex: 'ownerName',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标小类',
    dataIndex: 'categorySmall',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
]);
const columns3B2More = ref<any>([
  {
    title: '检索项',
    dataIndex: 'queryItem',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      return mergeSpan(
        _,
        index,
        'queryItem',
        dataSourceB.value.filter(item => item.queryItem === _.queryItem)
      );
    },
  },
  {
    title: '近似商标',
    dataIndex: 'similarTm',
    align: 'center',
    width: 200,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标状态',
    dataIndex: 'similarTmStatus',
    align: 'center',
    width: 120,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  // {
  //   title: '相似度',
  //   dataIndex: 'similarTmSimilarity',
  //   align: 'center',
  //   width: 140,
  //   customCell: (_: SingData, index: number) => {
  //     if (_.remark === '此项完全命中注意风险') {
  //       return {
  //         class: 'cell-bg',
  //       };
  //     }
  //   },
  //   customRender: (p: { text: string }) => p.text + '%',
  // },
  {
    title: '受理号',
    dataIndex: 'remarkNumber',
    align: 'center',
    width: 140,
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标类别',
    dataIndex: 'categoryBig',
    ellipsis: true,
    width: 100,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标申请人',
    dataIndex: 'ownerName',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
  {
    title: '近似商标小类',
    dataIndex: 'categorySmall',
    ellipsis: true,
    width: 160,
    align: 'center',
    customCell: (_: SingData, index: number) => {
      if (_.remark === '此项完全命中注意风险') {
        return {
          class: 'cell-bg',
        };
      }
    },
  },
]);
</script>

<style scoped lang="less">
.my-table-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  border: 1px solid #f0f0f0;
  border-bottom: 0;
  background: #fafafa;
  button {
    position: absolute;
    right: 0;
  }
}
.container {
  overflow-x: auto;
  &-wrap {
    padding: 10px 0 20px;
    background-color: #fff;
    min-width: 1240px;
    margin-bottom: 10px;
  }
}
.passing {
  width: 250px;
  height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #f0f0f0;
  margin-right: 16px;
  span {
    flex: 1;
    font-size: larger;
    line-height: 50px;
    height: 100%;
  }
  > span:nth-child(1) {
    background: #fafafa;
    border-right: 1px solid #f0f0f0;
  }
}
.flex {
  display: flex;
}

::v-deep .cell-bg {
  background: rgb(249, 229, 215) !important;
}
::v-deep .ant-table-tbody > tr > td {
  padding: 8px 16px;
}
</style>
