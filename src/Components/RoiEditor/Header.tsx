import { useContext } from 'react'

import { useEditorContext } from '../../Providers/EditorProvider'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Header.module.css'
import RoisInfo from './RoisInfo'

const Header = () => {
  const { themeMode, Typography } =
    useContext(UiContext)
  const { configuration } = useEditorContext()

  return (
    <div className={css('header', styles, themeMode)}>
      <div className={css('header-info', styles, themeMode)}>
        {configuration.options?.description && <Typography>{configuration.options.description}</Typography>}
        <RoisInfo />
      </div>
    </div>
  )
}

export default Header
