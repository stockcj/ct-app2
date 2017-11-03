<template>
  <v-app light>
    <v-navigation-drawer v-model="sideNav" temporary>
      <v-list>
        <v-list-tile router :to="'/admin'">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Admin</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="teal">
      <div class="hidden-sm-and-up">
        <v-toolbar-side-icon @click.stop="sideNav = !sideNav" ></v-toolbar-side-icon>
      </div>
      <v-toolbar-title><router-link to="/" tag="span" style="cursor: pointer">Contingency Tracker</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-menu v-if="userIsAdmin" open-on-hover bottom offset-y>
          <v-btn flat slot="activator" router :to="'/admin'"><v-icon dark left>settings</v-icon><div class="hidden-sm-and-down">Admin</div></v-btn>
          <v-list>
            <v-list-tile router :to="'/admin/exams'">
              <v-list-tile-title>Exams</v-list-tile-title>
            </v-list-tile>
            <v-list-tile router :to="'/admin/users'">
              <v-list-tile-title>Users</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon dark left>{{item.icon}}</v-icon>
          <div class="hidden-sm-and-down">{{item.title}}</div>
        </v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogout">
          <v-icon dark left>exit_to_app</v-icon>
          <div class="hidden-sm-and-down">Logout</div>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <vs-crumbs v-if="$route.name !== 'Signin'"></vs-crumbs>
    <main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </main>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>© {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false,
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      menuItems () {
        let menuItems = [
          { icon: 'lock_open', title: 'Sign in', link:'/signin'}
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'account_circle', title: 'Profile', link:'/profile'},
            { icon: 'create', title: 'Contingency', link:'/contingency'}
          ]
        } 
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        return this.userIsAuthenticated && this.$store.getters.user.role.name === 'admin'
      }
    },
    watch: {
       user (value) {
         if (value == null && value == undefined) {
           this.$router.push('/signin')
         }
       }
     },
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
