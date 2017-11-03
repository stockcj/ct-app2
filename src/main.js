import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import App from './App'
import * as firebase from 'firebase'
import { firebaseConfig } from './helpers/firebaseHelper'
import router from './router'
import { store } from './store'
import AlertCmp from './components/Shared/Alert'
import ExamCard from './components/Admin/Exams/ExamCard'
import Breadcrumbs from './components/Shared/Breadcrumbs'
import Snackbar from './components/Shared/Snackbar'

Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)
Vue.component('exam-card', ExamCard)
Vue.component('vs-crumbs', Breadcrumbs)
Vue.component('snack-alert', Snackbar)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
  }
})
