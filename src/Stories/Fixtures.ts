import { Configuration, DataTypeEnum, OperatorEnum, ToolEnum } from "../Components/RoiEditor/Types";

export const configuration: Configuration = {
  parameters: [
    {
      codename: 'analytics_1', // internal code
      label: 'Analytics param 1', // to be shown in interface
      description: 'This is some descriptive text', // tooltip
      unit: 's', // unit
      type: DataTypeEnum.Integer, // int, float, string, bool
      options: [
        // if filled -> enum of types type
        {
          value: 7,
          label: 'Seven',
        },
        {
          value: 10,
          label: 'Ten',
        },
      ],
      required: true, // true | false,
      value: 10, // default value
    },
  ],
  rois: [
    {
      role: 'invasion_area', // analytics role, do not show in interface
      type: ToolEnum.Polygon,
      multiplicity: {
        // how many rois of this type can/should be created
        operator: OperatorEnum.Lt, // lt | lte | gt | gte | eq
        threshold: 2,
      },
      parameters: [
        {
          codename: 'threshold', // internal code
          label: 'Alert threshold', // to be shown in interface
          description: 'Threshold used for triggering alarms', // tooltip
          unit: '%', // unit
          type: DataTypeEnum.Integer, // int, float, string, bool
          options: [],
          required: true, // true / false,
          value: null, // default value
        },
      ],
    },
  ],
}
