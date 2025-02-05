import { createContext, PropsWithChildren, useContext } from 'react'

import { Configuration, Metadata, Shape, Shapes, ShapeType, ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  hideForbiddenTools: boolean
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
  activeColor: string
  setActiveColor: (color: string) => void
  shapes: Shapes
  addShape: (id: string, type: ShapeType, shape: Shape) => void
  addShapes: (shapes: {id: string, type: ShapeType, shape: Shape}[]) => void
  removeShape: (id: string) => void
  configuration: Configuration
  metadata: Metadata
  setMetadata: (data: Metadata) => void
  onSubmit: () => void
  id: string
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
  id,
  hideForbiddenTools,
  activeTool,
  setActiveTool,
  activeColor,
  setActiveColor,
  shapes,
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
        id,
        hideForbiddenTools,
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
        shapes,
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
