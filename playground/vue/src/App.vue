<template>
  <main>
    <div id="editor">
      <div data-gjs-type="text" style="max-width: 600px;">
        Insert your text here
      </div>
    </div>

    <v-card
      v-show="showGrabbedInfoComponent"
      ref="grabbedInfoComponent"
      class="mx-auto"
      min-width="300"
    >
      <v-card-item>
        <v-card-title>
          Grabbed element info
        </v-card-title>
        <v-card-subtitle>
          Test text interpolation.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        {{ blockInfo }} block
      </v-card-text>
    </v-card>
  </main>
</template>

<script setup lang="ts">
import 'grapesjs/dist/css/grapes.min.css'

import { ref, shallowRef, watch, onMounted } from 'vue'
import grapesjs, { usePlugin } from 'grapesjs'
import grapesjsBlocks from 'grapesjs-blocks-basic'
import grapesjsClick, { initGrabbedInfo } from 'grapesjs-click'

import type { ComponentPublicInstance } from 'vue'
import type { Editor } from 'grapesjs'

const editor = ref<Editor|null>(null)
const showGrabbedInfoComponent = ref(false)
const grabbedInfoComponent = shallowRef<ComponentPublicInstance|null>(null)
const blockInfo = ref('')

watch(blockInfo, value => {
  console.log('Block info updated', value)
})

watch(showGrabbedInfoComponent, value => {
  if (!editor.value) {
    return
  }

  const editorCommands = editor.value.Commands
  const commandOptions = {
    id: 'text', // block id from "grapesjs-blocks-basic" plugin
    isDebugging: true
  }

  blockInfo.value = editor.value.Blocks.get('text').getLabel()

  if (!value) {
    editorCommands.run('click:drop-block', commandOptions)
    return
  }

  editorCommands.run('click:grab-block', commandOptions)
})

onMounted(() => {
  editor.value = grapesjs.init({
    container: '#editor',
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

  editor.value.on('load', () => {
    console.log('Editor loaded', editor.value)

    if (
      editor.value &&
      grabbedInfoComponent.value
    ) {
      const grabbedInfoElement = grabbedInfoComponent.value.$el
      initGrabbedInfo(editor.value, grabbedInfoElement)
    }

    showGrabbedInfoComponent.value = true

    // const tenSeconds = 10000
    // const timeoutId = window.setTimeout(() => {
    //   showGrabbedInfoComponent.value = false
    //   window.clearTimeout(timeoutId)
    // }, tenSeconds)
  })
})
</script>
