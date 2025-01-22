# React Cam ROI

> Still in development!

This is a react component which lets you draw regions of interest (ROI) over images, manage metadata and import/export everything.

## Installation

```
npm install react-cam-roi
```

## Usage

TODO

## Customization

You can customize many aspects of this library by using the `UiProvider`.

- You cancustomize both the styles and the components use in this library. The library provides default components with an interface compatible witu mui components.
- You can override them by using the `UiProvider`. But you can also use the default ones and just add your styling.
- You can pass a theme mode which is used by the default components to determine the color scheme. It is also used to define custom classes you can use for styling. 
- You can define a primary color which is used for color or background of active elements.
- You can define custom strings used here and there.
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

### UiProvider

```ts 
type UiContextType = {
  children?: React.ReactNode
  enableLogs: boolean
  themeMode: 'light' | 'dark'
  primaryColor: string
  Typography: React.FC<TypographyProps>
  IconButton: React.FC<IconButtonProps>
  DeleteIcon: React.FC<DeleteIconProps>
  EditIcon: React.FC<EditIconProps>
  SelectIcon: React.FC<SelectIconProps>
  strings: {
    id: string
    type: string
  }
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

#### Typography

##### Interface

``` ts 
type TypographyProps = {
  children?: React.ReactNode
}
```

#### IconButton

##### Interface

``` ts 
type IconButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
}
```

#### DeleteIcon

##### Interface

``` ts 
type DeleteIconProps = {
  color?: string
  style?: React.CSSProperties
}
```

#### EditIcon

##### Interface

``` ts 
type EditIconProps = {
  color?: string
  style?: React.CSSProperties
}
```

#### SelectIcon

##### Interface

``` ts 
type SelectIconProps = {
  color?: string
  style?: React.CSSProperties
}
```

### Styles

There are components that cannot be overridden. But still you can use classes to style them.

#### Wrapper

- `react-cam-roi-editor-wrapper`
- `react-cam-roi-editor-wrapper-light`
- `react-cam-roi-editor-wrapper-dark`

#### Toolbar

- `react-cam-roi-toolbar`
- `react-cam-roi-toolbar-light`
- `react-cam-roi-toolbar-dark`

#### Metadata table

- `react-cam-roi-metadata-table`
- `react-cam-roi-metadata-table-light`
- `react-cam-roi-metadata-table-dark`

#### Colorpicker button

- `react-cam-roi-colorpicker-button`
- `react-cam-roi-colorpicker-button-light`
- `react-cam-roi-colorpicker-button-dark`

- `react-cam-roi-colorpicker-button-active`
- `react-cam-roi-colorpicker-button-active-light`
- `react-cam-roi-colorpicker-button-active-dark`

## Development

| Command | Description |
| --- | --- |
| `npm run clean` | Clean the dist folder |
| `npm run build` | Build the library |
| `npm run storybook` | Run storybook |

A github action pipeline is provided, it will publish the package to npm when a new tag is pushed. You need to add the `NPM_TOKEN` secret to your repository settings.

Example of deployment:

``` bash
$ npm version patch
$ git push
$ git push --tags
```
