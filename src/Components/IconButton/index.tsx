import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './IconButton.module.css'

export type IconButtonProps = {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
}
const IconButton: React.FC<IconButtonProps> = ({ children, disabled, onClick }) => {
  const { themeMode } = useContext(UiContext)

  return (
    <div
      className={`${css('icon-button', styles, themeMode)} ${disabled ? css('icon-button-disabled', styles, themeMode) : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  )
}

export default IconButton
