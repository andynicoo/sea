<template>
  <div class="me-pa-2">
    <a-form :form="form" :label-col="{ span: 1 }" :wrapper-col="{ span: 23 }">
      <div id="textareaCollection">
        <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <a-textarea
            v-decorator="['urls', { rules: urlRules }]"
            :placeholder="$t('goodsCollection.urlsPlaceHolder')"
            :rows="18"
          />
        </a-form-item>
      </div>
      <div id="supplyPlatform">
        <a-form-item>
          <span class="me-mr-2">
            {{ $t('goodsCollection.supplyPlatform') }}:
          </span>
          <a-space>
            <a-tooltip
              placement="bottom"
              v-for="logo in imgLogoLinksArr"
              :key="logo.value"
              v-show="!['淘宝', '天猫', '拼多多'].includes(logo.displayName)"
            >
              <template slot="title">
                <span>{{ logo.displayName }}</span>
              </template>
              <a :href="logo.url" target="__blank">
                <a-avatar :size="28" :src="logo.selectImg" shape="square" />
              </a>
            </a-tooltip>
          </a-space>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import CrawlApi from '@/api/crawl'
import collectionMixins from '@/mixins/collectionMixins'
import bus from '@/bus'
import { getCollectSites } from '@/util'

export default {
  mixins: [collectionMixins],
  data() {
    return {
      currentType: 1,
      form: this.$form.createForm(this),
      urlRules: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              this.$emit('input', true)
              callback(new Error(this.$t('goodsCollection.urlsValidError1')))
              return
            }
            var urls = value.split('\n')
            var valid = urls
              .filter((url) => !!url)
              .every((url) => /^http(s)?:\/\//.test(url))
            if (!valid) {
              this.$emit('input', true)
              callback(new Error(this.$t('goodsCollection.urlsValidError2')))
              return
            }
            this.$emit('input', false)
            callback()
          }
        }
      ],
      imgLogoLinksArr: getCollectSites(),
      loading: false
    }
  },

  mounted() {},
  methods: {
    /**
     * 前置校验拼多多
     */
    onCollectionBefor() {
      this.$data.loading = true
      const { form } = this.$data
      return new Promise((resolve) => {
        form
          .validateFields()
          .then(({ urls }) => {
            let urlArr = urls.split('\n').filter((url) => !!url)
            resolve(urlArr)
          })
          .finally(() => {
            this.$data.loading = false
          })
      })
    },
    /**
     * 采集到采集箱
     */
    importSubmit(urlArr = [], reqCookies = null) {
      const { form } = this.$data
      let params = {
        linkArr: urlArr,
        reqCookies: reqCookies
      }
      CrawlApi.addCrawlWithLink(params)
        .then(() => {
          bus.$emit('work-flow-steps') // 显示头部导航提示
          this.$message.success(
            this.$t('goodsCollection.linkCollectionSuccess')
          )
        })
        .catch(() => {})
        .finally(() => {
          this.$data.loading = false
          form.resetFields()
        })
    }
  }
}
</script>
