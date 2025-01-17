import { createContext, PropsWithChildren, useContext } from 'react'
import { ToolEnum } from '../Components/RoiEditor/Types'

type EditorContextType = {
  activeTool: ToolEnum
  setActiveTool: (tool: ToolEnum) => void
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined) // eslint-disable-line

export function useEditorContext() { // eslint-disable-line
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditorContext must be within a EditorProvider")
  }

  return context
}

const EditorProvider = ({ children, activeTool, setActiveTool }: PropsWithChildren<EditorContextType>) => {
  return <EditorContext.Provider value={{ activeTool, setActiveTool }}>{children}</EditorContext.Provider>
}

export default EditorProvider
