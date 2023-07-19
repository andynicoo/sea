<template>
  <a-layout-header :style="{ background: '#fff', padding: '0', height: '60px' }">
    <div class="wrap">
      <div class="trigger">
        <MenuUnfoldOutlined class="icon" v-show="collapsed" @click="triggerCollapsed(false)" />
        <MenuFoldOutlined class="icon" v-show="!collapsed" @click="triggerCollapsed(true)" />
      </div>
      <div class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item v-for="(title, index) of titleList" :key="index">{{ title }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="operation">
        <div class="cell">
          <span class="login-out">
            <PoweroffOutlined class="icon" @click="loginOut()" />
          </span>
        </div>
        <div class="cell">
          <span class="user-info" @click="userInfoDetail()">
            <UserOutlined class="icon" />
            <span>{{ userInfo.userName || '-' }}</span>
          </span>
        </div>
        <div class="cell">
          <!-- trigger="click" -->
          <a-popover placement="bottom">
            <template #content>
              <div class="list">
                <a-button
                  v-for="(item, index) of enterprise.list"
                  :key="index"
                  block
                  :type="item.id === enterprise.record.id ? 'link' : 'text'"
                  @click="selectRecord(item)"
                >
                  {{ item.name }}
                </a-button>
              </div>
            </template>
            <span class="enterprise-name" type="text">
              <SwapOutlined class="icon" />
              <span>{{ enterprise.record.name || '-' }}</span>
            </span>
          </a-popover>
        </div>
      </div>
    </div>
  </a-layout-header>
  <UserInfoModal ref="userInfoModal" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import router from '@/router';
import { useStore } from '@/stores/store';
import UserInfoModal from '@/components/user/UserInfoModal.vue';
import { Modal } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { getBaseUserInfo } from '@/api/user/user';
import { getEnterpriseSelect } from '@/api/base/basicsData';
import type { IUserInfo, IEnterprise, IEnterpriseRecord, ITabsRecord } from '@/types';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  UserOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue';

const collapsed = computed<boolean>(() => useStore().collapsed);
const enterprise = computed<IEnterprise>(() => useStore().enterprise);
const userInfo = computed<IUserInfo>(() => useStore().userInfo);
const tabsList = computed<Array<ITabsRecord>>(() => useStore().tabsList);
const titleList = ref<Array<string>>([]);

watch(
  () => router.currentRoute.value.path,
  () => {
    setTitleList();
  }
);

onMounted(() => {
  if (!enterprise.value.list.length) {
    getEnterpriseSelectFun();
  }
  if (!userInfo.value.userId) {
    getBaseUserInfoFun();
  }
  setTitleList();
});

// 设置标题导航
const setTitleList = () => {
  const tab = tabsList.value.find((v: ITabsRecord) => v.path === router.currentRoute.value.path);
  if (tab) {
    titleList.value = tab.titleList;
  } else {
    titleList.value = [];
  }
};

// 切换trigger
const triggerCollapsed = (flag: boolean) => {
  useStore().setCollapsed(flag);
};

// 退出登录
const loginOut = () => {
  Modal.confirm({
    title: '提示',
    content: '是否确认退出系统！',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise<void>((resolve, reject) => {
        useStore().$reset();
        message.success('退出成功');
        router.push('/login');
        resolve();
      });
    },
  });
};

//用户详情
const userInfoModal: Ref = ref(null);
const userInfoDetail = () => {
  userInfoModal.value.visible = true;
};

//选择企业主体
const selectRecord = (item: IEnterpriseRecord) => {
  useStore().setEnterpriseRecord(item);
  // location.reload();
};

//获取企业选项
const getEnterpriseSelectFun = () => {
  getEnterpriseSelect().then((res: any) => {
    if (res && res.length > 0) {
      useStore().setEnterpriseList(res);
      useStore().setEnterpriseRecord(res[0]);
    }
  });
};

//获取企业选项
const getBaseUserInfoFun = () => {
  getBaseUserInfo({
    userId: useStore().loginInfo.openid,
  }).then((res: any) => {
    useStore().setUserInfo(res || {});
  });
};
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  .trigger {
    width: 60px;
    height: 60px;
    text-align: center;
    .icon {
      font-size: 18px;
    }
  }
  .breadcrumb {
    width: auto;
    padding-top: 19px;
  }
  .operation {
    flex: 1;
    padding-right: 20px;
    .cell {
      float: right;
      margin-right: 16px;
      padding: 0 4px;
    }
    .login-out {
      .icon {
        font-size: 16px;
      }
    }
    .user-info {
      cursor: pointer;
      .icon {
        font-size: 15px;
        margin-right: 4px;
      }
    }
    .enterprise-name {
      .icon {
        font-size: 15px;
        margin-right: 4px;
      }
    }
  }
}
.list {
  width: 120px;
}
</style>
