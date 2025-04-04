<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'
import { useRoute, useRouter } from 'vue-router'
definePageMeta({layout:"login-form"})

const router = useRouter();

const { form, errors, validate, resetForm } = useForm({
  email: '',
  password: ''
})

const {loginUser} = useFirebaseAuth();

const validationRules = {
  email: { required: true, pattern: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ },
  password: { required: true, minLength: 6 }
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<any>) {
  if (validate(validationRules)) {
    const islogged = await loginUser(event.data.email, event.data.password)
    if (islogged) {
      toast.add({ title: 'Success', description: 'login success', color: 'success' });
      router.push('/');
    } else {
      toast.add({ title: 'Failed', description: `Login failed`, color: 'error' });
    }
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
      <h1 class="text-2xl font-bold mb-6 center">Admin Login</h1>
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
