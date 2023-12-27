// This file is only used by Vite during development.
// It is ignored when the files are built.

import 'grapesjs/dist/css/grapes.min.css'

import grapesjs, { usePlugin } from 'grapesjs'
import grapesjsBlocks from 'grapesjs-blocks-basic'
import grapesjsClick, { initGrabbedInfo } from './plugin'
import { grabBlockCommand } from './utils/constant'

import type { CommandOptions } from './types'

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

  const getElement = (textContent: string) => {
    const divElement = document.getElementById('element') as HTMLDivElement
    divElement.textContent = textContent

    return divElement
  }

  const grabBlock = (id: string) => {
    const editorCommands = editor.Commands
    const commandOptions: CommandOptions = {
      id, // block id from "grapesjs-blocks-basic" plugin
      isDebugging: true
    }

    editorCommands.run(grabBlockCommand, commandOptions)
  }

  editor.on('load', () => {
    console.log('Editor loaded', editor)

    const element = getElement('Text block grabbed')
    initGrabbedInfo(editor, element)

    grabBlock('text')
  })
}

runExample()
