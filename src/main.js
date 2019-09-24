import Vue from 'vue'
import App from './App.vue'
import store from './store'
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/checkbox.css'
import './assets/table.css'

Vue.config.productionTip = false

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
