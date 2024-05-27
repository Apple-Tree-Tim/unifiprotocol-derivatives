export const throttle = function (fn: any, delay = 16) {
  let lastHit = 0
  return () => {
    const now = Date.now()
    if (now - lastHit >= delay) {
      fn()
      lastHit = now
    }
  }
}
