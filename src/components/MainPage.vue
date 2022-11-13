<script setup>
import { ref, computed } from 'vue'
import { prismaInclude } from '../prisma-include.mjs'

defineProps({
  msg: String
})
const source = `
model base {
  id    Int       @id @default(autoincrement())
  ctime DateTime? @default(now()) @db.Timestamptz(0)

  @@index([dwmc])
}

model user {
  ///@include(base)
  name String? @unique @default("") @db.VarChar(10)
}

`
const inputValue = ref(source)
const errorMsg = ref('')
const includeSource = computed(() => {
  try {
    return prismaInclude(inputValue.value)
  } catch (error) {
    return "parse error:" + error.message
  }
})
function onInput(event) {
  inputValue.value = event.target.value
}
</script>

<template>
  <input :value="inputValue" @input="onInput" />
  <div>{{ includeSource }}</div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
