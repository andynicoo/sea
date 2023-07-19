<template>
  <div class="emojibox">
    <template v-if="textType == 'textarea'">
      <a-textarea
        :value="product"
        class="chatText"
        type="text"
        :id="ids"
        v-bind="$attrs"
        @input="onInput"
      ></a-textarea>
    </template>
    <template v-else>
      <a-input
        :value="product"
        class="chatText"
        type="text"
        v-bind="$attrs"
        :id="ids"
        @input="onInput"
      ></a-input>
    </template>
    <div class="chatIcon" v-if="!disabledEmoji">
      <a-popover
        placement="top"
        trigger="click"
        class="emoBox"
        overlayClassName="popoverbox"
      >
        <div slot="content" class="emotionList">
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
      default: 'inputid'
    },
    textType: {
      type: String,
      default: 'input'
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
  display: initial;
  position: relative;
}
.ant-popover {
  height: 100px;
  width: 400px;
  overflow: scroll;
  overflow-x: auto;
}
/* left content */
.chatText {
  display: inline-block;
  margin-right: 50px;
}
/* right content */
.chatIcon {
  padding: 0 10px;
  font-size: 25px;
  display: inline-block;
  position: absolute;
  top: -12px;
  right: 0;
  width: 50px;
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
.iconbiaoqing {
  font-size: 20px;
}
</style>
