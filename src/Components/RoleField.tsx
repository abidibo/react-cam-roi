import { useContext, useEffect } from 'react'

import { useEditorContext } from '../Providers/EditorProvider'
import { UiContext } from '../Providers/UiProvider'
import { FieldProps } from '../Types'
import { humanize } from '../Utils'
import { Metadata, OperatorEnum, ShapeType } from './RoiEditor/Types'

type RoleFieldProps = Omit<FieldProps<string>, 'readonly' | 'label'> & { shapeType: ShapeType }

const isAllowed = (role: string, multiplicity: { operator: string; threshold: number }, metadata: Metadata) => {
  switch (multiplicity.operator) {
    case OperatorEnum.Eq:
    case OperatorEnum.Lte:
      return metadata.rois.filter((m) => m.role === role).length < multiplicity.threshold
    case OperatorEnum.Lt:
      return metadata.rois.filter((m) => m.role === role).length < multiplicity.threshold - 1
    default:
      return true
  }
}

const RoleField: React.FC<RoleFieldProps> = ({ onChange, value, required, shapeType, ...props }) => {
  const { strings, EnumField } = useContext(UiContext)
  const { configuration, metadata } = useEditorContext()
  const options: string[] = []
  const rois = configuration.rois || []
  rois
    .filter((r) => r.type === shapeType)
    .forEach((r) => {
      if (!options.includes(r.role) && (!r.multiplicity || isAllowed(r.role, r.multiplicity!, metadata))) {
        options.push(r.role)
      }
    })

  useEffect(() => {
    if (required) {
      onChange(options[0])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <EnumField<string>
      required={required}
      label={strings.role}
      value={value}
      onChange={(value) => onChange(value as string)}
      options={options.map((o) => ({ value: o, label: humanize(o) }))}
      {...props}
    />
  )
}

export default RoleField
