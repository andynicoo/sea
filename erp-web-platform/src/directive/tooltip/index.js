import './index.less'

// 提示框的id，每执行一次bind加1
let tooltipId = 1
function tooltips(el, binding) {
  const value = binding.value
  const privateTooltipId = tooltipId
  // 给提示框打标机，便于unbind的时候移除元素
  el.setAttribute('data-tooltip-id', privateTooltipId)
  // 处理入参
  const DEFAULT_BEHAVIER = 'hover'
  const DEFAULT_PLACEMENT = 'top'
  let text
  let trigger
  let placement
  let html
  if (!value) return
  if (typeof value === 'string') {
    // 传入为字符串，默认top、hover
    text = value
    trigger = DEFAULT_BEHAVIER
    placement = DEFAULT_PLACEMENT
  } else {
    text = value?.text
    html = value?.html
    trigger = value?.trigger ?? DEFAULT_BEHAVIER
    placement = value?.placement ?? DEFAULT_PLACEMENT
  }

  let vktooltipContentDom

  // 创建提示框dom元素，并添加到body
  const createVktooltipContentDom = () => {
    vktooltipContentDom = document.createElement('div')
    vktooltipContentDom.id = `tooltip_${privateTooltipId}`
    if (html) {
      vktooltipContentDom.innerHTML = html
    } else {
      vktooltipContentDom.innerText = text
    }
    document.body.appendChild(vktooltipContentDom)
  }
  // 事件处理
  const handleEvent = function() {
    const rect = el.getBoundingClientRect()
    if (!vktooltipContentDom) {
      createVktooltipContentDom()
    }
    const scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop
    vktooltipContentDom.style.display = 'block'
    vktooltipContentDom.className = 'vktooltip-content active'
    const setPosition = {
      top: () => {
        // 检测是否在危险区
        if (rect.y < vktooltipContentDom.clientHeight) {
          setPosition.bottom()
          return
        }
        vktooltipContentDom.classList.add('vktooltip_top')
        vktooltipContentDom.style.left = `${rect.x -
          vktooltipContentDom.clientWidth / 2 +
          rect.width / 2}px`
        vktooltipContentDom.style.top = `${rect.y +
          scrollY -
          vktooltipContentDom.clientHeight -
          10}px`
      },
      bottom: () => {
        // 检测是否在危险区
        const viewPortHeight =
          document.documentElement.clientHeight || document.body.clientHeight
        if (
          viewPortHeight <
          rect.y + rect.height + vktooltipContentDom.clientHeight
        ) {
          setPosition.top()
          return
        }
        vktooltipContentDom.classList.add('vktooltip_bottom')
        vktooltipContentDom.style.left = `${rect.x -
          vktooltipContentDom.clientWidth / 2 +
          rect.width / 2}px`
        vktooltipContentDom.style.top = `${rect.y +
          scrollY +
          rect.height +
          10}px`
      }
    }
    setPosition[placement]()
  }
  // 取消事件
  const cancelEvent = function() {
    vktooltipContentDom?.classList.remove('active')
    vktooltipContentDom?.classList.add('fade-out')
  }
  if (trigger === 'hover') {
    if (!el.getBoundingClientRect) {
      // 不支持getBoundingClientRect的浏览器退化成title属性
      el.setAttribute('title', text ?? html)
    } else {
      el.addEventListener('mouseenter', handleEvent)
      el.addEventListener('mouseout', cancelEvent)
    }
  }
  if (trigger === 'focus') {
    el.addEventListener('onfocus', handleEvent)
    el.addEventListener('onblur', cancelEvent)
  }
  tooltipId += 1
}
export default {
  bind: tooltips,
  componentUpdated: tooltips,
  unbind(el) {
    if (!el.getBoundingClientRect) {
      return
    }
    const priviteTooltipId = el.getAttribute('data-tooltip-id')
    const tooltip = document.getElementById(`tooltip_${priviteTooltipId}`)
    if (tooltip) {
      document.body.removeChild(tooltip)
    }
  }
}
