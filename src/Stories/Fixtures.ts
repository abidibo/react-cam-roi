import { Configuration, DataTypeEnum, OperatorEnum, ToolEnum } from '../Components/RoiEditor/Types'

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
      multiple: true,
      required: true, // true | false,
      value: 10, // default value
    },
    {
      codename: 'analytics_2', // internal code
      label: 'Analytics param 2', // to be shown in interface
      description: 'This is some descriptive text', // tooltip
      unit: 's', // unit
      type: DataTypeEnum.Boolean, // int, float, string, bool
      options: [],
      required: true, // true | false,
      value: '', // default value
    },
  ],
  rois: [
    {
      role: 'invasion_area', // analytics role, do not show in interface
      type: ToolEnum.Polygon,
      multiplicity: {
        // how many rois of this type can/should be created
        operator: OperatorEnum.Eq, // lt | lte | gt | gte | eq
        threshold: 1,
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
    {
      role: 'limit', // analytics role, do not show in interface
      type: ToolEnum.Polyline,
      multiplicity: {
        // how many rois of this type can/should be created
        operator: OperatorEnum.Gte, // lt | lte | gt | gte | eq
        threshold: 1,
      },
      parameters: [
        {
          codename: 'height', // internal code
          label: 'Limit height', // to be shown in interface
          description: 'Height of the limit', // tooltip
          unit: 'm', // unit
          type: DataTypeEnum.Float, // int, float, string, bool
          options: [],
          required: true, // true / false,
          value: null, // default value
        },
      ],
    },
  ],
  options: {
    hideForbiddenTools: false,
    description: 'Draw a polygon and one or more polylines.',
  },
}

export const initialData = {
  parameters: [
    {
      codename: 'analytics_1',
      value: 'seven',
    },
    {
      codename: 'analytics_2',
      value: 10,
    },
    {
      codename: 'analytics_3',
      value: true,
    },
  ],
  rois: [
    {
      parameters: [
        {
          codename: 'threshold',
          value: 9,
        },
      ],
      type: 'polygon',
      shape: {
        points: [
          {
            x: 169,
            y: 211.203125,
          },
          {
            x: 292,
            y: 350.203125,
          },
          {
            x: 338,
            y: 110.203125,
          },
          {
            x: 221,
            y: 105.203125,
          },
          {
            x: 221,
            y: 105.203125,
          },
        ],
        top: 104.203125,
        left: 168,
        color: '#ffffff',
      },
    },
    {
      parameters: [
        {
          codename: 'height',
          value: 6.8,
        },
      ],
      type: 'polyline',
      shape: {
        points: [
          {
            x: 511,
            y: 42.203125,
          },
          {
            x: 486,
            y: 173.203125,
          },
          {
            x: 672,
            y: 168.203125,
          },
          {
            x: 626,
            y: 55.203125,
          },
          {
            x: 626,
            y: 55.203125,
          },
        ],
        top: 41.203125,
        left: 485,
        color: '#ff9900',
      },
    },
  ],
}
