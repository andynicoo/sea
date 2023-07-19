<template>
  <div class="main">
    <div class="top header" :style="extendNote ? 'height: 0px; overflow: hidden;' : ''">
      <div class="grid-content bg-purple white-bg pd-20">
        <h3>最近访问</h3>
        <Record />
      </div>
      <div class="grid-content bg-purple-light white-bg pd-20">
        <h3>账号信息</h3>
        <el-row>
          <div class="user-portrait">{{ headName }}</div>
          <div>
            <el-row>
              <el-col :span="24">
                <span class="nicke-name">{{ userInfo.nickName }}</span> <el-tag class="user-tag white-bg" v-if="userInfo.workPosition"> {{ userInfo.workPosition }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              {{ userInfo.mobile }}
            </el-row>
            <el-button @click="updatePwsShow = true" type="text"> 修改密码 </el-button>
          </div>
        </el-row>
        <p class="lately-login">最近登录时间:{{ lastLoginTime }}</p>
      </div>
    </div>
    <updatePwsVue v-if="updatePwsShow" :visible.sync="updatePwsShow" />
    <el-row id="noteContent" class="content white-bg" :style="extendNote ? 'margin-top: 0px; ' : ''">
      <el-col :span="24">
        <note @extendNote="(v) => (extendNote = v)" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Note from '@/view/home/common/home/note/note2.vue';
import { getBaseUserInfo } from '../../api/user';
import Record from '@/view/home/common/home/record/record';
import store from '@/store';
export default {
  components: {
    Note,
    Record,
    updatePwsVue: () => import('./common/home/updatePws/updatePws.vue'),
  },
  data() {
    return {
      userInfo: {
        nickName: '',
        workNum: '',
      },
      updatePwsShow: false,
      followItem: '',
      extendNote: false,
    };
  },
  computed: {
    lastLoginTime() {
      return JSON.parse(localStorage.getItem('userInfo')).lastLogonTime || '暂无';
    },

    headName() {
      return this.userInfo.workNum.slice(-4);
    },
  },
  async created() {
    try {
      const { code, data } = await getBaseUserInfo({ userId: store.state.user.userId });
      this.userInfo = (code == 0 && data) || {};
    } catch (err) {
      this.userInfo = { nickName: '' };
    }
  },

  async mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
@import './less/home.less';
</style>

<style lang="less">
.notify-node {
  .notify-conten {
    height: 54px;
    background: #f5f8fb;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    padding: 10px;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
    font-size: 12px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
</style>
