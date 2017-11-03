import * as firebase from 'firebase'
import { firebaseConfig } from '../../helpers/firebaseHelper'

export default {
  state: {
    loadedUsers: [],
    user: null,
    roles: []
  },
  mutations: {
    setLoadedUsers (state, payload) {
      state.loadedUsers = payload
    },
    createUser (state, payload) {
      state.loadedUsers.push(payload)
    },
    updateUser (state, payload) {
      const user = state.loadedUsers.find(user => {
        return user.id === payload.id
      })
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoadedRoles (state, payload) {
      state.roles = payload
    }
  },
  actions: {
    loadUsers ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('users').once('value')
        .then((data) => {
          const users = []
          const obj = data.val()
          for (let key in obj) {
            users.push({
              id: key,
              profile: obj[key].profile,
              role: obj[key].role
            })
          }
          commit('setLoading', false)
          commit('setLoadedUsers', users)
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    createUser ({commit}, payload) {
      commit('clearError')
      const snackbar = {active: true, text: 'User created successfully'}
      const newFbConn = firebase.initializeApp(firebaseConfig, 'secondary')
      newFbConn.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(fbAuth => {
          console.log(fbAuth.uid)
          const updateUserData = {}
          updateUserData[`roles/${payload.role.id}/users/${fbAuth.uid}`] = true
          updateUserData[`users/${fbAuth.uid}`] = {
           profile: {
             displayName: payload.displayName,
             email: payload.email,
             username: payload.username,
            },
           role: {
             id: payload.role.id,
             name: payload.role.name
           }
          };
          firebase.database().ref('/').update(updateUserData)
          commit('setSnackbar', snackbar)
          firebase.app('secondary').delete()
          .then(() => {
            console.log("App deleted successfully")
          })
          .catch((error) => {
            console.log("Error deleting app:", error)
          })
        })
        .catch((error) => {
          commit('setError', error)
          firebase.app('secondary').delete()
          .then(() => {
            console.log("App deleted successfully")
          })
          .catch((error) => {
            console.log("Error deleting app:", error)
          })
        })
    },
    updateUser ({commit}, payload) {
      commit('clearError')
      const snackbar = {active: true, text: 'User updated successfully'}
      const update = payload
      firebase.database().ref('users').child(payload.id).update(update)
        .then(() => {
          commit('updateUser', payload)
          commit('setSnackbar', snackbar)
        })
        .catch(error => {
          commit('setError', error)
        })
    },
    deleteUser () {
      //
    },
    updateProfile ({commit}, payload) {
      commit('clearError')
      const snackbar = {active: true, text: 'Profile updated successfully'}
      const update = payload
      firebase.database().ref('users').child(payload.id).update(update)
        .then(() => {
          commit('setSnackbar', snackbar)
        })
        .catch(error => {
          commit('setError', error)
        })
    },
    signUserIn ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            firebase.database().ref('/users/' + user.uid).once('value')
            .then((data) => {
              const obj = data.val()
              const currentUser = {
                id: user.uid,
                profile: {
                  displayName: obj.profile.displayName,
                  username: obj.profile.username,
                  email: obj.profile.email
                },
                role: {
                  id: obj.role.id,
                  name: obj.role.name
                  
                }
              }
              commit('setUser', currentUser)
            })
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      firebase.database().ref('/users/' + payload.uid).once('value')
        .then((data) => {
          const obj = data.val()
          const currentUser = {
            id: payload.uid,
            profile: {
              displayName: obj.profile.displayName,
              username: obj.profile.username,
              email: obj.profile.email
            },
            role: {
              id: obj.role.id,
              name: obj.role.name
            }
          }
          commit('setUser', currentUser)
        })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    loadRoles ({commit}) {
      firebase.database().ref('roles').once('value')
      .then((data) => {
        const roles = []
        const obj = data.val()
        for (let key in obj) {
          roles.push({
            id: key,
            name: obj[key].name,
          })
        }
        commit('setLoadedRoles', roles)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },   
  getters: {
    loadedUsers (state) {
      return state.loadedUsers.sort((userA, userB) => {
        return userA.name > userB.name
      })
    },
    loadedUser (state) {
      return (userKey) => {
        return state.loadedUsers.find((user) => {
          return user.id === userKey
        })
      }
    },
    user (state) {
      return state.user
    },
    loadedRoles (state) {
      return state.roles.sort((roleA, roleB) => {
        return roleA.name > roleB.name
      })
    }
  }
}
