<template>
  <v-breadcrumbs divider="/" v-if="crumbs.length">
    <v-breadcrumbs-item v-for="(crumb, i) in crumbs" :key="crumb.name">
      <router-link v-if="i < crumbs.length-1" :to="crumb.path">{{ crumb.name }}</router-link>
      <span class=last v-else>{{ crumb.name }}</span>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: { root: String },
  computed: {
    crumbs: function()
		{
			var path = '', title = (this.root || 'Home');
			var cs = [ { name: title, path: '/'} ]; if(!this.$route) return [];
			var r = (this.$route.path                        ).split('/');
			var m = (this.$route.matched[0].meta.crumbs || '').split('/');
			for(var i = 1; i < r.length; i++) {
				var name = (m[i] || r[i]); if(r[i] == '') continue;
				title += ' : '+ name;
				path  += '/'  + name;
				cs.push({ name: name, path: path });
			}

			window.document.title = title;

			return cs;
		}
  }

}
</script>

<style>
  .breadcrumbs a {
    text-decoration: none;
  }
</style>
