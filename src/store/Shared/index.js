export default {
  state: {
    error: null,
    loading: false,
    snackbar: {active: false, text: ''},
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setSnackbar (state, payload) {
      state.snackbar = payload
    }
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    closeSnack ({commit}) {
      const snackbar = {active: false, text: ''}
      commit('setSnackbar', snackbar)
    }
  },   
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    snackbar (state) {
      return state.snackbar
    }
  }
}
