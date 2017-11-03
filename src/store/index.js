import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import exams from './Exams'
import users from './Users'
import shared from './Shared'
import contingency from './Contingency'

Vue.use(Vuex)

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    exams: exams,
    users: users,
    contingency: contingency,
    shared: shared
  }
})

