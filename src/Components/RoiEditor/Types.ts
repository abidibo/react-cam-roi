import * as fabric from 'fabric'

export const enum ToolEnum {
  Pointer = 'pointer',
  Polyline = 'polyline',
  Polygon = 'polygon',
  Rectangle = 'rectangle',
}

export type Shape = fabric.Rect | null
export type FabricEvent = fabric.TPointerEventInfo<fabric.TPointerEvent>
