import ReactModal from 'react-modal'

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
      >
        <h2>{title}</h2>
        {children}
      </ReactModal>
  )
};

export default Modal;
