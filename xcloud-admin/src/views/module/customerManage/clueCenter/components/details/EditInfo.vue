<template>
  <div class="title-min">
    <span class="label">线索</span>
    <span>{{ router.currentRoute.value.query.mobile || '-' }}</span>
  </div>
  <div class="cell-wrap">
    <div class="cell-title">
      <span class="text">基础信息</span>
    </div>
    <a-row>
      <a-col :span="6" v-if="pageType === 'add'">
        <div class="hd"><span style="color: red; font-weight: bold">*</span>手机号：</div>
        <div class="bd">
          <a-input v-model:value="formModal.mobile" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">姓名：</div>
        <div class="bd">
          <a-input v-model:value="formModal.name" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">微信号：</div>
        <div class="bd">
          <a-input v-model:value="formModal.weixin" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">邮箱：</div>
        <div class="bd">
          <a-input v-model:value="formModal.email" placeholder="请输入" />
        </div>
      </a-col>
    </a-row>
  </div>

  <div class="cell-wrap">
    <div class="cell-title">
      <span class="text">线索信息</span>
    </div>
    <a-row>
      <a-col :span="6">
        <div class="hd"><span style="color: red; font-weight: bold">*</span>品牌：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.brandId"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
            :disabled="pageType === 'edit'"
          >
            <a-select-option v-for="(li, index) of data.brandList" :key="index" :value="li.key" :label="li.value">
              {{ li.value }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd"><span style="color: red; font-weight: bold">*</span>数据源：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.platform"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
            :disabled="pageType === 'edit'"
          >
            <a-select-option v-for="(li, index) of data.platformList" :key="index" :value="li.key" :label="li.value">
              {{ li.value }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd"><span style="color: red; font-weight: bold">*</span>跟进人：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.followUserId"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
          >
            <a-select-option v-for="(li, index) of data.userList" :key="index" :value="li.userId" :label="li.nickName">
              {{ li.nickName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd"><span style="color: red; font-weight: bold">*</span>跟进状态：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.leadFollowStatus"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
            :disabled="pageType === 'edit'"
          >
            <a-select-option
              v-for="(li, index) of data.followStatusList"
              :key="index"
              :value="li.key"
              :label="li.value"
            >
              {{ li.value }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">线索来源：</div>
        <div class="bd">
          <a-cascader
            v-model:value="formModal.sourceArr"
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
            style="width: 100%"
          ></a-cascader>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">市场活动：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.campaign"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 200px"
          >
            <a-select-option
              v-for="(li, index) of data.campaignData"
              :key="index"
              :value="li.linkAddressId"
              :label="li.linkName"
            >
              {{ li.linkName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">邀请人：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.inviteUserId"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
          >
            <a-select-option v-for="(li, index) of data.userList" :key="index" :value="li.userId" :label="li.nickName">
              {{ li.nickName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="6" v-if="pageType === 'edit'">
        <div class="hd">推送状态：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.lxyStatus"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
            :disabled="pageType === 'edit'"
          >
            <a-select-option v-for="(li, index) of data.pustStatusList" :key="index" :value="li.key" :label="li.value">
              {{ li.value }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
    </a-row>
  </div>

  <div class="cell-wrap">
    <div class="cell-title">
      <span class="text">公司信息</span>
    </div>
    <a-row>
      <a-col :span="6">
        <div class="hd">公司：</div>
        <div class="bd">
          <a-input v-model:value="formModal.company" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">所属行业：</div>
        <div class="bd">
          <a-input v-model:value="formModal.industry" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">年收入：</div>
        <div class="bd">
          <a-input v-model:value="formModal.annualIncome" placeholder="请输入" />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="hd">业务国家：</div>
        <div class="bd">
          <a-select
            v-model:value="formModal.countryCode"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 100%"
          >
            <a-select-option
              v-for="(li, index) of data.countryList"
              :key="index"
              :value="li.countryCode"
              :label="li.countryNameZh"
            >
              {{ li.countryNameZh }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
    </a-row>
  </div>
  <div class="btn-wrap">
    <a-button type="primary" @click="onSubmit">保存</a-button>
    <a-button style="margin-left: 10px" @click="getInfo()">取消</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  getBrandList,
  getSourceList,
  getAllUsers,
  leadFollowStatusList,
  findDictByCodeList,
  getCustomerLeadStatusList,
  getCountrySelectList,
  pageListLink,
} from '@/api/base/basicsData';
import { getDetailsInfo, addLead, editLead } from '@/api/customerManage/clueCenter';
import router from '@/router';

const emit = defineEmits(['submit']);
const pageType = router.currentRoute.value.query.id ? 'edit' : 'add';
const formModal: any = ref({});
const data: any = reactive({
  brandList: [], //品牌
  platformList: [], //数据源
  userList: [], //跟进人
  followStatusList: [], //跟进状态
  sourceData: [], //客户来源数据
  campaignData: [], //市场活动
  pustStatusList: [], //推送状态
  countryList: [], //国家
});

onMounted(() => {
  getInfo();
  getBrandListFun();
  getSourceListFun();
  getAllUsersFun();
  getFollowStatusList();
  getLeadSourceLargeDataFun();
  getcampaignDataFun();
  getPustStatusList();
  getCountrySelectListFun();
});

//编辑获取详细信息
const getInfo = () => {
  if (pageType === 'edit') {
    getDetailsInfo({
      customerLeadId: router.currentRoute.value.query.id,
    }).then((res: any) => {
      setFormModal(res);
    });
  } else {
    setFormModal({});
  }
};

//设置值
const setFormModal = (res: any = {}) => {
  formModal.value = {
    mobile: res.mobile || null,
    name: res.name || null,
    weixin: res.weixin || null,
    email: res.email || null,

    brandId: res.brandId || null,
    platform: res.platform || null,
    followUserId: res.followUserId || null,
    leadFollowStatus: res.leadFollowStatus ? String(res.leadFollowStatus) : null,
    sourceArr: res.sourceSmall ? [String(res.sourceLarge), String(res.sourceSmall)] : [],
    campaign: res.campaign || null,
    inviteUserId: res.inviteUserId || null,
    lxyStatus: res.lxyStatus ? String(res.lxyStatus) : null,

    company: res.company || null,
    industry: res.industry || null,
    annualIncome: res.annualIncome || null,
    countryCode: res.countryCode || null,
    countryName: res.countryName || null,
  };
};

//提交
const onSubmit = () => {
  if (!formModal.value.mobile || formModal.value.mobile.length !== 11) {
    message.error('请输入11位手机号');
    return false;
  }
  if (!formModal.value.brandId) {
    message.error('请选择品牌');
    return false;
  }
  if (!formModal.value.platform) {
    message.error('请选择数据源');
    return false;
  }
  if (!formModal.value.followUserId) {
    message.error('请选择跟进人');
    return false;
  }
  if (!formModal.value.leadFollowStatus) {
    message.error('请选择跟进状态');
    return false;
  }

  if (formModal.value.countryCode) {
    const country = data.countryList.find(
      (v: { countryCode: string }) => v.countryCode === formModal.value.countryCode
    );
    if (country) {
      formModal.value.countryName = country.countryNameZh;
    }
  }

  if (formModal.value.sourceArr && formModal.value.sourceArr.length === 2) {
    formModal.value.sourceLarge = formModal.value.sourceArr[0];
    formModal.value.sourceSmall = formModal.value.sourceArr[1];
  }

  if (pageType === 'edit') {
    formModal.value.customerLeadId = router.currentRoute.value.query.id;
    editLead(formModal.value).then((res: any) => {
      message.success('操作成功');
      emit('submit');
    });
  } else {
    addLead(formModal.value).then((res: any) => {
      message.success('操作成功');
      emit('submit');
    });
  }
};

//获取品牌
const getBrandListFun = () => {
  getBrandList().then((res: any) => {
    data.brandList = res || [];
  });
};

//获取数据源
const getSourceListFun = () => {
  getSourceList().then((res: any) => {
    data.platformList = res || [];
  });
};

//获取跟进人 人员
const getAllUsersFun = () => {
  getAllUsers().then((res: any) => {
    data.userList = (res || []).filter((v: { status: number }) => v.status === 1);
  });
};

//获取跟进状态
const getFollowStatusList = () => {
  leadFollowStatusList().then((res: any) => {
    data.followStatusList = res || [];
  });
};

//获取客户来源 大类小类的二级联动
const getLeadSourceLargeDataFun = () => {
  findDictByCodeList({
    code: 'leadSourceLarge',
  }).then((res: any) => {
    data.sourceData = res || [];
  });
};

//获取市场活动数据
const getcampaignDataFun = () => {
  pageListLink({
    getAll: 1,
  }).then((res: any) => {
    data.campaignData = res.records || [];
  });
};

//获取推送状态
const getPustStatusList = () => {
  getCustomerLeadStatusList().then((res: any) => {
    data.pustStatusList = res || [];
  });
};

//获取推送状态
const getCountrySelectListFun = () => {
  getCountrySelectList().then((res: any) => {
    data.countryList = res || [];
  });
};
</script>

<style scoped lang="less">
.title-min {
  line-height: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  .label {
    background-color: rgb(205, 224, 245);
    color: rgb(45, 140, 240);
    padding: 2px 8px;
    border-radius: 3px;
    margin-right: 10px;
  }
}
.cell-wrap {
  border: 1px solid #eee;
  padding: 18px;
  margin-bottom: 15px;
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
    .tips {
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
      width: 100px;
      text-align: right;
      color: #999;
    }
    .bd {
      flex: 1;
      color: #666;
      margin-right: 30px;
    }
  }
}
.btn-wrap {
  text-align: center;
  padding: 20px 0;
}
</style>
