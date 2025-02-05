import { useCallback, useContext, useState } from 'react'

import EditorProvider from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, log } from '../../Utils'
import { Loader } from '../Loader'
import Canvas from './Canvas'
import { useCanvasSize } from './Hooks'
import styles from './RoiEditor.module.css'
import ShapesList from './ShapesList'
import Toolbar from './Toolbar'
import { Configuration, Metadata, Output, Shape, Shapes, ShapeType, ToolEnum } from './Types'
import { fabricShapeToOutputShape, validate } from './Utils'

export type RoiEditorProps = {
  // the url of the image we want to annotate
  imageUrl: string
  configuration: Configuration
  onSubmit: (data: Output) => void
  initialData?: Output
}

// https://github.com/n-mazaheri/image-editor
const RoiEditor: React.FC<RoiEditorProps> = ({ imageUrl, configuration, onSubmit, initialData }) => {
  const { themeMode, enableLogs, pickerColors, strings, notify } = useContext(UiContext)
  const { imageSize, canvasSize, wrapperRef, isReady } = useCanvasSize(imageUrl)

  const [activeTool, setActiveTool] = useState(ToolEnum.Pointer)
  const [activeColor, setActiveColor] = useState(pickerColors[0])

  const [metadata, setMetadata] = useState<Metadata>({
    parameters: [
      ...(configuration.parameters.map((p) => {
        const initial = initialData?.parameters.find((p) => p.codename === p.codename)
        return {
          codename: p.codename,
          value: initial ? initial.value : p.value,
        }
      }) ?? []),
    ],
    rois: [],
  })
  const [shapes, setShapes] = useState<Shapes>({})
  const addShape = useCallback(
    (id: string, type: ShapeType, shape: Shape) => setShapes({ ...shapes, [id]: { type, shape } }),
    [shapes],
  )
  const addShapes = useCallback(
    (s: { id: string, type: ShapeType, shape: Shape }[]) => setShapes({ ...shapes, ...s.reduce((r, s) => ({ ...r, [s.id]: s }), {}) }),
    [shapes],
  )

  const removeShape = useCallback(
    (id: string) => {
      const newShapes = { ...shapes }
      delete newShapes[id]
      setShapes(newShapes)
      setMetadata({ ...metadata, rois: metadata.rois.filter((r) => r.id !== id) })
    },
    [shapes, metadata],
  )

  const handleSubmit = useCallback(() => {
    const [isValid, errors] = validate(configuration, shapes, metadata, strings)
    if (isValid) {
      onSubmit({
        parameters: metadata.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
        rois: Object.keys(shapes).map((shapeId) => ({
          parameters:
            metadata.rois
              .find((r) => r.id === shapeId)
              ?.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
          type: shapes[shapeId].type,
          shape: fabricShapeToOutputShape(shapes[shapeId].shape, shapes[shapeId].shape.type as ShapeType),
        })),
      })
    } else {
      notify.error(strings.invalidSubmission + '\n' + errors.map((e) => `- ${e}`).join('\n'))
    }
  }, [onSubmit, configuration, shapes, metadata, strings, notify])

  log('info', enableLogs, 'react-cam-roi', 'active tool', activeTool)
  log('info', enableLogs, 'react-cam-roi', 'canvas size', canvasSize)
  log('info', enableLogs, 'react-cam-roi', 'metadata', metadata)

  if (!isReady) {
    return <Loader />
  }
  return (
    <EditorProvider
      hideForbiddenTools={configuration.options?.hideForbiddenTools ?? false}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      activeColor={activeColor}
      setActiveColor={setActiveColor}
      shapes={shapes}
      addShape={addShape}
      addShapes={addShapes}
      removeShape={removeShape}
      configuration={configuration}
      metadata={metadata}
      setMetadata={setMetadata}
      onSubmit={handleSubmit}
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
          <Canvas canvasSize={canvasSize} initialData={initialData} />
        </div>
        <ShapesList />
      </div>
    </EditorProvider>
  )
}

export default RoiEditor
