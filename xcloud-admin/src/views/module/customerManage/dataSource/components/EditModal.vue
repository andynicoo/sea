<template>
  <a-modal
    :title="record.customerDataSourceId ? '编辑数据源' : '新增数据源'"
    width="1200px"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">基础信息</span>
        </div>
        <a-row>
          <a-col :span="12">
            <div class="hd"><span style="color: red; font-weight: bold">*</span> 数据源：</div>
            <div class="bd">
              <a-input v-model:value="data.formModal.platformName" placeholder="请输入" />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="hd"><span style="color: red; font-weight: bold">*</span> 数据源标识ID：</div>
            <div class="bd">
              <a-input
                v-model:value="data.formModal.platform"
                :disabled="record.customerDataSourceId !== undefined"
                placeholder="请输入"
              />
            </div>
          </a-col>

          <a-col :span="12">
            <div class="hd">说明：</div>
            <div class="bd">
              <a-textarea v-model:value="data.formModal.explainRemarks" placeholder="请输入" allow-clear />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="hd">备注：</div>
            <div class="bd">
              <a-textarea v-model:value="data.formModal.remarks" placeholder="请输入" allow-clear />
            </div>
          </a-col>
          <a-col :span="12">
            <div class="hd"><span style="color: red; font-weight: bold">*</span> 客户来源：</div>
            <div class="bd">
              <a-cascader
                v-model:value="data.formModal.sourceArr"
                :options="data.sourceData"
                placeholder="请选择"
                :fieldNames="{
                  label: 'dictValue',
                  value: 'dictKey',
                  children: 'children',
                }"
                :max-tag-count="1"
                allowClear
                showSearch
              ></a-cascader>
            </div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text"> 线索基础属性 </span>
        </div>
        <a-row>
          <a-col :span="8">
            <div class="hd"><span style="color: red">*</span>所属企业：</div>
            <div class="bd">
              <a-select
                v-model:value="data.formModal.enterpriseId"
                placeholder="请选择"
                allowClear
                showSearch
                optionFilterProp="label"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(li, index) of data.enterpriseList"
                  :key="index"
                  :value="li.id"
                  :label="li.name"
                >
                  {{ li.name }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="hd"><span style="color: red">*</span>线索状态：</div>
            <div class="bd">
              <a-select
                v-model:value="data.formModal.leadFollowStatus"
                placeholder="请选择"
                allowClear
                showSearch
                optionFilterProp="label"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(li, index) of data.leadFollowStatusList"
                  :key="index"
                  :value="li.key"
                  :label="li.value"
                >
                  {{ li.value }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col :span="8"> </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">授权API </span>
          <span class="cell-title-tips">授权API，可选择创建时自动生成，生成后外部应用可直接使用API密钥调用开放API</span>
        </div>
        <a-row>
          <a-col :span="24">
            <div class="hd">授权API：</div>
            <div class="bd">
              <a-radio-group
                v-model:value="data.formModal.secretFlag"
                :disabled="props.record.secret != null && props.record.secret != '' && props.record.secret != undefined"
              >
                <a-radio :value="1">自动生成</a-radio>
                <a-radio :value="0">手动生成（需到管理列表页手动生成）</a-radio>
              </a-radio-group>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="hd">API状态：</div>
            <div class="bd">
              <a-radio-group v-model:value="data.formModal.status">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">数据推送CRM </span>
        </div>
        <a-row>
          <a-col :span="24">
            <div class="hd">推送CRM开关：</div>
            <div class="bd">
              <a-radio-group v-model:value="data.formModal.pushCrm">
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="hd">推送励销云开关：</div>
            <div class="bd">
              <a-radio-group v-model:value="data.formModal.pushLxy">
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { getEnterpriseSelect, getAllUsers, findDictByCodeList, leadFollowStatusList } from '@/api/base/basicsData';
import { createCustomerConfigSource, updateCustomerConfigSource } from '@/api/customerManage/dataSource';

const visible = ref<boolean>(false);
//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const data: any = reactive({
  formModal: {},
  sourceData: [], //客户来源数据
  enterpriseList: [],
  leadFollowStatusList: [], //线索状态列表
});

watch(visible, newVal => {
  if (newVal) {
    getLeadSourceLargeDataFun();
    getEnterpriseSelectFun();
    getLeadFollowStatusList();
    nextTick(() => {
      data.formModal = {
        platformName: props.record.platformName || null,
        platform: props.record.platform || null,
        explainRemarks: props.record.explainRemarks || null,
        remarks: props.record.remarks || null,
        sourceArr: props.record.sourceSmall ? [String(props.record.sourceLarge), String(props.record.sourceSmall)] : [],
        enterpriseId: props.record.enterpriseId || null,
        leadFollowStatus: String(props.record.leadFollowStatus || ''),
        secretFlag: 1,
        status: props.record.status || 0,
        pushCrm: props.record.pushCrm || 0,
        pushLxy: props.record.pushLxy || 0,
      };
      data.formModal.secretFlag = props.record.secret ? 1 : 0;
    });
  } else {
    data.formModal = {};
  }
});

//提交
const submit = () => {
  if (!data.formModal.platformName) {
    message.error('请输入数据源');
    return false;
  }
  if (!data.formModal.platform) {
    message.error('请输入数据源标识ID');
    return false;
  }
  if (data.formModal.sourceArr.length != 2) {
    message.error('请选择客户来源');
    return false;
  }
  if (!data.formModal.enterpriseId) {
    message.error('请选择所属企业');
    return false;
  }

  if (data.formModal.sourceArr && data.formModal.sourceArr.length === 2) {
    data.formModal.sourceLarge = data.formModal.sourceArr[0];
    data.formModal.sourceSmall = data.formModal.sourceArr[1];
  }

  if (props.record.customerDataSourceId) {
    data.formModal.customerDataSourceId = props.record.customerDataSourceId;
    updateCustomerConfigSource(data.formModal).then((res: any) => {
      message.success('操作成功');
      visible.value = false;
      emit('submit');
    });
  } else {
    createCustomerConfigSource(data.formModal).then((res: any) => {
      message.success('操作成功');
      visible.value = false;
      emit('submit');
    });
  }
};

//获取客户来源 大类小类的二级联动
const getLeadSourceLargeDataFun = () => {
  findDictByCodeList({
    code: 'leadSourceLarge',
  }).then((res: any) => {
    data.sourceData = res || [];
  });
};

//获取所属企业
const getEnterpriseSelectFun = () => {
  getEnterpriseSelect().then((res: any) => {
    data.enterpriseList = res || [];
  });
};
//获取线索状态
const getLeadFollowStatusList = () => {
  leadFollowStatusList().then((res: any) => {
    data.leadFollowStatusList = res || [];
  });
};

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 40px;
  .cell-wrap {
    border: 1px solid #eee;
    padding: 18px;
    margin-top: 15px;
    .cell-title {
      margin-bottom: 15px;
      .text {
        position: relative;
        line-height: 20px;
        font-size: 14px;
        color: #666;
        padding-left: 15px;
      }
      .text::before {
        position: absolute;
        left: 0;
        top: 3px;
        width: 2.5px;
        height: 14px;
        content: ' ';
        background-color: #1890ff;
      }
      .cell-title-tips {
        color: red;
        margin-left: 10px;
        font-size: 12px;
      }
    }
    .ant-col {
      display: flex;
      font-size: 14px;
      line-height: 32px;
      margin: 10px 0;
      .hd {
        width: 150px;
        text-align: right;
        color: #999;
      }
      .bd {
        flex: 1;
        color: #666;
      }
    }
  }
}
</style>
