import { createContext, PropsWithChildren, useContext } from 'react'

import { Configuration, Metadata, Shape, Shapes, ShapeType, ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
  activeColor: string
  setActiveColor: (color: string) => void
  shapes: Shapes
  addShape: (id: string, type: ShapeType, shape: Shape) => void
  removeShape: (id: string) => void
  configuration: Configuration
  metadata: Metadata
  setMetadata: (data: Metadata) => void
  onSubmit: () => void
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
  activeTool,
  setActiveTool,
  activeColor,
  setActiveColor,
  shapes,
  addShape,
  removeShape,
  configuration,
  metadata,
  setMetadata,
  onSubmit,
}: PropsWithChildren<EditorContextType>) => {
  return (
    <EditorContext.Provider
      value={{
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
        shapes,
        addShape,
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
