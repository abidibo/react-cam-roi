import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Header.module.css'
import RoisInfo from './RoisInfo'

const Header = () => {
  const { themeMode } = useContext(UiContext)

  return (
    <div className={css('header', styles, themeMode)}>
      <div className={css('header-info', styles, themeMode)}>
        <RoisInfo />
      </div>
    </div>
  )
}

export default Header
