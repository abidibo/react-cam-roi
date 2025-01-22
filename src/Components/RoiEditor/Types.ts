import * as fabric from 'fabric'

export const enum ToolEnum {
  Pointer = 'pointer',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rectangle',
}

export type Shape = fabric.Rect | fabric.Polygon | fabric.Polyline
export type Shapes = Record<string, Shape>
export type FabricEvent = fabric.TPointerEventInfo<fabric.TPointerEvent>
export type FabricSelectionEvent = Partial<fabric.TEvent> & { selected: fabric.Object[] }
