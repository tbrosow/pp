import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import { Fragment } from "vue-fragment";
import lodash from 'lodash'
import VueLodash from 'vue-lodash'
import VueRouter from 'vue-router'
import VueJsonPretty from 'vue-json-pretty'

import statistics from './components/statistics.vue'
import formBuilder from './components/formBuilder.vue'

Vue.use(BootstrapVue)
Vue.use(Fragment)
Vue.use(VueLodash, lodash)
Vue.use(VueRouter)

const Home = { template: '<div>home</div>' }
const Task = { template: '<statistics></statistics>' }

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: Home },
        { path: '/fb', component: formBuilder },

        { path: '/list', component: statistics }
    ]
})

// new Vue({
//     router,
//   el: '#app',
//
//   render: h => h(App)
// })

new Vue({
    router,
    template: `
    <div id="app">
      
      <ul style="background: aquamarine">
        <li><router-link to="/">home</router-link></li>
        <li><router-link to="/list?col=task">My tasks</router-link></li>
        <li><router-link to="/list?col=incident">My Incidents</router-link></li>
        <li><router-link to="/list?col=sequence">Number Maintenance</router-link></li>
        <li><router-link to="/list?col=db_collection" exact v-on:click="close()">Collections</router-link></li>
        <li><router-link to="/list?col=dictionary">Dictionary</router-link></li>
        <li><router-link to="/list?col=user">Users</router-link></li>
        <li><router-link to="/fb?col=dictionary">Form Builder</router-link></li>
        
      </ul>
      <router-view :key="$route.fullPath" class="view"></router-view>
    </div>
  `
}).$mount('#app')
