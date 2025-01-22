import { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { useEditorContext } from '../../Providers/EditorProvider';
import { useTool } from './Hooks';
import Dispatcher from '../../Utils/Dispatcher';
import { Shape } from './Types';

type CanvasProps = {
  canvasSize: { width: number; height: number }
}
const Canvas: React.FC<CanvasProps> = ({ canvasSize }) => {
  const { activeTool, selectedShapes, setSelectedShapes, addShape, removeShape } = useEditorContext()
  const canvasRef = useRef<fabric.Canvas>(null)

  useTool(activeTool, selectedShapes, setSelectedShapes, addShape, removeShape, canvasRef.current)

  useEffect(() => {
    const removeShape = (_: string, id: string) => {
      const obj = canvasRef.current?.getObjects().find((s: fabric.Object) => (s as Shape).id === id)
      if (obj) {
        canvasRef.current?.remove(obj)
      }
    }

    Dispatcher.register('canvas:removeShape', removeShape)

    return () => {
      Dispatcher.unregister('canvas:removeShape', removeShape)
    }
  }, [])

  useEffect(() => {
    canvasRef.current = new fabric.Canvas('react-cam-roi-canvas')
    canvasRef.current.setDimensions({ width: canvasSize.width, height: canvasSize.height })
    return () => { canvasRef.current?.dispose() }
  }, [canvasSize.width, canvasSize.height])

  return <canvas id="react-cam-roi-canvas" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }} />
}
export default Canvas
