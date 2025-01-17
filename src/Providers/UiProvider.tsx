import { createContext, PropsWithChildren } from 'react'

import IconButton from '../Components/IconButton'

type UiContextType = {
  children?: React.ReactNode
  enableLogs: boolean
  themeMode: 'light' | 'dark'
  primaryColor: string
  IconButton: typeof IconButton
}
export const DefaultUiContext: UiContextType = {
  enableLogs: true,
  themeMode: 'light',
  primaryColor: '#1976d2',
  IconButton,
}

export const UiContext = createContext<UiContextType>(DefaultUiContext)

const UiProvider = ({ children, enableLogs, themeMode, primaryColor, IconButton }: PropsWithChildren<Partial<UiContextType>>) => {
  const ctx: UiContextType = {
    enableLogs: enableLogs ?? DefaultUiContext.enableLogs,
    IconButton: IconButton ?? DefaultUiContext.IconButton,
    themeMode: themeMode ?? DefaultUiContext.themeMode,
    primaryColor: primaryColor ?? DefaultUiContext.primaryColor,
  }
  return <UiContext.Provider value={ctx}>{children}</UiContext.Provider>
}

export default UiProvider
