import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'

export type ParametersModalFormProps = {
  onClose: () => void
  title: string
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({ title, onClose }) => {
  const { Modal, Typography } = useContext(UiContext)
  return (
    <Modal onClose={onClose} title={title} isOpen size="lg">
      <Typography>Here comes the dynamic parameters form</Typography>
    </Modal>
  )
}

export default ParametersModalForm
