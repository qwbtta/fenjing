import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {Message,DatePicker,TimePicker,Select,Option,ColorPicker,Button } from 'element-ui';

Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(ColorPicker)
Vue.use(Button)

Vue.prototype.$message = Message;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
