<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Exams</h1>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5">
      <v-flex xs12 lg10 offset-lg1>
        <v-layout row wrap align-center>
          <v-flex xs1>
            <v-btn :to="'/admin/exam/new'" class="primary"><v-icon dark left>add</v-icon>Add Exam</v-btn>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate class="primary--text" :width="7" :size="70" v-if="loading"></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-if="!loading">
          <v-flex xs12 lg6 v-for="exam in exams" :key="exam.id" class="mt-3">
            <exam-card :exam="exam"></exam-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <snack-alert></snack-alert>
  </v-container>
</template>

<script>
export default {
  computed: {
    exams () {
      return this.$store.getters.loadedExams
    },
    loading () {
      return this.$store.getters.loading
    }
  },
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
  #examsCard {
    min-height: 335px;
  }
  #examsCard .card__actions {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
