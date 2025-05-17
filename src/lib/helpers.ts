export function generateHexCode() {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

  let code = '#'

  for (let i = 0; i < 6; i++) {
    code = code + values[Math.floor(Math.random() * 16)]
  }
  return code
}

export function stringToSeed(string: string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = hash * 359 + string.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export function seededRandomNumber(seed: number) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

export function getAngleFromSeed(seed: number) {
  return seededRandomNumber(seed) * Math.PI * 2
}

export function calculatePosition(
  percentage: number,
  angle: number,
  canvasSize: { width: number; height: number },
) {
  const maxRadius = Math.min(canvasSize.width, canvasSize.height) * 0.3
  const radius = percentage < 1 ? maxRadius * (1 - percentage) : 0 // Higher % = closer to center

  return {
    x: canvasSize.width / 2 + radius * Math.cos(angle),
    y: canvasSize.height / 2 + radius * Math.sin(angle),
  }
}

export function calculateRadius(percentage: number, max: number, min: number) {
  return min + (max - min) * percentage
}

export function calculateOpacity(percentage: number, max: number, min: number) {
  return min + (max - min) * (1 - percentage)
}

export function getDateRange(today: Date) {
  const day = today.getDate().toString()
  const month = `0${(today.getMonth() + 1).toString()}`.slice(-2)
  const year = today.getFullYear().toString()
  const offset = `0${(today.getTimezoneOffset() / 60).toString()}`.slice(-2)
  const date = `${year}-${month}-${day}`

  const start = `${date}T00:00:00-${offset}:00`
  const end = `${date}T23:59:59-${offset}:00`

  return {
    start: new Date(start).toISOString().replace('T', ' '),
    end: new Date(end).toISOString().replace('T', ' '),
  }
}
