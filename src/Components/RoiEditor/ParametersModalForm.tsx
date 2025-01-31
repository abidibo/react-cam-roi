import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'

export type ParametersModalFormProps = {
  onClose: () => void
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({ onClose }) => {
  const { Modal } = useContext(UiContext)
  return (
    <Modal onClose={onClose} title={'title'} isOpen size="lg">
      <div>CIAO</div>
    </Modal>
  )
}

export default ParametersModalForm
