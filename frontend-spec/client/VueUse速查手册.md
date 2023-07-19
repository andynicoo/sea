# VueUse速查手册

新型Vue通用工具,推荐项目中使用,替代其他依赖集

[VueUse](https://vueuse.org/) 是 [Anthony Fu](https://github.com/antfu) 大佬的一个开源项目，它为 Vue 的开发者提供了大量用于 Vue2 和 Vue3 的基本 `Composition API` 实用工具函数。

它有几十个用于常见开发人员用例的解决方案，如跟踪`ref`更改，检测元素可见性，简化常见 Vue 模式，键盘/鼠标输入等。

此文档可快速浏览VueUse支持的功能，帮助不熟悉的同学快速了解/使用

## VueUse 类型&函数(V8.7.5)

- Browser (浏览器) - 可以用于不同的屏幕控件、剪贴板、首选项等等
- Sensors (传感器)- 用来监听不同的 DOM 事件、输入事件和网络事件
- Animation(动画) - 包含易于使用的过渡、超时和计时功能
- State (状态) - 管理用户状态（全局，本地存储，会话存储）
- Element (元素) - 监控/改变/调用 元素状态
- Component (组件) - 为不同的组件方法提供简写
- Utilities (实用方法) -不同的实用方法
- Network (网络) -网络通信相关
- Watch --更高级的观察器类型，如可暂停的观察器、放弃的观察器和条件观察器
- 其它 - 事件、工具 和 Web workers 的不同类型的功能等等


## Browser (浏览器)

- useBluetooth  调用蓝牙相关
- useBreakpoints 动态反馈浏览器视图size
- useBroadcastChannel BroadcastChannel API相关
- useBrowserLocation  获取浏览器location相关
- **useClipboard 粘贴板操作相关**
- useColorMode 颜色模式相关
- useCssVar 动态操作元素css
- useDark 调用黑夜模式
- useEventListener 添加和移除监听器
- useEyeDropper 取色器
- useFavicon 动态调整favicon图标
- useFileSystemAccess 新建/读取/重写本地文件
- useFullscreen 字面意思，切换全屏
- useGamepad Gamepad API相关
- useImage 请求图片，反馈 isLoading
- useMediaControls 媒体控制器
- useMediaQuery 查询页面Media,如是否是大屏模式等
- useMemory Reactive内存信息
- useObjectUrl Reactive一个URL，表示文件路径
- usePermission Reactive Permission，反馈在用户浏览器上的一些可用权限
- usePreferredColorScheme 获取首选颜色方案
- usePreferredDark 是否有dark模式偏好
- usePreferredLanguages 用户的偏好语言，如`zh-CN`
- useScreenOrientation 反馈用户屏幕偏向，一般用于移动端
- **useScreenSafeArea 反馈用户屏幕'安全区域',无遮挡操作区域,一般用于移动端**
- useScriptTag 插入Script tag
- useShare Reactive 页面默认 Share API
- **useStyleTag 在head插入style**
- useTextareaAutosize 自动根据内容变更textarea的高度
- **useTitle 动态设置页面title**
- **useUrlSearchParams 获得页面url参数值，qs再见**
- useVibrate 设备震动相关 API
- useWakeLock 唤醒屏幕 API
- useWebNotification web Notification API

## Sensors (传感器)
- **onClickOutside  监听某元素外的点击事件**
- **onKeyStroke  监听键盘操作**
- onLongPress  监听长点击
- onStartTyping  监听用户码字在无输入焦点的时候
- useBattery  电池状态API，一般用于移动端
- useDeviceMotion  提供设备定位
- useDeviceOrientation  提供网页设备的物理方向的信息
- useDevicePixelRatio  提供设备像素比例
- useDevicesList  反馈输入输出设备如耳机等信息
- useDisplayMedia  分享屏幕streaming
- useElementByPoint  反馈页面元素位置信息
- **useElementHover  Reactive 元素hover状态**
- **useFocus  聚焦某元素上**
- useFocusWithin  是否聚焦在某元素上
- useFps  反馈屏幕刷新率
- useGeolocation  获取设备位置信息
- useIdle  用户是否处于活跃状态(时间间隔)
- useInfiniteScroll  无限滚动元素
- useKeyModifier  反馈键盘某键状态(按下与否)
- **useMagicKeys  反馈按键状态，与功能键结合**
- **useMouse  Reactive鼠标坐标**
- **useMousePressed  反馈鼠标按键**
- useNavigatorLanguage  监听注意用户对导航器语言偏好的更改
- useNetwork  反馈系列网络状态
- useOnline  是否联网
- usePageLeave  反馈鼠标是否离开当前页面
- useParallax  创造视差效果的方法
- usePointer  反应指针状态
- usePointerSwipe  基于PointerEvents滑动检测
- useScroll  监听scroll位置和状态
- useScrollLock  监听和开启/关闭 scroll功能
- useSpeechRecognition  Reactive 语音识别
- useSpeechSynthesis  语音识别相关
- useSwipe  基于TouchEvents滑动检测
- **useTextSelection  reactive 跟踪用户文本的选择**
- useUserMedia  reactive mediaDevices.getUserMedia streaming

## Animation(动画)
- useInterval  计数器
- useIntervalFn  可控的`setInterval`封装
- **useNow  获取Date now，并reactive**
- useRafFn  可暂停、继续的动画api
- useTimeout  延迟执行
- useTimeoutFn  可控的延迟执行
- useTimestamp  reactive 当前时间戳
- **useTransition  动态/动画 式的调整某值**

## State(状态)
- **createGlobalState  在公用域创建可复用的state**
- createInjectionState  在公用域创建可以注入组件的state
- createSharedComposable  使Composable方法在多组件中复用
- **useAsyncState  Reactive一个异步值**
- useDebouncedRefHistory  useRefHistory记录防抖
- **useLocalStorage  Reactive localStorage值**
- useManualRefHistory  当使用调用COMMIT()时，手动跟踪REF的更改历史记录，还有撤消和重做功能
- **useRefHistory  跟踪ref值的变更历史记录，还有撤消和重做功能**
- **useSessionStorage  Reactive SessionStorage值**
- **useStorage  Reactive localStorage值或SessionStorage值**
- useThrottledRefHistory  useRefHistory 节流处理

## Elements(元素)
- **useActiveElement  Reactive 焦点元素**
- useDocumentVisibility  Reactive 元素是否显示
- useDraggable  元素拖拽化
- useDropZone  创建一个可拖拽文件区域
- **useElementBounding  Reactive 元素的边界值**
- **useElementSize  Reactive 元素的大小值**
- useElementVisibility 跟踪视图内元素的可见性
- useIntersectionObserver 跟踪目标元素是否在可见范围
- useMouseInElement 检测元素的鼠标信息，是否hover等
- useMutationObserver 检测对DOm树的修改
- useResizeObserver 反馈元素内容或边框框的尺寸的变更
- useWindowFocus 使用`window.onfocus`和`window.onblur`事件Reactively 追踪window focus状态
- useWindowScroll Reactive 窗口的scroll
- useWindowSize Reactive 窗口的 size

## Component(组件)
- computedInject Combine computed and inject
- templateRef 无setup语法糖情况下标记绑定模板，无需return
- tryOnBeforeMount 容错型的`onBeforeMount`
- tryOnBeforeUnmount 容错型的`onBeforeUnmount`
- **tryOnMounted 容错型的`onMounted`**
- tryOnScopeDispose 容错型的`onScopeDispose`
- tryOnUnmounted 容错型的`onUnmounted`
- unrefElement 释放ref的元素或组件?
- useMounted Mounted state in ref
- useTemplateRefsList 标记用于绑定与模板元素和v-for内部组件(获取内部的ele)
- **useVirtualList 虚拟list，大幅度提高性能，用于超长list并高度固定时**
- **useVModel 用于v-model绑定的速记，Props + Emit-> Ref,子组件数据无缝emit到父组件**
- useVModels 用于props v-model结合的速记。像Props一样，更改也会触发emit

## Watch(观察器)
- until 一次性的watch?
- watchArray 监听数组的增项和移除项
- watchAtMost 监听数字或次数的变更
- watchDebounced 防抖监听
- watchIgnorable 可忽略性的监听
- watchOnce 一次性监听
- **watchPausable 可暂停性监听**
- watchThrottled 节流监听
- watchTriggerable 可手动触发的监听
- watchWithFilter 额外的事件过滤器控制的监听
- whenever 标记值为true的监听，有点拗，就是监听async的true返回值的

## Network(网络)
- useEventSource 网络请求的各返回状态
- useFetch Reactive Fetch API 并有终止请求等功能
- useWebSocket Reactive WebSocket client,字面意思


