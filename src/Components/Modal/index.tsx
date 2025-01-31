import { useContext } from 'react'
import ReactModal from 'react-modal'

import CloseIcon from '../../Icons/CloseIcon'
import { UiContext } from '../../Providers/UiProvider'
import { css } from '../../Utils'
import styles from './Modal.module.css'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size }) => {
  const { themeMode, IconButton } = useContext(UiContext)
  const iconColor = themeMode === 'light' ? 'black' : 'white'

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`${css('modal', styles, themeMode)} ${css(`modal-${size}`, styles, themeMode)}`}
      overlayClassName={css('modal-overlay', styles, themeMode)}
    >
      <div className={css('modal-header', styles, themeMode)} onClick={onClose}>
        <h4 className={css('modal-title', styles, themeMode)}>{title}</h4>
        <IconButton onClick={onClose}>
          <CloseIcon color={iconColor} />
        </IconButton>
      </div>
      {children}
    </ReactModal>
  )
}

export default Modal
