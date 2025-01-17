import * as fabric from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { FabricEvent, Shape } from './Types'

export const handleMouseDownRect = (
  event: FabricEvent,
  canvas: fabric.Canvas,
  setOriginX: (v: number) => void,
  setOriginY: (v: number) => void,
  setShape: (v: Shape) => void,
  setIsDrawing: (v: boolean) => void
) => {
  const id = uuidv4()
  const pointer = canvas.getScenePoint(event.e)
  setOriginX(pointer.x)
  setOriginY(pointer.y)
  const newRectangle = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    originX: 'left',
    originY: 'top',
    width: 0,
    height: 0,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 2,
    selectable: true,
    hasControls: true,
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
  setIsDrawing: (v: boolean) => void,
  setShape: (v: Shape) => void,
  canvas: fabric.Canvas
) => {
  setIsDrawing(false)
  setShape(null)
  if (canvas) {
    canvas.defaultCursor = 'default'
  }
}
