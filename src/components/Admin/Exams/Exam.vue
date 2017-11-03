<template>
  <v-container>
    <v-layout row wrap align-center class="mt-5">
      <v-flex xs12>
        <p class="text-xs-center display-2">Update exam</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md6 offset-md3>
        <form @submit.prevent="onSaveChanges" class="mt-5">
          <p class="text-xs-center display-1 primary--text">{{selectedExam.name}}</p>
          <v-layout>
            <v-flex xs12>
              <v-text-field
                name="name"
                v-model="selectedExam.name"
                :error-messages="examNameErrors"
                @input="$v.selectedExam.name.$touch()"
                @blur="$v.selectedExam.name.$touch()"
                label="Exam Name"
                required></v-text-field>
              <div class="mt-4" v-for="(component, index) in selectedExam.components" :key="component.id">
                <v-layout row justify-space-between>
                  <h5 style="margin: 8px 0px;">Component #{{index + 1}}</h5>
                  <v-btn v-if="selectedExam.components.length > 1" @click="removeComponent(component)" icon class="red--text">
                    <v-icon dark>clear</v-icon>
                  </v-btn>
                </v-layout>
                <v-select
                  v-bind:items="componentsArray"
                  v-model="component.name"
                  :error-messages="componentNameErrors(index)"
                  @change="$v.selectedExam.components.$each[index].name.$touch()"
                  @blur="$v.selectedExam.components.$each[index].name.$touch()"
                  item-text="name"
                  label="Component" 
                  single-line
                  bottom
                  required></v-select>
                  <v-flex xs10 offset-xs1>
                  <v-card v-for="(version, vindex) in component.versions" :key="version.id" class="mt-3">
                    <v-card-text>
                    <v-layout row justify-space-between>
                      <h6 style="margin: 14px 0px;">Version #{{vindex + 1}}</h6>
                      <v-btn v-if="component.versions.length > 1" @click="removeVersion(component, version)" icon class="red--text">
                        <v-icon dark>clear</v-icon>
                      </v-btn>
                    </v-layout>
                    <v-text-field
                      v-model="version.name"
                      :error-messages="versionNameErrors(index, vindex)"
                      @input="$v.selectedExam.components.$each[index].versions.$each[vindex].name.$touch()"
                      @blur="$v.selectedExam.components.$each[index].versions.$each[vindex].name.$touch()"
                      name="name"
                      label="Version Name"
                      id="versionName"
                      required></v-text-field>
                    <v-switch
                      v-bind:label="addLabel(version.active)" 
                      v-model="version.active"></v-switch>
                    </v-card-text>
                  </v-card>
                  <v-btn small @click="addVersion(component)" class="mt-3">Add Version</v-btn>
                  </v-flex>
              </div>
              <v-btn small dark class="mt-5 pink" @click="addComponent()">Add Component</v-btn>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <v-btn
                class="primary mt-5"
                :disabled="$v.selectedExam.$invalid"
                :loading="loading"
                type="submit"
                >Update Exam</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props : ['id'],
  data () {
    return {
      componentsArray: [
        { name: 'Reading', value:'Reading'},
        { name: 'Reading and Use of English', value:'Reading and Use of English'},
        { name: 'Reading and Writing', value: 'Reading and Writing'},
        { name: 'Writing', value: 'Writing'},
        { name: 'Listening', value: 'Listening'},
        { name: 'Speaking', value: 'Speaking'}
      ],
    }
  },
  validations: {
    selectedExam: {
      required,
      name: {required, minLength: minLength(3)},
      components: {
        required,
        minLength: minLength(1),
        $each: {
          name: {required},
          versions: {
            required,
            minLength: minLength(1),
            $each: {
              name: {required}
            }
          }
        }
      }
    }
  },
  computed: {
    selectedExam () {
      return this.$store.getters.loadedExam(this.id)
    },
    examNameErrors () {
      const errors = []
      if (!this.$v.selectedExam.name.$dirty) return errors
      !this.$v.selectedExam.name.minLength && errors.push('Name must be at least 3 characters long')
      !this.$v.selectedExam.name.required && errors.push('Exam Name is required.')
      return errors
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    addComponent: function () {
      this.selectedExam.components.push({name: '', versions:[{name: '', active: false}]});
    },
    removeComponent: function (component) {
      var index = this.selectedExam.components.indexOf(component)
      this.selectedExam.components.splice(index, 1)
    },
    addVersion: function (component) {
      component.versions.push({name: '', active: false});
    },
    removeVersion: function (component, version) {
      var index = component.versions.indexOf(version)
      component.versions.splice(index, 1)
    },
    addLabel: function (versionState) {
      var label = ''
      if (versionState) {
        label = 'Active'
      } else {
        label = 'Inactive'
      }
      return label
    },
    componentNameErrors: function (index) {
      const errors = []
      if (!this.$v.selectedExam.components.$each[index].name.$dirty) return errors
      !this.$v.selectedExam.components.$each[index].name.required && errors.push('Component name is required.')
      return errors
    },
    versionNameErrors: function (index, vindex) {
      const errors = []
      if (!this.$v.selectedExam.components.$each[index].versions.$each[vindex].name.$dirty) return errors
      !this.$v.selectedExam.components.$each[index].versions.$each[vindex].name.required && errors.push('Version name is required.')
      return errors
    },
    onSaveChanges: function () {
      const examData = this.selectedExam
      this.$store.dispatch('updateExam', examData)
      this.$router.push('/admin/exams')
    }
  }
}
</script>

<style>

</style>