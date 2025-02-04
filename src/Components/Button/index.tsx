import { CSSProperties, PropsWithChildren, useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Button.module.css'

export type ButtonProps = {
  onClick: (event: React.MouseEvent) => void
  primary?: boolean
  disabled?: boolean
}

const Button = ({ onClick, primary, disabled, children }: PropsWithChildren<ButtonProps>) => {
  const { themeMode, primaryColor } = useContext(UiContext)
  const style: CSSProperties = {}
  if (primary) {
    style.backgroundColor = primaryColor
    style.color = 'white'
  }

  return (
    <button
      className={`${css('button', styles, themeMode)}${disabled ? ` ${css('button-disabled', styles, themeMode)}` : ''}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
