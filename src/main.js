import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import request from 'network/request'
import JsonViewer from 'vue-json-viewer'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)
Vue.use(JsonViewer)
Vue.use(ElementUI)

Vue.prototype.$axios = request

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
