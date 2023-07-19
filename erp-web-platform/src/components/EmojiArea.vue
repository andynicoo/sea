<template>
  <div class="emojibox">
    <div class="emojiline" v-if="disabledEmoji">
      <div class="chatIcon">
        <a-popover
          placement="top"
          trigger="click"
          class="emoBox"
          overlayClassName="popoverbox"
        >
          <div v-if="!disabled" slot="content" class="emotionList">
            <a
              href="javascript:void(0);"
              @click="getEmo(index)"
              v-for="(item, index) in faceList"
              :key="index"
              class="emotionItem"
              >{{ item }}</a
            >
          </div>
          <span class="iconfont iconbiaoqing"></span>
        </a-popover>
      </div>
    </div>
    <a-textarea
      :value="product"
      class="chatText"
      :disabled="disabled"
      type="text"
      :id="ids"
      @input="onInput"
      :rows="10"
      v-bind="$attrs"
    ></a-textarea>
  </div>
</template>

<script>
import emojiData from '@/util/emoji.json'
export default {
  model: {
    prop: 'product',
    event: 'input'
  },
  props: {
    product: {
      type: String,
      default: ''
    },
    ids: {
      type: String,
      default: 'textarea'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledEmoji: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    for (let i in this.$data.emojiData) {
      this.$data.faceList.push(this.$data.emojiData[i].char)
    }
  },
  data() {
    return {
      visible: false,
      emojiData,
      faceList: [],
      textarea: ''
    }
  },
  methods: {
    getEmo(index) {
      var textArea = document.getElementById(this.$props.ids)
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str)
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length
          textArea.focus()
        }
      }
      changeSelectedText(textArea, this.faceList[index])

      this.$emit('input', textArea.value)
      this.$emit('change', textArea.value)
      return
    },
    onInput(event) {
      this.$emit('input', event.target.value)
      this.$emit('change', event.target.value)
    }
  }
}
</script>
<style>
.popoverbox {
  width: 500px;
}
</style>

<style scoped>
.emojibox {
  display: inline-block;
  position: relative;
  width: 100%;
}
.ant-popover {
  height: 100px;
  width: 400px;
  overflow: scroll;
  overflow-x: auto;
}

.chatIcon {
  padding: 0 10px;
  font-size: 25px;
  display: inline-block;
}
.emotionList {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}
.emotionItem {
  width: 10%;
  font-size: 20px;
  text-align: center;
}
.emotionItem {
  text-decoration: none;
}
.emotionItem:link {
  text-decoration: none;
}
.emotionItem:visited {
  text-decoration: none;
}
.emotionItem:hover {
  text-decoration: none;
}
.emotionItem:active {
  text-decoration: none;
}
.emojiline {
  /* height: 40px; */
  /* background: #f7f7f7; */
  position: absolute;
  width: auto;
  right: -40px;
  cursor: pointer;
}
.iconbiaoqing {
  font-size: 20px;
}
</style>
