import Menu from 'ant-design-vue/es/menu'
const { Item, SubMenu } = Menu
export default {
  name: 'menuItem',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      selectedKeys: [],
      openKeys: []
    }
  },
  watch: {
    collapsed(val) {
      // if (!val) {
      this.updateMenu()
      // }
      // 鼠标移出时清空展开节点
      // if (val) this.openKeys = []
    },
    // 路由切换时更新
    '$route'() {
      this.updateMenu()
    }
  },
  computed: {
    rootSubmenuKeys({ menu }) {
      const keys = []
      // 第一层就是submenu的key
      menu.forEach(item => {
        if (item.children) {
          keys.push(item.menuCode)
        }
      })
      return keys
    }
  },
  mounted() {
    this.updateMenu()
  },
  methods: {
    updateMenu() {
      const arr = this.mapRouteName(this.$route.matched)
      // this.selectedKeys = [this.$route.path]
      this.selectedKeys = arr
      this.openKeys = this.collapsed ? [] : arr.filter(item => item)
    },
    mapRouteName(list = [], path = []) {
      list.forEach(item => {
        if (item.meta?.pathName) {
          path.push(item.meta.pathName)
        }
        path.push(item.name)
      })
      return path
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    renderItem(menu) {
      if (menu.isHide === 'N' || !menu.isHide) {
        return menu.children && menu.children.length > 0 && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem(menu) {
      const props = {
        to: { path: menu.href }
      }
      const on = {
        '!click': () => {
          if (!menu.parentKey) {
            // this.openKeys = []
          }
        }
      }
      return (
        <Item {...{ key: menu.menuCode, on }}>
          <router-link {...{ props }}>
            {this.renderIcon(menu.icon)}
            <span class='title-text'>{menu.menuName}</span>
          </router-link>
        </Item>
      )
    },
    renderSubMenu(menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        <SubMenu {...{ key: menu.menuCode }}>
          <span slot='title'>
            {this.renderIcon(menu.icon)}
            <span class='title-text'>{menu.menuName}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon(icon) {
      if (!icon || icon === 'none') {
        return null
      }
      return (
      // 添加anticon类配合收缩时，隐藏text文字
        <i class='anticon'>
          <i class={`iconfont ${icon}`}></i>
        </i>
      )
    }
  },
  render() {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys,
      inlineCollapsed: this.collapsed,
      defaultSelectedKeys: this.selectedKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }
    const menuTree = menu.map(item => {
      if (item.isHide === 'Y') {
        return null
      }
      return this.renderItem(item)
    })
    return (
      <Menu vModel={this.selectedKeys} {... { props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
