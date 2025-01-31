import * as fabric from 'fabric'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import Dispatcher from '../../Utils/Dispatcher'
import { copyPolygon, handleDoubleClickPolygon, handleMouseDownPolygon, handleMouseMovePolygon } from './Polygon'
import { copyPolyline, handleDoubleClickPolyline, handleMouseDownPolyline, handleMouseMovePolyline } from './Polyline'
import { copyRectangle, handleMouseDownRect, handleMouseMoveRect, handleMouseUpRect } from './Rectangle'
import { FabricEvent, FabricSelectionEvent, IAddShape, Shape, ToolEnum } from './Types'
import { canDrawShape } from './Utils'

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

export const useTool = (canvas: fabric.Canvas | null) => {
  const { configuration, activeTool, activeColor, shapes, addShape } = useEditorContext()
  const { notify, strings } = useContext(UiContext)

  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState<Shape | null>(null)
  const [originX, setOriginX] = useState(0)
  const [originY, setOriginY] = useState(0)
  const [startPos] = useState({ x: 0, y: 0 })
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [lines, setLines] = useState<fabric.Line[]>([])

  // Handler for object selected event to update style settings
  const handleObjectSelected = useCallback((event: FabricSelectionEvent) => {
    Dispatcher.emit('canvas:shapeSelected', event.selected ?? null)
  }, [])

  // Handler for selection cleared event to reset selected shapes state
  const handleSelectionCleared = useCallback(() => {
    Dispatcher.emit('canvas:shapeSelected', null)
  }, [])

  useEffect(() => {
    if (!canvas) {
      return
    }

    if (activeTool === ToolEnum.Pointer) {
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
      Dispatcher.emit('canvas:shapeSelected', null)
      canvas.renderAll()
    }

    const handleMouseDown = (event: FabricEvent) => {
      switch (activeTool) {
        case ToolEnum.Rectangle:
          if (!canDrawShape(configuration, ToolEnum.Rectangle, shapes, notify, strings.cannotDrawMoreRectangles)) return
          handleMouseDownRect(event, canvas, activeColor, setOriginX, setOriginY, setShape, setIsDrawing)
          break
        case ToolEnum.Polygon:
          if (!canDrawShape(configuration, ToolEnum.Polygon, shapes, notify, strings.cannotDrawMorePolygons)) return
          handleMouseDownPolygon(event, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        case ToolEnum.Polyline:
          if (!canDrawShape(configuration, ToolEnum.Polyline, shapes, notify, strings.cannotDrawMorePolylines)) return
          handleMouseDownPolyline(event, canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines)
          break
        default:
          break
      }
    }

    const handleMouseMove = (event: FabricEvent) => {
      switch (activeTool) {
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
      switch (activeTool) {
        case ToolEnum.Rectangle:
          handleMouseUpRect(canvas, setIsDrawing, shape as Shape, setShape, addShape)
          break
        default:
          break
      }
    }

    const handleDoubleClick = () => {
      switch (activeTool) {
        case ToolEnum.Polygon:
          handleDoubleClickPolygon(canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines, addShape)
          break
        case ToolEnum.Polyline:
          handleDoubleClickPolyline(canvas, activeColor, setIsDrawing, points, setPoints, lines, setLines, addShape)
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
    activeTool,
    activeColor,
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

export const useDispatcherEvents = (
  canvas: fabric.Canvas | null,
  setActiveTool: (tool: ToolEnum) => void,
  addShape: IAddShape,
) => {
  useEffect(() => {
    const removeShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvas?.remove(obj)
      }
    }

    const copyShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      let copy: fabric.Object

      switch (obj?.type) {
        case ToolEnum.Polygon:
          copy = copyPolygon(canvas!, obj as fabric.Polygon, addShape)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit('canvas:selectShape', copy.id)
          break
        case ToolEnum.Polyline:
          copy = copyPolyline(canvas!, obj as fabric.Polyline, addShape)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit('canvas:selectShape', copy.id)
          break
        case ToolEnum.Rectangle:
          copy = copyRectangle(canvas!, obj as fabric.Rect, addShape)
          // @ts-expect-error id exists but his stupid ts does not know
          Dispatcher.emit('canvas:selectShape', copy.id)
          break
        default:
          break
      }
    }

    const selectShape = (_: string, id: string) => {
      const obj = canvas?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvas?.discardActiveObject()
        canvas?.setActiveObject(obj)
        canvas?.requestRenderAll()
        setActiveTool(ToolEnum.Pointer)
      }
    }

    Dispatcher.register('canvas:removeShape', removeShape)
    Dispatcher.register('canvas:copyShape', copyShape)
    Dispatcher.register('canvas:selectShape', selectShape)

    return () => {
      Dispatcher.unregister('canvas:removeShape', removeShape)
      Dispatcher.unregister('canvas:copyShape', copyShape)
      Dispatcher.unregister('canvas:selectShape', selectShape)
    }
  }, [setActiveTool, canvas, addShape])
}
