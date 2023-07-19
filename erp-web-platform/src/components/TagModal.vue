<template>
  <a-modal
    :visible="value"
    :width="500"
    @ok="ok"
    @cancel="cancel"
    :maskClosable="false"
    :afterClose="afterClose"
    title="设置标签"
  >
    <template v-for="item in tagsList">
      <div class="tags-modal" :key="item.colorCode">
        <a-checkbox :checked="item.checked" @change="(e) => change(e, item)">
        </a-checkbox>
        <a-input
          v-model="item.tagsContent"
          :style="{ backgroundColor: `#${item.colorCode}` }"
          :maxLength="15"
          @blur="onBlur(item)"
        />
      </div>
    </template>
  </a-modal>
</template>

<script>
import Order from '@/api/order'
export default {
  name: 'TagModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      colorList: [
        '1abc9c',
        '2ecc71',
        '3498db',
        '9b59b6',
        'e74c3c',
        'f1c40f',
        'c0392b',
        'ff7f50',
        '70a1ff',
        '1e90ff',
        'd6336c'
      ],
      tagsList: [],
      tagsListCopy: []
    }
  },
  mounted() {
    this.getTags()
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      const { orderLabels = [] } = this.data
      this.tagsList = this.tagsList.map((item) => ({
        ...item,
        checked: orderLabels && orderLabels.includes(item.colorCode)
      }))
      this.tagsListCopy = JSON.parse(JSON.stringify(this.tagsList))
    },
    async getTags() {
      try {
        const { data } = await Order.getOrderColorTags()
        this.tagsList = data || []
      } catch (error) {
        console.error(error)
      }
    },
    async onBlur({ colorCode, tagsContent }) {
      const { tagsListCopy } = this
      this.tagsListCopy = tagsListCopy.map((ele) => {
        if (ele.colorCode === colorCode && ele.tagsContent !== tagsContent) {
          Order.setOrderColorTags({ colorCode, tagsContent }).then(
            ({ code }) => {
              if (code === 0) {
                ele.tagsContent = tagsContent
                this.$emit('change', { colorCode, tagsContent })
              }
            }
          )
        }
        return ele
      })
    },
    change(e, item) {
      console.log(e.target.checked)
      item.checked = e.target.checked
    },
    ok() {
      const { tagsList } = this
      const { ordersn } = this.data
      const colorCodesData = tagsList.map(
        ({ checked, colorCode }) => checked && colorCode
      )
      Order.setOrderLabel({ colorCodesData, ordersn }).then(() => {
        this.successAlert(this.$t('common.handlerSuccess'))
        this.cancel()
        this.$emit('ok')
      })
    },
    cancel() {
      this.$emit('input', false)
    },
    afterClose() {
      this.$emit('update:data', null)
    }
  }
}
</script>

<style lang="less">
.tags-modal {
  display: flex;
  align-items: center;
  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin: 0 8px;
  }
}
</style>
