/// <reference path="../types.d.ts"/>
import './static-loader'
import { http } from '@/services'
import App from './app.vue'
import { createApp } from 'vue'

// http.init()
createApp(App).mount('#app')