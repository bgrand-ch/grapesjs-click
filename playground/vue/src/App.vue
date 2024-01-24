<template>
  <main>
    <div id="editor">
      <div data-gjs-type="text">
        Insert your text here
      </div>
    </div>

    <div
      v-show="grabbedInfo"
      ref="grabbedInfoEl"
      class="grabbed-info"
    >
      {{ grabbedInfo }}
    </div>
  </main>
</template>

<script setup lang="ts">
import 'grapesjs/dist/css/grapes.min.css'

import { ref, shallowRef, onMounted } from 'vue'
import grapesjs, { usePlugin } from 'grapesjs'
import grapesjsBlocks from 'grapesjs-blocks-basic'
import grapesjsClick, { getMouseListener, hideGrabbedInfo, showGrabbedInfo } from 'grapesjs-click'

import { grabBlockCommand, dropBlockCommand, grabComponentCommand, dropComponentCommand } from './utils/command'
import { updateBlocks } from './utils/block'
import { capitalizeValue } from './utils/string'
import { grabIcon } from './utils/icon'

import type { Editor, Block, Component } from 'grapesjs'

const editor = shallowRef<Editor|null>(null)
const grabbedInfoEl = shallowRef<HTMLElement|null>(null)
const grabbedInfo = ref<string>('')

onMounted(async () => {
  editor.value = grapesjs.init({
    container: '#editor',
    height: '100vh',
    fromElement: true,
    storageManager: false,
    plugins: [
      usePlugin(grapesjsBlocks, {
        flexGrid: true
      }),
      usePlugin(grapesjsClick)
    ]
  })

  if (!grabbedInfoEl.value) {
    return
  }

  const mouseListener = getMouseListener(grabbedInfoEl.value)

  // For demonstration purposes, set the click event for all blocks.
  editor.value.once('load', () => {
    console.log('Editor loaded', editor.value)
    updateBlocks(editor.value!)
  })

  // Update the toolbar of the selected component to add the grab action.
  editor.value.on('component:selected', (selectedComponent: Component) => {
    const { type: componentType } = selectedComponent.props()
    const toolbar = selectedComponent.toolbar

    const isWrapperComponent = componentType === 'wrapper'
    const hasGrabbedAction = toolbar.some(({ command }) => command === grabComponentCommand)

    if (
      isWrapperComponent ||
      hasGrabbedAction
    ) {
      return
    }

    toolbar.unshift({
      label: grabIcon,
      command: grabComponentCommand,
      attributes: {
        title: 'Grab this component'
      }
    })

    selectedComponent.set({ toolbar })
  })

  // Show information on the currently grabbed block and follow the mouse cursor.
  editor.value.on(grabBlockCommand, (block: Block) => {
    const label = block.getLabel()
    const category = block.getCategoryLabel()

    grabbedInfo.value = `${label} (${category})`

    showGrabbedInfo(grabbedInfoEl.value!, mouseListener)
  })

  // Hide information on the currently grabbed block, because it has been dropped.
  editor.value.on(dropBlockCommand, () => {
    grabbedInfo.value = ''
    hideGrabbedInfo(grabbedInfoEl.value!, mouseListener)
  })

  // Show information on the currently grabbed component and follow the mouse cursor.
  editor.value.on(grabComponentCommand, (component: Component) => {
    const { name, type } = component.props()
    const label = name || capitalizeValue(type)

    grabbedInfo.value = label

    showGrabbedInfo(grabbedInfoEl.value!, mouseListener)
  })

  // Hide information on the currently grabbed component, because it has been dropped.
  editor.value.on(dropComponentCommand, () => {
    grabbedInfo.value = ''
    hideGrabbedInfo(grabbedInfoEl.value!, mouseListener)
  })
})
</script>

<style scoped>
.grabbed-info {
  padding: 8px;
  border-radius: 4px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

body {
  line-height: 1;
}
</style>
