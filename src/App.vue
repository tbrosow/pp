<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<b-alert show> Hello {{ msg }}! </b-alert>-->
      <statistics></statistics>

  </div>
</template>

<script>

import statistics from './components/statistics.vue'
import formBuilder from './components/formBuilder.vue'
import UIEvent from './components/UI-Event.vue'
import listEdit from './components/listEdit.vue'

export default {
  name: 'app',
    components: {
      statistics, formBuilder, UIEvent, listEdit
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}


</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
