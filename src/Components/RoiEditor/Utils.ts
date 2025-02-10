import { abs2Perc, formatString } from '../../Utils'
import {
  Configuration,
  ConfigurationParameter,
  INotify,
  Metadata,
  OperatorEnum,
  Shape,
  Shapes,
  ShapeType,
  ToolEnum,
} from './Types'

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
  notify?: INotify,
  message?: string,
): boolean => {
  const rules = configuration.rois.filter((roi) => roi.type === shapeType)

  let currentShapeCount = Object.values(shapes).filter((s) => s.type === shapeType).length

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (rule.multiplicity) {
      switch (rule.multiplicity.operator) {
        case OperatorEnum.Eq:
        case OperatorEnum.Lte:
          if (currentShapeCount < rule.multiplicity.threshold) {
            return true
          }
          currentShapeCount -= rule.multiplicity.threshold
          break
        case OperatorEnum.Lt:
          if (currentShapeCount < rule.multiplicity.threshold - 1) {
            return true
          }
          currentShapeCount -= rule.multiplicity.threshold
          break
        default:
          return true
      }
    }
  }

  if (notify) {
    notify.warn(message || '')
  }

  return false
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
): [boolean, string[]] => {
  const errors = []
  // check main parameters
  if (configuration.parameters.length) {
    if (
      metadata.parameters.find(
        (p) => configuration.parameters.find((p2) => p2.codename === p.codename)?.required && isEmpty(p.value),
      )
    ) {
      errors.push(strings.missingRequiredValuesInMainParameters)
    }
  }
  // check rois number
  configuration.rois.forEach((roi) => {
    // check multiplicity
    if (roi.multiplicity) {
      switch (roi.multiplicity.operator) {
        case OperatorEnum.Eq:
          if ((metadata.rois || []).filter((m) => m.role === roi.role).length !== roi.multiplicity.threshold) {
            errors.push(
              formatString(strings.shapesOfRoleShouldBeEqualToThreshold, {
                role: String(roi.role),
                threshold: roi.multiplicity.threshold,
              }),
            )
          }
          break
        case OperatorEnum.Lt:
          if ((metadata.rois || []).filter((m) => m.role === roi.role).length >= roi.multiplicity.threshold) {
            errors.push(
              formatString(strings.shapesOfRoleShouldBeLessThanThreshold, {
                role: String(roi.role),
                threshold: roi.multiplicity.threshold,
              }),
            )
          }
          break
        case OperatorEnum.Lte:
          if ((metadata.rois || []).filter((m) => m.role === roi.role).length > roi.multiplicity.threshold) {
            errors.push(
              formatString(strings.shapesOfRoleShouldBeLessThanOrEqualToThreshold, {
                role: String(roi.role),
                threshold: roi.multiplicity.threshold,
              }),
            )
          }
          break
        case OperatorEnum.Gt:
          if ((metadata.rois || []).filter((m) => m.role === roi.role).length <= roi.multiplicity.threshold) {
            errors.push(
              formatString(strings.shapesOfRoleShouldBeGreaterThanThreshold, {
                role: String(roi.role),
                threshold: roi.multiplicity.threshold,
              }),
            )
          }
          break
        case OperatorEnum.Gte:
          if ((metadata.rois || []).filter((m) => m.role === roi.role).length < roi.multiplicity.threshold) {
            errors.push(
              formatString(strings.shapesOfRoleShouldBeGreaterThanOrEqualToThreshold, {
                role: String(roi.role),
                threshold: roi.multiplicity.threshold,
              }),
            )
          }
      }
    }
  })

  // check rois metadata
  Object.keys(shapes).forEach((shapeId) => {
    const type = shapes[shapeId].type
    const confParameters = configuration.rois.find((r) => r.type === type)?.parameters ?? []
    confParameters.forEach((p) => {
      if (
        p.required &&
        isEmpty(metadata.rois.find((r) => r.id === shapeId)?.parameters.find((p) => p.codename === p.codename)?.value)
      ) {
        errors.push(strings.missingRequiredValuesInShapeParameters.replace('{id}', shapeId))
      }
    })
  })

  return [errors.length === 0, errors]
}

export const fabricShapeToOutputShape = (
  shape: Shape,
  type: ShapeType,
  imageSize: { width: number; height: number },
) => {
  switch (type) {
    case ToolEnum.Rectangle:
      return {
        top: abs2Perc(shape.top, imageSize.height),
        left: abs2Perc(shape.left, imageSize.width),
        width: abs2Perc(shape.width, imageSize.width),
        height: abs2Perc(shape.height, imageSize.height),
        color: shape.stroke as string,
      }
    case ToolEnum.Polygon:
    case ToolEnum.Polyline:
      return {
        points: shape
          .get('points')
          .map(({ x, y }: { x: number; y: number }) => ({
            x: abs2Perc(x, imageSize.width),
            y: abs2Perc(y, imageSize.height),
          })),
        top: abs2Perc(shape.top, imageSize.height),
        left: abs2Perc(shape.left, imageSize.width),
        color: shape.stroke as string,
      }
  }
}
