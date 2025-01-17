import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import styles from './Loader.module.css'
import { css } from '../../Utils'

export const Loader: React.FC = () => {
  const { themeMode } = useContext(UiContext)

  return <div className={css('loader', styles, themeMode)}></div>
}
