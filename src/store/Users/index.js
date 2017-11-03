import firebase from 'firebase'
import 'firebase/firestore'
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
      firebase.firestore().collection('users').get()
        .then((querySnapshot) => {
          const users = []
          querySnapshot.forEach((doc) => {
            users.push({
              id: doc.id,
              profile: doc.data().profile,
              role: doc.data().role
            })
          })
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
          const updateUserData = {}
          const batch = firebase.firestore().batch()
          const userRef = firebase.firestore().collection('users').doc(fbAuth.uid)
          batch.set(userRef, {
            profile: {
              displayName: payload.displayName,
              email: payload.email,
              username: payload.username,
            },
            role: {
              id: payload.role.id,
              name: payload.role.name
            }
          })
          const roleRef = firebase.firestore().collection('roles').doc(payload.role.id)
          batch.update(roleRef, {users: {[fbAuth.uid]: true}})
          batch.commit().then(() => {
            commit('setSnackbar', snackbar)
            firebase.app('secondary').delete()
            .then(() => {
              console.log("App deleted successfully")
            })
            .catch((error) => {
              console.log("Error deleting app:", error)
            })
          })
        })
    },
    updateUser ({commit}, payload) {
      commit('clearError')
      const snackbar = {active: true, text: 'User updated successfully'}
      const update = payload
      firebase.firestore().collection('users').doc(payload.id).update(update)
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
      firebase.firestore().collection('users').doc(payload.id).update(update)
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
            firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
              const currentUser = {
                id: user.uid,
                profile: {
                  displayName: doc.data().profile.displayName,
                  username: doc.data().profile.username,
                  email: doc.data().profile.email
                },
                role: {
                  id: doc.data().role.id,
                  name: doc.data().role.name
                  
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
      firebase.firestore().collection('users').doc(payload.uid).get()
        .then((doc) => {
          const obj = doc.data()
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
      firebase.firestore().collection('roles').get()
      .then((querySnapshot) => {
        const roles = []
        querySnapshot.forEach((doc) => {
          const obj = doc.data()
          roles.push({
            id: doc.id,
            name: obj.name,
          })
        })
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
