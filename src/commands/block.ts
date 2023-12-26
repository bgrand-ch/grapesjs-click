import { pluginName, logScope } from '../utils/constant'
import { changeBodyCursor } from '../utils/cursor'
import { selectComponent, getDroppableComponent } from '../utils/component'

import type { Editor, Block } from 'grapesjs'
import type { CommandOptions } from '../types'

const itemName = `${pluginName}-block`

export function getGrabbedBlockId () {
  return window.sessionStorage.getItem(itemName)
}

export function resetGrabbedBlock (editor: Editor, block?: Block) {
  window.sessionStorage.removeItem(itemName)
  editor.trigger('block:drag:stop', block)

  changeBodyCursor(editor, 'auto')
}

export function onGrabBlock (editor: Editor, sender: unknown, options: CommandOptions) {
  try {
    const { isDebugging, id: blockId } = options

    if (isDebugging) {
      console.log(`${logScope} onGrabBlock`, {
        editor,
        sender,
        options
      })
    }

    if (!blockId) {
      throw new Error('"blockId" is required')
    }

    const blockManager = editor.Blocks
    const block = blockManager.get(blockId)

    if (!block) {
      throw new Error('"block" is empty')
    }

    const { disable } = block.attributes

    if (disable) {
      throw new Error('"block" is disable')
    }

    window.sessionStorage.setItem(itemName, blockId)
    editor.trigger('block:drag:start', block)

    changeBodyCursor(editor, 'grabbing')
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} onGrabBlock - ${message}`)

    resetGrabbedBlock(editor)
  }
}

export function onDropBlock (editor: Editor, sender: unknown, options: CommandOptions) {
  try {
    const { isDebugging, id } = options

    if (isDebugging) {
      console.log(`${logScope} onDropBlock`, {
        editor,
        sender,
        options
      })
    }

    const grabbedBlockId = window.sessionStorage.getItem(itemName)
    const blockId = grabbedBlockId || id

    if (!blockId) {
      throw new Error('"blockId" is required')
    }

    const blockManager = editor.Blocks
    const block = blockManager.get(blockId)

    if (!block) {
      throw new Error('"block" is empty')
    }

    const selectedComponent = editor.getSelected() || editor.getWrapper()

    if (!selectedComponent) {
      throw new Error('"selectedComponent" is empty')
    }

    const droppableComponent = getDroppableComponent(selectedComponent)

    if (!droppableComponent) {
      throw new Error('"droppableComponent" is empty')
    }

    const component = block.getContent()

    if (!component) {
      throw new Error('"component" is empty')
    }

    const appendedComponent = droppableComponent.append(component)?.[0]

    if (appendedComponent) {
      selectComponent(editor, appendedComponent)
    }

    resetGrabbedBlock(editor, block)
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} onDropBlock - ${message}`)

    resetGrabbedBlock(editor)
  }
}
