import { createContext, PropsWithChildren } from 'react'

import IconButton from '../Components/IconButton'

type UiContextType = {
  children?: React.ReactNode
  enableLogs: boolean
  themeMode: 'light' | 'dark'
  primaryColor: string
  IconButton: typeof IconButton
  strings: {
    id: string
    rectangle: string
    polygon: string
    polyline: string
    type: string
  }
}
export const DefaultUiContext: UiContextType = {
  enableLogs: true,
  themeMode: 'light',
  primaryColor: '#1976d2',
  IconButton,
  strings: {
    id: 'ID',
    polygon: 'Polygon',
    polyline: 'Polyline',
    rectangle: 'Rectangle',
    type: 'Type',
  },
}

export const UiContext = createContext<UiContextType>(DefaultUiContext)

const UiProvider = ({
  children,
  enableLogs,
  themeMode,
  primaryColor,
  IconButton,
  strings,
}: PropsWithChildren<Partial<Omit<UiContextType, 'strings'>> & { strings?: Partial<UiContextType['strings']> }>) => {
  const ctx: UiContextType = {
    enableLogs: enableLogs ?? DefaultUiContext.enableLogs,
    IconButton: IconButton ?? DefaultUiContext.IconButton,
    themeMode: themeMode ?? DefaultUiContext.themeMode,
    primaryColor: primaryColor ?? DefaultUiContext.primaryColor,
    strings: strings ? { ...DefaultUiContext.strings, ...strings } : DefaultUiContext.strings,
  }
  return <UiContext.Provider value={ctx}>{children}</UiContext.Provider>
}

export default UiProvider
