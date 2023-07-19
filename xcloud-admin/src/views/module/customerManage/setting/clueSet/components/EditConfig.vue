<template>
  <a-drawer
    v-model:visible="showDrawer"
    placement="right"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    width="700px"
  >
    <template #title>
      <div class="title-head">
        <span class="text">{{ record.type === 'add' ? '新增自定义规则' : '编辑自定义规则' }}</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>

    <template #footer>
      <a-button style="margin-right: 8px" @click="showDrawer = false">取消</a-button>
      <a-button type="primary" @click="submit()">保存</a-button>
    </template>
    <div class="cont-wrap">
      <div class="cell">
        <div class="cell-title">筛选条件</div>
        <div class="cell-cont">
          <div class="rule-li" v-for="(li, index) of data.ruleList" :key="index">
            <span class="text">{{ index === 0 ? '当' : '或' }}</span>
            <span class="select">
              <a-select size="small" v-model:value="li.brandId" style="width: 100px" placeholder="品牌">
                <a-select-option v-for="(li, index) of brandList" :key="index" :value="li.key">
                  {{ li.value }}
                </a-select-option>
              </a-select>
            </span>
            <span class="text">的</span>
            <span class="select">
              <a-select
                size="small"
                v-model:value="li.maxType"
                style="width: 130px"
                placeholder="请选择"
                @change="changeMaxType($event, li)"
              >
                <a-select-option v-for="(li, index) of ruleTypeList" :key="index" :value="li.key">
                  {{ li.value }}
                </a-select-option>
              </a-select>
            </span>
            <span class="text">属于以下任意</span>
            <span class="select">
              <a-cascader
                v-model:value="li.minType"
                :options="li.options"
                style="width: 150px"
                placeholder="请选择"
                change-on-select
                :fieldNames="{ label: 'value', value: 'key', children: 'children' }"
              />
            </span>
            <span class="btn" @click="addRecord(index)" v-if="record.type === 'add'">插入行</span>
            <span class="btn" @click="deleteRecord(index)" v-if="record.type === 'add' && data.ruleList.length > 1"
              >删除</span
            >
          </div>
        </div>
      </div>
      <div class="cell">
        <div class="cell-title">分配条件</div>
        <div class="cell-cont">
          <div class="title-min">选择员工/部门</div>
          <a-tabs v-model:activeKey="data.fpConditionType" type="card">
            <a-tab-pane :key="1" tab="按员工">
              <div class="search-input">
                <a-select
                  v-model:value="data.userIds"
                  placeholder="请选择"
                  :maxTagCount="1"
                  mode="multiple"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  style="width: 350px"
                  @change="setSelectListIds"
                >
                  <a-select-option v-for="(li, index) of userList" :key="index" :value="li.userId" :label="li.nickName">
                    {{ li.nickName }} —— {{ li.departmentName }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="box-list">
                <div class="box-wrap">
                  <div class="box-hd">
                    <span class="tit">部门</span>
                  </div>
                  <div class="box-bd">
                    <div class="box-li" v-for="(li, index) of departmentList" :key="index">
                      <span
                        class="label"
                        :class="{ active: data.user.departmentId === li.key }"
                        @click="clickDepartment(li)"
                      >
                        {{ li.value }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="box-wrap">
                  <div class="box-hd">
                    <a-checkbox
                      v-model:checked="data.user.selectAll"
                      :indeterminate="data.user.indeterminate"
                      @change="onChangeUserAll"
                    >
                      员工
                    </a-checkbox>
                    <span class="num"> {{ data.user.selectListIds.length }} / {{ data.user.list.length }} </span>
                  </div>
                  <div class="box-bd">
                    <a-checkbox-group
                      v-model:value="data.user.selectListIds"
                      style="width: 100%"
                      @change="onChangeUser"
                    >
                      <div class="box-li" v-for="(li, index) of data.user.list" :key="index">
                        <a-checkbox :value="li.key"> {{ li.value }} </a-checkbox>
                      </div>
                    </a-checkbox-group>
                  </div>
                </div>
                <div class="box-wrap">
                  <div class="box-hd">已选（{{ data.userIds.length }}）</div>
                  <div class="box-bd">
                    <div class="box-li" v-for="(li, index) of userListSelect" :key="index">{{ li.nickName }}</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="按部门">
              <div class="search-input">
                <a-select
                  v-model:value="data.departmentIds"
                  placeholder="请选择"
                  :maxTagCount="1"
                  mode="multiple"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  style="width: 350px"
                  @change="onChangeDepartment"
                >
                  <a-select-option v-for="(li, index) of departmentList" :key="index" :value="li.key" :label="li.value">
                    {{ li.value }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="box-list">
                <div class="box-wrap">
                  <div class="box-hd">
                    <a-checkbox
                      v-model:checked="data.department.selectAll"
                      :indeterminate="data.department.indeterminate"
                      @change="onChangeDepartmentAll"
                    >
                      部门
                    </a-checkbox>
                    <span class="num"> {{ data.departmentIds.length }} / {{ departmentList.length }} </span>
                  </div>
                  <div class="box-bd">
                    <a-checkbox-group
                      v-model:value="data.departmentIds"
                      style="width: 100%"
                      @change="onChangeDepartment"
                    >
                      <div class="box-li" v-for="(li, index) of departmentList" :key="index">
                        <a-checkbox :value="li.key"> {{ li.value }} </a-checkbox>
                      </div>
                    </a-checkbox-group>
                  </div>
                </div>
                <div class="box-wrap">
                  <div class="box-hd">已选（{{ data.departmentIds.length }}）</div>
                  <div class="box-bd">
                    <div class="box-li" v-for="(li, index) of departmentListSelect" :key="index">{{ li.value }}</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="cell">
        <div class="cell-title">分配规则</div>
        <div class="cell-cont">
          <a-radio-group v-model:value="data.fpRule">
            <a-radio :style="{ display: 'flex', height: '30px', lineHeight: '30px' }" :value="1">
              <span> 按照{{ data.fpConditionType === 1 ? '员工' : '部门' }}顺序轮流分配 </span>
              <a-tooltip placement="top">
                <template #title>
                  <div style="font-size: 12px">当有符合以上规则的线索时，将按照顺序自动在所选员工间轮流分配线索</div>
                </template>
                <QuestionCircleOutlined class="text-icon" />
              </a-tooltip>
            </a-radio>
            <a-radio :style="{ display: 'flex', height: '30px', lineHeight: '30px' }" :value="2">
              <span> 按照{{ data.fpConditionType === 1 ? '员工' : '部门' }}线索数量补齐分配 </span>
              <a-tooltip placement="top">
                <template #title>
                  <div style="font-size: 12px">当有符合以上规则的线索时，将优先分配给线索数量最少的员工</div>
                </template>
                <QuestionCircleOutlined class="text-icon" />
              </a-tooltip>
            </a-radio>
          </a-radio-group>
          <div class="cell-input" v-if="data.fpRule === 2">
            上限值 <a-input-number v-model:value="data.fpMaxLead" size="small" :min="0" />
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

//传入参数
const props = defineProps({
  brandList: {
    default: [],
    type: Array<any>,
  },
  ruleTypeList: {
    default: [],
    type: Array<any>,
  },
  userList: {
    default: [],
    type: Array<any>,
  },
  departmentList: {
    default: [],
    type: Array<any>,
  },
  details: {
    default: [],
    type: Array<any>,
  },
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showDrawer = ref(false);
const data: any = reactive({
  formModal: {},
  ruleList: [],
  fpConditionType: 1, //分配条件类型 1按员工 2按部门
  userIds: [], //员工id
  departmentIds: [], //部门id
  fpRule: 1, //分配规则 1.按照员工顺序轮流分配，2.按照员工线索补齐分配
  fpMaxLead: null, //当分配规则==2的时候 需要设置补齐的最大值
  user: {
    departmentId: '',
    list: [],
    selectListIds: [],
    selectAll: false,
    indeterminate: false,
  },
  department: {
    selectAll: false,
    indeterminate: false,
  },
});

const userListSelect = computed(() => {
  return props.userList.filter((v: any) => data.userIds.indexOf(v.userId) !== -1);
});
const departmentListSelect = computed(() => {
  return props.departmentList.filter((v: any) => data.departmentIds.indexOf(v.key) !== -1);
});

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      const record = props.record;
      if (record.type === 'add') {
        data.ruleList = [];
        addRecord(0);
      } else {
        data.ruleList = [
          {
            brandId: record.brandId ?? null,
            maxType: record.filterConditionField ?? null,
            minType: record.filterConditionValues ?? [],
            options: [],
          },
        ];
        if (props.record.filterConditionField) {
          const record = props.ruleTypeList.find((v: any) => v.key === props.record.filterConditionField);
          if (record) {
            data.ruleList[0].options = record.children;
          }
        }
      }
      data.fpConditionType = record.fpConditionType ?? 1;
      data.userIds = record.fpConditionType === 1 ? record.fpConditionValues : [];
      data.departmentIds = record.fpConditionType === 2 ? record.fpConditionValues : [];
      data.fpRule = record.fpRule ?? 1;
      data.fpMaxLead = record.fpMaxLead ?? null;
      if (record.fpConditionType === 1) {
        clickDepartment(props.departmentList[0]);
      } else {
        onChangeDepartment();
      }
    });
  }
});

//插入行
const addRecord = (index: number) => {
  data.ruleList.splice(index + 1, 0, {
    brandId: null,
    maxType: null,
    minType: [],
    options: [],
  });
};

//删除行
const deleteRecord = (index: number) => {
  data.ruleList.splice(index, 1);
};

// 保存
const submit = () => {
  const oldList = JSON.parse(JSON.stringify(props.details));
  const index = oldList.findIndex(
    (v: any) =>
      v.brandId === props.record.brandId &&
      v.filterConditionField === props.record.filterConditionField &&
      String(v.filterConditionValues) === String(props.record.filterConditionValues)
  );
  if (index !== -1) {
    oldList.splice(index, 1);
  }

  for (const i in data.ruleList) {
    const li = data.ruleList[i];
    if (!li.brandId) {
      message.error('请选择筛选条件选项');
      return false;
    }
    if (!li.maxType) {
      message.error('请选择筛选条件选项');
      return false;
    }
    if (!li.minType) {
      message.error('请选择筛选条件选项');
      return false;
    }
    for (const sub of oldList) {
      if (
        sub.brandId === li.brandId &&
        sub.filterConditionField === li.maxType &&
        String(sub.filterConditionValues) === String(li.minType)
      ) {
        message.error(`第 ${Number(i) + 1} 条筛选条件重复`);
        return false;
      }
    }

    if (index !== -1) {
      oldList.splice(index, 0, {
        brandId: li.brandId,
        filterConditionField: li.maxType,
        filterConditionValues: li.minType,
        fpConditionType: data.fpConditionType,
        fpConditionValues: data.fpConditionType === 1 ? data.userIds : data.departmentIds,
        fpRule: data.fpRule,
        fpMaxLead: data.fpMaxLead,
      });
    } else {
      oldList.push({
        brandId: li.brandId,
        filterConditionField: li.maxType,
        filterConditionValues: li.minType,
        fpConditionType: data.fpConditionType,
        fpConditionValues: data.fpConditionType === 1 ? data.userIds : data.departmentIds,
        fpRule: data.fpRule,
        fpMaxLead: data.fpMaxLead,
      });
    }
  }
  if (data.fpConditionType === 1 && data.userIds.length === 0) {
    message.error('请选择人员');
    return false;
  }
  if (data.fpConditionType === 2 && data.departmentIds.length === 0) {
    message.error('请选择部门');
    return false;
  }
  showDrawer.value = false;
  emit('submit', oldList);
};

// 改变大类
const changeMaxType = (val: any, li: any) => {
  li.minType = [];
  const record = props.ruleTypeList.find((v: { key: string }) => v.key === val);
  if (record) {
    li.options = record.children;
  }
};

// 选择部门
const clickDepartment = (li: { key: string; children: Array<any> }) => {
  data.user.departmentId = li.key;
  data.user.list = li.children;
  setSelectListIds();
};

// 改变员工全选
const onChangeUserAll = (e: any) => {
  if (e.target.checked) {
    data.user.indeterminate = false;
    data.user.selectListIds = data.user.list.map((v: { key: string }) => v.key);
  } else {
    data.user.indeterminate = false;
    data.user.selectListIds = [];
  }
  setUserIds();
};

// 改变员工
const onChangeUser = () => {
  const arr = data.user.selectListIds;
  if (arr.length === 0) {
    data.user.selectAll = false;
    data.user.indeterminate = false;
  } else if (arr.length === data.user.list.length) {
    data.user.selectAll = true;
    data.user.indeterminate = false;
  } else {
    data.user.selectAll = false;
    data.user.indeterminate = true;
  }
  setUserIds();
};

//设置已选部门员工
const setSelectListIds = () => {
  const arr = data.user.list.map((v: { key: string }) => v.key);
  data.user.selectListIds = data.userIds.filter((v: string) => arr.indexOf(v) !== -1);
  onChangeUser();
};

//设置已选所有员工
const setUserIds = () => {
  const arr = data.user.list.map((v: { key: string }) => v.key);
  data.userIds = data.userIds.filter((v: string) => arr.indexOf(v) === -1);
  data.userIds = data.userIds.concat(data.user.selectListIds);
};

// 改变部门全选
const onChangeDepartmentAll = (e: any) => {
  if (e.target.checked) {
    data.department.indeterminate = false;
    data.departmentIds = props.departmentList.map((v: { key: string }) => v.key);
  } else {
    data.department.indeterminate = false;
    data.departmentIds = [];
  }
};

// 改变部门
const onChangeDepartment = () => {
  const arr = data.departmentIds;
  if (arr.length === 0) {
    data.department.selectAll = false;
    data.department.indeterminate = false;
  } else if (arr.length === props.departmentList.length) {
    data.department.selectAll = true;
    data.department.indeterminate = false;
  } else {
    data.department.selectAll = false;
    data.department.indeterminate = true;
  }
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
.cont-wrap {
  .cell {
    margin-bottom: 14px;
    .cell-title {
      font-size: 14px;
      font-weight: bold;
      line-height: 30px;
    }
    .cell-cont {
      .rule-li {
        line-height: 30px;
        .text-tips {
          margin: 0 4px;
          font-weight: bold;
          color: #1890ff;
        }
        .text {
          margin: 0 4px;
        }
        .select {
          margin: 0 5px;
        }
        .btn {
          margin: 0 4px;
          color: #1890ff;
          cursor: pointer;
        }
      }
      .title-min {
        line-height: 24px;
        margin-bottom: 6px;
      }
      .search-input {
        margin-bottom: 10px;
      }
      .box-list {
        overflow: hidden;
        .box-wrap {
          float: left;
          margin-right: 20px;
          border: 1px solid rgb(234, 237, 244);
          width: 180px;
          .box-hd {
            line-height: 36px;
            background-color: rgb(234, 237, 244);
            padding: 0 10px;
            .tit {
              margin-left: 6px;
            }
            .num {
              float: right;
            }
          }
          .box-bd {
            line-height: 30px;
            padding: 0 10px;
            height: 240px;
            overflow-y: auto;
            .box-li {
              .label {
                margin-left: 6px;
                cursor: pointer;
              }
              .active {
                color: #1890ff;
              }
            }
          }
        }
      }
      .text-icon {
        color: #f0b955;
        margin: 0 4px;
      }
      .cell-input {
        padding: 6px 20px;
      }
    }
  }
}
</style>
