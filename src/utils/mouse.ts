import { logScope, grabBlockCommand, dropBlockCommand, grabComponentCommand, dropComponentCommand } from './constant'

import type { Editor } from 'grapesjs'
import type { MouseListener } from '../types'

const defaultDistance = 24

export function getMouseListener (element: HTMLElement, distance = defaultDistance) {
  return (event: MouseEvent) => {
    try {
      const { clientY, clientX } = event
      const documentElement = document.documentElement
      const documentOffset = documentElement.getBoundingClientRect()
      const halfHeight = element.clientHeight / 1.3

      const topPosition = (clientY - documentOffset.top) + halfHeight
      const leftPosition = (clientX - documentOffset.left) + distance

      element.style.top = `${topPosition}px`
      element.style.left = `${leftPosition}px`
    } catch (err) {
      const { message } = err as Error
      console.warn(`${logScope} onMouseMove - ${message}`)
    }
  }
}

export function showGrabbedInfo (element: HTMLElement, mouseListener?: MouseListener) {
  const currentStyle = window.getComputedStyle(element)

  if (currentStyle.display === 'none') {
    element.style.display = 'block'
  }

  if (currentStyle.position !== 'fixed') {
    element.style.position = 'fixed'
  }

  if (['0', 'auto'].includes(currentStyle.zIndex)) {
    element.style.zIndex = '99999'
  }

  if (!mouseListener) {
    return
  }

  window.addEventListener('mousemove', mouseListener, false)
}

export function hideGrabbedInfo (element: HTMLElement, mouseListener?: MouseListener) {
  element.style.display = 'none'

  if (!mouseListener) {
    return
  }

  window.removeEventListener('mousemove', mouseListener, false)
}

export function initGrabbedInfo (editor: Editor, element: HTMLElement) {
  const mouseListener = getMouseListener(element)
  const showHandler = () => showGrabbedInfo(element, mouseListener)
  const hideHandler = () => hideGrabbedInfo(element, mouseListener)

  editor.on(`run:${grabBlockCommand}`, showHandler)
  editor.on(`run:${dropBlockCommand}`, hideHandler)

  editor.on(`run:${grabComponentCommand}`, showHandler)
  editor.on(`run:${dropComponentCommand}`, hideHandler)
}
