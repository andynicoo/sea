<template>
  <div class="editor-wrapper">
    <quill-editor class="editor-main ql-editor-wrapper" v-model="content" ref="myQuillEditor" :options="editorOption" @focus="onEditorFocus($event)" @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"></quill-editor>
    <div class="upload-wrapper">
      <el-upload ref="uploadImg" :action="uploadUrl" :on-success="imageSuccess" :show-file-list="false" accept="image/*">
        <span slot="trigger" size="small" type="primary" id="upload-img-block"></span>
      </el-upload>
      <el-upload ref="uploadVideo" :action="uploadUrl" :on-success="videoSuccess" :show-file-list="false" accept="video/*">
        <span slot="trigger" size="small" type="primary" id="upload-video-block"></span>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import {
    quillEditor
  } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {EditorHeader, EditorFooter} from './formatEditorContent'
  export default {
    name: "IEditor",
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    computed: {
      content: {
        get() {
          return this.value.replace(EditorHeader, '').replace(EditorFooter, '')
        },
        set(val) {
          this.$emit("update:value", val);
        },
      }
    },
    data() {
      return {
        uploadUrl: this.baseUrl + "/file/oss/upload",
        editor: null, // 富文本编辑器对象
        editorOption: {
          //  富文本编辑器配置
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
                ['blockquote', 'code-block'], //引用，代码块
                [{
                  header: 1
                }, {
                  header: 2
                }], // 标题，键值对的形式；1、2表示字体大小
                [{
                  list: 'ordered'
                }, {
                  list: 'bullet'
                }], //列表
                [{
                  script: 'sub'
                }, {
                  script: 'super'
                }], // 上下标
                [{
                  indent: '-1'
                }, {
                  indent: '+1'
                }], // 缩进
                [{
                  size: ['small', false, 'large', 'huge']
                }], // 字体大小
                [{
                  header: [1, 2, 3, 4, 5, 6, false]
                }], //几级标题

                [{
                  color: []
                }, {
                  background: []
                }], // 字体颜色，字体背景颜色
                [{
                  font: []
                }], //字体
                [{
                  align: []
                }], //对齐方式

                ['clean'], //清除字体样式
                ['image', 'video'], //上传图片、视频
              ],
              handlers: {
                image(value) {
                  if (value) {
                    document.getElementById('upload-img-block').click();
                  } else {
                    this.quill.format('image', false);
                  }
                },
                video(value) {
                  if (value) {
                    document.getElementById('upload-video-block').click();
                  } else {
                    this.quill.format('video', false);
                  }
                },
              }
            }
          },
          placeholder: '请输入内容'
        }
      };
    },
    components: {
      quillEditor,
    },
    created() {
      
    },
    mounted() {
      this.editor = this.$refs.myQuillEditor.quill;
    },
    beforeDestroy() {
      this.editor = null;
      delete this.editor;
    },
    methods: {
      // 上传图片
      imageSuccess(res, file, fileList) {
        if(res.message === 'success') {
          this.insert('image', res.data.fileUrl)
        }
      },
      // 上传视频
      videoSuccess(res, file, fileList) {
        if(res.message === 'success') {
          this.insert('video', res.data.fileUrl)
        }
      },
      insert(type, url) {
        let length = this.editor.selection.savedRange.index
        this.editor.insertEmbed(length, type, url)
        this.editor.setSelection(length+1)
      },
      onEditorReady(editor) {
        // 准备编辑器
      },
      msgTextLastPos() {
        // 解决浏览器的兼容问题，做如下条件判断
        var obj = document.querySelector('.ql-editor')
        obj.focus();
        var range = document.createRange();
        range.selectNodeContents(obj);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      },
      // 失去焦点事件
      onEditorBlur() {
      }, 
      // 获得焦点事件
      onEditorFocus() {}, 
      // 内容改变事件
      onEditorChange() {
        let length = this.editor.selection.savedRange.index
        this.editor.setSelection(length)
      },
      saveHtml: function(event) {
        
      }
    }
  };
</script>

<style lang="scss" scoped>
// .editor-wrapper {
//   margin-top: -30px;
// }
.editor-main {
  line-height: normal;
}
.upload-wrapper {
  position: absolute;
}
::v-deep .ql-editor {
  height: 203px;
  .ql-snow {
    video {
      object-fit: fill;
    }
    .ql-picker.ql-size {
      .ql-picker-label[data-value=small]::before,
      .ql-picker-item[data-value=small]::before {
        content: '10px'
      }
      .ql-picker-label::before,
      .ql-picker-item::before {
        content: '默认大小'
      }
      .ql-picker-label[data-value=large]::before,
      .ql-picker-item[data-value=large]::before {
        content: '18px';
      }
      .ql-picker-label[data-value=huge]::before, 
      .ql-picker-item[data-value=huge]::before {
        content: '32px';
      }
    }
    .ql-picker.ql-header {
      .ql-picker-label[data-value="1"]::before,
      .ql-picker-item[data-value="1"]::before {
        content: '标题1'
      }
      .ql-picker-label[data-value="2"]::before,
      .ql-picker-item[data-value="2"]::before {
        content: '标题2'
      }
      .ql-picker-label[data-value="3"]::before,
      .ql-picker-item[data-value="3"]::before {
        content: '标题3'
      }
      .ql-picker-label[data-value="4"]::before,
      .ql-picker-item[data-value="4"]::before {
        content: '标题4'
      }
      .ql-picker-label[data-value="5"]::before,
      .ql-picker-item[data-value="5"]::before {
        content: '标题5'
      }
      .ql-picker-label[data-value="6"]::before,
      .ql-picker-item[data-value="6"]::before {
        content: '标题6'
      }
      .ql-picker-label::before,
      .ql-picker-item::before {
        content: '默认标题'
      }
    }
    .ql-picker.ql-font {
      .ql-picker-label::before,
      .ql-picker-item::before {
        content: '标准字体'
      }
      .ql-picker-label[data-value=serif]::before,
      .ql-picker-item[data-value=serif]::before {
        content: '衬线字体'
      }
      .ql-picker-label[data-value=monospace]::before,
      .ql-picker-item[data-value=monospace]::before {
        content: '等宽字体'
      }
    }
  }
}
</style>
