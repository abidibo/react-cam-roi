import * as fabric from 'fabric'

export const enum ToolEnum {
  Pointer = 'pointer',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rectangle',
}

export type ShapeType = ToolEnum.Polyline | ToolEnum.Polygon | ToolEnum.Rectangle
export type Shape = (fabric.Rect | fabric.Polygon | fabric.Polyline) & { id?: string }
export type Shapes = Record<string, { type: ShapeType, shape: Shape }>
export type FabricEvent = fabric.TPointerEventInfo<fabric.TPointerEvent>
export type FabricSelectionEvent = Partial<fabric.TEvent> & { selected: fabric.Object[] }
