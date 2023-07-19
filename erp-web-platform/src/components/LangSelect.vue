<template>
  <div style="color:#000; width: 100px;" class="me-mr-2 me-lang-select">
    <a-dropdown :trigger="['click']" selectedKeys="zh" @click="changeLang">
      <a class="ant-dropdown-link linkcolor">
        <a-icon type="global" />
        {{ curLanguage }} <a-icon type="down" />
      </a>

      <a-menu slot="overlay" @click="handleClick">
        <a-menu-item
          v-for="item in countyList"
          :key="item.key"
          :disabled="language == item.key"
        >
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      curLanguage: '',
      countyList: [
        { name: '中文简体', key: 'zh_cn' },
        { name: '中文繁体', key: 'zh_tw' },
        { name: 'English', key: 'en_bg' },
        { name: 'Malaysia', key: 'ma_ma' },
        { name: 'ภาษาไทย', key: 'th_th' },
        { name: 'Indonesia', key: 'in_id' },
        { name: 'Portugal', key: 'pt_pt' },
        { name: 'Việt Nam', key: 'vi_vn' }
      ]
    }
  },
  mounted() {
    // console.log(this.language)
    this.countyList.map((el, index) => {
      if (el.key == this.language) {
        this.curLanguage = this.countyList[index].name
      }
    })
  },
  computed: {
    language() {
      return Cookies.get('language')
      //return this.$store.getters.language
    }
  },
  methods: {
    handleClick(lang) {
      // console.log('click', lang)
      // this.$i18n.locale = lang.key
      // this.$store.dispatch('app/setLanguage', lang)
      this.$store.commit('SET_LANGUAGE', lang.key)
      Cookies.set('language', lang.key)
      location.reload()
    },
    changeLang(key) {
      console.log(key)
    }
  }
}
</script>
<style lang="scss" scoped>
.linkcolor {
  color: #65666c;
}
</style>
