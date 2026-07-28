export function formatDate(value) {
  if (!value) return ''

  return String(value).replace('T', ' ').substring(0, 19)
}

export function formatCount(count) {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`
  }

  return String(count ?? 0)
}

export function sortByNewest(items, dateKey = 'created_at') {
  return [...items].sort(
    (a, b) => new Date(b[dateKey]) - new Date(a[dateKey]),
  )
}
