export const log = (level: 'log' | 'info' | 'warn' | 'error', enable: boolean, ...args: unknown[]) =>
  enable && console[level](...args)
export const css = (name: string, styles: Record<string, string>, themeMode: 'light' | 'dark' | null) =>
  `${styles[name]} ${styles[`${name}-${themeMode}`]} react-cam-roi-${name}${themeMode ? `react-cam-roi-${name}-${themeMode}` : ''}`

  export const humanize = (str: string) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace('_', ' ')
      .replace(/^./, (str) => str.toUpperCase())
  }
