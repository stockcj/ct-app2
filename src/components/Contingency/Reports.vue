<template>
  <v-container grid-list-xl>
    <v-layout row wrap class="mt-2">
      <v-flex xs12>
        <h1 class="text-xs-center display-2">Reports</h1>
      </v-flex>
    </v-layout>
    <v-layout class="mt-5">
      <v-flex xs12 xl10 offset-xl1>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-card-title>
                <h5>Select Filters</h5>
              </v-card-title>
              <v-card-text>
                <form @submit.prevent="onSearch">
                  <v-layout column>
                    <v-flex xs4>
                      <v-select
                        name="filter"
                        v-bind:items="filterTypes"
                        v-model="filter.filterType"
                        label="Select Filter"
                        single-line
                        bottom
                      ></v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        v-if="filter.filterType == 'centre'"
                        name="centre"
                        v-model="filter.filterValue"
                        label="Centre number"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs4>
                      <v-select
                        v-if="filter.filterType == 'exam'"
                        name="exam"
                        v-bind:items="exams"
                        item-text="name"
                        item-value="name"
                        v-model="filter.filterValue"
                        label="Select Exam"
                        single-line
                        bottom
                      ></v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-btn
                       v-if="filter.filterType"
                       class="primary"
                       type="submit"
                      >Search</v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate class="primary--text" :width="7" :size="70" v-if="loading"></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      filter: {filterType: '', filterValue: ''},
      filterTypes: [
        { text: 'Centre', value: 'centre'},
        { text: 'Exam', value: 'exam'}
      ]
    }
  },
  computed: {
    exams () {
      return this.$store.getters.loadedExams
    },
    loading () {
      return this.$store.getters.loading
    },
    filtered () {
      return this.$store.getters.filteredContHistory
    }
  },
  methods: {
    onSearch: function () {
      const filterData = this.filter
      console.log(filterData)
      this.$store.dispatch('loadFilteredContHistory', filterData)
    }
  }

}
</script>

<style>

</style>
