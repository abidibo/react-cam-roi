import { useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'
import { FabricEvent, Shape, ToolEnum } from './Types'
import { handleMouseDownRect, handleMouseMoveRect, handleMouseUpRect } from './Rectangle'

export const useImageSize = (imageUrl: string) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      setImageSize({ width: image.width, height: image.height })
    }
  }, [imageUrl])

  return { imageSize, isDone: imageSize.width > 0 }
}

export const useCanvasSize = (imageUrl: string) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const { imageSize, isDone } = useImageSize(imageUrl)

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

  return { imageSize, canvasSize, wrapperRef, isDone }
}

export const useTool = (tool: ToolEnum, canvas: fabric.Canvas | null) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [shape, setShape] = useState<Shape>(null)
  const [originX, setOriginX] = useState(0)
  const [originY, setOriginY] = useState(0)
  const [startPos] = useState({ x: 0, y: 0 })
  console.log('TOOL', tool, canvas, ToolEnum.Rectangle) // eslint-disable-line

  useEffect(() => {
    if (!canvas) {
      return
    }
    canvas.selection = tool === ToolEnum.Pointer

    const handleMouseDown = (event: FabricEvent) => {
      console.log('MOUSE DOWN DETECTED') // eslint-disable-line
      switch (tool) {
        case ToolEnum.Rectangle:
          console.log('MOUSE DOWN ADDED') // eslint-disable-line
          handleMouseDownRect(event, canvas, setOriginX, setOriginY, setShape, setIsDrawing)
          break
        default:
          break
      }
    }

    const handleMouseMove = (event: FabricEvent) => {
      switch (tool) {
        case ToolEnum.Rectangle:
          handleMouseMoveRect(event, canvas, originX, originY, shape, isDrawing)
          break
        default:
          break
      }
    }

    const handleMouseUp = () => {
      switch (tool) {
        case ToolEnum.Rectangle:
          handleMouseUpRect(canvas, setIsDrawing, shape, setShape)
          break
        default:
          break
      }
    }

    const handleDoubleClick = () => {
      switch (tool) {
        default:
          break
      }
    }

    console.log('ADDING EVENTS') // eslint-disable-line
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('mouse:dblclick', handleDoubleClick)

    return () => {
        canvas.off('mouse:down', handleMouseDown)
        canvas.off('mouse:move', handleMouseMove)
        canvas.off('mouse:up', handleMouseUp)
        canvas.off('mouse:dblclick', handleDoubleClick)
    }
  }, [tool, isDrawing, shape, originX, originY, startPos, canvas])
}
