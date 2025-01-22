import * as fabric from 'fabric'
import { useCallback, useEffect, useRef, useState } from 'react'

import Dispatcher from '../../Utils/Dispatcher'
import { handleDoubleClickPolygon, handleMouseDownPolygon, handleMouseMovePolygon } from './Polygon'
import { handleDoubleClickPolyline, handleMouseDownPolyline, handleMouseMovePolyline } from './Polyline'
import { handleMouseDownRect, handleMouseMoveRect, handleMouseUpRect } from './Rectangle'
import { FabricEvent, FabricSelectionEvent, Shape, ShapeType, ToolEnum } from './Types'

export const useImageSize = (imageUrl: string) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height })
    }
  }, [imageUrl])

  return { imageSize, isReady: imageSize.width > 0 }
}

export const useCanvasSize = (imageUrl: string) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const { imageSize, isReady } = useImageSize(imageUrl)

  useEffect(() => {
    if (wrapperRef.current) {
      const update = () => {
        const availableWidth = wrapperRef.current!.offsetWidth
        if (availableWidth < imageSize.width) {
          setCanvasSize({
            width: availableWidth,
            height: availableWidth * (imageSize.height / imageSize.width),
          })
        } else {
          setCanvasSize({
            width: imageSize.width,
            height: imageSize.height,
          })
        }
      }
      if (imageSize.width > 0 && wrapperRef.current) {
        update()
        // observe ref for resizing event and in case update canvas dimensions
        const resizeObserver = new ResizeObserver(() => {
          update()
        })
        resizeObserver.observe(wrapperRef.current)
      }
    }
  }, [imageSize, wrapperRef.current]) // eslint-disable-line

  return { imageSize, canvasSize, wrapperRef, isReady }
}

export const useTool = (
  tool: ToolEnum,
  addShape: (id: string, type: ShapeType, shape: Shape) => void,
  canvas: fabric.Canvas | null,
) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState<Shape | null>(null)
  const [originX, setOriginX] = useState(0)
  const [originY, setOriginY] = useState(0)
  const [startPos] = useState({ x: 0, y: 0 })
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [lines, setLines] = useState<fabric.Line[]>([])

  // Handler for object selected event to update style settings
  const handleObjectSelected = useCallback((event: FabricSelectionEvent) => {
    console.log('SELECtING POIN', event.selected ?? null) // Update selected shapes state
  }, [])

  // Handler for selection cleared event to reset selected shapes state
  const handleSelectionCleared = useCallback(() => {
    console.log('clear selection point', null) // Clear selected shapes state
  }, [])

  useEffect(() => {
    if (!canvas) {
      return
    }

    if (tool === ToolEnum.Pointer) {
      // enable selection
      canvas.selection = true
      canvas.getObjects().forEach((object) => {
        object.selectable = true
      })
      canvas.renderAll()
    } else {
      // disable selection
      canvas.selection = false
      canvas.discardActiveObject()
      canvas.renderAll()
    }

    const handleMouseDown = (event: FabricEvent) => {
      switch (tool) {
        case ToolEnum.Rectangle:
          handleMouseDownRect(event, canvas, setOriginX, setOriginY, setShape, setIsDrawing)
          break
        case ToolEnum.Polygon:
          handleMouseDownPolygon(event, canvas, setIsDrawing, points, setPoints, lines, setLines)
          break
        case ToolEnum.Polyline:
          handleMouseDownPolyline(event, canvas, setIsDrawing, points, setPoints, lines, setLines)
          break
        default:
          break
      }
    }

    const handleMouseMove = (event: FabricEvent) => {
      switch (tool) {
        case ToolEnum.Rectangle:
          handleMouseMoveRect(event, canvas, originX, originY, shape as Shape, isDrawing)
          break
        case ToolEnum.Polygon:
          handleMouseMovePolygon(event, canvas, isDrawing, lines)
          break
        case ToolEnum.Polyline:
          handleMouseMovePolyline(event, canvas, isDrawing, lines)
          break
        default:
          break
      }
    }

    const handleMouseUp = () => {
      switch (tool) {
        case ToolEnum.Rectangle:
          handleMouseUpRect(canvas, setIsDrawing, shape as Shape, setShape, addShape)
          break
        default:
          break
      }
    }

    const handleDoubleClick = () => {
      switch (tool) {
        case ToolEnum.Polygon:
          handleDoubleClickPolygon(canvas, setIsDrawing, points, setPoints, lines, setLines, addShape)
          break
        case ToolEnum.Polyline:
          handleDoubleClickPolyline(canvas, setIsDrawing, points, setPoints, lines, setLines, addShape)
          break
        default:
          break
      }
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('mouse:dblclick', handleDoubleClick)
    canvas.on('selection:created', handleObjectSelected)
    canvas.on('selection:updated', handleObjectSelected)
    canvas.on('selection:cleared', handleSelectionCleared)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
      canvas.off('mouse:dblclick', handleDoubleClick)
      canvas.off('selection:created', handleObjectSelected)
      canvas.off('selection:updated', handleObjectSelected)
      canvas.off('selection:cleared', handleSelectionCleared)
    }
  }, [
    tool,
    isDrawing,
    shape,
    originX,
    originY,
    startPos,
    lines,
    points,
    canvas,
    addShape,
    handleObjectSelected,
    handleSelectionCleared,
  ])
}

export const useDispatcherEvents = (canvas: fabric.Canvas | null, setActiveTool: (tool: ToolEnum) => void) => {
  useEffect(() => {
    const removeShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvas?.remove(obj)
      }
    }

    const selectShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      console.log('SELECt', obj, canvas)
      if (obj) {
        canvas?.discardActiveObject()
        console.log('SELECTING')
        canvas?.setActiveObject(obj)
        canvas?.requestRenderAll()
        setActiveTool(ToolEnum.Pointer)
      }
    }

    Dispatcher.register('canvas:removeShape', removeShape)
    Dispatcher.register('canvas:selectShape', selectShape)

    return () => {
      Dispatcher.unregister('canvas:removeShape', removeShape)
      Dispatcher.unregister('canvas:selectShape', selectShape)
    }
  }, [setActiveTool, canvas])
}
