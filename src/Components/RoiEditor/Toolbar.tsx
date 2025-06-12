import { useContext } from 'react'

import FullRoiIcon from '../../Icons/FullRoiIcon'
import PointIcon from '../../Icons/PointIcon'
import PointerIcon from '../../Icons/PointerIcon'
import PolygonIcon from '../../Icons/PolygonIcon'
import PolylineIcon from '../../Icons/PolylineIcon'
import RectangleIcon from '../../Icons/RectangleIcon'
import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import ColorPicker from './ColorPicker'
import { renderFullImagePolygon } from './Polygon'
import styles from './Toolbar.module.css'
import { ToolEnum } from './Types'
import { canDrawShape, enableRois } from './Utils'

type ToolbarProps = {
  imageSize: { width: number; height: number }
  canvasRef: React.MutableRefObject<fabric.Canvas | null>
}
const Toolbar: React.FC<ToolbarProps> = ({ canvasRef, imageSize }) => {
  const { IconButton, themeMode, primaryColor, Typography, strings } = useContext(UiContext)
  const { activeTool, setActiveTool, configuration, shapes, editorId, activeColor } = useEditorContext()

  const iconColor = (tool: ToolEnum) => (tool === activeTool ? primaryColor : themeMode === 'light' ? 'black' : 'white')
  const setTool = (tool: ToolEnum) => () => setActiveTool(tool)

  const hideForbiddenTools = configuration.options?.hideForbiddenTools
  const pointEnabled =
    configuration.rois.find((r) => r.type === ToolEnum.Point) && canDrawShape(configuration, ToolEnum.Point, shapes)
  const polylineEnabled =
    configuration.rois.find((r) => r.type === ToolEnum.Polyline) &&
    canDrawShape(configuration, ToolEnum.Polyline, shapes)
  const polygonEnabled =
    configuration.rois.find((r) => r.type === ToolEnum.Polygon) && canDrawShape(configuration, ToolEnum.Polygon, shapes)
  const rectangleEnabled =
    configuration.rois.find((r) => r.type === ToolEnum.Rectangle) &&
    canDrawShape(configuration, ToolEnum.Rectangle, shapes)

  const handleRenderFullImagePolygon = () => {
    renderFullImagePolygon(editorId, canvasRef.current, activeColor, imageSize)
  }

  return (
    <>
      <div className={css('toolbar', styles, themeMode)}>
        {enableRois(configuration) && (
          <>
            <IconButton onClick={setTool(ToolEnum.Pointer)}>
              <PointerIcon color={iconColor(ToolEnum.Pointer)} />
            </IconButton>
            {(!hideForbiddenTools || pointEnabled) && (
              <IconButton onClick={setTool(ToolEnum.Point)} disabled={!pointEnabled}>
                <PointIcon color={iconColor(ToolEnum.Point)} />
              </IconButton>
            )}
            {(!hideForbiddenTools || polylineEnabled) && (
              <IconButton onClick={setTool(ToolEnum.Polyline)} disabled={!polylineEnabled}>
                <PolylineIcon color={iconColor(ToolEnum.Polyline)} />
              </IconButton>
            )}
            {(!hideForbiddenTools || polygonEnabled) && (
              <>
                <IconButton onClick={setTool(ToolEnum.Polygon)} disabled={!polygonEnabled}>
                  <PolygonIcon color={iconColor(ToolEnum.Polygon)} />
                </IconButton>
                <IconButton onClick={handleRenderFullImagePolygon} disabled={!polygonEnabled}>
                  <FullRoiIcon color={iconColor(ToolEnum.Polygon)} />
                </IconButton>
              </>
            )}
            {(!hideForbiddenTools || rectangleEnabled) && (
              <IconButton onClick={setTool(ToolEnum.Rectangle)} disabled={!rectangleEnabled}>
                <RectangleIcon color={iconColor(ToolEnum.Rectangle)} />
              </IconButton>
            )}
            <ColorPicker style={{ marginLeft: 'auto', marginRight: '.5rem' }} />
          </>
        )}
      </div>
      {enableRois(configuration) && (
        <div className={css('toolbar-helper', styles, themeMode)}>
          <Typography>
            {strings[activeTool]}: {strings[`${activeTool}HelpText`]}
          </Typography>
        </div>
      )}
    </>
  )
}

export default Toolbar
