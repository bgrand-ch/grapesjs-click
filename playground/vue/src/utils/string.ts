export function capitalizeValue (value?: string) {
  if (typeof value !== 'string') {
    return ''
  }

  return (
    value.charAt(0).toUpperCase() +
    value.replace(/[_-]+/, ' ').slice(1)
  )
}
