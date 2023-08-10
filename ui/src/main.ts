import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import HomeScreen from '@/views/HomeScreen.vue'
import ClassesScreen from '@/views/ClassesScreen.vue'
import AdminScreen from '@/views/AdminScreen.vue'
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: '/classes',
      name: 'Classes',
      component: ClassesScreen
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminScreen
    },
    {
      path: '/',
      name: 'Home',
      component: HomeScreen
    }
  ]
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
