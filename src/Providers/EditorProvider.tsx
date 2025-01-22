import * as fabric from 'fabric'
import { createContext, PropsWithChildren, useContext } from 'react'

import { ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
  selectedShapes: fabric.Object[] | null
  setSelectedShapes: (shapes: fabric.Object[] | null) => void
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
  selectedShapes,
  setSelectedShapes,
}: PropsWithChildren<EditorContextType>) => {
  return (
    <EditorContext.Provider value={{ activeTool, setActiveTool, selectedShapes, setSelectedShapes }}>
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
