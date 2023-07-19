const ELTABS = ['PC端', 'H5端', '小程序'];

export default {
  name: 'TestTab',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    // 位置
    position: {
      type: String,
      default: 'top',
      validator: (val) => ['top', 'right', 'bottom', 'left'].includes(val),
    },
    value: {
      type: String,
      default: '',
    },
    tabData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showName: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(vm) {
      const { name = '' } = vm;
      this.$emit('change', name);
    },
  },

  render(h) {
    return (
      <el-tabs value={this.value} tab-position={this.position} onTab-click={this.handleClick}>
        {this.tabData.map((item) => {
          return (
            <el-tab-pane label={item.label} key={item.key} name={item.name}>
              {this.showName ? item.name : ''}
            </el-tab-pane>
          );
        })}
      </el-tabs>
    );
  },
};
