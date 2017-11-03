<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap align-center class="mt-2">
            <v-flex xs12>
                <p class="text-xs-center display-2">Issue Contingency</p>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 md4 offset-md4>
                <v-card>
                <v-card-title primary-title>
                    <h4>Search</h4>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="onSearch" id="searchForm">
                    <v-layout column>
                        <v-flex xs8 offset-xs2>
                        <v-text-field
                            name="centre number"
                            v-model="search.centre"
                            label="Centre Number"
                            :error-messages="centreErrors"
                            @input="$v.search.centre.$touch()"
                            @blur="$v.search.centre.$touch()"
                        ></v-text-field>
                        <v-select
                            v-bind:items="exams"
                            v-model="search.exam"
                            :error-messages="examErrors"
                            @change="$v.search.exam.$touch()"
                            @blur="$v.search.exam.$touch()"
                            item-text="name"
                            item-value="id"
                            label="Exam"
                            bottom
                        ></v-select>
                        <div v-for="exam in exams" :key="exam.id">
                            <div v-if="search.exam === exam.id">
                            <div v-for="component in exam.components" :key="component.name">
                                <v-checkbox primary class="pa-0" :label="component.name" :value="component.name" v-model="search.components"></v-checkbox>
                            </div>
                            </div>
                        </div>
                        </v-flex>
                        <v-flex xs1 offset-xs9>
                        <v-btn
                            large
                            class="primary mt-5"
                            :disabled="$v.search.$invalid"
                            type="submit"
                        >Search</v-btn>
                        </v-flex>
                    </v-layout>
                    </form>
                </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md4 offset-md4>
                <v-card>
                <v-card-title primary-title>
                    <h4>Issuance</h4>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="issueContingency" id="issuanceForm">
                    <v-layout column>
                        <v-flex xs8 offset-xs2>
                        <v-text-field
                            label="Centre"
                            v-model="issuance.centre"
                            disabled
                            >
                        </v-text-field>
                        <v-text-field
                            label="Exam"
                            v-model="issuance.exam.name"
                            disabled
                            >
                        </v-text-field>
                        <v-menu
                            lazy
                            :close-on-content-click="false"
                            v-model="menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-left="40"
                            max-width="290px"
                        >
                            <v-text-field
                            slot="activator"
                            label="Test Date"
                            v-model="defaultTestDate"
                            readonly
                            ></v-text-field>
                            <v-date-picker 
                            v-model="defaultTestDate" 
                            no-title 
                            scrollable 
                            actions 
                            autosave
                            @input="updateTestDate">
                            </v-date-picker>
                        </v-menu>
                        <v-select
                            v-bind:items="sittings"
                            v-model="issuance.sitting"
                            :error-messages="sittingErrors"
                            @change="$v.issuance.sitting.$touch()"
                            @blur="$v.issuance.sitting.$touch()"
                            label="Sitting"
                            required
                        ></v-select>
                        <v-text-field row v-for="(value, key) in sVersions" :key="key"
                            :label="key"
                            v-model="issuance.exam.components[key]"
                            >
                        </v-text-field>
                        <v-text-field
                            label="Zendesk Reference"
                            v-model="issuance.zendeskRef"
                            :error-messages="zdRefErrors"
                            @input="$v.issuance.zendeskRef.$touch()"
                            @blur="$v.issuance.zendeskRef.$touch()"
                            required
                            >
                        </v-text-field>
                        </v-flex>
                        <v-flex xs1 offset-xs9>
                        <v-btn
                            :disabled="$v.issuance.$invalid"
                            large
                            class="primary mt-5"
                            type="submit"
                        >Submit</v-btn>
                        </v-flex>
                    </v-layout>
                    </form>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      search: {centre: '', exam: '', components:[]},
      sVersions: null,
      sittings: ["AM", "PM"],
      defaultTestDate: new Date().toISOString().substr(0, 10),
      issuance: {
        centre: '', 
        exam: {name: '', id:'', components:[]},
        sitting: '',
        issueDate: null, 
        testDate: new Date().toDateString(),
        issuedBy: '',
        zendeskRef: ''
      },
      menu: false,
    }
  },
  computed: {
    exams () {
      return this.$store.getters.loadedExams
    },
    selectedExam () {
      return this.$store.getters.loadedExam(this.search.exam)
    },
    centreErrors () {
      const errors = []
      if (!this.$v.search.centre.$dirty) return errors
      !this.$v.search.centre.minLength && errors.push('Centre number must be 5 characters long')
      !this.$v.search.centre.maxLength && errors.push('Centre number must be 5 characters long')
      !this.$v.search.centre.required && errors.push('Centre number is required.')
      return errors
    },
    examErrors () {
      const errors = []
      if (!this.$v.search.exam.$dirty) return errors
      !this.$v.search.exam.required && errors.push('Exam is required.')
      return errors
    },
    sittingErrors () {
      const errors = []
      if (!this.$v.issuance.sitting.$dirty) return errors
      !this.$v.issuance.sitting.required && errors.push('Sitting is required.')
      return errors
    },
    zdRefErrors () {
      const errors = []
      if (!this.$v.issuance.zendeskRef.$dirty) return errors
      !this.$v.issuance.zendeskRef.required && errors.push('Zendesk reference is required.')
      !this.$v.issuance.zendeskRef.minLength && errors.push('Zendesk reference must be 6 characters long')
      !this.$v.issuance.zendeskRef.maxLength && errors.push('Zendesk number must be 6 characters long')
      return errors
    }
  },
  validations: {
    search: {
      required,
      centre: {required, minLength: minLength(5), maxLength: maxLength(5)},
      exam: {required},
      components: {
        required,
        minLength: minLength(1),
      }
    },
    issuance: {
      required,
      sitting: {required},
      zendeskRef: {required, minLength: minLength(6), maxLength: maxLength(6)}
    }
  },
  methods: {
    onSearch: function () {
      const searchData = this.search
      this.$store.dispatch('loadContHistory', searchData)
      this.issuance.centre = this.search.centre
      this.issuance.exam.name = this.selectedExam.name
      this.issuance.exam.id = this.search.exam
      this.sVersions = this.suggestedVersions()
      this.issuance.exam.components = this.sVersions
    },
    findActiveVersions: function (component) {
      let activeVersions = [];
      const components = this.selectedExam.components
      components.forEach(function (value, i) {
      if (value.name === component) {
        const versions = value.versions;
        versions.forEach(function (value, i) {
          if (value.active === true) {
            activeVersions.push(value.name)
          }
        })
        }
      })
      return activeVersions
    },
    mostRecentContingency: function (component) {
      const issueHistory = []
      const contHistory = this.$store.getters.loadedContHistory
      contHistory.map((e) => {
        if (e.exam.components.hasOwnProperty(component)) {
          issueHistory.push(e)
        }
      })
      issueHistory.sort((a, b) => {
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      })
      if (issueHistory.length > 0) {
        return issueHistory[0].exam.components[component]
      } else {
        return issueHistory
      }
    },
    suggestedVersions: function () {
      const search = this.search
      const suggestedVersions = {}
      for (let component of this.search.components) {
        const activeVersions = this.findActiveVersions(component)
        const lastVersion = this.mostRecentContingency(component)
        if (this.mostRecentContingency.length > 0) {
          for (let version of activeVersions) {
            if (lastVersion[0] != version) {
              suggestedVersions[component] = version
              break
            }
          }
        } else {
          suggestedVersions[component] = activeVersions[0]
        }
      }
      return suggestedVersions
    },
    updateTestDate: function () {
      this.issuance.testDate = new Date(this.defaultTestDate).toDateString()
    },
    issueContingency: function () {
      this.issuance.issueDate = new Date().toISOString()
      this.issuance.issuedBy = this.$store.getters.user.profile.displayName
      const issueData = this.issuance
      this.$store.dispatch('issueContingency', issueData)
      this.$router.push('/contingency')
    }
    }
  }
</script>

<style>

</style>
