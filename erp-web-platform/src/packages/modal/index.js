import Modal from './confirm'

let modalInstance

function getModalInstance(render = undefined) {
  modalInstance =
    modalInstance ||
    Modal.newInstance({
      closable: false,
      maskClosable: false,
      footerHide: true,
      render: render
    })
  return modalInstance
}

function confirm(options) {
  const render = 'render' in options ? options.render : undefined
  let instance = getModalInstance(render)
  options.onRemove = function() {
    modalInstance = null
  }

  instance.show(options)
}

Modal.info = function(props = {}) {
  props.type = 'info'
  props.showCancel = false
  return confirm(props)
}

Modal.success = function(props = {}) {
  props.type = 'success'
  props.showCancel = false
  return confirm(props)
}

Modal.warning = function(props = {}) {
  props.type = 'warning'
  props.showCancel = false
  return confirm(props)
}

Modal.error = function(props = {}) {
  props.type = 'error'
  props.showCancel = false
  return confirm(props)
}

Modal.confirm = function(props = {}) {
  props.type = 'confirm'
  props.showCancel = true
  return confirm(props)
}

Modal.remove = function() {
  if (!modalInstance) {
    return false
  }

  const instance = getModalInstance()

  instance.remove()
}

export default Modal
