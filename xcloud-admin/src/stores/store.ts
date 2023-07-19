import type {
  IEnterpriseRecord,
  ILoginInfo,
  IMenuRecord,
  IState,
  IUserInfo,
  ITabsRecord,
  IauthoritiesRecord,
} from '@/types';
import { createPinia, defineStore } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

const store = createPinia();
store.use(piniaPluginPersist);

export const useStore: any = defineStore({
  id: 'global',
  state: (): IState => ({
    collapsed: false,
    loginInfo: {
      access_token: '',
      openid: '',
    },
    userInfo: {
      userId: '',
      userName: '',
    },
    menuData: {
      list: [],
      listTree: [],
      record: {
        actionList: [],
        menuId: '',
        menuName: '',
        path: '',
        parentId: '',
        openKeys: [],
        children: [],
      },
    },
    enterprise: {
      list: [],
      record: {
        id: '',
        name: '',
      },
    },
    tabsList: [],
    authoritiesList: [],
    $router: () => ({}),
  }),
  getters: {
    getToken: state => state.loginInfo.access_token || '',
  },
  actions: {
    setCollapsed(data: boolean) {
      this.collapsed = data;
    },
    setLoginInfo(data: ILoginInfo) {
      this.loginInfo = data;
    },
    setUserInfo(data: IUserInfo) {
      this.userInfo = data;
    },
    setMenuList(data: Array<IMenuRecord>) {
      this.menuData.list = data;
    },
    setMenuListTree(data: Array<IMenuRecord>) {
      this.menuData.listTree = data;
    },
    setMenuRecord(data: IMenuRecord) {
      this.menuData.record = data;
    },
    setEnterpriseList(data: Array<IEnterpriseRecord>) {
      this.enterprise.list = data;
    },
    setEnterpriseRecord(data: IEnterpriseRecord) {
      this.enterprise.record = data;
    },
    setTabsList(data: Array<ITabsRecord>) {
      this.tabsList = data;
    },
    setAuthoritiesList(data: Array<IauthoritiesRecord>) {
      this.authoritiesList = data;
    },
    setRouter(router: any) {
      this.$router = router;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'xcloud-admin',
        storage: localStorage,
      },
    ],
  },
});

export default store;
