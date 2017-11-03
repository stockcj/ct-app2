<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Admin</h1>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 md6 offset-md3 class="mt-5">
        <v-card class="mt-3"><router-link to='/admin/exams' tag="span" style="cursor: pointer">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Exams</h3>
            </div>
          </v-card-title>
          </router-link>
        </v-card>
        <v-card class="mt-3"><router-link to='/admin/users' tag="span" style="cursor: pointer">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Users</h3>
            </div>
          </v-card-title>
          </router-link>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {

  }

</script>

<style>


</style>
