import { createContext, PropsWithChildren } from 'react'

import Typography from '../Components/Typography'
import IconButton from '../Components/IconButton'
import DeleteIcon from '../Icons/DeleteIcon'
import EditIcon from '../Icons/EditIcon'
import SelectIcon from '../Icons/SelectIcon'

type UiContextType = {
  children?: React.ReactNode
  enableLogs: boolean
  themeMode: 'light' | 'dark'
  primaryColor: string
  Typography: typeof Typography
  IconButton: typeof IconButton
  DeleteIcon: typeof DeleteIcon
  EditIcon: typeof EditIcon
  SelectIcon: typeof SelectIcon
  pickerColors: string[]
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
  Typography,
  IconButton,
  DeleteIcon,
  EditIcon,
  SelectIcon,
  pickerColors: ['#ffffff', '#000000', '#ff9900', '#0099ff'],
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
  Typography,
  IconButton,
  DeleteIcon,
  EditIcon,
  SelectIcon,
  pickerColors,
  strings,
}: PropsWithChildren<Partial<Omit<UiContextType, 'strings'>> & { strings?: Partial<UiContextType['strings']> }>) => {
  const ctx: UiContextType = {
    enableLogs: enableLogs ?? DefaultUiContext.enableLogs,
    Typography: Typography ?? DefaultUiContext.Typography,
    IconButton: IconButton ?? DefaultUiContext.IconButton,
    DeleteIcon: DeleteIcon ?? DefaultUiContext.DeleteIcon,
    EditIcon: EditIcon ?? DefaultUiContext.EditIcon,
    SelectIcon: SelectIcon ?? DefaultUiContext.SelectIcon,
    themeMode: themeMode ?? DefaultUiContext.themeMode,
    primaryColor: primaryColor ?? DefaultUiContext.primaryColor,
    pickerColors: pickerColors ?? DefaultUiContext.pickerColors,
    strings: strings ? { ...DefaultUiContext.strings, ...strings } : DefaultUiContext.strings,
  }
  return <UiContext.Provider value={ctx}>{children}</UiContext.Provider>
}

export default UiProvider
