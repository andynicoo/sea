<template>
  <div class="service-main">
    <div class="tree">
      <!-- v-model:expandedKeys="expandedKeys" -->
      <a-tree
        v-model:selectedKeys="selectedKeys"
        v-if="treeData.length"
        defaultExpandAll
        :tree-data="treeData"
        :field-names="fieldNames"
      >
      </a-tree>
    </div>
    <div class="config-content">
      <a-radio-group v-model:value="currentNode" class="mb-32" @change="changeCurrentNode">
        <a-radio-button v-for="item in tabs" :value="item.nodeCode" :key="item.nodeCode"
          >{{ item.nodeName }}
          <svg
            style="margin-left: 4px"
            v-if="formLoad.configObj[item.nodeCode]"
            focusable="false"
            data-icon="check-circle"
            width="1em"
            height="1em"
            fill="#52c41A"
            viewBox="64 64 896 896"
          >
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
            ></path>
          </svg>
        </a-radio-button>
      </a-radio-group>

      <a-button type="primary" style="float: right"
        ><a
          target="_blank"
          href="https://alidocs.dingtalk.com/i/nodes/AY39rGpMPmeVNxRPgvq08OZkXKnaoNQ7?iframeQuery=sheet_range%3Dkgqie6hm_13_0_1_4"
          >「预览消息模板」</a
        ></a-button
      >

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">节点到达提醒</span>
          <span class="extra-font">开启后到达 该节点时会进行提醒</span>
        </template>

        <p>
          <span class="label-font">短信：</span> <span class="gray-font">{{ form.arriveSms ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.arriveSms"
            :loading="formLoad.arriveSms"
            @click="changeConfig($event, 'arriveSms')"
          />

          <span class="label-font ml-60">客户端：</span>
          <span class="gray-font">{{ form.arriveClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.arriveClient"
            :loading="formLoad.arriveClient"
            @click="changeConfig($event, 'arriveClient')"
          />
        </p>
      </a-card>

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">节点超时提醒</span>
          <span class="extra-font">该节点超时未处理时会进行提醒，默认当天9点进行推送</span>
        </template>

        <p>
          <span class="label-font">超时时间：</span>
          <a-input-number
            :precision="0"
            v-model:value="form.num1"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          <a-input-number
            :precision="0"
            v-model:value="form.num2"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          <a-input-number
            :precision="0"
            v-model:value="form.num3"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          &nbsp; &nbsp; 天 &nbsp; &nbsp;
          <a-button type="link" v-if="formLoad.disabled" @click="formLoad.disabled = false">设置</a-button>
          <a-button type="link" v-if="!formLoad.disabled" @click="saveTimeOut">保存</a-button>
          <a-button type="link" v-if="!formLoad.disabled" @click="cancelTimeOut">取消</a-button>

          <span class="label-font ml-60">短信：</span>
          <span class="gray-font">{{ form.overtimeSms ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overtimeSms"
            :loading="formLoad.overtimeSms"
            @click="changeConfig($event, 'overtimeSms')"
          />

          <span class="label-font ml-60">客户端：</span>
          <span class="gray-font">{{ form.overtimeClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overtimeClient"
            :loading="formLoad.overtimeClient"
            @click="changeConfig($event, 'overtimeClient')"
          />
        </p>

        <p class="mt-32">
          <span>内部员工：</span> <span class="gray-font">{{ form.overtimeEmployee ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overtimeEmployee"
            :loading="formLoad.overtimeEmployee"
            @click="changeConfig($event, 'overtimeEmployee')"
          />

          <span v-if="form.insideEmployee"
            >会给
            {{
              form.insideEmployee == 'ORDER_ATTRIBUTOR'
                ? '订单归属人, '
                : form.insideEmployee == 'WORKORDER_HANDLE'
                ? '工单处理人, '
                : '订单归属人, 工单处理人'
            }}
            发送待办消息
          </span>
        </p>
      </a-card>

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">节点驳回提醒</span>
          <span class="extra-font">开启后 驳回到该节点时会进行站内提醒</span>
        </template>

        <p>
          <span>客户端：</span> <span class="gray-font">{{ form.rejectClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.rejectClient"
            :loading="formLoad.rejectClient"
            @click="changeConfig($event, 'rejectClient')"
          />
        </p>
      </a-card>

      <p class="mb-32">操作记录</p>
      <div class="record-content">
        <a-timeline>
          <a-timeline-item v-for="item in records" :key="item.id">
            <span class="record-time">{{ item.createTime }}</span> <span> {{ item.content }}</span>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>

    <a-modal
      v-model:visible="formLoad.showModal"
      okText="确认开启"
      title="节点超时提醒"
      @ok="handleOk"
      @cancel="
        formLoad.showModal = false;
        formLoad.overtimeEmployee = false;
      "
    >
      <p class="mb-20">选择您要通知内部员工，节点超时时会发送待办消息</p>
      <a-radio-group v-model:value="form.insideEmployee" :options="employeeOptions" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { listByCategory } from '@/api/base/basicsData';
import {
  findNodes,
  getServiceConfig,
  getServiceStatus,
  saveServiceConfig,
  getRecord,
} from '@/api/messageCenter/messageRecord';

export default defineComponent({
  setup() {
    const selectedKeys = ref<string[]>([]);
    const expandedKeys = ref<string[]>([]);
    const tabs: any = ref([]);
    const records = ref([]);
    let seleList: any = [];

    const fieldNames: any = {
      children: 'workFunctionList',
      title: 'name',
      key: 'idCode',
    };

    const treeData: any = ref([]);
    const currentNode: any = ref('');
    const employeeOptions = [
      {
        label: '订单归属人',
        value: 'ORDER_ATTRIBUTOR',
      },
      { label: '工单处理人', value: 'WORKORDER_HANDLE' },
    ];

    const form: any = reactive({
      arriveSms: false,
      arriveClient: false,
      overtimeSms: false,
      overtimeClient: false,
      insideEmployee: '',
      overtimeValue: false,
      rejectClient: false,
      overtimeEmployee: false,
      id: null,
    });

    const msgMap: any = {
      arriveSms: '节点到达提醒(短信)',
      arriveClient: '节点到达提醒(客户端)',
      overtimeSms: '节点超时提醒(短信)',
      overtimeClient: '节点超时提醒(客户端)',
      overtimeEmployee: '节点超时提醒(内部员工)',
      overtimeValue: '设置了节点超时时间',
      rejectClient: '节点驳回提醒(客户端)',
    };

    let oldForm: any = {};

    const formLoad: any = reactive({
      arriveSms: false,
      arriveClient: false,
      overtimeSms: false,
      overtimeClient: false,
      overtimeValue: false,
      rejectClient: false,
      overtimeEmployee: false,
      disabled: true,
      showModal: false,
      configObj: {},
    });

    let id;

    const getCategoryLlist = () => {
      listByCategory().then((res: any) => {
        const arr: any = [];
        res.forEach((el: any, index: number) => {
          const element = {
            idCode: el.id + '-' + index,
            disabled: true,
            name: el.name,
            workFunctionList: [] as any[],
          };
          expandedKeys.value[0] = el.id + '-' + index;
          el.workFunctionList.forEach((item: any, ind: number) => {
            item.idCode = item.code + '_' + el.id;
            if (index == 0 && ind == 0) {
              selectedKeys.value[0] = item.code + '_' + el.id;
              seleList = selectedKeys.value[0].split('_');
              getProcesslist();
              getServiceStatusList();
            }
            if (el.id == '3' || el.id == '5') {
              if (
                [
                  '31',
                  '3101',
                  '3102',
                  '3103',
                  '3104',
                  '3105',
                  '3106',
                  '3107',
                  '3108',
                  '32',
                  '106',
                  '61',
                  '100',
                ].includes(item.code)
              ) {
                element.workFunctionList.push(item);
              }
            } else {
              element.workFunctionList.push(item);
            }
          });
          arr.push(element);
        });
        treeData.value = arr;
      });
    };

    const cancelTimeOut = () => {
      formLoad.disabled = true;
      if (oldForm.overtimeValue) {
        const overtimeValueList = oldForm.overtimeValue.split(',');
        form.num1 = overtimeValueList[0];
        form.num2 = overtimeValueList[1];
        form.num3 = overtimeValueList[2];
      } else {
        form.num1 = null;
        form.num2 = null;
        form.num3 = null;
      }
    };

    const getProcesslist = () => {
      findNodes({ functionCode: seleList[0] }).then((res: any) => {
        tabs.value = res;
        currentNode.value = (res[0] || {}).nodeCode;
        getCurrServiceConfig();
      });
    };

    const getServiceStatusList = () => {
      getServiceStatus({
        functionCode: seleList[0],
        parentFunctionCode: seleList[1],
        editContent: '',
      }).then((res: any) => {
        formLoad.configObj = res;
      });
    };

    const getCurrServiceConfig = () => {
      getServiceConfig({
        currentNodeCode: currentNode.value,
        functionCode: seleList[0],
        parentFunctionCode: seleList[1],
        editContent: '',
      }).then((res: any) => {
        id = res.id;
        handleData(res);
        if (id) {
          getRecordList(id);
        } else {
          records.value = [];
        }
      });
    };

    const handleData = (res: any) => {
      Object.keys(form).forEach((el: any) => {
        form[el] = res[el];
      });
      form.overtimeEmployee = !!res.insideEmployee;
      oldForm = JSON.parse(JSON.stringify(res));
      oldForm.overtimeEmployee = !!res.insideEmployee;
      if (res.overtimeValue) {
        const overtimeValueList = res.overtimeValue.split(',');
        form.num1 = overtimeValueList[0];
        form.num2 = overtimeValueList[1];
        form.num3 = overtimeValueList[2];
      }
    };

    const getRecordList = (id: any) => {
      getRecord({
        relationId: id,
      }).then((res: any) => {
        records.value = res.records;
      });
    };

    const changeConfig = (val: any, propertyName: any) => {
      form[propertyName] = oldForm[propertyName];
      if (
        !form.num1 &&
        !form.num2 &&
        !form.num3 &&
        (propertyName == 'overtimeSms' || propertyName == 'overtimeEmployee' || propertyName == 'overtimeClient')
      ) {
        return message.error('请先设置时长');
      }
      formLoad[propertyName] = true;
      const req = {
        ...form,
      };
      if (propertyName == 'overtimeEmployee') {
        if (val) {
          formLoad.showModal = true;
          return;
        } else {
          req.insideEmployee = '';
        }
      }

      req[propertyName] = val;
      req.editContent = (val ? '开启了' : '关闭了') + msgMap[propertyName];
      formLoad[propertyName] = false;
      setServiceConfig(req);
    };

    const changeCurrentNode = () => {
      getCurrServiceConfig();
    };

    const setServiceConfig = (req: any) => {
      saveServiceConfig({
        ...req,
        currentNodeCode: currentNode.value,
        functionCode: seleList[0],
        parentFunctionCode: seleList[1],
      }).then((res: any) => {
        if (res) {
          message.success('操作成功');
          getCurrServiceConfig();
          if (!formLoad.configObj[currentNode.value]) {
            getServiceStatusList();
          }

          if (formLoad.showModal) {
            formLoad.showModal = false;
          }
          if (!formLoad.disabled) {
            formLoad.disabled = true;
          }
          if (formLoad.overtimeEmployee) {
            formLoad.overtimeEmployee = false;
          }
        }
      });
    };

    const handleOk = (e: MouseEvent) => {
      if (!form.insideEmployee) {
        return message.error('请选择选项');
      }

      const req = {
        ...form,
        currentNodeCode: currentNode.value,
        functionCode: seleList[0],
        parentFunctionCode: seleList[1],
      };

      req.editContent = '开启了节点超时提醒(内部员工)';

      setServiceConfig(req);
    };

    const saveTimeOut = () => {
      if (!form.num1 && !form.num2 && !form.num2) {
        return message.error('请输入超时时间');
      }

      const req = {
        ...form,
        overtimeValue: `${form.num1 ? form.num1 : 0},${form.num2 ? form.num2 : 0},${form.num3 ? form.num3 : 0}`,
      };

      req.editContent = '设置了节点超时时间';
      setServiceConfig(req);
    };

    onMounted(() => {
      getCategoryLlist();
    });

    watch(selectedKeys, () => {
      if (selectedKeys.value[0]) {
        seleList = selectedKeys.value[0].split('_');
        getProcesslist();
        getServiceStatusList();
      } else {
        message.error('请选择左侧业务类型');
      }
    });

    return {
      treeData,
      selectedKeys,
      expandedKeys,
      fieldNames,
      records,
      tabs,
      currentNode,
      form,
      changeConfig,
      handleOk,
      employeeOptions,
      formLoad,
      cancelTimeOut,
      saveTimeOut,
      changeCurrentNode,
    };
  },
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>
