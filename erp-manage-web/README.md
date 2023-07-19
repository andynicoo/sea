# manager-admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 菜单配置与权限，路由配置
+ 菜单全部在权限管理菜单配置
+ 菜单的menuCode与路由name要对应
+ 页面权限放在store.vars.auth.routeUthMap里面记录所有页面的路由name
+ 按钮权限使用自定义指令v-permission="['edit']"，如果编辑是跳转页面，
自动拼接父级的menuCode如按钮所在页面name为‘erp_message’，那么编辑页面的路由name设置为‘erp_message_edit’,
其中edit为按钮的code,在菜单管理配置。
+ 路由meta对象title为面包屑显示，breadcrumb控制是否显示面包屑，pathName左侧菜单要命中的上级key对应菜单的menuCode,auth设置可以强制跳转页面，忽略store.vars.auth.routeUthMap数据

