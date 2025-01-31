import { useContext } from 'react'

import { UiContext } from '../../Providers/UiProvider'

export type ParametersModalFormProps = {
  onClose: () => void
}

const ParametersModalForm: React.FC<ParametersModalFormProps> = ({ onClose }) => {
  const { Modal, strings, Typography } = useContext(UiContext)
  return (
    <Modal onClose={onClose} title={strings.mainParametersMetadata} isOpen size="lg">
      <Typography>Here comes the dynamic parameters form</Typography>
    </Modal>
  )
}

export default ParametersModalForm
