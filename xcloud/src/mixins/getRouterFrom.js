export default {
  data() {
    return {
      routerFrom: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.routerFrom = from.path
    })
  },
}