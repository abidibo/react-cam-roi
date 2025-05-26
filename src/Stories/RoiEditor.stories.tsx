/* eslint-disable @typescript-eslint/no-explicit-any */
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import RoiEditor from '../Components/RoiEditor'
import { Output } from '../Components/RoiEditor/Types'
import UiProvider from '../Providers/UiProvider'
import { configuration, initialData, noRoiConfiguration } from './Fixtures'

type RoiEditorProps = React.ComponentProps<typeof RoiEditor>
const meta: Meta<RoiEditorProps> = {
  title: 'ReactCamRoi/ROI Editor',
  component: RoiEditor,
  decorators: [
    (Story, context) => {
      return (
        <div style={{ maxWidth: '1000px' }}>
          <h2>react-cam-roi</h2>
          <UiProvider themeMode={context.globals.theme}>
            <Story />
          </UiProvider>
        </div>
      )
    },
  ],
  args: {
    editorId: 'meow',
    imageUrl: 'https://placecats.com/800/600',
    configuration: configuration,
    initialData: initialData as Output,
    onSubmit: (data) => {
      console.log('output', data)
    },
    onUpdate: (data) => {
      console.log('update', data)
    },
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  // argTypes: {
  //   themeMode: {
  //     options: ['light', 'dark'], // iterator
  //     mapping: ['light', 'dark'],
  //     control: {
  //       type: 'select',
  //       labels: ['light', 'dark']
  //     },
  //   }
  // }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [{ imageUrl }, updateArgs] = useArgs()

    const handleUpdate = () => {
      updateArgs({ imageUrl: `https://picsum.photos/800/600/?${new Date().getTime()}` })
    }
    return (
      <div>
        <p>
          <button onClick={handleUpdate}>change image</button>
        </p>
        <RoiEditor {...args} imageUrl={imageUrl} />
      </div>
    )
  },
  args: {
    editorId: 'default' + String(new Date().getTime()),
  },
}

const CustomTextField = ({ onChange, ...props }: any) => (
  <TextField {...props} onChange={(evt) => onChange(evt.target.value)} variant="outlined" />
)
const CustomNumberField = ({ onChange, ...props }: any) => (
  <TextField {...props} onChange={(evt) => onChange(evt.target.value)} variant="outlined" />
)
const CustomBoolField = ({ onChange, checked, ...props }: any) => (
  <FormControlLabel
    {...props}
    control={<Checkbox checked={checked} onChange={(evt) => onChange(evt.target.checked)} />}
  />
)

export const Mui: Story = {
  decorators: [
    (Story, context) => {
      return (
        <div>
          <h3>Example using some MUI components</h3>
          <p>TextField, Checkbox, IconButton. Dark mode is not configured in this example.</p>
          <UiProvider
            themeMode={context.globals.theme}
            IconButton={IconButton}
            Typography={Typography}
            TextField={CustomTextField}
            NumberField={CustomNumberField}
            BoolField={CustomBoolField}
          >
            <Story />
          </UiProvider>
        </div>
      )
    },
  ],
  args: {
    editorId: 'mui',
  },
  tags: ['autodocs'],
}

export const NoRoi: Story = {
  decorators: [
    (Story, context) => {
      return (
        <div>
          <h3>Example of configuration with no ROIs</h3>
          <UiProvider
            themeMode={context.globals.theme}
            IconButton={IconButton}
            Typography={Typography}
            TextField={CustomTextField}
            NumberField={CustomNumberField}
            BoolField={CustomBoolField}
          >
            <Story />
          </UiProvider>
        </div>
      )
    },
  ],
  args: {
    editorId: 'noRoi',
    imageUrl: 'https://placecats.com/800/600',
    configuration: noRoiConfiguration,
    initialData: initialData as Output,
    onSubmit: (data) => {
      console.log('output', data)
    },
    onUpdate: (data) => {
      console.log('update', data)
    },
  },
  tags: ['autodocs'],
}
