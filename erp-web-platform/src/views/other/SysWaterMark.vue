<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="title"> </a-page-header>
    <div class="system-water-mark-wrap">
      <div
        class="water-mark-item"
        v-for="item in waterMatkList"
        :key="item.templateId"
      >
        <div class="me-transform-background">
          <img v-lazy="item.cover" />
        </div>
        <p>{{ item.templateName }}</p>
        <div class="edit-mask">
          <a-button type="primary" @click="edit(item)">
            {{ $t('marketingWatermark.startedMak') }}
          </a-button>
        </div>
      </div>
    </div>
    <a-modal
      :title="$t('marketingWatermark.editmark')"
      width="1600px"
      :visible="editVisible"
      destroyOnClose
      :confirmLoading="editConfirmLoading"
      :maskClosable="false"
      @ok="onEditOk"
      @cancel="editVisible = false"
    >
      <template v-if="editObjects">
        <FabricCanvas
          :objects="editObjects.templateProperty"
          ref="markTemplate"
        />
      </template>
    </a-modal>

    <a-modal
      :title="$t('marketingWatermark.configmark')"
      width="600px"
      :visible="settingVisible"
      destroyOnClose
      :maskClosable="false"
      :confirmLoading="settingConfirmLoading"
      @ok="onSettingOk"
      @cancel="settingVisible = false"
    >
      <AddEditWatermarkTemplateConfig
        ref="addEditConfig"
        :tmpObject="templateObjects"
        :tmpDataUrl="templateDataUrl"
      />
    </a-modal>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import { mapState } from 'vuex'
import FabricCanvas from '@/components/FabricCanvas'
import AddEditWatermarkTemplateConfig from '@/views/other/components/AddEditWatermarkTemplateConfig'

export default {
  data() {
    return {
      waterMatkList: [],
      editVisible: false,
      editObjects: {},
      editConfirmLoading: false,
      settingConfirmLoading: false,
      settingVisible: false,
      templateObjects: null,
      templateDataUrl: null
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.vars?.menuName
    })
  },
  components: {
    FabricCanvas,
    AddEditWatermarkTemplateConfig
  },

  mounted() {
    this.getSystemWaterMark()
  },

  methods: {
    async getSystemWaterMark() {
      let res = await Goods.getWatermarkTemplate({
        size: '30',
        current: 1,
        templateName: null,
        templateType: 1
      })
      if (res && res.code == 0) {
        this.waterMatkList = res.data.records
      }
    },
    edit(record) {
      this.$data.editObjects = record
      this.$data.editVisible = true
      this.$data.editConfirmLoading = false
    },
    onSettingOk() {
      this.$data.settingConfirmLoading = true
      this.$refs.addEditConfig
        .submit()
        .then(() => {
          this.$data.pushVisible = false
          this.$data.settingVisible = false
          this.$data.editVisible = false
          this.$data.currentId = null
          this.$data.templateObjects = null
          this.$data.templateDataUrl = null
          this.$message.success((h) => {
            return (
              <span>
                {this.$t('marketingWatermark.pushSystemTemplateSuccess1')}
                <a
                  onClick={() => this.$router.push('/other/water-mark')}
                  class="me-link">
                  {this.$t('marketingWatermark.pushSystemTemplateSuccess2')}
                </a>
                {this.$t('marketingWatermark.pushSystemTemplateSuccess3')}
              </span>
            )
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.$data.settingConfirmLoading = false
        })
    },
    async onEditOk() {
      const jsons = this.$refs.markTemplate.getJSON()
      const dataURL = this.$refs.markTemplate.getDataURL()
      this.$data.templateObjects = jsons
      this.$data.templateDataUrl = dataURL
      this.$data.settingVisible = true
      this.$data.settingConfirmLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.me-title {
  font-size: 24px;
  font-weight: 500;
}
.system-water-mark-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: #fff;
  padding: 18px;
  .water-mark-item {
    width: 240px;
    margin-bottom: 32px;
    margin-right: 32px;
    box-sizing: content-box;
    position: relative;
    &:hover .edit-mask {
      transition: opacity 0.5s;
      opacity: 1;
    }

    img {
      width: 100%;
    }
    p {
      display: block;
      border: 1px solid #ededed;
      padding: 8px;
      text-align: center;
      box-sizing: border-box;
    }
    .edit-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: rgba($color: #666, $alpha: 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
    }
  }
}
</style>
