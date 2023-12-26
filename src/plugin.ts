import { grabBlockCommand, dropBlockCommand, grabComponentCommand, dropComponentCommand } from './utils/constant'
import { onGrabBlock, onDropBlock, getGrabbedBlockId } from './commands/block'
import { onGrabComponent, onDropComponent, getGrabbedComponentId } from './commands/component'
import { getMouseListener, showGrabbedInfo, hideGrabbedInfo, initGrabbedInfo } from './utils/mouse'
import { changeBodyCursor } from './utils/cursor'

import type { Plugin } from 'grapesjs'
import type { PluginOptions } from './types'

const plugin: Plugin<PluginOptions> = (editor, options = {}) => {
  const { hasAutoDropped = true } = options
  const editorCommands = editor.Commands

  editorCommands.add(grabBlockCommand, onGrabBlock)
  editorCommands.add(dropBlockCommand, onDropBlock)

  editorCommands.add(grabComponentCommand, onGrabComponent)
  editorCommands.add(dropComponentCommand, onDropComponent)

  if (!hasAutoDropped) {
    return
  }

  editor.on('component:selected', () => {
    const blockId = getGrabbedBlockId()

    if (blockId) {
      editorCommands.run(dropBlockCommand)
      return
    }

    const componentId = getGrabbedComponentId()

    if (componentId) {
      editorCommands.run(dropComponentCommand)
    }
  })
}

export default plugin

// Utilities
export {
  getMouseListener,
  showGrabbedInfo,
  hideGrabbedInfo,
  initGrabbedInfo,
  changeBodyCursor
}
