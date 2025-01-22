import { useContext } from 'react'

import PointerIcon from '../../Icons/PointerIcon'
import PolygonIcon from '../../Icons/PolygonIcon'
import PolylineIcon from '../../Icons/PolylineIcon'
import RectangleIcon from '../../Icons/RectangleIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Toolbar.module.css'
import { ToolEnum } from './Types'
import ColorPicker from './ColorPicker'

const Toolbar = () => {
  const { IconButton, themeMode, primaryColor } = useContext(UiContext)
  const { activeTool, setActiveTool } = useEditorContext()

  const iconColor = (tool: ToolEnum) => (tool === activeTool ? primaryColor : themeMode === 'light' ? 'black' : 'white')
  const setTool = (tool: ToolEnum) => () => setActiveTool(tool)

  return (
    <div className={css('toolbar', styles, themeMode)}>
      <IconButton onClick={setTool(ToolEnum.Pointer)}>
        <PointerIcon color={iconColor(ToolEnum.Pointer)} />
      </IconButton>
      <IconButton onClick={setTool(ToolEnum.Polyline)}>
        <PolylineIcon color={iconColor(ToolEnum.Polyline)} />
      </IconButton>
      <IconButton onClick={setTool(ToolEnum.Polygon)}>
        <PolygonIcon color={iconColor(ToolEnum.Polygon)} />
      </IconButton>
      <IconButton onClick={setTool(ToolEnum.Rectangle)}>
        <RectangleIcon color={iconColor(ToolEnum.Rectangle)} />
      </IconButton>
      <ColorPicker style={{ marginLeft: 'auto' }} />
    </div>
  )
}

export default Toolbar
