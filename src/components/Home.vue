<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Contingency Tracker</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  methods: {
    fetchExams: function () {
      this.$store.dispatch('loadExams')
    }
  },
  beforeMount(){
    this.fetchExams()
 }

}
</script>

<style>

</style>
