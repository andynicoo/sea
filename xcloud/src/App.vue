<template>
  <div id="app">
    <router-view />

    <WaringDrawerVue v-if="waringDrawer" :id="waringDrawerID" :isComplete="true" :visible.sync="waringDrawer" :detailId="detailId" />
  </div>
</template>

<script>
import { getPendingMsg } from '@/api/home/service.js';
export default {
  name: 'App',
  data() {
    return {
      notifyList: [],
      waringDrawer: false,
      waringDrawerID: '',
      detailId: '',
      routerName: this.$router.currentRoute.name,
    };
  },
  components: {
    WaringDrawerVue: () => import('./components/waringDrawer/waringDrawer.vue'),
  },
  created() {
    try {
      document.body.removeChild(document.getElementById('appLoading'));
      setTimeout(function () {
        document.getElementById('app').style.display = 'block';
      }, 500);
    } catch (e) {}
  },

  mounted() {
    if (this.routerName && this.routerName != 'login') {
      setInterval(() => {
        this.timingGetPendingMsg();
      }, 3600000);
    }
  },
  methods: {
    async timingGetPendingMsg() {
      const { data } = await getPendingMsg();
      this.msgList = data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const notify = this.$notify({
          title: '您有一条代办消息',
          dangerouslyUseHTMLString: true,
          message: notifyNode(index, this.$createElement, element, this.closeNotify()),
          position: 'bottom-right',
          customClass: 'notify-node',
          duration: 0,
        });
        this.notifyList.push(notify);
      }
    },

    closeNotify() {
      const submit = (el) => {
        this.waringDrawer = true;
        this.detailId = this.msgList[el].serviceOrderId;
        this.waringDrawerID = this.msgList[el].id;
      };

      const cancel = (el) => {
        this.notifyList[el].close();
      };
      return {
        cancel,
        submit,
      };
    },
  },
};

function notifyNode(sign, h, data, closeNotify) {
  const { orderNo, content, serviceProgress, serviceNo } = data;
  return h('p', { class: 'notify-node' }, [
    h('p', null, orderNo),
    h('p', null, '服务号:' + serviceNo),
    h('p', null, '服务进度：:' + serviceProgress),
    h('div', { class: 'notify-conten' }, content),
    h(
      'el-button',
      {
        attrs: {
          type: 'text',
        },
        on: {
          click: () => closeNotify.cancel(sign), //
        },
      },
      '稍后处理'
    ),
    h(
      'el-button',
      {
        attrs: {
          type: 'primary',
        },
        on: {
          click: () => closeNotify.submit(sign), //
        },
      },
      '立即处理'
    ),
  ]);
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
