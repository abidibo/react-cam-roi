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
      value: null, // default value
    },
  ],
  rois: [
    {
      role: 'invasion_area', // analytics role, do not show in interface
      label: 'Invasion area',
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
      role: 'profile', // analytics role, do not show in interface
      label: 'Profile',
      type: ToolEnum.Point,
      multiplicity: {
        // how many rois of this type can/should be created
        operator: OperatorEnum.Eq, // lt | lte | gt | gte | eq
        threshold: 1,
      },
      parameters: [
        {
          codename: 'threshold', // internal code
          label: 'Profile threshold', // to be shown in interface
          description: 'Threshold used for profiles', // tooltip
          unit: 'm', // unit
          type: DataTypeEnum.Integer, // int, float, string, bool
          options: [],
          required: true, // true / false,
          value: 2, // default value
        },
      ],
    },
    // {
    //   role: 'limit', // analytics role, do not show in interface
    //   label: 'Limit area',
    //   type: ToolEnum.Polyline,
    //   multiplicity: {
    //     // how many rois of this type can/should be created
    //     operator: OperatorEnum.Gte, // lt | lte | gt | gte | eq
    //     threshold: 1,
    //   },
    //   parameters: [
    //     {
    //       codename: 'height', // internal code
    //       label: 'Limit height', // to be shown in interface
    //       description: 'Height of the limit', // tooltip
    //       unit: 'm', // unit
    //       type: DataTypeEnum.Float, // int, float, string, bool
    //       options: [],
    //       required: true, // true / false,
    //       value: null, // default value
    //     },
    //   ],
    // },
  ],
  options: {
    hideForbiddenTools: false,
    description: 'Draw a polygon and one or more polylines.',
    viewMainParameters: true,
  },
}

// export const initialData = undefined
export const initialData = {
  parameters: [
    {
      codename: 'analytics_1',
      value: [10, 7],
    },
    {
      codename: 'analytics_2',
      value: false,
    },
  ],
  rois: [
    {
      parameters: [
        {
          codename: 'threshold',
          value: 2,
        },
      ],
      name: 'Point',
      role: 'profile',
      type: 'point',
      id: '9cbe5d5d-8a5d-4e9f-9e8f-5c4d3b2a1e9d',
      shape: {
        left: 27.63,
        top: 17.53,
        color: '#ff9900',
      },
    },
    {
      parameters: [
        {
          codename: 'threshold',
          value: 9,
        },
      ],
      name: 'Pub',
      role: 'invasion_area',
      type: 'polygon',
      id: 'acbe5d5d-8a5d-4e9f-9e8f-5c4d3b2a1e9d',
      shape: {
        points: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 36.5,
            y: 58.37,
          },
          {
            x: 42.25,
            y: 18.37,
          },
          {
            x: 27.63,
            y: 17.53,
          },
          {
            x: 27.63,
            y: 17.53,
          },
        ],
        top: 0,
        left: 0,
        color: '#ffffff',
      },
    },
    // {
    //   parameters: [
    //     {
    //       codename: 'height',
    //       value: 6.8,
    //     },
    //   ],
    //   name: 'Something',
    //   role: 'limit',
    //   type: 'polyline',
    //   id: '878436d2-8a5d-4e9f-9e8f-5c4d3b2a1e9d',
    //   shape: {
    //     points: [
    //       {
    //         x: 63.88,
    //         y: 7.03,
    //       },
    //       {
    //         x: 60.75,
    //         y: 28.87,
    //       },
    //       {
    //         x: 84,
    //         y: 28.03,
    //       },
    //       {
    //         x: 78.25,
    //         y: 9.2,
    //       },
    //       {
    //         x: 78.25,
    //         y: 9.2,
    //       },
    //     ],
    //     top: 8.53,
    //     left: 61.88,
    //     color: '#ff9900',
    //   },
    // },
  ],
}

export const noRoiConfiguration: Configuration = {
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
      value: null, // default value
    },
  ],
  rois: [],
  options: {
    hideForbiddenTools: false,
    viewMainParameters: true,
  },
}

export const noMainParametersConfiguration: Configuration = {
  parameters: [],
  rois: [
    {
      role: 'invasion_area', // analytics role, do not show in interface
      label: 'Invasion area',
      type: ToolEnum.Rectangle,
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
  ],
  options: {
    hideForbiddenTools: false,
    viewMainParameters: true,
  },
}
