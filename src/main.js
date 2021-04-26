import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import VueKaiUI from "vue-kaiui"; 
import 'vuelayers/lib/style.css'
import VueLayers from 'vuelayers'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import vueInsomnia from "vue-insomnia";
import '@/generalMixin'

console.log(Vue.version); 

Vue.config.productionTip = false
Vue.use(Buefy, {
  defaultIconPack: 'fa',
})
Vue.use(vueInsomnia);
Vue.use(VueLayers, {
  // global data projection, see https://vuelayers.github.io/#/quickstart?id=global-data-projection
  // dataProjection: 'EPSG:4326',
})

Vue.use(VueKaiUI) 

new Vue({
  render: h => h(App),
}).$mount('#app')

