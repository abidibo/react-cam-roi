import * as fabric from 'fabric'

export const enum ToolEnum {
  Pointer = 'pointer',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rect',
}

export type ShapeType = ToolEnum.Polyline | ToolEnum.Polygon | ToolEnum.Rectangle
export type Shape = (fabric.Rect | fabric.Polygon | fabric.Polyline) & { id?: string }
export type Shapes = Record<string, { type: ShapeType, shape: Shape }>
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
  options: { value: number | string | boolean; label: string }[]
  required: boolean
  value: number | string | boolean | null
}
export type RoiConfiguration = {
  role: string
  type: Omit<ShapeType, 'pointer'>
  multiplicity: {
    operator: OperatorEnum
    threshold: number
  },
  parameters: ConfigurationParameter[],
}

export type Configuration = {
  parameters: ConfigurationParameter[],
  rois: RoiConfiguration[],
}

export interface INotify {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
  success: (message: string) => void
}
