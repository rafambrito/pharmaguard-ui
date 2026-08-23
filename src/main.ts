import { createApp } from 'vue'
import App from '@/app/App.vue'
import { installProviders } from '@/app/providers'
import '@/shared/styles/base.css'

const app = createApp(App)

installProviders(app)

app.mount('#app')
