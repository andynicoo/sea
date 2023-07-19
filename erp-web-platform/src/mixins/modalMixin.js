/**
 *  对话框基础参数
 * @type {{methods: {cancel(): void, submit(...[*]=): void}, prop: {visible: {default: boolean, type: BooleanConstructor}, confirmLoading: {default: boolean, type: BooleanConstructor}}}}
 */
let modalMixin={
  props:{
    /**
     * 对话框隐藏和显示
     */
    visible: {
      type: Boolean,
      default: false
    },
    /**
     *  确定按钮加载框
     */
    confirmLoading: {
      type: Boolean,
      default: false
    },
    /**
     * 对话框所需要的参数
     */
    params:{
      type:Object,
      default:()=>({})
    }
  },
  methods:{
    /**
     * 对话框取消函数
     */
     cancel(){
       this.$emit("cancel")
     },
    /**
     *  对话框确定函数
     * @param item 动态参数，可以接受多个
     */
    submit(...item){
       this.$emit("submit",item)
    }
  }
}

export {modalMixin}