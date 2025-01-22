import { createContext, PropsWithChildren, useContext } from 'react'

import { Shape, Shapes, ShapeType, ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
  shapes: Shapes,
  addShape: (id: string, type: ShapeType, shape: Shape) => void
  removeShape: (id: string) => void
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
  shapes,
  addShape,
  removeShape,
}: PropsWithChildren<EditorContextType>) => {
  return (
    <EditorContext.Provider
      value={{ activeTool, setActiveTool, shapes, addShape, removeShape }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
