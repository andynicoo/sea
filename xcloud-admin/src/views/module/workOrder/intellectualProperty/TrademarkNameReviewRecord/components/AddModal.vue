<template>
  <slot>
    <a-button type="primary" @click="openModal()" v-if="useButton('workOrder_intellectualProperty_trademarkRecord_add')"
      >+新建核名</a-button
    >
  </slot>

  <!-- 新建 弹窗 -->
  <a-modal title="新建商标核名" width="700px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <a-form ref="ruleFormRef" layout="vertical" :model="formModal" name="basic">
        <template v-if="data.step === 1">
          <a-form-item
            label="用户手机号"
            name="userMobile"
            :rules="[
              { required: true, message: '请输入用户手机号' },
              { required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误', trigger: 'change' },
            ]"
          >
            <a-input
              :maxlength="11"
              v-model:value="formModal.userMobile"
              placeholder="请输入用户手机号"
              @change="handleUserMobileChange"
            />
            <template #extra v-if="showMobileExtra">
              <div class="success" v-if="isRegisted">手机号已注册</div>
              <div class="warning" v-else>手机号未注册，点击「下一步」将进行注册</div>
            </template>
          </a-form-item>

          <template v-if="!isRegisted">
            <a-form-item
              label="确认手机号"
              name="userMobile2"
              :maxlength="11"
              :rules="[{ required: true, message: '请确认手机号' }]"
            >
              <a-input v-model:value="formModal.userMobile2" placeholder="请确认手机号" />
            </a-form-item>
          </template>
          <a-form-item label="用户名称" name="userName">
            <a-input v-model:value="formModal.userName" placeholder="请输入客户的名称" />
          </a-form-item>
        </template>
        <template v-if="data.step === 2">
          <a-form-item
            label="商标名称"
            name="trademarkName"
            :rules="[
              { required: true, message: '请输入商标名称' },
              {
                required: true,
                pattern: /^[\u0000-\u4E00\u9FA5]{3,50}$/g,
                message: '格式错误，3-50个字符，仅支持数字，字母和空格',
                trigger: 'change',
              },
            ]"
          >
            <a-input :maxlength="50" show-count v-model:value="formModal.trademarkName" placeholder="请输入商标名称" />
          </a-form-item>
          <a-form-item label="国家" name="country" :rules="[{ required: true, message: '请选择国家' }]">
            <a-select
              v-model:value="formModal.country"
              placeholder="请选择国家"
              allowClear
              showSearch
              optionFilterProp="label"
              @change="handleCountryChange"
            >
              <a-select-option
                v-for="(item, index) of data.countryList"
                :key="index"
                :value="item.countryCode"
                :label="item.countryNameZh"
              >
                {{ item.countryNameZh }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="类别（最多十个）"
            name="trademarkCategoryNums"
            :rules="[{ required: true, message: '请选择类别' }]"
          >
            <a-select
              mode="multiple"
              v-model:value="formModal.trademarkCategoryNums"
              placeholder="请选择类别"
              allowClear
              showSearch
              showArrow
              optionFilterProp="label"
              @change="handleCategoryChange"
            >
              <a-select-option
                v-for="(item, index) of data.categoryList"
                :key="index"
                :value="item.categoryNum"
                :label="item.categoryName"
                :disabled="
                  formModal.trademarkCategoryNums.length >= 10 &&
                  !formModal.trademarkCategoryNums.includes(item.categoryNum)
                "
              >
                {{ item.categoryNum }}类 {{ item.categoryName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="商标含义" name="trademarkMeaning">
            <a-textarea
              :maxlength="300"
              v-model:value="formModal.trademarkMeaning"
              placeholder="如客户有提供其商标的含义请填写"
              :rows="4"
              show-count
            />
          </a-form-item>
        </template>
      </a-form>
    </div>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleNext" v-if="data.step === 1">下一步</a-button>
      <a-button key="submit" type="primary" @click="handleOk" v-if="data.step === 2">提交</a-button>
    </template>
  </a-modal>

  <!-- 同名提示 弹窗 -->
  <a-modal
    title="同名商标提示"
    width="500px"
    v-model:visible="showSameModal"
    :maskClosable="false"
    :keyboard="false"
    okText="继续提交"
    @ok="handleSubmit"
  >
    <div class="tips">
      <p>该商标存在以下同名商标，是否继续提交？</p>
      <ul>
        <li>
          <span>商标名：</span>
          <div>{{ data.same.similarRemark }}</div>
        </li>
        <li>
          <span>国家：</span>
          <div>{{ data.same.holderCountry }}</div>
        </li>
        <li>
          <span>商标类目：</span>
          <div>{{ data.same.resultClassNum }}</div>
        </li>
        <li>
          <span>状态：</span>
          <div>{{ data.same.oneStatusName }}</div>
        </li>
      </ul>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useButton, jumpPage } from '@/utils/utils';
import { useStore } from '@/stores/store';
import { nextTick, reactive, ref, watch, onMounted, createVNode } from 'vue';
import { useRoute } from 'vue-router';
import { CheckOutlined } from '@ant-design/icons-vue';
import { message, type FormInstance, Modal } from 'ant-design-vue';
import { getCountrySelectList } from '@/api/base/basicsData';
import { handleAddUser, getRegistedMobileList } from '@/api/user/user';
import {
  getAllCategoryList,
  handleTrademarkRecordCreate,
  getTrademarkSameByName,
  handleTrademarkRecordLastCreate,
} from '@/api/workOrder/intellectualProperty/trademark';
import { isEmpty } from 'lodash-es';
import router from '@/router';

const route: any = useRoute();

const props = defineProps({
  serviceIdsArr: {
    type: Array<string>,
    default: [],
  },
  btnText: {
    type: String,
    default: '批量修改处理人',
  },
  btnSize: {
    type: String,
    default: 'middle',
  },
});
const emit = defineEmits(['submit']);
const data: any = reactive({
  handlerUserTypeList: [],
  countryList: [],
  categoryList: [],
  step: 1, // 步骤
  same: {}, // 商标同名信息
  isLast: false, // 是否为钟核创建
});
const formModal: any = ref({});
// 新增弹窗
const showModal = ref(false);
// 同名弹窗
const showSameModal = ref(false);
// 用户是否已注册
const isRegisted = ref(false);
// 是否显示手机号额外信息
const showMobileExtra = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getCountrySelectListFun();
      getAllCategoryListFun();
      data.step = 1;
      isRegisted.value = true;
      showMobileExtra.value = false;
      formModal.value = {
        userMobile: (data.isLast && route.query?.userMobile) || null,
        userName: null,
        enterpriseId: useStore().enterprise.record.id,
        country: (data.isLast && route.query?.countryCode) || null,
        trademarkMeaning: null,
        trademarkName: (data.isLast && route.query?.trademarkName) || null,
        trademarkCategoryNums: [],
      };
    });
  }
});
watch(showSameModal, newVal => {
  if (!newVal) {
    ruleFormRef.value?.resetFields();
  }
});

onMounted(() => {
  if (route.query?.workId) {
    showModal.value = true;
    data.isLast = true;
  }
});

//打开模态框
const openModal = () => {
  showModal.value = true;
  data.isLast = false;
};

//提交
const ruleFormRef = ref<FormInstance>();

//选择国家
const handleCountryChange = (val: string) => {
  formModal.value.country = val;
};

//获取国家
const getCountrySelectListFun = () => {
  getCountrySelectList().then((res: any) => {
    const hot = ['中国', '美国', '英国', '德国', '法国', '意大利'];
    const hotCountryList = res.filter((v: any) => hot.some(val => v.countryNameZh === val));
    const otherCountryList = res.filter((v: any) => hot.every(val => v.countryNameZh !== val));
    data.countryList = [...hotCountryList, ...otherCountryList] || [];
  });
};

// 获取类别
const getAllCategoryListFun = () => {
  getAllCategoryList().then((res: object) => {
    data.categoryList = res || [];
  });
};

//选择类别
const handleCategoryChange = (val: any) => {
  formModal.value.trademarkCategoryNums = val;
};

// 文本框改变
const handleUserMobileChange = () => {
  showMobileExtra.value = false;
  const userMobile = formModal.value.userMobile;
  getRegistedMobileList({ userMobile }).then((res: any) => {
    if (userMobile.length === 11) {
      showMobileExtra.value = true;
      isRegisted.value = res.length ? true : false;
      formModal.value.userName = res[0].nickname;
    }
  });
};

// 下一步
const handleNext = () => {
  ruleFormRef.value?.validate().then(() => {
    data.step = 2;
    // 未注册的手机号，点击下一步调注册接口
    if (!isRegisted.value) {
      const { enterpriseId, userMobile, userName } = formModal.value;
      handleAddUser({
        enterpriseId,
        mobile: userMobile,
        name: userName,
        followUserId: useStore().userInfo.userId,
      }).then(() => {
        // message.success('操作成功');
      });
    }
  });
};

// 提交
const handleOk = () => {
  ruleFormRef.value?.validate().then(() => {
    getTrademarkSameByName({
      ...formModal.value,
      trademarkCategoryNums: formModal.value?.trademarkCategoryNums.join(','),
    }).then(res => {
      if (!isEmpty(res)) {
        showSameModal.value = true;
        data.same = res;
      } else {
        handleSubmit();
      }
    });
  });
};

// 取消
const handleCancel = () => {
  showModal.value = false;
};

// 继续提交
const handleSubmit = () => {
  // 创建和终核创建
  const flag = data.isLast && route.query?.workId;
  const createFn = flag ? handleTrademarkRecordLastCreate : handleTrademarkRecordCreate;
  createFn({
    ...formModal.value,
    trademarkCategoryNums: formModal.value?.trademarkCategoryNums.join(','),
    workId: flag || undefined,
  }).then((res: any) => {
    message.success('操作成功');
    showSameModal.value = false;
    showModal.value = false;
    emit('submit');
    // if (flag) {
    //   jumpPage('/workOrder/intellectualProperty/trademarkNameReviewRecord');
    // }
    handleCreateSuccess(res?.id, res?.recordNo);
  });
};

// 核名成功提示
const handleCreateSuccess = (id: string, recordNo: string) => {
  Modal.confirm({
    title: '核名记录创建成功',
    content: '您已创建核名记录，请去完成核名报告',
    icon: createVNode(CheckOutlined),
    cancelText: '取消',
    okText: '去核名',
    onOk: () => {
      jumpPage(`/workOrder/intellectualProperty/trademarkNameReviewRecord/details?id=${id}&recordNo=${recordNo}`);
    },
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  .success {
    color: green;
  }
  .warning {
    color: orange;
  }
}
.tips {
  height: 120px;
  ul {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    li {
      width: 50%;
      display: flex;
      line-height: 28px;
      div {
        flex: 1;
        padding-right: 10px;
      }
    }
  }
}
</style>
