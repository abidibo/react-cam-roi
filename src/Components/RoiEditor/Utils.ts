import { Configuration, ConfigurationParameter, INotify, Metadata, OperatorEnum, Shape, Shapes, ShapeType, ToolEnum } from './Types'

export const notify: INotify = {
  info: (message: string) => alert(`Info: ${message}`),
  warn: (message: string) => alert(`Warning: ${message}`),
  error: (message: string) => alert(`Error: ${message}`),
  success: (message: string) => alert(`Success: ${message}`),
}

export const enableRois = (configuration: Configuration): boolean => {
  return configuration.rois.length > 0
}

export const enableMainMetadata = (configuration: Configuration): boolean => {
  return configuration.parameters.length > 0
}

export const canDrawShape = (
  configuration: Configuration,
  shapeType: Omit<ToolEnum, ToolEnum.Pointer>,
  shapes: Shapes,
  notify: INotify,
  message: string,
): boolean => {
  const rule = configuration.rois.find((roi) => roi.type === shapeType)

  // no rule
  if (!rule || !rule.multiplicity || Object.keys(rule.multiplicity).length === 0) {
    return true
  }

  const currentShapeCount = Object.values(shapes).filter((s) => s.type === shapeType).length

  let res = true
  switch (rule.multiplicity.operator) {
    case OperatorEnum.Eq:
    case OperatorEnum.Lte:
      res = currentShapeCount + 1 <= rule.multiplicity.threshold
      break
    case OperatorEnum.Lt:
      res = currentShapeCount + 1 < rule.multiplicity.threshold
      break
    default:
      return true
  }

  if (!res && notify) {
    notify.warn(message)
  }

  return res
}

export const validateParametersForm = (
  parameters: ConfigurationParameter[],
  fields: Record<string, unknown>,
  setErrors: (errors: Record<string, string>) => void,
) => {
  const err: Record<string, string> = {}
  parameters.forEach((p) => {
    if (p.required && isEmpty(fields[p.codename] as string | number | boolean | string[] | number[])) {
      err[p.codename] = 'requiredField'
    }
  })

  if (Object.keys(err).length > 0) {
    setErrors(err)
    return false
  }

  return true
}

const isEmpty = (v: string | number | boolean | string[] | number[] | null | undefined): boolean => {
  if (typeof v === 'string') {
    return v.length === 0
  }
  if (Array.isArray(v)) {
    return v.length === 0
  }
  return v === null || v === undefined
}

export const validate = (
  configuration: Configuration,
  shapes: Shapes,
  metadata: Metadata,
  strings: Record<string, string>,
) : [boolean, string[]] => {
  const errors = []
  // check main parameters
  if (configuration.parameters.length) {
    if (metadata.parameters.find((p) => p.required && isEmpty(p.value))) {
      errors.push(strings.missingRequiredValuesInMainParameters)
    }
  }
  // check rois number
  configuration.rois.forEach((roi) => {
    // check multiplicity
    if (roi.multiplicity) {
      switch (roi.multiplicity.operator) {
        case OperatorEnum.Eq:
          if (Object.values(shapes).filter((s) => s.type === roi.type).length !== roi.multiplicity.threshold) {
            errors.push(
              strings.shapesOfTypeShouldBeEqualToThreshold
                .replace('{type}', String(roi.type))
                .replace('{threshold}', roi.multiplicity.threshold.toString()),
            )
          }
          break
        case OperatorEnum.Lt:
          if (Object.values(shapes).filter((s) => s.type === roi.type).length >= roi.multiplicity.threshold) {
            errors.push(
              strings.shapesOfTypeShouldBeLessThanThreshold
                .replace('{type}', String(roi.type))
                .replace('{threshold}', roi.multiplicity.threshold.toString()),
            )
          }
          break
        case OperatorEnum.Lte:
          if (Object.values(shapes).filter((s) => s.type === roi.type).length > roi.multiplicity.threshold) {
            errors.push(
              strings.shapesOfTypeShouldBeLessThanOrEqualToThreshold
                .replace('{type}', String(roi.type))
                .replace('{threshold}', roi.multiplicity.threshold.toString()),
            )
          }
          break
        case OperatorEnum.Gt:
          if (Object.values(shapes).filter((s) => s.type === roi.type).length <= roi.multiplicity.threshold) {
            errors.push(
              strings.shapesOfTypeShouldBeGreaterThanThreshold
                .replace('{type}', String(roi.type))
                .replace('{threshold}', roi.multiplicity.threshold.toString()),
            )
          }
          break
        case OperatorEnum.Gte:
          if (Object.values(shapes).filter((s) => s.type === roi.type).length < roi.multiplicity.threshold) {
            errors.push(
              strings.shapesOfTypeShouldBeGreaterThanOrEqualToThreshold
                .replace('{type}', String(roi.type))
                .replace('{threshold}', roi.multiplicity.threshold.toString()),
            )
          }
      }
    }
  })

  // check rois metadata
  Object.keys(shapes).forEach(shapeId => {
    const type = shapes[shapeId].type
    const confParameters = configuration.rois.find((r) => r.type === type)?.parameters ?? []
    confParameters.forEach((p) => {
      if (p.required && isEmpty(metadata.rois.find((r) => r.id === shapeId)?.parameters.find((p) => p.codename === p.codename)?.value)) {
        errors.push(strings.missingRequiredValuesInShapeParameters.replace('{id}', shapeId))
      }
    })
  })


  return [errors.length === 0, errors]
}

export const fabricShapeToOutputShape = (shape: Shape, type: ShapeType) => {
  switch (type) {
    case ToolEnum.Rectangle:
      return {
        top: shape.top,
        left: shape.left,
        width: shape.width,
        height: shape.height,
        color: shape.stroke as string
      }
    case ToolEnum.Polygon:
    case ToolEnum.Polyline:
      return {
        points: shape.get('points'),
        color: shape.stroke as string
      }
  }
}
