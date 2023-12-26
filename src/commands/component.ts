import { pluginName, logScope } from '../utils/constant'
import { changeBodyCursor } from '../utils/cursor'
import { getComponentById, selectComponent, getDroppableComponent } from '../utils/component'

import type { Editor, Component } from 'grapesjs'
import type { CommandOptions } from '../types'

const itemName = `${pluginName}-component`

export function getGrabbedComponentId () {
  return window.sessionStorage.getItem(itemName)
}

export function resetGrabbedComponent (editor: Editor, component?: Component) {
  window.sessionStorage.removeItem(itemName)
  editor.trigger('component:drag:stop', component)

  changeBodyCursor(editor, 'auto')
}

export function onGrabComponent (editor: Editor, sender: unknown, options: CommandOptions) {
  try {
    const { isDebugging, id: componentId } = options

    if (isDebugging) {
      console.log(`${logScope} onGrabComponent`, {
        editor,
        sender,
        options
      })
    }

    if (!componentId) {
      throw new Error('"componentId" is required')
    }

    const component = getComponentById(editor, componentId)

    if (!component) {
      throw new Error('"component" is empty')
    }

    const { draggable } = component.props()

    // TODO: Check string and function
    if (draggable === false) {
      throw new Error('"component" is not draggable')
    }

    window.sessionStorage.setItem(itemName, componentId)
    editor.trigger('component:drag:start', component)

    changeBodyCursor(editor, 'grabbing')
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} onGrabComponent - ${message}`)

    resetGrabbedComponent(editor)
  }
}

export function onDropComponent (editor: Editor, sender: unknown, options: CommandOptions) {
  try {
    const { isDebugging, id } = options

    if (isDebugging) {
      console.log(`${logScope} onDropComponent`, {
        editor,
        sender,
        options
      })
    }

    const grabbedComponentId = window.sessionStorage.getItem(itemName)
    const componentId = grabbedComponentId || id

    if (!componentId) {
      throw new Error('"componentId" is required')
    }

    const component = getComponentById(editor, componentId)

    if (!component) {
      throw new Error('"component" is empty')
    }

    const { draggable, copyable, removable } = component.props()

    // TODO: Check string and function
    if (
      draggable === false ||
      copyable === false ||
      removable === false
    ) {
      throw new Error('"component" is not draggable, copyable or removable')
    }

    const selectedComponent = editor.getSelected() || editor.getWrapper()

    if (!selectedComponent) {
      throw new Error('"selectedComponent" is empty')
    }

    const droppableComponent = getDroppableComponent(selectedComponent)

    if (!droppableComponent) {
      throw new Error('"droppableComponent" is empty')
    }

    const clonedComponent: Component = component.clone()
    const appendedComponent = droppableComponent.append(clonedComponent)?.[0]

    if (appendedComponent) {
      component.remove()
      selectComponent(editor, appendedComponent)
    }

    resetGrabbedComponent(editor, component)
  } catch (err) {
    const { message } = err as Error
    console.warn(`${logScope} onDropComponent - ${message}`)

    resetGrabbedComponent(editor)
  }
}
