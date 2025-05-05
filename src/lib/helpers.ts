export function generateHexCode() {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

  let code = '#'

  for (let i = 0; i < 6; i++) {
    code = code + values[Math.floor(Math.random() * 16)]
  }
  return code
}
