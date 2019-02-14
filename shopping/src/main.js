// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from "vuex"
import {currency} from "./util/currency";

Vue.config.productionTip = false;
//图片懒加载
Vue.use(VueLazyLoad, {
  loading: './../static/loading-svg/loading-bars.svg',
  error: "./../static/loading-svg/loading-bars.svg",

});
//滚动鼠标触发事件
Vue.use(infiniteScroll);

//金额过滤器
Vue.filter("currency", currency);

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    nickName: "",
    cartCount: 0
  },
  mutations: {
    setnickname(state, nickName) {
      state.nickName = nickName
    },
    setcartcount(state, cartCount) {
      state.cartCount += cartCount
    },
    initcartcount(state, cartCount) {
      state.cartCount = cartCount
    }
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
