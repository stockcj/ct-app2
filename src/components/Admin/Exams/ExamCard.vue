<template>
  <div>
    <v-card id="examsCard">
      <v-container>
        <v-layout class="mb-3">
          <v-flex xs12>
            <p class="display-1">{{exam.name}}</p>
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
        <v-layout row align-baseline v-for="component in exam.components" :key="component.id">
          <v-flex xs3>
            <p class="subheading">{{ component.name }}</p>
          </v-flex>
          <v-flex xs1 v-for="version in component.versions" :key="version.id" v-if="version.active">
            <v-chip small class="pink white--text">{{version.name}}</v-chip>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions v-if="!validateDelete">
        <v-btn flat :to="'/admin/exams/' + exam.id" class="blue--text">Edit</v-btn>
        <v-btn flat class="red--text" @click="deleteValidation(true)">Delete</v-btn>
      </v-card-actions>
      <v-card-actions v-if="validateDelete">
        <v-btn flat class="green--text" @click="onDeleteExam(exam)">Yes</v-btn>
        <v-btn flat class="red--text" @click="deleteValidation(false)">No</v-btn>
      </v-card-actions>
    </v-card>
  </div>
  
</template>

<script>
  export default {
    props: ['exam'],
    data () {
      return {
        validateDelete: false
      }
    },
    methods: {
      deleteValidation: function (value) {
        this.validateDelete = value
      },
      onDeleteExam: function (exam) {
        this.$store.dispatch('deleteExam', exam.id)
      }
    }
  }

</script>

<style>


</style>
