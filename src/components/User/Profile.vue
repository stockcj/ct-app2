<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Your Profile</h1>
      </v-flex>
      <v-flex xs12 md4 offset-md4 class="mt-5">
        <v-card>
          <v-card-title>
            <h5>Edit your profile</h5>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="onUpdateProfile">
              <v-layout>
                <v-flex>
                  <v-text-field
                  label="Display Name"
                  v-model="currentUser.profile.displayName"
                  :error-messages="displayNameErrors"
                  @input="$v.currentUser.profile.displayName.$touch()"
                  @blur="$v.currentUser.profile.displayName.$touch()"
                  required>
                  </v-text-field>
                  <v-text-field
                  label="Username"
                  v-model="currentUser.profile.username"
                  :error-messages="userNameErrors"
                  @input="$v.currentUser.profile.username.$touch()"
                  @blur="$v.currentUser.profile.username.$touch()"
                  required>
                  </v-text-field>
                  <v-text-field
                  label="Email"
                  v-model="currentUser.profile.email"
                  :error-messages="emailErrors"
                  @input="$v.currentUser.profile.email.$touch()"
                  @blur="$v.currentUser.profile.email.$touch()"
                  required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex>
                  <v-btn
                    class="primary mt-2"
                    :disabled="$v.currentUser.$invalid"
                    type="submit"
                    >Update Profile
                    </v-btn>
                    <v-btn
                    class="mt-2"
                    @click="reset"
                    >Reset
                    </v-btn>
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
  validations: {
    currentUser: {
      required,
      profile: {
        displayName: {required},
        email: {required, email},
        username: {required, minLength: minLength(3)}
      }
    }
  },
  data () {
    return {
      currentUser: {}
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    userNameErrors () {
      const errors = []
      if (!this.$v.currentUser.profile.username.$dirty) return errors
      !this.$v.currentUser.profile.username.minLength && errors.push('Name must be at least 3 characters long')
      !this.$v.currentUser.profile.username.required && errors.push('Username is required.')
      return errors
    },
    displayNameErrors () {
      const errors = []
      if (!this.$v.currentUser.profile.displayName.$dirty) return errors
      !this.$v.currentUser.profile.displayName.required && errors.push('Display Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.currentUser.profile.email.$dirty) return errors
      !this.$v.currentUser.profile.email.required && errors.push('Email is required.')
      !this.$v.currentUser.profile.email.email && errors.push('Must be a valid email address')
      return errors
    }
  },
  methods: {
    onUpdateProfile: function () {
      const userData = this.currentUser
      this.$store.dispatch('updateProfile', userData)
    },
    reset () {
      this.currentUser = Object.assign({}, JSON.parse(JSON.stringify(this.$store.getters.user)))
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  },
  created (){
    this.currentUser = Object.assign({}, JSON.parse(JSON.stringify(this.$store.getters.user)))
  }
}
</script>

<style>

</style>