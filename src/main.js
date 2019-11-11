import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import comTemp from './commonTemp';
import { Picker, DatetimePicker, Popup, Toast , messageBox} from 'mint-ui'
import axios from './utils/interceptor';
// import './filter/filter.js';

Vue.config.productionTip = false
// dev-tools方便调试
// Vue.config.devtools = true

Vue.use(comTemp)
Vue.component(Picker.name, Picker)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Popup.name, Popup)
// Vue.component(MessageBox.name, MessageBox)
// Vue.component(Toast.name, Toast)

const getStore = (key) => {
  return sessionStorage.getItem(key)
}
const setStore = (key, val) => {
  return sessionStorage.setItem(key, val)
}

// 添加实例属性  在其他地方可以通过this.$getStore访问
Vue.prototype.$axios = axios
Vue.prototype.$getStore = getStore
Vue.prototype.$setStore = setStore
Vue.prototype.$notice = Toast
Vue.prototype.$messageBox = messageBox

router.beforeEach((to, from, next) => {
  if (!getStore('userType')) {
    if (to.path === '/login') {
      next()
    } else {
      // TODO Request Token
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  // store,
  data: {
    sellName: null,
    addEdit: null,  // 编辑还是添加
    activeData: {}, // 添加活动数据
    costData: {}, //成本数据
    targetInfo: [] // 指标数据
    // marketingActiveId: '' //市场活动的id
  },
  render: h => h(App)
}).$mount('#app')
