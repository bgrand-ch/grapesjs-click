# GrapesJS click plugin (no more drag-and-drop)

## Installation

```shell
npm install grapesjs grapesjs-click
```

## Usage

### JavaScript

```js
import grapesjs from 'grapesjs'
import grapesjsClick from 'grapesjs-click'

const pluginOptions = {
  hasAutoDropped: boolean // optional, default to true
}
const editor = grapesjs.init({
  // ...
  plugins: [
    grapesjsClick
  ],
  pluginOpts: {
    [grapesjsClick]: pluginOptions
  }
  // ...
})
```

### TypeScript

```ts
import grapesjs, { usePlugin } from 'grapesjs'
import grapesjsClick from 'grapesjs-click'

const pluginOptions = {
  hasAutoDropped: boolean // default to true
}
const editor = grapesjs.init({
  // ...
  plugins: [
    usePlugin(grapesjsClick, pluginOptions)
  ]
  // ...
})
```

## Commands

### Grab a block

```ts
const commandOptions = {
  id: string // required, grapesjs block identifier
}
editor.run('click:grab-block', commandOptions)
```

### Drop a block

```ts
const commandOptions = {
  id: string // optional, grapesjs block identifier
}
editor.run('click:drop-block', commandOptions)
```

### Grab a component

```ts
const commandOptions = {
  id: string // required, grapesjs component identifier
}
editor.run('click:grab-component', commandOptions)
```

### Drop a component

```ts
const commandOptions = {
  id: string // optional, grapesjs component identifier
}
editor.run('click:drop-component', commandOptions)
```

## Options

```ts
{
  // Drop the grabbed block or component when a component is selected in the canvas.
  hasAutoDropped: boolean // optional, default to true
}
```

## Question? Idea?

If you have a question about how `grapesjs-click` works or an idea to improve it, the [Discussions](https://github.com/bgrand-ch/grapesjs-click/discussions) tab in GitHub is the place to be.

However, if you get an error, you should open an [issue](https://github.com/bgrand-ch/grapesjs-click/issues).

## License

Distributed under the BSD 3-Clause License. See [LICENSE](https://github.com/bgrand-ch/grapesjs-click/blob/main/LICENSE.md) for more information.

## Contact

Benjamin Grand [@bgrand_ch](https://twitter.com/bgrand_ch)
