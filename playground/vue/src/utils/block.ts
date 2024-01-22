import type { Editor } from 'grapesjs'

export const grabBlockCommand = 'click:grab-block'
export const dropBlockCommand = 'click:drop-block'

export function updateBlocks (editor: Editor) {
  const blockManager = editor.Blocks
  const blocks = blockManager.getAll()

  for (const block of blocks) {
    block.set('onClick', () => {
      const blockId = block.attributes.id
      const commandOptions = {
        id: blockId,
        isDebugging: true
      }

      editor.runCommand(grabBlockCommand, commandOptions)
    })
  }
}
