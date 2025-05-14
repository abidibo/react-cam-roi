import { createContext, PropsWithChildren } from 'react'

import Typography from '../Components/Typography'
import IconButton from '../Components/IconButton'
import DeleteIcon from '../Icons/DeleteIcon'
import EditIcon from '../Icons/EditIcon'
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
  primaryFgColor: string
  Typography: typeof Typography
  IconButton: typeof IconButton
  Modal: typeof Modal
  DeleteIcon: typeof DeleteIcon
  EditIcon: typeof EditIcon
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
    cannotDrawMorePoints: string
    cannotDrawMorePolygons: string
    cannotDrawMorePolylines: string
    cannotDrawMoreRectangles: string
    id: string
    invalidSubmission: string
    mainParametersMetadata: string
    missingRequiredValuesInMainParameters: string
    missingRequiredValuesInShapeParameters: string
    roiMultiplicityEqRule: string
    roiMultiplicityGtRule: string
    roiMultiplicityGteRule: string
    roiMultiplicityLtRule: string
    roiMultiplicityLteRule: string
    roiMultiplicityNoRule: string
    name: string
    point: string
    pointHelpText: string
    polygon: string
    polygonHelpText: string
    polyline: string
    polylineHelpText: string
    rect: string
    rectHelpText: string
    pointer: string
    pointerHelpText: string
    roisToBeDrawn: string
    role: string
    requiredField: string
    save: string
    shapeParametersMetadata: string
    shapesOfRoleShouldBeEqualToThreshold: string
    shapesOfRoleShouldBeGreaterThanThreshold: string
    shapesOfRoleShouldBeGreaterThanOrEqualToThreshold: string
    shapesOfRoleShouldBeLessThanThreshold: string
    shapesOfRoleShouldBeLessThanOrEqualToThreshold: string
    type: string
  }
}
export const DefaultUiContext: UiContextType = { // eslint-disable-line
  enableLogs: true,
  themeMode: 'light',
  primaryColor: '#1976d2',
  primaryFgColor: '#fff',
  Typography,
  IconButton,
  Modal,
  DeleteIcon,
  EditIcon,
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
    cannotDrawMorePoints: 'You cannot draw more points',
    cannotDrawMorePolygons: 'You cannot draw more polygons',
    cannotDrawMorePolylines: 'You cannot draw more polylines',
    cannotDrawMoreRectangles: 'You cannot draw more rectangles',
    id: 'ID',
    invalidSubmission: 'Invalid submission',
    mainParametersMetadata: 'Main parameters',
    missingRequiredValuesInMainParameters: 'Missing required values in main parameters',
    missingRequiredValuesInShapeParameters: 'Missing required values in shape {id} parameters',
    name: 'Name',
    point: 'Point',
    pointHelpText: 'click to draw the point',
    polygon: 'Polygon',
    polygonHelpText: 'click to draw all the polygon points, double click on the last point to close the polygon',
    polyline: 'Polyline',
    polylineHelpText: 'click to draw all the polyline points, double click on the last point to stop drawing',
    rect: 'Rectangle',
    rectHelpText: 'click and drag to draw the rectangle',
    pointer: 'Selection',
    pointerHelpText: 'click a shape to select it',
    requiredField: 'This field is required',
    roiMultiplicityEqRule: 'a number of "{role}" ({type}) equal to {threshold}',
    roiMultiplicityGtRule: 'a number of "{role}" ({type}) greater than {threshold}',
    roiMultiplicityGteRule: 'a number of "{role}" ({type}) greater than or equal to {threshold}',
    roiMultiplicityLtRule: 'a number of "{role}" ({type}) less than {threshold}',
    roiMultiplicityLteRule: 'a number of "{role}" ({type}) less than or equal to {threshold}',
    roiMultiplicityNoRule: 'a number of "{role}" ({type})',
    roisToBeDrawn: 'ROIs to be drawn',
    role: 'Role',
    save: 'Save',
    shapeParametersMetadata: 'Shape parameters',
    shapesOfRoleShouldBeEqualToThreshold: 'Shapes of role {role} should be equal to {threshold}',
    shapesOfRoleShouldBeGreaterThanThreshold: 'Shapes of role {role} should be greater than {threshold}',
    shapesOfRoleShouldBeGreaterThanOrEqualToThreshold: 'Shapes of role {role} should be greater than or equal to {threshold}',
    shapesOfRoleShouldBeLessThanThreshold: 'Shapes of role {role} should be less than {threshold}',
    shapesOfRoleShouldBeLessThanOrEqualToThreshold: 'Shapes of role {role} should be less than or equal to {threshold}',
    type: 'Type',
  },
}

export const UiContext = createContext<UiContextType>(DefaultUiContext) // eslint-disable-line

const UiProvider = ({
  children,
  enableLogs,
  themeMode,
  primaryColor,
  primaryFgColor,
  Typography,
  Modal,
  IconButton,
  DeleteIcon,
  EditIcon,
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
    primaryFgColor: primaryFgColor ?? DefaultUiContext.primaryFgColor,
    pickerColors: pickerColors ?? DefaultUiContext.pickerColors,
    notify: notify ?? DefaultUiContext.notify,
    strings: strings ? { ...DefaultUiContext.strings, ...strings } : DefaultUiContext.strings,
  }
  return <UiContext.Provider value={ctx}>{children}</UiContext.Provider>
}

export default UiProvider
