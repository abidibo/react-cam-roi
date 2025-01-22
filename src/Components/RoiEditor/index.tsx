import { useCallback, useContext, useState } from 'react'

import EditorProvider from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, log } from '../../Utils'
import { Loader } from '../Loader'
import Canvas from './Canvas'
import { useCanvasSize } from './Hooks'
import Metadata from './Metadata'
import styles from './RoiEditor.module.css'
import Toolbar from './Toolbar'
import { Shape, Shapes, ShapeType, ToolEnum } from './Types'

export type RoiEditorProps = {
  // the url of the image we want to annotate
  imageUrl: string
}

// https://medium.com/@na.mazaheri/dynamically-drawing-shapes-on-canvas-with-fabric-js-in-react-js-8b9c42791903
// https://github.com/n-mazaheri/image-editor
const RoiEditor: React.FC<RoiEditorProps> = ({ imageUrl }) => {
  const { themeMode, enableLogs, pickerColors } = useContext(UiContext)
  const { imageSize, canvasSize, wrapperRef, isReady } = useCanvasSize(imageUrl)

  const [activeTool, setActiveTool] = useState(ToolEnum.Pointer)
  const [activeColor, setActiveColor] = useState(pickerColors[0])

  const [shapes, setShapes] = useState<Shapes>({})
  const addShape = useCallback(
    (id: string, type: ShapeType, shape: Shape) => setShapes({ ...shapes, [id]: { type, shape } }),
    [shapes],
  )
  const removeShape = useCallback(
    (id: string) => {
      const newShapes = { ...shapes }
      delete newShapes[id]
      setShapes(newShapes)
    },
    [shapes],
  )

  log('info', enableLogs, 'react-cam-roi', 'active tool', activeTool)
  log('info', enableLogs, 'react-cam-roi', 'canvas size', canvasSize)

  if (!isReady) {
    return <Loader />
  }
  return (
    <EditorProvider
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      activeColor={activeColor}
      setActiveColor={setActiveColor}
      shapes={shapes}
      addShape={addShape}
      removeShape={removeShape}
    >
      <div style={{ maxWidth: '100%', width: `${imageSize.width}px` }} ref={wrapperRef}>
        <Toolbar />
        <div
          className={css('canvasWrapper', styles, themeMode)}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            backgroundImage: `url(${imageUrl})`,
          }}
        >
          <Canvas canvasSize={canvasSize} />
        </div>
        <Metadata />
      </div>
    </EditorProvider>
  )
}

export default RoiEditor
