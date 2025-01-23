# React Cam ROI

> Still in development!

This is a react component which lets you draw regions of interest (ROI) over images, manage metadata and import/export everything.

It provides one component: `RoiEditor` and one provider: `UiProvider`. The editor lets you draw regions of interest over a given image (url). Each has dynamic metadata attached (configured via api).
Export and import functionality is also provided.

Features:

- Autosizing of the editor: the canvas resizes to the size of the image, but it's also responsive, so if the container width is smaller, then the canvas is resized accordingly keeping the aspect ratio.
- Draw polylines, polygons and rectangles, change dimensions and rotate them.
- Support for dynamic metadata information attached to each shape.
- Import and export shapes and metadata in json format.
- Highly customizable: custom components and css classes.

## Installation

```
npm install @abidibo/react-cam-roi
```

## Usage

TODO

## Customization

You can customize many aspects of this library by using the `UiProvider`.

- You can customize both the styles and the components use in this library. The library provides default components with an interface compatible witu mui components.
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

#### Toolbar help text

- `react-cam-roi-toolbar-helper`
- `react-cam-roi-toolbar-helper-light`
- `react-cam-roi-toolbar-helper-dark`

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

After cloning the repository, you can run the following commands:

| Command | Description |
| --- | --- |
| `npm run clean` | Clean the dist folder |
| `npm run build` | Build the library |
| `npm run storybook` | Run storybook |

In order to start developing just run the storybook, then make changes to code and the storybook will be updated.

In order to test the library in onother local react project you can:

```bash
$ cd react-cam-roi
$ yarn link
$ cd ../my-project
$ yarn link @abidibo/react-cam-roi
```

Then rebuild this library to see your changes in the project.

## CI

A github action pipeline is provided, it will publish the package to npm when a new tag is pushed. You need to add the `NPM_TOKEN` secret to your repository settings.

Example of deployment:

``` bash
$ npm version patch
$ git push
$ git push --tags
```
