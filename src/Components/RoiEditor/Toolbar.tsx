import { useContext, useState } from 'react'

import AnnotateIcon from '../../Icons/AnnotateIcon'
import PointerIcon from '../../Icons/PointerIcon'
import PolygonIcon from '../../Icons/PolygonIcon'
import PolylineIcon from '../../Icons/PolylineIcon'
import RectangleIcon from '../../Icons/RectangleIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import ColorPicker from './ColorPicker'
import ParametersModalForm from './ParametersModalForm'
import styles from './Toolbar.module.css'
import { ConfigurationParameter, ToolEnum } from './Types'
import { enableMainMetadata, enableRois } from './Utils'

const Toolbar = () => {
  const { IconButton, themeMode, primaryColor, Typography, strings } = useContext(UiContext)
  const { activeTool, setActiveTool, configuration } = useEditorContext()
  const [form, setForm] = useState<{ isOpen: boolean; data: ConfigurationParameter[] }>({ isOpen: false, data: [] })

  const iconColor = (tool: ToolEnum) => (tool === activeTool ? primaryColor : themeMode === 'light' ? 'black' : 'white')
  const setTool = (tool: ToolEnum) => () => setActiveTool(tool)

  return (
    <>
      <div className={css('toolbar', styles, themeMode)}>
        {enableRois(configuration) && (
          <>
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
          </>
        )}
        {enableRois(configuration) && enableMainMetadata(configuration) && (
          <div className={css('toolbar-spacer', styles, themeMode)} />
        )}
        {enableMainMetadata(configuration) && (
          <IconButton onClick={() => setForm({ isOpen: true, data: configuration.parameters })}>
            <AnnotateIcon color={iconColor(ToolEnum.Rectangle)} />
          </IconButton>
        )}
      </div>

      <div className={css('toolbar-helper', styles, themeMode)}>
        <Typography>
          {strings[activeTool]}: {strings[`${activeTool}HelpText`]}
        </Typography>
      </div>

      {form.isOpen && <ParametersModalForm onClose={() => setForm({ isOpen: false, data: [] })} />}
    </>
  )
}

export default Toolbar
