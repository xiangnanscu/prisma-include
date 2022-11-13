<script setup>
import { ref } from 'vue'
import Validator from '../validator.mjs'

defineProps({
  msg: String
})

const inputValue = ref('511523199901010011')
const errorMsg = ref('')
function validate() {
  try {
    Validator.sfzh(inputValue.value)
    errorMsg.value = "test passed"
  } catch (error) {
    errorMsg.value = error.message
  }
}
function onInput(event) {
  inputValue.value = event.target.value
}
</script>

<template>
  <input :value="inputValue" @input="onInput" />
  <button type="button" @click="validate">validate</button>
  <span v-if="errorMsg">{{ errorMsg }}</span>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
