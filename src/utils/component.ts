import { logScope } from './constant'

import type { Editor, Component } from 'grapesjs'

export function getComponentById (editor: Editor, componentId: string) {
  try {
    const componentManager = editor.Components
    const wrapperComponent = componentManager.getWrapper()

    if (!wrapperComponent) {
      throw new Error('"wrapperComponent" is empty')
    }

    const component = wrapperComponent.find(`#${componentId}`)?.[0]

    if (!component) {
      throw new Error('"component" is empty')
    }

    return component
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} getComponentById - ${message}`)
  }
}

export function getDroppableComponent (component: Component) {
  try {
    const { droppable } = component.props()

    // TODO: Check string and function
    if (droppable !== false) {
      return component
    }

    const parentComponent = component.parent()

    if (!parentComponent) {
      return
    }

    return getDroppableComponent(parentComponent)
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} getDroppableComponent - ${message}`)
  }
}

export function selectComponent (
  editor: Editor,
  component: Component,
  msDuration = 500
) {
  const timeoutId = window.setTimeout(() => {
    editor.select(component)
    window.clearTimeout(timeoutId)
  }, msDuration)
}
