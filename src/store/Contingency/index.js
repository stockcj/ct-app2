import * as firebase from 'firebase'
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
        firebase.database().ref('issuances').push(issuance)
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
        firebase.database().ref('issuances').orderByChild("issueDate").limitToLast(10).on("child_added", function(snapshot) {
          const obj = snapshot.val()
          recentHistory.push({
            id: snapshot.key,
            centre: obj.centre,
            sitting: obj.sitting,
            exam: obj.exam,
            components: obj.exam.components,
            testDate: obj.testDate,
            issueDate: new Date(obj.issueDate).toString().substr(0, 25),
            issuedBy: obj.issuedBy,
            zendeskRef: obj.zendeskRef
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
        firebase.database().ref('issuances').orderByChild("centre").equalTo(centre).once('value')
          .then((data) => {
            const contHistory = []
            const obj = data.val()
            for (let key in obj) {
              if (obj[key].exam.id === exam) {
                contHistory.push({
                  id: key,
                  centre: obj[key].centre,
                  exam: obj[key].exam,
                  issueDate: obj[key].issueDate,
                  testDate: obj[key].testDate
                })
              } 
            }
            commit('setLoading', false)
            commit('setContHistory', contHistory)
          })
          .catch((error) => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      loadFilteredContHistory ({commit}, payload) {
        const filterType = payload.filterType
        const filterValue = payload.filterValue
        commit('setLoading', true)
        firebase.database().ref('issuances').orderByChild(filterType).once('value')
        .then((data) => {
          const contHistory = []
          const obj = data.val()
          for (let key in obj) {
            if (filterType === 'exam') {
              if (obj[key].exam.name === filterValue) {
                contHistory.push({
                  id: key,
                  centre: obj[key].centre,
                  exam: obj[key].exam,
                  issueDate: obj[key].issueDate,
                  testDate: obj[key].testDate
                })
              }
            } else if (filterType === 'centre') {
              if (obj[key].centre === filterValue) {
                contHistory.push({
                  id: key,
                  centre: obj[key].centre,
                  exam: obj[key].exam,
                  issueDate: obj[key].issueDate,
                  testDate: obj[key].testDate
                })
              }
            }
          }
          commit('setLoading', false)
          commit('setFilteredContHistory', contHistory)
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