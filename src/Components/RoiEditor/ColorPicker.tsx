import { useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './ColorPicker.module.css'

type ColorPickerProps = {
  style?: React.CSSProperties
}

const ColorPicker: React.FC<ColorPickerProps> = ({ style }) => {
  const { pickerColors, themeMode } = useContext(UiContext)
  const { activeColor, setActiveColor } = useEditorContext()

  return (
    <div style={style} className={styles.colorpickerWrapper}>
      {pickerColors.map((color: string) => (
        <div
          key={color}
          onClick={() => setActiveColor(color)}
          className={`${css('colorpicker-button', styles, themeMode)} ${activeColor === color ? css('colorpicker-button-active', styles, themeMode) : ''}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

export default ColorPicker
