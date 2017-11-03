import * as firebase from 'firebase'
import { firebaseConfig } from '../../helpers/firebaseHelper'

export default {
  state: {
    loadedExams: [],
  },
  mutations: {
    setLoadedExams (state, payload) {
      state.loadedExams = payload
    },
    updateExam (state, payload) {
      const exam = state.loadedExams.find(exam => {
        return exam.id === payload.id
      })
    }
  },
  actions: {
    loadExams ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('exams').on('value', function(data) {
        const exams = []
        const obj = data.val()
        for (let key in obj) {
          exams.push({
            id: key,
            name: obj[key].name,
            components: obj[key].components,
          })
        }
        commit('setLoading', false)
        commit('setLoadedExams', exams)
      })
    },
    createExam ({commit}, payload) {
      const exam = payload
      const snackbar = {active: true, text: 'Exam created successfully'}
      firebase.database().ref('exams').push(exam)
        .then(() => {
          commit('setSnackbar', snackbar)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    updateExam ({commit}, payload) {
      commit('setLoading', true)
      const exam = payload
      const snackbar = {active: true, text: 'Exam updated successfully'}
      firebase.database().ref('exams').child(payload.id).update(exam)
        .then(() => {
          commit('setLoading', false)
          commit('updateExam', payload)
          commit('setSnackbar', snackbar)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteExam ({commit}, payload) {
      commit('setLoading', true)
      const snackbar = {active: true, text: 'Exam deleted successfully'}
      firebase.database().ref('exams').child(payload).remove()
        .then(() => {
          commit('setLoading', false)
          commit('setSnackbar', snackbar)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },   
  getters: {
    loadedExams (state) {
      return state.loadedExams.sort((examA, examB) => {
        return examA.name > examB.name
      })
    },
    loadedExam (state) {
      return (examKey) => {
        return state.loadedExams.find((exam) => {
          return exam.id === examKey
        })
      }
    }
  }
}
