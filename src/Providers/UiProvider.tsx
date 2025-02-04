import { createContext, PropsWithChildren } from 'react'

import Typography from '../Components/Typography'
import IconButton from '../Components/IconButton'
import DeleteIcon from '../Icons/DeleteIcon'
import EditIcon from '../Icons/EditIcon'
import SelectIcon from '../Icons/SelectIcon'
import { INotify } from '../Components/RoiEditor/Types'
import { notify } from '../Components/RoiEditor/Utils'
import CopyIcon from '../Icons/CopyIcon'
import AnnotateIcon from '../Icons/AnnotateIcon'
import Modal from '../Components/Modal'
import CloseIcon from '../Icons/CloseIcon'
import TextField from '../Components/TextField'
import NumberField from '../Components/NumberField'
import BoolField from '../Components/BoolField'
import EnumField from '../Components/EnumField'
import Button from '../Components/Button'
import SaveIcon from '../Icons/SaveIcon'

type UiContextType = {
  children?: React.ReactNode
  enableLogs: boolean
  themeMode: 'light' | 'dark'
  primaryColor: string
  Typography: typeof Typography
  IconButton: typeof IconButton
  Modal: typeof Modal
  DeleteIcon: typeof DeleteIcon
  EditIcon: typeof EditIcon
  SelectIcon: typeof SelectIcon
  CopyIcon: typeof CopyIcon
  AnnotateIcon: typeof AnnotateIcon
  SaveIcon: typeof SaveIcon
  CloseIcon: typeof CloseIcon
  TextField: typeof TextField
  NumberField: typeof NumberField
  BoolField: typeof BoolField
  EnumField: typeof EnumField
  Button: typeof Button
  pickerColors: string[]
  notify: INotify,
  strings: {
    cancel: string
    cannotDrawMorePolygons: string
    cannotDrawMorePolylines: string
    cannotDrawMoreRectangles: string
    id: string
    mainParametersMetadata: string
    polygon: string
    polygonHelpText: string
    polyline: string
    polylineHelpText: string
    rect: string
    rectHelpText: string
    pointer: string
    pointerHelpText: string
    requiredField: string
    save: string
    type: string
  }
}
export const DefaultUiContext: UiContextType = {
  enableLogs: true,
  themeMode: 'light',
  primaryColor: '#1976d2',
  Typography,
  IconButton,
  Modal,
  DeleteIcon,
  EditIcon,
  SelectIcon,
  CopyIcon,
  AnnotateIcon,
  SaveIcon,
  CloseIcon,
  TextField,
  NumberField,
  BoolField,
  EnumField,
  Button,
  pickerColors: ['#ffffff', '#000000', '#ff9900', '#0099ff'],
  notify,
  strings: {
    cancel: 'Cancel',
    cannotDrawMorePolygons: 'You cannot draw more polygons',
    cannotDrawMorePolylines: 'You cannot draw more polylines',
    cannotDrawMoreRectangles: 'You cannot draw more rectangles',
    id: 'ID',
    mainParametersMetadata: 'Main parameters',
    polygon: 'Polygon',
    polygonHelpText: 'click to draw all the polygon points, double click on the last point to close the polygon',
    polyline: 'Polyline',
    polylineHelpText: 'click to draw all the polyline points, double click on the last point to stop drawing',
    rect: 'Rectangle',
    rectHelpText: 'click and drag to draw the rectangle',
    pointer: 'Selection',
    pointerHelpText: 'click a shape to select it',
    requiredField: 'This field is required',
    save: 'Save',
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
  Modal,
  IconButton,
  DeleteIcon,
  EditIcon,
  SelectIcon,
  CopyIcon,
  AnnotateIcon,
  SaveIcon,
  CloseIcon,
  TextField,
  NumberField,
  BoolField,
  EnumField,
  Button,
  pickerColors,
  notify,
  strings,
}: PropsWithChildren<Partial<Omit<UiContextType, 'strings'>> & { strings?: Partial<UiContextType['strings']> }>) => {
  const ctx: UiContextType = {
    enableLogs: enableLogs ?? DefaultUiContext.enableLogs,
    Typography: Typography ?? DefaultUiContext.Typography,
    Modal: Modal ?? DefaultUiContext.Modal,
    IconButton: IconButton ?? DefaultUiContext.IconButton,
    DeleteIcon: DeleteIcon ?? DefaultUiContext.DeleteIcon,
    EditIcon: EditIcon ?? DefaultUiContext.EditIcon,
    SelectIcon: SelectIcon ?? DefaultUiContext.SelectIcon,
    CopyIcon: CopyIcon ?? DefaultUiContext.CopyIcon,
    AnnotateIcon: AnnotateIcon ?? DefaultUiContext.AnnotateIcon,
    SaveIcon: SaveIcon ?? DefaultUiContext.SaveIcon,
    CloseIcon: CloseIcon ?? DefaultUiContext.CloseIcon,
    TextField: TextField ?? DefaultUiContext.TextField,
    NumberField: NumberField ?? DefaultUiContext.NumberField,
    BoolField: BoolField ?? DefaultUiContext.BoolField,
    EnumField: EnumField ?? DefaultUiContext.EnumField,
    Button: Button ?? DefaultUiContext.Button,
    themeMode: themeMode ?? DefaultUiContext.themeMode,
    primaryColor: primaryColor ?? DefaultUiContext.primaryColor,
    pickerColors: pickerColors ?? DefaultUiContext.pickerColors,
    notify: notify ?? DefaultUiContext.notify,
    strings: strings ? { ...DefaultUiContext.strings, ...strings } : DefaultUiContext.strings,
  }
  return <UiContext.Provider value={ctx}>{children}</UiContext.Provider>
}

export default UiProvider
