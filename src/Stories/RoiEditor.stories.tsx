/* eslint-disable @typescript-eslint/no-explicit-any */
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import RoiEditor from '../Components/RoiEditor'
import { Output } from '../Components/RoiEditor/Types'
import UiProvider from '../Providers/UiProvider'
import { configuration, initialData } from './Fixtures'

type RoiEditorProps = React.ComponentProps<typeof RoiEditor>
const meta: Meta<RoiEditorProps> = {
  title: 'ReactCamRoi/ROI Editor',
  component: RoiEditor,
  decorators: [
    (Story, context) => {
      return (
        <UiProvider themeMode={context.globals.theme}>
          <Story />
        </UiProvider>
      )
    },
  ],
  args: {
    id: 'id',
    imageUrl: 'https://placecats.com/800/600',
    configuration: configuration,
    initialData: initialData as Output,
    onSubmit: (data) => {
      console.log('output', data)
    },
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
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
  args: {
    id: 'default',
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
    id: 'mui',
  },
}
