<template>
  <!-- <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="sider-wrap"> -->
  <div class="logo">
    <img v-if="collapsed" src="@/assets/img/logo-min.6b68ed89.svg" />
    <img v-else src="@/assets/img/icon_logo.68052a1c.svg" />
  </div>
  <a-spin :spinning="spinning">
    <a-menu v-model:selectedKeys="selectedKeys" :open-keys="openKeys" theme="dark" mode="inline" class="menu-wrap">
      <template v-for="(item1, index1) of menuTree" :key="index1">
        <a-sub-menu v-if="item1.children && item1.children.length > 0" :key="'p_' + item1.menuId">
          <template #title>
            <FolderOpenFilled />
            <span :title="item1.menuName">{{ item1.menuName }}</span>
          </template>

          <template v-for="(item2, index2) of item1.children" :key="index2">
            <a-sub-menu v-if="item2.children && item2.children.length > 0" :key="'p_' + item2.menuId">
              <template #title>
                <FolderOpenFilled />
                <span class="hand">{{ item2.menuName }}</span>
              </template>
              <a-menu-item v-for="item3 of item2.children" :key="item3.menuId" @click="goPage(item3)">
                <FileFilled />
                <span :title="item3.menuName" class="hand">{{ item3.menuName }}</span>
              </a-menu-item>
            </a-sub-menu>

            <a-menu-item v-else :key="item2.menuId" @click="goPage(item2)">
              <FileFilled />
              <span :title="item2.menuName" class="hand">{{ item2.menuName }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>

        <a-menu-item v-else :key="item1.menuId" @click="goPage(item1)">
          <FileFilled />
          <span>{{ item1.menuName }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-spin>
  <!-- </a-layout-sider> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import router from '@/router';
import { useStore } from '@/stores/store';
import type { IMenuRecord, ITabsRecord } from '@/types';
import { FolderOpenFilled, FileFilled } from '@ant-design/icons-vue';
import { getCurrentUserMenu, getUserInfo } from '@/api/user/user';
import { message } from 'ant-design-vue';

const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const spinning = ref<boolean>(false);
const collapsed = computed<boolean>(() => useStore().collapsed);
const menuList = computed<Array<IMenuRecord>>(() => useStore().menuData.list);
const menuTree = computed<Array<IMenuRecord>>(() => useStore().menuData.listTree);
let parentList: Array<IMenuRecord> = [];

watch(
  () => router.currentRoute.value.path,
  () => {
    setCurrentMenu();
  }
);

onMounted(() => {
  if (menuTree.value.length > 0) {
    setCurrentMenu();
  } else {
    getCurrentUserMenuFun();
  }
  if (useStore().authoritiesList.length === 0) {
    getUserInfo().then((res: any) => {
      useStore().setAuthoritiesList(res.authorities || []);
    });
  }
});

const goPage = (li: IMenuRecord) => {
  const liPath = li.path.indexOf('adminNewApp') !== -1 ? li.path.split('adminNewApp')[1] : '/' + li.path;
  if (router.getRoutes().some((v: { path: string }) => v.path === liPath.toLowerCase())) {
    router.push(liPath);
  } else {
    message.error('未匹配路由：' + liPath);
    console.error('未匹配路由：' + liPath);
  }
};

//设置当前路由菜单
const setCurrentMenu = () => {
  const record: IMenuRecord | undefined = menuList.value.find((v: IMenuRecord) => {
    const liPath = v.path.indexOf('adminNewApp') !== -1 ? v.path.split('adminNewApp')[1] : '/' + v.path;
    return router.currentRoute.value.path === liPath;
  });
  if (record) {
    useStore().setMenuRecord(record);
    parentList = getParentList(record.parentId);
    selectedKeys.value = [record.menuId];
    openKeys.value = parentList.map((v: IMenuRecord) => 'p_' + v.menuId);
    editTabsList(record.menuName, parentList.map((v: IMenuRecord) => v.menuName).reverse());
  } else {
    if (router.currentRoute.value.path === '/home') {
      selectedKeys.value = [];
      openKeys.value = [];
    } else {
      let title: any = '详情';
      if (router.currentRoute.value.query && router.currentRoute.value.query.title) {
        title = router.currentRoute.value.query.title;
      }
      editTabsList(title, parentList.map((v: IMenuRecord) => v.menuName).reverse());
    }
  }
};

//设置tabs
const editTabsList = (menuName: string, parentName: Array<string>) => {
  // useStore().setTabsList([]);
  const currentRoute = router.currentRoute.value; //当前路由
  const filterList: Array<string> = ['/', '/login', '/home']; //过滤掉的路由
  const list = JSON.parse(JSON.stringify(useStore().tabsList)); //tabs列表
  if (
    list.findIndex((v: ITabsRecord) => v.path === currentRoute.path) === -1 &&
    !filterList.includes(currentRoute.path)
  ) {
    const tab = {
      title: menuName,
      path: currentRoute.path,
      query: currentRoute.query,
      titleList: parentName.concat([menuName]),
    };
    list.push(tab);
    useStore().setTabsList(list);
  }
};

//查找所有上级
const getParentList = (parentId: string, arr: Array<IMenuRecord> = []): Array<IMenuRecord> => {
  if (parentId === '0') {
    return arr;
  } else {
    const record: IMenuRecord | undefined = menuList.value.find((v: IMenuRecord) => v.menuId === parentId);
    if (record) {
      arr.push(record);
      return getParentList(record.parentId, arr);
    } else {
      return arr;
    }
  }
};

//获取菜单
const getCurrentUserMenuFun = () => {
  spinning.value = true;
  getCurrentUserMenu()
    .then((res: any) => {
      useStore().setMenuList(JSON.parse(JSON.stringify(res || [])));
      useStore().setMenuListTree(setMenuTree(res || []));
      spinning.value = false;
    })
    .catch(() => {
      spinning.value = false;
    });
};

//构建菜单树结构
const setMenuTree = (list: Array<IMenuRecord>) => {
  return list.filter(father => {
    const branchArr = list.filter(child => father.menuId === child.parentId);
    branchArr.length > 0 ? (father.children = branchArr) : '';
    return father.parentId === '0';
  });
};
</script>

<style scoped lang="less">
.logo {
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  text-align: center;
}
.menu-wrap {
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
