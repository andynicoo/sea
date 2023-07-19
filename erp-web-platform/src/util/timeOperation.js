import moment from 'moment'

// 禁用从前的day
export function disabledDate(value) {
  return moment(value).isBefore(moment().subtract(1, 'days'))
}

// 禁用今天以后的day
export function disabledDateAfter(value) {
  return moment(value).isAfter(moment().subtract(0, 'days'))
}

export function disabledRangeTime(dates, type) {
  if (type === 'start' && dates) {
    if (dates.length == 2) {
      const timeDay = moment(dates[0]).format('YYYY-MM-DD')
      var now = new Date()
      var hour = now.getHours()
      var minutes = now.getMinutes()
      return {
        disabledHours: () => {
          if (timeDay == moment(now).format('YYYY-MM-DD')) {
            return range(0, 24).splice(0, hour > 9 ? hour : '0' + hour)
          } else {
            return []
          }
        },
        disabledMinutes: (h) => {
          if (timeDay == moment(now).format('YYYY-MM-DD')) {
            if (h > hour) {
              return []
            } else if (h == hour) {
              return range(0, minutes)
            } else {
              return range(0, 60)
            }
          } else {
            return []
          }
        },
        disabledSeconds: () => [0, 59]
      }
    }
  }
  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => []
  }
}

export function range(start, end) {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}
