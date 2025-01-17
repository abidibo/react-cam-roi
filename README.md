# React Cam ROI

This is a react component which lets you draw a region of interest (ROI) over images, manage metadata and import/export everything.

## Installation

```
npm install react-cam-roi
```

## Usage

TODO

## Customization

You can customize many aspects of this library by using the `UiProvider`.

- You can customize both the styles and the components use in this library. The library provides default components with an interface compatible witu mui components.
- You can override them by using the `UiProvider`. But you can also use the default ones and just add your styling.
- You can pass a theme mode which is used by the default components to determine the color scheme. It is also used to define custom classes you can use for styling. 
- You can define a primary color which is used for color or background of active elements.
- You can enable logs in the console by setting the `enableLogs` option to `true`.

``` tsx
import { UiProvider, RoiEditor } from 'react-cam-roi'
import IconButton from '@mui/material/IconButton'

const MyView: React.FC = () => {
  return (
    <UiProvider themeMode={'dark'} IconButton={IconButton} primaryColor={'#1976d2'} enableLogs>
      <RoiEditor imageUrl={'whatever'} />
    </UiProvider>
  )
}
```

### Components

Here comes the list of components you can override using the `UiProvider`.

#### Loader

##### Interface

``` ts 
type LoaderProps = {}
```

##### Classes
- `react-cam-roi-loader`
- `react-cam-roi-loader-light`
- `react-cam-roi-loader-dark`

#### IconButton

##### Interface

``` ts 
type IconButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
}
```

##### Classes
- `react-cam-roi-toolbar`
- `react-cam-roi-toolbar-light`
- `react-cam-roi-toolbar-dark`

### Styles

There are components that cannot be overridden. But still you can use classes to style them.

- `react-cam-roi-editor-wrapper`
- `react-cam-roi-editor-wrapper-light`
- `react-cam-roi-editor-wrapper-dark`
