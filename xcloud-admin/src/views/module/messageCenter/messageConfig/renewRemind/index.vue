<template>
  <div class="service-main">
    <div class="tree">
      <a-tree v-model:selectedKeys="selectedKeys" v-model:expandedKeys="expandedKeys" :tree-data="treeData"> </a-tree>
    </div>
    <div class="config-content">
      <h2 class="mb-32">
        <span class="label-font">工单类型：</span>
        <span class="value-font">VAT申报</span>
        <span class="label-font ml-60">关联商品分类：</span>
        <span class="value-font">VAT申报,IOSS申报,OSS申报；</span>
      </h2>
      <p class="mb-32">提醒设置 <span class="small-font">默认当天9点进行推送</span></p>

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">提前预警</span>
          <span class="extra-font">开启后会根据服务截至日期进行提醒</span>
        </template>

        <p>
          <span class="label-font">提前</span>
          <a-input-number
            v-model:value="form.num1"
            :precision="0"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          <a-input-number
            v-model:value="form.num2"
            :precision="0"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          <a-input-number
            v-model:value="form.num3"
            :precision="0"
            :disabled="formLoad.disabled"
            size="small"
            :min="0"
            :max="100000"
          />
          &nbsp; &nbsp; 天 &nbsp; &nbsp;
          <a-button type="link" v-if="formLoad.disabled" @click="formLoad.disabled = false">设置</a-button>
          <a-button type="link" v-if="!formLoad.disabled" @click="saveAdvanceWarning">保存</a-button>
          <a-button type="link" v-if="!formLoad.disabled" @click="cancelTime(0)">取消</a-button>

          <span class="label-font ml-60">短信：</span>
          <span class="gray-font">{{ form.advanceWarningSms ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.advanceWarningSms"
            :loading="formLoad.advanceWarningSms"
            @click="changeConfig($event, 'advanceWarningSms')"
          />

          <span class="label-font ml-60">客户端：</span>
          <span class="gray-font">{{ form.advanceWarningClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.advanceWarningClient"
            :loading="formLoad.advanceWarningClient"
            @click="changeConfig($event, 'advanceWarningClient')"
          />

          <span class="label-font ml-60">微信推送：</span>
          <span class="gray-font">{{ form.advanceWarningWechatGzh ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.advanceWarningWechatGzh"
            :loading="formLoad.advanceWarningWechatGzh"
            @click="changeConfig($event, 'advanceWarningWechatGzh')"
          />
        </p>

        <p class="mt-32">
          <span>内部通知对象</span> <span class="gray-font">{{ form.advanceWarningEmployee ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.advanceWarningEmployee"
            :loading="formLoad.advanceWarningEmployee"
            @click="changeConfig($event, 'advanceWarningEmployee')"
          />

          <span v-if="form.advanceWarningInsideEmployee"
            >已选择通知
            {{
              form.advanceWarningInsideEmployee === 'ORDER_ATTRIBUTOR'
                ? '订单归属人'
                : form.advanceWarningInsideEmployee === 'WORKORDER_HANDLE'
                ? '工单处理人 '
                : '订单归属人, 工单处理人'
            }}
          </span>
        </p>
      </a-card>

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">到期预警</span>
          <span class="extra-font">服务到截止日期后会自动提醒</span>
        </template>

        <p>
          <span class="label-font">短信：</span>
          <span class="gray-font">{{ form.expireWarningSms ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.expireWarningSms"
            :loading="formLoad.expireWarningSms"
            @click="changeConfig($event, 'expireWarningSms')"
          />

          <span class="label-font ml-60">客户端：</span>
          <span class="gray-font">{{ form.expireWarningClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.expireWarningClient"
            :loading="formLoad.expireWarningClient"
            @click="changeConfig($event, 'expireWarningClient')"
          />

          <span class="label-font ml-60">微信推送：</span>
          <span class="gray-font">{{ form.expireWarningWechatGzh ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.expireWarningWechatGzh"
            :loading="formLoad.expireWarningWechatGzh"
            @click="changeConfig($event, 'expireWarningWechatGzh')"
          />

          <span class="label-font ml-60">内部通知对象</span>
          <span class="gray-font">{{ form.expireWarningEmployee ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.expireWarningEmployee"
            :loading="formLoad.expireWarningEmployee"
            @click="changeConfig($event, 'expireWarningEmployee')"
          />

          <span v-if="form.expireWarningInsideEmployee"
            >已选择通知
            {{
              form.expireWarningInsideEmployee === 'ORDER_ATTRIBUTOR'
                ? '订单归属人, '
                : form.expireWarningInsideEmployee === 'WORKORDER_HANDLE'
                ? '工单处理人, '
                : '订单归属人, 工单处理人'
            }}
          </span>
        </p>
      </a-card>

      <a-card style="width: 100%">
        <template #title>
          <span class="title-font">过期预警</span>
          <span class="extra-font">超过服务截止日期后会自动提示</span>
        </template>

        <p>
          <span class="label-font">过期</span>
          <a-input-number
            v-model:value="form.num4"
            :disabled="formLoad.overdueWarningDisabled"
            size="small"
            :precision="0"
            :min="0"
            :max="100000"
          />
          <a-input-number
            v-model:value="form.num5"
            :disabled="formLoad.overdueWarningDisabled"
            size="small"
            :precision="0"
            :min="0"
            :max="100000"
          />
          <a-input-number
            v-model:value="form.num6"
            :disabled="formLoad.overdueWarningDisabled"
            size="small"
            :precision="0"
            :min="0"
            :max="100000"
          />
          &nbsp; &nbsp; 天 &nbsp; &nbsp;
          <a-button type="link" v-if="formLoad.overdueWarningDisabled" @click="formLoad.overdueWarningDisabled = false"
            >设置</a-button
          >
          <a-button type="link" v-if="!formLoad.overdueWarningDisabled" @click="saveOverdueWarning">保存</a-button>
          <a-button type="link" v-if="!formLoad.overdueWarningDisabled" @click="cancelTime(3)">取消</a-button>

          <span class="label-font ml-60">短信：</span>
          <span class="gray-font">{{ form.overdueWarningSms ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overdueWarningSms"
            :loading="formLoad.overdueWarningSms"
            @click="changeConfig($event, 'overdueWarningSms')"
          />

          <span class="label-font ml-60">客户端：</span>
          <span class="gray-font">{{ form.overdueWarningClient ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overdueWarningClient"
            :loading="formLoad.overdueWarningClient"
            @click="changeConfig($event, 'overdueWarningClient')"
          />

          <span class="label-font ml-60">微信推送：</span>
          <span class="gray-font">{{ form.overdueWarningWechatGzh ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overdueWarningWechatGzh"
            :loading="formLoad.overdueWarningWechatGzh"
            @click="changeConfig($event, 'overdueWarningWechatGzh')"
          />
        </p>

        <p class="mt-32">
          <span>内部通知对象</span> <span class="gray-font">{{ form.overdueWarningEmployee ? '开启' : '关闭' }}</span>
          <a-switch
            v-model:checked="form.overdueWarningEmployee"
            :loading="formLoad.overdueWarningEmployee"
            @click="changeConfig($event, 'overdueWarningEmployee')"
          />

          <span v-if="form.overdueWarningInsideEmployee"
            >已选择通知
            {{
              form.overdueWarningInsideEmployee === 'ORDER_ATTRIBUTOR'
                ? '订单归属人'
                : form.overdueWarningInsideEmployee === 'WORKORDER_HANDLE'
                ? '工单处理人'
                : '订单归属人, 工单处理人'
            }}
          </span>
        </p>
      </a-card>

      <p class="mb-32">操作记录</p>
      <div class="record-content">
        <a-timeline>
          <a-timeline-item v-for="(item, index) in records" :key="index">
            <span class="record-time">{{ item.createTime }}</span> <span> {{ item.content }}</span>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>

    <a-modal
      v-model:visible="formLoad.showModal"
      okText="确认开启"
      :title="formLoad.title"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p class="mb-20">选择您要通知内部员工，节点超时时会发送待办消息</p>
      <!-- <a-checkbox-group v-model:value="form.employeeChecked" name="checkboxgroup" :options="employeeOptions" /> -->
      <a-radio-group v-model:value="form.employeeChecked" :options="employeeOptions" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { getRenewConfig, saveRenewConfig, getRecord } from '@/api/messageCenter/messageRecord';

export default defineComponent({
  setup() {
    const selectedKeys = [2];
    const expandedKeys = [1];
    const records = ref([]);
    let employeePropName = '';

    const treeData: any = [{ title: 'VAT服务', key: 1, children: [{ title: 'VAT/IOSS申报', key: 2 }] }];
    const employeeOptions = [
      {
        label: '订单归属人',
        value: 'ORDER_ATTRIBUTOR',
      },
      { label: '工单处理人', value: 'WORKORDER_HANDLE' },
    ];

    const form: any = reactive({
      advanceWarningSms: false,
      advanceWarningClient: false,
      advanceWarningWechatGzh: false,
      advanceWarningEmployee: false,
      expireWarningSms: false,
      expireWarningClient: false,
      expireWarningWechatGzh: false,
      expireWarningEmployee: false,
      insideEmployee: '',
      advanceWarningValue: '',
      advanceWarningInsideEmployee: '',
      expireWarningInsideEmployee: '',
      overtimeValue: false,
      overdueWarningSms: false,
      overdueWarningClient: false,
      overdueWarningWechatGzh: false,
      overdueWarningInsideEmployee: '',
      overdueWarningEmployee: false,
      id: null,
    });

    const msgMap: any = {
      advanceWarningSms: '提前预警提醒(短信)',
      advanceWarningClient: '提前预警提醒(客户端)',
      advanceWarningWechatGzh: '提前预警提醒(微信推送)',
      advanceWarningEmployee: '提前预警提醒(内部通知对象)',
      expireWarningSms: '到期预警提醒(短信)',
      expireWarningClient: '到期预警提醒(客户端)',
      expireWarningWechatGzh: '到期预警提醒(微信推送)',
      expireWarningEmployee: '到期预警提醒(内部通知对象)',
      overtimeValue: '设置了节点超时时间',
      overdueWarningSms: '过期预警提醒(短信)',
      overdueWarningClient: '过期预警提醒(客户端)',
      overdueWarningWechatGzh: '过期预警提醒(微信推送)',
      overdueWarningEmployee: '过期预警提醒(内部通知对象)',
    };

    let oldForm: any = {};

    const formLoad: any = reactive({
      advanceWarningSms: false,
      advanceWarningClient: false,
      advanceWarningWechatGzh: false,
      advanceWarningEmployee: false,
      expireWarningSms: false,
      expireWarningClient: false,
      expireWarningWechatGzh: false,
      expireWarningEmployee: false,
      overdueWarningSms: false,
      overdueWarningClient: false,
      overdueWarningWechatGzh: false,
      overdueWarningEmployee: false,
      disabled: true,
      overdueWarningDisabled: true,
      showModal: false,
      title: '',
    });

    let id;

    const getCurrRenewConfig = () => {
      getRenewConfig({
        editContent: '',
        functionCode: 1,
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

    const cancelTime = (num: number) => {
      const str = num === 3 ? 'overdueWarningValue' : 'advanceWarningValue';
      const disStr = num === 3 ? 'overdueWarningDisabled' : 'disabled';
      formLoad[disStr] = true;
      if (oldForm[str]) {
        const valueList = oldForm[str].split(',');
        form['num' + (1 + num)] = valueList[0];
        form['num' + (2 + num)] = valueList[1];
        form['num' + (3 + num)] = valueList[2];
      } else {
        form['num' + (1 + num)] = form['num' + (2 + num)] = form['num' + (3 + num)] = null;
      }
    };

    const handleData = (res: any) => {
      Object.keys(form).forEach((el: any) => {
        form[el] = res[el];
      });
      oldForm = JSON.parse(JSON.stringify(res));
      form.advanceWarningEmployee = !!res.advanceWarningInsideEmployee;
      oldForm.advanceWarningEmployee = !!res.advanceWarningInsideEmployee;
      form.expireWarningEmployee = !!res.expireWarningInsideEmployee;
      oldForm.expireWarningEmployee = !!res.expireWarningInsideEmployee;
      form.overdueWarningEmployee = !!res.overdueWarningInsideEmployee;
      oldForm.overdueWarningEmployee = !!res.overdueWarningInsideEmployee;
      if (res.advanceWarningValue) {
        const advanceWarningValueList = res.advanceWarningValue.split(',');
        form.num1 = advanceWarningValueList[0];
        form.num2 = advanceWarningValueList[1];
        form.num3 = advanceWarningValueList[2];
      }

      if (res.overdueWarningValue) {
        const overdueWarningValueList = res.overdueWarningValue.split(',');
        form.num4 = overdueWarningValueList[0];
        form.num5 = overdueWarningValueList[1];
        form.num6 = overdueWarningValueList[2];
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
      let propertyNameList = ['Sms', 'Client', 'WechatGzh', 'Employee'];
      if (
        !form.num1 &&
        !form.num2 &&
        !form.num3 &&
        propertyNameList.map(item => 'advanceWarning' + item).includes(propertyName)
      ) {
        return message.error('请先设置时长');
      }
      if (
        !form.num4 &&
        !form.num5 &&
        !form.num6 &&
        propertyNameList.map(item => 'overdueWarning' + item).includes(propertyName)
      ) {
        return message.error('请先设置时长');
      }
      formLoad[propertyName] = true;
      const req = {
        ...form,
      };
      if (['advanceWarningEmployee', 'expireWarningEmployee', 'overdueWarningEmployee'].includes(propertyName)) {
        if (val) {
          employeePropName = propertyName;
          formLoad.showModal = true;
          formLoad.title =
            propertyName === 'advanceWarningEmployee'
              ? '续费提前提醒'
                ? propertyName === 'expireWarningEmployee'
                : '续费到期提醒'
              : '续费过期提醒';

          if (propertyName === 'advanceWarningEmployee') {
            form.employeeChecked = oldForm.advanceWarningInsideEmployee;
          } else if (propertyName === 'expireWarningEmployee') {
            form.employeeChecked = oldForm.expireWarningInsideEmployee;
          } else {
            form.employeeChecked = oldForm.overdueWarningInsideEmployee;
          }
          return;
        } else {
          if (propertyName === 'advanceWarningEmployee') {
            req.advanceWarningInsideEmployee = '';
          } else if (propertyName === 'expireWarningEmployee') {
            req.expireWarningInsideEmployee = '';
          } else {
            req.overdueWarningInsideEmployee = '';
          }
        }
      }

      req[propertyName] = val;
      req.editContent = (val ? '开启了' : '关闭了') + msgMap[propertyName];
      formLoad[propertyName] = false;
      setServiceConfig(req);
    };
    const handleCancel = () => {
      formLoad[employeePropName] = false;
      formLoad.showModal = false;
    };

    const setServiceConfig = (req: any) => {
      saveRenewConfig({
        ...req,
        functionCode: 1,
      }).then((res: any) => {
        if (res) {
          message.success('操作成功');
          getCurrRenewConfig();
          if (formLoad.showModal) {
            formLoad.showModal = false;
          }
          if (!formLoad.disabled || !formLoad.overdueWarningDisabled) {
            formLoad.disabled = true;
            formLoad.overdueWarningDisabled = true;
          }
          if (formLoad.advanceWarningEmployee) {
            formLoad.advanceWarningEmployee = false;
          }
          if (formLoad.expireWarningEmployee) {
            formLoad.expireWarningEmployee = false;
          }
          if (formLoad.overdueWarningEmployee) {
            formLoad.overdueWarningEmployee = false;
          }
        }
      });
    };

    const handleOk = (e: MouseEvent) => {
      if (!form.employeeChecked) {
        return message.error('请选择选项');
      }

      const req = {
        ...form,
      };

      if (employeePropName === 'advanceWarningEmployee') {
        req.advanceWarningInsideEmployee = form.employeeChecked;
        req.editContent = '开启了提前预警提醒(内部员工)';
      } else if (employeePropName === 'expireWarningEmployee') {
        req.expireWarningInsideEmployee = form.employeeChecked;
        req.editContent = '开启了到期预警提醒(内部员工)';
      } else {
        req.overdueWarningInsideEmployee = form.employeeChecked;
        req.editContent = '开启了过期预警提醒(内部员工)';
      }
      setServiceConfig(req);
    };

    const saveAdvanceWarning = () => {
      if (!form.num1 && !form.num2 && !form.num2) {
        return message.error('请输入提前预警时间');
      }
      const req = {
        ...form,
        advanceWarningValue: `${form.num1 ? form.num1 : 0},${form.num2 ? form.num2 : 0},${form.num3 ? form.num3 : 0}`,
        editContent: '设置了提前预警时间',
      };
      setServiceConfig(req);
    };

    const saveOverdueWarning = () => {
      if (!form.num4 && !form.num5 && !form.num6) {
        return message.error('请输入过期预警时间');
      }
      const req = {
        ...form,
        overdueWarningValue: `${form.num4 ? form.num4 : 0},${form.num5 ? form.num5 : 0},${form.num6 ? form.num6 : 0}`,
        editContent: '设置了过期预警时间',
      };
      setServiceConfig(req);
    };

    onMounted(() => {
      getCurrRenewConfig();
    });

    return {
      treeData,
      selectedKeys,
      expandedKeys,
      records,
      form,
      changeConfig,
      handleOk,
      employeeOptions,
      formLoad,
      saveAdvanceWarning,
      saveOverdueWarning,
      cancelTime,
      handleCancel,
    };
  },
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>
