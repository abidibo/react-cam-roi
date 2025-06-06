import * as fabric from 'fabric'

export const enum ToolEnum {
  Pointer = 'pointer',
  Point = 'point',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rect',
}

export type ShapeType = ToolEnum.Polyline | ToolEnum.Polygon | ToolEnum.Rectangle | ToolEnum.Point
export type Shape = (fabric.Rect | fabric.Polygon | fabric.Polyline | fabric.Circle) & { id?: string }
export type Shapes = Record<string, { type: ShapeType; shape: Shape }>
export type FabricEvent = fabric.TPointerEventInfo<fabric.TPointerEvent>
export type FabricSelectionEvent = Partial<fabric.TEvent> & { selected: fabric.Object[] }
export type IAddShape = (id: string, type: ShapeType, shape: Shape) => void

export enum DataTypeEnum {
  Integer = 'int',
  Float = 'float',
  String = 'string',
  Boolean = 'bool',
}

export enum OperatorEnum {
  Lt = 'lt',
  Lte = 'lte',
  Gt = 'gt',
  Gte = 'gte',
  Eq = 'eq',
}

export type ConfigurationParameter = {
  codename: string
  label: string
  description: string
  unit: string
  type: DataTypeEnum
  options: { value: number | string; label: string }[]
  multiple?: boolean
  required: boolean
  value: number | string | boolean | string[] | number[] | null
}
export type RoiConfiguration = {
  role: string
  label: string
  type: Omit<ShapeType, 'pointer'>
  multiplicity: {
    operator: OperatorEnum
    threshold: number
  }
  parameters: ConfigurationParameter[]
}

export type Configuration = {
  parameters: ConfigurationParameter[]
  rois: RoiConfiguration[]
  options?: {
    hideForbiddenTools?: boolean
    description?: string
    viewMainParameters?: boolean
  }
}

export interface INotify {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
  success: (message: string) => void
}

export type Metadata = {
  parameters: OutputParameter[]
  rois: {
    id: string
    parameters: OutputParameter[]
    name: string
    role: string
  }[]
}

export type OutputShapeRect = {
  angle: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  top: number
  left: number
  width: number
  height: number
  color: string
}

export type OutputShapePoint = {
  angle: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  top: number
  left: number
  color: string
}

export type OutputShapePolyline = {
  angle: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  points: { x: number; y: number }[]
  top: number
  left: number
  color: string
}

export type OutputShapePolygon = {
  angle: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  points: { x: number; y: number }[]
  top: number
  left: number
  color: string
}

export type OutputRectCoords = {
  points: { x: number; y: number }[]
}

export type OutputPointCoords = {
  x: number
  y: number
}

export type OutputPolylineCoords = {
  points: { x: number; y: number }[]
}

export type OutputPolygonCoords = {
  points: { x: number; y: number }[]
}

export interface OutputParameter {
  codename: string
  value: number | string | boolean | string[] | number[] | null
}

export interface OutputRoi {
  parameters: OutputParameter[]
  type: ShapeType
  name: string
  role: string
  id: string
  shape: OutputShapeRect | OutputShapePolyline | OutputShapePolygon | OutputShapePoint
  coords: OutputRectCoords | OutputPolylineCoords | OutputPolygonCoords | OutputPointCoords
}
export interface Output {
  parameters: OutputParameter[]
  presetName: string
  presetDescription: string
  rois: OutputRoi[]
}

export enum UpdateEventType {
  AddRoi = 'AddRoi',
  RemoveRoi = 'RemoveRoi',
  UpdateRoi = 'UpdateRoi',
  UpdateRoiParameters = 'UpdateRoiParameters',
  UpdateMainParameters = 'UpdateMainParameters',
}
