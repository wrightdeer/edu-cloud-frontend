import moment from 'moment'
export function formattedTime (time) {
  time = moment(time)
  const now = moment()
  const diffInSeconds = now.diff(time, 'seconds')
  const diffInMinutes = now.diff(time, 'minutes')
  const diffInHours = now.diff(time, 'hours')
  const diffInDays = now.diff(time, 'days')

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} 分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours} 小时前`
  } else if (diffInDays < 10) {
    return `${diffInDays} 天前`
  } else {
    return time.format('YYYY-MM-DD')
  }
}
