import { useEffect, useRef, useState } from 'react'

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
