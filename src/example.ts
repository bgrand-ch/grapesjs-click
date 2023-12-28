// This file is only used by Vite during development.
// It is ignored when the files are built.

import 'grapesjs/dist/css/grapes.min.css'

import grapesjs, { usePlugin } from 'grapesjs'
import grapesjsBlocks from 'grapesjs-blocks-basic'
import grapesjsClick, { getMouseListener, hideGrabbedInfo, showGrabbedInfo } from './plugin'
import { grabBlockCommand, dropBlockCommand, grabComponentCommand, dropComponentCommand } from './utils/constant'

import type { Editor, Block, Component } from 'grapesjs'
import type { CommandOptions } from './types'

const grabIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M188 76a31.85 31.85 0 0 0-11.21 2A32 32 0 0 0 128 67a32 32 0 0 0-52 25v16h-8a32 32 0 0 0-32 32v12a92 92 0 0 0 184 0v-44a32 32 0 0 0-32-32m8 76a68 68 0 0 1-136 0v-12a8 8 0 0 1 8-8h8v20a12 12 0 0 0 24 0V92a8 8 0 0 1 16 0v28a12 12 0 0 0 24 0V92a8 8 0 0 1 16 0v28a12 12 0 0 0 24 0v-12a8 8 0 0 1 16 0Z"/></svg>'

function updateBlocks (editor: Editor) {
  const blockManager = editor.Blocks
  const blocks = blockManager.getAll()

  for (const block of blocks) {
    block.set('onClick', () => {
      const blockId = block.attributes.id
      const commandOptions: CommandOptions = {
        id: blockId,
        isDebugging: true
      }

      editor.runCommand(grabBlockCommand, commandOptions)
    })
  }
}

function resetElement (element: HTMLElement) {
  element.textContent = ''
  element.style.top = '0'
  element.style.left = '0'
}

function capitalizeValue (value?: string) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.charAt(0).toUpperCase() + value.slice(1)
}

function runExample () {
  const editor = grapesjs.init({
    container: '#editor', // same as id in the "index.html" file
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
  const grabbedInfoEl = document.getElementById('grabbed-info')!
  const mouseListener = getMouseListener(grabbedInfoEl)

  editor.on('load', () => {
    console.log('Editor loaded', editor)
    updateBlocks(editor)
  })

  editor.on('component:selected', (selectedComponent: Component) => {
    const { type } = selectedComponent.props()
    const toolbar = selectedComponent.toolbar
    const hasGrabbedAction = toolbar.some(({ command }) => {
      return command === grabComponentCommand
    })

    if (
      type === 'wrapper' ||
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

  editor.on(grabBlockCommand, (block: Block) => {
    const label = block.getLabel()
    const category = block.getCategoryLabel()

    grabbedInfoEl.textContent = `${label} (${category})`

    showGrabbedInfo(grabbedInfoEl, mouseListener)
  })

  editor.on(dropBlockCommand, () => {
    resetElement(grabbedInfoEl)
    hideGrabbedInfo(grabbedInfoEl, mouseListener)
  })

  editor.on(grabComponentCommand, (component: Component) => {
    const { name, type } = component.props()
    const label = name || capitalizeValue(type)

    grabbedInfoEl.textContent = label

    showGrabbedInfo(grabbedInfoEl, mouseListener)
  })

  editor.on(dropComponentCommand, () => {
    resetElement(grabbedInfoEl)
    hideGrabbedInfo(grabbedInfoEl, mouseListener)
  })
}

runExample()
