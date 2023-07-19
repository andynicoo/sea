export const EditorHeader = '<html><head><link rel="stylesheet" type="text/css" href="https://cdn.quilljs.com/1.3.4/quill.snow.css"></head><body><div class="ql-editor">'
export const EditorFooter = '</div></body></html>'
export function formatEditorContent(content) {
  return EditorHeader + content.replaceAll('<img', '<img style="max-width: 100%"') + EditorFooter
}