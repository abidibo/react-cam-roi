import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import RoiEditor from '../Components/RoiEditor'
import UiProvider from '../Providers/UiProvider'
import { configuration } from './Fixtures'

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
    imageUrl: 'https://placecats.com/800/600',
    configuration: configuration,
  },
}
