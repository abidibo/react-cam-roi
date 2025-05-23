import { createPortal } from 'react-dom';
import { PropsWithChildren, useContext } from 'react'

import CloseIcon from '../../Icons/CloseIcon'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Modal.module.css'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onSubmit?: () => void
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, children, title, maxWidth, onSubmit }) => {
  const { themeMode, IconButton, Typography, Button, strings } = useContext(UiContext)
  const iconColor = themeMode === 'light' ? 'black' : 'white'

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className={css('modal-overlay', styles, themeMode)}>
      <div className={`${css('modal', styles, themeMode)} ${css(`modal-${maxWidth}`, styles, themeMode)}`}>
        <div className={css('modal-header', styles, themeMode)}>
          <Typography component='h6' className={css('modal-title', styles, themeMode)}>{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon color={iconColor} />
          </IconButton>
        </div>
        {children}
        <div className={css('modal-footer', styles, themeMode)}>
          <Button onClick={onClose}>{strings.cancel}</Button>
          {onSubmit && <Button primary onClick={onSubmit}>{strings.save}</Button>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
