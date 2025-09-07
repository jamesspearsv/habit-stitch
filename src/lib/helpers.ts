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
  const maxRadius = Math.min(canvasSize.width, canvasSize.height) * 0.5
  const radius = maxRadius * (1 - percentage) // Higher % = closer to center

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

function parseDate(date: Date) {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    weekday: date.getDay(),
  }
}

export function getDateRange(
  mode: 'today' | 'month' | 'week',
  offset?: number,
): { start: string; end: string } {
  const t = parseDate(new Date())

  // perform any offset operations
  if (offset) {
    switch (mode) {
      case 'month':
        t.month = t.month - offset
      case 'week':
        t.day = t.day - offset * 7
    }
  }

  switch (mode) {
    case 'today':
      return {
        start: new Date(t.year, t.month, t.day, 0, 0, 0).toISOString().replace('T', ' '),
        end: new Date(t.year, t.month, t.day, 23, 59, 59).toISOString().replace('T', ' '),
      }
    case 'month':
      const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      return {
        start: new Date(t.year, t.month, 1, 0, 0, 0).toISOString().replace('T', ' '),
        end: new Date(t.year, t.month, daysInMonths[t.month], 23, 59, 59)
          .toISOString()
          .replace('T', ' '),
      }
    case 'week':
      const sunday = t.day - t.weekday
      const saturday = t.day + (6 - t.weekday)

      console.log('sunday', sunday, '\n', 'saturday', saturday)

      return {
        start: new Date(t.year, t.month, sunday, 0, 0, 0).toISOString().replace('T', ' '),
        end: new Date(t.year, t.month, saturday, 0, 0, 0).toISOString().replace('T', ' '),
      }
  }
}

export function stringToProperCase(string: string) {
  return string[0].toUpperCase() + string.slice(1)
}
