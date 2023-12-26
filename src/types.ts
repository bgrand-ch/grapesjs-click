export type BodyCursor = 'auto'|'grabbing'

export type MouseListener = (event: MouseEvent) => void

export type CommandOptions = {
  id?: string, // block or component id
  isDebugging?: boolean
}

export type PluginOptions = {
  hasAutoDropped?: boolean
}
