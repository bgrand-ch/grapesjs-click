export function isTouchDevice () {
  const hasTouchEvent = 'ontouchstart' in window
  const hasTouchPoints = navigator.maxTouchPoints > 0

  return hasTouchEvent || hasTouchPoints
}
