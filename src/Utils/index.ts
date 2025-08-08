export const log = (level: 'log' | 'info' | 'warn' | 'error', enable: boolean, ...args: unknown[]) =>
  enable && console[level](...args)
export const css = (name: string, styles: Record<string, string>, themeMode: 'light' | 'dark' | null) => {
  const parts = []
  if (styles[name]) parts.push(styles[name])
  if (styles[`${name}-${themeMode}`]) parts.push(styles[`${name}-${themeMode}`])
  parts.push(`react-cam-roi-${name}`)
  if (themeMode) parts.push(`react-cam-roi-${name}-${themeMode}`)

  return parts.join(' ')
}

export const humanize = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace('_', ' ')
    .replace(/^./, (str) => str.toUpperCase())
}

export const formatString = (str: string, placeholders: Record<string, string | number>) => {
  Object.keys(placeholders).forEach((key) => {
    str = str.replace(`{${key}}`, placeholders[key].toString())
  })

  return str
}

export const abs2Perc = (value: number, ref: number) => Math.round((value / ref) * 100 * 100) / 100
export const perc2Abs = (value: number, ref: number) => Math.round((ref * value * 100) / 100) / 100

export const defaultTo = (dft: unknown) => (value: unknown) => value ?? dft
export const compose =
  (...fns: Function[]) =>
  (x: any) =>
    fns.reduceRight((y, f) => f(y), x)
