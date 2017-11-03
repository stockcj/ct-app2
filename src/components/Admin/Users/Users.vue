<template>
  <v-container grid-list-xl>
    <v-layout class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Users</h1>
      </v-flex>
    </v-layout>
    <v-layout align-left class="mt-5">
      <v-flex xs12 lg10 offset-lg1>
        <v-layout row wrap align-center>
          <v-flex xs1>
            <v-btn :to="'/admin/user/new'" class="primary">
              <v-icon dark left>add</v-icon>Add User</v-btn>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate class="primary--text" :width="7" :size="70" v-if="loading"></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-if="!loading">
          <v-flex xs12 lg6 v-for="user in users" :key="user.id" class="mt-3">
            <v-card id="usersCard">
              <v-container>
                <v-layout class="mb-3">
                  <v-flex xs12>
                    <p class="display-1">{{user.profile.displayName}}</p>
                    <v-divider></v-divider>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                    <p class="subheading">Email: {{user.profile.email}}</p>
                    <p class="subheading">Username: {{user.profile.username}}</p>
                    <p class="subheading">Role: {{user.role.name}}</p>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-actions>
                <v-btn flat :to="'/admin/users/' + user.id" class="blue--text">Edit</v-btn>
                <v-btn flat class="grey--text" disabled>Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed: {
      users() {
        return this.$store.getters.loadedUsers
      },
      loading() {
        return this.$store.getters.loading
      }
    },
    methods: {
      fetchUsers () {
        this.$store.dispatch('loadUsers')
      }
    },
    beforeMount(){
      this.fetchUsers()
    }
  }

</script>

<style>
  #usersCard {
    min-height: 280px;
  }

  #usersCard .card__actions {
    position: absolute;
    bottom: 0;
    right: 0;
  }

</style>

<style>


</style>
