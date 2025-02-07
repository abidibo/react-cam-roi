import { useContext, useEffect } from 'react'

import { useEditorContext } from '../Providers/EditorProvider'
import { UiContext } from '../Providers/UiProvider'
import { FieldProps } from '../Types'
import EnumField from './EnumField'
import { humanize } from '../Utils'
import { ShapeType } from './RoiEditor/Types'

type RoleFieldProps = Omit<FieldProps<string>, 'readonly' | 'label'> & { shapeType: ShapeType}

const RoleField: React.FC<RoleFieldProps> = ({ onChange, value, required, shapeType, ...props }) => {
  const { strings } = useContext(UiContext)
  const { configuration } = useEditorContext()
  const options: string[] = []
    ; (configuration.rois || []).filter(r => r.type === shapeType).forEach((r) => {
      if (!options.includes(r.role)) {
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
