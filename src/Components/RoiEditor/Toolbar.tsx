import { useContext } from 'react'

import PointerIcon from '../../Icons/PointerIcon'
import PolygonIcon from '../../Icons/PolygonIcon'
import PolylineIcon from '../../Icons/PolylineIcon'
import RectangleIcon from '../../Icons/RectangleIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import ColorPicker from './ColorPicker'
import styles from './Toolbar.module.css'
import { ToolEnum } from './Types'
import { enableRois } from './Utils'

const Toolbar = () => {
  const { IconButton, themeMode, primaryColor, Typography, strings } = useContext(UiContext)
  const { activeTool, setActiveTool, configuration } = useEditorContext()

  const iconColor = (tool: ToolEnum) => (tool === activeTool ? primaryColor : themeMode === 'light' ? 'black' : 'white')
  const setTool = (tool: ToolEnum) => () => setActiveTool(tool)

  return (
    <>
      {enableRois(configuration) && (
        <>
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

          <div className={css('toolbar-helper', styles, themeMode)}>
            <Typography>
              {strings[activeTool]}: {strings[`${activeTool}HelpText`]}
            </Typography>
          </div>
        </>
      )}
    </>
  )
}

export default Toolbar
