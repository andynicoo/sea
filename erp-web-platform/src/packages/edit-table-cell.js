export default {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input v-model.trim="value" @change="handleChange" @pressEnter="check" :placeholder="placeholder" style="width:190px" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
            style="margin:0 8px"
          />
           <a-icon type="close" @click="close" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
         
        </div>
      </div>
    `,
  props: {
    text: String,
    placeholder: String
  },
  data() {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.value = value
    },
    check() {
      this.editable = false
      this.$emit('change', this.value)
    },
    close() {
      this.editable = false
      this.value = this.text
    },
    edit() {
      this.editable = true
    }
  }
}
