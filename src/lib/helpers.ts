export function parseDate(date: Date) {
  const year = date.getFullYear().toString()
  const month = '0' + (date.getMonth() + 1).toString()
  const day = '0' + date.getDate().toString()

  const date_string = `${year}-${month.slice(-2)}-${day.slice(-2)}`
  const timestamp = date.getTime()

  return { date_string, timestamp }
}
