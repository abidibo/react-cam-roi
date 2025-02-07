import * as fabric from 'fabric'
import { v4 as uuidv4 } from 'uuid'

import { FabricEvent, Shape, ToolEnum } from './Types'
import Dispatcher from '../../Utils/Dispatcher'

export const handleMouseDownRect = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  activeColor: string,
  setOriginX: (v: number) => void,
  setOriginY: (v: number) => void,
  setShape: (v: Shape) => void,
  setIsDrawing: (v: boolean) => void,
) => {
  const pointer = canvas.getScenePoint(event.e)
  setOriginX(pointer.x)
  setOriginY(pointer.y)
  const id = uuidv4()
  const newRectangle = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    originX: 'left',
    originY: 'top',
    width: 0,
    height: 0,
    fill: 'transparent',
    stroke: activeColor,
    strokeWidth: 2,
    strokeUniform: true,
    selectable: false,
    hasControls: true,
    hoverCursor: 'default',
    id,
  })
  canvas.add(newRectangle)
  setShape(newRectangle)
  setIsDrawing(true)
}

export const handleMouseMoveRect = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  originX: number,
  originY: number,
  shape: Shape,
  isDrawing: boolean,
) => {
  if (isDrawing && shape) {
    const pointer = canvas.getScenePoint(event.e)
    shape.set({
      width: Math.abs(originX - pointer.x),
      height: Math.abs(originY - pointer.y),
    })
    if (originX > pointer.x) {
      shape.set({ left: pointer.x })
    }
    if (originY > pointer.y) {
      shape.set({ top: pointer.y })
    }
    canvas.renderAll()
  }
}

export const handleMouseUpRect = (
  editorId: string,
  canvas: fabric.Canvas,
  setIsDrawing: (v: boolean) => void,
  shape: Shape,
  setShape: (v: Shape | null) => void,
) => {
  setIsDrawing(false)
  shape.setCoords()
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id: shape!.id, type: ToolEnum.Rectangle, shape })
  setShape(null)
  canvas.defaultCursor = 'default'
}

export const copyRectangle = (editorId: string, canvas: fabric.Canvas, rectangle: fabric.Rect) => {
  const id = uuidv4()
  const copy = new fabric.Rect({
    left: rectangle.left + 10,
    top: rectangle.top + 10,
    originX: 'left',
    originY: 'top',
    width: rectangle.width,
    height: rectangle.height,
    fill: 'transparent',
    stroke: rectangle.stroke,
    strokeWidth: rectangle.strokeWidth,
    strokeUniform: true,
    selectable: false,
    hasControls: true,
    hoverCursor: 'default',
    id,
  })

  canvas.add(copy)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Rectangle, shape: copy })
  return copy
}
