<template>
  <v-container grid-list-xl>
    <v-layout row wrap align-center class="mt-2">
      <v-flex xs12>
        <p class="text-xs-center display-2">Create a new exam</p>
      </v-flex>
    </v-layout>
    <v-layout row class="mt-5">
      <v-flex xs12 md4 offset-md4>
        <v-card>
          <v-container>
            <v-layout>
              <v-flex xs12>
                <form @submit.prevent="onCreateExam" class="mt-5">
                  <v-layout>
                    <v-flex xs12>
                      <v-text-field
                        name="name"
                        v-model="newExam.name"
                        :error-messages="examNameErrors"
                        @input="$v.newExam.name.$touch()"
                        @blur="$v.newExam.name.$touch()"
                        label="Exam Name"
                        required></v-text-field>
                      <div class="mt-3" v-for="(component, index) in newExam.components" :key="component.name">
                        <v-layout row justify-space-between>
                          <h5 style="margin: 8px 0px;">Component #{{index + 1}}</h5>
                          <v-btn v-if="newExam.components.length > 1" @click="removeComponent(component)" flat icon color="red">
                            <v-icon>clear</v-icon>
                          </v-btn>
                        </v-layout>
                        <v-select
                          v-bind:items="componentsArray"
                          v-model="component.name"
                          :error-messages="componentNameErrors(index)"
                          @change="$v.newExam.components.$each[index].name.$touch()"
                          @blur="$v.newExam.components.$each[index].name.$touch()"
                          item-text="name"
                          label="Component" 
                          bottom
                          required></v-select>
                          <v-flex xs10 offset-xs1>
                          <v-card flat v-for="(version, vindex) in component.versions" :key="version.name" class="mt-3">
                            <v-card-text>
                              <v-layout row justify-space-between>
                              <h6 style="margin: 14px 0px;">Version #{{vindex + 1}}</h6>
                              <v-btn v-if="component.versions.length > 1" @click="removeVersion(component, version)" flat icon color="red">
                                <v-icon>clear</v-icon>
                              </v-btn>
                            </v-layout>
                            <v-text-field
                              v-model="version.name"
                              :error-messages="versionNameErrors(index, vindex)"
                              @input="$v.newExam.components.$each[index].versions.$each[vindex].name.$touch()"
                              @blur="$v.newExam.components.$each[index].versions.$each[vindex].name.$touch()"
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
                        :disabled="$v.newExam.$invalid"
                        type="submit"
                        >Create Exam</v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  data () {
    return {
      newExam: {name: '', components: [{name: '', versions: [{name: '', active: false}]}]},
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
    newExam: {
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
    examNameErrors () {
      const errors = []
      if (!this.$v.newExam.name.$dirty) return errors
      !this.$v.newExam.name.minLength && errors.push('Name must be at least 3 characters long')
      !this.$v.newExam.name.required && errors.push('Exam Name is required.')
      return errors
    }
  },
  methods: {
    addComponent: function () {
      this.newExam.components.push({name: '', versions:[{name: '', active: false}]});
    },
    removeComponent: function (component) {
      var index = this.newExam.components.indexOf(component)
      this.newExam.components.splice(index, 1)
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
      if (!this.$v.newExam.components.$each[index].name.$dirty) return errors
      !this.$v.newExam.components.$each[index].name.required && errors.push('Component name is required.')
      return errors
    },
    versionNameErrors: function (index, vindex) {
      const errors = []
      if (!this.$v.newExam.components.$each[index].versions.$each[vindex].name.$dirty) return errors
      !this.$v.newExam.components.$each[index].versions.$each[vindex].name.required && errors.push('Version name is required.')
      return errors
    },
    onCreateExam: function () {
      const examData = this.newExam
      this.$store.dispatch('createExam', examData)
      this.$router.push('/admin/exams')
    }
  }
}
</script>

<style>

</style>