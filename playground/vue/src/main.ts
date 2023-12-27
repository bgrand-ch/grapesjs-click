import { createApp } from 'vue'

import App from './App.vue'
import vuetify from './plugins/vuetify'

const vueApp = createApp(App)

vueApp.use(vuetify)
vueApp.mount('#app')
