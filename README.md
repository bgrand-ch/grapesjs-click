# GrapesJS click plugin (no more drag-and-drop)

## Installation

```shell
npm install grapesjs grapesjs-click
```

## Usage

### JavaScript

```js
import grapesjs from 'grapesjs'
import grapesjsClick, { getMouseListener, showGrabbedInfo, hideGrabbedInfo } from 'grapesjs-click'

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
import grapesjsClick, { getMouseListener, showGrabbedInfo, hideGrabbedInfo } from 'grapesjs-click'

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
editor.runCommand('click:grab-block', commandOptions)
```

### Drop a block

```ts
const commandOptions = {
  id: string // optional, grabbed block id by default
}
editor.runCommand('click:drop-block', commandOptions)
```

### Grab a component

```ts
const commandOptions = {
  id: string // optional, selected component by default
}
editor.runCommand('click:grab-component', commandOptions)
```

### Drop a component

```ts
const commandOptions = {
  id: string // optional, grabbed component id by default
}
editor.runCommand('click:drop-component', commandOptions)
```

## Events

```ts
// Your custom HTML element to display block or component info.
const grabbedInfoEl = document.getElementById('grabbed-info')

// An utility to make your custom HTML element follow the mouse cursor.
const mouseListener = getMouseListener(grabbedInfoEl)
```

> Full demonstration in the [`src/example.ts`](https://github.com/bgrand-ch/grapesjs-click/blob/main/src/example.ts) file.

### On block grabbed

```ts
editor.on('click:grab-block', (block: Block) => {
  const label = block.getLabel()
  const category = block.getCategoryLabel()

  grabbedInfoEl.textContent = `${label} (${category})`

  showGrabbedInfo(grabbedInfoEl, mouseListener)
})
```

### On block dropped

```ts
editor.on('click:drop-block', () => {
  grabbedInfoEl.textContent = ''
  grabbedInfoEl.style.top = '0'
  grabbedInfoEl.style.left = '0'

  hideGrabbedInfo(grabbedInfoEl, mouseListener)
})
```

### On component grabbed

```ts
editor.on('click:grab-component', (component: Component) => {
  const { name, type } = component.props()
  const label = name || type

  grabbedInfoEl.textContent = label

  showGrabbedInfo(grabbedInfoEl, mouseListener)
})
```

### On component dropped

```ts
editor.on('click:drop-component', (component: Component) => {
  grabbedInfoEl.textContent = ''
  grabbedInfoEl.style.top = '0'
  grabbedInfoEl.style.left = '0'

  hideGrabbedInfo(grabbedInfoEl, mouseListener)
})
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
