<script setup lang="ts">
import { ref } from 'vue'
import Label from '@/shared/ui/atoms/Label/Label.vue'
import Input from '@/shared/ui/atoms/Input/Input.vue'

interface Props {
  id: string
  label: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const value = ref('')
</script>

<template>
  <div class="pg-form-field">
    <Label :for-id="props.id">{{ props.label }}</Label>
    <Input :id="props.id" v-model="value" :placeholder="props.placeholder" />
  </div>
</template>

<style scoped>
.pg-form-field {
  display: grid;
  gap: 6px;
  width: 100%;
}
</style>
