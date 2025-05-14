import * as fabric from 'fabric'
import { v4 as uuidv4 } from 'uuid'

import { FabricEvent, ToolEnum } from './Types'
import Dispatcher from '../../Utils/Dispatcher'

export const handleMouseDownPoint = (
  event: FabricEvent,
  editorId: string,
  canvas: fabric.Canvas,
  activeColor: string,
  setOriginX: (v: number) => void,
  setOriginY: (v: number) => void,
) => {
  const pointer = canvas.getScenePoint(event.e)
  setOriginX(pointer.x)
  setOriginY(pointer.y)
  const id = uuidv4()
  const newCircle = new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    originX: 'center',
    originY: 'center',
    radius: 6,
    fill: activeColor,
    stroke: activeColor,
    strokeWidth: 2,
    strokeUniform: true,
    selectable: false,
    hasControls: false,
    hoverCursor: 'default',
    id,
  })
  canvas.add(newCircle)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Point, shape: newCircle })
  canvas.defaultCursor = 'default'
}

export const copyPoint = (editorId: string, canvas: fabric.Canvas, point: fabric.Circle) => {
  const id = uuidv4()
  const copy = new fabric.Circle({
    left: point.left + 10,
    top: point.top + 10,
    originX: 'center',
    originY: 'center',
    radius: 6,
    fill: point.fill,
    stroke: point.stroke,
    strokeWidth: point.strokeWidth,
    strokeUniform: true,
    selectable: false,
    hasControls: false,
    hoverCursor: 'default',
    id,
  })

  canvas.add(copy)
  Dispatcher.emit(`canvas:${editorId}:shapeAdded`, { id, type: ToolEnum.Point, shape: copy })
  return copy
}
