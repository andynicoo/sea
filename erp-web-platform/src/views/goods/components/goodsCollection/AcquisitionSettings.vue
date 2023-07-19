<template>
  <div>
    <div class="em-setting-dialog-header">
      <div class="setting-dialog-title">
        <strong>
          {{
            setTabs === 1
              ? $t('goodsCollection.acquisitionSettings')
              : $t('goodsCollection.claimSetting')
          }}
        </strong>
        <!-- <router-link class="help-btn" target="_blank" :to="{path:'/welcome',query:{id:'1'}}">查看帮助</router-link> -->
      </div>
    </div>
    <div class="em-setting-dialog-body">
      <a-tabs
        type="card"
        :tabBarGutter="0"
        v-model="setTabs"
        :tabBarStyle="{
          'padding-left': '16%',
          margin: '0 0 0 -4px',
          height: '50px'
        }"
        size="large"
        class="me-tabs-bar-h50"
        @change="getListCrawlTemplate"
      >
        <!-- 通用设置 -->
        <a-tab-pane :key="1" v-if="setType !== 'claimSet'">
          <span slot="tab">
            <a-icon type="setting" />
            {{ $t('goodsCollection.acquisitionSettings') }}
          </span>
          <CommonSetting
            :setData="crawlTemplateData"
            :setTabs="setTabs"
            ref="commonSetting"
          />
        </a-tab-pane>
        <!-- 认领设置 -->
        <a-tab-pane :key="2">
          <span slot="tab">
            {{ $t('goodsCollection.claimSetting') }}
          </span>
          <ClaimSetting
            :setData="crawlTemplateData"
            :setTabs="setTabs"
            ref="claimSetting"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="em-setting-dialog-footer">
      <div class="template-box">
        <div class="template-title">
          {{
            setTabs === 1
              ? $t('goodsCollection.setupTemplate')
              : $t('goodsCollection.claimSettingTemplate')
          }}
        </div>
        <a-select
          v-model="currentTemplateId"
          style="width: 200px;"
          :dropdownStyle="{ padding: '5px 15px' }"
          @change="getCrawlTemplate"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0;" />
            <div
              style="padding: 4px 8px; cursor: pointer; color: #f7622f;"
              @mousedown="(e) => e.preventDefault()"
              @click="createTemplate"
            >
              {{ $t('goodsCollection.createTemplate') }}
            </div>
            <div
              class="me-handler-danger"
              style="padding: 4px 8px; cursor: pointer;"
              @mousedown="(e) => e.preventDefault()"
              @click="manageTemplate"
            >
              {{ $t('goodsCollection.manageTemplate') }}
            </div>
          </div>
          <a-select-option
            v-for="item in templateOptions"
            :key="item.templateId"
            :value="item.templateId"
          >
            {{ item.templateName }}
          </a-select-option>
        </a-select>
      </div>
      <a-button key="back" @click="handleCancel">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="submitLoading"
        @click="handleSave"
      >
        {{ $t('common.save') }}
      </a-button>
    </div>
    <!-- 创建模板 -->
    <a-modal
      :visible="createVisible"
      :title="
        setTabs === 1
          ? $t('goodsCollection.addSetupTemplate')
          : $t('goodsCollection.claimSettingTitle6')
      "
      :confirm-loading="createLoading"
      :maskClosable="false"
      @ok="createTemplateOk"
      @cancel="createTemplateCancel"
      destroyOnClose
      :width="600"
    >
      <CreateTemplate ref="createTemplate" />
    </a-modal>
    <!-- 认领配置 -->
    <a-modal
      :visible="manageVisible"
      :title="
        setTabs === 1
          ? $t('goodsCollection.setupTemplate')
          : $t('goodsCollection.claimSettingTemplate')
      "
      :confirm-loading="manageLoading"
      :maskClosable="false"
      @ok="manageTemplateOk"
      @cancel="manageTemplateCancel"
      destroyOnClose
      :width="800"
    >
      <ManageTemplate
        ref="manageTemplate"
        :templateType="setTabs"
        :list="templateOptions"
      />
    </a-modal>
  </div>
</template>

<script>
import CommonSetting from './CommonSetting'
import ClaimSetting from './ClaimSetting'
import ManageTemplate from './ManageTemplate'
import CreateTemplate from './CreateTemplate'
import CrawlApi from '@/api/crawl'

export default {
  components: {
    CommonSetting,
    ClaimSetting,
    ManageTemplate,
    CreateTemplate,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    setType: {
      type: String,
      defalut: ''
    }
  },
  data() {
    return {
      submitLoading: false,
      createVisible: false,
      currentTemplateId: null,
      createLoading: false,
      manageLoading: false,
      manageVisible: false,
      crawlTemplateData: {},
      templateOptions: [],
      setTabs: 1
    }
  },
  mounted() {
    if (this.setType === 'claimSet') {
      this.setTabs = 2
    }
    this.getListCrawlTemplate()
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('closeVisible')
    },
    // 保存
    handleSave() {
      const setSubmit =
        this.setTabs === 1 ? this.$refs.commonSetting : this.$refs.claimSetting
      setSubmit.submit().then(() => {
        this.$emit('closeVisible')
        this.$message.success(this.$t('common.handlerSuccess'))
      })
    },
    // 创建模板
    createTemplate() {
      this.createVisible = true
    },
    createTemplateOk() {
      this.createLoading = true
      const submit =
        this.setTabs === 1
          ? this.$refs.createTemplate.collectSubmit()
          : this.$refs.createTemplate.claimSubmit()
      submit
        .then(() => {
          this.createLoading = false
          this.createVisible = false
          this.$message.success(this.$t('common.handlerSuccess'))
          this.getListCrawlTemplate()
        })
        .catch(() => {
          this.createLoading = false
        })
    },
    createTemplateCancel() {
      this.createVisible = false
      this.createLoading = false
    },
    // 管理模板
    manageTemplate() {
      this.manageVisible = true
    },
    getListCrawlTemplate() {
      const getTemplateList =
        this.setTabs === 1
          ? CrawlApi.listCrawlTemplate()
          : CrawlApi.getClaimTemplateList()
      getTemplateList.then(({ data = [] }) => {
        this.templateOptions = data
        let templateArr = data.filter((item) => item.inUse)
        // 判断是否有正在使用的模板，没有的话则用系统默认模板
        if (templateArr.length === 0) {
          templateArr = data.filter((item) => item.defaultTemplate)
        }
        // 校验templateArr是否有值
        if (templateArr.length > 0) {
          const id = templateArr[0].templateId
          this.currentTemplateId = id
          this.getCrawlTemplate(id)
        }
      })
    },
    manageTemplateOk() {
      this.manageLoading = true
      this.$refs.manageTemplate
        .submit()
        .then(() => {
          this.manageLoading = false
          this.manageVisible = false
          this.$message.success(this.$t('common.handlerSuccess'))
          this.getListCrawlTemplate()
        })
        .catch(() => {
          this.manageLoading = false
        })
    },
    manageTemplateCancel() {
      this.getListCrawlTemplate()
      this.manageVisible = false
      this.manageLoading = false
    },
    // 切换模板
    getCrawlTemplate(event) {
      const getTemplateInfo =
        this.setTabs === 1
          ? CrawlApi.getCrawlTemplate({ templateId: event })
          : CrawlApi.getClaimTemplate(event)
      getTemplateInfo.then(({ data }) => {
        this.crawlTemplateData = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.em-setting-dialog-header {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  .setting-dialog-title {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 56px;
    padding-left: 20px;
    font-size: 16px;
    .help-btn {
      font-size: 14px;
      color: #f7622f;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.em-setting-dialog-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
  button + button {
    margin-bottom: 0;
    margin-left: 8px;
  }
}
.template-box {
  background-color: #f2f2f2;
  display: inline-flex;
  margin-right: 10px;
  .template-title {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-right: 0;
    font-size: 14px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}
</style>
