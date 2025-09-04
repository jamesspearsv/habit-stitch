import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import '@client/assets/reset.css'
import '@client/assets/globals.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
