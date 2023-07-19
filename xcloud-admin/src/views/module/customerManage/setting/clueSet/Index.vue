<template>
  <div class="nav-wrap">
    <div class="nav-li" :class="{ active: formModal.flagAutomatic === 1 }" @click="formModal.flagAutomatic = 1">
      使用自定义规则自动分配
    </div>
    <div class="nav-li" :class="{ active: formModal.flagAutomatic === 2 }" @click="formModal.flagAutomatic = 2">
      使用手动分配
    </div>
    <div class="opt">
      <span class="opt-btn" @click="openVersion()"> <FieldTimeOutlined class="icon" />历史版本 </span>
    </div>
  </div>
  <div class="cont-wrap">
    <template v-if="formModal.flagAutomatic === 1">
      <div class="tips-wrap">
        <div class="tip-li">
          <ExclamationCircleOutlined style="color: #1890ff" />
          线索分配将按照规则顺序依次执行，如果线索符合前列规则已经分配，则不会再执行后续的分配规则
        </div>
      </div>
      <div class="btn-cell">
        <a-button class="btn" type="primary" @click="openEditConfig({ type: 'add' })">新增</a-button>
      </div>
      <div class="config-list">
        <div class="config-li" v-for="(li, index) of formModal.details" :key="index">
          <div class="num-label">{{ index + 1 }}</div>
          <div class="cont">
            <div class="t1">
              <span class="fw">符合</span>
              <span>
                <a-select
                  size="small"
                  v-model:value="li.brandId"
                  style="width: 100px; margin: 0 6px"
                  placeholder="请选择"
                  disabled
                >
                  <a-select-option v-for="(li, index) of data.brandList" :key="index" :value="li.key">
                    {{ li.value }}
                  </a-select-option>
                </a-select>
              </span>
              <span>
                <a-select
                  size="small"
                  v-model:value="li.filterConditionField"
                  style="width: 130px; margin: 0 6px"
                  placeholder="请选择"
                  disabled
                >
                  <a-select-option v-for="(li, index) of data.ruleTypeList" :key="index" :value="li.key">
                    {{ li.value }}
                  </a-select-option>
                </a-select>
              </span>
              <span>属于</span>
              <span>
                <a-cascader
                  v-model:value="li.filterConditionValues"
                  :options="getOptions(li.filterConditionField)"
                  style="width: 150px; margin: 0 6px"
                  placeholder="请选择"
                  change-on-select
                  disabled
                  :fieldNames="{ label: 'value', value: 'key', children: 'children' }"
                />
              </span>
            </div>
            <div class="t2">
              <div class="flex1 line2">
                负责的{{ li.fpConditionType === 1 ? '员工' : '部门' }}：
                <a-tooltip placement="top">
                  <template #title>
                    <div style="font-size: 12px">{{ listArrFilter(li) }}</div>
                  </template>
                  {{ listArrFilter(li) }}
                </a-tooltip>
              </div>
              <div class="flex1">分配规则：{{ li.fpRule === 1 ? '按照员工顺序轮流分配' : '按照员工线索补齐分配' }}</div>
            </div>
          </div>
          <div class="other">
            <span class="btn" @click="openEditConfig(li)">编辑</span>
            <span class="btn2" @click="delectConfig(index)">删除</span>
          </div>
        </div>
      </div>
      <div class="checked-cell">
        <a-checkbox v-model:checked="formModal.flagDistribution">
          开启后，若存在均不符合上述规则的线索统一分配给
        </a-checkbox>
        <a-select
          v-model:value="formModal.distributionUserId"
          placeholder="请选择"
          allowClear
          showSearch
          optionFilterProp="label"
          style="width: 250px"
          :dropdownMatchSelectWidth="300"
        >
          <a-select-option v-for="(li, index) of data.userList" :key="index" :value="li.userId" :label="li.nickName">
            {{ li.nickName }} —— {{ li.departmentName }}
          </a-select-option>
        </a-select>
      </div>
      <div class="checked-cell">
        <a-checkbox v-model:checked="formModal.flagPushDd">开启后，新增分配消息以钉钉卡片方式通知对应跟进人</a-checkbox>
      </div>
    </template>
    <template v-else-if="formModal.flagAutomatic === 2">
      <div class="cell-tips">
        <div class="title">使用手动分配</div>
        <div class="tips">无需规则，员工可直接选择客户进行分配</div>
      </div>
    </template>
  </div>

  <div class="bottom-btn">
    <a-button type="primary" v-if="formModalCopy !== JSON.stringify(formModal)" @click="submit()">
      保存并使用此分配规则
    </a-button>
    <a-button type="primary" v-else disabled>正在使用此分配规则</a-button>
  </div>

  <EditConfig
    ref="editConfig"
    :brandList="data.brandList"
    :ruleTypeList="data.ruleTypeList"
    :userList="data.userList"
    :departmentList="data.departmentList"
    :details="formModal.details"
    :record="data.record"
    @submit="submitParams"
  />
  <VersionListDrawer ref="versionListDrawer" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue';
import { FieldTimeOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import EditConfig from './components/EditConfig.vue';
import VersionListDrawer from './components/VersionListDrawer.vue';
import { getConfigRule, addConfigRule, getBrandList, ruleFilterList } from '@/api/customerManage/clueSet';
import { getAllUsers, getDepartmentSelect } from '@/api/base/basicsData';
import { message, Modal } from 'ant-design-vue';

const formModal: any = ref({
  flagAutomatic: 1,
  flagDistribution: false,
  distributionUserId: null,
  flagPushDd: false,
  details: [],
});
const formModalCopy = ref('');
const data: any = reactive({
  record: {},
  brandList: [],
  ruleTypeList: [],
  userList: [],
  departmentList: [],
});

onMounted(() => {
  const p = new Promise((resolve, reject) => {
    resolve(true);
  });
  p.then(() => {
    getBrandListFun();
  })
    .then(() => {
      getRuleFilterList();
    })
    .then(() => {
      getAllUsersFun();
    })
    .then(() => {
      getDepartmentSelectFun();
    })
    .then(() => {
      getConfigRuleFun();
    });
});

//历史版本
const versionListDrawer: Ref = ref(null);
const openVersion = () => {
  versionListDrawer.value.showDrawer = true;
};

//新增/编辑
const editConfig: Ref = ref(null);
const openEditConfig = (record: any) => {
  data.record = record;
  editConfig.value.showDrawer = true;
};

//删除
const delectConfig = (index: number) => {
  Modal.confirm({
    title: '提示',
    content: '是否确认删除？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise<void>((resolve, reject) => {
        console.log(3432);
        formModal.value.details.splice(index, 1);
        resolve();
      });
    },
  });
};

//保存提交
const submitParams = (p: any) => {
  formModal.value.details = p;
};

// 保存
const submit = () => {
  addConfigRule(formModal.value).then((res: any) => {
    message.success('操作成功');
    formModalCopy.value = JSON.stringify(formModal.value);
  });
};

// 查询使用的规则
const getConfigRuleFun = () => {
  getConfigRule({}).then((res: any) => {
    formModal.value.flagAutomatic = res.flagAutomatic ?? 1; //1自动 2手动
    formModal.value.flagDistribution = res.flagDistribution ?? false; //是否开启不满足分配 1分配 0不分配
    formModal.value.distributionUserId = res.distributionUserId || null; //开启分配后，分配的人的用户ID
    formModal.value.flagPushDd = res.flagPushDd ?? false; //是否通知钉钉消息 1通知 0不通
    formModal.value.details = res.details || []; //详情
    formModalCopy.value = JSON.stringify(formModal.value);
  });
};

//负责的部门人员过滤
const listArrFilter = (li: any) => {
  let res = [];
  if (li.fpConditionType === 1) {
    res = data.userList.filter((v: { userId: string }) => li.fpConditionValues.indexOf(v.userId) !== -1);
    res = res.map((v: { nickName: string }) => v.nickName).join('、');
  } else {
    res = data.departmentList.filter((v: { key: string }) => li.fpConditionValues.indexOf(v.key) !== -1);
    res = res.map((v: { value: string }) => v.value).join('、');
  }
  return res;
};

//类别 options
const getOptions = (key: string) => {
  const record = data.ruleTypeList.find((v: { key: string }) => v.key === key);
  if (record) {
    return record.children;
  }
};

//获取 品牌
const getBrandListFun = () => {
  getBrandList().then((res: any) => {
    data.brandList = res || [];
  });
};

// 规则选项下拉框
const getRuleFilterList = () => {
  ruleFilterList({}).then((res: any) => {
    data.ruleTypeList = res || [];
  });
};

//获取 人员
const getAllUsersFun = () => {
  getAllUsers().then((res: any) => {
    data.userList = (res || []).filter((v: { status: number }) => v.status === 1);
  });
};

// 部门选择下拉框
const getDepartmentSelectFun = () => {
  getDepartmentSelect({
    status: 1,
  }).then((res: any) => {
    data.departmentList = res || [];
  });
};
</script>

<style scoped lang="less">
.nav-wrap {
  display: flex;
  padding: 10px 20px;
  background-color: #fff;
  margin-bottom: 10px;
  .nav-li {
    width: 220px;
    height: 76px;
    line-height: 76px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-right: 30px;
    cursor: pointer;
  }
  .opt {
    flex: 1;
    .opt-btn {
      float: right;
      margin: 10px;
      cursor: pointer;
      line-height: 24px;
      font-size: 16px;
      color: #1890ff;
      .icon {
        font-size: 18px;
        float: left;
        margin: 4px;
      }
    }
  }
  .nav-li.active {
    color: #1890ff;
    border: 1px solid #1890ff;
  }
}
.cont-wrap {
  padding: 10px 20px;
  background-color: #fff;
  .tips-wrap {
    background-color: rgb(238 249 255);
    padding: 20px;
    margin-bottom: 10px;
    .tip-li {
      line-height: 30px;
    }
  }
  .btn-cell {
    margin-bottom: 10px;
    .btn {
      width: 120px;
    }
  }
  .config-list {
    background-color: rgb(245, 247, 249);
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    .config-li {
      display: flex;
      margin-bottom: 15px;
      .num-label {
        width: 30px;
        text-align: center;
        line-height: 100px;
      }
      .cont {
        width: 700px;
        margin-left: 20px;
        background-color: #fff;
        padding: 20px 18px;
        .t1 {
          font-size: 15px;
          line-height: 30px;
          margin-bottom: 10px;
          .fw {
            font-weight: bold;
          }
        }
        .t2 {
          font-size: 14px;
          display: flex;
          .flex1 {
            flex: 1;
            margin-right: 20px;
          }
          .line2 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      .other {
        flex: 1;
        padding-top: 40px;
        margin-left: 20px;
        .btn {
          cursor: pointer;
          color: #1890ff;
        }
        .btn2 {
          cursor: pointer;
          color: red;
          margin-left: 10px;
        }
      }
    }
  }
  .checked-cell {
    background-color: rgb(245, 247, 249);
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
  }
  .cell-tips {
    padding: 20px 40px;
    .title {
      font-size: 16px;
    }
  }
}
.bottom-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
</style>
