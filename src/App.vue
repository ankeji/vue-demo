<!--
 * @Descripttion:
 * @version:
 * @Author: ankeji
 * @Date: 2020-07-06 17:57:44
 * @LastEditors: ankeji
 * @LastEditTime: 2020-10-21 13:45:01
-->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>

  export default {
    name: 'app',
    watch: {},
    created() {
      console.log(this.$util.log.capsule(123,'安科吉','danger'));
    },
    methods: {}
  }
</script>
<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
}
</style>
