export default {
  setVars(state, vars) {
    if (vars instanceof Array) {
      const obj = Object.assign({}, state.vars)
      const value = vars.pop()
      let formatKeyPath = []
      vars.forEach((item) => {
        if (item instanceof Array) {
          formatKeyPath = formatKeyPath.concat(item)
        } else {
          formatKeyPath.push(item)
        }
      })
      const loop = (tempObj, i, len) => {
        if (i + 1 < len) {
          loop(tempObj[formatKeyPath[i]], i + 1, len)
        } else {
          tempObj[formatKeyPath[i]] = value
        }
      }
      loop(obj, 0, formatKeyPath.length)
      state.vars = obj
    } else {
      state.vars = Object.assign({}, state.vars, vars)
    }
  },
  // 清除对应的vars,暂时直接置空处理
  clearVars(state, key) {
    if (key) {
      state.vars[key] = null
    } else {
      state.vars = {}
    }
  }
}
