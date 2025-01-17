import { useContext } from 'react'
import { css } from '../../Utils'
import styles from './IconButton.module.css'
import { UiContext } from '../../Providers/UiProvider'

export type IconButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
}
const IconButton: React.FC<IconButtonProps> = ({ children, onClick }) => {
  const { themeMode } = useContext(UiContext)

  return (
    <div className={css('iconButton', styles, themeMode)} onClick={onClick}>
      {children}
    </div>
  )
}

export default IconButton
