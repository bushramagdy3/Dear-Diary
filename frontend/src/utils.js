const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatDate(day, month, year) {
  const monthNumber = Number(month)

  if (Number.isNaN(monthNumber)) {
    return `${day} ${month} ${year}`
  }

  return `${day} ${monthNames[monthNumber - 1]} ${year}`
}