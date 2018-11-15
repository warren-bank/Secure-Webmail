const pad_to_length = (str, length, chr, is_append) => {
  str = str.toString()

  let old_length = str.length
  let pad_length = length - old_length

  if (pad_length <= 0) return str

  let padding = chr.repeat(pad_length)
  return (is_append)
    ? `${str}${padding}`
    : `${padding}${str}`
}

// Thread_Summary
const format_date_v1 = (timestamp, months) => {
  const then = new Date(timestamp)
  const now  = new Date()

  const same = {
    year:  (then.getFullYear() === now.getFullYear()),
    month: (then.getMonth()    === now.getMonth()),
    day:   (then.getDate()     === now.getDate())
  }

  if (same.year && same.month && same.day) {
    // same day
    let hours = then.getHours()
    let mins  = then.getMinutes()
    let am_pm = 'am'

    if (hours > 12) {
      hours -= 12
      am_pm  = 'pm'
    }
    if (hours === 0) {
      hours  = 12
    }

    hours = pad_to_length(hours, 2, '0')
    mins  = pad_to_length(mins,  2, '0')

    return `${hours}:${mins} ${am_pm}`
  }

  if (same.year) {
    // same year
    let month = months[ then.getMonth() ]
    let day   = then.getDate()

    return `${month} ${day}`
  }

  else {
    let month = then.getMonth() + 1
    let day   = then.getDate()
    let year  = then.getFullYear()

    month = pad_to_length(month, 2, '0')
    day   = pad_to_length(day,   2, '0')

    return `${month}/${day}/${year}`
  }
}

// Message_Summary
const format_date_v2 = (timestamp) => {
  const then = new Date(timestamp)

  let month = then.getMonth() + 1
  let day   = then.getDate()
  let year  = then.getFullYear()

  let hours = then.getHours()
  let mins  = then.getMinutes()
  let am_pm = 'am'

  if (hours > 12) {
    hours -= 12
    am_pm  = 'pm'
  }
  if (hours === 0) {
    hours  = 12
  }

  month = pad_to_length(month, 2, '0')
  day   = pad_to_length(day,   2, '0')
  hours = pad_to_length(hours, 2, '0')
  mins  = pad_to_length(mins,  2, '0')

  return `${month}/${day}/${year} ${hours}:${mins} ${am_pm}`
}

const format_date = {
  Thread_Summary:  format_date_v1,
  Message_Summary: format_date_v2
}

module.exports = format_date
