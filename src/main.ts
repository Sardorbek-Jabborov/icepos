import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import Toast from "vue-toastification";
import Maska from 'maska'
import "vue-toastification/dist/index.css";
import './assets/main.css'


import App from './App.vue'
import router from './router'

const options = {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, options);
app.use(Maska)
app.mount('#app')
