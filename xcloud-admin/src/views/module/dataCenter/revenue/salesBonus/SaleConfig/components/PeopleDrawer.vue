<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">人数维度</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="wrap">
      <div class="tips-wrap" :class="{ open: openFlag === true }">
        <div class="tips-icon">
          <img src="@/assets/img/salesBonus/tips-icon.svg" />
        </div>
        <div class="tips-text">
          <p>1.参与活动人员必须存在中台账号</p>
          <p>2.工号禁止重复填入</p>
          <p>3.导入重复工号将会覆盖原有数据</p>
          <p>4.增减人员或修改倍数将严重影响计算结果，请谨慎操作</p>
        </div>
        <div class="tips-btn">
          <span @click="openFlag = !openFlag"> {{ openFlag ? '收起' : '展开' }} </span>
        </div>
      </div>
      <div class="import-wrap">
        <a-button type="primary" @click="importUser()">导入人员</a-button>
      </div>
      <div class="table-wrap">
        <a-table
          size="small"
          :columns="columns"
          :data-source="list"
          :pagination="{
          position: ['bottomRight'],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total: number) => `共 ${total} 条`,
      }"
        >
          <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
            <div style="padding: 8px">
              <a-input
                ref="searchInput"
                :placeholder="`搜索 ${column.title}`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="(e:any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-button
                type="primary"
                size="small"
                style="width: 90px; margin-right: 8px"
                @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
              >
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)"> 重置 </a-button>
            </div>
          </template>
          <template #customFilterIcon="{ filtered }">
            <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
          </template>

          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'name'">
              <a-select
                size="small"
                v-model:value="record.badgeNumber"
                placeholder="请选择"
                allowClear
                showSearch
                optionFilterProp="label"
                style="width: 100%"
                @change="changeUser($event, record)"
              >
                <a-select-option
                  v-for="(li, index) of userList"
                  :key="index"
                  :value="li.workNum"
                  :label="li.nickName.split('_')[0]"
                  :disabled="selectList.indexOf(li.workNum) !== -1"
                >
                  {{ li.nickName.split('_')[0] }}
                </a-select-option>
              </a-select>
            </template>
            <template v-if="column.dataIndex === 'badgeNumber'"> {{ record.badgeNumber || '-' }} </template>
            <template v-if="column.dataIndex === 'multiple'">
              <a-input-number
                v-model:value="record.multiple"
                placeholder="请输入"
                :min="0"
                :bordered="false"
                :formatter="(value: any) => `${value}%`"
                :parser="(value: any) => value.replace('%', '')"
              />
            </template>
            <template v-if="column.dataIndex === 'teamTypeName'">
              <a-select size="small" v-model:value="record.teamTypeName" placeholder="请选择" style="width: 90px">
                <a-select-option value="复购">复购</a-select-option>
                <a-select-option value="首购">首购</a-select-option>
              </a-select>
            </template>

            <template v-if="column.dataIndex === 'operation'">
              <span class="span-btn" @click="addRecord()">插入行</span>
              <span class="span-btn" v-if="list.length > 1" @click="removeRecord(record)">删除</span>
            </template>
          </template>
        </a-table>
      </div>

      <div class="btn-wrap">
        <a-space :size="24">
          <a-button @click="showDrawer = false">取消</a-button>
          <a-button type="primary" @click="submit()">完成</a-button>
        </a-space>
      </div>
    </div>
  </a-drawer>
  <BatchImportModal ref="batchImportModal" @submit="importUserSubmit" />
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue';
import BatchImportModal from './BatchImportModal.vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getAllUsers } from '@/api/base/basicsData';
import { SearchOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  list: {
    default: [],
  },
});
const selectList = computed(() => list.value.map((v: any) => v.badgeNumber));
const emit = defineEmits(['submit']);
const openFlag = ref(true);
const showDrawer = ref(false);
const searchInput: Ref = ref(null);
const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const columns = ref([
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) => (record.name || '').toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: '工号',
    dataIndex: 'badgeNumber',
    width: 100,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) => record.badgeNumber.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  { title: '业绩计算倍数', dataIndex: 'multiple', width: 100 },
  {
    title: '是否为复购',
    dataIndex: 'teamTypeName',
    width: 100,
    customFilterDropdown: true,
    onFilter: (value: any, record: any) => record.teamTypeName.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  { title: '操作', dataIndex: 'operation', width: 120 },
]);
const list: any = ref([]);
const userList: any = ref([]);

watch(showDrawer, newVal => {
  if (newVal) {
    getAllUsersFun();
    nextTick(() => {
      if (props.list.length > 0) {
        list.value = JSON.parse(JSON.stringify(props.list));
      } else {
        list.value = [
          {
            name: null,
            badgeNumber: null,
            multiple: null,
            teamTypeName: null,
          },
        ];
      }
    });
  }
});

//筛选提交
const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};

//筛选重置
const handleReset = (clearFilters: any) => {
  clearFilters({ confirm: true });
  state.searchText = '';
};

//导入人员
const batchImportModal: Ref = ref(null);
const importUser = () => {
  batchImportModal.value.showModal = true;
};

//导入人员成功回调
const importUserSubmit = (arr: any) => {
  for (const li of arr) {
    const index = list.value.findIndex((v: any) => v.badgeNumber === li.badgeNumber);
    if (index === -1) {
      list.value.push(li);
    } else {
      list.value.splice(index, 1, li);
    }
  }
};

//选择人员
const changeUser = (val: any, record: any) => {
  const user = userList.value.find((v: any) => v.workNum === val);
  record.name = user.nickName ? user.nickName.split('_')[0] : null;
};

//插入行
const addRecord = () => {
  list.value.push({
    name: null,
    badgeNumber: null,
    multiple: null,
    teamTypeName: null,
  });
};

//删除
const removeRecord = (record: any) => {
  const index = list.value.findIndex((v: any) => v.badgeNumber === record.badgeNumber);
  list.value.splice(index, 1);
};

//获取人员
const getAllUsersFun = () => {
  getAllUsers().then((res: any) => {
    userList.value = (res || []).filter((v: { status: number }) => v.status === 1);
  });
};

//完成
const submit = () => {
  for (const li of list.value) {
    if (!li.badgeNumber) {
      message.error('请选择人员');
      return false;
    }
    if (!li.multiple) {
      message.error('请输入倍数');
      return false;
    }
    if (!li.teamTypeName) {
      message.error('请选择是否为复购');
      return false;
    }
  }

  emit('submit', {
    keyStr: 'personnelDimensionList',
    value: list.value,
  });
  showDrawer.value = false;
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
.wrap {
  padding: 0 16px 0 18px;
  .tips-wrap {
    display: flex;
    padding: 12px 16px;
    background-color: #eef9ff;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-bottom: 20px;
    .tips-icon {
      width: 24px;
      margin-right: 6px;
    }
    .tips-text {
      flex: 1;
      font-size: 12px;
      color: #999;
      p {
        margin-bottom: 6px;
      }
    }
    .tips-btn {
      width: 50px;
      font-size: 12px;
      color: #1890ff;
      text-align: center;
      span {
        cursor: pointer;
      }
    }
  }
  .tips-wrap.open {
    max-height: 200px;
  }
  .import-wrap {
    margin-bottom: 20px;
    text-align: right;
  }
  .table-wrap {
    margin-bottom: 30px;
    .span-btn {
      font-size: 12px;
      color: #1890ff;
      padding: 0 5px;
      font-weight: 400;
      cursor: pointer;
    }
    &:deep(.ant-table-pagination.ant-pagination) {
      margin: 28px 0 16px;
    }
  }
  .btn-wrap {
    text-align: right;
  }
}
</style>
