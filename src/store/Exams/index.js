import firebase from 'firebase'
import 'firebase/firestore'
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
      firebase.firestore().collection('exams').get().then(function(querySnapshot) {
        const exams = []
        querySnapshot.forEach(function(doc){
          exams.push({
            id: doc.id,
            name: doc.data().name,
            components: doc.data().components,
          })
        })
        commit('setLoading', false)
        commit('setLoadedExams', exams)
      })
    },
    createExam ({commit}, payload) {
      const exam = payload
      const snackbar = {active: true, text: 'Exam created successfully'}
      firebase.firestore().collection('exams').add(exam)
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
      firebase.firestore().collection('exams').doc(payload.id).update(exam)
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
      firebase.firestore().collection('exams').doc(payload).delete()
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
