import { store } from '../store'

export default (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authUser = store.getters.user
    if (!authUser) {
      next ('/signin')
    } else if (to.meta.adminAuth) {
      const authUser = store.getters.user
      if (authUser.role.name === 'admin') {
        next ()
      } else {
        next ('/')
      }
    } else if (to.meta.technicianAuth) {
      const authUser = store.getters.user
      if (authUser.role.name === 'technician') {
        next ()
      } else {
        next ('/')
      }
    } else {
      next ()
    }
  } 
}
