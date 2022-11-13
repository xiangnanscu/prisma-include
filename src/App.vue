<script setup>
import { computed } from 'vue';
import MainPage from './components/MainPage.vue'
import packages from '../package.json'

const githubRepoUrl = computed(() => {
  let matched = packages.name.match(/@(\w+)\/(\w+)/)
  if (matched) {
    return `https://github.com/${matched[1]}/${matched[2]}.git`
  } else {
    return `https://github.com/xiangnanscu/${packages.name}.git`
  }
})
const npmUrl = `https://www.npmjs.com/package/${packages.name}`
</script>

<template>
  <h1><a :href="githubRepoUrl">{{ packages.name }}</a>-<a :href="npmUrl">{{packages.version}}</a></h1>
  <MainPage msg="Validator" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
