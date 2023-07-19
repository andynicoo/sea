const LazyLoad = {
  // install方法
  install(Vue, options) {
    const defaultSrc = options.default
    Vue.directive('lazy', {
      bind(el, binding) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      inserted(el, binding) {
        LazyLoad.checkImg(el, defaultSrc, binding.arg)
      },
      update(el, binding) {
        if (binding.oldValue !== binding.value) {
          el.src = binding.value || defaultSrc
        }
      }
    })
  },
  checkImg(el, defaultSrc, root) {
    const rootEle = document.querySelector(`.${root}`)
    if (IntersectionObserver) {
      LazyLoad.observe(el, rootEle)
    } else {
      LazyLoad.listenerScroll(el, rootEle)
    }
  },
  // 初始化
  init(el, val, def) {
    el.setAttribute('data-src', val ?? '')
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el
  observe(el, root) {
    const io = new IntersectionObserver((entries) => {
      const realSrc = el.dataset.src
      if (entries[0].isIntersecting) {
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    }, { root })
    io.observe(el)
  },
  // 监听scroll事件
  listenerScroll(el, root) {
    const handler = LazyLoad.throttle(LazyLoad.load, 300)
    LazyLoad.load(el);
    (root || window).addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load(el) {
    const windowHeight = document.documentElement.clientHeight
    const elTop = el.getBoundingClientRect().top
    const elBtm = el.getBoundingClientRect().bottom
    const realSrc = el.dataset.src
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle(fn, delay) {
    let timer
    let prevTime
    return function(...args) {
      const currTime = Date.now()
      const context = this
      if (!prevTime) prevTime = currTime
      clearTimeout(timer)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        fn.apply(context, args)
        clearTimeout(timer)
        return
      }

      timer = setTimeout(function() {
        prevTime = Date.now()
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  }
}

export default LazyLoad

