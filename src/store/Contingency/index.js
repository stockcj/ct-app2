import firebase from 'firebase'
import 'firebase/firestore'
import { firebaseConfig } from '../../helpers/firebaseHelper'

export default {
    state: {
      contHistory: [],
      recentContHistory: [],
      filteredContHistory: [],
      issuance: null,
    },
    mutations: {
      setContHistory (state, payload) {
        state.contHistory = payload
      },
      setRecentHistory (state, payload) {
        state.recentContHistory = payload
      },
      setFilteredContHistory (state, payload) {
        state.filteredContHistory = payload
      },
      setIssuance (state, payload) {
        state.issuance = payload
      }
    },
    actions: {
      issueContingency({commit}, payload) {
        const issuance = payload
        const snackbar = {active: true, text: 'Contingency issued'}
        firebase.firestore().collection('issuances').add(issuance)
          .then(() => {
            commit('setSnackbar', snackbar)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      loadRecentContHistory ({commit}) {
        commit('setLoading', true)
        const recentHistory = []
        firebase.firestore().collection('issuances').orderBy("issueDate", "desc").limit(10).onSnapshot(function(snapshot) {
          snapshot.forEach(function(doc) {
            recentHistory.push({
              id: doc.id,
              centre: doc.data().centre,
              sitting: doc.data().sitting,
              exam: doc.data().exam,
              components: doc.data().exam.components,
              testDate: doc.data().testDate,
              issueDate: new Date(doc.data().issueDate).toString().substr(0, 25),
              issuedBy: doc.data().issuedBy,
              zendeskRef: doc.data().zendeskRef
            })
          })
          commit('setRecentHistory', recentHistory)
          commit('setLoading', false)
        }, function(error) {
          console.log(error)
        })
      },
      loadContHistory ({commit}, payload) {
        const centre = payload.centre
        const exam = payload.exam
        commit('setLoading', true)
        firebase.firestore().collection('issuances').where("centre", "==", centre).get()
          .then(function(doc) {
            const contHistory = []
              if (doc.data().exam.id === exam) {
                contHistory.push({
                  id: doc.id,
                  centre: doc.data().centre,
                  exam: doc.data().exam,
                  issueDate: doc.data().issueDate,
                  testDate: doc.data().testDate
                })
              } 
            commit('setLoading', false)
            commit('setContHistory', contHistory)
          })
          .catch((error) => {
            console.log(error)
            commit('setLoading', false)
          })
      }
    },
    getters: {
      loadedContHistory (state) {
        return state.contHistory
      },
      recentContHistory (state) {
        return state.recentContHistory
      },
      filteredContHistory (state) {
        return state.filteredContHistory
      }
    }
  }