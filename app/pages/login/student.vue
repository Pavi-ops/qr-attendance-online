<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
definePageMeta({layout:"login-form"})

const { form, errors, validate, resetForm } = useForm({
  email: '',
  password: ''
})

const validationRules = {
  email: { required: true, pattern: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ },
  password: { required: true, minLength: 6 }
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<any>) {
  if (validate(validationRules)) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
  }
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<template>
  <UCard style="padding-top: 50px; padding-bottom: 50px; width: 30%;">
    <template #header>
      <h1 class="text-2xl font-bold mb-6 center">Student Login</h1>
    </template>
    <UForm :state="form" class="space-y-4" @submit="onSubmit" @error="onError">
      <UFormField label="Email" name="email" :error="errors.email">
        <UInput v-model="form.email" class="w-full" />
      </UFormField>
  
      <UFormField label="Password" name="password" :error="errors.password">
        <UInput v-model="form.password" type="password" class="w-full" />
      </UFormField>
  
      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>
