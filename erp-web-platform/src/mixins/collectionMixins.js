import { mapState } from 'vuex'

export default {
  props: {
    isStartPlug: {
      type: Boolean,
      defalut: false
    }
  },
  computed: {
    ...mapState({
      systemConfig: (state) => state.app.systemConfig
    })
  },
  data() {
    return {
      recordUrlNum: null,
      recordUrlArr: []
    }
  },

  async mounted() {
    //
  },

  methods: {
    showErrorByDownload() {
      this.$notification.error({
        message: this.$t('common.error'),
        description: (createElement) =>
          createElement('div', {}, [
            createElement('span', {}, this.$t('goodsCollection.downloadError')),
            createElement(
              'a',
              {
                class: { 'me-link': true },
                attrs: {
                  href: this.systemConfig.plug_download_url,
                  target: '__blank'
                }
              },
              this.$t('goodsCollection.newPlugin')
            )
          ])
      })
    },

    showWarningCrawlCount(count, cookies) {
      this.$confirm({
        title: this.$t('common.warn'),
        icon: 'warning',
        okText: this.$t('goodsCollection.cancelCollection'),
        cancelText: this.$t('goodsCollection.continueCollection'),
        content: (h) => (
          <div>
            <p>
              {this.$t('goodsCollection.pddCollectionTooManyContentNum', {
                count: count
              })}
            </p>
            <p>
              {this.$t('goodsCollection.pddCollectionTooManyContentPlugin')}
            </p>
            <div style="color:red; font-size: 12px;">
              {this.$t('goodsCollection.pddCollectionTooManyContentWarn')}
            </div>
          </div>
        ),
        onOk: () => {
          this.$data.loading = false
        },
        onCancel: () => {
          this.$data.loading = false
          this.importSubmit(this.$data.recordUrlArr, cookies)
        }
      })
    }
  }
}
