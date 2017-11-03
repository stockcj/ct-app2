<template>
  <v-container>
    <v-layout row wrap align-center class="mt-5">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Update User</h1>
      </v-flex>
      <v-flex xs12 md4 offset-md4 class="mt-3">
        <v-card>
          <v-card-title>
            <h5>Edit user details</h5>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="onUpdateUser">
              <v-layout>
                <v-flex>
                  <v-text-field
                  label="Display Name"
                  v-model="selectedUser.profile.displayName"
                  required>
                  </v-text-field>
                  <v-text-field
                  label="Username"
                  v-model="selectedUser.profile.username"
                  required>
                  </v-text-field>
                  <v-text-field
                  label="Email"
                  v-model="selectedUser.profile.email"
                  required>
                  </v-text-field>
                  <v-select
                  v-bind:items="roles"
                  v-model="selectedUser.role"
                  label="Select Role"
                  single-line
                  item-text="name"
                  item-value="id"
                  return-object
                  ></v-select>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex>
                  <v-btn
                    class="primary mt-5"
                    type="submit"
                    >Update User</v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row v-if="error">
      <v-flex xs12 md4 offset-md4>
        <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <snack-alert></snack-alert>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props : ['id'],
  validations: {
    selectedUser: {
      required,
      profile: {
        displayName: {required},
        email: {required, email},
        username: {required}
      },
      role: {
        name: {required}
      }
    }
  },
  computed: {
    roles () {
      return this.$store.getters.loadedRoles
    },
    error () {
      return this.$store.getters.error
    },
    selectedUser () {
      return this.$store.getters.loadedUser(this.id)
    },
    userNameErrors () {
      const errors = []
      if (!this.$v.selectedUser.profile.displayName.$dirty) return errors
      !this.$v.selectedUser.profile.displayName.minLength && errors.push('Name must be at least 3 characters long')
      !this.$v.selectedUser.profile.displayName.required && errors.push('Display Name is required.')
      return errors
    }
  },
  methods: {
    fetchRoles: function () {
      this.$store.dispatch('loadRoles')
    },
    onUpdateUser: function () {
      const userData = this.selectedUser
      this.$store.dispatch('updateUser', userData)
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  },
  created (){
    this.fetchRoles()
  }
}
</script>