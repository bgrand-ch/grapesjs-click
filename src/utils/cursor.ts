import { logScope } from './constant'

import type { Editor } from 'grapesjs'
import type { BodyCursor } from '../types'

export function changeBodyCursor (
  editor: Editor,
  cursor: BodyCursor
) {
  try {
    const canvas = editor.Canvas
    const bodyElement = canvas.getBody()

    if (!bodyElement) {
      throw new Error('"bodyElement" is empty')
    }

    bodyElement.style.cursor = cursor
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} changeBodyCursor - ${message}`)
  }
}
