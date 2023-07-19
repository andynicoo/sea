const vFilter = {
  stringSlice: function(value, length) {
    value === undefined || value === null ? (value = '') : ''
    value.length > length ? (value = value.slice(0, length) + '...') : value
    return value
  }
}

export default vFilter
