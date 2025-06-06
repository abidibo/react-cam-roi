import { createContext, PropsWithChildren, useContext } from 'react'

import { Configuration, Metadata, Shape, Shapes, ShapeType, ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  hideForbiddenTools: boolean
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
  activeColor: string
  setActiveColor: (color: string) => void
  presetName: string
  setPresetName: (name: string) => void
  presetDescription: string
  setPresetDescription: (name: string) => void
  shapes: Shapes
  setShapes: (shapes: Shapes) => void
  addShape: (id: string, type: ShapeType, shape: Shape) => void
  addShapes: (shapes: { id: string; type: ShapeType; shape: Shape }[]) => void
  removeShape: (id: string) => void
  configuration: Configuration
  metadata: Metadata
  setMetadata: (data: Metadata) => void
  onSubmit: () => void
  editorId: string
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined) // eslint-disable-line

export function useEditorContext() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditorContext must be within a EditorProvider')
  }

  return context
}

const EditorProvider = ({
  children,
  editorId,
  hideForbiddenTools,
  activeTool,
  setActiveTool,
  activeColor,
  setActiveColor,
  presetName,
  setPresetName,
  presetDescription,
  setPresetDescription,
  shapes,
  setShapes,
  addShape,
  addShapes,
  removeShape,
  configuration,
  metadata,
  setMetadata,
  onSubmit,
}: PropsWithChildren<EditorContextType>) => {
  return (
    <EditorContext.Provider
      value={{
        editorId,
        hideForbiddenTools,
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
        presetName,
        setPresetName,
        presetDescription,
        setPresetDescription,
        shapes,
        setShapes,
        addShape,
        addShapes,
        removeShape,
        configuration,
        metadata,
        setMetadata,
        onSubmit,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
