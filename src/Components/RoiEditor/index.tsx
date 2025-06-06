import * as fabric from 'fabric'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import EditorProvider from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css, log } from '../../Utils'
import { Loader } from '../Loader'
import Canvas from './Canvas'
import Header from './Header'
import { useCanvasSize } from './Hooks'
import styles from './RoiEditor.module.css'
import ShapesList from './ShapesList'
import Toolbar from './Toolbar'
import TopBar from './TopBar'
import { Configuration, Metadata, Output, Shape, Shapes, ShapeType, ToolEnum } from './Types'
import { fabricShapeToOutputCoords, fabricShapeToOutputShape, validate } from './Utils'

export type RoiEditorProps = {
  editorId: string
  // the url of the image we want to annotate
  imageUrl: string
  configuration: Configuration
  onSubmit: (data: Output) => void
  onUpdate?: (data: Output) => void
  initialData?: Output
  allowPartialSave?: boolean
  slots?: {
    roiAbove?: React.ReactNode
  }
}

// https://github.com/n-mazaheri/image-editor
const RoiEditor: React.FC<RoiEditorProps> = ({
  imageUrl,
  configuration,
  onSubmit,
  onUpdate,
  initialData,
  editorId,
  allowPartialSave,
  slots,
}) => {
  log('info', true, 'react-cam-roi', 'React', React)
  const firstUpdate = useRef(0)
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const { themeMode, enableLogs, pickerColors, strings, notify } = useContext(UiContext)
  const { imageSize, canvasSize, wrapperRef, isReady } = useCanvasSize(imageUrl)
  const [presetName, setPresetName] = useState(initialData?.presetName ?? '')
  const [presetDescription, setPresetDescription] = useState(initialData?.presetDescription ?? '')

  const [activeTool, setActiveTool] = useState(ToolEnum.Pointer)
  const [activeColor, setActiveColor] = useState(pickerColors[0])

  // metadata
  const [metadata, setMetadata] = useState<Metadata>({
    parameters: [
      ...(configuration.parameters.map((p) => {
        const initial = initialData?.parameters?.find((initP) => initP.codename === p.codename)
        return {
          codename: p.codename,
          value: initial ? initial.value : p.value,
        }
      }) ?? []),
    ],
    rois: [],
  })

  // fabric shapes
  const [shapes, setShapes] = useState<Shapes>({})
  const addShape = useCallback(
    (id: string, type: ShapeType, shape: Shape) => setShapes({ ...shapes, [id]: { type, shape } }),
    [shapes],
  )
  const addShapes = useCallback(
    (s: { id: string; type: ShapeType; shape: Shape }[]) =>
      setShapes({ ...shapes, ...s.reduce((r, s) => ({ ...r, [s.id]: s }), {}) }),
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

  const prepareOutput = useCallback(
    (metadata: Metadata, shapes: Shapes, presetName: string, presetDescription: string) => {
      return {
        parameters: metadata.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
        presetName,
        presetDescription,
        rois: Object.keys(shapes).map((shapeId) => ({
          parameters:
            metadata.rois
              .find((r) => r.id === shapeId)
              ?.parameters?.map((p) => ({ codename: p.codename, value: p.value })) ?? [],
          name: metadata.rois.find((r) => r.id === shapeId)?.name ?? '',
          role: metadata.rois.find((r) => r.id === shapeId)?.role ?? '',
          type: shapes[shapeId].type,
          id: shapeId,
          shape: fabricShapeToOutputShape(shapes[shapeId].shape, shapes[shapeId].type as ShapeType, imageSize),
          coords: fabricShapeToOutputCoords(shapes[shapeId].shape, shapes[shapeId].shape.type as ShapeType, imageSize),
        })),
      }
    },
    [imageSize.width, imageSize.height, canvasRef], // eslint-disable-line
  )

  useEffect(() => {
    // do not run on first update
    if (firstUpdate.current < 3) {
      firstUpdate.current += 1
      return
    } else if (onUpdate) {
      // notify every update
      onUpdate(prepareOutput(metadata, shapes, presetName, presetDescription))
    }
  }, [metadata, shapes, onUpdate, prepareOutput])

  const handleSubmit = useCallback(() => {
    const [isValid, errors] = validate(configuration, presetName, shapes, metadata, strings)
    if (isValid) {
      onSubmit(prepareOutput(metadata, shapes, presetName, presetDescription))
    } else if (allowPartialSave) {
      onSubmit({ ...prepareOutput(metadata, shapes, presetName, presetDescription), errors })
    } else {
      notify.error(strings.invalidSubmission + '\n' + errors.map((e) => `- ${e}`).join('\n'))
    }
  }, [onSubmit, configuration, shapes, metadata, prepareOutput, strings, notify, presetName, presetDescription])

  log('info', enableLogs, 'react-cam-roi', 'active tool', activeTool)
  log('info', enableLogs, 'react-cam-roi', 'canvas size', canvasSize)
  log('info', enableLogs, 'react-cam-roi', 'metadata', metadata)

  if (!isReady) {
    return <Loader />
  }
  return (
    <EditorProvider
      editorId={editorId}
      hideForbiddenTools={configuration.options?.hideForbiddenTools ?? false}
      activeTool={activeTool}
      setActiveTool={setActiveTool}
      activeColor={activeColor}
      setActiveColor={setActiveColor}
      presetName={presetName}
      setPresetName={setPresetName}
      presetDescription={presetDescription}
      setPresetDescription={setPresetDescription}
      shapes={shapes}
      setShapes={setShapes}
      addShape={addShape}
      addShapes={addShapes}
      removeShape={removeShape}
      configuration={configuration}
      metadata={metadata}
      setMetadata={setMetadata}
      onSubmit={handleSubmit}
    >
      <div style={{ maxWidth: '100%', width: `${imageSize.width}px` }} ref={wrapperRef}>
        <TopBar />
        {configuration.rois && configuration.rois.length > 0 && (
          <>
            {slots?.roiAbove && slots.roiAbove}
            <div className={css('rois-wrapper', styles, themeMode)}>
              <Header />
              <Toolbar />
              <div
                className={css('canvas-wrapper', styles, themeMode)}
                style={{
                  width: `${canvasSize.width}px`,
                  height: `${canvasSize.height}px`,
                  backgroundImage: `url(${imageUrl})`,
                }}
              >
                <Canvas canvasRef={canvasRef} imageSize={imageSize} canvasSize={canvasSize} initialData={initialData} />
              </div>
              <ShapesList />
            </div>
          </>
        )}
      </div>
    </EditorProvider>
  )
}

export default RoiEditor
