<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">翻译OA</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="是否需要客户处理">
          <a-radio-group v-model:value="formModal.dispose">
            <a-radio :value="2">需要处理</a-radio>
            <a-radio :value="1">无需处理</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="+formModal.dispose === 1"
          label="短信通知"
          name="sendMsg"
          :rules="[{ required: true, message: '请勾选是否需要短信通知' }]"
        >
          <a-radio-group v-model:value="formModal.sendMsg">
            <a-radio :value="1">通知</a-radio>
            <a-radio :value="0">不通知</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="翻译OA内容"
          name="interpretFileContent"
          :rules="[{ required: true, message: '请输入翻译OA内容' }]"
          v-if="formModal.dispose === 2"
        >
          <a-textarea
            v-model:value="formModal.interpretFileContent"
            placeholder="请输入翻译OA内容"
            show-count
            :maxlength="500"
          />
        </a-form-item>
        <a-form-item
          label="无需处理原因"
          name="disposeRejectReason"
          :rules="[{ required: true, message: '请输入无需客户处理原因' }]"
          v-else-if="formModal.dispose === 1"
        >
          <a-textarea
            v-model:value="formModal.disposeRejectReason"
            placeholder="请输入无需处理原因"
            show-count
            :maxlength="500"
          />
        </a-form-item>
        <a-form-item
          label="审查意见详情"
          name="helpDocument"
          :rules="[{ required: true, message: '请上传文件' }]"
          v-if="formModal.dispose === 2"
        >
          <Upload v-if="formModal.helpDocument.length < 5" @submitUrl="submitUrl" />
          <div class="img-list">
            <div class="li" v-for="(li, index) of formModal.helpDocument" :key="index">
              <span>{{ li.oldFileName }}</span>
              <span class="btn" @click="deleteImg(index)">删除</span>
            </div>
          </div>
          <div class="form-tips">文件限制：文件大小不超过5M</div>
        </a-form-item>
        <a-form-item
          label="答复OA方案"
          name="planJson"
          :rules="[{ required: true, message: '请添加答复OA方案' }]"
          v-if="formModal.dispose === 2"
        >
          <div class="scheme-cell" v-for="(li, index) of formModal.planJson" :key="index">
            <div class="scheme-title">
              <span class="text">方案{{ index + 1 }}</span>
              <span class="btn" @click="deletePlan(li)">删除</span>
            </div>
            <div class="scheme-wrap">
              <div class="scheme-tips">答复建议</div>
              <div class="scheme-text">
                {{ li.planInfo.replyStr }}
              </div>
              <div class="scheme-tips">答复审查意见服务商品</div>
              <a-table
                size="small"
                :data-source="li.planInfo.oaServiceList"
                :pagination="false"
                bordered
                :locale="{ emptyText: '无需OA付费' }"
              >
                <a-table-column :width="100" title="国家" data-index="oaCountry" />
                <a-table-column :width="100" title="售价" data-index="oaPrice" />
                <a-table-column title="服务商品" data-index="evidenceComboName" />
              </a-table>
            </div>
          </div>
          <div class="no-data" v-if="formModal.planJson.length === 0">
            <span>暂无方案</span>
          </div>
          <a-button type="primary" @click="AddOaPlanFun()">新增方案</a-button>
        </a-form-item>
        <a-form-item
          label="客户截至日期"
          name="customerExpiryDate"
          :rules="[{ required: true, message: '请选择客户截至日期' }]"
          v-if="formModal.dispose === 2"
        >
          <a-date-picker
            v-model:value="formModal.customerExpiryDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
          <div class="form-tips">
            提示：官方截止时间为
            {{ (record.officialExpirationDate ?? '').split(' ')[0] }}，尽量在官方截止时间的基础上预留 15天给至律师处理
          </div>
        </a-form-item>
        <a-form-item style="text-align: center">
          <a-space>
            <a-button @click="showDrawer = false">取消</a-button>
            <a-button type="primary" @click="submitConfirm()">确认</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
  <AddOaPlan ref="addOaPlan" :record="record" @submit="getPlanList()" />
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import { message, Modal, type FormInstance } from 'ant-design-vue';
import { getFileDetails, delById, translateOaAPI } from '@/api/workOrder/intellectualProperty/oaExamination';
import Upload from '@/components/upload/Upload.vue';
import AddOaPlan from './AddOaPlan.vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showDrawer = ref(false);
watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      getPlanList();
      formModal.value = {
        oaFileId: props.record.id,
        interpretFileContent: props.record.interpretFileContent,
        isNeedPay: props.record.isNeedPay,
        productMoney: props.record.productMoney,
        orderNo: props.record.orderNo,
        dispose: props.record.dispose,
        customerExpiryDate: props.record.lastDealDate,
        sendMsg: null,
        helpDocument: props.record.hlepDocument ? JSON.parse(props.record.hlepDocument) : [],
        planJson: [],
        disposeRejectReason: props.record.disposeRejectReason,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  const params = JSON.parse(JSON.stringify(formModal.value));
  params.helpDocument = JSON.stringify(params.helpDocument);
  params.planJson = JSON.stringify(params.planJson);
  params.sendMsg = Boolean(params.sendMsg);
  ruleFormRef.value?.validate().then(() => {
    translateOaAPI(params).then((res: any) => {
      message.success('操作成功');
      showDrawer.value = false;
      emit('submit');
    });
  });
};

//新增答复意见
const addOaPlan: Ref = ref(null);
const AddOaPlanFun = () => {
  addOaPlan.value.showModal = true;
};

//删除答复意见
const deletePlan = (record: any) => {
  Modal.confirm({
    title: '提示',
    content: '确认删除此方案?',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise<void>((resolve, reject) => {
        delById({
          id: record.id,
        }).then(() => {
          getPlanList();
          message.success('操作成功');
        });
        resolve();
      });
    },
  });
};

//上传图片
const submitUrl = (url: string) => {
  const arr = url.split('/');
  formModal.value.helpDocument.push({
    oldFileName: arr[arr.length - 1],
    fileUrl: url,
  });
};

//删除图片
const deleteImg = (index: number) => {
  formModal.value.helpDocument.splice(index, 1);
};

//获取答复意见
const getPlanList = () => {
  getFileDetails({
    id: props.record.id,
  }).then((res: any) => {
    formModal.value.planJson = res.planList
      .map((item: { planInfo: string }) => {
        if (item.planInfo != '') {
          item.planInfo = JSON.parse(item.planInfo);
        }
        return item;
      })
      .filter((item: { planInfo: string }) => item.planInfo != '');
  });
};

//暴露方法
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
  padding: 20px 0;
  .form-tips {
    margin: 4px 0;
    font-size: 14px;
    line-height: 22px;
    color: #666;
  }
  .scheme-cell {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    .scheme-title {
      border-bottom: 1px solid #ccc;
      padding: 4px;
      .text {
        font-weight: bold;
      }
      .btn {
        float: right;
        cursor: pointer;
        color: red;
      }
    }
    .scheme-wrap {
      .scheme-tips {
        color: #999;
        margin: 4px 0;
      }
      .scheme-text {
        margin-bottom: 10px;
      }
    }
  }
  .no-data {
    color: #999;
    padding: 5px 10px;
  }
  .img-list {
    margin-top: 5px;
    .li {
      .btn {
        color: red;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }
}
</style>
