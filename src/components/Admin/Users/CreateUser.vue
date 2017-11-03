<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <p class="text-xs-center display-2">Create a new user</p>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5">
      <v-flex xs12 md4 offset-md4>
        <v-card>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <form @submit.prevent="onCreateUser" class="mt-5">
                  <v-layout>
                    <v-flex xs12>
                      <v-text-field
                        name="displayName"
                        v-model="newUser.displayName"
                        :error-messages="displayNameErrors"
                        @input="$v.newUser.displayName.$touch()"
                        @blur="$v.newUser.displayName.$touch()"
                        label="Display Name"
                        required>
                      </v-text-field>
                      <v-text-field
                        name="username"
                        v-model="newUser.username"
                        :error-messages="usernameErrors"
                        @input="$v.newUser.username.$touch()"
                        @blur="$v.newUser.username.$touch()"
                        label="Username"
                        required>
                      </v-text-field>
                      <v-text-field
                        name="email"
                        v-model="newUser.email"
                        :error-messages="emailErrors"
                        @input="$v.newUser.email.$touch()"
                        @blur="$v.newUser.email.$touch()"
                        label="Email"
                        required>
                      </v-text-field>
                      <v-select
                        name="role"
                        v-bind:items="roles"
                        item-text="name"
                        v-model="newUser.role"
                        label="Select Role"
                        return-object
                        single-line
                        bottom
                      ></v-select>
                      <v-text-field
                        name="password"
                        v-model="newUser.password"
                        :error-messages="passwordErrors"
                        @input="$v.newUser.password.$touch()"
                        @blur="$v.newUser.password.$touch()"
                        label="Password"
                        type="password"
                        required>
                      </v-text-field>
                      <v-text-field
                        name="confirmPassword"
                        v-model="newUser.confirmPassword"
                        :error-messages="confirmPasswordErrors"
                        @input="$v.newUser.confirmPassword.$touch()"
                        @blur="$v.newUser.confirmPassword.$touch()"
                        label="Confirm Password"
                        type="password"
                        required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex>
                      <v-btn
                        class="primary mt-5"
                        :disabled="$v.newUser.$invalid"
                        type="submit"
                        >Create User</v-btn>
                  </v-flex>
                </v-layout>
              </form>
              </v-flex>
            </v-layout>
          </v-container>
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
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      newUser: {
        displayName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      }
    }
  },
  validations: {
    newUser: {
      required,
      displayName: {required, minLength: minLength(3)},
      username: {required, minLength: minLength(3)},
      email: {required},
      password: {required},
      confirmPassword: {required, sameAsPassword: sameAs('password')},
      role: {required},
    }
  },
  computed: {
    roles () {
      return this.$store.getters.loadedRoles
    },
    error () {
      return this.$store.getters.error
    },
    displayNameErrors () {
      const errors = []
      if (!this.$v.newUser.displayName.$dirty) return errors
      !this.$v.newUser.displayName.minLength && errors.push('Name must be at least 3 characters long')
      !this.$v.newUser.displayName.required && errors.push('Display Name is required.')
      return errors
    },
    usernameErrors () {
      const errors = []
      if (!this.$v.newUser.username.$dirty) return errors
      !this.$v.newUser.username.minLength && errors.push('Username must be at least 3 characters long')
      !this.$v.newUser.username.required && errors.push('Username is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.newUser.email.$dirty) return errors
      !this.$v.newUser.email.required && errors.push('Email is required.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.newUser.password.$dirty) return errors
      !this.$v.newUser.password.required && errors.push('Password is required.')
      return errors
    },
    confirmPasswordErrors () {
      const errors = []
      if (!this.$v.newUser.password.$dirty) return errors
      !this.$v.newUser.confirmPassword.required && errors.push('Password is required.')
      !this.$v.newUser.confirmPassword.sameAsPassword && errors.push('Passwords do not match.')
      return errors
    }
  },
  methods: {
    onCreateUser: function () {
      const userData = this.newUser
      this.$store.dispatch('createUser', userData)
    },
    fetchRoles: function () {
      this.$store.dispatch('loadRoles')
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  },
  beforeMount(){
    this.fetchRoles()
 }
}
</script>

<style>

</style>