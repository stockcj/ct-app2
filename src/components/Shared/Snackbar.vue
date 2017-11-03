<template>
  <v-snackbar
      :timeout="6000"
      bottom
      color="success"
      v-model="snackbar.active"
    >
      {{ snackbar.text }}
      <v-btn flat dark @click.native="closeSnack">Close</v-btn>
    </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbar: {
      get: function () {
        return this.$store.getters.snackbar
      },
      set: function () {
        this.$store.dispatch('closeSnack')
      }
    }
  },
  methods: {
    closeSnack: function () {
      this.$store.dispatch('closeSnack')
    }
  }

}
</script>

<style>

</style>

